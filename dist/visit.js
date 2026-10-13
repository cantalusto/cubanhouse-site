const days=['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
const shortDays=['SEG','TER','QUA','QUI','SEX','SÁB','DOM'];
const hours=[null,['11h','0h30'],['11h','0h30'],['11h','1h'],['11h','2h'],['11h','2h'],['18h','0h']];
export function initVisit(){
 const host=document.querySelector('.visit');if(!host)return;
 const buttons=[...host.querySelectorAll('[data-weekday]')];
 const weekdays=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 const currentDay=()=>weekdays.indexOf(new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:'America/Sao_Paulo'}).format(new Date()));
 let selected=currentDay();
 const t=value=>window.cubanI18n?.t(value)||value;
 function render(){
  const today=currentDay(),range=hours[selected];
  buttons.forEach((button,i)=>{button.setAttribute('aria-pressed',i===selected);button.setAttribute('aria-label',t(days[i])+(i===today?' · '+t('Hoje'):''));button.classList.toggle('is-today',i===today);button.querySelector('span').textContent=t(shortDays[i]);});
  host.querySelector('#visit-day').textContent=t(days[selected]);
  host.querySelector('#visit-day-note').textContent=t(selected===today?'Hoje':'Planeje sua visita');
  host.querySelector('#visit-time').textContent=range?range[0]+' — '+range[1]:t('Fechado');
  host.querySelector('#visit-time-note').textContent=t(range?'Até a madrugada do dia seguinte.':'Uma pausa para preparar os próximos encontros.');
 }
 buttons.forEach((button,i)=>button.addEventListener('click',()=>{selected=i;render()}));
 host.querySelector('.visit-days').addEventListener('keydown',event=>{
  const index=buttons.indexOf(document.activeElement);if(index<0)return;
  let next;if(event.key==='ArrowRight')next=(index+1)%7;if(event.key==='ArrowLeft')next=(index+6)%7;if(event.key==='Home')next=0;if(event.key==='End')next=6;
  if(next!==undefined){event.preventDefault();selected=next;buttons[next].focus();render()}
 });
 window.addEventListener('cuban:language',render);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
 render();
}
