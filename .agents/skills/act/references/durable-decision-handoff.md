# Durable Decision Handoff

`workflow/` is local working memory. Before a commit, prevent decisions that outlive the current change from disappearing with local archival.

Review every selected Design decision and authorized amendment. A decision is durable when it changes a project-wide architecture boundary, ownership rule, public API or data format, persistence/compatibility/migration policy, resource/version-control boundary, security/operational policy, or validation policy that later changes must follow.

For every durable item, add or update the documentation location required by the target project's `AGENTS.md` - normally its session log and, when it is a significant architecture decision, an ADR. Link to an existing durable record instead of duplicating it when it still applies. Local implementation details require no workflow record.

Do not declare the change ready to commit while a durable item has no project-documentation record. Never commit `workflow/**` merely to preserve a decision.
