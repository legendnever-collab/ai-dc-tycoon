export const VERSION = '0.1.0';
export const SCHEMA = 1;
export const MODEL = 'analytical-link-1.0.0';
export type Fidelity = 'Ideal'|'Analytical / Simplified'|'Calibrated Compact Model'|'Measurement-Based'|'External Solver Result';
export type Evidence = 'Assumption'|'Candidate'|'Reviewed'|'Accepted';
export type Parameter = {value:number|null; unit:string; evidence:Evidence; source:string};
export const specs:Record<string,{label:string;unit:string;min:number;max:number;step:number;group:string}> = {
 tx:{label:'Tx Fiber Count',unit:'fiber',min:1,max:64,step:1,group:'architecture'},
 rx:{label:'Rx Fiber Count',unit:'fiber',min:1,max:64,step:1,group:'architecture'},
 wavelengths:{label:'Wavelengths / Fiber',unit:'λ',min:1,max:8,step:1,group:'architecture'},
 lane:{label:'Optical Lane Rate',unit:'Gb/s',min:1,max:400,step:1,group:'architecture'},
 efficiency:{label:'Coding / Protocol Efficiency',unit:'fraction',min:0.01,max:1,step:0.001,group:'architecture'},
 launch:{label:'Launch Power / Channel',unit:'dBm',min:-30,max:25,step:0.1,group:'link'},
 modLoss:{label:'Modulator Insertion Loss',unit:'dB',min:0,max:30,step:0.1,group:'link'},
 split:{label:'Splitter Fanout / λ',unit:'branches',min:1,max:64,step:1,group:'link'},
 splitExcess:{label:'Splitter Excess Loss',unit:'dB',min:0,max:20,step:0.1,group:'link'},
 mux:{label:'MUX Loss',unit:'dB',min:0,max:20,step:0.1,group:'link'},
 alpha:{label:'Waveguide Propagation Loss',unit:'dB/cm',min:0,max:10,step:0.01,group:'link'},
 length:{label:'Waveguide Optical Length',unit:'cm',min:0,max:100,step:0.1,group:'link'},
 bendCount:{label:'Bend Count',unit:'count',min:0,max:100,step:1,group:'link'},
 bendLoss:{label:'Loss / Bend',unit:'dB',min:0,max:10,step:0.01,group:'link'},
 crossingCount:{label:'Crossing Count',unit:'count',min:0,max:100,step:1,group:'link'},
 crossingLoss:{label:'Loss / Crossing',unit:'dB',min:0,max:10,step:0.01,group:'link'},
 coupling:{label:'Tx Coupling Loss',unit:'dB',min:0,max:30,step:0.1,group:'link'},
 fiber:{label:'Fiber / Connector Loss',unit:'dB',min:0,max:30,step:0.1,group:'link'},
 receiver:{label:'Rx DEMUX / Interface Loss',unit:'dB',min:0,max:30,step:0.1,group:'link'},
 sensitivity:{label:'Receiver Sensitivity',unit:'dBm',min:-40,max:10,step:0.1,group:'link'},
 wall:{label:'Laser Wall-plug Efficiency',unit:'fraction',min:0.01,max:1,step:0.01,group:'power'},
 driver:{label:'Driver Power / Tx Lane',unit:'W',min:0,max:10,step:0.01,group:'power'},
 tia:{label:'TIA Power / Rx Lane',unit:'W',min:0,max:10,step:0.01,group:'power'},
 control:{label:'Control Circuit Power',unit:'W',min:0,max:100,step:0.1,group:'power'},
 thermal:{label:'Thermal Control Power',unit:'W',min:0,max:100,step:0.1,group:'power'},
};
export type Port = {id:string;kind:'optical'|'electrical'|'thermal';direction:'in'|'out';signal:'CW'|'modulated'|'data'|'heat'};
export type Component = {id:string;type:string;ports:Port[];geometry:{x:number;y:number;z:number;rotation:number};parameters:Record<string,Parameter>;modelId:string};
export type Connection = {from:{component:string;port:string};to:{component:string;port:string}};
export type Graph = {components:Component[];connections:Connection[]};
export type Design = {schemaVersion:1;version:string;id:string;name:string;revision:number;family:string;mode:'campaign'|'sandbox';mission:string;seed:number;parameters:Record<string,Parameter>;channelOverrides:Record<string,{coupling?:number;sensitivity?:number}>;graph:Graph;evidenceNote:string;history:{revision:number;at:string;inputs:Record<string,Parameter>;modelVersion:string}[]};
export function connectionError(graph:Graph,c:Connection):string|null {
 const source=graph.components.find(n=>n.id===c.from.component)?.ports.find(p=>p.id===c.from.port);
 const target=graph.components.find(n=>n.id===c.to.component)?.ports.find(p=>p.id===c.to.port);
 if(!source||!target)return 'Port가 존재하지 않습니다.';
 if(c.from.component===c.to.component)return 'Self connection은 지원하지 않습니다.';
 if(source.direction!=='out'||target.direction!=='in'||source.kind!==target.kind||source.signal!==target.signal)return 'Port type / direction / signal이 호환되지 않습니다.';
 if(graph.connections.some(e=>e.to.component===c.to.component&&e.to.port===c.to.port))return '입력 Port가 이미 연결되어 있습니다.';
 const seen=new Set<string>();const visit=(id:string):boolean=>{if(id===c.from.component)return true;if(seen.has(id))return false;seen.add(id);return graph.connections.filter(e=>e.from.component===id).some(e=>visit(e.to.component));};
 return visit(c.to.component)?'순환 경로는 허용되지 않습니다.':null;
}
const registryNodes=[['els','ELS','CW','CW'],['mod','MZM','CW','modulated'],['wg','Waveguide','modulated','modulated'],['fau','FAU','modulated','modulated'],['pd','Photodetector','modulated','data']];
export function defaultGraph():Graph {
 const components:Component[]=registryNodes.map((a,i)=>({id:a[0],type:a[1],ports:[{id:'in',kind:'optical',direction:'in',signal:a[2] as Port['signal']},{id:'out',kind:a[1]==='Photodetector'?'electrical':'optical',direction:'out',signal:a[3] as Port['signal']}].filter(p=>i!==0||p.direction==='out') as Port[],geometry:{x:i*20,y:0,z:0,rotation:0},parameters:{},modelId:MODEL}));
 return {components,connections:components.slice(0,-1).map((n,i)=>({from:{component:n.id,port:'out'},to:{component:components[i+1].id,port:'in'}}))};
}
export function newDesign():Design {
 const values:Record<string,number|null>={tx:16,rx:16,wavelengths:2,lane:100,efficiency:null,launch:3,modLoss:3,split:1,splitExcess:0,mux:1,alpha:0.1,length:2,bendCount:0,bendLoss:0.02,crossingCount:0,crossingLoss:0.05,coupling:1.5,fiber:1,receiver:0.5,sensitivity:-10,wall:0.2,driver:0.3,tia:0.2,control:1,thermal:0.5};
 return {schemaVersion:1,version:VERSION,id:'design-'+Date.now(),name:'3.2T · 첫 번째 Optical Engine',revision:0,family:'Slow & Wide with WDM',mode:'campaign',mission:'02',seed:20261009,parameters:Object.fromEntries(Object.entries(values).map(([k,value])=>[k,{value,unit:specs[k].unit,evidence:'Assumption',source:'v0.1 educational fixture; vendor specification 아님'}])),channelOverrides:{},graph:defaultGraph(),evidenceNote:'',history:[]};
}
export function validateDesign(value:unknown):asserts value is Design {
 const d=value as Design;if(!d||d.schemaVersion!==1||d.version!==VERSION||typeof d.name!=='string'||d.name.length>120||typeof d.id!=='string'||!d.id||typeof d.family!=='string'||typeof d.evidenceNote!=='string'||d.evidenceNote.length>20000||!Number.isInteger(d.revision)||d.revision<0||!Number.isInteger(d.seed)||!Array.isArray(d.history)||d.history.length>10000||!['campaign','sandbox'].includes(d.mode)||!['02'].includes(d.mission))throw Error('Design schema가 호환되지 않습니다.');
 for(const [k,s] of Object.entries(specs)){const p=d.parameters?.[k];if(!p||p.unit!==s.unit||!['Assumption','Candidate','Reviewed','Accepted'].includes(p.evidence)||typeof p.source!=='string'||(p.value!==null&&(!Number.isFinite(p.value)||p.value<s.min||p.value>s.max||(s.step===1&&!Number.isInteger(p.value)))))throw Error(k+': unit / range / evidence 오류');}
 if(!d.channelOverrides||typeof d.channelOverrides!=='object')throw Error('Channel override 오류');
 for(const [key,v] of Object.entries(d.channelOverrides)){if(!/^F\d+-L\d+$/.test(key)||!v||typeof v!=='object'||Object.entries(v).some(([k,n])=>!['coupling','sensitivity'].includes(k)||!Number.isFinite(n)||n<(k==='coupling'?0:-40)||n>(k==='coupling'?30:10)))throw Error('Channel override 범위 오류');}
 if(!d.graph||!Array.isArray(d.graph.components)||!Array.isArray(d.graph.connections)||d.graph.components.length>1000)throw Error('Graph 오류');
 const ids=new Set<string>();for(const n of d.graph.components){if(ids.has(n.id)||!n.id||!Array.isArray(n.ports)||!n.geometry||Object.values(n.geometry).some(v=>!Number.isFinite(v)))throw Error('Component 오류');ids.add(n.id);const ps=new Set<string>();for(const p of n.ports){if(ps.has(p.id)||!p.id||!['optical','electrical','thermal'].includes(p.kind)||!['in','out'].includes(p.direction)||!['CW','modulated','data','heat'].includes(p.signal))throw Error('Port 오류');ps.add(p.id);}}
 const partial:Graph={components:d.graph.components,connections:[]};for(const c of d.graph.connections){const err=connectionError(partial,c);if(err)throw Error(err);partial.connections.push(c);}
 for(const h of d.history){if(!Number.isInteger(h.revision)||typeof h.at!=='string'||typeof h.modelVersion!=='string'||!h.inputs)throw Error('History 오류');}
}
export const models=[{id:MODEL,fidelity:'Analytical / Simplified' as Fidelity,version:'1.0.0',status:'Uncalibrated',validity:'Constant dB losses; equal wavelength/channel input. No BER/OMA/TDECQ model. Rate 1–400G is arithmetic scope, not physical feasibility.',assumptions:'Launch is per wavelength per ELS output, before ideal fanout + excess loss. Same-wavelength Tx fibers are grouped by splitter fanout; ELS outputs = ceil(Tx fibers / fanout) × wavelengths. Unused branches in the last group consume optical allocation. Receiver sensitivity is average-power threshold at detector-side reference plane for the selected lane/rate; user must supply a compatible value.'}];
export type Result={version:string;schemaVersion:number;modelVersion:string;input:Design;seed:number;gross:number|null;rxGross:number|null;net:number|null;channels:{id:string;received:number|null;margin:number|null}[];losses:{name:string;value:number|null}[];received:number|null;margin:number|null;power:number|null;powerBreakdown:{name:string;value:number|null}[];epb:number|null;status:'SIMULATED PASS'|'FAIL'|'INCOMPLETE'|'SANDBOX';constraints:{name:string;actual:number|null;required:string;status:'PASS'|'FAIL'|'UNKNOWN'}[];evidenceCoverage:number;score:number;scoreParts:{name:string;points:number;max:number;known:boolean}[];issues:string[]};
export function solve(d:Design):Result {
 validateDesign(d);const p=d.parameters;const v=(k:string)=>p[k].value;
 const mul=(...a:(number|null)[])=>a.includes(null)?null:(a as number[]).reduce((a,b)=>a*b,1);
 const add=(...a:(number|null)[])=>a.includes(null)?null:(a as number[]).reduce((a,b)=>a+b,0);
 const gross=mul(v('tx'),v('wavelengths'),v('lane'));const rxGross=mul(v('rx'),v('wavelengths'),v('lane'));const net=mul(gross,v('efficiency'));
 const splitter=v('split')===null||v('splitExcess')===null?null:10*Math.log10(v('split')!)+v('splitExcess')!;
 const losses=[{name:'Modulator',value:v('modLoss')},{name:'Splitter (ideal + excess)',value:splitter},{name:'MUX',value:v('mux')},{name:'Waveguide',value:mul(v('alpha'),v('length'))},{name:'Bends',value:mul(v('bendCount'),v('bendLoss'))},{name:'Crossings',value:mul(v('crossingCount'),v('crossingLoss'))},{name:'Tx Coupling',value:v('coupling')},{name:'Fiber / Connector',value:v('fiber')},{name:'Rx DEMUX / Interface',value:v('receiver')}];
 const totalLoss=add(...losses.map(l=>l.value));const nominal=v('launch')===null||totalLoss===null?null:v('launch')!-totalLoss;
 const count=mul(v('tx'),v('wavelengths'));const channels:Result['channels']=[];
 if(count!==null)for(let f=1;f<=v('tx')!;f++)for(let l=1;l<=v('wavelengths')!;l++){const id=`F${f}-L${l}`;const over=d.channelOverrides[id];const received=nominal===null?null:nominal+v('coupling')!-(over?.coupling??v('coupling')!);const sensitivity=over?.sensitivity??v('sensitivity');channels.push({id,received,margin:received===null||sensitivity===null?null:received-sensitivity});}
 const received=channels.length&&channels.every(c=>c.received!==null)?Math.min(...channels.map(c=>c.received!)):null;
 const margin=channels.length&&channels.every(c=>c.margin!==null)?Math.min(...channels.map(c=>c.margin!)):null;
 // Shared ELS sources are counted by same-wavelength splitter groups, never by dB loss a second time.
 const sources=v('tx')===null||v('wavelengths')===null||v('split')===null?null:Math.ceil(v('tx')!/v('split')!)*v('wavelengths')!;
 const laser=sources===null||v('launch')===null||v('wall')===null?null:sources*Math.pow(10,v('launch')!/10)/1000/v('wall')!;
 const powerBreakdown=[{name:'Laser electrical',value:laser},{name:'Driver × Tx lanes',value:mul(count,v('driver'))},{name:'TIA × Rx lanes',value:mul(v('rx'),v('wavelengths'),v('tia'))},{name:'Control',value:v('control')},{name:'Thermal control',value:v('thermal')}];const power=add(...powerBreakdown.map(p=>p.value));const epb=power===null||gross===null?null:power/gross*1000;
 const constraint=(name:string,actual:number|null,required:string,test:(n:number)=>boolean):Result['constraints'][number]=>({name,actual,required,status:actual===null?'UNKNOWN':test(actual)?'PASS':'FAIL'});
 const constraints=[constraint('Tx Gross',gross,'≥ 3200 Gb/s',n=>n>=3200),constraint('Worst Link Margin',margin,'≥ 3 dB',n=>n>=3),constraint('Total Electrical Power',power,'≤ 25 W',n=>n<=25)];
 const relevant=Object.entries(p).filter(([k])=>k!=='efficiency');const evidenceCoverage=relevant.filter(([,p])=>['Reviewed','Accepted'].includes(p.evidence)&&p.source.trim()&&p.value!==null).length/relevant.length;
 const scoreParts=[{name:'Bandwidth',max:30,points:gross===null?0:30*Math.min(1,gross/3200),known:gross!==null},{name:'Link Margin',max:25,points:margin===null?0:25*Math.max(0,Math.min(1,margin/6)),known:margin!==null},{name:'Electrical Power',max:20,points:power===null?0:20*Math.max(0,Math.min(1,(25-power)/15)),known:power!==null},{name:'Area',max:5,points:0,known:false},{name:'Yield',max:10,points:0,known:false},{name:'Evidence',max:10,points:10*evidenceCoverage,known:true}];
 const issues:string[]=[];if(net===null)issues.push('Net Rate: Coding / Protocol Efficiency 입력 필요');if(v('lane')!==100)issues.push('Lane Rate 변경: Receiver Sensitivity / Loss / Driver Power 적용성을 다시 검토하세요.');issues.push('BER / Eye / TDECQ / EO Bandwidth / Thermal / Yield: P1 미구현');if(evidenceCoverage<1)issues.push('미검증 Assumption 포함: 실제 측정 검증 상태를 부여하지 않습니다.');
 const status=d.mode==='sandbox'?'SANDBOX':constraints.some(c=>c.status==='FAIL')?'FAIL':constraints.some(c=>c.status==='UNKNOWN')?'INCOMPLETE':'SIMULATED PASS';
 return {version:VERSION,schemaVersion:SCHEMA,modelVersion:MODEL,input:structuredClone(d),seed:d.seed,gross,rxGross,net,channels,losses,received,margin,power,powerBreakdown,epb,status,constraints,evidenceCoverage,score:scoreParts.reduce((s,p)=>s+p.points,0),scoreParts,issues};
}
