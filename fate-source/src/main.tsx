import React,{Suspense,lazy} from 'react';
import {createRoot} from 'react-dom/client';
import Study from './Study';
import './globals.css';
import './study.css';
const Library=lazy(()=>import('./Library'));
const library=new URLSearchParams(location.search).get('view')==='library';
createRoot(document.getElementById('root')!).render(<Suspense fallback={<p>正在打开古籍…</p>}>{library?<Library/>:<><div className="public-notice"><a href="/">← 返回主页</a><span>网页版 · 首次查解读需下载约 7 MB 年份资料并在浏览器解码，请耐心等待。配图为预先生成的主题艺术。</span></div><Study/></>}</Suspense>);

