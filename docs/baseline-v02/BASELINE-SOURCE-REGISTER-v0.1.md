# Source Register — v0.1

## Authoritative Requirement

이번 Release의 Product / Physics / Acceptance 요구는 사용자 `CPO Optical Engine Tycoon v0.1 — Master Development Task`입니다. P0/P1에 집중하고 P2 이후를 사용자 승인으로 진행하는 범위를 유지했습니다.

## Attachment inspected for scope

**OIF-Co-Packaging-3.2T-Module-01.0.pdf**, March 29, 2023.

- Section 4 / document pp.16–18: Optical Characteristics, ELS conditions, Optical Test Points. 3.2T arithmetic만으로 Module Compliance를 주장할 수 없다는 범위 구분에 사용했습니다.
- Section 2 / document p.10: Module types. 이 Release의 16 Fiber × 2λ × 100G 사례를 실제 OIF Module Type으로 간주하지 않았습니다.
- SHA-256: `586d0ed09f2e19d49bf92b23bb681c266d63db6c477d9c8e8c6cd6cf1d6a304f`.

기본 수치는 표준의 Requirement를 복사한 값이 아닙니다. Launch / Loss / Sensitivity / Driver / TIA / WPE는 Educational Assumption입니다. Receiver Reference Plane은 P1 Model에 별도로 명시했으며 OIF TPL/TP와 자동으로 동일시하지 않았습니다.

첨부 Coupling 논문 / Device 교재 / OIF ELSFP·CEI·EEI 자료 / 산업 Report는 향후 Model applicability / calibration review의 후보입니다. v0.1은 그 자료에서 검증된 Device Response를 구현했다고 주장하지 않습니다. 원본 PDF / DOCX / PPTX나 전체 추출 텍스트를 Package에 재배포하지 않습니다.
