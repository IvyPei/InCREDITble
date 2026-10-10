> **Historical concept:** This document describes the earlier payday and wealth-management exploration. For the current corporate-bond trading demo, use [README](README.md) and the [demo package](demo/PITCH.md).

# InCREDITble — Current-Version Business Plan

**Your portfolio. Your payday.**

**Version:** 0.1

**As of:** October 2, 2026

**Status:** Founder concept and working interface prototype; discovery-stage plan

**Scope:** Proposed U.S. consumer product combining bond portfolio planning, scheduled cash transfers, and debit-card spending

This document records the agreed product direction and the current implementation. Recommendations and commercial assumptions are identified as proposals. It is not a claim that financial accounts, investment management, or payment services are already available.

## 1. Executive summary

InCREDITble aims to turn a bond portfolio into an understandable source of planned spending cash. Customers specify future cash-flow needs and a capital-preservation or drawdown target. A portfolio service would propose and maintain a suitable mix of U.S. Treasuries and corporate bonds, explain its expected cash flows and risks, and arrange planned weekly or monthly transfers into a separate cash account.

The proposed product has three connected experiences:

- **My payday:** set cash-flow goals and understand the portfolio proposal.
- **Portfolio account:** inspect bond holdings, coupons, principal repayment dates, and the reserve used to smooth payouts.
- **Cash account:** receive transfers and use available cash through a linked debit card.

The founder's institutional corporate-bond background informs portfolio construction and relative-value analysis. The commercial hypothesis is that this expertise can be packaged into a simpler service for individuals who want usable cash flow without selecting each bond themselves.

The current version is a local, interactive prototype with synthetic data. It demonstrates the customer experience and exposes unresolved questions; it does not provide a production investment engine or financial infrastructure.

## 2. Customer and problem

### Initial customer hypothesis

The intended initial customer is a U.S. individual with investable savings who wants a planned stream of cash for regular spending and is uncomfortable with substantial equity-market exposure. This does not establish that bonds are risk-free or appropriate for every such customer.

The strongest initial use case is recurring spending, with weekly or monthly payments and an explicit remaining-capital goal. One-off expenses and more complex liability schedules are potential extensions. They are not implemented in version 0.1.

The target investment range, life stage, state of residence, account type, liquidity needs, financial sophistication, and income-versus-principal preferences are not yet validated. The prototype's $100,000 default and $10,000 input floor are demonstration parameters, not a confirmed segment or investment minimum.

### Discovery evidence

The founder reports three informal interviews. Reported pain points were difficulty tracking CUSIPs, assessing fair bond prices, and finding the bond-purchase experience within an existing brokerage. At least one interviewee had bought an individual bond. The precise breakdown of comments across interviewees and the buyer's decision process were not recorded in this conversation.

These findings support further investigation, but not a product-market-fit conclusion. They do not yet prove customers want a new provider, prefer active bond management, value weekly payouts, or will pay for the service.

There is also an important distinction between navigation and availability: Fidelity provides individual-bond trading, while Robinhood's official U.S. help currently lists bonds and fixed-income trading as unsupported. Difficulty finding a bond purchase on these platforms may represent different problems. [1][2]

### Behavioral hypothesis

The founder believes some customers are reluctant to sell or withdraw from long-term investments, while scheduled cash deposits feel more usable for everyday spending. The product would test whether an explicit payday reduces that friction. This is a hypothesis, not an established behavioral finding or a reason to assume equity investments cannot support withdrawals.

## 3. Value proposition and positioning

**Customer promise:** "Plan the cash you need. Understand the bond portfolio that could fund it."

The intended benefits are:

- Start with spending goals instead of security selection.
- See future cash transfers, repayment dates, and projected capital together.
- Understand the difference between interest income and spending down principal.
- Receive money into an account designed for everyday use.
- Personalize the portfolio without having to construct it bond by bond.
- Make trade-offs visible when desired payments cannot be funded within agreed constraints.

