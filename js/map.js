// =============================================
// CRIMEMIND AI — Crime Map Page
// =============================================

let leafletMap = null;
let heatmapLayer = null;
let mapLayers = {};
let activeHotspot = null;

window.renderCrimeMap = function (container) {
  container.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
          Live Crime Intelligence Map
          <span class="page-title-badge">LIVE GIS</span>
        </h1>
        <p class="page-subtitle">Real-time hotspot tracking · ${CM_DATA.hotspots.length} active zones · ${CM_DATA.policeStations.length} stations online</p>
      </div>
    </div>

    <div class="map-page-layout">
      <!-- Filters Panel -->
      <div class="map-filters-panel">
        <div class="glass-card no-hover">
          <h4 style="margin-bottom:var(--space-md);color:var(--accent-cyan);font-size:0.85rem;letter-spacing:0.08em;text-transform:uppercase">Filters</h4>
          <div class="form-group">
            <label class="form-label">Crime Type</label>
            <select class="select-custom" style="width:100%" id="map-crime-type">
              <option value="all">All Types</option>
              ${CM_DATA.crimeTypes.map(t=>`<option value="${t.type}">${t.type}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">District</label>
            <select class="select-custom" style="width:100%" id="map-district">
              <option value="all">All Districts</option>
              ${CM_DATA.districts.map(d=>`<option value="${d}">${d}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Risk Level</label>
            <div class="flex gap-sm" style="flex-wrap:wrap">
              <label style="display:flex;align-items:center;gap:6px;font-size:0.8rem;cursor:pointer">
                <input type="checkbox" checked id="filter-high" style="accent-color:var(--danger)"> 
                <span style="color:var(--danger)">● High</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;font-size:0.8rem;cursor:pointer">
                <input type="checkbox" checked id="filter-med" style="accent-color:var(--warning)"> 
                <span style="color:var(--warning)">● Medium</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;font-size:0.8rem;cursor:pointer">
                <input type="checkbox" checked id="filter-low" style="accent-color:var(--success)"> 
                <span style="color:var(--success)">● Safe</span>
              </label>
            </div>
          </div>
          <button class="btn btn-primary btn-full" id="apply-filters" style="margin-top:var(--space-sm)">Apply Filters</button>
        </div>

        <!-- Layer Controls -->
        <div class="glass-card no-hover">
          <h4 style="margin-bottom:var(--space-md);color:var(--accent-cyan);font-size:0.85rem;letter-spacing:0.08em;text-transform:uppercase">Map Layers</h4>
          ${[
            { id:'layer-hotspots', label:'Crime Hotspots', default:true },
            { id:'layer-heatmap', label:'Heatmap', default:false },
            { id:'layer-stations', label:'Police Stations', default:true },
            { id:'layer-cctv', label:'CCTV Cameras', default:true },
            { id:'layer-patrol', label:'Patrol Vehicles', default:true },
          ].map(l => `
            <div class="settings-row" style="padding:8px 0">
              <div>
                <div class="settings-row-label" style="font-size:0.82rem">${l.label}</div>
              </div>
              <label class="toggle">
                <input type="checkbox" id="${l.id}" ${l.default?'checked':''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          `).join('')}
        </div>

        <!-- Stats -->
        <div class="glass-card no-hover">
          <h4 style="margin-bottom:var(--space-md);color:var(--accent-cyan);font-size:0.85rem;letter-spacing:0.08em;text-transform:uppercase">Zone Summary</h4>
          <div class="flex gap-md" style="flex-direction:column">
            <div class="flex-between">
              <span style="font-size:0.8rem;color:var(--danger)">● High Risk</span>
              <span style="font-weight:700;color:var(--danger)">${CM_DATA.hotspots.filter(h=>h.risk==='high').length} zones</span>
            </div>
            <div class="flex-between">
              <span style="font-size:0.8rem;color:var(--warning)">● Medium Risk</span>
              <span style="font-weight:700;color:var(--warning)">${CM_DATA.hotspots.filter(h=>h.risk==='medium').length} zones</span>
            </div>
            <div class="flex-between">
              <span style="font-size:0.8rem;color:var(--success)">● Safe Zones</span>
              <span style="font-weight:700;color:var(--success)">${CM_DATA.hotspots.filter(h=>h.risk==='low').length} zones</span>
            </div>
            <div class="progress-bar-wrap" style="margin-top:var(--space-sm)">
              <div class="progress-bar danger" style="width:${Math.round(CM_DATA.hotspots.filter(h=>h.risk==='high').length/CM_DATA.hotspots.length*100)}%"></div>
            </div>
            <p style="font-size:0.75rem;color:var(--text-muted)">${Math.round(CM_DATA.hotspots.filter(h=>h.risk==='high').length/CM_DATA.hotspots.length*100)}% of zones are high risk</p>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="map-container" style="position:relative">
        <div id="leaflet-map"></div>

        <!-- Map stats bar -->
        <div class="map-stats-bar">
          <div class="map-stat-pill"><div class="live-dot"></div><span style="color:var(--text-primary)">Live</span></div>
          <div class="map-stat-pill"><span style="color:var(--danger)">●</span><span>${CM_DATA.hotspots.filter(h=>h.risk==='high').length} High Risk</span></div>
          <div class="map-stat-pill"><span style="color:var(--warning)">●</span><span>${CM_DATA.hotspots.filter(h=>h.risk==='medium').length} Medium</span></div>
        </div>

        <!-- Hotspot popup panel -->
        <div class="hotspot-popup" id="hotspot-popup">
          <div class="flex-between" style="margin-bottom:var(--space-md)">
            <h3 id="popup-name" style="font-size:1rem">Zone Details</h3>
            <div style="display:flex;gap:var(--space-sm)">
              <button class="btn btn-primary btn-sm" onclick="CM_APP.navigateTo('investigation')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                Investigate
              </button>
              <button class="btn btn-ghost btn-sm" onclick="document.getElementById('hotspot-popup').classList.remove('open')">✕</button>
            </div>
          </div>
          <div class="grid-3" style="gap:var(--space-md)">
            <div><div class="stat-label">Crimes Reported</div><div id="popup-crimes" style="font-size:1.5rem;font-weight:700;color:var(--danger)">-</div></div>
            <div><div class="stat-label">Crime Type</div><div id="popup-type" style="font-size:0.9rem;font-weight:600;color:var(--text-primary)">-</div></div>
            <div><div class="stat-label">Risk Level</div><div id="popup-risk" style="font-size:0.9rem;font-weight:600">-</div></div>
          </div>
          <div style="margin-top:var(--space-md)">
            <div class="stat-label">AI Analysis</div>
            <p id="popup-ai" style="font-size:0.82rem;color:var(--text-secondary);margin-top:4px">-</p>
          </div>
        </div>
      </div>
    </div>
  `;

  initLeafletMap();
};

function initLeafletMap() {
  const mapEl = document.getElementById('leaflet-map');
  if (!mapEl) return;

  // Cleanup old instance
  if (leafletMap) { leafletMap.remove(); leafletMap = null; }

  leafletMap = L.map('leaflet-map', {
    center: [19.076, 72.877],
    zoom: 14,
    zoomControl: false,
    attributionControl: false,
  });

  // Dark tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '©OpenStreetMap ©CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(leafletMap);

  // Custom zoom control
  L.control.zoom({ position: 'topright' }).addTo(leafletMap);

  addHotspots();
  addPoliceStations();
  addCCTVMarkers();
  addPatrolVehicles();

  // Layer toggles
  ['layer-hotspots','layer-stations','layer-cctv','layer-patrol','layer-heatmap'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', updateMapLayers);
  });

  document.getElementById('apply-filters') && document.getElementById('apply-filters').addEventListener('click', () => {
    addHotspots();
  });
}

function addHotspots() {
  if (mapLayers.hotspots) mapLayers.hotspots.forEach(l => leafletMap.removeLayer(l));
  mapLayers.hotspots = [];

  const colorMap = { high: '#ff3b5c', medium: '#ffb020', low: '#00e676' };
  const showHigh = document.getElementById('filter-high')?.checked ?? true;
  const showMed  = document.getElementById('filter-med')?.checked ?? true;
  const showLow  = document.getElementById('filter-low')?.checked ?? true;
  const typeFilter = document.getElementById('map-crime-type')?.value || 'all';
  const distFilter = document.getElementById('map-district')?.value || 'all';

  CM_DATA.hotspots.forEach(hs => {
    if (hs.risk === 'high' && !showHigh) return;
    if (hs.risk === 'medium' && !showMed) return;
    if (hs.risk === 'low' && !showLow) return;
    if (distFilter !== 'all' && hs.district !== distFilter) return;
    if (typeFilter !== 'all' && !hs.type.includes(typeFilter)) return;

    const color = colorMap[hs.risk];
    const radius = hs.risk === 'high' ? 220 : hs.risk === 'medium' ? 160 : 100;

    const circle = L.circle([hs.lat, hs.lng], {
      radius,
      color,
      fillColor: color,
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(leafletMap);

    const pulseDot = L.circleMarker([hs.lat, hs.lng], {
      radius: 8,
      color: 'transparent',
      fillColor: color,
      fillOpacity: 0.9,
      weight: 0,
    }).addTo(leafletMap);

    circle.on('click', () => showHotspotPopup(hs));
    pulseDot.on('click', () => showHotspotPopup(hs));

    const label = L.divIcon({
      html: `<div style="background:rgba(5,11,24,0.85);border:1px solid ${color};border-radius:6px;padding:3px 8px;font-size:0.7rem;font-family:Space Grotesk,sans-serif;color:${color};white-space:nowrap;font-weight:600;backdrop-filter:blur(8px)">${hs.name}</div>`,
      className: '',
      iconAnchor: [0, 0],
    });
    const labelMarker = L.marker([hs.lat + 0.001, hs.lng], { icon: label }).addTo(leafletMap);

    mapLayers.hotspots.push(circle, pulseDot, labelMarker);
  });
}

function addPoliceStations() {
  mapLayers.stations = [];
  CM_DATA.policeStations.forEach(ps => {
    const icon = L.divIcon({
      html: `<div style="background:rgba(30,144,255,0.9);border:2px solid white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 12px rgba(30,144,255,0.6)">🏛️</div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    const m = L.marker([ps.lat, ps.lng], { icon })
      .addTo(leafletMap)
      .bindPopup(`<b style="color:#1e90ff">${ps.name}</b><br>${ps.officers} officers on duty`);
    mapLayers.stations.push(m);
  });
}

