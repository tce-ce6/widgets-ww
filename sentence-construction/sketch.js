let words = [];
let blanks = [];
let selectedWord = null;
let currentSentence = null;
let wordButtons = [];
let feedbackTimer = 0;
let feedbackColor;
let feedbackBlankIndex = -1;
let sentenceIndex = 0;
let showExample = false;

// Global settings
let wordBoxWidth = 100; // Represents the fixed width of the BLANK line
const wordBoxHeight = 50;
const yOffsetWords = 250;
const yOffsetBlanks = 100;
const slotSpacing = 10;
const textSizeValue = 20;
const textPadding = 20; // Extra padding for the word button width

// Canvas Boundaries (Fixed based on 1000px width)
const boundaryXStart = 100;
const boundaryXEnd = 900;
let availableWidth = boundaryXEnd - boundaryXStart; // 800 pixels of usable space
const containerPadding = 10; // Padding used for the main sentence container rectangle

// Define JSON inline instead of external file
let sentenceData = [
    { "words": ["The", "sun", "feels", "hot", "in", "summer", "."], "blanks": 7 },
    { "words": ["I", "eat", "lunch", "with", "my", "friends", "."], "blanks": 7 },
    { "words": ["The", "red", "bird", "sings", "beautifully", "."], "blanks": 5 },
    { "words": ["My", "grandmother", "makes", "delicious", "chapatis", "."], "blanks": 6 },
    { "words": ["We", "play", "cricket", "in", "the", "evening", "."], "blanks": 7 },
    { "words": ["The", "mango", "tastes", "very", "sweet", "."], "blanks": 5 },
    { "words": ["The", "boy", "kicked", "the", "green", "ball", "."], "blanks": 7 },
    { "words": ["That", "book", "was", "very", "interesting", "."], "blanks": 6 },
    { "words": ["The", "school", "bus", "was", "late", "."], "blanks": 5 },
    { "words": ["My", "sister", "wears", "a", "blue", "saree", "."], "blanks": 7 },
    { "words": ["It", "rained", "heavily", "during", "monsoon", "."], "blanks": 5 },
    { "words": ["The", "farmer", "plants", "seeds", "every", "morning", "."], "blanks": 7 },
    { "words": ["We", "celebrate", "Diwali", "with", "bright", "lights", "."], "blanks": 7 },
    { "words": ["Cows", "give", "milk", "daily", "."], "blanks": 4 },
    { "words": ["The", "temple", "bell", "rings", "very", "loudly", "."], "blanks": 7 },
    { "words": ["I", "brush", "my", "teeth", "every", "morning", "."], "blanks": 7 },
    { "words": ["The", "children", "played", "football", "after", "school", "."], "blanks": 7 },
    { "words": ["I", "finished", "my", "homework", "before", "dinner", "."], "blanks": 7 },
    { "words": ["The", "street", "vendor", "sells", "hot", "samosas", "."], "blanks": 7 },
    { "words": ["Many", "fish", "swim", "in", "the", "pond", "."], "blanks": 6 },
    { "words": ["The", "dog", "loves", "to", "play", "fetch", "."], "blanks": 7 },
    { "words": ["The", "teacher", "told", "an", "interesting", "story", "."], "blanks": 7 },
    { "words": ["We", "watched", "a", "movie", "last", "night", "."], "blanks": 7 },
    { "words": ["My", "brother", "rides", "his", "bicycle", "daily", "."], "blanks": 7 },
    { "words": ["The", "elephant", "looked", "very", "big", "today", "."], "blanks": 7 },
    { "words": ["Yellow", "flowers", "bloom", "in", "our", "garden", "."], "blanks": 7 },
    { "words": ["I", "helped", "my", "mother", "cook", "lunch", "."], "blanks": 7 },
    { "words": ["The", "train", "reached", "the", "station", "early", "."], "blanks": 7 },
    { "words": ["We", "visited", "our", "grandmother", "last", "Sunday", "."], "blanks": 7 },
    { "words": ["The", "shopkeeper", "sold", "fresh", "vegetables", "."], "blanks": 6 },
    { "words": ["My", "friend", "invited", "me", "to", "her", "party", "."], "blanks": 8 },
    { "words": ["The", "students", "listened", "to", "the", "lesson", "."], "blanks": 7 },
    { "words": ["The", "children", "played", "on", "the", "swing", "."], "blanks": 7 },
    { "words": ["We", "ate", "delicious", "biryani", "for", "dinner", "."], "blanks": 7 },
    { "words": ["The", "baby", "slept", "peacefully", "all", "night", "."], "blanks": 7 },
    { "words": ["My", "father", "reads", "the", "newspaper", "daily", "."], "blanks": 7 },
    { "words": ["The", "children", "built", "sandcastles", "at", "the", "beach", "."], "blanks": 8 },
    { "words": ["I", "bought", "new", "books", "from", "the", "shop", "."], "blanks": 7 },
    { "words": ["The", "doctor", "checked", "my", "little", "brother", "."], "blanks": 7 },
    { "words": ["We", "planted", "jasmine", "flowers", "in", "pots", "."], "blanks": 7 },
    { "words": ["The", "postman", "delivered", "letters", "this", "morning", "."], "blanks": 7 },
    { "words": ["My", "mother", "bought", "vegetables", "from", "the", "market", "."], "blanks": 8 },
    { "words": ["The", "dog", "played", "with", "the", "red", "ball", "."], "blanks": 7 },
    { "words": ["We", "saw", "a", "beautiful", "rainbow", "yesterday", "."], "blanks": 7 },
    { "words": ["The", "baker", "makes", "fresh", "bread", "daily", "."], "blanks": 7 },
    { "words": ["I", "drew", "a", "colourful", "picture", "for", "art", "class", "."], "blanks": 9 },
    { "words": ["The", "policeman", "helped", "us", "cross", "the", "road", "."], "blanks": 7 },
    { "words": ["We", "heard", "the", "birds", "singing", "at", "dawn", "."], "blanks": 8 },
    { "words": ["My", "grandfather", "told", "stories", "about", "his", "childhood", "."], "blanks": 8 },
    { "words": ["The", "children", "wore", "warm", "clothes", "in", "winter", "."], "blanks": 7 }
];

