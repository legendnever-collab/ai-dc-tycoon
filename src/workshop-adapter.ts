import {newDesign,solve,validateDesign} from './core';
import {createNode,edge,connectionError,GRAPH_MODEL,refreshPorts} from './graph';
import {sha256} from './hash';
import type {Node,Design} from './schema';
import type {PackageConfig} from './cpo-schema';
import {WORKSHOP_MODEL} from './workshop-schema';
import type {WorkshopDesign,WorkshopResult,Mission4} from './workshop-schema';
export const NOT_MODELED=['BER','Eye Diagram','TDECQ','MZM Vπ / ER / EO response','EAM response','Evanescent gap / overlap / CMT','Yield / Reliability','Thermal temperature','Measured hardware qualification'];
export function dbmToMw(dbm:number){if(!Number.isFinite(dbm))throw Error('dBm must be finite');return 10**(dbm/10);}
export function mwToDbm(mw:number){if(!Number.isFinite(mw)||mw<=0)throw Error('mW must be positive');return 10*Math.log10(mw);}
export function buildWorkshopGraph(w:WorkshopDesign,pkg:PackageConfig,mission:Mission4):Design{
 const d=newDesign(),p=w.parameters;d.id=w.id;d.name=w.oeId+' · Guided Optical Engine';d.revision=w.revision;d.seed=20261009;d.family='8 spatial lanes × 100G · no WDM';d.mode='sandbox';d.geometryMode='cosmetic';d.history=[];d.channelOverrides={};d.graph={components:[],connections:[]};d.editor={selectedId:null,view:'2d',undo:[],redo:[]};
 const globals:Record<string,number|null>={tx:8,rx:8,wavelengths:1,lane:100,efficiency:.8,launch:p.launchDbm,wall:p.wpe,modLoss:p.modLossDb,length:p.lengthCm,alpha:p.alphaDbCm,bendCount:p.bends,bendLoss:p.bendLossDb,coupling:p.couplingDb,fiber:p.fiberDb,sensitivity:p.sensitivityDbm,driver:p.driverWPerLane,tia:.2,control:1,thermal:.5,mux:0,receiver:0,split:1,splitExcess:0,crossingCount:0,crossingLoss:0};
 for(const [k,v]of Object.entries(globals))d.parameters[k]={...d.parameters[k],value:v,evidence:'Assumption',source:WORKSHOP_MODEL+' educational preset'};
 const add=(t:string,id:string,flow:'Tx'|'Rx'='Tx')=>{const n=createNode(t,id,flow);d.graph.components.push(n);return n;};
 const connect=(a:string,b:string,ap='out',bp='in')=>{const e=edge(a,b,ap,bp);const error=connectionError(d.graph,e);if(error)throw Error(error);d.graph.connections.push(e);};
 const actualOE=pkg.oes.find(o=>o.id===w.oeId);
 if(pkg.els){const els=add('ELS','els-001');els.label='External ELS · package boundary';}
 if(p.modulator){const mod=add(p.modulator,'mod');mod.label=p.modulator+' · '+w.oeId;}
 if(w.cwConnected&&pkg.els&&p.modulator)connect('els-001','mod');
 if(w.driverConnected&&p.modulator){add('ElectricalConnector','asic-data');add('Driver','driver');if(pkg.asic&&actualOE)connect('asic-data','driver');connect('driver','mod','out','drive');}
 // M11 uses an explicit temporary output meter fixture. It is not the final fiber link or a measurement.
 if(mission==='11'&&p.modulator&&w.outputConnected){const f=add('FAU','meter-fau');f.label='Temporary 8-channel meter fixture';f.parameters.loss.value=0;const fiber=add('FiberLink','meter-link');fiber.parameters.loss={value:0,unit:'dB',evidence:'Assumption',source:'Zero-loss temporary diagnostic termination'};add('ReceiverBoundary','meter-receiver');connect('mod','meter-fau');connect('meter-fau','meter-link');connect('meter-link','meter-receiver');}
 if(mission==='12'){
  if(w.waveguide){add('Waveguide','wg');add('Bend','bend');if(p.modulator&&w.outputConnected)connect('mod','wg');connect('wg','bend');}
  if(p.coupler&&w.couplerConnected){add(p.coupler,'coupler');if(w.waveguide)connect('bend','coupler');}
  if(w.fauConnected&&pkg.fau){const f=add('FAU','fau-001');f.label='External FAU interface';f.parameters.loss.value=0;if(p.coupler&&w.couplerConnected)connect('coupler','fau-001');}
  if(w.receiverConnected){add('FiberLink','fiber');add('ReceiverBoundary','remote-rx');if(w.fauConnected&&pkg.fau)connect('fau-001','fiber');connect('fiber','remote-rx');}
 }
 // Required independent Rx topology is a declared reference fixture; incoming power stays Unknown.
 add('RxSource','rx-source','Rx');const rf=add('FAU','rx-fau','Rx');rf.parameters.loss.value=0;add('Photodetector','rx-pd','Rx');add('TIA','rx-tia','Rx');add('ElectricalConnector','rx-host','Rx');connect('rx-source','rx-fau');connect('rx-fau','rx-pd');connect('rx-pd','rx-tia');connect('rx-tia','rx-host');
 d.graph.components.forEach(n=>refreshPorts(n,d));validateDesign(d);return d;
}
export function simulateWorkshop(w:WorkshopDesign,pkg:PackageConfig,mission:Mission4):WorkshopResult{
 const d=buildWorkshopGraph(w,pkg,mission),core=solve(d),c=core.compiler!,p=w.parameters,oe=pkg.oes.find(o=>o.id===w.oeId),has=(prefix:string)=>pkg.connections.some(e=>e.id===prefix+oe?.slot),cw=pkg.els&&!!oe&&oe.enabled&&has('laser-')&&w.cwConnected&&p.launchDbm!==null&&p.wpe!==null;
 const launchDbm=cw?p.launchDbm:null,launchMw=launchDbm===null?null:dbmToMw(launchDbm),laserOpticalW=launchMw===null?null:8*launchMw/1000;
 const tx=c.paths.filter(x=>x.flow==='Tx'),path=tx[0];const valid=c.valid&&cw&&pkg.asic&&!!oe&&oe.type==='oe800'&&has('electrical-');
 const losses=path?.losses.map(x=>({node:x.node,name:x.name,value:x.value,fromPlane:x.fromPlane,toPlane:x.toPlane}))??[];
 const known=valid&&losses.length>0&&losses.every(x=>x.value!==null)&&core.received!==null&&core.margin!==null;
 const lossDb=known?losses.reduce((n,x)=>n+x.value!,0):null;
 const laserElectricalW=mission==='10'?(laserOpticalW===null||p.wpe===null?null:laserOpticalW/p.wpe):valid?c.powerBreakdown.find(x=>x.name==='Laser electrical')!.value:null;
 const diagnostics=c.errors.map(x=>({node:x.node||w.oeId,message:x.message}));if(!cw)diagnostics.unshift({node:'els-001',message:'기존 ELS → 올바른 OE CW Input과 Laser Power가 필요합니다.'});if(!oe||oe.type!=='oe800'||!has('electrical-'))diagnostics.unshift({node:w.oeId,message:'800G OE와 기존 ASIC Electrical Path를 확인하세요.'});
 const status:WorkshopResult['status']=mission==='10'?cw?'CW Ready':'Incomplete':known?mission==='11'?'Modulation Ready':core.margin!>=3?'Link Budget Qualified — Educational':'Optical Path Simulated':c.valid?'Incomplete':'Invalid';
 return {bindingPackage:structuredClone(pkg),stage:mission,modelVersion:WORKSHOP_MODEL,packageHash:sha256(JSON.stringify(pkg)),evidence:'Educational Assumption',status,lossDb,marginDb:known?core.margin:null,activePathIds:valid?tx.map(x=>x.id):[],includedPowerBoundary:'Workshop diagnostic only: shared external ELS allocation + Driver + Rx TIA reference + Control. Do not add to v0.5 96W package ledger.',reference:pkg.references.find(x=>x.oeId===w.oeId)??null,oeId:w.oeId,packageId:pkg.id,designId:w.id,designVersion:w.version,designRevision:w.revision,graphHash:c.hash,parameterSet:structuredClone(p),pathIdentity:tx.map(x=>x.id),referencePlane:{launch:'els-001.out',receive:mission==='11'?'meter-receiver.in':'remote-rx.in'},sourceBoundary:'Existing external els-001; launch per optical channel',receiverBoundary:mission==='11'?'Temporary educational optical meter; not measured':'Remote Receiver average power threshold; excluded from local DC power',simulationStatus:'Analytical / Simplified',launchDbm,launchMw,laserOpticalW,laserElectricalW,electricalW:valid?core.power:null,losses,receivedDbm:known?core.received:null,grossGb_s:valid?core.gross:null,rxMarginDb:null,core,design:d,modelProvenance:{coreVersion:'0.2.0',compilerVersion:c.version,fidelity:'Analytical / Simplified',calibration:'Uncalibrated',fixture:mission==='11'?'temporary-output-meter-8x100G':'guided-single-oe-8x100G'},diagnostics,notModeled:[...NOT_MODELED]};
}
