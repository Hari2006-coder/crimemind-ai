// =============================================
// CRIMEMIND AI — AI Crime Prediction Engine
// =============================================

window.renderPrediction = function (container) {
  container.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
          AI Crime Prediction Engine
          <span class="page-title-badge" style="background:rgba(139,92,246,0.15);color:var(--accent-purple);border-color:rgba(139,92,246,0.3)">BETA</span>
        </h1>
        <p class="page-subtitle">Predictive policing powered by historical patterns · AI forecasts with confidence scores</p>
      </div>
    </div>

    <!-- Prediction Controls -->
    <div class="flex gap-md" style="margin-bottom:var(--space-lg);flex-wrap:wrap">
      <div class="glass-card no-hover" style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);flex:1;min-width:200px">
        <span style="font-size:1.5rem">🕐</span>
        <div style="flex:1">
          <div class="stat-label">Forecast Window</div>
          <select class="select-custom" id="forecast-window" style="width:100%;margin-top:4px">
            <option value="1h">Next 1 Hour</option>
            <option value="6h" selected>Next 6 Hours</option>
            <option value="24h">Next 24 Hours</option>
            <option value="7d">Next 7 Days</option>
          </select>
        </div>
      </div>
      <div class="glass-card no-hover" style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);flex:1;min-width:200px">
        <span style="font-size:1.5rem">📊</span>
        <div style="flex:1">
          <div class="stat-label">Confidence Threshold</div>
          <input type="range" id="conf-threshold" min="50" max="95" value="70" style="width:100%;margin-top:4px;accent-color:var(--accent-purple)">
          <div style="font-size:0.75rem;color:var(--text-muted)">Min confidence: <span id="conf-val">70</span>%</div>
        </div>
      </div>
      <div class="glass-card no-hover" style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);flex:1;min-width:200px">
        <span style="font-size:1.5rem">🌤️</span>
        <div>
          <div class="stat-label">Environmental Factors</div>
          <div style="display:flex;gap:8px;margin-top:4px;flex-wrap:wrap">
            ${['Weekend','Night','Festival','Rain'].map(f => `
              <label style="display:flex;align-items:center;gap:4px;font-size:0.75rem;cursor:pointer;color:var(--text-secondary)">
                <input type="checkbox" style="accent-color:var(--accent-purple)"> ${f}
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Prediction Results -->
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)">
      <!-- Predicted Events -->
      <div class="glass-card no-hover">
        <div class="section-header">
          <span class="section-title">
            🔮 Predicted Crime Events
          </span>
          <span class="badge badge-purple">${CM_DATA.predictionData.nextHour.length} Predictions</span>
        </div>
        <div id="prediction-list" style="margin-top:var(--space-md)">
          ${CM_DATA.predictionData.nextHour.map((p, i) => `
            <div class="prediction-timeline-item" style="animation-delay:${i*100}ms">
              <div class="prediction-hour">${p.time.split('–')[0]}</div>
              <div style="flex:1">
                <div style="font-size:0.85rem;font-weight:600;color:var(--text-primary)">${p.area}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${p.type}</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.1rem;font-weight:700;color:${p.probability>=80?'var(--danger)':p.probability>=65?'var(--warning)':'var(--success)'}">${p.probability}%</div>
                <div style="font-size:0.7rem;color:var(--text-muted)">confidence</div>
              </div>
              <span class="badge badge-${p.risk==='high'?'danger':p.risk==='medium'?'warning':'success'}">${p.risk}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Prediction Chart + Model Info -->
      <div>
        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <div class="section-header"><span class="section-title">24h Forecast</span></div>
          <div class="chart-container" style="height:200px">
            <canvas id="forecast-chart"></canvas>
          </div>
        </div>
        <div class="glass-card no-hover" style="background:rgba(139,92,246,0.05);border-color:rgba(139,92,246,0.2)">
          <div class="stat-label" style="margin-bottom:var(--space-sm)">Model Performance</div>
          ${[
            { label: 'Accuracy (7-day avg)', val: 84, color: 'var(--success)' },
            { label: 'False Positive Rate', val: 12, color: 'var(--warning)' },
            { label: 'Precision Score', val: 91, color: 'var(--accent-purple)' },
          ].map(m => `
            <div style="margin-bottom:var(--space-sm)">
              <div class="confidence-bar-label">
                <span style="font-size:0.75rem;color:var(--text-secondary)">${m.label}</span>
                <span style="font-size:0.75rem;font-weight:600;color:${m.color}">${m.val}%</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar" style="width:${m.val}%;background:${m.color};transition:width 1s ease"></div>
              </div>
            </div>
          `).join('')}
          <p style="font-size:0.72rem;color:var(--text-muted);margin-top:var(--space-sm)">
            Model: CrimeMind-GPT-v2.4 · Trained on 5 years of district data · Updated daily
          </p>
        </div>
      </div>
    </div>

    <!-- Modus Operandi Matcher -->
    <div class="glass-card no-hover" style="margin-bottom:var(--space-lg)">
      <div class="section-header">
        <span class="section-title">
          🔍 AI Modus Operandi Matcher
        </span>
        <span class="badge badge-info">Pattern Analysis</span>
      </div>
      <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:var(--space-md)">AI detected that current crime pattern matches 3 historical cases:</p>
      <div class="grid-3" style="gap:var(--space-md)">
        ${[
          { case: 'Case-2022-4412', match: 94, desc: 'Market area robbery spree, 6-man gang, September pattern', outcome: 'Solved in 4 days' },
          { case: 'Case-2021-2198', match: 78, desc: 'ATM card fraud linked to phone theft cluster', outcome: 'Partial arrest' },
          { case: 'Case-2023-7743', match: 71, desc: 'Cross-district vehicle theft ring, seasonal pattern', outcome: 'Solved in 11 days' },
        ].map(c => `
          <div style="background:var(--glass-bg-light);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:var(--space-md)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-sm)">
              <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-cyan)">${c.case}</span>
              <span style="font-size:1rem;font-weight:700;color:${c.match>=90?'var(--danger)':c.match>=75?'var(--warning)':'var(--text-muted)'}">${c.match}%</span>
            </div>
            <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:8px">${c.desc}</p>
            <span class="badge badge-success" style="font-size:0.65rem">${c.outcome}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Social Media Signal Monitor -->
    <div class="glass-card no-hover">
      <div class="section-header">
        <span class="section-title">
          📡 Social Media Crime Signal Monitor
        </span>
        <div class="live-dot"></div>
      </div>
      <div id="social-feed" style="margin-top:var(--space-md)">
        ${[
          { platform: '𝕏 Twitter', text: 'Unusual crowd gathering near Market Road at 8 PM', sentiment: 'suspicious', time: '12 min ago', score: 72 },
          { platform: '📘 Facebook', text: 'Multiple reports of strange vehicles in Industrial Zone', sentiment: 'alert', time: '28 min ago', score: 65 },
          { platform: '📸 Instagram', text: 'Night market seems unusually empty today…', sentiment: 'anomaly', time: '45 min ago', score: 48 },
        ].map(s => `
          <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-sm) var(--space-md);border-radius:var(--radius-md);background:var(--glass-bg-light);border:1px solid var(--border-subtle);margin-bottom:var(--space-sm)">
            <span style="font-size:0.9rem;min-width:100px;color:var(--text-muted)">${s.platform}</span>
            <div style="flex:1;font-size:0.82rem;color:var(--text-secondary)">
              "${s.text}"
              <span style="color:var(--text-muted);font-size:0.72rem;margin-left:8px">${s.time}</span>
            </div>
            <div style="text-align:right">
              <div style="font-size:0.85rem;font-weight:700;color:${s.score>=70?'var(--danger)':'var(--warning)'}">${s.score}%</div>
              <div style="font-size:0.7rem;color:var(--text-muted)">relevance</div>
            </div>
            <span class="badge badge-${s.sentiment==='alert'?'danger':'warning'}">${s.sentiment}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Forecast chart
  renderForecastChart();

  // Threshold slider
  const slider = document.getElementById('conf-threshold');
  const val = document.getElementById('conf-val');
  if (slider && val) slider.addEventListener('input', () => val.textContent = slider.value);
};

function renderForecastChart() {
  const canvas = document.getElementById('forecast-chart');
  if (!canvas || !window.Chart) return;
  const hours = Array.from({length: 24}, (_, i) => `${String(i).padStart(2,'0')}:00`);
  const vals  = [3,2,1,1,2,4,8,12,15,18,14,16,19,22,20,17,24,28,35,32,28,22,15,8];
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: 'Crime Probability',
        data: vals,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#132540', borderColor: 'rgba(139,92,246,0.4)', borderWidth: 1 } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#5a7a95', font: { size: 9 }, maxRotation: 0 } },
        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#5a7a95', font: { size: 9 } } }
      }
    }
  });
}

