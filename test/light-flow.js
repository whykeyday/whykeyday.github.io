(() => {
'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const stopped=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
const instances=[];
function createField(section,selector,kind){
 const image=section?.querySelector(selector);if(!image)return;
 const canvas=document.createElement('canvas');canvas.className='flowing-light-canvas';canvas.setAttribute('aria-hidden','true');section.append(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const mask=document.createElement('canvas'),mc=mask.getContext('2d');
 let w=0,h=0,dpr=1,visible=false,raf=0,last=0,time=0;
 const points=[];
 function frameGeometry(){
  const area=section.getBoundingClientRect(),rect=image.getBoundingClientRect();
  return {x:rect.left-area.left,y:rect.top-area.top,w:rect.width,h:rect.height};
 }
 function resize(){
  const box=section.getBoundingClientRect();w=box.width;h=box.height;dpr=Math.min(devicePixelRatio||1,1.25);
  for(const c of [canvas,mask]){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr)}
  ctx.setTransform(dpr,0,0,dpr,0,0);mc.setTransform(dpr,0,0,dpr,0,0);draw(time);
 }
 function pathAt(t,lane,g){
  if(kind==='loop'){
   const angle=t*Math.PI*2,spread=(lane-7)*.003;
   const xx=Math.sin(angle)*.34,yy=Math.sin(angle*2)*(.135+spread);
   const a=-.64,x=xx*Math.cos(a)-yy*Math.sin(a),y=xx*Math.sin(a)+yy*Math.cos(a);
   return {x:g.x+g.w*(.51+x),y:g.y+g.h*(.50+y)};
  }
  const x=t*2-1,tilt=kind==='contact'?-1:1;
  const horizon=kind==='contact'?.324:.676;
  let y;
  if(lane<3)y=horizon+tilt*(.10*x*x+(lane-1)*.003);
  else{
   const k=(lane-3)/9;
   y=horizon+tilt*(-(.09+k*.22)*Math.pow(Math.abs(x),1.2)+Math.sin(t*Math.PI*2+k*5)*.035*Math.abs(x));
  }
  return {x:g.x+g.w*t,y:g.y+g.h*y};
 }
 function draw(ms){
  ctx.clearRect(0,0,w,h);mc.clearRect(0,0,w,h);
  if(!image.complete||!image.naturalWidth||stopped())return;
  const g=frameGeometry(),lanes=kind==='loop'?16:12;
  mc.lineCap='round';mc.lineJoin='round';
  for(let lane=0;lane<lanes;lane++){
   const duration=(kind==='loop'?11000:14000)+lane*850;
   const head=(ms/duration+lane*.109)%1,tail=kind==='loop'?.13:.16;
   // A moving head and a long dim tail travel continuously along the existing light field.
   for(let j=0;j<18;j++){
    const t=(head-tail+j*tail/18+1)%1,next=(t+tail/18)%1;
    if(next<t)continue;
    const p=pathAt(t,lane,g),q=pathAt(next,lane,g),alpha=Math.pow(j/18,1.5)*.8;
    mc.beginPath();mc.moveTo(p.x,p.y);mc.lineTo(q.x,q.y);
    mc.strokeStyle='rgba(190,255,242,'+alpha+')';mc.lineWidth=kind==='loop'?g.w*.018:g.h*.017;
    mc.stroke();
   }
  }
  // Use the original raster as the mask: the highlights only illuminate its real filaments.
  mc.globalCompositeOperation='source-in';
  if(kind==='contact'){mc.save();mc.translate(g.x,g.y+g.h);mc.scale(1,-1);mc.drawImage(image,0,0,g.w,g.h);mc.restore()}
  else mc.drawImage(image,g.x,g.y,g.w,g.h);
  mc.globalCompositeOperation='source-over';
  ctx.globalCompositeOperation='screen';ctx.globalAlpha=.9;
  ctx.filter='blur(8px) brightness(2.2)';ctx.drawImage(mask,0,0,w,h);ctx.filter='none';
  ctx.globalCompositeOperation='source-over';
  section.dataset.lightFlow='running';
 }
 function tick(now){
  raf=0;if(stopped()||!visible||document.hidden){last=0;ctx.clearRect(0,0,w,h);return}
  if(last&&now-last<32){raf=requestAnimationFrame(tick);return}
  if(last)time+=Math.min(now-last,80);last=now;draw(time);raf=requestAnimationFrame(tick);
 }
 function refresh(){
  if(raf)cancelAnimationFrame(raf);raf=0;last=0;
  if(stopped()||!visible||document.hidden){ctx.clearRect(0,0,w,h);section.dataset.lightFlow='paused'}
  else raf=requestAnimationFrame(tick);
 }
 new ResizeObserver(resize).observe(section);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh()},{rootMargin:'80px'}).observe(section);
 image.addEventListener('load',()=>{resize();refresh()});
 instances.push({refresh});resize();refresh();
}
createField(document.querySelector('.hero'),'.hero-art img','hero');
createField(document.querySelector('.contact'),'.contact-art img','contact');
createField(document.querySelector('.connection-art'),'img','loop');
document.addEventListener('telotia-motion',()=>instances.forEach(i=>i.refresh()));
document.addEventListener('visibilitychange',()=>instances.forEach(i=>i.refresh()));
reduced.addEventListener('change',()=>instances.forEach(i=>i.refresh()));
})();