/* Telotia line performance. Fixed contours; timing is scored at 24 fps. */
(() => {
'use strict';
const host=document.querySelector('[data-product-motion]'),canvas=host?.querySelector('canvas');if(!host||!canvas)return;
const ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),TAU=Math.PI*2,FRAME=1000/24;
const clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10)},lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
function pointAt(stroke,d){d=Math.max(0,Math.min(stroke.length,d));let lo=0,hi=stroke.points.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(stroke.distance[m]<d)lo=m;else hi=m}return lerp(stroke.points[lo],stroke.points[hi],(d-stroke.distance[lo])/(stroke.distance[hi]-stroke.distance[lo]||1))}
function contour(points){const distance=[0];for(let i=1;i<points.length;i++)distance.push(distance[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y));const s={points,distance,length:distance.at(-1)};
 // Time, rather than distance alone, is allocated to each turn. Averaging
 // tangent changes keeps small sampled curvature from making the head jitter.
 const weights=[];for(let i=0;i<=256;i++){const d=s.length*i/256,a=pointAt(s,d-.027),b=pointAt(s,d),c=pointAt(s,d+.027),u={x:b.x-a.x,y:b.y-a.y},v={x:c.x-b.x,y:c.y-b.y},den=Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y),turn=den?Math.acos(Math.max(-1,Math.min(1,(u.x*v.x+u.y*v.y)/den))):0;weights.push(1+1.8*ease((turn-.15)/.95))}
 s.clock=[0];let previous=weights[0];for(let i=1;i<=256;i++){let w=0,n=0;for(let j=Math.max(0,i-4);j<=Math.min(256,i+4);j++){w+=weights[j];n++}w/=n;s.clock.push(s.clock.at(-1)+(previous+w)/2);previous=w}return s;
}
function path(d,transform=p=>({x:p.x,y:p.y}),count=720){const el=document.createElementNS('http://www.w3.org/2000/svg','path');el.setAttribute('d',d);const length=el.getTotalLength();return contour(Array.from({length:count},(_,i)=>transform(el.getPointAtLength(i/(count-1)*length))))}
// Handshake and sparkle use the existing Lucide ISC assets in assets/morph.
const icon=p=>({x:(p.x-12)/23,y:(p.y-12)/23});
const spark=path("M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",icon);
function chaotic(){const velocity=([x,y,z])=>[10*(y-x),x*(28-z)-y,x*y-8*z/3],add=(a,b,s)=>a.map((v,i)=>v+b[i]*s);let v=[.1,0,0];const samples=[];for(let i=0;i<10500;i++){const dt=.005,k1=velocity(v),k2=velocity(add(v,k1,dt/2)),k3=velocity(add(v,k2,dt/2)),k4=velocity(add(v,k3,dt));v=v.map((x,j)=>x+dt/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]));if(i>=1700)samples.push(v)}const turns=[];for(let i=1;i<samples.length-1;i++)if(samples[i-1][2]>samples[i][2]&&samples[i+1][2]>samples[i][2])turns.push(i);let best=null,score=Infinity;for(let i=0;i+4<turns.length;i++){const indices=turns.slice(i,i+4);if(indices.filter(j=>samples[j][0]<0).length!==2)continue;const a=samples[turns[i]],b=samples[turns[i+4]],value=Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);if(value<score){score=value;best=samples.slice(turns[i],turns[i+4]+1)}}const selected=best||samples.slice(0,1200),raw=selected.map(([x,y,z])=>({x:1.1*x+.20*y,y:(28-z)*.78})),xs=raw.map(p=>p.x),ys=raw.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=.9/Math.max(maxX-minX,maxY-minY);const points=raw.map(p=>{const x=(p.x-(minX+maxX)/2)*scale,y=(p.y-(minY+maxY)/2)*scale;return{x:x*Math.cos(-.18)-y*Math.sin(-.18),y:x*Math.sin(-.18)+y*Math.cos(-.18)}});
 // Close the representative orbit by spreading its tiny return error over
 // the whole line; no straight closing chord or dangling endpoints.
 const n=points.length-1,first=points[0],last=points[n],delta={x:first.x-last.x,y:first.y-last.y},v0={x:(points[1].x-first.x)*n,y:(points[1].y-first.y)*n},v1={x:(last.x-points[n-1].x)*n,y:(last.y-points[n-1].y)*n},target={x:(v0.x+v1.x)/2,y:(v0.y+v1.y)/2},window=.10;
 const closed=points.map((p,i)=>{const t=i/n,start=t<window?t*(1-t/window)**2:0,end=t>1-window?(t-1)*(1-(1-t)/window)**2:0;return{x:p.x+delta.x*ease(t)+(target.x-v0.x)*start+(target.x-v1.x)*end,y:p.y+delta.y*ease(t)+(target.y-v0.y)*start+(target.y-v1.y)*end}});
 closed[n]={...closed[0]};const step={x:(closed[1].x-closed[n-1].x)/2,y:(closed[1].y-closed[n-1].y)/2};closed[1]={x:closed[0].x+step.x,y:closed[0].y+step.y};closed[n-1]={x:closed[0].x-step.x,y:closed[0].y-step.y};return contour(closed)}
