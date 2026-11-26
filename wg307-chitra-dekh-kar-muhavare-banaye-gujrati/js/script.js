'use strict';

/* ==========================================================================
   wg307 — ચિત્ર જોઈને રૂઢિપ્રયોગ બનાવો  (widget logic)

   From reference/gu_gu_05_wg307.docx and the XD / AI layout:
     - A picture on the left, an empty idiom tray (one blank per word) and a
       bank of words (the idiom's words + distractors, in random order).
     - The student taps the words of the idiom in the right order. A wrong
       word, or a right word out of order, turns red and shakes.
     - When every word is placed, sparkles play and the meaning (અર્થ) and an
       example sentence (વાક્યપ્રયોગ) replace the word bank.
     - જવાબ જુઓ / જવાબ છુપાવો shows or hides the answer at any point
       (hiding puts the student's own progress back).
     - આગળનું ઉદાહરણ goes to the next idiom (ફરીથી રમો after the last).
   ========================================================================== */

(function () {
  // ---------------------------------------------------------------------
  // Content (docx data tables). In `use`, the idiom is in [brackets]
  // and shown in bold.
  // ---------------------------------------------------------------------
  const ROUNDS = [
    {
      idiom: 'આંખનો તારો',
      words: ['આંખનો', 'આંખમાં', 'નયનનો', 'તારો', 'સિતારો', 'આંખનું', 'ચાંદો', 'તારા'],
      meaning: 'અત્યંત પ્રિય વ્યક્તિ',
      use: 'રામ તેનાં માતા-પિતાની [આંખનો તારો] છે.'
    },
    {
      idiom: 'બળતામાં ઘી હોમવું',
      words: ['બળતામાં', 'આગમાં', 'ઘી', 'તેલ', 'પાણી', 'હોમવું', 'રેડવું', 'ઠરતામાં'],
      meaning: 'ગુસ્સો કે ઝઘડો વધારવો',
      use: 'ઝઘડા વચ્ચે બોલીને તેં [બળતામાં ઘી હોમ્યું].'
    },
    {
      idiom: 'આંખમાં ધૂળ નાખવી',
      words: ['આંખમાં', 'નાકમાં', 'આંખે', 'ધૂળ', 'માટી', 'રેતી', 'નાખવી', 'ઉડાડવી'],
      meaning: 'છેતરવું',
      use: 'ચોર પોલીસની [આંખમાં ધૂળ નાખીને] ભાગી ગયો.'
    },
    {
      idiom: 'ઘર માથે લેવું',
      words: ['ઘર', 'ઘરને', 'આભ', 'માથે', 'ખભે', 'લેવું', 'મૂકવું', 'ઉપાડવું'],
      meaning: 'ખૂબ ઘોંઘાટ કરવો',
      use: 'રમતાં રમતાં બાળકોએ [ઘર માથે લીધું].'
    },
    {
      idiom: 'ઈંટનો જવાબ પથ્થરથી આપવો',
      words: ['ઈંટનો', 'ઈંટથી', 'જવાબ', 'ઉત્તર', 'પથ્થરથી', 'પથ્થરનો', 'માટીથી', 'આપવો', 'લેવો'],
      meaning: 'સખત જવાબ આપવો, વળતો પ્રહાર કરવો',
      use: 'દુશ્મને હુમલો કર્યો ત્યારે સૈનિકોએ [ઈંટનો જવાબ પથ્થરથી આપ્યો].'
    },
    {
      idiom: 'મોંમાં પાણી આવવું',
      words: ['મોંમાં', 'મોઢે', 'આંખમાં', 'પાણી', 'જળ', 'દૂધ', 'આવવું', 'લાવવું'],
      meaning: 'ખાવાની ઇચ્છા થવી',
      use: 'ગરમાગરમ સમોસા જોઈને મારા [મોંમાં પાણી આવી ગયું].'
    },
    {
      idiom: 'પોતાના પગ પર કુહાડો મારવો',
      words: ['પોતાના', 'બીજાના', 'પગ', 'હાથ', 'પર', 'કુહાડો', 'તીર', 'મારવો', 'ચલાવવો'],
      meaning: 'જાતે જ પોતાનું નુકસાન કરવું',
      use: 'સારી નોકરી છોડીને તેણે [પોતાના પગ પર કુહાડો માર્યો].'
    },
    {
      idiom: 'આકાશના તારા તોડી લાવવા',
      words: ['આકાશના', 'ધરતીના', 'તારા', 'ચાંદ', 'ફૂલ', 'તોડી', 'ગણી', 'લાવવા', 'મૂકવા'],
      meaning: 'અશક્ય કામ કરવું',
      use: 'મારા માટે પરીક્ષામાં પ્રથમ આવવું એ [આકાશના તારા તોડી લાવવા] જેવું છે.'
    },
    {
      idiom: 'દૂધ પાઈને સાપ ઉછેરવો',
      words: ['દૂધ', 'પાણી', 'ઘી', 'પાઈને', 'ખવડાવીને', 'સાપ', 'બિલાડી', 'ઉછેરવો', 'મારવો'],
      meaning: 'દગાબાજ પર ઉપકાર કરવો',
      use: 'મોહનને મદદ કરીને મેં [દૂધ પાઈને સાપ ઉછેર્યો]; આજે તે જ મારી વિરુદ્ધ છે.'
    },
    {
      idiom: 'એક ને એક અગિયાર',
      words: ['એક', 'ને', 'એક', 'થી', 'બે', 'ત્રણ', 'અગિયાર', 'દસ', 'બાર'],
      meaning: 'એકતામાં બળ છે',
      use: 'બંને ભાઈઓએ સાથે મળીને વેપાર કર્યો, એટલે ખરેખર [એક ને એક અગિયાર] થયા.',
      picText: '૧ + ૧ = ૧૧'
    },
    {
      idiom: 'એક પગે ઊભા રહેવું',
      words: ['એક', 'બે', 'પગે', 'હાથે', 'ઊભા', 'બેસી', 'રહેવું', 'દોડવું'],
      meaning: 'સદા તત્પર રહેવું, આતુરતાથી રાહ જોવી',
      use: 'મિત્રને મદદ કરવા રમેશ હંમેશાં [એક પગે ઊભો રહે] છે.'
    },
    {
      idiom: 'કાદવ ઉછાળવો',
      words: ['કાદવ', 'કચરો', 'ધૂળ', 'ઉછાળવો', 'નાખવો', 'ફેંકવો'],
      meaning: 'બદનામી કરવી, આક્ષેપ કરવા',
      use: 'ચૂંટણી વખતે નેતાઓ એકબીજા પર [કાદવ ઉછાળે] છે.'
    },
    {
      idiom: 'ડૂબતાને તણખાનો સહારો',
      words: ['ડૂબતાને', 'તરતાને', 'તણખાનો', 'લાકડાનો', 'હોડીનો', 'દોરડાનો', 'સહારો', 'મદદ'],
      meaning: 'મુશ્કેલીમાં થોડી મદદ પણ ઘણી લાગે',
      use: 'ગરીબીમાં મળેલા થોડા રૂપિયા [ડૂબતાને તણખાનો સહારો] બન્યા.'
    },
    {
      idiom: 'મોંમાં આંગળાં નાખી જવાં',
      words: ['મોંમાં', 'નાકમાં', 'આંગળાં', 'હાથ', 'દાંત', 'નાખી', 'મૂકી', 'જવાં', 'આવવાં'],
      meaning: 'ખૂબ નવાઈ પામવું',
      use: 'જાદુગરના ખેલ જોઈને સૌ [મોંમાં આંગળાં નાખી ગયા].'
    },
    {
      idiom: 'બે હોડીમાં પગ રાખવા',
      words: ['બે', 'એક', 'ત્રણ', 'હોડીમાં', 'લોટામાં', 'પગ', 'હાથ', 'રાખવા', 'મૂકવા'],
      meaning: 'બંને પક્ષે રહેવું, બેવડી નીતિ અપનાવવી',
      use: '[બે હોડીમાં પગ રાખનાર] અંતે ક્યાંયનો રહેતો નથી.'
    },
    {
      idiom: 'પેટમાં ઉંદર દોડવા',
      words: ['પેટમાં', 'માથામાં', 'ઉંદર', 'બિલાડી', 'કીડી', 'દોડવા', 'ચાલવા', 'કૂદવા'],
      meaning: 'ખૂબ ભૂખ લાગવી',
      use: 'સવારથી કંઈ ખાધું નથી, [પેટમાં ઉંદર દોડે] છે.'
    },
    {
      idiom: 'ગાગરમાં સાગર ભરવો',
      words: ['ગાગરમાં', 'ઘડામાં', 'લોટામાં', 'સાગર', 'સમુદ્ર', 'નદી', 'ભરવો', 'ઠાલવવો'],
      meaning: 'થોડા શબ્દોમાં ઘણી વાત કહેવી',
      use: 'કવિએ નાનકડી કવિતામાં [ગાગરમાં સાગર ભર્યો] છે.'
    },
    {
      idiom: 'દિવસે તારા દેખાવા',
      words: ['દિવસે', 'રાત્રે', 'તારા', 'સૂરજ', 'ચાંદ', 'સપનાં', 'દેખાવા', 'જોવા'],
      meaning: 'ખૂબ દુઃખ કે તકલીફ પડવી',
      use: 'સખત તાવમાં મને [દિવસે તારા દેખાયા].'
    },
    {
      idiom: 'ઘાણીનો બળદ',
      words: ['ઘાણીનો', 'ખેતરનો', 'ગાડાનો', 'બળદ', 'ઘોડો', 'ભેંસ', 'ગધેડો'],
      meaning: 'સતત કામમાં જોતરાયેલો માણસ',
      use: 'તે દિવસ-રાત કામ કરે છે, જાણે [ઘાણીનો બળદ].'
    },
    {
      idiom: 'પાંચે આંગળીઓ ઘીમાં હોવી',
      words: ['પાંચે', 'દસે', 'આંગળીઓ', 'હાથ', 'ઘીમાં', 'તેલમાં', 'દૂધમાં', 'હોવી', 'બોળવી'],
      meaning: 'બધી રીતે લાભ થવો',
      use: 'દિવાળીની સીઝનમાં વેપારીની [પાંચે આંગળીઓ ઘીમાં હોય] છે.'
    },
    {
      idiom: 'આંગળીના ઇશારે નચાવવું',
      words: ['આંગળીના', 'હાથના', 'આંખના', 'ઇશારે', 'કહેવાથી', 'નચાવવું', 'ચલાવવું', 'દોરવું'],
      meaning: 'પોતાની મરજી મુજબ ચલાવવું',
      use: 'માલિકે બધા કર્મચારીઓને [આંગળીના ઇશારે નચાવ્યા] છે.'
    }
  ];

  const TXT = {
    answerShow: 'જવાબ જુઓ',
    answerHide: 'જવાબ છુપાવો',
    next: 'આગળનું ઉદાહરણ',
    again: 'ફરીથી રમો',
    wrong: 'આ શબ્દ અહીં નથી આવતો. ફરી પ્રયાસ કરો.',
    good: (w) => `સાચું! ‘${w}’`,
    done: (idiom, meaning) => `સરસ! રૂઢિપ્રયોગ: ${idiom}. અર્થ: ${meaning}.`,
    picAlt: (n) => `ચિત્ર ${n}: આ ચિત્ર પરથી રૂઢિપ્રયોગ બનાવો.`
  };

  const reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const reduced = () => !!reduceMQ.matches;

  // ---------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------
  const $ = (s) => document.querySelector(s);
  const viewport = $('#viewport');
  const stage = $('#stage');
  const picImg = $('#picImg');
  const picText = $('#picText');
  const tray = $('#tray');
  const slotsEl = $('#slots');
  const bank = $('#bank');
  const result = $('#result');
  const meaningEl = $('#meaning');
  const usageEl = $('#usage');
  const answerBtn = $('#answerBtn');
  const nextBtn = $('#nextBtn');
  const live = $('#liveRegion');

  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function announce(msg) { live.textContent = ''; setTimeout(() => { live.textContent = msg; }, 30); }

  // ---------------------------------------------------------------------
  // Stage scaling: fixed 1920x1080 design, fitted to the window
  // ---------------------------------------------------------------------
  function fitStage() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const s = Math.min(vw / 1920, vh / 1080);
    stage.style.transform = `translate(${(vw - 1920 * s) / 2}px, ${(vh - 1080 * s) / 2}px) scale(${s})`;
  }
  window.addEventListener('resize', fitStage);
  fitStage();

  // Shrinks an element's font until its text fits its box.
  function fitText(el, max, min) {
    let size = max;
    el.style.fontSize = size + 'px';
    while (size > min && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)) {
      size -= 2;
      el.style.fontSize = size + 'px';
    }
  }

  // ---------------------------------------------------------------------
  // Sparkles (reference/Animation/stars points.json via js/lottie-data.js)
  // ---------------------------------------------------------------------
  const stars = [];
  if (window.lottie && window.STARS_ANIM) {
    ['#starsL', '#starsR'].forEach((sel) => {
      const data = JSON.parse(JSON.stringify(window.STARS_ANIM));
      data.layers = data.layers.filter((l) => l.ty !== 1); // drop the white backdrop layer
      stars.push(lottie.loadAnimation({ container: $(sel), renderer: 'svg', loop: false, autoplay: false, animationData: data }));
    });
  }
  function playStars() {
    if (reduced()) return;
    stars.forEach((a, i) => setTimeout(() => a.goToAndPlay(0, true), i * 180));
  }
  function stopStars() { stars.forEach((a) => a.goToAndStop(0, true)); }

  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------
  const state = {
    r: 0,          // round index
    words: [],     // the idiom's words, in order
    placed: 0,     // how many words the student has placed
    done: false,   // the student built the whole idiom
    showing: false // the answer is shown with જવાબ જુઓ
  };
  let wrongTimers = new Map();

  function round() { return ROUNDS[state.r]; }

  // ---------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------
  function loadRound(r) {
    state.r = r;
    const R = round();
    state.words = R.idiom.split(' ');
    state.placed = 0;
    state.done = false;
    state.showing = false;
    wrongTimers.forEach((t) => clearTimeout(t));
    wrongTimers = new Map();
    stopStars();

    // picture
    if (R.picText) {
      picImg.removeAttribute('src');
      picImg.alt = '';
      picText.textContent = R.picText;
      picText.hidden = false;
      picText.setAttribute('aria-label', TXT.picAlt(r + 1));
    } else {
      picText.hidden = true;
      picImg.src = `assets/images/idiom-${pad(r + 1)}.svg`;
      picImg.alt = TXT.picAlt(r + 1);
    }

    // tray: one blank per word
    tray.classList.remove('is-done');
    slotsEl.innerHTML = state.words.map((_, i) => `<span class="slot" data-i="${i}" aria-label="ખાલી જગ્યા ${i + 1}"></span>`).join('');

    // word bank, in random order
    bank.innerHTML = '';
    shuffle(R.words).forEach((w) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = w;
      b.dataset.word = w;
      bank.appendChild(b);
    });

    // result
    meaningEl.textContent = R.meaning;
    // one inner span, so the spaces around the bold part are kept
    usageEl.innerHTML = '<span>' + esc(R.use).replace(/\[([^\]]+)\]/g, '<b>$1</b>') + '</span>';
    showResult(false);

    answerBtn.disabled = false;
    setAnswerBtn(false);
    nextBtn.textContent = r === ROUNDS.length - 1 ? TXT.again : TXT.next;
  }

  function fillSlot(i, word, isAnswer) {
    const s = slotsEl.querySelector(`.slot[data-i="${i}"]`);
    s.classList.add('is-filled');
    s.classList.toggle('is-answer', !!isAnswer);
    s.innerHTML = `<span>${esc(word)}</span>`;
    s.setAttribute('aria-label', word);
  }

  function clearSlot(i) {
    const s = slotsEl.querySelector(`.slot[data-i="${i}"]`);
    s.classList.remove('is-filled', 'is-answer');
    s.innerHTML = '';
    s.setAttribute('aria-label', `ખાલી જગ્યા ${i + 1}`);
  }

  function showResult(on) {
    result.hidden = !on;
    bank.hidden = on;
    tray.classList.toggle('is-done', on);
    if (on) {
      fitText(meaningEl, 48, 32);
      fitText(usageEl, 44, 30);
    }
  }

  function setAnswerBtn(showing) {
    answerBtn.textContent = showing ? TXT.answerHide : TXT.answerShow;
    answerBtn.classList.toggle('is-hide', showing);
    answerBtn.setAttribute('aria-pressed', showing ? 'true' : 'false');
  }

  // ---------------------------------------------------------------------
  // Playing
  // ---------------------------------------------------------------------
  function choose(chip) {
    if (state.done || state.showing || chip.classList.contains('is-used')) return;
    const want = state.words[state.placed];
    if (chip.dataset.word === want) {
      chip.classList.remove('is-wrong');
      chip.classList.add('is-used');
      chip.disabled = true;
      fillSlot(state.placed, want, false);
      state.placed++;
      if (state.placed === state.words.length) complete();
      else {
        announce(TXT.good(want));
        // keep keyboard focus in the bank
        const nextChip = bank.querySelector('.chip:not(.is-used)');
        if (nextChip && document.activeElement === chip) nextChip.focus({ preventScroll: true });
      }
      return;
    }
    // wrong word, or right word in the wrong order
    clearTimeout(wrongTimers.get(chip));
    chip.classList.remove('is-wrong');
    void chip.offsetWidth; // restart the shake
    chip.classList.add('is-wrong');
    wrongTimers.set(chip, setTimeout(() => chip.classList.remove('is-wrong'), 900));
    announce(TXT.wrong);
  }

  function complete() {
    state.done = true;
    answerBtn.disabled = true;
    announce(TXT.done(round().idiom, round().meaning));
    playStars();
    setTimeout(() => {
      if (!state.done) return;
      showResult(true);
      nextBtn.focus({ preventScroll: true });
    }, reduced() ? 0 : 550);
  }

  function toggleAnswer() {
    if (state.done) return;
    state.showing = !state.showing;
    setAnswerBtn(state.showing);
    if (state.showing) {
      for (let i = state.placed; i < state.words.length; i++) fillSlot(i, state.words[i], true);
      showResult(true);
      announce(`${round().idiom}. અર્થ: ${round().meaning}.`);
    } else {
      // put the student's own progress back
      for (let i = state.placed; i < state.words.length; i++) clearSlot(i);
      showResult(false);
    }
  }

  bank.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip) choose(chip);
  });
  answerBtn.addEventListener('click', toggleAnswer);
  nextBtn.addEventListener('click', () => {
    loadRound((state.r + 1) % ROUNDS.length);
    const first = bank.querySelector('.chip');
    if (first && document.activeElement === nextBtn) first.focus({ preventScroll: true });
  });

  // ---------------------------------------------------------------------
  // Go
  // ---------------------------------------------------------------------
  loadRound(0);

  // Fonts can arrive after the first layout: re-fit the result text then.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (!result.hidden) showResult(true); });
  }
})();
