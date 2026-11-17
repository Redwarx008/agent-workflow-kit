# Act Contract

Apply the [Design contract](../../design/references/design-contract.md#decisions-and-sources) and implement the authorized Design without making a new design choice.

## Workspace gate

Honor the user's workspace or branch choice for this change and verify the actual checkout. Without a prior choice, reuse an existing linked worktree (compare the absolute Git directory and common directory; a submodule's `.git` file alone does not indicate isolation). When the choice is still open, offer working in place or the recommended new worktree with its location and branch, and wait. Use [worktree setup](worktree-setup.md) to propose or create a new one. State the selected workspace and pass it with the original Design path to Review.

## Execution

Before any further product mutation after each user message during Act, compare the requested outcome or correction with the exact authorized Design:

- continue when the Design already fixes the same observable outcome and material mechanism, or when the current implementation violates it and repository evidence leaves one contract-preserving correction;
- return to Design when the message changes an authorized requirement or the Design leaves a decision-bearing implementation detail unresolved.

An empty property, placeholder UI, stub, TODO, unfinished draft, or generic word in the Design does not authorize the mechanism needed to make it real. A request to inspect or learn from an external implementation authorizes read-only research, not adoption. Before drafting code for an unresolved choice, stop mutation and pass the original Design path, repository evidence, and open question to `$agent-workflow-kit:design`.

## Implementation delegation

The session running Act orchestrates; it does not edit product files itself. Dispatch each implementation pass to one host-configured `worker` with the exact Design path, chosen workspace, and this contract. For a correction pass, also supply the uniquely determined correction and its evidence. If the role is unavailable, stop and report it.

The worker executes the loop below and returns changed files, each criterion it covered with its evidence, raw validation commands and output, and any remaining risk. The worker cannot reach the user: when the Design-return path or stop-on-doubt condition arises, it stops mutation and returns the evidence, the consequence, the concrete options, and its recommendation. This session then applies the stop-on-doubt protocol or Design-return path with the user and dispatches a new worker pass after resolution. Before review, this session inspects the actual diff against the worker's report; a mismatch is resolved by another worker pass, not by editing directly.

Until every success criterion is evidenced:

1. Select an unmet criterion or production-integration obligation and re-read its applicable Design and required evidence under the Design reading rules. A multi-path criterion remains unmet until every named path has evidence.
2. Trace the real production flow and callers before choosing the implementation seam. Prefer a shared root-cause correction only when it preserves the authorized behavior and scope.
3. Before first mutation, read the [validation guide](validation-guide.md) and confirm the Design-required evidence can be obtained.
4. Investigate unclear facts read-only. For unresolved doubt, stop and follow the [doubt protocol](doubt-protocol.md).
5. Reduce the solution in order: no new mechanism; existing project code or shared seam; standard library or engine/platform; installed dependency; minimum project-local implementation. Follow the Design-return path above when this conflicts with the authorized Design.
6. Implement the smallest coherent change. Do not add an abstraction, interface, factory, wrapper, dependency, configuration surface, state copy/cache, compatibility path, fallback, file, or duplicated helper solely for hypothetical use.
7. Run applicable validation and retain raw command/output as transient evidence for Review, not a persistent execution ledger.
8. Mark a criterion covered only after its required evidence exists. Follow the Design-return path above for any deviation from final Design.

Before returning the implementation for review, the worker updates any [durable project documentation](durable-decision-handoff.md) required by the project in the same workspace. Submit the code and those records as one review candidate.

Cover each independently satisfiable outcome. A proposed removal, deferral, or regrouping is a scope decision; return it to Design.

Do not silently add dependencies, change APIs or formats, broaden scope, choose compatibility policy, introduce fallback behavior, skip evidence, or replace validation. Follow required domain skills and target-project version-control rules.

## Independent review and closure

1. Follow [independent review dispatch](../../review/references/review-dispatch.md). Invoke `$agent-workflow-kit:review` with the exact `design.md`, implementation workspace root, raw validation entrypoints, and assigned scope. Use the final Design and actual diff to identify required coverage.
2. Send a uniquely determined P0/P1 or unmet-criterion correction to a worker. Return unresolved choices to Design before editing. Proceed to closure only after independent review passes.
3. After independent PASS, disclose remaining P2s, known limitations, and external/manual acceptance expressly delegated by Design, or state `none`. Honor an existing explicit commit instruction for this change if all remaining items are already accepted. Ask once for the missing commit authorization or acceptance of a newly disclosed remainder, combining both when needed. Implementation consent alone does not authorize a commit. Unmet criteria and unavailable required evidence still block completion. If the user requests a fix, re-review its affected scope.
4. At the user-authorized commit boundary, commit the reviewed code and project documents under repository ownership rules. If either changed since its review, return the affected scope for recheck first. Never stage `workflow/**` merely to archive it.
5. Only after the commit succeeds, delete completed local evaluator or Visual Companion state and move the entire `workflow/active/<change>/` directory to `workflow/completed/<change>/`, keeping the Design entry and area files together. If commit is absent or fails, leave Design active and report it ready to commit. Never create an empty commit solely to archive.

Never claim completion before independent `PASS`.
