/* v0.4 entry: the unchanged v0.3 game-app executes first and owns Chapter 1 + Engineering Lab. */
import './game-app';
import {newChapter2,simulateChapter2,transitionChapter2,c2Wallet,c2XP,c2Cost,C2_IDS,C2_REWARDS,C2_ASSUMPTIONS} from './chapter2';
import {Chapter2Store,chapter2Backup,parseChapter2Backup} from './chapter2-storage';
import type {C2State,C2Id,C2Action,C2Outcome,End} from './chapter2';
import './chapter2-style.css';
const el=(id:string)=>document.getElementById(id) as HTMLElement;
const ehtml=(v:unknown)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const round=(n:number|null)=>n===null?'—':Number.isInteger(n)?String(n):n.toFixed(1);
const old=()=>((window as any).AIDCT.getGame() as {id:string;credits:number;xp:number;missions:Record<string,{cleared:boolean}>});
const store=new Chapter2Store();
let chapter:C2State=newChapter2('pending'),mounted=false,ready=false,view=false,saveQueue=Promise.resolve(),storeAvailable=false;
let baseline:C2Outcome|null=null,lastError='',saveMessage='저장 상태 확인 중';
const content={
 '04':{title:'Switch Port Crisis',event:'추가 Compute Rack 두 대가 도착했습니다. 그러나 Switch에 더 이상 사용할 Port가 없어 Network 작업에 참여할 수 없습니다.',objective:'Rack 4대 연결 · 50초 이내 완료 · 200 Credits 이내 투자',lesson:'Port Count와 Switch Fabric Capacity는 다른 제한입니다. 연결되지 않은 Rack은 분산 작업에 참여하지 못합니다.'},
 '05':{title:'Build the Scale-out Fabric',event:'두 개의 Compute Group이 동작하지만 Group 간 경로가 없습니다. Spine Switch와 양쪽 Uplink를 만들어 병목을 해결하세요.',objective:'Leaf–Spine Path 확보 · Bottleneck 200 Gb/s · 45초 내',lesson:'두 Link를 더해 유효 대역폭을 계산하지 않습니다. 트래픽이 지나는 경로의 가장 느린 Link가 병목이 됩니다.'},
 '06':{title:'The Optical Upgrade',event:'Switch의 Electrical Port만으로는 Rack 간 대용량 신호를 전달할 수 없습니다. 양쪽 Port에 호환 가능한 Optical Module을 장착하고 Fiber로 연결하세요.',objective:'800G Pluggable · Effective ≥ 600 Gb/s · Power ≤ 70W · 45초 내',lesson:'Host Electrical Port와 Pluggable Optical Module은 구별됩니다. 400G/800G는 명목상 속도이며 실제 유효 대역폭에는 Overhead가 존재합니다.'}
} as const;
function showStatus(message:string){saveMessage=message;el('c2-status').textContent=message;}
function canEnter(){try{return old().missions['03'].cleared;}catch{return false;}}
function updateGate(){
 const unlocked=canEnter(),button=el('chapter2-enter') as HTMLButtonElement;
 button.disabled=!ready||!unlocked;
 el('chapter2-gate').textContent=!unlocked?'Mission 03을 완료하면 Mission 04가 해금됩니다.':chapter.cleared['06']?'CHAPTER 02 CLEAR · CPO Research Preview 해금':chapter.cleared['05']?'Mission 06 · 400G / 800G Optical Upgrade':chapter.cleared['04']?'Mission 05 · Leaf–Spine Fabric':'Mission 04 · Switch Port Crisis';
}
function enter(){if(!canEnter()){alert('Mission 03을 먼저 완료하세요.');return;}
 view=true;
 el('chapter2-screen').hidden=false;
 for(const sel of ['.world-layout','#metrics','#analysis','#mission-strip','#chapter2-nav'])document.querySelectorAll('#world-screen '+sel).forEach(item=>(item as HTMLElement).hidden=true);
 render();
 el('chapter2-screen').scrollIntoView({block:'start'});
}
function back(){view=false;el('chapter2-screen').hidden=true;
 for(const sel of ['.world-layout','#metrics','#analysis','#mission-strip','#chapter2-nav'])document.querySelectorAll('#world-screen '+sel).forEach(item=>(item as HTMLElement).hidden=false);
 updateGate();
}
function svgText(x:number,y:number,label:string,extra=''){return '<text x="'+x+'" y="'+y+'" fill="#d4e6f4" font-size="14" text-anchor="middle" '+extra+'>'+ehtml(label)+'</text>';}
function box(x:number,y:number,w:number,h:number,text:string,sub:string,stroke:string){
 return '<g><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="#1b354c" stroke="'+stroke+'" stroke-width="2"/>'+svgText(x+w/2,y+25,text)+svgText(x+w/2,y+48,sub,'font-size="11"')+'</g>';
}
function connection(x1:number,y1:number,x2:number,y2:number,active:boolean,slow=false){
 return '<path d="M'+x1+','+y1+' L'+x2+','+y2+'" class="c2-path '+(active?'active':'')+' '+(slow?'slow':'')+'" />';
}
function drawMap(s:C2State,r:C2Outcome):string{
 const c=s.config;
 let parts='';
 if(s.current==='04'){
  const positions=[[80,65],[80,205],[500,65],[500,205]];
  for(let i=0;i<4;i++){
   const rack='rack-00'+(i+1),active=c.connected.includes(rack);
   const x=positions[i][0],y=positions[i][1];
   parts+=connection(x<300?x+125:x,y+31,x<300?295:415,170,active);
   parts+=box(x,y,125,62,'GPU RACK '+(i+1),active?'CONNECTED':'PORT NEEDED',active?'#73e5c3':'#c69155');
  }
  parts+=box(295,128,120,85,c.highDensity?'HD SWITCH':'T2 SWITCH',r.occupiedPorts+'/'+(r.occupiedPorts+r.availablePorts)+' PORTS',c.highDensity?'#7fe4d3':'#a898e5');
 }else if(s.current==='05'){
  parts+=connection(192,164,294,164,c.spine&&c.uplinks.A>0,c.uplinks.A===100);
  parts+=connection(406,164,508,164,c.spine&&c.uplinks.B>0,c.uplinks.B===100);
  parts+=box(50,125,142,78,'LEAF A','UPLINK '+c.uplinks.A+'G','#8bc9d7');
  parts+=box(294,125,112,78,c.spine?'SPINE':'EMPTY SLOT',c.spine?'INSTALLED':'MISSING',c.spine?'#89e0c8':'#c79354');
  parts+=box(508,125,142,78,'LEAF B','UPLINK '+c.uplinks.B+'G','#8bc9d7');
  parts+=svgText(350,78,'TRAFFIC: LEAF A → SPINE → LEAF B');
  parts+=svgText(350,270,'PATH BOTTLENECK = '+r.pathGbps+' Gb/s');
 }else{
  const active=r.activeLinks===1;
  parts+=connection(238,165,465,165,active);
  parts+=box(45,119,193,92,'SWITCH A / 800G PORT',c.modules.A?c.modules.A+'G MODULE INSTALLED':'MODULE EMPTY',c.selectedPort==='A'?'#92efe2':'#829bbd');
  parts+=box(465,119,193,92,'SWITCH B / 800G PORT',c.modules.B?c.modules.B+'G MODULE INSTALLED':'MODULE EMPTY',c.selectedPort==='B'?'#92efe2':'#829bbd');
  parts+=svgText(350,115,c.fiber?'FIBER LINK · '+(active?'ACTIVE':'INCOMPATIBLE'):'FIBER NOT CONNECTED');
  parts+=svgText(350,240,active?'EFFECTIVE '+r.effectiveGbps+' Gb/s':'TWO COMPATIBLE MODULES + FIBER REQUIRED');
 }
 return '<svg viewBox="0 0 705 335" role="img" aria-label="Chapter 2 Network topology, active links are illuminated">'+parts+'</svg>';
}
function button(label:string,command:string,disabled=false,css='',extra=''){
 return '<button data-c2="'+command+'" '+(disabled?'disabled':'')+' class="'+css+'" '+extra+'>'+label+'</button>';
}
function actionButtons(s:C2State):string{
 const c=s.config,m=s.current;
 if(!s.active){
  const next=m==='04'?'05':m==='05'?'06':null;
  return button(s.cleared[m]?'Replay Mission '+m:'Start Mission '+m,'start',false,'primary','data-mission="'+m+'"')+
   (next&&s.cleared[m]?button('NEXT · Mission '+next,'start',false,'primary','data-mission="'+next+'"'):'');
 }
 if(m==='04')return button(c.highDensity?'✓ HD Switch Installed':'Install HD Switch · 150 Credits','hd',c.highDensity||c2Wallet(s,old().credits)<150,c.highDensity?'selected':'')+
  button('Link Rack 3','rack',c.connected.includes('rack-003')||c.connected.length>=(c.highDensity?4:2),'','data-rack="rack-003"')+
  button('Link Rack 4','rack',c.connected.includes('rack-004')||c.connected.length>=(c.highDensity?4:2),'','data-rack="rack-004"')+
  button('Run Network Simulation','run',false,'primary')+button('Refund / Reset','reset');
 if(m==='05')return button(c.spine?'✓ Spine Installed':'Install Spine · 110 Credits','spine',c.spine||c2Wallet(s,old().credits)<110,c.spine?'selected':'')+
  (['A','B'] as End[]).map(end=>button('Leaf '+end+' → Spine: 100G','uplink',!c.spine||c.uplinks[end]===100,'','data-end="'+end+'" data-rate="100"')+
   button('Leaf '+end+' → Spine: 200G','uplink',!c.spine||c.uplinks[end]===200,'','data-end="'+end+'" data-rate="200"')).join('')+
  button('Run Fabric Simulation','run',false,'primary')+button('Refund / Reset','reset');
 return button('Select Switch Port A','port',false,c.selectedPort==='A'?'selected':'','data-end="A"')+
 button('Select Switch Port B','port',false,c.selectedPort==='B'?'selected':'','data-end="B"')+
 (c.selectedPort?button('Insert 400G Module','module',false,'','data-end="'+c.selectedPort+'" data-rate="400"')+
   button('Insert 800G Module','module',false,'','data-end="'+c.selectedPort+'" data-rate="800"'):'')+
 button('Connect Compatible Fiber','fiber',!c.modules.A||!c.modules.B||c.modules.A!==c.modules.B)+
 button('Run Optical Simulation','run',false,'primary')+button('Refund / Reset','reset');
}
function drawResult(r:C2Outcome,cleared:boolean):string{
 let output='<div class="c2-result '+(r.pass?'':'failed')+'"><h3>'+(r.pass?'★'.repeat(r.stars)+' · MISSION CLEAR':'목표 미달 · Network를 점검하세요')+'</h3>';
 output+='<p class="c2-muted">Effective '+r.effectiveGbps+' Gb/s · Time '+round(r.completionSeconds)+'s · '+r.bottleneck+' bottleneck</p>';
 output+='<ul class="c2-checks">'+r.objectives.map(x=>'<li><span class="'+(x.pass?'ok':'bad')+'">'+(x.pass?'✓':'✗')+' '+ehtml(x.label)+'</span><b>'+ehtml(x.actual)+'</b></li>').join('')+'</ul>';
 output+='<p class="c2-muted">'+ehtml(r.hint)+'</p>';
 if(r.pass)output+='<p><strong>Rewards: +'+C2_REWARDS[r.mission].xp+' XP / +'+C2_REWARDS[r.mission].credits+' Credits</strong> · 최초 1회 지급</p>';
 else output+='<p>장비를 점검하고 다시 시도할 수 있습니다. Reset 시 해당 Mission 구매 비용이 환급됩니다.</p>';
 return output+'</div>';
}
function render(){
 if(!ready)return;
 updateGate();
 const s=chapter,m=s.current,c=s.config,r=simulateChapter2(s);
 if(!view)return;
 el('c2-missions').innerHTML=C2_IDS.map(id=>{
  const locked=id==='05'&&!s.cleared['04']||id==='06'&&!s.cleared['05'];
  const small=locked?'LOCKED · 이전 미션 완료':s.cleared[id]?'CLEARED · '+'★'.repeat(s.bestStars[id]):id===m?'CURRENT MISSION':'AVAILABLE';
  return button('<strong>MISSION '+id+'</strong><small>'+ehtml(content[id].title)+' · '+small+'</small>','start',locked||s.active,id===m?'current':'','data-mission="'+id+'"');
 }).join('');
 el('c2-map').innerHTML=drawMap(s,r);
 el('c2-story').innerHTML='<span class="eyebrow">MISSION '+m+' · '+(s.active?'BUILD & SIMULATE':s.last?'RESULT':'EVENT')+'</span><h3>'+ehtml(content[m].title)+'</h3><p>'+ehtml(content[m].event)+'</p><div class="c2-objective"><strong>HARD OBJECTIVES</strong><p>'+ehtml(content[m].objective)+'</p></div><p class="c2-muted">'+ehtml(content[m].lesson)+'</p>';
 el('c2-actions').innerHTML=actionButtons(s);
 el('c2-feedback').innerHTML=s.last&&s.last.mission===m?drawResult(s.last,s.cleared[m]):'<div class="c2-muted">진단 → 장비 설치 → 연결 → Simulation 실행. 진행과 비용은 자동 저장됩니다.</div>';
 const cs=c2Wallet(s,old().credits);
 el('c2-metrics').innerHTML=[
  ['EFFECTIVE LINK',r.effectiveGbps+' Gb/s'],
  ['WORKLOAD TIME',round(r.completionSeconds)+' s'],
  ['COMPUTE TIME',round(r.computeSeconds)+' s'],
  ['NETWORK TIME',round(r.networkSeconds)+' s'],
  ['ACTIVE LINK',r.activeLinks+''],
  ['AVAILABLE CREDITS',cs+'']
 ].map(([label,value])=>'<div><small>'+label+'</small><b>'+value+'</b></div>').join('');
 const diff=baseline?.mission===m&&baseline.completionSeconds!==null&&r.completionSeconds!==null?r.completionSeconds-baseline.completionSeconds:null;
 el('c2-kpi').innerHTML='<strong>Before / After · KPI & Model</strong><p>Network path '+r.pathGbps+' Gb/s · Compute '+round(r.computeSeconds)+'s · Network '+round(r.networkSeconds)+'s · Bottleneck '+r.bottleneck+
  ' · Delta '+(diff===null?'—':(diff>0?'+':'')+round(diff)+'s')+'</p>'+
  '<p>Game Power '+r.watts+' W · Mission Cost '+r.costCredits+' Credits · Chapter 2 XP +'+c2XP(s)+' · Chapter 2 Installed Cost '+c2Cost(c)+' Credits</p>'+
  '<p><b>Evidence:</b> '+C2_ASSUMPTIONS.evidence+' · All traffic paths, efficiency, prices and powers in this chapter are synthetic teaching assumptions. No vendor specification inferred.</p>';
 el('c2-powerwall').innerHTML=s.cleared['06']&&m==='06'?'<div class="c2-powerwall"><strong>Your Network Is Growing — But Power Is Becoming the Limit.</strong><p>800G Pluggables resolved this Link bottleneck. Scaling Switch capacity next raises aggregate module power, front-panel density and maintenance trade-offs. What if Optical Engines move closer to the ASIC?</p><p><b>COMING NEXT · CPO Research Preview</b> — CPO may shorten high-speed electrical paths and change optical packaging. CPO performance and system energy savings are NOT calculated in v0.4.</p></div>':'';
 el('c2-status').textContent=saveMessage;
}
function save(){
 if(!storeAvailable){showStatus('자동 저장 불가 · Text Backup 필요');return;}
 const snapshot=structuredClone(chapter);
 showStatus('Autosave 중…');
 saveQueue=saveQueue.then(()=>store.save(snapshot)).then(()=>showStatus('Autosave 완료')).catch(e=>{lastError=(e as Error).message;showStatus('저장 실패 · Backup 필요');el('c2-backup-notice').textContent=lastError;});
}
function action(cmd:C2Action){
 try{
  if(!ready||!canEnter())throw Error('Chapter 2 잠금 상태입니다.');
  if(chapter.profileId!==old().id)throw Error('v0.3 Profile 변경을 감지했습니다. 안전을 위해 화면을 다시 열어 주세요.');
  baseline=simulateChapter2(chapter);
  const prior=chapter;
  chapter=transitionChapter2(chapter,cmd,old().credits);
  lastError='';
  render();
  save();
  if(cmd.type==='run'&&chapter.last&&!chapter.last.pass){
   el('c2-status').textContent='Bottleneck detected · '+chapter.last.bottleneck;
  }
 }catch(e){lastError=(e as Error).message;el('c2-status').textContent=lastError;el('c2-backup-notice').textContent=lastError;}
}
document.addEventListener('click',async ev=>{
 const target=(ev.target as Element).closest('button') as HTMLButtonElement|null;
 if(!target)return;
 const id=target.id;
 if(id==='chapter2-enter'){enter();return;}
 if(id==='c2-back'){back();return;}
 if(target.dataset.c2){
  const type=target.dataset.c2,mission=target.dataset.mission as C2Id;
  const end=target.dataset.end as End,rate=Number(target.dataset.rate);
  if(type==='start')action({type:'start',mission});
  if(type==='hd')action({type:'install-hd'});
  if(type==='rack')action({type:'connect-rack',rack:target.dataset.rack!});
  if(type==='spine')action({type:'install-spine'});
  if(type==='uplink')action({type:'uplink',end,rate:rate as 0|100|200});
  if(type==='port')action({type:'select-port',end});
  if(type==='module')action({type:'module',end,rate:rate as 0|400|800});
  if(type==='fiber')action({type:'fiber'});
  if(type==='run')action({type:'run'});
  if(type==='reset')action({type:'reset'});
  return;
 }
 if(id==='c2-backup-create'){(el('c2-backup-text') as HTMLTextAreaElement).value=chapter2Backup(chapter);el('c2-backup-notice').textContent='Text Backup 생성 완료';}
 if(id==='c2-backup-copy'){const a=el('c2-backup-text') as HTMLTextAreaElement;if(!a.value)a.value=chapter2Backup(chapter);
  try{await navigator.clipboard.writeText(a.value);el('c2-backup-notice').textContent='클립보드에 복사했습니다.';}
  catch{a.select();el('c2-backup-notice').textContent='전체 선택 완료 · 복사 명령을 실행하세요.';}
 }
 if(id==='c2-backup-restore')try{
  const parsed=parseChapter2Backup((el('c2-backup-text') as HTMLTextAreaElement).value,old().id);
  await saveQueue;
  if(storeAvailable)await store.restore(parsed);
  chapter=parsed;baseline=null;showStatus(storeAvailable?'Chapter 2 Backup 복원 완료':'Memory 복원 · Autosave 불가');
  render();el('c2-backup-notice').textContent='Chapter 2 복원 성공. v0.3 및 Engineering Lab 데이터는 변경하지 않았습니다.';
 }catch(e){el('c2-backup-notice').textContent=(e as Error).message;}
 if(id==='c2-lkg')try{
  await saveQueue;chapter=await store.lkg(old().id);
  await store.restore(chapter);baseline=null;render();el('c2-backup-notice').textContent='Chapter 2 LKG 복원 성공';
 }catch(e){el('c2-backup-notice').textContent=(e as Error).message;}
});
(window as any).AIDCT_V04={
 version:'0.4.0',model:C2_ASSUMPTIONS.model,chapter:()=>structuredClone(chapter),
 simulate:()=>simulateChapter2(chapter),whenSaved:()=>saveQueue,backup:()=>chapter2Backup(chapter),
 action:(command:C2Action)=>action(command),getLegacy:()=>old()
};
(async()=>{
 try{
  for(let i=0;i<100&&(el('save-status').textContent.includes('확인 중')||!(window as any).AIDCT);i++)
   await new Promise(resolve=>setTimeout(resolve,80));
  const legacy=old();chapter=newChapter2(legacy.id);
  await store.open();storeAvailable=true;
  const loaded=await store.load(legacy.id);chapter=loaded.state;
  if(loaded.warning){showStatus(loaded.warning);}
  else showStatus('Chapter 2 Autosave 준비 완료');
 }catch(e){showStatus('저장소 제한 · Text Backup 필요');lastError=(e as Error).message;}
 ready=true;render();
 const strip=el('mission-strip');
 new MutationObserver(()=>{updateGate();if(view)render();}).observe(strip,{childList:true,subtree:true});
})();
