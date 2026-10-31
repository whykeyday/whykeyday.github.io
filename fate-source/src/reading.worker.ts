import {Decompress} from 'fzstd';
self.onmessage=async({data:{key}})=>{
 try{
  if(!/^\d{4}-\d{2}-\d{2}-\d{1,2}-(male|female)$/.test(key))throw Error('查询格式无效。');
  const year=Number(key.slice(0,4));if(year<1950||year>2026)throw Error('数据覆盖 1950–2026 年。');
  const r=await fetch(`https://raw.githubusercontent.com/whykeyday/whykeyday.github.io/fate-data/year-${year}.jsonl.zst`);if(!r.ok)throw Error('年份资料下载失败，请检查网络后重试。');
  const bytes=new Uint8Array(await r.arrayBuffer());self.postMessage({progress:'年份资料已下载，正在载入解码器…'});
  let tail='',found:any=null;const done=Symbol('found');const decoder=new TextDecoder();
  const stream=new Decompress((chunk,final)=>{
   tail+=decoder.decode(chunk,{stream:!final});let end:number;
   while((end=tail.indexOf('\n'))!==-1){const line=tail.slice(0,end);tail=tail.slice(end+1);if(line.includes('"'+key+'"')){const v=JSON.parse(line);if(v.k===key){found=v;throw done}}}
   if(final&&tail.includes('"'+key+'"')){const v=JSON.parse(tail);if(v.k===key){found=v;throw done}}
  });
  self.postMessage({progress:'正在查找对应命盘…'});
  try{for(let offset=0;offset<bytes.length;offset+=65536)stream.push(bytes.subarray(offset,offset+65536),offset+65536>=bytes.length)}catch(e){if(e!==done)throw e}
  if(!found)throw Error('未找到该日期与时辰的解读。');self.postMessage({result:found});
 }catch(e){self.postMessage({error:(e as Error).message||'解读读取失败，请重试。'})}
};
