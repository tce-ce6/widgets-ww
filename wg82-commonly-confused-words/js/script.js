/**
 * Commonly Confused Words Widget
 * 
 * Game Logic:
 * - Load 36 questions pairing commonly confused words.
 * - Hide the jigsaw puzzle pieces initially.
 * - On "Listen to the Sentence" button click -> plays sentence audio.
 * - Enables word options after audio completion.
 * - On tapping correct option -> puzzle piece is revealed, correct word audio plays, Next button shows.
 * - On tapping wrong option -> option shakes, user tries again.
 */

const GlobalObj = {
    questions: [],
    currentLevel: 0,
    piecesCollected: 0,
    sentenceAudio: new Audio(),
    wordAudio: new Audio(),
    isPlaying: false,
    audioFinished: false,
    jigsawPieces: [],
    unrevealedIndices: [], // Tracks which piece indices are still hidden
    usageStats: {},       // Tracks how many times each word pair is used for testing
    correctCount: 0,      // Separate counter for correct responses
    isAnswered: false,    // Track if current question had an attempt to disable main button area

    // DOM elements
    btnListen: null,
    btnOption1: null,
    btnOption2: null,
    btnNext: null,
    textProgress: null,
    textQuestion: null,
    iText: null,
    infoText: null,

    // Audio child groups
    audioIconListen: null,
    audioIconOption1: null,
    audioIconOption2: null
};

// Extracted exactly from the storyboard references
const WORD_PAIRS = [
    { words: ["trail", "trial"] },
    { words: ["accept", "except"] },
    { words: ["desert", "dessert"] },
    { words: ["breath", "breathe"] },
    { words: ["from", "form"] },
    { words: ["quiet", "quite"] },
    { words: ["dairy", "diary"] },
    { words: ["angel", "angle"] },
    { words: ["collar", "colour"] },
    { words: ["later", "latter"] },
    { words: ["moral", "morale"] }, // Special audio format for morale 
    { words: ["affect", "effect"] },
    { words: ["adopt", "adapt"] },
    { words: ["then", "than"] },
    { words: ["sweet", "sweat"] },
    { words: ["wonder", "wander"] }, // added by me as two new words // audio files are not available yet
    { words: ["decent", "descent"] },
    { words: ["through", "thorough"] }
];

window.addEventListener('load', () => {
    initQuestions();
    initDOM();
    bindEvents();
    loadQuestion();
});

/**
 * Initializes and shuffles the 36 questions based on word pairs.
 * Ensures pairs appear twice, separated by other words.
 */
function initQuestions() {
    let firstHalf = [];
    let secondHalf = [];

    WORD_PAIRS.forEach(pair => {
        let w1 = pair.words[0];
        let w2 = pair.words[1];

        let wordSuffix = pair.isSecond ? '01' : '';

        // Question 1: where w1 is correct
        let q1Options = Math.random() > 0.5 ? [w1, w2] : [w2, w1];
        let q1 = {
            correct: w1,
            incorrect: w2,
            sentenceAudio: `./assets/audio/${w1}_b.mp3`,
            options: q1Options,
            optionsAudio: q1Options.map(opt => `./assets/audio/${opt}_a${wordSuffix}.mp3`)
        };

        // Question 2: where w2 is correct
        let q2Options = Math.random() > 0.5 ? [w1, w2] : [w2, w1];
        let q2 = {
            correct: w2,
            incorrect: w1,
            sentenceAudio: `./assets/audio/${w2}_b.mp3`,
            options: q2Options,
            optionsAudio: q2Options.map(opt => `./assets/audio/${opt}_a${wordSuffix}.mp3`)
        };

        firstHalf.push(q1);
        secondHalf.push(q2);
    });

    // Shuffle each half independently
    firstHalf.sort(() => Math.random() - 0.5);
    secondHalf.sort(() => Math.random() - 0.5);

    GlobalObj.questions = firstHalf.concat(secondHalf);

    // Set up indices for 36 puzzle pieces to be randomly revealed
    for (let i = 0; i < 36; i++) {
        GlobalObj.unrevealedIndices.push(i);
    }
    GlobalObj.unrevealedIndices.sort(() => Math.random() - 0.5);
}

/**
 * Grabs references to all necessary SVG specific interactive elements
 */
