// =============================================
// CRIMEMIND AI — Alert Center Page
// =============================================

window.renderAlerts = function (container) {
  let activeFilter = 'all';
  container.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          Alert Center
          <span class="page-title-badge" style="background:rgba(255,59,92,0.12);color:var(--danger);border-color:rgba(255,59,92,0.3)">
            <div class="live-dot danger" style="width:6px;height:6px"></div>
            ${CM_DATA.alerts.length} ACTIVE
          </span>
        </h1>
        <p class="page-subtitle">Real-time intelligence alerts · Priority-ordered · One-click dispatch</p>
      </div>
      <div class="flex gap-sm">
        <button class="btn btn-danger btn-sm" onclick="CM_APP.showToast('Emergency Broadcast','All units alerted via radio','critical')">
          🚨 Emergency Broadcast
        </button>
        <button class="btn btn-ghost btn-sm" id="clear-all-btn">Mark All Read</button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-sm" style="margin-bottom:var(--space-lg);flex-wrap:wrap">
      ${[
        { id:'all', label:'All Alerts', count: CM_DATA.alerts.length },
        { id:'critical', label:'Critical', count: CM_DATA.alerts.filter(a=>a.severity==='critical').length },
        { id:'high', label:'High', count: CM_DATA.alerts.filter(a=>a.severity==='high').length },
        { id:'Crime Spike', label:'Crime Spike', count: 2 },
        { id:'Gang Activity', label:'Gang Activity', count: 1 },
        { id:'Vehicle Alert', label:'Vehicle Alert', count: 1 },
        { id:'Cyber', label:'Cyber', count: 1 },
      ].map(f => `
        <button class="btn btn-ghost btn-sm filter-tab ${f.id==='all'?'active':''}" data-filter="${f.id}" style="font-size:0.78rem">
          ${f.label} <span class="nav-badge" style="position:relative;top:0;right:0;display:inline-block;margin-left:4px">${f.count}</span>
        </button>
      `).join('')}
    </div>

    <div class="alert-center-layout">
      <!-- Alert Feed -->
      <div>
        <div class="alert-feed" id="alert-feed">
          ${CM_DATA.alerts.map((a, i) => alertCardHTML(a, i)).join('')}
        </div>
      </div>

      <!-- Side Panel -->
      <div>
        <!-- Emergency Actions -->
        <div class="glass-card no-hover glow-danger" style="margin-bottom:var(--space-md)">
          <h4 style="font-size:0.85rem;color:var(--danger);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:var(--space-md)">Emergency Actions</h4>
          ${[
            { icon:'🚔', label:'Dispatch All Units', desc:'Alert all patrol units', action:'dispatch' },
            { icon:'📡', label:'CCTV Lockdown', desc:'Activate all CCTV cameras', action:'cctv' },
            { icon:'🔒', label:'District Perimeter', desc:'Close district checkpoints', action:'perimeter' },
            { icon:'📢', label:'Public Alert', desc:'Broadcast public advisory', action:'public' },
          ].map(a => `
            <button class="btn btn-ghost btn-full" style="justify-content:flex-start;gap:var(--space-sm);margin-bottom:6px;border-color:rgba(255,59,92,0.2);font-size:0.82rem" onclick="CM_APP.showToast('${a.label}','Action initiated for ${a.label}','critical')">
              <span style="font-size:1.1rem">${a.icon}</span>
              <div style="text-align:left">
                <div style="font-weight:600;color:var(--text-primary)">${a.label}</div>
                <div style="font-size:0.72rem;color:var(--text-muted)">${a.desc}</div>
              </div>
            </button>
          `).join('')}
        </div>

        <!-- Alert Statistics -->
        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <h4 style="font-size:0.85rem;color:var(--accent-cyan);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:var(--space-md)">Alert Statistics (24h)</h4>
          <div class="chart-container" style="height:160px">
            <canvas id="alert-chart"></canvas>
          </div>
        </div>

        <!-- Response Log -->
        <div class="glass-card no-hover">
          <h4 style="font-size:0.85rem;color:var(--accent-cyan);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:var(--space-md)">Response Log</h4>
          ${[
            { time:'14:12', action:'Unit Alpha-1 dispatched', by:'Supt. Mehta' },
            { time:'13:58', action:'CCTV feed enhanced: Market Road', by:'SI Patel' },
            { time:'13:45', action:'Bank account flagged for freeze', by:'SI Sharma' },
            { time:'13:30', action:'Gang alert: CIB notified', by:'System AI' },
          ].map(r => `
            <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-sm);font-size:0.78rem">
              <span style="color:var(--accent-cyan);font-family:var(--font-mono);min-width:44px">${r.time}</span>
              <div>
                <div style="color:var(--text-secondary)">${r.action}</div>
                <div style="color:var(--text-muted)">${r.by}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeFilter = this.dataset.filter;
      filterAlerts(activeFilter);
    });
  });

  document.getElementById('clear-all-btn').addEventListener('click', () => {
    document.querySelectorAll('.alert-card-big').forEach(c => c.style.opacity = '0.4');
    CM_APP.showToast('Alerts Cleared', 'All alerts marked as read', 'success');
  });

  renderAlertChart();

  // Live alert simulation
  let liveAlerts = 0;
  const liveInterval = setInterval(() => {
    if (!document.getElementById('alert-feed')) { clearInterval(liveInterval); return; }
    if (liveAlerts >= 2) { clearInterval(liveInterval); return; }
    const newAlert = {
      id: `ALT-LIVE-${liveAlerts}`,
      time: 'just now',
      severity: liveAlerts === 0 ? 'critical' : 'high',
      category: liveAlerts === 0 ? 'Crime Spike' : 'Suspicious',
      title: liveAlerts === 0 ? 'LIVE: New incident reported — North Gate' : 'LIVE: Unidentified vehicle circling station',
      desc: liveAlerts === 0 ? 'Patrol unit responding. 3 suspects. Armed.' : 'Vehicle DL-01-XX-XXXX — plate partially obscured.',
      icon: liveAlerts === 0 ? '🚨' : '🚗'
    };
    const feed = document.getElementById('alert-feed');
    if (feed) {
      const el = document.createElement('div');
      el.innerHTML = alertCardHTML(newAlert, 99);
      el.querySelector('.alert-card-big').style.animation = 'slideInRight 0.4s ease both';
      feed.prepend(el.firstElementChild);
    }
    liveAlerts++;
  }, 6000);
};

function alertCardHTML(a, i) {
  return `
    <div class="alert-card-big ${a.severity}" style="animation-delay:${i*80}ms">
      <div class="alert-icon-big" style="background:${a.severity==='critical'?'rgba(255,59,92,0.12)':a.severity==='high'?'rgba(255,176,32,0.12)':'rgba(0,212,255,0.08)'}">
        ${a.icon}
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:4px;flex-wrap:wrap">
          <span class="badge badge-${a.severity==='critical'?'danger':a.severity==='high'?'warning':'info'}">${a.severity.toUpperCase()}</span>
          <span style="font-size:0.72rem;color:var(--text-muted)">${a.category}</span>
          <span style="font-size:0.72rem;color:var(--text-muted);margin-left:auto">${a.time}</span>
        </div>
        <div style="font-size:0.9rem;font-weight:600;color:var(--text-primary);margin-bottom:4px">${a.title}</div>
        <div style="font-size:0.8rem;color:var(--text-secondary)">${a.desc}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-sm);flex-shrink:0">
        <button class="btn btn-primary btn-sm" style="font-size:0.72rem" onclick="CM_APP.showToast('Dispatched','Unit dispatched for ${a.title.slice(0,30)}…','info')">Dispatch</button>
        <button class="btn btn-ghost btn-sm" style="font-size:0.72rem" onclick="CM_APP.navigateTo('investigation')">Investigate</button>
      </div>
    </div>
  `;
}

function filterAlerts(filter) {
  const cards = document.querySelectorAll('.alert-card-big');
  cards.forEach(card => {
    const title = card.querySelector('div[style*="font-weight:600"]')?.textContent || '';
    const badgeText = card.querySelector('.badge')?.textContent?.toLowerCase() || '';
    const visible = filter === 'all' || badgeText.includes(filter.toLowerCase()) || title.toLowerCase().includes(filter.toLowerCase());
    card.style.display = visible ? 'flex' : 'none';
  });
}

function renderAlertChart() {
  const canvas = document.getElementById('alert-chart');
  if (!canvas || !window.Chart) return;
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['00', '03', '06', '09', '12', '15', '18', '21'],
      datasets: [{
        data: [2, 1, 3, 8, 12, 7, 15, 11],
        backgroundColor: ['rgba(255,59,92,0.7)','rgba(255,59,92,0.4)','rgba(255,59,92,0.5)','rgba(255,59,92,0.7)','rgba(255,59,92,0.8)','rgba(255,59,92,0.6)','rgba(255,59,92,0.9)','rgba(255,59,92,0.8)'],
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#132540', borderColor: 'rgba(255,59,92,0.4)', borderWidth: 1 } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#5a7a95', font: { size: 9 } } },
        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#5a7a95', font: { size: 9 } } }
      }
    }
  });
}

// =============================================
// CRIMEMIND AI — Settings Page
// =============================================

window.renderSettings = function (container) {
  const sections = ['Profile', 'Appearance', 'Notifications', 'Security', 'System Logs', 'About'];
  let activeSection = 'Profile';

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        System Settings
      </h1>
      <p class="page-subtitle">Officer profile · Platform configuration · Security settings</p>
    </div>
    <div class="settings-layout">
      <div class="settings-nav" id="settings-nav">
        ${sections.map(s => `
          <div class="settings-nav-item ${s===activeSection?'active':''}" data-section="${s}">
            <span>${settingSectionIcon(s)}</span> ${s}
          </div>
        `).join('')}
        <div class="settings-nav-item" style="color:var(--danger);border-color:rgba(255,59,92,0.2)" onclick="CM_APP.showToast('Logged Out','Session ended securely','info')">
          <span>🚪</span> Logout
        </div>
      </div>
      <div id="settings-content"></div>
    </div>
  `;

  renderSettingsSection('Profile');

  document.querySelectorAll('.settings-nav-item[data-section]').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      renderSettingsSection(this.dataset.section);
    });
  });
};

