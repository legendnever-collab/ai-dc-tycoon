# Architecture — v0.6

v0.3/v0.4/v0.5 entry/source remain frozen. Additive `chapter4-entry.ts` registers event isolation before importing the existing app, recovers original3-head and new4-head journals before any legacy autosave, then initializes Workshop. New shell/styles/cards are separate. Old executable hashes stay fixed.

`WorkshopDesign` belongs to existing oe-001…004 and package-001; no copied PackageConfig is used as a new playable Package. Result binding snapshots are provenance only. Mission state/rewards are separate from original campaign values. Credit receipt aggregation extends the Workshop wallet; legacy purchasing rules stay preserved.

The same Campaign DB `AIDataCenterTycoon-v05-Campaign` holds new `workshop-head::profile`, `workshop-lkg::profile`, `v06-campaign-head::profile`, `v06-campaign-lkg::profile`, and `campaign06-restore-journal`. No additional DB is created. Original three primary stores and Lab DB remain separate.

Campaign envelopeSchema2/Release0.6 nests the unchanged v0.5 Campaign Text plus Workshop Text with SHA256. Original v0.5 schema1 is still accepted and starts unplayedChapter4. No original Head is automatically migrated merely by opening v0.6.

Restore is a journaled4-head compare-and-swap process, not a cross-DB ACID transaction. Prepare validates all targets; each old raw value is immutable-archived; supported old raw becomes LKG atomically with its primary write. Recovery checks before/after heads before rolling forward. Conflict/future journal blocks boot. Explicit cancellation changes the journal only. Future/unknown primary and wrong-profile LKG block autosave. A future checkpoint blocks new checkpoints while a supported primary may still be used/exported explicitly.
