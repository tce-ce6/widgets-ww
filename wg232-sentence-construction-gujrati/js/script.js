// In Electron with nodeIntegration, the UMD build of lottie assigns itself to
// module.exports instead of window.lottie, so pick it up from there.
if (
    !window.lottie &&
    typeof module === 'object' &&
    module &&
    module.exports &&
    typeof module.exports.loadAnimation === 'function'
) {
    window.lottie = module.exports;
}

let words = [];
let blanks = [];
let currentSentence = null;
let wordButtons = [];
let placedBoxes = [];
let sentenceIndex = 0;
let showExample = false;
let sentenceComplete = false;
let gameFinished = false;
let progressFill = 0; // Eased bar value, 0 to 1

let confettiAnim = null;
let trophyAnim = null;

// Everything below is in XD design pixels: the canvas is 1920x1080 and CSS scales it to the window.
const FONT_FAMILY = 'Noto Sans Gujarati';

const INSTRUCTION = 'શરૂ કરવા માટે નીચેના શબ્દો પર એક પછી એક ટેપ કરો. શબ્દ ઉપરના ખાનામાં ગોઠવાશે.';
const HINT_CORRECT = 'સાચું વાક્ય! હવે મોટેથી વાંચો. છેલ્લે પૂર્ણવિરામ મૂકવાનું ભૂલશો નહિ.';
const HINT_SHOW_ANSWER = 'સાચું વાક્ય આ પ્રમાણે થાય. વાક્યના અંતે પૂર્ણવિરામ આવે છે.';
const END_MESSAGE = 'શાબાશ! બધાં વાક્યો પૂરાં થયાં.';
const LABEL_NEXT = 'પછીનું વાક્ય';
const LABEL_REPLAY = 'ફરી રમો';

const SENTENCE_BOX = { x: 27, y: 312, w: 1865, h: 222, r: 47, stroke: 10 };
const BLANK_AREA = { x: 58, w: 1802, gap: 28, lineY: 450 };
const PLACED = { y: 375, h: 97 };
const MERGED = { x: 255, y: 375, w: 1408, h: 97 };
const TILES = { x: 38, w: 1829, y: 571, h: 97, gap: 27, r: 11, maxBaseWidth: 245, padding: 30 };
const HINT = { x: 528, y: 829, w: 865, h: 69, r: 20 };
const PROGRESS = { x: 1511, y: 36, w: 349, h: 45, r: 28, stroke: 10 };
const COUNTER = { x: 1619, y: 91, w: 132, h: 48 };
const COLORS = {
    tile: '#F0DEFF',
    tileStroke: '#9F8DF1',
    wrong: '#FF0000',
    hint: '#43E3BE',
    track: '#2ECAD5',
    trackFill: '#29F1FF',
    trackStroke: '#655AD1',
    counter: '#4536BA',
    banner: '#00EEFF',
    bannerShadow: '#0AB7EB'
};

const WORD_TEXT_SIZE = 54;
const TEXT_DROP = 0.12; // Gujarati sits high on the middle baseline, so nudge it down to look centred
const WRONG_FLASH_FRAMES = 60;
const WORD_FLY_SPEED = 30;

