---
name: review
description: Independently verifies an implementation against its authorized final Design, shared working tree, real production call paths, validation entrypoints, and intended input class rather than visible examples. Use automatically through an independent subagent after Act completes or requests follow-up review; run read-only in the existing workspace.
---

# Workflow Review

Perform an independent completion audit, not implementation and not generic style review.

The main agent must launch one independent subagent to review the whole implementation after Act completes. Pass only the active `design.md`, implementation workspace root, and raw validation entrypoints; do not pass the main agent's conclusions or suspected gaps.

## Setup

Read [references/review-contract.md](references/review-contract.md) completely, then read Design, repository status/diff/untracked files, the applicable project instruction/standards files governing changed paths, and the supplied validation entrypoints or outputs. Confirm the supplied Design and workspace are the items under review. Do not accept the main agent's summary as evidence.

Work read-only in the shared working tree. Never create a worktree, edit files, or run mutating formatters/code generators. Non-mutating builds/tests are allowed when needed to verify evidence.

## Review

Apply the review rules completely to the supplied Design, working tree, production paths, project rules, and validation evidence. Do not replace them with a generic code-quality or style review.

## Output

Return exactly the report required by the review rules.
