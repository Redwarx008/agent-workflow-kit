# Independent Review Contract

Determine whether the shared working tree fully implements the authorized final Design. Review outcomes and production behavior, not the main agent's confidence or summary. Authorization is enforced by the direct Design-to-Act transition; Review does not reconstruct a hidden authorization or execution record.

## Rules

- Work read-only in the current shared working tree. Do not create a worktree and do not fix files.
- Reconstruct requirement-to-production-call-path relationships independently.
- Treat declarations, selectors, tests, or registration as insufficient unless the real runtime/editor/tooling path consumes them.
- Verify every final Design success criterion, constraint, contract, failure behavior, and required production integration path has evidence.
- For every Design correction that affects implementation, verify the final selected Design is the sole scope authority; if the diff exceeds it, report the excess rather than inferring user authorization.
- Confirm the supplied workspace is the workspace whose diff is reviewed. When a linked worktree was created, verify the local Design was not copied or staged and that the implementation diff belongs to the supplied workspace.
- Verify every selected Design decision or amendment that creates a durable project rule has the required project-documentation target; a workflow-only record is insufficient.
- For each added dependency, abstraction, interface/factory/wrapper, configuration/flag, state copy/cache, compatibility path, fallback, file, or duplicated helper, identify the approved requirement or project constraint it satisfies and verify that an existing project, standard-library, engine/platform, or installed-dependency capability does not already satisfy it completely.
- Treat unsupported independently maintained concepts as complexity findings. Judge the number of concepts and ownership boundaries, not raw line or file count; never recommend removing behavior, validation, failure handling, security, accessibility, or organization required by Design or project rules merely to shrink the diff.
- Distinguish implementation completeness from external/manual acceptance explicitly delegated by Design.
- Report only evidence-backed findings; style preferences do not block completion.

## Severity

- **P0:** Data loss, security boundary break, destructive behavior, or unusable core workflow.
- **P1:** Unmet success criterion, broken production integration, false validation claim, or material regression.
- **P2:** Non-blocking maintainability or resilience issue with a concrete risk.

`PASS` requires no P0/P1, no unaccounted success criterion, and no implementation beyond final Design scope. If a finding admits multiple reasonable fixes or changes intent, state the decision needed; the main agent must ask the user.
