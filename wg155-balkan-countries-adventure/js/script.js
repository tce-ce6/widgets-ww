/**
 * Global variables for the application state
 */
const AppState = {

    elements: {
        nextBtn: null,
        step1: null,
        step2: null,
        mapBg: null,
        map: null,
        flagsWrapper: null,
        iText2: null,
        btnQuiz: null,
        questionContainer: null,
        questionTxt: null,
        options: [],
        correctAnswerPopup: null,
        correctAnswerBody: null,
        factBitePopup: null,
        countryTitle: null,
        capitalTxt: null,
        funFactTxt: null,
        didYouKnowTxt: null,
        lottieWrapper: null,
        correctLottie: null,
        tryAgainPopup: null,
        countryMaps: {}
    },
    mapState: {
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        currentScale: 1
    },
    data: null,
    currentCountryData: null,
    selectedCountry: null,
    currentQuestionIndex: 0,
    wrongMapAttempts: 0,
    wrongQuizAttempts: 0,
    quizAttempted: false,
    score: 0,
    mapLocked: false,
    mapEnabled: false
};

const COUNTRY_IDS = [
    'bulgaria', 'serbia', 'croatia', 'north-macedonia', 'kosovo',
    'bosnia-and-herzegovina', 'greece', 'montenegro', 'albania', 'slovenia'
];

function initCountryBoxes() {
    COUNTRY_IDS.forEach(id => {
        const box = document.getElementById(id);

        if (!box) return;

        box.addEventListener('click', () => {

            // store selected country
            AppState.selectedCountry = id;
            handleCountryClick(id);

            // highlight selected box
            document.querySelectorAll('.country-box').forEach(el => {
                el.classList.remove('selected', 'active', 'correct');
            });

            box.classList.add('selected');

        });
    });
}

function initMapDropCheck() {

    COUNTRY_IDS.forEach(id => {

        const mapCountry = document.getElementById(id + '-map');

        if (!mapCountry) return;

        mapCountry.addEventListener('click', () => {
            if (!AppState.mapEnabled) return; // ❌ block until quiz correct

            if (AppState.mapLocked) return;

            if (!AppState.selectedCountry) return;

            const correctCountry = AppState.currentCountryData
                ? AppState.currentCountryData.country.toLowerCase().replace(/\s/g, '-')
                : null;

            // ❗ USER SELECTED WRONG FLAG
            if (AppState.selectedCountry !== correctCountry) {

                AppState.wrongMapAttempts++;

                const wrongFlagPopup = document.getElementById('wrong-flag-selected');

                if (wrongFlagPopup) {
                    wrongFlagPopup.style.display = 'block';

                    setTimeout(() => {
                        wrongFlagPopup.style.display = 'none';
                    }, 2000);
                }

                if (AppState.wrongMapAttempts >= 2) {
                    // Hide other wrong popups
                    if (wrongFlagPopup) wrongFlagPopup.style.display = 'none';
                    if (AppState.elements.tryAgainPopup) AppState.elements.tryAgainPopup.style.display = 'none';

                    const missedItPopup = document.getElementById('missed-it-popup');
                    if (missedItPopup) {
                        missedItPopup.style.display = 'block';
                        setTimeout(() => {
                            missedItPopup.style.display = 'none';
                            // Auto-place correct flag
                            document.querySelectorAll('.country-box').forEach(el => el.classList.remove('selected', 'active', 'correct'));
                            const correctFlagEl = document.getElementById(correctCountry);
                            if (correctFlagEl) correctFlagEl.classList.add('correct');
                            AppState.selectedCountry = correctCountry;
                            placeFlagOnMap(correctCountry);
                            const chooseFlagPopup = document.getElementById('choose-flag-popup');
                            if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';
                            const btnNext = document.getElementById('btn-next');
                            if (btnNext) btnNext.style.display = 'block';
                        }, 3000);
                    }
                }

                return; // 🚫 stop flag placement
            }

            // CORRECT MATCH
            if (AppState.selectedCountry === id) {

                if (AppState.elements.correctAnswerPopup) {
                    AppState.elements.correctAnswerPopup.style.display = 'block';

                    setTimeout(() => {
                        AppState.elements.correctAnswerPopup.style.display = 'none';
                    }, 2000);
                }

                const chooseFlagPopup = document.getElementById('choose-flag-popup');
                if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';

                // show lottie wrapper
                if (AppState.elements.lottieWrapper) {
                    AppState.elements.lottieWrapper.style.display = 'block';
                }

                // play lottie animation
                if (AppState.elements.correctLottie && typeof lottie !== 'undefined') {
                    AppState.elements.correctLottie.innerHTML = '';
                    lottie.loadAnimation({
                        container: AppState.elements.correctLottie,
                        renderer: 'svg',
                        loop: false,
                        autoplay: true,
                        path: './lottie/correct.json'
                    });
                }

                // Award 1 mark for correct flag-country match ON FIRST ATTEMPT
                if (AppState.wrongMapAttempts === 0) {
                    AppState.score++;
                    updateMarksUI();
                }

                // show navigation buttons
                const btnNext = document.getElementById('btn-next');
                if (btnNext) btnNext.style.display = 'block';

                placeFlagOnMap(id);
            }
            // WRONG MATCH
            else {

                const correctCountry = AppState.currentCountryData
                    ? AppState.currentCountryData.country.toLowerCase().replace(/\s/g, '-')
                    : null;

                // ❗ WRONG FLAG SELECTED
                if (AppState.selectedCountry !== correctCountry) {

                    AppState.wrongMapAttempts++;

                    const wrongFlagPopup = document.getElementById('wrong-flag-selected');

                    if (wrongFlagPopup) {
                        wrongFlagPopup.style.display = 'block';

                        setTimeout(() => {
                            wrongFlagPopup.style.display = 'none';
                        }, 2000);
                    }

                    if (AppState.wrongMapAttempts >= 2) {
                        const missedItPopup = document.getElementById('missed-it-popup');
                        if (missedItPopup) {
                            missedItPopup.style.display = 'block';
                            setTimeout(() => {
                                missedItPopup.style.display = 'none';
                                // Auto-place correct flag
                                document.querySelectorAll('.country-box').forEach(el => el.classList.remove('selected', 'active', 'correct'));
                                const correctFlagEl = document.getElementById(correctCountry);
                                if (correctFlagEl) correctFlagEl.classList.add('correct');
                                AppState.selectedCountry = correctCountry;
                                placeFlagOnMap(correctCountry);
                                const chooseFlagPopup = document.getElementById('choose-flag-popup');
                                if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';
                                const btnNext = document.getElementById('btn-next');
                                if (btnNext) btnNext.style.display = 'block';
                            }, 3000);
                        }
                    }

                    return;
                }

                // NORMAL WRONG MAP CLICK
                AppState.wrongMapAttempts++;

                if (AppState.elements.tryAgainPopup) {
                    AppState.elements.tryAgainPopup.style.display = 'block';

                    setTimeout(() => {
                        AppState.elements.tryAgainPopup.style.display = 'none';
                    }, 2000);
                }

                if (AppState.wrongMapAttempts >= 2) {
                    // Hide other wrong popups
                    if (wrongFlagPopup) wrongFlagPopup.style.display = 'none';
                    if (AppState.elements.tryAgainPopup) AppState.elements.tryAgainPopup.style.display = 'none';

                    const missedItPopup = document.getElementById('missed-it-popup');
                    if (missedItPopup) {
                        missedItPopup.style.display = 'block';
                        setTimeout(() => {
                            missedItPopup.style.display = 'none';
                            // Auto-place correct flag
                            document.querySelectorAll('.country-box').forEach(el => el.classList.remove('selected', 'active', 'correct'));
                            const correctFlagEl = document.getElementById(correctCountry);
                            if (correctFlagEl) correctFlagEl.classList.add('correct');
                            AppState.selectedCountry = correctCountry;
                            placeFlagOnMap(correctCountry);
                            const chooseFlagPopup = document.getElementById('choose-flag-popup');
                            if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';
                            const btnNext = document.getElementById('btn-next');
                            if (btnNext) btnNext.style.display = 'block';
                        }, 3000);
                    }
                }

            }

        });

    });

}

