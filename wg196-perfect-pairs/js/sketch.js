/* ================= Perfect Pairs game logic =================
   Ported from js/sketch.js and adapted to the index.html markup:
   - start-btn hides #intro-screen and shows #game-screen
   - 10 cards are dealt in a random order: 5 per row, 2 rows
   - a card shows card-back.svg until clicked, then flips to
     card-front.svg and reveals the word from assets/JSON/pairs.json
   - the status pill and the chain update on every answer
============================================================= */
(function () {
  var FALLBACK_PAIRS = [
    ['boy', 'girl'], ['man', 'woman'], ['gentleman', 'lady'], ['sir', 'madam'],
    ['husband', 'wife'], ['bridegroom', 'bride'], ['father', 'mother'],
    ['brother', 'sister'], ['son', 'daughter'], ['uncle', 'aunt'],
    ['nephew', 'niece'], ['grandfather', 'grandmother'],
    ['grandson', 'granddaughter'], ['stepfather', 'stepmother'],
    ['godfather', 'godmother'], ['king', 'queen'], ['prince', 'princess'],
    ['emperor', 'empress'], ['hero', 'heroine'], ['giant', 'giantess'],
    ['wizard', 'witch'], ['actor', 'actress'], ['waiter', 'waitress'],
    ['host', 'hostess'], ['headmaster', 'headmistress'], ['lion', 'lioness'],
    ['tiger', 'tigress'], ['bull', 'cow'], ['rooster', 'hen'], ['horse', 'mare']
  ];

  var PER_ROUND = 5;                 /* 5 pairs = 10 cards per round */

  var PAIRS = [];
  var pool = [], roundPairs = [], partner = {};
  var first = null, matchedInRound = 0, foundTotal = 0, busy = false, timers = [], msgTimer = null;

  function el(id) { return document.getElementById(id); }
  function shuffle(a) {
    return a.map(function (v) { return [Math.random(), v]; })
            .sort(function (x, y) { return x[0] - y[0]; })
            .map(function (p) { return p[1]; });
  }
  function clearTimers() {
    timers.forEach(clearTimeout); timers = [];
    if (msgTimer) { clearTimeout(msgTimer); msgTimer = null; }
  }
  function after(ms, fn) { timers.push(setTimeout(fn, ms)); }

  /* ---------- screens ---------- */
  function setScreen(which) {
    var intro = el('intro-screen');
    var game = el('game-screen');
    var fin = el('final-screen');
    var pill = el('found-pill');
    if (intro) intro.classList.toggle('hidden', which !== 'intro');
    if (game) game.classList.toggle('hidden', which !== 'game');
    if (fin) fin.classList.toggle('hidden', which !== 'final');
    if (pill) pill.classList.toggle('hidden', which === 'intro');
  }

  /* ---------- status ---------- */
  function updateStatus() {
    var pill = el('found-pill');
    if (pill) pill.textContent = foundTotal + ' of ' + PAIRS.length + ' pairs';
  }
  function setMessage(text, kind) {
    if (msgTimer) { clearTimeout(msgTimer); msgTimer = null; }
    var m = el('msg-pill');
    if (!m) return;
    m.textContent = text || '';
    m.className = 'pill msg-pill' + (kind ? ' ' + kind : '');
    if (text) {
      msgTimer = setTimeout(function () { msgTimer = null; setMessage(''); }, 5 * 60 * 1000);
    }
  }

  /* ---------- lottie celebrations ---------- */
  function createLottie(containerId, path, loop) {
    if (!window.lottie) return null;
    return window.lottie.loadAnimation({
      container: el(containerId),
      renderer: 'svg',
      loop: loop,
      autoplay: false,
      path: path
    });
  }
  var starAnim = createLottie('start-lottie-container', 'assets/JSON/Star.json', false);
  var trophyAnim = createLottie('trophy-lottie', 'assets/JSON/Trophy.json', true);
  var starHide = null;
  function hideStar() {
    starHide = null;
    var scr = el('star-lottie-screen');
    if (scr) { scr.classList.add('hidden'); scr.style.display = 'none'; }
  }
  if (starAnim) {
    starAnim.addEventListener('complete', hideStar);
  }
  function playStar() {
    var scr = el('star-lottie-screen');
    if (scr) { scr.classList.remove('hidden'); scr.style.display = ''; }
    if (starHide) clearTimeout(starHide);
    starHide = setTimeout(hideStar, 2600);  /* safety net if the animation fails to load */
    if (starAnim) { starAnim.stop(); starAnim.setDirection(1); starAnim.goToAndPlay(0); }
  }
  function playTrophy() {
    if (trophyAnim) { trophyAnim.stop(); trophyAnim.setDirection(1); trophyAnim.goToAndPlay(0); }
  }

  /* ---------- rounds ---------- */
  function startGame() {
    clearTimers();
    if (trophyAnim) trophyAnim.stop();
    if (starAnim) { starAnim.stop(); }
    pool = shuffle(PAIRS.slice());
    foundTotal = 0; matchedInRound = 0; first = null; busy = false;
    setMessage('');
    setScreen('game');
    updateStatus();
    dealRound();
  }

  function dealRound() {
    clearTimers();
    busy = false; first = null; matchedInRound = 0;

    /* take the next five pairs off the pool; a pair never repeats a set */
    roundPairs = pool.splice(0, PER_ROUND);
    if (!roundPairs.length) { finish(); return; }

    partner = {};
    roundPairs.forEach(function (p) { partner[p[0]] = p[1]; partner[p[1]] = p[0]; });

    updateStatus();
    setMessage('');

    var chain = el('chain');
    if (chain) {
      chain.innerHTML = '';
      for (var i = 0; i < PER_ROUND; i++) {
        var link = document.createElement('span');
        link.className = 'link';
        link.id = 'link' + i;
        chain.appendChild(link);
      }
    }
    var j = el('joined'); if (j) { j.className = 'joined'; j.innerHTML = ''; }
    var rf = el('roundflash'); if (rf) { rf.className = 'roundflash'; rf.textContent = ''; }

    var words = [].concat.apply([], roundPairs);
    layOut(shuffle(words));
  }

  /* ---------- deal the cards ---------- */
  function layOut(words) {
    var board = el('board');
    if (!board) return;
    board.innerHTML = '';
    busy = true;                       /* no tapping while the cards deal in */
    words.forEach(function (w, i) {
      var c = document.createElement('button');
      c.type = 'button';
      c.className = 'card' + (w.length > 9 ? ' long' : '');
      c.dataset.word = w;
      c.setAttribute('aria-label', 'Card ' + (i + 1) + ', face down');
      c.style.setProperty('--dx', ((i % 2 ? 1 : -1) * (36 + i * 14)) + 'px');
      c.style.setProperty('--dr', ((i % 2 ? 1 : -1) * (8 + i * 2)) + 'deg');
      c.style.animationDelay = (i * 55) + 'ms';
      c.innerHTML =
        '<span class="inner">' +
          '<span class="face back"></span>' +
          '<span class="face front"><span class="word">' + w + '</span></span>' +
        '</span>';
      c.addEventListener('click', function () { turn(c); });
      board.appendChild(c);
    });
    after(words.length * 55 + 480, function () { busy = false; });
  }

  /* ---------- turning cards over ---------- */
  function turn(card) {
    if (busy) return;
    if (card.classList.contains('cleared') || card.classList.contains('flipped')) return;

    card.classList.remove('turnback');
    card.classList.add('flipped');

    if (!first) { first = card; return; }

    var a = first, b = card;
    var isPair = partner[a.dataset.word] === b.dataset.word;
    busy = true;

    if (isPair) {
      var pair = roundPairs.find(function (p) {
        return p[0] === a.dataset.word || p[0] === b.dataset.word;
      });
      after(420, function () {
        var j = el('joined');
        if (j && pair) {
          j.innerHTML = '<span>' + pair[0] + '</span><i></i><span>' + pair[1] + '</span>';
          j.classList.remove('go'); void j.offsetWidth; j.classList.add('go');
        }
        a.classList.add('hit'); b.classList.add('hit');
        var lk = el('link' + matchedInRound);
        if (lk) lk.classList.add('on');
        matchedInRound++; foundTotal++;
        updateStatus();
        setMessage('\u2714 ' + a.dataset.word + ' \u2014 ' + b.dataset.word, 'ok');
        playStar();
      });
      after(1300, function () {
        a.classList.remove('flipped', 'hit'); a.classList.add('cleared');
        b.classList.remove('flipped', 'hit'); b.classList.add('cleared');
        first = null; busy = false;
        if (matchedInRound === roundPairs.length) after(300, endRound);
      });
    } else {
      setMessage('\u2718 Not a pair \u2014 try again', 'no');
      after(480, function () { a.classList.add('miss'); b.classList.add('miss'); });
      after(1000, function () {
        a.classList.remove('miss', 'flipped'); a.classList.add('turnback');
        b.classList.remove('miss', 'flipped'); b.classList.add('turnback');
        first = null; busy = false;
      });
    }
  }

  /* ---------- between rounds ---------- */
  function endRound() {
    if (!pool.length) { finish(); return; }
    var rf = el('roundflash');
    if (rf) {
      rf.textContent = foundTotal <= PER_ROUND
        ? 'Bravo! Five pairs matched.'
        : 'Bravo! Five more pairs matched.';
      rf.classList.remove('go'); void rf.offsetWidth; rf.classList.add('go');
    }
    after(1400, dealRound);
  }

  function finish() {
    clearTimers();
    setMessage('');
    hideStar();
    var board = el('board'); if (board) board.innerHTML = '';
    setScreen('final');
    playTrophy();
  }

  /* ---------- boot ---------- */
  function init() {
    var startBtn = el('start-btn');
    if (startBtn) startBtn.addEventListener('click', startGame);
    var restartBtn = el('restart-btn');
    if (restartBtn) restartBtn.addEventListener('click', startGame);
    setScreen('intro');
    updateStatus();
  }

  fetch('assets/JSON/pairs.json')
    .then(function (r) { if (!r.ok) throw new Error('failed'); return r.json(); })
    .then(function (data) { PAIRS = (data && data.pairs) ? data.pairs : data; init(); })
    .catch(function () { PAIRS = FALLBACK_PAIRS; init(); });
})();