function renderSettingsSection(section) {
  const container = document.getElementById('settings-content');
  if (!container) return;
  const o = CM_DATA.officer;

  const sections = {
    Profile: `
      <div class="glass-card no-hover">
        <div class="settings-section-title">Officer Profile</div>
        <div style="display:flex;align-items:center;gap:var(--space-xl);margin-bottom:var(--space-xl)">
          <div style="width:80px;height:80px;border-radius:50%;background:var(--grad-blue);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:700;border:3px solid var(--glass-border-active);box-shadow:var(--glow-cyan)">${o.initials}</div>
          <div>
            <h3>${o.name}</h3>
            <p style="font-size:0.85rem;color:var(--text-muted)">${o.rank} · ${o.dept}</p>
            <div style="margin-top:8px;display:flex;gap:var(--space-sm)">
              <span class="badge badge-info">${o.badge}</span>
              <span class="badge badge-success">Active Duty</span>
              <span class="badge badge-muted">Shift ${o.shift}</span>
            </div>
          </div>
        </div>
        ${[
          { label:'Full Name', val:o.name },
          { label:'Badge Number', val:o.badge },
          { label:'Rank', val:o.rank },
          { label:'Department', val:o.dept },
          { label:'District', val:o.district },
          { label:'Shift', val:o.shift },
        ].map(f => `
          <div class="settings-row">
            <div><div class="settings-row-label">${f.label}</div></div>
            <input style="background:var(--bg-tertiary);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:6px 12px;font-size:0.85rem;color:var(--text-primary);outline:none;transition:border-color 0.2s" value="${f.val}" onfocus="this.style.borderColor='var(--accent-cyan)'" onblur="this.style.borderColor='var(--border-default)'">
          </div>
        `).join('')}
        <button class="btn btn-primary btn-sm" style="margin-top:var(--space-md)" onclick="CM_APP.showToast('Saved','Profile updated successfully','success')">Save Changes</button>
      </div>
    `,
    Appearance: `
      <div class="glass-card no-hover">
        <div class="settings-section-title">Appearance</div>
        ${[
          { label:'Dark Mode', desc:'Enable dark theme (recommended)', checked:true },
          { label:'Neon Accents', desc:'Blue/cyan glow effects', checked:true },
          { label:'Glassmorphism Cards', desc:'Glass-blur UI elements', checked:true },
          { label:'Animations', desc:'Smooth page transitions', checked:true },
          { label:'Compact Sidebar', desc:'Show icon-only sidebar', checked:false },
          { label:'High Contrast Mode', desc:'Enhanced accessibility mode', checked:false },
        ].map(s => `
          <div class="settings-row">
            <div>
              <div class="settings-row-label">${s.label}</div>
              <div class="settings-row-desc">${s.desc}</div>
            </div>
            <label class="toggle">
              <input type="checkbox" ${s.checked?'checked':''} onchange="CM_APP.showToast('Setting Updated','${s.label} ${s.checked?'disabled':'enabled'}','info')">
              <span class="toggle-slider"></span>
            </label>
          </div>
        `).join('')}
        <div class="settings-row">
          <div><div class="settings-row-label">Language</div></div>
          <select class="select-custom">
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
            <option>Tamil</option>
          </select>
        </div>
      </div>
    `,
    Notifications: `
      <div class="glass-card no-hover">
        <div class="settings-section-title">Notification Settings</div>
        ${[
          { label:'Crime Spikes', desc:'Alert on sudden crime increases', checked:true },
          { label:'Repeat Offenders', desc:'Alert when repeat offenders enter district', checked:true },
          { label:'Gang Activity', desc:'Alert on gang movement detected', checked:true },
          { label:'Vehicle Blacklist', desc:'Alert on blacklisted vehicles', checked:true },
          { label:'Dark Web Mentions', desc:'Alert on relevant dark web chatter', checked:false },
          { label:'Patrol Offline', desc:'Alert when patrol unit goes offline', checked:true },
          { label:'Sound Alerts', desc:'Play audio for critical alerts', checked:false },
        ].map(s => `
          <div class="settings-row">
            <div>
              <div class="settings-row-label">${s.label}</div>
              <div class="settings-row-desc">${s.desc}</div>
            </div>
            <label class="toggle">
              <input type="checkbox" ${s.checked?'checked':''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        `).join('')}
      </div>
    `,
    Security: `
      <div class="glass-card no-hover">
        <div class="settings-section-title">Security & Access</div>
        ${[
          { label:'Two-Factor Auth', desc:'Require OTP for login', checked:true },
          { label:'Auto-Logout', desc:'Lock after 30 min inactivity', checked:true },
          { label:'Audit Logging', desc:'Log all user actions', checked:true },
          { label:'Emergency Login', desc:'Allow emergency bypass', checked:true },
          { label:'Biometric Lock', desc:'Fingerprint/face unlock', checked:false },
        ].map(s => `
          <div class="settings-row">
            <div>
              <div class="settings-row-label">${s.label}</div>
              <div class="settings-row-desc">${s.desc}</div>
            </div>
            <label class="toggle">
              <input type="checkbox" ${s.checked?'checked':''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        `).join('')}
        <div style="margin-top:var(--space-lg)">
          <button class="btn btn-outline btn-sm" onclick="CM_APP.showToast('Session Cleared','All active sessions terminated','warning')" style="margin-right:8px">Clear All Sessions</button>
          <button class="btn btn-danger btn-sm" onclick="CM_APP.showToast('Locked','Platform locked','info')">Lock Platform</button>
        </div>
      </div>
    `,
    'System Logs': `
      <div class="glass-card no-hover">
        <div class="settings-section-title">System Audit Logs</div>
        <div style="background:var(--bg-void);border-radius:var(--radius-md);padding:var(--space-md);font-family:var(--font-mono);font-size:0.78rem;max-height:400px;overflow-y:auto">
          ${CM_DATA.systemLogs.map(l => `
            <div style="margin-bottom:6px;display:flex;gap:var(--space-md)">
              <span style="color:var(--text-muted)">${l.time}</span>
              <span style="color:${l.level==='ERROR'?'var(--danger)':l.level==='WARN'?'var(--warning)':'var(--accent-cyan)'}">[${l.level}]</span>
              <span style="color:var(--text-secondary)">${l.msg}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-ghost btn-sm" style="margin-top:var(--space-md)" onclick="CM_APP.showToast('Exported','System logs exported to secure drive','success')">Export Logs</button>
      </div>
    `,
    About: `
      <div class="glass-card no-hover" style="text-align:center">
        <div style="font-size:4rem;margin-bottom:var(--space-md)">🛡️</div>
        <h2 style="background:var(--grad-blue);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px">CrimeMind AI</h2>
        <p style="color:var(--text-muted);margin-bottom:var(--space-lg)">Transforming Crime Data into Actionable Intelligence</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);text-align:left;margin-bottom:var(--space-lg)">
          ${[
            { label:'Version', val:'2.4.1 (Stable)' },
            { label:'Build', val:'2024.07.20-A' },
            { label:'AI Engine', val:'CrimeMind-GPT-v2' },
            { label:'Database', val:'CrimeDB v8.2' },
            { label:'CCTV Feeds', val:'847 cameras' },
            { label:'Classification', val:'SECRET // NOFORN' },
          ].map(i => `
            <div><div class="stat-label">${i.label}</div><div style="font-size:0.85rem;color:var(--text-primary);font-weight:500">${i.val}</div></div>
          `).join('')}
        </div>
        <p style="font-size:0.75rem;color:var(--text-muted)">© 2024 CrimeMind AI Division · Government of India · All Rights Reserved</p>
      </div>
    `,
  };

  container.innerHTML = sections[section] || `<div class="glass-card"><p>Section coming soon.</p></div>`;
}

function settingSectionIcon(s) {
  const icons = { Profile:'👤', Appearance:'🎨', Notifications:'🔔', Security:'🔒', 'System Logs':'📋', About:'ℹ️' };
  return icons[s] || '⚙️';
}
