/* WG119 – The Rhyme Zone
   UI logic: pairs matching between leaves and butterflies
   - 15 seconds per pair
   - 10 pairs per full round
   - One pair active at a time + distractors (5 words total per side)
   - Specific fail/attempt logic: Try again, Hint, Show Answer
*/

const TOTAL_TIME = 15;

const WidgetState = {
  score: 0,
  progress: 0,
  currentPair: null,
  currentAttempt: 0, 
  timer: null,
  timeLeft: TOTAL_TIME,
  maxPairs: 10,

  allPairs: [
    { leaf: "bright", butterfly: "night", leafDistractors: ["built", "nest", "tap", "fair"], butterflyDistractors: ["nice", "drank", "drawer", "flour"] },
    { leaf: "fair", butterfly: "share", leafDistractors: ["brick", "drip", "forest", "mother"], butterflyDistractors: ["grade", "motor", "foot", "orange"] },
    { leaf: "drip", butterfly: "trip", leafDistractors: ["moment", "cry", "fully", "monkey"], butterflyDistractors: ["lion", "crib", "leg", "red"] },
    { leaf: "leg", butterfly: "peg", leafDistractors: ["gnat", "neck", "eyes", "fly"], butterflyDistractors: ["feet", "hands", "rose", "lily"] },
    { leaf: "fly", butterfly: "sly", leafDistractors: ["heavy", "tall", "sad", "kitten"], butterflyDistractors: ["fox", "hen", "happy", "story"] },
    { leaf: "kitten", butterfly: "mitten", leafDistractors: ["kennel", "hungry", "humble"], butterflyDistractors: ["helpful", "statue", "dream"] },
    { leaf: "dream", butterfly: "stream", leafDistractors: ["hollow", "stomach", "struggle", "balloon"], butterflyDistractors: ["power", "monster", "garden", "fitted"] },
    { leaf: "balloon", butterfly: "moon", leafDistractors: ["kettle", "kicking", "hungry", "stamp"], butterflyDistractors: ["stubborn", "follow", "drive", "built"] },
    { leaf: "stamp", butterfly: "lamp", leafDistractors: ["power", "hollow", "tall", "angry"], butterflyDistractors: ["hands", "orange", "tiger", "hen"] },
    { leaf: "power", butterfly: "flower", leafDistractors: ["butter", "flute", "kitchen", "room"], butterflyDistractors: ["bread", "drank", "nice", "lion"] },
    { leaf: "butter", butterfly: "mutter", leafDistractors: ["bumpy", "bright", "follow", "dress"], butterflyDistractors: ["bring", "drive", "shoulder", "red"] },
    { leaf: "follow", butterfly: "hollow", leafDistractors: ["angry", "horse", "story", "stubborn"], butterflyDistractors: ["humble", "monkey", "fussy", "sad"] },
    { leaf: "humble", butterfly: "mumble", leafDistractors: ["goggle", "morning", "fancy", "flour"], butterflyDistractors: ["gentle", "drum", "dress", "funny"] },
    { leaf: "dress", butterfly: "mess", leafDistractors: ["days", "brought", "peep", "fuss"], butterflyDistractors: ["forest", "mountain", "bundle", "kicking"] },
    { leaf: "mountain", butterfly: "stain", leafDistractors: ["butter", "trouble", "hump", "kind"], butterflyDistractors: ["peace", "yard", "home", "gentle"] },
    { leaf: "trouble", butterfly: "bubble", leafDistractors: ["bundle", "brittle", "flowy", "face"], butterflyDistractors: ["goat", "punch", "humble", "short"] },
    { leaf: "goat", butterfly: "moat", leafDistractors: ["sunny", "brought", "sad", "joy"], butterflyDistractors: ["rub", "lamp", "crouch", "fussy"] },
    { leaf: "sunny", butterfly: "funny", leafDistractors: ["pitch", "celebrate", "monkey", "robber"], butterflyDistractors: ["simple", "power", "night", "glance"] },
    { leaf: "glance", butterfly: "dance", leafDistractors: ["fort", "octopus", "rough", "tinkling"], butterflyDistractors: ["rubber", "bumpy", "gentle", "great"] },
    { leaf: "tinkling", butterfly: "sprinkling", leafDistractors: ["parrot", "glance", "bread", "trouble"], butterflyDistractors: ["butter", "melting", "truly", "fangs"] },
    { leaf: "parrot", butterfly: "carrot", leafDistractors: ["animal", "picture", "game", "hiding"], butterflyDistractors: ["shuffle", "great", "flip", "light"] },
    { leaf: "flip", butterfly: "slip", leafDistractors: ["guess", "choose", "sound", "card"], butterflyDistractors: ["lamp", "gentle", "night", "tray"] },
    { leaf: "tray", butterfly: "play", leafDistractors: ["honey", "gentle", "mat", "moat"], butterflyDistractors: ["fang", "happy", "card", "sound"] },
    { leaf: "honey", butterfly: "money", leafDistractors: ["might", "flip", "animal", "jungle"], butterflyDistractors: ["click", "bread", "trouble", "feet"] },
    { leaf: "might", butterfly: "fight", leafDistractors: ["hide", "celebrate", "picture", "choose"], butterflyDistractors: ["show", "flash", "thunder", "umbrella"] },
    { leaf: "thunder", butterfly: "wonder", leafDistractors: ["stair", "happy", "tremble", "might"], butterflyDistractors: ["running", "balloon", "night", "guess"] },
    { leaf: "running", butterfly: "cunning", leafDistractors: ["celebrate", "thrilling", "chopping", "trouble"], butterflyDistractors: ["tumble", "grass", "blubber", "crush"] },
    { leaf: "tumble", butterfly: "stumble", leafDistractors: ["hurrying", "slotted", "animal", "safari"], butterflyDistractors: ["train", "adventure", "umbrella", "click"] },
    { leaf: "hurrying", butterfly: "worrying", leafDistractors: ["sorrow", "crash", "jumble", "orchestra"], butterflyDistractors: ["different", "shuffle", "interact", "peace"] },
    { leaf: "sorrow", butterfly: "tomorrow", leafDistractors: ["ready", "effortless", "football", "stadium"], butterflyDistractors: ["field", "alligator", "temperature", "bread"] },
    { leaf: "effortless", butterfly: "fearless", leafDistractors: ["stumble", "flying", "cricket", "tournament"], butterflyDistractors: ["cricket", "tournament", "grace", "gentle"] },
  ],

  roundPairs: [], 
  selectedLeaf: null,
  selectedButterfly: null,
  selectedBubble: null,
  isInputLocked: false,
};

