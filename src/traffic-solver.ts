// Shared, deterministic educational traffic allocator. Capacity is directional Gb/s;
// demands are Gbit. Independent unused edges never increase workload throughput.
export type TrafficNode={id:string;type:'ComputeRack'|'Switch';fabricGb_s:number|null};
export type TrafficEdge={id:string;a:string;b:string;capacityGb_s:number};
export type DirectedDemand={id:string;source:string;target:string;amountGbit:number};
export function allocateTraffic(nodes:TrafficNode[],edges:TrafficEdge[],demands:DirectedDemand[]){
 const paths:{demandId:string;nodes:string[];links:string[];amountGbit:number}[]=[],missing:string[]=[];
 const loads=new Map<string,{type:'Link'|'Fabric';capacityGb_s:number;trafficGbit:number}>();
 const add=(id:string,type:'Link'|'Fabric',capacityGb_s:number,amount:number)=>{const old=loads.get(id);loads.set(id,{type,capacityGb_s,trafficGbit:(old?.trafficGbit||0)+amount});};
 const adjacency=new Map<string,{node:string;link:string;capacity:number}[]>();
 if(new Set(nodes.map(n=>n.id)).size!==nodes.length||new Set(edges.map(e=>e.id)).size!==edges.length||new Set(demands.map(d=>d.id)).size!==demands.length)throw Error('Traffic Graph duplicate ID');
 for(const n of nodes)if(n.fabricGb_s!==null&&(!Number.isFinite(n.fabricGb_s)||n.fabricGb_s<=0))throw Error('Invalid Fabric Capacity');
 for(const e of [...edges].sort((a,b)=>a.id.localeCompare(b.id))){if(!nodes.some(n=>n.id===e.a)||!nodes.some(n=>n.id===e.b)||e.a===e.b||!Number.isFinite(e.capacityGb_s)||e.capacityGb_s<=0)throw Error('Invalid Active Link Capacity / Endpoint');for(const [from,to] of [[e.a,e.b],[e.b,e.a]])adjacency.set(from,[...(adjacency.get(from)||[]),{node:to,link:e.id,capacity:e.capacityGb_s}]);}
 for(const d of demands){if(!nodes.some(n=>n.id===d.source)||!nodes.some(n=>n.id===d.target)||!Number.isFinite(d.amountGbit)||d.amountGbit<=0||d.source===d.target)throw Error('Invalid Traffic Demand');const queue=[{nodes:[d.source],links:[] as string[]}],visited=new Set([d.source]);let found:{nodes:string[];links:string[]}|null=null;
  while(queue.length){const p=queue.shift()!,last=p.nodes[p.nodes.length-1];if(last===d.target){found=p;break;}if(last!==d.source&&nodes.find(n=>n.id===last)!.type!=='Switch')continue;for(const e of adjacency.get(last)||[]){if(visited.has(e.node))continue;visited.add(e.node);queue.push({nodes:[...p.nodes,e.node],links:[...p.links,e.link]});}}
  if(!found){missing.push(d.id);continue;}paths.push({demandId:d.id,...found,amountGbit:d.amountGbit});
  for(let i=0;i<found.links.length;i++){const e=edges.find(e=>e.id===found!.links[i])!;add(e.id+':'+found.nodes[i]+'>'+found.nodes[i+1],'Link',e.capacityGb_s,d.amountGbit);}
  for(const id of found.nodes){const n=nodes.find(n=>n.id===id)!;if(n.fabricGb_s!==null)add(n.id+':fabric','Fabric',n.fabricGb_s,d.amountGbit);}
 }
 const resources=[...loads].map(([id,v])=>({id,...v,seconds:v.trafficGbit/v.capacityGb_s}));const worst=[...resources].sort((a,b)=>b.seconds-a.seconds||a.id.localeCompare(b.id))[0];
 return {paths,resources,missing,bottleneckResource:worst?.id||null,networkSeconds:missing.length?null:worst?.seconds??null,effectiveGb_s:missing.length||!worst?0:demands.reduce((s,d)=>s+d.amountGbit,0)/worst.seconds};
}
