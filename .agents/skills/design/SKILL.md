---
name: design
description: Explores a change against the real repository and maintains a living, decision-complete Design before implementation planning. Use only when the user explicitly invokes $agent-workflow-kit:design; never start the workflow automatically from task complexity, risk, or ambiguity.
---

# Workflow Design

Turn an emerging change into a Ready Design through repository-grounded discussion. Do not plan implementation tasks or modify product code in this phase.

## Start

1. Before creating a workflow record, run `node scripts/preflight.mjs ensure --project-root <project-root>` from this skill directory. If it fails, stop without creating `workflow/`; never substitute a tracked ignore file.
2. Restore project context required by `AGENTS.md` and inspect relevant code, docs, recent changes, engine source, and existing active workflow records.
3. If the request contains independent subsystems, decompose it before detailed discussion.
4. Choose a folder-safe change name from the established intent. Create `workflow/active/<change-name>/design.md` from [assets/design.md](assets/design.md) early; do not wait until discussion ends.
5. Initialize the Design Coverage table. Mark a dimension `N/A` only with a recorded reason; otherwise leave it unresolved until evidence and any required decision exist.
6. Record known context immediately. Never make the user repeat information already present in the thread or repository.

## Discussion loop

Work through the unresolved Design Coverage dimensions in dependency order. Do not treat their headings as a form to fill silently.

1. Select the next unresolved dimension: purpose and success, scope, current implementation and references, architecture and boundaries, components and responsibilities, interfaces and contracts, data ownership and flow, implementation mechanics and integration points, failure/edge/compatibility behavior, or validation.
2. Investigate discoverable facts before asking the user. Inspect existing project patterns and relevant upstream/vendor source; add concrete findings and rejected hypotheses to `Evidence`.
3. Determine whether the evidence uniquely fixes the design. If two or more valid approaches remain, present 2-3 genuinely viable approaches with causal tradeoffs and a recommendation. Never invent weak alternatives just to reach a count.
4. Ask only for the remaining choice, one question at a time. A technical recommendation is not permission to choose for the user.
5. Immediately update the affected Design section, `Decisions`, `Open Questions`, and Design Coverage status after each material resolution.

Design-level implementation mechanics include algorithms, state transitions, ownership, dependencies, integration points, and how existing production paths will consume the change. Decide these before Plan; leave file-by-file task sequencing and command execution to Plan.

Reject unrelated refactors and speculative requirements. If a question is inherently visual, follow [references/visual-companion.md](references/visual-companion.md). Offer the companion just in time and start it only after explicit consent.

## Ready gate

Read [references/design-contract.md](references/design-contract.md) and run its readiness check. A populated template is not evidence of discussion or readiness. If any coverage dimension lacks inspected evidence, a recorded decision, or a justified `N/A`, continue the loop. If any implementation-shaping ambiguity remains, continue the discussion. Do not fill gaps with assumptions.

When the gate passes:

1. Set Design status to `Ready` and write `Open Questions: None`.
2. Briefly tell the user why discussion is complete.
3. Invoke `$agent-workflow-kit:plan` directly. There is no separate Design approval gate.

The only terminal state is transition to Workflow Plan.
