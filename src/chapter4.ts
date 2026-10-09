import {WORKSHOP_MODEL} from './workshop-schema';
import type {WorkshopState,WorkshopDesign,WorkshopParameters,WorkshopAction,Mission4,WorkshopOutcome} from './workshop-schema';
import type {C3State,PackageConfig} from './cpo-schema';
import {simulateWorkshop} from './workshop-adapter';
import {validatePackage} from './chapter3';
import {sha256} from './hash';
export const C4_IDS:Mission4[]=['10','11','12'];
export const C4_REWARDS={'10':{xp:180,credits:100,unlocks:['laser-controller','optical-power-meter','modulator-workshop']},'11':{xp:220,credits:120,unlocks:['mzm','eam','modulator-inspector','waveguide-workshop']},'12':{xp:300,credits:160,unlocks:['optical-engine-prototype','link-budget-analyzer','advanced-optical-builder','photonic-substrate-challenge']}};
function check(value:unknown,message:string):asserts value{if(!value)throw Error(message);}
export function newWorkshopDesign(oeId:string):WorkshopDesign{return {id:'workshop-'+oeId,oeId,packageId:'package-001',version:'0.6.0',revision:0,sourceId:'els-001',parameters:{launchDbm:3,wpe:.2,modulator:null,modLossDb:null,lengthCm:4,alphaDbCm:.5,bends:4,bendLossDb:.1,coupler:null,couplingDb:null,fiberDb:1,sensitivityDbm:-10,driverWPerLane:.3},cwConnected:false,driverConnected:false,outputConnected:false,waveguide:false,couplerConnected:false,fauConnected:false,receiverConnected:false,qualified:null};}
export function newChapter4(profileId:string):WorkshopState{return {schema:1,model:WORKSHOP_MODEL,profileId,revision:0,current:'10',phase:'EVENT',selectedOE:'oe-001',designs:{},cleared:{'10':false,'11':false,'12':false},attempts:{'10':0,'11':0,'12':0},bestStars:{'10':0,'11':0,'12':0},receipts:[],unlocked:[],last:null};}
export function workshopCost(w:WorkshopDesign){return (w.parameters.modulator==='MZM'?40:w.parameters.modulator==='EAM'?25:0)+(w.waveguide?15:0)+(w.parameters.coupler==='EdgeCoupler'?20:w.parameters.coupler==='GratingCoupler'?30:0)+(w.fauConnected?10:0);}
export const c4XP=(s:WorkshopState)=>s.receipts.reduce((n,r)=>n+r.xp,0);
export const c4Wallet=(s:WorkshopState,previous:number)=>previous+s.receipts.reduce((n,r)=>n+r.credits,0)-Object.values(s.designs).reduce((n,d)=>n+workshopCost(d),0);
export function workshopStatus(w:WorkshopDesign|undefined,pkg:PackageConfig){if(!w)return 'Not Started';if(w.qualified?.packageHash!==sha256(JSON.stringify(pkg)))return w.revision?'Invalid / Incomplete':'Not Started';return w.qualified.status;}
export function validateWorkshopDesign(w:WorkshopDesign){
 check(w&&/^oe-00[1-4]$/.test(w.oeId)&&w.id==='workshop-'+w.oeId&&w.packageId==='package-001'&&w.version==='0.6.0'&&w.sourceId==='els-001'&&Number.isSafeInteger(w.revision)&&w.revision>=0,'Workshop Stable ID / version 오류');
 for(const k of ['cwConnected','driverConnected','outputConnected','waveguide','couplerConnected','fauConnected','receiverConnected'] as const)check(typeof w[k]==='boolean','Workshop connection schema 오류');
 const p=w.parameters;check(p&&[null,'MZM','EAM'].includes(p.modulator)&&[null,'EdgeCoupler','GratingCoupler'].includes(p.coupler),'지원하지 않는 Optical Component');
 const limits:Record<string,[number,number]>={launchDbm:[-30,25],wpe:[.01,1],modLossDb:[0,30],lengthCm:[0,100],alphaDbCm:[0,10],bendLossDb:[0,10],couplingDb:[0,30],fiberDb:[0,30],sensitivityDbm:[-40,10],driverWPerLane:[0,10]};
 check(Object.keys(p).length===13&&Object.keys(p).every(k=>k in limits||['bends','modulator','coupler'].includes(k)),'Workshop Parameter schema 오류');
 for(const [k,[min,max]]of Object.entries(limits)){const v=p[k as keyof WorkshopParameters];check(v===null||typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max,k+' 범위 / Unit 오류');}
 check(Number.isInteger(p.bends)&&p.bends>=0&&p.bends<=100,'Bend Count 오류');
}
export function evaluateWorkshop(w:WorkshopDesign,pkg:PackageConfig,mission:Mission4):WorkshopOutcome{
 validateWorkshopDesign(w);validatePackage(pkg);const r=simulateWorkshop(w,pkg,mission),p=w.parameters;const objectives=[{label:'기존 ELS → OE CW Input',pass:r.launchDbm!==null,actual:r.launchDbm===null?'Disconnected':r.launchDbm+' dBm / channel'},{label:'Laser Window · 1–6 dBm',pass:r.launchDbm!==null&&r.launchDbm>=1&&r.launchDbm<=6,actual:r.launchDbm===null?'Unknown':r.launchDbm+' dBm'},{label:'8-channel Laser DC ≤ 0.20 W',pass:r.laserElectricalW!==null&&r.laserElectricalW<=.2,actual:r.laserElectricalW===null?'Unknown':r.laserElectricalW.toFixed(4)+' W'}];
 if(mission!=='10')objectives.push({label:'Typed Graph / Driver / Optical Data',pass:r.core.compiler!.valid&&r.grossGb_s===800&&r.activePathIds.length===8,actual:r.core.compiler!.valid&&r.grossGb_s===800?'8 × 100 Gb/s':'Invalid / Incomplete'},{label:'Modulator IL · 0–5 dB',pass:p.modulator!==null&&p.modLossDb!==null&&p.modLossDb<=5,actual:p.modLossDb===null?'Unknown':p.modLossDb+' dB'},{label:'Workshop diagnostic DC ≤ 6.2 W',pass:r.electricalW!==null&&r.electricalW<=6.2,actual:r.electricalW===null?'Unknown':r.electricalW.toFixed(3)+' W'});
 if(mission==='12')objectives.push({label:'Waveguide → Coupler → FAU → Receiver',pass:w.waveguide&&w.outputConnected&&w.couplerConnected&&w.fauConnected&&w.receiverConnected&&r.core.compiler!.valid,actual:r.core.compiler!.valid?'Connected':'Incomplete'},{label:'Link Margin ≥ 3 dB · Educational',pass:r.marginDb!==null&&r.marginDb>=3,actual:r.marginDb===null?'Unknown':r.marginDb.toFixed(2)+' dB'},{label:'ELS output → Remote Receiver reference planes',pass:r.referencePlane.launch==='els-001.out'&&r.referencePlane.receive==='remote-rx.in'&&r.lossDb!==null,actual:r.lossDb===null?'Unknown':'Consistent / each loss once'});
 const pass=objectives.every(x=>x.pass),optimized=r.laserElectricalW!==null&&r.laserElectricalW<=.09&&(mission==='10'||r.electricalW!==null&&r.electricalW<=5.6);const stars=pass?(optimized?(mission!=='12'||r.marginDb!==null&&r.marginDb>=6&&workshopCost(w)<=90?3:2):1):0;
 return {mission,pass,stars,result:r,objectives,hint:pass?mission==='10'?'CW Light가 켜졌습니다. 이 빛에는 아직 데이터가 없습니다.':mission==='11'?'Driver의 데이터를 빛에 실었습니다. 이제 실제 Fiber 경로를 완성하세요.':'당신의 OE Tx 경로가 교육용 Link Budget 목표를 충족했습니다. 다른 OE와 Rx 광학 성능은 독립 상태입니다.':objectives.find(o=>!o.pass)?.label+' 조건을 확인하세요. 손실이 큰 구간을 살펴보고 한 가지씩 바꿔보세요.'};
}
export function validateChapter4(s:WorkshopState){
 check(s&&s.schema===1&&s.model===WORKSHOP_MODEL&&typeof s.profileId==='string'&&!!s.profileId&&Number.isSafeInteger(s.revision)&&s.revision>=0&&C4_IDS.includes(s.current)&&['EVENT','BUILD','RESULT','CLEARED'].includes(s.phase)&&/^oe-00[1-4]$/.test(s.selectedOE),'Chapter4 Schema / Profile 오류');
 check(s.designs&&typeof s.designs==='object'&&Object.keys(s.designs).length<=4,'Workshop designs 오류');for(const [id,w]of Object.entries(s.designs)){check(id===w.oeId,'Design / OE 불일치');validateWorkshopDesign(w);if(w.qualified){const q=w.qualified;check(q.oeId===id&&q.designId===w.id&&q.designRevision===w.revision&&q.evidence==='Educational Assumption'&&q.rxMarginDb===null&&q.graphHash===q.core.compiler?.hash&&JSON.stringify(q.parameterSet)===JSON.stringify(w.parameters),'Simulation provenance 오류');check(JSON.stringify(q)===JSON.stringify(simulateWorkshop(w,q.bindingPackage,q.stage)),'Solver Result numerical parity 오류');}}
 check(Array.isArray(s.receipts)&&s.receipts.length<=3&&new Set(s.receipts.map(x=>x.mission)).size===s.receipts.length,'Workshop Reward 중복');const unlocks:string[]=[];
 for(const rec of s.receipts){check(C4_IDS.includes(rec.mission)&&Number.isSafeInteger(rec.revision)&&rec.revision>0&&rec.revision<=s.revision,'Workshop Receipt 오류');const reward=C4_REWARDS[rec.mission];check(rec.xp===reward.xp&&rec.credits===reward.credits,'Reward 위조 오류');const out=evaluateWorkshop(rec.design,rec.package,rec.mission);check(out.pass&&out.stars===rec.stars&&sha256(JSON.stringify(out))===rec.resultHash,'Reward simulation parity 오류');unlocks.push(...reward.unlocks);}
 for(const id of C4_IDS){check(typeof s.cleared[id]==='boolean'&&s.cleared[id]===s.receipts.some(r=>r.mission===id)&&Number.isSafeInteger(s.attempts[id])&&s.attempts[id]>=0&&Number.isInteger(s.bestStars[id])&&s.bestStars[id]>=0&&s.bestStars[id]<=3&&s.cleared[id]===(s.bestStars[id]>0)&&(!s.cleared[id]||s.attempts[id]>0),'Clear / Attempts / Stars 오류');}
 check(JSON.stringify(s.unlocked)===JSON.stringify(unlocks)&&(!s.cleared['11']||s.cleared['10'])&&(!s.cleared['12']||s.cleared['11'])&&(s.current==='10'||s.cleared[s.current==='11'?'10':'11']),'Chapter4 Unlock 오류');
 if(s.last){const w=s.designs[s.selectedOE];check(w&&s.last.mission===s.current&&['RESULT','CLEARED'].includes(s.phase)&&s.last.result.designRevision===w.revision&&JSON.stringify(s.last.result.parameterSet)===JSON.stringify(w.parameters)&&s.last.pass===(s.phase==='CLEARED'),'Stored Workshop Result 오류');}
}
export function transitionChapter4(s:WorkshopState,a:WorkshopAction,c3:C3State,previousCredits:number):WorkshopState{
 validateChapter4(s);check(s.profileId===c3.profileId&&c3.cleared['09']&&c3.unlocked.includes('photonics-workshop'),'Mission09과 Photonics Workshop Unlock 필요');const g=structuredClone(s),pkg=c3.config;let w=g.designs[g.selectedOE];
 const editable=()=>{check(g.phase==='BUILD'&&w,'Mission 시작 / Retry를 선택하세요.');};
 if(a.type==='select'){check(pkg.oes.some(o=>o.id===a.oeId),'실제 Package OE를 선택하세요.');g.selectedOE=a.oeId;g.current=g.designs[a.oeId]?.qualified?.stage||'10';g.last=null;g.phase='EVENT';}
 else if(a.type==='start'){check(C4_IDS.includes(a.mission)&&(a.mission==='10'||g.cleared[a.mission==='11'?'10':'11']),'이전 Mission을 완료하세요.');check(pkg.oes.some(o=>o.id===g.selectedOE&&o.enabled&&o.type==='oe800'),'기존 800G OE를 선택하세요.');g.current=a.mission;g.phase='BUILD';g.last=null;if(!w)g.designs[g.selectedOE]=newWorkshopDesign(g.selectedOE);}
 else if(a.type==='run'){editable();g.attempts[g.current]++;g.last=evaluateWorkshop(w,pkg,g.current);w.qualified=structuredClone(g.last.result);g.phase=g.last.pass?'CLEARED':'RESULT';if(g.last.pass){g.bestStars[g.current]=Math.max(g.bestStars[g.current],g.last.stars);if(!g.cleared[g.current]){g.cleared[g.current]=true;const r=C4_REWARDS[g.current],receiptDesign=structuredClone(w);receiptDesign.qualified=null;g.receipts.push({mission:g.current,xp:r.xp,credits:r.credits,revision:g.revision+1,stars:g.last.stars,design:receiptDesign,package:structuredClone(pkg),resultHash:sha256(JSON.stringify(g.last))});g.unlocked.push(...r.unlocks);}}}
 else{editable();switch(a.type){
  case 'cw':check(pkg.els,'기존 Package ELS가 필요합니다.');w.cwConnected=true;break;
  case 'laser':check(['low','balanced','high'].includes(a.preset),'Laser Preset 오류');w.parameters.launchDbm={low:-3,balanced:3,high:10}[a.preset];break;
  case 'modulator':check(g.current!=='10'&&['MZM','EAM'].includes(a.kind),'Modulator Workshop은 Mission11부터');w.parameters.modulator=a.kind;w.parameters.modLossDb=a.kind==='MZM'?3:4;w.parameters.driverWPerLane=a.kind==='MZM'?.3:.2;w.driverConnected=false;w.outputConnected=false;break;
  case 'driver':check(w.parameters.modulator&&pkg.asic,'Modulator를 먼저 배치하세요.');w.driverConnected=true;break;
  case 'output':check(w.parameters.modulator,'Modulator가 필요합니다.');w.outputConnected=true;break;
  case 'waveguide':check(g.current==='12','Waveguide는 Mission12에서');w.waveguide=true;break;
  case 'route':check(g.current==='12'&&['short','balanced','long'].includes(a.preset),'Route 오류');w.parameters.lengthCm={short:1,balanced:4,long:14}[a.preset];w.parameters.bends={short:1,balanced:4,long:8}[a.preset];break;
  case 'coupler':check(g.current==='12'&&['EdgeCoupler','GratingCoupler'].includes(a.kind),'Coupler 오류');w.parameters.coupler=a.kind;w.parameters.couplingDb=a.kind==='EdgeCoupler'?1:3;w.couplerConnected=true;break;
  case 'fau':check(g.current==='12'&&pkg.fau,'기존 FAU Interface가 필요합니다.');w.fauConnected=true;break;
  case 'receiver':check(g.current==='12','Receiver는 Mission12에서');w.receiverConnected=true;break;
  case 'parameters':check(g.cleared['12'],'Challenge는 Mission12 이후 해금됩니다.');check(Object.keys(a.values).every(k=>['launchDbm','wpe','modLossDb','lengthCm','alphaDbCm','bends','bendLossDb','couplingDb','fiberDb','sensitivityDbm','driverWPerLane'].includes(k)),'지원하지 않는 Parameter');Object.assign(w.parameters,a.values);break;
  case 'reset':g.designs[g.selectedOE]=newWorkshopDesign(g.selectedOE);w=g.designs[g.selectedOE];g.current='10';break;
  default:throw Error('지원하지 않는 Workshop Command');}
  w.revision++;w.qualified=null;g.last=null;
 }
 check(c4Wallet(g,previousCredits)>=0,'Credits 부족 · Workshop Refund / Reset으로 현재 OE 부품을 환불하세요.');g.revision++;validateChapter4(g);return g;
}
