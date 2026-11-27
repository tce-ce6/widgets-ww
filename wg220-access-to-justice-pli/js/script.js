'use strict';

/* ==========================================================================
   wg220 — Access to Justice: PIL  (widget logic)

   Flow (reference/Access to Justice_ PIL (1).html + layout.svg artboards):
     s1  Before PIL: 40,000 undertrial prisoners             (layout scr_01)
     s2  Who could speak for them? Try the 3 options; each   (layout scr_02)
         plays a scene: prisoner / family member / citizen
         walks toward the court and is turned away.
     s3  "PIL arrives" (auto-advances)                       (layout Scr_03)
     s4  After PIL: the lawyer reaches the court, "YES!"     (layout Scr_04)
     s5  Build the petition (2 fields), file it, and watch   (layout Scr_05/05a)
         how many of the 40 cells (x1,000 prisoners) go free.
         The petition actually filed (B + A) earns confetti
         and the way on to s6.
     s6  Five statements: tap the box to see if each is right (layout Scr_06)
   ========================================================================== */

(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const srEl = $('#sr');
  const announce = (t) => { srEl.textContent = ''; setTimeout(() => { srEl.textContent = t; }, 30); };

  function mk(name, attrs, parent) {
    const e = document.createElementNS(SVGNS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // ---------------------------------------------------------------------
  // Content (from the reference prototype)
  // ---------------------------------------------------------------------
  const OPTIONS = {
    // scene: which Lottie; feedbackAt: frame where the outcome is clear
    1: { scene: 'scene1', feedbackAt: 200, fb: 'A prisoner inside a cell had no money to hire a lawyer and no way to reach the court on their own.' },
    2: { scene: 'scene3', feedbackAt: 240, fb: 'A family member could try. But without legal standing the court would not hear them.' },
    3: { scene: 'scene2', feedbackAt: 240, fb: 'A concerned citizen had no personal stake. The court would not hear someone who was not directly affected.' }
  };

  const COMBINATIONS = {
    AA: {
      freed: 8, counter: '32,000',
      order: '"Prisoners in the visited states who have been held beyond the maximum sentence for their alleged crime shall be released immediately."',
      outcome: 'Some prisoners in the visited states walked free. But thousands across India never heard about this petition.',
      possible: 'She could speak — but only for the prisoners she had seen herself.'
    },
    AB: {
      freed: 5, counter: '35,000',
      order: '"All undertrial cases in the visited states shall be reviewed. Prisoners held longer than their maximum sentence shall be released upon review."',
      outcome: 'Reviews began in the visited states. But they took time. And the rest of India was never reached.',
      possible: 'She could speak — but a slow review meant fewer prisoners were reached in time.'
    },
    BA: {
      freed: 36, counter: '4,000',
      order: '"Prisoners across India who have been held beyond the maximum sentence for their alleged crime shall be released immediately."',
      outcome: 'The petition reached every state. Most prisoners walked free. But some states were slow to act — a few prisoners remained inside.',
      possible: 'She could speak for every prisoner in India. Not just the ones she had met.',
      extra: 'This is what Pushpa Kapila Hingorani actually asked for. This is what the court ordered. This became one of the most important PIL cases in Indian history.',
      celebrate: true
    },
    BB: {
      freed: 30, counter: '10,000',
      order: '"All undertrial cases across India shall be reviewed. Prisoners held longer than their maximum sentence shall be released upon review."',
      outcome: 'Every state reviewed every case. Many walked free. But the process was slow — some prisoners remained inside far longer than they should have.',
      possible: 'She could speak for all of India. Every prisoner was within reach of this petition.'
    }
  };

  // Screen 6, in the layout's order (y of each row)
  const STATEMENTS = [
    { y: 224, text: 'Before PIL only the person directly affected could approach the court.', correct: true },
    { y: 358, text: 'PIL allows any citizen to approach the Supreme Court or a High Court for a public cause.', correct: true },
    { y: 492, text: 'Pushpa Kapila Hingorani was a prisoner who filed a PIL for herself.', correct: false },
    { y: 625, text: 'The scope of a petition determines who receives justice.', correct: true },
    { y: 759, text: 'PIL can be filed only by lawyers.', correct: false }
  ];

  // ---------------------------------------------------------------------
  // Drawing helpers: cards and pill buttons (layout geometry in data-*)
  // ---------------------------------------------------------------------
  // Note card like the layout's: off-white sheet, yellow tape, cyan margin dots.
  function buildCard(g) {
    const [x, y, w, h] = g.dataset.card.split(' ').map(Number);
    mk('rect', { class: 'card-sheet', x, y: y + 30, width: w, height: h - 30 }, g);
    const tw = 160, tx = x + w / 2 - tw / 2;
    mk('path', { class: 'card-tape', d: `M${tx},${y + 8} L${tx + tw},${y + 4} L${tx + tw - 4},${y + 54} L${tx + 4},${y + 58} Z` }, g);
    for (let dy = y + 95; dy < y + h - 20; dy += 70) mk('circle', { class: 'card-dot', cx: x + 30, cy: dy, r: 9 }, g);
  }

  function buildButton(g) {
    const [x, y, w, h] = g.dataset.btn.split(' ').map(Number);
    const label = g.querySelector('text');
    g.insertBefore(mk('rect', { x, y, width: w, height: h, rx: h / 2 }), label);
    label.setAttribute('x', x + w / 2);
    label.setAttribute('y', y + h / 2 + 12);
    g.setAttribute('aria-label', label.textContent);
  }

  $$('.card').forEach(buildCard);
  $$('.svg-btn').forEach(buildButton);

  function onActivate(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    });
  }

  // ---------------------------------------------------------------------
  // Lottie scenes (with their sounds)
  // ---------------------------------------------------------------------
  const clone = (d) => JSON.parse(JSON.stringify(d));

  // Audio layers -> {frame, src}; the layers are removed from the data.
  function splitAudio(data) {
    const assets = new Map((data.assets || []).map((a) => [a.id, a]));
    const sounds = [];
    data.layers = data.layers.filter((l) => {
      if (l.ty !== 6) return true;
      const a = assets.get(l.refId);
      if (a && a.p) sounds.push({ frame: l.ip, src: a.p });
      return false;
    });
    return sounds;
  }

  let muted = false; // reserved; sounds play with the scene
  const audioCache = new Map();
  // Returns the playing element so the scene can stop it (footsteps last a few seconds).
  function playSound(src) {
    if (muted) return null;
    try {
      let base = audioCache.get(src);
      if (!base) { base = new Audio(src); audioCache.set(src, base); }
      const a = base.cloneNode();
      a.play().catch(() => {});
      return a;
    } catch (e) { return null; /* sound is optional */ }
  }

  // One player per scene container.
  const players = new Map();
  function playScene(containerId, key, opts = {}) {
    stopScene(containerId);
    const data = clone(window.LOTTIE_DATA[key]);
    const sounds = splitAudio(data);
    const anim = lottie.loadAnimation({
      container: document.getElementById(containerId),
      renderer: 'svg', loop: false, autoplay: false, animationData: data
    });
    const p = { anim, sounds, last: -1, done: false, playing: [] };
    players.set(containerId, p);

    const fire = (f) => {
      p.sounds.forEach((s) => {
        if (s.frame > p.last && s.frame <= f) { const a = playSound(s.src); if (a) p.playing.push(a); }
      });
      if (opts.at && !p.atFired && f >= opts.at.frame) { p.atFired = true; opts.at.fn(); }
      p.last = f;
    };
    anim.addEventListener('enterFrame', () => fire(anim.currentFrame));
    anim.addEventListener('complete', () => {
      if (opts.at && !p.atFired) { p.atFired = true; opts.at.fn(); }
      if (opts.onDone) opts.onDone();
    });
    anim.addEventListener('DOMLoaded', () => {
      if (opts.still) { anim.goToAndStop(opts.still, true); return; }
      if (reduced()) {
        anim.goToAndStop(anim.totalFrames - 1, true);
        if (opts.at) opts.at.fn();
        if (opts.onDone) opts.onDone();
        return;
      }
      anim.play();
    });
    return p;
  }

  function stopScene(containerId) {
    const p = players.get(containerId);
    if (p) {
      p.playing.forEach((a) => { a.pause(); a.currentTime = 0; }); // no footsteps after the scene is gone
      p.anim.destroy();
      players.delete(containerId);
    }
    const box = document.getElementById(containerId);
    if (box) box.innerHTML = '';
  }

  function stopAllScenes() {
    [...players.keys()].forEach(stopScene);
  }

  // ---------------------------------------------------------------------
  // Screens
  // ---------------------------------------------------------------------
  let s3Timer = 0;

  function go(id) {
    stopAllScenes();
    clearTimeout(s3Timer);
    hideConfetti();
    $$('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
    if (id === 's2') enterS2();
    if (id === 's3') enterS3();
    if (id === 's4') enterS4();
    if (id === 's5') enterS5();
    if (id === 's6') enterS6();
    const first = $(`#${id} [role="button"]:not(.inactive):not(.is-disabled):not(.hidden)`);
    if (first && document.activeElement && document.activeElement !== document.body) first.focus({ preventScroll: true });
  }

  $$('[data-go]').forEach((b) => onActivate(b, () => go(b.dataset.go)));

  // ---- s2 -------------------------------------------------------------
  let s2 = { done: [false, false, false], current: 1 };

  function renderOptions() {
    $$('#s2 .option').forEach((o) => {
      const n = +o.dataset.opt;
      o.classList.toggle('explored', s2.done[n - 1]);
      o.classList.toggle('active', n === s2.current && !s2.done[n - 1]);
      o.classList.toggle('inactive', n !== s2.current && !s2.done[n - 1]);
      o.setAttribute('aria-disabled', n === s2.current && !s2.done[n - 1] ? 'false' : 'true');
    });
  }

  function enterS2() {
    s2 = { done: [false, false, false], current: 1, playing: null };
    $('#s2-feedback').textContent = '';
    $('#s2-done').classList.add('hidden');
    renderOptions();
    // jail + court, nobody on the road yet
    playScene('s2-scene', 'scene1', { still: 1 });
  }

  function pickOption(n) {
    if (n !== s2.current || s2.done[n - 1] || s2.playing) return;
    const opt = OPTIONS[n];
    s2.playing = n;
    $(`#s2 .option[data-opt="${n}"]`).classList.add('playing');
    $('#s2-feedback').textContent = '';
    playScene('s2-scene', opt.scene, {
      at: {
        frame: opt.feedbackAt,
        fn: () => {
          s2.playing = null;
          $(`#s2 .option[data-opt="${n}"]`).classList.remove('playing');
          s2.done[n - 1] = true;
          $('#s2-feedback').textContent = opt.fb;
          announce(opt.fb);
          if (n < 3) s2.current = n + 1;
          renderOptions();
          if (s2.done.every(Boolean)) $('#s2-done').classList.remove('hidden');
        }
      }
    });
  }

  $$('#s2 .option').forEach((o) => onActivate(o, () => pickOption(+o.dataset.opt)));

  // ---- s3 -------------------------------------------------------------
  function enterS3() {
    const pil = $('#s3-pil');
    pil.classList.remove('go');
    void pil.getBBox();
    pil.classList.add('go');
    s3Timer = setTimeout(() => go('s4'), reduced() ? 1500 : 3500);
  }

  // ---- s4 -------------------------------------------------------------
  function enterS4() {
    playScene('s4-scene', 'scene4');
  }

  // ---- s5 -------------------------------------------------------------
  const CELLS = 40;
  const CELL = { x0: 272, y0: 191, dx: 92.75, dy: 92.4, size: 83 };
  let pick = { 1: null, 2: null };
  let freeTimer = 0;

  function buildGrid() {
    const grid = $('#cell-grid');
    grid.textContent = '';
    for (let i = 0; i < CELLS; i++) {
      const x = CELL.x0 + (i % 5) * CELL.dx, y = CELL.y0 + Math.floor(i / 5) * CELL.dy;
      const g = mk('g', { 'data-cell': i }, grid);
      mk('image', { href: './assets/images/scene5-prisoner-graphic.svg', x, y, width: CELL.size, height: CELL.size }, g);
    }
  }

  function freeCell(i) {
    const g = $(`#cell-grid [data-cell="${i}"]`);
    if (!g) return;
    const img = g.querySelector('image');
    const x = +img.getAttribute('x'), y = +img.getAttribute('y');
    g.textContent = '';
    mk('image', { class: 'cell-tick', href: './assets/images/scene5-tick-mark.svg', x, y, width: CELL.size, height: CELL.size }, g);
  }

  function enterS5() {
    clearInterval(freeTimer);
    pick = { 1: null, 2: null };
    buildGrid();
    $('#cell-counter').textContent = '40,000';
    $('#cell-label').textContent = 'People in Indian jails whose trials have not yet begun.';
    $('#s5-form').classList.remove('hidden');
    $('#s5-result').classList.add('hidden');
    renderFields();
  }

  function renderFields() {
    $$('#s5 .field').forEach((f) => {
      const on = pick[f.dataset.field] === f.dataset.val;
      f.classList.toggle('selected', on);
      f.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const ready = pick[1] && pick[2];
    $('#file-btn').classList.toggle('is-disabled', !ready);
    $('#file-btn').setAttribute('aria-disabled', ready ? 'false' : 'true');
  }

  $$('#s5 .field').forEach((f) => onActivate(f, () => {
    pick[f.dataset.field] = f.dataset.val;
    renderFields();
  }));

  onActivate($('#file-btn'), () => {
    if (!pick[1] || !pick[2]) return;
    const data = COMBINATIONS[pick[1] + pick[2]];
    $('#s5-form').classList.add('hidden');
    let i = 0;
    const step = () => {
      if (i >= data.freed) {
        clearInterval(freeTimer);
        showResult(data);
        return;
      }
      freeCell(i++);
    };
    if (reduced()) { while (i < data.freed) freeCell(i++); showResult(data); }
    else freeTimer = setInterval(step, 80);
  });

  function showResult(data) {
    $('#cell-counter').textContent = data.counter;
    $('#cell-label').textContent = 'prisoners still waiting';
    $('#r-order').textContent = data.order;
    $('#r-outcome').textContent = data.outcome;
    $('#r-possible').textContent = data.possible;
    $('#r-extra').textContent = data.extra || '';
    $('#r-extra').classList.toggle('hidden', !data.extra);
    $('#learn-btn').classList.toggle('hidden', !data.celebrate);
    // With the extra button the two sit side by side under the panel.
    const again = $('#again-btn');
    const [ax, , aw] = data.celebrate ? [785, 0, 520] : [1077, 0, 482];
    const r = again.querySelector('rect');
    r.setAttribute('x', ax); r.setAttribute('width', aw);
    again.querySelector('text').setAttribute('x', ax + aw / 2);
    $('#s5-result').classList.remove('hidden');
    announce(`${data.counter} prisoners still waiting. ${data.outcome}`);
    if (data.celebrate) showConfetti();
  }

  onActivate($('#again-btn'), () => enterS5());

  // ---- confetti ---------------------------------------------------------
  let confettiAnim = null;
  function showConfetti() {
    if (reduced()) return;
    hideConfetti();
    $('#confetti-layer').classList.remove('hidden');
    confettiAnim = lottie.loadAnimation({
      container: $('#confetti'), renderer: 'svg', loop: false, autoplay: true,
      animationData: clone(window.LOTTIE_DATA.confetti),
      rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
    });
    confettiAnim.addEventListener('complete', hideConfetti);
  }
  function hideConfetti() {
    if (confettiAnim) { confettiAnim.destroy(); confettiAnim = null; }
    $('#confetti').innerHTML = '';
    $('#confetti-layer').classList.add('hidden');
  }

  // ---- s6 -------------------------------------------------------------
  function enterS6() {
    const host = $('#statements');
    host.textContent = '';
    $('#back-btn').classList.add('hidden');
    STATEMENTS.forEach((s) => {
      const g = mk('g', { class: 'statement', role: 'button', tabindex: '0', transform: `translate(608 ${s.y})`, 'aria-label': s.text }, host);
      mk('rect', { class: 'st-bg', width: 762, height: 119 }, g);
      mk('rect', { class: 'st-box', x: 33, y: 31, width: 56, height: 56, rx: 4 }, g);
      const fo = mk('foreignObject', { x: 112, y: 6, width: 630, height: 107 }, g);
      const p = document.createElement('p');
      p.className = 'st-text';
      p.textContent = s.text;
      fo.appendChild(p);
      onActivate(g, () => answer(g, s));
    });
  }

  function answer(g, s) {
    if (g.classList.contains('answered')) return;
    g.classList.add('answered');
    mk('image', {
      href: s.correct ? './assets/images/scene6-tick-mark.svg' : './assets/images/scene6-cross-mark.svg',
      x: 30, y: 28, width: 62, height: 62
    }, g);
    g.setAttribute('aria-label', `${s.text} ${s.correct ? 'Correct.' : 'Not correct.'}`);
    announce(s.correct ? 'Correct.' : 'Not correct.');
    if ($$('#statements .statement.answered').length === STATEMENTS.length) {
      $('#back-btn').classList.remove('hidden');
    }
  }

  onActivate($('#back-btn'), () => go('s1'));

  // ---------------------------------------------------------------------
  go('s1');
})();
