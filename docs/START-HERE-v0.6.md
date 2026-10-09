# AI Data Center Tycoon v0.6.0 — START HERE

`ai-dc-tycoon-v0.6.html`을 Chrome/Edge에서 직접 여세요. 서버·계정·Runtime Internet이 필요 없습니다. 기존 Chapter01–03과 Advanced Photonics Engineering Lab은 그대로 있습니다.

기존 v0.5 진행도는 같은 Browser/Profile/Origin에서 자동 재개됩니다. 파일 경로 이동이나 다른 PC에서는 상단 **저장 / Backup**에서 v0.5 Campaign Backup을 붙여넣으세요. Chapter01–03과 보상은 유지되고 Chapter04는 미진행으로 시작합니다. v0.6부터 Campaign Backup 하나가 Workshop 설계까지 보관합니다. 기존 Advanced Lab Design은 독립 Lab Backup을 계속 사용합니다.

1. Mission09 Clear 후 **Optical Engine Blueprint 열기**를 선택하세요. Package의 OE 버튼으로도 진입합니다.
2. Mission10: 기존 ELS → CW Input 연결, Balanced Laser 선택, Run Simulation. Low/High도 실험해 보세요.
3. Mission11: MZM/EAM 선택, CW Input / ASIC→Driver / Optical Output 연결, Run Simulation. 빛과 광 데이터를 구분합니다.
4. Mission12: Waveguide, Route, Coupler, FAU, Fiber→Receiver를 연결하고 Run Simulation. Long Route의 실패 원인을 보고 설계를 바꿔보세요.
5. Clear 후 Package로 돌아가면 선택한 OE만 상태가 바뀝니다. 다른 OE는 독립 설계입니다.

Retry/Replay는 설계를 유지하며 최초 보상은 중복 지급하지 않습니다. Refund/Reset은 선택한 OE 장비만 환불하고 Clear/보상을 유지합니다. M12 이후 Challenge에서 길이·IL·Launch·효율을 바꾸거나 Route Comparison을 볼 수 있습니다. Advanced Lab은 언제든 기존 상단 메뉴로 열 수 있습니다.

모든 신규 수치는 **Educational Assumption**이고 기존 Analytical/Simplified Solver로 계산합니다. M11 Meter는 임시 교육용 Fixture입니다. M12는 Tx 교육용 Link Budget이며 Rx Incoming Power, BER/Eye/EO response, Evanescent gap/CMT, Yield/Reliability는 Unknown 또는 Not Modeled입니다.

Build: Node24에서 `npm ci` → `npm run build`. 새 환경의 dependency 설치에는 Internet이 필요할 수 있습니다. 결과 HTML은 Offline입니다. 검증: `node tests/workshop-adapter-golden.cjs`, `chapter4-golden.cjs`, `workshop-storage-golden.cjs`, `v06-integrity.cjs`. Browser Tests에는 Playwright/Chromium이 필요합니다. 실제 Android·사람 대상 Usability는 NOT TESTED입니다.
