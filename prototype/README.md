# InCreditble prototype implementation

The current product is an English corporate-bond trading prototype for beginners. It explores one question: can someone choose, understand and approve a small bond purchase from their goals rather than a bond identifier?

## Run

From the repository root, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory prototype
```

Open http://127.0.0.1:4173/. No dependencies or build. The welcome always precedes Overview on a full load. Demo setup begins when the user enters Find bonds. Use the server rather than opening the HTML file directly so browser storage has a consistent origin.

## Module map

| File | Responsibility |
| --- | --- |
| `index.html`, `trading.css` | Page shell, welcome, accessible controls and responsive layout |
| `trading.js` | Fictional bond/account fixtures, filters, state and trade workflow |
| `bond-matching.js` | Deterministic shortlist and relative comparisons |
| `company-profiles.js` | Fictional issuer descriptions and business risks |
| `bond-guide.js` | Contextual sample explanations; no LLM or network calls |
| `bond-quotes.js` | Invented quotes, fractional settlement and payment preview |
| `portfolio-history.js` | Account/asset-filterable sample portfolio history |
| `portfolio-income.js` | Sample income schedule and profit/loss accounting |
| `demo-session.js` | Versioned, validated local demo persistence |

## State and calculations

- Yield, industry, maturity horizon and credit-risk preference filter eligible bonds first. Ranking never relaxes those limits to manufacture three matches.
- The shortlist has up to three different issuers. Ranking considers credit quality, yield fit, earlier repayment, known local holdings, industry variety and near-duplicate alternatives. External funds have no issuer look-through data and are not scored for concentration.
- Buys specify a cash budget; sells specify face value. Buy face value rounds down, settlement rounds to cents, and cash cannot become negative. Weighted-average basis supports partial-sale profit/loss.
- The valuation reference is $100 per $100 face. Buy/sell spreads affect displayed total value and P/L. Reference yield is not recalculated as executable yield at the simulated quote. Fees/accrual are zero; no tax lots, defaults or market liquidity are modeled.
- The financial snapshot is fixed at October 9, 2026. Local coupons fall on April 9 and October 9, with the next modeled payment on April 9, 2027. These are fixtures, not today's market schedule.
- Confirmed trades, profile choices, finder drafts and sample connections persist locally. Quotes and unconfirmed orders do not. Storage failure is reported in Settings.

## Demonstrating and resetting

Use [the live demo guide](../demo/LIVE_DEMO.md). **Your account → Settings → Reset demo progress** restores the original sample accounts and balances after confirmation. No real personal information is needed.

Variant A is the presentation default. `?variant=B` and `?variant=C` expose alternative finder layouts; `?review=1` exposes reviewer controls. Those controls are not part of the pitch.

## Verification and limits

The October 10 checks included 23 persistence/payment/comparison cases and 1,140 matching-filter invariant cases. Browser checks covered buy/sell accounting, partial/full-sale payment previews, refresh restoration, reset, and 390px layout containment. These are prototype checks, not production certification.

All financial data, integrations and orders are simulated. No live AI model or external service is connected. Full iteration notes remain in `TRADING_PROTOTYPE.md` in the working repository; earlier entries describe superseded designs.
