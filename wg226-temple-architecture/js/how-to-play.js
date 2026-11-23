/* ==========================================================================
   How to play: a guided tour for each screen (same as wg202).
   A help button at the bottom left of every activity screen (not the intro)
   opens a spotlight tour with short steps and an animated hand showing the
   taps. Works in viewport coordinates, so it is independent of the stage
   scale. The steps follow what is on screen when the button is tapped.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const tour = $('#tour');
  const spot = $('#tourSpot');
  const layer = $('#tourDemo');
  const card = $('#tourCard');
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff9e5" stroke="#522810" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const visible = (el) => !!el && el.getClientRects().length > 0 && !el.closest('[hidden]');
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  const inside = (pt, el) => {
    const r = el.getBoundingClientRect();
    return pt.x > r.left + 20 && pt.x < r.right - 20 && pt.y > r.top + 20 && pt.y < r.bottom - 20;
  };

  // Box around the visible elements and everything inside them (absolutely
  // positioned children can stick out of a parent that reports a smaller box).
  function unionRect(els) {
    const list = els.filter(visible);
    if (!list.length) return null;
    let l = 1e9; let t = 1e9; let r = -1e9; let b = -1e9;
    list.forEach((root) => {
      [root, ...$$('*', root)].forEach((el) => {
        if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') return; // plan shapes reach outside the map
        if (el.closest('[hidden]')) return;
        const x = el.getBoundingClientRect();
        if (!x.width || !x.height) return;
        l = Math.min(l, x.left); t = Math.min(t, x.top); r = Math.max(r, x.right); b = Math.max(b, x.bottom);
      });
    });
    if (l > r) return null;
    return { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
  }

  // Panes that clip what is inside them: their own box is the spotlight.
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
          await wait(260, tok);
        }
        await wait(1300, tok);
        els.forEach((el) => el.classList.remove('tour-pop'));
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- what to point at ---------- */

  const openTags = () => $$('#tagTray .body-tag').filter(visible);
  const emptySlot = () => $$('#slots .slot').find((s) => !s.classList.contains('is-filled'));
  const filledSlot = () => $$('#slots .slot').find((s) => s.classList.contains('is-filled'));
  const navNext = () => $('#cardNav .nav-next');
  const arrowEl = () => $('#mapOverlay .walk-arrow');
  // a numbered label that is on screen, preferring one not visited yet
  const pinToTap = () => {
    const pane = $('#mapPane');
    const pins = $$('#mapOverlay .pin').filter((p) => visible(p) && inside(centre(p), pane));
    return pins.find((p) => !p.classList.contains('is-visited') && !p.classList.contains('is-current')) || pins[0];
  };
  const openClues = () => $$('#clueTray .clue').filter(visible);
  const cardFor = (clue) => clue && $(`.temple-card[data-temple="${clue.dataset.temple}"]`);

  /* ---------- tour steps per screen ---------- */

  const STEPS = {
    mystery: [
      {
        title: 'The temple tower',
        text: 'This tower has seven levels, from the platform at the bottom to the finial at the top. Each one has a blank label beside it.',
        target: () => unionRect([$('.tower-box'), $('#slots')]),
        anim: (tok) => popLoop(tok, () => $$('#slots .slot'))
      },
      {
        title: 'Match a body part',
        text: 'Tap a body part on the right, then tap the blank label for the level you think it matches. You can also drag a body part onto a label.',
        target: () => unionRect([$('#tagTray'), $('#slots')]),
        anim: (tok) => tapLoop(tok, () => {
          const tag = openTags()[0]; const slot = emptySlot();
          return tag && slot ? [centre(tag), centre(slot)] : [];
        })
      },
      {
        title: 'Change your mind',
        text: 'Tap a filled label to send its body part back. Dropping a body part on a filled label swaps them.',
        target: () => unionRect([$('#slots')]),
        anim: (tok) => tapLoop(tok, () => (filledSlot() ? [centre(filledSlot())] : []))
      },
      {
        title: 'Lock your guess',
        text: 'When all seven labels are filled, tap <b>Lock my guess</b>. You will check it later, when you climb the tower.',
        target: () => unionRect([$('#lockBtn'), $('#placedCount')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#lockBtn'))])
      }
    ],

    mysteryLocked: [
      {
        title: 'Your guess is locked',
        text: 'Your labels stay on the tower. You will find out how close you were when you climb the vimāna.',
        target: () => unionRect([$('.tower-box'), $('#slots')]),
        anim: null
      },
      {
        title: 'Start the walk',
        text: 'Tap <b>Start the temple walk</b> to walk through a temple, from the gateway to the innermost shrine.',
        target: () => unionRect([$('#lockMsg'), $('#walkBtn')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#walkBtn'))])
      }
    ],

    walk: [
      {
        title: 'The ground plan',
        text: 'This is the plan of a temple. The red dashed route runs from the gateway to the innermost shrine, past eight numbered stops.',
        target: () => boxOf($('#mapPane')),
        anim: (tok) => popLoop(tok, () => $$('#mapOverlay .pin').filter(visible))
      },
      {
        title: 'Walk on',
        text: 'Tap the black arrow on the map, or the pink button below the card, to walk to the next stop. Watch the red dot move along the route.',
        target: () => unionRect([arrowEl(), navNext()]) || boxOf($('#mapPane')),
        anim: (tok) => tapLoop(tok, () => [visible(arrowEl()) ? centre(arrowEl()) : null, visible(navNext()) ? centre(navNext()) : null])
      },
      {
        title: 'Jump to a stop',
        text: 'Tap any numbered label to walk straight to that stop. At the Prākāra and the Pradakṣhiṇa corridor, the dot walks one round.',
        target: () => boxOf($('#mapPane')),
        anim: (tok) => tapLoop(tok, () => (pinToTap() ? [centre(pinToTap())] : []))
      },
      {
        title: 'Look around',
        text: 'Drag the map to move it. Use <b>+</b> and <b>–</b> to zoom, the target to come back to your stop, and the box to see the whole plan.',
        target: () => unionRect([$('#mapPane .tools'), $('#minimap')]),
        anim: (tok) => popLoop(tok, () => $$('#mapPane .tool'))
      },
      {
        title: 'Read and answer',
        text: 'The card tells you about each stop. Read it, then tap the right answer to the <b>Quick look question</b>.',
        target: () => unionRect([$('.card-pane')]),
        anim: null
      },
      {
        title: 'Back and next',
        text: 'Use <b>Back</b> to return to the last stop, and the next button to walk on. After the garbhagṛiha, you climb the vimāna.',
        target: () => unionRect([$('#cardNav')]),
        anim: (tok) => tapLoop(tok, () => (visible(navNext()) ? [centre(navNext())] : []))
      }
    ],

    climb: [
      {
        title: 'Climb the vimāna',
        text: 'Now you see the tower from the side, with the figure of Puruṣha beside it. The coloured band shows the level you are on.',
        target: () => boxOf($('#mapPane')),
        anim: null
      },
      {
        title: 'Go up a level',
        text: 'Tap the arrow on the tower, or the pink button below the card, to climb one level higher.',
        target: () => unionRect([arrowEl(), navNext()]) || boxOf($('#mapPane')),
        anim: (tok) => tapLoop(tok, () => [visible(arrowEl()) ? centre(arrowEl()) : null, visible(navNext()) ? centre(navNext()) : null])
      },
      {
        title: 'Check your guess',
        text: 'The card shows the body part you placed on this level. A tick means you were right. On the map, your guesses appear beside the figure.',
        target: () => unionRect([$('.card-pane')]),
        anim: (tok) => popLoop(tok, () => $$('.guess-check').filter(visible))
      },
      {
        title: 'Move on',
        text: 'Use <b>Back</b> to go down a level. At the top of the tower, the next button takes you to four real temples.',
        target: () => unionRect([$('#cardNav')]),
        anim: null
      }
    ],

    temples: [
      {
        title: 'Clues about four temples',
        text: 'Each clue tells you where a temple is, who built it, or what it is made of.',
        target: () => unionRect([$('#clueTray')]),
        anim: (tok) => popLoop(tok, () => openClues().slice(0, 6))
      },
      {
        title: 'Sort the clues',
        text: 'Tap a clue, then tap the temple it belongs to. You can also drag a clue onto a temple.',
        target: () => unionRect([$('#clueTray'), $('#templeCards')]),
        anim: (tok) => tapLoop(tok, () => {
          const clue = openClues()[0];
          const target = cardFor(clue);
          return clue && target ? [centre(clue), centre(target)] : [];
        })
      },
      {
        title: 'Right or wrong?',
        text: 'A right clue moves into the temple’s card. A wrong one shakes and a hint appears, so try another temple.',
        target: () => unionRect([$('#templeCards')]),
        anim: null
      },
      {
        title: 'Open the insights',
        text: 'When every clue is sorted, look at the dashed lines on each temple, then tap <b>Insights</b>. <b>Start again</b> takes you back to the beginning.',
        target: () => unionRect([$('#templeCards')]),
        anim: null
      }
    ],

    templesDone: [
      {
        title: 'One idea, four temples',
        text: 'The dashed lines on each temple show what most temples share: an entrance, a hall, and an innermost shrine with a tower above it.',
        target: () => unionRect([$('#templeCards')]),
        anim: (tok) => popLoop(tok, () => $$('.temple-card__core'))
      },
      {
        title: 'Insights',
        text: 'Tap <b>Insights</b> to compare what stays the same from temple to temple with what changes.',
        target: () => unionRect([$('#insightBtn')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#insightBtn'))])
      },
      {
        title: 'Start again',
        text: 'Tap <b>Start again</b> to go back to the first screen and make a new guess.',
        target: () => unionRect([$('#againBtn')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#againBtn'))])
      }
    ]
  };

  // The steps that fit what is on screen right now.
  function stepsNow() {
    const screen = $('.screen.is-active');
    const id = screen && screen.id.replace('screen-', '');
    if (id === 'mystery') return screen.classList.contains('is-locked') ? STEPS.mysteryLocked : STEPS.mystery;
    if (id === 'walk') return $('#map').classList.contains('is-elev') ? STEPS.climb : STEPS.walk;
    if (id === 'temples') return screen.classList.contains('is-complete') ? STEPS.templesDone : STEPS.temples;
    return null;
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
        // too wide for that: sit over its lower right corner instead
        if (left < m || left + cw > W - m) {
          left = rect.right - cw - 24;
          top = rect.bottom - ch - 24;
        }
      }
    }
    card.style.left = `${Math.max(m, Math.min(W - cw - m, left))}px`;
    card.style.top = `${Math.max(m, Math.min(H - ch - m, top))}px`;
  }

  // Spotlight the step's target and put the card next to it.
  function placeSpot() {
    const rect = steps[stepIndex].target();
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
    placeCard(rect);
  }

  function go(index) {
    stepIndex = index;
    const tok = ++token;
    clearDemo();
    const step = steps[index];
    $('#tourCount').textContent = `Step ${index + 1} of ${steps.length}`;
    $('#tourTitle').textContent = step.title;
    $('#tourText').innerHTML = step.text;
    $('#tourBack').hidden = index === 0;
    $('#tourNext').textContent = index === steps.length - 1 ? 'Start playing' : 'Next';
    $('#tourDots').innerHTML = steps.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeSpot();
    if (step.anim) step.anim(tok);
  }

  function open() {
    const list = stepsNow();
    if (!list) return;
    steps = list;
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
    // follow the stage at once, then restart the hand once resizing stops
    tour.classList.add('no-anim');
    placeSpot();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { tour.classList.remove('no-anim'); go(stepIndex); }, 150);
  });

  /* ---------- the button on every activity screen (not the intro) ---------- */

  ['screen-mystery', 'screen-walk', 'screen-temples'].forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'how-btn';
    button.setAttribute('aria-label', 'How to play');
    button.innerHTML = '<img src="assets/svg/help-btn.svg" alt="">';
    button.addEventListener('click', open);
    section.appendChild(button);
  });
}());
