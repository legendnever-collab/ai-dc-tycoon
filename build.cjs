const fs=require('fs'),cp=require('child_process'),esbuild=require('esbuild'),crypto=require('crypto');
const lab=fs.readFileSync('src/lab-baseline.html');if(crypto.createHash('sha256').update(lab).digest('hex')!=='cf7cf6df5d83cc3927d3fb5cef2a320aa507c5c58a6e5d264cedc5c9d5c7947a')throw Error('Authoritative v0.2 executable changed');
cp.execFileSync(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.json'],{stdio:'inherit'});
const js=esbuild.buildSync({entryPoints:['src/game-app.ts'],bundle:true,write:false,format:'iife',target:'es2020',minify:true,legalComments:'inline',loader:{'.html':'text'}}).outputFiles[0].text;
const html=fs.readFileSync('src/game-shell.html','utf8').replace('/* STYLES */',fs.readFileSync('src/game-style.css','utf8')).replace('/* SCRIPT */',()=>js.replace(/<\/script/gi,'<\\/script'));
fs.mkdirSync('../output-v03',{recursive:true});for(const path of ['../output-v03/ai-dc-tycoon-v0.3.html','ai-dc-tycoon-v0.3.html'])fs.writeFileSync(path,html);console.log('Built v0.3.0 offline: '+Buffer.byteLength(html)+' bytes; exact v0.2 Lab preserved');
