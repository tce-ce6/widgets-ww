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
    mapEnabled: false,
    flagsLocked: false
};

const COUNTRY_IDS = [
    'bulgaria', 'serbia', 'croatia', 'north-macedonia', 'kosovo',
    'bosnia-and-herzegovina', 'greece', 'montenegro', 'albania', 'slovenia'
];

const DEBUG_FLAGS = (() => {
    try {
        return typeof window !== 'undefined' &&
            new URLSearchParams(window.location.search).has('debugFlags');
    } catch {
        return false;
    }
})();

function debugFlagsLog(message, extra = {}) {
    if (!DEBUG_FLAGS) return;
    try {
        const el = AppState?.elements?.flagsWrapper || document.getElementById('flags-wrapper');
        const computed = el ? window.getComputedStyle(el) : null;
        console.log('[flags]', message, {
            flagsLocked: AppState?.flagsLocked,
            mapLocked: AppState?.mapLocked,
            mapEnabled: AppState?.mapEnabled,
            wrapperClass: el?.getAttribute?.('class'),
            stylePointerEvents: el?.style?.pointerEvents,
            styleOpacity: el?.style?.opacity,
            computedPointerEvents: computed?.pointerEvents,
            computedOpacity: computed?.opacity,
            ...extra
        });
    } catch (e) {
        console.log('[flags]', message, extra, e);
    }
}

function setFlagsEnabled(enabled) {
    const el = AppState.elements.flagsWrapper;
    if (!el) return;

    if (enabled) {
        el.classList.remove('disabled');
        // Ensure SVG reflects class changes reliably.
        el.setAttribute('class', 'flags-wrapper');
        el.style.pointerEvents = 'auto';
        el.style.opacity = '1';
        debugFlagsLog('setFlagsEnabled(true)');
        return;
    }

    el.classList.add('disabled');
    // Ensure SVG reflects class changes reliably.
    el.setAttribute('class', 'flags-wrapper disabled');
    el.style.pointerEvents = 'none';
    el.style.opacity = '0.55';
    debugFlagsLog('setFlagsEnabled(false)');
}

function lockFlags() {
    AppState.flagsLocked = true;
    setFlagsEnabled(false);
    debugFlagsLog('lockFlags()');
}

function unlockFlags() {
    AppState.flagsLocked = false;
    setFlagsEnabled(true);
    debugFlagsLog('unlockFlags()');
}

