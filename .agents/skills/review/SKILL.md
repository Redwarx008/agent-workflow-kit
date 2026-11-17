---
name: review
description: Independently reviews an implementation against its authorized Design after Act. Checks real production paths, validation evidence, and intended inputs in the existing workspace, for the whole change or an assigned scope.
---

# Workflow Review

Perform an independent completion audit, not implementation and not generic style review.

The main agent supplies the active `design.md`, implementation workspace root, raw validation entrypoints, and any assigned scope.

## Setup

Read [../design/references/design-contract.md](../design/references/design-contract.md) and [references/review-contract.md](references/review-contract.md) completely. Follow the Design reading rules and inspect the supplied workspace, its diff and untracked files, relevant project rules, and validation evidence.

## Review

Apply the review contract to the assigned scope; return its evidence and verdict.
