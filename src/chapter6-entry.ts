import {recoverCampaignRestore,cancelCampaignRestore} from './campaign-storage';
import {recoverCampaign06,cancelCampaign06} from './workshop-storage';
import {recoverCampaign07,cancelCampaign07} from './substrate-storage';
import {recoverCampaign08,cancelCampaign08} from './assembly-storage';
import {mountCampaignShell} from './campaign-shell-v08';
document.addEventListener('click',e=>{if((window as any).AIDCT_V08?.handleClick(e))return;if((window as any).AIDCT_SHELL07?.handleClick(e))return;if((window as any).AIDCT_V07?.handleClick(e))return;if((window as any).AIDCT_V06?.handleClick(e))return;},true);
(async()=>{try{const r=await recoverCampaignRestore();if(r.blocked)throw Error(r.message);await recoverCampaign06();await recoverCampaign07();await recoverCampaign08();}catch(error){if(globalThis.indexedDB){const panel=document.createElement('section');panel.className='c3-boot';const h=document.createElement('h1');h.textContent='Campaign 복원 보호';const p=document.createElement('p');p.textContent=(error as Error).message;const b=document.createElement('button');b.textContent='복원 Journal 취소 · 현재 저장본 유지';b.onclick=async()=>{try{await cancelCampaignRestore();await cancelCampaign06();await cancelCampaign07();await cancelCampaign08();location.reload();}catch(e){p.textContent=(e as Error).message;}};panel.append(h,p,b);document.body.prepend(panel);return;}}
 await import('./chapter3-app');await import('./chapter4-app-v07');await import('./chapter5-app-v08');await import('./chapter6-app');mountCampaignShell();})();
