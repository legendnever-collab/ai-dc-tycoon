const fs=require('fs'),cp=require('child_process'),esbuild=require('esbuild'),crypto=require('crypto');
const lab=fs.readFileSync('src/lab-baseline.html');if(crypto.createHash('sha256').update(lab).digest('hex')!=='cf7cf6df5d83cc3927d3fb5cef2a320aa507c5c58a6e5d264cedc5c9d5c7947a')throw Error('Authoritative v0.2 executable changed');
cp.execFileSync(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.json'],{stdio:'inherit'});
const js=esbuild.buildSync({entryPoints:['src/game-app.ts'],bundle:true,write:false,format:'iife',target:'es2020',minify:true,legalComments:'inline',loader:{'.html':'text'}}).outputFiles[0].text;
const html=fs.readFileSync('src/game-shell.html','utf8').replace('/* STYLES */',fs.readFileSync('src/game-style.css','utf8')).replace('/* SCRIPT */',()=>js.replace(/<\/script/gi,'<\\/script'));
fs.mkdirSync('../output-v03',{recursive:true});for(const path of ['../output-v03/ai-dc-tycoon-v0.3.html','ai-dc-tycoon-v0.3.html'])fs.writeFileSync(path,html);console.log('Built v0.3.0 offline: '+Buffer.byteLength(html)+' bytes; exact v0.2 Lab preserved');

/* v0.4 additive distribution: never overwrite the v0.3 baseline executable. */
const v04=esbuild.buildSync({entryPoints:['src/chapter2-app.ts'],bundle:true,write:false,format:'iife',target:'es2020',minify:true,legalComments:'inline',loader:{'.html':'text'}}).outputFiles;
const js04=v04[0];if(!js04||!js04.text)throw Error('v0.4 JavaScript was not emitted');
const html04=fs.readFileSync('src/game-shell-v04.html','utf8')
 .replace('/* STYLES */',fs.readFileSync('src/game-style.css','utf8')+'\n'+fs.readFileSync('src/chapter2-style.css','utf8'))
 .replace('/* SCRIPT */',()=>js04.text.replace(new RegExp('</script','gi'),'<\\/script'));
fs.mkdirSync('../output-v04',{recursive:true});
for(const path of ['../output-v04/ai-dc-tycoon-v0.4.html','ai-dc-tycoon-v0.4.html'])fs.writeFileSync(path,html04);
console.log('Built v0.4.0 Chapter 2 offline: '+Buffer.byteLength(html04)+' bytes; v0.3 executable retained');
/* v0.5 wrapper preserves both earlier executable distributions and the Lab. */
const js05=esbuild.buildSync({entryPoints:['src/campaign-entry.ts'],bundle:true,write:false,format:'iife',target:'es2020',minify:true,legalComments:'inline',loader:{'.html':'text'}}).outputFiles[0].text;
const html05=fs.readFileSync('src/game-shell-v05.html','utf8').replace('/* STYLES */',['game-style','chapter2-style','chapter3-style'].map(n=>fs.readFileSync('src/'+n+'.css','utf8')).join('\n')).replace('/* SCRIPT */',()=>js05.replace(/<\/script/gi,'<\\/script'));
fs.mkdirSync('../output-v05',{recursive:true});for(const path of ['../output-v05/ai-dc-tycoon-v0.5.html','ai-dc-tycoon-v0.5.html'])fs.writeFileSync(path,html05);console.log('Built v0.5.0 CPO offline: '+Buffer.byteLength(html05)+' bytes; legacy executable bytes retained');

/* Additive v0.6 Workshop; original v0.3–v0.5 bundles remain byte exact. */
const js06=esbuild.buildSync({entryPoints:['src/chapter4-entry.ts'],bundle:true,write:false,format:'iife',target:'es2020',minify:true,legalComments:'inline',loader:{'.html':'text'}}).outputFiles[0].text;
const html06=fs.readFileSync('src/game-shell-v06.html','utf8').replace('/* STYLES */',['game-style','chapter2-style','chapter3-style','workshop-style'].map(n=>fs.readFileSync('src/'+n+'.css','utf8')).join('\n')).replace('/* SCRIPT */',()=>js06.replace(/<\/script/gi,'<\\/script'));
fs.mkdirSync('../output-v06',{recursive:true});for(const p of ['../output-v06/ai-dc-tycoon-v0.6.html','ai-dc-tycoon-v0.6.html'])fs.writeFileSync(p,html06);console.log('Built v0.6 Optical Engine Workshop: '+Buffer.byteLength(html06)+' bytes');

/* v0.7: separate entry leaves every earlier executable and engineering source intact. */
const js07=esbuild.buildSync({entryPoints:['src/chapter5-entry.ts'],bundle:true,write:false,format:'iife',target:'es2020',minify:true,legalComments:'inline',loader:{'.html':'text'}}).outputFiles[0].text;
const html07=fs.readFileSync('src/game-shell-v07.html','utf8').replace('/* STYLES */',['game-style','chapter2-style','chapter3-style','workshop-style','campaign-style'].map(n=>fs.readFileSync('src/'+n+'.css','utf8')).join('\n')).replace('/* SCRIPT */',()=>js07.replace(/<\/script/gi,'<\\/script'));
fs.mkdirSync('../output-v07',{recursive:true});for(const p of ['../output-v07/ai-dc-tycoon-v0.7.html','ai-dc-tycoon-v0.7.html'])fs.writeFileSync(p,html07);console.log('Built v0.7 Photonic Substrate Challenge: '+Buffer.byteLength(html07)+' bytes');
