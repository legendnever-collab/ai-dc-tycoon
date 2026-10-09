# AI Data Center Tycoon

현재 개발 Release는 **v0.6.0 · Chapter 4 — Optical Engine Workshop**입니다. 실행 안내: [START-HERE-v0.6](docs/START-HERE-v0.6.md), 검증: [REGRESSION-v0.6](docs/REGRESSION-v0.6.md), 모델: [Optical Engine Model](docs/OPTICAL-ENGINE-MODEL-v0.6.md).

`npm ci` → `npm run build`로 Offline v0.3/v0.4/v0.5/v0.6 HTML을 생성합니다. 기존 Mission01–09와 Advanced Photonics Engineering Lab을 보존하고, Mission10–12에서 Laser → Modulator → Waveguide → Coupler → FAU → Fiber → Receiver를 조립합니다. 기존 Typed Graph/Solver로 선택한 OE의 교육용 Tx Link Budget을 계산합니다. Rx/BER/Eye/미지원 물리는 Unknown이며 실측 검증으로 승격하지 않습니다.

개발 Branch: `feature/v0.6-optical-engine`, [PR #4](https://github.com/legendnever-collab/ai-dc-tycoon/pull/4). v0.4 PR #2와 v0.5 PR #3은 이미 main에 병합되었습니다. v0.6은 사용자 검토 전까지 main에 병합하지 않습니다. Package Version0.3.0은 Frozen Legacy Core이고 실행 파일 Release는0.6.0입니다.

## 기존 v0.3/v0.4 안내

# AI Data Center Tycoon v0.3.0 Source

단일 Offline HTML의 실행 안내는 docs/START-HERE-v0.3.md, 구조는 docs/ARCHITECTURE-v0.3.md를 보세요. Source/Release 0.3.0, Game Schema 1/DC Model 1.0.0, 보존된 Engineering Core 0.2.0/Schema 2를 구분합니다.

GitHub Source 등록본에서는 `node_modules/`를 제외했습니다. Node.js 24 환경에서 `npm ci`로 lockfile 기반 빌드 의존성을 설치한 뒤 `npm run build`로 실행용 HTML을 재현합니다. 의존성 설치에는 npm 접근이 필요하지만, 생성된 HTML을 브라우저에서 실행할 때는 CDN/API/Network/Node가 필요하지 않습니다.

Golden Test: `node tests/golden.cjs`, `node tests/p2-golden.cjs`, `node tests/game-golden.cjs`, `node tests/release-integrity.cjs`. Browser 검증에는 별도 Playwright/Chromium 경로를 환경변수로 설정합니다. 상세한 상태는 docs/REGRESSION-v0.3.md와 evidence의 JSON에 있습니다.

원본 Engineering source/test/native HTML은 변경하지 않았습니다. 게임은 `src/game-*`, `src/dc-simulator.ts`에 추가했습니다. `docs/baseline-v02`는 이전 버전의 권위 있는 문서이며 현재 Release의 완료 주장과 구분합니다.

## GitHub development workflow

- `main`: authoritative merged v0.5 baseline `9ba593f993994c79a2814f3493cdab38b4167675`.
- `feature/v0.6-optical-engine`: additive Mission10–12 development.
- `.github/workflows/verify.yml`: Node24 deterministic/integrity tests and separate legacy, CPO, Workshop Browser jobs; executable/source/handoff and actual Browser scene artifacts.
- See [Issue #1](https://github.com/legendnever-collab/ai-dc-tycoon/issues/1) for the v0.4 roadmap.
- Keep legacy v0.2 engineering core and its database independent from game progression. Do not mark educational forecasts as measured data.
