// Word puzzle game script
// Content: gu_gu_01_wg247 (Gujarati) - 20 two-letter words, 6 letter options each
const words = [
    { "word": "ઘર", "letters": ["ર", "ઘ", "ધ", "ડ", "ગ", "ચ"], "answer": ["ઘ", "ર"], "animation": "01_house.json", "audio": "01_ghar.mp3" },
    { "word": "નળ", "letters": ["ળ", "ન", "ણ", "લ", "મ", "ડ"], "answer": ["ન", "ળ"], "animation": "02_tap.json", "audio": "02_nal.mp3" },
    { "word": "ફળ", "letters": ["ળ", "ફ", "પ", "લ", "ષ", "ભ"], "answer": ["ફ", "ળ"], "animation": "03_fruit.json", "audio": "03_phal.mp3" },
    { "word": "જળ", "letters": ["જ", "ળ", "ઝ", "લ", "ગ", "ડ"], "answer": ["જ", "ળ"], "animation": "04_water.json", "audio": "04_jal.mp3" },
    { "word": "વડ", "letters": ["ડ", "વ", "બ", "ઢ", "ટ", "ક"], "answer": ["વ", "ડ"], "animation": "05_banyan_tree.json", "audio": "05_vad.mp3" },
    { "word": "હળ", "letters": ["ળ", "હ", "લ", "ઠ", "ડ", "શ"], "answer": ["હ", "ળ"], "animation": "06_plough.json", "audio": "06_hal.mp3" },
    { "word": "રથ", "letters": ["થ", "ર", "ત", "ય", "ડ", "ધ"], "answer": ["ર", "થ"], "animation": "07_chariot.json", "audio": "07_rath.mp3" },
    { "word": "પગ", "letters": ["ગ", "પ", "ઘ", "ષ", "ફ", "ચ"], "answer": ["પ", "ગ"], "animation": "08_legs.json", "audio": "08_pag.mp3" },
    { "word": "નખ", "letters": ["ખ", "ન", "ક", "ણ", "ભ", "ર"], "answer": ["ન", "ખ"], "animation": "09_nails.json", "audio": "09_nakh.mp3" },
    { "word": "મધ", "letters": ["ધ", "મ", "દ", "ભ", "ઘ", "ન"], "answer": ["મ", "ધ"], "animation": "10_honey.json", "audio": "10_madh.mp3" },
    { "word": "મગ", "letters": ["ગ", "ભ", "મ", "ઘ", "ચ", "ન"], "answer": ["મ", "ગ"], "animation": "11_moong.json", "audio": "11_mag.mp3" },
    { "word": "જવ", "letters": ["વ", "જ", "બ", "ઝ", "ગ", "ચ"], "answer": ["જ", "વ"], "animation": "12_barley.json", "audio": "12_jav.mp3" },
    { "word": "બસ", "letters": ["સ", "બ", "શ", "વ", "ભ", "ષ"], "answer": ["બ", "સ"], "animation": "13_bus.json", "audio": "13_bas.mp3" },
    { "word": "કપ", "letters": ["પ", "ક", "ખ", "ફ", "ષ", "ગ"], "answer": ["ક", "પ"], "animation": "14_cup.json", "audio": "14_kap.mp3" },
    { "word": "વન", "letters": ["ન", "વ", "ણ", "બ", "મ", "ત"], "answer": ["વ", "ન"], "animation": "15_forest.json", "audio": "15_van.mp3" },
    { "word": "ગજ", "letters": ["જ", "ગ", "ઝ", "ઘ", "ચ", "ર"], "answer": ["ગ", "જ"], "animation": "16_elephant.json", "audio": "16_gaj.mp3" },
    { "word": "તલ", "letters": ["લ", "ત", "થ", "ળ", "ન", "ભ"], "answer": ["ત", "લ"], "animation": "17_sesame_seeds.json", "audio": "17_tal.mp3" },
    { "word": "રણ", "letters": ["ણ", "ર", "ન", "ડ", "ળ", "સ"], "answer": ["ર", "ણ"], "animation": "18_desert.json", "audio": "18_ran.mp3" },
    { "word": "ટબ", "letters": ["બ", "ટ", "ઠ", "વ", "ડ", "ભ"], "answer": ["ટ", "બ"], "animation": "19_tub.json", "audio": "19_tab.mp3" },
    { "word": "જગ", "letters": ["ર", "વ", "જ", "ગ", "ચ", "સ"], "answer": ["જ", "ગ"], "animation": "20_jug.json", "audio": "20_jag.mp3" }
];

