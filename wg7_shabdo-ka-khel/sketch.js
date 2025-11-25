// The data set for the game, based on your previous request.
const wordData = [
    {
        "Word": "दिन",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["दिवस"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["रात"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. समय", "2. वार"]}
        ]
    },
    {
        "Word": "जल",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["पानी, नीर"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["अग्नि"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. तरल", "2. जलना"]}
        ]
    },
    {
        "Word": "गुरु",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["शिक्षक, अध्यापक"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["शिष्य"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. आचार्य", "2. ग्रह"]}
        ]
    },
    {
        "Word": "वर",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["दूल्हा, पति"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["वधू"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. दूल्हा", "2. वरदान"]}
        ]
    },
    {
        "Word": "कर",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["हाथ, हस्त, बाहु"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["पाद"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. हाथ", "2. कर (tax)"]}
        ]
    },
    {
        "Word": "हार",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["पराजय"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["जीत"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. गहना", "2. पराजय"]}
        ]
    },
    {
        "Word": "बल",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["ताकत"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["निर्बल"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. शारीरिक शक्ति", "2. सेना"]}
        ]
    },
    {
        "Word": "गति",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["रफ्तार, वेग, चाल"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["अगति"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. चाल", "2. हालत"]}
        ]
    },
    {
        "Word": "तेज",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["प्रकाश, चमक"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["मंद, धीमा"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. चमक", "2. बुद्धिमान"]}
        ]
    },
    {
        "Word": "मान",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["सम्मान, इज्जत, प्रतिष्ठा"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["अपमान"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. सम्मान", "2. नाप"]}
        ]
    },
    {
        "Word": "अर्थ",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["मतलब"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["व्यर्थ"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. मतलब", "2. धन"]}
        ]
    },
    {
        "Word": "पात्र",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["बर्तन"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["अपात्र"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. बर्तन", "2. किरदार", "3. योग्य व्यक्ति"]}
        ]
    },
    {
        "Word": "अंत",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["समाप्ति, खत्म, समापन, निधन"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["आदि"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. समाप्ति", "2. मृत्यु"]}
        ]
    },
    {
        "Word": "अग्र",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["आगे, सामने, पहले"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["पश्च"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. आगे", "2. मुख्य"]}
        ]
    },
    {
        "Word": "उग्र",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["क्रोधी, गुस्सैल, हिंसक"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["सौम्य"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. क्रोधी", "2. भयंकर"]}
        ]
    },
    {
        "Word": "उत्तर",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["जवाब, समाधान"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["प्रश्न"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. जवाब", "2. उत्तर दिशा"]}
        ]
    },
    {
        "Word": "कन्या",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["लड़की, बालिका, बेटी, तनया, सुता"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["कुमार"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. लड़की", "2. कन्या राशि"]}
        ]
    },
    {
        "Word": "जवान",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["युवा, तरुण, नौजवान, यौवन"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["बूढ़ा"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. युवा", "2. सिपाही"]}
        ]
    },
    {
        "Word": "योग",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["जोड़, मेल, संयोग"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["वियोग"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. जोड़", "2. व्यायाम"]}
        ]
    },
    {
        "Word": "सरल",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["आसान, स्पष्ट, सहज"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["कठिन"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. आसान", "2. सीधा-सादा"]}
        ]
    },
    {
        "Word": "अंबर",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["आकाश, गगन, नभ, व्योम"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["अवनि"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. आकाश", "2. वस्त्र"]}
        ]
    },
    {
        "Word": "जरा",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["बुढ़ापा, वृद्धावस्था"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["यौवन"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. बुढ़ापा", "2. थोड़ा"]}
        ]
    },
    {
        "Word": "उदार",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["दानी, दयालु, दयावान"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["कंजूस"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. दानवीर", "2. व्यापक"]}
        ]
    },
    {
        "Word": "कृष्ण",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["काला, श्याम, कन्हैया, माधव"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["श्वेत"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. काला रंग", "2. भगवान कृष्ण"]}
        ]
    },
    {
        "Word": "ताल",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["लय, छंद, संगीत"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["बेताल"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. लय", "2. तालाब"]}
        ]
    },
    {
        "Word": "ज्येष्ठ",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["बड़ा, वरिष्ठ"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["कनिष्ठ"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. ज्येष्ठ महीना", "2. बड़ा"]}
        ]
    },
    {
        "Word": "दल",
        "Activities": [
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["समूह, टोली"]},
            {"Activity": "विलोम शब्द बताइए", "Answer": ["एकल"]},
            {"Activity": "शब्द के दो अलग-अलग अर्थ बताइए", "Answer": ["1. समूह", "2. पत्ता"]}
        ]
    }
];

// Global variables to store the currently selected game state
let currentWordObject = null;
let currentActivity = null;

// LOTTIE ANIMATION CONSTANTS & VARIABLES
const LOTTIE_ANIMATION_MAP = {
    "activities": "activities.json", "words": "words.json"
};
const ANIMATION_PATH_BASE = 'assets/lottieJson/';

// HTML Container references
const lottieRight = document.getElementById('lottieRight'); // Activities Lottie
const lottieLeft = document.getElementById('lottieLeft');   // Word Lottie
const initialText = document.getElementById('initialText');
const afterText = document.getElementById('afterText');
const showAnswerBtn = document.getElementById('showAnswer');
const answerSvg = document.getElementById('Group 115');

// Lottie Instances
let activitiesLottieInstance = null;
let wordsLottieInstance = null;

// GAME STATE for Activity Clicks
let activityClickCount = 0;
const MAX_ACTIVITY_CLICKS = 3; 


// SVG Elements (assuming these IDs/classes exist in your HTML SVG structure)
const wordElement = document.getElementById('wordDisplay'); // Placeholder for the actual SVG element showing the word
const activityElement = document.getElementById('activityDisplay'); // Placeholder for the actual SVG element showing the activity
const answerForeignObject = document.querySelector('.svg-container foreignObject div'); // Container for the answer

// --- LOTTIE CORE FUNCTIONS ---


/**
 * Loads a Lottie animation into a specified container.
 * @param {HTMLElement} container The DOM element for the Lottie.
 * @param {string} key The key from LOTTIE_ANIMATION_MAP ('words' or 'activities').
 * @returns {LottieInstance | null} The created Lottie instance.
 */
function loadAndPauseLottie(container, key) {
    if (!container) {
        console.error(`Lottie container for ${key} not found.`);
        return null;
    }

    const fileName = LOTTIE_ANIMATION_MAP[key];
    if (!fileName) return null;
    const animationPath = ANIMATION_PATH_BASE + fileName;

    // --- REVISED DESTRUCTION LOGIC ---
    // If the global instances exist, destroy them before reloading.
    // This is safer than relying on lottie.getAnimation(container).
    if (key === 'words' && wordsLottieInstance) {
        wordsLottieInstance.destroy();
        wordsLottieInstance = null;
    }
    if (key === 'activities' && activitiesLottieInstance) {
        activitiesLottieInstance.destroy();
        activitiesLottieInstance = null;
    }
    
    // Ensure the container is visibly clear before loading the new SVG/animation
    container.innerHTML = ''; 
    // --- END REVISED DESTRUCTION LOGIC ---

    const lottieInstance = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false, // Start paused
        path: animationPath
    });

    // Go to frame 0 immediately upon loading to show the initial state
    lottieInstance.addEventListener('DOMLoaded', () => {
        lottieInstance.goToAndStop(0, true);
    });

    return lottieInstance;
}


/**
 * Resets a Lottie instance to its initial state (Frame 0).
 * @param {LottieInstance | null} instance The Lottie instance to reset.
 */
function resetLottie(instance) {
    if (instance) {
        instance.goToAndStop(0, true);
        instance.stop();
    }
}

/**
 * Initializes both Lotties on page load and sets up click handlers.
 */
function initDualLotties() {
    wordsLottieInstance = loadAndPauseLottie(lottieLeft, 'words');
    activitiesLottieInstance = loadAndPauseLottie(lottieRight, 'activities');

    // Attach click handlers
    if (lottieLeft) {
        lottieLeft.onclick = handleWordLottieClick;
    }
    if (lottieRight) {
        lottieRight.onclick = handleActivityLottieClick;
    }
}

// --- LOTTIE CLICK HANDLERS ---

/**
 * Handles click on the LEFT Lottie (Word Lottie).
 * This should only play the Lottie animation for visual feedback.
 */
function handleWordLottieClick() {
    if (wordsLottieInstance) {
        wordsLottieInstance.stop();
        wordsLottieInstance.play();
    }
}

/**
 * Handles click on the RIGHT Lottie (Activity Lottie).
 * This cycles through the activities and ultimately shows the answer.
 */
function handleActivityLottieClick() {
    if (!currentWordObject) {
        alert("पहले 'शब्द चुनें' पर क्लिक करें।");
        return;
    }
    
    // Play the Lottie animation for visual feedback
    if (activitiesLottieInstance) {
        activitiesLottieInstance.stop();
        activitiesLottieInstance.play();
    }

    // Cycle through activities for the current word
    const activities = currentWordObject.Activities;
    
    // 1. Increment click count
    activityClickCount++;

    if (activityClickCount <= MAX_ACTIVITY_CLICKS) {
        // Select the activity corresponding to the click index (0-indexed)
        const activityIndex = (activityClickCount - 1) % activities.length;
        currentActivity = activities[activityIndex];
        
        updateDisplay();
        hideAnswer();
        
        // Show the answer if it's the final click
        if (activityClickCount === MAX_ACTIVITY_CLICKS) {
             // After playing the Lottie once, show the answer
             setTimeout(showAnswer, 500); // Small delay to let Lottie play
        }

    } else {
        // After showing the answer, subsequent clicks do nothing or prompt
        console.log("Activity cycle complete. Click 'Next' to reset.");
    }
}

// --- GAME LOGIC FUNCTIONS ---

// Function to select a random word and activity
function selectWordAndActivity() {
    // 1. Select a random word
    const randomIndex = Math.floor(Math.random() * wordData.length);
    currentWordObject = wordData[randomIndex];

    // Reset activity to the first one for the new word
    currentActivity = currentWordObject.Activities[0];
    
    // Reset click counter
    activityClickCount = 0;
}

// Function to display the selected word and activity
function updateDisplay() {
    if (currentWordObject) {
        wordElement.textContent = currentWordObject.Word;
    } else {
        wordElement.textContent = '...';
    }

    if (currentActivity) {
        activityElement.textContent = currentActivity.Activity;
    } else {
        activityElement.textContent = '...';
    }
}

// Function to handle the 'शब्दचुनें' button click
function handleWordSelection() {
    selectWordAndActivity();
    updateDisplay();
    hideAnswer();
    
    // Reset the Activities Lottie to initial state
    resetLottie(activitiesLottieInstance);
    // You might want to play the Words Lottie here for selection feedback
    handleWordLottieClick();
    
    // Hide the initial instruction text and show the after text
    initialText.style.display = 'none';
    afterText.style.display = 'block';
}

/**
 * Loads the 'words' Lottie, waits for its DOM to load, and injects the new word 
 * into the text element with ID 'word'.
 * * NOTE: The SVG text element ID must be exactly 'word'.
 * @param {string} wordToDisplay The Hindi word to be displayed inside the Lottie SVG.
 */
function loadAndSetWordLottie(wordToDisplay) {
    if (!lottieLeft) {
        console.error("Lottie container 'lottieLeft' not found.");
        return;
    }

    // 1. Destroy and Load the Lottie (using the existing helper function)
    wordsLottieInstance = loadAndPauseLottie(lottieLeft, 'words');

    if (wordsLottieInstance) {
        // 2. Wait for the SVG content to be ready
        wordsLottieInstance.addEventListener('DOMLoaded', () => {
            // Lottie renders its content (SVG) inside the container.
            // We search for the specific text element within the container.

            // The 'word' ID might be inside a <text> element or a <tspan>.
            // We target the element with the ID 'word' which Lottie will create.
            // The actual ID in your example is "à¤œà¤µà¤¾à¤¨", so we use the fixed 'word' ID here,
            // assuming you will adjust the Lottie file's text layer name to 'word'.
            const wordTextElement = document.getElementById('word');
            
            if (wordTextElement) {
                // To replace all text correctly, we often clear existing tspans and add a new one.
                wordTextElement.innerHTML = '';
                
                // Create a new tspan element to hold the text
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan.textContent = wordToDisplay;
                
                // Apply desired styling/positioning (based on your Lottie's setup)
                // You may need to manually adjust x/y coordinates here if the text alignment breaks.
                // Example positioning:
                tspan.setAttribute('x', '50%'); // Center horizontally
                tspan.setAttribute('dy', '0.5em'); // Center vertically relative to the baseline

                // Append the new text
                wordTextElement.appendChild(tspan);
                
                console.log(`Lottie text updated to: ${wordToDisplay}`);
                
            } else {
                console.warn(`Text element with ID 'word' not found in the Lottie SVG. Cannot inject word.`);
                // Fallback: Just update the display element outside the Lottie if needed.
            }
            
            // Ensure it starts at frame 0
            wordsLottieInstance.goToAndStop(0, true);
        }, { once: true }); // Use { once: true } to remove the listener after execution
    }
}

// Function to handle the 'शब्दचुनें' button click
function handleWordSelection() {
    // 1. Reset state and select new word/activity
    selectWordAndActivity();
    
    // 2. Update the display elements (outside the Lottie)
    updateDisplay();
    hideAnswer();
    
    // 3. Load the Lottie and INJECT THE NEW WORD
    if (currentWordObject && currentWordObject.Word) {
        loadAndSetWordLottie(currentWordObject.Word);
    }
    
    // 4. Reset the Activities Lottie
    resetLottie(activitiesLottieInstance);
    
    // Hide the initial instruction text and show the after text
    initialText.style.display = 'none';
    afterText.style.display = 'block';
    
    // Optional: Play the Words Lottie to show the new word appearing
    handleWordLottieClick();
}

// Function to display the answer
function showAnswer() {
    if (!currentActivity) return;

    // Show the HTML answer div
    showAnswer.addEventListener('click', () => {
        answerSvg.style.display = 'block';
    })
    const answerContainer = document.getElementById('answer-container'); // Assuming a container div for the answer
    
    // Clear previous content and fill with the answer
    let answerHTML = currentActivity.Answer.map(ans => `<p style="margin: 0; padding: 0;">${ans}</p>`).join('');
    
    // Assuming 'answer-container' is the div you want to show/fill
    if (answerContainer) {
        answerContainer.innerHTML = `उत्तर: <br/>${answerHTML}`;
        answerContainer.style.display = 'block'; // Or however you show it
    }
}

// Function to hide the answer (used when a new word/activity is selected)
function hideAnswer() {
    const answerContainer = document.getElementById('answer-container');
    if (answerContainer) {
        answerContainer.innerHTML = '';
        answerContainer.style.display = 'none';
    }
    // Also reset the SVG text container to empty/placeholder
    answerForeignObject.innerHTML = '';
}

// Function to reset the game
function resetGame() {
    currentWordObject = null;
    currentActivity = null;
    activityClickCount = 0;

    // Reset Lotties to initial state
    resetLottie(activitiesLottieInstance);
    resetLottie(wordsLottieInstance);

    // Reset display elements to placeholders
    wordElement.textContent = '...'; 
    activityElement.textContent = '...';
    hideAnswer(); // Hide the answer div
    
    // Show initial instruction text
    initialText.style.display = 'block';
    afterText.style.display = 'none';
    
    updateDisplay();
}


// Wait for the DOM to fully load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize both Lotties and their click listeners
    initDualLotties();

    // 4. 'Reset' Button (HTML)
    const resetBtn = document.getElementById('next-btn');
    resetBtn.addEventListener('click', resetGame);

    answerSvg.style.display = 'none';
    
    // Initial setup
    handleWordSelection();
    hideAnswer();
    resetGame(); // Start in a clean state
});