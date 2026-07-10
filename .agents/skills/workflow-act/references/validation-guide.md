# Validation Selection

- Deterministic logic, parsing, conversion, state machines, invariants, and reproducible bugs: targeted automated regression tests.
- Shared infrastructure and security boundaries: automated unit/integration tests including negative cases.
- Shader/GPU/rendering behavior: build/compile plus capture comparison, hot-edit evidence, screenshot/visual regression, or runtime smoke test.
- Editor/UI interaction: deterministic service/view-model tests where useful, plus explicit manual interaction/appearance checks.
- Resource/version-control changes: follow the target project's ownership rules and record the relevant revision/signature.

If planned evidence cannot be obtained, do not silently substitute a weaker check. Stop and ask the user.
