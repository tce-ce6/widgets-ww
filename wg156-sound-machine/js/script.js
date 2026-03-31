// ─── Data ───────────────────────────────────────────────────────────────────

// ─── Data ───────────────────────────────────────────────────────────────────

const wordBanks = {
    cvc: [
        { word: 'cat', sounds: ['c', 'a', 't'], visual: '🐱' },
        { word: 'sun', sounds: ['s', 'u', 'n'], visual: '☀️' },
        { word: 'bus', sounds: ['b', 'u', 's'], visual: '🚌' },
        { word: 'hen', sounds: ['h', 'e', 'n'], visual: '🐔' },
        { word: 'cup', sounds: ['c', 'u', 'p'], visual: '☕' },
        { word: 'fan', sounds: ['f', 'a', 'n'], visual: '🪭' },
        { word: 'man', sounds: ['m', 'a', 'n'], visual: '👨' },
        { word: 'pin', sounds: ['p', 'i', 'n'], visual: '📌' },
        { word: 'run', sounds: ['r', 'u', 'n'], visual: '🏃' },
        { word: 'hut', sounds: ['h', 'u', 't'], visual: '🛖' },
        { word: 'bed', sounds: ['b', 'e', 'd'], visual: '🛏️' },
        { word: 'web', sounds: ['w', 'e', 'b'], visual: '🕸️' },
        { word: 'jet', sounds: ['j', 'e', 't'], visual: '✈️' },
        { word: 'box', sounds: ['b', 'o', 'x'], visual: '📦' },
        { word: 'six', sounds: ['s', 'i', 'x'], visual: '6️⃣' },
        { word: 'lip', sounds: ['l', 'i', 'p'], visual: '👄' },
        { word: 'cap', sounds: ['c', 'a', 'p'], visual: '🧢' },
        { word: 'log', sounds: ['l', 'o', 'g'], visual: '🪵' },
        { word: 'fog', sounds: ['f', 'o', 'g'], visual: '🌫️' },
        { word: 'mug', sounds: ['m', 'u', 'g'], visual: '☕' },
        { word: 'jug', sounds: ['j', 'u', 'g'], visual: '🫗' },
        { word: 'sad', sounds: ['s', 'a', 'd'], visual: '😢' },
        { word: 'tag', sounds: ['t', 'a', 'g'], visual: '🏷️' },
        { word: 'pig', sounds: ['p', 'i', 'g'], visual: '🐷' },
        { word: 'dig', sounds: ['d', 'i', 'g'], visual: '⛏️' },
        { word: 'yam', sounds: ['y', 'a', 'm'], visual: '🍠' },
        { word: 'car', sounds: ['c', 'a', 'r'], visual: '🚗' },
        { word: 'dot', sounds: ['d', 'o', 't'], visual: '⚫' },
        { word: 'top', sounds: ['t', 'o', 'p'], visual: '🔝' },
        { word: 'mop', sounds: ['m', 'o', 'p'], visual: '🧹' },
    ],
    cvcc: [
        { word: 'lamp', sounds: ['l', 'a', 'mp'], visual: '💡' }, { word: 'desk', sounds: ['d', 'e', 'sk'], visual: '🪑' },
        { word: 'milk', sounds: ['m', 'i', 'lk'], visual: '🥛' }, { word: 'pond', sounds: ['p', 'o', 'nd'], visual: '🏞️' },
        { word: 'hand', sounds: ['h', 'a', 'nd'], visual: '✋' }, { word: 'tent', sounds: ['t', 'e', 'nt'], visual: '⛺' },
        { word: 'belt', sounds: ['b', 'e', 'lt'], visual: '👔' }, { word: 'gift', sounds: ['g', 'i', 'ft'], visual: '🎁' },
        { word: 'list', sounds: ['l', 'i', 'st'], visual: '📝' }, { word: 'jump', sounds: ['j', 'u', 'mp'], visual: '🦘' },
        { word: 'camp', sounds: ['c', 'a', 'mp'], visual: '🏕️' }, { word: 'nest', sounds: ['n', 'e', 'st'], visual: '🪺' },
        { word: 'rest', sounds: ['r', 'e', 'st'], visual: '😴' }, { word: 'dust', sounds: ['d', 'u', 'st'], visual: '💨' },
        { word: 'bump', sounds: ['b', 'u', 'mp'], visual: '🤕' }, { word: 'pump', sounds: ['p', 'u', 'mp'], visual: '⛽' },
        { word: 'dent', sounds: ['d', 'e', 'nt'], visual: '🚗' }, { word: 'bent', sounds: ['b', 'e', 'nt'], visual: '📐' },
        { word: 'melt', sounds: ['m', 'e', 'lt'], visual: '🧊' }, { word: 'help', sounds: ['h', 'e', 'lp'], visual: '🆘' },
        { word: 'fast', sounds: ['f', 'a', 'st'], visual: '⚡' }, { word: 'last', sounds: ['l', 'a', 'st'], visual: '🔚' },
        { word: 'best', sounds: ['b', 'e', 'st'], visual: '🏆' }, { word: 'test', sounds: ['t', 'e', 'st'], visual: '📝' },
        { word: 'just', sounds: ['j', 'u', 'st'], visual: '✅' }, { word: 'rust', sounds: ['r', 'u', 'st'], visual: '🟤' },
        { word: 'hint', sounds: ['h', 'i', 'nt'], visual: '💡' }, { word: 'mint', sounds: ['m', 'i', 'nt'], visual: '🌿' },
        { word: 'lift', sounds: ['l', 'i', 'ft'], visual: '🛗' }, { word: 'left', sounds: ['l', 'e', 'ft'], visual: '⬅️' },
        { word: 'soft', sounds: ['s', 'o', 'ft'], visual: '🧸' }, { word: 'golf', sounds: ['g', 'o', 'lf'], visual: '⛳' },
        { word: 'mask', sounds: ['m', 'a', 'sk'], visual: '😷' }, { word: 'tusk', sounds: ['t', 'u', 'sk'], visual: '🐘' },
        { word: 'fist', sounds: ['f', 'i', 'st'], visual: '✊' }, { word: 'king', sounds: ['k', 'i', 'ng'], visual: '👑' },
        { word: 'ring', sounds: ['r', 'i', 'ng'], visual: '💍' }, { word: 'sing', sounds: ['s', 'i', 'ng'], visual: '🎤' },
        { word: 'wing', sounds: ['w', 'i', 'ng'], visual: '🪽' }, { word: 'bank', sounds: ['b', 'a', 'nk'], visual: '🏦' },
        { word: 'tank', sounds: ['t', 'a', 'nk'], visual: '🪖' }, { word: 'pink', sounds: ['p', 'i', 'nk'], visual: '💗' },
        { word: 'sink', sounds: ['s', 'i', 'nk'], visual: '🚰' }, { word: 'link', sounds: ['l', 'i', 'nk'], visual: '🔗' },
    ],
    blendVC: [
        { word: 'stop', sounds: ['st', 'o', 'p'], visual: '🛑' }, { word: 'frog', sounds: ['fr', 'o', 'g'], visual: '🐸' },
        { word: 'drum', sounds: ['dr', 'u', 'm'], visual: '🥁' }, { word: 'step', sounds: ['st', 'e', 'p'], visual: '👣' },
        { word: 'skip', sounds: ['sk', 'i', 'p'], visual: '🏃' }, { word: 'spin', sounds: ['sp', 'i', 'n'], visual: '🌀' },
        { word: 'plan', sounds: ['pl', 'a', 'n'], visual: '📋' }, { word: 'clap', sounds: ['cl', 'a', 'p'], visual: '👏' },
        { word: 'flag', sounds: ['fl', 'a', 'g'], visual: '🚩' }, { word: 'trip', sounds: ['tr', 'i', 'p'], visual: '✈️' },
        { word: 'drop', sounds: ['dr', 'o', 'p'], visual: '💧' }, { word: 'crab', sounds: ['cr', 'a', 'b'], visual: '🦀' },
        { word: 'swim', sounds: ['sw', 'i', 'm'], visual: '🏊' }, { word: 'snap', sounds: ['sn', 'a', 'p'], visual: '📸' },
        { word: 'star', sounds: ['st', 'a', 'r'], visual: '⭐' }, { word: 'stem', sounds: ['st', 'e', 'm'], visual: '🌱' },
        { word: 'grab', sounds: ['gr', 'a', 'b'], visual: '✊' }, { word: 'grin', sounds: ['gr', 'i', 'n'], visual: '😁' },
        { word: 'trap', sounds: ['tr', 'a', 'p'], visual: '🪤' }, { word: 'tree', sounds: ['tr', 'ee'], visual: '🌳' },
        { word: 'twin', sounds: ['tw', 'i', 'n'], visual: '👯' }, { word: 'twig', sounds: ['tw', 'i', 'g'], visual: '🌿' },
        { word: 'drip', sounds: ['dr', 'i', 'p'], visual: '💧' }, { word: 'drag', sounds: ['dr', 'a', 'g'], visual: '🧲' },
        { word: 'flip', sounds: ['fl', 'i', 'p'], visual: '🔄' }, { word: 'flat', sounds: ['fl', 'a', 't'], visual: '🏠' },
        { word: 'flap', sounds: ['fl', 'a', 'p'], visual: '🦅' }, { word: 'plum', sounds: ['pl', 'u', 'm'], visual: '🟣' },
        { word: 'plug', sounds: ['pl', 'u', 'g'], visual: '🔌' }, { word: 'plot', sounds: ['pl', 'o', 't'], visual: '📖' },
        { word: 'clog', sounds: ['cl', 'o', 'g'], visual: '🥿' }, { word: 'clip', sounds: ['cl', 'i', 'p'], visual: '📎' },
        { word: 'club', sounds: ['cl', 'u', 'b'], visual: '♣️' }, { word: 'clam', sounds: ['cl', 'a', 'm'], visual: '🐚' },
        { word: 'glad', sounds: ['gl', 'a', 'd'], visual: '😊' }, { word: 'swan', sounds: ['sw', 'a', 'n'], visual: '🦢' },
        { word: 'slab', sounds: ['sl', 'a', 'b'], visual: '🧱' }, { word: 'slam', sounds: ['sl', 'a', 'm'], visual: '🚪' },
        { word: 'slap', sounds: ['sl', 'a', 'p'], visual: '✋' }, { word: 'slim', sounds: ['sl', 'i', 'm'], visual: '🧍' },
        { word: 'slip', sounds: ['sl', 'i', 'p'], visual: '🍌' }, { word: 'slug', sounds: ['sl', 'u', 'g'], visual: '🐌' },
        { word: 'scan', sounds: ['sc', 'a', 'n'], visual: '📱' }, { word: 'skin', sounds: ['sk', 'i', 'n'], visual: '🧴' },
        { word: 'spot', sounds: ['sp', 'o', 't'], visual: '⚫' }, { word: 'snip', sounds: ['sn', 'i', 'p'], visual: '✂️' },
        { word: 'spun', sounds: ['sp', 'u', 'n'], visual: '🌀' }, { word: 'prop', sounds: ['pr', 'o', 'p'], visual: '🎬' },
        { word: 'pram', sounds: ['pr', 'a', 'm'], visual: '👶' }, { word: 'brim', sounds: ['br', 'i', 'm'], visual: '🎩' },
        { word: 'grow', sounds: ['gr', 'ow'], visual: '🌱' }, { word: 'flow', sounds: ['fl', 'ow'], visual: '🌊' },
        { word: 'glow', sounds: ['gl', 'ow'], visual: '✨' }, { word: 'blow', sounds: ['bl', 'ow'], visual: '💨' },
        { word: 'slow', sounds: ['sl', 'ow'], visual: '🐢' }, { word: 'snow', sounds: ['sn', 'ow'], visual: '❄️' },
        { word: 'show', sounds: ['sh', 'ow'], visual: '📺' }, { word: 'crow', sounds: ['cr', 'ow'], visual: '🐦‍⬛' },
    ],
    blendVCC: [
        { word: 'stamp', sounds: ['st', 'a', 'mp'], visual: '📮' }, { word: 'frost', sounds: ['fr', 'o', 'st'], visual: '❄️' },
        { word: 'crisp', sounds: ['cr', 'i', 'sp'], visual: '🥔' }, { word: 'trunk', sounds: ['tr', 'u', 'nk'], visual: '🐘' },
        { word: 'plant', sounds: ['pl', 'a', 'nt'], visual: '🌱' }, { word: 'stand', sounds: ['st', 'a', 'nd'], visual: '🧍' },
        { word: 'stomp', sounds: ['st', 'o', 'mp'], visual: '🦶' }, { word: 'clamp', sounds: ['cl', 'a', 'mp'], visual: '🗜️' },
        { word: 'stunt', sounds: ['st', 'u', 'nt'], visual: '🏍️' }, { word: 'stink', sounds: ['st', 'i', 'nk'], visual: '🦨' },
        { word: 'skunk', sounds: ['sk', 'u', 'nk'], visual: '🦨' }, { word: 'blank', sounds: ['bl', 'a', 'nk'], visual: '⬜' },
        { word: 'plank', sounds: ['pl', 'a', 'nk'], visual: '🪵' }, { word: 'slant', sounds: ['sl', 'a', 'nt'], visual: '📐' },
        { word: 'grant', sounds: ['gr', 'a', 'nt'], visual: '💰' }, { word: 'craft', sounds: ['cr', 'a', 'ft'], visual: '✂️' },
        { word: 'swept', sounds: ['sw', 'e', 'pt'], visual: '🧹' }, { word: 'split', sounds: ['spl', 'i', 't'], visual: '✂️' },
        { word: 'strap', sounds: ['str', 'a', 'p'], visual: '👜' }, { word: 'strip', sounds: ['str', 'i', 'p'], visual: '📏' },
        { word: 'scrap', sounds: ['scr', 'a', 'p'], visual: '🗑️' }, { word: 'smell', sounds: ['sm', 'e', 'll'], visual: '👃' },
        { word: 'small', sounds: ['sm', 'a', 'll'], visual: '🐜' }, { word: 'skill', sounds: ['sk', 'i', 'll'], visual: '🎯' },
        { word: 'spill', sounds: ['sp', 'i', 'll'], visual: '💧' }, { word: 'still', sounds: ['st', 'i', 'll'], visual: '🤫' },
        { word: 'drill', sounds: ['dr', 'i', 'll'], visual: '🔧' }, { word: 'grill', sounds: ['gr', 'i', 'll'], visual: '🍖' },
        { word: 'press', sounds: ['pr', 'e', 'ss'], visual: '📰' }, { word: 'dress', sounds: ['dr', 'e', 'ss'], visual: '👗' },
        { word: 'grass', sounds: ['gr', 'a', 'ss'], visual: '🌿' }, { word: 'glass', sounds: ['gl', 'a', 'ss'], visual: '🥛' },
        { word: 'class', sounds: ['cl', 'a', 'ss'], visual: '🏫' }, { word: 'cross', sounds: ['cr', 'o', 'ss'], visual: '✝️' },
        { word: 'bless', sounds: ['bl', 'e', 'ss'], visual: '🙏' }, { word: 'crust', sounds: ['cr', 'u', 'st'], visual: '🍞' },
        { word: 'trust', sounds: ['tr', 'u', 'st'], visual: '🤝' }, { word: 'twist', sounds: ['tw', 'i', 'st'], visual: '🌀' },
        { word: 'swift', sounds: ['sw', 'i', 'ft'], visual: '🦅' },
    ],
};

