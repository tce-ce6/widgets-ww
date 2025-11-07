// --- Data Set ---
const hindiSentences = [
    { "sentence": "शाबाश__ तुमने बहुत अच्छा खेला__", "answer": "शाबाश! तुमने बहुत अच्छा खेला।" },
    { "sentence": "वाह__ क्या सुंदर चित्र बनाया है तुमने__", "answer": "वाह! क्या सुंदर चित्र बनाया है तुमने।" },
    { "sentence": "माँ ने कहा__  __बेटा __ अपना कमरा साफ़ करो__ __", "answer": "माँ ने कहा, \"बेटा, अपना कमरा साफ़ करो।\"" },
    { "sentence": "हमारे देश में कई भाषाएँ बोली जाती हैं__ जैसे हिंदी___तमिल___ बंगाली आदि____", "answer": "हमारे देश में कई भाषाएँ बोली जाती हैं; जैसे हिंदी, तमिल, बंगाली आदि।" },
    { "sentence": "अरे__ यह क्या हो गया___ सब कुछ बिखर गया है__", "answer": "अरे! यह क्या हो गया? सब कुछ बिखर गया है।" },
    { "sentence": "मोहन पढ़ने में तेज़ है__परंतु खेल में कमज़ोर है__", "answer": "मोहन पढ़ने में तेज़ है, परंतु खेल में कमज़ोर है।" },
    { "sentence": "तुम घर जाओगे__ या यहीं रुकोगे__", "answer": "तुम घर जाओगे, या यहीं रुकोगे?" },
    { "sentence": "शिक्षक जी ने पूछा__  __तुमने अपना काम पूरा किया है__  __", "answer": "शिक्षक जी ने पूछा, \"तुमने अपना काम पूरा किया है?\"" },
    { "sentence": "सीता__ गीता और रीता सभी स्कूल जा रही हैं__", "answer": "सीता, गीता और रीता सभी स्कूल जा रही हैं।" },
    { "sentence": "रमेश बहुत अच्छा लड़का है__ वह सबकी मदद करता है__", "answer": "रमेश बहुत अच्छा लड़का है; वह सबकी मदद करता है।" },
    { "sentence": "उसने कहा__ __मैं कल दिल्ली जाऊँगा__  __", "answer": "उसने कहा, \"मैं कल दिल्ली जाऊँगा।\"" },
    { "sentence": "डॉक्टर साहब__ क्या मेरी माँ ठीक हो जाएगी__", "answer": "डॉक्टर साहब, क्या मेरी माँ ठीक हो जाएगी?" },
    { "sentence": "भारत एक महान देश है__ यहाँ अनेक धर्मों के लोग रहते हैं__", "answer": "भारत एक महान देश है; यहाँ अनेक धर्मों के लोग रहते हैं।" },
    { "sentence": "अरे वाह__ कितना स्वादिष्ट खाना बनाया है__", "answer": "अरे वाह! कितना स्वादिष्ट खाना बनाया है।" },
    { "sentence": "राजू__ तुम कब आए__ मुझे पता ही नहीं चला__", "answer": "राजू, तुम कब आए? मुझे पता ही नहीं चला।" },
    { "sentence": "गुरुजी ने समझाया__ __पढ़ाई में मन लगाना जरूरी है__ __", "answer": "गुरु जी ने समझाया, \"पढ़ाई में मन लगाना जरूरी है।\"" },
    { "sentence": "छी छी__ कितनी गंदगी फैली हुई है__", "answer": "छी छी! कितनी गंदगी फैली हुई है।" },
    { "sentence": "सुनीता बहुत सुंदर गाती है__ वह एक अच्छी नर्तकी भी है__", "answer": "सुनीता बहुत सुंदर गाती है; वह एक अच्छी नर्तकी भी है।" },
    { "sentence": "अरे भई__ तुम यहाँ क्या कर रहे हो__", "answer": "अरे भई, तुम यहाँ क्या कर रहे हो?" },
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
    { "sentence": "रीता ने कहा__  __मैं कल तुम्हारे घर आऊँगी__  __", "answer": "रीता ने कहा, \"मैं कल तुम्हारे घर आऊँगी।\"" },
    { "sentence": "क्या आपको पता है__ आज कौन सा दिन है__", "answer": "क्या आपको पता है, आज कौन सा दिन है?" },
    { "sentence": "पेड़ हमें ऑक्सीजन देते हैं__ हमें उनकी रक्षा करनी चाहिए__", "answer": "पेड़ हमें ऑक्सीजन देते हैं; हमें उनकी रक्षा करनी चाहिए।" },
    { "sentence": "अरे वाह__  कितनी मिठास है इस आम में__", "answer": "अरे वाह! कितनी मिठास है इस आम में।" },
    { "sentence": "गाँधी जी ने कहा__ __सत्य और अहिंसा से सब कुछ संभव है__  __", "answer": "गाँधी जी ने कहा, \"सत्य और अहिंसा से सब कुछ संभव है।\"" },
    { "sentence": "उफ़__ कितनी गर्मी है__ आज तो जान निकल रही है__", "answer": "उफ़! कितनी गर्मी है। आज तो जान निकल रही है।" },
    { "sentence": "शाबाश__  तुमने बहुत अच्छा काम किया है__", "answer": "शाबाश! तुमने बहुत अच्छा काम किया है।" },
    { "sentence": "तुम्हें क्या लगता है__ मौसम कैसा रहेगा आज__", "answer": "तुम्हें क्या लगता है, मौसम कैसा रहेगा आज?" },
    { "sentence": "हाय राम__ यह तो बड़ी मुश्किल में फँस गया__", "answer": "हाय राम! यह तो बड़ी मुश्किल में फँस गया।" },
    { "sentence": "बच्चे खुशी__खुशी स्कूल से घर लौट रहे थे__", "answer": "बच्चे खुशी-खुशी स्कूल से घर लौट रहे थे।" },
    { "sentence": "पढ़ना__लिखना हर बच्चे का अधिकार है__", "answer": "पढ़ना-लिखना हर बच्चे का अधिकार है।" }
];