// Sentences from the storyboard (gu_gu_2_wg232_Storyboard.docx). The full stop is a tile, as in the XD.
let sentenceData = [
    { "words": ["મારી", "પાસે", "ત્રણ", "લાલ", "ફુગ્ગા", "છે", "."], "blanks": 7 },
    { "words": ["કિરણ", "પાસે", "નવી", "લાલ", "ટોપી", "છે", "."], "blanks": 7 },
    { "words": ["અમે", "કાલે", "વિજ્ઞાન", "વિષય", "ભણીશું", "."], "blanks": 6 },
    { "words": ["શ્રીકૃષ્ણ", "મીઠી", "વાંસળી", "વગાડે", "છે", "."], "blanks": 6 },
    { "words": ["ઋષિમુનિઓ", "આશ્રમમાં", "યજ્ઞ", "કરતા", "હતા", "."], "blanks": 6 },
    { "words": ["અમારા", "ગામમાં", "એક", "મોટો", "બાગ", "છે", "."], "blanks": 7 },
    { "words": ["કબાટમાં", "અને", "પેટીમાં", "ઘણા", "ઉંદર", "હતા", "."], "blanks": 7 },
    { "words": ["અમારા", "બાગમાં", "એક", "નવો", "હીંચકો", "છે", "."], "blanks": 7 },
    { "words": ["મદારી", "ઢોલક", "વગાડતો", "ગામમાં", "આવ્યો", "."], "blanks": 6 },
    { "words": ["સ્મિતાએ", "આજે", "પીળો", "ડગલો", "પહેર્યો", "છે", "."], "blanks": 7 },
    { "words": ["બિલાડી", "નાના", "ઉંદરની", "પાછળ", "દોડી", "."], "blanks": 6 },
    { "words": ["નદીનું", "પાણી", "બહુ", "ઠંડું", "હતું", "."], "blanks": 6 },
    { "words": ["શિક્ષકે", "અમને", "આશ્રમ", "વિશે", "કહ્યું", "."], "blanks": 6 },
    { "words": ["અમે", "આવતા", "અઠવાડિયે", "પ્રવાસે", "જઈશું", "."], "blanks": 6 },
    { "words": ["મરઘી", "અને", "તેનું", "બચ્ચું", "દાણા", "ખાય", "છે", "."], "blanks": 8 },
    { "words": ["ખિસકોલી", "ઝડપથી", "ઝાડ", "ઉપર", "ચડી", "ગઈ", "."], "blanks": 7 },
    { "words": ["પોપટ", "મીઠું", "જામફળ", "ખાય", "છે", "."], "blanks": 6 },
    { "words": ["બધાં", "છોકરાં", "બાગમાં", "ફુદરડી", "ફરે", "છે", "."], "blanks": 7 },
    { "words": ["દાદાજીએ", "મને", "દસ", "રૂપિયા", "આપ્યા", "."], "blanks": 6 },
    { "words": ["મોટું", "રીંછ", "ધીમે", "ધીમે", "ચાલતું", "હતું", "."], "blanks": 7 },
    { "words": ["વૃક્ષ", "નીચે", "બધાં", "બાળકો", "બેઠાં", "હતાં", "."], "blanks": 7 },
    { "words": ["અમને", "વાંસળીનો", "અવાજ", "બહુ", "ગમ્યો", "."], "blanks": 6 }
];

// --- SETUP AND LIFECYCLE ---

function setup() {
    const canvas = createCanvas(1920, 1080);
    canvas.parent('mainCanvas');

    document.getElementById('show-example-btn').addEventListener('click', toggleShowExample);
    document.getElementById('next-btn').addEventListener('click', loadNextSentence);

    textFont(FONT_FAMILY);

    // Tile widths are measured from the text, so the Gujarati font must be ready first.
    const sample = 'અક્ષર';
    Promise.all([
        document.fonts.load(`400 ${WORD_TEXT_SIZE}px "${FONT_FAMILY}"`, sample),
        document.fonts.load(`700 ${WORD_TEXT_SIZE}px "${FONT_FAMILY}"`, sample)
    ]).catch(() => {}).then(() => loadSentence(sentenceIndex));
}

function draw() {
    clear();
    if (!currentSentence) return;

    drawSentenceContainer();
    drawProgress();

    if (gameFinished) {
        drawEndBanner();
        updateCursor();
        return;
    }

    drawCenteredText(INSTRUCTION, width / 2, 225, 34, NORMAL, width - 80);

    if (showExample || sentenceComplete) {
        drawMergedSentenceBox();
        drawHint(sentenceComplete ? HINT_CORRECT : HINT_SHOW_ANSWER);
    } else {
        drawBlanks();
        drawWordButtons();
        drawPlacedBoxes(); // On top, so a flying word passes over the other tiles
    }

    updateCursor();
}

