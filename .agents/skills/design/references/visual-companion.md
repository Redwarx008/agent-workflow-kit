# Visual Companion Guide

Decide per question, not per Design or topic. Use the browser only when the user would understand or answer the question materially better by seeing a visual relationship or visual difference than by reading it.

Use the browser for content whose relevant information is inherently visual:

- UI mockups, layouts, navigation structures, visual hierarchy, and look-and-feel comparisons;
- architecture, data-flow, state-machine, entity-relationship, or spatial diagrams when their geometry or relationships are what the user must inspect;
- side-by-side visual designs whose meaningful differences cannot be preserved by an equivalent compact terminal description.

Use the terminal for content whose answer is words, a contract, or a technical choice:

- requirements, scope, constraints, and clarifying questions;
- conceptual or textual A/B/C choices, trade-off lists, and comparison tables;
- API design, data modeling, architectural approach selection, compatibility, failure behavior, and validation policy;
- structure trees, flow trees, formulas, signatures, schemas, illustrative code, and textual process steps that remain equally understandable without browser styling.

A topic involving architecture, UI, rendering, coordinates, or spatial terminology is not automatically visual. A browser page must expose a relationship or difference that would be materially harder to inspect in the terminal. Do not use it merely to typeset a recommendation, formula, code sample, tree, process, or decision card as a slide. If removing the layout, graphics, or side-by-side presentation would preserve all decision-relevant information, use the terminal.

## Consent

The first time a genuinely visual question arises, send a standalone consent request. Do not start a service or open a browser until the user agrees. Consent enables the companion for the current Design, but each later question must independently pass the visual-value test above. Do not keep using the browser merely because it is already open.

## Start

- PowerShell: `.agents/skills/design/scripts/visual-companion/start.ps1 -ProjectRoot <root> -Open`
- Bash: `bash .agents/skills/design/scripts/visual-companion/start.sh --project-dir <root> --open`

Prefer the Codex in-app browser when available; otherwise use the returned complete authenticated `url`. Preserve `session_dir`, `screen_dir`, and `state_dir` from startup JSON. Never share a bare port or strip the key from the initial URL.

## Screen loop

1. Confirm `state/server-info` exists and `state/server-stopped` does not.
2. Write a new, semantically named HTML fragment to `screen_dir`; never reuse a filename.
3. Use 2-4 meaningful options and scale fidelity to the question.
4. End the turn and ask the user to inspect the page and reply in the terminal. Browser clicks are supporting evidence, not authorization.
5. On the next turn, read `state/events` if present and merge it with the terminal response; terminal text is authoritative.
6. Iterate with a new filename. When the next question does not pass the visual-value test, push a uniquely named waiting fragment before returning to terminal discussion so resolved visual material does not imply that the browser remains the decision channel.

Use the frame classes `options`, `option`, `cards`, `card`, `mockup`, `split`, `pros-cons`, `placeholder`, `mock-nav`, `mock-sidebar`, and `mock-content`. A selectable item must use a stable `data-choice` value and `onclick="toggleSelect(this)"`.

## Stop

- PowerShell: `.agents/skills/design/scripts/visual-companion/stop.ps1 -SessionDir <session_dir>`
- Bash: `bash .agents/skills/design/scripts/visual-companion/stop.sh <session_dir>`

Do not edit or expose token, PID, or state files. All runtime artifacts must remain under `workflow/.local/visual/`.