// UI text
const ITEXT_SCRATCH = "ચિત્રને ઘસીને જુઓ, પાછળ શું છુપાયેલું છે!";
const ITEXT_BUILD = "ધ્વનિ સાંભળો, સાચા વર્ણો પસંદ કરીને શબ્દ બનાવો.";
const SHOW_ANSWER_TEXT = "જવાબ જુઓ";
const HIDE_ANSWER_TEXT = "જવાબ છુપાવો";

// Game state
let currentWordIndex = -1; // selectNextWord() increments before use, so the first word shown is index 0
let currentWord = null;
let answerSlots = ["", ""]; // Two answer slots
let letterButtons = [];
let answerSlotElements = [];

// Audio mapping for letters (assets/audio/letters/)
const letterAudioMap = {
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
let starLottieInstance = null;
let isAnswerShown = false;

const ANIMATION_PATH_BASE = 'assets/json/';
const LETTER_AUDIO_PATH_BASE = 'assets/audio/letters/';
const WORD_AUDIO_PATH_BASE = 'assets/audio/words/';
const LOTTIE_CONTAINER_ID = 'lottie-wrapper'; // ID of the SVG group/DIV where Lottie renders
let container = document.getElementById('lottie-wrapper');
const showAnswerBtn = document.getElementById('show-example-btn');
let STAR_LOTTIE_CONTAINER_ID = 'starLottie-wrapper';
let lettersDiv = document.getElementById('lettersDiv');
let dashLine = document.getElementById('Group 155');
let wordBox = document.getElementById('wordBox');
let completeWord = document.getElementById('completeWord');
let afterContainer = document.getElementById("afterContainers");
let lottieObject = document.getElementById('lottie-object');
let soundIcon = document.getElementById('volume-icon');
let instructionText = document.getElementById('instruction-text');
let lottieStar = document.getElementById('lottie-star');
let letterButton = document.querySelectorAll('.letter-button');
let lottieLoadToken = 0;
let scratchLabel = document.getElementById('scratch-label'); // "અહીં ઘસો" text shown over the scratch card

// The Gujarati word animations contain only the picture revealed by the "scratch" matte.
// The scratch card itself is a separate asset, so it is added as the bottom layer here
// (same structure as the earlier animations, which had a "Scratch card" layer built in).
const SCRATCH_CARD = {
    path: 'assets/images/', file: 'gr_scratchcard.svg',
    w: 435.74, h: 597.11,          // gr_scratchcard.svg viewBox size
    center: [239.5, 337],           // centre of the picture card inside the 480x680 composition
    scale: 115.2                    // visible card in the svg is ~92% of its viewBox; this matches the revealed picture card size
};

function addScratchCardLayer(data) {
    if (!data || !Array.isArray(data.layers)) return;
    if (data.layers.some(l => l.nm === 'Scratch card')) return; // already has one
    const assetId = 'scratch_card';
    data.assets = data.assets || [];
    data.assets.push({ id: assetId, w: SCRATCH_CARD.w, h: SCRATCH_CARD.h, u: SCRATCH_CARD.path, p: SCRATCH_CARD.file, e: 0 });
    const maxInd = data.layers.reduce((m, l) => Math.max(m, l.ind || 0), 0);
    data.layers.push({
        ty: 2, nm: 'Scratch card', refId: assetId, ind: maxInd + 1,
        sr: 1, st: 0, ip: 0, op: data.op, ao: 0, bm: 0,
        ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [SCRATCH_CARD.center[0], SCRATCH_CARD.center[1], 0] },
            a: { a: 0, k: [SCRATCH_CARD.w / 2, SCRATCH_CARD.h / 2, 0] },
            s: { a: 0, k: [SCRATCH_CARD.scale, SCRATCH_CARD.scale, 100] }
        }
    });
}

