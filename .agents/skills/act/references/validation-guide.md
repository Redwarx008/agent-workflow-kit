# Validation Selection

- Default: do not add or modify tests unless the user explicitly requests test work. Existing tests may still be run as evidence.
- When tests are explicitly requested, use targeted automated regression tests for deterministic logic, parsing, conversion, state machines, invariants, reproducible bugs, shared infrastructure, and security boundaries.
- Shader/GPU/rendering behavior: build/compile plus capture comparison, hot-edit evidence, screenshot/visual regression, or runtime smoke test.
- Editor/UI interaction: existing deterministic checks where useful, plus explicit manual interaction/appearance checks; create test coverage only when explicitly requested.
- Resource/version-control changes: follow the target project's ownership rules and record the relevant revision/signature.

If planned evidence cannot be obtained, do not silently substitute a weaker check. Stop and ask the user.

Before modifying implementation files, verify that every Plan-required validation command, script, tool, fixture, and required external input is present and invocable. This availability preflight does not replace the post-change validation. If availability cannot be established, stop before mutation.
