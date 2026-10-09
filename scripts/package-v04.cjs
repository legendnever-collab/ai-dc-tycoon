/* Release packaging is local to CI. No network, no writes to main. */
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),path=require('node:path');
const base=path.resolve('release-v04'),source=path.join(base,'source'),handoff=path.join(base,'handoff');
fs.mkdirSync(source,{recursive:true});fs.mkdirSync(handoff,{recursive:true});
const copy=(f,to)=>{const dest=path.join(to,f);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.cpSync(f,dest,{recursive:true});};
for(const file of ['src','tests','docs','evidence','.github','README.md','build.cjs','package.json','package-lock.json','tsconfig.json','.gitignore'])
 copy(file,source);
for(const file of ['ai-dc-tycoon-v0.4.html','ai-dc-tycoon-v0.3.html'])
 copy(file,handoff);
for(const file of ['START-HERE-v0.4.md','REGRESSION-v0.4.md','GAME-DESIGN-v0.4.md',
 'MISSION-CATALOG-v0.4.md','TECHNOLOGY-TREE-v0.4.md','NEXT-DEVELOPMENT-PLAN-v0.4.md'])
 copy('docs/'+file,handoff);
if(fs.existsSync('evidence/v04'))copy('evidence/v04',handoff);
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const manifest={release:'0.4.0',branch:'feature/v0.4-network-optics',
 gitCommit:process.env.GITHUB_SHA||'LOCAL_NOT_VERIFIED',
 v04ExecutableSHA256:hash('ai-dc-tycoon-v0.4.html'),
 v03ExecutableSHA256:hash('ai-dc-tycoon-v0.3.html'),
 engineeringLabSHA256:hash('src/lab-baseline.html'),
 chapter2Model:'chapter2-network-educational-1.0.0',
 v03Model:'ai-dc-educational-1.0.0',
 provenance:'Educational assumptions; not vendor hardware specifications',
 browserTests:'See GitHub Actions browser-v04 job; this build artifact alone does not assert that job passed.'
};
for(const folder of [source,handoff])fs.writeFileSync(path.join(folder,'RELEASE-MANIFEST-v0.4.json'),JSON.stringify(manifest,null,2)+'\n');
const out=path.resolve('.');
for(const [folder,name] of [[source,'ai-dc-tycoon-v0.4-source.zip'],[handoff,'ai-dc-tycoon-v0.4-HANDOFF.zip']]){
 const target=path.join(out,name);if(fs.existsSync(target))fs.unlinkSync(target);
 cp.execFileSync('zip',['-q','-r',target,'.'],{cwd:folder,timeout:30000,stdio:'inherit'});
 console.log('PACKAGED '+name+' '+fs.statSync(target).size+' bytes');
}
fs.copyFileSync('docs/START-HERE-v0.4.md','START-HERE-v0.4.md');
console.log('RELEASE SHA256 '+JSON.stringify(manifest));
