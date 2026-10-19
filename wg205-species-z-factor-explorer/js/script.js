'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     CONTENT
     ========================================================================== */

  const ITEXT = {
    home: 'Choose a mode to begin.',
    m1Step1:
      '<b>Step 1</b>. Tap <span class="reveal-chip">Reveal</span> next to each area below. This shows how many species live in an area of that size.',
    m1Step2: '<b>Step 2</b>. All five points are shown. Look at the curve: it rises fast, then flattens.',
    m1Step3:
      '<b>Step 3</b>. The curve is now a straight line. Click on either axis, on both graphs, to find a matching value.',
    m2Step1: '<b>Step 1</b>. Choose a region size below.',
    m2Step2: (lo, hi) => `<b>Step 2</b>. Type a Z value between ${lo} and ${hi}. Then tap "Plot graph."`,
    m2Step3: '<b>Step 3</b>. Here is your graph. Now switch to the log scale below.',
    m2Step4: '<b>Step 4</b>. Click on either axis, on both graphs, to find a matching value.',
  };

  const EQUATION = 'log S = log C + Z log A';

  // Species–Area datasets. Each is a template: a fresh set of five areas
  // (and a small jitter on Z and C) is generated every time it is drawn.
  const DATASETS = [
    { label: 'Flowering plants, within one country', icon: 'icon-flower', Z: 0.14, C: 8, startBase: 1 },
    { label: 'Birds, temperate islands', icon: 'icon-bird', Z: 0.17, C: 5, startBase: 2 },
    { label: 'Freshwater fishes, river catchments', icon: 'icon-fish', Z: 0.12, C: 9, startBase: 5 },
    { label: 'Amphibians, forest reserves', icon: 'icon-amphibian', Z: 0.2, C: 6, startBase: 1 },
    { label: 'Molluscs, coastal plots', icon: 'icon-mollusc', Z: 0.16, C: 7, startBase: 3 },
    { label: 'Vascular plants, tropical vs temperate', icon: 'icon-vascular', Z: 0.11, C: 12, startBase: 1 },
  ];

  const REGIONS = {
    small: { name: 'Small region', lo: 0.1, hi: 0.2 },
    large: { name: 'Large region', lo: 0.6, hi: 1.2 },
  };
  const Z_FIXED_C = 8;
  const Z_FIXED_AREAS = [1, 10, 100, 1000, 10000];

  // Plot illustrations: design coords of each artwork on the stage.
  const ILLUS = {
    1: { href: 'assets/img/graph1-illus.svg', x: 914, y: 423.5, w: 800, h: 286.5 },
    2: { href: 'assets/img/graph2-illus.svg', x: 909, y: 346.5, w: 805, h: 360.5 },
  };

  /* ==========================================================================
     GEOMETRY (stage px, from the XD artboard)
     ========================================================================== */

  const STAGE_W = 1920;
  const STAGE_H = 1080;
  const PLOT = { x0: 911, x1: 1713, yTop: 283, y0: 708 };
  const X_SPAN = PLOT.x1 - PLOT.x0;
  const Y_SPAN = PLOT.y0 - PLOT.yTop;
  const GRID_COLS = 5;
  const GRID_ROWS = 4;

  /* ==========================================================================
     DOM
     ========================================================================== */

  const $ = (id) => document.getElementById(id);
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs) => {
    const e = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  };

  const stage = $('stage');
  const modalStage = $('modal-stage');
  const itext = $('itext');
  const screens = { home: $('screen-home'), explore: $('screen-explore') };
  const explore = screens.explore;

  const areaList = $('areaList');
  const btnSmall = $('btnSmallRegion');
  const btnLarge = $('btnLargeRegion');
  const zInput = $('zInput');
  const zInputWrap = zInput.parentElement;
  const zUp = $('zUp');
  const zDown = $('zDown');
  const plotZBtn = $('plotZBtn');
  const newZBtn = $('newZBtn');
  const scaleSwitch = $('scaleSwitch');
  const feedback = $('feedback');
  const axisFeedback = $('axisFeedback');

  const graphSvg = $('graph');
  const graphModeTag = $('graphModeTag');
  const graphScale = $('graphScale');
  const graphIcon = $('graphIcon');
  const graphSub = $('graphSub');
  const plotIllus = $('plotIllus');
  const gridG = $('gridlines');
  const xTicksG = $('xticks');
  const yTicksG = $('yticks');
  const xCaption = $('xCaption');
  const yCaption = $('yCaption');
  const curvePath = $('curvePath');
  const pointsG = $('points');
  const axisReadG = $('axisRead');
  const xAxisHit = $('xAxisHit');
  const yAxisHit = $('yAxisHit');

  const insightsBtn = $('insightsBtn');
  const insightsOverlay = $('insightsOverlay');

  /* ==========================================================================
     STAGE SCALING
     ========================================================================== */

  let stageScale = 1;
  const fitStage = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / STAGE_W, vh / STAGE_H);
    const x = (vw - STAGE_W * stageScale) / 2;
    const y = (vh - STAGE_H * stageScale) / 2;
    const t = `translate(${x}px, ${y}px) scale(${stageScale})`;
    stage.style.transform = t;
    modalStage.style.transform = t;
  };
  fitStage();
  window.addEventListener('resize', fitStage);

  /* ==========================================================================
     STATE
     ========================================================================== */

  const state = {
    appMode: null, // 1 | 2
    scale: 'linear', // 'linear' | 'log'
    C: 0,
    Z: 0,
    areas: [],
    trueS: [],
    revealed: [],
    lastRevealed: -1,
    axisUnlocked: false,
    // mode 1
    pool: [],
    lastIndex: -1,
    // mode 2
    region: null,
    plotted: false,
  };

  const richness = (a) => state.C * Math.pow(a, state.Z);
  const randomBetween = (lo, hi) => lo + Math.random() * (hi - lo);
  const fmtNum = (n) => Math.round(n).toLocaleString('en-US');
  const allRevealed = () => state.revealed.length > 0 && state.revealed.every(Boolean);

  const setItext = (html) => {
    itext.innerHTML = html;
  };

  /* ==========================================================================
     SCALES
     ========================================================================== */

  let linXMax = 1;
  let linYMax = 1;
  let logXMax = 1;
  let logYMax = 1;
  const LOG_MIN = 0;

  const recomputeScales = () => {
    const maxA = state.areas[state.areas.length - 1];
    const maxS = Math.max(...state.trueS);
    linXMax = maxA * 1.08;
    linYMax = maxS * 1.25;
    logXMax = Math.log10(maxA) + 0.4;
    logYMax = Math.log10(maxS) + 0.4;
  };

  const px = (a) =>
    state.scale === 'linear'
      ? PLOT.x0 + (a / linXMax) * X_SPAN
      : PLOT.x0 + ((Math.log10(a) - LOG_MIN) / (logXMax - LOG_MIN)) * X_SPAN;
  const py = (s) =>
    state.scale === 'linear'
      ? PLOT.y0 - (s / linYMax) * Y_SPAN
      : PLOT.y0 - ((Math.log10(s) - LOG_MIN) / (logYMax - LOG_MIN)) * Y_SPAN;

  const pxToArea = (x) => {
    const f = (Math.min(PLOT.x1, Math.max(PLOT.x0, x)) - PLOT.x0) / X_SPAN;
    if (state.scale === 'linear') return Math.max(f * linXMax, linXMax * 0.01);
    return Math.pow(10, LOG_MIN + f * (logXMax - LOG_MIN));
  };
  const pyToRichness = (y) => {
    const f = (PLOT.y0 - Math.min(PLOT.y0, Math.max(PLOT.yTop, y))) / Y_SPAN;
    if (state.scale === 'linear') return Math.max(f * linYMax, linYMax * 0.01);
    return Math.pow(10, LOG_MIN + f * (logYMax - LOG_MIN));
  };

  /* ==========================================================================
     GRAPH DRAWING
     ========================================================================== */

  const areaTick = (a) => {
    if (a < 1000) return String(a);
    const k = Math.round(a / 100) / 10;
    return state.appMode === 1 ? `${k} k` : `${k}k`;
  };

  const drawGrid = () => {
    gridG.innerHTML = '';
    for (let i = 1; i < GRID_COLS; i++) {
      const x = PLOT.x0 + (X_SPAN * i) / GRID_COLS;
      gridG.appendChild(svgEl('line', { class: 'grid-line', x1: x, y1: PLOT.yTop, x2: x, y2: PLOT.y0 }));
    }
    for (let i = 0; i < GRID_ROWS; i++) {
      const y = PLOT.yTop + (Y_SPAN * i) / GRID_ROWS;
      gridG.appendChild(svgEl('line', { class: 'grid-line', x1: PLOT.x0, y1: y, x2: PLOT.x1, y2: y }));
    }
    gridG.appendChild(svgEl('line', { class: 'grid-line', x1: PLOT.x1, y1: PLOT.yTop, x2: PLOT.x1, y2: PLOT.y0 }));
  };

  const addText = (group, x, y, text, anchor, cls = 'tick-label') => {
    const t = svgEl('text', { class: cls, x, y, 'text-anchor': anchor });
    t.textContent = text;
    group.appendChild(t);
    return t;
  };

  const drawTicks = () => {
    xTicksG.innerHTML = '';
    yTicksG.innerHTML = '';
    const isLin = state.scale === 'linear';

    xCaption.textContent = isLin ? 'Area (hectares)' : 'log (Area)';
    yCaption.textContent = isLin ? 'Species richness' : 'log (Species richness)';
    graphScale.textContent = isLin ? 'Linear scale' : 'Log–log scale';

    if (!state.areas.length) return;

    // y ticks: one per grid row
    for (let i = 0; i <= GRID_ROWS; i++) {
      const y = PLOT.y0 - (Y_SPAN * i) / GRID_ROWS;
      const v = isLin ? (linYMax * i) / GRID_ROWS : LOG_MIN + ((logYMax - LOG_MIN) * i) / GRID_ROWS;
      addText(yTicksG, 897, y + 9, isLin ? String(Math.round(v)) : v.toFixed(1), 'end');
    }

    // x ticks at the data areas — right to left, skipping any that would collide
    let lastLeft = Infinity;
    for (let i = state.areas.length - 1; i >= 0; i--) {
      const a = state.areas[i];
      const x = px(a);
      const label = isLin ? areaTick(a) : Math.log10(a).toFixed(1);
      const w = label.length * 13 + 8;
      if (x - PLOT.x0 < 30 || x + w / 2 > lastLeft - 14) continue;
      addText(xTicksG, Math.min(x, PLOT.x1 - w / 2 + 6), 745, label, 'middle');
      lastLeft = x - w / 2;
    }
  };

  const drawCurve = () => {
    const shown = state.areas.filter((_, i) => state.revealed[i]);
    if (shown.length < 2) {
      curvePath.setAttribute('d', '');
      return;
    }
    const minA = shown[0];
    const maxA = shown[shown.length - 1];
    const steps = 80;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a =
        state.scale === 'linear'
          ? minA + (maxA - minA) * t
          : Math.pow(10, Math.log10(minA) + (Math.log10(maxA) - Math.log10(minA)) * t);
      d += `${i === 0 ? 'M' : 'L'}${px(a).toFixed(1)},${py(richness(a)).toFixed(1)} `;
    }
    curvePath.setAttribute('d', d);
  };

  const drawPoints = () => {
    pointsG.innerHTML = '';
    if (state.appMode !== 1) return;

    const placed = [];
    state.areas.forEach((a, i) => {
      if (!state.revealed[i]) return;
      const cx = px(a);
      const cy = py(state.trueS[i]);
      const label = `S=${Math.round(state.trueS[i])}`;
      const w = label.length * 14;

      let anchor = 'start';
      let lx = cx + 18;
      if (lx + w > PLOT.x1 + 50) {
        anchor = 'end';
        lx = cx - 18;
      }
      let ly = cy + 9;
      const box = () => (anchor === 'start' ? [lx, lx + w] : [lx - w, lx]);
      // nudge upward until clear of earlier labels (points rise left to right)
      for (let guard = 0; guard < 12; guard++) {
        const [l, r] = box();
        const hit = placed.find((p) => l < p.r && r > p.l && Math.abs(ly - p.y) < 27);
        if (!hit) break;
        ly = hit.y - 28;
      }
      const [l, r] = box();
      placed.push({ l, r, y: ly });

      const dot = svgEl('circle', { class: 'pt', cx, cy, r: 6.5 });
      if (i === state.lastRevealed) dot.classList.add('pt-new');
      pointsG.appendChild(dot);
      addText(pointsG, lx, ly, label, anchor, 'pt-label');
    });
    state.lastRevealed = -1;
  };

  const redraw = () => {
    drawGrid();
    drawTicks();
    drawCurve();
    drawPoints();
  };

  const clearGraph = () => {
    state.areas = [];
    state.trueS = [];
    state.revealed = [];
    curvePath.setAttribute('d', '');
    pointsG.innerHTML = '';
    axisReadG.innerHTML = '';
    drawGrid();
    drawTicks();
  };

  const setIllus = (mode) => {
    const il = ILLUS[mode];
    plotIllus.setAttribute('href', il.href);
    plotIllus.setAttribute('x', il.x);
    plotIllus.setAttribute('y', il.y);
    plotIllus.setAttribute('width', il.w);
    plotIllus.setAttribute('height', il.h);
  };

  /* ==========================================================================
     FEEDBACK
     ========================================================================== */

  const hyperbolaText = () =>
    state.Z < 0.4
      ? 'This shape is called a rectangular hyperbola. Species richness rises fast at first, then flattens out quickly, even for a small increase in area.'
      : 'This shape is called a rectangular hyperbola. Species richness keeps climbing steadily and takes much longer to flatten out.';

  const showFeedback = (kind, html) => {
    feedback.className = `feedback feedback--${kind}`;
    feedback.innerHTML = html;
    feedback.hidden = false;
  };
  const hideFeedback = () => {
    feedback.hidden = true;
  };

  const showLogFeedback = () => {
    showFeedback(
      'log',
      `<div class="feedback__eq"><b>${EQUATION}</b>&nbsp;&nbsp; here Z = ${state.Z.toFixed(2)}</div>` +
        `<div>The points now sit on a straight line. This is what <b>${EQUATION}</b> looks like. The slope of this line is Z.</div>`
    );
  };

  const hideAxisRead = () => {
    axisReadG.innerHTML = '';
    axisFeedback.hidden = true;
  };

  /* ==========================================================================
     AXIS CLICK-TO-READ
     ========================================================================== */

  const svgPoint = (evt) => {
    const pt = graphSvg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ctm = graphSvg.getScreenCTM();
    return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
  };

  const drawAxisRead = (area, s, fromAxis) => {
    axisReadG.innerHTML = '';
    const cx = px(area);
    const cy = py(s);
    axisReadG.appendChild(svgEl('path', { class: 'read-line', d: `M${cx},${PLOT.y0} V${cy} H${PLOT.x0}` }));
    axisReadG.appendChild(svgEl('circle', { class: 'read-pt', cx, cy, r: 7 }));

    const where = state.scale === 'log' ? 'straight line' : 'curve';
    axisFeedback.innerHTML =
      fromAxis === 'x'
        ? `Area = ${fmtNum(area)} ha&nbsp;→&nbsp;Species richness ≈ ${Math.round(s)}. (Found on the ${where}.)`
        : `Species richness = ${Math.round(s)}&nbsp;→&nbsp;Area ≈ ${fmtNum(area)} ha. (Found on the ${where}.)`;
    axisFeedback.hidden = false;
  };

  xAxisHit.addEventListener('click', (evt) => {
    if (!state.axisUnlocked) return;
    const area = pxToArea(svgPoint(evt).x);
    drawAxisRead(area, richness(area), 'x');
  });

  yAxisHit.addEventListener('click', (evt) => {
    if (!state.axisUnlocked) return;
    let s = pyToRichness(svgPoint(evt).y);
    let area = Math.pow(s / state.C, 1 / state.Z);
    const domainMax = state.scale === 'linear' ? linXMax : Math.pow(10, logXMax);
    area = Math.max(state.areas[0] * 0.3, Math.min(domainMax, area));
    s = richness(area);
    drawAxisRead(area, s, 'y');
  });

  const lockAxisRead = () => {
    state.axisUnlocked = false;
    xAxisHit.classList.remove('is-active', 'is-pulse');
    yAxisHit.classList.remove('is-active', 'is-pulse');
    hideAxisRead();
  };

  const unlockAxisRead = () => {
    if (state.axisUnlocked) return;
    state.axisUnlocked = true;
    [xAxisHit, yAxisHit].forEach((h) => {
      h.classList.add('is-active', 'is-pulse');
    });
  };

  /* ==========================================================================
     SCALE TOGGLE (shared)
     ========================================================================== */

  const setSwitchUI = () => {
    const on = state.scale === 'log';
    scaleSwitch.classList.toggle('is-on', on);
    scaleSwitch.setAttribute('aria-checked', String(on));
  };

  const resetScale = () => {
    state.scale = 'linear';
    setSwitchUI();
  };

  const setScale = (next) => {
    state.scale = next;
    setSwitchUI();
    hideAxisRead();
    redraw();

    if (next === 'linear') {
      showFeedback('hyperbola', hyperbolaText());
      return;
    }
    showLogFeedback();
    unlockAxisRead();
    setItext(state.appMode === 1 ? ITEXT.m1Step3 : ITEXT.m2Step4);
  };

  scaleSwitch.addEventListener('click', () => {
    if (scaleSwitch.disabled) return;
    setScale(state.scale === 'linear' ? 'log' : 'linear');
  });

  /* ==========================================================================
     MODE 1 — Species–Area
     ========================================================================== */

  const generateInstance = (t) => {
    const start = Math.max(1, Math.round(t.startBase * randomBetween(0.6, 1.8)));
    const step = randomBetween(7, 13);
    const areas = [];
    let a = start;
    for (let i = 0; i < 5; i++) {
      areas.push(Math.round(a));
      a *= step;
    }
    const z = Math.max(0.05, Math.min(0.4, Math.round((t.Z + randomBetween(-0.02, 0.02)) * 100) / 100));
    const c = Math.max(1, Math.round(t.C * randomBetween(0.75, 1.3)));
    return { areas, Z: z, C: c };
  };

  const shuffled = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const refillPool = () => {
    state.pool = shuffled(DATASETS.map((_, i) => i));
    const n = state.pool.length;
    // never repeat the dataset just shown
    if (n > 1 && state.pool[n - 1] === state.lastIndex) {
      [state.pool[n - 1], state.pool[n - 2]] = [state.pool[n - 2], state.pool[n - 1]];
    }
  };

  const buildAreaList = () => {
    areaList.innerHTML = '';
    state.areas.forEach((a, i) => {
      const row = document.createElement('div');
      row.className = `area-row${state.revealed[i] ? ' is-done' : ''}`;
      row.innerHTML = `<span class="area-row__area">${fmtNum(a)} <span class="area-row__unit">ha</span></span>`;

      if (state.revealed[i]) {
        const sp = document.createElement('span');
        sp.className = 'area-row__sp';
        sp.innerHTML = `${Math.round(state.trueS[i])} <i>sp</i>.`;
        row.appendChild(sp);
      } else {
        const btn = document.createElement('button');
        btn.className = 'reveal-btn';
        btn.type = 'button';
        btn.textContent = 'Reveal';
        btn.setAttribute('aria-label', `Reveal species for ${fmtNum(a)} hectares`);
        btn.addEventListener('click', () => revealArea(i));
        row.appendChild(btn);
      }
      areaList.appendChild(row);
    });
  };

  const revealArea = (i) => {
    state.revealed[i] = true;
    state.lastRevealed = i;
    buildAreaList();
    redraw();
    if (allRevealed()) {
      scaleSwitch.disabled = false;
      setItext(ITEXT.m1Step2);
      showFeedback('hyperbola', hyperbolaText());
    } else {
      // keep keyboard focus moving down the list
      const next = areaList.querySelector('.reveal-btn');
      if (next) next.focus();
    }
  };

  const resetSpeciesProgress = () => {
    state.revealed = state.areas.map(() => false);
    resetScale();
    scaleSwitch.disabled = true;
    setItext(ITEXT.m1Step1);
    hideFeedback();
    lockAxisRead();
    buildAreaList();
    redraw();
  };

  const nextDataset = () => {
    if (!state.pool.length) refillPool();
    const idx = state.pool.pop();
    state.lastIndex = idx;
    const t = DATASETS[idx];
    const inst = generateInstance(t);
    state.areas = inst.areas;
    state.Z = inst.Z;
    state.C = inst.C;
    state.trueS = state.areas.map(richness);
    recomputeScales();
    graphIcon.src = `assets/img/${t.icon}.svg`;
    graphSub.textContent = t.label;
    resetSpeciesProgress();
  };

  $('resetBtn').addEventListener('click', resetSpeciesProgress);
  $('newSetBtn').addEventListener('click', nextDataset);

  /* ==========================================================================
     MODE 2 — Z value
     ========================================================================== */

  const setZControlsEnabled = (enabled) => {
    zInput.disabled = !enabled;
    zUp.disabled = !enabled;
    zDown.disabled = !enabled;
    plotZBtn.disabled = !enabled;
    zInputWrap.classList.toggle('is-disabled', !enabled);
  };

  const resetZFlow = () => {
    state.region = null;
    state.plotted = false;
    state.Z = 0;
    btnSmall.classList.remove('is-active');
    btnLarge.classList.remove('is-active');
    btnSmall.disabled = false;
    btnLarge.disabled = false;
    zInput.value = '';
    setZControlsEnabled(false);
    newZBtn.disabled = true;
    resetScale();
    scaleSwitch.disabled = true;
    graphSub.textContent = '';
    setItext(ITEXT.m2Step1);
    hideFeedback();
    lockAxisRead();
    clearGraph();
  };

  const chooseRegion = (key) => {
    if (state.plotted) return;
    state.region = key;
    const r = REGIONS[key];
    btnSmall.classList.toggle('is-active', key === 'small');
    btnLarge.classList.toggle('is-active', key === 'large');
    zInput.value = '';
    setZControlsEnabled(true);
    hideFeedback();
    setItext(ITEXT.m2Step2(r.lo.toFixed(1), r.hi.toFixed(1)));
    zInput.focus();
  };

  btnSmall.addEventListener('click', () => chooseRegion('small'));
  btnLarge.addEventListener('click', () => chooseRegion('large'));

  // only digits and one decimal point
  zInput.addEventListener('input', () => {
    let v = zInput.value.replace(/[^0-9.]/g, '');
    const dot = v.indexOf('.');
    if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, '');
    zInput.value = v.slice(0, 5);
    if (feedback.classList.contains('feedback--error')) hideFeedback();
  });
  zInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') plotZ();
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      stepZ(1);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      stepZ(-1);
    }
  });

  const stepZ = (dir) => {
    if (!state.region || zInput.disabled) return;
    const r = REGIONS[state.region];
    const cur = parseFloat(zInput.value);
    let next = Number.isNaN(cur) ? (dir > 0 ? r.lo : r.hi) : cur + dir * 0.01;
    next = Math.min(r.hi, Math.max(r.lo, Math.round(next * 100) / 100));
    zInput.value = next.toFixed(2);
    if (feedback.classList.contains('feedback--error')) hideFeedback();
  };
  zUp.addEventListener('click', () => stepZ(1));
  zDown.addEventListener('click', () => stepZ(-1));

  const plotZ = () => {
    if (!state.region || state.plotted) return;
    const r = REGIONS[state.region];
    const v = parseFloat(zInput.value);
    if (Number.isNaN(v) || v < r.lo || v > r.hi) {
      showFeedback(
        'error',
        `That’s outside the allowed range. Please enter a value between ${r.lo.toFixed(1)} and ${r.hi.toFixed(1)}.`
      );
      zInput.focus();
      return;
    }

    state.plotted = true;
    state.Z = v;
    state.C = Z_FIXED_C;
    state.areas = Z_FIXED_AREAS.slice();
    state.trueS = state.areas.map(richness);
    state.revealed = state.areas.map(() => true);
    recomputeScales();
    zInput.value = v.toFixed(2);

    graphSub.textContent = `${r.name}, Z = ${v.toFixed(2)}`;
    resetScale();
    scaleSwitch.disabled = false;
    setZControlsEnabled(false);
    btnSmall.disabled = true;
    btnLarge.disabled = true;
    newZBtn.disabled = false;

    setItext(ITEXT.m2Step3);
    showFeedback('hyperbola', hyperbolaText());
    lockAxisRead();
    redraw();
  };

  plotZBtn.addEventListener('click', plotZ);
  newZBtn.addEventListener('click', resetZFlow);

  /* ==========================================================================
     NAVIGATION
     ========================================================================== */

  const showScreen = (name) => {
    Object.entries(screens).forEach(([k, el]) => el.classList.toggle('is-active', k === name));
    insightsBtn.hidden = name === 'home';
    if (name === 'home') closeInsights();
  };

  const chooseMode = (m) => {
    state.appMode = m;
    explore.classList.toggle('is-mode1', m === 1);
    explore.classList.toggle('is-mode2', m === 2);
    graphModeTag.textContent = `Mode ${m}`;
    graphModeTag.className = `mode-tag mode-tag--${m}`;
    setIllus(m);
    hideFeedback();
    showScreen('explore');

    if (m === 1) {
      nextDataset();
    } else {
      graphIcon.removeAttribute('src');
      resetZFlow();
    }
  };

  const goHome = () => {
    state.appMode = null;
    lockAxisRead();
    hideFeedback();
    setItext(ITEXT.home);
    showScreen('home');
  };

  $('cardSpecies').addEventListener('click', () => chooseMode(1));
  $('cardZ').addEventListener('click', () => chooseMode(2));
  $('homeBtn').addEventListener('click', goHome);

  /* ==========================================================================
     INSIGHTS
     ========================================================================== */

  let insightsReturnFocus = null;
  const openInsights = () => {
    insightsReturnFocus = document.activeElement;
    insightsOverlay.hidden = false;
    document.body.classList.add('has-modal');
    $('insightsClose').focus();
  };
  function closeInsights() {
    if (insightsOverlay.hidden) return;
    insightsOverlay.hidden = true;
    document.body.classList.remove('has-modal');
    if (insightsReturnFocus && insightsReturnFocus.focus) insightsReturnFocus.focus();
  }

  insightsBtn.addEventListener('click', () => (insightsOverlay.hidden ? openInsights() : closeInsights()));
  $('insightsClose').addEventListener('click', closeInsights);
  insightsOverlay.addEventListener('click', (e) => {
    if (e.target === insightsOverlay) closeInsights();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInsights();
  });

  /* ==========================================================================
     INIT
     ========================================================================== */

  goHome();
});
