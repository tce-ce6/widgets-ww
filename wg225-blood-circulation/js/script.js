'use strict';

/* ==========================================================================
   wg225 — Blood Circulation  (widget logic)

   Flow (from reference/blood-circulation-widget.html + en_evs_05_wg225.docx):
     The student places six flags, in the order blood travels:
       Body -> Right atrium -> Right ventricle -> Lungs -> Left atrium
            -> Left ventricle -> Body
     Pick a flag (tap) and tap the part of the diagram, or drag it there.
     - Right flag, right place: the blood flows on to that part and keeps
       flowing up to it, a numbered pin drops in, the track fills, and a fact
       is shown.
     - Wrong flag (not the next one): hint, the flag goes back.
     - Right flag, wrong place: hint, the flag stays picked.
     - After two wrong tries, the correct part glows.
     When all six are placed, blood flows round the whole path (with white
     arrows on the vessels) and a caption is shown for each part.

   Review changes (en_evs_05_wg225_tech.xlsx):
     - The blood is shown as dots moving along the vessels (drawn here, see
       ROUTE), not the old Lottie drop + arrows. After each flag the dots keep
       flowing up to that flag and stop there. Arrows appear only once the
       whole path is complete. Dots are bigger and slower.
     - Flag 3 (lungs): the dots stop at the left lung, not between the lungs.
     - Feedback after each try is shown at the top (instruction line).
     - "Restart" (was "Start again") sits bottom right, hidden until the first
       flag is placed. Help button added (js/how-to-play.js).
     - Larger heart touch areas (one quarter of the heart per chamber).
   ========================================================================== */

