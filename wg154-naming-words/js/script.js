/**
 * Naming Words Widget — Interactive SVG Implementation
 * Widget ID: wg154 | Grade 1 | English Language | CBSE
 *
 * Screens:
 *   Screen 1 — Home/Title:     Learn + Practise buttons
 *   Screen 2 — Learn:          Category cards (People/Places/Animals/Things), tap to reveal examples
 *   Screen 3 — Practice:       Magic Picture Builder — tap naming words to colour the scene
 *   Screen 4 — Final Score:    "Amazing Work!" with Play Again
 *
 * Architecture:
 *   WidgetState  — single global object tracking all mutable state
 *   UI           — cached DOM/SVG element references
 *   goToScreen*  — screen-transition functions (show/hide SVG groups)
 *   loadSentence — populates word buttons for the current sentence
 *   handleWordClick — processes correct/wrong noun tap
 */

'use strict';

// ─────────────────────────────────────────────────────────────
// DATA: Practice sentences, nouns, and SVG element mappings
// ─────────────────────────────────────────────────────────────

/**
 * Each sentence object defines:
 *   words   — array of word strings shown as buttons (max 6)
 *   nouns   — array of noun strings (normalised, no punctuation)
 *   svgMap  — maps each noun to its { grey, color } SVG element IDs
 *   sceneId — wrapper group ID in the second SVG
 */
const SENTENCES = [
  {
    words:   ["A", "cat", "sits", "on", "a", "mat."],
    nouns:   ["cat", "mat"],
    svgMap:  {
      cat:  { grey: "cat-grey",   color: "cat-color"   },
      mat:  { grey: "mat-grey",   color: "mat-color"   }
    },
    sceneId: "scene-1"
  },
  {
    words:   ["The", "dog", "plays", "with", "a", "ball."],
    nouns:   ["dog", "ball"],
    svgMap:  {
      dog:  { grey: "dog-grey",   color: "dog-color"   },
      ball: { grey: "ball-grey",  color: "ball-color"  }
    },
    sceneId: "scene-2"
  },
  {
    words:   ["The", "boy", "eats", "a", "mango."],
    nouns:   ["boy", "mango"],
    svgMap:  {
      boy:   { grey: "boy-grey",   color: "boy-color"   },
      mango: { grey: "mango-grey", color: "mango-color" }
    },
    sceneId: "scene-3"
  },
  {
    words:   ["The", "teacher", "stands", "in", "the", "classroom."],
    nouns:   ["teacher", "classroom"],
    svgMap:  {
      teacher:   { grey: "teacher-grey",   color: "teacher-colour"   },
      classroom: { grey: "classroom-grey", color: "classroom-colour" }
    },
    sceneId: "scene-4"
  },
  {
    words:   ["The", "baby", "holds", "a", "cup."],
    nouns:   ["baby", "cup"],
    svgMap:  {
      baby: { grey: "baby-grey", color: "baby-color" },
      cup:  { grey: "cup-grey",  color: "cup-color"  }
    },
    sceneId: "scene-5"
  },
  {
    words:   ["The", "fish", "swims", "in", "the", "pond."],
    nouns:   ["fish", "pond"],
    svgMap:  {
      fish: { grey: "fish-grey", color: "fish-color"  },
      pond: { grey: "Pond-grey", color: "Pond-color"  }
    },
    sceneId: "scene-6"
  },
  {
    words:   ["The", "girl", "reads", "a", "book."],
    nouns:   ["girl", "book"],
    svgMap:  {
      girl: { grey: "girl-grey",  color: ["girl1-color", "girl2-color"] },
      book: { grey: "book-grey",  color: "book-color"  }
    },
    sceneId: "scene-7"
  },
  {
    words:   ["The", "cow", "eats", "grass."],
    nouns:   ["cow", "grass"],
    svgMap:  {
      cow:   { grey: "cow-grey",   color: "cow-color"   },
      grass: { grey: "grass-grey", color: "grass-color" }
    },
    sceneId: "scene-8"
  },
  {
    words:   ["A", "boy", "runs", "to", "the", "park."],
    nouns:   ["boy", "park"],
    svgMap:  {
      boy:  { grey: "run-grey",  color: "run-color"  },   // running boy illustration
      park: { grey: "park-grey", color: "park-color" }
    },
    sceneId: "scene-9"
  },
  {
    words:   ["The", "bird", "sits", "in", "the", "nest."],
    nouns:   ["bird", "nest"],
    svgMap:  {
      bird: { grey: "bird-grey", color: "bird-color" },
      nest: { grey: "nest-grey", color: "nest-color" }
    },
    sceneId: "scene-10"
  },
  {
    words:   ["A", "frog", "jumps", "into", "the", "lake."],
    nouns:   ["frog", "lake"],
    svgMap:  {
      frog: { grey: "Frog-grey", color: "frog-color" },
      lake: { grey: "lake-grey", color: "lake-color" }
    },
    sceneId: "scene-11"
  },
  {
    words:   ["The", "farmer", "works", "in", "the", "field."],
    nouns:   ["farmer", "field"],
    svgMap:  {
      farmer: { grey: "Farmer-grey", color: "Farmer-color" },
      field:  { grey: "Farm-grey",   color: "Farm-color"   }
    },
    sceneId: "scene-12"
  },
  {
    words:   ["A", "hen", "sits", "on", "the", "roof."],
    nouns:   ["hen", "roof"],
    svgMap:  {
      hen:  { grey: "hen-grey",  color: "hen-color"  },
      roof: { grey: "roof-grey", color: "roof-color" }
    },
    sceneId: "scene-13"
  },
  {
    words:   ["The", "king", "sits", "on", "a", "throne."],
    nouns:   ["king", "throne"],
    svgMap:  {
      king:   { grey: "king-grey",   color: "king-color"   },
      throne: { grey: "throne-grey", color: "throne-color" }
    },
    sceneId: "scene-14"
  },
  {
    words:   ["A", "girl", "draws", "on", "the", "board."],
    nouns:   ["girl", "board"],
    svgMap:  {
      girl:  { grey: "girl3-grey",  color: "girl3-color"  },
      board: { grey: "board-grey",  color: "board-color"  }
    },
    sceneId: "scene-15"
  }
];

