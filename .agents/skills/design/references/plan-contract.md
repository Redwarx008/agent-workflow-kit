# Plan Contract

`plan.md` is local agent control state. It supports recovery and review without turning `design.md` into a process diary. It is not a separate user-facing planning phase and must not invent product intent or a file-by-file implementation sequence.

Keep only:

- decision dependencies, current status, user confirmation, and implementation-shaping open questions;
- concise repository facts and impact assessment that constrain a decision;
- Design revision, written-review, implementation authorization, workspace choice, raw validation evidence, amendments, durable-decision handoff, and independent review result.

Do not preserve rejected approaches, full conversation transcripts, repeated selected-design prose, or speculative future tasks.

## Gates

Before Design is Ready, all material decision entries have resolved status or justified `N/A`, every Change Impact row is `Affected` or justified `N/A`, and `Open Questions` has no implementation-shaping entry.

Before Act, Plan records the accepted Design revision and explicit implementation authorization for that revision. After an amendment, increment revision, re-review the affected selected Design, and reauthorize before further mutation.

Before completion, Plan has evidence for every success criterion, a workspace record, amendment handling where applicable, durable-decision classification, and an independent review verdict.