/**
 * Loads the Lottie animation for the current word and sets it to the initial state (Frame 0).
 */
function loadInitialLottie(wordObj) {
   // const container = document.getElementById(LOTTIE_CONTAINER_ID);
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
    const loadToken = ++lottieLoadToken;

    // 3. Load the JSON, add the scratch card layer, then create the animation instance
    fetch(animationPath)
        .then(res => res.json())
        .then(data => {
            if (loadToken !== lottieLoadToken) return; // a newer word was loaded meanwhile
            addScratchCardLayer(data);
            currentLottieInstance = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: false,
                autoplay: false, // Start paused
                animationData: data
            });

            // 4. Go to frame 0 immediately upon loading to show the initial state (the scratch card)
            const instance = currentLottieInstance;
            instance.addEventListener('DOMLoaded', () => {
                requestAnimationFrame(() => {
                    instance.goToAndStop(0, true);
                });
            });
        })
        .catch(err => console.error(`Failed to load Lottie animation "${animationPath}":`, err));

    container.onclick = playLottieAnimation;
    // To handle touch devices, you might also want to add a 'touchstart' listener
    container.ontouchstart = (event) => {
        event.preventDefault(); // Prevents double firing with click on some devices
        playLottieAnimation();
    };
}

/**
 * Starts playing the Lottie animation. (Replaces showFinalImage visual logic)
 */
function playLottieAnimation() {
    if (currentLottieInstance) {
        // Ensure it starts from the beginning and play!
        currentLottieInstance.goToAndStop(0, true);
        currentLottieInstance.play();
        if (scratchLabel) scratchLabel.style.display = 'none'; // label is scratched away with the card
        setTimeout(() => {
            instructionText.textContent = ITEXT_BUILD;
            soundIcon.style.display = 'block';
            afterContainer.style.display = 'block';
            lottieObject.setAttribute('x', 300);
            container.classList.add('no-touch');
            showAnswerBtn.disabled = false;
        }, 2000)
    }
}

/**
 * Loads the specific Star Lottie animation and plays it immediately.
 * This is designed to be called once upon successful completion.
 */
function playStarLottieAnimation() {
    const container = document.getElementById(STAR_LOTTIE_CONTAINER_ID);
    if (!container) {
        console.error(`Lottie container with ID "${STAR_LOTTIE_CONTAINER_ID}" not found.`);
        return;
    }

    // 1. Destroy previous instance (important to clear any paused word animation)
    if (starLottieInstance) {
        starLottieInstance.destroy();
        starLottieInstance = null;
    }

    // 2. Define the path for the Star animation
    const animationPath = ANIMATION_PATH_BASE + "right_ans_stars.json";

    // 3. Create the instance and play immediately
    starLottieInstance = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false, // Stars usually don't loop
        autoplay: true, 
        path: animationPath
    });

    // You can add an event listener here to hide the star animation after it finishes
    // starLottieInstance.addEventListener('complete', () => {
    //     // Optionally, destroy and hide the star animation after it plays once
    //     setTimeout(hideLottieAnimation, 1000); 
    // });
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
    console.log(letter);
    if (audioPath) {
        const audio = new Audio(audioPath);
        audio.play().catch(err => console.log("Audio play failed:", err));
    }
}

/**
 * Plays word sound
 */
