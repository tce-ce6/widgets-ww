const WidgetState = {
  score: 0,
  progress: 0,
  selectedLeaf: null,
  selectedButterfly: null,
  timer: null,
  timeLeft: 60,
  timerAttempts: 0,
  pairs: [
    { leaf: "bright", butterfly: "night" },
    { leaf: "fair", butterfly: "share" },
    { leaf: "drip", butterfly: "trip" },
    { leaf: "leg", butterfly: "peg" },
    { leaf: "fly", butterfly: "sly" },
    { leaf: "kitten", butterfly: "mitten" },
    { leaf: "dream", butterfly: "stream" },
    { leaf: "balloon", butterfly: "moon" },
    { leaf: "stamp", butterfly: "lamp" },
    { leaf: "power", butterfly: "flower" },
    { leaf: "butter", butterfly: "mutter" },
    { leaf: "follow", butterfly: "hollow" },
    { leaf: "humble", butterfly: "mumble" },
    { leaf: "dress", butterfly: "mess" },
    { leaf: "trouble", butterfly: "bubble" },
    { leaf: "goat", butterfly: "moat" },
    { leaf: "sunny", butterfly: "funny" },
    { leaf: "glance", butterfly: "dance" },
    { leaf: "tinkling", butterfly: "sprinkling" },
    { leaf: "parrot", butterfly: "carrot" },
    { leaf: "flip", butterfly: "slip" },
    { leaf: "tray", butterfly: "play" },
    { leaf: "honey", butterfly: "money" },
    { leaf: "might", butterfly: "fight" },
    { leaf: "thunder", butterfly: "wonder" },
    { leaf: "running", butterfly: "cunning" },
    { leaf: "tumble", butterfly: "stumble" },
    { leaf: "hurrying", butterfly: "worrying" },
    { leaf: "sorrow", butterfly: "tomorrow" },
    { leaf: "mountain", butterfly: "fountain" },
  ],
  matchedIds: [],
};

const UI = {};

function init() {
  cacheDOM();
  bindEvents();
  hideAllPopups();
}

function cacheDOM() {
  UI.svg = document.querySelector("svg");
  UI.enterBtn = document.getElementById("home_enter_btn");
  UI.leafGraphic = document.getElementById("leaf_graphic");
  UI.butterflyGraphic = document.getElementById("butterfly_graphic");
  UI.iText = document.getElementById("i-text");

  UI.tryAgainPopup = document.getElementById("try_again_pop-up");
  UI.congratsPanel = document.getElementById("congratulations_panel");
  UI.playAgainBtn = document.getElementById("play_again_btn");
  UI.tryAgainBtn = document.getElementById("try_again_btn");
  UI.showAnswerBtn = document.getElementById("show_answer_btn");
  UI.hintBtn = document.getElementById("hint_btn");
  UI.watch = document.getElementById("watch");
  UI.progressBar = document.getElementById("progress_bar");
  UI.starPanel = document.getElementById("star_panel");
  UI.thumpsUp = document.getElementById("thumps_up_icon");

  UI.progressCount = document.getElementById("progress-count");
  UI.pointsValue = document.getElementById("points-value");
  UI.refForBubblePosition = document.getElementById("ref_for_bubble_position");

  const gameArea = document.getElementById("rhymezone-game-area");
  if (gameArea) gameArea.style.display = "none";

  UI.leaves = UI.leafGraphic
    ? Array.from(UI.leafGraphic.children).filter(
        (child) => child.tagName === "g" && child.querySelector("text"),
      )
    : [];
  UI.butterflies = UI.butterflyGraphic
    ? Array.from(UI.butterflyGraphic.children).filter(
        (child) => child.tagName === "g" && child.querySelector("text"),
      )
    : [];

  if (UI.watch && !UI.watch.querySelector("text#watch-text")) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.id = "watch-text";
    text.setAttribute("x", "1851");
    text.setAttribute("y", "186");
    text.setAttribute("font-family", "Roboto-Bold, Roboto");
    text.setAttribute("font-size", "30");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("fill", "#fff");
    text.setAttribute("text-anchor", "middle");
    text.textContent = "60";
    UI.watch.appendChild(text);
    UI.timerText = text;
  } else if (UI.watch) {
    UI.timerText = UI.watch.querySelector("text#watch-text");
  }

  if (UI.progressBar) {
    UI.progressText =
      UI.progressBar.querySelector("text tspan") ||
      UI.progressBar.querySelector("text");
    UI.progressFill = document.getElementById("Rectangle_42");
  }

  if (UI.starPanel) {
    UI.stars = Array.from(UI.starPanel.children).filter(
      (el) => el.tagName === "g" && el.id !== "Group_22",
    );
  } else {
    UI.stars = [];
  }
}

