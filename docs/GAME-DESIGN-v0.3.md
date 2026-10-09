# AI Data Center Tycoon v0.3.0 — Game Design

Release 2026-10-09 · Game Schema 1 · `ai-dc-educational-1.0.0` · Engineering Core 0.2.0 / Schema 2

이번 Release는 초보자가 세 미션을 실제로 완료하는 Game-First Vertical Slice다. 기본 화면은 Data Center World이며, 기존 Optical Engine Tycoon은 Advanced Photonics Engineering Lab에서 그대로 실행한다. 첫 세 미션에는 전체 Graph Editor나 Parameter Inspector를 노출하지 않는다.

## 플레이 흐름

EVENT → DIAGNOSE → BUILD/UPGRADE → SIMULATE → RESULT → REWARD → UNLOCK. 첫 화면의 ‘미션 시작’ 한 번으로 ACTIVE에 진입하고, 두 번째 주요 클릭으로 첫 Job을 실행한다. 첫 미션의 준비된 Rack은 성공 가능한 안내용 구성이다. 이후 Inventory를 비우면 Unknown으로 실패하며 재배치 후 재도전할 수 있다. Mission 02는 구매·배치·작업 분배, Mission 03은 Network 병목과 Upgrade 비용을 경험한다.

Mission은 LOCKED → AVAILABLE → ACTIVE → SIMULATING → RESULT(실패) 또는 CLEARED(성공)를 따른다. 실패 시 재도전 버튼은 ACTIVE로 돌아간다. `cleared`는 영구 진행 기록이고 `phase`는 현재 시도의 상태이므로 이미 Clear한 미션의 Replay 실패가 최초 Clear 기록을 지우지 않는다. 최초 Clear Receipt가 있어야 다음 미션이 열린다. 실행 중 Hardware/Mission 변경은 거부한다.

Job Progress는 3.2초짜리 가속 재생이다. 실제 계산 완료 시간과 브라우저 애니메이션 시간을 구분한다. Solver가 먼저 결과를 계산하고 입력과 결과를 pending snapshot에 보관한다. ‘결과 보기’는 재생만 건너뛴다. 저장된 SIMULATING 상태는 같은 입력으로 다시 재생하며, 최초 보상 중복 방지를 유지한다.

## 행동과 UI

| 미션 | 주요 행동 | 학습 결과 |
|---|---|---|
| 01 | 시작, Run | Workload / Compute Capacity / 완료 시간 |
| 02 | Rack 구매, 빈 Floor 클릭, Run | 독립 작업의 균등 분배 |
| 03 | Rack 구매, Switch Upgrade, Run | Compute 증설 한계와 Scale-out 병목 |

활성 미션의 주요 행동 버튼은 1–3개다. Rack 구매는 Inventory에 먼저 들어가며 빈 자리에 배치해야 Compute Capacity가 증가한다. 선택한 Rack의 재배치·반환은 보조 Context Action이다. 기본 Rack은 반환할 수 없고, 구매한 Rack은 100 Credits를 돌려준다. Desktop은 4×2, Mobile은 2×4 Floor를 사용한다. 클릭·터치·Enter/Space로 선택/배치할 수 있다. 빈 자리, 선택 표시, 링크 색상, GPU Waiting과 즉시 바뀌는 예측 KPI를 제공한다.

미션 통과는 Run 결과의 Hard Objectives로 결정한다. Forecast가 목표를 만족해도 보상이나 Clear를 먼저 지급하지 않는다. Stars는 비용 최적화를 평가하며 실패를 성공으로 바꾸지 않는다. 힌트는 사용자가 누를 때 세 단계로 공개한다. Clear에는 XP/Credits/새 기능/다음 행동을, 실패에는 병목/누락 입력/재도전 방법을 표시한다.

## 경제와 해금

시작 자원은 160 Credits, 0 XP, 기본 Rack 한 대다. Rack은 100, Switch Upgrade는 180 Credits다. Credits는 `160 + 최초 Clear 보상 합계 − 현재 구매 Rack 비용 − Switch Upgrade 비용`으로 검증한다. XP는 최초 Clear Receipt 합계다. 중복 Receipt, 잘못된 보상, 결과 변조, 잘못된 Inventory/Slot, 잠긴 기술 사용은 Restore에서도 거부한다. JSON의 SHA-256은 우발적 손상 검사이며 인증·치트 방지 서명이 아니다.

보상은 각각 100/150/250 XP와 120/140/200 Credits다. 정규 진행에서 Rack 한 대 구매와 Switch Upgrade를 하면 Chapter 종료 시 500 XP, 340 Credits가 남는다. Replay는 Best Stars를 갱신할 수 있지만 보상은 0이다. XP는 구매/Upgrade/Analyzer/학습 Preview 기능을 열고 처리량을 직접 강화하지 않는다. 예산을 추가 Rack에 썼다면 반환해 Switch 예산을 확보할 수 있어 막힌 진행을 복구할 수 있다.

Pass Score = max(0, 100 − max(0, 누적 현재 장비 투자 − 효율 기준 투자)/10). 기준 투자는 M01=0, M02=100, M03=280이다. Score≥95는 3 Stars, ≥75는 2 Stars, 나머지 Pass는 1 Star다. Fail은 0 Stars이며 Score≤70이다. Rack 3대+Upgrade는 80초로 더 빠르지만 2 Stars, 2대+Upgrade는 120초/3 Stars다.

## 계산 범위와 Evidence

WU는 Synthetic Work Unit이다. 실제 GPU FLOPS, GPU 성능, NCCL, Network Benchmark, Training 완료 시간을 대표하지 않는다. Workload/Capacity/Traffic은 Educational Assumption이며 Fidelity는 Analytical / Simplified다. Numerical Solver는 TypeScript의 독립 함수로 실행하며 AI/API를 사용하지 않는다.

Independent: C = Rack Count × 40 WU/s, T = W/C. Distributed Training / Scale-out: Tcompute = W/C, Tnetwork = W×ρ/B, T = max(Tcompute,Tnetwork), Throughput = W/T, GPU Waiting = max(0,1−Throughput/C). B는 여러 포트를 묶은 교육용 aggregate Gb/s다. 균등 분배, 고정 Capacity, 이상적인 Compute/Communication overlap, 장애 없는 링크를 가정한다. Collective algorithm, latency, congestion, Scale-up Fabric, Storage/I/O, Power, Cooling, 실제 GPU topology는 계산하지 않는다. 지원하지 않는 Scope나 필요한 입력이 없으면 Unknown이며 Mission을 통과하지 않는다.

Scale-up/Scale-out은 Traffic/Fabric의 의미로 구분한다. Rack 안/밖이라는 공간 경계만으로 구분하거나 HBM Bandwidth를 외부 Network Demand로 치환하지 않는다. 현재 세 번째 미션은 명시적인 Scale-out Fixture다.

## 품질 범위

자동 Browser 검사는 진행·버튼 접근·클릭 수·실패 설명·보상 표시 등 구조적 UX Gate를 확인했다. 실제 초보자 대상 Usability Test는 NOT TESTED다. 회사 PC/Android 실기기와 실제 GPU/WebGL 하드웨어도 NOT TESTED다. 전체 18개 레벨, 실제 벤더 성능, CPO DC 성능 매핑은 구현하지 않았다.