// Pre-computed horizontal centre of each word button rect (in first-SVG coordinates)
// Buttons span: 372.31→602, 638→868, 903.68→1133.68, 1169.36→1399.36, 1435.04→1665.04, 1700.73→1930.73
const BTN_CENTER_X = [487.31, 753.00, 1018.68, 1284.36, 1550.04, 1815.73];
const BTN_TEXT_Y   = 944.22;  // vertical baseline shared by all word buttons

// ─────────────────────────────────────────────────────────────
// GLOBAL STATE
// ─────────────────────────────────────────────────────────────

const WidgetState = {
  currentScreen:        1,     // 1=home | 2=learn | 3=practice | 4=score
  currentSentenceIndex: 0,     // 0-14
  foundNouns:           [],    // nouns found in the current sentence
  totalNounsFound:      0,     // cumulative across all sentences
  flippedCards: {              // learn-screen card flip state
    people: false,
    place:  false,
    animal: false,
    thing:  false
  }
};

// ─────────────────────────────────────────────────────────────
// UI: Cached DOM/SVG element references
// ─────────────────────────────────────────────────────────────

const UI = {};

function initUI() {
  // ── Screen 1 ──────────────────────────────────────────────
  UI.learnBtn    = document.getElementById("learn-btn");
  UI.practiseBtn = document.getElementById("Practise-btn");

  // ── Screen 2 (Learn) ──────────────────────────────────────
  UI.iTextLearn     = document.getElementById("i-yext-learn");
  UI.activeBtnLearn = document.getElementById("Active-btn-learn");
  UI.peopleCard1    = document.getElementById("people-card-1");
  UI.peopleCard2    = document.getElementById("people-card-2");
  UI.placeCard1     = document.getElementById("place-card-1");
  UI.placeCard2     = document.getElementById("place-card-2");
  UI.animalCard1    = document.getElementById("animal-card-1");
  UI.animalCard2    = document.getElementById("animal-card-2");
  UI.thingCard1     = document.getElementById("thimg-card-1");
  UI.thingCard2     = document.getElementById("thimg-card-2");

  // ── Screen 3 (Practice) ───────────────────────────────────
  UI.iTextPractice     = document.getElementById("i-yext-practice");
  UI.activeBtnPractice = document.getElementById("Active-btn-pactice");
  UI.pictureBg         = document.getElementById("picture-bg");
  UI.pic1Grey          = document.getElementById("pic-1-grey");
  UI.pic2Grey          = document.getElementById("pic-2-grey");
  UI.pic1Colour        = document.getElementById("pic-1-colour");
  UI.pic2Colour        = document.getElementById("pic-2-colour");
  UI.nextPicture       = document.getElementById("next-picture");

  // Word buttons (6 pairs of background + text groups)
  UI.optionsBtns      = [];
  UI.optionsBtnTexts  = [];
  for (let i = 1; i <= 6; i++) {
    UI.optionsBtns.push(document.getElementById(`options-btn-${i}`));
    UI.optionsBtnTexts.push(document.getElementById(`options-btn-text-${i}`));
  }

  // ── Second SVG (practice scene illustrations) ─────────────
  UI.scenesSvgLayer = document.getElementById("scenes-svg-layer");
  UI.scenesBg       = document.getElementById("scenes-bg");
  UI.scenesInside   = document.getElementById("scenes-inside");
  UI.scenes = [];
  for (let i = 1; i <= 15; i++) {
    UI.scenes.push(document.getElementById(`scene-${i}`));
  }

  // ── Screen 4 (Score) ──────────────────────────────────────
  UI.finalScorePopup = document.getElementById("final-score-popup");
  UI.finalScoreTos   = document.getElementById("final-score-tos");
  UI.playAgain       = document.getElementById("play-again");

  // ── Common ────────────────────────────────────────────────
  UI.homeBtn = document.getElementById("home-btn");

  // HTML feedback overlay (created dynamically)
  createFeedbackOverlay();
}

