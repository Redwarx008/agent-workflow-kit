# Act Contract

Implement the authorized Design without changing its intent. Design fixes behavior and technical decisions; repository facts determine mechanical execution order.

## Workspace gate

Before product mutation, ask once whether to create an isolated worktree. Recommend isolation, state the proposed location and branch under the worktree reference, and wait. Use the current workspace if declined. During one uninterrupted Act, reuse the chosen workspace and pass it with the exact Design path directly to Review; never reconstruct either by scanning workflow records.

## Execution

Until every success criterion is evidenced:

1. Select an unmet criterion or production-integration obligation and re-read its final constraints, affected system, and required evidence. A multi-path criterion remains unmet until every named path has evidence.
2. Trace the real production flow and callers before choosing the implementation seam. Prefer a shared root-cause correction only when it preserves the authorized behavior and scope.
3. Before mutation, confirm the Design-required validation entrypoint and prerequisites exist and are invocable. Apply the stop-on-doubt contract if they are unavailable.
4. Investigate unclear facts read-only. Apply the stop-on-doubt contract whenever materially different choices remain or reality conflicts with Design.
5. Reduce the solution in order: no new mechanism; existing project code or shared seam; standard library or engine/platform; installed dependency; minimum project-local implementation. A material Design correction returns to Design instead of being silently simplified.
6. Implement the smallest coherent change. Do not add an abstraction, interface, factory, wrapper, dependency, configuration surface, state copy/cache, compatibility path, fallback, file, or duplicated helper solely for hypothetical use.
7. Run applicable validation and retain raw command/output as transient evidence for Review, not a persistent execution ledger.
8. Mark a criterion covered only after its required evidence exists. If a deviation changes final Design, use the Design decision protocol, update only selected Design content after the user responds, repeat affected Design review, and present the combined final gate again before resuming.

When one Design contains several outcomes or independently satisfiable parts, cover each one's criteria and evidence explicitly. The implementation order may be mechanical, but completing one part never completes the whole authorized Design. Do not manufacture a shared abstraction or lifecycle merely because the outcomes share one Design. If a part must be removed, deferred, or regrouped, treat that as a Design scope change and return through Design review and authorization rather than silently dropping it.

Do not silently add dependencies, change APIs or formats, broaden scope, choose compatibility policy, introduce fallback behavior, skip evidence, or replace validation. Follow the loaded validation guide, required domain skills, and target-project version-control rules.

## Independent review and closure

1. Launch one independent subagent with `$agent-workflow-kit:review`, passing only `design.md`, the implementation workspace root, and raw validation entrypoints.
2. If the reviewer names one or more exact questions it cannot reliably judge, launch the smallest sufficient number of suitable read-only subagents, each for only one question. Require evidence-backed findings and exactly one `PASS`, `FAIL`, or `BLOCKED` per question. The main reviewer integrates and deduplicates their evidence and retains the overall verdict. Do not predefine or routinely dispatch specialist categories.
3. Resolve P0/P1 and unmet criteria only when the correction is uniquely determined; otherwise ask the user before editing. Re-run the appropriate review until the whole review has no blocker. A specialist `PASS` resolves only its question.
4. Reconcile final Design behavior, evidence, amendments, and review verdicts.
5. Before requesting commit authorization, list every remaining P2, known limitation, and external/manual acceptance explicitly delegated by final Design, or state `none`. The single commit authorization also accepts this disclosed remainder. If the user requests resolution first, fix it and re-review the affected scope. Never present an unresolved product/technical decision, unmet success criterion, or unavailable Design-required validation as non-blocking; only validation explicitly delegated outside the agent may remain.
6. Apply the durable-decision handoff under the target project's document types, thresholds, and ownership rules.
7. At the next user-authorized commit boundary, commit approved project artifacts under repository ownership rules. Never stage `workflow/**` merely to archive it.
8. Only after the commit succeeds, delete completed local evaluator or Visual Companion state and move `design.md` from `workflow/active/<change>/` to `workflow/completed/<change>/`. If commit is absent or fails, leave Design active and report it ready to commit. Never create an empty commit solely to archive.

Never claim completion before independent `PASS`.
