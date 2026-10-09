# AI Data Center Tycoon v0.3.0 Source

단일 Offline HTML의 실행 안내는 docs/START-HERE-v0.3.md, 구조는 docs/ARCHITECTURE-v0.3.md를 보세요. Source/Release 0.3.0, Game Schema 1/DC Model 1.0.0, 보존된 Engineering Core 0.2.0/Schema 2를 구분합니다.

GitHub Source 등록본에서는 `node_modules/`를 제외했습니다. Node.js 24 환경에서 `npm ci`로 lockfile 기반 빌드 의존성을 설치한 뒤 `npm run build`로 실행용 HTML을 재현합니다. 의존성 설치에는 npm 접근이 필요하지만, 생성된 HTML을 브라우저에서 실행할 때는 CDN/API/Network/Node가 필요하지 않습니다.

Golden Test: `node tests/golden.cjs`, `node tests/p2-golden.cjs`, `node tests/game-golden.cjs`, `node tests/release-integrity.cjs`. Browser 검증에는 별도 Playwright/Chromium 경로를 환경변수로 설정합니다. 상세한 상태는 docs/REGRESSION-v0.3.md와 evidence의 JSON에 있습니다.

원본 Engineering source/test/native HTML은 변경하지 않았습니다. 게임은 `src/game-*`, `src/dc-simulator.ts`에 추가했습니다. `docs/baseline-v02`는 이전 버전의 권위 있는 문서이며 현재 Release의 완료 주장과 구분합니다.

## GitHub development workflow

- `main`: imported authoritative v0.3.0 Source; keep as stable baseline.
- `feature/v0.4-network-optics`: v0.4 Mission 04–06 development. Begin changes on this branch.
- `.github/workflows/verify.yml`: Node 24 install/build, Legacy Golden, P2 Golden, Game Golden, Release Integrity; browser tests are **not** included. CI run status must be checked separately.
- See [Issue #1](https://github.com/legendnever-collab/ai-dc-tycoon/issues/1) for the v0.4 roadmap.
- Keep legacy v0.2 engineering core and its database independent from game progression. Do not mark educational forecasts as measured data.
