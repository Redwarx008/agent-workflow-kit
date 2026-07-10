---
name: plan
description: Converts a Ready workflow Design into a traceable, decision-complete implementation Plan. Use only when the user explicitly invokes $agent-workflow-kit:plan; never enter it automatically after Design or infer invocation from a Ready Design.
---

# Workflow Plan

Build an actionable execution contract from a Ready Design. Do not modify product code.

## Inputs

Read the active `design.md`, [assets/plan.md](assets/plan.md), related repository code/docs, and any existing `plan.md`. If Design is missing, not Ready, contradictory, or still contains an implementation-shaping question, stop and tell the user that `$agent-workflow-kit:design` must be invoked explicitly. Do not invoke or enter Design automatically.

## Plan

1. Preserve Design intent, scope, constraints, interfaces, and success criteria exactly.
2. Investigate repository facts before asking questions. If a planning choice is not uniquely determined, stop and ask the user one decision at a time.
3. Create or update `plan.md` from the template.
4. Define approach, execution constraints, ordered coherent tasks, task-specific validation, risks, and follow-ups.
5. Complete the traceability table so every success criterion maps to tasks and required evidence; every task must support a criterion or reduce a named risk.
6. Use [references/validation-guide.md](references/validation-guide.md). Do not substitute unit tests for visual/GPU evidence or silently weaken unavailable validation.
7. Include preservation of unrelated dirty files, project-specific version-control ownership, required domain skills, and session documentation where applicable.

## Completion gate

Planning is complete only when no product or technical decision is left to the implementer, task order is safe, evidence is obtainable, and risks have explicit handling.

Summarize the Plan and ask for explicit implementation authorization. Set `Authorization: Approved` only after the user authorizes it. Authorization does not invoke Act: after approval, stop and wait for the user to explicitly invoke `$agent-workflow-kit:act`.

The terminal state is an authorized Plan awaiting the user's explicit Act invocation.
