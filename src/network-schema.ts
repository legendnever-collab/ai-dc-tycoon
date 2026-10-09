// Chapter 2 is a separate educational model. No vendor specification or optical physics.
export const NETWORK_MODEL='chapter2-path-1.0.0';
export type Rate=100|400|800;
export type SwitchKind='PortLimited'|'HighDensity'|'Spine';
export type ModuleKind='Pluggable400'|'Pluggable800';
export type NetworkNode={id:string;type:'ComputeRack'|'Switch';groupId:string;switchKind?:SwitchKind;computeWU_s?:number;provided:boolean};
export type SwitchPort={id:string;nodeId:string;type:'NetworkPort';direction:'bidirectional';supportedRates:Rate[];interface:'educational-electrical-v1';module:ModuleKind|null;provided:boolean};
export type NetworkLink={id:string;type:'Copper'|'Fiber';a:string;b:string;rate:Rate;direction:'bidirectional';provided:boolean};
export type NetworkGroup={id:string;type:'NetworkGroup';name:string};
export type TrafficDemand={id:string;type:'TrafficDemand';source:string;target:string;amountGbit:number;direction:'source-to-target'};
export type NetworkGraph={modelVersion:typeof NETWORK_MODEL;mission:'04'|'05'|'06';nodes:NetworkNode[];ports:SwitchPort[];links:NetworkLink[];groups:NetworkGroup[];traffic:TrafficDemand[];nextLinkId:number};
export type NetworkResult={modelVersion:string;activeLinks:string[];inactiveLinks:{id:string;reason:string}[];connectedRacks:string[];paths:{demandId:string;nodes:string[];links:string[];amountGbit:number}[];resources:{id:string;type:'Link'|'Fabric';capacityGb_s:number;trafficGbit:number;seconds:number}[];bottleneckResource:string|null;networkSeconds:number|null;effectiveGb_s:number;grossGb_s:number;powerW:number;costCredits:number;installedModules:number;rackSpaceRU:number;issues:{id:string;message:string}[];assumptions:string[]};
export type NetworkCommand={type:'switch-install';id:string;kind:SwitchKind}|{type:'port-select';id:string|null}|{type:'link-connect';a:string;b:string;rate:Rate;medium:'Copper'|'Fiber'}|{type:'link-disconnect';id:string}|{type:'link-rate';id:string;rate:Rate}|{type:'module-install';portId:string;module:ModuleKind|null}|{type:'reset-network'};
