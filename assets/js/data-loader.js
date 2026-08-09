/* CLMD data service: JSON-first with an offline demo fallback. */
(() => {
  'use strict';
  const root = document.body.dataset.root || './';
  const cache = new Map();
  const fallback = window.CLMD_DEMO_DATA || {};
  const escapeMap = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' };

  window.CLMD = window.CLMD || {};
  Object.assign(window.CLMD, {
    root,
    async load(name) {
      if (cache.has(name)) return cache.get(name);
      try {
        const response = await fetch(`${root}assets/data/${name}.json`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        cache.set(name, data);
        return data;
      } catch (error) {
        if (Object.prototype.hasOwnProperty.call(fallback, name)) {
          console.info(`[CLMD] Using offline fallback for ${name}.json`);
          cache.set(name, fallback[name]);
          return fallback[name];
        }
        console.error(`[CLMD] Unable to load ${name}.json`, error);
        throw error;
      }
    },
    asset(path) { return `${root}${String(path).replace(/^\.\//, '')}`; },
    page(path) { return `${root}${String(path).replace(/^\.\//, '')}`; },
    escape(value='') { return String(value).replace(/[&<>"']/g, char => escapeMap[char]); },
    number(value) { return new Intl.NumberFormat('en-PH').format(Number(value || 0)); },
    date(value, options={month:'short',day:'2-digit',year:'numeric'}) {
      const date = new Date(`${value}T00:00:00`);
      return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-PH', options).format(date);
    },
    debounce(fn, wait=220) { let timer; return (...args) => { clearTimeout(timer); timer=setTimeout(() => fn(...args), wait); }; },
    unique(items) { return [...new Set(items.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b))); },
    status(score) {
      const n=Number(score);
      if (n>=90) return {label:'Excellent',className:'status-excellent'};
      if (n>=80) return {label:'On Track',className:'status-ontrack'};
      if (n>=70) return {label:'Watch',className:'status-watch'};
      return {label:'Priority',className:'status-priority'};
    },
    chartColors() {
      const css=getComputedStyle(document.body);
      return {
        violet:'#69358e', violetDark:'#42205c', violetLight:'#b896cf', gold:'#cda72f', goldLight:'#f0d87e', green:'#27855b', blue:'#3e75a8', red:'#b13e54', orange:'#c57c13',
        ink:css.getPropertyValue('--ink').trim() || '#24212a', muted:css.getPropertyValue('--muted').trim() || '#6f6a76', line:css.getPropertyValue('--line').trim() || 'rgba(76,43,96,.12)', surface:css.getPropertyValue('--surface').trim() || '#fff'
      };
    },
    baseChartOptions({legend=true,indexAxis='x',percent=false,stacked=false}={}) {
      const c=this.chartColors();
      return { responsive:true, maintainAspectRatio:false, indexAxis, interaction:{mode:'index',intersect:false}, animation:{duration:900}, plugins:{legend:{display:legend,position:'bottom',labels:{color:c.muted,usePointStyle:true,pointStyle:'circle',boxWidth:7,padding:15,font:{family:'Inter',size:10}}},tooltip:{backgroundColor:'rgba(36,17,51,.94)',padding:11,cornerRadius:10,titleFont:{family:'Montserrat',size:11},bodyFont:{family:'Inter',size:10},usePointStyle:true}},scales:{x:{stacked,grid:{display:indexAxis==='y',color:c.line},ticks:{color:c.muted,font:{family:'Inter',size:9},maxRotation:indexAxis==='x'?42:0}},y:{stacked,beginAtZero:true,max:percent?100:undefined,grid:{color:c.line},ticks:{color:c.muted,font:{family:'Inter',size:9},callback:percent?v=>`${v}%`:undefined}}} };
    },
    insight(text) { return `<span>${this.escape(text)}</span>`; }
  });
})();
