# Pre-Question Exploration

Do not ask a substantive Design question until the current implementation and applicable reference implementations are grounded deeply enough to separate discoverable facts from user-owned choices.

The only permitted earlier question is one locator question when the request does not identify a searchable problem, feature, project, or coherent scope. Once the topic is locatable, complete this exploration before asking about architecture, interfaces, data, behavior, or implementation direction.

## Investigate the current project

Use targeted read-only inspection to establish:

1. The real production/editor/tooling entrypoint and call or data flow through the proposed change seam to every affected consumer.
2. The current owner of relevant state and data, its lifecycle, invariants, failure behavior, persistence or resource boundary, and dependency direction.
3. Existing project implementations with analogous behavior, shared seams, utilities, contracts, or patterns that may remove the need for a new mechanism.
4. Applicable project instructions, architecture/domain documents, ADRs, learnings, feature specifications, recent changes, and only the history needed to explain the current boundary or a prior failed approach.
5. Existing validation entrypoints and evidence forms capable of proving the affected production behavior.

When the scope is broad, crosses modules, or has an unclear entrypoint, use bounded read-only exploration subagents when the host and project rules permit. Give each one a concrete search question and require conclusions with tight source locations; do not delegate interpretation of the Design or ask several agents to duplicate the same scan. The main agent integrates the results and directly verifies the evidence that materially supports a recommendation.

## Compare applicable reference implementations

Actively search for applicable references instead of relying on generic memory. Use this priority:

1. Analogous implementation already in the project.
2. Source and examples for the exact engine, framework, platform, or dependency version used by the project.
3. Official upstream documentation, source, examples, specifications, or primary research.
4. A mature external implementation whose problem and constraints genuinely match.

Inspect references when the change touches an established algorithm, protocol, file/data format, engine or framework behavior, architectural pattern, integration mechanism, or another problem with a meaningful prior implementation. For project-specific behavior, still search the repository and relevant platform source; if no external analogue is applicable or found, say so instead of inventing one or forcing a superficial comparison.

Extract the mechanism, boundary, invariants, failure behavior, and validation strategy—not just an API name. Compare each useful reference against the project's actual version, ownership, performance, compatibility, resource, tooling, and deployment constraints. State what can be adopted, what cannot, and why. Prefer primary sources; do not base a technical recommendation on listicles or unattributed summaries when source or official material is available.

If an applicable reference is necessary to judge the decision but its source or required project evidence is inaccessible, report the missing evidence and stop; do not replace it with remembered convention.

## Completion test

Exploration is complete only when the agent can:

- draw the current relevant production or data flow;
- identify the actual owner, consumers, and change seam;
- explain which existing project mechanism can be reused or why none is complete;
- describe the relevant reference mechanism and its important differences from this project, or state the bounded search that found no applicable external analogue;
- identify the evidence that can validate the resulting behavior; and
- phrase the next question as a choice that cannot be answered from the inspected evidence.

Depth is measured by these outcomes, not file counts or a mandatory dossier. Keep raw searches, excerpts, and tool output transient. Write into `design.md` only current-state facts, reference provenance, and constraints that materially shape the selected design.

Before every later Design question, investigate any newly introduced code path, dependency, reference, or factual premise the same way. Completing the initial scan does not permit sending a later discoverable fact back to the user.
