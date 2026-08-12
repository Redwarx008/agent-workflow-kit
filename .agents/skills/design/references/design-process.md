# Design Process

Turn the requested change into the minimum-sufficient selected Design. Apply the companion references for the detailed contracts; this file owns the discussion order and Ready transition.

## Establish the Design unit

Complete the pre-question exploration contract before substantive dialogue. When the request spans subsystems or production paths, use that evidence to map their dependencies and define one Design by a shared user-visible outcome, domain invariants, stable contracts, and an atomic acceptance boundary. Keep all paths required for that outcome together. Split only work that can be authorized, validated, delivered, and reverted independently without sharing a material decision or invariant. If multiple coherent boundaries remain after investigation, recommend one and ask the user.

Maintain only `workflow/active/<change-name>/design.md` from the bundled template. Keep selected final facts and decisions, not a Plan, execution ledger, authorization record, decision table, research log, internal IDs, question history, or discarded approaches. Evaluator and Visual Companion files are disposable `workflow/.local/` state.

## Discuss the selected design

1. Carry forward the grounded current flow and reference comparison. Write only evidence that constrains the selected result, and investigate every newly introduced factual premise before using it in a question or recommendation.
2. Reduce the solution in order: no new mechanism; existing project code or shared seam; standard library or engine/platform; installed dependency; minimum project-local implementation. Stop at the first complete option. Require a confirmed requirement or project constraint for every new abstraction, interface, configuration surface, state copy/cache, dependency, compatibility path, fallback, or independently maintained concept.
3. Compare genuinely viable end-to-end approaches before local decisions. Lead with the recommendation and show two or three options only when they are real. Keep only the selected result in Design.
4. Discuss affected areas in dependency order: architecture and boundaries; production integration and interfaces; data structures, ownership, and flow; failure, compatibility, and lifecycle behavior; validation. Show every affected area even when evidence leaves one viable target; never create empty chapters for unaffected areas.
5. Use the Design dialogue and evaluator contracts to choose the lightest useful turn, present no more than one unresolved decision, and wait. Do not update Design or advance a dependent question until the reply explicitly resolves the current choice.
6. Inspect every affected production integration path, interface or contract, data structure or state, and data ownership or flow. A choice is material when it can change observable behavior, a stable contract, data meaning or ownership, persistence or migration, compatibility, scope, validation strength, or project risk. Obtain confirmation or explicit delegation for its target.
7. Apply the illustration contract to every affected structural area or interface.
8. Apply the Design contract to success criteria, cross-path evidence, selected guardrails, and final document content.
9. Update the selected Design immediately after each resolved decision.

Act may choose behaviorally equivalent, local, reversible implementation details and mechanical order. Design owns architecture, production wiring, stable interfaces, data meaning and ownership, state transitions, failure behavior, compatibility, scope, and validation choices. Reject unrelated refactors and speculative requirements.

Use Visual Companion only when seeing a visual relationship or difference materially improves the user's decision, and only after consent. Keep requirements, textual choices, trade-offs, API/data-model decisions, code, formulas, and architecture selection in the terminal when layout adds no decision value.

## Ready transition

Do not nominate Design while an affected area lacks confirmation or explicit delegation, a material choice awaits the user, or required repository evidence is missing.

When the Design contract is satisfied:

1. Launch one independent read-only subagent under the Design Review contract. Pass only the exact `design.md` path, project root, and contract path.
2. If that reviewer identifies an exact question it cannot reliably judge, launch one suitable read-only subagent for only that question. A specialist `PASS` resolves only its question; `FAIL` or `BLOCKED` blocks Design.
3. Resolve all P0/P1 and blockers. A uniquely mechanical P2 wording or illustration correction may be applied without another review unless it affects another section. Re-review every P0/P1 correction. Return any non-unique or intent-changing correction to the user through the normal decision protocol.
4. Ask the user to review the independently reviewed `design.md`. State in that message that an unqualified direct reply such as “确认”, “继续”, or “按此实施” both accepts the written Design and authorizes Act, whose first step is the worktree choice. A correction returns to discussion and required re-review. Explicit acceptance with an instruction to wait leaves Design Ready.
5. After unqualified direct acceptance of that combined gate, invoke `$agent-workflow-kit:act` with the exact Design path. Do not request synonymous authorization again. No generic implementation or continuation request outside the direct gate response may invoke Act.

The only terminal state is the direct transition to Act after the combined gate.
