(() => {
'use strict';
const words = {"en":{"productsNav":"Products","productStatus":"In development","productTitle":"Coordination for pharmacy teams.","productBody":"Telotia is developing a product to help pharmacies and pharmacists coordinate professional resources.","productNote":"Product details will be shared here as they become available.","description":"Telotia is building tools to help people work with clarity and organizations collaborate with confidence.","skip":"Skip to content","nav":"Main navigation","language":"Language","homeNav":"Home","aboutNav":"About","approachNav":"Approach","companyNav":"Company","contactNav":"Contact","eyebrow":"Telotia / In development","headline":"Empowering people.\nConnecting organizations.","lead":"Helping professionals work more efficiently and organizations collaborate with confidence.","primary":"Explore our approach","secondary":"Get in touch","contactFooter":"Contact Telotia","context":"Professional support.\nThoughtful coordination.","nextApproach":"Our approach","approachLabel":"About / Our approach","approachTitle":"Built around the way\npeople work.","approachIntro":"Professional support involves more than finding the right expertise. Communication, context and responsibility also need to be clear.","pharmaciesTitle":"For pharmacies","pharmaciesBody":"A clearer way to coordinate the professional support their teams need.","pharmacistsTitle":"For pharmacists","pharmacistsBody":"Useful context and clear responsibility, with professional judgment staying in professional hands.","companyLabel":"About Telotia","companyTitle":"Purposeful innovation,\nstarting with pharmacy.","companyIntro":"Telotia is a technology company developing digital tools for professionals and organizations in healthcare.","companyStatement":"Technology that supports\npeople and care.","companyBody":"Our focus is practical: supporting professional expertise and making collaboration simpler.","contactLabel":"03 / Contact","contactTitle":"Better coordination\nstarts with listening.","contactIntro":"We welcome conversations with people who understand the everyday work of pharmacy.","contactInvitation":"For general enquiries and conversations:","footer":"Thoughtful technology · Better connections","clarityTitle":"Clarity","clarityBody":"Make information easier to understand, so people can see what matters and decide what comes next.","connectionPrincipleTitle":"Connection","connectionPrincipleBody":"Bring people and organizations closer through thoughtful, practical tools.","judgmentTitle":"Professional judgment","judgmentBody":"Support human decisions while keeping responsibility and expertise with the people doing the work.","productsTitle":"Products","productOne":"Product 1","productTwo":"Product 2","productSoon":"Stay tuned.","productNext":"Coming next","contactHeadline":"Better collaboration starts\nwith a conversation.","contactBody":"For partnership opportunities and professional inquiries, please contact our team.","landscapeAlt":"Abstract ink washes and fine contour lines expressing the connection between technology and care.","tableAlt":"An editorial illustration of hands working together with paper and a pencil."},"fr":{"productsNav":"Produits","productStatus":"En développement","productTitle":"La coordination pour les équipes en pharmacie.","productBody":"Telotia développe un produit pour aider les pharmacies et les pharmaciens à coordonner les ressources professionnelles.","productNote":"Les détails du produit seront présentés ici à mesure qu’ils seront disponibles.","description":"Telotia développe des outils pour aider les personnes à travailler avec clarté et les organisations à collaborer en confiance.","skip":"Aller au contenu","nav":"Navigation principale","language":"Langue","homeNav":"Accueil","aboutNav":"À propos","approachNav":"Approche","companyNav":"Entreprise","contactNav":"Contact","eyebrow":"Telotia / En développement","headline":"Donner aux personnes les moyens d’agir.\nRelier les organisations.","lead":"Aider les professionnels à travailler plus efficacement et les organisations à collaborer en toute confiance.","primary":"Découvrir notre approche","secondary":"Nous contacter","contactFooter":"Contacter Telotia","context":"Un soutien professionnel.\nUne coordination réfléchie.","nextApproach":"Notre approche","approachLabel":"À propos / Notre approche","approachTitle":"Pensé pour le travail\nau quotidien.","approachIntro":"Le soutien professionnel ne se limite pas à trouver la bonne expertise. La communication, le contexte et les responsabilités doivent aussi être clairs.","pharmaciesTitle":"Pour les pharmacies","pharmaciesBody":"Une façon plus claire de coordonner le soutien professionnel dont leurs équipes ont besoin.","pharmacistsTitle":"Pour les pharmaciens","pharmacistsBody":"Un contexte utile et des responsabilités claires. Le jugement professionnel demeure entre les mains des professionnels.","companyLabel":"À propos de Telotia","companyTitle":"L’innovation avec un but,\nen commençant par la pharmacie.","companyIntro":"Telotia est une entreprise technologique qui développe des outils numériques pour les professionnels et les organisations du secteur de la santé.","companyStatement":"La technologie au service\ndes personnes et des soins.","companyBody":"Notre priorité est concrète : soutenir l’expertise professionnelle et simplifier la collaboration.","contactLabel":"03 / Contact","contactTitle":"Mieux coordonner\ncommence par écouter.","contactIntro":"Nous souhaitons échanger avec les personnes qui connaissent le travail quotidien en pharmacie.","contactInvitation":"Pour toute question générale ou pour échanger :","footer":"Une technologie réfléchie · De meilleures connexions","clarityTitle":"Clarté","clarityBody":"Rendre l’information plus facile à comprendre, pour voir ce qui compte et choisir la suite.","connectionPrincipleTitle":"Connexion","connectionPrincipleBody":"Rapprocher les personnes et les organisations grâce à des outils réfléchis et pratiques.","judgmentTitle":"Jugement professionnel","judgmentBody":"Soutenir les décisions humaines en laissant la responsabilité et l’expertise aux personnes qui font le travail.","productsTitle":"Produits","productOne":"Produit 1","productTwo":"Produit 2","productSoon":"À découvrir bientôt.","productNext":"À venir","contactHeadline":"Mieux collaborer commence\npar une conversation.","contactBody":"Pour toute demande professionnelle ou proposition de partenariat, veuillez contacter notre équipe.","landscapeAlt":"Des lavis abstraits et de fines courbes évoquant le lien entre technologie et soins.","tableAlt":"Une illustration éditoriale de mains travaillant ensemble avec du papier et un crayon."}};
let language = 'en';
const root = document.documentElement;
const media = matchMedia('(prefers-reduced-motion: reduce)');
let paused = media.matches;
try { const saved = localStorage.getItem('telotia-obsidian-motion'); if(saved !== null) paused = saved === 'paused' || media.matches; } catch {}
const motionButton = document.querySelector('[data-motion]');
function updateMotion(){
  root.classList.toggle('motion-paused',paused);
  motionButton.setAttribute('aria-pressed',String(paused));
  const label = language === 'fr' ? (paused ? 'Activer l’animation' : 'Arrêter l’animation') : (paused ? 'Resume motion' : 'Pause motion');
  document.querySelector('[data-motion-label]').textContent=label;
  motionButton.setAttribute('aria-label',label);
}
motionButton.addEventListener('click',()=>{paused=!paused;updateMotion();try{localStorage.setItem('telotia-obsidian-motion',paused?'paused':'running')}catch{}scheduleFrame()});
media.addEventListener('change',e=>{paused=e.matches;updateMotion();scheduleFrame()});
function setLanguage(chosen,updateAddress=true){
 language=chosen==='fr'?'fr':'en'; const text=words[language];
 root.lang=language==='fr'?'fr-CA':'en-CA';
 document.title='Telotia — '+text.headline.replace('\n',' ');
 document.querySelector('meta[name="description"]').content=text.description;
 document.querySelector('[data-nav]').setAttribute('aria-label',text.nav);
 document.querySelector('[data-language]').setAttribute('aria-label',text.language);
 document.querySelectorAll('[data-copy]').forEach(el=>{if(text[el.dataset.copy])el.textContent=text[el.dataset.copy]});
 document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===language)));
 document.querySelector('.scroll-cue').setAttribute('aria-label',language==='fr'?'Découvrir les produits':'Explore products');
 document.querySelector('.back-top').setAttribute('aria-label',language==='fr'?'Retour en haut':'Back to top');
 updateMotion();
 if(updateAddress){const url=new URL(location.href);if(language==='fr')url.searchParams.set('lang','fr');else url.searchParams.delete('lang');history.replaceState(null,'',url)}
 scheduleFrame();
}
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
let pending=false;
const progress=document.querySelector('.reading-progress');
const hero=document.querySelector('.hero');
const contact=document.querySelector('.contact');
const sections=[...document.querySelectorAll('main section[id]')];
function drawFrame(){
 pending=false;
 const y=window.scrollY, max=document.documentElement.scrollHeight-innerHeight;
 progress.style.transform='scaleX('+(max>0?Math.min(1,y/max):0)+')';
 if(!paused&&!media.matches){
  root.style.setProperty('--hero-y',Math.min(y*.13,140)+'px');
  root.style.setProperty('--hero-scale',1+Math.min(y/innerHeight,.95)*.12);
  const box=contact.getBoundingClientRect();
  root.style.setProperty('--contact-y',Math.max(-35,Math.min(35,(innerHeight*.5-box.top)*.06))+'px');
 }
 let current='home';
 for(const section of sections)if(section.getBoundingClientRect().top<innerHeight*.4)current=section.id;
 document.querySelectorAll('[data-nav] a').forEach(a=>{if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
}
function scheduleFrame(){if(!pending){pending=true;requestAnimationFrame(drawFrame)}}
addEventListener('scroll',scheduleFrame,{passive:true});
addEventListener('resize',scheduleFrame,{passive:true});
if('IntersectionObserver' in window){
 const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');reveal.unobserve(entry.target)}},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));
 root.classList.add('motion-ready');
}
setLanguage(new URLSearchParams(location.search).get('lang'),false);
drawFrame();
})();