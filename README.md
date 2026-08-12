# Agent Workflow Kit

面向 Codex 与 Claude Code 的轻量原生插件工作流：

`Design 讨论与记录 → 独立 Design Review → 最终审阅并授权 → Act 动态执行 → 独立 Implementation Review → 提交 → 归档`

它解决三个常见问题：意图和边界尚未清楚就开始实现；实施遇到歧义时 agent 静默替用户选择；声明、文件或测试存在，却没有接入真实生产调用链。

## 三个入口

- `$agent-workflow-kit:design`：唯一显式入口；调查真实仓库、持续记录 Design，并在候选 Ready 后派独立只读 subagent 审查成品。
- `$agent-workflow-kit:act`：用户在最终 Design 的合并审阅门禁中无保留接受后，携带当前 `design.md` 的确切路径直接进入；不再追加同义实施确认。脱离该门禁语境的普通实现请求或泛化“继续”不得触发 Act。
- `$agent-workflow-kit:review`：Act 完成后自动派独立 subagent，在同一工作区只读反查真实调用链。

工作流不得按任务特征自动启动；只有用户显式调用 `$agent-workflow-kit:design` 才进入。此后沿上述阶段自动推进，Design 的最终审阅同时承担实施授权，不再增加 Plan 或同义确认。独立 reviewer 检查完整成品，只有遇到自己无法可靠判断的具体问题时才追加一个只检查该问题的只读 subagent。

Claude Code 的交互式命令使用 `/agent-workflow-kit:design` 等同名 namespaced skill。没有 `$workflow-*` 兼容入口，也没有 kit 自建的 doctor；宿主环境分别使用 `codex doctor` 与 `claude doctor`。

## 安装

Codex：

```powershell
codex plugin marketplace add Redwarx008/agent-workflow-kit --ref main
codex plugin add agent-workflow-kit@agent-workflow-kit
```

Claude Code：

```powershell
claude plugin marketplace add Redwarx008/agent-workflow-kit
claude plugin install agent-workflow-kit@agent-workflow-kit
```

插件安装进入宿主版本化 cache。安装、升级或修改插件后，请开启一个新 task/session，避免旧上下文继续使用先前 skill。

更新：

```powershell
codex plugin marketplace upgrade agent-workflow-kit
codex plugin add agent-workflow-kit@agent-workflow-kit

claude plugin marketplace update agent-workflow-kit
claude plugin update agent-workflow-kit@agent-workflow-kit
```

标准安装、升级、禁用和卸载由宿主原生命令负责；本仓库不复制平台包管理器。

如果项目里仍有手工复制的旧 `$workflow-*` skills，请先人工确认这些目录没有用户修改，再自行删除。插件不会扫描、认领或清理消费项目文件。

## 项目接入

安装插件即可提供工作流入口；无需把本仓库的 `AGENTS.md` 复制到消费项目。目标项目自己的规则和用户明确要求始终优先。

Design 开始前会运行 bundled preflight：在 Git 项目的 repo-local `.git/info/exclude` 中幂等确保 `/workflow/` 被忽略，然后才允许创建记录。`design.md` 是唯一常驻工作流文件；Visual Companion、对话 evaluator 与 Review 的工具状态仅在需要时进入本地 `workflow/.local/`，不会要求修改项目的 tracked `.gitignore`。

## 维护与验证

仓库只维护直接保护插件契约与 bundled 工具安全边界的检查：

```powershell
npm ci
npm test
npm run check
npm run test:visual
npm run test:visual:powershell
```

`npm test` 覆盖 manifest/skill 契约和 Design preflight；`npm run check` 只检查当前仓库，不探测宿主 CLI、cache 或消费项目。Visual Companion 保留独立的鉴权、文件边界和进程生命周期回归。真实插件安装与升级使用宿主原生命令，发布时另开 fresh task 做针对性 smoke test。

## Visual Companion

`design` skill 包含一个 MIT 派生的本地浏览器 Visual Companion。它只在视觉问题真正受益且用户同意后启动；浏览器展示和记录选择，终端对话仍负责最终确认和授权。

```powershell
cd .agents/skills/design/scripts/visual-companion
npm --prefix tests ci
npm test
npm run test:powershell
```

它派生自 `obra/superpowers` v6.1.1，保留上游 MIT 许可证与来源记录。

## 设计原则

- 事实由 agent 从真实项目调查，无法由环境推导的取舍才交给用户。
- 首个实质 Design 问题前必须追踪真实生产路径、所有权、消费者、仓库内相似实现和适用的引擎、上游或成熟参考实现，并说明参考机制与本项目约束的差异；探索深度以能否回答这些问题衡量，不用固定读取次数或研究账本衡量。
- Design 使用自然的一问一答，不强制五段卡片、A/B 标签或逐维度审批；只有真实未决选择才提问。凡提议涉及项目代码变化，都提供对应的目标语言示意代码；多个方案共享的代码只展示一次，各方案只展示真正不同的部分。
- Design 持续保存最小充分的最终设计；Act 动态选择机械执行顺序，不维护重复 Plan。
- 设计与验收围绕一般规则、真实生产路径和能证明行为的证据，而不是可见样例或固定清单。
- 实施遇到会改变行为、契约、数据、兼容、范围或验证强度的疑问时停下询问，不静默选择默认方案。
- 独立 Review 从最终 Design 反查真实调用链、一般化能力、复杂度与项目规则；完整覆盖受影响范围，调查深度随风险变化。
- 长期知识只按目标项目自己的文档类型和门槛沉淀；本地 `workflow/` 不成为项目历史。

进一步说明见 [工作流哲学](docs/workflow-philosophy.md)、[验证策略](docs/validation-strategy.md)、[独立 Review](docs/independent-review.md)、[会话记忆](docs/session-memory.md) 和 [参考实现取舍](docs/reference-lessons.md)。

## 规范来源

- Design 编排：[design/SKILL.md](.agents/skills/design/SKILL.md)；详细流程与内容契约位于其 `references/`。
- Act 编排：[act/SKILL.md](.agents/skills/act/SKILL.md)；执行、疑问、worktree、验证与收尾规则位于其 `references/`。
- Review 编排：[review/SKILL.md](.agents/skills/review/SKILL.md)；唯一详细审查规则为 [review-contract.md](.agents/skills/review/references/review-contract.md)。

运行时行为以上述 skill 源为准。README 与 `docs/` 只解释用法和设计理由，不建立额外门禁。

## License

仓库主体使用 MIT License。Visual Companion 的上游版权和许可证位于其 bundled source 目录。
