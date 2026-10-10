# Boundaries / Known Issues

- Numerical coupler radii, equipment distributions, component defect probabilities, inspection thresholds/costs and residual rework model are uncalibrated Educational Assumptions. No real vendor yield or architecture superiority is claimed.
- Reliability lifetime, full-wave EM, evanescent gap/CMT, longitudinal variation, temperature/warpage, BER and physical8×100G→16×50G conversion are Not Modeled.
- Browser tests emulate390/320px Chromium touch; physical Android and human usability remain NOT TESTED.
- Campaign backup includes immutable old simulation graphs and can take seconds on slower devices. Random sample arrays are not stored; reloaded plots regenerate from input/seed.
- Six-head restore is recoverable roll-forward, not cross-DB ACID. Conflicting foreign writes block boot/autosave; explicit cancellation does not magically undo already applied heads.
- v08 schema4 backups reject in v07. A v07 executable cannot interpret the new Assembly head; use the matching v08 executable and preserve Text Backup before changing versions. Existing legacy heads remain independently readable, and source-context hash invalidates stale new qualification after legacy edits.
- file-origin IndexedDB persistence remains browser/profile scoped and subject to quota/eviction. Campaign Backup does not include the independent Advanced Lab design.
- Manufacturing is a serial single-station model with customer-funded educational allocations; it is not a factory scheduling/parallel throughput or actual financial estimate.