function addCCTVMarkers() {
  mapLayers.cctv = [];
  const cctvPositions = [
    [19.074, 72.872],[19.080, 72.868],[19.068, 72.892],
    [19.088, 72.858],[19.077, 72.883],[19.063, 72.907],
    [19.094, 72.876],[19.071, 72.864],[19.085, 72.895],
  ];
  cctvPositions.forEach(pos => {
    const icon = L.divIcon({
      html: `<div title="CCTV Camera" style="background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.5);border-radius:4px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px;cursor:pointer">📷</div>`,
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    const m = L.marker(pos, { icon }).addTo(leafletMap).bindPopup('Active CCTV Camera<br><span style="color:#00d4ff">Online · HD · Night Vision</span>');
    mapLayers.cctv.push(m);
  });
}

function addPatrolVehicles() {
  mapLayers.patrol = [];
  CM_DATA.patrolData.units.slice(0, 4).forEach((unit, i) => {
    const icon = L.divIcon({
      html: `<div style="background:rgba(0,230,118,0.9);border:2px solid white;border-radius:4px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 0 10px rgba(0,230,118,0.5);animation:nodeFloat ${2+i*0.3}s ease infinite">🚔</div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    const lat = unit.lat + (Math.random() * 0.004 - 0.002);
    const lng = unit.lng + (Math.random() * 0.004 - 0.002);
    const m = L.marker([lat, lng], { icon }).addTo(leafletMap).bindPopup(`<b style="color:#00e676">${unit.name}</b><br>${unit.officers} officers · ${unit.status}`);
    mapLayers.patrol.push(m);
  });
}

function showHotspotPopup(hs) {
  const popup = document.getElementById('hotspot-popup');
  if (!popup) return;
  document.getElementById('popup-name').textContent = hs.name;
  document.getElementById('popup-crimes').textContent = hs.crimes;
  document.getElementById('popup-type').textContent = hs.type;
  const riskEl = document.getElementById('popup-risk');
  riskEl.textContent = hs.risk.charAt(0).toUpperCase() + hs.risk.slice(1);
  riskEl.style.color = hs.risk === 'high' ? 'var(--danger)' : hs.risk === 'medium' ? 'var(--warning)' : 'var(--success)';
  document.getElementById('popup-ai').textContent =
    hs.risk === 'high'
      ? `AI Alert: Recommend deploying 2 additional patrol units immediately. Crime probability next hour: 87%. Gang activity suspected.`
      : hs.risk === 'medium'
      ? `AI Analysis: Moderate risk. Increased surveillance recommended. Pattern matches historical weekend spike.`
      : `AI Analysis: Currently safe zone. Maintain standard patrol. No anomalies detected.`;
  popup.classList.add('open');
}

function updateMapLayers() {
  const showHotspots = document.getElementById('layer-hotspots')?.checked;
  const showStations = document.getElementById('layer-stations')?.checked;
  const showCCTV     = document.getElementById('layer-cctv')?.checked;
  const showPatrol   = document.getElementById('layer-patrol')?.checked;

  const toggleLayer = (key, show) => {
    if (!mapLayers[key] || !leafletMap) return;
    mapLayers[key].forEach(l => show ? leafletMap.addLayer(l) : leafletMap.removeLayer(l));
  };

  toggleLayer('hotspots', showHotspots);
  toggleLayer('stations', showStations);
  toggleLayer('cctv', showCCTV);
  toggleLayer('patrol', showPatrol);
}