const UI = {};

const Animations = {
  thumbs: null,
  tryAgain: null,
  congrats: null,
  star: null,
  bubbleBlue: null,
  bubbleGreen: null,
  leafGreen: null,
  leafYellow: null,
  butterflyBlue: null,
  butterflyPink: null,
};

window.addEventListener("DOMContentLoaded", init);

function init() {
  cacheDOM();
  bindEvents();
  hideAllPopups();
  loadAnimations();
}

function cacheDOM() {
  UI.svg = document.querySelector(".svg-container svg");
  UI.enterBtn = document.getElementById("home_enter_btn");
  UI.leafGraphic = document.getElementById("leaf_graphic");
  UI.refForBubblePosition = document.getElementById("ref_for_bubble_position");
  UI.butterflyGraphic = document.getElementById("butterfly_graphic");
  UI.iText = document.getElementById("i-text");
  UI.tryAgainPopup = document.getElementById("try_again_pop-up");
  UI.congratsPanel = document.getElementById("congratulations_panel");
  UI.tryAgainBtn = document.getElementById("try_again_btn");
  UI.playAgainBtn = document.getElementById("play_again_btn");
  UI.showAnswerBtn = document.getElementById("show_answer_btn");
  UI.hintBtn = document.getElementById("hint_btn");
  UI.nextBtn = document.getElementById("next_btn");
  UI.watch = document.getElementById("watch");
  UI.progressBar = document.getElementById("progress_bar");
  UI.starPanel = document.getElementById("star_panel");
  UI.thumpsUp = document.getElementById("thumps_up_icon");
  UI.progressCount = document.getElementById("progress-count");
  UI.pointsValue = document.getElementById("points-value");

  UI.leafGroups = [
    document.getElementById("Group_6149"),
    document.getElementById("Group_6150"),
    document.getElementById("Group_6151"),
    document.getElementById("Group_6152"),
    document.getElementById("Group_6153")
  ].filter(el => el);

  UI.butterflyGroups = [
    document.getElementById("Group_6149-7"),
    document.getElementById("Group_6150-2"),
    document.getElementById("Group_6151-2"),
    document.getElementById("Group_6152-2"),
    document.getElementById("Group_6153-2")
  ].filter(el => el);
  
  UI.refForBubblePositionGroups = [
    document.getElementById("cricket"),
    document.getElementById("cricket-2"),
    document.getElementById("cricket-3"),
    document.getElementById("cricket-4"),
    document.getElementById("cricket-5"),
    document.getElementById("cricket-6"),
    document.getElementById("cricket-7"),
    document.getElementById("cricket-8"),
    document.getElementById("cricket-9"),
    document.getElementById("cricket-10"),
  ].filter(el => el);

  if (UI.watch) {
    UI.timerText = UI.watch.querySelector("text#watch-text");
    UI.watchHand = UI.watch.querySelector("#Path_26");
    UI.watchFace = UI.watch.querySelector("#Ellipse_1");

    // Configure yellow circle to behave like a filling arc
  // Configure yellow circle to behave like a filling pie chart
  if (UI.watchFace) {
    // 1. Get original dimensions
    const originalR = parseFloat(UI.watchFace.getAttribute("r")) || 25.25;
    const cx = parseFloat(UI.watchFace.getAttribute("cx")) || 1850.95;
    const cy = parseFloat(UI.watchFace.getAttribute("cy")) || 176.02;

    // 2. The Pie Chart SVG Trick: Halve the radius, use original radius as stroke-width
    const pieR = originalR / 2;
    const circumference = 2 * Math.PI * pieR;
    
    UI.watchArcLength = circumference;
    UI.watchFaceCenter = { cx, cy }; // Save center for the watch hand

    UI.watchFace.setAttribute("r", pieR);
    UI.watchFace.setAttribute("fill", "none");
    UI.watchFace.setAttribute("stroke", "#fe9f00"); // Orange
    UI.watchFace.setAttribute("stroke-width", originalR); // Thick stroke creates the wedge
    UI.watchFace.setAttribute("stroke-linecap", "butt"); // Sharp edges for the pie slice
    UI.watchFace.setAttribute("stroke-dasharray", circumference);
    UI.watchFace.setAttribute("stroke-dashoffset", circumference); // Start empty

    // 3. Rotate -90 degrees so it starts at 12 o'clock
    UI.watchFace.setAttribute("transform", `rotate(-90 ${cx} ${cy})`);
  }

    if (!UI.timerText) {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.id = "watch-text";
      text.setAttribute("x", "1851");
      text.setAttribute("y", "142");
      text.setAttribute("font-family", "Roboto-Bold, Roboto");
      text.setAttribute("font-size", "30");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "central");
      text.style.alignmentBaseline = "central";
      text.setAttribute("fill", "#000");
      text.textContent = "15";
      UI.watch.appendChild(text);
      UI.timerText = text;
    }
  }

  if (UI.progressBar) {
    UI.progressPercentText = UI.progressBar.querySelector("text");
    UI.progressKnob = UI.progressBar.querySelector("#Rectangle_42");
  }

  if (UI.starPanel) {
    UI.stars = Array.from(UI.starPanel.children).filter(
      (el) => el.tagName === "g" && el.id !== "Group_22"
    );
  }
}

