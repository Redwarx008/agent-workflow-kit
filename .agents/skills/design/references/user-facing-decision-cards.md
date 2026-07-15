# User-Facing Decision Cards

Plan decision IDs exist only for internal traceability. Never require the user to infer a decision from `D-003`, a table row, or a prior design document.

Ask exactly one decision per message. Use the domain language of the change and make the message understandable on its own:

```markdown
## <Domain title: what is being decided>

### Why this must be decided now

<Inspected facts and the production consequence of delaying or choosing differently.>

### Recommended: A — <short choice name>

<What it does and why it is recommended.>

### Alternative: B — <short choice name>

<When it is appropriate and its material consequence.>

### Your decision

<One direct A/B/C confirmation or an open question when the answer cannot be enumerated.>
```

Put the recommendation before alternatives. Include only real alternatives; when evidence leaves one viable proposal, omit the alternative section and ask the user to confirm or adjust that proposal. Prefer finite A/B/C choices over a vague “confirm?” question. The agent must still inspect facts itself and must not ask the user to read `design.md` to reconstruct context.

For an architecture, data-structure, or data-flow card, keep only inspected current-state evidence before `Recommended`. Put each proposed target's fenced `Target Structure Tree` or `Target Flow Tree` and fenced `Illustrative Code` inside that option. Give each materially different alternative its own artifacts; an alternative sharing the recommendation's shape must use `Same Target Shape as Recommended` and explain the difference. Mark its transient evaluator turn as `architecture-decision`, `data-structure-decision`, or `data-flow-decision` so omission or detached target artifacts fail the mechanical gate. After the user chooses, copy only the selected artifacts into Design.
