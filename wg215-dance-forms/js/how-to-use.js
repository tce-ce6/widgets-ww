/* ==========================================================================
   How to use: a guided tour for each level.
   The Help button on every level opens a spotlight tour with short steps and
   an animated hand showing the taps. Works in viewport coordinates, so it is
   independent of the stage scale. (Same pattern as wg202's how-to-play.js.)
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const tour = $('#tour');
  const spot = $('#tourSpot');
  const layer = $('#tourDemo');
  const card = $('#tourCard');
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff" stroke="#1a1a1a" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const visible = (el) => el && el.getClientRects().length > 0;
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

  // Press, slide the hand from one point to another, let go (used for panning the map).
  async function dragLoop(tok, getFrom, getTo) {
    try {
      while (true) {
        const from = getFrom(); const to = getTo();
        const hand = make('tour-hand', { x: from.x + 60, y: from.y + 50 }, HAND);
        slide(hand, { x: from.x + 60, y: from.y + 50 }, from, 500);
        await wait(560, tok);
        hand.classList.add('is-press');
        ripple(from);
        await wait(250, tok);
        slide(hand, from, to, 1100);
        await wait(1180, tok);
        hand.classList.remove('is-press');
        await wait(800, tok);
        layer.innerHTML = '';
        await wait(500, tok);
      }
    } catch (e) { /* step changed */ }
  }

  // Briefly pulse each element in turn.
  async function popLoop(tok, getEls) {
    try {
      while (true) {
        const els = getEls();
        if (!els.length) return;
        for (const el of els) {
          el.classList.remove('tour-pop');
          void el.offsetWidth;
          el.classList.add('tour-pop');
          await wait(220, tok);
        }
        await wait(1300, tok);
        els.forEach((el) => el.classList.remove('tour-pop'));
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- lookups for the demos ---------- */

  const byKey = {};
  (window.DANCES || []).forEach((d) => { byKey[d.key] = d; });

  // Level 1: a dancer that is not matched yet, and its name button.
  function matchPair() {
    const dancer = $$('#matchDancers .dancer').find((d) => !d.classList.contains('is-done') && !d.disabled);
    if (!dancer) return null;
    const name = $(`#matchNames .name[data-key="${dancer.dataset.key}"]`);
    return name ? { dancer, name } : null;
  }

  // Level 2: the selected (or first unplaced) dancer tile, and the state it belongs to.
  function mapPair() {
    const tile = $('#tiles .tile.is-selected') || $('#tiles .tile:not(.is-placed)');
    if (!tile) return null;
    const dance = byKey[tile.dataset.key];
    const shape = dance && $(`#map .state-shape[data-shape="${dance.shape}"]`);
    return shape ? { tile, shape } : null;
  }

  // Level 3: the next two empty blanks and the letter tiles that fill them.
  function letterTaps() {
    const blanks = $$('#blankRow .letter--blank:not(.is-filled)').slice(0, 2);
    const used = new Set();
    const pts = [];
    blanks.forEach((blank) => {
      const tile = $$('#trayRow .letter--tile:not(.is-used)')
        .find((t) => !used.has(t) && t.textContent === blank.dataset.letter);
      if (!tile) return;
      used.add(tile);
      pts.push(centre(tile));
    });
    return pts;
  }

  /* ---------- tour steps per screen ---------- */

  const STEPS = {
    match: [
      {
        title: 'Meet the dancers',
        text: 'Each picture shows a dancer performing a dance from a different part of India. Look at their clothes and props.',
        target: () => unionRect($$('#matchDancers .dancer')),
        anim: (tok) => popLoop(tok, () => $$('#matchDancers .dancer'))
      },
      {
        title: 'The dance names',
        text: 'The names of the five dances are in the bottom row, in a mixed-up order.',
        target: () => unionRect($$('#matchNames .name')),
        anim: (tok) => popLoop(tok, () => $$('#matchNames .name'))
      },
      {
        title: 'Tap a dancer, then a name',
        text: 'Tap a dancer to pick it, then tap the dance name that matches it.',
        target: () => unionRect($$('#matchDancers .dancer, #matchNames .name')),
        anim: (tok) => tapLoop(tok, () => {
          const p = matchPair();
          return p ? [centre(p.dancer), centre(p.name)] : [];
        })
      },
      {
        title: 'Right or wrong?',
        text: 'A right match fills the <b>?</b> box with the dance name. A wrong match shakes, so just try another name.',
        target: () => unionRect($$('#matchSlots .slot')),
        anim: (tok) => popLoop(tok, () => $$('#matchSlots .slot'))
      },
      {
        title: 'Next round',
        text: 'Match all five dancers, then tap <b>Next</b>. There are <b>3 rounds</b> to meet all 15 dancers.',
        target: () => unionRect([$('#matchNext')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#matchNext'))])
      }
    ],

    map: [
      {
        title: 'Pick a dancer',
        text: 'Tap a dancer in the list to pick it.',
        target: () => unionRect($$('#tiles .tile')),
        anim: (tok) => tapLoop(tok, () => {
          const p = mapPair();
          return p ? [centre(p.tile)] : [];
        })
      },
      {
        title: 'Tap its home state',
        text: 'Now tap the state or UT on the map where that dance comes from. A right answer puts the dancer on the map and shows a fun fact.',
        target: () => unionRect([$('#mapPanel')]),
        anim: (tok) => tapLoop(tok, () => {
          const p = mapPair();
          return p ? [centre(p.tile), centre(p.shape)] : [];
        })
      },
      {
        title: 'Zoom and move the map',
        text: 'Tap <b>+</b> and <b>&minus;</b> to zoom (or use the mouse wheel), drag the map to move it, and tap <b>&#8634;</b> to reset it.',
        target: () => unionRect([$('.zoom-btns')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#zoomIn')), centre($('#zoomOut')), centre($('#zoomReset'))])
      },
      {
        title: 'Drag to look around',
        text: 'When the map is zoomed in, press and drag it to see other parts of India.',
        target: () => unionRect([$('#mapPanel')]),
        anim: (tok) => dragLoop(tok, () => centre($('#map')), () => {
          const c = centre($('#map'));
          const r = $('#map').getBoundingClientRect();
          return { x: c.x - r.width * 0.2, y: c.y - r.height * 0.15 };
        })
      },
      {
        title: 'Need a hint?',
        text: '<b>Show Names</b> writes the state names on the map. <b>Show Answer</b> highlights the right state and dancer in green.',
        target: () => unionRect([$('#namesBtn'), $('#answerBtn')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#namesBtn')), centre($('#answerBtn'))])
      },
      {
        title: 'Place all 15',
        text: 'The counter shows how many dancers are home. Place all 15 dancers, then tap <b>Next</b> to go to the last level.',
        target: () => unionRect([$('#placedText'), $('#mapNext')]),
        anim: null
      }
    ],

    decode: [
      {
        title: 'Read the clue',
        text: 'The clue tells you where the dance comes from. The silhouette on the right is the dancer you need to name.',
        target: () => unionRect([$('.clue-box'), $('.who-card')]),
        anim: null
      },
      {
        title: 'Fill the blanks',
        text: 'Tap letters in the second row to fill the empty boxes from left to right.',
        target: () => unionRect([$('#blankRow'), $('#trayRow')]),
        anim: (tok) => tapLoop(tok, letterTaps)
      },
      {
        title: 'Right or wrong?',
        text: 'A right letter stays in its box. A wrong letter turns red, shakes and is removed, so try another one.',
        target: () => unionRect([$('#blankRow')]),
        anim: null
      },
      {
        title: 'Who am I?',
        text: 'When the name is complete, the dancer is revealed. Tap <b>Next Clue</b> for the next case. Decode all 6 to finish.',
        target: () => unionRect([$('.who-card'), $('#nextClue')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#nextClue'))])
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
    const id = screen && screen.id.replace('screen-', '');
    if (!STEPS[id]) return;
    steps = STEPS[id];
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

  $('#helpBtn').addEventListener('click', open);
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

  // test helper: wg215Test.openTour() opens the tour for the current level
  if (window.wg215Test) window.wg215Test.openTour = open;
}());
