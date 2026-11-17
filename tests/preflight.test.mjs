import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import test from 'node:test';
import { ensureWorkflowIgnore, inspectWorkflowIgnore, workflowIgnoreContract } from '../.agents/skills/design/scripts/preflight.mjs';

function temp(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `agent workflow kit ${name} `));
}

function git(root, ...args) {
  return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', windowsHide: true }).trim();
}

test('non-Git project is safe and unchanged', () => {
  const root = temp('non-git');
  const result = ensureWorkflowIgnore(root);
  assert.equal(result.status, 'non_git');
  assert.equal(result.changed, false);
  assert.deepEqual(fs.readdirSync(root), []);
});

test('a missing project root fails both CLI modes without creating it', () => {
  const root = path.join(temp('missing'), 'absent');
  const script = path.resolve(import.meta.dirname, '../.agents/skills/design/scripts/preflight.mjs');
  for (const mode of ['check', 'ensure']) {
    const result = spawnSync(process.execPath, [script, mode, '--project-root', root], { encoding: 'utf8' });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /ENOENT/);
    assert.equal(fs.existsSync(root), false);
  }
});

test('Git discovery errors are not classified as non-Git projects', () => {
  const root = temp('discovery-error');
  for (const discovery of [
    { status: null, error: new Error('spawn git ENOENT') },
    { status: null, error: new Error('spawn git ETIMEDOUT') },
    { status: 128, stderr: 'fatal: detected dubious ownership in repository' },
    { status: 0, stdout: 'false' },
  ]) {
    assert.throws(() => ensureWorkflowIgnore(root, { runGit: () => discovery }), /Unable to verify a Git working tree/);
  }
  assert.deepEqual(fs.readdirSync(root), []);
});

test('Git discovery failure with an ancestor checkout marker stops ensure', () => {
  const root = temp('broken-discovery');
  git(root, 'init');
  const project = path.join(root, 'project');
  fs.mkdirSync(project);
  const script = path.resolve(import.meta.dirname, '../.agents/skills/design/scripts/preflight.mjs');
  const result = spawnSync(process.execPath, [script, 'ensure', '--project-root', project], {
    encoding: 'utf8', env: { ...process.env, GIT_OBJECT_DIRECTORY: path.join(root, 'missing-objects') },
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Git could not inspect the checkout/);
});

test('check is read-only and ensure is idempotent in path with spaces', () => {
  const root = temp('normal');
  git(root, 'init');
  const exclude = path.resolve(root, git(root, 'rev-parse', '--git-path', 'info/exclude'));
  const before = fs.readFileSync(exclude, 'utf8');
  assert.equal(inspectWorkflowIgnore(root).status, 'not_ignored');
  assert.equal(fs.readFileSync(exclude, 'utf8'), before);
  const first = ensureWorkflowIgnore(root);
  assert.equal(first.changed, true);
  const once = fs.readFileSync(exclude, 'utf8');
  assert.match(once, new RegExp(workflowIgnoreContract.marker));
  assert.equal(ensureWorkflowIgnore(root).changed, false);
  assert.equal(fs.readFileSync(exclude, 'utf8'), once);
});

test('equivalent existing rule is recognized without appending', () => {
  const root = temp('existing');
  git(root, 'init');
  const exclude = path.resolve(root, git(root, 'rev-parse', '--git-path', 'info/exclude'));
  fs.appendFileSync(exclude, '\nworkflow/**\n');
  const before = fs.readFileSync(exclude, 'utf8');
  assert.equal(ensureWorkflowIgnore(root).changed, false);
  assert.equal(fs.readFileSync(exclude, 'utf8'), before);
});

test('linked worktree resolves repository Git metadata through git', () => {
  const main = temp('worktree-main');
  const linked = temp('worktree-linked');
  fs.rmSync(linked, { recursive: true });
  git(main, 'init');
  git(main, 'config', 'user.email', 'test@example.com');
  git(main, 'config', 'user.name', 'Test');
  fs.writeFileSync(path.join(main, 'seed.txt'), 'seed');
  git(main, 'add', 'seed.txt');
  git(main, 'commit', '-m', 'seed');
  execFileSync('git', ['-C', main, 'worktree', 'add', '--detach', linked], { windowsHide: true });
  const result = ensureWorkflowIgnore(linked);
  assert.equal(result.git, true);
  assert.equal(result.ignored, true);
  assert.ok(path.isAbsolute(result.exclude_path));
});

test('write failure is fail-closed and does not create workflow records', () => {
  const root = temp('failure');
  git(root, 'init');
  const failingFs = {
    ...fs,
    appendFileSync() { throw new Error('read only'); },
  };
  assert.throws(() => ensureWorkflowIgnore(root, { fs: failingFs }), /read only/);
  assert.equal(fs.existsSync(path.join(root, 'workflow')), false);
  assert.equal(inspectWorkflowIgnore(root).ignored, false);
});

test('Git metadata resolution failure is explicit', () => {
  const runGit = (_root, args) => {
    if (args[0] === 'rev-parse' && args[1] === '--is-inside-work-tree') return { status: 0, stdout: 'true\n', stderr: '' };
    return { status: 128, stdout: '', stderr: 'malformed git metadata' };
  };
  assert.throws(() => inspectWorkflowIgnore(temp('malformed'), { runGit }), /malformed git metadata/);
});