// --- INTERACTION FUNCTIONS ---

function mousePressed() {
    if (showExample || sentenceComplete || gameFinished || !currentSentence) return;

    for (let i = 0; i < wordButtons.length; i++) {
        const w = wordButtons[i];

        if (isOverWordButton(w)) {
            const firstEmptyBlankIndex = blanks.findIndex((b) => !b.word);

            if (firstEmptyBlankIndex !== -1 && checkPlacement(w.word.text, firstEmptyBlankIndex)) {
                placeWord(w, firstEmptyBlankIndex);
            } else {
                w.feedbackTimer = WRONG_FLASH_FRAMES;
            }
            return false; // Stop processing mouse click
        }
    }
}

function isOverWordButton(w) {
    return !w.word.isPlaced &&
        mouseX > w.x && mouseX < w.x + w.w &&
        mouseY > w.y && mouseY < w.y + w.h;
}

// --- CURSOR UPDATE ---

function updateCursor() {
    const interactive = !showExample && !sentenceComplete && !gameFinished;
    cursor(interactive && wordButtons.some(isOverWordButton) ? HAND : ARROW);
}

// --- DRAWING FUNCTIONS ---

function drawCenteredText(value, x, y, size, style, maxWidth) {
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(style);
    textSize(size);
    if (maxWidth && textWidth(value) > maxWidth) {
        textSize(size * maxWidth / textWidth(value));
    }
    text(value, x, y + textSize() * TEXT_DROP);
    textStyle(NORMAL);
}

function drawSentenceContainer() {
    const b = SENTENCE_BOX;
    const half = b.stroke / 2;
    fill(255);
    stroke(COLORS.tileStroke);
    strokeWeight(b.stroke);
    rect(b.x + half, b.y + half, b.w - b.stroke, b.h - b.stroke, b.r);
}

function drawProgress() {
    const p = PROGRESS;
    const half = p.stroke / 2;
    const done = completedCount();
    const target = done / sentenceData.length;

    // Ease up as sentences finish, and snap straight back on replay.
    progressFill = target < progressFill ? target : progressFill + (target - progressFill) * 0.15;

    stroke(COLORS.trackStroke);
    strokeWeight(p.stroke);
    fill(COLORS.track);
    rect(p.x + half, p.y + half, p.w - p.stroke, p.h - p.stroke, p.r);

    const innerW = p.w - p.stroke * 2;
    const innerH = p.h - p.stroke * 2;
    if (progressFill > 0.001) {
        noStroke();
        fill(COLORS.trackFill);
        rect(p.x + p.stroke, p.y + p.stroke, innerW * progressFill, innerH, innerH / 2);
    }

    noStroke();
    fill(COLORS.counter);
    rect(COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h, COUNTER.h / 2);

    fill(255);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(26);
    text(`${toGujaratiDigits(done)}/${toGujaratiDigits(sentenceData.length)}`, COUNTER.x + COUNTER.w / 2, COUNTER.y + COUNTER.h / 2 + 26 * TEXT_DROP);
    textStyle(NORMAL);
}

function drawBlanks() {
    stroke(0);
    strokeWeight(5);
    for (let i = 0; i < blanks.length; i++) {
        const b = blanks[i];
        if (!b.word) {
            line(b.x, BLANK_AREA.lineY, b.x + b.w, BLANK_AREA.lineY);
        }
    }
}

function drawTile(x, y, w, h, label, borderColor, borderWeight) {
    fill(COLORS.tile);
    stroke(borderColor);
    strokeWeight(borderWeight);
    rect(x, y, w, h, TILES.r);
    drawCenteredText(label, x + w / 2, y + h / 2, WORD_TEXT_SIZE, NORMAL, w - 16);
}

