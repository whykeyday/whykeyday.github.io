'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import Vision from './Vision';
import {localFetch} from './data';
import ChartBoard from '@/components/ChartBoard';
import { generateChart } from '@/lib/ziwei/algorithm';
import { calculateTrueSolarTime, resolveZiweiDayOffset, shiftGregorianDate, formatTrueSolarClock } from '@/lib/ziwei/true-solar-time';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import './study.css';
const topics: Record<string,string>={overview:'命格总览',personality:'性格',love:'感情',career:'事业',wealth:'财运',health:'健康',family:'兄弟',children:'子女',move:'迁移',friends:'人际',home:'田宅',spirit:'福德',parents:'父母'};
const branches='子丑寅卯辰巳午未申酉戌亥';
type Reading={k:string;c:Record<string,string>;ms:string|null};
type Lesson={quote:string;h2:string;h3:string;t_hms:string;bvid:string;part:number;note:string};
function Text({text}:{text:string}) {
  return <Markdown components={{a:({children,href})=><a href={href} target="_blank" rel="noreferrer">{children}</a>}}>{text.replace(/\\n/g,'\n')}</Markdown>;
}
export default function Study() {
  const [tab,setTab]=useState('chart'), [date,setDate]=useState(''),[clock,setClock]=useState(''),[gender,setGender]=useState('male');
  const [solar,setSolar]=useState(false),[longitude,setLongitude]=useState('120'),[utc,setUtc]=useState('8');
  const [unknown,setUnknown]=useState(false),[chart,setChart]=useState<ZiweiChart|null>(null),[palace,setPalace]=useState<Palace|null>(null);
  const [reading,setReading]=useState<Reading|null>(null),[topic,setTopic]=useState('overview'),[notice,setNotice]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const [status,setStatus]=useState<{years:number;charts:number}|null>(null),[q,setQ]=useState(''),[lessons,setLessons]=useState<Lesson[]>([]),[lessonError,setLessonError]=useState('');
  useEffect(()=>{localFetch('/api/local/status').then(r=>r.json()).then(d=>{if(!d.error)setStatus(d)}).catch(()=>{});},[]);
  async function search(e?:FormEvent){e?.preventDefault();setLessonError('');try{const r=await localFetch('/api/local/lessons?q='+encodeURIComponent(q)); const d=await r.json();if(!r.ok)throw Error(d.error);setLessons(d);}catch(e){setLessonError((e as Error).message)}}
  async function submit(e:FormEvent, demo=false){
    e.preventDefault();setBusy(true);setError('');setNotice('');setReading(null);setChart(null);setPalace(null);setTopic('overview');
    try{
      if(unknown&&!demo)throw Error('出生时间会改变命盘。请先向家人确认时间；也可以先看示例了解界面。');
      const ds=demo?'1990-01-01':date,ts=demo?'08:00':clock;
      if(!ds||!ts)throw Error('请填写公历生日和出生时间。');
      const [year,month,day]=ds.split('-').map(Number),[clockHour,clockMinute]=ts.split(':').map(Number);
      const result=calculateTrueSolarTime({year,month,day,clockHour,clockMinute,...(solar&&!demo?{longitude:Number(longitude),utcOffsetMinutes:Number(utc)*60}:{})});
      if(!result.dateValid)throw Error('日期无效，请重新填写。');
      const birthDate=shiftGregorianDate({year,month,day},resolveZiweiDayOffset(result,'next-day'));
      if(birthDate.year<1950||birthDate.year>2026)throw Error('完整解读覆盖 1950–2026 年，请选择范围内的日期。');
      const info={...birthDate,hour:result.branch,gender:(demo?'male':gender) as 'male'|'female'};
      setChart(generateChart(info));
      const dateLabel=`${birthDate.year}-${String(birthDate.month).padStart(2,'0')}-${String(birthDate.day).padStart(2,'0')}`;
      setNotice(`${demo?'示例资料 · ':''}排盘日 ${dateLabel} · ${branches[result.branch]}时${result.corrected?' · 真太阳时 '+formatTrueSolarClock(result):' · 按钟表标准时间'}。晚子时（23:00 起）按次日排盘。`);
      const r=await localFetch('/api/local/reading?key='+`${dateLabel}-${info.hour}-${info.gender}`);const d=await r.json();if(!r.ok)throw Error(d.error);setReading(d);
    }catch(e){setError((e as Error).message)}finally{setBusy(false)}
  }
  return <div className="study"><header className="study-header"><Link href="/local" className="brand">紫微书房<span>在线排盘与学习</span></Link><nav aria-label="主导航"><button aria-current={tab==='chart'?'page':undefined} onClick={()=>setTab('chart')}>排盘与解读</button><button aria-current={tab==='learn'?'page':undefined} onClick={()=>{setTab('learn');if(!lessons.length)void search()}}>学习资料</button><button aria-current={tab==='guide'?'page':undefined} onClick={()=>setTab('guide')}>入门指南</button></nav></header>
  <main className="study-main">{tab==='chart'?<><div className="intro"><h1>从你的第一张命盘开始。</h1><p>填写出生信息，看十二宫与十三个主题的传统解读。遇到不懂的词，可以随时打开入门指南。</p></div><div className="workspace"><aside className="birth-panel"><h2>出生信息</h2><form onSubmit={submit}>
  <label>公历生日<input required type="date" min="1950-01-01" max="2026-12-31" value={date} onChange={e=>setDate(e.target.value)}/></label><small>请用阳历日期；农历生日请先核对转换。</small>
  <label>性别<select value={gender} onChange={e=>setGender(e.target.value)}><option value="male">男</option><option value="female">女</option></select></label>
  <label>出生时间<input required={!unknown} disabled={unknown} type="time" value={clock} onChange={e=>setClock(e.target.value)}/></label><label className="check"><input type="checkbox" checked={unknown} onChange={e=>setUnknown(e.target.checked)}/>暂时不清楚出生时间</label><small>使用出生地当时的标准时间。若记录的是夏令时，请先减去夏令时偏移。</small>
  <details><summary>出生地与时间校正</summary><label className="check"><input type="checkbox" checked={solar} onChange={e=>setSolar(e.target.checked)}/>使用真太阳时</label><p className="muted">知道出生地经度时可开启；不确定时先保留钟表时间。海外出生请同时填写当地标准时区。</p>{solar&&<><label>出生地经度<input required type="number" min="-180" max="180" step="any" value={longitude} onChange={e=>setLongitude(e.target.value)}/></label><label>当地标准时区（UTC 小时）<input required type="number" min="-12" max="14" step="0.25" value={utc} onChange={e=>setUtc(e.target.value)}/></label><small>中国为 8；多伦多为 -5，夏令时另行换算。</small></>}</details>
  <button className="primary" disabled={busy}>{busy?'正在读取命盘…':'生成我的命盘'}</button><button type="button" className="demo" disabled={busy} onClick={e=>void submit(e,true)}>先看一个示例</button></form><div className="local-note">出生信息仅在浏览器处理，无需登录。{status&&<p>{status.years===77?'完整数据已就绪':`已整理 ${status.years} / 77 年`} · {status.charts.toLocaleString()} 张命盘</p>}</div></aside>
  <section className="result" aria-live="polite">{error&&<div className="error" role="alert">{error}</div>}{notice&&<p className="notice">{notice}</p>}{chart?<><h2>你的十二宫命盘</h2><p className="muted">点击宫位查看星曜。命宫看整体特质，官禄宫看事业，夫妻宫看感情。</p><div className="chart-scroll"><ChartBoard chart={chart} onPalaceSelect={setPalace}/></div>{palace&&<div className="palace-detail"><h3>{palace.name}</h3><p>{palace.stars.map(s=>s.name+(s.siHua?'化'+s.siHua:'')).join(' · ')||'空宫：本宫没有星曜，请结合对宫参考。'}</p></div>}
  {reading&&<section className="readings"><h2>分主题解读</h2><p className="muted">v4.0 数据集原文 · 传统规则生成。当前命盘使用更新后的排盘引擎，星曜亮度口径可能与数据集有差异。</p><div className="topic-tabs" role="group" aria-label="解读主题">{Object.entries(topics).map(([k,v])=><button key={k} aria-pressed={topic===k} onClick={()=>setTopic(k)}>{v}</button>)}</div><Vision chartKey={reading.k} topic={topic} label={topics[topic]}/><article><h3>{topics[topic]}</h3><Text text={reading.c[topic]||'此主题暂无内容。'}/></article><button className="demo" onClick={()=>{const blob=new Blob([Object.entries(reading.c).map(([k,v])=>topics[k]+'\n\n'+v.replace(/\\n/g,'\n')).join('\n\n——\n\n')+'\n\n来源：Renhuai123/ziwei-doushu · v4.0 · CC BY 4.0'],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=reading.k+'-解读.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}}>保存完整解读</button></section>}</>:<div className="empty"><h2>命盘，会在这里展开。</h2><p>先填写左侧的出生信息。你将看到十二宫分布，以及性格、感情、事业等十三个主题的解读。</p><div className="steps"><p><b>填写生日与时间</b><span>时辰每两小时一段，准确时间很重要。</span></p><p><b>查看命盘与解读</b><span>先读命格总览，再选自己关心的主题。</span></p><p><b>结合原文学习</b><span>到学习资料里查星曜、宫位和课程出处。</span></p></div><p className="muted">还没准备好出生信息？可以先看示例。</p></div>}</section></div></>:tab==='learn'?<><div className="intro"><h1>边看命盘，边读原文。</h1><p>《天纪》课程摘录附原视频时间，可查证出处。古籍阅读器支持全文检索。</p></div><div className="learning-links"><Link href="/library">打开古籍阅读器 <span>全书、全集与骨髓赋</span></Link><a href="/local" onClick={e=>{e.preventDefault();setTab('guide')}}>先读入门指南 <span>认识十二宫、星曜与四化</span></a></div><h2>《天纪》课程摘录</h2><form className="search" onSubmit={search}><label className="sr-only" htmlFor="lesson-search">搜索课程内容</label><input id="lesson-search" placeholder="试试：紫微、命宫、四化…" value={q} onChange={e=>setQ(e.target.value)}/><button className="primary">搜索原话</button></form><p className="muted">最多显示 100 条；输入关键词缩小范围。</p>{lessonError&&<p role="alert">{lessonError}</p>}<div className="lesson-list">{lessons.map((l,i)=><article key={i}><h3>{l.h2} · {l.h3}</h3><p>{l.quote}</p>{l.note&&l.note!=='cleaned'&&<small>{l.note}</small>}<a href={`https://www.bilibili.com/video/${l.bvid}?p=${l.part}&t=${l.t_hms.split(':').reduce((a,n)=>a*60+Number(n),0)}`} target="_blank" rel="noreferrer">回到课程 {l.t_hms} ↗</a></article>)}{!lessons.length&&!lessonError&&<p>没有找到相符内容，请换一个关键词。</p>}</div></>:<article className="guide"><h1>第一次看紫微斗数</h1><h2>先准备三项信息</h2><p>公历出生日期、出生时间与性别。出生时辰不确定时，不要把默认时间当成自己的命盘。可以先看示例，向家人确认后再排盘。</p><h2>一张命盘怎么看？</h2><p>命盘分成十二宫。命宫对应整体特质，兄弟、夫妻、子女、财帛、疾厄、迁移、交友、官禄、田宅、福德、父母分别代表传统命理关注的生活主题。每个宫位中的星曜，是这套解释体系的符号。</p><h2>什么是时辰与四化？</h2><p>一天分十二个时辰，每个约两小时。子时是 23:00–00:59；本工具按晚子时换日规则，将 23:00–23:59 归到次日。四化是化禄、化权、化科、化忌，是传统体系描述星曜变化的标记，不等于现实中必然发生的事件。</p><h2>出生地为什么影响时间？</h2><p>真太阳时会结合经度与均时差修正钟表时间。出生在时辰边界附近时可能改变时辰。高级设置提供经度与标准时区；夏令时和历史时区变化需要先核对，再输入标准时间。</p><h2>先读总览，再读主题</h2><p>先浏览命盘，接着看命格总览，再打开感兴趣的主题。解读保留作者原文，有些语气绝对，适合作为传统文化学习材料。健康、关系和财务相关说法不作为现实决策依据。</p><h2>这些资料来自哪里？</h2><p>完整解读覆盖 1950–2026 年，共 674,976 张命盘、13 个主题，来自 v4.0 数据集。它由传统规则生成，并非 AI 即时分析。排盘使用仓库更新后的引擎，数据集沿用 2026-10-15 的亮度口径，个别细节可能不同。线上只使用新版 v4.0。</p><button className="primary" onClick={()=>setTab('chart')}>开始排盘</button></article>}</main>
  <footer className="study-footer">紫微书房 · 浏览器版 <span>数据来源：<a href="https://github.com/Renhuai123/ziwei-doushu" target="_blank" rel="noreferrer">Renhuai123/ziwei-doushu</a> · v4.0 / CC BY 4.0；课程摘录 CC BY-NC-SA 4.0，仅限非商业学习。</span></footer></div>;
}