let currentIndex = 0;
let selectedBlank = null;

// Get the SVG text elements
const sentenceContainer = document.getElementById('sentence-container'); 
const sentenceText = document.getElementById('sentence-text');
const feedback = document.getElementById('feedback'); // Assuming you have an element for feedback

/**
 * Generates a random index for a sentence.
 * @returns {number} The random index.
 */
function selectRandomIndex() {
    return Math.floor(Math.random() * hindiSentences.length);
}

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
    
    // Create the HTML content with clickable blanks
    let htmlContent = data.sentence.replace(/__/g, (match, offset) => {
        // We use a custom attribute 'data-index' to uniquely identify the blank
        return `<span class="blank" data-index="${offset}" onclick="selectBlank(this)">__</span>`;
    });

    sentenceText.innerHTML = htmlContent;
    console.log("Loaded sentence:", data.sentence);

    if (feedback) {
        feedback.textContent = '';
    }
    selectedBlank = null;
}

/**
 * Highlights the selected blank and stores its reference.
 * @param {HTMLElement} span - The blank element that was clicked.
 */
function selectBlank(span) {
    // Un-highlight the previously selected blank
    if (selectedBlank) {
        selectedBlank.classList.remove('selected');
    }
    
    selectedBlank = span;
    span.classList.add('selected');
    
    // Add visual feedback
    if (feedback) {
        feedback.textContent = 'अब सही विराम चिह्न पर क्लिक करें।';
    }
}

/**
 * Places the selected punctuation mark into the selected blank and checks the answer.
 * @param {string} symbol - The punctuation mark to place.
 */
function placePunctuation(symbol) {
    if (!selectedBlank) {
        if (feedback) {
            feedback.textContent = 'पहले एक खाली स्थान चुनें!';
        }
        return;
    }

    // Place the punctuation in the selected blank
    selectedBlank.textContent = symbol;
    selectedBlank.classList.remove('selected');
    selectedBlank = null;
    
    // Check if all blanks are filled
    const allBlanks = sentenceText.querySelectorAll('.blank');
    const filledBlanks = Array.from(allBlanks).filter(blank => blank.textContent !== '__');
    
    if (filledBlanks.length === allBlanks.length) {
        // All blanks are filled, check the answer
        const currentText = sentenceText.textContent;
        const cleanedFilledSentence = currentText.trim().replace(/\s+/g, ' ');
        const cleanedAnswer = hindiSentences[currentIndex].answer.trim().replace(/\s+/g, ' ');
        
        if (cleanedFilledSentence === cleanedAnswer) {
            if (feedback) {
                feedback.textContent = '🎉 शाबाश! सभी उत्तर सही हैं।';
            }
        } else {
            if (feedback) {
                feedback.textContent = '❌ गलत उत्तर। सही उत्तर देखने के लिए "उत्तर दिखाएँ" बटन दबाएं।';
            }
        }
    } else {
        if (feedback) {
            feedback.textContent = 'अब दूसरा खाली स्थान चुनें।';
        }
    }
}

/**
 * Loads the next random sentence.
 */
function nextSentence() {
    loadSentence(selectRandomIndex());
}

/**
 * Resets the current sentence (reloads it with a new random one).
 */
function resetSentence() {
    loadSentence(selectRandomIndex());
}

/**
 * Shows the correct answer for the current sentence.
 */
function showAnswer() {
    if (sentenceText) {
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
    // Initial load: Start with a random sentence
    loadSentence(selectRandomIndex());
});

// Also load a random sentence on page refresh/load
window.addEventListener('load', function() {
    console.log("Window Loaded - Loading random sentence...");
    loadSentence(selectRandomIndex());
});