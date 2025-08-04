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
                `= ${format(sum)} × ${format(power)}`,
                `= ${format(result)}`
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
                `= ${format(power)} + ${format(product)}`,
                `= ${format(result)}`
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
                `= ${format(product)} + ${format(power)}`,
                `= ${format(result)}`
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
                `= ${format(product)}^${nums[2]} + ${nums[3]}`,
                `= ${format(power)} + ${nums[3]}`,
                `= ${format(result)}`
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
                `= ${format(power)} × ${nums[2]} + ${nums[3]}`,
                `= ${format(product)} + ${nums[3]}`,
                `= ${format(result)}`
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
                `= ${nums[0]} + ${format(power)} × ${nums[3]}`,
                `= ${nums[0]} + ${format(product)}`,
                `= ${format(result)}`
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
                `= ${format(diff)} × ${format(power)}`,
                `= ${format(result)}`
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
                `= ${format(power)} − ${format(product)}`,
                `= ${format(result)}`
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
                `= ${format(product)} − ${format(power)}`,
                `= ${format(result)}`
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
                `= ${format(product)}^${nums[2]} − ${nums[3]}`,
                `= ${format(power)} − ${nums[3]}`,
                `= ${format(result)}`
            ];
        }
    }
]
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
                this.isCorrect = (this.result === this.largestValue);
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
let showReflectOverlayState = false;
let currentQuestion = 0;

function setup() {
    let c = createCanvas(900, 500);
    c.parent('canvas');
    model = new MathExpressionModel();
    model.generateRandomNumbers();
    let startOverBtn = select('#startOverBtn');
    startOverBtn.mousePressed(startOver);
    let newQuestionBtn = select('#newQuestionBtn');
    newQuestionBtn.mousePressed(newQuestion);
    let showAnswerBtn = select('#showAnswerBtn');
    showAnswerBtn.mousePressed(showAnswer);
    let reflectBtn = select('#reflectBtn');
    reflectBtn.mousePressed(showReflectOverlay);
}

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
        // Heartbeat animation - oscillates between 40 and 50 pixels
        let heartbeatSize = 40 + 1 * sin(millis() * 0.01);
        textSize(heartbeatSize);
        textAlign(RIGHT);
        text("Correct! 🎉", width - 30, height - 220);
        document.getElementById('startOverBtn').disabled = true;
    }
    if (showAnswerOverlay) {
        renderAnswerOverlay();
    }
    if (showReflectOverlayState) {
        renderReflectOverlay();
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
    const yStart = 300;
    const rowGap = 25;
    const baseFont = 20;
    const expFont = 16;
    const minFont = 12;
    const gap = 12;
    const margin = 60;

    if (model.calculationSteps.length === 0) return;

    fill(55, 65, 81);
    textAlign(LEFT, CENTER);
    strokeWeight(0.7);

    model.calculationSteps.forEach((raw, row) => {
        const tokens = [];
        raw.split(' ').forEach(tok => {
            if (tok.includes('^')) {
                const [b, e] = tok.split('^');
                tokens.push({type: 'base', txt: b});
                tokens.push({type: 'exp', txt: e});
            } else {
                tokens.push({type: 'base', txt: tok});
            }
        });

        textSize(baseFont);
        let total = 0;
        tokens.forEach(t => {
            textSize(t.type === 'exp' ? expFont : baseFont);
            total += textWidth(t.txt) + gap;
        });
        total -= gap;

        const avail = width - margin * 2;
        let scale = 1;
        if (total > avail) {
            scale = Math.max(avail / total, minFont / baseFont);
        }
        const fBase = baseFont * scale;
        const fExp = expFont * scale;
        const y = yStart + row * rowGap;

        let x = (width - total * scale) / 2;
        x = 392
        tokens.forEach(t => {
            const sz = t.type === 'exp' ? fExp : fBase;
            textSize(sz);
            const yOffset = t.type === 'exp' ? -0.35 * fBase : 0;
            text(t.txt, x , y + yOffset);
            x += textWidth(t.txt) + gap * scale;
        });
    });

    textSize(baseFont * 1.25);
    const fmt = n => Number.isInteger(n) ? n : n.toFixed(2);
    text(`Largest value found = ${fmt(model.result)}`, width - margin - textWidth(`Largest value found = ${fmt(model.result)}`), height - margin);
}

