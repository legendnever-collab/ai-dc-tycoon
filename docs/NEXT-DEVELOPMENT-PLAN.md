# Next Development Plan — v0.3.0 기준

현재 완료 범위는 G0–G5, 세 미션의 Chapter 01과 보존된 Advanced Lab이다. 아래 기능은 미구현이며 다음 Incremental Upgrade 범위로 제안한다. 전체 18레벨을 한 번에 확장하지 않는다.

## 다음 우선순위

1. **실제 초보자 검증**: 최소 5명의 신규 플레이어에게 설명 없이 M01–03을 진행하게 한다. 시작까지 클릭 수, 구매 후 배치 발견 시간, M03 실패 이유 설명, 보상/다음 행동 인지, 중도 이탈을 기록한다. 현재 자동 UX Gate를 Usability PASS로 대체하지 않는다. 회사 PC/Android에서 file:///IndexedDB/Clipboard/WebGL fallback을 실제 확인한다.
2. **Chapter 02 / Pluggable Optics**: Switch Port와 aggregate Capacity의 차이, Fiber Tx/Rx, Lane Rate, Gross/Net Rate를 소수의 고정 Educational Fixture로 연결한다. Coding Efficiency 근거가 없으면 Net Unknown을 유지한다. 3개 이하의 새 미션으로 범위를 제한하고 Power/Cost/Space 수치를 게임 가정과 실제 모델로 구분한다.
3. **Engineering Bridge 구현**: stable Hardware ID에 Design ID/Schema/Version/SHA256/Result provenance를 참조로 연결한다. 사용자가 선택한 승인된 입력만 Import하며 Geometry proximity, XP, Stars로 물리 결과를 강화하지 않는다. 어떤 Link Budget 항목이 DC 가용 Capacity/제약으로 전달되는지 Reference Plane과 Validity를 먼저 정의한다.
4. **별도 Advanced Lab P3**: MZM/EAM, Tx/Rx Optical Budget, Electrical Power, Wavelength/Temperature 입력을 증거 수준별로 점진 확장한다. v0.2 P3 계획은 `docs/baseline-v02/P3-DEVELOPMENT-PLAN-v0.2.md`에 보존되어 있다. 현재 Release에 EO Bandwidth/BER/Eye/CMT/Thermal 검증을 추가한 것으로 표시하지 않는다.

## 다음 릴리스 Gate

- 기존 Engineering 122 PASS와 Game/Release 회귀를 유지한다. 새 모델은 Golden Input/Expected Output/Unit/Validity/Assumption을 먼저 추가한다.
- Game Schema 1 마이그레이션과 Engineering Schema 2 보존을 독립적으로 검증한다. Replay Receipt 중복 방지, 경제 원장, Pending Run 재개, LKG/Archive 원본 보존을 유지한다.
- Hardware 또는 Bridge 결과가 Unknown/Invalid이면 Mission Hard Constraint를 통과하지 않는다. 교육용 Throughput을 실측 Benchmark로 올리지 않는다.
- 신규 Mission의 실패·재도전·Clear·보상·해금·모바일 진행을 Browser에서 처음부터 실행한다. 검증하지 않은 환경은 NOT TESTED로 남긴다.
- Offline Single HTML과 Source ZIP에서 Clean Rebuild한 HTML의 byte equality를 검증한다.

성공 기준은 사용자가 ‘왜 GPU만 더 늘려도 빨라지지 않는가’를 설명하고, 다음 광연결 기술을 스스로 열어 보고 싶어 하는 경험이다. 사람 대상 검증 결과로 UI와 난이도를 조정한 뒤 다음 Chapter를 늘린다.
