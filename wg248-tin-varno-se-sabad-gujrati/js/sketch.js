// Word puzzle game script
// Content: gu_gu_01_wg248 (Gujarati) - 20 three-letter words, 6 letter options each
const words = [
    { "word": "હરણ", "letters": ["ન", "હ", "ણ", "ર", "ડ", "ળ"], "answer": ["હ", "ર", "ણ"], "animation": "01_haran.json", "audio": "01_haran.mp3" },
    { "word": "બરફ", "letters": ["ફ", "ભ", "ર", "બ", "પ", "વ"], "answer": ["બ", "ર", "ફ"], "animation": "02_baraf.json", "audio": "02_baraf.mp3" },
    { "word": "ખડક", "letters": ["ડ", "ક", "ખ", "ઢ", "ભ", "ગ"], "answer": ["ખ", "ડ", "ક"], "animation": "03_khadak.json", "audio": "03_khadak.mp3" },
    { "word": "અડદ", "letters": ["દ", "અ", "ડ", "આ", "ધ", "ઢ"], "answer": ["અ", "ડ", "દ"], "animation": "04_adad.json", "audio": "04_adad.mp3" },
    { "word": "કમળ", "letters": ["ળ", "ક", "લ", "મ", "ખ", "ભ"], "answer": ["ક", "મ", "ળ"], "animation": "05_kamal.json", "audio": "05_kamal.mp3" },
    { "word": "બતક", "letters": ["ત", "બ", "ક", "વ", "થ", "ખ"], "answer": ["બ", "ત", "ક"], "animation": "06_batak.json", "audio": "06_batak.mp3" },
    { "word": "ફણસ", "letters": ["સ", "ફ", "ન", "ણ", "પ", "શ"], "answer": ["ફ", "ણ", "સ"], "animation": "07_phanas.json", "audio": "07_phanas.mp3" },
    { "word": "કળશ", "letters": ["શ", "ક", "ળ", "સ", "લ", "ખ"], "answer": ["ક", "ળ", "શ"], "animation": "08_kalash.json", "audio": "08_kalash.mp3" },
    { "word": "નગર", "letters": ["ગ", "ણ", "ર", "ન", "ઘ", "ડ"], "answer": ["ન", "ગ", "ર"], "animation": "09_nagar.json", "audio": "09_nagar.mp3" },
    { "word": "મગજ", "letters": ["જ", "મ", "ઘ", "ગ", "ઝ", "ભ"], "answer": ["મ", "ગ", "જ"], "animation": "10_magaj.json", "audio": "10_magaj.mp3" },
    { "word": "લસણ", "letters": ["ણ", "લ", "શ", "સ", "ન", "ળ"], "answer": ["લ", "સ", "ણ"], "animation": "11_lasan.json", "audio": "11_lasan.mp3" },
    { "word": "સડક", "letters": ["ક", "ડ", "સ", "ઢ", "શ", "ખ"], "answer": ["સ", "ડ", "ક"], "animation": "12_sadak.json", "audio": "12_sadak.mp3" },
    { "word": "રતન", "letters": ["ન", "ર", "થ", "ત", "ડ", "ણ"], "answer": ["ર", "ત", "ન"], "animation": "13_ratan.json", "audio": "13_ratan.mp3" },
    { "word": "બટન", "letters": ["ન", "બ", "ઠ", "ટ", "વ", "ણ"], "answer": ["બ", "ટ", "ન"], "animation": "14_batan.json", "audio": "14_batan.mp3" },
    { "word": "બળદ", "letters": ["દ", "બ", "લ", "ળ", "ધ", "વ"], "answer": ["બ", "ળ", "દ"], "animation": "15_balad.json", "audio": "15_balad.mp3" },
    { "word": "ખમણ", "letters": ["ણ", "ખ", "ન", "મ", "ભ", "ક"], "answer": ["ખ", "મ", "ણ"], "animation": "16_khaman.json", "audio": "16_khaman.mp3" },
    { "word": "ગરમ", "letters": ["ર", "મ", "ગ", "ઘ", "ભ", "ચ"], "answer": ["ગ", "ર", "મ"], "animation": "17_garam.json", "audio": "17_garam.mp3" },
    { "word": "મગર", "letters": ["ગ", "ભ", "ર", "મ", "ઘ", "ડ"], "answer": ["મ", "ગ", "ર"], "animation": "18_magar.json", "audio": "18_magar.mp3" },
    { "word": "રમત", "letters": ["ય", "ર", "ન", "થ", "મ", "ત"], "answer": ["ર", "મ", "ત"], "animation": "19_ramat.json", "audio": "19_ramat.mp3" },
    { "word": "ગગન", "letters": ["ન", "ગ", "ઘ", "ણ", "ચ", "મ"], "answer": ["ગ", "ગ", "ન"], "animation": "20_gagan.json", "audio": "20_gagan.mp3" }
];

