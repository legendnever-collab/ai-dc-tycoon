# Manufacturing economics

Costs/time are educational Credits/seconds, not prices or production economics. One explicit serial line sums only executed process events; no hidden parallel capacity model or relation between monetary cost and elapsed time.

|Event|Credits|Seconds|Scope|
|---|---:|---:|---|
|Setup|Recipe equipment/interface/options sum|15;45 Known-Good|Chosen stations charged even if no rework occurs|
|Material|20/unit|0|All incoming units, once|
|Assembly|9 Prototype;45 Quality;25 Volume|18/unit|Only units entering final assembly|
|Alignment|1 Basic;3 Precision;6 Active|25/45/85|Fine Adjustment adds20s|
|Basic test|2|8|Each executed pre/final/retest|
|Channel test|6|22|Each executed pre/final/retest|
|Rework|8|30|At most one alignment attempt per detected unit|
|Disposal|1|3|Incremental handling only; no repeated material/assembly debit|

Cost per Accepted Unit=Total Spent / actual-good delivered units; zero denominator is Undefined(null), never0. Delivered Units include simulated defect escapes; Accepted Units do not. Shipped+Scrapped=batch. Throughput=accepted/serialSeconds×3600 units/h, unrelated to network Gb/s.

Prototype:10 units,≥7 good,rate≥70%,setup≤170,total≤650,≤90/good,time≤850s,≤1escape. Quality:50 units,≥40 good,rate≥85%,setup≤360,total≤5500,≤130/good,time≤8000s,zero escapes and channel test required. Volume:100 units,≥75 good,rate≥80%,setup≤330,total≤7000,≤90/good,time≤12000s,zero escapes. Orders provide separate customer allocations; campaign purse and first-clear rewards stay intact.

Known-Good can save high final-assembly expenditure on defective material, while prototype pre-test overhead can exceed low setup/time allocations. Rework cannot repair material damage. Replays retain seed unless explicitly changed, with no irreversible failure debt.
