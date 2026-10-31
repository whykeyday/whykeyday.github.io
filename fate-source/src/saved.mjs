const DB='fate-personal-charts';
const STORE='charts';
const topics=['overview','personality','love','career','wealth','health','family','children','move','friends','home','spirit','parents'];
export const storageMessage='无法保存到当前浏览器，请检查是否禁用了网站存储或空间已满。';
function open(){return new Promise((resolve,reject)=>{
 if(!globalThis.indexedDB)return reject(Error(storageMessage));
 const r=indexedDB.open(DB,1);
 r.onupgradeneeded=()=>{const s=r.result.createObjectStore(STORE,{keyPath:'id'});s.createIndex('identity','identity',{unique:true})};
 r.onerror=()=>reject(Error(storageMessage));r.onblocked=()=>reject(Error('请关闭其他旧版书房页面后重试。'));
 r.onsuccess=()=>{const db=r.result;db.onversionchange=()=>db.close();resolve(db)};
})}
function valid(record){
 const b=record?.birthInfo,r=record?.reading;
 if(!b||!r||!record.form||typeof record.notice!=='string')throw Error('保存的命盘资料不完整，请重新生成。');
 const date=new Date(Date.UTC(b.year,b.month-1,b.day));
 if(!Number.isInteger(b.year)||b.year<1950||b.year>2026||date.getUTCFullYear()!==b.year||date.getUTCMonth()+1!==b.month||date.getUTCDate()!==b.day||!Number.isInteger(b.hour)||b.hour<0||b.hour>11||!['male','female'].includes(b.gender))throw Error('命盘出生资料无效。');
 const key=`${b.year}-${String(b.month).padStart(2,'0')}-${String(b.day).padStart(2,'0')}-${b.hour}-${b.gender}`;
 if(r.k!==key||!topics.every(t=>typeof r.c?.[t]==='string'))throw Error('解读与命盘不匹配，请重新生成。');
 return record;
}
export async function saveChart(input){
 valid(input);
 const name=String(input.name||'').trim();
 if(!name)throw Error('请先填写姓名或称呼，再保存命盘。');
 if(name.length>80)throw Error('姓名或称呼请保持在 80 个字以内。');
 const identity=name.normalize('NFKC').toLocaleLowerCase()+'|'+input.reading.k;
 const db=await open();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readwrite'),s=tx.objectStore(STORE);let saved;
  tx.oncomplete=()=>{db.close();resolve(saved)};
  tx.onerror=()=>{db.close();reject(Error(storageMessage))};tx.onabort=tx.onerror;
  const r=input.id?s.get(input.id):s.index('identity').get(identity);
  r.onsuccess=()=>{const prior=r.result,now=new Date().toISOString();saved={version:1,contentVersion:'v4.0',id:prior?.id||crypto.randomUUID(),identity,name,createdAt:prior?.createdAt||now,updatedAt:now,birthInfo:{...input.birthInfo,name},form:input.form,notice:input.notice,reading:input.reading};s.put(saved)};
 });
}
async function read(id){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),s=tx.objectStore(STORE);let result;const r=id?s.get(id):s.getAll();r.onsuccess=()=>{result=r.result};tx.oncomplete=()=>{db.close();resolve(result)};tx.onerror=()=>{db.close();reject(Error('无法读取已保存命盘，请检查网站存储设置。'))}})}
export async function listCharts(){const records=await read();return records.map(({id,name,form,birthInfo,updatedAt})=>({id,name,form,birthInfo,updatedAt})).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))}
export async function getChart(id){const result=await read(id);if(!result)throw Error('这张命盘已不存在，请刷新保存列表。');return valid(result)}
export async function exportCharts(){return {format:'fate-personal-charts',version:1,exportedAt:new Date().toISOString(),charts:await read()}}