function initDOM() {
    GlobalObj.btnListen = document.getElementById('Listen_sentence_button');
    GlobalObj.btnOption1 = document.getElementById('Group_1566');
    GlobalObj.btnOption2 = document.getElementById('Group_1580');
    GlobalObj.btnNext = document.getElementById('Next_button');

    // Sub-audio groups
    if (GlobalObj.btnListen) GlobalObj.audioIconListen = GlobalObj.btnListen.querySelector('#Group_1565');
    if (GlobalObj.btnOption1) GlobalObj.audioIconOption1 = GlobalObj.btnOption1.querySelector('#Group_1565-2');
    if (GlobalObj.btnOption2) GlobalObj.audioIconOption2 = GlobalObj.btnOption2.querySelector('[data-name="Group 1565-2"]');

    // Default pointer styles
    if (GlobalObj.btnListen) GlobalObj.btnListen.style.cursor = 'pointer';
    if (GlobalObj.btnOption1) GlobalObj.btnOption1.style.cursor = 'pointer';
    if (GlobalObj.btnOption2) GlobalObj.btnOption2.style.cursor = 'pointer';
    if (GlobalObj.btnNext) GlobalObj.btnNext.style.cursor = 'pointer';

    if (GlobalObj.audioIconListen) GlobalObj.audioIconListen.style.cursor = 'pointer';
    if (GlobalObj.audioIconOption1) GlobalObj.audioIconOption1.style.cursor = 'pointer';
    if (GlobalObj.audioIconOption2) GlobalObj.audioIconOption2.style.cursor = 'pointer';

    // Option rectangle backgrounds to change fills
    GlobalObj.rectOption1 = document.getElementById('Rectangle_5-3');
    GlobalObj.rectOption2 = document.getElementById('Rectangle_5-4');

    const progressNode = document.getElementById('pieces_collected:_00');
    if (progressNode) {
        const tspans = progressNode.querySelectorAll('tspan');
        if (tspans.length > 1) GlobalObj.textProgress = tspans[1];
    }

    const questionNode = document.getElementById('question:_01');
    if (questionNode) {
        const tspans = questionNode.querySelectorAll('tspan');
        if (tspans.length > 1) GlobalObj.textQuestion = tspans[1];
    }

    GlobalObj.iText = document.getElementById('I-text');
    GlobalObj.infoText = document.getElementById('Info_text');

    // Make jigsaw pieces ready for reveal
    let jigsawContainer = document.getElementById('Jigsaw_pieces');
    if (jigsawContainer) {
        GlobalObj.jigsawPieces = Array.from(jigsawContainer.children);
    }
}

/**
 * Event bindings for buttons and audio
 */
function bindEvents() {
    if (GlobalObj.btnListen) GlobalObj.btnListen.addEventListener('click', playSentence);

    if (GlobalObj.btnOption1) GlobalObj.btnOption1.addEventListener('click', () => handleOptionSelect(0));
    if (GlobalObj.btnOption2) GlobalObj.btnOption2.addEventListener('click', () => handleOptionSelect(1));

    if (GlobalObj.btnNext) {
        GlobalObj.btnNext.addEventListener('click', () => {
            if (GlobalObj.currentLevel < GlobalObj.questions.length - 1) {
                GlobalObj.currentLevel++;
                loadQuestion();
            } else {
                console.log("[TEST] Completed! Final Usage Stats:", GlobalObj.usageStats);
                console.log("[TEST] Final Correct Total:", GlobalObj.correctCount);
                
                // Confetti animation completion
                const duration = 5 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                function randomInRange(min, max) {
                    return Math.random() * (max - min) + min;
                }

                const interval = setInterval(function() {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    const particleCount = 50 * (timeLeft / duration);
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                }, 250);
            }
        });
    }

    // Audio icon direct clicks
    if (GlobalObj.audioIconListen) {
        GlobalObj.audioIconListen.addEventListener('click', (e) => {
            e.stopPropagation();
            playSentence(true);
        });
    }
    if (GlobalObj.audioIconOption1) {
        GlobalObj.audioIconOption1.addEventListener('click', (e) => {
            e.stopPropagation();
            playWordAudio(0);
        });
    }
    if (GlobalObj.audioIconOption2) {
        GlobalObj.audioIconOption2.addEventListener('click', (e) => {
            e.stopPropagation();
            playWordAudio(1);
        });
    }

    GlobalObj.sentenceAudio.addEventListener('ended', () => {
        GlobalObj.isPlaying = false;
        GlobalObj.audioFinished = true;

        // Enable option interaction
        GlobalObj.btnOption1.style.opacity = '1';
        GlobalObj.btnOption2.style.opacity = '1';
        GlobalObj.btnOption1.style.pointerEvents = 'auto';
        GlobalObj.btnOption2.style.pointerEvents = 'auto';

        // Toggle instructional text
        if (GlobalObj.iText) GlobalObj.iText.style.display = 'none';
        if (GlobalObj.infoText) GlobalObj.infoText.style.display = '';
    });
}

