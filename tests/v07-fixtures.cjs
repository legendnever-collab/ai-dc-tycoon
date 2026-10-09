const f=require('./v06-fixtures.cjs'),c5=require('../compiled/chapter5');
function bundle(id='v07-fixture'){return {...f.complete(id),chapter5:c5.newChapter5(id)};}
function complete(id='v07-fixture'){const c=bundle(id),context={workshop:c.chapter4.designs['oe-001'],package:c.chapter3.config};const act=x=>c.chapter5=c5.transitionChapter5(c.chapter5,x,context,true);for(const x of [{type:'start',mission:'13'},{type:'coupling',kind:'edge'},{type:'substrate'},{type:'run'},{type:'start',mission:'14'},{type:'fau'},{type:'alignment',lateralUm:0,verticalUm:0,pitchMismatchUm:0},{type:'run'},{type:'start',mission:'15'},{type:'fixture',channels:16},{type:'run'}])act(x);return c;}
module.exports={bundle,complete,campaign:complete};
