/* Telotia motion study, redrawn from the supplied animation sketch. */
(() => {
'use strict';
const host=document.querySelector('[data-product-motion]'),canvas=host?.querySelector('canvas');
if(!host||!canvas)return;
const ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),TAU=Math.PI*2,N=360;
const clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10)},mix=(a,b,t)=>a+(b-a)*t;
const svgNS='http://www.w3.org/2000/svg';
function path(d,transform=p=>p){const el=document.createElementNS(svgNS,'path');el.setAttribute('d',d);const length=el.getTotalLength();return Array.from({length:N},(_,i)=>transform(el.getPointAtLength(i/(N-1)*length)))}
const spark=path('M0 -.35 C.045 -.095 .095 -.045 .35 0 C.095 .045 .045 .095 0 .35 C-.045 .095 -.095 .045 -.35 0 C-.095 -.045 -.045 -.095 0 -.35Z');
const spiral=Array.from({length:N},(_,i)=>{const t=i/(N-1),a=-Math.PI*.6+t*TAU*1.6,r=.025+.29*t;return{x:r*Math.cos(a),y:r*Math.sin(a)}});
const orbit=Array.from({length:N},(_,i)=>{const t=i/(N-1)*TAU;return{x:.49*Math.sin(t),y:-.255*Math.sin(2*t)}});
const wings=path('M0 0 C-.13 -.23 -.20 -.43 -.29 -.34 C-.42 -.12 -.50 .22 -.43 .31 C-.30 .38 -.10 .20 0 .08 C.10 .20 .30 .38 .43 .31 C.50 .22 .42 -.12 .29 -.34 C.20 -.43 .13 -.23 0 0Z');
const handTransform=p=>({x:(p.x-300)/600,y:(p.y-200)/600});
const handshake=path('M40 140 L170 140 C192 140 210 149 225 161 L250 143 C268 130 287 130 305 139 L337 157 C356 166 375 159 395 150 L560 140 L560 240 L395 240 C376 240 362 232 348 229 C345 245 327 250 315 239 C312 257 292 263 279 250 C274 268 254 273 241 259 C234 276 216 275 204 262 L171 231 C159 222 150 219 134 220 L40 230Z',handTransform);
const handDetails=[
path('M337 157 C320 142 304 143 289 155 L270 174 C259 185 242 182 239 170 C236 162 241 155 250 149',handTransform),
...['M315 239 L288 213','M279 250 L255 226','M241 259 L222 239'].map(d=>path(d,handTransform))];
// Match the starting point of closed contours before interpolation so the
// sculpture changes shape without twisting into a bundle of unrelated lines.
function align(next,previous){let best=Infinity,offset=0,direction=1;for(let dir of [1,-1])for(let j=0;j<N-1;j+=3){let score=0;for(let i=0;i<N-1;i+=9){const p=next[(j+dir*i+N-1)%(N-1)],q=previous[i];score+=(p.x-q.x)**2+(p.y-q.y)**2}if(score<best){best=score;offset=j;direction=dir}}return next.map((_,i)=>next[(offset+direction*i+(N-1)*2)%(N-1)])}
let glyph=spark,ready=false,width=0,height=0,elapsed=0,last=0,raf=0,visible=false;
const staticTime=Number(new URLSearchParams(location.search).get('motion-frame'));
const preview=new URLSearchParams(location.search).has('motion-frame');
let phases;
async function prepare(){
 try{const response=await fetch('assets/logo.svg');if(!response.ok)throw Error('Logo unavailable');const doc=new DOMParser().parseFromString(await response.text(),'image/svg+xml'),d=doc.querySelector('[data-letter="T"] path')?.getAttribute('d');if(d)glyph=path(d,p=>({x:(p.x-268)/500,y:(p.y-296)/500}));}catch(error){console.warn('Brand motion uses its light mark',error)}
 const wingAligned=align(wings,orbit),handAligned=align(handshake,wingAligned),glyphAligned=align(glyph,handAligned);
 phases=[
  {at:0,shape:spark,stage:'spark'},
  {at:1700,shape:spark,stage:'spark'},
  {at:3200,shape:spiral,stage:'spiral'},
  {at:4100,shape:spiral,stage:'spiral'},
  {at:6800,shape:orbit,stage:'weave'},
  {at:9800,shape:orbit,stage:'infinity'},
  {at:11600,shape:wingAligned,stage:'wings'},
  {at:12600,shape:wingAligned,stage:'wings'},
  {at:14800,shape:handAligned,stage:'handshake'},
  {at:16400,shape:handAligned,stage:'handshake'},
  {at:18400,shape:glyphAligned,stage:'brand'},
  {at:20200,shape:glyphAligned,stage:'brand'},
  {at:22200,shape:spark,stage:'return'},
 ];
 ready=true;resize();refresh();
}
function state(time){const t=time%22200;let i=0;while(i<phases.length-2&&t>=phases[i+1].at)i++;const a=phases[i],b=phases[i+1],amount=ease((t-a.at)/(b.at-a.at));return{a,b,t,amount,points:a.shape.map((p,i)=>({x:mix(p.x,b.shape[i].x,amount),y:mix(p.y,b.shape[i].y,amount)}))}}
function trace(points,start=0,end=points.length){ctx.beginPath();for(let i=start;i<end;i++){const p=points[i];if(i===start)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}}
function stroke(points,alpha=1){ctx.globalAlpha=alpha;trace(points);ctx.strokeStyle='rgba(65,216,197,.24)';ctx.lineWidth=4.3;ctx.shadowColor='#44d9c3';ctx.shadowBlur=13;ctx.stroke();trace(points);ctx.strokeStyle='#8be3d8';ctx.lineWidth=1.15;ctx.shadowBlur=3;ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;}
function render(time){if(!ready)return;ctx.clearRect(0,0,width,height);const s=state(time),scale=Math.min(width*.54,height*.86,355),cx=width/2,cy=height*.48,points=s.points.map(p=>({x:cx+p.x*scale,y:cy+p.y*scale}));host.dataset.stage=s.amount<.5?s.a.stage:s.b.stage;
 ctx.lineCap='round';ctx.lineJoin='round';
 // Two strands join naturally during the coil-to-infinity passage in the sketch.
 let highlightPoints=points;
 const weave=Math.sin(Math.PI*clamp((s.t-3900)/6100));
 if(weave>.001){for(const side of [-1,1]){const woven=points.map((p,i)=>{const before=points[Math.max(0,i-1)],after=points[Math.min(N-1,i+1)],dx=after.x-before.x,dy=after.y-before.y,len=Math.hypot(dx,dy)||1,offset=side*weave*3.8*Math.sin(i/(N-1)*TAU*3-time*.0017);return{x:p.x-dy/len*offset,y:p.y+dx/len*offset}});if(side===1)highlightPoints=woven;stroke(woven,.78)}}else stroke(points);
 // A soft highlight follows this very contour, not a separate moving streak.
 const head=(s.t/11100)%1;
 for(let step=0;step<28;step++){const index=Math.floor((head-step/28*.13+1)%1*(N-1)),next=index+1,alpha=(1-step/28)**1.7;ctx.beginPath();ctx.moveTo(highlightPoints[index].x,highlightPoints[index].y);ctx.lineTo(highlightPoints[next].x,highlightPoints[next].y);ctx.strokeStyle='rgba(223,255,248,'+alpha*.88+')';ctx.lineWidth=1.5;ctx.shadowColor='#6ee8d4';ctx.shadowBlur=8*alpha;ctx.stroke()}ctx.shadowBlur=0;
 const detail=ease((s.t-14500)/300)*(1-ease((s.t-16400)/700));
 if(detail>.001)for(const path of handDetails){const pts=path.map(p=>({x:cx+p.x*scale,y:cy+p.y*scale}));stroke(pts,detail)}
 const dot=ease((s.t-18800)/600)*(1-ease((s.t-20200)/1000));if(dot>.001){ctx.globalAlpha=dot;ctx.beginPath();ctx.arc(cx+scale*.42,cy-scale*.43,2.7,0,TAU);ctx.fillStyle='#53d9c5';ctx.shadowColor='#53d9c5';ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1}
}
function resize(){const rect=host.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render(preview?staticTime:elapsed)}
const paused=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
function tick(now){raf=0;if(!visible||paused()||document.hidden){last=0;return}if(last)elapsed+=Math.min(now-last,80);last=now;render(elapsed);raf=requestAnimationFrame(tick)}
function refresh(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;render(preview?staticTime:elapsed);host.dataset.playing=String(!preview&&visible&&!paused()&&!document.hidden);if(ready&&!preview&&visible&&!paused()&&!document.hidden)raf=requestAnimationFrame(tick)}
new ResizeObserver(resize).observe(host);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh()},{rootMargin:'80px'}).observe(host);document.addEventListener('telotia-motion',refresh);document.addEventListener('visibilitychange',refresh);reduced.addEventListener('change',refresh);prepare();
})();
