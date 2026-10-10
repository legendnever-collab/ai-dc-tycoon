const f=require('./v07-fixtures.cjs'),m=require('../compiled/chapter6'),a=require('../compiled/assembly-model');
const binding=c=>({design:c.chapter5.design,context:{workshop:c.chapter4.designs[c.chapter5.design.oeId],package:c.chapter3.config}});
const bundle=(id='v08-fixture')=>({...f.complete(id),chapter6:m.newChapter6(id)});
function complete(id='v08-fixture'){const c=bundle(id),b=binding(c);for(const mission of ['16','17','18']){c.chapter6=m.transitionChapter6(c.chapter6,{type:'start',mission},b,true);c.chapter6=m.transitionChapter6(c.chapter6,{type:'recipe',patch:mission==='16'?{}:mission==='17'?{equipment:'precision',pitchMatched:true}:{order:'quality',batch:50,test:'channel',strategy:'known-good',rework:true}},b,true);c.chapter6=m.transitionChapter6(c.chapter6,{type:'result',run:a.simulateAssembly6(a.input6(b,c.chapter6.recipe))},b,true);if(!c.chapter6.last.pass)throw Error('fixture mission failed '+mission);}return c;}
module.exports={bundle,complete,binding};
