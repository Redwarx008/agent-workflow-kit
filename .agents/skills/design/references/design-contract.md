# Design Contract

## Living record

Use `.agents/skills/design/assets/design.md` without removing sections. Update the record when facts or decisions change, not merely at the end of the conversation.

- `Evidence`: inspected repository paths, runtime behavior, engine source, captures, official references, and rejected hypotheses.
- `Decisions`: user choices and technical conclusions that implementation must treat as fixed, including causal rationale.
- `Open Questions`: only unresolved questions that can change scope, architecture, contracts, failure behavior, validation, or compatibility.
- `Design Coverage`: a live gate showing whether each required dimension has inspected evidence and, where needed, a user decision. Headings or plausible prose alone do not count as coverage.

Write `N/A` plus a reason when interfaces, data flow, or another section genuinely does not apply. Never invent detail to make the template look complete.

## Readiness check

Design is Ready only when all are true:

- Problem, success picture, scope, and out-of-scope boundaries are explicit.
- Relevant current implementation and references have been inspected.
- Every Design Coverage row is `Resolved` or a justified `N/A`; none is merely inferred from a filled heading.
- Architecture boundaries, components and responsibilities, interfaces/contracts, data ownership and flow, implementation mechanics and integration points, failure/edge/compatibility behavior, and validation are defined or explicitly not applicable.
- The implementation approach fixes the mechanisms and production integration path strongly enough that Plan does not need to invent architecture, ownership, contracts, algorithms, or compatibility policy. Plan may still choose task decomposition and execution order.
- Every design choice with multiple viable approaches records the compared approaches, causal tradeoffs, recommendation, and user decision. Do not manufacture alternatives when repository evidence leaves only one valid approach.
- Success criteria are observable and testable with the chosen evidence type.
- Every implementation-shaping decision is recorded and no such question remains open.
- No `TBD`, `TODO`, placeholder prose, contradiction, or requirement with two plausible interpretations remains.

Perform a fresh self-review before marking Ready: scan for placeholders, internal inconsistency, oversized scope, hidden assumptions, and ambiguous terminology. Fix facts directly; ask the user about decisions.
