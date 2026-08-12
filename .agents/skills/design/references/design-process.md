# Design Process

Turn the requested change into the minimum-sufficient selected Design. Apply the companion references for the detailed contracts; this file owns the discussion order and Ready transition.

## Establish the Design unit

Complete the pre-question exploration contract before substantive dialogue. Let the user's requested delivery and authorization scope define the Design unit. A Design may contain several findings, production paths, or technically independent implementation parts when the user chooses to handle them together. Explain whether included parts must hold together, merely need coordination, or are only bundled for delivery; never infer technical atomicity from a shared module, review, or batch. Keep separate success criteria and evidence for parts that can succeed independently.

Suggest splitting only when one document would obscure materially different user outcomes, authorization or release boundaries, destructive consequences, or reviewable completion. Technical independence, separate reversibility, different files, or different call paths do not by themselves require separate Designs. Recommend a boundary and ask the user when the delivery scope is genuinely unresolved; the user owns the final grouping.

Maintain only `workflow/active/<change-name>/design.md` from the bundled template. Immediately after exploration, write the proved current behavior and constraints that materially frame the first scope or design decision. After each later resolution, update the newly selected result immediately; when new evidence or a decision supersedes earlier text, rewrite or remove it instead of appending history. Keep only the current valid Design, not a Plan, execution ledger, authorization record, candidate menu, decision table, research log, internal IDs, question history, or discarded approaches. Evaluator and Visual Companion files are disposable `workflow/.local/` state.

Treat every user correction, disproved premise, changed recommendation, or superseded decision as a dependency repair, not a local wording edit. Before asking the next question:

1. verify the corrected fact when it is discoverable from the environment;
2. find every Design statement, estimate, requirement, interface, schema, rationale, success criterion, and later decision that depended on the old premise;
3. rewrite or remove all invalidated content and reopen any prior choice whose trade-off changed; and
4. reread the whole Design far enough to confirm that only one coherent current architecture, contract, and data flow remains.

Do not preserve the repair history in Design, and do not continue from the old conclusion merely because the user corrected only one sentence.

For an explicit implementation request, verify its factual premises and carry the already selected goal forward without asking whether to do it again. For an exploratory comparison, audit, or open-ended improvement request, first present the evidence-backed candidates together, distinguish current behavior from future capability and maintenance value in plain domain language, recommend what is worth pursuing, and ask one scope-selection question. The user may select one, several, all, or none. Do not design a concrete target for an unselected candidate. If evidence disproves a requested premise, explain it and ask whether to revise the goal or conclude with no implementation.

## Discuss the selected design

1. Carry forward the grounded current flow and reference comparison. Write only evidence that constrains the selected result, and investigate every newly introduced factual premise before using it in a question or recommendation.
2. Reduce the solution in order: no new mechanism; existing project code or shared seam; standard library or engine/platform; installed dependency; minimum project-local implementation. Stop at the first complete option. Before presenting any new abstraction, interface, persistent field or schema, configuration surface, state copy/cache, dependency, compatibility path, fallback, or independently maintained concept, show the complete necessity chain: `accepted requirement or inspected constraint -> exact insufficiency of the current mechanism -> smallest additional mechanism that closes it`. If any link is missing, retain the existing mechanism or state that the need is unproved; do not use completeness, extensibility, convention, reviewer preference, or future possibility as necessity.
3. Compare genuinely viable end-to-end approaches before local decisions. Lead with the recommendation and show two or three options only when they are real. Keep only the selected result in Design. A scope choice asks which evidenced outcome belongs in this change; it must not smuggle in a concrete API or implementation that has not yet been selected.
4. Discuss affected areas in dependency order: architecture and boundaries; production integration and interfaces; data structures, ownership, and flow; failure, compatibility, and lifecycle behavior; validation. Show every affected area even when evidence leaves one viable target; never create empty chapters for unaffected areas.
5. Use the Design dialogue and evaluator contracts to choose the lightest useful turn, present no more than one unresolved decision, and wait. Do not update Design or advance a dependent question until the reply explicitly resolves the current choice. A passing dialogue evaluator proves only message shape; it does not validate evidence, necessity, options, recommendation, target code, or consistency with Design.
6. Inspect every affected production integration path, interface or contract, data structure or state, and data ownership or flow. A choice is material when it can change observable behavior, a stable contract, data meaning or ownership, persistence or migration, compatibility, scope, validation strength, or project risk. Present every affected target, but ask only when two or more materially different valid targets remain. Repository evidence and earlier decisions may uniquely determine a target; explain and write that target without demanding a separate approval, leaving the assembled Design to the final gate.
7. Apply the illustration contract to every affected structural area or interface.
8. Apply the Design contract to success criteria, cross-path evidence, selected guardrails, and final document content.
9. Update the selected Design immediately after each resolved decision.

