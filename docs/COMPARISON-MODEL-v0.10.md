# Comparison Model v0.10

Snapshots own Mission, Scenario, revision, preserved-model version, SHA256 of input / result, timestamp and Educational Assumption evidence. A/B, latest and previous are separate values. Save requires a current result; restore deep-copies the verified original input and result. Restore never grants Campaign rewards.

The original evaluatePractice dispatch is the only simulation dispatcher. Metric adapters read original outputs, with finite-number guards, explicit units, reference scopes, direction, and Unknown / Not Modeled handling. Geometry density is explicitly derived from (channels−1)/modeled FAU span; it is not a throughput proxy. All metrics use a stable Mission contract, including incomplete optical paths.

Absolute delta is B−A. Relative delta is 100(B−A)/|A|; omitted for a zero baseline, categorical values, dB and dBm. Percent acceptance absolute delta is percentage points. No composite ranking, dominance score or automated optimum is implemented.

Cross-Mission and cross-definition comparison reject. Different Customer Order / Batch / cumulative order-objective contexts suppress quantitative ranking. Monte Carlo Seed / Sample differences suppress acceptance and margin distribution delta. Same Seed / Samples reuse the original standard draw set; different equipment sigma transforms are the intentional treatment. Common Random Numbers improve fairness but do not establish real manufacturing yield. Original Gaussian distribution is never altered.

Changed decisions and additional hidden context are inspected. A one-factor label requires the unchanged remaining meaningful Scenario after the original control edit. Multiple changes are possible influences, not a single identified cause. The user runs proposed controlled experiments; no hidden counterfactual solver or external API is used.

Snapshot numerical validation replays original models. A bounded cache is keyed by every snapshot byte, so modified inputs / outputs / metadata cannot reuse a prior validation. Unknown data cannot pass as a fabricated number.
