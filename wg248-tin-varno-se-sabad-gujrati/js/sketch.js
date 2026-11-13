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

    // 4. Go to frame 0 immediately upon loading to show the initial state (the image)
    currentLottieInstance.addEventListener('DOMLoaded', () => {
        requestAnimationFrame(() => {
             currentLottieInstance.goToAndStop(0, true);
        });
    });
}

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