// UI text
const SHOW_ANSWER_TEXT = "જવાબ જુઓ";
const HIDE_ANSWER_TEXT = "જવાબ છુપાવો";

// Game state
let currentWordIndex = -1; // selectNextWord() increments before use, so the first word shown is index 0
let currentWord = null;
let answerSlots = ["", "", ""]; // Three answer slots
let letterButtons = [];
let answerSlotElements = [];
let isAnswerShown = false;
let isSolved = false;
let finalImageTimer = null;

// Audio mapping for letters (assets/audio/letters/)
const letterAudioMap = {
    "અ": "00_a.mp3", "આ": "00_aa.mp3",
    "ક": "01_ka.mp3", "ખ": "02_kha.mp3", "ગ": "03_ga.mp3", "ઘ": "04_gha.mp3",
    "ઙ": "05_nga.mp3", "ચ": "06_cha.mp3", "છ": "07_chha.mp3", "જ": "08_ja.mp3",
    "ઝ": "09_jha.mp3", "ઞ": "10_nya.mp3", "ટ": "11_tta.mp3", "ઠ": "12_ttha.mp3",
    "ડ": "13_dda.mp3", "ઢ": "14_ddha.mp3", "ણ": "15_nna.mp3", "ત": "16_ta.mp3",
    "થ": "17_tha.mp3", "દ": "18_da.mp3", "ધ": "19_dha.mp3", "ન": "20_na.mp3",
    "પ": "21_pa.mp3", "ફ": "22_pha.mp3", "બ": "23_ba.mp3", "ભ": "24_bha.mp3",
    "મ": "25_ma.mp3", "ય": "26_ya.mp3", "ર": "27_ra.mp3", "લ": "28_la.mp3",
    "વ": "29_va.mp3", "શ": "30_sha.mp3", "ષ": "31_ssa.mp3", "સ": "32_sa.mp3",
    "હ": "33_ha.mp3", "ળ": "34_lla.mp3", "ક્ષ": "35_ksha.mp3", "ત્ર": "36_tra.mp3",
    "જ્ઞ": "37_gya.mp3"
};

// --- LOTTIE INTEGRATION CONSTANTS & GLOBALS ---
let currentLottieInstance = null;

const ANIMATION_PATH_BASE = 'assets/json/';
const LETTER_AUDIO_PATH_BASE = 'assets/audio/letters/';
const WORD_AUDIO_PATH_BASE = 'assets/audio/words/';
const LOTTIE_CONTAINER_ID = 'lottie-wrapper'; // ID of the SVG group/DIV where Lottie renders
let lettersDiv = document.getElementById('lettersDiv');
let dashLine = document.getElementById('Group 212');
let wordBox = document.getElementById('wordBox');
let completeWord = document.getElementById('completeWord');

/**
 * Loads the Lottie animation for the current word and sets it to the initial state (Frame 0).
 */
function loadInitialLottie(wordObj) {
    const container = document.getElementById(LOTTIE_CONTAINER_ID);
    if (!container) {
        console.error(`Lottie container with ID "${LOTTIE_CONTAINER_ID}" not found.`);
        return;
    }

    // 1. Destroy previous instance
    if (currentLottieInstance) {
        currentLottieInstance.destroy();
        currentLottieInstance = null;
    }

    // 2. Find file path
    const fileName = wordObj && wordObj.animation;
    if (!fileName) {
        console.warn(`No Lottie file found for the word: ${wordObj && wordObj.word}`);
        // Optionally, hide the container if no animation exists
        container.innerHTML = '';
        return;
    }
    const animationPath = ANIMATION_PATH_BASE + fileName;

    // 3. Create the animation instance
    currentLottieInstance = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false, // Start paused
        path: animationPath
    });

    // 4. Size/position it (hidden meanwhile, so no jump is visible), then show frame 0.
    const anim = currentLottieInstance;
    container.style.visibility = 'hidden';
    anim.addEventListener('DOMLoaded', () => {
        requestAnimationFrame(async () => {
            if (anim !== currentLottieInstance) return;
            try {
                await fitLottieToSafeArea(anim);
            } catch (e) {
                console.warn('Could not fit puzzle animation:', e);
            }
            if (anim !== currentLottieInstance) return;
            if (anim.isPaused) anim.goToAndStop(0, true);
            container.style.visibility = '';
        });
    });
}

// --- LOTTIE SAFE-AREA BOUNDARY ---
// Keeps the puzzle animation from overlapping the instruction text, sound
// button, word box, letter panel and the bottom control buttons.
// All values are in the main SVG's viewBox units (1920 x 1080).
const LOTTIE_SAFE_PADDING = 15;
const LOTTIE_FO_ORIGIN = { x: -130, y: 30 }; // x/y of the foreignObject holding #lottie-wrapper

function getMainSvg() {
    return document.querySelector('.svg-container > svg');
}

