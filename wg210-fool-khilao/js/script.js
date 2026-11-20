/* ==========================================================================
   फूल खिलाओ (wg210) - widget logic
   Plain ES6+, no dependencies. Sections:
     1. Content data (from the storyboard data table)
     2. Helpers, stage scaling
     3. Sound (voice files, browser voice for butterfly words, synthesised SFX)
     4. Rounds: butterflies, drag / tap, bloom, show answer, next
     5. End screen
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONTENT DATA
     ------------------------------------------------------------------------ */

  // word, the two words with the same meaning, two distracters.
  // Picture and voice files are numbered in this order (word-01 … word-24).
  const ROUNDS = [
    { w: 'पानी', ok: ['जल', 'नीर'], no: ['फल', 'दूध'] },
    { w: 'घर', ok: ['मकान', 'गृह'], no: ['नदी', 'पेड़'] },
    { w: 'माँ', ok: ['माता', 'जननी'], no: ['दादा', 'बहन'] },
    { w: 'आँख', ok: ['नयन', 'नेत्र'], no: ['कान', 'नाक'] },
    { w: 'फूल', ok: ['पुष्प', 'सुमन'], no: ['पत्ता', 'काँटा'] },
    { w: 'सूरज', ok: ['सूर्य', 'रवि'], no: ['चाँद', 'तारा'] },
    { w: 'पैर', ok: ['पाँव', 'पग'], no: ['मुँह', 'हाथ'] },
    { w: 'हाथ', ok: ['हस्त', 'कर'], no: ['सिर', 'पैर'] },
    { w: 'दोस्त', ok: ['मित्र', 'सखा'], no: ['भाई', 'दादी'] },
    { w: 'पक्षी', ok: ['पंछी', 'चिड़िया'], no: ['बिल्ली', 'मछली'] },
    { w: 'पेड़', ok: ['वृक्ष', 'तरु'], no: ['घास', 'पत्थर'] },
    { w: 'बच्चा', ok: ['बालक', 'शिशु'], no: ['दादी', 'बूढ़ा'] },
    { w: 'रात', ok: ['रात्रि', 'निशा'], no: ['सुबह', 'दिन'] },
    { w: 'रास्ता', ok: ['मार्ग', 'पथ'], no: ['पेड़', 'घर'] },
    { w: 'आसमान', ok: ['आकाश', 'गगन'], no: ['पानी', 'धरती'] },
    { w: 'धरती', ok: ['पृथ्वी', 'भूमि'], no: ['आसमान', 'बादल'] },
    { w: 'बादल', ok: ['मेघ', 'घन'], no: ['मिट्टी', 'धूप'] },
    { w: 'हवा', ok: ['पवन', 'वायु'], no: ['रेत', 'पत्थर'] },
    { w: 'चाँद', ok: ['चंद्रमा', 'शशि'], no: ['बादल', 'सूरज'] },
    { w: 'शेर', ok: ['सिंह', 'वनराज'], no: ['बंदर', 'हाथी'] },
    { w: 'हाथी', ok: ['गज', 'हस्ती'], no: ['घोड़ा', 'ऊँट'] },
    { w: 'बंदर', ok: ['वानर', 'कपि'], no: ['हिरन', 'भालू'] },
    { w: 'कमल', ok: ['पंकज', 'जलज'], no: ['पत्ता', 'गुलाब'] },
    { w: 'आदमी', ok: ['मनुष्य', 'मानव'], no: ['जानवर', 'पेड़'] }
  ];

  // butterfly slots (stage px, from the layout): two left of the flower, two right
  const SLOTS = [[726, 284], [666, 579], [1515, 281], [1588, 576]];
  const FLOWER_HEAD = [1229.5, 606];
  const NUM = { 1: 'एक', 2: 'दो' };

  // Butterfly words that have their own recording (in assets/audio). Every other
  // butterfly word is read by the browser's Hindi voice. Add a line here per new file.
  const WORD_AUDIO = {
    'गज': 'gaj.wav',
    'पुष्प': 'pushp.wav'
  };

  /* ------------------------------------------------------------------------
     2. HELPERS, STAGE SCALING
     ------------------------------------------------------------------------ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const stage = $('#stage');
  const viewport = $('#viewport');
  const flower = $('#flower');
  const flies = $('#flies');
  const answerBtn = $('#answerBtn');
  const liveRegion = $('#liveRegion');

  const pad = (n) => String(n).padStart(2, '0');
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

  let stageScale = 1;
  let stageOrigin = [0, 0];
  const HILL_Y = 1000; // where the hill fills the bottom of bg.svg edge to edge

  function fitStage() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / 1920, vh / 1080);
    stageOrigin = [(vw - 1920 * stageScale) / 2, (vh - 1080 * stageScale) / 2];
    const t = `translate(${stageOrigin[0]}px, ${stageOrigin[1]}px) scale(${stageScale})`;
    stage.style.transform = t;
    viewport.style.setProperty('--hill-y', `${stageOrigin[1] + HILL_Y * stageScale}px`);
  }

  const toStage = (clientX, clientY) => [(clientX - stageOrigin[0]) / stageScale, (clientY - stageOrigin[1]) / stageScale];

  /* ------------------------------------------------------------------------
     3. SOUND
     ------------------------------------------------------------------------ */

  const Sound = (function () {
    let ctx = null;
    let voice = new Audio();

    function ensure() {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        ctx = new AudioCtx();
      }
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }

    function tone(freq, start, duration, type, peak) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    }

    function sfx(name) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      if (name === 'correct') { tone(660, t, 0.18, 'triangle', 0.2); tone(880, t + 0.1, 0.3, 'triangle', 0.2); }
      else if (name === 'wrong') { tone(220, t, 0.22, 'triangle', 0.16); tone(165, t + 0.12, 0.3, 'triangle', 0.14); }
      else if (name === 'bloom') { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * 0.1, 0.45, 'sine', 0.15)); }
    }

    function stop() {
      voice.pause();
      try { window.speechSynthesis.cancel(); } catch (e) { /* no speech */ }
      $$('.audio-btn.is-playing').forEach((b) => b.classList.remove('is-playing'));
    }

    /** Plays a voice file; `btn` pulses while it plays. */
    function play(src, btn) {
      stop();
      voice = new Audio(src);
      if (btn) {
        btn.classList.add('is-playing');
        const done = () => btn.classList.remove('is-playing');
        voice.addEventListener('ended', done);
        voice.addEventListener('error', done);
      }
      const p = voice.play();
      if (p && p.catch) p.catch(() => { if (btn) btn.classList.remove('is-playing'); });
    }

    // The voice list loads late in some browsers: look the Hindi voice up again
    // when it arrives, so no word is read by a default English voice.
    let hindiVoice = null;
    const findHindi = () => {
      try {
        hindiVoice = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('hi')) || null;
      } catch (e) { /* no speech */ }
    };
    if ('speechSynthesis' in window) {
      findHindi();
      window.speechSynthesis.addEventListener('voiceschanged', findHindi);
    }

    // Resolves when the last spoken word has finished (or could not be spoken).
    let speechDone = Promise.resolve();

    /** Words with no recording (the butterfly words) use the browser's Hindi voice. */
    function speak(text, delay = 0) {
      speechDone = new Promise((resolve) => {
        try {
          if (!('speechSynthesis' in window)) { resolve(); return; }
          window.setTimeout(() => {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'hi-IN';
            u.rate = 0.85;
            if (!hindiVoice) findHindi();
            if (hindiVoice) u.voice = hindiVoice;
            u.onend = resolve;
            u.onerror = resolve;
            window.speechSynthesis.speak(u);
            window.setTimeout(resolve, 3000); // never wait forever if the browser drops the event
          }, delay);
        } catch (e) { resolve(); }
      });
    }

    /** Plays a butterfly word's own recording (falls back to the browser voice if it fails). */
    function playWord(src, text, delay = 0) {
      speechDone = new Promise((resolve) => {
        window.setTimeout(() => {
          voice.pause();
          voice = new Audio(src);
          voice.addEventListener('ended', resolve);
          voice.addEventListener('error', () => { speak(text); speechDone.then(resolve); });
          const p = voice.play();
          if (p && p.catch) p.catch(() => resolve());
          window.setTimeout(resolve, 4000); // never wait forever if the browser drops the event
        }, delay);
      });
    }

    /** Runs `fn` once the word being spoken has finished. */
    function afterSpeech(fn) {
      speechDone.then(fn);
    }

    return { sfx, play, speak, playWord, afterSpeech, stop, unlock: ensure };
  }());

  /* ------------------------------------------------------------------------
     4. ROUNDS
     ------------------------------------------------------------------------ */

  const state = {
    r: 0,
    found: 0,
    missed: false, // a wrong tap this round
    done: false, // flower fully open (by the learner or by Show Answer)
    showing: false, // Show Answer is on (the button now reads Hide Answer)
    revealed: false, // Show Answer was used this round
    mine: [], // words the learner found themselves this round
    layout: [] // [word, ok, slot index] for this round's butterflies
  };

  const ANSWER_SHOW = 'उत्तर देखें';
  const ANSWER_HIDE = 'उत्तर छिपाएँ';

  // No feedback message is shown on screen; screen readers still hear it.
  function setFeedback(text) {
    if (text) announce(text);
  }

  function renderFound(R) {
    const list = $('#found');
    list.innerHTML = '';
    R.ok.forEach(() => {
      const li = document.createElement('li');
      li.innerHTML = '<span></span><img src="assets/svg/flower-icon.svg" alt="">';
      list.appendChild(li);
    });
  }

  function markFound(word) {
    const li = $$('#found li')[state.found - 1];
    if (!li) return;
    li.classList.add('is-found');
    $('span', li).textContent = word;
  }

  function bloom() {
    flower.classList.remove('is-half', 'is-full');
    if (state.found >= 2) flower.classList.add('is-full');
    else if (state.found === 1) flower.classList.add('is-half');
  }

  function makeFly(word, ok, slot, i) {
    const el = document.createElement('div');
    el.className = 'fly';
    el.dataset.word = word;
    el.dataset.slot = i;
    el.dataset.ok = ok ? '1' : '0';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `तितली: ${word}`);
    el.style.left = `${slot[0]}px`;
    el.style.top = `${slot[1]}px`;
    el.style.setProperty('--delay', `${-i * 0.6}s`);
    el.innerHTML = '<div class="fly__float"><img class="fly__wings" src="assets/svg/butterfly.svg" alt="">' +
      `<span class="fly__tag">${word}</span></div>`;
    initDrag(el);
    el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(el); }
    });
    return el;
  }

  function load() {
    clearTimers();
    Sound.stop();
    const R = ROUNDS[state.r];
    state.found = 0;
    state.missed = false;
    state.done = false;
    state.showing = false;
    state.revealed = false;
    state.mine = [];

    $('#wordText').textContent = R.w;
    const pic = $('#wordPic');
    pic.src = `assets/images/word-${pad(state.r + 1)}.svg`;
    pic.alt = R.w;
    renderFound(R);
    bloom();
    setFeedback('');
    answerBtn.disabled = false;
    answerBtn.textContent = ANSWER_SHOW;
    answerBtn.setAttribute('aria-pressed', 'false');
    // on the last example the same button starts the game again
    $('#nextLabel').textContent = state.r < ROUNDS.length - 1 ? 'अगला उदाहरण' : 'फिर से खेलो';

    // the four words land in random slots every time
    flies.innerHTML = '';
    const words = shuffle([...R.ok.map((w) => [w, true]), ...R.no.map((w) => [w, false])]);
    state.layout = words.map(([w, ok], i) => [w, ok, i]);
    words.forEach(([w, ok], i) => flies.appendChild(makeFly(w, ok, SLOTS[i], i)));
    // the word's audio plays only when the speaker button (#wordAudio) is tapped
  }

  /** Butterfly flies into the flower head and disappears. */
  function flyIn(el, done) {
    const [x, y] = [parseFloat(el.style.left), parseFloat(el.style.top)];
    const t = getComputedStyle(el).transform;
    const dx = FLOWER_HEAD[0] - (x + 105);
    const dy = FLOWER_HEAD[1] - (y + 58);
    el.classList.add('is-flying');
    const anim = el.animate([
      { transform: t === 'none' ? 'translate(0, 0) scale(1)' : t, opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 90}px) scale(.75)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.15)`, opacity: 0 }
    ], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });
    anim.onfinish = () => {
      // skip if Hide Answer already rebuilt the butterflies
      if (!el.isConnected) return;
      el.remove();
      if (done) done();
    };
  }

  function choose(el) {
    if (state.done || el.classList.contains('is-flying')) return;
    Sound.unlock();
    const R = ROUNDS[state.r];
    const word = el.dataset.word;
    if (el.dataset.ok !== '1') {
      Sound.sfx('wrong');
      state.missed = true;
      el.classList.remove('is-shake');
      void el.offsetWidth;
      el.classList.add('is-shake');
      later(() => el.classList.remove('is-shake'), 460);
      setFeedback('');
      return;
    }
    Sound.stop();
    Sound.sfx('correct');
    if (WORD_AUDIO[word]) Sound.playWord(`assets/audio/${WORD_AUDIO[word]}`, word, 150);
    else Sound.speak(word, 150);
    flyIn(el, () => {
      state.found++;
      state.mine.push(word);
      markFound(word);
      bloom();
      if (state.found === R.ok.length) {
        // the chime waits for the last word to be spoken, so it does not play over it
        const round = state.r;
        Sound.afterSpeech(() => { if (state.r === round && state.done) Sound.sfx('bloom'); });
        state.done = true;
        answerBtn.disabled = true;
        $$('.fly').forEach((f) => f.classList.add('is-faded'));
        setFeedback('');
      } else {
        const left = NUM[R.ok.length - state.found];
        setFeedback(`हाँ! ‘${word}’ और ‘${R.w}’ का अर्थ एक ही है। अभी ${left} और ढूँढो।`, 'good');
      }
    });
    el.classList.add('is-flying');
  }

  /** Show Answer / Hide Answer toggle: no feedback text and no audio either way. */
  function toggleAnswer() {
    if (state.showing) hideAnswer();
    else showAnswer();
  }

  function setAnswerBtn(showing) {
    state.showing = showing;
    answerBtn.textContent = showing ? ANSWER_HIDE : ANSWER_SHOW;
    answerBtn.setAttribute('aria-pressed', String(showing));
  }

  function showAnswer() {
    if (state.done) return;
    Sound.stop();
    state.done = true;
    state.revealed = true;
    setAnswerBtn(true);
    setFeedback('');
    $$('.fly').forEach((f) => { if (f.dataset.ok !== '1') f.classList.add('is-faded'); });
    const rest = $$('.fly').filter((f) => f.dataset.ok === '1' && !f.classList.contains('is-flying'));
    rest.forEach((f, i) => later(() => flyIn(f, () => {
      state.found++;
      markFound(f.dataset.word);
      bloom();
    }), i * 650));
    rest.forEach((f) => f.classList.add('is-flying'));
  }

  /** Put the round back the way the learner left it before Show Answer. */
  function hideAnswer() {
    clearTimers();
    Sound.stop();
    const R = ROUNDS[state.r];
    setAnswerBtn(false);
    setFeedback('');
    state.done = false;
    state.found = state.mine.length;
    renderFound(R);
    state.mine.forEach((word, i) => {
      const li = $$('#found li')[i];
      if (!li) return;
      li.classList.add('is-found');
      $('span', li).textContent = word;
    });
    bloom();
    flies.innerHTML = '';
    state.layout
      .filter(([w]) => !state.mine.includes(w))
      .forEach(([w, ok, i]) => flies.appendChild(makeFly(w, ok, SLOTS[i], i)));
  }

  /* drag a butterfly to the flower, or just tap it */
  function initDrag(el) {
    el.addEventListener('pointerdown', (event) => {
      if (state.done || el.classList.contains('is-flying')) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      Sound.unlock();
      const [sx, sy] = toStage(event.clientX, event.clientY);
      let moved = false;
      el.setPointerCapture(event.pointerId);
      el.classList.add('is-dragging');

      const overFlower = (cx, cy) => {
        const [x, y] = toStage(cx, cy);
        return x > 1090 && x < 1370 && y > 430 && y < 980;
      };
      const move = (ev) => {
        const [x, y] = toStage(ev.clientX, ev.clientY);
        const dx = x - sx;
        const dy = y - sy;
        if (!moved && Math.hypot(dx, dy) > 8) moved = true;
        if (!moved) return;
        el.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
        el.style.opacity = '.85';
        flower.classList.toggle('is-over', overFlower(ev.clientX, ev.clientY));
      };
      const up = (ev) => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        el.classList.remove('is-dragging');
        el.style.opacity = '';
        flower.classList.remove('is-over');
        const dropped = moved && ev.type === 'pointerup' && overFlower(ev.clientX, ev.clientY);
        if (!moved || dropped) {
          // a tap, or a drop on the flower: right ones fly in from where they are
          choose(el);
          if (!el.classList.contains('is-flying')) el.style.transform = '';
        } else {
          // dropped elsewhere: glide back
          el.animate([{ transform: el.style.transform }, { transform: 'none' }], { duration: 250, easing: 'ease-out' });
          el.style.transform = '';
        }
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }

  /* अगला उदाहरण goes to the next example; on the last one it reads फिर से खेलो and starts over */
  function next() {
    Sound.unlock();
    state.r = state.r < ROUNDS.length - 1 ? state.r + 1 : 0;
    load();
  }

  /* ---- boot ---- */

  $('#itextAudio').addEventListener('click', (event) => { Sound.unlock(); Sound.play('assets/audio/itext.wav', event.currentTarget); });
  $('#wordAudio').addEventListener('click', (event) => { Sound.unlock(); Sound.play(`assets/audio/word-${pad(state.r + 1)}.wav`, event.currentTarget); });
  answerBtn.addEventListener('click', toggleAnswer);
  $('#nextBtn').addEventListener('click', next);

  fitStage();
  window.addEventListener('resize', fitStage);
  load();
}());
