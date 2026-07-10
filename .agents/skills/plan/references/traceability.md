# Planning Traceability

For each Design success criterion, name the exact task or tasks that realize it and the evidence that will prove it. Avoid vague entries such as "test it".

Good evidence examples:

- parser behavior -> named regression test and expected observable result
- SDSL registration -> asset registration inspection plus forced asset/effect build
- render-path behavior -> runtime smoke or RenderDoc event/resource evidence
- editor UX -> deterministic view-model/service checks plus explicit manual interaction steps
- resource change -> Lore revision/signature and runtime consumer evidence

A task is not complete merely because files were edited. A criterion is not covered merely because a test or type with a related name exists.
