(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', async () => {
    const [areas, holders] = await Promise.all([CLMD.load('learning-areas'), CLMD.load('program-holders')]);
    const grid = document.getElementById('allAreas');
    const search = document.getElementById('areaSearch');
    const count = document.getElementById('areaCount');

    const renderAreas = list => {
      count.textContent = `${list.length} learning area${list.length === 1 ? '' : 's'} and specialized program${list.length === 1 ? '' : 's'}`;
      grid.innerHTML = list.map((area, index) => `<a class="area-card" data-aos="fade-up" data-aos-delay="${(index % 4) * 45}" href="${area.slug}.html"><div class="area-icon"><i class="fa-solid ${area.icon}"></i></div><h3>${CLMD.escape(area.title)}</h3><p>${CLMD.escape(area.short)}</p><span class="area-supervisor"><img src="${CLMD.asset(area.image)}" alt="" loading="lazy"><span>${CLMD.escape(area.supervisor)}</span></span></a>`).join('');
      if (window.AOS) AOS.refreshHard();
    };

    document.getElementById('programHoldersGrid').innerHTML = holders.map((holder, index) => `<article class="holder-card" data-aos="fade-up" data-aos-delay="${(index % 4) * 55}"><div class="holder-photo"><img src="${CLMD.asset(holder.image)}" alt="${CLMD.escape(holder.name)}, CLMD program holder" loading="lazy"><span>Program Holder</span></div><div class="holder-body"><small>Education Program Supervisor</small><h3>${CLMD.escape(holder.name)}</h3><div class="holder-assignments">${holder.assignments.map(item => `<span>${CLMD.escape(item)}</span>`).join('')}</div><a class="text-link" href="${holder.areas[0]}.html">View program portfolio <i class="fa-solid fa-arrow-right"></i></a></div></article>`).join('');

    renderAreas(areas);
    search.addEventListener('input', CLMD.debounce(() => {
      const query = search.value.trim().toLowerCase();
      renderAreas(areas.filter(area => `${area.title} ${area.supervisor} ${area.programsHandled.join(' ')}`.toLowerCase().includes(query)));
    }, 120));
  });
})();
