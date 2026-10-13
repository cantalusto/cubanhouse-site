(() => {
 const dictionaries=window.CUBAN_TRANSLATIONS||{},textRecords=new WeakMap(),attributeRecords=new WeakMap();
 let language='pt';try{const saved=localStorage.getItem('cuban-language');if(['pt','en','es'].includes(saved))language=saved}catch{}
 const key=s=>s.replace(/\s+/g,' ').trim().toLowerCase();
 function translate(value){
  const raw=String(value),s=raw.replace(/\s+/g,' ').trim();if(language==='pt'||!s)return s;
  const dict=dictionaries[language]||{},direct=dict[key(s)];
  if(direct)return s===s.toUpperCase()&&/[A-ZÀ-Ú]/.test(s)?direct.toUpperCase():direct;
  let m;
  if((m=s.match(/^(\d+) opç(?:ão|ões)(?: para “(.+)”)?$/)))return m[1]+(language==='en'?(m[1]==='1'?' option':' options'):(m[1]==='1'?' opción':' opciones'))+(m[2]?(language==='en'?' for “':' para “')+m[2]+'”':'');
  if((m=s.match(/^Ver detalhes de (.+)$/)))return (language==='en'?'View details of ':'Ver detalles de ')+translate(m[1]);
  if((m=s.match(/^Ver (.+) no iFood \(nova aba\)$/)))return (language==='en'?'View ':'Ver ')+translate(m[1])+(language==='en'?' on iFood (new tab)':' en iFood (nueva pestaña)');
  if((m=s.match(/^(Salvar|Remover) (.+) (?:nos|dos) favoritos$/)))return (language==='en'?(m[1]==='Salvar'?'Save ':'Remove '):(m[1]==='Salvar'?'Guardar ':'Quitar '))+translate(m[2])+(language==='en'?(m[1]==='Salvar'?' to favourites':' from favourites'):(m[1]==='Salvar'?' en favoritos':' de favoritos'));
  if((m=s.match(/^(.+?) — imagem ilustrativa( criada com IA)?$/)))return translate(m[1])+' — '+translate(m[2]?'Imagem ilustrativa criada com IA':'Imagem ilustrativa');
  if((m=s.match(/^(\d+) avaliações no Google$/)))return m[1]+(language==='en'?' reviews on Google':' reseñas en Google');
  if((m=s.match(/^(\d(?:,\d)?) de 5 estrelas$/)))return (language==='en'?m[1].replace(',','.'):m[1])+(language==='en'?' out of 5 stars':' de 5 estrellas');
  if((m=s.match(/^Ver avaliação (\d+)$/)))return (language==='en'?'View review ':'Ver reseña ')+m[1];
  if((m=s.match(/^Avaliação (\d+) de (\d+)$/)))return (language==='en'?'Review ':'Reseña ')+m[1]+(language==='en'?' of ':' de ')+m[2];
  if(s==='4,5')return language==='en'?'4.5':'4,5';
  if(s.includes(' · '))return s.split(' · ').map(translate).join(' · ');
  if(s.includes(' — CubanHouse'))return translate(s.split(' — CubanHouse')[0])+' — CubanHouse';
  if((m=s.match(/^([←↑↗↓]\s*)?(.+?)(\s*[↗↑↓])?$/))&&(m[1]||m[3]))return (m[1]||'')+translate(m[2])+(m[3]||'');
  const detail='Preço consultado em 12/10/2026. Confirme disponibilidade, opções e valor final no iFood.';
  if(s.startsWith(detail))return translate(detail)+(s.length>detail.length?' '+translate(s.slice(detail.length).trim()):'');
  return s;
 }
 function excluded(el){return !el||el.closest('script,style,svg,.language-switcher,[data-no-translate]')}
 function translateText(node){
  if(excluded(node.parentElement)||!node.data.trim())return;
  let record=textRecords.get(node);if(!record||node.data!==record.rendered)record={source:node.data,rendered:node.data};
  const lead=record.source.match(/^\s*/)[0],tail=record.source.match(/\s*$/)[0];
  const rendered=lead+translate(record.source)+tail;
  if(node.data!==rendered)node.data=rendered;record.rendered=rendered;textRecords.set(node,record);
 }
 function translateAttributes(el){
  if(excluded(el))return;let records=attributeRecords.get(el)||{};
  for(const name of ['aria-label','alt','placeholder','title']){if(!el.hasAttribute(name))continue;const value=el.getAttribute(name);let record=records[name];if(!record||value!==record.rendered)record={source:value,rendered:value};const rendered=translate(record.source);if(value!==rendered)el.setAttribute(name,rendered);records[name]={source:record.source,rendered}}
  attributeRecords.set(el,records);
 }
 function walk(root){if(root.nodeType===3){translateText(root);return}if(root.nodeType!==1)return;translateAttributes(root);const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(node.nodeType===3)translateText(node);else translateAttributes(node)}}
 const observer=new MutationObserver(records=>{observer.disconnect();for(const r of records){if(r.type==='characterData')translateText(r.target);else if(r.type==='attributes')translateAttributes(r.target);else r.addedNodes.forEach(walk)}observe()});
 function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','alt','placeholder','title']})}
 const originalTitle=document.title,descriptionMeta=document.querySelector('meta[name="description"]'),originalDescription=descriptionMeta?.content;
 function apply(){observer.disconnect();document.documentElement.lang=language==='pt'?'pt-BR':language;walk(document.body);document.title=translate(originalTitle);if(descriptionMeta)descriptionMeta.content=translate(originalDescription);const select=document.querySelector('#site-language');if(select)select.value=language;observe()}
 function setLanguage(value){if(!['pt','en','es'].includes(value))return;language=value;try{localStorage.setItem('cuban-language',value)}catch{}apply();window.dispatchEvent(new CustomEvent('cuban:language',{detail:{language}}));window.ScrollTrigger?.refresh()}
 window.cubanI18n={t:translate,get language(){return language},setLanguage};
 function boot(){
  const actions=document.querySelector('.header-actions');
  if(actions){const label=document.createElement('label');label.className='language-switcher';label.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z"/></svg><select id="site-language" aria-label="Idioma / Language / Idioma"><option value="pt" lang="pt-BR">PT</option><option value="en" lang="en">EN</option><option value="es" lang="es">ES</option></select>';actions.prepend(label);label.querySelector('select').addEventListener('change',e=>setLanguage(e.target.value));
   const order=actions.querySelector('a.button-small');if(order){const text=[...order.childNodes].find(n=>n.nodeType===3&&n.data.trim());if(text){const span=document.createElement('span');span.className='header-order-label';text.replaceWith(span);span.append(text)}const short=document.createElement('span');short.className='header-order-short';short.textContent='iFood';short.setAttribute('aria-hidden','true');order.prepend(short);if(!order.hasAttribute('aria-label'))order.setAttribute('aria-label','Pedir no iFood')}
  }
  apply();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
