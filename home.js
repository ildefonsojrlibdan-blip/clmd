(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded',async()=>{
    const [site,areas,programs,featuredStories]=await Promise.all([CLMD.load('site'),CLMD.load('learning-areas'),CLMD.load('programs'),CLMD.load('featured-stories')]);
    document.getElementById('homeStats').innerHTML=site.stats.map(s=>`<div class="stat-item"><div class="stat-icon"><i class="fa-solid ${s.icon}"></i></div><div><strong class="stat-value" data-count="${s.value}" data-suffix="${s.suffix}">0</strong><span class="stat-label">${CLMD.escape(s.label)}</span></div></div>`).join('');
    const quick=[
      ['learning-areas/index.html','fa-book-open-reader','Learning Areas','Curriculum leadership, programs, supervisors, and resources'],
      ['analytics/assessment.html','fa-clipboard-check','Learning Assessment','CRLA, RMA, and PHIL-IRI results'],
      ['downloads/index.html','fa-cloud-arrow-down','Download Center','Guides, resources, forms, templates, and reports'],
      ['advisories/index.html','fa-file-signature','Regional Memoranda','Thirteen validated official CLMD memoranda'],
      ['programs/index.html','fa-diagram-project','Programs & Projects','Regional accomplishments, awardees, and highlights'],
      ['gallery/index.html','fa-images','Photo Gallery','Regional learning stories and event highlights']
    ];
    document.getElementById('quickLinks').innerHTML=quick.map((q,i)=>`<a class="quick-card" data-aos="fade-up" data-aos-delay="${(i%4)*60}" href="${q[0]}"><i class="fa-solid ${q[1]}"></i><h3>${q[2]}</h3><p>${q[3]}</p></a>`).join('');
    document.getElementById('featuredStories').innerHTML=featuredStories.map((story,index)=>`<article class="story-card" data-aos="fade-up" data-aos-delay="${index*80}"><a href="gallery/index.html"><img src="${CLMD.asset(story.image)}" alt="${CLMD.escape(story.event)}" loading="lazy"><div class="story-overlay"><span>${CLMD.escape(story.label)}</span><h3>${CLMD.escape(story.title)}</h3><p>${CLMD.escape(story.caption)}</p><strong>View gallery <i class="fa-solid fa-arrow-right"></i></strong></div></a></article>`).join('');
    document.getElementById('homeAreas').innerHTML=areas.slice(0,8).map(a=>`<a class="area-card" data-aos="fade-up" href="learning-areas/${a.slug}.html"><div class="area-icon"><i class="fa-solid ${a.icon}"></i></div><h3>${CLMD.escape(a.title)}</h3><p>${CLMD.escape(a.short)}</p><span class="area-supervisor"><img src="${CLMD.asset(a.image)}" alt="" loading="lazy"><span>${CLMD.escape(a.supervisor)}</span></span></a>`).join('');
    document.getElementById('homeLeaders').innerHTML=site.leaders.map((l,i)=>`<div class="col-lg-4"><article class="leader-card" data-aos="fade-up" data-aos-delay="${i*90}"><div class="leader-photo"><img src="${CLMD.asset(l.image)}" alt="Photo placeholder for ${CLMD.escape(l.name)}" loading="lazy"></div><div class="leader-body"><span class="section-kicker">${CLMD.escape(l.position)}</span><h3>${CLMD.escape(l.name)}</h3><p class="leader-message">“${CLMD.escape(l.message)}”</p><a class="text-link" href="about.html#leadership">Read More <i class="fa-solid fa-arrow-right"></i></a></div></article></div>`).join('');
    document.getElementById('homeAnnouncements').innerHTML=site.announcements.map(a=>{const d=new Date(`${a.date}T00:00:00`);return`<article class="announcement-item"><div class="announcement-date"><strong>${d.getDate()}</strong>${new Intl.DateTimeFormat('en-PH',{month:'short'}).format(d)}</div><div><span class="announcement-tag">${CLMD.escape(a.tag)}</span><h3>${CLMD.escape(a.title)}</h3><p>${CLMD.escape(a.text)}</p></div><a class="text-link" href="advisories/index.html">View <i class="fa-solid fa-arrow-right"></i></a></article>`}).join('');

    const c=CLMD.chartColors();

    const stats=CLMD.visitor.getStats();
    document.getElementById('visitorKpis').innerHTML=[['Total',stats.total,'total'],['Today',stats.today,'today'],['This Week',stats.week,'week'],['This Month',stats.month,'month'],['Returning',stats.returning,'returning']].map(x=>`<div class="visitor-kpi"><strong data-count="${x[1]}" data-visitor-${x[2]}>0</strong><span>${x[0]}</span></div>`).join('');
    CLMD.addChart(new Chart(document.getElementById('visitorChart'),{type:'line',data:{labels:stats.labels,datasets:[{label:'Visitors',data:stats.trend,borderColor:c.violet,backgroundColor:'rgba(105,53,142,.12)',fill:true,tension:.4,pointRadius:3,pointBackgroundColor:c.gold}]},options:{...CLMD.baseChartOptions({legend:false}),scales:{x:{grid:{display:false},ticks:{color:c.muted,font:{size:8}}},y:{display:false,beginAtZero:true}}}}));
    document.getElementById('visitorGeo').innerHTML=`<div><strong>Top Countries</strong>${stats.countries.map(x=>`<span>${x.name}<b>${x.share}%</b></span>`).join('')}</div><div><strong>Regional Reach</strong>${stats.regions.map(x=>`<span>${x.name}<b>${x.share}%</b></span>`).join('')}</div>`;

    // Slideshow controls
    const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.hero-dots button')];let current=0,timer;
    const show=i=>{current=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===current));dots.forEach((d,n)=>d.classList.toggle('active',n===current));const active=slides[current];document.getElementById('heroStoryLabel').textContent=active.dataset.label||'';document.getElementById('heroStoryText').textContent=active.dataset.caption||'';};
    const autoplay=()=>{clearInterval(timer);timer=setInterval(()=>show(current+1),6500)};
    dots.forEach((dot,i)=>{dot.setAttribute('aria-label',`Show ${slides[i].dataset.label||`slide ${i+1}`}`);dot.addEventListener('click',()=>{show(i);autoplay()})});if(!document.body.classList.contains('reduce-motion'))autoplay();
    CLMD.animateCounters();
  });
})();
