# REGRESSION — Optical Engine Tycoon v0.2.0

Release0.2.0 / Schema2 / Graph Model graph-compact-1.0.0 / Legacy analytical-link-1.0.0 / Compiler graph-compiler-1.0.0.

**실행 결과**: **122 PASS / 0 FAIL**. 아래 실제 실행한 Golden/Browser cases만 PASS로 표시합니다. 회사 PC/Android 실기기/Hardware GPU는 NOT TESTED입니다.

## Execution evidence

- 개발 전 원본 Baseline: Golden30 / Browser24 전부 PASS. 소스 변경 없이 실행했고 evidence/baseline-v01에 보존합니다.
- 개발 후: Legacy Golden30 / P2 Golden42 / 기존 Browser24 / P2 Browser26. Strict TypeScript build PASS. Source ZIP을 깨끗한 디렉터리에 풀고 재빌드하여 배포 HTML SHA-256이 동일함을 확인했습니다.
- 실제 Linux Chromium 153.0.8010.0, Node24.19.0, Playwright. file:// origin, context.setOffline(true), software WebGL2/Three.js0.180.0 실제 렌더링. Runtime page errors0, HTTP requests0.
- Desktop1600×1100/1440×1100, Mobile emulation390×844/320×720. viewport emulation을 Android 실기기 검증으로 주장하지 않습니다.
- IDB save/reload/auto resume, 실제 Chromium process restart, old DB import/원본 불변, native missing/corrupt head LKG, future-schema read-only, stale-tab guard, text/multipart/archive restore를 실행했습니다.
- Empty Graph에서 Library로 Tx/Rx component를 조립/연결하여 실제 유효3200Gbps/9.8dB 설계를 만들었습니다. WG 삭제→MUX/Bend 재연결은 실제 Path loss를0.2dB 줄여 Margin5.8→6.0dB로 바꿨습니다.
- Three.js raycast selection/Orbit rotate·zoom·pan/Move drag와 InspectorXYZ, 선택 sync를 검증했습니다. WebGL disabled context에서2D/solver/storage도 검증했습니다.

HTML SHA-256: `cf7cf6df5d83cc3927d3fb5cef2a320aa507c5c58a6e5d264cedc5c9d5c7947a`. Machine-readable 결과는 TEST-MATRIX.json과 evidence JSON/log에 포함합니다.

## Numerical parity / changed test harness

| Metric | Legacy / migrated Legacy / default Graph |
|---|---|
| Tx Gross | 3200Gb/s |
| Rx Gross | 3200Gb/s |
| Net | Unknown without efficiency |
| Received | -4.2dBm |
| Margin | 5.8dB |
| Total Power | 17.81924197039502W |
| Mission | SIMULATED PASS — never measurement verified |

Native default equality는 exact value로, multi-branch summation은 floating arithmetic1e-9 tolerance로 검증합니다. Schema1 Migration은 모든 scalar inputs/original graph/archive를 보존하고 Legacy Mode로 계산합니다.

Golden30의 기대를 바꾸지 않고 require path만 preserved legacy-core/legacy-storage로 변경했습니다. P2 native cases는 별도42 Golden입니다. Browser24는 version/filename/native DB/active graph-model assertion만 변경하고 기존 numerical/UI/storage/mobile 기대를 유지했습니다. v0.1 original tests/fixtures와 개발 전 실행은 authoritative source 및 baseline evidence로 보존합니다.

## P2 Acceptance mapping

| Gate | Status / evidence |
|---|---|
| Typed Graph/Port/missing/cycle/duplicate | PASS — Golden, empty build, invalid port and missing-path browser |
| Passive power conservation | PASS — explicit branch loss/transmission/source-group golden |
| Cosmetic Geometry independence | PASS — numerical golden and real3Dmove browser |
| Physical Routing mapping | PASS — mm→cm polyline golden,3D/Inspector anchor loss browser |
| Schema1→2 / archive / original / rollback | PASS — golden and actual file-origin IDB browser |
| Graph/Geometry/selection/Undo persistence | PASS — backup and file reload browser |
| 2D Undo/Redo/drag/select/connect/zoom/pan/fit | PASS — interactive browser |
| Mobile click-to-connect / scroll | PASS — emulated390/320px, physical Android NOT TESTED |
| Offline / WebGL fallback | PASS — local file with network disabled, external requests0 |
| Measurement verification gate | PASS — uncalibrated stays simulated; no Verified promotion |

## Individual cases

### Retained Legacy Golden — 30 PASS

