---
name: workflow-review
description: Independently verifies an implementation against its Ready Design, authorized Plan, shared working tree, real production call paths, and raw validation evidence. Use when workflow-act requests final or follow-up review; run read-only in the existing workspace without creating a worktree or fixing findings.
---

# Workflow Review

Perform an independent completion audit, not implementation and not generic style review.

## Setup

Read [references/review-contract.md](references/review-contract.md) completely, then read the active `design.md`, `plan.md`, repository status/diff/untracked files, and raw validation outputs. Do not accept the main agent's summary as evidence.

Work read-only in the shared working tree. Never create a worktree, edit files, or run mutating formatters/code generators. Non-mutating builds/tests are allowed when needed to verify evidence.

## Review

1. Build a checklist from every Design success criterion and checked Plan task.
2. Trace each requirement through the real runtime/editor/tooling call path. Confirm wiring, ownership, error/cleanup behavior, and compatibility boundaries.
3. Inspect the actual diff and surrounding consumers, not just named declarations or tests.
4. Verify that each evidence type proves the claimed behavior and follows the project's deterministic-versus-visual validation rules.
5. Inspect version-control ownership and documentation boundaries.
6. Report only evidence-backed P0/P1/P2 findings with tight file/line references and causal mechanisms.

## Output

Return the coverage table, findings, validation gaps, and exactly one verdict: `PASS`, `FAIL`, or `BLOCKED`.

`PASS` requires every criterion accounted for and no P0/P1. If a fix has multiple reasonable forms or changes intent, identify the user decision required; do not choose it.
