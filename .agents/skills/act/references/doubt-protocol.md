# Stop-on-Doubt Protocol

## Investigate first

Use read-only inspection to resolve discoverable facts: repository code and docs, recent history, tests, generated files, configuration, relevant upstream/vendor source, logs, captures, and current version-control state.

## Stop when uncertainty remains

An unknown repository fact is not automatically a user decision; investigate it first. When the Act contract's Design-return condition remains after investigation, stop before further mutation and follow that path.

Tell the user:

1. What evidence created the doubt.
2. Why it changes the result or risk.
3. The concrete options and causal tradeoffs.
4. Your recommendation.

Wait for the response. Until then, continue only safe read-only investigation. Do not implement the recommendation first.

Proceed only when the Act contract classifies the remaining work as mechanical.
