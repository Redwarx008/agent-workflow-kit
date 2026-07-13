import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { evaluateTranscript } from '../.agents/skills/design/scripts/evaluate-decision-protocol.mjs';

const fixtures = path.resolve(import.meta.dirname, 'fixtures', 'decision-protocol');

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixtures, name), 'utf8'));
}

test('decision-protocol evaluator accepts a self-contained recommendation-first card after a user reply', () => {
  const result = evaluateTranscript(readFixture('valid.json'));
  assert.equal(result.ok, true, JSON.stringify(result.failures));
});

test('decision-protocol evaluator requires trees and illustrative code for architecture decisions', () => {
  const result = evaluateTranscript(readFixture('valid-architecture-illustration.json'));
  assert.equal(result.ok, true, JSON.stringify(result.failures));
});

test('decision-protocol evaluator rejects target artifacts detached before the recommended option', () => {
  const result = evaluateTranscript(readFixture('invalid-target-before-recommendation.json'));
  assert.equal(result.ok, false);
  for (const code of ['missing-structure-tree', 'missing-illustrative-code']) {
    assert.ok(result.failures.some(item => item.code === code), `missing ${code}`);
  }
});

test('decision-protocol evaluator rejects data-flow decisions without their flow tree and illustrative code', () => {
  const result = evaluateTranscript(readFixture('invalid-missing-data-flow-illustration.json'));
  assert.equal(result.ok, false);
  for (const code of ['missing-flow-tree', 'missing-illustrative-code']) {
    assert.ok(result.failures.some(item => item.code === code), `missing ${code}`);
  }
});

test('decision-protocol evaluator rejects recommendation after alternatives', () => {
  const result = evaluateTranscript(readFixture('invalid-recommendation-order.json'));
  assert.equal(result.ok, false);
  assert.ok(result.failures.some(item => item.code === 'recommendation-not-first'));
});

test('decision-protocol evaluator rejects internal IDs, document-dependent cards, and multiple questions', () => {
  const result = evaluateTranscript(readFixture('invalid-internal-id-and-question.json'));
  assert.equal(result.ok, false);
  for (const code of ['internal-id-leak', 'not-self-contained', 'not-one-question']) {
    assert.ok(result.failures.some(item => item.code === code), `missing ${code}`);
  }
});

test('decision-protocol evaluator rejects agent progress before the user replies', () => {
  const result = evaluateTranscript(readFixture('invalid-advanced-before-reply.json'), { allowPending: true });
  assert.equal(result.ok, false);
  assert.ok(result.failures.some(item => item.code === 'advanced-before-user-reply'));
});
