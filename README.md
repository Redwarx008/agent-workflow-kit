# Agent Workflow Kit

面向 Codex 与 Claude Code 的轻量原生插件工作流：

`Design 讨论与记录 → Plan → 用户授权 → Act → 独立 Review → 归档`

它解决三个常见问题：意图和边界尚未清楚就开始实现；实施遇到歧义时 agent 静默替用户选择；声明、文件或测试存在，却没有接入真实生产调用链。

## 四个入口

- `$agent-workflow-kit:design`：调查真实仓库，持续记录 Design；问题清零后自动进入 Plan。
- `$agent-workflow-kit:plan`：建立 `Success Criterion → Task → Evidence` 追踪并等待明确授权。
- `$agent-workflow-kit:act`：执行已授权 Plan；调查后仍有疑问立即停止询问。
- `$agent-workflow-kit:review`：独立 subagent 在同一工作区只读反查真实调用链。

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

## 项目接入

把 [AGENTS.md](AGENTS.md) 中适用的触发与门禁合并进项目规则。项目规则和用户明确要求始终优先。

Design 开始前会运行 bundled preflight：在 Git 项目的 repo-local `.git/info/exclude` 中幂等确保 `/workflow/` 被忽略，然后才允许创建记录。Design、Plan、Visual Companion 状态、真实行为评测输出和 Review 临时材料全部进入本地 `workflow/`，不会要求修改项目的 tracked `.gitignore`。

## 行为评测（eval）

行为评测用于检查 skill 是否真的改变 agent 行为，而不只是比较 prompt 文本。仓库跟踪 case、fixture、schema 与 deterministic grader；模型原始输出只写入忽略的 `workflow/.local/evals/`。

先运行无模型检查：

```powershell
npm ci
npm test
npm run eval:validate
npm run check
```

检查消费项目的本地安装、遗留副本和所有权风险：

```powershell
node scripts/check.mjs --project-root <project-path> --json
```

输出区分规范仓库版本/commit、Codex/Claude cache、陈旧版本、已知遗留发布、用户修改、未知所有权、malformed 副本和重复加载风险。检查命令只报告；不会删除或覆盖项目文件。

维护者显式运行真实 Claude/Codex batch：

```powershell
npm run eval:run -- --runner all
```

默认 batch 是一个 old/new paired case 在每个 runner 各 3 次，加五个 new-only restraint/smoke case各 1 次，共约 22 次模型调用。真实模型 eval 不在 GitHub Actions 中运行，不读取 CI secrets；安全门禁要求 paired new arm 在每个 runner 上 3/3，通过追加重跑不能覆盖失败。

本地发布还应运行 `npm run test:lifecycle`；需要证明 Codex 新 task 实际加载 cache 中的 namespaced skill 时，运行 `npm run test:fresh:codex`。后者会临时安装唯一命名的本地 marketplace，并在 `finally` 中清理。

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
- 不把 TDD 机械套到视觉、GPU、shader 或探索性原型；证据形式服从真实因果链。
- Reviewer 不接受主 agent 的完成结论，从成功标准反向检查生产路径。

进一步说明见 [工作流哲学](docs/workflow-philosophy.md)、[验证策略](docs/validation-strategy.md)、[独立 Review](docs/independent-review.md)、[会话记忆](docs/session-memory.md) 和 [参考实现取舍](docs/reference-lessons.md)。

## License

仓库主体使用 MIT License。Visual Companion 的上游版权和许可证位于其 bundled source 目录。
