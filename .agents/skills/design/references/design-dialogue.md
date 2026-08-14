# Design Dialogue

Discuss the design as a natural technical conversation, not a sequence of forms. Internal IDs, if a transient tool uses them, never appear to the user. Every question must contain the immediate context needed to answer it. For a technical design choice, that includes the grounded current behavior, the causal reason a choice exists now, and the material consequence of that choice. Do not leave any of that only in commentary, a reviewer report, a prior tool result, or `design.md`. Do not repeat settled background that does not affect the current choice.

## Choose the lightest useful turn

- **Clarify intent:** Ask one short, concrete question when the user's desired outcome is unknown. Do not recommend an answer before understanding the preference.
- **Select implementation scope:** For an exploratory comparison, audit, or disproved premise, present the evidence-backed candidates or conclusion in plain domain language and ask one question about which outcome, if any, belongs in this Design. Show current code or configuration evidence when it materially proves the claim, but do not invent a target API or implementation before the outcome is selected.
- **Choose a design direction:** In the same user-facing message, connect the current behavior to the failure, limitation, or tradeoff that makes the decision necessary; show the genuinely viable options and their distinguishing consequences; give the recommendation and causal reason; then ask one direct question. Prefer easy finite choices when they fit; use an open question only when choices would distort the answer.
- **Explain a determined target:** When repository evidence and earlier decisions leave one valid target, explain it in the relevant coherent Design section. Do not manufacture alternatives or demand a separate approval for every architecture, interface, or data dimension. Ask only if a real unresolved choice remains; the final Design gate checks the assembled result.

Use headings only when they improve navigation in a long or structurally rich turn. Use domain titles that state what is being decided. Do not require fixed sections, repeated restatement of the same context, internal IDs, numbered cards, or a promised total such as `Design card 1/2` or `设计卡 1/2`; later evidence determines whether another question exists. When two or more finite choices are viable, label them sequentially `A`, `B`, `C`, place the recommendation marker on the applicable option, and end by asking the user to choose those labels. These labels are reply handles, not internal decision IDs. Ask exactly one decision per message and wait for the answer before resolving a dependent decision. Selecting one, several, all, or none from an evidence-backed candidate set is one scope decision, not several confirmation gates.

For several materially different end-to-end approaches, make the whole choice space visible before anchoring on the recommendation. For a narrow local decision where the alternatives and evidence are already established, the recommendation may lead. In either case, identify the recommendation clearly and explain its causal advantage rather than making the user infer it.

## Make code changes inspectable

Whenever the turn proposes a concrete target that would change project code, show a direct before/after design comparison. A question about whether an outcome belongs in scope is not yet a concrete target; do not use that distinction to hide code once a type, interface, control flow, or integration mechanism is recommended.

1. **Current code:** quote the smallest sufficient verbatim excerpt from the inspected repository and identify its repository-relative `path:line`. A structure tree, prose summary, symbol list, or file link alone is not current-code evidence.
2. **Illustrative target:** place compact target-language code next to the corresponding current excerpt, sufficient to inspect the changed responsibility, signature, data meaning, state transition, caller integration, or pivotal control flow. Label it illustrative: it constrains the shown contract and relationships, not final file placement, incidental syntax, or the full implementation.

Pair each current and target excerpt around the same changed seam. Show only the smallest target-language fragment that fixes responsibility, stable contract, data meaning, state transition, caller integration, or pivotal control flow. Do not fill Design with complete private method bodies, local control-flow details, file layout, helper decomposition, mechanical propagation across equivalent call sites, or repeated implementations of the same rule.

For a modification, show the directly changed current code. For an addition with no prior implementation, state that no corresponding implementation exists and show the current caller, owner, interface, or insertion seam where the new code will connect. For a deletion, show the current responsibility being removed and the target caller or flow that remains afterward. Never use “new code” as a reason to omit the existing seam.

For multiple options:

- show shared current code or shared target code once;
- give each materially different option only the code that exposes its distinctive behavior or boundary;
- never repeat an identical tree or large code block merely to make every option look symmetrical;
- if an option has no code-level difference, state that it shares the shown code and explain the actual non-code distinction.

Keep current and target blocks visually distinguishable. Use localized labels that include the stable parenthetical markers `current code` and `illustrative target`, for example `当前代码（current code）— src/Feature.cs:42` and `目标示意代码（illustrative target）`. Every current block must show its `path:line`; do not make the user open the file merely to understand the comparison.

Apply [design-illustrations.md](design-illustrations.md) when architecture, interfaces, data structures, or data flow are affected. A tree explains relationships but never substitutes for the required current/target code comparison. A simple local code change needs the relevant snippets, not an artificial architecture tree.

When an external or upstream implementation materially supports the recommendation, identify its version or revision and source file or symbol, explain the condition it solves, and compare that condition with this project's actual inputs, lifecycle, ownership, and constraints. Show a minimal reference mechanism when it is needed for the user to judge the recommendation. Never present a name-only resemblance or upstream difference as proof that the project is defective.

## Resolve the turn

A reply resolves a design choice only when it explicitly selects an option or target, explicitly corrects the proposal, or explicitly accepts the presented recommendation. A request for the agent to decide permits it to present one recommended target, but does not resolve the choice or mint `选择来源：用户确认。`; wait for explicit acceptance. Do not interpret generic continuation such as “继续” or “下一步”, an evaluation of the reasoning, a partial response, or ambiguous wording as acceptance. Ask one concise clarification and remain on the unresolved choice.

The combined final gate defined by the Design process is the sole exception.
