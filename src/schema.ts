import type {Parameter, Design as LegacyDesign, Result as LegacyResult} from './legacy-core';
export type {Parameter};
export type Flow='Tx'|'Rx'|'Mechanical';
export type Signal='CW'|'modulated'|'data'|'drive'|'analog'|'heat';
export type Port={id:string;kind:'optical'|'electrical'|'thermal';direction:'in'|'out';signal:Signal;required:boolean;plane:string};
export type Binding=Parameter & {ref?:string};
export type Node={id:string;type:string;label:string;flow:Flow;modelId:string;ports:Port[];parameters:Record<string,Binding>;schematic:{x:number;y:number};geometry:{x:number;y:number;z:number;rotation:number;unit:'mm'};dimensions:{x:number;y:number;z:number;unit:'mm'};route:{enabled:boolean;start:string|null;end:string|null;waypoints:{x:number;y:number;z:number}[];unit:'mm'}};
export type Edge={id:string;from:{component:string;port:string};to:{component:string;port:string}};
export type Graph={components:Node[];connections:Edge[];compileGuard?:string};
export type EditState={name:string;family:string;mode:'campaign'|'sandbox';solverMode:'graph'|'legacy-parameter';geometryMode:'cosmetic'|'physical-routing';parameters:Record<string,Parameter>;channelOverrides:LegacyDesign['channelOverrides'];graph:Graph;evidenceNote:string;seed:number};
export type Design=Omit<LegacyDesign,'schemaVersion'|'graph'|'history'> & EditState & {schemaVersion:2;legacyGraph:LegacyDesign['graph'];migration:{sourceSchema:number;sourceVersion:string;original:LegacyDesign}|null;history:(LegacyDesign['history'][number]&{command?:string;graphHash?:string})[];editor:{selectedId:string|null;view:'2d'|'3d'|'split';undo:EditState[];redo:EditState[]}};
export type Diagnostic={code:string;message:string;node?:string;port?:string};
export type Loss={node:string;name:string;value:number|null;fromPlane:string;toPlane:string;modelId:string};
export type Path={id:string;flow:'Tx'|'Rx';source:string;sink:string;nodes:string[];edges:string[];fiber:number;wavelength:number;laneRate:number|null;received:number|null;margin:number|null;launch:number|null;losses:Loss[];driver:string|null;tia:string|null;sourceGroup:string};
export type CompileResult={valid:boolean;errors:Diagnostic[];warnings:string[];unknownFlows:('Tx'|'Rx')[];hash:string;version:string;paths:Path[];dependencies:Record<string,string[]>;passive:{node:string;fanout:number|null;transmissionSum:number|null;usedOutputs:number}[];gross:number|null;rxGross:number|null;powerBreakdown:LegacyResult['powerBreakdown'];power:number|null};
export type Result=Omit<LegacyResult,'input'> & {input:Design;solverMode:Design['solverMode'];compiler:CompileResult|null;rxChannels:{id:string;received:number|null;margin:number|null}[]};
export function editState(d:Design):EditState {const {name,family,mode,solverMode,geometryMode,parameters,channelOverrides,graph,evidenceNote,seed}=d;return structuredClone({name,family,mode,solverMode,geometryMode,parameters,channelOverrides,graph,evidenceNote,seed});}
export function applyState(d:Design,s:EditState){Object.assign(d,structuredClone(s));}