function hideAllPopups() {
  [UI.tryAgainPopup, UI.congratsPanel, UI.playAgainBtn, UI.tryAgainBtn, UI.hintBtn, UI.thumpsUp].forEach(el => {
    if (el) el.style.display = "none";
  });
  if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "none";
  if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "none";
  if (UI.nextBtn) UI.nextBtn.style.display = "none";
}


function showBottomBarForPair() {
  if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "block";
  if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "block";
  if (UI.nextBtn) UI.nextBtn.style.display = "none";
}

function showBottomBarForCorrect() {
  if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "none";
  if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "none";
  if (UI.nextBtn) UI.nextBtn.style.display = "block";
}

function bindEvents() {
  window.addEventListener("click", (e) => {
    let target = e.target;
    while (target && target !== document) {
      if (target.id === "home_enter_btn" || (target.id && target.id.includes("Enter_the_Rhyme_Zone"))) {
        startGame();
        return;
      }
      target = target.parentElement;
    }
  });

  if (UI.enterBtn) {
    UI.enterBtn.style.cursor = "pointer";
  }

  if (UI.tryAgainBtn) {
    UI.tryAgainBtn.addEventListener("click", () => {
      hideTryAgainPopup();
      resetTimer();
    });
  }

  if (UI.showAnswerBtn) {
    UI.showAnswerBtn.addEventListener("click", () => {
      hideTryAgainPopup();
      revealAnswerSet();
    });
  }

  if (UI.hintBtn) {
    UI.hintBtn.addEventListener("click", () => {
      hideTryAgainPopup();
      showHint();
    });
  }

  if (UI.nextBtn) {
    UI.nextBtn.addEventListener("click", () => {
      hideTryAgainPopup();
      loadNextPair();
    });
  }

  if (UI.playAgainBtn) {
    UI.playAgainBtn.addEventListener("click", () => {
      startGame();
    });
  }
}

