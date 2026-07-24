// =============================================
// CRIMEMIND AI — Report Generator Page
// =============================================

window.renderReports = function (container) {
  let generating = false;
  container.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Intelligence Report Generator
          <span class="page-title-badge">AUTO-GENERATE</span>
        </h1>
        <p class="page-subtitle">One-click AI-generated crime intelligence reports · PDF ready · Classified</p>
      </div>
    </div>

    <div class="report-layout">
      <!-- Config Panel -->
      <div>
        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <h4 style="font-size:0.85rem;color:var(--accent-cyan);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:var(--space-md)">Report Configuration</h4>
          <div class="form-group">
            <label class="form-label">Report Type</label>
            <select class="select-custom" style="width:100%" id="report-type">
              <option>Daily Crime Summary</option>
              <option>Weekly Intelligence Report</option>
              <option>Suspect Dossier</option>
              <option>Incident Report</option>
              <option>Gang Activity Report</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Classification Level</label>
            <select class="select-custom" style="width:100%" id="report-class">
              <option>RESTRICTED</option>
              <option>CONFIDENTIAL</option>
              <option selected>SECRET</option>
              <option>TOP SECRET</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Date Range</label>
            <select class="select-custom" style="width:100%" id="report-date">
              <option>Last 24 Hours</option>
              <option selected>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <h4 style="font-size:0.85rem;color:var(--accent-cyan);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:var(--space-md)">Include Sections</h4>
          ${[
            { id:'sec-summary',    label:'Executive Summary', default:true },
            { id:'sec-risk',       label:'High Risk Zones Map', default:true },
            { id:'sec-suspects',   label:'Top Suspects', default:true },
            { id:'sec-timeline',   label:'Investigation Timeline', default:true },
            { id:'sec-ai',         label:'AI Recommendations', default:true },
            { id:'sec-charts',     label:'Statistical Charts', default:true },
            { id:'sec-fir',        label:'Recent FIRs', default:false },
            { id:'sec-network',    label:'Criminal Network', default:false },
            { id:'sec-darkweb',    label:'Dark Web Intelligence', default:false },
          ].map(s => `
            <div class="settings-row" style="padding:6px 0">
              <div class="settings-row-label" style="font-size:0.82rem">${s.label}</div>
              <label class="toggle">
                <input type="checkbox" id="${s.id}" ${s.default?'checked':''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          `).join('')}
        </div>

        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <label class="form-label">Officer Notes</label>
          <textarea style="width:100%;background:rgba(5,15,35,0.8);border:1px solid var(--glass-border);border-radius:var(--radius-md);padding:12px;font-family:var(--font-primary);font-size:0.85rem;color:var(--text-primary);resize:vertical;min-height:80px;outline:none" placeholder="Add notes for the report…" id="officer-notes"></textarea>
        </div>

        <button class="btn btn-primary btn-full btn-lg" id="generate-report-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Generate AI Report
        </button>
      </div>

      <!-- Report Preview -->
      <div class="report-preview">
        <div id="report-preview-content">
          <div style="padding:var(--space-2xl);text-align:center;color:var(--text-muted)">
            <div style="font-size:3rem;margin-bottom:var(--space-md)">📄</div>
            <p style="font-size:0.9rem">Configure your report options and click <strong style="color:var(--accent-cyan)">Generate AI Report</strong> to see the preview.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('generate-report-btn').addEventListener('click', function() {
    if (generating) return;
    generating = true;
    this.disabled = true;
    this.innerHTML = `<span class="animate-spin" style="display:inline-block">⟳</span> Generating…`;

    const preview = document.getElementById('report-preview-content');
    preview.innerHTML = `
      <div style="padding:var(--space-2xl);text-align:center">
        <div class="ai-processing" style="justify-content:center;margin-bottom:var(--space-lg)">
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
          <span>AI compiling intelligence report…</span>
        </div>
        <div class="progress-bar-wrap" style="max-width:300px;margin:0 auto">
          <div class="progress-bar" id="report-progress" style="width:0%;transition:width 0.4s ease"></div>
        </div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:8px" id="report-step">Initializing…</div>
      </div>
    `;

    const steps = ['Gathering crime data…', 'Analyzing patterns…', 'Building visualizations…', 'Writing AI summary…', 'Finalizing…'];
    let prog = 0, step = 0;
    const iv = setInterval(() => {
      prog += 20;
      const bar = document.getElementById('report-progress');
      const st = document.getElementById('report-step');
      if (bar) bar.style.width = prog + '%';
      if (st && steps[step]) { st.textContent = steps[step]; step++; }
      if (prog >= 100) {
        clearInterval(iv);
        setTimeout(() => renderReportPreview(), 400);
        this.disabled = false;
        this.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Download PDF`;
        this.onclick = () => window.print();
        generating = false;
      }
    }, 380);
  });

  function renderReportPreview() {
    const preview = document.getElementById('report-preview-content');
    const type = document.getElementById('report-type')?.value || 'Daily Crime Summary';
    const cls = document.getElementById('report-class')?.value || 'SECRET';
    const notes = document.getElementById('officer-notes')?.value || '';

    preview.innerHTML = `
      <div class="report-header-print">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
          <div style="display:flex;align-items:center;gap:var(--space-sm)">
            <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.5rem">🛡️</div>
            <div>
              <div style="font-size:0.7rem;opacity:0.8;letter-spacing:0.1em">GOVERNMENT OF INDIA</div>
              <div style="font-weight:700;font-size:1rem">CrimeMind AI Intelligence Platform</div>
            </div>
          </div>
          <div style="background:rgba(255,59,92,0.3);border:1px solid rgba(255,59,92,0.5);border-radius:6px;padding:4px 12px;font-size:0.75rem;font-weight:700;letter-spacing:0.1em">
            ⚠ ${cls}
          </div>
        </div>
        <h2 style="font-size:1.3rem;margin-bottom:4px">${type}</h2>
        <div style="font-size:0.8rem;opacity:0.8">Generated: ${new Date().toLocaleString('en-IN')} · By: ${CM_DATA.officer.name} · Badge: ${CM_DATA.officer.badge}</div>
      </div>

      <div class="report-section-print">
        <h3 style="color:var(--accent-cyan);font-size:0.9rem;margin-bottom:var(--space-md);letter-spacing:0.06em">EXECUTIVE SUMMARY</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.7">
          AI analysis of crime data for the reporting period reveals <strong style="color:var(--danger)">elevated activity</strong> in Central and East districts. 
          Total incidents: <strong style="color:var(--text-primary)">${CM_DATA.crimeStats.today}</strong> reported today, with ${CM_DATA.crimeStats.highRisk} high-risk zones active. 
          Primary threat: Ghost Network gang activity near Market Road. Immediate deployment recommended.
        </p>
      </div>

      <div class="report-section-print">
        <h3 style="color:var(--accent-cyan);font-size:0.9rem;margin-bottom:var(--space-md);letter-spacing:0.06em">CRIME STATISTICS</h3>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-md)">
          ${[
            { label:'Total Crimes', val: CM_DATA.crimeStats.total.toLocaleString() },
            { label:"Today's Crimes", val: CM_DATA.crimeStats.today },
            { label:'High Risk Zones', val: CM_DATA.crimeStats.highRisk },
            { label:'Pending Cases', val: CM_DATA.crimeStats.pending },
          ].map(s => `
            <div style="text-align:center;padding:var(--space-md);background:var(--glass-bg-light);border-radius:var(--radius-md)">
              <div style="font-size:1.5rem;font-weight:700;color:var(--accent-cyan)">${s.val}</div>
              <div style="font-size:0.72rem;color:var(--text-muted)">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="report-section-print">
        <h3 style="color:var(--accent-cyan);font-size:0.9rem;margin-bottom:var(--space-md);letter-spacing:0.06em">TOP SUSPECTS</h3>
        ${CM_DATA.suspects.map(s => `
          <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-sm);border-bottom:1px solid var(--border-subtle)">
            <span style="font-size:1.5rem">${s.photo}</span>
            <div style="flex:1">
              <div style="font-weight:600;color:var(--text-primary)">${s.name}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${s.modus}</div>
            </div>
            <span class="badge badge-${s.risk==='high'?'danger':s.risk==='medium'?'warning':'success'}">${s.risk}</span>
          </div>
        `).join('')}
      </div>

      <div class="report-section-print">
        <h3 style="color:var(--accent-cyan);font-size:0.9rem;margin-bottom:var(--space-md);letter-spacing:0.06em">AI RECOMMENDATIONS</h3>
        <div style="display:flex;flex-direction:column;gap:var(--space-sm)">
          ${[
            { icon:'🎯', text:'Deploy 2 additional units to Market Road immediately (Risk: 87%)' },
            { icon:'🚔', text:'Intercept North Highway checkpoint — suspect likely crossing at 22:00' },
            { icon:'📡', text:'Monitor IMEI 358423XX — last ping: MR-Cell-Tower-12' },
            { icon:'🌐', text:'Dark web chatter elevated — initiate TOR surveillance protocol' },
            { icon:'💰', text:'Freeze account 4921XXXX linked to ATM fraud cluster' },
          ].map(r => `
            <div style="display:flex;gap:var(--space-sm);font-size:0.82rem;color:var(--text-secondary)">
              <span>${r.icon}</span><span>${r.text}</span>
            </div>
          `).join('')}
        </div>
      </div>

      ${notes ? `<div class="report-section-print">
        <h3 style="color:var(--accent-cyan);font-size:0.9rem;margin-bottom:var(--space-sm);letter-spacing:0.06em">OFFICER NOTES</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);font-style:italic">"${notes}"</p>
      </div>` : ''}

      <div class="report-section-print" style="border-bottom:none;text-align:center;color:var(--text-muted);font-size:0.72rem">
        <p>This document is classified. Unauthorized disclosure is prohibited under Official Secrets Act.</p>
        <p style="margin-top:4px">CrimeMind AI · Secure Platform v2.4.1 · ${new Date().getFullYear()}</p>
      </div>
    `;
    CM_APP.showToast('Report Generated', 'Intelligence report ready for download', 'success');
  }
};
