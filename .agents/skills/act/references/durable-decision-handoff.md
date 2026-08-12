# Durable Decision Handoff

`workflow/` is local working memory. Before a commit, prevent decisions that outlive the current change from disappearing with local archival.

Review every selected Design decision and authorized amendment. A decision is durable when it changes a project-wide architecture boundary, ownership rule, public API or data format, persistence/compatibility/migration policy, resource/version-control boundary, security/operational policy, or validation policy that later changes must follow.

For every durable item, follow the target project's own documentation types, creation thresholds, indexes, and ownership rules. Update or link to an existing stable record when it still applies. Create a session log, ADR, architecture document, feature specification, or learning only when the target project's rules require that type and its threshold is met. The plugin has no default document type and must not create records merely to complete a handoff ritual. Local implementation details require no workflow record.

Do not declare the change ready to commit while a durable item lacks documentation required by the target project. If the project defines no durable-document requirement for that item, do not invent one. Never commit `workflow/**` merely to preserve a decision.
