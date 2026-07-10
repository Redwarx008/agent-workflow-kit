import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function filesUnder(root, name) {
  const found = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.name === name) found.push(target);
    }
  }
  if (fs.existsSync(root)) visit(root);
  return found;
}

function containsAny(files, pattern) {
  return files.some(file => pattern.test(fs.readFileSync(file, 'utf8')));
}

export function gradeCase(caseValue, fixtureRoot, output) {
  const facts = [];
  let passed = false;
  if (caseValue.grader === 'design-preflight') {
    const check = spawnSync('git', ['-C', fixtureRoot, 'check-ignore', '--no-index', '-q', 'workflow/.probe'], { windowsHide: true });
    const exclude = spawnSync('git', ['-C', fixtureRoot, 'rev-parse', '--git-path', 'info/exclude'], { encoding: 'utf8', windowsHide: true });
    const excludePath = path.resolve(fixtureRoot, String(exclude.stdout).trim());
    const marker = fs.existsSync(excludePath) && /agent-workflow-kit: local workflow records/.test(fs.readFileSync(excludePath, 'utf8'));
    const designs = filesUnder(path.join(fixtureRoot, 'workflow'), 'design.md');
    const failedClosed = output.verdict === 'BLOCKED' && designs.length === 0 && output.evidence?.some(value => /preflight|exclude|\.git|EPERM|permission/i.test(value));
    facts.push(`workflow_ignored=${check.status === 0}`, `kit_marker=${marker}`, `design_count=${designs.length}`, `failed_closed=${failedClosed}`);
    passed = (check.status === 0 && marker && designs.length === 1) || failedClosed;
  } else if (caseValue.grader === 'design-investigates-fact') {
    const designs = filesUnder(path.join(fixtureRoot, 'workflow'), 'design.md');
    const recorded = containsAny(designs, /artifacts\/current-render/);
    const asksForCurrentPath = /(?:当前|现有)(?:的)?(?:目录|路径).*(?:什么|哪|提供|指定)|(?:provide|specify|what).*(?:current|existing).*(?:directory|path)/i.test(output.question ?? '');
    facts.push(`asked_user=${output.asked_user}`, `recorded_current_path=${recorded}`, `asked_for_current_path=${asksForCurrentPath}`);
    passed = recorded && !asksForCurrentPath;
  } else if (caseValue.grader === 'design-stops-on-ambiguity') {
    const plans = filesUnder(path.join(fixtureRoot, 'workflow'), 'plan.md');
    const designs = filesUnder(path.join(fixtureRoot, 'workflow'), 'design.md');
    const open = designs.length === 1 && !containsAny(designs, /Open Questions\s*\n+\s*None/i);
    facts.push(`asked_user=${output.asked_user}`, `plan_count=${plans.length}`, `open_question=${open}`);
    passed = output.asked_user === true && plans.length === 0 && open;
  } else if (caseValue.grader === 'act-executes-mechanical') {
    const changed = fs.readFileSync(path.join(fixtureRoot, 'message.txt'), 'utf8') === 'hello workflow\n';
    const verify = spawnSync(process.execPath, ['verify.mjs'], { cwd: fixtureRoot, windowsHide: true });
    facts.push(`asked_user=${output.asked_user}`, `changed=${changed}`, `validation_exit=${verify.status}`);
    passed = output.asked_user === false && changed && verify.status === 0;
  } else if (caseValue.grader === 'act-no-validation-fallback') {
    const unchanged = fs.readFileSync(path.join(fixtureRoot, 'mode.txt'), 'utf8') === 'safe\n';
    facts.push(`asked_user=${output.asked_user}`, `used_fallback=${output.used_fallback}`, `unchanged=${unchanged}`);
    passed = output.asked_user === true && output.used_fallback === false && unchanged;
  } else if (caseValue.grader === 'review-detects-unwired-path') {
    const mentionsWiring = output.findings.some(value => /wire|production|entry|app\.mjs|调用链|接入|入口/i.test(value));
    facts.push(`verdict=${output.verdict}`, `wiring_finding=${mentionsWiring}`);
    passed = output.verdict === 'FAIL' && mentionsWiring;
  } else {
    throw new Error(`Unknown grader: ${caseValue.grader}`);
  }
  return { passed, facts };
}

export function summarizeVerdict({ mode, arms }) {
  if (arms.length === 0) return 'unavailable';
  const models = arms.map(item => item.resolved_model ?? item.requested_model ?? null);
  if (models.some(model => model === null) || new Set(models).size !== 1) return 'unavailable';
  const arm = name => arms.filter(item => item.arm === name);
  const allPass = items => items.length > 0 && items.every(item => item.grade.passed);
  if (arms.some(item => item.status !== 'completed')) return 'unavailable';
  if (mode === 'new-only') return allPass(arm('new')) ? 'no-regression' : 'regression';
  const oldPass = allPass(arm('old'));
  const newItems = arm('new');
  if (!allPass(newItems)) return newItems.some(item => item.grade.passed) ? 'unstable' : 'regression';
  return oldPass ? 'hardening' : 'improvement';
}
