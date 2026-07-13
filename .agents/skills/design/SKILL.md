---
name: design
description: Explores a change against the real repository and maintains a living, decision-complete Design before authorized implementation. Use only when the user explicitly invokes $agent-workflow-kit:design; never start the workflow automatically from task complexity, risk, or ambiguity.
---

# Workflow Design

Turn an emerging change into a Ready Design through repository-grounded discussion. Do not create an implementation task sequence or modify product code in this phase.

## Start

1. Resolve the directory containing this `SKILL.md` as `<design-skill-dir>`, then run `node <design-skill-dir>/scripts/preflight.mjs ensure --project-root <project-root>` using that absolute script path. Do not resolve `scripts/preflight.mjs` relative to the project root or the shell's current directory. If the resolved script is missing or the command fails, stop without creating `workflow/`; never substitute a tracked ignore file.
2. Restore project context required by `AGENTS.md` and inspect relevant code, docs, recent changes, engine source, and existing active workflow records.
3. If the request contains independent subsystems, decompose it before detailed discussion.
4. Choose a folder-safe change name from the established intent. Create `workflow/active/<change-name>/design.md` from [assets/design.md](assets/design.md) early; do not wait until discussion ends.
5. Initialize Revision `1`, the Decision Map, Change Impact Checklist, and Design Coverage table. Add the known decisions and their dependencies; mark a dimension `N/A` only with a recorded reason, otherwise leave it unresolved until evidence and any required decision exist. Decision Map IDs are internal traceability only; never expose raw `D-xxx` labels as the user's question title.
6. Record known context immediately. Never make the user repeat information already present in the thread or repository.

## Discussion loop

Work through the Decision Map and unresolved Design Coverage dimensions in dependency order. Do not treat their headings as a form to fill silently. Read [references/user-facing-decision-cards.md](references/user-facing-decision-cards.md) and [references/decision-protocol-evaluation.md](references/decision-protocol-evaluation.md) before asking the first design question. Read [references/design-illustrations.md](references/design-illustrations.md) before discussing architecture, data structures, or data flow.

### Overall approach first

After exploring the goal, scope, current code, and references, compare the genuinely viable end-to-end architecture approaches before asking local interface or data-structure decisions. Lead with the recommended approach and its causal rationale. Present 2-3 approaches when the repository leaves that many viable; never manufacture weak alternatives. Ask the user to choose or adjust the overall direction, then record it in the internal Decision Map and `Overall Approaches Considered`.

### User-facing discussion

Present decisions as coherent design chapters, for example production migration, canonical data contract, component boundaries, data flow, error behavior, and validation, not as a sequence of internal decision IDs. A chapter summary may give context, but it must not request or imply confirmation for more than one decision. Each user message must be self-contained: the living `design.md` is an audit and recovery record, never a reason to omit the facts, proposal, or consequences from the message.

