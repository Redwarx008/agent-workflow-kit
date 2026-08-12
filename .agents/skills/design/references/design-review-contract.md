# Independent Design Review Contract

Review the supplied final `design.md` as an implementation contract, not as a conversation summary. Work read-only and do not rewrite the Design, resolve product or technical choices, or infer authorization.

## Inputs and independence

Accept only the exact Design path, project root, and this contract. Do not accept the main agent's completion summary, suspected findings, preferred verdict, transient dialogue transcript, or discarded alternatives. Read the project code and documentation needed to verify the Design's claims and production boundaries. Do not inspect unrelated active workflows to reconstruct missing intent; a Design that needs hidden discussion context is not ready.

## Review

First identify the Design's actual claims, changed boundaries, stable contracts, and failure consequences. Cover every success criterion and every affected production path, then scale investigation depth by consequence, reversibility, and boundary stability. Do not omit an affected area, and do not manufacture evidence requests or findings for an unaffected area merely to complete a fixed checklist.

1. Reconstruct the selected outcome, success criteria, scope, non-goals, and constraints from the Design alone.
2. Check relevant repository evidence and trace every claimed production integration or call path far enough to verify that the proposed seam, owner, consumer, and dependency direction are real. For every reference implementation that materially shaped the Design, verify its provenance, mechanism, relevant version, and claimed difference from this project; report generic-memory claims, name-only comparisons, or copied mechanisms whose constraints do not match.
3. Apply [design-contract.md](design-contract.md): check every actually affected architecture boundary, interface or contract, data structure, ownership and flow, failure, compatibility and lifecycle behavior, and validation obligation. Do not demand unaffected dimensions or incidental implementation detail.
4. Verify every selected project-code change has compact corresponding target-language illustrative code. Check that structure trees, flow trees, code, signatures, and schemas describe the same selected design as the prose, make the changed responsibility or behavior inspectable, avoid needless duplication, and do not accidentally freeze replaceable syntax or file layout.
5. Look for contradictions, placeholders, process leakage, scope drift, unsupported repository claims, and material ambiguity that could produce different observable behavior, stable contracts, data meaning or ownership, compatibility, validation strength, or project risk.
6. Reverse-audit every proposed abstraction, interface, configuration surface, state copy or cache, dependency, compatibility path, fallback, and other independently maintained concept. Require a confirmed need and evidence that an earlier reuse or platform option is insufficient.
7. Stress the Design against the intended input class rather than visible examples. For each materially behavioral success criterion, verify that the governing rule, only the scenarios needed to remove ambiguity, and the proving evidence agree. When a criterion spans multiple production paths, verify that every required path and its evidence are explicit. Report criteria defined only by examples, rules coupled to incidental sample names, IDs, ordering, counts, dimensions, or current data, mechanical scenario-category filler, and multi-path outcomes whose coverage is only implied.
8. Check that retained guardrails have a concrete causal failure mechanism and that the Design has not accumulated rejected options, speculative risks, generic advice, or execution-plan detail.
9. Review proposed names through two evidence standards. Enforce explicit applicable project naming rules with a rule citation; do not generalize their examples. Separately inspect only proposed domain concepts, stable interfaces, and ownership/lifecycle boundaries for a semantic mismatch capable of changing how implementers or callers understand the contract. Require evidence for `name-implied meaning -> designed responsibility or behavior -> materially different interpretation or misuse`. Do not review incidental illustrative-code locals, personal wording taste, mechanical word/prefix patterns, BCL/third-party APIs, or framework-mandated signatures.

Review the whole Design yourself. Request an additional specialist check only for a concrete question that cannot be judged reliably from your available expertise and evidence. State the question, why it needs specialist knowledge, and the evidence that raised it. Do not name a predetermined reviewer category or use a specialist request to avoid the general review.

## Findings and verdict

Return a compact coverage table, then evidence-backed findings with Design sections and repository `file:line` references where applicable:

- `P0`: the Design is unsafe, impossible, or directly violates an explicit project/user constraint;
- `P1`: the Design is not implementation-ready because a required boundary, contract, flow, behavior, fact, or validation obligation is missing, contradictory, unsupported, or materially ambiguous, or because a proposed stable/domain name violates an explicit blocking project rule or has a demonstrated materially misleading contract interpretation;
- `P2`: a precise non-blocking clarity or relevance issue that cannot materially change implementation.

End with exactly one verdict:

- `PASS`: every applicable contract area is accounted for and there is no P0/P1 finding;
- `FAIL`: at least one P0/P1 finding exists;
- `BLOCKED`: required repository evidence, access, or specialist judgment is unavailable, so readiness cannot be established.

For every P0/P1 finding, state whether the correction is uniquely mechanical or requires a user decision. If more than one reasonable correction exists, describe the decision boundary without choosing an option. Do not turn stylistic preference into a finding and do not apply any fix.