function startGame() {
  hideAllPopups();
  hideAnimation("congrats");
  showAmbientAnimations();
  if (UI.enterBtn) UI.enterBtn.style.display = "none";

  if (UI.svg) {
    Array.from(UI.svg.children).forEach((child) => {
      if (child.tagName.toLowerCase() !== "defs") {
        child.style.setProperty("display", "none", "important");
        child.setAttribute("display", "none");
      }
    });
  }

  // Initialize bubble/ref groups
  if (UI.refForBubblePosition) {
    UI.refForBubblePosition.style.setProperty("display", "block", "important");
    UI.refForBubblePosition.removeAttribute("display");
    UI.refForBubblePosition.classList.remove("st767");
  }
  UI.refForBubblePositionGroups.forEach(g => {
    if (g) {
      g.style.setProperty("display", "block", "important");
      g.removeAttribute("display");
      g.style.opacity = "1";
      g.style.pointerEvents = "auto";
      g.classList.remove("st767");
    }
  });

  UI.leafGroups.forEach(g => {
    if (g) {
      g.style.setProperty("display", "block", "important");
      g.removeAttribute("display");
      g.style.opacity = "1";
      g.style.pointerEvents = "auto";
    }
  });
  
  UI.butterflyGroups.forEach(g => {
    if (g) {
      g.style.setProperty("display", "block", "important");
      g.removeAttribute("display");
      g.style.opacity = "1";
      g.style.pointerEvents = "auto";
      const paths = g.querySelectorAll("path");
      paths.forEach(p => p.setAttribute("fill", "#2e95ef"));
    }
  });

  if (UI.watch) {
    UI.watch.style.setProperty("display", "block", "important");
    UI.watch.removeAttribute("display");
    UI.watch.classList.remove("st767");
  }
  if (UI.progressBar) {
    UI.progressBar.style.setProperty("display", "block", "important");
    UI.progressBar.removeAttribute("display");
    UI.progressBar.classList.remove("st767");
  }
  if (UI.starPanel) {
    UI.starPanel.style.setProperty("display", "block", "important");
    UI.starPanel.removeAttribute("display");
    UI.starPanel.classList.remove("st767");
  }
  if (UI.iText) {
    UI.iText.style.setProperty("display", "block", "important");
    UI.iText.removeAttribute("display");
    UI.iText.classList.remove("st767");
  }

  WidgetState.score = 0;
  WidgetState.progress = 0;
  WidgetState.roundPairs = shuffle([...WidgetState.allPairs]).slice(0, WidgetState.maxPairs);

  updateLayoutForProgress(WidgetState.progress);
  loadNextPair();
}

function loadNextPair() {
  if (WidgetState.progress >= WidgetState.maxPairs) {
    showCelebration();
    return;
  }
  
  updateLayoutForProgress(WidgetState.progress);

  WidgetState.currentPair = WidgetState.roundPairs[WidgetState.progress];
  WidgetState.currentAttempt = 0;
  WidgetState.selectedLeaf = null;
  WidgetState.selectedButterfly = null;
  WidgetState.isInputLocked = false;

  assignBoardWords();
  resetTimer();
  updateUI();
  showBottomBarForPair();
}

