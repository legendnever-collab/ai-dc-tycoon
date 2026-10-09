# Architecture — v0.4.0

The frozen Chapter 1 game and Optical Engineering engine remain separate. chapter2-app.ts wraps the existing UI; chapter2.ts manages mission state, purchases, first-clear receipts and replay. chapter2-graph.ts materializes stable typed racks, switches, ports, links, groups, modules and demands from installed configuration. traffic-solver.ts allocates demand along deterministic stable shortest-hop paths. Shared edge-direction and switch-fabric loads determine completion time. An unused link cannot increase throughput; compute nodes cannot relay traffic.

Physical port occupancy, supported rate, two-ended optical interface/module compatibility and active fiber gate routing. Workload time is max(compute time, network time). Cost and power use installed parts, not rewards. New receipt provenance recomputes clear graph/result; future models cannot be silently imported.

Profile-keyed Chapter2 IndexedDB is independent of the original v0.3 schema and Lab data. Save writes are revision guarded. Invalid head can recover LKG; corrupt and unsupported originals are archived before explicit replacement. Future versions block automatic save. Older sidecars without typed graph metadata use the canonical config adapter; historical receipt format remains accepted. New receipts carry verified graph/result provenance.

network-schema.ts/network-model.ts are a separate experimental engine with different educational presets and tests. They do not drive missions. Lab simulation is never mapped to AI workload speed.

build.cjs emits unchanged v0.3 plus a separate self-contained v0.4 HTML wrapper. package-v04.cjs emits source/HANDOFF/screenshots and a SHA256 manifest tied to GITHUB_SHA. CI has deterministic and bounded offline browser jobs. Real Android and human usability are separate gates.
