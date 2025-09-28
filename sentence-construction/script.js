
let words = [];
let blanks = [];
let selectedWord = null;
let currentSentence = null;
let wordButtons = [];
let feedbackTimer = 0;
let feedbackColor;

// Global settings
const wordBoxWidth = 100;
const wordBoxHeight = 50;
const padding = 10;
const yOffsetWords = 250;
const yOffsetBlanks = 100;
const slotSpacing = 10;

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
  loadNewSentence();
}

function draw() {
  background(255);

  // Sentence container
  fill(240);
  stroke(0);
  rectMode(CORNER);
  rect(50, 50, width - 100, 100, 15);

  drawBlanks();
  drawWordButtons();

  // Draw selected word following the mouse
  if (selectedWord) {
    drawWord(selectedWord.word.text, mouseX, mouseY, 0);
  }

  // Feedback color overlay
  if (feedbackTimer > 0) {
    let alpha = map(feedbackTimer, 0, 60, 255, 0);
    fill(feedbackColor, alpha);
    rect(50, 50, width - 100, 100, 15);
    feedbackTimer--;
  }
}

function drawBlanks() {
  for (let i = 0; i < blanks.length; i++) {
    const b = blanks[i];
    stroke(0);
    strokeWeight(2);
    line(b.x, b.y + b.h / 2, b.x + b.w, b.y + b.h / 2);

    if (b.word) {
      drawWord(b.word.text, b.x + b.w / 2, b.y + b.h / 2, 0);
    }
  }
}

function drawWordButtons() {
  for (let i = 0; i < wordButtons.length; i++) {
    const w = wordButtons[i];
    if (!w.word.isPlaced) {
      fill(135, 206, 250);
      stroke(0);
      rect(w.x, w.y, w.w, w.h, 5);
      drawWord(w.word.text, w.x + w.w / 2, w.y + w.h / 2, 0);
    }
  }
}

function drawWord(wordText, x, y, textColor) {
  fill(textColor);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  text(wordText, x, y);
}

function mousePressed() {
  // pick a word
  for (let i = 0; i < wordButtons.length; i++) {
    const w = wordButtons[i];
    if (
      mouseX > w.x &&
      mouseX < w.x + w.w &&
      mouseY > w.y &&
      mouseY < w.y + w.h
    ) {
      if (!w.word.isPlaced) {
        selectedWord = w;
        return false;
      }
    }
  }
}

function mouseReleased() {
  if (selectedWord) {
    let placed = false;

    // try to drop on a blank
    for (let i = 0; i < blanks.length; i++) {
      const b = blanks[i];
      if (
        mouseX > b.x &&
        mouseX < b.x + b.w &&
        mouseY > b.y &&
        mouseY < b.y + b.h &&
        !b.word
      ) {
        if (checkPlacement(selectedWord.word.text, i)) {
          placeWord(selectedWord.word, i);
          feedbackColor = color(0, 255, 0);
          feedbackTimer = 60;
        } else {
          feedbackColor = color(255, 0, 0);
          feedbackTimer = 60;
        }
        placed = true;
        break;
      }
    }

    // if not placed, return word to pool
    if (!placed) {
      selectedWord = null;
    } else {
      selectedWord = null;
    }
  }
}

function loadNewSentence() {
  currentSentence = random(sentenceData);
  words = shuffleArray(currentSentence.words.slice());
  wordButtons = [];
  blanks = [];

  // ----- blanks -----
  let totalBlanksWidth =
    currentSentence.words.length * wordBoxWidth +
    (currentSentence.words.length - 1) * slotSpacing;
  let startX = (width - totalBlanksWidth) / 2;

  for (let i = 0; i < currentSentence.words.length; i++) {
    let blankWidth = currentSentence.words[i] === "." ? 50 : wordBoxWidth;
    blanks.push({
      x: startX + i * (wordBoxWidth + slotSpacing),
      y: yOffsetBlanks,
      w: blankWidth,
      h: wordBoxHeight,
      word: null
    });
  }

  // ----- word buttons (fit in same rect range as blanks) -----
  let buttonX = startX;
  for (let i = 0; i < words.length; i++) {
    const word = { text: words[i], isPlaced: false };
    let buttonWidth = words[i] === "." ? 50 : wordBoxWidth;
    wordButtons.push({
      word: word,
      x: buttonX,
      y: yOffsetWords,
      w: buttonWidth,
      h: wordBoxHeight
    });
    buttonX += buttonWidth + slotSpacing;
  }
  console.log(blanks);
}

function checkPlacement(wordText, blankIndex) {
  const correctOrder = currentSentence.words;
  let firstEmptyBlankIndex = blanks.findIndex((b) => !b.word);
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

