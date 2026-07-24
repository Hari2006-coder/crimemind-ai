// =============================================
// CRIMEMIND AI — Dashboard Page Renderer
// =============================================

window.renderDashboard = function (container) {
  const d = CM_DATA;
  const statusClass = v => v > 0 ? 'up' : 'down';
  const statusArrow = v => v > 0 ? '↑' : '↓';

  container.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Intelligence Dashboard
          <span class="page-title-badge">LIVE</span>
        </h1>
        <p class="page-subtitle">Real-time crime analytics · ${new Date().toLocaleDateString('en-IN', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
      </div>
      <div class="flex gap-sm">
        <span class="prediction-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
          AI Engine Active
        </span>
        <button class="btn btn-outline btn-sm" onclick="CM_APP.navigateTo('reports')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Export Report
        </button>
      </div>
    </div>

    <!-- AI Insights Strip -->
    <div class="ai-insight-strip" id="ai-insight-strip">
      <div class="ai-insight-chip active">
        <div class="live-dot"></div> Crime Rate: Normal
      </div>
      <div class="ai-insight-chip">
        🔮 Next spike predicted: 19:00–21:00
      </div>
      <div class="ai-insight-chip">
        🎯 Top risk: Market Road (87%)
      </div>
      <div class="ai-insight-chip">
        👤 Repeat offenders: +5.6% this week
      </div>
      <div class="ai-insight-chip">
        🌐 Dark web activity: Elevated
      </div>
      <div class="ai-insight-chip">
        🚔 Patrol coverage: 71% optimal
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="dashboard-stats" id="stat-cards"></div>

    <!-- Charts Row -->
    <div class="dashboard-charts-row" style="margin-bottom:var(--space-lg)">
      <div class="glass-card no-hover">
        <div class="section-header">
          <span class="section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Crime Trend — Last 30 Days
          </span>
          <div class="tabs" style="width:auto">
            <button class="tab-btn active" id="trend-30">30D</button>
            <button class="tab-btn" id="trend-7">7D</button>
            <button class="tab-btn" id="trend-all">All Time</button>
          </div>
        </div>
        <div class="chart-container" style="height:220px">
          <canvas id="trend-chart"></canvas>
        </div>
      </div>
      <div class="glass-card no-hover">
        <div class="section-header">
          <span class="section-title">Crime Type Distribution</span>
        </div>
        <div class="chart-container" style="height:220px;display:flex;align-items:center;justify-content:center">
          <canvas id="type-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="dashboard-bottom-row">
      <div class="glass-card no-hover">
        <div class="section-header">
          <span class="section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
            District Comparison
          </span>
        </div>
        <div class="chart-container" style="height:180px">
          <canvas id="district-chart"></canvas>
        </div>
      </div>

      <div class="glass-card no-hover" style="overflow:auto">
        <div class="section-header">
          <span class="section-title">
            <div class="live-dot danger"></div>
            Latest Alerts
          </span>
          <button class="btn btn-ghost btn-sm" onclick="CM_APP.navigateTo('alerts')">View All</button>
        </div>
        <div id="latest-alerts-list"></div>
      </div>

      <div class="glass-card no-hover" style="overflow:auto">
        <div class="section-header">
          <span class="section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Recent FIRs
          </span>
          <span class="badge badge-danger">${CM_DATA.recentFIRs.filter(f=>f.status==='active').length} Active</span>
        </div>
        <div id="fir-list"></div>
      </div>
    </div>
  `;

  renderStatCards();
  renderTrendChart();
  renderTypeChart();
  renderDistrictChart();
  renderLatestAlerts();
  renderFIRList();

  // Tab switching
  ['30','7','all'].forEach(t => {
    const btn = document.getElementById(`trend-${t}`);
    if (btn) btn.addEventListener('click', () => {
      document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTrendChart(t);
    });
  });
};

// ── Stat Cards ─────────────────────────────
function renderStatCards() {
  const container = document.getElementById('stat-cards');
  if (!container) return;
  const cards = [
    { label: 'Total Crimes', value: CM_DATA.crimeStats.total, trend: CM_DATA.crimeStats.trends.total, color: '#1e90ff', bg: '#1e90ff', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` },
    { label: "Today's Crimes", value: CM_DATA.crimeStats.today, trend: CM_DATA.crimeStats.trends.today, color: '#ff3b5c', bg: '#ff3b5c', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
    { label: 'High Risk Areas', value: CM_DATA.crimeStats.highRisk, trend: CM_DATA.crimeStats.trends.highRisk, color: '#ffb020', bg: '#ffb020', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>` },
    { label: 'Repeat Offenders', value: CM_DATA.crimeStats.repeatOffenders, trend: CM_DATA.crimeStats.trends.repeatOffenders, color: '#8b5cf6', bg: '#8b5cf6', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
    { label: 'Pending Cases', value: CM_DATA.crimeStats.pending, trend: CM_DATA.crimeStats.trends.pending, color: '#00d4ff', bg: '#00d4ff', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  ];

  container.innerHTML = cards.map((c, i) => `
    <div class="glass-card stat-card" style="animation-delay:${i*80}ms" id="stat-${i}">
      <div class="stat-card-bg" style="background:${c.bg}"></div>
      <div class="stat-card-icon" style="background:rgba(${hexToRgb(c.color)},0.15)">
        ${c.icon}
      </div>
      <div class="stat-label">${c.label}</div>
      <div class="stat-value" style="color:${c.color}" data-target="${c.value}">0</div>
      <div class="stat-trend ${c.trend > 0 ? 'up' : 'down'}">
        ${c.trend > 0 ? '↑' : '↓'} ${Math.abs(c.trend)}% vs last week
      </div>
    </div>
  `).join('');

  // Count-up animation
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const duration = 1200;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current).toLocaleString('en-IN');
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ── Trend Chart ─────────────────────────────
let trendChartInstance = null;
function renderTrendChart(period = '30') {
  const canvas = document.getElementById('trend-chart');
  if (!canvas) return;
  if (trendChartInstance) { trendChartInstance.destroy(); }
  const data = period === '7' ? CM_DATA.trendData.slice(-7) :
               period === '30' ? CM_DATA.trendData :
               [...CM_DATA.trendData, ...CM_DATA.trendData.map(v => v + Math.random()*10-5)];
  const labels = data.map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (data.length - 1 - i));
    return d.toLocaleDateString('en-IN', { month:'short', day:'numeric' });
  });
  trendChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Crimes',
        data,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0,212,255,0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: 'transparent',
        pointHoverRadius: 5,
      }, {
        label: 'AI Forecast',
        data: data.map(v => v * (1 + (Math.random() * 0.2 - 0.1))),
        borderColor: '#8b5cf6',
        borderDash: [5, 4],
        borderWidth: 1.5,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
      }]
    },
    options: chartDefaults({ legend: true })
  });
}

// ── Type Chart ──────────────────────────────
let typeChartInstance = null;
function renderTypeChart() {
  const canvas = document.getElementById('type-chart');
  if (!canvas) return;
  if (typeChartInstance) typeChartInstance.destroy();
  typeChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: CM_DATA.crimeTypes.map(c => c.type),
      datasets: [{ data: CM_DATA.crimeTypes.map(c => c.count), backgroundColor: CM_DATA.crimeTypes.map(c => c.color), borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      ...chartDefaults(),
      cutout: '70%',
      plugins: {
        legend: { display: true, position: 'right', labels: { color: '#a8c5da', font: { size: 11, family: 'Space Grotesk' }, padding: 10, boxWidth: 10, boxHeight: 10, usePointStyle: true } },
        tooltip: { backgroundColor: '#132540', borderColor: 'rgba(0,212,255,0.3)', borderWidth: 1, titleColor: '#e8f4fd', bodyColor: '#a8c5da', callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw.toLocaleString()}` } }
      }
    }
  });
}

