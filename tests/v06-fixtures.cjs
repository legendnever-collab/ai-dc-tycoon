const f=require('./v05-fixtures.cjs'),c4=require('../compiled/chapter4');
function bundle(id='v06-fixture'){const game=f.legacy(id),chapter2=f.chapter2(game),chapter3=f.complete(id);return {game,chapter2,chapter3,chapter4:c4.newChapter4(id)};}
function complete(id='v06-fixture'){const c=bundle(id);const act=a=>c.chapter4=c4.transitionChapter4(c.chapter4,a,c.chapter3,830);for(const a of [{type:'start',mission:'10'},{type:'cw'},{type:'run'},{type:'start',mission:'11'},{type:'modulator',kind:'MZM'},{type:'driver'},{type:'output'},{type:'run'},{type:'start',mission:'12'},{type:'waveguide'},{type:'coupler',kind:'EdgeCoupler'},{type:'fau'},{type:'receiver'},{type:'run'}])act(a);return c;}
module.exports={bundle,complete};
