/* ============================================================
   CLMD Website - Main Application Script
   Handles: header/footer injection, dark mode, search,
   notifications, back-to-top, floating menu, accessibility,
   language toggle, visitor counter, animations.
   ============================================================ */
(function () {
  "use strict";

  const SITE = {
    email: "clmd.region12@deped.gov.ph",
    tel: "(083) 228-8825 / 228-8826",
    social: [
      { icon: "bi-facebook", url: "#", label: "Facebook" },
      { icon: "bi-twitter-x", url: "#", label: "Twitter / X" },
      { icon: "bi-youtube", url: "#", label: "YouTube" },
      { icon: "bi-envelope", url: "mailto:clmd.region12@deped.gov.ph", label: "Email" }
    ]
  };

  const NAV = {
    "Home": "index.html",
    "About CLMD": { url: "about.html", children: ["Vision & Mission", "Leadership"] },
    "Learning Areas": { url: "learning-areas/english.html", children: ["English","Mathematics","Science","Filipino","Araling Panlipunan","Values Education","MAPEH","TLE","Special Curricular Programs","Inclusive Education","Strengthened SHS","LRMDS"] },
    "Programs": "programs.html",
    "Analytics": { url: "analytics/performance.html", children: ["Regional Performance","Aral Program","Learning Assessment","Visitor Analytics"] },
    "Memoranda": "memoranda.html",
    "Advisories": "advisories.html",
    "Downloads": "downloads.html",
    "Gallery": "gallery.html",
    "Contact": "contact.html"
  };

  // Learning area children map
  const AREA_CHILDREN = {
    "English": "english.html", "Mathematics": "math.html", "Science": "science.html",
    "Filipino": "filipino.html", "Araling Panlipunan": "ap.html", "Values Education": "values.html",
    "MAPEH": "mapeh.html", "TLE": "tle.html", "Special Curricular Programs": "scp.html",
    "Inclusive Education": "inclusive.html", "Strengthened SHS": "sshs.html", "LRMDS": "lrmds.html"
  };
  const ANALYTICS_CHILDREN = { "Regional Performance": "performance.html", "Aral Program": "aral.html", "Learning Assessment": "assessment.html", "Visitor Analytics": "visitors.html" };

  // ---------- DOM helpers ----------
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---------- Resolve nav path (works from any depth) ----------
  function rel(path) {
    // Current page depth to root
    const depth = window.CLMD_DEPTH || 0;
    let prefix = "";
    for (let i = 0; i < depth; i++) prefix += "../";
    return prefix + path;
  }

  // ---------- Build header ----------
  function buildHeader() {
    const holder = document.getElementById("site-header");
    if (!holder) return;

    const active = document.body.dataset.page || "";
    let navLinks = "";
    for (const [label, val] of Object.entries(NAV)) {
      let href, children = null;
      if (typeof val === "string") { href = val; }
      else { href = val.url; children = val.children; }

      const isActive = active === label;
      if (children) {
        let childLinks = "";
        children.forEach((c) => {
          let target;
          if (label === "Learning Areas" && AREA_CHILDREN[c]) target = "learning-areas/" + AREA_CHILDREN[c];
          else if (label === "Analytics" && ANALYTICS_CHILDREN[c]) target = "analytics/" + ANALYTICS_CHILDREN[c];
          else if (c === "Vision & Mission") target = "about.html#vision";
          else if (c === "Leadership") target = "about.html#leadership";
          else target = href;
          const cActive = (document.body.dataset.child === c);
          childLinks += `<li><a class="dropdown-item ${cActive ? 'active' : ''}" href="${rel(target)}">${c}</a></li>`;
        });
        navLinks += `<li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle ${isActive ? 'active' : ''}" href="${rel(href)}" data-bs-toggle="dropdown">${label}</a>
          <ul class="dropdown-menu">${childLinks}</ul></li>`;
      } else {
        navLinks += `<li class="nav-item"><a class="nav-link ${isActive ? 'active' : ''}" href="${rel(href)}">${label}</a></li>`;
      }
    }

    holder.innerHTML = `
    <div class="topbar no-print">
      <div class="container">
        <div><i class="bi bi-geo-alt me-1"></i> Carpenter Hill, Koronadal City · <i class="bi bi-envelope me-1 ms-1"></i> <a href="mailto:${SITE.email}">${SITE.email}</a></div>
        <div class="tb-right">
          <span class="visitor-mini d-none d-md-inline"><i class="bi bi-eye me-1"></i>Visitors: <span id="visitor-mini-count">0</span></span>
          <div class="social">
            ${SITE.social.map(s=>`<a href="${s.url}" aria-label="${s.label}"><i class="bi ${s.icon}"></i></a>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <nav class="navbar navbar-expand-lg navbar-custom no-print" aria-label="Main navigation">
      <div class="container">
        <a class="navbar-brand" href="${rel('index.html')}">
          <img src="${rel('assets/images/icons/clmd-logo.png')}" alt="CLMD Logo" loading="lazy">
          <span class="brand-text">
            <strong>CURRICULUM &amp; LEARNING<br>MANAGEMENT DIVISION</strong>
            <small>DepEd Regional Office XII · SOCCSKSARGEN</small>
          </span>
        </a>
        <div class="nav-tools d-lg-none ms-auto me-1">
          <button class="icon-btn" data-action="search" aria-label="Search"><i class="bi bi-search"></i></button>
          <button class="icon-btn" data-action="darkmode" aria-label="Dark mode"><i class="bi bi-moon-stars"></i></button>
          <button class="navbar-toggler icon-btn" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Toggle navigation"><i class="bi bi-list"></i></button>
        </div>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">${navLinks}</ul>
          <div class="nav-tools d-none d-lg-flex">
            <button class="icon-btn" data-action="search" aria-label="Search"><i class="bi bi-search"></i></button>
            <button class="icon-btn" data-action="darkmode" aria-label="Dark mode"><i class="bi bi-moon-stars"></i></button>
            <button class="icon-btn" data-action="notif" aria-label="Notifications"><i class="bi bi-bell"></i><span class="notif-dot"></span></button>
            <button class="icon-btn" data-action="access" aria-label="Accessibility"><i class="bi bi-person-lines-fill"></i></button>
          </div>
        </div>
      </div>
    </nav>`;
  }

  // ---------- Build footer ----------
  function buildFooter() {
    const holder = document.getElementById("site-footer");
    if (!holder) return;
    holder.innerHTML = `
    <footer class="footer no-print">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <div class="d-flex align-items-center gap-3 mb-3">
              <img src="${rel('assets/images/icons/deped-logo.png')}" alt="DepEd" width="64" height="64">
              <div>
                <h5 class="mb-0">Curriculum &amp; Learning Management Division</h5>
                <small>Department of Education · Regional Office XII</small>
              </div>
            </div>
            <p class="muted" style="color:rgba(255,255,255,.8)">Transforming Learning Through Quality Curriculum and Excellent Educational Leadership.</p>
            <div class="social">
              ${SITE.social.map(s=>`<a class="me-2" href="${s.url}" aria-label="${s.label}"><i class="bi ${s.icon} fs-5"></i></a>`).join('')}
            </div>
          </div>
          <div class="col-lg-2 col-md-6">
            <h5>Quick Links</h5>
            <ul class="f-links">
              <li><a href="${rel('index.html')}"><i class="bi bi-chevron-right"></i>Home</a></li>
              <li><a href="${rel('about.html')}"><i class="bi bi-chevron-right"></i>About CLMD</a></li>
              <li><a href="${rel('programs.html')}"><i class="bi bi-chevron-right"></i>Programs</a></li>
              <li><a href="${rel('downloads.html')}"><i class="bi bi-chevron-right"></i>Downloads</a></li>
              <li><a href="${rel('memoranda.html')}"><i class="bi bi-chevron-right"></i>Memoranda</a></li>
              <li><a href="${rel('gallery.html')}"><i class="bi bi-chevron-right"></i>Gallery</a></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-6">
            <h5>Learning Areas</h5>
            <ul class="f-links">
              ${Object.entries(AREA_CHILDREN).slice(0,8).map(([l,f]) => `<li><a href="${rel('learning-areas/'+f)}"><i class="bi bi-chevron-right"></i>${l}</a></li>`).join('')}
            </ul>
          </div>
          <div class="col-lg-3 col-md-6">
            <h5>Contact</h5>
            <ul class="f-links">
              <li><i class="bi bi-geo-alt"></i> Carpenter Hill, City Proper, Koronadal City, South Cotabato</li>
              <li><i class="bi bi-envelope"></i> <a href="mailto:${SITE.email}">${SITE.email}</a></li>
              <li><i class="bi bi-telephone"></i> ${SITE.tel}</li>
            </ul>
            <div class="mt-3">
              <img src="${rel('assets/images/icons/deped-xii.png')}" alt="DepEd XII" width="54" height="54">
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          &copy; <span id="year"></span> Curriculum &amp; Learning Management Division · DepEd Regional Office XII (SOCCSKSARGEN). All rights reserved.
        </div>
      </div>
    </footer>
    <button class="back-to-top no-print" id="backToTop" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>
    <div class="floating-menu no-print">
      <button class="icon-btn" data-action="access" aria-label="Accessibility"><i class="bi bi-person-lines-fill"></i></button>
      <button class="icon-btn" data-action="print" aria-label="Print page"><i class="bi bi-printer"></i></button>
      <button class="icon-btn pulse-gold" data-action="top" aria-label="Quick menu"><i class="bi bi-grid"></i></button>
    </div>
    <div class="notif-panel no-print" id="notifPanel"></div>`;
  }

  // ---------- Dark mode ----------
  function applyTheme() {
    const t = localStorage.getItem("clmd-theme") || "light";
    document.documentElement.setAttribute("data-theme", t === "dark" ? "dark" : "light");
    qsa("[data-action='darkmode']").forEach((b) => {
      const icon = qs("i", b);
      if (icon) icon.className = "bi " + (t === "dark" ? "bi-sun" : "bi-moon-stars");
    });
    document.dispatchEvent(new CustomEvent("clmd-theme-changed", { detail: { theme: t } }));
  }

  // ---------- Notifications ----------
  const NOTIFS = [
    { title: "2025 Festival of Talents", body: "Registration is now open across all SDOs.", icon: "bi-trophy", time: "2h ago" },
    { title: "CRLA Administration", body: "Submission deadline is on Friday.", icon: "bi-journal-text", time: "5h ago" },
    { title: "New Memoranda Released", body: "RM No. 2025-0112 has been published.", icon: "bi-file-earmark-text", time: "1d ago" },
    { title: "Aral Program Report", body: "Q3 learning gains have been uploaded.", icon: "bi-graph-up-arrow", time: "2d ago" }
  ];
  function buildNotifs() {
    const panel = document.getElementById("notifPanel");
    if (!panel) return;
    panel.innerHTML = `<div class="n-head"><span><i class="bi bi-bell me-1"></i>Notifications</span><span class="badge bg-light text-dark">${NOTIFS.length}</span></div>` +
      NOTIFS.map(n => `<div class="notif-item"><h6><i class="bi ${n.icon} me-1 text-primary"></i>${n.title}</h6><small class="muted">${n.body}</small><div class="text-end"><small class="muted">${n.time}</small></div></div>`).join('');
  }

  // ---------- Global search ----------
  let SEARCH_INDEX = [];
  function loadSearchIndex() {
    const idx = [];
    const areasP = fetch(rel("assets/data/learning-areas.json")).then(r => r.json()).then(d => {
      d.areas.forEach(a => {
        idx.push({ type: "Learning Area", title: a.name, desc: a.overview, url: rel("learning-areas/" + a.id + ".html"), icon: a.icon });
      });
    }).catch(() => {});
    const memP = fetch(rel("assets/data/memoranda.json")).then(r => r.json()).then(d => {
      d.items.forEach(m => idx.push({ type: "Memorandum", title: m.no + " - " + m.title, desc: m.issuedTo, url: rel("memoranda.html#mem-" + m.no.replace(/\s/g, "-")), icon: "bi-file-earmark-text" }));
    }).catch(() => {});
    const advP = fetch(rel("assets/data/advisories.json")).then(r => r.json()).then(d => {
      d.items.forEach(m => idx.push({ type: "Advisory", title: m.no + " - " + m.title, desc: m.issuedTo, url: rel("advisories.html#adv-" + m.no.replace(/\s/g, "-")), icon: "bi-megaphone" }));
    }).catch(() => {});
    const dwnP = fetch(rel("assets/data/downloads.json")).then(r => r.json()).then(d => {
      d.items.forEach(i => idx.push({ type: "Download", title: i.name, desc: i.desc, url: rel("downloads.html"), icon: "bi-download" }));
    }).catch(() => {});
    const galP = fetch(rel("assets/data/gallery.json")).then(r => r.json()).then(d => {
      d.items.forEach(g => idx.push({ type: "Gallery", title: g.title, desc: g.program, url: rel("gallery.html"), icon: "bi-image" }));
    }).catch(() => {});
    Promise.all([areasP, memP, advP, dwnP, galP]).then(() => { SEARCH_INDEX = idx; });
  }

  function renderSearchResults(term, container, limit) {
    const q = term.toLowerCase().trim();
    if (!q) { container.innerHTML = '<div class="p-3 muted text-center">Start typing to search the CLMD portal...</div>'; return; }
    const res = SEARCH_INDEX.filter(i => (i.title + " " + i.desc + " " + i.type).toLowerCase().includes(q)).slice(0, limit || 8);
    if (!res.length) { container.innerHTML = '<div class="p-3 muted text-center">No results found for &quot;' + term + '&quot;.</div>'; return; }
    container.innerHTML = res.map(i =>
      `<a class="s-item" href="${i.url}"><i class="bi ${i.icon}"></i><div><strong>${i.title}</strong><br><small class="muted">${i.type} · ${i.desc}</small></div></a>`).join("");
  }

  // ---------- Global action handler ----------
  function wireActions() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === "darkmode") {
        const t = (document.documentElement.getAttribute("data-theme") === "dark") ? "light" : "dark";
        localStorage.setItem("clmd-theme", t);
        applyTheme();
      } else if (action === "search") {
        openSearchOverlay();
      } else if (action === "notif") {
        const panel = document.getElementById("notifPanel");
        panel.classList.toggle("show");
        const dot = qs(".notif-dot"); if (dot) dot.style.display = "none";
      } else if (action === "access") {
        openAccessibility();
      } else if (action === "print") {
        window.print();
      } else if (action === "top") {
        document.getElementById("backToTop").click();
      }
    });
    document.addEventListener("click", (e) => {
      const panel = document.getElementById("notifPanel");
      if (panel && panel.classList.contains("show") && !e.target.closest("#notifPanel") && !e.target.closest("[data-action='notif']")) panel.classList.remove("show");
    });
  }

  // ---------- Search overlay ----------
  function openSearchOverlay() {
    let ov = document.getElementById("searchOverlay");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "searchOverlay";
      ov.className = "search-overlay no-print";
      ov.innerHTML = `<div class="so-box">
        <input type="text" id="soInput" placeholder="Search learning areas, programs, memos, advisories, downloads..." aria-label="Search">
        <div class="so-results" id="soResults"></div>
      </div>`;
      document.body.appendChild(ov);
      const inp = qs("#soInput", ov);
      inp.addEventListener("input", () => renderSearchResults(inp.value, qs("#soResults", ov), 12));
      inp.addEventListener("keydown", (e) => { if (e.key === "Escape") ov.classList.remove("show"); });
      ov.addEventListener("click", (e) => { if (e.target === ov) ov.classList.remove("show"); });
    }
    ov.classList.add("show");
    setTimeout(() => qs("#soInput", ov).focus(), 50);
  }

  // ---------- Accessibility ----------
  function openAccessibility() {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "Accessibility Options",
        html: `<div class="text-start">
          <button class="btn btn-violet w-100 mb-2" id="acc-font"><i class="bi bi-type"></i> Toggle Large Text</button>
          <button class="btn btn-violet w-100 mb-2" id="acc-contrast"><i class="bi bi-contrast"></i> High Contrast</button>
          <button class="btn btn-violet w-100 mb-2" id="acc-lang"><i class="bi bi-translate"></i> Toggle Language (EN / FIL)</button>
          <button class="btn btn-violet w-100" id="acc-reset"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
        </div>`,
        showConfirmButton: false, showCloseButton: true,
        didOpen: () => {
          qs("#acc-font").onclick = () => {
            const cur = parseFloat(getComputedStyle(document.body).fontSize);
            document.body.style.fontSize = (cur < 18 ? 19 : 16) + "px";
          };
          qs("#acc-contrast").onclick = () => {
            const isHc = document.documentElement.getAttribute("data-theme") === "high-contrast";
            document.documentElement.setAttribute("data-theme", isHc ? (localStorage.getItem("clmd-theme") || "light") : "high-contrast");
          };
          qs("#acc-lang").onclick = () => {
            const cur = document.documentElement.getAttribute("lang") === "en" ? "fil" : "en";
            document.documentElement.setAttribute("lang", cur);
            const msg = cur === "en" ? "Language set to English." : "Wika naitakda sa Filipino.";
            window.CLMD.toast("success", msg + " (Static labels; extend via i18n JSON as needed.)");
          };
          qs("#acc-reset").onclick = () => {
            document.body.style.fontSize = "";
            const saved = localStorage.getItem("clmd-theme") || "light";
            document.documentElement.setAttribute("data-theme", saved);
          };
        }
      });
    } else {
      alert("Accessibility options: use the theme toggle and your browser's text zoom.");
    }
  }

  // ---------- Back to top ----------
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 400);
    });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // ---------- Reveal on scroll (fallback to AOS) ----------
  function initReveal() {
    if (window.AOS) {
      window.AOS.init({ duration: 800, once: true, offset: 60 });
      return;
    }
    const els = qsa(".reveal");
    if (!els.length || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    els.forEach(e => io.observe(e));
  }

  // ---------- Particles ----------
  function initParticles() {
    if (window.particlesJS && document.getElementById("particles-js")) {
      particlesJS("particles-js", {
        particles: {
          number: { value: 70, density: { enable: true, value_area: 900 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.4, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 130, color: "#ffffff", opacity: 0.22, width: 1 },
          move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
          detect_on: "canvas", events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
          modes: { grab: { distance: 140, line_linked: { opacity: 0.4 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
      });
    }
  }

  // ---------- Visitor counter (localStorage demo) ----------
  function initVisitor() {
    const KEY = "clmd-visitors";
    let data = {};
    try { data = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { data = {}; }
    const now = new Date();
    const todayKey = now.toDateString();

    // Initialize defaults if not present
    if (!data.total) data = Object.assign({}, { total: 124530, today: 342, week: 2408, month: 10420, online: 186, returning: 62040, history: {} }, data);
    if (!data.lastDay) data.lastDay = todayKey;

    // Reset daily counters if new day
    if (data.lastDay !== todayKey) { data.today = 0; data.lastDay = todayKey; }

    // Count this visit once per session
    const sessionKey = "clmd-visited-" + todayKey;
    if (!sessionStorage.getItem(sessionKey)) {
      data.total += 1;
      data.today += 1;
      data.week += 1;
      data.month += 1;
      const isReturning = localStorage.getItem("clmd-returned");
      if (isReturning) { data.returning += 1; } else { localStorage.setItem("clmd-returned", "1"); }
      const dk = now.toISOString().slice(0, 10);
      data.history[dk] = (data.history[dk] || 0) + 1;
      sessionStorage.setItem(sessionKey, "1");
    }

    localStorage.setItem(KEY, JSON.stringify(data));
    window.CLMD_VISITORS = data;

    // Update any elements
    const mini = document.getElementById("visitor-mini-count");
    if (mini) mini.textContent = data.total.toLocaleString();
    document.querySelectorAll("[data-visitor='total']").forEach(el => el.textContent = data.total.toLocaleString());
    document.querySelectorAll("[data-visitor='today']").forEach(el => el.textContent = data.today.toLocaleString());
    document.querySelectorAll("[data-visitor='week']").forEach(el => el.textContent = data.week.toLocaleString());
    document.querySelectorAll("[data-visitor='month']").forEach(el => el.textContent = data.month.toLocaleString());
    document.querySelectorAll("[data-visitor='online']").forEach(el => el.textContent = data.online.toLocaleString());
    document.querySelectorAll("[data-visitor='returning']").forEach(el => el.textContent = data.returning.toLocaleString());

    // Build visitor chart on visitor page
    buildVisitorChart(data);
  }

  function buildVisitorChart(data) {
    const canvas = document.getElementById("visitorChart");
    if (!canvas || !window.Chart) return;
    const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    // derive from history if possible
    let values = [210,265,248,302,340,410,356];
    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{
        label: "Visitors",
        data: values,
        backgroundColor: "rgba(91,45,142,.7)",
        borderRadius: 8, borderSkipped: false
      }]},
      options: chartBase("Violet gradient bar showing weekly visitor traffic")
    });
  }

  function chartBase(accessLabel) {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const tick = isDark ? "#b9aed6" : "#6b6480";
    const grid = isDark ? "rgba(220,200,255,.1)" : "rgba(91,45,142,.1)";
    return {
      responsive: true, maintainAspectRatio: false, plugins: {
        legend: { labels: { color: tick, font: { weight: 600 } } },
        tooltip: { backgroundColor: "#3d1b63" },
        accessibility: { enabled: true, announceOnShow: true },
        title: { display: false }
      },
      scales: {
        x: { ticks: { color: tick }, grid: { color: grid } },
        y: { ticks: { color: tick }, grid: { color: grid } }
      }
    };
  }
  window.CLMD_chartBase = chartBase;
  window.CLMD_DEPTH = window.CLMD_DEPTH || 0;

  // ---------- Init ----------
  function init() {
    buildHeader();
    buildFooter();
    applyTheme();
    buildNotifs();
    loadSearchIndex();
    wireActions();
    initBackToTop();
    initReveal();
    initParticles();
    initVisitor();
    const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
    // Scroll shadow
    window.addEventListener("scroll", () => {
      const nav = qs(".navbar-custom"); if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