// ── District Chart ──────────────────────────
let districtChartInstance = null;
function renderDistrictChart() {
  const canvas = document.getElementById('district-chart');
  if (!canvas) return;
  if (districtChartInstance) districtChartInstance.destroy();
  districtChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: CM_DATA.districts,
      datasets: [
        { label: 'Crimes', data: CM_DATA.districtCrimes, backgroundColor: 'rgba(30,144,255,0.6)', borderColor: '#1e90ff', borderWidth: 1, borderRadius: 4 },
        { label: 'Risk %', data: CM_DATA.districtRisk, backgroundColor: 'rgba(255,59,92,0.4)', borderColor: '#ff3b5c', borderWidth: 1, borderRadius: 4 },
      ]
    },
    options: chartDefaults({ legend: true, xGridLines: false })
  });
}

// ── Alert List ──────────────────────────────
function renderLatestAlerts() {
  const container = document.getElementById('latest-alerts-list');
  if (!container) return;
  container.innerHTML = CM_DATA.alerts.slice(0, 4).map(a => `
    <div class="alert-item ${a.severity}" onclick="CM_APP.navigateTo('alerts')" style="cursor:pointer">
      <div class="alert-icon-wrap" style="background:${a.severity==='critical'?'rgba(255,59,92,0.1)':a.severity==='high'?'rgba(255,176,32,0.1)':'rgba(0,212,255,0.1)'}">
        <span>${a.icon}</span>
      </div>
      <div class="alert-text">
        <div class="alert-title">${a.title}</div>
        <div class="alert-sub">${a.time}</div>
      </div>
      <span class="badge badge-${a.severity==='critical'?'danger':a.severity==='high'?'warning':'info'}">${a.severity}</span>
    </div>
  `).join('');
}

// ── FIR List ────────────────────────────────
function renderFIRList() {
  const container = document.getElementById('fir-list');
  if (!container) return;
  const statusBadge = s => {
    const map = { active: ['danger','Active'], under_inv: ['warning','Under Inv.'], closed: ['success','Closed'] };
    const [cls, label] = map[s] || ['muted','Unknown'];
    return `<span class="badge badge-${cls}">${label}</span>`;
  };
  container.innerHTML = `<table class="data-table" style="font-size:0.78rem">
    <thead><tr><th>FIR ID</th><th>Type</th><th>Status</th></tr></thead>
    <tbody>
      ${CM_DATA.recentFIRs.map(f => `
        <tr style="cursor:pointer" onclick="CM_APP.navigateTo('investigation')">
          <td class="mono" style="color:var(--accent-cyan);font-size:0.73rem">${f.id}</td>
          <td>${f.type}</td>
          <td>${statusBadge(f.status)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>`;
}

// ── Chart Defaults ──────────────────────────
function chartDefaults({ legend = false, xGridLines = true } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: 'easeInOutQuart' },
    plugins: {
      legend: { display: legend, labels: { color: '#a8c5da', font: { size: 11, family: 'Space Grotesk' }, padding: 12, boxWidth: 12, boxHeight: 12, usePointStyle: true } },
      tooltip: { backgroundColor: '#132540', borderColor: 'rgba(0,212,255,0.3)', borderWidth: 1, titleColor: '#e8f4fd', bodyColor: '#a8c5da', padding: 10, cornerRadius: 8 }
    },
    scales: {
      x: { grid: { color: xGridLines ? 'rgba(255,255,255,0.04)' : 'transparent', drawBorder: false }, ticks: { color: '#5a7a95', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#5a7a95', font: { size: 10 } } }
    }
  };
}
