# Feedback and interest collection

Public page: https://increditble.vercel.app/feedback/

One form collects feedback and interest together, with no mode selector. Visitors can leave feedback without an email, opt into email contact without a message, or do both. Empty submissions are rejected. Interest collection does not send email automatically. Team members must use the stored contact consent when following up.

Responses are JSON files in the **private** Vercel Blob store `increditble-feedback`, connected to the InCreditble project in Production and Preview. Open https://vercel.com/ivypei/increditble/stores while signed in, select the store, then browse `feedback/YYYY-MM-DD/`. Files starting with `interest-` identify interest signups; `feedback-` files can also include a contact opt-in. A response includes its creation date, name, message, email (only with consent), consent wording/version/date and the entry point.

No public list or read API is exposed. Responses and emails are never written to the public GitHub repository. Visitors' account data, IP addresses, full referrers and browser identifiers are not collected by this application. Normal hosting logs are managed by Vercel.

The site POSTs to `/api/feedback`. A success screen appears only after a private Blob write succeeds. Failed submissions keep the visitor's text on screen. Vercel supplies `BLOB_STORE_ID` and short-lived OIDC credentials; no storage credentials belong in the browser. A server-only `BLOB_READ_WRITE_TOKEN` is supported if provisioning later uses that authentication method.

On a visitor's deletion or contact-withdrawal request, remove their response from the private store or update your team's contact list accordingly. Do not export contacts to a public file. The Contact the team link points to Ivy's LinkedIn profile.

Run backend checks with `node --test tests/feedback.test.mjs`. The Python static preview server cannot save submissions; verify real writes on the Vercel deployment. Spam protection here includes strict origin/content-type checks, field/body limits and a honeypot. Before a larger campaign, add managed rate limiting or bot protection in Vercel Firewall.

References: https://vercel.com/docs/vercel-blob/private-storage and https://vercel.com/docs/functions/runtimes/node-js
