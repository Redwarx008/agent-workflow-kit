import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectRepository } from '../scripts/check.mjs';

test('repository manifests and canonical skills satisfy the contract', () => {
  const result = inspectRepository();
  assert.equal(result.ok, true, result.failures.join('\n'));
  assert.deepEqual(result.inventory, ['act', 'design', 'plan', 'review']);
});
