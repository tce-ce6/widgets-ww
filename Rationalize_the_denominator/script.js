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
    let inputBox = null; // Deprecated for Operation Mode
    let numeratorInput = null;
    let denominatorInput = null;
    let opNumeratorInput = null;
    let opDenominatorInput = null;
    let opNumeratorInput2 = null;
    let opDenominatorInput2 = null;
    let answerNumeratorInput = null;
    let answerDenominatorInput = null;

    // --- MODIFICATION: Toast Notification Variables ---
    let toastMessage = "";
    let toastColor = null;
    let toastTimer = 0;
    // --- END MODIFICATION ---

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
    let isDraggingKeyboard = false; // MODIFICATION: Flag to track keyboard drag state

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

    function showKeyboard() {
      const container = document.getElementById("keyboard-container");
      if (container) {
        if (container.innerHTML.trim() === "") {
          createOnScreenKeyboard();
        }
        container.style.display = "flex";
        isKeyboardVisible = true;
      }
    }
    
    // --- MODIFICATION: Function to make keyboard draggable ---
    function dragElement(elmnt) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      const dragHandle = elmnt.querySelector(".keyboard-drag-handle");

      if (dragHandle) {
        // if present, the header is where you move the DIV from:
        dragHandle.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation(); // MODIFICATION: Prevent click-through to canvas
        isDraggingKeyboard = true; // MODIFICATION: Set drag flag
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // MODIFICATION: Calculate new position using 'bottom' property
        // First, calculate the new theoretical top position to maintain existing logic for Y-axis movement
        let currentTop = elmnt.offsetTop;
        let newTop = currentTop - pos2;

        // Constrain the element to stay within the viewport
        newTop = Math.max(0, Math.min(window.innerHeight - elmnt.offsetHeight, newTop));
        
        // Convert the valid 'top' position to a 'bottom' position
        const newBottom = window.innerHeight - newTop - elmnt.offsetHeight;

        // Horizontal dragging logic remains the same
        let newLeft = Math.max(0, Math.min(window.innerWidth - elmnt.offsetWidth, elmnt.offsetLeft - pos1));
        
        // Set the element's new position using bottom and left
        elmnt.style.top = ''; // Unset the top property to ensure 'bottom' is used
        elmnt.style.bottom = newBottom + 'px';
        elmnt.style.left = newLeft + "px";
        elmnt.style.transform = 'none'; // Remove transform to use left/bottom positioning
      }

      function closeDragElement() {
        isDraggingKeyboard = false; // MODIFICATION: Reset drag flag
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
    // --- END MODIFICATION ---

    function createOnScreenKeyboard() {
      const container = document.getElementById("keyboard-container");
      if (!container) return;

      container.addEventListener('mousedown', (e) => {
        // Allow dragging via handle, but stop propagation for other parts
        if (!e.target.closest('.keyboard-drag-handle')) {
            e.stopPropagation();
        }
      });

      container.innerHTML = ""; // Clear previous keyboard if any

      // --- MODIFICATION: Add drag handle ---
      const dragHandle = document.createElement("div");
      dragHandle.className = "keyboard-drag-handle";
      // SVG for the move icon
      dragHandle.innerHTML = `<svg viewBox="0 0 24 24"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></svg>`;
      container.appendChild(dragHandle);
      // --- END MODIFICATION ---

      const closeBtn = document.createElement("button");
      closeBtn.className = "keyboard-close-btn";
      closeBtn.innerHTML = "&times;";
      closeBtn.onclick = () => hideKeyboard();
      container.appendChild(closeBtn);

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
      
      // --- MODIFICATION: Make the newly created keyboard draggable ---
      dragElement(container);
      // --- END MODIFICATION ---
    }

    function destroyOnScreenKeyboard() {
      const container = document.getElementById("keyboard-container");
      if (container) {
        container.style.display = "none";
        container.innerHTML = "";
        isKeyboardVisible = false;
      }
    }

    class Button {
      constructor(
        x, y, w, h, text, action, color = "#3498db", visible = true,
        hoverColor = null, noBorder = false, borderColor = null, hoverBorderColor = null,
        shape = "rect", isEnabled = true, textColor = null, hoverTextColor = null
      ) {
        this.x = x; this.y = y; this.w = w; this.h = h; this.text = text;
        this.action = action; this.color = color; this.hover = false;
        this.pressed = false; this.visible = visible; this.hoverColor = hoverColor;
        this.noBorder = noBorder; this.borderColor = borderColor;
        this.hoverBorderColor = hoverBorderColor; this.shape = shape;
        this.isEnabled = isEnabled; this.textColor = textColor;
        this.hoverTextColor = hoverTextColor;
      }
      draw() {
        if (!this.visible) return;
        this.hover = mouseX >= this.x && mouseX <= this.x + this.w &&
                     mouseY >= this.y && mouseY <= this.y + this.h;
        let activeColor = this.color;
        if (this.isEnabled) {
          if (this.hover) {
            activeColor = this.hoverColor ? this.hoverColor :
              color(red(this.color) + 20, green(this.color) + 20, blue(this.color) + 20);
          }
          fill(this.pressed ?
            color(red(activeColor) - 30, green(activeColor) - 30, blue(activeColor) - 30) :
            activeColor
          );
        } else {
          fill(200); stroke(150); strokeWeight(2);
        }
        if (this.noBorder || !this.isEnabled) {
          noStroke();
        } else {
          strokeWeight(2);
          let currentBorderColor = this.hover && this.hoverBorderColor ? this.hoverBorderColor : this.borderColor;
          if (currentBorderColor) {
            stroke(currentBorderColor);
          } else {
            stroke(red(activeColor) - 40, green(activeColor) - 40, blue(activeColor) - 40);
          }
        }
        if (this.shape === "circle") {
          ellipse(this.x + this.w / 2, this.y + this.h / 2, min(this.w, this.h));
        } else {
          rect(this.x, this.y, this.w, this.h, 10);
        }
        
        let currentTextColor = this.textColor;
        if (this.hover && this.isEnabled && this.hoverTextColor) {
            currentTextColor = this.hoverTextColor;
        }
        if (currentTextColor) {
            fill(this.isEnabled ? currentTextColor : color(100));
        } else {
            fill(this.isEnabled ? 255 : 100);
        }

        noStroke();
        textAlign(CENTER, CENTER);
        let textSizeValue = this.shape === "circle" ? this.w / 2 : this.w > 150 ? 14 : 12;
        textSize(textSizeValue);
        textStyle(BOLD);
        let lines = this.text.split("\n");
        if (lines.length > 1) {
          for (let i = 0; i < lines.length; i++) {
            text(lines[i], this.x + this.w / 2, this.y + this.h / 2 - (lines.length - 1) * 8 + i * 16);
          }
        } else {
          text(this.text, this.x + this.w / 2, this.y + this.h / 2);
        }
        textStyle(NORMAL);
      }
      isClicked() {
        if (!this.isEnabled) return false;
        return mouseX >= this.x && mouseX <= this.x + this.w &&
               mouseY >= this.y && mouseY <= this.y + this.h &&
               mouseIsPressed && !this.pressed;
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
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.placeholder = placeholder; this.text = "";
        this.focused = false; this.cursorBlink = 0;
        this.isEnabled = isEnabled;
      }
      draw() {
        if (this.isEnabled) {
          fill(this.focused ? color(227, 242, 253) : color(248, 249, 250));
          stroke(this.focused ? color(52, 152, 219) : color(189, 195, 199));
        } else {
          fill(color(236, 240, 241));
          stroke(color(210, 210, 210));
        }
        strokeWeight(2);
        rect(this.x, this.y, this.w, this.h, 8);
        textAlign(CENTER, CENTER);
        let displayText = this.text || this.placeholder;
        fill(this.isEnabled ? (this.text ? color(44, 62, 80) : color(149, 165, 166)) : color(180, 180, 180));
        text(displayText, this.x + this.w / 2, this.y + this.h / 2);
        if (this.isEnabled && this.focused && this.cursorBlink < 30) {
          let textW = textWidth(this.text);
          stroke(color(44, 62, 80));
          strokeWeight(1);
          line(this.x + this.w / 2 + textW / 2 + 2, this.y + 8, this.x + this.w / 2 + textW / 2 + 2, this.y + this.h - 8);
        }
        this.cursorBlink = (this.cursorBlink + 1) % 60;
      }
      isClicked() {
        if (!this.isEnabled) return false;
        return mouseX >= this.x && mouseX <= this.x + this.w && mouseY >= this.y && mouseY <= this.y + this.h;
      }
      update() {
        if (!this.isEnabled) {
          this.focused = false;
          return;
        }
        if (mouseIsPressed && this.isClicked()) {
          if (!this.focused) {
            handleBlurValidation();
            [
              numeratorInput, denominatorInput, opNumeratorInput, opDenominatorInput,
              opNumeratorInput2, opDenominatorInput2, answerNumeratorInput, answerDenominatorInput,
              exploreQNumInput, exploreQDenInput, exploreCNumInput, exploreCDenInput,
              exploreANumInput, exploreADenInput
            ].forEach((field) => {
              if (field) field.focused = false;
            });
            this.focused = true;
            showKeyboard();
            
            if (this === opNumeratorInput2) {
              const denText = opDenominatorInput.text.trim();
              let isDenValid = false;
              if (denText.length > 0) {
                if (currentMode === "binomial") {
                  const hasSqrt = denText.includes("√");
                  const hasOperator = denText.includes("+") || denText.substring(1).includes("-");
                  const endsWithOperator = denText.endsWith("+") || denText.endsWith("-");
                  isDenValid = hasSqrt && hasOperator && !endsWithOperator;
                } else if (currentMode === "mixed") {
                  isDenValid = denText.includes("√");
                } else {
                  isDenValid = denText.includes("√") && !denText.includes("+") && !denText.includes("-");
                }
              }
              showConjugateHint = isDenValid;
            }
          }
        }
      }
    }

    function showToastNotification(message, isCorrect) {
        toastMessage = message;
        toastColor = isCorrect ? color(46, 204, 113, 220) : color(231, 76, 60, 220);
        toastTimer = 180;
    }

    function drawToast() {
        if (toastTimer > 0) {
            toastTimer--;
            
            // --- MODIFICATION: User requested change to toast width ---
            const toastWidth = textWidth(toastMessage) + 100;
            // --- END MODIFICATION ---

            const toastHeight = 50;
            const x = width / 2 - toastWidth / 2;
            const y = height - 70;

            let alpha = toastTimer < 60 ? map(toastTimer, 0, 60, 0, 220) : 220;
            
            let c = toastColor;
            c.setAlpha(alpha);

            fill(c);
            noStroke();
            rect(x, y, toastWidth, toastHeight, 25);

            fill(255, alpha);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(toastMessage, x + toastWidth / 2, y + toastHeight / 2);
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

      opNumeratorInput = new InputField(opPair1X, opFractionY - opInputHeight - 5, opInputWidth, opInputHeight, "N", true);
      opDenominatorInput = new InputField(opPair1X, opFractionY + 5, opInputWidth, opInputHeight, "D", true);
      opNumeratorInput2 = new InputField(opPair2X, opFractionY - opInputHeight - 5, opInputWidth, opInputHeight, "√", false);
      opDenominatorInput2 = new InputField(opPair2X, opFractionY + 5, opInputWidth, opInputHeight, "√", false);
      answerNumeratorInput = new InputField(opPair3X, opFractionY - opInputHeight - 5, opInputWidth, opInputHeight, "", false);
      answerDenominatorInput = new InputField(opPair3X, opFractionY + 5, opInputWidth, opInputHeight, "", false);

      const inputWidth = 220;
      const inputHeight = 40;
      const fractionX = 340;
      const numeratorY = 260;
      const denominatorY = 320;
      numeratorInput = new InputField(fractionX, numeratorY, inputWidth, inputHeight, "");
      denominatorInput = new InputField(fractionX, denominatorY, inputWidth, inputHeight, "");

      const exploreInputWidth = 120;
      const exploreInputHeight = 35;
      const exploreFractionY = 325;
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
      const questionFilled = opNumeratorInput.text.trim().length > 0 && opDenominatorInput.text.trim().length > 0;
      if (opNumeratorInput2.isEnabled !== questionFilled) {
        opNumeratorInput2.isEnabled = questionFilled;
        opDenominatorInput2.isEnabled = questionFilled;
        if (!questionFilled) {
          opNumeratorInput2.text = "";
          opDenominatorInput2.text = "";
        }
      }

      const conjugateFilled = opNumeratorInput2.text.trim().length > 0 && opDenominatorInput2.text.trim().length > 0;
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
      
      if (showHintPopup && hintPopupTimer > 0) {
        hintPopupTimer--;
        if (hintPopupTimer <= 0) showHintPopup = false;
      }
      if (showRedDot && redDotTimer > 0) {
        redDotTimer--;
        if (redDotTimer <= 0) showRedDot = false;
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
      
      // MODIFICATION: Only update canvas elements if not dragging the keyboard
      if (!isDraggingKeyboard) {
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

      drawToast();
    }

    function drawMenu() {
      noStroke();
      fill(color(44, 62, 80));
      textAlign(CENTER, CENTER);
      textSize(28);
      textStyle(BOLD);
      textStyle(NORMAL);
      const toggleX = 200, toggleY = 40, toggleW = 400, toggleH = 50;
      const tabW = toggleW / 3;
      buttons.push(new Button(toggleX, toggleY, tabW, toggleH, "", () => { activeTab = "operation"; destroyOnScreenKeyboard(); }, "#000", false));
      buttons.push(new Button(toggleX + tabW, toggleY, tabW, toggleH, "", () => { activeTab = "practice"; destroyOnScreenKeyboard(); }, "#000", false));
      buttons.push(new Button(toggleX + 2 * tabW, toggleY, tabW, toggleH, "", () => { activeTab = "explore"; }, "#000", false));
      
      fill(230, 230, 250);
      noStroke();
      rect(toggleX, toggleY, toggleW, toggleH, 25);
      let sliderTargetX = activeTab === "operation" ? toggleX + 5 : activeTab === "practice" ? toggleX + tabW + 5 : toggleX + 2 * tabW + 5;
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
        const boxW = 600, boxH = 250, boxX = (width - boxW) / 2, boxY = 150;
        fill('#f5f5f5'); stroke('#d0d0d0'); strokeWeight(2);
        rect(boxX, boxY, boxW, boxH, 15);
        const description = [
          "• Test your skills with 10 randomized rationalisation questions covering simple, binomial, and mixed surds.",
          "• Your accuracy, score, and speed will be tracked as you go. Hints and tips will appear for tricky ones to guide you.",
          "• Click Start Practice to begin and see how many you can solve correctly with confidence!"
        ];
        textAlign(LEFT, TOP); noStroke(); fill(50); textSize(14);
        let currentY = boxY + 30;
        const textX = boxX + 30, textW = boxW - 60;
        description.forEach(line => {
            text(line, textX, currentY, textW);
            currentY += textLeading() * Math.ceil(textWidth(line) / textW) + 10;
        });
        const buttonW = 200, buttonH = 50, buttonX = boxX + (boxW - buttonW) / 2, buttonY = boxY + boxH - buttonH - 30;
        buttons.push(new Button(buttonX, buttonY, buttonW, buttonH, "Start (10 Questions)", () => startMode("practice"), color(231, 76, 60), true, color(46, 204, 113)));
      } else {
        drawExploreTab();
      }
      buttons.forEach((btn) => btn.draw());
    }

    function drawExploreTab() {
        const titleY = 110, titleHeight = 22;
        fill(44, 62, 80); noStroke(); textAlign(CENTER, TOP); textSize(titleHeight); textStyle(BOLD);
        text("💡Real Life Application", width / 2, titleY);
        textStyle(NORMAL);

        const boxX = 100, boxY = titleY + titleHeight + 12, boxW = 600, boxH = 120;
        fill(255, 253, 208); stroke(253, 203, 110); strokeWeight(2);
        rect(boxX, boxY, boxW, boxH, 15);

        const current = exploreExpressions[currentExploreIndex];
        fill(0); noStroke(); textAlign(LEFT, TOP);
        textSize(16); textStyle(BOLD);
        text(current.title, boxX + 20, boxY + 15);
        textStyle(NORMAL);
        textSize(14);
        text(`Formula: ${current.formula}`, boxX + 20, boxY + 45);
        text(`Given: ${current.given}`, boxX + 20, boxY + 65);
        text(`Rationalize the following: ${current.rationalize}`, boxX + 20, boxY + 85);

        const inputContainerY = boxY + boxH + 16, inputContainerW = 480, inputContainerH = 100, inputContainerX = (width - inputContainerW) / 2;
        fill(245); stroke(220);
        rect(inputContainerX, inputContainerY, inputContainerW, inputContainerH, 15);

        const exploreInputHeight = 35;
        const exploreFractionY = inputContainerY + inputContainerH / 2;
        exploreQNumInput.y = exploreFractionY - exploreInputHeight - 5;
        exploreQDenInput.y = exploreFractionY + 5;
        exploreCNumInput.y = exploreFractionY - exploreInputHeight - 5;
        exploreCDenInput.y = exploreFractionY + 5;
        exploreANumInput.y = exploreFractionY - exploreInputHeight - 5;
        exploreADenInput.y = exploreFractionY + 5;

        const lineY = exploreFractionY;
        stroke(50); strokeWeight(2);
        line(exploreQNumInput.x, lineY, exploreQNumInput.x + exploreQNumInput.w, lineY);
        line(exploreCNumInput.x, lineY, exploreCNumInput.x + exploreCNumInput.w, lineY);
        line(exploreANumInput.x, lineY, exploreANumInput.x + exploreANumInput.w, lineY);

        textAlign(CENTER, CENTER); textSize(24); noStroke(); fill(50);
        text("×", (exploreQNumInput.x + exploreQNumInput.w + exploreCNumInput.x) / 2, inputContainerY + inputContainerH / 2);
        text("=", (exploreCNumInput.x + exploreCNumInput.w + exploreANumInput.x) / 2, inputContainerY + inputContainerH / 2);

        exploreQNumInput.draw(); exploreQDenInput.draw(); exploreCNumInput.draw();
        exploreCDenInput.draw(); exploreANumInput.draw(); exploreADenInput.draw();

        const buttonY = inputContainerY + inputContainerH + 20;
        const checkBtnX = width / 2 - 140, nextBtnX = width / 2 + 10;
        buttons.push(new Button(checkBtnX, buttonY, 130, 45, "Check Answer", checkExploreAnswer, color(46, 204, 113)));
        buttons.push(new Button(nextBtnX, buttonY, 130, 45, "Next Question", nextExploreQuestion, color(241, 196, 15)));
    }

    function checkExploreAnswer() {
      const current = exploreExpressions[currentExploreIndex];
      const parts = current.rationalize.split('/');
      const correctSolution = createExpressionFromManualInput(parts[0], parts[1]);

      if (!correctSolution) {
        showToastNotification("Error processing the current question.", false);
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
      
      let message = "", isCorrect = false;

      if (isConjugateCorrect && isAnswerCorrect) {
        message = "Correct Answer"; isCorrect = true;
      } else if (!isConjugateCorrect && !isAnswerCorrect) {
        message = "Both Conjugate and Answer are Incorrect";
      } else if (isConjugateCorrect) {
        message = "Conjugate is Correct, but Answer is Incorrect";
      } else {
        message = "Answer is Correct, but Conjugate is Incorrect";
      }
      showToastNotification(message, isCorrect);
    }

    function nextExploreQuestion() {
        currentExploreIndex = (currentExploreIndex + 1) % exploreExpressions.length;
        const current = exploreExpressions[currentExploreIndex];
        const parts = current.rationalize.split('/');
        exploreQNumInput.text = parts[0];
        exploreQDenInput.text = parts[1];
        exploreCNumInput.text = "";
        exploreCDenInput.text = "";
        exploreANumInput.text = "";
        exploreADenInput.text = "";
    }

    function drawOperationTab() {
      const boxW = 700, boxH = 300, boxX = (width - boxW) / 2, boxY = 120;
      fill(245); stroke(208); strokeWeight(2);
      rect(boxX, boxY, boxW, boxH, 12); 

      const buttonWidth = 140, buttonHeight = 50, buttonX = boxX + 30;
      const descX = buttonX + buttonWidth + 25, descW = boxX + boxW - descX - 30;

      const defaultBG = color('#ff4d4d'), hoverBG = color('#4CAF50');
      const defaultBorder = color('#b30000'), hoverBorder = color('#006400');
      const textColor = color(255), noBorder = false, isVisible = true;

      const items = [
        { y: boxY + 40, buttonText: "Simple Surd", action: () => startMode("simple"), descText: "A surd with only one square root term in the numerator or denominator.\nExample: 1/√2, √3/4" },
        { y: boxY + 40 + 85, buttonText: "Binomial Surd", action: () => startMode("binomial"), descText: "A surd expression with two terms, one of which includes a square root.\nExample: 1/(√2 + 1), 5/(2 − √3)" },
        { y: boxY + 40 + 85 + 95, buttonText: "Mixed Practice", action: () => startMode("mixed"), descText: "A mix of simple and binomial surds in the same expression.\nExample: √3/√2, √5/(1 + √3)" }
      ];

      for (const item of items) {
        buttons.push(new Button(buttonX, item.y, buttonWidth, buttonHeight, item.buttonText, item.action, defaultBG, isVisible, hoverBG, noBorder, defaultBorder, hoverBorder, "rect", true, textColor, textColor));
        textAlign(LEFT, TOP); noStroke(); fill(50); textSize(14);
        text(item.descText, descX, item.y + 5, descW);
      }
    }

    function resetOperationFields() {
      currentExpression = null; currentStep = 0; showHint = false;
      showAnimation = false; animationProgress = 0; showConjugateHint = false;
      if (opNumeratorInput) { opNumeratorInput.text = ""; opNumeratorInput.isEnabled = true; }
      if (opDenominatorInput) { opDenominatorInput.text = ""; opDenominatorInput.isEnabled = true; }
      if (opNumeratorInput2) { opNumeratorInput2.text = ""; opNumeratorInput2.isEnabled = false; }
      if (opDenominatorInput2) { opDenominatorInput2.text = ""; opDenominatorInput2.isEnabled = false; }
      if (answerNumeratorInput) { answerNumeratorInput.text = ""; answerNumeratorInput.isEnabled = false; }
      if (answerDenominatorInput) { answerDenominatorInput.text = ""; answerDenominatorInput.isEnabled = false; }
    }

    function drawProblemSolver() {
      buttons.push(new Button(20, 20, 100, 40, "← Back", () => { currentMode = "menu"; resetProblemState(); }, color(149, 165, 166)));
      fill(color(44, 62, 80)); textAlign(CENTER, CENTER); textSize(24); textStyle(BOLD);
      text("Rationalise the Denominator", 400, 60);
      textStyle(NORMAL); textSize(14); fill(color(127, 140, 141));
      let modeText = currentMode === "simple" ? "Simple Surd Mode" : currentMode === "binomial" ? "Binomial Surd Mode" : "Mixed Practice Mode";
      text(modeText, 400, 85);

      const containerW = 600, containerH = 100, containerX = 400 - containerW / 2, containerY = 165 - containerH / 2;
      fill(255); stroke(220); strokeWeight(2);
      rect(containerX, containerY, containerW, containerH, 20);
      const lineY = 165;
      stroke(50); strokeWeight(2);
      line(opNumeratorInput.x, lineY, opNumeratorInput.x + opNumeratorInput.w, lineY);
      line(opNumeratorInput2.x, lineY, opNumeratorInput2.x + opNumeratorInput2.w, lineY);
      line(answerNumeratorInput.x, lineY, answerNumeratorInput.x + answerNumeratorInput.w, lineY);

      textAlign(CENTER, CENTER); textSize(24); noStroke(); fill(50);
      text("×", (opNumeratorInput.x + opNumeratorInput.w + opNumeratorInput2.x) / 2, containerY + containerH / 2);
      text("=", (opNumeratorInput2.x + opNumeratorInput2.w + answerNumeratorInput.x) / 2, containerY + containerH / 2);

      opNumeratorInput.draw(); opDenominatorInput.draw(); opNumeratorInput2.draw();
      opDenominatorInput2.draw(); answerNumeratorInput.draw(); answerDenominatorInput.draw();

      if (showRedDot) {
        fill(255, 0, 0); noStroke();
        ellipse(opDenominatorInput.x - 15, opDenominatorInput.y + opDenominatorInput.h / 2, 8, 8);
      }

      drawStepByStepGuidance();

      const buttonY = 440, buttonW = 120, buttonH = 45;
      const totalButtonWidth = 3 * buttonW + 2 * 30;
      const startX = 400 - totalButtonWidth / 2;
      buttons.push(new Button(startX, buttonY, buttonW, buttonH, "Reset", resetOperationFields, color(155, 89, 182)));
      buttons.push(new Button(startX + buttonW + 30, buttonY, buttonW, buttonH, "Check Answer", checkAnswer, color(46, 204, 113)));
      buttons.push(new Button(startX + 2 * (buttonW + 30), buttonY, buttonW, buttonH, "Generate", generateNewExpression, color(241, 196, 15)));

      buttons.forEach((btn) => btn.draw());
    }

    function drawStepByStepGuidance() {
      noStroke();
      const containerX = (width - 600) / 2, startY = 250, stepSpacing = 30, instructionSpacing = 30;
      const staticTextColor = color(44, 62, 80);
      fill(staticTextColor);

      textAlign(LEFT, TOP); textSize(25); textStyle(BOLD);
      text("Steps to Rationalise:", containerX, startY);
      textStyle(NORMAL);

      let steps = ["1. Input or generate a question", "2. Multiply numerator and denominator by ___?", "3. Simplify the result"];
      textSize(18); textStyle(BOLD);
      let yOffset = 0;

      if (showConjugateHint && !opDenominatorInput.text.trim().includes("√")) {
        showConjugateHint = false;
      }

      steps.forEach((step, index) => {
        let y = startY + 35 + index * stepSpacing + yOffset;
        fill(staticTextColor);
        text(step, containerX, y);

        if (index === 1) {
          let problemNum = opNumeratorInput.text.trim();
          let problemDen = opDenominatorInput.text.trim();
          let displayInstruction = showConjugateHint;
          let currentDenom = "", currentNum = "";

          if (currentExpression || (problemNum && problemDen)) {
            currentDenom = problemNum && problemDen ? problemDen : currentExpression.denominator;
            currentNum = problemNum && problemDen ? problemNum : currentExpression.numerator;
          } else {
            displayInstruction = false;
          }

          if (displayInstruction) {
            let denominatorStr = currentDenom.replace(/\s/g, "");
            let type = (denominatorStr.length > 1 && (denominatorStr.substring(1).includes("+") || denominatorStr.substring(1).includes("-"))) ? "binomial" : "simple";
            
            push();
            fill(80);
            let instructionY = y + instructionSpacing;
            let conjugate = "", instructionText = "";

            if (type === "binomial") {
              let operatorIndex = denominatorStr.substring(1).search(/[+-]/) + 1;
              const operator = denominatorStr[operatorIndex];
              const flippedOperator = operator === "+" ? "-" : "+";
              conjugate = denominatorStr.substring(0, operatorIndex) + flippedOperator + denominatorStr.substring(operatorIndex + 1);
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

    function drawPracticeMode() {
      const themeBlue = color(52, 152, 219), hoverGrey = color(128, 128, 128);
      buttons.push(new Button(25, 25, 45, 45, "←", () => { currentMode = "menu"; resetPracticeState(); }, themeBlue, true, hoverGrey, true, null, null, "circle"));
      
      textAlign(CENTER, CENTER); noStroke();
      const plainGreen = color(0, 128, 0);
      textStyle(BOLD); textSize(24); fill(plainGreen);
      text("Practice Mode", 400, 50);
      textStyle(NORMAL); textSize(16);
      let scoreText = `Score: ${score} | Question ${Math.min(currentPracticeIndex + 1, 10)}/10`;
      fill(plainGreen);
      text(scoreText, 400, 80);
      
      if (practiceQuestions.length === 0) initializePracticeMode();
      
      if (currentPracticeIndex < 10) {
        let question = practiceQuestions[currentPracticeIndex];
        fill(color(52, 152, 219)); textSize(32); textStyle(BOLD);
        text(question.numerator, 400, 130);
        stroke(color(52, 152, 219)); strokeWeight(3);
        line(350, 150, 450, 150);
        noStroke();
        text(question.denominator, 400, 175);
        textStyle(NORMAL);
        
        fill(color(44, 62, 80)); textAlign(RIGHT, CENTER); textSize(14);
        text("Enter numerator:", numeratorInput.x - 15, numeratorInput.y + numeratorInput.h / 2);
        text("Enter denominator:", denominatorInput.x - 15, denominatorInput.y + denominatorInput.h / 2);
        
        stroke(color(44, 62, 80)); strokeWeight(2);
        const lineY = (numeratorInput.y + numeratorInput.h + denominatorInput.y) / 2;
        line(numeratorInput.x - 10, lineY, numeratorInput.x + numeratorInput.w + 10, lineY);
        noStroke();
        numeratorInput.draw();
        denominatorInput.draw();
        
        const btnRed = color(255, 0, 0), btnDarkRed = color(139, 0, 0);
        const btnGreen = color(0, 128, 0), btnDarkGreen = color(0, 100, 0);
        buttons.push(new Button(350, 400, 100, 40, "Submit", checkPracticeAnswer, btnRed, true, btnGreen, false, btnDarkRed, btnDarkGreen));
        
        const isBinomial = question.type === "binomial";
        buttons.push(new Button(460, 400, 100, 40, "Hint", () => { showHintPopup = true; hintPopupTimer = 180; }, color(241, 196, 15), true, color(243, 215, 142), false, null, null, "rect", isBinomial));
      } else {
        drawPracticeResults();
      }
      buttons.forEach((btn) => btn.draw());
      if (showHintPopup) drawHintPopup(460, 400, 100, 40);
    }

    function drawHintPopup(btnX, btnY, btnW, btnH) {
      const hintText = "Take the conjugate and multiply to the numerator and the denominator.";
      const padding = 15, boxWidth = 200, boxHeight = 80;
      const boxX = btnX + btnW + 10, boxY = btnY + btnH / 2 - boxHeight / 2;
      fill(255, 248, 220); stroke(color(241, 196, 15)); strokeWeight(2);
      const cornerRadius = 25, pointerSize = 12, pointerOffset = 8, yCenter = boxY + boxHeight / 2;
      beginShape();
      vertex(boxX + boxWidth - cornerRadius, boxY);
      bezierVertex(boxX + boxWidth, boxY, boxX + boxWidth, boxY, boxX + boxWidth, boxY + cornerRadius);
      vertex(boxX + boxWidth, boxY + boxHeight - cornerRadius);
      bezierVertex(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - cornerRadius, boxY + boxHeight);
      vertex(boxX + cornerRadius, boxY + boxHeight);
      bezierVertex(boxX, boxY + boxHeight, boxX, boxY + boxHeight, boxX, boxY + boxHeight - cornerRadius);
      vertex(boxX, yCenter + pointerOffset);
      vertex(boxX - pointerSize, yCenter);
      vertex(boxX, yCenter - pointerOffset);
      vertex(boxX, boxY + cornerRadius);
      bezierVertex(boxX, boxY, boxX, boxY, boxX + cornerRadius, boxY);
      endShape(CLOSE);
      fill(0); textAlign(LEFT, TOP); textSize(14);
      text(hintText, boxX + padding, boxY + padding, boxWidth - padding * 2, boxHeight - padding * 2);
    }

    function drawPracticeResults() {
      fill(color(44, 62, 80)); textAlign(CENTER, CENTER);
      textSize(28); textStyle(BOLD);
      text("Practice Complete!", 400, 200);
      textStyle(NORMAL); textSize(20);
      const totalPossibleScore = 100;
      const percentage = (score / totalPossibleScore) * 100;
      text(`Final Score: ${score}/100 (${percentage}%)`, 400, 250);
      
      let rating = "", ratingColor = color(127, 140, 141);
      if (percentage >= 90) { rating = "Excellent! 🌟"; ratingColor = color(46, 204, 113); }
      else if (percentage >= 70) { rating = "Good work! 👍"; ratingColor = color(52, 152, 219); }
      else if (percentage >= 50) { rating = "Keep practicing! 💪"; ratingColor = color(241, 196, 15); }
      else { rating = "More practice needed! 📚"; ratingColor = color(231, 76, 60); }
      
      fill(ratingColor); textSize(18);
      text(rating, 400, 300);
      
      buttons.push(new Button(260, 350, 120, 50, "Try Again", initializePracticeMode, color(52, 152, 219)));
      buttons.push(new Button(420, 350, 120, 50, "Main Menu", () => { currentMode = "menu"; resetPracticeState(); }, color(149, 165, 166)));
    }

    function handleBlurValidation() {
      const fields = [opNumeratorInput, opDenominatorInput, opNumeratorInput2, opDenominatorInput2, answerNumeratorInput, answerDenominatorInput, numeratorInput, denominatorInput];
      const previouslyFocused = fields.find((f) => f && f.focused);

      if (previouslyFocused === opDenominatorInput && ["simple", "binomial", "mixed"].includes(currentMode)) {
        const text = previouslyFocused.text.trim();
        if (text.length > 0) {
          let isValid = false;
          if (currentMode === "binomial") {
            const hasSqrt = text.includes("√");
            const hasOperator = text.includes("+") || text.substring(1).includes("-");
            isValid = hasSqrt && hasOperator;
          } else if (currentMode === "mixed") {
            isValid = text.includes("√");
          } else {
            isValid = text.includes("√") && !text.includes("+") && !text.includes("-");
          }
          if (!isValid) {
            previouslyFocused.text = "";
            showRedDot = true;
            redDotTimer = 120;
            showConjugateHint = false;
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

      if (isKeyboardVisible && !anyInputClicked) {
        // Check if click is outside keyboard
        const keyboardRect = document.getElementById('keyboard-container').getBoundingClientRect();
        if(mouseX < keyboardRect.left || mouseX > keyboardRect.right || mouseY < keyboardRect.top || mouseY > keyboardRect.bottom) {
             hideKeyboard();
        }
      }

      if (!anyInputClicked) {
        handleBlurValidation();
        [
          numeratorInput, denominatorInput, opNumeratorInput, opDenominatorInput,
          opNumeratorInput2, opDenominatorInput2, answerNumeratorInput, answerDenominatorInput,
          exploreQNumInput, exploreQDenInput, exploreCNumInput, exploreCDenInput,
          exploreANumInput, exploreADenInput
        ].forEach((field) => {
          if (field) field.focused = false;
        });
      }
      return false;
    }

    function startMode(mode) {
      currentMode = mode;
      resetProblemState();
      if (mode === "practice") {
        initializePracticeMode();
      } else if (["simple", "binomial", "mixed"].includes(mode)) {
        resetOperationFields();
      } else {
        destroyOnScreenKeyboard();
      }
    }

    function resetProblemState() {
      currentExpression = null; currentStep = 0; showHint = false;
      showAnimation = false; animationProgress = 0;
      [
        numeratorInput, denominatorInput, opNumeratorInput, opDenominatorInput,
        opNumeratorInput2, opDenominatorInput2, answerNumeratorInput, answerDenominatorInput,
      ].forEach((field) => {
        if (field) field.text = "";
      });
      destroyOnScreenKeyboard();
    }

    function resetPracticeState() {
      practiceQuestions = []; currentPracticeIndex = 0; score = 0;
      questionsAnswered = 0; resetProblemState();
      destroyOnScreenKeyboard(); isCheckingAnswer = false;
      showHintPopup = false; hintPopupTimer = 0;
    }

    function generateNewExpression() {
      resetOperationFields();
      let expressions;
      if (currentMode === "simple") expressions = simpleExpressions;
      else if (currentMode === "binomial") expressions = binomialExpressions;
      else expressions = [...simpleExpressions, ...binomialExpressions];
      currentExpression = expressions[Math.floor(Math.random() * expressions.length)];
      if (opNumeratorInput && opDenominatorInput) {
        opNumeratorInput.text = currentExpression.numerator;
        opDenominatorInput.text = currentExpression.denominator;
      }
    }

    const getEquivalentForms = (num, den) => {
      const forms = new Set();
      const addParen = (s) => (s.includes("+") || s.substring(1).includes("-")) && !(s.startsWith("(") && s.endsWith(")")) ? `(${s})` : s;
      forms.add(`${addParen(num)}/${den}`);
      forms.add(`${num}/${den}`);
      if (den === "1") forms.add(num);
      if (den === "-1") {
        if (num.startsWith("-")) forms.add(num.substring(1));
        else forms.add(`-${addParen(num)}`);
      }
      if (num.startsWith("-")) forms.add(`-(${num.substring(1)}/${den})`);
      forms.add(num.replace(/[()]/g, "") + "/" + den.replace(/[()]/g, ""));
      if (den === "1") forms.add(num.replace(/[()]/g, "")).add(num.replace(/[()]/g, "").replace(" ", ""));
      return forms;
    };

    function createExpressionFromManualInput(numStr, denStr) {
      const parseTerm = (termStr) => {
        termStr = termStr.trim();
        const match = termStr.match(/^(-?\d*)√(\d+)$/);
        if (match) {
          let coeff = 1;
          if (match[1] === "-") { coeff = -1; }
          else if (match[1]) { coeff = parseInt(match[1], 10); }
          return { coeff: coeff, rad: parseInt(match[2], 10) };
        }
        const intMatch = termStr.match(/^-?\d+$/);
        if (intMatch) { return { coeff: parseInt(termStr, 10), rad: 1 }; }
        return null;
      };

      const simplifyRadical = (rad) => {
        if (rad < 1) return { outer: 0, inner: 1 };
        let outer = 1, inner = rad;
        for (let i = Math.floor(Math.sqrt(rad)); i > 1; i--) {
          if (inner % (i * i) === 0) {
            inner /= (i * i);
            outer *= i;
          }
        }
        return { outer, inner };
      };
      
      const termToString = (term) => {
          if (term.rad === 1 || term.coeff === 0) return `${term.coeff}`;
          const simplified = simplifyRadical(term.rad);
          const totalCoeff = term.coeff * simplified.outer;
          if (simplified.inner === 1) return `${totalCoeff}`;
          if (totalCoeff === 1) return `√${simplified.inner}`;
          if (totalCoeff === -1) return `-√${simplified.inner}`;
          return `${totalCoeff}√${simplified.inner}`;
      };

      const gcd = (a, b) => (b === 0 ? a : gcd(b, Math.abs(a % b)));

      const numTerm = parseTerm(numStr.replace(/\s/g, ""));
      const den = denStr.replace(/\s/g, "");

      if (!numTerm || !den.includes("√")) return null;

      let conjugate = "", answer = "", isBinomial = false;
      let operatorIndex = -1;
      if (den.lastIndexOf("+") > 0) operatorIndex = den.lastIndexOf("+");
      else if (den.lastIndexOf("-") > 0) operatorIndex = den.lastIndexOf("-");

      if (operatorIndex > 0) {
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
        const newNumTerm1 = { coeff: numTerm.coeff * term1.coeff, rad: numTerm.rad * term1.rad };
        const newNumTerm2 = { coeff: numTerm.coeff * conjTerm2.coeff, rad: numTerm.rad * conjTerm2.rad };
        const strNum1 = termToString(newNumTerm1);
        const strNum2 = termToString(newNumTerm2);
        
        let finalNumStr = strNum1;
        if (parseInt(strNum2, 10) >= 0) { finalNumStr += `+${strNum2}`; }
        else { finalNumStr += strNum2; }
        
        if (finalDen === 1) answer = finalNumStr;
        else if (finalDen === -1) answer = `-${finalNumStr.includes('+') || finalNumStr.includes('-') ? `(${finalNumStr})` : finalNumStr}`;
        else answer = `${finalNumStr.includes('+') || finalNumStr.includes('-') ? `(${finalNumStr})` : finalNumStr}/${finalDen}`;

      } else {
        const denTerm = parseTerm(den);
        if (!denTerm) return null;
        conjugate = den;
        const finalDen = denTerm.coeff**2 * denTerm.rad;
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
        numerator: numStr, denominator: denStr,
        conjugate: conjugate.replace(/\s/g, ""),
        answer: answer.replace(/\s/g, "").replace(/\+-/g, '-'),
      };
    }

    function checkAnswer() {
      let userConjNum = opNumeratorInput2.text.trim(), userConjDen = opDenominatorInput2.text.trim();
      let userAnsNum = answerNumeratorInput.text.trim(), userAnsDen = answerDenominatorInput.text.trim();
      let problemNum = opNumeratorInput.text.trim(), problemDen = opDenominatorInput.text.trim();
      let wasManual = false;

      if (!currentExpression && problemNum && problemDen) {
        currentExpression = createExpressionFromManualInput(problemNum, problemDen);
        wasManual = true;
        if (!currentExpression) {
          showToastNotification("Could not process the manually entered expression.", false);
          currentExpression = null; 
          return;
        }
      }

      let expressionToSolve = currentExpression;
      if (!expressionToSolve) {
        showToastNotification('Please "Generate" or enter a question first.', false);
        return;
      }

      if (!wasManual && (problemNum !== expressionToSolve.numerator || problemDen !== expressionToSolve.denominator)) {
        showToastNotification('The question has changed. Please use "Generate".', false);
        if (wasManual) currentExpression = null; 
        return;
      }

      if (!userConjNum || !userConjDen || !userAnsNum || !userAnsDen) {
        showToastNotification("Please fill in the conjugate and the final answer.", false);
        if (wasManual) currentExpression = null; 
        return;
      }

      const userConjNumClean = userConjNum.replace(/\s/g, ""), userConjDenClean = userConjDen.replace(/\s/g, "");
      const correctConjugate = expressionToSolve.conjugate.replace(/\s/g, "");
      const isConjugateCorrect = userConjNumClean === correctConjugate && userConjDenClean === correctConjugate;
      const [correctNum, correctDen] = parseAnswer(expressionToSolve.answer);
      const userForms = getEquivalentForms(userAnsNum.replace(/\s/g, ""), userAnsDen.replace(/\s/g, ""));
      const correctForms = getEquivalentForms(correctNum.replace(/\s/g, ""), correctDen.replace(/\s/g, ""));

      let isAnswerCorrect = false;
      for (const uForm of userForms) {
        if (correctForms.has(uForm)) {
          isAnswerCorrect = true;
          break;
        }
      }
      
      let message = "", isCorrect = false;
      if (isConjugateCorrect && isAnswerCorrect) {
        message = "✅ Correct! Well done."; isCorrect = true; currentStep = 3;
      } else if (isConjugateCorrect && !isAnswerCorrect) {
        message = "⚠️ Correct conjugate, but the answer is incorrect."; currentStep = 2;
      } else if (!isConjugateCorrect && isAnswerCorrect) {
        message = "❌ Incorrect conjugate, but the answer is correct?"; currentStep = 1;
      } else {
        message = "❌ Incorrect conjugate and answer."; currentStep = 1;
      }
      showToastNotification(message, isCorrect);
      if (wasManual) { currentExpression = null; }
    }

    function initializePracticeMode() {
      resetPracticeState();
      let allExpressions = [...simpleExpressions, ...binomialExpressions];
      allExpressions.sort(() => 0.5 - Math.random());
      practiceQuestions = allExpressions.slice(0, 10);
      currentPracticeIndex = 0;
      if (numeratorInput) numeratorInput.text = "";
      if (denominatorInput) denominatorInput.text = "";
    }

    function checkPracticeAnswer() {
      if (isCheckingAnswer || currentPracticeIndex >= 10) return;
      isCheckingAnswer = true;
      const userNum = numeratorInput.text.trim().replace(/\s/g, "");
      const userDen = denominatorInput.text.trim().replace(/\s/g, "");
      if (userNum === "" || userDen === "") {
        showToastNotification("Numerator and denominator are required.", false);
        isCheckingAnswer = false;
        return;
      }
      if (userDen === "0") {
        showToastNotification("Denominator cannot be zero.", false);
        isCheckingAnswer = false;
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
      
      let message = "";
      if (isCorrect) {
        score += 10;
        message = "Correct ✅";
      } else {
        message = `Incorrect ❌  Answer: ${correctAnswerRaw}`;
      }
      showToastNotification(message, isCorrect);
      
      setTimeout(() => {
        currentPracticeIndex++;
        showHintPopup = false;
        hintPopupTimer = 0;
        if (numeratorInput) numeratorInput.text = "";
        if (denominatorInput) denominatorInput.text = "";
        if (currentPracticeIndex >= 10) destroyOnScreenKeyboard();
        isCheckingAnswer = false;
      }, 1500);
    }
