// --- SCRIPT.JS CONTENT ---

// Global variables
let currentMode = "menu";
let activeTab = "operation"; // 'operation', 'practice', 'explore'
let currentStep = 0;
let currentExpression = null;
let userInput = "";
let showHint = false;
let score = 0;
let questionsAnswered = 0;
let practiceQuestions = [];
let currentPracticeIndex = 0;
let animationProgress = 0;
let showAnimation = false;
let feedback = "";
let showFeedback = false;
let feedbackTimer = 0;
let inputBox = null; // Deprecated for Operation Mode
let numeratorInput = null;
let denominatorInput = null;
let opNumeratorInput = null;
let opDenominatorInput = null;
let opNumeratorInput2 = null;
let opDenominatorInput2 = null;
let answerNumeratorInput = null;
let answerDenominatorInput = null;
let blurredBg = null;
// ... existing variables

// Expression types and templates
// ...
// --- MODIFICATION: Input fields and data for Explore tab ---
let exploreQNumInput = null;
let exploreQDenInput = null;
let exploreCNumInput = null;
let exploreCDenInput = null;
let exploreANumInput = null;
let exploreADenInput = null;
let exploreExpressions = [];
let currentExploreIndex = 0;


let buttons = [];
let sliderX; // For toggle animation
let isCheckingAnswer = false;
let showHintPopup = false;
let hintPopupTimer = 0;
// let ladderBoyImg;
let showRedDot = false;
let redDotTimer = 0;
let showConjugateHint = false; // MODIFICATION: Controls instructional text visibility
let isKeyboardVisible = false; // --- ADD THIS LINE ---

// Expression types and templates
const simpleExpressions = [
  {
    type: "simple",
    numerator: "1",
    denominator: "√2",
    conjugate: "√2",
    answer: "√2/2",
    steps: ["Multiply by √2/√2", "Get (1×√2)/(√2×√2)", "Simplify to √2/2"],
  },
  {
    type: "simple",
    numerator: "1",
    denominator: "√3",
    conjugate: "√3",
    answer: "√3/3",
    steps: ["Multiply by √3/√3", "Get (1×√3)/(√3×√3)", "Simplify to √3/3"],
  },
  {
    type: "simple",
    numerator: "2",
    denominator: "√5",
    conjugate: "√5",
    answer: "2√5/5",
    steps: ["Multiply by √5/√5", "Get (2×√5)/(√5×√5)", "Simplify to 2√5/5"],
  },
  {
    type: "simple",
    numerator: "3",
    denominator: "√7",
    conjugate: "√7",
    answer: "3√7/7",
    steps: ["Multiply by √7/√7", "Get (3×√7)/(√7×√7)", "Simplify to 3√7/7"],
  },
  {
    type: "simple",
    numerator: "4",
    denominator: "√6",
    conjugate: "√6",
    answer: "2√6/3",
    steps: ["Multiply by √6/√6", "Get (4×√6)/(√6×√6)", "Simplify to 2√6/3"],
  },
];

const binomialExpressions = [
  {
    type: "binomial",
    numerator: "1",
    denominator: "√3 + 1",
    conjugate: "√3 - 1",
    answer: "(√3 - 1)/2",
    steps: [
      "Multiply by (√3-1)/(√3-1)",
      "Get (√3-1)/((√3+1)(√3-1))",
      "Simplify to (√3-1)/2",
    ],
  },
  {
    type: "binomial",
    numerator: "2",
    denominator: "√5 - 1",
    conjugate: "√5 + 1",
    answer: "(√5 + 1)/2",
    steps: [
      "Multiply by (√5+1)/(√5+1)",
      "Get 2(√5+1)/((√5-1)(√5-1))",
      "Simplify to (√5+1)/2",
    ],
  },
  {
    type: "binomial",
    numerator: "1",
    denominator: "2 + √3",
    conjugate: "2 - √3",
    answer: "2 - √3",
    steps: [
      "Multiply by (2-√3)/(2-√3)",
      "Get (2-√3)/((2+√3)(2-√3))",
      "Simplify to 2-√3",
    ],
  },
  {
    type: "binomial",
    numerator: "3",
    denominator: "√7 + 2",
    conjugate: "√7 - 2",
    answer: "√7 - 2",
    steps: [
      "Multiply by (√7-2)/(√7-2)",
      "Get 3(√7-2)/((√7+2)(√7-2))",
      "Simplify to √7-2",
    ],
  },
  {
    type: "binomial",
    numerator: "1",
    denominator: "√2 - √3",
    conjugate: "√2 + √3",
    answer: "-(√2 + √3)",
    steps: [
      "Multiply by (√2+√3)/(√2+√3)",
      "Get (√2+√3)/((√2-√3)(√2-√3))",
      "Simplify to -(√2+√3)",
    ],
  },
];

const KEYBOARD_LAYOUT = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["C", "0", "√", "Backspace"],
];

// --- MODIFICATION: Added helper function to parse answer strings ---
function parseAnswer(answerStr) {
  const answer = answerStr.replace(/\s/g, "");
  let num, den;
  const fractionMatch = answer.match(/^(.*)\/(.*)$/);
  const negativeGroupMatch = answer.match(/^-\((.*)\)$/);

  if (fractionMatch) {
    num = fractionMatch[1];
    den = fractionMatch[2];
  } else if (negativeGroupMatch) {
    num = negativeGroupMatch[1];
    den = "-1";
  } else {
    num = answer;
    den = "1";
  }
  return [num, den];
}

// function preload() {
//   ladderBoyImg = loadImage("ladder.png");
// }

// --- MODIFICATION START ---
// New function to show the keyboard.
function showKeyboard() {
  const container = document.getElementById("keyboard-container");
  if (container) {
    // --- MODIFICATION START ---
    // If the keyboard's HTML is empty, it means it was destroyed. Re-create it.
    if (container.innerHTML.trim() === "") {
      createOnScreenKeyboard();
    }
    // --- MODIFICATION END ---
    container.style.display = "flex";
    isKeyboardVisible = true;
  }
}
// --- MODIFICATION END ---

function createOnScreenKeyboard() {
  const container = document.getElementById("keyboard-container");
  if (!container) return;

  // --- MODIFICATION START ---
  // This is the fix for the click-through issue. It stops mouse events
  // on the keyboard from propagating to the p5 canvas underneath.
  container.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
  // --- MODIFICATION END ---

  container.innerHTML = ""; // Clear previous keyboard if any

  // --- MODIFICATION START ---
  // Create and add the close button to the keyboard container
  const closeBtn = document.createElement("button");
  closeBtn.className = "keyboard-close-btn";
  closeBtn.innerHTML = "&times;"; // This creates the '×' symbol
  closeBtn.onclick = () => hideKeyboard(); // Action to close the keyboard
  container.appendChild(closeBtn);
  // --- MODIFICATION END ---

  const specialKeys = ["/", "-", "+", "C", "√", "Backspace"];

  KEYBOARD_LAYOUT.forEach((rowKeys) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    rowKeys.forEach((key) => {
      const keyBtn = document.createElement("button");
      keyBtn.className = "key-btn";
      if (specialKeys.includes(key)) {
        keyBtn.classList.add("key-btn-special");
      }

      const clickHandler = () => {
        let targetInput = null;
        if (currentMode === "practice") {
          if (numeratorInput && numeratorInput.focused)
            targetInput = numeratorInput;
          else if (denominatorInput && denominatorInput.focused)
            targetInput = denominatorInput;
        } else if (["simple", "binomial", "mixed"].includes(currentMode)) {
          if (opNumeratorInput && opNumeratorInput.focused)
            targetInput = opNumeratorInput;
          else if (opDenominatorInput && opDenominatorInput.focused)
            targetInput = opDenominatorInput;
          else if (opNumeratorInput2 && opNumeratorInput2.focused)
            targetInput = opNumeratorInput2;
          else if (opDenominatorInput2 && opDenominatorInput2.focused)
            targetInput = opDenominatorInput2;
          else if (answerNumeratorInput && answerNumeratorInput.focused)
            targetInput = answerNumeratorInput;
          else if (answerDenominatorInput && answerDenominatorInput.focused)
            targetInput = answerDenominatorInput;
        } else if (activeTab === 'explore') {
            if (exploreQNumInput && exploreQNumInput.focused) targetInput = exploreQNumInput;
            else if (exploreQDenInput && exploreQDenInput.focused) targetInput = exploreQDenInput;
            else if (exploreCNumInput && exploreCNumInput.focused) targetInput = exploreCNumInput;
            else if (exploreCDenInput && exploreCDenInput.focused) targetInput = exploreCDenInput;
            else if (exploreANumInput && exploreANumInput.focused) targetInput = exploreANumInput;
            else if (exploreADenInput && exploreADenInput.focused) targetInput = exploreADenInput;
        }


        if (targetInput && targetInput.isEnabled) {
          if (key === "Backspace") {
            targetInput.text = targetInput.text.slice(0, -1);
          } else if (key === "C") {
            targetInput.text = "";
          } else if (targetInput.text.length < 30) {
            targetInput.text += key;
          }
        }
      };

      if (key === "Backspace") {
        keyBtn.innerHTML = "←";
      } else {
        keyBtn.textContent = key;
      }
      keyBtn.addEventListener("click", clickHandler);
      rowDiv.appendChild(keyBtn);
    });
    container.appendChild(rowDiv);
  });
}

