const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const commit=process.env.GITHUB_SHA||process.env.CODEX_RELEASE_SOURCE_SHA;
if(!/^[0-9a-f]{40}$/.test(commit||''))throw Error('Published GitHub source SHA is required; do not use a synthetic local import commit.');
const base=path.resolve('release-v07'),source=path.join(base,'source'),handoff=path.join(base,'handoff');fs.rmSync(base,{recursive:true,force:true});for(const d of [source,handoff])fs.mkdirSync(d,{recursive:true});
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const copy=(f,d,name=f)=>{const out=path.join(d,name);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(f,out);};
const walk=(d,fn)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f,fn);else fn(f);}};
for(const dir of ['src','tests','docs','scripts','.github'])walk(dir,f=>copy(f,source));
for(const f of ['README.md','build.cjs','package.json','package-lock.json','tsconfig.json','.gitignore','optical-engine-tycoon-v0.2.html',...['0.3','0.4','0.5','0.6','0.7'].map(v=>'ai-dc-tycoon-v'+v+'.html')])copy(f,source);
copy('ai-dc-tycoon-v0.7.html',handoff);
const guides=['START-HERE','REGRESSION','GAME-DESIGN','MISSION-CATALOG','TECHNOLOGY-TREE','LEARNING-CONTENT','VISUAL-DESIGN-SYSTEM','PHOTONIC-SUBSTRATE-MODEL','NEXT-DEVELOPMENT-PLAN','ARCHITECTURE','KNOWN-ISSUES','BASELINE-AUDIT'].map(n=>n+'-v0.7.md');
for(const n of guides){copy('docs/'+n,handoff,n);fs.copyFileSync('docs/'+n,n);}
for(const dir of ['evidence/v07','evidence/v07-baseline'])if(fs.existsSync(dir))walk(dir,f=>{copy(f,source);copy(f,handoff);});
if(fs.existsSync('screenshots-v07'))walk('screenshots-v07',f=>copy(f,handoff));
const resultFiles=['browser-results.json','mobile-browser-results.json','storage-browser-results.json','legacy-browser-results.json'];
const browserEvidence=Object.fromEntries(resultFiles.filter(n=>fs.existsSync('evidence/v07/'+n)).map(n=>{const r=JSON.parse(fs.readFileSync('evidence/v07/'+n));return[n,{pass:r.cases.filter(c=>c.status==='PASS').length,fail:r.cases.filter(c=>c.status==='FAIL').length}];}));
const manifest={release:'0.7.0',branch:'feature/v0.7-photonic-substrate',sourceGitCommit:commit,baselineGitCommit:'02fd07ddf5ccb1c76d66f157abb4094aa893da7a',models:{substrate:'photonic-substrate-educational-1.0.0',workshop:'guided-oe-educational-1.0.0',core:'0.2.0',graph:'graph-compact-1.0.0'},schemas:{campaignEnvelope:3,substrate:1,workshop:1,restoreJournal:1},executableSHA256:hash('ai-dc-tycoon-v0.7.html'),legacyExecutableSHA256:Object.fromEntries(['0.3','0.4','0.5','0.6'].map(v=>[v,hash('ai-dc-tycoon-v'+v+'.html')])),engineeringLabSHA256:hash('src/lab-baseline.html'),evidenceClass:'Educational Assumption',qualification:'Analytical scalar model; not measurement verified',physicalAndroid:'NOT TESTED',humanUsability:'NOT TESTED',browserEvidence,sourceSHA256:{},screenshotSHA256:{}};
walk(source,f=>manifest.sourceSHA256[path.relative(source,f).split(path.sep).join('/')]=hash(f));if(fs.existsSync('screenshots-v07'))walk('screenshots-v07',f=>manifest.screenshotSHA256[f]=hash(f));
for(const d of [source,handoff,'.'])fs.writeFileSync(path.join(d,'RELEASE-MANIFEST-v0.7.json'),JSON.stringify(manifest,null,2)+'\n');
for(const [folder,name]of [[source,'source'],[handoff,'HANDOFF']]){const out=path.resolve('ai-dc-tycoon-v0.7-'+name+'.zip');fs.rmSync(out,{force:true});cp.execFileSync('zip',['-q','-r',out,'.'],{cwd:folder,timeout:30000});console.log('PACKAGED '+out);}
if(fs.existsSync('screenshots-v07')){const out=path.resolve('ai-dc-tycoon-v0.7-screenshots.zip');fs.rmSync(out,{force:true});cp.execFileSync('zip',['-q','-r',out,'screenshots-v07'],{timeout:30000});console.log('PACKAGED '+out);}
