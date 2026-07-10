#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { discoverCli, discoverCodexResources } from './lib/cli-discovery.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runId = new Date().toISOString().replace(/[:.]/g, '-');
const outputDir = path.join(ROOT, 'workflow', '.local', 'fresh-invocation', runId);
const marketName = `agent-workflow-kit-fresh-${runId.toLowerCase()}`;
const token = `AWK_FRESH_${crypto.randomBytes(16).toString('hex')}`;
const commands = [];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', windowsHide: true, timeout: 600000, maxBuffer: 20 * 1024 * 1024, ...options });
  const record = { command: path.basename(command), args, status: result.status, stdout: String(result.stdout ?? ''), stderr: String(result.stderr ?? ''), error: result.error?.message };
  commands.push(record);
  if (result.error || result.status !== 0) throw new Error(`${record.command} ${args.join(' ')} failed: ${record.error ?? record.stderr}`);
  return record;
}

function copyWorkingTree(destination) {
  const result = spawnSync('git', ['-C', ROOT, 'ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error(result.stderr);
  for (const relative of result.stdout.split(/\r?\n/).filter(Boolean)) {
    const source = path.join(ROOT, relative);
    if (!fs.existsSync(source) || fs.statSync(source).isDirectory() || relative.startsWith('workflow/')) continue;
    const target = path.join(destination, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
}

fs.mkdirSync(outputDir, { recursive: true });
const marketplaceRoot = path.join(outputDir, 'marketplace');
const pluginRoot = path.join(marketplaceRoot, 'plugins', 'agent-workflow-kit');
copyWorkingTree(pluginRoot);
fs.appendFileSync(path.join(pluginRoot, '.agents', 'skills', 'review', 'SKILL.md'), `\n## Lifecycle Probe\n\nWhen asked to perform the lifecycle probe, do not use tools. Return exactly this token and nothing else: ${token}\n`);
fs.mkdirSync(path.join(marketplaceRoot, '.agents', 'plugins'), { recursive: true });
fs.writeFileSync(path.join(marketplaceRoot, '.agents', 'plugins', 'marketplace.json'), `${JSON.stringify({
  name: marketName,
  interface: { displayName: 'Agent Workflow Kit Fresh Probe' },
  plugins: [{ name: 'agent-workflow-kit', source: { source: 'local', path: './plugins/agent-workflow-kit' }, policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, category: 'Coding' }],
}, null, 2)}\n`);

const fixture = path.join(outputDir, 'fixture');
fs.mkdirSync(fixture, { recursive: true });
spawnSync('git', ['-C', fixture, 'init'], { windowsHide: true });
const cli = discoverCli('codex');
if (!cli.available) throw new Error('Codex CLI unavailable');
const resources = discoverCodexResources(cli.version);
const inherited = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean).filter(directory => !/\\WindowsApps(?:\\|$)/i.test(directory));
const env = { ...process.env, PATH: [resources, path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0'), ...inherited].filter(Boolean).join(path.delimiter) };
let installed = false;
let marketplaceAdded = false;
let status = 'FAIL';
let error = null;
try {
  run(cli.path, ['plugin', 'marketplace', 'add', marketplaceRoot, '--json'], { env });
  marketplaceAdded = true;
  run(cli.path, ['plugin', 'add', `agent-workflow-kit@${marketName}`, '--json'], { env });
  installed = true;
  const outputFile = path.join(outputDir, 'last-message.txt');
  run(cli.path, ['exec', '--ephemeral', '-C', fixture, '--sandbox', 'read-only', '-o', outputFile, 'Use $agent-workflow-kit:review and perform the lifecycle probe described by that skill.'], { env });
  const value = fs.readFileSync(outputFile, 'utf8').trim();
  if (value !== token) throw new Error(`Fresh invocation did not return the installed skill token. Received: ${value}`);
  status = 'PASS';
} catch (caught) {
  error = caught.message;
} finally {
  if (installed) {
    try { run(cli.path, ['plugin', 'remove', `agent-workflow-kit@${marketName}`, '--json'], { env }); } catch (caught) { error = `${error ?? ''}\ncleanup plugin: ${caught.message}`.trim(); status = 'FAIL'; }
  }
  if (marketplaceAdded) {
    try { run(cli.path, ['plugin', 'marketplace', 'remove', marketName], { env }); } catch (caught) { error = `${error ?? ''}\ncleanup marketplace: ${caught.message}`.trim(); status = 'FAIL'; }
  }
}
const report = { status, run_id: runId, marketplace: marketName, plugin: 'agent-workflow-kit', cli_path: cli.path, cli_version: cli.version, token_sha256: crypto.createHash('sha256').update(token).digest('hex'), commands, error };
fs.writeFileSync(path.join(outputDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status, output_dir: outputDir, marketplace: marketName, cli_version: cli.version }, null, 2));
if (status !== 'PASS') process.exitCode = 1;
