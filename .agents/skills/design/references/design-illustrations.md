# Design Illustrations

When architecture, an interface or contract, a data structure, or data flow is affected, make the target design inspectable without requiring the user to reconstruct its shape from prose.

## Required affected-area artifacts

- **Architecture:** a compact structure tree showing components, ownership, and stable boundaries, plus illustrative code for the pivotal interface or composition point.
- **Interface or contract:** illustrative target-language code or schema showing the consumer-visible signature, invariants, and compatibility boundary.
- **Data structure:** a compact structure tree showing aggregates, containment, keys, and ownership, plus illustrative code for the representative type, fields, invariants, and mutation boundary.
- **Data flow:** a compact flow tree showing producer, transform, canonical state or transport, consumers, persistence, and an applicable failure branch, plus illustrative code for the representative read/write or transform path.

Prefer a compact text tree and use the target project's existing implementation language when one exists. Label every snippet as illustrative: it fixes only the stated contract and relationships, not exact file layout or final syntax.

For an affected architecture, data-structure, or data-flow discussion, keep inspected **current-state evidence** before the recommendation, put target artifacts inside their owning option, and use the corresponding structural evaluator kind:

- `### Recommended: A ...` then `#### Target Structure Tree` or `#### Target Flow Tree`, followed by `#### Illustrative Code`.
- Each materially different `### Alternative: B/C ...` carries its own target tree or flow tree and code.
- If an alternative keeps exactly the same target shape, use `#### Same Target Shape as Recommended` to name the shared artifacts and the non-structural difference; do not omit the relationship silently.

Use `architecture-decision`, `data-structure-decision`, or `data-flow-decision` for the corresponding affected structural discussion; its evaluator requires both artifacts for every structurally distinct option. Use ordinary `decision-card` for interface-only and other non-structural discussions.

Record only selected artifacts in the relevant `design.md` section. Keep discarded option artifacts in transient conversation material only, not in Design. Do not create an empty section or artifact for an unaffected dimension.

## Shapes

```text
Runtime
|- FeatureCoordinator (owns lifecycle)
|  `- IFeatureSource (stable boundary)
`- Renderer (consumer)
```

```csharp
// Illustrative contract, not final file placement.
public interface IFeatureSource
{
    FeatureSnapshot Read();
}
```

```text
Editor input
-> Validate
-> CanonicalSnapshot (owned state)
-> Save store
-> Runtime loader
-> Renderer
```

Use a Mermaid diagram only when it makes a non-tree relationship materially clearer.
