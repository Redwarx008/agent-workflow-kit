#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { discoverCli, discoverCodexResources } from './lib/cli-discovery.mjs';
import { extractSkillRevision, loadCases, materializeFixture } from './lib/eval-contract.mjs';
import { gradeCase, summarizeVerdict } from './lib/eval-grader.mjs';
import { parseResolvedModel } from './lib/model-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CASES_DIR = path.join(ROOT, 'evals', 'cases');
const SCHEMA = path.join(ROOT, 'evals', 'output.schema.json');

function parse(argv) {
  const result = { command: argv[0] ?? 'validate', runner: 'all', baseline: 'aff019f', caseId: 'all' };
  for (let index = 1; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--runner') result.runner = argv[++index];
    else if (key === '--baseline') result.baseline = argv[++index];
    else if (key === '--case') result.caseId = argv[++index];
    else if (key === '--model') result.model = argv[++index];
    else if (key === '--output-dir') result.outputDir = path.resolve(argv[++index]);
    else throw new Error(`Unknown argument: ${key}`);
  }
  return result;
}

function promptFor(caseValue, skillPath) {
  return [
    `Read and follow the complete skill at: ${path.join(skillPath, 'SKILL.md')}`,
    'Resolve its relative references from that skill directory. Treat it as the workflow authority for this task.',
    `Evaluation case ID: ${caseValue.id}. Return the final response using the required JSON schema.`,
    '',
    caseValue.prompt,
  ].join('\n');
}

