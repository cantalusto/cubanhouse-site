import {dishes} from './catalog.js';
import {initDishGallery} from './dish-gallery.js';
const header=document.querySelector('.header'),toggle=document.querySelector('.nav-toggle'),mobileNav=document.querySelector('#mobile-nav');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>80),{passive:true});
toggle.addEventListener('click',()=>{const open=mobileNav.hidden;mobileNav.hidden=!open;toggle.setAttribute('aria-expanded',open);toggle.setAttribute('aria-label',open?'Fechar navegação':'Abrir navegação')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){mobileNav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir navegação')}});
window.addEventListener('resize',()=>{if(innerWidth>760){mobileNav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir navegação')}},{passive:true});
const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
document.querySelector('#category-search').addEventListener('input',e=>{const q=fold(e.target.value);let count=0;document.querySelectorAll('.category-menu-item').forEach(item=>{const visible=fold(item.dataset.name+' '+item.querySelector('h3').textContent+' '+item.querySelector('p').textContent).includes(q);item.hidden=!visible;if(visible)count++});document.querySelectorAll('.category-menu-group').forEach(group=>group.hidden=!group.querySelector('.category-menu-item:not([hidden])'));document.querySelector('#category-empty').hidden=count>0});

const categoryItems=dishes.filter(d=>document.querySelector('[data-dish-id="'+d.id+'"]'));
const gallery=initDishGallery(categoryItems);
document.addEventListener('click',event=>{
 const photo=event.target.closest('[data-photo]');if(!photo)return;
 const visible=categoryItems.filter(d=>!document.querySelector('[data-dish-id="'+d.id+'"]').hidden);
 gallery.open(photo.dataset.photo,visible);
});
function openLinkedDish(){
 const match=location.hash.match(/^#prato-([a-f0-9-]+)$/);if(!match)return;
 const item=document.getElementById('prato-'+match[1]);if(!item)return;
 item.classList.add('linked-dish');
 item.scrollIntoView({behavior:'instant',block:'center'});
 gallery.open(match[1]);
}
window.addEventListener('hashchange',openLinkedDish);
if(document.documentElement.classList.contains('page-ready'))openLinkedDish();
else window.addEventListener('cuban:ready',openLinkedDish,{once:true});
