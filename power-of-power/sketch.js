// Power of a Power Interactive Model
let base, innerPower, outerPower;
let minPower = 1, maxPower = 5;
let draggingInner = false, draggingOuter = false;
let innerPos, outerPos;
let innerDefault = 2, outerDefault = 3;
let canvasW = 1200, canvasH = 600;

function setup() {
    let cnv = createCanvas(canvasW, canvasH);
    cnv.parent('mainCanvas');
    textFont('Arial');
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
    innerPower = innerDefault;
    outerPower = outerDefault;
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
    let expStr = '(' + Array(innerPower).fill(base).join(' · ') + ')';
    let expFull = Array(outerPower).fill(expStr).join(' · ');
    fill(0);
    noStroke();
    text(expFull, cx, y2);

    // base^{inner*outer}
    let combinedExp = `${base}`;
    let exp1 = `${innerPower} × ${outerPower}`;
    drawSuperscript(combinedExp, '', cx, y3, 32, 0, 0, 0);
   // drawSuperscript('', exp1, cx + 30, y3 - 10, 24, 255, 20, 147);
    drawSuperscript('', innerPower, cx + 20, y3 - 10, 24, 0, 0, 255);
    push();
    stroke(0);
    strokeWeight(0.1)
    drawSuperscript('', 'x', cx + 30, y3 - 10, 24, 0, 0, 0);
    pop();
    drawSuperscript('', outerPower, cx + 40, y3 - 10, 24, 255, 20, 147);



    // base^{inner*outer} simplified
    let totalExp = innerPower * outerPower;
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
    text('(', x - 30, y);

    text(mainStr, x, y);
    // Draw )
    textSize(36);
    text(')', x + 35, y);
    // Superscript inner
    drawSuperscript('', innerStr, x + tw / 2 + 10, y - 10, 24, 0, 0, 255);

    // Superscript outer
    drawSuperscript('', outerStr, x + 40, y - 18, 24, 255, 20, 147);
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