function destroyOnScreenKeyboard() {
  const container = document.getElementById("keyboard-container");
  if (container) {
    container.style.display = "none";
    container.innerHTML = "";
    isKeyboardVisible = false; // --- ADD THIS LINE
  }
}

class Button {
  // --- FIX: Using string/null defaults instead of p5.js functions at parse time ---
  constructor(
    x,
    y,
    w,
    h,
    text,
    action,
    color = "#3498db",
    visible = true,
    hoverColor = null,
    noBorder = false,
    borderColor = null,
    hoverBorderColor = null,
    shape = "rect",
    isEnabled = true,
    textColor = null, 
    hoverTextColor = null 
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.action = action;
    this.color = color;
    this.hover = false;
    this.pressed = false;
    this.visible = visible;
    this.hoverColor = hoverColor;
    this.noBorder = noBorder;
    this.borderColor = borderColor;
    this.hoverBorderColor = hoverBorderColor;
    this.shape = shape;
    this.isEnabled = isEnabled;
    this.textColor = textColor;
    this.hoverTextColor = hoverTextColor;
  }
  draw() {
    if (!this.visible) return;
    this.hover =
      mouseX >= this.x &&
      mouseX <= this.x + this.w &&
      mouseY >= this.y &&
      mouseY <= this.y + this.h;
    let activeColor = this.color;
    if (this.isEnabled) {
      if (this.hover) {
        activeColor = this.hoverColor
          ? this.hoverColor
          : color(
              red(this.color) + 20,
              green(this.color) + 20,
              blue(this.color) + 20
            );
      }
      fill(
        this.pressed
          ? color(
              red(activeColor) - 30,
              green(activeColor) - 30,
              blue(activeColor) - 30
            )
          : activeColor
      );
    } else {
      fill(200);
      stroke(150);
      strokeWeight(2);
    }
    if (this.noBorder || !this.isEnabled) {
      noStroke();
    } else {
      strokeWeight(2); // Set strokeWeight before stroke color
      let currentBorderColor =
        this.hover && this.hoverBorderColor
          ? this.hoverBorderColor
          : this.borderColor;
      if (currentBorderColor) {
        stroke(currentBorderColor);
      } else {
        stroke(
          red(activeColor) - 40,
          green(activeColor) - 40,
          blue(activeColor) - 40
        );
      }
    }
    if (this.shape === "circle") {
      ellipse(this.x + this.w / 2, this.y + this.h / 2, min(this.w, this.h));
    } else {
      rect(this.x, this.y, this.w, this.h, 10);
    }
    
    // --- FIX: Updated text color logic ---
    let currentTextColor = this.textColor;
    if (this.hover && this.isEnabled && this.hoverTextColor) {
        currentTextColor = this.hoverTextColor;
    }
    if (currentTextColor) {
        fill(this.isEnabled ? currentTextColor : color(100));
    } else {
        // Fallback to original behavior if no text colors are provided
        fill(this.isEnabled ? 255 : 100);
    }

    textAlign(CENTER, CENTER);
    let textSizeValue =
      this.shape === "circle" ? this.w / 2 : this.w > 150 ? 14 : 12;
    textSize(textSizeValue);
    textStyle(BOLD);
    let lines = this.text.split("\n");
    if (lines.length > 1) {
      for (let i = 0; i < lines.length; i++) {
        text(
          lines[i],
          this.x + this.w / 2,
          this.y + this.h / 2 - (lines.length - 1) * 8 + i * 16
        );
      }
    } else {
      text(this.text, this.x + this.w / 2, this.y + this.h / 2);
    }
    textStyle(NORMAL);
  }
  isClicked() {
    if (!this.isEnabled) return false;
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.w &&
      mouseY >= this.y &&
      mouseY <= this.y + this.h &&
      mouseIsPressed &&
      !this.pressed
    );
  }
  update() {
    if (this.isClicked()) {
      this.pressed = true;
      this.action();
      return true;
    }
    if (!mouseIsPressed) this.pressed = false;
    return false;
  }
}

class InputField {
  constructor(x, y, w, h, placeholder, isEnabled = true) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.placeholder = placeholder;
    this.text = "";
    this.focused = false;
    this.cursorBlink = 0;
    this.isEnabled = isEnabled;
  }
  draw() {
    if (this.isEnabled) {
      fill(this.focused ? color(227, 242, 253) : color(248, 249, 250));
      stroke(this.focused ? color(52, 152, 219) : color(189, 195, 199));
    } else {
      fill(color(236, 240, 241)); // Disabled color
      stroke(color(210, 210, 210));
    }
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 8);
    textAlign(CENTER, CENTER);
    let displayText = this.text || this.placeholder;
    fill(
      this.isEnabled
        ? this.text
          ? color(44, 62, 80)
          : color(149, 165, 166)
        : color(180, 180, 180)
    );
    text(displayText, this.x + this.w / 2, this.y + this.h / 2);
    if (this.isEnabled && this.focused && this.cursorBlink < 30) {
      let textW = textWidth(this.text);
      stroke(color(44, 62, 80));
      strokeWeight(1);
      line(
        this.x + this.w / 2 + textW / 2 + 2,
        this.y + 8,
        this.x + this.w / 2 + textW / 2 + 2,
        this.y + this.h - 8
      );
    }
    this.cursorBlink = (this.cursorBlink + 1) % 60;
  }
  isClicked() {
    if (!this.isEnabled) return false;
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.w &&
      mouseY >= this.y &&
      mouseY <= this.y + this.h
    );
  }
  update() {
    if (!this.isEnabled) {
      this.focused = false;
      return;
    }
    if (mouseIsPressed && this.isClicked()) {
      if (!this.focused) {
        handleBlurValidation(); // This will validate the previously focused field
        [
          numeratorInput,
          denominatorInput,
          opNumeratorInput,
          opDenominatorInput,
          opNumeratorInput2,
          opDenominatorInput2,
          answerNumeratorInput,
          answerDenominatorInput,
          exploreQNumInput,
          exploreQDenInput,
          exploreCNumInput,
          exploreCDenInput,
          exploreANumInput,
          exploreADenInput
        ].forEach((field) => {
          if (field) field.focused = false;
        });
        this.focused = true;

        // --- MODIFICATION START ---
        // When an input field is clicked, show the on-screen keyboard.
        showKeyboard();
        // --- MODIFICATION END ---
        
        if (this === opNumeratorInput2) {
          const denText = opDenominatorInput.text.trim();
          let isDenValid = false;
          if (denText.length > 0) {
            if (currentMode === "binomial") {
              const hasSqrt = denText.includes("√");
              const hasOperator =
                denText.includes("+") || denText.substring(1).includes("-");
              const endsWithOperator =
                denText.endsWith("+") || denText.endsWith("-");
              isDenValid = hasSqrt && hasOperator && !endsWithOperator;
            } else if (currentMode === "mixed") {
              isDenValid = denText.includes("√");
            } else {
              // simple
              isDenValid =
                denText.includes("√") &&
                !denText.includes("+") &&
                !denText.includes("-");
            }
          }
          showConjugateHint = isDenValid;
        }
      }
    }
  }
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-container");
  textFont("Arial");

  const opInputWidth = 100;
  const opInputHeight = 40;
  const opFractionY = 165;

  const totalContentWidth = opInputWidth * 3 + 80;
  const startX = (width - totalContentWidth) / 2;
  const opPair1X = startX;
  const opPair2X = startX + opInputWidth + 40;
  const opPair3X = startX + 2 * (opInputWidth + 40);

  opNumeratorInput = new InputField(
    opPair1X,
    opFractionY - opInputHeight - 5,
    opInputWidth,
    opInputHeight,
    "N",
    true
  );
  opDenominatorInput = new InputField(
    opPair1X,
    opFractionY + 5,
    opInputWidth,
    opInputHeight,
    "D",
    true
  );

  opNumeratorInput2 = new InputField(
    opPair2X,
    opFractionY - opInputHeight - 5,
    opInputWidth,
    opInputHeight,
    "√",
    false
  );
  opDenominatorInput2 = new InputField(
    opPair2X,
    opFractionY + 5,
    opInputWidth,
    opInputHeight,
    "√",
    false
  );

  answerNumeratorInput = new InputField(
    opPair3X,
    opFractionY - opInputHeight - 5,
    opInputWidth,
    opInputHeight,
    "",
    false
  );
  answerDenominatorInput = new InputField(
    opPair3X,
    opFractionY + 5,
    opInputWidth,
    opInputHeight,
    "",
    false
  );

  const inputWidth = 220;
  const inputHeight = 40;
  const fractionX = 340;
  const numeratorY = 260;
  const denominatorY = 320;
  numeratorInput = new InputField(
    fractionX,
    numeratorY,
    inputWidth,
    inputHeight,
    ""
  );
  denominatorInput = new InputField(
    fractionX,
    denominatorY,
    inputWidth,
    inputHeight,
    ""
  );

  // --- MODIFICATION: Initialize Explore tab inputs ---
    const exploreInputWidth = 120;
    const exploreInputHeight = 35;
    const exploreFractionY = 325; // Placeholder, will be updated in drawExploreTab
    const exploreTotalWidth = exploreInputWidth * 3 + 80;
    const exploreStartX = (width - exploreTotalWidth) / 2;
    
    exploreQNumInput = new InputField(exploreStartX, exploreFractionY - exploreInputHeight - 5, exploreInputWidth, exploreInputHeight, "");
    exploreQDenInput = new InputField(exploreStartX, exploreFractionY + 5, exploreInputWidth, exploreInputHeight, "");

    const explorePair2X = exploreStartX + exploreInputWidth + 40;
    exploreCNumInput = new InputField(explorePair2X, exploreFractionY - exploreInputHeight - 5, exploreInputWidth, exploreInputHeight, "");
    exploreCDenInput = new InputField(explorePair2X, exploreFractionY + 5, exploreInputWidth, exploreInputHeight, "");

    const explorePair3X = explorePair2X + exploreInputWidth + 40;
    exploreANumInput = new InputField(explorePair3X, exploreFractionY - exploreInputHeight - 5, exploreInputWidth, exploreInputHeight, "");
    exploreADenInput = new InputField(explorePair3X, exploreFractionY + 5, exploreInputWidth, exploreInputHeight, "");

  // --- MODIFICATION: Populate and set first explore expression ---
    exploreExpressions = [
        { title: "🧪 Pendulum Time Period", formula: "T = 2π/(√2 + 1)", given: "l = 2 ⇒ T = 2π/(√2 + 1)", rationalize: "2/√2+1" },
        { title: "📡 Frequency in Physics", formula: "f = 1/(√3 - 1)", given: "T = √3 - 1 ⇒ f = 1/(√3 - 1)", rationalize: "1/√3-1" },
        { title: "🧲 Electric Resistance Ratio", formula: "R = V²/(√5 + 2)", given: "V² = 9 ⇒ R = 9/(√5 + 2)", rationalize: "9/√5+2" },
        { title: "📘 Volume Formula", formula: "V = l³/√7", given: "l = 1 ⇒ V = 1/√7", rationalize: "1/√7" },
        { title: "🔭 Optics Equation", formula: "f = uv/(√5 - 3)", given: "u = √5, v = 1 ⇒ f = √5/(√5 - 3)", rationalize: "√5/√5-3" },
        { title: "🏞️ Flow Rate in a Pipe", formula: "Q = A/√11", given: "A = π ⇒ Q = π/√11", rationalize: "1/√11" },
        { title: "🧮 Simplified Trig Value", formula: "tanθ = h/(√2 + 3)", given: "h = 1 ⇒ tanθ = 1/(√2 + 3)", rationalize: "1/√2+3" },
        { title: "🧪 Chemical Solution Rate", formula: "R = k/√13", given: "k = 2 ⇒ R = 2/√13", rationalize: "2/√13" },
        { title: "🚀 Gravity Expression", formula: "g = a/(√5 - 1)", given: "a = 10 ⇒ g = 10/(√5 - 1)", rationalize: "10/√5-1" },
        { title: "🧪 Speed of Sound in Gas", formula: "v = √(γRT/M)", given: "Let √(γRT/M) = √5/√3", rationalize: "√5/√3" }
    ];
    const firstExplore = exploreExpressions[0];
    const parts = firstExplore.rationalize.split('/');
    exploreQNumInput.text = parts[0];
    exploreQDenInput.text = parts[1];


  sliderX = 200;
}

