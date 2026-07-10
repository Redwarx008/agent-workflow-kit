# Stop-on-Doubt Protocol

## Investigate first

Use read-only inspection to resolve discoverable facts: repository code and docs, recent history, tests, generated files, configuration, relevant upstream/vendor source, logs, captures, and current version-control state.

## Stop when uncertainty remains

Stop before further mutation whenever there are multiple reasonable implementations or uncertainty about a Design conflict or omission, scope, API/format, compatibility, persistence, dependency choice, fallback behavior, validation substitution, failure handling, non-mechanical task ordering, or a reviewer finding.

Tell the user:

1. What evidence created the doubt.
2. Why it changes the result or risk.
3. The concrete options and causal tradeoffs.
4. Your recommendation.

Wait for the response. Until then, continue only safe read-only investigation. Do not implement the recommendation first.

Mechanical details may proceed only when Design and existing project patterns admit one safe interpretation. If you doubt uniqueness, stop.