function resetStepTwo() {
    // 1. Reset all state flags & counters
    AppState.wrongMapAttempts = 0;
    AppState.wrongQuizAttempts = 0;
    AppState.quizAttempted = false;
    AppState.mapLocked = false;
    AppState.mapEnabled = false;
    AppState.selectedCountry = null;
    AppState.currentCountryData = null;

    // 2. Hide all dynamic info and quiz UI
    if (AppState.elements.questionContainer) {
        AppState.elements.questionContainer.style.display = 'none';
    }
    if (AppState.elements.btnQuiz) {
        AppState.elements.btnQuiz.style.display = 'none';
    }
    if (AppState.elements.iText2) {
        AppState.elements.iText2.style.display = 'none';
    }
    if (AppState.elements.factBitePopup) {
        AppState.elements.factBitePopup.style.display = 'none';
    }

    // 3. Restore initial instruction text
    const iText1 = document.getElementById('i-text1');
    if (iText1) iText1.style.display = 'block';

    // 4. Hide all game popups
    if (AppState.elements.correctAnswerPopup) {
        AppState.elements.correctAnswerPopup.style.display = 'none';
    }
    if (AppState.elements.tryAgainPopup) {
        AppState.elements.tryAgainPopup.style.display = 'none';
    }
    if (AppState.elements.lottieWrapper) {
        AppState.elements.lottieWrapper.style.display = 'none';
    }
    
    // Auxiliary popups
    const auxiliaryPopups = ['missed-it-popup', 'choose-flag-popup', 'not-country', 'btn-show-answer', 'btn-next'];
    auxiliaryPopups.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // 5. Reset map highlights and flags
    document.querySelectorAll('.country-box').forEach(el => {
        el.classList.remove('selected', 'active', 'correct');
    });

    COUNTRY_IDS.forEach(id => {
        const countryMapEl = document.getElementById(id);
        if (countryMapEl) countryMapEl.classList.remove('selected', 'correct');

        const flag = document.getElementById(id + '-flag');
        if (flag) {
            flag.style.display = 'none';
            flag.setAttribute('transform', 'translate(0, 0)');
        }
    });

    // 6. Enable flags-wrapper for the next turn
    if (AppState.elements.flagsWrapper) {
        AppState.elements.flagsWrapper.classList.remove('disabled');
        AppState.elements.flagsWrapper.style.opacity = '1';
        AppState.elements.flagsWrapper.style.pointerEvents = 'auto';
    }

    // 7. Reset quiz elements (text and options)
    if (AppState.elements.questionTxt) {
        AppState.elements.questionTxt.textContent = '';
    }
    if (AppState.elements.options) {
        AppState.elements.options.forEach(li => {
            if (!li) return;
            li.classList.remove('correct', 'wrong', 'disabled');
        });
    }
}

