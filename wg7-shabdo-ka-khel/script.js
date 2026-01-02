// The data set for the game (unchanged)
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
            {"Activity": "पर्यायवाची शब्द बताइए", "Answer": ["आगे, सामने"]},
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

// Global variables declaration (Initialized inside DOMContentLoaded)
let currentWordObject = null;
let currentActivity = null;
let currentWordIndex = -1; 
let isWordSelected = false;
let feedbackText = null;
let clickAudio = null;
let shuffledActivityIndices = [];

// Lottie Constants
const LOTTIE_ANIMATION_MAP = { "activities": "activities.json", "words": "words.json" };
const ANIMATION_PATH_BASE = 'assets/lottieJson/';
const ACTIVITY_TARGET_GROUP_ID = '#_980'; 
const WORD_TARGET_GROUP_ID = '#_928';     

// DOM Element references (Declared globally using 'let')
let lottieRight = null; 
let lottieLeft = null;
let rightHit = null;
let leftHit = null;
let initialText = null;
let afterText = null;
let showAnswerBtn = null; // Target for disabling/enabling
let nextBtn = null; 
let answerSvg = null;
let answerContainer = null; 
let ans1Element = null;
let ans2Element = null;

// Lottie Instances
let activitiesLottieInstance = null;
let wordsLottieInstance = null;

// Game State
let activityClickCount = 0;
const MAX_ACTIVITY_CLICKS = 3; 

// --- HELPER FUNCTION: Fisher-Yates Shuffle ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- LOTTIE CORE FUNCTIONS ---

function loadAndPauseLottie(container, key) {
    if (!container) return null;

    const fileName = LOTTIE_ANIMATION_MAP[key];
    if (!fileName) return null;
    const animationPath = ANIMATION_PATH_BASE + fileName;

    if (key === 'words' && wordsLottieInstance) {
        wordsLottieInstance.destroy();
        wordsLottieInstance = null;
    }
    if (key === 'activities' && activitiesLottieInstance) {
        activitiesLottieInstance.destroy();
        activitiesLottieInstance = null;
    }
    
    container.innerHTML = ''; 

    const lottieInstance = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false, // Ensures no auto-play
        path: animationPath
    });

    lottieInstance.addEventListener('DOMLoaded', () => {
        lottieInstance.goToAndStop(0, true); // Ensures it is paused at frame 0
    }, { once: true });

    return lottieInstance;
}

function resetLottie(instance) {
    if (instance) {
        instance.goToAndStop(0, true);
        instance.stop();
    }
}

function initDualLotties() {
    wordsLottieInstance = loadAndPauseLottie(lottieLeft, 'words');
    activitiesLottieInstance = loadAndPauseLottie(lottieRight, 'activities');

    if (leftHit) {
        leftHit.onclick = handleWordLottieClick;
    }
    if (rightHit) {
        rightHit.onclick = handleActivityLottieClick;
    }
    if (showAnswerBtn) {
        showAnswerBtn.onclick = showAnswer;
    }
}

// --- SVG INJECTION HELPER (Unchanged) ---

function injectForeignObject(lottieContainer, targetId, textContent, classId) {
    if (!lottieContainer) return;

    const svgElement = lottieContainer.querySelector('svg');
    if (!svgElement) return;

    const targetGroup = svgElement.querySelector(targetId);

    if (!targetGroup) {
        console.warn(`Target SVG group ${targetId} not found. Cannot inject foreignObject.`);
        return; 
    }

    targetGroup.innerHTML = '';

    const x = targetId === WORD_TARGET_GROUP_ID ? 10 : -50;
    const y = targetId === WORD_TARGET_GROUP_ID ? 30 : -20;
    const width = targetId === WORD_TARGET_GROUP_ID ? 470 : 1550; 

    const foreignObjectHTML = `
        <foreignObject x="${x}" y="${y}" width="${width}" height="820" font-size="50"
             font-family="Nirmala UI" letter-spacing="0em">
             <div xmlns="http://www.w3.org/1999/xhtml">
                 <div class="${classId}"><p style="margin:0;">${textContent}</p></div>
             </div>
        </foreignObject>`;

    targetGroup.innerHTML = foreignObjectHTML;
}

// --- BUTTON TOGGLE FUNCTION (NEW) ---

