let lessons: any[]|null=null;
export async function localFetch(url:string):Promise<Response>{
 const u=new URL(url,location.origin);const action=u.pathname.split('/').pop();
 if(action==='status')return Response.json({years:77,charts:674976});
 if(action==='lessons'){
  if(!lessons){const r=await fetch(import.meta.env.BASE_URL+'data/lessons.jsonl');if(!r.ok)throw Error('课程资料下载失败。');lessons=(await r.text()).trim().split('\n').map(s=>JSON.parse(s))}
  const term=u.searchParams.get('q')||'';return Response.json(lessons.filter(e=>JSON.stringify(e).includes(term)).slice(0,100));
 }
 if(action==='reading')return new Promise((resolve)=>{
  const worker=new Worker(new URL('./reading.worker.ts',import.meta.url));
  const timeout=setTimeout(()=>{worker.terminate();resolve(Response.json({error:'读取超过两分钟，请重试，或在电脑浏览器打开。'},{status:504}))},120000);
  const finish=(data:any,status=200)=>{clearTimeout(timeout);worker.terminate();resolve(Response.json(data,{status}))};
  worker.onmessage=({data})=>{if(data.progress){window.dispatchEvent(new CustomEvent('fate-progress',{detail:data.progress}));console.info(data.progress);return}finish(data.result||{error:data.error},data.error?400:200)};
  worker.onerror=()=>finish({error:'浏览器无法读取该年份资料，请更新浏览器或改用电脑。'},500);
  worker.postMessage({key:u.searchParams.get('key')});
 });
 return Response.json({error:'此功能仅在本地版提供。'},{status:404});
}
