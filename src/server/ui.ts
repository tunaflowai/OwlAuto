import { OWL_LOGO_SVG } from './assets';

/**
 * Dashboard CSS — black-brown gradient owl theme.
 * Variables centralise the palette so the whole UI stays cohesive.
 */
export const DASHBOARD_CSS = `
:root {
  --owl-black: #0a0604;
  --owl-deep:  #14100c;
  --owl-brown: #2b1d12;
  --owl-bark:  #4a3120;
  --owl-amber: #d4a04c;
  --owl-glow:  #fde29a;
  --owl-cream: #e8d9c0;
  --owl-muted: #a08a72;
  --owl-danger:#c95a3a;
  --owl-ok:    #6fae6a;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, Segoe UI, sans-serif;
  color: var(--owl-cream);
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(212,160,76,0.08), transparent 60%),
    radial-gradient(900px 500px at 110% 110%, rgba(212,160,76,0.06), transparent 60%),
    linear-gradient(135deg, var(--owl-black) 0%, var(--owl-brown) 50%, var(--owl-bark) 100%) fixed;
}

.navbar-owl {
  background: linear-gradient(90deg, rgba(10,6,4,0.95) 0%, rgba(43,29,18,0.85) 100%) !important;
  border-bottom: 1px solid rgba(212,160,76,0.25);
  backdrop-filter: blur(10px);
}
.navbar-owl .navbar-brand {
  color: var(--owl-cream);
  font-weight: 700;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.navbar-owl .navbar-brand svg { width: 36px; height: 36px; }
.navbar-owl .badge-version {
  background: rgba(212,160,76,0.15);
  color: var(--owl-amber);
  border: 1px solid rgba(212,160,76,0.3);
  font-size: 0.7rem;
}

.card-owl {
  background: linear-gradient(160deg, rgba(20,16,12,0.92) 0%, rgba(43,29,18,0.55) 100%);
  border: 1px solid rgba(212,160,76,0.2);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.45);
  color: var(--owl-cream);
}
.card-owl .card-header {
  background: transparent;
  border-bottom: 1px solid rgba(212,160,76,0.18);
  color: var(--owl-amber);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.85rem;
}
.card-owl .card-body { color: var(--owl-cream); }

.btn-owl {
  background: linear-gradient(135deg, var(--owl-amber) 0%, #8a5a1f 100%);
  color: #1a110a;
  border: none;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.btn-owl:hover { filter: brightness(1.1); color: #0a0604; }
.btn-owl-ghost {
  background: transparent;
  color: var(--owl-amber);
  border: 1px solid rgba(212,160,76,0.4);
}
.btn-owl-ghost:hover { background: rgba(212,160,76,0.1); color: var(--owl-glow); }
.btn-owl-danger {
  background: linear-gradient(135deg, #c95a3a 0%, #6e2a16 100%);
  color: #fff8e0;
  border: none;
}

.form-control-owl, .form-select-owl {
  background: rgba(10,6,4,0.7);
  color: var(--owl-cream);
  border: 1px solid rgba(212,160,76,0.25);
}
.form-control-owl:focus, .form-select-owl:focus {
  background: rgba(10,6,4,0.85);
  color: var(--owl-cream);
  border-color: var(--owl-amber);
  box-shadow: 0 0 0 0.2rem rgba(212,160,76,0.2);
}

.list-owl li {
  list-style: none;
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid rgba(212,160,76,0.1);
  display: flex; justify-content: space-between; align-items: center;
}
.list-owl { padding: 0; margin: 0; }
.list-owl li:last-child { border-bottom: none; }
.muted { color: var(--owl-muted); }
.pill {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}
.pill-on  { background: rgba(111,174,106,0.18); color: var(--owl-ok);     border: 1px solid rgba(111,174,106,0.4); }
.pill-off { background: rgba(160,138,114,0.15); color: var(--owl-muted);  border: 1px solid rgba(160,138,114,0.3); }
.pill-amber { background: rgba(212,160,76,0.15); color: var(--owl-amber); border: 1px solid rgba(212,160,76,0.35); }

.log-stream {
  background: #08050300;
  border: 1px solid rgba(212,160,76,0.18);
  border-radius: 10px;
  padding: 0.75rem;
  font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace;
  font-size: 0.78rem;
  height: 360px;
  overflow-y: auto;
  white-space: pre-wrap;
}
.log-line { padding: 2px 0; }
.log-INFO  { color: var(--owl-cream); }
.log-DEBUG { color: var(--owl-muted); }
.log-WARN  { color: #f0c674; }
.log-ERROR { color: var(--owl-danger); }

.section-title {
  color: var(--owl-amber);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78rem;
  margin: 1.5rem 0 0.5rem;
}

.hero {
  display: flex; align-items: center; gap: 1.25rem;
  padding: 1.25rem 0 1.75rem;
}
.hero svg { width: 76px; height: 76px; filter: drop-shadow(0 4px 14px rgba(212,160,76,0.35)); }
.hero h1 {
  font-size: 1.9rem; margin: 0;
  background: linear-gradient(90deg, var(--owl-glow), var(--owl-amber) 60%, var(--owl-bark));
  -webkit-background-clip: text; background-clip: text;
  color: transparent; font-weight: 800;
}
.hero p { margin: 0; color: var(--owl-muted); }

.toast-owl {
  position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 1080;
  background: linear-gradient(135deg, rgba(43,29,18,0.95), rgba(10,6,4,0.95));
  color: var(--owl-cream);
  border: 1px solid rgba(212,160,76,0.4);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  display: none;
}
`;

