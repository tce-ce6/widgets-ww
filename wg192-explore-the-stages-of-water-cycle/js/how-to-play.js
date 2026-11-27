/* ==========================================================================
   Help: a guided tour of the activity, same pattern as wg160 / wg220 /
   wg234 / wg257. Spotlight on each part, a short note, and an animated hand
   showing the tap. The steps follow what the learner is doing (before the
   cycle starts / while it runs). Works in viewport coordinates, so it is
   independent of the stage scale.
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
  // The framed scene inside the 1920x1080 Lottie layer (design: 431-1489 x 178-748)
  function sceneRect() {
    const st = $('#stage').getBoundingClientRect();
    const k = st.width / 1920;
    return { left: st.left + 431 * k, top: st.top + 178 * k, right: st.left + 1489 * k, bottom: st.top + 748 * k, width: 1058 * k, height: 570 * k };
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
  const ripple = (pt) => { const r = make('tour-ripple', pt); setTimeout(() => r.remove(), 700); };
  const slide = (el, a, b, duration) => el.animate(
    [{ left: `${a.x}px`, top: `${a.y}px` }, { left: `${b.x}px`, top: `${b.y}px` }],
    { duration, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' }
  );
  function clearDemo() { layer.innerHTML = ''; }

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

  /* ---------- the steps ---------- */

  const stageBtns = () => [...document.querySelectorAll('.stage-btn')];
  const btn = (k) => $(`.stage-btn[data-stage="${k}"]`);
  const st = () => (window.WC ? window.WC.state() : { current: null, next: null });

  const START = [
    {
      title: 'The water cycle',
      text: 'This scene shows the <b>Sun</b>, the <b>ocean</b>, <b>rivers</b> and <b>ground water</b>. Water moves between them in a cycle.',
      target: sceneRect
    },
    {
      title: 'Start anywhere',
      text: 'Tap any of the four stages, <b>Evaporation</b>, <b>Condensation</b>, <b>Precipitation</b> or <b>Collection</b>, to start the cycle there.',
      target: () => unionRect(stageBtns()),
      anim: (tok) => tapLoop(tok, () => [centre(btn('evaporation'))])
    }
  ];

  const RUNNING = [
    {
      title: 'Watch the stage',
      text: 'The animation shows what happens in this stage. Read the description below it.',
      target: () => unionRect([$('#desc')].filter((d) => !d.hidden)) || sceneRect()
    },
    {
      title: 'Go to the next stage',
      text: 'When the blinking <b>Tap here</b> appears, tap the stage it points to. Keep going round to see that the four stages always follow the <b>same order</b>.',
      target: () => unionRect([btn(st().next)]),
      anim: (tok) => tapLoop(tok, () => [st().next && centre(btn(st().next))])
    },
    {
      title: 'Reset',
      text: 'Tap <b>Reset</b> to start again from any stage.',
      target: () => unionRect([$('#resetBtn')])
    }
  ];

  const COMMON = [
    {
      title: 'Insights',
      text: 'Tap <b>Insights</b> any time to read what each stage means, and more facts about the water cycle.',
      target: () => unionRect([$('#insightBtn')]),
      anim: (tok) => tapLoop(tok, () => [centre($('#insightBtn'))])
    },
    {
      title: 'Need help again?',
      text: 'Tap <b>Help</b> at any time to see these steps.',
      target: () => unionRect([helpBtn])
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
    if (window.WC) window.WC.closeInsight(); // so the panel does not cover the steps
    steps = (st().current ? RUNNING : START).concat(COMMON).filter((s) => s.target());
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
