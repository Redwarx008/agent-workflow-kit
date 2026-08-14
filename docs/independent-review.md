# 独立 Review

## 目的

设计者和实现者都会沿用自己的假设。独立 reviewer 从最终成品、真实工作区和生产调用链重新建立判断，重点发现“声明存在但没有接入”“只适配当前样例”“验证证据没有证明成功标准”等作者自审容易遗漏的问题。

## 两次检查

Design Review 把当前代码作为现状、接入点和可行性证据，检查事实前提、用户所选范围、选择来源以及最终 `design.md` 是否自包含；目标尚未实施是预期状态，不构成 finding。Implementation Review 才检查真实 diff 是否完整落实成功标准和生产路径。两者都读取原始成品和证据，不接受作者结论，也不替用户决定或直接修复。

覆盖由本轮选定语义与实际变更共同决定，深度随后果、可逆性和边界稳定性变化。两个以上独立高影响主张先并行核验，再由一个 reviewer 整合并保留整体判断；未被本轮改变、依赖或明确要求改变的既有行为不构成 finding。

运行时顺序和判定分别以 [Design Review 规则](../.agents/skills/design/references/design-review-contract.md) 与 [Implementation Review 规则](../.agents/skills/review/references/review-contract.md) 为准。
