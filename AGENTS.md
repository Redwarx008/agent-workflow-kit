## Repository maintenance

- `.agents/skills/` is the only runtime source of truth. Keep `SKILL.md` focused on entry, orchestration, reference-loading order, and phase transitions; put each detailed runtime rule in one directly linked reference.
- `README.md` and `docs/` explain installation, intent, rationale, and maintenance. They must not introduce a runtime gate or algorithm absent from the canonical skill sources.
- Keep the Codex and Claude manifests synchronized. `.claude-plugin/` is a thin package entry; do not create a second skill tree or compatibility commands.
- Keep workflow/evaluator/Visual Companion runtime state under ignored `workflow/`; never stage or commit it.
- Preserve upstream attribution and safety boundaries for the bundled Visual Companion.
- Do not add or modify tests unless the user explicitly requests test work. Static skill validation and `npm run check` may be run after documentation or skill changes.