/**
 * Toggles the disabled state of the Show Answer button.
 * @param {boolean} disable - True to disable, false to enable.
 */
function toggleAnswerButton(disable) {
    if (showAnswerBtn) {
        showAnswerBtn.disabled = disable;
        // Optional: Add a visual cue using a class (e.g., .disabled-button in CSS)
        showAnswerBtn.classList.toggle('disabled-button', disable);
    }
}


// --- LOTTIE CLICK HANDLERS ---

function handleWordLottieClick() {
    // if (isWordSelected && activityClickCount > 0 && activityClickCount < MAX_ACTIVITY_CLICKS) {
    //    // alert("कृपया पहले इस शब्द की गतिविधियाँ पूरी करें।");
    //     feedbackText.innerHTML = "कृपया पहले इस शब्द की गतिविधियाँ पूरी करें।";

    //     return;
    // }
    setTimeout(() => {
        playClickSound();
    }, 1500);

    selectWordAndActivity();
    isWordSelected = true; 
    
    updateDisplay();
    hideAnswer();
    
    // Disable button after new word is selected (as no activity is clicked yet)
    toggleAnswerButton(true); 
    
    resetLottie(activitiesLottieInstance);
    
    if (wordsLottieInstance) {
        wordsLottieInstance.stop();
        wordsLottieInstance.play();
    }
    // setTimeout(() => {
    //     if (initialText) initialText.style.display = 'none';
    // }, 4000);
    // if (afterText) afterText.style.display = 'block';
}

function handleActivityLottieClick() {
    if (!isWordSelected) {
       // alert("कृपया पहले बाएँ बॉक्स पर क्लिक करके एक शब्द चुनें।");
       feedbackText.style.display = 'block';
        feedbackText.innerHTML = "कृपया पहले गुलाबी बॉक्स पर क्लिक करके एक शब्द चुनें।";
        return;
    }
    
    if (activityClickCount >= MAX_ACTIVITY_CLICKS) {
       // alert("तीनों गतिविधियाँ पूरी हो चुकी हैं। नया शब्द पाने के लिए शब्द बॉक्स या 'आगे बढ़ें' पर क्लिक करें।");
       feedbackText.style.display = 'block';
        feedbackText.innerHTML = "तीनों गतिविधियाँ पूरी हो चुकी हैं। नए शब्द के लिए गुलाबी बॉक्स पर टैप करें।";
        return;
    }
    
    if (activitiesLottieInstance) {
        activitiesLottieInstance.stop();
        activitiesLottieInstance.play();
    }

    activityClickCount++;

    const activities = currentWordObject.Activities;
    const activityIndex = shuffledActivityIndices[activityClickCount - 1]; 
    currentActivity = activities[activityIndex];

    // const activityIndex = activityClickCount - 1; 
    // currentActivity = activities[activityIndex];
    
    updateDisplay();
    hideAnswer();

    setTimeout(() => {
        playClickSound();
    }, 1500);
    
    // Enable button because an activity has been loaded
    setTimeout(() => {
        toggleAnswerButton(false); 
    }, 3000);

    setTimeout(() => {
        if (afterText) afterText.style.display = 'block';
    }, 4000);

    setTimeout(() => {
        if (initialText) initialText.style.display = 'none';
    }, 4000);
}

// --- GAME LOGIC FUNCTIONS ---

function selectWordAndActivity() {
    currentWordIndex = (currentWordIndex + 1) % wordData.length;
    currentWordObject = wordData[currentWordIndex];
    currentActivity = currentWordObject.Activities[0];
    activityClickCount = 0;

    shuffledActivityIndices = shuffleArray([0, 1, 2]);
}

function updateDisplay() {
    // 1. Update Word Display (LottieLeft)
    if (currentWordObject) {
        const wordText = currentWordObject.Word;
        injectForeignObject(lottieLeft, WORD_TARGET_GROUP_ID, wordText, 'word');
    } 

    // 2. Update Activity Display (LottieRight)
    if (currentActivity) {
        const activityText = currentActivity.Activity;
        injectForeignObject(lottieRight, ACTIVITY_TARGET_GROUP_ID, activityText, 'activity');
    } else {
        // When reset, set a placeholder for the activity
        injectForeignObject(lottieRight, ACTIVITY_TARGET_GROUP_ID, 'गतिविधि के लिए शब्द बॉक्स पर क्लिक करें', 'activity');
    }
}

