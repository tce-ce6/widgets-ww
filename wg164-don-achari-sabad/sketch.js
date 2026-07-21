// Word puzzle game script
const words = [
    { "word": "घर", "letters": ["घ", "ध", "र", "ह"], "answer": ["घ", "र"] },
    { "word": "नथ", "letters": ["ब", "न", "च", "थ"], "answer": ["न", "थ"] },
    { "word": "नळ", "letters": ["न", "ळ", "ल", "त"], "answer": ["न", "ळ"] },
    { "word": "फळ", "letters": ["ग", "फ", "प", "ळ"], "answer": ["फ", "ळ"] },
    { "word": "छत", "letters": ["च", "छ", "त", "ग"], "answer": ["छ", "त"] },
    { "word": "वन", "letters": ["ब", "व", "न", "त"], "answer": ["व", "न"] },
    { "word": "तट", "letters": ["त", "ट", "ठ", "थ"], "answer": ["त", "ट"] },
    { "word": "रथ", "letters": ["र", "थ", "ठ", "छ"], "answer": ["र", "थ"] },
    { "word": "मग", "letters": ["म", "न", "भ", "ग"], "answer": ["म", "ग"] },
    { "word": "कर", "letters": ["घ", "क", "र", "म"], "answer": ["क", "र"] },
    { "word": "धन", "letters": ["ड", "ध", "र", "न"], "answer": ["ध", "न"] },
    { "word": "कप", "letters": ["क", "ख", "फ", "प"], "answer": ["क", "प"] },
    { "word": "बस", "letters": ["ब", "स", "ष", "व"], "answer": ["ब", "स"] },
    { "word": "नऊ", "letters": ["ढ", "न", "स", "ऊ"], "answer": ["न", "ऊ"] },
    { "word": "रस", "letters": ["स", "र", "ष", "ख"], "answer": ["र", "स"] },
    { "word": "जग", "letters": ["च", "ज", "ग", "म"], "answer": ["ज", "ग"] },
    { "word": "खत", "letters": ["ख", "ट", "त", "झ"], "answer": ["ख", "त"] },
    { "word": "एक", "letters": ["इ", "ख", "ए", "क"], "answer": ["ए", "क"] },
    { "word": "तन", "letters": ["त", "त्र", "न", "ण"], "answer": ["त", "न"] },
    { "word": "नभ", "letters": ["ण", "न", "भ", "म"], "answer": ["न", "भ"] },
    { "word": "ढग", "letters": ["ट", "ढ", "न", "ग"], "answer": ["ढ", "ग"] }
];

// Game state
let currentWordIndex = 0;
let currentWord = null;
let answerSlots = ["", ""]; // Three answer slots
let letterButtons = [];
let answerSlotElements = [];

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
    "घर": "house.json",
    "नथ": "nath.json",
    "नळ": "tap.json",
    "फळ": "fruits.json",
    "छत": "roof.json",
    "वन": "forest.json",
    "तट": "beach.json",
    "रथ": "rath.json",
    "मग": "mug.json",
    "कर": "hand.json",
    "धन": "money.json",
    "कप": "cup.json",
    "बस": "bus.json",
    "नऊ": "nine.json",
    "रस": "juice.json",
    "जग": "jug.json",
    "खत": "fertilizer.json",
    "एक": "one.json",
    "तन": "body.json",
    "नभ": "sky.json",
    "ढग": "cloud.json"
};

const WORD_AUDIO_MAP = {
    "घर": "house.mp3",
    "नथ": "nath.mp3",
    "नळ": "tap.mp3",
    "फळ": "fruits.mp3",
    "छत": "roof.mp3",
    "वन": "forest.mp3",
    "तट": "beach.mp3",
    "रथ": "rath.mp3",
    "मग": "mug.mp3",
    "कर": "hand.mp3",
    "धन": "money.mp3",
    "कप": "cup.mp3",
    "बस": "bus.mp3",
    "नऊ": "nine.mp3",
    "रस": "juice.mp3",
    "जग": "jug.mp3",
    "खत": "fertilizer.mp3",
    "एक": "one.mp3",
    "तन": "body.mp3",
    "नभ": "sky.mp3",
    "ढग": "cloud.mp3"
};
let currentLottieInstance = null;
let starLottieInstance = null;
let isAnswerShown = false;
let currentAudio = null;

