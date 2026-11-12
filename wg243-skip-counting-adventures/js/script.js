/* Skip Counting Adventures (wg243)
   Put the missing numbers back in the path (stones, wagons, planets or ladder rungs), then watch the
   character cross while the numbers are counted aloud. Game logic follows the reference prototype. */
(function () {
  'use strict';

  const C = window.SKIP_CONTENT;
  const W = C.worlds;
  const TX = C.text;
  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? ms * 0.4 : ms));
  const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const L = { decor: $('decor'), slots: $('slots'), pile: $('pile'), char: $('charLayer'), fx: $('fx'), hops: $('hops') };

  /* ---------- stage scaling ---------- */
  let stageScale = 1;
  let stageOrigin = [0, 0];
  function fitStage() {
    stageScale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stageOrigin = [(window.innerWidth - 1920 * stageScale) / 2, (window.innerHeight - 1080 * stageScale) / 2];
    stage.style.transform = `translate(${stageOrigin[0]}px, ${stageOrigin[1]}px) scale(${stageScale})`;
  }
  function stageRect(el) {
    const r = el.getBoundingClientRect();
    const x = (r.left - stageOrigin[0]) / stageScale;
    const y = (r.top - stageOrigin[1]) / stageScale;
    return { left: x, top: y, right: x + r.width / stageScale, bottom: y + r.height / stageScale };
  }

  /* ---------- sound: short tones, and the numbers read aloud ---------- */
  let ctx = null;
  function ensureAudio() {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { /* no audio */ }
  }
  function tone(freq, dur, type = 'sine', vol = 0.15, when = 0) {
    if (!ctx) return;
    try {
      const t = ctx.currentTime + when;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur);
    } catch (e) { /* ignore */ }
  }
  const sfx = {
    good() { tone(660, 0.15, 'triangle'); tone(880, 0.22, 'triangle', 0.15, 0.12); },
    bad() { tone(180, 0.25, 'sine', 0.2); tone(140, 0.3, 'sine', 0.15, 0.1); },
    hop() { tone(520, 0.08, 'square', 0.05); tone(780, 0.08, 'square', 0.04, 0.05); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', 0.14, i * 0.12)); },
    whistle() { tone(880, 0.5, 'triangle', 0.1); tone(1100, 0.5, 'triangle', 0.08); },
  };
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(String(text)); u.rate = 0.95; u.pitch = 1.15; speechSynthesis.speak(u); } catch (e) { /* ignore */ }
  }

  /* ---------- small DOM helpers ---------- */
  function div(cls, parent) { const d = document.createElement('div'); d.className = cls; if (parent) parent.appendChild(d); return d; }
  function img(cls, src, box, parent) {
    const i = document.createElement('img');
    i.className = cls; i.src = src; i.alt = '';
    Object.assign(i.style, { left: `${box[0]}px`, top: `${box[1]}px`, width: `${box[2]}px`, height: `${box[3]}px` });
    if (parent) parent.appendChild(i);
    return i;
  }
  function label(cls, text, box, parent) {
    const s = document.createElement('span');
    s.className = `lbl ${cls}`; s.textContent = text;
    Object.assign(s.style, { left: `${box[0]}px`, top: `${box[1]}px`, width: `${box[2]}px`, height: `${box[3]}px`, lineHeight: `${box[3]}px` });
    parent.appendChild(s);
    return s;
  }
  // Everything in the scene is placed by an anchor point; setPos moves an element's anchor.
  function setPos(el, x, y) { el.style.transform = `translate(${x}px, ${y}px)`; el._x = x; el._y = y; }
  function tween(el, to, dur, lift = 0) {
    const from = [el._x, el._y];
    if (reduce) dur = Math.min(dur, 200);
    return new Promise((res) => {
      const t0 = performance.now();
      function f(now) {
        const p = Math.min(1, (now - t0) / dur);
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        setPos(el, from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e - Math.sin(Math.PI * p) * lift);
        if (p < 1) requestAnimationFrame(f); else res();
      }
      requestAnimationFrame(f);
    });
  }
  async function shake(el) {
    const x = el._x; const y = el._y;
    for (const dx of [-9, 9, -7, 7, -4, 0]) { setPos(el, x + dx, y); await wait(45); }
  }

  /* ---------- the pieces of each world (drawn around their anchor) ---------- */
  const planetFor = (v) => C.planets[v % C.planets.length];
  function drawPiece(world, v, where) {
    const g = div('pc');
    if (world === 'islands') {
      if (where === 'pile') { img('art', 'assets/svg/stone-pile.svg', [-57.8, -29.5, 113.5, 57], g); }
      else img('art', 'assets/svg/stone.svg', [-72.9, -29.5, 145.8, 61.8], g);
      label('lbl--stone', v, [-40, -19, 80, 38], g);
    } else if (world === 'train') {
      img('art', 'assets/svg/wagon.svg', [-77.5, -56.8, 176.2, 160.6], g);
      label('lbl--box', v, [-58, -23.5, 116, 47], g);
    } else if (world === 'space') {
      const p = planetFor(v);
      img('art', p.src, [p.dx, p.dy, p.w, p.h], g);
      label('lbl--circle', v, [-29.5, -29.5, 59, 59], g);
    } else {
      img('art', 'assets/svg/rung.svg', [-127, -26, 253.7, 51.7], g);
      label('lbl--rung', v, [-58, -19, 116, 38], g);
    }
    return g;
  }
  function drawGap(world) {
    const g = div('pc gap');
    if (world === 'islands') {
      img('art', 'assets/svg/stone-gap.svg', [-72.9, -42.4, 145.8, 74.7], g);
      label('q q--stone', '?', [-30, -48, 60, 61], g);
    } else if (world === 'train') {
      img('art', 'assets/svg/wagon-gap.svg', [-76.2, -56.3, 154.4, 159.8], g);
      label('q q--wagon', '?', [-30, -30, 60, 61], g);
    } else if (world === 'space') {
      img('art', 'assets/svg/planet-gap.svg', [-65, -65, 130, 130], g);
      label('q q--planet', '?', [-30, -20, 60, 40], g);
    } else {
      div('gap-frame', g);
      label('q q--rung', '?', [-58, -19, 116, 38], g);
    }
    return g;
  }

  /* ---------- the jump arcs ---------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, parent) { const e = document.createElementNS(SVGNS, tag); Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k])); parent.appendChild(e); return e; }
  function drawHop(i) {
    const T = W[S.world];
    const [ax, ay] = T.arcFrom;
    const [cx, cy] = T.arcCtrl;
    const a = T.slots[i - 1];
    const b = T.slots[i];
    const p0 = [a[0] + ax, a[1] + ay];
    const p2 = [b[0] + ax, b[1] + ay];
    const c = [(p0[0] + p2[0]) / 2 + cx, (p0[1] + p2[1]) / 2 + cy];
    const g = svg('g', { class: 'hop' }, L.hops);
    svg('path', { d: `M${p0[0]} ${p0[1]} Q${c[0]} ${c[1]} ${p2[0]} ${p2[1]}`, class: 'hop-line' }, g);
    const ang = Math.atan2(p2[1] - c[1], p2[0] - c[0]);
    const hd = (t) => `${p2[0] + Math.cos(ang + t) * 13} ${p2[1] + Math.sin(ang + t) * 13}`;
    svg('path', { d: `M${hd(2.5)} L${p2[0]} ${p2[1]} L${hd(-2.5)}`, class: 'hop-head' }, g);
    const m = [0.25 * p0[0] + 0.5 * c[0] + 0.25 * p2[0], 0.25 * p0[1] + 0.5 * c[1] + 0.25 * p2[1]];
    svg('rect', { x: m[0] - 30.5, y: m[1] - 17.5, width: 61, height: 35, rx: 17.5, class: 'hop-pill' }, g);
    const t = svg('text', { x: m[0], y: m[1] + 9, class: 'hop-text' }, g);
    t.textContent = (dir === 'up' ? '+' : '−') + S.step;
  }

  /* ---------- state ---------- */
  let world = 'islands';
  let dir = 'up';
  let S = null;
  let lastStep = null;
  let round = 0;
  const stars = { islands: 0, train: 0, space: 0, jungle: 0 };
  let tourOpen = false;

  const ruleText = () => TX.rule(dir === 'up', S.step);
  function say(text, kind) {
    const m = $('msg');
    m.textContent = text;
    m.className = `msg msg--${kind || 'info'}`;
    const T = W[world];
    m.style.top = `${kind && kind !== 'info' ? T.msgTop : T.instrTop}px`;
  }
  function burst() {
    if (reduce) return;
    const T = W[world];
    const c = img('confetti', 'assets/svg/confetti.svg', [722, T.msgTop - 233, 475, 282.4], L.fx);
    setTimeout(() => c.remove(), 1400);
  }

  function makeSequence(s) {
    const maxStart = 100 - 5 * s;
    const start = randInt(1, Math.min(maxStart, s === 10 ? 50 : 40));
    const seq = [0, 1, 2, 3, 4, 5].map((i) => start + i * s);
    return dir === 'down' ? seq.reverse() : seq;
  }
  function makeDistractors(seq, vals, s) {
    const set = new Set(seq);
    const c = [];
    vals.forEach((v) => [v + 1, v - 1, v + s + 1, v - s + 1, v + 10, v - 10, v + 2 * s].forEach((x) => {
      if (x >= 0 && x <= 110 && !set.has(x) && !c.includes(x)) c.push(x);
    }));
    return shuffle(c).slice(0, 2);
  }

  function clearScene() {
    Object.keys(L).forEach((k) => { while (L[k].firstChild) L[k].removeChild(L[k].firstChild); });
  }

  function newRound() {
    if (S && S.busy) return;
    const T = W[world];
    const opts = C.steps.filter((x) => x !== lastStep);
    const s = opts[randInt(0, opts.length - 1)];
    lastStep = s;
    const seq = makeSequence(s);
    const nMissing = round < 2 ? 2 : 3;
    const missing = shuffle([2, 3, 4, 5]).slice(0, nMissing).sort((a, b) => a - b);
    S = { world, step: s, seq, missing, filled: new Set(), pieces: [], gaps: {}, pile: [], busy: false, wrong: 0, hint: false, done: false };
    round++;

    clearScene();
    $('sceneBg').src = T.bg;
    $('scene').dataset.world = world;
    const title = $('sceneTitle');
    title.textContent = T.title; title.style.color = T.titleColor; title.style.top = `${T.titleTop}px`;
    Object.assign($('sign').style, { left: `${T.sign[0] - 2}px`, top: `${T.sign[1] - 2}px` });
    $('signText').textContent = ruleText();
    $('hintBtn').textContent = TX.showJumps; $('hintBtn').classList.remove('is-on');
    $('newBtn').textContent = TX.newPattern; $('newBtn').classList.remove('is-next');

    // fixed scenery that belongs to a world
    if (T.engine) S.engine = img('engine', T.engine.src, T.engine.box, L.slots);
    if (T.monkey) {
      S.stump = img('stump', 'assets/svg/stump.svg', T.monkey.stump, L.decor);
      S.monkey = img('monkey', 'assets/svg/monkey.svg', T.monkey.start, L.char);
    }

    T.slots.forEach(([x, y], i) => {
      if (missing.includes(i)) {
        const g = drawGap(world); setPos(g, x, y); L.slots.appendChild(g); S.gaps[i] = g;
      } else {
        const g = drawPiece(world, seq[i], 'slot'); setPos(g, x, y); L.slots.appendChild(g); S.pieces[i] = g;
      }
    });
    for (let i = 1; i < 6; i++) drawHop(i);

    const vals = missing.map((i) => seq[i]);
    shuffle(vals.concat(makeDistractors(seq, vals, s))).forEach((v, k) => {
      const g = drawPiece(world, v, 'pile');
      g.classList.add('pile-piece');
      // the art boxes are larger than the shapes and overlap; taps land on the shape itself
      const hit = div(`hit hit--${world}`, g);
      g.insertBefore(hit, g.firstChild);
      g.tabIndex = 0;
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `${T.pieceName} ${v}`);
      const p = { value: v, g, home: T.pile[k], used: false };
      setPos(g, p.home[0], p.home[1]);
      g.addEventListener('click', () => pick(p));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p); } });
      L.pile.appendChild(g);
      S.pile.push(p);
    });

    if (T.char) {
      const ch = div('char');
      img('char-art', T.char.src, [-T.char.w / 2, -T.char.h, T.char.w, T.char.h], ch);
      setPos(ch, T.char.start[0], T.char.start[1]);
      L.char.appendChild(ch); S.char = ch;
    }
    markActiveGap();
    say(`${ruleText()}. ${T.instr}`);
  }

  const nextGap = () => S.missing.find((i) => !S.filled.has(i));
  function markActiveGap() {
    Object.keys(S.gaps).forEach((i) => S.gaps[i].classList.toggle('active', Number(i) === nextGap()));
  }
  function setHints(on) {
    S.hint = on;
    L.hops.classList.toggle('show', on);
    $('hintBtn').textContent = on ? TX.hideJumps : TX.showJumps;
    $('hintBtn').classList.toggle('is-on', on);
  }

  async function pick(p) {
    if (!S || S.busy || S.done || p.used || tourOpen) return;
    const gi = nextGap();
    if (gi === undefined) return;
    ensureAudio();
    S.busy = true;
    L.fx.appendChild(p.g);
    const prev = S.seq[gi - 1];
    const [tx, ty] = W[world].slots[gi];
    await tween(p.g, [tx, ty], 650, 95);

    if (p.value === S.seq[gi]) {
      p.used = true;
      p.g.remove();
      S.gaps[gi].remove(); delete S.gaps[gi];
      const g = drawPiece(world, p.value, 'slot'); setPos(g, tx, ty); g.classList.add('land'); L.slots.appendChild(g); S.pieces[gi] = g;
      S.filled.add(gi); S.wrong = 0;
      sfx.good(); speak(p.value);
      say(TX.yes(p.value, prev), 'good');
      burst();
      markActiveGap();
      if (nextGap() === undefined) { S.busy = false; await finish(); return; }
    } else {
      sfx.bad();
      await shake(p.g);
      S.wrong++;
      const op = dir === 'up' ? '+' : '−';
      say(TX.notQuite(prev, op, S.step), 'bad');
      await wait(200);
      await tween(p.g, p.home, 550, 70);
      L.pile.appendChild(p.g);
      if (S.wrong >= 2 && !S.hint) { setHints(true); say(TX.lookJumps(prev, op, S.step), 'bad'); }
    }
    S.busy = false;
  }

  /* ---------- the character crosses as the numbers are counted ---------- */
  async function countAlong(i) {
    S.pieces[i].classList.add('lit');
    speak(S.seq[i]);
    say(S.seq.slice(0, i + 1).join(', ') + (i < 5 ? ' …' : ''), 'good');
  }
  async function walkFinale() {
    const T = W[world];
    for (let i = 0; i < 6; i++) {
      if (i > 0) L.hops.children[i - 1].classList.add('lit');
      sfx.hop();
      const [x, y] = T.slots[i];
      await tween(S.char, [x + T.char.on[0], y + T.char.on[1]], 480, T.char.lift);
      await countAlong(i);
      await wait(520);
    }
    sfx.hop();
    await tween(S.char, T.char.end, 600, T.char.lift + 20);
    if (T.char.endSrc) {
      const a = S.char.querySelector('.char-art');
      a.src = T.char.endSrc;
      Object.assign(a.style, { left: `${-T.char.endW / 2}px`, top: `${-T.char.endH}px`, width: `${T.char.endW}px`, height: `${T.char.endH}px` });
    }
  }
  async function trainFinale() {
    for (let i = 0; i < 6; i++) {
      if (i > 0) L.hops.children[i - 1].classList.add('lit');
      sfx.hop();
      await countAlong(i);
      await wait(620);
    }
    await wait(300);
    sfx.whistle();
    L.hops.classList.remove('show');
    Array.from(L.hops.children).forEach((h) => h.classList.remove('lit')); // the arcs stay behind as the train leaves
    const parts = [S.engine].concat(S.pieces);
    parts.forEach((el) => { el._x = el._x || 0; el._y = el._y || 0; });
    S.engine._x = 0; S.engine._y = 0;
    await Promise.all(parts.map((el) => tween(el, [el._x + 1250, el._y], 2200)));
  }
  async function jungleFinale() {
    const T = W[world];
    const M = T.monkey;
    S.monkey.remove();
    const ch = div('char');
    img('char-art', 'assets/svg/monkey-climb.svg', [0, 0, M.climb[0], M.climb[1]], ch);
    L.char.appendChild(ch);
    setPos(ch, M.climbX, T.slots[0][1] - 19 + M.climbDy + 60);
    for (let i = 0; i < 6; i++) {
      if (i > 0) L.hops.children[i - 1].classList.add('lit');
      sfx.hop();
      await tween(ch, [M.climbX, T.slots[i][1] - 19 + M.climbDy], 480, 0);
      await countAlong(i);
      await wait(520);
    }
  }

  async function finish() {
    S.busy = true; S.done = true;
    const T = W[world];
    say(T.ready, 'good');
    await wait(600);
    if (world === 'train') await trainFinale();
    else if (world === 'jungle') await jungleFinale();
    else await walkFinale();
    sfx.win();
    if (T.goalStar) {
      const [x, y, w, h] = T.goalStar;
      img('goal-star', 'assets/svg/star.svg', [x, y, w || 95.8, h || 91.7], L.fx);
    }
    burst();
    stars[world] += C.starsPerPattern;
    $('starCount').textContent = stars[world];
    say(`${T.win} ${ruleText()}: ${S.seq.join(', ')}.`, 'win');
    $('newBtn').textContent = TX.nextPattern;
    $('newBtn').classList.add('is-next');
    S.busy = false;
    $('newBtn').focus({ preventScroll: true });
  }

  /* ---------- controls ---------- */
  function chooseWorld(id) {
    if (S && S.busy) return;
    world = id;
    document.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.world === id)));
    $('starCount').textContent = stars[world];
    round = 0;
    ensureAudio(); newRound();
  }
  document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => chooseWorld(b.dataset.world)));
  document.querySelectorAll('.dir-btn').forEach((b) => b.addEventListener('click', () => {
    if (S && S.busy) return;
    dir = b.dataset.dir;
    document.querySelectorAll('.dir-btn').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    round = 0; ensureAudio(); newRound();
  }));
  $('hintBtn').addEventListener('click', () => { if (S && !S.done) setHints(!S.hint); });
  $('newBtn').addEventListener('click', () => { ensureAudio(); newRound(); });

  /* ======================================================================
     How to play: a spotlight with one short sentence per step
     ====================================================================== */
  const tour = { i: 0, lastFocus: null };
  function startTour() {
    tourOpen = true;
    tour.i = 0; tour.lastFocus = document.activeElement;
    document.body.classList.add('has-tour');
    $('tour').hidden = false; showStep();
  }
  function endTour() {
    tourOpen = false;
    $('tour').hidden = true;
    document.body.classList.remove('has-tour');
    if (tour.lastFocus && tour.lastFocus.focus) tour.lastFocus.focus({ preventScroll: true });
  }
  function showStep() {
    const st = C.tour[tour.i];
    $('tourStep').textContent = `Step ${tour.i + 1} of ${C.tour.length}`;
    $('tourText').textContent = st.text;
    $('tourPrev').disabled = tour.i === 0;
    $('tourNext').textContent = tour.i === C.tour.length - 1 ? 'Done' : 'Next';
    requestAnimationFrame(positionTour);
    $('tourNext').focus({ preventScroll: true });
  }
  function positionTour() {
    if ($('tour').hidden) return;
    const root = document.querySelector(C.tour[tour.i].sel);
    const els = [root, ...root.querySelectorAll('*')].filter((e) => e.getClientRects().length && !(e instanceof SVGElement && e !== root));
    const rs = els.map(stageRect).filter((r) => r.right > r.left && r.bottom > r.top);
    const r = { left: Math.min(...rs.map((x) => x.left)), top: Math.min(...rs.map((x) => x.top)), right: Math.max(...rs.map((x) => x.right)), bottom: Math.max(...rs.map((x) => x.bottom)) };
    const pad = 10;
    const spot = $('tourSpot');
    const card = $('tourCard');
    spot.style.left = `${r.left - pad}px`; spot.style.top = `${r.top - pad}px`;
    spot.style.width = `${r.right - r.left + pad * 2}px`; spot.style.height = `${r.bottom - r.top + pad * 2}px`;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    let left = Math.min(Math.max(r.left, 24), 1920 - cw - 24);
    let top;
    if (r.bottom + pad + 20 + ch < 1060) top = r.bottom + pad + 20;
    else if (r.top - pad - 20 - ch > 20) top = r.top - pad - 20 - ch;
    else if (r.right + pad + 20 + cw < 1900) { left = r.right + pad + 20; top = Math.min(Math.max(r.top, 24), 1080 - ch - 24); }
    else { left = Math.max(24, r.left - pad - 20 - cw); top = Math.min(Math.max(r.top, 24), 1080 - ch - 24); }
    card.style.left = `${left}px`; card.style.top = `${top}px`;
  }
  $('helpBtn').addEventListener('click', startTour);
  $('tourNext').addEventListener('click', () => { if (tour.i < C.tour.length - 1) { tour.i++; showStep(); } else endTour(); });
  $('tourPrev').addEventListener('click', () => { if (tour.i > 0) { tour.i--; showStep(); } });
  $('tourSkip').addEventListener('click', endTour);
  document.addEventListener('keydown', (e) => {
    if ($('tour').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); endTour(); }
    if (e.key === 'Tab') {
      const f = [$('tourSkip'), $('tourPrev'), $('tourNext')].filter((b) => !b.disabled);
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  window.addEventListener('resize', () => { fitStage(); positionTour(); });
  fitStage();
  newRound();
}());
