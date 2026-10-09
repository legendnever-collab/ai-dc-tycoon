import {newDesign,solve,validateDesign} from './core';
import {createNode,edge,refreshPorts} from './graph';
import {simulateWorkshop} from './workshop-adapter';
import {sha256} from './hash';
import {SUBSTRATE_MODEL} from './substrate-schema';
import type {SubstrateContext,SubstrateDesign,SubstrateResult,Mission5} from './substrate-schema';
import type {Node} from './schema';
export const COUPLING5={edge:{name:'Edge-like Baseline',lossDb:1.0},direct:{name:'Direct Interface Baseline',lossDb:.7},'evanescent-preview':{name:'Evanescent Preview · fixed loss',lossDb:1.5}};
export const ROUTES5={compact:{lengthCm:2,bends:2,crossings:0},serpentine:{lengthCm:14,bends:8,crossings:4}};
export const ALIGNMENT5={standard:{radiusUm:4,windowUm:1.5,pitchWindowUm:.5},tight:{radiusUm:2,windowUm:.8,pitchWindowUm:.2}};
export const substrateContextHash=(c:SubstrateContext)=>sha256(JSON.stringify({workshop:{...c.workshop,qualified:null},package:c.package}));
export function alignmentLoss5(d:SubstrateDesign,i:number){const x=d.lateralUm+(i-(d.channels-1)/2)*d.pitchMismatchUm,y=d.verticalUm,w=ALIGNMENT5[d.tolerance].radiusUm;return {xUm:x,yUm:y,lossDb:10/Math.LN10*((x/w)**2+(y/w)**2)};}
export function buildSubstrateGraph(d:SubstrateDesign,c:SubstrateContext,mission:Mission5){
 const g=newDesign(),w=c.workshop,p=w.parameters,r=ROUTES5[d.route];g.id=d.id;g.revision=d.revision;g.name='Photonic Substrate · parallel educational fixture';g.family=d.channels+' spatial channels × '+d.laneGbps+' Gb/s · no WDM';g.mode='sandbox';g.geometryMode='cosmetic';g.history=[];g.channelOverrides={};g.editor={selectedId:null,view:'2d',undo:[],redo:[]};g.graph={components:[],connections:[]};
 const values:Record<string,number|null>={tx:d.channels,rx:d.channels,wavelengths:1,lane:d.laneGbps,efficiency:.8,launch:p.launchDbm,wall:p.wpe,modLoss:p.modLossDb,driver:p.driverWPerLane,tia:.2,control:1,thermal:.5,alpha:.2,length:r.lengthCm,bendCount:r.bends,bendLoss:.08,crossingCount:r.crossings,crossingLoss:.05,coupling:d.coupling?COUPLING5[d.coupling].lossDb:null,fiber:p.fiberDb,sensitivity:p.sensitivityDbm,mux:0,receiver:0,split:1,splitExcess:0};
 for(const [k,value]of Object.entries(values))g.parameters[k]={...g.parameters[k],value,evidence:'Assumption',source:SUBSTRATE_MODEL+' · uncalibrated educational input'};
 const add=(type:string,id:string,flow:'Tx'|'Rx'|'Mechanical'='Tx')=>{const n=createNode(type,id,flow);g.graph.components.push(n);return n;};
 const fixed=(n:Node,key:string,value:number|null,label:string)=>{n.parameters[key]={...n.parameters[key],value,evidence:'Assumption',source:label};delete n.parameters[key].ref;};
 const link=(a:string,b:string,ap='out',bp='in')=>g.graph.connections.push(edge(a,b,ap,bp));
 const region=add('PhotonicSubstrate','substrate-region','Mechanical');region.label='20 × 10 mm educational envelope';region.dimensions={x:20,y:1,z:10,unit:'mm'};
 for(let i=0;i<d.channels;i++){
  const id='ch'+String(i+1).padStart(2,'0');add('ELS','els-'+id).label='Shared ELS allocation · '+id;
  const mod=add(p.modulator||'MZM','mod-'+id);mod.label=(p.modulator||'Unknown Modulator')+' inherited per-lane model';add('ElectricalConnector','asic-'+id);add('Driver','driver-'+id);link('asic-'+id,'driver-'+id);if(w.driverConnected&&c.package.asic)link('driver-'+id,'mod-'+id,'out','drive');if(w.cwConnected&&c.package.els)link('els-'+id,'mod-'+id);
  const input=add('EdgeCoupler','oe-interface-'+id);input.label=d.coupling?COUPLING5[d.coupling].name+' · OE → PS':'OE → PS · Unknown';fixed(input,'loss',d.coupling?COUPLING5[d.coupling].lossDb:null,'Fixed educational interface assumption');if(d.substrateConnected&&d.coupling&&w.outputConnected)link('mod-'+id,input.id);
  let tail=input.id;
  if(mission!=='13'){
   add('Waveguide','ps-wg-'+id).label='PS Propagation';add('Bend','ps-bends-'+id).label='PS Bends';add('Crossing','ps-crossings-'+id).label='PS Crossings';link(tail,'ps-wg-'+id);link('ps-wg-'+id,'ps-bends-'+id);link('ps-bends-'+id,'ps-crossings-'+id);
   const fauCoupler=add('GratingCoupler','fau-interface-'+id);fauCoupler.label='PS → FAU + Alignment';fixed(fauCoupler,'loss',1,'1 dB educational PS-to-FAU baseline');link('ps-crossings-'+id,fauCoupler.id);tail=fauCoupler.id;const penalty=alignmentLoss5(d,i).lossDb;const stages=Math.max(1,Math.ceil(penalty/30));for(let stage=0;stage<stages;stage++){const alignment=add('FiberLink','alignment-'+id+'-'+stage);alignment.label='FAU Alignment'+(stages>1?' part '+(stage+1):'');fixed(alignment,'loss',penalty/stages,'Gaussian educational penalty, partitioned to keep compact-node input valid');link(tail,alignment.id);tail=alignment.id;}
  }
  const fau=add('FAU','fau-'+id);fau.label=mission==='13'?'Virtual input-plane meter allocation':'FAU physical lane allocation';fixed(fau,'fibers',1,'One spatial lane per channel');fixed(fau,'first',i+1,'Stable fiber identity');fixed(fau,'loss',0,'Interface loss already counted once');if(mission==='13'||d.fauConnected&&c.package.fau)link(tail,fau.id);
  const fiber=add('FiberLink','fiber-'+id);fixed(fiber,'loss',mission==='13'?0:p.fiberDb,'M13 input plane uses zero external fiber length');add('ReceiverBoundary','receiver-'+id);link(fau.id,fiber.id);link(fiber.id,'receiver-'+id);
 }
 // Independent Rx reference topology keeps compiler invariants; incoming Rx power is Unknown.
 add('RxSource','rx-source','Rx');const rf=add('FAU','rx-fau','Rx');fixed(rf,'loss',0,'Independent Rx reference');add('Photodetector','rx-pd','Rx');add('TIA','rx-tia','Rx');add('ElectricalConnector','rx-host','Rx');link('rx-source','rx-fau');link('rx-fau','rx-pd');link('rx-pd','rx-tia');link('rx-tia','rx-host');
 g.graph.components.forEach(n=>refreshPorts(n,g));validateDesign(g);return g;
}
export function simulateSubstrate(d:SubstrateDesign,c:SubstrateContext,mission:Mission5):SubstrateResult{
 const source=simulateWorkshop(c.workshop,c.package,'12'),graph=buildSubstrateGraph(d,c,mission),core=solve(graph),compiled=core.compiler!,sourceValid=source.status==='Link Budget Qualified — Educational';
 const valid=sourceValid&&compiled.valid&&d.substrateConnected&&d.coupling!==null&&(mission==='13'||d.fauConnected);const tx=compiled.paths.filter(p=>p.flow==='Tx');
 const channels=tx.map((p,i)=>{const a=alignmentLoss5(d,i);return {id:p.id,xUm:a.xUm,yUm:a.yUm,alignmentDb:mission==='13'?0:a.lossDb,lossDb:valid&&p.losses.every(l=>l.value!==null)?p.losses.reduce((n,l)=>n+l.value!,0):null,receivedDbm:valid?p.received:null,marginDb:valid?p.margin:null};});
 const known=valid&&core.margin!==null,worst=known?channels.find(x=>x.marginDb===core.margin):undefined,path=worst?tx.find(p=>p.id===worst.id):undefined;const spanMM=(d.channels-1)*(127+d.pitchMismatchUm)/1000;const diagnostics=compiled.errors.map(e=>e.message);if(!sourceValid)diagnostics.unshift('선택한 OE의 Mission12 Tx 경로를 먼저 다시 검증하세요.');
 return {model:SUBSTRATE_MODEL,evidence:'Educational Assumption',calibration:'Uncalibrated',mission,designRevision:d.revision,contextHash:substrateContextHash(c),graphHash:compiled.hash,bindingContext:{workshop:{...structuredClone(c.workshop),qualified:null},package:structuredClone(c.package)},graph,core,valid,sourceValid,activeChannels:known?channels.filter(p=>p.marginDb!==null&&p.marginDb>=3).length:0,grossGbps:valid?core.gross:null,lossDb:worst?.lossDb??null,receivedDbm:valid?core.received:null,marginDb:valid?core.margin:null,diagnosticW:valid?core.power:null,spanMM,feasible:spanMM<=3&&ROUTES5[d.route].lengthCm<=8,worstChannel:worst?.id??null,channels,losses:path?.losses.map(l=>({name:l.name,value:l.value}))??[],referencePlanes:{source:'els-001.out · per-channel allocation',receive:mission==='13'?'substrate-001.input · virtual meter':'remote-rx.in · FAU + fiber boundary'},diagnostics,notModeled:['Full-wave EM','Measured evanescent gap / overlap / CMT','Process variation yield','Reliability','Warpage / thermal deformation','BER / EO bandwidth','Vendor-specific performance'],fixture:'Replicated inherited OE per-lane model: '+d.channels+' × '+d.laneGbps+'G. 16 × 50G is a hypothetical fixture, not a conversion or physical qualification of the existing 8 × 100G OE.',powerBoundary:'Diagnostic fixture DC only, including logical shared ELS allocations, Drivers and independent Rx TIA reference. Never add to the preserved CPO Package power ledger.'};
}
