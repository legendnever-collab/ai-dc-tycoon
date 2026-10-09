# AI Data Center Tycoon

AI Data Center 운영 미션에서 시작하여 Compute Rack, Scale-out Network, Pluggable Optics, CPO, Optical Engine, Photonic Substrate를 학습하는 오프라인 교육용 시뮬레이션 게임입니다.

## Development baseline

- **v0.3.0**: Mission 01–03, Game World, Technology Tree, Reward, Persistence
- **Engineering Lab**: Optical Engine Tycoon v0.2.0 기능 보존
- **v0.4 scope**: Mission 04 Switch Port Crisis; Mission 05 Leaf–Spine Fabric; Mission 06 Pluggable Optical Upgrade
- **Current repository status**: Initial repository structure only. The authoritative v0.3 source has **not yet been pushed**. Do not treat this README or the branch as a completed baseline import.

## Importing the authoritative source

Use `ai-dc-tycoon-v0.3-github-ready.zip` provided in the ChatGPT conversation. **Extract** it, then upload the extracted file tree to the repository `main` branch while preserving directories including `src/`, `tests/`, `docs/`, `evidence/`, `.github/`, and the root build scripts. Do **not** upload the ZIP as a substitute for source files.

The prepared ZIP excludes `node_modules/`. After source import run:

```bash
npm ci
npm run build
node tests/golden.cjs
node tests/p2-golden.cjs
node tests/game-golden.cjs
node tests/release-integrity.cjs
```

For the full browser regression see `docs/REGRESSION-v0.3.md`; test results and browser runtime must be independently verified.

## Development rules

1. Preserve the v0.3 game and v0.2 photonics engineering functionality.
2. Work on `feature/v0.4-network-optics` only **after importing v0.3 source into main**, then rebase/sync that branch.
3. Keep game state and engineering persistence independent.
4. Commit in small increments; do not block indefinitely on backup debugging.
5. Mark unexecuted tests and unresolved bugs honestly.

This repository is private. Do not upload internal company data unless appropriately authorized.