function assignBoardWords() {
  const correct = WidgetState.currentPair;
  
  // Use provided distractors, pad with random words if needed
  let leafDistractors = correct.leafDistractors ? [...correct.leafDistractors] : [];
  let butterflyDistractors = correct.butterflyDistractors ? [...correct.butterflyDistractors] : [];
  
  // If we don't have enough distractors, fill from other pairs
  while (leafDistractors.length < 4) {
    const randomPair = WidgetState.allPairs[Math.floor(Math.random() * WidgetState.allPairs.length)];
    if (randomPair.leaf !== correct.leaf && !leafDistractors.includes(randomPair.leaf)) {
      leafDistractors.push(randomPair.leaf);
    }
  }
  while (butterflyDistractors.length < 4) {
    const randomPair = WidgetState.allPairs[Math.floor(Math.random() * WidgetState.allPairs.length)];
    if (randomPair.butterfly !== correct.butterfly && !butterflyDistractors.includes(randomPair.butterfly)) {
      butterflyDistractors.push(randomPair.butterfly);
    }
  }

  // Create word arrays: 1 correct + 4 distractors for each side
  const leafWords = shuffle([correct.leaf, ...leafDistractors.slice(0, 4)]);
  const butterflyWords = shuffle([correct.butterfly, ...butterflyDistractors.slice(0, 4)]);
  
  // Create an array of 10 words (5 leaves + 5 butterflies)
  const refForBubblePositionWords = [...leafWords, ...butterflyWords];
  
  UI.refForBubblePositionGroups.forEach((g, i) => {
    if (i < 10) {
      setItemText(g, refForBubblePositionWords[i]);
      g.dataset.word = refForBubblePositionWords[i];
      // First 5 function as "leaf", last 5 function as "butterfly" so click logic works
      g.dataset.type = i < 5 ? "leaf" : "butterfly";
      addInteractivity(g, handleItemClick);
    }
  });

  UI.leafGroups.forEach((g, i) => {
    if (i < 5) {
      setItemText(g, leafWords[i]);
      g.dataset.word = leafWords[i];
      g.dataset.type = "leaf";
      addInteractivity(g, handleItemClick);
    } else {
      g.style.display = "none";
    }
  });

  UI.butterflyGroups.forEach((g, i) => {
    if (i < 5) {
      setItemText(g, butterflyWords[i]);
      g.dataset.word = butterflyWords[i];
      g.dataset.type = "butterfly";
      addInteractivity(g, handleItemClick);
    } else {
      g.style.display = "none";
    }
  });
}

function setItemText(group, word) {
  const textEl = group.querySelector("text");
  if (textEl) {
    group.style.display = "block";
    group.style.opacity = "1";
    group.style.pointerEvents = "auto";
    group.classList.remove("st767");

    textEl.style.filter = "none";
    textEl.textContent = word;

    const paths = group.querySelectorAll("path");
    if (paths.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      paths.forEach(p => {
        const b = p.getBBox();
        if (b.width > 0 && b.height > 0) {
          minX = Math.min(minX, b.x);
          minY = Math.min(minY, b.y);
          maxX = Math.max(maxX, b.x + b.width);
          maxY = Math.max(maxY, b.y + b.height);
        }
      });

      if (minX !== Infinity) {
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        textEl.setAttribute("transform", `translate(${cx}, ${cy})`);
      }
    }

    textEl.setAttribute("text-anchor", "middle");
    textEl.setAttribute("dominant-baseline", "central");
    textEl.style.alignmentBaseline = "central"; 
  }
}

function addInteractivity(el, callback) {
  el.style.cursor = "pointer";
  el.onclick = () => callback(el);
}

function handleItemClick(el) {
  console.log("handleItemClick", el);
  if (WidgetState.isInputLocked) return;

  const type = el.dataset.type;
  if (type === "leaf") {
    if (WidgetState.selectedLeaf) WidgetState.selectedLeaf.style.filter = "none";
    WidgetState.selectedLeaf = el;
    el.style.filter = "drop-shadow(0 0 5px #ff0)";
  } else {
    if (WidgetState.selectedButterfly) WidgetState.selectedButterfly.style.filter = "none";
    WidgetState.selectedButterfly = el;
    el.style.filter = "drop-shadow(0 0 5px #ff0)";
  }

  if (WidgetState.selectedLeaf && WidgetState.selectedButterfly) {
    const leafWord = WidgetState.selectedLeaf.dataset.word;
    const butterflyWord = WidgetState.selectedButterfly.dataset.word;

    if (leafWord === WidgetState.currentPair.leaf && butterflyWord === WidgetState.currentPair.butterfly) {
      onCorrect();
    } else {
      onWrong();
    }
  }
}