/**
 * Plays the defined click sound. If the audio is already playing, 
 * it resets it to the start (rewinds) and plays again.
 */
function playClickSound() {
    if (clickAudio) {
        // Rewind the audio to the beginning
        clickAudio.currentTime = 0; 
        
        // Play the sound
        clickAudio.play().catch(e => {
            // Catches potential errors, such as user not interacting with the page yet, 
            // though modern browsers often allow non-muted playback after initial interaction.
            console.warn("Audio playback prevented:", e);
        });
    }
}

function showAnswer() {
    // Check if an activity is selected
    if (!currentActivity) {
        return; 
    }
    
    const isAnswerCurrentlyShown = showAnswerBtn.innerHTML === 'उत्तर हटाएँ';

    if (isAnswerCurrentlyShown) {
        // --- HIDE ANSWER LOGIC (Toggle off) ---
        if (ans1Element) ans1Element.innerHTML = '';
        if (ans2Element) ans2Element.innerHTML = '';
        if (ans2Element) ans2Element.style.display = 'none';
        if (answerContainer) answerContainer.style.display = 'none';
        if (answerSvg) answerSvg.style.display = 'none';
        
        // Change button text back to show state
        showAnswerBtn.innerHTML = 'उत्तर देखें';

    } else {
        // --- SHOW ANSWER LOGIC (Toggle on) ---
        if (!ans1Element || !ans2Element) {
            console.error("Ans1 या Ans2 पैराग्राफ तत्व DOM में नहीं मिले।");
            return;
        }
        
        // 1. Show display elements
        if (answerSvg) answerSvg.style.display = 'block';
        if (answerContainer) answerContainer.style.display = 'flex'; 

        // 2. Reset content
        ans1Element.innerHTML = '';
        ans2Element.innerHTML = '';
        ans2Element.style.display = 'none'; 
        
        const answers = currentActivity.Answer;
        
        if (answers && answers.length > 0) {
            
            // 3. Populate content
            const ans1Text = answers[0].replace(/, /g, ', ');
            ans1Element.innerHTML = `${ans1Text}`; 
            
            if (answers.length > 1) {
                const ans2Text = answers[1].replace(/, /g, ', ');
                ans2Element.innerHTML = ans2Text;
                ans2Element.style.display = 'block'; 
            }
        } else {
            ans1Element.innerHTML = '<br/>कोई उत्तर उपलब्ध नहीं है।';
        }
        
        // 4. Change button text to 'hide' state
        showAnswerBtn.innerHTML = 'उत्तर हटाएँ';
    }
}

// function showAnswer() {
//     // if (!currentActivity) {
//     //    // alert("कृपया पहले गतिविधि बॉक्स (दाएँ तरफ) पर क्लिक करें।");
//     //     feedbackText.innerHTML = "कृपया पहले गतिविधि बॉक्स (दाएँ तरफ) पर क्लिक करें।";
//     //     return;
//     // }

//     if (!ans1Element || !ans2Element) {
//         console.error("Ans1 या Ans2 पैराग्राफ तत्व DOM में नहीं मिले।");
//         return;
//     }
    
//     if (answerSvg) answerSvg.style.display = 'block';

//     // 1. Reset content and display of paragraph elements
//     ans1Element.innerHTML = '';
//     ans2Element.innerHTML = '';
//     ans2Element.style.display = 'none'; 
    
//     // 2. Ensure container is visible or set to 'flex'
//     if (answerContainer) {
//         answerContainer.style.display = 'flex'; 
//     }

//     const answers = currentActivity.Answer;
    
//     if (answers && answers.length > 0) {
        
//         showAnswerBtn.innerHTML = 'उत्तर हटाएँ';
//         // --- LOGIC: Always show the first answer in ans1, with header ---
//         const ans1Text = answers[0].replace(/, /g, ', ');
//         ans1Element.innerHTML = `<br/>${ans1Text}`;
        