// Replace the existing renderAttempts function with this updated version
function renderAttempts() {
    textAlign(LEFT);
    textSize(16);
    fill(55, 65, 81);
    strokeWeight(0.5);
    let y = 450;
    for (let i = 0; i < model.attempts.length; i++) {
        const attempt = model.attempts[i];
        const format = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
        const expr = model.currentEquation.display(attempt.expression);
        const result = format(attempt.result);
        
        // Draw prefix
        let prefix = `Attempt ${i + 1}: `;
        text(prefix, 30, y);
        let x = 30 + textWidth(prefix);
        
        // Tokenize the expression to handle exponents properly
        let tokens = [];
        let current = '';
        let inExponent = false;
        
        // Parse the expression to identify base and exponent parts
        for (let char of expr) {
            if (char === '^') {
                if (current) tokens.push({type: 'base', text: current});
                tokens.push({type: 'caret'});
                current = '';
                inExponent = true;
            } else if (inExponent && (char === ' ' || char === '+' || char === '−' || char === '×')) {
                if (current) tokens.push({type: 'exp', text: current});
                tokens.push({type: 'base', text: char});
                current = '';
                inExponent = false;
            } else if (!inExponent && (char === '(' || char === ')')) {
                if (current) tokens.push({type: 'base', text: current});
                tokens.push({type: 'paren', text: char});
                current = '';
            } else {
                current += char;
            }
        }
        
        // Push any remaining text
        if (current) {
            tokens.push({type: inExponent ? 'exp' : 'base', text: current});
        }

        // Draw each token with proper formatting
        tokens.forEach(token => {
            if (token.type === 'base' || token.type === 'paren') {
                text(token.text, x, y);
                x += textWidth(token.text);
            } else if (token.type === 'caret') {
                // Skip drawing the caret (we'll use superscript instead)
            } else if (token.type === 'exp') {
                push();
                textSize(12);
                text(token.text, x, y - 5);
                x += textWidth(token.text);
                pop();
            }
        });
        
        // Draw result
        text(` = ${result}`, x, y);
        y += 20;
    }
}


function renderAnswerOverlay() {
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    fill(255);
    stroke(0);
    strokeWeight(1);
    rect(width / 4, height / 4 - 80, width / 2, height / 2 + 80, 10);

    const fmt = n => Number.isInteger(n) ? n.toString() : n.toFixed(2);
    const best = model.bestExpression;
    const rawEqn = model.currentEquation.display(best);
    const clean = rawEqn.replace(/−/g, '−');

    const caret = clean.indexOf('^');
    let baseStr = clean;
    let expStr = '';
    let tailStr = '';

    if (caret !== -1) {
        baseStr = clean.slice(0, caret);
        let i = caret + 1;
        while (i < clean.length && clean[i] === ' ') i++;
        if (clean[i] === '(') {
            let depth = 1;
            let j = i + 1;
            while (j < clean.length && depth) {
                if (clean[j] === '(') depth++;
                else if (clean[j] === ')') depth--;
                j++;
            }
            expStr = clean.slice(i, j);
            tailStr = clean.slice(j);
        } else {
            const stop = /[ ×+−*/]/;
            let j = i;
            while (j < clean.length && !stop.test(clean[j])) j++;
            expStr = clean.slice(i, j);
            tailStr = clean.slice(j);
        }
    }

    textAlign(CENTER);
    textSize(20);
    fill(55, 65, 81);

    const yMid = height / 2 - 20;
    const wBase = textWidth(baseStr);
    const wExp = expStr ? textWidth(expStr) * 0.8 : 0;
    const wTail = textWidth(tailStr);
    const totalW = wBase + wExp + wTail;

    let x = width / 2 - totalW / 2;

    text(`Best combination: [${best.join(', ')}]`, width / 2, height / 2 - 60);

    text(baseStr, x + wBase / 2, yMid);
    x += wBase;

    if (expStr) {
        push();
        textSize(16);
        textAlign(LEFT, CENTER);
        text(expStr, x, yMid - 7);
        pop();
        x += textWidth(expStr) * 0.8;
    }

    textAlign(LEFT, CENTER);
    textSize(20);
    text(tailStr, x, yMid);

    textAlign(CENTER);
    text(`Highest value: ${fmt(model.largestValue)}`, width / 2, height / 2 + 20);
    textSize(16);
    text("Click anywhere to close", width / 2, height / 2 + 60);
}

