# Design Contract

`design.md` is the short, user-reviewable final specification for this change. It contains only the selected result of the discussion.

Keep:

- problem, success criteria, scope, non-goals, and constraints;
- the selected architecture, boundaries, components, integration path, interfaces, data structures, data flow, failure/compatibility behavior, and validation that actually apply;
- project-evidence-backed implementation principles and prohibited shortcuts that materially protect the selected design, with a compact failure mechanism where the guardrail would otherwise appear arbitrary;
- required selected trees, flow trees, and illustrative code;
- a compact rationale only where the selected choice would otherwise be surprising or hard to reverse.

For each new or materially changed component, make its boundary inspectable: purpose, consumers, owned data/state, dependency direction, stable contract, and which internals may change without breaking consumers. Scale each affected section to decision impact: write uniquely determined or reversible detail in the shortest sufficient form, while retaining required trees, flow trees, and illustrative code for architecture, data structures, and data flow.

Before readiness, review the coherent selected design from the failure side. Ground every material conclusion in the current project's production paths, ownership, lifecycle, compatibility, resource, migration, or other relevant evidence. Trace `evidence -> causal failure mechanism -> consequence -> prevention`; then keep only the prevention that shapes the final design. Do not preserve a generic risk checklist, speculative hazards, or rejected shortcuts.

Do not keep empty or `N/A` headings, internal IDs, question history, coverage/impact tables, raw research notes, authorization state, amendments, or discarded approaches. A rejected option belongs only in an ADR when its rejected rationale is durable context under the project's ADR rules.

## Readiness check

Design is ready for user review only when:

- it describes one coherent selected design with no implementation-shaping ambiguity;
- every affected architecture, data structure, and data flow is inspectable through the required selected artifacts;
- material project-grounded failure and debt risks have selected prevention, with stable contracts distinguished from deliberately replaceable internals;
- success criteria and validation evidence are observable;
- all headings carry final, relevant content; and
- it contains no placeholder, contradictory statement, process ledger, or discarded option.

The user reviews `design.md`; no companion Plan, execution ledger, or state record exists.
