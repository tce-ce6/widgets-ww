/* ==========================================================================
   Help: a guided tour of the activity, same as wg221.
   The help button opens a spotlight tour with short steps and an animated
   hand showing the tap. Only the steps for the screen on view are shown.
   Works in viewport coordinates, so it is independent of how the
   1920x1080 stage is scaled.
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
    $$('.tour-pop').forEach((el) => el.classList.remove('tour-pop'));
  }

  /* ---------- animated demo (loops until the step changes) ---------- */

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

  /* ---------- the steps (one group per screen: s1, s2, s4, s5, s6) ---------- */

  const vis = (sel) => $$(sel).filter(shown);
  const btnIn = (sel) => vis(`${sel} .svg-btn:not(.is-disabled)`);

  const STEPS = [
    // s1: Before PIL
    {
      title: 'Read the facts',
      text: 'Read the number and the note about the prisoners waiting in jail.',
      target: () => unionRect(vis('#s1 .card')),
      anim: null
    },
    {
      title: 'Continue',
      text: 'When you are ready, tap the pink button.',
      target: () => unionRect(btnIn('#s1')),
      anim: (tok) => tapLoop(tok, () => btnIn('#s1').map(centre))
    },
    // s2: who could speak for them?
    {
      title: 'Try each option',
      text: 'Tap the <b>blinking</b> option and watch the picture on the left. The next option opens after that.',
      target: () => unionRect(vis('#s2 .option')),
      anim: (tok) => tapLoop(tok, () => vis('#s2 .option.active').map(centre))
    },
    {
      title: 'Read what happened',
      text: 'After each scene, read why that person could not reach the court.',
      target: () => unionRect($('#s2-feedback').textContent ? [$('#s2-feedback').closest('foreignObject')] : []),
      anim: null
    },
    {
      title: 'Continue',
      text: 'When all three options are explored, tap the pink button.',
      target: () => unionRect(btnIn('#s2-done')),
      anim: (tok) => tapLoop(tok, () => btnIn('#s2-done').map(centre))
    },
    // s4: After PIL
    {
      title: 'Read the story',
      text: 'Watch the scene and read how one petition opened the court to everyone.',
      target: () => unionRect(vis('#s4 .card')),
      anim: null
    },
    {
      title: 'Continue',
      text: 'Tap the pink button to build the petition yourself.',
      target: () => unionRect(btnIn('#s4')),
      anim: (tok) => tapLoop(tok, () => btnIn('#s4').map(centre))
    },
    // s5: build and file the petition
    {
      title: 'Build the petition',
      text: 'Pick one <b>yellow</b> answer (who she speaks for) and one <b>green</b> answer (what she asks the court to do).',
      target: () => unionRect(vis('#s5 .field-bg')),
      anim: (tok) => tapLoop(tok, () => [vis('#s5 .field[data-field="1"] .field-bg')[0], vis('#s5 .field[data-field="2"] .field-bg')[0]].filter(Boolean).map(centre))
    },
    {
      title: 'File the petition',
      text: 'When both answers are chosen, tap <b>File the Petition</b>.',
      target: () => unionRect(vis('#file-btn')),
      anim: (tok) => tapLoop(tok, () => btnIn('#s5-form').map(centre))
    },
    {
      title: 'Watch the prisoners',
      text: 'Each box is 1,000 prisoners. A <b>✓</b> means they were set free by your petition.',
      target: () => unionRect(vis('#cell-grid, #cell-counter, #cell-label')),
      anim: null
    },
    {
      title: 'Read the result',
      text: 'Read the court order, the outcome and what PIL made possible.',
      target: () => unionRect(vis('#s5-result > image')),
      anim: null
    },
    {
      title: 'Try again or move on',
      text: 'Tap <b>Try another combination</b> to compare petitions. When you file the petition that was actually filed, a pink button takes you on.',
      target: () => unionRect(vis('#again-btn, #learn-btn')),
      anim: (tok) => tapLoop(tok, () => vis('#learn-btn').concat(vis('#again-btn')).slice(0, 1).map(centre))
    },
    // s6: check what you learnt
    {
      title: 'Check what you learnt',
      text: 'Tap the box next to each statement. A green <b>✓</b> means it is correct, a red <b>✗</b> means it is not.',
      target: () => unionRect(vis('.statement .st-bg')),
      anim: (tok) => tapLoop(tok, () => vis('.statement:not(.answered) .st-box').slice(0, 1).map(centre))
    },
    {
      title: 'Start again',
      text: 'Tap <b>Back to start</b> to go through the activity again.',
      target: () => unionRect(vis('#back-btn')),
      anim: (tok) => tapLoop(tok, () => vis('#back-btn').map(centre))
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
