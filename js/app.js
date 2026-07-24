// =============================================
// CRIMEMIND AI — Main Application Controller
// =============================================

(function () {
  'use strict';

  // ── State ──────────────────────────────────
  const state = {
    currentPage: 'dashboard',
    sidebarCollapsed: false,
    notifCount: 7,
    alerts: [],
    toastQueue: [],
    voiceActive: false,
    investigationSuspect: null,
  };

  // ── DOM refs ────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Init ───────────────────────────────────
  function init() {
    setupLogin();
  }

  // ══════════════════════════════════════════
  //  LOGIN
  // ══════════════════════════════════════════
  function setupLogin() {
    createParticles();
    const form = $('#login-form');
    form && form.addEventListener('submit', handleLogin);
    const emBtn = $('#emergency-login');
    emBtn && emBtn.addEventListener('click', () => {
      $('#login-user').value = 'emergency';
      $('#login-pass').value = '••••••••';
      handleLogin();
    });
  }

  function createParticles() {
    const container = $('#login-particles');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 3 + 1;
      Object.assign(p.style, {
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: `rgba(0, 212, 255, ${Math.random() * 0.5 + 0.1})`,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animation: `particle-float ${Math.random() * 20 + 15}s linear ${Math.random() * 10}s infinite`,
        boxShadow: `0 0 ${size * 4}px rgba(0,212,255,0.4)`,
      });
      container.appendChild(p);
    }
  }

  function handleLogin(e) {
    if (e) e.preventDefault();
    const btn = $('#login-btn');
    btn.textContent = 'Authenticating...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Access Granted ✓';
      setTimeout(() => {
        $('#login-page').style.opacity = '0';
        $('#login-page').style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          $('#login-page').classList.add('hidden');
          $('#app-shell').classList.remove('hidden');
          initAppShell();
        }, 500);
      }, 600);
    }, 1200);
  }

  // ══════════════════════════════════════════
  //  APP SHELL
  // ══════════════════════════════════════════
  function initAppShell() {
    renderTopbar();
    renderSidebar();
    setupClock();
    startAlertSimulator();
    setupVoiceButton();
    navigateTo('dashboard');
  }

  function renderTopbar() {
    const tb = $('#topbar');
    if (!tb) return;
    const o = CM_DATA.officer;
    tb.innerHTML = `
      <button class="topbar-toggle" id="sidebar-toggle" title="Toggle Sidebar" aria-label="Toggle sidebar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div class="topbar-search" style="position:relative">
        <svg class="topbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" class="topbar-search-input" id="global-search" placeholder="Search suspects, FIRs, cases, locations…" autocomplete="off">
        <div class="search-dropdown hidden" id="global-search-dropdown"></div>
      </div>
      <div class="topbar-right">
        <div class="topbar-time mono" id="topbar-clock">--:--:--</div>
        <div class="topbar-status">
          <div class="live-dot"></div>
          <span>LIVE</span>
        </div>
        <button class="topbar-btn" id="darkweb-btn" title="Dark Web Monitor" aria-label="Dark Web Monitor">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </button>
        <button class="topbar-btn" id="alerts-topbar-btn" title="Alerts" aria-label="Alerts" style="position:relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="topbar-notif-count" id="notif-count">${state.notifCount}</span>
        </button>
        <button class="topbar-btn" id="voice-topbar-btn" title="Voice Command" aria-label="Voice Command">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </button>
      </div>
    `;
    $('#sidebar-toggle').addEventListener('click', toggleSidebar);
    $('#alerts-topbar-btn').addEventListener('click', () => navigateTo('alerts'));
    setupGlobalSearch();
  }

  function renderSidebar() {
    const sb = $('#sidebar');
    if (!sb) return;
    const o = CM_DATA.officer;
    const navItems = [
      { id: 'dashboard',     icon: gridIcon(),    label: 'Dashboard',     badge: null },
      { id: 'map',           icon: mapIcon(),     label: 'Crime Map',     badge: null },
      { id: 'investigation', icon: searchIcon(),  label: 'Investigation', badge: null },
      { id: 'network',       icon: networkIcon(), label: 'Criminal Network', badge: null },
      { id: 'patrol',        icon: shieldIcon(),  label: 'Patrol Simulator', badge: null },
      { id: 'prediction',    icon: brainIcon(),   label: 'AI Prediction', badge: 'NEW' },
      { id: 'darkweb',       icon: globeIcon(),   label: 'Dark Web Monitor', badge: null },
      { id: 'reports',       icon: fileIcon(),    label: 'Reports',       badge: null },
      { id: 'alerts',        icon: bellIcon(),    label: 'Alert Center',  badge: state.notifCount },
      { id: 'settings',      icon: settingsIcon(),label: 'Settings',      badge: null },
    ];

    sb.innerHTML = `
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div class="flex flex-col sidebar-logo-text">
          <span class="sidebar-logo-name">CrimeMind AI</span>
          <span class="sidebar-logo-tag">v2.4.1 · Classified</span>
        </div>
      </div>
      <nav class="sidebar-nav" aria-label="Main navigation">
        <div class="sidebar-section">INTELLIGENCE</div>
        ${navItems.slice(0,5).map(n => navItemHTML(n)).join('')}
        <div class="sidebar-section" style="margin-top:8px">AI TOOLS</div>
        ${navItems.slice(5,8).map(n => navItemHTML(n)).join('')}
        <div class="sidebar-section" style="margin-top:8px">SYSTEM</div>
        ${navItems.slice(8).map(n => navItemHTML(n)).join('')}
      </nav>
      <div class="sidebar-bottom">
        <div class="sidebar-user" id="sidebar-user-btn">
          <div class="sidebar-avatar">${o.initials}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${o.name}</div>
            <div class="sidebar-user-role">${o.rank}</div>
          </div>
        </div>
      </div>
    `;
    $$('.nav-item').forEach(item => {
      item.addEventListener('click', () => navigateTo(item.dataset.page));
    });
    $('#sidebar-user-btn') && $('#sidebar-user-btn').addEventListener('click', () => navigateTo('settings'));
  }

  function navItemHTML(n) {
    return `
      <div class="nav-item" data-page="${n.id}" id="nav-${n.id}" role="button" tabindex="0" aria-label="${n.label}">
        <span class="nav-icon">${n.icon}</span>
        <span class="nav-label">${n.label}</span>
        ${n.badge ? `<span class="nav-badge">${n.badge}</span>` : ''}
      </div>
    `;
  }

  function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    $('#app-shell').classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
  }

  function setupClock() {
    function tick() {
      const el = $('#topbar-clock');
      if (el) el.textContent = new Date().toLocaleTimeString('en-IN', { hour12: false });
    }
    tick();
    setInterval(tick, 1000);
  }

  // ══════════════════════════════════════════
  //  ROUTER
  // ══════════════════════════════════════════
  function navigateTo(pageId) {
    state.currentPage = pageId;
    // Update nav active state
    $$('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === pageId);
    });
    // Render page
    const main = $('#main-content');
    if (!main) return;
    main.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'page-view page-enter';
    main.appendChild(wrapper);

    const renderers = {
      dashboard:     () => window.renderDashboard(wrapper),
      map:           () => window.renderCrimeMap(wrapper),
      investigation: () => window.renderInvestigation(wrapper),
      network:       () => window.renderNetwork(wrapper),
      patrol:        () => window.renderPatrol(wrapper),
      prediction:    () => window.renderPrediction(wrapper),
      darkweb:       () => window.renderDarkWeb(wrapper),
      reports:       () => window.renderReports(wrapper),
      alerts:        () => window.renderAlerts(wrapper),
      settings:      () => window.renderSettings(wrapper),
    };

    (renderers[pageId] || (() => {}))();
  }

  // ══════════════════════════════════════════
  //  GLOBAL SEARCH
  // ══════════════════════════════════════════
  function setupGlobalSearch() {
    const input = $('#global-search');
    const dropdown = $('#global-search-dropdown');
    if (!input || !dropdown) return;

    const allItems = [
      ...CM_DATA.suspects.map(s => ({ label: s.name, sub: s.alias.join(', '), type: 'Suspect', page: 'investigation', icon: '🕵️' })),
      ...CM_DATA.recentFIRs.map(f => ({ label: f.id, sub: f.type + ' · ' + f.area, type: 'FIR', page: 'investigation', icon: '📋' })),
      ...CM_DATA.hotspots.map(h => ({ label: h.name, sub: h.type, type: 'Location', page: 'map', icon: '📍' })),
      { label: 'Crime Map', sub: 'View interactive GIS map', type: 'Page', page: 'map', icon: '🗺️' },
      { label: 'Alert Center', sub: 'View all alerts', type: 'Page', page: 'alerts', icon: '🔔' },
    ];

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { dropdown.classList.add('hidden'); return; }
      const results = allItems.filter(i => i.label.toLowerCase().includes(q) || (i.sub||'').toLowerCase().includes(q)).slice(0, 6);
      if (!results.length) { dropdown.classList.add('hidden'); return; }
      dropdown.innerHTML = results.map(r => `
        <div class="search-result-item" data-page="${r.page}">
          <span style="font-size:1.2rem">${r.icon}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.85rem;font-weight:500;color:var(--text-primary)">${r.label}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">${r.sub}</div>
          </div>
          <span class="badge badge-muted" style="font-size:0.65rem">${r.type}</span>
        </div>
      `).join('');
      dropdown.classList.remove('hidden');
      $$('.search-result-item', dropdown).forEach(item => {
        item.addEventListener('click', () => {
          navigateTo(item.dataset.page);
          input.value = '';
          dropdown.classList.add('hidden');
        });
      });
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  // ══════════════════════════════════════════
  //  VOICE BUTTON
  // ══════════════════════════════════════════
  function setupVoiceButton() {
    const btn = $('#voice-fab');
    if (!btn) return;
    btn.addEventListener('click', () => {
      state.voiceActive = !state.voiceActive;
      btn.classList.toggle('listening', state.voiceActive);
      const panel = $('#voice-panel');
      if (panel) panel.classList.toggle('hidden', !state.voiceActive);
      if (state.voiceActive) {
        setTimeout(() => {
          const cmd = simulateVoiceCommand();
          if (panel) {
            const el = panel.querySelector('#voice-result');
            if (el) el.textContent = `"${cmd.text}"`;
          }
          setTimeout(() => {
            state.voiceActive = false;
            btn.classList.remove('listening');
            if (panel) panel.classList.add('hidden');
            handleVoiceCommand(cmd);
          }, 1500);
        }, 2000);
      }
    });
  }

  function simulateVoiceCommand() {
    const cmds = [
      { text: 'Show me crimes in Central District', action: 'map' },
      { text: 'Open investigation for Rajan Verma', action: 'investigation' },
      { text: 'Show criminal network', action: 'network' },
      { text: 'Open alert center', action: 'alerts' },
    ];
    return cmds[Math.floor(Math.random() * cmds.length)];
  }

  function handleVoiceCommand(cmd) {
    showToast('Voice Command Executed', `"${cmd.text}"`, 'info');
    navigateTo(cmd.action);
  }

  // ══════════════════════════════════════════
  //  ALERT SIMULATOR
  // ══════════════════════════════════════════
  function startAlertSimulator() {
    const msgs = [
      ['CCTV match detected', 'Face recognition: 91% match near East Gate', 'critical'],
      ['Patrol unit offline', 'Alpha-3 GPS signal lost', 'warning'],
      ['New FIR filed', 'FIR-2024-8823 filed — North District', 'info'],
      ['Repeat offender', 'Known offender Deepak Nair spotted North Station', 'critical'],
    ];
    let i = 0;
    setInterval(() => {
      const m = msgs[i % msgs.length];
      showToast(m[0], m[1], m[2]);
      state.notifCount++;
      const nc = $('#notif-count');
      if (nc) nc.textContent = state.notifCount;
      i++;
    }, 18000);
  }

  // ══════════════════════════════════════════
  //  TOAST NOTIFICATION
  // ══════════════════════════════════════════
  function showToast(title, msg, type = 'info') {
    const container = $('#toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { critical: '🚨', warning: '⚠️', info: 'ℹ️', success: '✓' };
    toast.innerHTML = `
      <span style="font-size:1.2rem;flex-shrink:0">${icons[type]||'ℹ️'}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:0.85rem;font-weight:600;color:var(--text-primary)">${title}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px">${msg}</div>
      </div>
    `;
    container.appendChild(toast);
    toast.addEventListener('click', () => dismiss(toast));
    setTimeout(() => dismiss(toast), 5000);
  }

  function dismiss(toast) {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  }

  // ══════════════════════════════════════════
  //  SVG ICONS
  // ══════════════════════════════════════════
  function gridIcon()    { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`; }
  function mapIcon()     { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`; }
  function searchIcon()  { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`; }
  function networkIcon() { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`; }
  function shieldIcon()  { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`; }
  function brainIcon()   { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>`; }
  function globeIcon()   { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`; }
  function fileIcon()    { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`; }
  function bellIcon()    { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`; }
  function settingsIcon(){ return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`; }

  // Expose helpers
  window.CM_APP = { navigateTo, showToast };
  window.CM_ICONS = { gridIcon, mapIcon, searchIcon, networkIcon, shieldIcon, brainIcon, globeIcon, fileIcon, bellIcon, settingsIcon };

  // Boot
  document.addEventListener('DOMContentLoaded', init);

})();