function updateOperationInputStates() {
  if (!["simple", "binomial", "mixed"].includes(currentMode)) {
    return;
  }
  const questionFilled =
    opNumeratorInput.text.trim().length > 0 &&
    opDenominatorInput.text.trim().length > 0;
  if (opNumeratorInput2.isEnabled !== questionFilled) {
    opNumeratorInput2.isEnabled = questionFilled;
    opDenominatorInput2.isEnabled = questionFilled;
    if (!questionFilled) {
      opNumeratorInput2.text = "";
      opDenominatorInput2.text = "";
    }
  }

  const conjugateFilled =
    opNumeratorInput2.text.trim().length > 0 &&
    opDenominatorInput2.text.trim().length > 0;
  const shouldAnswerBeEnabled = questionFilled && conjugateFilled;
  if (answerNumeratorInput.isEnabled !== shouldAnswerBeEnabled) {
    answerNumeratorInput.isEnabled = shouldAnswerBeEnabled;
    answerDenominatorInput.isEnabled = shouldAnswerBeEnabled;
    if (!shouldAnswerBeEnabled) {
      answerNumeratorInput.text = "";
      answerDenominatorInput.text = "";
    }
  }
}

function draw() {
  background(color(248, 249, 250));
  updateOperationInputStates();
  
  // --- FIX: This block was flawed. It now correctly hides the popup. ---
  if (showFeedback) {
    if (feedbackTimer > 0) {
        feedbackTimer--;
    }
    // Note: The original timer logic was flawed. It's fixed here,
    // but the Explore tab now uses setTimeout for its local fix
    // as requested by the user prompt to not modify global logic.
    if (feedbackTimer <= 0 && !["explore"].includes(activeTab)) { 
        showFeedback = false;
    }
  }

  if (showHintPopup && hintPopupTimer > 0) {
    hintPopupTimer--;
    if (hintPopupTimer <= 0) showHintPopup = false;
  }
  if (showRedDot && redDotTimer > 0) {
    redDotTimer--;
    if (redDotTimer <= 0) {
      showRedDot = false;
    }
  }
  buttons = [];
  switch (currentMode) {
    case "menu":
      drawMenu();
      break;
    case "simple":
    case "binomial":
    case "mixed":
      drawProblemSolver();
      break;
    case "practice":
      drawPracticeMode();
      break;
  }
  buttons.forEach((btn) => btn.update());
  if (currentMode === "practice") {
    if (numeratorInput) numeratorInput.update();
    if (denominatorInput) denominatorInput.update();
  } else if (["simple", "binomial", "mixed"].includes(currentMode)) {
    if (opNumeratorInput) opNumeratorInput.update();
    if (opDenominatorInput) opDenominatorInput.update();
    if (opNumeratorInput2) opNumeratorInput2.update();
    if (opDenominatorInput2) opDenominatorInput2.update();
    if (answerNumeratorInput) answerNumeratorInput.update();
    if (answerDenominatorInput) answerDenominatorInput.update();
  } else if (activeTab === 'explore' && currentMode === 'menu') {
    if (exploreQNumInput) exploreQNumInput.update();
    if (exploreQDenInput) exploreQDenInput.update();
    if (exploreCNumInput) exploreCNumInput.update();
    if (exploreCDenInput) exploreCDenInput.update();
    if (exploreANumInput) exploreANumInput.update();
    if (exploreADenInput) exploreADenInput.update();
  }
}

function drawMenu() {
  noStroke();
  fill(color(44, 62, 80));
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  textStyle(NORMAL);
  const toggleX = 200,
    toggleY = 40,
    toggleW = 400,
    toggleH = 50;
  const tabW = toggleW / 3;
  buttons.push(
    new Button(
      toggleX,
      toggleY,
      tabW,
      toggleH,
      "",
      () => {
        activeTab = "operation";
        destroyOnScreenKeyboard();
      },
      "#000",
      false
    )
  );
  buttons.push(
    new Button(
      toggleX + tabW,
      toggleY,
      tabW,
      toggleH,
      "",
      () => {
        activeTab = "practice";
        destroyOnScreenKeyboard();
      },
      "#000",
      false
    )
  );
  buttons.push(
    new Button(
      toggleX + 2 * tabW,
      toggleY,
      tabW,
      toggleH,
      "",
      () => {
        activeTab = "explore";
        // createOnScreenKeyboard();
      },
      "#000",
      false
    )
  );
  fill(230, 230, 250);
  noStroke();
  rect(toggleX, toggleY, toggleW, toggleH, 25);
  let sliderTargetX =
    activeTab === "operation"
      ? toggleX + 5
      : activeTab === "practice"
      ? toggleX + tabW + 5
      : toggleX + 2 * tabW + 5;
  sliderX = lerp(sliderX, sliderTargetX, 0.2);
  fill(255);
  stroke(155, 89, 182);
  strokeWeight(2);
  rect(sliderX, toggleY + 5, tabW - 10, toggleH - 10, 20);
  textSize(16);
  textStyle(BOLD);
  noStroke();
  fill(activeTab === "operation" ? color(155, 89, 182) : color(44, 62, 80));
  text("Operation", toggleX + tabW / 2, toggleY + toggleH / 2);
  fill(activeTab === "practice" ? color(155, 89, 182) : color(44, 62, 80));
  text("Practice", toggleX + tabW + tabW / 2, toggleY + toggleH / 2);
  fill(activeTab === "explore" ? color(155, 89, 182) : color(44, 62, 80));
  text("Explore", toggleX + 2 * tabW + tabW / 2, toggleY + toggleH / 2);
  textStyle(NORMAL);
  if (activeTab === "operation") {
    drawOperationTab();
  } else if (activeTab === "practice") {
    // --- MODIFICATION START: Practice Tab UI Enhancement ---
    const boxW = 600;
    const boxH = 250;
    const boxX = (width - boxW) / 2;
    const boxY = 150;
    
    fill('#f5f5f5');
    stroke('#d0d0d0');
    strokeWeight(2);
    rect(boxX, boxY, boxW, boxH, 15);

    const description = [
      "• Test your skills with 10 randomized rationalisation questions covering simple, binomial, and mixed surds.",
      "• Your accuracy, score, and speed will be tracked as you go. Hints and tips will appear for tricky ones to guide you.",
      "• Click Start Practice to begin and see how many you can solve correctly with confidence!"
    ];

    textAlign(LEFT, TOP);
    noStroke();
    fill(50);
    textSize(14);
    let currentY = boxY + 30;
    const textX = boxX + 30;
    const textW = boxW - 60;
    const lineHeight = 20;

    description.forEach(line => {
        text(line, textX, currentY, textW);
        // Estimate height of wrapped text to position next line
        currentY += textLeading() * Math.ceil(textWidth(line) / textW) + 10;
    });

    const buttonW = 200;
    const buttonH = 50; 
    const buttonX = boxX + (boxW - buttonW) / 2;
    const buttonY = boxY + boxH - buttonH - 30;

    buttons.push(
      new Button(
        buttonX,
        buttonY,
        buttonW,
        buttonH,
        "Start (10 Questions)",
        () => startMode("practice"),
        color(231, 76, 60),
        true,
        color(46, 204, 113)
      )
    );
    // --- MODIFICATION END ---
  } else {
    drawExploreTab();
  }
  buttons.forEach((btn) => btn.draw());
}

