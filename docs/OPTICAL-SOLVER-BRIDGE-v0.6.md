# Optical Solver Bridge — v0.6

Game mission → WorkshopDesign bound to OE stable ID → buildWorkshopGraph → preserved core.validateDesign / compileGraph / solve → WorkshopResult → hard objectives → immutable first-clear receipt.

Contract extends the v0.5 reference-only interface without changing its source/schema. It contains OE/Package/Design ID, design/version/revision, package hash, compiler graph+parameter hash, parameter set, path identities, launch/receive reference planes, source/receiver boundary, Evidence Class, analytical status, losses/received/margin, original core result/design, model provenance, unsupported physics and optional original Lab Reference. The binding Package snapshot and Stage permit deterministic fresh parity validation of saved results. `Verified` is never returned.

Original global core objective≥3.2T is preserved; Guided single-OE800G mission uses separate hard gates and does not reinterpret the original global objective as800G. Adapter Golden compares the exact original solve output. Existing16fibers×2λ×100G,7.2dB,3dBm,−4.2dBm,5.8dB fixture remains byte/numerically unchanged.

A Workshop qualification belongs only to its actual oe-001…004. Package changes produce Invalid/Incomplete until rerun; cached results are not shown as current after packageHash mismatch. Historical receipts keep original package/design provenance. Other OE states are independent. No network activation/rate/power/job-time benefit is introduced; original traffic solver remains authoritative.
