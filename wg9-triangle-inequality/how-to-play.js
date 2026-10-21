/* ==========================================================================
   How to play: a short guided tour of the Triangle Inequality widget.
   A "How to play" button (top right) opens a spotlight tour with an animated
   hand showing the taps. Works in viewport coordinates.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const tour = document.getElementById('tour');
  const spot = document.getElementById('tourSpot');
  const layer = document.getElementById('tourDemo');
  const card = document.getElementById('tourCard');
  const HAND = '<svg viewBox="0 0 24 24" width="44" height="44"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#ffffff" stroke="#16233f" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  // Canvas size and where things are drawn on it (see script.js).
  const CANVAS_W = 1200;
  const BASE_X = 120;
  const GAP = 100;
  const BASE_Y = 400;

  let stepIndex = 0;
  let token = 0;
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const shown = (el) => !!el && el.getClientRects().length > 0;
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  function unionRect(els) {
    const list = els.filter(shown);
    if (!list.length) return null;
    let l = 1e9; let t = 1e9; let r = -1e9; let b = -1e9;
    list.forEach((el) => {
      const x = el.getBoundingClientRect();
      l = Math.min(l, x.left); t = Math.min(t, x.top); r = Math.max(r, x.right); b = Math.max(b, x.bottom);
    });
    return { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
  }

  // Canvas drawing coordinates -> viewport coordinates.
  const canvasEl = () => $('#mainCanvas canvas');
  function toClient(x, y) {
    const r = canvasEl().getBoundingClientRect();
    const k = r.width / CANVAS_W;
    return { x: r.left + x * k, y: r.top + y * k };
  }
  function canvasRect(x0, y0, x1, y1) {
    const a = toClient(x0, y0);
    const b = toClient(x1, y1);
    return { left: a.x, top: a.y, right: b.x, bottom: b.y, width: b.x - a.x, height: b.y - a.y };
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

  // Move the hand to each point in turn and press it.
  async function tapLoop(tok, getPoints) {
    try {
      while (true) {
        const pts = getPoints();
        if (!pts.length) return;
        const first = pts[0];
        let prev = { x: first.x + 70, y: first.y + 60 };
        const hand = make('tour-hand', prev, HAND);
        for (const p of pts) {
          slide(hand, prev, p, 650);
          await wait(700, tok);
          hand.classList.add('is-press');
          ripple(p);
          await wait(200, tok);
          hand.classList.remove('is-press');
          prev = p;
          await wait(600, tok);
        }
        await wait(700, tok);
        layer.innerHTML = '';
        await wait(400, tok);
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- tour steps ---------- */

  const STEPS = [
    {
      title: 'Three line segments',
      text: 'The three coloured sticks are <b>AB</b> (orange), <b>BC</b> (green) and <b>AC</b> (blue). The number in each circle is its length.',
      target: () => canvasRect(85, 90, 355, 425),
      anim: null
    },
    {
      title: 'Change the lengths',
      text: 'Tap <b>+</b> under a stick to make it longer and <b>−</b> to make it shorter. Each length can be from 1 to 10.',
      target: () => canvasRect(85, 435, 355, 545),
      anim: (tok) => tapLoop(tok, () => [
        toClient(BASE_X, BASE_Y + 60),
        toClient(BASE_X + GAP, BASE_Y + 120)
      ])
    },
    {
      title: 'Check each pair',
      text: 'On the right, each question adds two sticks and compares them with the third. A triangle only works if <b>all three</b> sums are bigger.',
      target: () => canvasRect(880, 190, 1140, 440),
      anim: null
    },
    {
      title: 'Make the triangle',
      text: 'Tap <b>Make the triangle</b> to try joining the sticks. A ✔ or ✗ appears next to each question and the shape is drawn.',
      target: () => unionRect([$('#make-triangle-btn')]),
      anim: (tok) => tapLoop(tok, () => [centre($('#make-triangle-btn'))])
    },
    {
      title: 'What happened?',
      text: 'If every sum is bigger, the sticks close into a <b>triangle</b>. If not, the two shorter sticks are too short to meet and the shape stays <b>open</b>.',
      target: () => canvasRect(0, 0, 1200, 650),
      anim: null
    },
    {
      title: 'Try again',
      text: 'Tap <b>Shuffle</b> to swap the lengths between the sticks, or <b>Reset</b> to get three new lengths. Then change the numbers and test again.',
      target: () => unionRect([$('#reset-btn'), $('#shuffle-btn')]),
      anim: (tok) => tapLoop(tok, () => [centre($('#reset-btn'))])
    }
  ];

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
    layer.innerHTML = '';
    const step = STEPS[index];
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
    $('#tourCount').textContent = `Step ${index + 1} of ${STEPS.length}`;
    $('#tourTitle').textContent = step.title;
    $('#tourText').innerHTML = step.text;
    $('#tourBack').hidden = index === 0;
    $('#tourNext').textContent = index === STEPS.length - 1 ? 'Start playing' : 'Next';
    $('#tourDots').innerHTML = STEPS.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeCard(rect);
    if (step.anim) step.anim(tok);
  }

  function open() {
    opener = document.activeElement;
    tour.classList.add('is-open', 'no-anim');
    tour.setAttribute('aria-hidden', 'false');
    go(0);
    requestAnimationFrame(() => requestAnimationFrame(() => tour.classList.remove('no-anim')));
    $('#tourNext').focus();
  }

  function close() {
    token++;
    layer.innerHTML = '';
    tour.classList.remove('is-open');
    tour.setAttribute('aria-hidden', 'true');
    if (opener && document.body.contains(opener)) opener.focus();
  }

  $('#tourSkip').addEventListener('click', close);
  $('#tourBack').addEventListener('click', () => { if (stepIndex > 0) go(stepIndex - 1); });
  $('#tourNext').addEventListener('click', () => (stepIndex < STEPS.length - 1 ? go(stepIndex + 1) : close()));
  $('#howBtn').addEventListener('click', open);
  document.addEventListener('keydown', (event) => {
    if (!tour.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') $('#tourNext').click();
    if (event.key === 'ArrowLeft') $('#tourBack').click();
  });
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (!tour.classList.contains('is-open')) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => go(stepIndex), 150);
  });
}());