function drawPlacedBoxes() {
    let allAnimatedInPlace = true;
    for (let i = 0; i < placedBoxes.length; i++) {
        const pb = placedBoxes[i];

        const dx = pb.targetX - pb.x;
        const dy = pb.targetY - pb.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            pb.x += (dx / distance) * min(WORD_FLY_SPEED, distance);
            pb.y += (dy / distance) * min(WORD_FLY_SPEED, distance);
            allAnimatedInPlace = false;
        } else {
            pb.x = pb.targetX;
            pb.y = pb.targetY;
        }

        drawTile(pb.x, pb.y, pb.w, pb.h, pb.word.text, COLORS.tileStroke, 2);
    }

    if (!sentenceComplete && allAnimatedInPlace && blanks.every((b) => !!b.word)) {
        sentenceComplete = true;
        updateButtons();
        playConfetti();
    }
}

function drawWordButtons() {
    for (let i = 0; i < wordButtons.length; i++) {
        const w = wordButtons[i];
        if (w.word.isPlaced) continue;

        if (w.feedbackTimer > 0) {
            // Red blink on a wrong tap
            drawTile(w.x, w.y, w.w, w.h, w.word.text, COLORS.wrong, w.feedbackTimer % 20 > 6 ? 5 : 3);
            w.feedbackTimer--;
        } else {
            drawTile(w.x, w.y, w.w, w.h, w.word.text, COLORS.tileStroke, 2);
        }
    }
}

function drawMergedSentenceBox() {
    fill(COLORS.tile);
    stroke(COLORS.tileStroke);
    strokeWeight(5);
    rect(MERGED.x, MERGED.y, MERGED.w, MERGED.h, TILES.r);

    drawCenteredText(
        buildSentenceText(),
        MERGED.x + MERGED.w / 2,
        MERGED.y + MERGED.h / 2,
        WORD_TEXT_SIZE,
        NORMAL,
        MERGED.w - 40
    );
}

function drawHint(message) {
    noStroke();
    fill(COLORS.hint);
    rect(HINT.x, HINT.y, HINT.w, HINT.h, HINT.r);
    drawCenteredText(message, HINT.x + HINT.w / 2, HINT.y + HINT.h / 2, 33, NORMAL, HINT.w - 40);
}

function drawEndBanner() {
    noStroke();
    fill(COLORS.bannerShadow);
    rect(525, 695, 869, 173, 28);
    fill(COLORS.banner);
    rect(543, 677, 832, 173, 28);
    drawCenteredText(END_MESSAGE, 960, 785, 54, BOLD, 780);
}

// --- HELPER FUNCTIONS ---

function completedCount() {
    if (gameFinished) return sentenceData.length;
    return sentenceIndex + (sentenceComplete || showExample ? 1 : 0);
}

function toGujaratiDigits(value) {
    return String(value).replace(/\d/g, (d) => String.fromCharCode(0x0AE6 + Number(d)));
}

// Words joined by spaces, with the full stop attached to the last word.
function buildSentenceText() {
    return currentSentence.words.join(' ').replace(/ \.$/, '.');
}

function checkPlacement(wordText, blankIndex) {
    // Compared by text, so repeated words (ધીમે ધીમે) can go in either order.
    return wordText === currentSentence.words[blankIndex];
}

