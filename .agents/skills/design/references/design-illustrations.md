# Design Illustrations

When an architecture, data-structure, or data-flow decision is affected, make the design inspectable without requiring the reader to infer the shape from prose.

## Required artifacts

- **Architecture:** a fenced `Structure tree` showing components, ownership, and stable boundaries; then fenced `Illustrative code` showing the pivotal interface or composition point.
- **Data structure:** a fenced `Structure tree` showing aggregates, containment, keys, and ownership; then fenced `Illustrative code` showing the representative type, fields, invariants, and mutation boundary.
- **Data flow:** a fenced `Flow tree` showing producer, transform, canonical state or transport, consumers, persistence, and failure branch where applicable; then fenced `Illustrative code` showing the representative read/write or transform path.

Use the target project's existing implementation language when one exists. Label every snippet as illustrative: it fixes the intended contract and relationships, not exact file layout or final syntax. Keep the tree and code in both the relevant `design.md` section and the self-contained decision card that asks the user to decide that chapter. Use a precise `N/A` reason only when the dimension is genuinely unaffected.

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

Choose a compact text tree by default. Use a Mermaid diagram only when it makes a non-tree relationship materially clearer; the illustrative code remains required.
