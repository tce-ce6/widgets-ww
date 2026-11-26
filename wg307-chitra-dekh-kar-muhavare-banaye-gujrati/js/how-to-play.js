/* ==========================================================================
   How to play (મદદ): a guided tour of the screen (same as wg287).
   The help button at the bottom left opens a spotlight tour with short steps
   and an animated hand showing the taps. Works in viewport coordinates, so it
   is independent of the stage scale.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const tour = $('#tour');
  const spot = $('#tourSpot');
  const layer = $('#tourDemo');
  const card = $('#tourCard');
  const stageEl = $('#stage');
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff" stroke="#0b6b04" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  const TXT = { step: (i, n) => `પગલું ${i} / ${n}`, next: 'આગળ', last: 'રમવાનું શરૂ કરો' };

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const visible = (el) => el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  function unionRect(els) {
    const list = els.filter(visible);
    if (!list.length) return null;
    let l = 1e9; let t = 1e9; let r = -1e9; let b = -1e9;
    list.forEach((el) => {
      const x = el.getBoundingClientRect();
      if (!x.width || !x.height) return;
      l = Math.min(l, x.left); t = Math.min(t, x.top); r = Math.max(r, x.right); b = Math.max(b, x.bottom);
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
        const pts = getPoints();
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
        const els = getEls();
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

  /* ---------- tour steps ---------- */

  const chips = () => $$('#bank .chip').filter((c) => !c.classList.contains('is-used'));
  const slots = () => $$('#slots .slot');

  const STEPS = [
    {
      title: 'ચિત્ર જુઓ',
      text: 'આ ચિત્ર એક <b>રૂઢિપ્રયોગ</b> બતાવે છે. ધ્યાનથી જુઓ.',
      target: () => unionRect([$('#pic')]),
      anim: null
    },
    {
      title: 'શબ્દો',
      text: 'અહીં ઘણા શબ્દો છે. તેમાંથી કેટલાક જ રૂઢિપ્રયોગના <b>સાચા શબ્દો</b> છે.',
      target: () => unionRect([$('#bank')]),
      anim: (tok) => popLoop(tok, () => chips().slice(0, 5))
    },
    {
      title: 'ક્રમમાં શબ્દો પસંદ કરો',
      text: 'સાચા શબ્દોને <b>સાચા ક્રમમાં</b> સ્પર્શ કરો. શબ્દ ખાલી જગ્યામાં આવી જશે. ખોટો શબ્દ <b>લાલ</b> થઈને હલશે.',
      target: () => unionRect([$('#tray'), $('#bank')]),
      anim: (tok) => tapLoop(tok, () => chips().slice(0, 2).map(centre))
    },
    {
      title: 'અર્થ અને વાક્યપ્રયોગ',
      text: 'રૂઢિપ્રયોગ પૂરો થાય ત્યારે તેનો <b>અર્થ</b> અને <b>વાક્યપ્રયોગ</b> અહીં દેખાય છે.',
      target: () => unionRect([$('#tray'), $('#bank').hidden ? $('#result .panel--usage') : $('#bank')]),
      anim: (tok) => popLoop(tok, slots)
    },
    {
      title: 'જવાબ અને આગળનું ઉદાહરણ',
      text: '<b>જવાબ જુઓ</b> થી રૂઢિપ્રયોગ દેખાય છે અને <b>જવાબ છુપાવો</b> થી ફરી છુપાઈ જાય છે. <b>આગળનું ઉદાહરણ</b> થી આગળનું ચિત્ર આવે છે.',
      target: () => unionRect([$('#answerBtn'), $('#nextBtn')]),
      anim: (tok) => tapLoop(tok, () => [centre($('#nextBtn'))])
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
        left = rect.left + rect.width / 2 < W / 2 ? rect.right + gap : rect.left - gap - cw;
        if (left < m || left + cw > W - m) left = rect.left + rect.width / 2 < W / 2 ? W - cw - m - 16 : m + 16;
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
    $('#tourCount').textContent = TXT.step(index + 1, steps.length);
    $('#tourTitle').textContent = step.title;
    $('#tourText').innerHTML = step.text;
    $('#tourBack').hidden = index === 0;
    $('#tourNext').textContent = index === steps.length - 1 ? TXT.last : TXT.next;
    $('#tourDots').innerHTML = steps.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeCard(rect);
    if (step.anim) step.anim(tok);
  }

  function open() {
    steps = STEPS;
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

  /* ---------- the help button, bottom left of the stage ---------- */

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'how-btn';
  button.setAttribute('aria-label', 'મદદ: કેવી રીતે રમવું');
  button.innerHTML = '<img src="assets/svg/help-btn.svg" alt=""><span aria-hidden="true">મદદ</span>';
  button.addEventListener('click', open);
  stageEl.appendChild(button);
}());
