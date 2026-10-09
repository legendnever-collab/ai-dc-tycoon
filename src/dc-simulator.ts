import {sha256} from './hash';
import {GAME_MODEL} from './game-schema';
import type {SimInput,SimResult,Evaluation,MissionId} from './game-schema';
import {MISSIONS} from './game-catalog';
export function simulateDC(input:SimInput):SimResult {
 const i=structuredClone(input);if(i.modelVersion!==GAME_MODEL)throw Error('Simulator Model Version 불일치');
 const range=(n:number|null,a:number,b:number,name:string,integer=false)=>{if(n!==null&&(!Number.isFinite(n)||n<a||n>b||(integer&&!Number.isInteger(n))))throw Error(name+' 범위 / 단위 오류');};
 range(i.workload.amountWU,1,1e9,'Workload WU');range(i.workload.transferGbPerWU,0,100,'Traffic Gbit/WU');range(i.compute.rackCount,0,8,'Rack Count',true);range(i.compute.perRackWU_s,1,1000,'Compute WU/s/rack');range(i.network.capacityGb_s,0,10000,'Network Gb/s');
 const r:SimResult={modelVersion:GAME_MODEL,known:false,input:i,inputHash:sha256(JSON.stringify(i)),computeSeconds:null,networkSeconds:null,completionSeconds:null,throughputWU_s:null,gpuWaitingFraction:null,bottleneck:'Unknown',issues:[],assumptions:['Synthetic WU는 실제 GPU FLOPS/Benchmark가 아닙니다.','균등 작업 분배·고정 Rack Capacity·장애 없는 링크를 가정합니다.','Distributed Training은 이상적 Compute/Communication overlap envelope이며 NCCL/collective/latency 모델이 아닙니다.','Scale-up Fabric과 Storage/I/O는 별도 범위로 현재 계산하지 않습니다.']};
 if(!['independent','distributed-training'].includes(i.workload.kind)||(i.workload.kind==='distributed-training'&&i.workload.fabric!=='scale-out')||(i.workload.kind==='independent'&&i.workload.fabric!=='none')){r.issues.push('이 Workload / Fabric은 모델 범위 밖입니다.');return r;}
 const W=i.workload.amountWU,C=i.compute.perRackWU_s===null?null:i.compute.rackCount*i.compute.perRackWU_s;
 if(W===null||C===null||C===0){r.issues.push(C===0?'배치된 Compute Rack이 없습니다.':'Workload / Compute 입력이 Unknown입니다.');return r;}
 r.computeSeconds=W/C;
 if(i.workload.kind==='independent'){r.networkSeconds=0;r.completionSeconds=r.computeSeconds;r.throughputWU_s=C;r.gpuWaitingFraction=0;r.bottleneck='Compute';r.known=true;return r;}
 const rho=i.workload.transferGbPerWU,B=i.network.capacityGb_s;if(rho===null||B===null||B===0){r.issues.push(B===0?'Network Capacity가 0입니다.':'Traffic / Network 입력이 Unknown입니다.');r.bottleneck='Network';return r;}
 r.networkSeconds=W*rho/B;r.completionSeconds=Math.max(r.computeSeconds,r.networkSeconds);r.throughputWU_s=W/r.completionSeconds;r.gpuWaitingFraction=Math.max(0,1-r.throughputWU_s/C);r.bottleneck=Math.abs(r.computeSeconds-r.networkSeconds)<1e-9?'Balanced':r.networkSeconds>r.computeSeconds?'Network':'Compute';r.known=true;return r;
}
export function evaluateMission(id:MissionId,r:SimResult):Evaluation {const m=MISSIONS[id],passTime=r.known&&r.completionSeconds!==null&&r.completionSeconds<=m.targetSeconds+1e-9,passRacks=r.input.compute.rackCount>=m.minRacks;
 const pass=passTime&&passRacks,overspend=Math.max(0,r.input.investmentCredits-m.efficientInvestment),score=pass?Math.max(0,100-overspend/10):Math.min(70,r.completionSeconds?70*m.targetSeconds/r.completionSeconds:0);return {pass,score,stars:!pass?0:score>=95?3:score>=75?2:1,objectives:[{label:`완료 시간 ≤ ${m.targetSeconds}s`,pass:passTime,actual:r.completionSeconds===null?'Unknown':r.completionSeconds+'s'},{label:`배치 Rack ≥ ${m.minRacks}대`,pass:passRacks,actual:r.input.compute.rackCount+'대'}]};}
