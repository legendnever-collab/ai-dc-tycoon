# REGRESSION — AI Data Center Tycoon v0.3.0

2026-10-09 · Game Schema 1 · ai-dc-educational-1.0.0 · Advanced Lab 0.2.0 / Schema 2

개발 전 동일한 v0.2 회귀 122개(30+42+24+26)를 실행해 모두 PASS했다. 개발 후 원본 네 Test Script를 수정하지 않고 다시 실행해 122 PASS를 유지했다. Native Lab executable 및 16개의 Engineering source/test 파일은 기준 SHA-256과 일치한다.

| 검증 그룹 | PASS | FAIL | NOT TESTED |
|---|---:|---:|---:|
| Engineering / Legacy Golden | 30 | 0 | 0 |
| Engineering / Graph Golden | 42 | 0 | 0 |
| Engineering / Browser | 24 | 0 | 0 |
| Engineering / P2 Browser | 26 | 0 | 0 |
| Game / Golden | 65 | 0 | 0 |
| Game / Browser | 45 | 0 | 0 |
| Release / Integrity | 5 | 0 | 0 |
| Release / Distribution | 3 | 0 | 0 |

개발 후 실행된 독립 검증 항목 합계: **240 PASS / 0 FAIL**. 개발 전 122는 비교 기준이며 합계에 중복 가산하지 않는다. 반복 실행 역시 중복 가산하지 않는다. Game은 65 Golden + 45 Browser로 구분한다.

## 실행 환경과 범위

Chromium 153.0.8010.0 / Playwright / Linux Headless, file://, Offline context. Three.js WebGL은 ANGLE/SwiftShader software renderer에서 실행했다. Browser Runtime HTTP Request=0, Page Error=0, 예상치 못한 Console Error=0. WebGL getContext가 null인 별도 Context에서 Game/기존 Lab 2D/Physics를 검증했다. 1440px Desktop, 390px/320px Mobile viewport와 touch emulation을 사용했다. 실제 Android 실기기와 실제 GPU를 테스트한 결과가 아니다.

## 유지한 P0/P1/P2 기능

Gross/Net/Unit, Link Budget/Reference Plane, Driver/TIA/Laser Power, Passive Conservation, Typed Port/Graph Compiler, Tx/Rx/Channel Trace, 2D/3D Placement/Selection, Cosmetic vs Physical Routing, Undo/Redo, Schema1→2 Migration/Legacy 결과 동등성, Design/Geometry/Archive/Text Backup/LKG, Measurement Verification Gate를 기존 회귀로 확인했다. 기본 Golden은 3.2 Tb/s Gross, Net Unknown, Margin 5.8 dB, Power 17.81924197039502 W다.

Game HTML의 embedded Lab에서도 실제 Graph loss 수정→Margin 변경→Undo, 3D 생성, 저장·탭 전환·Reload, WebGL fallback을 별도로 검사했다. 기존 native v0.2에서 이름/Tx Fiber/Modulator loss를 저장한 후 새 게임 Lab에서 동일 Design/Graph/2800 Gb/s/4.3 dB/Head bytes를 확인했다. Game 미션 실행은 이 Engineering DB bytes를 변경하지 않았다.

## 새 Acceptance 결과

| 요구 | 결과 | 실행 증거 |
|---|---|---|
| M01–03 순차 Clear | PASS | Desktop/390px에서 UI로 진행, 실패/재도전/보상/다음 미션 |
| Locked Mission 진입 방지 | PASS | UI disabled + Core reject |
| 계산과 Hard Objective 연결 | PASS | 30/60/120s 통과, 120/300s 실패, Unknown 실패 |
| Compute만 증설한 Network 병목 | PASS | M03 2→3 Rack에서도 300s, Waiting 증가 |
| Upgrade 후 시간 개선 | PASS | 16→64 Gb/s, 300→120s |
| Credits 부족 구매 거부 | PASS | Core reject / UI disabled / 반환 후 예산 확보 |
| 최초 보상 1회 / Replay | PASS | Receipt 3개, XP500, 정상 경로 Credits340 유지 |
| Tech Gate / 미래 기술 | PASS | 잠긴 Rack/Switch 거부, Analyzer/Preview 해금, CPO PLANNED |
| Auto Resume / Pending Run | PASS | Reload 및 실제 Chromium process restart, 보상 중복 없음 |
| v0.2 데이터와 Regression | PASS | 122/122 + embedded Lab + Native 이전 Design bytes 보존 |
| Offline / WebGL Fallback | PASS | file:// Offline, zero Runtime HTTP, 강제 WebGL null |
| Desktop/Mobile 버튼 | PASS | 390/320px no overflow, 구매/배치/Run/Retry/Backup/Tech/Lab 접근 |
| Game Backup / LKG / stale tab | PASS | 손상/미래 App·Schema·Model 거부, 원본 보존, stale save 거부 |

