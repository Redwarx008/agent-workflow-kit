# Independent Design Review Contract

Review the supplied final `design.md` as an implementation contract, not as a conversation summary. Work read-only and do not rewrite the Design, resolve product or technical choices, or infer authorization.

## Inputs and independence

Accept only the exact Design path, project root, and this contract. Do not accept the main agent's completion summary, suspected findings, preferred verdict, transient dialogue transcript, or discarded alternatives. Read the project code and documentation needed to verify the Design's claims and production boundaries. Do not inspect unrelated active workflows to reconstruct missing intent; a Design that needs hidden discussion context is not ready.

## Review

First identify the Design's actual problem claims, selected delivery scope, changed boundaries, stable contracts, and failure consequences. Verify that the problem and scope are evidence-backed before judging implementation readiness. Cover every success criterion and every affected production path, then scale investigation depth by consequence, reversibility, and boundary stability. Do not omit an affected area, and do not manufacture evidence requests or findings for an unaffected area merely to complete a fixed checklist.

1. Reconstruct every selected outcome, its success criteria, scope, non-goals, relationship to other included outcomes, and constraints from the Design alone. Technically independent outcomes may share one user-selected delivery scope; do not demand a split or infer technical atomicity. Require separate criteria and evidence when one outcome can succeed without another.
2. Check the evidence for every claimed current problem or improvement premise. Distinguish an observed failure, a production-reachable contract problem, an unsupported or currently unreachable future capability, and a maintenance-only change through their concrete facts and consequences, not workflow labels. Report as P1 a current-bug claim without matching reachability or runtime evidence, a reference difference treated as a defect, a concrete implementation target not selected by the user, or a false atomicity claim that changes authorization or acceptance.
3. Check relevant repository evidence and trace every claimed production integration or call path far enough to verify that the proposed seam, owner, consumer, and dependency direction are real. Where static inspection cannot uniquely prove a runtime premise, verify the existing safe observation or validation evidence used by Design, or report the claim as unsupported. For every reference implementation that materially shaped the Design, verify its provenance, mechanism, relevant version, input conditions, and claimed difference from this project; report generic-memory claims, name-only comparisons, or copied mechanisms whose constraints do not match.
4. Apply [design-contract.md](design-contract.md): check every actually affected architecture boundary, interface or contract, data structure, ownership and flow, failure, compatibility and lifecycle behavior, and validation obligation. Do not demand unaffected dimensions or incidental implementation detail.
5. Reconstruct the actual current code for every selected project-code change and verify the target-language illustrative code is a faithful, sufficient transformation of the same seam rather than a parallel or invented mechanism. Check that structure trees, flow trees, code, signatures, and schemas describe the same selected design as the prose, make the changed responsibility or behavior inspectable, avoid needless duplication, and do not freeze complete private implementations, mechanical propagation, replaceable syntax, helper layout, or file placement. The review uses repository evidence directly; it does not require transient dialogue excerpts to remain in final Design.
6. Look for contradictions, placeholders, process leakage, numbered or fixed-batch decision-card language, scope drift, unsupported repository claims, and material ambiguity that could produce different observable behavior, stable contracts, data meaning or ownership, compatibility, validation strength, or project risk.
7. Reverse-audit every proposed abstraction, interface, configuration surface, state copy or cache, dependency, compatibility path, fallback, and other independently maintained concept. Require a confirmed need and evidence that an earlier reuse or platform option is insufficient.
8. Stress the Design against the intended input class rather than visible examples. For each materially behavioral success criterion, verify that the governing rule, only the scenarios needed to remove ambiguity, and the proving evidence agree. When a criterion spans multiple production paths, verify that every required path and its evidence are explicit. Report criteria defined only by examples, rules coupled to incidental sample names, IDs, ordering, counts, dimensions, or current data, mechanical scenario-category filler, and multi-path outcomes whose coverage is only implied.
9. Check that retained guardrails have a concrete causal failure mechanism and that the Design has not accumulated rejected options, speculative risks, generic advice, or execution-plan detail.
10. Review proposed names through two evidence standards. Enforce explicit applicable project naming rules with a rule citation; do not generalize their examples. Separately inspect only proposed domain concepts, stable interfaces, and ownership/lifecycle boundaries for a semantic mismatch capable of changing how implementers or callers understand the contract. Require evidence for `name-implied meaning -> designed responsibility or behavior -> materially different interpretation or misuse`. Do not review incidental illustrative-code locals, personal wording taste, mechanical word/prefix patterns, BCL/third-party APIs, or framework-mandated signatures.

Review the whole Design yourself and retain the overall verdict. Request additional specialist checks only for concrete questions that cannot be judged reliably from your available expertise and evidence. Use the smallest sufficient number, give each specialist exactly one question, and state why the evidence requires specialist knowledge. Integrate and deduplicate their results. Do not name predetermined reviewer categories or use specialist requests to avoid the general review.

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
