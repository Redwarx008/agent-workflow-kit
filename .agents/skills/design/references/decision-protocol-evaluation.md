# Design Dialogue Evaluation

Use [../scripts/evaluate-decision-protocol.mjs](../scripts/evaluate-decision-protocol.mjs) only as a mechanical gate for user-facing Design questions. It must not dictate the prose layout, and a pass must never be described or treated as validation of the Design, evidence, recommendation, or target mechanism.

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
      "option_labels": ["A", "B"],
      "current_code_sources": ["src/Feature.cs:42"],
      "content": "Natural self-contained design discussion ending in one question..."
    }
  ]
}
```

Set `option_labels` to sequential `A`, `B`, `C` labels when the question offers two or more finite choices, and to `[]` for a genuinely open question or a direct question with no alternative set. Every declared option must have a visible labeled entry, and the final question must name every available label. Do not use option labels as decision IDs or a promised count of future questions.

`proposes_code_change` means that this turn already proposes a concrete target type, interface, control flow, integration mechanism, deletion, or other project-code transformation. It does not mean merely that accepting the scope may lead to code work later. Set it to `true` for a concrete code target, including a recommendation-only explanation with a remaining implementation choice. Then:

- set `current_code_sources` to every repository-relative `path:line` shown with a current-code block;
- include each listed source visibly in the message and label the evidence with `current code`;
- label the proposed code with `illustrative target`;
- include at least one non-empty fenced current-code block and one non-empty fenced illustrative-target block; multiple target options may add further blocks.

For new code, `current_code_sources` identifies the current caller, owner, interface, or insertion seam. For deletion, it identifies the current responsibility being removed.

Set `proposes_code_change` to `false` for intent or scope selection that does not yet propose a concrete code target. Such a turn may still show current repository code or configuration to prove current behavior or reachability. When it does, include `current_code_sources`, show every listed repository-relative `path:line`, label the evidence `current code`, and include at least one non-empty fenced current-code block. Do not include an `illustrative target` until the outcome is selected. Omit `current_code_sources` when no current code is shown.

After the user replies, append the `{ "role": "user", "content": "..." }` turn and run the command again without `--allow-pending`. The mechanical reply check accepts any user text, so apply the Design dialogue contract before treating the choice as resolved. Delete the transcript when it no longer serves the evaluator.

The evaluator checks only stable mechanical properties: one question terminator outside fenced code; no internal ID or fixed-batch label; a self-contained message; declared finite-choice labels and their use in the question; visible attribution for declared current code; separate current/target blocks for a concrete code proposal; and no second agent turn before the reply. It ignores question-like syntax inside code and does not require cards, recommendation order, or duplicated artifacts. It cannot determine whether a supposedly open question should instead have finite choices, or validate facts, excerpts, estimates, platform claims, necessity, recommendations, target correctness, Design consistency, or user intent; satisfy the other Design contracts independently.