function hideAllPopups() {
  if (UI.tryAgainPopup) UI.tryAgainPopup.style.display = "none";
  if (UI.congratsPanel) UI.congratsPanel.style.display = "none";
  if (UI.playAgainBtn) UI.playAgainBtn.style.display = "none";
  if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "none";
  if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "none";
  if (UI.hintBtn) UI.hintBtn.style.display = "none";
  if (UI.thumpsUp) UI.thumpsUp.style.display = "none";
  if (UI.tryAgainPanel) UI.tryAgainPanel.style.display = "none";

  const nextBtn = document.getElementById("next_btn");
  if (nextBtn) nextBtn.style.display = "none";

  for (let i = 1; i <= 10; i++) {
    const el = document.getElementById(i === 1 ? "cricket" : `cricket-${i}`);
    if (el) el.style.display = "none";
  }
}

function bindEvents() {
  if (UI.enterBtn) {
    UI.enterBtn.addEventListener("click", startGame);
    UI.enterBtn.style.cursor = "pointer";
  }

  UI.leaves.forEach((leaf) => {
    leaf.style.cursor = "pointer";
    leaf.addEventListener("click", () => handleLeafClick(leaf));
  });

  UI.butterflies.forEach((butterfly) => {
    butterfly.style.cursor = "pointer";
    butterfly.addEventListener("click", () => handleButterflyClick(butterfly));
  });

  if (UI.tryAgainBtn) {
    UI.tryAgainBtn.style.cursor = "pointer";
    UI.tryAgainBtn.addEventListener("click", () => {
      const textEl = UI.tryAgainPopup
        ? UI.tryAgainPopup.querySelector("text")
        : null;
      const isTimeUp = textEl && textEl.textContent.includes("Time");

      hideTryAgainPopup();
      resetSelection();

      if (isTimeUp) {
        startTimer();
      }
    });
  }

  if (UI.showAnswerBtn) {
    UI.showAnswerBtn.style.cursor = "pointer";
    UI.showAnswerBtn.addEventListener("click", showAnswer);
  }

  if (UI.hintBtn) {
    UI.hintBtn.style.cursor = "pointer";
    UI.hintBtn.addEventListener("click", showHint);
  }

  if (UI.playAgainBtn) {
    UI.playAgainBtn.style.cursor = "pointer";
    UI.playAgainBtn.addEventListener("click", resetGame);
  }
}

function startGame() {
  if (UI.enterBtn) UI.enterBtn.style.display = "none";
  if (UI.refForBubblePosition) {
    UI.refForBubblePosition.classList.remove("st767");
    for (let i = 1; i <= 10; i++) {
      const el = document.getElementById(i === 1 ? "cricket" : `cricket-${i}`);
      if (el) el.style.display = "block";
    }
  }

  assignWords();
  WidgetState.timeLeft = 60;
  WidgetState.timerAttempts = 0;
  WidgetState.score = 0;
  WidgetState.progress = 0;
  WidgetState.matchedIds = [];
  WidgetState.selectedLeaf = null;
  WidgetState.selectedButterfly = null;

  updateTimerDisplay();
  startTimer();
  updateProgress();

  UI.leaves.forEach((leaf) => {
    leaf.style.visibility = "visible";
    leaf.style.opacity = "1";
    leaf.style.pointerEvents = "auto";
  });
  UI.butterflies.forEach((butterfly) => {
    butterfly.style.visibility = "visible";
    butterfly.style.opacity = "1";
    butterfly.style.pointerEvents = "auto";
  });
}

function assignWords() {
  let shuffledButterflies = [...shuffledPairs].sort(() => Math.random() - 0.5);

  UI.leaves.forEach((leaf, index) => {
    if (index < shuffledLeaves.length) {
      const textEl = leaf.querySelector("text");
      if (textEl) {
        if (!textEl.dataset.initialized) {
          const bbox = textEl.getBBox();
          textEl.dataset.centerX = bbox.x + bbox.width / 2;
          textEl.dataset.initialized = "true";
          textEl.setAttribute("text-anchor", "middle");
        }
        textEl.innerHTML = `<tspan x="${textEl.dataset.centerX}" y="0">${shuffledLeaves[index].leaf}</tspan>`;
      }
      leaf.dataset.pairId = shuffledLeaves[index].leaf;
      leaf.dataset.matchId = shuffledLeaves[index].butterfly;
    }
  });

  UI.butterflies.forEach((butterfly, index) => {
    if (index < shuffledButterflies.length) {
      const textEl = butterfly.querySelector("text");
      if (textEl) {
        if (!textEl.dataset.initialized) {
          const bbox = textEl.getBBox();
          textEl.dataset.centerX = bbox.x + bbox.width / 2;
          textEl.dataset.initialized = "true";
          textEl.setAttribute("text-anchor", "middle");
        }
        textEl.innerHTML = `<tspan x="${textEl.dataset.centerX}" y="0">${shuffledButterflies[index].butterfly}</tspan>`;
      }
      butterfly.dataset.pairId = shuffledButterflies[index].butterfly;
      butterfly.dataset.matchId = shuffledButterflies[index].leaf;
    }
  });
}

