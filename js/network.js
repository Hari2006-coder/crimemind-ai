// =============================================
// CRIMEMIND AI — Criminal Network Graph (D3.js)
// =============================================

window.renderNetwork = function (container) {
  container.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Hidden Criminal Network
          <span class="page-title-badge">LIVE GRAPH</span>
        </h1>
        <p class="page-subtitle">Interactive relationship mapping · Click any node to expand connections</p>
      </div>
      <div class="flex gap-sm">
        <button class="btn btn-outline btn-sm" id="reset-graph">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Reset
        </button>
        <button class="btn btn-ghost btn-sm" id="toggle-physics">Pause Physics</button>
      </div>
    </div>

    <div class="network-layout">
      <!-- Graph -->
      <div style="position:relative">
        <svg id="network-graph-svg" aria-label="Criminal network graph"></svg>
        <!-- Legend -->
        <div style="position:absolute;bottom:var(--space-md);left:var(--space-md);z-index:10">
          <div class="glass-card no-hover" style="padding:var(--space-sm) var(--space-md)">
            <div class="node-legend">
              ${Object.entries(nodeColors).map(([type, color]) => `
                <div class="node-legend-item">
                  <div class="node-dot" style="background:${color}"></div>
                  <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Panel -->
      <div class="network-detail-panel">
        <div class="glass-card no-hover" style="margin-bottom:var(--space-md)">
          <h4 style="margin-bottom:var(--space-md);font-size:0.85rem;color:var(--accent-cyan);letter-spacing:0.08em;text-transform:uppercase">Network Stats</h4>
          <div class="flex-between" style="margin-bottom:8px">
            <span style="font-size:0.82rem;color:var(--text-muted)">Total Nodes</span>
            <span style="font-weight:700;color:var(--text-primary)">${CM_DATA.networkNodes.length}</span>
          </div>
          <div class="flex-between" style="margin-bottom:8px">
            <span style="font-size:0.82rem;color:var(--text-muted)">Connections</span>
            <span style="font-weight:700;color:var(--text-primary)">${CM_DATA.networkLinks.length}</span>
          </div>
          <div class="flex-between" style="margin-bottom:8px">
            <span style="font-size:0.82rem;color:var(--text-muted)">High Risk Nodes</span>
            <span style="font-weight:700;color:var(--danger)">${CM_DATA.networkNodes.filter(n=>n.risk==='high').length}</span>
          </div>
          <div class="flex-between">
            <span style="font-size:0.82rem;color:var(--text-muted)">Groups Detected</span>
            <span style="font-weight:700;color:var(--accent-purple)">3</span>
          </div>
        </div>

        <div class="glass-card no-hover" id="node-detail-panel">
          <h4 style="margin-bottom:var(--space-md);font-size:0.85rem;color:var(--accent-cyan);letter-spacing:0.08em;text-transform:uppercase">Node Details</h4>
          <p style="font-size:0.82rem;color:var(--text-muted)">Click any node in the graph to see detailed information about that entity.</p>
        </div>

        <div class="glass-card no-hover" style="margin-top:var(--space-md)">
          <h4 style="margin-bottom:var(--space-md);font-size:0.85rem;color:var(--accent-cyan);letter-spacing:0.08em;text-transform:uppercase">Filter by Type</h4>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm)">
            ${Object.entries(nodeColors).map(([type, color]) => `
              <button class="btn btn-ghost btn-sm type-filter-btn active" data-type="${type}" style="font-size:0.72rem;display:flex;align-items:center;gap:4px">
                <div class="node-dot" style="background:${color};width:8px;height:8px"></div>
                ${type}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('reset-graph').addEventListener('click', () => renderNetwork(container));

  let simPaused = false;
  document.getElementById('toggle-physics').addEventListener('click', function() {
    simPaused = !simPaused;
    if (window._netSimulation) simPaused ? window._netSimulation.stop() : window._netSimulation.restart();
    this.textContent = simPaused ? 'Resume Physics' : 'Pause Physics';
  });

  initD3Network();
};

const nodeColors = {
  suspect:   '#ff3b5c',
  vehicle:   '#ff8c42',
  phone:     '#ffdb58',
  imei:      '#c77dff',
  bank:      '#00e676',
  location:  '#1e90ff',
  weapon:    '#8b0000',
  associate: '#00d4ff',
  gang:      '#ff006e',
};

function initD3Network() {
  const svgEl = document.getElementById('network-graph-svg');
  if (!svgEl || !window.d3) return;

  const width = svgEl.parentElement.clientWidth || 700;
  const height = svgEl.parentElement.clientHeight || 550;
  svgEl.setAttribute('width', width);
  svgEl.setAttribute('height', height);

  const svg = d3.select('#network-graph-svg');
  svg.selectAll('*').remove();

  // Zoom
  const g = svg.append('g');
  svg.call(d3.zoom().scaleExtent([0.3, 3]).on('zoom', e => g.attr('transform', e.transform)));

  // Defs: arrow markers and gradients
  const defs = svg.append('defs');
  Object.entries(nodeColors).forEach(([type, color]) => {
    defs.append('marker')
      .attr('id', `arrow-${type}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', color)
      .attr('opacity', 0.7);
  });

  const nodes = CM_DATA.networkNodes.map(n => ({ ...n }));
  const links = CM_DATA.networkLinks.map(l => ({ ...l }));

  // Simulation
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(90).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-250))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide(28));

  window._netSimulation = simulation;

  // Links
  const link = g.append('g').selectAll('line')
    .data(links).join('line')
    .attr('stroke', d => {
      const targetNode = nodes.find(n => n.id === (d.target.id || d.target));
      return targetNode ? nodeColors[targetNode.type] || '#5a7a95' : '#5a7a95';
    })
    .attr('stroke-opacity', 0.5)
    .attr('stroke-width', 1.5)
    .attr('marker-end', d => {
      const targetNode = nodes.find(n => n.id === (d.target.id || d.target));
      return targetNode ? `url(#arrow-${targetNode.type})` : 'none';
    });

  // Link labels
  const linkLabel = g.append('g').selectAll('text')
    .data(links).join('text')
    .attr('font-size', 9)
    .attr('fill', '#5a7a95')
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Space Grotesk')
    .text(d => d.label);

  // Node groups
  const node = g.append('g').selectAll('g')
    .data(nodes).join('g')
    .attr('class', 'network-node')
    .call(d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded))
    .on('click', (event, d) => showNodeDetail(d, nodes, links));

  // Pulse ring for high risk
  node.filter(d => d.risk === 'high').append('circle')
    .attr('r', 20)
    .attr('fill', 'none')
    .attr('stroke', d => nodeColors[d.type])
    .attr('stroke-opacity', 0.3)
    .attr('stroke-width', 2)
    .style('animation', 'pulse-ring 2s ease-out infinite');

  // Node circles
  node.append('circle')
    .attr('r', d => d.type === 'suspect' || d.type === 'gang' ? 20 : 14)
    .attr('fill', d => nodeColors[d.type] || '#5a7a95')
    .attr('fill-opacity', 0.85)
    .attr('stroke', d => nodeColors[d.type] || '#5a7a95')
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.5)
    .style('filter', d => `drop-shadow(0 0 6px ${nodeColors[d.type] || '#5a7a95'})`);

  // Node icons (emoji)
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', d => d.type === 'suspect' || d.type === 'gang' ? 14 : 10)
    .text(d => nodeEmoji(d.type));

  // Node labels
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', d => (d.type === 'suspect' || d.type === 'gang' ? 28 : 22))
    .attr('fill', '#a8c5da')
    .attr('font-size', 9)
    .attr('font-family', 'Space Grotesk')
    .text(d => d.label.length > 14 ? d.label.slice(0, 14) + '…' : d.label)
    .style('pointer-events', 'none');

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    linkLabel
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2 - 4);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  }
  function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null; d.fy = null;
  }
}

