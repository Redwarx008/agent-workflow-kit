---
name: design
description: Explores a change against the real repository and maintains a living, decision-complete Design before authorized implementation. Use only when the user explicitly invokes $agent-workflow-kit:design; never start the workflow automatically from task complexity, risk, or ambiguity.
---

# Workflow Design

Turn an emerging change into a Ready Design through repository-grounded discussion. Do not create an implementation task sequence or modify product code in this phase.

## Start

1. Before creating a workflow record, run `node scripts/preflight.mjs ensure --project-root <project-root>` from this skill directory. If it fails, stop without creating `workflow/`; never substitute a tracked ignore file.
2. Restore project context required by `AGENTS.md` and inspect relevant code, docs, recent changes, engine source, and existing active workflow records.
3. If the request contains independent subsystems, decompose it before detailed discussion.
4. Choose a folder-safe change name from the established intent. Create `workflow/active/<change-name>/design.md` from [assets/design.md](assets/design.md) early; do not wait until discussion ends.
5. Initialize the Design Coverage table. Mark a dimension `N/A` only with a recorded reason; otherwise leave it unresolved until evidence and any required decision exist.
6. Record known context immediately. Never make the user repeat information already present in the thread or repository.

## Discussion loop

Work through the unresolved Design Coverage dimensions in dependency order. Do not treat their headings as a form to fill silently.

1. Select the next unresolved dimension: purpose and success, scope, current implementation and references, architecture and boundaries, components and responsibilities, production integration and call path, interfaces and contracts, data model/state/structure, data ownership and flow, implementation mechanics and integration points, failure/edge/compatibility behavior, or validation.
2. Investigate discoverable facts before asking the user. Inspect existing project patterns and relevant upstream/vendor source; add concrete findings and rejected hypotheses to `Evidence`.
3. Distinguish facts from design decisions. Repository evidence may constrain a design but never substitutes the user's confirmation of an affected integration path, interface, data structure/state model, or data flow.
4. For each affected mandatory decision, present a short concrete proposal grounded in the inspected code, then ask the user to confirm or change it, one topic at a time, in this order: production integration and call path; interfaces and contracts; data model/state/structures; data ownership and flow. A technical recommendation is not permission to choose for the user.
5. If two or more valid approaches remain, present 2-3 genuinely viable approaches with causal tradeoffs and a recommendation. Never invent weak alternatives just to reach a count. If evidence leaves one viable proposal, still ask the user to confirm that proposal before resolving the affected dimension.
6. For every non-trivial new or changed data model, state, collection, key/index, cache, or persisted payload, explicitly describe its representation, invariants, ownership, lifecycle, mutation path, and compatibility implications.
7. Immediately update the affected Design section, `Decisions`, `Open Questions`, and Design Coverage status after each material resolution. Record the user's confirmation, rejection, or explicit delegation; never infer it from an implementation authorization.

Design-level implementation mechanics include algorithms, state transitions, ownership, dependencies, integration points, and how existing production paths will consume the change. Data structure selection, production wiring, interfaces, and data flow are Design decisions, not Act details. For an affected dimension, no representation is final until the user confirms it or explicitly delegates the choice; only a genuinely inapplicable dimension may be recorded `N/A` without confirmation. Decide these before Act. Do not prescribe a file-by-file task sequence; Act may choose mechanical execution order from the current repository.

Reject unrelated refactors and speculative requirements. If a question is inherently visual, follow [references/visual-companion.md](references/visual-companion.md). Offer the companion just in time and start it only after explicit consent.

## Ready gate

Read [references/design-contract.md](references/design-contract.md) and run its readiness check. A populated template is not evidence of discussion or readiness. If any coverage dimension lacks inspected evidence, a recorded decision, or a justified `N/A`, continue the loop. If any implementation-shaping ambiguity remains, continue the discussion. Do not fill gaps with assumptions.

When the gate passes:

1. Set Design status to `Ready` and write `Open Questions: None`.
2. Briefly tell the user why discussion is complete.
3. Ask for explicit implementation authorization. Do not modify product code while waiting.
4. After the user authorizes implementation, set `Implementation Authorization: Approved` in `design.md` and invoke `$agent-workflow-kit:act` directly.

The only terminal state is transition to Workflow Act after explicit authorization.
