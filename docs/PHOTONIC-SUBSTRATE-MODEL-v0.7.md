# Photonic Substrate Model — v0.7

Model: photonic-substrate-educational-1.0.0. Core: unchanged0.2.0 / graph-compact-1.0.0. Evidence: Educational Assumption. Fidelity: Analytical / Simplified. Calibration: Uncalibrated.

## Reference planes and graph

Every channel has a logical allocation from existing external ELS, inherited Modulator/Driver, OE-to-PS interface, PS propagation/bend/crossing, PS-to-FAU baseline, alignment penalty, zero additional FAU loss, external fiber and receiver boundary. Channel IDs F1-L1…F16-L1 are unique. Independent Rx reference remains Unknown for incoming power. Graph nodes are registered core components; PS region is a20×10×1mm mechanical envelope.

M13 omits downstream PS/FAU/fiber losses and terminates at a virtual PS input meter. M14/M15 terminate at remote receiver. Original OE waveguide/coupler/fiber stages are replaced by the new route and interfaces, not counted twice. The inherited modulator/launch/driver parameters are reused.

|Parameter|Educational preset|
|---|---|
|OE-to-PS Edge-like|1.0dB|
|Direct baseline|0.7dB|
|Evanescent fixed-loss preview|1.5dB|
|PS propagation|0.2dB/cm|
|Bend|0.08dB/bend|
|Crossing|0.05dB/crossing|
|Compact route|2cm,2bends,0crossings|
|Serpentine route|14cm,8bends,4crossings|
|PS-to-FAU baseline|1.0dB|
|FAU nominal pitch|127µm|
|Standard Gaussian radius|4µm|
|Tight Gaussian radius|2µm|

Alignment penalty per channel =10/ln(10)×[(x_i/w)^2+(y/w)^2], x_i=x+[i−(N−1)/2]×Δpitch. These radius/window/pitch/loss values are independent assumptions, not fitted vendor measurements. Very large penalty is partitioned across compact loss nodes so core per-node30dB limits do not clamp physical mathematical loss.

Received=Launch−ΣLoss; Margin=Received−Sensitivity. Worst channel controls aggregate loss/margin. Active channels require margin≥3dB. No UI substitute scalar is used. Graph hash and source context hash invalidate displayed current qualification after OE/Package edits. Historical receipts keep the original context for verification.

4×100G starter,8×100G expansion,16×50G slow-and-wide prototype are guided hypothetical channel replication fixtures. They do not physically convert an8×100G OE.16×50G and8×100G both have800G nominal total, with different density and diagnostic DC. Lower lane rate alone does not prove lower power.

Power includes replicated logical ELS allocations, Drivers, independent Rx TIA reference, Control and Thermal-control scalars. It is diagnostic-only and is never added to the preserved96W CPO package or used to claim a measured TCO benefit. Balanced MZM/Edge/zero-offset/compact16×50G:loss6.56dB,received−3.56dBm,margin6.44dB,diagnostic9.659620985W; game fixtures only.

Not modeled: Full-wave EM, measured evanescent gap/overlap/CMT, process variation yield, production reliability, thermal/warpage, BER/EO bandwidth and vendor-specific loss.
