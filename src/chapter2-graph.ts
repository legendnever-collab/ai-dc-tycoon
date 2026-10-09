import type {C2Config,C2Id} from './chapter2';
import {allocateTraffic} from './traffic-solver';
export const C2_GRAPH_MODEL='chapter2-typed-path-2.0.0';
export type C2Graph={modelVersion:typeof C2_GRAPH_MODEL;mission:C2Id;groups:{id:string;type:'NetworkGroup'}[];
 nodes:{id:string;type:'ComputeRack'|'Switch';groupId:string;fabricGb_s:number|null;computeWU_s:number;powerW:number;costCredits:number}[];
 ports:{id:string;type:'SwitchPort';nodeId:string;supportedRates:number[];interface:'educational-electrical-v1';moduleId:string|null;direction:'bidirectional'}[];
 links:{id:string;type:'Copper'|'FiberConnection';a:string;b:string;rateGb_s:number;payloadEfficiency:number;direction:'bidirectional';costCredits:number}[];
 modules:{id:string;type:'PluggableModule';portId:string;nominalGb_s:400|800;interface:'educational-electrical-v1';opticalInterface:'educational-fiber-v1';powerW:number;costCredits:number}[];
 demands:{id:string;type:'TrafficDemand';source:string;target:string;amountGbit:number;direction:'source-to-target'}[];
 evidence:'Educational Assumption'};
