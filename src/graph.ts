import {specs} from './legacy-core';
import type {Binding,Node,Graph,Edge,Flow,Port,Design,Diagnostic,Path,Loss,CompileResult} from './schema';
import {sha256} from './hash';
export const COMPILER='graph-compiler-1.0.0';export const GRAPH_MODEL='graph-compact-1.0.0';
type ParamSpec={label:string;unit:string;min:number;max:number;step:number;value:number|null;ref?:string};
type Definition={label:string;category:'Optical'|'Electrical'|'Mechanical';flows:Flow[];params:Record<string,ParamSpec>;dims:[number,number,number];color:string;note:string};
const par=(label:string,unit:string,value:number|null,min=0,max=30,step=.1,ref?:string):ParamSpec=>({label,unit,value,min,max,step,ref});
const loss=(ref?:string)=>par('Insertion Loss','dB',0,0,30,.1,ref);
export const registry:Record<string,Definition>={
 ELS:{label:'ELS / Laser',category:'Optical',flows:['Tx'],params:{launch:par('Launch / λ','dBm',3,-30,25,.1,'launch'),wpe:par('Wall-plug Efficiency','fraction',.2,.01,1,.01,'wall')},dims:[8,5,6],color:'#bf8e4e',note:'CW Source · ELS output reference plane. Physical laser response는 P3.'},
 Splitter:{label:'Optical Splitter',category:'Optical',flows:['Tx'],params:{fanout:par('Explicit Output Count','branches',1,1,8,1),excess:loss('splitExcess')},dims:[5,2,4],color:'#548f87',note:'각 Output은 1/N × excess attenuation. 연결되지 않은 Branch Power는 버려집니다.'},
 MZM:{label:'MZM',category:'Optical',flows:['Tx'],params:{loss:loss('modLoss')},dims:[10,2,3],color:'#619f9b',note:'지정 IL compact model. Vπ / ER / EO / BER은 P3.'},
 EAM:{label:'EAM',category:'Optical',flows:['Tx'],params:{loss:loss('modLoss')},dims:[5,2,3],color:'#6f9c9c',note:'지정 IL compact model. Device response는 P3.'},
 Waveguide:{label:'Waveguide',category:'Optical',flows:['Tx','Rx'],params:{alpha:par('Propagation Loss','dB/cm',.1,0,10,.01,'alpha'),length:par('Manual Optical Length','cm',2,0,100,.1,'length')},dims:[12,1,2],color:'#57ae96',note:'Cosmetic: manual cm. Physical Routing: mm polyline length / 10.'},
 Bend:{label:'Bend',category:'Optical',flows:['Tx','Rx'],params:{count:par('Bend Count','count',0,0,100,1,'bendCount'),loss:par('Loss / Bend','dB',.02,0,10,.01,'bendLoss')},dims:[4,1,4],color:'#548e81',note:'지정 개수 × 지정 Loss. Bend radius 물리는 P3 이후.'},
 Crossing:{label:'Crossing',category:'Optical',flows:['Tx','Rx'],params:{count:par('Crossing Count','count',0,0,100,1,'crossingCount'),loss:par('Loss / Crossing','dB',.05,0,10,.01,'crossingLoss')},dims:[4,1,4],color:'#588c86',note:'신호를 합치거나 나누지 않는 Compact Loss block.'},
 MUX:{label:'Optical MUX',category:'Optical',flows:['Tx'],params:{loss:loss('mux')},dims:[5,2,5],color:'#657fbb',note:'WDM bundle loss. Spectral transfer / wavelength selectivity는 P3.'},
 DEMUX:{label:'Optical DEMUX',category:'Optical',flows:['Tx','Rx'],params:{loss:loss()},dims:[5,2,5],color:'#657fbb',note:'WDM bundle의 지정 IL. 서로 다른 coherent input 합산은 미지원.'},
 EdgeCoupler:{label:'Edge Coupler',category:'Optical',flows:['Tx','Rx'],params:{loss:loss('coupling')},dims:[4,2,3],color:'#b19562',note:'지정 IL. Cosmetic gap은 Loss에 영향이 없습니다.'},
 EvanescentCoupler:{label:'Evanescent Coupler',category:'Optical',flows:['Tx','Rx'],params:{loss:loss('coupling')},dims:[6,2,4],color:'#b19562',note:'P2 지정 IL만. Coupled-mode / gap / alignment physics는 P4.'},
 GratingCoupler:{label:'Grating Coupler',category:'Optical',flows:['Tx','Rx'],params:{loss:loss('coupling')},dims:[4,2,4],color:'#b19562',note:'P2 지정 IL만. Angular / spectral response 미구현.'},
 FAU:{label:'FAU',category:'Optical',flows:['Tx','Rx'],params:{loss:loss(),fibers:par('Bundle Fiber Count','fiber',16,1,64,1,'tx'),wavelengths:par('Wavelengths / Fiber','λ',2,1,8,1,'wavelengths'),lane:par('Lane Rate','Gb/s',100,1,400,1,'lane'),first:par('First Fiber ID','index',1,1,512,1),stride:par('Fiber ID Stride','count',1,1,8,1)},dims:[13,6,12],color:'#719cbb',note:'논리 Fiber / WDM bundle boundary. Physical FAU size는 Geometry metadata.'},
 FiberLink:{label:'Fiber / Connector',category:'Optical',flows:['Tx'],params:{loss:loss('fiber')},dims:[6,2,3],color:'#747ea6',note:'OE 외부 Link loss, ELS→remote Detector budget의 한 번만 합산.'},
 ReceiverBoundary:{label:'Remote Receiver',category:'Optical',flows:['Tx'],params:{sensitivity:par('Receiver Sensitivity','dBm',-10,-40,10,.1,'sensitivity')},dims:[8,3,6],color:'#9a83b6',note:'원격 Detector 기준 Average Power threshold. OE 전력에 포함하지 않습니다.'},
 RxSource:{label:'Rx Optical Boundary',category:'Optical',flows:['Rx'],params:{launch:par('Incoming Power / λ','dBm',null,-30,25,.1)},dims:[8,3,6],color:'#818fb5',note:'독립 Rx 입력 기준면. 기본 Incoming Power는 Unknown.'},
 Photodetector:{label:'Photodetector',category:'Optical',flows:['Rx'],params:{sensitivity:par('Sensitivity','dBm',-10,-40,10,.1,'sensitivity')},dims:[5,2,4],color:'#a080ad',note:'Threshold compact model, analog output → TIA. Response / noise는 P3.'},
 Driver:{label:'Driver',category:'Electrical',flows:['Tx'],params:{power:par('Power / Lane','W',.3,0,10,.01,'driver')},dims:[8,3,5],color:'#728bbd',note:'연결된 Modulator Lane 개수 × 지정 W/Lane.'},
 TIA:{label:'TIA',category:'Electrical',flows:['Rx'],params:{power:par('Power / Lane','W',.2,0,10,.01,'tia')},dims:[8,3,5],color:'#728bbd',note:'연결된 PD Lane 개수 × 지정 W/Lane.'},
 ElectricalLane:{label:'Electrical Lane',category:'Electrical',flows:['Tx','Rx'],params:{},dims:[6,1,2],color:'#7790b2',note:'Typed connectivity. SI / impedance / SerDes physics 미구현.'},
 ElectricalConnector:{label:'Package Electrical Interface',category:'Electrical',flows:['Tx','Rx'],params:{},dims:[8,3,4],color:'#7d8b9a',note:'외부 ASIC interface. ASIC 내부 회로는 미설계.'},
 PIC:{label:'PIC',category:'Mechanical',flows:['Mechanical'],params:{},dims:[38,1.2,28],color:'#32655f',note:'Placement envelope. Device area / Yield 계산은 미구현.'},
 EIC:{label:'EIC',category:'Mechanical',flows:['Mechanical'],params:{},dims:[18,2,15],color:'#436289',note:'Placement envelope, Electrical net와 구분.'},
 Package:{label:'OE Package',category:'Mechanical',flows:['Mechanical'],params:{},dims:[90,2,64],color:'#34485b',note:'Package envelope in mm. P2 physical geometry only.'},
 PhotonicSubstrate:{label:'Photonic Substrate',category:'Mechanical',flows:['Mechanical'],params:{},dims:[78,1,54],color:'#425f65',note:'Substrate geometry. Warpage / coupling / reliability는 후속 Phase.'},
 ThermalInterface:{label:'Thermal Interface',category:'Mechanical',flows:['Mechanical'],params:{},dims:[18,.6,15],color:'#778280',note:'Placement만 지원. Thermal Rth solver는 P3.'},
};
function portsFor(type:string,flow:Flow,fanout=1):Omit<Port,'plane'>[]{
 const p=(id:string,kind:Port['kind'],direction:Port['direction'],signal:Port['signal'],required=true)=>({id,kind,direction,signal,required});
 if(registry[type].category==='Mechanical')return [];
 if(type==='ELS')return [p('out','optical','out','CW')];
 if(type==='RxSource')return [p('out','optical','out','modulated')];
 if(type==='ReceiverBoundary')return [p('in','optical','in','modulated')];
 if(type==='MZM'||type==='EAM')return [p('in','optical','in','CW'),p('out','optical','out','modulated'),p('drive','electrical','in','drive')];
 if(type==='Splitter')return [p('in','optical','in','CW'),...Array.from({length:fanout},(_,i)=>p('out'+i,'optical','out','CW',false))];
 if(type==='Photodetector')return [p('in','optical','in','modulated'),p('out','electrical','out','analog')];
 if(type==='Driver')return [p('in','electrical','in','data'),p('out','electrical','out','drive')];
 if(type==='TIA')return [p('in','electrical','in','analog'),p('out','electrical','out','data')];
 if(type==='ElectricalConnector')return [p(flow==='Tx'?'out':'in','electrical',flow==='Tx'?'out':'in','data')];
 if(type==='ElectricalLane')return [p('in','electrical','in','data'),p('out','electrical','out','data')];
 return [p('in','optical','in','modulated'),p('out','optical','out','modulated')];
}
export function refreshPorts(node:Node,d?:Design){node.ports=portsFor(node.type,node.flow,d?(value(d,node,'fanout')??1):(node.parameters.fanout?.value??1)).map(p=>({...p,plane:node.id+'.'+p.id}));}
export function createNode(type:string,id:string,flow:Flow='Tx',x=80,y=100):Node {
 const def=registry[type];if(!def||!def.flows.includes(flow))throw Error('Component / Flow 호환 오류');
 const params=Object.fromEntries(Object.entries(def.params).map(([k,p])=>[k,{value:p.value,unit:p.unit,evidence:'Assumption' as const,source:'v0.2 uncalibrated compact fixture',...(p.ref?{ref:k==='fibers'&&flow==='Rx'?'rx':p.ref}:{})}]));
 const n:Node={id,type,label:def.label,flow,modelId:def.category==='Mechanical'?'placement-1.0.0':GRAPH_MODEL,parameters:params,ports:[],schematic:{x,y},geometry:{x:(x%700)/12-25,y:4,z:(y%400)/14-12,rotation:0,unit:'mm'},dimensions:{x:def.dims[0],y:def.dims[1],z:def.dims[2],unit:'mm'},route:{enabled:type==='Waveguide',start:null,end:null,waypoints:[],unit:'mm'}};refreshPorts(n);return n;
}
export function value(d:Design,n:Node,key:string):number|null {const p=n.parameters[key];return p?.ref?d.parameters[p.ref].value:p?.value??null;}
export function edge(from:string,to:string,fromPort='out',toPort='in'):Edge{return {id:`${from}.${fromPort}>${to}.${toPort}`,from:{component:from,port:fromPort},to:{component:to,port:toPort}};}
export function connectionError(graph:Graph,e:Omit<Edge,'id'>):string|null {
 const a=graph.components.find(n=>n.id===e.from.component),b=graph.components.find(n=>n.id===e.to.component);const p=a?.ports.find(p=>p.id===e.from.port),q=b?.ports.find(p=>p.id===e.to.port);
 if(!p||!q)return '연결 Port가 없습니다.';
 if(a!.id===b!.id)return 'Self Connection은 허용되지 않습니다.';
 if(a!.flow!==b!.flow)return 'Tx / Rx Net를 직접 연결할 수 없습니다.';
 if(p.direction!=='out'||q.direction!=='in'||p.kind!==q.kind||p.signal!==q.signal)return `${a!.id}.${p.id} (${p.kind}/${p.signal}/out) → ${b!.id}.${q.id} (${q.kind}/${q.signal}/in): Type 또는 Direction 불일치`;
 if(graph.connections.some(x=>x.to.component===b!.id&&x.to.port===q.id))return b!.id+'.'+q.id+' 입력이 이미 연결되어 있습니다.';
 if(graph.connections.some(x=>x.from.component===a!.id&&x.from.port===p.id))return a!.id+'.'+p.id+' Output fanout은 Splitter의 독립 Port를 사용하세요.';
 const seen=new Set<string>();const visit=(id:string):boolean=>{if(id===a!.id)return true;if(seen.has(id))return false;seen.add(id);return graph.connections.filter(c=>c.from.component===id).some(c=>visit(c.to.component));};return visit(b!.id)?'Cycle이 발생하므로 연결을 거부합니다.':null;
}
export function presetGraph(parameters:Design['parameters']):Graph {
 const g:Graph={components:[],connections:[]};const add=(type:string,id:string,flow:Flow,x:number,y:number)=>{const n=createNode(type,id,flow,x,y);g.components.push(n);return n;};
 add('ElectricalConnector','host-tx','Tx',75,20);add('Driver','driver','Tx',420,20);
 const fanout=parameters.split.value??1;const supported=Math.min(8,fanout);if(fanout>8)g.compileGuard='Legacy Fanout > 8은 Graph preset 변환 범위를 초과합니다. Legacy Solver를 유지하거나 Fanout을 1–8로 조정한 뒤 Template을 적용하세요.';
 add('ELS','els','Tx',75,160);const spl=add('Splitter','splitter','Tx',255,160);spl.parameters.fanout.value=supported;if(parameters.split.value===null)spl.parameters.fanout.ref='split';refreshPorts(spl);g.connections.push(edge('els','splitter'),edge('host-tx','driver'));
 // Explicit splitter outputs each carry a separate, interleaved fiber bundle.
 for(let branch=0;branch<Math.min(supported,parameters.tx.value??supported);branch++){
  const suf=branch===0?'':'-'+branch;const row=160+branch*460;
  const defs:[string,string,number,number][]=[['MZM','mod',435,row],['MUX','mux',615,row],['Waveguide','wg',795,row],['Bend','bend',795,row+145],['Crossing','crossing',615,row+145],['EdgeCoupler','coupler',435,row+145],['FAU','fau',255,row+145],['FiberLink','fiber',75,row+145],['DEMUX','remote-interface',75,row+290],['ReceiverBoundary','remote-rx',255,row+290]];
  const nodes=defs.map(([type,id,x,y])=>add(type,id+suf,'Tx',x,y));const fau=nodes.find(n=>n.type==='FAU')!;
  if(supported>1){const total=parameters.tx.value??16;fau.parameters.fibers={...fau.parameters.fibers,ref:undefined,value:parameters.tx.value===null?null:Math.floor((total-1-branch)/supported)+1};fau.parameters.first.value=branch+1;fau.parameters.stride.value=supported;}
  nodes.find(n=>n.type==='DEMUX')!.parameters.loss.ref='receiver';nodes.find(n=>n.type==='Waveguide')!.route={enabled:true,start:'mod'+suf,end:'coupler'+suf,waypoints:[],unit:'mm'};
  g.connections.push(edge('splitter','mod'+suf,'out'+branch));for(let i=0;i<nodes.length-1;i++)g.connections.push(edge(nodes[i].id,nodes[i+1].id));
  if(branch===0)g.connections.push(edge('driver','mod','out','drive'));else {add('ElectricalConnector','host-tx'+suf,'Tx',435,row-90);add('Driver','driver'+suf,'Tx',615,row-90);g.connections.push(edge('host-tx'+suf,'driver'+suf),edge('driver'+suf,'mod'+suf,'out','drive'));}
 }
 const ry=160+supported*460;const rdefs:[string,string][]=[['RxSource','rx-source'],['FAU','fau-rx'],['DEMUX','demux-rx'],['Photodetector','pd'],['TIA','tia'],['ElectricalConnector','host-rx']];
 const rn=rdefs.map(([t,id],i)=>add(t,id,'Rx',75+i%5*180,ry+Math.floor(i/5)*145));rn.forEach(n=>{if(n.type==='FAU')n.parameters.fibers.ref='rx';});for(let i=0;i<rn.length-1;i++)g.connections.push(edge(rn[i].id,rn[i+1].id));
 const positions:Record<string,[number,number,number]>={Package:[0,-3,0],PhotonicSubstrate:[0,-1,0],PIC:[-5,1,0],EIC:[20,3,12],ThermalInterface:[20,1.5,12]};Object.entries(positions).forEach(([type,pos],i)=>{const n=add(type,type.toLowerCase(),'Mechanical',75+i*180,ry+290);n.geometry.x=pos[0];n.geometry.y=pos[1];n.geometry.z=pos[2];});
 return g;
}
export function routeLength(d:Design,n:Node):number|null {
 if(d.geometryMode!=='physical-routing'||!n.route.enabled)return value(d,n,'length');
 const a=d.graph.components.find(x=>x.id===n.route.start),b=d.graph.components.find(x=>x.id===n.route.end);if(!a||!b)return null;
 const points=[a.geometry,...n.route.waypoints,b.geometry];let mm=0;for(let i=1;i<points.length;i++)mm+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y,points[i].z-points[i-1].z);return mm/10;
}
const sum=(a:(number|null)[])=>a.includes(null)?null:(a as number[]).reduce((s,n)=>s+n,0);
const product=(a:number|null,b:number|null)=>a===null||b===null?null:a*b;
export function compileGraph(d:Design):CompileResult {
 const g=d.graph,errors:Diagnostic[]=[],warnings:string[]=[],unknownFlows:('Tx'|'Rx')[]=[],paths:Path[]=[],deps:Record<string,Set<string>>={};const nodes=new Map(g.components.map(n=>[n.id,n]));
 const err=(code:string,message:string,node?:string,port?:string)=>errors.push({code,message,node,port});
 if(g.compileGuard)err('TEMPLATE_SCOPE',g.compileGuard);
 const partial:Graph={components:g.components,connections:[]};for(const e of g.connections){const error=connectionError(partial,e);if(error)err('CONNECTION',error,e.to.component,e.to.port);else partial.connections.push(e);}
 for(const n of g.components){for(const p of n.ports){const connected=g.connections.some(e=>p.direction==='in'?e.to.component===n.id&&e.to.port===p.id:e.from.component===n.id&&e.from.port===p.id);if(p.required&&!connected)err('MISSING_PORT',`${n.label} · ${n.id}.${p.id} 필수 ${p.direction} Port가 미연결입니다.`,n.id,p.id);}if(n.type==='Splitter'&&!g.connections.some(e=>e.from.component===n.id))err('NO_BRANCH','Splitter의 Output을 최소 하나 연결하세요.',n.id);}
 const sources=g.components.filter(n=>n.type==='ELS'),txSinks=g.components.filter(n=>n.type==='ReceiverBoundary'),rxSinks=g.components.filter(n=>n.type==='Photodetector');
 if(!sources.length)err('NO_ELS','Tx ELS / Laser Source가 필요합니다.');if(!txSinks.length)err('NO_TX_SINK','Tx Path의 Remote Receiver Boundary가 필요합니다.');if(!rxSinks.length)err('NO_RX_SINK','Rx Photodetector와 TIA Path가 필요합니다.');
 const incoming=(n:Node,kind:Port['kind'])=>g.connections.filter(e=>e.to.component===n.id&&n.ports.find(p=>p.id===e.to.port)?.kind===kind);
 const backwards=(sink:Node,kind:Port['kind']):{nodes:Node[];edges:Edge[]}|null=>{const chain:Node[]=[sink],edges:Edge[]=[],seen=new Set([sink.id]);let n=sink;for(let guard=0;guard<1000;guard++){const inc=incoming(n,kind);if(!inc.length)return {nodes:chain.reverse(),edges:edges.reverse()};if(inc.length!==1){err('AMBIGUOUS_PATH','한 Port Bundle에 여러 Source가 존재합니다.',n.id);return null;}const e=inc[0],a=nodes.get(e.from.component);if(!a||seen.has(a.id)){err('CYCLE','경로 추출 중 Cycle 또는 Missing Node를 발견했습니다.',n.id);return null;}seen.add(a.id);edges.push(e);chain.push(a);n=a;}return null;};
 const used=new Set<string>();const driverChannels=new Map<string,Set<string>>(),tiaChannels=new Map<string,Set<string>>(),laserGroups=new Map<string,Set<string>>();
 for(const sink of [...txSinks,...rxSinks]){
  const chain=backwards(sink,'optical');if(!chain)continue;const ns=chain.nodes,source=ns[0],flow=sink.flow as 'Tx'|'Rx';if(source.type!==(flow==='Tx'?'ELS':'RxSource')){err('SOURCE_ROLE',`${flow} Path에 적합한 Optical Source가 없습니다.`,sink.id);continue;}
  const fs=ns.filter(n=>n.type==='FAU');if(fs.length!==1){err('FAU_SCOPE','각 Path는 정확히 하나의 Fiber allocation FAU를 사용해야 합니다.',sink.id);continue;}const fau=fs[0];
  const fibers=value(d,fau,'fibers'),lambda=value(d,fau,'wavelengths'),lane=value(d,fau,'lane'),first=value(d,fau,'first'),stride=value(d,fau,'stride');
  const mods=ns.filter(n=>n.type==='MZM'||n.type==='EAM');if(flow==='Tx'&&mods.length!==1){err('MODULATOR','Tx Path에는 정확히 하나의 MZM 또는 EAM이 필요합니다.',sink.id);continue;}
  let driver:Node|undefined,tia:Node|undefined;
  if(flow==='Tx'){const el=backwards(mods[0],'electrical');driver=el?.nodes.find(n=>n.type==='Driver');if(!driver||el?.nodes[0].type!=='ElectricalConnector')err('DRIVER_PATH','MZM / EAM drive는 외부 Electrical Interface → Driver로 연결하세요.',mods[0].id);el?.nodes.forEach(n=>used.add(n.id));}
  else{const e=g.connections.find(e=>e.from.component===sink.id&&e.from.port==='out');tia=e?nodes.get(e.to.component):undefined;if(tia?.type!=='TIA')err('TIA_PATH','Photodetector analog Output은 TIA로 연결하세요.',sink.id);if(tia){used.add(tia.id);let n=tia;let reached=false;const visited=new Set<string>();for(let i=0;i<100;i++){if(visited.has(n.id))break;visited.add(n.id);used.add(n.id);if(n.type==='ElectricalConnector'){reached=true;break;}const next=g.connections.find(e=>e.from.component===n.id);const nn=next?nodes.get(next.to.component):undefined;if(!nn)break;n=nn;}if(!reached)err('RX_INTERFACE','TIA Output이 Rx Electrical Interface에 도달하지 않습니다.',tia.id);}}
  ns.forEach(n=>used.add(n.id));const launch=value(d,source,'launch');
  const splits=ns.filter(n=>n.type==='Splitter');if(splits.length>1)err('CASCADED_SPLITTER','P2는 Path당 단일 Splitter Stage를 지원합니다. Cascade source allocation은 미지원입니다.',sink.id);
  if(fibers===null||lambda===null||first===null||stride===null){warnings.push(fau.id+': Channel allocation이 Unknown입니다.');if(!unknownFlows.includes(flow))unknownFlows.push(flow);continue;}
  for(let fi=0;fi<fibers;fi++)for(let wi=1;wi<=lambda;wi++){
   const fiber:number=first+fi*stride,id=`${flow==='Tx'?'F':'R'}${fiber}-L${wi}`;
   if(paths.some(p=>p.id===id)){err('DUPLICATE_CHANNEL',id+'가 여러 경로에 할당되어 있습니다. FAU first/stride를 확인하세요.',fau.id);continue;}
   const losses:Loss[]=[];const ledger=new Set<string>();
   for(const n of ns){let l:number|null=0;let contributes=true;
    if(n.type==='Splitter'){const N=value(d,n,'fanout');l=N===null?null:product(1,10*Math.log10(N));l=l===null||value(d,n,'excess')===null?null:l+value(d,n,'excess')!;}
    else if(n.type==='Waveguide'){const length=routeLength(d,n);l=product(value(d,n,'alpha'),length);if(d.geometryMode==='physical-routing'&&n.route.enabled&&length===null)err('ROUTE_BINDING','Physical Routing의 start/end Node가 존재해야 합니다.',n.id);}
    else if(n.type==='Bend'||n.type==='Crossing')l=product(value(d,n,'count'),value(d,n,'loss'));
    else if(n.parameters.loss){l=value(d,n,'loss');if(n.id===ns.find(n=>n.type.includes('Coupler'))?.id&&flow==='Tx'&&d.channelOverrides[id]?.coupling!==undefined)l=d.channelOverrides[id].coupling!;}
    else contributes=false;
    if(contributes){const key=n.id+':loss';if(ledger.has(key))err('DUPLICATE_LOSS','같은 Model Stage의 Loss가 중복 반영됩니다.',n.id);ledger.add(key);if(l!==null&&l<0)err('PASSIVE_GAIN','Passive Component Gain은 허용되지 않습니다.',n.id);losses.push({node:n.id,name:n.label,value:l,fromPlane:n.id+'.'+(chain.edges.find(e=>e.to.component===n.id)?.to.port??'in'),toPlane:n.id+'.'+(chain.edges.find(e=>e.from.component===n.id)?.from.port??'out'),modelId:n.modelId});}
   }
   const total=sum(losses.map(l=>l.value));const received=launch===null||total===null?null:launch-total;const sens=flow==='Tx'?(d.channelOverrides[id]?.sensitivity??value(d,sink,'sensitivity')):value(d,sink,'sensitivity');
   const group=source.id+':G'+fi+':L'+wi;const path:Path={id,flow,source:source.id,sink:sink.id,nodes:ns.map(n=>n.id),edges:chain.edges.map(e=>e.id),fiber,wavelength:wi,laneRate:lane,launch,received,margin:received===null||sens===null?null:received-sens,losses,driver:driver?.id??null,tia:tia?.id??null,sourceGroup:group};paths.push(path);
   for(const n of ns){for(const [k,p] of Object.entries(n.parameters)){const key=p.ref?'global.'+p.ref:n.id+'.'+k;(deps[key]??=new Set()).add(id);}if(n.type==='Waveguide'&&d.geometryMode==='physical-routing'&&n.route.enabled)for(const ref of [n.route.start,n.route.end])if(ref)(deps[ref+'.geometry']??=new Set()).add(id);}
   if(driver){const ids=driverChannels.get(driver.id)??new Set<string>();ids.add(id);driverChannels.set(driver.id,ids);(deps[driver.parameters.power.ref?'global.'+driver.parameters.power.ref:driver.id+'.power']??=new Set()).add(id);}
   if(tia){const ids=tiaChannels.get(tia.id)??new Set<string>();ids.add(id);tiaChannels.set(tia.id,ids);(deps[tia.parameters.power.ref?'global.'+tia.parameters.power.ref:tia.id+'.power']??=new Set()).add(id);}
   if(flow==='Tx'){const groups=laserGroups.get(source.id)??new Set<string>();groups.add(group);laserGroups.set(source.id,groups);}
  }
 }
 for(const n of g.components)if(registry[n.type].category!=='Mechanical'&&!used.has(n.id))err('UNREACHABLE','Component가 유효한 Tx/Rx Signal Chain에 속하지 않습니다.',n.id);
 const passive=g.components.filter(n=>n.type==='Splitter').map(n=>{const N=value(d,n,'fanout'),ex=value(d,n,'excess');const transmissionSum=N===null||ex===null?null:Math.pow(10,-ex/10);if(transmissionSum!==null&&transmissionSum>1+1e-12)err('PASSIVE_CONSERVATION','Splitter 출력 Power 합이 Input Power를 초과합니다.',n.id);return {node:n.id,fanout:N,transmissionSum,usedOutputs:g.connections.filter(e=>e.from.component===n.id).length};});
 const tx=paths.filter(p=>p.flow==='Tx'),rx=paths.filter(p=>p.flow==='Rx');const gross=!unknownFlows.includes('Tx')&&tx.length?sum(tx.map(p=>p.laneRate)):null,rxGross=!unknownFlows.includes('Rx')&&rx.length?sum(rx.map(p=>p.laneRate)):null;
 const laser=unknownFlows.includes('Tx')||g.components.some(n=>n.type==='Splitter'&&value(d,n,'fanout')===null)?null:sum([...laserGroups].map(([id,groups])=>{const n=nodes.get(id)!,launch=value(d,n,'launch'),wpe=value(d,n,'wpe');return launch===null||wpe===null?null:groups.size*Math.pow(10,launch/10)/1000/wpe;}));
 const driverPower=unknownFlows.includes('Tx')?null:sum([...driverChannels].map(([id,channels])=>product(value(d,nodes.get(id)!,'power'),channels.size)));const tiaPower=unknownFlows.includes('Rx')?null:sum([...tiaChannels].map(([id,channels])=>product(value(d,nodes.get(id)!,'power'),channels.size)));
 const powerBreakdown=[{name:'Laser electrical',value:laser},{name:'Driver × Tx lanes',value:driverPower},{name:'TIA × Rx lanes',value:tiaPower},{name:'Control',value:d.parameters.control.value},{name:'Thermal control',value:d.parameters.thermal.value}];const power=sum(powerBreakdown.map(p=>p.value));
 const hash=sha256(JSON.stringify({graph:g,parameters:d.parameters,geometryMode:d.geometryMode,channelOverrides:d.channelOverrides}));
 return {valid:errors.length===0,errors:[...new Map(errors.map(e=>[e.code+e.node+e.message,e])).values()],warnings,unknownFlows,hash,version:COMPILER,paths,dependencies:Object.fromEntries(Object.entries(deps).map(([k,v])=>[k,[...v]])),passive,gross:errors.length?null:gross,rxGross:errors.length?null:rxGross,powerBreakdown,power:errors.length?null:power};
}
