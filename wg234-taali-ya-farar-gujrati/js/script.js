/* ==========================================================================
   wg234 — તાળી કે ફરરર (Clap or Brrr: true or false)
   Grade 2 Gujarati, Lesson 1. Story recall: the class claps (તાળી) for a true
   sentence and says ફરરર for a false one; the teacher taps the answers, then
   તપાસો. 5 rounds × 4 sentences.

   Logic and text: reference/gu_gu_2_wg234.html and the storyboard
   (reference/gu_gu_2_wg234_Storyboard.docx). Layout: the design
   (reference/Assets/gu_gu_2_wg234-Assets.svg).
   ========================================================================== */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);

  /* ---------- stage scaling (1920 x 1080 design px) ---------- */
  const outer = $('#outer');
  function fitStage() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    outer.style.width = `${1920 * s}px`;
    outer.style.height = `${1080 * s}px`;
    document.documentElement.style.setProperty('--s', s);
  }
  fitStage();
  addEventListener('resize', fitStage);

  /* ---------- Gujarati digits ---------- */
  const GU = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  const gu = (n) => String(n).split('').map((d) => GU[+d]).join('');

  /* ---------- sounds (soft click, happy chime, low buzz), as the reference ---------- */
  let AC = null;
  function tone(f, d, t) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const o = AC.createOscillator();
      const g = AC.createGain();
      o.type = t || 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.14, AC.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + d);
      o.connect(g); g.connect(AC.destination);
      o.start(); o.stop(AC.currentTime + d);
    } catch (e) { /* sound is optional */ }
  }
  const click = () => tone(520, 0.07);
  const good = () => { tone(660, 0.12); setTimeout(() => tone(880, 0.18), 110); };
  const bad = () => tone(200, 0.22, 'triangle');

  /* ---------- content: 5 rounds × 4 sentences (a: true = તાળી) ---------- */
  const SETS = [
    [{ s: 'ગામનાં ઘરોમાં જ નહિ, બાગમાં પણ ઉંદર દેખાતા હતા.', a: true, w: 'ઘર, બાગ, પેટી, કબાટ — બધે ઉંદર હતા.' },
     { s: 'ગામના લોકો ઉંદરો જોઈને ખુશ થતા હતા.', a: false, w: 'લોકો તો ઉંદરોથી કંટાળી ગયા હતા.' },
     { s: 'ઉંદરોના લીધે લોકો શાંતિથી સૂઈ શકતા ન હતા.', a: true, w: 'ખાવા, પીવા કે ઊંઘવા — ક્યાંય શાંતિ ન હતી.' },
     { s: 'ગામમાં ફક્ત કાળા રંગના જ ઉંદર હતા.', a: false, w: 'કાળા પણ હતા ને ધોળા પણ; નાના પણ ને મોટા પણ.' }],
    [{ s: 'વાંસળીવાળાએ માથે લાલ રંગની ટોપી પહેરી હતી.', a: true, w: 'લાલ ટોપી અને પીળો ડગલો — એવો તેનો પહેરવેશ હતો.' },
     { s: 'વાંસળીવાળાના વાળ ટૂંકા હતા.', a: false, w: 'તેના વાળ લાંબા હતા, દાઢી જરાક જ હતી.' },
     { s: 'ઉંદર કાઢવા માટે લોકોએ હજાર રૂપિયાનું વચન આપ્યું.', a: true, w: 'લોકોએ કહ્યું હતું કે ઉંદર કાઢો તો હજાર રૂપિયા આપીશું.' },
     { s: 'વાંસળીવાળો ગામમાં ઢોલક વગાડતો આવ્યો હતો.', a: false, w: 'તે વાંસળી વગાડતો હતો, ઢોલક નહિ.' }],
    [{ s: 'વાંસળીનો અવાજ સાંભળીને ઉંદરો દોડી આવ્યા.', a: true, w: 'કોઈ નાચતા, કોઈ કૂદતા — ચારે બાજુથી ઉંદર આવ્યા.' },
     { s: 'ઉંદરો વાંસળીવાળાની આગળ આગળ ચાલતા હતા.', a: false, w: 'વાંસળીવાળો આગળ ચાલતો હતો, ઉંદર પાછળ.' },
     { s: 'વાંસળીવાળો નદી પાર કરી ગયો, પણ ઉંદર ડૂબી ગયા.', a: true, w: 'તે નદી ઓળંગી ગયો; ઉંદર પાણીમાં જ રહી ગયા.' },
     { s: 'નદી જોઈને ઉંદરો પાછા ગામ તરફ ભાગી ગયા.', a: false, w: 'ઉંદરો પણ નદીમાં ઊતર્યા અને ડૂબી ગયા.' }],
    [{ s: 'ઉંદર ગયા પછી લોકોએ તરત જ પોતાનું વચન પાળ્યું.', a: false, w: 'લોકોએ પહેલાં તો પૈસા આપવાની ના પાડી દીધી.' },
     { s: 'પૈસા ન મળતાં વાંસળીવાળાએ ફરીથી વાંસળી વગાડી.', a: true, w: 'તેણે કશું કહ્યા વગર વાંસળી વગાડવા માંડી.' },
     { s: 'બીજી વાર વાંસળી વાગી ત્યારે ગામનાં બાળકો બહાર આવ્યાં.', a: true, w: 'નાનાં-મોટાં બધાં છોકરાં ઘરમાંથી બહાર આવ્યાં.' },
     { s: 'બાળકો ડરી જઈને ઘરમાં જ બેસી રહ્યાં.', a: false, w: 'બાળકો તો નાચતાં-કૂદતાં પાછળ ચાલ્યાં.' }],
    [{ s: 'બાળકોને નદી તરફ જતાં જોઈને લોકો ગભરાઈ ગયા.', a: true, w: 'લોકોને બીક લાગી કે રખેને છોકરાં ડૂબી જાય.' },
     { s: 'છેવટે લોકોએ વાંસળીવાળાને તેના પૈસા આપી દીધા.', a: true, w: 'નદીએ પહોંચીને લોકોએ હજાર રૂપિયા આપી દીધા.' },
     { s: 'બાળકો પણ ઉંદરોની જેમ પાણીમાં ડૂબી ગયાં.', a: false, w: 'પૈસા મળતાં જ વાંસળી બંધ થઈ; બાળકો બચી ગયાં.' },
     { s: 'પૈસા મળ્યા પછી વાંસળીવાળો બીજા ગામ તરફ ચાલ્યો ગયો.', a: true, w: 'હજાર રૂપિયા લઈને તે ચાલતો થયો.' }]
  ];

  const TEXT = {
    instr: 'ચારે વાક્ય વાંચો. દરેકની સામે તાળી કે ફરરર પસંદ કરો.',
    hit: (n) => `આ રાઉન્ડમાં ${gu(n)} સાચા જવાબ મળ્યા.`,
    shown: 'સાચા જવાબ જુઓ. પછીના રાઉન્ડમાં જાતે પ્રયત્ન કરો.',
    yes: 'સાચું. ',
    no: 'ખોટું. '
  };

  /* ---------- state ---------- */
  let rnd = 0;          // current round (0-4)
  let checked = false;  // this round has been checked or shown
  let endTimer = 0;

  const rowsEl = $('#rows');
  const itext = $('#itext');
  const checkBtn = $('#checkBtn');
  const nextBtn = $('#nextBtn');
  const showBtn = $('#showBtn');

  function setItext(text, isResult) {
    itext.textContent = text;
    itext.classList.toggle('result', !!isResult);
  }

  function setProgress(done) {
    $('#progFill').style.width = `${(done / SETS.length) * 100}%`;
    $('#progText').textContent = `${gu(done)} /${gu(SETS.length)}`; // "૦ /૫" as in the XD
    $('#progress').setAttribute('aria-valuenow', done);
  }

  /* ---------- a round ---------- */
  function drawRound() {
    checked = false;
    setItext(TEXT.instr);
    checkBtn.disabled = true;
    nextBtn.disabled = true;
    nextBtn.classList.remove('pulse');
    showBtn.disabled = false;
    rowsEl.innerHTML = '';
    SETS[rnd].forEach((it, k) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.dataset.k = k;
      row.dataset.v = '';
      row.setAttribute('role', 'group');
      row.innerHTML =
        '<p class="sent"></p>' +
        '<button class="pick" type="button" data-v="1" aria-pressed="false">તાળી</button>' +
        '<button class="pick" type="button" data-v="0" aria-pressed="false">ફરરર</button>' +
        '<p class="why"></p>';
      row.querySelector('.sent').textContent = it.s;
      row.setAttribute('aria-label', it.s);
      row.querySelectorAll('.pick').forEach((b) => {
        b.addEventListener('click', () => {
          if (checked) return;
          row.querySelectorAll('.pick').forEach((x) => { x.classList.remove('sel'); x.setAttribute('aria-pressed', 'false'); });
          b.classList.add('sel');
          b.setAttribute('aria-pressed', 'true');
          row.dataset.v = b.dataset.v;
          click();
          // તપાસો only when all four rows are answered
          checkBtn.disabled = [...rowsEl.children].some((r) => r.dataset.v === '');
        });
      });
      rowsEl.appendChild(row);
    });
  }

  // reveal = true: સાચો જવાબ (correct answers, no score, no sound)
  function grade(reveal) {
    checked = true;
    let hit = 0;
    [...rowsEl.children].forEach((row) => {
      const it = SETS[rnd][+row.dataset.k];
      row.querySelectorAll('.pick').forEach((b) => {
        b.disabled = true;
        if (reveal) {
          const on = (b.dataset.v === '1') === it.a;
          b.classList.toggle('sel', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
      });
      if (reveal) {
        row.classList.add('shown');
      } else {
        const right = (row.dataset.v === '1') === it.a;
        row.classList.add(right ? 'ok' : 'no');
        if (right) hit++;
        else { row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake'); }
      }
      row.querySelector('.why').textContent = (it.a ? TEXT.yes : TEXT.no) + it.w;
      row.classList.add('done');
    });

    if (reveal) setItext(TEXT.shown, true);
    else {
      if (hit === SETS[rnd].length) good(); else bad();
      setItext(TEXT.hit(hit), true);
    }
    setProgress(rnd + 1);
    checkBtn.disabled = true;
    showBtn.disabled = true;

    if (rnd < SETS.length - 1) {
      nextBtn.disabled = false;
      nextBtn.classList.add('pulse');
    } else {
      // After round 5: give a moment to read the answers, then the end screen.
      endTimer = setTimeout(showEnd, 3000);
    }
  }

  checkBtn.addEventListener('click', () => { if (!checked) grade(false); });
  showBtn.addEventListener('click', () => { if (!checked) grade(true); });
  nextBtn.addEventListener('click', () => {
    if (rnd < SETS.length - 1) { rnd++; drawRound(); }
  });

  /* ---------- end screen ---------- */
  const endLayer = $('#endLayer');
  let confetti = null;
  function showEnd() {
    endLayer.hidden = false;
    if (window.lottie && window.LOTTIE_DATA && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (confetti) confetti.destroy();
      confetti = lottie.loadAnimation({
        container: $('#confetti'), renderer: 'svg', loop: false, autoplay: true,
        animationData: JSON.parse(JSON.stringify(window.LOTTIE_DATA.confetti))
      });
    }
    good();
    $('#endAgainBtn').focus();
  }
  function hideEnd() {
    endLayer.hidden = true;
    if (confetti) { confetti.destroy(); confetti = null; }
  }
  $('#endClose').addEventListener('click', hideEnd);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !endLayer.hidden) hideEnd(); });

  /* ---------- ફરી રમો: restart from round 1 ---------- */
  function restart() {
    clearTimeout(endTimer);
    hideEnd();
    rnd = 0;
    setProgress(0);
    drawRound();
  }
  $('#againBtn').addEventListener('click', restart);
  $('#endAgainBtn').addEventListener('click', restart);

  /* ---------- what the Help tour needs (js/how-to-play.js) ---------- */
  window.TF = {
    checked: () => checked,
    hideEnd
  };

  /* ---------- start ---------- */
  setProgress(0);
  drawRound();
})();
