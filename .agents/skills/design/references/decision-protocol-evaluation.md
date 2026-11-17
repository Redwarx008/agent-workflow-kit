# Design Dialogue Evaluation

Use [../scripts/evaluate-decision-protocol.mjs](../scripts/evaluate-decision-protocol.mjs) as the mechanical gate for user-facing Design questions. The same transient transcript is the current-question record across user turns and context compaction. It does not dictate the prose layout, and a pass is not validation of the Design, evidence, recommendation, or target mechanism.

Before sending a question, write the exact active `design.md` path and complete final user-facing message to the current-question record shown below. Use absolute paths: `<design-skill-dir>` is the directory containing the loaded Design skill's `SKILL.md`; `<project-root>` is the initiating checkout that owns this Design.

```powershell
node "<design-skill-dir>/scripts/evaluate-decision-protocol.mjs" --allow-pending "<project-root>/workflow/.local/<change-name>/design-question.json"
```

The `design_path` identifies the `design.md` entry for this exact workflow, including its listed area files. The latest agent `content` in this canonical record is the outgoing message. A draft, handoff file, reviewer report, or another `workflow/.local/` file is not a current-question record. After the evaluator passes, send that content verbatim as the final question; if the message changes, update the canonical record and run the evaluator again before sending it. Keep this file while its question awaits or processes a reply.

Use this turn shape:

```json
{
  "design_path": "workflow/active/example-change/design.md",
  "turns": [
    {
      "role": "agent",
      "kind": "design-question",
      "proposes_code_change": true,
      "option_labels": ["A", "B"],
      "content": "Natural self-contained design discussion ending in one question..."
    }
  ]
}
```

Set `option_labels` to sequential `A`, `B`, `C` labels when two or more finite choices remain viable after investigation, and to `[]` only for a genuinely open question or when evidence leaves no alternative set. Do not collapse viable alternatives found by exploration or review into an unlabeled yes/no confirmation. Every declared option must have a visible labeled entry, and the final question must name every available label. Do not use option labels as decision IDs or a promised count of future questions.

`proposes_code_change` means that this turn already proposes a concrete target type, interface, control flow, integration mechanism, state transition, allocation or reuse rule, lifecycle or ordering change, deletion, or other project-code transformation. It does not mean merely that accepting the scope may lead to code work later. Set it to `true` for a concrete code target, including a recommendation-only explanation with a remaining implementation choice. Then label the proposed code with `illustrative target` and include at least one non-empty fenced illustrative-target block; multiple target options may add further blocks.

`current_code_sources` records the sources for a current-code block selected under [design-dialogue.md](design-dialogue.md). For such a block:

- set `current_code_sources` to every repository-relative `path:line` shown with a current-code block;
- include each listed source visibly in the message and label the evidence with `current code`;
- include separate non-empty current-code and illustrative-target blocks.

Set `proposes_code_change` to `false` for intent or scope selection that does not yet propose a concrete code target. When the dialogue rule selects a current-code excerpt for such a turn, include `current_code_sources`, show every listed repository-relative `path:line`, label the evidence `current code`, and include at least one non-empty fenced current-code block. Introduce an `illustrative target` after the outcome is selected. A turn consisting of repository findings without an excerpt has no `current_code_sources` field.

On each reply, open the record, pair the reply with its latest question, append the user turn, and validate without `--allow-pending`. A pass confirms turn order and format, not a decision. For both live and recovered replies use [Resolve the turn](design-dialogue.md#resolve-the-turn):

- **Resolved:** apply the selected result once at the recorded `design_path`, checking its owning section first on recovery. Delete the record only after the result is there; continue under the [Design process](design-process.md).
- **Still open:** answer the follow-up or clarify the same choice. Keep the record, append and validate the clarification as its next question, and await the reply.

On recovery, a record ending in an agent question still awaits its reply; one ending in a user turn takes the same two branches above. Without a record, resume from settled Design content and present the next question before accepting a label.