const chaos=chaotic();
const bridge=["M6 5l0 14","M18 5l0 14","M2 15l20 0","M3 8a7.5 7.5 0 0 0 3 -2a6.5 6.5 0 0 0 12 0a7.5 7.5 0 0 0 3 2","M12 10l0 5"].map(d=>path(d,icon));
const handshake=path("M11 4 H3 V3 L2 14 L8.5 20.5 a1 1 0 1 0 3 -3 L11 17 L13 19 a1 1 0 1 0 3 -3 L14 14 L16.5 16.5 a1 1 0 1 0 3 -3 L20 14 H22 L21 3 V4 l-1.74 .35 a2 2 0 0 1 -1.42 -.25 l-.47 -.28 a5.79 5.79 0 0 0 -7.06 .87 L7.5 7.5 a1 1 0 1 0 3 3 l.88 -.88 a3 3 0 0 1 4.24 0 L19.5 13.5",icon);
const PROFILES={main:[[0,0],[.13,.035],[.32,.23],[.76,.86],[.92,.98],[1,1]],flow:[[0,0],[.16,.055],[.30,.24],[.72,.78],[.88,.955],[1,1]],detail:[[0,0],[.17,.07],[.65,.88],[1,1]]};
// Monotone cubic spacing: different beat positions share continuous velocity.
function spacing(t,kind='main'){const k=PROFILES[kind];t=clamp(t);let i=0;while(i<k.length-2&&t>k[i+1][0])i++;const sec=j=>(k[j+1][1]-k[j][1])/(k[j+1][0]-k[j][0]),slope=j=>j===0||j===k.length-1?0:2/(1/sec(j-1)+1/sec(j)),a=k[i],b=k[i+1],h=b[0]-a[0],u=(t-a[0])/h,u2=u*u,u3=u2*u;return clamp((2*u3-3*u2+1)*a[1]+(u3-2*u2+u)*h*slope(i)+(-2*u3+3*u2)*b[1]+(u3-u2)*h*slope(i+1))}
function distanceAt(stroke,t,profile='main'){const target=spacing(t,profile)*stroke.clock.at(-1);let lo=0,hi=256;while(hi-lo>1){const m=(lo+hi)>>1;if(stroke.clock[m]<target)lo=m;else hi=m}return stroke.length*(lo+(target-stroke.clock[lo])/(stroke.clock[hi]-stroke.clock[lo]||1))/256}
let width=0,height=0,elapsed=0,last=0,raf=0,visible=false,ready=false,phases=[],duration=0,unit=300;
const params=new URLSearchParams(location.search),preview=params.has('motion-frame'),staticTime=Number(params.get('motion-frame'));
let glyph,dot;const DOT_RADIUS=.073,DOT_Y=-.515;
async function prepare(){try{const response=await fetch('assets/logo.svg');if(!response.ok)throw Error('Logo unavailable');const doc=new DOMParser().parseFromString(await response.text(),'image/svg+xml'),d=doc.querySelector('[data-letter="T"] path')?.getAttribute('d');if(!d)throw Error('Brand T path unavailable');glyph=path(d,p=>({x:(p.x-268)/500,y:(p.y-296)/500+.065}));}catch(error){console.warn('Brand drawing unavailable',error);glyph=path('M-.37 -.335 H.37 V-.275 H.06 V.315 Q.06 .485 .31 .465 Q-.02 .555 -.06 .335 V-.275 H-.37Z')}
 dot=contour(Array.from({length:181},(_,i)=>{const a=i/180*TAU-Math.PI/2;return{x:DOT_RADIUS*Math.cos(a),y:DOT_Y+DOT_RADIUS*Math.sin(a)}}));
 // Pose-to-pose scoring, performed as continuous straight-ahead pen motion.
 const definitions=[
  {stage:'spark',strokes:[spark],frames:[20],travel:8,anticipate:4,follow:5,hold:5},
  {stage:'chaotic',strokes:[chaos],frames:[62],profile:'flow',travel:10,anticipate:4,follow:8,hold:24},
  {stage:'bridge',strokes:bridge,frames:[10,10,12,24,5],travel:10,anticipate:5,lift:2,follow:8,hold:12},
  {stage:'handshake',strokes:[handshake],frames:[76],travel:10,anticipate:4,follow:8,hold:24},
  {stage:'brand',strokes:[glyph,dot],frames:[46,7],travel:12,anticipate:4,lift:8,follow:9,hold:42},
 ];
 let at=0;for(const p of definitions){let time=0;p.events=[];p.travel*=FRAME;p.anticipate*=FRAME;p.follow*=FRAME;p.hold*=FRAME;for(let i=0;i<p.strokes.length;i++){if(i){const span=(p.lift||2)*FRAME;p.events.push({type:'lift',from:p.strokes[i-1].points.at(-1),to:p.strokes[i].points[0],at:time,duration:span});time+=span}const span=p.frames[i]*FRAME;p.events.push({type:'draw',stroke:p.strokes[i],index:i,at:time,duration:span,profile:p.frames[i]<=10?'detail':p.profile||'main'});time+=span}p.drawTime=time;p.start=at;p.end=at+p.travel+p.anticipate+time+p.follow+p.hold;at=p.end;phases.push(p)}duration=at;ready=true;resize();refresh();}
