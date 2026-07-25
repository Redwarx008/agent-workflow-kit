# Reviewer Output Shape

## Coverage

| Success criterion | Evidence inspected | Result |
| --- | --- | --- |

## Generalization audit

For each materially changed behavior, state the intended input class or invariant, the irrelevant example properties varied or counterexamples inspected, the production evidence, and the result. Do not claim broader support than the final Design requires.

## Findings

For each finding provide severity, concise title, exact file/line, observed evidence, causal mechanism, and violated criterion/constraint. For overfitting, identify the incidental example property the implementation depends on and an equivalent authorized input that would take the wrong path. Omit the section when there are no findings.

## Validation gaps

Separate implementation gaps from external/manual acceptance explicitly delegated by Design.

## Verdict

Return exactly one of:

- `PASS` — complete against the authorized Design; no P0/P1.
- `FAIL` — actionable implementation or evidence gaps exist.
- `BLOCKED` — required truth cannot be obtained without user/external action or an unresolved decision.
