/**
 * Naming Words Widget — Interactive SVG Implementation
 * Widget ID: wg154 | Grade 1 | English Language | CBSE
 *
 * Screens:
 *   Screen 1 — Home/Title:     Learn + Practise buttons
 *   Screen 2 — Learn:          Category cards (People/Places/Animals/Things), tap to reveal examples
 *   Screen 3 — Practice:       Magic Picture Builder — tap naming words to colour the scene
 *   Screen 4 — Final Score:    "Amazing Work!" with Play Again
 */

'use strict';

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

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
      boy:  { grey: "run-grey",  color: "run-color"  },
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
const BTN_CENTER_X = [487.31, 753.00, 1018.68, 1284.36, 1550.04, 1815.73];
const BTN_TEXT_Y   = 944.22;

// ─────────────────────────────────────────────────────────────
// GLOBAL STATE
// ─────────────────────────────────────────────────────────────

const WidgetState = {
  currentScreen:      1,      // 1=home | 2=learn | 3=practice | 4=score
  sentenceOrder:      [],     // shuffled index list into SENTENCES
  currentOrderIndex:  0,      // current position within sentenceOrder
  foundNouns:         [],     // nouns found in current sentence
  totalNounsFound:    0,
  flippedCards: {
    people: false,
    place:  false,
    animal: false,
    thing:  false
  }
};

/** Fisher-Yates shuffle of [0..14] into WidgetState.sentenceOrder */
function shuffleSentences() {
  const indices = SENTENCES.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  WidgetState.sentenceOrder     = indices;
  WidgetState.currentOrderIndex = 0;
}

function currentSentenceData() {
  return SENTENCES[WidgetState.sentenceOrder[WidgetState.currentOrderIndex]];
}

// ─────────────────────────────────────────────────────────────
// UI: Cached DOM/SVG element references
// ─────────────────────────────────────────────────────────────

const UI = {};

function initUI() {
  // Screen 1
  UI.learnBtn    = document.getElementById("learn-btn");
  UI.practiseBtn = document.getElementById("Practise-btn");
  UI.character   = document.getElementById("Chatacter");

  // Screen 2 (Learn)
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

  // Screen 3 (Practice)
  UI.iTextPractice     = document.getElementById("i-yext-practice");
  UI.activeBtnPractice = document.getElementById("Active-btn-pactice");
  UI.pictureBg         = document.getElementById("picture-bg");
  UI.pic1Grey          = document.getElementById("pic-1-grey");
  UI.pic2Grey          = document.getElementById("pic-2-grey");
  UI.pic1Colour        = document.getElementById("pic-1-colour");
  UI.pic2Colour        = document.getElementById("pic-2-colour");
  UI.nextPicture       = document.getElementById("next-picture");

  UI.optionsBtns     = [];
  UI.optionsBtnTexts = [];
  for (let i = 1; i <= 6; i++) {
    UI.optionsBtns.push(document.getElementById(`options-btn-${i}`));
    UI.optionsBtnTexts.push(document.getElementById(`options-btn-text-${i}`));
  }

  // Second SVG (scene illustrations)
  UI.scenesSvgLayer = document.getElementById("scenes-svg-layer");
  UI.scenesBg       = document.getElementById("picture-bg");
  UI.scenesInside   = document.getElementById("scenes-inside");
  UI.scenes = [];
  for (let i = 1; i <= 15; i++) {
    UI.scenes.push(document.getElementById(`scene-${i}`));
  }

  // Screen 4 (Score)
  UI.finalScorePopup = document.getElementById("final-score-popup");
  UI.finalScoreTos   = document.getElementById("final-score-tos");
  UI.playAgain       = document.getElementById("play-again");

  // Common
  UI.homeBtn = document.getElementById("home-btn");
}

// ─────────────────────────────────────────────────────────────
// SVG HELPERS
// ─────────────────────────────────────────────────────────────

function show(el) { if (el) el.style.display = ""; }
function hide(el) { if (el) el.style.display = "none"; }

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

const ALL_SVG_ELEMENTS = () => [
  UI.learnBtn, UI.practiseBtn, UI.character,
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
  UI.scenesSvgLayer
];

function hideEverything() {
  ALL_SVG_ELEMENTS().forEach(hide);
  removeAllTicks();
  stopConfetti();
}

