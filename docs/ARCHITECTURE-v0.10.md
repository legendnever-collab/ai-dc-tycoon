# Architecture v0.10

Baseline main: `3d182597e8f542c091f8d014bb8f31a0468d5aa2`.

`decision-entry.ts` wraps the unchanged Chapter6 Campaign entry and mounts a separate additive `decision-app.ts`. The v0.9 exploration entry and app are retained exactly, and build.cjs retains all historical build paths before emitting v0.10. Original mission reducers, objectives, reward ledgers, model equations and storage parsers remain unchanged.

The new app calls original starterScenario/runPractice and original ExplorationStore. `decision-model.ts` owns provenance snapshots, stable metric adapters, same-context comparison, full-input change checks and independent restore. `decision-ui.ts` renders four primary KPIs, A/B status, deltas, warnings and optional detailed constraints. `decision-debrief.ts` shares an explanation framework with 18 mission rules. `decision-scenes.ts` reads original topology/optical graph builders, Gaussian alignment helpers and current numerical results. Chapter6 alignment, plots and manufacturing renderers are reused.

Storage domains:

| Domain | Database / schema | Behavior |
|---|---|---|
| Campaign | Existing original stores | No new writes from experiments |
| Practice | AIDataCenterTycoon-FreeExploration-v09 / 1 | Unchanged Scenario, attempts, result, previous; current result invalidated on edit |
| A/B + recent runs | AIDataCenterTycoon-DecisionLab-v010 / 1 | Original input+result+hash+timestamp; independent of Practice |

Both Practice and Decision Lab use atomic CAS head writes, LKG and corrupt/original archives. Future schemas block writes. Combined Paste Restore parses both domains before changing either in-memory state; each domain retains its own atomic CAS transaction. It is not a cross-database Campaign Restore Journal. A concurrent conflict may protect one domain independently; the status directs the player to retain a backup and reload. No Campaign data are included in experiment backups.

Result validity requires Mission/revision/input SHA agreement. Snapshot validation checks input/result SHA and replays the original evaluator. A bounded validation cache uses all snapshot bytes, never an unverified mutable object. Monte Carlo samples are not duplicated in stored snapshots; seed and summary provenance remain. Run cancellation commits no result or partial snapshot. A/B restore does not reconstruct charts until a rerun; numerical results remain verified.

There is no second simulation engine, network API, external LLM, composite score, new mission or new physics.
