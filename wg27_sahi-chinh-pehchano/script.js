// --- Data Set ---
const hindiSentences = [
    { "sentence": "शाबाश__ तुमने बहुत अच्छा खेला__", "answer": "शाबाश! तुमने बहुत अच्छा खेला।" },
    { "sentence": "वाह__ क्या सुंदर चित्र बनाया है तुमने__", "answer": "वाह! क्या सुंदर चित्र बनाया है तुमने।" },
    { "sentence": "माँ ने कहा__ __बेटा __ अपना कमरा साफ़ करो__ __", "answer": "माँ ने कहा, \"बेटा, अपना कमरा साफ़ करो।\"" },
    { "sentence": "हमारे देश में कई भाषाएँ बोली जाती हैं__ जैसे हिंदी__ तमिल__ बंगाली आदि__", "answer": "हमारे देश में कई भाषाएँ बोली जाती हैं; जैसे हिंदी, तमिल, बंगाली आदि।" },
    { "sentence": "अरे__ यह क्या हो गया__ सब कुछ बिखर गया है__", "answer": "अरे! यह क्या हो गया? सब कुछ बिखर गया है।" },
    { "sentence": "मोहन पढ़ने में तेज़ है__परंतु खेल में कमज़ोर है__", "answer": "मोहन पढ़ने में तेज़ है, परंतु खेल में कमज़ोर है।" },
    { "sentence": "तुम घर जाओगे__ या यहीं रुकोगे__", "answer": "तुम घर जाओगे, या यहीं रुकोगे?" },
    { "sentence": "शिक्षक जी ने पूछा__ __तुमने अपना काम पूरा किया है__ __", "answer": "शिक्षक जी ने पूछा, \"तुमने अपना काम पूरा किया है?\"" },
    { "sentence": "सीता__ गीता और रीता सभी स्कूल जा रही हैं__", "answer": "सीता, गीता और रीता सभी स्कूल जा रही हैं।" },
    { "sentence": "रमेश बहुत अच्छा लड़का है__ वह सबकी मदद करता है__", "answer": "रमेश बहुत अच्छा लड़का है; वह सबकी मदद करता है." },
    { "sentence": "उसने कहा__ __मैं कल दिल्ली जाऊँगा__ __", "answer": "उसने कहा, \"मैं कल दिल्ली जाऊँगा।\"" },
    { "sentence": "डॉक्टर साहब__ क्या मेरी माँ ठीक हो जाएगी__", "answer": "डॉक्टर साहब, क्या मेरी माँ ठीक हो जाएगी?" },
    { "sentence": "भारत एक महान देश है__ यहाँ अनेक धर्मों के लोग रहते हैं__", "answer": "भारत एक महान देश है; यहाँ अनेक धर्मों के लोग रहते हैं।" },
    { "sentence": "अरे वाह__ कितना स्वादिष्ट खाना बनाया है__", "answer": "अरे वाह! कितना स्वादिष्ट खाना बनाया है।" },
    { "sentence": "राजू__ तुम कब आए__ मुझे पता ही नहीं चला__", "answer": "राजू, तुम कब आए? मुझे पता ही नहीं चला।" },
    { "sentence": "गुरुजी ने समझाया__ __पढ़ाई में मन लगाना जरूरी है__ __", "answer": "गुरु जी ने समझाया, \"पढ़ाई में मन लगाना जरूरी है।\"" },
    { "sentence": "छी छी__ कितनी गंदगी फैली हुई है__", "answer": "छी छी! कितनी गंदगी फैली हुई है।" },
    { "sentence": "सुनीता बहुत सुंदर गाती है__ वह एक अच्छी नर्तकी भी है__", "answer": "सुनीता बहुत सुंदर गाती है; वह एक अच्छी नर्तकी भी है।" },
    { "sentence": "अरे भाई__ तुम यहाँ क्या कर रहे हो__", "answer": "अरे भाई! तुम यहाँ क्या कर रहे हो?" },
    { "sentence": "पिता जी ने कहा__ __बेटे__ मेहनत करोगे तो सफल होगे____", "answer": "पिता जी ने कहा, \"बेटे, मेहनत करोगे तो सफल होगे।\"" },
    { "sentence": "इस साल बारिश कम हुई है__किसान परेशान हैं__", "answer": "इस साल बारिश कम हुई है; किसान परेशान हैं।" },
    { "sentence": "तुम्हें क्या लगता है__ मैं परीक्षा में पास हो जाऊँगा__", "answer": "तुम्हें क्या लगता है, मैं परीक्षा में पास हो जाऊँगा?" },
    { "sentence": "बाप रे__ कितनी तेज़ बारिश हो रही है__", "answer": "बाप रे! कितनी तेज़ बारिश हो रही है।" },
    { "sentence": "अध्यापक ने पूछा__ __तुमने होमवर्क किया है या नहीं__ __", "answer": "अध्यापक ने पूछा, \"तुमने होमवर्क किया है या नहीं?\"" },
    { "sentence": "पर्यावरण की रक्षा करना हमारी जिम्मेदारी है__वरना पृथ्वी का भविष्य खतरे में है__", "answer": "पर्यावरण की रक्षा करना हमारी जिम्मेदारी है; वरना पृथ्वी का भविष्य खतरे में है।" },
    { "sentence": "क्या बात है__ आज तुम बहुत खुश लग रहे हो__", "answer": "क्या बात है! आज तुम बहुत खुश लग रहे हो।" },
    { "sentence": "नानी जी ने कहा__ __पहले के ज़माने में बच्चे बहुत मेहनती होते थे__ __", "answer": "नानी जी ने कहा, \"पहले के ज़माने में बच्चे बहुत मेहनती होते थे।\"" },
    { "sentence": "अहा__ कितना सुंदर नज़ारा है पहाड़ों का__", "answer": "अहा! कितना सुंदर नज़ारा है पहाड़ों का।" },
    { "sentence": "हे भगवान__ यह क्या हो गया__ सब कुछ तो बर्बाद हो गया__", "answer": "हे भगवान! यह क्या हो गया? सब कुछ तो बर्बाद हो गया।" },
    { "sentence": "रीता ने कहा__ __मैं कल तुम्हारे घर आऊँगी__ __", "answer": "रीता ने कहा, \"मैं कल तुम्हारे घर आऊँगी।\"" },
    { "sentence": "क्या आपको पता है__ आज कौन सा दिन है__", "answer": "क्या आपको पता है, आज कौन सा दिन है?" },
    { "sentence": "पेड़ हमें ऑक्सीजन देते हैं__ हमें उनकी रक्षा करनी चाहिए__", "answer": "पेड़ हमें ऑक्सीजन देते हैं; हमें उनकी रक्षा करनी चाहिए।" },
    { "sentence": "अरे वाह__ कितनी मिठास है इस आम में__", "answer": "अरे वाह! कितनी मिठास है इस आम में।" },
    { "sentence": "गाँधी जी ने कहा__ __सत्य और अहिंसा से सब कुछ संभव है__ __", "answer": "गाँधी जी ने कहा, \"सत्य और अहिंसा से सब कुछ संभव है।\"" },
    { "sentence": "उफ़__ कितनी गर्मी है__ आज तो जान निकल रही है__", "answer": "उफ़! कितनी गर्मी है। आज तो जान निकल रही है।" },
    { "sentence": "शाबाश__ तुमने बहुत अच्छा काम किया है__", "answer": "शाबाश! तुमने बहुत अच्छा काम किया है।" },
    { "sentence": "तुम्हें क्या लगता है__ मौसम कैसा रहेगा आज__", "answer": "तुम्हें क्या लगता है, मौसम कैसा रहेगा आज?" },
    { "sentence": "हाय राम__ यह तो बड़ी मुश्किल में फँस गया__", "answer": "हाय राम! यह तो बड़ी मुश्किल में फँस गया।" },
    { "sentence": "बच्चे खुशी__खुशी स्कूल से घर लौट रहे थे__", "answer": "बच्चे खुशी-खुशी स्कूल से घर लौट रहे थे।" },
    { "sentence": "पढ़ना__लिखना हर बच्चे का अधिकार है__", "answer": "पढ़ना-लिखना हर बच्चे का अधिकार है।" }
];


