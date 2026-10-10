# InCreditble live demo guide

## Event requirements

From the supplied Demo Requirement document: submission is due **Saturday, October 10 at 11:59 PM Pacific**. README must describe what was built, who it is for and how it works, and link to a **2–3 minute video**. Judges need a **public repository** with no API keys or sensitive data.

The live event is **Sunday, October 11, 1–4 PM**, Grimes Engineering Center, top floor, SCET. Preliminary table visits run **1:30–2:30**, about five minutes per project including questions. Finalists pitch for three minutes during **2:45–3:45**; awards run **3:45–4:00**. Use event-local Pacific time. The dates align with the October 2026 submission context.

## Before recording or a judge visit

1. Start the local server from the repository/package root:
   `python3 -m http.server 4173 --bind 127.0.0.1 --directory prototype`.
2. Open `http://127.0.0.1:4173/?variant=A`. Keep the server terminal running. If 4173 is already serving this prototype, reuse it.
3. Enter Overview. Choose **Your account → Settings → Reset demo progress → Reset demo**. This intentionally clears prior demo trades and restores the seed data.
4. Refresh to return to the welcome. Start the recording there. Identity setup should appear only after you click Find a bond.
5. Use a readable desktop window. Turn off notifications. Keep this guide and the backup screenshots available locally. No internet is needed for the prototype itself.

## The one journey to show

| Step | Action | What the judge should notice |
| --- | --- | --- |
| 1 | Enter overview → Find a bond | Existing accounts can remain visible; one primary next action |
| 2 | Continue with a demo identity → I’m new to bonds → Balanced → Choose my preferences | Identity simulation, familiarity and risk are separate |
| 3 | Keep 4.50%, up to 5 years and Any sector; enter $25 → Find my bonds | A goal-based starting point, no bond ID required |
| 4 | Read the three comparison labels | A small set with meaningful trade-offs |
| 5 | Ask AI on Marketlane Stores → a risk question → close | Optional explanation, with no autonomous trading |
| 6 | Understand & buy on Marketlane → Choose an amount | Company context before committing money |
| 7 | Continue with this price → Review simulated order | Actual sample quote, fractional face value and cash cost |
| 8 | Explain interest and principal dates → acknowledge simulation → Confirm simulated buy | The user approves the final terms |
| 9 | See updated holdings | Cash decreases and the position appears; the spread affects value |

With the reset default filters, the current matches are Marketlane Stores · 1Y, Cedar Healthcare and Sunfield Foods · 2Y. Repeated purchases change local exposure and may change later rankings. Read the displayed values rather than memorizing a quote.

If the risk assistant is open, close it before returning to Understand & buy. The modal can scroll; the confirmation is below the payment information. Use ordinary browser scrolling, not zoomed-out tiny text.

The customer-led video now opens with the founder’s supplied discovery comments; see [the updated script](PITCH.md) and [recording kit](video/RECORDING.md).

## Five minute table visit

- **0:00–0:30:** Who this is for and the first-bond problem.
- **0:30–2:30:** The single goal → match → explain → quote → approve → holdings journey.
- **2:30–3:00:** What works technically and what is simulated.
- **3:00–5:00:** Questions. Use the [judge Q&A](JUDGE_QA.md).

Leave selling, account linking, chart filters and automatic yield controls for questions. Showing every feature weakens the main story.

## Useful follow-up demonstrations

**What if I have little money?** Set Amount to invest to $10. It changes the fractional purchase amount, not the obligation to understand the risk.

**Why another platform?** Show + Connect account and the sample read-only account flow. Explain the intended benefit: an understandable bond workflow alongside existing investments, without demanding a full portfolio migration. Actual demand and willingness to add an account still need testing.

**What if I sell?** Holdings → Buy / sell → Sell holding. Explain the sell quote, remaining holding and reduced future interest. A full sale removes the position. This remains a simulation.

**Can I control my target?** Move the yield slider. Auto-adjust turns off. Changing the holding period now keeps the selected yield; the checkbox lets the user re-enable adjustment.

## Recovery

- **Refresh mid-demo:** Progress survives; enter Overview, then Holdings or Find bonds. An unconfirmed quote/order is not restored.
- **Unexpected matches:** Existing local holdings affect ranking. Reset for the baseline story, then use the defaults above.
- **No matches:** The product preserves user limits. Lower the target or broaden the filters; do not describe an empty result as a malfunction.
- **Port conflict:** Reuse the running demo, or change the server port and browser URL together. A new port has separate browser storage.
- **Browser failure:** Use the actual prototype screenshots in `media/` and the recorded video. State that it is a backup rather than pretending it is live interaction.

## Submission status

| Requirement | Status as prepared October 10 |
| --- | --- |
| What was built, audience and how it works | Included in root README |
| Working laptop demo | Included as standalone static source; Python 3 required to serve it |
| 2–3 minute video | Script prepared; actual recording/link still needed |
| Public repository | GitHub metadata reports IvyPei/InCREDITble is private; publication still needed |
| Current files on GitHub | Local changes prepared; not pushed by this packaging task |
| Sensitive-data check | Packaged file allowlist and pattern scan recorded in PACKAGE_CHECK.md; full Git history is outside that check |

The ZIP is a portable rehearsal/source package. It does not replace the required public repository and video link.
