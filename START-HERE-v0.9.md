# AI Data Center Tycoon v0.9.0

`ai-dc-tycoon-v0.9.html`을 Chrome / Chromium에서 열면 Offline으로 실행됩니다. 설치와 외부 HTTP 요청이 필요하지 않습니다.

1. **Continue Campaign**: 기존 Chapter 1–6 순차 진행과 Progress / XP / Credits / First-Clear Reward를 유지합니다. 기존 v0.8 Text Backup은 이 모드의 저장 / Backup에서 복원합니다.
2. **Free Exploration**: Chapter 1–6 / Mission 01–18 전체를 선택합니다. Mission 17 또는 18의 Play로 바로 시작할 수 있습니다.
3. Starter Template과 Your Engineering Decision을 확인하고 Equipment / Process를 변경한 뒤 **Run Simulation**을 실행합니다. Learn은 선택 사항입니다.
4. **Back to Navigator**로 다른 Mission에 이동합니다. **Play · Resume**는 해당 Mission의 설계를 복원하고 **Restart**는 해당 Mission만 초기화합니다.
5. 선택 Mission, 설계 입력과 Practice Result는 별도 IndexedDB에 Autosave합니다. 다시 열면 Home → Free Exploration으로 마지막 Practice를 재개합니다.

Practice Result는 Campaign Clear / XP / Credits / Reward Receipt를 생성하지 않습니다. Manufacturing Cost의 Credits는 교육용 비용 지표입니다.

모든 수치는 기존 v0.8 Analytical / Simplified Educational Assumption입니다. 실제 제조 Yield, Vendor 성능 또는 Reliability qualification을 의미하지 않습니다. Monte Carlo 비교에서는 동일 Seed와 Sample 수를 사용하세요.

산출물: 실행 HTML / source ZIP / HANDOFF ZIP / screenshots ZIP / RELEASE-MANIFEST. SHA-256과 실제 검증 결과는 Manifest와 `docs/REGRESSION-v0.9.md`를 참고하세요. Source ZIP의 `npm ci && npm run build`로 재빌드할 수 있습니다.

Campaign 저장소와 Free Exploration 저장소는 분리됩니다. Future Schema는 자동 덮어쓰기를 차단하고, 손상된 Practice Head는 LKG로 복구합니다. 다중 탭 저장 충돌 시 현재 탭의 Practice Backup을 보존하고 다시 열어 주세요. Campaign의 기존 CAS / LKG / Restore Journal 보호는 그대로입니다.
