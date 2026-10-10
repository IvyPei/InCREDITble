> Historical research from October 2, 2026. Some notes explore the earlier wealth-management concept. The root README and demo materials describe the current corporate-bond trading prototype.

# InCreditble：竞品与创始人问答

更新：2026-10-02。研究基于当前 v0.2 原型和官方公开资料；未开户、未交易，不据营销资料推断真实业绩或客户满意度。

## 当前结论

“金额 + 风险选择 + 自动债券组合 + 收入进入现金账户”已有多个产品覆盖。最直接的比较是 Wealthfront 的债券 ETF + dividend sweeping + Cash Account，以及 Webull 的托管个券组合。InCreditble 需要证明某个具体客群为什么愿意转入资金，而不只是喜欢界面。

| 产品 | 可核实的核心重合 | 对 InCreditble 的意义 |
| --- | --- | --- |
| Wealthfront | 债券 ETF 组合的分红可自动转入现金账户；现金账户可配借记卡。[官方更新](https://www.wealthfront.com/blog/what-we-shipped-h2-2025/) | “把投资收入变成可花的钱”本身不是空白市场。 |
| Webull Managed Bond Portfolios | 个券自动选择与管理；国债$500起、公司债$2,000起；公司债策略0.30%年费，最低$1/月，另可能有交易价差。[FAQ](https://www.webull.com/help/faq/11139) | 不必自己挑债已经被产品化；税务效率是其明确未纳入的管理因素，但机会仍需客户验证。 |
| Public Bond Account | $1,000进入十只碎额公司债组合，披露一年二十笔不均匀票息。[产品](https://public.com/bond-account) | 低门槛、少操作、收入可视化均有竞品；不能把票息笔数当固定工资。 |
| Betterment Target Income | 以债券ETF为主，四档收益/风险策略。[2026年6月披露](https://www.betterment.com/legal/income-portfolio-strategy) | 风险与收入选择已经存在；滑杆不是独有投资能力。 |
| Fidelity | 债券阶梯现金流图、符合条件的收益定期转出、现金账户与借记卡。[阶梯](https://www.fidelity.com/fixed-income-bonds/fixed-income-tools-services/bond-ladder-tool)、[收益转出](https://www.fidelity.com/bin-public/060_www_fidelity_com/documents/earnings-automatic-withdrawal-plan-nonret.pdf)、[现金账户](https://www.fidelity.com/investing/cash-management) | 功能难找可能是体验问题；尚不能证明客户愿意换托管机构。 |
| Vestiva / Xendia | 多档风险的个券组合；最低金额与直接开户可用性有页面冲突。[产品](https://vestiva.us/single-bonds) | 设计相近，但不应声称已验证其自助开户路径。 |
| Worthy | 面向零售的低门槛自有房地产债产品。[官网](https://www.worthybonds.com/) | 抢的是简单收入心智，底层不是分散国债/公司债组合。 |
| Moment | 为Webull等提供债券基础设施。[平台文档](https://docs.moment.com/docs/multi-custodial-ria-platforms) | 可能是供应商；也让现有渠道更容易复制自动组合功能。 |

## 详细证据

- [直接债券竞品与创业公司](2026-10-02-direct-bond-competitors.md)：产品结构、门槛、费率新旧冲突、直接/相邻竞争边界。
- [托管收入与现金账户替代品](2026-10-02-managed-income-competitors.md)：Wealthfront、Betterment、Fidelity和SGOV基线。
- [原型压力测试与决策树](2026-10-02-prototype-stress-test.md)：访谈证据、收益优化边界、现金安排、账户经济性、下一轮决策依赖。

## 第一轮待创始人回答

Q1. 第一批只能服务一种客户：A，$10k-$30k想获得零花钱的人；B，$100k-$300k非应急储蓄、希望补贴固定月支出且不想自行管债的人；C，依赖投资支付主要生活费的退休/半退休人群。也可提出更具体人群，但必须说明金额、用途、当前替代方案。建议先验证B，而不是把B当已验证市场。

Q2. 如果测试发现国债或ETF加定期转账，比主动公司债组合更符合客户目标，你是否愿意以客户现金流目标为核心，将主动公司债和自有卡留为可选实现？或你坚持公司的核心必须是个券/公司债管理？建议前者；后者意味着需要另行选择愿为管理能力付费的人群。

Q1决定客户/价值/经济性分支；Q2决定产品边界/投资载体/合作方式分支。未获回答前，不擅自修改原型、定价、客群或商业计划。

## 创始人反馈后的补充

客户尚未确定；创始人愿意探索基础设施，原始重点是债券优化与小型客户的公司债买卖机会。尚未决定转为B2B。新增[基础设施竞争边界](2026-10-02-bond-infrastructure.md)，核查Moment与bondIT已提供的优化及执行能力。下一轮收敛小型客户的含义、可触达对象和有经验支撑的具体优化问题。