const modeConfig = {
    cvc: { color: '#4ade80', accent: '#22c55e', icon: '🐱', example: 'c · a · t', info: '3 sounds', label: 'CVC Words' },
    cvcc: { color: '#38bdf8', accent: '#0ea5e9', icon: '💡', example: 'l · a · mp', info: '3 tiles · end blend', label: 'CVCC Words' },
    blendVC: { color: '#fbbf24', accent: '#f59e0b', icon: '🛑', example: 'st · o · p', info: '3 tiles · start blend', label: 'Blend + VC' },
    blendVCC: { color: '#f472b6', accent: '#ec4899', icon: '📮', example: 'st · a · mp', info: '3 tiles · both blends', label: 'Blend + VCC' },
};

// ─── State ───────────────────────────────────────────────────────────────────
let currentMode = null;
let currentWord = null;
let droppedSounds = [];
let currentSoundIdx = 0;
let isDropping = false;
let isBlending = false;
let isBlended = false;
let showWord = false;
let usedWords = [];
let audioRef = null;
let toastTimer = null;

// ─── Audio ───────────────────────────────────────────────────────────────────
function getSoundPath(sound) {
    if (!currentMode) return null;
    const modeFolder = currentMode.toLowerCase().startsWith('blend')
        ? currentMode.toLowerCase()
        : 'blend' + currentMode.toLowerCase();
    return `./assets/sound/${modeFolder}/${sound.toLowerCase()}.mp3`;
}

