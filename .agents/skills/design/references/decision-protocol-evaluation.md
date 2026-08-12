# Design Dialogue Evaluation

Use [../scripts/evaluate-decision-protocol.mjs](../scripts/evaluate-decision-protocol.mjs) only as a mechanical gate for user-facing Design questions. It must not dictate the prose layout.

Before sending a question, write a transient JSON transcript under `workflow/.local/` and run:

```powershell
node .agents/skills/design/scripts/evaluate-decision-protocol.mjs --allow-pending <transcript.json>
```

Use this turn shape:

```json
{
  "turns": [
    {
      "role": "agent",
      "kind": "design-question",
      "proposes_code_change": true,
      "current_code_sources": ["src/Feature.cs:42"],
      "content": "Natural self-contained design discussion ending in one question..."
    }
  ]
}
```

Set `proposes_code_change` to `true` whenever the turn proposes a target that changes project code, including a recommendation-only explanation with a remaining choice. Then:

- set `current_code_sources` to every repository-relative `path:line` shown with a current-code block;
- include each listed source visibly in the message and label the evidence with `current code`;
- label the proposed code with `illustrative target`;
- include at least one non-empty fenced current-code block and one non-empty fenced illustrative-target block; multiple target options may add further blocks.

For new code, `current_code_sources` identifies the current caller, owner, interface, or insertion seam. For deletion, it identifies the current responsibility being removed. Set `proposes_code_change` to `false` only for pure intent clarification or a decision that changes no project code, and omit `current_code_sources`.

The evaluator checks source shape, visible source attribution, and enough code blocks for a comparison. It cannot prove excerpts are verbatim, correctly paired, or sufficient; Design owns that duty and independent Review verifies the proposal against the repository.

After the user replies, append the `{ "role": "user", "content": "..." }` turn and run the command again without `--allow-pending`. The mechanical reply check accepts any user text, so apply the Design dialogue contract before treating the choice as resolved. Delete the transcript when it no longer serves the evaluator.

The evaluator checks only stable mechanical properties: the turn has exactly one question terminator outside fenced code, does not expose an internal `D-xxx` ID, does not depend on opening `design.md`, visibly attributes current code and carries separate current/target code blocks when it proposes a code change, and is not followed by another agent turn before a user reply. It does not require card headings, A/B labels, recommendation order, per-option duplication, or repeated trees/code. It cannot judge whether facts, options, recommendation, excerpts, target code, or user intent are correct.
