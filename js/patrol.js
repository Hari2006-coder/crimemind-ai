// =============================================
// CRIMEMIND AI — AI Patrol Simulator
// =============================================

window.renderPatrol = function (container) {
  let optimized = false;
  const metrics = CM_DATA.patrolData.metrics;

  container.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          AI Patrol Simulator
          <span class="page-title-badge">OPTIMIZER</span>
        </h1>
        <p class="page-subtitle">AI-powered patrol route optimization · Maximize coverage · Minimize response time</p>
      </div>
      <div class="flex gap-sm">
        <select class="select-custom" id="patrol-district">
          <option value="all">All Districts</option>
          ${CM_DATA.districts.map(d=>`<option>${d}</option>`).join('')}
        </select>
        <button class="btn btn-primary" id="optimize-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
          Optimize with AI
        </button>
      </div>
    </div>

    <!-- Metrics -->
    <div class="patrol-metrics" style="margin-bottom:var(--space-lg)">
      ${[
        { label: 'Crime Risk Coverage', id: 'metric-risk', before: metrics.before.riskCoverage, after: metrics.after.riskCoverage, unit: '%', color: '#00d4ff', icon: '🎯' },
        { label: 'Area Coverage',       id: 'metric-area', before: metrics.before.areaCoverage, after: metrics.after.areaCoverage, unit: '%', color: '#00e676', icon: '🗺️' },
        { label: 'Avg Response Time',   id: 'metric-time', before: metrics.before.responseTime, after: metrics.after.responseTime, unit: ' min', color: '#ffb020', icon: '⚡', lower: true },
      ].map(m => `
        <div class="glass-card">
          <div style="font-size:1.4rem;margin-bottom:var(--space-sm)">${m.icon}</div>
          <div class="stat-label">${m.label}</div>
          <div id="${m.id}" style="font-size:1.8rem;font-weight:700;color:${m.color};transition:all 0.8s ease">${m.before}${m.unit}</div>
          <div id="${m.id}-change" style="font-size:0.75rem;color:var(--text-muted);margin-top:4px"></div>
          <div class="progress-bar-wrap" style="margin-top:8px">
            <div class="progress-bar" id="${m.id}-bar" style="width:${m.before}%;background:${m.color};transition:width 1s ease"></div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Main Layout -->
    <div class="patrol-layout">
      <!-- Patrol Units Table -->
      <div class="glass-card no-hover">
        <div class="section-header">
          <span class="section-title">
            <div class="live-dot"></div>
            Active Patrol Units
          </span>
          <span class="badge badge-success">${CM_DATA.patrolData.units.length} Units</span>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Unit</th><th>District</th><th>Officers</th><th>Status</th><th>AI Rec.</th></tr>
          </thead>
          <tbody id="patrol-table-body">
            ${CM_DATA.patrolData.units.map(u => `
              <tr>
                <td style="font-weight:600;color:var(--accent-cyan);font-family:var(--font-mono)">${u.name}</td>
                <td>${u.district}</td>
                <td>${u.officers}</td>
                <td><span class="badge badge-${u.status==='active'?'success':'muted'}">${u.status}</span></td>
                <td id="rec-${u.id}" style="font-size:0.75rem;color:var(--text-muted)">—</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- AI Route Recommendation -->
      <div>
        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <div class="section-header">
            <span class="section-title">AI Route Intelligence</span>
            <span class="prediction-badge" id="route-status">Awaiting Optimization</span>
          </div>
          <div id="ai-route-content">
            <p style="font-size:0.85rem;color:var(--text-muted);text-align:center;padding:var(--space-xl) 0">
              Click <strong style="color:var(--accent-cyan)">Optimize with AI</strong> to calculate optimal patrol routes based on crime risk heatmap.
            </p>
          </div>
        </div>

        <!-- Before/After Comparison -->
        <div class="glass-card no-hover">
          <div class="section-header">
            <span class="section-title">Before vs After</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);text-align:center">
            <div style="padding:var(--space-md);background:rgba(255,59,92,0.05);border-radius:var(--radius-md);border:1px solid rgba(255,59,92,0.15)">
              <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">Current Allocation</div>
              <div style="font-size:2rem;font-weight:700;color:var(--danger)">${metrics.before.riskCoverage}%</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">Risk Coverage</div>
              <div style="font-size:1.5rem;font-weight:700;color:var(--warning);margin-top:8px">${metrics.before.responseTime} min</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">Response Time</div>
            </div>
            <div style="padding:var(--space-md);background:rgba(0,230,118,0.05);border-radius:var(--radius-md);border:1px solid rgba(0,230,118,0.15)" id="after-card">
              <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">AI Optimized</div>
              <div style="font-size:2rem;font-weight:700;color:var(--success)" id="after-risk">—</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">Risk Coverage</div>
              <div style="font-size:1.5rem;font-weight:700;color:var(--success);margin-top:8px" id="after-time">—</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('optimize-btn').addEventListener('click', function() {
    if (optimized) return;
    this.disabled = true;
    this.textContent = 'Calculating…';

    // Animate processing
    let progress = 0;
    const routeContent = document.getElementById('ai-route-content');
    routeContent.innerHTML = `
      <div style="text-align:center;padding:var(--space-lg)">
        <div class="ai-processing" style="justify-content:center;margin-bottom:var(--space-md)">
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
          <span>AI analyzing crime heatmap…</span>
        </div>
        <div class="progress-bar-wrap" style="max-width:280px;margin:0 auto">
          <div class="progress-bar" id="opt-progress" style="width:0%;transition:width 0.3s ease"></div>
        </div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:8px" id="opt-status">Initializing…</div>
      </div>
    `;

    const steps = [
      'Loading crime heatmap…',
      'Analyzing risk zones…',
      'Computing optimal paths…',
      'Balancing coverage…',
      'Finalizing routes…',
    ];
    let step = 0;
    const interval = setInterval(() => {
      progress += 20;
      const bar = document.getElementById('opt-progress');
      const status = document.getElementById('opt-status');
      if (bar) bar.style.width = progress + '%';
      if (status && steps[step]) { status.textContent = steps[step]; step++; }
      if (progress >= 100) {
        clearInterval(interval);
        showOptimizationResults();
        optimized = true;
        this.textContent = '✓ Optimized';
        this.style.background = 'var(--grad-success)';
      }
    }, 350);
  });

  function showOptimizationResults() {
    const routeContent = document.getElementById('ai-route-content');
    const recs = [
      { unit: 'Alpha-1', rec: 'Redeploy → Market Road (High Risk)', icon: '🔴' },
      { unit: 'Alpha-2', rec: 'Extend patrol to Station Area', icon: '🔴' },
      { unit: 'Beta-1',  rec: 'Cover Night Market 17:00–22:00', icon: '🟡' },
      { unit: 'Beta-2',  rec: 'Standby → Industrial Zone 4', icon: '🔴' },
      { unit: 'Gamma-1', rec: 'Maintain East Harbour patrol', icon: '🟡' },
      { unit: 'Delta-1', rec: 'Standard West district patrol', icon: '🟢' },
    ];

    routeContent.innerHTML = `
      <div style="margin-bottom:var(--space-md)">
        ${recs.map(r => `
          <div style="display:flex;align-items:center;gap:var(--space-sm);padding:8px;border-radius:var(--radius-sm);background:var(--glass-bg-light);margin-bottom:6px;font-size:0.82rem;border:1px solid var(--border-subtle)">
            <span>${r.icon}</span>
            <span style="color:var(--accent-cyan);font-family:var(--font-mono);min-width:60px;font-weight:600">${r.unit}</span>
            <span style="color:var(--text-secondary)">${r.rec}</span>
          </div>
        `).join('')}
      </div>
    `;

    // Update unit recommendations
    CM_DATA.patrolData.units.forEach((unit, i) => {
      const el = document.getElementById(`rec-${unit.id}`);
      if (el && recs[i]) el.innerHTML = `<span style="color:var(--success)">${recs[i].rec.split('→')[0].trim()}</span>`;
    });

    // Update metrics
    ['risk','area','time'].forEach((key, idx) => {
      const id = `metric-${key}`;
      const vals = [metrics.after.riskCoverage, metrics.after.areaCoverage, metrics.after.responseTime];
      const units = ['%','%',' min'];
      const el = document.getElementById(id);
      const bar = document.getElementById(`${id}-bar`);
      const change = document.getElementById(`${id}-change`);
      if (el) el.textContent = vals[idx] + units[idx];
      if (bar) bar.style.width = vals[idx] + '%';
      if (change) change.innerHTML = idx < 2
        ? `<span style="color:var(--success)">↑ +${vals[idx] - [metrics.before.riskCoverage, metrics.before.areaCoverage][idx]}% improvement</span>`
        : `<span style="color:var(--success)">↓ ${Math.abs(vals[idx] - metrics.before.responseTime).toFixed(1)} min faster</span>`;
    });

    document.getElementById('after-risk').textContent = metrics.after.riskCoverage + '%';
    document.getElementById('after-time').textContent = metrics.after.responseTime + ' min';
    document.getElementById('route-status').innerHTML = `
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      Optimized
    `;

    CM_APP.showToast('AI Optimization Complete', 'Patrol routes optimized. Coverage improved by 27%.', 'success');
  }
};
