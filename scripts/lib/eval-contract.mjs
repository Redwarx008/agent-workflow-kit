import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const IDS = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MODES = new Set(['paired', 'new-only']);
const SKILLS = new Set(['design', 'plan', 'act', 'review']);

export function validateCase(value) {
  const failures = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return ['case must be an object'];
  if (!IDS.test(value.id ?? '')) failures.push('id must be stable kebab-case');
  if (!MODES.has(value.mode)) failures.push('mode must be paired or new-only');
  if (!SKILLS.has(value.skill)) failures.push('skill must be design, plan, act, or review');
  if (value.mode === 'paired' && typeof value.baseline_skill !== 'string') failures.push('paired case requires baseline_skill');
  if (!Number.isInteger(value.repetitions) || value.repetitions < 1) failures.push('repetitions must be a positive integer');
  if (typeof value.prompt !== 'string' || !value.prompt.trim()) failures.push('prompt is required');
  if (typeof value.grader !== 'string' || !value.grader.trim()) failures.push('grader is required');
  if (!value.fixture || typeof value.fixture.files !== 'object') failures.push('fixture.files is required');
  if ('expected' in value || 'forbidden' in value) failures.push('expected behavior must stay in grader code, not prompt cases');
  return failures;
}

export function loadCases(casesDir) {
  return fs.readdirSync(casesDir).filter(name => name.endsWith('.json')).sort().map(name => {
    const file = path.join(casesDir, name);
    const value = JSON.parse(fs.readFileSync(file, 'utf8'));
    const failures = validateCase(value);
    if (failures.length) throw new Error(`${name}: ${failures.join('; ')}`);
    return { ...value, source_file: file };
  });
}

export function materializeFixture(caseValue, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const [relative, contents] of Object.entries(caseValue.fixture.files)) {
    const target = path.resolve(destination, relative);
    if (!target.startsWith(path.resolve(destination) + path.sep)) throw new Error(`fixture path escapes root: ${relative}`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents, 'utf8');
  }
  if (caseValue.fixture.git) {
    execFileSync('git', ['-C', destination, 'init'], { windowsHide: true, stdio: 'ignore' });
    execFileSync('git', ['-C', destination, 'config', 'user.email', 'eval@example.com'], { windowsHide: true });
    execFileSync('git', ['-C', destination, 'config', 'user.name', 'Eval'], { windowsHide: true });
    execFileSync('git', ['-C', destination, 'add', '.'], { windowsHide: true });
    execFileSync('git', ['-C', destination, 'commit', '-m', 'fixture'], { windowsHide: true, stdio: 'ignore' });
    if (caseValue.fixture.workflow_ignored) {
      const relative = execFileSync('git', ['-C', destination, 'rev-parse', '--git-path', 'info/exclude'], { encoding: 'utf8', windowsHide: true }).trim();
      const exclude = path.resolve(destination, relative);
      fs.appendFileSync(exclude, '# agent-workflow-kit: eval fixture\n/workflow/\n', 'utf8');
    }
  }
}

export function extractSkillRevision(repoRoot, revision, skillName, destination) {
  const prefix = `.agents/skills/${skillName}/`;
  const names = execFileSync('git', ['-C', repoRoot, 'ls-tree', '-r', '--name-only', revision, prefix], { encoding: 'utf8', windowsHide: true })
    .split(/\r?\n/).filter(Boolean);
  if (!names.length) throw new Error(`No skill ${skillName} at ${revision}`);
  for (const name of names) {
    const relative = name.slice(prefix.length);
    const target = path.join(destination, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const contents = execFileSync('git', ['-C', repoRoot, 'show', `${revision}:${name}`], { windowsHide: true });
    fs.writeFileSync(target, contents);
  }
  return destination;
}
