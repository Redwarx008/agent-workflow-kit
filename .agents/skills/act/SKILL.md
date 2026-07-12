---
name: act
description: Implements an explicitly authorized Ready Design, keeps a factual execution record, stops on every unresolved implementation doubt, and launches independent review before completion. Use automatically after the active Design records user authorization, or when continuing implementation or closing review findings.
---

# Workflow Act

Implement the approved Design without changing its intent. Choose mechanical execution order from repository facts; do not create a separate implementation Plan.

## Start

Read active `design.md`. Confirm Design is Ready, every coverage dimension is resolved or justified `N/A`, and `Implementation Authorization` is `Approved`. Inspect repository status and preserve unrelated user changes. If any precondition is false, stop.

Create or update `execution.md` from [assets/execution.md](assets/execution.md). It records work already started or completed, evidence, doubts, and deviations; it must not become a speculative task plan.

Read [references/doubt-protocol.md](references/doubt-protocol.md) before editing and use [references/validation-guide.md](references/validation-guide.md) throughout.

## Execution loop

Until every Design success criterion is evidenced:

1. Select an unmet success criterion or required production integration obligation and re-read its Design decisions, constraints, affected system, and required evidence.
2. Investigate unclear repository facts read-only. Choose the next mechanical execution step from the actual dependency graph; do not ask the user about uniquely determined ordering.
3. Before mutation, confirm the Design-required validation entrypoint and prerequisites exist and can be invoked. If unavailable, stop before implementation and apply the doubt protocol.
4. If any implementation choice is not uniquely fixed by Design and repository facts, apply the doubt protocol and wait for the user.
5. Implement the smallest coherent change uniquely entailed by Design.
6. Run the applicable validation and append the raw result and production-path evidence to `execution.md`.
7. Mark a success criterion covered only after its required evidence exists. Record deviations immediately; any deviation that changes Design requires user confirmation before further mutation.

Do not silently add dependencies, change APIs or formats, broaden scope, choose compatibility policy, introduce fallback behavior, skip evidence, or replace validation. Use required domain skills and follow the target project's version-control ownership rules.

Do not add or modify tests unless the user explicitly requested test work. Existing tests may be run when the approved Design names them as validation.

## Review and closure

After all tasks and agent-accessible validation finish:

1. Launch an independent subagent with `$agent-workflow-kit:review`, passing only `design.md`, `execution.md`, the repository root, and raw validation entrypoints. Do not pass your conclusions or suspected gaps.
2. If review returns P0/P1 or an unmet criterion, fix only when the required correction is uniquely determined. Otherwise ask the user before editing.
3. Ask the reviewer to re-check fixes until it returns `PASS`, or report a genuine `BLOCKED` decision/evidence dependency.
4. Reconcile `execution.md`, final Design behavior, validation results, deviations, and review verdict.
5. Apply required session log/ADR/architecture/feature updates. A `PASS` means the change is ready to commit, not yet archived.
6. At the change's next user-authorized commit boundary, commit the approved project artifacts according to the repository's ownership rules. Never stage `workflow/**` merely to archive it.
7. Only after that commit succeeds, move the entire change folder from `workflow/active/` to `workflow/completed/`. If the commit fails or has not been authorized, leave it active and report it as ready to commit. Never create an empty commit solely to trigger archival.

Never claim completion before independent `PASS`.
