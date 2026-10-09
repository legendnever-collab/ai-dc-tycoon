# AI Data Center Tycoon v0.7.0

다운로드한 `ai-dc-tycoon-v0.7.html`을 Chrome 또는 Edge에서 직접 여세요. 서버와 인터넷 연결이 필요하지 않습니다.

## 시작과 이어하기

1. 신규 플레이는 Chapter 1의 Mission 01에서 시작합니다.
2. 상단 Campaign Navigator에서 Chapter 1–5 상태와 전체 15개 Mission 진행을 확인합니다. 잠긴 Chapter를 누르면 Learn overview가 열립니다.
3. 이전 v0.6 진행은 동일한 browser/profile/file origin에서 자동으로 재개합니다. 파일 위치가 바뀌었다면 이전 HTML에서 Campaign Text Backup을 생성한 뒤 새 HTML의 저장 / Backup에 붙여넣어 복원하세요.
4. v0.3–v0.6 Text Backup도 읽습니다. v0.6 전체 Campaign 복원은 Chapter 1–4를 보존하고 Chapter 5를 미진행 상태로 초기화합니다.
5. Chapter 5는 Mission12 완료 후 열립니다. OE-001을 기본 학습 엔진으로 사용하세요. 각 OE의 설계는 독립적입니다.

## Chapter 5 빠른 플레이 가이드

- Mission13: Interface 선택 → Substrate input 연결 → Run Simulation.
- Mission14: FAU 연결 → x/y offset와 Δpitch 조절 → Coupling loss와 Worst Margin 확인 → Run.
- Mission15: 16-channel / 50G fixture 선택 → Compact route / alignment 확인 → 모든 채널 ≥3 dB와 package feasibility 검증.
- 실패하면 Retry를 누르고 설계를 유지한 채 한 항목씩 바꿉니다. 최초 Clear만 XP/Credits를 지급합니다.
- Mission15 완료 후 Advanced Coupling Workshop에서 기존 parameter를 탐색할 수 있습니다. Chapter6는 Preview이며 신규 제조 gameplay는 포함하지 않습니다.

## Learn과 저장

각 Chapter의 Learn은 concept cards, component map, glossary와 다음 Chapter 연결을 제공합니다. Package의 Why 4 OEs?는 4×800G fixture와 독립 상태를 설명합니다.

IndexedDB autosave, LKG, SHA-256 Text Backup 및 중단 복원 Journal을 지원합니다. 큰 Campaign은 검증에 수 초 이상 걸릴 수 있습니다. 생성/복원 상태 안내가 끝날 때까지 기다리세요. 별도 Advanced Lab Design은 기존 Lab Backup에서 보관합니다.

## 모델 범위

모든 새 수치는 Educational Assumption / Analytical-Simplified / Uncalibrated입니다. 실측 vendor spec, 실제 full-wave solver, evanescent gap/CMT, process yield 또는 reliability 검증이 아닙니다. 16×50G는 기존 OE 채널 모델을 복제한 hypothetical fixture입니다. 실제 8×100G OE를 변환한 성능이 아닙니다.

Desktop와 Chromium touch emulation 결과는 REGRESSION 문서를 참고하세요. 실제 Android 기기와 인간 사용성 평가는 별도입니다.
