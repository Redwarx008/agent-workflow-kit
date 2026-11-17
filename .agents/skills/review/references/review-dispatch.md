# Independent review dispatch

Use one independent, read-only subagent of the host's `reviewer` role for the whole review. When the work divides usefully, assign scopes in parallel instead. Together they cover the full Design or implementation: give each cross-area contract and end-to-end criterion an owner who checks both sides. If the role is unavailable, stop and report it.

Wait for all reports on the same candidate before editing. The main agent summarizes their results and merges duplicate findings without changing a reviewer's judgment. A missing check or conflicting evidence goes back for independent review of that question only. After a fix, recheck the affected scope and its dependents; retain results whose subject and evidence are unchanged.

Proceed when the reports cover the required scope and all of it passes. An outstanding failure, missing result, or unresolved conflict cannot be summarized as a pass.