function goToScreen1() {
  WidgetState.currentScreen = 1;
  WidgetState.flippedCards  = { people: false, place: false, animal: false, thing: false };
  hideEverything();
  show(UI.learnBtn);
  show(UI.practiseBtn);
  show(UI.character);
}

function goToScreen2() {
  WidgetState.currentScreen = 2;
  WidgetState.flippedCards  = { people: false, place: false, animal: false, thing: false };
  hideEverything();
  show(UI.homeBtn);
  show(UI.practiseBtn);
  show(UI.activeBtnLearn);
  show(UI.iTextLearn);
  show(UI.peopleCard1); hide(UI.peopleCard2);
  show(UI.placeCard1);  hide(UI.placeCard2);
  show(UI.animalCard1); hide(UI.animalCard2);
  show(UI.thingCard1);  hide(UI.thingCard2);
}

function goToScreen3(orderIndex) {
  WidgetState.currentScreen      = 3;
  WidgetState.currentOrderIndex  = (orderIndex !== undefined) ? orderIndex : 0;
  WidgetState.foundNouns         = [];
  hideEverything();
  show(UI.scenesSvgLayer);
  show(UI.scenesBg);
  show(UI.scenesInside);
  show(UI.homeBtn);
  show(UI.activeBtnPractice);
  show(UI.iTextPractice);
  show(UI.pictureBg);
  loadSentence();
}

function goToScreen4() {
  WidgetState.currentScreen = 4;
  hideEverything();
  show(UI.homeBtn);
  show(UI.finalScorePopup);
  show(UI.finalScoreTos);
  show(UI.playAgain);
}

// ─────────────────────────────────────────────────────────────
// PRACTICE: Sentence loading
// ─────────────────────────────────────────────────────────────

