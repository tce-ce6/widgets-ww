// Comparing Decimals Visualization (Step-by-step, image-accurate)
// Steps: 0 - ones, 1 - tenths, 2 - hundredths, 3 - thousandths, 4 - result

let decimal1, decimal2;
let step = -1;
const maxStep = 4;
let placeLabels = ["ones", "tenths", "hundredths", "thousandths"];
let digits1 = [], digits2 = [];
let decLen = 3; // Always show up to thousandths for alignment
let intLen = 1; // Only ones place for integer part

function setup() {
    const container = document.getElementById('canvas-container');
    let w = container.offsetWidth || 600;
    let h = 420;
    let cnv = createCanvas(w, h);
    cnv.parent('canvas-container');
    textFont('Roboto');
    generateNewNumbers();
    setupControls();
    noLoop();
}

function windowResized() {
    const container = document.getElementById('canvas-container');
    resizeCanvas(container.offsetWidth || 600, 420);
    redraw();
}

function setupControls() {
    document.querySelector('.new-numbers-btn').onclick = () => {
        generateNewNumbers();
        step = -1;
        redraw();
    };
    document.querySelector('.prev-btn').onclick = () => {
        if (step > 0) step--;
        redraw();
    };
    document.querySelector('.next-btn').onclick = () => {
        if (step < maxStep) step++;
        redraw();
    };
}

function generateNewNumbers() {
    // Generate two random decimals from 0.001 to 9.000
    let d1 = randomDecimal();
    let d2 = randomDecimal();
    while (d1 === d2) d2 = randomDecimal();
    decimal1 = d1;
    decimal2 = d2;
    digits1 = getDigits(decimal1);
    digits2 = getDigits(decimal2);
    step = -1;
}

function randomDecimal() {
    // 0.001 to 9.000, always 3 decimal places
    let n = floor(random(1, 2001)); // 1 to 9000 inclusive
    let str = nf(n / 1000, 1, 3);
    return str;
}

function getDigits(num) {
    // Returns [ones, '.', tenths, hundredths, thousandths]
    let parts = num.split('.');
    let dec = (parts[1] || '').padEnd(decLen, '0');
    return [parts[0], '.', ...dec.split('')];
}

function draw() {
    background(255);
    drawPrompt();
    drawNumbersColumns();
    drawStepUI();
}

function drawPrompt() {
    fill(30);
    textSize(32);
    textAlign(LEFT, TOP);
    text(`Compare the numbers ${decimal1} and ${decimal2}.`, 350, 10);
}

function drawNumbersColumns() {
    // Draw both numbers in columns, each digit in a box, aligned
    let startX = width / 2 - 110, startY = 180;
    let colW = 44, rowH = 60;
    // Draw first number (top)
    for (let i = 0; i < digits1.length; i++) {
        let x = startX + i * colW;
        let y = startY;
        drawDigitBlock1(digits1, i, x, y, step === iToStep(i));
    }
    // Draw second number (bottom)
    for (let i = 0; i < digits2.length; i++) {
        let x = startX + i * colW;
        let y = startY + rowH;
        drawDigitBlock2(digits2, i, x, y, step === iToStep(i));
    }
}

function drawDigitBlock1(digits, i, x, y, highlight) {
    // i: 0=ones, 1=dot, 2=tenths, 3=hundredths, 4=thousandths
    let digit = digits[i];
    let isDec = i > 1;
    let blockColor = isDec ? '#6fcf97' : '#7ec8e3';
    let blockAlpha = 255;
    let borderColor = highlight ? color('#d72660') : color(0, 0, 0, 0);
    let borderWeight = highlight ? 3 : 1;
    // Draw block (except for dot)
    if (i !== 1) {
        push();
        stroke(borderColor);
        strokeWeight(borderWeight);
        fill(blockColor + hex(floor(blockAlpha), 2));
        rect(x - 18, y - 10, 36, 48, 6);
        pop();
    }
    // Draw digit
    fill(highlight ? '#d72660' : '#222');
    textSize(32);
    textAlign(CENTER, CENTER);
    text(digit, x, y + 14);
    // Draw sub-blocks for tenths/hundredths/thousandths
    if (i > 1) {
        let n = int(digit);
        let subH = 10;
        let subW = 24;
        let subY = y - 20;
        for (let j = 0; j < n; j++) {
            push();
            fill('#319c7a');
            stroke(0);
            rect(x - 12, subY - j * subH - 1, subW, subH - 1, 2);
            pop();
        }
        // If digit is 0, draw faint block
        if (n === 0) {
            fill('#b8eec7');
            rect(x - 12, subY, subW, subH - 1, 2);
        }
    }
}

