import {chapterGraph,simulateChapterGraph,C2_GRAPH_MODEL} from './chapter2-graph';
import type {C2Graph} from './chapter2-graph';
import {sha256} from './hash';
/* Chapter 2 is isolated from the v0.3 educational/engineering numerical cores.
   All rates, costs and powers below are GAME ASSUMPTIONS, not vendor specifications. */
export type C2Id='04'|'05'|'06';
export type End='A'|'B';
export type C2Config={
  highDensity:boolean; connected:string[]; spine:boolean;
  uplinks:Record<End,0|100|200>;
  modules:Record<End,0|400|800>;
  fiber:boolean;
  selectedPort:End|null;
};
export type C2Outcome={
  mission:C2Id; known:boolean; activeLinks:number; occupiedPorts:number; availablePorts:number;
  fabricGbps:number; pathGbps:number; effectiveGbps:number;
  computeSeconds:number|null; networkSeconds:number|null; completionSeconds:number|null;
  bottleneck:'Compute'|'Network'|'Disconnected';
  watts:number; costCredits:number; targetSeconds:number;
  pass:boolean; stars:number; objectives:{label:string;pass:boolean;actual:string}[]; hint:string; graph?:C2Graph; traffic?:ReturnType<typeof simulateChapterGraph>;
};
export type C2Receipt={mission:C2Id;xp:number;credits:number;stars:number;revision:number;clearConfig?:C2Config;clearGraph?:C2Graph;resultHash?:string};
export type C2State={
  schema:1;profileId:string;revision:number;current:C2Id;active:boolean;
  cleared:Record<C2Id,boolean>; attempts:Record<C2Id,number>;bestStars:Record<C2Id,number>;
  receipts:C2Receipt[]; config:C2Config; last:C2Outcome|null;network?:C2Graph;
};
export type C2Action=
 {type:'start';mission:C2Id}|{type:'install-hd'}|{type:'connect-rack';rack:string}|
 {type:'disconnect-rack';rack:string}|{type:'install-spine'}|{type:'uplink';end:End;rate:0|100|200}|
 {type:'select-port';end:End}|{type:'module';end:End;rate:0|400|800}|
 {type:'fiber'}|{type:'run'}|{type:'reset'};
