# Worktree Setup

Use these rules to propose the location and branch for a new worktree, and create it only when the user has chosen isolation. Adapted from Superpowers' `using-git-worktrees`.

## Preserve the Design

The Design entry and area files remain together in the initiating checkout's local `workflow/` directory. Do not copy, move, or Git-stage them for worktree setup. Pass the absolute `design.md` path and the implementation-workspace path directly to Review; Act and Review read the original Design under its reading rules while inspecting the selected workspace.

## Isolation order

1. Use an explicitly available host-native worktree mechanism before manual Git. Do not invent or bypass a harness-owned mechanism.
2. For manual Git fallback, choose location in this order: an explicit project/user instruction; existing `.worktrees/`; existing `worktrees/`; otherwise new project-local `.worktrees/`. Never default to a sibling directory.
3. From the repository root, use `git check-ignore` on the selected project-local worktree directory (with a trailing slash). If already ignored, leave the rules unchanged. Otherwise, for local isolation, append only that root-relative directory rule to the exclude file located by `git rev-parse --git-path info/exclude` and verify the directory is ignored before creation. If a shared ignore rule is required, explain the proposed tracked edit and commit and obtain explicit approval first; choosing a worktree does not authorize either.
4. Use the project's explicit branch convention. In Codex, use the host default `codex/<change-name>` when no project convention overrides it. If neither exists, stop and ask for the branch name. If the branch or destination already exists, stop and ask; never attach, overwrite, or delete it by assumption.

## Dirty primary checkout and baseline

Before manual creation, inspect the initiating checkout's status. A new worktree starts at committed Git state and does not contain uncommitted changes. If Design or implementation could depend on any dirty path, stop and ask the user whether to commit, stash, include it by another explicit method, or work in place. Do not stash, copy, or discard anything automatically. If inspected evidence proves the dirty paths are unrelated, state that exclusion in the current discussion before creating the worktree.

After setup, follow the target project's `AGENTS.md` for dependency setup and baseline validation. Do not invent package installation, test commands, or a validation policy that contradicts the project rules. If required baseline validation fails, report it and wait for direction before implementation.