/** Converts a screen-space DOMRect into main-SVG viewBox coordinates. */
function screenRectToViewBox(rect, svg) {
    const inv = svg.getScreenCTM().inverse();
    const pt = svg.createSVGPoint();
    pt.x = rect.left; pt.y = rect.top;
    const a = pt.matrixTransform(inv);
    pt.x = rect.right; pt.y = rect.bottom;
    const b = pt.matrixTransform(inv);
    return { x1: Math.min(a.x, b.x), y1: Math.min(a.y, b.y), x2: Math.max(a.x, b.x), y2: Math.max(a.y, b.y) };
}

/** Builds the rectangle the puzzle is allowed to occupy. */
function getLottieSafeArea(svg) {
    const pad = LOTTIE_SAFE_PADDING;
    const area = { x1: pad, y1: 225, x2: 725, y2: 1080 - pad };

    // Below the instruction text
    const instr = document.getElementById('instruction-text-wrap');
    if (instr) {
        const r = screenRectToViewBox(instr.getBoundingClientRect(), svg);
        area.y1 = Math.max(area.y1, r.y2 + pad);
    }

    // Left of the sound button / word box / letter panel
    ['Group 196', 'Group 150', 'Rectangle 9'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = screenRectToViewBox(el.getBoundingClientRect(), svg);
        area.x2 = Math.min(area.x2, r.x1 - pad);
    });

    // Above the bottom control buttons (HTML, overlaid on the SVG)
    const controls = document.querySelector('.button-controls');
    if (controls) {
        const r = screenRectToViewBox(controls.getBoundingClientRect(), svg);
        if (r.y1 > area.y1) area.y2 = Math.min(area.y2, r.y1 - pad);
    }
    return area;
}

/** Union of the animation's rendered bounds over its whole timeline (viewBox units). */
function measureLottieBounds(anim, svg) {
    const lottieSvg = document.querySelector('#' + LOTTIE_CONTAINER_ID + ' > svg');
    if (!lottieSvg) return null;
    const content = lottieSvg.querySelector(':scope > g') || lottieSvg;
    const total = Math.max(1, Math.floor(anim.totalFrames) - 1);
    const samples = 24;
    let box = null;

    for (let i = 0; i <= samples; i++) {
        anim.goToAndStop(Math.round((total * i) / samples), true);
        const rect = content.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const r = screenRectToViewBox(rect, svg);
        box = box
            ? { x1: Math.min(box.x1, r.x1), y1: Math.min(box.y1, r.y1), x2: Math.max(box.x2, r.x2), y2: Math.max(box.y2, r.y2) }
            : r;
    }
    if (!box) return null;

    // Lottie clips content to its composition; don't count anything outside it.
    const comp = screenRectToViewBox(lottieSvg.getBoundingClientRect(), svg);
    box.x1 = Math.max(box.x1, comp.x1); box.y1 = Math.max(box.y1, comp.y1);
    box.x2 = Math.min(box.x2, comp.x2); box.y2 = Math.min(box.y2, comp.y2);
    return box.x2 > box.x1 && box.y2 > box.y1 ? box : null;
}

// How much of the safe area the finished picture should fill (1 = touch the edges).
const LOTTIE_FILL = 0.95;
// Final size multiplier: 0.82 gives roughly 1.2-1.3x the original puzzle size
// (1 = the largest size that still fits the free area).
const LOTTIE_SIZE = 0.82;
let lottieFitRun = 0;
// How far the scattered pieces may reach past the safe area (as a fraction of
// its size) before the picture is shrunk to pull them in. Anything past the
// edge is clipped, so it can never cover text or buttons.
const LOTTIE_SCATTER_OVERFLOW = 0.12;

/**
 * The puzzle PNGs have wide transparent margins, so element boxes are much
 * bigger than what is actually drawn. This finds the visible (non-transparent)
 * part of an image, as fractions of its width/height. Cached per image.
 */
const alphaBoxCache = new Map();
function getAlphaBox(href) {
    if (alphaBoxCache.has(href)) return alphaBoxCache.get(href);
    const p = new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            try {
                const scale = Math.min(1, 256 / Math.max(img.naturalWidth, img.naturalHeight));
                const w = Math.max(1, Math.round(img.naturalWidth * scale));
                const h = Math.max(1, Math.round(img.naturalHeight * scale));
                const c = document.createElement('canvas');
                c.width = w; c.height = h;
                const ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const data = ctx.getImageData(0, 0, w, h).data;
                let x1 = w, y1 = h, x2 = -1, y2 = -1;
                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        if (data[(y * w + x) * 4 + 3] > 16) {
                            if (x < x1) x1 = x; if (x > x2) x2 = x;
                            if (y < y1) y1 = y; if (y > y2) y2 = y;
                        }
                    }
                }
                resolve(x2 < 0 ? null : { fx1: x1 / w, fy1: y1 / h, fx2: (x2 + 1) / w, fy2: (y2 + 1) / h });
            } catch (e) {
                resolve({ fx1: 0, fy1: 0, fx2: 1, fy2: 1 }); // can't read pixels: use the full image
            }
        };
        img.onerror = () => resolve({ fx1: 0, fy1: 0, fx2: 1, fy2: 1 });
        img.src = href;
    });
    alphaBoxCache.set(href, p);
    return p;
}