function setup() {
    const canvas = createCanvas(1000, 400);
    canvas.parent('mainCanvas');
    
    // Set up button listeners (assuming the HTML buttons exist)
    if (document.getElementById('show-example-btn')) {
        document.getElementById('show-example-btn').addEventListener('click', toggleShowExample);
    }
    if (document.getElementById('next-btn')) {
        document.getElementById('next-btn').addEventListener('click', loadNextSentence);
    }
    
    textSize(textSizeValue);
    loadSentence(sentenceIndex);
}

// Function to calculate the width needed to fit a specific word
function calculateWordWidth(wordText) {
    textSize(textSizeValue);
    // Use max() to ensure even short words get a minimum size for good clicking target
    return max(textWidth(wordText) + textPadding, 60); 
}

// Function to determine the fixed width for BLANKS
function calculateFixedBlankWidth(numWords) {
    const totalSpacing = (numWords - 1) * slotSpacing;
    let fixedWidth = floor((availableWidth - totalSpacing) / numWords);
    return max(fixedWidth, 50); 
}


// Function to implement transparent background image and fix drawing order
function draw() {
    background(255); 
    
    // Sentence container (drawn from boundary start/end with padding)
    fill(240);
    stroke(0);
    rectMode(CORNER);
    rect(boundaryXStart - containerPadding, 50, availableWidth + 2 * containerPadding, 100, 15);

    if (showExample) {
        drawCorrectSentence();
    } else {
        drawBlanks();
    }
    
    // This draws the current sentence's word buttons ONLY, as old buttons were cleared in loadSentence.
    drawWordButtons();
}

