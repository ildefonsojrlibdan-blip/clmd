(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', async () => {
    const data = await CLMD.load('assessment');
    const c = CLMD.chartColors();
    let current = 'CRLA';
    let charts = [];
    const destroy = () => { charts.forEach(chart => chart.destroy()); charts = []; };

    const render = key => {
      current = key;
      destroy();
      document.querySelectorAll('[data-assessment]').forEach(button => button.classList.toggle('active', button.dataset.assessment === key));
      const a = data.assessments[key];
      const rows = a.divisions;
      const total = rows.reduce((sum, row) => sum + row.tested, 0);
      const prof = rows.reduce((sum, row) => sum + row.proficient, 0) / rows.length;
      const growth = rows.reduce((sum, row) => sum + row.growth, 0) / rows.length;
      const kpis = [
        ['Regional Score', `${a.regional}%`, 'fa-gauge-high', c.violet],
        ['Target', `${a.target}%`, 'fa-bullseye', c.gold],
        ['Learners Assessed', total, 'fa-children', c.blue],
        ['Avg. Proficiency', `${prof.toFixed(1)}%`, 'fa-book-open-reader', c.green],
        ['Average Growth', `${growth.toFixed(1)} pts`, 'fa-arrow-trend-up', c.red]
      ];
      document.getElementById('assessmentKpis').innerHTML = kpis.map(k => `<div class="kpi-card" style="--accent:${k[3]}"><span class="kpi-label">${k[0]}</span><div class="kpi-value" ${typeof k[1] === 'number' ? `data-count="${k[1]}"` : ''}>${typeof k[1] === 'number' ? '0' : k[1]}</div><div class="kpi-meta">${CLMD.escape(a.full)}</div><i class="kpi-icon fa-solid ${k[2]}"></i></div>`).join('');
      document.getElementById('assessmentChartTitle').textContent = `${a.full} · Division Comparison`;

      const bar = new Chart(document.getElementById('assessmentBarChart'), {
        type: 'bar',
        data: {
          labels: rows.map(row => row.division),
          datasets: [
            { label: 'Division score', data: rows.map(row => row.score), backgroundColor: rows.map(row => row.score >= a.target ? c.green : row.score >= a.regional ? c.gold : c.violetLight), borderRadius: 7, maxBarThickness: 30 },
            { label: 'Regional average', data: rows.map(() => a.regional), type: 'line', borderColor: c.red, borderDash: [6, 5], pointRadius: 0, borderWidth: 2 }
          ]
        },
        options: { ...CLMD.baseChartOptions({ percent: true }), scales: { x: CLMD.baseChartOptions().scales.x, y: { ...CLMD.baseChartOptions({ percent: true }).scales.y, min: 50, max: 100 } } }
      });
      charts.push(CLMD.addChart(bar));
      const top = [...rows].sort((x, y) => y.score - x.score)[0];
      const low = [...rows].sort((x, y) => x.score - y.score)[0];
      document.getElementById('assessmentBarInsight').innerHTML = CLMD.insight(`${top.division} posts the highest ${key} score at ${top.score}%, while ${low.division} records ${low.score}%. The regional result is ${a.regional}%, ${Math.abs(a.target - a.regional)} points ${a.regional >= a.target ? 'above' : 'below'} target.`);

      const levelLabels = ['Beginning', 'Developing', 'Proficient', 'Advanced'];
      const dough = new Chart(document.getElementById('assessmentDoughnut'), {
        type: 'doughnut',
        data: { labels: levelLabels, datasets: [{ data: a.levels, backgroundColor: [c.red, c.orange, c.blue, c.green], borderColor: c.surface, borderWidth: 3 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '66%', plugins: { legend: { position: 'bottom', labels: { color: c.muted, usePointStyle: true, boxWidth: 7, font: { size: 9 } } } } }
      });
      charts.push(CLMD.addChart(dough));
      document.getElementById('assessmentLevelInsight').innerHTML = CLMD.insight(`${a.levels[2] + a.levels[3]}% of assessed learners fall within proficient or advanced categories. ${a.levels[0]}% remain at beginning level and require targeted support.`);

      const line = new Chart(document.getElementById('assessmentLineChart'), {
        type: 'line',
        data: {
          labels: rows.map(row => row.division),
          datasets: [
            { label: 'Proficiency', data: rows.map(row => row.proficient), borderColor: c.violet, backgroundColor: 'rgba(105,53,142,.09)', fill: true, tension: .35, pointRadius: 4 },
            { label: 'Growth (scaled)', data: rows.map(row => row.growth * 10), borderColor: c.gold, backgroundColor: 'rgba(205,167,47,.08)', fill: true, tension: .35, pointRadius: 4 }
          ]
        },
        options: CLMD.baseChartOptions({ percent: true })
      });
      charts.push(CLMD.addChart(line));
      const grow = [...rows].sort((x, y) => y.growth - x.growth)[0];
      document.getElementById('assessmentGrowthInsight').innerHTML = CLMD.insight(`${grow.division} shows the highest recorded growth at ${grow.growth} points. Growth should be interpreted with proficiency and learner coverage to guide differentiated support.`);

      document.querySelector('#assessmentTable tbody').innerHTML = rows.map(row => {
        const status = CLMD.status(row.score);
        return `<tr><td><strong>${row.division}</strong></td><td>${row.score}%</td><td>${CLMD.number(row.tested)}</td><td>${row.proficient}%</td><td>+${row.growth} pts</td><td><span class="status-pill ${status.className}">${status.label}</span></td></tr>`;
      }).join('');
      CLMD.animateCounters();
    };

    document.querySelectorAll('[data-assessment]').forEach(button => button.addEventListener('click', () => render(button.dataset.assessment)));
    render(current);
  });
})();
