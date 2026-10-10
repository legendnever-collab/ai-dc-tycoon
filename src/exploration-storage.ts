import {sha256} from './hash';
import {newExploration,validateScenario,evaluatePractice} from './exploration-model';
import type {ExplorationState} from './exploration-model';
import {missionEntry} from './exploration-catalog';
export const EXPLORATION_DB='AIDataCenterTycoon-FreeExploration-v09';
export function validateExploration(s:ExplorationState){
 if(!s||s.schema!==1||!['navigator','mission'].includes(s.view)||!(s.selected===null||typeof s.selected==='string')||!s.sessions||typeof s.sessions!=='object'||Array.isArray(s.sessions)||Object.keys(s.sessions).length>18)throw Error('Free Exploration Schema 오류');
 if(s.selected!==null)missionEntry(s.selected);if(s.view==='mission'&&(s.selected===null||!s.sessions[s.selected]))throw Error('Practice 선택 Mission 없음');
 for(const [id,p]of Object.entries(s.sessions)){missionEntry(id);if(!p||p.scenario.mission!==id||!Number.isSafeInteger(p.attempts)||p.attempts<0)throw Error('Practice session 오류');validateScenario(p.scenario);
  if(p.result){const expected=evaluatePractice(p.scenario);if(JSON.stringify(expected)!==JSON.stringify(p.result)||p.attempts<1)throw Error('Practice Result numerical provenance 오류');}
  if(p.previous&&(p.previous.mission!==id||typeof p.previous.pass!=='boolean'||!Array.isArray(p.previous.objectives)||!/^[0-9a-f]{64}$/.test(p.previous.inputHash)))throw Error('Practice comparison 오류');
 }
}
export function explorationBackup(s:ExplorationState){validateExploration(s);return JSON.stringify({format:'AIDataCenterTycoon-FreeExploration',schema:1,release:'0.9.0',payload:s,sha256:sha256(JSON.stringify(s))});}
export function parseExploration(raw:string):ExplorationState{if(typeof raw!=='string'||raw.length>20_000_000)throw Error('Free Exploration Backup 크기 오류');const e=JSON.parse(raw);if(e.format!=='AIDataCenterTycoon-FreeExploration'||e.schema!==1||e.release!=='0.9.0')throw Error('지원하지 않는 Free Exploration Schema. 원본 보존.');if(e.sha256!==sha256(JSON.stringify(e.payload)))throw Error('Free Exploration SHA256 불일치');validateExploration(e.payload);return structuredClone(e.payload);}
const read=<T>(r:IDBRequest<T>)=>new Promise<T>((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
export class ExplorationStore{
 private db:IDBDatabase|null=null;private expected:string|null=null;private blocked=false;
 async open(){this.db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open(EXPLORATION_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('snapshots');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('다른 창의 Free Exploration 저장소를 닫아 주세요.'));});this.db.onversionchange=()=>{this.db?.close();this.blocked=true;};}
 async load(){if(!this.db)throw Error('Free Exploration DB 없음');const s=this.db.transaction('snapshots','readonly').objectStore('snapshots'),[head,lkg]=await Promise.all([read(s.get('head')),read(s.get('lkg'))]);this.expected=head??null;if(head===undefined)return {state:newExploration(),warning:''};try{return {state:parseExploration(head),warning:''};}catch{let e:any;try{e=JSON.parse(head);}catch{}if(e&&(e.format!=='AIDataCenterTycoon-FreeExploration'||e.schema!==1||e.release!=='0.9.0')){this.blocked=true;throw Error('새 Free Exploration Schema 발견. 자동 저장 중단 · 원본 보존.');}try{return {state:parseExploration(lkg),warning:'손상 Head를 Free Exploration LKG에서 복구했습니다. 원본은 다음 저장 시 보존됩니다.'};}catch{this.blocked=true;throw Error('Free Exploration Head / LKG 손상. 원본을 보존하고 Backup을 사용하세요.');}}}
 async save(state:ExplorationState){const raw=explorationBackup(state);if(!this.db||this.blocked)throw Error('Free Exploration 저장 중단 · Campaign 저장은 독립적입니다.');if(raw===this.expected)return;const expected=this.expected;await new Promise<void>((resolve,reject)=>{const tx=this.db!.transaction('snapshots','readwrite'),s=tx.objectStore('snapshots');let error:Error|null=null;s.get('head').onsuccess=e=>{const old=(e.target as IDBRequest).result??null;if(old!==expected){error=Error('다른 탭에서 Free Exploration이 변경되었습니다. Backup을 보존하고 새로고침하세요.');tx.abort();return;}if(old!==null){s.put(old,'immutable-original-'+sha256(old));try{parseExploration(old);s.put(old,'lkg');}catch{s.put(old,'recovery-original');s.put(raw,'lkg');}}else s.put(raw,'lkg');s.put(raw,'head');};tx.oncomplete=()=>resolve();tx.onabort=tx.onerror=()=>reject(error||tx.error||Error('Free Exploration 저장 실패'));});this.expected=raw;}
}
