# Regression — v0.7.0

## 검증 범위와 결과

v0.6 main `02fd07ddf5ccb1c76d66f157abb4094aa893da7a`을 감사한 뒤 기존 deterministic baseline 371개를 실행했다. 최종 build에서 기존 release integrity14개와 신규 Chapter5 / Storage / Progress / Artifact46개를 추가 실행했다. 최종 deterministic **431 PASS / 0 FAIL**.

| 검증 그룹 | PASS | 내용 |
|---|---:|---|
| Existing Engineering / Chapters1–4 baseline | 371 | 13 original suites, exact numerical fixtures and byte guards |
| Original v03/v04/v05 release integrity | 14 | Frozen package/model version boundaries, old executables, inline/CSP |
| Chapter5 golden | 22 | Interface reference planes, scalar solver parity, Gaussian/pitch, sixteen typed paths, Unknown, rewards/tamper |
| Protected Substrate storage | 16 | v05/v06 migration, checksum/profile/CAS/future/LKG, five-head interrupted restore and cancellation |
| Campaign progress / Learn | 5 | Gates, Current/Completed, all five structured chapter sources |
| v07 artifact integrity | 3 | Original Workshop/Lab byte preservation; single HTML title/model/CSP |
| Desktop offline browser | 16 | Learn1–5, Tech, ELS next/load, Why4OEs, Missions13–15 failure/clear, backup/reload/source stale, Lab |
| Mobile touch browser | 7 | 390px/320px five-screen Navigator, Learn, touch fixture/alignment/replay, no overflow |
| Real IndexedDB browser | 6 | Five heads, corruption recovery, future original export, protected restore, two real tabs/CAS |
| Legacy gameplay in v07 | 14 | Actual Mission01–12 controls, original times/rewards/power/margin, Lab default solver, offline errors |

Browser 총 **43 PASS / 0 FAIL**. Desktop1440×1100, touch390×844 / 320×844. Node24.19.0, Playwright, Chromium153.0.8010.0 in this execution environment. Browser contexts are explicitly offline; all tested gameplay / Learn / Lab flows report **0 HTTP requests / 0 JavaScript exceptions**. Reduced-motion preference is exercised for deterministic visual capture. Custom packaged Chromium uses CPU rasterization (`--disable-gpu`) while original Lab WebGL/solver remains executable. Standard GitHub Actions uses installed Chromium.

## 실제 확인한 중요한 수치

- Original Mission01/02/03 completion:30s / 60s / 120s. Existing first-clear economy unchanged.
- CPO Package:2560G effective / 96W / 40s, preserved after new gameplay.
- OE M11:3dB modulation loss / 800G. OE M12:7.4dB margin.
- M13 edge interface:4dB loss, −1dBm PS input virtual meter. No downstream FAU/fiber counted at this plane.
- Centered compact full route:6.56dB loss, −3.56dBm Rx, 6.44dB worst margin.
- M15:16 distinct spatial paths ×50G =800G,16 active channels; diagnostic9.659620985W is outside original Package96W accounting.
- Original Advanced Lab:3200G gross,5.8dB margin,−4.2dBm received; re-solve equals same baseline result.

## Evidence / 재실행

`evidence/v07-baseline/` retains the original baseline and individual frozen results. `evidence/v07/` contains final structured results, logs, build evidence and browser reports. `screenshots-v07/` contains11 actual executable captures, including320px /390px full-page prototypes. PNG hashes and source hashes are recorded in release manifest.

```bash
npm ci
npm run build
npm run test:v07
# Install Playwright/Chromium separately for browser tests:
npm install --no-save --no-package-lock playwright@1.56.1
npx playwright install --with-deps chromium
npm run test:v07-browser
GITHUB_SHA=<actual-published-source-commit> npm run package:v07
```

The existing `.github/workflows/verify.yml` remains. `.github/workflows/v07.yml` runs all baseline model suites, new deterministic checks, four bounded browser groups and archive generation. Local successful runs are evidence for this candidate; remote CI status is reported separately.

## 판정의 한계

Chromium touch emulation does not verify physical Android, browser-specific file origin behavior or human usability. These remain **NOT TESTED**. Numerical substrate presets are uncalibrated Educational Assumptions; passing Missions is not manufacturing, vendor or reliability qualification. Initial software GPU capture attempts stalled; final CPU-raster browser runs completed with executable assertions, original Lab results and genuine screenshots. See `KNOWN-ISSUES-v0.7.md`.
