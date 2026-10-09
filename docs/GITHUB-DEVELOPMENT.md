# GitHub Development Workflow

## Baseline
- `main`: AI Data Center Tycoon v0.3.0, released game plus preserved Engineering Lab v0.2.0.
- `feature/v0.4-network-optics`: Chapter 2 missions 04–06 and network/pluggable model.
- Do not mix the unfinished v0.4 Work recovery into `main` unless confirmed valid.

## Source/build
- `src/`: source-of-truth TypeScript, HTML templates and CSS.
- `tests/`: numerical and browser tests, fixtures.
- `docs/`: design and handoff; `evidence/`: historical test evidence.
- `ai-dc-tycoon-v0.3.html`: tested, standalone offline release artifact.
- `src/lab-baseline.html`: byte-pinned v0.2 engineering lab. Keep intact.
- Build prerequisites for Linux runner: Node.js 24, `npm ci`, `npm run build`.
- Runtime remains standalone offline; `npm ci` is a development dependency setup command.
- CI runs golden tests; browser/UI regression requires provisioned Chromium/Playwright and must be separately executed.

## Required PR workflow
1. Branch from confirmed clean `main`.
2. Implement a mission or one model change at a time, with tests and docs.
3. Commit after every passing logical unit.
4. Record Golden/Browser tests separately as PASS / FAIL / NOT TESTED.
5. Open PR and review changes; merge only after acceptance.
6. Freeze a tagged stable release.

## Security
Keep repo private and verify company policy before committing proprietary internal information, vendor NDA documents, credentials or real data. No tokens or personal backups in Git.

## Stalled v0.4 Work
Treat any unverified partial output as an untrusted recovery artifact. Do not delete `main` or overwrite the v0.3 baseline. Store verified recovery material only on a separate branch and describe changed files and test coverage.
