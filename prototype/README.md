# InCREDITble — throwaway product prototype

Question: Can someone design a weekly/monthly cash-flow plan, understand its funding and risks, and personalize the underlying bond portfolio without having to pick every security?

Run from the project root:

```sh
npm run prototype
```

Open http://127.0.0.1:4173. No dependencies or build step. Open `index.html` directly as an alternative.

Three structural layouts share the same state and interactions:

- `?variant=A`: Payday dashboard; controls beside the outcome.
- `?variant=B`: Guided plan; goal inputs, portfolio, then outcome in a vertical sequence.
- `?variant=C`: Cash-flow workbench; payment timeline first, with the portfolio and payday beside each other.

The floating switcher and left/right keys cycle layouts. Inputs preserve native arrow-key behavior. State is memory-only and resets on reload. The state inspector exposes all inputs and the computed summary.

## Cash and portfolio accounts

- `?view=cash`: Sample cash balance, debit card, posted transactions, card freeze/unfreeze, and a simulated $6.50 purchase. The purchase only reduces available cash and adds an activity row. Frozen cards and insufficient balances are declined; there is no bond sale, borrowing, or real payment.
- `?view=bonds`: A fixed illustrative account snapshot showing five holdings, coupons, maturities, and the portfolio's payout reserve. Proposed-plan changes do not mutate posted holdings.
- `?view=plan`: The original payday planner and its three layout variants.

The posted account snapshot is deliberately separate from the unapproved plan. It starts with $951.40 in cash (a $750 opening balance, a $250 prior payday, and $48.60 of card spending), plus $99,150 in bonds and a $750 portfolio reserve. Cash-account transactions use integer cents. The debit card is a visual simulation, with no issuer, payment network, bank connection, or live financial account. No deposit-insurance claims are made. Balances reset on reload.

## Agreed concept

- US individuals seeking spendable, scheduled cash flow.
- Treasuries and corporate bonds behind a goal-led customer experience.
- Weekly/monthly planned transfers smoothed with an upfront cash reserve.
- Preserve principal or choose planned drawdown via an ending-capital target.
- Payouts or reinvestment; issuer exclusions/preferences are optional.
- Alternative plans retain the user's goals and constraints.
- Show net-interest estimates, principal maturity dates, remaining capital, risks, and infeasible targets.

## Demo boundaries

All rates, corporate issuers, and allocations are synthetic. This is not an investment recommendation, optimizer, quote source, risk model, broker, or tax calculator. No real CUSIPs or orders. Nothing persists and no account is connected. Fonts are optional Google Fonts with local fallbacks.

The five-year model uses at-par positions with fixed sample coupons and semiannual receipt offsets. It first allocates a cash reserve, reducing invested capital. Reserve sizing covers either roughly three months of payouts or projected principal consumption. Requested transfers happen before each monthly period's coupon receipts; the ledger flags any unfunded payments rather than silently borrowing or selling bonds. Cash earns zero. An initial 0.10% cost is assumed; no ongoing fees or subsequent trade costs are modeled.

Federal and state/local tax inputs create simplified tax provisions; Treasury interest uses federal tax only. Provision is not actual withholding. At-par maturities have no modeled gain/loss. Tax-lot, discount, premium, NIIT, and deduction effects are excluded. Future maturity proceeds are assumed reinvested at unchanged sample rates, with the same notional coupon schedule. Thus this is not a precise security-level cash-flow forecast. In payout mode net surplus accumulates as cash. In reinvest mode coupons compound annually. Ending values exclude mark-to-market changes and default losses. Principal returned is not labeled income.

The maturity table shows original modeled positions and their repeated maturity rolls within the horizon. New positions bought using reinvested coupons are not itemized in that table. Five-year summaries incorporate their modeled interest.

## Review prompts

1. Can a user distinguish income earned, principal spent, and transfers to cash?
2. Can they explain a funding gap and choose how to adjust it?
3. Does the cash reserve explanation make a weekly payday credible?
4. Do issuer preferences help, or distract from the cash-flow goal?
5. Which of the three layouts makes the trade-offs clearest?

Production service model, discretion over trades, pricing, taxes, execution/custody partners, risk constraints, investment minimums, and live data remain unresolved. This prototype intentionally cannot activate a plan.

Reference facts checked during discovery:
- https://www.treasurydirect.gov/marketable-securities/
- https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/what-are
- https://www.irs.gov/publications/p550

After choosing a direction, preserve the prototype on a throwaway branch and record the design verdict before implementing a production version.

## v0.2: WINK identity and Portfolio explorer

The new amount/risk explorer lives at `?view=bonds`. Enter $10,000-$5,000,000, adjust risk, and select monthly (12), biweekly (26), weekly (52), or quarterly (4) annualized interest equivalents. Actual years may contain 27 or 53 scheduled dates. These calculations do not create transfers.

Six synthetic assets and 5% allocation increments illustrate optimization. The search maximizes estimated after-tax coupon income subject to arbitrary risk and duration limits, a 25% per-corporate-issuer cap, a slider-dependent speculative cap up to 50%, and exclusions. The 2%-10% gross range is designed for interaction testing. All assets are assumed at par with no default. Treasury interest gets no state-tax provision in this simplified model.

The initial 0.10% cost and a three-month estimated net-interest reserve are funded from the entered capital. Reserve cash earns zero. No ongoing fees, transaction costs, credit-spread model, calls, minimum lots or suitability assessment are implemented. Fractional dollar positions are not executable bond orders. A duration-only +2 percentage-point rate shock is shown separately from credit/default risk.

The explorer, original My payday planner and current holdings are independent demonstrations. Updating a proposal cannot execute a trade or change the posted holdings. Clearing every eligible asset produces an empty state rather than a stale proposal. Invalid inputs retain the last valid estimate and show an error.
