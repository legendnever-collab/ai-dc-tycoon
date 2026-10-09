# Mission Catalog — AI Data Center Tycoon v0.4.0

| Mission | Event / Lesson | Required player activity | Hard objectives | First Clear Reward |
|---|---|---|---|---|
| 01 | First AI Workload; Compute Capacity | Run first Job | 35 s | XP100 / Credits120 (legacy) |
| 02 | Expand Racks; independent capacity | Purchase and place Rack | ≥2 Racks, 65 s | XP150 / Credits140 (legacy) |
| 03 | Network Bottleneck; communication vs compute | Upgrade Scale-out Switch | ≥2 Racks, 125 s | XP250 / Credits200 (legacy) |
| 04 | Switch Port Crisis; Physical Ports vs Fabric | Install HD Switch; connect newly arrived Racks | 4 links, ≤50 s, ≤200 Credits | XP180 / Credits170 |
| 05 | Build Scale-out Fabric; Path Bottleneck | Spine and both 200G Uplinks | Path ≥200 Gb/s, ≤45 s | XP240 / Credits210 |
| 06 | The Optical Upgrade; Pluggable Link | Pair of compatible 800G modules + Fiber | ≥600 Gb/s effective, ≤45 s, ≤70 W, module cost ≤175 Credits | XP320 / Credits260 |

Mission 01–03 numeric data are inherited without changing `src/game-catalog.ts` or `src/dc-simulator.ts`. Chapter 02 values are independent game assumptions in `src/chapter2.ts`. All successes require running the numerical simulator and passing the hard objectives. After M06, the CPO Research Preview opens without claiming actual CPO design is implemented.
