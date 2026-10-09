# START HERE — AI Data Center Tycoon v0.4.0

## Release structure
- `ai-dc-tycoon-v0.4.html`: game-first Offline Chapter 01 + Chapter 02 + Advanced Photonics Engineering Lab.
- `ai-dc-tycoon-v0.3.html`: original verified Chapter 01 executable, still emitted byte-for-byte by the build.
- Source: `src/game-*`, `src/dc-simulator.ts`, `src/chapter2*.ts`, `src/network-*.ts`.
- `src/lab-baseline.html`: immutable Optical Engine Tycoon v0.2.0 inside iframe.
- Build with Node 24: `npm ci && npm run build`.
- Test: `npm run test:golden && npm run test:p2 && npm run test:game && node tests/chapter2-golden.cjs && node tests/release-integrity.cjs`.
- Browser Smoke: `node tests/chapter2-browser.cjs` after installing Playwright + Chromium.

## How to play
1. Double-click `ai-dc-tycoon-v0.4.html` in a Chromium-based browser. It does not require an HTTP server.
2. Play Mission 01–03 (Chapter 01). Completing Mission 03 unlocks the Chapter 02 button.
3. Mission 04: install a High-Density Switch and connect both waiting racks, then run the simulation.
4. Mission 05: install a Spine Switch and connect/upgrade both Leaf uplinks to 200 Gb/s.
5. Mission 06: select each Optical Host Port, install matching 800G Pluggable Modules, connect Fiber and run the simulation.
6. Mission 06 completion introduces the CPO Research Preview; CPO physics is deliberately out of scope.
7. The Advanced Lab in the top navigation remains a separate v0.2 engineering environment.

## Save and restore
- v0.3 Game: original `AIDataCenterTycoon-v03` IndexedDB and its existing Backup/LKG controls remain unchanged.
- Chapter 02: additional `AIDataCenterTycoon-v04-Chapter2` IndexedDB, keyed by original Player Profile ID.
- Chapter 02 has independent Autosave, SHA256-protected Text Backup, Paste Restore and LKG.
- When migrating to a new computer, restore Chapter 01 Game Backup first, then Chapter 02 Backup, and use the Engineering Lab's own Backup for engineering designs.
- Unsupported future schema, corruption and mismatched profiles are rejected rather than silently imported.
- Company policies may block `file://` IndexedDB: keep both Game Backup texts independently.

## Truthful fidelity
All 400G/800G, power, Credits, topology, routing, traffic and workload numbers in Chapter 02 are **educational assumptions**, not specifications of any commercial vendor. Chapter 02 uses a fixed-path game model; the Chapter 02 Mission evaluation now uses a typed graph adapter via `chapter2-graph.ts` and `traffic-solver.ts`. The independent `network-model.ts` is an additional experimental graph engine with different educational assumptions, not the Mission evaluation source.

## Known limitations
Real Android, corporate browser, human novice usability, vendor optics behavior, BER, optical loss, thermal, real-world Network TCO and CPO physics require independent validation. Browser/CI test status and exact counts belong in `REGRESSION-v0.4.md`; do not infer the old 240-case release was executed anew unless listed explicitly.
