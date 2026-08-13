---
name: review
description: Independently verifies an implementation against its authorized final Design, shared working tree, real production call paths, validation entrypoints, and intended input class rather than visible examples. Use automatically after Act completes as one ordinary reviewer for a simple implementation, or as parallel claim verifiers followed by one integration reviewer for a complex implementation; run read-only in the existing workspace.
---

# Workflow Review

Perform an independent completion audit, not implementation and not generic style review.

The main agent launches this skill with the active `design.md`, implementation workspace root, raw validation entrypoints, and any mode-specific inputs required by the review contract.

## Setup

Read [references/review-contract.md](references/review-contract.md) completely, identify the supplied review mode, then read Design, repository status/diff/untracked files, the applicable project rules governing changed paths, and the supplied validation evidence. Confirm the supplied Design and workspace are the items under review.

## Review

Apply the review rules for the supplied mode to the Design, working tree, production paths, project rules, and validation evidence. Do not replace them with a generic code-quality or style review.

## Output

Return exactly the report required by the review rules.
