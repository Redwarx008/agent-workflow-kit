import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectRepository } from '../scripts/check.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

test('repository manifests and canonical skills satisfy the contract', () => {
  const result = inspectRepository();
  assert.equal(result.ok, true, result.failures.join('\n'));
  assert.deepEqual(result.inventory, ['act', 'design', 'plan', 'review']);
});

test('workflow requires an explicit Design entry and then advances through gated phases', () => {
  const read = skill => fs.readFileSync(path.join(root, '.agents', 'skills', skill, 'SKILL.md'), 'utf8');
  const design = read('design');
  const plan = read('plan');
  const act = read('act');
  const review = read('review');

  const metadata = skill => fs.readFileSync(path.join(root, '.agents', 'skills', skill, 'agents', 'openai.yaml'), 'utf8');
  assert.match(design, /user explicitly invokes \$agent-workflow-kit:design/);
  assert.match(metadata('design'), /allow_implicit_invocation:\s*false/);
  for (const skill of ['plan', 'act', 'review']) assert.match(metadata(skill), /allow_implicit_invocation:\s*true/);
  assert.match(design, /Invoke `\$agent-workflow-kit:plan` directly/);
  assert.match(plan, /After that response, invoke `\$agent-workflow-kit:act` directly/);
  assert.match(act, /Launch an independent subagent with `\$agent-workflow-kit:review`/);
  assert.match(review, /after Act completes/);
});
