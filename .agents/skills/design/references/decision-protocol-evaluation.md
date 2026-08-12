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
      "current_code_sources": ["src/Feature.cs:42"],
      "content": "Natural self-contained design discussion ending in one question..."
    }
  ]
}
```

`proposes_code_change` means that this turn already proposes a concrete target type, interface, control flow, integration mechanism, deletion, or other project-code transformation. It does not mean merely that accepting the scope may lead to code work later. Set it to `true` for a concrete code target, including a recommendation-only explanation with a remaining implementation choice. Then:

- set `current_code_sources` to every repository-relative `path:line` shown with a current-code block;
- include each listed source visibly in the message and label the evidence with `current code`;
- label the proposed code with `illustrative target`;
- include at least one non-empty fenced current-code block and one non-empty fenced illustrative-target block; multiple target options may add further blocks.

For new code, `current_code_sources` identifies the current caller, owner, interface, or insertion seam. For deletion, it identifies the current responsibility being removed.

Set `proposes_code_change` to `false` for intent or scope selection that does not yet propose a concrete code target. Such a turn may still show current repository code or configuration to prove current behavior or reachability. When it does, include `current_code_sources`, show every listed repository-relative `path:line`, label the evidence `current code`, and include at least one non-empty fenced current-code block. Do not include an `illustrative target` until the outcome is selected. Omit `current_code_sources` when no current code is shown.

The evaluator checks source shape, visible source attribution, and enough code blocks for a comparison. It cannot prove excerpts are verbatim, correctly paired, sufficient, current rather than proposed, or capable of supporting the recommendation. It also cannot validate derived numbers, platform claims, necessity, or consistency with the living Design. The main agent must satisfy the exploration, Design, and dependency-repair contracts before running it; evaluator success does not authorize updating Design or advancing the dialogue.

After the user replies, append the `{ "role": "user", "content": "..." }` turn and run the command again without `--allow-pending`. The mechanical reply check accepts any user text, so apply the Design dialogue contract before treating the choice as resolved. Delete the transcript when it no longer serves the evaluator.

The evaluator checks only stable mechanical properties: the turn has exactly one question terminator outside fenced code; does not expose an internal `D-xxx` ID or fixed-batch label such as `设计卡 1/2` or `Decision 1 of 2`; does not depend on opening `design.md`; visibly attributes any declared current-code evidence; carries separate current/target code blocks when it proposes a concrete code target; and is not followed by another agent turn before a user reply. These checks inspect prose outside fenced code for dialogue markers, so valid language syntax and examples inside code blocks are not rewritten to satisfy the evaluator. It does not require card headings, A/B labels, recommendation order, per-option duplication, or repeated trees/code. It cannot judge whether facts, options, recommendation, excerpts, target code, or user intent are correct.