/**
 * Snapshot (synchronous) of every image drawn at the current frame: its
 * source and the matrix from image space to main-SVG viewBox units.
 */
function snapshotImages(svg) {
    const lottieSvg = document.querySelector('#' + LOTTIE_CONTAINER_ID + ' > svg');
    if (!lottieSvg) return [];
    const toVB = svg.getScreenCTM().inverse();
    const shots = [];
    for (const img of lottieSvg.querySelectorAll('image')) {
        const r = img.getBoundingClientRect();
        if (!r.width || !r.height) continue; // layer hidden at this frame
        const href = img.getAttribute('href') || img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
        const m = img.getScreenCTM();
        // Lottie writes sizes like "553px", so parseFloat (not +) is needed.
        const w = parseFloat(img.getAttribute('width')), h = parseFloat(img.getAttribute('height'));
        if (!href || !m || !w || !h) continue;
        shots.push({
            href, w, h,
            x: parseFloat(img.getAttribute('x')) || 0, y: parseFloat(img.getAttribute('y')) || 0,
            m: toVB.multiply(m)
        });
    }
    return shots;
}

/** Visible-pixel bounds (viewBox units) of a snapshot. */
async function snapshotBounds(shots, svg) {
    const pt = svg.createSVGPoint();
    let box = null;
    for (const s of shots) {
        const a = await getAlphaBox(s.href);
        if (!a) continue;
        [[a.fx1, a.fy1], [a.fx2, a.fy1], [a.fx1, a.fy2], [a.fx2, a.fy2]].forEach(([fx, fy]) => {
            pt.x = s.x + fx * s.w; pt.y = s.y + fy * s.h;
            const p = pt.matrixTransform(s.m);
            box = unionBox(box, { x1: p.x, y1: p.y, x2: p.x, y2: p.y });
        });
    }
    return box;
}

const unionBox = (a, b) => !a ? b : !b ? a
    : { x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1), x2: Math.max(a.x2, b.x2), y2: Math.max(a.y2, b.y2) };

/**
 * Measures (untransformed) the finished picture at the last frame, and
 * everything drawn across the whole timeline (scattered pieces included).
 * All frames are captured synchronously first, so nothing else can move
 * the animation in between.
 */
async function measurePuzzle(anim, svg) {
    const last = Math.max(0, Math.floor(anim.totalFrames) - 1);
    const samples = 16;
    anim.goToAndStop(last, true);
    const finalShots = snapshotImages(svg);
    const allShots = [finalShots];
    for (let i = 0; i < samples; i++) {
        anim.goToAndStop(Math.round((last * i) / samples), true);
        allShots.push(snapshotImages(svg));
    }
    const final = await snapshotBounds(finalShots, svg);
    let all = null;
    for (const shots of allShots) all = unionBox(all, await snapshotBounds(shots, svg));
    return { final, all };
}

/** Clips the Lottie's foreignObject to the safe area, so nothing it draws
 *  (scattered pieces, the "done" effect) can ever cover text or buttons. */
function clipLottieToSafeArea(svg, wrapper, safe) {
    const fo = wrapper.closest('foreignObject');
    if (!fo) return;
    let clip = document.getElementById('lottie-safe-clip');
    if (!clip) {
        const NS = 'http://www.w3.org/2000/svg';
        let defs = svg.querySelector('defs');
        if (!defs) { defs = document.createElementNS(NS, 'defs'); svg.insertBefore(defs, svg.firstChild); }
        clip = document.createElementNS(NS, 'clipPath');
        clip.setAttribute('id', 'lottie-safe-clip');
        clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
        clip.appendChild(document.createElementNS(NS, 'rect'));
        defs.appendChild(clip);
    }
    // The clipPath is applied in the foreignObject's user space, which is the viewBox space here.
    const rect = clip.firstChild;
    rect.setAttribute('x', safe.x1);
    rect.setAttribute('y', safe.y1);
    rect.setAttribute('width', safe.x2 - safe.x1);
    rect.setAttribute('height', safe.y2 - safe.y1);
    fo.setAttribute('clip-path', 'url(#lottie-safe-clip)');
}

/**
 * Scales/shifts #lottie-wrapper so the finished picture is as big as possible
 * inside the safe area (centred), and clips the animation to that area.
 */
