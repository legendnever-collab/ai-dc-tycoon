# AI Data Center Tycoon

**Latest Release: v0.11.0 Release Candidate** · **Previous Stable: v0.10.0** (PR #8 merged, `b2aeb24c25060a9c5803899d109a6b0bc62ff2d1`).

7 Chapters / 21 Missions: Compute → Network → CPO → Optical Engine → Photonic Substrate → Manufacturing → Optical Architecture.

- Latest playable: [ai-dc-tycoon-v0.11.html](ai-dc-tycoon-v0.11.html)
- Release / execution: [START-HERE-v0.11](START-HERE-v0.11.md)
- Build: `npm ci && npm run build:v011` (Node 24). `npm run build` retains historical distributions.
- Tests: `npm run test:v08-baseline`, `npm run test:v08`, `npm run test:v09`, `npm run test:v010`, `npm run test:v011`; Browser: `npm run test:v011-browser` with Playwright/Chromium installed.
- Release evidence: [REGRESSION-v0.11](REGRESSION-v0.11.md), `evidence/v011/`, `RELEASE-MANIFEST-v0.11.json`.
- Model boundaries: [Optical Architecture Model](docs/OPTICAL-ARCHITECTURE-MODEL-v0.11.md).

Free Exploration grants no rewards. Campaign Chapter 7 unlocks after Mission 18. Existing progress, experiments and historical HTML / ZIPs are preserved. Changed input requires a new simulation.

Product release version is `offlineReleaseVersion` (0.11.0). `package.json.version` 0.3.0 identifies the legacy package/tooling baseline; it is intentionally unchanged. Engineering Lab Core0.2.0 is independent. New Chapter 7 values are Educational Assumptions, not measured product or standards compliance. BER, receiver sensitivity, full-wave EM, CMT and reliability lifetime are Not Modeled.

Development branch: `feature/v0.11-optical-architecture`. RC remains unmerged until user approval. Historical releases: `ai-dc-tycoon-v0.3.html` through `v0.10.html`, versioned START-HERE documents and archives. Their release status is historical, not the current RC.
