(() => {
  const root=document.documentElement,start=performance.now();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visited=false,userReduced=false;
  try {visited=sessionStorage.getItem('cuban-entered')==='yes';userReduced=localStorage.getItem('cuban-motion')==='reduced'} catch {}
  const firstEntry=!visited;
  if(userReduced)root.classList.add('reduce-motion');
  if(firstEntry)root.classList.add('is-loading');
  let loaderShownAt=firstEntry?start:null,finished=false;
  const delayedLoader=firstEntry?null:setTimeout(()=>{
    if(!finished){loaderShownAt=performance.now();root.classList.add('is-loading','loader-secondary')}
  },900);
  const ready=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>{
    window.addEventListener('load',resolve,{once:true});setTimeout(resolve,8000);
  });
  const minimum=firstEntry?new Promise(resolve=>setTimeout(resolve,2000)):Promise.resolve();
  Promise.all([ready,minimum]).then(async()=>{
    finished=true;clearTimeout(delayedLoader);
    if(!firstEntry&&loaderShownAt!==null){await new Promise(resolve=>setTimeout(resolve,Math.max(0,450-(performance.now()-loaderShownAt))))}
    try {sessionStorage.setItem('cuban-entered','yes')}catch{}
    root.classList.remove('is-loading');root.classList.add('page-ready');
    const loader=document.querySelector('.page-loader');
    if(loader){loader.classList.add('loaded');loader.setAttribute('aria-hidden','true');setTimeout(()=>loader.remove(),450)}
    window.dispatchEvent(new CustomEvent('cuban:ready',{detail:{duration:performance.now()-start,firstEntry}}));
  });
  document.addEventListener('DOMContentLoaded',()=>{
    const progress=document.createElement('div');progress.className='navigation-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
    document.addEventListener('click',event=>{
      const link=event.target.closest?.('a[href]');
      if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
      const destination=new URL(link.href,location.href);
      if(destination.origin!==location.origin||destination.pathname===location.pathname||!['http:','https:'].includes(destination.protocol))return;
      event.preventDefault();root.classList.add('page-leaving');
      setTimeout(()=>location.assign(destination.href),reduced||userReduced?0:180);
    });
  },{once:true});
  window.addEventListener('pageshow',event=>{
    if(event.persisted){root.classList.remove('page-leaving','is-loading','loader-secondary');root.classList.add('page-ready')}
  });
})();
