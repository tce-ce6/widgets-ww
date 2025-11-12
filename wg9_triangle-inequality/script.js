// Triangle Inequality Interactive Model
// Uses p5.js

let segmentLengths = [5, 8, 6]; // AB, BC, AC
let minLen = 1, maxLen = 10;
let canMakeTriangle = false;
let showTriangle = false;
let showShuffle = false;
const baseX = 120, baseY = 400, gap = 100;

function setup() {
    const canvas = createCanvas(1200, 600);
    canvas.parent('mainCanvas');
    textFont('Georgia');
    noLoop();
    redraw();
    setupButtons();
}

function draw() {
    background(220);
    drawSegments();
    drawInequalityChecks();
    if (showTriangle) {
        //  drawTriangle(); // always draw, even if invalid
        drawTriangleOrOpenShape();
    }
}

function setupButtons() {
    const makeBtn = document.getElementById('make-triangle-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const resetBtn = document.getElementById('reset-btn');

    resetBtn.onclick = () => {
        resetTriangle();
        showTriangle = false;
        showShuffle = false;
         shuffleBtn.style.display = 'none';
        redraw();
    }

    makeBtn.onclick = () => {
        canMakeTriangle = checkTriangleInequality();
        showTriangle = true;
        showShuffle = canMakeTriangle;
        showShuffle = true;
         shuffleBtn.style.display = showShuffle ? 'inline-block' : 'none';
        redraw();
    };

    shuffleBtn.onclick = () => {
        shuffleSegments();
        showTriangle = false;
        showShuffle = false;
        shuffleBtn.style.display = 'none';
        redraw();
    };
}

function drawSegments() {
    const colors = ['#ff8800', '#228B22', '#0099ff'];
    const labels = [['A', 'B'], ['B', 'C'], ['C', 'A']];

    textAlign(LEFT, BASELINE);

    for (let i = 0; i < 3; i++) {
        const x = baseX + i * gap;
        const y = baseY;

        stroke(colors[i]);
        strokeWeight(6);
        line(x, y, x, y - segmentLengths[i] * 25);

        if (i == 0) {
            noStroke();
            fill(colors[i]);
            textSize(20);
            text(labels[i][0], x - 5, y - segmentLengths[i] * 25 - 15);
            text(labels[i][1], x - 5, y + 25);

            ellipse(x, y - segmentLengths[i] * 12.5, 25);

            if (segmentLengths[i] < 10) {
                fill(0);
                textSize(22);
                text(segmentLengths[i], x - 5, y - segmentLengths[i] * 12.5 + 5);
            }
            else {
                fill(0);
                textSize(22);
                text(segmentLengths[i], x - 10, y - segmentLengths[i] * 12.5 + 5);
            }
        }
        else {
            noStroke();
            fill(colors[i]);
            textSize(20);
            text(labels[i][0], x, y - segmentLengths[i] * 25 - 15);
            text(labels[i][1], x, y + 25);

            ellipse(x, y - segmentLengths[i] * 12.5, 25);

            fill(0);
            textSize(22);
            text(segmentLengths[i], x, y - segmentLengths[i] * 12.5);
        }

        drawButton(x, y + 60, '+');
        drawButton(x, y + 120, '-');
    }
}

function drawButton(x, y, label) {
    fill(255);
    stroke(180);
    strokeWeight(3.5);
    ellipse(x, y, 38, 38);
    fill(80);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(28);
    text(label, x, y + 1);
}

function mousePressed() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    for (let i = 0; i < 3; i++) {
        const x = baseX + i * gap;
        const plusY = baseY + 60;
        const minusY = baseY + 120;

        if (dist(mouseX, mouseY, x, plusY) < 19) {
            changeSegment(i, +1);
            return false;
        }
        if (dist(mouseX, mouseY, x, minusY) < 19) {
            changeSegment(i, -1);
            return false;
        }
    }
}

function changeSegment(idx, delta) {
    const newVal = constrain(segmentLengths[idx] + delta, minLen, maxLen);
    if (newVal !== segmentLengths[idx]) {
        segmentLengths[idx] = newVal;
        showTriangle = false;
        showShuffle = false;
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) shuffleBtn.style.display = 'none';
        redraw();
    }
}

function drawInequalityChecks() {
    const x = 900, y = 220, gap = 90;
    const checks = [
        { a: 1, b: 2, c: 0, label: '"Is BC + AC > AB?"' },
        { a: 0, b: 2, c: 1, label: '"Is AB + AC > BC?"' },
        { a: 0, b: 1, c: 2, label: '"Is AB + BC > AC?"' }        
    ];
    const colors = ['#ff8800', '#228B22', '#0099ff'];
    const results = [];

    for (let i = 0; i < 3; i++) {
        const { a, b, c, label } = checks[i];
        const left = segmentLengths[a] + segmentLengths[b];
        const right = segmentLengths[c];
        const valid = left > right;
        results.push(valid);

        fill(colors[i]);
        textSize(22);
        textAlign(LEFT, CENTER);
        text(label, x, y + i * gap);

        fill('#222');
        textSize(22);
        text(`${segmentLengths[a]} + ${segmentLengths[b]} > ${segmentLengths[c]}`, x + 8, y + i * gap + 30);

        textSize(36);
        if (showTriangle) {
            if (valid) {
                fill('#388e3c');
                text('✔', x + 200, y + i * gap);
            } else {
                fill('#d32f2f');
                text('✗', x + 200, y + i * gap);
            }
        }
    }
``
    canMakeTriangle = results.every(Boolean);
}

