# Source / Model Register — v0.3.0

Authoritative Baseline은 Optical Engine Tycoon 0.2.0 Source/Executable/HANDOFF와 Regression 122 PASS다. 이번 작업에서 개발 전후 동일한 30 Legacy Golden + 42 Graph Golden + 24 Browser + 26 P2 Browser를 실행했다. 기존 문서/Model Registry/Fixtures는 baseline-v02와 원본 Test Fixture에 보존한다.

DC Simulator의 40 WU/s, 16/64 Gb/s aggregate, 0.5 Gbit/WU, Workload와 Credits는 이 게임의 **명시적인 Educational Fixture**다. 실측 자료, Vendor Data Sheet, NCCL/MLPerf Benchmark, calibrated compact model을 근거로 만들었다고 주장하지 않는다. 공식 제품 Compliance/성능 수치도 없다.

사용자 제공 `AI_DC_Connectivity_CPO_Technical_Report_20260905-1-.docx`의 Scale-up/Scale-out/Training 관련 본문을 읽고 Scope 구분을 검토했다. 목적은 Rack 위치만으로 Fabric을 정의하지 않고 HBM/collective/external traffic을 구분하는 것이다. 본문의 실제 GPU/Network 수치를 Fixture로 복사하거나 해당 Report를 DC 계산 모델의 정량 검증 근거로 사용하지 않았다. 다른 첨부 문서의 미열람 내용을 검증 근거로 제시하지 않는다.

Dependency provenance와 License는 기존 `baseline-v02/THIRD-PARTY.md`와 Source ZIP의 package-lock/node_modules License에 있다. Game World는 자체 SVG/CSS이며 Runtime 외부 asset은 없다. QA screenshot용 로컬 한국어 폰트와 Playwright/Chromium은 배포하지 않는다.