function drawCorrectSentence() {
    const originalWords = currentSentence.words;
    
    let displayWords = originalWords.slice();
    if (displayWords.length > 0) {
        displayWords[0] = displayWords[0].charAt(0).toUpperCase() + displayWords[0].slice(1).toLowerCase();
        for (let i = 1; i < displayWords.length; i++) {
            displayWords[i] = displayWords[i].toLowerCase();
        }
    }
    let combinedText = displayWords.join(" ");

    let centerX = boundaryXStart + availableWidth / 2;
    let centerY = yOffsetBlanks + wordBoxHeight / 2;
    
    textStyle(BOLD);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textSizeValue);
    
    text(combinedText, centerX, centerY);
    
    textStyle(NORMAL);
}

function drawBlanks() {
    for (let i = 0; i < blanks.length; i++) {
        const b = blanks[i];
        
        let blankStrokeColor = color(0);
        let blankStrokeWeight = 2;
        
        // 1. Apply feedback (to the line)
        if (feedbackTimer > 0 && feedbackBlankIndex === i) {
            blankStrokeColor = feedbackColor;
            blankStrokeWeight = 4;
        }
        
        stroke(blankStrokeColor);
        strokeWeight(blankStrokeWeight);
        
        // Draw the blank line
        line(b.x, b.y + b.h / 2, b.x + b.w, b.y + b.h / 2);
        
        // 2. Draw the placed word
        if (b.word) {
            let wordStrokeColor = null;
            
            // Apply green glow to the placed word if it was correct and the timer is active
            if (feedbackTimer > 0 && feedbackBlankIndex === i && feedbackColor.toString() === color(0, 200, 0).toString()) {
                 // Bright green glow for the word
                textColor = "green";
            }
            
            // Draw the word, applying glow if wordStrokeColor is set
            drawWord(b.word.text, b.x + b.w / 2, b.y + b.h / 2 - 20, "green", wordStrokeColor);
        }
    }
    if (feedbackTimer > 0) {
        feedbackTimer--;
    }
}

function drawWordButtons() {
    for (let i = 0; i < wordButtons.length; i++) {
        const w = wordButtons[i];
        if (!w.word.isPlaced) {
            
            // Check for selection and apply green glow to the button border
            if (selectedWord === w) {
                fill(135, 206, 250); // button color
                stroke(0, 255, 0); // green glow border
                strokeWeight(3);
            } else {
                fill(135, 206, 250); // button color
                stroke(0); // normal border
                strokeWeight(1);
            }
            
            rect(w.x, w.y, w.w, w.h, 5);
            drawWord(w.word.text, w.x + w.w / 2, w.y + w.h / 2, 0);
        }
    }
}

/**
 * Draws the word text, optionally with a glowing stroke.
 */
function drawWord(wordText, x, y, textColor, strokeColor = null) {
    // if (strokeColor) {
    //     textStyle(BOLD); 
    //     fill(strokeColor);
    //     // Draw outline/shadow for glow effect
    //     text(wordText, x - 1, y);
    //     text(wordText, x + 1, y);
    //     text(wordText, x, y - 1);
    //     text(wordText, x, y + 1);
    //     textStyle(NORMAL);
    // }

    fill(textColor);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textSizeValue);
    textStyle();
    text(wordText, x, y);
}

function mousePressed() {
    if (showExample) return; 

    // 1. Try to select a word
    for (let i = 0; i < wordButtons.length; i++) {
        const w = wordButtons[i];
        if (
            mouseX > w.x && mouseX < w.x + w.w &&
            mouseY > w.y && mouseY < w.y + w.h &&
            !w.word.isPlaced
        ) {
            if (selectedWord === w) {
                selectedWord = null;
            } else {
                selectedWord = w;
            }
            return false;
        }
    }

    // 2. If a word is selected, try to place it in a blank
    if (selectedWord) {
        for (let i = 0; i < blanks.length; i++) {
            const b = blanks[i];
            if (
                mouseX > b.x && mouseX < b.x + b.w &&
                mouseY > b.y && mouseY < b.y + b.h &&
                !b.word
            ) {
                if (checkPlacement(selectedWord.word.text, i)) {
                    placeWord(selectedWord.word, i);
                    feedbackColor = color(0, 200, 0); // Correct: Green
                    selectedWord = null;
                } else {
                    feedbackColor = color(200, 0, 0); // Wrong: Red
                }
                
                feedbackBlankIndex = i;
                feedbackTimer = 60; // 1 second @ 60fps
                return false;
            }
        }
    }
    
    // Deselect if clicking anywhere else
    if (selectedWord) {
        selectedWord = null;
    }
}