//         // --- LOGIC: Show the second answer in ans2 ONLY if it exists ---
//         if (answers.length > 1) {
//             const ans2Text = answers[1].replace(/, /g, ', ');
//             ans2Element.innerHTML = ans2Text;
//             ans2Element.style.display = 'block'; 
//         }
//     } else {
//         // Fallback for no answer
//         ans1Element.innerHTML = '<br/>कोई उत्तर उपलब्ध नहीं है।';
//     }
    
//     // Disable button after the answer is shown (user should click next activity)
//    // toggleAnswerButton(true);
// }

/**
 * Function to hide the answer and disable the button.
 */
function hideAnswer() {

    if(feedbackText) feedbackText.innerHTML = '';
    // 1. Clear contents of the display paragraphs immediately
    if (ans1Element) ans1Element.innerHTML = '';
    if (ans2Element) ans2Element.innerHTML = '';
    
    // 2. Explicitly hide the secondary paragraph
    if (ans2Element) ans2Element.style.display = 'none';

    // 3. Hide the main container
    if (answerContainer) { 
        answerContainer.style.display = 'none';
    }
    
    // 4. Hide the SVG background
    if (answerSvg) answerSvg.style.display = 'none';

    // 3. Reset button inner text to default
    if (showAnswerBtn) {
        showAnswerBtn.innerHTML = 'उत्तर देखें';
    }
    
    // 5. Disable the answer button
    toggleAnswerButton(true); // <--- Ensures button is disabled when answer is hidden/cleared
}

function resetGame() {
    // 1. Reset all state variables
    isWordSelected = false; 
    activityClickCount = 0;
    currentWordObject = null;
    currentActivity = null;
    shuffledActivityIndices = [];

    // 2. Reset Display to Initial Placeholders
    injectForeignObject(lottieLeft, WORD_TARGET_GROUP_ID, 'शुरुआत करने के लिए क्लिक करें', 'word');
    injectForeignObject(lottieRight, ACTIVITY_TARGET_GROUP_ID, 'गतिविधि निष्क्रिय', 'activity');
    
    // 3. Clear and hide previous answer and disable button
    hideAnswer(); 

    // 4. Reset Lottie animations (stop at frame 0)
    resetLottie(activitiesLottieInstance);
    resetLottie(wordsLottieInstance); 
    
    // 5. Update text visibility (show initial instruction)
    if (initialText) initialText.style.display = 'block';
    if (afterText) afterText.style.display = 'none';
}


// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize all DOM Element references here
    lottieRight = document.getElementById('lottieRight'); 
    lottieLeft = document.getElementById('lottieLeft');  
    rightHit = document.getElementById('right-hit'); 
    leftHit = document.getElementById('left-hit');  
    initialText = document.getElementById('initialText');
    afterText = document.getElementById('afterText');
    showAnswerBtn = document.getElementById('showAnswer'); 
    clickAudio = new Audio('assets/Box_open.mp3');
    //nextBtn = document.getElementById('next-btn'); 
    answerSvg = document.getElementById('Group 115');
    answerContainer = document.getElementById('result-wrapper'); 
    feedbackText = document.getElementById('feedback');
    
    ans1Element = document.getElementById('ans1');
    ans2Element = document.getElementById('ans2');

    // 2. Load Lottie and Attach Primary Event Handlers
    initDualLotties();

    // 3. Attach Secondary Event Handlers
    // if (nextBtn) {
    //     nextBtn.addEventListener('click', resetGame);
    // }

    // 4. Set Initial Game State
    currentWordIndex = wordData.length - 1; 
    isWordSelected = false;

    // Set initial text placeholders and hide answer
    injectForeignObject(lottieLeft, WORD_TARGET_GROUP_ID, 'शुरुआत करने के लिए क्लिक करें', 'word');
    injectForeignObject(lottieRight, ACTIVITY_TARGET_GROUP_ID, 'गतिविधि निष्क्रिय', 'activity');
    
    // FIX FOR LOTTIE LEFT STARTING: Ensure Lottie is explicitly stopped on load
    if (wordsLottieInstance) {
        wordsLottieInstance.goToAndStop(0, true); 
        wordsLottieInstance.stop();
    }
    
    hideAnswer(); // Hides elements AND disables the button initially.
    if (initialText) initialText.style.display = 'block';
    if (afterText) afterText.style.display = 'none';
});