function playPhonemeAudio(sound) {
    const url = getSoundPath(sound);
    if (!url) return;
    if (audioRef) { audioRef.pause(); audioRef.currentTime = 0; }
    const audio = new Audio(url);
    audioRef = audio;
    audio.onerror = () => {
        // Fallback to synthesis only if needed or show error
        console.warn(`Phoneme sound not found: ${url}`);
    };
    audio.play().catch(() => { });
}

function playWordAudio(word) {
    const url = getSoundPath(word);
    if (!url) return;
    if (audioRef) { audioRef.pause(); audioRef.currentTime = 0; }
    const audio = new Audio(url);
    audioRef = audio;
    audio.onerror = () => {
        // Fallback to speech synthesis for words if file is missing
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(word);
        u.lang = 'en-IN'; u.rate = 0.85;
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(x => x.lang === 'en-IN' || x.lang.startsWith('en-IN'));
        if (v) u.voice = v;
        window.speechSynthesis.speak(u);
    };
    audio.play().catch(() => { });
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = '⚠ ' + msg;
    t.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.style.display = 'none'; }, 1800);
}

// ─── Word Logic ───────────────────────────────────────────────────────────────
function getRandomWord() {
    const bank = wordBanks[currentMode];
    const available = bank.filter(w => !usedWords.includes(w.word));
    if (available.length === 0) { usedWords = []; return bank[Math.floor(Math.random() * bank.length)]; }
    return available[Math.floor(Math.random() * available.length)];
}

