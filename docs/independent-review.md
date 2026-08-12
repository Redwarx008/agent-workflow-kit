# 独立 Review

## 目的

设计者和实现者都会沿用自己的假设。独立 reviewer 从最终成品、真实工作区和生产调用链重新建立判断，重点发现“声明存在但没有接入”“只适配当前样例”“验证证据没有证明成功标准”等作者自审容易遗漏的问题。

## 两次检查

Design Ready 前先检查问题声明、生产可达性、参考适用性和用户所选范围是否成立，再检查最终 `design.md` 是否自包含且足以产生唯一的实质实现解释。普通 Design 由一个独立只读 reviewer 完成。若 Design 含两个以上可独立核验、且结论会改变格式、稳定合同、平台行为、关键定量判断或跨生产路径语义的高风险技术主张，则先按具体主张并行派最少数量的只读 reviewer；随后另派一个独立 reviewer 读取原始 Design、核验问题和原始报告，检查覆盖、去重、处理冲突、复核整体一致性并给出唯一 verdict。并行 reviewer 不替用户选择设计，也不各自宣布整份 Design 通过。

Act 完成后的实现 Review 仍由一个只读 reviewer 对真实 diff、全部成功标准和生产路径负责；Design 的并行事实核验不自动扩张实施 Review。

Reviewer 读取原始成品和证据，不接收作者的完成结论，也不替用户决定或直接修复。覆盖范围由 Design 与实际变更决定，调查深度随失败后果、可逆性和边界稳定性变化，因此既不会跳过受影响边界，也不会为无关领域制造 finding。

详细的 Design Review 判定以 [Design Review 规则](../.agents/skills/design/references/design-review-contract.md) 为准；实现 Review 的覆盖、严重度、一般化与输出要求以 [Implementation Review 规则](../.agents/skills/review/references/review-contract.md) 为准。本文不重复运行时门禁。
