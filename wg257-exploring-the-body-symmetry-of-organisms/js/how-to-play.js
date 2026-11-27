/* ==========================================================================
   Help: a guided tour of the activity, same pattern as wg160 / wg220.
   The steps depend on what the learner is doing (same three tours as the
   reference: choosing an organism, dissecting it, comparing the halves).
   Works in viewport coordinates, so it is independent of the stage scale.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);

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
  const box = (el) => {
    if (!shown(el)) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
  };

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

  // Move the hand to each point and press it, over and over (demo only: nothing is clicked).
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

  // Drag the hand from a to b, over and over.
  async function dragLoop(tok, getPath) {
    try {
      while (true) {
        const path = getPath();
        if (!path) return;
        const [a, b] = path;
        const hand = make('tour-hand', a, HAND);
        await wait(300, tok);
        hand.classList.add('is-press');
        slide(hand, a, b, 1100);
        await wait(1200, tok);
        hand.classList.remove('is-press');
        await wait(600, tok);
        layer.innerHTML = '';
        await wait(400, tok);
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- the steps ---------- */

  const st = () => (window.BS ? window.BS.state() : { current: null, phase: 'idle' });
  const firstCard = () => document.querySelector('#orgs .card:not(.sorted)');
  const selCard = () => (st().current && window.BS.cardOf(st().current)) || null;

  const OPENING = [
    {
      title: 'Choose an organism',
      text: 'These are the four organisms in this set. Tap one to place it in the <b>dissection area</b>.',
      target: () => box($('#orgs')),
      anim: (tok) => tapLoop(tok, () => [firstCard() && centre(firstCard())])
    },
    {
      title: 'The dissection area',
      text: 'Here you cut the organism along planes that pass through its <b>central axis</b>, and compare the two halves.',
      target: () => box($('#tray'))
    },
    {
      title: 'Sort it',
      text: 'When you have decided, drag the organism into the bucket that matches its <b>body symmetry</b>.',
      target: () => box($('#buckets')) || box($('#b-bilateral'))
    },
    {
      title: 'Insights',
      text: 'Tap <b>Insights</b> any time to revise the types of body symmetry.',
      target: () => box($('#insightBtn')),
      anim: (tok) => tapLoop(tok, () => [centre($('#insightBtn'))])
    },
    {
      title: 'Answers and sets',
      text: 'Tap <b>Show answer</b> to see each organism in its correct bucket. Tap <b>Repeat set</b> to try the same four again, or <b>New set</b> for four different organisms.',
      target: () => box($('#setBtns'))
    }
  ];

  const DISSECT = [
    {
      title: 'Axis and plane',
      text: 'The blue rod is the <b>central axis</b>. The see-through sheet is the <b>plane of dissection</b>; it always passes through the central axis.',
      target: () => box($('#tray'))
    },
    {
      title: 'Turn the organism',
      text: 'Drag the organism to rotate it and look at it from any side. The axis and the plane turn with it.',
      target: () => box($('#tray')),
      anim: (tok) => dragLoop(tok, () => {
        const r = $('#tray').getBoundingClientRect();
        return [{ x: r.left + r.width * 0.38, y: r.top + r.height * 0.55 }, { x: r.left + r.width * 0.62, y: r.top + r.height * 0.45 }];
      })
    },
    {
      title: 'Turn the plane',
      text: 'Move the slider to turn the plane around the central axis and choose where to cut.',
      target: () => box($('#planeCtl'))
    },
    {
      title: 'Cut, compare, join',
      text: 'Tap <b>Cut</b> to divide the organism into two halves. Tap <b>Compare halves</b> to fold one half onto the other. Tap <b>Join</b> to put it back and try another plane.',
      target: () => box($('#actions'))
    },
    {
      title: 'Planes tried',
      text: 'Every plane you compare is recorded here. Try as many planes as you need before you decide.',
      target: () => box($('#log'))
    }
  ];

  const COMPARE = [
    {
      title: 'Compare the halves',
      text: 'The <b>pink half</b> has been folded onto the other half. If it fits exactly, the two halves are identical. If parts stick out, they are not.',
      target: () => box($('#tray'))
    },
    {
      title: 'Sort it',
      text: 'When you have tried enough planes, drag the selected organism into the correct bucket.',
      target: () => box(selCard()) || box($('#orgs')),
      anim: (tok) => dragLoop(tok, () => {
        const c = selCard(); const b = $('#b-bilateral');
        return c && shown(c) ? [centre(c), centre(b)] : null;
      })
    },
    {
      title: 'Not sure?',
      text: 'Tap <b>Show answer</b> to see each organism in its correct bucket. Tap <b>Hide answer</b> to go back to sorting.',
      target: () => box($('#showAnswer'))
    }
  ];

  const LAST = {
    title: 'Need help again?',
    text: 'Tap <b>Help</b> at any time to see these steps.',
    target: () => box(helpBtn)
  };

  function stepsNow() {
    const s = st();
    const list = !s.current ? OPENING : (s.phase === 'compared' ? COMPARE : DISSECT);
    return list.concat(LAST);
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
    if (window.BS) window.BS.closeInsight(); // so the panel does not cover the steps
    steps = stepsNow();
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
  // Capture phase, so Escape closes only the tour.
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

  helpBtn.addEventListener('click', open);
}());
