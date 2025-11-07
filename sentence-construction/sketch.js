let words = [];
let blanks = [];
let selectedWord = null;
let currentSentence = null;
let wordButtons = [];
let placedBoxes = [];
let feedbackTimer = 0;
let feedbackColor;
let feedbackBlankIndex = -1;
let sentenceIndex = 0;
let showExample = false;
let sentenceComplete = false;
let blanksStartX = 0;
let blanksTotalWidth = 0;

// Global settings
let wordBoxWidth = 100; // Represents the fixed width of the BLANK line
const wordBoxHeight = 50;
const yOffsetWords = 250;
const yOffsetBlanks = 150;
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

// // --- SETUP AND LIFECYCLE ---

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

function draw() {
    clear(); // Clear canvas fully

    // --- TOP TEXT ---
    push();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(15);
    textStyle(ITALIC);
    text('Tap the words in the correct order to make a sentence!', 500, 105);
    pop();

    // --- SENTENCE CONTAINER RECTANGLE ---
    push();
    fill(240);
    rectMode(CORNER);

    // HIGHLIGHT LOGIC for final placement
    if (highlightMainRect) {
        stroke(0, 200, 0); // Green highlight for last word placed
        strokeWeight(4);
    } else {
        stroke(0);
        strokeWeight(1);
    }

    rect(boundaryXStart - containerPadding, 125, availableWidth + 2 * containerPadding, 100, 15);
    pop();

    // --- MAIN GAME DRAWING LOGIC ---
    if (showExample) {
        drawCorrectSentence();
    } else if (sentenceComplete) {
        drawMergedSentenceBox();
    } else {
        drawBlanks();
        drawPlacedBoxes();
        drawWordButtons();
    }

    updateCursor();
}

// --- INTERACTION FUNCTIONS ---

function mousePressed() {
    if (showExample || sentenceComplete) return;

    // 1. Try to select a word (which now acts as the placement attempt)
    for (let i = 0; i < wordButtons.length; i++) {
        const w = wordButtons[i];

        // Check if the click is within an unplaced word button
        if (
            mouseX > w.x && mouseX < w.x + w.w &&
            mouseY > w.y && mouseY < w.y + w.h &&
            !w.word.isPlaced
        ) {
            let firstEmptyBlankIndex = blanks.findIndex((b) => !b.word);

            // Check if there's an empty blank and if the word is correct for that position
            if (firstEmptyBlankIndex !== -1 && checkPlacement(w.word.text, firstEmptyBlankIndex)) {
                // CORRECT WORD SELECTED
                placeWord(w, firstEmptyBlankIndex);

                // Set green feedback on the word button itself
                w.feedbackColor = color(0, 200, 0);
                w.feedbackTimer = 60; // 1 second blink

                // Check if this was the last word
                if (firstEmptyBlankIndex === blanks.length - 1) {
                   // highlightMainRect = true; // Trigger main rect highlight
                }

            } else {
                // INCORRECT WORD SELECTED
                // Set red feedback on the word button itself
                w.feedbackColor = color(200, 0, 0);
                w.feedbackTimer = 60;
            }
            return false; // Stop processing mouse click
        }
    }
}

// --- CURSOR UPDATE ---

function updateCursor() {
    let pointer = false; // Flag to determine if the cursor should be a pointer

    // 1. Check for hover over unplaced Word Buttons
    for (let i = 0; i < wordButtons.length; i++) {
        const w = wordButtons[i];
        if (
            mouseX > w.x && mouseX < w.x + w.w &&
            mouseY > w.y && mouseY < w.y + w.h &&
            !w.word.isPlaced
        ) {
            pointer = true;
            break;
        }
    }

    // 2. If a word is SELECTED, check for hover over EMPTY Blanks
    // NOTE: This logic is less critical now, but kept for general UX on blanks if needed.
    if (!pointer && selectedWord) {
        for (let i = 0; i < blanks.length; i++) {
            const b = blanks[i];
            if (
                mouseX > b.x && mouseX < b.x + b.w &&
                mouseY > b.y && mouseY < b.y + b.h &&
                !b.word
            ) {
                pointer = true;
                break;
            }
        }
    }

    // Apply the cursor change
    if (pointer) {
        cursor(HAND); // p5.js constant for a pointer cursor
    } else {
        cursor(ARROW); // Default cursor
    }
}

// --- DRAWING FUNCTIONS ---

function drawBlanks() {
    for (let i = 0; i < blanks.length; i++) {
        const b = blanks[i];

        // Draw the blank line only if not occupied (No feedback logic)
        if (!b.word) {
            stroke(0);
            strokeWeight(2);
            line(b.x, (b.y + b.h / 2) + 20, b.x + b.w, (b.y + b.h / 2) + 20);
        }
    }
}

