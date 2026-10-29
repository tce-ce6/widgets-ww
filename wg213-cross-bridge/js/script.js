/* ==========================================================================
   पुल बनाओ, पार जाओ! (wg213) - widget logic
   Plain ES6+. Sections:
     1. Content data (from the storyboard data table)
     2. Helpers, stage scaling
     3. Sound (browser Hindi voice for words, synthesised SFX)
     4. Rounds: pieces, drag / tap-tap, bridges, whirlpool, show answer, next
     5. End screen
   ========================================================================== */

// In Electron with nodeIntegration, the UMD build of lottie assigns itself to
// module.exports instead of window.lottie — pick it up from there.
if (
  !window.lottie &&
  typeof module === 'object' &&
  module &&
  module.exports &&
  typeof module.exports.loadAnimation === 'function'
) {
  window.lottie = module.exports;
}

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONTENT DATA
     ------------------------------------------------------------------------ */

  // a = top bridge (girl), b = bottom bridge (boy), x = words for the whirlpool
  const ROUNDS = [
    { a: ['तीर', 'बाण', 'शर', 'इषु'], b: ['धनुष', 'चाप', 'कमान', 'धनु'], x: ['तलवार', 'निशाना'] },
    { a: ['कपड़ा', 'वस्त्र', 'वसन', 'पट'], b: ['गहना', 'आभूषण', 'भूषण', 'अलंकार'], x: ['वचन', 'अँगूठी'] },
    { a: ['कान', 'कर्ण', 'श्रवण', 'श्रोत्र'], b: ['नाक', 'नासिका', 'घ्राण', 'नासा'], x: ['सुनना', 'साँस'] },
    { a: ['शहर', 'नगर', 'पुर', 'नगरी'], b: ['गाँव', 'ग्राम', 'देहात', 'पल्ली'], x: ['सड़क', 'खेत'] },
    { a: ['चाँद', 'चंद्रमा', 'शशि', 'सुधाकर'], b: ['बंदर', 'वानर', 'कपि', 'मर्कट'], x: ['चाँदनी', 'लंगूर'] },
    { a: ['झंडा', 'ध्वज', 'पताका', 'निशान'], b: ['सिपाही', 'सैनिक', 'जवान', 'फ़ौजी'], x: ['डंडा', 'बंदूक'] },
    { a: ['पेड़', 'वृक्ष', 'तरु', 'पादप'], b: ['फूल', 'पुष्प', 'सुमन', 'कुसुम'], x: ['पत्ता', 'कली'] },
    { a: ['शिक्षक', 'गुरु', 'अध्यापक', 'आचार्य'], b: ['विद्यार्थी', 'छात्र', 'शिष्य', 'शिक्षार्थी'], x: ['विद्यालय', 'पढ़ाई'] },
    { a: ['जीभ', 'जिह्वा', 'रसना', 'जबान'], b: ['भौंरा', 'भ्रमर', 'मधुकर', 'मधुप'], x: ['स्वाद', 'मधुमक्खी'] },
    { a: ['कोशिश', 'प्रयास', 'प्रयत्न', 'चेष्टा'], b: ['मदद', 'सहायता', 'सहयोग', 'सहारा'], x: ['मेहनत', 'दान'] },
    { a: ['आग', 'अग्नि', 'पावक', 'अनल'], b: ['समुद्र', 'सागर', 'जलधि', 'रत्नाकर'], x: ['धुआँ', 'लहर'] },
    { a: ['आँसू', 'अश्रु', 'नयनजल', 'नेत्रनीर'], b: ['दुख', 'पीड़ा', 'वेदना', 'व्यथा'], x: ['रोना', 'आँख'] },
    { a: ['साँप', 'सर्प', 'भुजंग', 'उरग'], b: ['बेटा', 'पुत्र', 'तनय', 'सुत'], x: ['केंचुआ', 'सूत'] },
    { a: ['आदर', 'सम्मान', 'इज़्ज़त', 'मान'], b: ['घमंड', 'अहंकार', 'गर्व', 'अभिमान'], x: ['आदत', 'प्रशंसा'] },
    { a: ['डर', 'भय', 'भीति', 'त्रास'], b: ['साहस', 'हिम्मत', 'हौसला', 'बहादुरी'], x: ['डरपोक', 'योद्धा'] }
  ];
  const ITEXT = 'हर शब्द को उसके समान अर्थ वाले पुल में लगाओ। जो शब्द किसी पुल का नहीं, उसे नदी में बहा दो!';

  // stage geometry (px, from the AI layout)
  const CELLS = [[365, 769], [592, 769], [819, 769], [1046, 769], [365, 855], [592, 855], [819, 855], [1046, 855]];
  const PIECE = [214, 68];
  const BRIDGE_X = 174;
  const BRIDGE_TOP = { a: 200, b: 470 };
  const SLOT_X = [484, 813, 1141];
  const SLOT = [264, 83];
  const ZONES = { a: [174, 200, 1574, 205], b: [174, 470, 1574, 205], x: [1431, 788, 428, 292] };
  const WATER_Y = 425; // where the river starts in bg.svg

  /* ------------------------------------------------------------------------
     2. HELPERS, STAGE SCALING
     ------------------------------------------------------------------------ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const stage = $('#stage');
  const modalStage = $('#modal-stage');
  const viewport = $('#viewport');
  const pool = $('#pool');
  const answerBtn = $('#answerBtn');
  const liveRegion = $('#liveRegion');
  const zoneEls = { a: $('#bridgeA'), b: $('#bridgeB'), x: $('#whirl') };
  const riders = { a: $('#riderA'), b: $('#riderB') };
  const slotBoxes = { a: $('#slotsA'), b: $('#slotsB') };

  const timers = new Set();
  function later(fn, ms) {
    const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
  }
  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers.clear();
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function announce(text) {
    liveRegion.textContent = '';
    window.setTimeout(() => { liveRegion.textContent = text; }, 30);
  }

  function restart(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  let stageScale = 1;
  let stageOrigin = [0, 0];

  function fitStage() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / 1920, vh / 1080);
    stageOrigin = [(vw - 1920 * stageScale) / 2, (vh - 1080 * stageScale) / 2];
    const t = `translate(${stageOrigin[0]}px, ${stageOrigin[1]}px) scale(${stageScale})`;
    stage.style.transform = t;
    modalStage.style.transform = t; // modals share the stage's position and scale
    viewport.style.setProperty('--water-y', `${stageOrigin[1] + WATER_Y * stageScale}px`);
  }

  const toStage = (cx, cy) => [(cx - stageOrigin[0]) / stageScale, (cy - stageOrigin[1]) / stageScale];
  const inside = ([x, y], [l, t, w, h]) => x >= l && x <= l + w && y >= t && y <= t + h;

  /* ------------------------------------------------------------------------
     3. SOUND
     ------------------------------------------------------------------------ */

  const Sound = (function () {
    let ctx = null;
    let noise = null;

    function ensure() {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        ctx = new AudioCtx();
        noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }

    function tone(freq, start, duration, type, peak, endFreq) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    }

    function hiss(start, duration, peak, type, from, to) {
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      src.buffer = noise;
      filter.type = type;
      filter.frequency.setValueAtTime(from, start);
      filter.frequency.exponentialRampToValueAtTime(to, start + duration);
      gain.gain.setValueAtTime(peak, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start(start, 0, duration + 0.05);
    }

    function sfx(name) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      if (name === 'correct') { tone(587, t, 0.14, 'triangle', 0.2); tone(880, t + 0.1, 0.26, 'triangle', 0.2); }
      else if (name === 'wrong') { tone(220, t, 0.22, 'triangle', 0.16); tone(160, t + 0.12, 0.3, 'triangle', 0.14); }
      else if (name === 'breaking') { hiss(t, 0.12, 0.6, 'highpass', 3000, 1500); hiss(t + 0.08, 0.35, 0.45, 'lowpass', 900, 120); tone(140, t + 0.3, 0.4, 'sine', 0.2, 60); }
      else if (name === 'flush') { hiss(t, 0.9, 0.35, 'bandpass', 300, 1800); tone(500, t, 0.8, 'sine', 0.08, 160); }
      else if (name === 'crossing') { [0, 0.18, 0.36].forEach((d) => { tone(1568, t + d, 0.2, 'sine', 0.12); tone(1976, t + d + 0.06, 0.2, 'sine', 0.08); }); [523, 659, 784, 1047].forEach((f, i) => tone(f, t + 0.6 + i * 0.12, 0.35, 'triangle', 0.14)); }
      else if (name === 'end') { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * 0.12, 0.45, 'triangle', 0.15)); }
    }

    /** No word recordings were supplied, so words use the browser's Hindi voice. */
    function speak(text, btn) {
      try {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'hi-IN';
        u.rate = 0.85;
        const hindi = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.startsWith('hi'));
        if (hindi) u.voice = hindi;
        if (btn) {
          btn.classList.add('is-playing');
          const done = () => btn.classList.remove('is-playing');
          u.onend = done;
          u.onerror = done;
        }
        window.speechSynthesis.speak(u);
      } catch (e) { /* no speech */ }
    }

    function stop() {
      try { window.speechSynthesis.cancel(); } catch (e) { /* no speech */ }
      $$('.audio-btn.is-playing').forEach((b) => b.classList.remove('is-playing'));
    }

    return { sfx, speak, stop, unlock: ensure };
  }());

  /* ------------------------------------------------------------------------
     4. ROUNDS
     ------------------------------------------------------------------------ */

  const state = {
    r: 0,
    filled: { a: 0, b: 0 },
    handled: 0,
    total: 0,
    mistake: false,
    done: false,
    selected: null,
    clean: 0
  };

  const R = () => ROUNDS[state.r];
  const familyOf = (word) => (R().a.slice(1).includes(word) ? 'a' : R().b.slice(1).includes(word) ? 'b' : 'x');

  function clearSelection() {
    if (state.selected) state.selected.classList.remove('is-selected');
    state.selected = null;
    stage.classList.remove('has-selection');
  }

  function select(piece) {
    if (state.selected === piece) { clearSelection(); return; }
    clearSelection();
    state.selected = piece;
    piece.classList.add('is-selected');
    stage.classList.add('has-selection');
    Sound.speak(piece.dataset.word);
  }

  function load() {
    clearTimers();
    Sound.stop();
    clearSelection();
    const round = R();
    state.filled = { a: 0, b: 0 };
    state.handled = 0;
    state.total = 8;
    state.mistake = false;
    state.done = false;

    $('#exampleCounter').textContent = `उदाहरण ${state.r + 1} / ${ROUNDS.length}`;
    $('#labelA').textContent = round.a[0];
    $('#labelB').textContent = round.b[0];
    ['a', 'b'].forEach((k) => {
      slotBoxes[k].innerHTML = '<span class="slot"></span><span class="slot"></span><span class="slot"></span>';
      const rider = riders[k];
      rider.style.transition = 'none';
      rider.classList.remove('is-crossed', 'is-crossing', 'is-wobbling');
      void rider.offsetWidth;
      rider.style.transition = '';
    });
    answerBtn.disabled = false;
    $('#nextLabel').textContent = state.r < ROUNDS.length - 1 ? 'अगला उदाहरण' : 'परिणाम देखें';

    // the eight words land in random cells every time
    pool.innerHTML = '';
    const words = shuffle([...round.a.slice(1), ...round.b.slice(1), ...round.x]);
    words.forEach((w, i) => {
      const p = document.createElement('span');
      p.className = 'plank piece';
      p.textContent = w;
      p.dataset.word = w;
      p.tabIndex = 0;
      p.setAttribute('role', 'button');
      p.setAttribute('aria-label', `शब्द: ${w}`);
      p.style.left = `${CELLS[i][0]}px`;
      p.style.top = `${CELLS[i][1]}px`;
      p.style.setProperty('--delay', `${-(i * 0.37) % 2.6}s`);
      initDrag(p);
      p.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(p); }
      });
      pool.appendChild(p);
    });

    later(() => Sound.speak(`${round.a[0]} और ${round.b[0]}`), 400);
  }

  // a slot is reserved (data-taken) as soon as a piece starts flying to it
  function nextSlot(k) {
    return $$('.slot', slotBoxes[k]).find((s) => !s.dataset.taken);
  }

  function slotPos(k, slot) {
    const i = $$('.slot', slotBoxes[k]).indexOf(slot);
    return [BRIDGE_X + SLOT_X[i] + (SLOT[0] - PIECE[0]) / 2, BRIDGE_TOP[k] + 111 + (SLOT[1] - PIECE[1]) / 2];
  }

  /** Moves a piece (from wherever it is now) onto a stage point, then calls done. */
  function flyPiece(p, [x, y], done, ms = 450) {
    const from = p.style.transform || 'none';
    const dx = x - parseFloat(p.style.left);
    const dy = y - parseFloat(p.style.top);
    p.classList.add('is-dragging');
    p.dataset.moving = '1';
    const anim = p.animate([{ transform: from }, { transform: `translate(${dx}px, ${dy}px) scale(1.2)` }], { duration: ms, easing: 'ease-in-out', fill: 'forwards' });
    anim.onfinish = () => {
      p.classList.remove('is-dragging');
      delete p.dataset.moving;
      anim.cancel();
      p.style.transform = '';
      done();
    };
  }

  function fillSlot(slot, word) {
    slot.classList.add('is-filled');
    slot.textContent = word;
  }

  function cross(k) {
    const rider = riders[k];
    rider.classList.add('is-crossed', 'is-crossing');
    Sound.sfx('crossing');
    later(() => rider.classList.remove('is-crossing'), 2700);
    announce(`${R()[k][0]} का पुल पूरा हुआ।`);
  }

  function checkDone() {
    if (state.handled === state.total && !state.done) {
      state.done = true;
      answerBtn.disabled = true;
      if (!state.mistake) state.clean++;
    }
  }

  /** Puts a correct word into its bridge. */
  function placeCorrect(p, k) {
    const slot = nextSlot(k);
    const word = p.dataset.word;
    slot.dataset.taken = '1';
    flyPiece(p, slotPos(k, slot), () => {
      p.classList.add('is-gone');
      fillSlot(slot, word);
      state.filled[k]++;
      state.handled++;
      if (state.filled[k] === 3) cross(k);
      checkDone();
    });
  }

  function flush(p) {
    flyPiece(p, [1540, 830], () => {
      restart(p, 'is-flushing');
      later(() => {
        p.classList.remove('is-flushing');
        p.classList.add('is-gone');
        state.handled++;
        checkDone();
      }, 800);
    }, 380);
  }

  function attempt(p, k) {
    if (state.done || p.classList.contains('is-gone') || p.dataset.moving) return;
    clearSelection();
    Sound.unlock();
    const word = p.dataset.word;
    const fam = familyOf(word);

    if (fam === 'x' && k === 'x') {
      // a word that belongs to neither bridge goes down the whirlpool
      Sound.sfx('flush');
      flush(p);
      return;
    }
    if (fam === k) {
      Sound.sfx('correct');
      Sound.speak(word);
      placeCorrect(p, k);
      return;
    }
    state.mistake = true;
    if (fam === 'x') {
      // an outsider fits in for a moment, then breaks and falls back into the river
      const slot = nextSlot(k);
      if (!slot) { Sound.sfx('wrong'); restart(p, 'is-shake'); return; }
      slot.dataset.taken = '1';
      const home = [parseFloat(p.style.left), parseFloat(p.style.top)];
      flyPiece(p, slotPos(k, slot), () => {
        p.classList.add('is-gone');
        fillSlot(slot, word);
        later(() => {
          Sound.sfx('breaking');
          restart(slot, 'is-breaking');
          restart(riders[k], 'is-wobbling');
        }, 350);
        later(() => {
          slot.className = 'slot';
          slot.textContent = '';
          delete slot.dataset.taken;
          riders[k].classList.remove('is-wobbling');
          p.style.left = `${home[0]}px`;
          p.style.top = `${home[1]}px`;
          p.classList.remove('is-gone');
          p.animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: 400 });
        }, 1300);
      });
      return;
    }
    // a bridge word dropped on the other bridge or in the whirlpool
    Sound.sfx('wrong');
    restart(p, 'is-shake');
  }

  function showAnswer() {
    if (state.done) return;
    Sound.unlock();
    clearSelection();
    state.done = true;
    state.mistake = true;
    answerBtn.disabled = true;
    const rest = $$('.piece').filter((p) => !p.classList.contains('is-gone'));
    // bridge words first (one by one), then the outsiders vanish
    const ordered = [...rest.filter((p) => familyOf(p.dataset.word) !== 'x'), ...rest.filter((p) => familyOf(p.dataset.word) === 'x')];
    ordered.forEach((p, i) => later(() => {
      const fam = familyOf(p.dataset.word);
      if (fam === 'x') {
        p.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(.6)' }], { duration: 450, fill: 'forwards' }).onfinish = () => p.classList.add('is-gone');
      } else {
        Sound.sfx('correct');
        placeCorrect(p, fam);
      }
    }, i * 500));
  }

  /* drag a piece to a bridge or the whirlpool; a plain tap selects it */
  function initDrag(p) {
    p.addEventListener('pointerdown', (event) => {
      if (state.done || p.classList.contains('is-gone') || p.classList.contains('is-dragging')) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      Sound.unlock();
      const start = toStage(event.clientX, event.clientY);
      let moved = false;
      let hot = null;
      p.setPointerCapture(event.pointerId);

      const zoneAt = (cx, cy) => {
        const pt = toStage(cx, cy);
        return Object.keys(ZONES).find((k) => inside(pt, ZONES[k])) || null;
      };
      const move = (ev) => {
        const [x, y] = toStage(ev.clientX, ev.clientY);
        if (!moved && Math.hypot(x - start[0], y - start[1]) > 8) {
          moved = true;
          clearSelection();
          p.classList.add('is-dragging');
        }
        if (!moved) return;
        p.style.transform = `translate(${x - start[0]}px, ${y - start[1]}px)`;
        const z = zoneAt(ev.clientX, ev.clientY);
        if (z !== hot) {
          if (hot) zoneEls[hot].classList.remove('is-over');
          if (z) zoneEls[z].classList.add('is-over');
          hot = z;
        }
      };
      const up = (ev) => {
        p.removeEventListener('pointermove', move);
        p.removeEventListener('pointerup', up);
        p.removeEventListener('pointercancel', up);
        if (hot) zoneEls[hot].classList.remove('is-over');
        if (!moved) { select(p); return; }
        p.classList.remove('is-dragging');
        const z = ev.type === 'pointerup' ? zoneAt(ev.clientX, ev.clientY) : null;
        if (z && !(familyOf(p.dataset.word) === z || familyOf(p.dataset.word) === 'x')) {
          // wrong family: back to the river first, then shake
          p.style.transform = '';
          attempt(p, z);
        } else if (z) {
          attempt(p, z);
        } else {
          p.animate([{ transform: p.style.transform }, { transform: 'none' }], { duration: 250, easing: 'ease-out' });
          p.style.transform = '';
        }
      };
      p.addEventListener('pointermove', move);
      p.addEventListener('pointerup', up);
      p.addEventListener('pointercancel', up);
    });
  }

  // tap a selected piece, then tap a bridge or the whirlpool
  Object.entries(zoneEls).forEach(([k, el]) => {
    const go = () => { if (state.selected) attempt(state.selected, k); };
    el.addEventListener('click', go);
    el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(); }
    });
  });

  function next() {
    Sound.unlock();
    if (state.r < ROUNDS.length - 1) {
      state.r++;
      load();
    } else {
      finish();
    }
  }

  /* ------------------------------------------------------------------------
     5. END SCREEN (modal on the body.has-modal backdrop)
     ------------------------------------------------------------------------ */

  function finish() {
    clearTimers();
    Sound.stop();
    const score = `${ROUNDS.length} में से ${state.clean} उदाहरण तुमने खुद, बिना गलती के पूरे किए!`;
    $('#score').textContent = score;
    $('#end').hidden = false;
    document.body.classList.add('has-modal');
    Sound.sfx('end');
    announce(`सब पार पहुँच गए! ${score}`);
    $('#againBtn').focus();
  }

  function restartGame() {
    $('#end').hidden = true;
    document.body.classList.remove('has-modal');
    state.r = 0;
    state.clean = 0;
    load();
  }

  /* ---- boot ---- */

  if (window.lottie && window.ANIM_DATA && window.ANIM_DATA.whirlpool) {
    window.lottie.loadAnimation({
      container: $('#whirlAnim'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: window.ANIM_DATA.whirlpool
    });
  } else {
    $('#whirlAnim').innerHTML = '<img src="assets/svg/whirlpool.svg" alt="" style="width:100%;height:100%">';
  }

  $('#itextAudio').addEventListener('click', (event) => { Sound.unlock(); Sound.speak(ITEXT, event.currentTarget); });
  answerBtn.addEventListener('click', showAnswer);
  $('#nextBtn').addEventListener('click', next);
  $('#againBtn').addEventListener('click', restartGame);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') clearSelection(); });

  fitStage();
  window.addEventListener('resize', fitStage);
  load();
}());
