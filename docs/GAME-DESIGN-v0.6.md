# Game Design — v0.6

EVENT → EXPERIMENT → BUILD → SIMULATE → RESULT → REWARD → UNLOCK을 유지합니다. Chapter04는 기존 CPO Switch의 실제 OE를 열며, 별도 가짜 Package를 만들지 않습니다. Beginner는 정해진 부품 카드와 연결 버튼으로 조립하고, 어려운 식보다 실패 위치와 Power/Margin Meter를 먼저 봅니다.

M10: 빛은 필요하지만 너무 강한 Laser는 전력 조건을 넘습니다. M11: CW Light만으로는 데이터를 전송할 수 없고 Driver와 Modulator가 필요합니다. M12: 부품이 전부 있어도 긴 경로/큰 손실이면 목표를 통과하지 못합니다. 실패 후 하나씩 조건을 바꾸어 원인을 탐색합니다.

기본 화면은 목표/미션, OE PIC 2.5D 개념도, 부품 카드, 결과 Meter입니다. CW는 금색, Optical Data는 청록색, Electrical Drive는 파란색이며 Animation은 교육용 Signal Representation입니다. Diagram 좌표는 Loss 입력이 아닙니다. Reduced-motion 환경에서 Animation을 중지합니다.

M12 이후 Challenge: Custom Parameters, Route Comparison, 3Stars Replay. 1Star는 Hard Objective, 2Stars는 Power 최적화, 3Stars는 Power+Margin+Cost의 명시적 교육용 기준입니다. 별점은 Rate 또는 실제 Physics를 향상시키지 않습니다.

기존 Reward Receipts를 변경하지 않고 Chapter04의 별도 Receipt 합산으로 Credits/XP/Unlock을 계산합니다. 신규 Credits는 Workshop 구매/Replay 예산에 쓰이며 legacy Chapter01–03의 원본 wallet/state는 재작성하지 않습니다. Legacy replay 구매 판단은 기존 경제 규칙을 유지합니다. 기본 Workshop 구매 비용은 첫 Clear 보상과 기존 잔액으로 충분합니다.

Human usability/플레이 시간 실측은 수행하지 않았습니다. Desktop/Touch Browser 자동 조작 및 화면 검토와 구분합니다.