// --- MODIFICATION: New function to draw Explore tab ---
function drawExploreTab() {
    const titleY = 110;
    const titleHeight = 22;

    // Title
    fill(44, 62, 80);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(titleHeight);
    textStyle(BOLD);
    text("💡Real Life Application", width / 2, titleY);
    textStyle(NORMAL);

    // Main Curved Rectangle Box
    const boxX = 100;
    const boxY = titleY + titleHeight + 12; // Adjusted spacing
    const boxW = 600;
    const boxH = 120; // Increased height
    fill(255, 253, 208); // Light yellow
    stroke(253, 203, 110); // Dark yellow
    strokeWeight(2);
    rect(boxX, boxY, boxW, boxH, 15);

    // Text Contents Inside the Box
    const current = exploreExpressions[currentExploreIndex];
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    
    // Title (bold)
    textSize(16);
    textStyle(BOLD);
    text(current.title, boxX + 20, boxY + 15);
    textStyle(NORMAL);
    
    // Other text
    textSize(14);
    text(`Formula: ${current.formula}`, boxX + 20, boxY + 45);
    text(`Given: ${current.given}`, boxX + 20, boxY + 65);
    text(`Rationalize the following: ${current.rationalize}`, boxX + 20, boxY + 85);

    // Input Boxes Container
    const inputContainerY = boxY + boxH + 16;
    const inputContainerW = 480;
    const inputContainerH = 100;
    const inputContainerX = (width - inputContainerW) / 2;
    fill(245);
    stroke(220);
    rect(inputContainerX, inputContainerY, inputContainerW, inputContainerH, 15);

    // Update input field positions dynamically
    const exploreInputHeight = 35;
    const exploreFractionY = inputContainerY + inputContainerH / 2;
    exploreQNumInput.y = exploreFractionY - exploreInputHeight - 5;
    exploreQDenInput.y = exploreFractionY + 5;
    exploreCNumInput.y = exploreFractionY - exploreInputHeight - 5;
    exploreCDenInput.y = exploreFractionY + 5;
    exploreANumInput.y = exploreFractionY - exploreInputHeight - 5;
    exploreADenInput.y = exploreFractionY + 5;

    // Draw input fields and lines
    const lineY = exploreFractionY;
    stroke(50);
    strokeWeight(2);
    line(exploreQNumInput.x, lineY, exploreQNumInput.x + exploreQNumInput.w, lineY);
    line(exploreCNumInput.x, lineY, exploreCNumInput.x + exploreCNumInput.w, lineY);
    line(exploreANumInput.x, lineY, exploreANumInput.x + exploreANumInput.w, lineY);

    textAlign(CENTER, CENTER);
    textSize(24);
    noStroke();
    fill(50);
    text("×", (exploreQNumInput.x + exploreQNumInput.w + exploreCNumInput.x) / 2, inputContainerY + inputContainerH / 2);
    text("=", (exploreCNumInput.x + exploreCNumInput.w + exploreANumInput.x) / 2, inputContainerY + inputContainerH / 2);

    exploreQNumInput.draw();
    exploreQDenInput.draw();
    exploreCNumInput.draw();
    exploreCDenInput.draw();
    exploreANumInput.draw();
    exploreADenInput.draw();

    // Buttons
    const buttonY = inputContainerY + inputContainerH + 20;
    const checkBtnX = width / 2 - 140;
    const nextBtnX = width / 2 + 10;
    
    buttons.push(new Button(checkBtnX, buttonY, 130, 45, "Check Answer", checkExploreAnswer, color(46, 204, 113)));
    
    buttons.push(new Button(nextBtnX, buttonY, 130, 45, "Next Question", nextExploreQuestion, color(241, 196, 15)));

    // --- FIX: Added logic to draw the feedback popup ---
    if (showFeedback && blurredBg) {
        image(blurredBg, 0, 0); // Draw the pre-rendered blurred image
        drawFeedbackPopupOnly();
    }
}

// --- FIX: Updated checkExploreAnswer to use setTimeout and match required feedback text ---
// --- FIX: Updated checkExploreAnswer to use setTimeout and match required feedback text ---
function checkExploreAnswer() {
  const current = exploreExpressions[currentExploreIndex];
  const parts = current.rationalize.split('/');
  const correctSolution = createExpressionFromManualInput(parts[0], parts[1]);

  if (!correctSolution) {
    feedback = "Error processing the current question.";
    showFeedback = true;
    setTimeout(() => { showFeedback = false; }, 1500);
    return;
  }

  const userConjNum = exploreCNumInput.text.trim().replace(/\s/g, "");
  const userConjDen = exploreCDenInput.text.trim().replace(/\s/g, "");
  const userAnsNum = exploreANumInput.text.trim().replace(/\s/g, "");
  const userAnsDen = exploreADenInput.text.trim().replace(/\s/g, "");

  const correctConj = correctSolution.conjugate.replace(/\s/g, "");
  const isConjugateCorrect = userConjNum === correctConj && userConjDen === correctConj;

  const [correctNum, correctDen] = parseAnswer(correctSolution.answer);
  const userForms = getEquivalentForms(userAnsNum, userAnsDen);
  const correctForms = getEquivalentForms(correctNum.replace(/\s/g, ""), correctDen.replace(/\s/g, ""));

  let isAnswerCorrect = false;
  for (const uForm of userForms) {
    if (correctForms.has(uForm)) {
      isAnswerCorrect = true;
      break;
    }
  }

  if (isConjugateCorrect && isAnswerCorrect) {
    feedback = "Correct Answer";
  } else if (!isConjugateCorrect && !isAnswerCorrect) {
    feedback = "Both Conjugate and Answer are Incorrect";
  } else if (isConjugateCorrect) { // and !isAnswerCorrect
    feedback = "Conjugate is Correct, but Answer is Incorrect";
  } else { // !isConjugateCorrect and isAnswerCorrect
    feedback = "Answer is Correct, but Conjugate is Incorrect";
  }

  showFeedback = true;
  
  // --- FIX START: Generate blurred background only once ---
  blurredBg = get(); // Capture the current canvas
  blurredBg.filter(BLUR, 9); // Apply the blur effect once
  // --- FIX END ---
  
  // Use setTimeout to hide the popup after 1.5 seconds
  setTimeout(() => {
    showFeedback = false;
    blurredBg = null; // Clear the stored image
  }, 1500);
}


// --- MODIFICATION: New function to cycle questions in Explore tab ---
function nextExploreQuestion() {
    currentExploreIndex = (currentExploreIndex + 1) % exploreExpressions.length;
    const current = exploreExpressions[currentExploreIndex];
    const parts = current.rationalize.split('/');
    
    exploreQNumInput.text = parts[0];
    exploreQDenInput.text = parts[1];
    
    // Clear other input fields
    exploreCNumInput.text = "";
    exploreCDenInput.text = "";
    exploreANumInput.text = "";
    exploreADenInput.text = "";
    
    showFeedback = false; // Hide any feedback from previous question
}

// --- MODIFICATION START: Redesigned Operation Tab Layout ---
function drawOperationTab() {
  const boxW = 700;
  const boxH = 300;
  const boxX = (width - boxW) / 2;
  const boxY = 120;
  fill(245); 
  stroke(208); 
  strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 12); 

  const buttonWidth = 140;
  const buttonHeight = 50;
  const buttonX = boxX + 30;
  const descX = buttonX + buttonWidth + 25;
  const descW = boxX + boxW - descX - 30;

  // --- MODIFICATION: Button Styling Updated ---
  const defaultBG = color('#ff4d4d');      // Bright Red
  const hoverBG = color('#4CAF50');        // Green
  const defaultBorder = color('#b30000');  // Dark Red
  const hoverBorder = color('#006400');    // Dark Green
  const textColor = color(255);             // White
  const noBorder = false;                   // We need borders now
  const isVisible = true;

  const items = [
    {
      y: boxY + 40,
      buttonText: "Simple Surd",
      action: () => startMode("simple"),
      descText: "A surd with only one square root term in the numerator or denominator.\nExample: 1/√2, √3/4"
    },
    {
      y: boxY + 40 + 85,
      buttonText: "Binomial Surd",
      action: () => startMode("binomial"),
      descText: "A surd expression with two terms, one of which includes a square root.\nExample: 1/(√2 + 1), 5/(2 − √3)"
    },
    {
      y: boxY + 40 + 85 + 95,
      buttonText: "Mixed Practice",
      action: () => startMode("mixed"),
      descText: "A mix of simple and binomial surds in the same expression.\nExample: √3/√2, √5/(1 + √3)"
    }
  ];

  for (const item of items) {
    buttons.push(
      new Button(
        buttonX,
        item.y,
        buttonWidth,
        buttonHeight,
        item.buttonText,
        item.action,
        defaultBG,
        isVisible,
        hoverBG,
        noBorder,
        defaultBorder, 
        hoverBorder,
        "rect", 
        true, 
        textColor,
        textColor 
      )
    );
    
    textAlign(LEFT, TOP);
    noStroke();
    fill(50);
    textSize(14);
    text(item.descText, descX, item.y + 5, descW);
  }
}
// --- MODIFICATION END ---