M01의 첫 Fixture는 안내를 위해 성공 가능한 준비 구성이다. Clear 후 Replay에서 Rack을 Inventory로 이동해 Missing Compute/Unknown FAIL을 실제 실행하고 재배치로 복구했다. M02와 M03은 최초 진행에서도 실패·재도전을 실행했다. 수치는 Educational Fixture이며 실제 Benchmark 검증은 아니다.

## Beginner UX Gate

| Gate | 자동·시각 구조 검사 | 사람 대상 Usability |
|---|---|---|
| 첫 미션 시작 ≤3 주요 클릭 | PASS / 1클릭 시작, 2클릭 Run | NOT TESTED |
| 첫 화면 Engineering 사전 지식 불필요 | 한국어 Job/Rack 설명, Graph/Inspector 미노출 확인 | NOT TESTED |
| Objective 한눈에 표시 | PASS / 목표 시간과 Rack 수 카드 | NOT TESTED |
| Clear 보상·다음 행동 | PASS / Reward·Next·Unlock 표시 | NOT TESTED |
| 실패 이유·Retry | PASS / 병목 또는 Missing Input + 재도전 | NOT TESTED |

Screenshots 10장을 실제 Browser에서 생성하고 Desktop/모바일/Network 실패/Clear/Tech/Lab 화면을 시각 검토했다. 이러한 검사는 실제 초보자의 이해도 검증을 대신하지 않는다.

## NOT TESTED / 알려진 제한

실제 사람 Beginner Usability, 회사 PC 정책, Android 실기기, 실제 GPU WebGL, Safari/Firefox는 NOT TESTED다. file:// IndexedDB의 모든 Browser/Origin/프로필 호환을 보장하지 않는다. Game Backup은 Engineering Backup과 별도이며 이동 시 필요한 둘을 각각 보관한다. Scale-up/Storage/DC Power/Cooling/벤더 Benchmark/CPO Physics Mapping은 미구현이며 PASS 대상으로 주장하지 않는다. Pluggable은 학습 Preview, Bridge는 Interface-only다.

## 상세 실행 항목

아래는 실제 실행된 항목의 상태다. 기대 동작은 원본 Engineering Script에 그대로 남아 있으며 새 테스트는 별도 파일에 추가했다. 테스트가 확인한 그룹의 PASS를 실측 Evidence 등급으로 변환하지 않는다.

### Engineering / Legacy Golden

- PASS — Gross: 16 × 2 × 100 = 3200 Gb/s
- PASS — Net: Undefined efficiency stays Unknown
- PASS — Net: 0.94 defined efficiency = 3008 Gb/s
- PASS — Optical: 7.2 dB total, -4.2 dBm received, 5.8 dB margin
- PASS — Mission: baseline simulated pass, never measurement verified
- PASS — Mission: high score does not override power constraint
- PASS — Mission: Unknown required loss produces incomplete, no pass
- PASS — Passive gain rejected by design validation
- PASS — Unit mismatch rejected before solver
- PASS — Nonfinite / fractional fiber / zero efficiency rejected
- PASS — Ideal splitter reduces branch power by 10log10(N)
- PASS — Splitter source counting: 16 fibers / 4 fanout × 2λ
- PASS — Unused splitter branches: ceil(17 / 4) × 2λ
- PASS — Driver and TIA counts use separate Tx / Rx lanes
- PASS — Power unit: W / Gb/s × 1000 = pJ/bit
- PASS — Per-channel override changes worst margin only where specified
- PASS — Per-channel negative passive loss rejected
- PASS — Typed Port: compatible CW path accepted
- PASS — Typed Port: optical/electrical mismatch rejected
- PASS — Typed Port: CW/modulated mismatch rejected
- PASS — Typed Port: duplicate input and reversed direction rejected
- PASS — Typed Port: cycle rejected
- PASS — Determinism: same input / seed gives identical JSON; input not mutated
- PASS — Backup roundtrip includes archived design
- PASS — Backup corruption rejected
- PASS — Backup future schema and incompatible unit rejected
- PASS — Migration schema 0 fixture accepted; invalid migration rejected
- PASS — Evidence reviewed note is not numerical measurement verification
- PASS — No calibration from geometric proximity
- PASS — Unknown score dimensions do not get reweighted

