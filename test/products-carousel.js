(() => {
'use strict';
const section=document.querySelector('#products'),viewport=section.querySelector('[data-product-carousel]'),slots=[...section.querySelectorAll('[data-product-slot]')],counter=section.querySelector('[data-product-counter]'),prev=section.querySelector('[data-product-prev]'),next=section.querySelector('[data-product-next]'),progress=section.querySelector('.product-timer span'),announcement=section.querySelector('[data-product-announcement]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),narrow=matchMedia('(max-width:760px)');
let products=[],index=0,visible=false,hover=false,focus=false,elapsed=0,last=0,raf=0,busy=false,pending=null;
const duration=8500;
const language=()=>document.documentElement.lang.startsWith('fr')?'fr':'en';
const local=(value)=>typeof value==='string'?value:value?.[language()]||value?.en||'';
const count=()=>Math.min(products.length,narrow.matches?1:2);
const paused=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
function render(){
 const fr=language()==='fr',number=n=>String(n+1).padStart(2,'0');
 slots.forEach((slot,position)=>{
  slot.hidden=position>=count();if(slot.hidden)return;
  const i=(index+position)%products.length,item=products[i];
  slot.querySelector('.index').textContent=number(i);slot.querySelector('h3').textContent=local(item.title);
  slot.querySelector('.status').textContent=local(item.status);slot.querySelector('.product-description').textContent=local(item.description);
  slot.setAttribute('aria-label',local(item.title));
 });
 const first=number(index),lastVisible=number((index+count()-1)%products.length);
 counter.textContent=(count()>1?first+'–'+lastVisible:first)+' / '+String(products.length).padStart(2,'0');
 prev.setAttribute('aria-label',fr?'Produits précédents':'Previous products');next.setAttribute('aria-label',fr?'Produits suivants':'Next products');
 viewport.setAttribute('aria-label',fr?'Présentation des produits':'Product showcase');
 viewport.setAttribute('aria-roledescription',fr?'carrousel':'carousel');
 prev.disabled=next.disabled=products.length<=count();
 section.dataset.productIndex=String(index+1);
}
function rotate(delta,manual=false){
 if(busy||products.length<=count())return;
 section.dataset.autoRotations=String(Number(section.dataset.autoRotations||0)+(manual?0:1));
 busy=true;elapsed=0;index=(index+delta+products.length)%products.length;
 document.dispatchEvent(new CustomEvent('telotia-product-change',{detail:{index,product:products[index].id}}));
 const commit=()=>{render();viewport.classList.remove('switching');busy=false;if(manual)announcement.textContent=[...slots].filter(s=>!s.hidden).map(s=>s.querySelector('h3').textContent).join(', ');};
 if(paused()){commit();return}
 viewport.classList.add('switching');setTimeout(commit,220);
}
function tick(now){
 raf=0;if(!products.length)return;
 const canRun=visible&&!hover&&!focus&&!paused()&&!document.hidden&&products.length>count();
 section.dataset.rotation=canRun?'playing':paused()?'paused':focus?'focus':hover?'hover':'offscreen';
 if(last&&canRun)elapsed+=now-last;last=now;
 progress.style.transform='scaleX('+Math.min(1,elapsed/duration)+')';
 if(elapsed>=duration&&canRun)rotate(1);
 if(visible&&!paused()&&!document.hidden)raf=requestAnimationFrame(tick);
}
function refresh(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;if(visible&&!paused()&&!document.hidden)raf=requestAnimationFrame(tick)}
let touchStart=null;
viewport.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')touchStart={x:event.clientX,y:event.clientY}});
viewport.addEventListener('pointercancel',()=>{touchStart=null});
viewport.addEventListener('pointerup',event=>{if(!touchStart)return;const dx=event.clientX-touchStart.x,dy=event.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)rotate(dx<0?1:-1,true)});
prev.addEventListener('click',()=>rotate(-1,true));next.addEventListener('click',()=>rotate(1,true));
viewport.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();rotate(event.key==='ArrowRight'?1:-1,true)}});
section.addEventListener('pointerenter',()=>{hover=true});section.addEventListener('pointerleave',()=>{hover=false;last=0});
section.addEventListener('focusin',()=>{focus=true});section.addEventListener('focusout',event=>{if(!section.contains(event.relatedTarget)){focus=false;last=0}});
document.addEventListener('telotia-motion',refresh);document.addEventListener('visibilitychange',refresh);
document.addEventListener('telotia-language',()=>{announcement.textContent='';if(products.length)render()});
reduced.addEventListener('change',refresh);narrow.addEventListener('change',()=>{if(products.length)render();elapsed=0;refresh()});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh()},{threshold:.1}).observe(section);
fetch('products.json?v=7').then(response=>{if(!response.ok)throw Error('Product data unavailable');return response.json()}).then(data=>{
 if(!Array.isArray(data.products)||!data.products.length)return;
 products=data.products;render();section.dataset.carouselReady='true';refresh();
}).catch(error=>{console.warn(error);prev.disabled=next.disabled=true});
})();