function loadSentence() {
  const sentence = currentSentenceData();
  WidgetState.foundNouns = [];
  removeAllTicks();
  stopConfetti();

  // Scene illustration: hide all scenes, show current one (grey state)
  UI.scenes.forEach(hide);
  const sceneEl = document.getElementById(sentence.sceneId);
  if (sceneEl) {
    show(sceneEl);
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

  // Word buttons
  const words = sentence.words;
  for (let i = 0; i < 6; i++) {
    const btn     = UI.optionsBtns[i];
    const btnText = UI.optionsBtnTexts[i];
    if (i < words.length) {
      show(btn);
      show(btnText);
      resetButtonStyle(i);
      setButtonWord(i, words[i]);
    } else {
      hide(btn);
      hide(btnText);
    }
  }

  hide(UI.nextPicture);
}

// ─────────────────────────────────────────────────────────────
// WORD BUTTON: Text & Style Helpers
// ─────────────────────────────────────────────────────────────

function setButtonWord(btnIdx, word) {
  const group  = UI.optionsBtnTexts[btnIdx];
  if (!group) return;
  const textEl = group.querySelector("text");
  if (!textEl) return;

  while (textEl.firstChild) textEl.removeChild(textEl.firstChild);

  const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  tspan.setAttribute("x", "0");
  tspan.setAttribute("y", "0");
  tspan.textContent = word;
  textEl.appendChild(tspan);

  textEl.setAttribute("transform", `translate(${BTN_CENTER_X[btnIdx]} ${BTN_TEXT_Y})`);
  textEl.setAttribute("text-anchor", "middle");
}

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

/** Mark button green (XD correct colour) and add SVG tick overlay */
function markButtonCorrect(btnIdx) {
  const btn = UI.optionsBtns[btnIdx];
  if (!btn) return;
  const rect = btn.querySelector("rect");
  if (rect) {
    rect.setAttribute("fill",   "#7dff66");
    rect.setAttribute("stroke", "#3db82b");
  }
  addCorrectTick(btnIdx);
}

/** Briefly flash red and shake — wrong answer */
function shakeButtonWrong(btnIdx) {
  const btn = UI.optionsBtns[btnIdx];
  if (!btn) return;
  const rect = btn.querySelector("rect");
  if (!rect) return;

  const originalFill = rect.getAttribute("fill") || "#feffe6";
  rect.setAttribute("fill",   "#ffdddd");
  rect.setAttribute("stroke", "#e53935");

  btn.style.animation = "none";
  void btn.offsetWidth;
  btn.style.animation       = "wg154Shake 0.45s ease";
  btn.style.transformBox    = "fill-box";
  btn.style.transformOrigin = "center";

  setTimeout(() => {
    rect.setAttribute("fill",   originalFill);
    rect.setAttribute("stroke", "#fc8bc2");
    btn.style.animation = "";
  }, 460);
}

// ─────────────────────────────────────────────────────────────
// SVG TICK (correct feedback — SVG elements only)
// ─────────────────────────────────────────────────────────────

const SVG_NS = "http://www.w3.org/2000/svg";

function addCorrectTick(btnIdx) {
  const btnGroup = UI.optionsBtns[btnIdx];
  if (!btnGroup) return;

  // Remove any existing tick on this button
  const existing = btnGroup.querySelector(".wg154-tick");
  if (existing) existing.remove();

  const rect = btnGroup.querySelector("rect");
  if (!rect) return;

  const bx = parseFloat(rect.getAttribute("x") || 0);
  const by = parseFloat(rect.getAttribute("y") || 0);
  const bw = parseFloat(rect.getAttribute("width") || 230);

  // Tick group anchored to top-right of the button
  const g  = document.createElementNS(SVG_NS, "g");
  g.classList.add("wg154-tick");

  const cx = bx + bw - 4;
  const cy = by - 4;
  const r  = 24;

  const circle = document.createElementNS(SVG_NS, "circle");
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("r",  r);
  circle.setAttribute("fill",         "#2e7d32");
  circle.setAttribute("stroke",       "#fff");
  circle.setAttribute("stroke-width", "4");

  const text = document.createElementNS(SVG_NS, "text");
  text.setAttribute("x",           cx);
  text.setAttribute("y",           cy + 11);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size",   "30");
  text.setAttribute("fill",        "#fff");
  text.setAttribute("font-family", "Arial, sans-serif");
  text.setAttribute("font-weight", "bold");
  text.textContent = "✓";

  g.appendChild(circle);
  g.appendChild(text);
  btnGroup.appendChild(g);
}

function removeAllTicks() {
  document.querySelectorAll(".wg154-tick").forEach(el => el.remove());
}

// ─────────────────────────────────────────────────────────────
// PRACTICE: Interaction logic
// ─────────────────────────────────────────────────────────────

function handleWordClick(btnIdx) {
  if (WidgetState.currentScreen !== 3) return;

  const sentence   = currentSentenceData();
  const word       = sentence.words[btnIdx];
  const normalized = word.replace(/[.,!?]+$/, "").toLowerCase();

  // Ignore already-correct buttons
  const btn  = UI.optionsBtns[btnIdx];
  const rect = btn && btn.querySelector("rect");
  if (rect && rect.getAttribute("fill") === "#7dff66") return;

  if (sentence.nouns.includes(normalized)) {
    markButtonCorrect(btnIdx);
    revealNoun(sentence, normalized);
    WidgetState.foundNouns.push(normalized);
    WidgetState.totalNounsFound++;

    if (WidgetState.foundNouns.length === sentence.nouns.length) {
      setTimeout(onSentenceComplete, 900);
    }
  } else {
    shakeButtonWrong(btnIdx);
  }
}

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

function onSentenceComplete() {
  launchConfetti();

  const isLast = (WidgetState.currentOrderIndex >= SENTENCES.length - 1);
  if (isLast) {
    setTimeout(goToScreen4, 2200);
  } else {
    show(UI.nextPicture);
  }
}

// ─────────────────────────────────────────────────────────────
// CONFETTI
// ─────────────────────────────────────────────────────────────

let _confettiTimeout = null;

function launchConfetti() {
  stopConfetti();

  const container = document.getElementById("svg-container");
  if (!container) return;

  const wrap = document.createElement("div");
  wrap.id = "wg154-confetti";
  // Positioned over the picture-bg blob area (measured: left=41%, top=31%, right=61%, bottom=66%)
  wrap.style.cssText = [
    "position:absolute",
    "left:41%", "top:31%",
    "width:20%", "height:35%",
    "overflow:hidden",
    "pointer-events:none",
    "z-index:5"
  ].join(";");

  const colors = ["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#ff922b","#cc5de8","#f06595","#fff"];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement("div");
    const color    = colors[i % colors.length];
    const size     = 5 + Math.random() * 7;
    const xStart   = 10 + Math.random() * 80;
    const delay    = Math.random() * 0.6;
    const duration = 1.2 + Math.random() * 1.2;
    const rotation = Math.random() * 360;
    p.style.cssText = [
      "position:absolute",
      `left:${xStart}%`,
      "top:-12px",
      `width:${size}px`,
      `height:${size}px`,
      `background:${color}`,
      `border-radius:${Math.random() > 0.4 ? "50%" : "2px"}`,
      `transform:rotate(${rotation}deg)`,
      `animation:wg154Fall ${duration}s ${delay}s ease-in forwards`
    ].join(";");
    wrap.appendChild(p);
  }

  container.appendChild(wrap);
  _confettiTimeout = setTimeout(stopConfetti, 3200);
}

