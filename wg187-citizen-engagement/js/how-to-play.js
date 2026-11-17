/* ==========================================================================
   How to play: a guided tour for each inner screen (same as wg202).
   A help button on the problem and summary screens (not the home screen)
   opens a spotlight tour with short steps and an animated hand showing the
   drag / tap. Works in viewport coordinates, so it is independent of the
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
  const stageEl = $('#stage');
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff2e1" stroke="#44200e" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const scale = () => stageEl.getBoundingClientRect().width / 1920;
  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const visible = (el) => el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
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
    $$('.tour-lift, .tour-pop').forEach((el) => el.classList.remove('tour-lift', 'tour-pop'));
  }

  /* ---------- animated demos (each loops until the step changes) ---------- */

  // Press on `from`, carry a copy of the tool card to `to`, let go.
  async function dragLoop(tok, getFrom, getTo, liftEl) {
    try {
      while (true) {
        const from = getFrom(); const to = getTo();
        const hand = make('tour-hand', { x: from.x + 60, y: from.y + 50 }, HAND);
        slide(hand, { x: from.x + 60, y: from.y + 50 }, from, 500);
        await wait(560, tok);
        hand.classList.add('is-press');
        ripple(from);
        if (liftEl) {
          liftEl.classList.add('tour-lift');
          const rect = liftEl.getBoundingClientRect();
          const ghost = make('tour-ghost', from, '');
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.background = liftEl.style.background;
          await wait(250, tok);
          slide(ghost, from, to, 1300);
          slide(hand, from, to, 1300);
          await wait(1380, tok);
          ghost.classList.add('is-settle');
        }
        hand.classList.remove('is-press');
        ripple(to);
        await wait(800, tok);
        layer.innerHTML = '';
        if (liftEl) liftEl.classList.remove('tour-lift');
        await wait(600, tok);
      }
    } catch (e) { /* step changed */ }
  }

  // Move the hand to each point and press it, over and over.
  async function tapLoop(tok, getPoints) {
    try {
      while (true) {
        const pts = getPoints();
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

  /* ---------- tour steps per screen ---------- */

  const freeChips = () => $$('#tray .chip:not(.is-placed)');
  const boxes = () => $$('#boxes .box');
  const chips = () => $$('#tray .chip');

  const STEPS = {
    'screen-problem': [
      {
        title: 'Read the problem',
        text: 'This is a problem in your neighbourhood. Read it and think about which tools would help most.',
        target: () => unionRect([$('.question')]),
        anim: null
      },
      {
        title: 'Six tools',
        text: 'These are the six tools every citizen has. Each card shows the tool and what it does.',
        target: () => unionRect(chips()),
        anim: (tok) => popLoop(tok, chips)
      },
      {
        title: 'Drag a tool into a box',
        text: 'Press and hold a tool, drag it into <b>Low</b>, <b>Medium</b> or <b>High Effectiveness</b>, then let go. You can also tap a tool and then tap a box.',
        target: () => unionRect([...boxes(), ...chips()]),
        anim: (tok) => {
          const chip = freeChips()[0];
          const box = boxes()[1];
          if (!chip || !box) return null;
          return dragLoop(tok, () => centre(chip), () => centre(box), chip);
        }
      },
      {
        title: 'Read why',
        text: 'A tool in the right box stays there. A wrong one shakes and goes back to the list. Either way, <b>Here\'s Why</b> explains the answer.',
        target: () => unionRect([...boxes(), $('#feedback')]),
        anim: (tok) => popLoop(tok, boxes)
      },
      {
        title: 'Move on',
        text: 'When all six tools are in the right boxes, <b>Next</b> takes you to the next problem. The counter shows how many problems you have finished.',
        target: () => unionRect([$('#counter'), $('#backBtn'), $('#nextBtn')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#nextBtn'))])
      },
      {
        title: 'Back and Home',
        text: '<b>Back</b> goes to the previous problem. <b>Home</b> takes you back to the start.',
        target: () => unionRect([$('#homeBtn'), $('#backBtn')]),
        anim: null
      }
    ],

    'screen-summary': [
      {
        title: 'What you discovered',
        text: 'Each row is one problem. The columns show which tools have <b>Low</b>, <b>Medium</b> or <b>High</b> effectiveness for it.',
        target: () => unionRect([$('#summary')]),
        anim: (tok) => popLoop(tok, () => $$('#summary .summary__row:not(.summary__head)'))
      },
      {
        title: 'See every problem',
        text: 'Tap <b>Next</b> and <b>Back</b> to see all the problems. On the last page, <b>Restart</b> starts a new round.',
        target: () => unionRect([$('#summaryBack'), $('#summaryNext'), $('#restartBtn')]),
        anim: (tok) => {
          const btn = [$('#summaryNext'), $('#restartBtn')].find(visible);
          if (!btn) return null;
          return tapLoop(tok, () => [centre(btn)]);
        }
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
    const screen = $('.screen.is-active');
    if (!screen || !STEPS[screen.id]) return;
    steps = STEPS[screen.id];
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

  /* ---------- the button on every inner screen (not the home screen) ---------- */

  Object.keys(STEPS).forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `how-btn how-btn--${id.replace('screen-', '')}`;
    button.setAttribute('aria-label', 'How to play');
    button.innerHTML = '<img src="assets/images/help-btn.svg" alt="">';
    button.addEventListener('click', open);
    section.appendChild(button);
  });
}());
