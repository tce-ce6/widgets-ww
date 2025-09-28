let words = [];
let blanks = [];
let selectedWord = null;
let currentSentence = null;
let wordButtons = [];
let feedbackTimer = 0;
let feedbackColor;
let feedbackBlankIndex = -1;

// Global settings
const textPadding = 20; // Extra space around text for the button/blank width
const wordBoxHeight = 50;
const padding = 10;
const yOffsetWords = 250;
const yOffsetBlanks = 100;
const slotSpacing = 10;
const textSizeValue = 20; // Use a constant for text size

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
  const canvas = createCanvas(900, 400);
  canvas.parent('mainCanvas');
  textSize(textSizeValue); // Set text size globally
  loadNewSentence();
}

function draw() {
  background(255);

  // Sentence container (kept for visual separation)
  fill(240);
  stroke(0);
  rectMode(CORNER);
  rect(50, 50, width - 100, 100, 15);

  drawBlanks();
  drawWordButtons();
}

/**
 * Calculates the width needed for a word button/blank based on its text content.
 */
function calculateWordWidth(wordText) {
  // Must set text size before calling textWidth()
  textSize(textSizeValue); 
  return textWidth(wordText) + textPadding;
}

function drawBlanks() {
  for (let i = 0; i < blanks.length; i++) {
    const b = blanks[i];
    
    // Blank space color feedback logic
    if (feedbackTimer > 0 && feedbackBlankIndex === i) {
      stroke(feedbackColor);
      strokeWeight(4); // Thicker line for glow effect
      feedbackTimer--;
    } else {
      stroke(0);
      strokeWeight(2);
    }
    
    // Draw the blank line
    line(b.x, b.y + b.h / 2, b.x + b.w, b.y + b.h / 2);
    
    if (b.word) {
      drawWord(b.word.text, b.x + b.w / 2, b.y + b.h / 2 - 20, 0);
    }
  }
}

function drawWordButtons() {
  for (let i = 0; i < wordButtons.length; i++) {
    const w = wordButtons[i];
    if (!w.word.isPlaced) {
      
      // Check for selection and apply glow
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

function drawWord(wordText, x, y, textColor) {
  fill(textColor);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(textSizeValue); // Use constant
  text(wordText, x, y);
}

function mousePressed() {
  // 1. Try to select a word
  for (let i = 0; i < wordButtons.length; i++) {
    const w = wordButtons[i];
    if (
      mouseX > w.x &&
      mouseX < w.x + w.w &&
      mouseY > w.y &&
      mouseY < w.y + w.h &&
      !w.word.isPlaced
    ) {
      // A word button was clicked. Select it (or deselect if it's already selected)
      if (selectedWord === w) {
        selectedWord = null; // deselect
      } else {
        selectedWord = w; // select new word
      }
      return false; // stop checking
    }
  }

  // 2. If a word is selected, try to place it in a blank
  if (selectedWord) {
    for (let i = 0; i < blanks.length; i++) {
      const b = blanks[i];
      if (
        mouseX > b.x &&
        mouseX < b.x + b.w &&
        mouseY > b.y &&
        mouseY < b.y + b.h &&
        !b.word // must be an empty slot
      ) {
        // Attempt placement
        if (checkPlacement(selectedWord.word.text, i)) {
          // Correct placement
          placeWord(selectedWord.word, i);
          feedbackColor = color(0, 200, 0); // Darker green for visibility on the line
          selectedWord = null; // Deselect after successful placement
        } else {
          // Incorrect placement
          feedbackColor = color(200, 0, 0); // Darker red
          // Keep word selected (optional: could deselect here)
        }
        
        // Start feedback timer for the blank
        feedbackBlankIndex = i;
        feedbackTimer = 60; // 1 second @ 60fps
        return false; // stop checking
      }
    }
  }
  // If clicked outside any word or empty blank, deselect the word
  if (selectedWord) {
    selectedWord = null;
  }
}

function mouseReleased() {
  // No action needed here for tap-tap functionality
}

function loadNewSentence() {
  currentSentence = random(sentenceData);
  words = shuffleArray(currentSentence.words.slice());
  wordButtons = [];
  blanks = [];
  selectedWord = null;
  feedbackTimer = 0;
  feedbackBlankIndex = -1;

  // --- 1. Calculate widths for blanks and words ---
  let wordWidths = currentSentence.words.map(word => calculateWordWidth(word));
  
  // Calculate total width of the sentence layout (words + spacing)
  let totalLayoutWidth = 0;
  for (let i = 0; i < wordWidths.length; i++) {
    totalLayoutWidth += wordWidths[i];
    if (i < wordWidths.length - 1) {
      totalLayoutWidth += slotSpacing;
    }
  }

  // Calculate starting X position for centering the layout
  let startX = (width - totalLayoutWidth) / 2;

  // --- 2. Create Blanks ---
  let blankX = startX;
  for (let i = 0; i < currentSentence.words.length; i++) {
    let blankWidth = wordWidths[i];
    blanks.push({
      x: blankX,
      y: yOffsetBlanks,
      w: blankWidth,
      h: wordBoxHeight,
      word: null
    });
    blankX += blankWidth + slotSpacing;
  }

  // --- 3. Create Word Buttons (using shuffled words) ---
  
  // Recalculate widths based on the shuffled order for the button layout
  let shuffledWordWidths = words.map(word => calculateWordWidth(word));
  
  // Calculate total width of the *shuffled* button layout
  let totalButtonLayoutWidth = 0;
  for (let i = 0; i < shuffledWordWidths.length; i++) {
    totalButtonLayoutWidth += shuffledWordWidths[i];
    if (i < shuffledWordWidths.length - 1) {
      totalButtonLayoutWidth += slotSpacing;
    }
  }
  
  // Center the buttons
  let buttonStartX = (width - totalButtonLayoutWidth) / 2;
  
  let buttonX = buttonStartX;
  for (let i = 0; i < words.length; i++) {
    const word = { text: words[i], isPlaced: false };
    let buttonWidth = shuffledWordWidths[i];
    wordButtons.push({
      word: word,
      x: buttonX,
      y: yOffsetWords,
      w: buttonWidth,
      h: wordBoxHeight
    });
    buttonX += buttonWidth + slotSpacing;
  }
}

function checkPlacement(wordText, blankIndex) {
  const correctOrder = currentSentence.words;
  // Find the first *available* blank (not necessarily the current one clicked)
  let firstEmptyBlankIndex = blanks.findIndex((b) => !b.word);

  // Only allow placement if the clicked blank is the next one *and* the word is correct
  return (
    blankIndex === firstEmptyBlankIndex &&
    wordText.toLowerCase() === correctOrder[blankIndex].toLowerCase()
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