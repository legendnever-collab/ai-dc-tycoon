import {recoverCampaignRestore,cancelCampaignRestore} from './campaign-storage';
(async()=>{
 try{const r=await recoverCampaignRestore();if(r.blocked)throw Error(r.message);}
 catch(e){if(globalThis.indexedDB){const panel=document.createElement('section');panel.className='c3-boot';const title=document.createElement('h1');title.textContent='Campaign 복원 보호';const p=document.createElement('p');p.textContent=(e as Error).message;const b=document.createElement('button');b.textContent='복원 Journal 취소 · 현재 저장본 유지';b.onclick=async()=>{try{await cancelCampaignRestore();location.reload();}catch(error){p.textContent=(error as Error).message;}};panel.append(title,p,b);document.body.prepend(panel);return;}}
 await import('./chapter3-app');
})();