function handleNextQuestion() {
    const questions = AppState.data.questions;

    // move to next question index
    AppState.currentQuestionIndex++;

    // ✅ ALWAYS clear flag states when Next is clicked
    COUNTRY_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('selected', 'correct');
            // reset transform for the NEXT round
            const flag = document.getElementById(id + '-flag');
            if (flag) {
                flag.setAttribute('transform', 'translate(0, 0)');
            }
        }
    });

    // Check if we finished all questions
    if (AppState.data && AppState.data.questions && AppState.currentQuestionIndex >= questions.length) {
        // Hide UI elements but preserve the map
        if (AppState.elements.questionContainer) AppState.elements.questionContainer.style.display = 'none';
        if (AppState.elements.factBitePopup) AppState.elements.factBitePopup.style.display = 'none';
        if (AppState.elements.iText2) AppState.elements.iText2.style.display = 'none';
        if (AppState.elements.btnQuiz) AppState.elements.btnQuiz.style.display = 'none';
        if (AppState.elements.lottieWrapper) AppState.elements.lottieWrapper.style.display = 'none';
        
        // Disable flags wrapper
        if (AppState.elements.flagsWrapper) AppState.elements.flagsWrapper.classList.add('disabled');

        // Hide all flags from map
        COUNTRY_IDS.forEach(id => {
            const flag = document.getElementById(id + '-flag');
            if (flag) flag.style.display = 'none';
        });

        // Show ONLY the replay button
        const btnResetFull = document.getElementById('btn-reset');
        if (btnResetFull) btnResetFull.style.display = 'none';

        const btnReplay = document.getElementById('btn-replay');
        if (btnReplay) btnReplay.style.display = 'block';

        // Hide Next button
        const btnNextFull = document.getElementById('btn-next');
        if (btnNextFull) btnNextFull.style.display = 'none';
        
        return;
    }

    const data = questions[AppState.currentQuestionIndex];
    AppState.currentCountryData = data;

    // reset step-2 UI
    resetStepTwo();
    if (AppState.elements.questionContainer) {
        AppState.elements.questionContainer.style.display = 'none';
    }
    // hide quiz UI
    attachOptionListeners();

    if (AppState.elements.iText2) {
        AppState.elements.iText2.style.display = 'none';
    }

    if (AppState.elements.btnQuiz) {
        AppState.elements.btnQuiz.style.display = 'none';
    }

    // update question text
    if (AppState.elements.questionTxt) {
        AppState.elements.questionTxt.textContent = 'Q. ' + data.question;
    }

    // update options
    const labels = ['A', 'B', 'C', 'D'];

    AppState.elements.options.forEach((li, index) => {

        if (!li) return;

        // remove previous state classes
        li.classList.remove('correct', 'wrong', 'disabled');

        const labelSpan = li.querySelector('.label');

        if (labelSpan) {

            labelSpan.textContent = labels[index];

            const textNodes = [...li.childNodes].filter(
                n => n.nodeType === Node.TEXT_NODE
            );

            if (textNodes.length > 0) {
                textNodes[0].textContent = data.options[index];
            } else {
                li.appendChild(document.createTextNode(data.options[index]));
            }

        } else {

            li.textContent = labels[index] + ' ' + data.options[index];

        }

    });

    // reattach option listeners
    attachOptionListeners();
}

const FLAG_OFFSETS = {
    bulgaria: { x: 8, y: -3 },
    serbia: { x: 5, y: -10 },
    croatia: { x: 10, y: -17 },
    "north-macedonia": { x: 2, y: -1 },
    kosovo: { x: 0, y: -3 },
    "bosnia-and-herzegovina": { x: 7, y: -5 },
    greece: { x: 4, y: -23 },
    montenegro: { x: -2, y: -7 },
    albania: { x: 0, y: 0 },
    slovenia: { x: 2, y: 0 }
};

function placeFlagOnMap(countryId) {

    const mapContainer = document.getElementById('map-container');
    const mapGroup = document.getElementById(countryId + '-map');
    const flag = document.getElementById(countryId + '-flag');

    if (!mapGroup || !flag || !mapContainer) return;

    // Move selected map to the top
    mapContainer.appendChild(mapGroup);

    // Show flag
    flag.style.display = 'block';

    // Append flag inside map
    mapGroup.appendChild(flag);

    const mapBox = mapGroup.getBBox();
    const flagBox = flag.getBBox();

    // Center flag
    let x = mapBox.x + (mapBox.width / 2) - (flagBox.width / 2);
    let y = mapBox.y + (mapBox.height / 2) - (flagBox.height / 2);

    // Apply custom offsets
    const offset = FLAG_OFFSETS[countryId];
    if (offset) {
        x += offset.x;
        y += offset.y;
    }

    flag.setAttribute(
        "transform",
        `translate(${x - flagBox.x}, ${y - flagBox.y})`
    );

    AppState.mapLocked = true;
}
/**
 * Initialize DOM element references
 */