### Engineering / Graph Golden

- PASS — Schema2 registry binds typed ports, units, models and geometry
- PASS — Common golden: native Graph equals migrated Legacy metrics
- PASS — Migration preserves all 27 inputs and original graph; source unchanged
- PASS — Legacy parity: split, unused branches, overrides, Unknown, power failure
- PASS — Schema1 backup and archives migrate with original provenance
- PASS — Unsupported legacy split stays Legacy; approximate graph cannot PASS
- PASS — Common graph multi-branch split parity including incomplete final group
- PASS — Actual FAU allocation drives bandwidth independently of global display
- PASS — Graph WDM allocation and coding efficiency preserve units
- PASS — Tx/Rx allocation is separate; unknown incoming Rx never fabricated
- PASS — Loss custom edit affects only declared stage
- PASS — Reference plane ledger identifies actual splitter output and node stage
- PASS — Missing optical connection fails compilation and mission
- PASS — Missing drive path fails despite complete optical path
- PASS — Rx TIA/interface missing fails topology
- PASS — Wrong kind, signal, flow and reversed port rejected
- PASS — Duplicate source fanout and occupied target rejected
- PASS — Cycle detected both during connect and compilation
- PASS — Unreachable engineering component blocks PASS; mechanical allowed
- PASS — Duplicate fiber/wavelength allocation rejected
- PASS — Splitter conservation and unique source-group electrical power
- PASS — Passive negative IL, negative splitter excess, WPE zero rejected
- PASS — Cosmetic placement, dimensions and rotation leave all metrics unchanged
- PASS — Physical routing mm to cm and alpha maps only waveguide loss
- PASS — Declared polyline waypoint and physical-routing disabled fallback
- PASS — Missing physical anchor fails; cosmetic manual length stays usable
- PASS — Coupler proximity never calibrates coupling efficiency
- PASS — Unknown Tx allocation keeps topology valid but all aggregate Tx metrics Unknown
- PASS — Unknown branch allocation never reports partial known bandwidth
- PASS — Unknown Rx allocation makes total power unknown independently of Tx
- PASS — Unknown loss and efficiency never inferred from visual path
- PASS — Dependency list maps actual global/custom changes to channels
- PASS — Deterministic result, compiler hash, unchanged input and fixed seed
- PASS — SHA-256 exact UTF8 vectors including Korean and long strings
- PASS — Schema2 backup preserves graph, geometry, version, archive and undo
- PASS — Undo/Redo snapshot restores physical mode, topology and numerical inputs
- PASS — Malformed units, duplicate IDs, typed-port tampering and undo rejected
- PASS — Native corrupted/future-schema backup rejected without input mutation
- PASS — Multipart backup roundtrip accepts reordered complete parts
- PASS — Multipart missing/duplicate/tampered parts rejected
- PASS — Evidence on global parameters cannot certify custom unreviewed models
- PASS — Invalid Graph cannot pass even Sandbox or high global scalar metrics

### Engineering / Browser

- PASS — file:// offline startup: JS solver and IndexedDB available
- PASS — Parameter editing and mission fail visibly update
- PASS — Save / reload / auto resume preserves design and revision
- PASS — Template challenge: arithmetic 3.2T + assumptions warning
- PASS — Text backup contains current and archived revisions
- PASS — Paste restore success applies complete saved inputs
- PASS — Restore corruption rollback preserves current state
- PASS — Unknown coding efficiency and loss are never PASS values
- PASS — Invalid passive loss kept out of active physics state
- PASS — Channel override controls worst-link fail
- PASS — Before / after comparison captures independent result
- PASS — Evidence never grants Measurement Verified label
- PASS — Report contains version/model/input/seed/channel trace
- PASS — Corrupt head automatically recovers LKG on reload
- PASS — Schema 0 paste migration succeeds
- PASS — Sandbox remains separate from campaign pass
- PASS — Same file path in a second browser page auto resumes
- PASS — Concurrent stale tab cannot overwrite newer head
- PASS — Restoring and editing older branch preserves all prior snapshots
- PASS — Browser runtime errors / network request count = zero
- PASS — 390px mobile: no viewport overflow and all controls reachable
- PASS — 320px compact viewport keeps actions and inspector accessible
- PASS — IndexedDB failure is visible and text backup still works
- PASS — Same profile survives actual Chromium process restart

