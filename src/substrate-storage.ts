import {sha256} from './hash';
import {CAMPAIGN_DB,chapter3Backup,parseChapter3Backup} from './campaign-storage';
import type {SnapshotIO} from './campaign-storage';
import {GAME_DB,backupText,parseBackup} from './game-storage';
import {C2_DB,chapter2Backup,parseChapter2Backup} from './chapter2-storage';
import {WorkshopSnapshotIO,WORKSHOP_HEAD,workshopBackup,parseWorkshopBackup,campaignBackup06,parseCampaignBackup06,validateCampaign06} from './workshop-storage';
import type {Campaign06} from './workshop-storage';
import {newChapter5,validateChapter5} from './chapter5';
import {SUBSTRATE_MODEL} from './substrate-schema';
import type {SubstrateState} from './substrate-schema';
export type Campaign07=Campaign06 & {chapter5:SubstrateState};
export const SUBSTRATE_HEAD=(id:string)=>'substrate-head::'+id;
export const SUBSTRATE_LKG=(id:string)=>'substrate-lkg::'+id;
export const CAMPAIGN07_HEAD=(id:string)=>'v07-campaign-head::'+id;
export const JOURNAL07='campaign07-restore-journal';
export function substrateBackup(s:SubstrateState){validateChapter5(s);return JSON.stringify({format:'AIDataCenterTycoon-Substrate',schema:1,model:SUBSTRATE_MODEL,payload:s,sha256:sha256(JSON.stringify(s))},null,2);}
export function parseSubstrateBackup(raw:string,id:string):SubstrateState{if(typeof raw!=='string'||raw.length>16_000_000)throw Error('Substrate Backup 크기 오류');const e=JSON.parse(raw);if(e.format!=='AIDataCenterTycoon-Substrate'||e.schema!==1||e.model!==SUBSTRATE_MODEL)throw Error('지원하지 않는 Substrate Schema / Model · 원본 보존');if(e.sha256!==sha256(JSON.stringify(e.payload)))throw Error('Substrate SHA256 불일치');validateChapter5(e.payload);if(e.payload.profileId!==id)throw Error('Substrate Profile 불일치');return structuredClone(e.payload);}
export function validateCampaign07(c:Campaign07){validateCampaign06(c);parseSubstrateBackup(substrateBackup(c.chapter5),c.game.id);if(c.chapter5.revision>0&&!c.chapter4.cleared['12'])throw Error('Mission12 Clear 없이 Substrate Progress');}
export function campaignBackup07(c:Campaign07){validateCampaign07(c);const chapters={legacy:campaignBackup06(c),substrate:substrateBackup(c.chapter5)};return JSON.stringify({format:'AIDataCenterTycoon-Campaign',schema:3,release:'0.7.0',profileId:c.game.id,chapters,sha256:sha256(JSON.stringify(chapters)),labBoundary:'Independent original Engineering Lab backup; not included in Campaign'},null,2);}
export function parseCampaignBackup07(raw:string,current?:Campaign07):Campaign07{
 if(typeof raw!=='string'||raw.length>40_000_000)throw Error('Campaign Backup 크기 오류');const e=JSON.parse(raw);
 if(e.format==='AIDataCenterTycoon-Campaign'&&e.schema===3&&e.release==='0.7.0'){if(!e.chapters||e.sha256!==sha256(JSON.stringify(e.chapters)))throw Error('Campaign SHA256 불일치');const legacy=parseCampaignBackup06(e.chapters.legacy),chapter5=parseSubstrateBackup(e.chapters.substrate,legacy.game.id);if(e.profileId!==legacy.game.id)throw Error('Campaign Profile 불일치');const c={...legacy,chapter5};validateCampaign07(c);return c;}
 const legacy=parseCampaignBackup06(raw,current),keep=current&&legacy.game.id===current.game.id&&e.format!=='AIDataCenterTycoon-Campaign';const c={...legacy,chapter5:keep?structuredClone(current.chapter5):newChapter5(legacy.game.id)};validateCampaign07(c);return c;
}
function supported(key:string,raw:string){try{if(key.startsWith('substrate-head::'))parseSubstrateBackup(raw,key.slice(16));else if(key.startsWith('v07-campaign-head::')){if(parseCampaignBackup07(raw).game.id!==key.slice(19))return false;}else return false;return true;}catch{return false;}}
export class SubstrateSnapshotIO extends WorkshopSnapshotIO{
 async cas(name:string,key:string,expected:string|null,value:string|null){if(name!==CAMPAIGN_DB||!['substrate-head::','v07-campaign-head::'].some(p=>key.startsWith(p)))return super.cas(name,key,expected,value);
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('snapshots'))r.result.createObjectStore('snapshots');};r.onsuccess=()=>{r.result.onversionchange=()=>r.result.close();resolve(r.result);};r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('다른 창의 저장소를 닫아주세요.'));});
  try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('snapshots','readwrite'),s=tx.objectStore('snapshots');let error:Error|null=null;s.get(key).onsuccess=e=>{const old=(e.target as IDBRequest).result??null;if(old!==expected){error=Error('다른 창에서 Substrate 저장 변경 · 현재 Text Backup을 보존하고 새로고침하세요.');tx.abort();return;}const lkg=key.startsWith('substrate-head::')?SUBSTRATE_LKG(key.slice(16)):'v07-campaign-lkg::'+key.slice(19);if(old!==null&&old!==value){s.put(old,'immutable-original::'+key+'::'+sha256(old));if(supported(key,old))s.put(old,lkg);else{s.put(old,'recovery-original::'+key);if(value&&supported(key,value))s.put(value,lkg);}}if(old===null&&value)s.put(value,lkg);if(value===null)s.delete(key);else s.put(value,key);};tx.oncomplete=()=>resolve();tx.onabort=()=>reject(error||tx.error||Error('Substrate 저장 중단'));tx.onerror=()=>reject(error||tx.error);});}finally{db.close();}
 }
}
export class SubstrateStore{
 private expected:string|null=null;private id='';private blocked=false;
 constructor(private io:SnapshotIO=new SubstrateSnapshotIO()){}
 async load(id:string){this.id=id;this.blocked=false;this.expected=await this.io.get(CAMPAIGN_DB,SUBSTRATE_HEAD(id));if(this.expected===null)return {state:newChapter5(id),warning:''};try{return {state:parseSubstrateBackup(this.expected,id),warning:''};}catch{let e:any;try{e=JSON.parse(this.expected);}catch{}if(e&&(e.schema!==1||e.model!==SUBSTRATE_MODEL||e.format!=='AIDataCenterTycoon-Substrate'||e.payload?.profileId!==id)){this.blocked=true;throw Error('Substrate Schema / Profile 오류 · 자동 저장 중단 · 원본 보존');}try{return {state:parseSubstrateBackup((await this.io.get(CAMPAIGN_DB,SUBSTRATE_LKG(id)))!,id),warning:'Substrate 손상 Head를 LKG에서 복구했습니다. 원본은 다음 저장 시 보존됩니다.'};}catch{this.blocked=true;throw Error('Substrate Head / LKG 손상 · Text Backup을 복원하세요.');}}
 }
 async save(s:SubstrateState){if(this.blocked||s.profileId!==this.id)throw Error('Substrate 저장 중단 / Profile 불일치');const raw=substrateBackup(s);if(raw!==this.expected){await this.io.cas(CAMPAIGN_DB,SUBSTRATE_HEAD(this.id),this.expected,raw);this.expected=raw;}}
}
export class Campaign07Checkpoint{
 private expected:string|null=null;private id='';private blocked=false;
 constructor(private io:SnapshotIO=new SubstrateSnapshotIO()){}
 async load(id:string){this.id=id;this.blocked=false;this.expected=await this.io.get(CAMPAIGN_DB,CAMPAIGN07_HEAD(id));if(this.expected!==null)try{if(parseCampaignBackup07(this.expected).game.id!==id)throw Error('Profile');}catch{this.blocked=true;throw Error('Campaign07 Snapshot 손상 / Future Schema · 자동 Snapshot 중단');}}
 async save(c:Campaign07){if(this.blocked||c.game.id!==this.id)throw Error('Campaign07 Snapshot 저장 중단');const raw=campaignBackup07(c);if(raw!==this.expected){await this.io.cas(CAMPAIGN_DB,CAMPAIGN07_HEAD(this.id),this.expected,raw);this.expected=raw;}}
 async lkg(id:string){const raw=await this.io.get(CAMPAIGN_DB,'v07-campaign-lkg::'+id);if(!raw)throw Error('Campaign07 LKG 없음');const c=parseCampaignBackup07(raw);if(c.game.id!==id)throw Error('Campaign07 LKG Profile 오류');return c;}
}
type Journal07={schema:1;release:'0.7.0';id:string;profileId:string;status:'prepared'|'committed'|'cancelled';entries:{db:string;key:string;before:string|null;after:string}[]};
const targets=(id:string)=>[{db:GAME_DB,key:'head'},{db:C2_DB,key:'head::'+id},{db:CAMPAIGN_DB,key:'head::'+id},{db:CAMPAIGN_DB,key:WORKSHOP_HEAD(id)},{db:CAMPAIGN_DB,key:SUBSTRATE_HEAD(id)}];
function parseJournal(raw:string){const j=JSON.parse(raw)as Journal07;if(j.schema!==1||j.release!=='0.7.0'||!['prepared','committed','cancelled'].includes(j.status)||typeof j.id!=='string'||typeof j.profileId!=='string'||!Array.isArray(j.entries)||j.entries.length!==5)throw Error('지원하지 않는 v07 Restore Journal · 원본 보존');const t=targets(j.profileId);for(let i=0;i<5;i++){const e=j.entries[i];if(e.db!==t[i].db||e.key!==t[i].key||(e.before!==null&&typeof e.before!=='string')||typeof e.after!=='string')throw Error('v07 Restore Journal Boundary 오류');}if(j.status==='committed'||j.status==='cancelled')return j;validateCampaign07({game:parseBackup(j.entries[0].after),chapter2:parseChapter2Backup(j.entries[1].after,j.profileId),chapter3:parseChapter3Backup(j.entries[2].after,j.profileId),chapter4:parseWorkshopBackup(j.entries[3].after,j.profileId),chapter5:parseSubstrateBackup(j.entries[4].after,j.profileId)});return j;}
async function complete(io:SnapshotIO,j:Journal07,raw:string){const heads=await Promise.all(j.entries.map(e=>io.get(e.db,e.key)));if(heads.some((h,i)=>h!==j.entries[i].before&&h!==j.entries[i].after))throw Error('Campaign07 복원 중 Concurrent Write · Boot / Autosave 중단 · 원본 보존');for(const e of j.entries)if(await io.get(e.db,e.key)!==e.after)await io.cas(e.db,e.key,e.before,e.after);await io.cas(CAMPAIGN_DB,JOURNAL07,raw,JSON.stringify({...j,status:'committed'}));}
export async function recoverCampaign07(io:SnapshotIO=new SubstrateSnapshotIO()){const raw=await io.get(CAMPAIGN_DB,JOURNAL07);if(raw===null)return;const j=parseJournal(raw);if(j.status==='prepared')await complete(io,j,raw);}
export async function cancelCampaign07(io:SnapshotIO=new SubstrateSnapshotIO()){const raw=await io.get(CAMPAIGN_DB,JOURNAL07);if(!raw)return;const j=parseJournal(raw);if(j.status==='prepared')await io.cas(CAMPAIGN_DB,JOURNAL07,raw,JSON.stringify({...j,status:'cancelled'}));}
export async function restoreCampaign07(c:Campaign07,io:SnapshotIO=new SubstrateSnapshotIO()){
 validateCampaign07(c);const old=await io.get(CAMPAIGN_DB,JOURNAL07);if(old&&parseJournal(old).status==='prepared')throw Error('진행 중인 v07 복원부터 복구하세요.');const after=[backupText(c.game),chapter2Backup(c.chapter2),chapter3Backup(c.chapter3),workshopBackup(c.chapter4),substrateBackup(c.chapter5)],entries=await Promise.all(targets(c.game.id).map(async(e,i)=>({...e,before:await io.get(e.db,e.key),after:after[i]})));const j:Journal07={schema:1,release:'0.7.0',id:sha256(JSON.stringify(entries)),profileId:c.game.id,status:'prepared',entries},raw=JSON.stringify(j);await io.cas(CAMPAIGN_DB,JOURNAL07,old,raw);await complete(io,j,raw);
}
