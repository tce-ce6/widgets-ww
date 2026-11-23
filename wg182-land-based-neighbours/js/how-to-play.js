/* ==========================================================================
   How to play: a guided tour of the mission screen (same as wg202).
   A help button at the bottom left of the mission screen (not the home
   screen) opens a spotlight tour with short steps and an animated hand
   showing the taps. Works in viewport coordinates, so it is independent of
   the stage scale. The same file is used by wg178 and wg182.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const tour = $('#tour');
  const spot = $('#tourSpot');
  const layer = $('#tourDemo');
  const card = $('#tourCard');
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff" stroke="#222" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const visible = (el) => el && el.offsetParent !== null && !el.closest('[hidden]');
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  // Box around the visible elements and everything inside them (absolutely
  // positioned children can stick out of a parent that reports a smaller box).
  function unionRect(els) {
    const list = els.filter(visible);
    if (!list.length) return null;
    let l = 1e9; let t = 1e9; let r = -1e9; let b = -1e9;
    list.forEach((root) => {
      [root, ...$$('*', root)].forEach((el) => {
        if (el.closest('svg') && el.tagName !== 'svg') return; // map paths reach far outside the frame
        const x = el.getBoundingClientRect();
        if (!x.width || !x.height) return;
        l = Math.min(l, x.left); t = Math.min(t, x.top); r = Math.max(r, x.right); b = Math.max(b, x.bottom);
      });
    });
    if (l > r) return null;
    return { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
  }

  // The map frame clips everything inside it, so its own box is the spotlight.
  const boxOf = (el) => (visible(el) ? el.getBoundingClientRect() : null);

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

  const openFlags = () => $$('#flags .flag:not(.is-done)');
  const clueParts = () => ['#clueHint', '#clueDots', '#clueText', '#clueQuestion', '#clueWrong'].map((s) => $(s));
  // a spot on the map to demonstrate a tap (not on any answer)
  const mapPoint = () => {
    const r = $('#map').getBoundingClientRect();
    return { x: r.left + r.width * 0.45, y: r.top + r.height * 0.55 };
  };

  const STEPS = {
    mission: [
      {
        title: 'Choose a flag',
        text: 'Each flag belongs to one of India\'s land-based neighbours. Tap a flag to start finding its country.',
        target: () => unionRect([$('#flags')]),
        anim: (tok) => tapLoop(tok, () => openFlags().slice(0, 1).map(centre))
      },
      {
        title: 'Read the clue',
        text: 'One by one, a set of clues about the country appears here. The dots show which of the <b>four clues</b> you are on.',
        target: () => unionRect(clueParts()),
        anim: (tok) => popLoop(tok, () => $$('#clueDots i').filter(visible))
      },
      {
        title: 'Tap the country',
        text: 'Use the clues to find the country, then tap it on the map.',
        target: () => boxOf($('#map')),
        anim: (tok) => tapLoop(tok, () => [mapPoint()])
      },
      {
        title: 'Right or wrong?',
        text: 'If you are right, a card shows the country, its capital and all four clues. If not, you get the next clue. After four clues the answer is shown.',
        target: () => unionRect([$('#flagPanel')]),
        anim: null
      },
      {
        title: 'Next Country',
        text: 'The country is marked on the map with its flag and name. Tap <b>Next Country</b> on the card to move on. Find every country to complete the mission.',
        target: () => boxOf($('#map')),
        anim: null
      }
    ],

    end: [
      {
        title: 'Mission complete',
        text: 'Every neighbour is now marked on the map with its flag and name.',
        target: () => boxOf($('#map')),
        anim: null
      },
      {
        title: 'Play again',
        text: 'Tap <b>Home</b> to go back to the start and play the mission again.',
        target: () => unionRect([$('#endPanel')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#homeBtn'))])
      }
    ]
  };

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
        // the map is too wide for that: sit over its lower right corner instead
        if (rect.width > W * 0.55) {
          left = rect.right - cw - 24;
          top = rect.bottom - ch - 24;
        }
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
    $('#tourNext').textContent = index === steps.length - 1 ? 'Start playing' : 'Next';
    $('#tourDots').innerHTML = steps.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeCard(rect);
    if (step.anim) step.anim(tok);
  }

  function open() {
    steps = visible($('#endPanel')) ? STEPS.end : STEPS.mission;
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

  /* ---------- the button, bottom left of the mission screen (not the home screen) ---------- */

  const section = document.getElementById('screen-game');
  if (section) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'how-btn';
    button.setAttribute('aria-label', 'How to play');
    button.innerHTML = '<img src="assets/images/help-btn.svg" alt="">';
    button.addEventListener('click', open);
    section.appendChild(button);
  }
}());