export function chapterGraph(c:C2Config,m:C2Id):C2Graph {const g:C2Graph={modelVersion:C2_GRAPH_MODEL,mission:m,groups:[{id:'group-a',type:'NetworkGroup'},{id:'group-b',type:'NetworkGroup'}],nodes:[],ports:[],links:[],modules:[],demands:[],evidence:'Educational Assumption'};
 const node=(id:string,type:'ComputeRack'|'Switch',groupId:string,fabricGb_s:number|null,powerW=0,costCredits=0)=>g.nodes.push({id,type,groupId,fabricGb_s,computeWU_s:type==='ComputeRack'?40:0,powerW,costCredits});
 const port=(nodeId:string,i:number,supportedRates:number[])=>{const id=nodeId+':p'+i;g.ports.push({id,type:'SwitchPort',nodeId,supportedRates,interface:'educational-electrical-v1',moduleId:null,direction:'bidirectional'});return id;};
 const link=(id:string,a:string,b:string,rateGb_s:number,type:'Copper'|'FiberConnection'='Copper',costCredits=0)=>g.links.push({id,type,a,b,rateGb_s,payloadEfficiency:m==='06'?.8:1,direction:'bidirectional',costCredits});
 const rackPort=(i:number)=>{const id='rack-00'+i;node(id,'ComputeRack',i<=2?'group-a':'group-b',null);return port(id,1,m==='04'?[32]:[800]);};
 if(m==='04'){node('c2-switch','Switch','group-a',c.highDensity?96:64,c.highDensity?64:44,c.highDensity?150:0);const count=c.highDensity?4:2;for(let i=1;i<=count;i++)port('c2-switch',i,[32]);for(let i=1;i<=4;i++){const p=rackPort(i);if(c.connected.includes('rack-00'+i))link('rack-link-'+i,p,'c2-switch:p'+(c.connected.indexOf('rack-00'+i)+1),32);}g.demands=[{id:'traffic-12',type:'TrafficDemand',source:'rack-001',target:'rack-002',amountGbit:1440,direction:'source-to-target'},{id:'traffic-34',type:'TrafficDemand',source:'rack-003',target:'rack-004',amountGbit:1440,direction:'source-to-target'}];}
 else{for(const end of ['A','B'] as const){node('leaf-'+end,'Switch',end==='A'?'group-a':'group-b',m==='05'?400:800,m==='05'?22.5:14);for(let i=1;i<=2;i++)port('leaf-'+end,i,[800]);port('leaf-'+end,3,m==='05'?[100,200]:[400,800]);}
  for(let i=1;i<=4;i++){const p=rackPort(i),end=i<=2?'A':'B';link('access-'+i,p,'leaf-'+end+':p'+((i-1)%2+1),800);}
  if(m==='05'){if(c.spine){node('spine-001','Switch','group-a',400,41,110);port('spine-001',1,[100,200]);port('spine-001',2,[100,200]);for(const [i,end] of (['A','B'] as const).entries())if(c.uplinks[end])link('uplink-'+end,'leaf-'+end+':p3','spine-001:p'+(i+1),c.uplinks[end],'Copper',c.uplinks[end]/100*20);}}
  else {for(const end of ['A','B'] as const){const rate=c.modules[end];if(rate){const portId='leaf-'+end+':p3',id='module-'+end;g.modules.push({id,type:'PluggableModule',portId,nominalGb_s:rate,interface:'educational-electrical-v1',opticalInterface:'educational-fiber-v1',powerW:rate===800?18:12,costCredits:rate===800?75:45});g.ports.find(p=>p.id===portId)!.moduleId=id;}}if(c.fiber)link('fiber-AB','leaf-A:p3','leaf-B:p3',c.modules.A||400,'FiberConnection');}
  g.demands=[{id:'traffic-A-B',type:'TrafficDemand',source:'rack-001',target:'rack-003',amountGbit:m==='05'?8000:22000,direction:'source-to-target'}];}
 return g;
}
export function validateChapterGraph(g:C2Graph){if(g.modelVersion!==C2_GRAPH_MODEL||g.evidence!=='Educational Assumption')throw Error('Chapter 2 Graph Model 오류');const ids=new Set<string>();for(const e of [...g.groups,...g.nodes,...g.ports,...g.links,...g.modules,...g.demands]){if(ids.has(e.id))throw Error('Chapter 2 Graph Stable ID 중복');ids.add(e.id);}const occupied=new Set<string>();for(const l of g.links){const a=g.ports.find(p=>p.id===l.a),b=g.ports.find(p=>p.id===l.b);if(!a||!b||a.nodeId===b.nodeId||![a,b].every(p=>p.supportedRates.includes(l.rateGb_s)))throw Error('Chapter 2 Port / Rate 호환 오류');for(const id of [l.a,l.b]){if(occupied.has(id))throw Error('Chapter 2 Port 중복 연결');occupied.add(id);}}
 for(const mod of g.modules){const p=g.ports.find(p=>p.id===mod.portId);if(!p||p.moduleId!==mod.id||p.interface!==mod.interface||!p.supportedRates.includes(mod.nominalGb_s))throw Error('Chapter 2 Unsupported Module');}
}
export function simulateChapterGraph(g:C2Graph){validateChapterGraph(g);const inactive:{id:string;reason:string}[]=[],active=[] as C2Graph['links'];for(const l of g.links){if(l.type==='FiberConnection'){const a=g.modules.find(m=>m.portId===l.a),b=g.modules.find(m=>m.portId===l.b);if(!a||!b||a.nominalGb_s!==l.rateGb_s||b.nominalGb_s!==l.rateGb_s||a.opticalInterface!==b.opticalInterface){inactive.push({id:l.id,reason:'양쪽 Module Rate / Optical Interface가 호환되지 않아 Fiber가 비활성입니다.'});continue;}}active.push(l);}
 const allocated=allocateTraffic(g.nodes.map(n=>({id:n.id,type:n.type,fabricGb_s:n.fabricGb_s===null?null:n.fabricGb_s*(g.mission==='06'?.8:1)})),active.map(l=>({id:l.id,a:g.ports.find(p=>p.id===l.a)!.nodeId,b:g.ports.find(p=>p.id===l.b)!.nodeId,capacityGb_s:l.rateGb_s*l.payloadEfficiency})),g.demands);
 const connected=g.nodes.filter(n=>n.type==='ComputeRack'&&active.some(l=>g.ports.find(p=>p.id===l.a)!.nodeId===n.id||g.ports.find(p=>p.id===l.b)!.nodeId===n.id)).map(n=>n.id);
 const powerW=g.nodes.reduce((s,n)=>s+n.powerW,0)+g.modules.reduce((s,m)=>s+m.powerW,0),costCredits=g.nodes.reduce((s,n)=>s+n.costCredits,0)+g.links.reduce((s,l)=>s+l.costCredits,0)+g.modules.reduce((s,m)=>s+m.costCredits,0);
 return {...allocated,connected,activeLinks:active.map(l=>l.id),inactive,powerW,costCredits};
}
