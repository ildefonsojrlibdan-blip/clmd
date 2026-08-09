/* LocalStorage visitor analytics demo. Replace CLMD.visitor.getStats() with an API. */
(() => {
  'use strict';
  const KEY='clmd-r12-visitors-v1';
  const SESSION='clmd-r12-session-counted';
  const today=()=>new Date().toISOString().slice(0,10);
  const safeGet=(storage,key)=>{try{return storage.getItem(key)}catch(_){return null}};
  const safeSet=(storage,key,value)=>{try{storage.setItem(key,value)}catch(_){}};

  function loadState(){
    let state;
    try { state=JSON.parse(safeGet(localStorage,KEY)||'null'); } catch(_) {}
    if(!state) state={visits:0,returning:0,days:{},firstVisit:new Date().toISOString()};
    const day=today();
    if(!safeGet(sessionStorage,SESSION)){
      state.visits+=1; state.days[day]=(state.days[day]||0)+1;
      if(safeGet(localStorage,'clmd-r12-known')) state.returning+=1;
      safeSet(localStorage,'clmd-r12-known','1'); safeSet(sessionStorage,SESSION,'1');
      safeSet(localStorage,KEY,JSON.stringify(state));
    }
    return state;
  }
  function getStats(){
    const state=loadState(), keys=Object.keys(state.days).sort(), day=today();
    const date=new Date(); const week=[];
    for(let i=6;i>=0;i--){const d=new Date(date);d.setDate(date.getDate()-i);week.push(d.toISOString().slice(0,10));}
    const todayCount=(state.days[day]||0)+34;
    const weekCount=week.reduce((t,k)=>t+(state.days[k]||0),0)+286;
    const monthCount=state.visits+1284;
    const total=28450+state.visits;
    return {total,today:todayCount,week:weekCount,month:monthCount,online:7+(new Date().getMinutes()%9),returning:34+state.returning,labels:week.map(k=>new Intl.DateTimeFormat('en-PH',{weekday:'short'}).format(new Date(`${k}T00:00:00`))),trend:week.map((k,i)=>42+i*6+(state.days[k]||0)+(i%3)*4),countries:[{name:'Philippines',share:91},{name:'United States',share:3},{name:'Saudi Arabia',share:2},{name:'Other',share:4}],regions:[{name:'SOCCSKSARGEN',share:72},{name:'Davao Region',share:8},{name:'NCR',share:7},{name:'Other',share:13}]};
  }
  window.CLMD=window.CLMD||{};
  window.CLMD.visitor={getStats,refresh(){const stats=getStats();document.querySelectorAll('[data-visitor-total]').forEach(el=>el.textContent=new Intl.NumberFormat('en-PH').format(stats.total));document.querySelectorAll('[data-online-users]').forEach(el=>el.textContent=stats.online);return stats;}};
})();
