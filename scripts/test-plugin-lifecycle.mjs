#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { discoverCli } from './lib/cli-discovery.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-');
const OUTPUT = path.join(ROOT, 'workflow', '.local', 'lifecycle', RUN_ID);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8', windowsHide: true, timeout: 120000,
    shell: process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(command),
    ...options,
  });
  const record = { command: path.basename(command), args, cwd: options.cwd, status: result.status, stdout: String(result.stdout ?? ''), stderr: String(result.stderr ?? ''), error: result.error?.message };
  if (result.error || result.status !== 0) throw Object.assign(new Error(`${record.command} ${args.join(' ')} failed: ${record.error ?? record.stderr}`), { record });
  return record;
}

function copyWorkingTree(destination) {
  const listing = run('git', ['-C', ROOT, 'ls-files', '--cached', '--others', '--exclude-standard']).stdout.split(/\r?\n/).filter(Boolean);
  for (const relative of listing) {
    const source = path.join(ROOT, relative);
    if (!fs.existsSync(source) || fs.statSync(source).isDirectory() || relative.startsWith('workflow/')) continue;
    const target = path.join(destination, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
}

function bumpVersion(pluginRoot, version) {
  for (const relative of ['.codex-plugin/plugin.json', '.claude-plugin/plugin.json']) {
    const file = path.join(pluginRoot, relative);
    const value = JSON.parse(fs.readFileSync(file, 'utf8'));
    value.version = version;
    fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  }
  const marketplace = path.join(pluginRoot, '.claude-plugin', 'marketplace.json');
  const value = JSON.parse(fs.readFileSync(marketplace, 'utf8'));
  value.version = version;
  value.plugins[0].version = version;
  fs.writeFileSync(marketplace, `${JSON.stringify(value, null, 2)}\n`);
}

function skillInventory(root) {
  const values = [];
  function visit(directory) {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.name === 'SKILL.md') {
        const match = /^name:\s*([^\r\n]+)$/m.exec(fs.readFileSync(target, 'utf8'));
        if (match) values.push(match[1].trim());
      }
    }
  }
  visit(root);
  return [...new Set(values)].sort();
}

function assertInventory(root, label) {
  const inventory = skillInventory(root);
  for (const name of ['act', 'design', 'plan', 'review']) {
    if (!inventory.includes(name)) throw new Error(`${label} cache missing skill ${name}: ${inventory.join(', ')}`);
  }
  return inventory;
}

function main() {
  fs.mkdirSync(OUTPUT, { recursive: true });
  const pluginCopy = path.join(OUTPUT, 'plugin-source');
  copyWorkingTree(pluginCopy);
  const report = { run_id: RUN_ID, output_dir: OUTPUT, codex: {}, claude: {}, commands: [] };

  const codex = discoverCli('codex');
  if (!codex.available) throw new Error('Codex CLI unavailable');
  const codexHome = path.join(OUTPUT, 'codex-home');
  fs.mkdirSync(codexHome, { recursive: true });
  const codexMarket = path.join(OUTPUT, 'codex-marketplace');
  const codexPlugin = path.join(codexMarket, 'plugins', 'agent-workflow-kit');
  fs.mkdirSync(path.dirname(codexPlugin), { recursive: true });
  fs.cpSync(pluginCopy, codexPlugin, { recursive: true });
  fs.mkdirSync(path.join(codexMarket, '.agents', 'plugins'), { recursive: true });
  const codexMarketplace = {
    name: 'agent-workflow-kit-lifecycle', interface: { displayName: 'Agent Workflow Kit Lifecycle' }, plugins: [{
      name: 'agent-workflow-kit', source: { source: 'local', path: './plugins/agent-workflow-kit' },
      policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, category: 'Coding',
    }],
  };
  fs.writeFileSync(path.join(codexMarket, '.agents', 'plugins', 'marketplace.json'), `${JSON.stringify(codexMarketplace, null, 2)}\n`);
  const codexEnv = { ...process.env, CODEX_HOME: codexHome };
  report.commands.push(run(codex.path, ['plugin', 'marketplace', 'add', codexMarket, '--json'], { env: codexEnv }));
  report.commands.push(run(codex.path, ['plugin', 'list', '--available', '--json'], { env: codexEnv }));
  report.commands.push(run(codex.path, ['plugin', 'add', 'agent-workflow-kit@agent-workflow-kit-lifecycle', '--json'], { env: codexEnv }));
  report.codex.inventory_0_1_0 = assertInventory(codexHome, 'Codex');
  bumpVersion(codexPlugin, '0.1.1');
  report.commands.push(run(codex.path, ['plugin', 'remove', 'agent-workflow-kit@agent-workflow-kit-lifecycle', '--json'], { env: codexEnv }));
  report.commands.push(run(codex.path, ['plugin', 'add', 'agent-workflow-kit@agent-workflow-kit-lifecycle', '--json'], { env: codexEnv }));
  report.codex.inventory_0_1_1 = assertInventory(codexHome, 'Codex upgraded');
  report.commands.push(run(codex.path, ['plugin', 'remove', 'agent-workflow-kit@agent-workflow-kit-lifecycle', '--json'], { env: codexEnv }));
  report.commands.push(run(codex.path, ['plugin', 'marketplace', 'remove', 'agent-workflow-kit-lifecycle'], { env: codexEnv }));

  const claude = discoverCli('claude');
  if (!claude.available) throw new Error('Claude CLI unavailable');
  const claudeHome = path.join(OUTPUT, 'claude-home');
  const claudeProject = path.join(OUTPUT, 'claude-project');
  fs.mkdirSync(claudeProject, { recursive: true });
  run('git', ['-C', claudeProject, 'init']);
  const claudeEnv = { ...process.env, CLAUDE_CONFIG_DIR: claudeHome };
  report.commands.push(run(claude.path, ['plugin', 'marketplace', 'add', pluginCopy, '--scope', 'local'], { cwd: claudeProject, env: claudeEnv }));
  report.commands.push(run(claude.path, ['plugin', 'install', 'agent-workflow-kit@agent-workflow-kit', '--scope', 'local'], { cwd: claudeProject, env: claudeEnv }));
  report.commands.push(run(claude.path, ['plugin', 'list', '--json'], { cwd: claudeProject, env: claudeEnv }));
  report.claude.inventory_0_1_0 = assertInventory(claudeHome, 'Claude');
  bumpVersion(pluginCopy, '0.1.1');
  report.commands.push(run(claude.path, ['plugin', 'marketplace', 'update', 'agent-workflow-kit'], { cwd: claudeProject, env: claudeEnv }));
  report.commands.push(run(claude.path, ['plugin', 'update', 'agent-workflow-kit@agent-workflow-kit', '--scope', 'local'], { cwd: claudeProject, env: claudeEnv }));
  report.claude.inventory_0_1_1 = assertInventory(claudeHome, 'Claude upgraded');
  report.commands.push(run(claude.path, ['plugin', 'uninstall', 'agent-workflow-kit@agent-workflow-kit', '--scope', 'local'], { cwd: claudeProject, env: claudeEnv }));
  report.commands.push(run(claude.path, ['plugin', 'marketplace', 'remove', 'agent-workflow-kit'], { cwd: claudeProject, env: claudeEnv }));

  fs.writeFileSync(path.join(OUTPUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ status: 'PASS', output_dir: OUTPUT, codex: report.codex, claude: report.claude }, null, 2));
}

try { main(); } catch (error) {
  fs.mkdirSync(OUTPUT, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT, 'failure.json'), JSON.stringify({ error: error.message, record: error.record }, null, 2));
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
}
