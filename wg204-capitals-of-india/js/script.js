'use strict';

// In Electron with nodeIntegration, the UMD build of lottie assigns itself to
// module.exports instead of window.lottie — pick it up from there.
if (
  !window.lottie &&
  typeof module === 'object' &&
  module &&
  module.exports &&
  typeof module.exports.loadAnimation === 'function'
) {
  window.lottie = module.exports;
}

document.addEventListener('DOMContentLoaded', () => {
  const CORRIDORS = window.CORRIDORS;
  const SHAPES = window.MAP_SHAPES;
  const POINTS = window.CAPITAL_POINTS;

  const ITEXT = {
    state: 'Read the clue and tap the correct state on the map.',
    capital: 'From the list, tap the correct capital for the selected state.',
  };
  // The Union Territory gateway says "Union Territory" where the others say "state".
  const itextFor = (step) => (state.corridor && state.corridor.id === 'ut'
    ? ITEXT[step].replace(/\bstate\b/g, 'Union Territory')
    : ITEXT[step]);

  const FEEDBACK = {
    wrong: { cls: 'feedback--wrong', img: 'assets/images/feedback-wrong.svg', text: 'Try again!' },
    state: { cls: 'feedback--state', img: 'assets/images/feedback-state.svg', text: 'Good! You got the state right.' },
    capital: { cls: 'feedback--capital', img: 'assets/images/feedback-capital.svg', text: 'Excellent! You got the state and its capital right.' },
  };

  // Every UT gets a solid, easy-to-hit dot in the Union Territories corridor
  // (shown only there). Small UTs have no outline at all; bigger ones keep their
  // outline too, so tapping either one works.
  const UT_DOTS = {
    'andaman-nicobar': POINTS.srivijayapuram,
    chandigarh: POINTS.chandigarh,
    dnhdd: POINTS.daman,
    delhi: POINTS['new-delhi'],
    'jammu-kashmir': POINTS.srinagar,
    ladakh: POINTS.leh,
    lakshadweep: POINTS.kavaratti,
    puducherry: POINTS.puducherry,
  };

  // Island UTs: drawn with a wide invisible tap area, labelled at the capital's island.
  const ISLANDS = new Set(['lakshadweep', 'andaman-nicobar']);


  // Map panel size and the map's full extent (1920x1080 stage coordinates).
  const PANEL_W = 946;
  const PANEL_H = 921;
  const HOME_VIEW = { x: 898, y: 83, w: PANEL_W, h: PANEL_H };
  const MAX_ZOOM = 6;
  const FLIGHT_MS = 2200;
  const CAPITAL_POPUP_DELAY = 1300;
  const CELEBRATION_MS = 3100; // length of the celebration animation; the fact card waits for it
  const BLINK_AFTER = 3; // wrong answers before the correct one starts blinking

  /* ==========================================================================
     DOM + STAGE SCALING
     ========================================================================== */

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const map = $('map');
  const mapPanel = $('mapPanel');
  const answerBtn = $('answerBtn');
  const proceedBtn = $('proceedBtn');
  const capitalPopup = $('capitalPopup');
  const capitalList = $('capitalList');
  const SVG_NS = 'http://www.w3.org/2000/svg';

  let stageScale = 1;

  const fitStage = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / 1920, vh / 1080);
    const x = (vw - 1920 * stageScale) / 2;
    const y = (vh - 1080 * stageScale) / 2;
    const transform = `translate(${x}px, ${y}px) scale(${stageScale})`;
    stage.style.transform = transform;
    $('modal-stage').style.transform = transform; // modals share the stage's position and scale
  };

  fitStage();
  window.addEventListener('resize', fitStage);

  // Turn on the full-viewport modal backdrop (body.has-modal::before) whenever
  // any modal is open, however it was opened or closed.
  const modals = [...document.querySelectorAll('.modal')];
  const syncModalBackdrop = () => {
    document.body.classList.toggle('has-modal', modals.some((m) => !m.hidden));
  };
  const modalWatcher = new MutationObserver(syncModalBackdrop);
  modals.forEach((m) => modalWatcher.observe(m, { attributes: true, attributeFilter: ['hidden'] }));
  syncModalBackdrop();

  /* ==========================================================================
     STATE
     ========================================================================== */

  const state = {
    corridor: null,
    order: [], // shuffled list of the corridor's states
    index: 0,
    step: 'state', // 'state' -> 'capital' -> 'done'
    wrongCount: 0,
    answerShown: false,
    busy: false, // plane flying / waiting for the capital list
    done: new Set(), // state keys already completed in this journey
    lastPoint: null, // where the plane is parked
    legs: [], // flown trail segments [[x1,y1,x2,y2], ...]
    timers: [],
  };

  const later = (fn, ms) => {
    state.timers.push(setTimeout(fn, ms));
  };

  const clearTimers = () => {
    state.timers.forEach(clearTimeout);
    state.timers = [];
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const current = () => state.order[state.index];

  const showScreen = (id) => {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('is-active', s.id === id));
  };

  /* ==========================================================================
     GATEWAY SCREEN
     ========================================================================== */

  const buildGateways = () => {
    const holder = $('gateways');
    CORRIDORS.forEach((corridor, i) => {
      const el = document.createElement('div');
      el.className = 'gateway';
      el.style.left = `${128 + i * 427}px`;
      el.innerHTML = `
        <div class="gateway__card"></div>
        <span class="gateway__tab">Gateway ${i + 1}</span>
        <img class="gateway__art" src="assets/images/gateway-plane.svg" alt="">
        <p class="gateway__name">${corridor.name}<br>Corridor</p>
        <button class="gateway__start" type="button">Start Journey</button>`;
      el.querySelector('button').setAttribute('aria-label', `Start Journey: Gateway ${i + 1}, ${corridor.name} Corridor`);
      el.querySelector('button').addEventListener('click', () => startJourney(corridor));
      holder.appendChild(el);
    });
  };

  /* ==========================================================================
     MAP: shapes, zoom and pan
     ========================================================================== */

  const shapeEls = {};
  let view = { ...HOME_VIEW };

  const buildMap = () => {
    Object.keys(SHAPES).forEach((key) => {
      const g = document.createElementNS(SVG_NS, 'g');
      const ds = SHAPES[key];
      g.setAttribute('class', `state-shape${ISLANDS.has(key) ? ' state-shape--islands' : ''}`);
      g.dataset.state = key;
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      ds.forEach((d) => {
        const p = document.createElementNS(SVG_NS, 'path');
        p.setAttribute('d', d);
        g.appendChild(p);
      });
      map.appendChild(g);
      shapeEls[key] = g;
    });

    Object.keys(UT_DOTS).forEach((key) => {
      const [cx, cy] = UT_DOTS[key];
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('class', 'ut-dot');
      c.setAttribute('cx', cx);
      c.setAttribute('cy', cy);
      c.setAttribute('r', '9');
      c.dataset.state = key;
      c.setAttribute('tabindex', '0');
      c.setAttribute('role', 'button');
      map.appendChild(c);
      if (shapeEls[key]) shapeEls[`${key}-dot`] = c;
      else shapeEls[key] = c;
    });
    setView(HOME_VIEW);
  };

  // Highlightable elements for a state (Daman & Diu = Diu outline + Daman dot).
  const elsFor = (key) => [shapeEls[key], shapeEls[`${key}-dot`]].filter(Boolean);

  const setView = (v) => {
    view = v;
    map.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
    renderOverlay();
  };

  const clampView = (v) => {
    const w = Math.min(HOME_VIEW.w, Math.max(HOME_VIEW.w / MAX_ZOOM, v.w));
    const h = (w * PANEL_H) / PANEL_W;
    const x = Math.min(HOME_VIEW.x + HOME_VIEW.w - w, Math.max(HOME_VIEW.x, v.x));
    const y = Math.min(HOME_VIEW.y + HOME_VIEW.h - h, Math.max(HOME_VIEW.y, v.y));
    return { x, y, w, h };
  };

  // Zoom by `factor` keeping map point (mx, my) fixed on screen.
  const zoomAt = (factor, mx, my) => {
    const w = view.w / factor;
    const h = view.h / factor;
    const fx = (mx - view.x) / view.w;
    const fy = (my - view.y) / view.h;
    setView(clampView({ x: mx - fx * w, y: my - fy * h, w, h }));
  };

  const viewCenter = () => [view.x + view.w / 2, view.y + view.h / 2];

  // map (stage) coordinates <-> map panel pixels
  const toPanel = ([x, y]) => [((x - view.x) / view.w) * PANEL_W, ((y - view.y) / view.h) * PANEL_H];
  const clientToMap = (clientX, clientY) => {
    const r = map.getBoundingClientRect();
    return [view.x + ((clientX - r.left) / r.width) * view.w, view.y + ((clientY - r.top) / r.height) * view.h];
  };

  $('zoomIn').addEventListener('click', () => zoomAt(1.5, ...viewCenter()));
  $('zoomOut').addEventListener('click', () => zoomAt(1 / 1.5, ...viewCenter()));
  $('zoomReset').addEventListener('click', () => setView(HOME_VIEW));

  map.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, ...clientToMap(e.clientX, e.clientY));
  }, { passive: false });

  // Drag to pan; a press that barely moves counts as a tap on a state.
  map.addEventListener('pointerdown', (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startView = { ...view };
    const target = e.target.closest('[data-state]');
    let panning = false;
    try { map.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!panning && Math.hypot(dx, dy) > 6) {
        panning = true;
        map.classList.add('is-panning');
      }
      if (!panning) return;
      const r = map.getBoundingClientRect();
      setView(clampView({
        x: startView.x - (dx / r.width) * startView.w,
        y: startView.y - (dy / r.height) * startView.h,
        w: startView.w,
        h: startView.h,
      }));
    };
    const onUp = () => {
      map.removeEventListener('pointermove', onMove);
      map.removeEventListener('pointerup', onUp);
      map.removeEventListener('pointercancel', onUp);
      map.classList.remove('is-panning');
      if (!panning && target) tapState(target.dataset.state);
    };
    map.addEventListener('pointermove', onMove);
    map.addEventListener('pointerup', onUp);
    map.addEventListener('pointercancel', onUp);
  });

  map.addEventListener('keydown', (e) => {
    const target = e.target.closest('[data-state]');
    if (target && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      tapState(target.dataset.state);
    }
  });

  /* ==========================================================================
     MAP OVERLAY: trail, capital pins, labels, plane
     ========================================================================== */

  const overlay = { pins: [], labels: [], plane: null }; // plane: {pt, angle}

  const anchorFor = (key) => {
    const s = current();
    if (UT_DOTS[key] && !SHAPES[key]) return UT_DOTS[key];
    if (key === 'dnhdd') return POINTS.daman;
    // island groups: point at the capital's island instead of the middle of the sea
    if (ISLANDS.has(key) && s && s.key === key) return POINTS[s.capitalPoints[0]];
    const b = shapeEls[key].getBBox();
    return [b.x + b.width / 2, b.y + b.height / 2];
  };

  const renderOverlay = () => {
    const pins = $('pins');
    pins.innerHTML = '';
    overlay.pins.forEach((pt) => {
      const [x, y] = toPanel(pt);
      [['pin-outer', 8], ['pin-mid', 6], ['pin-outer', 4]].forEach(([cls, r]) => {
        const c = document.createElementNS(SVG_NS, 'circle');
        c.setAttribute('class', cls);
        c.setAttribute('cx', x);
        c.setAttribute('cy', y);
        c.setAttribute('r', r);
        pins.appendChild(c);
      });
    });

    $('trail').setAttribute('d', state.legs.map(([x1, y1, x2, y2]) => {
      const a = toPanel([x1, y1]);
      const b = toPanel([x2, y2]);
      return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
    }).join(''));

    const labelBox = $('mapLabels');
    labelBox.innerHTML = '';
    overlay.labels.forEach(({ text, pt, kind }) => {
      const el = document.createElement('span');
      el.className = `map-label map-label--${kind}`;
      el.textContent = text;
      labelBox.appendChild(el);
      const w = el.offsetWidth;
      const [x, y] = toPanel(pt);
      // state names sit to the left of their state, capitals to the right of the pin;
      // near an edge the bubble is nudged inwards, and only flips sides if it would
      // otherwise cover the point it labels
      let left = kind === 'state' ? Math.max(8, x - w - 30) : Math.min(PANEL_W - w - 8, x + 30);
      let tail = kind === 'state' ? 'tail-right' : 'tail-left';
      if (kind === 'state' && left + w + 12 > x) { left = x + 30; tail = 'tail-left'; }
      if (kind === 'capital' && left < x + 12) { left = x - w - 30; tail = 'tail-right'; }
      el.classList.add(tail);
      el.style.left = `${left}px`;
      el.style.top = `${y - 24}px`;
    });

    const plane = $('plane');
    if (overlay.plane) {
      const [x, y] = toPanel(overlay.plane.pt);
      plane.hidden = false;
      plane.style.transform = `translate(${x}px, ${y}px) rotate(${overlay.plane.angle}rad)`;
    } else {
      plane.hidden = true;
    }
  };

  let planeAnim = null;
  let celebrationAnim = null;

  const ensurePlaneAnim = () => {
    if (planeAnim || !window.lottie || !window.ANIM_DATA) return;
    planeAnim = window.lottie.loadAnimation({
      container: $('plane'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: window.ANIM_DATA.airplane,
    });
  };

  const celebrate = () => {
    if (!window.lottie || !window.ANIM_DATA) return;
    const box = $('celebration');
    box.hidden = false;
    if (celebrationAnim) celebrationAnim.destroy();
    celebrationAnim = window.lottie.loadAnimation({
      container: box,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: window.ANIM_DATA.celebration,
    });
    celebrationAnim.addEventListener('complete', () => { box.hidden = true; });
  };

  // Fly the plane from where it is parked to `to`, drawing the trail behind it.
  const flyTo = (to, done) => {
    ensurePlaneAnim();
    const from = state.lastPoint;
    const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
    const leg = [from[0], from[1], from[0], from[1]];
    state.legs.push(leg);
    // show the plane on its take-off point right away, before the first frame
    overlay.plane = { pt: from, angle };
    renderOverlay();
    const t0 = performance.now();
    let finished = false;

    const step = (now) => {
      if (finished) return;
      const t = Math.min(1, (now - t0) / FLIGHT_MS);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in-out
      const pt = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e];
      leg[2] = pt[0];
      leg[3] = pt[1];
      overlay.plane = { pt, angle };
      renderOverlay();
      if (t < 1) requestAnimationFrame(step);
      else finish();
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      leg[2] = to[0];
      leg[3] = to[1];
      overlay.plane = { pt: to, angle };
      state.lastPoint = to;
      renderOverlay();
      done();
    };
    requestAnimationFrame(step);
    later(finish, FLIGHT_MS + 400); // backup if animation frames are throttled
  };

  /* ==========================================================================
     JOURNEY UI
     ========================================================================== */

  const setSignal = (color) => {
    document.querySelectorAll('.signal__light').forEach((l) => {
      l.classList.toggle('is-on', l.classList.contains(`signal__light--${color}`));
    });
    $('signal').setAttribute('aria-label', `Signal: ${color}`);
  };

  const showFeedback = (kind) => {
    const fb = $('feedback');
    if (!kind) {
      fb.hidden = true;
      return;
    }
    const f = FEEDBACK[kind];
    fb.className = `feedback ${f.cls}`;
    $('feedbackBg').src = f.img;
    $('feedbackText').textContent = f.text;
    fb.hidden = false;
  };

  // While the capital list is open, the clue box and state list are hidden.
  const showCapitalPopup = (visible) => {
    capitalPopup.hidden = !visible;
    $('screen-game').classList.toggle('is-capital-open', visible);
    if (visible) fitCapitalButtons();
  };

  // Long names (e.g. Thiruvananthapuram) shrink until they fit their button.
  // Runs once the list is visible: hidden buttons measure 0 wide and never overflow.
  const fitCapitalButtons = () => {
    capitalList.querySelectorAll('.capital-btn').forEach((b) => {
      let size = 28;
      b.style.fontSize = '';
      while (size > 16 && b.scrollWidth > b.clientWidth) {
        size -= 1;
        b.style.fontSize = `${size}px`;
      }
    });
  };

  const renderStateList = () => {
    const c = state.corridor;
    const title = $('stateListTitle');
    title.innerHTML = c.kind === 'States'
      ? `List of States in<b>${c.name}</b>Corridor:`
      : `List of<b>Union Territories</b>:`;
    const list = $('stateList');
    list.innerHTML = '';
    c.states.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s.name;
      li.dataset.state = s.key;
      if (state.done.has(s.key)) li.classList.add('is-done');
      list.appendChild(li);
    });
    fitStateList();
  };

  // Long lists switch to the compact pill size when they would spill out of the box.
  // Must run while the box is visible (a hidden box measures 0 and never "overflows").
  const fitStateList = () => {
    const box = $('stateList').parentElement;
    if (!box.offsetParent) return;
    box.classList.remove('is-compact');
    if (box.scrollHeight > box.clientHeight) box.classList.add('is-compact');
  };

  // Roboto may finish loading after the first measurement; widths change, so re-check.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitStateList());

  const buildCapitalList = () => {
    const c = state.corridor;
    const capitals = shuffle([...new Set(c.states.map((s) => s.capital))]);
    const longNames = capitals.some((cap) => cap.length > 18);
    capitalPopup.className = 'capital-popup';
    if (longNames) capitalPopup.classList.add('capital-popup--wide', 'capital-popup--long');
    else if (capitals.length > 8) capitalPopup.classList.add('capital-popup--wide', 'capital-popup--three');
    capitalList.innerHTML = '';
    capitals.forEach((cap) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'capital-btn';
      btn.textContent = cap;
      btn.dataset.capital = cap;
      btn.addEventListener('click', () => tapCapital(btn));
      capitalList.appendChild(btn);
    });
    showCapitalPopup(false);
  };

  const setAnswerBtn = () => {
    answerBtn.textContent = state.answerShown ? 'Hide Answer' : 'Show Answer';
    answerBtn.disabled = state.step === 'done' || state.busy;
    map.classList.toggle('is-locked', state.step !== 'state' || state.answerShown || state.busy);
    capitalPopup.classList.toggle('is-locked', state.step !== 'capital' || state.answerShown || state.busy);
  };

  const setLabels = (withCapital) => {
    const s = current();
    overlay.labels = [{ text: s.name, pt: anchorFor(s.key), kind: 'state' }];
    if (withCapital) {
      overlay.labels.push({ text: s.capital, pt: POINTS[s.capitalPoints[0]], kind: 'capital' });
    }
    renderOverlay();
  };

  const loadState = () => {
    clearTimers();
    const s = current();
    state.step = 'state';
    state.wrongCount = 0;
    state.answerShown = false;
    state.busy = false;

    $('gameItext').textContent = itextFor('state');
    const clue = $('clueText');
    clue.innerHTML = '<b>Clue:</b> ';
    clue.appendChild(document.createTextNode(s.clue));

    buildCapitalList(); // also closes the capital list, so the state list is visible to measure
    renderStateList();
    setSignal('red');
    showFeedback(null);
    Object.values(shapeEls).forEach((el) => el.classList.remove('is-hit', 'is-wrong', 'is-blinking'));
    overlay.labels = [];
    renderOverlay();
    proceedBtn.disabled = true;
    proceedBtn.textContent = 'Proceed';
    setAnswerBtn();
  };

  const startJourney = (corridor) => {
    clearTimers();
    state.corridor = corridor;
    state.order = shuffle(corridor.states);
    state.index = 0;
    state.done = new Set();
    // No plane yet: it first appears at the first capital and takes off
    // when the second state's capital is found.
    state.lastPoint = null;
    state.legs = [];
    overlay.pins = [];
    overlay.plane = null;
    Object.values(shapeEls).forEach((el) => el.classList.remove('is-visited'));
    // tiny UT dots only matter in the UT corridor
    Object.keys(UT_DOTS).forEach((k) => {
      const dot = shapeEls[`${k}-dot`] || shapeEls[k];
      dot.style.display = corridor.id === 'ut' ? '' : 'none';
    });
    setView(HOME_VIEW);
    showScreen('screen-game');
    ensurePlaneAnim();
    loadState();
  };

  /* ==========================================================================
     STEP 1: TAP THE STATE
     ========================================================================== */

  const blink = (els) => {
    els.forEach((el) => {
      el.classList.remove('is-blinking');
      void el.getBoundingClientRect();
      el.classList.add('is-blinking');
    });
    later(() => els.forEach((el) => el.classList.remove('is-blinking')), 1600); // 3 blinks x 0.5s
  };

  const tapState = (key) => {
    if (state.step !== 'state' || state.answerShown || state.busy) return;
    const s = current();
    if (key === s.key) {
      state.step = 'capital';
      state.wrongCount = 0;
      elsFor(key).forEach((el) => el.classList.remove('is-blinking'));
      elsFor(key).forEach((el) => el.classList.add('is-hit'));
      setLabels(false);
      setSignal('yellow');
      showFeedback('state');
      state.busy = true;
      setAnswerBtn();
      later(() => {
        state.busy = false;
        showFeedback(null);
        $('gameItext').textContent = itextFor('capital');
        showCapitalPopup(true);
        setAnswerBtn();
      }, CAPITAL_POPUP_DELAY);
    } else {
      state.wrongCount++;
      showFeedback('wrong');
      const wrongEls = elsFor(key);
      wrongEls.forEach((el) => el.classList.add('is-wrong'));
      later(() => wrongEls.forEach((el) => el.classList.remove('is-wrong')), 700);
      if (state.wrongCount >= BLINK_AFTER) blink(elsFor(s.key));
    }
  };

  /* ==========================================================================
     STEP 2: TAP THE CAPITAL
     ========================================================================== */

  const capitalBtnFor = (cap) => capitalList.querySelector(`[data-capital="${CSS.escape(cap)}"]`);

  const tapCapital = (btn) => {
    if (state.step !== 'capital' || state.answerShown || state.busy) return;
    const s = current();
    if (btn.dataset.capital === s.capital) {
      state.step = 'done';
      state.busy = true;
      capitalList.querySelectorAll('.capital-btn').forEach((b) => b.classList.remove('is-wrong'));
      btn.classList.remove('is-blinking');
      btn.classList.add('is-right');
      setSignal('green');
      showFeedback('capital');
      setAnswerBtn();
      celebrate();
      const celebrationStart = performance.now();
      const capitalPoint = POINTS[s.capitalPoints[0]];
      const arrived = () => {
        s.capitalPoints.forEach((p) => overlay.pins.push(POINTS[p]));
        setLabels(true);
        state.busy = false;
        setAnswerBtn();
        later(openFactCard, Math.max(600, CELEBRATION_MS - (performance.now() - celebrationStart)));
      };
      if (state.lastPoint) {
        flyTo(capitalPoint, arrived);
      } else {
        // first capital of the journey: no flight, this is where the plane starts from
        state.lastPoint = capitalPoint;
        arrived();
      }
    } else {
      state.wrongCount++;
      btn.classList.remove('is-wrong');
      void btn.offsetWidth;
      btn.classList.add('is-wrong');
      showFeedback('wrong');
      if (state.wrongCount >= BLINK_AFTER) blink([capitalBtnFor(s.capital)]);
    }
  };

  /* ==========================================================================
     SHOW / HIDE ANSWER
     ========================================================================== */

  const toggleAnswer = () => {
    if (state.step === 'done' || state.busy) return;
    const s = current();
    state.answerShown = !state.answerShown;
    showFeedback(null);
    if (state.step === 'state') {
      elsFor(s.key).forEach((el) => {
        el.classList.remove('is-blinking');
        el.classList.toggle('is-hit', state.answerShown);
      });
      if (state.answerShown) setLabels(false);
      else { overlay.labels = []; renderOverlay(); }
    } else {
      capitalList.querySelectorAll('.capital-btn').forEach((b) => b.classList.remove('is-wrong', 'is-blinking'));
      capitalBtnFor(s.capital).classList.toggle('is-right', state.answerShown);
    }
    setAnswerBtn();
  };

  answerBtn.addEventListener('click', toggleAnswer);

  /* ==========================================================================
     FACT CARD, PROCEED, COMPLETION
     ========================================================================== */

  let lastFocus = null;

  const openModal = (id, focusId) => {
    lastFocus = document.activeElement;
    $(id).hidden = false;
    $(focusId).focus();
  };

  const closeModal = (id) => {
    $(id).hidden = true;
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  };

  const openFactCard = () => {
    const s = current();
    $('factState').textContent = s.name;
    $('factCapital').textContent = s.capital;
    const list = $('factText');
    list.innerHTML = '';
    s.facts.forEach((fact) => {
      const li = document.createElement('li');
      li.textContent = fact;
      list.appendChild(li);
    });
    openModal('factCard', 'factClose');
  };

  $('factClose').addEventListener('click', () => {
    closeModal('factCard');
    const s = current();
    state.done.add(s.key);
    $('stateList').querySelector(`[data-state="${s.key}"]`).classList.add('is-done');
    proceedBtn.disabled = false;
    proceedBtn.focus();
  });

  proceedBtn.addEventListener('click', () => {
    const s = current();
    elsFor(s.key).forEach((el) => {
      el.classList.remove('is-hit');
      el.classList.add('is-visited');
    });
    if (state.index < state.order.length - 1) {
      state.index++;
      loadState();
    } else {
      const c = state.corridor;
      $('completeText').textContent = c.kind === 'States'
        ? `You have explored all the states in the ${c.name} Corridor and found their capitals.`
        : 'You have explored all the Union Territories and found their capitals.';
      proceedBtn.disabled = true;
      openModal('complete', 'completeHome');
    }
  });

  const goHome = () => {
    clearTimers();
    ['factCard', 'insights', 'complete'].forEach((id) => { $(id).hidden = true; });
    showCapitalPopup(false);
    showFeedback(null);
    overlay.plane = null;
    overlay.labels = [];
    overlay.pins = [];
    state.legs = [];
    renderOverlay();
    showScreen('screen-intro');
  };

  $('homeBtn').addEventListener('click', goHome);
  $('completeHome').addEventListener('click', goHome);

  /* ==========================================================================
     INSIGHTS
     ========================================================================== */

  const buildInsights = () => {
    const rows = window.INSIGHTS;
    const half = Math.ceil(rows.length / 2);
    [rows.slice(0, half), rows.slice(half)].forEach((part) => {
      const table = document.createElement('table');
      table.className = 'insights__table';
      table.innerHTML = '<thead><tr><th scope="col">State / Union Territory</th><th scope="col">Capital</th></tr></thead>';
      const body = document.createElement('tbody');
      part.forEach(([name, capital]) => {
        const tr = document.createElement('tr');
        [name, capital].forEach((text) => {
          const td = document.createElement('td');
          td.textContent = text;
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
      table.appendChild(body);
      $('insightsTables').appendChild(table);
    });
  };

  $('insightsBtn').addEventListener('click', () => openModal('insights', 'insightsClose'));
  $('insightsClose').addEventListener('click', () => closeModal('insights'));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('insights').hidden) closeModal('insights');
    else if (!$('factCard').hidden) $('factClose').click();
  });

  /* ==========================================================================
     TEST HELPER
     Jumps straight to the "corridor complete" card, from the console:
       goToResult()        current corridor (or Gateway 1)
       goToResult('ut')    a specific corridor: nw, sc, ene, ut
     ========================================================================== */

  window.goToResult = (corridorId) => {
    const c = CORRIDORS.find((x) => x.id === corridorId) || state.corridor || CORRIDORS[0];
    if (corridorId && !CORRIDORS.some((x) => x.id === corridorId)) {
      console.warn(`goToResult: unknown corridor "${corridorId}". Use ${CORRIDORS.map((x) => x.id).join(', ')}.`);
      return;
    }
    if (state.corridor !== c || !document.getElementById('screen-game').classList.contains('is-active')) startJourney(c);
    ['factCard', 'insights'].forEach((id) => { $(id).hidden = true; });
    state.index = state.order.length - 1;
    state.order.forEach((s) => state.done.add(s.key));
    loadState();
    state.step = 'done';
    setAnswerBtn();
    proceedBtn.disabled = false;
    proceedBtn.click();
    console.log(`Result screen: ${c.name} corridor`);
  };

  /* ==========================================================================
     TEST HELPER: STEP THROUGH
     From the console:
       nextStep()        do the next correct action (tap state -> tap capital ->
                         close fact card -> Proceed); ignored while busy
       autoPlay(ms)      keep calling nextStep every `ms` (default 400) until stopped
       autoPlay(0)       stop
       startCorridor(id) start a corridor: nw, sc, ene, ut
     ========================================================================== */

  let autoTimer = null;

  window.nextStep = () => {
    if (!$('screen-game').classList.contains('is-active')) {
      console.warn('nextStep: no journey running. Use startCorridor("nw" | "sc" | "ene" | "ut").');
      return null;
    }
    if (!$('complete').hidden) return 'complete';
    if (state.busy) return 'busy';
    if (!$('factCard').hidden) { $('factClose').click(); return 'fact closed'; }
    if (state.answerShown) toggleAnswer();
    const s = current();
    if (state.step === 'state') { tapState(s.key); return `state: ${s.name}`; }
    if (state.step === 'capital') { tapCapital(capitalBtnFor(s.capital)); return `capital: ${s.capital}`; }
    if (!proceedBtn.disabled) { proceedBtn.click(); return 'proceed'; }
    return 'waiting';
  };

  window.autoPlay = (ms = 400) => {
    clearInterval(autoTimer);
    autoTimer = null;
    if (!ms) return;
    autoTimer = setInterval(() => {
      if (window.nextStep() === 'complete') { clearInterval(autoTimer); autoTimer = null; }
    }, ms);
  };

  window.startCorridor = (id) => {
    const c = CORRIDORS.find((x) => x.id === id);
    if (!c) {
      console.warn(`startCorridor: unknown corridor "${id}". Use ${CORRIDORS.map((x) => x.id).join(', ')}.`);
      return;
    }
    startJourney(c);
  };

  buildGateways();
  buildMap();
  buildInsights();
});