function initElements() {

    AppState.elements.nextBtn = document.getElementById('next-btn');
    AppState.elements.step1 = document.getElementById('step-1');
    AppState.elements.step2 = document.getElementById('step-2');
    AppState.elements.mapBg = document.getElementById('map-bg');
    AppState.elements.map = document.getElementById('map');

    AppState.elements.flagsWrapper = document.getElementById('flags-wrapper');
    AppState.elements.iText2 = document.getElementById('i-text2');
    AppState.elements.btnQuiz = document.getElementById('btn-quiz');
    AppState.elements.questionContainer = document.getElementById('question-container');
    AppState.elements.questionTxt = document.getElementById('question-txt');
    // Collect the 4 option <li> elements
    AppState.elements.options = [
        document.getElementById('option-1'),
        document.getElementById('option-2'),
        document.getElementById('option-3'),
        document.getElementById('option-4')
    ];
    // Popup elements
    AppState.elements.correctAnswerPopup = document.getElementById('correct-answer-popup');
    AppState.elements.correctAnswerBody = document.getElementById('correct-answer-body');
    AppState.elements.factBitePopup = document.getElementById('fact-bite-popup');
    AppState.elements.countryTitle = document.getElementById('country-title');
    AppState.elements.capitalTxt = document.getElementById('capital-txt');
    AppState.elements.funFactTxt = document.getElementById('funFact-txt');
    AppState.elements.didYouKnowTxt = document.getElementById('didYouKnow-txt');
    // Lottie elements
    AppState.elements.lottieWrapper = document.getElementById('lottie-wrapper');
    AppState.elements.correctLottie = document.getElementById('correct-lottie');
    // Wrong answer popup
    AppState.elements.tryAgainPopup = document.getElementById('try-again-popup');

    COUNTRY_IDS.forEach(id => {
        AppState.elements.countryMaps[id] = document.getElementById(id);
    });
}

/**
 * Helper to get mouse coordinates relative to the SVG container
 */
function getMousePosition(evt, svg) {
    const CTM = svg.getScreenCTM();
    if (evt.touches) { evt = evt.touches[0]; }
    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

/**
 * Initialize map panning and clipping
 */
function initMapPanAndClip() {
    const mapBg = AppState.elements.mapBg;
    const map = AppState.elements.map;

    if (!mapBg || !map) return;

    const svg = map.closest('svg');
    if (!svg) return;

    // 1. Setup Clip Path to clip #map to #Rectangle 343 bounds inside #map-bg
    let defs = svg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.insertBefore(defs, svg.firstChild);
    }
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.id = 'map-clip';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Using Vector_5 path from Rectangle 343 (the main background block for the map)
    path.setAttribute('d', 'M1735 127.242H704C690.745 127.242 680 137.987 680 151.242V841.242C680 854.497 690.745 865.242 704 865.242H1735C1748.25 865.242 1759 854.497 1759 841.242V151.242C1759 137.987 1748.25 127.242 1735 127.242Z');
    clipPath.appendChild(path);
    defs.appendChild(clipPath);

    // Create wrapper for clipping so translation on #map works independently
    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.id = 'map-wrapper';
    wrapper.setAttribute('clip-path', 'url(#map-clip)');

    map.parentNode.insertBefore(wrapper, map);
    wrapper.appendChild(map);

    // 2. Setup Panning and Zooming Listeners
    mapBg.style.cursor = 'grab';

    const updateMapTransform = () => {
        map.setAttribute('transform', `translate(${AppState.mapState.currentX}, ${AppState.mapState.currentY}) scale(${AppState.mapState.currentScale})`);
    };

    const startDrag = (e) => {
        AppState.mapState.isDragging = true;
        const pos = getMousePosition(e, svg);
        AppState.mapState.startX = pos.x;
        AppState.mapState.startY = pos.y;
        mapBg.style.cursor = 'grabbing';
    };

    const drag = (e) => {
        if (!AppState.mapState.isDragging) return;
        e.preventDefault();
        const pos = getMousePosition(e, svg);
        const dx = pos.x - AppState.mapState.startX;
        const dy = pos.y - AppState.mapState.startY;

        AppState.mapState.startX = pos.x;
        AppState.mapState.startY = pos.y;

        AppState.mapState.currentX += dx;
        AppState.mapState.currentY += dy;

        updateMapTransform();
    };

    const endDrag = () => {
        AppState.mapState.isDragging = false;
        mapBg.style.cursor = 'grab';
    };

    const zoom = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        let newScale = AppState.mapState.currentScale + delta;
        newScale = Math.min(Math.max(0.5, newScale), 5); // Limit zoom out to 0.5x and zoom in to 5x

        const scaleRatio = newScale / AppState.mapState.currentScale;
        const pos = getMousePosition(e, svg);

        AppState.mapState.currentX = pos.x - (pos.x - AppState.mapState.currentX) * scaleRatio;
        AppState.mapState.currentY = pos.y - (pos.y - AppState.mapState.currentY) * scaleRatio;
        AppState.mapState.currentScale = newScale;

        updateMapTransform();
    };

    // Attach to mapBg so we can click and drag anywhere in the background
    mapBg.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);
    mapBg.addEventListener('wheel', zoom, { passive: false });
}

