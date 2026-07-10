import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { extractSkillRevision, loadCases, validateCase } from '../scripts/lib/eval-contract.mjs';
import { gradeCase, summarizeVerdict } from '../scripts/lib/eval-grader.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('all tracked cases satisfy schema-level contracts without embedded expectations', () => {
  const cases = loadCases(path.join(ROOT, 'evals', 'cases'));
  assert.equal(cases.length, 6);
  assert.equal(cases.filter(value => value.mode === 'paired').length, 1);
  assert.equal(cases.filter(value => value.mode === 'new-only').length, 5);
});

test('invalid case contract is rejected', () => {
  assert.ok(validateCase({ id: 'Bad ID', expected: true }).length > 0);
});

test('baseline skill is extracted from exact Git revision', () => {
  const target = fs.mkdtempSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'baseline-'));
  extractSkillRevision(ROOT, 'aff019f', 'workflow-design', target);
  const skill = fs.readFileSync(path.join(target, 'SKILL.md'), 'utf8');
  assert.match(skill, /name: workflow-design/);
  assert.doesNotMatch(skill, /preflight\.mjs ensure/);
  fs.rmSync(target, { recursive: true, force: true });
});

test('defect injection makes paired grader red and new evidence green', () => {
  const root = fs.mkdtempSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'grader-'));
  execFileSync('git', ['-C', root, 'init'], { stdio: 'ignore', windowsHide: true });
  const excludeRelative = execFileSync('git', ['-C', root, 'rev-parse', '--git-path', 'info/exclude'], { encoding: 'utf8', windowsHide: true }).trim();
  const exclude = path.resolve(root, excludeRelative);
  const caseValue = { grader: 'design-preflight' };
  const output = {};
  const red = gradeCase(caseValue, root, output);
  assert.equal(red.passed, false);
  fs.appendFileSync(exclude, '# agent-workflow-kit: local workflow records\n/workflow/\n');
  fs.mkdirSync(path.join(root, 'workflow', 'active', 'x'), { recursive: true });
  fs.writeFileSync(path.join(root, 'workflow', 'active', 'x', 'design.md'), '# Design');
  const green = gradeCase(caseValue, root, output);
  assert.equal(green.passed, true);
  fs.rmSync(root, { recursive: true, force: true });
});

test('preflight grader accepts permission failure only when it leaves no workflow record', () => {
  const root = fs.mkdtempSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'fail-closed-'));
  execFileSync('git', ['-C', root, 'init'], { stdio: 'ignore', windowsHide: true });
  const result = gradeCase({ grader: 'design-preflight' }, root, { verdict: 'BLOCKED', evidence: ['preflight could not write .git/info/exclude: EPERM'] });
  assert.equal(result.passed, true);
  fs.rmSync(root, { recursive: true, force: true });
});

test('fact grader allows a real product question after the discoverable fact was recorded', () => {
  const root = fs.mkdtempSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'fact-question-'));
  fs.mkdirSync(path.join(root, 'workflow', 'active', 'x'), { recursive: true });
  fs.writeFileSync(path.join(root, 'workflow', 'active', 'x', 'design.md'), 'Evidence: artifacts/current-render');
  assert.equal(gradeCase({ grader: 'design-investigates-fact' }, root, { asked_user: true, question: '请指定新的精确目录路径。' }).passed, true);
  assert.equal(gradeCase({ grader: 'design-investigates-fact' }, root, { asked_user: true, question: '请提供当前目录路径是什么。' }).passed, false);
  fs.rmSync(root, { recursive: true, force: true });
});

test('verdict distinguishes improvement, hardening, regression, and unstable', () => {
  const done = (arm, passed) => ({ arm, status: 'completed', grade: { passed }, resolved_model: 'test-model' });
  assert.equal(summarizeVerdict({ mode: 'paired', arms: [done('old', false), done('new', true)] }), 'improvement');
  assert.equal(summarizeVerdict({ mode: 'paired', arms: [done('old', true), done('new', true)] }), 'hardening');
  assert.equal(summarizeVerdict({ mode: 'paired', arms: [done('old', false), done('new', false)] }), 'regression');
  assert.equal(summarizeVerdict({ mode: 'paired', arms: [done('old', false), done('new', true), done('new', false)] }), 'unstable');
});

test('verdict is unavailable when paired model provenance is missing or differs', () => {
  const item = (arm, model) => ({ arm, status: 'completed', grade: { passed: true }, resolved_model: model });
  assert.equal(summarizeVerdict({ mode: 'paired', arms: [item('old', null), item('new', null)] }), 'unavailable');
  assert.equal(summarizeVerdict({ mode: 'paired', arms: [item('old', 'a'), item('new', 'b')] }), 'unavailable');
});