### Engineering / P2 Browser

- PASS — Real WebGL2 Three.js draws bundled offline scene
- PASS — 2D selection synchronizes Inspector and 3D selection
- PASS — Component edit drives physics, delta and Undo/Redo
- PASS — Library orphan blocks mission; delete, undo and redo work
- PASS — Delete and click-to-connect bypass changes actual path loss
- PASS — Wrong signal port reports endpoints and preserves graph
- PASS — 2D zoom, pan, fit and node drag preserve physics
- PASS — Tx/Rx trace follows separate channels and loss annotations
- PASS — Build a complete Tx/Rx engine from empty Graph using Library and ports
- PASS — 2D drag-to-connect reconnects actual typed port
- PASS — 3D raycast selection synchronizes 2D and Inspector
- PASS — 3D rotate, zoom and right-drag pan modify camera only
- PASS — 3D Move tool updates mm geometry with Cosmetic metrics unchanged
- PASS — Mechanical Library placement is visible in 3D and preserves physics
- PASS — Physical Routing maps declared anchors and flags missing anchor
- PASS — Graph, geometry, undo and selection persist after reload
- PASS — Multipart backup UI roundtrip retains complete graph
- PASS — Report includes mode, compiler hash, reference planes and model versions
- PASS — Missing native Head restores Last-Known-Good instead of fresh design
- PASS — 390px mobile click-to-connect compiles actual Optical Path
- PASS — 390/320px mobile placement, undo/redo, split and Inspector accessible
- PASS — WebGL disabled retains working 2D, solver and persistence
- PASS — Automatic Schema1 DB migration preserves metrics, archives and original DB
- PASS — Legacy Graph activation parity and original Rollback work
- PASS — Future-schema native head remains unchanged after rejected save
- PASS — All native flows execute offline with zero runtime error or HTTP request

### Game / Golden

- PASS — New Game resources / stable hardware / states
- PASS — Fixture M01 / 1 racks / 16 Gb/s
- PASS — Fixture M02 / 1 racks / 16 Gb/s
- PASS — Fixture M02 / 2 racks / 16 Gb/s
- PASS — Fixture M03 / 2 racks / 16 Gb/s
- PASS — Fixture M03 / 3 racks / 16 Gb/s
- PASS — Fixture M03 / 2 racks / 64 Gb/s
- PASS — Fixture M03 / 3 racks / 64 Gb/s
- PASS — Fixture M03 / 4 racks / 64 Gb/s
- PASS — Locked Mission cannot start
- PASS — Locked Rack cannot purchase
- PASS — Locked Switch cannot upgrade
- PASS — Run requires ACTIVE
- PASS — Mission 01 clear rewards / next unlock / level
- PASS — Mission01 missing Compute fails / repair / no duplicate reward
- PASS — Prediction does not clear mission or award
- PASS — Mission 02 fail then retry state
- PASS — Purchase creates Inventory and charges Credits
- PASS — Unplaced inventory survives backup
- PASS — Placement activates capacity / halves independent completion
- PASS — Occupied Slot rejects without mutation
- PASS — Slot out of range rejected
- PASS — Unknown Inventory rejects
- PASS — Only one pending placement allowed
- PASS — Mission 02 rewards / switch unlock exact
- PASS — Compute only cannot cure network bottleneck
- PASS — Network Upgrade improves 300→120 seconds
- PASS — Network goal cannot pass with high score
- PASS — Insufficient credits purchase refusal
- PASS — Insufficient Switch budget refusal
- PASS — Refund restores budget without duplicate cash
- PASS — Starter Rack cannot refund
- PASS — Hardware IDs are never reused after refund
- PASS — Move conserves economy / selected slot capacity
- PASS — Floor location does not affect numerical result
- PASS — Pending run freezes hardware and mission
- PASS — Same input / seed yields identical result and hash
- PASS — Pure command leaves original state intact
- PASS — Completion grants all rewards once / level4 / Analyzer
- PASS — Replay never duplicates Credits / XP / receipts
- PASS — Duplicate finish cannot award twice
- PASS — Overspending trades Stars for time
- PASS — Hints reveal progressively and cap at3
- PASS — Full profile backup exact round trip
- PASS — Pending simulation backup can finish deterministically
- PASS — Unknown Compute input is Unknown and never passes
- PASS — No placed racks produces Unknown
- PASS — Zero Network does not divide by zero
- PASS — Independent jobs ignore Network capacity
- PASS — Scale-up unsupported returns Unknown
- PASS — Storage I/O unsupported returns Unknown
- PASS — Wrong workload fabric refuses numerical result
- PASS — Invalid fixture ranges / NaN / negative rejected
- PASS — Unknown Network input stays Unknown
- PASS — Wrong simulator Model Version rejected
- PASS — Backup integrity corruption rejected
- PASS — Future Game Schema rejected preserving input text
- PASS — Engineering Backup never coerced into Game Schema
- PASS — Duplicate reward receipt rejected
- PASS — Forged credits / XP / tech unlock rejected
- PASS — Forged numerical result rejected
- PASS — Forged hardware provenance cannot reward
- PASS — Inventory duplicate / collision rejected
- PASS — Award presentation must match actual reward
- PASS — Engineering bridge is reference-only and not simulator input

