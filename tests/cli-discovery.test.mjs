import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import { buildCliCandidates, discoverCli, discoverCodexResources } from '../scripts/lib/cli-discovery.mjs';

test('explicit path precedes environment, official default, and PATH', () => {
  const candidates = buildCliCandidates('codex', {
    explicit: 'C:/explicit/codex.exe',
    env: { AGENT_WORKFLOW_CODEX_CLI: 'C:/env/codex.exe', PATH: 'C:/path' },
    officialDefaults: ['C:/official/codex.exe'],
    pathCandidates: ['C:/path/codex.exe'],
  });
  assert.deepEqual(candidates.slice(0, 4).map(value => path.normalize(value)), [
    'C:/explicit/codex.exe', 'C:/env/codex.exe', 'C:/official/codex.exe', 'C:/path/codex.exe',
  ].map(value => path.resolve(value)));
});

test('unusable WindowsApps internal resource falls through to standalone CLI', () => {
  const shadow = 'C:/Program Files/WindowsApps/OpenAI.Codex_1_x64__x/app/resources/codex.exe';
  const standalone = 'C:/Users/test/AppData/Local/Programs/OpenAI/Codex/bin/codex.exe';
  const result = discoverCli('codex', {
    explicit: shadow,
    env: {},
    officialDefaults: [standalone],
    pathCandidates: [],
    exists: () => true,
    probe: candidate => ({ status: candidate === path.resolve(standalone) ? 0 : 1, stdout: 'codex-cli 1.0.0' }),
  });
  assert.equal(result.available, true);
  assert.equal(result.path, path.resolve(standalone));
  assert.equal(result.diagnostics[0].status, 'windowsapps-internal-resource');
});

test('existing but non-executable candidate is not accepted', () => {
  const result = discoverCli('claude', {
    explicit: 'C:/broken/claude.exe', env: {}, officialDefaults: [], pathCandidates: [], exists: () => true,
    probe: () => ({ status: 1, stderr: 'access denied' }),
  });
  assert.equal(result.available, false);
  assert.equal(result.diagnostics[0].status, 'unusable');
});

test('Codex resource directory must contain both sandbox helpers', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-resources-'));
  fs.writeFileSync(path.join(root, 'codex-windows-sandbox-setup.exe'), 'x');
  assert.equal(discoverCodexResources('codex-cli 9.9.9', { explicit: root, env: {} }), null);
  fs.writeFileSync(path.join(root, 'codex-command-runner.exe'), 'x');
  assert.equal(discoverCodexResources('codex-cli 9.9.9', { explicit: root, env: {} }), path.resolve(root));
});
