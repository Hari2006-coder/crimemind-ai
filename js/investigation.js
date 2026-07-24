// =============================================
// CRIMEMIND AI — Investigation Copilot Page
// =============================================

window.renderInvestigation = function (container) {
  container.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          AI Investigation Copilot
          <span class="page-title-badge">GPT-CRIME ENGINE</span>
        </h1>
        <p class="page-subtitle">Search any suspect · AI builds timeline · Predicts next move</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="suspect-search-bar" style="position:relative;margin-bottom:var(--space-xl)">
      <svg style="position:absolute;left:18px;top:50%;transform:translateY(-50%);color:var(--accent-cyan)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input type="text" class="suspect-search-input" id="suspect-search" placeholder="Search suspect name, alias, FIR number, vehicle plate…" autocomplete="off">
      <button class="btn btn-primary" style="position:absolute;right:8px;top:50%;transform:translateY(-50%)" id="ai-search-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
        AI Analyze
      </button>
      <div class="search-dropdown" id="suspect-dropdown" style="top:calc(100% + 8px)">
        ${CM_DATA.suspects.map(s => `
          <div class="search-result-item" data-id="${s.id}">
            <span style="font-size:1.5rem">${s.photo}</span>
            <div style="flex:1">
              <div style="font-size:0.85rem;font-weight:500;color:var(--text-primary)">${s.name}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${s.alias.join(', ')} · ${s.modus}</div>
            </div>
            <span class="badge badge-${s.risk==='high'?'danger':s.risk==='medium'?'warning':'success'}">${s.risk}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Main Investigation Layout -->
    <div id="investigation-main"></div>
  `;

  // Default: show first suspect
  showSuspectInvestigation(CM_DATA.suspects[0]);

  const input = document.getElementById('suspect-search');
  const dropdown = document.getElementById('suspect-dropdown');

  input.addEventListener('focus', () => dropdown.classList.remove('hidden'));
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.add('hidden');
  });

  document.querySelectorAll('#suspect-dropdown .search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const sus = CM_DATA.suspects.find(s => s.id === item.dataset.id);
      if (sus) { showSuspectInvestigation(sus); dropdown.classList.add('hidden'); input.value = sus.name; }
    });
  });

  document.getElementById('ai-search-btn').addEventListener('click', () => {
    const q = input.value.toLowerCase();
    const found = CM_DATA.suspects.find(s => s.name.toLowerCase().includes(q) || s.alias.some(a => a.toLowerCase().includes(q)));
    if (found) showSuspectInvestigation(found);
    else CM_APP.showToast('No Match', 'No suspect found. Try a different name or alias.', 'warning');
  });
};

