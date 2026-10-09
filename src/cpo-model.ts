import {allocateTraffic} from './traffic-solver';
import {CPO_MODEL} from './cpo-schema';
import type {Architecture,OrderId,PackageConfig,PackageGraph,Port,Connection,CPOResult} from './cpo-schema';
export const CPO_ASSUMPTIONS=[
 'Educational Assumption: local switch core + local electrical I/O + local optical conversion + local laser DC input. Remote peers, GPU, cooling and whole-rack power are excluded equally.',
 'Same boundary: one-direction aggregate payload, 800G nominal per path, 80% payload efficiency, fixed 22,000 Gbit/path and 40 s Compute floor. CPO changes interface architecture, not protocol or rate.',
 'Electrical reach = routed Manhattan distance from ASIC edge to OE centre in model mm; 0.1 synthetic W/mm per OE. Screen pixels are derived from these coordinates, not a power input.',
 'Optical loss/margin/reach qualification are Unknown. Explicitly declared educational 1 m matched Tx/Rx fixture permits Assumed-compatible game links, not Engineering verification.',
 'Credits and geometry are toy educational presets, not vendor prices, measured power, yield, reliability or packaging dimensions.'
];
export const ORDERS={service:{title:'Service-first Customer',paths:2,requiredGb_s:1280,powerW:85,costCredits:230,panelUnits:3,serviceability:'field-module' as const},density:{title:'Power-limited AI Expansion',paths:4,requiredGb_s:2560,powerW:100,costCredits:340,panelUnits:2,serviceability:null}};
export function emptyPackage():PackageConfig{return {id:'package-001',switchId:'cpo-switch-001',region:'compact',asic:false,oes:[],els:false,fau:false,connections:[],fiberFixture:false,installed:false,references:[]};}
export function oeCoordinates(slot:number,position:'near'|'far'){const r=position==='near'?40:90;return [{x:r,y:0},{x:-r,y:0},{x:0,y:-r},{x:0,y:r}][slot];}
export function electricalReach(c:PackageConfig,slot:number){const oe=c.oes.find(o=>o.slot===slot);if(!oe)return null;const p=oeCoordinates(slot,oe.position);return Math.max(Math.abs(p.x)-20,0)+Math.max(Math.abs(p.y)-20,0);}
export function packageGraph(c:PackageConfig):PackageGraph{
 const components:PackageGraph['components']=[],ports:Port[]=[];
 const component=(id:string,parentId:string|null,type:PackageGraph['components'][number]['type'],powerW=0,costCredits=0,xMM:number|null=null,yMM:number|null=null,widthMM:number|null=null,heightMM:number|null=null)=>components.push({id,parentId,type,powerW,costCredits,xMM,yMM,widthMM,heightMM,evidence:'Educational Assumption'});
 const port=(ownerId:string,name:string,kind:Port['kind'],direction:Port['direction'],lanes:number,laneRateGb_s:number|null,nominalGb_s:number|null,interfaceId:string)=>ports.push({id:ownerId+':'+name,ownerId,kind,direction,lanes,laneRateGb_s,nominalGb_s,interfaceId});
 component('dc-world',null,'DataCenter');component('switch-rack-001','dc-world','SwitchRack');component(c.switchId,'switch-rack-001','CPOSwitch');component(c.id,c.switchId,'Package');
 const size=c.region==='compact'?120:220;component('region-001',c.id,'PackageRegion',0,c.asic?(c.region==='compact'?20:60):0,0,0,size,size);
 if(c.asic){component('asic-001','region-001','SwitchASIC',40,120,0,0,40,40);for(let i=0;i<4;i++)port('asic-001','data-'+i,'electrical-data','out',8,100,800,'educational-electrical-8x100');}
 for(const o of c.oes){const p=oeCoordinates(o.slot,o.position),rate=o.type==='oe800'?800:400;component(o.id,'region-001','OpticalEngine',8,o.type==='oe800'?30:25,p.x,p.y,10,10);
  port(o.id,'electrical','electrical-data','in',8,100,800,'educational-electrical-8x100');
  port(o.id,'laser','optical-cw','in',1,null,null,'educational-cw');
  port(o.id,'tx','optical-data','out',1,null,rate,'educational-optical-data');port(o.id,'rx','optical-data','in',1,null,rate,'educational-optical-data');
 }
 if(c.els){component('els-001','switch-rack-001','LaserSource',16,30,-90,-65,20,15);for(let i=0;i<4;i++)port('els-001','cw-'+i,'optical-cw','out',1,null,null,'educational-cw');}
 if(c.fau){component('fau-001','switch-rack-001','FiberInterface',0,10,90,-65,20,15);for(let i=0;i<4;i++){const rate=c.oes.find(o=>o.slot===i)?.type==='oe400'?400:800;for(const [n,d]of [['tx-in','in'],['rx-out','out'],['tx-out','out'],['rx-in','in']] as const)port('fau-001',n+'-'+i,'optical-data',d,1,null,rate,'educational-optical-data');}}
 for(let i=0;i<4;i++){component('remote-'+i,'dc-world','RemoteEndpoint');port('remote-'+i,'rx','optical-data','in',1,null,800,'educational-optical-data');port('remote-'+i,'tx','optical-data','out',1,null,800,'educational-optical-data');}
 return {model:CPO_MODEL,packageId:c.id,components,ports,connections:structuredClone(c.connections)};
}
export function validateConnection(g:PackageGraph,c:Connection){
 const a=g.ports.find(p=>p.id===c.from),b=g.ports.find(p=>p.id===c.to);
 if(!a||!b)throw Error('없는 Component / Port를 연결할 수 없습니다.');
 if(a.direction!=='out'||b.direction!=='in'||a.ownerId===b.ownerId)throw Error('출력에서 입력으로 연결하세요.');
 if(a.kind!==b.kind||a.interfaceId!==b.interfaceId)throw Error('Electrical, Optical Data, Laser CW Port를 구분하세요.');
 if(a.lanes!==b.lanes||a.laneRateGb_s!==b.laneRateGb_s||a.nominalGb_s!==b.nominalGb_s)throw Error('Port / Lane Rate가 호환되지 않습니다.');
 if(g.connections.some(e=>e.id!==c.id&&(e.from===c.from||e.to===c.to)))throw Error('이미 사용 중인 Port입니다.');
}
export function addConnections(c:PackageConfig,kind:'electrical'|'laser'|'optical'|'fiber'){
 const next=structuredClone(c),g=packageGraph(c);
 const add=(id:string,from:string,to:string)=>{const e={id,from,to};validateConnection({...g,connections:next.connections},e);next.connections=next.connections.filter(x=>x.id!==id);next.connections.push(e);};
 for(const o of next.oes.filter(o=>o.enabled).sort((a,b)=>a.slot-b.slot)){const i=o.slot;
  if(kind==='electrical')add('electrical-'+i,'asic-001:data-'+i,o.id+':electrical');
  if(kind==='laser')add('laser-'+i,'els-001:cw-'+i,o.id+':laser');
  if(kind==='optical'){add('optical-tx-'+i,o.id+':tx','fau-001:tx-in-'+i);add('optical-rx-'+i,'fau-001:rx-out-'+i,o.id+':rx');}
  if(kind==='fiber'){add('fiber-tx-'+i,'fau-001:tx-out-'+i,'remote-'+i+':rx');add('fiber-rx-'+i,'remote-'+i+':tx','fau-001:rx-in-'+i);}
 }
 return next;
}
export function packageCost(c:PackageConfig){return packageGraph(c).components.reduce((s,n)=>s+n.costCredits,0);}
export function simulatePackage(c:PackageConfig,requiredPaths=4,requireInstalled=true):CPOResult{
 const g=packageGraph(c),issues:CPOResult['issues']=[];
 const issue=(code:string,componentId:string,message:string)=>issues.push({code,componentId,message});
 if(!c.asic)issue('ASIC','asic-001','ASIC을 Package 중앙에 배치하세요.');
 if(!c.els)issue('LASER','els-001','ELS가 없습니다. OE에는 실제 Laser Supply Path가 필요합니다.');
 if(!c.fau)issue('OUTPUT','fau-001','Fiber / Connector Interface를 배치하세요.');
 if(requireInstalled&&!c.installed)issue('INSTALL',c.switchId,'조립한 CPO Switch를 Data Center에 설치하세요.');
 if(!c.fiberFixture)issue('UNKNOWN','fau-001','Optical Feasibility는 Unknown입니다. 교육용 matched Tx/Rx fixture를 명시적으로 선택해야 합니다.');
 const size=c.region==='compact'?120:220;
 for(const o of c.oes){const p=oeCoordinates(o.slot,o.position);if(Math.abs(p.x)+5>size/2||Math.abs(p.y)+5>size/2)issue('BOUNDARY',o.id,'OE가 Package Boundary 밖에 있습니다. Near 위치로 이동하거나 Region을 확장하세요.');}
 for(const e of g.connections)try{validateConnection(g,e);}catch(err){issue('CONNECTION',e.id,(err as Error).message);}
 const edge=(id:string,from:string,to:string)=>g.connections.some(e=>e.id===id&&e.from===from&&e.to===to);
 const valid=c.oes.filter(o=>{const i=o.slot,ok=o.enabled&&c.asic&&c.els&&c.fau&&c.fiberFixture&&!issues.some(x=>x.code==='BOUNDARY'&&x.componentId===o.id)&&
  edge('electrical-'+i,'asic-001:data-'+i,o.id+':electrical')&&edge('laser-'+i,'els-001:cw-'+i,o.id+':laser')&&
  edge('optical-tx-'+i,o.id+':tx','fau-001:tx-in-'+i)&&edge('optical-rx-'+i,'fau-001:rx-out-'+i,o.id+':rx')&&
  edge('fiber-tx-'+i,'fau-001:tx-out-'+i,'remote-'+i+':rx')&&edge('fiber-rx-'+i,'remote-'+i+':tx','fau-001:rx-in-'+i)&&!issues.some(x=>x.code==='CONNECTION');
  if(!ok)issue('PATH',o.id,'Electrical → OE、ELS → OE、OE ↔ FAU、Fiber Tx/Rx를 모두 확인하세요.');return ok&&(!requireInstalled||c.installed);
 });
 for(let i=0;i<requiredPaths;i++)if(!c.oes.some(o=>o.slot===i))issue('OE','oe-00'+(i+1),'Optical Engine '+(i+1)+'을 배치하세요.');
 const traffic=allocateTraffic([{id:c.switchId,type:'Switch',fabricGb_s:2560},...Array.from({length:4},(_,i)=>({id:'remote-'+i,type:'ComputeRack' as const,fabricGb_s:null}))],valid.map(o=>({id:'fiber-link-'+o.slot,a:c.switchId,b:'remote-'+o.slot,capacityGb_s:(o.type==='oe800'?800:400)*.8})),Array.from({length:requiredPaths},(_,i)=>({id:'demand-'+i,source:c.switchId,target:'remote-'+i,amountGbit:22000})));
 const reach=c.oes.map(o=>electricalReach(c,o.slot)!);
 const switchPowerW=c.asic?40:0,conversionPowerW=c.oes.length*8,laserPowerW=c.els?16:0,electricalPowerW=c.asic?reach.reduce((s,r)=>s+r*.1,0):0;
 const powerLedger=[{id:'asic-001:core',watts:switchPowerW},...c.oes.flatMap((o,i)=>[{id:o.id+':conversion',watts:8},{id:o.id+':electrical-io',watts:c.asic?reach[i]*.1:0}]),{id:'els-001:dc-input',watts:laserPowerW}];
 return {model:CPO_MODEL,architecture:'cpo',paths:valid.length,nominalPerPathGb_s:800,aggregateEffectiveGb_s:traffic.effectiveGb_s,switchPowerW,electricalPowerW,conversionPowerW,laserPowerW,powerW:powerLedger.reduce((s,n)=>s+n.watts,0),costCredits:packageCost(c),frontPanelUnits:(c.fau?c.oes.length*.25:0)+(c.els?.5:0),packageAreaMM2:size*size,serviceability:'package-service-field-ELS',electricalReachMM:reach,opticalLossDb:null,opticalStatus:issues.some(x=>['CONNECTION','BOUNDARY'].includes(x.code))?'Invalid':c.fiberFixture&&valid.length===requiredPaths?'Assumed-compatible':'Unknown',computeSeconds:40,networkSeconds:traffic.networkSeconds,completionSeconds:traffic.networkSeconds===null?null:Math.max(40,traffic.networkSeconds),issues,powerLedger,traffic,graph:g,assumptions:[...CPO_ASSUMPTIONS]};
}
export function completePackage(paths=4):PackageConfig{let c=emptyPackage();c.asic=true;c.els=true;c.fau=true;c.oes=Array.from({length:paths},(_,i)=>({id:'oe-00'+(i+1),type:'oe800',slot:i,position:'near',enabled:true})) as PackageConfig['oes'];for(const k of ['electrical','laser','optical','fiber'] as const)c=addConnections(c,k);c.fiberFixture=true;c.installed=true;return c;}
export function compareArchitecture(a:Architecture,order:OrderId):CPOResult{
 const n=ORDERS[order].paths;
 if(a==='cpo')return simulatePackage(completePackage(n),n,true);
 const optimized=a==='optimized-pluggable',switchPowerW=40,electricalPowerW=n*(optimized?4:8),conversionPowerW=n*8,laserPowerW=n*4;
 const traffic=allocateTraffic([{id:'cpo-switch-001',type:'Switch',fabricGb_s:2560},...Array.from({length:n},(_,i)=>({id:'remote-'+i,type:'ComputeRack' as const,fabricGb_s:null}))],Array.from({length:n},(_,i)=>({id:'fiber-link-'+i,a:'cpo-switch-001',b:'remote-'+i,capacityGb_s:640})),Array.from({length:n},(_,i)=>({id:'demand-'+i,source:'cpo-switch-001',target:'remote-'+i,amountGbit:22000})));
 const powerLedger=[{id:'asic:core',watts:40},...Array.from({length:n},(_,i)=>[{id:'pluggable-'+i+':electrical-io',watts:optimized?4:8},{id:'pluggable-'+i+':conversion',watts:8},{id:'pluggable-'+i+':internal-laser-dc',watts:4}]).flat()];
 return {model:CPO_MODEL,architecture:a,paths:n,nominalPerPathGb_s:800,aggregateEffectiveGb_s:traffic.effectiveGb_s,switchPowerW,electricalPowerW,conversionPowerW,laserPowerW,powerW:powerLedger.reduce((s,n)=>s+n.watts,0),costCredits:(optimized?70:40)+n*60,frontPanelUnits:n*(optimized?.8:1),packageAreaMM2:0,serviceability:'field-module',electricalReachMM:Array(n).fill(optimized?100:200),opticalLossDb:null,opticalStatus:'Assumed-compatible',computeSeconds:40,networkSeconds:traffic.networkSeconds,completionSeconds:Math.max(40,traffic.networkSeconds!),issues:[],powerLedger,traffic,graph:null,assumptions:[...CPO_ASSUMPTIONS,'Pluggable electrical I/O uses explicit 8W/4W presets; its reference distance is explanatory and not the CPO reach coefficient.']};
}
export function evaluateOrder(a:Architecture,order:OrderId){const r=compareArchitecture(a,order),o=ORDERS[order];const objectives=[{label:'Effective Bandwidth ≥ '+o.requiredGb_s+' Gb/s',pass:r.aggregateEffectiveGb_s>=o.requiredGb_s,actual:r.aggregateEffectiveGb_s+' Gb/s'},{label:'Local Switch Power ≤ '+o.powerW+' W',pass:r.powerW<=o.powerW,actual:r.powerW+' W'},{label:'Upgrade Cost ≤ '+o.costCredits+' Credits',pass:r.costCredits<=o.costCredits,actual:r.costCredits+' Credits'},{label:'Front-panel Space ≤ '+o.panelUnits,pass:r.frontPanelUnits<=o.panelUnits,actual:String(r.frontPanelUnits)},{label:'Serviceability '+(o.serviceability||'Package service accepted'),pass:!o.serviceability||r.serviceability===o.serviceability,actual:r.serviceability}];return {pass:objectives.every(o=>o.pass),result:r,objectives};}
