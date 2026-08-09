/* Portal-wide AI-like search across pages and JSON-managed records. */
(() => {
  'use strict';
  window.CLMD=window.CLMD||{};
  CLMD.initSearch=async function(){
    const overlay=document.getElementById('searchOverlay');
    if(!overlay) return;
    const input=document.getElementById('globalSearchInput');
    const results=document.getElementById('globalSearchResults');
    const close=document.getElementById('closeGlobalSearch');
    let index=[];
    try{index=await CLMD.load('search-index');}catch(_){results.innerHTML='<div class="search-empty">Search data is unavailable.</div>';}
    const icons={Page:'fa-file-lines',Portal:'fa-house',Analytics:'fa-chart-line',Repository:'fa-folder-open',Gallery:'fa-images','Learning Area':'fa-book-open',Program:'fa-diagram-project',Memorandum:'fa-file-signature',Advisory:'fa-bullhorn',Download:'fa-download','Program Holder':'fa-user-tie','Gallery Event':'fa-images'};
    const open=()=>{overlay.classList.add('open');document.body.classList.add('menu-open');setTimeout(()=>input.focus(),120);};
    const hide=()=>{overlay.classList.remove('open');document.body.classList.remove('menu-open');};
    document.querySelectorAll('[data-open-search]').forEach(btn=>btn.addEventListener('click',open));
    close.addEventListener('click',hide);
    overlay.addEventListener('click',e=>{if(e.target===overlay)hide();});
    document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open();}if(e.key==='Escape'&&overlay.classList.contains('open'))hide();});
    const render=query=>{
      const q=query.trim().toLowerCase();
      if(q.length<2){results.innerHTML='<div class="search-empty"><i class="fa-solid fa-wand-magic-sparkles mb-2 d-block"></i>Type at least two characters to search learning areas, programs, issuances, downloads, and gallery records.</div>';return;}
      const words=q.split(/\s+/);
      const matches=index.map(item=>{const hay=`${item.title} ${item.type} ${item.keywords||''}`.toLowerCase();const score=words.reduce((n,w)=>n+(hay.includes(w)?1:0),0)+(String(item.title).toLowerCase().startsWith(q)?2:0);return{...item,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,18);
      if(!matches.length){results.innerHTML=`<div class="search-empty">No result found for “${CLMD.escape(query)}”. Try a learning area, program, memo number, or resource title.</div>`;return;}
      results.innerHTML=matches.map(item=>`<a class="search-result" href="${CLMD.page(item.url)}"><i class="fa-solid ${icons[item.type]||'fa-magnifying-glass'}"></i><div><strong>${CLMD.escape(item.title)}</strong><span>${CLMD.escape(item.type)}</span></div></a>`).join('');
    };
    input.addEventListener('input',CLMD.debounce(()=>render(input.value),120));
  };
})();
