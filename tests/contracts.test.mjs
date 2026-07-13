import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectRepository } from '../scripts/check.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

test('repository manifests and canonical skills satisfy the contract', () => {
  const result = inspectRepository();
  assert.equal(result.ok, true, result.failures.join('\n'));
  assert.deepEqual(result.inventory, ['act', 'design', 'review']);
});

test('workflow requires an explicit Design entry and then advances through gated phases', () => {
  const read = skill => fs.readFileSync(path.join(root, '.agents', 'skills', skill, 'SKILL.md'), 'utf8');
  const design = read('design');
  const act = read('act');
  const review = read('review');

  const metadata = skill => fs.readFileSync(path.join(root, '.agents', 'skills', skill, 'agents', 'openai.yaml'), 'utf8');
  assert.match(design, /user explicitly invokes \$agent-workflow-kit:design/);
  assert.match(metadata('design'), /allow_implicit_invocation:\s*false/);
  for (const skill of ['act', 'review']) assert.match(metadata(skill), /allow_implicit_invocation:\s*true/);
  assert.match(design, /Implementation Authorization: Approved/);
  assert.match(design, /invoke `\$agent-workflow-kit:act` directly/);
  assert.match(act, /Launch an independent subagent with `\$agent-workflow-kit:review`/);
  assert.match(review, /after Act completes/);
});

test('design discussion and authorization contracts remain aligned', () => {
  const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
  const design = read('.agents/skills/design/SKILL.md');
  const template = read('.agents/skills/design/assets/design.md');
  const contract = read('.agents/skills/design/references/design-contract.md');
  const cards = read('.agents/skills/design/references/user-facing-decision-cards.md');
  const illustrations = read('.agents/skills/design/references/design-illustrations.md');
  const evaluation = read('.agents/skills/design/references/decision-protocol-evaluation.md');
  const act = read('.agents/skills/act/SKILL.md');
  const execution = read('.agents/skills/act/assets/execution.md');
  const handoff = read('.agents/skills/act/references/durable-decision-handoff.md');
  const review = read('.agents/skills/review/SKILL.md');
  const reviewContract = read('.agents/skills/review/references/review-contract.md');

  assert.match(design, /Overall Approaches Considered/);
  assert.doesNotMatch(design, /`Options Considered`/);
  assert.match(design, /one decision question per message/);
  assert.match(design, /Approved for Revision <n>/);
  assert.match(template, /^\*\*Revision:\*\* 1/m);
  assert.match(template, /^## Change Impact Checklist$/m);
  assert.match(template, /^## Design Amendments$/m);
  assert.match(template, /Architecture, data, and flow illustrations/);
  assert.match(contract, /Decision Map.*authoritative/i);
  assert.match(contract, /Change Impact Checklist/);
  assert.match(contract, /Design Amendments/);
  assert.match(cards, /^### Why this must be decided now$/m);
  assert.match(cards, /^### Recommended: A/m);
  assert.match(cards, /^### Your decision$/m);
  assert.match(cards, /architecture-decision/);
  assert.match(illustrations, /Illustrative code/);
  assert.match(design, /illustrative code/);
  assert.match(design, /decision-protocol evaluator/);
  assert.match(evaluation, /--allow-pending/);
  assert.match(act, /Authorized Design Revision/);
  assert.match(act, /Design Amendment/);
  assert.match(act, /references\/durable-decision-handoff\.md/);
  assert.match(execution, /Authorized Design Revision/);
  assert.match(execution, /^## Authorized Amendments$/m);
  assert.match(execution, /^## Durable Decision Handoff$/m);
  assert.match(handoff, /Classify every confirmed Design decision/);
  assert.match(review, /Design Amendment/);
  assert.match(review, /Durable Decision Handoff/);
  assert.match(reviewContract, /current authorized Design Revision/);
});
