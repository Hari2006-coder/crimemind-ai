// =============================================
// CRIMEMIND AI — Mock Data Layer
// =============================================

const CM_DATA = {

  officer: {
    name: 'Supt. Arjun Mehta',
    badge: 'IPS-2024-D7',
    rank: 'Superintendent',
    dept: 'Cyber Crime & Intel Division',
    initials: 'AM',
    district: 'Central',
    shift: 'Alpha',
  },

  crimeStats: {
    total: 18472,
    today: 34,
    highRisk: 7,
    repeatOffenders: 142,
    pending: 286,
    trends: {
      total: +3.2,
      today: -8.1,
      highRisk: +1.4,
      repeatOffenders: +5.6,
      pending: -2.3,
    }
  },

  // Last 30 days crime count per day
  trendData: [42,38,51,45,62,38,29,44,58,61,48,52,39,47,63,55,42,36,49,57,44,38,51,66,52,41,47,34,38,34],

  districts: ['Central', 'North', 'South', 'East', 'West', 'Harbour'],
  districtCrimes: [312, 198, 256, 287, 178, 143],
  districtRisk: [85, 52, 67, 74, 43, 38],

  crimeTypes: [
    { type: 'Theft', count: 4231, color: '#ff3b5c' },
    { type: 'Assault', count: 2876, color: '#ffb020' },
    { type: 'Fraud', count: 3145, color: '#1e90ff' },
    { type: 'Burglary', count: 1987, color: '#8b5cf6' },
    { type: 'Cyber Crime', count: 2654, color: '#00d4ff' },
    { type: 'Drug Offense', count: 1432, color: '#00e676' },
    { type: 'Others', count: 2147, color: '#5a7a95' },
  ],

  hotspots: [
    { id: 'HS001', lat: 19.076, lng: 72.877, name: 'Market Road Junction', risk: 'high', crimes: 47, type: 'Theft/Assault', district: 'Central' },
    { id: 'HS002', lat: 19.083, lng: 72.868, name: 'Station Area North', risk: 'high', crimes: 38, type: 'Pickpocketing', district: 'North' },
    { id: 'HS003', lat: 19.069, lng: 72.895, name: 'East Harbour Zone', risk: 'medium', crimes: 22, type: 'Drug Offense', district: 'East' },
    { id: 'HS004', lat: 19.091, lng: 72.854, name: 'Old Town Square', risk: 'medium', crimes: 18, type: 'Fraud', district: 'West' },
    { id: 'HS005', lat: 19.058, lng: 72.861, name: 'Tech Park Perimeter', risk: 'low', crimes: 9, type: 'Cyber Crime', district: 'South' },
    { id: 'HS006', lat: 19.080, lng: 72.840, name: 'Residential Block C', risk: 'low', crimes: 5, type: 'Burglary', district: 'West' },
    { id: 'HS007', lat: 19.062, lng: 72.905, name: 'Industrial Zone 4', risk: 'high', crimes: 41, type: 'Vehicle Theft', district: 'East' },
    { id: 'HS008', lat: 19.099, lng: 72.875, name: 'Night Market District', risk: 'medium', crimes: 25, type: 'Robbery', district: 'North' },
  ],

  policeStations: [
    { lat: 19.074, lng: 72.870, name: 'Central PS', officers: 45 },
    { lat: 19.086, lng: 72.856, name: 'West PS', officers: 32 },
    { lat: 19.065, lng: 72.898, name: 'East Harbour PS', officers: 28 },
    { lat: 19.093, lng: 72.880, name: 'North PS', officers: 38 },
  ],

  suspects: [
    {
      id: 'SUS001',
      name: 'Rajan Verma',
      alias: ['Raja', 'The Fox'],
      age: 34,
      photo: '🕵️',
      risk: 'high',
      priors: 7,
      gang: 'Ghost Network',
      lastSeen: 'Market Road, 20:30',
      modus: 'Distraction Theft, Armed Robbery',
      associates: ['SUS002', 'SUS004', 'SUS007'],
      timeline: [
        { time: '19:45', event: 'Spotted near Bus Terminus', type: 'cctv', color: 'info', desc: 'Camera ID: CC-047, face matched 94.2%' },
        { time: '20:10', event: 'Entered Market Road', type: 'cctv', color: 'info', desc: 'Walked with 2 associates' },
        { time: '20:16', event: 'CCTV Coverage Lost', type: 'phone', color: 'warning', desc: 'Moved into blind spot, possible deliberate evasion' },
        { time: '20:21', event: 'Phone Switched Off', type: 'phone', color: 'danger', desc: 'IMEI: 35842309182734 — last tower: MR-Cell-Tower-12' },
        { time: '20:30', event: 'ATM Withdrawal – ₹18,000', type: 'bank', color: 'warning', desc: 'SBI ATM ID: MB-4421, using stolen card' },
        { time: '20:38', event: 'Victim Reports Robbery', type: 'alert', color: 'danger', desc: 'FIR#2024-CR-8821 filed' },
        { time: '20:45', event: 'Escape Route: North Highway', type: 'prediction', color: 'purple', desc: 'AI Predicted — 87% confidence' },
      ],
      confidence: 94,
      nextMove: 'Likely to cross district boundary via NH-8 within 2 hours',
    },
    {
      id: 'SUS002',
      name: 'Priya Shankar',
      alias: ['Shadow', 'P'],
      age: 28,
      photo: '🕵️‍♀️',
      risk: 'medium',
      priors: 3,
      gang: 'Ghost Network',
      lastSeen: 'East Harbour, 18:15',
      modus: 'Cyber Fraud, SIM Swap',
      associates: ['SUS001', 'SUS003'],
      timeline: [
        { time: '15:30', event: 'Accessed Dark Web Forum', type: 'cyber', color: 'purple', desc: 'IP traced via VPN chain — origin: East District' },
        { time: '16:45', event: 'SIM Swap Request Made', type: 'phone', color: 'warning', desc: 'Telecom provider alerted — blocked' },
        { time: '18:10', event: 'Spotted at Café Connect', type: 'cctv', color: 'info', desc: 'CCTV match 88.7%' },
        { time: '18:15', event: 'Left in auto-rickshaw', type: 'cctv', color: 'info', desc: 'Vehicle: MH-02-AB-7891' },
        { time: '18:30', event: 'Unknown destination', type: 'prediction', color: 'purple', desc: 'AI Prediction: East Harbour safehouse — 72% confidence' },
      ],
      confidence: 78,
      nextMove: 'Likely accessing another cyber terminal within 4 hours',
    },
    {
      id: 'SUS003',
      name: 'Deepak Nair',
      alias: ['Thunder'],
      age: 41,
      photo: '🧔',
      risk: 'high',
      priors: 12,
      gang: 'Iron Circle',
      lastSeen: 'North Station, 21:00',
      modus: 'Narcotics Distribution, Extortion',
      associates: ['SUS005', 'SUS006'],
      timeline: [
        { time: '14:00', event: 'Meeting at Warehouse 7', type: 'intel', color: 'danger', desc: 'Confidential informant report' },
        { time: '16:30', event: 'Drug handoff observed', type: 'intel', color: 'danger', desc: 'Package transferred — 3 persons involved' },
        { time: '19:15', event: 'Vehicle switched', type: 'cctv', color: 'warning', desc: 'White Innova → Black Scorpio' },
        { time: '21:00', event: 'Spotted North Station', type: 'cctv', color: 'info', desc: 'Camera ID: NT-011' },
        { time: '21:20', event: 'AI Escape Prediction', type: 'prediction', color: 'purple', desc: 'Train departure in 40 mins — 91% confidence' },
      ],
      confidence: 91,
      nextMove: 'High probability of rail escape — intercept North Station Platform 3',
    },
  ],

  networkNodes: [
    { id: 'N1',  label: 'Rajan Verma',     type: 'suspect',  group: 1, risk: 'high' },
    { id: 'N2',  label: 'Priya Shankar',   type: 'suspect',  group: 1, risk: 'medium' },
    { id: 'N3',  label: 'Deepak Nair',     type: 'suspect',  group: 2, risk: 'high' },
    { id: 'N4',  label: 'MH02-AB-7891',    type: 'vehicle',  group: 1, risk: 'medium' },
    { id: 'N5',  label: '+91-98XXXXXXX2',  type: 'phone',    group: 1, risk: 'high' },
    { id: 'N6',  label: 'IMEI:358423XX',   type: 'imei',     group: 1, risk: 'high' },
    { id: 'N7',  label: 'A/C: 4921XXXX',   type: 'bank',     group: 1, risk: 'medium' },
    { id: 'N8',  label: 'Market Road',     type: 'location', group: 1, risk: 'high' },
    { id: 'N9',  label: 'Safehouse East',  type: 'location', group: 2, risk: 'medium' },
    { id: 'N10', label: '9mm Pistol',      type: 'weapon',   group: 2, risk: 'high' },
    { id: 'N11', label: 'Manoj Kumar',     type: 'associate',group: 3, risk: 'low' },
    { id: 'N12', label: '+91-87XXXXXXX5',  type: 'phone',    group: 2, risk: 'medium' },
    { id: 'N13', label: 'DL-01-CX-4421',   type: 'vehicle',  group: 2, risk: 'medium' },
    { id: 'N14', label: 'Warehouse 7',     type: 'location', group: 2, risk: 'high' },
    { id: 'N15', label: 'Iron Circle Gang',type: 'gang',     group: 2, risk: 'high' },
  ],

  networkLinks: [
    { source: 'N1', target: 'N2', label: 'associate' },
    { source: 'N1', target: 'N4', label: 'uses' },
    { source: 'N1', target: 'N5', label: 'calls' },
    { source: 'N1', target: 'N6', label: 'device' },
    { source: 'N1', target: 'N7', label: 'withdrawals' },
    { source: 'N1', target: 'N8', label: 'last seen' },
    { source: 'N2', target: 'N5', label: 'calls' },
    { source: 'N2', target: 'N9', label: 'frequents' },
    { source: 'N3', target: 'N9', label: 'uses' },
    { source: 'N3', target: 'N10', label: 'possesses' },
    { source: 'N3', target: 'N12', label: 'calls' },
    { source: 'N3', target: 'N13', label: 'uses' },
    { source: 'N3', target: 'N14', label: 'operates' },
    { source: 'N3', target: 'N15', label: 'member of' },
    { source: 'N11', target: 'N3', label: 'associate' },
    { source: 'N11', target: 'N1', label: 'associate' },
    { source: 'N4', target: 'N8', label: 'spotted at' },
    { source: 'N13', target: 'N14', label: 'seen near' },
  ],

  alerts: [
    { id: 'ALT001', time: '2 min ago',  severity: 'critical', category: 'Crime Spike',       title: 'Crime Spike Detected — Central District',     desc: '14 incidents reported in last 60 minutes. Unusual cluster near Market Road.', icon: '🚨' },
    { id: 'ALT002', time: '8 min ago',  severity: 'high',     category: 'Repeat Offender',   title: 'Repeat Offender Entered District',              desc: 'Rajan Verma (7 priors) detected via CCTV near North Station.', icon: '⚠️' },
    { id: 'ALT003', time: '15 min ago', severity: 'high',     category: 'Vehicle Alert',     title: 'Blacklisted Vehicle Spotted',                   desc: 'MH-02-AB-7891 — linked to 3 open cases. Last seen: South Expressway.', icon: '🚗' },
    { id: 'ALT004', time: '23 min ago', severity: 'critical', category: 'Gang Activity',     title: 'Gang Activity: Iron Circle Moving',             desc: 'Intelligence report: Iron Circle gang members regrouping in East Harbour zone.', icon: '👥' },
    { id: 'ALT005', time: '31 min ago', severity: 'medium',   category: 'Cyber',             title: 'Dark Web Chatter Spike',                        desc: 'Mention of "Central District operation" detected on dark web forum TOR-7XK.', icon: '🌐' },
    { id: 'ALT006', time: '45 min ago', severity: 'medium',   category: 'Suspicious',        title: 'Suspicious Activity: Industrial Zone',          desc: 'Thermal drone scan detected 8 persons in closed warehouse after hours.', icon: '🔍' },
    { id: 'ALT007', time: '1 hr ago',   severity: 'high',     category: 'Missing Person',    title: 'Missing Person Alert Escalated',               desc: 'Case #MP-2024-334: No contact for 18 hours. Last location: West Market.', icon: '🔔' },
    { id: 'ALT008', time: '2 hr ago',   severity: 'medium',   category: 'Crime Spike',       title: 'Unusual ATM Activity Pattern',                 desc: '11 transactions in 30 min from cards reported stolen last week.', icon: '💳' },
  ],

  recentFIRs: [
    { id: 'FIR-2024-8821', date: '20 Jul', type: 'Robbery',      area: 'Market Road',    status: 'active',    officer: 'SI Patel' },
    { id: 'FIR-2024-8819', date: '20 Jul', type: 'Cyber Fraud',  area: 'East Harbour',   status: 'under_inv', officer: 'SI Sharma' },
    { id: 'FIR-2024-8812', date: '19 Jul', type: 'Vehicle Theft',area: 'Industrial 4',   status: 'active',    officer: 'SI Gupta' },
    { id: 'FIR-2024-8804', date: '19 Jul', type: 'Assault',      area: 'Night Market',   status: 'closed',    officer: 'SI Kumar' },
    { id: 'FIR-2024-8798', date: '18 Jul', type: 'Drug Offense', area: 'North Station',  status: 'under_inv', officer: 'SI Nair' },
    { id: 'FIR-2024-8790', date: '18 Jul', type: 'Burglary',     area: 'Residential C',  status: 'closed',    officer: 'SI Joshi' },
  ],

  darkwebFeeds: [
    { time: '14:32', text: '"Central operation at 2200hrs confirmed"', source: 'TOR-7XK', risk: 'critical' },
    { time: '11:18', text: '"Market district product available — 50 units"', source: 'Forum-Dark9', risk: 'high' },
    { time: '09:47', text: '"Need clean plates for 3 vehicles, MH registration"', source: 'Telegram-Ghost', risk: 'medium' },
    { time: '07:22', text: '"Looking for a clean ID for Deepak — urgent"', source: 'TOR-7XK', risk: 'high' },
  ],

  predictionData: {
    nextHour: [
      { time: '15:00–16:00', area: 'Market Road', type: 'Theft', probability: 87, risk: 'high' },
      { time: '15:30–16:30', area: 'North Station', type: 'Robbery', probability: 72, risk: 'high' },
      { time: '16:00–17:00', area: 'Industrial Zone 4', type: 'Vehicle Theft', probability: 64, risk: 'medium' },
      { time: '17:00–18:00', area: 'East Harbour', type: 'Drug Offense', probability: 58, risk: 'medium' },
      { time: '19:00–20:00', area: 'Night Market', type: 'Assault', probability: 79, risk: 'high' },
    ],
  },

  patrolData: {
    units: [
      { id: 'P1', name: 'Alpha-1', district: 'Central', officers: 4, status: 'active', lat: 19.074, lng: 72.870 },
      { id: 'P2', name: 'Alpha-2', district: 'Central', officers: 3, status: 'active', lat: 19.079, lng: 72.875 },
      { id: 'P3', name: 'Beta-1',  district: 'North',   officers: 4, status: 'active', lat: 19.086, lng: 72.856 },
      { id: 'P4', name: 'Beta-2',  district: 'North',   officers: 3, status: 'standby', lat: 19.093, lng: 72.880 },
      { id: 'P5', name: 'Gamma-1', district: 'East',    officers: 4, status: 'active', lat: 19.065, lng: 72.898 },
      { id: 'P6', name: 'Delta-1', district: 'West',    officers: 3, status: 'active', lat: 19.091, lng: 72.854 },
    ],
    metrics: {
      before: { riskCoverage: 62, areaCoverage: 71, responseTime: 8.4 },
      after:  { riskCoverage: 89, areaCoverage: 85, responseTime: 4.2 },
    }
  },

  systemLogs: [
    { time: '14:20:11', level: 'INFO',  msg: 'AI Engine: Suspect pattern match completed — Rajan Verma' },
    { time: '14:18:44', level: 'WARN',  msg: 'Dark web monitor: New mention of "Central operation"' },
    { time: '14:15:02', level: 'INFO',  msg: 'CCTV feed synced: 847 cameras online (4 offline)' },
    { time: '14:10:29', level: 'ERROR', msg: 'Patrol unit Alpha-2: GPS signal lost for 3 minutes' },
    { time: '14:07:18', level: 'INFO',  msg: 'FIR-2024-8821 updated: witness statement added' },
    { time: '13:55:00', level: 'INFO',  msg: 'AI Patrol Optimizer: Route recalculation complete' },
    { time: '13:42:33', level: 'WARN',  msg: 'Biometric match: partial match (67%) on Gate-12 CCTV' },
    { time: '13:30:05', level: 'INFO',  msg: 'System backup completed. 98.4% data integrity confirmed' },
  ],
};

window.CM_DATA = CM_DATA;
