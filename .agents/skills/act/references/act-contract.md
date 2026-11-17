# Act Contract

Apply the Design contract's decision-bearing/mechanical boundary and implement the authorized Design without making a new design choice.

## Workspace gate

Before product mutation, ask once whether to create an isolated worktree. Recommend isolation, state the proposed location and branch under the worktree reference, and wait. Use the current workspace if declined. During one uninterrupted Act, reuse the chosen workspace and pass it with the exact Design path directly to Review; never reconstruct either by scanning workflow records.

## Execution

Before any further product mutation after each user message during Act, compare the requested outcome or correction with the exact authorized Design:

- continue when the Design already fixes the same observable outcome and material mechanism, or when the current implementation violates it and repository evidence leaves one contract-preserving correction;
- return to Design when the message changes an authorized requirement or the Design leaves a decision-bearing implementation detail unresolved.

An empty property, placeholder UI, stub, TODO, unfinished draft, or generic word in the Design does not authorize the mechanism needed to make it real. A request to inspect or learn from an external implementation authorizes read-only research, not adoption or production mutation. Perform the comparison before drafting code; do not implement first and use discovered complexity to decide afterward whether the requirement belonged in Design. For anything returned, stop product mutation and pass the exact Design path plus repository evidence and the unresolved choice to `$agent-workflow-kit:design`. After the corrected Design passes its required review, resume this same authorized Act with the exact Design path and existing implementation workspace; do not request implementation authorization again.

## Implementation delegation

The session running Act orchestrates; it does not edit product files itself. Dispatch each implementation pass to one subagent of the `worker` agent role, passing only the exact Design path, the chosen workspace root, the paths of this contract, the stop-on-doubt protocol, and the validation guide, plus, for a correction pass, the uniquely determined correction and its evidence. The `worker` role must be defined in the host's user or project agent configuration; if it is unavailable, stop and report the missing role instead of implementing in this session.

The worker executes the loop below and returns changed files, each criterion it covered with its evidence, raw validation commands and output, and any remaining risk. The worker cannot reach the user: when the Design-return path or stop-on-doubt condition arises, it stops mutation and returns the evidence, the consequence, the concrete options, and its recommendation. This session then applies the stop-on-doubt protocol or Design-return path with the user and dispatches a new worker pass after resolution. Before review, this session inspects the actual diff against the worker's report; a mismatch is resolved by another worker pass, not by editing directly.

Until every success criterion is evidenced:

1. Select an unmet criterion or production-integration obligation and re-read its applicable Design and required evidence under the Design reading rules. A multi-path criterion remains unmet until every named path has evidence.
2. Trace the real production flow and callers before choosing the implementation seam. Prefer a shared root-cause correction only when it preserves the authorized behavior and scope.
3. Before mutation, confirm the Design-required validation entrypoint and prerequisites exist and are invocable. Apply the stop-on-doubt contract if they are unavailable.
4. Investigate unclear facts read-only and apply the stop-on-doubt contract.
5. Reduce the solution in order: no new mechanism; existing project code or shared seam; standard library or engine/platform; installed dependency; minimum project-local implementation. Follow the Design-return path above when this conflicts with the authorized Design.
6. Implement the smallest coherent change. Do not add an abstraction, interface, factory, wrapper, dependency, configuration surface, state copy/cache, compatibility path, fallback, file, or duplicated helper solely for hypothetical use.
7. Run applicable validation and retain raw command/output as transient evidence for Review, not a persistent execution ledger.
8. Mark a criterion covered only after its required evidence exists. Follow the Design-return path above for any deviation from final Design.

When one Design contains several outcomes or independently satisfiable parts, cover each one's criteria and evidence explicitly. The implementation order may be mechanical, but completing one part never completes the whole authorized Design. Do not manufacture a shared abstraction or lifecycle merely because the outcomes share one Design. Return a proposed removal, deferral, or regrouping to Design for the user's scope decision. After the revised Design passes review, resume the same Act under its existing authorization.

Do not silently add dependencies, change APIs or formats, broaden scope, choose compatibility policy, introduce fallback behavior, skip evidence, or replace validation. Follow the loaded validation guide, required domain skills, and target-project version-control rules.

## Independent review and closure

1. Follow [independent review dispatch](../../review/references/review-dispatch.md). Invoke `$agent-workflow-kit:review` with the exact `design.md`, implementation workspace root, raw validation entrypoints, and assigned scope. Use the final Design and actual diff to identify required coverage.
2. Send a uniquely determined P0/P1 or unmet-criterion correction to a worker. Return unresolved choices to Design before editing. Proceed to closure only after independent review passes.
3. Before requesting commit authorization, list every remaining P2, known limitation, and external/manual acceptance explicitly delegated by final Design, or state `none`. The single commit authorization also accepts this disclosed remainder. If the user requests resolution first, fix it and re-review the affected scope. Never present an unresolved product/technical decision, unmet success criterion, or unavailable Design-required validation as non-blocking; only validation explicitly delegated outside the agent may remain.
4. Apply the durable-decision handoff under the target project's document types, thresholds, and ownership rules.
5. At the next user-authorized commit boundary, commit approved project artifacts under repository ownership rules. Never stage `workflow/**` merely to archive it.
6. Only after the commit succeeds, delete completed local evaluator or Visual Companion state and move the entire `workflow/active/<change>/` directory to `workflow/completed/<change>/`, keeping the Design entry and area files together. If commit is absent or fails, leave Design active and report it ready to commit. Never create an empty commit solely to archive.

Never claim completion before independent `PASS`.
