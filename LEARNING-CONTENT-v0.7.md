# Learning Content — v0.7

용어는 English, 설명은 한국어입니다. 모든 Learn 창은 아래 내용을 구조화해서 제공합니다.

## Chapter 1 — From Workload to Network Bottleneck

연산 장비를 늘리는 것만으로 AI 작업이 빨라지지는 않습니다. 작업이 계산과 통신 중 어디에서 기다리는지 먼저 확인합니다.

독립 작업과 Distributed Training의 데이터 이동량이 다르므로 같은 Rack 수에서도 병목이 달라집니다.

### Compute Capacity

단위 시간에 처리하는 교육용 Work Unit입니다. 독립 작업은 균등 분배가 가능할 때 Rack 수에 따라 처리시간이 줄어듭니다.

### Network Bottleneck

Distributed 작업의 시간은 계산과 데이터 전송 중 더 느린 구간에 제한됩니다. 본 게임은 T = max(W/C, W×ρ/B)를 사용합니다.

### Balanced Investment

예산을 많이 쓰는 선택이 항상 효율적이지 않습니다. Network가 막히면 Rack을 추가해도 완료시간이 바뀌지 않을 수 있습니다.

|Component|Role|
|---|---|
|AI Workload|연산량과 통신량|
|Compute Rack|계산 처리|
|Switch|데이터 교환|
|Job Result|시간과 대기|

|Term|Definition|
|---|---|
|WU|실제 GPU benchmark와 무관한 synthetic Work Unit.|
|Scale-out|여러 연산 자원을 Network로 연결해 작업을 확장하는 방식.|
|GPU Waiting|이 게임에서 Network 병목 때문에 사용하지 못하는 Compute 비율.|

What you learned: Compute와 Network를 함께 맞춰야 증설이 처리시간을 줄입니다.

Practice: Switch를 그대로 두고 Rack만 한 대 늘린 뒤 GPU Waiting과 완료시간을 비교하세요.

Next: Chapter 2에서 Switch port와 topology, Pluggable Optics를 직접 구성합니다.

Sources: Game DC model v1 · preserved synthetic workload fixture; AI DC Connectivity Technical Report (2026-09-05), system → network requirement structure

## Chapter 2 — Ports, Topology & Pluggable Optics

Switch 용량뿐 아니라 Port 수, 연결 방식과 Link capacity를 맞춰 Network를 구성합니다.

동일한 장비 목록도 연결하지 않거나 Port를 과하게 사용하면 실제 유효 경로가 달라집니다.

### Topology

어떤 Rack과 Switch가 연결되는지를 정의합니다. 모든 연결이 유효한지, 수요를 감당하는지 함께 확인해야 합니다.

### Pluggable Optics

Switch front panel에 장착하는 광통신 module입니다. 교체 편의성이 장점이며, ASIC에서 module까지의 전기 경로와 power가 trade-off입니다.

### Capacity ≠ Demand

400G / 800G는 본 게임의 nominal preset입니다. 전체 링크의 유효 capacity와 workload의 요구 대역폭을 구분합니다.

|Component|Role|
|---|---|
|Compute Rack|Traffic 발생|
|Switch Ports|연결 수 제한|
|Topology|경로 구성|
|Pluggable|광 전송|

|Term|Definition|
|---|---|
|Port|Link를 연결하는 논리적·물리적 interface.|
|Aggregate Capacity|정의된 경계에서 사용 가능한 링크 용량 합계. 항상 workload throughput과 같지는 않습니다.|
|Pluggable|분리해서 장착·교체할 수 있는 optical module.|

What you learned: Port, topology, capacity와 power의 경계를 함께 비교합니다.

Practice: 동일한 Traffic에서 400G와 800G preset의 필요 Port 수와 power를 비교하세요.

Next: Chapter 3에서는 Optics를 ASIC 가까이 옮기는 CPO를 Pluggable과 비교합니다.

Sources: Preserved Chapter 2 network model · all nominal power/cost presets are assumptions; OIF Co-Packaging Framework, OIF-Co-Packaging-FD-01.0 (supplied reference)

## Chapter 3 — Move Optics Closer

CPO는 Optical Engine을 Switch ASIC과 가까이 통합하여 전기 접속의 경계를 바꾸는 architecture입니다.

전력·front-panel density의 이익과 함께 조립, 검사, 열 관리, 정비성 문제가 생깁니다. 하나의 power 수치만으로 모든 상황의 우위를 정할 수는 없습니다.

### CPO Package

ASIC, 여러 OE, 전기 경로, 외부 ELS와 FAU를 연결하는 공동 package입니다. 광신호와 전기신호의 역할을 구분합니다.

### External ELS

Continuous Wave light를 공급하는 외부 Laser Source입니다. 광원 존재, OE 연결, 데이터 modulation은 서로 다른 상태입니다.

### Why 4 OEs?

이 게임의 3.2T educational fixture는 4 × 800G OE를 병렬로 사용합니다. 특정 vendor의 필수 구조가 아닙니다. OE-001을 기본 학습 엔진으로 열고 OE-002–004는 병렬 capacity 확장으로 봅니다.

|Component|Role|
|---|---|
|ASIC|Electrical Data|
|OE × 4|E/O 변환|
|External ELS|CW 공급|
|FAU|외부 Fiber 연결|

|Term|Definition|
|---|---|
|OE|Optical Engine. EIC와 PIC 등으로 전기·광 신호 변환을 수행하는 module.|
|ELS|External Laser Source. 여러 광학 경로에 CW light를 공급할 수 있습니다.|
|Known-Good|정의된 검증 범위에서 사전 확인된 상태. 본 게임의 simulated qualification은 실측 Known-Good 인증이 아닙니다.|

