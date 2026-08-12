# 独立 Review

## 目的

设计者和实现者都会沿用自己的假设。独立 reviewer 从最终成品、真实工作区和生产调用链重新建立判断，重点发现“声明存在但没有接入”“只适配当前样例”“验证证据没有证明成功标准”等作者自审容易遗漏的问题。

## 两次检查

Design Review 检查事实前提、用户所选范围以及最终 `design.md` 是否自包含；Implementation Review 检查真实 diff 是否完整落实成功标准和生产路径。两者都读取原始成品和证据，不接受作者结论，也不替用户决定或直接修复。

覆盖由 Design 与实际变更决定，深度随后果、可逆性和边界稳定性变化。高风险技术主张可以先获得独立专项证据，但整份 Design 或实现始终由一个 reviewer 保留整体判断。

运行时顺序和判定分别以 [Design Review 规则](../.agents/skills/design/references/design-review-contract.md) 与 [Implementation Review 规则](../.agents/skills/review/references/review-contract.md) 为准。
