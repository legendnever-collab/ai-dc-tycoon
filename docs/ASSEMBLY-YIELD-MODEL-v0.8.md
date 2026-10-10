# Assembly model / parameter evidence

Model assembly-yield-educational-1.0.0. Every new numerical preset is Educational Assumption, source this model, uncalibrated. No vendor specification is represented. Nominal16×50G is the unchanged hypothetical v07 fixture, using the selected stable OE ID and saved Substrate/Workshop/Package binding.

|Parameter|Edge-like|Direct|Evanescent Preview|Unit / Evidence|
|---|---:|---:|---:|---|
|OE interface fixed loss|1.0|0.7|1.5|dB / v07 educational preset|
|FAU effective Gaussian radius|4|2|6|µm / independent educational assumption|
|Interface fixture cost|70|45|150|Credits / game assumption|

These presets express a game trade-off, not a real architecture performance ranking. Evanescent remains a fixed-loss preview plus an explicitly assumed Gaussian transverse sensitivity. Gap/CMT/full-wave transfer are not modeled.

|Equipment|Common sigma|Independent sigma|Setup Credits|Alignment serial time|
|---|---:|---:|---:|---:|
|Basic|1.9µm|0.25µm|20|25s|
|Precision|0.45µm|0.15µm|120|45s|
|Active|0.18µm|0.10µm|260|85s|

Pitch Matching: mean0.03µm / sigma0.004µm instead of0.48µm /0.025µm, +50Credits. Fine Adjustment multiplies common sigma by0.7, costs35Credits and20s/unit. XY correlation0.15. Rotation sigma0.4mrad Basic /0.1mrad others. Nominal X/Y and mean Rotation are editable within±10µm/±10mrad. All channels use127µm nominal pitch from v07.

The preserved nominal solver counts inherited modulation, selected OE coupling, substrate propagation/bend/crossing,1dB FAU baseline, original alignment and external fiber. The delta evaluator subtracts original alignment and adds new Gaussian alignment at the same FAU reference boundary. Other losses are never re-summed. Received=Launch−Loss; Margin=Received−Sensitivity. Unknown source stays Unknown and never passes. Core0.2.0 / graph-compact-1.0.0 are unchanged. Optical gains never become network capacity gains; diagnostic power never enters the96W Package ledger.