function onCorrect() {
  stopTimer();
  WidgetState.isInputLocked = true;
  WidgetState.score += 10;
  WidgetState.progress++;

  WidgetState.selectedLeaf.style.filter = "drop-shadow(0 0 10px #0f0) scale(1.1)";
  WidgetState.selectedButterfly.style.filter = "drop-shadow(0 0 10px #0f0) scale(1.1)";

  // Fade others across all layout pools
  const allInteractiveGroups = [...UI.leafGroups, ...UI.butterflyGroups, ...UI.refForBubblePositionGroups];
  allInteractiveGroups.forEach(g => { 
    if (g && g !== WidgetState.selectedLeaf && g !== WidgetState.selectedButterfly) {
      g.style.opacity = "0.2"; 
    }
  });

  if (UI.thumpsUp) {
    UI.thumpsUp.style.display = "block";
    setTimeout(() => { if (UI.thumpsUp) UI.thumpsUp.style.display = "none"; }, 1000);
  }

  playAnimation("thumbs", 1500);
  playAnimation("star", 1200);

  updateUI();
  setTimeout(loadNextPair, 1500);
}

function onWrong() {
  stopTimer();
  WidgetState.currentAttempt++;
  if (WidgetState.selectedLeaf) WidgetState.selectedLeaf.style.filter = "drop-shadow(0 0 8px #c00)";
  if (WidgetState.selectedButterfly) WidgetState.selectedButterfly.style.filter = "drop-shadow(0 0 8px #c00)";
  showTryAgainPopup("Try again!");
}

function resetSelections() {
  if (WidgetState.selectedLeaf) WidgetState.selectedLeaf.style.filter = "none";
  if (WidgetState.selectedButterfly) WidgetState.selectedButterfly.style.filter = "none";
  WidgetState.selectedLeaf = null;
  WidgetState.selectedButterfly = null;
}

function handleTimeout() {
  stopTimer();
  WidgetState.currentAttempt++;
  showTryAgainPopup("Time is up!");
  resetSelections();
}

function showTryAgainPopup(msg) {
  WidgetState.isInputLocked = true;
  playAnimation("tryAgain", 2000);
  
  if (UI.tryAgainPopup) {
    UI.tryAgainPopup.style.display = "block";
    const text = UI.tryAgainPopup.querySelector("text");
    if (text) text.textContent = msg;

    if (WidgetState.currentAttempt < 2) {
      if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "block";
      if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "none";
      if (UI.hintBtn) UI.hintBtn.style.display = "none";
      if (UI.nextBtn) UI.nextBtn.style.display = "none";
    } else {
      if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "none";
      if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "block";
      if (UI.hintBtn) UI.hintBtn.style.display = "block";
      if (UI.nextBtn) {
        UI.nextBtn.style.setProperty("display", "block", "important");
        UI.nextBtn.classList.remove("st767");
      }
    }
  }
}

// Helper to find correct elements across all UIs
function findCorrectGroups() {
  const allGroups = [...UI.leafGroups, ...UI.butterflyGroups, ...UI.refForBubblePositionGroups];
  const correctLeaf = allGroups.find(g => g && g.dataset && g.dataset.word === WidgetState.currentPair.leaf);
  const correctButterfly = allGroups.find(g => g && g.dataset && g.dataset.word === WidgetState.currentPair.butterfly);
  return { correctLeaf, correctButterfly };
}

function hideTryAgainPopup() {
  if (UI.tryAgainPopup) UI.tryAgainPopup.style.display = "none";
  resetSelections();
  WidgetState.isInputLocked = false;
  showBottomBarForPair();
}

function showHint() {
  const { correctLeaf, correctButterfly } = findCorrectGroups();

  if (correctLeaf && correctButterfly) {
    correctLeaf.style.filter = "drop-shadow(0 0 10px #00f)";
    correctButterfly.style.filter = "drop-shadow(0 0 10px #00f)";
    setTimeout(() => {
      correctLeaf.style.filter = "none";
      correctButterfly.style.filter = "none";
      resetTimer();
    }, 1000);
  }
}

function revealAnswerSet() {
  const { correctLeaf, correctButterfly } = findCorrectGroups();

  if (correctLeaf && correctButterfly) {
    correctLeaf.style.filter = "drop-shadow(0 0 10px #f0f)";
    correctButterfly.style.filter = "drop-shadow(0 0 10px #f0f)";
    WidgetState.isInputLocked = true;
    setTimeout(() => {
      WidgetState.progress++;
      updateUI();
      loadNextPair();
    }, 2000);
  }
}

