# AI Data Center Tycoon

**Latest Release: v0.11.1** (patch on v0.11.0) · **Previous: v0.11.0** (PR #9 merged, `de6c07f`) · v0.10.0 (PR #8 merged, `b2aeb24`).

7 Chapters / 21 Missions: Compute → Network → CPO → Optical Engine → Photonic Substrate → Manufacturing → Optical Architecture.

- Latest playable: [ai-dc-tycoon-v0.11.1.html](ai-dc-tycoon-v0.11.1.html) — what changed: [START-HERE-v0.11.1](START-HERE-v0.11.1.md)
- Release / execution: [START-HERE-v0.11](START-HERE-v0.11.md)
- Build: `npm ci && npm run build:v0111` (Node 24). Frozen v0.11.0 and older executables are restored byte-for-byte; `npm run build` retains historical distributions.
- Tests: `npm run test:v08-baseline`, `npm run test:v08`, `npm run test:v09`, `npm run test:v010`, `npm run test:v011`, `npm run test:v0111`; Browser: `npm run test:v0111-browser` (current) / `npm run test:v011-browser` (frozen v0.11.0) with Playwright/Chromium installed.
- Release evidence: [REGRESSION-v0.11](REGRESSION-v0.11.md), `evidence/v011/`, `RELEASE-MANIFEST-v0.11.json`.
- Model boundaries: [Optical Architecture Model](docs/OPTICAL-ARCHITECTURE-MODEL-v0.11.md).

Free Exploration grants no rewards. Campaign Chapter 7 unlocks after Mission 18. Existing progress, experiments and historical HTML / ZIPs are preserved. Changed input requires a new simulation.

Product release version is `offlineReleaseVersion` (0.11.1). `package.json.version` 0.3.0 identifies the legacy package/tooling baseline; it is intentionally unchanged. Engineering Lab Core0.2.0 is independent. New Chapter 7 values are Educational Assumptions, not measured product or standards compliance. BER, receiver sensitivity, full-wave EM, CMT and reliability lifetime are Not Modeled.

v0.11.0 was merged to `main` (PR #9); its executable, evidence and manifest are frozen. Historical releases: `ai-dc-tycoon-v0.3.html` through `v0.11.html`, versioned START-HERE documents and archives.
