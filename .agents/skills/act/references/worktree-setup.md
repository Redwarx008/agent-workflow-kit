# Worktree Setup

Use this only after the user explicitly chooses an isolated worktree at the start of Act. It adapts the isolation order from Superpowers' `using-git-worktrees` skill to the local-workflow boundary.

## Preserve the workflow record

The exact `design.md` and `execution.md` remain in the initiating checkout's local `workflow/` directory. Do not copy, move, or Git-stage them. Record the absolute implementation-workspace path in `execution.md`; Act and Review must read the original records while inspecting the selected workspace.

## Isolation order

1. Detect existing isolation first: compare `git rev-parse --git-dir` with `git rev-parse --git-common-dir`, and use `git rev-parse --show-superproject-working-tree` to avoid mistaking a submodule for a linked worktree. If already isolated, record it and do not create another worktree.
2. Use an explicitly available host-native worktree mechanism before manual Git. Do not invent or bypass a harness-owned mechanism.
3. For manual Git fallback, choose location in this order: an explicit project/user instruction; existing `.worktrees/`; existing `worktrees/`; otherwise new project-local `.worktrees/`. Never default to a sibling directory.
4. Before project-local creation, prove the selected directory is ignored with `git check-ignore`. If it is not ignored, the user's worktree consent covers adding the ignore rule and making the required setup commit before creation; do not create an unignored worktree.
5. Use the project's explicit branch convention. In Codex, use the host default `codex/<change-name>` when no project convention overrides it. If neither exists, stop and ask for the branch name. If the branch or destination already exists, stop and ask; never attach, overwrite, or delete it by assumption.

## Dirty primary checkout and baseline

Before manual creation, inspect the initiating checkout's status. A new worktree starts at committed Git state and does not contain uncommitted changes. If Design or implementation could depend on any dirty path, stop and ask the user whether to commit, stash, include it by another explicit method, or work in place. Do not stash, copy, or discard anything automatically. If inspected evidence proves the dirty paths are unrelated, record that exclusion in `execution.md` before creating the worktree.

After setup, follow the target project's `AGENTS.md` for dependency setup and baseline validation. Do not invent package installation, test commands, or a validation policy that contradicts the project rules. If required baseline validation fails, report it and wait for direction before implementation.
