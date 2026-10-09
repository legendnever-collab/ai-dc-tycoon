# Chapter 02 Game Design — v0.4.0

## Product Loop
EVENT → DIAGNOSE → BUILD → SIMULATE → RESULT → REWARD → UNLOCK.

Chapter 01 is retained unmodified; Chapter 02 has three guided scenarios. Missions are explicit systems puzzles, not a button-driven tutorial. Clear is derived from network capacity and workload time rather than UI click count.

## Mission 04 — Switch Port Crisis
- Initial Network: Port-Limited T2 Switch with **2 occupied ports / 0 available** and 2 newly arrived Compute Racks needing connection.
- Actions: Install HD Switch (150 Credits; 4 physical ports), connect Rack 3 and 4.
- Model: each active Rack 40 synthetic WU/s, 7200 WU distributed workload. Link 32 Gb/s per active Rack, separate switch Fabric maximum **96 Gb/s** (HD) or **64 Gb/s** (T2); traffic 0.4 Gbit/WU.
- Time: max(7200 / (connectedRacks×40), 7200×0.4 / min(activePorts×32,fabric)).
- Hard gate: four racks connected, time ≤50 s and Mission investment ≤200 Credits.
- Learning: port count and fabric rate are distinct; disconnected Racks do not contribute.

## Mission 05 — Leaf–Spine
- Two Leaf groups connected through the Spine. Each Uplink can be 100 or 200 Gb/s.
- Model: 6400 WU, four Racks×40 WU/s, crossing traffic 8000 Gbit, 2-hop path **min(Uplink A,Uplink B)**, not sum of both.
- Time: max(40 s, 8000 Gbit/path Gb/s); disconnected path ⇒ Unknown/FAIL.
- Hard gate: Spine installed, path active, path rate ≥200 Gb/s, time ≤45 s.
- Learning: raising a Link beyond the Compute bottleneck cannot reduce workload time.

## Mission 06 — Optical Upgrade
- Both Host Switch Ports are 800G-capable in this game scenario. Each can hold one 400G or 800G module; select the port before insertion.
- Fiber becomes active only when both sides have modules of the same nominal rate and Fiber connection is completed.
- The game assumes **80% payload efficiency**: 400G ⇒ 320 Gb/s, 800G ⇒ 640 Gb/s, independent of a vendor's encoding or actual FEC.
- Traffic 22000 Gbit; Compute envelope 40 s. 400G ⇒ Network 68.75 s (fails). 800G ⇒ Network 34.375 s and Workload 40 s (passes).
- Power game assumption: baseline Switch 28 W, module 400G = 12 W each, module 800G = 18 W each. Module cost 400G=45 Credits each, 800G=75 Credits each.
- Hard gates: compatible modules and Fiber, effective rate ≥600 Gb/s, time ≤45 s, power ≤70 game Watts and module cost ≤175 Credits.
- End event: Switch Power Wall / CPO preview. CPO is not assigned a performance multiplier.

## Economy & rewards
- Chapter 01 initial Credits/XP/Rewards, LEDGER and Engine Core are unchanged.
- Chapter 02 reward receipts: M04 +180 XP / +170 Credits, M05 +240 XP / +210 Credits, M06 +320 XP / +260 Credits, each only on first clear.
- Chapter 02 wallet = current Chapter 01 Credits + Chapter 02 reward Credits − installed Chapter 02 components. Changing Mission state does not fabricate physical capacity.
- Reset Scenario refunds components for the current Mission; successful Mission history/rewards remain.
- Replay may improve Stars, but cannot issue a second reward receipt.
- Beginner screen uses Korean explanations and standard English technology nouns, no component Graph Inspector.

## Scope exclusions
Game calculation is deterministic, analytical and synthetic: no ECMP/queueing/contention/routing algorithm choice, Protocol transaction latency, PCIe/NVLink real link characteristics, BER/FEC losses, actual optical reach, electrical SI, vendor module power or pricing.