/**
 * Frontend control script — vanilla JS, no bundler.
 * All control functions wire to the REST endpoints exposed by OwlAutoServer.
 */
export const DASHBOARD_JS = `
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const api = async (path, opts={}) => {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.headers.get('content-type')?.includes('json') ? res.json() : res.text();
};
const toast = (msg, ok=true) => {
  const t = $('#toast');
  t.textContent = msg;
  t.style.borderColor = ok ? 'rgba(111,174,106,0.6)' : 'rgba(201,90,58,0.6)';
  t.style.display = 'block';
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(() => t.style.display='none', 2800);
};

async function refreshStatus() {
  const s = await api('/api/status');
  $('#stat-uptime').textContent  = Math.round(s.uptimeSec) + 's';
  $('#stat-tasks').textContent   = s.tasksExecuted;
  $('#stat-tools').textContent   = s.tools.length;
  $('#stat-channels').textContent= s.channels.length;
}

async function refreshPersonas() {
  const list = await api('/api/personas');
  $('#personas-list').innerHTML = list.map(p =>
    \`<li><span><strong>\${p.name}</strong><br><small class="muted">\${p.id} · \${p.preferredModel}</small></span>
        <span class="pill pill-amber">\${p.requiredSkillIds.length} skill(s)</span></li>\`
  ).join('');
  const sel = $('#run-persona');
  sel.innerHTML = list.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
}

async function refreshSkills() {
  const list = await api('/api/skills');
  $('#skills-list').innerHTML = list.map(s =>
    \`<li><span><strong>\${s.id}</strong><br><small class="muted">\${s.description}</small></span></li>\`
  ).join('');
}

async function refreshChannels() {
  const list = await api('/api/channels');
  $('#channels-list').innerHTML = list.map(c =>
    \`<li><span><strong>\${c.id}</strong><br><small class="muted">\${c.kind}</small></span>
        <button class="btn btn-sm btn-owl-ghost" data-send-channel="\${c.id}">Send</button></li>\`
  ).join('');
  const sel = $('#send-channel');
  sel.innerHTML = list.map(c => \`<option value="\${c.id}">\${c.id}</option>\`).join('');
  $$('[data-send-channel]').forEach(b => b.addEventListener('click', () => {
    $('#send-channel').value = b.dataset.sendChannel;
    $('#send-message').focus();
  }));
}

async function refreshObservers() {
  const list = await api('/api/observers');
  $('#observers-list').innerHTML = list.map(o =>
    \`<li>
       <span><strong>\${o.id}</strong><br>
         <small class="muted">\${o.running ? 'started ' + new Date(o.startedAt).toLocaleTimeString() : 'idle'}</small></span>
       <span>
         <span class="pill \${o.running ? 'pill-on':'pill-off'}">\${o.running ? 'RUNNING':'STOPPED'}</span>
         \${o.running
           ? \`<button class="btn btn-sm btn-owl-danger ms-2" data-stop="\${o.id}">Stop</button>\`
           : \`<button class="btn btn-sm btn-owl ms-2" data-start="\${o.id}">Start</button>\`}
       </span>
     </li>\`
  ).join('');
  $$('[data-start]').forEach(b => b.addEventListener('click', async () => {
    try { await api('/api/observers/' + encodeURIComponent(b.dataset.start) + '/start', { method: 'POST' });
      toast('Observer started: ' + b.dataset.start); refreshObservers(); }
    catch(e){ toast(e.message, false); }
  }));
  $$('[data-stop]').forEach(b => b.addEventListener('click', async () => {
    try { await api('/api/observers/' + encodeURIComponent(b.dataset.stop) + '/stop', { method: 'POST' });
      toast('Observer stopped: ' + b.dataset.stop); refreshObservers(); }
    catch(e){ toast(e.message, false); }
  }));
}

async function refreshTools() {
  const list = await api('/api/tools');
  $('#tools-list').innerHTML = list.length
    ? list.map(t => \`<li><span><strong>\${t.name}</strong><br><small class="muted">\${t.description}</small></span></li>\`).join('')
    : '<li class="muted">No tools registered (skills mount tools at task time)</li>';
}

async function refreshLogs() {
  const list = await api('/api/logs?limit=120');
  $('#log-stream').innerHTML = list.map(e =>
    \`<div class="log-line log-\${e.level}">[\${e.ts.slice(11,19)}] \${e.level.padEnd(5)} \${e.scope.padEnd(18)} \${e.message}\${e.meta ? ' ' + JSON.stringify(e.meta):''}</div>\`
  ).join('');
  const stream = $('#log-stream'); stream.scrollTop = stream.scrollHeight;
}

async function refreshAll() {
  await Promise.all([refreshStatus(), refreshPersonas(), refreshSkills(), refreshChannels(), refreshObservers(), refreshTools(), refreshLogs()]);
}

// Form handlers
$('#form-run-task').addEventListener('submit', async (e) => {
  e.preventDefault();
  const personaId = $('#run-persona').value;
  const intent    = $('#run-intent').value.trim();
  const payloadTx = $('#run-payload').value.trim();
  let payload = {};
  try { payload = payloadTx ? JSON.parse(payloadTx) : {}; }
  catch { return toast('Payload must be valid JSON', false); }
  try {
    const r = await api('/api/tasks', { method: 'POST', body: JSON.stringify({ personaId, intent, payload }) });
    toast('Task ' + r.taskId + ' → ' + r.status);
    refreshAll();
  } catch(err){ toast(err.message, false); }
});

$('#form-send').addEventListener('submit', async (e) => {
  e.preventDefault();
  const channelId = $('#send-channel').value;
  const recipient = $('#send-recipient').value.trim();
  const message   = $('#send-message').value.trim();
  try {
    await api('/api/channels/' + encodeURIComponent(channelId) + '/send',
      { method: 'POST', body: JSON.stringify({ recipient, message }) });
    toast('Message dispatched via ' + channelId);
    $('#send-message').value = '';
    refreshLogs();
  } catch(err){ toast(err.message, false); }
});

$('#form-add-watcher').addEventListener('submit', async (e) => {
  e.preventDefault();
  const symbol      = $('#mw-symbol').value.trim();
  const threshold   = Number($('#mw-threshold').value);
  const intervalMs  = Number($('#mw-interval').value);
  try {
    await api('/api/observers/market', {
      method: 'POST',
      body: JSON.stringify({ symbol, thresholdPct: threshold, intervalMs })
    });
    toast('MarketWatcher registered for ' + symbol);
    refreshObservers();
  } catch(err){ toast(err.message, false); }
});

$('#btn-refresh').addEventListener('click', () => refreshAll());
$('#btn-stop-all').addEventListener('click', async () => {
  await api('/api/observers/stop-all', { method: 'POST' });
  toast('All observers stopped'); refreshObservers();
});

// Live polling
refreshAll();
setInterval(refreshLogs, 1500);
setInterval(refreshStatus, 2000);
setInterval(refreshObservers, 3000);
`;