function initCountryBoxes() {
    COUNTRY_IDS.forEach(id => {
        const box = document.getElementById(id);

        if (!box) return;

        box.addEventListener('click', () => {
            if (AppState.flagsLocked) return;

            // Lock flags immediately after a flag is selected.
            // They are re-enabled after map feedback is shown.
            if (!AppState.mapLocked) lockFlags();

            // store selected country
            AppState.selectedCountry = id;
            handleCountryClick(id);

            // highlight selected box
            COUNTRY_IDS.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('selected', 'active', 'correct');
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
            if (!AppState.mapEnabled || AppState.mapLocked || !AppState.selectedCountry) return;

            const scenarioTarget = AppState.currentCountryData
                ? AppState.currentCountryData.country.toLowerCase().replace(/\s/g, '-')
                : null;

            const wrongFlagPopup = document.getElementById('wrong-flag-selected');
            const tryAgainPopup = AppState.elements.tryAgainPopup;

            // 1. CHECK IF USER HAS THE CORRECT FLAG SELECTED FOR THIS SCENARIO
            if (AppState.selectedCountry !== scenarioTarget) {
                if (wrongFlagPopup) {
                    wrongFlagPopup.style.display = 'block';
                    unlockFlags();
                    setTimeout(() => { wrongFlagPopup.style.display = 'none'; }, 2000);
                }
                AppState.wrongMapAttempts++;
            }
            // 2. CHECK IF USER CLICKED THE CORRECT MAP PART FOR THEIR SELECTED FLAG
            else if (id !== AppState.selectedCountry) {
                if (tryAgainPopup) {
                    tryAgainPopup.style.display = 'block';
                    unlockFlags();
                    setTimeout(() => { tryAgainPopup.style.display = 'none'; }, 2000);
                }
                AppState.wrongMapAttempts++;
            }
            // 3. CORRECT MATCH
            else {
                const { correctAnswerPopup, lottieWrapper, correctLottie } = AppState.elements;
                if (correctAnswerPopup) {
                    correctAnswerPopup.style.display = 'block';
                    unlockFlags();
                    setTimeout(() => { correctAnswerPopup.style.display = 'none'; }, 2000);
                }
                if (lottieWrapper) lottieWrapper.style.display = 'block';
                if (correctLottie && typeof lottie !== 'undefined') {
                    correctLottie.innerHTML = '';
                    lottie.loadAnimation({
                        container: correctLottie,
                        renderer: 'svg',
                        loop: false,
                        autoplay: true,
                        path: './lottie/correct.json'
                    });
                }

                if (AppState.wrongMapAttempts === 0) {
                    AppState.score++;
                    updateMarksUI();
                }

                const btnNext = document.getElementById('btn-next');
                if (btnNext) btnNext.style.display = 'block';
                const chooseFlagPopup = document.getElementById('choose-flag-popup');
                if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';

                placeFlagOnMap(id);
                return; // Success
            }

            // AUTO-ADVANCE ON 2ND FAILURE
            if (AppState.wrongMapAttempts >= 2) {
                AppState.mapLocked = true;
                const missedItPopup = document.getElementById('missed-it-popup');
                if (missedItPopup) {
                    missedItPopup.style.display = 'block';
                    setTimeout(() => {
                        missedItPopup.style.display = 'none';
                        // Auto-place correct flag
                        COUNTRY_IDS.forEach(cId => {
                            const el = document.getElementById(cId);
                            if (el) el.classList.remove('selected', 'active', 'correct');
                        });
                        const correctFlagEl = document.getElementById(scenarioTarget);
                        if (correctFlagEl) correctFlagEl.classList.add('correct');
                        AppState.selectedCountry = scenarioTarget;
                        placeFlagOnMap(scenarioTarget);
                        
                        const chooseFlagPopup = document.getElementById('choose-flag-popup');
                        if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';
                        const btnNext = document.getElementById('btn-next');
                        if (btnNext) btnNext.style.display = 'block';
                    }, 2000);
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
    AppState.flagsLocked = false;
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
    const flagParent = document.getElementById('en_geo_7_wg155_layout 1');
    COUNTRY_IDS.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('selected', 'active', 'correct');
    });

    COUNTRY_IDS.forEach(id => {
        const countryMapEl = document.getElementById(id);
        if (countryMapEl) countryMapEl.classList.remove('selected', 'correct');

        const flag = document.getElementById(id + '-flag');
        if (flag) {
            flag.style.display = 'none';
            flag.setAttribute('transform', 'translate(0, 0)');
            // Move flag back to its original parent if it was moved to a map group
            if (flagParent && flag.parentNode !== flagParent) {
                flagParent.appendChild(flag);
            }
        }
    });

    // 6. Enable flags-wrapper for the next turn
    if (AppState.elements.flagsWrapper) {
        unlockFlags();
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
        lockFlags();

        // Hide all flags from map
        COUNTRY_IDS.forEach(id => {
            const flag = document.getElementById(id + '-flag');
            if (flag) flag.style.display = 'none';
        });

        // End state: no replay button
        // Reset button removed

        // Hide Next button
        const btnNextFull = document.getElementById('btn-next');
        if (btnNextFull) btnNextFull.style.display = 'none';
        
        return;
    }

    const data = questions[AppState.currentQuestionIndex];

    // reset step-2 UI
    resetStepTwo();
    // restore the current question after reset clears state
    AppState.currentCountryData = data;
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
    if (AppState.elements.flagsWrapper) {
        const blockIfLocked = (e) => {
            if (!AppState.flagsLocked) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        };
        // Capture-phase block ensures no child listeners fire while locked.
        AppState.elements.flagsWrapper.addEventListener('click', blockIfLocked, true);
        AppState.elements.flagsWrapper.addEventListener('pointerdown', blockIfLocked, true);
        AppState.elements.flagsWrapper.addEventListener('touchstart', blockIfLocked, true);
    }
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

    // Only show quiz buttons if the map phase for this question hasn't started
    const isQuizShown = AppState.elements.questionContainer && AppState.elements.questionContainer.style.display === 'block';

    if (!AppState.mapEnabled && !AppState.mapLocked && !isQuizShown) {
        if (AppState.elements.iText2) {
            AppState.elements.iText2.style.display = 'block';
        }
        if (AppState.elements.btnQuiz) {
            AppState.elements.btnQuiz.style.display = 'block';
        }
        
        // Disable flags after selection (quiz hasn't started yet)
        lockFlags();
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

    // 5. Hide end-game buttons and return to home screen
    if (AppState.elements.step1) AppState.elements.step1.style.display = 'block';
    if (AppState.elements.step2) AppState.elements.step2.style.display = 'none';

    // Reset button removed

    // Replay button removed
    
    const btnNext = document.getElementById('btn-next');
    if (btnNext) btnNext.style.display = 'none';

    // 6. Reset markings in case they were modified
    const marksContainer = document.querySelector('.marks-container');
    if (marksContainer) marksContainer.style.display = 'block';
}

/**
 * Attach event listeners to elements
 */
function attachEventListeners() {
    // Reset button removed

    // Replay button removed
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

                    COUNTRY_IDS.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('selected', 'active', 'correct');
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
            COUNTRY_IDS.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('selected', 'active', 'correct');
            });

            // Re-enable flags wrapper so a new selection can be made
            if (AppState.elements.flagsWrapper) {
                unlockFlags();
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
                if (AppState.flagsLocked) return;
                if (!AppState.mapLocked) lockFlags();

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
                        unlockFlags();
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

    // Note: do not lock flags on Quiz click.
    // Flags are locked when a flag is selected for the map phase.

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

        // Quiz is done; allow user to choose ONE flag for the map.
        unlockFlags();

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
                    unlockFlags();
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
                unlockFlags();
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
            if (!AppState.mapEnabled || AppState.mapLocked || !AppState.selectedCountry) return;

            const scenarioTarget = AppState.currentCountryData
                ? AppState.currentCountryData.country.toLowerCase().replace(/\s/g, '-')
                : null;

            const wrongFlagPopup = document.getElementById('wrong-flag-selected');

            // 1. CHECK IF USER HAS THE CORRECT FLAG SELECTED FOR THIS SCENARIO
            if (AppState.selectedCountry !== scenarioTarget) {
                if (wrongFlagPopup) {
                    wrongFlagPopup.style.display = 'block';
                    unlockFlags();
                    setTimeout(() => { wrongFlagPopup.style.display = 'none'; }, 2000);
                }
                AppState.wrongMapAttempts++;
            }
            // 2. USER CLICKED A DISTRACTOR LAYER (Wrong map part for their selected flag)
            else {
                const tryAgainPopup = AppState.elements.tryAgainPopup;
                if (tryAgainPopup) {
                    tryAgainPopup.style.display = 'block';
                    unlockFlags();
                    setTimeout(() => { tryAgainPopup.style.display = 'none'; }, 2000);
                }
                AppState.wrongMapAttempts++;
            }

            // AUTO-ADVANCE ON 2ND FAILURE
            if (AppState.wrongMapAttempts >= 2) {
                AppState.mapLocked = true;
                const missedItPopup = document.getElementById('missed-it-popup');
                if (missedItPopup) {
                    missedItPopup.style.display = 'block';
                    setTimeout(() => {
                        missedItPopup.style.display = 'none';
                        // Auto-place correct flag
                        COUNTRY_IDS.forEach(cId => {
                            const el = document.getElementById(cId);
                            if (el) el.classList.remove('selected', 'active', 'correct');
                        });
                        const correctFlagEl = document.getElementById(scenarioTarget);
                        if (correctFlagEl) correctFlagEl.classList.add('correct');
                        AppState.selectedCountry = scenarioTarget;
                        placeFlagOnMap(scenarioTarget);
                        
                        const chooseFlagPopup = document.getElementById('choose-flag-popup');
                        if (chooseFlagPopup) chooseFlagPopup.style.display = 'none';
                        const btnNext = document.getElementById('btn-next');
                        if (btnNext) btnNext.style.display = 'block';
                    }, 2000);
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
                    unlockFlags();
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

    // Initialize the first question from the shuffled list.
    if (AppState.data && AppState.data.questions && AppState.data.questions.length > 0) {
        AppState.currentQuestionIndex = 0;
        AppState.currentCountryData = AppState.data.questions[0];
    }

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
// Debug mode
window.debugNavigate = async function(runs = 1) {
    console.log("%c==============================", "color: green; font-weight: bold;");
    console.log("%c[DEBUG] Starting Auto Navigation Method", "color: green; font-weight: bold;");
    console.log("%c==============================", "color: green; font-weight: bold;");
    
    function simulateClick(el, label) {
        if (!el) {
            console.warn(`[DEBUG] Target ${label} missing.`);
            return false;
        }
        console.log(`%c[DEBUG] ➔ Clicking ${label}`, 'color: cyan');
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return true;
    }

    for (let currentRun = 1; currentRun <= runs; currentRun++) {
        console.log(`\n%c[DEBUG] --- Starting Run ${currentRun}/${runs} ---`, "color: magenta; font-weight: bold;");
        
        let introNextBtn = document.getElementById('next-btn');
        if (introNextBtn && introNextBtn.style.display !== 'none') {
            simulateClick(introNextBtn, "Intro Next Button");
            await new Promise(r => setTimeout(r, 600));
        }

        if (AppState.currentQuestionIndex >= AppState.data.questions.length) {
            console.log("[DEBUG] Game already finished -> Clicking Replay");
            console.log("[DEBUG] Game already finished -> Replay button removed; aborting.");
            return;
            await new Promise(r => setTimeout(r, 1000));
        }

        while (AppState.currentQuestionIndex < AppState.data.questions.length) {
            let qIndex = AppState.currentQuestionIndex;
            let qs = AppState.data.questions[qIndex];
            let countryId = qs.country.toLowerCase().replace(/\s/g, '-');
            
            console.log(`%c[DEBUG] --- Scenario ${qIndex + 1}/${AppState.data.questions.length} | Target: ${qs.country} ---`, "color: #ff9900; font-weight: bold;");
            
            // 1. Click Flag Box
            let box = document.getElementById(countryId);
            if (!simulateClick(box, `Flag Box (${countryId})`)) break;
            await new Promise(r => setTimeout(r, 200));
            
            // 2. Click Quiz
            let btnQuiz = document.getElementById('btn-quiz');
            if (!simulateClick(btnQuiz, 'btn-quiz')) break;
            await new Promise(r => setTimeout(r, 200));
            
            // 3. Option
            let optionFound = false;
            AppState.elements.options.forEach((li, i) => {
                if(!li) return;
                const labelSpan = li.querySelector('.label');
                let text = labelSpan ? [...li.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim() : li.textContent.trim();
                if(!text) text = li.textContent.replace(labelSpan?.textContent || '', '').trim();
                
                if (text === qs.correctAnswer) {
                    simulateClick(li, `Option (${text})`);
                    optionFound = true;
                }
            });
            if (!optionFound) {
                console.warn("[DEBUG] Could not find correct option!");
                break; 
            }
            await new Promise(r => setTimeout(r, 600)); // wait for lottie
            
            // 4. Click Map
            let mapCountry = document.getElementById(countryId + '-map');
            if (!simulateClick(mapCountry, `Map (${countryId}-map)`)) break;
            await new Promise(r => setTimeout(r, 600));
            
            // 5. Click Next 
            let btnNext = document.getElementById('btn-next');
            if (btnNext && btnNext.style.display !== 'none') {
                simulateClick(btnNext, 'btn-next');
            } else if (AppState.currentQuestionIndex >= AppState.data.questions.length - 1) {
                console.log("%c[DEBUG] Navigation Complete! Final Scenario Reached.", "color: green; font-weight: bold;");
                AppState.currentQuestionIndex++; // advance to trigger endgame manually if Next didn't do it
            } else {
                console.warn("[DEBUG] btn-next missing. Stuck?");
                break;
            }
            await new Promise(r => setTimeout(r, 200));
        }
        
        console.log(`%c[DEBUG] Run ${currentRun} State:`, "color: yellow", { score: AppState.score, index: AppState.currentQuestionIndex });
        
        // Short pause between runs
        if (currentRun < runs) {
             await new Promise(r => setTimeout(r, 1000));
        }
    }
    console.log("%c[DEBUG] Final State:", "color: yellow", { ...AppState });
};
