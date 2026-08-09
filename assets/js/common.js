/* ============================================================
   CLMD - Shared Utilities
   Count-up animations, export to PDF/Excel, load JSON helper.
   ============================================================ */
(function () {
  "use strict";

  // ---------- CountUp animation ----------
  function animateCount(el) {
    const target = parseFloat(el.dataset.count || el.dataset.target || "0");
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const dur = parseInt(el.dataset.duration || "1800", 10);
    const start = performance.now();
    function fmt(n) { return prefix + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix; }
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }

  function initCounters(root) {
    const els = (root || document).querySelectorAll("[data-count], [data-target]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(animateCount); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  }

  // ---------- Fetch JSON ----------
  async function loadJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load " + url);
    return res.json();
  }

  // ---------- Export current page to PDF (print dialog) ----------
  function exportPDF(title) {
    const original = document.title;
    document.title = title || document.title;
    window.print();
    document.title = original;
  }

  // ---------- Export HTML table to CSV/Excel ----------
  function exportTableToExcel(tableEl, filename) {
    const clone = tableEl.cloneNode(true);
    clone.querySelectorAll("canvas").forEach(c => c.remove());
    const html = clone.outerHTML;
    const blob = new Blob([`\ufeff<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body>${html}</body></html>`], { type: "application/vnd.ms-excel" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename || "export.xls";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(a.href);
  }

  // ---------- Export generic data to CSV ----------
  function exportToCSV(filename, headers, rows) {
    const esc = v => '"' + String(v).replace(/"/g, '""') + '"';
    const csv = [headers.map(esc).join(",")].concat(rows.map(r => r.map(esc).join(","))).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(a.href);
  }

  // ---------- SweetAlert toast helper ----------
  function toast(type, msg) {
    if (window.Swal) {
      const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 2800, timerProgressBar: true });
      Toast.fire({ icon: type, title: msg });
    } else {
      alert(msg);
    }
  }

  // ---------- Lightbox ----------
  function initLightbox(root) {
    let lb = document.getElementById("clmdLightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "clmdLightbox";
      lb.className = "lightbox no-print";
      lb.innerHTML = `<img alt="Preview"><div class="cap"></div>`;
      document.body.appendChild(lb);
      lb.addEventListener("click", (e) => { if (e.target === lb) lb.classList.remove("show"); });
    }
    (root || document).querySelectorAll("[data-lightbox]").forEach(img => {
      img.addEventListener("click", () => {
        qs("#clmdLightbox img").src = img.dataset.lightbox || img.src;
        qs("#clmdLightbox .cap").textContent = img.dataset.caption || img.alt || "";
        lb.classList.add("show");
      });
    });
    return lb;
  }

  // Expose
  window.CLMD = Object.assign(window.CLMD || {}, {
    initCounters, loadJSON, exportPDF, exportTableToExcel, exportToCSV, toast, initLightbox
  });

  function qs(s, r) { return (r || document).querySelector(s); }

  // Auto-init counters on DOM
  document.addEventListener("DOMContentLoaded", () => initCounters());
})();
