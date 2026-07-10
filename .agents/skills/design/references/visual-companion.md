# Visual Companion Guide

Use the browser only when seeing the options materially improves the decision: UI/layout mockups, visual hierarchy, architecture diagrams, spatial relationships, state flows, or side-by-side visual designs. Keep requirements, API/data-model choices, and textual tradeoffs in the terminal.

## Consent

The first time a genuinely visual question arises, send a standalone consent request. Do not start a service or open a browser until the user agrees. Consent enables the companion for the current Design, but each later question still must pass the visual-value test.

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
6. Iterate with a new filename or push a uniquely named waiting fragment when returning to non-visual discussion.

Use the frame classes `options`, `option`, `cards`, `card`, `mockup`, `split`, `pros-cons`, `placeholder`, `mock-nav`, `mock-sidebar`, and `mock-content`. A selectable item must use a stable `data-choice` value and `onclick="toggleSelect(this)"`.

## Stop

- PowerShell: `.agents/skills/design/scripts/visual-companion/stop.ps1 -SessionDir <session_dir>`
- Bash: `bash .agents/skills/design/scripts/visual-companion/stop.sh <session_dir>`

Do not edit or expose token, PID, or state files. All runtime artifacts must remain under `workflow/.local/visual/`.