function resetOperationFields() {
  currentExpression = null;
  currentStep = 0;
  showHint = false;
  showFeedback = false;
  feedbackTimer = 0;
  showAnimation = false;
  animationProgress = 0;
  showConjugateHint = false;
  if (opNumeratorInput) {
    opNumeratorInput.text = "";
    opNumeratorInput.isEnabled = true;
  }
  if (opDenominatorInput) {
    opDenominatorInput.text = "";
    opDenominatorInput.isEnabled = true;
  }
  if (opNumeratorInput2) {
    opNumeratorInput2.text = "";
    opNumeratorInput2.isEnabled = false;
  }
  if (opDenominatorInput2) {
    opDenominatorInput2.text = "";
    opDenominatorInput2.isEnabled = false;
  }
  if (answerNumeratorInput) {
    answerNumeratorInput.text = "";
    answerNumeratorInput.isEnabled = false;
  }
  if (answerDenominatorInput) {
    answerDenominatorInput.text = "";
    answerDenominatorInput.isEnabled = false;
  }
}

function drawProblemSolver() {
  buttons.push(
    new Button(
      20,
      20,
      100,
      40,
      "← Back",
      () => {
        currentMode = "menu";
        resetProblemState();
      },
      color(149, 165, 166)
    )
  );
  fill(color(44, 62, 80));
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(BOLD);
  text("Rationalise the Denominator", 400, 60);
  textStyle(NORMAL);
  textSize(14);
  fill(color(127, 140, 141));
  let modeText =
    currentMode === "simple"
      ? "Simple Surd Mode"
      : currentMode === "binomial"
      ? "Binomial Surd Mode"
      : "Mixed Practice Mode";
  text(modeText, 400, 85);

  const containerW = 600;
  const containerH = 100;
  const containerX = 400 - containerW / 2;
  const containerY = 165 - containerH / 2;
  fill(255);
  stroke(220);
  strokeWeight(2);
  rect(containerX, containerY, containerW, containerH, 20);
  const lineY = 165;
  stroke(50);
  strokeWeight(2);

  line(
    opNumeratorInput.x,
    lineY,
    opNumeratorInput.x + opNumeratorInput.w,
    lineY
  );
  line(
    opNumeratorInput2.x,
    lineY,
    opNumeratorInput2.x + opNumeratorInput2.w,
    lineY
  );
  line(
    answerNumeratorInput.x,
    lineY,
    answerNumeratorInput.x + answerNumeratorInput.w,
    lineY
  );

  textAlign(CENTER, CENTER);
  textSize(24);
  noStroke();
  fill(50);

  text(
    "×",
    (opNumeratorInput.x + opNumeratorInput.w + opNumeratorInput2.x) / 2,
    containerY + containerH / 2
  );
  text(
    "=",
    (opNumeratorInput2.x + opNumeratorInput2.w + answerNumeratorInput.x) / 2,
    containerY + containerH / 2
  );

  opNumeratorInput.draw();
  opDenominatorInput.draw();
  opNumeratorInput2.draw();
  opDenominatorInput2.draw();
  answerNumeratorInput.draw();
  answerDenominatorInput.draw();

  if (showRedDot) {
    fill(255, 0, 0); // Red
    noStroke();
    ellipse(
      opDenominatorInput.x - 15,
      opDenominatorInput.y + opDenominatorInput.h / 2,
      8,
      8
    );
  }

  drawStepByStepGuidance();

  const buttonY = 440;
  const buttonW = 120;
  const buttonH = 45;
  const totalButtonWidth = 3 * buttonW + 2 * 30;
  const startX = 400 - totalButtonWidth / 2;
  buttons.push(
    new Button(
      startX,
      buttonY,
      buttonW,
      buttonH,
      "Reset",
      resetOperationFields,
      color(155, 89, 182)
    )
  );
  buttons.push(
    new Button(
      startX + buttonW + 30,
      buttonY,
      buttonW,
      buttonH,
      "Check Answer",
      checkAnswer,
      color(46, 204, 113)
    )
  );
  buttons.push(
    new Button(
      startX + 2 * (buttonW + 30),
      buttonY,
      buttonW,
      buttonH,
      "Generate",
      generateNewExpression,
      color(241, 196, 15)
    )
  );

  buttons.forEach((btn) => btn.draw());
  if (showFeedback) drawFeedback();
}

function drawStepByStepGuidance() {
  noStroke();
  const containerX = (width - 600) / 2;
  const startY = 250;
  const stepSpacing = 30;
  const instructionSpacing = 30;
  const staticTextColor = color(44, 62, 80);
  fill(staticTextColor);

  textAlign(LEFT, TOP);
  textSize(25);
  textStyle(BOLD);
  text("Steps to Rationalise:", containerX, startY);
  textStyle(NORMAL);

  let steps = [
    "1. Input or generate a question",
    "2. Multiply numerator and denominator by ___?",
    "3. Simplify the result",
  ];
  textSize(18);
  textStyle(BOLD);

  let yOffset = 0;

  if (showConjugateHint) {
    const denText = opDenominatorInput.text.trim();
    if (!denText.includes("√")) {
      showConjugateHint = false;
    }
  }

  steps.forEach((step, index) => {
    let y = startY + 35 + index * stepSpacing + yOffset;
    fill(staticTextColor);
    text(step, containerX, y);

    if (index === 1) {
      let problemNum = opNumeratorInput.text.trim();
      let problemDen = opDenominatorInput.text.trim();
      let displayInstruction = showConjugateHint;
      let currentDenom = "";
      let currentNum = "";

      if (currentExpression || (problemNum && problemDen)) {
        currentDenom =
          problemNum && problemDen ? problemDen : currentExpression.denominator;
        currentNum =
          problemNum && problemDen ? problemNum : currentExpression.numerator;
      } else {
        displayInstruction = false;
      }

      if (displayInstruction) {
        let denominatorStr = currentDenom.replace(/\s/g, "");
        let type = "simple";
        if (
          denominatorStr.length > 1 &&
          (denominatorStr.substring(1).includes("+") ||
            denominatorStr.substring(1).includes("-"))
        ) {
          type = "binomial";
        }

        push();
        fill(80);
        let instructionY = y + instructionSpacing;
        let conjugate = "";
        let instructionText = "";

        if (type === "binomial") {
          let operatorIndex = denominatorStr.substring(1).search(/[+-]/) + 1;
          const operator = denominatorStr[operatorIndex];
          const flippedOperator = operator === "+" ? "-" : "+";
          conjugate =
            denominatorStr.substring(0, operatorIndex) +
            flippedOperator +
            denominatorStr.substring(operatorIndex + 1);
          instructionText = `For ${currentNum}/(${currentDenom}), multiply by (${conjugate})/(${conjugate})`;
        } else {
          conjugate = denominatorStr;
          instructionText = `For ${currentNum}/${currentDenom}, multiply by ${conjugate}/${conjugate}`;
        }

        text(instructionText, containerX + 20, instructionY);
        yOffset += instructionSpacing + 10;
        pop();
      }
    }
  });
}

