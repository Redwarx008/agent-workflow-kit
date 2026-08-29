# Design Contract

`design.md` is the short, user-reviewable final specification for this change. It contains only the selected result of the discussion.

Use the stable top-level sections from the Design asset: `Goal`, `Scope and Success Criteria`, `Selected Design`, and `Validation and Acceptance`. `Selected Design` uses domain-titled subsections for the affected architecture, interface, data, flow, lifecycle, failure, or compatibility boundaries; omit dimensions that do not shape the change.

A **decision-bearing implementation detail** is any responsibility, name, signature, data shape, ownership or lifecycle rule, algorithm, control flow, integration, file or module ownership, failure or compatibility behavior, or validation choice for which two reasonable implementations remain. Design fixes every such detail. Syntax, formatting, mechanically repeated propagation, and execution order are mechanical only when the selected Design plus cited project rules leave one reasonable result.

Give every independently variable final target that changes scope, observable behavior, architecture, a stable interface, data meaning or format, ownership or lifecycle, failure or compatibility behavior, validation strength, or a decision-bearing implementation detail an adjacent source:

- after an unambiguous user directive for that exact target or an explicit reply to a surfaced choice, add the exact line `选择来源：用户确认。` once under that selected item. Only the user's own explicit direction can mint it; an agent recommendation, reviewer verdict, inferred preference, delegation, or generic continuation cannot. It covers only the exact directive or surfaced decision axis and its distinguishing clauses. The final assembled-Design gate cannot retroactively supply missing per-target provenance;
- when a separate question is unnecessary because the target is forced, add `唯一依据：<project path:line or already sourced selected item> — <why every materially different target violates that invariant>.` A current implementation, nearby pattern, current sample or configuration, internal consistency, simplicity, implementation convenience, or reviewer agreement is not by itself a unique-target proof.

One source may cover several clauses only when the same cited invariant makes them inseparable. Otherwise keep them as separately sourced final items. An independently variable target with no source is unresolved and cannot enter Ready. Current-state facts and mechanical work need no source. Do not retain discarded alternatives or discussion history beside the selected result.

## Required content

- problem, success criteria, scope, non-goals, and constraints; for a criterion that changes observable behavior, a stable contract, data meaning, or failure semantics, include its governing rule, only the representative scenarios needed to remove implementation ambiguity, and the evidence that proves it;
- the selected architecture, boundaries, integration path, interfaces, data meaning/ownership/flow, failure or compatibility behavior, and validation only where they actually shape this change;
- project-evidence-backed constraints or prohibited shortcuts only when they materially protect the selected design, with a compact failure mechanism where the guardrail would otherwise appear arbitrary;
- corresponding target-language illustrative code covering every decision-bearing implementation detail; the selected structure tree for affected architecture or data structure, the selected flow tree for affected data flow, and an illustrative signature or schema for every affected interface or contract;
- a compact rationale only where the selected choice would otherwise be surprising or hard to reverse.

Retain provenance only for references that materially shaped the mechanism. Keep current evidence and proposed behavior distinct, scope configuration and resource samples to the inspected instance, and retain exact estimates only with compact reconstructible inputs and calculation.

For each changed boundary, record the purpose, consumers, ownership, dependency direction, contract, and concrete mechanism needed so Act does not choose among reasonable implementations. Every new independently maintained concept must trace to an accepted requirement or inspected constraint and explain why the earlier reuse or platform options are insufficient.

Ground retained guardrails in `evidence -> causal failure mechanism -> consequence -> prevention`; omit generic risk lists and rejected shortcuts. Use only the representative scenarios needed to clarify a governing rule, not fixed categories or an implicit test plan. When a criterion spans production paths, name each path and its evidence under that criterion.

Define one Design by the user's delivery and authorization scope. State the relationship among independent outcomes and give independently satisfiable parts separate criteria and evidence. Suggest a split only when combined scope would obscure materially different outcomes, authorization or release boundaries, destructive consequences, or reviewable completion.

Keep illustrative artifacts focused on decision-bearing implementation details rather than copying complete source files. Omit empty headings, internal process state, research or question history, discarded approaches, and mechanical work.

## Readiness check

Apply the minimum-sufficient test: keep content whose removal could permit a materially different implementation; remove content that cannot affect implementation or acceptance.

Design is ready for user review only when:

- scope, outcomes, criteria, and evidence are complete and materially unambiguous;
- every affected area and production path has been investigated, presented to the user in the conversation, and represented in this document by the required artifacts;
- every independently variable stable target has an adjacent valid source, every real design choice is resolved by explicit user confirmation, and every new concept has a proved need;
- current, external, sample, estimate, and target claims are correctly scoped and traceable; and
- only one coherent selected design remains, without placeholders, contradictions, superseded dependencies, or process history.

If Act would need to choose a decision-bearing implementation detail, the Design is not ready.