function mouseReleased() {
    // No action needed here
}

// Function to load the next sentence with wrap-around logic
function loadSentence(index) {
    
    // The core fix for overlap: the arrays must be fully reset before new elements are pushed.
    words = [];
    wordButtons = [];
    blanks = [];
    selectedWord = null;
    
    // Check if the index is out of bounds (wrap-around logic)
    if (index >= sentenceData.length) {
        sentenceIndex = 0; 
        index = 0;
    }
    
    currentSentence = sentenceData[index];
    
    // Convert correct words to lowercase for game logic
    const correctWordsLower = currentSentence.words.map(w => w.toLowerCase());

    words = shuffleArray(correctWordsLower.slice()); 
    // These resets are crucial to prevent overlap:
    wordButtons = [];
    blanks = [];
    selectedWord = null; 
    feedbackTimer = 0;
    feedbackBlankIndex = -1;
    showExample = false;

    
    // --- STEP 1: Calculate Blank Layout Dimensions (Fixed Width) ---
    let numWords = correctWordsLower.length;
    
    // A. Calculate the FIXED width for the BLANKS
    wordBoxWidth = calculateFixedBlankWidth(numWords); 
    let totalLayoutWidth = numWords * wordBoxWidth + (numWords - 1) * slotSpacing;

    // B. Calculate the starting X position to center the layout within the boundary
    let startX = (availableWidth - totalLayoutWidth) / 2 + boundaryXStart;

    
    // --- STEP 2: Create Blanks (using fixed width) ---
    let blankX = startX;
    for (let i = 0; i < numWords; i++) {
        blanks.push({
            x: blankX,
            y: yOffsetBlanks,
            w: wordBoxWidth, // Fixed width
            h: wordBoxHeight,
            word: null
        });
        blankX += wordBoxWidth + slotSpacing;
    }

    
    // --- STEP 3: Create Word Buttons (using dynamic, content-based width, aligned with blanks) ---
    
    // A. Calculate the actual width needed for each button based on its text
    let buttonWidths = words.map(w => calculateWordWidth(w));
    
    // B. Calculate the total width of the button pool
    let totalButtonLayoutWidth = buttonWidths.reduce((sum, w) => sum + w, 0) + (numWords - 1) * slotSpacing;
    
    // C. Calculate the button starting X to align the *center* of the button pool layout 
    //    with the *center* of the blank pool layout.
    let centerOfBlanks = startX + totalLayoutWidth / 2;
    let buttonStartX = centerOfBlanks - totalButtonLayoutWidth / 2;
    
    let buttonX = buttonStartX;

    // D. Create the buttons
    for (let i = 0; i < words.length; i++) {
        const word = { text: words[i], isPlaced: false };
        let currentButtonWidth = buttonWidths[i];
        
        wordButtons.push({
            word: word,
            x: buttonX,
            y: yOffsetWords,
            w: currentButtonWidth, // Dynamic width, based on text
            h: wordBoxHeight
        });
        buttonX += currentButtonWidth + slotSpacing;
    }
}

function loadNextSentence() {
    sentenceIndex = (sentenceIndex + 1);
    loadSentence(sentenceIndex);
}

function toggleShowExample() {
    showExample = !showExample;
    if (showExample) {
        selectedWord = null;
    }
}

function checkPlacement(wordText, blankIndex) {
    const correctOrder = currentSentence.words.map(w => w.toLowerCase());
    
    let firstEmptyBlankIndex = blanks.findIndex((b) => !b.word);

    return (
        blankIndex === firstEmptyBlankIndex &&
        wordText.toLowerCase() === correctOrder[blankIndex]
    );
}

function placeWord(word, blankIndex) {
    blanks[blankIndex].word = word;
    word.isPlaced = true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = floor(random(i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}