The differentiation to validate is the combination of cash-flow planning, transparent portfolio management, optional investor preferences, and a spending account. Access to bonds or a clean interface alone is insufficient differentiation: established brokerages and newer platforms already provide bond access. [1][3][4]

The service should allow a Treasury-only allocation when it is the better fit. Corporate bonds are included when their modeled benefit compensates for additional credit, liquidity, tax, and execution considerations within the customer's constraints. A higher headline yield alone is not enough.

## 4. Product design

### A. Design a payday

Customers provide available capital, requested payment amount, frequency, start date, and desired ending capital. The first prototype uses a five-year horizon and a single recurring payment amount. It supports preservation of original capital or an explicitly selected drawdown target. Reinvestment pauses payouts in the current demo.

A future production experience would also need appropriate information about risk tolerance, liquidity needs, account type, and relevant tax circumstances. Its advice and approval model has not been finalized.

### B. Review and personalize a proposal

The proposed plan shows projected after-tax interest, cash transferred, reserve allocation, ending capital, principal maturity dates, and risks. If the requested schedule is not feasible, the product should explain the gap and let the customer change their capital contribution, payments, timing, or remaining-capital target.

"Show another plan" explores alternatives against the same goals. Optional issuer preferences and exclusions let customers express views without making security selection mandatory. Preferences should remain subordinate to agreed concentration and risk constraints; an infeasible preference should be explained rather than hidden.

The current prototype cycles among three preset allocation templates. It does not discover or optimize a portfolio from a market universe.

### C. Portfolio account

The Portfolio account holds or displays invested assets and the reserve dedicated to the payout plan. Its customer view includes holdings, coupon rates, maturities, and principal repayment timing.

Held positions must remain separate from proposed trades. Exploring another plan cannot imply execution. A production workflow must explicitly define which changes require approval and which, if any, are delegated under an agreed mandate.

The founder's relative-value approach may inform ongoing swaps. Each proposed swap would need an expected net benefit after spreads, fees, tax effects, and cash-flow consequences, while respecting credit, duration, liquidity, and concentration limits. Keeping the existing portfolio must remain a valid outcome. These capabilities are not implemented in version 0.1.

### D. Cash account and debit card

Planned distributions move into a separate Cash account. The customer sees an available-to-spend balance, incoming paydays, card purchases, and card controls. Debit-card spending reduces available cash; it does not automatically sell bonds or borrow against them in the agreed prototype model.

The cash account and card would require an operating arrangement with appropriate financial partners. No provider, account structure, insurance status, or card network has been selected. The prototype's card, transactions, and balances are illustrative.

### E. Cash timing and reserves

The underlying bonds do not necessarily pay at the customer's desired frequency. Treasury notes and bonds pay semiannually, and most corporate bonds also pay semiannually. A weekly or monthly customer payday therefore needs a distinct cash-management and transfer schedule. [5][6]

An upfront cash reserve is the selected prototype mechanism. It reduces capital invested in bonds and helps bridge uneven receipts. Depending on the customer's goals, it may also prefund planned principal consumption. Holding that reserve has an economic cost that must be visible in portfolio economics.

Weekly or monthly payouts are planned, not guaranteed. Defaults, calls, changes in reinvestment rates, taxes, transfer timing, or insufficient cash can affect the plan. Future production rules must define what happens before a reserve is exhausted, including customer notifications and plan adjustments.

### F. Income, principal, and taxes

The experience must separately show interest earned, principal returned, principal consumed, the portfolio reserve, and available spending cash. A transfer containing returned capital should not be presented entirely as passive income.

After-tax projections must use explicit assumptions. Estimated tax provision is not the same as actual withholding or a customer's final liability. Discount, premium, tax basis, sales, and other circumstances can change the tax treatment. The current at-par illustration deliberately omits those complexities. [7]

## 5. Current prototype: implemented versus proposed