// =============================================
// CRIMEMIND AI — Dark Web Monitor Page
// =============================================

window.renderDarkWeb = function (container) {
  container.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Dark Web Intelligence Monitor
          <span class="page-title-badge" style="background:rgba(255,59,92,0.12);color:var(--danger);border-color:rgba(255,59,92,0.3)">CLASSIFIED</span>
        </h1>
        <p class="page-subtitle">Real-time surveillance of criminal dark web activity · Automated threat detection</p>
      </div>
      <div class="flex gap-sm">
        <div class="live-dot danger"></div>
        <span style="font-size:0.82rem;color:var(--danger)">Monitoring Active</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)">
      <!-- Dark Web Feed -->
      <div class="glass-card no-hover" style="border-color:rgba(255,59,92,0.2)">
        <div class="section-header">
          <span class="section-title" style="color:var(--danger)">
            <div class="live-dot danger"></div>
            Live Dark Web Feed
          </span>
          <span class="badge badge-danger">4 Alerts</span>
        </div>
        <div style="margin-top:var(--space-md)">
          ${CM_DATA.darkwebFeeds.map(f => `
            <div class="darkweb-item">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="color:var(--text-muted);font-size:0.7rem">${f.source}</span>
                <span style="color:var(--text-muted);font-size:0.7rem">${f.time}</span>
              </div>
              <div>${f.text}</div>
              <div style="margin-top:4px"><span class="badge badge-${f.risk==='critical'?'danger':f.risk==='high'?'warning':'muted'}" style="font-size:0.62rem">${f.risk}</span></div>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-danger btn-sm" style="margin-top:var(--space-md);width:100%" onclick="CM_APP.showToast('Alert Sent','Critical dark web activity flagged for CIB','critical')">
          🚨 Flag for CIB Investigation
        </button>
      </div>

      <!-- Keyword Monitor -->
      <div>
        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <div class="section-header">
            <span class="section-title">Monitored Keywords</span>
            <button class="btn btn-outline btn-sm" onclick="CM_APP.showToast('Added','Keyword added to watchlist','success')">+ Add</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);margin-top:var(--space-md)">
            ${['Central operation','clean plates','ghost network','iron circle','50 units','SIM swap','ID needed','burner phone','MH registration','safe house'].map((kw, i) => `
              <div style="display:flex;align-items:center;gap:4px;background:rgba(255,59,92,0.08);border:1px solid rgba(255,59,92,0.2);border-radius:var(--radius-full);padding:4px 12px;font-size:0.75rem">
                <span style="color:var(--danger)">●</span>
                <span style="color:var(--text-secondary)">${kw}</span>
                <span style="color:var(--text-muted);font-size:0.65rem">${Math.floor(Math.random()*15)+1} hits</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Threat Level Gauge -->
        <div class="glass-card no-hover" style="text-align:center;border-color:rgba(255,59,92,0.2)">
          <div class="stat-label" style="margin-bottom:var(--space-md)">Current Threat Level</div>
          <div style="font-size:4rem;margin-bottom:var(--space-sm)">🔴</div>
          <div style="font-size:1.5rem;font-weight:700;color:var(--danger);margin-bottom:4px">HIGH</div>
          <div class="progress-bar-wrap" style="margin:var(--space-md) auto;max-width:200px">
            <div class="progress-bar danger" style="width:78%"></div>
          </div>
          <p style="font-size:0.78rem;color:var(--text-muted)">Dark web activity level: 78/100 · Elevated from yesterday</p>
        </div>
      </div>
    </div>

    <!-- Dark Web Market Intelligence -->
    <div class="glass-card no-hover">
      <div class="section-header">
        <span class="section-title">Market Intelligence Report</span>
        <span class="badge badge-muted">Last updated: 2 min ago</span>
      </div>
      <table class="data-table" style="margin-top:var(--space-md)">
        <thead><tr><th>Category</th><th>Activity Level</th><th>Mentions (24h)</th><th>Trend</th><th>Action</th></tr></thead>
        <tbody>
          ${[
            { cat: 'Narcotics', level: 85, mentions: 234, trend: '+12%', urgent: true },
            { cat: 'Stolen Vehicles', level: 62, mentions: 87, trend: '+5%', urgent: false },
            { cat: 'Forged Documents', level: 45, mentions: 43, trend: '-8%', urgent: false },
            { cat: 'Cyber Attack Tools', level: 71, mentions: 156, trend: '+23%', urgent: true },
            { cat: 'Firearms', level: 38, mentions: 29, trend: '-2%', urgent: false },
          ].map(r => `
            <tr>
              <td style="font-weight:500;color:var(--text-primary)">${r.cat}</td>
              <td>
                <div class="progress-bar-wrap" style="width:100px">
                  <div class="progress-bar ${r.level>=70?'danger':r.level>=50?'warning':'success'}" style="width:${r.level}%"></div>
                </div>
              </td>
              <td style="font-family:var(--font-mono)">${r.mentions}</td>
              <td style="color:${r.trend.startsWith('+')?'var(--danger)':'var(--success)'}">${r.trend}</td>
              <td>
                ${r.urgent?`<button class="btn btn-danger btn-sm" style="font-size:0.72rem" onclick="CM_APP.showToast('Alert Raised','Urgent alert sent to CIB','critical')">Alert CIB</button>`
                :`<button class="btn btn-ghost btn-sm" style="font-size:0.72rem">Monitor</button>`}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};
