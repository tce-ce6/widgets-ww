// Triangle Inequality Interactive Model
// Uses p5.js

let segmentLengths = [5, 8, 6]; // AB, BC, AC
let minLen = 1, maxLen = 15;
let selected = -1;
let canMakeTriangle = false;
let showTriangle = false;
let showShuffle = false;

function setup() {
    let canvas = createCanvas(1000, 600);
    canvas.parent('mainCanvas');
    textFont('Georgia');
    noLoop();
    drawUI();
    setupButtons();
}

function draw() {
    background('#fff');
    drawSegments();
    drawInequalityChecks();
    if (showTriangle && canMakeTriangle) {
        drawTriangle();
    }
}

function drawUI() {
    redraw();
}

function setupButtons() {
    const makeBtn = document.getElementById('make-triangle-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    makeBtn.onclick = () => {
        canMakeTriangle = checkTriangleInequality();
        showTriangle = true;
        showShuffle = canMakeTriangle;
        shuffleBtn.style.display = 'inline-block';
        redraw();
    };
    shuffleBtn.onclick = () => {
        shuffleTriangle();
        showTriangle = false;
        showShuffle = false;
        shuffleBtn.style.display = 'none';
        redraw();
    };
}

function drawSegments() {
    // Draw the three vertical segments with + and - controls
    let baseX = 120, baseY = 400, gap = 120, segHeight = 120;
    let colors = ['#ff8800', '#228B22', '#0099ff'];
    let labels = [['A', 'B'], ['B', 'C'], ['A', 'C']];
    for (let i = 0; i < 3; i++) {
        let x = baseX + i * gap;
        let y = baseY;
        stroke(colors[i]);
        strokeWeight(6);
        line(x, y, x, y - segmentLengths[i] * 15);
        noStroke();
        fill(colors[i]);
        textSize(20);
        text(labels[i][0], x - 10, y - segmentLengths[i] * 15 - 10);
        text(labels[i][1], x - 10, y + 20);
        fill(0);
        textSize(22);
        text(segmentLengths[i], x - 10, y - segmentLengths[i] * 7.5);
        // Draw + and - buttons
        drawButton(x, y + 40, '+', i, 1);
        drawButton(x, y + 80, '-', i, -1);
    }
}

function drawButton(x, y, label, idx, delta) {
    fill(255);
    stroke(180);
    ellipse(x, y, 38, 38);
    fill(80);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(28);
    text(label, x, y + 2);
    // Mouse interaction
    if (mouseIsPressed && dist(mouseX, mouseY, x, y) < 19) {
        if (selected === -1) {
            selected = idx * 2 + (delta > 0 ? 0 : 1);
            changeSegment(idx, delta);
        }
    }
}

function mouseReleased() {
    selected = -1;
}

function changeSegment(idx, delta) {
    let newVal = segmentLengths[idx] + delta;
    if (newVal >= minLen && newVal <= maxLen) {
        segmentLengths[idx] = newVal;
        showTriangle = false;
        showShuffle = false;
        document.getElementById('shuffle-btn').style.display = 'none';
        redraw();
    }
}

function drawInequalityChecks() {
    // Show the triangle inequality checks on the right
    let x = 700, y = 180, gap = 90;
    let checks = [
        {a: 0, b: 1, c: 2, label: 'AB + BC > AC?'},
        {a: 0, b: 2, c: 1, label: 'AB + AC > BC?'},
        {a: 1, b: 2, c: 0, label: 'BC + AC > AB?'}
    ];
    let colors = ['#d32f2f', '#388e3c', '#1976d2'];
    let results = [];
    for (let i = 0; i < 3; i++) {
        let {a, b, c, label} = checks[i];
        let left = segmentLengths[a] + segmentLengths[b];
        let right = segmentLengths[c];
        let valid = left > right;
        results.push(valid);
        fill(colors[i]);
        textSize(22);
        textAlign(LEFT, CENTER);
        text(label, x, y + i * gap);
        fill('#222');
        textSize(22);
        text(`${segmentLengths[a]} + ${segmentLengths[b]} > ${segmentLengths[c]}`, x + 180, y + i * gap);
        if (showTriangle) {
            if (valid) {
                fill('#388e3c');
                textSize(36);
                text('✔', x + 400, y + i * gap);
            } else {
                fill('#d32f2f');
                textSize(36);
                text('✗', x + 400, y + i * gap);
            }
        }
    }
    canMakeTriangle = results.every(r => r);
}

function checkTriangleInequality() {
    return (
        segmentLengths[0] + segmentLengths[1] > segmentLengths[2] &&
        segmentLengths[0] + segmentLengths[2] > segmentLengths[1] &&
        segmentLengths[1] + segmentLengths[2] > segmentLengths[0]
    );
}

function drawTriangle() {
    // Draw the triangle using the three segments
    let a = segmentLengths[0], b = segmentLengths[1], c = segmentLengths[2];
    let cx = 800, cy = 400;
    let scale = 18;
    // Place A at (cx, cy)
    let Ax = cx, Ay = cy;
    // Place B at (cx + c*scale, cy)
    let Bx = cx + c * scale, By = cy;
    // Find C using law of cosines
    let angleC = Math.acos((a*a + b*b - c*c) / (2*a*b));
    let Cx = Ax + b * scale * Math.cos(angleC);
    let Cy = Ay - b * scale * Math.sin(angleC);
    strokeWeight(6);
    stroke('#ff8800');
    line(Ax, Ay, Bx, By);
    stroke('#228B22');
    line(Bx, By, Cx, Cy);
    stroke('#0099ff');
    line(Cx, Cy, Ax, Ay);
    // Draw points
    fill('#ff8800');
    noStroke();
    textSize(22);
    textAlign(CENTER, CENTER);
    text('A', Ax - 18, Ay);
    fill('#228B22');
    text('B', Bx + 18, By);
    fill('#0099ff');
    text('C', Cx, Cy - 18);
}

function shuffleTriangle() {
    // Randomize the segment lengths within bounds, ensuring a valid triangle
    let tries = 0;
    do {
        segmentLengths[0] = int(random(3, 12));
        segmentLengths[1] = int(random(3, 12));
        segmentLengths[2] = int(random(3, 12));
        tries++;
    } while (!checkTriangleInequality() && tries < 100);
    redraw();
}