function resetTimer() {
  stopTimer();
  WidgetState.timeLeft = TOTAL_TIME;
  updateTimerDisplay();

  const tick = () => {
    if (WidgetState.timer === null) return;

    WidgetState.timeLeft--;
    updateTimerDisplay();

    if (WidgetState.timeLeft <= 0) {
      handleTimeout();
    } else {
      WidgetState.timer = setTimeout(tick, 1000);
    }
  };

  WidgetState.timer = setTimeout(tick, 1000);
}

function stopTimer() {
  if (WidgetState.timer !== null) {
    clearTimeout(WidgetState.timer);
    WidgetState.timer = null;
  }
}

function updateTimerDisplay() {
  if (UI.timerText) UI.timerText.textContent = WidgetState.timeLeft;

  const elapsedRatio = (TOTAL_TIME - WidgetState.timeLeft) / TOTAL_TIME;

  // Yellow arc (Ellipse_1) grows clockwise over time
  if (UI.watchFace && UI.watchArcLength) {
    const clamped = Math.max(0, Math.min(1, elapsedRatio));
    const visible = UI.watchArcLength * clamped;
    const offset = UI.watchArcLength - visible;
    UI.watchFace.setAttribute("stroke-dashoffset", `${offset}`);
  }

  // Rotate the watch hand around the center to show elapsed time
  if (UI.watchHand) {
    const clampedRatio = Math.max(0, Math.min(1, elapsedRatio));
    // Start at straight up (0 deg) and move clockwise to 360
    const angle = 360 * clampedRatio; 
    
    // Grab the center we saved in cacheDOM, or fallback to the hardcoded ones
    const cx = UI.watchFaceCenter ? UI.watchFaceCenter.cx : 1850.95;
    const cy = UI.watchFaceCenter ? UI.watchFaceCenter.cy : 176.02;
    
    UI.watchHand.setAttribute(
      "transform",
      `rotate(${angle} ${cx} ${cy})`
    );
  }
}

/* ------------------------------------------------------------------------- */
/* 8. Layout switching between 3 UIs                                         */
/* ------------------------------------------------------------------------- */

function updateLayoutForProgress(progressIndex) {
  const phase = progressIndex <= 2 ? "ref" : progressIndex <= 5 ? "leaf" : "butterfly";

  const showRef = phase === "ref";
  const showLeaf = phase === "leaf";
  const showButterfly = phase === "butterfly";

  // Show/hide bubble (ref) layout
  if (UI.refForBubblePosition) {
    UI.refForBubblePosition.style.setProperty("display", showRef ? "block" : "none", "important");
    UI.refForBubblePosition.setAttribute("display", showRef ? "block" : "none");
    if (showRef) UI.refForBubblePosition.classList.remove("st767");
  }
  UI.refForBubblePositionGroups.forEach(g => {
    if (g) {
      g.style.setProperty("display", showRef ? "block" : "none", "important");
      if (showRef) {
        g.style.opacity = "1";
        g.style.pointerEvents = "auto";
      }
    }
  });

  // Show/hide leaf layout
  if (UI.leafGraphic) {
    UI.leafGraphic.style.setProperty("display", showLeaf ? "block" : "none", "important");
    UI.leafGraphic.setAttribute("display", showLeaf ? "block" : "none");
    if (showLeaf) UI.leafGraphic.classList.remove("st767");
  }
  UI.leafGroups.forEach(g => {
    if (g) {
      g.style.setProperty("display", showLeaf ? "block" : "none", "important");
      if (showLeaf) {
        g.style.opacity = "1";
        g.style.pointerEvents = "auto";
      }
    }
  });

  // Show/hide butterfly layout
  if (UI.butterflyGraphic) {
    UI.butterflyGraphic.style.setProperty("display", showButterfly ? "block" : "none", "important");
    UI.butterflyGraphic.setAttribute("display", showButterfly ? "block" : "none");
    if (showButterfly) UI.butterflyGraphic.classList.remove("st767");
  }
  UI.butterflyGroups.forEach(g => {
    if (g) {
      g.style.setProperty("display", showButterfly ? "block" : "none", "important");
      if (showButterfly) {
        g.style.opacity = "1";
        g.style.pointerEvents = "auto";
      }
    }
  });
}

