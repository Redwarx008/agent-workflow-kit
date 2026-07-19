---
name: act
description: Use only when the current Agent Workflow Kit Design directly invokes Act with its exact design.md path after the user explicitly authorizes implementation. Never use for ordinary implementation or a generic continue request.
---

# Workflow Act

Implement the approved Design without changing its intent. Choose mechanical order from repository facts; Design fixes product and technical decisions, not a file-by-file execution route.

## Start

Require the exact `design.md` path supplied by the invoking Design after the user's explicit authorization. Never scan `workflow/active/` to guess a Design from recency, folder names, or unrelated active records. Never create, infer, repair, or backfill a workflow record.

If no exact current-workflow Design is identified, Act is not applicable. Return control to normal task handling without creating or modifying workflow records and without blocking the underlying non-workflow task.

Read the exact Design. Confirm the invoking Design directly followed the user's explicit implementation authorization; if that authorization is absent or no longer applies after a Design correction, stop Act without modifying product files. Inspect repository status and preserve unrelated user changes.

## Workspace isolation gate

Before any product mutation, ask the user whether to create an isolated worktree for this authorized execution. Recommend isolation and state that it uses an available native mechanism first, otherwise the project's `.worktrees/` or `worktrees/` location in the order defined by [references/worktree-setup.md](references/worktree-setup.md), never a sibling default. State the proposed branch under the project's rule or Codex's `codex/<change-name>` default, and that a missing ignore rule may require a small setup commit.

Wait for the answer. If the user declines, use the current workspace. If they accept, read the worktree reference and follow it exactly before mutation. Carry the exact Design path and chosen implementation workspace directly into Review; do not create a workspace record or execution ledger. During one uninterrupted Act, reuse the chosen workspace; never reconstruct it by scanning workflow records after context loss.

Read [references/doubt-protocol.md](references/doubt-protocol.md) before editing and use [references/validation-guide.md](references/validation-guide.md) throughout.

## Execution loop

Until every Design success criterion is evidenced:

1. Select an unmet success criterion or required production integration obligation and re-read its final Design constraints, affected system, and required evidence.
2. Investigate unclear repository facts read-only. Trace the real production flow and relevant callers before choosing the implementation seam. For a bug, prefer one shared root-cause correction over repeated symptom patches only when it is behaviorally consistent with the approved Design; if the shared correction changes additional behavior or scope, apply the doubt protocol.
3. Before mutation, confirm the Design-required validation entrypoint and prerequisites exist and can be invoked. If unavailable, stop before implementation and apply the doubt protocol.
4. If research leaves materially different implementation choices as defined by the doubt protocol, apply that protocol and wait for the user. Do not treat behaviorally equivalent, local, reversible details as new product decisions.
5. Before adding code, apply the solution-reduction ladder in order: no new mechanism; existing project code or shared seam; standard-library or engine/platform capability; already-installed dependency; minimum project-local implementation. Use the first option that completely satisfies the approved Design and project constraints. If it reveals that the approved Design requires a material correction, stop and return through the Design decision protocol instead of silently simplifying it.
6. Implement the smallest coherent change consistent with the Design. Do not add an abstraction, interface, factory, wrapper, dependency, configuration surface, state copy or cache, compatibility path, fallback, or file solely for hypothetical future use. Prefer deletion and conventional code when behavior and responsibilities remain clear, but never optimize for the fewest lines or files at the expense of the project's ownership and organization rules.
7. Run applicable validation and retain its command/output only as transient tool or conversation evidence for the current Act and Review handoff; do not create a persistent execution ledger.
8. Mark a success criterion covered only after required evidence exists. If a deviation changes final Design, stop before further mutation: use the Design decision-card protocol, update only the affected selected Design content after the user responds, repeat the affected self-review and written Design review, and obtain explicit reauthorization. Resume only after that authorization.

Do not silently add dependencies, change APIs or formats, broaden scope, choose compatibility policy, introduce fallback behavior, skip evidence, or replace validation. Use required domain skills and follow the target project's version-control ownership rules.

Do not add or modify tests unless the user explicitly requested test work. Existing tests may be run when the approved Design names them as validation.

## Review and closure

After all work and agent-accessible validation finish:

1. Launch an independent subagent with `$agent-workflow-kit:review`, passing only `design.md`, the implementation workspace root, and raw validation entrypoints. Do not pass your conclusions or suspected gaps.
2. If review returns P0/P1 or an unmet criterion, fix only when the required correction is uniquely determined. Otherwise ask the user before editing.
3. Ask the reviewer to re-check fixes until it returns `PASS`, or report a genuine `BLOCKED` decision/evidence dependency.
4. Reconcile final Design behavior, validation results, amendments, and review verdict.
5. Read [references/durable-decision-handoff.md](references/durable-decision-handoff.md). Update the target project's required session log, ADR, architecture, or feature document for every durable selected decision or amendment. A `PASS` means the change is ready to commit only after this handoff is complete.
6. At the change's next user-authorized commit boundary, commit approved project artifacts according to repository ownership rules. Never stage `workflow/**` merely to archive it.
7. Only after that commit succeeds, delete any completed local evaluator or Visual Companion state, then move `design.md` from `workflow/active/<change>/` to `workflow/completed/<change>/`. If the commit fails or has not been authorized, leave Design active and report it as ready to commit. Never create an empty commit solely to trigger archival.

Never claim completion before independent `PASS`.