| Capability | Version 0.1 status |
| --- | --- |
| Capital, weekly/monthly payout, start date, ending-capital target | Interactive inputs |
| Cash payouts or reinvestment | Interactive; reinvest mode pauses payouts |
| Cash reserve and funding-gap messages | Simplified deterministic illustration |
| Treasury/corporate alternatives | Three preset synthetic plans |
| Treasury-only comparison | Available under the same cash-flow goals |
| Issuer preferences and exclusions | Interactive; excluded weight moves to Treasuries |
| Cash-flow chart and dated payout ledger | Available with sample projections |
| Principal maturity and remaining-capital views | Available under simplified assumptions |
| Risk explanations | Credit, rate, liquidity, reserve, and reinvestment limitations described |
| Portfolio account | Fixed sample holdings and reserve, separate from proposals |
| Cash account and debit card | Illustrative balance, activity, card freeze, simulated purchase |
| Interface alternatives | Payday dashboard, guided plan, cash-flow workbench |
| Production optimizer and relative-value swaps | Not implemented |
| Live quotes, executable inventory, credit/risk analytics | Not connected |
| Real accounts, custody, transfers, and card payments | Not connected |
| Authentication, persistent storage, tax-lot accounting | Not implemented |
| One-off future expenses, variable schedules, selectable horizon | Not implemented |

The interface uses HTML, CSS, and JavaScript served by a local Python HTTP server, with no application dependencies or build step. State is held in memory and resets on reload. It has not been deployed as a live service.

Verification so far includes script syntax checks and manual browser checks of core interactions: changing payout amounts, detecting funding gaps, retaining exclusions across alternatives, pausing payouts for reinvestment, switching layouts, processing a simulated cash-only purchase, blocking spending on a frozen card, and preserving posted holdings while exploring plans. This is not production-grade validation of the financial model.

## 6. Competitive context

| Reference | Relevant existing experience | Implication for InCREDITble |
| --- | --- | --- |
| Fidelity and Schwab | Individual Treasury/bond trading and established brokerage infrastructure. [1][3] | Test whether the cash-flow-led experience adds enough value beyond existing access. |
| Public | Corporate bonds, Treasuries, and Treasury portfolio/ladder experiences. [4][8] | Study directly; simplified bond access is already offered. |
| Wealthsimple | Managed investing and an income-oriented Core Bond portfolio implemented through funds/ETFs. [9] | A reference for simplifying portfolio management around customer outcomes. |
| TreasuryDirect | Direct Treasury purchases; selling before maturity requires a bank/broker/dealer after transfer. [10] | Distinguish buying/holding access from ongoing cash management and spending. |

Wealthsimple is a Canadian-market reference, not the assumed U.S. distribution channel. Its self-directed eligibility page lists individual bonds as unsupported. It should not be described as an individual corporate-bond trading equivalent. [11][12]

This is a focused reference scan, not an exhaustive competitor study. Product terms and capabilities should be rechecked before commercial decisions.

## 7. Business model and unit economics

### Revenue options to validate

1. **Transparent portfolio-management fee:** potentially appropriate if the final service manages assets under an agreed mandate.
2. **Subscription:** potentially appropriate if customers principally pay for planning, explanations, monitoring, and service.
3. **Hybrid:** a combination only if customers can clearly understand the total charge and it fits the chosen operating model.
4. **Card-related economics:** a possible secondary source if a future partner arrangement provides a share; no agreement or revenue is assumed.

Pricing is undecided. The prototype's 0.10% initial cost is an illustrative modeling input, not a proposed product fee. Trade volume should not become the product's success measure: unnecessary swaps could undermine customer cash flow and net returns.

### Cost drivers

The business needs to investigate market data and licensing, executable bond inventory and spreads, brokerage/custody arrangements, investment operations, portfolio and tax accounting, cash movement, banking/card partners, identity verification, fraud/disputes, servicing, security, compliance, and customer acquisition. Partner minimums and fixed operating costs are unknown.

A decision-useful model should estimate:

