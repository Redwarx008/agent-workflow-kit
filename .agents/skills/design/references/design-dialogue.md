# Design Dialogue

Discuss the design as a natural technical conversation, not a sequence of forms. Internal IDs, if a transient tool uses them, never appear to the user. Every message must be understandable without opening `design.md` or reconstructing an internal table.

## Choose the lightest useful turn

- **Clarify intent:** Ask one short, concrete question when the user's desired outcome is unknown. Do not recommend an answer before understanding the preference.
- **Choose a design direction:** State only the grounded project and reference evidence plus the consequence needed for this decision, show the genuinely viable options, give the recommendation and reason, then ask one direct question. Prefer easy finite choices when they fit; use an open question only when choices would distort the answer.
- **Explain a determined target:** When repository evidence and earlier decisions leave one valid target, explain it in the relevant coherent Design section. Do not manufacture alternatives or demand a separate approval for every architecture, interface, or data dimension. Ask only if a real unresolved choice remains; the final Design gate checks the assembled result.

Use headings only when they improve navigation in a long or structurally rich turn. Do not require fixed sections, A/B labels, or repeated restatement of the same context. Ask exactly one decision per message and wait for the answer before resolving a dependent decision.

For several materially different end-to-end approaches, make the whole choice space visible before anchoring on the recommendation. For a narrow local decision where the alternatives and evidence are already established, the recommendation may lead. In either case, identify the recommendation clearly and explain its causal advantage rather than making the user infer it.

## Make code changes inspectable

Whenever a proposed target would change project code, include compact target-language illustrative code sufficient to inspect the affected responsibility, signature, data meaning, state transition, or pivotal control flow. When useful, precede it with the smallest current-code excerpt needed to show what changes. Label target snippets as illustrative: they constrain the shown contract and relationships, not final file placement, incidental syntax, or the full implementation.

For multiple options:

- show the shared current evidence or shared target code once;
- give each materially different option only the code that exposes its distinctive behavior or boundary;
- never repeat an identical tree or large code block merely to make every option look symmetrical;
- if an option has no code-level difference, state that it shares the shown code and explain the actual non-code distinction.

Apply [design-illustrations.md](design-illustrations.md) when architecture, interfaces, data structures, or data flow are affected. A simple local code change needs the relevant snippet, not an artificial architecture tree.

## Resolve the turn

A reply resolves a design choice only when it explicitly selects an option or target, explicitly corrects the proposal, or explicitly delegates that decision to the agent. Do not interpret generic continuation such as “继续” or “下一步”, an evaluation of the reasoning, a partial response, or ambiguous wording as acceptance. Ask one concise clarification and remain on the unresolved choice.

The only exception is the combined final Design gate, where the agent has already declared that an unqualified direct reply such as “确认”, “继续”, or “按此实施” accepts the written Design and authorizes Act.
