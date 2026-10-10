# Regression — v0.8.0

G0 was actually executed in the fresh merged-main checkout:431 Deterministic PASS +43 Browser PASS =474,0FAIL. This is a new baseline execution, separate from the historical v07 report; evidence/v08-baseline retains timestamped reports.

New suites cover coupling/reference-plane/no-double-loss/Unknown, seed/CRN/distribution/zero-variance/rotation/hard-channel-gates, chunk/cancel parity, manufacturing test scope/rework/event economics/undefined denominator, gated progression/reward deduplication, backup migration/CAS/LKG/future/journal and preserved source/executable guards.

The Node-produced qualified Chapter6 backup is restored by Chromium to check cross-runtime provenance. New fixed9-decimal result serialization belongs to the assembly model only; unchanged v07 core comparisons permit2×10⁻⁹dB round-off. Original numerical fixtures and expected values stay unchanged.

Browser gate executes real Mission16–18 controls, true failure→optimization→clear,9+ genuine captures,390/320px touch, two real tabs, future raw-byte archival and interrupted six-head journal recovery. The new executable also executes the unchanged Mission01–12 assertions via a launcher/envelope adapter, plus actual Mission13–15 failure/clear controls in v08. Existing43 v07 scenarios remain a separate required run. Every browser group asserts zero HTTP runtime requests and zero JavaScript exceptions.

Reproduce:

```sh
npm ci
npm run build
npm run test:v08-baseline
npm run test:v08
npm install --no-save --no-package-lock playwright@1.56.1
npx playwright install --with-deps chromium
npm run test:v07-browser
npm run test:v08-browser
GITHUB_SHA=<published-source-commit> npm run package:v08
npm run test:v08-package
```

Release packaging refuses missing/failed evidence, requires431 old checks plus all new suites and genuine captures, then verifies ZIP CRC, every extracted source hash and byte-identical clean rebuild of v03–v08. Actual final counts and workflow commit/results are reported with the release manifest and final handoff; a historical CI run is not final verification.

Physical Android, human usability, measured manufacturing calibration and reliability lifetime: NOT TESTED / NOT MODELED, never inferred from touch emulation or simulated acceptance.

## Actual local final execution

Existing deterministic431 + new assembly40 / storage18 / integrity3 = **492 PASS /0 FAIL**. Existing v07 browser43 + v08 desktop14 / touch8 / real storage7 / original01–12 controls14 / original13–15 controls5 = **91 PASS /0 FAIL**. Total **583 PASS /0 FAIL**. These are actual local executions, not copied historical counts. Every group has structured evidence under evidence/v08; all browser groups assert HTTP0 / JS0.

New source archive passed CRC and every source hash, and a fresh npm ci / build recreated byte-identical v03–v08. v07 executable remains2b648ab3b32ef05ab0beed7b5e9c2dcdb518c4321ad65fdf7b389f24fdd5d7a8. Current v08 executable46290b308030bb9bfae9a6ef70f7830cb88942b5978683e3b4417e46d4afd818. GitHub Actions runs current feature HEAD independently; final remote results are linked in PR and handoff, not assumed from local success.
