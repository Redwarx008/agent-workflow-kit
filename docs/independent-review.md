# 独立 Review

## 目的

设计者和实现者都会沿用自己的假设。独立 reviewer 从最终成品、真实工作区和生产调用链重新建立判断，重点发现“声明存在但没有接入”“只适配当前样例”“验证证据没有证明成功标准”等作者自审容易遗漏的问题。

## 两次检查

Design Review 把当前代码作为现状、接入点和可行性证据，检查事实前提、用户所选范围、选择来源以及最终 Design 是否自包含；目标尚未实施是预期状态，不构成 finding。Design 包括 `design.md` 及其列出的领域文件，整体评审覆盖全部领域和跨领域契约。Implementation Review 才检查真实 diff 是否完整落实成功标准和生产路径。两者都读取原始成品和证据，不接受作者结论，也不替用户决定或直接修复。

覆盖由本轮选定语义与实际变更共同决定，深度随后果、可逆性和边界稳定性变化。按范围分工时，跨领域契约也有明确的审查人；主 agent 汇总独立结论，有遗漏或冲突就针对该问题补查。未被本轮改变、依赖或明确要求改变的既有行为不构成 finding。

两阶段共用[审查分工规则](../.agents/skills/review/references/review-dispatch.md)。具体检查内容见 [Design Review 规则](../.agents/skills/design/references/design-review-contract.md) 与 [Implementation Review 规则](../.agents/skills/review/references/review-contract.md)。