What you learned: 짧은 전기 경로의 이익을 package integration과 정비성 trade-off와 함께 판단합니다.

Practice: Package의 네 OE를 하나씩 열고 어느 OE의 설계와 simulation이 완료되었는지 비교하세요.

Next: Chapter 4에서 OE-001 내부의 Laser, Modulator, Waveguide, Coupler를 설계합니다.

Sources: OIF-Co-Packaging-3.2T-Module-01.0, §1.1: example modular CPO architecture; game 4 × 800G differs from its module architecture; OIF-ELSFP-02.0 · external laser interface reference; Game Chapter 3 CPO power ledger · synthetic fixture

## Chapter 4 — From CW Light to an Optical Link

빛이 있다고 데이터가 전달되는 것은 아닙니다. Driver와 Modulator, Waveguide와 Coupler를 연결한 뒤 수신 전력과 margin을 계산합니다.

Modulator, propagation, bend, coupling, fiber의 손실이 누적됩니다. 각 reference plane 사이의 loss를 한 번씩 세어야 합니다.

### CW → Modulation

ELS는 CW를 공급합니다. Electrical Driver가 Modulator를 구동하면서 데이터가 광신호에 실립니다.

### Link Budget

Received Power = Launch Power − ΣLoss. Link Margin = Received Power − Receiver Sensitivity. dB와 dBm의 의미를 구분합니다.

### Power Boundaries

Optical mW와 Laser electrical W는 같지 않습니다. Wall-plug Efficiency가 이를 연결합니다. Workshop diagnostic DC는 기존 Package ledger에 중복 추가하지 않습니다.

|Component|Role|
|---|---|
|ELS|CW Light|
|Driver + Modulator|데이터 인코딩|
|WG + Coupler|전달과 결합|
|Receiver|수신 전력 기준|

|Term|Definition|
|---|---|
|dB|전력 비의 로그 단위. insertion loss와 margin에 사용.|
|dBm|1 mW를 기준으로 한 절대 전력의 로그 단위.|
|MZM / EAM|광신호를 변조하는 방식. 본 게임은 고정 insertion loss와 연결만 모델링하고 EO bandwidth나 BER를 계산하지 않습니다.|

What you learned: 유효한 typed path와 충분한 margin을 모두 만족해야 합니다.

Practice: Short와 Long route의 propagation 및 bend loss를 비교한 뒤 Receiver Margin이 어떻게 바뀌는지 확인하세요.

Next: Chapter 5에서 완성한 OE의 빛을 Photonic Substrate와 FAU로 전달합니다.

Sources: Silicon Photonics Design: From Devices to Systems, Chrostowski & Hochberg (supplied book reference); Preserved Optical Core v0.2 / guided OE model v1 · uncalibrated analytical model

## Chapter 5 — The Photonic Substrate Challenge

Photonic Substrate는 OE와 Fiber 사이의 광경로와 계면을 기판 수준에서 다루는 접근입니다. OE-to-Substrate와 Substrate-to-FAU coupling을 각각 검증합니다.

OE와 FAU의 기능 분리는 배치·조립·검사상의 이익과 추가 광손실을 함께 가져옵니다. 광경로의 밀도와 정렬 요구를 같이 관리해야 합니다.

### Interface & Propagation

OE-to-PS loss, PS propagation / bend / crossing loss, PS-to-FAU baseline과 alignment loss, external fiber loss를 각 경계에서 한 번씩 계산합니다.

### Alignment & Pitch

lateral / vertical offset과 pitch mismatch가 channel별 loss를 바꿉니다. 같은 pitch mismatch라도 N이 커지면 가장자리의 displacement가 커집니다.

### Slow & Wide

800G를 8 × 100G 또는 16 × 50G로 비교할 수 있습니다. 낮은 per-lane rate는 채널 수, interface density와 조립 복잡도 증가를 동반합니다. 단순히 모든 경우의 저전력을 보장하지 않습니다.

|Component|Role|
|---|---|
|OE output|Modulated light|
|OE → PS|Input coupling|
|Substrate WG|Parallel routing|
|PS → FAU|Alignment + Fiber|

|Term|Definition|
|---|---|
|FAU|Fiber Array Unit. 여러 Fiber를 정해진 pitch와 위치로 정렬하는 구성.|
|Pitch Mismatch|FAU와 substrate channel 간격의 차이. 중앙을 맞춰도 edge-channel offset이 남을 수 있습니다.|
|Evanescent Coupling|인접 guided mode의 evanescent field overlap을 이용한 결합. 이 Release의 preview는 fixed loss만 사용하며 gap·CMT·실측 효율을 계산하지 않습니다.|
|Tolerance Window|이 게임의 offset / pitch acceptance 범위. 실제 제조 공정의 허용오차나 yield를 뜻하지 않습니다.|

What you learned: 평균이 아니라 worst channel의 loss와 margin을 확인하고, density·공간·power 경계까지 비교합니다.

Practice: Mission 15에서 Δpitch = 0.5 µm를 설정하고 4, 8, 16채널의 edge-channel loss를 비교하세요.

Next: Chapter 6 Preview: Mode overlap, Assembly tolerance, Test와 Reliability. 해당 gameplay는 후속 개발입니다.

Sources: Boucaud et al., Glass interposer for heterogeneous integration of flip-chipped PIC/EIC, APL (2024), DOI 10.1063/5.0221309; Du et al., Detachable interface toward a low-loss reflow-compatible fiber coupling for CPO, Optics Express 31 (2023), DOI 10.1364/OE.480418; AI DC Connectivity Technical Report (2026-09-05), OE–FAU separation trade-off; Numerical presets in this game are independent Educational Assumptions; not measurements or vendor specifications