// ===================================================================
// 1. SEQUENTIAL INDEX TRACKING (MODIFIED/NEW CODE)
// ===================================================================

// Global variable to track the current index. Start at -1 so the first call yields 0.
let currentSentenceIndex = -1; 
let currentIndex = 0; // Kept to track the currently loaded sentence index
let selectedBlank = null;

/**
 * Generates the next index in a sequential order, wrapping around to 0
 * after the last sentence is reached.
 * @returns {number} The next index.
 */
function getNextIndex() {
    if (!hindiSentences || hindiSentences.length === 0) {
        return -1;
    }
    
    // Increment the index
    currentSentenceIndex++;
    
    // Wrap-around logic
    if (currentSentenceIndex >= hindiSentences.length) {
        currentSentenceIndex = 0;
    }
    
    return currentSentenceIndex;
}

// REMOVED: function selectRandomIndex() is deleted.

// Get the SVG text elements
const sentenceContainer = document.getElementById('sentence-container'); 
const sentenceText = document.getElementById('sentence-text');
const feedback = document.getElementById('feedback'); // Assuming you have an element for feedback

/**
 * Loads a sentence into the container, replacing '__' with clickable blanks.
 * @param {number} index - The index of the sentence to load.
 */
function loadSentence(index) {
    console.log("Loading sentence at index:", index);
    currentIndex = index;
    const data = hindiSentences[currentIndex];
    
    // Check if the SVG text element exists
    if (!sentenceText) {
        console.error("SVG text element with ID 'sentence-text' not found.");
        return;
    }
    
    // Determine expected punctuation for each blank by aligning sentence and answer text
    const sentence = data.sentence;
    const answerText = data.answer;
    const blankExpectations = [];
    const punctChars = new Set(['।', '?', '!', ',', ';', '"', '-']);
    const whitespaceChars = new Set([' ', '\u00A0']);

    let sentencePos = 0;
    let answerPos = 0;

    while (sentencePos < sentence.length) {
        if (sentence.substring(sentencePos, sentencePos + 2) === '__') {
            let expectedPunct = '';

            while (answerPos < answerText.length) {
                const ansChar = answerText[answerPos];
                if (punctChars.has(ansChar)) {
                    expectedPunct = ansChar;
                    answerPos++;
                    break;
                }
                answerPos++;
            }

            blankExpectations.push(expectedPunct);
            sentencePos += 2; // skip '__'
        } else {
            const sentChar = sentence[sentencePos];

            if (whitespaceChars.has(sentChar)) {
                sentencePos++;
                continue;
            }

            if (answerPos < answerText.length) {
                const ansChar = answerText[answerPos];

                if (sentChar === ansChar) {
                    sentencePos++;
                    answerPos++;
                } else if (whitespaceChars.has(ansChar) || punctChars.has(ansChar)) {
                    answerPos++;
                } else {
                    sentencePos++;
                }
            } else {
                sentencePos++;
            }
        }
    }
    
    // Create the HTML content with clickable blanks
    let blankCounter = 0;
    let htmlContent = data.sentence.replace(/__/g, () => {
        const blankId = blankCounter++;
        return `<span class="blank" data-index="${blankId}" onclick="selectBlank(this)">__</span>`;
    });

    sentenceText.innerHTML = htmlContent;

    const blankElements = sentenceText.querySelectorAll('.blank');
    blankElements.forEach((blank, idx) => {
        blank.dataset.expected = blankExpectations[idx] || '';
    });
    console.log("Loaded sentence:", data.sentence);

    if (feedback) {
        feedback.textContent = '';
    }
    selectedBlank = null;
}


