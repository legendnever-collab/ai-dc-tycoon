# ARCHITECTURE — v0.5.0

기존 game-app.ts / Chapter2 runtime / v0.2 Engineering Source는 Frozen Boundary입니다. `campaign-entry.ts`는 복원 Journal을 먼저 검증·재개하고 나서 기존 App과 `chapter3-app.ts`를 로드합니다. Interrupted Restore가 있으면 Legacy Autosave보다 먼저 Roll Forward하며 Concurrent Conflict / Future Journal이면 Boot 자체를 차단합니다.

- cpo-schema/model: Stable Hierarchy / Typed Port / Physical Placement / Single Component Ledger / Existing Traffic Solver Adapter.
- chapter3: Deterministic Commands / Sequential Gates / Clear Provenance / First Reward / Replay / Refund.
- chapter3-app/style/shell-v05: 동일 Config의 Multi-scale View, Guided Mobile Assembly, 한국어 Diagnosis, Before/After, Preview.
- campaign-storage: Profile-linked Chapter3 State와 통합 Backup/Checkpoint, 기존 Game/Chapter2 Head와 Lab DB는 독립 유지.

## 저장 및 Migration

v0.3와 v0.4 Primary DB Schema/값을 자동 변환하지 않습니다. Chapter3 Sidecar는 기존 Player Profile ID로 연결됩니다. 통합 Campaign Text는 기존 Chapter1/Chapter2 Backup을 그대로 Nested String으로 포함하고 Chapter3 Backup을 더합니다. 기존 Chapter1 단독 Import는 다른 Profile이면 비어 있는 후속 Chapter를 생성하고, 같은 Profile이면 후속 Progress를 유지합니다. 기존 Chapter2 Import는 Profile 일치를 요구합니다.

Restore는 세 DB에 대한 단일 ACID Transaction이 아닙니다. 먼저 모든 Target을 검증하고 `prepared` Journal을 저장합니다. 각 Store는 compare-and-swap으로 Expected Original을 확인하고, 이전 Raw를 Immutable Archive / LKG에 보존합니다. 모든 Write 후 `committed`를 기록합니다. Interrupted Restore는 다음 Boot에서 남은 Write를 재개합니다. Before/After 어느 쪽도 아닌 Current Raw를 발견하면 자동 덮어쓰기를 차단합니다. 명시적 Cancel은 Current Primary Heads를 변경하지 않으며 이후 유효한 Backup 복원으로 일관성을 회복할 수 있습니다.

Autosave / Schema Validation / Checksum / LKG / Journal은 각각 별도 Tests로 검증합니다. Future Schema나 Head/LKG 모두 손상된 경우 조용히 Reset/Autosave하지 않습니다. 지원되는 명시적 Backup 복원은 Unsupported Original도 Immutable Archive로 보존합니다. Campaign Checkpoint와 LKG도 같은 Profile임을 확인합니다. 원본 Lab Design DB는 Campaign Restore 대상이 아닙니다.

## Release provenance

빌드는 v0.3/v0.4 HTML을 Byte-exact하게 보존하고 v0.5를 추가합니다. `package-v05.cjs`는 Git-tracked Source와 Build Outputs를 묶고 Manifest에 Source Commit / Version / 모든 Source SHA256 / 세 HTML SHA256 / Lab SHA256을 기록합니다. Source ZIP의 Clean Rebuild는 고정된 설치 Dependencies를 재사용하여 Byte Parity를 검증하며 새로운 기기에서는 `npm ci`가 필요합니다.

main은 v0.3 Stable Baseline입니다. v0.4 PR #2가 Open이므로 v0.5는 v0.4 Feature 위에 Stacked PR입니다. 기존 PR을 Merge하지 않습니다.
