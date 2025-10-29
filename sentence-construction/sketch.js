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

let img;

function preload() {
    // Load your image (make sure it's in your project folder or give correct path)
    img = loadImage("Images/BG_Base.svg");
}

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
    // Clear canvas fully, then draw the SVG background image each frame
    clear();

    // image(img, 0, 0, width, height);

    push();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(15);
   // textFont('Times New Roman');  // or any loaded/available font
    textStyle(ITALIC);
    text('Tap the words in the correct order to make a sentence!', 500, 55);
    pop();
    // Sentence container (drawn from boundary start/end with padding)

    push();
    fill(240);
    stroke(0);
    rectMode(CORNER);
    rect(boundaryXStart - containerPadding, 75, availableWidth + 2 * containerPadding, 100, 15);
    pop();

    if (showExample) {
        drawCorrectSentence();
    } else if (sentenceComplete) {
        drawMergedSentenceBox();
    } else {
        drawBlanks();
        drawPlacedBoxes();
        // This draws the current sentence's word buttons ONLY, as old buttons were cleared in loadSentence.
        drawWordButtons();
    }
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

        // Draw the blank line only if not occupied
        if (!b.word) {
            line(b.x, (b.y + b.h / 2) + 20, b.x + b.w, (b.y + b.h / 2) + 20);
        }
    }
    if (feedbackTimer > 0) {
        feedbackTimer--;
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

        // Draw the blue box and text
        if (pb.isSelected) {
            fill('#3DE7E7');
            stroke(0, 255, 0);
            strokeWeight(3);
        } else {
            fill('#3DE7E7');
            stroke(0);
            strokeWeight(1);
        }
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

    // Check completion: all blanks filled and all boxes in place
    if (!sentenceComplete) {
        const allFilled = blanks.every(b => !!b.word);
        if (allFilled && allAnimatedInPlace) {
            sentenceComplete = true;
        }
    }
}

function drawMergedSentenceBox() {
    // Draw one blue box spanning the full blanks layout
    fill('#3DE7E7');
    stroke(0);
    strokeWeight(1);
    rect(blanksStartX + 50, yOffsetBlanks, blanksTotalWidth - 100, wordBoxHeight, 5);

    // Build sentence text: first word capitalized, rest lowercase, fix punctuation spacing
    const originalWords = currentSentence.words.slice();
    let displayWords = originalWords.map((w, idx) => idx === 0 ? (w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : w.toLowerCase());
    let combinedText = displayWords.join(" ");
    combinedText = combinedText.replace(/\s+([\.,!\?])/g, '$1');

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textSizeValue);
    textStyle(BOLD);
    text(combinedText, blanksStartX + blanksTotalWidth / 2, yOffsetBlanks + wordBoxHeight / 2);
    textStyle(NORMAL);
}

function drawWordButtons() {
    for (let i = 0; i < wordButtons.length; i++) {
        const w = wordButtons[i];
        if (!w.word.isPlaced) {

            // Check for selection and apply green glow to the button border
            if (selectedWord === w) {
                fill('#3DE7E7'); // button color
                stroke(0, 255, 0); // green glow border
                strokeWeight(3);
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
                    placeWord(selectedWord, i);
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
    placedBoxes = [];
    selectedWord = null;
    feedbackTimer = 0;
    feedbackBlankIndex = -1;
    showExample = false;
    sentenceComplete = false;


    // --- STEP 1: Calculate Blank Layout Dimensions (Fixed Width) ---
    let numWords = correctWordsLower.length;

    // A. Calculate the FIXED width for the BLANKS
    wordBoxWidth = calculateFixedBlankWidth(numWords);
    let totalLayoutWidth = numWords * wordBoxWidth + (numWords - 1) * slotSpacing;

    // B. Calculate the starting X position to center the layout within the boundary
    let startX = (availableWidth - totalLayoutWidth) / 2 + boundaryXStart;
    blanksStartX = startX;
    blanksTotalWidth = totalLayoutWidth;


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


    // --- STEP 3: Create Word Buttons (mostly fixed to match blank width) ---

    // A. Calculate the width for each button:
    //    - For normal words: use the fixed blank width so everything lines up
    //    - For '.' punctuation: keep compact width with a little padding
    let buttonWidths = words.map((w) => {
        if (w === '.') {
            textSize(textSizeValue);
            const dotPadding = 20; // small padding on both sides
            return max(textWidth(w) + dotPadding, 30);
        }
        return wordBoxWidth;
    });

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
        // Use the fixed blank dimensions so all placed boxes are equal and aligned
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