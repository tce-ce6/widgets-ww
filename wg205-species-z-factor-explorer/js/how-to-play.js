/* ==========================================================================
   How to play: a guided spotlight tour (same UI and behaviour as wg202).
   The Help button (top right, on every screen) opens short steps for the
   screen in view: the mode select, Mode 1 or Mode 2. An animated hand shows
   what to tap. Works in viewport coordinates, so it is independent of the
   stage scale.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const tour = $('#tour');
  const spot = $('#tourSpot');
  const layer = $('#tourDemo');
  const card = $('#tourCard');
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff" stroke="#0e5113" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const visible = (el) => el && !el.hidden && el.getClientRects().length > 0;
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  // Box around the visible elements and everything inside them.
  function unionRect(els) {
    const list = els.filter(visible);
    if (!list.length) return null;
    let l = 1e9; let t = 1e9; let r = -1e9; let b = -1e9;
    list.forEach((root) => {
      [root, ...$$('*', root)].forEach((el) => {
        const x = el.getBoundingClientRect();
        if (!x.width || !x.height) return;
        l = Math.min(l, x.left); t = Math.min(t, x.top); r = Math.max(r, x.right); b = Math.max(b, x.bottom);
      });
    });
    if (l > r) return null;
    return { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
  }

  function make(cls, pt, html) {
    const el = document.createElement('div');
    el.className = cls;
    el.innerHTML = html || '';
    el.style.left = `${pt.x}px`;
    el.style.top = `${pt.y}px`;
    layer.appendChild(el);
    return el;
  }

  const ripple = (pt) => {
    const r = make('tour-ripple', pt);
    setTimeout(() => r.remove(), 700);
  };

  const slide = (el, a, b, duration) => el.animate(
    [{ left: `${a.x}px`, top: `${a.y}px` }, { left: `${b.x}px`, top: `${b.y}px` }],
    { duration, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' }
  );

  function clearDemo() {
    layer.innerHTML = '';
    $$('.tour-pop').forEach((el) => el.classList.remove('tour-pop'));
  }

  /* ---------- animated demos (each loops until the step changes) ---------- */

  // Move the hand to each point and press it, over and over.
  async function tapLoop(tok, getPoints) {
    try {
      while (true) {
        const pts = getPoints().filter(Boolean);
        if (!pts.length) return;
        const first = pts[0];
        const hand = make('tour-hand', { x: first.x + 70, y: first.y + 60 }, HAND);
        let prev = { x: first.x + 70, y: first.y + 60 };
        for (const p of pts) {
          slide(hand, prev, p, 650);
          await wait(700, tok);
          hand.classList.add('is-press');
          ripple(p);
          await wait(200, tok);
          hand.classList.remove('is-press');
          prev = p;
          await wait(500, tok);
        }
        await wait(700, tok);
        layer.innerHTML = '';
        await wait(400, tok);
      }
    } catch (e) { /* step changed */ }
  }

  // Briefly pulse each element in turn.
  async function popLoop(tok, getEls) {
    try {
      while (true) {
        const els = getEls().filter(visible);
        for (const el of els) {
          el.classList.remove('tour-pop');
          void el.offsetWidth;
          el.classList.add('tour-pop');
          await wait(260, tok);
        }
        await wait(1300, tok);
        els.forEach((el) => el.classList.remove('tour-pop'));
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- tour steps per screen ---------- */

  const insightsHome = {
    title: 'Insights and Home',
    text: 'Tap <b>Insights</b> to read the key ideas about species, area and Z. The <b>Home</b> button takes you back to choose a mode.',
    target: () => unionRect([$('#insightsBtn'), $('#homeBtn')]),
    anim: (tok) => tapLoop(tok, () => [centre($('#insightsBtn')), centre($('#homeBtn'))])
  };

  const scaleStep = {
    title: 'Change the scale',
    text: 'Tap the switch to change the graph from a <b>Linear scale</b> to a <b>Log–log scale</b>. On the log–log scale the curve becomes a straight line.',
    target: () => unionRect([$('#togglePanel')]),
    anim: (tok) => tapLoop(tok, () => [centre($('#scaleSwitch'))])
  };

  const axisPoints = () => {
    const x = $('#xAxisHit').getBoundingClientRect();
    const y = $('#yAxisHit').getBoundingClientRect();
    return [{ x: x.left + x.width * 0.45, y: x.top + x.height / 2 }, { x: y.left + y.width / 2, y: y.top + y.height * 0.45 }];
  };

  const STEPS = {
    home: [
      {
        title: 'Choose a mode',
        text: 'There are two ways to explore how the number of species changes with the size of an area. Pick one to begin.',
        target: () => unionRect([$('#cardSpecies'), $('#cardZ')]),
        anim: (tok) => popLoop(tok, () => [$('#cardSpecies'), $('#cardZ')])
      },
      {
        title: 'Mode 1: Species–Area',
        text: 'Reveal the number of species in five areas of different sizes and watch the graph they make.',
        target: () => unionRect([$('#cardSpecies')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#cardSpecies'))])
      },
      {
        title: 'Mode 2: Z value',
        text: 'Pick a small or large region, type in your own <b>Z</b> value and see the graph it makes.',
        target: () => unionRect([$('#cardZ')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#cardZ'))])
      },
      {
        title: 'Insights',
        text: 'Tap <b>Insights</b> any time to read the key ideas about species, area and Z.',
        target: () => unionRect([$('#insightsBtn')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#insightsBtn'))])
      }
    ],

    mode1: [
      {
        title: 'Reveal each area',
        text: 'Tap <b>Reveal</b> next to an area to see how many species live there. Each one adds a point to the graph.',
        target: () => unionRect([$('#areaList')]),
        anim: (tok) => tapLoop(tok, () => {
          const btn = $$('#areaList .reveal-btn').filter(visible)[0];
          return btn ? [centre(btn)] : [];
        })
      },
      {
        title: 'Watch the graph',
        text: 'The points show species richness against area. Look at the curve: it rises fast, then flattens.',
        target: () => unionRect([$('#graphPanel')]),
        anim: null
      },
      {
        title: 'Read a value',
        text: 'Once all five points are shown, click on either <b>axis</b> to find the matching value on the other axis.',
        target: () => unionRect([$('#graphPanel')]),
        anim: (tok) => tapLoop(tok, axisPoints)
      },
      scaleStep,
      {
        title: 'Reset or a new set',
        text: '<b>Reset this set</b> hides the values again so you can start over. <b>New set</b> gives you a different group of species and areas.',
        target: () => unionRect([$('#resetBtn'), $('#newSetBtn')]),
        anim: (tok) => popLoop(tok, () => [$('#resetBtn'), $('#newSetBtn')])
      },
      insightsHome
    ],

    mode2: [
      {
        title: 'Choose a region',
        text: 'Tap <b>Small region</b> or <b>Large region</b>. Each one shows the range Z usually lies in for that size of region.',
        target: () => unionRect([$('#btnSmallRegion'), $('#btnLargeRegion')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#btnSmallRegion')), centre($('#btnLargeRegion'))])
      },
      {
        title: 'Type a Z value',
        text: 'Type a Z value in that range, or use the arrows to change it. Then tap <b>Plot graph</b>.',
        target: () => unionRect([$('.z-input'), $('#plotZBtn')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#zUp')), centre($('#plotZBtn'))])
      },
      {
        title: 'Read your graph',
        text: 'Your Z value draws the curve. Click on either <b>axis</b> to find the matching value on the other axis.',
        target: () => unionRect([$('#graphPanel')]),
        anim: (tok) => tapLoop(tok, axisPoints)
      },
      {
        title: 'Try another Z',
        text: 'Tap <b>Try another Z</b> to clear the graph and test a different value or region.',
        target: () => unionRect([$('#newZBtn')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#newZBtn'))])
      },
      scaleStep,
      insightsHome
    ]
  };

  // which steps fit the screen in view
  function currentSteps() {
    if ($('#screen-home').classList.contains('is-active')) return STEPS.home;
    const explore = $('#screen-explore');
    if (explore.classList.contains('is-mode2')) return STEPS.mode2;
    return STEPS.mode1;
  }

  /* ---------- card placement and rendering ---------- */

  function placeCard(rect) {
    const m = 12; const gap = 18; const W = innerWidth; const H = innerHeight;
    const cw = card.offsetWidth; const ch = card.offsetHeight;
    let top; let left;
    if (!rect) {
      left = (W - cw) / 2;
      top = (H - ch) / 2;
    } else {
      left = rect.left + rect.width / 2 - cw / 2;
      if (rect.bottom + gap + ch <= H - m) top = rect.bottom + gap;
      else if (rect.top - gap - ch >= m) top = rect.top - gap - ch;
      else {
        // no room above or below: sit beside the highlighted area
        top = Math.min(H - ch - m, Math.max(m, rect.top + 20));
        left = rect.left + rect.width / 2 < W / 2 ? W - cw - m - 16 : m + 16;
      }
    }
    card.style.left = `${Math.max(m, Math.min(W - cw - m, left))}px`;
    card.style.top = `${Math.max(m, Math.min(H - ch - m, top))}px`;
  }

  function go(index) {
    stepIndex = index;
    const tok = ++token;
    clearDemo();
    const step = steps[index];
    const rect = step.target();
    const pad = 10;
    if (rect) {
      spot.hidden = false;
      Object.assign(spot.style, {
        left: `${rect.left - pad}px`, top: `${rect.top - pad}px`,
        width: `${rect.width + pad * 2}px`, height: `${rect.height + pad * 2}px`
      });
    } else {
      spot.hidden = true;
    }
    $('#tourCount').textContent = `Step ${index + 1} of ${steps.length}`;
    $('#tourTitle').textContent = step.title;
    $('#tourText').innerHTML = step.text;
    $('#tourBack').hidden = index === 0;
    $('#tourNext').textContent = index === steps.length - 1 ? 'Start exploring' : 'Next';
    $('#tourDots').innerHTML = steps.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeCard(rect);
    if (step.anim) step.anim(tok);
  }

  function open() {
    steps = currentSteps();
    opener = document.activeElement;
    tour.classList.add('is-open', 'no-anim');
    tour.setAttribute('aria-hidden', 'false');
    go(0);
    requestAnimationFrame(() => requestAnimationFrame(() => tour.classList.remove('no-anim')));
    $('#tourNext').focus();
  }

  function close() {
    token++;
    clearDemo();
    tour.classList.remove('is-open');
    tour.setAttribute('aria-hidden', 'true');
    if (opener && document.body.contains(opener)) opener.focus();
  }

  $('#tourSkip').addEventListener('click', close);
  $('#tourBack').addEventListener('click', () => { if (stepIndex > 0) go(stepIndex - 1); });
  $('#tourNext').addEventListener('click', () => (stepIndex < steps.length - 1 ? go(stepIndex + 1) : close()));
  document.addEventListener('keydown', (event) => {
    if (!tour.classList.contains('is-open')) return;
    if (event.key === 'Escape') { event.stopImmediatePropagation(); close(); }
    if (event.key === 'ArrowRight') $('#tourNext').click();
    if (event.key === 'ArrowLeft') $('#tourBack').click();
  }, true);
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (!tour.classList.contains('is-open')) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => go(stepIndex), 150);
  });

  // the Help button (top right, shown on the mode select and in both modes)
  $('#helpBtn').addEventListener('click', open);
}());
