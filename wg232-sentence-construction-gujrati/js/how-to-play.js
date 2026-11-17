/* ==========================================================================
   How to play (મદદ): a guided tour of the activity, same idea as wg202/wg231.
   The help button opens a spotlight tour with short steps and an animated
   hand. Works in viewport coordinates. The game is drawn on a p5 canvas in
   1920x1080 design pixels, so canvas areas are mapped to the screen with
   designRect(); the HTML buttons are measured directly.
   Reads the game state from js/script.js (wordButtons, blanks, …).
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

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

  const gu = (n) => String(n).replace(/\d/g, (d) => String.fromCharCode(0x0AE6 + Number(d)));
  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const centre = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

  // Game state from script.js (top-level lets are shared between classic scripts).
  /* global wordButtons, blanks, currentSentence, showExample, sentenceComplete, gameFinished,
            SENTENCE_BOX, PROGRESS, COUNTER */
  const playing = () => typeof gameFinished !== 'undefined' && !gameFinished;
  const tilesShown = () => playing() && !showExample && !sentenceComplete;

  // A rectangle in canvas design pixels -> viewport pixels.
  function designRect(x, y, w, h) {
    const canvas = $('#mainCanvas canvas');
    if (!canvas) return null;
    const r = canvas.getBoundingClientRect();
    const s = r.width / 1920;
    return { left: r.left + x * s, top: r.top + y * s, width: w * s, height: h * s, right: r.left + (x + w) * s, bottom: r.top + (y + h) * s };
  }

  function elRect(el) {
    if (!el || el.offsetParent === null) return null;
    const r = el.getBoundingClientRect();
    return r.width && r.height ? r : null;
  }

  // Box around several rects, kept inside the window.
  function union(rects) {
    const list = rects.filter(Boolean);
    if (!list.length) return null;
    let l = Math.max(0, Math.min(...list.map((r) => r.left)));
    let t = Math.max(0, Math.min(...list.map((r) => r.top)));
    let r = Math.min(innerWidth, Math.max(...list.map((x) => x.right)));
    let b = Math.min(innerHeight, Math.max(...list.map((x) => x.bottom)));
    if (l >= r || t >= b) return null;
    return { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
  }

  const tileRects = () => (tilesShown() ? wordButtons.filter((w) => !w.word.isPlaced).map((w) => designRect(w.x, w.y, w.w, w.h)) : []);
  const sentenceRect = () => designRect(SENTENCE_BOX.x, SENTENCE_BOX.y, SENTENCE_BOX.w, SENTENCE_BOX.h);
  const progressRect = () => union([
    designRect(PROGRESS.x, PROGRESS.y, PROGRESS.w, PROGRESS.h),
    designRect(COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h)
  ]);

  // The tile that goes in the first empty blank, and that blank's spot.
  function nextMove() {
    if (!tilesShown()) return null;
    const blankIndex = blanks.findIndex((b) => !b.word);
    if (blankIndex < 0) return null;
    const tile = wordButtons.find((w) => !w.word.isPlaced && w.word.text === currentSentence.words[blankIndex]);
    if (!tile) return null;
    const blank = blanks[blankIndex];
    return {
      tile,
      from: designRect(tile.x, tile.y, tile.w, tile.h),
      to: designRect(blank.x, 375, blank.w, 97) // PLACED row in script.js
    };
  }

  // Any tile that is NOT the next word.
  function wrongTile() {
    const m = nextMove();
    if (!m) return null;
    const w = wordButtons.find((b) => !b.word.isPlaced && b.word.text !== m.tile.word.text);
    return w ? designRect(w.x, w.y, w.w, w.h) : null;
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

  function box(cls, r) {
    const el = document.createElement('div');
    el.className = cls;
    Object.assign(el.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
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

  const clearDemo = () => { layer.innerHTML = ''; };

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

  // Tap the right word; a copy of it flies up to its blank (as in the game).
  async function placeLoop(tok) {
    try {
      while (true) {
        const m = nextMove();
        if (!m) return;
        const from = centre(m.from); const to = centre(m.to);
        const hand = make('tour-hand', { x: from.x + 70, y: from.y + 60 }, HAND);
        slide(hand, { x: from.x + 70, y: from.y + 60 }, from, 600);
        await wait(650, tok);
        hand.classList.add('is-press');
        ripple(from);
        await wait(220, tok);
        hand.classList.remove('is-press');
        const ghost = make('tour-ghost', from, m.tile.word.text);
        ghost.style.width = `${m.from.width}px`;
        ghost.style.height = `${m.from.height}px`;
        ghost.style.fontSize = `${m.from.height * 0.5}px`;
        slide(ghost, from, to, 900);
        await wait(1000, tok);
        ghost.classList.add('is-settle');
        await wait(1100, tok);
        layer.innerHTML = '';
        await wait(400, tok);
      }
    } catch (e) { /* step changed */ }
  }

  // Outline each tile in turn.
  async function outlineLoop(tok, getRects, cls) {
    try {
      while (true) {
        const rects = getRects().filter(Boolean);
        if (!rects.length) return;
        for (const r of rects) {
          const b = box(cls, r);
          await wait(450, tok);
          b.remove();
          await wait(80, tok);
        }
        await wait(1100, tok);
      }
    } catch (e) { /* step changed */ }
  }

  // Tap a wrong word: it flashes red.
  async function wrongLoop(tok) {
    try {
      while (true) {
        const r = wrongTile();
        if (!r) return;
        const p = centre(r);
        const hand = make('tour-hand', { x: p.x + 70, y: p.y + 60 }, HAND);
        slide(hand, { x: p.x + 70, y: p.y + 60 }, p, 600);
        await wait(650, tok);
        hand.classList.add('is-press');
        ripple(p);
        await wait(220, tok);
        hand.classList.remove('is-press');
        const b = box('tour-box is-wrong', r);
        await wait(1300, tok);
        b.remove();
        layer.innerHTML = '';
        await wait(500, tok);
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- the steps ---------- */

  const STEPS = [
    {
      title: 'વાક્યનું ખાનું',
      text: 'આ ખાનામાં વાક્ય બનશે. દરેક લીટી પર વાક્યનો એક શબ્દ આવશે.',
      when: playing,
      target: sentenceRect,
      anim: null
    },
    {
      title: 'શબ્દો',
      text: 'નીચે વાક્યના શબ્દો આડાઅવળા ક્રમમાં આપેલા છે. દરેક શબ્દ ધ્યાનથી વાંચો.',
      when: tilesShown,
      target: () => union(tileRects()),
      anim: (tok) => outlineLoop(tok, tileRects, 'tour-box')
    },
    {
      title: 'ક્રમમાં ટેપ કરો',
      text: 'પહેલાં વાક્યનો પહેલો શબ્દ ટેપ કરો, પછી બીજો, એમ ક્રમમાં. ટેપ કરેલો શબ્દ જાતે ઉપરના ખાનામાં ગોઠવાશે.',
      when: tilesShown,
      target: () => union([sentenceRect(), ...tileRects()]),
      anim: (tok) => placeLoop(tok)
    },
    {
      title: 'ખોટો શબ્દ?',
      text: 'ખોટા ક્રમનો શબ્દ ટેપ કરશો તો તે <b>લાલ</b> થઈ જશે અને ત્યાં જ રહેશે. વિચારીને બીજો શબ્દ ટેપ કરો.',
      when: tilesShown,
      target: () => union(tileRects()),
      anim: (tok) => wrongLoop(tok)
    },
    {
      title: 'સાચો જવાબ',
      text: 'વાક્ય ન બને તો <b>સાચો જવાબ</b> દબાવો. સાચું વાક્ય બતાવાશે.',
      when: playing,
      target: () => elRect($('#show-example-btn')),
      anim: (tok) => tapLoop(tok, () => [elRect($('#show-example-btn')) && centre(elRect($('#show-example-btn')))])
    },
    {
      title: 'પછીનું વાક્ય',
      text: 'વાક્ય પૂરું થાય પછી <b>પછીનું વાક્ય</b> દબાવો.',
      when: playing,
      target: () => elRect($('#next-btn')),
      anim: (tok) => tapLoop(tok, () => [elRect($('#next-btn')) && centre(elRect($('#next-btn')))])
    },
    {
      title: 'કેટલાં વાક્યો થયાં?',
      text: 'અહીં દેખાય છે કે કેટલાં વાક્યો પૂરાં થયાં અને કુલ કેટલાં વાક્યો છે.',
      target: progressRect,
      anim: null
    },
    {
      title: 'ફરી રમો',
      text: 'બધાં વાક્યો પૂરાં થઈ ગયાં. શરૂઆતથી ફરી રમવા માટે <b>ફરી રમો</b> દબાવો.',
      when: () => !playing(),
      target: () => elRect($('#next-btn')),
      anim: (tok) => tapLoop(tok, () => [elRect($('#next-btn')) && centre(elRect($('#next-btn')))])
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
    $('#tourCount').textContent = `પગલું ${gu(index + 1)} / ${gu(steps.length)}`;
    $('#tourTitle').textContent = step.title;
    $('#tourText').innerHTML = step.text;
    $('#tourBack').hidden = index === 0;
    $('#tourNext').textContent = index === steps.length - 1 ? 'રમવાનું શરૂ કરો' : 'આગળ';
    $('#tourDots').innerHTML = steps.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeCard(rect);
    if (step.anim && rect) step.anim(tok);
  }

  function open() {
    // Only the steps that fit what is on screen now (e.g. no tile steps
    // once the sentence is complete; just the counter and Replay at the end).
    steps = STEPS.filter((s) => (!s.when || s.when()) && s.target());
    if (!steps.length) return;
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

  helpBtn.addEventListener('click', open);
}());
