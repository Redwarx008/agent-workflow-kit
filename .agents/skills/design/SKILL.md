---
name: design
description: Explores a change against the real repository and maintains a concise, decision-complete Design before authorized implementation. Use only when the user explicitly invokes $agent-workflow-kit:design; never start the workflow automatically from task complexity, risk, or ambiguity.
---

# Workflow Design

Turn an emerging change into a minimum-sufficient, user-reviewable Design through repository-grounded discussion. Do not create a separate user-facing Plan phase or modify product code in this phase.

## Start

1. Resolve the directory containing this `SKILL.md`, then run `node <design-skill-dir>/scripts/preflight.mjs ensure --project-root <project-root>` using that absolute script path. If it fails, stop without creating `workflow/`.
2. Restore project context required by `AGENTS.md`; inspect relevant code, docs, recent changes, engine/vendor source, and active workflow records.
3. If the request contains independent subsystems, map their boundaries and dependencies before detailed discussion, then ask the user which smallest meaningful change to Design first. Do not create one combined Design for several independent changes.
4. Create `workflow/active/<change-name>/design.md` from [assets/design.md](assets/design.md). It is the only persistent workflow record and is never Git content.
5. Do not create a Plan, execution ledger, authorization record, decision table, or research log. Keep only selected final facts and decisions in Design; evaluator and Visual Companion files are disposable `workflow/.local/` tool state.

## Discussion loop

Read [references/user-facing-decision-cards.md](references/user-facing-decision-cards.md), [references/decision-protocol-evaluation.md](references/decision-protocol-evaluation.md), and [references/design-contract.md](references/design-contract.md) before the first Design question. Read [references/design-illustrations.md](references/design-illustrations.md) before discussing architecture, data structures, or data flow.

1. Investigate discoverable facts first. Write only facts that constrain the selected final design into the relevant Design section; do not ask the user to repeat them or retain raw research notes.
2. Compare genuinely viable end-to-end approaches before local decisions. Lead with the recommendation. Present two or three only when they are real. Compare them in the conversation, then retain only the selected design in `design.md`; do not archive rejected options in either document.
3. Map the affected Design areas, then discuss them in dependency order: architecture and boundaries; production integration and interfaces; data structures, ownership, and flow; failure, compatibility, and lifecycle behavior; and validation. Every affected area must be shown to the user and confirmed or explicitly delegated before Ready, even when repository evidence leaves only one viable proposal. Omit only genuinely unaffected areas; do not create empty checklist chapters.
4. Show each affected area as one coherent target in domain language. When a material choice remains, present one self-contained decision: why now, recommendation first, genuine alternatives and consequences when applicable, then one clear question. When evidence uniquely constrains the target, present a recommendation-only confirmation card without inventing alternatives. Never expose internal tracking IDs as the question title. An area is discussed once the user has seen its self-contained target and has confirmed it, answered its material choice, or explicitly delegated it; do not add a duplicate chapter confirmation after that.
5. Before sending a decision card, run the decision-protocol evaluator with `--allow-pending`; correct every failure. After the user replies, append the reply to the disposable local transcript and re-run the evaluator before updating Design. Do not ask another decision, resolve a dependency, or implement before the user responds. Delete the transcript when its evaluator purpose is complete.
6. Inspect and discuss every affected production integration/call path, interface/contract, data structure/state, and data ownership/flow. Obtain the user's confirmation or explicit delegation for its target design. Repository evidence constrains the recommendation and may eliminate alternatives, but it never makes an affected area silent. A choice is material when it can change observable behavior, a stable contract, data meaning or ownership, persistence/migration, compatibility, scope, validation strength, or project risk.
7. For every affected architecture, data structure, or data flow, distinguish inspected current-state evidence from target proposals and include the corresponding compact structure tree or flow tree plus illustrative target-language code. For an affected interface or contract, include an illustrative signature or schema. Put target artifacts inside the recommended or alternative option they describe; after selection, write only the selected artifacts into Design. Do not generate artifacts for unaffected dimensions or prescribe incidental file layout and final syntax.
8. After each resolution, update the selected final Design section. Do not preserve internal IDs, question history, discarded approaches, user-authorization state, or a duplicate execution record.
9. While resolving each affected area, use concrete project evidence to check for likely failure, debt-forming choices, prematurely frozen internals, unstable contracts, and tempting shortcuts. When a risk can shape implementation, establish `project evidence -> causal failure mechanism -> consequence -> preventive design constraint` and integrate only the selected guardrail into the relevant Design content. If prevention requires a material choice, use the normal decision-card protocol. Do not run a separate generic pre-mortem, create risk headings to complete a checklist, or retain rejected shortcuts and resolved speculation.

Design decisions include any architecture, production wiring, interface, data meaning or ownership, state transition, failure behavior, compatibility, scope, or validation choice that can materially change the result. Act may choose mechanical order and behaviorally equivalent, local, reversible implementation details that do not alter the approved Design or a stable project contract. Reject unrelated refactors and speculative requirements. For a visual question, follow [references/visual-companion.md](references/visual-companion.md) and obtain consent before starting it.

## Ready gate

Run the Design contract. Do not become Ready while an affected Design area has not been discussed and confirmed or explicitly delegated, a material decision is awaiting the user, a repository fact needed to evaluate one is missing, or the written Design permits materially different implementations of an approved behavior or contract. Do not fill such gaps with assumptions.

When the gates pass:

1. Self-review the actual written `design.md` as one connected final Design for sufficiency, relevance, contradictions, scope drift, material ambiguity, useful illustrations, and placeholder/process leakage. Fix any finding inline, then reread the file.
2. Ask the user to review the self-reviewed `design.md`. If they request a correction, return to the loop and repeat the written-file self-review. This is the single comprehensive document-fidelity gate, not implementation authorization.
3. After acceptance, ask for explicit implementation authorization. Do not modify product code while waiting.
4. After authorization, invoke `$agent-workflow-kit:act` directly with the exact Design path. Never use a generic implementation or continuation request to select Act.

The only terminal state is transition to Workflow Act after explicit authorization.