function renderReflectOverlay() {
 fill(255, 255, 255, 0);
    rect(0, 0, width, height);
    fill(253, 241, 218, 240);
    stroke(124, 58, 237);
    strokeWeight(2);
    rect(width / 6 + 370, height / 6 - 80, width / 2 - 80  , height / 2 -80 , 10);

    const boxX = width /  6 + 350;
    const boxY = height / 4 - 100;
    const boxW = width / 2 - 20;
    const boxH = height / 2 + 70;

    textAlign(CENTER);
    fill(55, 65, 81);
    textSize(18);
    stroke(0);
    strokeWeight(0.5);

    text("Reflect on Your Strategy", width / 7 + 580, height / 6 - 50);

    const questions = [
        "Among the operations used, which one has the highest impact on the result?",
        "If you were to maximize the value, where should the largest number go? Why?",
        "Which number is the least useful in this expression? Why might you leave it out?"
    ];

    if (currentQuestion > 0) {
        textSize(16);
    strokeWeight(0.5);

        text(questions[currentQuestion - 1], boxX + 30, boxY -40, boxW -70, boxH);
        // text(questions[currentQuestion - 1], width / 2, height / 2 - 20);
    } else {
        textSize(16);
    strokeWeight(0.5);

        text("Click on a number to see the reflection question.", boxX, boxY-40, boxW, boxH);
        // text("Click on a number to see the reflection question.", width / 2, height / 2 - 20);
    }

    const buttonWidth = 40;
    const buttonHeight = 40;
    const gap = 20;
    const totalWidth = 3 * buttonWidth + 2 * gap;
    const startX = (width - totalWidth) / 2 + 260;
    const y = height / 2 - 200;

    for (let i = 1; i <= 3; i++) {
        let x = startX + (i - 1) * (buttonWidth + gap);
        fill(224, 231, 255);
        stroke(124, 58, 237);
        rect(x, y, buttonWidth, buttonHeight, 8);
        fill(55, 48, 163);
        textSize(20);
        text(i, x + buttonWidth / 2, y + buttonHeight / 2);
    }

    textSize(16);
    text("Click anywhere to close", width / 2 + 250, height / 2 - 140);
}

function showAnswer() {
    showAnswerOverlay = true;
    showReflectOverlayState = false;
    currentQuestion = 0;
}

function showReflectOverlay() {
    showReflectOverlayState = true;
    showAnswerOverlay = false;
    currentQuestion = 0;
}

function showQuestion(index) {
    currentQuestion = index;
}

function mousePressed() {
    let canvas = select('#canvas').elt;
    let mouseOverCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    if (!mouseOverCanvas) return;

     if (showAnswerOverlay || showReflectOverlayState) {
        const buttonWidth = 40;
        const buttonHeight = 40;
        const gap = 20;
        const totalWidth = 3 * buttonWidth + 2 * gap;
        
        // Match the positions used in renderReflectOverlay:
        const startX = (width - totalWidth) / 2 + 260; // Same as renderReflectOverlay
        const y = height / 2 - 200; // Same as renderReflectOverlay

        if (showReflectOverlayState) {
            for (let i = 1; i <= 3; i++) {
                let x = startX + (i - 1) * (buttonWidth + gap);
                if (mouseX > x && mouseX < x + buttonWidth && 
                    mouseY > y && mouseY < y + buttonHeight) {
                    showQuestion(i);
                    return;
                }
            }
        }

        showAnswerOverlay = false;
        showReflectOverlayState = false;
        currentQuestion = 0;
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

function touchStarted(event) {
    if (event.cancelable) event.preventDefault();
    
    // Use the same coordinates as mousePressed
    const touchX = event.touches[0].clientX - canvas.offsetLeft;
    const touchY = event.touches[0].clientY - canvas.offsetTop;
    
    // Check reflection buttons
    if (showReflectOverlayState) {
        const buttonWidth = 40;
        const buttonHeight = 40;
        const gap = 20;
        const totalWidth = 3 * buttonWidth + 2 * gap;
        const startX = (width - totalWidth) / 2 + 260;
        const y = height / 2 - 200;

        for (let i = 1; i <= 3; i++) {
            let x = startX + (i - 1) * (buttonWidth + gap);
            console.log("🚀 ~ renderResult ~ x:", x)
            if (touchX > x && touchX < x + buttonWidth && 
                touchY > y && touchY < y + buttonHeight) {
                showQuestion(i);
                return false;
            }
        }
    }
    
    // Call mousePressed for other interactions
    mousePressed();
    return false;
}

function mouseDragged() {
    let mouseOverCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    if (!mouseOverCanvas) return;

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
    if (!mouseOverCanvas) return;

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
    showReflectOverlayState = false;
    currentQuestion = 0;
}

function newQuestion() {
    document.getElementById('startOverBtn').disabled = false;

    model.generateRandomNumbers();
    selectedValue = null;
    showAnswerOverlay = false;
    showReflectOverlayState = false;
    currentQuestion = 0;
}