function drawPlacedBoxes() {
    let allAnimatedInPlace = true;
    for (let i = 0; i < placedBoxes.length; i++) {
        const pb = placedBoxes[i];

        // Animate towards target
        const speed = 8; // pixels per frame
        const dx = pb.targetX - pb.x;
        const dy = pb.targetY - pb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            const stepX = (dx / dist) * min(speed, dist);
            const stepY = (dy / dist) * min(speed, dist);
            pb.x += stepX;
            pb.y += stepY;
            pb.done = false;
            allAnimatedInPlace = false;
        } else {
            pb.x = pb.targetX;
            pb.y = pb.targetY;
            pb.done = true;
        }

        // Draw the blue box
        fill('#3DE7E7');
        stroke(0);
        strokeWeight(1);
        rect(pb.x, pb.y, pb.w, pb.h, 5);

        // Capitalize if it's the first word box (blankIndex 0)
        let displayText = pb.word.text;
        if (pb.blankIndex === 0 && displayText.length > 0) {
            displayText = displayText.charAt(0).toUpperCase() + displayText.slice(1);
        }
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(textSizeValue);
        text(displayText, pb.x + pb.w / 2, pb.y + pb.h / 2);
    }

    // Check completion
    if (!sentenceComplete) {
        const allFilled = blanks.every(b => !!b.word);
        if (allFilled && allAnimatedInPlace) {
            sentenceComplete = true;
        }
    }
}

function drawWordButtons() {
    for (let i = 0; i < wordButtons.length; i++) {
        const w = wordButtons[i];
        if (!w.word.isPlaced) {

            // Apply feedback blink to the button
            if (w.feedbackTimer > 0) {
                fill('#3DE7E7');
                stroke(w.feedbackColor);
                // Simple blink effect (stroke thickness oscillates)
                strokeWeight(3 + (w.feedbackTimer % 10 > 5 ? 2 : 0));
                w.feedbackTimer--;

            } else {
                fill('#3DE7E7'); // button color
                stroke(0); // normal border
                strokeWeight(1);
            }

            rect(w.x, w.y, w.w, w.h, 5);
            drawWord(w.word.text, w.x + w.w / 2, w.y + w.h / 2, 0);
        }
    }
}

function drawCorrectSentence() {
    const originalWords = currentSentence.words;

    let displayWords = originalWords.slice();

    if (displayWords.length > 0) {

        // 1. Capitalize the first word and lowercase the rest
        displayWords[0] = displayWords[0].charAt(0).toUpperCase() + displayWords[0].slice(1).toLowerCase();
        for (let i = 1; i < displayWords.length; i++) {
            displayWords[i] = displayWords[i].toLowerCase();
        }

        // 2. CHECK AND ATTACH LAST WORD (PUNCTUATION)
        const lastIndex = displayWords.length - 1;
        if (lastIndex > 0) {
            const lastWord = displayWords[lastIndex];

            // Basic check if it looks like punctuation that shouldn't have a preceding space
            if (lastWord.length === 1 && ['.', '!', '?', ','].includes(lastWord)) {
                // Attach the punctuation to the second-to-last word
                displayWords[lastIndex - 1] += lastWord;
                // Remove the now-redundant punctuation element from the array
                displayWords.pop();
            }
        }
    }

    let combinedText = displayWords.join(" ");

    let centerX = boundaryXStart + availableWidth / 2;
    let centerY = yOffsetBlanks + wordBoxHeight / 2;

    // The rect is already drawn by the main draw function with correct highlighting

    fill('#3DE7E7');
    stroke(0);
    strokeWeight(1);
    rect(blanksStartX + 50, yOffsetBlanks, blanksTotalWidth - 100, wordBoxHeight, 5);

    textStyle(BOLD);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textSizeValue);

    text(combinedText, centerX, centerY);

    textStyle(NORMAL);
}

function drawMergedSentenceBox() {
    // This is called when sentenceComplete is true.
    // The box highlight is managed by the main draw() function.

    fill('#3DE7E7');
    stroke(0, 200, 0);
    strokeWeight(3);
    rect(blanksStartX + 50, yOffsetBlanks, blanksTotalWidth - 100, wordBoxHeight, 5);

    // Build sentence text: first word capitalized, rest lowercase, fix punctuation spacing
    const originalWords = currentSentence.words.slice();
    let displayWords = originalWords.map((w, idx) => idx === 0 ? (w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : w.toLowerCase());

    // Check and fix punctuation spacing
    const lastIndex = displayWords.length - 1;
    if (lastIndex > 0) {
        const lastWord = displayWords[lastIndex];
        if (lastWord.length === 1 && ['.', '!', '?', ','].includes(lastWord)) {
            displayWords[lastIndex - 1] += lastWord;
            displayWords.pop();
        }
    }

    let combinedText = displayWords.join(" ");

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textSizeValue);
    textStyle(BOLD);

    let centerX = blanksStartX + blanksTotalWidth / 2;
    let centerY = yOffsetBlanks + wordBoxHeight / 2;
    text(combinedText, centerX, centerY);

    textStyle(NORMAL);
}

