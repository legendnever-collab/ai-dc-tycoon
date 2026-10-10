export const EXPLORATION_CHAPTERS=[
 {id:1,title:'Compute & Workload'}, {id:2,title:'Network Expansion'},
 {id:3,title:'The CPO Revolution'}, {id:4,title:'Optical Engine Workshop'},
 {id:5,title:'Photonic Substrate Challenge'}, {id:6,title:'Advanced Coupling & Manufacturing'}
] as const;
const rows=[
 ['First AI Workload','Compute capacity와 Workload 완료 시간','Compute Rack / Workload'],
 ['Expand Your Compute Racks','Rack 증설과 투자 비용의 균형','Compute Rack / Floor'],
 ['Network Bottleneck','GPU Waiting을 줄이는 Network 선택','Compute Rack / Scale-out Switch'],
 ['Switch Expansion','Port 수와 Fabric capacity 구분','High-Density Switch / Rack Links'],
 ['Leaf–Spine Network','느린 Uplink가 만드는 경로 병목','Spine / 100G–200G Uplinks'],
 ['Pluggable Optics','양쪽 Module 호환과 유효 대역폭','400G–800G Modules / Fiber'],
 ['The CPO Power Wall','두 Customer Order에서 Architecture 비교','Pluggable / Optimized Pluggable / CPO'],
 ['First CPO Package','2 OE의 Electrical / CW / Optical path 조립','ASIC / 800G OE / ELS / FAU'],
 ['CPO Switch Deployment','4 OE 경로와 설치 상태 검증','CPO Package / Data Center Install'],
 ['Light Up the OE','CW 입력과 Laser DC power 구분','ELS / CW Input / Power Meter'],
 ['Modulation Workshop','Driver 데이터와 Modulator 손실 비교','MZM / EAM / Driver'],
 ['Complete Optical Engine','Waveguide–Coupler–FAU Link Budget','Waveguide / Edge–Grating Coupler / Receiver'],
 ['OE to Photonic Substrate','OE–Substrate Interface loss 검증','Edge / Direct / Evanescent Preview'],
 ['FAU Alignment','Position과 Pitch 오차의 영향','FAU / Alignment / Tolerance'],
 ['Slow & Wide Prototype','16 × 50G의 Worst-channel margin','Spatial Channels / Route / FAU'],
 ['The Coupling Challenge','Customer window와 Coupling budget 비교','Edge / Direct / Evanescent Preview'],
 ['The Yield Crisis','Assembly variation와 All-channel Monte Carlo Yield','Alignment Equipment / Pitch / Seed'],
 ['From Prototype to Production','Known-Good와 최종 제조 비용·Yield 비교','Known-Good / Final Test / Rework / Batch']
];
export const MISSION_CATALOG=rows.map(([title,objective,technology],i)=>({id:String(i+1).padStart(2,'0'),chapter:Math.floor(i/3)+1,title,objective,technology,prior:i>=15?['16','17','18'].filter(x=>Number(x)<=i+1):[]}));
export function missionEntry(id:string){const row=MISSION_CATALOG.find(m=>m.id===id);if(!row)throw Error('지원하지 않는 Mission');return row;}
