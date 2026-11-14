/* Fixed contours traced by a traveling line, following the supplied sketch. */
(() => {
'use strict';
const host=document.querySelector('[data-product-motion]'),canvas=host?.querySelector('canvas');
if(!host||!canvas)return;
const ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),TAU=Math.PI*2;
const clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10)},lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
function contour(points){const distance=[0];for(let i=1;i<points.length;i++)distance.push(distance[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y));return{points,distance,length:distance.at(-1)}}
function path(d,transform=p=>({x:p.x,y:p.y}),count=800){const el=document.createElementNS('http://www.w3.org/2000/svg','path');el.setAttribute('d',d);const length=el.getTotalLength();return contour(Array.from({length:count},(_,i)=>transform(el.getPointAtLength(i/(count-1)*length))))}
function pointAt(stroke,distance){distance=Math.max(0,Math.min(stroke.length,distance));let lo=0,hi=stroke.points.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(stroke.distance[mid]<distance)lo=mid;else hi=mid}return lerp(stroke.points[lo],stroke.points[hi],(distance-stroke.distance[lo])/(stroke.distance[hi]-stroke.distance[lo]||1))}
const spark=path('M0 -.33 C.045 -.09 .09 -.045 .33 0 C.09 .045 .045 .09 0 .33 C-.045 .09 -.09 .045 -.33 0 C-.09 -.045 -.045 -.09 0 -.33Z');
const spiral=contour(Array.from({length:700},(_,i)=>{const t=i/699,a=-Math.PI*.6+t*TAU*1.6,r=.30-.275*t;return{x:r*Math.cos(a),y:r*Math.sin(a)}}));
// An actual Lorenz trajectory supplies the irregular turns in the sketch.
// This is not the former repeating figure-eight curve.
function chaotic(){const velocity=([x,y,z])=>[10*(y-x),x*(28-z)-y,x*y-8*z/3],add=(a,b,s)=>a.map((v,i)=>v+b[i]*s);let v=[.1,0,0];const points=[];for(let i=0;i<4400;i++){const dt=.008,k1=velocity(v),k2=velocity(add(v,k1,dt/2)),k3=velocity(add(v,k2,dt/2)),k4=velocity(add(v,k3,dt));v=v.map((x,j)=>x+dt/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]));if(i>=1300)points.push({x:v[0]+v[1]*.12,y:-v[2]})}const xs=points.map(p=>p.x),ys=points.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=.92/Math.max(maxX-minX,maxY-minY);return contour(points.map(p=>({x:(p.x-(minX+maxX)/2)*scale,y:(p.y-(minY+maxY)/2)*scale*.88})))}
const chaos=chaotic();
const bridge=path('M54 330 C104 286 148 104 188 48 Q198 33 207 53 C225 97 220 192 258 213 Q325 228 394 213 C420 186 468 84 496 46 Q507 29 515 53 C538 111 549 270 594 330 Q498 320 400 328 L397 258 Q330 248 262 269 L259 328 Q158 318 54 330Z',p=>({x:(p.x-324)/600,y:(p.y-195)/500}));
const handTransform=p=>({x:(p.x-300)/600,y:(p.y-200)/600});
const handshake=path('M40 140 L170 140 C192 140 210 149 225 161 L250 143 C268 130 287 130 305 139 L337 157 C356 166 375 159 395 150 L560 140 L560 240 L395 240 C376 240 362 232 348 229 C345 245 327 250 315 239 C312 257 292 263 279 250 C274 268 254 273 241 259 C234 276 216 275 204 262 L171 231 C159 222 150 219 134 220 L40 230Z',handTransform);
const handDetails=[path('M337 157 C320 142 304 143 289 155 L270 174 C259 185 242 182 239 170 C236 162 241 155 250 149',handTransform),...['M315 239 L288 213','M279 250 L255 226','M241 259 L222 239'].map(d=>path(d,handTransform,120))];
let width=0,height=0,elapsed=0,last=0,raf=0,visible=false,ready=false,phases=[],duration=0;
const previewParams=new URLSearchParams(location.search),preview=previewParams.has('motion-frame'),staticTime=Number(previewParams.get('motion-frame'));
let glyph,dot;
async function prepare(){
 try{const response=await fetch('assets/logo.svg');if(!response.ok)throw Error('Logo unavailable');const doc=new DOMParser().parseFromString(await response.text(),'image/svg+xml'),d=doc.querySelector('[data-letter="T"] path')?.getAttribute('d');if(!d)throw Error('Brand T path unavailable');glyph=path(d,p=>({x:(p.x-268)/500,y:(p.y-296)/500}));}catch(error){console.warn('Brand drawing unavailable',error);glyph=path('M-.37 -.4 H.37 V-.34 H.06 V.25 Q.06 .42 .31 .4 Q-.02 .49 -.06 .27 V-.34 H-.37Z')}
 dot=contour(Array.from({length:121},(_,i)=>{const a=i/120*TAU-Math.PI/2;return{x:.020*Math.cos(a),y:-.585+.020*Math.sin(a)}}));
 const definitions=[
  {stage:'spark',strokes:[spark],draw:1600,hold:350,travel:850},
  {stage:'spiral',strokes:[spiral],draw:1800,hold:180,travel:600},
  {stage:'chaotic',strokes:[chaos],draw:6400,hold:650,travel:800},
  {stage:'bridge',strokes:[bridge],draw:3400,hold:850,travel:950},
  {stage:'handshake',strokes:[handshake,...handDetails],draw:3800,hold:900,travel:950},
  {stage:'brand',strokes:[glyph,dot],draw:3400,hold:1400,travel:900},
 ];
 let at=0;for(const phase of definitions){const total=phase.strokes.reduce((n,s)=>n+s.length,0);let time=0;phase.events=[];for(let i=0;i<phase.strokes.length;i++){if(i){phase.events.push({type:'lift',from:phase.strokes[i-1].points.at(-1),to:phase.strokes[i].points[0],at:time,duration:180});time+=180}const stroke=phase.strokes[i],span=phase.draw*stroke.length/total;phase.events.push({type:'draw',stroke,index:i,at:time,duration:span});time+=span}phase.drawTime=time;phase.start=at;phase.end=at+phase.travel+time+phase.hold;at=phase.end;phases.push(phase)}duration=at;ready=true;resize();refresh();
}
function state(time){const t=((time%duration)+duration)%duration;const index=phases.findIndex(p=>t<p.end),phase=phases[index];return{index,phase,t,local:t-phase.start}}
function curve(a,b,t){const c={x:a.x+(b.x-a.x)*.35,y:a.y-.10},d={x:a.x+(b.x-a.x)*.75,y:b.y-.10},u=1-t;return{x:u*u*u*a.x+3*u*u*t*c.x+3*u*t*t*d.x+t*t*t*b.x,y:u*u*u*a.y+3*u*u*t*c.y+3*u*t*t*d.y+t*t*t*b.y}}
function screen(p){return{x:width/2+p.x*unit,y:height*.54+p.y*unit}}
let unit=300;
// Each stroke is fixed. Only this arclength window changes as the pen advances.
function trace(stroke,start,end){const a=Math.max(0,start),b=Math.min(stroke.length,end);if(b<=a)return false;ctx.beginPath();let p=screen(pointAt(stroke,a));ctx.moveTo(p.x,p.y);for(let i=1;i<stroke.points.length;i++)if(stroke.distance[i]>a&&stroke.distance[i]<b){p=screen(stroke.points[i]);ctx.lineTo(p.x,p.y)}p=screen(pointAt(stroke,b));ctx.lineTo(p.x,p.y);return true}
function ink(stroke,start,end,alpha=1){if(!trace(stroke,start,end))return;ctx.globalAlpha=alpha;ctx.strokeStyle='rgba(63,213,194,.28)';ctx.lineWidth=3.7;ctx.shadowColor='#49dac4';ctx.shadowBlur=11;ctx.stroke();ctx.strokeStyle='#8de5d9';ctx.lineWidth=1.05;ctx.shadowBlur=2;ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1}
function head(p,alpha=1){const q=screen(p);ctx.globalAlpha=alpha;ctx.beginPath();ctx.arc(q.x,q.y,1.65,0,TAU);ctx.fillStyle='#d9fff6';ctx.shadowColor='#5fe9ce';ctx.shadowBlur=11;ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1}
function highlight(stroke,at){const length=Math.min(.15,stroke.length*.12),steps=16;for(let i=0;i<steps;i++){const end=at-length*i/steps,start=Math.max(0,end-length/steps);if(end<=0||!trace(stroke,start,end))continue;const alpha=(1-i/steps)**1.5;ctx.strokeStyle='rgba(220,255,246,'+alpha*.9+')';ctx.lineWidth=1.5;ctx.shadowColor='#6ce9d0';ctx.shadowBlur=6*alpha;ctx.stroke()}ctx.shadowBlur=0}
function oldFigure(phase,amount){const total=phase.strokes.reduce((n,s)=>n+s.length,0);let consumed=amount*total;for(const stroke of phase.strokes){ink(stroke,consumed,stroke.length,phase.stage==='chaotic'?.69:1);consumed=Math.max(0,consumed-stroke.length)}}
function render(time){if(!ready)return;ctx.clearRect(0,0,width,height);unit=Math.min(width*.68,height*.84,355);ctx.lineCap='round';ctx.lineJoin='round';const s=state(time),p=s.phase,drawTime=s.local-p.travel;host.dataset.stage=p.stage;host.dataset.drawProgress=String(clamp(drawTime/p.drawTime).toFixed(3));
 const previous=phases[(s.index-1+phases.length)%phases.length];
 // The old drawing recedes along its own route as the pen departs.
 if(s.local<p.travel+500&&!(s.index===0&&time<duration))oldFigure(previous,ease(s.local/(p.travel+500)));
 if(s.local<p.travel){const start=s.index===0&&time<duration?{x:-.7,y:.08}:previous.strokes.at(-1).points.at(-1),q=curve(start,p.strokes[0].points[0],ease(s.local/p.travel));head(q);return}
 let tip=null,active=null,distance=0;
 for(const event of p.events){if(event.type==='lift'){if(drawTime>=event.at&&drawTime<event.at+event.duration){tip=curve(event.from,event.to,ease((drawTime-event.at)/event.duration));active=null;break}continue}
  if(drawTime<event.at)break;const progress=clamp((drawTime-event.at)/event.duration),end=event.stroke.length*progress;ink(event.stroke,0,end,p.stage==='chaotic'?.69:1);tip=pointAt(event.stroke,end);active=event.stroke;distance=end;if(progress<1)break;
 }
 if(active&&drawTime<p.drawTime)highlight(active,distance);if(tip&&drawTime<p.drawTime)head(tip);
 if(p.stage==='brand'&&drawTime>=p.drawTime){const q=screen({x:0,y:-.585});ctx.beginPath();ctx.arc(q.x,q.y,unit*.020,0,TAU);ctx.fillStyle='#65dfc9';ctx.shadowColor='#4edfc4';ctx.shadowBlur=7;ctx.fill();ctx.shadowBlur=0}
}
function resize(){const rect=host.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render(preview?staticTime:(reduced.matches&&elapsed===0?duration-500:elapsed))}
const paused=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
function tick(now){raf=0;if(!visible||paused()||document.hidden){last=0;return}if(last)elapsed+=Math.min(now-last,80);last=now;render(elapsed);raf=requestAnimationFrame(tick)}
function refresh(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;render(preview?staticTime:elapsed);host.dataset.playing=String(!preview&&visible&&!paused()&&!document.hidden);if(ready&&!preview&&visible&&!paused()&&!document.hidden)raf=requestAnimationFrame(tick)}
new ResizeObserver(resize).observe(host);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh()},{rootMargin:'80px'}).observe(host);document.addEventListener('telotia-motion',refresh);document.addEventListener('visibilitychange',refresh);reduced.addEventListener('change',refresh);prepare();
})();