/**
 * Highlights the selected blank or clears it if it's already filled.
 * @param {HTMLElement} span - The blank element that was clicked.
 */
function selectBlank(span) {
    
    // --- New Logic: FREEZE CHECK ---
    if (span.classList.contains('frozen')) {
        // if (feedback) {
        //     feedback.textContent = 'यह उत्तर पहले ही सही भरा जा चुका है।';
        // }
        return; // Prevent interaction with correct/frozen blanks
    }

    // New Logic: If the blank is already filled and incorrect, clear it and return
    if (span.textContent !== '__' && !span.classList.contains('selected')) {
        
        // 1. Clear the content (make it a blank again)
        span.textContent = '__';
        
        
        // 2. Reset the state (remove correct/incorrect indicators)
        span.classList.remove('correct', 'incorrect');
        
        // 3. Remove any previous selection state
        if (selectedBlank) {
            selectedBlank.classList.remove('selected');
        }
        selectedBlank = null; // Important: Clear the reference after unfilling
        
        // Add visual feedback
        // if (feedback) {
        //     feedback.textContent = 'रिक्त स्थान साफ़ हो गया है। अब कोई विराम चिह्न चुनें।';
        // }
        
        return; // Stop execution, the blank has been cleared
    }
    
    // --- Original Logic (for selecting an empty blank or re-selecting a blank) ---
    
    // Un-highlight the previously selected blank
    if (selectedBlank && selectedBlank !== span) { // Only un-highlight if it's a different blank
        selectedBlank.classList.remove('selected');
    }
    
    // Handle the case where the user clicks the already selected span (to unselect it)
    if (selectedBlank === span) {
        span.classList.remove('selected');
        selectedBlank = null;
        if (feedback) {
            feedback.textContent = 'एक रिक्त स्थान पर टैप करें।';
        }
        return;
    }
    
    selectedBlank = span;
    span.classList.add('selected');
    
    // Remove correct/incorrect classes when selecting (user wants to change it)
    span.classList.remove('correct', 'incorrect');
    
    // Add visual feedback
    if (feedback) {
        feedback.textContent = 'अब सही विराम चिह्न पर टैप करें।';
    }
}