Act may choose behaviorally equivalent, local, reversible implementation details and mechanical order. Design owns architecture, production wiring, stable interfaces, data meaning and ownership, state transitions, failure behavior, compatibility, scope, and validation choices. Reject unrelated refactors and speculative requirements.

Use Visual Companion only when seeing a visual relationship or difference materially improves the user's decision, and only after consent. Keep requirements, textual choices, trade-offs, API/data-model decisions, code, formulas, and architecture selection in the terminal when layout adds no decision value.

## Ready transition

Do not nominate Design while an affected area has not been investigated and presented, a real material choice awaits the user, or required repository evidence is missing. A uniquely determined target needs no separate confirmation before the final assembled-Design gate.

When the Design contract is satisfied:

1. Inspect the candidate Design for independently verifiable high-consequence technical claims. When fewer than two exist, launch one independent read-only reviewer under the Design Review contract with only the exact `design.md` path, project root, and contract path.
2. When two or more such claims exist, first dispatch the smallest sufficient set of read-only reviewers in parallel, each with the exact Design path and one concrete claim to verify against the project or authoritative platform evidence. Typical claims affect a persistent format or migration, stable cross-module contract, engine/platform behavior, GPU/concurrency/persistence behavior, decision-bearing quantitative conclusion, or semantic agreement across production paths; use the Design's actual claims rather than a fixed persona roster. These reviewers return evidence and findings only, do not edit Design, choose the target, or issue the whole-Design verdict.
3. After every parallel reviewer returns, launch one independent integration reviewer under the Design Review contract. Pass the exact Design path, project root, contract path, the verification questions, and the reviewers' verbatim reports; do not pass the Design author's completion summary or preferred verdict. The integration reviewer checks claim coverage, verifies critical evidence as needed, merges duplicates, resolves or reports conflicts, checks whole-Design consistency, and issues the only `PASS / FAIL / BLOCKED` verdict. Missing coverage or an unresolved conflict on a material claim blocks readiness.
4. Resolve all P0/P1 and blockers. A uniquely mechanical P2 wording or illustration correction may be applied without another review unless it affects another section. Re-run only verification questions affected by a correction, then run integration review again; if the correction changes the Design broadly, repeat the full applicable review. Return any non-unique or intent-changing correction to the user through the normal decision protocol.
5. When implementation remains, ask the user to review the independently reviewed `design.md`. State in that message that an unqualified direct reply such as “确认”, “继续”, or “按此实施” both accepts the written Design and authorizes Act, whose first step is the worktree choice. A correction returns to discussion and required re-review. Explicit acceptance with an instruction to wait leaves Design Ready.
6. After unqualified direct acceptance of that combined implementation gate, invoke `$agent-workflow-kit:act` with the exact Design path. Do not request synonymous authorization again. No generic implementation or continuation request outside the direct gate response may invoke Act.
7. When the reviewed conclusion is that no implementation is warranted, ask the user to confirm that conclusion explicitly and state that confirmation archives the local Design without modifying or committing project code. On confirmation, move `workflow/active/<change>/` to `workflow/completed/<change>/`, clear only its disposable local tool state, and stop without invoking Act or creating an empty commit. A request to defer instead leaves the Design active.

The terminal state is either the direct transition to Act after the combined implementation gate or user-confirmed local archival of an evidence-backed no-implementation conclusion.
