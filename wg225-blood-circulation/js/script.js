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

   Blood flow (Lottie, from assets/JSON, embedded in js/lottie-data.js):
     - flow  <- circulation.json: a drop travels the path and leaves arrows.
       It stops at each part; FLOW_STOP / FLOW_RESUME are those frames.
     - loop  <- loop-circulation.json: cells streaming round (full run only).

   Review changes (en_evs_05_wg225_tech.xlsx):
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
  // Animation timing (frames of LOTTIE_DATA.flow = circulation.json, 30 fps)
  // The drop pauses at each part; it arrives at FLOW_STOP[i] and leaves at
  // FLOW_RESUME[i]. (Measured from circulation.json.)
  // ---------------------------------------------------------------------
  const FLOW_STOP = [0, 100, 180, 452, 550, 670, 930];
  const FLOW_RESUME = [0, 150, 270, 452, 630, 750, 930];
  const FLOW_END = 930;
  // Which part is being explained during the full run, by frame.
  const STAGE_FROM = [0, 95, 178, 300, 540, 660, 790];
  const STAGE_MS = 2600;       // reduced motion: time per part in the full run

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
  // Blood flow: Lottie animations (assets/JSON, embedded in js/lottie-data.js)
  //   flow — one blood drop travels the path and leaves arrows on the vessels
  //   loop — blood cells streaming round the whole path (after all 6 flags)
  // ---------------------------------------------------------------------
  const clone = d => JSON.parse(JSON.stringify(d));
  const flowAnim = lottie.loadAnimation({
    container: $('#lottie-flow'), renderer: 'svg', loop: false, autoplay: false,
    animationData: clone(window.LOTTIE_DATA.flow)
  });
  const loopAnim = lottie.loadAnimation({
    container: $('#lottie-loop'), renderer: 'svg', loop: true, autoplay: false,
    animationData: clone(window.LOTTIE_DATA.loop)
  });
  const loopBox = $('#lottie-loop');
  loopBox.style.visibility = 'hidden';
  flowAnim.addEventListener('DOMLoaded', () => flowAnim.goToAndStop(0, true));

  let flowGen = 0; // bumps whenever the flow animation is taken over

  /** Plays flow frames [from, to]; onFrame gets the absolute frame. Resolves
   *  true when done, false if something else took over meanwhile. */
  function playFlow(from, to, onFrame) {
    const myGen = ++flowGen;
    return new Promise(resolve => {
      if (reduced() || from >= to) {
        flowAnim.goToAndStop(to, true);
        if (onFrame) onFrame(to);
        resolve(true);
        return;
      }
      let finished = false;
      const finish = ok => {
        if (finished) return;
        finished = true;
        flowAnim.removeEventListener('enterFrame', onEnter);
        flowAnim.removeEventListener('complete', onDone);
        resolve(ok);
      };
      const onEnter = () => {
        if (myGen !== flowGen) { finish(false); return; }
        if (onFrame) onFrame(flowAnim.firstFrame + flowAnim.currentFrame);
      };
      const onDone = () => finish(myGen === flowGen);
      flowAnim.addEventListener('enterFrame', onEnter);
      flowAnim.addEventListener('complete', onDone);
      flowAnim.playSegments([from, to], true);
    });
  }

  function stopFlowAnim(frame) {
    flowGen++;
    flowAnim.pause();
    flowAnim.goToAndStop(frame, true);
  }

  /** Lets the blood flow on to flag m. Resolves true when it gets there. */
  function reachFlag(m) {
    return playFlow(FLOW_RESUME[m - 1], FLOW_STOP[m]);
  }

  function resetFlow() {
    stopFlowAnim(0);
    loopAnim.stop();
    loopBox.style.visibility = 'hidden';
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

  function stageAtFrame(f) {
    let s = 0;
    STAGE_FROM.forEach((from, i) => { if (f >= from) s = i; });
    return s;
  }

  async function startFull() {
    stopFull();
    full.on = true;
    full.paused = false;
    document.body.classList.add('flowing');
    instrGood(MSG_ALL, 'Watch the blood pass each flag.');
    renderTray();
    for (let i = 1; i <= 6; i++) showName(i);
    loopBox.style.visibility = '';
    if (!reduced()) loopAnim.play();

    if (reduced()) {
      let i = 0;
      setStage(0);
      flowAnim.goToAndStop(FLOW_STOP[0], true);
      full.timer = setInterval(() => {
        if (full.paused) return;
        i++;
        if (i > 6) { clearInterval(full.timer); full.timer = 0; endFull(); return; }
        setStage(i);
        flowAnim.goToAndStop(FLOW_STOP[i], true);
      }, STAGE_MS);
      return;
    }

    setStage(0);
    const ok = await playFlow(0, FLOW_END, f => setStage(stageAtFrame(f)));
    if (ok && full.on) endFull();
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
    loopAnim.stop();
    loopBox.style.visibility = 'hidden';
    spots.forEach(e => e.classList.remove('lit'));
  }

  function togglePause() {
    if (!full.on) return;
    full.paused = !full.paused;
    if (full.paused) { flowAnim.pause(); loopAnim.pause(); }
    else {
      // Resume the guided drop only if it hasn't finished its run yet.
      if (full.stage >= 0 && flowAnim.currentFrame < flowAnim.totalFrames - 1) flowAnim.play();
      if (!reduced()) loopAnim.play();
    }
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
