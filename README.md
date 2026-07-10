# Agent Workflow Kit

面向 Codex 与 Claude Code 的轻量原生插件工作流：

`Design 讨论与记录 → Plan → 用户授权 → Act → 独立 Review → 归档`

它解决三个常见问题：意图和边界尚未清楚就开始实现；实施遇到歧义时 agent 静默替用户选择；声明、文件或测试存在，却没有接入真实生产调用链。

## 四个入口

- `$agent-workflow-kit:design`：唯一显式入口；调查真实仓库并持续记录 Design。
- `$agent-workflow-kit:plan`：Design Ready 后自动进入，建立 `Success Criterion → Task → Evidence` 追踪并等待明确授权。
- `$agent-workflow-kit:act`：授权后自动进入；调查后仍有疑问立即停止询问。
- `$agent-workflow-kit:review`：Act 完成后自动派独立 subagent，在同一工作区只读反查真实调用链。

工作流不得按任务特征自动启动；只有用户显式调用 `$agent-workflow-kit:design` 才进入。进入后按 `Design → Plan → 授权 → Act → Review` 自动推进。

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

把 [AGENTS.md](AGENTS.md) 中适用的触发与门禁合并进项目规则。项目规则和用户明确要求始终优先。

Design 开始前会运行 bundled preflight：在 Git 项目的 repo-local `.git/info/exclude` 中幂等确保 `/workflow/` 被忽略，然后才允许创建记录。Design、Plan、Visual Companion 状态和 Review 临时材料全部进入本地 `workflow/`，不会要求修改项目的 tracked `.gitignore`。

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

- 可从仓库、历史或官方资料查到的事实由 agent 调查，真正的取舍才询问用户。
- Design 是讨论过程中持续维护的记录，不是最后凭记忆补写。
- 除非用户显式要求，否则不新增或修改测试；现有测试仍可作为验证证据运行。
- 不把 TDD 机械套到视觉、GPU、shader 或探索性原型；证据形式服从真实因果链。
- Reviewer 不接受主 agent 的完成结论，从成功标准反向检查生产路径。

进一步说明见 [工作流哲学](docs/workflow-philosophy.md)、[验证策略](docs/validation-strategy.md)、[独立 Review](docs/independent-review.md)、[会话记忆](docs/session-memory.md) 和 [参考实现取舍](docs/reference-lessons.md)。

## License

仓库主体使用 MIT License。Visual Companion 的上游版权和许可证位于其 bundled source 目录。
