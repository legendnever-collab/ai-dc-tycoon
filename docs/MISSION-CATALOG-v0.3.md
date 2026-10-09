# Mission Catalog — v0.3.0

Game Schema 1 · Model `ai-dc-educational-1.0.0` · Evidence: Educational Assumption

| ID | Event / Scope | 입력 | Hard Objective | 최초 Reward | Unlock |
|---|---|---|---|---|---|
| 01 | 첫 AI Job / Independent | 1,200 WU, 40 WU/s/rack | T≤35s, 배치 Rack≥1 | 100 XP / 120 Credits | Compute 구매·배치·반환, M02 |
| 02 | 독립 작업 증가 | 4,800 WU, 40 WU/s/rack | T≤65s, 배치 Rack≥2 | 150 XP / 140 Credits | Scale-out Switch Upgrade, M03 |
| 03 | Distributed Training / Scale-out | 9,600 WU, 0.5 Gbit/WU, Switch 16/64 Gb/s | T≤125s, 배치 Rack≥2 | 250 XP / 200 Credits | Network Analyzer, Pluggable Optics 학습 Preview |

## Golden Numerical Fixtures

| Mission | 배치 Rack | Aggregate Network | Compute Time | Network Time | 완료 시간 | GPU Waiting | 예상 판정 |
|---|---:|---:|---:|---:|---:|---:|---|
| 01 | 1 | 16 Gb/s | 30s | 제외(0s) | 30s | 0% | PASS |
| 02 | 1 | 16 Gb/s | 120s | 제외(0s) | 120s | 0% | FAIL |
| 02 | 2 | 16 Gb/s | 60s | 제외(0s) | 60s | 0% | PASS |
| 03 | 2 | 16 Gb/s | 120s | 300s | 300s | 60% | FAIL |
| 03 | 3 | 16 Gb/s | 80s | 300s | 300s | 73.333…% | FAIL |
| 03 | 2 | 64 Gb/s | 120s | 75s | 120s | 0% | PASS |
| 03 | 3 | 64 Gb/s | 80s | 75s | 80s | 0% | PASS / 비용 Stars 감소 |
| 03 | 4 | 64 Gb/s | 60s | 75s | 75s | 20% | PASS / Network 한계 재등장 |

수치는 제품 측정값이 아니다. Scenario Expected Result와 독립 Solver 출력의 일치를 Golden Test에서 확인한다. Mission 01의 첫 기본 구성은 안내를 위해 성공하도록 준비되어 있다. Clear 후 Replay에서 Rack을 Inventory로 이동하면 배치 Rack=0, T=Unknown, FAIL을 경험하고 재배치 후 재도전할 수 있다. Unknown을 Infinity 또는 임의 점수로 바꿔 성공시키지 않는다.

## 단위 / Valid Range / Assumption

| 변수 | 단위 | 범위 | 가정 |
|---|---|---|---|
| Workload W | synthetic WU | 1–10⁹ | 실제 GPU Benchmark와 무관 |
| Rack Count | 대 | 0–8, 정수 | Inventory는 제외, 0은 계산 Unknown |
| Per-Rack Capacity | WU/s/rack | 1–1,000 | 미션에서는 40 고정 |
| Traffic ρ | Gbit/WU | 0–100 | 미션03은 0.5 고정, collective traffic 상세 모델 없음 |
| Network B | Gb/s aggregate | 0–10,000 | 미션03은 16/64, B=0은 Unknown |
| Time T | s | Solver 결과 | ideal overlap envelope |
| Investment | Credits | 음이 아닌 게임 통화 | 벤더 장비 가격이 아님 |

Beginner 화면은 Numerical Fixture 값을 직접 편집하지 않고 장비 구성만 바꾼다. Simulator Interface는 별도 입력으로 확장할 수 있으며 미션 보상 검증은 Catalog Fixture와 실제 Hardware provenance의 일치를 요구한다. 실제 BER/Eye/TDECQ/OIF Compliance를 생성하지 않는다.

JSON Fixtures는 Source의 `tests/game-golden-fixtures.json`, Mission/Hardware Catalog는 `tests/mission-catalog.json`, `tests/hardware-registry.json`에 있다. 재현 Seed는 20261009다. 이 모델에는 확률 과정이 없어 Seed는 Traceability metadata이며 결과를 강화하는 값이 아니다.
