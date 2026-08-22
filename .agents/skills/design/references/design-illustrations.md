# Design Illustrations

When architecture, an interface or contract, a data structure, or data flow is affected, make the target design inspectable without requiring the user to reconstruct its shape from prose.

## Required affected-area artifacts

- **Architecture:** a compact structure tree showing components, ownership, and stable boundaries.
- **Interface or contract:** illustrative target-language code or schema showing the consumer-visible signature, invariants, and compatibility boundary.
- **Data structure:** a compact structure tree showing aggregates, containment, keys, and ownership, plus illustrative code for the representative type, fields, invariants, and mutation boundary.
- **Data flow:** a compact flow tree showing producer, transform, canonical state or transport, consumers, persistence, and an applicable failure branch, plus illustrative code for the representative read/write or transform path.

Prefer a compact text tree and the target project's implementation language. Apply the dialogue contract for illustrative target code and its current-code display rule; trees complement representative target code and decision-relevant repository findings. Omit a tree for a local change whose surrounding structure is unchanged, and omit all artifacts for unaffected dimensions.

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
