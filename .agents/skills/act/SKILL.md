---
name: act
description: Use only when the current Agent Workflow Kit Design directly invokes Act with its exact design.md path after the user accepts the combined final Design-review and implementation-authorization gate. Never use for ordinary implementation or a generic continue request outside that gate.
---

# Workflow Act

Implement the approved Design without changing its intent. Choose mechanical order from repository facts; Design fixes product and technical decisions, not a file-by-file execution route.

## Start

Require the exact `design.md` path supplied by the invoking Design after the user's unqualified direct acceptance of the combined final Design-review and implementation-authorization gate. Never scan `workflow/active/` to guess a Design from recency, folder names, or unrelated active records. Never create, infer, repair, or backfill a workflow record.

If no exact current-workflow Design is identified, Act is not applicable. Return control to normal task handling without creating or modifying workflow records and without blocking the underlying non-workflow task.

Read the exact Design. Confirm the invoking Design directly followed that combined gate and its acceptance; do not demand another authorization phrase. If authorization is absent, was explicitly withheld, or no longer applies after a Design correction, stop Act without modifying product files. Inspect repository status and preserve unrelated user changes.

## Workspace isolation gate and execution

Read [references/act-contract.md](references/act-contract.md), [references/worktree-setup.md](references/worktree-setup.md), [references/doubt-protocol.md](references/doubt-protocol.md), [references/validation-guide.md](references/validation-guide.md), and [references/durable-decision-handoff.md](references/durable-decision-handoff.md) completely before product mutation.

Follow the Act contract exactly. Use the Design dialogue protocol when a material correction returns to Design. After implementation and agent-accessible validation, launch an independent subagent with `$agent-workflow-kit:review` as defined by the contract. Do not create a Plan, execution ledger, workspace record, or authorization record.
