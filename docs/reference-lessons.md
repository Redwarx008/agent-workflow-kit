# 参考实现取舍

## Grilling

采用事实与决策分离、一次一个问题、每个问题提供推荐答案。避免把用户当作代码搜索接口，也避免一次抛出大量互相依赖的问题。

## SPAR-kit

采用 Design 与 Plan 的职责分离、明确的阶段输入输出、成功标准追踪和完成后记忆沉淀。运行时记录保持本地，避免让每个项目的过程文档污染共享 kit。

## Superpowers Brainstorming

采用先探索项目、比较 2-3 个有效方案、定义 Design Ready gate，以及 Visual Companion 的 just-in-time 原则。没有采用“所有微小改动都必须完整 Design”、机械 TDD 或自动提交 Design 文档。

Visual Companion 保留上游已加固的 session key、同源 WebSocket、路径 containment、token fallback、断线恢复、空闲退出和 PID 所有权语义。浏览器只辅助视觉选择；终端对话仍是最终反馈和授权通道。

## 项目实践补充

- Review 必须读取共享工作区，不能因隔离而错过未提交实现。
- 验证按任务类型选择，尤其不能用普通单元测试替代 GPU/视觉证据。
- 通用工作流应提供门禁和模板，但项目自己的领域规则、资源版本控制和用户明确要求始终优先。