function drawDigitBlock2(digits, i, x, y, highlight) {
    // i: 0=ones, 1=dot, 2=tenths, 3=hundredths, 4=thousandths
    let digit = digits[i];
    let isDec = i > 1;
    let blockColor = isDec ? '#6fcf97' : '#7ec8e3';
    let blockAlpha = 255;
    let borderColor = highlight ? color('#d72660') : color(0, 0, 0, 0);
    let borderWeight = highlight ? 3 : 1;
    // Draw block (except for dot)
    if (i !== 1) {
        push();
        stroke(borderColor);
        strokeWeight(borderWeight);
        fill(blockColor + hex(floor(blockAlpha), 2));
        rect(x - 18, y - 10, 36, 48, 6);
        pop();
    }
    // Draw digit
    fill(highlight ? '#d72660' : '#222');
    textSize(32);
    textAlign(CENTER, CENTER);
    text(digit, x, y + 14);
    // Draw sub-blocks for tenths/hundredths/thousandths
    if (i > 1) {
        let n = int(digit);
        let subH = 10;
        let subW = 24;
        let subY = y + 40;
        for (let j = 0; j < n; j++) {
            push();
            fill('#319c7a');
            stroke(0);
            rect(x - 12, subY + j * subH, subW, subH - 1, 2);
            pop();
        }
        // If digit is 0, draw faint block
        if (n === 0) {
            fill('#b8eec7');
            rect(x - 12, subY, subW, subH - 1, 2);
        }
    }
}

function drawStepUI() {
    let startX = width / 2 - 110, startY = 180, colW = 44, rowH = 60;
    // Step 0-3: highlight current column, show digit comparison
    if (step != -1 && step < 4) {
        console.log(step)
        let i = stepToI(step);
        // Highlight column
        let x = startX + i * colW;
        let y = startY;
        fill(247, 183, 183, 60);
        noStroke();
        rect(x - 24, y - 24, 48, rowH * 2 + 36, 10);
        // Draw digits in pink in this column
        fill('#d72660');
        textSize(32);
        textAlign(CENTER, CENTER);
        text(digits1[i], x, y + 14);
        text(digits2[i], x, y + rowH + 14);
        // Draw comparison on right
        let d1 = digits1[i], d2 = digits2[i];
        fill('#d72660');
        textSize(40);
        textAlign(LEFT, CENTER);
        let cmp = d1 === d2 ? '=' : (d1 < d2 ? '<' : '>');
        text(`${d1} ${cmp} ${d2}`, width / 2 + 140, startY + rowH);
        // Only show navigation arrows
        showNavArrows(true);
        // showNewNumbers(false);
    } else if (step == maxStep) {
        // Final step: show full comparison and explanation
        let diffStep = getFirstDifferentStep();
        let i = stepToI(diffStep);
        let d1 = digits1[i], d2 = digits2[i];
        let cmp = d1 < d2 ? '<' : '>';
        // Highlight column
        let x = startX + i * colW;
        let y = startY;
        fill(247, 183, 183, 60);
        noStroke();
        rect(x - 24, y - 24, 48, rowH * 2 + 36, 10);
        // Draw digits in pink in this column
        fill('#d72660');
        textSize(32);
        textAlign(CENTER, CENTER);
        text(digits1[i], x, y + 14);
        text(digits2[i], x, y + rowH + 14);
        // Show digit comparison and number comparison
        fill('#d72660');
        textSize(36);
        textAlign(LEFT, CENTER);
        text(`${d1} ${cmp} ${d2}`, width / 2 + 120, startY + rowH - 20);
        // Show numbers with differing digit in pink
        let n1 = colorNumber(decimal1, diffStep - 1);
        let n2 = colorNumber(decimal2, diffStep - 1);
        textSize(32);
        fill(30);
        textAlign(LEFT, CENTER);
        text(n1 + ' ' + cmp + ' ' + n2, width / 2 + 120, startY + rowH * 2 - 20);
        // Explanation
        push();
        fill('#d72660');
        stroke('#d72660');
        strokeWeight(2);
        textSize(32);
        textAlign(LEFT, TOP);
        text(`The digits differ in the ${placeLabels[diffStep]} place.`, 450, startY + rowH * 2 + 80);
        pop();
        // Only show New Numbers button
        // showNavArrows(false);
        // showNewNumbers(true);
    }
}

function iToStep(i) {
    // i: 0=ones, 2=tenths, 3=hundredths, 4=thousandths
    if (i === 0) return 0;
    if (i === 2) return 1;
    if (i === 3) return 2;
    if (i === 4) return 3;
    return -1;
}
function stepToI(step) {
    // step: 0=ones, 1=tenths, 2=hundredths, 3=thousandths
    if (step === 0) return 0;
    if (step === 1) return 2;
    if (step === 2) return 3;
    if (step === 3) return 4;
    return -1;
}
function getFirstDifferentStep() {
    // Returns the step where digits differ
    let idxs = [0, 2, 3, 4];
    for (let s = 0; s < idxs.length; s++) {
        if (digits1[idxs[s]] !== digits2[idxs[s]]) return s;
    }
    return 3; // fallback to thousandths
}
function colorNumber(num, diffIdx) {
    // Returns a string with the differing digit in pink (for display)
    let parts = num.split('.');
    let intPart = parts[0];
    let decPart = (parts[1] || '').padEnd(3, '0');
    let arr = [intPart, '.', ...decPart.split('')];
    let idxs = [0, 2, 3, 4];
    let s = '';
    for (let i = 0; i < arr.length; i++) {
        if (i === idxs[diffIdx]) {
            s += `%c${arr[i]}`;
        } else {
            s += arr[i];
        }
    }
    return s.replace(/%c/g, ''); // p5 text() can't style substrings, so just return plain
}
function showNavArrows(show) {
    document.querySelector('.prev-btn').style.display = show ? '' : 'none';
    document.querySelector('.next-btn').style.display = show ? '' : 'none';
}
// function showNewNumbers(show) {
//     document.querySelector('.new-numbers-btn').style.display = show ? '' : 'none';
// } 