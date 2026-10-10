# Corporate bond trading prototype

October 9, 2026 · English · Throwaway prototype

## Design question

Can a person unfamiliar with bonds choose a fractional corporate-bond position by income target, industry and repayment timeframe, understand its risks, and approve a trade without searching for a CUSIP?

The default prototype now explores corporate-bond trading. The earlier wealth-management/payday concept is preserved locally at `legacy-payday.html`; its existing supporting files remain in place.

## Run and review

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory prototype
```

`npm run prototype` is an equivalent shortcut. No dependencies or build are required.

- Overview: http://127.0.0.1:4173/
- Default finder: http://127.0.0.1:4173/?view=discover
- A, focused finder: http://127.0.0.1:4173/?view=discover&variant=A&review=1
- B, horizontal preferences and a three-column bond grid: http://127.0.0.1:4173/?view=discover&variant=B&review=1
- C, compact comparison table: http://127.0.0.1:4173/?view=discover&variant=C&review=1

The reviewer-only bar cycles layouts with buttons or arrow keys. It preserves the applied filters, profile, balances and orders. It does not intercept form-field arrow keys. The expandable state inspector exposes the in-memory state. Reloading intentionally restores the sample data.

## Product decisions represented

1. Only two main destinations: Overview and Find bonds.
2. Aggregate sample accounts, holdings and recent activity on Overview. External balances are read-only and never fund local trades. Total profit/loss combines current unrealized price changes, a sample realized-gain history, and historical interest/dividend receipts. Future estimates are excluded, and received amounts are already reflected in cash; nothing is credited twice. The default total is +$2,339.50 ($1,300 unrealized + $180 realized + $859.50 received). The payment chart covers Oct 2026–Sep 2027 with $1,086.00 in expected income for the starting holdings. Each month can be selected to inspect dates, accounts, and Received versus Expected status. Fund distributions are grouped with dividends, not direct-bond interest. Principal repayments are excluded. Local positions pay semiannually after the fixed Oct 9, 2026 snapshot and no later than maturity. Sells change future coupons but do not erase past income. External accounts are removed from both metrics when disconnected. Chart labels are rounded, while month details show cents.
3. Set a dollar amount, minimum annual yield with a 0–8% slider (0 means no minimum), industry and timeframe; the slider previews yield and an illustrative annual default-rate range across all matching demo bonds. This preview responds to the draft industry and term filters; Show my matches applies them to the cards. No matches means no default-rate estimate. Show up to three ranked matches within a separate credit-risk preference. The pool contains 672 fictional bonds across 18 industries, with 32–44 bonds per industry. Each industry has at least three issuers, two full maturity ladders from 6 months to 35 years, and an additional short/intermediate ladder through 5 years. Coverage includes agriculture, automotive, business services, consumer goods, energy, financials, food & beverages, healthcare, hospitality & leisure, industrials, materials, media & entertainment, real estate, retail, technology, telecommunications, transportation and utilities. The industry menu is alphabetical. Illustrative yields span 4.0–7.8%. The initial 5-year holding period, 4.5% target and balanced risk preference produce 319 eligible bonds, from which only three are displayed. Selecting an individual industry at the default 5-year horizon produces at least 9 eligible bonds after yield auto-adjustment, before selecting the top three. Holding period is a 0–30+ slider: 0 means under one year, 1–30 caps time until repayment, and 30+ permits all maturities. Changing the period or industry automatically resets the yield target to the lowest yield among eligible bonds with the longest maturity inside that period, rounded down to the 0.1% slider increment. This is a demo starting point, not an optimized recommendation or a claim about the market yield curve. Users can override yield manually; no-match cases retain their target and explain why. Annual default rates remain annual, not cumulative holding-period risk. Six-month examples show six-month interest and an April 2027 repayment date.
4. First entry to Find bonds opens demo onboarding before any matches are shown, including direct links. Closing it leaves a setup screen with a restart button. Completed profiles enter the finder directly for the rest of the session. Demo onboarding separates identity verification from investing familiarity. Three explanation depths range from simple dollar examples to ratings, coupon and yield metrics. Familiarity never increases risk tolerance automatically.
5. Buy from $10 in cent increments. Review and explicitly confirm every simulated order. Partial or full sales update the same portfolio and activity ledger.
6. Keep technical bond identifiers out of discovery. Expandable detail is available when needed.

## Model and boundaries

All issuers, bonds, ratings, yields, holdings, accounts and transactions are synthetic. Default rates are invented annual issuer-default probabilities assigned to the fictional bonds, not calibrated market estimates or a yield-to-default conversion. Provider names illustrate possible connections and imply no partnership. No identity documents, credentials or real accounts are collected. No external service is contacted.

Matching uses deterministic rules, not a live AI model. The sample profile is not a full suitability assessment. Every bond is modeled at par, non-callable, with zero accrued interest and zero fees. Yield equals coupon only under these assumptions. Cash and face-value positions use integer cents; buying or selling at the fixed sample price conserves the combined total.

The prototype does not establish that real fractional execution, market liquidity, account aggregation, identity verification or brokerage operations are available. These need separate production design and integration work.

Bank CD benchmark: a hypothetical APY curve (6 months to 5 years) follows the selected holding horizon. The under-one-year setting uses a 6-month CD. Longer horizons retain a clearly labeled 5-year shorter-term reference and suppress the rate-difference comparison; rates are never extrapolated. Differences compare the user’s minimum yield target with CD APY, not an individual bond or guaranteed excess return. Zero target prompts the user to set a target. The comparison explanation distinguishes APY compounding, bond yield assumptions, maturity differences and early-exit terms. These are illustrative fixtures, not bank offers or market averages.

## Validation and verdict

Manual browser checks covered:

- $123.45 purchase and full sale; exact cash/position updates and both activity entries.
- Insufficient local cash blocks a buy, regardless of external account value.
- Trade review requires the risk acknowledgment before confirmation.
- Demo identity and familiarity setup resumes the intended order.
- Beginner, intermediate and experienced explanation depths; experienced mode retains the same risk ceiling.
- Yield targets with no matches; combined industry and maturity filters.
- Expanded pool: unique bond IDs, 18-industry coverage, 32–44 bonds per industry, full cautious maturity coverage, and at least 9 matches per industry with the default balanced 5-year filter after yield adjustment.
- Sample connection, repeat refresh without duplicates, and disconnect with aggregate recalculation.
- Holding-period endpoints (under one year and 30+), automatic yield adjustment at 10 years, maturity filtering, and six-month interest examples.
- Profit accounting, future coupon amounts, maturity cutoff, connection filtering, month selection, empty months, and received/expected separation.
- Three layout variants, desktop and phone rendering, and no horizontal overflow at 390 px for the default finder.
- CD benchmark at 6 months, 3 years and 30+ years; higher/lower target differences, no-minimum target, filter submission, and no overflow at the default 652 px viewport.
- JavaScript syntax and browser console checks.

Implementation verdict: the proposed flow is interactive and internally consistent under the sample assumptions. **Usability and differentiation are not validated yet.** A is the provisional default; no user has selected a winning variant. Next validation is to observe a novice choosing, explaining and placing a small simulated order without coaching.

Captured on `codex/corporate-bond-trading-prototype`; no implementation issue was supplied. This document is the context pointer. Do not treat this prototype as production brokerage software.

## Portfolio value chart

The overview replaces the allocation bar with a six-point portfolio-value line chart (May 9–October 9, 2026), while retaining the allocation percentages, current total and all-time P&L. Historical values are explicit synthetic account-balance fixtures, including cash; only currently connected accounts contribute. The final point uses the current aggregate balance, so it agrees with the headline after sample connections and simulated at-par trades. Clicking or keyboard-selecting a point shows its exact date and value. The graph is labeled sample history; balance changes may include cash flows and are not presented as investment returns.

Chart filters let users view all accounts or a single connected account, combined with All assets, Bonds, Equities or Cash. Historical asset fixtures sum exactly to their account balance at each date; the final point uses current holdings and cash. Chart-only scope is explicit, with the aggregate headline/P&L/allocation unchanged. Selecting an asset absent from an account shows an empty state. Filters persist in memory across navigation; disconnecting the selected account resets the chart to all remaining accounts. Verified all 8 account-connection combinations and asset reconciliation at each date; browser checks covered Fidelity equities ($21,000), local cash ($2,500) and local equities (empty).

## Mentor feedback: step 1 — why a second platform?

The overview now states that existing investments stay where they are, with InCreditble as a place to find the next corporate bond. Find bonds explains the two roles: existing accounts retain stocks/funds/other investments; InCreditble supports yield/industry discovery, understandable bond details and explicitly simulated fractional trades. A working sample-connections entry is available both before and after onboarding. Connection and onboarding copy consistently explains read-only visibility and that aggregation does not move assets or fund local trading. This step makes no claim that current deterministic recommendations already use external holdings; that is a separate planned improvement.

## Mentor feedback: step 2 — recommendation explanations and optional AI help

Bond cards and details now show “Why it matches” (yield, maturity horizon, sector) and “The trade-off.” Trade-offs compare available demo bonds in the same industry and maturity across credit-risk tiers when possible; they do not invent a superior alternative or claim stable returns. The full bond pool and existing trading controls remain available.

An “Ask AI” entry on each card and detail opens a contextual assistant with six suggested questions and a text input. It explains matching, company-data limits, coupon amounts/dates, credit and early-sale risk, CD comparison at the specific bond maturity, pricing assumptions and projected portfolio allocation from the selected amount. Portfolio impact spends local cash at par; unavailable external fund industry/issuer breakdowns are stated explicitly. Answers adapt basic/experienced interest and risk wording. Unsupported questions get an honest fallback. A trade request directs the user back to the existing review flow.

This is a deliberately labeled AI interaction demo: deterministic local sample answers, no live model, network calls, real company research or hidden trade execution. User questions are escaped and bounded to 400 characters. The chat is scoped to the selected bond and resets when a different assistant session opens. Recommendation ranking still does not use external holdings.

Validation for this step: all 672 bonds produce a rationale; supported topics and unknown-question fallback return finite, nonempty answers. Six-month interest arithmetic was checked. Browser checks covered prompt chips, a typed early-sale question, selected amount changing from $100 to $500, $22.50 annual / $11.25 semiannual interest, projected bond allocation 36.4% → 37.6%, return to bond details, and no horizontal overflow in the current viewport. No order was placed by the assistant.

## Ranked three-bond shortlist

The finder now displays at most three distinct issuers in all three layouts. Yield minimum, sector, maturity cap and credit-risk preference remain hard filters. The eligible pool continues to drive holding-period yield suggestions and the labeled default-rate preview; ranking only reduces the displayed results. Zero, one or two eligible issuers remain zero, one or two results, without weakening constraints.

Ranking is deterministic: credit tier contributes 40/24/8 points; closeness to the minimum yield contributes up to 30 points (when no target is set, yield contributes linearly up to 30 at 8%); earlier repayment within the selected cap contributes up to 15. Known local bond-sector overlap subtracts up to 15 and issuer overlap up to 20, each weighted by its share of local bond holdings. A greedy selection applies an additional 12-point repeated-industry penalty when industry is unrestricted, while enforcing unique issuers. Ties use stable bond IDs. These weights are prototype judgments, not calibrated investment quality or risk probabilities.

Cards show their rank and the known-overlap/shortlist-diversity rationale. A methodology disclosure explains the priorities and limits. Ask AI uses the same selection notes. Only InCreditble bond holdings have issuer and sector detail; external fund exposure remains unknown and is not ranked. This supersedes the earlier note that ranking ignored all holdings.

Validation: 1,140 combinations of industry, term, yield and credit-risk ceiling respected eligibility, result count, issuer uniqueness and deterministic ordering. A concentrated local holding changed the top choice.

## Mentor feedback: company introductions

All 86 fictional issuers across 18 industries now have a shared company profile: what the business does, how it earns money, and an operating risk to watch. Different maturity bonds from the same issuer reference the same profile. Business models are invented UI fixtures; no financial statements, revenue amounts, company news or credit research are claimed.

Each shortlist card shows one business-summary sentence. Bond details expand it into “Meet [company],” “How it earns money” and “What to watch,” with a Fictional profile label and an explicit repayment limitation. The “Ask AI about this company” action opens the assistant and answers using those same fields, rather than a generic sector placeholder. The three-result ranking and order flow remain unchanged.

Validation: all 672 bonds have complete profiles; profile identity is consistent across maturities for all 86 issuers. Browser checks covered three distinct real-estate business models, the detailed Parkview profile, the company-specific AI entry and return to details.

User refinement: removed the full “A place for bonds, alongside your existing accounts” explanatory section and its sample-connections button from both finder states. Overview account connections and brief positioning copy remain available.

Fractional accessibility copy: the finder amount field explicitly says “Start small, from $10” and explains buying part of a bond, with $10 and $25.50 examples. Cards repeat the $10 minimum and selected amount. Buy entry explains the small starting amount; sell entry correctly retains partial/full-sale language without imposing the buy minimum. Ask AI recognizes fractional/minimum/small-budget questions.


### Account navigation refinement
- Finder entry is now “A little more about you”, retaining the identity/experience preference flow. Explanation-style labels remain descriptive inside the bond experience.
- Header “Your account” opens a menu for Settings, Tax documents and Log in / Log out. Settings links to About you and Connected accounts.
- Login only toggles an in-memory demo state and collects no credentials. Tax documents has an honest empty state; simulated trades produce no tax files.
- Verified in-browser: onboarding and returning to preferences, all three destinations, demo login/logout, keyboard opening, End and Escape with focus return. JavaScript syntax check passed.


### Preferences before matches
- Find bonds now opens a focused selection step after the existing KYC demo. No bond cards render until the preferences form is submitted.
- Yield/default range and holding period lead the form; industry, fractional amount and the CD reference remain available. Longer definitions are collapsed.
- Results show up to three matches with a compact selection summary and Edit preferences. Editing retains the submitted values and requires another explicit search. Entering from Overview starts at preferences again.
- Existing ranking and risk constraints are unchanged. Onboarding now ends with “Choose my preferences” to distinguish it from submitting the search.
- Validation: JavaScript syntax check passed. Browser checks confirmed zero cards before submission, three cards and no form after submission, retained amount/industry on editing and profile save, empty-result recovery at an 8% target, and working bond details. Preview saved as `output/trading-prototype/finder-preferences-first.jpg`.


### Refresh and branded welcome
- Full page loads normalize the route to Overview, retaining variant/reviewer parameters. Startup no longer invokes KYC; entering Find bonds still invokes the existing onboarding gate.
- A 3.4-second welcome uses the existing logo with a gentle entrance and four feature highlights: fractional orders from $10, yield-first discovery, optional AI help, and connected-account visibility.
- Go to overview skips immediately. The background is inert during the intro, then restored with focus moved to the main content. Reduced-motion users see static content without animations. Demo data still resets on reload.
- Browser validation: automatic completion reached Overview with no open dialog; Find bonds still opened KYC; refreshing while KYC was open showed the welcome and normalized the URL to Overview; skipping closed the intro and focused main. JavaScript syntax check passed. Screenshot: `output/trading-prototype/logo-welcome.jpg`.


### Expressive welcome with manual entry (supersedes timed intro)
- Existing WINK brand symbol now bounces and settles over a lime disc, with orbit strokes, sparkles and incoming $10 / yield stickers. Feature tiles and the entry button follow in sequence; animations finish in about two seconds.
- Removed the automatic dismissal timer and Escape dismissal. The screen stays until “Enter overview” is activated; the button is keyboard accessible and does not require waiting. Reduced motion disables the entrance animations.
- Browser verification: the welcome remained visible beyond the former auto-close duration; background stayed inert, no KYC opened, and Enter on the entry button restored Overview interaction and focus. Reload displays the welcome again. JavaScript syntax check passed. Preview: `output/trading-prototype/wink-welcome.jpg`.

- Welcome slogan revised to “Big bonds. Small beginnings.” with “Corporate bonds. Now within reach.” above it, emphasizing fractional access rather than investment performance. Mobile headline size adjusted for the longer second line.


### Finder submit button containment fix
- Desktop submit button inherited `width: 100%` from the old sidebar form while sharing a flex row with risk copy. At a 1280px viewport it extended about 60px beyond the card.
- Set the submit button to intrinsic width with a 100% maximum and allowed the action row to wrap. The existing narrow-screen full-width button remains.
- Browser verification: contained at 1280px and 390px; mobile button fills its row; submitting still shows three matches. Temporary viewport override reset. Screenshot: `output/trading-prototype/finder-button-fit.jpg`.


### Welcome for people new to investing
- Headline: “Your first bond. At your pace.” Invitation: “No experience needed.” Support: “Plain words. Help at every step.” The emphasis is learning and user control, without labeling visitors by age or promising safe returns.
- Feature tiles now use everyday language: start with $10, bonds for your goals, ask in plain English, and all accounts in one view. Intro animation and manual entry remain.
- Increased small-copy readability; feature tiles stack on narrow phones instead of shrinking their text.


### Focused Overview for novice users
- Replaced the multi-section dashboard with one main card: total portfolio and total profit/loss, the existing account/asset-filterable line chart, one prominent Find a bond action, and a compact next-payment summary.
- Holdings, allocation, profit breakdown and recent activity now open under View details; connected-account management remains accessible there and through Settings. Full interest/dividend schedule opens under View schedule. Removed the separate explanatory CTA, account list, explanation-style panel and transaction list from the default overview.
- Payment month selection updates the modal locally, retaining horizontal chart scroll and focus. Shared dialogs reset the schedule-specific width when other content opens.
- Verified syntax and browser flows: payment month change, portfolio details, activity disclosure, connected-account access, equity chart filtering ($21,000), and Find a bond onboarding. Checked 1280px and 390px layouts; primary button and schedule modal remain contained. Restored default viewport. Screenshot: `output/trading-prototype/overview-focused.jpg`.

- Restored a persistent “+ Connect account” secondary button beside the Overview total, per user feedback. Find a bond remains the primary action. Verified the button opens the existing sample-account connection flow; narrow layouts place the account actions on their own row.


### In-place Overview views
- Replaced View details / View schedule buttons and their modal destinations with Portfolio / Holdings / Payments tabs in the existing chart area. Total balance, Connect account and Find a bond remain in place.
- Holdings contains the previous portfolio details and activity; Payments contains the interactive payment chart and month details. The redundant next-payment footer is hidden while Payments is active.
- Tabs use tablist/tab/tabpanel semantics, roving focus, Left/Right and Home/End navigation. Asset/account filters and payment month persist across switches.
- Verified no dialogs open when switching views, old buttons are absent, equity filtering still reports $21,000, payment month selection works, and both Holdings and Payments fit a 390px viewport without overflowing the panel. Desktop payment chart fits all 12 months; mobile chart scrolls internally. Default viewport restored. JS syntax check passed. Previews: `output/trading-prototype/overview-tabs.jpg`, `output/trading-prototype/overview-tabs-payments.jpg`.


### Trade feedback and updated Holdings
- Reproduced the reported unchanged-looking portfolio: a $100 buy reduced local cash from $2,500 to $2,400 and created a $100 holding, but the completion action returned to the total-value chart. Total remained $42,580 correctly under unchanged par prices and zero fees.
- The failure was missing visible trade feedback / the wrong return view, not an accounting mutation failure. The browser check for visible post-trade feedback was false before the change. Direct before/after evidence made bisection and additional instrumentation unnecessary.
- Each simulated order now records cash and holding amounts before/after; confirmation and Holdings show those changes. A completed order selects Holdings, highlights the affected existing position, and explains why total value stays unchanged. Fully sold positions disappear and the latest trade explicitly says Position closed.
- Browser regression checks passed for a $100 buy, $25.50 partial sell (cash $2,425.50; position $74.50), and $74.50 full sell (cash restored to $2,500; position absent). Selected Holdings + one visible feedback panel checked after completion. Closed-dialog markup is excluded from the visibility check. JS syntax check passed. No real trades; balances still reset on refresh.


### Quote discovery before simulated trades
- Buy/Sell now opens a short simulated quote lookup, then an illustrative intraday-style reference-price chart and separate buy/sell quotes. The active side is highlighted. Refresh demo quotes explicitly changes the spread; no live feed or executable external market is implied.
- The selected quote is held through amount entry and review. Final review shows price per $100 face, face value, zero demo fees/accrual, total cash cost/proceeds and cash afterward. Buys enter a cash budget; sells enter face value. No order is submitted until confirmation.
- Quote math uses integer cents: buy face rounds down to stay within budget, settlement cash rounds to cents. Positions remain face cents valued at the fixed $100 demo reference; weighted-average cost basis and realized P/L now account for bid/ask spread. This supersedes the previous unchanged-price trading assumption. Reference-yield and assistant explanations were updated accordingly.
- Verification: 54 pure quote, rounding and round-trip loss checks passed. Browser: $100 buy at 100.16 yielded $99.84 face, cash $2,400, total $42,579.84 and P/L $2,339.34. Selling that face at refreshed 99.80 yielded $99.64, restoring original face holdings with cash $2,499.64 and total/P&L reduced by $0.36. Canceling lookup prevents late modal reopening.
- Quote and final-review dialogs verified at 390px without horizontal overflow; desktop preview shows both quotes and the continue action. Temporary viewport overrides restored. Preview: `output/trading-prototype/bond-price-discovery.jpg`.


### Four novice-flow improvements — October 10, 2026
- Progress now persists in versioned, validated browser storage: simulated fills, cash, positions/cost basis/P&L, completed demo setup, finder drafts and auto-yield choice, sample connections, chart filters and payment month. A full load still shows the welcome and starts at Overview. Quotes and unfinished orders are not restored. Settings includes a deliberate reset with a keep-progress option; unavailable storage is reported there. This supersedes earlier refresh-reset / in-memory-only notes.
- Final order review adds each semiannual interest amount, the next expected payment, and principal amount/date at maturity. Buy previews the purchased face value; partial sales preview the remaining holding; full sales explicitly close future payments. All use the fixed demo date, fictional coupon schedule and existing rounding conventions.
- Match cards lead with one concrete comparison. Company context and detailed rationale are expandable. Ranking reduces near-duplicate yield/term/credit-quality combinations while retaining hard filters, unique issuers and industry variety. Default results now include 1-year repayment, a healthcare alternative, and a 4.65% interest alternative. No unsupported “safest” or return guarantee labels.
- Auto-adjust yield has an explicit checkbox. Moving the yield slider turns it off; changing timeframe/industry then preserves the target. Enabling it shows the previous/new suggested yield. Default-rate meaning is available beside the control in plain English; demo rates remain invented, not forecasts or loss percentages.
- Verification: 23 persistence/invalid-data/payment/comparison checks and 1,140 matching invariant cases passed; JS syntax checks passed. Browser tested manual vs automatic yield, three comparison cards, $100 buy ($99.88 face, $2.65 semiannual interest), $25 partial-sale preview ($74.88 remaining face, $1.98 interest), full sale, and persisted balances/profile/connections after refresh. Reset cancellation and confirmed reset both verified; test trades removed using Reset demo. Checked finder, matches and order-review containment at 390px. Desktop snapshots saved as enhancements-matches.jpg and trade-payment-review.jpg under output/trading-prototype.
