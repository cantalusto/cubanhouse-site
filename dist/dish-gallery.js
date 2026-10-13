import {categoryNames} from './catalog.js';

const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

export function initDishGallery(items){
 const dialog=document.querySelector('#dish-dialog'),content=dialog.querySelector('#dish-detail');
 let selection=items,index=0,startX=0,startY=0,swiped=false;
 function render(){
  const dish=selection[index];
  content.innerHTML=`<div class="gallery-photo"><a class="gallery-image-link" href="${dish.url}" target="_blank" rel="noopener" aria-label="Ver ${escape(dish.name)} no iFood (nova aba)"><img src="assets/${dish.image}-ai.webp" width="720" height="720" alt="${escape(dish.name)} — imagem ilustrativa criada com IA"><span>Ver no iFood ↗</span></a><div class="gallery-navigation"><button type="button" data-gallery-step="-1" aria-label="Prato anterior">←</button><span data-no-translate>${index+1} / ${selection.length}</span><button type="button" data-gallery-step="1" aria-label="Próximo prato">→</button></div></div><div class="detail-copy"><p class="eyebrow">${categoryNames[dish.category]}</p><h2 id="dish-title">${escape(dish.name)}</h2><p class="detail-description">${escape(dish.description)}</p><div class="detail-footer"><strong>${money(dish.price)}</strong><a class="button" href="${dish.url}" target="_blank" rel="noopener">Escolher no iFood <span>↗</span></a></div><p class="detail-note">Imagem ilustrativa criada com IA. Preço consultado em 12/10/2026. Confirme disponibilidade, opções e valor final no iFood.</p><p class="gallery-status sr-only" role="status">${escape(dish.name)}</p></div>`;
 }
 function step(direction){
  const focusStep=document.activeElement?.dataset.galleryStep;
  index=(index+direction+selection.length)%selection.length;render();
  (focusStep?content.querySelector(`[data-gallery-step="${focusStep}"]`):content.querySelector('.gallery-image-link'))?.focus({preventScroll:true});
 }
 function open(id,subset=items){
  selection=subset.filter(d=>d.image);
  index=selection.findIndex(d=>d.id===id);if(index<0)return;
  render();dialog.classList.add('dish-gallery');
  if(!dialog.open)dialog.showModal();document.body.classList.add('locked');
 }
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>document.body.classList.remove('locked'));
 dialog.addEventListener('click',event=>{
  const button=event.target.closest('[data-gallery-step]');if(button)step(Number(button.dataset.galleryStep));
  if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}
 });
 dialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();step(event.key==='ArrowRight'?1:-1);}
 });
 content.addEventListener('touchstart',event=>{startX=event.touches[0].clientX;startY=event.touches[0].clientY;swiped=false;},{passive:true});
 content.addEventListener('touchend',event=>{
  const dx=event.changedTouches[0].clientX-startX,dy=event.changedTouches[0].clientY-startY;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4){swiped=true;step(dx<0?1:-1);setTimeout(()=>swiped=false,350);}
 },{passive:true});
 content.addEventListener('click',event=>{if(swiped){event.preventDefault();event.stopPropagation();}},{capture:true});
 return {open};
}
