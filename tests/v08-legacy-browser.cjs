// Execute preserved actual Mission01–12 controls in the additive v08 executable.
// Only launcher/ready/restore adapt to the new envelope; every gameplay assertion remains.
const fs=require('fs'),Module=require('module'),path=require('path'),helper=require('./v08-browser-helpers.cjs'),base=require('./v07-browser-helpers.cjs');
const hybrid={...base,launch:helper.launch,ready:helper.ready,saved:helper.saved,restore:helper.restore};
const original=path.resolve('tests/v07-legacy-browser.cjs'),source=fs.readFileSync(original,'utf8');
const m=new Module(original,module);m.filename=original;m.paths=Module._nodeModulePaths(path.dirname(original));const load=m.require.bind(m);m.require=name=>name==='./v07-browser-helpers.cjs'?hybrid:load(name);
m._compile(source.replaceAll('evidence/v07','evidence/v08').replaceAll('legacy-browser-results.json','legacy-browser.json'),original);
