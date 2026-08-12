# 独立 Review

## 目的

设计者和实现者都会沿用自己的假设。独立 reviewer 从最终成品、真实工作区和生产调用链重新建立判断，重点发现“声明存在但没有接入”“只适配当前样例”“验证证据没有证明成功标准”等作者自审容易遗漏的问题。

## 两次检查

Design Ready 前检查最终 `design.md` 是否自包含、受仓库事实支持且足以产生唯一的实质实现解释。Act 完成后检查真实 diff 是否覆盖全部成功标准和生产路径。两次检查都由一个只读 reviewer 负责整体；只有它指出一个无法可靠判断的具体问题时，才追加只检查该问题的 subagent。

Reviewer 读取原始成品和证据，不接收作者的完成结论，也不替用户决定或直接修复。覆盖范围由 Design 与实际变更决定，调查深度随失败后果、可逆性和边界稳定性变化，因此既不会跳过受影响边界，也不会为无关领域制造 finding。

详细的 Design Review 判定以 [Design Review 规则](../.agents/skills/design/references/design-review-contract.md) 为准；实现 Review 的覆盖、严重度、一般化与输出要求以 [Implementation Review 规则](../.agents/skills/review/references/review-contract.md) 为准。本文不重复运行时门禁。
