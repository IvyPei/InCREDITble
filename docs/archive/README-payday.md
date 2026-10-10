# InCreditble

> **October 9 update:** The default interface is now the English corporate-bond trading prototype. See the [current prototype guide](prototype/TRADING_PROTOTYPE.md). The payday concept described below is retained as historical context and is available locally at `prototype/legacy-payday.html`.

**Your portfolio. Your payday.**

A cash-flow-led investing concept: customers explore weekly, biweekly, monthly or quarterly cash-flow equivalents, explore a Treasury/corporate-bond portfolio, and see how scheduled transfers could support everyday debit-card spending.

**Version 0.2 · October 2, 2026 · Interactive prototype with synthetic data**

## Read the product and business plan

- [Product executive summary](EXECUTIVE_SUMMARY.md): the customer, product, founder advantage, current capabilities, and next milestone.
- [Current-version business plan](BUSINESS_PLAN.md): discovery evidence, customer journey, operating and revenue hypotheses, competitive references, validation work, and unresolved decisions.
- [Prototype guide](prototype/README.md): interface variants, model assumptions, and demo boundaries.

## Run locally

Requires Python 3. From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory prototype
```

If Node.js/npm is installed, `npm run prototype` runs the same command. No npm installation or build is required.

Open [the prototype](http://127.0.0.1:4173/).

| View | Local URL | What to explore |
| --- | --- | --- |
| My payday | [Planner](http://127.0.0.1:4173/?view=plan) | Payment goals, alternative portfolios, taxes, funding gaps, and projections |
| Cash account | [Cash](http://127.0.0.1:4173/?view=cash) | Spendable balance, activity, debit-card mockup, and a simulated purchase |
| Portfolio account | [Portfolio](http://127.0.0.1:4173/?view=bonds) | Amount + risk explorer, four income frequencies, proposed allocations, and existing sample holdings |

The planner's bottom arrows switch between three structural layouts: A, payday dashboard; B, guided plan; C, cash-flow workbench. Query parameters can be combined, such as `?view=plan&variant=B`.

## What this version is

This is a product-discovery artifact, not a launched financial service. The calculations are simplified illustrations. No market data, real financial account, card issuer, trade, or payment system is connected. State resets on reload.

The proposed product keeps three quantities distinct: invested bonds, a portfolio payout reserve, and available cash for spending. Interest income and principal repayments are also separated. Scheduled cash transfers are not guarantees.

Local agent skills, credentials, and machine-specific files are excluded from version control. No production license or open-source license is asserted by this repository.

## Selected identity and new Portfolio explorer

[WINK brand kit](brand/wink/README.md) · [Asset gallery](brand/wink/index.html) · [Brand guidelines](brand/wink/BRAND_GUIDE.md) · [Marketing copy](brand/wink/MARKETING_COPY.md)

The Portfolio page now accepts an investment amount (starting at $10,000), a risk preference, four cash-flow display frequencies, taxes and issuer exclusions. A grid search selects from synthetic at-par assets under toy risk, duration and concentration constraints. The 2%-10% gross coupon range is illustrative, not live market data or expected total return. Amounts shown per period are annualized after-tax interest equivalents, not a funded payment schedule. The explorer is independent of the original payday planner and posted sample holdings.