- **PASS** Gross: 16 × 2 × 100 = 3200 Gb/s
- **PASS** Net: Undefined efficiency stays Unknown
- **PASS** Net: 0.94 defined efficiency = 3008 Gb/s
- **PASS** Optical: 7.2 dB total, -4.2 dBm received, 5.8 dB margin
- **PASS** Mission: baseline simulated pass, never measurement verified
- **PASS** Mission: high score does not override power constraint
- **PASS** Mission: Unknown required loss produces incomplete, no pass
- **PASS** Passive gain rejected by design validation
- **PASS** Unit mismatch rejected before solver
- **PASS** Nonfinite / fractional fiber / zero efficiency rejected
- **PASS** Ideal splitter reduces branch power by 10log10(N)
- **PASS** Splitter source counting: 16 fibers / 4 fanout × 2λ
- **PASS** Unused splitter branches: ceil(17 / 4) × 2λ
- **PASS** Driver and TIA counts use separate Tx / Rx lanes
- **PASS** Power unit: W / Gb/s × 1000 = pJ/bit
- **PASS** Per-channel override changes worst margin only where specified
- **PASS** Per-channel negative passive loss rejected
- **PASS** Typed Port: compatible CW path accepted
- **PASS** Typed Port: optical/electrical mismatch rejected
- **PASS** Typed Port: CW/modulated mismatch rejected
- **PASS** Typed Port: duplicate input and reversed direction rejected
- **PASS** Typed Port: cycle rejected
- **PASS** Determinism: same input / seed gives identical JSON; input not mutated
- **PASS** Backup roundtrip includes archived design
- **PASS** Backup corruption rejected
- **PASS** Backup future schema and incompatible unit rejected
- **PASS** Migration schema 0 fixture accepted; invalid migration rejected
- **PASS** Evidence reviewed note is not numerical measurement verification
- **PASS** No calibration from geometric proximity
- **PASS** Unknown score dimensions do not get reweighted

### P2 Golden — 42 PASS

- **PASS** Schema2 registry binds typed ports, units, models and geometry
- **PASS** Common golden: native Graph equals migrated Legacy metrics
- **PASS** Migration preserves all 27 inputs and original graph; source unchanged
- **PASS** Legacy parity: split, unused branches, overrides, Unknown, power failure
- **PASS** Schema1 backup and archives migrate with original provenance
- **PASS** Unsupported legacy split stays Legacy; approximate graph cannot PASS
- **PASS** Common graph multi-branch split parity including incomplete final group
- **PASS** Actual FAU allocation drives bandwidth independently of global display
- **PASS** Graph WDM allocation and coding efficiency preserve units
- **PASS** Tx/Rx allocation is separate; unknown incoming Rx never fabricated
- **PASS** Loss custom edit affects only declared stage
- **PASS** Reference plane ledger identifies actual splitter output and node stage
- **PASS** Missing optical connection fails compilation and mission
- **PASS** Missing drive path fails despite complete optical path
- **PASS** Rx TIA/interface missing fails topology
- **PASS** Wrong kind, signal, flow and reversed port rejected
- **PASS** Duplicate source fanout and occupied target rejected
- **PASS** Cycle detected both during connect and compilation
- **PASS** Unreachable engineering component blocks PASS; mechanical allowed
- **PASS** Duplicate fiber/wavelength allocation rejected
- **PASS** Splitter conservation and unique source-group electrical power
- **PASS** Passive negative IL, negative splitter excess, WPE zero rejected
- **PASS** Cosmetic placement, dimensions and rotation leave all metrics unchanged
- **PASS** Physical routing mm to cm and alpha maps only waveguide loss
- **PASS** Declared polyline waypoint and physical-routing disabled fallback
- **PASS** Missing physical anchor fails; cosmetic manual length stays usable
- **PASS** Coupler proximity never calibrates coupling efficiency
- **PASS** Unknown Tx allocation keeps topology valid but all aggregate Tx metrics Unknown
- **PASS** Unknown branch allocation never reports partial known bandwidth
- **PASS** Unknown Rx allocation makes total power unknown independently of Tx
- **PASS** Unknown loss and efficiency never inferred from visual path
- **PASS** Dependency list maps actual global/custom changes to channels
- **PASS** Deterministic result, compiler hash, unchanged input and fixed seed
- **PASS** SHA-256 exact UTF8 vectors including Korean and long strings
- **PASS** Schema2 backup preserves graph, geometry, version, archive and undo
- **PASS** Undo/Redo snapshot restores physical mode, topology and numerical inputs
- **PASS** Malformed units, duplicate IDs, typed-port tampering and undo rejected
- **PASS** Native corrupted/future-schema backup rejected without input mutation
- **PASS** Multipart backup roundtrip accepts reordered complete parts
- **PASS** Multipart missing/duplicate/tampered parts rejected
- **PASS** Evidence on global parameters cannot certify custom unreviewed models
- **PASS** Invalid Graph cannot pass even Sandbox or high global scalar metrics

