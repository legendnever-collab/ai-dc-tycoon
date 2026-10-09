# REGRESSION — AI Data Center Tycoon v0.4.0

## Baseline evidence
시작 main / feature HEAD는 1e3cb63e7910ce90aab132bf5584ced2ac5d795d였다. 기존 보고서의 240 PASS를 그대로 인용하지 않고 이 환경에서 전체 240개를 다시 실행하여 PASS를 확인했다. 증거는 evidence/v04-baseline/*.json에 보존한다. main은 변경하지 않았다.

| 기존 v0.3 검증 | 실제 실행 PASS |
|---|---:|
| Engineering Legacy Golden | 30 |
| Engineering Graph Golden | 42 |
| Engineering Browser | 24 |
| Engineering P2 Browser | 26 |
| Game Golden | 65 |
| Game Browser | 45 |
| Release Integrity | 5 |
| Release Distribution | 3 |
| 합계 | 240 |

v0.4 개발 후 v0.3 HTML SHA256은 a209d8e2052550a1fa7d04d3846580d75e63796a765a00a770564694529104fd로 동일하다. 원본 Golden/Browser 기대값은 변경하지 않았다. 추가 stable locator harness는 원본 45개 assertion을 유지하며 원본 파일도 남아 있다.

## 신규 검증 (기존 240개와 별도)
| 테스트 | PASS | evidence/v04/ 증거 |
|---|---:|---|
| Chapter 2 scenario/economy/backup Golden | 34 | chapter2-golden-results.json |
| 독립 실험 Network engine Golden | 32 | network-golden-results.json |
| 실제 Mission typed graph/shared traffic/receipt provenance | 23 | chapter2-graph-golden-results.json |
| Chapter 2 offline Browser Smoke | 10 | chapter2-browser-results.json |
| v0.4 desktop/touch/storage/Lab Browser | 21 | v04-browser-results.json |
| v0.4 release integrity | 4 | v04-integrity-results.json |
| v0.4 release distribution | 3 | v04-distribution-results.json |

Browser 숫자는 실제 완료한 test group 수이며 내부 assertion 수를 부풀리지 않았다. GitHub Actions의 현재 결과는 PR/Actions 기록을 확인해야 한다. 미래 실행의 성공을 보장하지 않는다.

## 실제 검증 범위
- v0.4 화면에서 Mission01–03 30/60/120초, Credits340/XP500, Mission04 unlock 보존.
- M04 port/connection/Fabric, M05 비대칭100G bottleneck80초→200G path40초, 공유 link와 switch fabric demand.
- M06 missing endpoint/rate mismatch/unsupported module 거부, 400G FAIL→800G PASS, effective640Gb/s/64 educational W/module150Credits.
- replay reward deduplication, 실제 wallet490/XP1240, component reveal/Technology Tree/CPO Preview.
- v0.3 profile 초기화 없이 Chapter2 sidecar 확장. 기존 head bytes 불변, reload, checksum, Text Backup/Paste Restore, LKG와 원본 archive.
- future schema/graph 발견 시 자동 저장 차단, 검증된 explicit restore 후에도 future 원본 보존. stale revision/profile mismatch Golden.
- Lab gross3200/margin5.8 유지. Native/embedded SHA256 cf7cf6df5d83cc3927d3fb5cef2a320aa507c5c58a6e5d264cedc5c9d5c7947a 및 16개 Engineering source/test hash 유지.
- Chromium offline file 실행, HTTP요청0/page errors0. Desktop1440px 및 touch390/320px full M04–06 play, horizontal overflow 없음.

## 제한된 디버깅과 미실행 항목
Backup Browser group: checksum, roundtrip, reload, corrupt-head LKG, future-version block/restore. 강화 Browser 전체는 180초 외부 제한, action8초 제한; 실패 시 완료 그룹과 오류를 JSON에 남긴다. CI step4분 제한. 무제한 retry 없음. 초기 ready/restore 동기화 오류를 완료 조건으로 수정했으며 수치 기대값은 변경하지 않았다.

실제 Android 기기, corporate-PC policy, Safari/Firefox/WebGL 실기기, 사람 대상 novice Usability Testing은 **NOT TESTED**. Chromium touch emulation과 UX Design Review는 실기기/사용자 연구와 구분한다.

## Known issues / 경계
- Chapter1/Chapter2 Text Backup은 두 개다. 다른 컴퓨터 이동 시 Chapter1을 먼저 복원하고 Chapter2를 복원한다. Lab backup도 독립적이다.
- authoritative runtime은 chapter2-graph.ts + traffic-solver.ts. network-model.ts는 다른 가정의 실험 engine이며 gameplay 미연결.
- 수치/비용은 Educational Assumption; vendor specification이 아니다. CPO는 질적 Preview만 구현했다. CPO link budget/packaging yield/thermal/evanescent coupling 미구현.
- 소규모 세 scenario의 장비 선택을 지원한다. 임의 topology 편집/production routing simulator는 다음 개발 범위다.
