# AI Data Center Tycoon v0.3.0 Source

단일 Offline HTML의 실행 안내는 docs/START-HERE-v0.3.md, 구조는 docs/ARCHITECTURE-v0.3.md를 보세요. Source/Release 0.3.0, Game Schema 1/DC Model 1.0.0, 보존된 Engineering Core 0.2.0/Schema 2를 구분합니다.

Node가 설치된 Linux x64에서 `node build.cjs`로 재현합니다. 빌드 의존성은 ZIP에 포함되어 Runtime/Build CDN이 필요하지 않습니다. 다른 OS에서는 해당 esbuild binary를 준비해야 합니다. ZIP 해제가 실행 권한을 보존하지 않았다면 `chmod +x node_modules/@esbuild/linux-x64/bin/esbuild`를 적용하세요. 브라우저 실행에는 Node가 필요하지 않습니다.

Golden Test: `node tests/golden.cjs`, `node tests/p2-golden.cjs`, `node tests/game-golden.cjs`, `node tests/release-integrity.cjs`. Browser 검증에는 별도 Playwright/Chromium 경로를 환경변수로 설정합니다. 상세한 상태는 docs/REGRESSION-v0.3.md와 evidence의 JSON에 있습니다.

원본 Engineering source/test/native HTML은 변경하지 않았습니다. 게임은 `src/game-*`, `src/dc-simulator.ts`에 추가했습니다. `docs/baseline-v02`는 이전 버전의 권위 있는 문서이며 현재 Release의 완료 주장과 구분합니다.
