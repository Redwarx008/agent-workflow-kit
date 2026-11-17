import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { evaluateTranscript } from '../.agents/skills/design/scripts/evaluate-decision-protocol.mjs';

const fixture = new URL('./fixtures/decision-protocol/valid-inline-question-mark.json', import.meta.url);
const [question, answer] = JSON.parse(fs.readFileSync(fixture, 'utf8')).turns;
const errors = (turns, allowPending = false) =>
  evaluateTranscript({ turns }, { allowPending }).failures.map(item => item.code);

test('inline nullable syntax and a design.md reference do not invalidate a choice', () => {
  assert.deepEqual(errors([question, answer]), []);
});

test('an internal decision ID is still rejected in an otherwise valid choice', () => {
  assert.deepEqual(errors([{ ...question, content: 'D-003: ' + question.content }, answer]), ['internal-id-leak']);
});

test('a pending question is valid before sending but does not have a reply yet', () => {
  assert.deepEqual(errors([question], true), []);
  assert.deepEqual(errors([question]), ['missing-user-reply']);
});

test('an empty record, an orphan reply and consecutive replies are invalid in either mode', () => {
  for (const pending of [false, true]) {
    assert.deepEqual(errors([], pending), ['invalid-transcript']);
    assert.deepEqual(errors([answer], pending), ['reply-without-question']);
    assert.deepEqual(errors([question, answer, answer], pending), ['reply-without-question']);
  }
});

test('only a Design question can open an exchange, and a second question must wait', () => {
  assert.deepEqual(errors([{ ...question, kind: 'commentary' }, answer]), ['invalid-question-kind', 'reply-without-question']);
  assert.deepEqual(errors([question, question], true), ['advanced-before-user-reply']);
});

test('a follow-up is a reply, not necessarily a selection; clarification can keep the same choice open', () => {
  const followup = { role: 'user', content: 'Why would B reject the root?' };
  const clarification = { ...question, content: 'Rejecting a root would reject the import.\n\n' + question.content };
  assert.deepEqual(errors([question, followup]), []);
  assert.deepEqual(errors([question, followup, clarification], true), []);
  assert.deepEqual(errors([question, followup, clarification, answer]), []);
});

test('every declared option needs a visible entry and a label in the closing question', () => {
  const missingEntry = question.content.replace('B. Reject roots during import.', '');
  const missingLabel = question.content.replace('B (reject roots)?', 'reject roots?');
  assert.deepEqual(errors([{ ...question, content: missingEntry }, answer]), ['missing-labeled-option']);
  assert.deepEqual(errors([{ ...question, content: missingLabel }, answer]), ['question-omits-option-label']);
});

test('a proposed code change requires target code; a declared current excerpt must also be inspectable', () => {
  const target = { ...question, option_labels: [], proposes_code_change: true,
    content: 'illustrative target\n```csharp\nNode? Parent { get; }\n```\nWhat must a root import preserve?' };
  assert.deepEqual(errors([target], true), []);
  assert.deepEqual(errors([{ ...target, content: 'illustrative target: what should change?' }], true), ['missing-target-code']);
  const comparing = { ...target, current_code_sources: ['src/Tree.cs:3'],
    content: 'current code — src/Tree.cs:3\n' + target.content };
  assert.deepEqual(errors([comparing], true), ['missing-code-comparison']);
  const withExcerpt = comparing.content.replace('src/Tree.cs:3', 'src/Tree.cs:3\n```csharp\nint ParentId;\n```');
  assert.deepEqual(errors([{ ...comparing, content: withExcerpt }], true), []);
});
