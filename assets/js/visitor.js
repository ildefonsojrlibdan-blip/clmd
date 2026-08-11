/* Global visitor counter for the static GitHub Pages portal.
   Uses the public Abacus counting API through JSONP (no CORS dependency).
   A visit is counted once per browser within a 30-minute window. */
(() => {
  'use strict';
  const NAMESPACE = 'deped-ro12-clmd-portal';
  const RESET_KEY = 'visitors-reset-2026-08-11-v1';
  const API = 'https://abacus.jasoncameron.dev';
  const CACHE_KEY = 'clmd-global-counter-cache-v1';
  const LAST_VISIT_KEY = 'clmd-global-last-counted-v1';
  const KNOWN_KEY = 'clmd-r12-known-visitor-v1';
  const VISIT_WINDOW = 30 * 60 * 1000;
  let syncPromise = null;

  const safeGet = (storage, key) => { try { return storage.getItem(key); } catch (_) { return null; } };
  const safeSet = (storage, key, value) => { try { storage.setItem(key, value); } catch (_) {} };
  const today = () => new Date().toISOString().slice(0, 10);
  const month = () => today().slice(0, 7);
  function isoWeek() {
    const date = new Date();
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
  }
  function lastSevenDays() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push({ key: d.toISOString().slice(0, 10), label: new Intl.DateTimeFormat('en-PH', { weekday: 'short' }).format(d) });
    }
    return days;
  }
  function loadCache() {
    try {
      return { total: 0, today: 0, week: 0, month: 0, returning: 0, ...JSON.parse(safeGet(localStorage, CACHE_KEY) || '{}') };
    } catch (_) { return { total: 0, today: 0, week: 0, month: 0, returning: 0 }; }
  }
  let globalStats = loadCache();

  function jsonp(path) {
    return new Promise(resolve => {
      const callback = `clmdCounter_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement('script');
      let finished = false;
      let timer;
      const done = value => {
        if (finished) return; finished = true;
        clearTimeout(timer); delete window[callback]; script.remove();
        resolve(Number(value) || 0);
      };
      window[callback] = data => done(data?.value);
      script.onerror = () => done(0);
      script.src = `${API}${path}${path.includes('?') ? '&' : '?'}callback=${callback}`;
      document.head.appendChild(script);
      timer = setTimeout(() => done(0), 7000);
    });
  }
  const endpoint = (action, key) => `/${action}/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(key)}`;

  function updateDOM() {
    const values = {
      total: globalStats.total,
      today: globalStats.today,
      week: globalStats.week,
      month: globalStats.month,
      returning: globalStats.returning
    };
    const write = (selector, value) => {
      const formatted = new Intl.NumberFormat('en-PH').format(value);
      document.querySelectorAll(selector).forEach(el => { if (el.textContent !== formatted) el.textContent = formatted; });
    };
    write('[data-visitor-total]', values.total);
    write('[data-visitor-today]', values.today);
    write('[data-visitor-week]', values.week);
    write('[data-visitor-month]', values.month);
    write('[data-visitor-returning]', values.returning);
    document.querySelectorAll('#visitorKpis .visitor-kpi').forEach(card => {
      const label = (card.querySelector('span')?.textContent || '').trim().toLowerCase();
      const value = label === 'total' ? values.total : label === 'today' ? values.today : label === 'this week' ? values.week : label === 'this month' ? values.month : label === 'returning' ? values.returning : label === 'online' ? 0 : null;
      const el = card.querySelector('strong');
      if (el && value !== null) { const formatted = new Intl.NumberFormat('en-PH').format(value); el.dataset.count = value; if (el.textContent !== formatted) el.textContent = formatted; }
    });
    window.dispatchEvent(new CustomEvent('clmd:visitor-updated', { detail: { ...globalStats } }));
  }

  async function syncGlobal() {
    if (syncPromise) return syncPromise;
    syncPromise = (async () => {
      updateDOM();
      const last = Number(safeGet(localStorage, LAST_VISIT_KEY) || 0);
      const shouldIncrement = !last || Date.now() - last >= VISIT_WINDOW;
      const known = safeGet(localStorage, KNOWN_KEY) === '1';
      const action = shouldIncrement ? 'hit' : 'get';
      const keys = {
        total: RESET_KEY,
        today: `${RESET_KEY}-day-${today()}`,
        week: `${RESET_KEY}-week-${isoWeek()}`,
        month: `${RESET_KEY}-month-${month()}`
      };
      const [totalCount, todayCount, weekCount, monthCount] = await Promise.all([
        jsonp(endpoint(action, keys.total)),
        jsonp(endpoint(action, keys.today)),
        jsonp(endpoint(action, keys.week)),
        jsonp(endpoint(action, keys.month))
      ]);
      let returningCount = globalStats.returning || 0;
      if (shouldIncrement && known) returningCount = await jsonp(endpoint('hit', `${RESET_KEY}-returning`));
      else returningCount = await jsonp(endpoint('get', `${RESET_KEY}-returning`));
      globalStats = { total: totalCount, today: todayCount, week: weekCount, month: monthCount, returning: returningCount };
      safeSet(localStorage, CACHE_KEY, JSON.stringify(globalStats));
      if (shouldIncrement && totalCount > 0) {
        safeSet(localStorage, LAST_VISIT_KEY, String(Date.now()));
        safeSet(localStorage, KNOWN_KEY, '1');
      }
      updateDOM();
      setTimeout(updateDOM, 1300); // Re-apply after CountUp animations finish.
      return globalStats;
    })();
    return syncPromise;
  }

  function getStats() {
    const days = lastSevenDays();
    const trend = days.map((_, i) => i === days.length - 1 ? globalStats.today : 0);
    return {
      ...globalStats,
      online: 0,
      labels: days.map(d => d.label),
      trend,
      countries: [{ name: 'Global counter active', share: 100 }],
      regions: [{ name: 'SOCCSKSARGEN portal', share: 100 }]
    };
  }

  window.CLMD = window.CLMD || {};
  window.CLMD.visitor = {
    getStats,
    refresh() { updateDOM(); syncGlobal(); return getStats(); },
    sync: syncGlobal
  };

  // Update visitor widgets that are inserted after this script starts.
  const observer = new MutationObserver(() => updateDOM());
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
    syncGlobal();
    setTimeout(() => observer.disconnect(), 5000);
  });
})();
