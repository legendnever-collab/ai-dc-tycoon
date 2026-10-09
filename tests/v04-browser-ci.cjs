// CI timing adapter for the immutable v0.4 regression suite.
// Preserve every original scenario/assertion and its frozen source hash.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
async function legacyResult(p,id){
 const before=await game(p);assert.equal(before.currentMission,id);assert.equal(before.missions[id].phase,'ACTIVE');
 const attempts=before.missions[id].attempts,expected=await p.evaluate(()=>window.AIDCT.getForecast());
 await click(p,'#run-simulation');
 await p.waitForFunction(([id,attempts])=>{const g=window.AIDCT.getGame(),m=g.missions[id];return g.currentMission===id&&m.attempts===attempts+1&&['SIMULATING','RESULT','CLEARED'].includes(m.phase);},[id,attempts]);
 const terminal=async()=>{const g=await game(p),m=g.missions[id];return g.currentMission===id&&m.attempts===attempts+1&&['RESULT','CLEARED'].includes(m.phase)&&!!m.last;};
 if(!await terminal()){
  const button=p.locator('#skip-simulation');
  await p.waitForFunction(()=>{const g=window.AIDCT.getGame(),m=g.missions[g.currentMission],b=document.getElementById('skip-simulation');return ['RESULT','CLEARED'].includes(m.phase)||(m.phase==='SIMULATING'&&b&&!b.disabled);});
  if(!await terminal())try{await button.click();}catch(e){if(e.name!=='TimeoutError'||!await terminal())throw e;}
 }
 await p.waitForFunction(([id,attempts])=>{const g=window.AIDCT.getGame(),m=g.missions[id];return g.currentMission===id&&m.attempts===attempts+1&&['RESULT','CLEARED'].includes(m.phase)&&m.last&&document.getElementById('mission-result');},[id,attempts]);
 const result=(await game(p)).missions[id];
 assert.equal(result.phase,expected.evaluation.pass?'CLEARED':'RESULT');
 assert.deepEqual(result.last.simulation,expected.simulation);assert.deepEqual(result.last.evaluation,expected.evaluation);
 assert.ok((await p.locator('#mission-result').textContent()).includes(expected.evaluation.pass?'MISSION CLEAR':'목표 미달'));
}
const filename=path.join(__dirname,'v04-browser.cjs');
let source=fs.readFileSync(filename,'utf8');
const oldHelper="const legacyRun=async(p,id)=>{await click(p,'#run-simulation');await click(p,'#skip-simulation');assert.equal((await game(p)).missions[id].cleared,true);};\n";
const stableHelper='const legacyResult='+legacyResult.toString()+";\nconst legacyRun=async(p,id)=>{await legacyResult(p,id);assert.equal((await game(p)).missions[id].cleared,true);};\n";
assert.equal(source.split(oldHelper).length,2,'Frozen legacy helper changed; review CI adapter');
source=source.replace(oldHelper,stableHelper);
const failedRun="await click(p,'#run-simulation');await click(p,'#skip-simulation');assert.equal((await game(p)).missions['03'].phase,'RESULT');";
assert.equal(source.split(failedRun).length,2,'Frozen M03 failure scenario changed; review CI adapter');
source=source.replace(failedRun,"await legacyResult(p,'03');assert.equal((await game(p)).missions['03'].phase,'RESULT');");
module._compile(source,filename);
