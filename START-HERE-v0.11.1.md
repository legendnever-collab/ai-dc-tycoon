# AI Data Center Tycoon v0.11.1 — Patch Release

Open `ai-dc-tycoon-v0.11.1.html` in Chrome or Edge. Single offline file: no install, server, account, API or CDN. Gameplay and all instructions are as in [START-HERE-v0.11](START-HERE-v0.11.md).

## Fixed (Chapter 7 UI only)

1. **Mission20 "Fast Narrow" preset produced 400G.** Mission20 forced every preset to 50G, so Fast became 8 × 50G = 400G — half the 800G requirement. Presets now fit the lane rate to the Mission's required Gross (Mission19/20: 800G, Mission21: 1.6T). Mission20 Fast = 8 × 100G = 800G.
2. **Mission19 "Fast Narrow" kept Advanced signaling at 100G.** It added an unnecessary +0.5 W and +100 Credits, contaminating the "same bandwidth, different power" comparison. Advanced signaling is now assumed only at 200G. Mission21 presets are unchanged.
3. **Connected Paths did not follow Spatial Paths upward.** Changing Spatial 16 → 8 → 16 left 8 paths connected (hidden in Advanced Parameters), producing an unexplained Connectivity FAIL. Per-λ I/O channels likewise did not follow λ (16 paths → 4λ stayed at 16, needing 64). Fully provisioned values now follow Spatial / λ changes; deliberately under-provisioned values are kept (clamped) so the learning constraint still works.

## Unchanged

Model `optical-architecture-educational-1.0.0`, every equation, coefficient, Customer budget, reward and save format. v0.11.0 progress, A/B snapshots and Text Backups load as-is (same IndexedDB store). Chapter 1–6 untouched. `ai-dc-tycoon-v0.11.html` (v0.11.0) is byte-identical.

## Verification

`npm ci && npm run build:v0111`, deterministic regression (`node scripts/regression-v011.cjs`: baseline + 235 cases), `npm run test:v0111` (18), `npm run test:v0111-browser` (6 patch UI + full 34-case v0.11 suite re-run on the v0.11.1 file). Chromium file:// offline, 1440/390/320 px, zero exceptions, zero HTTP requests. v0.11.0 → v0.11.1 save continuity checked in a persistent browser profile.

NOT TESTED: physical Android, Firefox/Safari, human learning effectiveness (same as v0.11.0).