/**
 * Load quiz data from data.json
 */
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data.json');
        AppState.data = await response.json();
        
        // Shuffle questions for random order
        if (AppState.data && AppState.data.questions) {
            shuffleArray(AppState.data.questions);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Handle country click
 */
function handleCountryClick(countryId) {
    if (!AppState.data || !AppState.data.questions) return;

    // store selected country
    AppState.selectedCountry = countryId;

    // Use currentQuestionIndex instead of random to prevent repeated questions
    const questions = AppState.data.questions;
    // Safety check for index out of bounds
    const safeIndex = Math.min(AppState.currentQuestionIndex, questions.length - 1);
    AppState.currentCountryData = questions[safeIndex];

    /* Remove redundant disable from here to allow changing minds before quiz starts */
    if (AppState.elements.flagsWrapper) {
        AppState.elements.flagsWrapper.classList.add('disabled');
    }
    // Only show quiz buttons if the map phase for this question hasn't started
    const isQuizShown = AppState.elements.questionContainer && AppState.elements.questionContainer.style.display === 'block';

    if (!AppState.mapEnabled && !AppState.mapLocked && !isQuizShown) {
        if (AppState.elements.iText2) {
            AppState.elements.iText2.style.display = 'block';
        }
        if (AppState.elements.btnQuiz) {
            AppState.elements.btnQuiz.style.display = 'block';
        }
    }
}

function handleGameReset() {
    // 1. Reset all step-2 data and UI elements
    resetStepTwo();

    // 2. Reset score and global progress
    AppState.currentQuestionIndex = 0;
    AppState.score = 0;
    updateMarksUI();

    // 3. Reset map zoom/pan to initial view
    AppState.mapState.currentX = 0;
    AppState.mapState.currentY = 0;
    AppState.mapState.currentScale = 1;
    if (AppState.elements.map) {
        AppState.elements.map.setAttribute('transform', 'translate(0, 0) scale(1)');
    }

    // 4. Shuffle questions for a fresh game experience
    if (AppState.data && AppState.data.questions) {
        shuffleArray(AppState.data.questions);
    }

    // 5. Hide end-game buttons
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) btnReset.style.display = 'none';

    const btnReplay = document.getElementById('btn-replay');
    if (btnReplay) btnReplay.style.display = 'none';
    
    const btnNext = document.getElementById('btn-next');
    if (btnNext) btnNext.style.display = 'none';
}

/**
 * Attach event listeners to elements
 */
function attachEventListeners() {
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.addEventListener('click', handleGameReset);
    }

    const btnReplay = document.getElementById('btn-replay');
    if (btnReplay) {
        btnReplay.addEventListener('click', handleGameReset);
    }
    const btnShowAnswer = document.getElementById('btn-show-answer');

    if (btnShowAnswer) {

        btnShowAnswer.addEventListener('click', () => {

            if (!AppState.selectedCountry) return;

            // place correct flag
            const correctCountry = AppState.currentCountryData
                ? AppState.currentCountryData.country.toLowerCase().replace(/\s/g, '-')
                : null;

            if (correctCountry) {

                const correctFlag = document.getElementById(correctCountry);

                if (correctFlag) {

                    document.querySelectorAll('.country-box').forEach(el => {
                        el.classList.remove('selected', 'active', 'correct');
                    });

                    correctFlag.classList.add('correct');

                    // ✅ IMPORTANT: set selected country to correct one
                    AppState.selectedCountry = correctCountry;

                    // ✅ place flag automatically on correct map
                    placeFlagOnMap(correctCountry);
                }
            }

            // show correct popup
            // if (AppState.elements.correctAnswerPopup) {
            //     AppState.elements.correctAnswerPopup.style.display = 'block';
            // }

            // hide choose flag popup
            const chooseFlagPopup = document.getElementById('choose-flag-popup');
            if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';

            btnShowAnswer.style.display = 'none';

            const btnNext = document.getElementById('btn-next');

            if (btnNext) btnNext.style.display = 'block';

        });

    }
    if (AppState.elements.questionContainer) {

        AppState.elements.questionContainer.addEventListener('click', (e) => {

            // only hide if user clicks the container background
            if (e.target !== AppState.elements.questionContainer) return;

            // hide question container
            AppState.elements.questionContainer.style.display = 'none';

            // reset selected country
            AppState.selectedCountry = null;

            // remove highlight from country boxes
            document.querySelectorAll('.country-box').forEach(el => {
                el.classList.remove('selected', 'active', 'correct');
            });

            // enable flag selection again
            if (AppState.elements.flagsWrapper) {
                AppState.elements.flagsWrapper.classList.remove('disabled');
            }

        });

    }
    const btnNext = document.getElementById('btn-next');
    if (btnNext) {
        btnNext.addEventListener('click', handleNextQuestion);
    }
    if (AppState.elements.nextBtn) {
        AppState.elements.nextBtn.addEventListener('click', handleNextBtnClick);
    }

    if (AppState.elements.btnQuiz) {
        AppState.elements.btnQuiz.addEventListener('click', handleBtnQuizClick);
    }

    COUNTRY_IDS.forEach(id => {
        const element = AppState.elements.countryMaps[id];
        if (element) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {

                // Hide result popups from previous round
                if (AppState.elements.correctAnswerPopup) {
                    AppState.elements.correctAnswerPopup.style.display = 'none';
                    const chooseFlagPopup = document.getElementById('choose-flag-popup');
                    chooseFlagPopup.style.display = 'none';
                }

                if (AppState.elements.factBitePopup) {
                    AppState.elements.factBitePopup.style.display = 'none';
                }

                // If quiz is already open (user finished quiz and clicks another country)
                if (AppState.elements.questionContainer &&
                    AppState.elements.questionContainer.style.display === 'block') {

                    if (AppState.elements.iText2) {
                        AppState.elements.iText2.style.display = 'none';
                    }

                    if (AppState.elements.btnQuiz) {
                        AppState.elements.btnQuiz.style.display = 'none';
                    }

                    if (AppState.elements.flagsWrapper) {
                        AppState.elements.flagsWrapper.classList.remove('disabled');
                    }

                    return; // ❗ stop here, don't run handleCountryClick
                }

                AppState.selectedCountry = id;
            handleCountryClick(id);
            });
        }
    });
}