function startNewWord() {
    currentWord = getRandomWord();
    usedWords.push(currentWord.word);
    droppedSounds = [];
    currentSoundIdx = 0;
    isBlending = false;
    isBlended = false;
    showWord = false;
    isDropping = false;
    render();
}

function dropSound(index) {
    if (!currentWord || index !== currentSoundIdx || isDropping) return;
    isDropping = true;
    const sound = currentWord.sounds[index];
    // Audio is now handled by the global tile click listener
    // Visually mark tile dropped immediately after short delay
    setTimeout(() => {
        droppedSounds.push(sound);
        currentSoundIdx++;
        isDropping = false;
        render();
    }, 350);
    // Immediate visual feedback on tile
    const tiles = document.querySelectorAll('.sound-tile');
    if (tiles[index]) {
        tiles[index].classList.remove('is-current');
        tiles[index].style.opacity = '0.3';
    }
}

function blendSounds() {
    if (droppedSounds.length !== currentWord.sounds.length || isBlending || isBlended) return;
    isBlending = true;
    render();
    setTimeout(() => {
        isBlended = true;
        isBlending = false;
        showWord = true;
        render();
        playWordAudio(currentWord.word);
    }, 1400);
}

function resetCurrentWord() {
    if (!currentWord) return;
    droppedSounds = [];
    currentSoundIdx = 0;
    isBlending = false;
    isBlended = false;
    showWord = false;
    isDropping = false;
    render();
}

