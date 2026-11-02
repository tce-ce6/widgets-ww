/* ==========================================================================
   Temple Architecture (wg226) - widget logic
   Plain ES6+, no dependencies. Sections:
     1. Helpers, stage scaling and modals
     2. Drag and tap engine
     3. Screen 1: The Mystery
     4. Screen 2: Temple Walk (map, route, cards)
     5. Screen 2: Climb the vimāna (side view)
     6. Screen 3: Four temples, one idea
     7. Reset, keyboard and test helpers
   ========================================================================== */
(function () {
  'use strict';

  const LEVELS = window.LEVELS;
  const STOPS = window.STOPS;
  const TEMPLES = window.TEMPLES;
  const ITEXT = window.ITEXT;

  /* ------------------------------------------------------------------------
     1. HELPERS, STAGE SCALING AND MODALS
     ------------------------------------------------------------------------ */

  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const body = document.body;
  const stage = $('stage');
  const modalStage = $('modal-stage');

  let stageScale = 1;
  let stageOrigin = [0, 0];

  /** Fits the fixed 1920x1080 stage (and the modal stage) inside the window, centred. */
  function fitStage() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / 1920, vh / 1080);
    stageOrigin = [(vw - 1920 * stageScale) / 2, (vh - 1080 * stageScale) / 2];
    const transform = `translate(${stageOrigin[0]}px, ${stageOrigin[1]}px) scale(${stageScale})`;
    stage.style.transform = transform;
    modalStage.style.transform = transform;
  }

  const toStage = (clientX, clientY) => ({
    x: (clientX - stageOrigin[0]) / stageScale,
    y: (clientY - stageOrigin[1]) / stageScale,
  });

  function goTo(id) {
    $$('.screen.is-active').forEach((screen) => screen.classList.remove('is-active'));
    $(`screen-${id}`).classList.add('is-active');
  }

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

  // Turn on the full-viewport modal backdrop whenever a modal is open.
  const modals = $$('.modal');
  const syncModalBackdrop = () => {
    body.classList.toggle('has-modal', modals.some((m) => !m.hidden));
  };
  const modalWatcher = new MutationObserver(syncModalBackdrop);
  modals.forEach((m) => modalWatcher.observe(m, { attributes: true, attributeFilter: ['hidden'] }));

  let lastFocus = null;
  const openModal = (id, focusId) => {
    lastFocus = document.activeElement;
    $(id).hidden = false;
    $(focusId).focus();
  };
  const closeModal = (id) => {
    $(id).hidden = true;
    if (lastFocus && body.contains(lastFocus)) lastFocus.focus();
  };

  /* ------------------------------------------------------------------------
     2. DRAG AND TAP ENGINE
     A tag can be dragged onto a target, or tapped and then the target tapped.
     ------------------------------------------------------------------------ */

  const dragLayer = $('dragLayer');
  let selected = null;

  function select(chip) {
    if (selected) selected.classList.remove('is-selected');
    selected = chip && chip !== selected ? chip : null;
    if (selected) selected.classList.add('is-selected');
  }

  function makeMovable(chip, targetSelector, canMove, onDrop) {
    let start = null;
    let ghost = null;
    let over = null;
    let dragged = false;

    const setOver = (target) => {
      if (over === target) return;
      if (over) over.classList.remove('is-target');
      over = target;
      if (over) over.classList.add('is-target');
    };

    chip.addEventListener('pointerdown', (e) => {
      if (e.button > 0 || !canMove()) return;
      start = [e.clientX, e.clientY];
      dragged = false;
      chip.setPointerCapture(e.pointerId);
    });

    chip.addEventListener('pointermove', (e) => {
      if (!start) return;
      if (!ghost && Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 6) {
        const rect = chip.getBoundingClientRect();
        ghost = chip.cloneNode(true);
        ghost.classList.add('drag-ghost');
        ghost.classList.remove('is-selected');
        ghost.style.left = '0';
        ghost.style.top = '0';
        ghost.style.width = `${rect.width / stageScale}px`;
        ghost.style.height = `${rect.height / stageScale}px`;
        dragLayer.appendChild(ghost);
        chip.classList.add('is-dragging');
        dragged = true;
        select(null);
      }
      if (!ghost) return;
      const p = toStage(e.clientX, e.clientY);
      ghost.style.left = `${p.x}px`;
      ghost.style.top = `${p.y}px`;
      const under = document.elementFromPoint(e.clientX, e.clientY);
      setOver(under ? under.closest(targetSelector) : null);
    });

    const finish = () => {
      if (!start) return;
      start = null;
      if (!ghost) return;
      ghost.remove();
      ghost = null;
      chip.classList.remove('is-dragging');
      const target = over;
      setOver(null);
      if (target) onDrop(chip, target);
    };
    chip.addEventListener('pointerup', finish);
    chip.addEventListener('pointercancel', finish);

    chip.addEventListener('click', () => {
      if (dragged) { dragged = false; return; }
      if (canMove()) select(chip);
    });
  }

  /* ------------------------------------------------------------------------
     3. SCREEN 1: THE MYSTERY
     ------------------------------------------------------------------------ */

  // Top to bottom on the tower, as in the XD layout: level index, slot top, lead dot.
  const SLOTS = [
    { level: 6, top: 239, dot: [416, 268] },
    { level: 5, top: 305, dot: [447, 336] },
    { level: 4, top: 373, dot: [450, 384] },
    { level: 3, top: 486, dot: [490, 515] },
    { level: 2, top: 582, dot: [524, 610] },
    { level: 1, top: 737, dot: [564, 767] },
    { level: 0, top: 868, dot: [634, 901] },
  ];
  const SLOT_X = 711;
  const TAG_POSITIONS = [[1078, 435], [1314, 435], [1551, 435], [1078, 528], [1314, 528], [1551, 528], [1315, 621]];

  const guess = {}; // level index -> tag key
  let locked = false;
  const slotEls = {};
  const tagEls = {};

  const tagOf = (key) => LEVELS.find((l) => l.key === key).tag;

  function leadsMarkup(dx, dy, endX) {
    return SLOTS.map(({ dot }) => {
      const cx = dot[0] + dx;
      const cy = dot[1] + dy;
      return `<path d="M${cx} ${cy}H${endX}" fill="none" stroke="#522810" stroke-width="2" stroke-dasharray="4 4"/>`
        + `<circle cx="${cx}" cy="${cy}" r="7" fill="#522810"/>`;
    }).join('');
  }

  function buildMystery() {
    $('towerLeads').innerHTML = leadsMarkup(0, 0, SLOT_X);
    const slots = $('slots');
    slots.innerHTML = '';
    SLOTS.forEach(({ level, top }) => {
      const slot = el('button', 'slot');
      slot.type = 'button';
      slot.style.left = `${SLOT_X}px`;
      slot.style.top = `${top}px`;
      slot.dataset.level = level;
      slot.setAttribute('aria-label', `Label for the ${LEVELS[level].part.toLowerCase()} of the tower, empty`);
      slot.addEventListener('click', () => tapSlot(level));
      slots.appendChild(slot);
      slotEls[level] = slot;
    });

    const tray = $('tagTray');
    tray.innerHTML = '';
    shuffle(LEVELS).forEach((level, i) => {
      const tag = el('button', 'body-tag', level.tag);
      tag.type = 'button';
      tag.style.left = `${TAG_POSITIONS[i][0]}px`;
      tag.style.top = `${TAG_POSITIONS[i][1]}px`;
      tag.dataset.key = level.key;
      makeMovable(tag, '.slot', () => !locked, (chip, target) => placeTag(chip.dataset.key, +target.dataset.level));
      tray.appendChild(tag);
      tagEls[level.key] = tag;
    });
  }

  function tapSlot(level) {
    if (locked) return;
    if (selected && selected.classList.contains('body-tag')) {
      placeTag(selected.dataset.key, level);
    } else if (guess[level]) {
      delete guess[level];
      refreshMystery();
    }
  }

  // A tag dropped on a filled box swaps it: the old tag goes back to the tray.
  function placeTag(key, level) {
    Object.keys(guess).forEach((k) => { if (guess[k] === key) delete guess[k]; });
    guess[level] = key;
    select(null);
    refreshMystery();
  }

  function refreshMystery() {
    const placed = new Set(Object.values(guess));
    LEVELS.forEach((level, i) => {
      const key = guess[i];
      const slot = slotEls[i];
      slot.textContent = key ? tagOf(key) : '';
      slot.classList.toggle('is-filled', !!key);
      slot.setAttribute('aria-label', `Label for the ${level.part.toLowerCase()} of the tower, ${key ? `holds ${tagOf(key)}` : 'empty'}`);
      tagEls[level.key].hidden = placed.has(level.key);
    });
    const count = placed.size;
    $('placedCount').textContent = `${count} of ${LEVELS.length} placed`;
    $('lockBtn').disabled = count < LEVELS.length;
  }

  $('startBtn').addEventListener('click', () => goTo('mystery'));

  $('lockBtn').addEventListener('click', () => {
    locked = true;
    select(null);
    SLOTS.forEach(({ level }) => {
      slotEls[level].classList.add('is-locked');
      slotEls[level].disabled = true;
    });
    $('lockBtn').hidden = true;
    $('placedCount').hidden = true;
    $('lockMsg').hidden = false;
    $('walkBtn').hidden = false;
    $('mysteryItext').textContent = ITEXT.mysteryLocked;
    $('walkBtn').focus();
  });

  $('walkBtn').addEventListener('click', () => {
    goTo('walk');
    startWalk();
  });

  /* ------------------------------------------------------------------------
     4. SCREEN 2: TEMPLE WALK
     The plan and route are in the wireframe's 1000x560 map units (mapSvg in
     Temple Architecture.html); the map svg just changes its viewBox to pan and zoom.
     ------------------------------------------------------------------------ */

  const PANE_W = 1302;
  const PANE_H = 944;
  const PLAN_HOME = { x: 0, y: -82.5, w: 1000, h: 725 }; // the whole plan, at the map's shape
  const ELEV_Y = 2000; // the side view is drawn this far below the plan in the same svg
  const ELEV_HOME = { x: 31, y: 110 + ELEV_Y, w: PANE_W, h: PANE_H };
  const ELEV_TOP_HOME = { x: 40, y: -19 + ELEV_Y, w: 1680, h: 1218 }; // wider, with the second figure
  const MAX_ZOOM = 7;

  const START = [992, 280];

  // Route geometry, from the wireframe. `path` runs from the previous stop;
  // `loop` is an extra lap walked only when arriving at that stop.
  const ROUTE = {
    gopuram: { pin: [940, 202], pos: [940, 280], cam: [820, 170, 200, 220], path: [[940, 280]] },
    prakara: {
      pin: [860, 478],
      pos: [850, 280],
      cam: null,
      path: [[902, 280]],
      loop: [[902, 502], [58, 502], [58, 58], [902, 58], [902, 280], [850, 280]],
    },
    nandi: { pin: [715, 226], pos: [715, 280], cam: [650, 220, 130, 120], path: [[715, 280]] },
    shrines: { pin: [530, 110], pos: [427, 156], cam: [290, 40, 320, 260], path: [[640, 280], [640, 168], [427, 168], [427, 156]] },
    mandapa: { pin: [465, 196], pos: [465, 280], cam: [315, 150, 330, 220], path: [[427, 168], [640, 168], [640, 280], [465, 280]] },
    corridor: {
      pin: [172, 300],
      pos: [287, 280],
      cam: [110, 165, 240, 230],
      path: [[287, 280]],
      loop: [[287, 338], [172, 338], [172, 222], [287, 222], [287, 280]],
    },
    garbha: { pin: [252, 256], pos: [230, 280], cam: [140, 195, 180, 170], path: [[230, 280]] },
    vimana: { pin: [230, 150], pos: [230, 280], cam: null, path: [] },
  };
  // The dashed red line drawn on the plan.
  const ROUTE_LINE = [
    START, [940, 280], [850, 280], [715, 280], [640, 280], [640, 168], [427, 168], [427, 156], [427, 168],
    [640, 168], [640, 280], [600, 280], [465, 280], [320, 280], [287, 280], [287, 338], [172, 338],
    [172, 222], [287, 222], [287, 280], [230, 280],
  ];

  /** The model temple plan, as in the wireframe (simplified, not to scale). */
  function planTemple() {
    const INK = '#22303A';
    const C = { lawn: '#F8EBB8', court: '#F7E1B6', stone: '#C2B9A5', deep: '#8C8270', corr: '#DDD6C4' };
    const rect = (x, y, w, h, fill, stroke, sw, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}${extra}/>`;
    const dot = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
    const line = (x1, y1, x2, y2, stroke, sw) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"/>`;
    let p = rect(-2000, -2000, 5000, 4560, C.lawn);
    p += rect(40, 40, 880, 480, C.court, INK, 3.5);
    p += rect(58, 58, 844, 444, 'none', C.deep, 1, ' stroke-dasharray="3 4"');
    // gopuram
    p += rect(898, 222, 86, 116, C.stone, INK, 2);
    p += rect(908, 232, 66, 96, 'none', C.deep, 1);
    p += rect(897, 265, 88, 30, C.court);
    // secondary shrines
    [[395, 78, 64], [715, 420, 52], [95, 420, 52]].forEach(([x, y, w]) => {
      p += rect(x, y, w, w, C.stone, INK, 1.5);
      p += rect(x + w * 0.3, y + w * 0.3, w * 0.4, w * 0.4, C.deep);
    });
    // Nandi pavilion
    p += rect(680, 245, 70, 70, C.stone, INK, 1.5);
    p += rect(690, 255, 50, 50, C.court);
    [[686, 251], [744, 251], [686, 309], [744, 309]].forEach(([x, y]) => { p += dot(x, y, 3.5, INK); });
    p += `<ellipse cx="721" cy="280" rx="14" ry="8" fill="${C.deep}"/>`;
    p += dot(703, 280, 5.5, C.deep);
    // steps and maṇḍapa
    p += rect(604, 258, 24, 44, C.stone, INK, 1);
    [612, 620].forEach((x) => { p += line(x, 258, x, 302, C.deep, 1); });
    p += rect(330, 215, 275, 130, C.stone, INK, 2);
    p += rect(342, 227, 251, 106, C.court);
    p += line(468, 227, 468, 266, INK, 2) + line(468, 294, 468, 333, INK, 2);
    [[360, 450], [490, 580]].forEach(([a, b]) => {
      for (let x = a; x <= b; x += 22) [244, 267, 293, 316].forEach((y) => { p += dot(x, y, 3, INK); });
    });
    // vimāna, corridor and garbhagṛiha
    p += rect(122, 172, 216, 216, 'none', C.deep, 1);
    p += rect(130, 180, 200, 200, C.stone, INK, 2.5);
    p += rect(155, 205, 150, 150, C.corr, INK, 1.2);
    p += rect(190, 240, 80, 80, C.deep, INK, 2);
    p += rect(202, 252, 56, 56, '#6F6656');
    p += dot(230, 280, 12, C.stone) + dot(230, 280, 5, INK);
    p += rect(264, 268, 12, 24, C.corr);
    p += rect(300, 266, 44, 28, C.court);
    return p;
  }

  function buildPlan() {
    const plan = planTemple();
    const points = ROUTE_LINE.map((pt) => pt.join(',')).join(' ');
    $('plan').innerHTML = plan;
    $('mmPlan').innerHTML = plan;
    $('routeLine').setAttribute('points', points);
    $('mmRoute').setAttribute('points', points);
  }

  const WALK_STOPS = STOPS.length - 1; // the last stop (vimāna) opens the side view

  const map = $('map');
  const overlay = $('mapOverlay');
  const qState = {}; // stop id -> { opts, picked }

  const walk = {
    idx: -1, // -1: at the start, before the gopuram
    dot: START.slice(),
    busy: false,
    elev: false,
    lvl: 0,
    frame: 0,
  };
  let view = { ...PLAN_HOME };
  const pinEls = {};
  let walker = null;
  let arrow = null;

  const homeView = () => {
    if (!walk.elev) return PLAN_HOME;
    return walk.lvl === LEVELS.length - 1 ? ELEV_TOP_HOME : ELEV_HOME;
  };

  /** Widens a camera rectangle to the map's shape, keeping its centre. */
  function fit([x, y, w, h]) {
    const aspect = PANE_W / PANE_H;
    let fw = w;
    let fh = h;
    if (fw / fh < aspect) fw = fh * aspect; else fh = fw / aspect;
    return { x: x + w / 2 - fw / 2, y: y + h / 2 - fh / 2, w: fw, h: fh };
  }

  const project = ([x, y]) => [((x - view.x) / view.w) * PANE_W, ((y - view.y) / view.h) * PANE_H];

  function applyView() {
    map.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
    positionOverlay();
    updateMini();
  }

  function clampView(v) {
    const home = homeView();
    const w = Math.min(home.w, Math.max(home.w / MAX_ZOOM, v.w));
    const h = w * (PANE_H / PANE_W);
    return {
      x: Math.min(home.x + home.w - w, Math.max(home.x, v.x)),
      y: Math.min(home.y + home.h - h, Math.max(home.y, v.y)),
      w,
      h,
    };
  }

  function updateMini() {
    // only the part of the view that is over the 1000x560 plan
    const box = $('mmView');
    const x = Math.max(0, view.x);
    const y = Math.max(0, view.y);
    box.setAttribute('x', x);
    box.setAttribute('y', y);
    box.setAttribute('width', Math.max(0, Math.min(1000, view.x + view.w) - x));
    box.setAttribute('height', Math.max(0, Math.min(560, view.y + view.h) - y));
    $('mmDot').setAttribute('cx', walk.dot[0]);
    $('mmDot').setAttribute('cy', walk.dot[1]);
  }

  /* ---- pins, the red dot and the arrow ---- */

  function buildOverlay() {
    overlay.innerHTML = '';
    STOPS.forEach((stop, i) => {
      const pin = el('button', 'pin');
      pin.type = 'button';
      pin.setAttribute('aria-label', `Stop ${i + 1}: ${stop.name}`);
      pin.appendChild(el('span', 'pin__num', String(i + 1)));
      pin.appendChild(document.createTextNode(stop.name));
      pin.addEventListener('click', () => { if (!walk.busy) jumpTo(i); });
      overlay.appendChild(pin);
      pinEls[stop.id] = pin;
    });
    walker = el('div', 'walker');
    overlay.appendChild(walker);
    arrow = el('button', 'walk-arrow');
    arrow.type = 'button';
    arrow.setAttribute('aria-label', 'Walk on');
    arrow.innerHTML = '<svg viewBox="0 0 60 60"><path d="M15 30h30M15 30l9-9M15 30l9 9"/></svg>';
    arrow.addEventListener('click', () => { if (!walk.busy) next(); });
    overlay.appendChild(arrow);
  }

  // Where the arrow sits and points: towards the next stop on the route.
  function arrowHeading() {
    if (walk.elev) return { at: [553, levelDot(walk.lvl)[1] + ELEV_Y], dir: [0, -1] };
    const nextStop = STOPS[walk.idx + 1];
    if (nextStop.id === 'vimana') return { at: walk.dot, dir: [0, -1] }; // look up: the tower is above
    const target = ROUTE[nextStop.id].path[0];
    const dx = target[0] - walk.dot[0];
    const dy = target[1] - walk.dot[1];
    const len = Math.hypot(dx, dy) || 1;
    return { at: walk.dot, dir: [dx / len, dy / len] };
  }

  function positionOverlay() {
    STOPS.forEach((stop, i) => {
      const pin = pinEls[stop.id];
      const [sx, sy] = project(ROUTE[stop.id].pin);
      pin.hidden = walk.elev;
      pin.style.left = `${sx}px`;
      pin.style.top = `${sy}px`;
      pin.classList.toggle('is-current', i === walk.idx);
      pin.classList.toggle('is-visited', i < walk.idx);
    });
    const dotAt = walk.elev ? [553, levelDot(walk.lvl)[1] + ELEV_Y] : walk.dot;
    const [dx, dy] = project(dotAt);
    walker.style.left = `${dx}px`;
    walker.style.top = `${dy}px`;

    const heading = arrowHeading();
    const lastLevel = walk.elev && walk.lvl === LEVELS.length - 1;
    arrow.hidden = walk.busy || !heading || lastLevel;
    if (!arrow.hidden) {
      const [ax, ay] = project(heading.at);
      arrow.style.left = `${ax + heading.dir[0] * 52}px`;
      arrow.style.top = `${ay + heading.dir[1] * 52}px`;
      const angle = (Math.atan2(heading.dir[1], heading.dir[0]) * 180) / Math.PI + 180;
      arrow.style.transform = `rotate(${angle}deg)`;
    }
  }

  /* ---- walking: the dot follows the route while the camera eases to the stop ---- */

  const camFor = (id) => (ROUTE[id].cam ? fit(ROUTE[id].cam) : { ...PLAN_HOME });

  function travel(points, cam, done) {
    cancelAnimationFrame(walk.frame);
    const pts = [walk.dot.slice(), ...points];
    const lengths = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const total = lengths.reduce((a, b) => a + b, 0);
    const from = { ...view };

    const finish = () => {
      walk.dot = pts[pts.length - 1].slice();
      view = { ...cam };
      walk.busy = false;
      applyView();
      setNavDisabled(false);
      if (done) done();
    };

    if (reduceMotion) { finish(); return; }

    walk.busy = true;
    setNavDisabled(true);
    const duration = Math.max(900, Math.min(6500, (total / 480) * 1000));
    const begin = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - begin) / duration);
      const ease = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
      let run = t * total;
      let seg = 0;
      while (seg < lengths.length - 1 && run > lengths[seg]) { run -= lengths[seg]; seg++; }
      const f = lengths[seg] ? Math.min(1, run / lengths[seg]) : 1;
      walk.dot = [
        pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * f,
        pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * f,
      ];
      view = {
        x: from.x + (cam.x - from.x) * ease,
        y: from.y + (cam.y - from.y) * ease,
        w: from.w + (cam.w - from.w) * ease,
        h: from.h + (cam.h - from.h) * ease,
      };
      applyView();
      if (t < 1) walk.frame = requestAnimationFrame(tick); else finish();
    };
    walk.frame = requestAnimationFrame(tick);
    positionOverlay();
  }

  /** The route points between two stops, walking forward or back along the plan. */
  function routeBetween(from, to) {
    const forward = to > from;
    const low = Math.min(from, to);
    const high = Math.max(from, to);
    let pts = [];
    for (let i = low + 1; i <= high; i++) pts = pts.concat(ROUTE[STOPS[i].id].path);
    if (forward) return pts;
    const startAt = low >= 0 ? ROUTE[STOPS[low].id].pos : START;
    return [startAt].concat(pts.slice(0, -1)).reverse();
  }

  function arriveAt(index, loop) {
    const stop = STOPS[index];
    const data = ROUTE[stop.id];
    const pts = routeBetween(walk.idx, index);
    walk.idx = index;
    renderCard();
    travel(loop && data.loop ? pts.concat(data.loop) : pts, camFor(stop.id));
  }

  function next() {
    if (walk.busy) return;
    if (walk.elev) {
      if (walk.lvl < LEVELS.length - 1) setLevel(walk.lvl + 1);
      else startTemples();
    } else if (walk.idx + 1 < WALK_STOPS) {
      arriveAt(walk.idx + 1, true);
    } else {
      enterElev();
    }
  }

  function back() {
    if (walk.busy) return;
    if (walk.elev) {
      if (walk.lvl > 0) setLevel(walk.lvl - 1);
      else exitElev();
    } else if (walk.idx > 0) {
      arriveAt(walk.idx - 1, false);
    } else if (walk.idx === 0) {
      const pts = routeBetween(0, -1);
      walk.idx = -1;
      renderCard();
      travel(pts, { ...PLAN_HOME });
    }
  }

  function jumpTo(index) {
    if (STOPS[index].id === 'vimana') {
      walk.idx = WALK_STOPS - 1;
      walk.dot = ROUTE.garbha.pos.slice();
      enterElev();
    } else if (index !== walk.idx) {
      arriveAt(index, index > walk.idx);
    }
  }

  /* ---- the information card ---- */

  const ARROW_LEFT = '<svg viewBox="0 0 38 26"><path d="M36 13H3M3 13l10-10M3 13l10 10"/></svg>';
  const ARROW_RIGHT = '<svg viewBox="0 0 38 26"><path d="M2 13h33M35 13L25 3M35 13L25 23"/></svg>';

  function navButton(className, html, handler) {
    const btn = el('button', `pill-btn ${className}`);
    btn.type = 'button';
    btn.innerHTML = html;
    btn.addEventListener('click', handler);
    return btn;
  }

  function setNav(backHtml, nextHtml, nextClass = '') {
    const nav = $('cardNav');
    nav.innerHTML = '';
    if (backHtml) nav.appendChild(navButton('nav-back', backHtml, back));
    nav.appendChild(navButton(`nav-next ${nextClass}`, nextHtml, next));
  }

  function setNavDisabled(off) {
    $$('button', $('cardNav')).forEach((b) => { b.disabled = off; });
    const replay = $('replayBtn');
    if (replay) replay.disabled = off;
  }

  function renderCard() {
    const scroll = $('cardScroll');
    scroll.scrollTop = 0;
    $('walkRibbon').textContent = 'Temple Walk';
    $('mapItext').textContent = walk.idx < 0 ? '' : ITEXT.walkStop;
    if (walk.idx < 0) {
      scroll.innerHTML = `
        <p class="itext card-intro-itext">${ITEXT.walkIntro}</p>
        <div class="card-box card-box--story"><b>One temple stands for many</b>The temple you are about to walk through is a model, put together to show the main parts found in many Indian temples. Real temples differ in size, shape and material, but most follow a similar plan, from the entrance to the innermost shrine.</div>
        <p class="card-explore"><b>How to explore</b>Follow the red route from the gateway to the innermost shrine, then climb the tower above it.<br>Tap the arrow on the map to move. Tap any numbered label to jump straight to it. Drag the map to look around, and pinch or scroll to zoom.</p>`;
      setNav('', 'Begin at the Gopuram', 'is-wide');
      return;
    }
    const stop = STOPS[walk.idx];
    scroll.innerHTML = `
      <p class="card-step">Stop ${walk.idx + 1} of ${STOPS.length}</p>
      <h4 class="card-title">${stop.name}</h4>
      <p class="card-sub">${stop.sub}</p>
      <p class="card-body">${stop.body}</p>
      ${stop.replay ? `<button class="card-link" id="replayBtn" type="button">${stop.replay}</button>` : ''}
      <div class="card-box" id="quizBox"></div>
      ${stop.arrival ? `<div class="card-box"><h5>${stop.arrival[0]}</h5>${stop.arrival[1]}</div>` : ''}`;
    if (stop.replay) {
      $('replayBtn').addEventListener('click', () => {
        if (!walk.busy) travel(ROUTE[stop.id].loop, camFor(stop.id));
      });
    }
    renderQuiz(stop);
    const nextStop = STOPS[walk.idx + 1];
    const label = nextStop.id === 'vimana' ? 'Climb the vimāna' : nextStop.name;
    setNav(`${ARROW_LEFT}Back`, `${label}${ARROW_RIGHT}`, 'is-fit');
  }

  function renderQuiz(stop) {
    if (!qState[stop.id]) qState[stop.id] = { opts: shuffle(stop.options), picked: null };
    const state = qState[stop.id];
    const box = $('quizBox');
    const right = stop.options[0];
    const answered = state.picked !== null;
    box.innerHTML = `<h5>Quick look question</h5><p class="quiz-q">${stop.q}</p>`;
    state.opts.forEach((opt) => {
      const btn = el('button', 'quiz-opt', opt);
      btn.type = 'button';
      btn.disabled = answered;
      if (answered && opt === right) btn.classList.add('is-right');
      if (answered && opt === state.picked && opt !== right) btn.classList.add('is-wrong');
      btn.addEventListener('click', () => {
        state.picked = opt;
        renderQuiz(stop);
        box.lastElementChild.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      });
      box.appendChild(btn);
    });
    if (answered) {
      const correct = state.picked === right;
      box.appendChild(el('p', `quiz-fb${correct ? ' is-right' : ''}`, correct ? 'That’s right.' : 'Not quite. The correct answer is in green.'));
      box.appendChild(el('p', 'quiz-expl', stop.expl));
    }
  }

  /* ---- map tools: buttons, drag, scroll and pinch ---- */

  function zoomAround(sx, sy, factor) {
    const px = view.x + (sx / PANE_W) * view.w;
    const py = view.y + (sy / PANE_H) * view.h;
    const w = view.w * factor;
    const h = view.h * factor;
    view = clampView({ x: px - (sx / PANE_W) * w, y: py - (sy / PANE_H) * h, w, h });
    applyView();
  }

  $('zoomIn').addEventListener('click', () => { if (!walk.busy) zoomAround(PANE_W / 2, PANE_H / 2, 1 / 1.4); });
  $('zoomOut').addEventListener('click', () => { if (!walk.busy) zoomAround(PANE_W / 2, PANE_H / 2, 1.4); });
  $('overview').addEventListener('click', () => {
    if (walk.busy) return;
    view = { ...homeView() };
    applyView();
  });
  $('recentre').addEventListener('click', () => {
    if (walk.busy) return;
    const stop = STOPS[walk.idx];
    view = walk.elev || !stop ? { ...homeView() } : camFor(stop.id);
    applyView();
  });

  const paneLocal = (e) => {
    const p = toStage(e.clientX, e.clientY);
    return [p.x - 31, p.y - 110];
  };

  map.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (walk.busy) return;
    const [sx, sy] = paneLocal(e);
    zoomAround(sx, sy, e.deltaY > 0 ? 1.15 : 1 / 1.15);
  }, { passive: false });

  const pointers = new Map();
  let pinchGap = 0;

  map.addEventListener('pointerdown', (e) => {
    if (walk.busy) return;
    map.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, paneLocal(e));
    map.classList.add('is-grabbing');
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchGap = Math.hypot(a[0] - b[0], a[1] - b[1]);
    }
  });

  map.addEventListener('pointermove', (e) => {
    const last = pointers.get(e.pointerId);
    if (!last) return;
    const now = paneLocal(e);
    pointers.set(e.pointerId, now);
    if (pointers.size === 1) {
      view = clampView({
        ...view,
        x: view.x - ((now[0] - last[0]) / PANE_W) * view.w,
        y: view.y - ((now[1] - last[1]) / PANE_H) * view.h,
      });
      applyView();
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const gap = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (pinchGap) zoomAround((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, pinchGap / gap);
      pinchGap = gap;
    }
  });

  const endPointer = (e) => {
    pointers.delete(e.pointerId);
    if (!pointers.size) map.classList.remove('is-grabbing');
  };
  map.addEventListener('pointerup', endPointer);
  map.addEventListener('pointercancel', endPointer);

  function startWalk() {
    walk.idx = -1;
    walk.dot = START.slice();
    walk.elev = false;
    walk.lvl = 0;
    walk.busy = false;
    view = { ...PLAN_HOME };
    setElevMode(false);
    renderCard();
    applyView();
  }

  /* ------------------------------------------------------------------------
     5. SCREEN 2: CLIMB THE VIMĀNA
     ------------------------------------------------------------------------ */

  const L_X = 302.5;
  const R_X = 1094.5;
  // Shaded bands joining each tower level to the figure, bottom to top (from the XD layout).
  const BANDS = [
    `${L_X},838.19 766.33,838.19 879.63,880.86 1095,880.86 1095,922.26 ${L_X},922.26`,
    `${L_X},697.2 756.47,697.27 846.8,608.27 ${R_X},608 ${R_X},880.86 879.63,880.86 766.33,838.19 ${L_X},838.19`,
    `${L_X},567.2 756.47,567.27 839.9,472.9 846.5,468 ${R_X},468 ${R_X},608 846.8,608.27 756.47,697.27 ${L_X},697.2`,
    `${L_X},394.7 773.83,394.27 849.7,408.7 852,408 ${R_X},408 ${R_X},468 846.5,468 839.9,472.9 756.47,567.27 ${L_X},567.2`,
    `${L_X},363 ${R_X},363 ${R_X},408 852,408 849.7,408.7 773.83,394.27 ${L_X},394.7`,
    `${L_X},303 ${R_X},303 ${R_X},363 ${L_X},363`,
    `${L_X},252 ${R_X},252 ${R_X},303 ${L_X},303`,
  ];
  const BAND_LINES = [
    'M301.5 252H1094.5', 'M301.5 303H1094.5', 'M301.5 363H1094.5',
    'M849.7 408.7L773.83 394.27 302.5 394.7', 'M852 408H1095',
    'M839.9 472.9L756.47 567.27 305.8 567.2', 'M846.5 468H1094.5',
    'M846.8 608.27L756.47 697.27 305.8 697.2', 'M846.5 608H1094.5',
    'M301.5 920.5H1094.5', 'M881.73 881.33L774.13 840.26 302.8 840.69', 'M878.5 882H1094.5',
    'M302.5 252.5V920.5', 'M1094.5 252.5V920.5',
  ];
  const LEFT_LABEL_Y = [890, 775, 634, 486, 384, 340, 286];
  const RIGHT_LABEL_Y = [905, 750, 543, 446, 392, 337, 282];
  const DOT_Y = [882, 768, 632, 480, 379, 333, 277];
  const SECOND_FIGURE_X = 1270;
  const GUESS_LABEL_X = 1450;

  const levelDot = (i) => [553, DOT_Y[i]];

  function buildElev() {
    const svgText = (x, y, cls, inner, anchor) => `<text x="${x}" y="${y}" class="elev-text ${cls}"${anchor ? ` text-anchor="${anchor}"` : ''}>${inner}</text>`;
    let s = '';
    BANDS.forEach((points, i) => { s += `<polygon class="band" data-band="${i}" points="${points}"/>`; });
    BAND_LINES.forEach((d) => { s += `<path class="band-line" d="${d}"/>`; });
    s += '<image href="assets/svg/tower.svg" x="326" y="252" width="455" height="668.2"/>';
    s += '<image href="assets/svg/purusha.svg" x="827.8" y="254.4" width="164.1" height="665"/>';
    LEVELS.forEach((level, i) => {
      const term = level.term ? ` (<tspan class="elev-text--term">${level.term}</tspan>)` : '';
      s += `<g class="elev-part" data-part="${i}">${svgText(290, LEFT_LABEL_Y[i], '', `${level.part}${term}`, 'end')}</g>`;
      s += `<g class="elev-part" data-body="${i}">${svgText(1107, RIGHT_LABEL_Y[i], '', level.tag)}</g>`;
    });
    s += svgText(553, 955, 'elev-text--sub', 'Vimāna', 'middle');
    s += svgText(910, 955, 'elev-text--sub', 'Puruṣha', 'middle');
    s += `<g id="elevCompare" hidden>
      ${svgText(1000, 232, 'elev-text--head', 'Correct parts', 'middle')}
      ${svgText(1450, 232, 'elev-text--head', 'Your guess', 'middle')}
      <image href="assets/svg/purusha.svg" x="${SECOND_FIGURE_X}" y="254.4" width="164.1" height="665"/>
      <g id="guessLabels"></g>
    </g>`;
    $('elev').innerHTML = s;
  }

  function setElevMode(on) {
    walk.elev = on;
    map.classList.toggle('is-elev', on);
    $('compass').hidden = on;
    $('minimap').hidden = on;
    $('mapNote').hidden = on;
    $('guessBtn').hidden = !on;
  }

  function fadeMap(change) {
    if (reduceMotion) { change(); return; }
    walk.busy = true;
    setNavDisabled(true);
    positionOverlay();
    map.classList.add('is-fading');
    window.setTimeout(() => {
      walk.busy = false;
      change();
      map.classList.remove('is-fading');
    }, 300);
  }

  function enterElev() {
    fadeMap(() => {
      setElevMode(true);
      setLevel(0);
    });
  }

  function exitElev() {
    fadeMap(() => {
      setElevMode(false);
      walk.dot = ROUTE.garbha.pos.slice();
      walk.idx = WALK_STOPS - 1;
      view = camFor('garbha');
      renderCard();
      applyView();
    });
  }

  function setLevel(i) {
    walk.lvl = i;
    const top = i === LEVELS.length - 1;
    view = { ...homeView() };
    $$('[data-band]').forEach((b) => b.classList.toggle('is-on', +b.dataset.band === i));
    $$('[data-part]').forEach((p) => p.classList.toggle('is-on', +p.dataset.part === i));
    $$('[data-body]').forEach((b) => b.classList.toggle('is-on', +b.dataset.body === i));
    $('elevCompare').toggleAttribute('hidden', !top);
    if (top) renderGuessLabels();
    renderLevelCard(i, top);
    applyView();
    setNavDisabled(false);
  }

  function renderGuessLabels() {
    $('guessLabels').innerHTML = LEVELS.map((level, i) => {
      const ok = guess[i] === level.key;
      return `<text x="${GUESS_LABEL_X}" y="${RIGHT_LABEL_Y[i]}" class="elev-text ${ok ? 'elev-text--ok' : 'elev-text--bad'}">${ok ? '✓' : '✗'} ${tagOf(guess[i])}</text>`;
    }).join('');
  }

  function renderLevelCard(i, top) {
    const level = LEVELS[i];
    const ok = guess[i] === level.key;
    const score = LEVELS.filter((l, k) => guess[k] === l.key).length;
    $('walkRibbon').textContent = top ? 'Top of the tower' : 'Climb the vimāna';
    $('mapItext').textContent = ITEXT.climb;
    const scroll = $('cardScroll');
    scroll.scrollTop = 0;
    scroll.innerHTML = `
      <p class="card-step">Stop ${STOPS.length} of ${STOPS.length}: the vimāna, level ${i + 1} of ${LEVELS.length}</p>
      <h4 class="card-title">${level.title}</h4>
      <p class="card-sub">${level.sub}</p>
      ${level.term ? `<p class="card-term"><i>Temple term, just for interest:</i><b>${level.term}</b></p>` : ''}
      <div class="guess-check${ok ? '' : ' is-wrong'}">
        <span class="guess-check__mark" aria-hidden="true">${ok ? '✓' : '!'}</span>
        <span>${ok ? `Your guess: <b>${level.tag}</b>. Spot on.` : `You placed <b>${tagOf(guess[i])}</b> here.`}</span>
      </div>
      <p class="card-level-text">${level.text}</p>
      <div class="card-box card-box--look"><h5>Look closer</h5>${level.look}</div>
      ${top ? `<div class="card-box card-box--look card-box--score"><h5>You matched ${score} of ${LEVELS.length}</h5>A temple is planned like the body of Puruṣha, the cosmic being. So the temple stands for the cosmos, and also for our own being.</div>` : ''}`;
    const label = top ? 'Continue' : LEVELS[i + 1].part;
    setNav(`${ARROW_LEFT}Back`, `${label}${ARROW_RIGHT}`);
  }

  /* ---- your guess popup ---- */

  function renderGuessPopup() {
    const dx = -78.5;
    const dy = -7;
    $('guessLeads').innerHTML = leadsMarkup(dx, dy, 843);
    const box = $('guessTags');
    box.innerHTML = '';
    SLOTS.forEach(({ level, top }) => {
      const tag = el('div', 'guess-tag', guess[level] ? tagOf(guess[level]) : '');
      tag.style.left = `${843 - 57}px`;
      tag.style.top = `${top + dy - 169}px`;
      box.appendChild(tag);
    });
  }

  $('guessBtn').addEventListener('click', () => {
    renderGuessPopup();
    openModal('guessModal', 'guessClose');
  });
  $('guessClose').addEventListener('click', () => closeModal('guessModal'));

  /* ------------------------------------------------------------------------
     6. SCREEN 3: FOUR TEMPLES, ONE IDEA
     ------------------------------------------------------------------------ */

  const CARD_X = [178, 578, 979, 1379];
  // The dashed core outline on each temple: x in the XD layout, top within the card, w, h.
  const CORE_BOX = [[191.1, 48.7, 305.5, 196.8], [597.5, 38.1, 290.1, 166.6], [1010.6, 48.1, 290.1, 166.6], [1409.9, 72.2, 290.1, 166.6]];
  const CLUES_PER_TEMPLE = 3;
  const totalClues = TEMPLES.length * CLUES_PER_TEMPLE;
  let placedClues = 0;

  function buildTemples() {
    placedClues = 0;
    $('screen-temples').classList.remove('is-complete');
    $('templesItext').textContent = ITEXT.sort;
    $('clueHint').textContent = '';
    $('coreBox').hidden = true;
    $('insightBtn').hidden = true;
    $('againBtn').hidden = true;

    const cards = $('templeCards');
    cards.innerHTML = '';
    TEMPLES.forEach((temple, i) => {
      const card = el('div', 'temple-card');
      card.style.left = `${CARD_X[i]}px`;
      card.dataset.temple = temple.id;
      const [cx, cy, cw, ch] = CORE_BOX[i];
      card.innerHTML = `
        <div class="temple-card__body">
          <p class="temple-card__count" data-count>Clues: 0 of ${CLUES_PER_TEMPLE}</p>
          <div class="temple-card__clues" data-clues></div>
        </div>
        <div class="temple-card__img">
          <img src="assets/images/${temple.img}" alt="${temple.name}"${temple.flip ? ' class="is-flipped"' : ''}>
          <img class="temple-card__core" src="assets/svg/core-${i + 1}.svg" alt=""
            style="left:${cx - CARD_X[i]}px;top:${cy}px;width:${cw}px;height:${ch}px">
        </div>
        <span class="temple-card__name">${temple.name}</span>`;
      card.addEventListener('click', () => {
        if (selected && selected.classList.contains('clue')) tryPlace(selected, card);
      });
      cards.appendChild(card);
    });

    const tray = $('clueTray');
    tray.innerHTML = '';
    const all = TEMPLES.flatMap((t) => t.clues.map(([text, hint]) => ({ temple: t.id, text, hint })));
    shuffle(all).forEach((clue) => {
      const chip = el('button', 'clue', clue.text);
      chip.type = 'button';
      chip.dataset.temple = clue.temple;
      chip.dataset.hint = clue.hint;
      makeMovable(chip, '.temple-card', () => true, tryPlace);
      tray.appendChild(chip);
    });
  }

  function tryPlace(chip, card) {
    select(null);
    if (chip.dataset.temple !== card.dataset.temple) {
      chip.classList.remove('is-shake');
      void chip.offsetWidth;
      chip.classList.add('is-shake');
      $('clueHint').textContent = chip.dataset.hint;
      return;
    }
    $('clueHint').textContent = '';
    card.querySelector('[data-clues]').appendChild(el('div', 'placed-clue', chip.textContent));
    chip.remove();
    placedClues++;
    const count = card.querySelector('[data-clues]').children.length;
    const temple = TEMPLES.find((t) => t.id === card.dataset.temple);
    const counter = card.querySelector('[data-count]');
    counter.textContent = count === CLUES_PER_TEMPLE ? 'All clues found' : `Clues: ${count} of ${CLUES_PER_TEMPLE}`;
    if (count === CLUES_PER_TEMPLE) {
      card.querySelector('.temple-card__body').appendChild(el('p', 'temple-card__standout', temple.standout));
    }
    if (placedClues === totalClues) completeTemples();
  }

  function completeTemples() {
    $('screen-temples').classList.add('is-complete');
    $('templesItext').textContent = ITEXT.sorted;
    $('coreBox').hidden = false;
    $('insightBtn').hidden = false;
    $('againBtn').hidden = false;
    $('insightBtn').focus();
  }

  function startTemples() {
    buildTemples();
    goTo('temples');
  }

  $('insightBtn').addEventListener('click', () => openModal('insightModal', 'insightClose'));
  $('insightClose').addEventListener('click', () => closeModal('insightModal'));

  /* ------------------------------------------------------------------------
     7. RESET, KEYBOARD AND TEST HELPERS
     ------------------------------------------------------------------------ */

  // "Start again" clears the guess and returns to Screen 1 with the tags in a new order.
  function resetAll() {
    cancelAnimationFrame(walk.frame);
    Object.keys(guess).forEach((k) => delete guess[k]);
    Object.keys(qState).forEach((k) => delete qState[k]);
    locked = false;
    selected = null;
    buildMystery();
    refreshMystery();
    $('lockBtn').hidden = false;
    $('placedCount').hidden = false;
    $('lockMsg').hidden = true;
    $('walkBtn').hidden = true;
    $('mysteryItext').textContent = ITEXT.mystery;
    goTo('mystery');
  }

  $('againBtn').addEventListener('click', resetAll);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('guessModal').hidden) closeModal('guessModal');
    else if (!$('insightModal').hidden) closeModal('insightModal');
  });

  fitStage();
  window.addEventListener('resize', fitStage);
  buildPlan();
  buildElev();
  buildOverlay();
  buildMystery();
  refreshMystery();
  syncModalBackdrop();

  // Browser console helpers for jumping around while testing.
  window.wg226Test = {
    fillGuess(correct = true) {
      const keys = shuffle(LEVELS.map((l) => l.key));
      LEVELS.forEach((level, i) => { guess[i] = correct ? level.key : keys[i]; });
      refreshMystery();
      goTo('mystery');
    },
    openWalk(correct = true) { this.fillGuess(correct); locked = true; goTo('walk'); startWalk(); },
    climb(level = 0, correct = true) { this.openWalk(correct); setElevMode(true); setLevel(level); },
    openTemples() { startTemples(); },
    sortAll() {
      startTemples();
      $$('.clue').forEach((chip) => tryPlace(chip, document.querySelector(`.temple-card[data-temple="${chip.dataset.temple}"]`)));
    },
  };
}());
