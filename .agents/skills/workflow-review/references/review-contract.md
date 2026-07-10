# Independent Review Contract

Determine whether the shared working tree fully implements the approved Design and Plan. Review outcomes and production behavior, not the main agent's confidence or summary.

## Rules

- Work read-only in the current shared working tree. Do not create a worktree and do not fix files.
- Reconstruct requirement-to-production-call-path relationships independently.
- Treat declarations, selectors, tests, or registration as insufficient unless the real runtime/editor/tooling path consumes them.
- Verify every success criterion and every checked Plan task has evidence.
- Distinguish implementation completeness from external/manual acceptance explicitly delegated by Design.
- Report only evidence-backed findings; style preferences do not block completion.

## Severity

- **P0:** Data loss, security boundary break, destructive behavior, or unusable core workflow.
- **P1:** Unmet success criterion, broken production integration, false validation claim, or material regression.
- **P2:** Non-blocking maintainability or resilience issue with a concrete risk.

`PASS` requires no P0/P1 and no unaccounted success criterion. If a finding admits multiple reasonable fixes or changes Design intent, state the decision needed; the main agent must ask the user.