function playWordSound() {
    if (currentWord && currentWord.word) {
        const wordName = currentWord.word;
        const audioPath = WORD_AUDIO_PATH_BASE + currentWord.audio;
        const audio = new Audio(audioPath);
        audio.playbackRate = 0.75;
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
        document.getElementById('answer-slot-2')
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
    answerSlots = ["", ""];

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
    hideLottieAnimation(); // Ensure clean slate
    loadInitialLottie(word);
    
}

/**
 * Shows the final image when word is correct (NOW PLAYS LOTTIE ANIMATION)
 */
function showFinalImage() {
    if (!currentWord) return;

    // --- LOTTIE INTEGRATION POINT 2: Play the animation ---

    // Play word sound after a small delay to sync with animation start
    setTimeout(() => {
        playWordSound();
        letterButton.forEach((item)=>{
            item.style.pointerEvents = 'none';
        });
        showAnswerBtn.disabled = true;
        dashLine.style.display = 'none';
        wordBox.style.display = 'block';
        completeWord.textContent = `${currentWord.word}`;
        completeWord.style.display = 'block';
        lettersDiv.style.display = 'none';
        document.getElementById("starLottie-wrapper").style.display="block";
        lottieStar.style.display="block";
        playStarLottieAnimation();
        container.classList.add('no-touch');
    }, 1000);
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
        if (answerSlots[0] !== "" && answerSlots[1] !== "") {
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
        showFinalImage();
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
        answerSlots = ["", ""];
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
    document.getElementById("starLottie-wrapper").style.display="none";
    instructionText.textContent = ITEXT_SCRATCH;
    showAnswerBtn.textContent = SHOW_ANSWER_TEXT;
    isAnswerShown = false;
    container.classList.remove('no-touch');
    letterButton.forEach((item) => {
        item.style.pointerEvents = 'auto';
    });
    soundIcon.style.display = 'none';
    showAnswerBtn.disabled = true;
    lettersDiv.style.display = 'block';
    dashLine.style.display = 'block';
    completeWord.style.display = 'none';
    soundIcon.style.display = 'none';
    afterContainer.style.display = 'none';
    lottieStar.style.display="none";
    lottieObject.setAttribute('x', 650);
    if (scratchLabel) scratchLabel.style.display = 'block';
    loadWord(selectNextWord());
}

/**
 * Shows the answer
 */
function showAnswer() {
    if (!currentWord) return;

    // ---------------------- TOGGLE ON ----------------------
    if (!isAnswerShown) {

        // First click → Show the answer
        dashLine.style.display = 'none';
        wordBox.style.display = 'block';
        showAnswerBtn.textContent = HIDE_ANSWER_TEXT;
        completeWord.textContent = currentWord.word;
        completeWord.style.display = 'block';

        lettersDiv.style.display = 'none';
       // showAnswerBtn.disabled = false;

        setTimeout(() => {
            playWordSound();

            letterButton.forEach(item => {
                item.style.pointerEvents = 'none';
            });

            document.getElementById("starLottie-wrapper").style.display = "block";
            lottieStar.style.display = "block";
            playStarLottieAnimation();

            container.classList.add('no-touch');
        }, 100);

        isAnswerShown = true;
        return;
    }

    // ---------------------- TOGGLE OFF ----------------------
    // Second click → Hide answer and restore original UI

    dashLine.style.display = 'block';
    wordBox.style.display = 'none';
    completeWord.style.display = 'none';
    showAnswerBtn.textContent = SHOW_ANSWER_TEXT;
    lettersDiv.style.display = 'block';
    showAnswerBtn.disabled = false;

    letterButton.forEach(item => {
        item.style.pointerEvents = 'auto';
    });

    document.getElementById("starLottie-wrapper").style.display = "none";
    lottieStar.style.display = "none";

  //  container.classList.remove('no-touch');

    isAnswerShown = false;
}


// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
        initGame();

        // Add click handlers to letter buttons
        const buttonGroups = document.querySelectorAll('.letter-button');
        buttonGroups.forEach(button => {
            button.addEventListener('click', function (e) {
                e.stopPropagation();
                handleLetterClick(this);
            });
        });

        // Add click handler to sound button
        const soundButton = document.getElementById('volume-icon') || document.getElementById('Group 196');
        if (soundButton) {
            soundButton.style.cursor = 'pointer';
            soundButton.addEventListener('click', function (e) {
                e.stopPropagation();
                playWordSound();
            });
        }

        showAnswerBtn.disabled = true;
        // Update button handlers
        if (showAnswerBtn) {
            showAnswerBtn.onclick = showAnswer;
        }

        const resetBtn = document.getElementById('next-btn');
        if (resetBtn) {
            resetBtn.onclick = resetSentence;
        }
});