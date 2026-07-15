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

test('workflow requires explicit Design and advances directly to Act and independent Review', () => {
  const read = skill => fs.readFileSync(path.join(root, '.agents', 'skills', skill, 'SKILL.md'), 'utf8');
  const design = read('design');
  const act = read('act');
  const review = read('review');
  const metadata = skill => fs.readFileSync(path.join(root, '.agents', 'skills', skill, 'agents', 'openai.yaml'), 'utf8');

  assert.match(design, /user explicitly invokes \$agent-workflow-kit:design/);
  assert.match(metadata('design'), /allow_implicit_invocation:\s*false/);
  for (const skill of ['act', 'review']) assert.match(metadata(skill), /allow_implicit_invocation:\s*true/);
  assert.match(design, /invoke `\$agent-workflow-kit:act` directly/);
  assert.match(act, /not a file-by-file execution route/);
  assert.match(act, /Launch an independent subagent with `\$agent-workflow-kit:review`/);
  assert.match(review, /after Act completes/);
});

test('final Design is the only persistent workflow record', () => {
  const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
  const design = read('.agents/skills/design/SKILL.md');
  const template = read('.agents/skills/design/assets/design.md');
  const designContract = read('.agents/skills/design/references/design-contract.md');
  const cards = read('.agents/skills/design/references/user-facing-decision-cards.md');
  const illustrations = read('.agents/skills/design/references/design-illustrations.md');
  const evaluation = read('.agents/skills/design/references/decision-protocol-evaluation.md');
  const act = read('.agents/skills/act/SKILL.md');
  const durable = read('.agents/skills/act/references/durable-decision-handoff.md');
  const worktree = read('.agents/skills/act/references/worktree-setup.md');
  const review = read('.agents/skills/review/SKILL.md');
  const reviewContract = read('.agents/skills/review/references/review-contract.md');

  assert.match(template, /^## Selected Design$/m);
  assert.match(template, /^## Validation and Acceptance$/m);
  assert.doesNotMatch(template, /Discussion Trace|Decision Map|Design Coverage|Change Impact|Design Amendments|Open Questions|Authorization/);
  assert.match(design, /only persistent workflow record/);
  assert.match(design, /Do not create a Plan, execution ledger, authorization record/);
  assert.equal(fs.existsSync(path.join(root, '.agents', 'skills', 'design', 'assets', 'plan.md')), false);
  assert.equal(fs.existsSync(path.join(root, '.agents', 'skills', 'design', 'references', 'plan-contract.md')), false);
  assert.equal(fs.existsSync(path.join(root, '.agents', 'skills', 'act', 'assets', 'execution.md')), false);
  assert.match(design, /Compare genuinely viable end-to-end approaches/);
  assert.match(design, /retain only the selected design/);
  assert.match(design, /decision-protocol evaluator/);
  assert.match(designContract, /discarded approaches/);
  assert.match(designContract, /no companion Plan, execution ledger, or state record exists/);
  assert.match(cards, /Target Structure Tree/);
  assert.match(illustrations, /Same Target Shape as Recommended/);
  assert.match(evaluation, /--allow-pending/);
  assert.match(act, /Choose mechanical order from repository facts/);
  assert.doesNotMatch(act, /plan\.md/);
  assert.doesNotMatch(act, /execution\.md/);
  assert.match(act, /Workspace isolation gate/);
  assert.doesNotMatch(durable, /plan\.md/);
  assert.doesNotMatch(worktree, /plan\.md/);
  assert.match(worktree, /Never default to a sibling directory/);
  assert.doesNotMatch(review, /`plan\.md`/);
  assert.doesNotMatch(review, /execution\.md/);
  assert.doesNotMatch(reviewContract, /plan\.md/);
  assert.match(reviewContract, /final selected Design is the sole scope authority/);
});
