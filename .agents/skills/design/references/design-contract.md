# Design Contract

`design.md` is the short, user-reviewable final specification for this change. It contains only the selected result of the discussion.

When a real design choice was resolved through a user question, add the exact line `选择来源：用户确认。` once under that final selected item. Only the user's explicit reply to the surfaced choice can mint this line; an agent recommendation, reviewer verdict, inferred preference, delegation, or generic continuation cannot. Do not add it to proved facts, targets uniquely fixed by accessible project evidence, or mechanical details, and do not retain the discarded alternatives or discussion history beside it.

## Required content

- problem, success criteria, scope, non-goals, and constraints; for a criterion that changes observable behavior, a stable contract, data meaning, or failure semantics, include its governing rule, only the representative scenarios needed to remove implementation ambiguity, and the evidence that proves it;
- the selected architecture, boundaries, integration path, interfaces, data meaning/ownership/flow, failure or compatibility behavior, and validation only where they actually shape this change;
- project-evidence-backed constraints or prohibited shortcuts only when they materially protect the selected design, with a compact failure mechanism where the guardrail would otherwise appear arbitrary;
- corresponding target-language illustrative code for every selected project-code change; the selected structure tree for affected architecture or data structure, the selected flow tree for affected data flow, and an illustrative signature or schema for every affected interface or contract;
- a compact rationale only where the selected choice would otherwise be surprising or hard to reverse.

Retain provenance only for references that materially shaped the mechanism. Keep current evidence and proposed behavior distinct, scope configuration and resource samples to the inspected instance, and retain exact estimates only with compact reconstructible inputs and calculation.

For each changed boundary, record only the purpose, consumers, ownership, dependency direction, contract, or replaceable internals needed to prevent a materially different implementation. Every new independently maintained concept must trace to an accepted requirement or inspected constraint and explain why the earlier reuse or platform options are insufficient.

Ground retained guardrails in `evidence -> causal failure mechanism -> consequence -> prevention`; omit generic risk lists and rejected shortcuts. Use only the representative scenarios needed to clarify a governing rule, not fixed categories or an implicit test plan. When a criterion spans production paths, name each path and its evidence under that criterion.

Define one Design by the user's delivery and authorization scope. State the relationship among independent outcomes and give independently satisfiable parts separate criteria and evidence. Suggest a split only when combined scope would obscure materially different outcomes, authorization or release boundaries, destructive consequences, or reviewable completion.

Keep illustrative artifacts compact enough to constrain responsibilities, contracts, data meaning, transitions, and pivotal flow without freezing private implementation. Omit empty headings, internal process state, research or question history, discarded approaches, mechanical propagation, and any detail whose removal still permits only behaviorally and contractually equivalent implementations.

## Readiness check

Apply the minimum-sufficient test: keep content whose removal could permit a materially different implementation; remove content that cannot affect implementation or acceptance.

Design is ready for user review only when:

- scope, outcomes, criteria, and evidence are complete and materially unambiguous;
- every affected area and production path has been investigated, presented to the user in the conversation, and represented in this document by the required artifacts;
- every real design choice is resolved by explicit user confirmation, and every new concept has a proved need;
- current, external, sample, estimate, and target claims are correctly scoped and traceable; and
- only one coherent selected design remains, without placeholders, contradictions, superseded dependencies, or process history.
