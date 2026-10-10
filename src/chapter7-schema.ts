export const MODEL7='optical-architecture-educational-1.0.0';
export type Mission7='19'|'20'|'21';
export type Design7={mission:Mission7;customer:'A'|'B'|'C';spatial:number;wavelengths:1|2|4;laneRate:50|100|200;efficiency:number;connected:number;pitchUm:number;rows:1|2;lengthCm:number;bends:number;crossings:number;mux:'none'|'broad'|'narrow';temperatureC:number;tuning:'off'|'active';ioChannels:number;signaling:'basic'|'advanced'};
export type Constraint7={id:string;label:string;actual:number;limit:number;unit:string;direction:'min'|'max';pass:boolean};
export type Result7={model:string;inputHash:string;gross:number;payload:number;activeGross:number;activePayload:number;spanMm:number;footprintMm2:number;density:number;losses:{id:string;label:string;db:number;scope:'substrate'|'link'}[];substrateLoss:number;endToEndLoss:number;margin:number;driftNm:number;residualNm:number;filterPenalty:number;sourceW:number;driverW:number;tuningW:number;otherW:number;totalW:number;costCredits:number;laneFeasibility:number;constraints:Constraint7[];pass:boolean;evidence:'Educational Assumption';notModeled:string[]};
export type Snapshot7={mission:Mission7;design:Design7;result:Result7;model:string;inputHash:string;resultHash:string;savedAt:string;evidence:'Educational Assumption'};
export type Session7={design:Design7;result:Snapshot7|null;previous:Snapshot7|null;A?:Snapshot7;B?:Snapshot7;prediction:string;hint:number;note:string;review:{reason:string;tradeoff:string;change:string};attempts:number};
export type State7={schema:1;practice:Partial<Record<Mission7,Session7>>;campaign:Record<string,{sessions:Partial<Record<Mission7,Session7>>;receipts:{mission:Mission7;xp:number;credits:number;inputHash:string}[]}>};
export const newState7=():State7=>({schema:1,practice:{},campaign:{}});
