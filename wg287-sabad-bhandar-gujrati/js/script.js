/* ==========================================================================
   ફૂલ ખીલાવો (wg287, Gujarati version of wg210) - widget logic
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
  // From the storyboard data table (gu_gu_03_wg287.docx). Picture and voice
  // files are numbered in this order (word-01 … word-24).
  const ROUNDS = [
    { w: 'પાણી', ok: ['જળ', 'નીર'], no: ['ફળ', 'દૂધ'] },
    { w: 'ઘર', ok: ['મકાન', 'ગૃહ'], no: ['નદી', 'ઝાડ'] },
    { w: 'મા', ok: ['જનની', 'માતા'], no: ['બહેન', 'દાદા'] },
    { w: 'આંખ', ok: ['નયન', 'નેત્ર'], no: ['કાન', 'નાક'] },
    { w: 'મોં', ok: ['મુખ', 'મોઢું'], no: ['નાક', 'પગ'] },
    { w: 'પગ', ok: ['ચરણ', 'પદ'], no: ['મોં', 'હાથ'] },
    { w: 'ફૂલ', ok: ['પુષ્પ', 'સુમન'], no: ['પાંદડું', 'કાંટો'] },
    { w: 'સૂરજ', ok: ['સૂર્ય', 'રવિ'], no: ['ચાંદો', 'તારો'] },
    { w: 'ચંદ્ર', ok: ['ચાંદો', 'ચંદ્રમા'], no: ['વાદળ', 'સૂરજ'] },
    { w: 'મિત્ર', ok: ['દોસ્ત', 'ભાઈબંધ'], no: ['ભાઈ', 'દાદી'] },
    { w: 'પક્ષી', ok: ['પંખી', 'ખગ'], no: ['બિલાડી', 'માછલી'] },
    { w: 'વૃક્ષ', ok: ['ઝાડ', 'તરુ'], no: ['ઘાસ', 'પથ્થર'] },
    { w: 'બાળક', ok: ['શિશુ', 'બાળ'], no: ['દાદી', 'ડોસા'] },
    { w: 'રાત', ok: ['રાત્રિ', 'નિશા'], no: ['સવાર', 'દિવસ'] },
    { w: 'રસ્તો', ok: ['માર્ગ', 'વાટ'], no: ['ઝાડ', 'ઘર'] },
    { w: 'આકાશ', ok: ['આભ', 'ગગન'], no: ['પાણી', 'ધરતી'] },
    { w: 'ધરતી', ok: ['પૃથ્વી', 'ભૂમિ'], no: ['આકાશ', 'વાદળ'] },
    { w: 'દીવો', ok: ['દીપક', 'દીપ'], no: ['ઘડો', 'ખુરશી'] },
    { w: 'કપડાં', ok: ['વસ્ત્ર', 'પરિધાન'], no: ['ચંપલ', 'વાસણ'] },
    { w: 'સિંહ', ok: ['વનરાજ', 'કેસરી'], no: ['વાંદરો', 'હાથી'] },
    { w: 'વાંદરો', ok: ['વાનર', 'કપિ'], no: ['હરણ', 'રીંછ'] },
    { w: 'નિશાળ', ok: ['શાળા', 'વિદ્યાલય'], no: ['ઘર', 'બજાર'] },
    { w: 'માણસ', ok: ['મનુષ્ય', 'માનવ'], no: ['પ્રાણી', 'ઝાડ'] },
    { w: 'માથું', ok: ['શિર', 'મસ્તક'], no: ['હાથ', 'કાન'] }
  ];

  // butterfly slots (stage px, from the layout): two left of the flower, two right
  const SLOTS = [[726, 284], [666, 579], [1515, 281], [1588, 576]];
  const FLOWER_HEAD = [1229.5, 606];
  const NUM = { 1: 'એક', 2: 'બે' };

  // Butterfly words that have their own recording (in assets/audio). Every other
  // butterfly word is read by the browser's Gujarati voice. Add a line here per new file.
  const WORD_AUDIO = {};

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
      if (clipSource) {
        try { if (clipSource.stop) clipSource.stop(); } catch (e) { /* already stopped */ }
        clipSource = null;
      }
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

    // The voice list loads late in some browsers: look the Gujarati voice up again
    // when it arrives, so no word is read by a default English voice.
    let gujaratiVoice = null;
    const findGujarati = () => {
      try {
        gujaratiVoice = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('gu')) || null;
      } catch (e) { /* no speech */ }
    };
    if ('speechSynthesis' in window) {
      findGujarati();
      window.speechSynthesis.addEventListener('voiceschanged', findGujarati);
    }

    // Resolves when the last spoken word has finished (or could not be spoken).
    let speechDone = Promise.resolve();

    /** Words with no recording (the butterfly words) use the browser's Gujarati voice. */
    function speak(text, delay = 0) {
      speechDone = new Promise((resolve) => {
        try {
          if (!('speechSynthesis' in window)) { resolve(); return; }
          window.setTimeout(() => {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'gu-IN';
            u.rate = 0.85;
            if (!gujaratiVoice) findGujarati();
            if (gujaratiVoice) u.voice = gujaratiVoice;
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

    /* Each word recording holds three words with pauses between them: the main
       word, then its two same-meaning words in the order of ROUNDS[].ok (the
       storyboard's "Correct answer" column). The file is decoded once and split
       at the pauses:
         - the word's speaker button plays only part 0 (the main word);
         - a correct butterfly plays its own part (1 or 2).
       If the file cannot be decoded (e.g. opened from file://), the speaker plays
       only the start of the file and the butterfly word is read by the browser voice. */
    const clipCache = new Map();
    let clipSource = null;

    function loadClip(src) {
      if (clipCache.has(src)) return clipCache.get(src);
      const job = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', src);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => (xhr.status === 0 || xhr.status === 200 ? resolve(xhr.response) : reject(new Error('load')));
        xhr.onerror = () => reject(new Error('load'));
        xhr.send();
      }).then((data) => new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)))
        .then((buffer) => ({ buffer, parts: findParts(buffer) }));
      job.catch(() => clipCache.delete(src));
      clipCache.set(src, job);
      return job;
    }

    /* Splits a recording into its three words: [[start, end] x 3] in seconds.
       The pauses between the words are not all the same length (some are short),
       so instead of a fixed pause length the two LONGEST pauses between the
       first and last sound are used as the cut points. Returns fewer than three
       parts only if the recording has fewer than two pauses at all. */
    function findParts(buffer) {
      const STEP = 0.02; // analyse in 20 ms frames
      const data = buffer.getChannelData(0);
      const win = Math.round(buffer.sampleRate * STEP);
      const rms = [];
      for (let i = 0; i < data.length; i += win) {
        let sum = 0;
        const stop = Math.min(i + win, data.length);
        for (let j = i; j < stop; j++) sum += data[j] * data[j];
        rms.push(Math.sqrt(sum / (stop - i)));
      }
      const peak = Math.max(...rms);

      // quiet runs [from, to) between the first and the last sound, at a given level
      function pauses(level) {
        const loud = rms.map((v) => v > peak * level);
        // a blip shorter than 80 ms inside a pause is not a word: count it as quiet
        for (let k = 0; k < loud.length;) {
          if (!loud[k]) { k++; continue; }
          let e = k;
          while (e < loud.length && loud[e]) e++;
          if (e - k < 4 && k > 0 && e < loud.length) for (let m = k; m < e; m++) loud[m] = false;
          k = e;
        }
        const first = loud.indexOf(true);
        const last = loud.lastIndexOf(true);
        const runs = [];
        for (let k = first + 1; k < last;) {
          if (loud[k]) { k++; continue; }
          let e = k;
          while (e < last && !loud[e]) e++;
          if (e - k >= 3) runs.push([k, e]); // at least 60 ms of quiet
          k = e;
        }
        return { first, last, runs };
      }

      // start strict; if two pauses are not found, accept softer sounds as quiet
      let found = null;
      for (const level of [0.06, 0.1, 0.15, 0.22]) {
        found = pauses(level);
        if (found.first >= 0 && found.runs.length >= 2) break;
      }
      const { first, last, runs } = found;
      if (first < 0) return [[0, buffer.duration]];
      const cuts = runs.slice().sort((p, q) => (q[1] - q[0]) - (p[1] - p[0])).slice(0, 2).sort((p, q) => p[0] - q[0]);

      // word k runs from the end of pause k-1 to the start of pause k
      const bounds = [first, ...cuts.flatMap(([a, b]) => [a, b]), last + 1];
      const parts = [];
      for (let k = 0; k < bounds.length; k += 2) parts.push([bounds[k], bounds[k + 1]]);
      // a little room around each word, never reaching into the next one
      return parts.map(([a, b], k) => {
        const before = k === 0 ? 6 : Math.floor((a - parts[k - 1][1]) / 2);
        const after = k === parts.length - 1 ? 6 : Math.floor((parts[k + 1][0] - b) / 2);
        return [Math.max(0, (a - Math.min(6, before)) * STEP), Math.min(buffer.duration, (b + Math.min(6, after)) * STEP)];
      });
    }

    /** Plays [start, end] of a decoded buffer; calls `done` when it ends or is stopped. */
    function playSlice(buffer, [start, end], done) {
      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(ctx.destination);
      node.onended = () => {
        const mine = clipSource === node;
        if (mine) clipSource = null;
        done(mine);
      };
      clipSource = node;
      node.start(0, start, end - start);
    }

    /** Plays only the main word from a word recording; `btn` pulses while it plays. */
    function playWordOnly(src, btn) {
      stop();
      if (!ensure()) { playStart(src, btn); return; }
      const token = {};
      clipSource = token;
      if (btn) btn.classList.add('is-playing');
      loadClip(src).then(({ buffer, parts }) => {
        if (clipSource !== token) return;
        const part = parts[0] || [0, buffer.duration];
        // stop() clears the button itself, so only a clip that ran to its end does it here
        playSlice(buffer, part, (mine) => { if (mine && btn) btn.classList.remove('is-playing'); });
      }).catch(() => {
        if (clipSource !== token) return;
        clipSource = null;
        playStart(src, btn);
      });
    }

    /* Without decoding (e.g. file://) the pauses cannot be found. Never play the
       whole recording then (that would read out the answers): play the start of
       it only, about the first 30 %, which is where the main word is. */
    function playStart(src, btn) {
      play(src, btn);
      const el = voice;
      const cut = () => {
        if (!Number.isFinite(el.duration)) return;
        const ms = el.duration * 0.3 * 1000;
        window.setTimeout(() => {
          if (voice !== el || el.paused) return;
          el.pause();
          if (btn) btn.classList.remove('is-playing');
        }, ms);
      };
      if (el.readyState >= 1) cut();
      else el.addEventListener('loadedmetadata', cut, { once: true });
    }

    /** Plays part `index` of a word recording (a same-meaning word); the browser voice reads `text` if that part cannot be found. */
    function playPart(src, index, text, delay = 0) {
      if (!ensure()) { speak(text, delay); return; }
      speechDone = new Promise((resolve) => {
        const token = {};
        window.setTimeout(() => {
          clipSource = token;
          loadClip(src).then(({ buffer, parts }) => {
            if (clipSource !== token) { resolve(); return; }
            // exactly main word + two same-meaning words, otherwise the split is not trusted
            if (parts.length !== 3 || !parts[index]) { clipSource = null; speak(text); speechDone.then(resolve); return; }
            playSlice(buffer, parts[index], () => resolve());
          }).catch(() => {
            if (clipSource === token) clipSource = null;
            speak(text);
            speechDone.then(resolve);
          });
          window.setTimeout(resolve, 4000); // never wait forever
        }, delay);
      });
    }

    /** Runs `fn` once the word being spoken has finished. */
    function afterSpeech(fn) {
      speechDone.then(fn);
    }

    return { sfx, play, playWordOnly, playPart, speak, playWord, afterSpeech, stop, unlock: ensure };
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

  const ANSWER_SHOW = 'જવાબ જુઓ';
  const ANSWER_HIDE = 'જવાબ છુપાવો';

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
    el.setAttribute('aria-label', `પતંગિયું: ${word}`);
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
    $('#nextLabel').textContent = state.r < ROUNDS.length - 1 ? 'આગળનું ઉદાહરણ' : 'ફરીથી રમો';

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

  /** A left-over (wrong) butterfly flies off to the right of the screen and disappears. */
  function flyAway(el, i) {
    if (el.classList.contains('is-gone')) return;
    el.classList.add('is-gone');
    const x = parseFloat(el.style.left);
    const dx = 1920 + 60 - x; // past the right edge of the stage
    const t = getComputedStyle(el).transform;
    const anim = el.animate([
      { transform: t === 'none' ? 'translate(0, 0)' : t, opacity: 1 },
      { transform: `translate(${dx * 0.45}px, -70px)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, -140px)`, opacity: 0 }
    ], { duration: 1500, delay: i * 200, easing: 'ease-in', fill: 'forwards' });
    anim.onfinish = () => { if (el.isConnected) el.remove(); };
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
    // the word's own part of this round's recording: part 1 = ok[0], part 2 = ok[1]
    else Sound.playPart(`assets/audio/word-${pad(state.r + 1)}.mp3`, 1 + R.ok.indexOf(word), word, 150);
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
        $$('.fly').filter((f) => !f.classList.contains('is-flying')).forEach(flyAway);
        setFeedback('');
      } else {
        const left = NUM[R.ok.length - state.found];
        setFeedback(`હા! ‘${word}’ અને ‘${R.w}’ નો અર્થ એક જ છે. હજી ${left} શોધો.`, 'good');
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
    const rest = $$('.fly').filter((f) => f.dataset.ok === '1' && !f.classList.contains('is-flying'));
    // the wrong butterflies fly off only after the right ones have reached the flower
    const wrongAway = () => $$('.fly').filter((f) => f.dataset.ok !== '1').forEach(flyAway);
    rest.forEach((f, i) => later(() => flyIn(f, () => {
      state.found++;
      markFound(f.dataset.word);
      bloom();
      if (i === rest.length - 1) wrongAway();
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

  /* આગળનું ઉદાહરણ goes to the next example; on the last one it reads ફરીથી રમો and starts over */
  function next() {
    Sound.unlock();
    state.r = state.r < ROUNDS.length - 1 ? state.r + 1 : 0;
    load();
  }

  /* ---- boot ---- */

  $('#itextAudio').addEventListener('click', (event) => { Sound.unlock(); Sound.play('assets/audio/itext.mp3', event.currentTarget); });
  $('#wordAudio').addEventListener('click', (event) => { Sound.unlock(); Sound.playWordOnly(`assets/audio/word-${pad(state.r + 1)}.mp3`, event.currentTarget); });
  answerBtn.addEventListener('click', toggleAnswer);
  $('#nextBtn').addEventListener('click', next);

  fitStage();
  window.addEventListener('resize', fitStage);
  load();
}());
