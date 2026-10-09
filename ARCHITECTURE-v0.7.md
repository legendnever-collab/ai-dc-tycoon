# Architecture — v0.7

Authoritative baseline:02fd07ddf5ccb1c76d66f157abb4094aa893da7a.

v0.7 is additive: separate game-shell-v07, chapter5-entry, chapter4-app-v07, campaign shell, Learning content and substrate modules. Original v0.3–v0.6 entries and source remain unchanged. build.cjs emits all five offline versions; original Lab hash guard remains.

Entry recovers legacy3-head, v0.6 4-head and v0.7 5-head restore Journals before game imports. Capture routing: shared shell → Substrate controller → OE controller → legacy controllers. Views share one global Navigator/Tech/Learn projection. Each gameplay state stays with its original store.

Substrate primary and LKG use substrate-head::profile and substrate-lkg::profile in the existing Campaign database. CAS rejects stale writers. Invalid supported heads can recover same-profile LKG; future schema/profile mismatch blocks autosave. Raw originals are archived during repair/restore.

Campaign envelope schema3 contains the exact v0.6 envelope and Substrate envelope. Full old Campaign import starts new chapters unplayed. Same-profile single-chapter import retains valid linked later chapters. Independent Engineering Lab storage is untouched.

Journal prepared entries verify expected current values before roll-forward. Committed/cancelled journals only validate schema/target boundaries at boot because they cannot write; individual current heads still receive full numerical validation. This avoids revalidating terminal historical payloads on every startup.

v0.7 result/receipts retain immutable source context, graph/model hash and exact analytical result validation. Power/accounting boundaries remain separate.

## Release version boundary

`package.json.version` and the original Chapter1 `APP_VERSION` remain `0.3.0`, preserving the frozen original release integrity suite used by every later chapter. `offlineReleaseVersion`, v07 HTML title, Chapter5 API and release manifest identify `0.7.0`. The additive build produces v03–v07 independently.