async function fitLottieToSafeArea(anim) {
    const svg = getMainSvg();
    const wrapper = document.getElementById(LOTTIE_CONTAINER_ID);
    if (!svg || !wrapper || !anim) return;

    const run = ++lottieFitRun; // a newer fit (new word / resize) supersedes this one
    wrapper.style.transform = 'none';
    const safe = getLottieSafeArea(svg);
    clipLottieToSafeArea(svg, wrapper, safe);

    const m = await measurePuzzle(anim, svg);
    if (anim !== currentLottieInstance || run !== lottieFitRun) return;
    const box = m.final || measureLottieBounds(anim, svg);
    if (!box) return;

    const bw = box.x2 - box.x1, bh = box.y2 - box.y1;
    const sw = safe.x2 - safe.x1, sh = safe.y2 - safe.y1;

    // As big as possible for the finished picture...
    let k = Math.min(sw / bw, sh / bh) * LOTTIE_FILL;

    // ...but not so big that the scattered pieces fly far past the safe area.
    // Measured relative to the finished picture's centre, which is what gets centred.
    if (m.all) {
        const cx = (box.x1 + box.x2) / 2, cy = (box.y1 + box.y2) / 2;
        const reachX = Math.max(cx - m.all.x1, m.all.x2 - cx);
        const reachY = Math.max(cy - m.all.y1, m.all.y2 - cy);
        const allowX = (sw / 2) * (1 + LOTTIE_SCATTER_OVERFLOW);
        const allowY = (sh / 2) * (1 + LOTTIE_SCATTER_OVERFLOW);
        k = Math.min(k, allowX / reachX, allowY / reachY);
    }

    // Overall size of the puzzle (1 = largest that fits; lower = smaller).
    k *= LOTTIE_SIZE;

    // Centre the finished picture in the safe area.
    const left = safe.x1 + (sw - bw * k) / 2;
    const top = safe.y1 + (sh - bh * k) / 2;

    // Wrapper-local px == viewBox units (foreignObject is unscaled).
    const tx = (left - LOTTIE_FO_ORIGIN.x) - k * (box.x1 - LOTTIE_FO_ORIGIN.x);
    const ty = (top - LOTTIE_FO_ORIGIN.y) - k * (box.y1 - LOTTIE_FO_ORIGIN.y);

    wrapper.style.transformOrigin = '0 0';
    wrapper.style.transform = `translate(${tx}px, ${ty}px) scale(${k})`;
}

// Re-fit on resize (the bottom buttons' position in SVG units depends on screen size).
let lottieResizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(lottieResizeTimer);
    lottieResizeTimer = setTimeout(async () => {
        const anim = currentLottieInstance;
        if (!anim || !anim.isLoaded) return;
        const frame = anim.currentFrame;
        const wasPlaying = !anim.isPaused;
        if (wasPlaying) anim.pause();
        await fitLottieToSafeArea(anim);
        if (anim !== currentLottieInstance) return;
        if (wasPlaying) anim.goToAndPlay(frame, true);
        else anim.goToAndStop(frame, true);
    }, 150);
});

/**
 * Starts playing the Lottie animation. (Replaces showFinalImage visual logic)
 */
function playLottieAnimation() {
    if (currentLottieInstance) {
        // Ensure it starts from the beginning and play!
        currentLottieInstance.goToAndStop(0, true);
        currentLottieInstance.play();
    }
}

/**
 * Hides the animation container by destroying the instance and clearing its content.
 * (Replaces hideFinalImage visual logic)
 */
function hideLottieAnimation() {
    if (currentLottieInstance) {
        currentLottieInstance.destroy();
        currentLottieInstance = null;
    }
    const container = document.getElementById(LOTTIE_CONTAINER_ID);
    if (container) {
        container.innerHTML = '';
    }
}


/**
 * Selects words one by one sequentially, wrapping back to the start 
 * when the end of the list is reached.
 * @returns {object} The next word object.
 */
function selectNextWord() {
    // 1. Check if we've reached the end of the array
    if (currentWordIndex >= words.length - 1 || currentWordIndex === null) {
        currentWordIndex = 0; // Reset to the first word
    } else {
        currentWordIndex++; // Move to the next word
    }

    // 2. Select the current word
    currentWord = words[currentWordIndex];
    return currentWord;
}

/**
 * Gets the audio file path for a letter
 */
function getLetterAudioPath(letter) {
    const audioFile = letterAudioMap[letter];
    if (audioFile) {
        return LETTER_AUDIO_PATH_BASE + audioFile;
    }
    return null;
}

/**
 * Plays audio for a letter
 */
function playLetterSound(letter) {
    const audioPath = getLetterAudioPath(letter);
    if (audioPath) {
        const audio = new Audio(audioPath);
        lastLetterAudio = audio;
        audio.play().catch(err => console.log("Audio play failed:", err));
    }
}

// --- Word sound after the last letter ---
const WORD_SOUND_DELAY_MS = 1000;   // gap between the last letter's sound ending and the word sound
const LETTER_SOUND_MAX_WAIT_MS = 4000; // fallback if the letter sound never reports "ended"
let lastLetterAudio = null;
let wordSoundTimer = null;
let wordSoundToken = 0;

function cancelPendingWordSound() {
    wordSoundToken++;
    clearTimeout(wordSoundTimer);
    wordSoundTimer = null;
}

