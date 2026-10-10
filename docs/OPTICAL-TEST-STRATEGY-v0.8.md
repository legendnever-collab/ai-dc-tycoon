# Optical test scope

All defect/detection/rework values are declared game assumptions, not vendor escape rates. Independent material RNG(seed XOR0xBA7C60) assigns common12dB defect with probability0.04, or localized12dB channel defect with probability0.10. Both are separate from assembly variation. These categorical probabilities are scenario inputs; sampled defect counts derive from actual draws.

Basic Optical Power evaluates average linear received power and equivalent aggregate loss. It can miss a weak individual channel even when aggregate power passes. Channel-resolved test checks every margin≥3dB / loss≤10dB. Unknown inputs fail both. No false claim of detection of intermittent, thermal, humidity, BER or lifetime defects.

Direct strategy assembles all incoming material before final testing. Known-Good measures the component at zero assembly error using the selected test scope; pre-test rejects avoid final assembly/alignment cost. Passing pre-test never guarantees final coupling because fresh final assembly displacement is still evaluated. Pre-test and final-test events are separate in the ledger.

One optional rework realigns detected units, resetting meanX/Y and scaling common/independent residual sigma by0.3 while preserving pitch mismatch and material defects. It always incurs rework/retest costs, succeeds only if actual channel calculation passes, and is not an invented random success percentage. Basic final-test escape is compared with simulation ground truth solely to teach detection scope; real unmeasured defects are not observable in production from this model.
