const fs=require('fs'),cp=require('child_process'),esbuild=require('esbuild');
// Clean checkouts omit v0.4–v0.6 fixtures. Generate them through the original build,
// restoring every existing historical executable byte-for-byte afterward.
if(['0.4','0.5','0.6'].some(v=>!fs.existsSync('ai-dc-tycoon-v'+v+'.html'))){
 const historical=new Map(fs.readdirSync('.').filter(p=>/^ai-dc-tycoon-v0\.(3|4|5|6|7|8|9|10)\.html$/.test(p)).map(p=>[p,fs.readFileSync(p)]));
 try{cp.execFileSync(process.execPath,['build.cjs'],{stdio:'inherit'});}finally{for(const [p,bytes]of historical)fs.writeFileSync(p,bytes);}
}
cp.execFileSync(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.json'],{stdio:'inherit'});
const js=esbuild.buildSync({entryPoints:['src/chapter7-entry.ts'],bundle:true,write:false,format:'iife',target:'es2020',minify:true,legalComments:'inline',loader:{'.html':'text'}}).outputFiles[0].text;
const html=fs.readFileSync('src/game-shell-v08.html','utf8').replace('AI Data Center Tycoon v0.8.0','AI Data Center Tycoon v0.11.0').replace('v0.8.0 · From Prototype to Production','v0.11.0 · Optical Architecture Challenge').replace('/* STYLES */',['game-style','chapter2-style','chapter3-style','workshop-style','campaign-style','assembly-style','korean-font-v08','exploration-style','decision-style','chapter7-style'].map(n=>fs.readFileSync('src/'+n+'.css','utf8')).join('\n')).replace('/* SCRIPT */',()=>js.replace(/<\/script/gi,'<\\/script'));
fs.writeFileSync('ai-dc-tycoon-v0.11.html',html);console.log('Built v0.11 offline: '+Buffer.byteLength(html)+' bytes');
