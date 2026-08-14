/* Region XII CRLA results dashboard — figures sourced from the official CRLA National Dashboard export. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', async () => {
    const panel = document.getElementById('crlaPanel');
    const pending = document.getElementById('assessmentPending');
    const pendingTitle = document.getElementById('pendingAssessmentTitle');
    const buttons = [...document.querySelectorAll('[data-assessment]')];
    const charts = [];

    function setAssessment(key, label) {
      buttons.forEach(button => button.classList.toggle('active', button.dataset.assessment === key));
      panel.classList.toggle('d-none', key !== 'CRLA');
      pending.classList.toggle('d-none', key === 'CRLA');
      if (key !== 'CRLA') pendingTitle.textContent = `${label} Results`;
      if (key === 'CRLA') setTimeout(() => charts.forEach(chart => chart.resize()), 80);
    }
    buttons.forEach(button => button.addEventListener('click', () => setAssessment(button.dataset.assessment, button.textContent.trim())));

    let data;
    try { data = await CLMD.load('crla'); }
    catch (error) {
      panel.innerHTML = '<div class="content-card text-center text-muted">The CRLA source data could not be loaded.</div>';
      return;
    }

    const colors = CLMD.chartColors();
    const profileColors = ['#b91f24', '#f44336', '#fb8c00', '#1976d2', '#159d0a'];
    const coverage = data.coverage;
    const contexts = data.contexts;
    const number = value => CLMD.number(value);
    const pct = value => `${Number(value).toFixed(2).replace(/\.00$/, '')}%`;

    document.getElementById('crlaDashboardLink').href = data.source.url;
    document.getElementById('crlaPdfLink').href = CLMD.asset(data.source.pdf);
    document.getElementById('crlaCitation').innerHTML = `<strong>[1]</strong> ${CLMD.escape(data.source.citation)} <a class="text-link" href="${data.source.url}" target="_blank" rel="noopener">Open official dashboard <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`;
    document.getElementById('crlaMethodNote').textContent = data.overallMethodNote;

    const kpis = [
      ['Total Learners Assessed', coverage.totalAssessed, 'fa-children', colors.violet, 'Grades 1–3'],
      ['Schools Submitted', coverage.schoolsSubmitted, 'fa-school-circle-check', colors.green, `of ${number(coverage.schools)} schools`],
      ['School Submission Rate', `${coverage.schoolSubmissionRate}%`, 'fa-file-circle-check', colors.gold, '1,730 of 1,741 schools'],
      ['Male Learners', `${coverage.malePercentage}%`, 'fa-person', colors.blue, 'of learners assessed'],
      ['Female Learners', `${coverage.femalePercentage}%`, 'fa-person-dress', colors.red, 'of learners assessed']
    ];
    document.getElementById('crlaKpis').innerHTML = kpis.map(kpi => `<article class="kpi-card" style="--accent:${kpi[3]}"><span class="kpi-label">${kpi[0]}</span><div class="kpi-value" ${typeof kpi[1] === 'number' ? `data-count="${kpi[1]}"` : ''}>${typeof kpi[1] === 'number' ? '0' : kpi[1]}</div><div class="kpi-meta">${kpi[4]}</div><i class="kpi-icon fa-solid ${kpi[2]}"></i></article>`).join('');

    const commonOptions = CLMD.baseChartOptions({ legend: false, percent: true });
    commonOptions.scales.y.max = 70;
    commonOptions.plugins.tooltip.callbacks = { label: context => `${context.label}: ${pct(context.raw)}` };
    charts.push(CLMD.addChart(new Chart(document.getElementById('crlaOverallChart'), {
      type: 'bar',
      data: { labels: data.profileLabels, datasets: [{ label: 'Learners', data: data.overallProfiles, backgroundColor: profileColors, borderRadius: 7, maxBarThickness: 52 }] },
      options: commonOptions
    })));

    const total = coverage.totalAssessed;
    const gradeShares = data.gradeEnrollment.map(item => item.learners / total * 100);
    charts.push(CLMD.addChart(new Chart(document.getElementById('crlaGradeChart'), {
      type: 'doughnut',
      data: { labels: data.gradeEnrollment.map(item => item.grade), datasets: [{ data: data.gradeEnrollment.map(item => item.learners), backgroundColor: [colors.violet, colors.gold, colors.blue], borderColor: colors.surface, borderWidth: 4, hoverOffset: 7 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '61%', plugins: { legend: { position: 'bottom', labels: { color: colors.muted, usePointStyle: true, boxWidth: 7, font: { size: 9 } } }, tooltip: { callbacks: { label: context => `${context.label}: ${number(context.raw)} (${gradeShares[context.dataIndex].toFixed(2)}%)` } } } }
    })));

    const stackedOptions = CLMD.baseChartOptions({ stacked: true, percent: true });
    stackedOptions.scales.x.stacked = true;
    stackedOptions.scales.y.stacked = true;
    stackedOptions.scales.y.max = 100;
    stackedOptions.plugins.tooltip.callbacks = { label: context => `${context.dataset.label}: ${pct(context.raw)}` };
    charts.push(CLMD.addChart(new Chart(document.getElementById('crlaProfileChart'), {
      type: 'bar',
      data: { labels: contexts.map(item => item.label), datasets: data.profileLabels.map((label, index) => ({ label, data: contexts.map(item => item.profiles[index]), backgroundColor: profileColors[index], borderRadius: 2 })) },
      options: stackedOptions
    })));

    const accuracyOptions = CLMD.baseChartOptions({ percent: true });
    accuracyOptions.scales.y.max = 100;
    accuracyOptions.plugins.tooltip.callbacks = { label: context => `${context.dataset.label}: ${pct(context.raw)}` };
    charts.push(CLMD.addChart(new Chart(document.getElementById('crlaAccuracyChart'), {
      type: 'bar',
      data: { labels: contexts.map(item => item.label), datasets: [
        { label: 'Reading Fluency', data: contexts.map(item => item.fluency), backgroundColor: colors.blue, borderRadius: 6 },
        { label: 'Reading Comprehension', data: contexts.map(item => item.comprehension), backgroundColor: '#12a8b9', borderRadius: 6 }
      ] },
      options: accuracyOptions
    })));

    const wpmOptions = CLMD.baseChartOptions({ legend: false });
    wpmOptions.scales.y.suggestedMax = 50;
    wpmOptions.plugins.tooltip.callbacks = { label: context => `${context.raw} words per minute` };
    charts.push(CLMD.addChart(new Chart(document.getElementById('crlaWpmChart'), {
      type: 'line',
      data: { labels: contexts.map(item => item.label), datasets: [{ label: 'Average WPM', data: contexts.map(item => item.wordsPerMinute), borderColor: colors.violet, backgroundColor: 'rgba(105,53,142,.13)', fill: true, tension: .34, pointRadius: 5, pointBackgroundColor: colors.gold, pointBorderColor: colors.surface, pointBorderWidth: 2 }] },
      options: wpmOptions
    })));

    const emerging = data.overallProfiles[0] + data.overallProfiles[1];
    const transitioningOrGrade = data.overallProfiles[3] + data.overallProfiles[4];
    document.getElementById('crlaOverallInsight').innerHTML = CLMD.insight(`${emerging.toFixed(2)}% of assessed learners are in the two emerging-reader categories, while ${transitioningOrGrade.toFixed(2)}% are transitioning or reading at grade level. Only ${data.overallProfiles[4].toFixed(2)}% are classified at grade level, indicating a substantial need for foundational reading support. [1]`);

    const largestGrade = [...data.gradeEnrollment].sort((a, b) => b.learners - a.learners)[0];
    const smallestGrade = [...data.gradeEnrollment].sort((a, b) => a.learners - b.learners)[0];
    document.getElementById('crlaGradeInsight').innerHTML = CLMD.insight(`${largestGrade.grade} has the largest assessed group (${number(largestGrade.learners)}; ${(largestGrade.learners / total * 100).toFixed(2)}%), while ${smallestGrade.grade} has the smallest (${number(smallestGrade.learners)}; ${(smallestGrade.learners / total * 100).toFixed(2)}%). The relatively balanced grade distribution supports region-wide comparison, but results remain cross-sectional. [1]`);

    const g1 = contexts[0];
    const g3Fil = contexts.find(item => item.id === 'g3-fil');
    const g3Eng = contexts.find(item => item.id === 'g3-eng');
    const g1Emerging = g1.profiles[0] + g1.profiles[1];
    const g3FilHigher = g3Fil.profiles[3] + g3Fil.profiles[4];
    const g3EngHigher = g3Eng.profiles[3] + g3Eng.profiles[4];
    document.getElementById('crlaProfileInsight').innerHTML = CLMD.insight(`Grade 1 shows the greatest concentration in emerging profiles (${g1Emerging.toFixed(2)}%) and the lowest at-grade-level share (${g1.profiles[4].toFixed(2)}%). By Grade 3, transitioning plus at-grade-level classifications reach ${g3FilHigher.toFixed(2)}% in Filipino and ${g3EngHigher.toFixed(2)}% in English. This pattern is consistent with stronger profiles at higher grades, but it should not be interpreted as longitudinal growth because different learner groups and language contexts are compared. [1]`);

    const gaps = contexts.map(item => ({ label: item.label, gap: item.fluency - item.comprehension }));
    const largestGap = [...gaps].sort((a, b) => b.gap - a.gap)[0];
    document.getElementById('crlaAccuracyInsight').innerHTML = CLMD.insight(`Reading fluency exceeds comprehension in every reported context. The largest gap is in ${largestGap.label} (${largestGap.gap.toFixed(2)} percentage points). The consistent gaps suggest that accurate or fluent word reading is not always matched by meaning-making, supporting explicit comprehension instruction alongside fluency development. [1]`);

    const fastest = [...contexts].sort((a, b) => b.wordsPerMinute - a.wordsPerMinute)[0];
    const slowest = [...contexts].sort((a, b) => a.wordsPerMinute - b.wordsPerMinute)[0];
    document.getElementById('crlaWpmInsight').innerHTML = CLMD.insight(`${fastest.label} records the highest average reading rate at ${fastest.wordsPerMinute} words per minute, while ${slowest.label} records ${slowest.wordsPerMinute}. Reading rate generally rises across the reported grade contexts, although language and assessment differences mean these values should not be treated as a single continuous scale. [1]`);

    document.querySelector('#crlaTable tbody').innerHTML = contexts.map(item => `<tr><td><strong>${CLMD.escape(item.label)}</strong></td>${item.profiles.map(value => `<td>${pct(value)}</td>`).join('')}<td>${item.wordsPerMinute}</td><td>${pct(item.fluency)}</td><td>${pct(item.comprehension)}</td></tr>`).join('');

    CLMD.animateCounters();
  });
})();
