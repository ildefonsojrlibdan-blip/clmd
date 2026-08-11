(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded',async()=>{
    const slug=document.body.dataset.area;
    const [areas,downloads,memos,advisories,site]=await Promise.all([CLMD.load('learning-areas'),CLMD.load('downloads'),CLMD.load('memoranda'),CLMD.load('advisories'),CLMD.load('site')]);
    const area=areas.find(a=>a.slug===slug);if(!area)return;
    document.title=`${area.title} | CLMD Region XII`;
    document.getElementById('crumbTitle').textContent=area.title;document.getElementById('areaTitle').textContent=area.title;document.getElementById('areaOverview').textContent=area.overview;document.getElementById('heroSupervisor').textContent=area.supervisor;document.getElementById('areaIcon').innerHTML=`<i class="fa-solid ${area.icon}"></i>`;
    document.getElementById('areaObjectives').innerHTML=area.objectives.map(x=>`<div>${CLMD.escape(x)}</div>`).join('');
    document.getElementById('programsHandled').innerHTML=area.programsHandled.map(x=>`<span>${CLMD.escape(x)}</span>`).join('');
    document.getElementById('areaProjects').innerHTML=area.projects.map(x=>`<div>${CLMD.escape(x)}</div>`).join('');
    document.getElementById('bestPractices').innerHTML=area.bestPractices.map((x,i)=>`<div class="practice-item"><strong class="d-block mb-1 text-dark">0${i+1}</strong>${CLMD.escape(x)}</div>`).join('');
    document.getElementById('supervisorImage').src=CLMD.asset(area.image);document.getElementById('supervisorName').textContent=area.supervisor;document.getElementById('supervisorPosition').textContent=area.position;document.getElementById('supervisorEmail').textContent=area.email;document.getElementById('supervisorResponsibilities').innerHTML=area.responsibilities.map(x=>`<li>${CLMD.escape(x)}</li>`).join('');
    const words=area.title.toLowerCase().split(/\s+|·|&/).filter(w=>w.length>3),matched=downloads.filter(d=>words.some(w=>`${d.title} ${d.tags.join(' ')}`.toLowerCase().includes(w))||d.category==='Curriculum Guides').slice(0,5);
    document.getElementById('areaDownloads').innerHTML=matched.map(d=>`<div class="download-row"><div class="d-flex align-items-center gap-2"><span class="resource-icon"><i class="fa-solid fa-file-pdf"></i></span><div><strong>${CLMD.escape(d.title)}</strong><small>${d.category} · ${d.size}</small></div></div><a class="table-action" href="${CLMD.asset(d.file)}" download title="Download"><i class="fa-solid fa-download"></i></a></div>`).join('');
    const issues=[...memos.map(x=>({...x,type:'Memo'})),...advisories.map(x=>({...x,type:'Advisory'}))].filter(x=>x.learningArea==='All Learning Areas'||words.some(w=>`${x.learningArea} ${x.title}`.toLowerCase().includes(w))).slice(0,6);
    document.getElementById('areaIssuances').innerHTML=issues.map(x=>`<a class="issuance-row" href="${CLMD.asset(x.file)}" target="_blank"><div><strong>${CLMD.escape(x.number)}</strong><small>${CLMD.escape(x.title)}</small></div><span class="portal-tag">${x.type}</span></a>`).join('')||'<p class="text-muted small">Use the regional repositories for current issuances.</p>';
    document.getElementById('areaAnnouncements').innerHTML=site.announcements.slice(0,3).map(item=>`<div class="issuance-row"><div><strong>${CLMD.escape(item.title)}</strong><small>${CLMD.date(item.date)} · ${CLMD.escape(item.tag)}</small></div><span class="portal-tag">Announcement</span></div>`).join('');
    document.getElementById('areaGallery').innerHTML=area.gallery.map((src,i)=>`<figure data-gallery-src="${CLMD.asset(src)}"><img src="${CLMD.asset(src)}" alt="${CLMD.escape(area.title)} activity placeholder ${i+1}" loading="lazy"></figure>`).join('');
    document.querySelector('[data-contact-supervisor]').addEventListener('click',()=>location.href=`${CLMD.root}contact.html?subject=${encodeURIComponent(area.title)}`);
    document.querySelectorAll('[data-gallery-src]').forEach(f=>f.addEventListener('click',()=>Swal.fire({imageUrl:f.dataset.gallerySrc,imageAlt:area.title,showConfirmButton:false,showCloseButton:true,width:900,background:getComputedStyle(document.body).getPropertyValue('--surface'),color:getComputedStyle(document.body).getPropertyValue('--ink')})));
  });
})();
