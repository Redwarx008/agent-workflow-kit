---
name: review
description: Independently verifies an implementation against its authorized final Design, shared working tree, real production call paths, and validation entrypoints. Use automatically through an independent subagent after Act completes or requests follow-up review; run read-only in the existing workspace.
---

# Workflow Review

Perform an independent completion audit, not implementation and not generic style review.

The main agent must launch an independent subagent after Act completes. Pass only the active `design.md`, implementation workspace root, and raw validation entrypoints; do not pass the main agent's conclusions or suspected gaps.

## Setup

Read [references/review-contract.md](references/review-contract.md) completely, then read Design, repository status/diff/untracked files, and the supplied validation entrypoints or outputs. Confirm the supplied Design and workspace are the items under review. Do not accept the main agent's summary as evidence.

Work read-only in the shared working tree. Never create a worktree, edit files, or run mutating formatters/code generators. Non-mutating builds/tests are allowed when needed to verify evidence.

## Review

1. Build a checklist from every final Design success criterion, constraint, interface, failure behavior, production integration obligation, and durable project-documentation obligation.
2. Trace each requirement through the real runtime/editor/tooling call path. Confirm wiring, ownership, error/cleanup behavior, and compatibility boundaries.
3. Inspect the actual diff and surrounding consumers, not just named declarations or tests.
4. Cross-check the actual diff against the supplied validation entrypoints and any raw evidence. Verify that each evidence type proves the claimed behavior and follows the project's deterministic-versus-visual validation rules.
5. Inspect version-control ownership and documentation boundaries.
6. Report only evidence-backed P0/P1/P2 findings with tight file/line references and causal mechanisms.

## Output

Return the coverage table, findings, validation gaps, and exactly one verdict: `PASS`, `FAIL`, or `BLOCKED`.

`PASS` requires every criterion accounted for and no P0/P1. If a fix has multiple reasonable forms or changes intent, identify the user decision required; do not choose it.
