/* Reproducible offline release packaging. No network or source/main mutation. */
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path'),crypto=require('node:crypto');
const base=path.resolve('release-v05'),source=path.join(base,'source'),handoff=path.join(base,'handoff');fs.rmSync(base,{recursive:true,force:true});fs.mkdirSync(source,{recursive:true});fs.mkdirSync(handoff,{recursive:true});
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const copy=(file,dest)=>{const to=path.join(dest,file);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(file,to);};
const tracked=cp.execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
for(const file of tracked)if(/^(src\/|tests\/|docs\/|evidence\/|scripts\/|\.github\/)/.test(file)||['README.md','build.cjs','package.json','package-lock.json','tsconfig.json','.gitignore'].includes(file))copy(file,source);
for(const file of ['optical-engine-tycoon-v0.2.html','ai-dc-tycoon-v0.3.html','ai-dc-tycoon-v0.4.html','ai-dc-tycoon-v0.5.html'])copy(file,source);
copy('ai-dc-tycoon-v0.5.html',handoff);
const guides=['START-HERE-v0.5.md','REGRESSION-v0.5.md','GAME-DESIGN-v0.5.md','MISSION-CATALOG-v0.5.md','TECHNOLOGY-TREE-v0.5.md','CPO-ARCHITECTURE-MODEL-v0.5.md','CPO-GAMEPLAY-ROADMAP-v0.5-to-v0.8.md'];
for(const name of guides){copy('docs/'+name,handoff);fs.copyFileSync('docs/'+name,name);}
for(const file of tracked.filter(f=>/^evidence\/v05(?:-baseline|-final-baseline)?\//.test(f)))copy(file,handoff);
const manifest={release:'0.5.0',branch:'feature/v0.5-cpo',gitCommit:process.env.GITHUB_SHA||'LOCAL_NOT_VERIFIED',stackedBase:'feature/v0.4-network-optics',v04BaselineCommit:'c12149e985b207c5df50357ff7eb62a299fb813d',models:{chapter3:'cpo-educational-1.0.0',chapter2:'chapter2-typed-path-2.0.0',legacyPackageVersion:'0.3.0 frozen core'},v05ExecutableSHA256:hash('ai-dc-tycoon-v0.5.html'),v04ExecutableSHA256:hash('ai-dc-tycoon-v0.4.html'),v03ExecutableSHA256:hash('ai-dc-tycoon-v0.3.html'),engineeringLabSHA256:hash('src/lab-baseline.html'),opticalStatus:'Unknown detailed optical loss; explicitly declared educational links Assumed-compatible',verification:'See evidence/v05 and REGRESSION-v0.5; physical Android/human usability NOT TESTED.',sourceSHA256:{}};
const scan=folder=>{for(const e of fs.readdirSync(folder,{withFileTypes:true})){const f=path.join(folder,e.name);if(e.isDirectory())scan(f);else manifest.sourceSHA256[path.relative(source,f).split(path.sep).join('/')]=hash(f);}};scan(source);
for(const dest of [source,handoff,'.'])fs.writeFileSync(path.join(dest,'RELEASE-MANIFEST-v0.5.json'),JSON.stringify(manifest,null,2)+'\n');
for(const [folder,name]of [[source,'source'],[handoff,'HANDOFF']]){const out=path.resolve('ai-dc-tycoon-v0.5-'+name+'.zip');fs.rmSync(out,{force:true});cp.execFileSync('zip',['-q','-r',out,'.'],{cwd:folder,timeout:30000});console.log('PACKAGED '+out);}
if(fs.existsSync('screenshots-v05')){const out=path.resolve('ai-dc-tycoon-v0.5-screenshots.zip');fs.rmSync(out,{force:true});cp.execFileSync('zip',['-q','-r',out,'screenshots-v05'],{timeout:30000});console.log('PACKAGED '+out);}
