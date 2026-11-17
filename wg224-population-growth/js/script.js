/* Population Growth with Unlimited and Limited Resources (wg224)
   Step a population forward one year at a time with dN/dt = rN (unlimited) or
   dN/dt = rN(K-N)/K (limited) and watch the J or S curve form.
   Built from the reference prototype, on a fixed 1920x1080 stage. */
(function () {
  'use strict';

  const C = window.POP_CONTENT;
  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const modalStage = $('modal-stage');
  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* ---------- stage scaling ---------- */
  let stageScale = 1;
  let stageOrigin = [0, 0];

  /** Fits the fixed 1920x1080 stages inside the window, centred. */
  function fitStage() {
    stageScale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stageOrigin = [(window.innerWidth - 1920 * stageScale) / 2, (window.innerHeight - 1080 * stageScale) / 2];
    const t = `translate(${stageOrigin[0]}px, ${stageOrigin[1]}px) scale(${stageScale})`;
    stage.style.transform = t;
    modalStage.style.transform = t;
  }
  /** An element's box in stage coordinates. */
  function stageRect(el) {
    const r = el.getBoundingClientRect();
    const x = (r.left - stageOrigin[0]) / stageScale;
    const y = (r.top - stageOrigin[1]) / stageScale;
    return { left: x, top: y, right: x + r.width / stageScale, bottom: y + r.height / stageScale };
  }

  /* ---------- numbers ---------- */
  const r2 = (x) => Math.round(x * 100) / 100;
  /** The smallest "nice" step at least x. */
  function niceStep(x, list) {
    if (!(x > 0)) return list[0];
    const p = Math.pow(10, Math.floor(Math.log10(x)));
    const m = x / p;
    for (let i = 0; i < list.length; i++) if (list[i] * p >= x - 1e-9) return list[i] * p;
    return 10 * p;
  }
  // The graph is always 5 columns of years by 4 rows of population, as drawn.
  const X_STEPS = [1, 2, 5, 10];
  const Y_STEPS = [1, 2, 4, 5, 8, 10];
  const xAxisMax = (t) => 5 * niceStep(t / 5, X_STEPS);
  const yAxisMax = (n) => 4 * Math.max(1, niceStep(n / 4, Y_STEPS));

  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function fmtAxis(v) {
    if (v >= 1e4) {
      const e = Math.floor(Math.log10(v));
      const m = Math.round((v / Math.pow(10, e)) * 10) / 10;
      return `${m}×10${String(e).split('').map((c) => SUP[+c]).join('')}`;
    }
    return String(Math.round(v * 10) / 10);
  }
  const fill = (text, map) => text.replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));

  /* ======================================================================
     Graph (drawn in stage coordinates inside the graph card)
     ====================================================================== */
  const X0 = 966; const X1 = 1769; const Y0 = 646; const Y1 = 222;

  function svg(parent, tag, attrs, text) {
    const e = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k]));
    if (text !== undefined) e.textContent = text;
    parent.appendChild(e);
    return e;
  }

  function drawGraph(chart, m) {
    chart.textContent = '';
    const px = (t) => X0 + (t / m.tMax) * (X1 - X0);
    const py = (v) => Y0 - (v / m.yMax) * (Y0 - Y1);

    // grid: 5 columns x 4 rows
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 4; r++) {
        const x = X0 + (c * (X1 - X0)) / 5;
        const y = Y1 + (r * (Y0 - Y1)) / 4;
        svg(chart, 'rect', { class: 'g-cell', x, y, width: (X1 - X0) / 5, height: (Y0 - Y1) / 4 });
      }
    }
    // tick labels
    for (let i = 0; i <= 4; i++) {
      const v = (m.yMax * i) / 4;
      svg(chart, 'text', { class: 'g-tick', x: 928, y: py(v) + 9, 'text-anchor': 'middle' }, fmtAxis(v));
    }
    for (let i = 0; i <= 5; i++) {
      const t = (m.tMax * i) / 5;
      svg(chart, 'text', { class: 'g-tick', x: px(t), y: 685, 'text-anchor': 'middle' }, fmtAxis(t));
    }
    // axes and arrows
    svg(chart, 'rect', { class: 'g-axis', x: 964, y: Y0, width: 805, height: 6 });
    svg(chart, 'rect', { class: 'g-axis', x: 964, y: Y1, width: 6, height: Y0 - Y1 + 6 });
    svg(chart, 'rect', { class: 'g-arrow', x: 881, y: 240, width: 3, height: 388 });
    svg(chart, 'polygon', { class: 'g-arrow', points: '873,252 882.5,224 892,252' });
    svg(chart, 'rect', { class: 'g-arrow', x: 971, y: 704, width: 786, height: 3 });
    svg(chart, 'polygon', { class: 'g-arrow', points: '1755,696 1783,705.5 1755,715' });
    svg(chart, 'text', { class: 'g-cap', x: 1373, y: 743, 'text-anchor': 'middle' }, 'Time (years)');
    svg(chart, 'text', { class: 'g-cap', x: -430, y: 848, 'text-anchor': 'middle', transform: 'rotate(-90)' }, 'Population density (N)');

    // carrying capacity
    if (m.K && m.K <= m.yMax) {
      svg(chart, 'line', { class: 'g-kline', x1: 972, y1: py(m.K), x2: 1770, y2: py(m.K) });
      svg(chart, 'text', { class: 'g-k', x: 1736, y: py(m.K) - 17, 'text-anchor': 'end' }, `K = ${m.K}`);
    }
    // curve, with a dot at the start and at the current year
    const ser = m.ser;
    if (!ser.length) return;
    const pts = ser.map((n, i) => `${px(i).toFixed(1)},${py(Math.min(n, m.yMax)).toFixed(1)}`);
    if (ser.length > 1) svg(chart, 'polyline', { class: 'g-curve', points: pts.join(' ') });
    svg(chart, 'circle', { class: 'g-dot', cx: px(0), cy: py(Math.min(ser[0], m.yMax)), r: 8 });
    const last = ser.length - 1;
    if (last > 0 && ser[last] <= m.yMax) svg(chart, 'circle', { class: 'g-dot', cx: px(last), cy: py(ser[last]), r: 8 });
  }

  /** Shrinks a one-line text until it fits its box. */
  function fitLine(el, size) {
    el.style.fontSize = `${size}px`;
    let s = size;
    while (el.scrollWidth > el.clientWidth && s > 14) { s -= 1; el.style.fontSize = `${s}px`; }
  }

  /* ======================================================================
     The two simulations
     ====================================================================== */
  const FIELDS = {
    N: { min: 1, max: 1e9, step: 1, dp: 0 },
    r: { min: 0.01, max: 2, step: 0.01, dp: 2 },
    K: { min: 20, max: 5000, step: 10, dp: 0 }
  };

  function makeSim(p) {
    const keys = p === 'log' ? ['N', 'r', 'K'] : ['N', 'r'];
    const inputs = {};
    keys.forEach((k) => { inputs[k] = $(`${p}${k.toUpperCase()}`); });
    const S = {
      p, keys, inputs,
      ser: [], locked: false, N0: 0, r: 0, K: 0, tMax: 10, yMax: 8,
      instr: $(`${p}Instr`), graph: $(`${p}Graph`), chart: $(`${p}Chart`),
      eq: $(`${p}Eq`), calc: $(`${p}Calc`), plot: $(`${p}Plot`),
      next: $(`${p}Next`), skip: $(`${p}Skip`), reset: $(`${p}Reset`),
      errTop: $(`${p}ErrTop`), errBottom: $(`${p}ErrBottom`), lock: $(`${p}Lock`)
    };
    return S;
  }
  const sims = { exp: makeSim('exp'), log: makeSim('log') };
  const MAX_N = 1e15;

  /** Checks the boxes; returns the values, or the message and which note shows it. */
  function readInputs(S) {
    const E = C.errors;
    const raw = {};
    S.keys.forEach((k) => { raw[k] = S.inputs[k].value.trim(); });
    if (S.keys.every((k) => raw[k] === '')) return { ok: false, msg: '' };
    if (S.keys.some((k) => raw[k] === '')) return { ok: false, msg: S.p === 'log' ? E.fillThree : E.fillTwo, where: 'top' };
    const v = {};
    for (let i = 0; i < S.keys.length; i++) {
      const k = S.keys[i];
      v[k] = Number(raw[k]);
      if (!Number.isFinite(v[k])) return { ok: false, msg: E.numbers, where: k === 'N' ? 'top' : 'bottom' };
    }
    if (!Number.isInteger(v.N) || v.N < 1) return { ok: false, msg: E.n, where: 'top' };
    if (v.r < 0.01 || v.r > 2) return { ok: false, msg: E.r, where: 'bottom' };
    if (S.p === 'log') {
      if (v.K < 20 || v.K > 5000) return { ok: false, msg: E.k, where: 'bottom' };
      if (v.N >= v.K) return { ok: false, msg: E.nk, where: 'bottom' };
    }
    return { ok: true, v };
  }

  function validate(S) {
    if (S.locked) return;
    const res = readInputs(S);
    S.errTop.hidden = !(res.msg && res.where === 'top');
    S.errBottom.hidden = !(res.msg && res.where === 'bottom');
    S.errTop.textContent = S.errTop.hidden ? '' : res.msg;
    S.errBottom.textContent = S.errBottom.hidden ? '' : res.msg;
    S.plot.disabled = !res.ok;
  }

  function setLocked(S, on) {
    S.locked = on;
    S.keys.forEach((k) => { S.inputs[k].disabled = on; });
    document.querySelectorAll(`#${S.p}Inputs .num__btn`).forEach((b) => { b.disabled = on; });
    S.lock.hidden = !on;
    if (on) { S.errTop.hidden = true; S.errBottom.hidden = true; }
  }

  function setInstr(S, html) { S.instr.innerHTML = html; }

  function plot(S) {
    const res = readInputs(S);
    if (!res.ok) return;
    S.N0 = res.v.N; S.r = res.v.r; S.K = S.p === 'log' ? res.v.K : 0;
    S.ser = [S.N0];
    if (S.p === 'log') {
      S.yMax = yAxisMax(S.K * 1.15);
      const t99 = Math.log((99 * (S.K - S.N0)) / S.N0) / S.r;
      S.tMax = xAxisMax(Math.max(10, t99 * 1.3));
    } else {
      S.yMax = yAxisMax(S.N0 * 2);
      S.tMax = 10;
    }
    setLocked(S, true);
    S.plot.disabled = true;
    S.graph.classList.remove('is-idle');
    [S.next, S.skip, S.reset].forEach((b) => { b.disabled = false; });
    render(S);
  }

  /** Adds one year; returns false when the population can no longer be shown. */
  function step(S) {
    const N = S.ser[S.ser.length - 1];
    let next;
    if (S.p === 'log') {
      next = Math.min(S.K, r2(N + (S.r * N * (S.K - N)) / S.K));
    } else {
      if (N >= MAX_N) return false;
      next = r2(N + S.r * N);
    }
    S.ser.push(next);
    const year = S.ser.length - 1;
    if (S.p === 'log') {
      // once the curve has flattened near K, keep the time axis just past the current year
      if (next >= 0.95 * S.K) S.tMax = xAxisMax(year + 2);
      else if (year > S.tMax * 0.88) S.tMax = xAxisMax((year + 2) * 1.3);
    } else {
      if (next > S.yMax * 0.88) S.yMax = yAxisMax(next * 1.4);
      if (year > S.tMax * 0.88) S.tMax = xAxisMax((year + 2) * 1.3);
    }
    return true;
  }

  function render(S) {
    drawGraph(S.chart, S);
    const y = S.ser.length - 1;
    // working for the latest year
    S.eq.hidden = y !== 0;
    S.calc.hidden = y < 1;
    if (y >= 1) {
      const prev = S.ser[y - 1];
      const next = S.ser[y];
      $(`${S.p}CalcYear`).textContent = `Year ${y - 1} to Year ${y}`;
      let sum = `${prev.toFixed(1)} + ${S.r} × ${prev.toFixed(1)}`;
      if (S.p === 'log') sum += ` × ${r2((S.K - prev) / S.K).toFixed(3)}`;
      const el = $(`${S.p}CalcSum`);
      el.innerHTML = `${sum} = <span class="calc__res">${next.toFixed(1)}</span>`;
      fitLine(el, 30);
    }
    // what to notice
    const I = C.instr[S.p];
    if (S.p === 'exp') {
      const tooBig = S.ser[y] >= MAX_N;
      S.next.disabled = tooBig; S.skip.disabled = tooBig;
      if (tooBig) setInstr(S, I.tooBig);
      else if (y === 0) setInstr(S, I.step2);
      else if (y === 1) setInstr(S, I.good);
      else if (y < 5) setInstr(S, I.notice);
      else setInstr(S, I.observe);
    } else {
      const N = S.ser[y];
      const room = (S.K - N) / S.K;
      if (y === 0) setInstr(S, I.step2);
      else if (y === 1) setInstr(S, I.notice);
      else if (room > 0.4) setInstr(S, fill(I.fast, { room: room.toFixed(2) }));
      else if (room > 0.1) setInstr(S, fill(I.slowing, { room: room.toFixed(2) }));
      else if (N < 0.99 * S.K) setInstr(S, I.almost);
      else setInstr(S, I.reached);
    }
  }

  function resetSim(S) {
    S.ser = []; S.tMax = 10; S.yMax = 8; S.K = 0;
    setLocked(S, false);
    S.keys.forEach((k) => { S.inputs[k].value = ''; });
    S.errTop.hidden = true; S.errBottom.hidden = true;
    S.plot.disabled = true;
    S.eq.hidden = true; S.calc.hidden = true;
    S.graph.classList.add('is-idle');
    [S.next, S.skip, S.reset].forEach((b) => { b.disabled = true; });
    setInstr(S, C.instr[S.p].step1);
    drawGraph(S.chart, S);
  }

  /** Up/down arrow next to a box. */
  function nudge(S, k, dir) {
    if (S.locked) return;
    const f = FIELDS[k];
    const cur = Number(S.inputs[k].value);
    let v;
    if (S.inputs[k].value.trim() === '' || !Number.isFinite(cur)) v = f.min;
    else v = cur + dir * f.step;
    v = Math.min(f.max, Math.max(f.min, v));
    S.inputs[k].value = v.toFixed(f.dp).replace(/^(\d+\.\d*?)0+$/, '$1').replace(/\.$/, '');
    validate(S);
  }

  Object.keys(sims).forEach((p) => {
    const S = sims[p];
    S.keys.forEach((k) => {
      S.inputs[k].addEventListener('input', () => validate(S));
      S.inputs[k].addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !S.plot.disabled) plot(S);
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); nudge(S, k, e.key === 'ArrowUp' ? 1 : -1); }
      });
    });
    document.querySelectorAll(`#${p}Inputs .num__btn`).forEach((b) => {
      const k = S.keys.find((key) => `${p}${key.toUpperCase()}` === b.dataset.input);
      b.addEventListener('click', () => nudge(S, k, Number(b.dataset.dir)));
    });
    S.plot.addEventListener('click', () => plot(S));
    S.next.addEventListener('click', () => { if (step(S)) render(S); });
    S.skip.addEventListener('click', () => { for (let i = 0; i < 5; i++) if (!step(S)) break; render(S); });
    S.reset.addEventListener('click', () => { resetSim(S); S.inputs.N.focus({ preventScroll: true }); });
  });

  /* ======================================================================
     Screens
     ====================================================================== */
  let screen = 'start';
  function go(next) {
    if (screen !== 'start' && screen !== next) resetSim(sims[screen]);
    screen = next;
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('is-active', s.id === `screen-${next}`));
    $('homeBtn').hidden = next === 'start';
  }
  $('goExp').addEventListener('click', () => go('exp'));
  $('goLog').addEventListener('click', () => go('log'));
  $('homeBtn').addEventListener('click', () => go('start'));

  /* ======================================================================
     Insights
     ====================================================================== */
  $('insightsList').innerHTML = C.insights.map((t) => `<li>${t}</li>`).join('');
  let modalFocus = null;
  function openInsights() {
    modalFocus = document.activeElement;
    $('insightsModal').hidden = false;
    document.body.classList.add('has-modal');
    $('insightsClose').focus({ preventScroll: true });
  }
  function closeInsights() {
    if ($('insightsModal').hidden) return;
    $('insightsModal').hidden = true;
    document.body.classList.remove('has-modal');
    if (modalFocus && modalFocus.focus) modalFocus.focus({ preventScroll: true });
  }
  $('insightsBtn').addEventListener('click', openInsights);
  $('insightsClose').addEventListener('click', closeInsights);
  $('insightsModal').addEventListener('click', (e) => { if (e.target === $('insightsModal')) closeInsights(); });
  document.addEventListener('keydown', (e) => {
    if ($('insightsModal').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeInsights(); }
    if (e.key === 'Tab') { e.preventDefault(); $('insightsClose').focus(); }
  });

  /* ======================================================================
     How to use: a spotlight with one short sentence per step. On a card
     screen with no graph yet, it runs a live demo with example values and
     clears it again at the end, restoring anything that had been typed.
     ====================================================================== */
  const tour = { i: 0, steps: [], key: null, demo: false, saved: null, lastFocus: null };
  const visible = (sel) => Array.from(document.querySelectorAll(sel)).filter((e) => e.offsetParent !== null && e.offsetWidth > 0);

  const demo = {
    fill(S) {
      if (S.ser.length) return;
      const d = C.demo[S.p];
      S.keys.forEach((k) => { S.inputs[k].value = d[k]; });
      validate(S);
    },
    plot(S) {
      if (S.ser.length) return;
      demo.fill(S);
      plot(S);
    },
    advance(S) {
      demo.plot(S);
      if (S.ser.length > 1) return;
      if (S.p === 'log') { for (let i = 0; i < 10; i++) step(S); } else { for (let i = 0; i < 3; i++) step(S); }
      render(S);
    }
  };

  function startTour(key) {
    if (!$('tour').hidden) return;
    closeInsights();
    const S = sims[key];
    tour.key = key;
    tour.demo = !!(S && !S.ser.length);
    tour.saved = tour.demo ? S.keys.map((k) => S.inputs[k].value) : null;
    tour.steps = C.tours[key].filter((st) => tour.demo || !st.sel || visible(st.sel).length);
    tour.i = 0;
    tour.lastFocus = document.activeElement;
    document.body.classList.add('has-tour');
    $('tour').hidden = false;
    showStep();
  }
  function endTour() {
    if ($('tour').hidden) return;
    $('tour').hidden = true;
    document.body.classList.remove('has-tour');
    const S = sims[tour.key];
    if (tour.demo && S) {
      resetSim(S);
      S.keys.forEach((k, i) => { S.inputs[k].value = tour.saved[i]; });
      validate(S);
    }
    if (tour.lastFocus && tour.lastFocus.focus && tour.lastFocus.offsetParent !== null) tour.lastFocus.focus({ preventScroll: true });
    else if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }
  function showStep() {
    const st = tour.steps[tour.i];
    const S = sims[tour.key];
    if (tour.demo && st.demo && S) demo[st.demo](S);
    $('tourStep').textContent = `Step ${tour.i + 1} of ${tour.steps.length}`;
    $('tourTitle').textContent = st.title;
    $('tourText').textContent = st.text + (tour.demo && st.demoText ? st.demoText : '');
    $('tourPrev').disabled = tour.i === 0;
    $('tourNext').textContent = tour.i === tour.steps.length - 1 ? 'Done' : 'Next';
    requestAnimationFrame(positionTour);
    $('tourNext').focus({ preventScroll: true });
  }
  function positionTour() {
    if ($('tour').hidden) return;
    const st = tour.steps[tour.i];
    const spot = $('tourSpot');
    const card = $('tourCard');
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const els = st.sel ? visible(st.sel) : [];
    if (!els.length) {
      spot.classList.add('is-blank');
      spot.style.left = '960px'; spot.style.top = '540px'; spot.style.width = '0px'; spot.style.height = '0px';
      card.style.left = `${(1920 - cw) / 2}px`; card.style.top = `${(1080 - ch) / 2}px`;
      return;
    }
    spot.classList.remove('is-blank');
    const rs = els.map(stageRect);
    const r = { left: Math.min(...rs.map((x) => x.left)), top: Math.min(...rs.map((x) => x.top)), right: Math.max(...rs.map((x) => x.right)), bottom: Math.max(...rs.map((x) => x.bottom)) };
    const pad = 10;
    spot.style.left = `${r.left - pad}px`; spot.style.top = `${r.top - pad}px`;
    spot.style.width = `${r.right - r.left + pad * 2}px`; spot.style.height = `${r.bottom - r.top + pad * 2}px`;
    let left = Math.min(Math.max(r.left, 40), 1920 - cw - 40);
    let top;
    if (r.bottom + pad + 30 + ch < 1060) top = r.bottom + pad + 30;
    else if (r.top - pad - 30 - ch > 20) top = r.top - pad - 30 - ch;
    else if (r.right + pad + 40 + cw < 1900) { left = r.right + pad + 40; top = Math.min(Math.max(r.top, 40), 1080 - ch - 24); }
    else if (r.left - pad - 40 - cw > 20) { left = r.left - pad - 40 - cw; top = Math.min(Math.max(r.top, 40), 1080 - ch - 24); }
    else top = 1080 - ch - 24;
    card.style.left = `${left}px`; card.style.top = `${top}px`;
  }

  $('helpBtn').addEventListener('click', () => startTour(screen));
  $('tourNext').addEventListener('click', () => { if (tour.i < tour.steps.length - 1) { tour.i++; showStep(); } else endTour(); });
  $('tourPrev').addEventListener('click', () => { if (tour.i > 0) { tour.i--; showStep(); } });
  $('tourSkip').addEventListener('click', endTour);
  document.addEventListener('keydown', (e) => {
    if ($('tour').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); endTour(); }
    if (e.key === 'Tab') {
      const f = [$('tourSkip'), $('tourPrev'), $('tourNext')].filter((b) => !b.disabled);
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  /* ======================================================================
     Start
     ====================================================================== */
  window.addEventListener('resize', () => { fitStage(); positionTour(); });
  fitStage();
  resetSim(sims.exp);
  resetSim(sims.log);
}());
