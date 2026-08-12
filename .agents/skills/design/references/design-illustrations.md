# Design Illustrations

When architecture, an interface or contract, a data structure, or data flow is affected, make the target design inspectable without requiring the user to reconstruct its shape from prose.

## Required affected-area artifacts

- **Architecture:** a compact structure tree showing components, ownership, and stable boundaries, plus illustrative code for every proposed code change at the pivotal interface or composition point.
- **Interface or contract:** illustrative target-language code or schema showing the consumer-visible signature, invariants, and compatibility boundary.
- **Data structure:** a compact structure tree showing aggregates, containment, keys, and ownership, plus illustrative code for the representative type, fields, invariants, and mutation boundary.
- **Data flow:** a compact flow tree showing producer, transform, canonical state or transport, consumers, persistence, and an applicable failure branch, plus illustrative code for the representative read/write or transform path.

Prefer a compact text tree and use the target project's existing implementation language when one exists. Label every snippet as illustrative: it fixes only the stated contract and relationships, not exact file layout or final syntax.

Keep inspected current-state evidence distinct from target proposals. Show shared current evidence, target structure, or target code once. For each materially different option, add only the tree fragment or illustrative code needed to expose its distinct ownership, contract, data meaning, or flow. If an option shares an artifact, state that briefly instead of copying it. Formatting and headings are chosen for readability, not evaluator compliance.

Every proposal that changes project code must include the current repository code with `path:line` and corresponding illustrative target code even when no structural tree is required. A structure or flow tree cannot satisfy either code block. Conversely, do not generate a tree for a simple local code change whose surrounding architecture is unchanged.

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
