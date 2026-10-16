'use strict';

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

document.addEventListener('DOMContentLoaded', () => {
  const POS = window.POS;
  const POS_ORDER = window.POS_ORDER;
  const WHY = window.WHY;
  const SENTENCES = window.SENTENCES;
  const ANIM = window.ANIM_DATA || {};

  /* ==========================================================================
     GEOMETRY (stage px, from the XD artboards)
     ========================================================================== */

  const STAGE_W = 1920;
  const STAGE_H = 1080;

  // Learn cards: 4 x 2 grid
  const CARD_X = [335, 658, 982, 1305];
  const CARD_Y = [188, 531];

  // Practise word boxes: rows of up to 6, centred
  const WORD = { rowTop: [216, 342], perRow: 6 };

  // Butterfly slots on the flowers. `fly` = which Lottie flies it away and where
  // that animation's butterfly sits (comp px) at FLY_FROM, so it takes off in place.
  const BFLY = {
    blue01: { w: 240, h: 240, img: 'bfly-blue01', fly: 'bflyLeft', comp: [725, 600], at: [12, 375] },
    orange: { w: 206, h: 213, img: 'bfly-orange', fly: 'bflyMiddle', comp: [725, 540], at: [519, 355] },
    blue: { w: 232, h: 228, img: 'bfly-blue', fly: 'bflyRight', comp: [650, 560], at: [415, 359] },
  };
  const SLOTS = [
    { kind: 'blue01', x: 610, y: 676 },
    { kind: 'orange', x: 995, y: 715 },
    { kind: 'blue', x: 1240, y: 718 },
    { kind: 'orange', x: 330, y: 705 },
  ];
  // which slots are used for 1..4 words to find
  const SLOT_SETS = { 1: [1], 2: [0, 1], 3: [0, 1, 2], 4: [3, 0, 1, 2] };
  const FLY_FROM = 20; // Lottie frame where the butterfly is fully in view
  const NEXT_DELAY = 3200; // ms: butterflies fly + confetti, then the next sentence

  /* ==========================================================================
     DOM
     ========================================================================== */

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const modalStage = $('modal-stage');
  const screens = {
    home: $('screen-home'),
    learn: $('screen-learn'),
    practise: $('screen-practise'),
  };
  const skyDim = $('skyDim');
  const homeBtn = $('homeBtn');
  const cardsBox = $('cards');
  const wordsBox = $('words');
  const say = $('say');
  const itext = $('practiseItext');
  const bflyBox = $('butterflies');
  const confettiBox = $('confetti');
  const endCard = $('endCard');

  /* ==========================================================================
     STAGE SCALING
     ========================================================================== */

  let stageScale = 1;
  const fitStage = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / STAGE_W, vh / STAGE_H);
    const x = (vw - STAGE_W * stageScale) / 2;
    const y = (vh - STAGE_H * stageScale) / 2;
    const t = `translate(${x}px, ${y}px) scale(${stageScale})`;
    stage.style.transform = t;
    modalStage.style.transform = t; // modals share the stage's position and scale
  };
  fitStage();
  window.addEventListener('resize', fitStage);

  /* ==========================================================================
     NAVIGATION
     ========================================================================== */

  const showScreen = (name) => {
    Object.entries(screens).forEach(([k, el]) => el.classList.toggle('is-active', k === name));
    skyDim.hidden = name === 'practise';
    homeBtn.hidden = name === 'home';
  };

  /* ==========================================================================
     LEARN — flip cards (only one open at a time)
     ========================================================================== */

  const buildCards = () => {
    POS_ORDER.forEach((key, i) => {
      const p = POS[key];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.style.left = `${CARD_X[i % 4]}px`;
      card.style.top = `${CARD_Y[Math.floor(i / 4)]}px`;
      card.style.setProperty('--card-color', p.color);
      card.setAttribute('aria-pressed', 'false');
      card.setAttribute('aria-label', p.label);
      card.innerHTML =
        '<span class="card__inner">' +
        `<span class="card__face card__face--front"><span class="card__name">${p.label}</span><span class="card__tap">Tap me</span></span>` +
        '<span class="card__face card__face--back"><span class="card__panel">' +
        `<span class="card__what">${p.what}</span><span class="card__ex">${p.examples}</span>` +
        '</span></span></span>';
      card.addEventListener('click', () => toggleCard(card));
      cardsBox.appendChild(card);
    });
  };

  const toggleCard = (card) => {
    const open = !card.classList.contains('is-open');
    cardsBox.querySelectorAll('.card').forEach((c) => {
      c.classList.remove('is-open');
      c.setAttribute('aria-pressed', 'false');
      c.setAttribute('aria-label', c.querySelector('.card__name').textContent);
    });
    if (open) {
      card.classList.add('is-open');
      card.setAttribute('aria-pressed', 'true');
      card.setAttribute(
        'aria-label',
        `${card.querySelector('.card__name').textContent}: ${card.querySelector('.card__what').textContent}. ` +
          `Examples: ${card.querySelector('.card__ex').textContent}`
      );
    }
  };

  const closeCards = () => cardsBox.querySelectorAll('.card.is-open').forEach((c) => toggleCard(c));

  const openLearn = () => {
    closeEnd();
    stopPractise();
    closeCards();
    showScreen('learn');
  };

  /* ==========================================================================
     PRACTISE
     ========================================================================== */

  const state = {
    order: [], // shuffled sentence indexes
    n: 0, // position in order
    found: new Set(), // word indexes found in the current sentence
    moving: false, // true while butterflies fly away (taps are ignored)
  };
  let nextTimer = null;
  let flyAnims = [];

  const bare = (w) => w.replace(/[.,!?]+$/, '');
  const shuffled = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const current = () => SENTENCES[state.order[state.n]];
  const targetIdx = (s) => s.words.map((w, k) => (w[1] === s.find ? k : -1)).filter((k) => k >= 0);

  const destroyAnims = () => {
    flyAnims.forEach((a) => a.destroy());
    flyAnims = [];
    confettiBox.innerHTML = '';
  };

  const stopPractise = () => {
    clearTimeout(nextTimer);
    nextTimer = null;
    state.moving = false;
    destroyAnims();
  };

  const startPractise = () => {
    closeEnd();
    stopPractise();
    state.order = shuffled(SENTENCES.map((_, i) => i));
    state.n = 0;
    showScreen('practise');
    startSentence();
  };

  const startSentence = () => {
    const s = current();
    const targets = targetIdx(s);
    const p = POS[s.find];
    state.found = new Set();
    state.moving = false;
    destroyAnims();
    say.hidden = true;

    itext.innerHTML = `Tap the <b>${targets.length === 1 ? p.one : p.many}</b> in the sentence.`;

    // word boxes, centred rows of up to six
    wordsBox.innerHTML = '';
    const rows = WORD.rowTop.map((top) => {
      const r = document.createElement('div');
      r.className = 'words__row';
      r.style.top = `${top}px`;
      wordsBox.appendChild(r);
      return r;
    });
    s.words.forEach(([w], k) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'word';
      btn.textContent = w;
      btn.addEventListener('click', () => tapWord(k, btn));
      rows[Math.floor(k / WORD.perRow)].appendChild(btn);
    });

    // one grey butterfly per word to find
    bflyBox.innerHTML = '';
    (SLOT_SETS[targets.length] || SLOT_SETS[4]).forEach((slotIdx) => {
      const slot = SLOTS[slotIdx];
      const b = BFLY[slot.kind];
      const el = document.createElement('div');
      el.className = 'bfly';
      el.dataset.kind = slot.kind;
      el.style.left = `${slot.x}px`;
      el.style.top = `${slot.y}px`;
      el.style.width = `${b.w}px`;
      el.style.height = `${b.h}px`;
      el.innerHTML =
        `<img class="bfly__grey" src="assets/svg/${b.img}-grey.svg" alt="">` +
        `<img class="bfly__color" src="assets/svg/${b.img}.svg" alt="">`;
      bflyBox.appendChild(el);
    });
  };

  // small burst of the part of speech's colour, centred on the word box
  const sparkle = (btn, color) => {
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 * i) / 12;
      const d = 70 + Math.random() * 45;
      const s = document.createElement('span');
      s.className = 'spark';
      s.style.background = color;
      s.style.setProperty('--dx', `${(Math.cos(a) * d).toFixed(1)}px`);
      s.style.setProperty('--dy', `${(Math.sin(a) * d).toFixed(1)}px`);
      btn.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  };

  const clearWrong = () => {
    wordsBox.querySelectorAll('.word.is-wrong').forEach((w) => w.classList.remove('is-wrong'));
    say.hidden = true;
  };

  const tapWord = (k, btn) => {
    const s = current();
    if (state.moving || state.found.has(k)) return;
    const [word, tag] = s.words[k];

    if (tag === s.find) {
      clearWrong();
      state.found.add(k);
      btn.classList.add('is-found');
      btn.setAttribute('aria-disabled', 'true');
      const tick = document.createElement('span');
      tick.className = 'word__tick';
      btn.appendChild(tick);
      sparkle(btn, POS[s.find].color);

      // colour in the next grey butterfly
      const next = bflyBox.querySelector('.bfly:not(.is-on)');
      if (next) next.classList.add('is-on');

      if (state.found.size === targetIdx(s).length) finishSentence();
      return;
    }

    // wrong tap: shake + red frame + say what the word really is
    clearWrong();
    btn.classList.remove('is-shake');
    void btn.offsetWidth;
    btn.classList.add('is-wrong', 'is-shake');
    const w = bare(word);
    const p = POS[s.find];
    const msg = tag === 'plain' ? `is not ${/^[aeiou]/.test(p.one) ? 'an' : 'a'} ${p.one}. Try another word.` : WHY[tag];
    say.innerHTML = `<b>${w}</b>${msg}`;
    say.hidden = false;
  };

  const playAnim = (container, data, opts = {}) => {
    if (!window.lottie || !data) return null;
    const a = window.lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: JSON.parse(JSON.stringify(data)),
    });
    a.addEventListener('DOMLoaded', () => a.goToAndPlay(opts.from || 0, true));
    flyAnims.push(a);
    return a;
  };

  const finishSentence = () => {
    state.moving = true;
    wordsBox.querySelectorAll('.word').forEach((w) => w.classList.add('is-locked'));

    // every butterfly flies off in place (its Lottie takes over from the still image)
    bflyBox.querySelectorAll('.bfly').forEach((el) => {
      const b = BFLY[el.dataset.kind];
      const box = document.createElement('div');
      box.className = 'bfly-fly';
      box.style.left = `${parseFloat(el.style.left) - b.at[0]}px`;
      box.style.top = `${parseFloat(el.style.top) - b.at[1]}px`;
      box.style.width = `${b.comp[0]}px`;
      box.style.height = `${b.comp[1]}px`;
      bflyBox.appendChild(box);
      if (playAnim(box, ANIM[b.fly], { from: FLY_FROM })) el.classList.add('is-gone');
    });

    const conf = document.createElement('div');
    conf.className = 'confetti__anim';
    confettiBox.appendChild(conf);
    playAnim(conf, ANIM.confetti);

    nextTimer = setTimeout(() => {
      nextTimer = null;
      if (state.n < state.order.length - 1) {
        state.n++;
        startSentence();
      } else {
        openEnd();
      }
    }, NEXT_DELAY);
  };

  /* ==========================================================================
     CLOSING CARD (modal on the body.has-modal backdrop)
     ========================================================================== */

  let endAnim = null;

  const openEnd = () => {
    state.moving = true;
    destroyAnims();
    endCard.hidden = false;
    document.body.classList.add('has-modal');
    if (window.lottie && ANIM.confetti) {
      endAnim = window.lottie.loadAnimation({
        container: $('endConfetti'),
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: JSON.parse(JSON.stringify(ANIM.confetti)),
      });
    }
    $('againBtn').focus();
  };

  function closeEnd() {
    if (endAnim) {
      endAnim.destroy();
      endAnim = null;
    }
    endCard.hidden = true;
    document.body.classList.remove('has-modal');
  }

  /* ==========================================================================
     EVENTS
     ========================================================================== */

  $('toLearnBtn').addEventListener('click', openLearn);
  $('toPractiseBtn').addEventListener('click', startPractise);
  $('learnPractiseBtn').addEventListener('click', startPractise);
  $('endLearnBtn').addEventListener('click', openLearn);
  $('againBtn').addEventListener('click', startPractise);
  homeBtn.addEventListener('click', () => {
    closeEnd();
    stopPractise();
    closeCards();
    showScreen('home');
  });

  /* ==========================================================================
     INIT
     ========================================================================== */

  buildCards();
  showScreen('home');
});
