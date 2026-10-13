export function initCarousel({reduced=false}={}){
 const host=document.querySelector('.dish-carousel');if(!host)return;
 const track=host.querySelector('.plates-track'),caption=document.querySelector('#plate-caption');
 track.appendChild(track.firstElementChild.cloneNode(true));const images=[...track.querySelectorAll('img')];
 const names=[...track.firstElementChild.querySelectorAll('img')].map(img=>img.alt),count=names.length;
 let index=count,visible=false,reducedMotion=reduced,timer,tween,gesture=null,suppressUntil=0,resumeAt=0;
 [track.firstElementChild,track.lastElementChild].forEach(group=>{group.setAttribute('aria-hidden','true');group.querySelectorAll('a').forEach(a=>a.tabIndex=-1)});
 track.querySelectorAll('a').forEach(link=>{link.draggable=false;link.addEventListener('dragstart',event=>event.preventDefault())});
 images.forEach(img=>{img.draggable=false;img.addEventListener('dragstart',event=>event.preventDefault())});
 function center(i){const a=images[i].getBoundingClientRect(),b=host.getBoundingClientRect();return Math.max(0,a.left-b.left+host.scrollLeft+a.width/2-host.clientWidth/2)}
 function syncCaption(){caption.textContent=(window.cubanI18n?.t(names[index%count])||names[index%count])+' · '+(index%count+1)+' / '+count;}
 function schedule(){clearTimeout(timer);if(visible&&!gesture&&!reducedMotion&&!document.hidden)timer=setTimeout(()=>go(index+1,false),Math.max(2000,resumeAt-performance.now()))}
 function holdAutoplay(){resumeAt=performance.now()+4500;clearTimeout(timer)}
 function normalize(){const width=track.firstElementChild.getBoundingClientRect().width;host.classList.add('no-snap');if(index>=count*2){index-=count;host.scrollLeft-=width}else if(index<count){index+=count;host.scrollLeft+=width}requestAnimationFrame(()=>host.classList.remove('no-snap'));syncCaption();schedule()}
 function go(i,manual=true){clearTimeout(timer);tween?.kill();if(manual)holdAutoplay();index=Math.max(0,Math.min(images.length-1,i));const target=center(index);host.classList.add('no-snap');if(reducedMotion||!window.gsap){host.scrollLeft=target;normalize()}else tween=gsap.to(host,{scrollLeft:target,duration:.45,ease:'power2.inOut',onComplete:normalize});syncCaption()}
 function nearest(){const middle=host.scrollLeft+host.clientWidth/2,b=host.getBoundingClientRect();let best=0,distance=Infinity;images.forEach((img,i)=>{const a=img.getBoundingClientRect(),delta=Math.abs(a.left-b.left+host.scrollLeft+a.width/2-middle);if(delta<distance){distance=delta;best=i}});return best}

 host.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0||gesture)return;
  clearTimeout(timer);tween?.kill();suppressUntil=0;
  gesture={id:event.pointerId,type:event.pointerType,x:event.clientX,y:event.clientY,scroll:host.scrollLeft,index:nearest(),started:performance.now(),horizontal:false,dx:0};
 });
 host.addEventListener('pointermove',event=>{
  if(!gesture||event.pointerId!==gesture.id)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  if(!gesture.horizontal){
   if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){finish(event,true);return}
   if(Math.abs(dx)<10||Math.abs(dx)<Math.abs(dy)*1.15)return;
   gesture.horizontal=true;host.classList.add('dragging','no-snap');host.setPointerCapture(event.pointerId);
  }
  gesture.dx=dx;host.scrollLeft=gesture.scroll-dx;
 });
 function finish(event,cancelled=false){
  if(!gesture||event.pointerId!==gesture.id)return;
  const completed=gesture;gesture=null;host.classList.remove('dragging');
  if(host.hasPointerCapture(event.pointerId))host.releasePointerCapture(event.pointerId);
  if(completed.horizontal){
   suppressUntil=performance.now()+650;
   let target=nearest();
   const distance=Math.abs(completed.dx),duration=Math.max(1,performance.now()-completed.started);
   // A short, deliberate touch swipe advances one plate; long drags can cross several.
   if(!cancelled&&completed.type==='touch'&&(distance>Math.min(70,images[completed.index].getBoundingClientRect().width*.25)||(distance>25&&distance/duration>.35)))target=completed.dx<0?Math.max(target,completed.index+1):Math.min(target,completed.index-1);
   go(target);
  }else{host.classList.remove('no-snap');index=nearest();syncCaption();holdAutoplay();schedule()}
 }
 window.addEventListener('pointerup',event=>finish(event));
 window.addEventListener('pointercancel',event=>finish(event,true));
 host.addEventListener('lostpointercapture',event=>finish(event,true));
 host.addEventListener('click',event=>{if(event.detail!==0&&performance.now()<suppressUntil){event.preventDefault();event.stopPropagation()}},{capture:true});
 host.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();go(index+1)}if(event.key==='ArrowLeft'){event.preventDefault();go(index-1)}});
 document.querySelector('#plate-prev').addEventListener('click',()=>go(index-1));document.querySelector('#plate-next').addEventListener('click',()=>go(index+1));
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.15}).observe(host);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&gesture)finish({pointerId:gesture.id},true);schedule()});
 window.addEventListener('cuban:motion',event=>{reducedMotion=event.detail.reduced;tween?.kill();schedule()});
 window.addEventListener('cuban:language',syncCaption);
 new ResizeObserver(()=>{if(gesture)finish({pointerId:gesture.id},true);tween?.kill();host.classList.add('no-snap');host.scrollLeft=center(index);requestAnimationFrame(()=>host.classList.remove('no-snap'));schedule()}).observe(host);
 syncCaption();schedule();
}