function setBoardInteractive(interactive) {
  const pointerEvents = interactive ? "auto" : "none";
  UI.leaves.forEach((leaf) => {
    if (!WidgetState.matchedIds.includes(leaf.dataset.pairId)) {
      leaf.style.pointerEvents = pointerEvents;
    }
  });
  UI.butterflies.forEach((butterfly) => {
    if (!WidgetState.matchedIds.includes(butterfly.dataset.pairId)) {
      butterfly.style.pointerEvents = pointerEvents;
    }
  });
}

function handleLeafClick(leaf) {
  if (WidgetState.matchedIds.includes(leaf.dataset.pairId)) return;
  if (leaf.style.pointerEvents === "none") return;

  if (WidgetState.selectedLeaf) {
    WidgetState.selectedLeaf.style.opacity = "1";
  }

  WidgetState.selectedLeaf = leaf;
  leaf.style.opacity = "0.6";

  checkMatch();
}

function handleButterflyClick(butterfly) {
  if (WidgetState.matchedIds.includes(butterfly.dataset.pairId)) return;
  if (butterfly.style.pointerEvents === "none") return;

  if (WidgetState.selectedButterfly) {
    WidgetState.selectedButterfly.style.opacity = "1";
  }

  WidgetState.selectedButterfly = butterfly;
  butterfly.style.opacity = "0.6";

  checkMatch();
}

function checkMatch() {
  if (WidgetState.selectedLeaf && WidgetState.selectedButterfly) {
    const leafMatch = WidgetState.selectedLeaf.dataset.matchId;
    const butterflyId = WidgetState.selectedButterfly.dataset.pairId;

    if (leafMatch === butterflyId) {
      handleCorrectMatch();
    } else {
      handleWrongMatch();
    }
  }
}

function handleWrongMatch() {
  setBoardInteractive(false);
  if (UI.tryAgainPopup) {
    UI.tryAgainPopup.style.display = "block";

    const textEl = UI.tryAgainPopup.querySelector("text");
    if (textEl) {
      if (!textEl.dataset.initialized) {
        const bbox = textEl.getBBox();
        textEl.dataset.centerX = bbox.x + bbox.width / 2;
        textEl.dataset.initialized = "true";
        textEl.setAttribute("text-anchor", "middle");
      }
      textEl.innerHTML = `<tspan x="${textEl.dataset.centerX}" y="0">Try again</tspan>`;
    }

    if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "block";
    if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "none";
    if (UI.hintBtn) UI.hintBtn.style.display = "none";
  }
}

function showTryAgainPopup() {
  setBoardInteractive(false);
  if (UI.tryAgainPopup) UI.tryAgainPopup.style.display = "block";
  if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "block";
  if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "block";
  if (UI.hintBtn) UI.hintBtn.style.display = "block";
}

function hideTryAgainPopup() {
  setBoardInteractive(true);
  if (UI.tryAgainPopup) UI.tryAgainPopup.style.display = "none";
  if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "none";
  if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "none";
  if (UI.hintBtn) UI.hintBtn.style.display = "none";
}

function handleCorrectMatch(isAnswer = false) {
  WidgetState.matchedIds.push(WidgetState.selectedLeaf.dataset.pairId);
  WidgetState.matchedIds.push(WidgetState.selectedButterfly.dataset.pairId);

  WidgetState.selectedLeaf.style.pointerEvents = "none";
  WidgetState.selectedButterfly.style.pointerEvents = "none";

  WidgetState.selectedLeaf.style.visibility = "hidden";
  WidgetState.selectedButterfly.style.visibility = "hidden";

  if (!isAnswer) {
    WidgetState.score += 10;
  }
  WidgetState.progress++;

  updateProgress();
  resetSelection();

  if (UI.thumpsUp) {
    UI.thumpsUp.style.display = "block";
    setTimeout(() => {
      if (UI.thumpsUp) UI.thumpsUp.style.display = "none";
    }, 1000);
  }

  const maxMatches = Math.min(
    UI.leaves.length,
    UI.butterflies.length,
    WidgetState.pairs.length,
  );
  if (WidgetState.progress >= maxMatches) {
    setTimeout(() => endGame(true), 500);
  }
}

function resetSelection() {
  if (WidgetState.selectedLeaf) {
    WidgetState.selectedLeaf.style.opacity = "1";
    WidgetState.selectedLeaf = null;
  }
  if (WidgetState.selectedButterfly) {
    WidgetState.selectedButterfly.style.opacity = "1";
    WidgetState.selectedButterfly = null;
  }
}

