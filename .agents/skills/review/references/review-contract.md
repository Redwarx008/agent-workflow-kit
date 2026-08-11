# Independent Review Contract

Determine whether the shared working tree fully implements the authorized final Design. Review outcomes and production behavior, not the main agent's confidence or summary. Authorization is enforced by the direct Design-to-Act transition; Review does not reconstruct a hidden authorization or execution record.

## Rules

- Work read-only in the current shared working tree. Do not create a worktree and do not fix files.
- Reconstruct requirement-to-production-call-path relationships independently.
- Treat declarations, selectors, tests, or registration as insufficient unless the real runtime/editor/tooling path consumes them.
- Verify every final Design success criterion, constraint, contract, failure behavior, and required production integration path has evidence.
- Derive the intended input class and governing invariants only from the final Design, public contracts, inspected project rules, and domain model. Do not silently broaden the feature while reviewing it.
- Audit implementation and validation for example-specific coupling: fixture or test names, exact names/IDs, incidental order/count/dimensions, visible sample values, current dataset membership, and branches that recognize known cases instead of implementing the governing rule. Consider equivalent inputs with those irrelevant properties changed and trace the production behavior.
- Treat a fixed value as legitimate when an explicit protocol, schema, resource format, approved requirement, or domain invariant requires it. Report overfitting only when evidence connects an incidental example property to incorrect or unsupported behavior.
- For every Design correction that affects implementation, verify the final selected Design is the sole scope authority; if the diff exceeds it, report the excess rather than inferring user authorization.
- Confirm the supplied workspace is the workspace whose diff is reviewed. When a linked worktree was created, verify the local Design was not copied or staged and that the implementation diff belongs to the supplied workspace.
- Verify every selected Design decision or amendment that creates a durable project rule has the required project-documentation target; a workflow-only record is insufficient.
- For each added dependency, abstraction, interface/factory/wrapper, configuration/flag, state copy/cache, compatibility path, fallback, file, or duplicated helper, identify the approved requirement or project constraint it satisfies and verify that an existing project, standard-library, engine/platform, or installed-dependency capability does not already satisfy it completely.
- Treat unsupported independently maintained concepts as complexity findings. Judge the number of concepts and ownership boundaries, not raw line or file count; never recommend removing behavior, validation, failure handling, security, accessibility, or organization required by Design or project rules merely to shrink the diff.
- Apply explicit project naming rules only when an applicable instruction/standards file states them. Every standards finding must cite the rule and the newly introduced or renamed project-owned symbol that violates it; do not turn an example into an unstated keyword or grammar rule.
- Separately inspect new or renamed domain types, stable interfaces, ownership/lifecycle boundaries, and symbols central to changed logic for semantic maintainability. Report a naming finding only when evidence traces `name-implied meaning -> actual responsibility or behavior -> concrete risk of misunderstanding, misuse, duplicated vocabulary, or unsafe maintenance`. A compound noun/verb shape is not itself a defect. Exempt incidental locals, personal wording preference, mechanical word/prefix matches, BCL/third-party APIs, framework-mandated signatures, and unchanged pre-existing symbols outside the reviewed scope.
- Distinguish implementation completeness from external/manual acceptance explicitly delegated by Design.
- Report only evidence-backed findings. Personal style preferences do not block completion. A naming issue becomes a finding only through an explicit applicable project rule or the demonstrated semantic causal chain above.

## Severity

- **P0:** Data loss, security boundary break, destructive behavior, or unusable core workflow.
- **P1:** Unmet success criterion, broken production integration, false validation claim, material regression, implementation that only satisfies visible examples while failing the authorized input class, an explicit project naming-rule violation that the project treats as blocking, or a stable/domain contract name with a demonstrated materially misleading consequence.
- **P2:** Non-blocking maintainability or resilience issue with a concrete risk, including suspicious example coupling whose failure is not yet demonstrated or a central internal name whose semantic mismatch has a demonstrated maintenance consequence.

`PASS` requires no P0/P1, no unaccounted success criterion, and no implementation beyond final Design scope. If a finding admits multiple reasonable fixes or changes intent, state the decision needed; the main agent must ask the user.
