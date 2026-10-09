# Third-party Components — v0.2.0

Three.js 0.180.0와 OrbitControls를 단일 Offline HTML에 번들링합니다. Three.js MIT License는 `node_modules/three/LICENSE`에 포함하며 번들의 legal comments도 유지합니다. Remote asset/CDN/font/telemetry/API는 사용하지 않습니다.

| Dependency | Version | License / location |
|---|---|---|
| TypeScript | 5.9.3 | Apache-2.0, node_modules/typescript/LICENSE.txt, ThirdPartyNoticeText.txt |
| esbuild | 0.25.10 | MIT, node_modules/esbuild/LICENSE.md |
| @esbuild/linux-x64 | 0.25.10 | MIT; Linux x64 build binary |
| @types/three | 0.180.0 | MIT, package LICENSE |
| three | 0.180.0 | MIT, package LICENSE |

Build dependencies와 @types/three의 보조 type dependencies/각 license도 Source ZIP의 node_modules에 포함합니다. App은 Rapier 등 보조 type package를 Runtime 기능으로 사용하지 않습니다. Playwright/Chromium은 검증 환경 의존성으로 배포하지 않습니다. 한국어 QA는 로컬 Noto Sans KR을 사용했으며 폰트 파일은 배포하지 않습니다. Runtime은 사용 PC의 System Font를 사용합니다.
