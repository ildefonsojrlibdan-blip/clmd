/* Global shell, navigation, accessibility, utilities, export and interactions. */
(() => {
  'use strict';
  const root=CLMD.root;
  const p=path=>CLMD.page(path);
  const page=document.body.dataset.page||'';
  const learningLinks=[
    ['english','English','fa-language'],['math','Mathematics','fa-square-root-variable'],['science','Science','fa-flask'],['filipino','Filipino','fa-book'],['ap','Araling Panlipunan','fa-earth-asia'],['values','Values Education','fa-heart'],['mapeh','MAPEH / Special Programs','fa-masks-theater'],['tle','TLE','fa-screwdriver-wrench'],['scp','Special Curricular Programs','fa-star'],['inclusive','Inclusive Education','fa-universal-access'],['sned','SNED','fa-hands-holding-child'],['iped','IPED','fa-people-roof'],['madrasah','Madrasah Education','fa-mosque'],['als','Alternative Learning System','fa-road'],['sshs','Strengthened SHS','fa-graduation-cap'],['lrmds','LRMDS','fa-box-archive']
  ];
  const active=(ids)=>ids.includes(page)?'active':'';
  const header=`
    <div class="gov-strip"><div class="container-fluid"><div class="gov-left"><span><i class="fa-solid fa-landmark me-2"></i>Republic of the Philippines · Department of Education</span><span id="phTime">Philippine Standard Time</span></div><div class="gov-right"><span class="visitor-mini"><i class="fa-regular fa-eye"></i><strong data-visitor-total>—</strong> visitors</span><a href="${p('contact.html')}"><i class="fa-regular fa-envelope me-1"></i> Contact CLMD</a></div></div></div>
    <nav class="main-nav" aria-label="Primary navigation"><div class="nav-shell">
      <a class="brand-group" href="${p('index.html')}" aria-label="CLMD Region XII home"><img class="brand-logo" src="${p('assets/images/deped-region-xii-logo.jpg')}" alt="DepEd Region XII logo"><span class="brand-divider"></span><img class="clmd-logo" src="${p('assets/images/clmd-mark.svg')}" alt="CLMD identity mark"><span class="brand-copy"><strong>Curriculum & Learning Management Division</strong><span>Regional Office XII · SOCCSKSARGEN</span></span></a>
      <ul class="primary-nav" id="primaryNav">
        <li class="${active(['home'])}"><a href="${p('index.html')}">Home</a></li>
        <li class="${active(['about'])}"><a href="${p('about.html')}">About CLMD</a></li>
        <li class="dropdown ${active(['learning-areas','learning-area'])}"><button data-bs-toggle="dropdown" aria-expanded="false">Learning Areas <i class="bi bi-chevron-down"></i></button><div class="dropdown-menu mega-menu"><div class="px-2 pt-1 pb-2"><small class="text-muted fw-bold">CURRICULUM PORTFOLIO</small></div><div class="mega-grid">${learningLinks.map(x=>`<a class="dropdown-item" href="${p(`learning-areas/${x[0]}.html`)}"><i class="fa-solid ${x[2]}"></i>${x[1]}</a>`).join('')}</div><div class="p-2 mt-1 border-top"><a class="dropdown-item text-center" href="${p('learning-areas/index.html')}">View all learning areas</a></div></div></li>
        <li class="${active(['programs'])}"><a href="${p('programs/index.html')}">Programs</a></li>
        <li class="${active(['performance'])}"><a href="${p('analytics/index.html')}">Regional Performance</a></li>
        <li class="${active(['memoranda'])}"><a href="${p('memoranda/index.html')}">Memoranda</a></li>
        <li class="${active(['advisories'])}"><a href="${p('advisories/index.html')}">Advisories</a></li>
        <li class="${active(['downloads'])}"><a href="${p('downloads/index.html')}">Downloads</a></li>
        <li class="dropdown ${active(['aral','assessment'])}"><button data-bs-toggle="dropdown" aria-expanded="false">Analytics <i class="bi bi-chevron-down"></i></button><div class="dropdown-menu"><a class="dropdown-item" href="${p('analytics/index.html')}"><i class="fa-solid fa-chart-line me-2"></i>Regional Performance</a><a class="dropdown-item" href="${p('analytics/aral.html')}"><i class="fa-solid fa-arrow-trend-up me-2"></i>ARAL Program</a><a class="dropdown-item" href="${p('analytics/assessment.html')}"><i class="fa-solid fa-clipboard-check me-2"></i>Learning Assessment</a></div></li>
        <li class="${active(['gallery'])}"><a href="${p('gallery/index.html')}">Gallery</a></li>
        <li class="${active(['contact'])}"><a href="${p('contact.html')}">Contact</a></li>
      </ul>
      <div class="nav-tools"><button class="nav-tool" data-open-search title="Smart search" aria-label="Open portal search"><i class="fa-solid fa-magnifying-glass"></i></button><button class="nav-tool" id="themeToggle" title="Toggle dark mode" aria-label="Toggle dark mode"><i class="fa-regular fa-moon"></i></button><button class="nav-tool" id="notificationBtn" title="Notifications" aria-label="Notifications"><i class="fa-regular fa-bell"></i><span class="notify-dot"></span></button><button class="nav-tool" data-bs-toggle="offcanvas" data-bs-target="#accessibilityPanel" title="Accessibility options" aria-label="Accessibility options"><i class="fa-solid fa-universal-access"></i></button></div>
      <button class="nav-toggle" id="navToggle" aria-label="Open navigation"><i class="fa-solid fa-bars"></i></button>
    </div></nav><div class="mobile-nav-backdrop" id="navBackdrop"></div>`;
  document.getElementById('siteHeader').innerHTML=header;

  const footer=`<footer class="portal-footer"><div class="container"><div class="row g-5"><div class="col-lg-5"><div class="footer-brand"><img src="${p('assets/images/deped-region-xii-logo.jpg')}" alt="DepEd Region XII logo"><div><strong>Curriculum and Learning Management Division</strong><span>DepEd Regional Office XII · SOCCSKSARGEN</span></div></div><p class="footer-copy">Transforming learning through quality curriculum, responsive programs, evidence-informed leadership, and excellent educational service.</p><div class="social-row"><a href="https://www.facebook.com/DepEdTayoRegionXII" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a><a href="https://depedroxii.org/" target="_blank" rel="noopener" aria-label="Official website"><i class="fa-solid fa-globe"></i></a><a href="mailto:region12@deped.gov.ph" aria-label="Email"><i class="fa-solid fa-envelope"></i></a></div></div><div class="col-6 col-lg-2"><h3 class="footer-title">Portal</h3><div class="footer-links"><a href="${p('about.html')}">About CLMD</a><a href="${p('learning-areas/index.html')}">Learning Areas</a><a href="${p('programs/index.html')}">Programs</a><a href="${p('gallery/index.html')}">Gallery</a><a href="${p('contact.html')}">Contact</a></div></div><div class="col-6 col-lg-2"><h3 class="footer-title">Resources</h3><div class="footer-links"><a href="${p('downloads/index.html')}">Download Center</a><a href="${p('memoranda/index.html')}">Regional Memoranda</a><a href="${p('advisories/index.html')}">Regional Advisories</a><a href="${p('analytics/index.html')}">Performance</a><a href="${p('analytics/aral.html')}">ARAL Dashboard</a></div></div><div class="col-lg-3"><h3 class="footer-title">Official Contact</h3><div class="footer-links"><span><i class="fa-solid fa-location-dot me-2 text-warning"></i>Regional Center, Carpenter Hill, Koronadal City</span><a href="tel:+63832288825"><i class="fa-solid fa-phone me-2 text-warning"></i>(083) 228-8825 / 228-1893</a><a href="mailto:region12@deped.gov.ph"><i class="fa-solid fa-envelope me-2 text-warning"></i>region12@deped.gov.ph</a></div></div></div><div class="footer-bottom"><span>© 2026 Department of Education · Regional Office XII · CLMD. All Rights Reserved.</span><span>Demo portal · Replace sample content and placeholder images before official deployment.</span></div></div></footer>`;
  document.getElementById('siteFooter').innerHTML=footer;

  const globalUi=`<button class="quick-fab" id="quickFab" aria-label="Open quick menu"><i class="fa-solid fa-bolt"></i></button><div class="quick-menu" id="quickMenu"><button data-open-search title="Search"><i class="fa-solid fa-search"></i></button><a href="${p('downloads/index.html')}" title="Downloads"><i class="fa-solid fa-download"></i></a><button data-print-page title="Print"><i class="fa-solid fa-print"></i></button><button data-bs-toggle="offcanvas" data-bs-target="#accessibilityPanel" title="Accessibility"><i class="fa-solid fa-universal-access"></i></button></div><button class="back-to-top" id="backToTop" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>
    <div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Portal search"><div class="search-panel"><div class="ai-search"><i class="fa-solid fa-wand-magic-sparkles"></i><input id="globalSearchInput" type="search" placeholder="Ask the portal to find a program, memo, advisory, resource…" autocomplete="off"><button id="closeGlobalSearch" aria-label="Close search"><i class="bi bi-x-lg"></i></button></div><div class="search-results" id="globalSearchResults"><div class="search-empty"><i class="fa-solid fa-wand-magic-sparkles mb-2 d-block"></i>Search across learning areas, programs, issuances, downloads, gallery records, and analytics.</div></div></div></div>
    <div class="offcanvas offcanvas-end access-panel" tabindex="-1" id="accessibilityPanel"><div class="offcanvas-header"><div><h2 class="offcanvas-title h5 mb-0">Accessibility</h2><small>Personalize your portal experience</small></div><button class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button></div><div class="offcanvas-body"><div class="access-option"><div><strong>Text size</strong><span>Increase or decrease interface text</span></div><div class="font-controls"><button data-font="down">A−</button><button data-font="reset">A</button><button data-font="up">A+</button></div></div><div class="access-option"><div><strong>High contrast</strong><span>Increase visual separation</span></div><div class="form-check form-switch"><input class="form-check-input" id="contrastToggle" type="checkbox"></div></div><div class="access-option"><div><strong>Grayscale</strong><span>Remove color from the interface</span></div><div class="form-check form-switch"><input class="form-check-input" id="grayscaleToggle" type="checkbox"></div></div><div class="access-option"><div><strong>Reduce motion</strong><span>Minimize animation and transitions</span></div><div class="form-check form-switch"><input class="form-check-input" id="motionToggle" type="checkbox"></div></div><div class="access-option"><div><strong>Language</strong><span>Interface language demo</span></div><select id="languageSelect" class="form-select w-auto"><option value="en">English</option><option value="fil">Filipino</option></select></div><button class="btn btn-violet w-100 mt-4" id="resetAccessibility">Reset accessibility settings</button></div></div>`;
  document.getElementById('globalUi').innerHTML=globalUi;

  CLMD.charts=CLMD.charts||[];
  CLMD.addChart=chart=>{CLMD.charts.push(chart);return chart;};
  CLMD.animateCounters=function(scope=document){
    scope.querySelectorAll('[data-count]').forEach(el=>{
      if(el.dataset.counted) return; el.dataset.counted='1';
      const value=Number(el.dataset.count||0), suffix=el.dataset.suffix||'';
      if(window.countUp?.CountUp){const counter=new countUp.CountUp(el,value,{duration:1.7,separator:',',suffix});if(!counter.error)counter.start();else el.textContent=CLMD.number(value)+suffix;}
      else {let start=0;const begin=performance.now();const tick=now=>{const p=Math.min(1,(now-begin)/1100),v=Math.round(value*(1-Math.pow(1-p,3)));el.textContent=CLMD.number(v)+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);}
    });
  };
  CLMD.toast=function(title,text,icon='success'){if(window.Swal)Swal.fire({title,text,icon,confirmButtonColor:'#69358e'});};

  function updateClock(){const el=document.getElementById('phTime');if(el)el.textContent=new Intl.DateTimeFormat('en-PH',{timeZone:'Asia/Manila',weekday:'short',month:'short',day:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date())+' PHT';}
  updateClock(); setInterval(updateClock,60000);
  CLMD.visitor?.refresh();

  const nav=document.getElementById('primaryNav'),toggle=document.getElementById('navToggle'),backdrop=document.getElementById('navBackdrop');
  const closeNav=()=>{nav.classList.remove('open');backdrop.classList.remove('show');document.body.classList.remove('menu-open');};
  toggle.addEventListener('click',()=>{nav.classList.toggle('open');backdrop.classList.toggle('show');document.body.classList.toggle('menu-open',nav.classList.contains('open'));});
  backdrop.addEventListener('click',closeNav); window.addEventListener('resize',()=>{if(innerWidth>=1200)closeNav()});
  window.addEventListener('scroll',()=>{document.querySelector('.main-nav')?.classList.toggle('scrolled',scrollY>20);document.getElementById('backToTop').classList.toggle('show',scrollY>500)});
  document.getElementById('backToTop').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  const setTheme=dark=>{document.body.classList.toggle('dark-mode',dark);localStorage.setItem('clmd-theme',dark?'dark':'light');document.querySelector('#themeToggle i').className=dark?'fa-regular fa-sun':'fa-regular fa-moon';window.dispatchEvent(new CustomEvent('clmd:theme'))};
  setTheme(localStorage.getItem('clmd-theme')==='dark'); document.getElementById('themeToggle').addEventListener('click',()=>setTheme(!document.body.classList.contains('dark-mode')));
  document.getElementById('notificationBtn').addEventListener('click',()=>Swal.fire({title:'Regional Notifications',html:'<div class="text-start small"><p><strong>4 new portal updates</strong></p><hr><p>• Curriculum implementation review schedule posted</p><p>• New learning resource QA cycle opened</p><p>• CRLA submission reminder</p><p>• Action Research Colloquium update</p></div>',icon:'info',confirmButtonColor:'#69358e'}));

  const quick=document.getElementById('quickMenu');document.getElementById('quickFab').addEventListener('click',()=>quick.classList.toggle('open'));document.querySelectorAll('[data-print-page]').forEach(b=>b.addEventListener('click',()=>print()));
  document.querySelectorAll('[data-export-pdf]').forEach(b=>b.addEventListener('click',()=>{CLMD.toast('PDF export','Choose “Save as PDF” in your browser print dialog.','info');setTimeout(()=>print(),350)}));
  document.querySelectorAll('[data-export-table]').forEach(b=>b.addEventListener('click',()=>{
    const table=document.getElementById(b.dataset.exportTable);if(!table)return;
    if(window.XLSX){const wb=XLSX.utils.table_to_book(table,{sheet:'CLMD Data'});XLSX.writeFile(wb,`CLMD-${page}-${new Date().toISOString().slice(0,10)}.xlsx`);}else CLMD.toast('Export unavailable','The Excel library could not be loaded.','warning');
  }));

  const preference=(id,cls,key)=>{const input=document.getElementById(id),stored=localStorage.getItem(key)==='1';input.checked=stored;document.body.classList.toggle(cls,stored);input.addEventListener('change',()=>{document.body.classList.toggle(cls,input.checked);localStorage.setItem(key,input.checked?'1':'0')})};
  preference('contrastToggle','high-contrast','clmd-contrast');preference('grayscaleToggle','grayscale','clmd-grayscale');preference('motionToggle','reduce-motion','clmd-motion');
  document.querySelectorAll('[data-font]').forEach(btn=>btn.addEventListener('click',()=>{const mode=btn.dataset.font;if(mode==='up')document.body.classList.add('large-text');else document.body.classList.remove('large-text');localStorage.setItem('clmd-large-text',document.body.classList.contains('large-text')?'1':'0')}));
  document.body.classList.toggle('large-text',localStorage.getItem('clmd-large-text')==='1');
  document.getElementById('resetAccessibility').addEventListener('click',()=>{['high-contrast','grayscale','reduce-motion','large-text'].forEach(c=>document.body.classList.remove(c));['clmd-contrast','clmd-grayscale','clmd-motion','clmd-large-text'].forEach(k=>localStorage.removeItem(k));document.querySelectorAll('.access-panel input').forEach(i=>i.checked=false);CLMD.toast('Accessibility reset','Display preferences returned to default.')});
  document.getElementById('languageSelect').addEventListener('change',e=>{document.documentElement.lang=e.target.value==='fil'?'fil':'en';Swal.fire({title:e.target.value==='fil'?'Wikang Filipino':'English',text:e.target.value==='fil'?'Demo mode: Ikonekta ang opisyal na salin upang isalin ang buong portal.':'The interface language is set to English.',icon:'info',confirmButtonColor:'#69358e'})});

  CLMD.initSearch?.();
  if(window.AOS)AOS.init({duration:700,once:true,offset:60});
  if(page==='home'&&window.particlesJS){particlesJS('heroParticles',{particles:{number:{value:34,density:{enable:true,value_area:900}},color:{value:'#f1d36d'},shape:{type:'circle'},opacity:{value:.28,random:true},size:{value:2,random:true},line_linked:{enable:true,distance:150,color:'#ffffff',opacity:.12,width:1},move:{enable:true,speed:.7,direction:'none',random:true,out_mode:'out'}},interactivity:{events:{onhover:{enable:false},onclick:{enable:false},resize:true}},retina_detect:true});}
  setTimeout(()=>{document.getElementById('pageLoader')?.classList.add('hidden');CLMD.animateCounters();},650);
})();