function showSuspectInvestigation(suspect) {
  const container = document.getElementById('investigation-main');
  if (!container) return;

  container.innerHTML = `
    <div class="investigation-layout">
      <!-- Suspect Profile -->
      <div>
        <div class="glass-card suspect-card" style="margin-bottom:var(--space-md)">
          <div class="ai-processing">
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
            <span style="margin-left:4px">AI Engine analyzing…</span>
          </div>
          <div class="flex gap-md" style="margin-bottom:var(--space-md)">
            <div class="suspect-photo">${suspect.photo}</div>
            <div style="flex:1">
              <h3 style="color:var(--text-primary);margin-bottom:4px">${suspect.name}</h3>
              <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px">AKA: ${suspect.alias.join(', ')}</div>
              <span class="badge badge-${suspect.risk==='high'?'danger':suspect.risk==='medium'?'warning':'success'}">
                ${suspect.risk.toUpperCase()} RISK
              </span>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);font-size:0.8rem">
            <div><div class="stat-label">Age</div><div style="color:var(--text-primary);font-weight:500">${suspect.age} yrs</div></div>
            <div><div class="stat-label">Prior Arrests</div><div style="color:var(--danger);font-weight:700">${suspect.priors}</div></div>
            <div><div class="stat-label">Gang</div><div style="color:var(--accent-purple);font-weight:500">${suspect.gang}</div></div>
            <div><div class="stat-label">Last Seen</div><div style="color:var(--text-primary);font-weight:500;font-size:0.75rem">${suspect.lastSeen}</div></div>
          </div>
          <div style="margin-top:var(--space-md)">
            <div class="stat-label" style="margin-bottom:6px">Modus Operandi</div>
            <p style="font-size:0.8rem;color:var(--text-secondary);background:var(--bg-tertiary);padding:8px;border-radius:var(--radius-sm)">${suspect.modus}</p>
          </div>
        </div>

        <!-- Confidence Score -->
        <div class="glass-card glow-accent">
          <div class="stat-label">AI Evidence Confidence</div>
          <div style="font-size:2rem;font-weight:700;color:var(--accent-cyan);margin:8px 0">${suspect.confidence}%</div>
          <div class="progress-bar-wrap" style="margin-bottom:var(--space-sm)">
            <div class="progress-bar" style="width:${suspect.confidence}%;transition:width 1.2s ease"></div>
          </div>
          <p style="font-size:0.78rem;color:var(--text-muted)">Based on CCTV matches, phone data, and behavioral pattern analysis</p>
        </div>

        <!-- Risk Gauge -->
        <div class="glass-card glow-${suspect.risk==='high'?'danger':suspect.risk==='medium'?'warning':'success'}" style="text-align:center">
          <div class="stat-label" style="margin-bottom:var(--space-sm)">Risk Classification</div>
          <div style="font-size:2.5rem;margin:var(--space-sm) 0">${suspect.risk==='high'?'🔴':suspect.risk==='medium'?'🟡':'🟢'}</div>
          <div style="font-size:1.2rem;font-weight:700;color:${suspect.risk==='high'?'var(--danger)':suspect.risk==='medium'?'var(--warning)':'var(--success)'}">
            ${suspect.risk.toUpperCase()} RISK
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px">
            ${suspect.risk==='high'?'Immediate action required':'Monitor closely'}
          </div>
        </div>
      </div>

      <!-- AI Timeline -->
      <div>
        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <div class="section-header">
            <span class="section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              AI Investigation Timeline
            </span>
            <div class="scanner-overlay"><div class="scanner-line"></div></div>
            <span class="badge badge-info">
              <div class="live-dot" style="width:6px;height:6px"></div>
              RECONSTRUCTING
            </span>
          </div>
          <div class="timeline" id="investigation-timeline" style="margin-top:var(--space-md)">
            ${suspect.timeline.map((item, i) => `
              <div class="timeline-item" style="animation-delay:${i*120}ms">
                <div class="timeline-dot ${item.color}"></div>
                <div class="timeline-time">${item.time}</div>
                <div class="timeline-content">
                  <div class="timeline-title">
                    ${timelineIcon(item.type)} ${item.event}
                  </div>
                  <div class="timeline-desc">${item.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top:var(--space-md);background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.25);border-radius:var(--radius-md);padding:var(--space-md)">
            <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:8px">
              <span>🔮</span>
              <span style="font-weight:600;color:var(--accent-purple);font-size:0.85rem">AI Predicted Next Move</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary)">${suspect.nextMove}</p>
          </div>
        </div>
      </div>

      <!-- AI Recommendation Panel -->
      <div>
        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <h4 style="margin-bottom:var(--space-md);font-size:0.85rem;color:var(--accent-cyan);letter-spacing:0.08em;text-transform:uppercase">AI Recommendations</h4>
          ${[
            { icon: '🎯', label: 'Intercept Point', value: 'North Highway Checkpoint', btn: 'Deploy Unit' },
            { icon: '📡', label: 'Monitor Devices', value: `IMEI trace active · ${suspect.priors} prior records`, btn: 'View Devices' },
            { icon: '👥', label: 'Known Associates', value: `${suspect.associates?.length || 0} linked suspects`, btn: 'View Network' },
            { icon: '🏦', label: 'Financial Trace', value: 'ATM pattern: 3 banks flagged', btn: 'Freeze Account' },
          ].map(r => `
            <div style="display:flex;align-items:center;gap:var(--space-sm);padding:10px;border-radius:var(--radius-md);background:var(--glass-bg-light);border:1px solid var(--border-subtle);margin-bottom:8px">
              <span style="font-size:1.2rem">${r.icon}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:0.75rem;color:var(--text-muted)">${r.label}</div>
                <div style="font-size:0.82rem;font-weight:500;color:var(--text-primary)">${r.value}</div>
              </div>
              <button class="btn btn-outline btn-sm" style="flex-shrink:0;font-size:0.7rem;padding:5px 10px" onclick="CM_APP.showToast('Action Triggered','${r.btn} action initiated','info')">${r.btn}</button>
            </div>
          `).join('')}
        </div>

        <!-- Generate Report -->
        <button class="btn btn-primary btn-full btn-lg" id="generate-summary-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>
          Generate Investigation Summary
        </button>

        <!-- Behavioral Profile -->
        <div class="glass-card no-hover" style="margin-top:var(--space-md)">
          <h4 style="margin-bottom:var(--space-md);font-size:0.85rem;color:var(--accent-purple);letter-spacing:0.08em;text-transform:uppercase">AI Behavioral Profile</h4>
          ${[
            { trait: 'Aggression Level', value: suspect.risk === 'high' ? 85 : 45, color: 'danger' },
            { trait: 'Evasion Skill',   value: 72, color: 'warning' },
            { trait: 'Gang Loyalty',    value: suspect.gang !== '-' ? 88 : 20, color: 'info' },
            { trait: 'Recidivism Risk', value: Math.min(suspect.priors * 9, 99), color: 'danger' },
          ].map(p => `
            <div style="margin-bottom:var(--space-sm)">
              <div class="confidence-bar-label">
                <span style="font-size:0.78rem;color:var(--text-secondary)">${p.trait}</span>
                <span style="font-size:0.78rem;font-weight:600;color:var(--text-primary)">${p.value}%</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar ${p.color}" style="width:${p.value}%;transition:width 1.2s ease"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('generate-summary-btn').addEventListener('click', () => generateSummaryModal(suspect));
}

function timelineIcon(type) {
  const icons = { cctv: '📷', phone: '📱', bank: '🏦', alert: '🚨', prediction: '🔮', intel: '🔍', cyber: '💻' };
  return icons[type] || '📌';
}

function generateSummaryModal(suspect) {
  const existing = document.getElementById('summary-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'summary-modal';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:700px">
      <div class="modal-header">
        <div>
          <h2 style="font-size:1.1rem;color:var(--accent-cyan)">AI Investigation Summary Report</h2>
          <p style="font-size:0.78rem;color:var(--text-muted)">Generated: ${new Date().toLocaleString('en-IN')} · Classified</p>
        </div>
        <button class="modal-close" onclick="document.getElementById('summary-modal').remove()">✕</button>
      </div>

      <div style="background:var(--grad-blue);padding:var(--space-md);border-radius:var(--radius-md);margin-bottom:var(--space-md)">
        <div style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;opacity:0.8">CRIMEMIND AI · CLASSIFIED REPORT</div>
        <h3 style="margin-top:4px;font-size:1.2rem">${suspect.name} — Investigation Dossier</h3>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-md)">
        <div class="glass-card no-hover" style="padding:var(--space-md)">
          <div class="stat-label">Risk Level</div>
          <div style="font-size:1.1rem;font-weight:700;color:${suspect.risk==='high'?'var(--danger)':suspect.risk==='medium'?'var(--warning)':'var(--success)'}">${suspect.risk.toUpperCase()}</div>
        </div>
        <div class="glass-card no-hover" style="padding:var(--space-md)">
          <div class="stat-label">Evidence Confidence</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--accent-cyan)">${suspect.confidence}%</div>
        </div>
      </div>

      <div class="glass-card no-hover" style="padding:var(--space-md);margin-bottom:var(--space-md)">
        <div class="stat-label" style="margin-bottom:8px">AI Movement Reconstruction</div>
        ${suspect.timeline.map(t => `
          <div style="display:flex;gap:12px;margin-bottom:8px;font-size:0.82rem">
            <span style="color:var(--accent-cyan);font-family:var(--font-mono);min-width:44px">${t.time}</span>
            <span style="color:var(--text-secondary)">${timelineIcon(t.type)} ${t.event}</span>
          </div>
        `).join('')}
      </div>

      <div class="glass-card no-hover" style="padding:var(--space-md);margin-bottom:var(--space-md);background:rgba(139,92,246,0.05);border-color:rgba(139,92,246,0.2)">
        <div class="stat-label" style="margin-bottom:8px">AI Predicted Next Move</div>
        <p style="font-size:0.85rem;color:var(--text-secondary)">${suspect.nextMove}</p>
      </div>

      <div style="display:flex;gap:var(--space-sm)">
        <button class="btn btn-primary" onclick="window.print()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Download PDF
        </button>
        <button class="btn btn-outline" onclick="CM_APP.showToast('Alert Sent','Investigation shared with team','success');document.getElementById('summary-modal').remove()">
          Share with Team
        </button>
        <button class="btn btn-ghost" onclick="document.getElementById('summary-modal').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
