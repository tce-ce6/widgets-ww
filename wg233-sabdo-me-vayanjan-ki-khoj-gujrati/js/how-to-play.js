/* ==========================================================================
   How to play (મદદ): a guided tour of the activity, same idea as wg202/wg231.
   The મદદ button opens a spotlight tour with short steps and an animated
   hand showing the drag / tap. Works in viewport coordinates, so it is
   independent of how the 1920x1080 stage is scaled.
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
  const shown = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  // Box around the visible elements, kept inside the window.
  function unionRect(els) {
    const list = els.filter(shown);
    if (!list.length) return null;
    let l = 1e9; let t = 1e9; let r = -1e9; let b = -1e9;
    list.forEach((el) => {
      const x = el.getBoundingClientRect();
      l = Math.min(l, x.left); t = Math.min(t, x.top); r = Math.max(r, x.right); b = Math.max(b, x.bottom);
    });
    l = Math.max(l, 0); t = Math.max(t, 0);
    r = Math.min(r, innerWidth); b = Math.min(b, innerHeight);
    if (l >= r || t >= b) return null;
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
    $$('.tour-pop, .tour-lift').forEach((el) => el.classList.remove('tour-pop', 'tour-lift'));
    $$('.board.wrong').forEach((el) => el.classList.remove('wrong')); // left by wrongLoop if the step changed mid-flash
  }

  /* ---------- the game's pieces ---------- */

  const chips = () => $$('#chips .chip');
  const boards = () => $$('.board');
  const boardFor = (chip) => boards().find((b) => b.dataset.key === chip.dataset.key);
  // The white face of a board (where the words go), not the whole easel.
  const boardFace = (board) => board && board.querySelector('.board-outline');

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

  // Briefly highlight each element in turn (uses the game's own highlight look).
  async function popLoop(tok, getEls) {
    try {
      while (true) {
        const els = getEls();
        if (!els.length) return;
        for (const el of els) {
          el.classList.add('tour-pop');
          await wait(450, tok);
          el.classList.remove('tour-pop');
          await wait(80, tok);
        }
        await wait(1100, tok);
      }
    } catch (e) { /* step changed */ }
  }

  // Press on a word cloud, carry a copy of it to its board, let go.
  async function dragLoop(tok) {
    try {
      while (true) {
        const chip = chips()[0];
        const board = chip && boardFace(boardFor(chip));
        if (!chip || !board) return;
        const from = centre(chip); const to = centre(board);
        const hand = make('tour-hand', { x: from.x + 60, y: from.y + 50 }, HAND);
        slide(hand, { x: from.x + 60, y: from.y + 50 }, from, 500);
        await wait(560, tok);
        hand.classList.add('is-press');
        ripple(from);
        chip.classList.add('tour-lift');
        const ghost = make('tour-ghost', from, chip.dataset.word);
        await wait(250, tok);
        slide(ghost, from, to, 1300);
        slide(hand, from, to, 1300);
        await wait(1380, tok);
        ghost.classList.add('is-settle');
        hand.classList.remove('is-press');
        ripple(to);
        await wait(900, tok);
        layer.innerHTML = '';
        chip.classList.remove('tour-lift');
        await wait(600, tok);
      }
    } catch (e) { /* step changed */ }
  }

  // Drop on the wrong board: it flashes red and shakes (the game's own feedback).
  async function wrongLoop(tok) {
    try {
      while (true) {
        const chip = chips()[0];
        const wrong = chip && boards().find((b) => b.dataset.key !== chip.dataset.key);
        if (!chip || !wrong) return;
        const p = centre(boardFace(wrong));
        const hand = make('tour-hand', { x: p.x + 70, y: p.y + 60 }, HAND);
        slide(hand, { x: p.x + 70, y: p.y + 60 }, p, 600);
        await wait(650, tok);
        hand.classList.add('is-press');
        ripple(p);
        wrong.classList.add('wrong');
        await wait(600, tok);
        wrong.classList.remove('wrong');
        hand.classList.remove('is-press');
        await wait(900, tok);
        layer.innerHTML = '';
        await wait(500, tok);
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- the steps ---------- */

  const STEPS = [
    {
      title: 'શબ્દોનાં વાદળ',
      text: 'ઉપરનાં વાદળોમાં શબ્દો છે. દરેક શબ્દમાં <b>શ્ર</b>, <b>ક્ષ</b> કે <b>જ્ઞ</b> માંથી એક જોડાક્ષર છુપાયેલો છે.',
      target: () => unionRect(chips()),
      anim: (tok) => popLoop(tok, chips)
    },
    {
      title: 'ત્રણ ખાનાં',
      text: 'નીચે <b>શ્ર</b>, <b>ક્ષ</b> અને <b>જ્ઞ</b> નાં ત્રણ ખાનાં છે. દરેક શબ્દ તેના જોડાક્ષરના ખાનામાં જાય.',
      target: () => unionRect(boards()),
      anim: (tok) => popLoop(tok, boards)
    },
    {
      title: 'ખેંચીને મૂકો',
      text: 'શબ્દ પર આંગળી કે માઉસ દબાવી રાખો અને તેને સાચા ખાના સુધી ખેંચી જઈને છોડી દો.',
      target: () => unionRect([...chips(), ...boards()]),
      anim: (tok) => dragLoop(tok)
    },
    {
      title: 'ટેપ કરીને પણ',
      text: 'ખેંચવું ન ફાવે તો પહેલાં શબ્દ પર ટેપ કરો, પછી સાચા ખાના પર ટેપ કરો.',
      target: () => unionRect([...chips(), ...boards()]),
      anim: (tok) => tapLoop(tok, () => {
        const chip = chips()[0];
        const board = chip && boardFace(boardFor(chip));
        return chip && board ? [centre(chip), centre(board)] : [];
      })
    },
    {
      title: 'ખોટું ખાનું?',
      text: 'ખોટા ખાનામાં મૂકશો તો ખાનું <b>લાલ</b> થઈને હલશે અને શબ્દ પાછો ઉપર જશે. શબ્દ ફરી ધ્યાનથી જુઓ.',
      target: () => (chips().length ? unionRect(boards()) : null),
      anim: (tok) => wrongLoop(tok)
    },
    {
      title: 'સાચો જવાબ',
      text: 'ખબર ન પડે તો <b>સાચો જવાબ</b> દબાવો. બધા શબ્દો સાચા ખાનામાં ગોઠવાઈ જશે.',
      playOnly: true,
      target: () => unionRect([$('#show-btn')]),
      anim: (tok) => tapLoop(tok, () => [centre($('#show-btn'))])
    },
    {
      title: 'પછીનો રાઉન્ડ',
      text: 'રાઉન્ડના બધા શબ્દો ગોઠવાઈ જાય પછી <b>પછીનો રાઉન્ડ</b> દબાવો.',
      playOnly: true,
      target: () => unionRect([$('#next-btn')]),
      anim: (tok) => tapLoop(tok, () => [centre($('#next-btn'))])
    },
    {
      title: 'કેટલું થયું?',
      text: 'અહીં રાઉન્ડ અને કેટલા શબ્દો ગોઠવાયા તે દેખાય છે.',
      target: () => unionRect([$('#progress')]),
      anim: null
    },
    {
      title: 'ફરી રમો',
      text: 'શરૂઆતથી ફરી રમવા માટે <b>ફરી રમો</b> દબાવો.',
      target: () => unionRect([$('#replay-btn')]),
      anim: (tok) => tapLoop(tok, () => [centre($('#replay-btn'))])
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
    // After the last round only Replay works: skip the word, Correct answer
    // and Next round steps. Steps whose pieces are not on screen drop out too.
    const ended = !$('#end-banner').classList.contains('hidden');
    steps = STEPS.filter((s) => !(ended && s.playOnly) && s.target());
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

  /* ---------- the મદદ button (already in the design) ---------- */

  helpBtn.setAttribute('aria-label', 'મદદ');
  helpBtn.addEventListener('click', open);
  helpBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
}());
