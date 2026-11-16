/* ==========================================================================
   How to play: a guided tour for each shop activity (same behaviour as wg202).
   A Help button on every activity screen opens a spotlight tour with short
   steps and an animated hand showing the drag / tap.
   Works in viewport coordinates, so it is independent of the stage scale.
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
  const data = window.chinaHowTo || {};

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const scale = () => stageEl.getBoundingClientRect().width / 1920;
  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  // SVG elements have no offsetParent, so they count as visible when they have a box
  const visible = (el) => el && (el instanceof SVGElement ? el.getClientRects().length > 0 : el.offsetParent !== null);
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  // a point given in 1920x1080 stage pixels, in viewport pixels
  const stagePoint = (x, y) => {
    const r = stageEl.getBoundingClientRect();
    return { x: r.left + x * scale(), y: r.top + y * scale() };
  };

  // Box around the visible elements and everything inside them (absolutely
  // positioned children can stick out of a parent that reports a smaller box).
  function unionRect(els) {
    const list = els.filter(visible);
    if (!list.length) return null;
    let l = 1e9; let t = 1e9; let r = -1e9; let b = -1e9;
    list.forEach((root) => {
      [root, ...$$('*', root)].forEach((el) => {
        if (el.closest('defs')) return;
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

  // Press on `from`, carry a copy of it to `to`, let go.
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
          const isText = liftEl.classList.contains('card');
          const ghost = make('tour-ghost', from, isText ? liftEl.textContent.trim() : '');
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.fontSize = `${parseFloat(getComputedStyle(liftEl).fontSize) * scale()}px`;
          if (!isText) ghost.classList.add('is-card');
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

  // Move the hand to a point and press it, over and over.
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
          void el.getBoundingClientRect();
          el.classList.add('tour-pop');
          await wait(260, tok);
        }
        await wait(1300, tok);
        els.forEach((el) => el.classList.remove('tour-pop'));
      }
    } catch (e) { /* step changed */ }
  }

  // Press and slide the hand from one point to another (a slider drag).
  async function slideLoop(tok, getFrom, getTo) {
    try {
      while (true) {
        const from = getFrom(); const to = getTo();
        const hand = make('tour-hand', { x: from.x + 60, y: from.y + 50 }, HAND);
        slide(hand, { x: from.x + 60, y: from.y + 50 }, from, 500);
        await wait(560, tok);
        hand.classList.add('is-press');
        ripple(from);
        slide(hand, from, to, 1800);
        await wait(1880, tok);
        hand.classList.remove('is-press');
        await wait(900, tok);
        layer.innerHTML = '';
        await wait(400, tok);
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- tour steps per screen ---------- */

  const btnsOf = (screen) => $(`#screen-${screen} .act-btns`);

  const STEPS = {
    timeline: [
      {
        title: 'Four dynasties',
        text: 'The timeline shows the dates of four Chinese dynasties, from the oldest on the left to the newest on the right.',
        target: () => unionRect([$('#tlCols')]),
        anim: (tok) => popLoop(tok, () => $$('#tlCols .tl__col'))
      },
      {
        title: 'Drag a name to its dates',
        text: 'Press and hold a dynasty name, drag it onto the <b>Drag here</b> box under its dates, then let go.',
        target: () => unionRect([$('#tl')]),
        anim: (tok) => {
          const c = $$('#tlTray .card').find((x) => $(`.tl__slot[data-key="${x.dataset.key}"]:not(.is-done)`));
          if (!c) return null;
          const slot = $(`.tl__slot[data-key="${c.dataset.key}"]`);
          return dragLoop(tok, () => centre(c), () => centre(slot), c);
        }
      },
      {
        title: 'Read the fact',
        text: 'A right name stays on the timeline. Tap the <b>i</b> beside it to read a fact about that dynasty. A wrong name shakes the box, so compare the dates and try again.',
        target: () => unionRect([$('#tlCols')]),
        anim: null
      },
      {
        title: 'Reset or go back',
        text: 'Tap <b>Reset</b> to start this timeline again, or <b>Back to the market</b> to visit another shop.',
        target: () => unionRect([btnsOf('timeline')]),
        anim: null
      }
    ],

    city: [
      {
        title: 'Ten parts of a city',
        text: 'These are the ten parts of an early Chinese city. The map below has four zones: riverbank, settlement centre, high ground and city edge.',
        target: () => unionRect([$('#cityTray')]),
        anim: (tok) => popLoop(tok, () => $$('#cityTray .card'))
      },
      {
        title: 'Drag a part onto its zone',
        text: 'Press and hold a part, drag it onto the zone of the map where it belongs, then let go.',
        target: () => unionRect([$('#cityTray'), $('#cityMap')]),
        anim: (tok) => {
          const c = $('#cityTray .card');
          const item = c && data.cityItem && data.cityItem(c.dataset.name);
          if (!item) return null;
          return dragLoop(tok, () => centre(c), () => stagePoint(item.at[0], item.at[1]), c);
        }
      },
      {
        title: 'Right or wrong?',
        text: 'A right part appears on the map with a short note. A wrong one shakes the map and gives you a hint, so try another zone.',
        target: () => unionRect([$('#cityMap')]),
        anim: null
      },
      {
        title: 'See the built city',
        text: 'When all ten parts are placed, tap <b>See the Built City</b>. Tap <b>Rebuild</b> to start again.',
        target: () => unionRect([btnsOf('city')]),
        anim: null
      }
    ],

    bronze: [
      {
        title: 'Six casting stages',
        text: 'These cards are the six stages of casting a bronze vessel, all mixed up.',
        target: () => unionRect([$('#bronzeTray')]),
        anim: (tok) => popLoop(tok, () => $$('#bronzeTray .card'))
      },
      {
        title: 'Drag the stages in order',
        text: 'Press and hold the stage that comes first, drag it into slot <b>1</b> and let go. Then fill slots 2 to 6 in order.',
        target: () => unionRect([$('#bronzeTray'), $('#bronzeSlots')]),
        anim: (tok) => {
          const slot = $('#bronzeSlots .bronze__slot.is-next');
          const c = slot && $(`#bronzeTray .card[data-stage="${slot.dataset.slot}"]`);
          if (!c) return null;
          return dragLoop(tok, () => centre(c), () => centre(slot), c);
        }
      },
      {
        title: 'Watch the workbench',
        text: 'Each right stage is drawn on the workbench with a caption. A stage out of order shakes the slot, so think about what must happen first.',
        target: () => unionRect([$('#bronzeCard'), $('#bronzeCaption')]),
        anim: null
      },
      {
        title: 'Inspect the vessel',
        text: 'After the sixth stage you see the finished bronze vessel. Tap <b>Reset</b> to cast again.',
        target: () => unionRect([btnsOf('bronze')]),
        anim: null
      }
    ],

    oracle: [
      {
        title: 'Heat the fire',
        text: 'Press the ember and drag it to the right along the line. The hotter the fire, the more oracle bones crack.',
        target: () => unionRect([$('#ember')]),
        anim: (tok) => slideLoop(tok, () => centre($('#emberKnob')), () => {
          const r = $('#ember').getBoundingClientRect();
          return { x: r.right - 20 * scale(), y: r.top + r.height / 2 };
        })
      },
      {
        title: 'Tap a cracked bone',
        text: 'When a bone cracks, tap it to read the question someone asked long ago.',
        target: () => unionRect($$('#oracle .bone')),
        anim: (tok) => tapLoop(tok, () => {
          const bone = $('.bone.is-cracked:not(.is-read)') || $('.bone:not(.is-read)') || $('.bone');
          return [centre(bone)];
        })
      },
      {
        title: 'Answer two questions',
        text: 'First choose what the person asked, then the feeling behind it: hope, fear, desire or daily life. A wrong choice lets you try again.',
        target: () => unionRect($$('#oracle .bone')),
        anim: null
      },
      {
        title: 'Read all five',
        text: 'A tick marks each bone you have read. Read all five to finish this shop.',
        target: () => unionRect([$('#emberNote')]) || unionRect($$('#oracle .bone')),
        anim: null
      }
    ],

    silk: [
      {
        title: 'Tap the glowing plaque',
        text: 'Start with the glowing cocoon. Tap it to send the silk thread on to the next stage.',
        target: () => unionRect([$('#chain .plaque.is-lit') || $('#chain .plaque')]),
        anim: (tok) => {
          const p = $('#chain .plaque.is-lit') || $('#chain .plaque');
          if (!p) return null;
          return tapLoop(tok, () => [centre($('#chain .plaque.is-lit') || p)]);
        }
      },
      {
        title: 'Follow the thread',
        text: 'Each tap draws the thread to the next plaque, which starts to glow. Tap the plaques in turn, from cocoon to loaded cart.',
        target: () => unionRect($$('#chain .plaque')),
        anim: null
      },
      {
        title: 'On to the Trade Desk',
        text: 'After the loaded cart, tap <b>Enter the Trade Desk</b> to sort the goods.',
        target: () => unionRect([btnsOf('silk')]),
        anim: null
      }
    ],

    desk: [
      {
        title: 'Fourteen objects',
        text: 'These objects were traded in Han China. Some went west, some stayed in China and some arrived from outside.',
        target: () => unionRect([$('#deskItems')]),
        anim: (tok) => popLoop(tok, () => $$('#deskItems .item:not(.is-gone)'))
      },
      {
        title: 'Drag each one to a chamber',
        text: 'Press and hold an object, drag it into the chamber that says where it travels, then let go.',
        target: () => unionRect([$('#desk')]),
        anim: (tok) => {
          const it = $('#deskItems .item:not(.is-gone)');
          const to = it && data.goodsTo && data.goodsTo(it.dataset.key);
          const chamber = to && $(`.chamber[data-chamber="${to}"]`);
          if (!chamber) return null;
          return dragLoop(tok, () => centre(it), () => centre(chamber), it);
        }
      },
      {
        title: 'Right or wrong?',
        text: 'A right object is listed in its chamber with a short note. A wrong one shakes the chamber, so think about which way it travels.',
        target: () => unionRect([$$('.chamber')[0], $$('.chamber')[2]]),
        anim: null
      },
      {
        title: 'See the summary',
        text: 'When the desk is clear, tap <b>See the Summary</b>. Tap <b>Reset</b> to sort the objects again.',
        target: () => unionRect([btnsOf('desk')]),
        anim: null
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

  const screenKey = (section) => section && section.id.replace('screen-', '');

  function open() {
    const id = screenKey($('.screen.is-active'));
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

  /* ---------- the Help button on every activity screen ---------- */

  $$('.screen.act').forEach((section) => {
    if (!STEPS[screenKey(section)]) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'how-btn';
    button.setAttribute('aria-label', 'How to play');
    button.innerHTML = '<img src="assets/svg/help-btn.svg" alt="">';
    button.addEventListener('click', open);
    section.appendChild(button);
  });
}());
