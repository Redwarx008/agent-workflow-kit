import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildRunnerArgs, executeProcess, parseRunnerOutput } from '../scripts/eval.mjs';
import { parseResolvedModel } from '../scripts/lib/model-provenance.mjs';

test('runner arguments enforce fresh structured sessions', () => {
  const claude = buildRunnerArgs('claude', { prompt: 'p', cwd: 'c', schema: 'evals/output.schema.json', outputFile: 'o' });
  assert.ok(claude.includes('--no-session-persistence'));
  assert.ok(claude.includes('--json-schema'));
  const codex = buildRunnerArgs('codex', { prompt: 'p', cwd: 'c', schema: 's', outputFile: 'o' });
  assert.ok(codex.includes('--ephemeral'));
  assert.ok(codex.includes('--output-schema'));
  assert.equal(codex.at(-1), '-');
});

test('Claude structured envelope and Codex output file parse identically', () => {
  const value = { case_id: 'x' };
  assert.deepEqual(parseRunnerOutput('claude', JSON.stringify({ structured_output: value }), ''), value);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-eval-'));
  const file = path.join(dir, 'last.json');
  fs.writeFileSync(file, JSON.stringify(value));
  assert.deepEqual(parseRunnerOutput('codex', '', file), value);
});

test('malformed structured output is rejected', () => {
  assert.throws(() => parseRunnerOutput('claude', '{bad', ''), /JSON/);
});

test('fake CLI nonzero and timeout are classified without fallback', () => {
  const nonzero = executeProcess(process.execPath, ['-e', 'process.exit(7)'], { encoding: 'utf8', windowsHide: true });
  assert.equal(nonzero.classification, 'failed');
  const timeout = executeProcess(process.execPath, ['-e', 'setTimeout(() => {}, 1000)'], { encoding: 'utf8', timeout: 50, windowsHide: true });
  assert.equal(timeout.classification, 'timeout');
});

test('resolved model is recovered from Codex stderr and Claude JSON', () => {
  assert.equal(parseResolvedModel('', 'runner info model=gpt-5.6-sol provider=openai'), 'gpt-5.6-sol');
  assert.equal(parseResolvedModel(JSON.stringify({ modelUsage: { 'claude-sonnet-4-6': {} } }), ''), 'claude-sonnet-4-6');
});