function showAnswer() {
  hideTryAgainPopup();
  setBoardInteractive(false);
  if (WidgetState.timer) clearInterval(WidgetState.timer);

  const leaf = unmatchedLeaves[i];
  const matchId = leaf.dataset.matchId;
  const butterfly = UI.butterflies.find((b) => b.dataset.pairId === matchId);

  if (butterfly) {
    WidgetState.matchedIds.push(leaf.dataset.pairId);
    WidgetState.matchedIds.push(butterfly.dataset.pairId);

    leaf.style.opacity = "0.5";
    butterfly.style.opacity = "0.5";

    setTimeout(() => {
      leaf.style.visibility = "hidden";
      butterfly.style.visibility = "hidden";
      WidgetState.progress++;
      updateProgress();
      i++;
      solveNext();
    }, 800);
  } else {
    i++;
    solveNext();
  }
}

function updateProgress() {
  const total = Math.min(
    UI.leaves.length,
    UI.butterflies.length,
    WidgetState.pairs.length,
  );
  //const total = 10;
  const percent = Math.round((WidgetState.progress / total) * 100);

  if (UI.progressText) {
    UI.progressText.textContent = `${percent}%`;
    if (UI.stars) {
      UI.stars.forEach((starGroup, index) => {
        if (index < WidgetState.progress) {
          starGroup.style.opacity = "1";
        } else {
          starGroup.style.opacity = "0.2";
        }
      });
    }

    if (UI.progressCount)
      UI.progressCount.textContent = `${WidgetState.progress}/${total}`;

    if (UI.pointsValue) UI.pointsValue.textContent = WidgetState.score;
  }

  function startTimer() {
    if (WidgetState.timer) clearInterval(WidgetState.timer);
    WidgetState.timeLeft = 60;
    updateTimerDisplay();

    WidgetState.timer = setInterval(() => {
      WidgetState.timeLeft--;
      updateTimerDisplay();

      if (WidgetState.timeLeft <= 0) {
        clearInterval(WidgetState.timer);
        endGame(false);
        handleTimeUp();
      }
    }, 1000);
  }

  function handleTimeUp() {
    WidgetState.timerAttempts++;
    setBoardInteractive(false);

    if (UI.tryAgainPopup) {
      UI.tryAgainPopup.style.display = "block";

      const textEl = UI.tryAgainPopup.querySelector("text");
      if (textEl) {
        const bbox = textEl.getBBox();
        textEl.dataset.centerX = bbox.x + bbox.width / 2;
        textEl.dataset.initialized = "true";
        textEl.setAttribute("text-anchor", "middle");
      }
      textEl.innerHTML = `<tspan x="${textEl.dataset.centerX}" y="0">Time is Up!</tspan>`;
    }

    if (WidgetState.timerAttempts < 2) {
      if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "block";
      if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "block";
      if (UI.hintBtn) UI.hintBtn.style.display = "none";
    } else {
      if (UI.tryAgainBtn) UI.tryAgainBtn.style.display = "none";
      if (UI.showAnswerBtn) UI.showAnswerBtn.style.display = "block";
      if (UI.hintBtn) UI.hintBtn.style.display = "block";
    }
  }
}

function updateTimerDisplay() {
  if (UI.timerText) {
    UI.timerText.textContent = WidgetState.timeLeft;
  }
}

function endGame(success, isShowAnswer = false) {
  if (WidgetState.timer) clearInterval(WidgetState.timer);
  setBoardInteractive(false);

  if (UI.congratsPanel) {
    UI.congratsPanel.style.display = "block";
    if (UI.playAgainBtn) UI.playAgainBtn.style.display = "block";
    const textEl = UI.congratsPanel.querySelector("text");
    if (textEl) {
      if (!textEl.dataset.initialized) {
        const bbox = textEl.getBBox();
        textEl.dataset.centerX = bbox.x + bbox.width / 2;
        textEl.dataset.initialized = "true";
        textEl.setAttribute("text-anchor", "middle");
      }
      textEl.innerHTML = `<tspan x="${textEl.dataset.centerX}" y="0">${
        success ? "Congratulations!" : "Time is Up!"
      }</tspan>`;

      let msg = "";
      if (isShowAnswer) {
        msg = "Here are the answers!";
      } else if (success) {
        msg = "Time is Up!";
      }
      textEl.innerHTML = `<tspan x="${textEl.dataset.centerX}" y="0">${msg}</tspan>`;
    }
  }
  hideTryAgainPopup();
}

function resetGame() {
  hideAllPopups();
  startGame();
}

window.addEventListener("DOMContentLoaded", init);
