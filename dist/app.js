import {dishes,categoryNames} from './catalog.js';
import {initCarousel} from './carousel.js';
const $=s=>document.querySelector(s);
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const readSaved=()=>{try{return JSON.parse(localStorage.getItem('cuban-favorites')||'[]')}catch{return[]}};
const favorites=new Set(readSaved().filter(id=>dishes.some(d=>d.id===id)));
let category='featured',query='',sort='default',limit=12,filtered=[],animationContext;
const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const icon=category=>`<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${['drinks','beverages'].includes(category)?'<path d="M23 22h34l-5 39H28zM28 37h24M39 21l9-13M27 61h27"/><circle cx="56" cy="22" r="11"/><path d="M49 14l14 15"/>':'<circle cx="40" cy="40" r="25"/><circle cx="40" cy="40" r="18"/><path d="M7 18v20h8V18M11 38v26M67 18v46M67 18c10 3 9 17 0 22"/>'}</svg>`;
function photo(d,detail=false){return d.image?`<img class="${detail?'detail-image':''}" src="assets/${d.image}-ai.webp" alt="${escape(d.name)} — imagem ilustrativa criada com IA" loading="lazy" width="350" height="260">`:`<div class="no-photo ${detail?'detail-no-photo':''}">${icon(d.category)}<small>Sem foto no catálogo</small></div>`}
function renderMenu(){
 filtered=dishes.filter(d=>(category==='all'||(category==='featured'&&d.featured)||(category==='favorites'&&favorites.has(d.id))||d.category===category)&&fold(d.name+' '+d.description).includes(fold(query)));
 if(sort!=='default')filtered.sort((a,b)=>sort==='price-asc'?a.price-b.price:b.price-a.price);
 $('#menu-grid').innerHTML=filtered.slice(0,limit).map(d=>`<article class="dish-card" data-id="${d.id}"><button class="dish-image-button" data-detail="${d.id}" aria-label="Ver detalhes de ${escape(d.name)}">${photo(d)}<span class="dish-ai-label">Imagem ilustrativa</span><span class="dish-badge">${d.category==='lunch'?'Almoço executivo':d.category==='drinks'?'Para brindar':'Para a sua mesa'}</span></button><button class="favorite" data-favorite="${d.id}" aria-label="${favorites.has(d.id)?'Remover':'Salvar'} ${escape(d.name)} ${favorites.has(d.id)?'dos':'nos'} favoritos" aria-pressed="${favorites.has(d.id)}">${favorites.has(d.id)?'♥':'♡'}</button><div class="dish-info"><p class="dish-category">${categoryNames[d.category]}</p><button class="dish-title" data-detail="${d.id}">${escape(d.name)}</button><p class="dish-description">${escape(d.description)}</p><div class="dish-bottom"><span class="dish-price">${money(d.price)}</span><a class="dish-order" href="${d.url}" target="_blank" rel="noopener" aria-label="Ver ${escape(d.name)} no iFood (nova aba)">Ver no iFood <span aria-hidden="true">↗</span></a></div></div></article>`).join('');
 $('#empty-state').hidden=filtered.length>0;
 if(!filtered.length){$('#empty-state h3').textContent=category==='favorites'?'Seu próximo favorito está por aqui.':'Vamos tentar outro sabor?';$('#empty-state p').textContent=category==='favorites'?'Toque no coração de um prato para guardá-lo aqui.':'Nenhum item encontrado. Tente outro nome ou explore todas as categorias.'}
 $('#result-count').textContent=`${filtered.length} ${filtered.length===1?'opção':'opções'}${query?' para “'+query+'”':''}`;
 $('#load-more').hidden=filtered.length<=limit;
 document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.category===category));
 window.ScrollTrigger?.refresh();
}
function openDish(id){const d=dishes.find(d=>d.id===id);if(!d)return;$('#dish-detail').innerHTML=photo(d,true)+`<div class="detail-copy"><p class="eyebrow">${categoryNames[d.category]}</p><h2 id="dish-title">${escape(d.name)}</h2><p class="detail-description">${escape(d.description)}</p><div class="detail-footer"><strong>${money(d.price)}</strong><a class="button" href="${d.url}" target="_blank" rel="noopener">Escolher no iFood <span>↗</span></a></div><p class="detail-note">Preço consultado em 12/10/2026. Confirme disponibilidade, opções e valor final no iFood.${d.image?' Imagem ilustrativa criada com IA a partir de referências do catálogo.':''}</p></div>`;$('#dish-dialog').showModal();document.body.classList.add('locked');}
$('#menu-grid').addEventListener('click',e=>{const detail=e.target.closest('[data-detail]');if(detail)openDish(detail.dataset.detail);const b=e.target.closest('[data-favorite]');if(b){const id=b.dataset.favorite;if(favorites.has(id))favorites.delete(id);else favorites.add(id);try{localStorage.setItem('cuban-favorites',JSON.stringify([...favorites]))}catch{}if(category==='favorites')renderMenu();else{b.setAttribute('aria-pressed',favorites.has(id));b.setAttribute('aria-label',`${favorites.has(id)?'Remover':'Salvar'} ${dishes.find(d=>d.id===id).name} ${favorites.has(id)?'dos':'nos'} favoritos`);b.textContent=favorites.has(id)?'♥':'♡'}}});
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;limit=12;renderMenu()}));
document.querySelectorAll('[data-occasion]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.occasion;query='';limit=12;$('#menu-search').value='';renderMenu();$('#cardapio').scrollIntoView({behavior:reduced.matches||userReduced?'instant':'smooth'})}));
$('#menu-search').addEventListener('input',e=>{query=e.target.value;if(query)category='all';limit=12;renderMenu()});
$('#menu-sort').addEventListener('change',e=>{sort=e.target.value;renderMenu()});
$('#load-more').addEventListener('click',()=>{limit+=12;renderMenu()});
$('#reset-menu').addEventListener('click',()=>{category='all';query='';$('#menu-search').value='';limit=12;renderMenu()});
$('.dialog-close').addEventListener('click',()=>$('#dish-dialog').close());
$('#dish-dialog').addEventListener('close',()=>document.body.classList.remove('locked'));
$('#dish-dialog').addEventListener('click',e=>{if(e.target===$('#dish-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
const mobileNav=$('#mobile-nav'),toggle=$('.nav-toggle');
function closeNav(){mobileNav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir navegação')}
toggle.addEventListener('click',()=>{const open=mobileNav.hidden;mobileNav.hidden=!open;toggle.setAttribute('aria-expanded',open);toggle.setAttribute('aria-label',open?'Fechar navegação':'Abrir navegação')});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
window.addEventListener('resize',()=>{if(innerWidth>760)closeNav()},{passive:true});
window.addEventListener('scroll',()=>$('.header').classList.toggle('scrolled',scrollY>80),{passive:true});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let userReduced=false;try{userReduced=localStorage.getItem('cuban-motion')==='reduced'}catch{}
function setupMotion(){animationContext?.revert();const disabled=reduced.matches||userReduced;document.documentElement.classList.toggle('reduce-motion',disabled);$('#motion-toggle').setAttribute('aria-pressed',disabled);$('#motion-toggle').textContent=disabled?'Movimento reduzido':'Reduzir movimento';window.dispatchEvent(new CustomEvent('cuban:motion',{detail:{reduced:disabled}}));if(disabled||!window.gsap||!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);animationContext=gsap.context(()=>{
  gsap.from('.hero-line',{y:35,opacity:0,stagger:.14,duration:1.15,ease:'power3.out'});gsap.from('.hero-enter',{y:18,opacity:0,stagger:.13,duration:.8,delay:.25});
  gsap.from('.divider-line',{scaleX:0,ease:'none',scrollTrigger:{trigger:'.night-divider',start:'top bottom',end:'top 65%',scrub:1}});

  gsap.utils.toArray('.section-heading,.experience-copy,.visit-left,.visit-info').forEach(el=>gsap.from(el,{y:34,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
  gsap.from('.night-section h2',{y:70,duration:1,ease:'power2.out',scrollTrigger:{trigger:'.night-section',start:'top 80%',end:'top 20%',scrub:1}});
  gsap.to('.night-waves',{y:-22,ease:'none',scrollTrigger:{trigger:'.night-section',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.matchMedia().add('(min-width: 761px)',()=>{gsap.to('.hero-photo',{y:75,scale:1.06,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});gsap.to('.hero-content',{y:100,opacity:.3,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}})});
 });
}
$('#motion-toggle').addEventListener('click',()=>{userReduced=!(userReduced||reduced.matches);try{localStorage.setItem('cuban-motion',userReduced?'reduced':'full')}catch{}setupMotion()});reduced.addEventListener('change',setupMotion);
renderMenu();setupMotion();initCarousel({reduced:reduced.matches||userReduced});window.addEventListener("cuban:ready",setupMotion,{once:true});document.fonts.ready.then(()=>window.ScrollTrigger?.refresh());
// Load WebGL only when the section approaches the viewport.
const sceneObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){sceneObserver.disconnect();import('./brand-scene.js').then(m=>m.initBrand({reduced:reduced.matches||userReduced})).catch(()=>{/* The original logo remains the fallback. */})}},{rootMargin:'200px'});sceneObserver.observe($('#brand-3d'));