// ─────────────────────────────────────────────────────────────
// FEEDBACK OVERLAY
// ─────────────────────────────────────────────────────────────

function createFeedbackOverlay() {
  const el = document.createElement("div");
  el.id = "wg154-feedback";
  el.style.cssText = [
    "position:absolute",
    "left:55%",
    "bottom:13%",
    "transform:translateX(-50%)",
    "max-width:44%",
    "padding:10px 22px",
    "border-radius:16px",
    "font-family:Roboto,sans-serif",
    "font-size:clamp(13px,1.6vw,20px)",
    "font-weight:700",
    "text-align:center",
    "line-height:1.4",
    "pointer-events:none",
    "z-index:200",
    "opacity:0",
    "transition:opacity 0.25s ease",
    "box-shadow:0 3px 12px rgba(0,0,0,0.18)"
  ].join(";");
  document.getElementById("svg-container").appendChild(el);
  UI.feedbackEl = el;
}

function showFeedback(message, isCorrect) {
  const el = UI.feedbackEl;
  el.textContent = message;
  if (isCorrect) {
    el.style.background = "#e8f9e8";
    el.style.color       = "#1a6b1a";
    el.style.border      = "2px solid #4caf50";
  } else {
    el.style.background = "#fff8e1";
    el.style.color       = "#7a5000";
    el.style.border      = "2px solid #ffc107";
  }
  el.style.opacity = "1";
  clearTimeout(UI._fbTimer);
  UI._fbTimer = setTimeout(() => { el.style.opacity = "0"; }, 2500);
}

function hideFeedback() {
  clearTimeout(UI._fbTimer);
  if (UI.feedbackEl) UI.feedbackEl.style.opacity = "0";
}

// ─────────────────────────────────────────────────────────────
// SVG ELEMENT HELPERS
// ─────────────────────────────────────────────────────────────

function show(el) { if (el) el.style.display = ""; }
function hide(el) { if (el) el.style.display = "none"; }

