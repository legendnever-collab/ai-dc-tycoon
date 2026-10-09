# P2 — Visual Builder Incremental Development Plan

Baseline: **Optical Engine Tycoon v0.1.0**. v0.1 HTML / source / fixtures / regression are authoritative. P2 구현은 사용자 승인 후 시작합니다. 이 문서는 구현 지시문이며 현재 Release의 기능을 뜻하지 않습니다.

## P2 목표

Parameter 기반 P1을 보존하면서 Component Library → 배치 → Typed Port 연결 → Graph Compile → Deterministic Result → 시각화의 첫 Builder를 추가합니다. 3D의 표현 품질보다 Netlist / Geometry Mapping / Undo / Persistence의 정확성을 우선합니다.

## P2.0 — Baseline Audit / Schema 2

- v0.1 Golden 30개와 Browser 회귀를 변경 없이 실행하고 결과를 보존합니다.
- Schema 2를 먼저 정의합니다. Tx/Rx direction, Channel grouping, Reference Plane, unit-bearing physical coordinates, routing segment, GeometryMode(cosmetic/physical), ParameterRef, ModelRef, EvidenceRef를 명시합니다.
- v1 Parameter-only Design을 Schema 2 `legacy-parameter` solver mode로 Migration합니다. 기존 Design의 Bandwidth / Margin / Power가 그대로 재현되어야 합니다.
- Migration 전에 LKG / 원본 Backup을 남기고, 검증 실패 시 Schema 1 원본을 보존합니다. Future Schema를 자동 해석하지 않습니다.
- Archive의 Branch ID는 강한 Content Hash 또는 UUID 기반으로 확장하고, Multipart Backup의 manifest / checksum / sequence를 설계합니다.

## P2.1 — Component Registry / Port Builder

| Component | 주요 Port / 역할 | P2 Numerical Model |
|---|---|---|
| ELS / Laser | optical CW output, λ grouping | 지정 Launch / WPE |
| Splitter | CW input, explicit N outputs | ideal split + excess loss |
| MZM / EAM | CW optical in, modulated out, electrical drive in | 지정 IL만; ER/Vπ/EO는 P3 |
| WG / Bend / Crossing | typed optical routing | length×alpha / declared bend / crossing loss |
| MUX / DEMUX | channel-dependent modulated ports | 지정 passive loss |
| Grating / Edge / Evanescent Coupler | matched optical interface | 지정 IL; coupled-mode는 P4 |
| FAU | named Tx/Rx fiber ports | routing / interface semantics |
| PD | modulated optical in, electrical analog out | sensitivity metadata; response P3 |
| Driver / TIA | electrical data/analog boundary | 지정 power per lane |
| Electrical Lane / Connector | electrical endpoints | connectivity only, impedance model P3 이후 |
| PIC / EIC / Package / PS / TIM | placement / boundary / thermal association | P2 geometry, thermal P3 |

- Port UI는 드래그 연결 / 클릭 Source → 클릭 Target의 두 방식 제공. 모바일에는 클릭 방식이 기본입니다.
- compatible Port만 하이라이트하고, Missing / duplicate / direction / kind / signal / cycle을 거부합니다.
- 미연결 필수 Port / Source가 없는 Net / 여러 Source / 같은 λ의 모호한 결합은 Compile Error 또는 INCOMPLETE입니다. 자동 PASS 금지.
- Splitter의 Branch와 WDM λ를 명확히 분리합니다. 독립 Source의 Power를 수치적으로 합산하려면 해당 모델을 명시합니다.

## P2.2 — 2D Schematic / Trace

- SVG-based editing surface: place, select, connect, delete, Undo / Redo, Fit / Zoom / Pan.
- Component 위치는 Logical Schematic Position이며 WG Length와 직접 연결되지 않습니다.
- Signal Trace는 선택 Net의 Tx 또는 Rx Chain을 따라갑니다. Power annotation은 Solver의 Channel별 Result를 사용합니다. 애니메이션 강도는 경로를 읽을 수 있는 수준으로 제한합니다.
- Source / Sink / Reference Plane / Channel ID를 Inspector에서 확인할 수 있어야 합니다.
- 320px / 390px 모바일에서 버튼이 화면 밖에 고정되어 진행을 막지 않게 합니다. 패널은 세로 Scroll, Next / Apply는 sticky 영역 또는 항상 접근 가능한 위치에 둡니다.

