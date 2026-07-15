---
name: design
description: Explores a change against the real repository and maintains a concise, decision-complete Design before authorized implementation. Use only when the user explicitly invokes $agent-workflow-kit:design; never start the workflow automatically from task complexity, risk, or ambiguity.
---

# Workflow Design

Turn an emerging change into a final, user-reviewable Design through repository-grounded discussion. Do not create a separate user-facing Plan phase or modify product code in this phase.

## Start

1. Resolve the directory containing this `SKILL.md`, then run `node <design-skill-dir>/scripts/preflight.mjs ensure --project-root <project-root>` using that absolute script path. If it fails, stop without creating `workflow/`.
2. Restore project context required by `AGENTS.md`; inspect relevant code, docs, recent changes, engine/vendor source, and active workflow records.
3. If the request contains independent subsystems, decompose it before detailed discussion.
4. Create `workflow/active/<change-name>/design.md` from [assets/design.md](assets/design.md) and its local `plan.md` from [assets/plan.md](assets/plan.md). `design.md` is final user-facing content; `plan.md` is private agent control state. Neither is Git content.
5. Initialize Plan Revision `1`, Decision State, Change Impact, and known dependencies. Do not put internal IDs, question history, status tables, discarded approaches, or raw research logs in Design.

## Discussion loop

Read [references/user-facing-decision-cards.md](references/user-facing-decision-cards.md), [references/decision-protocol-evaluation.md](references/decision-protocol-evaluation.md), [references/design-contract.md](references/design-contract.md), and [references/plan-contract.md](references/plan-contract.md) before the first Design question. Read [references/design-illustrations.md](references/design-illustrations.md) before discussing architecture, data structures, or data flow.

1. Investigate discoverable facts first. Record only the facts that constrain an unresolved or selected decision in Plan; do not ask the user to repeat them.
2. Compare genuinely viable end-to-end approaches before local decisions. Lead with the recommendation. Present two or three only when they are real. Compare them in the conversation, then retain only the selected design in `design.md`; do not archive rejected options in either document.
3. Present one self-contained decision at a time in domain language: why now, recommendation first, genuine alternatives and consequences when applicable, then one clear question. Never expose internal Plan IDs as the question title.
4. Before sending a decision card, run the decision-protocol evaluator with `--allow-pending`; correct every failure. Mark the corresponding Plan decision `Awaiting user`. After the user replies, append the reply to the transient local transcript and re-run the evaluator before resolving that Plan entry. Do not ask another decision, resolve a dependency, or implement before the user responds.
5. For affected production integration/call paths, interfaces/contracts, data structures/state, and data ownership/flow, obtain the user's confirmation or explicit delegation. Repository evidence constrains a proposal but does not replace that choice.
6. For every affected architecture, data structure, or data flow, distinguish inspected current-state evidence from target proposals. Put target trees/flow trees and illustrative code under the recommended or alternative option that they describe. After selection, write only the selected artifacts into Design.
7. After each resolution, update the selected final Design section and the concise Plan state: decision result, open question, constraining evidence, impact, and user confirmation. Do not duplicate final Design prose in Plan.

Design decisions include architecture, components, production wiring, interfaces, data structures, state transitions, ownership, data flow, failure behavior, compatibility, and validation. Act may choose only mechanical execution order. Reject unrelated refactors and speculative requirements. For a visual question, follow [references/visual-companion.md](references/visual-companion.md) and obtain consent before starting it.

## Ready gate

Run both contracts. Do not become Ready while Plan has evidence-pending or awaiting-user material decisions, an unclassified impact, or an implementation-shaping open question. Do not fill gaps with assumptions.

When the gates pass:

1. Present the connected final Design: only its selected architecture, integration, interfaces, data model/flow, failure behavior, and validation. Ask one final correction question.
2. Apply any correction through the normal loop. Otherwise self-review Design for finality, relevance, contradictions, scope drift, ambiguity, required illustrations, and placeholder/process leakage. Self-review Plan separately for unresolved gate state.
3. Ask the user to review the completed `design.md` at the current Plan Revision. If they request a correction, return to the loop and repeat both checks. This is a document-fidelity gate, not implementation authorization.
4. After acceptance, record `Design State: Ready` and `Written Design Review: Accepted for Revision <n>` in Plan. Ask for explicit implementation authorization. Do not modify product code while waiting.
5. After authorization, record `Implementation Authorization: Approved for Revision <n>` in Plan and invoke `$agent-workflow-kit:act` directly with the exact Design path. Never use a generic implementation or continuation request to select Act.

The only terminal state is transition to Workflow Act after explicit authorization.