// Letter/word recordings have silence at the start and end (letters: ~0.2-1.2s at the end).
// To make the heard gap between the letter and the word exactly WORD_SOUND_DELAY_MS,
// the silence is measured once per file (when a word loads) and taken into account.
const WORD_PLAYBACK_RATE = 0.75;
const SILENCE_THRESHOLD = 0.05; // samples below 5% of the file's peak count as silence
const soundSilencePending = new Map(); // absolute url -> Promise
const soundSilenceInfo = {};           // absolute url -> { duration, lead, tail } (seconds)
let silenceDecodeCtx = null;

function toAbsoluteUrl(path) {
    return new URL(path, document.baseURI).href;
}

function getSoundSilence(path) {
    const url = toAbsoluteUrl(path);
    if (!soundSilencePending.has(url)) {
        const pending = (async () => {
            try {
                const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
                if (!Ctx) return null;
                if (!silenceDecodeCtx) silenceDecodeCtx = new Ctx(1, 1, 44100);
                const data = await (await fetch(url)).arrayBuffer();
                const buffer = await silenceDecodeCtx.decodeAudioData(data);
                const samples = buffer.getChannelData(0);
                let peak = 0;
                for (let i = 0; i < samples.length; i++) {
                    const v = Math.abs(samples[i]);
                    if (v > peak) peak = v;
                }
                const threshold = peak * SILENCE_THRESHOLD;
                let start = 0;
                while (start < samples.length && Math.abs(samples[start]) < threshold) start++;
                let end = samples.length - 1;
                while (end > start && Math.abs(samples[end]) < threshold) end--;
                const info = {
                    duration: buffer.duration,
                    lead: start / buffer.sampleRate,
                    tail: (samples.length - 1 - end) / buffer.sampleRate
                };
                soundSilenceInfo[url] = info;
                return info;
            } catch (err) {
                return null; // fall back to timing from the file's end
            }
        })();
        soundSilencePending.set(url, pending);
    }
    return soundSilencePending.get(url);
}

/**
 * Measures the silence of the current word's answer letters and word sound in advance.
 */
function preloadWordSoundTiming(word) {
    if (!word) return;
    word.answer.forEach(letter => {
        const path = getLetterAudioPath(letter);
        if (path) getSoundSilence(path);
    });
    if (word.audio) getSoundSilence(WORD_AUDIO_PATH_BASE + word.audio);
}

/**
 * Plays the word sound WORD_SOUND_DELAY_MS after the last letter is heard
 * (measured from the end of the letter's voice to the start of the word's voice).
 */
function playWordSoundAfterLetter() {
    cancelPendingWordSound();
    const token = wordSoundToken;
    const fire = (ms) => {
        clearTimeout(wordSoundTimer);
        wordSoundTimer = setTimeout(() => {
            wordSoundTimer = null;
            if (token === wordSoundToken) playWordSound();
        }, Math.max(0, ms));
    };

    const wordInfo = currentWord && currentWord.audio
        ? soundSilenceInfo[toAbsoluteUrl(WORD_AUDIO_PATH_BASE + currentWord.audio)]
        : null;
    const wordLeadMs = wordInfo ? (wordInfo.lead / WORD_PLAYBACK_RATE) * 1000 : 0;

    const audio = lastLetterAudio;
    const letterPlaying = audio && !audio.paused && !audio.ended;
    if (!letterPlaying) {
        fire(WORD_SOUND_DELAY_MS - wordLeadMs);
        return;
    }

    const letterInfo = soundSilenceInfo[audio.src];
    if (letterInfo) {
        const duration = isFinite(audio.duration) ? audio.duration : letterInfo.duration;
        const audibleEnd = duration - letterInfo.tail;
        const remainingMs = (audibleEnd - audio.currentTime) * 1000;
        fire(Math.max(0, remainingMs) + WORD_SOUND_DELAY_MS - wordLeadMs);
        return;
    }

    // Silence not measured (e.g. decoding unsupported): wait for the letter file to end
    let scheduled = false;
    const schedule = () => {
        if (scheduled || token !== wordSoundToken) return;
        scheduled = true;
        fire(WORD_SOUND_DELAY_MS - wordLeadMs);
    };
    audio.addEventListener('ended', schedule, { once: true });
    audio.addEventListener('error', schedule, { once: true });
    wordSoundTimer = setTimeout(schedule, LETTER_SOUND_MAX_WAIT_MS);
}


/**
 * Plays word sound
 */
function playWordSound() {
    if (currentWord && currentWord.word) {
        const audioPath = WORD_AUDIO_PATH_BASE + currentWord.audio;
        const audio = new Audio(audioPath);
        audio.playbackRate = WORD_PLAYBACK_RATE;
        audio.volume = 1.0;
        audio.play().catch(err => console.log("Word audio play failed:", err));
    }
}

/**
 * Initializes the game
 */
