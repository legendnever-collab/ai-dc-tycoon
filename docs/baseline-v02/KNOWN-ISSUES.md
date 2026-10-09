# Known Issues / Scope — v0.2.0

- 지정 Loss와 Lane당 Power의 Analytical / Simplified, Uncalibrated 모델입니다. MZM/EAM Vπ/ER/EO/temperature, BER/Eye/TDECQ, measured receiver, temperature solver, CMT, Yield/Monte Carlo/Pareto/추가 Campaign은 미구현입니다.
- Graph는 virtual WDM Channel Bundle이며 wavelength nm/spectral MUX/coherent recombination을 표현하지 않습니다. FAU Count는 논리 allocation이지 실물 단자 수나 치수 검증이 아닙니다.
- Path당 단일 Splitter Stage/fanout1–8을 지원하며 Cascade는 Error입니다. Legacy fanout9–64는 원래 Solver로 보존하지만 Graph preset은 compileGuard로 성공을 차단합니다. 지원 범위로 Template을 다시 적용해야 합니다.
- Multi-branch FAU allocation은 explicit custom count/first/stride입니다. Global tx를 바꿔도 자동 재분배되지 않습니다. Component Binding/Template을 사용하세요. Inspector는 Bound/Custom/미연결 Global을 표시합니다.
- Physical Routing은 중심 anchor/waypoint polyline입니다. 자동 router/실물 bend-radius/DRC/modal solver가 아닙니다. route.enabled를 끄면 manual length입니다. Coupler Geometry는 loss calibration에 사용하지 않습니다.
- 3D는 개념적 envelope이며 겹침이 가능합니다. Collision은 Hard Constraint가 아닙니다. 수직/회전/치수는 Inspector, 평면은 Move/Place drag입니다. Selection은 raycast 또는 dropdown입니다.
- 많은 Node의 전체 Fit는 글자가 작습니다. Zoom/Pan/Inspector Port 버튼을 사용하세요. Mobile은 세로 Scroll/click-to-connect이며 Library도 Scroll됩니다.
- Undo/Redo는 최근50 edits입니다. 삭제된 선택은 비워지며 Undo가 항상 이전 selection을 복원하지는 않습니다. Graph/Parameter/Geometry는 복원합니다.
- Backup은 모든 Archive를 포함하여 커질 수 있습니다. IDB quota/corporate policy/file origin/profile은 외부 환경입니다. 저장 실패는 표시되며 별도 Text Backup을 보관하세요. 자동 Migration은 테스트 환경의 공유 file origin에서 검증했고 다른 환경에서는 Paste Restore가 필요할 수 있습니다.
- Source offline esbuild binary는 Linux x64입니다. 다른 OS source build에는 matching esbuild0.25.10 binary가 필요합니다. 실행 HTML은 build 환경과 독립입니다.
- Linux Chromium153/software WebGL2에서 3D를 검증했습니다. 회사 PC/Android 실기기/Hardware GPU/다른 Browser/WebGL1-only 환경은 NOT TESTED입니다. WebGL2가 불가하면 2D/Solver를 유지합니다.
- 최대 크기 Graph/50MB Backup/장기 quota exhaustion/multi-project/다른 Browser 호환성은 NOT TESTED입니다.

다음은 P3 Device/Tx-Rx/Thermal 확장입니다. 이번 Release는 P3+ 기능이나 측정 검증을 주장하지 않습니다.