function checkTriangleInequality() {
    const [a, b, c] = segmentLengths;
    return (a + b > c) && (a + c > b) && (b + c > a);
}

function drawTriangleOrOpenShape() {
    const [a, b, c] = segmentLengths;
    const scale = 25;

    // Base points A, B
    const Ax = width / 2 - (a * scale) / 2;
    const Ay = 400;
    const Bx = Ax + a * scale;
    const By = Ay;

    strokeWeight(6);
    stroke('#ff8800');
    line(Ax, Ay, Bx, By); // base AB

    // Check triangle inequality
    if (checkTriangleInequality()) {
        // ✅ Valid triangle
        let xFromA = (c * c + a * a - b * b) / (2 * a);
        let yFromBaseSq = c * c - xFromA * xFromA;
        if (yFromBaseSq < 0) yFromBaseSq = 0;
        let yFromBase = Math.sqrt(yFromBaseSq);

        const Cx = Ax + xFromA * scale;
        const Cy = Ay - yFromBase * scale;

        stroke('#228B22'); line(Bx, By, Cx, Cy);
        stroke('#0099ff'); line(Cx, Cy, Ax, Ay);

        noStroke();
        textSize(22);
        textAlign(CENTER, CENTER);
        fill('#ff8800'); text('A', Ax - 18, Ay);
        fill('#228B22'); text('B', Bx + 18, By);
        fill('#0099ff'); text('C', Cx, Cy - 18);

    } else {
        let tiltAngle = radians(60);

        // Arm from A → should use AC (c)
        const CxA = Ax + c * scale * Math.cos(tiltAngle);
        const CyA = Ay - c * scale * Math.sin(tiltAngle);
        stroke('#0099ff');
        line(Ax, Ay, CxA, CyA);

        // Arm from B → should use BC (b)
        const CxB = Bx - b * scale * Math.cos(tiltAngle);
        const CyB = By - b * scale * Math.sin(tiltAngle);
        stroke('#228B22');
        line(Bx, By, CxB, CyB);

        // Labels
        noStroke();
        textSize(22);
        textAlign(CENTER, CENTER);
        fill('#ff8800'); text('A', Ax - 18, Ay);
        fill('#228B22'); text('B', Bx + 18, By);
        fill('#0099ff'); text('C', CxA, CyA - 18);
        fill('#228B22'); text('C', CxB, CyB - 18);
    }

}


// function drawTriangle() {
//     const [a, b, c] = segmentLengths;
//     const scale = 25;

//     const Ax = width / 2 - (a * scale) / 2;
//     const Ay = 400;
//     const Bx = Ax + a * scale;
//     const By = Ay;

//     // Always compute C, even if invalid
//     let xFromA = (c * c + a * a - b * b) / (2 * a);
//     let yFromBaseSq = c * c - xFromA * xFromA;
//     // If invalid triangle, force y=0 (collinear line)
//     if (yFromBaseSq < 0) yFromBaseSq = 0;
//     const yFromBase = Math.sqrt(yFromBaseSq);

//     const Cx = Ax + xFromA * scale;
//     const Cy = Ay - yFromBase * scale;

//     strokeWeight(6);
//     stroke('#ff8800');
//     line(Ax, Ay, Bx, By);
//     stroke('#228B22');
//     line(Bx, By, Cx, Cy);
//     stroke('#0099ff');
//     line(Cx, Cy, Ax, Ay);

//     noStroke();
//     textSize(22);
//     textAlign(CENTER, CENTER);
//     fill('#ff8800');
//     text('A', Ax - 18, Ay);
//     fill('#228B22');
//     text('B', Bx + 18, By);
//     fill('#0099ff');
//     text('C', Cx, Cy - 18);
// }

function resetTriangle() {
    let tries = 0;
    do {
        segmentLengths[0] = int(random(minLen, maxLen + 1));
        segmentLengths[1] = int(random(minLen, maxLen + 1));
        segmentLengths[2] = int(random(minLen, maxLen + 1));
        tries++;
    } while (!checkTriangleInequality() && tries < 200);
    redraw();
}

function shuffleSegments() {
    // Fisher-Yates shuffle
    for (let i = segmentLengths.length - 1; i > 0; i--) {
        let j = int(random(i + 1));  // pick random index
        [segmentLengths[i], segmentLengths[j]] = [segmentLengths[j], segmentLengths[i]];
    }
    redraw();
}