function initGame() {
    // Get letter button elements
    const buttonGroups = document.querySelectorAll('.letter-button');
    letterButtons = Array.from(buttonGroups);

    // Get answer slot elements
    answerSlotElements = [
        document.getElementById('answer-slot-1'),
        document.getElementById('answer-slot-2'),
        document.getElementById('answer-slot-3')
    ];

    if (answerSlotElements.some(slot => !slot)) {
        console.warn("Some answer slots are missing");
    }

    if (!currentWord) {
        loadWord(selectNextWord());
    }
}

/**
 * Loads a word and updates the UI
 */
function loadWord(word) {
    currentWord = word;
    answerSlots = ["", "", ""];

    // Update answer slots
    answerSlotElements.forEach(slot => {
        if (slot) {
            slot.textContent = "";
        }
    });

    // Shuffle letters for display
    const shuffledLetters = [...word.letters].sort(() => Math.random() - 0.5);

    // Update letter buttons
    letterButtons = Array.from(document.querySelectorAll('.letter-button'));
    letterButtons.forEach((button, index) => {
        if (index < shuffledLetters.length) {
            const textElement = button.querySelector('.btn-wrap span');
            if (textElement) {
                textElement.textContent = shuffledLetters[index];
            }
            button.dataset.letter = shuffledLetters[index];
        }
    });

    // Reset button styles
    letterButtons.forEach(button => {
        button.style.opacity = "1";
        button.querySelector('path[fill="#3CD3C4"]')?.setAttribute('fill', '#3CD3C4');
    });

    // --- LOTTIE INTEGRATION POINT 1: Load initial image/state ---
    preloadWordSoundTiming(word);
    hideLottieAnimation(); // Ensure clean slate
    loadInitialLottie(word);
}

/**
 * Shows the final image when word is correct (NOW PLAYS LOTTIE ANIMATION)
 */
function showFinalImage(fromLetters = false) {
    if (!currentWord) return;

    // --- LOTTIE INTEGRATION POINT 2: Play the animation ---
    playLottieAnimation();

    // When the word was formed by tapping letters, the word sound plays
    // 1 sec after the last letter's sound ends; otherwise (show answer) it plays with the reveal.
    if (fromLetters) playWordSoundAfterLetter();
    clearTimeout(finalImageTimer);
    finalImageTimer = setTimeout(() => {
        finalImageTimer = null;
        if (!fromLetters) playWordSound();
        dashLine.style.display = 'none';
        wordBox.style.display = 'block';
        completeWord.textContent = `${currentWord.word}`;
        completeWord.style.display = 'block';
        lettersDiv.style.display = 'none';
    }, 2500);
}

/**
 * Hides the final image and shows puzzled images (NOW DESTROYS LOTTIE ANIMATION)
 */
function hideFinalImage() {
    // --- LOTTIE INTEGRATION POINT 3: Destroy/Hide the animation ---
    hideLottieAnimation();
}


/**
 * Handles letter button click
 */
function handleLetterClick(button) {
    const letter = button.dataset.letter;
    if (!letter || !currentWord) return;
    if (isSolved || isAnswerShown) return; // word already formed / answer on screen

    playLetterSound(letter);

    let emptySlotIndex = answerSlots.findIndex(slot => slot === "");
    if (emptySlotIndex === -1) {
        emptySlotIndex = 2;
    }

    const correctLetter = currentWord.answer[emptySlotIndex];
    const isCorrect = letter === correctLetter;

    if (isCorrect) {
        answerSlots[emptySlotIndex] = letter;

        if (answerSlotElements[emptySlotIndex]) {
            answerSlotElements[emptySlotIndex].textContent = letter;
        }

        button.classList.remove('wrong-letter', 'shake-button');

        // Check if answer is complete
        if (answerSlots[0] !== "" && answerSlots[1] !== "" && answerSlots[2] !== "") {
            checkAnswer();
        }
    } else {
        shakeLetterButton(button);
    }
}

/**
 * Shakes the letter button (1px) and shows red border for wrong selection
 */
function shakeLetterButton(button) {
    button.classList.remove('wrong-letter', 'shake-button');
    void button.offsetWidth;
    button.classList.add('shake-button');

    const mainPaths = button.querySelectorAll('path[fill="#3CD3C4"]');
    
    mainPaths.forEach(path => {
        if (!path.dataset.originalStroke) {
            path.dataset.originalStroke = path.getAttribute('stroke') || 'none';
        }
        if (!path.dataset.originalStrokeWidth) {
            path.dataset.originalStrokeWidth = path.getAttribute('stroke-width') || '0';
        }
        
        path.setAttribute('stroke', '#ff0000');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-linecap', 'round');
    });
    
    button.classList.add('wrong-letter');

    setTimeout(() => {
        button.classList.remove('shake-button', 'wrong-letter');
        
        const allPaths = button.querySelectorAll('path');
        allPaths.forEach(path => {
            if (path.dataset.originalStroke !== undefined) {
                const originalStroke = path.dataset.originalStroke;
                originalStroke === 'none' ? path.removeAttribute('stroke') : path.setAttribute('stroke', originalStroke);
            }
            if (path.dataset.originalStrokeWidth !== undefined) {
                const originalWidth = path.dataset.originalStrokeWidth;
                originalWidth === '0' ? path.removeAttribute('stroke-width') : path.setAttribute('stroke-width', originalWidth);
            }
            path.removeAttribute('stroke-linejoin');
            path.removeAttribute('stroke-linecap');
        });
    }, 300);
}

