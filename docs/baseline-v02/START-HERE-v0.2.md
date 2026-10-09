# Optical Engine Tycoon v0.2.0 — START HERE

optical-engine-tycoon-v0.2.html을 로컬 브라우저로 여세요. 설치/CDN/API/로그인이 필요 없는 단일 Offline HTML입니다. Release0.2.0 / Schema2 / Graph Compact1.0.0 / Legacy Link1.0.0.

기본 설계: 16 Tx Fiber×2 Wavelengths×100 Gb/s=**3.2 Tb/s**, Margin **5.8 dB**, Power **17.81924197039502 W**. Net는 efficiency 미정으로 Unknown입니다. SIMULATED PASS는 측정 검증/OIF Compliance가 아닙니다.

## 3분 Builder 체험

1. Component dropdown에서 mod·MZM을 선택하고 IL을 3→4dB로 바꾼 뒤 입력 밖을 클릭합니다. Margin5.8→4.8dB, Δ, Undo/Redo를 확인합니다.
2. wg·Waveguide를 선택해 **선택 삭제**. Missing Connection으로 Mission FAIL/Graph Error가 표시됩니다.
3. mux를 선택해 **OUT→out**, bend를 선택해 **→IN in** Port를 누릅니다. 실제 WG가 빠진 경로로 계산되어 Margin6.0dB가 됩니다. SVG 원형 Port를 drag하거나 클릭해도 연결합니다.
4. Library Component를 클릭해 배치합니다. Optical/Electrical 미연결 객체는 오류를 만들며 연결 후 계산에 참여합니다. Mechanical은 개념적 Placement입니다. Undo가 가능합니다.
5. **3D Builder/둘 다**. Rotate/Pan에서 drag=회전, wheel=zoom, 우클릭drag=pan. Move/Place에서 x/z mm 이동, Inspector에서 y/rotation/size를 수정합니다. 2D/3D/Inspector 선택이 동기화됩니다.
6. Cosmetic 이동은 KPI 불변입니다. Physical Routing은 enabled WG의 선언한 start/end/waypoint 길이×alpha만 전달합니다. 가까운 Geometry로 Coupling Loss가 자동 개선되지 않습니다.

## 빈 Graph에서 조립

새 빈 Graph는 Mechanical envelope를 유지하며 Signal Graph를 비웁니다. Undo로 복구할 수 있습니다. Library Category와 Tx/Rx를 선택하고 아래 최소 Chain을 구성합니다.

- Tx Optical: ELS→MZM/EAM→FAU→Remote Receiver Boundary.
- Tx Electrical: Package Electrical Interface(Tx)→Driver→Modulator drive.
- Rx Optical: Rx Optical Boundary→FAU(Rx)→Photodetector.
- Rx Electrical: PD→TIA→Package Electrical Interface(Rx).

WG/MUX/DEMUX/Coupler 등 지정 Loss stage를 추가할 수 있습니다. 호환되지 않는 Port는 endpoint/조건을 표시하며 거부합니다. 실제 Channel count/rate는 해당 FAU의 Bound/Custom 값입니다. Trace에서 Tx/Rx/Channel을 선택합니다.

## 저장 / Migration

자동 저장 표시를 확인하세요. IDB 차단/실패 시 Text Backup 전체 JSON을 별도로 복사하세요. Paste Restore는 schema/checksum/range를 검증하고 실패하면 현재 Design을 유지합니다. Multipart는 모든 Part를 한 번에 붙여넣습니다.

같은 Browser file origin의 v0.1 DB를 자동 복사하며 원본 DB는 변경하지 않습니다. 다른 PC/위치/Browser에서는 v0.1 Backup을 붙여넣으세요. 이전 결과는 Legacy Parameter Mode로 보존합니다. Graph Solver 활성화/Engineering edit로 Graph Mode를 사용할 수 있습니다. v0.1 원본으로 Rollback하면 원래 Legacy 입력으로 돌아가며 현재 Graph도 Archive에 보존합니다. Future Schema는 읽기 전용입니다.

Global은 Binding된 Component에만 반영됩니다. Custom/Multi-branch allocation은 독립이며 Inspector에 표시합니다. Template은 Graph를 다시 만들고 Undo가 가능합니다. Legacy fanout9–64의 Graph 자동 변환은 차단합니다.

Chromium file:// Offline/Desktop/390px·320px viewport를 검증했습니다. 회사 PC/Android 실기기/Hardware GPU는 NOT TESTED입니다. 상세 증거는 REGRESSION-v0.2.md, 범위는 HANDOFF의 KNOWN-ISSUES.md입니다.
