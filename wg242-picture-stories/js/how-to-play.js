/* ==========================================================================
   How to play: a guided tour of each story step (same idea as wg202).
   The Help button on the step screens opens a spotlight tour with short steps
   and an animated hand. The hand never shows an answer: on the picture it taps
   a spot outside every tap area, and on the cards it taps each one in turn.
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
  const stage = $('#stage');
  const stepScreen = $('#screen-step');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff2e1" stroke="#2f130b" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  function union(rects) {
    const list = rects.filter((r) => r && r.width && r.height);
    if (!list.length) return null;
    const left = Math.min(...list.map((r) => r.left));
    const top = Math.min(...list.map((r) => r.top));
    const right = Math.max(...list.map((r) => r.right));
    const bottom = Math.max(...list.map((r) => r.bottom));
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  /** The element's own box. Use for the picture, whose image is cropped by its frame. */
  const box = (selector) => $(selector).getBoundingClientRect();

  /** The box around the elements and everything inside them (card letters and tags stick out). */
  const boxAll = (selector) => union($$(selector).flatMap((el) => [el, ...$$('*', el)]).map((el) => el.getBoundingClientRect()));

  /** The box around an element's text: the instruction line itself is almost as wide as the stage. */
  function textBox(selector) {
    const range = document.createRange();
    range.selectNodeContents($(selector));
    return range.getBoundingClientRect();
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

  /** The point in the picture nearest its centre that is clear of every tap area, so that no answer is shown. */
  function neutralPoint() {
    const picture = box('#picture');
    const zones = $$('#zones .zone').map((zone) => zone.getBoundingClientRect());
    const margin = 30;
    const mid = { x: picture.left + picture.width / 2, y: picture.top + picture.height / 2 };
    let best = mid;
    let bestDistance = Infinity;
    for (let row = 1; row < 12; row += 1) {
      for (let col = 1; col < 20; col += 1) {
        const pt = { x: picture.left + (picture.width * col) / 20, y: picture.top + (picture.height * row) / 12 };
        const clear = zones.every((r) => pt.x < r.left - margin || pt.x > r.right + margin || pt.y < r.top - margin || pt.y > r.bottom + margin);
        const distance = Math.hypot(pt.x - mid.x, pt.y - mid.y);
        if (clear && distance < bestDistance) {
          best = pt;
          bestDistance = distance;
        }
      }
    }
    return best;
  }

  /* ---------- animated demos (each loops until the step changes) ---------- */

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

  const popCards = (tok) => popLoop(tok, () => $$('#cards .card'));
  const tapCards = (tok) => tapLoop(tok, () => $$('#cards .card').map(centre));
  const tapNext = (tok) => tapLoop(tok, () => [centre($('#nextBtn'))]);

  /* ---------- tour steps per screen ---------- */

  const STEPS = {
    notice: [
      {
        title: 'Look closely',
        text: 'Look at everything in the picture. Some things in it make you ask a question.',
        target: () => box('#picture'),
        anim: null,
      },
      {
        title: 'Tap what makes you wonder',
        text: 'Tap four things in the picture that make you ask a question. A yellow ring marks each one you find.',
        target: () => box('#picture'),
        anim: (tok) => tapLoop(tok, () => [neutralPoint()]),
      },
      {
        title: 'Fill the four boxes',
        text: 'Each thing you find fills the next box with its name and its question.',
        target: () => boxAll('#slots'),
        anim: (tok) => popLoop(tok, () => $$('#slots .slot')),
      },
      {
        title: 'Not everything counts',
        text: 'Some things are just part of the background. If you tap one, a message asks you to try something else.',
        target: () => box('#picture'),
        anim: null,
      },
      {
        title: 'Move on',
        text: 'When you have found all four, tap <b>Next</b>. Tap <b>All pictures</b> to choose a different picture.',
        target: () => boxAll('.nav'),
        anim: tapNext,
      },
    ],

    outline: [
      {
        title: 'Two outlines',
        text: 'Each outline lists a beginning, a problem, a turning point and an ending. Read both.',
        target: () => boxAll('#cards'),
        anim: popCards,
      },
      {
        title: 'Check the picture',
        text: 'Look back at the picture. Does each outline use the details you found?',
        target: () => box('#picture'),
        anim: null,
      },
      {
        title: 'Tap the better outline',
        text: 'Tap <b>A</b> or <b>B</b>. If it isn\'t the right one, you get a hint and can try again.',
        target: () => boxAll('#cards'),
        anim: tapCards,
      },
      {
        title: 'Move on',
        text: 'When you find the right outline, every card shows a tag saying what works or what is wrong. Then tap <b>Build the story</b>.',
        target: () => boxAll('.nav'),
        anim: tapNext,
      },
    ],

    build: [
      {
        title: 'Follow your outline',
        text: 'This line from your outline says what happens in this part. There are four parts to build.',
        target: () => union([textBox('#stepLine'), box('#partPill')]),
        anim: null,
      },
      {
        title: 'Two versions',
        text: 'Read both versions of this part. Check each one against the picture and the outline.',
        target: () => boxAll('#cards'),
        anim: popCards,
      },
      {
        title: 'Tap the stronger version',
        text: 'Tap <b>A</b> or <b>B</b>. If it isn\'t the right one, you get a hint and can try again.',
        target: () => boxAll('#cards'),
        anim: tapCards,
      },
      {
        title: 'Move on',
        text: 'When you find the right version, every card shows a tag. Then tap the button to go to the next part. <b>Back</b> takes you to the part before.',
        target: () => boxAll('.nav'),
        anim: tapNext,
      },
    ],

    title: [
      {
        title: 'Three titles',
        text: 'Read all three titles. A good title makes the reader curious.',
        target: () => boxAll('#cards'),
        anim: popCards,
      },
      {
        title: 'Tap the best title',
        text: 'Tap <b>A</b>, <b>B</b> or <b>C</b>. If it isn\'t the right one, you get a hint and can try again.',
        target: () => boxAll('#cards'),
        anim: tapCards,
      },
      {
        title: 'Read your story',
        text: 'When you find the best title, tap <b>Read your story</b> to see the whole story you built.',
        target: () => boxAll('.nav'),
        anim: tapNext,
      },
    ],
  };

  /* ---------- card placement and rendering ---------- */

  function placeCard(rect) {
    const m = 12;
    const gap = 18;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    let top;
    let left;
    if (!rect) {
      left = (W - cw) / 2;
      top = (H - ch) / 2;
    } else {
      left = rect.left + rect.width / 2 - cw / 2;
      if (rect.bottom + gap + ch <= H - m) {
        top = rect.bottom + gap;
      } else if (rect.top - gap - ch >= m) {
        top = rect.top - gap - ch;
      } else {
        // No room above or below: sit beside the highlighted area.
        top = Math.min(H - ch - m, Math.max(m, rect.top + 20));
        left = rect.left + rect.width / 2 < W / 2 ? W - cw - m - 16 : m + 16;
      }
    }
    card.style.left = `${Math.max(m, Math.min(W - cw - m, left))}px`;
    card.style.top = `${Math.max(m, Math.min(H - ch - m, top))}px`;
  }

  function go(index) {
    stepIndex = index;
    token += 1;
    const tok = token;
    clearDemo();
    const step = steps[index];
    const rect = step.target();
    const pad = 10;
    if (rect) {
      spot.hidden = false;
      Object.assign(spot.style, {
        left: `${rect.left - pad}px`,
        top: `${rect.top - pad}px`,
        width: `${rect.width + pad * 2}px`,
        height: `${rect.height + pad * 2}px`,
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
    if (step.anim && !reduceMotion) step.anim(tok);
  }

  function open() {
    steps = STEPS[stepScreen.dataset.step];
    if (!steps) return;
    opener = document.activeElement;
    tour.classList.add('is-open', 'no-anim');
    tour.setAttribute('aria-hidden', 'false');
    stage.inert = true;
    go(0);
    requestAnimationFrame(() => requestAnimationFrame(() => tour.classList.remove('no-anim')));
    $('#tourNext').focus({ preventScroll: true });
  }

  function close() {
    token += 1;
    clearDemo();
    tour.classList.remove('is-open');
    tour.setAttribute('aria-hidden', 'true');
    stage.inert = false;
    if (opener && document.body.contains(opener)) opener.focus({ preventScroll: true });
  }

  $('#tourBtn').addEventListener('click', open);
  $('#tourSkip').addEventListener('click', close);
  $('#tourBack').addEventListener('click', () => {
    if (stepIndex > 0) go(stepIndex - 1);
  });
  $('#tourNext').addEventListener('click', () => (stepIndex < steps.length - 1 ? go(stepIndex + 1) : close()));
  document.addEventListener('keydown', (event) => {
    if (!tour.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.stopImmediatePropagation();
      close();
    }
    if (event.key === 'ArrowRight') $('#tourNext').click();
    if (event.key === 'ArrowLeft') $('#tourBack').click();
  }, true);
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (!tour.classList.contains('is-open')) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => go(stepIndex), 150);
  });
}());
