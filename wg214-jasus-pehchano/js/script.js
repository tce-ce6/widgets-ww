/* ==========================================================================
   जासूस पहचानो! (wg214) - widget logic
   Plain ES6+, no dependencies. Sections:
     1. Content data (from the storyboard data table)
     2. Helpers, stage scaling
     3. Sound (word recordings, synthesised SFX)
     4. Rounds: queue, checkpoint, timer, forts, lens, show answer, next
     5. End screen
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONTENT DATA
     ------------------------------------------------------------------------ */

  // a = left fort, b = right fort (fort word first, then its three words), x = spies
  const ROUNDS = [
    { a: ['नया', 'नवीन', 'नूतन', 'अभिनव'], b: ['पुराना', 'प्राचीन', 'पुरातन', 'जीर्ण'], x: ['बूढ़ा', 'कल'] },
    { a: ['विजय', 'जीत', 'जय', 'फ़तह'], b: ['पराजय', 'हार', 'शिकस्त', 'मात'], x: ['विषय', 'खेल'] },
    { a: ['प्रकाश', 'रोशनी', 'उजाला', 'ज्योति'], b: ['अँधेरा', 'अंधकार', 'तम', 'तिमिर'], x: ['दीपक', 'छाया'] },
    { a: ['तीर', 'बाण', 'शर', 'इषु'], b: ['माँ', 'माता', 'जननी', 'मैया'], x: ['धनुष', 'मौसी'] },
    { a: ['झूठ', 'असत्य', 'मिथ्या', 'अनृत'], b: ['सच', 'सत्य', 'यथार्थ', 'सच्चाई'], x: ['झूठा', 'सपना'] },
    { a: ['बंदर', 'वानर', 'कपि', 'मर्कट'], b: ['हाथी', 'गज', 'हस्ती', 'कुंजर'], x: ['लंगूर', 'सूँड़'] },
    { a: ['यात्रा', 'सफ़र', 'भ्रमण', 'पर्यटन'], b: ['मेहमान', 'अतिथि', 'पाहुना', 'आगंतुक'], x: ['थैला', 'मेज़बान'] },
    { a: ['नदी', 'सरिता', 'तटिनी', 'तरंगिणी'], b: ['जंगल', 'वन', 'अरण्य', 'कानन'], x: ['नहर', 'बाग'] },
    { a: ['युद्ध', 'लड़ाई', 'संग्राम', 'रण'], b: ['शांति', 'अमन', 'चैन', 'सुकून'], x: ['सेना', 'मौन'] },
    { a: ['साँप', 'सर्प', 'उरग', 'नाग'], b: ['तलवार', 'असि', 'कृपाण', 'खड्ग'], x: ['केंचुआ', 'ढाल'] },
    { a: ['आज्ञा', 'आदेश', 'हुक्म', 'निर्देश'], b: ['प्रार्थना', 'विनती', 'निवेदन', 'अर्ज़'], x: ['आज्ञाकारी', 'प्रश्न'] },
    { a: ['दुश्मन', 'शत्रु', 'रिपु', 'बैरी'], b: ['बिजली', 'विद्युत', 'दामिनी', 'तड़ित'], x: ['सैनिक', 'बादल'] },
    { a: ['दया', 'करुणा', 'कृपा', 'रहम'], b: ['प्रेम', 'स्नेह', 'प्यार', 'अनुराग'], x: ['दान', 'मित्र'] },
    { a: ['चतुर', 'होशियार', 'बुद्धिमान', 'प्रवीण'], b: ['मूर्ख', 'नासमझ', 'अज्ञानी', 'मूढ़'], x: ['चतुर्थ', 'चालाकी'] },
    { a: ['मन', 'चित्त', 'मानस', 'अंतःकरण'], b: ['बुद्धि', 'मति', 'प्रज्ञा', 'अक्ल'], x: ['विचार', 'याद'] }
  ];
  // recording of each word in assets/sound
  const WORD_AUDIO = {
    'नया': 'naya.wav', 'नवीन': 'navin.wav', 'नूतन': 'nutan.wav', 'अभिनव': 'abhinav.wav',
    'पुराना': 'purana.wav', 'प्राचीन': 'prachin.wav', 'पुरातन': 'pratan.wav', 'जीर्ण': 'jirn.wav',
    'बूढ़ा': 'budha.wav', 'कल': 'kal.wav',
    'विजय': 'vijay.wav', 'जीत': 'jeet.wav', 'जय': 'jay.wav', 'फ़तह': 'fatah.wav',
    'पराजय': 'parajay.wav', 'हार': 'haar.wav', 'शिकस्त': 'shikast.wav', 'मात': 'maat.wav',
    'विषय': 'vishay.wav', 'खेल': 'khel.wav',
    'प्रकाश': 'prakash.wav', 'रोशनी': 'roshani.wav', 'उजाला': 'ujala.wav', 'ज्योति': 'jyoti.wav',
    'अँधेरा': 'andhera.wav', 'अंधकार': 'andhakaar.wav', 'तम': 'tam.wav', 'तिमिर': 'timir.wav',
    'दीपक': 'deepak.wav', 'छाया': 'chaayaa.wav',
    'तीर': 'teer.wav', 'बाण': 'baan.wav', 'शर': 'shar.wav', 'इषु': 'eeshu.wav',
    'माँ': 'maa.wav', 'माता': 'mata.wav', 'जननी': 'janani.wav', 'मैया': 'maiya.wav',
    'धनुष': 'dhanush.wav', 'मौसी': 'mausi.wav',
    'झूठ': 'zooth.wav', 'असत्य': 'asatya.wav', 'मिथ्या': 'mithyaa.wav', 'अनृत': 'amrit.wav',
    'सच': 'sach.wav', 'सत्य': 'satya.wav', 'यथार्थ': 'yatharth.wav', 'सच्चाई': 'sacchai.wav',
    'झूठा': 'zuthaa.wav', 'सपना': 'sapanaa.wav',
    'बंदर': 'bandar.wav', 'वानर': 'waanar.wav', 'कपि': 'kapi.wav', 'मर्कट': 'markat.wav',
    'हाथी': 'haathi.wav', 'गज': 'gajj.wav', 'हस्ती': 'hasthi.wav', 'कुंजर': 'kunjar.wav',
    'लंगूर': 'langoor.wav', 'सूँड़': 'suund.wav',
    'यात्रा': 'yatra.wav', 'सफ़र': 'safar.wav', 'भ्रमण': 'bhraman.wav', 'पर्यटन': 'paryatan.wav',
    'मेहमान': 'mehamaan.wav', 'अतिथि': 'atithi.wav', 'पाहुना': 'pahuna.wav', 'आगंतुक': 'aagantuk.wav',
    'थैला': 'thailaa.wav', 'मेज़बान': 'mejban.wav',
    'नदी': 'nadi.wav', 'सरिता': 'sarita.wav', 'तटिनी': 'tatini.wav', 'तरंगिणी': 'tarangini.wav',
    'जंगल': 'jangal.wav', 'वन': 'vann.wav', 'अरण्य': 'aranya.wav', 'कानन': 'kanan.wav',
    'नहर': 'nahar.wav', 'बाग': 'baagh.wav',
    'युद्ध': 'yuuddha.wav', 'लड़ाई': 'ladhai.wav', 'संग्राम': 'sangraam.wav', 'रण': 'rann.wav',
    'शांति': 'shaanti.wav', 'अमन': 'aman.wav', 'चैन': 'chain.wav', 'सुकून': 'sukun.wav',
    'सेना': 'senaa.wav', 'मौन': 'maun.wav',
    'साँप': 'saap.wav', 'सर्प': 'sarp.wav', 'उरग': 'urag.wav', 'नाग': 'naag.wav',
    'तलवार': 'talawaar.wav', 'असि': 'asi.wav', 'कृपाण': 'krupan.wav', 'खड्ग': 'khadag.wav',
    'केंचुआ': 'kechuwa.wav', 'ढाल': 'dhaal.wav',
    'आज्ञा': 'aagyaa.wav', 'आदेश': 'aadesh.wav', 'हुक्म': 'hukma.wav', 'निर्देश': 'nirdesh.wav',
    'प्रार्थना': 'prarthanaa.wav', 'विनती': 'vinati.wav', 'निवेदन': 'nivedan.wav', 'अर्ज़': 'arj.wav',
    'आज्ञाकारी': 'agyakari.wav', 'प्रश्न': 'prashna.wav',
    'दुश्मन': 'dushman.wav', 'शत्रु': 'shatru.wav', 'रिपु': 'reepu.wav', 'बैरी': 'bairee.wav',
    'बिजली': 'bijali.wav', 'विद्युत': 'vidyut.wav', 'दामिनी': 'damini.wav', 'तड़ित': 'tadit.wav',
    'सैनिक': 'sainik.wav', 'बादल': 'badal.wav',
    'दया': 'dayaa.wav', 'करुणा': 'karuna.wav', 'कृपा': 'krupa.wav', 'रहम': 'raham.wav',
    'प्रेम': 'prem.wav', 'स्नेह': 'sneh.wav', 'प्यार': 'pyar.wav', 'अनुराग': 'anurag.wav',
    'दान': 'daan.wav', 'मित्र': 'mitra.wav',
    'चतुर': 'chatur.wav', 'होशियार': 'hoshiyaar.wav', 'बुद्धिमान': 'buddhiman.wav', 'प्रवीण': 'pravin.wav',
    'मूर्ख': 'murkh.wav', 'नासमझ': 'nasamaz.wav', 'अज्ञानी': 'agyani.wav', 'मूढ़': 'moodh.wav',
    'चतुर्थ': 'chaturth.wav', 'चालाकी': 'chalaki.wav',
    'मन': 'man.wav', 'चित्त': 'chitt.wav', 'मानस': 'manas.wav', 'अंतःकरण': 'antkaran.wav',
    'बुद्धि': 'buddhi.wav', 'मति': 'mati.wav', 'प्रज्ञा': 'pragya.wav', 'अक्ल': 'akla.wav',
    'विचार': 'vichar.wav', 'याद': 'yaad.wav'
  };


  // stage geometry (px, from the AI layout)
  // w = the river under the bridge (a spy can be dragged straight down into it)
  const ZONES = { a: [50, 200, 700, 620], b: [1235, 200, 650, 620], x: [710, 629, 537, 250], w: [800, 900, 340, 180] };
  // doorway of each fort: centre x and the threshold y (bottom of the arch), from bg.svg
  const GATE = { a: [405, 812], b: [1558, 812] };
  const DOOR_H = 128; // the soldier shrinks to the doorway's height so he fits inside the arch
  const SOLDIER = [838, 465, 201, 354];
  const GRASS_Y = 900;
  const WATER_DROP = 470; // how far a spy falls from the checkpoint into the river under the bridge

  /* ------------------------------------------------------------------------
     2. HELPERS, STAGE SCALING
     ------------------------------------------------------------------------ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const stage = $('#stage');
  const viewport = $('#viewport');
  const checkpoint = $('#checkpoint');
  const answerBtn = $('#answerBtn');
  const timerBar = $('#timerBar');
  const liveRegion = $('#liveRegion');
  const zoneEls = { a: $('#fortA'), b: $('#fortB'), x: $('#lens'), w: $('#river') };
  const membersEl = { a: $('#membersA'), b: $('#membersB') };
  const spiesInEl = { a: $('#spiesA'), b: $('#spiesB') };

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
    viewport.style.setProperty('--grass-y', `${stageOrigin[1] + GRASS_Y * stageScale}px`);
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

    function thud(start, peak) {
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      src.buffer = noise;
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      gain.gain.setValueAtTime(peak, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start(start, Math.random() * 0.5, 0.35);
    }

    // filtered noise sweep (the same as the Bridge widget's breaking / splash sounds)
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
      if (name === 'breaking') { hiss(t, 0.12, 0.6, 'highpass', 3000, 1500); hiss(t + 0.08, 0.35, 0.45, 'lowpass', 900, 120); tone(140, t + 0.3, 0.4, 'sine', 0.2, 60); return; }
      if (name === 'splash') { hiss(t, 0.9, 0.35, 'bandpass', 300, 1800); tone(500, t, 0.8, 'sine', 0.08, 160); return; }
      if (name === 'correct') { tone(587, t, 0.14, 'triangle', 0.2); tone(880, t + 0.1, 0.26, 'triangle', 0.2); }
      else if (name === 'wrong') { tone(220, t, 0.22, 'triangle', 0.16); tone(160, t + 0.12, 0.3, 'triangle', 0.14); }
      else if (name === 'salute') { tone(523, t, 0.12, 'square', 0.07); tone(659, t + 0.13, 0.12, 'square', 0.07); tone(784, t + 0.26, 0.3, 'square', 0.07); }
      else if (name === 'reveal') { tone(300, t, 0.5, 'sawtooth', 0.06, 1200); tone(1400, t + 0.45, 0.25, 'triangle', 0.12); }
      else if (name === 'brick') { tone(900, t, 0.08, 'square', 0.05); thud(t + 0.55, 0.9); thud(t + 0.7, 0.5); }
      else if (name === 'timeout') { tone(440, t, 0.25, 'sine', 0.14, 220); }
      else if (name === 'end') { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * 0.12, 0.45, 'triangle', 0.15)); }
    }

    // word recordings (assets/sound); one player, so a new word cuts off the last one
    const player = new Audio();
    player.preload = 'auto';
    const missing = new Set();

    function stop() {
      try { player.pause(); } catch (e) { /* nothing playing */ }
    }

    /** Plays a word's recording (recordings only, no system voice). */
    function speak(text) {
      const file = WORD_AUDIO[text];
      if (!file) return;
      stop();
      player.src = `assets/sound/${file}`;
      player.currentTime = 0;
      player.play().catch(() => {
        if (!missing.has(file)) { missing.add(file); console.warn(`wg214: could not play ${file} for "${text}"`); }
      });
    }

    return { sfx, speak, stop, unlock: ensure };
  }());

  /* ------------------------------------------------------------------------
     4. ROUNDS
     ------------------------------------------------------------------------ */

  const state = {
    r: 0,
    queue: [],
    current: null, // { word, el }
    filled: { a: 0, b: 0 },
    handled: 0,
    mistake: false,
    done: false,
    timeMax: 10,
    timeLeft: 10,
    raf: 0,
    last: 0
  };

  const R = () => ROUNDS[state.r];
  const familyOf = (word) => (R().a.slice(1).includes(word) ? 'a' : R().b.slice(1).includes(word) ? 'b' : 'x');

  function renderQueue() {
    const q = $('#queue');
    q.innerHTML = '';
    state.queue.slice(0, 2).forEach(() => {
      const img = document.createElement('img');
      img.src = 'assets/svg/queue-soldier.svg';
      img.alt = '';
      q.appendChild(img);
    });
  }

  function addMember(k, word) {
    const slot = $$('.member', membersEl[k]).find((m) => !m.classList.contains('is-filled'));
    if (!slot) return;
    slot.classList.add('is-filled');
    slot.textContent = word;
    // the fort's last word is in: the player earns the next sword on the emblem
    if ($$('.member', membersEl[k]).every((m) => m.classList.contains('is-filled'))) earnSword();
  }

  /** First completed fort gives sword 1, the next one gives sword 2. */
  function earnSword() {
    const sword = $$('#emblem .emblem__sword').find((s) => !s.classList.contains('is-earned'));
    if (!sword) return;
    sword.classList.add('is-earned');
    later(() => Sound.sfx('salute'), 250);
    announce('तुम्हें एक तलवार मिली!');
  }

  function addSpyChip(box, word, withIcon) {
    const chip = document.createElement('span');
    if (withIcon) {
      chip.className = 'spy-chip';
      chip.innerHTML = `<img src="assets/svg/spy.svg" alt=""><span>${word}</span>`;
    } else {
      chip.textContent = word;
    }
    box.appendChild(chip);
  }

  function dropBrick(k) {
    const bricks = $$('.bricks i', zoneEls[k]).filter((b) => !b.classList.contains('is-fallen'));
    if (bricks.length) bricks[bricks.length - 1].classList.add('is-fallen');
    Sound.sfx('brick');
  }

  function checkDone() {
    if (state.handled === 8 && !state.done) {
      state.done = true;
      answerBtn.disabled = true;
      timerBar.style.width = '0%';
    }
  }

  /** resume = { timeLeft } when Hide Answer brings the same soldier back (no re-speak, same time left). */
  function nextSoldier(resume) {
    if (state.done) return;
    state.current = null;
    checkpoint.innerHTML = '';
    if (!state.queue.length) { renderQueue(); checkDone(); return; }
    const word = state.queue.shift();
    renderQueue();
    const el = document.createElement('div');
    el.className = 'soldier';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `सैनिक: ${word}`);
    el.innerHTML = '<img class="soldier__body" src="assets/svg/knight.svg" alt="">' +
      '<img class="soldier__disguise" src="assets/svg/spy.svg" alt="">' +
      `<span class="soldier__word">${word}</span>`;
    initDrag(el);
    el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); Sound.speak(word); }
    });
    checkpoint.appendChild(el);
    state.current = { word, el };
    if (resume) {
      state.timeLeft = resume.timeLeft;
      return;
    }
    state.timeLeft = state.timeMax;
    // no autoplay: the word is heard only when the soldier is tapped
    // Show Answer was pressed while the last soldier was still on the move
    if (state.pendingShow) showAnswer();
  }

  /** Sends the soldier into a fort: the gate shuts behind him and he is counted. */
  function enterFort(el, k, done) {
    const [gx, gy] = GATE[k];
    // the soldier scales about his centre, so his feet end at centre + s * half his height:
    // put that on the doorway threshold
    const s = DOOR_H / SOLDIER[3];
    const cy = SOLDIER[1] + SOLDIER[3] / 2;
    const dx = gx - (SOLDIER[0] + SOLDIER[2] / 2);
    const dy = gy - cy - (s * SOLDIER[3]) / 2;
    const from = el.style.transform || 'none';
    el.style.transform = '';
    el.animate([
      { transform: from, opacity: 1 },
      // walk up to the threshold at doorway size
      { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 1, offset: 0.7 },
      // step in through the doorway: a little smaller and further in, fading into the dark
      { transform: `translate(${dx}px, ${dy - 6 + (s * 0.1 * SOLDIER[3]) / 2}px) scale(${s * 0.9})`, opacity: 0 }
    ], { duration: 1000, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => {
      const fort = zoneEls[k];
      fort.classList.add('is-shut');
      later(() => fort.classList.remove('is-shut'), 700);
      done();
    };
  }

  function attempt(k) {
    const cur = state.current;
    if (!cur || state.done) return;
    Sound.unlock();
    const { word, el } = cur;
    const fam = familyOf(word);

    if (fam === 'x' && (k === 'x' || k === 'w')) {
      // spy on the bridge, or dragged straight down into the river: the disguise comes
      // off, then he falls into the water (like the Bridge widget's whirlpool); his word
      // goes on the sign
      state.current = null;
      // dragged into the river: he is already over the water, so he sinks from there
      const base = k === 'w' ? el.style.transform : '';
      const inRiver = !!base;
      const from = base || 'none';
      const to = inRiver ? `${base} translateY(120px) rotate(24deg) scale(.4)` : `translateY(${WATER_DROP}px) rotate(24deg) scale(.5)`;
      el.style.transform = base;
      Sound.sfx('reveal');
      el.classList.add('is-spy');
      $('.soldier__word', el).style.visibility = 'hidden';
      later(() => {
        Sound.sfx('splash');
        el.animate([
          { transform: from, opacity: 1 },
          { transform: `${base} translateY(-30px) rotate(-8deg)`, opacity: 1, offset: 0.2 },
          { transform: to, opacity: 0 }
        ], { duration: 900, easing: 'ease-in', fill: 'forwards' })
          .onfinish = () => { addSpyChip($('#revealed'), word, false); state.handled++; nextSoldier(); };
      }, inRiver ? 300 : 600);
      announce(`${word} जासूस है।`);
      return;
    }
    if (k === 'w') {
      // a real soldier does not belong in the river: he climbs back to the checkpoint
      state.mistake = true;
      Sound.sfx('wrong');
      el.animate([{ transform: el.style.transform || 'none' }, { transform: 'none' }], { duration: 300, easing: 'ease-out' });
      el.style.transform = '';
      later(() => restart(el, 'is-shake'), 300);
      return;
    }
    if (fam !== k && k !== 'x') {
      // any wrong word at a fort (a spy, or a soldier of the other fort) fits in for a
      // moment, then breaks and falls into the water, like the Bridge widget; the same
      // soldier then steps back up to be sent again. Only right words stay at a fort.
      state.mistake = true;
      wrongAtFort(el, k, word, fam === 'x');
      return;
    }
    if (k === 'x') {
      // a real soldier under the lens jumps and salutes, then waits
      state.mistake = true;
      el.style.transform = '';
      Sound.sfx('salute');
      later(() => Sound.sfx('wrong'), 450);
      restart(el, 'is-saluting');
      return;
    }
    if (fam === k) {
      state.current = null;
      Sound.sfx('correct');
      enterFort(el, k, () => {
        addMember(k, word);
        state.filled[k]++;
        state.handled++;
        later(nextSoldier, 300);
      });
      return;
    }
  }

  /**
   * A wrong word dropped on fort k: it shows in the fort's next empty slot, cracks and
   * falls into the water, and the soldier comes back to the checkpoint (timer paused).
   */
  function wrongAtFort(el, k, word, isSpy) {
    const slot = $$('.member', membersEl[k]).find((m) => !m.classList.contains('is-filled'));
    el.style.transform = '';
    if (!slot) { Sound.sfx('wrong'); restart(el, 'is-shake'); return; }
    state.current = null; // no other move, and the timer waits, until he is back
    el.style.visibility = 'hidden';
    slot.classList.add('is-wrong');
    slot.textContent = word;
    later(() => {
      if (isSpy) dropBrick(k); // a spy at the gate still knocks a brick off the fort
      Sound.sfx('breaking');
      restart(slot, 'is-breaking');
    }, 350);
    later(() => {
      slot.className = 'member';
      slot.textContent = '';
      el.style.visibility = '';
      el.animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: 400 });
      state.current = { word, el };
      if (state.pendingShow) showAnswer(); // Show Answer was pressed meanwhile
    }, 1300);
  }

  /* drag the soldier to a fort or the lens; a plain tap says his word */
  function initDrag(el) {
    el.addEventListener('pointerdown', (event) => {
      if (state.done || !state.current || state.current.el !== el) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      Sound.unlock();
      const start = toStage(event.clientX, event.clientY);
      let moved = false;
      let hot = null;
      el.setPointerCapture(event.pointerId);
      const zoneAt = (cx, cy) => {
        const pt = toStage(cx, cy);
        if (inside(pt, ZONES.w)) return 'w';
        if (inside(pt, ZONES.x)) return 'x';
        return ['a', 'b'].find((k) => inside(pt, ZONES[k])) || null;
      };
      const move = (ev) => {
        const [x, y] = toStage(ev.clientX, ev.clientY);
        if (!moved && Math.hypot(x - start[0], y - start[1]) > 8) { moved = true; el.classList.add('is-dragging'); }
        if (!moved) return;
        el.style.transform = `translate(${x - start[0]}px, ${y - start[1]}px) scale(.8)`;
        const z = zoneAt(ev.clientX, ev.clientY);
        if (z !== hot) {
          if (hot) zoneEls[hot].classList.remove('is-over');
          if (z) zoneEls[z].classList.add('is-over');
          hot = z;
        }
      };
      const up = (ev) => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        el.classList.remove('is-dragging');
        if (hot) zoneEls[hot].classList.remove('is-over');
        if (!moved) { Sound.speak(state.current.word); return; }
        const z = ev.type === 'pointerup' ? zoneAt(ev.clientX, ev.clientY) : null;
        if (z) {
          attempt(z);
        } else {
          el.animate([{ transform: el.style.transform }, { transform: 'none' }], { duration: 250, easing: 'ease-out' });
          el.style.transform = '';
        }
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }

  // tapping a fort or the lens sends the current soldier there
  Object.entries(zoneEls).forEach(([k, el]) => {
    el.addEventListener('click', () => attempt(k));
    el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); attempt(k); }
    });
  });

  // tapping a fort's word board says that word (and does not send the soldier in)
  ['A', 'B'].forEach((K) => {
    const board = $(`#label${K}`);
    board.addEventListener('click', (event) => {
      event.stopPropagation();
      Sound.unlock();
      Sound.speak(board.textContent);
    });
  });

  /* the timer: running out sends the soldier to the back of the queue */
  function tick(now) {
    const dt = Math.min(0.05, (now - state.last) / 1000 || 0);
    state.last = now;
    const cur = state.current;
    // the timer also waits while the help tour is open
    const touring = document.getElementById('tour').classList.contains('is-open');
    if (cur && !state.done && !touring && !cur.el.classList.contains('is-dragging')) {
      state.timeLeft -= dt;
      const pct = Math.max(0, state.timeLeft / state.timeMax);
      timerBar.style.width = `${pct * 100}%`;
      timerBar.classList.toggle('is-low', pct < 0.3);
      if (state.timeLeft <= 0) {
        state.mistake = true;
        state.current = null;
        Sound.sfx('timeout');
        state.queue.push(cur.word);
        renderQueue();
        cur.el.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateX(-120px)' }], { duration: 400, fill: 'forwards' })
          .onfinish = () => nextSoldier();
      }
    }
    state.raf = requestAnimationFrame(tick);
  }

  function load() {
    clearTimers();
    Sound.stop();
    const round = R();
    state.filled = { a: 0, b: 0 };
    state.handled = 0;
    state.mistake = false;
    state.done = false;
    state.current = null;
    state.timeMax = Math.max(6, 11 - state.r * 0.35); // a little less time each example

    $('#exampleCounter').textContent = `उदाहरण ${state.r + 1} / ${ROUNDS.length}`;
    $('#labelA').textContent = round.a[0];
    $('#labelB').textContent = round.b[0];
    ['a', 'b'].forEach((k) => {
      membersEl[k].innerHTML = '<span class="member"></span><span class="member"></span><span class="member"></span>';
      spiesInEl[k].innerHTML = '';
      zoneEls[k].classList.remove('is-shut');
      $$('.bricks i', zoneEls[k]).forEach((b) => b.classList.remove('is-fallen'));
    });
    $('#revealed').innerHTML = '';
    $$('#emblem .emblem__sword').forEach((s) => s.classList.remove('is-earned'));
    timerBar.style.width = '100%';
    timerBar.classList.remove('is-low');
    answerBtn.disabled = false;
    state.pendingShow = false;
    state.saved = null;
    setAnswerBtn(false);
    // on the last example the same button starts the game again
    $('#nextLabel').textContent = state.r < ROUNDS.length - 1 ? 'अगला उदाहरण' : 'फिर से खेलो';

    // soldiers come in a new random order every time
    state.queue = shuffle([...round.a.slice(1), ...round.b.slice(1), ...round.x]);
    nextSoldier();
    later(() => announce(`${round.a[0]} और ${round.b[0]} के किले।`), 50);
  }

  const ANSWER_SHOW = 'उत्तर देखें';
  const ANSWER_HIDE = 'उत्तर छिपाएँ';

  function setAnswerBtn(showing) {
    state.showing = showing;
    answerBtn.textContent = showing ? ANSWER_HIDE : ANSWER_SHOW;
    answerBtn.setAttribute('aria-pressed', String(showing));
  }

  function toggleAnswer() {
    Sound.unlock();
    if (state.showing) hideAnswer();
    else if (!state.current) state.pendingShow = true; // a soldier is still walking: open once he is in
    else showAnswer();
  }

  /** Everything Show Answer changes, so Hide Answer can put the round back exactly. */
  function snapshot() {
    const html = (el) => el.innerHTML;
    return {
      queue: state.queue.slice(),
      word: state.current.word,
      timeLeft: state.timeLeft,
      handled: state.handled,
      filled: { ...state.filled },
      members: { a: html(membersEl.a), b: html(membersEl.b) },
      spiesIn: { a: html(spiesInEl.a), b: html(spiesInEl.b) },
      revealed: html($('#revealed')),
      bricks: $$('.bricks i').map((b) => b.classList.contains('is-fallen')),
      swords: $$('#emblem .emblem__sword').map((s) => s.classList.contains('is-earned'))
    };
  }

  function hideAnswer() {
    const snap = state.saved;
    if (!snap) return;
    clearTimers();
    Sound.stop();
    setAnswerBtn(false);
    state.saved = null;
    state.done = false;
    state.handled = snap.handled;
    state.filled = { ...snap.filled };
    ['a', 'b'].forEach((k) => {
      membersEl[k].innerHTML = snap.members[k];
      spiesInEl[k].innerHTML = snap.spiesIn[k];
    });
    $('#revealed').innerHTML = snap.revealed;
    $$('.bricks i').forEach((b, i) => b.classList.toggle('is-fallen', snap.bricks[i]));
    $$('#emblem .emblem__sword').forEach((s, i) => s.classList.toggle('is-earned', snap.swords[i]));
    // the same soldier steps back up with the same time left
    state.queue = [snap.word, ...snap.queue];
    nextSoldier({ timeLeft: snap.timeLeft });
    const pct = Math.max(0, snap.timeLeft / state.timeMax);
    timerBar.style.width = `${pct * 100}%`;
    timerBar.classList.toggle('is-low', pct < 0.3);
  }

  function showAnswer() {
    state.pendingShow = false;
    if (state.done || !state.current) return;
    Sound.unlock();
    state.saved = snapshot();
    state.done = true;
    state.mistake = true;
    setAnswerBtn(true);
    const rest = [...(state.current ? [state.current.word] : []), ...state.queue];
    state.current = null;
    state.queue = [];
    checkpoint.innerHTML = '';
    renderQueue();
    timerBar.style.width = '0%';
    rest.forEach((word, i) => later(() => {
      const fam = familyOf(word);
      if (fam === 'x') addSpyChip($('#revealed'), word, false);
      else addMember(fam, word);
    }, i * 200));
  }

  /* अगला उदाहरण goes to the next example; on the last one it reads फिर से खेलो and starts over */
  function next() {
    Sound.unlock();
    state.r = state.r < ROUNDS.length - 1 ? state.r + 1 : 0;
    load();
  }

  /* ---- boot ---- */

  answerBtn.addEventListener('click', toggleAnswer);
  $('#nextBtn').addEventListener('click', next);

  fitStage();
  window.addEventListener('resize', fitStage);
  load();
  state.last = performance.now();
  state.raf = requestAnimationFrame(tick);
}());
