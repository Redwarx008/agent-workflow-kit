import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function hashTree(root) {
  const files = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) files.push({ file: target, link: fs.readlinkSync(target) });
      else if (entry.isDirectory()) visit(target);
      else files.push({ file: target, link: null });
    }
  }
  visit(root);
  const hash = crypto.createHash('sha256');
  for (const item of files.sort((left, right) => left.file === right.file ? 0 : left.file < right.file ? -1 : 1)) {
    hash.update(path.relative(root, item.file).replaceAll('\\', '/'));
    hash.update('\0');
    if (item.link !== null) hash.update(`symlink:${item.link}`);
    else hash.update(fs.readFileSync(item.file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function gitCommit(root) {
  const result = spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8', timeout: 5000, windowsHide: true });
  return result.status === 0 ? result.stdout.trim() : null;
}

function readManifest(file) {
  try {
    const value = JSON.parse(fs.readFileSync(file, 'utf8'));
    return value.name === 'agent-workflow-kit' ? value : null;
  } catch { return null; }
}

function findPluginManifests(cacheRoot, platform) {
  const manifestParts = platform === 'codex' ? ['.codex-plugin', 'plugin.json'] : ['.claude-plugin', 'plugin.json'];
  const results = [];
  function visit(directory, depth) {
    if (depth > 8 || !fs.existsSync(directory)) return;
    let entries;
    try { entries = fs.readdirSync(directory, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.isSymbolicLink() || entry.name === '.git') continue;
      const target = path.join(directory, entry.name);
      const manifestFile = path.join(target, ...manifestParts);
      const manifest = fs.existsSync(manifestFile) ? readManifest(manifestFile) : null;
      if (manifest) {
        results.push({ platform, root: target, manifest_file: manifestFile, version: manifest.version ?? null, commit: gitCommit(target), skill_fingerprint: fs.existsSync(path.join(target, '.agents', 'skills')) ? hashTree(path.join(target, '.agents', 'skills')) : null });
      } else visit(target, depth + 1);
    }
  }
  visit(cacheRoot, 0);
  return results;
}

function legacyCandidates(projectRoot, knownPaths) {
  const values = new Set(Object.keys(knownPaths));
  for (const base of ['.agents/skills', '.claude/skills']) {
    const directory = path.join(projectRoot, base);
    if (!fs.existsSync(directory)) continue;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith('workflow-')) values.add(`${base}/${entry.name}`);
    }
  }
  return [...values].sort();
}

function diagnoseLegacy(projectRoot, knownPaths) {
  const results = [];
  for (const relative of legacyCandidates(projectRoot, knownPaths)) {
    const root = path.join(projectRoot, ...relative.split('/'));
    if (!fs.existsSync(root)) continue;
    const skill = path.join(root, 'SKILL.md');
    if (!fs.existsSync(skill)) {
      results.push({ path: relative, root, status: 'malformed', fingerprint: null, known_fingerprint: knownPaths[relative] ?? null });
      continue;
    }
    const fingerprint = hashTree(root);
    const known = knownPaths[relative] ?? null;
    results.push({
      path: relative,
      root,
      status: known === null ? 'unknown_ownership' : fingerprint === known ? 'known_release' : 'modified',
      fingerprint,
      known_fingerprint: known,
    });
  }
  return results;
}

export function diagnoseInstallations(options) {
  const repoRoot = path.resolve(options.repoRoot);
  const projectRoot = path.resolve(options.projectRoot);
  const repoManifest = JSON.parse(fs.readFileSync(path.join(repoRoot, '.codex-plugin', 'plugin.json'), 'utf8'));
  const known = options.known ?? JSON.parse(fs.readFileSync(path.join(repoRoot, 'diagnostics', 'known-legacy.json'), 'utf8'));
  const codexHome = path.resolve(options.codexHome ?? process.env.CODEX_HOME ?? path.join(os.homedir(), '.codex'));
  const claudeHome = path.resolve(options.claudeHome ?? process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), '.claude'));
  const native = [
    ...findPluginManifests(path.join(codexHome, 'plugins', 'cache'), 'codex'),
    ...findPluginManifests(path.join(claudeHome, 'plugins', 'cache'), 'claude'),
  ].map(item => ({ ...item, stale: item.version !== repoManifest.version }));
  const legacy = diagnoseLegacy(projectRoot, known.paths ?? {});
  const duplicate = native.length > 0 && legacy.length > 0;
  const ownershipRisk = legacy.some(item => ['modified', 'unknown_ownership', 'malformed'].includes(item.status));
  let status = 'no_install_detected';
  if (native.length > 0 && legacy.length === 0) status = native.some(item => item.stale) ? 'stale_native' : 'clean_native';
  else if (duplicate) status = ownershipRisk ? 'coexisting_with_ownership_risk' : 'coexisting_native_and_legacy';
  else if (legacy.length > 0) status = ownershipRisk ? 'legacy_with_ownership_risk' : 'legacy_only';
  return {
    canonical: { root: repoRoot, version: repoManifest.version, commit: gitCommit(repoRoot), skill_fingerprint: hashTree(path.join(repoRoot, '.agents', 'skills')) },
    native,
    legacy,
    duplicate_loading_risk: duplicate,
    ownership_risk: ownershipRisk,
    status,
  };
}
