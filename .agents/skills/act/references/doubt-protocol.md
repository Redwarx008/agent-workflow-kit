# Stop-on-Doubt Protocol

## Investigate first

Use read-only inspection to resolve discoverable facts: repository code and docs, recent history, tests, generated files, configuration, relevant upstream/vendor source, logs, captures, and current version-control state.

## Stop when uncertainty remains

An unknown repository fact is not automatically a user decision; investigate it first. Stop before further mutation when two or more reasonable choices remain and choosing among them can materially change observable behavior, a stable contract or format, data meaning or ownership, persistence or migration, compatibility, scope, dependency policy, fallback or failure behavior, validation strength, project risk, or the intended resolution of a reviewer finding. Also stop when the Design conflicts with production code or omits one of those material choices.

Tell the user:

1. What evidence created the doubt.
2. Why it changes the result or risk.
3. The concrete options and causal tradeoffs.
4. Your recommendation.

Wait for the response. Until then, continue only safe read-only investigation. Do not implement the recommendation first.

Proceed without asking only when the remaining variation is behaviorally equivalent, local, reversible, and cannot alter the approved Design or a stable project contract; use repository conventions to choose it. Examples include syntax, private naming, exact file placement within an established module, and mechanical execution order when they have no wider consequence. If uncertain whether alternatives are materially equivalent, stop.