function goHome() {
    currentMode = null;
    currentWord = null;
    droppedSounds = [];
    usedWords = [];
    isBlending = false;
    isBlended = false;
    showWord = false;
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('machine-screen').classList.add('hidden');
    document.querySelector('.button-controls').style.display = 'none';
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
    if (!currentWord) return;
    const cfg = modeConfig[currentMode];
    const cc = cfg.color;
    const allDropped = droppedSounds.length === currentWord.sounds.length;

    // ── Sound Tiles ──
    const tilesContainer = document.getElementById('sound-tiles');
    tilesContainer.innerHTML = '';
    currentWord.sounds.forEach((sound, index) => {
        const isDroppedTile = index < droppedSounds.length;
        const isCurrent = index === currentSoundIdx && !isDroppedTile;
        const isBlend = sound.length > 1;

        const tile = document.createElement('div');
        tile.className = 'sound-tile';
        tile.textContent = sound;

        tile.style.borderRadius = isBlend ? '14px' : '10px';
        tile.style.minWidth = isBlend ? 'clamp(50px,8vw,70px)' : 'clamp(40px,6vw,56px)';

        if (isDroppedTile) {
            tile.classList.add('is-dropped');
        } else if (isCurrent) {
            tile.classList.add('is-current');
            tile.style.background = isBlend
                ? 'linear-gradient(160deg,#fbbf24 0%,#f59e0b 100%)'
                : `linear-gradient(160deg,${cc} 0%,${cfg.accent} 100%)`;
            tile.style.boxShadow = `0 6px 24px ${cc}55, 0 0 0 1px ${cc}33`;
            tile.addEventListener('click', () => dropSound(index));
        } else {
            tile.style.background = isBlend
                ? 'linear-gradient(160deg,#fbbf24 0%,#f59e0b 100%)'
                : `linear-gradient(160deg,${cc} 0%,${cfg.accent} 100%)`;
            tile.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)';
            tile.style.color = '#000';
        }

        // Add sound playing on any sound-tile click
        tile.addEventListener('click', () => playPhonemeAudio(sound));
        tilesContainer.appendChild(tile);
    });

    // ── Funnel colours ──
    document.getElementById('funnel-top').style.borderTopColor = cc + '30';
    document.getElementById('funnel-bot').style.borderTopColor = cc + '30';

    // ── Blend Chamber ──
    const chamber = document.getElementById('blend-chamber');
    const content = document.getElementById('chamber-content');
    const gearL = document.getElementById('gear-left');
    const gearR = document.getElementById('gear-right');

    if (isBlending) {
        chamber.classList.add('blending');
        gearL.classList.add('spinning');
        gearR.classList.add('spinning');
    } else {
        chamber.classList.remove('blending');
        gearL.classList.remove('spinning');
        gearR.classList.remove('spinning');
    }

    content.innerHTML = '';
    if (droppedSounds.length === 0) {
        content.innerHTML = '<div style="color:#333;font-size:26px;font-style:italic">Waiting for sounds...</div>';
    } else if (isBlended) {
        const blendedDiv = document.createElement('div');
        blendedDiv.id = 'chamber-blended';
        blendedDiv.style.animation = 'popIn 0.5s ease-out';
        blendedDiv.style.display = 'flex';
        blendedDiv.style.alignItems = 'center';
        blendedDiv.style.gap = '10px';
        const bWord = document.createElement('span');
        bWord.id = 'blended-word';
        bWord.textContent = droppedSounds.join('');
        blendedDiv.appendChild(bWord);
        content.appendChild(blendedDiv);
    } else {
        droppedSounds.forEach(sound => {
            const isBlendSound = sound.length > 1;
            const tile = document.createElement('div');
            tile.className = 'chamber-tile' + (isBlending ? ' merging' : '');
            tile.textContent = sound;
            tile.style.borderRadius = isBlendSound ? '10px' : '7px';
            tile.style.background = isBlendSound
                ? 'linear-gradient(160deg,#fbbf24,#f59e0b)'
                : `linear-gradient(160deg,${cc},${cfg.accent})`;
            tile.addEventListener('click', () => playPhonemeAudio(sound));
            content.appendChild(tile);
        });
    }

    // ── Output Display ──
    const outDisplay = document.getElementById('output-display');
    const outContent = document.getElementById('output-content');
    const outLabel = document.getElementById('output-label');

    // Update the background colour of the output-label to match its parent
    if (showWord && currentWord) {
        outDisplay.classList.add('revealed');
        outContent.style.display = 'block';
        outContent.style.animation = 'popIn 0.5s ease-out';
        document.getElementById('output-emoji').textContent = currentWord.visual;
        const outWord = document.getElementById('output-word');
        outWord.textContent = currentWord.word;
        outWord.style.cursor = 'pointer';
        outWord.onclick = () => playWordAudio(currentWord.word);
    } else {
        outDisplay.classList.remove('revealed');
        outContent.style.display = 'none';
    }

    // ── Blend Button ──
    const btnBlend = document.getElementById('btn-blend');
    if (allDropped && !isBlending && !isBlended) {
        btnBlend.classList.add('ready');
        btnBlend.classList.remove('done');
        btnBlend.disabled = false;
    } else if (isBlending) {
        btnBlend.classList.remove('ready');
        btnBlend.disabled = true;
    } else {
        btnBlend.classList.remove('ready');
        btnBlend.classList.add('done');
        btnBlend.disabled = true;
    }

    // ── Hear button ──
    const btnHear = document.getElementById('btn-hear');
    if (showWord && currentWord) {
        btnHear.classList.remove('hidden');
        btnHear.style.color = cc;
        btnHear.style.borderColor = cc + '88';
    } else {
        btnHear.classList.add('hidden');
    }
}