/**
 * Places the selected punctuation mark into the selected blank and checks the answer.
 * @param {string} symbol - The punctuation mark to place.
 */
function placePunctuation(symbol) {
    if (!selectedBlank) {
        if (feedback) {
            feedback.textContent = 'पहले एक रिक्त स्थान पर टैप करें।';
        }
        return;
    }

    let symbolToUse = symbol === '&quot;' ? '"' : symbol;

    // Get the expected punctuation for this blank
    const expectedPunct = selectedBlank.getAttribute('data-expected');
    
    // 1. Place the punctuation in the selected blank
    selectedBlank.textContent = symbolToUse;
    
    // 2. Clear previous state classes
    selectedBlank.classList.remove('correct', 'incorrect', 'frozen');
    
    // --- STEP 3: Check if the placed punctuation matches the expected one ---
    if (symbolToUse === expectedPunct) {
        // --- If the CURRENT answer is CORRECT ---
        selectedBlank.classList.add('correct');
        selectedBlank.classList.add('frozen'); // FREEZE the correct blank
        selectedBlank.classList.remove('selected');
        
        // Clear selection for correct answer
        selectedBlank = null; 
        
    } else {
        // --- If the CURRENT answer is INCORRECT ---
        selectedBlank.classList.add('incorrect'); // Add red background immediately
        selectedBlank.classList.remove('selected'); 
        
        // selectedBlank remains as is (for correction)
    }

    // --- STEP 4: Comprehensive Game Completion Check (New Logic) ---
    const allBlanks = sentenceText.querySelectorAll('.blank');
    const filledBlanks = Array.from(allBlanks).filter(blank => blank.textContent !== '__');
    
    // Check if ALL blanks are now FILLED
    if (filledBlanks.length === allBlanks.length) {
        
        // ALL blanks are filled. Now, check if ALL filled blanks are CORRECT.
        const incorrectBlanks = Array.from(allBlanks).filter(blank => blank.classList.contains('incorrect'));
        
        if (incorrectBlanks.length === 0) {
            // All blanks filled AND all are correct
            if (feedback) {
                feedback.textContent = '🎉 शाबाश! सभी उत्तर सही हैं।';
            }
        } else {
            // All blanks filled, but at least one is incorrect
            if (feedback) {
                // Find the first incorrect blank and auto-select it for user convenience
                const firstIncorrect = incorrectBlanks[0];
               // firstIncorrect.classList.add('selected');
                selectedBlank = firstIncorrect;
                
                feedback.textContent = 'आपकी कोशिश अच्छी रही! गलत उत्तर! फिर से कोशिश करने के लिए गलत उत्तर पर टैप करें।';
            }
        }
        return; // Stop execution as we've handled the final check
    }
    
    // --- STEP 5: Standard Feedback (If not the last blank) ---
    
    // If we reach here, it means not all blanks are filled yet.
    if (selectedBlank && selectedBlank.classList.contains('incorrect')) {
        // Current blank was incorrect, wait for correction
        if (feedback) {
            feedback.textContent = 'गलत उत्तर! फिर से कोशिश करने के लिए गलत उत्तर पर टैप करें।';
        }
    } else if (!selectedBlank) {
        // Current blank was correct, prompt for the next one
          if (feedback) {
            feedback.textContent = 'सही! अब दूसरे रिक्त स्थान पर टैप करें।';
        }
    }
}

