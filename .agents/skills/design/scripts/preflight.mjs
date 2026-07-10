#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const MARKER = '# agent-workflow-kit: local workflow records';
const RULE = '/workflow/';
const PROBE = 'workflow/.agent-workflow-kit-probe';

function defaultRunGit(projectRoot, args) {
  return spawnSync('git', ['-C', projectRoot, ...args], {
    encoding: 'utf8',
    timeout: 5000,
    windowsHide: true,
  });
}

function gitResult(runGit, projectRoot, args) {
  const result = runGit(projectRoot, args);
  return {
    status: result.status,
    stdout: String(result.stdout ?? '').trim(),
    stderr: String(result.stderr ?? '').trim(),
    error: result.error,
  };
}

export function inspectWorkflowIgnore(projectRoot, options = {}) {
  const runGit = options.runGit ?? defaultRunGit;
  const resolvedRoot = path.resolve(projectRoot);
  const inside = gitResult(runGit, resolvedRoot, ['rev-parse', '--is-inside-work-tree']);
  if (inside.error || inside.status !== 0 || inside.stdout !== 'true') {
    return {
      ok: true,
      git: false,
      ignored: null,
      status: 'non_git',
      project_root: resolvedRoot,
      message: 'Project is not a Git work tree; no Git ignore state is required.',
    };
  }

  const gitPath = gitResult(runGit, resolvedRoot, ['rev-parse', '--git-path', 'info/exclude']);
  if (gitPath.error || gitPath.status !== 0 || !gitPath.stdout) {
    throw new Error(`Unable to resolve repo-local info/exclude: ${gitPath.stderr || gitPath.error?.message || 'empty path'}`);
  }
  const excludePath = path.isAbsolute(gitPath.stdout)
    ? path.normalize(gitPath.stdout)
    : path.resolve(resolvedRoot, gitPath.stdout);

  const ignored = gitResult(runGit, resolvedRoot, ['check-ignore', '--no-index', '-q', PROBE]);
  if (ignored.error || ![0, 1].includes(ignored.status)) {
    throw new Error(`Unable to inspect workflow ignore state: ${ignored.stderr || ignored.error?.message || `exit ${ignored.status}`}`);
  }

  return {
    ok: ignored.status === 0,
    git: true,
    ignored: ignored.status === 0,
    status: ignored.status === 0 ? 'ignored' : 'not_ignored',
    project_root: resolvedRoot,
    exclude_path: excludePath,
    probe: PROBE,
    message: ignored.status === 0
      ? 'workflow/ is ignored by repository-local Git rules.'
      : 'workflow/ is not ignored by repository-local Git rules.',
  };
}

export function ensureWorkflowIgnore(projectRoot, options = {}) {
  const io = options.fs ?? fs;
  const before = inspectWorkflowIgnore(projectRoot, options);
  if (!before.git || before.ignored) return { ...before, changed: false };

  const excludeDir = path.dirname(before.exclude_path);
  let current = '';
  try {
    current = io.existsSync(before.exclude_path)
      ? io.readFileSync(before.exclude_path, 'utf8')
      : '';
    io.mkdirSync(excludeDir, { recursive: true });
    const prefix = current.length === 0 || /\r?\n$/.test(current) ? '' : '\n';
    io.appendFileSync(before.exclude_path, `${prefix}${MARKER}\n${RULE}\n`, 'utf8');
  } catch (error) {
    throw new Error(`Unable to ensure repo-local workflow ignore at ${before.exclude_path}: ${error.message}`);
  }

  const after = inspectWorkflowIgnore(projectRoot, options);
  if (!after.ignored) {
    throw new Error(`Repo-local ignore update did not make ${PROBE} ignored.`);
  }
  return { ...after, changed: true };
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  let projectRoot = process.cwd();
  let json = false;
  for (let index = 0; index < rest.length; index += 1) {
    if (rest[index] === '--project-root') projectRoot = rest[++index];
    else if (rest[index] === '--json') json = true;
    else throw new Error(`Unknown argument: ${rest[index]}`);
  }
  if (!['check', 'ensure'].includes(command)) {
    throw new Error('Usage: preflight.mjs <check|ensure> [--project-root <path>] [--json]');
  }
  return { command, projectRoot, json };
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = args.command === 'ensure'
      ? ensureWorkflowIgnore(args.projectRoot)
      : inspectWorkflowIgnore(args.projectRoot);
    if (args.json) console.log(JSON.stringify(result, null, 2));
    else console.log(`${result.status}: ${result.message}${result.changed ? ' Added /workflow/ to repo-local info/exclude.' : ''}`);
    if (args.command === 'check' && result.git && !result.ignored) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();

export const workflowIgnoreContract = { marker: MARKER, rule: RULE, probe: PROBE };
