
let points = [];
let selectedPoint = null;

function setup() {
    let canvas = createCanvas(800, 400);
    canvas.parent("mainCanvas");

    document.getElementById("pointSlider").addEventListener("input", (e) => {
        let count = parseInt(e.target.value);
        document.getElementById("point-count").textContent = count;
        initializePoints(count);
    });
    document.getElementById("reset-btn").addEventListener("click", () => {
        const defaultCount = 9;
        document.getElementById("pointSlider").value = defaultCount;
        document.getElementById("point-count").textContent = defaultCount;
        initializePoints(defaultCount);
    });
    
    document.getElementById("hint-btn").addEventListener("click", () => {
        document.getElementById("hint-modal").style.display = "flex";
    });
    
    document.getElementById("close-hint").addEventListener("click", () => {
        document.getElementById("hint-modal").style.display = "none";
    });
    
    // Optional: close on click outside the box
    document.getElementById("hint-modal").addEventListener("click", (e) => {
        if (e.target.id === "hint-modal") {
            document.getElementById("hint-modal").style.display = "none";
        }
    });

    initializePoints(9);
}

function draw() {
    background(255);

    // Draw y-axis labels
    stroke(200);
    fill(0);
    textSize(12);
    textAlign(RIGHT, CENTER);
    for (let i = 0; i <= 20; i += 2) {
        let y = yToCanvas(i);
        stroke(230);
        line(60, y, width - 60, y);
        noStroke();
        fill(0);
        text(i, 55, y);
    }

    // Draw axis line
    stroke(0);
    line(60, yToCanvas(0), 60, yToCanvas(20));

    // Median calculation
    let medianVal = getMedian(points.map(p => p.yVal));
    document.getElementById("median-value").textContent = medianVal;

    // Draw median line
    let medianY = yToCanvas(medianVal);
    stroke("#4a40b4");
    strokeWeight(2);
    line(60, medianY, width - 60, medianY);

    // Draw all points
    textSize(14);
    for (let pt of points) {
        fill(255, 20, 147);
        stroke(0);
        ellipse(pt.x, yToCanvas(pt.yVal), 20, 20);
        noStroke();
        fill(0);
        textAlign(CENTER);
        text(Math.round(pt.yVal), pt.x, yToCanvas(pt.yVal));
    }
}

function mousePressed() {
    for (let pt of points) {
        if (dist(mouseX, mouseY, pt.x, yToCanvas(pt.yVal)) < 10) {
            selectedPoint = pt;
            break;
        }
    }
}

function mouseDragged() {
    if (selectedPoint) {
        selectedPoint.yVal = canvasToY(mouseY);
    }
}

function mouseReleased() {
    selectedPoint = null;
}

function getMedian(values) {
    let sorted = [...values].sort((a, b) => a - b);
    let mid = floor(sorted.length / 2);
    return sorted.length % 2 === 1
        ? sorted[mid]
        : ((sorted[mid - 1] + sorted[mid]) / 2);
}

function initializePoints(n) {
    points = [];
    for (let i = 0; i < n; i++) {
        let x = map(i, 0, n - 1, 100, width - 100);
        let yVal = int(random(5, 15));
        points.push({ x, yVal });
    }
}

function yToCanvas(yVal) {
    return map(yVal, 0, 20, height - 50, 50);
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Converts a y-coordinate from canvas space to a corresponding y-value in data space.
 * 
 * @param {number} yCanvas - The y-coordinate on the canvas.
 * @returns {number} - The y-value in data space, constrained between 0 and 20.
 */

/*******  17a00521-4e28-481d-b77e-0ec5fa081dd0  *******/
function canvasToY(yCanvas) {
    return Math.round(constrain(map(yCanvas, height - 50, 50, 0, 20), 0, 20));
}

