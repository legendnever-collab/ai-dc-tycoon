# Optical Engine Tycoon — P3 Physics Expansion Plan

Baseline: **v0.2.0 / Schema2 / graph-compact-1.0.0 / graph-compiler-1.0.0**. 이번 Release는 P2 완료입니다. 아래 P3 구현은 사용자 승인 후 Incremental Upgrade로 시작하며 현재 구현 기능을 뜻하지 않습니다.

## P3.0 — Baseline / Model Contract

- v0.2의 Golden72 / Browser50을 먼저 실행하고 실행 파일·Source·evidence hash를 보존합니다.
- Model API를 `inputs + units + conditions + validity + fidelity + evidence → deterministic result + diagnostics + provenance`로 구체화합니다. Registry별 Model Version을 별도로 관리하고 nominal numerical model과 calibrated/measurement 결과를 구분합니다.
- Schema2 design을 loss-only compatibility mode로 보존합니다. 새로운 wavelength/temperature/modulation inputs는 자료가 없으면 null이며 기존 metrics를 임의로 변경하지 않습니다. Schema 변경이 필요하면 Schema3, source snapshot/LKG/archive/rollback fixtures를 먼저 구현합니다.
- Rate는 Gb/s, EO bandwidth는 GHz로 구분합니다. NRZ/PAM4 symbol rate/coding/FEC 효율의 조건을 explicit metadata로 다루고 lane rate만으로 EO applicability를 추정하지 않습니다.

완료 gate: 기존122 tests 유지, ModelInterface unit/range/unknown validation, mode/version/hash 추적, Schema2→새 Schema fixture와 rollback.

## P3.1 — Wavelength / Tx-Rx Budget Expansion

입력: Channel wavelength nm 또는 Unknown, source launch/reference plane, WDM grid metadata, 검증된 경우만 MUX/DEMUX 또는 receiver compact data, Tx/Rx 독립 remote boundary conditions.

구현: 현재 FAU virtual λ slot을 actual wavelength와 연결할 수 있는 Channel identity layer, Rx incoming power를 independent solver path로 유지, Channel별 loss ledger/측정 plane/applicability 표시. 외부 자료를 paste-first compact table로 import하고 format/units/model evidence를 검증합니다. Raw measurement는 계산 모델에 자동 인증을 부여하지 않습니다.

완료 gate: WDM Channel identity/Tx-Rx separation/Unknown wavelength/reference-plane fixtures, same physical penalty의 중복 적용 방지, passive transmission 0–1, 기존 loss-only graph numerical equality, wavelength sweep은 validated model range에서만 생성.

## P3.2 — Parameterized MZM / EAM

공통 입력: 지정 IL/ER/EO bandwidth, device temperature/reference condition, driver swing/power, modulation format와 applicability metadata. MZM은 Vπ, VπL, length의 단위/조건; EAM은 supplied bias/absorption curve 또는 compact coefficients. 자료가 없으면 해당 response Unknown.

구현: 검증 가능한 Simplified/Parameterized device response와 validity range를 Registry에 추가합니다. VπL의 길이 단위와 bias convention을 명시합니다. Dynamic device power는 검증 가능한 capacitance/switching/driver assumptions가 확보된 Model에만 계산하며 기존 W/Lane planning model을 별도 선택으로 유지합니다. 숫자를 제시할 Model이 없으면 지정 IL과 power만 계산합니다.

완료 gate: analytical unit/golden fixtures, valid-range boundaries, MZM/EAM model swap, unavailable coefficient Unknown, driver/device power 중복 방지, uncalibrated label 유지. **BER/Eye/TDECQ는 검증된 전용 모델과 근거를 확보하기 전 생성하지 않습니다.**

## P3.3 — Lumped Thermal Model

입력: ambient °C, dissipated power W의 scope, Rth K/W, reference temperature, 검증된 dλ/dT·dIL/dT·dVπ/dT 등의 coefficients와 적용 범위.

구현: Tdevice=Tambient+Rth×Pdissipated. Package 총 전력을 모든 Device에 중복 적용하지 않도록 association과 thermal boundary를 명시합니다. 수치가 있으면 laser wavelength/modulator/검증된 coupler response에 전달하고 부족하면 Unknown입니다. 전력/온도 feedback을 도입할 때 convergence criteria/max iteration/failure diagnostics를 deterministic하게 정의합니다. 현재 TIM envelope를 자동 Rth로 바꾸지 않습니다.

완료 gate: single-node thermal analytical fixtures, Rth=0/Unknown/boundary tests, dimension consistency, explicit power association, temperature validity, deterministic convergence/failure, optical loss coupling의 dependency graph 검증. Geometry→CMT/gap/warpage는 P4로 유지합니다.

## P3.4 — Sweep / Failure Analysis / Release

- 단일/두 Parameter의 deterministic sweep을 지원하되 모델 validity 밖은 결과를 제외하고 이유를 표시합니다. 파장/온도 sweep과 comparison을 Source Model/Evidence/Input에 연결합니다.
- Failure Analysis는 unsupported/unknown/constraint violation을 구분합니다. Contextual Hint는 계산 결과/감도에서 설명하며 수치 Solver를 AI로 대체하지 않습니다.
- Native Graph/Geometry/Model assignments/Undo/Archive/Text Backup/Offline/WebGL fallback의 전체 회귀를 실행합니다. Mobile에서 parameter units/validity/unknown diagnostics가 읽히도록 검증합니다.
- v0.3 실행HTML/source/HANDOFF/screenshots/regression/model registry/fixtures/guide를 version-consistent하게 배포합니다. 실회사PC/Android실기기 테스트는 확보한 실제 evidence가 있을 때만 PASS로 변경합니다.

## P3 Gate / 후속 범위

| Gate | Required evidence |
|---|---|
| Non-regression | v0.2 122 tests + 모든 기존 numerical fixture |
| Device | independently calculated golden/units/validity/Unknown/driver budget |
| Optical | per-wavelength Tx/Rx/planes/passive checks/trace |
| Thermal | independent lumped fixtures/explicit associations/feedback failure |
| Storage | migration/LKG/rollback/archives/graph-model restore |
| Fidelity | Uncalibrated≠Measurement Verified; model registry provenance |
| Runtime | offline/browser/mobile/fallback, 실제 실행 여부 구분 |

P4: analytical CMT와 validated gap/offset→κ mapping, correlated16ch assembly Monte Carlo/yield/CI/replay. P5: campaign00–06/Pareto multi-objective optimization. P6: formal evidence/requirements/PoC/reliability/measurement verification. P3에서 이 후속 기능을 검증된 것처럼 구현하지 않습니다.
