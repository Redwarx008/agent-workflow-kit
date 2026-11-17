import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { inspectRepository } from '../scripts/check.mjs';

const skills = new URL('../.agents/skills/', import.meta.url);
const read = file => fs.readFileSync(new URL(file, skills), 'utf8');

test('repository manifests and canonical skills satisfy the contract', () => {
  const result = inspectRepository();
  assert.equal(result.ok, true, result.failures.join('\n'));
  assert.deepEqual(result.inventory, ['act', 'design', 'review']);
});

test('only Design requires explicit invocation; phase contracts address the packaged skills', () => {
  for (const [skill, implicit] of [['design', false], ['act', true], ['review', true]]) {
    assert.match(read(skill + '/agents/openai.yaml'), new RegExp('^\\s*allow_implicit_invocation:\\s*' + implicit + '\\s*$', 'm'));
  }
  assert.ok(read('design/references/design-process.md').includes('$agent-workflow-kit:act'));
  assert.ok(read('act/references/act-contract.md').includes('$agent-workflow-kit:review'));
});

test('both phases reference the same shipped independent review dispatch', () => {
  const dispatch = 'review/references/review-dispatch.md';
  const expected = new URL(dispatch, skills);
  assert.ok(fs.statSync(expected).isFile());
  for (const phase of ['design/references/design-process.md', 'act/references/act-contract.md']) {
    const links = [...read(phase).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(match =>
      new URL(match[1], new URL(phase, skills)).href);
    assert.ok(links.includes(expected.href), phase);
  }
});

test('the Design entry template keeps its four public sections in order', () => {
  const headings = [...read('design/assets/design.md').matchAll(/^## ([^\r\n]+)$/gm)].map(match => match[1]);
  assert.deepEqual(headings, ['Goal', 'Scope and Success Criteria', 'Selected Design', 'Validation and Acceptance']);
});
