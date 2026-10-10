# AI Data Center Tycoon v0.11.0 — Release Candidate

Open `ai-dc-tycoon-v0.11.html` in a modern browser. Everything runs offline with embedded Korean font; no server, account, API or CDN required.

1. Free Exploration → Chapter7 / any Mission19–21. Campaign Chapter7 requires actual Mission18 clear.
2. Read Customer Requirement. Choose Spatial Paths, Lane Rate and λ independently. Mission19 previews WDM;20 explores it;21 compares three 1.6T customer orders.
3. Predict (optional), Run Simulation, inspect four primary KPIs and failed constraints, then Debrief. Hints are progressive.
4. Save Design A, change parameters, rerun, save B, Compare. Restore loads the verified original snapshot. Changed input means old PASS is stale.
5. Mission21: complete Decision Review using observed metrics, write a short note, Copy Report as Markdown / Copy Comparison Summary. If clipboard is blocked in file://, copy visible textarea manually.
6. Campaign First Clear adds150XP/250Credits once. Chapter7 wallet supplements the unchanged Chapter1–6 wallet. Practice grants zero.

Autosave uses protected IndexedDB with CAS/LKG. Existing v0.9/v0.10 stores/backup formats stay unchanged. Chapter7 has its own Text Backup/Paste Restore for practice and campaign profiles/A/B. Use existing Campaign and Experiment screens for older backups; there is no automatic destructive migration. Storage depends on browser/profile/file-origin; copy backups before moving file/browser. Future-schema/corrupt-store write protection preserves original data and visibly blocks saving.

Build: `npm ci && npm run build:v011`. Golden: `npm run test:v08-baseline && npm run test:v08 && npm run test:v09 && npm run test:v010 && npm run test:v011`. Browser: install Playwright1.56.1/Chromium, then `npm run test:v011-browser`; older browser scripts remain available. Packaging: `VALIDATED_SOURCE_SHA=<40-char source commit> npm run package:v011 && npm run test:v011-package`.

Release documents in docs/: ARCHITECTURE, GAME-DESIGN, MISSION-CATALOG, OPTICAL-ARCHITECTURE-MODEL, LEARNING-CONTENT, VISUAL-DESIGN, REGRESSION, KNOWN-ISSUES, NEXT-DEVELOPMENT-PLAN (all v0.11). Exact evidence in `evidence/v011/`; actual screenshots in `screenshots-v011/`; manifest external to ZIP to avoid recursive hash.

All Chapter7 numerical assumptions are educational/un calibrated. Loss Reserve is not receiver margin; 200G/Lane is not commercial BER/SerDes validation. See model boundaries. RC branch `feature/v0.11-optical-architecture`; PR for review, **not merged**. Previous stable v0.10 PR#8 is merged. Package.version0.3.0 remains legacy tooling; product version0.11.0 is independent.