**Annual contribution per funded customer = management/subscription revenue + contracted partner revenue − partner charges − data/servicing/operating costs − attributable risk losses.**

Reserve cash drag and all customer-borne costs must also be reflected in the customer's net outcome, even where they are not expenses on the company's income statement.

No market-size estimate, revenue forecast, AUM target, capital requirement, fundraising amount, or break-even date has yet been substantiated. These should follow segment validation and partner quotations rather than be invented for the plan.

## 8. Operating model and launch dependencies

The recommended discovery path is to investigate financial partners rather than assume the company must build every account, custody, execution, and payment capability itself. This is an operating-model proposal, not a selected arrangement.

Before any live pilot, the team must decide the legal entities and service scope; whether the experience is self-directed, guided, or discretionary; who provides advice and execution; who holds assets and cash; how the card is issued and serviced; and which responsibilities sit with each party. Applicable obligations and customer disclosures require qualified professional review against the actual model. This document does not determine a licensing pathway.

Other launch dependencies include reliable pricing and inventory, realistic transaction-cost estimates, risk constraints, a defensible cash-flow/tax engine, payment reconciliation, handling of missed or called payments, secure account access, incident response, customer support, and clear treatment of projected versus available balances.

## 9. Validation and go-to-market plan

### Proposed first distribution approach

Begin with founder-led discovery among reachable individuals who resemble the intended customer. Use the prototype to observe decisions and comprehension rather than ask whether the idea sounds appealing. Broader acquisition channels and partner distribution should follow evidence of demand and viable economics.

The proposed initial use case is recurring spending from an allocated pool of savings. Expanding to dated education expenses, home purchases, or other liability schedules should depend on interviews and feasibility work.

### Near-term learning work

- Conduct a proposed 10–15 additional interviews spanning existing bond buyers, people who abandoned a purchase, and people currently using other income/cash products. This is a research target, not completed traction.
- Establish what the money is for, when it is needed, how much is investable, how customers respond to losses, and whether principal drawdown is acceptable.
- Observe users setting a payday, finding a funding gap, distinguishing principal from interest, and explaining how the cash reserve and card balance differ.
- Test whether weekly payouts materially improve the experience over monthly payouts.
- Test demand for delegated management versus approving proposed changes; customers need not select individual bonds in either model.
- Investigate willingness to pay and willingness to fund or transfer assets separately from positive comments about the interface.
- Compare the proposed experience with a relevant existing brokerage/product on the same task.
- Obtain execution, market-data, and partner-cost evidence for realistic account sizes.

### Evidence to record

Record task completion, comprehension errors, reasons for rejecting a plan, funding-gap adjustments, preference-control usage, payout-frequency choices, price sensitivity, and concrete next-step commitments. Track whether customers can explain default risk and principal consumption in their own words. No success threshold has yet been agreed; set explicit thresholds before each study so conclusions are not chosen after the results.

For a later live pilot, relevant operating measures would include payment accuracy and timeliness, reserve sufficiency, net customer outcomes, retention of funded assets, support burden, execution quality, and contribution per account. Actual trading or live customer assets should not be used before the operating dependencies are resolved.

## 10. Milestones and decisions

| Stage | Deliverable | Decision it supports |
| --- | --- | --- |
| Current | Version 0.1 prototype and written product/business summary | Is the concept understandable and worth investigating? |
| Discovery | Interview records and observed prototype sessions | Which customer and cash-flow use case should be the first focus? |
| Economic feasibility | Realistic portfolio examples, costs, tax treatment, and partner options | Can the service deliver a worthwhile net outcome at the intended account size? |
| Product specification | Selected experience, risk constraints, approval model, and pricing hypothesis | What should a production MVP contain? |
| Controlled pilot readiness | Resolved operating responsibilities and tested infrastructure | Is the product ready to involve real accounts and money? |

Timelines are not yet committed. Open decisions include target account size, the precise customer segment, risk constraints, trade discretion, pricing, the reserve policy, shortfall handling, supported account/tax types, and the actual brokerage/banking/card arrangements.

