// Power of a Power Interactive Model
let base1, base2, innerPower, outerPower;
let minPower = 1, maxPower = 5;
let min, max;
let draggingInner = false, draggingOuter = false;
let innerPos, outerPos;
//let innerDefault = 2, outerDefault = 3;
let canvasW = 1200, canvasH = 600;

function setup() {
    let cnv = createCanvas(canvasW, canvasH);
    cnv.parent('mainCanvas');
    textFont('Arial');

    base1 = floor(random(2, 10));
    base2 = floor(random(2, 10));
    min = floor(random(1, 6));
    max = min;
    innerPower = min;
    outerPower = innerPower;

    resetProblem();
    // Change button label and hook up event
    let btn = document.getElementById('newProblemButton');
    btn.textContent = 'NEW NUMBERS';
    btn.onclick = resetProblem;
    // Add event listeners for power buttons
    document.getElementById('innerPlus').onclick = () => { innerPower = constrain(innerPower + 1, minPower, maxPower); redraw(); };
    document.getElementById('innerMinus').onclick = () => { innerPower = constrain(innerPower - 1, minPower, maxPower); redraw(); };
    // document.getElementById('outerPlus').onclick = () => { outerPower = constrain(outerPower + 1, minPower, maxPower); redraw(); };
    // document.getElementById('outerMinus').onclick = () => { outerPower = constrain(outerPower - 1, minPower, maxPower); redraw(); };
}

function resetProblem() {
    base1 = floor(random(2, 10));
    base2 = floor(random(2, 10));
    min = floor(random(1, 6));
    max = min
    innerPower = min;
    outerPower = innerPower;
    redraw();
}

function draw() {
    background(255);
    drawModel();
}

function drawModel() {
    // Layout positions
    let cx = width / 2;
    let y0 = 80, yStep = 70;
    let y1 = y0, y2 = y1 + yStep, y3 = y2 + yStep, y4 = y3 + yStep, y5 = y4 + yStep;

    // (base^inner)^outer
    textAlign(CENTER, CENTER);
    drawExponent(cx, y1, base1, base2, innerPower, innerPower);

    // Expanded multiplication
    textSize(28);
    let expStr1 = '(' + Array(innerPower).fill(base1).join(' · ') + ')';
    let expStr2 = '(' + Array(innerPower).fill(base2).join(' · ') + ')';

    let group = `(${base1} · ${base2})`;
    let innerGroup = Array(innerPower).fill(group).join('  ');

    // let expFull = Array(outerPower).fill(expStr).join(' · ');
    fill(0);
    noStroke();
    // text(expFull, cx, y2);

    // text(expStr1, cx - 40, y2);
    // text('.', cx, y2);
    // text(expStr2, cx + 40, y2);


    let exp1Width = textWidth(expStr1);
    let exp2Width = textWidth(expStr2);
    let dotWidth = textWidth('.');

    // Total width to center all elements
    let totalWidth = exp1Width + dotWidth + exp2Width;

    // Starting x-position so that entire string is centered
    let startX = cx - totalWidth / 2;

    // Draw elements with spacing
    push();
    fill(0, 0, 255);
    textSize(28);
    text(expStr1, startX + exp1Width / 2 - 5, y2);
    pop();
    text('.', startX + exp1Width + dotWidth / 2, y2);
    push();
    fill(255, 20, 147);
    textSize(28);
    text(expStr2, startX + exp1Width + dotWidth + exp2Width / 2 + 5, y2);
    pop();
    text(innerGroup, cx, y3);

    text(group, cx - 5, y3 + 80);


    // Final value
    textSize(36);
    fill(30);
    noStroke();
    // Convert number to string with commas
    let multiple = base1 * base2;
    let number = Math.pow(multiple, innerPower);
    let formattedNumber = number.toLocaleString();
    text(formattedNumber, cx, y3 + 150);

}

function drawExponent(x, y, base1, base2, inner, outer) {
    // Draw (base^inner)^outer with superscripts
    let baseStr1 = `${base1}`;
    let baseStr2 = `${base2}`;
    let innerStr = `${inner}`;
    let outerStr = `${outer}`;
    // Draw (base^inner)
    let mainStr1 = `${baseStr1}`;
    let mainStr2 = `${baseStr2}`;

    fill(0);
    noStroke();
    let tw = textWidth(mainStr1);
    textSize(36);
    // text('(', x - 30, y);

    push();
    fill(0, 0, 255);
    stroke(0, 0, 255);
    strokeWeight(1);
    textSize(28);
    text(mainStr1, x - 30, y);
    pop();

    text('.', x, y);

    push();
    fill(255, 20, 147);
    stroke(255, 20, 147);
    strokeWeight(1);
    textSize(28);
    text(mainStr2, x + 30, y);
    pop();
    // Draw )
    textSize(36);
    // text(')', x + 35, y);
    // Superscript inner
    drawSuperscript('', innerStr, x + tw / 2 - 20, y - 15, 24, 0, 0, 255);

    // Superscript outer
    drawSuperscript('', outerStr, x + 50, y - 15, 24, 255, 20, 147);

    drawSuperscript('', outerStr, x + 40, y + 210, 24, 0, 0, 0);

}

function drawSuperscript(baseStr, superStr, x, y, baseSize, r, g, b) {
    textSize(baseSize);
    fill(r, g, b);
    stroke(r, g, b);
    textAlign(CENTER, CENTER);
    text(baseStr, x, y);
    textSize(baseSize * 0.6);
    text(superStr, x + textWidth(baseStr) / 2, y - baseSize * 0.2);
}

// p5.js will automatically call setup() and draw()