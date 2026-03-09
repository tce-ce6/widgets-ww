const MODES = {
  CHIP: "chip",
  NUMBER_LINE: "number-line",
};

class ProblemGenerator {
  generate(isNumberLineMode = false) {
    let a, b, sum;
    do {
      // Generate two random integers between -10 and 10
      a = Math.floor(Math.random() * 21) - 10;
      b = Math.floor(Math.random() * 21) - 10;
      sum = a + b;
    } while (isNumberLineMode && (sum < -10 || sum > 10));

    return { a, b, answer: sum };
  }
}

class StateManager {
  constructor() {
    this.mode = MODES.CHIP;
    this.currentProblem = null;
    this.userAnswer = "";
    this.addedChips = []; // { type: 'plus' | 'minus', element: SVGElement }
    this.generator = new ProblemGenerator();
    this.isPlayground = false;
    this.isEnteringCustomProblem = false;
    this.customInputs = { a: "", b: "" };
    this.activeInput = "a";
    this.isAnswerBoxFocused = false;
    this.customProblemString = "";
  }

  setMode(mode) {
    this.mode = mode;
  }

  newProblem() {
    this.currentProblem = this.generator.generate(
      this.mode === MODES.NUMBER_LINE,
    );
    this.userAnswer = "";
    this.addedChips = [];
    return this.currentProblem;
  }
}

class UIManager {
  constructor(state) {
    this.state = state;
    this.initializeElements();
    this.attachEventListeners();
    this.updateUI();
  }

  initializeElements() {
    // Methods
    this.chipMethodBtn = document.getElementById("chip-method-btn");
    this.numberLineBtn = document.getElementById("number-line-btn");
    this.chipMethodText = document.getElementById("chip-method-text");
    this.numberLineText = document.getElementById("number-line-text");
    this.chipMethodGroup = document.getElementById("add-symbol-patch");
    this.addPlusBtn = document.getElementById("add-plus-button");
    this.addMinusBtn = document.getElementById("add-minus-btn");
    this.timelineGroup = document.getElementById("timeline");
    this.chipInstruction = document.getElementById("i-text-01");
    this.dynamicChipsGroup = document.getElementById("dynamic-chips");

    // Display
    this.questionTxt = document.querySelector("#question-txt tspan");
    this.answerBox =
      document.querySelector("#answer-patch text tspan") ||
      this.createAnswerText();
    this.answerBorder = document.getElementById("answer-border");
    this.answerPatch = document.getElementById("answer-patch");

    // Buttons
    this.newProblemBtn = document.getElementById("new-problem-btn");
    this.submitBtn = document.getElementById("submit-btn");
    this.showAnswerBtn = document.getElementById("show-answer-btn");
    this.hintBtn = document.getElementById("hint-btn");
    this.playgroundBtn = document.getElementById("playground-mode-btn");
    this.customProblemBtn = document.getElementById("custom-problem-btn");
    this.startBtn =
      document.getElementById("start") || document.getElementById("click-btn");

    // Keypad Overlay (for custom problem entry)
    this.keypadGroup = document.getElementById("keypad-group");

    // Templates
    this.plusTemplate = document.getElementById("plus-symbol");
    this.minusTemplate = document.getElementById("minus-symbol");

    // Hint Modal
    this.hintModalGroup = document.getElementById("hint-modal-group");
    this.hintCloseBtn = document.getElementById("hint-close-btn");

    this.keypadDisplayText = document.querySelector(
      "#nubpad-display-text tspan",
    );

    // Keypad Mapping
    this.keypad = {
      1: document.getElementById("nubpad-1"),
      2: document.getElementById("nubpad-2"),
      3: document.getElementById("nubpad-3"),
      4: document.getElementById("nubpad-4"),
      5: document.getElementById("nubpad-5"),
      6: document.getElementById("nubpad-6"),
      7: document.getElementById("nubpad-7"),
      8: document.getElementById("nubpad-8"),
      9: document.getElementById("nubpad-9"),
      0: document.getElementById("nubpad-0"), // Will add to HTML if missing
      "+": document.getElementById("nubpad-plus"),
      "-": document.getElementById("nubpad-minus"),
      backspace: document.getElementById("nubpad-backspace"),
    };

    // Chip Layout Info
    this.plusIndex = 0;
    this.minusIndex = 0;
    this.chipRows = { plus: 450, minus: 670 }; // Group start Y positions
    this.maxCols = 10;
    this.chipGapX = 120;
    this.chipGapY = 140;
    this.chipStartX = 50;
    this.selectedChip = null;

    // Number Line Config
    // Number Line Config — exact tick center X positions from SVG rect x + width/2
    this.tickX = {
      0: 897.78,
      1: 955.29,
      2: 1024.42,
      3: 1093.56,
      4: 1162.69,
      5: 1231.82,
      6: 1300.96,
      7: 1370.09,
      8: 1439.23,
      9: 1508.36,
      10: 1577.49,
      "-1": 840.27,
      "-2": 771.13,
      "-3": 702.0,
      "-4": 632.87,
      "-5": 563.73,
      "-6": 494.6,
      "-7": 425.46,
      "-8": 356.33,
      "-9": 287.2,
      "-10": 218.06,
    };
    this.getTickX = (val) => this.tickX[val.toString()] ?? 897.78 + val * 69.13;
    this.point = document.getElementById("click-btn");
    this.startTextGroup = document.getElementById("start");
    this.arrowsGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    this.arrowsGroup.setAttribute("id", "arrows-container");
    this.timelineGroup.appendChild(this.arrowsGroup);

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    this.lottieFeedbackContainer = document.getElementById("lottie-feedback");

    const dustbin = document.getElementById("dustbin");
    if (dustbin) {
      dustbin.addEventListener("click", () => {
        if (this.state.isPlayground && this.selectedChip) {
          this.removeChip(this.selectedChip.element);
        }
      });
      dustbin.style.cursor = "pointer";
    }

    // Hide Keypad by default
    this.hideKeypad();
  }

