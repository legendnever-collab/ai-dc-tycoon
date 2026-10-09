# Optical Engine Model — v0.6

Model `guided-oe-educational-1.0.0`, Workshop Schema1, Design0.6.0. 기존 core0.2.0 / graph-compact-1.0.0 / graph-compiler-1.0.0을 그대로 사용합니다. Lane count와 Rate는 Architecture 선언이며 실제 EO bandwidth 결과가 아닙니다.

## Boundaries and units

기존 외부 `els-001.out`부터 Modulator→Waveguide→Bend→Coupler→외부FAU→Fiber/Connector→`remote-rx.in`까지의 평균 광파워 기준입니다. 8 Tx fibers×1 wavelength×100Gb/s =800G gross, 패키지4개OE와 별개입니다. 내부 Laser를 중복 생성하지 않습니다. compiler ELS Node는 같은 기존 외부 ELS의 경계 표현입니다.

M11은 Modulator 출력에 붙은 명시적 zero-loss 임시8-channel Meter Fixture를 사용합니다. M12의 실제 FAU/Fiber/Receiver와 별도 Stage/Hash/Reference Plane입니다. M10은 유효한 외부CW 연결과 dBm/mW/WPE 관계만 판정하고 완전한 Tx Graph PASS를 주장하지 않습니다.

|Input|Educational preset|Unit|
|---|---|---|
|Launch per channel|Low−3 / Balanced3 / High10|dBm|
|WPE|0.2|fraction|
|MZM / EAM IL|3 /4|dB|
|Waveguide alpha|0.5|dB/cm|
|Balanced route|4 +4Bends|cm / count|
|Bend loss|0.1|dB/bend|
|Edge / Grating IL|1 /3|dB|
|Fiber/Connector|1|dB|
|Remote sensitivity|−10|dBm|

Balanced MZM/Edge Golden: Total Loss7.4dB, Launch3dBm, Received−4.4dBm, Margin5.6dB. Short1cm/1Bend: Loss5.6dB, Receive−2.6dBm, Margin7.4dB. Long14cm/8Bends: Loss12.8dB, Receive−9.8dBm, Margin0.2dB; fails3dB objective.

Received=Launch−active-path losses; Margin=Received−Sensitivity. Original compiler counts each stage once. Unconnected components invalidate Graph and cannot contribute an artificial loss. Unknown propagates as null.

Laser optical power=8×10^(Launch/10)mW /1000; Laser DC=optical/WPE. With3dBm/.2, allocation≈0.07981W. Detailed Workshop DC includes Driver, independent Rx TIA reference, Control and Thermal Control. It is not added to or substituted into v0.5 Package96W ledger; no double ELS sum and no DC calibration claim.

Compiler requires both Tx/Rx topology. Independent RxSource→FAU→PD→TIA→electrical host is a declared reference fixture with Unknown incoming power. Rx margin and full bidirectional validation remain Unknown. M12 qualifies only the designed Tx educational budget. BER/Eye/TDECQ/Vπ/ER/EO response/CMT/Temperature/Yield/Reliability remain Not Modeled.

Supplied OIF Co-Packaging3.2T IA pp7–9 supports logical functional boundaries/external laser, not these numerical presets. Supplied internal connectivity report informs boundary separation; proprietary organization/vendor claims are excluded from distribution.
