# AI Data Center Tycoon v0.8.0

Open ai-dc-tycoon-v0.8.html offline. Continue from your v0.7 Campaign Text Backup using 저장 / Backup → paste → 복원. Chapters1–5, XP/Credits, OE and Substrate stay intact; Chapter6 starts unplayed. Mission15 unlocks16.

Mission16: choose an interface and compare the customer window/budget. Mission17: run the failing Basic pilot, diagnose edge Pitch Mismatch, then compare Precision + Pitch Matching using the same seed. Mission18: choose a customer order, test scope, Known-Good and rework; run the batch and inspect the real cost/good-unit ledger. Learn Chapter6 explains each choice in Korean with English engineering terms.

Prototype First favors cheap/fast setup; Quality First requires per-channel inspection. Retry preserves seed and first-clear rewards are unique. Cancel keeps the last valid state; restart regenerates from seed. Assembly Acceptance is a conditional simulated rate, not measured Manufacturing Yield or Reliability.

Rebuild: npm ci && npm run build. npm run test:v08 and npm run test:v08-browser execute new checks; all old suites remain available. Install isolated playwright@1.56.1 and chromium --with-deps for browser checks. Package with GITHUB_SHA=<published-tested-source-commit> npm run package:v08. See docs/REGRESSION-v0.8.md and manifest for actual execution evidence.

Branch feature/v0.8-assembly-yield. Do not merge without user review.