/**
 * Plays the current sentence when the listen button is pressed
 */
function playSentence(forceFromIcon = false) {
    if (GlobalObj.isAnswered && !forceFromIcon) return;

    let q = GlobalObj.questions[GlobalObj.currentLevel];
    GlobalObj.isPlaying = true;
    GlobalObj.audioFinished = false;

    // Restart audio if already playing
    GlobalObj.sentenceAudio.pause();
    GlobalObj.sentenceAudio.currentTime = 0;

    // Disable word options until sentence finishes per wireframe interaction design
    // Only disable if we haven't attempted yet- once unlocked, they should probably stay interactive if it's a replay?
    // User: "Before the user attempts an answer... play the sentence audio."
    if (!GlobalObj.isAnswered) {
        GlobalObj.btnOption1.style.opacity = '0.5';
        GlobalObj.btnOption2.style.opacity = '0.5';
        GlobalObj.btnOption1.style.pointerEvents = 'none';
        GlobalObj.btnOption2.style.pointerEvents = 'none';
    }

    GlobalObj.sentenceAudio.src = q.sentenceAudio;
    GlobalObj.sentenceAudio.play();
}

/**
 * Updates the screen state to the current level
 */
function loadQuestion() {
    GlobalObj.isAnswered = false; // Reset attempt tracker
    
    if (GlobalObj.btnListen) GlobalObj.btnListen.style.opacity = '1';
    if (GlobalObj.btnNext) GlobalObj.btnNext.style.display = 'none';

    GlobalObj.isPlaying = false;
    GlobalObj.audioFinished = false;

    // Reset instruction texts visibility
    if (GlobalObj.iText) GlobalObj.iText.style.display = '';
    if (GlobalObj.infoText) GlobalObj.infoText.style.display = 'none';

    // Disable logic
    if (GlobalObj.btnOption1) {
        GlobalObj.btnOption1.style.opacity = '0.5';
        GlobalObj.btnOption1.style.pointerEvents = 'none';
    }
    if (GlobalObj.btnOption2) {
        GlobalObj.btnOption2.style.opacity = '0.5';
        GlobalObj.btnOption2.style.pointerEvents = 'none';
    }

    // Reset background color of the options
    if (GlobalObj.rectOption1) GlobalObj.rectOption1.setAttribute('fill', '#aef241');
    if (GlobalObj.rectOption2) GlobalObj.rectOption2.setAttribute('fill', '#aef241');

    setProgressText(GlobalObj.piecesCollected);
    setQuestionText(GlobalObj.currentLevel + 1);

    // Apply texts specifically mapped to each option
    let q = GlobalObj.questions[GlobalObj.currentLevel];

    // Logging for testing purposes
    const pairKey = q.options.slice().sort().join("/");
    GlobalObj.usageStats[pairKey] = (GlobalObj.usageStats[pairKey] || 0) + 1;
    console.log(`[TEST] Question ${GlobalObj.currentLevel + 1}: ${pairKey} (Usage: ${GlobalObj.usageStats[pairKey]})`);

    if (GlobalObj.btnOption1) GlobalObj.btnOption1.dataset.word = q.options[0];
    if (GlobalObj.btnOption2) GlobalObj.btnOption2.dataset.word = q.options[1];

    setCenteredText('through', q.options[0], 1247.42, 254, 823.84);
    setCenteredText('thorough', q.options[1], 1547.42, 254, 823.84);
}

/**
 * Evaluates correctness and updates feedback/animates conditionally
 * @param {number} optIndex - 0 for left button, 1 for right button
 */
