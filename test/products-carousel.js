(() => {
'use strict';
const section=document.querySelector('#products'),wheel=section.querySelector('[data-product-carousel]'),track=wheel.querySelector('.wheel-items'),counter=section.querySelector('[data-product-counter]'),announce=section.querySelector('[data-product-announcement]');
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),small=matchMedia('(max-width:760px)');
const paused=()=>reduced.matches||document.documentElement.classList.contains('motion-paused'),lang=()=>document.documentElement.lang.startsWith('fr')?'fr':'en';
let products=[],nodes=[],position=0,target=0,last=0,raf=0,visible=false,hover=false,focus=false,drag=null,selected=-1,lastInput=0,snapTimer=0;
const rowHeight=()=>small.matches?278:Math.max(286,Math.min(340,wheel.clientWidth*.44)),local=value=>typeof value==='string'?value:value?.[lang()]||value?.en||'';
function build(){
 track.replaceChildren();nodes=[];
 const copies=products.length>1?3:1;
 for(let cycle=0;cycle<copies;cycle++)for(let i=0;i<products.length;i++){
  const article=document.createElement('article');article.className='product-wheel-item';
  const num=document.createElement('p');num.className='wheel-number';num.textContent=String(i+1).padStart(2,'0');
  const title=document.createElement('h3');title.textContent=local(products[i].title);
  const info=document.createElement('div'),status=document.createElement('p'),description=document.createElement('p');status.textContent=local(products[i].status);description.textContent=local(products[i].description);info.append(status,description);
  article.append(num,title,info);track.append(article);nodes.push({article,index:i,cycle});
 }
 wheel.setAttribute('aria-label',lang()==='fr'?'Produits. Faites défiler ou glissez pour parcourir.':'Products. Scroll or drag to browse.');
 wheel.setAttribute('aria-roledescription',lang()==='fr'?'rouleau de produits':'product wheel');draw();
}
function draw(){
 if(!products.length)return;
 const n=products.length,h=rowHeight(),center=wheel.clientWidth/2,base=Math.floor(position/n),nearest=Math.round(position),active=((nearest%n)+n)%n;
 wheel.style.setProperty('--product-step',h+'px');
 for(const item of nodes){
  const absolute=n>1?(base+item.cycle-1)*n+item.index:0,distance=(absolute-position)*h,y=center-(h-48)/2+distance;
  item.article.style.transform='translate3d('+y+'px,0,0)';
  item.article.style.opacity=String(1-.65*Math.min(1,Math.abs(distance)/h));
  item.article.classList.toggle('is-current',absolute===nearest);
  item.article.setAttribute('aria-hidden',String(y+h<0||y>wheel.clientWidth));
 }
 counter.textContent=String(active+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');
 section.dataset.productIndex=String(active+1);
 if(active!==selected){selected=active;document.dispatchEvent(new CustomEvent('telotia-product-change',{detail:{index:active,product:products[active].id}}))}
}
function tick(now){
 raf=0;
 if(last){const dt=Math.min((now-last)/1000,.12);
  if(visible&&!paused()&&!hover&&!focus&&!drag&&!document.hidden&&products.length>1&&now-lastInput>2400)target+=dt*.075;
  position=paused()?target:position+(target-position)*(1-Math.exp(-dt*(drag?28:12)));
 }
 last=now;draw();
 if(visible&&!document.hidden&&(!paused()||Math.abs(position-target)>.0001))raf=requestAnimationFrame(tick);
}
function refresh(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;if(paused())position=target;draw();if(visible&&!document.hidden)raf=requestAnimationFrame(tick)}
function manual(value){
 lastInput=performance.now();target=value;if(paused()){position=target;draw()}if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(tick);
 clearTimeout(snapTimer);snapTimer=setTimeout(()=>{target=Math.round(target);if(paused())position=target;draw();announce.textContent=local(products[((Math.round(target)%products.length)+products.length)%products.length].title);refresh()},180);
}
wheel.addEventListener('wheel',event=>{
 if(event.ctrlKey||products.length<2)return;
 const delta=(Math.abs(event.deltaY)>=Math.abs(event.deltaX)?event.deltaY:event.deltaX)*(event.deltaMode===1?16:event.deltaMode===2?rowHeight():1);
 if(!delta)return;event.preventDefault();manual(target+Math.max(-2,Math.min(2,delta/rowHeight()*.8)));
},{passive:false});
wheel.addEventListener('pointerdown',event=>{if(products.length<2||event.button!==0)return;drag={id:event.pointerId,x:event.clientX,start:target};lastInput=performance.now();wheel.setPointerCapture(event.pointerId);wheel.classList.add('dragging');clearTimeout(snapTimer)});
wheel.addEventListener('pointermove',event=>{if(drag?.id!==event.pointerId)return;target=drag.start-(event.clientX-drag.x)/rowHeight();lastInput=performance.now();if(paused()){position=target;draw()}if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(tick)});
function release(event){if(drag?.id!==event.pointerId)return;drag=null;wheel.classList.remove('dragging');manual(Math.round(target))}
wheel.addEventListener('pointerup',release);wheel.addEventListener('pointercancel',release);
wheel.addEventListener('keydown',event=>{let value;if(event.key==='ArrowDown'||event.key==='ArrowRight')value=Math.round(target)+1;else if(event.key==='ArrowUp'||event.key==='ArrowLeft')value=Math.round(target)-1;else if(event.key==='Home')value=0;else if(event.key==='End')value=products.length-1;else return;event.preventDefault();manual(value)});
wheel.addEventListener('pointerenter',()=>{hover=true});wheel.addEventListener('pointerleave',()=>{hover=false;lastInput=performance.now()});
wheel.addEventListener('focusin',()=>{focus=true});wheel.addEventListener('focusout',()=>{focus=false;lastInput=performance.now()});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh()},{threshold:.1}).observe(wheel);
new ResizeObserver(draw).observe(wheel);
document.addEventListener('telotia-motion',refresh);document.addEventListener('visibilitychange',refresh);reduced.addEventListener('change',refresh);small.addEventListener('change',draw);
document.addEventListener('telotia-language',()=>{announce.textContent='';if(products.length)build()});
fetch('products.json?v=10').then(r=>{if(!r.ok)throw Error('Product data unavailable');return r.json()}).then(data=>{if(!data.products?.length)return;products=data.products;build();section.dataset.carouselReady='true';refresh()}).catch(error=>console.warn(error));
})();