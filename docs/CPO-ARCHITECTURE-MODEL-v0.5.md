# CPO ARCHITECTURE MODEL — v0.5.0

CPO는 Protocol이 아니라 ASIC에 가까운 Optical Interface Architecture입니다. Game Model `cpo-educational-1.0.0` / Chapter03 Schema1은 기존 `traffic-solver.ts`를 재사용합니다. 독립 Experimental Network Model을 Gameplay에 연결하지 않습니다.

## 동일 비교 Boundary

동일 800 Gb/s Nominal Path, 80% Effective Throughput(640 Gb/s), 각 Path 22000 Gbit Traffic Demand, Compute 40s를 사용합니다. 2/4 Paths 비교에서도 해당 주문의 동일 Demand를 유지합니다. Job Time은 Compute와 실제 Network 경로 시간의 최대값이며 CPO 자동 Speed Bonus가 없습니다.

포함 전력: 로컬 ASIC Core + 로컬 Electrical I/O + Optical Conversion + Laser DC Input. 원격 Endpoint, Compute Rack, Cooling은 모든 Architecture에서 동일하게 제외합니다. Laser DC Input과 Laser 광출력을 중복 합산하지 않습니다. Cost는 게임 Credits이고 Space는 교육용 Package mm² / Front-panel units입니다.

| Parameter | 교육용 값 / 관계 | Evidence |
|---|---|---|
| ASIC / OE Conversion / ELS | 40 W / 장착 OE당 8 W / 공유 ELS 16 W 1회 | Educational Assumption |
| Compact / Wide Region | 120×120 / 220×220 mm | Educational Assumption |
| ASIC footprint / OE footprint | 40×40 / 10×10 mm | Educational Assumption |
| Near / Far routed electrical reach | ASIC Edge 기준 Manhattan 20 / 70 mm | Educational Assumption |
| Electrical Power | 장착 OE Reach당 0.1 W/mm | Educational Assumption, 실측 Calibration 없음 |
| OE Presets | 8×100G Electrical Input / 400 또는 800G Optical Output | Educational Assumption, Vendor Interface Spec 아님 |
| Fiber Fixture | 매칭된 교육용 1m Tx/Rx | Educational Assumption |
| Optical Loss / Margin | null / Unknown | 계산·측정하지 않음 |

OE를 장착하면 사용 여부와 관계없이 Cost/Power에 반영합니다. Capacity는 Electrical + CW Laser + Optical Tx/Rx + 호환 Remote Endpoint + 선언된 Fixture + 필요한 Installed Gate를 모두 만족하는 Active Link에서만 생성됩니다. 400G OE는 현재 고정 800G Remote Endpoint와 호환되지 않습니다. Lane/Rate/Type/Direction/Port Occupancy를 검증하며 잘못된 Typed Connection은 저장할 수 없습니다. ELS 없이 Optical Transmission을 만들지 않습니다.

`Unknown`은 Hard Gate를 통과하지 않습니다. 사용자가 명시한 Fixture는 `Assumed-compatible`로 분리되며 교육용 Structural Mission만 통과할 수 있습니다. 실제 Hardware Optical Feasibility PASS / Loss / Margin은 주장하지 않습니다. OE를 ASIC에 가까이 배치해도 Optical Loss가 자동 감소하지 않습니다.

## Stable Object Contract

`dc-world → switch-rack-001 → cpo-switch-001 → package-001 → region-001 → asic-001 / oe-001…004`. ELS와 FAU Interface는 Rack Boundary에 속합니다. 모든 View는 같은 `PackageConfig`와 Graph를 렌더링합니다. 그림은 Graph의 mm 좌표를 Pixel로 변환하며 CSS 거리를 다시 계산에 입력하지 않습니다.

Future `OpticalSolverContract`는 Model Version / Package Hash / Evidence Class / Unknown·Assumed·Verified·Invalid / nullable Loss·Margin / Active Path IDs / Power Boundary / Lab Reference를 받습니다. v0.5는 Verified를 반환하지 않습니다. Lab Reference는 Hardware/OE/Design Stable ID, Schema2, Version0.2.0, Snapshot SHA256, reference-only 상태를 저장하며 Lab Source/Storage/Physics를 수정하지 않습니다.

## 공개 문서와 가정의 구분

검토 자료: OIF-Co-Packaging-3.2T-Module-01.0 pp7–9(ASIC/OE 역할 및 Laser Architecture), OIF-ELSFP-02.0 pp9–10(외부 교체형 Laser Boundary), OIF-EEI-COI-WP-01.0 pp14–17(Electrical Interface 위치 구분). 이 문서는 기능적 Boundary의 **Publicly Documented Reference**이며 위 게임 수치의 근거가 아닙니다. 첨부 Connectivity Report의 내부 조직 정보나 Vendor 수치는 배포물에 넣지 않았습니다. Engineering Estimate와 Measured Evidence 기반 숫자는 이번 Release에 추가하지 않았습니다.
