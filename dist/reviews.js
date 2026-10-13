import {reviewsSnapshot as snapshot} from './reviews-data.js';
const host=document.querySelector('.reviews-content'),carousel=document.querySelector('.review-carousel');
if(host){
 let index=0,visible=false,hovered=false,focused=false,reduced=document.documentElement.classList.contains('reduce-motion'),timer,swap;
 const quote=document.querySelector('#review-quote'),author=document.querySelector('#review-author'),stars=document.querySelector('#review-stars'),dots=[...document.querySelectorAll('#review-dots button')];
 function schedule(){clearTimeout(timer);if(visible&&!hovered&&!focused&&!reduced&&!document.hidden)timer=setTimeout(()=>show(index+1),6500)}
 function show(next,manual=false){clearTimeout(timer);clearTimeout(swap);index=(next+snapshot.reviews.length)%snapshot.reviews.length;carousel.classList.add('review-changing');swap=setTimeout(()=>{const review=snapshot.reviews[index];quote.textContent=review.excerpt;author.textContent=review.author;stars.textContent='★'.repeat(review.rating)+'☆'.repeat(5-review.rating);stars.setAttribute('aria-label',review.rating+' de 5 estrelas');dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',i===index));if(manual)document.querySelector('#review-status').textContent='Avaliação '+(index+1)+' de '+snapshot.reviews.length;carousel.classList.remove('review-changing');schedule()},reduced?0:160)}
 document.querySelector('#review-prev').addEventListener('click',()=>show(index-1,true));document.querySelector('#review-next').addEventListener('click',()=>show(index+1,true));dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i,true)));
 host.addEventListener('pointerenter',()=>{hovered=true;clearTimeout(timer)});host.addEventListener('pointerleave',()=>{hovered=false;schedule()});host.addEventListener('focusin',()=>{focused=true;clearTimeout(timer)});host.addEventListener('focusout',e=>{if(!host.contains(e.relatedTarget)){focused=false;schedule()}});
 carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1,true)}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1,true)}});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.25}).observe(host);document.addEventListener('visibilitychange',schedule);window.addEventListener('cuban:motion',e=>{reduced=e.detail.reduced;schedule()});
 function translationNote(){document.querySelector('#review-translation-note').hidden=!window.cubanI18n||window.cubanI18n.language==='pt'}
 window.addEventListener('cuban:language',translationNote);translationNote();schedule();
}
