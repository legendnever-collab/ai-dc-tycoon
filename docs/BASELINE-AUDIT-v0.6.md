# v0.6 Baseline Audit

2026-10-09 · GitHub authoritative baseline: `9ba593f993994c79a2814f3493cdab38b4167675`.
Main and feature/v0.6-optical-engine both point to this v0.5 merge commit; PR #3 merged. PR source head 56f85d4758cbabc2fc2b3bb3c5d55d32fb4a92ae had successful Actions runs 37931522056 / 37931621010. This is historical CI, not a new v0.6 result.

All 213 remote blobs were compared by Git blob SHA against the available local source: exact parity. Reviewed core/graph/schema, CPO schema/model, chapter3/app, campaign storage/entry, traffic solver, shell/build, tests/fixtures, workflow and five v0.5 guides. Original engineering files and all older distributions stay frozen; v0.6 is an additive entry/shell/adapter.

Current baseline deterministic execution: 329 PASS across 12 groups (logs in evidence/v06-baseline). Browser launch initially failed before any assertion: the old local Chromium executable was truncated (99 MB versus its original ELF section offset >209 MB). Reconstruct browser from the installed compressed distribution; preserve initial diagnostics. Browser rerun and final totals will be recorded only after execution.

The optical compiler requires both Tx and Rx topology. Guided 800G fixture uses 8 fibers ×1 wavelength ×100 Gb/s, an external ELS boundary, and an independent RxSource with Unknown incoming power. Tx-only objectives are separate from the core 3.2T global objective; Rx power/margin are not silently qualified. M10/M11 use partial-stage gates plus core compiler path observables; only M12 permits full graph qualification. Workshop numbers are Educational Assumptions, not standards-derived specifications.

Sources inspected: supplied OIF Co-Packaging 3.2T Module IA pp7–9 and AI DC Connectivity technical report. These support external laser, driver and logical module boundaries only. No private organization facts or vendor-specific estimates are shipped in the game. Evanescent gap/CMT, BER/eye/EO response and calibration remain not modeled.
