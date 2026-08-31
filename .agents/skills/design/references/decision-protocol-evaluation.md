# Design Dialogue Evaluation

Use [../scripts/evaluate-decision-protocol.mjs](../scripts/evaluate-decision-protocol.mjs) as the mechanical gate for user-facing Design questions. The same transient transcript is the current-question record across user turns and context compaction. It does not dictate the prose layout, and a pass is not validation of the Design, evidence, recommendation, or target mechanism.

Keep the one current-question record for this Design at the exact path `workflow/.local/<change-name>/design-question.json`. Before sending a question, write the exact active `design.md` path and complete final user-facing message into that record, then run the evaluator against that same file:

```powershell
node .agents/skills/design/scripts/evaluate-decision-protocol.mjs --allow-pending workflow/.local/<change-name>/design-question.json
```

The `design_path` identifies the selected-results document for this exact workflow. The latest agent `content` in this canonical record is the outgoing message. A draft, handoff file, reviewer report, or another `workflow/.local/` file is not a current-question record. After the evaluator passes, send that content verbatim as the final question; if the message changes, update the canonical record and run the evaluator again before sending it. Keep this file while its question awaits or processes a reply.

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

After the user replies, reread this reference and [design-dialogue.md](design-dialogue.md), then open the current-question record rather than reconstructing the question from recent chat. Bind the reply to its latest agent question, append the `{ "role": "user", "content": "..." }` turn, and run the command again without `--allow-pending`. The mechanical reply check accepts any user text, so apply the Design dialogue contract before treating the choice as resolved.

- When the reply resolves the question, apply the selected result to the record's exact `design_path`, then delete `design-question.json` before advancing or presenting another question. The absence of this record means the Design has no unanswered question. Continue from the selected results in `design.md`; when another decision is ready, create and validate its new record in the same turn so the outgoing response follows the Design process's completion rule.
- When the reply needs clarification, retain the record, append the validated clarification as its next agent `design-question` turn, and wait for the next reply.
- When context resumes with a record ending in an agent question, use that question as the current choice. When it ends in a user reply, reconcile the selected result against the record's exact `design_path`: clear the record when the result is already present, otherwise apply it once and then clear the record. When context resumes without a record, use `design.md` only for settled results and present the next unresolved question before accepting a new reply label.

The record contains only the current unresolved exchange and is deleted as soon as that choice is applied. It is disposable local state, not Design history or Git content.

The evaluator checks only the mechanical properties stated in this reference and ignores question-like syntax inside code. A pass does not replace the semantic requirements in the dialogue, illustration, or Design contracts.
