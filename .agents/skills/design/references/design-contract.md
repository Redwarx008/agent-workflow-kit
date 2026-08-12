# Design Contract

`design.md` is the short, user-reviewable final specification for this change. It contains only the selected result of the discussion.

Keep:

- problem, success criteria, scope, non-goals, and constraints; for a criterion that changes observable behavior, a stable contract, data meaning, or failure semantics, include its governing rule, only the representative scenarios needed to remove implementation ambiguity, and the evidence that proves it;
- the selected architecture, boundaries, integration path, interfaces, data meaning/ownership/flow, failure or compatibility behavior, and validation only where they actually shape this change;
- project-evidence-backed constraints or prohibited shortcuts only when they materially protect the selected design, with a compact failure mechanism where the guardrail would otherwise appear arbitrary;
- corresponding target-language illustrative code for every selected project-code change; the selected structure tree for affected architecture or data structure, the selected flow tree for affected data flow, and an illustrative signature or schema for every affected interface or contract;
- a compact rationale only where the selected choice would otherwise be surprising or hard to reverse.

When a project or external reference materially shapes the selected mechanism, retain enough provenance to identify the inspected implementation or version and the project-specific difference that governs adoption. Do not turn Design into a research bibliography or keep references that had no effect on the result.

For each materially changed boundary, record the properties needed to prevent inconsistent implementation, such as purpose, consumers, owned state, dependency direction, stable contract, or replaceable internals. Scale each section to decision impact and write uniquely determined or reversible detail in the shortest sufficient form, but do not omit an affected area from user discussion merely because the repository makes its proposal unambiguous.

Illustrative code makes the selected target inspectable; it is not a file-by-file implementation plan. Show shared code once and retain only option-specific differences during comparison. In final Design, keep the compact selected code needed to constrain responsibilities, contracts, data meaning, transitions, or pivotal control flow without freezing incidental syntax.

Define one Design by a shared user-visible outcome, domain invariants, stable contracts, and an atomic acceptance boundary—not by file, module, owner, or call-path count. Include every production path needed to make that outcome true, even when the paths have independent implementations. Split work only when each part can be authorized, validated, delivered, and reverted independently and the parts share no material design decision or invariant.

Do not treat an affected Design area as a mandate to introduce a new layer. The selected design may explicitly retain an existing boundary, interface, state owner, or data flow. Every new abstraction, interface, configuration surface, state copy or cache, dependency, compatibility path, fallback, or independently maintained concept must trace to an accepted requirement or inspected project constraint and explain why existing project code, a shared seam, the standard library, the engine/platform, or an installed dependency is insufficient.

Evaluate concrete failure and debt mechanisms while selecting each affected part of the design. Ground a material guardrail in the current project's production paths, ownership, lifecycle, compatibility, resource, migration, or other relevant evidence. Trace `evidence -> causal failure mechanism -> consequence -> prevention`, then keep only the prevention that shapes implementation. Do not add a separate generic risk checklist, speculative hazards, or rejected shortcuts.

Do not keep empty or `N/A` headings, internal IDs, question history, coverage/impact tables, raw research notes, authorization state, amendments, or discarded approaches. A rejected option belongs only in an ADR when its rejected rationale is durable context under the project's ADR rules.

Representative scenarios clarify a general rule; they do not define the supported input class. Do not mechanically require happy, edge, error, or integration categories, and do not turn scenarios into a test plan when the user did not request tests.

When one success criterion must hold across multiple production paths, identify those paths and the evidence required from each under that criterion. Do not introduce internal requirement IDs, a separate coverage table, or repeated mappings for a single path whose relationship is already explicit.

## Readiness check

Apply the minimum-sufficient test: keep content whose removal could permit a materially different implementation; remove content that cannot affect implementation or acceptance.

Design is ready for user review only when:

- it describes one coherent selected design whose included paths jointly deliver one accepted outcome, with no ambiguity capable of changing observable behavior, stable contracts, data meaning/ownership, compatibility, scope, validation strength, or project risk;
- every affected Design area has been discussed and confirmed or explicitly delegated;
- every applicable production integration, contract, ownership boundary, and failure or lifecycle rule is sufficiently inspectable, with the required selected artifacts for affected architecture, interfaces, data structures, and data flow;
- every newly introduced concept has a causal requirement and no earlier complete reuse or platform option satisfies it;
- success criteria state the applicable rule and observable evidence, with enough representative scenarios to prevent materially different interpretations without overfitting the Design to examples; every multi-path criterion names all required production paths and path-specific evidence;
- it contains only final relevant content, with no empty heading, placeholder, contradiction, process ledger, or discarded option.

The user reviews `design.md` through one combined final gate whose unqualified acceptance also explicitly authorizes Act; no companion Plan, execution ledger, or state record exists. An explicit request to wait leaves the accepted Design Ready without implementation.