/**
 * Handle the click event for the next button
 */
function handleNextBtnClick() {
    if (AppState.elements.step1 && AppState.elements.step2) {
        AppState.elements.step1.style.display = 'none';
        AppState.elements.step2.style.display = 'block';
    }
}

/**
 * Handle the click event for the Quiz button
 * Hides #i-text2 and #btn-quiz, shows #question-container,
 * and fills in the question + options from the selected country data.
 */
function handleBtnQuizClick() {
    const { iText2, btnQuiz, questionContainer, questionTxt, options } = AppState.elements;
    const data = AppState.currentCountryData;

    // Hide the info text and quiz button
    if (iText2) iText2.style.display = 'none';
    if (btnQuiz) btnQuiz.style.display = 'none';

    // Show the question container
    if (questionContainer) questionContainer.style.display = 'block';

    // Disable flags wrapper once quiz starts
    if (AppState.elements.flagsWrapper) {
        AppState.elements.flagsWrapper.classList.add('disabled');
    }

    // Populate question text
    if (questionTxt && data) {
        questionTxt.textContent = 'Q. ' + data.question;
    }

    // Populate answer options (A, B, C, D)
    if (data && data.options) {
        const labels = ['A', 'B', 'C', 'D'];
        options.forEach((li, index) => {
            if (li && data.options[index] !== undefined) {
                // Preserve the label <span> and update only the option text
                const labelSpan = li.querySelector('.label');
                if (labelSpan) {
                    labelSpan.textContent = labels[index];
                    // Set the text node after the span
                    const textNodes = [...li.childNodes].filter(n => n.nodeType === Node.TEXT_NODE);
                    if (textNodes.length > 0) {
                        textNodes[0].textContent = data.options[index];
                    } else {
                        li.appendChild(document.createTextNode(data.options[index]));
                    }
                } else {
                    li.textContent = labels[index] + ' ' + data.options[index];
                }
            }
        });
    }

    // Attach click listeners to options now that they are populated
    attachOptionListeners();
}

/**
 * Attach click listeners to the 4 option <li> elements.
 * Detects correct answer, adds .correct class, and shows popups.
 */
function attachOptionListeners() {
    const { options, correctAnswerPopup, correctAnswerBody, factBitePopup, factBiteText } = AppState.elements;

    options.forEach(li => {
        if (!li) return;
        // Clone to remove any previous listeners
        const fresh = li.cloneNode(true);
        li.parentNode.replaceChild(fresh, li);
    });

    // Re-query after clone
    AppState.elements.options = [
        document.getElementById('option-1'),
        document.getElementById('option-2'),
        document.getElementById('option-3'),
        document.getElementById('option-4')
    ];

    AppState.elements.options.forEach(li => {
        if (!li) return;
        li.addEventListener('click', () => handleOptionClick(li));
    });
}

/**
 * Handle option click: check if correct, apply .correct/.wrong class, show/hide popups.
 */
