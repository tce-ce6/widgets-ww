/* Double Agent Words (wg237): label a word as a noun or a verb in two sentences, for each of 20 cases. */
(function () {
  'use strict';

  const { sets } = window.DOUBLE_AGENT_CONTENT;

  /* Frames of the Lottie timeline. The paper is settled on the folder from PAPER_SET to PAPER_THROW. */
  const FRAME = {
    OPEN: 0,
    PAPER_ENTER: 41,
    PAPER_SET: 72,
    PAPER_THROW: 152,
    PAPER_GONE: 183,
    FOLDER_CLOSED: 210,
  };
  const PAPER_LAYER = 'Layer 3';
  const SENTENCE_FONT_MIN = 32;
  const WHY_FONT_MIN = 24;

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = $('stage');
  const modalStage = $('modal-stage');
  const animBox = $('anim');
  const sheet = $('screen-game');
  const rowsBox = $('rows');
  const mainBtn = $('mainBtn');
  const status = $('status');
  const helpCard = $('helpCard');

  const paper = window.ANIM_DATA.layers.find((layer) => layer.nm === PAPER_LAYER).ks;

  let anim = null;
  let onAnimDone = null;
  let order = [];
  let index = 0;
  let unmasked = 0;
  let picks = [];
  let checked = false;
  let busy = false;
  let helpReturn = null;

  /** Fits the fixed 1920x1080 stage (and the popup stage) inside the window, centred. */
  function fitStage() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    const x = (window.innerWidth - 1920 * scale) / 2;
    const y = (window.innerHeight - 1080 * scale) / 2;
    const transform = `translate(${x}px, ${y}px) scale(${scale})`;
    stage.style.transform = transform;
    modalStage.style.transform = transform;
  }

  function goTo(id) {
    document.querySelectorAll('.screen.is-active').forEach((screen) => screen.classList.remove('is-active'));
    $(`screen-${id}`).classList.add('is-active');
  }

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const shuffle = (list) => {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const sameJob = (set) => set.sentences[0].answer === set.sentences[1].answer;

  /** All 20 sets in a new order, with no two same-job sets back to back, and each set's sentences shuffled. */
  function shuffledGame() {
    let list;
    do {
      list = shuffle(sets);
    } while (list.some((set, i) => i > 0 && sameJob(set) && sameJob(list[i - 1])));
    return list.map((set) => ({ word: set.word, sentences: shuffle(set.sentences) }));
  }

  const pad = (n) => String(n).padStart(2, '0');

  /** "You unmasked 03 of 20 agents!" with the two numbers in bold. */
  function fillScore(node) {
    node.textContent = '';
    node.append('You unmasked ', el('b', '', pad(unmasked)), ' of ', el('b', '', String(sets.length)), ' agents!');
  }

  /* ---------- keeping the page in step with the paper in the Lottie ---------- */

  /** Solves a keyframe's ease curve (the same bezier After Effects exported) for a time fraction. */
  function ease(t, x1, y1, x2, y2) {
    const curve = (a, b, u) => 3 * a * u * (1 - u) * (1 - u) + 3 * b * u * u * (1 - u) + u * u * u;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (curve(x1, x2, mid) < t) lo = mid;
      else hi = mid;
    }
    return curve(y1, y2, (lo + hi) / 2);
  }

  const first = (value) => (Array.isArray(value) ? value[0] : value);

  /** Value of an animated Lottie property at a frame. */
  function sample(keys, frame) {
    if (frame <= keys[0].t) return keys[0].s[0];
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i];
      const b = keys[i + 1];
      if (frame < b.t) {
        const t = (frame - a.t) / (b.t - a.t);
        const eased = ease(t, first(a.o.x), first(a.o.y), first(a.i.x), first(a.i.y));
        return a.s[0] + (b.s[0] - a.s[0]) * eased;
      }
    }
    return keys[keys.length - 1].s[0];
  }

  const settledX = sample(paper.p.k, FRAME.PAPER_SET);

  /** Moves the page content with the paper layer, and hides it while that layer is not on screen. */
  function syncSheet(frame) {
    const onScreen = frame >= FRAME.PAPER_ENTER && frame < FRAME.PAPER_GONE;
    sheet.style.visibility = onScreen ? 'visible' : 'hidden';
    if (!onScreen) return;
    sheet.style.transform = `translateX(${sample(paper.p.k, frame) - settledX}px)`;
    sheet.style.opacity = sample(paper.o.k, frame) / 100;
  }

  function playAnim(from, to, done) {
    busy = true;
    const finish = () => {
      busy = false;
      syncSheet(to);
      done();
    };
    if (reduceMotion) {
      anim.goToAndStop(to, true);
      finish();
      return;
    }
    onAnimDone = finish;
    syncSheet(from);
    anim.playSegments([from, to], true);
  }

  function createAnim() {
    anim = window.lottie.loadAnimation({
      container: animBox,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: window.ANIM_DATA,
    });
    anim.addEventListener('enterFrame', () => syncSheet(anim.firstFrame + anim.currentFrame));
    anim.addEventListener('complete', () => {
      const done = onAnimDone;
      onAnimDone = null;
      if (done) done();
    });
    return new Promise((resolve) => anim.addEventListener('DOMLoaded', resolve));
  }

  /* ---------- a case ---------- */

  /** Long lines step down in size, to stay on their one row of the paper. */
  function fitLine(node, minSize) {
    node.style.fontSize = '';
    let size = parseFloat(window.getComputedStyle(node).fontSize);
    while (size > minSize && node.scrollWidth > node.clientWidth) {
      size -= 1;
      node.style.fontSize = `${size}px`;
    }
  }

  function renderSentence(text) {
    const node = el('p', 'sentence');
    const [before, word, after] = text.split(/\[|\]/);
    node.append(before, el('span', 'target', word), after);
    return node;
  }

  function jobButton(job, label, rowIndex) {
    const btn = el('button', `job job--${job}`, label);
    btn.type = 'button';
    btn.dataset.job = job;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => pick(rowIndex, job));
    return btn;
  }

  function renderCase() {
    const current = order[index];
    checked = false;
    picks = [null, null];

    const prompt = $('prompt');
    prompt.textContent = '';
    prompt.append('Which job is “', el('strong', '', current.word), '” doing in each report?');

    rowsBox.textContent = '';
    current.sentences.forEach((sentence, i) => {
      const row = el('div', `row row--${i + 1}`);
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', `Sentence ${i + 1}`);
      const line = renderSentence(sentence.text);
      const why = el('p', 'why');
      why.setAttribute('aria-live', 'polite');
      row.append(line, jobButton('noun', 'Noun', i), jobButton('verb', 'Verb', i), why);
      rowsBox.appendChild(row);
      fitLine(line, SENTENCE_FONT_MIN);
    });

    mainBtn.className = 'pill main-btn is-check';
    mainBtn.textContent = 'Check';
    mainBtn.disabled = true;
  }

  function pick(rowIndex, job) {
    if (busy || checked) return;
    picks[rowIndex] = job;
    rowsBox.children[rowIndex].querySelectorAll('.job').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.job === job));
    });
    mainBtn.disabled = picks.includes(null);
  }

  function check() {
    const current = order[index];
    checked = true;
    let bothRight = true;

    current.sentences.forEach((sentence, i) => {
      const row = rowsBox.children[i];
      const right = picks[i] === sentence.answer;
      if (!right) bothRight = false;

      row.querySelectorAll('.job').forEach((btn) => {
        btn.disabled = true;
      });

      const stamp = el('span', `verdict verdict--${sentence.answer}`, sentence.answer === 'noun' ? 'Noun' : 'Verb');
      stamp.setAttribute('aria-hidden', 'true');
      row.querySelector('.target').appendChild(stamp);

      const why = row.querySelector('.why');
      why.append(
        el('strong', right ? 'is-ok' : 'is-no', right ? 'Correct!' : 'Not quite.'),
        ` ${sentence.why} It's a ${sentence.answer}.`,
      );
      fitLine(why, WHY_FONT_MIN);
    });

    if (bothRight) unmasked += 1;
    fillScore(status);

    const last = index === order.length - 1;
    mainBtn.className = `pill main-btn ${last ? 'is-final' : 'is-next'}`;
    mainBtn.textContent = last ? 'See final result' : 'Next case';
    mainBtn.focus({ preventScroll: true });
  }

  function focusFirstChoice() {
    rowsBox.querySelector('.job').focus({ preventScroll: true });
  }

  function nextCase() {
    if (index === order.length - 1) {
      playAnim(FRAME.PAPER_THROW, FRAME.FOLDER_CLOSED, finish);
      return;
    }
    playAnim(FRAME.PAPER_THROW, FRAME.PAPER_GONE, () => {
      index += 1;
      renderCase();
      playAnim(FRAME.PAPER_ENTER, FRAME.PAPER_SET, focusFirstChoice);
    });
  }

  function onMainButton() {
    if (busy || mainBtn.disabled) return;
    if (checked) nextCase();
    else check();
  }

  /* ---------- screens ---------- */

  function startGame() {
    order = shuffledGame();
    index = 0;
    unmasked = 0;
    fillScore(status);
    status.hidden = false;

    goTo('game');
    renderCase();
    animBox.classList.add('is-on');
    anim.goToAndStop(FRAME.OPEN, true);
    playAnim(FRAME.OPEN, FRAME.PAPER_SET, focusFirstChoice);
  }

  function finish() {
    fillScore($('endScore'));
    goTo('end');
    $('endScore').focus({ preventScroll: true });
  }

  function backToBriefing() {
    status.hidden = true;
    animBox.classList.remove('is-on');
    goTo('start');
    $('startBtn').focus({ preventScroll: true });
  }

  /* ---------- help ---------- */

  function openHelp() {
    helpReturn = document.activeElement;
    helpCard.hidden = false;
    document.body.classList.add('has-modal');
    stage.inert = true;
    $('helpClose').focus({ preventScroll: true });
  }

  function closeHelp() {
    helpCard.hidden = true;
    document.body.classList.remove('has-modal');
    stage.inert = false;
    if (helpReturn && helpReturn !== document.body) helpReturn.focus({ preventScroll: true });
  }

  $('startBtn').addEventListener('click', startGame);
  mainBtn.addEventListener('click', onMainButton);
  $('againBtn').addEventListener('click', backToBriefing);
  $('helpBtn').addEventListener('click', openHelp);
  $('helpClose').addEventListener('click', closeHelp);
  window.addEventListener('resize', fitStage);
  document.addEventListener('keydown', (event) => {
    if (helpCard.hidden) return;
    if (event.key === 'Escape') closeHelp();
    // Close is the popup's only control, so Tab stays on it.
    if (event.key === 'Tab') event.preventDefault();
  });

  fitStage();

  /* Start waits for the animation and fonts, so that text is measured in the right font. */
  const fonts = ['400 40px Roboto', '500 35px Roboto', '700 40px Roboto'].map((font) => document.fonts.load(font));
  Promise.all([createAnim(), ...fonts]).finally(() => {
    $('startBtn').disabled = false;
  });
})();
