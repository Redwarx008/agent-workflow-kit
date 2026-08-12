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
      "content": "Natural self-contained design discussion ending in one question..."
    }
  ]
}
```

Set `proposes_code_change` to `true` whenever the turn proposes a target that changes project code, including a recommendation-only explanation with a remaining choice. That turn must contain at least one non-empty fenced target-code block whose language is not plain text or Mermaid. Set it to `false` for pure intent clarification or a decision that changes no project code. This metadata does not prove that the snippet is sufficient or faithful; Design and independent Review own that judgment.

After the user replies, append the `{ "role": "user", "content": "..." }` turn and run the command again without `--allow-pending`. The mechanical reply check accepts any user text, so apply the Design dialogue contract before treating the choice as resolved. Delete the transcript when it no longer serves the evaluator.

The evaluator checks only stable mechanical properties: the turn has exactly one question terminator outside fenced code, does not expose an internal `D-xxx` ID, does not depend on opening `design.md`, carries a code block when it declares a proposed code change, and is not followed by another agent turn before a user reply. It does not require headings, A/B labels, recommendation order, per-option artifacts, or repeated trees/code. It cannot judge whether facts, options, recommendation, code, or user intent are correct.
