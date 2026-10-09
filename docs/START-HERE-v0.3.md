# AI Data Center Tycoon v0.3.0 시작하기

`ai-dc-tycoon-v0.3.html`을 내려받아 Chromium 계열 브라우저로 여세요. 인터넷 연결 없이 플레이할 수 있습니다. 첫 화면에서 ‘미션 시작’ → ‘Run Simulation’을 누르면 첫 Job과 보상을 확인합니다.

1. Mission 01 Clear 후 ‘다음 미션’을 누릅니다.
2. Mission 02에서 Rack 구매 → 빈 Floor 자리 클릭 → Run을 누릅니다. 구매 후 아직 배치하지 않은 Rack은 작업을 처리하지 않습니다.
3. Mission 03은 먼저 실행해 Network 병목을 확인할 수 있습니다. 재도전으로 돌아가 장비를 조정하고 다시 실행하세요. 추가 Rack에 예산을 썼다면 선택 후 ‘반환’으로 Credits를 돌려받습니다.
4. Chapter 완료 후 Network Analyzer와 Technology Tree의 Pluggable Optics Preview를 열어 보세요. Replay는 가능하지만 최초 보상만 지급합니다.

예상 시간은 교육용 Model 시간이고 진행 막대는 가속 재생입니다. WU는 교육용 작업량 단위이며 실제 GPU Benchmark가 아닙니다.

## 저장과 기존 Design

상단 Autosave 상태를 확인하세요. ‘저장 실패/사용 불가’가 보이면 ‘저장 / Backup’ → ‘Backup 생성’으로 JSON을 복사해 보관합니다. 복원할 때 같은 창에 JSON을 붙여넣고 ‘붙여넣은 Backup 복원’을 누릅니다. Clipboard가 막히면 전체 선택 후 Ctrl+C/모바일 복사를 사용합니다. 파일 업로드가 필요하지 않습니다. LKG 복원은 직전 정상 저장본으로 돌아갑니다.

‘Advanced Lab’은 기존 Optical Engine Tycoon v0.2.0입니다. 2D/3D Builder와 Physics/Geometry/Port/Undo/Redo/Report/Measurement Gate가 그대로 있습니다. 기존 v0.2 저장 데이터를 해당 브라우저 Origin에서 이어받으며, 다른 PC나 저장 정책에서는 Lab의 Text Backup으로 옮기세요. **Game 진행도와 Engineering Design의 Backup은 별도입니다. 둘 다 필요하면 두 Backup을 각각 보관하세요.** 기존 Design JSON은 Lab에서 복원하세요.

Mobile에서는 미션 카드가 위, Rack Floor와 Dashboard가 아래로 이어집니다. 구매 후 아래로 스크롤해 빈 자리를 누릅니다. WebGL이 없어도 World와 Lab 2D/Physics는 작동합니다.

## 산출물과 검증

Source ZIP은 TypeScript/빌드 의존성/보존된 Lab/자동 테스트를 포함합니다. Node와 Linux x64 환경에서는 `node build.cjs`로 Offline Rebuild할 수 있습니다. 다른 OS는 해당 esbuild binary 준비가 필요합니다. HTML 실행에는 Node가 필요하지 않습니다. Browser 테스트에는 별도 Playwright/Chromium이 필요합니다.

검증 결과는 REGRESSION-v0.3.md, 구현 범위는 GAME-DESIGN/MISSION-CATALOG/TECHNOLOGY-TREE, 다음 작업은 NEXT-DEVELOPMENT-PLAN.md를 보세요. 실제 초보자, 회사 PC, Android 실기기 테스트는 아직 수행하지 않았습니다.
