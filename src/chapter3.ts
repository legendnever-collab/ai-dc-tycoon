import {CPO_MODEL,CPO_SCHEMA} from './cpo-schema';
import type {C3State,C3Id,C3Action,C3Outcome,PackageConfig} from './cpo-schema';
import {emptyPackage,packageCost,packageGraph,simulatePackage,evaluateOrder,compareArchitecture,addConnections,validateConnection} from './cpo-model';
import {sha256} from './hash';
export const C3_IDS:C3Id[]=['07','08','09'];
export const C3_REWARDS={'07':{xp:360,credits:180,unlocks:['cpo-research-lab','architecture-comparison','cpo-blueprint']},'08':{xp:420,credits:200,unlocks:['oe-blueprint','els-component','package-view','reach-analyzer']},'09':{xp:500,credits:260,unlocks:['first-cpo-switch','photonics-workshop','laser-blueprint','modulator-blueprint']}};
function check(yes:unknown,message:string):asserts yes{if(!yes)throw Error(message);}
export function newChapter3(profileId:string):C3State{return {schema:CPO_SCHEMA,model:CPO_MODEL,profileId,revision:0,current:'07',phase:'EVENT',scale:'dc',selectedObjectId:'cpo-switch-001',selectedSlot:0,order:'service',architecture:'pluggable',orderReceipts:[],config:emptyPackage(),cleared:{'07':false,'08':false,'09':false},attempts:{'07':0,'08':0,'09':0},bestStars:{'07':0,'08':0,'09':0},receipts:[],unlocked:[],last:null,history:[]};}
export function c3Wallet(s:C3State,previousChaptersCredits:number){return previousChaptersCredits+s.receipts.reduce((v,r)=>v+r.credits,0)-packageCost(s.config);}
export function c3XP(s:C3State){return s.receipts.reduce((v,r)=>v+r.xp,0);}
export function requiredOEs(s:C3State){return s.current==='08'?2:4;}
export function assemblyStep(s:C3State){const c=s.config,n=requiredOEs(s),have=(prefix:string)=>Array.from({length:n},(_,i)=>c.connections.some(e=>e.id===prefix+i)).every(Boolean);
 if(!c.asic)return {id:'A',title:'Switch ASIC 배치',hint:'중앙 ASIC은 데이터를 Switch Fabric으로 분배합니다.'};
 if(c.oes.length<n)return {id:'B',title:'Optical Engine 배치 ('+c.oes.length+'/'+n+')',hint:'OE는 ASIC의 전기 데이터와 Fiber의 광 데이터를 변환합니다. Near Slot을 선택하세요.'};
 if(!have('electrical-'))return {id:'C',title:'Electrical Path 연결',hint:'ASIC의 8×100G Lane Group을 OE의 호환 입력에 연결합니다.'};
 if(!c.els)return {id:'D1',title:'External Laser Source 배치',hint:'Laser는 Package 밖에서 교체 가능한 ELS로 공급합니다.'};
 if(!have('laser-'))return {id:'D2',title:'Laser Supply 연결',hint:'CW Light를 OE의 Laser 입력에 공급하세요. 광 데이터 입력과 다릅니다.'};
 if(!c.fau)return {id:'E1',title:'Fiber / FAU Interface 배치',hint:'OE의 출력과 외부 Fiber를 이어주는 Connector Boundary입니다.'};
 if(!have('optical-tx-')||!have('optical-rx-'))return {id:'E2',title:'Optical Data Path 연결',hint:'송신과 수신 경로를 각각 연결합니다. 상세 Coupling Loss는 Unknown입니다.'};
 if(!c.fiberFixture||!have('fiber-tx-')||!have('fiber-rx-'))return {id:'F',title:'호환 Fiber Link 활성화',hint:'양쪽 800G Tx/Rx와 교육용 Link Fixture를 확인합니다. 실제 광학 검증은 아직 하지 않습니다.'};
 if(s.current==='09'&&!c.installed)return {id:'G',title:'CPO Switch를 Data Center에 설치',hint:'Assembly를 Network에 연결한 뒤 Simulation으로 전력·대역폭을 검증하세요.'};
 return {id:'RUN',title:'Simulation 실행',hint:'조립 완료만으로 Clear되지 않습니다. 계산된 Hard Objective가 모두 필요합니다.'};
}
export function evaluateChapter3(s:C3State):C3Outcome{
 if(s.current==='07'){const e=evaluateOrder(s.architecture,s.order),done=new Set(s.orderReceipts.map(r=>r.order));const objectives=[...e.objectives,{label:'두 Customer Order를 실제 Simulation으로 해결',pass:done.has('service')&&done.has('density'),actual:done.size+'/2 Orders'}];const pass=objectives.every(o=>o.pass);return {mission:'07',pass,stars:pass?(s.orderReceipts.some(r=>r.order==='service'&&r.architecture==='pluggable')?3:2):0,objectives,result:e.result,hint:e.pass&&done.size<2?'이 주문의 실험은 성공했습니다. 다른 Customer Order도 선택해 검증하세요.':e.pass?'같은 Bandwidth와 Traffic에서 정비성·비용·전력 조건에 맞는 Architecture를 선택했습니다.':'CPO가 항상 정답은 아닙니다. 이 주문의 Power, Cost, Space, Serviceability를 확인하세요.'};}
 const n=requiredOEs(s),r=simulatePackage(s.config,n,s.current==='09'),power=s.current==='08'?85:100,budget=s.current==='08'?260:340;
 const objectives=[{label:'유효 Optical Paths ≥ '+n,pass:r.paths>=n,actual:r.paths+'/'+n},{label:'Effective Bandwidth ≥ '+n*640+' Gb/s',pass:r.aggregateEffectiveGb_s>=n*640,actual:r.aggregateEffectiveGb_s+' Gb/s'},{label:'Laser Supply / Typed Paths 유효',pass:r.opticalStatus==='Assumed-compatible',actual:r.opticalStatus},{label:'Switch Power ≤ '+power+' W',pass:r.powerW<=power,actual:r.powerW+' W'},{label:'Package Area ≤ 14,400 mm²',pass:r.packageAreaMM2<=14400,actual:r.packageAreaMM2+' mm²'},{label:'Build Cost ≤ '+budget+' Credits',pass:r.costCredits<=budget,actual:r.costCredits+' Credits'},{label:'Workload ≤ 45 s',pass:r.completionSeconds!==null&&r.completionSeconds<=45,actual:r.completionSeconds===null?'Disconnected':r.completionSeconds+' s'}];
 if(s.current==='09')objectives.push({label:'CPO Switch installed in Data Center',pass:s.config.installed,actual:s.config.installed?'Installed':'Research Bench'});
 const pass=objectives.every(o=>o.pass);
 return {mission:s.current,pass,stars:pass?(r.powerW<= (s.current==='08'?76:96)?3:2):0,objectives,result:r,hint:pass?'같은 800G Path가 활성화되었습니다. 짧은 Electrical Reach의 전력 가정은 반영되지만 Optical Loss는 여전히 Unknown입니다.':r.issues[0]?.message||'전력·Package 크기·Cost를 확인하고 Near 배치로 조정하세요.'};
}
export function validatePackage(c:PackageConfig){
 check(!!c&&c.id==='package-001'&&c.switchId==='cpo-switch-001'&&['compact','wide'].includes(c.region),'Package Stable ID / Region 오류');
 for(const k of ['asic','els','fau','fiberFixture','installed'] as const)check(typeof c[k]==='boolean','Package Presence 오류');
 check(Array.isArray(c.oes)&&c.oes.length<=4,'OE 수 초과');const ids=new Set(),slots=new Set();
 for(const o of c.oes){check(Number.isInteger(o.slot)&&o.slot>=0&&o.slot<=3&&o.id==='oe-00'+(o.slot+1)&&!ids.has(o.id)&&!slots.has(o.slot),'OE Stable ID / Slot 중복 오류');ids.add(o.id);slots.add(o.slot);check(['oe800','oe400'].includes(o.type)&&['near','far'].includes(o.position)&&typeof o.enabled==='boolean','OE Model 오류');}
 check(!c.oes.length||c.asic,'ASIC 없는 OE');
 check(Array.isArray(c.connections)&&c.connections.length<=24&&new Set(c.connections.map(e=>e.id)).size===c.connections.length,'Connection ID 오류');
 const g=packageGraph(c);for(const e of c.connections){check(typeof e.id==='string'&&typeof e.from==='string'&&typeof e.to==='string','Connection 형식 오류');validateConnection(g,e);}
 check(Array.isArray(c.references)&&c.references.length<=4&&new Set(c.references.map(r=>r.oeId)).size===c.references.length,'Lab Reference 중복 오류');
 for(const r of c.references)check(r.hardwareId===c.switchId&&c.oes.some(o=>o.id===r.oeId)&&typeof r.designId==='string'&&r.designId.length>0&&r.designSchema===2&&r.designVersion==='0.2.0'&&r.status==='reference-only'&&/^[a-f0-9]{64}$/.test(r.snapshotSHA256),'Lab Reference-only Contract 오류');
}
export function validateChapter3(s:C3State){
 check(!!s&&s.schema===1&&s.model===CPO_MODEL&&typeof s.profileId==='string'&&s.profileId.length>0&&s.profileId.length<=200,'Chapter3 Schema / Model 오류');
 check(Number.isSafeInteger(s.revision)&&s.revision>=0&&C3_IDS.includes(s.current)&&['EVENT','BUILD','RESULT','CLEARED'].includes(s.phase),'Chapter3 Revision / Phase 오류');
 check(['dc','rack','package','workshop'].includes(s.scale)&&Number.isInteger(s.selectedSlot)&&s.selectedSlot>=0&&s.selectedSlot<=3,'World Scale / Slot 오류');
 check(['cpo-switch-001','package-001','asic-001','oe-001','oe-002','oe-003','oe-004','els-001','fau-001','dc-world','switch-rack-001'].includes(s.selectedObjectId),'World Object 오류');
 check(['service','density'].includes(s.order)&&['pluggable','optimized-pluggable','cpo'].includes(s.architecture),'Architecture Order 오류');validatePackage(s.config);
 check(Array.isArray(s.orderReceipts)&&s.orderReceipts.length<=2&&new Set(s.orderReceipts.map(r=>r.order)).size===s.orderReceipts.length,'Order Receipt 중복');
 const verifyOrders=(rs:C3State['orderReceipts'])=>{for(const r of rs){check(['service','density'].includes(r.order)&&['pluggable','optimized-pluggable','cpo'].includes(r.architecture),'Order 형식 오류');const e=evaluateOrder(r.architecture,r.order);check(e.pass&&r.resultHash===sha256(JSON.stringify(e)),'Order Simulation Provenance 오류');}};verifyOrders(s.orderReceipts);
 check(Array.isArray(s.receipts)&&s.receipts.length<=3&&new Set(s.receipts.map(r=>r.mission)).size===s.receipts.length,'Reward Receipt 중복');
 const expectedUnlocks:string[]=[];
 for(const rec of s.receipts){check(C3_IDS.includes(rec.mission)&&Number.isSafeInteger(rec.revision)&&rec.revision>0&&rec.revision<=s.revision&&Number.isInteger(rec.stars)&&rec.stars>=1&&rec.stars<=3,'Reward Receipt 형식 오류');const a=C3_REWARDS[rec.mission];check(rec.xp===a.xp&&rec.credits===a.credits,'Reward 위조 오류');validatePackage(rec.clearConfig);verifyOrders(rec.orderReceipts);
  const out=evaluateChapter3({...s,current:rec.mission,config:rec.clearConfig,architecture:rec.architecture,order:rec.order,orderReceipts:rec.orderReceipts});check(out.pass&&rec.resultHash===sha256(JSON.stringify(out)),'Reward Clear Provenance 오류');expectedUnlocks.push(...a.unlocks);
 }
 for(const id of C3_IDS){check(typeof s.cleared[id]==='boolean'&&s.cleared[id]===s.receipts.some(r=>r.mission===id),'Clear / Receipt 불일치');check(Number.isSafeInteger(s.attempts[id])&&s.attempts[id]>=0&&Number.isInteger(s.bestStars[id])&&s.bestStars[id]>=0&&s.bestStars[id]<=3&&s.cleared[id]===(s.bestStars[id]>0),'Attempts / Stars 오류');check(!s.cleared[id]||s.attempts[id]>0,'실행 없는 Clear');}
 check(JSON.stringify(s.unlocked)===JSON.stringify(expectedUnlocks),'Technology Tree / Receipt 불일치');
 check(!s.cleared['08']||s.cleared['07'],'Mission08 Lock');check(!s.cleared['09']||s.cleared['08'],'Mission09 Lock');
 check(s.current==='07'||s.cleared[s.current==='08'?'07':'08'],'Locked Mission 접근');check(s.scale!=='workshop'||s.cleared['09'],'Workshop Preview 잠금');
 check(Array.isArray(s.history)&&s.history.length<=100&&s.history.every(h=>Number.isSafeInteger(h.revision)&&h.revision<=s.revision&&typeof h.action==='string'),'History 오류');
 if(s.last){check(['RESULT','CLEARED'].includes(s.phase)&&s.last.mission===s.current&&JSON.stringify(s.last)===JSON.stringify(evaluateChapter3(s)),'Stored Result numerical parity 오류');check(s.phase==='CLEARED'?s.last.pass&&!(!s.cleared[s.current]):!s.last.pass,'Result / Phase 오류');}
}
export function transitionChapter3(s:C3State,a:C3Action,previousChaptersCredits:number,chapter2Clear:boolean):C3State{
 validateChapter3(s);check(chapter2Clear,'Mission06을 완료하면 CPO Research가 열립니다.');const g=structuredClone(s),c=g.config;
 const build=()=>check(g.phase==='BUILD','미션 시작 / Retry를 먼저 선택하세요.');const requirePackage=()=>{build();check(g.current!=='07','Package 조립은 Mission08에서 시작합니다.');};
 const n=requiredOEs(g),all=(prefix:string)=>Array.from({length:n},(_,i)=>c.connections.some(e=>e.id===prefix+i)).every(Boolean);
 switch(a.type){
  case 'start':check(C3_IDS.includes(a.mission)&&(a.mission==='07'||g.cleared[a.mission==='08'?'07':'08']),'이전 Mission을 먼저 완료하세요.');g.current=a.mission;g.phase='BUILD';g.last=null;if(a.mission==='07'){g.orderReceipts=[];g.order='service';g.architecture='pluggable';g.scale='dc';}else{g.architecture='cpo';g.scale='package';}break;
  case 'order':check(g.current==='07'&&['service','density'].includes(a.order),'Customer Order 오류');g.order=a.order;g.phase='BUILD';g.last=null;break;
  case 'architecture':check(g.current==='07'&&['pluggable','optimized-pluggable','cpo'].includes(a.architecture),'Architecture 오류');g.architecture=a.architecture;g.phase='BUILD';g.last=null;break;
  case 'navigate':check(['dc','rack','package','workshop'].includes(a.scale),'Scale 오류');check(a.scale!=='workshop'||g.cleared['09'],'Mission09 완료 후 Workshop Preview');check(a.scale!=='package'||g.cleared['07'],'CPO Blueprint를 먼저 연구하세요.');g.scale=a.scale;g.selectedObjectId=a.objectId|| (a.scale==='package'?'package-001':a.scale==='dc'?'cpo-switch-001':'switch-rack-001');break;
  case 'select-slot':requirePackage();check(Number.isInteger(a.slot)&&a.slot>=0&&a.slot<n,'사용 가능한 OE Slot을 선택하세요.');g.selectedSlot=a.slot;break;
  case 'asic':requirePackage();check(!c.asic,'ASIC은 이미 배치되었습니다.');c.asic=true;break;
  case 'oe':requirePackage();check(c.asic&&Number.isInteger(a.slot)&&a.slot>=0&&a.slot<n&&['oe800','oe400'].includes(a.model),'ASIC을 먼저 배치하고 유효한 OE Slot/Model을 선택하세요.');{const id='oe-00'+(a.slot+1),old=c.oes.find(o=>o.slot===a.slot);if(old){old.type=a.model;c.connections=c.connections.filter(e=>!e.from.startsWith(id+':')&&!e.to.startsWith(id+':')&&!e.id.startsWith('fiber-'));c.fiberFixture=false;c.installed=false;}else c.oes.push({id,type:a.model,slot:a.slot,position:'near',enabled:true});c.oes.sort((a,b)=>a.slot-b.slot);}break;
  case 'move-oe':requirePackage();check(['near','far'].includes(a.position),'OE 위치 오류');{const o=c.oes.find(o=>o.slot===a.slot);check(o,'먼저 OE를 배치하세요.');o.position=a.position;}c.installed=false;break;
  case 'region':requirePackage();check(['compact','wide'].includes(a.region),'Region 오류');c.region=a.region;c.installed=false;break;
  case 'electrical':requirePackage();check(c.asic&&c.oes.length>=n,'ASIC과 필요한 OE를 먼저 배치하세요.');g.config=addConnections(c,'electrical');break;
  case 'els':requirePackage();check(all('electrical-'),'Electrical Path를 먼저 연결하세요.');c.els=true;break;
  case 'laser':requirePackage();check(c.els,'ELS를 먼저 배치하세요.');g.config=addConnections(c,'laser');break;
  case 'fau':requirePackage();check(all('laser-'),'ELS → OE Laser Supply를 먼저 연결하세요.');c.fau=true;break;
  case 'optical':requirePackage();check(c.fau,'Fiber / FAU Interface를 먼저 배치하세요.');g.config=addConnections(c,'optical');break;
  case 'fiber':requirePackage();check(all('optical-tx-')&&all('optical-rx-'),'OE ↔ Interface Tx/Rx를 먼저 연결하세요.');check(a.assume===true,'Unknown 광학 성능을 검증된 PASS로 처리할 수 없습니다. 교육용 Fixture를 명시하세요.');g.config=addConnections(c,'fiber');g.config.fiberFixture=true;break;
  case 'install':requirePackage();check(g.current==='09','Mission09에서 실제 Switch를 설치합니다.');{const r=simulatePackage(c,4,false);check(r.opticalStatus==='Assumed-compatible'&&r.paths>=4&&r.aggregateEffectiveGb_s>=2560,'호환되는 Optical Path 4개를 먼저 완성하세요.');}c.installed=true;g.scale='dc';g.selectedObjectId=c.switchId;break;
  case 'reset':build();if(g.current==='07'){g.orderReceipts=[];g.order='service';g.architecture='pluggable';}else g.config=emptyPackage();g.last=null;break;
  case 'reference':check(g.current!=='07','OE를 배치한 뒤 Lab Reference를 연결하세요.');c.references=c.references.filter(r=>r.oeId!==a.reference.oeId);c.references.push(structuredClone(a.reference));if(g.last)g.last=evaluateChapter3(g);break;
  case 'run':build();g.attempts[g.current]++;if(g.current==='07'){const e=evaluateOrder(g.architecture,g.order);if(e.pass){g.orderReceipts=g.orderReceipts.filter(r=>r.order!==g.order);g.orderReceipts.push({order:g.order,architecture:g.architecture,resultHash:sha256(JSON.stringify(e))});g.orderReceipts.sort((a,b)=>a.order.localeCompare(b.order));}}
   g.last=evaluateChapter3(g);g.phase=g.last.pass?'CLEARED':'RESULT';if(g.last.pass){g.bestStars[g.current]=Math.max(g.bestStars[g.current],g.last.stars);if(!g.cleared[g.current]){g.cleared[g.current]=true;const reward=C3_REWARDS[g.current];g.receipts.push({mission:g.current,xp:reward.xp,credits:reward.credits,revision:g.revision+1,stars:g.last.stars,clearConfig:structuredClone(g.config),orderReceipts:structuredClone(g.orderReceipts),architecture:g.architecture,order:g.order,resultHash:sha256(JSON.stringify(g.last))});g.unlocked.push(...reward.unlocks);}}break;
  default:throw Error('지원하지 않는 Chapter3 Command입니다.');
 }
 check(c3Wallet(g,previousChaptersCredits)>=0,'Credits 부족입니다. Refund / Reset으로 Prototype 장비를 환불하고 다시 설계하세요.');
 g.revision++;g.history.push({revision:g.revision,action:a.type});g.history=g.history.slice(-100);validateChapter3(g);return g;
}
