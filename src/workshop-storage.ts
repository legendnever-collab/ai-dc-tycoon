import {sha256} from './hash';
import {CAMPAIGN_DB,BrowserSnapshotIO,campaignBackup,parseCampaignBackup,chapter3Backup,parseChapter3Backup,validateCampaign} from './campaign-storage';
import type {Campaign,SnapshotIO} from './campaign-storage';
import {GAME_DB,backupText,parseBackup} from './game-storage';
import {C2_DB,chapter2Backup,parseChapter2Backup} from './chapter2-storage';
import {newChapter4,validateChapter4} from './chapter4';
import {WORKSHOP_MODEL} from './workshop-schema';
import type {WorkshopState} from './workshop-schema';
export type Campaign06=Campaign & {chapter4:WorkshopState};
export const WORKSHOP_HEAD=(id:string)=>'workshop-head::'+id;
export const WORKSHOP_LKG=(id:string)=>'workshop-lkg::'+id;
export const CAMPAIGN06_HEAD=(id:string)=>'v06-campaign-head::'+id;
export const JOURNAL06='campaign06-restore-journal';
export function workshopBackup(s:WorkshopState){validateChapter4(s);return JSON.stringify({format:'AIDataCenterTycoon-Workshop',schema:1,model:WORKSHOP_MODEL,payload:s,sha256:sha256(JSON.stringify(s))},null,2);}
export function parseWorkshopBackup(raw:string,id:string){if(typeof raw!=='string'||raw.length>12_000_000)throw Error('지원하지 않는 Workshop Backup 크기');const e=JSON.parse(raw);if(e.format!=='AIDataCenterTycoon-Workshop'||e.schema!==1||e.model!==WORKSHOP_MODEL)throw Error('지원하지 않는 Workshop Schema / Model · 원본 보존');if(e.sha256!==sha256(JSON.stringify(e.payload)))throw Error('Workshop SHA256 불일치');validateChapter4(e.payload);if(e.payload.profileId!==id)throw Error('Workshop Profile 불일치');return structuredClone(e.payload) as WorkshopState;}
export function validateCampaign06(c:Campaign06){validateCampaign(c);parseWorkshopBackup(workshopBackup(c.chapter4),c.game.id);if((c.chapter4.revision>0||c.chapter4.receipts.length)&&(!c.chapter3.cleared['09']||!c.chapter3.unlocked.includes('photonics-workshop')))throw Error('Mission09 Clear 없이 Workshop Progress');}
export function campaignBackup06(c:Campaign06){validateCampaign06(c);const chapters={legacy:campaignBackup(c),workshop:workshopBackup(c.chapter4)};return JSON.stringify({format:'AIDataCenterTycoon-Campaign',schema:2,release:'0.6.0',profileId:c.game.id,chapters,sha256:sha256(JSON.stringify(chapters)),labBoundary:'Independent original Engineering Lab backup; not included in Campaign'},null,2);}
export function parseCampaignBackup06(raw:string,current?:Campaign06):Campaign06{
 if(typeof raw!=='string'||raw.length>20_000_000)throw Error('Campaign Backup 크기 오류');const e=JSON.parse(raw);
 if(e.format==='AIDataCenterTycoon-Campaign'&&e.schema===2&&e.release==='0.6.0'){if(e.sha256!==sha256(JSON.stringify(e.chapters)))throw Error('Campaign SHA256 불일치');const legacy=parseCampaignBackup(e.chapters.legacy),chapter4=parseWorkshopBackup(e.chapters.workshop,legacy.game.id);if(e.profileId!==legacy.game.id)throw Error('Campaign Profile 불일치');const c={...legacy,chapter4};validateCampaign06(c);return c;}
 // A full v0.5 backup is an authoritative restore of Chapter1–3 and starts Chapter4 unplayed.
 const legacy=parseCampaignBackup(raw,current);const keep=current&&current.game.id===legacy.game.id&&e.format!=='AIDataCenterTycoon-Campaign';const c={...legacy,chapter4:keep?structuredClone(current.chapter4):newChapter4(legacy.game.id)};validateCampaign06(c);return c;
}
function supported(key:string,raw:string){try{if(key.startsWith('workshop-head::'))parseWorkshopBackup(raw,key.slice(15));else if(key.startsWith('v06-campaign-head::')){if(parseCampaignBackup06(raw).game.id!==key.slice(19))return false;}else return false;return true;}catch{return false;}}
export class WorkshopSnapshotIO extends BrowserSnapshotIO{
 async cas(name:string,key:string,expected:string|null,value:string|null){if(name!==CAMPAIGN_DB||!['workshop-head::','v06-campaign-head::'].some(p=>key.startsWith(p)))return super.cas(name,key,expected,value);
 const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('snapshots'))r.result.createObjectStore('snapshots');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('다른 창의 저장소를 닫아주세요.'));});
 try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('snapshots','readwrite'),store=tx.objectStore('snapshots');let error:Error|null=null;store.get(key).onsuccess=e=>{const old=(e.target as IDBRequest).result??null;if(old!==expected){error=Error('다른 탭에서 저장 변경 · 원본과 현재 Backup을 보존하세요.');tx.abort();return;}const lkg=key.startsWith('workshop-head::')?WORKSHOP_LKG(key.slice(15)):'v06-campaign-lkg::'+key.slice(19);
  if(old!==null&&old!==value){store.put(old,'immutable-original::'+key+'::'+sha256(old));if(supported(key,old))store.put(old,lkg);else{store.put(old,'recovery-original::'+key);if(value&&supported(key,value))store.put(value,lkg);}}
  if(old===null&&value)store.put(value,lkg);if(value===null)store.delete(key);else store.put(value,key);
 };tx.oncomplete=()=>resolve();tx.onabort=()=>reject(error||tx.error||Error('Workshop 저장 중단'));tx.onerror=()=>reject(error||tx.error);});}finally{db.close();}
 }
}
export class WorkshopStore{
 private expected:string|null=null;private id='';private blocked=false;
 constructor(private io:SnapshotIO=new WorkshopSnapshotIO()){}
 async load(id:string){this.id=id;this.blocked=false;this.expected=await this.io.get(CAMPAIGN_DB,WORKSHOP_HEAD(id));if(this.expected===null)return {state:newChapter4(id),warning:''};try{return {state:parseWorkshopBackup(this.expected,id),warning:''};}catch{let e:any;try{e=JSON.parse(this.expected);}catch{}if(e&&(e.schema!==1||e.model!==WORKSHOP_MODEL||e.format!=='AIDataCenterTycoon-Workshop'||e.payload?.profileId!==id)){this.blocked=true;throw Error('Workshop Schema / Profile 오류 · 자동 저장 중단 · 원본 보존');}try{return {state:parseWorkshopBackup((await this.io.get(CAMPAIGN_DB,WORKSHOP_LKG(id)))!,id),warning:'Workshop 손상 Head를 LKG에서 복구했습니다. 원본은 다음 저장 시 보존됩니다.'};}catch{this.blocked=true;throw Error('Workshop Head / LKG 손상 · 자동 저장 중단 · Campaign Backup 복원 필요');}}
 }
 async save(s:WorkshopState){if(this.blocked||s.profileId!==this.id)throw Error('Workshop 저장 중단 / Profile 불일치');const raw=workshopBackup(s);await this.io.cas(CAMPAIGN_DB,WORKSHOP_HEAD(this.id),this.expected,raw);this.expected=raw;}
}
export class Campaign06Checkpoint{
 private expected:string|null=null;private id='';private blocked=false;
 constructor(private io:SnapshotIO=new WorkshopSnapshotIO()){}
 async load(id:string){this.id=id;this.blocked=false;this.expected=await this.io.get(CAMPAIGN_DB,CAMPAIGN06_HEAD(id));if(this.expected!==null)try{if(parseCampaignBackup06(this.expected).game.id!==id)throw Error('Profile');}catch{this.blocked=true;throw Error('Campaign06 Snapshot 손상 / Future Schema · 자동 Snapshot 중단');}}
 async save(c:Campaign06){if(this.blocked||c.game.id!==this.id)throw Error('Campaign06 Snapshot 저장 중단');const raw=campaignBackup06(c);if(raw!==this.expected){await this.io.cas(CAMPAIGN_DB,CAMPAIGN06_HEAD(this.id),this.expected,raw);this.expected=raw;}}
 async lkg(id:string){const raw=await this.io.get(CAMPAIGN_DB,'v06-campaign-lkg::'+id);if(!raw)throw Error('Campaign06 LKG 없음');const c=parseCampaignBackup06(raw);if(c.game.id!==id)throw Error('Campaign06 LKG Profile 오류');return c;}
}
type Journal06={schema:1;release:'0.6.0';id:string;profileId:string;status:'prepared'|'committed'|'cancelled';entries:{db:string;key:string;before:string|null;after:string}[]};
function parseJournal(raw:string){const j=JSON.parse(raw) as Journal06;if(j.schema!==1||j.release!=='0.6.0'||!['prepared','committed','cancelled'].includes(j.status)||typeof j.id!=='string'||!Array.isArray(j.entries)||j.entries.length!==4)throw Error('지원하지 않는 v06 Restore Journal · 원본 보존');const targets=[{db:GAME_DB,key:'head'},{db:C2_DB,key:'head::'+j.profileId},{db:CAMPAIGN_DB,key:'head::'+j.profileId},{db:CAMPAIGN_DB,key:WORKSHOP_HEAD(j.profileId)}];for(let i=0;i<4;i++){const e=j.entries[i];if(e.db!==targets[i].db||e.key!==targets[i].key||(e.before!==null&&typeof e.before!=='string')||typeof e.after!=='string')throw Error('v06 Restore Journal Boundary 오류');}validateCampaign06({game:parseBackup(j.entries[0].after),chapter2:parseChapter2Backup(j.entries[1].after,j.profileId),chapter3:parseChapter3Backup(j.entries[2].after,j.profileId),chapter4:parseWorkshopBackup(j.entries[3].after,j.profileId)});return j;}
async function complete(io:SnapshotIO,j:Journal06,raw:string){const heads=await Promise.all(j.entries.map(e=>io.get(e.db,e.key)));if(heads.some((h,i)=>h!==j.entries[i].before&&h!==j.entries[i].after))throw Error('Campaign06 복원 중 Concurrent Write · 원본 보존 · Boot/Autosave 중단');for(const e of j.entries){if(await io.get(e.db,e.key)!==e.after)await io.cas(e.db,e.key,e.before,e.after);}await io.cas(CAMPAIGN_DB,JOURNAL06,raw,JSON.stringify({...j,status:'committed'}));}
export async function recoverCampaign06(io:SnapshotIO=new WorkshopSnapshotIO()){const raw=await io.get(CAMPAIGN_DB,JOURNAL06);if(raw===null)return;const j=parseJournal(raw);if(j.status==='prepared')await complete(io,j,raw);}
export async function cancelCampaign06(io:SnapshotIO=new WorkshopSnapshotIO()){const raw=await io.get(CAMPAIGN_DB,JOURNAL06);if(!raw)return;const j=parseJournal(raw);if(j.status==='prepared')await io.cas(CAMPAIGN_DB,JOURNAL06,raw,JSON.stringify({...j,status:'cancelled'}));}
export async function restoreCampaign06(c:Campaign06,io:SnapshotIO=new WorkshopSnapshotIO()){
 validateCampaign06(c);const old=await io.get(CAMPAIGN_DB,JOURNAL06);if(old&&parseJournal(old).status==='prepared')throw Error('진행 중인 v06 복원부터 복구하세요.');const targets=[{db:GAME_DB,key:'head',after:backupText(c.game)},{db:C2_DB,key:'head::'+c.game.id,after:chapter2Backup(c.chapter2)},{db:CAMPAIGN_DB,key:'head::'+c.game.id,after:chapter3Backup(c.chapter3)},{db:CAMPAIGN_DB,key:WORKSHOP_HEAD(c.game.id),after:workshopBackup(c.chapter4)}];const entries=await Promise.all(targets.map(async e=>({...e,before:await io.get(e.db,e.key)})));const j:Journal06={schema:1,release:'0.6.0',id:sha256(JSON.stringify(entries)),profileId:c.game.id,status:'prepared',entries},raw=JSON.stringify(j);await io.cas(CAMPAIGN_DB,JOURNAL06,old,raw);await complete(io,j,raw);
}
