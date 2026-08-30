# Design Dialogue

Discuss the design as a natural technical conversation, not a sequence of forms. Internal IDs, if a transient tool uses them, never appear to the user. Every question and selected-design explanation must contain the immediate context needed to understand it. For a technical design choice, that includes the grounded current behavior, the causal reason a choice exists now, and the material consequence of that choice. Do not leave any of that only in commentary, a reviewer report, a prior tool result, or `design.md`. Do not repeat settled background that does not affect the current choice.

## Choose the lightest useful turn

- **Clarify intent:** Ask one short, concrete question when the user's desired outcome is unknown. Do not recommend an answer before understanding the preference.
- **Select implementation scope:** For an exploratory comparison, audit, or disproved premise, present the evidence-backed candidates or conclusion in plain domain language and ask one question about which outcome, if any, belongs in this Design. Apply the current-code display rule below; do not invent a target API or implementation before the outcome is selected.
- **Choose a design direction:** In the same user-facing message, connect the current behavior to the failure, limitation, or tradeoff that makes the decision necessary; show every genuinely viable option and its distinguishing consequences; only after the options, give the recommendation and causal reason; then ask one direct question. Prefer easy finite choices when they fit; use an open question only when choices would distort the answer.
- **Explain a determined target:** Do this only when a cited project invariant or already sourced selected item leaves one valid target, and state why every materially different target would violate it. Current behavior, a nearby pattern, consistency, simplicity, implementation convenience, or reviewer agreement can support a recommendation but cannot by themselves turn future policy into a determined target. Record the governing evidence beside the final target under the Design contract. Do not manufacture alternatives or demand approval for behaviorally equivalent local details; ask when a materially different valid target remains.

Use headings only when they improve navigation in a long or structurally rich turn. Use domain titles that state what is being decided. Do not require fixed sections, repeated restatement of the same context, internal IDs, numbered cards, or a promised total such as `Design card 1/2` or `设计卡 1/2`; later evidence determines whether another question exists. When two or more finite choices are viable, label them sequentially `A`, `B`, `C`, explain them in comparable decision-relevant terms without marking one as recommended, then add a separate recommendation after the last option and end by asking the user to choose those labels. These labels are reply handles, not internal decision IDs. Ask exactly one decision per message and wait for the answer before resolving a dependent decision. Every option set must vary on one named decision axis. Shared premises must already be selected or determined under the cited-evidence rule above; if a shared or incidental clause could independently change scope, observable behavior, domain meaning, data or format, ownership or lifecycle, failure or compatibility behavior, or validation strength, split it into a separate decision. A label selection confirms only the named axis and the clauses that distinguish the selected option, never wording common to every option or an independent choice bundled inside one option. Selecting one, several, all, or none from an evidence-backed candidate set is one scope decision, not several confirmation gates.

Always make the whole viable choice space visible before anchoring on the recommendation, including for a narrow local decision. Identify the recommendation once, after the options, and explain its causal advantage rather than making the user infer it. Do not repeat the recommendation before and after the comparison.

After the user selects a direction, move to the next unresolved decision. An option already shown supplies the selected target without repetition. Carry the selected result into the outgoing discussion when it is needed to understand what follows. When the selection synthesizes a target beyond what the options showed, present its affected architecture, interfaces, data structures, ownership, and data flow together with the next dependent question, or in the completed coherent section before Design Review. Apply the current-code display rule below and show every decision-bearing detail required by the Design and illustration contracts before Design Review. Target presentation remains part of the continuing discussion rather than a separate stage or approval request.

## Make code changes inspectable

Whenever the turn proposes a concrete target that would change project code, show compact target-language code that makes the proposed contract or mechanism inspectable.

1. **Illustrative target:** show the smallest set of target-language fragments sufficient to inspect every decision-bearing implementation detail. Label it illustrative: it fixes the shown choices while leaving mechanical work to Act.

Investigate the repository before discussing the target. Build the user-facing evidence from concise `path:line` findings. For a decision about an existing symbol or call site, show the excerpt that exposes the interface, data shape, or control flow being chosen, paired with the target excerpt at the same code boundary.

Mechanically repeated call-site changes may be listed once instead of copied in full.

For multiple options, organize the selected evidence and target sketches as follows:

- place each shared excerpt once;
- give each materially different option only the code that exposes its distinctive behavior or boundary;
- describe a non-code distinction in prose when the options share the shown code.

Keep current and target blocks visually distinguishable when both are shown. Use localized labels that include the stable parenthetical markers `current code` and `illustrative target`, for example `当前代码（current code）— src/Feature.cs:42` and `目标示意代码（illustrative target）`. Every shown current block must include its `path:line`; do not make the user open the file merely to understand the comparison.

Apply [design-illustrations.md](design-illustrations.md) when architecture, interfaces, data structures, or data flow are affected. Use a tree to explain relationships, illustrative target code to expose the contract, and repository findings to establish the relevant current behavior. For a local change whose surrounding structure stays fixed, the relevant snippets are sufficient.

When an external or upstream implementation materially supports the recommendation, identify its version or revision and source file or symbol, explain the condition it solves, and compare that condition with this project's actual inputs, lifecycle, ownership, and constraints. Show a minimal reference mechanism when it is needed for the user to judge the recommendation. Treat the reference as supporting evidence when those operating conditions match.

## Resolve the turn

Interpret the reply only against the active question supplied by the evaluation contract; `design.md` supplies the choices already resolved.

A reply resolves that design choice only when it explicitly selects an option or target, explicitly corrects the proposal, or explicitly accepts the presented recommendation. A request for the agent to decide permits it to present one recommended target, but does not resolve the choice or mint `选择来源：用户确认。`; wait for explicit acceptance. Treat generic continuation such as “继续” or “下一步”, an evaluation of the reasoning, a partial response, or ambiguous wording as a request to remain on the active choice and ask one concise clarification.

The combined final gate defined by the Design process is the sole exception.
