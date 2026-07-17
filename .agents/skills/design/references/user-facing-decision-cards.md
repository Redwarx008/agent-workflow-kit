# User-Facing Decision Cards

Internal tracking IDs, if a tool temporarily uses them, are never user-facing. Never require the user to infer a decision from `D-003`, a table row, or a prior design document.

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

Put the recommendation before alternatives and include only real alternatives. Every affected Design area must be discussed: when evidence leaves one viable proposal, omit the alternative section and ask the user to confirm, correct, or explicitly delegate that proposal instead of manufacturing another option. Prefer finite A/B/C choices when genuine alternatives exist. The agent must still inspect facts itself and must not ask the user to read `design.md` to reconstruct context.

For every affected architecture, data-structure, or data-flow discussion, follow [design-illustrations.md](design-illustrations.md): keep inspected current-state evidence before `Recommended`, put each target artifact inside its owning option under `#### Target Structure Tree` or `#### Target Flow Tree` and `#### Illustrative Code`, and use the matching structural evaluator kind. For an affected interface or contract, include its illustrative signature or schema in the recommendation and each materially different alternative. After the user responds, copy only selected artifacts into Design.
