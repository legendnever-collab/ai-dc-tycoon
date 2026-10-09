# Technology Tree — v0.3.0

XP와 Mission Clear Receipt를 함께 검증한다. XP는 Numerical Capacity를 바꾸지 않는다. Inventory와 Unlock은 Game DB와 Text Backup에 영구 보존한다.

| 기술 | 필요 XP / 선행 | 현재 제공 기능 | 상태 |
|---|---|---|---|
| Compute Rack T1 | 0 | 기본 Rack 1대, 40 WU/s | 구현 |
| Compute 확장 | 100 / M01 | 100 Credits 구매, Floor 배치, 재배치, 반환 | 구현 |
| Scale-out Switch | 250 / M02 | 180 Credits로 16→64 Gb/s Upgrade | 구현 |
| Network Analyzer | 500 / M03 | Compute/Network 시간 막대, Throughput/Waiting 해석 | 구현 |
| Pluggable Optics | 500 / M03 | 광연결 개념 Preview 열기 | 학습 Preview 구현, 장비/미션 미구현 |
| CPO | 후속 Chapter | Switch와 Optical Engine 결합 개념 | PLANNED |
| Optical Engine | 후속 Chapter | 게임↔Engineering Design Bridge | PLANNED; 별도 기존 Lab 사용 가능 |
| Photonic Substrate | 후속 Chapter | 광경로와 정렬의 설계 연결 | PLANNED; 기존 Lab은 보존 |

플레이어는 Chapter 01 Clear 후 500 XP / Level 4가 된다. 기능 해금은 현재 Clear 보상의 합계에서 도출하므로 Backup에 Unlock 목록만 추가해 잠긴 장비를 사용할 수 없다. UI와 Core 양쪽에서 Tech Gate를 확인한다.

Advanced Lab은 언제든 열 수 있는 별도 Engineering 환경이다. Beginner 장비의 Credits/XP를 Lab Physics에 전달하지 않으며, Lab의 측정 미확인 결과가 게임 교육용 계산의 실측 근거가 되지 않는다. Pluggable Preview도 DC 성능을 바꾸지 않는다.
