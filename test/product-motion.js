const L=h=>Math.max(0,Math.min(1,h)),T=h=>{const s=L(h);return s*s*s*(s*(s*6-15)+10)};function q(h=720){const s=([o,r,y])=>[10*(r-o),o*(28-y)-r,o*r-8*y/3],i=(o,r,y)=>o.map((x,v)=>x+r[v]*y);let m=[.1,0,0];const c=[];for(let o=0;o<12e3;o++){const r=s(m),y=s(i(m,r,.0025)),x=s(i(m,y,.0025)),v=s(i(m,x,.005));m=m.map((I,k)=>I+.005/6*(r[k]+2*y[k]+2*x[k]+v[k])),o>=2e3&&c.push(m)}const f=[];for(let o=1;o<c.length-1;o++)c[o-1][2]>c[o][2]&&c[o+1][2]>c[o][2]&&f.push(o);let u,p=1/0;for(let o=0;o+4<f.length;o++){const r=c.slice(f[o],f[o+4]+1);if(Array.from({length:4},(k,S)=>c.slice(f[o+S],f[o+S+1]).reduce((_,D)=>D[2]>_[2]?D:_)[0]).filter(k=>k<0).length!==2)continue;const x=r[0],v=r.at(-1),I=Math.hypot(x[0]-v[0],x[1]-v[1],x[2]-v[2]);I<p&&(u=r,p=I)}if(!u)throw new Error("Balanced two-wing motion orbit unavailable");const l=u.map(([o,r,y])=>{const x=1.25*o+.2*r,v=(28-y)*.8;return{x:x*Math.cos(-.18)-v*Math.sin(-.18),y:x*Math.sin(-.18)+v*Math.cos(-.18)}}),M={x:l[0].x-l.at(-1).x,y:l[0].y-l.at(-1).y};l.forEach((o,r)=>{const y=T(r/(l.length-1));o.x+=M.x*y,o.y+=M.y*y});const b=l.map(o=>o.x),g=l.map(o=>o.y),A=Math.min(...b),E=Math.max(...b),P=Math.min(...g),w=Math.max(...g),a=.78/Math.max(E-A,w-P),d=(A+E)/2,t=(P+w)/2,e=[0];for(let o=1;o<l.length;o++)e.push(e[o-1]+Math.hypot(l[o].x-l[o-1].x,l[o].y-l[o-1].y));let n=1;return Array.from({length:h},(o,r)=>{const y=r/(h-1)*e.at(-1);for(;n<l.length-1&&e[n]<y;)n++;const x=(y-e[n-1])/(e[n]-e[n-1]);return{x:(l[n-1].x*(1-x)+l[n].x*x-d)*a,y:(l[n-1].y*(1-x)+l[n].y*x-t)*a}})}const O=new WeakMap;function F(h){const s=O.get(h);if(s)return s;const i=h.orbit[0],m=h.orbit[1],c=Math.hypot(m.x-i.x,m.y-i.y),f={x:(m.x-i.x)/c,y:(m.y-i.y)/c},u={x:-.17,y:.06},p={x:-.05,y:.06},l={x:i.x-.14*f.x,y:i.y-.14*f.y},M=[];for(let t=0;t<=160;t++){const e=t/160;M.push({x:u.x-.23*(1-e),y:u.y+.012*Math.sin(Math.PI*e)**2*Math.sin(e*Math.PI*2)})}const b=M.length-1;for(let t=1;t<=480;t++){const e=t/480,n=1-e;M.push({x:n**3*u.x+3*n*n*e*p.x+3*n*e*e*l.x+e**3*i.x,y:n**3*u.y+3*n*n*e*p.y+3*n*e*e*l.y+e**3*i.y-.07*Math.sin(Math.PI*e)**3})}const g=[0];for(let t=1;t<M.length;t++)g.push(g[t-1]+Math.hypot(M[t].x-M[t-1].x,M[t].y-M[t-1].y));const A=g.at(-1),E=A-g[b],P=[...M,...h.orbit.slice(1)];for(let t=M.length;t<P.length;t++)g.push(g[t-1]+Math.hypot(P[t].x-P[t-1].x,P[t].y-P[t-1].y));const w=g.at(-1)-A,d={orbitLength:w,flightLength:E,sample:t=>{if(t>=0){const y=L(t/w)*(h.orbit.length-1),x=Math.floor(y),v=Math.min(h.orbit.length-1,x+1),I=y-x;return{x:h.orbit[x].x*(1-I)+h.orbit[v].x*I,y:h.orbit[x].y*(1-I)+h.orbit[v].y*I}}const e=Math.max(0,Math.min(g.at(-1),t+A));let n=0,o=g.length-1;for(;o-n>1;){const y=n+o>>1;g[y]<=e?n=y:o=y}const r=(e-g[n])/(g[o]-g[n]||1);return{x:P[n].x*(1-r)+P[o].x*r,y:P[n].y*(1-r)+P[o].y*r}}};return O.set(h,d),d}function R(h,s){const i=F(s),m=T((h-2400)/5200),c=-i.flightLength+(i.flightLength+i.orbitLength)*m;return{...i,head:c,start:Math.min(c-.23,0),finished:m===1}}function Y(h,s,i){const m=h.length-1;let c=0,f=1,u=1/0;for(const p of[1,-1])for(let l=0;l<m;l++){let M=0;for(let b=0;b<m;b+=4){const g=h[(l+p*b+m)%m];M+=.55*((g.x-s[b].x)**2+(g.y-s[b].y)**2)+.45*((g.x-i[b].x)**2+(g.y-i[b].y)**2)}M<u&&(u=M,c=l,f=p)}return h.map((p,l)=>({...h[(c+f*l+m)%m],move:l===0}))}function V(h,s,i,m=!1){const c=s.bridge.length,f=(h%19e3+19e3)%19e3,u=i??Array.from({length:c},()=>({x:0,y:0,move:!1,join:1}));u.forEach(a=>{a.alpha=1});let p="bridge",l=c,M=!1;const b=(a,d)=>{u[a].join=d,u[a].move=d<.999999},g=(a,d,t)=>{const e=T(t);for(let n=0;n<c;n++)u[n].x=a[n].x*(1-e)+d[n].x*e,u[n].y=a[n].y*(1-e)+d[n].y*e,b(n,(a[n].move?0:1)*(1-e)+(d[n].move?0:1)*e)},A=a=>{const d=a/(c-1);return{x:-.37+.74*d,y:.025*Math.sin(d*Math.PI*2)}},E=m?R(f,s):void 0,P=a=>E.sample(E.start+(E.head-E.start)*a),w=a=>{const d=E.start+(E.head-E.start)*a;return d>=0?1:1-T(-E.start/.074)*(1-T((d-E.start)/.074))};if(f<1400)g(s.bridge,s.bridge,0);else if(f<(m?2800:3300)){p="gather";const a=T((f-1400)/(m?1400:1900)),d=Math.sin(Math.PI*a);for(let t=0;t<c;t++){const e=t/(c-1),n=s.bridge[t],o=m?P(e):A(t);u[t].x=n.x*(1-a)+o.x*a+.035*Math.sin(e*Math.PI*2)*d,u[t].y=n.y*(1-a)+o.y*a-.06*Math.sin(e*Math.PI*3)*d,b(t,n.move?a:1),m&&(u[t].alpha=1-T((f-2300)/500)*(1-w(e)))}}else if(m&&f<8300){p=E.finished?"orbit-hold":E.head<0?"drift":"orbit";for(let a=0;a<c;a++){const d=a/(c-1),t=P(d);u[a].x=t.x,u[a].y=t.y,b(a,1),u[a].alpha=w(d)}M=E.finished}else if(f<4e3){p="thread";const a=T((f-3300)/700),d=s.orbit[0];for(let t=0;t<c;t++){const e=A(t),n=d;u[t].x=e.x*(1-a)+n.x*a,u[t].y=e.y*(1-a)+n.y*a-Math.sin(Math.PI*a)*.045*Math.sin(t/c*Math.PI),b(t,1)}}else if(f<8300){const a=L((f-4e3)/3600);p=a<1?"orbit":"orbit-hold",l=1+T(a)*(c-1);const d=.007*Math.sin(Math.PI*a);for(let t=0;t<c;t++){const e=t/(c-1),n=s.orbit[t];u[t].x=n.x+d*Math.sin(e*Math.PI*4+a*4),u[t].y=n.y+d*Math.sin(e*Math.PI*6-a*4),b(t,1)}M=a===1}else f<11200?(p="form-star",g(s.orbit,s.star,(f-8300)/2900),M=!0):f<12300?(p="star",g(s.star,s.star,0),M=!0):f<15300?(p="handshake-morph",g(s.star,s.handshake,(f-12300)/3e3)):f<16600?(p="handshake",g(s.handshake,s.handshake,0)):(p="bridge-morph",g(s.handshake,s.bridge,(f-16600)/2400));return{points:u,visible:l,closed:M,stage:p}}const C=720;async function W(h){const s=await fetch(`assets/morph/${h}.svg`);if(!s.ok)throw new Error(`Motion asset unavailable: ${h}`);const i=new DOMParser().parseFromString(await s.text(),"image/svg+xml"),m=Array.from(i.querySelectorAll("path")).filter(p=>p.getAttribute("stroke")!=="none"),c=m.map(p=>p.getTotalLength()),f=c.reduce((p,l)=>p+l,0);let u=-1;return Array.from({length:C},(p,l)=>{let M=l/(C-1)*f,b=0;for(;b<m.length-1&&M>c[b];)M-=c[b++];const g=m[b].getPointAtLength(M),A=b!==u;return u=b,{x:(g.x-12)/24,y:(g.y-12)/24,move:A}})}
async function startProductMotion(){
 const host=document.querySelector('[data-product-motion]'),canvas=host?.querySelector('canvas');
 if(!host||!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let shapes;try{const [handshake,bridge,starPath]=await Promise.all(['handshake','building-bridge','cross-star'].map(W)),orbit=q();shapes={handshake,bridge,star:Y(starPath,orbit,handshake),orbit};}catch(error){console.warn('Product motion unavailable',error);return}
 const points=Array.from({length:C},()=>({x:0,y:0,move:false}));
 let width=0,height=0,frame=0,last=0,elapsed=0,inView=false,mouseX=0,mouseY=0,targetX=0,targetY=0,productPulse=-5000;
 const paused=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
 function resize(){
  const rect=host.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render(elapsed);
 }
 function render(time){
  ctx.clearRect(0,0,width,height);mouseX+=(targetX-mouseX)*.04;mouseY+=(targetY-mouseY)*.04;
  const state=V(time,shapes,points,true),scale=Math.min(height*.92,300),cx=width/2+mouseX,cy=height*.48+mouseY;
  host.dataset.stage=state.stage;
  // Existing horizon artwork remains below the live, original shape paths.
  // Fine energy filaments carry the movement from the panorama into the center.
  for(let side of [-1,1])for(let line=0;line<7;line++){
   const startX=cx+side*(width*.51),startY=height*(.38+line*.065);
   const endX=cx+side*scale*.4,endY=cy+Math.sin(line*.75+time*.00022)*20;
   const bendX=cx+side*(width*.25),bendY=cy+Math.sin(time*.00018+line*.7)*35;
   const pulse=Math.max(0,1-(time-productPulse)/1500);const alpha=.09+(line%3)*.045+pulse*.13;
   ctx.beginPath();ctx.moveTo(startX,startY);ctx.quadraticCurveTo(bendX,bendY,endX,endY);
   ctx.strokeStyle='rgba(70,218,204,'+alpha+')';ctx.lineWidth=.65;ctx.shadowColor='#36bfae';ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
   if(!paused()){
    const t=(time/(6500+line*400)+line*.137)%1,u=1-t;
    const x=u*u*startX+2*u*t*bendX+t*t*endX,y=u*u*startY+2*u*t*bendY+t*t*endY;
    ctx.beginPath();ctx.fillStyle='rgba(178,255,240,'+Math.sin(t*Math.PI)*.7+')';ctx.arc(x,y,.9,0,Math.PI*2);ctx.fill();
   }
  }
  const visible=Math.max(2,Math.floor(state.visible));
  function trace(){
   ctx.beginPath();for(let n=0;n<visible;n++){const p=points[n],x=cx+p.x*scale,y=cy+p.y*scale;if(!n||p.move)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
   if(state.closed)ctx.closePath();
  }
  ctx.lineCap='round';ctx.lineJoin='round';
  trace();ctx.strokeStyle='rgba(60,227,207,.28)';ctx.lineWidth=5;ctx.shadowColor='#52dfcc';ctx.shadowBlur=22;ctx.stroke();
  trace();ctx.strokeStyle='rgba(95,231,215,.9)';ctx.lineWidth=1.3;ctx.shadowBlur=7;ctx.stroke();
  trace();ctx.strokeStyle='rgba(214,255,246,.78)';ctx.lineWidth=.55;ctx.shadowBlur=0;ctx.stroke();
  const tip=points[visible-1];if(!paused()&&tip){ctx.beginPath();ctx.fillStyle='#ddfff7';ctx.shadowColor='#5aead5';ctx.shadowBlur=15;ctx.arc(cx+tip.x*scale,cy+tip.y*scale,1.8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
 }
 function tick(now){frame=0;if(paused()||!inView||document.hidden){last=0;render(elapsed);return}if(last)elapsed+=Math.min(now-last,60);last=now;render(elapsed);frame=requestAnimationFrame(tick)}
 function refresh(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;render(elapsed);host.dataset.playing=String(!paused()&&inView&&!document.hidden);if(!paused()&&inView&&!document.hidden)frame=requestAnimationFrame(tick)}
 host.addEventListener('pointermove',event=>{if(paused())return;const r=host.getBoundingClientRect();targetX=(event.clientX-r.left-r.width/2)*.012;targetY=(event.clientY-r.top-r.height/2)*.025});
 host.addEventListener('pointerleave',()=>{targetX=targetY=0});
 document.addEventListener('telotia-product-change',()=>{productPulse=elapsed;render(elapsed)});document.addEventListener('telotia-motion',refresh);reduced.addEventListener('change',refresh);document.addEventListener('visibilitychange',refresh);
 new ResizeObserver(resize).observe(host);
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;refresh()},{rootMargin:'80px'}).observe(host);
 host.dataset.ready='true';resize();refresh();
}
startProductMotion();
