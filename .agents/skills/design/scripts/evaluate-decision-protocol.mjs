#!/usr/bin/env node

import fs from 'node:fs';

function failure(code, turn, message) {
  return { code, turn, message };
}

function proseOutsideFences(lines, start, end) {
  const prose = [];
  let fenced = false;
  for (let index = start + 1; index < end; index += 1) {
    if (/^```/.test(lines[index].trim())) {
      fenced = !fenced;
      continue;
    }
    if (!fenced) prose.push(lines[index]);
  }
  return prose.join('\n');
}

function fencedBlocks(lines) {
  const blocks = [];
  let current = null;
  for (const line of lines) {
    const fence = /^```\s*([^\s`]*)/.exec(line.trim());
    if (fence) {
      if (current) {
        blocks.push(current);
        current = null;
      } else {
        current = { language: fence[1].toLowerCase(), content: [] };
      }
    } else if (current) {
      current.content.push(line);
    }
  }
  return blocks;
}

function evaluateDesignQuestion(turn, index) {
  const failures = [];
  const lines = turn.content.replace(/\r\n/g, '\n').split('\n');
  const prose = proseOutsideFences(['', ...lines], 0, lines.length + 1);
  const questions = prose.match(/[?？]/g) ?? [];

  if (questions.length !== 1) failures.push(failure('not-one-question', index, `The design question has ${questions.length} question terminators outside fenced code; exactly one is required.`));
  if (/\bD-\d+\b/.test(prose)) failures.push(failure('internal-id-leak', index, 'Design dialogue exposes an internal decision ID.'));
  if (/(?:设计卡|决策卡)\s*\d+\s*\/\s*\d+|\b(?:design\s+card|decision)\s+\d+\s*(?:of|\/)\s*\d+\b/i.test(prose)) failures.push(failure('fixed-batch-label', index, 'Design dialogue exposes a pre-numbered card or promised decision count.'));
  if (/design\.md/i.test(prose)) failures.push(failure('not-self-contained', index, 'Design dialogue refers to design.md instead of explaining itself.'));
  if (typeof turn.proposes_code_change !== 'boolean') failures.push(failure('missing-code-change-declaration', index, 'A design-question turn must declare proposes_code_change true or false.'));

  const sources = turn.current_code_sources;
  if (Object.hasOwn(turn, 'current_code_sources')) {
    if (!Array.isArray(sources) || sources.length === 0) {
      failures.push(failure('missing-current-code-sources', index, 'Declared current code needs at least one current repository path:line source.'));
    } else {
      for (const source of sources) {
        if (typeof source !== 'string' || !/^(?![A-Za-z]:[\\/])[^\r\n]+:\d+$/.test(source.trim())) {
          failures.push(failure('invalid-current-code-source', index, `Current-code source must be repository-relative path:line: ${String(source)}`));
        } else if (!turn.content.includes(source)) {
          failures.push(failure('hidden-current-code-source', index, `Current-code source is not visible in the user message: ${source}`));
        }
      }
    }
    if (!/current code/i.test(turn.content)) failures.push(failure('missing-current-code-label', index, 'Label the current repository excerpt with the stable marker: current code.'));
  }

  const codeBlocks = fencedBlocks(lines).filter(block => block.content.some(line => line.trim()) && !['', 'text', 'plaintext', 'md', 'markdown', 'mermaid'].includes(block.language));
  if (turn.proposes_code_change === true) {
    if (!Object.hasOwn(turn, 'current_code_sources')) failures.push(failure('missing-current-code-sources', index, 'A concrete project-code target needs at least one current repository path:line source.'));
    if (codeBlocks.length < 2) failures.push(failure('missing-code-comparison', index, 'A proposed project-code change needs separate non-empty current-code and illustrative-target blocks.'));
    if (!/illustrative target/i.test(turn.content)) failures.push(failure('missing-target-code-label', index, 'Label the proposed code with the stable marker: illustrative target.'));
  } else if (Object.hasOwn(turn, 'current_code_sources') && codeBlocks.length < 1) {
    failures.push(failure('missing-current-code-evidence', index, 'Declared current-code evidence needs a non-empty fenced current-code block.'));
  }

  return failures;
}

function isDesignQuestion(turn) {
  return turn.kind === 'design-question';
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

    if (pendingDecisionTurn !== null) {
      failures.push(failure('advanced-before-user-reply', index, `Agent turn follows unanswered decision card at turn ${pendingDecisionTurn}.`));
    }
    if (isDesignQuestion(turn)) {
      failures.push(...evaluateDesignQuestion(turn, index));
      pendingDecisionTurn = index;
    } else if (['decision-card', 'architecture-decision', 'data-structure-decision', 'data-flow-decision'].includes(turn.kind)) {
      failures.push(failure('legacy-question-kind', index, 'Use the natural design-question protocol; fixed decision-card kinds are no longer supported.'));
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