const ANIMATION_PATH_BASE = 'assets/JSON/'; // Adjust this path if necessary
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

function setNextButtonDisabled(disabled) {
    const nextButton = document.getElementById('next-btn');
    if (!nextButton) return;

    nextButton.disabled = disabled;
    nextButton.style.pointerEvents = disabled ? 'none' : 'auto';
    nextButton.style.opacity = disabled ? '0.6' : '1';
}

/**

 * Loads the Lottie animation for the current word and sets it to the initial state (Frame 0).
 */
function loadInitialLottie(word) {
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
    const fileName = LOTTIE_ANIMATION_MAP[word];
    if (!fileName) {
        console.warn(`No Lottie file found for the word: ${word}`);
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
        setNextButtonDisabled(true);
        currentLottieInstance.goToAndStop(0, true);
        currentLottieInstance.play();
        const animationDuration = 2000;
        setTimeout(() => {
            instructionText.textContent = "ऑडिओ ऐका आणि योग्य अक्षरे निवडून शब्द तयार करा.";
            soundIcon.style.display = 'block';
            afterContainer.style.display = 'block';
            lottieObject.setAttribute('x', 300);
            container.classList.add('no-touch');
            showAnswerBtn.disabled = false;
            setNextButtonDisabled(false);
        }, animationDuration)
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
    const animationPath = ANIMATION_PATH_BASE + "right-ans-stars.json";

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
        return `assets/audio/vyanjan-sound/${audioFile}`;
    }
    return null;
}

/**
 * Stops any currently playing audio.
 */
function stopCurrentAudio() {
    if (currentAudio) {
        try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        } catch (err) {
            console.log("Audio stop failed:", err);
        }
        currentAudio = null;
    }
}

/**
 * Plays an audio file and stops any previous playback first.
 */
function playAudio(audioPath, options = {}) {
    stopCurrentAudio();

    const audio = new Audio(audioPath);
    if (options.playbackRate !== undefined) {
        audio.playbackRate = options.playbackRate;
    }
    if (options.volume !== undefined) {
        audio.volume = options.volume;
    }

    currentAudio = audio;

    audio.play().catch(err => {
        console.log("Audio play failed:", err);
        if (currentAudio === audio) {
            currentAudio = null;
        }
    });

    audio.addEventListener('ended', () => {
        if (currentAudio === audio) {
            currentAudio = null;
        }
    }, { once: true });
}

/**
 * Plays audio for a letter
 */
function playLetterSound(letter) {
    const audioPath = getLetterAudioPath(letter);
    if (audioPath) {
        playAudio(audioPath);
    }
}

/**
 * Plays word sound
 */
function playWordSound() {
    if (currentWord && currentWord.word) {
        const wordName = currentWord.word;
        const audioFile = WORD_AUDIO_MAP[wordName];
        const audioPath = audioFile
            ? `assets/audio/word-sound/${audioFile}`
            : `assets/audio/word-sound/${wordName}.mp3`;
        playAudio(audioPath, { playbackRate: 0.75, volume: 1.0 });
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
    }, 1500);
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
    stopCurrentAudio();
    setNextButtonDisabled(true);
    document.getElementById("starLottie-wrapper").style.display="none";
    instructionText.textContent = "चित्र खरवडून त्यामागे काय लपलेले आहे ते पाहा.";
    showAnswerBtn.textContent = "उत्तर पहा";
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
    loadWord(selectNextWord());
    setNextButtonDisabled(false);
}

/**
 * Shows the answer
 */
function showAnswer() {
    if (!currentWord) return;

    stopCurrentAudio();

    // ---------------------- TOGGLE ON ----------------------
    if (!isAnswerShown) {

        // First click → Show the answer
        dashLine.style.display = 'none';
        wordBox.style.display = 'block';
        showAnswerBtn.textContent = "उत्तर लपवा";
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
    showAnswerBtn.textContent = "उत्तर पहा";
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