## P2.3 — 3D Placement

- Three.js를 사전 번들링한 단일 Offline HTML을 우선 검토합니다. CDN / loader remote URL / remote fonts 금지. License를 Source Package에 포함합니다.
- 모델링 대상: PIC / EIC / ELS / FAU / OE Package / Photonic Substrate의 개념적 배치와 단면. Device fabrication model을 추정하지 않습니다.
- Rotate / Zoom / Pan / select / place를 제공하되 WebGL 불가 시 2D Builder가 계속 작동해야 합니다.
- Cosmetic 배치 변경은 Physics Result를 변경하지 않습니다.
- Physical Routing Mode에서만 정의된 좌표와 단위로 WG Length를 계산합니다. 기존 수동 Length를 자동 덮어쓰지 말고 Mapping의 적용 상태를 표시합니다.
- Coupler Gap / Offset Mapping은 P4가 담당하며 P2에서는 Geometry Inspection만 합니다.

## P2.4 — Graph Compiler / Dependency Tracking

- Compiler는 Graph를 UI와 독립적으로 검증하고 Channel Path로 펼칩니다. Duplicated Loss, MUX/DEMUX reference-plane 중복, Splitter fanout energy conservation을 검사합니다.
- Parameter → Component Model → Channel Path → Metric / Constraint의 dependency list를 만듭니다. P2 초기에는 안전한 full re-solve를 사용하고, 부분 재계산 최적화는 결과 동등성이 확인된 뒤 추가합니다.
- Result는 Solver mode, compiled netlist hash, Model Versions, full Input, Seed를 보존합니다.
- Graph Solver의 16×2×100 fixture가 legacy-parameter solver와 동일한 Gross / Margin / Power를 재현해야 합니다.

## P2 Acceptance Gate

| Gate | 요구 검증 |
|---|---|
| Regression | v0.1 Golden / Browser 사례 유지 |
| Topology | Tx/Rx 별도 경로, Port 호환 / cycle / missing-source 자동 검증 |
| Passive conservation | Splitter 모든 Branch Power 합 ≤ Input, 음수 IL 거부 |
| Geometry independence | Cosmetic move/rotate 전후 결과 동일 |
| Geometry binding | physical routing length 변경 시 WG loss만 예측값만큼 변화 |
| Persistence | Graph / geometry / selected models / Undo base 저장 후 복원 |
| Backup | Schema 1→2 Migration, broken multipart rejection, rollback |
| Mobile | click-to-connect와 모든 Inspector / Apply 접근 가능 |
| Offline | file:/// 네트워크 차단 상태 시작, 외부 요청 0 |
| Fidelity | 아직 미검증 물리 결과를 Verified로 표시하지 않음 |

## P3–P6 Backlog 연결

- P3: MZM / EAM Parameterized Response, EO Bandwidth applicability, 별도 Tx/Rx physics, Lumped Thermal Rth / Device Temperature / Temperature coefficients.
- P4: 16ch Evanescent Coupling Model; κ/Δβ/length/loss를 명시한 Coupled-mode 식. Gap·Offset→κ는 독립 파라미터나 검증된 fit으로만 연결합니다. Geometry만으로 실물 Coupling을 추정하지 않습니다. Global offset / tilt / warpage와 Local variation을 분리한 seeded Monte Carlo, Yield CI, Worst Sample replay.
- P5: Campaign 00–06, Sweep / Pareto Explorer, Explainable Hint / Failure Analysis.
- P6: Evidence / Requirement Traceability, Verified state gate, PoC Spec / Report, Reliability Test Matrix, 장기 저장 / Multi-project / 대규모 Backup 검증.

특히 Mission 04의 16ch FAU-to-Photonic Substrate는 Corning 측 실제 Geometry / Wavelength / Index / κ fit / Δβ / loss / assembly distribution을 받은 뒤 Model을 검증합니다. 임의의 Model 값을 Corning 보증 스펙처럼 제시하지 않습니다.
