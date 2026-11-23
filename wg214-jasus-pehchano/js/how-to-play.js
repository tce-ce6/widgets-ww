/* ==========================================================================
   How to play (सहायता): a guided tour of the screen (same as wg202).
   The help button at the bottom left opens a spotlight tour with short steps
   and an animated hand showing the tap / drag. Works in viewport
   coordinates, so it is independent of the stage scale.
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
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff" stroke="#001f74" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  const TXT = { step: (i, n) => `चरण ${i} / ${n}`, next: 'आगे', last: 'खेलना शुरू करो' };

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

  // Press on the soldier, carry a copy of it to `getTo()`, let go.
  async function dragLoop(tok, getEl, getTo) {
    try {
      while (true) {
        const fly = getEl();
        if (!fly) return;
        const from = centre(fly);
        const to = getTo();
        const hand = make('tour-hand', { x: from.x + 60, y: from.y + 50 }, HAND);
        slide(hand, { x: from.x + 60, y: from.y + 50 }, from, 500);
        await wait(560, tok);
        hand.classList.add('is-press');
        ripple(from);
        fly.classList.add('tour-lift');
        // a scaled copy of the soldier (the stage is scaled, the tour layer is not)
        const ghost = make('tour-ghost', from, '');
        const copy = fly.cloneNode(true);
        copy.removeAttribute('id');
        copy.classList.remove('tour-lift', 'is-selected');
        Object.assign(copy.style, { position: 'absolute', left: '0', top: '0', transform: 'none', opacity: '1', animation: 'none' });
        const inner = document.createElement('div');
        inner.className = 'tour-ghost__inner';
        inner.style.width = `${fly.offsetWidth}px`;
        inner.style.height = `${fly.offsetHeight}px`;
        inner.style.transform = `scale(${scale()}) translate(-50%, -50%)`;
        inner.appendChild(copy);
        ghost.appendChild(inner);
        await wait(250, tok);
        slide(ghost, from, to, 1300);
        slide(hand, from, to, 1300);
        await wait(1380, tok);
        ghost.classList.add('is-settle');
        hand.classList.remove('is-press');
        ripple(to);
        await wait(800, tok);
        layer.innerHTML = '';
        fly.classList.remove('tour-lift');
        await wait(600, tok);
      }
    } catch (e) { /* step changed */ }
  }

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

  const soldier = () => $('#checkpoint .soldier');
  const boards = () => [$('#labelA'), $('#labelB')];
  const gateOf = (k) => {
    const r = $(`#fort${k} .gate`).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  const riverPoint = () => centre($('#river'));

  const STEPS = [
    {
      title: 'सैनिक',
      text: 'पुल पर एक सैनिक खड़ा है। उसके हाथ में एक शब्द है। सैनिक पर टैप करके शब्द <b>सुनो</b>।',
      target: () => unionRect([soldier()].filter(Boolean)),
      anim: (tok) => tapLoop(tok, () => (soldier() ? [centre(soldier())] : []))
    },
    {
      title: 'दो किले',
      text: 'दोनों किलों पर एक-एक शब्द लिखा है। हर किले में उसके <b>समान अर्थ</b> वाले सैनिक जाते हैं। शब्द पर टैप करके उसे <b>सुनो</b>।',
      target: () => unionRect(boards()),
      anim: (tok) => tapLoop(tok, () => boards().map(centre))
    },
    {
      title: 'किले में भेजो',
      text: 'सैनिक को खींचकर सही <b>किले</b> तक ले जाओ, या किले पर टैप करो। गलत किले में शब्द टूटकर पानी में गिर जाता है और सैनिक वापस आ जाता है।',
      target: () => unionRect([soldier(), $('#fortA')].filter(Boolean)),
      anim: (tok) => dragLoop(tok, soldier, () => gateOf('A'))
    },
    {
      title: 'जासूस को पहचानो',
      text: 'जो सैनिक किसी किले का नहीं, वह <b>जासूस</b> है। उसे खींचकर पुल के नीचे <b>नदी</b> में गिरा दो। पकड़े गए जासूस का शब्द लेंस के नीचे लिखा जाता है।',
      target: () => unionRect([soldier(), $('#lens'), $('#river')].filter(Boolean)),
      anim: (tok) => dragLoop(tok, soldier, riverPoint)
    },
    {
      title: 'समय का ध्यान रखो',
      text: 'पुल के नीचे की पट्टी <b>समय</b> दिखाती है। समय खत्म होने पर सैनिक पंक्ति में सबसे पीछे चला जाता है।',
      target: () => unionRect([$('.timer'), $('#queue')]),
      anim: null
    },
    {
      title: 'उत्तर और अगला उदाहरण',
      text: '<b>उत्तर देखें</b> से सही शब्द दिखते हैं, <b>उत्तर छिपाएँ</b> से फिर से उत्तर छिपते हैं। <b>अगला उदाहरण</b> से फिर से अगला शब्द आता है।',
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
  button.setAttribute('aria-label', 'सहायता: कैसे खेलें');
  button.innerHTML = '<img src="assets/svg/help-btn.svg" alt="">';
  button.addEventListener('click', open);
  stageEl.appendChild(button);
}());
