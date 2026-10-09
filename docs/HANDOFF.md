# HANDOFF — AI Data Center Tycoon v0.3.0

2026-10-09 · Game Schema 1 · DC Model 1.0.0 · Advanced Lab 0.2.0 / Schema 2

첫 세 미션이 플레이 가능한 Game-First Vertical Slice다. 기존 v0.2 core/source/tests/native Lab을 byte-identical로 보존하고 별도 iframe에서 통합했다. DC Numerical Model과 경제/게임 상태를 독립 모듈로 추가했다. G0–G5를 구현하고 실제 Browser 회귀를 수행했다. P3 이후 Device Physics를 앞당겨 구현하지 않았다.

`START-HERE-v0.3.md`는 플레이·저장 안내, `ARCHITECTURE-v0.3.md`는 모듈/Schema/저장 전략, `GAME-DESIGN-v0.3.md`는 미션/경제/UX, `MISSION-CATALOG-v0.3.md`는 단위/Fixture, `TECHNOLOGY-TREE-v0.3.md`는 해금 상태, `REGRESSION-v0.3.md`는 실행 증거다. 기존 문서와 P3 계획은 `baseline-v02`에 남아 있다.

## 재현 명령

```
node build.cjs
node tests/golden.cjs
node tests/p2-golden.cjs
node tests/game-golden.cjs
node tests/release-integrity.cjs
```

Browser: `PLAYWRIGHT_MODULE`을 Playwright module 경로, `CHROMIUM_EXECUTABLE`을 Chromium binary 경로로 설정한 뒤 `node tests/browser.cjs`, `node tests/p2-browser.cjs`, `node tests/game-browser.cjs`를 실행한다. Tests는 file://와 offline mode를 사용한다. Software WebGL 환경의 공유 라이브러리가 binary 옆에 있어야 한다. 실제 GPU 결과를 주장하지 않는다. 원본 네 Engineering Test Script의 기대 동작은 바꾸지 않았다.

## 유지할 Contract

- Game과 Engineering의 Schema/DB/Backup/Version을 독립 유지한다.
- 보상은 최초 Clear Receipt 한 개만 허용하고 Restore 시 결과/원장을 재계산한다.
- 배치 Count만 Capacity에 Mapping한다. Rack 이동 거리, XP, Stars는 성능 변수가 아니다.
- 미래 Model/Unknown/Invalid Architecture를 Pass 또는 Measurement Verified로 표시하지 않는다.
- Three/WebGL 실패가 Game/2D/Physics/Save를 막지 않도록 한다.
- 사용자가 필요한 두 Backup을 각각 만들 수 있게 안내한다.

## Known Issues / 미검증

실제 초보자 Usability, 회사 PC 정책, Android 실기기, Safari/Firefox, 실제 GPU WebGL은 NOT TESTED다. Game World는 2.5D SVG이며 Lab의 3D는 기존 Three.js다. Scale-up/Storage/Power/Cooling/벤더 Benchmark/DC CPO 성능 매핑은 미구현이다. Bridge는 interface-only다. Game Text Backup은 5 MB 제한이다. Archive는 누적되므로 브라우저 Quota가 부족하면 저장 실패를 표시한다. 서로 다른 file Origin/프로필/PC 사이 자동 저장 호환을 보장하지 않으며 Text Backup을 사용한다. Game History는 최근 200개 명령이고 DB에는 별도 Revision/Archive가 있다.

다음 개발은 NEXT-DEVELOPMENT-PLAN.md의 실제 사람 검증과 소수의 Pluggable Optics 미션을 우선한다.
