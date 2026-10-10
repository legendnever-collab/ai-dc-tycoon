# Optical Architecture Model v0.11.0

Model ID/version: `optical-architecture-educational-1.0.0`. Evidence Class: **Educational Assumption / Uncalibrated** for every coefficient, capability index, budget, cost and power value. No imported paper or OIF document calibrates these coefficients.

Three independent dimensions: Spatial Parallelism N=1…16 physical paths, Wavelength Multiplexing λ=1/2/4 per path, per-wavelength Lane Rate R=50/100/200 Gb/s. WDM may combine with either Wide or Narrow. Per-λ I/O channels are N×λ; physical FAU paths are N. Connected physical paths 0…N independently control active throughput.

## Equations and units

| Quantity | Equation | Scope / direction |
|---|---|---|
| Gross | N×λ×R | Installed Gb/s; higher |
| Payload | Gross×η | η=0.8…1 total efficiency applied ONCE; higher |
| Active Gross / Payload | connected×λ×R, then ×η | Only connected paths; constraint throughput |
| Substrate Loss | 0.8 + 0.15 L + 0.03 bends + 0.05 crossings + 0.7 | dB; OE–PS coupling input → FAU output, includes both couplings once |
| OE interface loss | 0.4 | dB, preceding substrate reference plane |
| MUX and DEMUX each | base+0.1 log₂λ | base broad=0.8, narrow=0.5 dB; only λ>1 with a mux |
| Wavelength drift | 0.02×(T−25) | nm, signed operating point; T=−15…85 °C |
| Worst drift | 0.02 max(abs(T−25), Customer excursion) | nm; excursion=10 °C (A/B), 40 °C (C) for Mission21; otherwise 0 |
| Residual drift | worst drift×0.1 with active tuning, otherwise ×1 | nm; zero filter effect for λ=1 |
| Filter penalty | min(30, 3×(residual/halfwidth)²) | dB; halfwidth broad=0.65 nm, narrow=0.25 nm |
| End-to-end loss | substrate + OE interface + MUX + DEMUX + filter penalty | dB, OE input → far-side DEMUX output; lower |
| Optical Loss Reserve | 7 − End-to-end loss | dB; declared loss allowance, **not receiver margin**; higher |
| FAU span | (ceil(N/rows)−1)×pitch/1000 + 0.25 | mm, occupied width per row; rows=1/2, pitch=80…250 µm |
| Footprint | span×(10 L+0.5 rows) + N×0.15λ if mux active | mm² educational routing rectangle + mux allowance, not actual layout |
| Density | Active Gross / Footprint | Gb/s/mm²; higher |
| Source DC | Nλ×0.035×10^(min(loss,15)/10) | W, assumed electrical source DC; saturation at 15 dB is explicit educational cap; NOT launch dBm |
| Driver / electrical | Gross/1000 × p + advanced overhead | W; p=2.5/4/7 pJ/bit at 50/100/200G, advanced adds 0.5 W |
| Tuning | Nλ×0.06×(1+worstDrift/0.2) | W, λ>1 and active mux/tuning only |
| Other | N×0.06 | W, fixed modeled path overhead |
| Total Power | Source DC + Driver + Tuning + Other | W; lower; no cooling or unmodeled Rx electronics |
| Cost | 100+12N+4Nλ+1.5R+20N if mux+100 if advanced+50 if active tuning | Credits investment index; independent from W |
| Lane feasibility | assumed capability / R | Dimensionless; capability basic110 or advanced220 Gb/s-equivalent; NOT BER/commercial feasibility |

Routing L=0.1…10 cm; bends/crossings integer 0…20; I/O channels integer1…64. Nonfinite, fractional count, unsupported enum, unknown physics keys and connected>N are rejected. Input hash covers all design parameters and customer context. Snapshots additionally carry model/version, evidence class, full numerical result hash, timestamp. Restore and comparison recalculate original numerics before accepting.

η includes all intended coding/FEC overhead; no separate second overhead multiplier is applied. Gross and Payload never interchanged. Unconnected paths reduce active throughput, not installed gross or installed power. WDM without MUX is an explicit availability failure even if its nominal gross arithmetic meets target.

## Budgets and comparison

Mission19: 800G gross / 752G payload, ≤16 paths, ≤2.2 mm span, ≤30 mm² footprint, ≤12 W, ≥2 dB reserve. Mission20: same throughput, ≤6 paths, ≤0.8 mm span, ≤18 mm² footprint, ≤12 W, ≥2 dB reserve. Mission21: 1600G / 1504G with Customer A ≤8 paths/1.1 mm/14 mm²/22W/2dB/±10°C; B ≤16/2.2mm/30mm²/8.3W/2dB/±10°C; C ≤16/2.2mm/30mm²/22W/2.8dB/±40°C. Educational Cost caps: Mission19=700 Credits, Mission20=1000, Mission21 A/B/C=1200/800/1000. All require connected=N and per-λ I/O count≥Nλ, lane feasibility≥1. No architecture name appears in the PASS logic.

A/B use the shared v0.10 metric comparison and presentation functions with a Chapter7 versioned adapter. Cross-mission or incompatible model snapshots rejected. Different customer contexts suppress deltas/ranking and display Not Comparable. Unknown BER stays null. No overall engineering score. Direction is informational, not a hardcoded winning architecture.

## Limits and conceptual sources

This independent model never calls or changes Chapter1–6 solvers, carries no v0.8 coupling result into its ledger and does not subtract coupling twice. Fiber attenuation, receiver sensitivity, actual SerDes/modulator/driver/receiver/equalization qualification, eye diagram, BER, crosstalk, ring/AWG/MZI measured transfer function, full-wave EM, evanescent CMT, mechanical thermal deformation, yield and lifetime are **Not Modeled**. The capped quadratic filter is an educational transfer function, not a measured resonator characteristic. Reports are learning artifacts, not qualification certificates.

OIF EEI-COI white paper and Co-Packaging framework supplied in project_sources are contextual references for architecture vocabulary only; the game does not claim standard compliance or derive its numerical presets from them. All remaining numerical parameters above are explicit original educational assumptions.
