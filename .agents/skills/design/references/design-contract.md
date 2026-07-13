# Design Contract

## Living record

Use `.agents/skills/design/assets/design.md` without removing sections. Update the record when facts or decisions change, not merely at the end of the conversation.

- `Evidence`: inspected repository paths, runtime behavior, engine source, captures, official references, and rejected hypotheses.
- `Decisions`: user choices and technical conclusions that implementation must treat as fixed, including causal rationale.
- `Open Questions`: only unresolved questions that can change scope, architecture, contracts, failure behavior, validation, or compatibility.
- `Discussion Trace`: a concise record of every material question, inspected facts, recommendation, user response, and result.
- `Decision Map`: the dependency graph of material decisions. Its status is `Evidence pending`, `Awaiting user`, `Confirmed`, `Delegated`, `Rejected`, or `N/A` with a reason. It is internal traceability, not a user-facing conversation format.
- `Design Coverage`: a live gate showing whether each required dimension has inspected evidence and, where needed, a user decision or confirmation. Headings or plausible prose alone do not count as coverage.

Write `N/A` plus a reason when interfaces, data flow, or another section genuinely does not apply. Never invent detail to make the template look complete.

## Readiness check

Design is Ready only when all are true:

- Problem, success picture, scope, and out-of-scope boundaries are explicit.
- Relevant current implementation and references have been inspected.
- Genuinely viable end-to-end approaches were compared before local decisions; the chosen overall direction has the user's confirmation or explicit delegation.
- Every material decision appears in Decision Map with its dependencies; no entry remains `Awaiting user` or `Evidence pending`.
- Discussion Trace shows the user's confirmation, rejection, or explicit delegation for every affected production integration/call path, interface/contract, data model/state/structure, and data ownership/flow.
- Every user-facing decision message was self-contained and used a domain title, why-now facts, recommendation-first proposal, real alternatives and consequences where applicable, and one direct decision question. Raw `D-xxx` labels were not exposed as the decision title.
- Every Design Coverage row is `Resolved` or a justified `N/A`; none is merely inferred from a filled heading.
- Architecture boundaries, components and responsibilities, targeted enabling improvements, production integration and call path, interfaces/contracts, data model/state/structures, data ownership and flow, implementation mechanics and integration points, failure/edge/compatibility behavior, and validation are defined or explicitly not applicable.
- Every affected production integration/call path, interface/contract, data representation/state model, and data ownership/flow records the inspected evidence, concrete proposal, and the user's confirmation, rejection, or explicit delegation. Evidence may explain a proposal but cannot replace this record.
- Every non-trivial new or changed data representation records its structure, invariants, ownership, lifecycle, mutation path, and persistence/compatibility implications. When more than one viable representation remains, it records alternatives, causal tradeoffs, recommendation, and the user's decision.
- Every affected component states its purpose, consumers, dependencies, stable contract, and replaceable internal details. Any enabling improvement is causally necessary to the target change and has an explicit user scope decision.
- The implementation approach fixes the mechanisms and production integration path strongly enough that Act does not need to invent architecture, ownership, contracts, algorithms, or compatibility policy. Act may choose only mechanical execution order from repository facts.
- Every design choice with multiple viable approaches records the compared approaches, causal tradeoffs, recommendation, and user decision. Do not manufacture alternatives when repository evidence leaves only one valid approach.
- Success criteria are observable and testable with the chosen evidence type.
- Every implementation-shaping decision is recorded and no such question remains open.
- The user has seen an integrated walkthrough of the connected design and any correction is reflected in the record. This walkthrough is a Design discussion step, not implementation authorization.
- The written local Design passed self-review, then the user reviewed the completed `design.md`; any requested correction was incorporated and re-reviewed before Ready.
- No `TBD`, `TODO`, placeholder prose, contradiction, or requirement with two plausible interpretations remains.

Perform a fresh self-review before marking Ready: scan for placeholders, internal inconsistency, oversized scope, hidden assumptions, and ambiguous terminology. Fix facts directly; ask the user about decisions.
