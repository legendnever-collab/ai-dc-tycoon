# AI Data Center Tycoon v0.5.0 — START HERE

`ai-dc-tycoon-v0.5.html`을 최신 Chromium 기반 Browser에서 열면 됩니다. 서버·계정·Runtime Internet 연결은 필요 없습니다. 기본 화면은 기존 Data Center입니다. Mission 01–06 완료 후 **CHAPTER 03 · The CPO Revolution**을 선택하세요.

기존 Save는 같은 Browser / Origin에서 자동 재개됩니다. 다른 HTML 경로나 기기에서는 v0.3 Chapter 1 Backup을 먼저, v0.4 Chapter 2 Backup을 다음에 상단 **저장 / Backup**에서 붙여넣기 복원하세요. v0.5부터는 **Campaign Backup 생성** 한 번으로 Chapter 01–03을 보관합니다. Advanced Photonics Lab Design은 기존 Lab Backup에서 별도로 보관합니다. Browser의 `file://` 저장 정책은 서로 다르므로 이동 전 Text Backup을 권장합니다.

## Chapter 3 플레이

- **07 · Power Wall**: 현장 정비 주문 A에서 Pluggable을 실험하고, 밀도·전력 주문 B에서 Architecture를 바꿔 Simulation하세요. 두 주문의 Hard Objective를 모두 만족해야 Clear됩니다. CPO가 모든 주문의 정답은 아닙니다.
- **08 · Move Optics Closer**: ASIC → OE Slot 1/2 → Electrical → ELS → Laser Supply → FAU → Optical Tx/Rx → 교육용 Fiber Fixture → Simulation. 버튼 또는 Package Slot 클릭으로 조립합니다.
- **09 · First CPO Switch**: 같은 Prototype의 Slot 3/4에 OE를 더하고 필요한 경로를 연결합니다. Switch를 Data Center에 **설치**한 다음 Simulation해야 Clear됩니다. Optical Engine Workshop은 다음 Release Preview입니다.

실패하면 원인과 목표를 확인하고 Retry로 설계를 유지하세요. **배치 실험 / 장비 선택 / Refund**에서 Near/Far, 400G/800G, Package Region을 실험할 수 있습니다. **Refund / Reset**은 현재 Package 장비만 환불하며 Clear와 보상 기록을 유지합니다. 첫 Clear 보상은 한 번만 지급합니다.

Breadcrumb에서 Data Center ↔ Switch Rack ↔ CPO Package로 이동해도 같은 Switch ID와 Assembly가 유지됩니다. Advanced Lab도 선택적으로 열 수 있습니다. Lab Reference 연결은 Design ID와 Snapshot Hash만 기록하며 성능을 자동 변경하지 않습니다.

## Build / 검증

Node 24에서 `npm ci` → `npm run build`. 기존 v0.3/v0.4와 v0.5 HTML을 함께 생성합니다. 잠금 Dependencies 설치에는 Internet이 필요할 수 있지만 생성된 HTML은 Offline입니다. `package.json`의 0.3.0은 보존된 Legacy Core Version입니다. 이번 실행 파일 Release는 0.5.0입니다.

새 검증: `node tests/cpo-model-golden.cjs`, `chapter3-golden.cjs`, `campaign-golden.cjs`, `v05-integrity.cjs`. Browser 검증에는 Playwright와 Chromium이 필요합니다: `v05-browser.cjs`, `v05-mobile-browser.cjs`, `v05-storage-browser.cjs`, `v05-legacy-browser.cjs`. 상세 결과는 REGRESSION 문서를 보세요.

## 모델의 범위

모든 Power / Cost / Geometry / 80% Throughput 수치는 **Educational Assumption**입니다. 실제 Vendor Spec, 검증된 CPO 성능 또는 제조 가능성을 나타내지 않습니다. Optical Loss / Margin은 Unknown입니다. 사용자가 명시한 호환 Fixture는 교육용 Link Activation만 허용하며 실제 Link Budget PASS를 뜻하지 않습니다. Android 실기기와 사람 대상 Usability Study는 NOT TESTED입니다.