function handleOptionSelect(optIndex) {
    if (GlobalObj.isPlaying || !GlobalObj.audioFinished) return;

    // Register an attempt and disable the question button area
    if (!GlobalObj.isAnswered) {
        GlobalObj.isAnswered = true;
        if (GlobalObj.btnListen) GlobalObj.btnListen.style.opacity = '0.7';
    }

    playWordAudio(optIndex);

    let q = GlobalObj.questions[GlobalObj.currentLevel];
    let selectedWord = (optIndex === 0) ? GlobalObj.btnOption1.dataset.word : GlobalObj.btnOption2.dataset.word;

    let btnElement = (optIndex === 0) ? GlobalObj.btnOption1 : GlobalObj.btnOption2;
    let rectElement = (optIndex === 0) ? GlobalObj.rectOption1 : GlobalObj.rectOption2;

    if (selectedWord === q.correct) {
        // Correct Action
        GlobalObj.btnOption1.style.pointerEvents = 'none';
        GlobalObj.btnOption2.style.pointerEvents = 'none';

        GlobalObj.piecesCollected++;
        GlobalObj.correctCount++;
        console.log(`[TEST] Correct! Total Correct: ${GlobalObj.correctCount}`);
        setProgressText(GlobalObj.piecesCollected);

        // Indicate correctness via color change visually
        rectElement.setAttribute('fill', '#74b62b');

        // Reveal background puzzle component
        if (GlobalObj.unrevealedIndices.length > 0) {
            const idx = GlobalObj.unrevealedIndices.pop();
            const piece = GlobalObj.jigsawPieces[idx];
            piece.style.transition = 'opacity 0.6s ease';
            piece.style.opacity = '0';
            setTimeout(() => { piece.style.display = 'none'; }, 600);
        }

        if (GlobalObj.btnNext) GlobalObj.btnNext.style.display = '';
    } else {
        // Wrong Action - Shake Animation
        playShakeAnimation(btnElement, rectElement);
    }
}

function playWordAudio(optIndex) {
    let q = GlobalObj.questions[GlobalObj.currentLevel];
    
    // Play the word audio for whichever option was clicked
    GlobalObj.wordAudio.pause();
    GlobalObj.wordAudio.currentTime = 0;
    GlobalObj.wordAudio.src = q.optionsAudio[optIndex];
    GlobalObj.wordAudio.play();
}

/**
 * Text centering logic for replacing manually positioned tspan elements
 * @param {string} groupId 
 * @param {string} textStr 
 * @param {number} boxX 
 * @param {number} boxWidth 
 * @param {number} boxBaseline 
 */
function setCenteredText(groupId, textStr, boxX, boxWidth, boxBaseline) {
    const group = document.getElementById(groupId);
    if (!group) return;

    const textNode = group.querySelector('text');
    if (textNode) {
        // Clear children
        while (textNode.firstChild) {
            textNode.removeChild(textNode.firstChild);
        }

        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.textContent = textStr;
        tspan.setAttribute("x", "0");
        tspan.setAttribute("y", "0");
        textNode.appendChild(tspan);

        // Setup anchor to middle
        textNode.setAttribute('text-anchor', 'middle');
        const centerX = boxX + (boxWidth / 2) + 35;

        // Translate text directly to the center coordinates
        textNode.setAttribute('transform', `translate(${centerX} ${boxBaseline})`);
    }
}

function setProgressText(piecesAmount) {
    if (!GlobalObj.textProgress) return;
    const formatted = piecesAmount.toString().padStart(2, '0');
    GlobalObj.textProgress.textContent = `${formatted}/36 `;
}

function setQuestionText(qAmount) {
    if (!GlobalObj.textQuestion) return;
    const formatted = qAmount.toString().padStart(2, '0');
    GlobalObj.textQuestion.textContent = `${formatted}/36 `;
}

/**
 * Native animation implementation for indicating incorrect submission
 * @param {Element} element - the group to shake
 * @param {Element} fillRect - the element rectangle to flash red
 */
function playShakeAnimation(element, fillRect) {
    const originalFill = fillRect.getAttribute('fill');
    fillRect.setAttribute('fill', '#ff4c4c'); // Red feedback

    element.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0)' }
    ], {
        duration: 400,
        easing: 'ease-in-out'
    }).onfinish = () => {
        fillRect.setAttribute('fill', originalFill);
    };
}