function state(time){const t=((time%duration)+duration)%duration,index=phases.findIndex(p=>t<p.end);return{index,phase:phases[index],t,local:t-phases[index].start}}
function curve(a,b,t){const bend=Math.min(.13,Math.hypot(b.x-a.x,b.y-a.y)*.16),c={x:a.x+(b.x-a.x)*.35,y:a.y-bend},d={x:a.x+(b.x-a.x)*.75,y:b.y-bend},u=1-t;return{x:u*u*u*a.x+3*u*u*t*c.x+3*u*t*t*d.x+t*t*t*b.x,y:u*u*u*a.y+3*u*u*t*c.y+3*u*t*t*d.y+t*t*t*b.y}}
function screen(p){return{x:width/2+p.x*unit,y:height*.54+p.y*unit}}
function trace(stroke,start,end){const a=Math.max(0,start),b=Math.min(stroke.length,end);if(b<=a)return false;ctx.beginPath();let p=screen(pointAt(stroke,a));ctx.moveTo(p.x,p.y);for(let i=1;i<stroke.points.length;i++)if(stroke.distance[i]>a&&stroke.distance[i]<b){p=screen(stroke.points[i]);ctx.lineTo(p.x,p.y)}p=screen(pointAt(stroke,b));ctx.lineTo(p.x,p.y);return true}
function ink(stroke,start,end,alpha=1){if(!trace(stroke,start,end))return;ctx.globalAlpha=alpha;ctx.strokeStyle='rgba(63,213,194,.24)';ctx.lineWidth=3.2;ctx.shadowColor='#49dac4';ctx.shadowBlur=9;ctx.stroke();ctx.strokeStyle='#8de5d9';ctx.lineWidth=1.05;ctx.shadowBlur=2;ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1}
// Only the little moving light stretches. The figures stay on model.
function head(p,alpha=1,tangent={x:1,y:0},speed=0){const q=screen(p),stretch=1+.65*clamp(speed/2.5);ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.atan2(tangent.y,tangent.x));ctx.globalAlpha=alpha;ctx.beginPath();ctx.ellipse(0,0,1.55*stretch,1.55/stretch,0,0,TAU);ctx.fillStyle='#d9fff6';ctx.shadowColor='#5fe9ce';ctx.shadowBlur=9;ctx.fill();ctx.restore()}
function highlight(stroke,at,length=.1,alpha=1){for(let i=0;i<16;i++){const end=at-length*i/16,start=Math.max(0,end-length/16);if(end<=0||!trace(stroke,start,end))continue;const a=(1-i/16)**1.5*alpha;ctx.strokeStyle='rgba(220,255,246,'+a*.9+')';ctx.lineWidth=1.4;ctx.shadowColor='#6ce9d0';ctx.shadowBlur=5*a;ctx.stroke()}ctx.shadowBlur=0}
function oldFigure(p,amount){const total=p.strokes.reduce((n,s)=>n+s.length,0);let consumed=amount*total;for(const s of p.strokes){ink(s,consumed,s.length,p.stage==='chaotic'?.85:1);consumed=Math.max(0,consumed-s.length)}}
function render(time){if(!ready)return;ctx.clearRect(0,0,width,height);unit=Math.min(width*.68,height*.84,355);ctx.lineCap='round';ctx.lineJoin='round';const s=state(time),p=s.phase,drawTime=s.local-p.travel-p.anticipate,first=p.strokes[0],previous=phases[(s.index-1+phases.length)%phases.length];host.dataset.stage=p.stage;host.dataset.drawProgress=String(clamp(drawTime/p.drawTime).toFixed(3));
 const firstCycle=s.index===0&&time<duration,retire=p.travel+p.anticipate*.8;
 if(s.local<retire&&!firstCycle)oldFigure(previous,ease(s.local/retire));
 if(s.local<p.travel){const start=firstCycle?{x:-.7,y:.08}:previous.strokes.at(-1).points.at(-1),t=ease(s.local/p.travel),q=curve(start,first.points[0],t),before=curve(start,first.points[0],Math.max(0,t-.01)),after=curve(start,first.points[0],Math.min(1,t+.01));head(q,1,{x:after.x-before.x,y:after.y-before.y},Math.sin(Math.PI*t)*2);return}
 if(drawTime<0){const t=(s.local-p.travel)/p.anticipate,a=first.points[0],b=pointAt(first,.025),len=Math.hypot(b.x-a.x,b.y-a.y)||1,back=.022*Math.sin(Math.PI*t)**2;head({x:a.x-(b.x-a.x)/len*back,y:a.y-(b.y-a.y)/len*back},1,{x:b.x-a.x,y:b.y-a.y});return}
 let tip=null,active=null,distance=0,speed=0;
 for(const event of p.events){if(event.type==='lift'){if(drawTime>=event.at&&drawTime<event.at+event.duration){tip=curve(event.from,event.to,ease((drawTime-event.at)/event.duration));active=null;break}continue}if(drawTime<event.at)break;const progress=clamp((drawTime-event.at)/event.duration),end=distanceAt(event.stroke,progress,event.profile);ink(event.stroke,0,end,p.stage==='chaotic'?.85:1);tip=pointAt(event.stroke,end);active=event.stroke;distance=end;speed=(distanceAt(active,clamp(progress+.005),event.profile)-distanceAt(active,clamp(progress-.005),event.profile))/(event.duration*.00001);if(progress<1)break;}
 if(active){const a=pointAt(active,Math.max(0,distance-.006)),b=pointAt(active,Math.min(active.length,distance+.006)),tangent={x:b.x-a.x,y:b.y-a.y};if(drawTime<p.drawTime){highlight(active,distance,.055+.055*clamp(speed/2));head(tip,1,tangent,speed)}else{const settle=clamp((drawTime-p.drawTime)/p.follow);highlight(active,distance,.10*(1-settle)**2,1-settle);if(settle<1)head(tip,1-ease(settle),tangent,0)}}else if(tip&&drawTime<p.drawTime)head(tip);
}
function displayTime(){return preview?staticTime:reduced.matches&&elapsed===0?duration-500:elapsed}
function resize(){const r=host.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render(displayTime())}
const paused=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
function tick(now){raf=0;if(!visible||paused()||document.hidden){last=0;return}if(last)elapsed+=Math.min(now-last,80);last=now;render(elapsed);raf=requestAnimationFrame(tick)}
function refresh(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;render(displayTime());host.dataset.playing=String(!preview&&visible&&!paused()&&!document.hidden);if(ready&&!preview&&visible&&!paused()&&!document.hidden)raf=requestAnimationFrame(tick)}
new ResizeObserver(resize).observe(host);new IntersectionObserver(e=>{visible=e[0].isIntersecting;refresh()},{rootMargin:'80px'}).observe(host);document.addEventListener('telotia-motion',refresh);document.addEventListener('visibilitychange',refresh);reduced.addEventListener('change',refresh);prepare();
})();