function drawWord(wordText, x, y, textColor) {
    fill(textColor);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textSizeValue);
    textStyle();
    text(wordText, x, y);
}

// --- HELPER FUNCTIONS ---

function calculateWordWidth(wordText) {
    textSize(textSizeValue);
    return max(textWidth(wordText) + textPadding, 60);
}

function calculateFixedBlankWidth(numWords) {
    const totalSpacing = (numWords - 1) * slotSpacing;
    let fixedWidth = floor((availableWidth - totalSpacing) / numWords);
    return max(fixedWidth, 50);
}

function checkPlacement(wordText, blankIndex) {
    const correctOrder = currentSentence.words.map(w => w.toLowerCase());

    // Simple check: Is the clicked word the correct word for the expected position?
    return (wordText.toLowerCase() === correctOrder[blankIndex].toLowerCase());
}

function placeWord(buttonRef, blankIndex) {
    // Mark the blank as occupied
    blanks[blankIndex].word = buttonRef.word;
    buttonRef.word.isPlaced = true;

    // Capitalize first word once placed correctly at index 0
    if (blankIndex === 0) {
        const t = buttonRef.word.text;
        buttonRef.word.text = t.charAt(0).toUpperCase() + t.slice(1);
    }

    // Target position is the blank's top-left
    const targetX = blanks[blankIndex].x;
    const targetY = blanks[blankIndex].y;

    placedBoxes.push({
        word: buttonRef.word,
        x: buttonRef.x,
        y: buttonRef.y,
        w: blanks[blankIndex].w,
        h: blanks[blankIndex].h,
        targetX: targetX,
        targetY: targetY,
        blankIndex: blankIndex,
        done: false,
        isSelected: false
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = floor(random(i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadSentence(index) {
    // Reset all arrays and state
    words = [];
    wordButtons = [];
    blanks = [];
    placedBoxes = [];
    selectedWord = null;
    showExample = false;
    sentenceComplete = false;
    highlightMainRect = false; // Reset highlight

    if (index >= sentenceData.length) {
        sentenceIndex = 0;
        index = 0;
    }

    currentSentence = sentenceData[index];

    const correctWordsLower = currentSentence.words.map(w => w.toLowerCase());
    words = shuffleArray(correctWordsLower.slice());

    // --- STEP 1: Calculate Blank Layout Dimensions (Fixed Width) ---
    let numWords = correctWordsLower.length;
    wordBoxWidth = calculateFixedBlankWidth(numWords);
    let totalLayoutWidth = numWords * wordBoxWidth + (numWords - 1) * slotSpacing;

    let startX = (availableWidth - totalLayoutWidth) / 2 + boundaryXStart;
    blanksStartX = startX;
    blanksTotalWidth = totalLayoutWidth;

    // --- STEP 2: Create Blanks (using fixed width) ---
    let blankX = startX;
    for (let i = 0; i < numWords; i++) {
        blanks.push({
            x: blankX,
            y: yOffsetBlanks,
            w: wordBoxWidth,
            h: wordBoxHeight,
            word: null
        });
        blankX += wordBoxWidth + slotSpacing;
    }

    // --- STEP 3: Create Word Buttons ---
    let buttonWidths = words.map((w) => {
        if (w.length <= 2 && ['.', '!', '?', ','].includes(w)) {
            textSize(textSizeValue);
            const dotPadding = 20;
            return max(textWidth(w) + dotPadding, 30);
        }
        return wordBoxWidth; // Match blank width for alignment
    });

    let totalButtonLayoutWidth = buttonWidths.reduce((sum, w) => sum + w, 0) + (numWords - 1) * slotSpacing;
    let centerOfBlanks = startX + totalLayoutWidth / 2;
    let buttonStartX = centerOfBlanks - totalButtonLayoutWidth / 2;

    let buttonX = buttonStartX;

    for (let i = 0; i < words.length; i++) {
        const word = { text: words[i], isPlaced: false };
        let currentButtonWidth = buttonWidths[i];

        wordButtons.push({
            word: word,
            x: buttonX,
            y: yOffsetWords,
            w: currentButtonWidth,
            h: wordBoxHeight,
            // New properties for feedback blink
            feedbackColor: color(0),
            feedbackTimer: 0
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