/**
 * Checks if the answer is correct
 */
function checkAnswer() {
    if (!currentWord) return;

    const userAnswer = answerSlots.join("");
    const correctAnswer = currentWord.answer.join("");

    if (userAnswer === correctAnswer) {
        // Correct answer - triggers Lottie animation playback via showFinalImage
        isSolved = true;
        const showAnswerBtn = document.getElementById('show-example-btn');
        if (showAnswerBtn) showAnswerBtn.disabled = true;
        showFinalImage(true);
        // Play success sound or show success message
        setTimeout(() => {
            // Auto-load next word after a delay (if desired)
            // loadWord(selectRandomWord()); 
        }, 2000);
    } else {
        shakeAnswerSlots();
    }
}

/**
 * Shakes answer slots with red boundary for wrong answer
 */
function shakeAnswerSlots() {
    answerSlotElements.forEach(slot => {
        if (slot) {
            slot.classList.add('shake');
        }
    });

    const answerBox = document.querySelector('#Vector_3');
    if (answerBox) {
        const originalStroke = answerBox.getAttribute('stroke');
        const originalWidth = answerBox.getAttribute('stroke-width');
        answerBox.setAttribute('stroke', '#ff0000');
        answerBox.setAttribute('stroke-width', '20');

        setTimeout(() => {
            answerBox.setAttribute('stroke', originalStroke || '#376FC4');
            answerBox.setAttribute('stroke-width', originalWidth || '15');
            answerSlotElements.forEach(slot => {
                if (slot) {
                    slot.classList.remove('shake');
                }
            });
        }, 500);
    }

    setTimeout(() => {
        answerSlots = ["", "", ""];
        answerSlotElements.forEach(slot => {
            if (slot) {
                slot.textContent = "";
            }
        });
    }, 500);
}

/**
 * Resets the game with a new word
 */
function resetSentence() {
    cancelPendingWordSound();
    clearTimeout(finalImageTimer);
    finalImageTimer = null;
    isSolved = false;
    isAnswerShown = false;
    const showAnswerBtn = document.getElementById('show-example-btn');
    if (showAnswerBtn) {
        showAnswerBtn.textContent = SHOW_ANSWER_TEXT;
        showAnswerBtn.disabled = false;
    }
    lettersDiv.style.display = 'block';
    dashLine.style.display = 'block';
    completeWord.style.display = 'none';
    loadWord(selectNextWord());
}

/**
 * Toggles the answer: first click shows the word and solves the image riddle,
 * second click hides it again and puts the riddle back to its puzzled state.
 */
function showAnswer() {
    if (!currentWord || isSolved) return;
    const showAnswerBtn = document.getElementById('show-example-btn');

    if (!isAnswerShown) {
        isAnswerShown = true;
        if (showAnswerBtn) showAnswerBtn.textContent = HIDE_ANSWER_TEXT;
        dashLine.style.display = 'none';
        wordBox.style.display = 'block';
        completeWord.textContent = `${currentWord.word}`;
        completeWord.style.display = 'block';
        lettersDiv.style.display = 'none';

        // Show final image (triggers Lottie animation playback)
        showFinalImage();
        return;
    }

    // Hide the answer and restore the puzzle state
    isAnswerShown = false;
    clearTimeout(finalImageTimer);
    finalImageTimer = null;
    if (showAnswerBtn) showAnswerBtn.textContent = SHOW_ANSWER_TEXT;
    dashLine.style.display = 'block';
    completeWord.style.display = 'none';
    lettersDiv.style.display = 'block';
    if (currentLottieInstance) {
        currentLottieInstance.goToAndStop(0, true);
    }
}


// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initGame();

        // Add click handlers to letter buttons
        const buttonGroups = document.querySelectorAll('.letter-button');
        buttonGroups.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                handleLetterClick(this);
            });
        });

        // Add click handler to sound button
        const soundButton = document.querySelector('.sound-button') || document.getElementById('Group 196');
        if (soundButton) {
            soundButton.style.cursor = 'pointer';
            soundButton.addEventListener('click', function(e) {
                e.stopPropagation();
                playWordSound();
            });
        }

        // Update button handlers
        const showAnswerBtn = document.getElementById('show-example-btn');
        if (showAnswerBtn) {
            showAnswerBtn.onclick = showAnswer;
        }

        const resetBtn = document.getElementById('next-btn');
        if (resetBtn) {
            resetBtn.onclick = resetSentence;
        }
    }, 200);
});