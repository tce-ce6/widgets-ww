document.addEventListener("DOMContentLoaded", () => {
  const BANK = {
    easy: [
      { word: "aha", clue: "An exclamation of discovery" },
      { word: "eve", clue: "The evening, or the day before" },
      { word: "gig", clue: "A live music performance" },
      { word: "wow", clue: "An exclamation of surprise" },
      { word: "nun", clue: "A woman in a religious order" },
      { word: "sees", clue: "Looks at something" },
      { word: "dad", clue: "Your father" },
      { word: "eye", clue: "You see with this" },
      { word: "mum", clue: "Your mother" },
      { word: "pup", clue: "A baby dog" },
      { word: "gag", clue: "A funny joke" },
      { word: "kook", clue: "An informal word for an eccentric or strange person" },
      { word: "noon", clue: "12 o'clock in the daytime" },
      { word: "peep", clue: "A quick secret look" },
      { word: "deed", clue: "An action, good or bad" },
    ],
    medium: [
      { word: "civic", clue: "Related to a city or its citizens" },
      { word: "kayak", clue: "A small boat you paddle" },
      { word: "level", clue: "Flat and even" },
      { word: "madam", clue: "A polite way to address a lady" },
      { word: "radar", clue: "Used to detect planes and ships" },
      { word: "refer", clue: "To direct someone to something" },
      { word: "rotor", clue: "A spinning blade on a helicopter" },
      { word: "sagas", clue: "Long heroic tales" },
      { word: "solos", clue: "Individual performances" },
      { word: "stats", clue: "Short for statistics" },
      { word: "tenet", clue: "A core belief or principle" },
      { word: "redder", clue: "More red than before" },
      { word: "rotator", clue: "Something that spins things around" },
      { word: "racecar", clue: "A fast vehicle on a track" },
    ],
    hard: [
      { word: "top spot", clue: "The very best position" },
      { word: "step on no pets", clue: "Be kind to animals!" },
      { word: "never odd or even", clue: "A statement about numbers" },
      { word: "nurses run", clue: "Hospital workers in a hurry" },
      { word: "no lemon no melon", clue: "Two fruits you don't have" },
      { word: "was it a car or a cat i saw", clue: "Confused about what you spotted" },
      { word: "do geese see god", clue: "A philosophical bird question" },
      { word: "race fast safe car", clue: "Speed and safety together" },
      { word: "too hot to hoot", clue: "An owl on a scorching day" },
      { word: "borrow or rob", clue: "Two ways to get something that isn't yours" },
    ]
  };

  const BLANK_RATIO = { easy: 0.5, medium: 0.5, hard: 0.45 };
  const HINTS_PER_LEVEL = { easy: 5, medium: 4, hard: 3 };

  let currentLevel = 'easy';
  let currentList = [];
  let currentIndex = 0;
  let blanks = [];
  let selectedBlankIdx = 0;
  let score = 0;
  let streak = 0;
  let hintsLeft = 5;
  let solved = false;
  let keyStates = {};
  let wrongAttempts = 0;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function chooseBlanks(word) {
    const letters = word.split('');
    const letterIndices = [];
    letters.forEach((ch, i) => { if (ch !== ' ') letterIndices.push(i); });

    const ratio = BLANK_RATIO[currentLevel];
    let numBlanks = Math.max(1, Math.round(letterIndices.length * ratio));

    const half = Math.ceil(letterIndices.length / 2);
    const secondHalf = letterIndices.slice(half);
    const firstHalf = letterIndices.slice(0, half);

    let chosen = [];
    const shuffledSecond = shuffle(secondHalf);
    const fromSecond = Math.min(shuffledSecond.length, Math.ceil(numBlanks * 0.65));
    chosen.push(...shuffledSecond.slice(0, fromSecond));

    const remaining = numBlanks - chosen.length;
    if (remaining > 0) {
      const shuffledFirst = shuffle(firstHalf);
      chosen.push(...shuffledFirst.slice(0, remaining));
    }

    return chosen.sort((a, b) => a - b);
  }

  function initLevels() {
    const el = document.getElementById('levels');
    ['easy', 'medium', 'hard'].forEach(lv => {
      const btn = document.createElement('button');
      btn.className = 'lvl-btn' + (lv === currentLevel ? ' active' : '');
      btn.dataset.level = lv;
      btn.textContent = lv.charAt(0).toUpperCase() + lv.slice(1);
      btn.onclick = () => setLevel(lv);
      el.appendChild(btn);
    });
  }

  function setLevel(lv) {
    currentLevel = lv;
    document.querySelectorAll('.lvl-btn').forEach(b => b.classList.toggle('active', b.dataset.level === lv));
    startLevel();
  }

  function startLevel() {
    currentList = shuffle(BANK[currentLevel]).map(item => ({ ...item, status: null }));
    currentIndex = 0;
    score = 0;
    streak = 0;
    hintsLeft = HINTS_PER_LEVEL[currentLevel];
    updateScores();
    renderProgress();
    loadPuzzle();
  }

  function loadPuzzle() {
    solved = false;
    keyStates = {};
    wrongAttempts = 0;
    const item = currentList[currentIndex];
    const word = item.word.toLowerCase();

    const blankIndices = chooseBlanks(word);
    blanks = blankIndices.map(i => ({ index: i, correctLetter: word[i], filled: null }));

    renderSlots(word);
    renderClue(item);
    renderKeyboard();
    renderProgress();
    updateScores();

    selectedBlankIdx = 0;
    highlightSelectedBlank();

    document.getElementById('checkBtn').disabled = true;
    document.getElementById('hintBtn').disabled = (hintsLeft <= 0);
    document.getElementById('nextBtn').classList.remove('visible');
    document.getElementById('puzzleCard').className = 'puzzle-card';
  }

  function renderSlots(word) {
    const row = document.getElementById('slotsRow');
    row.innerHTML = '';

    word.split('').forEach((ch, i) => {
      if (ch === ' ') {
        const gap = document.createElement('div');
        gap.className = 'letter-slot space-gap';
        row.appendChild(gap);
        return;
      }
      const slot = document.createElement('div');
      const blankEntry = blanks.find(b => b.index === i);
      if (blankEntry) {
        slot.className = 'letter-slot blank';
        slot.dataset.blankIdx = blanks.indexOf(blankEntry);
        slot.onclick = () => selectBlank(blanks.indexOf(blankEntry));
      } else {
        slot.className = 'letter-slot given';
        slot.textContent = ch;
      }
      row.appendChild(slot);
    });
  }

  function renderClue(item) {
    const area = document.getElementById('clueArea');
    // let html = `<div class="clue-text">${item.clue}</div>`;
    let html = `<div class="clue-text">An informal word for an eccentric or strange person</div>`;
    /* if (item.word.includes(' ')) {
      const wordCount = item.word.split(' ').length;
      html += `<div class="word-count">${wordCount} words · ${item.word.replace(/\s/g, '').length} letters</div>`;
    } else {
      html += `<div class="word-count">${item.word.length} letters</div>`;
    } */
    area.innerHTML = html;
  }

  function renderKeyboard() {
    const kb = document.getElementById('keyboard');
    kb.innerHTML = '';
    const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

    rows.forEach((rowLetters, ri) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'kb-row';

      rowLetters.split('').forEach(letter => {
        const key = document.createElement('button');
        key.className = 'key';
        if (keyStates[letter] === 'correct') key.classList.add('used-correct');
        if (keyStates[letter] === 'wrong') key.classList.add('used-wrong');
        key.textContent = letter;
        key.dataset.letter = letter;
        key.onclick = () => pressKey(letter);
        rowDiv.appendChild(key);
      });

      if (ri === 2) {
        const back = document.createElement('button');
        back.className = 'key action-key backspace';
        back.textContent = '⌫';
        back.onclick = pressBackspace;
        rowDiv.appendChild(back);
      }

      kb.appendChild(rowDiv);
    });
  }

  function selectBlank(idx) {
    if (solved) return;
    selectedBlankIdx = idx;
    highlightSelectedBlank();
  }

  function highlightSelectedBlank() {
    document.querySelectorAll('.letter-slot.blank').forEach(el => {
      const bi = parseInt(el.dataset.blankIdx);
      el.classList.toggle('selected', bi === selectedBlankIdx);
    });
  }

  function pressKey(letter) {
    if (solved) return;
    if (selectedBlankIdx < 0 || selectedBlankIdx >= blanks.length) return;

    blanks[selectedBlankIdx].filled = letter;
    updateSlotDisplay(selectedBlankIdx);

    // Auto-advance to next empty blank
    let next = -1;
    for (let i = selectedBlankIdx + 1; i < blanks.length; i++) {
      if (blanks[i].filled === null) { next = i; break; }
    }
    if (next === -1) {
      for (let i = 0; i < selectedBlankIdx; i++) {
        if (blanks[i].filled === null) { next = i; break; }
      }
    }
    if (next !== -1) selectedBlankIdx = next;
    highlightSelectedBlank();

    document.getElementById('checkBtn').disabled = !blanks.every(b => b.filled !== null);
  }

  function pressBackspace() {
    if (solved) return;
    const blank = blanks[selectedBlankIdx];
    if (blank && blank.filled !== null) {
      blank.filled = null;
      updateSlotDisplay(selectedBlankIdx);
      document.getElementById('checkBtn').disabled = true;
    } else if (selectedBlankIdx > 0) {
      selectedBlankIdx--;
      blanks[selectedBlankIdx].filled = null;
      updateSlotDisplay(selectedBlankIdx);
      highlightSelectedBlank();
      document.getElementById('checkBtn').disabled = true;
    }
  }

  function updateSlotDisplay(blankIdx) {
    const slot = document.querySelector(`[data-blank-idx="${blankIdx}"]`);
    const blank = blanks[blankIdx];
    if (blank.filled) {
      slot.textContent = blank.filled;
      slot.classList.add('filled');
    } else {
      slot.textContent = '';
      slot.classList.remove('filled');
    }
  }

  function useHint() {
    if (solved || hintsLeft <= 0) return;

    let target = -1;
    const sel = blanks[selectedBlankIdx];
    if (sel && (sel.filled === null || sel.filled !== sel.correctLetter)) {
      target = selectedBlankIdx;
    } else {
      for (let i = 0; i < blanks.length; i++) {
        if (blanks[i].filled === null || blanks[i].filled !== blanks[i].correctLetter) {
          target = i; break;
        }
      }
    }
    if (target === -1) return;

    hintsLeft--;
    blanks[target].filled = blanks[target].correctLetter;
    updateSlotDisplay(target);

    const slot = document.querySelector(`[data-blank-idx="${target}"]`);
    slot.classList.add('correct-letter');

    let next = -1;
    for (let i = 0; i < blanks.length; i++) {
      if (blanks[i].filled === null) { next = i; break; }
    }
    if (next !== -1) selectedBlankIdx = next;
    highlightSelectedBlank();

    document.getElementById('checkBtn').disabled = !blanks.every(b => b.filled !== null);
    document.getElementById('hintBtn').disabled = (hintsLeft <= 0);
    updateScores();
  }

  function checkAnswer() {
    if (solved) return;

    let allCorrect = true;
    blanks.forEach((blank, i) => {
      const slot = document.querySelector(`[data-blank-idx="${i}"]`);
      if (blank.filled === blank.correctLetter) {
        slot.classList.add('correct-letter');
        keyStates[blank.correctLetter] = 'correct';
      } else {
        slot.classList.add('wrong-letter');
        if (blank.filled) keyStates[blank.filled] = 'wrong';
        allCorrect = false;
      }
    });

    renderKeyboard();

    if (allCorrect) {
      solved = true;
      score++;
      streak++;
      currentList[currentIndex].status = wrongAttempts === 0 ? 'solved-perfect' : 'solved';
      document.getElementById('puzzleCard').classList.add('correct-flash');
      document.getElementById('nextBtn').classList.add('visible');
      document.getElementById('checkBtn').disabled = true;
      document.getElementById('hintBtn').disabled = true;
      showToast(getSuccessMessage(), true);
      if (streak >= 3) showStreakFire();
      fireConfetti();
    } else {
      wrongAttempts++;
      streak = 0;
      hideStreakFire();
      showToast('Not quite — try again!', false);
      setTimeout(() => {
        blanks.forEach((blank, i) => {
          const slot = document.querySelector(`[data-blank-idx="${i}"]`);
          if (blank.filled !== blank.correctLetter) {
            blank.filled = null;
            slot.textContent = '';
            slot.classList.remove('filled', 'wrong-letter');
          }
        });
        document.getElementById('checkBtn').disabled = true;
        for (let i = 0; i < blanks.length; i++) {
          if (blanks[i].filled === null) { selectedBlankIdx = i; break; }
        }
        highlightSelectedBlank();
        document.getElementById('puzzleCard').classList.remove('wrong-flash');
      }, 900);
      document.getElementById('puzzleCard').classList.add('wrong-flash');
    }

    updateScores();
    renderProgress();
  }

  function skipWord() {
    if (solved) { nextWord(); return; }
    currentList[currentIndex].status = 'skipped';
    streak = 0;
    hideStreakFire();
    updateScores();
    nextWord();
  }

  function nextWord() {
    currentIndex++;
    if (currentIndex >= currentList.length) {
      showToast(`Level done! ${score}/${currentList.length}`, true);
      setTimeout(() => startLevel(), 1800);
      return;
    }
    loadPuzzle();
  }

  function updateScores() {
    const sc = document.getElementById('scoreCorrect');
    const ss = document.getElementById('scoreStreak');
    const hl = document.getElementById('hintsLeft');
    if (sc) sc.textContent = score;
    if (ss) ss.textContent = streak;
    if (hl) hl.textContent = hintsLeft;
  }

  function renderProgress() {
    const el = document.getElementById('progress');
    // Remove only the word-progress dots, keep stat circles intact
    el.querySelectorAll('.dot').forEach(d => d.remove());
    currentList.forEach((item, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (i === currentIndex) dot.classList.add('current');
      if (item.status === 'solved-perfect') {
        dot.classList.add('solved-perfect');
        dot.textContent = '\uD83D\uDD25'; // 🔥
      } else if (item.status === 'solved') {
        dot.classList.add('solved');
        dot.textContent = '✔'; // ✅
      } else if (item.status === 'skipped') {
        dot.classList.add('skipped');
      }
      el.appendChild(dot);
    });
  }

  function getSuccessMessage() {
    const msgs = ['🎉 Perfect!', '⭐ Brilliant!', '🔥 Nailed it!', '✨ Amazing!',
      '🏆 You got it!', '💪 Well done!', '🌟 Superstar!', '🎯 Spot on!'];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  function showToast(text, success) {
    const t = document.getElementById('toast');
    t.innerHTML = text;
    t.className = 'toast ' + (success ? 'success' : 'fail') + ' show';
    setTimeout(() => t.classList.remove('show'), 1400);
  }

  function showStreakFire() {
    const el = document.getElementById('streakFire');
    el.textContent = streak >= 5 ? '🔥🔥🔥' : streak >= 3 ? '🔥🔥' : '🔥';
    el.classList.add('show');
  }
  function hideStreakFire() { document.getElementById('streakFire').classList.remove('show'); }

  function fireConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#FF7043', '#26A69A', '#FFD54F', '#F48FB1', '#CE93D8', '#81C784'];
    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1,
      });
    }
    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx; p.vy += 0.4; p.y += p.vy;
        p.rotation += p.rotSpeed; p.life -= 0.012;
        if (p.life <= 0) return;
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (alive && frame < 120) { frame++; requestAnimationFrame(animate); }
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
  }

  document.addEventListener('keydown', e => {
    if (solved && e.key === 'Enter') { nextWord(); return; }
    if (e.key === 'Backspace') { pressBackspace(); return; }
    if (e.key === 'Enter') { checkAnswer(); return; }
    const letter = e.key.toLowerCase();
    if (/^[a-z]$/.test(letter)) pressKey(letter);
  });

  // Expose functions to global scope for inline onclick handlers
  window.setLevel = setLevel;
  window.checkAnswer = checkAnswer;
  window.skipWord = skipWord;
  window.nextWord = nextWord;
  window.useHint = useHint;
  window.selectBlank = selectBlank;
  window.pressKey = pressKey;
  window.pressBackspace = pressBackspace;

  initLevels();
  startLevel();
});
