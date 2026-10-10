import {missionEntry} from './exploration-catalog';
import {newGame,forecast} from './game-core';
import type {World,MissionId} from './game-schema';
import {newChapter2,simulateChapter2} from './chapter2';
import type {C2Config,C2Id} from './chapter2';
import {newChapter3,evaluateChapter3,validatePackage} from './chapter3';
import {completePackage,emptyPackage,addConnections,evaluateOrder} from './cpo-model';
import type {PackageConfig,Architecture,OrderId,C3Id,OrderReceipt} from './cpo-schema';
import {newWorkshopDesign,evaluateWorkshop,validateWorkshopDesign} from './chapter4';
import type {WorkshopDesign,Mission4} from './workshop-schema';
import {newSubstrateDesign,evaluateSubstrate,validateSubstrateDesign} from './chapter5';
import type {SubstrateDesign,Mission5} from './substrate-schema';
import {defaultRecipe6,simulateAssembly6,input6,simulateAssemblyChunked6} from './assembly-model';
import {evaluateMission6,validateRecipe6} from './chapter6';
import type {Recipe6,Mission6,AssemblyRun6} from './assembly-schema';
import {sha256} from './hash';
export type Scenario={mission:string;revision:number;world:World;network:C2Config;package:PackageConfig;architecture:Architecture;order:OrderId;orders:OrderReceipt[];workshop:WorkshopDesign;substrate:SubstrateDesign;recipe:Recipe6};
export type PracticeResult={mission:string;revision:number;inputHash:string;pass:boolean;stars:number;objectives:{label:string;pass:boolean;actual:string}[];details:unknown};
export type PracticeSession={scenario:Scenario;attempts:number;result:PracticeResult|null;previous:PracticeResult|null};
export type ExplorationState={schema:1;selected:string|null;view:'navigator'|'mission';sessions:Record<string,PracticeSession>};
export const newExploration=():ExplorationState=>({schema:1,selected:null,view:'navigator',sessions:{}});
function opticalStarter(){const w=newWorkshopDesign('oe-001');w.parameters.modulator='MZM';w.parameters.modLossDb=3;w.parameters.coupler='EdgeCoupler';w.parameters.couplingDb=1;Object.assign(w,{cwConnected:true,driverConnected:true,outputConnected:true,waveguide:true,couplerConnected:true,fauConnected:true,receiverConnected:true});return w;}
// Design fixtures only: no Campaign state, clears, XP or reward receipts are copied.
export function starterScenario(mission:string):Scenario{
 const {chapter}=missionEntry(mission),n=Number(mission),world=newGame().world,network=newChapter2('practice').config;
 if(n===3){world.racks.push({id:'rack-002',type:'ComputeRack-T1',slot:1,purchased:true});}
 if(n>=5){network.highDensity=true;network.connected=['rack-001','rack-002','rack-003','rack-004'];}
 if(n>=6){network.spine=true;network.uplinks={A:200,B:200};}
 let pkg=chapter>=4?completePackage():n===9?completePackage(2):emptyPackage();pkg.installed=chapter>=4;
 let workshop=n>=13?opticalStarter():newWorkshopDesign('oe-001');
 if(n===11)workshop.cwConnected=true;
 if(n===12){workshop=opticalStarter();workshop.waveguide=false;workshop.couplerConnected=false;workshop.fauConnected=false;workshop.receiverConnected=false;workshop.parameters.coupler=null;workshop.parameters.couplingDb=null;}
 const substrate=newSubstrateDesign();
 if(n>=14){substrate.coupling='edge';substrate.substrateConnected=true;}
 if(n>=15){substrate.fauConnected=true;substrate.lateralUm=0;substrate.verticalUm=0;substrate.pitchMismatchUm=0;}
 if(n>=16){substrate.channels=16;substrate.laneGbps=50;}
 const recipe=defaultRecipe6();if(n===18){recipe.batch=50;recipe.order='quality';}
 const s:Scenario={mission,revision:0,world,network,package:pkg,architecture:'pluggable',order:'service',orders:[],workshop,substrate,recipe};validateScenario(s);return s;
}
export function starterExplanation(m:string){const n=Number(m);return n>=16?{provided:'교육용 4-OE Package, 유효한 OE-001 Tx path, 16 × 50G Substrate–FAU 경로. 선행 Clear와 보상 기록은 없습니다.',decision:n===16?'Coupling Architecture를 비교하고 Customer window / budget을 검증하세요.':n===17?'Equipment, Pitch matching, Fine tune과 Seed를 직접 선택하세요.':'Equipment, Pitch, Known-Good, Test, Rework와 Batch를 직접 선택하세요.'}:n>=13?{provided:'유효한 OE-001과 Package 광원·FAU context.',decision:'Substrate 연결, Coupling, Alignment와 Channel / Route를 설계하세요.'}:n>=10?{provided:'교육용 4-OE Package와 해당 Mission에 필요한 선행 광경로.',decision:'현재 단계의 CW / Modulator / Output path와 Optical parameter를 선택하세요.'}:n===9?{provided:'2-OE Package bench; Data Center 설치는 아직 수행하지 않았습니다.',decision:'4-OE 경로를 확장하고 설치·전력·비용을 검증하세요.'}:{provided:'현재 Mission의 선행 단계에 필요한 기본 설계 context.',decision:'장비와 연결 조건을 선택한 뒤 실제 Simulation을 실행하세요.'};}
export function binding(s:Scenario){return {design:s.substrate,context:{workshop:s.workshop,package:s.package}};}
export function validateScenario(s:Scenario){
 missionEntry(s.mission);if(!Number.isSafeInteger(s.revision)||s.revision<0)throw Error('Practice revision 오류');validatePackage(s.package);validateWorkshopDesign(s.workshop);validateSubstrateDesign(s.substrate);validateRecipe6(s.recipe);
 if(s.workshop.oeId!==s.substrate.oeId||s.workshop.qualified!==null)throw Error('Practice optical binding 오류');
 const w=s.world;if(!w||w.switch.id!=='switch-001'||!['ScaleOutSwitch-T1','ScaleOutSwitch-T2'].includes(w.switch.type)||!Array.isArray(w.racks)||w.racks.length<1||w.racks.length>8||w.racks.some((r,i)=>r.id!=='rack-'+String(i+1).padStart(3,'0')||r.type!=='ComputeRack-T1'||r.slot!==i||r.purchased!==(i>0)))throw Error('Practice rack configuration 오류');
 const c=s.network;if(!c||![c.highDensity,c.spine,c.fiber].every(v=>typeof v==='boolean')||!Array.isArray(c.connected)||new Set(c.connected).size!==c.connected.length||c.connected.length>(c.highDensity?4:2)||c.connected.some(r=>!['rack-001','rack-002','rack-003','rack-004'].includes(r))||!['A','B',null].includes(c.selectedPort)||['A','B'].some(e=>![0,100,200].includes(c.uplinks[e as 'A'])||![0,400,800].includes(c.modules[e as 'A'])))throw Error('Practice network configuration 오류');
 if(!['cpo','pluggable','optimized-pluggable'].includes(s.architecture)||!['service','density'].includes(s.order)||!Array.isArray(s.orders)||s.orders.length>2||new Set(s.orders.map(o=>o.order)).size!==s.orders.length)throw Error('Practice architecture 오류');
 for(const o of s.orders){const r=evaluateOrder(o.architecture,o.order);if(!r.pass||o.resultHash!==sha256(JSON.stringify(r)))throw Error('Practice order provenance 오류');}
}
export function evaluatePractice(s:Scenario,mc?:AssemblyRun6):PracticeResult{
 validateScenario(s);const n=Number(s.mission);let result:any;
 if(n<=3){const g=newGame('practice');g.world=s.world;g.currentMission=s.mission as MissionId;const r=forecast(g);result={...r.evaluation,simulation:r.simulation};}
 else if(n<=6)result=simulateChapter2({...newChapter2('practice'),config:s.network,current:s.mission as C2Id});
 else if(n<=9)result=evaluateChapter3({...newChapter3('practice'),current:s.mission as C3Id,config:s.package,architecture:s.architecture,order:s.order,orderReceipts:s.orders});
 else if(n<=12)result=evaluateWorkshop(s.workshop,s.package,s.mission as Mission4);
 else if(n<=15)result=evaluateSubstrate(s.substrate,binding(s).context,s.mission as Mission5);
 else result=evaluateMission6(s.mission as Mission6,s.recipe,binding(s),mc||simulateAssembly6(input6(binding(s),s.recipe)));
 // Canonical JSON removes optional undefined diagnostics so reload is byte stable.
 return JSON.parse(JSON.stringify({mission:s.mission,revision:s.revision,inputHash:sha256(JSON.stringify(s)),pass:result.pass,stars:result.stars,objectives:result.objectives,details:result}));
}
export async function runPractice(session:PracticeSession,control:{cancelled:()=>boolean;progress:(n:number)=>void}):Promise<{session:PracticeSession;mc:AssemblyRun6|null}|null>{
 const next=structuredClone(session),s=next.scenario;let mc:AssemblyRun6|null=null;
 if(Number(s.mission)>=16){mc=await simulateAssemblyChunked6(input6(binding(s),s.recipe),control);if(!mc)return null;}
 if(s.mission==='07'){const r=evaluateOrder(s.architecture,s.order);if(r.pass){s.orders=s.orders.filter(o=>o.order!==s.order);s.orders.push({order:s.order,architecture:s.architecture,resultHash:sha256(JSON.stringify(r))});}}
 next.previous=next.result;next.result=evaluatePractice(s,mc||undefined);next.attempts++;return {session:next,mc};
}
export function assemblePracticePackage(s:Scenario,paths:number){s.package=completePackage(paths);s.package.installed=false;}
export function connectPracticePackage(s:Scenario,kind:'electrical'|'laser'|'optical'|'fiber'){s.package=addConnections(s.package,kind);if(kind==='fiber')s.package.fiberFixture=true;}
