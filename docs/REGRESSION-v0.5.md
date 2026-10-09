# REGRESSION — AI Data Center Tycoon v0.5.0

2026-10-09. 기준 Source: c12149e985b207c5df50357ff7eb62a299fb813d. v0.4 PR #2는 Open / Unmerged, 37 Feature Commits를 보존했습니다. main: 1e3cb63e7910ce90aab132bf5584ced2ac5d795d, 변경하지 않았습니다. 최종 v0.5 Source Commit과 HTML SHA256은 Release Manifest에 기록합니다.

## 실제 Baseline 재실행

기존 보고서의 367 PASS를 그대로 인용하지 않고 개발 전 이 환경에서 재실행했습니다. 증거: evidence/v05-baseline/*.json / SUMMARY.json.

| 기존 검증 | PASS |
|---|---:|
| Engineering Legacy / Graph Golden | 30 / 42 |
| Engineering / P2 Browser | 24 / 26 |
| Game01–03 Golden / Browser | 65 / 45 |
| v0.3 Integrity / Distribution | 5 / 3 |
| Chapter2 Golden / Experimental Network / Runtime Graph | 34 / 32 / 23 |
| Chapter2 Browser / Enhanced v0.4 Browser | 10 / 21 |
| v0.4 Integrity / Distribution | 4 / 3 |
| 합계 | **367** |

개발 후 기존 Deterministic 235개를 다시 실행하여 PASS를 확인했습니다. Engineering Source/Test 16개 Hash와 v0.2/v0.3/v0.4 HTML Hash는 그대로입니다. Existing Browser 126개는 Release 최종 재실행 결과를 다음 Evidence Commit에서 확정합니다. 시작 Baseline의 126개 PASS와 혼동하지 않습니다.

## v0.5 신규 검증 — 기존과 분리

| 그룹 | PASS | Evidence |
|---|---:|---|
| CPO Architecture / Typed Package Model | 27 | cpo-model-golden-results.json |
| Mission07–09 / Economy / Receipt Provenance | 33 | chapter3-golden-results.json |
| Campaign Schema / Profile / Journal / Recovery | 26 | campaign-golden-results.json |
| Source / Legacy HTML / Model Boundary Integrity | 5 | integrity-results.json |
| Desktop 실제 Mission07–09 | 25 | browser-results.json |
| 390/320px Touch / Lab Reference-only / Refund | 9 | mobile-browser-results.json |
| 실제 IndexedDB Backup / LKG / Future / Conflict / Interrupted Restore | 14 | storage-browser-results.json |
| 새 v0.5 HTML의 기존 Mission01–06 / Optical Golden Parity | 8 | legacy-browser-results.json |
| Source ZIP Clean Rebuild / CRC / Manifest | NOT TESTED — Packaging 후 실행 | distribution-results.json 예정 |
| 현재 확인 합계 | **147 PASS** |

핵심 검증: M06→07 Unlock / Locked Mission 거부 / 두 Customer Order Trade-off / CPO Rate Bonus 없음 / Missing ELS 및 Unknown Link 비활성 / Electrical·CW·Optical Typed Connection / 미사용 OE Capacity 없음 / 실제 Installed Paths만 Traffic Solver 반영 / Near-Far Power와 Unknown Loss 분리 / Power·Cost·Space·Serviceability 실패 / 실제 설치 후 2560G·96W·40s / Replay Reward 중복 방지 / 기존 XP·Credits·Inventory·Graph·Module Assignment 보존 / 3DB Journal Roll Forward·Conflict Boot Block·명시적 Cancel / Lab DB 분리 / Scale Roundtrip 동일 Config / Offline HTTP Request0.

Browser 및 Storage 그룹은 각각 180초 실행 제한과 10초 Action 제한을 적용했습니다. CI는 각 그룹 4분 이하로 분리합니다. 중단·Quota·Concurrent Write는 Injection으로 재현했으며 정상 결과로 조용히 덮어쓰지 않습니다.

## 실행 중 실패와 해결

- Baseline Browser의 만료된 /tmp 실행 파일·Font 문제: 최초 NOT TESTED / 실행 환경 복구 후 실제 PASS. 기존 Backup Notice Timing 1개 초기 FAIL을 기록했으며 기대값 변경 없이 정상 Runtime에서 재실행 PASS.
- 신규 Lab Browser Test가 임의의 Model 이름을 지정하여 1회 FAIL: 실제 v0.2 Graph Golden Fixture의 Model/숫자를 직접 비교하도록 Test를 수정했습니다. Physics Source 또는 기존 Fixture를 변경하지 않았습니다.
- 신규 Future Save 원본 표시 Test가 비동기 IndexedDB 읽기 완료 전에 검사하여 1회 FAIL: 기대값을 유지하고 표시 완료 조건을 기다리도록 수정, 그룹 전체 재실행 PASS.
- 최종 기존 Browser Group 호출에서 명시적 Browser 경로 누락으로 Launch NOT TESTED: 경로를 적용하여 재실행. Source Regression으로 보고하지 않습니다.

미해결 Release-blocking Data Loss / Physics Regression은 발견하지 않았습니다. Future Format은 자동 복구·Overwrite 대상이 아닙니다. 원본을 보존하고 Compatible Release 또는 유효한 명시적 Backup으로 처리해야 합니다.

## CI / 검증 한계

v0.4의 기존 Actions는 361 checks로 두 Distribution 그룹 6개를 제외했습니다. 확장된 Workflow는 기존 361 + 신규 147 = **508 checks**를 실행하도록 구성했습니다. 최종 Commit의 실제 Actions 상태는 GitHub Run 링크로 별도 보고하며 이 문서의 구성 수가 실행 성공을 의미하지 않습니다. Distribution은 Local Release Artifact에서 별도로 실행합니다.

UX Design Review / Chromium Desktop·Touch Emulation은 수행했습니다. 실제 초보자 연구, 3–5분 플레이 시간 측정, Android 실기기, iOS/Safari 및 전체 Accessibility Audit는 **NOT TESTED**입니다. 실제 Hardware CPO Power / Optical Loss / Yield / Reliability는 검증하지 않았으며 모두 교육용 가정 또는 Unknown입니다.