function handleOptionClick(li) {
    const data = AppState.currentCountryData;
    if (!data) return;

    // Get the chosen option text (text node after the label span)
    const labelSpan = li.querySelector('.label');
    let chosenText = '';
    if (labelSpan) {
        const textNodes = [...li.childNodes].filter(n => n.nodeType === Node.TEXT_NODE);
        chosenText = textNodes.length > 0 ? textNodes[0].textContent.trim() : li.textContent.replace(labelSpan.textContent, '').trim();
    } else {
        chosenText = li.textContent.trim();
    }

    const isCorrect = chosenText === data.correctAnswer;
    const { correctAnswerPopup, correctAnswerBody,
        factBitePopup, countryTitle, capitalTxt, funFactTxt, didYouKnowTxt,
        lottieWrapper, correctLottie, tryAgainPopup } = AppState.elements;

    if (isCorrect) {
        // Award 1 mark for correct answer ON FIRST ATTEMPT
        if (!AppState.quizAttempted) {
            AppState.score++;
            updateMarksUI();
        }
        AppState.quizAttempted = true;

        AppState.mapEnabled = true;
        // Highlight the correct option
        li.classList.add('correct');

        // Disable all options to prevent further clicks
        AppState.elements.options.forEach(opt => {
            if (opt) opt.classList.add('disabled');
        });

        // Re-enable the flags wrapper
        if (AppState.elements.flagsWrapper) {
            AppState.elements.flagsWrapper.classList.remove('disabled');
        }

        const chooseFlagPopup = document.getElementById('choose-flag-popup');
        const tickMark = document.getElementById('tick-mark');
        if (chooseFlagPopup) {
            chooseFlagPopup.style.display = 'block';
            if (tickMark) tickMark.style.display = 'block';
            
            // Set text for correct answer
            const tspan = chooseFlagPopup.querySelector('tspan');
            if (tspan) {
                tspan.textContent = 'Correct. Choose the flag';
                tspan.setAttribute('x', '1102.48');
            }
        }

        // Hide try-again popup if it was visible from a previous wrong attempt
        if (tryAgainPopup) tryAgainPopup.style.display = 'none';

        // Show correct-answer popup
        // if (correctAnswerPopup) correctAnswerPopup.style.display = 'block';
        if (correctAnswerBody) correctAnswerBody.textContent = data.funFact || '';

        // Show fact-bite popup and fill all fields
        if (factBitePopup) factBitePopup.style.display = 'block';
        if (countryTitle) countryTitle.textContent = data.country || '';
        if (capitalTxt) capitalTxt.textContent = data.capital || '';
        if (funFactTxt) funFactTxt.textContent = data.funFact || '';
        if (didYouKnowTxt) didYouKnowTxt.textContent = data.didYouKnow || '';

        // Show lottie wrapper and play correct.json animation
        if (lottieWrapper) lottieWrapper.style.display = 'block';
        if (correctLottie && typeof lottie !== 'undefined') {
            correctLottie.innerHTML = ''; // clear any previous animation
            lottie.loadAnimation({
                container: correctLottie,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: './lottie/correct.json'
            });
        }
    } else {
        // Mark quiz as attempted on first wrong answer
        AppState.quizAttempted = true;
        AppState.wrongQuizAttempts++;

        // Wrong answer — add .wrong class
        li.classList.add('wrong');

        if (AppState.wrongQuizAttempts >= 2) {
            // Immediately disable all options so no more clicks are possible
            AppState.elements.options.forEach(opt => { if (opt) opt.classList.add('disabled'); });
            // 2nd wrong attempt: show missed-it-popup for 2s, then fact-bite-popup
            const missedItPopup = document.getElementById('missed-it-popup');
            if (missedItPopup) {
                missedItPopup.style.display = 'block';
                setTimeout(() => {
                    missedItPopup.style.display = 'none';
                    // Highlight correct answer and disable all options
                    AppState.elements.options.forEach(opt => {
                        if (!opt) return;
                        opt.classList.add('disabled');
                        const labelSpan = opt.querySelector('.label');
                        let optText = '';
                        if (labelSpan) {
                            const textNodes = [...opt.childNodes].filter(n => n.nodeType === Node.TEXT_NODE);
                            optText = textNodes.length > 0 ? textNodes[0].textContent.trim() : opt.textContent.replace(labelSpan.textContent, '').trim();
                        } else {
                            optText = opt.textContent.trim();
                        }
                        if (optText === data.correctAnswer) {
                            opt.classList.add('correct');
                        }
                    });
                    // Re-enable flags wrapper and enable map so user can proceed
                    AppState.mapEnabled = true;
                    if (AppState.elements.flagsWrapper) {
                        AppState.elements.flagsWrapper.classList.remove('disabled');
                    }
                    // Now show fact-bite popup with country data
                    if (factBitePopup) {
                        if (countryTitle) countryTitle.textContent = data.country || '';
                        if (capitalTxt) capitalTxt.textContent = data.capital || '';
                        if (funFactTxt) funFactTxt.textContent = data.funFact || '';
                        if (didYouKnowTxt) didYouKnowTxt.textContent = data.didYouKnow || '';
                        factBitePopup.style.display = 'block';

                        // Also display choose-flag-popup but hide tick-mark
                        const chooseFlagPopup = document.getElementById('choose-flag-popup');
                        const tickMark = document.getElementById('tick-mark');
                        if (chooseFlagPopup) {
                            chooseFlagPopup.style.display = 'block';
                            
                            // Set text and position for wrong answer case
                            const tspan = chooseFlagPopup.querySelector('tspan');
                            if (tspan) {
                                tspan.textContent = 'Choose the flag';
                                tspan.setAttribute('x', '1152.48');
                            }
                        }
                        if (tickMark) tickMark.style.display = 'none';
                    }
                }, 3000);
            }
        } else {
            // 1st wrong attempt: show try-again popup
            if (tryAgainPopup) {
                tryAgainPopup.style.display = 'block';
                setTimeout(() => {
                    tryAgainPopup.style.display = 'none';
                }, 2000);
            }
        }
    }
}
function initLayerWrongClicks() {

    for (let i = 1; i <= 54; i++) {

        const layer = document.getElementById('layer-' + i);

        if (!layer) continue;

        layer.addEventListener('click', () => {
            if (!AppState.mapEnabled) return;


            if (AppState.mapLocked) return;

            if (!AppState.selectedCountry) return;

            const correctCountry = AppState.currentCountryData
                ? AppState.currentCountryData.country.toLowerCase().replace(/\s/g, '-')
                : null;

            // ❗ WRONG FLAG SELECTED
            if (AppState.selectedCountry !== correctCountry) {

                // count wrong attempts
                AppState.wrongMapAttempts++;

                const wrongFlagPopup = document.getElementById('wrong-flag-selected');

                if (wrongFlagPopup) {
                    wrongFlagPopup.style.display = 'block';

                    setTimeout(() => {
                        wrongFlagPopup.style.display = 'none';
                    }, 2000);
                }

                if (AppState.wrongMapAttempts >= 2) {
                    // Hide other wrong popups
                    if (wrongFlagPopup) wrongFlagPopup.style.display = 'none';
                    if (AppState.elements.tryAgainPopup) AppState.elements.tryAgainPopup.style.display = 'none';

                    const missedItPopup = document.getElementById('missed-it-popup');
                    if (missedItPopup) {
                        missedItPopup.style.display = 'block';
                        setTimeout(() => {
                            missedItPopup.style.display = 'none';
                            // Auto-place correct flag
                            document.querySelectorAll('.country-box').forEach(el => el.classList.remove('selected', 'active', 'correct'));
                            const correctFlagEl = document.getElementById(correctCountry);
                            if (correctFlagEl) correctFlagEl.classList.add('correct');
                            AppState.selectedCountry = correctCountry;
                            placeFlagOnMap(correctCountry);
                            const chooseFlagPopup = document.getElementById('choose-flag-popup');
                            if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';
                            const btnNext = document.getElementById('btn-next');
                            if (btnNext) btnNext.style.display = 'block';
                        }, 3000);
                    }
                }

                return;
            }

            // NORMAL WRONG MAP CLICK (when correct flag is selected)
            AppState.wrongMapAttempts++;

            if (AppState.elements.tryAgainPopup) {
                AppState.elements.tryAgainPopup.style.display = 'block';

                setTimeout(() => {
                    AppState.elements.tryAgainPopup.style.display = 'none';
                }, 2000);
            }

            if (AppState.wrongMapAttempts >= 2) {
                // Hide other wrong popups
                const wrongFlagPopup = document.getElementById('wrong-flag-selected');
                if (wrongFlagPopup) wrongFlagPopup.style.display = 'none';
                if (AppState.elements.tryAgainPopup) AppState.elements.tryAgainPopup.style.display = 'none';

                const missedItPopup = document.getElementById('missed-it-popup');
                if (missedItPopup) {
                    missedItPopup.style.display = 'block';
                    setTimeout(() => {
                        missedItPopup.style.display = 'none';
                        // Auto-place correct flag
                        document.querySelectorAll('.country-box').forEach(el => el.classList.remove('selected', 'active', 'correct'));
                        const correctFlagEl = document.getElementById(correctCountry);
                        if (correctFlagEl) correctFlagEl.classList.add('correct');
                        AppState.selectedCountry = correctCountry;
                        placeFlagOnMap(correctCountry);
                        const chooseFlagPopup = document.getElementById('choose-flag-popup');
                        if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';
                        const btnNext = document.getElementById('btn-next');
                        if (btnNext) btnNext.style.display = 'block';
                    }, 3000);
                }
            }

        });

    }

}

