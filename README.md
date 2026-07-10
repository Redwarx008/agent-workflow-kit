# Agent Workflow Kit

一套从真实项目协作中提炼的、面向 Codex 与 Claude Code 的轻量工作流：

`Design 讨论与记录 → Plan → 用户授权 → Act → 独立 Review → 归档`

它借鉴了 [Grilling](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling)、[SPAR-kit](https://github.com/Jed-Tech/spar-kit) 与 [Superpowers Brainstorming](https://github.com/obra/superpowers/tree/main/skills/brainstorming)，重点解决三个问题：

- agent 在意图和边界尚未清楚时过早实现；
- 实施中遇到歧义却自行选择方案；
- “文件写了、测试有了”被误当成生产链路完整实现。

## 核心规则

- 可从仓库查到的事实由 agent 调查，真正的取舍才询问用户。
- Design 是讨论期间持续维护的活文档，不是最后凭记忆补写的总结。
- Design 无阻塞问题后自动进入 Plan；Plan 必须获得用户授权才能实施。
- 实施阶段调查后仍有任何疑问，立即停止并询问用户，不得静默 fallback、扩 scope 或替换验证。
- 实现完成后必须由独立 subagent 在同一工作区从成功标准反查真实调用链。
- 测试形式服从因果机制：确定性逻辑用自动化回归，视觉/GPU 行为用真实运行、截图或截帧证据。

## 内容

- `.agents/skills/workflow-design` — 探索、讨论、持续记录 Design，并按需启动 Visual Companion。
- `.agents/skills/workflow-plan` — 把 Ready Design 转成可追踪、可验证的执行 Plan。
- `.agents/skills/workflow-act` — 按授权 Plan 实施，执行 stop-on-doubt 门禁并发起 Review。
- `.agents/skills/workflow-review` — 只读独立验收真实实现完整性。
- `.claude/skills` — 指向 canonical skills 的 Claude Code 薄入口。
- `docs/` — 从项目实践提炼的工作流哲学、会话记忆、验证和 Review 原则。

运行时的 Design、Plan、Visual Companion 状态与临时 Review 材料统一写入项目的 `workflow/`，该目录默认不进入 Git。

## 接入项目

1. 将四个 `.agents/skills/workflow-*` 目录复制到目标项目相同位置。
2. Claude Code 用户同时复制 `.claude/skills/workflow-*`。
3. 将 [AGENTS.md](AGENTS.md) 中的工作流规则合并进目标项目现有规则；项目规则优先。
4. 在目标项目 `.gitignore` 中忽略 `workflow/`。
5. 显式调用 `$workflow-design`，或让项目规则对多文件、架构/API、持久化格式、用户可见行为和高风险变更自动触发它。

## Visual Companion

`workflow-design` 包含一个 MIT 派生的本地浏览器 Visual Companion。它只在视觉问题真正受益且用户同意后启动；浏览器展示和记录选择，终端对话仍是最终反馈与授权通道。

Visual Companion 派生自 `obra/superpowers` v6.1.1，保留上游 MIT 许可证和来源记录。

### 验证 Visual Companion

```powershell
cd .agents/skills/workflow-design/scripts/visual-companion
npm --prefix tests ci
npm test
npm run test:powershell
```

Windows Git Bash 的完整 watchdog 探针约需 150 秒：

```bash
bash tests/windows-lifecycle.test.sh
```

## 文档

- [工作流哲学](docs/workflow-philosophy.md)
- [会话记忆与经验沉淀](docs/session-memory.md)
- [验证策略](docs/validation-strategy.md)
- [独立 Review 门禁](docs/independent-review.md)
- [参考实现取舍](docs/reference-lessons.md)

## License

本仓库主体使用 MIT License。Visual Companion 的上游版权与许可证见其 bundled source 目录。
