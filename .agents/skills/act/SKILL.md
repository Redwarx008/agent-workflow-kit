---
name: act
description: Use only when the current Agent Workflow Kit Design directly invokes Act with its exact design.md path after recording Ready and Implementation Authorization Approved, or when resuming execution.md already bound to that same exact Design. Never use for ordinary implementation or a generic continue request.
---

# Workflow Act

Implement the approved Design without changing its intent. Choose mechanical execution order from repository facts; do not create a separate implementation Plan.

## Start

Require the exact `design.md` path supplied by the invoking Design, or recover that exact path from an existing `execution.md` already bound to it. Never scan `workflow/active/` to guess a Design from recency, folder names, or unrelated active records. Never create, infer, repair, or backfill `design.md`.

If no exact current-workflow Design is identified, Act is not applicable. Return control to normal task handling without creating or modifying workflow records and without blocking the underlying non-workflow task.

Read that exact `design.md`. Confirm Design is Ready, every coverage dimension is resolved or justified `N/A`, the Change Impact Checklist is complete, Written Design Review accepts the current Revision, and `Implementation Authorization` explicitly approves that same Revision. Inspect repository status and preserve unrelated user changes. If any precondition is false, stop Act without modifying the Design.

Create or update `execution.md` from [assets/execution.md](assets/execution.md) and bind its `Authorized Design` field to that exact `design.md` path and its `Authorized Design Revision` field to the approved Revision. It records work already started or completed, evidence, doubts, and deviations; it must not become a speculative task plan.

Read [references/doubt-protocol.md](references/doubt-protocol.md) before editing and use [references/validation-guide.md](references/validation-guide.md) throughout.

## Execution loop

Until every Design success criterion is evidenced:

1. Select an unmet success criterion or required production integration obligation and re-read its Design decisions, constraints, affected system, and required evidence.
2. Investigate unclear repository facts read-only. Choose the next mechanical execution step from the actual dependency graph; do not ask the user about uniquely determined ordering.
3. Before mutation, confirm the Design-required validation entrypoint and prerequisites exist and can be invoked. If unavailable, stop before implementation and apply the doubt protocol.
4. If any implementation choice is not uniquely fixed by Design and repository facts, apply the doubt protocol and wait for the user.
5. Implement the smallest coherent change uniquely entailed by Design.
6. Run the applicable validation and append the raw result and production-path evidence to `execution.md`.
7. Mark a success criterion covered only after its required evidence exists. Record deviations immediately. If a deviation changes Design, stop before further mutation: create an `Awaiting user` Design Amendment, use the Design decision-card protocol, update the affected Decision Map, Change Impact Checklist, and sections after the user responds, increment Revision, repeat the affected self-review and written-design review, and obtain explicit reauthorization for that Revision. Resume only after `execution.md` records the new authorized Revision.

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
