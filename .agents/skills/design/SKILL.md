---
name: design
description: Explores a change against the real repository and maintains a concise, decision-complete Design before authorized implementation. Use only when the user explicitly invokes $agent-workflow-kit:design; never start the workflow automatically from task complexity, risk, or ambiguity.
---

# Workflow Design

Turn an emerging change into a minimum-sufficient, user-reviewable Design through repository-grounded discussion. Do not create a separate user-facing Plan phase or modify product code in this phase.

## Start

1. Resolve the directory containing this `SKILL.md`, then run `node <design-skill-dir>/scripts/preflight.mjs ensure --project-root <project-root>` using that absolute script path. If it fails, stop without creating `workflow/`.
2. Read [references/exploration-contract.md](references/exploration-contract.md) completely, then restore project context and perform its pre-question exploration. Follow the target project's documentation indexes and reading order. Do not read recent session logs by default; use them only when project rules or a concrete need for unfinished-work or historical evidence makes them relevant.
3. Create `workflow/active/<change-name>/design.md` from [assets/design.md](assets/design.md). It is the only persistent workflow record and is never Git content.

## Run

Read [references/design-process.md](references/design-process.md), [references/design-contract.md](references/design-contract.md), [references/design-dialogue.md](references/design-dialogue.md), and [references/decision-protocol-evaluation.md](references/decision-protocol-evaluation.md) completely before the first substantive question. Read [references/design-illustrations.md](references/design-illustrations.md) before the first affected architecture, interface, data-structure, or data-flow discussion. Read [references/visual-companion.md](references/visual-companion.md) only when a visual question may qualify. Use [references/design-review-contract.md](references/design-review-contract.md) for the independent Ready review.

Follow the loaded process and contracts exactly; do not modify product files. Complete the implementation or no-implementation Ready transition defined by the Design process.

After Design Review, classify every P0/P1 through the review-disposition gate before editing the affected Design sections. Never turn a reviewer-classified user decision into a mechanical correction on the Design author's judgment alone.
