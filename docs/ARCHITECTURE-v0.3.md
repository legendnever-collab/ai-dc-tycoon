# Architecture / Data Model — v0.3.0

## 모듈 경계

`game-app`(DOM/SVG/연출) → `game-core`(명령/상태/경제) → `dc-simulator`(Deterministic Numerical Solver). `game-catalog`는 미션/Fixture/Hardware/Tech 정의, `game-schema`는 Typed Data, `game-storage`는 Game DB/Backup 검증을 담당한다. Solver는 UI/Three.js/Engineering Graph를 import하지 않는다.

Advanced Lab은 검증된 v0.2 HTML의 byte-identical 내장본을 trusted `srcdoc` iframe으로 실행한다. 첫 클릭에서만 생성하고 화면 전환 시 숨겨 UI 상태를 유지한다. iframe 안의 스타일/DOM/Three.js 코드는 바깥 Game UI와 분리된다. 그 Origin에서 기존 Engineering DB를 읽고 쓴다. 저장 호환성은 실제 file:// Chromium 테스트로 확인했으며 모든 브라우저/회사 정책에 일반화하지 않는다. WebGL이 없으면 기존 2D Builder/Physics Solver fallback을 사용하고 Game SVG World는 영향받지 않는다.

`src/lab-baseline.html` SHA256: `cf7cf6df5d83cc3927d3fb5cef2a320aa507c5c58a6e5d264cedc5c9d5c7947a`. 기존 12개 source module/shell/style와 4개 Regression Script도 byte-identical이다. `docs/engineering-baseline-hashes.json`과 Release Integrity 검사가 이를 확인한다. v0.2를 새 UI로 재구현하지 않았다.

## Version / Schema

| 영역 | Version / Schema | Model |
|---|---|---|
| Release / Game | 0.3.0 / Game Schema 1 | ai-dc-educational-1.0.0 |
| Advanced Lab | 0.2.0 / Engineering Schema 2 | graph-compact-1.0.0 / graph-compiler-1.0.0 |
| Legacy Solver | 0.1.0 / 입력 호환 Schema 1 | 기존 compact model 유지 |

Source ZIP과 Executable의 Release Version은 0.3.0이다. 내부 Engineering Component Version을 0.3으로 다시 이름 붙이지 않고 provenance를 보존한다. 기존 Schema 1→2 migration/Legacy Solver/Archive/LKG 경로는 기존 Lab 코드가 담당한다.

## Game Data

Game: `id`, `revision`, `seed`, `currentMission`, `credits`, `xp`, `world`, `nextRackId`, `missions`, `rewards`, `unlocked`, `selectedHardwareId`, `history`. World의 Rack은 stable ID, Component Type, Slot 또는 Inventory(null), 구매 여부를 가진다. Switch는 stable `switch-001`, T1/T2 Type을 가진다. ID는 반환 후 재사용하지 않는다. Floor Slot 충돌을 거부한다. Slot 위치는 Cosmetic이며 배치 여부만 Compute Count에 Mapping된다.

Mission Record는 phase와 영구 cleared, attempts, bestStars, hintStage, pending/last Result, 이번 시도의 Award를 가진다. Receipt에는 Mission ID, 보상, Revision, 최초 Clear Run의 Input/Hash/Model/Result/Hard Evaluation을 보존한다. Restore 시 Solver 재계산과 Hardware/Cost/Fixture provenance로 Result를 검증한다. Ledger 합계가 Credits/XP/Unlock과 다르면 거부한다.

Simulation Input은 Workload Scope/Fabric/WU/Traffic, Compute Count/Rate, Network aggregate Capacity, 현재 투자 비용, Hardware snapshot, Model Version, Seed다. Simulation Result는 inputHash, known, 두 시간, Completion/Throughput/Waiting/Bottleneck, Issues/Assumptions를 가진다. 동일 입력은 동일 결과를 만든다. 확률 계산은 이 버전에 없다.

`EngineeringBridgeRef`는 Hardware ID와 Engineering Design ID/Schema 2/App0.2/SHA256/Role(CPO Package, Optical Engine, Photonic Substrate)의 **reference-only interface**다. v0.3에는 실제 association 저장/UI/DC Physics Mapping을 구현하지 않았다.

## Persistence / Recovery

Game DB는 `AIDataCenterTycoon-v03`, store `snapshots`다. Head, 직전 정상 LKG, 최근 20 Revision Snapshot, 내용 Hash별 Archive, 손상된 Head의 `recovery-original`을 저장한다. 모든 명령은 순차 Autosave queue로 처리한다. 원본 Head 비교를 같은 readwrite transaction에서 수행해 stale tab의 overwrite를 거부한다. Restore는 명시적 사용자 동작이며 이전 정상 Head도 Archive에 남긴다. In-memory History는 최근 200개 명령으로 제한하지만 저장 Archive는 별도로 보존한다. Quota/IDB 오류를 UI에 표시한다.

Game Backup envelope: `format=AIDataCenterTycoon`, appVersion, gameSchemaVersion, modelVersion, object payload, SHA256(JSON.stringify(payload)). 5 MB 이하, 미래 Version/Schema, 손상, 잘못된 상태/원장/장비를 거부한다. 손상 Head는 LKG로 복구하고 원본을 보존한다. 미래 Head는 자동 덮어쓰기를 중단한다. Head/LKG 모두 invalid이면 Backup 복원을 안내한다. IndexedDB가 막혀도 플레이와 Backup 생성은 가능하며 정상 저장으로 표시하지 않는다.

Engineering DB는 `OpticalEngineTycoon-v02`, 이전 DB는 `OpticalEngineTycoon`으로 별도다. Game Backup은 Engineering Backup을 포함하지 않는다. 두 환경의 Backup 버튼에서 각각 보관/복원하며 Engineering JSON을 Game JSON으로 변환하지 않는다. Game 변경 전후 및 기존 native v0.2 Design을 새 Game에서 열 때 DB bytes/Graph/Result 보존을 Browser에서 검사한다.

## Offline / Security

단일 HTML에 Game JS/CSS와 Lab/Three.js를 포함한다. Runtime CDN/API/Remote Auth/Telemetry/Upload가 없다. CSP는 원격 요청을 차단한다. System Font만 사용한다. 내부 Lab은 번들된 신뢰 코드이며 입력 JSON으로 HTML이나 Script를 추가하지 않는다. DOM에 사용자 텍스트를 넣을 때 escape한다. SHA256 Backup은 보안 인증이 아니므로 hostile user의 로컬 데이터 위조를 막는 게임 서버를 주장하지 않는다.
