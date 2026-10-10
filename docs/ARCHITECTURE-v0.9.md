# v0.9 Free Exploration

Authoritative baseline: main `2c11d75d71f7d328b2934a84eb0a2d222cf16451`.

Campaign runtime, mission reducers, reward ledgers, persistence parsers and numerical models are preserved byte for byte. `build.cjs` adds a v0.9 bundle around the unchanged Chapter6 Campaign entry and retains the exact v0.8 executable. The v0.3 package version remains the historical Chapter1 schema version; `offlineReleaseVersion` is 0.9.0.

`exploration-catalog.ts` owns the data-driven Chapter / Mission catalog. `exploration-model.ts` creates design-only scenarios and routes directly to the original `forecast`, `simulateChapter2`, `evaluateChapter3`, `evaluateWorkshop`, `evaluateSubstrate` and `evaluateMission6`. Campaign reducers are never called by Practice, so no fabricated prerequisite clears, XP or reward receipts exist. Mission7 customer-order observations are practice-only numerical provenance, not first-clear reward receipts.

Mission8 starts with an empty package. Mission9 inherits a two-OE bench and requires the player to expand and install it. Mission10–12 inherit only the previous optical design stage. Mission13–15 inherit a valid OE Tx path. Mission16–18 inherit a valid 4-OE Package and OE-001 / 16 × 50G Substrate / FAU binding; Equipment, pitch, inspection and manufacturing choices remain unoptimized. Mission17 initially fails the original 92% all-channel yield gate. Mission18 initially fails the original Quality batch gates. No starter is automatically evaluated, cleared or rewarded.

Each mission has its own PracticeSession with Scenario / attempts / result / previous result. Result is canonical JSON with input provenance and the unchanged Mission objectives. Monte Carlo samples are reconstructed by Seed and excluded from persisted state. Simulations run in cancellable chunks; cancellation commits no partial Practice Result. Same input uses the same original Solver and Numerical Evaluation. Provenance hashes can differ from Campaign fixtures when cached qualification metadata is omitted; all numerical outputs and hard gates remain identical.

`exploration-controls.ts` exposes bounded, mission-specific decisions and preserves typed package connections. `exploration-app.ts` mounts Home, Navigator, Learn and Practice screens. Campaign screens retain their original DOM and navigation. Technology Tree keeps its original Locked state and receives separate practice-entry buttons.

Free Exploration storage: `AIDataCenterTycoon-FreeExploration-v09`, DB version1, snapshots store, envelope schema1, format `AIDataCenterTycoon-FreeExploration`. Campaign DB names and envelope versions are unchanged. Writes use an atomic head CAS and LKG update; overwritten/corrupt originals are archived. Unsupported schemas block practice autosave. There is no cross-namespace Restore Journal: Practice never writes Campaign heads or journals. Campaign Backup / Restore remains the original protected v0.8 implementation.

Extending beyond Chapter6 requires adding catalog rows, a starter and a solver/control adapter; no change to Campaign unlock conditions is required. Chapter7 is not implemented in this release.
