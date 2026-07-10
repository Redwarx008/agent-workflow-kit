---
name: act
description: Executes an explicitly authorized workflow Plan and gathers criterion-matched evidence while stopping on every unresolved implementation doubt. Use only when the user explicitly invokes $agent-workflow-kit:act and the Plan records authorization; never infer invocation from authorization or enter Review automatically.
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

## Handoff to Review

After all tasks and agent-accessible validation finish:

1. Reconcile the provisional Completion Record, final Design behavior, validation results, and deviations.
2. Report that implementation and agent-accessible validation are complete but independent acceptance is still pending.
3. Stop and wait for the user to explicitly invoke `$agent-workflow-kit:review`. Do not launch a reviewer or enter Review automatically.
4. Leave the change folder in `workflow/active/`; archival and final completion remain blocked until an explicit Review returns `PASS`.

Never claim completion before independent `PASS`.
