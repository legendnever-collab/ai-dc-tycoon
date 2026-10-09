# Regression — v0.6

Current completed GitHub Actions run: [37940618307](https://github.com/legendnever-collab/ai-dc-tycoon/actions/runs/37940618307), source `4bd849464b0615c74bf7739e96d67f7816a98160`. All four jobs passed: Node384, preserved Browser126 distinct checks, CPO Browser57, Workshop Browser41 = **608 distinct checks / 0 FAIL**. The preserved Browser log prints its 24 Engineering checks twice; these repetitions are not counted as additional checks. Historical v0.5 submission518 local /509 CI is not a v0.6 rerun result.

Final candidate adds one source/test hash-parity check covering every original Chapter01–03 file. Its local integrity group is7 PASS; the final candidate therefore contains609 CI checks. Final run provenance is supplied separately in `evidence/v06/release-verification.json` after the candidate finishes. No expected physical values or old tests were changed.

Fresh baseline source:213 blobs match9ba593f993994c79a2814f3493cdab38b4167675. Existing deterministic12groups:329PASS. Initial Browser launch failed on a truncated old Chromium; reconstructed installed Chromium153. Several original fixed-time harnesses then failed simulation/dialog/screenshot timing. Original source/physical expected values stayed unchanged; raw logs in evidence/v06-baseline.

New local deterministic suites: Adapter Golden16 PASS, Mission Golden20 PASS, Protected Storage Golden16 PASS, source/executable integrity7 PASS. Combined with the329 baseline checks this is388 PASS. New CI Browser groups: Desktop14, touch390/320px7, actual IndexedDB12, preserved campaign/Lab8 =41 PASS. Raw CI pass lines and their source/run identity are in evidence/v06. Local browser attempts remain partial with explicit timing failures; they are not presented as a local full-suite pass. Source ZIP clean rebuild, archive CRC and manifest parity are independently recorded in `distribution-results.json`.

Hard gates: original source/executable hash parity; original3.2T fixture; guided800G parity; missing ELS/Driver; typed port rejection; active-path loss/unknown propagation; channel/ref-plane/unit consistency; no duplicate Laser power; no automatic Network bonus; independent OE state; sequential receipts/first rewards; v05 migration;4-head restore/corrupt/future/concurrency protection; offline HTTP0;320/390px actual control actions; clean rebuild.

Human usability, physical mobile devices and real hardware qualification are NOT TESTED. Screenshot inspection is visual QA only.