function placeWord(buttonRef, blankIndex) {
    const blank = blanks[blankIndex];
    blank.word = buttonRef.word;
    buttonRef.word.isPlaced = true;

    const placedWidth = min(buttonRef.w, blank.w);

    placedBoxes.push({
        word: buttonRef.word,
        x: buttonRef.x,
        y: buttonRef.y,
        w: placedWidth,
        h: PLACED.h,
        targetX: blank.x + (blank.w - placedWidth) / 2,
        targetY: PLACED.y
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = floor(random(i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Tiles must never start out in the correct order.
function mixWords(correctWords) {
    const correct = correctWords.join(' ');
    let mixed = shuffleArray(correctWords.slice());
    while (mixed.join(' ') === correct) {
        mixed = shuffleArray(mixed);
    }
    return mixed;
}

function calculateWordWidths(wordList) {
    const count = wordList.length;
    const totalGap = (count - 1) * TILES.gap;
    const base = min(TILES.maxBaseWidth, (TILES.w - totalGap) / count);

    textStyle(NORMAL);
    textSize(WORD_TEXT_SIZE);
    const widths = wordList.map((w) => max(textWidth(w) + TILES.padding * 2, base));

    // A sentence full of long words is squeezed so that the row stays inside the XD margins.
    const total = widths.reduce((sum, w) => sum + w, 0);
    const squeeze = min(1, (TILES.w - totalGap) / total);
    return widths.map((w) => w * squeeze);
}

function loadSentence(index) {
    wordButtons = [];
    blanks = [];
    placedBoxes = [];
    showExample = false;
    sentenceComplete = false;
    stopConfetti();

    currentSentence = sentenceData[index];
    words = mixWords(currentSentence.words);

    // Blanks share the XD line area equally.
    const numWords = currentSentence.words.length;
    const blankWidth = (BLANK_AREA.w - (numWords - 1) * BLANK_AREA.gap) / numWords;
    for (let i = 0; i < numWords; i++) {
        blanks.push({
            x: BLANK_AREA.x + i * (blankWidth + BLANK_AREA.gap),
            w: blankWidth,
            word: null
        });
    }

    // Tiles are centred under the box.
    const widths = calculateWordWidths(words);
    const rowWidth = widths.reduce((sum, w) => sum + w, 0) + (numWords - 1) * TILES.gap;
    let buttonX = TILES.x + (TILES.w - rowWidth) / 2;

    for (let i = 0; i < words.length; i++) {
        wordButtons.push({
            word: { text: words[i], isPlaced: false },
            x: buttonX,
            y: TILES.y,
            w: widths[i],
            h: TILES.h,
            feedbackTimer: 0
        });
        buttonX += widths[i] + TILES.gap;
    }

    updateButtons();
}

function loadNextSentence() {
    if (gameFinished) {
        restartGame();
    } else if (sentenceIndex + 1 < sentenceData.length) {
        sentenceIndex++;
        loadSentence(sentenceIndex);
    } else {
        showEndScreen();
    }
}

function toggleShowExample() {
    if (sentenceComplete || showExample) return;
    showExample = true;
    updateButtons();
}

function showEndScreen() {
    gameFinished = true;
    wordButtons = [];
    stopConfetti();
    updateButtons();
    playTrophy();
    playConfetti();
}

function restartGame() {
    gameFinished = false;
    sentenceIndex = 0;
    stopTrophy();
    loadSentence(sentenceIndex);
}

function updateButtons() {
    const showBtn = document.getElementById('show-example-btn');
    const nextBtn = document.getElementById('next-btn');

    showBtn.style.display = gameFinished ? 'none' : '';
    showBtn.disabled = showExample || sentenceComplete;
    nextBtn.textContent = gameFinished ? LABEL_REPLAY : LABEL_NEXT;
    nextBtn.disabled = !(gameFinished || showExample || sentenceComplete);
}

// --- LOTTIE ---

function loadLottie(containerId, fileName, loop) {
    if (!window.lottie) return null;
    return window.lottie.loadAnimation({
        container: document.getElementById(containerId),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `./assets/animation/${fileName}`
    });
}

function playConfetti() {
    stopConfetti();
    document.getElementById('confetti-lottie').classList.toggle('atEnd', gameFinished);
    confettiAnim = loadLottie('confetti-lottie', 'confetti_01.json', false);
    if (confettiAnim) confettiAnim.addEventListener('complete', stopConfetti);
}

function stopConfetti() {
    if (confettiAnim) {
        confettiAnim.destroy();
        confettiAnim = null;
    }
}

function playTrophy() {
    stopTrophy();
    trophyAnim = loadLottie('trophy-lottie', 'trophy.json', true);
}

function stopTrophy() {
    if (trophyAnim) {
        trophyAnim.destroy();
        trophyAnim = null;
    }
}