/** Page shell — Bootstrap 5 from CDN, owl theme + favicon + logo. */
export function renderDashboardHTML(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>OwlAuto · Control Center</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>${DASHBOARD_CSS}</style>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-owl px-4">
  <a class="navbar-brand" href="/">
    ${OWL_LOGO_SVG}
    <span>OwlAuto</span>
    <span class="badge badge-version ms-2">v0.1.0</span>
  </a>
  <div class="ms-auto d-flex gap-2">
    <button id="btn-refresh"  class="btn btn-sm btn-owl-ghost">Refresh</button>
    <button id="btn-stop-all" class="btn btn-sm btn-owl-danger">Stop All</button>
  </div>
</nav>

<div class="container-fluid px-4 py-3">

  <div class="hero">
    ${OWL_LOGO_SVG}
    <div>
      <h1>Autonomous Agent Control Center</h1>
      <p>Personas · Skills · Channels · Observers · Tools · Live Activity</p>
    </div>
  </div>

  <!-- Status row -->
  <div class="row g-3">
    <div class="col-md-3"><div class="card card-owl p-3">
      <small class="muted">UPTIME</small><h3 id="stat-uptime">—</h3></div></div>
    <div class="col-md-3"><div class="card card-owl p-3">
      <small class="muted">TASKS EXECUTED</small><h3 id="stat-tasks">—</h3></div></div>
    <div class="col-md-3"><div class="card card-owl p-3">
      <small class="muted">TOOLS REGISTERED</small><h3 id="stat-tools">—</h3></div></div>
    <div class="col-md-3"><div class="card card-owl p-3">
      <small class="muted">CHANNELS</small><h3 id="stat-channels">—</h3></div></div>
  </div>

  <div class="row g-3 mt-1">
    <!-- Personas -->
    <div class="col-lg-4">
      <div class="card card-owl">
        <div class="card-header">Personas</div>
        <div class="card-body p-0"><ul id="personas-list" class="list-owl"></ul></div>
      </div>
    </div>
    <!-- Skills -->
    <div class="col-lg-4">
      <div class="card card-owl">
        <div class="card-header">Skills</div>
        <div class="card-body p-0"><ul id="skills-list" class="list-owl"></ul></div>
      </div>
    </div>
    <!-- Channels -->
    <div class="col-lg-4">
      <div class="card card-owl">
        <div class="card-header">Channels</div>
        <div class="card-body p-0"><ul id="channels-list" class="list-owl"></ul></div>
      </div>
    </div>
  </div>

  <!-- Observers + add watcher -->
  <div class="row g-3 mt-1">
    <div class="col-lg-7">
      <div class="card card-owl">
        <div class="card-header">Observers / Triggers</div>
        <div class="card-body p-0"><ul id="observers-list" class="list-owl"></ul></div>
      </div>
    </div>
    <div class="col-lg-5">
      <div class="card card-owl">
        <div class="card-header">Add Market Watcher</div>
        <div class="card-body">
          <form id="form-add-watcher" class="row g-2">
            <div class="col-12">
              <label class="form-label muted small">SYMBOL</label>
              <input id="mw-symbol" class="form-control form-control-owl" value="ETH-USD" required>
            </div>
            <div class="col-6">
              <label class="form-label muted small">THRESHOLD %</label>
              <input id="mw-threshold" type="number" step="0.1" class="form-control form-control-owl" value="2.5" required>
            </div>
            <div class="col-6">
              <label class="form-label muted small">INTERVAL MS</label>
              <input id="mw-interval" type="number" class="form-control form-control-owl" value="800" required>
            </div>
            <div class="col-12 d-grid">
              <button class="btn btn-owl">Register Watcher</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Run task + send message -->
  <div class="row g-3 mt-1">
    <div class="col-lg-6">
      <div class="card card-owl">
        <div class="card-header">Run Task Manually</div>
        <div class="card-body">
          <form id="form-run-task" class="row g-2">
            <div class="col-12">
              <label class="form-label muted small">PERSONA</label>
              <select id="run-persona" class="form-select form-select-owl"></select>
            </div>
            <div class="col-12">
              <label class="form-label muted small">INTENT</label>
              <input id="run-intent" class="form-control form-control-owl" value="ad_hoc_analysis" required>
            </div>
            <div class="col-12">
              <label class="form-label muted small">PAYLOAD (JSON)</label>
              <textarea id="run-payload" class="form-control form-control-owl" rows="3">{"note":"manual run from dashboard"}</textarea>
            </div>
            <div class="col-12 d-grid">
              <button class="btn btn-owl">Execute Task</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card card-owl">
        <div class="card-header">Send Channel Message</div>
        <div class="card-body">
          <form id="form-send" class="row g-2">
            <div class="col-12">
              <label class="form-label muted small">CHANNEL</label>
              <select id="send-channel" class="form-select form-select-owl"></select>
            </div>
            <div class="col-12">
              <label class="form-label muted small">RECIPIENT</label>
              <input id="send-recipient" class="form-control form-control-owl" value="#general" required>
            </div>
            <div class="col-12">
              <label class="form-label muted small">MESSAGE</label>
              <textarea id="send-message" class="form-control form-control-owl" rows="2" required>Hello from OwlAuto.</textarea>
            </div>
            <div class="col-12 d-grid">
              <button class="btn btn-owl">Dispatch</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Tools + Logs -->
  <div class="row g-3 mt-1 mb-4">
    <div class="col-lg-4">
      <div class="card card-owl">
        <div class="card-header">Tool Registry</div>
        <div class="card-body p-0"><ul id="tools-list" class="list-owl"></ul></div>
      </div>
    </div>
    <div class="col-lg-8">
      <div class="card card-owl">
        <div class="card-header">Live Activity Log</div>
        <div class="card-body">
          <div id="log-stream" class="log-stream"></div>
        </div>
      </div>
    </div>
  </div>

</div>

<div id="toast" class="toast-owl"></div>
<script>${DASHBOARD_JS}</script>
</body>
</html>`;
}