## 11. Principal risks and responses

| Risk | Response to investigate |
| --- | --- |
| Customers mainly want safety or convenience, with little demand for corporate credit | Keep Treasuries as a credible option and validate why any corporate allocation helps. |
| Retail costs erase the benefit of active relative-value swaps | Evaluate executable prices, lot sizes, taxes, and total costs; retain a no-trade option. |
| Weekly payouts imply certainty the portfolio cannot provide | Use explicit reserves and shortfall rules; distinguish planned schedules from guarantees. |
| Customers mistake returned principal for income | Separate the measures in projections, account views, and customer testing. |
| Tax estimates create false precision | State assumptions, account for actual instrument/tax-lot treatment in production, and distinguish provisions from withholding. |
| A simple interface hides concentrated or excessive risk | Maintain portfolio constraints and explain material trade-offs in customer language. |
| Everyday-spending features obscure investment risk | Keep invested assets, portfolio reserve, and available cash clearly separated. |
| Users like the demo but will not fund or pay for the service | Test behavior and concrete commitments, not enthusiasm alone. |

## 12. Source notes and provenance

Founder background, interview count, reported pain points, and product preferences come from the founder's working conversation on October 1–2, 2026. No interview transcripts or independent customer-data verification were supplied. Implementation statements reflect the local version 0.1 prototype.

The following primary pages were consulted during product discovery. They support specific reference facts, not a claim that demand or a business advantage has been proven. Capabilities and terms can change.

1. [Fidelity — Trading bonds and fixed income](https://www.fidelity.com/webcontent/ap002390-mlo-content/18.04/help/learn_trading_bonds.shtml)
2. [Robinhood — Investments you can make](https://robinhood.com/us/en/support/articles/investments-you-can-make-on-robinhood/)
3. [Schwab — How to buy Treasuries](https://www.schwab.com/content/how-to-buy-treasuries) and [How to sell a bond](https://www.schwab.com/content/how-to-sell-bond)
4. [Public — Corporate and Treasury bonds](https://public.com/invest/bonds)
5. [TreasuryDirect — Marketable securities](https://www.treasurydirect.gov/marketable-securities/)
6. [SEC Investor.gov — What are corporate bonds?](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/what-are)
7. [IRS — Publication 550](https://www.irs.gov/publications/p550)
8. [Public — How the Treasury account works](https://help.public.com/en/articles/10274258-what-is-a-treasury-account-and-how-does-it-work)
9. [Wealthsimple — Core Bond portfolio](https://help.wealthsimple.com/hc/en-ca/articles/32875790811931-Open-a-Core-Bond-portfolio)
10. [TreasuryDirect — Selling a marketable security](https://www.treasurydirect.gov/marketable-securities/selling-marketable-securities/)
11. [Wealthsimple — Eligible securities](https://help.wealthsimple.com/hc/en-ca/articles/360056580834-Eligibility-criteria-for-stocks-ETFs-and-futures)
12. [Wealthsimple — Account eligibility](https://help.wealthsimple.com/hc/en-ca/articles/4404721755287-Eligibility-requirements-to-open-an-account-with-Wealthsimple)

---

**Related files:** [Product executive summary](EXECUTIVE_SUMMARY.md) · [Project README](README.md) · [Prototype guide and model assumptions](prototype/README.md)

## Prototype update - October 2, 2026

The selected WINK identity now appears across the prototype and brand kit. The Portfolio page adds an amount-first risk explorer: investment amount, a risk-preference slider, four annualized interest display frequencies (weekly, biweekly, monthly, quarterly), tax assumptions, and issuer exclusions. It searches synthetic allocations under illustrative constraints and shows the proposed mix, a prefunded cash reserve, and a simple rate-shock scenario. The 2%-10% gross coupon range is invented for usability testing, not a forecast or live quote. This experiment remains separate from posted sample holdings and the original payday planner; it does not establish suitability, execute bonds, or fund actual payments.
