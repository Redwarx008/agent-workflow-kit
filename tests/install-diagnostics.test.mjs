import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { diagnoseInstallations, hashTree } from '../scripts/lib/install-diagnostics.mjs';

const REPO = path.resolve(import.meta.dirname, '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(REPO, 'package.json'), 'utf8')).version;

function temp(name) { return fs.mkdtempSync(path.join(os.tmpdir(), `awk-diagnostics-${name}-`)); }

function nativeInstall(home, platform, version) {
  const root = path.join(home, 'plugins', 'cache', 'market', 'agent-workflow-kit', version);
  const manifestDir = path.join(root, platform === 'codex' ? '.codex-plugin' : '.claude-plugin');
  fs.mkdirSync(path.join(root, '.agents', 'skills', 'design'), { recursive: true });
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(path.join(manifestDir, 'plugin.json'), JSON.stringify({ name: 'agent-workflow-kit', version }));
  fs.writeFileSync(path.join(root, '.agents', 'skills', 'design', 'SKILL.md'), '---\nname: design\ndescription: x\n---\n');
  return root;
}

function diagnose(project, codexHome, claudeHome, known = { revision: 'test', paths: {} }) {
  return diagnoseInstallations({ repoRoot: REPO, projectRoot: project, codexHome, claudeHome, known });
}

test('clean native install and stale version are distinguished', () => {
  const project = temp('project'); const codex = temp('codex'); const claude = temp('claude');
  nativeInstall(codex, 'codex', VERSION);
  assert.equal(diagnose(project, codex, claude).status, 'clean_native');
  const staleHome = temp('stale'); nativeInstall(staleHome, 'codex', '0.0.9');
  assert.equal(diagnose(project, staleHome, claude).status, 'stale_native');
});

test('known, modified, unknown, and malformed legacy ownership are classified', () => {
  const project = temp('legacy'); const codex = temp('codex'); const claude = temp('claude');
  const knownRoot = path.join(project, '.agents', 'skills', 'workflow-design');
  fs.mkdirSync(knownRoot, { recursive: true }); fs.writeFileSync(path.join(knownRoot, 'SKILL.md'), 'known');
  const knownHash = hashTree(knownRoot);
  let result = diagnose(project, codex, claude, { revision: 'x', paths: { '.agents/skills/workflow-design': knownHash } });
  assert.equal(result.legacy[0].status, 'known_release');
  fs.appendFileSync(path.join(knownRoot, 'SKILL.md'), ' modified');
  result = diagnose(project, codex, claude, { revision: 'x', paths: { '.agents/skills/workflow-design': knownHash } });
  assert.equal(result.legacy[0].status, 'modified');
  const unknown = path.join(project, '.agents', 'skills', 'workflow-custom');
  fs.mkdirSync(unknown, { recursive: true }); fs.writeFileSync(path.join(unknown, 'SKILL.md'), 'unknown');
  const malformed = path.join(project, '.claude', 'skills', 'workflow-act');
  fs.mkdirSync(path.join(malformed, 'node_modules'), { recursive: true });
  result = diagnose(project, codex, claude, { revision: 'x', paths: { '.agents/skills/workflow-design': knownHash, '.claude/skills/workflow-act': 'expected' } });
  assert.ok(result.legacy.some(item => item.status === 'unknown_ownership'));
  assert.ok(result.legacy.some(item => item.status === 'malformed'));
});

test('native plus legacy reports duplicate loading risk and ownership risk', () => {
  const project = temp('coexist'); const codex = temp('codex'); const claude = temp('claude');
  nativeInstall(codex, 'codex', VERSION);
  const legacy = path.join(project, '.agents', 'skills', 'workflow-plan');
  fs.mkdirSync(legacy, { recursive: true }); fs.writeFileSync(path.join(legacy, 'SKILL.md'), 'user change');
  const result = diagnose(project, codex, claude, { revision: 'x', paths: { '.agents/skills/workflow-plan': 'not-a-match' } });
  assert.equal(result.duplicate_loading_risk, true);
  assert.equal(result.ownership_risk, true);
  assert.equal(result.status, 'coexisting_with_ownership_risk');
});

test('symlink path and target affect fingerprint without following target content', t => {
  const root = temp('symlink-root');
  const outside = path.join(temp('symlink-outside'), 'outside.txt');
  fs.writeFileSync(path.join(root, 'SKILL.md'), 'base');
  fs.writeFileSync(outside, 'one');
  const before = hashTree(root);
  try { fs.symlinkSync(outside, path.join(root, 'linked.txt'), 'file'); }
  catch (error) { t.skip(`symlink unavailable: ${error.code}`); return; }
  const linked = hashTree(root);
  assert.notEqual(linked, before);
  fs.writeFileSync(outside, 'two');
  assert.equal(hashTree(root), linked);
});

test('bundled known-legacy ledger matches its declared Git revision', () => {
  const ledger = JSON.parse(fs.readFileSync(path.join(REPO, 'diagnostics', 'known-legacy.json'), 'utf8'));
  for (const [legacyPath, expected] of Object.entries(ledger.paths)) {
    const destination = temp(`ledger-${path.basename(legacyPath)}`);
    const files = execFileSync('git', ['-C', REPO, 'ls-tree', '-r', '--name-only', ledger.revision, legacyPath], { encoding: 'utf8', windowsHide: true }).split(/\r?\n/).filter(Boolean);
    for (const file of files) {
      const relative = file.slice(legacyPath.length + 1);
      const target = path.join(destination, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, execFileSync('git', ['-C', REPO, 'show', `${ledger.revision}:${file}`], { windowsHide: true }));
    }
    assert.equal(hashTree(destination), expected, legacyPath);
  }
});

test('repository-declared CRLF checkout is the same known text release', () => {
  const root = temp('eol');
  const file = path.join(root, 'script.ps1');
  fs.writeFileSync(file, 'line one\nline two\n');
  const lf = hashTree(root);
  fs.writeFileSync(file, 'line one\r\nline two\r\n');
  assert.equal(hashTree(root), lf);
  fs.writeFileSync(file, Buffer.from([0, 10]));
  const binaryLf = hashTree(root);
  fs.writeFileSync(file, Buffer.from([0, 13, 10]));
  assert.notEqual(hashTree(root), binaryLf);
});
