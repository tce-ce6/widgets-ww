// Word puzzle game script
const words = [
    { "word": "कमळ", "letters": ["ग", "क", "ण", "म", "ल", "ळ"], "answer": ["क", "म", "ळ"] },
    { "word": "दगड", "letters": ["त", "द", "ट", "र", "ग", "ड"], "answer": ["द", "ग", "ड"] },
    { "word": "नमन", "letters": ["न", "ग", "म", "भ", "ण", "न"], "answer": ["न", "म", "न"] },
    { "word": "नगर", "letters": ["ण", "न", "घ", "ध", "ग", "र"], "answer": ["न", "ग", "र"] },
    { "word": "फणस", "letters": ["ष", "ण", "स", "व", "क", "फ"], "answer": ["फ", "ण", "स"] },
    { "word": "मगर", "letters": ["प", "ल", "ळ", "भ", "श", "स"], "answer": ["म", "ग", "र"] },
    { "word": "बदक", "letters": ["व", "ब", "ड", "द", "ख", "क"], "answer": ["ब", "द", "क"] },
    { "word": "रबर", "letters": ["म", "र", "भ", "ब", "ट", "र"], "answer": ["र", "ब", "र"] },
    { "word": "चरण", "letters": ["ण", "म", "च", "ल", "र", "न"], "answer": ["च", "र", "ण"] },
    { "word": "भवन", "letters": ["म", "भ", "ब", "व", "ज", "न"], "answer": ["भ", "व", "न"] },
    { "word": "हळद", "letters": ["इ", "ह", "ल", "ळ", "ड", "द"], "answer": ["ह", "ळ", "द"] },
    { "word": "गजर", "letters": ["घ", "ग", "झ", "ज", "र", "स"], "answer": ["ग", "ज", "र"] },
    { "word": "वजन", "letters": ["ब", "व", "झ", "ज", "न", "ण"], "answer": ["व", "ज", "न"] },
    { "word": "कळस", "letters": ["ख", "क", "ल", "ळ", "स", "र"], "answer": ["क", "ळ", "स"] },
    { "word": "गवत", "letters": ["ग", "व", "च", "ज", "त", "ण"], "answer": ["ग", "व", "त"] },
    { "word": "शहर", "letters": ["ह", "र", "श", "इ", "ष", "स"], "answer": ["श", "ह", "र"] },
    { "word": "गरम", "letters": ["र", "ग", "भ", "म", "य", "ह"], "answer": ["ग", "र", "म"] },
    { "word": "वरण", "letters": ["व", "ण", "च", "ज", "र", "स"], "answer": ["व", "र", "ण"] }
];

// Game state
let currentWordIndex = null;
let remainingWordIndexes = [];
let currentWord = null;
let answerSlots = ["", "", ""]; // Three answer slots
let letterButtons = [];
let answerSlotElements = [];
let isAnswerShown = false;
let answerRevealTimer = null;

// Audio mapping for letters
const letterAudioMap = {
    "ग": "02_ga.mp3", "म": "24_ma.mp3", "ण": "14_nan.mp3", "न": "19_na.mp3",
    "भ": "23_bha.mp3", "स": "31_s.mp3", "त": "15_ta.mp3", "ट": "08_t.mp3",
    "र": "26_ra.mp3", "श": "29_sha.mp3", "ह": "32_ha.mp3", "द": "17_da.mp3",
    "ध": "18_dah.mp3", "ड": "10_dha.mp3", "ड़": "11_adha.mp3", "क": "00_ka.mp3",
    "ख": "01_kha.mp3", "ल": "27_la.mp3", "ब": "22_ba.mp3", "व": "28_wa.mp3",
    "फ": "21_pha.mp3", "प": "20_pa.mp3", "य": "25_ya.mp3", "च": "04_ch.mp3",
    "ज": "06_ja.mp3", "झ": "07_jha.mp3", "इ": "02_e.mp3", "ष": "30_sa.mp3",
    "क्ष": "33_chha.mp3", "त्र": "34_tra.mp3", "ज्ञ": "35_gya.mp3", "छ": "05_cha.mp3", "उ": "08_oo.mp3", "ए": "07_ae.mp3", "आ": "01_aa.mp3", "ई": "03_ee.mp3", "ओ": "09_oh.mp3",
    "र": "26_ra.mp3", "ह": "32_ha.mp3", "घ": "03_gha.mp3", "ऊ": "08_ooh.mp3", "आ": "01_aa.mp3", "ई": "03_ee.mp3", "ओ": "09_oh.mp3",
    "ठ": "09_tha.mp3", "ढ": "12_ddha.mp3", "ढ़": "13_addha.mp3", "थ": "16_tha.mp3",
    "ए": "07_ae.mp3", "ळ": "36_la.mp3"
     // Assuming fallback/lowercase
};

// --- LOTTIE INTEGRATION CONSTANTS & GLOBALS ---
const LOTTIE_ANIMATION_MAP = {
    "कमळ": "kamal.json",
    "दगड": "dagad.json",
    "नमन": "naman.json",
    "नगर": "nagar.json",
    "फणस": "phanas.json",
    "मगर": "magar.json",
    "बदक": "badak.json",
    "रबर": "rabar.json",
    "चरण": "charan.json",
    "भवन": "bhavan.json",
    "हळद": "halad.json",
    "गजर": "gajar.json",
    "वजन": "vajan.json",
    "कळस": "kalas.json",
    "गवत": "gavat.json",
    "शहर": "shahar.json",
    "गरम": "garam.json",
    "वरण": "varan.json"
};

