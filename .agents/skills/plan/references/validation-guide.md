# Validation Selection

- Default: do not add or modify tests unless the user explicitly requests test work. Existing tests may still be run as evidence.
- When tests are explicitly requested, follow the user's requested scope and method. If either is unclear and affects implementation, ask instead of narrowing or expanding it.
- Shader/GPU/rendering behavior: build/compile plus capture comparison, hot-edit evidence, screenshot/visual regression, or runtime smoke test.
- Editor/UI interaction: existing deterministic checks where useful, plus explicit manual interaction/appearance checks; create test coverage only when explicitly requested.
- Resource/version-control changes: follow the target project's ownership rules and record the relevant revision/signature.

If planned evidence cannot be obtained, do not silently substitute a weaker check. Stop and ask the user.
