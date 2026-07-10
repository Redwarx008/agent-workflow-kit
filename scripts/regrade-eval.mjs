#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { summarizeVerdict } from './lib/eval-grader.mjs';
import { parseResolvedModel } from './lib/model-provenance.mjs';

const input = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!input || !fs.existsSync(input)) {
  console.error('Usage: regrade-eval.mjs <report.json> [output.json]');
  process.exit(1);
}
const output = process.argv[3] ? path.resolve(process.argv[3]) : path.join(path.dirname(input), 'report.provenance.json');
const report = JSON.parse(fs.readFileSync(input, 'utf8'));
for (const result of report.results) {
  const stderrFile = path.join(path.dirname(input), 'runs', result.runner, result.case_id, result.arm, String(result.rep), 'stderr.log');
  const stdoutFile = path.join(path.dirname(input), 'runs', result.runner, result.case_id, result.arm, String(result.rep), 'stdout.log');
  result.resolved_model = parseResolvedModel(
    fs.existsSync(stdoutFile) ? fs.readFileSync(stdoutFile, 'utf8') : '',
    fs.existsSync(stderrFile) ? fs.readFileSync(stderrFile, 'utf8') : '',
  );
}
for (const caseReport of report.cases) {
  for (const runner of Object.keys(caseReport.per_runner)) {
    const arms = report.results.filter(result => result.case_id === caseReport.id && result.runner === runner);
    const mode = arms.some(result => result.arm === 'old') ? 'paired' : 'new-only';
    caseReport.per_runner[runner] = summarizeVerdict({ mode, arms });
  }
}
report.provenance_regraded_from = input;
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ output, cases: report.cases, models: [...new Set(report.results.map(result => result.resolved_model))] }, null, 2));
