// Word puzzle game script
const words = [
    { "word": "गगन", "letters": ["ग", "म", "ण", "न", "भ", "स"], "answer": ["ग", "ग", "न"] },
    { "word": "मटर", "letters": ["त", "म", "ट", "र", "ग", "भ"], "answer": ["म", "ट", "र"] },
    { "word": "मगर", "letters": ["म", "ग", "र", "भ", "स", "न"], "answer": ["म", "ग", "र"] },
    { "word": "शहद", "letters": ["ष", "श", "ह", "द", "ध", "ड"], "answer": ["श", "ह", "द"] },
    { "word": "सड़क", "letters": ["स", "ड", "श", "ड़", "क", "ख"], "answer": ["स", "ड़", "क"] },
    { "word": "कमल", "letters": ["क", "ल", "न", "भ", "ज्ञ", "म"], "answer": ["क", "म", "ल"] },
    { "word": "कलम", "letters": ["ख", "क", "त", "न", "म", "ल"], "answer": ["क", "ल", "म"] },
    { "word": "नमक", "letters": ["ण", "न", "भ", "क", "व", "म"], "answer": ["न", "म", "क"] },
    { "word": "बटन", "letters": ["त", "ज", "ट", "ब", "व", "न"], "answer": ["ब", "ट", "न"] },
    { "word": "भवन", "letters": ["न", "भ", "ब", "व", "छ", "म"], "answer": ["भ", "व", "न"] },
    { "word": "फसल", "letters": ["प", "र", "फ", "स", "ज्ञ", "ल"], "answer": ["फ", "स", "ल"] },
    { "word": "हवन", "letters": ["ह", "झ", "त्र", "व", "न", "क्ष"], "answer": ["ह", "व", "न"] },
    { "word": "नयन", "letters": ["य", "ण", "र", "न", "ख", "श"], "answer": ["न", "य", "न"] },
    { "word": "कलश", "letters": ["भ", "क", "श", "ल", "स", "न"], "answer": ["क", "ल", "श"] },
    { "word": "रबड़", "letters": ["ड़", "ब", "ड", "द", "व", "र"], "answer": ["र", "ब", "ड़"] },
    { "word": "शहर", "letters": ["ह", "र", "श", "इ", "ष", "स"], "answer": ["श", "ह", "र"] },
    { "word": "गरम", "letters": ["र", "ग", "भ", "म", "य", "ह"], "answer": ["ग", "र", "म"] },
    { "word": "चरण", "letters": ["न", "ण", "च", "ज", "र", "स"], "answer": ["च", "र", "ण"] },
    { "word": "महल", "letters": ["म", "न", "ह", "स", "ल", "ज्ञ"], "answer": ["म", "ह", "ल"] },
    { "word": "नहर", "letters": ["र", "स", "ह", "न", "झ", "ग"], "answer": ["न", "ह", "र"] }
];

// Game state
let currentWordIndex = 0;
let currentWord = null;
let answerSlots = ["", "", ""]; // Three answer slots
let letterButtons = [];
let answerSlotElements = [];

// Audio mapping for letters
const letterAudioMap = {
    "ग": "02_ga.wav", "म": "24_ma.wav", "ण": "14_nan.wav", "न": "19_na.wav",
    "भ": "23_bha.wav", "स": "31_s.wav", "त": "15_ta.wav", "ट": "08_ta.wav",
    "र": "26_ra.wav", "श": "29_sha.wav", "ह": "32_ha.wav", "द": "17_da.wav",
    "ध": "18_dah.wav", "ड": "10_dha.wav", "ड़": "11_adha.wav", "क": "00_ka.wav",
    "ख": "01_kha.wav", "ल": "27_la.wav", "ब": "22_ba.wav", "व": "28_wa.wav",
    "फ": "21_pha.wav", "प": "20_pa.wav", "य": "25_ya.wav", "च": "04_ch.wav",
    "ज": "06_ja.wav", "झ": "07_jha.wav", "इ": "02_e.wav", "ष": "30_sa.wav",
    "क्ष": "33_chha.wav", "त्र": "34_tra.wav", "ज्ञ": "35_gya.wav", "छ": "05_cha.wav",
    "ल": "27_la.wav", "र": "26_ra.wav", "ह": "32_ha.wav", "घ": "03_gha.wav",
    "ठ": "09_tha.wav", "ढ": "12_ddha.wav", "ढ़": "13_addha.wav", "थ": "16_tha.wav" // Assuming fallback/lowercase
};

// --- LOTTIE INTEGRATION CONSTANTS & GLOBALS ---
const LOTTIE_ANIMATION_MAP = {
    "गगन": "Gagan.json", "मटर": "Matar.json", "मगर": "Magar.json",
    "शहद": "Shahad.json", "सड़क": "Sadak.json", "कमल": "Kamal.json",
    "कलम": "Kalam.json", "नमक": "Namak.json", "बटन": "Batan.json",
    "भवन": "Bhavan.json", "फसल": "Fasal.json", "हवन": "Havan.json",
    "नयन": "Nayan.json", "कलश": "Kalash.json", "रबड़": "Rabar.json",
    "शहर": "Shahar.json", "गरम": "Garam.json", "चरण": "Charan.json",
    "महल": "Mahal.json", "नहर": "Nahar.json"
};
let currentLottieInstance = null;

const ANIMATION_PATH_BASE = 'Assets/lottie-json/'; // Adjust this path if necessary
const LOTTIE_CONTAINER_ID = 'lottie-wrapper'; // ID of the SVG group/DIV where Lottie renders

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
 * Selects a random word from the words array
 */
// function selectRandomWord() {
//     currentWordIndex = Math.floor(Math.random() * words.length);
//     currentWord = words[currentWordIndex];
//     return currentWord;
// }

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
        return `Assets/Audio/Vyanjan_Sound/${audioFile}`;
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
        // Assuming your word sounds are in Assets/Audio/Word sound/word.mp3
        const audioPath = `Assets/Audio/Word sound/${wordName}.mp3`;
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

    // --- LOTTIE INTEGRATION POINT 2: Play the animation ---
    playLottieAnimation();

    // Play word sound after a small delay to sync with animation start
    setTimeout(() => {
        playWordSound();
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
    loadWord(selectNextWord());
}

/**
 * Shows the answer
 */
function showAnswer() {
    if (!currentWord) return;

    currentWord.answer.forEach((letter, index) => {
        answerSlots[index] = letter;
        if (answerSlotElements[index]) {
            answerSlotElements[index].textContent = letter;
        }
    });

    // Show final image (triggers Lottie animation playback)
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