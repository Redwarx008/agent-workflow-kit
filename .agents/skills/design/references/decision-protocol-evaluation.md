# Decision-Protocol Evaluation

Use [../scripts/evaluate-decision-protocol.mjs](../scripts/evaluate-decision-protocol.mjs) as a mechanical gate for every user-facing Design decision card.

Before sending a card, write a transient JSON transcript under `workflow/.local/` (never Git) and run:

```powershell
node .agents/skills/design/scripts/evaluate-decision-protocol.mjs --allow-pending <transcript.json>
```

The transcript format is:

```json
{
  "turns": [
    {
      "role": "agent",
      "kind": "decision-card",
      "content": "## Domain decision\n..."
    }
  ]
}
```

After the user replies, append their `{ "role": "user", "content": "..." }` turn and run the command again without `--allow-pending` before resolving the Decision Map entry. If the evaluator fails, correct the message or stop; do not send or advance it.

The evaluator rejects missing card sections, recommendation after alternatives, internal `D-xxx` IDs, references that make the card depend on `design.md`, anything other than one direct question, and any agent turn after an unanswered card. It proves only these structural and turn-order properties. It cannot prove that repository facts, recommendation quality, or user intent are correct; those remain Design responsibilities.
