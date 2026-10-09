# REGRESSION — v0.4.0 Chapter 2 Candidate

## Authoritative baseline
GitHub branch: `feature/v0.4-network-optics`. Starting HEAD: `1e3cb63e7910ce90aab132bf5584ced2ac5d795d`.
Prior v0.3 report claimed 240 PASS, comprising 30 Legacy Golden, 42 Graph Golden, 24 Engineering Browser, 26 Engineering P2 Browser, 65 Game Golden, 45 Game Browser, 5 Integrity and 3 Distribution. This is historical report evidence, not new verification.

## Newly executed and auditable through GitHub Actions
At commit `f3850223321447a697935f247032549f7e087680`, GitHub Actions successfully built both HTML bundles, ran the existing 30 Legacy, 42 Graph, 65 Game Golden and 5 Integrity tests, and ran `tests/chapter2-golden.cjs` successfully. Subsequent branch commits trigger the same workflow. For up-to-date workflow status, use GitHub Actions run records; do not treat this document as a live success claim.

The original Chapter 1 executable is built independently and retains its source. The original Optical Engine Lab v0.2 baseline SHA256 is checked during every Build and Integrity test.

## v0.4 Golden Coverage
- Mission 04 physical port availability, upgrade, connection limits, hard clear, reward once, refund/reset.
- Mission 05 Spine installation, disconnected path, asymmetric bottleneck rate and Compute-limited envelope.
- Mission 06 unsupported 1600G preset, dual-end compatibility, Fiber, 400G miss, 800G pass, cost/power trade-off.
- Credits/XP/reward receipt deduplication, deterministic result, backup SHA256/profile isolation.
- Test suite: `tests/chapter2-golden.cjs` (individual PASS/FAIL output in GitHub Actions logs).

## Browser and field-verification matrix
| Verification | Status at document creation |
|---|---|
| v0.4 offline HTML build | PASS in GitHub Actions |
| Existing Golden 30+42+65 / Integrity 5 | PASS in GitHub Actions |
| New Chapter 02 Golden | PASS in GitHub Actions |
| Legacy Browser 24 + 26 + 45 | NOT TESTED in current v0.4 CI run |
| New Chapter 02 Browser Smoke | IN PROGRESS; do not infer PASS before job concludes |
| Hardware Android 390/320 and corporate PC | NOT TESTED |
| Beginner human Usability | NOT TESTED |
| WebGL GPU / Safari / Firefox | NOT TESTED |

## Known issues
- The Chapter 02 runtime currently uses the fixed-path game-first `chapter2.ts`. An independent `network-model.ts` prototype was added to the branch and is not connected to this runtime; it needs a reconciled fidelity plan.
- Chapter 02 synthetic Watts are not real module measurements.
- Browser tests are required to accept completion, UI interaction and screenshots.
- v0.3 Backup and Chapter 02 Backup are separate texts; users must preserve both when moving profiles.
