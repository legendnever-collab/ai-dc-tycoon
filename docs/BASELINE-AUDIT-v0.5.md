# v0.5 Baseline Audit

2026-10-09. Authoritative repository: legendnever-collab/ai-dc-tycoon.

- main: 1e3cb63e7910ce90aab132bf5584ced2ac5d795d.
- v0.4 feature HEAD: c12149e985b207c5df50357ff7eb62a299fb813d.
- PR #2 open/draft, unmerged; its 37 feature commits are retained.
- v0.5 branch created from that exact feature HEAD. Its PR must target feature/v0.4-network-optics until PR #2 merges; main must not be modified automatically.
- v0.4 Actions runs 37909973850 and 37909967657: both completed success. CI covers 361 groups/checks, excluding both three-case distribution groups.
- Local source/build/test/doc files matched the authoritative source at the prior handoff. Build and deterministic baseline tests were run again at v0.5 start: 235 PASS. Browser/distribution re-verification is reported in REGRESSION-v0.5.md after execution, not assumed from the prior report.
- The previous /tmp browser runtime expired. Initial browser launch was NOT TESTED (missing executable); a restored runtime required Korean font configuration. These environment failures do not establish a game regression. Raw diagnostics are preserved outside source during development and summarized in final evidence.

Reviewed: Chapter1 core/schema/storage, Chapter2 state/graph/app/storage, traffic-solver, v0.4 architecture/design/catalog/regression/roadmap, build/package/CI. Frozen numerical fixtures and optical-engine hashes remain authoritative.

v0.5 design boundary: compare equal rates/traffic, calculate synthetic component power separately, assemble typed ASIC/OE/laser/output paths, use the existing deterministic traffic solver. Unknown optical physics remains Unknown. A deliberately declared educational compatibility fixture can support beginner game links, but is not a measured link budget.

Source context reviewed: OIF-Co-Packaging-3.2T-Module-01.0 pp7–9, OIF-ELSFP-02.0 pp9–10, OIF-EEI-COI-WP-01.0 pp14–17. These support functional boundaries and architecture distinctions, not the game's numerical presets. The attached AI DC Connectivity report reinforces workload/topology/PHY separation; internal organization details and vendor numbers are not embedded in the distributable game.

Final local re-verification at unchanged c12149 source: 367 PASS (240 preserved +127 v0.4 additions). All 15 group files and the summary are under evidence/v05-baseline. Initial font/runtime recovery also exposed one timing assertion failure in the original Backup notice test; no expectations or game source were changed, and the recovered full suite passed.
