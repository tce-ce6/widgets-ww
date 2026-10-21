/* ==========================================================================
   How to play: a guided tour for each gallery activity.
   A "How to play" button on every gallery screen opens a spotlight tour with
   short steps and an animated hand showing the drag / tap / draw.
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

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const scale = () => stageEl.getBoundingClientRect().width / 1920;
  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const visible = (el) => el && el.offsetParent !== null;
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
          const ghost = make('tour-ghost', from, liftEl.classList.contains('chip') ? liftEl.textContent.trim() : '');
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          ghost.style.fontSize = `${28 * scale()}px`;
          if (!liftEl.classList.contains('chip')) ghost.classList.add('is-card');
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
          void el.offsetWidth;
          el.classList.add('tour-pop');
          await wait(260, tok);
        }
        await wait(1300, tok);
        els.forEach((el) => el.classList.remove('tour-pop'));
      }
    } catch (e) { /* step changed */ }
  }

  // Move the hand along a polyline, drawing a trail behind it.
  async function pathLoop(tok, getPoints, colour) {
    try {
      while (true) {
        const raw = getPoints();
        const total = raw.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - raw[i].x, p.y - raw[i].y), 0);
        const samples = 36;
        const pts = [];
        let seg = 0; let acc = 0;
        for (let k = 0; k <= samples; k++) {
          const dist = (total * k) / samples;
          while (seg < raw.length - 2 && acc + Math.hypot(raw[seg + 1].x - raw[seg].x, raw[seg + 1].y - raw[seg].y) < dist) {
            acc += Math.hypot(raw[seg + 1].x - raw[seg].x, raw[seg + 1].y - raw[seg].y);
            seg++;
          }
          const a = raw[seg]; const b = raw[seg + 1];
          const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          const f = Math.min(1, Math.max(0, (dist - acc) / len));
          pts.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
        }
        const start = pts[0];
        const hand = make('tour-hand', { x: start.x + 60, y: start.y + 50 }, HAND);
        slide(hand, { x: start.x + 60, y: start.y + 50 }, start, 500);
        await wait(560, tok);
        hand.classList.add('is-press');
        ripple(start);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'tour-trail');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        line.setAttribute('points', pts.map((p) => `${p.x},${p.y}`).join(' '));
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke', colour || '#2f8fe8');
        line.setAttribute('stroke-width', String(Math.max(4, 10 * scale())));
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(line);
        layer.insertBefore(svg, hand);
        const length = line.getTotalLength();
        line.style.strokeDasharray = String(length);
        const duration = 2400;
        line.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], { duration, easing: 'linear', fill: 'forwards' });
        hand.animate(
          pts.map((p, i) => ({ left: `${p.x}px`, top: `${p.y}px`, offset: i / samples })),
          { duration, easing: 'linear', fill: 'forwards' }
        );
        await wait(duration + 100, tok);
        hand.classList.remove('is-press');
        await wait(1200, tok);
        layer.innerHTML = '';
        await wait(400, tok);
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- tour steps per screen ---------- */

  // Tray chip that has a matching drop slot, plus that slot.
  function matchPair(trayEl, slotsEl) {
    const chips = $$('.chip:not(.is-gone)', trayEl).filter(visible);
    for (const chip of chips) {
      const slot = $(`.placard[data-key="${chip.dataset.key}"]:not(.is-disabled)`, slotsEl);
      if (slot) return { chip, slot };
    }
    return null;
  }

  function matchSteps(cfg) {
    const scenes = () => $(cfg.scenes);
    const tray = () => $(cfg.tray);
    const pair = () => matchPair(tray(), scenes());
    return [
      {
        title: cfg.sceneTitle,
        text: cfg.sceneText,
        target: () => unionRect([scenes()]),
        anim: (tok) => popLoop(tok, () => $$('.scene', scenes()))
      },
      {
        title: 'Read the labels',
        text: 'The labels are waiting in the tray at the bottom. Read each one and think about which scene it names.',
        target: () => unionRect([tray()]),
        anim: (tok) => popLoop(tok, () => $$('.chip:not(.is-gone)', tray()))
      },
      {
        title: 'Drag a label to its scene',
        text: 'Press and hold a label, drag it onto the <b>Drag here</b> box under the scene it belongs to, then let go.',
        target: () => unionRect([scenes(), tray()]),
        anim: (tok) => {
          const p = pair();
          if (!p) return null;
          return dragLoop(tok, () => centre(p.chip), () => centre(p.slot), p.chip);
        }
      },
      {
        title: 'Right or wrong?',
        text: 'A right label stays in place and you read a note about the scene. A wrong one turns red and jumps back, so just try another scene.',
        target: () => unionRect([scenes()]),
        anim: null
      },
      {
        title: 'Move on',
        text: cfg.finishText,
        target: () => unionRect([$(cfg.next), $('.note-strip', $(`#screen-${cfg.screen}`))]) || unionRect([scenes()]),
        anim: null
      }
    ];
  }

  const STEPS = {
    sources: [
      {
        title: 'Four objects',
        text: 'These four objects each tell part of the story of ancient Egypt. Look at them closely.',
        target: () => unionRect([$('#objectRow')]),
        anim: (tok) => popLoop(tok, () => $$('#objectRow .object-card'))
      },
      {
        title: 'Drag one onto another',
        text: 'Press and hold an object, drag it onto a second object and let go. Together they reveal something neither shows alone.',
        target: () => unionRect([$('#objectRow')]),
        anim: (tok) => {
          const cards = $$('#objectRow .object-card');
          return dragLoop(tok, () => centre(cards[0]), () => centre(cards[1]), cards[0]);
        }
      },
      {
        title: 'Choose the right claim',
        text: 'Read the three claims and tap the one that is only true when you use <b>both</b> objects. A wrong tap lets you try again.',
        target: () => unionRect([$('#objectRow')]),
        anim: null
      },
      {
        title: 'Claim the key',
        text: 'After a right answer you can read what the pair shows. Keep pairing objects as long as you like, then tap <b>Claim the Key</b> to move on.',
        target: () => unionRect([$('#objectRow')]),
        anim: null
      }
    ],

    nile: [
      {
        title: 'Trace the river',
        text: 'Draw the course of the Nile on the map with your finger or mouse. Start in the south at the bottom and follow the river north up to the sea.',
        target: () => unionRect([$('#mapWrap')]),
        anim: (tok) => {
          const nile = (window.museumHowTo && window.museumHowTo.nilePath) || [[330, 507], [418, 120], [415, 70]];
          return pathLoop(tok, () => {
            const canvas = $('#nileCanvas');
            const r = canvas.getBoundingClientRect();
            return nile.map(([px, py]) => ({ x: r.left + (px * r.width) / canvas.width, y: r.top + (py * r.height) / canvas.height }));
          });
        }
      },
      {
        title: 'Need a hand?',
        text: 'Tap <b>Hint</b> to show a dotted line along the river. Follow the dots and draw over them.',
        target: () => unionRect([$('#btnNileHint')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#btnNileHint'))])
      },
      {
        title: 'Start again',
        text: 'Not happy with your drawing? Tap <b>Clear</b> to wipe the map clean. It also hides the hint and the answer.',
        target: () => unionRect([$('#btnNileClear')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#btnNileClear'))])
      },
      {
        title: 'Check your river',
        text: 'When your line follows the river, tap <b>Submit</b>. A right trace unlocks the next activity.',
        target: () => unionRect([$('#btnNileSubmit')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#btnNileSubmit'))])
      },
      {
        title: 'Still stuck?',
        text: 'After two wrong tries a <b>Show Answer</b> button appears next to Submit. It draws the river for you, and you cannot draw while it is showing. Tap <b>Hide Answer</b> or <b>Clear</b> to try again.',
        target: () => unionRect([$('#btnNileClear'), $('#btnNileSubmit'), $('#btnNileAnswer')]),
        anim: null
      }
    ],

    season: [
      {
        title: 'Spin the wheel',
        text: 'Drag the wheel round (or use the left and right arrow keys). It stops on a season each time. Look at the picture to see which season it shows.',
        target: () => unionRect([$('.wheel-zone'), $('.season-frame')]),
        anim: (tok) => pathLoop(tok, () => {
          const r = $('#wheel').getBoundingClientRect();
          const c = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
          const rad = r.width * 0.34;
          const pts = [];
          for (let a = -150; a <= -30; a += 20) pts.push({ x: c.x + rad * Math.cos((a * Math.PI) / 180), y: c.y + rad * Math.sin((a * Math.PI) / 180) });
          return pts;
        }, '#f5c542')
      },
      {
        title: 'Name the season',
        text: 'Drag the right season label from the bottom onto the <b>Drag here</b> box beside the picture.',
        target: () => unionRect([$('#seasonTray'), $('#seasonPlacard')]),
        anim: (tok) => {
          const chip = $$('#seasonTray .chip:not(.is-gone)')[0];
          if (!chip) return null;
          return dragLoop(tok, () => centre(chip), () => centre($('#seasonPlacard')), chip);
        }
      },
      {
        title: 'Name all three',
        text: 'Turn the wheel again and name each of the three seasons. A <b>Next</b> button appears once all three are done.',
        target: () => unionRect([$('.wheel-zone')]),
        anim: null
      }
    ],

    river: matchSteps({
      screen: 'river',
      scenes: '#riverScenes',
      tray: '#riverTray',
      next: '#btnRiverDone',
      sceneTitle: 'Four scenes',
      sceneText: 'Each picture shows one way the Egyptians turned the Nile into farmland.',
      finishText: 'When all four labels are placed, a button appears to take you back to the Keeper\'s Hall.'
    }),

    pyramid: [
      {
        title: 'The pyramid',
        text: 'Each tier of the pyramid shows a painting of one class of Egyptian society, from the king at the top to the workers at the bottom.',
        target: () => unionRect([$('#pyramid')]),
        anim: (tok) => popLoop(tok, () => $$('#pyramid .tier'))
      },
      {
        title: 'Drag a rank to its tier',
        text: 'Press and hold a rank name, drag it onto the <b>Drag here</b> box on the tier it belongs to, and let go.',
        target: () => unionRect([$('#pyramid'), $('#pyramidTray')]),
        anim: (tok) => {
          const p = matchPair($('#pyramidTray'), $('#pyramid'));
          if (!p) return null;
          return dragLoop(tok, () => centre(p.chip), () => centre(p.slot), p.chip);
        }
      },
      {
        title: 'Read the Curator\'s Notes',
        text: 'Every right match shows what that class did in the Curator\'s Notes. A wrong match turns red, so try another tier.',
        target: () => unionRect([$('.curator-notes')]),
        anim: null
      },
      {
        title: 'Insights and Next',
        text: 'When every rank is placed, <b>Insights</b> lets you read about each class and <b>Next</b> takes you to the next activity.',
        target: () => unionRect([$('#btnInsights'), $('#btnPyramidNext')]) || unionRect([$('#pyramidTray')]),
        anim: null
      }
    ],

    portrait: [
      {
        title: 'The broken picture',
        text: 'The picture has been cut into six tiles and shuffled. Your job is to put every tile back in its right place.',
        target: () => unionRect([$('#puzzleGrid')]),
        anim: (tok) => popLoop(tok, () => $$('#puzzleGrid .tile'))
      },
      {
        title: 'Tap two tiles to swap',
        text: 'Tap one tile, then tap another. The two tiles swap places. The counter below shows how many tiles are in place.',
        target: () => unionRect([$('#puzzleGrid'), $('#puzzleCaption')]),
        anim: (tok) => {
          const tiles = $$('#puzzleGrid .tile');
          if (tiles.length < 2) return null;
          return tapLoop(tok, () => [centre(tiles[0]), centre(tiles[tiles.length - 1])]);
        }
      },
      {
        title: 'Answer the question',
        text: 'Once the picture is restored, the question card opens. Read it and tap the best answer.',
        target: () => unionRect([$('.question-card')]),
        anim: null
      }
    ],

    leisure: matchSteps({
      screen: 'leisure',
      scenes: '#leisureScenes',
      tray: '#leisureTray',
      next: '#btnLeisureNext',
      sceneTitle: 'Pastimes by the river',
      sceneText: 'These pictures show how Egyptians enjoyed their free time.',
      finishText: 'Place every label and a button appears to take you to the festival procession.'
    }),

    procession: matchSteps({
      screen: 'procession',
      scenes: '#processionScenes',
      tray: '#processionTray',
      next: '#btnProcessionNext',
      sceneTitle: 'Parts of the festival',
      sceneText: 'Each picture shows one part of a festival procession in ancient Egypt.',
      finishText: 'Once every label is in place, tap the button to begin the procession.'
    }),

    echoes: [
      {
        title: 'The procession',
        text: 'A god\'s statue is carried out of the temple and through the streets. You only need to watch and listen.',
        target: () => unionRect([$('#processionView')]),
        anim: null
      },
      {
        title: 'Begin the procession',
        text: 'Tap <b>Begin the Procession</b> to start. Make sure the sound is on so you can hear it.',
        target: () => unionRect([$('#btnBegin'), $('#btnFinish')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#btnBegin').offsetParent ? $('#btnBegin') : $('#btnFinish'))])
      },
      {
        title: 'Listen for the sounds',
        text: 'The sounds light up one by one as the procession passes: the sistrum, drums, voices and the statue.',
        target: () => unionRect([$('#soundChips')]),
        anim: (tok) => popLoop(tok, () => $$('#soundChips li'))
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
    const id = screen && screen.dataset.screen;
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

  /* ---------- the button on every activity screen ---------- */

  $$('.screen.gallery').forEach((section) => {
    if (!STEPS[section.dataset.screen]) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'how-btn';
    button.innerHTML = '<span aria-hidden="true">?</span>How to play';
    button.addEventListener('click', open);
    section.appendChild(button);
  });
}());