/** Show/hide an SVG element by its string ID */
function showById(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "";
}
function hideById(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

// ─────────────────────────────────────────────────────────────
// SCREEN TRANSITIONS
// ─────────────────────────────────────────────────────────────

/** All first-SVG interactive elements, for easy bulk-hide */
const ALL_SVG_ELEMENTS = () => [
  UI.learnBtn, UI.practiseBtn,
  UI.iTextLearn, UI.activeBtnLearn,
  UI.peopleCard1, UI.peopleCard2,
  UI.placeCard1,  UI.placeCard2,
  UI.animalCard1, UI.animalCard2,
  UI.thingCard1,  UI.thingCard2,
  UI.iTextPractice, UI.activeBtnPractice,
  UI.pictureBg, UI.pic1Grey, UI.pic2Grey, UI.pic1Colour, UI.pic2Colour,
  UI.nextPicture,
  UI.finalScorePopup, UI.finalScoreTos, UI.playAgain,
  UI.homeBtn,
  ...UI.optionsBtns,
  ...UI.optionsBtnTexts,
  // Second SVG root
  UI.scenesSvgLayer
];

function hideEverything() {
  ALL_SVG_ELEMENTS().forEach(hide);
}

/** Screen 1 — Home/Title */
function goToScreen1() {
  WidgetState.currentScreen = 1;
  WidgetState.flippedCards  = { people: false, place: false, animal: false, thing: false };

  hideEverything();
  show(UI.learnBtn);
  show(UI.practiseBtn);
  hideFeedback();
}

/** Screen 2 — Learn (category cards) */
function goToScreen2() {
  WidgetState.currentScreen = 2;
  WidgetState.flippedCards  = { people: false, place: false, animal: false, thing: false };

  hideEverything();
  // Navigation
  show(UI.homeBtn);
  show(UI.practiseBtn);
  show(UI.activeBtnLearn);
  // Content
  show(UI.iTextLearn);
  // Show card fronts only
  show(UI.peopleCard1); hide(UI.peopleCard2);
  show(UI.placeCard1);  hide(UI.placeCard2);
  show(UI.animalCard1); hide(UI.animalCard2);
  show(UI.thingCard1);  hide(UI.thingCard2);

  hideFeedback();
}

/** Screen 3 — Practice (Magic Picture Builder) */
function goToScreen3(sentenceIndex) {
  WidgetState.currentScreen        = 3;
  WidgetState.currentSentenceIndex = (sentenceIndex !== undefined) ? sentenceIndex : 0;
  WidgetState.foundNouns           = [];

  hideEverything();
  // Show second SVG layer
  show(UI.scenesSvgLayer);
  show(UI.scenesBg);
  show(UI.scenesInside);
  // Navigation & chrome
  show(UI.homeBtn);
  show(UI.activeBtnPractice);
  // Practice area chrome
  show(UI.iTextPractice);
  show(UI.pictureBg);

  loadSentence(WidgetState.currentSentenceIndex);
}

/** Screen 4 — Final Score */
function goToScreen4() {
  WidgetState.currentScreen = 4;

  hideEverything();
  show(UI.homeBtn);
  show(UI.finalScorePopup);
  show(UI.finalScoreTos);
  show(UI.playAgain);
  hideFeedback();
}

// ─────────────────────────────────────────────────────────────
// PRACTICE: Sentence loading
// ─────────────────────────────────────────────────────────────

function loadSentence(index) {
  const sentence = SENTENCES[index];
  WidgetState.foundNouns = [];

  // ── Scene illustration ────────────────────────────────────
  // Hide all scenes, then show only the current one
  UI.scenes.forEach(hide);
  const sceneEl = document.getElementById(sentence.sceneId);
  if (sceneEl) {
    show(sceneEl);
    // Within the scene: show grey nouns, hide colour nouns
    sentence.nouns.forEach(noun => {
      const map = sentence.svgMap[noun];
      showById(map.grey);
      if (Array.isArray(map.color)) {
        map.color.forEach(hideById);
      } else {
        hideById(map.color);
      }
    });
  }

  // ── Word buttons ──────────────────────────────────────────
  const words = sentence.words;
  for (let i = 0; i < 6; i++) {
    const btn     = UI.optionsBtns[i];
    const btnText = UI.optionsBtnTexts[i];
    if (i < words.length) {
      show(btn);
      show(btnText);
      resetButtonStyle(i);          // clear any previous correct/wrong state
      setButtonWord(i, words[i]);   // update the text label
    } else {
      hide(btn);
      hide(btnText);
    }
  }

  hide(UI.nextPicture);
  hideFeedback();
}

// ─────────────────────────────────────────────────────────────
// WORD BUTTON: Text & Style Helpers
// ─────────────────────────────────────────────────────────────

/** Update the SVG text inside options-btn-text-N to display `word`, centred */
function setButtonWord(btnIdx, word) {
  const group   = UI.optionsBtnTexts[btnIdx];
  if (!group) return;
  const textEl  = group.querySelector("text");
  if (!textEl) return;

  // Remove all existing tspan children
  while (textEl.firstChild) textEl.removeChild(textEl.firstChild);

  // Create a single centred tspan
  const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  tspan.setAttribute("x", "0");
  tspan.setAttribute("y", "0");
  tspan.textContent = word;
  textEl.appendChild(tspan);

  // Centre the text horizontally within the button
  textEl.setAttribute("transform", `translate(${BTN_CENTER_X[btnIdx]} ${BTN_TEXT_Y})`);
  textEl.setAttribute("text-anchor", "middle");
}

/** Reset button rect to default (cream / pink border) state */
function resetButtonStyle(btnIdx) {
  const btn = UI.optionsBtns[btnIdx];
  if (!btn) return;
  const rect = btn.querySelector("rect");
  if (rect) {
    rect.setAttribute("fill",   "#feffe6");
    rect.setAttribute("stroke", "#fc8bc2");
  }
  btn.style.animation = "";
}

/** Mark a word button green — correct answer */
function markButtonCorrect(btnIdx) {
  const btn = UI.optionsBtns[btnIdx];
  if (!btn) return;
  const rect = btn.querySelector("rect");
  if (rect) {
    rect.setAttribute("fill",   "#4caf50");
    rect.setAttribute("stroke", "#2e7d32");
  }
}

/** Shake a word button red briefly — wrong answer */
function shakeButtonWrong(btnIdx) {
  const btn = UI.optionsBtns[btnIdx];
  if (!btn) return;
  const rect = btn.querySelector("rect");
  if (!rect) return;

  const originalFill = rect.getAttribute("fill") || "#feffe6";
  rect.setAttribute("fill",   "#ffdddd");
  rect.setAttribute("stroke", "#e53935");

  // Trigger CSS shake animation
  btn.style.animation = "none";
  // Force reflow so the animation restarts cleanly
  void btn.offsetWidth;
  btn.style.animation          = "wg154Shake 0.4s ease";
  btn.style.transformBox       = "fill-box";
  btn.style.transformOrigin    = "center";

  setTimeout(() => {
    rect.setAttribute("fill",   originalFill);
    rect.setAttribute("stroke", "#fc8bc2");
    btn.style.animation = "";
  }, 420);
}

// ─────────────────────────────────────────────────────────────
// PRACTICE: Interaction logic
// ─────────────────────────────────────────────────────────────

function handleWordClick(btnIdx) {
  if (WidgetState.currentScreen !== 3) return;

  const sentence = SENTENCES[WidgetState.currentSentenceIndex];
  const word     = sentence.words[btnIdx];

  // Normalise: strip trailing punctuation, lowercase
  const normalized = word.replace(/[.,!?]+$/, "").toLowerCase();

  // Ignore clicks on already-correct buttons
  const btn  = UI.optionsBtns[btnIdx];
  const rect = btn && btn.querySelector("rect");
  if (rect && rect.getAttribute("fill") === "#4caf50") return;

  if (sentence.nouns.includes(normalized)) {
    // ── Correct ───────────────────────────────────────────
    markButtonCorrect(btnIdx);
    revealNoun(sentence, normalized);
    WidgetState.foundNouns.push(normalized);
    WidgetState.totalNounsFound++;
    showFeedback(`✨ Wonderful! "${normalized}" is a naming word!`, true);

    // Check if all nouns for this sentence have been found
    if (WidgetState.foundNouns.length === sentence.nouns.length) {
      setTimeout(onSentenceComplete, 900);
    }
  } else {
    // ── Wrong ─────────────────────────────────────────────
    shakeButtonWrong(btnIdx);
    showFeedback(`Try again! "${normalized}" is not a naming word.`, false);
  }
}

/** Swap grey noun illustration → colour version */
function revealNoun(sentence, noun) {
  const map = sentence.svgMap[noun];
  if (!map) return;
  hideById(map.grey);
  if (Array.isArray(map.color)) {
    map.color.forEach(showById);
  } else {
    showById(map.color);
  }
}

/** Called when all nouns in the current sentence are found */
function onSentenceComplete() {
  hideFeedback();
  showFeedback("🎉 Picture Complete!", true);

  const isLastSentence = (WidgetState.currentSentenceIndex >= SENTENCES.length - 1);
  if (isLastSentence) {
    // All 15 sentences done → final score screen
    setTimeout(goToScreen4, 1600);
  } else {
    // Show "Next Picture" button
    show(UI.nextPicture);
  }
}

// ─────────────────────────────────────────────────────────────
// LEARN SCREEN: Card flip
// ─────────────────────────────────────────────────────────────

function flipCard(category) {
  const isFlipped = WidgetState.flippedCards[category];
  // Map category names to UI keys
  const card1Key = `${category}Card1`;
  const card2Key = `${category}Card2`;

  if (isFlipped) {
    show(UI[card1Key]);
    hide(UI[card2Key]);
  } else {
    hide(UI[card1Key]);
    show(UI[card2Key]);
  }
  WidgetState.flippedCards[category] = !isFlipped;
}

// ─────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

function attachEventListeners() {
  // ── Screen 1 ────────────────────────────────────────────
  UI.learnBtn.addEventListener("click", () => goToScreen2());
  // Practise button on screen 1 OR screen 2 → start practice from sentence 0
  UI.practiseBtn.addEventListener("click", () => {
    if (WidgetState.currentScreen === 1 || WidgetState.currentScreen === 2) {
      WidgetState.totalNounsFound = 0;
      goToScreen3(0);
    }
  });

  // ── Common: Home button ──────────────────────────────────
  UI.homeBtn.addEventListener("click", () => goToScreen1());

  // ── Screen 3: Next Picture ───────────────────────────────
  UI.nextPicture.addEventListener("click", () => {
    goToScreen3(WidgetState.currentSentenceIndex + 1);
  });

  // ── Screen 4: Play Again ─────────────────────────────────
  UI.playAgain.addEventListener("click", () => {
    WidgetState.totalNounsFound = 0;
    goToScreen3(0);
  });

  // ── Screen 3: Word buttons (btn group + text group both clickable) ──
  for (let i = 0; i < 6; i++) {
    (function(idx) {
      UI.optionsBtns[idx].addEventListener("click",     () => handleWordClick(idx));
      UI.optionsBtnTexts[idx].addEventListener("click", () => handleWordClick(idx));
    })(i);
  }

  // ── Screen 2: Category card flip ────────────────────────
  UI.peopleCard1.addEventListener("click", () => flipCard("people"));
  UI.peopleCard2.addEventListener("click", () => flipCard("people"));
  UI.placeCard1.addEventListener("click",  () => flipCard("place"));
  UI.placeCard2.addEventListener("click",  () => flipCard("place"));
  UI.animalCard1.addEventListener("click", () => flipCard("animal"));
  UI.animalCard2.addEventListener("click", () => flipCard("animal"));
  UI.thingCard1.addEventListener("click",  () => flipCard("thing"));
  UI.thingCard2.addEventListener("click",  () => flipCard("thing"));
}

// ─────────────────────────────────────────────────────────────
// CSS INJECTION — shake animation + cursor + SVG overlay
// ─────────────────────────────────────────────────────────────

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    /* Shake animation for wrong-answer word buttons */
    @keyframes wg154Shake {
      0%   { transform: translateX(0); }
      20%  { transform: translateX(-7px); }
      40%  { transform: translateX(7px); }
      60%  { transform: translateX(-7px); }
      80%  { transform: translateX(7px); }
      100% { transform: translateX(0); }
    }

    /* Clickable cursor on all interactive SVG groups */
    #learn-btn, #Practise-btn, #home-btn,
    #play-again, #next-picture,
    #people-card-1, #people-card-2,
    #place-card-1,  #place-card-2,
    #animal-card-1, #animal-card-2,
    #thimg-card-1,  #thimg-card-2,
    #options-btn-1, #options-btn-2, #options-btn-3,
    #options-btn-4, #options-btn-5, #options-btn-6,
    #options-btn-text-1, #options-btn-text-2, #options-btn-text-3,
    #options-btn-text-4, #options-btn-text-5, #options-btn-text-6 {
      cursor: pointer;
    }

    /* Stack the two SVGs on top of each other inside svg-container */
    #svg-container {
      position: relative;
    }
    #svg-container > svg:first-child {
      position: relative;
      z-index: 1;
    }
    /* Second SVG (scene illustrations) overlays the first; no pointer-events */
    #svg-container > svg:nth-child(2) {
      position: absolute;
      top: 0; left: 0;
      width: 100% !important;
      height: 100%;
      z-index: 2;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  initUI();
  attachEventListeners();
  // Start at Screen 1 (hide everything except Learn + Practise)
  goToScreen1();
});
