/* ==========================================================================
   How to play: a guided tour of the screen on show (same as wg242).
   The Help button opens a spotlight tour with short steps and an animated
   hand. The hand never shows an answer: on a case it taps Noun and then Verb
   on the same sentence, to show that a choice can be changed.
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
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff" stroke="#042c6e" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  const game = window.doubleAgentHowTo || { isBusy: () => false };

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

  /** The box around the elements and everything inside them. */
  const boxAll = (selector) => union($$(selector).flatMap((el) => [el, ...$$('*', el)]).map((el) => el.getBoundingClientRect()));

  /** The box around an element's text (lines of text are often much narrower than their element). */
  function textBox(selector) {
    const node = $(selector);
    if (!node) return null;
    const range = document.createRange();
    range.selectNodeContents(node);
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

  /* ---------- tour steps per screen ---------- */

  const STEPS = {
    game: [
      {
        title: 'Read both reports',
        text: 'The question names the word to check. Find it in each sentence: it is the highlighted word.',
        target: () => union([textBox('#prompt'), boxAll('#rows .sentence')]),
        anim: (tok) => popLoop(tok, () => $$('#rows .target')),
      },
      {
        title: 'Tap Noun or Verb',
        text: 'Tap <b>Noun</b> or <b>Verb</b> beside each sentence. You can change your choice until you tap Check.',
        target: () => boxAll('#rows .job'),
        anim: (tok) => tapLoop(tok, () => {
          const row = $('#rows .row');
          return [centre($('.job--noun', row)), centre($('.job--verb', row))];
        }),
      },
      {
        title: 'Check your answers',
        text: 'When both sentences have a label, tap <b>Check</b>. You see the right answers and why they are right.',
        target: () => boxAll('#mainBtn'),
        anim: (tok) => tapLoop(tok, () => [centre($('#mainBtn'))]),
      },
      {
        title: 'Unmask the agent',
        text: 'You unmask an agent when you label both sentences correctly. The count at the top shows how many. Then tap <b>Next case</b>.',
        target: () => union([boxAll('#status'), boxAll('#mainBtn')]),
        anim: null,
      },
    ],

    end: [
      {
        title: 'Case closed',
        text: 'This shows how many agents you unmasked.',
        target: () => union([boxAll('#screen-end .closed'), textBox('#endScore')]),
        anim: null,
      },
      {
        title: 'Play again',
        text: 'Tap <b>Play again</b> to go back to the briefing and start a new mission.',
        target: () => boxAll('#againBtn'),
        anim: (tok) => tapLoop(tok, () => [centre($('#againBtn'))]),
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
    $('#tourNext').textContent = index === steps.length - 1 ? 'Done' : 'Next';
    $('#tourDots').innerHTML = steps.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeCard(rect);
    if (step.anim && !reduceMotion) step.anim(tok);
  }

  function open() {
    const screen = $('.screen.is-active');
    const key = screen && screen.id.replace('screen-', '');
    if (!STEPS[key]) return;
    // the paper slides in and out between cases: wait for it to settle before measuring
    if (game.isBusy()) {
      setTimeout(open, 150);
      return;
    }
    steps = STEPS[key];
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

  $('#helpBtn').addEventListener('click', open);
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
