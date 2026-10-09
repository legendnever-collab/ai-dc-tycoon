import {sha256} from './hash';
import {newChapter2,validateChapter2} from './chapter2';
import type {C2State} from './chapter2';
export const C2_DB='AIDataCenterTycoon-v04-Chapter2';
type Envelope={format:'AIDataCenterTycoon-Chapter2';schema:1;model:string;payload:C2State;sha256:string};
export function chapter2Backup(s:C2State){validateChapter2(s);
 return JSON.stringify({format:'AIDataCenterTycoon-Chapter2',schema:1,model:'chapter2-network-educational-1.0.0',
 payload:s,sha256:sha256(JSON.stringify(s))},null,2);
}
export function parseChapter2Backup(raw:string,profileId:string):C2State{
 if(raw.length>5_000_000)throw Error('Backup은 5MB를 초과할 수 없습니다.');
 const e=JSON.parse(raw) as Envelope;
 if(e.format!=='AIDataCenterTycoon-Chapter2'||e.schema!==1||e.model!=='chapter2-network-educational-1.0.0')
  throw Error('지원하지 않는 Chapter 2 Backup입니다. 기존 v0.3 Backup은 별도의 메뉴에서 복원하세요.');
 if(e.sha256!==sha256(JSON.stringify(e.payload)))throw Error('Chapter 2 Backup SHA256 불일치');
 validateChapter2(e.payload);
 if(e.payload.profileId!==profileId)throw Error('다른 게임 Profile의 Chapter 2 Backup입니다. 기존 v0.3 Profile Backup을 먼저 복원하세요.');
 return structuredClone(e.payload);
}
const read=<T>(r:IDBRequest<T>)=>new Promise<T>((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
export class Chapter2Store{
 private db:IDBDatabase|null=null;
 private expected:string|null=null;
 async open(){
  if(!globalThis.indexedDB)throw Error('IndexedDB 사용 불가. Chapter 2 Text Backup을 이용하세요.');
  this.db=await new Promise<IDBDatabase>((resolve,reject)=>{
   const r=indexedDB.open(C2_DB,1);
   r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('snapshots'))r.result.createObjectStore('snapshots');};
   r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
   r.onblocked=()=>reject(Error('다른 창에서 Chapter 2 Database를 사용하고 있습니다.'));
  });
 }
 async load(profileId:string):Promise<{state:C2State;warning:string}>{
  if(!this.db)throw Error('Chapter 2 DB 없음');
  const store=this.db.transaction('snapshots','readonly').objectStore('snapshots');
  const [head,lkg]=await Promise.all([read(store.get('head')),read(store.get('lkg'))]);
  this.expected=typeof head==='string'?head:null;
  if(head===undefined)return {state:newChapter2(profileId),warning:''};
  try{return {state:parseChapter2Backup(head,profileId),warning:''};}
  catch(e){
   const value=JSON.parse(head);
   if(value?.schema!==1||value?.model!=='chapter2-network-educational-1.0.0')throw Error('지원하지 않는 새 Schema 발견. 원본 데이터를 덮어쓰지 않습니다.');
   try{return {state:parseChapter2Backup(lkg,profileId),warning:'Chapter 2 손상 Head를 발견하여 LKG에서 복구했습니다.'};}
   catch{throw Error('Chapter 2 Head/LKG 손상. 원본 보존 후 Backup을 붙여넣어 주세요.');}
  }
 }
 async save(s:C2State){
  const content=chapter2Backup(s),db=this.db,expected=this.expected;
  if(!db)throw Error('Chapter 2 저장소가 열리지 않았습니다.');
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction('snapshots','readwrite'),store=tx.objectStore('snapshots');
   let error:Error|null=null;
   store.get('head').onsuccess=e=>{
    const old=(e.target as IDBRequest).result??null;
    if(old!==expected){error=Error('다른 탭에서 Chapter 2 진행도가 변경되었습니다. Backup 후 새로고침하세요.');tx.abort();return;}
    if(old){
     try{const envelope=JSON.parse(old);store.put(old,envelope?.sha256?'archive-'+envelope.sha256:'recovery-original');parseChapter2Backup(old,s.profileId);store.put(old,'lkg');}
     catch{store.put(old,'recovery-original');}
    }else store.put(content,'lkg');
    store.put(content,'head');
    store.put(content,'revision-'+s.revision);
   };
   tx.oncomplete=()=>resolve();
   tx.onabort=()=>reject(error||tx.error||Error('Chapter 2 저장 중단'));
   tx.onerror=()=>reject(error||tx.error||Error('Chapter 2 저장 실패'));
  });
  this.expected=content;
 }
 async restore(s:C2State){
  validateChapter2(s);
  if(!this.db)throw Error('Chapter 2 DB 없음');
  this.expected=await read(this.db.transaction('snapshots','readonly').objectStore('snapshots').get('head'))??null;
  await this.save(s);
 }
 async lkg(profileId:string){
  if(!this.db)throw Error('Chapter 2 DB 없음');
  return parseChapter2Backup(await read(this.db.transaction('snapshots','readonly').objectStore('snapshots').get('lkg')),profileId);
 }
}
