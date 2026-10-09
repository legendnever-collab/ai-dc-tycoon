# Data Model — Schema 2 / Release 0.2.0

Authoritative types: src/schema.ts. Units/ranges: src/legacy-core.ts와 src/graph.ts. Validator: src/core.ts.

| Entity | 주요 fields / 의미 |
|---|---|
| Design | schemaVersion2, version0.2.0, id/name/revision/family/mode/mission/seed |
| Modes | solverMode graph/legacy-parameter; geometryMode cosmetic/physical-routing |
| Global Parameter | value:number/null, unit/evidence/source; v0.1 27개 입력 보존 |
| Component Parameter | 위 metadata + optional ref; ref는 같은 Unit Global, 없으면 custom value |
| Node | id/type/label/flow/modelId/ports/parameters/schematic/geometry/dimensions/route |
| Geometry | x/y/z mm, rotation degree, dimensions mm |
| Route | enabled, start/end Node ID/null, waypoint x/y/z mm, unit mm |
| Port | id/kind/direction/signal/required/plane |
| Connection | unique id, from/to component/port ID |
| Graph | components/connections; optional compileGuard for unsupported legacy conversion |
| Migration | full Schema1 original, sourceSchema1/sourceVersion0.1.0; legacyGraph 별도 보존 |
| Editor | selectedId, 2d/3d/split view, undo/redo EditState arrays 각 최대50 |
| History | revision/time/scalar inputs/command/graphHash/modelVersion |
| Path | Tx Ffiber-Llambda / Rx Rfiber-Llambda, source/sink, nodes/edges, rate, loss planes, launch/received/margin, sourceGroup |
| Compiler | valid/diagnostics/warnings/unknownFlows/hash/version/paths/dependencies/passive/aggregates |
| Result | full native input/seed/modelVersion/mode/KPI/constraints/score/issues/compiler/rxChannels |

Graph Gross는 연결된 Tx Channel별 Lane Rate 합입니다. Legacy Gross는 Tx×WDM×Rate입니다. Net는 explicit efficiency가 있을 때만 계산합니다. Unknown allocation은 해당 Flow aggregate를 Unknown으로 유지하며 partial Path를 전체로 표시하지 않습니다. Local Rx incoming power는 별도 입력이며 기본 Unknown입니다.

Registry 26 types: ELS/Splitter/MZM/EAM/WG/Bend/Crossing/MUX/DEMUX/Grating·Edge·EvanescentCoupler/FAU/FiberLink/ReceiverBoundary/RxSource/PD/Driver/TIA/ElectricalLane/ElectricalConnector/PIC/EIC/Package/PhotonicSubstrate/ThermalInterface. 확장 시 registry/model/port validation을 함께 추가합니다. Arbitrary imported model/port는 거부합니다.

Native Backup: format OpticalEngineTycoon, schemaVersion2/appVersion0.2.0/hashAlgorithm SHA-256/checksum/payload={design,archive}. Checksum은 손상 탐지이며 서명/측정 인증이 아닙니다. Legacy FNV envelope는 기존 parser 검증 후 변환합니다. Schema0는 원래 P0 fixture 형식만 지원합니다.

Multipart Part: whole id/hash, index/total, checksum/data. 모든 Part를 함께 붙여넣으며 순서는 재정렬할 수 있습니다. 누락/중복/혼합/손상은 거부합니다. Restore50MB, Archive10,000, Graph1,000 Nodes/3,000 Edges, route1,000 waypoints의 validation limits는 최대 규모 성능 검증을 뜻하지 않습니다.

Undo snapshot은 numerical/graph/geometry를 보존하며 selection/view는 별도 저장합니다. Undo도 revision을 증가시킵니다. Archive는 nested Undo/History를 제거한 독립 snapshot이고 Head는 Undo/Redo를 보존합니다.