export const C2_IDS:C2Id[]=['04','05','06'];
export const C2_REWARDS:Record<C2Id,{xp:number;credits:number}>={
 '04':{xp:180,credits:170},'05':{xp:240,credits:210},'06':{xp:320,credits:260}
};
export const C2_ASSUMPTIONS={
 model:'chapter2-network-educational-1.0.0',
 evidence:'Educational Assumption',
 rates:'Gb/s nominal for modules; simplified protocol efficiency 0.8 applied in Mission 06',
 topology:'Fixed path A-leaf -> spine -> B-leaf. Per-direction bottleneck is min(path edge capacities). No ECMP, routing, queueing, FEC, optical loss, BER or collective modeling.',
 power:'Synthetic Watts; includes simplified switching plus installed transceivers, not complete system power',
 cost:'Game Credits, not currency or vendor pricing'
} as const;
const racks=['rack-001','rack-002','rack-003','rack-004'];
const assert=(ok:boolean,message:string)=>{if(!ok)throw Error(message);};
const enumVal=(value:unknown,options:readonly unknown[])=>options.includes(value);
export function newChapter2(profileId:string):C2State{
 return {schema:1,profileId,revision:0,current:'04',active:false,
  cleared:{'04':false,'05':false,'06':false},attempts:{'04':0,'05':0,'06':0},
  bestStars:{'04':0,'05':0,'06':0},receipts:[],last:null,
  config:{highDensity:false,connected:['rack-001','rack-002'],spine:false,
   uplinks:{A:0,B:0},modules:{A:0,B:0},fiber:false,selectedPort:null}};
}
export function c2Cost(c:C2Config):number{
 return (c.highDensity?150:0)+(c.spine?110:0)+
  (c.uplinks.A/100*20)+(c.uplinks.B/100*20)+
  (c.modules.A===800?75:c.modules.A===400?45:0)+
  (c.modules.B===800?75:c.modules.B===400?45:0)+(c.fiber?0:0);
}
export function c2Wallet(s:C2State,legacyCredits:number){
 return legacyCredits+s.receipts.reduce((a,r)=>a+r.credits,0)-c2Cost(s.config);
}
export function c2XP(s:C2State){return s.receipts.reduce((a,r)=>a+r.xp,0);}
function result(mission:C2Id,base:Omit<C2Outcome,'mission'|'pass'|'stars'|'objectives'|'hint'>,
 objectives:C2Outcome['objectives'],hint:string):C2Outcome{
 const pass=objectives.every(o=>o.pass);
 const score=base.costCredits;
 const stars=!pass?0:mission==='04'?(score<=150?3:2):mission==='05'?(score<=190?3:2):base.watts<=65?3:2;
 return {...base,mission,pass,stars,objectives,hint};
}
function legacyOutcomeTemplate(s:C2State,mission:C2Id=s.current):C2Outcome{
 const c=s.config;
 if(mission==='04'){
  const ports=c.highDensity?4:2,fabric=c.highDensity?96:64,connected=c.connected.length;
  const active=Math.min(ports,connected),cap=Math.min(active*32,fabric);
  const compute=7200/(connected*40),network=cap>0?7200*.4/cap:null;
  const completion=network===null?null:Math.max(compute,network);
  return result(mission,{known:completion!==null,activeLinks:active,occupiedPorts:active,availablePorts:ports-active,
   fabricGbps:fabric,pathGbps:cap,effectiveGbps:cap,computeSeconds:compute,networkSeconds:network,
   completionSeconds:completion,bottleneck:network===null?'Disconnected':network>compute?'Network':'Compute',
   watts:c.highDensity?64:44,costCredits:c.highDensity?150:0,targetSeconds:50},[
    {label:'Switch port ≥ 4',pass:ports>=4,actual:String(ports)+' ports'},
    {label:'Connected Compute Rack = 4',pass:connected===4&&active===4,actual:String(active)+'/4 connected'},
    {label:'Workload ≤ 50 s',pass:completion!==null&&completion<=50,actual:completion===null?'Disconnected':completion.toFixed(1)+' s'},
    {label:'Mission investment ≤ 200 Credits',pass:(c.highDensity?150:0)<=200,actual:String(c.highDensity?150:0)+' Credits'}
   ],connected<4?'Switch를 확장한 뒤 연결되지 않은 Rack을 선택하세요. Port 수와 Fabric 용량은 서로 다릅니다.':'연결된 Rack 수와 완료 시간을 확인하세요.');
 }
 if(mission==='05'){
  const path=c.spine?Math.min(c.uplinks.A,c.uplinks.B):0;
  const compute=6400/(4*40),network=path>0?8000/path:null,completion=network===null?null:Math.max(compute,network);
  const spent=(c.spine?110:0)+(c.uplinks.A+c.uplinks.B)/100*20;
  return result(mission,{known:completion!==null,activeLinks:(c.uplinks.A>0?1:0)+(c.uplinks.B>0?1:0),
   occupiedPorts:(c.uplinks.A>0?1:0)+(c.uplinks.B>0?1:0),availablePorts:2-(c.uplinks.A>0?1:0)-(c.uplinks.B>0?1:0),
   fabricGbps:400,pathGbps:path,effectiveGbps:path,computeSeconds:compute,networkSeconds:network,
   completionSeconds:completion,bottleneck:network===null?'Disconnected':network>compute?'Network':'Compute',
   watts:c.spine?86:45,costCredits:spent,targetSeconds:45},[
    {label:'Spine switch 설치',pass:c.spine,actual:c.spine?'Installed':'Missing'},
    {label:'Leaf A → Spine → Leaf B 경로',pass:path>0,actual:path>0?'Active':'Disconnected'},
    {label:'Bottleneck path ≥ 200 Gb/s',pass:path>=200,actual:String(path)+' Gb/s'},
    {label:'Workload ≤ 45 s',pass:completion!==null&&completion<=45,actual:completion===null?'Disconnected':completion.toFixed(1)+' s'}
   ],!c.spine?'Spine을 먼저 설치해 주세요.':path===0?'Leaf A와 Leaf B의 Uplink를 모두 연결해 주세요.':path<200?'느린 쪽 Uplink가 전체 경로의 병목입니다. 양쪽 속도를 확인하세요.':'Link를 더 빠르게 해도 Compute가 병목이면 시간은 줄지 않습니다.');
 }
 const a=c.modules.A,b=c.modules.B,compatible=!!(c.fiber&&a!==0&&b!==0&&a===b);
 const path=compatible?a:0,eff=path*.8,compute=40,network=eff>0?22000/eff:null,completion=network===null?null:Math.max(compute,network);
 const modulePower=(r:0|400|800)=>r===800?18:r===400?12:0;
 const watts=28+modulePower(a)+modulePower(b);
 const cost=(a===800?75:a===400?45:0)+(b===800?75:b===400?45:0);
 return result(mission,{known:completion!==null,activeLinks:compatible?1:0,occupiedPorts:(a?1:0)+(b?1:0),
   availablePorts:(a?0:1)+(b?0:1),fabricGbps:800,pathGbps:path,effectiveGbps:eff,
   computeSeconds:compute,networkSeconds:network,completionSeconds:completion,
   bottleneck:network===null?'Disconnected':network>compute?'Network':'Compute',
   watts,costCredits:cost,targetSeconds:45},[
    {label:'양쪽 Host Port의 Module 호환',pass:a!==0&&b!==0&&a===b,actual:a+'/'+b+' Gb/s'},
    {label:'Fiber 연결 활성화',pass:compatible,actual:compatible?'Active':'Inactive'},
    {label:'Effective bandwidth ≥ 600 Gb/s',pass:eff>=600,actual:String(eff)+' Gb/s'},
    {label:'Workload ≤ 45 s',pass:completion!==null&&completion<=45,actual:completion===null?'Disconnected':completion.toFixed(1)+' s'},
    {label:'Optics power ≤ 70 W',pass:watts<=70,actual:String(watts)+' W'},
    {label:'Module cost ≤ 175 Credits',pass:cost<=175,actual:String(cost)+' Credits'}
   ],!compatible?'양쪽 Switch Port에 동일한 속도의 Module을 설치하고 Fiber를 연결하세요.':path===400?'400G는 연결되었지만 유효 대역폭이 부족합니다. 800G 업그레이드를 검토하세요.':'800G의 Net Rate는 protocol 효율 가정으로 640 Gb/s입니다.');
}
export function simulateChapter2(s:C2State,mission:C2Id=s.current):C2Outcome {
 const template=legacyOutcomeTemplate(s,mission),graph=chapterGraph(s.config,mission),traffic=simulateChapterGraph(graph);
 const work=mission==='04'?7200:6400,compute=traffic.connected.length?work/(traffic.connected.length*40):null;
 const network=traffic.networkSeconds,known=network!==null&&compute!==null;
 const completion=compute===null?null:network===null?(mission==='04'?compute:null):Math.max(compute,network);
 const objectives=template.objectives.map(o=>o.label.startsWith('Workload')?{...o,pass:known&&completion!==null&&completion<=template.targetSeconds,actual:known?completion!.toFixed(1)+' s':'Disconnected'}:o);
 const pass=known&&objectives.every(o=>o.pass);
 return {...template,graph,traffic,known,computeSeconds:compute,networkSeconds:network,completionSeconds:completion,
  effectiveGbps:traffic.effectiveGb_s,pathGbps:mission==='06'?traffic.effectiveGb_s/.8:traffic.effectiveGb_s,
  watts:traffic.powerW,costCredits:traffic.costCredits,bottleneck:!known?'Disconnected':network!>compute!?'Network':'Compute',
  pass,stars:pass?template.stars:0,objectives};
}
export function validateChapter2(s:C2State):void{
 assert(!!s&&s.schema===1&&typeof s.profileId==='string'&&!!s.profileId,'Chapter 2 저장 형식 오류');
 assert(Number.isInteger(s.revision)&&s.revision>=0&&enumVal(s.current,C2_IDS)&&typeof s.active==='boolean','Chapter 2 revision 오류');
 assert(!!s.config&&typeof s.config.highDensity==='boolean'&&typeof s.config.spine==='boolean'&&typeof s.config.fiber==='boolean','Chapter 2 구성 오류');
 assert(Array.isArray(s.config.connected)&&new Set(s.config.connected).size===s.config.connected.length&&
 s.config.connected.every(x=>racks.includes(x))&&s.config.connected.length>=0,
 'Rack 연결 정보 오류');
 assert(s.config.connected.length<= (s.config.highDensity?4:2),'물리 Port 수 초과');
 for(const end of ['A','B'] as End[]){
  assert(enumVal(s.config.uplinks[end],[0,100,200])&&enumVal(s.config.modules[end],[0,400,800]),'Link Rate 오류');
 }
 assert(enumVal(s.config.selectedPort,[null,'A','B'])&&(!s.config.fiber||(s.config.modules.A!==0&&s.config.modules.B!==0)),'Optical Port/Fiber 오류');
 assert(!((s.config.uplinks.A>0||s.config.uplinks.B>0)&&!s.config.spine),'Spine 없는 Uplink 오류');
 assert(Array.isArray(s.receipts)&&s.receipts.length<=3,'Receipt Ledger 오류');
 const seen=new Set<string>();
 for(const rec of s.receipts){
  assert(enumVal(rec.mission,C2_IDS)&&!seen.has(rec.mission),'Reward 중복 오류');
  if(rec.clearConfig){const out=simulateChapter2({...s,config:rec.clearConfig},rec.mission);assert(out.pass&&JSON.stringify(out.graph)===JSON.stringify(rec.clearGraph)&&sha256(JSON.stringify(out))===rec.resultHash,'Reward Simulation provenance 오류');}
  seen.add(rec.mission);const reward=C2_REWARDS[rec.mission];
  assert(rec.xp===reward.xp&&rec.credits===reward.credits&&rec.stars>=1&&rec.stars<=3&&Number.isInteger(rec.revision)&&rec.revision<=s.revision,'Reward 위조 오류');
 }
 for(const id of C2_IDS){
  assert(typeof s.cleared[id]==='boolean'&&s.cleared[id]===seen.has(id),'Mission Clear/Receipt 불일치');
  assert(Number.isInteger(s.attempts[id])&&s.attempts[id]>=0&&Number.isInteger(s.bestStars[id])&&s.bestStars[id]>=0&&s.bestStars[id]<=3,'Mission 횟수 오류');
  assert(s.cleared[id]=== (s.bestStars[id]>0),'Star/Receipt 오류');
  assert(!s.cleared[id]||s.attempts[id]>0,'실행 없이 Mission Clear');
 }
 if(s.network)assert(JSON.stringify(s.network)===JSON.stringify(chapterGraph(s.config,s.current)),'Persisted Network Graph 구성 불일치');
 if(s.last){const original=s.last;const snapshot=s.receipts.find(r=>r.mission===original.mission&&r.clearConfig)?.clearConfig;
  if(original.graph&&original.traffic)assert(original.graph.modelVersion===C2_GRAPH_MODEL,'Stored Graph Model 오류');}
 assert(!s.cleared['05']||s.cleared['04'],'Mission 05 Lock 오류');
 assert(!s.cleared['06']||s.cleared['05'],'Mission 06 Lock 오류');
 if(s.current!=='04')assert(s.cleared[s.current==='05'?'04':'05'],'잠긴 Mission 진입 오류');
}
export function transitionChapter2(s:C2State,action:C2Action,legacyCredits:number):C2State{
 validateChapter2(s);
 const g=structuredClone(s),c=g.config,mission=g.current;
 const ensureActive=()=>assert(g.active,'미션 시작을 먼저 선택하세요.');
 const affordable=()=>assert(c2Wallet(g,legacyCredits)>=0,'Credits 부족: 장비 변경 또는 Scenario Reset으로 환불할 수 있습니다.');
 switch(action.type){
 case 'start':{
  assert(action.mission==='04'||(action.mission==='05'&&g.cleared['04'])||
    (action.mission==='06'&&g.cleared['05']),'이전 Mission을 먼저 완료하세요.');
  g.current=action.mission;g.active=true;g.last=null;break;
 }
 case 'install-hd':ensureActive();assert(mission==='04','Mission 04에서 사용합니다.');
   c.highDensity=true;affordable();break;
 case 'connect-rack':ensureActive();assert(mission==='04'&&racks.includes(action.rack),'잘못된 Rack입니다.');
   assert(!c.connected.includes(action.rack),'이미 연결된 Rack입니다.');
   assert(c.connected.length<(c.highDensity?4:2),'Switch Port가 부족합니다. High-Density Switch가 필요합니다.');
   c.connected.push(action.rack);break;
 case 'disconnect-rack':ensureActive();assert(mission==='04'&&c.connected.includes(action.rack),'연결된 Rack을 선택하세요.');c.connected=c.connected.filter(x=>x!==action.rack);break;
 case 'install-spine':ensureActive();assert(mission==='05','Mission 05에서 사용합니다.');
   c.spine=true;affordable();break;
 case 'uplink':ensureActive();assert(mission==='05'&&enumVal(action.end,['A','B'])&&enumVal(action.rate,[0,100,200]),'Uplink Rate 오류');
   assert(c.spine,'Spine Switch를 먼저 설치하세요.');c.uplinks[action.end]=action.rate;affordable();break;
 case 'select-port':ensureActive();assert(mission==='06'&&enumVal(action.end,['A','B']),'Switch Port 오류');
   c.selectedPort=action.end;break;
 case 'module':ensureActive();assert(mission==='06'&&enumVal(action.end,['A','B'])&&enumVal(action.rate,[0,400,800]),'지원되지 않는 Optical Module입니다.');
   assert(c.selectedPort===action.end,'먼저 해당 Switch Port를 선택하세요.');
   c.modules[action.end]=action.rate;c.fiber=false;affordable();break;
 case 'fiber':ensureActive();assert(mission==='06','Mission 06에서 사용합니다.');
   assert(c.modules.A>0&&c.modules.B>0&&c.modules.A===c.modules.B,'양쪽 Module이 호환되어야 Fiber를 연결할 수 있습니다.');
   c.fiber=true;break;
 case 'reset':{
  ensureActive();
  if(mission==='04'){c.highDensity=false;c.connected=['rack-001','rack-002'];}
  if(mission==='05'){c.spine=false;c.uplinks={A:0,B:0};}
  if(mission==='06'){c.modules={A:0,B:0};c.selectedPort=null;c.fiber=false;}
  g.last=null;break;
 }
 case 'run':{
  ensureActive();const r=simulateChapter2(g);
  g.last=r;g.attempts[mission]++;
  if(r.pass){
   g.bestStars[mission]=Math.max(g.bestStars[mission],r.stars);
   if(!g.cleared[mission]){g.cleared[mission]=true;const award=C2_REWARDS[mission];g.receipts.push({mission,...award,stars:r.stars,revision:g.revision+1,clearConfig:structuredClone(c),clearGraph:structuredClone(r.graph!),resultHash:sha256(JSON.stringify(r))});}
  }
  g.active=false;break;
 }
 default:throw Error('지원하지 않는 명령입니다.');
 }
 g.network=chapterGraph(c,g.current);
 g.revision++;
 validateChapter2(g);
 return g;
}

