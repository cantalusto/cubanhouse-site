import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../dist/carousel.js',import.meta.url),'utf8').replace('export function','function');

// Model browser geometry and event delivery, keeping the production gesture handler intact.
function fixture({reduced=true,width=390}={}){
 let now=0,timerID=0;const timers=new Map();
 function element(){const listeners=new Map(),classes=new Set();return {
  addEventListener(type,callback){if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(callback)},
  fire(type,properties={}){const event={isPrimary:true,pointerId:1,pointerType:'touch',button:0,clientX:220,clientY:200,detail:1,defaultPrevented:false,preventDefault(){this.defaultPrevented=true},stopPropagation(){},...properties};for(const callback of listeners.get(type)||[])callback(event);return event},
  classList:{add(...names){names.forEach(name=>classes.add(name))},remove(...names){names.forEach(name=>classes.delete(name))},contains:name=>classes.has(name)},
  setAttribute(){},textContent:''
 }}
 const host=element(),caption=element(),next=element(),prev=element(),window=element(),document=element();
 host.scrollLeft=0;host.clientWidth=width;host.getBoundingClientRect=()=>({left:0,width});
 let captured=null;host.setPointerCapture=id=>captured=id;host.hasPointerCapture=id=>captured===id;host.releasePointerCapture=()=>captured=null;
 const images=[],links=[],groups=[];
 function group(){const position=groups.length;const localImages=Array.from({length:7},(_,i)=>{
  const image=element(),n=position*7+i;image.alt='Dish '+(i+1);image.getBoundingClientRect=()=>({left:(width-225)/2+n*257-host.scrollLeft,width:225});images.push(image);return image;
 });const localLinks=localImages.map(()=>element());links.push(...localLinks);const result={...element(),querySelectorAll:selector=>selector==='img'?localImages:localLinks,getBoundingClientRect:()=>({width:7*257}),cloneNode:()=>group()};groups.push(result);return result}
 group();group();const track={get firstElementChild(){return groups[0]},get lastElementChild(){return groups.at(-1)},appendChild(){},querySelector:()=>groups[0],querySelectorAll:selector=>selector==='img'?images:links};host.querySelector=()=>track;
 document.querySelector=selector=>({'.dish-carousel':host,'#plate-caption':caption,'#plate-next':next,'#plate-prev':prev}[selector]);document.hidden=false;
 const resize=[],intersection=[];
 const context=vm.createContext({window,document,performance:{now:()=>now},setTimeout(callback,delay){const id=++timerID;timers.set(id,{callback,due:now+delay});return id},clearTimeout:id=>timers.delete(id),requestAnimationFrame:callback=>callback(),IntersectionObserver:class{constructor(callback){intersection.push(callback)}observe(){}},ResizeObserver:class{constructor(callback){resize.push(callback)}observe(){}}});
 vm.runInContext(source,context);context.initCarousel({reduced});resize[0]();intersection[0]([{isIntersecting:true}]);
 const advance=milliseconds=>{const until=now+milliseconds;while(true){const upcoming=[...timers].sort((a,b)=>a[1].due-b[1].due)[0];if(!upcoming||upcoming[1].due>until)break;now=upcoming[1].due;timers.delete(upcoming[0]);upcoming[1].callback()}now=until};
 function swipe(dx,{dy=0,duration=160,type='touch',cancel=false}={}){host.fire('pointerdown',{pointerType:type});advance(duration);host.fire('pointermove',{pointerType:type,clientX:220+dx,clientY:200+dy});window.fire(cancel?'pointercancel':'pointerup',{pointerType:type,clientX:220+dx,clientY:200+dy})}
 return {host,caption,next,prev,window,advance,swipe,captured:()=>captured};
}
test('touch begins from the current plate position without jumping',()=>{
 const f=fixture(),start=f.host.scrollLeft;f.host.fire('pointerdown');f.host.fire('pointermove',{clientX:200});assert.equal(f.host.scrollLeft,start+20);assert.equal(f.captured(),1);
});
test('a short deliberate swipe advances one plate in either direction',()=>{
 const f=fixture();f.swipe(-60);assert.match(f.caption.textContent,/2 \/ 7$/);assert.equal(f.host.scrollLeft,8*257);f.swipe(60);assert.match(f.caption.textContent,/1 \/ 7$/);assert.equal(f.host.scrollLeft,7*257);
});
test('vertical motion is left to page scrolling and releases the gesture',()=>{
 const f=fixture(),start=f.host.scrollLeft;f.host.fire('pointerdown');const move=f.host.fire('pointermove',{clientX:225,clientY:260});assert.equal(move.defaultPrevented,false);assert.equal(f.host.scrollLeft,start);assert.equal(f.captured(),null);f.window.fire('pointercancel');f.swipe(-60);assert.match(f.caption.textContent,/2 \/ 7$/);
});
test('a swipe blocks its accidental click but the next tap opens normally',()=>{
 const f=fixture();f.swipe(-60);assert.equal(f.host.fire('click').defaultPrevented,true);f.host.fire('pointerdown');f.host.fire('pointermove',{clientX:223,clientY:202});f.window.fire('pointerup');assert.equal(f.host.fire('click').defaultPrevented,false);assert.match(f.caption.textContent,/2 \/ 7$/);
});
test('cancelled touch snaps safely and leaves controls usable',()=>{
 const f=fixture();f.swipe(-60,{cancel:true});assert.equal(f.captured(),null);assert.equal(f.host.classList.contains('dragging'),false);assert.match(f.caption.textContent,/1 \/ 7$/);f.next.fire('click');assert.match(f.caption.textContent,/2 \/ 7$/);
});
test('seven swipes wrap without reaching an empty end in a 320px viewport',()=>{
 const f=fixture({width:320});for(let i=0;i<7;i++)f.swipe(-60);assert.match(f.caption.textContent,/1 \/ 7$/);assert.equal(f.host.scrollLeft,7*257);f.swipe(60);assert.match(f.caption.textContent,/7 \/ 7$/);
});
test('autoplay waits for interaction, then resumes after a reading interval',()=>{
 const f=fixture({reduced:false});f.advance(1500);f.host.fire('pointerdown');f.advance(3000);assert.match(f.caption.textContent,/1 \/ 7$/);f.host.fire('pointermove',{clientX:160});f.window.fire('pointerup');assert.match(f.caption.textContent,/2 \/ 7$/);f.advance(4499);assert.match(f.caption.textContent,/2 \/ 7$/);f.advance(1);assert.match(f.caption.textContent,/3 \/ 7$/);
});
test('mouse dragging and keyboard arrows continue to work',()=>{
 const f=fixture();f.swipe(-180,{type:'mouse'});assert.match(f.caption.textContent,/2 \/ 7$/);f.host.fire('keydown',{key:'ArrowRight'});assert.match(f.caption.textContent,/3 \/ 7$/);f.host.fire('keydown',{key:'ArrowLeft'});assert.match(f.caption.textContent,/2 \/ 7$/);
});
