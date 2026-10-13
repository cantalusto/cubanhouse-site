export function initCarousel({reduced=false}={}){
 const host=document.querySelector('.dish-carousel'),track=host.querySelector('.plates-track'),caption=document.querySelector('#plate-caption');
 track.appendChild(track.firstElementChild.cloneNode(true));const images=[...track.querySelectorAll('img')];
 const names=['Camarão recheado','Batata com calabresa','Croquetes de pernil'];let index=3,visible=false,dragging=false,reducedMotion=reduced,timer,tween,startX=0,startScroll=0,moved=false,suppressClick=false;
 [track.firstElementChild,track.lastElementChild].forEach(group=>{group.setAttribute('aria-hidden','true');group.querySelectorAll('a').forEach(a=>a.tabIndex=-1)});
 track.querySelectorAll('a').forEach(link=>{link.draggable=false;link.addEventListener('dragstart',e=>e.preventDefault())});
 images.forEach(img=>{img.draggable=false;img.addEventListener('dragstart',e=>e.preventDefault())});
 function center(i){const a=images[i].getBoundingClientRect(),b=host.getBoundingClientRect();return Math.max(0,a.left-b.left+host.scrollLeft+a.width/2-host.clientWidth/2)}
 function syncCaption(){caption.textContent=names[index%3]+' · '+(index%3+1)+' / 3';}
 function schedule(){clearTimeout(timer);if(visible&&!dragging&&!reducedMotion&&!document.hidden)timer=setTimeout(()=>go(index+1,false),2000)}
 function normalize(){const width=track.querySelector('.plates-group').getBoundingClientRect().width;host.classList.add('no-snap');if(index>=6){index-=3;host.scrollLeft-=width}else if(index<3){index+=3;host.scrollLeft+=width}requestAnimationFrame(()=>host.classList.remove('no-snap'));syncCaption();schedule()}
 function go(i,manual=true){clearTimeout(timer);tween?.kill();index=Math.max(0,Math.min(8,i));const target=center(index);host.classList.add('no-snap');const finish=()=>normalize();if(reducedMotion||!window.gsap){host.scrollLeft=target;finish()}else tween=gsap.to(host,{scrollLeft:target,duration:.45,ease:'power2.inOut',onComplete:finish});if(manual)syncCaption()}
 function nearest(){const middle=host.scrollLeft+host.clientWidth/2;let best=0,distance=Infinity;images.forEach((img,i)=>{const a=img.getBoundingClientRect(),b=host.getBoundingClientRect();const x=a.left-b.left+host.scrollLeft+a.width/2;const delta=Math.abs(x-middle);if(delta<distance){distance=delta;best=i}});return best}
 host.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0)return;dragging=true;moved=false;clearTimeout(timer);tween?.kill();startX=e.clientX;startScroll=host.scrollLeft;host.classList.add('no-snap')});
 host.addEventListener('pointermove',e=>{if(!dragging)return;if(!moved&&Math.abs(e.clientX-startX)>6){moved=true;host.classList.add('dragging');host.setPointerCapture(e.pointerId)}if(moved)host.scrollLeft=startScroll-(e.clientX-startX)});
 function stop(e){if(!dragging)return;dragging=false;suppressClick=moved;if(moved)setTimeout(()=>suppressClick=false,0);host.classList.remove('dragging');if(host.hasPointerCapture(e.pointerId))host.releasePointerCapture(e.pointerId);if(moved)go(nearest());else schedule()}host.addEventListener('pointerup',stop);host.addEventListener('pointercancel',stop);
 host.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false}},{capture:true});
 host.addEventListener('touchstart',()=>{dragging=true;clearTimeout(timer);tween?.kill()},{passive:true});host.addEventListener('touchend',()=>{dragging=false;index=nearest();syncCaption();schedule()},{passive:true});
 host.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(index+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1)}});
 document.querySelector('#plate-prev').addEventListener('click',()=>go(index-1));document.querySelector('#plate-next').addEventListener('click',()=>go(index+1));
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.15}).observe(host);document.addEventListener('visibilitychange',schedule);
 window.addEventListener('cuban:motion',e=>{reducedMotion=e.detail.reduced;tween?.kill();schedule()});
 new ResizeObserver(()=>{tween?.kill();host.classList.add('no-snap');host.scrollLeft=center(index);requestAnimationFrame(()=>host.classList.remove('no-snap'));schedule()}).observe(host);
 syncCaption();schedule();
}
