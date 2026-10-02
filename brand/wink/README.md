# WINK brand kit

The selected InCreditble identity. Open [index.html](index.html) for the gallery.

- `logos/`: symbol, horizontal, stacked, and wordmark in Ink, Violet, black and white; transparent SVG/PNG; small-symbol master.
- `icons/`: app icon, circular avatar, favicon, 16/32/48/180/192/512 px web icons, manifest.
- `social/`: seven editable SVGs and matching PNGs at 1080x1080, 1080x1350, 1080x1920, and 1200x630.
- `templates/`: card concept, founder card, presentation cover, letterhead; landing page, email and email signature.
- `BRAND_GUIDE.md`, `MARKETING_COPY.md`, `tokens.css`, `tokens.json`: usage and messaging.
- `checks/size-proof.png`, `brand-board.png`: identity and small-size proof.
- `../../output/pdf/`: customer one-pager and compact brand guide.
- `../../output/InCreditble-WINK-brand-kit.zip`: portable package, including PDFs.

From the repository root, serve everything with `python3 -m http.server 4174 --bind 127.0.0.1`, then open `/brand/wink/` or `/prototype/index.html?view=bonds`.

## Rebuild

Run `python3 brand/wink/source/build.py` to generate SVG artwork, then run `node brand/wink/source/export.mjs` with the `sharp` package available. Set `SHARP_MODULE` to a local installed module path if needed. Run `python3 brand/wink/source/build-pdfs.py` with ReportLab installed for PDFs. No font software is bundled. Logo paths are in `source/wordmark-outlines.json`; campaign SVGs retain editable text.

The ZIP excludes exploratory concepts, audit scratch files and machine-specific data. It is a concept design handoff, not a claim of trademark clearance, print-production readiness, or a launched financial service.
