'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const DANCES = window.DANCES;
  const ROUNDS = window.ROUNDS;
  const MAP_ORDER = window.MAP_ORDER;
  const SHAPES = window.MAP_SHAPES;
  const MAP_ANCHORS = window.MAP_ANCHORS || {};
  const DECODE_COUNT = window.DECODE_COUNT;

  const byKey = {};
  DANCES.forEach((d) => { byKey[d.key] = d; });

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const IMG = 'assets/images';

  // Positions on the 1920x1080 stage, as in the XD design.
  const MATCH_X = [133, 472, 811, 1150, 1488];
  const TILE_X = [1053, 1208, 1364, 1519, 1674];
  const TILE_Y = [283, 493, 703];

  // The map panel and the map's full extent (stage coordinates).
  const PANEL_W = 948;
  const PANEL_H = 923;
  const HOME_VIEW = { x: 898, y: 83, w: PANEL_W, h: PANEL_H };
  const MAX_ZOOM = 6;
  const NAME_MIN_SIZE = 16; // states smaller than this (map px) get no name when names are shown

  const MATCH_DONE_DELAY = 1100; // ms between the last match and the round popup

  /* ==========================================================================
     DOM + STAGE SCALING
     ========================================================================== */

  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const stage = $('stage');
  const modalStage = $('modal-stage');
  const screens = {
    intro: $('screen-intro'),
    menu: $('screen-menu'),
    match: $('screen-match'),
    map: $('screen-map'),
    decode: $('screen-decode'),
  };

  let stageScale = 1;

  const fitStage = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / 1920, vh / 1080);
    const x = (vw - 1920 * stageScale) / 2;
    const y = (vh - 1080 * stageScale) / 2;
    const transform = `translate(${x}px, ${y}px) scale(${stageScale})`;
    stage.style.transform = transform;
    modalStage.style.transform = transform; // modals share the stage's position and scale
  };

  fitStage();
  window.addEventListener('resize', fitStage);

  // Turn on the full-viewport modal backdrop (body.has-modal::before) whenever
  // any modal is open, however it was opened or closed.
  const modals = [...document.querySelectorAll('.modal')];
  const syncModalBackdrop = () => {
    body.classList.toggle('has-modal', modals.some((m) => !m.hidden));
  };
  const modalWatcher = new MutationObserver(syncModalBackdrop);
  modals.forEach((m) => modalWatcher.observe(m, { attributes: true, attributeFilter: ['hidden'] }));
  syncModalBackdrop();

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

  // screens that show the Help button (the tour itself lives in how-to-use.js)
  const HELP_SCREENS = ['match', 'map', 'decode'];

  const showScreen = (name) => {
    Object.keys(screens).forEach((k) => screens[k].classList.toggle('is-active', k === name));
    body.classList.toggle('is-tinted', name !== 'intro');
    body.classList.toggle('is-menu', name === 'menu');
    $('helpBtn').hidden = !HELP_SCREENS.includes(name);
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const shuffle = (list) => {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const timers = [];
  const later = (fn, ms) => { timers.push(window.setTimeout(fn, ms)); };
  const clearTimers = () => { timers.splice(0).forEach((t) => window.clearTimeout(t)); };

  /* ==========================================================================
     CELEBRATION
     ========================================================================== */

  const CONFETTI_COLOURS = ['#cc004d', '#ff8000', '#ffd04e', '#2e9e3e', '#1e88e5', '#8e24aa'];

  const celebrate = () => {
    const box = $('confetti');
    for (let i = 0; i < 46; i++) {
      const piece = document.createElement('i');
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = CONFETTI_COLOURS[i % CONFETTI_COLOURS.length];
      piece.style.setProperty('--dx', `${(Math.random() - 0.5) * 240}px`);
      piece.style.setProperty('--rot', `${360 + Math.random() * 540}deg`);
      piece.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
      piece.style.animationDelay = `${Math.random() * 0.35}s`;
      box.appendChild(piece);
      window.setTimeout(() => piece.remove(), 3500);
    }
  };

  /* ==========================================================================
     INTRO + HOME
     ========================================================================== */

  const goHome = () => {
    clearTimers();
    ['factModal', 'roundModal', 'placedModal', 'doneModal'].forEach((id) => { $(id).hidden = true; });
    showScreen('menu');
  };

  $('startBtn').addEventListener('click', () => showScreen('menu'));

  // Each level has a thumbnail card and a pill button; either one enters it.
  const LEVEL_START = { 1: () => startMatch(), 2: () => startMap(), 3: () => startDecode() };
  screens.menu.querySelectorAll('[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => LEVEL_START[btn.dataset.level]());
  });
  ['homeBtn1', 'homeBtn2'].forEach((id) => $(id).addEventListener('click', goHome));
  $('homeBtn3').addEventListener('click', goHome);

  /* ==========================================================================
     SCREEN 1: IDENTIFY THE DANCE
     ========================================================================== */

  const match = {
    round: 0,
    selD: null,
    selN: null,
    done: new Set(),
    dancerEls: {},
    nameEls: {},
    slotEls: {},
    locked: false,
  };

  const setMatchFeedback = (text, bad) => {
    const fb = $('matchFeedback');
    fb.textContent = text;
    fb.classList.toggle('is-bad', !!bad);
  };

  const clearMatchSelection = () => {
    match.selD = null;
    match.selN = null;
    Object.values(match.dancerEls).forEach((b) => b.classList.remove('is-selected'));
    Object.values(match.nameEls).forEach((b) => b.classList.remove('is-selected'));
  };

  const shake = (node) => {
    node.classList.remove('is-shake');
    void node.offsetWidth;
    node.classList.add('is-shake');
  };

  const buildRound = () => {
    const keys = ROUNDS[match.round];
    match.done = new Set();
    match.locked = false;
    clearMatchSelection();
    setMatchFeedback('');
    $('matchNext').disabled = true;
    $('roundText').textContent = `Round: ${match.round + 1} of ${ROUNDS.length}`;
    [...$('roundDots').children].forEach((dot, i) => dot.classList.toggle('is-on', i <= match.round));

    const dancers = $('matchDancers');
    const slots = $('matchSlots');
    const names = $('matchNames');
    dancers.innerHTML = '';
    slots.innerHTML = '';
    names.innerHTML = '';
    match.dancerEls = {};
    match.nameEls = {};
    match.slotEls = {};

    keys.forEach((key, i) => {
      const dance = byKey[key];
      const tile = el('button', 'dancer');
      tile.type = 'button';
      tile.style.left = `${MATCH_X[i]}px`;
      tile.style.backgroundImage = `url("${IMG}/dancers/${key}.png")`;
      tile.setAttribute('aria-label', `Dancer ${i + 1}`);
      tile.dataset.key = key;
      tile.addEventListener('click', () => pick('d', key));
      dancers.appendChild(tile);
      match.dancerEls[key] = tile;

      const slot = el('div', 'slot', '?');
      slot.style.left = `${MATCH_X[i]}px`;
      slots.appendChild(slot);
      match.slotEls[key] = slot;
    });

    shuffle(keys).forEach((key, i) => {
      const btn = el('button', 'name', byKey[key].name);
      btn.type = 'button';
      btn.style.left = `${MATCH_X[i]}px`;
      btn.dataset.key = key;
      btn.addEventListener('click', () => pick('n', key));
      names.appendChild(btn);
      match.nameEls[key] = btn;
    });
  };

  const startMatch = () => {
    clearTimers();
    match.round = 0;
    showScreen('match');
    buildRound();
  };

  // A tap on a dancer or on a name: the second tap (of the other kind) makes the pair.
  const pick = (kind, key) => {
    if (match.locked || match.done.has(key)) return;
    const own = kind === 'd' ? 'selD' : 'selN';
    const other = kind === 'd' ? 'selN' : 'selD';
    const set = kind === 'd' ? match.dancerEls : match.nameEls;
    if (match[own] === key) {
      match[own] = null;
      set[key].classList.remove('is-selected');
      return;
    }
    Object.values(set).forEach((b) => b.classList.remove('is-selected'));
    match[own] = key;
    set[key].classList.add('is-selected');
    if (match[other]) judge(kind === 'd' ? key : match.selD, kind === 'n' ? key : match.selN);
  };

  const judge = (dancerKey, nameKey) => {
    const dEl = match.dancerEls[dancerKey];
    const nEl = match.nameEls[nameKey];
    clearMatchSelection();
    if (dancerKey === nameKey) {
      const dance = byKey[dancerKey];
      match.done.add(dancerKey);
      dEl.classList.add('is-done');
      nEl.classList.add('is-used');
      const slot = match.slotEls[dancerKey];
      slot.textContent = dance.name;
      slot.classList.add('is-filled');
      setMatchFeedback('Good match!');
      celebrate();
      if (match.done.size === ROUNDS[match.round].length) roundComplete();
    } else {
      setMatchFeedback('Wrong match! Try again.', true);
      shake(dEl);
      shake(nEl);
    }
  };

  const roundComplete = () => {
    match.locked = true;
    $('matchNext').disabled = false;
    later(() => {
      const keys = ROUNDS[match.round];
      const last = match.round === ROUNDS.length - 1;
      $('roundTitle').textContent = `${keys.length} Dancers met!`;
      const faces = $('roundFaces');
      faces.innerHTML = '';
      keys.forEach((key) => {
        const img = document.createElement('img');
        img.src = `${IMG}/dancers/${key}.png`;
        img.alt = byKey[key].name;
        faces.appendChild(img);
      });
      $('roundNames').textContent = keys.map((k) => byKey[k].name).join(', ');
      $('roundNext').textContent = last ? 'Go to Screen 2' : `Go to Round ${match.round + 2}`;
      openModal('roundModal', 'roundNext');
    }, MATCH_DONE_DELAY);
  };

  const nextRound = () => {
    clearTimers();
    if (match.round < ROUNDS.length - 1) {
      match.round++;
      buildRound();
    } else {
      startMap();
    }
  };

  $('roundNext').addEventListener('click', () => {
    closeModal('roundModal');
    nextRound();
  });
  $('matchNext').addEventListener('click', () => {
    if (!$('matchNext').disabled) nextRound();
  });

  /* ==========================================================================
     SCREEN 2: WHERE DO I BELONG
     ========================================================================== */

  const mapState = {
    selected: null,
    placed: new Map(), // dance key -> state shape key
    answerOn: false,
    answerKey: null,
    namesOn: false,
    busy: false,
  };

  const map = $('map');
  const overlay = $('mapOverlay');
  const shapeEls = {};
  const anchors = {};
  const tileEls = {};
  let view = { ...HOME_VIEW };

  const setBelongFeedback = (text, bad) => {
    const fb = $('belongFeedback');
    fb.textContent = text;
    fb.classList.toggle('is-shown', !!text);
    fb.classList.toggle('is-bad', !!bad);
  };

  const updatePlacedText = () => {
    $('placedText').textContent = `Dancer placed: ${mapState.placed.size} of ${MAP_ORDER.length}`;
  };

  /* ---- map view: zoom and pan ---- */

  const toPanel = ([x, y]) => [((x - view.x) / view.w) * PANEL_W, ((y - view.y) / view.h) * PANEL_H];

  const renderOverlay = () => {
    overlay.innerHTML = '';

    mapState.placed.forEach((shapeKey, danceKey) => {
      const [px, py] = toPanel(anchorFor(shapeKey));
      const img = document.createElement('img');
      img.className = 'map-dancer';
      img.src = `${IMG}/cutouts/${danceKey}.png`;
      img.alt = '';
      img.style.left = `${px}px`;
      img.style.top = `${py + 14}px`;
      overlay.appendChild(img);
    });

    if (mapState.namesOn) {
      Object.keys(shapeEls).forEach((key) => {
        if ([...mapState.placed.values()].includes(key)) return;
        const at = anchorFor(key); // also measures the state's size
        if (shapeSize[key] < NAME_MIN_SIZE) return;
        const [px, py] = toPanel(at);
        const name = el('span', 'map-name', shapeNames[key]);
        name.style.left = `${px}px`;
        name.style.top = `${py}px`;
        overlay.appendChild(name);
      });
    }
  };

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

  const zoomAt = (factor, mx, my) => {
    const w = view.w / factor;
    const h = view.h / factor;
    const fx = (mx - view.x) / view.w;
    const fy = (my - view.y) / view.h;
    setView(clampView({ x: mx - fx * w, y: my - fy * h, w, h }));
  };

  const viewCenter = () => [view.x + view.w / 2, view.y + view.h / 2];

  const clientToMap = (clientX, clientY) => {
    const r = map.getBoundingClientRect();
    return [view.x + ((clientX - r.left) / r.width) * view.w, view.y + ((clientY - r.top) / r.height) * view.h];
  };

  $('zoomIn').addEventListener('click', () => zoomAt(1.5, ...viewCenter()));
  $('zoomOut').addEventListener('click', () => zoomAt(1 / 1.5, ...viewCenter()));
  $('zoomReset').addEventListener('click', () => setView({ ...HOME_VIEW }));

  map.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, ...clientToMap(e.clientX, e.clientY));
  }, { passive: false });

  // Drag to pan; a press that barely moves is a tap on a state.
  map.addEventListener('pointerdown', (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startView = { ...view };
    const target = e.target.closest('[data-shape]');
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
      if (!panning && target) tapState(target.dataset.shape);
    };
    map.addEventListener('pointermove', onMove);
    map.addEventListener('pointerup', onUp);
    map.addEventListener('pointercancel', onUp);
  });

  /* ---- map shapes and where a dancer or a name sits on a state ---- */

  const shapeNames = {
    'andaman-nicobar': 'Andaman and Nicobar Islands',
    'andhra-pradesh': 'Andhra Pradesh',
    'arunachal-pradesh': 'Arunachal Pradesh',
    assam: 'Assam',
    bihar: 'Bihar',
    chhattisgarh: 'Chhattisgarh',
    delhi: 'Delhi',
    dnhdd: 'Dadra and Nagar Haveli and Daman and Diu',
    goa: 'Goa',
    gujarat: 'Gujarat',
    haryana: 'Haryana',
    'himachal-pradesh': 'Himachal Pradesh',
    'jammu-kashmir': 'Jammu and Kashmir',
    jharkhand: 'Jharkhand',
    karnataka: 'Karnataka',
    kerala: 'Kerala',
    ladakh: 'Ladakh',
    lakshadweep: 'Lakshadweep',
    'madhya-pradesh': 'Madhya Pradesh',
    maharashtra: 'Maharashtra',
    manipur: 'Manipur',
    meghalaya: 'Meghalaya',
    mizoram: 'Mizoram',
    nagaland: 'Nagaland',
    odisha: 'Odisha',
    punjab: 'Punjab',
    rajasthan: 'Rajasthan',
    sikkim: 'Sikkim',
    'tamil-nadu': 'Tamil Nadu',
    telangana: 'Telangana',
    tripura: 'Tripura',
    'uttar-pradesh': 'Uttar Pradesh',
    uttarakhand: 'Uttarakhand',
    'west-bengal': 'West Bengal',
  };
  const shapeSize = {};

  const buildMap = () => {
    Object.keys(SHAPES).forEach((key) => {
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'state-shape');
      g.dataset.shape = key;
      SHAPES[key].forEach((d) => {
        const p = document.createElementNS(SVG_NS, 'path');
        p.setAttribute('d', d);
        g.appendChild(p);
      });
      map.appendChild(g);
      shapeEls[key] = g;
    });
  };

  // The roomiest spot inside a state: of a grid of points inside it, the one farthest from its border.
  const anchorFor = (key) => {
    if (anchors[key]) return anchors[key];
    if (MAP_ANCHORS[key]) {
      const [x, y, size] = MAP_ANCHORS[key];
      shapeSize[key] = size;
      anchors[key] = [x, y];
      return anchors[key];
    }
    // not pre-measured: find the point deepest inside the shape (slow)
    const g = shapeEls[key];
    const b = g.getBBox();
    shapeSize[key] = Math.max(b.width, b.height);
    const paths = [...g.querySelectorAll('path')];
    const edge = [];
    paths.forEach((p) => {
      const len = p.getTotalLength();
      const step = Math.max(3, len / 220);
      for (let l = 0; l < len; l += step) {
        const pt = p.getPointAtLength(l);
        edge.push([pt.x, pt.y]);
      }
    });
    let best = [b.x + b.width / 2, b.y + b.height / 2];
    let bestDist = -1;
    const steps = 14;
    for (let i = 1; i < steps; i++) {
      for (let j = 1; j < steps; j++) {
        const x = b.x + (b.width * i) / steps;
        const y = b.y + (b.height * j) / steps;
        const pt = new DOMPoint(x, y);
        if (!paths.some((p) => p.isPointInFill(pt))) continue;
        let min = Infinity;
        for (let k = 0; k < edge.length; k++) {
          const d = (edge[k][0] - x) ** 2 + (edge[k][1] - y) ** 2;
          if (d < min) min = d;
        }
        if (min > bestDist) { bestDist = min; best = [x, y]; }
      }
    }
    anchors[key] = best;
    return best;
  };

  /* ---- the dancer list ---- */

  const buildTiles = () => {
    const box = $('tiles');
    box.innerHTML = '';
    MAP_ORDER.forEach((key, i) => {
      const dance = byKey[key];
      const tile = el('button', 'tile');
      tile.type = 'button';
      tile.style.left = `${TILE_X[i % 5]}px`;
      tile.style.top = `${TILE_Y[Math.floor(i / 5)]}px`;
      tile.setAttribute('aria-label', dance.name);
      tile.dataset.key = key;
      const img = el('span', 'tile__img');
      img.style.backgroundImage = `url("${IMG}/dancers/${key}.png")`;
      tile.appendChild(img);
      tile.appendChild(el('span', 'tile__name', dance.name));
      tile.addEventListener('click', () => selectTile(key));
      box.appendChild(tile);
      tileEls[key] = tile;
    });
  };

  const selectTile = (key) => {
    if (mapState.placed.has(key) || mapState.busy) return;
    mapState.selected = mapState.selected === key ? null : key;
    Object.keys(tileEls).forEach((k) => tileEls[k].classList.toggle('is-selected', k === mapState.selected));
    if (mapState.answerOn) {
      mapState.answerKey = mapState.selected || firstUnplaced();
      showAnswerState();
    }
    setBelongFeedback('');
  };

  const firstUnplaced = () => MAP_ORDER.find((k) => !mapState.placed.has(k)) || null;

  /* ---- placing a dancer on a state ---- */

  const lockMap = () => {
    map.classList.toggle('is-locked', mapState.answerOn || mapState.busy);
  };

  const tapState = (shapeKey) => {
    if (mapState.answerOn || mapState.busy) return;
    const key = mapState.selected;
    if (!key) {
      setBelongFeedback('Tap a dancer first.', true);
      return;
    }
    const dance = byKey[key];
    const g = shapeEls[shapeKey];
    if (shapeKey === dance.shape) {
      mapState.placed.set(key, shapeKey);
      mapState.selected = null;
      mapState.busy = true;
      lockMap();
      tileEls[key].classList.remove('is-selected');
      tileEls[key].classList.add('is-placed');
      g.classList.add('is-placed');
      updatePlacedText();
      renderOverlay();
      setBelongFeedback('Well done!');
      celebrate();
      later(() => openFact(dance), 900);
    } else {
      g.classList.add('is-wrong');
      later(() => g.classList.remove('is-wrong'), 700);
      setBelongFeedback('Try Again!', true);
    }
  };

  const openFact = (dance) => {
    $('factImg').src = `${IMG}/dancers/${dance.key}.png`;
    $('factImg').alt = dance.name;
    $('factName').textContent = dance.name;
    $('factState').textContent = dance.state;
    $('factText').textContent = dance.fact;
    openModal('factModal', 'factClose');
  };

  $('factClose').addEventListener('click', () => {
    closeModal('factModal');
    mapState.busy = false;
    lockMap();
    if (mapState.placed.size === MAP_ORDER.length) {
      $('mapNext').disabled = false;
      setBelongFeedback('Well done!');
      celebrate();
      later(() => openModal('placedModal', 'placedNext'), 500);
    } else if (mapState.answerOn) {
      mapState.answerKey = mapState.selected || firstUnplaced();
      showAnswerState();
    }
  });

  $('placedNext').addEventListener('click', () => {
    closeModal('placedModal');
    startDecode();
  });
  $('mapNext').addEventListener('click', () => {
    if (!$('mapNext').disabled) startDecode();
  });

  /* ---- Show Answer and Show Names ---- */

  const showAnswerState = () => {
    Object.values(shapeEls).forEach((g) => g.classList.remove('is-answer'));
    if (mapState.answerOn && mapState.answerKey) {
      shapeEls[byKey[mapState.answerKey].shape].classList.add('is-answer');
    }
    Object.keys(tileEls).forEach((k) => tileEls[k].classList.toggle('is-answer', mapState.answerOn && k === mapState.answerKey));
    lockMap();
    renderOverlay();
  };

  $('answerBtn').addEventListener('click', () => {
    if (mapState.busy) return;
    mapState.answerOn = !mapState.answerOn;
    mapState.answerKey = mapState.answerOn ? (mapState.selected || firstUnplaced()) : null;
    $('answerBtn').textContent = mapState.answerOn ? 'Hide Answer' : 'Show Answer';
    $('answerBtn').classList.toggle('is-on', mapState.answerOn);
    showAnswerState();
  });

  $('namesBtn').addEventListener('click', () => {
    mapState.namesOn = !mapState.namesOn;
    $('namesBtn').textContent = mapState.namesOn ? 'Hide Names' : 'Show Names';
    $('namesBtn').classList.toggle('is-on', mapState.namesOn);
    renderOverlay();
  });

  const startMap = () => {
    clearTimers();
    mapState.selected = null;
    mapState.placed = new Map();
    mapState.answerOn = false;
    mapState.answerKey = null;
    mapState.namesOn = false;
    mapState.busy = false;
    $('answerBtn').textContent = 'Show Answer';
    $('answerBtn').classList.remove('is-on');
    $('namesBtn').textContent = 'Show Names';
    $('namesBtn').classList.remove('is-on');
    $('mapNext').disabled = true;
    setBelongFeedback('');
    updatePlacedText();
    buildTiles();
    Object.values(shapeEls).forEach((g) => g.classList.remove('is-placed', 'is-wrong', 'is-answer'));
    lockMap();
    showScreen('map');
    setView({ ...HOME_VIEW });
  };

  /* ==========================================================================
     SCREEN 3: WHO AM I
     ========================================================================== */

  const decode = {
    cases: [],
    index: 0,
    slots: [], // { letter, given, el }
    solved: false,
    allDone: false,
  };

  const ROW_WIDTH = 1090;

  const buildCase = () => {
    const dance = decode.cases[decode.index];
    decode.solved = false;
    $('caseText').textContent = `Case: ${decode.index + 1} of ${decode.cases.length}`;
    $('clueText').textContent = dance.clue;
    $('nextClue').disabled = true;
    $('whoImg').src = `${IMG}/silhouettes/${dance.key}.png`;
    $('whoImg').alt = 'The silhouette of a dancer';
    $('whoCaption').textContent = 'Who am I?';

    // the word: letters that are already shown, and blanks to fill
    const pattern = dance.pattern.split(/\s+/);
    const letters = dance.word.replace(/\s+/g, '').split('');
    const hasGap = /\s/.test(dance.word);
    const missing = [];
    let n = 0;
    const cells = [];
    dance.word.split('').forEach((ch) => {
      if (ch === ' ') { cells.push({ gap: true }); return; }
      const shown = pattern[n] !== '_';
      cells.push({ letter: ch, given: shown });
      if (!shown) missing.push(ch);
      n++;
    });
    const tray = shuffle(missing.concat(dance.decoys.split('')));

    // letter boxes shrink to keep long names on one row
    const count = Math.max(letters.length, tray.length);
    const gapRatio = 0.325;
    const extra = hasGap ? 0.7 : 0;
    const size = Math.min(94, Math.floor(ROW_WIDTH / (count + (count - 1) * gapRatio + extra)));
    const gap = Math.round(size * gapRatio);

    const blankRow = $('blankRow');
    const trayRow = $('trayRow');
    blankRow.innerHTML = '';
    trayRow.innerHTML = '';
    decode.slots = [];

    const styleLetter = (node) => {
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.fontSize = `${Math.round(size * 0.48)}px`;
    };

    cells.forEach((cell, i) => {
      const node = el('div', 'letter letter--blank');
      styleLetter(node);
      if (i > 0) node.style.marginLeft = `${gap}px`;
      if (cell.gap) {
        node.className = 'letter letter--gap';
        node.style.width = `${Math.round(size * extra)}px`;
        node.style.marginLeft = '0';
        blankRow.appendChild(node);
        return;
      }
      if (cell.given) {
        node.classList.add('is-filled');
        node.style.animation = 'none';
        node.textContent = cell.letter;
      }
      node.dataset.letter = cell.letter;
      blankRow.appendChild(node);
      decode.slots.push({ letter: cell.letter, given: cell.given, el: node });
    });

    tray.forEach((letter, i) => {
      const tile = el('button', 'letter letter--tile', letter);
      tile.type = 'button';
      styleLetter(tile);
      if (i > 0) tile.style.marginLeft = `${gap}px`;
      tile.addEventListener('click', () => pickLetter(tile, letter));
      trayRow.appendChild(tile);
    });
  };

  const pickLetter = (tile, letter) => {
    if (decode.solved || tile.classList.contains('is-used')) return;
    const slot = decode.slots.find((s) => !s.given && !s.el.classList.contains('is-filled'));
    if (!slot) return;
    if (slot.letter === letter) {
      slot.el.textContent = letter;
      slot.el.classList.remove('is-wrong');
      slot.el.classList.add('is-filled');
      tile.classList.add('is-used');
      if (decode.slots.every((s) => s.el.classList.contains('is-filled'))) caseSolved();
    } else {
      slot.el.textContent = letter;
      slot.el.classList.add('is-wrong');
      shake(tile);
      // a correct tap during this delay may already have filled the slot; keep that letter
      later(() => {
        if (slot.el.classList.contains('is-filled')) return;
        slot.el.classList.remove('is-wrong');
        slot.el.textContent = '';
      }, 700);
    }
  };

  const caseSolved = () => {
    decode.solved = true;
    const dance = decode.cases[decode.index];
    $('whoImg').src = `${IMG}/cutouts/${dance.key}.png`;
    $('whoImg').alt = dance.name;
    $('whoCaption').textContent = dance.name;
    celebrate();
    if (decode.index < decode.cases.length - 1) {
      $('nextClue').disabled = false;
    } else {
      decode.allDone = true;
      $('homeBtn3').disabled = false;
      later(() => openModal('doneModal', 'doneHome'), 900);
    }
  };

  $('nextClue').addEventListener('click', () => {
    if ($('nextClue').disabled) return;
    decode.index++;
    buildCase();
  });

  $('doneHome').addEventListener('click', goHome);

  const startDecode = () => {
    clearTimers();
    decode.cases = shuffle(DANCES).slice(0, DECODE_COUNT);
    decode.index = 0;
    decode.allDone = false;
    $('homeBtn3').disabled = true;
    showScreen('decode');
    buildCase();
  };

  /* ==========================================================================
     KEYBOARD + BOOT
     ========================================================================== */

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('factModal').hidden) $('factClose').click();
    else if (!$('doneModal').hidden) $('doneHome').click();
  });

  /* ==========================================================================
     TEST HELPERS (browser console)
     ========================================================================== */

  // Fills every blank of the current "Who am I?" case with the right letter.
  const solveCase = () => {
    if (!screens.decode.classList.contains('is-active') || decode.solved) return;
    decode.slots.forEach((s) => {
      s.el.textContent = s.letter;
      s.el.classList.remove('is-wrong');
      s.el.classList.add('is-filled');
    });
    caseSolved();
  };

  // Opens level 3 on its last case and solves it, which brings up the Congratulations popup.
  const testDoneModal = () => {
    startDecode();
    decode.index = decode.cases.length - 1;
    buildCase();
    solveCase();
  };

  window.wg215Test = { solveCase, testDoneModal };

  buildMap();
});
