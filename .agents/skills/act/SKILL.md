---
name: act
description: Executes an explicitly authorized workflow Plan, gathers criterion-matched evidence, stops on every unresolved implementation doubt, and launches independent review before completion. Use only after plan records user authorization, or when continuing implementation or closing review findings for an active authorized change.
---

# Workflow Act

Execute the approved Plan without changing Design intent.

## Start

Read active `design.md` and `plan.md` together. Confirm Design is Ready and Plan authorization is Approved. Inspect repository status and preserve unrelated user changes. If any precondition is false, stop.

Read [references/doubt-protocol.md](references/doubt-protocol.md) before editing and use [references/validation-guide.md](references/validation-guide.md) throughout.

## Task loop

For each unchecked task in order:

1. Re-read its Design anchors, constraints, affected system, and required evidence.
2. Investigate unclear repository facts read-only.
3. Before any mutation, confirm every Plan-required validation entrypoint and prerequisite exists and can be invoked. Inspect command/script availability without substituting or weakening the validation. If an entrypoint is unavailable, stop before implementation and apply the doubt protocol.
4. If uncertainty remains, apply the doubt protocol and wait for the user.
5. Implement the smallest coherent change uniquely entailed by Design and Plan.
6. Run the planned validation and record raw results in `plan.md`.
7. Mark the task complete only after its required evidence exists.

Do not silently add dependencies, change APIs or formats, broaden scope, choose compatibility policy, introduce fallback behavior, skip evidence, or replace validation. Use required domain skills and follow the target project's version-control ownership rules.

## Review and closure

After all tasks and agent-accessible validation finish:

1. Launch an independent subagent with `$agent-workflow-kit:review`, passing only the active record, repository root, and raw validation entrypoints. Do not pass your conclusions or suspected gaps.
2. If review returns P0/P1 or an unmet criterion, fix only when the required correction is uniquely determined. Otherwise ask the user before editing.
3. Ask the reviewer to re-check fixes until it returns `PASS`, or report a genuine `BLOCKED` decision/evidence dependency.
4. Reconcile the Completion Record, final Design behavior, validation results, deviations, and review verdict.
5. Apply required session log/ADR/architecture/feature updates. Move the entire change folder from `workflow/active/` to `workflow/completed/` only after `PASS`.

Never claim completion before independent `PASS`.