function updateMarksUI() {
    const marksEl = document.getElementById('marks');
    if (marksEl) {
        marksEl.textContent = AppState.score;
    }
}

function initDistractors() {
    ['distractor-1', 'distractor-2', 'distractor-3', 'distractor-4'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
            // Hide result popups from previous round
            if (AppState.elements.correctAnswerPopup) {
                AppState.elements.correctAnswerPopup.style.display = 'none';
                const chooseFlagPopup = document.getElementById('choose-flag-popup');
                if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';
            }

            if (AppState.elements.factBitePopup) {
                AppState.elements.factBitePopup.style.display = 'none';
            }

            // If quiz is already open (user finished quiz and clicks another country)
            if (AppState.elements.questionContainer &&
                AppState.elements.questionContainer.style.display === 'block') {

                if (AppState.elements.iText2) {
                    AppState.elements.iText2.style.display = 'none';
                }

                if (AppState.elements.btnQuiz) {
                    AppState.elements.btnQuiz.style.display = 'none';
                }

                if (AppState.elements.flagsWrapper) {
                    AppState.elements.flagsWrapper.classList.remove('disabled');
                }

                return;
            }
            AppState.selectedCountry = id;
            handleCountryClick(id);
        });
    });
}

/**
 * Initialize the widget
 */
async function init() {
    await loadData();
    initElements();

    // Update total marks display
    const totalEl = document.getElementById('total');
    if (totalEl && AppState.data && AppState.data.questions) {
        totalEl.textContent = AppState.data.questions.length * 2;
    }

    attachEventListeners();
    initCountryBoxes();
    initMapDropCheck();
    initLayerWrongClicks();
    initMapPanAndClip();
    initDistractors();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);