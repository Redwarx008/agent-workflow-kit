# Design Contract

`design.md` is the short, user-reviewable final specification for this change. It contains only the selected result of the discussion.

Keep:

- problem, success criteria, scope, non-goals, and constraints;
- the selected architecture, boundaries, integration path, interfaces, data meaning/ownership/flow, failure or compatibility behavior, and validation only where they actually shape this change;
- project-evidence-backed constraints or prohibited shortcuts only when they materially protect the selected design, with a compact failure mechanism where the guardrail would otherwise appear arbitrary;
- the selected structure tree and illustrative code for every affected architecture or data structure, the selected flow tree and illustrative code for every affected data flow, and an illustrative signature or schema for every affected interface or contract;
- a compact rationale only where the selected choice would otherwise be surprising or hard to reverse.

For each materially changed boundary, record the properties needed to prevent inconsistent implementation, such as purpose, consumers, owned state, dependency direction, stable contract, or replaceable internals. Scale each section to decision impact and write uniquely determined or reversible detail in the shortest sufficient form, but do not omit an affected area from user discussion merely because the repository makes its proposal unambiguous.

Do not treat an affected Design area as a mandate to introduce a new layer. The selected design may explicitly retain an existing boundary, interface, state owner, or data flow. Every new abstraction, interface, configuration surface, state copy or cache, dependency, compatibility path, fallback, or independently maintained concept must trace to an accepted requirement or inspected project constraint and explain why existing project code, a shared seam, the standard library, the engine/platform, or an installed dependency is insufficient.

Evaluate concrete failure and debt mechanisms while selecting each affected part of the design. Ground a material guardrail in the current project's production paths, ownership, lifecycle, compatibility, resource, migration, or other relevant evidence. Trace `evidence -> causal failure mechanism -> consequence -> prevention`, then keep only the prevention that shapes implementation. Do not add a separate generic risk checklist, speculative hazards, or rejected shortcuts.

Do not keep empty or `N/A` headings, internal IDs, question history, coverage/impact tables, raw research notes, authorization state, amendments, or discarded approaches. A rejected option belongs only in an ADR when its rejected rationale is durable context under the project's ADR rules.

## Readiness check

Apply the minimum-sufficient test: keep content whose removal could permit a materially different implementation; remove content that cannot affect implementation or acceptance.

Design is ready for user review only when:

- it describes one coherent selected design with no ambiguity capable of changing observable behavior, stable contracts, data meaning/ownership, compatibility, scope, validation strength, or project risk;
- every affected Design area has been discussed and confirmed or explicitly delegated;
- every applicable production integration, contract, ownership boundary, and failure or lifecycle rule is sufficiently inspectable, with the required selected artifacts for affected architecture, interfaces, data structures, and data flow;
- every newly introduced concept has a causal requirement and no earlier complete reuse or platform option satisfies it;
- success criteria and validation evidence are observable;
- it contains only final relevant content, with no empty heading, placeholder, contradiction, process ledger, or discarded option.

The user reviews `design.md` through one combined final gate whose unqualified acceptance also explicitly authorizes Act; no companion Plan, execution ledger, or state record exists. An explicit request to wait leaves the accepted Design Ready without implementation.
