/* ==========================================================================
   Help: a guided tour of the activity, same as wg220 / wg221.
   The help button opens a spotlight tour with short steps and an animated
   hand showing the tap (or drag). Only the steps for what is on screen now
   are shown. Works in viewport coordinates, so it is independent of how the
   1920x1080 canvas is scaled.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const tour = $('#tour');
  const spot = $('#tourSpot');
  const layer = $('#tourDemo');
  const card = $('#tourCard');
  const helpBtn = $('#help-btn');
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff2e1" stroke="#44200e" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const shown = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  // Box around the visible elements, kept inside the window
  function unionRect(els) {
    const list = els.filter(shown);
    if (!list.length) return null;
    let l = 1e9; let t = 1e9; let r = -1e9; let b = -1e9;
    list.forEach((el) => {
      const x = el.getBoundingClientRect();
      l = Math.min(l, x.left); t = Math.min(t, x.top); r = Math.max(r, x.right); b = Math.max(b, x.bottom);
    });
    l = Math.max(l, 0); t = Math.max(t, 0);
    r = Math.min(r, innerWidth); b = Math.min(b, innerHeight);
    if (l >= r || t >= b) return null;
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

  // Press on a chip, carry a copy of it to the box, let go.
  async function dragLoop(tok, getPair) {
    try {
      while (true) {
        const pair = getPair();
        if (!pair) return;
        const [chip, box] = pair;
        const a = centre(chip);
        const b = centre(box);
        const hand = make('tour-hand', { x: a.x + 70, y: a.y + 60 }, HAND);
        slide(hand, { x: a.x + 70, y: a.y + 60 }, a, 600);
        await wait(650, tok);
        hand.classList.add('is-press');
        ripple(a);
        const ghost = make('drag-ghost tour-ghost', a);
        ghost.textContent = chip.textContent.trim();
        await wait(250, tok);
        slide(hand, a, b, 1000);
        slide(ghost, a, b, 1000);
        await wait(1050, tok);
        hand.classList.remove('is-press');
        ripple(b);
        await wait(900, tok);
        layer.innerHTML = '';
        await wait(500, tok);
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- the steps ---------- */

  const vis = (sel) => $$(sel).filter(shown);
  const wells = () => vis('.well-fx');

  const STEPS = [
    // Lab work
    {
      title: 'Do the lab work',
      text: 'Tap <b>Add blood sample</b> to put a drop of blood in each well. Then tap <b>Add reagents</b> to add Anti-A, Anti-B and Anti-D.',
      target: () => unionRect(vis('#btn-action')),
      anim: (tok) => tapLoop(tok, () => vis('#btn-action:not(.is-disabled)').map(centre))
    },
    {
      title: 'Watch the wells',
      text: '<b>Clumps</b> in a well mean a reaction: the blood has that antigen. <b>Smooth, even red</b> means no reaction.',
      target: () => unionRect(wells()),
      anim: null
    },
    // Which blood group?
    {
      title: 'Choose the blood group',
      text: 'Use the three wells to decide. Tap the blood group you think it is.',
      target: () => (vis('[data-act="toQuiz"]').length ? null : unionRect(vis('.card-id .groups'))),
      anim: (tok) => tapLoop(tok, () => vis('.card-id .groups button').slice(0, 1).map(centre))
    },
    {
      title: 'Check your answer',
      text: 'Tap <b>Check answer</b>. If you are stuck, tap <b>Show answer</b>.',
      target: () => unionRect(vis('[data-act="checkId"], [data-act="showId"]')),
      anim: (tok) => tapLoop(tok, () => vis('[data-act="checkId"]').map(centre))
    },
    {
      title: 'Go on to compatibility',
      text: 'When your answer is correct, tap <b>Check compatibility</b>.',
      target: () => unionRect(vis('[data-act="toQuiz"]')),
      anim: (tok) => tapLoop(tok, () => vis('[data-act="toQuiz"]').map(centre))
    },
    // Compatibility quiz
    {
      title: 'Sort the blood groups',
      text: 'Drag each group into the box where it fits. A group can go in both boxes. You can also tap a group, then tap the box.',
      target: () => unionRect(vis('.card-quiz .bank, .card-quiz .drop-box')),
      anim: (tok) => dragLoop(tok, () => {
        const chip = vis('.card-quiz .bank .chip')[0];
        const box = vis('.card-quiz .drop-box')[0];
        return chip && box ? [chip, box] : null;
      })
    },
    {
      title: 'Remove a group',
      text: 'Tap the <b>×</b> on a group to take it out of a box.',
      target: () => unionRect(vis('.card-quiz .placed .x').slice(0, 1)),
      anim: (tok) => tapLoop(tok, () => vis('.card-quiz .placed .x').slice(0, 1).map(centre))
    },
    {
      title: 'Check your answer',
      text: 'Tap <b>Check answer</b> to see which groups are right. If you are stuck, tap <b>Show answer</b>.',
      target: () => unionRect(vis('[data-act="checkQuiz"], [data-act="showQuiz"]')),
      anim: (tok) => tapLoop(tok, () => vis('[data-act="checkQuiz"]').map(centre))
    },
    // Bottom bar
    {
      title: 'Start again',
      text: '<b>Reset</b> starts this same sample again. <b>Test another sample</b> gives you a new blood group to test.',
      target: () => unionRect(vis('#btn-reset, #btn-new')),
      anim: null
    },
    {
      title: 'Insights',
      text: 'Tap <b>Insights</b> to see the blood group tables: antigens, antibodies, and who can donate to whom.',
      target: () => unionRect(vis('#btn-insights')),
      anim: (tok) => tapLoop(tok, () => vis('#btn-insights').map(centre))
    },
    {
      title: 'Need help again?',
      text: 'Tap <b>Help</b> at any time to see these steps.',
      target: () => unionRect([helpBtn]),
      anim: null
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
    $('#tourCount').textContent = `Step ${index + 1} of ${steps.length}`;
    $('#tourTitle').textContent = step.title;
    $('#tourText').innerHTML = step.text;
    $('#tourBack').hidden = index === 0;
    $('#tourNext').textContent = index === steps.length - 1 ? 'Got it' : 'Next';
    $('#tourDots').innerHTML = steps.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeCard(rect);
    if (step.anim && rect) step.anim(tok);
  }

  function open() {
    // Only the steps for what is on screen now, plus the Help reminder.
    steps = STEPS.filter((s) => s.target());
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
  // Capture phase, so Escape closes only the tour (not a pop-up underneath).
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

  /* ---------- the help button ---------- */

  helpBtn.addEventListener('click', open);
  helpBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
}());