### Game / Browser

- PASS — Offline file startup / Game World default / novice framing
- PASS — Locked Missions inaccessible before progression
- PASS — First Mission enters ACTIVE in one major click
- PASS — Second click runs deterministic Job with visible progress
- PASS — Mission01 clear first reward / next action visible
- PASS — Mission01 replay can fail missing Compute / repair without reward duplication
- PASS — Mission02 independent 120s baseline / next unlock
- PASS — Actual Mission02 failure / no reward / retry explanation
- PASS — Purchase is inventory until floor placement
- PASS — Click-to-place changes capacity / immediate time delta
- PASS — Select and relocate Rack through interactive Floor
- PASS — Mission02 clear unlocks Switch with exact economy
- PASS — Mission03 enters distributed Network bottleneck
- PASS — Actual GPU Waiting animation / Network failure retry
- PASS — Adding Compute alone leaves 300s / waiting increases
- PASS — Refund is real economy / permits cost optimization
- PASS — Switch Upgrade 16→64 reduces 300→120s / cost180
- PASS — All Missions clear sequentially / Analyzer unlock /3 Stars
- PASS — Replay reward duplicate prevention through real controls
- PASS — Tech Tree persistent unlock / planned scope / learning preview
- PASS — Game Text Backup captures World / reward ledger / model version
- PASS — Invalid Backup rejected without state modification
- PASS — Backup restore recovers inventory / Stars / tech / Credits
- PASS — Save and reload auto resumes game progress
- PASS — Insufficient Credits disables purchase / upgrade access
- PASS — Advanced Lab uses original graph and solver in embedded UI
- PASS — Embedded graph edit still drives margin and Undo
- PASS — Game changes never overwrite Engineering DB bytes
- PASS — Lab preserves state across tab switch and actual reload
- PASS — Corrupted Game Head restores LKG and preserves raw original
- PASS — Explicit LKG rollback retains prior snapshot
- PASS — Stale tab cannot overwrite new head
- PASS — Future schema head is preserved / no automatic overwrite
- PASS — Unknown App / Model versions remain read-only including semver0.10
- PASS — Pending Simulation resumes after reload / no double reward
- PASS — Engineering backup handled separately with explicit instruction
- PASS — Pre-existing native v0.2 Design / Graph / DB preserved when entering new Game
- PASS — IndexedDB denied shows save failure and still permits text backup
- PASS — WebGL unavailable: World / physics / Advanced2D remain functional
- PASS — 390px mobile first World / no horizontal overflow
- PASS — Mobile full Mission01–03 / tap placement / retry / rewards
- PASS — 320px all progression / backup / Tech buttons reachable
- PASS — Mobile lab switch / return and own scrolling accessible
- PASS — Zero runtime network / page errors / unexpected console errors
- PASS — Real Chromium process restart preserves game progress

### Release / Integrity

- PASS — 16 original Engineering source / test files retain exact baseline bytes
- PASS — Embedded and native Lab executable retain authoritative SHA-256
- PASS — Release / package / game / DC Model versions agree with separate Engineering version
- PASS — Single HTML includes all code / CSS and blocks remote runtime resources
- PASS — Game module import direction does not couple Solver to rendering or Lab graph

### Release / Distribution

- PASS — Source ZIP clean offline rebuild produces byte-identical final HTML
- PASS — Distribution HTML executes all3 Missions offline with exact results and rewards
- PASS — All3 ZIP archives pass CRC and contain correct executable/source/docs/screenshot inventory