  createAnswerText() {
    const parent = document.getElementById("answer-patch");
    if (!parent) return null;
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("transform", "translate(1083.5 285)");
    text.setAttribute("fill", "#000db9");
    text.setAttribute("font-family", "Roboto-Bold, Roboto");
    text.setAttribute("font-size", "45");
    text.setAttribute("font-weight", "700");
    text.setAttribute("text-anchor", "middle");
    const tspan = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan",
    );
    text.appendChild(tspan);
    parent.appendChild(text);
    return tspan;
  }

  attachEventListeners() {
    this.chipMethodBtn.addEventListener("click", () => {
      this.state.isPlayground = false;
      this.state.setMode(MODES.CHIP);
      this.updateUI();
    });

    this.chipMethodText.addEventListener("click", () => {
      this.state.isPlayground = false;
      this.state.setMode(MODES.CHIP);
      this.updateUI();
    });

    this.numberLineBtn.addEventListener("click", () => {
      this.state.isPlayground = false;
      this.state.setMode(MODES.NUMBER_LINE);
      this.updateUI();
    });

    this.numberLineText.addEventListener("click", () => {
      this.state.isPlayground = false;
      this.state.setMode(MODES.NUMBER_LINE);
      this.updateUI();
    });

    this.playgroundBtn.addEventListener("click", () => {
      this.state.isPlayground = !this.state.isPlayground; // Toggle mode
      this.state.setMode(MODES.CHIP);
      this.state.userAnswer = "";
      this.clearChips();
      this.updateUI();
    });

    this.customProblemBtn.addEventListener("click", () => {
      this.showCustomProblemEntry();
    });

    this.newProblemBtn.addEventListener("click", () => {
      this.state.isPlayground = false;
      this.state.newProblem();
      this.clearChips();
      this.autoAddProblemChips();
      this.clearNumberLine();
      this.updateUI();
    });

    this.addPlusBtn.addEventListener("click", () =>
      this.addChip(this.btn1Type || "plus"),
    );
    this.addMinusBtn.addEventListener("click", () =>
      this.addChip(this.btn2Type || "minus"),
    );

    const realStartBtn = document.getElementById("start");
    if (realStartBtn) {
      realStartBtn.addEventListener("click", () => this.animateNumberLine());
    }

    // Keypad listeners
    Object.keys(this.keypad).forEach((key) => {
      const btn = this.keypad[key];
      if (btn) {
        btn.addEventListener("click", () =>
          this.handleKeypress(key.toString()),
        );
      }
    });

    // Done button on keypad
    const doneBtn = document.getElementById("nubpad-done");
    if (doneBtn) {
      doneBtn.addEventListener("click", () => {
        if (this.state.isEnteringCustomProblem) {
          this.finalizeCustomProblem();
        } else {
          this.checkAnswer();
        }
      });
    }

    const closeKeypadBtn = document.getElementById("nubpad-close-btn");
    if (closeKeypadBtn) {
      closeKeypadBtn.addEventListener("click", () => {
        this.hideKeypad();
      });
    }

    if (this.submitBtn) {
      this.submitBtn.addEventListener("click", () => this.checkAnswer());
    }

    if (this.answerPatch) {
      this.answerPatch.addEventListener("click", (e) => {
        e.stopPropagation();
        this.state.isAnswerBoxFocused = true;
        this.state.isEnteringCustomProblem = false;
        this.updateUI();
      });
    }

    // Global keyboard listener
    window.addEventListener("keydown", (e) => {
      if (this.state.isAnswerBoxFocused) {
        if ((e.key >= "0" && e.key <= "9") || e.key === "-") {
          this.handleKeypress(e.key);
        } else if (e.key === "Backspace") {
          this.handleKeypress("backspace");
        } else if (e.key === "Enter") {
          this.checkAnswer();
        } else if (e.key === "Escape") {
          this.state.isAnswerBoxFocused = false;
          this.updateUI();
        }
      }
    });

    // Remove focus when clicking elsewhere
    window.addEventListener("click", () => {
      if (this.state.isAnswerBoxFocused) {
        this.state.isAnswerBoxFocused = false;
        this.updateUI();
      }
    });

    this.showAnswerBtn.addEventListener("click", () => this.showAnswer());
    this.hintBtn.addEventListener("click", () => this.showHint());

    if (this.hintCloseBtn) {
      this.hintCloseBtn.addEventListener("click", () => this.hideHint());
    }

    this.attachTimelineListeners();
  }

  attachTimelineListeners() {
    const tickMapping = {
      Rectangle_446: 0,
      Rectangle_456: 1,
      Rectangle_457: 2,
      Rectangle_458: 3,
      Rectangle_459: 4,
      Rectangle_460: 5,
      Rectangle_461: 6,
      Rectangle_462: 7,
      Rectangle_463: 8,
      Rectangle_464: 9,
      Rectangle_465: 10,
      Rectangle_447: -1,
      Rectangle_448: -2,
      Rectangle_449: -3,
      Rectangle_450: -4,
      Rectangle_451: -5,
      Rectangle_452: -6,
      Rectangle_453: -7,
      Rectangle_454: -8,
      Rectangle_455: -9,
      Rectangle_466: -10,
    };

    Object.keys(tickMapping).forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
          if (
            this.state.mode === MODES.NUMBER_LINE &&
            !this.state.isAnimating
          ) {
            const val = tickMapping[id];
            this.state.userAnswer = val.toString();
            this.updateUI();
          }
        });
      }
    });
  }

  // --- Number Line Logic ---

  async animateNumberLine() {
    if (this.state.isAnimating) return;
    this.state.isAnimating = true;

    this.clearNumberLine();
    this.updateNumberLinePosition(); // Ensure point is at 'a' before starting
    const { a, b } = this.state.currentProblem;

    // Step 1: Move from 0 to 'a'
    const colorA = a >= 0 ? "#1212dd" : "#ff2020"; // Blue for +, Red for -
    await this.drawArrow(0, a, colorA);

    // Step 2: Move from 'a' to 'a + b'
    const colorB = b >= 0 ? "#1212dd" : "#ff2020"; // Right for +, Left for -
    await this.drawArrow(a, a + b, colorB);

    this.state.isAnimating = false;
  }

  updateNumberLinePosition(val = null) {
    if (!this.state.currentProblem && val === null) return;
    const targetVal = val !== null ? val : this.state.currentProblem.a;
    const x = this.getTickX(targetVal);

    // Position point (yellow dot)
    // The point is inside <g id="click-btn">. Original point cx is 1232.
    if (this.point) {
      const offsetX = x - 1232;
      this.point.setAttribute("transform", `translate(${offsetX}, 0)`);
      this.point.setAttribute("display", "inline");
    }

    // Position "Start" label
    if (this.startTextGroup) {
      const offsetX = x - 1232;
      this.startTextGroup.setAttribute("transform", `translate(${offsetX}, 0)`);
      // Only show "Start" label for the actual starting number 'a'
      const isActuallyStart =
        this.state.currentProblem && targetVal === this.state.currentProblem.a;
      this.startTextGroup.setAttribute(
        "display",
        isActuallyStart ? "inline" : "none",
      );
    }
  }

  drawArrow(fromVal, toVal, color) {
    return new Promise((resolve) => {
      const fromX = this.getTickX(fromVal);
      const toX = this.getTickX(toVal);
      const y = 570; // Base Y of the timeline

      // Create arrow line
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      const height = toVal - fromVal > 0 ? -50 : -50; // Curve height
      const midX = (fromX + toX) / 2;
      const d = `M ${fromX} ${y} Q ${midX} ${y + height} ${toX} ${y}`;

      line.setAttribute("d", d);
      line.setAttribute("fill", "none");
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-width", "4");
      line.setAttribute("stroke-dasharray", "1000");
      line.setAttribute("stroke-dashoffset", "1000");

      // Add arrowhead
      const head = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      head.setAttribute("d", `M ${toX} ${y} l -10 -10 m 10 10 l -10 10`); // Simplified arrowhead
      head.setAttribute("stroke", color);
      head.setAttribute("stroke-width", "4");
      head.style.opacity = "0";

      // Add label (Forward/Backward)
      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      const isForward = toVal - fromVal > 0;
      label.textContent = isForward ? "Forward (+)" : "Backward (-)";
      label.setAttribute("x", midX);
      label.setAttribute("y", y + height - 10);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "20");
      label.setAttribute("fill", color);
      label.style.opacity = "0";
      label.style.transition = "opacity 0.5s";

      this.arrowsGroup.appendChild(line);
      this.arrowsGroup.appendChild(head);
      this.arrowsGroup.appendChild(label);

      // Animate line
      line.style.transition = "stroke-dashoffset 1s ease-in-out";
      setTimeout(() => {
        line.style.strokeDashoffset = "0";
        label.style.opacity = "1";

        // Move point along
        // The point's original position is at 1232, so we need to adjust the translate
        this.point.setAttribute("transform", `translate(${toX - 1232}, 0)`);

        setTimeout(() => {
          head.style.opacity = "1";
          resolve();
        }, 1000);
      }, 50);
    });
  }

  clearNumberLine() {
    this.arrowsGroup.innerHTML = "";
    // Reset point to its original position (no translation)
    this.point.setAttribute("transform", "translate(0, 0)");
    this.currentPointX = this.zeroX;
  }

  // --- Completion & Feedback ---

  showHint() {
    if (this.hintModalGroup) {
      this.hintModalGroup.setAttribute("display", "inline");
    }
  }

  hideHint() {
    if (this.hintModalGroup) {
      this.hintModalGroup.setAttribute("display", "none");
    }
  }

  showAnswer() {
    this.state.userAnswer = this.state.currentProblem.answer.toString();
    this.answerBox.textContent = this.state.userAnswer;

    if (this.state.mode === MODES.CHIP) {
      this.autoAddProblemChips();
    } else {
      this.animateNumberLine();
    }
  }

  autoAddProblemChips() {
    this.clearChips();
    if (!this.state.currentProblem) return;
    const { a, b } = this.state.currentProblem;
    let globalIndex = 0;

    for (let i = 0; i < Math.abs(a); i++) {
      this.addChip(a >= 0 ? "plus" : "minus", true, globalIndex++);
    }

    // Move to the next row for 'b'
    globalIndex = Math.ceil(globalIndex / this.maxCols) * this.maxCols;

    for (let i = 0; i < Math.abs(b); i++) {
      this.addChip(b >= 0 ? "plus" : "minus", true, globalIndex++);
    }
  }

  checkAnswer() {
    const isCorrect =
      parseInt(this.state.userAnswer) === this.state.currentProblem.answer;
    const tspan = this.chipInstruction.querySelector("tspan:last-child");

    if (isCorrect) {
      // if (tspan)
      //   tspan.textContent =
      //     "Correct! The sum is the final count of chips or the final position.";
      // Color answer box border green
      if (this.answerBorder)
        this.answerBorder.setAttribute("stroke", "#4caf50");
    } else {
      // if (tspan)
      //   tspan.textContent =
      //     "Check if you canceled all zero pairs or moved the correct direction.";
      // Color answer box border red
      if (this.answerBorder)
        this.answerBorder.setAttribute("stroke", "#ff2020");
    }
    // this.chipInstruction.setAttribute("display", "inline");
    this.playFeedbackAnimation(isCorrect);

    setTimeout(() => {
      if (this.answerBorder)
        this.answerBorder.setAttribute("stroke", "#000db9");
    }, 2000);
  }

  playFeedbackAnimation(isCorrect) {
    if (!this.lottieFeedbackContainer) return;

    // Clear previous animation
    this.lottieFeedbackContainer.innerHTML = "";
    this.lottieFeedbackContainer.style.display = "flex";

    const animationPath = isCorrect
      ? "assets/animation/correct-confetti-anim.json"
      : "assets/animation/incorrect-cross-anim.json";

    const anim = lottie.loadAnimation({
      container: this.lottieFeedbackContainer,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: animationPath,
    });

    anim.onComplete = () => {
      setTimeout(() => {
        this.lottieFeedbackContainer.style.display = "none";
        this.lottieFeedbackContainer.innerHTML = "";
      }, 1000);
    };
  }

  // --- UI Methods ---

  showKeypad(isAnswerBox = false) {
    if (this.keypadGroup) this.keypadGroup.setAttribute("display", "inline");
    if (!isAnswerBox) {
      this.state.customProblemString = "";
      if (this.keypadDisplayText) this.keypadDisplayText.textContent = "";
    }
  }

  hideKeypad() {
    if (this.keypadGroup) this.keypadGroup.setAttribute("display", "none");
    this.state.isEnteringCustomProblem = false;
  }

  showCustomProblemEntry() {
    this.state.isEnteringCustomProblem = true;
    this.showKeypad(false);
  }

  finalizeCustomProblem() {
    const cleaned = this.state.customProblemString.replace(/\s+/g, "");
    const match = cleaned.match(/^(-?\d+)\+(-?\d+)$/);

    if (!match) {
      alert("Please enter a problem in the format 'a + b' (e.g., 5 + 3)");
      return;
    }

    const a = parseInt(match[1]);
    const b = parseInt(match[2]);

    if (isNaN(a) || isNaN(b) || a < -10 || a > 10 || b < -10 || b > 10) {
      alert("Please enter values between -10 and 10.");
      return;
    }

    this.state.currentProblem = { a, b, answer: a + b };
    this.state.isEnteringCustomProblem = false;
    this.state.isPlayground = false;
    this.clearChips();
    this.autoAddProblemChips();
    this.hideKeypad();
    this.updateUI();
  }

  handleKeypress(key) {
    if (this.state.isEnteringCustomProblem) {
      this.handleCustomInput(key);
    } else {
      this.handleAnswerInput(key);
    }
  }

  handleCustomInput(key) {
    if (key === "backspace") {
      this.state.customProblemString = this.state.customProblemString.slice(
        0,
        -1,
      );
    } else {
      // Map nubpad keys to characters
      let char = "";
      if (!isNaN(key)) char = key;
      else if (key === "+") char = " + ";
      else if (key === "-") char = "-";
      else if (key === "=") return; // Ignore = in entry if it exists

      this.state.customProblemString += char;
    }

    if (this.keypadDisplayText) {
      this.keypadDisplayText.textContent = this.state.customProblemString;
    }
  }

  handleAnswerInput(key) {
    if (key === "backspace") {
      this.state.userAnswer = this.state.userAnswer.slice(0, -1);
    } else {
      if ((key === "+" || key === "-") && this.state.userAnswer === "") {
        this.state.userAnswer = key === "-" ? "-" : "";
      } else if (!isNaN(key)) {
        this.state.userAnswer += key;
      }
    }
    this.answerBox.textContent = this.state.userAnswer;
  }

  updateQuestionText() {
    if (this.state.isEnteringCustomProblem) {
      const a = this.state.customInputs.a || "_";
      const b = this.state.customInputs.b || "_";
      this.questionTxt.textContent = `${a} + (${b}) = `;
    } else if (this.state.currentProblem) {
      const { a, b } = this.state.currentProblem;
      const bStr = b < 0 ? `(${b})` : b;
      this.questionTxt.textContent = `${a} + ${bStr} = `;
    }
  }

  // --- Chip Logic ---

  addChip(type, isProblemChip = false, manualIndex = null) {
    const template = type === "plus" ? this.plusTemplate : this.minusTemplate;
    if (!template) return;
    const chip = template.cloneNode(true);
    chip.setAttribute("display", "inline");
    chip.style.cursor = "pointer";

    let index, x, y, col;
    if (isProblemChip && manualIndex !== null) {
      index = manualIndex;
      col = index % this.maxCols;
      const row = Math.floor(index / this.maxCols);
      x = this.chipStartX - col * this.chipGapX;
      y = this.chipRows.plus + row * this.chipGapY; // Use 'plus' row as base for problem grid
    } else {
      index = type === "plus" ? this.plusIndex++ : this.minusIndex++;
      col = index % this.maxCols;
      const row = Math.floor(index / this.maxCols);
      x = this.chipStartX - col * this.chipGapX;
      y = this.chipRows[type] + row * this.chipGapY;
    }

    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    wrapper.appendChild(chip);
    const innerG = chip.querySelector("g");
    if (innerG) {
      if (type === "plus") {
        innerG.setAttribute("transform", "translate(-802.5, -498)");
      } else {
        innerG.setAttribute("transform", "translate(-995.33, -494.72)");
      }
    }

    wrapper.setAttribute("transform", `translate(${x}, ${y}) scale(0.85)`);
    wrapper.addEventListener("click", () =>
      this.handleChipClick(wrapper, type),
    );

    this.dynamicChipsGroup.appendChild(wrapper);
    this.state.addedChips.push({ type, element: wrapper, col });
    this.updatePairs();
    this.recenterChips();
  }

  updatePairs() {
    const existing = document.querySelectorAll(".chip-pair-container");
    existing.forEach((p) => {
      while (p.childNodes.length > 0) {
        const child = p.childNodes[0];
        if (
          child.classList &&
          (child.classList.contains("hover-rect") ||
            child.classList.contains("hover-close"))
        ) {
          p.removeChild(child);
        } else {
          this.dynamicChipsGroup.appendChild(child);
        }
      }
      p.remove();
    });

    const plusChips = this.state.addedChips.filter((c) => c.type === "plus");
    const minusChips = this.state.addedChips.filter((c) => c.type === "minus");

    plusChips.forEach((p) => {
      const m = minusChips.find((c) => c.col === p.col);
      if (m) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "chip-pair-container");
        g.dataset.col = p.col;

        const x = this.chipStartX - p.col * this.chipGapX;
        const rectX = x - 60;
        const rectY = this.chipRows.plus - 60;
        const rectHeight =
          this.chipRows.minus -
          this.chipRows.plus +
          (this.state.isPlayground ? 120 : 80);

        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        rect.setAttribute("class", "hover-rect");
        rect.setAttribute("x", rectX);
        rect.setAttribute("y", rectY);
        rect.setAttribute("width", 120);
        rect.setAttribute("height", rectHeight);
        rect.setAttribute("rx", "15");
        rect.setAttribute("fill", "#fff");
        rect.setAttribute("fill-opacity", "0");
        rect.setAttribute("stroke", "#6fc6d1");
        rect.setAttribute("stroke-width", "2");
        rect.setAttribute("stroke-dasharray", "5,5");
        g.appendChild(rect);

        const closeG = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g",
        );
        closeG.setAttribute("class", "hover-close");
        closeG.setAttribute("transform", `translate(${rectX + 120}, ${rectY})`);

        const closeBg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        closeBg.setAttribute("cx", "0");
        closeBg.setAttribute("cy", "0");
        closeBg.setAttribute("r", "16");
        closeBg.setAttribute("fill", "#fff");
        closeG.appendChild(closeBg);

        const closeCircle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        closeCircle.setAttribute("cx", "0");
        closeCircle.setAttribute("cy", "0");
        closeCircle.setAttribute("r", "14");
        closeCircle.setAttribute("fill", "#ef4b4b");
        closeG.appendChild(closeCircle);

        const closePath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        closePath.setAttribute("d", "M-5,-5 L5,5 M5,-5 L-5,5");
        closePath.setAttribute("stroke", "#FFF");
        closePath.setAttribute("stroke-width", "3");
        closePath.setAttribute("stroke-linecap", "round");
        closeG.appendChild(closePath);

        closeG.style.cursor = "pointer";
        closeG.addEventListener("click", (e) => {
          e.stopPropagation();
          this.cancelChips(p.element, m.element);
          const pIndex = this.state.addedChips.findIndex(
            (c) => c.element === p.element,
          );
          if (pIndex > -1) this.state.addedChips.splice(pIndex, 1);
          const mIndex = this.state.addedChips.findIndex(
            (c) => c.element === m.element,
          );
          if (mIndex > -1) this.state.addedChips.splice(mIndex, 1);
          this.updatePairs();
          this.recenterChips();
        });

        g.appendChild(closeG);

        g.appendChild(p.element);
        g.appendChild(m.element);

        this.dynamicChipsGroup.appendChild(g);
      }
    });
  }

  recenterChips() {
    let maxCol = -1;
    this.state.addedChips.forEach((c) => {
      if (c.col > maxCol) maxCol = c.col;
    });

    if (maxCol === -1) {
      this.dynamicChipsGroup.setAttribute("transform", "translate(0, 0)");
      return;
    }

    const activeCols = maxCol + 1;
    const midX = this.chipStartX - ((activeCols - 1) * this.chipGapX) / 2;
    const shiftX = 960 - midX;

    // Animate smoothly
    this.dynamicChipsGroup.style.transition = "transform 0.3s ease";
    this.dynamicChipsGroup.setAttribute(
      "transform",
      `translate(${shiftX}, 50)`,
    );
  }

  handleChipClick(element, type) {
    if (this.selectedChip) {
      if (this.selectedChip.element === element) {
        if (this.state.isPlayground) {
          //    this.removeChip(element);
        } else {
          this.deselectChip();
        }
      } else if (this.selectedChip.type !== type) {
        this.cancelChips(this.selectedChip.element, element);
        this.selectedChip = null;
      } else {
        this.deselectChip();
        this.selectChip(element, type);
      }
    } else {
      this.selectChip(element, type);
    }
  }

  removeChip(element) {
    this.playPopSound();
    element.remove();
    this.state.addedChips = this.state.addedChips.filter(
      (c) => c.element !== element,
    );
    this.selectedChip = null;
    this.updatePairs();
    this.recenterChips();
  }

  selectChip(element, type) {
    this.selectedChip = { element, type };
    element.setAttribute("filter", "drop-shadow(0 0 10px yellow)");
  }

  deselectChip() {
    if (this.selectedChip) {
      this.selectedChip.element.removeAttribute("filter");
      this.selectedChip = null;
    }
  }

  cancelChips(el1, el2) {
    this.playPopSound();

    const t1 = el1
      .getAttribute("transform")
      .match(/translate\(([-\d.]+),\s*([-\d.]+)\)/);
    const t2 = el2
      .getAttribute("transform")
      .match(/translate\(([-\d.]+),\s*([-\d.]+)\)/);
    if (t1 && t2) {
      const x = (parseFloat(t1[1]) + parseFloat(t2[1])) / 2;
      const yMin = Math.min(parseFloat(t1[2]), parseFloat(t2[2]));
      const yMax = Math.max(parseFloat(t1[2]), parseFloat(t2[2]));

      const indicator = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      indicator.setAttribute("x", x - 60);
      indicator.setAttribute("y", yMin - 10);
      indicator.setAttribute("width", 120);
      indicator.setAttribute("height", yMax - yMin + 120);
      indicator.setAttribute("fill", "none");
      indicator.setAttribute("stroke", "#333");
      indicator.setAttribute("stroke-dasharray", "8,8");
      indicator.setAttribute("rx", "15");
      indicator.style.transition = "opacity 0.5s";
      this.dynamicChipsGroup.appendChild(indicator);

      const zeroLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      //  zeroLabel.textContent = "0";
      zeroLabel.setAttribute("x", x);
      zeroLabel.setAttribute("y", (yMin + yMax) / 2 + 50);
      zeroLabel.setAttribute("text-anchor", "middle");
      zeroLabel.setAttribute("font-size", "50");
      zeroLabel.setAttribute("font-weight", "bold");
      zeroLabel.setAttribute("fill", "#333");
      this.dynamicChipsGroup.appendChild(zeroLabel);

      setTimeout(() => {
        indicator.style.opacity = "0";
        zeroLabel.style.opacity = "0";
        setTimeout(() => {
          indicator.remove();
          zeroLabel.remove();
        }, 500);
      }, 1000);
    }

    el1.style.transition = "opacity 0.5s, transform 0.5s";
    el2.style.transition = "opacity 0.5s, transform 0.5s";
    el1.style.opacity = "0";
    el2.style.opacity = "0";
    el1.style.transform += " scale(0)";
    el2.style.transform += " scale(0)";

    setTimeout(() => {
      if (el1.parentNode) el1.parentNode.removeChild(el1);
      if (el2.parentNode) el2.parentNode.removeChild(el2);
      this.state.addedChips = this.state.addedChips.filter(
        (c) => c.element !== el1 && c.element !== el2,
      );
      this.updatePairs();
      this.recenterChips();
    }, 500);
  }

  playPopSound() {
    try {
      if (this.audioCtx.state === "suspended") this.audioCtx.resume();
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(400, this.audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        10,
        this.audioCtx.currentTime + 0.1,
      );
      gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioCtx.currentTime + 0.1,
      );
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  clearChips() {
    this.dynamicChipsGroup.innerHTML = "";
    this.plusIndex = 0;
    this.minusIndex = 0;
    this.selectedChip = null;
    this.state.addedChips = [];
    this.updatePairs();
    this.recenterChips();
  }

  updateUI() {
    const isChipMode = this.state.mode === MODES.CHIP;
    const isNumberLineMode = this.state.mode === MODES.NUMBER_LINE;
    const isPlayground = this.state.isPlayground;

    // Visibility
    const mainSVG = document.getElementById("main-svg");
    if (mainSVG) mainSVG.setAttribute("display", "inline");

    this.chipMethodGroup.setAttribute(
      "display",
      isChipMode && isPlayground ? "inline" : "none",
    );
    this.addPlusBtn.setAttribute("display", isPlayground ? "inline" : "none");
    this.addMinusBtn.setAttribute("display", isPlayground ? "inline" : "none");

    // Update button visuals dynamically based on mode/problem
    this.btn1Type = "plus";
    this.btn2Type = "minus";

    if (isChipMode && this.state.currentProblem) {
      this.btn1Type = this.state.currentProblem.a >= 0 ? "plus" : "minus";
      this.btn2Type = this.state.currentProblem.b >= 0 ? "plus" : "minus";
    }

    const updateBtnVisual = (btnGroup, type, isTopBtn) => {
      const bgPath = btnGroup.querySelector("path"); // first path is the colored bg
      if (!bgPath) return;
      bgPath.setAttribute("fill", type === "plus" ? "#12e819" : "#ff2020");

      // Find the correct text element to replace
      const textElements = btnGroup.querySelectorAll("text");
      textElements.forEach((textEl) => {
        // If this is top button, target the text near Y=538. If bottom, near 675.
        const y = parseFloat(
          textEl.getAttribute("transform").match(/[\d.]+\)/)[0],
        );
        if ((isTopBtn && y < 600) || (!isTopBtn && y > 600)) {
          textEl.setAttribute("font-size", type === "plus" ? "90" : "85");
          const tspan = textEl.querySelector("tspan");
          if (tspan) tspan.textContent = type === "plus" ? "+" : "_";
          // Shift _ up by 18px since underscore sits below the text baseline
          const baseY = isTopBtn ? 528 : 658;
          const yOffset = type === "plus" ? +10 : -18;
          textEl.setAttribute(
            "transform",
            `translate(119.48 ${baseY + yOffset})`,
          );
        }
      });
    };

    updateBtnVisual(this.addPlusBtn, this.btn1Type, true);
    updateBtnVisual(this.addMinusBtn, this.btn2Type, false);

    this.playgroundBtn.setAttribute(
      "display",
      isChipMode && !isPlayground ? "inline" : "none",
    );
    const dustbin = document.getElementById("dustbin");
    if (dustbin)
      dustbin.setAttribute(
        "display",
        isChipMode && isPlayground ? "inline" : "none",
      );

    this.timelineGroup.setAttribute(
      "display",
      isNumberLineMode ? "inline" : "none",
    );
    if (isNumberLineMode) {
      // If user has entered an answer, show dot there. Otherwise show at 'a'.
      const currentAns = parseInt(this.state.userAnswer);
      if (!isNaN(currentAns)) {
        this.updateNumberLinePosition(currentAns);
      } else {
        this.updateNumberLinePosition();
      }
    } else {
      this.startBtn.setAttribute("display", "none");
      if (this.startTextGroup)
        this.startTextGroup.setAttribute("display", "none");
      if (this.point) this.point.setAttribute("display", "none");
    }

    // this.chipInstruction.setAttribute(
    //   "display",
    //   isChipMode ? "inline" : "none",
    // );
    this.dynamicChipsGroup.setAttribute(
      "display",
      isChipMode ? "inline" : "none",
    );
    const tspan = this.chipInstruction.querySelector("tspan:last-child");
    if (tspan) {
      if (isChipMode && isPlayground) {
        tspan.textContent = "Tap each pair of positive and negative chips.";
      } else if (isChipMode && !isPlayground) {
        tspan.textContent = "Tap each pair of positive and negative chips.";
      } else if (isNumberLineMode) {
        tspan.textContent = "Tap the answer on the number line.";
      }
    }

    // Hide question if playground
    const qPatch = document.getElementById("question-patch");
    const qTxt = document.getElementById("question-txt");
    const aPatch = document.getElementById("answer-patch");
    // if (qPatch)
    //   qPatch.setAttribute("display", isPlayground ? "none" : "inline");
    // if (qTxt) qTxt.setAttribute("display", isPlayground ? "none" : "inline");
    // if (aPatch)
    //   aPatch.setAttribute("display", isPlayground ? "none" : "inline");

    if (!isPlayground) {
      if (!this.state.currentProblem) this.state.newProblem();
      this.updateQuestionText();
    }

    this.answerBox.textContent = this.state.userAnswer;

    if (this.answerBorder) {
      if (this.state.isAnswerBoxFocused) {
        this.answerBorder.setAttribute("stroke-width", "4");
        this.answerBorder.setAttribute("stroke", "#000db9");
      } else {
        this.answerBorder.setAttribute("stroke-width", "2");
      }
    }

    this.updateActiveButton();
  }

  updateActiveButton() {
    const chipPath = this.chipMethodBtn.querySelector("#Path_1040");
    const numLinePath = this.numberLineBtn.querySelector("#Path_1044");

    if (this.state.mode === MODES.CHIP) {
      if (chipPath) chipPath.setAttribute("fill", "#fed935");
      if (numLinePath) numLinePath.setAttribute("fill", "#9da2c1");
    } else {
      if (chipPath) chipPath.setAttribute("fill", "#9da2c1");
      if (numLinePath) numLinePath.setAttribute("fill", "#faa82c");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const state = new StateManager();
  const ui = new UIManager(state);
  if (!state.isPlayground) {
    ui.autoAddProblemChips();
  }
});