function drawAnimation() {
  if (animationProgress < 1) animationProgress += 0.02;
  push();
  translate(350, 155);
  let alpha = map(animationProgress, 0, 1, 0, 255);
  fill(
    red(color(231, 76, 60)),
    green(color(231, 76, 60)),
    blue(color(231, 76, 60)),
    alpha
  );
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(BOLD);
  text(`×`, 0, 0);
  textSize(28);
  text(currentExpression.conjugate, 100, -20);
  stroke(
    red(color(231, 76, 60)),
    green(color(231, 76, 60)),
    blue(color(231, 76, 60)),
    alpha
  );
  strokeWeight(2);
  line(50, 0, 150, 0);
  noStroke();
  text(currentExpression.conjugate, 100, 25);
  textStyle(NORMAL);
  pop();
}
function drawPracticeMode() {
  const themeBlue = color(52, 152, 219);
  const hoverGrey = color(128, 128, 128);
  buttons.push(
    new Button(
      25,
      25,
      45,
      45,
      "←",
      () => {
        currentMode = "menu";
        resetPracticeState();
      },
      themeBlue,
      true,
      hoverGrey,
      true,
      null,
      null,
      "circle"
    )
  );
  textAlign(CENTER, CENTER);
  noStroke();
  const plainGreen = color(0, 128, 0);
  textStyle(BOLD);
  textSize(24);
  fill(plainGreen);
  text("Practice Mode", 400, 50);
  textStyle(NORMAL);
  textSize(16);
  let scoreText = `Score: ${score} | Question ${Math.min(
    currentPracticeIndex + 1,
    10
  )}/10`;
  fill(plainGreen);
  text(scoreText, 400, 80);
  if (practiceQuestions.length === 0) initializePracticeMode();
  if (currentPracticeIndex < 10) {
    let question = practiceQuestions[currentPracticeIndex];
    fill(color(52, 152, 219));
    textSize(32);
    textStyle(BOLD);
    text(question.numerator, 400, 130);
    stroke(color(52, 152, 219));
    strokeWeight(3);
    line(350, 150, 450, 150);
    noStroke();
    text(question.denominator, 400, 175);
    textStyle(NORMAL);
    fill(color(44, 62, 80));
    textAlign(RIGHT, CENTER);
    textSize(14);
    text(
      "Enter numerator:",
      numeratorInput.x - 15,
      numeratorInput.y + numeratorInput.h / 2
    );
    text(
      "Enter denominator:",
      denominatorInput.x - 15,
      denominatorInput.y + denominatorInput.h / 2
    );
    stroke(color(44, 62, 80));
    strokeWeight(2);
    const lineY =
      (numeratorInput.y + numeratorInput.h + denominatorInput.y) / 2;
    line(
      numeratorInput.x - 10,
      lineY,
      numeratorInput.x + numeratorInput.w + 10,
      lineY
    );
    noStroke();
    numeratorInput.draw();
    denominatorInput.draw();
    const btnRed = color(255, 0, 0);
    const btnDarkRed = color(139, 0, 0);
    const btnGreen = color(0, 128, 0);
    const btnDarkGreen = color(0, 100, 0);
    buttons.push(
      new Button(
        350,
        400,
        100,
        40,
        "Submit",
        checkPracticeAnswer,
        btnRed,
        true,
        btnGreen,
        false,
        btnDarkRed,
        btnDarkGreen
      )
    );
    const isBinomial = question.type === "binomial";
    let hintBtn = new Button(
      460,
      400,
      100,
      40,
      "Hint",
      () => {
        showHintPopup = true;
        hintPopupTimer = 180;
      },
      color(241, 196, 15),
      true,
      color(243, 215, 142),
      false,
      null,
      null,
      "rect",
      isBinomial
    );
    buttons.push(hintBtn);
  } else {
    drawPracticeResults();
  }
  buttons.forEach((btn) => btn.draw());
  if (showFeedback) {
    let bgImage = get();
    bgImage.filter(BLUR, 9);
    image(bgImage, 0, 0);
    drawFeedbackPopupOnly();
  }
  if (showHintPopup) drawHintPopup(460, 400, 100, 40);
}
function drawHintPopup(btnX, btnY, btnW, btnH) {
  const hintText =
    "Take the conjugate and multiply to the numerator and the denominator.";
  const padding = 15;
  const boxWidth = 200;
  const boxHeight = 80;
  const boxX = btnX + btnW + 10;
  const boxY = btnY + btnH / 2 - boxHeight / 2;
  fill(255, 248, 220);
  stroke(color(241, 196, 15));
  strokeWeight(2);
  const cornerRadius = 25;
  const pointerSize = 12;
  const pointerOffset = 8;
  const yCenter = boxY + boxHeight / 2;
  beginShape();
  vertex(boxX + boxWidth - cornerRadius, boxY);
  bezierVertex(
    boxX + boxWidth,
    boxY,
    boxX + boxWidth,
    boxY,
    boxX + boxWidth,
    boxY + cornerRadius
  );
  vertex(boxX + boxWidth, boxY + boxHeight - cornerRadius);
  bezierVertex(
    boxX + boxWidth,
    boxY + boxHeight,
    boxX + boxWidth,
    boxY + boxHeight,
    boxX + boxWidth - cornerRadius,
    boxY + boxHeight
  );
  vertex(boxX + cornerRadius, boxY + boxHeight);
  bezierVertex(
    boxX,
    boxY + boxHeight,
    boxX,
    boxY + boxHeight,
    boxX,
    boxY + boxHeight - cornerRadius
  );
  vertex(boxX, yCenter + pointerOffset);
  vertex(boxX - pointerSize, yCenter);
  vertex(boxX, yCenter - pointerOffset);
  vertex(boxX, boxY + cornerRadius);
  bezierVertex(boxX, boxY, boxX, boxY, boxX + cornerRadius, boxY);
  endShape(CLOSE);
  fill(0);
  textAlign(LEFT, TOP);
  textSize(14);
  text(
    hintText,
    boxX + padding,
    boxY + padding,
    boxWidth - padding * 2,
    boxHeight - padding * 2
  );
}
function drawFeedbackPopupOnly() {
  const lines = feedback.split("\n");
  const paddingX = 40;
  const paddingY = 30;
  const lineHeight = 25;
  textSize(16);
  let maxWidth = 0;
  lines.forEach((line) => {
    const w = textWidth(line);
    if (w > maxWidth) maxWidth = w;
  });
  const boxWidth = maxWidth + paddingX * 2;
  const boxHeight = lines.length * lineHeight + paddingY * 2;
  const boxX = (width - boxWidth) / 2;
  const boxY = (height - boxHeight) / 2;
  fill(255, 255, 255);
  stroke(color(52, 152, 219));
  strokeWeight(3);
  rect(boxX, boxY, boxWidth, boxHeight, 15);
  noStroke();
  fill(color(44, 62, 80));
  textAlign(CENTER, CENTER);
  const totalTextHeight = (lines.length - 1) * lineHeight;
  let startY = boxY + boxHeight / 2 - totalTextHeight / 2;
  lines.forEach((line, index) => {
    text(line, boxX + boxWidth / 2, startY + index * lineHeight);
  });
}
function drawFeedback() {
  fill(0, 0, 0, 100);
  rect(0, 0, width, height);
  fill(255, 255, 255);
  stroke(color(52, 152, 219));
  strokeWeight(3);
  rect(150, 180, 500, 140, 15);
  noStroke();
  fill(color(44, 62, 80));
  textAlign(CENTER, CENTER);
  textSize(16);
  let lines = [];
  let words = feedback.split(" ");
  let currentLine = "";
  for (let word of words) {
    if (textWidth(currentLine + word + " ") < 450) {
      currentLine += word + " ";
    } else {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());
  let startY = 250 - (lines.length - 1) * 10;
  lines.forEach((line, index) => {
    text(line, 400, startY + index * 20);
  });
}
function drawPracticeResults() {
  fill(color(44, 62, 80));
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  text("Practice Complete!", 400, 200);
  textStyle(NORMAL);
  textSize(20);
  const totalPossibleScore = 100;
  const percentage = (score / totalPossibleScore) * 100;
  text(`Final Score: ${score}/100 (${percentage}%)`, 400, 250);
  let rating = "";
  let ratingColor = color(127, 140, 141);
  if (percentage >= 90) {
    rating = "Excellent! 🌟";
    ratingColor = color(46, 204, 113);
  } else if (percentage >= 70) {
    rating = "Good work! 👍";
    ratingColor = color(52, 152, 219);
  } else if (percentage >= 50) {
    rating = "Keep practicing! 💪";
    ratingColor = color(241, 196, 15);
  } else {
    rating = "More practice needed! 📚";
    ratingColor = color(231, 76, 60);
  }
  fill(ratingColor);
  textSize(18);
  text(rating, 400, 300);
  buttons.push(
    new Button(
      260,
      350,
      120,
      50,
      "Try Again",
      initializePracticeMode,
      color(52, 152, 219)
    )
  );
  buttons.push(
    new Button(
      420,
      350,
      120,
      50,
      "Main Menu",
      () => {
        currentMode = "menu";
        resetPracticeState();
      },
      color(149, 165, 166)
    )
  );
}

// --- MODIFICATION: Updated validation logic ---
function handleBlurValidation() {
  const fields = [
    opNumeratorInput,
    opDenominatorInput,
    opNumeratorInput2,
    opDenominatorInput2,
    answerNumeratorInput,
    answerDenominatorInput,
    numeratorInput,
    denominatorInput,
  ];
  const previouslyFocused = fields.find((f) => f && f.focused);

  if (
    previouslyFocused === opDenominatorInput &&
    ["simple", "binomial", "mixed"].includes(currentMode)
  ) {
    const text = previouslyFocused.text.trim();
    if (text.length > 0) {
      let isValid = false;

      if (currentMode === "binomial") {
        const hasSqrt = text.includes("√");
        // Check for an operator that is not a leading sign
        const hasOperator =
          text.includes("+") || text.substring(1).includes("-");
        isValid = hasSqrt && hasOperator;
      } else if (currentMode === "mixed") {
        isValid = text.includes("√");
      } else {
        // simple mode
        isValid =
          text.includes("√") && !text.includes("+") && !text.includes("-");
      }

      if (!isValid) {
        previouslyFocused.text = ""; // Erase the input
        showRedDot = true;
        redDotTimer = 120; // 2 seconds at 60fps
        showConjugateHint = false; // Hide hint if input becomes invalid
      }
    }
  }
}

function hideKeyboard() {
  const container = document.getElementById("keyboard-container");
  if (container) {
    container.style.display = "none";
    isKeyboardVisible = false;
  }
}

function mousePressed() {

  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  if (showFeedback) {
    // Re-calculate the feedback box's dimensions to determine if the click was inside it.
    // This logic is duplicated from drawFeedbackPopupOnly().
    const lines = feedback.split("\n");
    const paddingX = 40;
    const paddingY = 30;
    const lineHeight = 25;
    textSize(16); // Ensure text size is the same as when drawing
    let maxWidth = 0;
    lines.forEach((line) => {
      const w = textWidth(line);
      if (w > maxWidth) maxWidth = w;
    });
    const boxWidth = maxWidth + paddingX * 2;
    const boxHeight = lines.length * lineHeight + paddingY * 2;
    const boxX = (width - boxWidth) / 2;
    const boxY = (height - boxHeight) / 2;

    // If the click is outside the bounds of the feedback popup, hide it.
    if (
      mouseX < boxX ||
      mouseX > boxX + boxWidth ||
      mouseY < boxY ||
      mouseY > boxY + boxHeight
    ) {
      showFeedback = false;
      return; // The click's purpose was to close the popup, so we stop here.
    }
  }
  let anyInputClicked = false;

  



  if (currentMode === "practice") {
    if (numeratorInput?.isClicked()) anyInputClicked = true;
    if (denominatorInput?.isClicked()) anyInputClicked = true;
  } else if (["simple", "binomial", "mixed"].includes(currentMode)) {
    if (opNumeratorInput?.isClicked()) anyInputClicked = true;
    if (opDenominatorInput?.isClicked()) anyInputClicked = true;
    if (opNumeratorInput2?.isClicked()) anyInputClicked = true;
    if (opDenominatorInput2?.isClicked()) anyInputClicked = true;
    if (answerNumeratorInput?.isClicked()) anyInputClicked = true;
    if (answerDenominatorInput?.isClicked()) anyInputClicked = true;
  } else if (activeTab === 'explore') {
      if (exploreQNumInput?.isClicked()) anyInputClicked = true;
      if (exploreQDenInput?.isClicked()) anyInputClicked = true;
      if (exploreCNumInput?.isClicked()) anyInputClicked = true;
      if (exploreCDenInput?.isClicked()) anyInputClicked = true;
      if (exploreANumInput?.isClicked()) anyInputClicked = true;
      if (exploreADenInput?.isClicked()) anyInputClicked = true;
  }

  // --- MODIFICATION START ---
  // If the keyboard is visible and the click was not on an input field,
  // it means the user clicked "outside", so we close the keyboard.
  if (isKeyboardVisible && !anyInputClicked) {
    hideKeyboard();
  }
  // --- MODIFICATION END ---

  if (!anyInputClicked) {
    handleBlurValidation();
    [
      numeratorInput,
      denominatorInput,
      opNumeratorInput,
      opDenominatorInput,
      opNumeratorInput2,
      opDenominatorInput2,
      answerNumeratorInput,
      answerDenominatorInput,
      exploreQNumInput,
      exploreQDenInput,
      exploreCNumInput,
      exploreCDenInput,
      exploreANumInput,
      exploreADenInput
    ].forEach((field) => {
      if (field) field.focused = false;
    });
  }
  return false;
}

function keyPressed() {
  if (["practice", "simple", "binomial", "mixed"].includes(currentMode) || activeTab === 'explore') {
    if (
      (opNumeratorInput && opNumeratorInput.focused) ||
      (opDenominatorInput && opDenominatorInput.focused) ||
      (opNumeratorInput2 && opNumeratorInput2.focused) ||
      (opDenominatorInput2 && opDenominatorInput2.focused) ||
      (answerNumeratorInput && answerNumeratorInput.focused) ||
      (answerDenominatorInput && answerDenominatorInput.focused) ||
      (numeratorInput && numeratorInput.focused) ||
      (denominatorInput && denominatorInput.focused) ||
      (exploreQNumInput && exploreQNumInput.focused) ||
      (exploreQDenInput && exploreQDenInput.focused) ||
      (exploreCNumInput && exploreCNumInput.focused) ||
      (exploreCDenInput && exploreCDenInput.focused) ||
      (exploreANumInput && exploreANumInput.focused) ||
      (exploreADenInput && exploreADenInput.focused)
    ) {
      return false;
    }
  }
}

function startMode(mode) {
  currentMode = mode;
  resetProblemState();
  if (mode === "practice") {
    initializePracticeMode();
  } else if (["simple", "binomial", "mixed"].includes(mode)) {
    resetOperationFields();
    // createOnScreenKeyboard();
  } else {
    destroyOnScreenKeyboard();
  }
}

function resetProblemState() {
  currentExpression = null;
  currentStep = 0;
  showHint = false;
  showFeedback = false;
  feedbackTimer = 0;
  showAnimation = false;
  animationProgress = 0;
  [
    numeratorInput,
    denominatorInput,
    opNumeratorInput,
    opDenominatorInput,
    opNumeratorInput2,
    opDenominatorInput2,
    answerNumeratorInput,
    answerDenominatorInput,
  ].forEach((field) => {
    if (field) field.text = "";
  });
  destroyOnScreenKeyboard();
}

function resetPracticeState() {
  practiceQuestions = [];
  currentPracticeIndex = 0;
  score = 0;
  questionsAnswered = 0;
  resetProblemState();
  destroyOnScreenKeyboard();
  isCheckingAnswer = false;
  showHintPopup = false;
  hintPopupTimer = 0;
}

function generateNewExpression() {
  resetOperationFields();
  if (["simple", "binomial", "mixed"].includes(currentMode)) {
    // createOnScreenKeyboard();
  }
  let expressions;
  if (currentMode === "simple") expressions = simpleExpressions;
  else if (currentMode === "binomial") expressions = binomialExpressions;
  else expressions = [...simpleExpressions, ...binomialExpressions];
  currentExpression =
    expressions[Math.floor(Math.random() * expressions.length)];
  if (opNumeratorInput && opDenominatorInput) {
    opNumeratorInput.text = currentExpression.numerator;
    opDenominatorInput.text = currentExpression.denominator;
  }
}

const getEquivalentForms = (num, den) => {
  const forms = new Set();
  const addParen = (s) =>
    (s.includes("+") || s.substring(1).includes("-")) &&
    !(s.startsWith("(") && s.endsWith(")"))
      ? `(${s})`
      : s;
  forms.add(`${addParen(num)}/${den}`);
  forms.add(`${num}/${den}`);
  if (den === "1") forms.add(num);
  if (den === "-1") {
    if (num.startsWith("-")) forms.add(num.substring(1));
    else forms.add(`-${addParen(num)}`);
  }
  if (num.startsWith("-")) forms.add(`-(${num.substring(1)}/${den})`);
  forms.add(num.replace(/[()]/g, "") + "/" + den.replace(/[()]/g, ""));
  if (den === "1")
    forms
      .add(num.replace(/[()]/g, ""))
      .add(num.replace(/[()]/g, "").replace(" ", ""));
  return forms;
};

// --- MODIFICATION START: Added helper function to solve manual input ---
// --- FIX START: Replace the entire original function with this one ---
function createExpressionFromManualInput(numStr, denStr) {
  // Helper to parse a term like "-2√3" into { coeff: -2, rad: 3 } or "5" into { coeff: 5, rad: 1 }
  const parseTerm = (termStr) => {
    termStr = termStr.trim();
    const match = termStr.match(/^(-?\d*)√(\d+)$/);
    if (match) {
      let coeff = 1;
      if (match[1] === "-") {
        coeff = -1;
      } else if (match[1]) {
        coeff = parseInt(match[1], 10);
      }
      return { coeff: coeff, rad: parseInt(match[2], 10) };
    }
    const intMatch = termStr.match(/^-?\d+$/);
    if (intMatch) {
        return { coeff: parseInt(termStr, 10), rad: 1 };
    }
    return null; // Return null if parsing fails
  };

  // Helper to simplify a radical, e.g., √12 -> 2√3
  const simplifyRadical = (rad) => {
    if (rad < 1) return { outer: 0, inner: 1 };
    let outer = 1;
    let inner = rad;
    for (let i = Math.floor(Math.sqrt(rad)); i > 1; i--) {
      if (inner % (i * i) === 0) {
        inner /= (i * i);
        outer *= i;
      }
    }
    return { outer, inner };
  };
  
  // Helper to represent a term as a string, e.g., { coeff: 2, rad: 3 } -> "2√3"
  const termToString = (term) => {
      if (term.rad === 1 || term.coeff === 0) return `${term.coeff}`;
      const simplified = simplifyRadical(term.rad);
      const totalCoeff = term.coeff * simplified.outer;
      if (simplified.inner === 1) return `${totalCoeff}`;
      if (totalCoeff === 1) return `√${simplified.inner}`;
      if (totalCoeff === -1) return `-√${simplified.inner}`;
      return `${totalCoeff}√${simplified.inner}`;
  };

  // Helper for greatest common divisor
  const gcd = (a, b) => (b === 0 ? a : gcd(b, Math.abs(a % b)));

  const numTerm = parseTerm(numStr.replace(/\s/g, ""));
  const den = denStr.replace(/\s/g, "");

  if (!numTerm || !den.includes("√")) return null; // Invalid input

  let conjugate = "", answer = "";
  let isBinomial = false;

  let operatorIndex = -1;
  if (den.lastIndexOf("+") > 0) operatorIndex = den.lastIndexOf("+");
  else if (den.lastIndexOf("-") > 0) operatorIndex = den.lastIndexOf("-");

  if (operatorIndex > 0) { // Binomial Denominator
    isBinomial = true;
    const term1Str = den.substring(0, operatorIndex);
    const operator = den[operatorIndex];
    const term2Str = den.substring(operatorIndex + 1);
    
    const term1 = parseTerm(term1Str);
    const term2 = parseTerm(term2Str);
    if (!term1 || !term2) return null;

    const flippedOperator = operator === "+" ? "-" : "+";
    conjugate = `${term1Str}${flippedOperator}${term2Str}`;
    
    const conjTerm2 = parseTerm(flippedOperator + term2Str);

    const finalDen = (term1.coeff**2 * term1.rad) - (term2.coeff**2 * term2.rad);

    // Multiply numerator with conjugate: numTerm * (term1 + conjTerm2)
    const newNumTerm1 = { coeff: numTerm.coeff * term1.coeff, rad: numTerm.rad * term1.rad };
    const newNumTerm2 = { coeff: numTerm.coeff * conjTerm2.coeff, rad: numTerm.rad * conjTerm2.rad };

    const strNum1 = termToString(newNumTerm1);
    const strNum2 = termToString(newNumTerm2);
    
    let finalNumStr = strNum1;
    if (parseInt(strNum2, 10) >= 0) {
      finalNumStr += `+${strNum2}`;
    } else {
      finalNumStr += strNum2;
    }
    
    if (finalDen === 1) answer = finalNumStr;
    else if (finalDen === -1) answer = `-${finalNumStr.includes('+') || finalNumStr.includes('-') ? `(${finalNumStr})` : finalNumStr}`;
    else answer = `${finalNumStr.includes('+') || finalNumStr.includes('-') ? `(${finalNumStr})` : finalNumStr}/${finalDen}`;

  } else { // Simple Denominator
    const denTerm = parseTerm(den);
    if (!denTerm) return null;

    conjugate = den;
    const finalDen = denTerm.coeff**2 * denTerm.rad;
    
    // Multiply numerator with conjugate (denominator)
    const newNumTerm = { coeff: numTerm.coeff * denTerm.coeff, rad: numTerm.rad * denTerm.rad };
    const simplifiedNum = termToString(newNumTerm);
    
    const numCoeffMatch = simplifiedNum.match(/^(-?\d+)/);
    const numCoeff = numCoeffMatch ? parseInt(numCoeffMatch[1], 10) : 1;
    
    const commonDivisor = gcd(numCoeff, finalDen);
    const simplifiedNumCoeff = numCoeff / commonDivisor;
    const simplifiedDen = finalDen / commonDivisor;

    let finalNumPart = simplifiedNum.replace(/^(-?\d+)/, simplifiedNumCoeff);
    if (simplifiedNumCoeff === 1 && finalNumPart.startsWith('1')) finalNumPart = finalNumPart.substring(1);
    if (simplifiedNumCoeff === -1 && finalNumPart.startsWith('-1')) finalNumPart = '-' + finalNumPart.substring(2);


    if (simplifiedDen === 1) answer = finalNumPart;
    else answer = `${finalNumPart}/${simplifiedDen}`;
  }

  return {
    type: isBinomial ? "binomial" : "simple",
    numerator: numStr,
    denominator: denStr,
    conjugate: conjugate.replace(/\s/g, ""),
    answer: answer.replace(/\s/g, "").replace(/\+-/g, '-'),
  };
}
// --- FIX END ---
// --- MODIFICATION END ---

// --- MODIFICATION START: Updated checkAnswer function to handle manual input ---
function checkAnswer() {
  let userConjNum = opNumeratorInput2.text.trim();
  let userConjDen = opDenominatorInput2.text.trim();
  let userAnsNum = answerNumeratorInput.text.trim();
  let userAnsDen = answerDenominatorInput.text.trim();
  let problemNum = opNumeratorInput.text.trim();
  let problemDen = opDenominatorInput.text.trim();
  let wasManual = false;

  if (!currentExpression && problemNum && problemDen) {
    currentExpression = createExpressionFromManualInput(problemNum, problemDen);
    wasManual = true;
    if (!currentExpression) {
      feedback = "Could not process the manually entered expression. Please check the format.";
      showFeedback = true;
      feedbackTimer = 180;
      currentExpression = null; 
      return;
    }
  }

  let expressionToSolve = currentExpression;

  if (!expressionToSolve) {
    feedback = 'Please use the "Generate" button or manually enter a question first.';
    showFeedback = true;
    feedbackTimer = 120;
    return;
  }

  if (
    !wasManual && (
    problemNum !== expressionToSolve.numerator ||
    problemDen !== expressionToSolve.denominator)
  ) {
    feedback = 'The question has been changed. Please use "Generate" for a new question.';
    showFeedback = true;
    feedbackTimer = 120;
    if (wasManual) currentExpression = null; 
    return;
  }

  if (!userConjNum || !userConjDen || !userAnsNum || !userAnsDen) {
    feedback = "Please fill in the conjugate and the final answer.";
    showFeedback = true;
    feedbackTimer = 120;
    if (wasManual) currentExpression = null; 
    return;
  }

  const userConjNumClean = userConjNum.replace(/\s/g, "");
  const userConjDenClean = userConjDen.replace(/\s/g, "");
  const correctConjugate = expressionToSolve.conjugate.replace(/\s/g, "");
  const isConjugateCorrect =
    userConjNumClean === correctConjugate &&
    userConjDenClean === correctConjugate;

  const [correctNum, correctDen] = parseAnswer(expressionToSolve.answer);
  const userForms = getEquivalentForms(
    userAnsNum.replace(/\s/g, ""),
    userAnsDen.replace(/\s/g, "")
  );
  const correctForms = getEquivalentForms(
    correctNum.replace(/\s/g, ""),
    correctDen.replace(/\s/g, "")
  );

  let isAnswerCorrect = false;
  for (const uForm of userForms) {
    if (correctForms.has(uForm)) {
      isAnswerCorrect = true;
      break;
    }
  }
  
  if (isConjugateCorrect && isAnswerCorrect) {
    feedback = "✅ Correct! You have used the right conjugate and your answer is correct.";
    currentStep = 3;
  } else if (isConjugateCorrect && !isAnswerCorrect) {
    feedback = "⚠️ Correct conjugate, but the answer is incorrect. Try again.";
    currentStep = 2;
  } else if (!isConjugateCorrect && isAnswerCorrect) {
    feedback = "❌ Incorrect conjugate, but the answer is somehow correct. Please check your conjugate.";
    currentStep = 1;
  } else {
    feedback = "❌ Incorrect conjugate and incorrect answer. Please check your approach.";
    currentStep = 1;
  }

  showFeedback = true;
  feedbackTimer = 180;
  
  if (wasManual) {
    currentExpression = null;
  }
}
// --- MODIFICATION END ---

function initializePracticeMode() {
  resetPracticeState();
  let allExpressions = [...simpleExpressions, ...binomialExpressions];
  allExpressions.sort(() => 0.5 - Math.random());
  practiceQuestions = allExpressions.slice(0, 10);
  currentPracticeIndex = 0;
  if (numeratorInput) numeratorInput.text = "";
  if (denominatorInput) denominatorInput.text = "";
  // createOnScreenKeyboard();
}
function checkPracticeAnswer() {
  if (isCheckingAnswer || currentPracticeIndex >= 10) return;
  isCheckingAnswer = true;
  const userNum = numeratorInput.text.trim().replace(/\s/g, "");
  const userDen = denominatorInput.text.trim().replace(/\s/g, "");
  if (userNum === "" || userDen === "") {
    feedback = "Numerator and denominator are required.";
    showFeedback = true;
    setTimeout(() => {
      showFeedback = false;
      isCheckingAnswer = false;
    }, 1500);
    return;
  }
  if (userDen === "0") {
    feedback = "Denominator cannot be zero.";
    showFeedback = true;
    setTimeout(() => {
      showFeedback = false;
      isCheckingAnswer = false;
    }, 1500);
    return;
  }
  const correctAnswerRaw = practiceQuestions[currentPracticeIndex].answer;
  const correctAnswer = correctAnswerRaw.replace(/\s/g, "");
  let correctNum, correctDen;
  const fractionMatch = correctAnswer.match(/^(.*)\/(.*)$/);
  const negativeGroupMatch = correctAnswer.match(/^-\((.*)\)$/);
  if (fractionMatch) {
    correctNum = fractionMatch[1];
    correctDen = fractionMatch[2];
  } else if (negativeGroupMatch) {
    correctNum = negativeGroupMatch[1];
    correctDen = "-1";
  } else {
    correctNum = correctAnswer;
    correctDen = "1";
  }
  const userForms = getEquivalentForms(userNum, userDen);
  const correctForms = getEquivalentForms(correctNum, correctDen);
  let isCorrect = false;
  for (const uForm of userForms) {
    if (correctForms.has(uForm)) {
      isCorrect = true;
      break;
    }
  }
  questionsAnswered = Math.min(questionsAnswered + 1, 10);
  if (isCorrect) {
    score += 10;
    feedback = "Correct✅";
  } else {
    feedback = `Incorrect❌\nCorrect Answer: ${correctAnswerRaw}`;
  }
  showFeedback = true;
  feedbackTimer = 120;
  setTimeout(() => {
    showFeedback = false;
    currentPracticeIndex++;
    showHintPopup = false;
    hintPopupTimer = 0;
    if (numeratorInput) numeratorInput.text = "";
    if (denominatorInput) denominatorInput.text = "";
    if (currentPracticeIndex >= 10) destroyOnScreenKeyboard();
    isCheckingAnswer = false;
  }, 1500);
}