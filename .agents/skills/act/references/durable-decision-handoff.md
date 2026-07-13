# Durable Decision Handoff

`workflow/` is local working memory. Before a commit, prevent decisions that outlive the current change from disappearing with local archival.

Classify every confirmed Design decision and authorized amendment in `execution.md` as one of:

- **Durable:** it changes a project-wide architecture boundary, ownership rule, public API or data format, persistence/compatibility/migration policy, resource/version-control boundary, security/operational policy, or validation policy that later changes must follow.
- **Local:** it is only a mechanical implementation detail or a scope choice whose effect ends with this change. Record why it does not guide later work.

For every Durable item, add or update the documentation location required by the target project's `AGENTS.md` - normally its session log and, when it is a significant architecture decision, an ADR. Record the exact path and heading in `execution.md`. Link to an existing durable record instead of duplicating it when it still applies.

Do not declare the change ready to commit while a confirmed decision or amendment lacks a classification, or while a Durable item has no project-documentation record. Never commit `workflow/**` merely to preserve a decision.
