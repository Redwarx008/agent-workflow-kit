#!/usr/bin/env node

import fs from 'node:fs';

function failure(code, turn, message) {
  return { code, turn, message };
}

function headingIndex(lines, expression) {
  return lines.findIndex(line => expression.test(line.trim()));
}

function sectionHasContent(lines, start) {
  if (start < 0) return false;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^#{2,3}\s+/.test(lines[index].trim())) break;
    if (lines[index].trim()) return true;
  }
  return false;
}

function sectionHasFencedBlock(lines, start, end = lines.length) {
  if (start < 0) return false;
  let opened = false;
  let content = false;
  for (let index = start + 1; index < end; index += 1) {
    if (/^#{2,3}\s+/.test(lines[index].trim())) break;
    if (/^```/.test(lines[index].trim())) {
      if (opened) return content;
      opened = true;
    } else if (opened && lines[index].trim()) {
      content = true;
    }
  }
  return false;
}

const illustrationKinds = {
  'architecture-decision': { tree: /^###\s+Structure tree\s*$/i, treeCode: 'missing-structure-tree', label: 'structure tree' },
  'data-structure-decision': { tree: /^###\s+Structure tree\s*$/i, treeCode: 'missing-structure-tree', label: 'structure tree' },
  'data-flow-decision': { tree: /^###\s+Flow tree\s*$/i, treeCode: 'missing-flow-tree', label: 'flow tree' }
};

function optionSections(lines) {
  const starts = [];
  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].trim();
    if (/^###\s+Recommended:\s+\S/i.test(heading)) starts.push({ type: 'recommended', start: index });
    else if (/^###\s+Alternatives?:\s+\S/i.test(heading)) starts.push({ type: 'alternative', start: index });
  }
  return starts.map((section, index) => ({ ...section, end: starts[index + 1]?.start ?? lines.length }));
}

function headingInOption(lines, option, expression) {
  for (let index = option.start + 1; index < option.end; index += 1) {
    if (expression.test(lines[index].trim())) return index;
  }
  return -1;
}

function evaluateIllustrations(turn, index, lines) {
  const requirement = illustrationKinds[turn.kind];
  if (!requirement) return [];
  const failures = [];
  for (const option of optionSections(lines)) {
    const tree = headingInOption(lines, option, new RegExp(`^####\\s+Target ${requirement.label}\\s*$`, 'i'));
    const code = headingInOption(lines, option, /^####\s+Illustrative code\s*$/i);
    const sharesRecommended = option.type === 'alternative'
      && sectionHasContent(lines, headingInOption(lines, option, /^####\s+Same target shape as recommended\s*$/i));
    if (sharesRecommended) continue;
    if (!sectionHasFencedBlock(lines, tree, option.end)) failures.push(failure(requirement.treeCode, index, `${option.type} option needs a fenced target ${requirement.label}.`));
    if (!sectionHasFencedBlock(lines, code, option.end)) failures.push(failure('missing-illustrative-code', index, `${option.type} option needs fenced illustrative code.`));
  }
  return failures;
}

export function evaluateDecisionCard(content, turn) {
  const failures = [];
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const title = headingIndex(lines, /^##\s+\S/);
  const why = headingIndex(lines, /^###\s+Why this must be decided now\s*$/i);
  const recommended = headingIndex(lines, /^###\s+Recommended:\s+\S/i);
  const alternative = headingIndex(lines, /^###\s+Alternatives?:\s+\S/i);
  const decision = headingIndex(lines, /^###\s+Your decision\s*$/i);

  if (title < 0) failures.push(failure('missing-domain-title', turn, 'Decision card needs a domain title.'));
  if (why < 0 || !sectionHasContent(lines, why)) failures.push(failure('missing-why-now', turn, 'Decision card needs a non-empty why-now section.'));
  if (recommended < 0 || !sectionHasContent(lines, recommended)) failures.push(failure('missing-recommendation', turn, 'Decision card needs a non-empty recommended choice.'));
  if (decision < 0 || !sectionHasContent(lines, decision)) failures.push(failure('missing-decision-question', turn, 'Decision card needs a non-empty user-decision section.'));
  if (why >= 0 && recommended >= 0 && why > recommended) failures.push(failure('recommendation-before-why', turn, 'Why-now facts must precede the recommendation.'));
  if (alternative >= 0 && recommended >= 0 && alternative < recommended) failures.push(failure('recommendation-not-first', turn, 'Recommendation must precede alternatives.'));
  if (alternative >= 0 && decision >= 0 && alternative > decision) failures.push(failure('alternative-after-decision', turn, 'Alternatives must precede the user decision.'));

  const questions = content.match(/[?？]/g) ?? [];
  if (questions.length !== 1) failures.push(failure('not-one-question', turn, `Decision card has ${questions.length} question marks; exactly one is required.`));
  if (/\bD-\d+\b/.test(content)) failures.push(failure('internal-id-leak', turn, 'Decision card exposes an internal decision ID.'));
  if (/design\.md/i.test(content)) failures.push(failure('not-self-contained', turn, 'Decision card refers to design.md instead of explaining itself.'));

  return failures;
}

function isDecisionCard(turn) {
  return turn.kind === 'decision-card' || Object.hasOwn(illustrationKinds, turn.kind) || /^###\s+Your decision\s*$/im.test(turn.content);
}

export function evaluateTranscript(transcript, { allowPending = false } = {}) {
  const failures = [];
  const turns = transcript?.turns;
  if (!Array.isArray(turns)) return { ok: false, failures: [failure('invalid-transcript', null, 'Transcript must contain a turns array.')] };

  let pendingDecisionTurn = null;
  turns.forEach((turn, index) => {
    if (!turn || typeof turn.content !== 'string' || !['agent', 'user'].includes(turn.role)) {
      failures.push(failure('invalid-turn', index, 'Each turn needs role agent/user and string content.'));
      return;
    }

    if (turn.role === 'user') {
      pendingDecisionTurn = null;
      return;
    }

    if (/\bD-\d+\b/.test(turn.content)) failures.push(failure('internal-id-leak', index, 'Agent message exposes an internal decision ID.'));
    if (pendingDecisionTurn !== null) {
      failures.push(failure('advanced-before-user-reply', index, `Agent turn follows unanswered decision card at turn ${pendingDecisionTurn}.`));
    }
    if (isDecisionCard(turn)) {
      failures.push(...evaluateDecisionCard(turn.content, index));
      failures.push(...evaluateIllustrations(turn, index, turn.content.replace(/\r\n/g, '\n').split('\n')));
      pendingDecisionTurn = index;
    }
  });

  if (!allowPending && pendingDecisionTurn !== null) {
    failures.push(failure('missing-user-reply', pendingDecisionTurn, 'Decision card has no subsequent user reply.'));
  }
  return { ok: failures.length === 0, failures };
}

function parseArguments(argv) {
  let allowPending = false;
  let inputPath = null;
  for (const argument of argv) {
    if (argument === '--allow-pending') allowPending = true;
    else if (!inputPath) inputPath = argument;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!inputPath) throw new Error('Usage: node evaluate-decision-protocol.mjs [--allow-pending] <transcript.json>');
  return { allowPending, inputPath };
}

function main() {
  try {
    const { allowPending, inputPath } = parseArguments(process.argv.slice(2));
    const transcript = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const result = evaluateTranscript(transcript, { allowPending });
    if (result.ok) console.log('PASS decision protocol');
    else {
      console.error('FAIL decision protocol');
      for (const item of result.failures) console.error(`- [${item.code}] turn ${item.turn ?? 'n/a'}: ${item.message}`);
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.stack ?? error.message);
    process.exitCode = 2;
  }
}

if (process.argv[1] && new URL(import.meta.url).pathname === new URL(`file:${process.argv[1].replace(/\\/g, '/')}`).pathname) main();
