## 对话与决策

- 使用用户当前语言沟通。
- 可从仓库、文档、历史或官方资料发现的事实先自行调查。
- 调查后仍存在多种合理实现、计划遗漏、需求歧义、范围变化或验证替代时，立即停止实施并询问用户。
- 不得静默增加依赖、改变 API/格式/兼容策略、扩大范围、采用 fallback、跳过验证或降低质量标准。

## 项目工作流

- 对用户显式要求，或多文件、意图不清、架构/API、持久化格式、用户可见行为和高风险变更，先使用 `$agent-workflow-kit:design`。
- Design 是本地活文档；无阻塞问题后自动进入 `$agent-workflow-kit:plan`。
- Plan 获得用户明确授权后才能使用 `$agent-workflow-kit:act`。
- Act 完成后必须派独立 subagent 使用 `$agent-workflow-kit:review`，在同一工作区只读验收。
- runtime Design/Plan、Visual Companion 状态和临时 review 材料写入 `workflow/`，不得提交 Git。
- 项目自身规则与用户明确要求优先于本工作流。

## 验证

- 确定性逻辑、解析、转换和可复现 bug 使用自动化回归测试。
- 视觉、GPU、shader 和编辑器交互使用能证明行为的编译、运行、截帧、截图或明确手动验证。
- 原计划验证不可执行时必须询问用户，不得自行换成更弱的验证。
