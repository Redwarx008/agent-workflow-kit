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

test('every workflow phase requires explicit user invocation and forbids automatic transitions', () => {
  const read = skill => fs.readFileSync(path.join(root, '.agents', 'skills', skill, 'SKILL.md'), 'utf8');
  const design = read('design');
  const plan = read('plan');
  const act = read('act');
  const review = read('review');

  for (const [skill, text] of Object.entries({ design, plan, act, review })) {
    assert.match(text, /user explicitly invokes \$agent-workflow-kit:/, `${skill} lacks an explicit invocation gate`);
    const metadata = fs.readFileSync(path.join(root, '.agents', 'skills', skill, 'agents', 'openai.yaml'), 'utf8');
    assert.match(metadata, /allow_implicit_invocation:\s*false/, `${skill} still permits implicit invocation`);
  }
  assert.match(design, /Do not invoke or enter Plan automatically/);
  assert.match(plan, /Do not invoke or enter Design automatically/);
  assert.match(plan, /Authorization does not invoke Act/);
  assert.match(act, /Do not launch a reviewer or enter Review automatically/);
  assert.match(review, /only after the user's explicit invocation/);
});
