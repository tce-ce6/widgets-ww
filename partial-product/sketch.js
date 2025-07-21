let num1, num2, num1Parts, num1Labels, partials, result;
let step = 0, maxStep = 0;

function setup() {
    let canvas = createCanvas(900, 400);
    canvas.parent("mainCanvas");
    document.getElementById("prevStep").onclick = () => { if (step > 0) { step--; redraw(); }};
    document.getElementById("nextStep").onclick = () => { if (step < maxStep) { step++; redraw(); }};
    document.getElementById("newProblemButton").onclick = () => { newProblem(); };
    textFont('system-ui');
    newProblem();
    noLoop();
}

function newProblem() {
    // Generate a random 2- to 4-digit number for num1
    let digits = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 digits
    let min = Math.pow(10, digits - 1);
    let max = Math.pow(10, digits) - 1;
    num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    // Generate a random 1- or 2-digit number for num2
    num2 = Math.floor(Math.random() * 90) + 10;
    if (Math.random() < 0.5) num2 = Math.floor(Math.random() * 9) + 2; // 2-9 sometimes

    // Split num1 into place values
    num1Parts = [];
    let num1Str = String(num1);
    for (let i = 0; i < num1Str.length; i++) {
        let digit = parseInt(num1Str[i]);
        let place = Math.pow(10, num1Str.length - i - 1);
        num1Parts.push(digit * place);
    }
    num1Labels = num1Parts.map(String);
    partials = num1Parts.map(p => p * num2);
    result = partials.reduce((a, b) => a + b, 0);
    step = 0;
    maxStep = num1Parts.length + 1;
    redraw();
}

function draw() {
    background(255);
    // Left: vertical multiplication
    drawLeft();

    // Right: area model
    drawAreaModel();

    // Steps
    drawSteps();
}

function drawLeft() {
    push();
    fill(30);
    textAlign(RIGHT, TOP);
    textSize(28);
    text(num1, 120, 60);
    text('×', 80, 100);
    text(num2, 120, 100);
    stroke(30);
    strokeWeight(2);
    line(50, 135, 160, 135);
    pop();

    // Steps
    textAlign(LEFT, TOP);
    textSize(22);
    let y = 160;
    let x = 205;
    let r = 220;
    for (let i = 0; i < num1Parts.length; i++) {
        if (step === 0) break;
        let highlight = (step - 1 === i);
        if (highlight) {
            push();
            stroke(220, 80, 150);
            strokeWeight(3);
            noFill();
            rect(40, y - 8, r, 36, 6);
            pop();
        }
        noStroke();
        fill(30);
        textSize(20);
        text(`Multiply ${num2} × ${num1Parts[num1Parts.length - 1 - i]} = `, 50, y);
        text(partials[num1Parts.length - 1 - i], x, y);
        textSize(22);
        y += 36;
        x += 10;
        r +=15;
    }
    if (step === maxStep) {
        push();
        textAlign(LEFT, TOP);
        // textSize(22);
        // text('+', 60, y);
        // for (let i = 0; i < num1Parts.length; i++) {
        //     text(partials[i], 80 + i * 60, y);
        // }
        // y += 32;
        stroke(0);
        strokeWeight(1.5);
        line(50, y, 300, y);
        pop();
        y += 8;
        push();
        stroke(0, 128, 0);
        strokeWeight(1);
        fill(0, 128, 0);
        text(result, 340, y);
        textSize(18);
        text('After Adding the partial products = ', 50, y);
        pop();
    }
}

function drawAreaModel() {
    // Area model box
    let boxX = 350, boxY = 100, boxW = 520, boxH = 120;
    let n = num1Parts.length;
    let cellW = boxW / n;

    // Top labels
    textAlign(CENTER, BOTTOM);
    textSize(20);
    for (let i = 0; i < n; i++) {
        fill(30);
        text(num1Labels[i], boxX + cellW * (i + 0.5), boxY - 10);
    }
    // Left label
    textAlign(RIGHT, CENTER);
    text(num2, boxX - 30, boxY + boxH / 2);
    text('×', boxX - 10, boxY + boxH / 2);

    // Draw cells
    for (let i = 0; i < n; i++) {
        let highlight = (step - 1 === n - 1 - i) || (step === maxStep && i === 0);
        push();
        strokeWeight(3);
        stroke(highlight ? color(220, 80, 150) : color(100, 80, 220));
        fill(highlight ? color(220, 80, 150, 40) : color(100, 80, 220, 20));
        rect(boxX + i * cellW, boxY, cellW, boxH, 0, 0, 0, 0);
        pop();

        // Show partials
        if (step > 0 && (n - 1 - i) < step) {
            push();
            fill(30);
            stroke(30);
            strokeWeight(1.5);
            textAlign(CENTER, CENTER);
            textSize(22);
            text(partials[i], boxX + cellW * (i + 0.5), boxY + boxH / 2);
            pop();
            //console.log((n -1 -i)+" "+partials[n - 1 - i])
        }
    }
}