function nodeEmoji(type) {
  const e = { suspect:'👤', vehicle:'🚗', phone:'📱', imei:'📡', bank:'🏦', location:'📍', weapon:'🔫', associate:'👥', gang:'💀' };
  return e[type] || '●';
}

function showNodeDetail(d, nodes, links) {
  const panel = document.getElementById('node-detail-panel');
  if (!panel) return;
  const connected = links.filter(l => (l.source.id || l.source) === d.id || (l.target.id || l.target) === d.id);
  panel.innerHTML = `
    <h4 style="margin-bottom:var(--space-md);font-size:0.85rem;color:var(--accent-cyan);letter-spacing:0.08em;text-transform:uppercase">Node Details</h4>
    <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-md)">
      <div style="width:40px;height:40px;border-radius:50%;background:${nodeColors[d.type]||'#5a7a95'};display:flex;align-items:center;justify-content:center;font-size:1.2rem;box-shadow:0 0 15px ${nodeColors[d.type]||'#5a7a95'}55">
        ${nodeEmoji(d.type)}
      </div>
      <div>
        <div style="font-weight:600;color:var(--text-primary)">${d.label}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);text-transform:capitalize">${d.type}</div>
      </div>
    </div>
    <div style="margin-bottom:var(--space-md)">
      <span class="badge badge-${d.risk==='high'?'danger':d.risk==='medium'?'warning':'success'}">${d.risk?.toUpperCase() || 'UNKNOWN'} RISK</span>
    </div>
    <div class="stat-label" style="margin-bottom:8px">Connections (${connected.length})</div>
    ${connected.map(l => {
      const other = (l.source.id || l.source) === d.id ? (l.target.label || l.target) : (l.source.label || l.source);
      return `<div style="display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--text-secondary);margin-bottom:4px">
        <span style="color:var(--accent-cyan)">→</span>
        <span>${l.label}</span>
        <span style="color:var(--text-muted)">• ${other}</span>
      </div>`;
    }).join('')}
    <button class="btn btn-outline btn-sm btn-full" style="margin-top:var(--space-md)" onclick="CM_APP.navigateTo('investigation')">
      Open Investigation →
    </button>
  `;
}
