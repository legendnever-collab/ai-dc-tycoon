# Reproducible Monte Carlo

Distribution: Gaussian via Box–Muller over strictly positive transformed PRNG input. PRNG: fixed uint32 Mulberry32, immutable draw order. Seed is uint32; sample count1…5000 in model, UI200/1000/5000. Zero/invalid/nonfinite inputs reject before sampling. Same seed/input produces identical samples and result; no wall-clock random source.

xglobal=µx+σcommon Zx. yglobal=µy+σcommon(ρZx+sqrt(1−ρ²)Zy). Channel xi=xglobal+(i−center)Δpitch+σind Zxi. yi=yglobal+(i−center)127µm tan(rotation_mrad/1000)+σind Zyi. Pitch and rotation have independent declared Gaussian variation. Unitsµm,µm/channel,mrad; correlation is dimensionless. Whole FAU movement is separate from each channel residual.

Gaussian amplitude-mode assumption E∝exp(−r²/w²), equal radii at transverse FAU input/output planes: η=exp(−(x²+y²)/w²). Loss=−10log10η=10/ln10[(x/w)²+(y/w)²]. Effective radius is an assumption, not measured tolerance. Fixed insertion loss remains distinct. Rotation only converts geometry into displacement; longitudinal gap/angular modal effects are not modeled.

PASS requires every required channel to have a valid known path, margin≥3dB AND loss≤10dB. Assembly rate=PASS assemblies / evaluated samples. Per-channel percentages are not multiplied because common errors are correlated. Worst margin includes failed samples; a negative worst outlier does not invalidate an otherwise permitted acceptance-rate target.

Architecture comparisons use identical draw order/count/seed and distribution (Common Random Numbers). The actual sample-set hash is equal even when architecture results differ. Scatter displays a uniform subsample≤1000 points, explicitly labeled; histogram and16-channel frequencies use every sample. All visible numbers derive from actual samples.

Provenance includes model, full input hash, seed, sample count, draw-set hash, acceptance definition and result hash. Saved summaries and immutable bindings regenerate samples after reload. No unbounded sample persistence. Execution yields every100 samples; cancellation returns no partial qualification. Resume reruns from original seed rather than splicing a partial sample set. Synchronous/chunked parity and zero-variance graph parity are tested.

Cross-runtime reproducibility contract: standard-normal draws serialize to12 decimal places; reported sample coordinates/loss/margin and aggregate mean serialize to9 decimal places before hard-gate/hash evaluation. This fixed precision is part of the new educational model, preventing platform transcendental last-bit differences from rejecting backups. Existing v07 values are unchanged; graph parity tolerance2×10⁻⁹dB covers only this declared precision. Node-generated qualified receipts are restored in Chromium as a cross-runtime regression.
