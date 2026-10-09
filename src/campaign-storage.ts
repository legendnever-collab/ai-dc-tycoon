import {sha256} from './hash';
import {backupText,parseBackup,GAME_DB} from './game-storage';
import {chapter2Backup,parseChapter2Backup,C2_DB} from './chapter2-storage';
import {newChapter2,c2Wallet} from './chapter2';
import {newChapter3,validateChapter3} from './chapter3';
import {CPO_MODEL} from './cpo-schema';
import type {Game} from './game-schema';
import type {C2State} from './chapter2';
import type {C3State} from './cpo-schema';
export const CAMPAIGN_DB='AIDataCenterTycoon-v05-Campaign';
export type Campaign={game:Game;chapter2:C2State;chapter3:C3State};
type Envelope={format:'AIDataCenterTycoon-Chapter3';schema:1;model:string;payload:C3State;sha256:string};
export function chapter3Backup(s:C3State){validateChapter3(s);return JSON.stringify({format:'AIDataCenterTycoon-Chapter3',schema:1,model:CPO_MODEL,payload:s,sha256:sha256(JSON.stringify(s))},null,2);}
export function parseChapter3Backup(raw:string,profileId:string){if(typeof raw!=='string'||raw.length>5_000_000)throw Error('지원되지 않는 Chapter3 Backup 크기');const e=JSON.parse(raw) as Envelope;
 if(e.format!=='AIDataCenterTycoon-Chapter3'||e.schema!==1||e.model!==CPO_MODEL)throw Error('지원하지 않는 Chapter3 Schema / Model. 원본을 보존합니다.');
 if(e.sha256!==sha256(JSON.stringify(e.payload)))throw Error('Chapter3 SHA256 불일치');validateChapter3(e.payload);if(e.payload.profileId!==profileId)throw Error('Chapter3 Player Profile 불일치');return structuredClone(e.payload);
}
export function validateCampaign(c:Campaign){parseBackup(backupText(c.game));parseChapter2Backup(chapter2Backup(c.chapter2),c.game.id);parseChapter3Backup(chapter3Backup(c.chapter3),c.game.id);
 if((c.chapter2.cleared['04']||c.chapter2.current!=='04')&&!c.game.missions['03'].cleared)throw Error('Chapter1/2 Unlock 불일치');
 if((c.chapter3.current!=='07'||c.chapter3.phase!=='EVENT'||c.chapter3.receipts.length)&&!c.chapter2.cleared['06'])throw Error('Mission06 Clear 없이 Chapter3 Progress');
}
export function campaignBackup(c:Campaign){validateCampaign(c);const chapters={chapter1:backupText(c.game),chapter2:chapter2Backup(c.chapter2),chapter3:chapter3Backup(c.chapter3)};
 return JSON.stringify({format:'AIDataCenterTycoon-Campaign',schema:1,release:'0.5.0',profileId:c.game.id,chapters,sha256:sha256(JSON.stringify(chapters)),labBoundary:'Reference-only IDs included. Engineering Lab design data uses its existing independent backup.'},null,2);
}
export function parseCampaignBackup(raw:string,current?:Campaign):Campaign{
 if(typeof raw!=='string'||raw.length>15_000_000)throw Error('Campaign Backup은 15MB 이내여야 합니다.');const e=JSON.parse(raw);
 if(e.format==='AIDataCenterTycoon'){const game=parseBackup(raw);const same=current?.game.id===game.id;const bundle={game,chapter2:same?structuredClone(current!.chapter2):newChapter2(game.id),chapter3:same?structuredClone(current!.chapter3):newChapter3(game.id)};validateCampaign(bundle);return bundle;}
 if(e.format==='AIDataCenterTycoon-Chapter2'){if(!current)throw Error('Chapter1 Profile을 먼저 복원하세요.');const bundle={...structuredClone(current),chapter2:parseChapter2Backup(raw,current.game.id)};validateCampaign(bundle);return bundle;}
 if(e.format!=='AIDataCenterTycoon-Campaign'||e.schema!==1||e.release!=='0.5.0')throw Error('지원하지 않는 Campaign Schema / Version입니다. 원본을 보존하세요.');
 if(!e.chapters||e.sha256!==sha256(JSON.stringify(e.chapters)))throw Error('Campaign SHA256 불일치');const game=parseBackup(e.chapters.chapter1);
 if(game.id!==e.profileId)throw Error('Campaign Profile 불일치');const bundle={game,chapter2:parseChapter2Backup(e.chapters.chapter2,game.id),chapter3:parseChapter3Backup(e.chapters.chapter3,game.id)};validateCampaign(bundle);return bundle;
}
export interface SnapshotIO{get(db:string,key:string):Promise<string|null>;cas(db:string,key:string,expected:string|null,value:string|null):Promise<void>;}
const result=<T>(r:IDBRequest<T>)=>new Promise<T>((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
async function openDB(name:string){if(!globalThis.indexedDB)throw Error('IndexedDB 사용 불가. Campaign Text Backup을 이용하세요.');return new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('snapshots'))r.result.createObjectStore('snapshots');};r.onsuccess=()=>{r.result.onversionchange=()=>r.result.close();resolve(r.result);};r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('다른 창의 저장소를 닫아주세요.'));});}
function supported(db:string,key:string,raw:string){try{if(db===GAME_DB)parseBackup(raw);else if(db===C2_DB)parseChapter2Backup(raw,key.slice('head::'.length));else if(key.startsWith('campaign-head::')){if(parseCampaignBackup(raw).game.id!==key.slice(15))return false;}else parseChapter3Backup(raw,key.slice('head::'.length));return true;}catch{return false;}}
export class BrowserSnapshotIO implements SnapshotIO{
 async get(name:string,key:string){const db=await openDB(name);try{const value=await result(db.transaction('snapshots','readonly').objectStore('snapshots').get(key));if(value!==undefined&&value!==null&&typeof value!=='string')throw Error('저장된 Snapshot 형식 오류. 원본을 보존합니다.');return value??null;}finally{db.close();}}
 async cas(name:string,key:string,expected:string|null,value:string|null){const db=await openDB(name);try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('snapshots','readwrite'),s=tx.objectStore('snapshots');let error:Error|null=null;s.get(key).onsuccess=e=>{const old=(e.target as IDBRequest).result??null;if(old!==expected){error=Error('다른 탭에서 저장이 변경되었습니다. 현재 Backup을 보존하고 새로고침하세요.');tx.abort();return;}
  const isHead=key==='head'||key.startsWith('head::')||key.startsWith('campaign-head::'),lkg=key==='head'?'lkg':key.startsWith('campaign-head::')?'campaign-lkg::'+key.slice(15):'lkg::'+key.slice(6);
  if(old!==null&&old!==value){s.put(old,'immutable-original::'+key+'::'+sha256(old));if(isHead){if(supported(name,key,old))s.put(old,lkg);else{s.put(old,key==='head'?'recovery-original':'recovery-original::'+key);if(value&&supported(name,key,value))s.put(value,lkg);}}}
  if(old===null&&value&&isHead)s.put(value,lkg);
  if(value===null)s.delete(key);else s.put(value,key);
 };tx.oncomplete=()=>resolve();tx.onabort=()=>reject(error||tx.error||Error('Snapshot 저장 중단'));tx.onerror=()=>reject(error||tx.error||Error('Snapshot 저장 실패'));});}finally{db.close();}}
}
export class Chapter3Store{
 private expected:string|null=null;private profileId:string|null=null;private blocked=false;
 constructor(private io:SnapshotIO=new BrowserSnapshotIO()){}
 async load(profileId:string){this.profileId=profileId;this.blocked=false;const head=await this.io.get(CAMPAIGN_DB,'head::'+profileId);this.expected=head;if(head===null)return {state:newChapter3(profileId),warning:''};
  try{return {state:parseChapter3Backup(head,profileId),warning:''};}catch{let e:any;try{e=JSON.parse(head);}catch{}if(e&&(e.schema!==1||e.model!==CPO_MODEL||e.format!=='AIDataCenterTycoon-Chapter3')){this.blocked=true;throw Error('새로운 Chapter3 Schema 발견. 자동 저장을 중단하고 원본을 보존합니다.');}
   try{return {state:parseChapter3Backup((await this.io.get(CAMPAIGN_DB,'lkg::'+profileId))!,profileId),warning:'Chapter3 손상 Head를 LKG에서 복구했습니다. 다음 저장 시 원본을 보존합니다.'};}catch{this.blocked=true;throw Error('Chapter3 Head/LKG 손상. 원본을 보존하고 Campaign Backup을 붙여넣으세요.');}}
 }
 async save(s:C3State){if(this.blocked||this.profileId!==s.profileId)throw Error('Chapter3 저장 중단 / 다른 Profile입니다.');const raw=chapter3Backup(s);await this.io.cas(CAMPAIGN_DB,'head::'+s.profileId,this.expected,raw);this.expected=raw;}
 async lkg(profileId:string){return parseChapter3Backup((await this.io.get(CAMPAIGN_DB,'lkg::'+profileId))!,profileId);}
}
export class CampaignCheckpointStore{
 private profileId:string|null=null;private expected:string|null=null;private blocked=false;
 constructor(private io:SnapshotIO=new BrowserSnapshotIO()){}
 async load(profileId:string){this.profileId=profileId;this.expected=await this.io.get(CAMPAIGN_DB,'campaign-head::'+profileId);this.blocked=false;if(this.expected!==null)try{if(parseCampaignBackup(this.expected).game.id!==profileId)throw Error('Campaign Profile 불일치');}catch{this.blocked=true;throw Error('Campaign Snapshot 손상 / 새 Version. 원본을 보존하고 자동 Snapshot을 중단합니다.');}}
 async save(c:Campaign){if(this.profileId!==c.game.id||this.blocked)throw Error('Campaign Snapshot 저장 중단 / Profile 불일치');const raw=campaignBackup(c);if(raw===this.expected)return;await this.io.cas(CAMPAIGN_DB,'campaign-head::'+c.game.id,this.expected,raw);this.expected=raw;}
 async lkg(profileId:string){const raw=await this.io.get(CAMPAIGN_DB,'campaign-lkg::'+profileId);if(raw===null)throw Error('아직 Campaign LKG가 없습니다.');const campaign=parseCampaignBackup(raw);if(campaign.game.id!==profileId)throw Error('Campaign LKG Profile 불일치');return campaign;}
}
export type RestoreJournal={schema:1;id:string;status:'prepared'|'committed'|'cancelled';profileId:string;entries:{db:string;key:string;before:string|null;after:string}[]};
const JOURNAL_KEY='campaign-restore-journal';
function parseJournal(raw:string){const j=JSON.parse(raw) as RestoreJournal;if(j.schema!==1||!['prepared','committed','cancelled'].includes(j.status)||typeof j.id!=='string'||!Array.isArray(j.entries)||j.entries.length!==3)throw Error('지원하지 않는 Restore Journal. 원본 보존 후 확인하세요.');
 const keys=[{db:GAME_DB,key:'head'},{db:C2_DB,key:'head::'+j.profileId},{db:CAMPAIGN_DB,key:'head::'+j.profileId}];for(let i=0;i<3;i++){const e=j.entries[i];if(e.db!==keys[i].db||e.key!==keys[i].key||(e.before!==null&&typeof e.before!=='string')||typeof e.after!=='string')throw Error('Restore Journal Boundary 오류');}
 validateCampaign({game:parseBackup(j.entries[0].after),chapter2:parseChapter2Backup(j.entries[1].after,j.profileId),chapter3:parseChapter3Backup(j.entries[2].after,j.profileId)});return j;
}
async function completeJournal(io:SnapshotIO,j:RestoreJournal,raw:string){
 const values=await Promise.all(j.entries.map(e=>io.get(e.db,e.key)));
 if(values.some((v,i)=>v!==j.entries[i].before&&v!==j.entries[i].after))return {blocked:true,message:'Campaign 복원 중 다른 탭의 저장 변경을 발견했습니다. 모든 원본을 보존하고 자동 덮어쓰기를 중단했습니다.'};
 for(const e of j.entries){const actual=await io.get(e.db,e.key);if(actual===e.after)continue;await io.cas(e.db,e.key,e.before,e.after);}
 const committed={...j,status:'committed' as const};await io.cas(CAMPAIGN_DB,JOURNAL_KEY,raw,JSON.stringify(committed));return {blocked:false,message:'Campaign 복원 완료'};
}
export async function recoverCampaignRestore(io:SnapshotIO=new BrowserSnapshotIO()){
 const raw=await io.get(CAMPAIGN_DB,JOURNAL_KEY);if(raw===null)return {blocked:false,message:''};const j=parseJournal(raw);if(j.status!=='prepared')return {blocked:false,message:''};return completeJournal(io,j,raw);
}
export async function cancelCampaignRestore(io:SnapshotIO=new BrowserSnapshotIO()){
 const raw=await io.get(CAMPAIGN_DB,JOURNAL_KEY);if(!raw)return;const j=parseJournal(raw);if(j.status==='prepared')await io.cas(CAMPAIGN_DB,JOURNAL_KEY,raw,JSON.stringify({...j,status:'cancelled'}));
}
export async function restoreCampaign(c:Campaign,io:SnapshotIO=new BrowserSnapshotIO()){
 validateCampaign(c);const old=await io.get(CAMPAIGN_DB,JOURNAL_KEY);if(old&&parseJournal(old).status==='prepared')throw Error('진행 중인 Campaign 복원이 있습니다. 새로고침하여 먼저 복구하세요.');
 const targets=[{db:GAME_DB,key:'head',after:backupText(c.game)},{db:C2_DB,key:'head::'+c.game.id,after:chapter2Backup(c.chapter2)},{db:CAMPAIGN_DB,key:'head::'+c.game.id,after:chapter3Backup(c.chapter3)}];
 const entries=await Promise.all(targets.map(async e=>({...e,before:await io.get(e.db,e.key)})));
 const journal:RestoreJournal={schema:1,id:sha256(JSON.stringify(entries)),status:'prepared',profileId:c.game.id,entries},raw=JSON.stringify(journal);
 await io.cas(CAMPAIGN_DB,JOURNAL_KEY,old,raw);const result=await completeJournal(io,journal,raw);if(result.blocked)throw Error(result.message);return result;
}
