document.addEventListener("DOMContentLoaded", () => {

  const svg = document.querySelector("svg");

  const howToPlayScreen = svg.getElementById("how-to-play--screen");
  const popupHowToPlay = svg.getElementById("popup-how-to-play");
  const popupHint = svg.getElementById("popup-hint");
  const feedbackBunny = svg.getElementById("feedback-correct-bunny");
  const feedbackFox = svg.getElementById("feedback-correct-fox");
  const feedbackEnd = svg.getElementById("Feedback-end");
  const iTextChooseSteps = svg.getElementById("i-text-choose-steps");
  const iTextBunny = svg.getElementById("i-text-bunny-player");
  const iTextFox = svg.getElementById("i-text-fox-player");

  const player1Box = svg.getElementById("player1");
  const player2Box = svg.getElementById("player2");

  const redWheel = svg.getElementById("red-spin-wheel");   // Tens (orange)
  const greenWheel = svg.getElementById("green-spin-wheel"); // Ones

  const btnSpin = svg.getElementById("btn-spin");
  const btnMove = svg.getElementById("btn-move");
  const radioDotFwd = svg.getElementById("Path_7164");
  const radioDotBwd = svg.getElementById("Path_7164-2");
  const btnNewGame = svg.getElementById("btn-new-game");
  const btnHTP = svg.getElementById("btn-how-to-play");  // ℹ icon on game board
  const btnPlayHTP = howToPlayScreen.querySelector("#Group_16"); // Play button in HTP screen
  const introScreen = svg.getElementById("intro-screen");
  const btnIntroEnter = svg.getElementById("Group_17");

  // Forward / Backward panel buttons
  // Fixed IDs: 'backward-2' is the actual ID of the forward arrow in the DOM (see console / index.html).
  // We will assign them based on what was found to be the forward arrow vs backward arrow
  const fwdPanel = svg.getElementById("forward") || svg.getElementById("backward-2") || document.querySelector("#backward-2");
  const bwdPanel = svg.getElementById("backward-3") || document.querySelector("#backward-3");
  const fwdLabel = svg.getElementById("forwar-backward-panel"); // whole panel for label clicks

  const numpadGroups = {
    '1': svg.getElementById("Group_7034"),
    '2': svg.getElementById("Group_7035"),
    '3': svg.getElementById("Group_7036"),
    '4': svg.getElementById("Group_7037"),
    '5': svg.getElementById("Group_7038"),
    '6': svg.getElementById("Group_7039"),
    '7': svg.getElementById("Group_7040"),
    '8': svg.getElementById("Group_7041"),
    '9': svg.getElementById("Group_7042"),
    '0': svg.getElementById("Group_7043"),
  };
  const numpadClear = svg.getElementById("Group_7044"); // backspace / clear X

  const targetTxtGroup = document.querySelector('[data-name="Target"]') || svg.getElementById("Target");
  const targetValGroup = document.querySelector('[data-name=" 22"]') || document.querySelector('[data-name="22"]') || svg.getElementById("_22");

  const stepValGroup = document.querySelector('[data-name=" 22-3"]') || svg.getElementById("_22-3") || svg.getElementById("How_many_steps_");
  const stepEnterBox = svg.getElementById("step-enter-box");

  const bunnyToken = svg.getElementById("bunny-on-number");
  const foxToken = svg.getElementById("fox-on-number");

  const feedbackBunnyTspan = feedbackBunny ? feedbackBunny.querySelectorAll("tspan") : [];
  const feedbackFoxTspan = feedbackFox ? feedbackFox.querySelectorAll("tspan") : [];
  const winTspan = feedbackEnd ? feedbackEnd.querySelectorAll("tspan") : [];

  const hintGroup = document.querySelector('[data-name="Move 7 steps backward to land on15."]') || svg.getElementById("Move_7_steps_backward_to_land_on15.");
  const hintTexts = hintGroup ? hintGroup.querySelectorAll('text') : [];
  const hintText1 = hintTexts[0];
  const hintText2 = hintTexts[1];
  const hintText3 = hintTexts[2];

  const instructionPrompt = svg.getElementById("Bunny_Jump_to_22_Tap_the_box_and_choose_steps_") || document.querySelector('[data-name="Bunny Jump to 22 Tap the box and choose steps "]');

  let injectedTargetPrompt, injectedTargetNum, injectedStepNum, injectedInstruction, injectedHint;

  window.addEventListener("load", () => {
    injectedTargetPrompt = replaceGroupWithText(targetTxtGroup, "Target", "end", "700", "#1a1a2e", "30", -10);
    injectedTargetNum = replaceGroupWithText(targetValGroup, "?", "middle", "700", "#d0401d", "35");
    injectedStepNum = replaceGroupWithText(stepValGroup, "?", "middle", "700", "#d0401d", "35");
    injectedInstruction = replaceGroupWithText(instructionPrompt, "Wait!", "middle", "italic", "#fff", "23", -20);

    addHitbox(btnSpin); addHitbox(btnMove); addHitbox(btnNewGame);
    addHitbox(fwdPanel); addHitbox(bwdPanel);
    addHitbox(btnHTP); addHitbox(btnPlayHTP); addHitbox(btnIntroEnter);
    addHitbox(numpadClear);
    for (let i = 0; i <= 9; i++) addHitbox(numpadGroups[i]);

    positionToken(bunnyToken, 0);
    positionToken(foxToken, 0);
  });

  function replaceGroupWithText(group, defaultStr, align, weight, color, size, offsetX = 0) {
    if (!group) return null;
    const bbox = group.getBBox();
    if (bbox.width === 0) return null; // not rendered or hidden

    group.style.display = "none";
    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");

    let tx = bbox.x + bbox.width / 2;
    if (align === "start") tx = bbox.x;
    if (align === "end") tx = bbox.x + bbox.width;

    tx += offsetX;
    let ty = bbox.y + bbox.height / 2 + (parseInt(size) * 0.35);

    textEl.setAttribute("x", tx);
    textEl.setAttribute("y", ty);
    textEl.setAttribute("text-anchor", align);
    textEl.setAttribute("font-family", "Roboto-Bold, Roboto");
    if (weight === "italic") {
      textEl.setAttribute("font-style", "italic");
      textEl.setAttribute("font-weight", "400");
    } else {
      textEl.setAttribute("font-weight", weight);
    }
    textEl.setAttribute("font-size", size);
    textEl.setAttribute("fill", color);
    textEl.textContent = defaultStr;

    group.parentNode.insertBefore(textEl, group.nextSibling);
    return textEl;
  }

  function addHitbox(group) {
    if (!group) return;
    const bbox = group.getBBox();
    if (bbox.width === 0) return;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", bbox.x);
    rect.setAttribute("y", bbox.y);
    rect.setAttribute("width", bbox.width);
    rect.setAttribute("height", bbox.height);
    rect.setAttribute("fill", "transparent");
    rect.style.cursor = "pointer";
    rect.addEventListener("click", (e) => {
    });
    group.appendChild(rect);
  }

  const CELL_COORDS = {};
  const COL_CENTRES = [115, 175, 235, 295, 355, 415, 475, 535, 595, 655]; // x centres
  const ROW_TOP_Y = 188; // centre-y of row 10 (top)
  const ROW_DY = 55;  // pixels per row going downwards

  for (let n = 1; n <= 100; n++) {
    const rowFromBottom = Math.ceil(n / 10);           // 1-indexed from bottom
    const rowFromTop = 11 - rowFromBottom;          // row index from top (1=top)
    const posInRow = (n - 1) % 10;                // 0-9 within row (left=0)
    // Row 1 (1-10) goes Right to Left. So it's NOT leftToRight.
    // Odd rows from bottom -> right-to-left. Even rows -> left-to-right.
    const leftToRight = (rowFromBottom % 2 === 0);
    const col = leftToRight ? posInRow : (9 - posInRow);

    // Explicit calculations: X goes from Right (670) to Left (103) for cells 1-10
    const CELL_SIZE_X = 64;     // exact horizontal spacing
    const CELL_SIZE_Y = 63;     // exact vertical spacing

    const LEFT_START = 103;    // center of cell 1 (bottom-right row end)
    const RIGHT_START = LEFT_START + (CELL_SIZE_X * 9);
    // 103 + (63 * 9) = 670

    let absX;

    if (rowFromBottom % 2 !== 0) {
      // Odd rows (1–10, 21–30...) → Right to Left
      absX = RIGHT_START - (posInRow * CELL_SIZE_X);
    } else {
      // Even rows → Left to Right
      absX = LEFT_START + (posInRow * CELL_SIZE_X);
    }

    let absY = 716 - ((rowFromBottom - 1) * CELL_SIZE_Y);
    CELL_COORDS[n] = {
      x: absX,
      y: absY
    };
  }

  const HOME_POS = { x: 670, y: 760 };

  const BUNNY_BASE = { x: 638, y: 591 };
  const FOX_BASE = { x: 388, y: 614 };

  const state = {
    currentPlayer: 1,      // 1 = Bunny, 2 = Fox
    positions: [0, 0],     // index 0 = Bunny, 1 = Fox  (0 = HOME)
    targetNumber: null,
    tensValue: null,
    onesValue: null,
    direction: null,       // 'forward' | 'backward'
    stepsInput: '',
    phase: 'spin',         // 'spin' | 'direction' | 'steps' | 'animating' | 'done'
    spinning: false,
  };

  function show(el) {
    if (el) {
      el.classList.remove("g-hidden");
      el.classList.add("g-fade-in");
    }
  }
  function hide(el) {
    if (el) {
      el.classList.add("g-hidden");
      el.classList.remove("g-fade-in");
    }
  }

  function initLayers() {
    show(howToPlayScreen);
    hide(popupHowToPlay);
    hide(feedbackBunny);
    hide(feedbackFox);
    hide(feedbackEnd);
    hide(popupHint);
    hide(iTextChooseSteps);
    // Default: show Bunny instruction text, hide Fox
    show(iTextBunny);
    hide(iTextFox);
    show(player1Box);
    hide(player2Box);
    // Disable spin / move / numpad until game starts
    setButtonCursor(btnSpin, true);
    setButtonCursor(btnMove, true);
  }

  function setButtonCursor(el, pointer) {
    if (el) el.style.cursor = pointer ? "pointer" : "default";
  }

  function positionToken(tokenEl, pos) {
    if (!tokenEl) return;

    const coord = pos === 0 ? HOME_POS : CELL_COORDS[pos];
    if (!coord) return;

    const bbox = tokenEl.getBBox();

    const tokenCenterX = bbox.x + bbox.width / 2;
    const tokenCenterY = bbox.y + bbox.height / 2;

    const tx = coord.x - tokenCenterX;
    const ty = coord.y - tokenCenterY;

    tokenEl.style.transition = "transform 0.4s ease-in-out";
    tokenEl.style.transform = `translate(${tx}px, ${ty}px)`;
  }

  // Animate token movement one step at a time
  function animateMove(playerIdx, fromPos, toPos, onDone) {
    const tokenEl = playerIdx === 0 ? bunnyToken : foxToken;
    const step = toPos > fromPos ? 1 : -1;
    let current = fromPos;

    const interval = setInterval(() => {
      current += step;
      positionToken(tokenEl, current);
      if (current === toPos) {
        clearInterval(interval);
        // Bounce effect
        tokenEl.classList.add("token-bounce");
        setTimeout(() => { tokenEl.classList.remove("token-bounce"); }, 600);
        if (onDone) onDone();
      }
    }, 160);
  }

  function updateTargetDisplay(num) {
    const val = num !== null ? String(num) : "?";
    if (injectedTargetNum) injectedTargetNum.textContent = val;
    if (injectedTargetPrompt) {
      if (state.targetNumber === null) {
        injectedTargetPrompt.textContent = "Target";
      } else {
        injectedTargetPrompt.textContent = `Target`;
      }
    }
  }

  function updateStepDisplay(val) {
    const stepStr = val || "?";
    if (injectedStepNum) injectedStepNum.textContent = stepStr;
  }

  function updateInstructionText(text) {
    if (injectedInstruction) injectedInstruction.textContent = text;
  }

  // Update text inside the wheel to show landed digit
  function updateWheelText(wheelEl, digit) {
    // The wheel number texts are <tspan> children inside the wheel group
    // We add a prominent numeric overlay using a temporary <text> element
    const existing = wheelEl.querySelector(".wheel-result-text");
    if (existing) existing.remove();
    const bbox = wheelEl.getBBox ? wheelEl.getBBox() : { x: 0, y: 0, width: 264, height: 264 };
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2 + 18;
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", cx);
    txt.setAttribute("y", cy);
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("font-size", "90");
    txt.setAttribute("font-weight", "700");
    txt.setAttribute("fill", "#1a1a2e");
    txt.setAttribute("font-family", "Roboto-Bold, Roboto");
    txt.setAttribute("class", "wheel-result-text");
    txt.textContent = String(digit);
    wheelEl.appendChild(txt);
  }

  function updateTurnDisplay() {
    if (state.currentPlayer === 1) {
      show(iTextBunny);
      hide(iTextFox);
      show(player1Box);
      hide(player2Box);
    } else {
      hide(iTextBunny);
      show(iTextFox);
      hide(player1Box);
      show(player2Box);
    }
  }

  if (btnPlayHTP) {
    btnPlayHTP.style.cursor = "pointer";
    btnPlayHTP.addEventListener("click", startGame);
  }

  if (btnHTP) {
    btnHTP.style.cursor = "pointer";
    btnHTP.addEventListener("click", () => {
      if (popupHowToPlay.classList.contains("g-hidden")) {
        show(popupHowToPlay);
      }
    });
  }

  // Close popup-how-to-play on click within the close button (green X circle)
  const closeHTPBtn = popupHowToPlay ? popupHowToPlay.querySelector("#Group_1205") : null;
  if (closeHTPBtn) {
    closeHTPBtn.style.cursor = "pointer";
    closeHTPBtn.addEventListener("click", () => hide(popupHowToPlay));
  }

  if (btnIntroEnter) {
    btnIntroEnter.style.cursor = "pointer";
    btnIntroEnter.addEventListener("click", () => {
      hide(introScreen);
    });
  }

  function startGame() {
    hide(howToPlayScreen);
    hide(introScreen);
    resetGameState();
    updateTurnDisplay();
    show(iTextBunny);
  }

  if (btnSpin) {
    btnSpin.style.cursor = "pointer";
    btnSpin.addEventListener("click", () => {
      if (state.phase !== 'spin' || state.spinning) return;
      state.spinning = true;

      state.tensValue = Math.floor(Math.random() * 10);  // 0-9
      state.onesValue = Math.floor(Math.random() * 10);  // 0-9

      const target = state.tensValue * 10 + state.onesValue;
      state.targetNumber = target === 0 ? 100 : target; // Modified to 100 if 00

      const currentTensRotation = state.redWheelRot || 0;
      const currentOnesRotation = state.greenWheelRot || 0;

      const currentTensDigit = Math.round((360 - (currentTensRotation % 360)) / 36) % 10;
      const currentOnesDigit = Math.round((360 - (currentOnesRotation % 360)) / 36) % 10;

      let tensDiff = currentTensDigit - state.tensValue;
      if (tensDiff < 0) tensDiff += 10;
      state.redWheelRot = currentTensRotation + 360 * 4 + tensDiff * 36;

      let onesDiff = currentOnesDigit - state.onesValue;
      if (onesDiff < 0) onesDiff += 10;
      state.greenWheelRot = currentOnesRotation + 360 * 5 + onesDiff * 36;

      if (redWheel) {
        let bbox = redWheel.getBBox();
        redWheel.style.transformOrigin = `${bbox.x + bbox.width / 2}px ${bbox.y + bbox.height / 2}px`;
        redWheel.style.transition = "transform 1.9s cubic-bezier(0.2, 0, 0.4, 1)";
        redWheel.style.transform = `rotate(${state.redWheelRot}deg)`;
      }
      if (greenWheel) {
        let bbox = greenWheel.getBBox();
        greenWheel.style.transformOrigin = `${bbox.x + bbox.width / 2}px ${bbox.y + bbox.height / 2}px`;
        greenWheel.style.transition = "transform 2.2s cubic-bezier(0.25, 0, 0.45, 1)";
        greenWheel.style.transform = `rotate(${state.greenWheelRot}deg)`;
      }

      setTimeout(() => {
        updateTargetDisplay(state.targetNumber);

        state.phase = 'direction';
        const playerStr = state.currentPlayer === 1 ? "Bunny" : "Fox";
        updateInstructionText(`${playerStr}! Target: ${state.targetNumber}. Fwd / Bwd?`);
        state.spinning = false;

        show(iTextChooseSteps);
      }, 2300);
    });
  }

  function selectDirection(dir) {
    console.log("Direction selected!");
    if (state.phase !== 'direction' && state.phase !== 'steps') return;
    state.direction = dir;
    state.phase = 'steps';
    // Visual feedback  
    if (dir === 'forward') {
      console.log("Forward selected!");
      fwdPanel && fwdPanel.classList.add("dir-selected");
      bwdPanel && bwdPanel.classList.remove("dir-selected");
      show(radioDotFwd);
      hide(radioDotBwd);
    } else {
      console.log("Backward selected!");
      bwdPanel && bwdPanel.classList.add("dir-selected");
      fwdPanel && fwdPanel.classList.remove("dir-selected");
      show(radioDotBwd);
      hide(radioDotFwd);
    }

    const playerStr = state.currentPlayer === 1 ? "Bunny" : "Fox";
    updateInstructionText(`${playerStr}! Target: ${state.targetNumber}. How many steps?`);
  }

  const fwdPill = svg.getElementById("forward") || svg.getElementById("backward-2");
  const bwdPill = svg.getElementById("backward-3");

  if (fwdPill) {
    fwdPill.style.cursor = "pointer";
    fwdPill.addEventListener("click", () => selectDirection('forward'));
  }
  // Also hook the Forward label text in forwar-backward-panel
  const fwdTextGroup = svg.getElementById("Forward-2");
  if (fwdTextGroup) {
    fwdTextGroup.style.cursor = "pointer";
    fwdTextGroup.addEventListener("click", () => selectDirection('forward'));
  }

  if (bwdPill) {
    bwdPill.style.cursor = "pointer";
    bwdPill.addEventListener("click", () => selectDirection('backward'));
  }
  const bwdTextGroup = svg.getElementById("Backward");
  if (bwdTextGroup) {
    bwdTextGroup.style.cursor = "pointer";
    bwdTextGroup.addEventListener("click", () => selectDirection('backward'));
  }

  Object.entries(numpadGroups).forEach(([digit, el]) => {
    if (!el) return;
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      if (state.phase === 'direction') {
        // Force the user to pick a direction by shaking the fwd/bwd panel
        if (fwdLabel) {
          fwdLabel.classList.add("steps-wrong");
          setTimeout(() => fwdLabel.classList.remove("steps-wrong"), 500);
        }
        return;
      }
      if (state.phase !== 'steps') return;
      if (state.stepsInput.length >= 2) return;
      state.stepsInput += digit;
      updateStepDisplay(state.stepsInput);
      // Press flash
      el.classList.add("numpad-press");
      setTimeout(() => el.classList.remove("numpad-press"), 200);
    });
  });

  if (numpadClear) {
    numpadClear.style.cursor = "pointer";
    numpadClear.addEventListener("click", () => {
      if (state.phase !== 'steps') return;
      state.stepsInput = state.stepsInput.slice(0, -1);
      updateStepDisplay(state.stepsInput || '');
    });
  }
  if (btnMove) {
    btnMove.style.cursor = "pointer";
    btnMove.addEventListener("click", handleMove);
  }

  function handleMove() {
    console.log("Moved!");
    if (state.phase !== 'steps') return;
    if (!state.stepsInput || !state.direction) return;

    const steps = parseInt(state.stepsInput, 10);
    const playerIdx = state.currentPlayer - 1;
    const currentPos = state.positions[playerIdx] || 0;
    let newPos = currentPos + (state.direction === 'forward' ? steps : -steps);
    newPos = Math.max(1, Math.min(100, newPos));

    const correct = (newPos === state.targetNumber);

    if (!correct) {
      // Wrong answer — shake the step box and show hint automatically
      if (stepEnterBox) {
        stepEnterBox.classList.add("steps-wrong");
        setTimeout(() => stepEnterBox.classList.remove("steps-wrong"), 500);
      }
      showHint();
      return;
    }

    // Correct!
    hide(popupHint);
    state.phase = 'animating';
    state.positions[playerIdx] = newPos;

    animateMove(playerIdx, currentPos, newPos, () => {
      // Show feedback
      const name = state.currentPlayer === 1 ? "Bunny" : "Fox";
      if (state.currentPlayer === 1) {
        // Update feedback text: "Bunny jumped to N!"
        if (feedbackBunnyTspan.length >= 2) {
          feedbackBunnyTspan[feedbackBunnyTspan.length - 1].textContent = newPos + "!";
        }
        hide(feedbackFox);
        show(feedbackBunny);
      } else {
        if (feedbackFoxTspan.length >= 2) {
          feedbackFoxTspan[feedbackFoxTspan.length - 1].textContent = newPos + "!";
        }
        hide(feedbackBunny);
        show(feedbackFox);
      }

      // Check win condition (land on 91-100)
      if (newPos >= 91) {
        triggerWin(name, newPos);
        return;
      }

      // Next turn after 2s
      setTimeout(nextTurn, 2000);
    });
  }

  function triggerWin(playerName, num) {
    state.phase = 'done';
    hide(feedbackBunny);
    hide(feedbackFox);
    hide(popupHint);
    show(feedbackEnd);
    feedbackEnd.classList.add("win-pulse");

    if (winTspan.length > 0) {
      for (let t of winTspan) {
        const content = t.textContent.trim();
        if (content === "93" || /^\d+$/.test(content)) {
          t.textContent = String(num);
        }
        if (content.includes("Bunny") || content.includes("Fox")) {
          t.textContent = t.textContent
            .replace("Bunny", playerName)
            .replace("Fox", playerName);
        }
      }
    }
  }

  function nextTurn() {
    hide(feedbackBunny);
    hide(feedbackFox);
    hide(iTextChooseSteps);

    // Clear direction highlights
    fwdPanel && fwdPanel.classList.remove("dir-selected");
    bwdPanel && bwdPanel.classList.remove("dir-selected");
    if (fwdPill) fwdPill.classList.remove("dir-selected");
    if (bwdPill) bwdPill.classList.remove("dir-selected");

    // Switch player
    state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
    state.direction = null;
    state.stepsInput = '';
    state.targetNumber = null;
    state.tensValue = null;
    state.onesValue = null;
    state.phase = 'spin';

    updateStepDisplay('');
    updateTargetDisplay(null);
    updateTurnDisplay();

    // Remove wheel result overlays
    [redWheel, greenWheel].forEach(w => {
      const r = w && w.querySelector(".wheel-result-text");
      if (r) r.remove();
    });
  }

  const hintBtnGroup = svg.getElementById("Group_7091-2") || document.querySelector('[data-name="Group 7091-2"]');
  if (hintBtnGroup) {
    hintBtnGroup.style.cursor = "pointer";
    hintBtnGroup.addEventListener("click", showHint);
  }
  // Also hook the hint button visible on board (inside popup-hint)
  const hintDismissBtn = popupHint ? popupHint.querySelector("[id^='Rectangle_2-5']") : null;
  const hintDismissParent = popupHint ? popupHint.querySelector("#Group_7091-2") : null;

  function showHint() {
    if (state.phase !== 'steps' && state.phase !== 'direction') return;
    hide(iTextChooseSteps);
    show(popupHint);

    const playerIdx = state.currentPlayer - 1;
    const currentPos = state.positions[playerIdx] || 0;
    const target = state.targetNumber;
    if (!target) return;

    const diff = target - currentPos;
    const dir = diff > 0 ? "forward" : "backward";
    const abs = Math.abs(diff);

    // Update hint text
    if (hintText1) hintText1.innerHTML = `<tspan x="0" y="0">Move ${abs} steps</tspan>`;
    if (hintText2) hintText2.innerHTML = `<tspan x="0" y="0">${dir}</tspan>`;
    if (hintText3) hintText3.innerHTML = `<tspan x="0" y="0">to land on ${target}.</tspan>`;

    show(popupHint);
  }

  // Dismiss on Hint button click within the popup
  if (hintDismissParent) {
    hintDismissParent.style.cursor = "pointer";
    hintDismissParent.addEventListener("click", () => {
      hide(popupHint);
      if (state.phase === 'steps') show(iTextChooseSteps);
    });
  }

  if (btnNewGame) {
    btnNewGame.style.cursor = "pointer";
    btnNewGame.addEventListener("click", resetGame);
  }

  function resetGame() {
    feedbackEnd && feedbackEnd.classList.remove("win-pulse");
    hide(feedbackEnd);
    hide(feedbackBunny);
    hide(feedbackFox);
    hide(popupHint);
    resetGameState();
    updateTurnDisplay();
  }

  function resetGameState() {
    state.currentPlayer = 1;
    state.positions = [0, 0];
    state.targetNumber = null;
    state.tensValue = null;
    state.onesValue = null;
    state.direction = null;
    state.stepsInput = '';
    state.phase = 'spin';
    state.spinning = false;

    // Reset displays
    updateTargetDisplay(null);
    updateStepDisplay('');

    // Remove wheel result overlays
    [redWheel, greenWheel].forEach(w => {
      const r = w && w.querySelector(".wheel-result-text");
      if (r) r.remove();
    });

    // Clear direction highlights
    [fwdPanel, bwdPanel, fwdPill, bwdPill].forEach(el => {
      el && el.classList.remove("dir-selected");
    });

    // Reset tokens to HOME
    positionToken(bunnyToken, 0);
    positionToken(foxToken, 0);
  }

  initLayers();
  updateTargetDisplay(null);
  updateStepDisplay('');
  positionToken(bunnyToken, 0);
  positionToken(foxToken, 0);
});
