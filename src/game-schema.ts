export const APP_VERSION='0.3.0',GAME_SCHEMA=1,GAME_MODEL='ai-dc-educational-1.0.0';
export type MissionId='01'|'02'|'03';
export type Phase='LOCKED'|'AVAILABLE'|'ACTIVE'|'SIMULATING'|'RESULT'|'CLEARED';
export type HardwareType='ComputeRack-T1'|'ScaleOutSwitch-T1'|'ScaleOutSwitch-T2';
export type Rack={id:string;type:'ComputeRack-T1';slot:number|null;purchased:boolean};
export type World={racks:Rack[];switch:{id:'switch-001';type:'ScaleOutSwitch-T1'|'ScaleOutSwitch-T2'}};
export type WorkloadKind='independent'|'distributed-training'|'scale-up'|'storage-io';
export type SimInput={modelVersion:string;missionId:MissionId;workload:{kind:WorkloadKind;fabric:'none'|'scale-out'|'scale-up'|'storage';amountWU:number|null;transferGbPerWU:number|null};compute:{rackCount:number;perRackWU_s:number|null};network:{capacityGb_s:number|null};investmentCredits:number;hardware:{id:string;type:HardwareType;slot:number|null}[];seed:number};
export type SimResult={modelVersion:string;known:boolean;input:SimInput;inputHash:string;computeSeconds:number|null;networkSeconds:number|null;completionSeconds:number|null;throughputWU_s:number|null;gpuWaitingFraction:number|null;bottleneck:'Compute'|'Network'|'Balanced'|'Unknown';issues:string[];assumptions:string[]};
export type Evaluation={pass:boolean;stars:number;score:number;objectives:{label:string;pass:boolean;actual:string}[]};
export type RunResult={simulation:SimResult;evaluation:Evaluation};
export type Award={firstClear:boolean;xp:number;credits:number;unlocks:string[]};
export type MissionRecord={phase:Phase;cleared:boolean;attempts:number;bestStars:number;hintStage:number;pending:RunResult|null;last:RunResult|null;award:Award|null};
export type RewardReceipt={missionId:MissionId;xp:number;credits:number;revision:number;clearResult:RunResult};
export type Game={appVersion:'0.3.0';gameSchemaVersion:1;id:string;revision:number;seed:number;credits:number;xp:number;currentMission:MissionId;world:World;nextRackId:number;missions:Record<MissionId,MissionRecord>;rewards:RewardReceipt[];unlocked:string[];selectedHardwareId:string|null;history:{revision:number;command:string;at:string}[]};
export type Command={type:'start';mission:MissionId}|{type:'buy-rack'}|{type:'place';id:string;slot:number}|{type:'move';id:string}|{type:'sell';id:string}|{type:'upgrade-switch'}|{type:'run'}|{type:'finish'}|{type:'retry'}|{type:'hint'}|{type:'select';id:string|null};
export type EngineeringBridgeRef={hardwareId:string;engineeringDesignId:string;engineeringSchemaVersion:2;engineeringAppVersion:'0.2.0';snapshotSHA256:string;role:'CPO-Package'|'Optical-Engine'|'Photonic-Substrate';status:'reference-only'};
// Reserved association only. No DC throughput is inferred from an optical Design.
