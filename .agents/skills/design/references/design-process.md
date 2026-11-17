# Design Process

Turn the requested change into the minimum-sufficient selected Design. Apply the companion references for the detailed contracts; this file owns the discussion order and Ready transition.

## Establish the Design unit

After exploration, follow the user's delivery scope under the [Design contract](design-contract.md#required-content). Ask about grouping only if the scope remains unclear.

Maintain `workflow/active/<change-name>/design.md` and its listed area files. Write the proved facts that frame the first decision after exploration, then write each resolved target and its [source](design-contract.md#decisions-and-sources) in its owning section. Update the overview when scope or area relationships change. Rewrite superseded content instead of appending history. Evaluator and Visual Companion files remain disposable `workflow/.local/` state.

Treat every user correction, disproved premise, changed recommendation, or superseded decision as a dependency repair, not a local wording edit. Before asking the next question:

1. verify the corrected fact when it is discoverable from the environment;
2. find every Design statement, estimate, requirement, interface, schema, rationale, success criterion, and later decision that depended on the old premise;
3. rewrite or remove all invalidated content and reopen any prior choice whose trade-off changed; and
4. use the area index and contract references to reread affected definitions and their consumers, and reconcile the overview so one coherent current architecture, contract, and data flow remains.

Do not preserve the repair history in Design, and do not continue from the old conclusion merely because the user corrected only one sentence.

For an explicit implementation request, verify its factual premises and carry the already selected goal forward without asking whether to do it again. For an exploratory comparison, audit, or open-ended improvement request, first present the evidence-backed candidates together, distinguish current behavior from future capability and maintenance value in plain domain language, recommend what is worth pursuing, and ask one scope-selection question. The user may select one, several, all, or none. Do not design a concrete target for an unselected candidate. If evidence disproves a requested premise, explain it and ask whether to revise the goal or conclude with no implementation.

## Discuss the selected design

1. Carry forward explicit user choices without asking again, along with the grounded current flow and applicable reference comparison. Investigate every new factual premise before using it.
2. Identify approaches that meet the accepted need. When their outcomes and trade-offs are equivalent, recommend the one that adds the least machinery, favoring existing project or platform capabilities. Justify any new concept by the specific need the existing mechanism leaves unmet.
3. Before presenting an approach set, establish one decision axis through `settled facts -> unresolved consequence -> user-owned difference`. Check every candidate against the selected Design and the inspected project boundary. Include reuse, removal, or moving responsibility to its existing owner when those are real alternatives to a new abstraction. Then classify the result:
   - with two or more viable targets, compare the smallest representative set and identify the recommendation;
   - with a [uniquely determined target](design-contract.md#decisions-and-sources), record it and continue; or
   - with no viable target, state the common premise or missing evidence that invalidates the set and reopen the nearest upstream boundary that created it. Continue investigation or discussion there before proposing another target.
4. Resolve affected boundaries in dependency order, inspecting the real path for each area.
5. Use the dialogue and evaluator contracts for one unresolved decision at a time, and wait for an explicit resolution before updating Design or advancing a dependent question.
6. Immediately record the selected result. In the same turn present the next unresolved decision, explain a blocker that needs the user, or follow the Ready transition below. Recording a result is not a separate confirmation step.

Reject unrelated refactors and speculative requirements.

## Ready transition

1. When the [Design readiness check](design-contract.md#readiness-check) is satisfied, follow [independent review dispatch](../../review/references/review-dispatch.md). Give reviewers the exact `design.md`, project root, [Design Review contract](design-review-contract.md), and their assigned scope.
2. Preserve each blocking finding's disposition. Ask the user about `USER DECISION` findings one at a time before editing affected or dependent sections. Apply an already selected or mechanical correction only within its evidenced boundary. If counterevidence challenges a finding, return it to a reviewer for a focused recheck. A mechanical P2 wording or illustration fix needs no recheck unless it affects another section.
3. When implementation remains and this workflow has not yet received implementation authorization, ask the user to review the independently reviewed Design through its `design.md` entry and listed area files. State that an unqualified direct reply such as “确认”, “继续”, or “按此实施” both accepts the written Design and authorizes Act. A correction returns to discussion and required re-review. Explicit acceptance with an instruction to wait leaves Design Ready.
4. After that initial unqualified acceptance, invoke `$agent-workflow-kit:act` with the exact Design path. The authorization then persists for the lifetime of this workflow. If Act later returns the Design for correction, resolve the missing decisions and complete the required review, then resume the same Act automatically with the exact Design path and existing implementation workspace. Never request implementation authorization again. An explicit pause suspends execution without removing authorization; an explicit revocation stops execution until the user directly instructs it to resume. A generic implementation or continuation request before the initial gate does not authorize Act.
5. For a no-implementation outcome, follow the user's disposition: an explicit instruction to close and archive needs no further reply; a deferral leaves the Design active. If no disposition is settled, ask whether to archive or defer, explaining your recommendation if it is yours. On archive, move `workflow/active/<change>/` to `workflow/completed/<change>/`, clear only its disposable tool state, and stop without invoking Act or committing project code.
