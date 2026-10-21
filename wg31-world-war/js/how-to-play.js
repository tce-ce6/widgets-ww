/* ==========================================================================
   How to play: a guided tour for each step of the widget.
   A "How to play" button (top right) opens a spotlight tour that explains the
   screen you are on, with an animated hand showing the taps.
   Works in viewport coordinates, so it is independent of the stage scale.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const tour = document.getElementById('tour');
  const spot = document.getElementById('tourSpot');
  const layer = document.getElementById('tourDemo');
  const card = document.getElementById('tourCard');
  const HAND = '<svg viewBox="0 0 24 24" width="44" height="44"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#ffffff" stroke="#3a1f0a" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  // SVG elements have no offsetParent, so test for a rendered box instead.
  const shown = (el) => !!el && el.getClientRects().length > 0;
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

  // Move the hand to each point in turn and press it.
  async function tapLoop(tok, getPoints) {
    try {
      while (true) {
        const pts = getPoints();
        if (!pts.length) return;
        const first = pts[0];
        let prev = { x: first.x + 70, y: first.y + 60 };
        const hand = make('tour-hand', prev, HAND);
        for (const p of pts) {
          slide(hand, prev, p, 650);
          await wait(700, tok);
          hand.classList.add('is-press');
          ripple(p);
          await wait(200, tok);
          hand.classList.remove('is-press');
          prev = p;
          await wait(600, tok);
        }
        await wait(700, tok);
        layer.innerHTML = '';
        await wait(400, tok);
      }
    } catch (e) { /* step changed */ }
  }

  // Press, drag the hand across, let go (pan the map).
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
        slide(hand, from, to, 1300);
        await wait(1380, tok);
        hand.classList.remove('is-press');
        await wait(900, tok);
        layer.innerHTML = '';
        await wait(500, tok);
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- finding things on the screen ---------- */

  // The first flag in the tray that has not been used yet.
  const firstFlag = () => $$('#flag-list li').find((li) => !li.dataset.hasPlaceholder && shown(li)) || $('#flag-list li');

  // The country on the map that the given flag belongs to.
  function countryFor(flag) {
    if (!flag) return null;
    const name = flag.dataset.country || '';
    const ids = [name, name.replace(/ /g, '_'), name.replace(/ /g, '-')];
    for (const id of ids) {
      const group = document.getElementById(id);
      if (group && group.querySelector('path')) {
        // aim at the biggest piece of the country
        const paths = $$('path', group);
        let best = paths[0]; let area = 0;
        paths.forEach((p) => {
          const r = p.getBoundingClientRect();
          if (r.width * r.height > area) { area = r.width * r.height; best = p; }
        });
        return best;
      }
    }
    return null;
  }

  const mapBox = () => $('.map-wrapper');

  /* ---------- tour steps per screen ---------- */

  const STEPS = {
    1: [
      {
        title: 'Journey through the war',
        text: 'This timeline has one circle for each year of World War I, from 1914 to 1918. You will predict who stood together in each year.',
        target: () => unionRect([$('#step-1-image-2')]),
        anim: null
      },
      {
        title: 'Tap a year',
        text: 'Tap a <b>year</b> to enter its war zone. Start with <b>1914</b> and then move on year by year.',
        target: () => unionRect([$('#year-1914')]),
        anim: (tok) => tapLoop(tok, () => [centre(document.getElementById('1914'))])
      },
      {
        title: 'Ticks and Replay',
        text: 'A year you have finished gets a green tick. Finish all the years and a <b>Replay</b> button appears so you can play again.',
        target: () => unionRect([$('#step-1-image-2')]),
        anim: null
      }
    ],

    2: [
      {
        title: 'Read the story',
        text: 'Read how the year began. It tells you what happened, so you can work out who would join which side.',
        target: () => unionRect([$('#step-2 .war-description')]),
        anim: null
      },
      {
        title: 'Enter the war zone',
        text: 'When you are ready, tap <b>Enter War Zone</b> to open the map and start predicting.',
        target: () => unionRect([$('#enter-war-zone')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#enter-war-zone'))])
      }
    ],

    3: [
      {
        title: 'Read the question',
        text: 'Each year has questions about the alliances. Read the question on the right. The year you chose is shown on the map.',
        target: () => unionRect([$('.question-text'), $('.selected-year-box')]),
        anim: null
      },
      {
        title: 'Use the clue cards',
        text: 'Stuck? Tap a <b>clue card</b> to read a clue about the country you need to find.',
        target: () => unionRect([$('#clue-wrapper')]),
        anim: (tok) => {
          const clue = $('#clue-wrapper .clue-item');
          return clue ? tapLoop(tok, () => [centre(clue)]) : null;
        }
      },
      {
        title: 'Tap a flag',
        text: 'Tap a flag in the tray at the bottom. The flag colour shows the side: for example, orange for the Central Powers.',
        target: () => unionRect([$('.flag-wrapper')]),
        anim: (tok) => {
          const flag = firstFlag();
          return flag ? tapLoop(tok, () => [centre(firstFlag())]) : null;
        }
      },
      {
        title: 'Tap the country',
        text: 'Now tap the country on the map that you think belongs to that flag. You can also drag the flag onto the country.',
        target: () => unionRect([mapBox(), $('.flag-wrapper')]),
        anim: (tok) => tapLoop(tok, () => {
          const flag = firstFlag();
          const country = countryFor(flag);
          return flag && country ? [centre(flag), centre(country)] : [];
        })
      },
      {
        title: 'Move around the map',
        text: 'Scroll to zoom in and out, and drag the sea to move the map. Small countries are easier to tap when you zoom in.',
        target: () => unionRect([mapBox()]),
        anim: (tok) => dragLoop(tok, () => {
          const r = mapBox().getBoundingClientRect();
          return { x: r.left + r.width * 0.7, y: r.top + r.height * 0.8 };
        }, () => {
          const r = mapBox().getBoundingClientRect();
          return { x: r.left + r.width * 0.45, y: r.top + r.height * 0.7 };
        })
      },
      {
        title: 'Right or wrong?',
        text: 'A right answer colours the country and a message explains why. A wrong one tells you to try again. Tap the <b>×</b> on the message to close it.',
        target: () => unionRect([mapBox()]),
        anim: null
      },
      {
        title: 'Keep going',
        text: 'Find every country for the question. Then tap <b>Proceed</b> (bottom right) for the next question. After the last one you see a summary of the year.',
        target: () => unionRect([$('.right-col'), $('#action-btn')]),
        anim: null
      }
    ],

    4: [
      {
        title: 'The year at a glance',
        text: 'This summary shows which nations stood with the <b>Central Powers</b> and which with the <b>Allied Powers</b> in this year.',
        target: () => unionRect([$('.country-list')]),
        anim: null
      },
      {
        title: 'Back or on to the timeline',
        text: 'Tap <b>Back</b> to look at the map again, or <b>Go to Timeline</b> to pick the next year.',
        target: () => unionRect([$('.btn-wrapper')]),
        anim: (tok) => tapLoop(tok, () => [centre($('#go-to-timeline'))])
      }
    ]
  };

  const currentStep = () => [1, 2, 3, 4].find((n) => {
    const g = document.getElementById(`step-${n}`);
    return g && g.style.display !== 'none';
  });

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
    document.getElementById('tourCount').textContent = `Step ${index + 1} of ${steps.length}`;
    document.getElementById('tourTitle').textContent = step.title;
    document.getElementById('tourText').innerHTML = step.text;
    document.getElementById('tourBack').hidden = index === 0;
    document.getElementById('tourNext').textContent = index === steps.length - 1 ? 'Start playing' : 'Next';
    document.getElementById('tourDots').innerHTML = steps.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeCard(rect);
    if (step.anim) step.anim(tok);
  }

  function open() {
    const n = currentStep();
    if (!STEPS[n]) return;
    steps = STEPS[n];
    opener = document.activeElement;
    tour.classList.add('is-open', 'no-anim');
    tour.setAttribute('aria-hidden', 'false');
    go(0);
    requestAnimationFrame(() => requestAnimationFrame(() => tour.classList.remove('no-anim')));
    document.getElementById('tourNext').focus();
  }

  function close() {
    token++;
    clearDemo();
    tour.classList.remove('is-open');
    tour.setAttribute('aria-hidden', 'true');
    if (opener && document.body.contains(opener)) opener.focus();
  }

  document.getElementById('tourSkip').addEventListener('click', close);
  document.getElementById('tourBack').addEventListener('click', () => { if (stepIndex > 0) go(stepIndex - 1); });
  document.getElementById('tourNext').addEventListener('click', () => (stepIndex < steps.length - 1 ? go(stepIndex + 1) : close()));
  document.getElementById('howBtn').addEventListener('click', open);
  document.addEventListener('keydown', (event) => {
    if (!tour.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') document.getElementById('tourNext').click();
    if (event.key === 'ArrowLeft') document.getElementById('tourBack').click();
  });
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (!tour.classList.contains('is-open')) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => go(stepIndex), 150);
  });
}());
