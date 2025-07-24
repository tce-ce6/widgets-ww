// Power of a Power Interactive Model
let base, innerPower, outerPower;
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

    base = floor(random(2, 10));
    min = floor(random(1, 5));
    max = floor(random(1, 5));
    innerPower = min;
    outerPower = max;

    resetProblem();
    // Change button label and hook up event
    let btn = document.getElementById('newProblemButton');
    btn.textContent = 'NEW NUMBERS';
    btn.onclick = resetProblem;
    // Add event listeners for power buttons
    document.getElementById('innerPlus').onclick = () => { innerPower = constrain(innerPower + 1, minPower, maxPower); redraw(); };
    document.getElementById('innerMinus').onclick = () => { innerPower = constrain(innerPower - 1, minPower, maxPower); redraw(); };
    document.getElementById('outerPlus').onclick = () => { outerPower = constrain(outerPower + 1, minPower, maxPower); redraw(); };
    document.getElementById('outerMinus').onclick = () => { outerPower = constrain(outerPower - 1, minPower, maxPower); redraw(); };
}

function resetProblem() {
    base = floor(random(2, 10));
    min = floor(random(1, 5));
    max = floor(random(1, 5));
    innerPower = min;
    outerPower = max;
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
    drawExponent(cx, y1, base, innerPower, outerPower);

    // Expanded multiplication
    textSize(28);
    let expStr1 = '(' + Array(innerPower).fill(base).join(' · ') + ')';
    let expStr2 = '(' + Array(outerPower).fill(base).join(' · ') + ')';

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
    text(expStr1, startX + exp1Width / 2, y2);
    text('.', startX + exp1Width + dotWidth / 2, y2);
    text(expStr2, startX + exp1Width + dotWidth + exp2Width / 2, y2);

    // base^{inner*outer}
    let combinedExp = `${base}`;
    let exp1 = `${innerPower} + ${outerPower}`;
    drawSuperscript(combinedExp, '', cx, y3, 32, 0, 0, 0);
    // drawSuperscript('', exp1, cx + 30, y3 - 10, 24, 255, 20, 147);
    drawSuperscript('', innerPower, cx + 20, y3 - 10, 24, 0, 0, 255);
    push();
    stroke(0);
    strokeWeight(0.1)
    drawSuperscript('', '+', cx + 30, y3 - 10, 24, 0, 0, 0);
    pop();
    drawSuperscript('', outerPower, cx + 40, y3 - 10, 24, 255, 20, 147);



    // base^{inner*outer} simplified
    let totalExp = innerPower + outerPower;
    drawSuperscript(`${base}`, '', cx, y4, 32, 0, 0, 0);
    drawSuperscript('', `${totalExp}`, cx + 20, y4 - 10, 24, 0, 0, 0);

    // Final value
    textSize(36);
    fill(30);
    noStroke();
    // Convert number to string with commas
    let number = Math.pow(base, totalExp);
    let formattedNumber = number.toLocaleString();

    text(formattedNumber, cx, y5);

    //text(nf(pow(base, totalExp), 1, 0), cx, y5);
}

function drawExponent(x, y, base, inner, outer) {
    // Draw (base^inner)^outer with superscripts
    let baseStr = `${base}`;
    let innerStr = `${inner}`;
    let outerStr = `${outer}`;
    // Draw (base^inner)
    let mainStr = `${baseStr}`;
    fill(0);
    noStroke();
    let tw = textWidth(mainStr);
    textSize(36);
    // text('(', x - 30, y);

    text(mainStr, x - 30, y);
    text('.', x, y);
    text(mainStr, x + 30, y);

    // Draw )
    textSize(36);
    // text(')', x + 35, y);
    // Superscript inner
    drawSuperscript('', innerStr, x + tw / 2 - 20, y - 15, 24, 0, 0, 255);

    // Superscript outer
    drawSuperscript('', outerStr, x + 50, y - 15, 24, 255, 20, 147);
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