/**
 * Loads the next sequential sentence. (UPDATED)
 */
function nextSentence() {
    loadSentence(getNextIndex());
}

/**
 * Resets the current sentence (reloads it with the next sequential one). (UPDATED)
 */
function resetSentence() {
    // Note: If you want 'reset' to reload the *current* sentence, use: loadSentence(currentIndex);
    // If you want it to behave like 'next', use: loadSentence(getNextIndex());
    // Assuming 'reset' means moving to the next task:
    loadSentence(getNextIndex());
}

/**
 * Shows the correct answer for the current sentence.
 */
function showAnswer() {
    if (sentenceText) {
        // Uses the currently loaded index
        sentenceText.innerHTML = hindiSentences[currentIndex].answer;
    }
    if (feedback) {
        feedback.textContent = 'यह रहा सही उत्तर।';
    }
    selectedBlank = null;
}

let insight = document.getElementById('btn_insight');
let insight_container = document.getElementById('insight-container');
let close_insight = document.getElementById('close-insight-btn');
let next_btn = document.getElementById('next-btn');
let show_example_btn = document.getElementById('show-example-btn');

insight.addEventListener('click', () => { 
    insight_container.style.display = 'block';
    close_insight.style.display = 'block';
    next_btn.disabled = true;
    show_example_btn.disabled = true;
});

close_insight.addEventListener('click', () => {
    insight_container.style.display = 'None';
    close_insight.style.display = 'None';
    next_btn.disabled = false;
    show_example_btn.disabled = false;
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - Initializing...");
    // Initial load: Start with the first sequential sentence (index 0) (UPDATED)
    loadSentence(getNextIndex());
});

// Also load a sentence on page refresh/load
window.addEventListener('load', function() {
    console.log("Window Loaded - Loading first sequential sentence...");
    // This will load the next sentence after DOMContentLoaded, which might be sentence 1. 
    // It's generally safer to just use DOMContentLoaded for initialization.
    // However, keeping the original logic structure but updating to use getNextIndex():
    loadSentence(getNextIndex());
});