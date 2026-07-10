---
name: design
description: Explores a change against the real repository and maintains a living, decision-complete Design before implementation planning. Use when the user explicitly requests design, brainstorming, specification, or the project workflow, and automatically for ambiguous, multi-file, user-visible, architectural, API, persisted-format, rendering-pipeline, editor-workflow, or high-risk changes.
---

# Workflow Design

Turn an emerging change into a Ready Design through repository-grounded discussion. Do not plan implementation tasks or modify product code in this phase.

## Start

1. Before creating a workflow record, run `node scripts/preflight.mjs ensure --project-root <project-root>` from this skill directory. If it fails, stop without creating `workflow/`; never substitute a tracked ignore file.
2. Restore project context required by `AGENTS.md` and inspect relevant code, docs, recent changes, engine source, and existing active workflow records.
3. If the request contains independent subsystems, decompose it before detailed discussion.
4. Choose a folder-safe change name from the established intent. Create `workflow/active/<change-name>/design.md` from [assets/design.md](assets/design.md) early; do not wait until discussion ends.
5. Record known context immediately. Never make the user repeat information already present in the thread or repository.

## Discussion loop

- Maintain `Evidence`, `Decisions`, and `Open Questions` after every material resolution.
- Investigate discoverable facts instead of asking the user. Use existing project patterns and relevant upstream/vendor source where needed.
- Ask only for choices that affect intent or implementation direction. Ask one question at a time and lead with a recommendation plus meaningful alternatives.
- Explain causal tradeoffs. Reject unrelated refactors and speculative requirements.
- If a question is inherently visual, follow [references/visual-companion.md](references/visual-companion.md). Offer the companion just in time and start it only after explicit consent.

## Ready gate

Read [references/design-contract.md](references/design-contract.md) and run its readiness check. If any implementation-shaping ambiguity remains, continue the discussion. Do not fill gaps with assumptions.

When the gate passes:

1. Set Design status to `Ready` and write `Open Questions: None`.
2. Briefly tell the user why discussion is complete.
3. Invoke `$agent-workflow-kit:plan` directly. There is no separate Design approval gate.

The only terminal state is transition to Workflow Plan.