function stopConfetti() {
  clearTimeout(_confettiTimeout);
  _confettiTimeout = null;
  const el = document.getElementById("wg154-confetti");
  if (el) el.remove();
}

// ─────────────────────────────────────────────────────────────
// LEARN SCREEN: Card flip
// ─────────────────────────────────────────────────────────────

function flipCard(category) {
  const isFlipped = WidgetState.flippedCards[category];
  const card1Key  = `${category}Card1`;
  const card2Key  = `${category}Card2`;

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
  UI.learnBtn.addEventListener("click", () => goToScreen2());

  UI.practiseBtn.addEventListener("click", () => {
    if (WidgetState.currentScreen === 1 || WidgetState.currentScreen === 2) {
      WidgetState.totalNounsFound = 0;
      shuffleSentences();
      goToScreen3(0);
    }
  });

  UI.homeBtn.addEventListener("click", () => goToScreen1());

  UI.nextPicture.addEventListener("click", () => {
    goToScreen3(WidgetState.currentOrderIndex + 1);
  });

  UI.playAgain.addEventListener("click", () => {
    WidgetState.totalNounsFound = 0;
    shuffleSentences();
    goToScreen3(0);
  });

  for (let i = 0; i < 6; i++) {
    (function(idx) {
      UI.optionsBtns[idx].addEventListener("click",     () => handleWordClick(idx));
      UI.optionsBtnTexts[idx].addEventListener("click", () => handleWordClick(idx));
    })(i);
  }

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
// CSS INJECTION
// ─────────────────────────────────────────────────────────────

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes wg154Shake {
      0%   { transform: translateX(0); }
      20%  { transform: translateX(-8px); }
      40%  { transform: translateX(8px); }
      60%  { transform: translateX(-8px); }
      80%  { transform: translateX(8px); }
      100% { transform: translateX(0); }
    }

    @keyframes wg154Fall {
      0%   { transform: translateY(0) rotate(0deg);    opacity: 1; }
      80%  { opacity: 1; }
      100% { transform: translateY(220px) rotate(540deg); opacity: 0; }
    }

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

    /* Container for both SVGs */
    #svg-container {
      position: relative;
    }
    #svg-container > svg:first-child {
      position: relative;
      z-index: 2;
    }

    /*
     * Second SVG (scene illustrations) sits BEHIND the first SVG (z-index:2).
     *
     * Because the second SVG has a different aspect ratio (1141×755) than the
     * first (2214×1275), its rendered content lands at a different scale and
     * position than the picture-bg placeholder frame in the first SVG.
     *
     * Measured at runtime (container 2165×1277px):
     *   scenes-bg  (second SVG): L=34.1%  T=16.9%  R=69.0%  B=77.8%
     *   picture-bg (first  SVG): L=40.6%  T=31.2%  R=60.8%  B=66.4%
     *
     * Required scale  = picture-bg.W / scenes-bg.W = 20.2 / 34.9 = 0.578
     * Required tx     = picture-bg.L - scenes-bg.L × scale
     *                 = 40.6 - 34.1×0.578 = 20.87%  (% of element width)
     * Required ty     = picture-bg.T - scenes-bg.T × scale
     *                 = 31.2 - 16.9×0.578 = 21.43%  (% of element height)
     *
     * This keeps the scenes below the instruction text (ends at 29.2%) and
     * above the option buttons (start at 69.4%).
     */
    #svg-container > svg:nth-child(2) {
      position: absolute;
      top: 0; left: 0;
      width: 100% !important;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      transform-origin: 0 0;
      transform: translate(20.87%, 21.43%) scale(0.578);
    }

    /* Confetti container */
    #wg154-confetti {
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
  shuffleSentences();
  goToScreen1();
});
