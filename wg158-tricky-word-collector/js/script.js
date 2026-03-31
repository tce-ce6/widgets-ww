document.addEventListener("DOMContentLoaded", () => {
  // ─── DATA ───
  const wordBanks = {
    level1: [
      { word: 'the', sentence: 'I see the cat.', hint: 'Most common word!' },
      { word: 'a', sentence: 'I have a dog.', hint: 'Just one letter but tricky!' },
      { word: 'to', sentence: 'I go to school.', hint: 'Sounds like "too" but spelled different!' },
      { word: 'I', sentence: 'I am happy.', hint: 'Always a capital letter!' },
      { word: 'is', sentence: 'She is my friend.', hint: 'The "s" makes a "z" sound!' },
      { word: 'of', sentence: 'The glass of milk is hot.', hint: 'The "f" sounds like "v"!' },
      { word: 'was', sentence: 'He was here.', hint: "Doesn't rhyme with \"has\"!" },
      { word: 'you', sentence: 'I like you.', hint: 'The "ou" is tricky!' },
      { word: 'are', sentence: 'We are friends.', hint: 'Sounds like the letter "R"!' },
      { word: 'my', sentence: 'This is my book.', hint: 'The "y" sounds like "eye"!' },
      { word: 'we', sentence: 'We play together.', hint: 'Sounds like "wee"!' },
      { word: 'be', sentence: 'I want to be kind.', hint: 'Sounds like the letter "B"!' },
      { word: 'no', sentence: 'No, thank you.', hint: 'The "o" says its name!' },
      { word: 'so', sentence: 'I am so happy.', hint: 'Same as "no" - "o" says its name!' },
      { word: 'go', sentence: 'Let us go home.', hint: 'Another "o" saying its name!' },
    ],
    level2: [
      { word: 'said', sentence: 'She said hello.', hint: "Looks like \"sayed\" but isn't!" },
      { word: 'have', sentence: 'I have a pet.', hint: "Silent \"e\" doesn't work here!" },
      { word: 'come', sentence: 'Please come here.', hint: 'The "o" sounds like "u"!' },
      { word: 'some', sentence: 'I want some food.', hint: 'Same trick as "come"!' },
      { word: 'what', sentence: 'What is that?', hint: 'The "wh" is sneaky!' },
      { word: 'were', sentence: 'They were happy.', hint: 'Sounds like "wer"!' },
      { word: 'there', sentence: 'Look over there.', hint: 'Three ways to spell this sound!' },
      { word: 'they', sentence: 'They are playing.', hint: 'The "ey" says "ay"!' },
      { word: 'she', sentence: 'She is tall.', hint: 'The "sh" is a team!' },
      { word: 'he', sentence: 'He runs fast.', hint: 'Just two letters!' },
      { word: 'one', sentence: 'I have one apple.', hint: 'Starts with a "w" sound!' },
      { word: 'do', sentence: 'What do you want?', hint: 'The "o" sounds like "oo"!' },
      { word: 'your', sentence: 'Is this your bag?', hint: 'Sounds like "yor"!' },
      { word: 'all', sentence: 'We all went home.', hint: 'The "a" sounds like "aw"!' },
      { word: 'her', sentence: 'Give it to her.', hint: 'The "er" makes one sound!' },
    ],
    level3: [
      { word: 'would', sentence: 'I would like that.', hint: 'Silent "l" hides inside!' },
      { word: 'could', sentence: 'I could help you.', hint: 'Another silent "l"!' },
      { word: 'should', sentence: 'You should try.', hint: 'Same silent "l" family!' },
      { word: 'their', sentence: 'It is their turn.', hint: 'Sounds like "there"!' },
      { word: 'been', sentence: 'I have been good.', hint: 'Double "e" says "i"!' },
      { word: 'who', sentence: 'Who is that?', hint: 'The "w" is silent!' },
      { word: 'two', sentence: 'I have two hands.', hint: 'Silent "w" again!' },
      { word: 'does', sentence: 'He does his work.', hint: 'The "oe" is tricky!' },
      { word: 'done', sentence: 'I am done.', hint: 'The "o" sounds like "u"!' },
      { word: 'gone', sentence: 'She has gone home.', hint: 'Same "o" trick!' },
      { word: 'want', sentence: 'I want some water.', hint: 'The "a" sounds like "o"!' },
      { word: 'many', sentence: 'I have many toys.', hint: 'The "a" sounds like "e"!' },
      { word: 'any', sentence: 'Do you have any pets?', hint: 'Same trick as "many"!' },
      { word: 'where', sentence: 'Where are you?', hint: 'The "wh" makes a "w" sound!' },
      { word: 'work', sentence: 'I work hard.', hint: 'The "or" sounds like "er"!' },
    ],
    level4: [
      { word: 'friend', sentence: 'You are my friend.', hint: '"i" before "e" but sounds like "end"!' },
      { word: 'once', sentence: 'I clap my hands once.', hint: 'Starts with a "w" sound!' },
      { word: 'only', sentence: 'I have only one.', hint: 'The "o" sounds like "oh"!' },
      { word: 'because', sentence: "I smile because I am happy.", hint: 'Big word, tricky spelling!' },
      { word: 'through', sentence: 'Walk through the door.', hint: 'So many silent letters!' },
      { word: 'thought', sentence: 'I thought about it.', hint: 'The "ough" says "aw"!' },
      { word: 'enough', sentence: 'That is enough.', hint: 'The "ough" says "uff"!' },
      { word: 'people', sentence: 'Many people came.', hint: 'The "eo" is very tricky!' },
      { word: 'again', sentence: 'He jumped again.', hint: 'The "ai" sounds like "e"!' },
      { word: 'water', sentence: 'Drink some water.', hint: 'The "a" sounds like "aw"!' },
      { word: 'laugh', sentence: 'You make me laugh.', hint: 'The "gh" says "f"!' },
      { word: 'eye', sentence: 'Close your left eye.', hint: 'Sounds like the letter "I"!' },
      { word: 'busy', sentence: 'I am very busy.', hint: 'The "u" sounds like "i"!' },
      { word: 'beautiful', sentence: 'It is a beautiful day.', hint: 'So many letters for one word!' },
      { word: 'answer', sentence: 'I know the answer.', hint: 'The "w" is silent!' },
    ],
  };

  const levelCreatures = {
    level1: { emoji: '🕷️', name: 'spider' },
    level2: { emoji: '🐞', name: 'ladybug' },
    level3: { emoji: '🐍', name: 'snake' },
    level4: { emoji: '🦉', name: 'owl' },
  };

  const texts = {
    title: 'Tricky Word Collector',
    selectLevel: 'Choose Your Forest Path',
    level: 'Level',
    beginner: 'Beginner Trail',
    easy: 'Easy Path',
    medium: 'Winding Road',
    advanced: 'Deep Forest',
    wordsInLevel: 'words in this forest',
    tapCreature: 'Tap the',
    catchWord: '🫙 CATCH IT!',
    nextCreature: 'NEXT',
    caught: '✓ In your jar!',
    changePath: '↩ CHANGE PATH',
  };

  // ─── STATE ───
  let state = {
    level: null,
    currentWord: null,
    collectedWords: [],
    showWord: false,
    showSentence: false,
    isCatching: false,
    usedWords: [],
    fireflies: [],
    // When viewing a caught word from the tray, we store it here
    reviewingWord: null,
  };

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const iv = voices.find(v => v.lang === 'en-IN' || v.lang.startsWith('en-IN') || v.name.toLowerCase().includes('india'));
    if (iv) u.voice = iv;
    window.speechSynthesis.speak(u);
  }

  function generateFireflies(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({ id: i, left: Math.random() * 90 + 5, top: Math.random() * 70 + 10, delay: Math.random() * 3, duration: 2 + Math.random() * 2 });
    }
    return arr;
  }

  function getRandomWord() {
    if (!state.level) return null;
    const bank = wordBanks[state.level];
    let available = bank.filter(w => !state.usedWords.includes(w.word));
    if (available.length === 0) { state.usedWords = []; available = bank; }
    return available[Math.floor(Math.random() * available.length)];
  }

  function loadNewWord() {
    state.reviewingWord = null;
    const word = getRandomWord();
    if (word) {
      state.currentWord = word;
      state.usedWords.push(word.word);
      state.showWord = false;
      state.showSentence = false;
      state.isCatching = false;
      render();
    }
  }

  function revealWord() {
    if (state.showWord) return;
    state.showWord = true;
    render();
    speak(state.currentWord.word);
  }

  function revealSentence() {
    if (state.showSentence) return;
    state.showSentence = true;
    render();
    const w = state.reviewingWord || state.currentWord;
    speak(w.sentence);
  }

  function catchWord() {
    if (!state.currentWord || state.collectedWords.find(w => w.word === state.currentWord.word)) return;
    state.isCatching = true;
    speak('Yes!');
    render();
    setTimeout(() => {
      state.collectedWords.push(state.currentWord);
      state.isCatching = false;
      loadNewWord();
    }, 900);
  }

  // Tap a caught word in the tray → show it in the main display
  function reviewCaughtWord(index) {
    const w = state.collectedWords[index];
    state.reviewingWord = w;
    state.showWord = true;
    state.showSentence = false;
    render();
    speak(w.word);
  }

  // Go back from reviewing to the current new-word flow
  function backToForest() {
    state.reviewingWord = null;
    state.showWord = false;
    state.showSentence = false;
    render();
  }

  function selectLevel(key) {
    state.level = key;
    state.currentWord = null;
    state.usedWords = [];
    state.collectedWords = [];
    state.reviewingWord = null;
    state.fireflies = generateFireflies(15);
    render();
  }

  function goToLevelSelect() {
    state.level = null;
    state.currentWord = null;
    state.usedWords = [];
    state.fireflies = [];
    state.reviewingWord = null;
    render();
  }

  // ─── RENDER ───
  function render() {
    const app = document.getElementById('app');
    if (state.level === null) {
      app.innerHTML = renderLevelSelect();
    } else {
      if (!state.currentWord && !state.reviewingWord) loadNewWord();
      else app.innerHTML = renderForest();
    }
  }

  // ── Level Select (unchanged) ──
  function renderLevelSelect() {
    const stars = Array.from({ length: 40 }, (_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const dur = 2 + Math.random() * 2;
      const del = Math.random() * 2;
      return `<div style="position:absolute;left:${left}%;top:${top}%;width:4px;height:4px;border-radius:50%;background:#ffd700;box-shadow:0 0 10px #ffd700,0 0 20px #ffa500;animation:twinkle ${dur}s ease-in-out infinite;animation-delay:${del}s;"></div>`;
    }).join('');

    const levels = [
      { key: 'level1', name: 'beginner', emoji: '🌱', color: '#90EE90', creature: '🕷️' },
      { key: 'level2', name: 'easy', emoji: '🌿', color: '#32CD32', creature: '🐞' },
      { key: 'level3', name: 'medium', emoji: '🌳', color: '#228B22', creature: '🐍' },
      { key: 'level4', name: 'advanced', emoji: '🌲', color: '#006400', creature: '🦉' },
    ];

    const cards = levels.map((lvl, idx) => `
    <button onclick="selectLevel('${lvl.key}')"
      onmouseover="this.style.transform='scale(1.05)';this.style.boxShadow='0 0 30px ${lvl.color}66';"
      onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none';"
      style="padding:25px;background:linear-gradient(180deg,${lvl.color}22 0%,${lvl.color}11 100%);border:3px solid ${lvl.color};border-radius:20px;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;">
      <div style="font-size:40px;margin-bottom:5px;">${lvl.emoji}</div>
      <div style="font-size:28px;margin-bottom:10px;filter:drop-shadow(0 0 8px rgba(255,215,0,0.6));">${lvl.creature}</div>
      <div style="font-size:18px;font-weight:bold;color:${lvl.color};margin-bottom:5px;">${texts[lvl.name]}</div>
      <div style="font-size:14px;color:#888;">${texts.level} ${idx + 1}</div>
      <div style="margin-top:10px;padding:6px 12px;background:${lvl.color}33;border-radius:10px;font-size:11px;color:${lvl.color};">
        ${wordBanks[lvl.key].length} ${texts.wordsInLevel}
      </div>
    </button>
  `).join('');

    return `
    <div style="min-height:100vh;background:linear-gradient(180deg,#1a2f1a 0%,#0d1f0d 50%,#051005 100%);font-family:'Georgia','Times New Roman',serif;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden;">
      ${stars}
      <h2 style="font-size:clamp(16px,3vw,22px);color:#90EE90;margin-bottom:40px;font-weight:normal;font-style:italic;">
        ${texts.selectLevel}
      </h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;max-width:900px;width:100%;">
        ${cards}
      </div>
    </div>`;
  }

  // ── Forest (main game) ──
  function renderForest() {
    const flies = state.fireflies.map(f =>
      `<div style="position:absolute;left:${f.left}%;top:${f.top}%;width:6px;height:6px;border-radius:50%;background:#ffd700;box-shadow:0 0 10px #ffd700,0 0 20px #ffa500;animation:fireflyFloat ${f.duration}s ease-in-out infinite;animation-delay:${f.delay}s;opacity:0.6;pointer-events:none;"></div>`
    ).join('');

    const creature = levelCreatures[state.level];
    const isReviewing = state.reviewingWord !== null;
    const displayWord = isReviewing ? state.reviewingWord : state.currentWord;
    const isAlreadyCaught = displayWord && state.collectedWords.find(w => w.word === displayWord.word);
    const hasTray = state.collectedWords.length > 0;

    // ── Build main display area ──
    let orbArea;

    if (!state.showWord) {
      // Creature orb — tap to reveal
      orbArea = `
      <div style="font-size:16px;color:#ffd700;text-shadow:0 0 10px rgba(255,215,0,0.8);animation:fadeInOut 2s ease-in-out infinite;margin-bottom:8px;">
        👆 ${texts.tapCreature} ${creature.name}!
      </div>
      <div onclick="revealWord()" style="width:120px;height:120px;background:radial-gradient(circle,rgba(255,215,0,1) 0%,rgba(255,200,0,0.8) 30%,rgba(255,165,0,0.4) 60%,transparent 80%);border-radius:50%;display:flex;align-items:center;justify-content:center;animation:fireflyGlow 1.5s ease-in-out infinite;cursor:pointer;box-shadow:0 0 40px rgba(255,215,0,0.8),0 0 80px rgba(255,165,0,0.5),0 0 120px rgba(255,140,0,0.3);">
        <span style="font-size:50px;filter:drop-shadow(0 0 10px rgba(255,215,0,0.8));">${creature.emoji}</span>
      </div>`;
    } else {
      // Word is revealed (either new word or reviewing a caught word)
      const safeWord = (displayWord.word).replace(/'/g, "\\'");
      const safeSentence = (displayWord.sentence).replace(/'/g, "\\'");

      const tapPrompt = !state.showSentence
        ? `<div style="font-size:16px;color:#44ace3;margin-top:6px;animation:fadeInOut 2s ease-in-out infinite;">👆 Tap the word to see it in a sentence</div>`
        : '';

      const sentenceBlock = state.showSentence
        ? `<div style="background:rgba(139,69,19,0.3);border:2px solid #8b4513;border-radius:16px;padding:14px 24px;text-align:center;animation:fadeIn 0.3s ease-out;width:100%;max-width:420px;display:flex;align-items:center;gap:12px;justify-content:center;">
          <div style="flex:1;">
            <div style="font-size:26px;color:#ffd700;font-style:italic;">${displayWord.sentence}</div>
          </div>
          <button onclick="event.stopPropagation();speak('${safeSentence}')" style="flex-shrink:0;width:44px;height:44px;border-radius:50%;background: linear-gradient(180deg, #fff43b, #FF5722);border: 2px solid #ffae3b;color: #FFEB3B;font-size: 28px;cursor:pointer;display:flex;align-items:center;justify-content:center;" title="Hear sentence">🔊</button>
         </div>`
        : '';

      const caughtBadge = isAlreadyCaught
        ? `<div style="position:absolute;top: 120px;right: 30px;background:linear-gradient(135deg,#32CD32,#228B22);padding:5px 12px;border-radius:14px;color:white;font-size: 16px;font-weight:bold;">${texts.caught}</div>`
        : '';

      const catchingAnim = state.isCatching
        ? `<div style="position:absolute;font-size:60px;animation:catchFly 0.9s ease-out forwards;z-index:5;">🫙</div>`
        : '';

      orbArea = `
      ${caughtBadge}
      ${catchingAnim}

      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div onclick="${!state.showSentence ? 'revealSentence()' : ''}" style="cursor:pointer;display:flex;align-items:center;gap:12px;">
          <div style="
            font-size:clamp(48px,10vw,72px);
            font-weight:bold;
            color:#1a1a2e;
            text-shadow:0 2px 4px rgba(0,0,0,0.15);
            animation:revealWord 0.5s ease-out;
            background:radial-gradient(ellipse at center,rgba(255,215,0,0.95) 0%,rgba(255,165,0,0.8) 50%,transparent 75%);
            padding: 66px 80px;
            border-radius:24px;
            ">
            ${displayWord.word}
          </div>
          <button onclick="event.stopPropagation();speak('${safeWord}')" style="flex-shrink:0;width:44px;height:44px;border-radius:50%;background: linear-gradient(180deg, #fff43b, #FF5722);border: 2px solid #ffae3b;color: #FFEB3B;font-size: 28px;cursor:pointer;display:flex;align-items:center;justify-content:center;" title="Hear word">🔊</button>
        </div>
        ${tapPrompt}
      </div>

      ${sentenceBlock}`;
    }

    // ── Action buttons ──
    let actionBtns = '';
    if (state.showWord) {
      if (isReviewing) {
        // Reviewing a caught word — just show a "back" button
        actionBtns = `
        <button onclick="backToForest()" style="padding:14px 32px;font-size:16px;background:linear-gradient(180deg,#4a3728 0%,#2d1f1a 100%);border:2px solid #8b4513;border-radius:24px;color:#deb887;cursor:pointer;">
          ${creature.emoji} Back to catching
        </button>`;
      } else {
        // Normal new-word flow
        actionBtns = `
        ${!isAlreadyCaught && !state.isCatching ? `
          <button onclick="catchWord()" style="padding:16px 36px;font-size:18px;font-weight:bold;background:linear-gradient(180deg,#daa520 0%,#b8860b 100%);border:2px solid #ffd700;border-radius:24px;color: #000000;cursor:pointer;animation:pulse 1.5s ease-in-out infinite;">
            ${texts.catchWord}
          </button>` : ''}
        <button onclick="loadNewWord()" class="btn-wg151" style="font-size:18px;background: linear-gradient(180deg, #e07316 0%, #a3560b 100%);border: 2px solid #c0c627;color: #161514;">
          ${creature.emoji} ${texts.nextCreature}
        </button>`;
      }
    }

    // ── Bottom tray ──
    let trayHTML = '';
    if (hasTray) {
      const cards = state.collectedWords.map((w, i) => {
        const isActive = isReviewing && state.reviewingWord.word === w.word;
        return `<button class="caught-card${isActive ? ' active' : ''}" onclick="reviewCaughtWord(${i})">${w.word}</button>`;
      }).join('');
      trayHTML = `
      <div class="caught-tray">
        <div class="caught-tray-label">🫙 Your Words</div>
        <div class="caught-scroll">${cards}</div>
      </div>`;
    }

    return `
    <div style="min-height:100vh;background:linear-gradient(180deg,#1a2f1a 0%,#0d1f0d 60%,#051005 100%);font-family:'Georgia','Times New Roman',serif;padding:15px;padding-bottom:${hasTray ? '90px' : '15px'};position:relative;overflow:hidden;">
      ${flies}


      <!-- Change Path button fixed bottom-right -->
      <button onclick="goToLevelSelect()" class="btn-wg151" style="position:fixed;bottom:120px;z-index:100;background:transparent;border:none;padding:0;cursor:pointer;opacity:0.85;transition:opacity 0.2s,transform 0.2s;" onmouseover="this.style.opacity='1';this.style.transform='scale(1.1)'" onmouseout="this.style.opacity='0.85';this.style.transform='scale(1)'">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 65.2 65.2">
          <defs><clipPath id="clip-path-home"><rect width="41.456" height="42.837" fill="none"/></clipPath></defs>
          <g transform="translate(924.109 -66.725)">
            <path d="M414.057,241.264H356.465a3.8,3.8,0,0,1-3.8-3.8V179.868a3.8,3.8,0,0,1,3.8-3.8h57.591a3.8,3.8,0,0,1,3.8,3.8v57.591a3.8,3.8,0,0,1-3.8,3.8" transform="translate(-1276.77 -109.339)" fill="#ffc28c"/>
            <path d="M414.057,241.887H356.465a3.8,3.8,0,0,1-3.8-3.8V180.491c.068-1.061.3-2.329,1.114-2.69,3.429-1.529,11,15.958,25.674,31.592,17.892,19.056,39.049,27.581,37.3,31.38-.372.808-1.619,1.047-2.69,1.114" transform="translate(-1276.77 -109.962)" fill="#da8438"/>
            <path d="M411.959,239.166H365.146a3.8,3.8,0,0,1-3.8-3.8V188.548a3.8,3.8,0,0,1,3.8-3.8h46.813a3.8,3.8,0,0,1,3.8,3.8v46.813a3.8,3.8,0,0,1-3.8,3.8" transform="translate(-1280.062 -112.63)" fill="#f4943e"/>
            <g transform="translate(-911.895 77.748)" opacity="0.79">
              <g><g clip-path="url(#clip-path-home)">
                <path d="M372.525,213.289a2.892,2.892,0,0,0,2.73,1.892h.221a.341.341,0,0,1,.34.341v18.435a2.7,2.7,0,0,0,2.7,2.7h7.395a2.7,2.7,0,0,0,2.7-2.7V221.007a.341.341,0,0,1,.34-.341h8.232a.341.341,0,0,1,.34.341v12.951a2.7,2.7,0,0,0,2.7,2.7h7.4a2.7,2.7,0,0,0,2.7-2.7V215.509a.34.34,0,0,1,.382-.332h.029c.05,0,.1,0,.147,0a2.916,2.916,0,0,0,1.916-5.114l-17.815-15.531a2.916,2.916,0,0,0-3.834,0l-17.8,15.531a2.892,2.892,0,0,0-.813,3.221" transform="translate(-372.336 -193.819)" fill="#fff"/>
              </g></g>
            </g>
          </g>
        </svg>
      </button>

      <!-- Main Area -->
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;position:relative;z-index:10;">
        <div style="width:100%;max-width: 600px;min-height: 500px;background:radial-gradient(ellipse at center,rgba(255,215,0,0.08) 0%,transparent 70%);border-radius:30px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap: 30px;position:relative;padding:20px;">
          ${orbArea}
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;">
          ${actionBtns}
        </div>
      </div>
    </div>
    ${trayHTML}`;
  }

  // Expose functions to global scope for inline onclick handlers
  window.selectLevel = selectLevel;
  window.goToLevelSelect = goToLevelSelect;
  window.revealWord = revealWord;
  window.revealSentence = revealSentence;
  window.catchWord = catchWord;
  window.reviewCaughtWord = reviewCaughtWord;
  window.backToForest = backToForest;
  window.loadNewWord = loadNewWord;
  window.speak = speak;

  // Voices
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = () => { };

  render();
});
