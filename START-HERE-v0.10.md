# AI Data Center Tycoon v0.10.0

Open `ai-dc-tycoon-v0.10.html` in a modern desktop browser. It is a complete offline file: no CDN, remote font, LLM service or network asset is required.

1. Choose **Free Exploration**, then any Mission 01–18.
2. Change Engineering Decisions and **Run Simulation**.
3. Read **Engineering Debrief**: actual objectives, model explanation, one-factor experiment.
4. **Save as Design A**. Change a decision, run again, **Save as Design B**.
5. **Compare Designs** separates PASS/FAIL from performance/cost. Engineering Details exposes units, scope and all constraints.
6. **Restore Design A/B** loads the original independent input and verified result. **Compare with Previous** compares the last two real runs.

Changed input invalidates the current result. `Stale Result` is not a PASS. Reset Current Experiment resets only the active Practice design; saved A/B remain. Reset Comparison removes only that Mission's A/B. Continue Campaign retains the original six chapters, gates and rewards; experiments grant no XP / Credits.

Autosave uses the same v0.9 Practice store plus a separate protected Decision Lab store. Existing Campaign and Practice restore automatically in the same browser/origin/profile. Text Backup / Paste Restore reads v0.9 Practice backups and v0.10 combined experiment backups. Campaign Backup remains in Continue Campaign → Backup. File URL origin/storage behavior depends on browser/profile; keep a Text Backup for moving the file or changing browser. The game never forces a v0.9 reset.

For Mission17/18, keep Seed and Samples equal when comparing. Different Customer Order/Batch contexts restrict direct ranking. Educational numerical presets are uncalibrated; they are not Vendor yield or measured hardware qualification. Full-wave EM, CMT, BER, thermal warpage and reliability lifetime are Not Modeled.

Rebuild: `npm ci && npm run build`. New checks: `node tests/v010-golden.cjs`, `node tests/v010-explain-scenes.cjs`, `node tests/v010-browser.cjs` (Playwright Chromium installed). Release archives include source, handoff, real screenshots and a separate SHA256 manifest. The Feature Branch/PR are reviewable; main has not been merged.
