class MathExpressionModel {
    constructor() {
        this.numbers = [];
        this.expression = [null, null, null, null];
        this.currentEquation = null;
        this.usedNumbers = [];
        this.result = null;
        this.calculationSteps = [];
        this.isComplete = false;
        this.isCorrect = false;
        this.attempts = [];
        this.largestValue = 0;
        this.bestExpression = [];
        this.equations = [
            {
                template: ['(', 0, '+', 1, ')', '×', 2, '^', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => (nums[0] + nums[1]) * Math.pow(nums[2], nums[3]),
                display: (nums) => `(${nums[0]} + ${nums[1]}) × ${nums[2]}^${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const sum = nums[0] + nums[1];
                    const power = Math.pow(nums[2], nums[3]);
                    const result = sum * power;
                    return [
                        `(${nums[0]} + ${nums[1]}) × ${nums[2]}^${nums[3]}`,
                        `${format(sum)} × ${format(power)}`,
                        format(result)
                    ];
                }
            },
            {
                template: [0, '^', 1, '+', 2, '×', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => Math.pow(nums[0], nums[1]) + (nums[2] * nums[3]),
                display: (nums) => `${nums[0]}^${nums[1]} + ${nums[2]} × ${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const power = Math.pow(nums[0], nums[1]);
                    const product = nums[2] * nums[3];
                    const result = power + product;
                    return [
                        `${nums[0]}^${nums[1]} + ${nums[2]} × ${nums[3]}`,
                        `${format(power)} + ${format(product)}`,
                        format(result)
                    ];
                }
            },
            {
                template: [0, '×', 1, '+', 2, '^', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => (nums[0] * nums[1]) + Math.pow(nums[2], nums[3]),
                display: (nums) => `${nums[0]} × ${nums[1]} + ${nums[2]}^${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const product = nums[0] * nums[1];
                    const power = Math.pow(nums[2], nums[3]);
                    const result = product + power;
                    return [
                        `${nums[0]} × ${nums[1]} + ${nums[2]}^${nums[3]}`,
                        `${format(product)} + ${format(power)}`,
                        format(result)
                    ];
                }
            },
            {
                template: ['(', 0, '×', 1, ')', '^', 2, '+', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => Math.pow(nums[0] * nums[1], nums[2]) + nums[3],
                display: (nums) => `(${nums[0]} × ${nums[1]})^${nums[2]} + ${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const product = nums[0] * nums[1];
                    const power = Math.pow(product, nums[2]);
                    const result = power + nums[3];
                    return [
                        `(${nums[0]} × ${nums[1]})^${nums[2]} + ${nums[3]}`,
                        `${format(product)}^${nums[2]} + ${nums[3]}`,
                        `${format(power)} + ${nums[3]}`,
                        format(result)
                    ];
                }
            },
            {
                template: [0, '^', 1, '×', 2, '+', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => Math.pow(nums[0], nums[1]) * nums[2] + nums[3],
                display: (nums) => `${nums[0]}^${nums[1]} × ${nums[2]} + ${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const power = Math.pow(nums[0], nums[1]);
                    const product = power * nums[2];
                    const result = product + nums[3];
                    return [
                        `${nums[0]}^${nums[1]} × ${nums[2]} + ${nums[3]}`,
                        `${format(power)} × ${nums[2]} + ${nums[3]}`,
                        `${format(product)} + ${nums[3]}`,
                        format(result)
                    ];
                }
            },
            {
                template: [0, '+', 1, '^', 2, '×', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => nums[0] + Math.pow(nums[1], nums[2]) * nums[3],
                display: (nums) => `${nums[0]} + ${nums[1]}^${nums[2]} × ${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const power = Math.pow(nums[1], nums[2]);
                    const product = power * nums[3];
                    const result = nums[0] + product;
                    return [
                        `${nums[0]} + ${nums[1]}^${nums[2]} × ${nums[3]}`,
                        `${nums[0]} + ${format(power)} × ${nums[3]}`,
                        `${nums[0]} + ${format(product)}`,
                        format(result)
                    ];
                }
            },
            {
                template: ['(', 0, '−', 1, ')', '×', 2, '^', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => (nums[0] - nums[1]) * Math.pow(nums[2], nums[3]),
                display: (nums) => `(${nums[0]} − ${nums[1]}) × ${nums[2]}^${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const diff = nums[0] - nums[1];
                    const power = Math.pow(nums[2], nums[3]);
                    const result = diff * power;
                    return [
                        `(${nums[0]} − ${nums[1]}) × ${nums[2]}^${nums[3]}`,
                        `${format(diff)} × ${format(power)}`,
                        format(result)
                    ];
                }
            },
            {
                template: [0, '^', 1, '−', 2, '×', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => Math.pow(nums[0], nums[1]) - (nums[2] * nums[3]),
                display: (nums) => `${nums[0]}^${nums[1]} − ${nums[2]} × ${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const power = Math.pow(nums[0], nums[1]);
                    const product = nums[2] * nums[3];
                    const result = power - product;
                    return [
                        `${nums[0]}^${nums[1]} − ${nums[2]} × ${nums[3]}`,
                        `${format(power)} − ${format(product)}`,
                        format(result)
                    ];
                }
            },
            {
                template: [0, '×', 1, '−', 2, '^', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => (nums[0] * nums[1]) - Math.pow(nums[2], nums[3]),
                display: (nums) => `${nums[0]} × ${nums[1]} − ${nums[2]}^${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const product = nums[0] * nums[1];
                    const power = Math.pow(nums[2], nums[3]);
                    const result = product - power;
                    return [
                        `${nums[0]} × ${nums[1]} − ${nums[2]}^${nums[3]}`,
                        `${format(product)} − ${format(power)}`,
                        format(result)
                    ];
                }
            },
            {
                template: ['(', 0, '×', 1, ')', '^', 2, '−', 3],
                positions: [0, 1, 2, 3],
                calculate: (nums) => Math.pow(nums[0] * nums[1], nums[2]) - nums[3],
                display: (nums) => `(${nums[0]} × ${nums[1]})^${nums[2]} − ${nums[3]}`,
                steps: (nums) => {
                    const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
                    const product = nums[0] * nums[1];
                    const power = Math.pow(product, nums[2]);
                    const result = power - nums[3];
                    return [
                        `(${nums[0]} × ${nums[1]})^${nums[2]} − ${nums[3]}`,
                        `${format(product)}^${nums[2]} − ${nums[3]}`,
                        `${format(power)} − ${nums[3]}`,
                        format(result)
                    ];
                }
            }
        ];
    }

    generateRandomNumbers() {
        this.numbers = [];
        const usedNums = new Set();
        while (this.numbers.length < 6) {
            const num = Math.floor(Math.random() * 6) + 1;
            if (!usedNums.has(num)) {
                this.numbers.push(num);
                usedNums.add(num);
            }
        }
        this.currentEquation = this.equations[Math.floor(Math.random() * this.equations.length)];
        this.largestValue = this.getLargestPossibleValue();
        this.attempts = [];
        this.reset();
    }

    reset() {
        this.expression = [null, null, null, null];
        this.usedNumbers = [];
        this.result = null;
        this.calculationSteps = [];
        this.isComplete = false;
        this.isCorrect = false;
    }

    canPlaceNumber(number) {
        return !this.usedNumbers.includes(number);
    }

    placeNumber(number, position) {
        if (this.canPlaceNumber(number) && position >= 0 && position < 4) {
            const prevIndex = this.expression.indexOf(number);
            if (prevIndex !== -1) {
                this.expression[prevIndex] = null;
            }
            const existingNumber = this.expression[position];
            if (existingNumber !== null) {
                const usedIndex = this.usedNumbers.indexOf(existingNumber);
                if (usedIndex !== -1) {
                    this.usedNumbers.splice(usedIndex, 1);
                }
            }
            this.expression[position] = number;
            if (!this.usedNumbers.includes(number)) {
                this.usedNumbers.push(number);
            }
            this.checkCompletion();
            return true;
        }
        return false;
    }

    removeNumber(position) {
        if (position >= 0 && position < 4 && this.expression[position] !== null) {
            const number = this.expression[position];
            this.expression[position] = null;
            const usedIndex = this.usedNumbers.indexOf(number);
            if (usedIndex !== -1) {
                this.usedNumbers.splice(usedIndex, 1);
            }
            this.isComplete = false;
            this.isCorrect = false;
            this.result = null;
            this.calculationSteps = [];
        }
    }

    checkCompletion() {
        this.isComplete = this.expression.every(num => num !== null);
        if (this.isComplete) {
            this.calculateResult();
            if (this.result !== 'Error') {
                this.attempts.push({
                    expression: [...this.expression],
                    result: this.result,
                    steps: [...this.calculationSteps]
                });
                this.isCorrect = this.expression.every((num, i) => num === this.bestExpression[i]);
            }
        }
    }

    calculateResult() {
        if (!this.isComplete || !this.currentEquation) return;
        try {
            this.result = this.currentEquation.calculate(this.expression);
            this.calculationSteps = this.currentEquation.steps(this.expression);
        } catch (error) {
            this.result = 'Error';
            this.calculationSteps = ['Calculation error'];
        }
    }

    getAvailableNumbers() {
        return this.numbers.filter(num => !this.usedNumbers.includes(num));
    }

    getLargestPossibleValue() {
        if (this.numbers.length === 0 || !this.currentEquation) return 0;
        let maxValue = -Infinity;
        let bestExpression = [];
        const nums = this.numbers;
        for (let i = 0; i < nums.length; i++) {
            for (let j = 0; j < nums.length; j++) {
                for (let k = 0; k < nums.length; k++) {
                    for (let l = 0; l < nums.length; l++) {
                        if (i !== j && j !== k && k !== l && i !== k && i !== l && j !== l) {
                            try {
                                const value = this.currentEquation.calculate([nums[i], nums[j], nums[k], nums[l]]);
                                if (value > maxValue && isFinite(value)) {
                                    maxValue = value;
                                    bestExpression = [nums[i], nums[j], nums[k], nums[l]];
                                }
                            } catch (error) {}
                        }
                    }
                }
            }
        }
        this.bestExpression = bestExpression;
        return maxValue;
    }

    getCurrentEquationTemplate() {
        return this.currentEquation ? this.currentEquation.template : [];
    }
}

let model;
let numberBoxes = [];
let dropZones = [];
let exponentZones = [];
let isDragging = false;
let draggedValue = null;
let draggedX, draggedY;
let selectedValue = null;
let showAnswerOverlay = false;

function setup() {
    let c = createCanvas(900, 500);
    c.parent('canvas');
    model = new MathExpressionModel();
    model.generateRandomNumbers();
    document.getElementById('reflectOverlay').classList.add('d-none');
    let startOverBtn = select('#startOverBtn');
    startOverBtn.mousePressed(startOver);
    let newQuestionBtn = select('#newQuestionBtn');
    newQuestionBtn.mousePressed(newQuestion);
    let showAnswerBtn = select('#showAnswerBtn');
    showAnswerBtn.mousePressed(showAnswer);
    let reflectBtn = select('#reflectBtn');
    reflectBtn.mousePressed(showReflectOverlay);
    let question1 = select('#question1');
    question1.mousePressed(() => showQuestion(1));
    let question2 = select('#question2');
    question2.mousePressed(() => showQuestion(2));
    let question3 = select('#question3');
    question3.mousePressed(() => showQuestion(3));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeOverlayBtn').addEventListener('click', closeReflectOverlay);
    document.getElementById('showAnswerBtn').addEventListener('click', () => {
        console.log('Show Answer button clicked');
        showAnswer();
    });
});

function draw() {
    background(255);
    textSize(20);
    textAlign(LEFT);
    fill(0);
    stroke(0);
    strokeWeight(0.5);
    text("Build an expression with the largest value.", 30, 30);
    renderNumbers();
    renderExpression();
    if (model.isComplete) {
        renderResult();
    }
    renderAttempts();
    if (isDragging) {
        fill(224, 231, 255);
        stroke(199, 210, 254);
        rect(draggedX - 27.5, draggedY - 27.5, 55, 55, 8);
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(draggedValue, draggedX, draggedY);
    }
    if (model.isComplete && model.isCorrect) {
        fill(0, 128, 0);
        textSize(40);
        textAlign(RIGHT);
        text("Correct! 🎉", width - 30, height - 220);
    }
    if (showAnswerOverlay) {
        console.log('Rendering answer overlay');
        renderAnswerOverlay();
    }
}

function renderNumbers() {
    numberBoxes = [];
    let numWidth = 55;
    let gap = 12;
    let totalWidth = 6 * numWidth + 5 * gap;
    let startX = (width - totalWidth) / 2;
    let y = 70;
    model.numbers.forEach((number, index) => {
        let x = startX + index * (numWidth + gap);
        let isUsed = model.usedNumbers.includes(number);
        numberBoxes.push({x, y, w: numWidth, h: numWidth, value: number, isUsed});
        if (isUsed) {
            fill(240);
            stroke(200);
        } else if (selectedValue === number) {
            fill(199, 210, 254);
            stroke(124, 58, 237);
            strokeWeight(2);
        } else {
            fill(224, 231, 255);
            stroke(199, 210, 254);
        }
        rect(x, y, numWidth, numWidth, 8);
        strokeWeight(1);
        fill(55, 48, 163);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(number, x + numWidth / 2, y + numWidth / 2);
    });
}

// ... existing code ...
// ... existing code ...

function renderExpression() {
    dropZones = [];
    exponentZones = [];
    let template = model.getCurrentEquationTemplate();
    if (!template) return;
    let dropZoneWidth = 70;
    let exponentWidth = 30;
    let exponentHeight = 30;
    let operatorWidth = 30;
    let parenthesesWidth = 20;
    let totalWidth = 0;
    let baseStartX = 0;
    let baseEndX = 0;
    let inBase = false;
    let hasExponent = false;

    // First pass: calculate total width
    template.forEach(item => {
        if (typeof item === 'number') {
            totalWidth += dropZoneWidth;
        } else if (item === '^') {
            totalWidth += operatorWidth;
        } else if (item === '(' || item === ')') {
            totalWidth += parenthesesWidth;
        } else {
            totalWidth += operatorWidth;
        }
    });

    let startX = (width - totalWidth) / 2;
    let y = 180;
    let currentX = startX;
    let dropZoneIndex = 0;

    for (let i = 0; i < template.length; i++) {
        let item = template[i];
        if (typeof item === 'number') {
            let x = currentX;
            let w = dropZoneWidth;
            let h = dropZoneWidth;
            dropZones.push({x, y, w, h, index: dropZoneIndex});
            
            let filled = model.expression[dropZoneIndex] !== null;
            if (filled) {
                fill(224, 231, 255);
                stroke(124, 58, 237);
            } else {
                noFill();
                stroke(168, 85, 247);
                strokeWeight(3);
                drawingContext.setLineDash([5, 5]);
            }
            rect(x, y, w, h, 8);
            
            if (filled) {
                fill(55, 48, 163);
                textSize(20);
                textAlign(CENTER, CENTER);
                text(model.expression[dropZoneIndex], x + w / 2, y + h / 2);
            }
            
            strokeWeight(1);
            drawingContext.setLineDash([]);
            currentX += w;
            
            if (!inBase) {
                baseStartX = x;
                inBase = true;
            }
            baseEndX = x + w;
            dropZoneIndex++;
        } else if (item === '^') {
            hasExponent = true;
            if (i + 1 < template.length && typeof template[i+1] === 'number') {
                // Position exponent at the end of base expression
                let expX = baseEndX - 10;
                let expY = y - 20;
                
                exponentZones.push({
                    x: expX,
                    y: expY,
                    w: exponentWidth,
                    h: exponentHeight,
                    index: dropZoneIndex
                });
                
                let filled = model.expression[dropZoneIndex] !== null;
                if (filled) {
                    fill(224, 231, 255);
                    stroke(124, 58, 237);
                } else {
                    noFill();
                    stroke(168, 85, 247);
                    strokeWeight(3);
                    drawingContext.setLineDash([5, 5]);
                }
                
                rect(expX, expY, exponentWidth, exponentHeight, 6);
                
                if (filled) {
                    fill(55, 48, 163);
                    textSize(16);
                    textAlign(CENTER, CENTER);
                    text(model.expression[dropZoneIndex], expX + exponentWidth/2, expY + exponentHeight/2);
                }
                
                strokeWeight(1);
                drawingContext.setLineDash([]);
                
                i++;
                dropZoneIndex++;
            }
            currentX += operatorWidth;
        } else if (item === '(') {
            fill(55, 65, 81);
            textSize(32);
            textAlign(CENTER, CENTER);
            text('(', currentX + parenthesesWidth/2, y + dropZoneWidth/2);
            currentX += parenthesesWidth;
            inBase = true;
            baseStartX = currentX;
        } else if (item === ')') {
            fill(55, 65, 81);
            textSize(32);
            textAlign(CENTER, CENTER);
            text(')', currentX + parenthesesWidth/2, y + dropZoneWidth/2);
            currentX += parenthesesWidth;
            baseEndX = currentX;
            inBase = false;
        } else {
            fill(55, 65, 81);
            textSize(28);
            textAlign(CENTER, CENTER);
            let symbol = item === '−' ? '−' : item === '×' ? '×' : item;
            text(symbol, currentX + operatorWidth/2, y + dropZoneWidth/2);
            currentX += operatorWidth;
            inBase = false;
            hasExponent = false;
        }
    }
}

function renderResult() {
  // ---------- constants ----------
  const yStart     = 300;        // first row baseline
  const rowGap     = 25;         // vertical distance between rows
  const baseFont   = 20;         // default textSize for bases & operators
  const expFont    = 16;         // textSize for exponents
  const minFont    = 12;         // smallest we will ever down-scale to
  const gap        = 12;         // horizontal gap between tokens
  const margin     = 60;         // keep 30 px padding on each side

  // ---------- early exit ----------
  if (model.calculationSteps.length === 0) return;

  fill(55, 65, 81);
  textAlign(LEFT, CENTER);
  strokeWeight(0.7);

  /* ------------------------------------------------------------------
   * For each row: measure, maybe shrink, then draw token by token
   * ------------------------------------------------------------------ */
  model.calculationSteps.forEach((raw, row) => {

    // 1. split into tokens but keep “base^exp” together
    const tokens = [];
    raw.split(' ').forEach(tok => {
      if (tok.includes('^')) {
        const [b, e] = tok.split('^');
        tokens.push({type: 'base', txt: b});
        tokens.push({type: 'exp',  txt: e});
      } else {
        tokens.push({type: 'base', txt: tok});
      }
    });

    // 2. first pass – measure total width with default sizes
    textSize(baseFont);
    let total = 0;
    tokens.forEach(t => {
      textSize(t.type === 'exp' ? expFont : baseFont);
      total += textWidth(t.txt) + gap;
    });
    total -= gap;                       // remove last gap

    // 3. if too wide, scale both base & exponent fonts proportionally
    const avail = width - margin * 2;
    let scale = 1;
    if (total > avail) {
      scale = Math.max(avail / total, minFont / baseFont);
    }
    const fBase = baseFont * scale;
    const fExp  = expFont  * scale;
    const y     = yStart + row * rowGap;

    // 4. second pass – actually draw everything
    let x = (width - total * scale) / 2;   // centre entire row
    tokens.forEach(t => {
      const sz = t.type === 'exp' ? fExp : fBase;
      textSize(sz);
      const yOffset = t.type === 'exp' ? -0.35 * fBase : 0; // lift superscript
      text(t.txt, x, y + yOffset);
      x += textWidth(t.txt) + gap * scale;
    });
  });

  // ---------- summary line ----------
  textSize(baseFont * 1.25);
  const fmt = n => Number.isInteger(n) ? n : n.toFixed(2);
  textSize(baseFont * 1.25);
  text(`Largest value found = ${fmt(model.result)}`,
       width - margin - textWidth(`Largest value found = ${fmt(model.result)}`), height - margin);
}
// ... existing code ...
function renderAttempts() {
    textAlign(LEFT);
    textSize(16);
    fill(55, 65, 81);
    strokeWeight(0.5);
    let y = 450;
    for (let i = 0; i < model.attempts.length; i++) {
        const attempt = model.attempts[i];
        const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
        const expr = model.currentEquation.display(attempt.expression).replace(/\^/g, '').replace(/−/g, '−').replace(/×/g, '×');
        text(`Attempt ${i + 1}: ${expr} = ${format(attempt.result)}`, 30, y);
        y += 20;
    }
}

/**
 * Draws the “best answer” overlay with proper superscript formatting.
 * All layout (rectangles, overlay sizes, etc.) is untouched – only
 * the text-rendering part is rewritten.
 */
function renderAnswerOverlay() {
  /* ---------- STATIC BACKDROP (unchanged) ---------- */
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);
  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(width / 4, height / 4 - 80, width / 2, height / 2 + 80, 10);

  /* ---------- HELPER ---------- */
  const fmt = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);

  /* ---------- PREPARE STRINGS ---------- */
  const best     = model.bestExpression;                  // e.g. [5,6,4,3]
  const rawEqn   = model.currentEquation.display(best);   // e.g. "5^6 × 4 + 3"
  const clean    = rawEqn.replace(/−/g, '−');             // keep minus sign consistent

  /* ----- 1. SPLIT INTO base | exponent | tail ----- */
  const caret = clean.indexOf('^');
  let baseStr = clean;     // default when no caret
  let expStr  = '';
  let tailStr = '';

  if (caret !== -1) {
    baseStr = clean.slice(0, caret);               // everything before ^
    let i   = caret + 1;

    // Skip leading spaces
    while (i < clean.length && clean[i] === ' ') i++;

    // Capture exponent token
    if (clean[i] === '(') {
      // bracketed exponent: grab until matching ')'
      let depth = 1;
      let j = i + 1;
      while (j < clean.length && depth) {
        if (clean[j] === '(') depth++;
        else if (clean[j] === ')') depth--;
        j++;
      }
      expStr  = clean.slice(i, j);     // "(…)"
      tailStr = clean.slice(j);        // rest of the string
    } else {
      // non-bracketed: read until first space or operator
      const stop = /[ ×+−*/]/;
      let j = i;
      while (j < clean.length && !stop.test(clean[j])) j++;
      expStr  = clean.slice(i, j);     // e.g. "5"
      tailStr = clean.slice(j);        // " × 4 + 2"
    }
  }

  /* ---------- CENTRE WHOLE EXPRESSION ---------- */
  textAlign(CENTER);
  textSize(20);
  fill(55, 65, 81);

  const yMid   = height / 2 - 20;
  const wBase  = textWidth(baseStr);
  const wExp   = expStr ? textWidth(expStr) * 0.8 : 0;  // 80 % size for superscript
  const wTail  = textWidth(tailStr);
  const totalW = wBase + wExp + wTail;

  let x = width / 2 - totalW / 2;       // leftmost anchor

  /* ---------- TITLE LINE ---------- */
  text(`Best combination: [${best.join(', ')}]`, width / 2, height / 2 - 60);

  /* ----------  BASE ---------- */
  text(baseStr, x + wBase / 2, yMid);
  x += wBase;

  /* ----------  SUPERSCRIPT ---------- */
  if (expStr) {
    push();
    textSize(16);                       // smaller font
    textAlign(LEFT, CENTER);
    text(expStr, x, yMid - 7);          // raise 7 px
    pop();
    x += textWidth(expStr) * 0.8;       // advance by reduced width
  }

  /* ----------  TAIL ---------- */
  textAlign(LEFT, CENTER);
  textSize(20);
  text(tailStr, x, yMid);               // remainder at baseline

  /* ---------- FOOTER ---------- */
  textAlign(CENTER);
  text(`Highest value: ${fmt(model.largestValue)}`, width / 2, height / 2 + 20);
  textSize(16);
  text("Click anywhere to close", width / 2, height / 2 + 60);
}


function showAnswer() {
    console.log('Show Answer button clicked');
    showAnswerOverlay = true;
}

function showReflectOverlay() {
    document.getElementById('reflectOverlay').classList.remove('d-none');
    document.getElementById('questionText').innerHTML = '';
}

function closeReflectOverlay() {
    document.getElementById('reflectOverlay').classList.add('d-none');
}

function showQuestion(index) {
    const questions = [
        "Among the operations used, which one has the highest impact on the result?",
        "If you were to maximize the value, where should the largest number go? Why?",
        "Which number is the least useful in this expression? Why might you leave it out?"
    ];
    document.getElementById('questionText').innerHTML = questions[index - 1];
}

function mousePressed() {
    let canvas = select('#canvas').elt;
    let mouseOverCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    if (!mouseOverCanvas || document.getElementById('reflectOverlay').classList.contains('d-none') === false) {
        return;
    }
    if (showAnswerOverlay) {
        console.log('Closing answer overlay');
        showAnswerOverlay = false;
        return;
    }
    let canvasClicked = false;
    for (let box of numberBoxes) {
        if (!box.isUsed && mouseX > box.x && mouseX < box.x + box.w &&
            mouseY > box.y && mouseY < box.y + box.h) {
            selectedValue = box.value;
            canvasClicked = true;
            return;
        }
    }
    for (let zone of dropZones) {
        if (mouseX > zone.x && mouseX < zone.x + zone.w &&
            mouseY > zone.y && mouseY < zone.y + zone.h) {
            if (model.expression[zone.index] !== null) {
                model.removeNumber(zone.index);
                selectedValue = null;
            } else if (selectedValue !== null) {
                model.placeNumber(selectedValue, zone.index);
                selectedValue = null;
            }
            canvasClicked = true;
            return;
        }
    }
    for (let zone of exponentZones) {
        if (mouseX > zone.x && mouseX < zone.x + zone.w &&
            mouseY > zone.y && mouseY < zone.y + zone.h) {
            if (model.expression[zone.index] !== null) {
                model.removeNumber(zone.index);
                selectedValue = null;
            } else if (selectedValue !== null) {
                model.placeNumber(selectedValue, zone.index);
                selectedValue = null;
            }
            canvasClicked = true;
            return;
        }
    }
    if (canvasClicked) {
        selectedValue = null;
    }
}

function mouseDragged() {
    let mouseOverCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    if (!mouseOverCanvas || document.getElementById('reflectOverlay').classList.contains('d-none') === false) {
        return;
    }
    if (!isDragging) {
        for (let box of numberBoxes) {
            if (!box.isUsed && mouseX > box.x && mouseX < box.x + box.w &&
                mouseY > box.y && mouseY < box.y + box.h) {
                isDragging = true;
                draggedValue = box.value;
                draggedX = mouseX;
                draggedY = mouseY;
                selectedValue = null;
                return;
            }
        }
    }
    if (isDragging) {
        draggedX = mouseX;
        draggedY = mouseY;
    }
}

function mouseReleased() {
    let mouseOverCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    if (!mouseOverCanvas || document.getElementById('reflectOverlay').classList.contains('d-none') === false) {
        return;
    }
    if (isDragging) {
        isDragging = false;
        for (let zone of dropZones) {
            if (draggedX > zone.x && draggedX < zone.x + zone.w &&
                draggedY > zone.y && draggedY < zone.y + zone.h) {
                model.placeNumber(draggedValue, zone.index);
                draggedValue = null;
                return;
            }
        }
        for (let zone of exponentZones) {
            if (draggedX > zone.x && draggedX < zone.x + zone.w &&
                draggedY > zone.y && draggedY < zone.y + zone.h) {
                model.placeNumber(draggedValue, zone.index);
                draggedValue = null;
                return;
            }
        }
        draggedValue = null;
    }
}

function touchStarted(event) {
    if (event.cancelable) event.preventDefault();
    mousePressed();
    return false;
}

function touchMoved(event) {
    if (event.cancelable) event.preventDefault();
    mouseDragged();
    return false;
}

function touchEnded(event) {
    if (event.cancelable) event.preventDefault();
    mouseReleased();
    return false;
}

function startOver() {
    model.reset();
    selectedValue = null;
    showAnswerOverlay = false;
}

function newQuestion() {
    model.generateRandomNumbers();
    selectedValue = null;
    showAnswerOverlay = false;
    document.getElementById('reflectOverlay').classList.add('d-none');
}