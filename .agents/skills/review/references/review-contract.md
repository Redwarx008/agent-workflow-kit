# Independent Review Contract

Determine whether the shared working tree fully implements the authorized final Design. Treat `plan.md` as an index to claims and evidence, not as authority. Review outcomes and production behavior, not the main agent's confidence or summary.

## Rules

- Work read-only in the current shared working tree. Do not create a worktree and do not fix files.
- Reconstruct requirement-to-production-call-path relationships independently.
- Treat declarations, selectors, tests, or registration as insufficient unless the real runtime/editor/tooling path consumes them.
- Verify every final Design success criterion, constraint, contract, failure behavior, and required production integration path has evidence.
- Verify Plan is bound to the exact current Design and that its written-review and implementation-authorization revision chain precedes the matching diff. For every Amendment, verify user confirmation and reauthorization precede the matching implementation diff.
- Verify the recorded Worktree Choice and Implementation Workspace match the actual reviewed checkout. When a linked worktree was created, verify original local workflow records were not copied or staged and that the implementation diff belongs to the recorded branch/workspace.
- Verify every selected Design decision and amendment has a Durable or Local handoff classification. For each Durable item, verify the required project-documentation target exists and records the operative rule; a workflow-only record is insufficient.
- Distinguish implementation completeness from external/manual acceptance explicitly delegated by Design.
- Report only evidence-backed findings; style preferences do not block completion.

## Severity

- **P0:** Data loss, security boundary break, destructive behavior, or unusable core workflow.
- **P1:** Unmet success criterion, broken production integration, false validation claim, or material regression.
- **P2:** Non-blocking maintainability or resilience issue with a concrete risk.

`PASS` requires no P0/P1, no unaccounted success criterion, and no implementation beyond the current authorized Design revision. If a finding admits multiple reasonable fixes or changes intent, state the decision needed; the main agent must ask the user.