function hashTree(root) {
  const hash = crypto.createHash('sha256');
  const files = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else files.push(target);
    }
  }
  visit(root);
  for (const file of files.sort()) {
    hash.update(path.relative(root, file).replaceAll('\\', '/'));
    hash.update('\0');
    hash.update(fs.readFileSync(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

export function buildRunnerArgs(runner, { cwd, schema, outputFile, model, skillDir }) {
  if (runner === 'claude') {
    const args = ['--print', '--no-session-persistence', '--output-format', 'json', '--json-schema', fs.readFileSync(schema, 'utf8'), '--permission-mode', 'acceptEdits'];
    if (skillDir) args.push('--add-dir', skillDir);
    if (model) args.push('--model', model);
    return args;
  }
  const args = ['exec', '--ephemeral', '--json', '--output-schema', schema, '-o', outputFile, '-C', cwd, '--sandbox', 'workspace-write'];
  if (skillDir) args.push('--add-dir', skillDir);
  if (model) args.push('--model', model);
  args.push('-');
  return args;
}

export function parseRunnerOutput(runner, stdout, outputFile) {
  if (runner === 'codex') return JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  const envelope = JSON.parse(stdout);
  if (envelope.structured_output) return envelope.structured_output;
  if (typeof envelope.result === 'string') return JSON.parse(envelope.result);
  if (envelope.result && typeof envelope.result === 'object') return envelope.result;
  throw new Error('Claude output does not contain structured_output or result');
}

export function executeProcess(command, args, options = {}) {
  const result = spawnSync(command, args, options);
  if (result.error?.code === 'ETIMEDOUT') return { ...result, classification: 'timeout' };
  if (result.error || result.status !== 0) return { ...result, classification: 'failed' };
  return { ...result, classification: 'completed' };
}

function runOne({ runner, cli, caseValue, arm, rep, skillPath, runDir, model, timeoutMs = 600000 }) {
  const fixture = path.join(runDir, 'fixture');
  materializeFixture(caseValue, fixture);
  const isolatedSkill = path.join(runDir, 'skill-package');
  fs.cpSync(skillPath, isolatedSkill, { recursive: true });
  const outputFile = path.join(runDir, 'last-message.json');
  const prompt = promptFor(caseValue, isolatedSkill);
  fs.writeFileSync(path.join(runDir, 'prompt.txt'), prompt, 'utf8');
  const args = buildRunnerArgs(runner, { cwd: fixture, schema: SCHEMA, outputFile, model, skillDir: isolatedSkill });
  const started = new Date().toISOString();
  const codexResources = runner === 'codex' ? discoverCodexResources(cli.version) : null;
  let childEnv = process.env;
  if (codexResources) {
    const inherited = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean);
    const safePath = process.platform === 'win32'
      ? inherited.filter(directory => !/\\WindowsApps(?:\\|$)/i.test(directory))
      : inherited;
    if (process.platform === 'win32') safePath.unshift(path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0'));
    safePath.unshift(codexResources);
    childEnv = { ...process.env, PATH: [...new Set(safePath)].join(path.delimiter) };
  }
  const result = executeProcess(cli.path, args, {
    cwd: fixture, encoding: 'utf8', timeout: timeoutMs, windowsHide: true,
    shell: process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(cli.path),
    maxBuffer: 20 * 1024 * 1024,
    input: prompt,
    env: childEnv,
  });
  fs.writeFileSync(path.join(runDir, 'stdout.log'), String(result.stdout ?? ''), 'utf8');
  fs.writeFileSync(path.join(runDir, 'stderr.log'), String(result.stderr ?? ''), 'utf8');
  const record = { runner, case_id: caseValue.id, arm, rep, started, finished: new Date().toISOString(), cli_path: cli.path, cli_version: cli.version, codex_resources: codexResources, requested_model: model ?? null, resolved_model: parseResolvedModel(String(result.stdout ?? ''), String(result.stderr ?? '')), skill_source_path: skillPath, skill_eval_path: isolatedSkill, skill_sha256: hashTree(isolatedSkill) };
  if (result.classification !== 'completed') {
    return { ...record, status: result.classification, exit_code: result.status, error: result.error?.message ?? String(result.stderr ?? '').trim() };
  }
  try {
    const output = parseRunnerOutput(runner, String(result.stdout ?? ''), outputFile);
    const grade = gradeCase(caseValue, fixture, output);
    return { ...record, status: 'completed', output, grade };
  } catch (error) {
    return { ...record, status: 'malformed', error: error.message };
  }
}

function runBatch(args, cases) {
  const runners = args.runner === 'all' ? ['claude', 'codex'] : [args.runner];
  if (runners.some(value => !['claude', 'codex'].includes(value))) throw new Error('runner must be claude, codex, or all');
  const selected = args.caseId === 'all' ? cases : cases.filter(value => value.id === args.caseId);
  if (!selected.length) throw new Error(`Unknown case: ${args.caseId}`);
  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = args.outputDir ?? path.join(ROOT, 'workflow', '.local', 'evals', runId);
  if (fs.existsSync(outputDir)) throw new Error(`Output directory already exists: ${outputDir}`);
  fs.mkdirSync(outputDir, { recursive: true });
  const baselineRoot = path.join(outputDir, 'baseline');
  const baselineSkills = new Map();
  for (const caseValue of selected.filter(value => value.mode === 'paired')) {
    const destination = path.join(baselineRoot, caseValue.baseline_skill);
    if (!baselineSkills.has(caseValue.baseline_skill)) baselineSkills.set(caseValue.baseline_skill, extractSkillRevision(ROOT, args.baseline, caseValue.baseline_skill, destination));
  }
  const results = [];
  const cliInventory = {};
  let aborted = null;
  runnerLoop: for (const runner of runners) {
    const cli = discoverCli(runner);
    cliInventory[runner] = cli;
    if (!cli.available) {
      results.push({ runner, case_id: selected[0].id, arm: 'new', rep: 1, status: 'unavailable', error: 'runner unavailable' });
      aborted = `${runner} runner unavailable`;
      break;
    }
    for (const caseValue of selected) {
      const arms = caseValue.mode === 'paired' ? ['old', 'new'] : ['new'];
      for (const arm of arms) {
        for (let rep = 1; rep <= caseValue.repetitions; rep += 1) {
          const skillPath = arm === 'old'
            ? baselineSkills.get(caseValue.baseline_skill)
            : path.join(ROOT, '.agents', 'skills', caseValue.skill);
          const oneDir = path.join(outputDir, 'runs', runner, caseValue.id, arm, String(rep));
          fs.mkdirSync(oneDir, { recursive: true });
          const record = runOne({ runner, cli, caseValue, arm, rep, skillPath, runDir: oneDir, model: args.model });
          results.push(record);
          fs.writeFileSync(path.join(oneDir, 'result.json'), JSON.stringify(record, null, 2), 'utf8');
          if (record.status !== 'completed') {
            aborted = `${runner}/${caseValue.id}/${arm}/${rep}: ${record.status}`;
            break runnerLoop;
          }
          if (arm === 'new' && !record.grade.passed) {
            aborted = `${runner}/${caseValue.id}/${arm}/${rep}: grader failed`;
            break runnerLoop;
          }
        }
      }
    }
  }
  const casesReport = selected.map(caseValue => {
    const relevant = results.filter(value => value.case_id === caseValue.id);
    return {
      id: caseValue.id,
      per_runner: Object.fromEntries(runners.map(runner => [runner, summarizeVerdict({ mode: caseValue.mode, arms: relevant.filter(value => value.runner === runner) })])),
    };
  });
  const report = { run_id: runId, baseline: args.baseline, requested_model: args.model ?? null, aborted, cli_inventory: cliInventory, cases: casesReport, results };
  fs.writeFileSync(path.join(outputDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify({ output_dir: outputDir, cases: casesReport }, null, 2));
  if (aborted) throw new Error(`Eval batch stopped: ${aborted}. Partial report: ${path.join(outputDir, 'report.json')}`);
  return report;
}

function main() {
try {
  const args = parse(process.argv.slice(2));
  const cases = loadCases(CASES_DIR);
  if (args.command === 'validate') console.log(`Validated ${cases.length} eval cases.`);
  else if (args.command === 'run') runBatch(args, cases);
  else throw new Error('Usage: eval.mjs <validate|run> [--runner all|claude|codex] [--case id|all] [--baseline rev] [--model name]');
} catch (error) {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
}
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