(function () {
  // ---------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------
  // Index 0 is the start (blood coming from the body); flags are 1..6.
  const M = [
    { spot: 'body', name: 'Blood vessels from the body', tone: 'poor', noun: 'the body' },
    { spot: 'ra', name: 'Right atrium', tone: 'poor', noun: 'the right atrium' },
    { spot: 'rv', name: 'Right ventricle', tone: 'poor', noun: 'the right ventricle' },
    { spot: 'lungs', name: 'Lungs', tone: 'swap', noun: 'the lungs' },
    { spot: 'la', name: 'Left atrium', tone: 'rich', noun: 'the left atrium' },
    { spot: 'lv', name: 'Left ventricle', tone: 'rich', noun: 'the left ventricle' },
    { spot: 'body', name: 'Blood vessels to the body', tone: 'rich', noun: 'the body' }
  ];
  const FACT = [
    'This blood has given away its oxygen to the body.',
    "The blood goes into the heart here, at the top of the heart's right side.",
    'This is the bottom part on the right side. It pumps blood to the lungs.',
    'The blood takes in oxygen and gives away carbon dioxide. Watch it turn red!',
    "Blood full of oxygen comes back in at the top of the heart's left side.",
    'This is the strongest part of the heart. It has the most work to do.',
    'Blood full of oxygen reaches every part of you. Then the trip starts again.'
  ];
  const WHERE = [null,
    "The right atrium is at the top of the heart's right side.",
    "The right ventricle is at the bottom of the heart's right side.",
    'The lungs are where we take in air.',
    "The left atrium is at the top of the heart's left side.",
    "The left ventricle is at the bottom of the heart's left side.",
    'This flag goes where the blood takes oxygen to every part of you.'
  ];
  const CAPTIONS = [
    'Blood that needs oxygen comes back from the body to the heart.',
    "It goes into the right atrium, at the top of the heart's right side.",
    'It moves down into the right ventricle. This part pushes the blood to the lungs.',
    'In the lungs, the blood takes in oxygen and gives away carbon dioxide.',
    'Blood full of oxygen comes back to the left atrium.',
    'It moves down into the left ventricle, the strongest part of the heart.',
    'The left ventricle pushes the blood out to every part of the body.'
  ];
  const CAPTION_END = 'Then the blood comes back to the heart, and the trip starts again.';
  const INSTR_START = 'Pick a flag, then tap its spot on the picture. Remember to place the flags in the order the blood travels.';
  const MSG_OK = 'Flag placed correctly!';
  const MSG_NEXT = 'Where does the blood go next?';
  const MSG_ALL = 'Brilliant! Every flag is in the right place.';

  // ---------------------------------------------------------------------
  // Geometry (canvas units)
  // ---------------------------------------------------------------------
  const PIN_TIP = { 1: [419, 589], 2: [447, 639], 3: [407, 379], 4: [482, 575], 5: [498, 626], 6: [467, 816] };
  const WHITE_PIN_ID = { 1: 'Group_598', 2: 'Group_601', 3: 'Group_602', 4: 'Group_599', 5: 'Group_600', 6: 'Group_603' };
  const TRACK_X = [1011.8, 1135.8, 1242.8, 1347.8, 1439.8, 1546.8, 1674.8];
  const TRACK_Y = 790;
  const BLUE = '#0c51c4', RED = '#ff0000';
  const SVGNS = 'http://www.w3.org/2000/svg';
  // Teardrop pin (layout.svg diagram-location-icon, outer shape), tip at (16.38, 46.83)
  const PIN_PATH = 'M16.38,1.53c8.4,0,15.2,6.81,15.21,15.21,0,6.08-11.67,23.76-15.21,30.09C12.84,40.5,1.17,22.82,1.17,16.74c0-8.4,6.81-15.2,15.21-15.21Z';
  const FLAG_ICON = '<svg viewBox="0 0 32.94 47.36" aria-hidden="true"><path fill="#fff" d="M16.47,0C7.37,0,0,7.37,0,16.47c0,6.59,12.64,25.74,16.47,30.89,3.83-5.15,16.47-24.3,16.47-30.89C32.94,7.37,25.57,0,16.47,0ZM16.47,25.38c-4.92,0-8.91-3.99-8.91-8.91s3.99-8.91,8.91-8.91,8.91,3.99,8.91,8.91-3.99,8.91-8.91,8.91Z"/></svg>';

  // ---------------------------------------------------------------------
  // The blood's route along the vessels.
  // Points along the centre of each vessel, taken from the arrow positions of
  // the old circulation.json (380x760 comp placed at 283.3,204.4, scale .961).
  // c() converts those comp coordinates to canvas units.
  //   stop: n   — flag n's place on the route (the dots stop here)
  //   arrow     — a white arrow is drawn here once the path is complete
  //   tone      — colour of the blood on the leg that starts here
  //   gap       — the blood passes through the lungs here: no dots drawn
  // ---------------------------------------------------------------------
  const c = (x, y, o) => Object.assign({ x: 283.3 + 0.961 * x, y: 204.4 + 0.961 * y }, o || {});
  const p = (x, y, o) => Object.assign({ x, y }, o || {});
  const ROUTE = [
    // Start: blood leaves the body on the left (blue) …
    c(130, 599, { stop: 0, tone: 'poor' }),
    c(106, 599, { arrow: 1 }), c(66, 599, { arrow: 1 }), c(33, 595), c(23, 552, { arrow: 1 }),
    c(23, 482, { arrow: 1 }), c(23, 408, { arrow: 1 }), c(29, 358), c(72, 352, { arrow: 1 }), c(135, 360),
    // … into the right atrium, down to the right ventricle …
    p(419, 570, { stop: 1 }),
    p(447, 620, { stop: 2 }),
    // … up and out to the lungs (left lung only: the dots stop there) …
    c(181, 330), c(146, 313, { arrow: 1 }), c(51, 314, { arrow: 1 }), c(13, 284), c(13, 220, { arrow: 1 }),
    c(23, 172), c(68, 165, { arrow: 1 }),
    p(407, 360, { stop: 3, gap: true }),
    // … through the lungs, where it turns red …
    p(528, 360, { tone: 'rich' }),
    c(308, 164, { arrow: 1 }), c(358, 178), c(365, 228, { arrow: 1 }), c(365, 286, { arrow: 1 }),
    c(361, 348), c(316, 362, { arrow: 1 }), c(248, 362),
    // … back into the left atrium, down to the left ventricle …
    p(482, 556, { stop: 4 }),
    p(498, 607, { stop: 5 }),
    // … out through the big red vessel and down to the body.
    c(158, 342), c(117, 336, { arrow: 1 }), c(117, 293), c(167, 290, { arrow: 1 }), c(237, 290, { arrow: 1 }),
    c(305, 289, { arrow: 1 }), c(341, 324), c(341, 409, { arrow: 1 }), c(341, 468, { arrow: 1 }), c(342, 540),
    c(332, 594), c(276, 599, { arrow: 1 }),
    p(467, 800, { stop: 6, tone: 'poor' })
    // (the route then closes back to the start, through the body)
  ];
  const GAP_LEN = 24;          // the lungs crossing counts as this long (no dots shown)
  const DOT_R = 7;             // dot radius
  const DOT_GAP = 30;          // distance between dots
  const DOT_SPEED = 55;        // units per second while flowing
  const FRONT_SPEED = 170;     // how fast the blood reaches a newly placed flag
  const STAGE_MS = 2600;       // full run: time per part

  // Lengths along the route (the closing leg back to the start is added last)
  const LEGS = [];
  let routeLen = 0;
  const STOP_AT = [];
  ROUTE.forEach((pt, i) => {
    pt.s = routeLen;
    if (pt.stop != null) STOP_AT[pt.stop] = routeLen;
    const nx = ROUTE[(i + 1) % ROUTE.length];
    const real = Math.hypot(nx.x - pt.x, nx.y - pt.y);
    const len = pt.gap ? GAP_LEN : real;
    LEGS.push({ a: pt, b: nx, len, gap: !!pt.gap });
    routeLen += len;
  });
  // Tone of each leg: carried forward from the last point that set one
  let tone = 'poor';
  LEGS.forEach(l => { if (l.a.tone) tone = l.a.tone; l.tone = tone; });
  const LOOP_LEN = routeLen;

  function pointAt(s) {
    s = ((s % LOOP_LEN) + LOOP_LEN) % LOOP_LEN;
    for (const l of LEGS) {
      if (s <= l.a.s + l.len) {
        const t = l.len ? (s - l.a.s) / l.len : 0;
        return { x: l.a.x + (l.b.x - l.a.x) * t, y: l.a.y + (l.b.y - l.a.y) * t, gap: l.gap, tone: l.tone };
      }
    }
    const l = LEGS[LEGS.length - 1];
    return { x: l.b.x, y: l.b.y, gap: false, tone: l.tone };
  }

  const reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const reduced = () => !!reduceMQ.matches;

  // ---------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------
  const $ = s => document.querySelector(s);
  const all = (s, root) => Array.from((root || document).querySelectorAll(s));
  const svg = $('#master-svg');
  const instrEl = $('#instr');
  const trayEl = $('#tray');
  const feedbackEl = $('#feedback');
  const connector = $('#fb-connector');
  const trackG = $('#track');
  const numPinsG = $('#num-pins');
  const dotsG = $('#flow-dots');
  const arrowsG = $('#flow-arrows');
  const restartBtn = $('#btn-restart');
  const srEl = $('#sr');
  const spots = all('.spot', svg);
  const modalLayer = $('#modal-layer');
  const modalStage = $('#modal-stage');

  function mk(name, attrs, parent) {
    const e = document.createElementNS(SVGNS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch])); }
  function announce(msg) { srEl.textContent = ''; setTimeout(() => { srEl.textContent = msg; }, 30); }
  function now() { return performance.now(); }
  function shuffled(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function spotEl(id) { return svg.querySelector('.spot[data-spot="' + id + '"]'); }

  // Canvas scale (screen px per canvas unit) — for the drag ghost and the pop-up.
  function canvasScale() {
    const r = svg.getBoundingClientRect();
    return Math.min(r.width / 1920, r.height / 1080) || 1;
  }

  // ---------------------------------------------------------------------
  // Blood flow: dots along the route
  // ---------------------------------------------------------------------
  // flow.front: how far along the route the blood has got (dots show up to
  // here). flow.loop: the whole path is complete, dots go round and round.
  const flow = { front: 0, loop: false, paused: false, phase: 0, last: 0, raf: 0, reach: null };
  const DOT_COUNT = Math.ceil(LOOP_LEN / DOT_GAP) + 2;
  const dots = [];
  for (let i = 0; i < DOT_COUNT; i++) dots.push(mk('circle', { class: 'blood-dot', r: DOT_R }, dotsG));

  function drawDots() {
    const visibleLen = flow.loop ? LOOP_LEN : flow.front;
    // Evenly spaced dots that all move forward together: dot i sits at
    // (phase mod gap) + i * gap. Past the front they are hidden, so a steady
    // stream runs from the start up to the front.
    const ph = flow.phase % DOT_GAP;
    dots.forEach((d, i) => {
      let s = ph + i * DOT_GAP;
      let show;
      if (flow.loop) {
        show = s < LOOP_LEN;
      } else {
        show = visibleLen > 0 && s <= visibleLen;
      }
      if (!show) { d.setAttribute('visibility', 'hidden'); return; }
      const pt = pointAt(s);
      if (!show || pt.gap) { d.setAttribute('visibility', 'hidden'); return; }
      // Fade in at the start and out at the front (not when going round)
      let op = 1;
      if (!flow.loop) {
        op = Math.min(1, s / 18, (visibleLen - s) / 18);
        if (op <= 0) { d.setAttribute('visibility', 'hidden'); return; }
      }
      d.setAttribute('visibility', 'visible');
      d.setAttribute('cx', pt.x.toFixed(1));
      d.setAttribute('cy', pt.y.toFixed(1));
      d.setAttribute('opacity', op.toFixed(2));
      d.setAttribute('class', 'blood-dot ' + (pt.tone === 'rich' ? 'rich' : 'poor'));
    });
  }

  function tick(t) {
    const dt = flow.last ? Math.min((t - flow.last) / 1000, 0.1) : 0;
    flow.last = t;
    if (!flow.paused && !reduced()) {
      flow.phase += DOT_SPEED * dt;
      if (flow.reach) {
        const r = flow.reach;
        flow.front = Math.min(r.to, flow.front + FRONT_SPEED * dt);
        if (flow.front >= r.to) { flow.reach = null; r.done(); }
      }
    }
    drawDots();
    flow.raf = requestAnimationFrame(tick);
  }
  flow.raf = requestAnimationFrame(tick);

  /** Lets the blood flow on to flag m. Resolves when it gets there. */
  function reachFlag(m) {
    const to = STOP_AT[m];
    if (reduced() || to <= flow.front) {
      flow.front = Math.max(flow.front, to);
      return Promise.resolve();
    }
    return new Promise(resolve => {
      const r = { to, done: resolve };
      flow.reach = r;
      // Safety net: if animation frames stall (e.g. a background tab),
      // finish the move anyway so the flag still gets placed.
      const ms = (to - flow.front) / FRONT_SPEED * 1000 + 700;
      setTimeout(() => {
        if (flow.reach !== r) return;
        flow.reach = null;
        flow.front = to;
        r.done();
      }, ms);
    });
  }

  function resetFlow() {
    if (flow.reach) { const r = flow.reach; flow.reach = null; r.done(); }
    flow.front = 0;
    flow.loop = false;
    flow.paused = false;
    flow.phase = 0;
    arrowsG.textContent = '';
  }

  // White arrows on the vessels, pointing the way the blood goes
  function drawArrows() {
    arrowsG.textContent = '';
    ROUTE.forEach((pt, i) => {
      if (!pt.arrow) return;
      const nx = ROUTE[i + 1];
      const ang = Math.atan2(nx.y - pt.y, nx.x - pt.x) * 180 / Math.PI;
      mk('path', { class: 'flow-arrow', d: 'M-7,-10 L5,0 L-7,10', transform: `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)})` }, arrowsG);
    });
  }

  // ---------------------------------------------------------------------
  // Track
  // ---------------------------------------------------------------------
  function renderTrack(progress, active) {
    all('.tnode.step', trackG).forEach(n => n.remove());
    all('.tnode', trackG).forEach(n => n.classList.toggle('active', active === 0));
    for (let i = 1; i <= 6; i++) {
      const x = TRACK_X[i];
      const g = mk('g', { class: 'tnode step' + (i === active ? ' active' : ''), 'data-step': i }, trackG);
      if (i <= progress) {
        if (M[i].tone === 'swap') {
          mk('circle', { cx: x, cy: TRACK_Y, r: 30.5, fill: RED }, g);
          mk('path', { d: `M${x},${TRACK_Y - 30.5} A30.5,30.5 0 0 0 ${x},${TRACK_Y + 30.5} Z`, fill: BLUE }, g);
        } else {
          mk('circle', { cx: x, cy: TRACK_Y, r: 30.5, fill: M[i].tone === 'poor' ? BLUE : RED }, g);
        }
        const t = mk('text', { class: 'tnum', x, y: TRACK_Y + 7, 'text-anchor': 'middle' }, g);
        t.textContent = String(i);
      } else {
        mk('circle', { class: 'tnode-empty', cx: x, cy: TRACK_Y, r: 30.5 }, g);
        mk('circle', { class: 'tnode-ring', cx: x, cy: TRACK_Y, r: 29 }, g);
      }
    }
  }

  // ---------------------------------------------------------------------
  // Diagram state
  // ---------------------------------------------------------------------
  function setWhitePin(i, visible) {
    const el = document.getElementById(WHITE_PIN_ID[i]);
    if (el) el.style.display = visible ? '' : 'none';
  }

  function addNumPin(i) {
    const [tx, ty] = PIN_TIP[i];
    const s = 1.3; // a bit bigger than the white pin
    const g = mk('g', { class: 'num-pin', 'data-pin': i, transform: `translate(${tx - 16.38 * s} ${ty - 46.83 * s}) scale(${s})` }, numPinsG);
    const inner = mk('g', { class: 'num-pin-inner' }, g);
    if (M[i].tone === 'swap') {
      const id = 'pin-swap-grad';
      if (!document.getElementById(id)) {
        const defs = svg.querySelector('defs') || mk('defs', {}, svg);
        const lg = mk('linearGradient', { id, x1: '0', y1: '0', x2: '1', y2: '0' }, defs);
        mk('stop', { offset: '0.5', 'stop-color': BLUE }, lg);
        mk('stop', { offset: '0.5', 'stop-color': RED }, lg);
      }
      mk('path', { d: PIN_PATH, fill: 'url(#' + id + ')', stroke: '#fff', 'stroke-width': 2 }, inner);
    } else {
      mk('path', { d: PIN_PATH, fill: M[i].tone === 'poor' ? BLUE : RED, stroke: '#fff', 'stroke-width': 2 }, inner);
    }
    const t = mk('text', { x: 16.38, y: 23.5, 'text-anchor': 'middle' }, inner);
    t.textContent = String(i);
  }

  function showName(i, on) {
    const n = svg.querySelector('.chamber-name[data-name="' + i + '"]');
    if (n) n.classList.toggle('shown', on !== false);
  }

  function reachArt(i) {
    setWhitePin(i, false);
    addNumPin(i);
    showName(i);
    const dp = svg.querySelector('.dp[data-dp="' + i + '"]');
    if (dp) dp.classList.add('gone');
  }

  function resetArt() {
    stopFull();
    resetFlow();
    numPinsG.textContent = '';
    for (let i = 1; i <= 6; i++) setWhitePin(i, true);
    all('.chamber-name', svg).forEach(n => n.classList.remove('shown'));
    all('.dp', svg).forEach(d => d.classList.remove('gone'));
    spots.forEach(s => s.classList.remove('glow', 'nope', 'lit', 'drop-target'));
  }

  function unglow() { spots.forEach(s => s.classList.remove('glow')); }

  // ---------------------------------------------------------------------
  // Top line (instruction / feedback after each try) and the fact card
  // ---------------------------------------------------------------------
  function setInstr(t) { instrEl.className = 'instr'; instrEl.textContent = t; }

  function instrGood(msg, then) {
    instrEl.className = 'instr good';
    instrEl.innerHTML = `<p><b class="ok">${esc(msg)}</b>${then ? ' ' + esc(then) : ''}</p>`;
  }

  function instrBad(msg, hint) {
    instrEl.className = 'instr bad';
    instrEl.innerHTML = `<p class="bad-msg">${esc(msg)}</p>${hint ? `<p class="bad-hint">${esc(hint)}</p>` : ''}`;
  }

  function showConnector(step) {
    if (step == null) { connector.classList.add('hidden'); return; }
    connector.setAttribute('x1', TRACK_X[step]);
    connector.setAttribute('x2', TRACK_X[step]);
    connector.classList.remove('hidden');
  }

  function factCard(title, text, step) {
    feedbackEl.innerHTML = `<div class="fb-box"><p class="fb-title">${esc(title)}</p>${text ? `<p>${esc(text)}</p>` : ''}</div>`;
    showConnector(step);
  }

  function factClear() { feedbackEl.innerHTML = ''; showConnector(null); }

  // ---------------------------------------------------------------------
  // Full run (after all six flags)
  // ---------------------------------------------------------------------
  let full = { on: false, paused: false, stage: -1, timer: 0 };

  function setStage(s) {
    if (s === full.stage) return;
    full.stage = s;
    spots.forEach(e => e.classList.remove('lit'));
    if (s >= 0) {
      const sp = spotEl(M[s].spot);
      if (sp) sp.classList.add('lit');
    }
    all('.num-pin', numPinsG).forEach(pin => pin.classList.toggle('lit', +pin.dataset.pin === s));
    renderTrack(6, s);
    if (s >= 0) factCard(s === 0 ? 'Start: ' + M[0].name : M[s].name, CAPTIONS[s], s);
  }

  function startFull() {
    stopFull();
    full.on = true;
    full.paused = false;
    flow.loop = true;
    flow.paused = false;
    flow.front = LOOP_LEN;
    drawArrows();
    document.body.classList.add('flowing');
    instrGood(MSG_ALL, 'Watch the blood pass each flag.');
    renderTray();
    for (let i = 1; i <= 6; i++) showName(i);
    let i = 0;
    setStage(0);
    full.timer = setInterval(() => {
      if (full.paused) return;
      i++;
      if (i > 6) { clearInterval(full.timer); full.timer = 0; endFull(); return; }
      setStage(i);
    }, STAGE_MS);
  }

  function endFull() {
    full.stage = -1;
    spots.forEach(e => e.classList.remove('lit'));
    all('.num-pin', numPinsG).forEach(pin => pin.classList.remove('lit'));
    renderTrack(6, -1);
    factCard('All six flags placed!', CAPTION_END, null);
    renderTray();
  }

  function stopFull() {
    if (full.timer) clearInterval(full.timer);
    full = { on: false, paused: false, stage: -1, timer: 0 };
    document.body.classList.remove('flowing');
    spots.forEach(e => e.classList.remove('lit'));
  }

  function togglePause() {
    if (!full.on) return;
    full.paused = !full.paused;
    flow.paused = full.paused;
    renderTray();
    announce(full.paused ? 'Paused.' : 'Playing.');
  }

  // ---------------------------------------------------------------------
  // Planting flags
  // ---------------------------------------------------------------------
  let plant = { next: 1, wrong: 0, moving: false, done: false, tray: [], selected: null };

  function renderRestart() {
    restartBtn.classList.toggle('hidden', plant.next === 1 && !plant.done);
  }

  function renderTray() {
    const active = document.activeElement;
    const key = active && active.dataset ? active.dataset.key : null;
    trayEl.textContent = '';
    if (plant.done) {
      const box = document.createElement('div');
      box.className = 'tray-done';
      box.innerHTML = '<span>All flags placed.</span><div class="row"></div>';
      const row = box.querySelector('.row');
      const again = document.createElement('button');
      again.type = 'button'; again.className = 'pill'; again.dataset.key = 'again'; again.textContent = 'Watch again';
      again.addEventListener('click', () => { startFull(); });
      row.appendChild(again);
      if (full.on) {
        const pause = document.createElement('button');
        pause.type = 'button'; pause.className = 'pill'; pause.dataset.key = 'pause';
        pause.textContent = full.paused ? 'Play' : 'Pause';
        pause.setAttribute('aria-pressed', full.paused ? 'true' : 'false');
        pause.addEventListener('click', togglePause);
        row.appendChild(pause);
      }
      trayEl.appendChild(box);
    } else {
      plant.tray.forEach(i => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'flag'; b.dataset.m = i; b.dataset.key = 'flag-' + i;
        b.innerHTML = FLAG_ICON;
        b.appendChild(document.createTextNode(M[i].name));
        b.setAttribute('aria-pressed', plant.selected === i ? 'true' : 'false');
        trayEl.appendChild(b);
      });
    }
    document.body.classList.toggle('choosing', plant.selected != null);
    renderRestart();
    if (key) {
      const f = trayEl.querySelector('[data-key="' + key + '"]');
      if (f) f.focus({ preventScroll: true });
    }
  }

  async function tryPlant(m, id, el) {
    if (plant.moving || plant.done) return;
    const next = plant.next;
    spots.forEach(s => s.classList.remove('nope'));

    if (m === next && id === M[m].spot) {
      plant.selected = null; plant.wrong = 0; unglow();
      plant.tray.splice(plant.tray.indexOf(m), 1);
      plant.moving = true;
      const runId = plant.run;
      renderTray();
      instrGood(MSG_OK, m < 6 ? MSG_NEXT : '');
      announce(M[m].name + ' flag placed correctly.');
      await reachFlag(m);
      if (runId !== plant.run) return; // Restart was pressed meanwhile
      plant.moving = false;
      reachArt(m);
      renderTrack(m, -1);
      factCard('Flag ' + m + ': ' + M[m].name, FACT[m], m);
      plant.next++;
      renderRestart();
      if (plant.next > 6) {
        plant.done = true;
        instrGood(MSG_ALL, 'Watch the blood pass each flag.');
        renderTray();
        setTimeout(() => { if (plant.done && plant.run === runId && !full.on) startFull(); }, 900);
        return;
      }
      const f = trayEl.querySelector('.flag');
      if (f) f.focus({ preventScroll: true });
      return;
    }

    plant.wrong++;
    if (el) { el.classList.add('nope'); setTimeout(() => el.classList.remove('nope'), 700); }
    let msg;
    if (m !== next) {
      plant.selected = null;
      renderTray();
      const nextIsHeart = ['ra', 'rv', 'la', 'lv'].indexOf(M[next].spot) > -1;
      msg = m === 6 ? 'Not yet. The blood goes back to the body last.' :
        'Not yet. The blood reaches ' + M[m].noun + ' later. ' +
        (!nextIsHeart ? 'Where does the blood go after ' + M[next - 1].noun + '?' :
          next === 1 ? 'Which part of the heart comes first?' : 'Which part of the heart comes after ' + M[next - 1].noun + '?');
    } else {
      msg = 'Right flag, wrong place. ' + WHERE[m];
    }
    let hint = '';
    if (plant.wrong >= 2) {
      const t = spotEl(M[next].spot);
      if (t) t.classList.add('glow');
      hint = 'The glowing part is where the blood goes next.';
    }
    instrBad(msg, hint);
  }

  let runCount = 0;
  function enterPlant() {
    resetArt();
    let t;
    do { t = shuffled([1, 2, 3, 4, 5, 6]); } while (t.join() === '1,2,3,4,5,6');
    plant = { next: 1, wrong: 0, moving: false, done: false, tray: t, selected: null, run: ++runCount };
    renderTrack(0, -1);
    factClear();
    renderTray();
    setInstr(INSTR_START);
  }

  // ---------------------------------------------------------------------
  // Input: tap a flag, then a part
  // ---------------------------------------------------------------------
  let suppressUntil = 0;

  function onSpot(id, el) {
    if (now() < suppressUntil) return;
    if (plant.done || plant.moving) return;
    if (plant.selected == null) { instrBad('Pick a flag first, then tap where it goes.'); return; }
    tryPlant(plant.selected, id, el);
  }

  spots.forEach(el => {
    el.addEventListener('click', () => onSpot(el.dataset.spot, el));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSpot(el.dataset.spot, el); }
    });
  });

  trayEl.addEventListener('click', e => {
    if (now() < suppressUntil || plant.moving || plant.done) return;
    const f = e.target.closest('.flag');
    if (!f) return;
    const m = +f.dataset.m;
    plant.selected = plant.selected === m ? null : m;
    renderTray();
    if (plant.selected != null) announce(M[m].name + ' flag picked. Now tap where it goes on the diagram.');
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!modalLayer.classList.contains('hidden')) { closeInsights(); return; }
    if (plant.selected != null) { plant.selected = null; renderTray(); }
  });

  // ---------------------------------------------------------------------
  // Input: drag a flag onto the diagram (mouse, pen, touch)
  // ---------------------------------------------------------------------
  let drag = null, ghost = null, hover = null;

  function spotAt(x, y) {
    const el = document.elementFromPoint(x, y);
    return el && el.closest ? el.closest('.spot') : null;
  }

  function setHover(el) {
    if (hover && hover !== el) hover.classList.remove('drop-target');
    hover = el;
    if (el) el.classList.add('drop-target');
  }

  document.addEventListener('pointerdown', e => {
    if (plant.moving || plant.done) return;
    if (e.button !== undefined && e.button !== 0) return;
    const f = e.target.closest ? e.target.closest('.flag') : null;
    if (!f || !trayEl.contains(f)) return;
    drag = { m: +f.dataset.m, el: f, x0: e.clientX, y0: e.clientY, moved: false, pid: e.pointerId };
  });

  document.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.pid) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 8) return;
      drag.moved = true;
      plant.selected = null;
      renderTray();
      drag.el = trayEl.querySelector('[data-m="' + drag.m + '"]');
      if (drag.el) drag.el.classList.add('lifting');
      ghost = document.createElement('div');
      ghost.className = 'flag drag-ghost';
      ghost.innerHTML = FLAG_ICON;
      ghost.appendChild(document.createTextNode(M[drag.m].name));
      ghost.style.transform = `scale(${canvasScale()})`;
      document.body.appendChild(ghost);
      document.body.classList.add('dragging', 'choosing');
    }
    e.preventDefault();
    const s = canvasScale();
    ghost.style.left = (e.clientX - 40 * s) + 'px';
    ghost.style.top = (e.clientY - 39 * s) + 'px';
    setHover(spotAt(e.clientX, e.clientY));
  }, { passive: false });

  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.pid) return;
    if (drag.moved) {
      suppressUntil = now() + 80;
      if (ghost) ghost.style.display = 'none'; // so elementFromPoint sees what is under it
      const target = cancelled ? null : spotAt(e.clientX, e.clientY);
      if (drag.el) drag.el.classList.remove('lifting');
      if (ghost) ghost.remove();
      ghost = null;
      setHover(null);
      document.body.classList.remove('dragging', 'choosing');
      if (target) tryPlant(drag.m, target.dataset.spot, target);
    }
    drag = null;
  }

  document.addEventListener('pointerup', e => endDrag(e, false));
  document.addEventListener('pointercancel', e => endDrag(e, true));

  // ---------------------------------------------------------------------
  // Buttons
  // ---------------------------------------------------------------------
  function bindSvgButton(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    });
  }

  let lastFocus = null;

  function updateCanvasScale() {
    modalLayer.style.setProperty('--canvas-scale', canvasScale().toFixed(4));
  }
  window.addEventListener('resize', updateCanvasScale);

  function openInsights() {
    lastFocus = document.activeElement;
    updateCanvasScale();
    modalLayer.classList.remove('hidden');
    $('#ins-close').focus({ preventScroll: true });
  }

  function closeInsights() {
    if (modalLayer.classList.contains('hidden')) return;
    modalLayer.classList.add('hidden');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  bindSvgButton($('#btn-insights'), openInsights);
  bindSvgButton(restartBtn, () => {
    enterPlant();
    announce('Restarted. All flags are back in the tray.');
  });
  $('#ins-close').addEventListener('click', closeInsights);
  modalLayer.addEventListener('click', e => { if (e.target === modalLayer || e.target === modalStage) closeInsights(); });

  // ---------------------------------------------------------------------
  // Go
  // ---------------------------------------------------------------------
  enterPlant();
})();