1. Select the next decision whose dependencies are resolved: purpose and success, scope, current implementation and references, architecture and boundaries, components and responsibilities, targeted enabling improvements, production integration and call path, interfaces and contracts, data model/state/structure, data ownership and flow, implementation mechanics and integration points, failure/edge/compatibility behavior, or validation. Record dependencies instead of silently choosing a fixed questionnaire order.
2. Investigate discoverable facts before asking the user. Inspect existing project patterns and relevant upstream/vendor source; add concrete findings and rejected hypotheses to `Evidence`.
3. Distinguish facts from design decisions. Repository evidence may constrain a design but never substitutes the user's confirmation of an affected integration path, interface, data structure/state model, or data flow.
4. Ask exactly one decision question per message. Before sending it, use the decision-protocol evaluator with `--allow-pending`; correct every failure. Then mark the Decision Map entry `Awaiting user` and append the question, facts, proposal, and recommendation to Discussion Trace. After the user replies, append that reply to the transient transcript and re-run the evaluator before resolving the map entry. Do not ask another design question, resolve a dependent decision, or take implementation action until the user responds.
5. Use the user-facing decision-card format from the reference: a domain title that says what is being decided; why it must be decided now; the recommended choice first with causal rationale; viable alternatives and consequences; then one clear confirmation/change question. Prefer concise A/B/C choices when the decision is finite; open wording is allowed when it is not.
6. For each affected mandatory decision, ask in dependency order: production integration and call path; interfaces and contracts; data model/state/structures; data ownership and flow. A technical recommendation is not permission to choose for the user.
7. If two or more valid approaches remain, present 2-3 genuinely viable approaches with causal tradeoffs and a recommendation. Never invent weak alternatives just to reach a count. If evidence leaves one viable proposal, still ask the user to confirm that proposal before resolving the affected dimension.
8. For every non-trivial new or changed data model, state, collection, key/index, cache, or persisted payload, explicitly describe its representation, invariants, ownership, lifecycle, mutation path, and compatibility implications.
9. For each affected component, record its one purpose, consumers/how it is used, dependencies, stable external contract, and which internal details can change without breaking those consumers. If the target code's existing structure blocks the goal, present the smallest causally necessary enabling improvement for the user's scope decision; reject unrelated refactors.
10. For every affected architecture, data-structure, or data-flow decision, include its required tree or flow tree and illustrative code in both the Design and the self-contained decision card. Mark the transient evaluator transcript `architecture-decision`, `data-structure-decision`, or `data-flow-decision` so the evaluator checks these artifacts. Use the target language and label snippets illustrative; never replace a tree or code sketch with vague prose.
11. Immediately update the affected Design section, `Open Questions`, Decision Map, Discussion Trace, Change Impact Checklist, and Design Coverage status after each material resolution. Record the user's confirmation, rejection, or explicit delegation; never infer it from an implementation authorization. `Decisions` is a concise stable summary of confirmed map entries, never a second source of lifecycle status.

Design-level implementation mechanics include algorithms, state transitions, ownership, dependencies, integration points, and how existing production paths will consume the change. Data structure selection, production wiring, interfaces, and data flow are Design decisions, not Act details. For an affected dimension, no representation is final until the user confirms it or explicitly delegates the choice; only a genuinely inapplicable dimension may be recorded `N/A` without confirmation. Decide these before Act. Do not prescribe a file-by-file task sequence; Act may choose mechanical execution order from the current repository.

Reject unrelated refactors and speculative requirements. If a question is inherently visual, follow [references/visual-companion.md](references/visual-companion.md). Offer the companion just in time and start it only after explicit consent.

## Ready gate

Read [references/design-contract.md](references/design-contract.md) and run its readiness check. A populated template is not evidence of discussion or readiness. If any coverage dimension lacks inspected evidence, a recorded decision, or a justified `N/A`, continue the loop. If any Change Impact Checklist item lacks a result, any Decision Map entry is `Awaiting user`, any implementation-shaping ambiguity remains, or the integrated design has not been walked through with the user, continue the discussion. Do not fill gaps with assumptions.

When the gate passes:

1. Present a concise connected walkthrough in the same domain chapters: architecture, components, production call path, interfaces, data model/state, data flow, failure behavior, and validation. Include the required trees, flow tree, and illustrative code for affected architecture, data, and flow decisions. Ask one final correction question; this is the last Design discussion topic, not implementation authorization.
2. Apply any correction through the normal decision loop. Otherwise self-review the written Design for placeholders, contradictions, scope drift, ambiguous requirements, Change Impact completeness, and decision-status consistency, then record the result.
3. Ask the user to review the completed local `design.md` at its current Revision. Wait for their response; if they request a correction, return to the normal decision loop and repeat the self-review. This is a document-fidelity gate, not implementation authorization.
4. Only after the user accepts the written Design, set Design status to `Ready` and write `Open Questions: None`. Briefly tell the user why discussion is complete and ask for explicit implementation authorization for the current Revision. Do not modify product code while waiting.
5. After the user authorizes implementation, record `Implementation Authorization: Approved for Revision <n>` in `design.md` and invoke `$agent-workflow-kit:act` directly, passing the exact path of this Design. Never rely on a generic implementation or continuation request to select Act.

The only terminal state is transition to Workflow Act after explicit authorization.
