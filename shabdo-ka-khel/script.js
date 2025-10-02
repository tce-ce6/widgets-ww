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

// Function to select a random word and activity
function selectWordAndActivity() {
    // 1. Select a random word
    const randomIndex = Math.floor(Math.random() * wordData.length);
    currentWordObject = wordData[randomIndex];

    // 2. Select a random activity for that word
    const activityIndex = Math.floor(Math.random() * currentWordObject.Activities.length);
    currentActivity = currentWordObject.Activities[activityIndex];
}

// Function to display the selected word and activity
function updateDisplay() {
    // Get the SVG text elements and the foreignObject for the answer
    // const wordElement = document.querySelector('.svg-container text:nth-of-type(1) tspan');
    const activityElement = document.querySelector('.svg-container text:nth-of-type(2) tspan');
    const answerForeignObject = document.querySelector('.svg-container foreignObject div');
    
    // Clear the previous answer
    answerForeignObject.innerHTML = '';

    if (currentWordObject) {
        // Update the word box
        wordElement.textContent = currentWordObject.Word;
    } else {
        // Initial state before selection
        wordElement.textContent = ' ';
    }

    if (currentActivity) {
        // Update the activity box
        activityElement.textContent = currentActivity.Activity;
    } else {
        // Initial state before selection
        activityElement.textContent = '...';
    }
}

// Function to handle the 'शब्दचुनें' button click
function handleWordSelection() {
    // Reset state and select new word/activity
    selectWordAndActivity();
    updateDisplay();
    // Hide the answer when a new activity is selected
    hideAnswer();
}

// Function to handle the 'गतिविधिचुनें' button click (re-selects only activity for the same word)
function handleActivitySelection() {
    if (!currentWordObject) {
        // If no word is selected, select both
        handleWordSelection();
        return;
    }
    
    // 1. Select a new random activity for the current word
    const activities = currentWordObject.Activities;
    const activityIndex = Math.floor(Math.random() * activities.length);
    currentActivity = activities[activityIndex];
    
    // 2. Update the display and hide the answer
    updateDisplay();
    hideAnswer();
}

// Function to display the answer
function showAnswer() {
    if (!currentActivity) {
        alert("पहले 'शब्द चुनें' और 'गतिविधि चुनें' पर क्लिक करें।");
        return;
    }

    const answerForeignObject = document.querySelector('.svg-container foreignObject div');
    const answerContainer = document.createElement('div');
    answerContainer.style.color = '#BE1C1C';
    answerContainer.style.fontWeight = 'bold';
    answerContainer.style.fontSize = '35px';
    answerContainer.style.padding = '10px';
    
    // Generate the HTML for the answer, handling multiple lines/points
    const answerHTML = currentActivity.Answer.map(ans => `<p style="margin: 0; padding: 0;">${ans}</p>`).join('');
    
    answerContainer.innerHTML = `उत्तर: <br/>${answerHTML}`;
    
    answerForeignObject.innerHTML = ''; // Clear previous content
    answerForeignObject.appendChild(answerContainer);

    // Make the answer visible in the SVG foreignObject area
    // NOTE: In your HTML, the foreignObject is hidden/styled to mimic empty space. 
    // We're just injecting the text. A proper CSS solution might be needed for perfect alignment.
}

// Function to hide the answer (used when a new word/activity is selected)
function hideAnswer() {
    const answerForeignObject = document.querySelector('.svg-container foreignObject div');
    answerForeignObject.innerHTML = '';
}

// Function to reset the game
function resetGame() {
    currentWordObject = null;
    currentActivity = null;
    
    const wordElement = document.querySelector('.svg-container text:nth-of-type(1) tspan');
    const activityElement = document.querySelector('.svg-container text:nth-of-type(2) tspan');
    const answerForeignObject = document.querySelector('.svg-container foreignObject div');

    wordElement.textContent = 'जवान'; // Reset to the initial placeholder from your SVG
    activityElement.textContent = 'विलोम शब्द बताइए'; // Reset to the initial placeholder
    answerForeignObject.innerHTML = 'askdjbasjdvas'; // Reset to the initial placeholder

    // Reset the buttons' text to their initial state (or prompt the user)
    // We'll leave the button text as is for simplicity, relying on the user to click 'शब्दचुनें'.
}


// Wait for the DOM to fully load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to your SVG-based "buttons"
    
    // 1. 'शब्द चुनें' Button (inside the SVG)
    // We'll attach the listener to the whole group (path + text) for simplicity
    const shabdBtns = document.querySelectorAll('#shabd-widget path[fill="#94D8B3"]')[0].parentNode; 
    shabdBtns.addEventListener('click', handleWordSelection);
    
    // 2. 'गतिविधि चुनें' Button (inside the SVG)
    const activityBtns = document.querySelectorAll('#shabd-widget path[fill="#94D8B3"]')[1].parentNode;
    activityBtns.addEventListener('click', handleActivitySelection);
    
    // 3. 'Show Answer' Button (outside the SVG)
    const showAnswerBtn = document.getElementById('show-example-btn');
    showAnswerBtn.addEventListener('click', showAnswer);

    // 4. 'Reset' Button (outside the SVG)
    const resetBtn = document.getElementById('next-btn');
    resetBtn.addEventListener('click', resetGame);
    
    // Initial display update (to clear the SVG's default placeholder text if needed)
    updateDisplay();
});