### P0/P1 Browser Regression — 24 PASS

- **PASS** file:// offline startup: JS solver and IndexedDB available
- **PASS** Parameter editing and mission fail visibly update
- **PASS** Save / reload / auto resume preserves design and revision
- **PASS** Template challenge: arithmetic 3.2T + assumptions warning
- **PASS** Text backup contains current and archived revisions
- **PASS** Paste restore success applies complete saved inputs
- **PASS** Restore corruption rollback preserves current state
- **PASS** Unknown coding efficiency and loss are never PASS values
- **PASS** Invalid passive loss kept out of active physics state
- **PASS** Channel override controls worst-link fail
- **PASS** Before / after comparison captures independent result
- **PASS** Evidence never grants Measurement Verified label
- **PASS** Report contains version/model/input/seed/channel trace
- **PASS** Corrupt head automatically recovers LKG on reload
- **PASS** Schema 0 paste migration succeeds
- **PASS** Sandbox remains separate from campaign pass
- **PASS** Same file path in a second browser page auto resumes
- **PASS** Concurrent stale tab cannot overwrite newer head
- **PASS** Restoring and editing older branch preserves all prior snapshots
- **PASS** Browser runtime errors / network request count = zero
- **PASS** 390px mobile: no viewport overflow and all controls reachable
- **PASS** 320px compact viewport keeps actions and inspector accessible
- **PASS** IndexedDB failure is visible and text backup still works
- **PASS** Same profile survives actual Chromium process restart

### P2 Browser Acceptance — 26 PASS

- **PASS** Real WebGL2 Three.js draws bundled offline scene
- **PASS** 2D selection synchronizes Inspector and 3D selection
- **PASS** Component edit drives physics, delta and Undo/Redo
- **PASS** Library orphan blocks mission; delete, undo and redo work
- **PASS** Delete and click-to-connect bypass changes actual path loss
- **PASS** Wrong signal port reports endpoints and preserves graph
- **PASS** 2D zoom, pan, fit and node drag preserve physics
- **PASS** Tx/Rx trace follows separate channels and loss annotations
- **PASS** Build a complete Tx/Rx engine from empty Graph using Library and ports
- **PASS** 2D drag-to-connect reconnects actual typed port
- **PASS** 3D raycast selection synchronizes 2D and Inspector
- **PASS** 3D rotate, zoom and right-drag pan modify camera only
- **PASS** 3D Move tool updates mm geometry with Cosmetic metrics unchanged
- **PASS** Mechanical Library placement is visible in 3D and preserves physics
- **PASS** Physical Routing maps declared anchors and flags missing anchor
- **PASS** Graph, geometry, undo and selection persist after reload
- **PASS** Multipart backup UI roundtrip retains complete graph
- **PASS** Report includes mode, compiler hash, reference planes and model versions
- **PASS** Missing native Head restores Last-Known-Good instead of fresh design
- **PASS** 390px mobile click-to-connect compiles actual Optical Path
- **PASS** 390/320px mobile placement, undo/redo, split and Inspector accessible
- **PASS** WebGL disabled retains working 2D, solver and persistence
- **PASS** Automatic Schema1 DB migration preserves metrics, archives and original DB
- **PASS** Legacy Graph activation parity and original Rollback work
- **PASS** Future-schema native head remains unchanged after rejected save
- **PASS** All native flows execute offline with zero runtime error or HTTP request

## NOT TESTED / release limits

- **NOT TESTED** 회사 Windows PC / corporate security policy
- **NOT TESTED** Android 실기기 / touch GPU performance
- **NOT TESTED** Hardware GPU / Chromium 이외 Browser
- **NOT TESTED** 최대1000 Node/50MB Backup/장기 quota exhaustion
- **NOT TESTED** P3 Device/Thermal / P4 CMT·correlated variation·Monte Carlo / P5 Campaign·Pareto — 미구현

Known model/UI/storage limits는 HANDOFF의 KNOWN-ISSUES.md에 명시합니다. 실행하지 않은 항목은 PASS로 승격하지 않았습니다.
