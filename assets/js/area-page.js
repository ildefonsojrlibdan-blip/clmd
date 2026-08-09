/* ============================================================
   CLMD - Learning Area Page Renderer
   Reads window.CLMD_AREA and renders the full area page from
   assets/data/learning-areas.json (plus memos/advisories/gallery).
   ============================================================ */
(function () {
  "use strict";
  function rel(p) { let pre=""; for (let i=0;i<(window.CLMD_DEPTH||0);i++) pre+="../"; return pre+p; }
  document.addEventListener("DOMContentLoaded", function () {
    const areaId = window.CLMD_AREA;
    const root = document.getElementById("areaRoot");
    if (!areaId || !root) return;

    Promise.all([
      fetch(rel("assets/data/learning-areas.json")).then(r=>r.json()),
      fetch(rel("assets/data/memoranda.json")).then(r=>r.json()).catch(()=>({items:[]})),
      fetch(rel("assets/data/advisories.json")).then(r=>r.json()).catch(()=>({items:[]})),
      fetch(rel("assets/data/gallery.json")).then(r=>r.json()).catch(()=>({items:[]}))
    ]).then(([areasData, mem, adv, gal]) => {
      const area = areasData.areas.find(a => a.id === areaId);
      if (!area) { root.innerHTML = '<div class="container py-5 text-center"><h2>Learning area not found</h2></div>'; return; }
      const eps = area.eps || {};

      // Filter memoranda/advisories by keyword match to area
      const kw = area.name.toLowerCase();
      // Memoranda: prefer explicit linkedAreas mapping, fall back to keyword match
      const memCandidates = mem.items.filter(m => (m.linkedAreas && m.linkedAreas.includes(areaId)) ||
        (!m.linkedAreas && (m.title + " " + m.area + " " + m.program + " " + m.keywords).toLowerCase().includes(kw)));
      const areaMems = memCandidates.slice(0,4);
      const areaAdvs = adv.items.filter(m => (m.title + " " + m.area + " " + m.program + " " + m.keywords).toLowerCase().includes(kw)).slice(0,4);
      const areaGallery = gal.items.filter(g => g.program.toLowerCase().includes(kw) || g.title.toLowerCase().includes(kw)).slice(0,6);

      document.title = area.name + " | Curriculum & Learning Management Division - DepEd Region XII";

      root.innerHTML = `
        <!-- Banner -->
        <section class="hero" style="min-height:auto;padding:5rem 0;background:url('${rel(area.banner)}') center/cover">
          <div class="hero-overlay" style="background:linear-gradient(135deg,rgba(42,18,69,.55),rgba(91,45,142,.75))"></div>
          <div class="container hero-content text-center">
            <span class="hero-badge"><i class="bi ${area.icon}"></i> Learning Area</span>
            <h1 class="mt-3">${area.name}</h1>
            <p class="lead mx-auto" style="max-width:640px">Curriculum, programs, projects, and resources managed by the CLMD.</p>
          </div>
        </section>

        <!-- EPS -->
        <section class="section-sm">
          <div class="container">
            <div class="glass eps-card" data-aos="fade-up">
              <div class="photo"><img src="${rel(eps.photo||'assets/images/profile/eps_lrmds.png')}" alt="${eps.name}" loading="lazy"></div>
              <div class="flex-fill">
                <span class="section-eyebrow">Education Program Supervisor</span>
                <h3>${eps.name}</h3>
                <div class="pos" style="color:var(--gold-dark);font-weight:700">${eps.position}</div>
                <p class="muted mb-1"><i class="bi bi-envelope me-1"></i><a href="mailto:${eps.email}">${eps.email}</a></p>
                <div class="mt-2"><strong>Responsibilities:</strong></div>
                <ul class="mb-2">${(eps.responsibilities||[]).map(r=>`<li>${r}</li>`).join('')}</ul>
                <div>${(eps.programsHandled||[]).map(p=>`<span class="chip">${p}</span>`).join('')}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Overview -->
        <section class="section-sm">
          <div class="container">
            <div class="row g-4 align-items-center">
              <div class="col-lg-6" data-aos="fade-right">
                <span class="section-eyebrow">Overview</span>
                <h2>About ${area.name}</h2>
                <p class="muted fs-5">${area.overview}</p>
              </div>
              <div class="col-lg-6" data-aos="fade-left">
                <div class="glass p-4">
                  <h4><i class="bi bi-bullseye me-2 text-primary"></i>Objectives</h4>
                  <ul class="icon-list">${area.objectives.map(o=>`<li>${o}</li>`).join('')}</ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Programs & Projects -->
        <section class="section bg-soft">
          <div class="container">
            <div class="section-head" data-aos="fade-up">
              <span class="section-eyebrow">Programs &amp; Projects</span>
              <h2>Initiatives in ${area.name}</h2><div class="rule"></div>
            </div>
            <div class="row g-4">
              <div class="col-md-6" data-aos="fade-up">
                <div class="card-g p-4 h-100">
                  <h4><i class="bi bi-kanban me-2 gold-text"></i>Programs</h4>
                  ${area.programs.map(p=>`<div class="d-flex align-items-start gap-2 mb-2"><i class="bi bi-check-circle-fill text-success mt-1"></i><span>${p}</span></div>`).join('')}
                </div>
              </div>
              <div class="col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div class="card-g p-4 h-100">
                  <h4><i class="bi bi-rocket-takeoff me-2 gold-text"></i>Projects</h4>
                  ${area.projects.map(p=>`<div class="d-flex align-items-start gap-2 mb-2"><i class="bi bi-check-circle-fill text-primary mt-1"></i><span>${p}</span></div>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Best Practices -->
        <section class="section-sm">
          <div class="container">
            <div class="section-head" data-aos="fade-up"><span class="section-eyebrow">Best Practices</span><h2>Exemplary Practices</h2><div class="rule"></div></div>
            <div class="row g-3" data-aos="fade-up">
              ${area.bestPractices.map(b=>`<div class="col-md-6 col-lg-3"><div class="card-g p-4 h-100 hover-lift text-center"><i class="bi bi-star gold-text" style="font-size:1.8rem"></i><p class="mb-0 mt-2">${b}</p></div></div>`).join('')}
            </div>
          </div>
        </section>

        <!-- Announcements & Resources -->
        <section class="section bg-soft">
          <div class="container">
            <div class="row g-4">
              <div class="col-lg-6" data-aos="fade-up">
                <div class="card-g p-4 h-100">
                  <h4><i class="bi bi-megaphone me-2 text-danger"></i>Announcements</h4>
                  <ul class="list-unstyled mb-0">
                    ${area.announcements.map(a=>`<li class="d-flex gap-2 mb-2"><i class="bi bi-bell-fill text-warning"></i><span>${a}</span></li>`).join('')}
                  </ul>
                </div>
              </div>
              <div class="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                <div class="card-g p-4 h-100">
                  <h4><i class="bi bi-book me-2 text-primary"></i>Curriculum Guides &amp; Learning Resources</h4>
                  <p class="muted mb-1">Curriculum Guides:</p>
                  <ul class="icon-list mb-3">${area.curriculumGuides.map(c=>`<li>${c}</li>`).join('')}</ul>
                  <p class="muted mb-1">Learning Resources:</p>
                  <ul class="icon-list">${area.learningResources.map(c=>`<li>${c}</li>`).join('')}</ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Regional Memoranda & Advisories -->
        <section class="section-sm">
          <div class="container">
            <div class="row g-4">
              <div class="col-lg-6" data-aos="fade-up">
                <h4><i class="bi bi-file-earmark-text me-2 text-primary"></i>Related Regional Memoranda</h4>
                ${areaMems.length ? areaMems.map(m=>`
                  <div class="card-g repo-item mb-3 hover-lift d-flex align-items-center gap-2">
                    <div class="flex-grow-1">
                      <div class="mno">${m.no}</div>
                      <div class="mtitle">${m.title}</div>
                      <small class="muted">${m.date} · ${m.issuedTo}</small>
                    </div>
                    ${m.pdf ? `<div class="d-flex flex-column gap-1">
                      <a class="btn btn-ghost btn-sm" href="${rel(m.pdf)}" target="_blank" rel="noopener"><i class="bi bi-eye"></i></a>
                      <a class="btn btn-violet btn-sm" href="${rel(m.pdf)}" download="${m.no}.pdf"><i class="bi bi-download"></i></a>
                    </div>` : ''}
                  </div>`).join('') : '<p class="muted">No memoranda currently linked.</p>'}
                <a href="${rel('memoranda.html')}" class="btn btn-ghost btn-sm">View All Memoranda</a>
              </div>
              <div class="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                <h4><i class="bi bi-megaphone me-2 text-warning"></i>Related Regional Advisories</h4>
                ${areaAdvs.length ? areaAdvs.map(m=>`
                  <div class="card-g repo-item mb-3 hover-lift">
                    <div class="mno">${m.no}</div>
                    <div class="mtitle">${m.title}</div>
                    <small class="muted">${m.date} · ${m.issuedTo}</small>
                  </div>`).join('') : '<p class="muted">No advisories currently linked.</p>'}
                <a href="${rel('advisories.html')}" class="btn btn-ghost btn-sm">View All Advisories</a>
              </div>
            </div>
          </div>
        </section>

        <!-- Photo gallery -->
        <section class="section bg-soft">
          <div class="container">
            <div class="section-head" data-aos="fade-up"><span class="section-eyebrow">Gallery</span><h2>${area.name} in Photos</h2><div class="rule"></div></div>
            <div class="row g-3" data-aos="fade-up">
              ${areaGallery.length ? areaGallery.map(g=>`
                <div class="col-6 col-md-4 col-lg-2">
                  <div class="gallery-item"><img src="${rel(g.img)}" alt="${g.title}" data-lightbox="${rel(g.img)}" data-caption="${g.title}" loading="lazy"><div class="overlay"><h5>${g.title}</h5></div></div>
                </div>`).join('') : '<div class="col-12 muted text-center">No photos available yet.</div>'}
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="section-sm">
          <div class="container text-center">
            <div class="glass p-4" data-aos="zoom-in">
              <h3>Need learning resources for ${area.name}?</h3>
              <p class="muted">Download curriculum guides, LAS, and official materials from the Download Center.</p>
              <a href="${rel('downloads.html')}" class="btn btn-gold"><i class="bi bi-download me-2"></i>Go to Downloads</a>
            </div>
          </div>
        </section>`;

      window.CLMD.initLightbox(root);
      window.CLMD.initCounters(root);
    }).catch(e => { root.innerHTML = '<div class="container py-5 text-center muted">Failed to load data.</div>'; });
  });
})();
