---
name: act
description: Use only when the current Agent Workflow Kit Design directly invokes Act with its exact design.md path after Plan records Ready and Implementation Authorization, or when resuming that exact Design's bound plan.md. Never use for ordinary implementation or a generic continue request.
---

# Workflow Act

Implement the approved Design without changing its intent. `plan.md` is local control state, not a second product-design phase or a file-by-file mandate; choose mechanical order from repository facts.

## Start

Require the exact `design.md` path supplied by the invoking Design, or recover it only from that same workflow's bound `plan.md`. Never scan `workflow/active/` to guess a Design from recency, folder names, or unrelated active records. Never create, infer, repair, or backfill either record.

If no exact current-workflow Design is identified, Act is not applicable. Return control to normal task handling without creating or modifying workflow records and without blocking the underlying non-workflow task.

Derive the sibling `plan.md` path from the exact Design path. Read both. Confirm Plan identifies that exact Design, records `Design State: Ready`, accepts the current revision in Written Design Review, classifies every Change Impact row, has no implementation-shaping Open Question, and explicitly authorizes that same revision. Inspect repository status and preserve unrelated user changes. If any precondition is false, stop Act without modifying product files.

## Workspace isolation gate

Before any product mutation, ask the user whether to create an isolated worktree for this authorized execution. Recommend isolation and state that it uses an available native mechanism first, otherwise the project's `.worktrees/` or `worktrees/` location in the order defined by [references/worktree-setup.md](references/worktree-setup.md), never a sibling default. State the proposed branch under the project's rule or Codex's `codex/<change-name>` default, and that a missing ignore rule may require a small setup commit.

Wait for the answer. If the user declines, record `Worktree Choice: Declined` and the current implementation workspace in Plan. If they accept, read the worktree reference and follow it exactly before mutation. Record `Created` or `Already isolated`, the absolute workspace path, branch, chosen location, baseline result, and any excluded unrelated dirty paths in Plan. On resumption, reuse the recorded workspace; do not ask again unless it is inaccessible or its recorded state conflicts with repository facts.

Read [references/doubt-protocol.md](references/doubt-protocol.md) before editing and use [references/validation-guide.md](references/validation-guide.md) throughout.

## Execution loop

Until every Design success criterion is evidenced:

1. Select an unmet success criterion or required production integration obligation and re-read its final Design constraints, affected system, and required evidence.
2. Investigate unclear repository facts read-only. Choose the next mechanical execution step from the actual dependency graph; do not ask the user about uniquely determined ordering.
3. Before mutation, confirm the Design-required validation entrypoint and prerequisites exist and can be invoked. If unavailable, stop before implementation and apply the doubt protocol.
4. If any implementation choice is not uniquely fixed by Design and repository facts, apply the doubt protocol and wait for the user.
5. Implement the smallest coherent change uniquely entailed by Design.
6. Run applicable validation and append raw results and production-path evidence to Plan.
7. Mark a success criterion covered only after required evidence exists. Record deviations immediately. If a deviation changes final Design, stop before further mutation: create a Plan Amendment, use the Design decision-card protocol, update only the affected selected Design content after the user responds, increment Plan Revision, repeat the affected self-review and written Design review, and obtain explicit reauthorization for that revision. Resume only after Plan records the new authorization.

Do not silently add dependencies, change APIs or formats, broaden scope, choose compatibility policy, introduce fallback behavior, skip evidence, or replace validation. Use required domain skills and follow the target project's version-control ownership rules.

Do not add or modify tests unless the user explicitly requested test work. Existing tests may be run when the approved Design names them as validation.

## Review and closure

After all work and agent-accessible validation finish:

1. Launch an independent subagent with `$agent-workflow-kit:review`, passing only `design.md`, `plan.md`, the implementation workspace root, and raw validation entrypoints. Do not pass your conclusions or suspected gaps.
2. If review returns P0/P1 or an unmet criterion, fix only when the required correction is uniquely determined. Otherwise ask the user before editing.
3. Ask the reviewer to re-check fixes until it returns `PASS`, or report a genuine `BLOCKED` decision/evidence dependency.
4. Reconcile Plan, final Design behavior, validation results, amendments, and review verdict.
5. Read [references/durable-decision-handoff.md](references/durable-decision-handoff.md). Classify every selected Design decision and amendment in Plan. Update the target project's required session log, ADR, architecture, or feature document for every Durable item, recording the exact target in Plan. A `PASS` means the change is ready to commit only after this handoff is complete.
6. At the change's next user-authorized commit boundary, commit approved project artifacts according to repository ownership rules. Never stage `workflow/**` merely to archive it.
7. Only after that commit succeeds, move the entire change folder from `workflow/active/` to `workflow/completed/`. If the commit fails or has not been authorized, leave it active and report it as ready to commit. Never create an empty commit solely to trigger archival.

Never claim completion before independent `PASS`.