const WORD_AUDIO_MAP = {
    "कमळ": "kamal.mp3",
    "दगड": "dagad.mp3",
    "नमन": "naman.mp3",
    "नगर": "nagar.mp3",
    "फणस": "fanas.mp3",
    "मगर": "magar.mp3",
    "बदक": "badak.mp3",
    "रबर": "rabar.mp3",
    "चरण": "charan.mp3",
    "भवन": "bhavan.mp3",
    "हळद": "halad.mp3",
    "गजर": "gajar.mp3",
    "वजन": "vajan.mp3",
    "कळस": "kalas.mp3",
    "गवत": "gavat.mp3",
    "शहर": "shahar.mp3",
    "गरम": "garam.mp3",
    "वरण": "varan.mp3"
};

let currentLottieInstance = null;

const ANIMATION_PATH_BASE = 'assets/lottie-json/'; // Adjust this path if necessary
const LOTTIE_CONTAINER_ID = 'lottie-wrapper'; // ID of the SVG group/DIV where Lottie renders
let lettersDiv = document.getElementById('lettersDiv');
let dashLine = document.getElementById('Group 212');
let wordBox = document.getElementById('wordBox');
let completeWord = document.getElementById('completeWord');

/**
 * Loads the Lottie animation for the current word and sets it to the initial state (Frame 0).
 */
function loadInitialLottie(word) {
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
    const fileName = LOTTIE_ANIMATION_MAP[word];
    if (!fileName) {
        console.warn(`No Lottie file found for the word: ${word}`);
        // Optionally, hide the container if no animation exists
        container.innerHTML = '';
        return;
    }
    const animationPath = ANIMATION_PATH_BASE + fileName;
    console.log(animationPath);

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
 * Selects a random word without repeats until every word has been used.
 * The next shuffled cycle also avoids repeating the final word of the
 * previous cycle.
 * @returns {object} The next word object.
 */
function selectNextWord() {
    if (remainingWordIndexes.length === 0) {
        remainingWordIndexes = words.map((_, index) => index);

        for (let index = remainingWordIndexes.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [remainingWordIndexes[index], remainingWordIndexes[randomIndex]] =
                [remainingWordIndexes[randomIndex], remainingWordIndexes[index]];
        }

        if (remainingWordIndexes.length > 1 && remainingWordIndexes[0] === currentWordIndex) {
            [remainingWordIndexes[0], remainingWordIndexes[1]] =
                [remainingWordIndexes[1], remainingWordIndexes[0]];
        }
    }

    currentWordIndex = remainingWordIndexes.shift();
    currentWord = words[currentWordIndex];
    return currentWord;
}

/**
 * Gets the audio file path for a letter
 */
function getLetterAudioPath(letter) {
    const audioFile = letterAudioMap[letter];
    if (audioFile) {
        return `assets/audio/vyanjan-sound/${audioFile}`;
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
        const audioFile = WORD_AUDIO_MAP[wordName];
        if (!audioFile) {
            console.warn(`No word audio mapped for: ${wordName}`);
            return;
        }

        const audioPath = `assets/audio/word-sound/${audioFile}`;
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
    const showAnswerBtn = document.getElementById('show-example-btn');
    if (showAnswerBtn) {
        showAnswerBtn.disabled = false;
        showAnswerBtn.textContent = 'उत्तर पहा';
    }

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
    loadInitialLottie(word.word);
}

/**
 * Shows the final image when word is correct (NOW PLAYS LOTTIE ANIMATION)
 */
function showFinalImage() {
    if (!currentWord) return;
    isAnswerShown = true;
    const showAnswerBtn = document.getElementById('show-example-btn');
    if (showAnswerBtn) showAnswerBtn.textContent = 'उत्तर लपवा';

    // --- LOTTIE INTEGRATION POINT 2: Play the animation ---
    playLottieAnimation();

    // Play word sound after a small delay to sync with animation start
    clearTimeout(answerRevealTimer);
    answerRevealTimer = setTimeout(() => {
        playWordSound();
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
        const showAnswerBtn = document.getElementById('show-example-btn');
        if (showAnswerBtn) showAnswerBtn.disabled = true;

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
    clearTimeout(answerRevealTimer);
    isAnswerShown = false;
    lettersDiv.style.display = 'block';
    dashLine.style.display = 'block';
    wordBox.style.display = 'none';
    completeWord.style.display = 'none';
    const showAnswerBtn = document.getElementById('show-example-btn');
    if (showAnswerBtn) showAnswerBtn.textContent = 'उत्तर पहा';
    loadWord(selectNextWord());
}

/**
 * Shows the answer
 */
function showAnswer() {
    if (!currentWord) return;
    const showAnswerBtn = document.getElementById('show-example-btn');

    if (isAnswerShown) {
        clearTimeout(answerRevealTimer);
        isAnswerShown = false;
        dashLine.style.display = 'block';
        wordBox.style.display = 'none';
        completeWord.style.display = 'none';
        lettersDiv.style.display = 'block';
        if (showAnswerBtn) showAnswerBtn.textContent = 'उत्तर पहा';
        return;
    }

    isAnswerShown = true;
    dashLine.style.display = 'none';
    wordBox.style.display = 'block';
    completeWord.textContent = currentWord.word;
    completeWord.style.display = 'block';
    lettersDiv.style.display = 'none';
    if (showAnswerBtn) showAnswerBtn.textContent = 'उत्तर लपवा';

    // Show final image (triggers Lottie animation playback and word audio).
    showFinalImage();
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
