---
name: review
description: Independently verifies an implementation against its authorized final Design, shared working tree, real production call paths, validation entrypoints, and intended input class rather than visible examples. Use automatically through an independent subagent after Act completes or requests follow-up review; run read-only in the existing workspace.
---

# Workflow Review

Perform an independent completion audit, not implementation and not generic style review.

The main agent must launch an independent subagent after Act completes. Pass only the active `design.md`, implementation workspace root, and raw validation entrypoints; do not pass the main agent's conclusions or suspected gaps.

## Setup

Read [references/review-contract.md](references/review-contract.md) completely, then read Design, repository status/diff/untracked files, the applicable project instruction/standards files governing changed paths, and the supplied validation entrypoints or outputs. Confirm the supplied Design and workspace are the items under review. Do not accept the main agent's summary as evidence.

Work read-only in the shared working tree. Never create a worktree, edit files, or run mutating formatters/code generators. Non-mutating builds/tests are allowed when needed to verify evidence.

## Review

1. Build a checklist from every final Design success criterion, constraint, interface, failure behavior, production integration obligation, and durable project-documentation obligation.
2. Trace each requirement through the real runtime/editor/tooling call path. Confirm wiring, ownership, error/cleanup behavior, and compatibility boundaries.
3. Inspect the actual diff and surrounding consumers, not just named declarations or tests.
4. Audit generalization from the Design, public contracts, and domain invariants. Inspect implementation and validation for behavior coupled to visible examples, fixture/test names, exact names or IDs, incidental ordering or counts, current dimensions or data values, or the current dataset. Vary those irrelevant properties mentally or through already-authorized evidence and trace whether the same rule still holds. Do not demand behavior outside the authorized input class, and do not treat protocol-, schema-, or domain-required constants as overfitting.
5. Cross-check the actual diff against the supplied validation entrypoints and any raw evidence. Verify that each evidence type proves the claimed behavior and follows the project's deterministic-versus-visual validation rules. Passing examples are insufficient when the implementation or evidence does not exercise the governing invariant.
6. Reverse-audit every added dependency, abstraction, interface or factory, wrapper, configuration or flag, state copy or cache, compatibility path, fallback, file, and duplicated helper. Identify the Design criterion or inspected project constraint that requires it, and check whether existing project code, a shared seam, the standard library, the engine/platform, or an installed dependency already provides a complete solution. Report unsupported complexity, but do not optimize for raw line or file count and do not remove required validation, failure handling, security, accessibility, or project ownership boundaries.
7. Review naming through two evidence standards. First, enforce every applicable explicit project naming rule against newly introduced or renamed project-owned symbols; cite both the governing rule and violating symbol, and do not generalize examples into rules the project did not state. Second, inspect new or renamed domain types, stable interfaces, ownership/lifecycle boundaries, and symbols central to the changed logic for semantic mismatch. Report one only when evidence establishes `name-implied meaning -> actual responsibility or behavior -> concrete risk of misunderstanding, misuse, duplicated vocabulary, or unsafe maintenance`. Treat awkward noun/verb composition as a symptom only when it creates that demonstrated mismatch. Do not report incidental local wording, personal taste, a mechanically matched word or prefix, BCL/third-party names, framework-required signatures, or unchanged pre-existing symbols outside the implementation scope.
8. Inspect version-control ownership and documentation boundaries.
9. Report only evidence-backed P0/P1/P2 findings with tight file/line references and causal mechanisms.

## Output

Return the coverage table, findings, validation gaps, and exactly one verdict: `PASS`, `FAIL`, or `BLOCKED`.

`PASS` requires every criterion accounted for and no P0/P1. If a fix has multiple reasonable forms or changes intent, identify the user decision required; do not choose it.