function updateUI() {
  if (UI.progressCount) {
    UI.progressCount.textContent = `${WidgetState.progress}/${WidgetState.maxPairs}`;
  }
  if (UI.pointsValue) {
    UI.pointsValue.textContent = WidgetState.score;
  }

  if (UI.progressBar) {
    const ratio = WidgetState.maxPairs > 0
        ? Math.max(0, Math.min(1, WidgetState.progress / WidgetState.maxPairs))
        : 0;
    const percent = Math.round(ratio * 100);

    if (UI.progressPercentText) {
      const padded = percent.toString().padStart(2, "0");
      UI.progressPercentText.textContent = `${padded}%`;
    }

    if (UI.progressKnob) {
      const maxTravel = 315; 
      const translateX = ratio * maxTravel;
      UI.progressKnob.setAttribute("transform", `translate(${translateX},0)`);
    }
  }

  if (UI.stars) {
    UI.stars.forEach((s, i) => {
      s.style.opacity = i < WidgetState.progress ? "1" : "0.2";
    });
  }
}

function showCelebration() {
  hideAmbientAnimations();
  playAnimation("congrats");

  if (UI.congratsPanel) {
    UI.congratsPanel.style.display = "block";
    const messages = ["Well done!", "Congratulations!", "Great job!", "This is awesome!"];
    const text = UI.congratsPanel.querySelector("text");
    if (text) text.textContent = messages[Math.floor(Math.random() * messages.length)];

    if (UI.playAgainBtn) UI.playAgainBtn.style.display = "block";
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
<<<<<<< Updated upstream
=======

/* ------------------------------------------------------------------------- */
/* 9. Lottie Animations                                                      */
/* ------------------------------------------------------------------------- */

function loadAnimations() {
  const animConfig = [
    { key: "thumbs", container: "lottie-thumbs", path: "./assets/anim/Thumbs.json", loop: false },
    { key: "tryAgain", container: "lottie-try-again", path: "./assets/anim/try-again.json", loop: false },
    { key: "congrats", container: "lottie-congrats", path: "./assets/anim/congratulation.json", loop: false },
    { key: "star", container: "lottie-star", path: "./assets/anim/Star_Animation.json", loop: false },
    { key: "bubbleBlue", container: "lottie-bubble-blue", path: "./assets/anim/bubble-blue.json", loop: false },
    { key: "bubbleGreen", container: "lottie-bubble-green", path: "./assets/anim/bubble-green.json", loop: false },
    { key: "leafGreen", container: "lottie-leaf-green", path: "./assets/anim/leaf-green.json", loop: false },
    { key: "leafYellow", container: "lottie-leaf-yellow", path: "./assets/anim/leaf-yellow.json", loop: false },
    { key: "butterflyBlue", container: "lottie-butterfly-blue", path: "./assets/anim/butterfly-blue.json", loop: false },
    { key: "butterflyPink", container: "lottie-butterfly-pink", path: "./assets/anim/butterfly-pink.json", loop: false },
  ];

  animConfig.forEach(cfg => {
    const container = document.getElementById(cfg.container);
    if (container && typeof lottie !== "undefined") {
      Animations[cfg.key] = lottie.loadAnimation({
        container: container,
        renderer: "svg",
        loop: cfg.loop,
        autoplay: false,
        path: cfg.path,
      });
    }
  });
}

function playAnimation(animKey, duration) {
  const anim = Animations[animKey];
  if (!anim) return;

  const container = anim.wrapper;
  if (container) {
    container.style.display = "block";
  }

  anim.goToAndPlay(0, true);

  if (duration) {
    setTimeout(() => {
      hideAnimation(animKey);
    }, duration);
  } else {
    anim.addEventListener("complete", function onComplete() {
      hideAnimation(animKey);
      anim.removeEventListener("complete", onComplete);
    });
  }
}

function hideAnimation(animKey) {
  const anim = Animations[animKey];
  if (!anim) return;

  anim.stop();
  const container = anim.wrapper;
  if (container) {
    container.style.display = "none";
  }
}

function showAmbientAnimations() {
  const ambientKeys = ["bubbleBlue", "bubbleGreen", "leafGreen", "leafYellow", "butterflyBlue", "butterflyPink"];
  ambientKeys.forEach(key => {
    const anim = Animations[key];
    if (anim && anim.wrapper) {
      anim.wrapper.style.display = "block";
      anim.play();
    }
  });
}

function hideAmbientAnimations() {
  const ambientKeys = ["bubbleBlue", "bubbleGreen", "leafGreen", "leafYellow", "butterflyBlue", "butterflyPink"];
  ambientKeys.forEach(key => {
    hideAnimation(key);
  });
}
>>>>>>> Stashed changes