// ─── Machine Screen Setup ─────────────────────────────────────────────────────
function enterMode(mode) {
    currentMode = mode;
    usedWords = [];

    const cfg = modeConfig[mode];
    const cc = cfg.color;

    // Show machine, hide home
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('machine-screen').classList.remove('hidden');
    document.querySelector('.button-controls').style.display = 'flex';

    // Badge
    const badge = document.getElementById('mode-badge');
    badge.textContent = mode === 'blendVC' ? 'BLEND+VC' : mode === 'blendVCC' ? 'BLEND+VCC' : mode.toUpperCase();
    badge.style.background = cc;

    // Hear button colours will be set in render()
    const btnHear = document.getElementById('btn-hear');
    btnHear.style.color = cc;
    btnHear.style.borderColor = cc + '88';

    startNewWord();
}

// ─── Build Home Cards ─────────────────────────────────────────────────────────
(function buildHomeCards() {
    const grid = document.getElementById('mode-grid');
    Object.entries(modeConfig).forEach(([key, cfg]) => {
        const card = document.createElement('button');
        card.className = 'mode-card';
        card.innerHTML = `
            <span class="mode-card-name" style="color:${cfg.color}">${cfg.label}</span>
            <span class="mode-card-example">${cfg.example}</span>
            <span class="mode-card-badge badge-${key}" >${cfg.info}</span>
        `;

        card.addEventListener('click', () => enterMode(key));
        grid.appendChild(card);
    });
})();

// ─── Button Listeners ─────────────────────────────────────────────────────────
document.getElementById('btn-home').addEventListener('click', goHome);
document.getElementById('btn-reset').addEventListener('click', resetCurrentWord);
document.getElementById('btn-blend').addEventListener('click', blendSounds);
document.getElementById('btn-hear').addEventListener('click', () => { if (currentWord) playWordAudio(currentWord.word); });
document.getElementById('btn-next').addEventListener('click', startNewWord);