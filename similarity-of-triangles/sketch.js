
// Triangle Similarity Interactive Tool - Enhanced Version
let A, B, C;
let mathA, mathB, mathC;
let D, E, F;
let targetF = null;
let draggingF = false;
let offsetF = { x: 0, y: 0 };
let leftOrigin = { x: 150, y: 240 };
let rightOrigin = { x: 550, y: 240 };
let PIXEL_SCALE = 7;
let checkResult = null;
let errorMessage = null;
let targetRatio = 1;
let targetEF = 0;
let targetDF = 0;
let currentDE = 0;
let displayAnswer = false;

// --- GRID CONFIG ---
let GRID_LINES = 60;
let GRID_SPACING = 900 / GRID_LINES; // canvas width / number of lines

const ERROR_TOLERANCE = 0.01;
const MIN_TRIANGLE_SIDE = 8;
const MAX_TRIANGLE_SIDE = 30;

function setup() {
    let canvas = createCanvas(900, 400);
    canvas.parent("mainCanvas");
    textFont('Georgia');
    resetToNew();

    document.getElementById("similarity-info").style.display = "none";
    document.getElementById("hint-modal").style.display = "none";


    document.getElementById("hint-btn").addEventListener("click", () => {
        document.getElementById("hint-modal").style.display = "flex";
    });

    document.getElementById("close-hint").addEventListener("click", () => {
        document.getElementById("hint-modal").style.display = "none";
    });

    document.getElementById("hint-modal").addEventListener("click", (e) => {
        if (e.target.id === "hint-modal") {
            document.getElementById("hint-modal").style.display = "none";
        }
    });
}

function resetToNew() {
    let attempts = 0;
    displayAnswer = false;
    const maxAttempts = 200;
    document.getElementById('similarity-info').innerHTML = '';
    document.getElementById("similarity-info").style.display = "none";
    document.getElementById("check-btn").disabled = false;
    document.getElementById("show-btn").disabled = false;
    while (attempts < maxAttempts) {
        if (generateValidTrianglePair()) {
            checkResult = null;
            errorMessage = null;
            return;
        }
        attempts++;
    }
    errorMessage = "Failed to generate valid triangle pair.";
}

// Helper to get a random integer multiple of grid blocks
function randomGridBlocks(minBlocks, maxBlocks) {
    // minBlocks and maxBlocks are in grid blocks, not pixels
    return Math.floor(random(minBlocks, maxBlocks + 1));
}

function areTrianglesRoughlySimilar(a1, b1, c1, a2, b2, c2) {
    // Check if all three side ratios are (almost) equal
    let ratios = [a1 / a2, b1 / b2, c1 / c2];
    let tol = 0.01;
    return Math.abs(ratios[0] - ratios[1]) < tol && Math.abs(ratios[1] - ratios[2]) < tol;
}

function generateValidTrianglePair() {
    // Step 1: Generate random triangle ABC with integer sides (in grid blocks)
    const maxAttempts = 100;
    let blocksPerUnit = GRID_SPACING / PIXEL_SCALE;
    let minBlocks = Math.ceil(MIN_TRIANGLE_SIDE / blocksPerUnit);
    let maxBlocks = Math.floor(MAX_TRIANGLE_SIDE / blocksPerUnit);
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate random integer sides for triangle ABC (in grid blocks)
        let aBlocks = randomGridBlocks(minBlocks, maxBlocks);
        let bBlocks = randomGridBlocks(minBlocks, maxBlocks);
        let cBlocks = randomGridBlocks(minBlocks, maxBlocks);
        mathA = aBlocks * blocksPerUnit;
        mathB = bBlocks * blocksPerUnit;
        mathC = cBlocks * blocksPerUnit;

        // Check if it forms a valid triangle
        if (!isValidTriangle(mathA, mathB, mathC)) continue;

        // Calculate triangle ABC coordinates
        if (!calculateTriangleABC(mathA, mathB, mathC)) continue;

        // Step 2: Find a valid DE that creates integer EF and DF
        const validRatios = [2, 3, 4, 5, 0.5, 0.333, 0.25, 0.2]; // Including fractions

        for (let ratioAttempt = 0; ratioAttempt < 50; ratioAttempt++) {
            // Try different DE values
            let deBlocks = randomGridBlocks(minBlocks, maxBlocks);
            currentDE = deBlocks * blocksPerUnit;

            // Ensure DEF is different in shape from ABC
            if (currentDE === mathC) continue;

            // Calculate potential ratio
            let ratio = currentDE / mathC;

            // Check if this ratio would give integer sides
            let potentialEF = mathA * ratio;
            let potentialDF = mathB * ratio;

            // Snap to grid blocks (force integer multiples)
            let efBlocks = Math.round(potentialEF / blocksPerUnit);
            let dfBlocks = Math.round(potentialDF / blocksPerUnit);
            targetEF = efBlocks * blocksPerUnit;
            targetDF = dfBlocks * blocksPerUnit;

            // Only allow if these are integer multiples of grid blocks
            if (Math.abs(targetEF - potentialEF) < 0.001 && Math.abs(targetDF - potentialDF) < 0.001) {

                // Ensure the target triangle is valid and within bounds
                if (isValidTriangle(currentDE, targetEF, targetDF) &&
                    targetEF >= MIN_TRIANGLE_SIDE && targetEF <= MAX_TRIANGLE_SIDE &&
                    targetDF >= MIN_TRIANGLE_SIDE && targetDF <= MAX_TRIANGLE_SIDE) {

                    targetRatio = ratio;

                    // All sides are now integer multiples of grid blocks
                    // Now calculate triangle positions so that all corners are on grid intersections
                    if (calculateTriangleABC(mathA, mathB, mathC) && calculateTriangleDEF(currentDE, targetEF, targetDF)) {
                        // Snap all corners to grid
                        A = snapToGrid(A.x, A.y);
                        B = snapToGrid(B.x, B.y);
                        C = snapToGrid(C.x, C.y);
                        D = snapToGrid(D.x, D.y);
                        E = snapToGrid(E.x, E.y);
                        F = snapToGrid(F.x, F.y);
                        // Snap targetF as well
                        setTargetF(F.x, F.y);
                        // Now generate a random DEF triangle that is NOT similar to ABC
                        for (let defTry = 0; defTry < 50; defTry++) {
                            if (generateInitialDEF()) {
                                // Check similarity between ABC and DEF
                                let ab = dist(A.x, A.y, B.x, B.y) / PIXEL_SCALE;
                                let bc = dist(B.x, B.y, C.x, C.y) / PIXEL_SCALE;
                                let ca = dist(C.x, C.y, A.x, A.y) / PIXEL_SCALE;
                                let de = dist(D.x, D.y, E.x, E.y) / PIXEL_SCALE;
                                let ef = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
                                let fd = dist(F.x, F.y, D.x, D.y) / PIXEL_SCALE;
                                if (!areTrianglesRoughlySimilar(ab, bc, ca, de, ef, fd)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return false;
}

function generateInitialDEF() {
    // Generate a random triangle DEF that's different from the target
    const maxAttempts = 50;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        let randomEF = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
        let randomDF = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
        // Snap to grid
        randomEF = Math.round(randomEF * GRID_SPACING / PIXEL_SCALE) * PIXEL_SCALE / GRID_SPACING;
        randomDF = Math.round(randomDF * GRID_SPACING / PIXEL_SCALE) * PIXEL_SCALE / GRID_SPACING;
        // Ensure it's not the target triangle
        if (Math.abs(randomEF - targetEF) < 2 && Math.abs(randomDF - targetDF) < 2) {
            continue;
        }
        // Check if it forms a valid triangle with current DE
        if (isValidTriangle(currentDE, randomEF, randomDF)) {
            if (calculateTriangleDEF(currentDE, randomEF, randomDF)) {
                // Make sure F is not at the answer
                if (!targetF || F.x !== targetF.x || F.y !== targetF.y) {
                    return true;
                }
            }
        }
    }
    // Fallback: use a simple valid triangle
    let fallbackEF = Math.max(MIN_TRIANGLE_SIDE, currentDE - 3);
    let fallbackDF = Math.max(MIN_TRIANGLE_SIDE, currentDE - 2);
    // Snap to grid
    fallbackEF = Math.round(fallbackEF * GRID_SPACING / PIXEL_SCALE) * PIXEL_SCALE / GRID_SPACING;
    fallbackDF = Math.round(fallbackDF * GRID_SPACING / PIXEL_SCALE) * PIXEL_SCALE / GRID_SPACING;
    if (isValidTriangle(currentDE, fallbackEF, fallbackDF)) {
        if (calculateTriangleDEF(currentDE, fallbackEF, fallbackDF)) {
            if (!targetF || F.x !== targetF.x || F.y !== targetF.y) {
                return true;
            }
        }
    }
    return false;
}

function isValidTriangle(a, b, c) {
    return a + b > c && a + c > b && b + c > a &&
        a >= MIN_TRIANGLE_SIDE && a <= MAX_TRIANGLE_SIDE &&
        b >= MIN_TRIANGLE_SIDE && b <= MAX_TRIANGLE_SIDE &&
        c >= MIN_TRIANGLE_SIDE && c <= MAX_TRIANGLE_SIDE;
}

function calculateTriangleABC(a, b, c) {
    A = { x: leftOrigin.x, y: leftOrigin.y };
    B = { x: A.x + c * PIXEL_SCALE, y: A.y };
    let cosA = (b * b + c * c - a * a) / (2 * b * c);
    if (cosA < -1 || cosA > 1) return false;
    let angleA = Math.acos(cosA);
    C = {
        x: A.x + b * PIXEL_SCALE * Math.cos(angleA),
        y: A.y - Math.abs(b * PIXEL_SCALE * Math.sin(angleA))
    };
    return true;
}

function calculateTriangleDEF(de, ef, df) {
    D = { x: rightOrigin.x, y: rightOrigin.y };
    E = { x: D.x + de * PIXEL_SCALE, y: D.y };
    let cosD = (df * df + de * de - ef * ef) / (2 * df * de);
    if (cosD < -1 || cosD > 1) return false;
    let angleD = Math.acos(cosD);
    let rawF = {
        x: D.x + df * PIXEL_SCALE * Math.cos(angleD),
        y: D.y - Math.abs(df * PIXEL_SCALE * Math.sin(angleD))
    };
    // Snap F to grid
    let snappedF = snapToGrid(rawF.x, rawF.y);
    F = { x: snappedF.x, y: snappedF.y };
    // Do NOT set targetF here
    return true;
}

function calculateTargetF() {
    let cosD = (targetDF * targetDF + currentDE * currentDE - targetEF * targetEF) / (2 * targetDF * currentDE);
    let angleD = Math.acos(constrain(cosD, -1, 1));
    let rawTargetF = {
        x: D.x + targetDF * PIXEL_SCALE * Math.cos(angleD),
        y: D.y - Math.abs(targetDF * PIXEL_SCALE * Math.sin(angleD))
    };
    // Snap targetF to grid
    let snappedTargetF = snapToGrid(rawTargetF.x, rawTargetF.y);
    setTargetF(snappedTargetF.x, snappedTargetF.y);
}

function draw() {
    background(220);
    drawGrid(); // Draw the grid first

    // Draw triangles
    drawTriangle(A, B, C, true, [mathC, mathA, mathB], ['AB', 'BC', 'CA']);

    let de = dist(D.x, D.y, E.x, E.y) / PIXEL_SCALE;
    let ef = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
    let df = dist(D.x, D.y, F.x, F.y) / PIXEL_SCALE;

    drawTriangle(D, E, F, false, [de, ef, df], ['DE', 'EF', 'DF']);
    drawDraggableF();

    if (displayAnswer) {
        drawTargetGuide();
        displaySimilarityInfo();
    }

    displayCheckResult();
    displayErrorMessage();
}

function drawGrid() {
    stroke(200);
    strokeWeight(1);
    // Vertical lines
    for (let i = 0; i <= GRID_LINES; i++) {
        let x = i * GRID_SPACING;
        line(x, 0, x, height);
    }
    // Horizontal lines
    for (let j = 0; j <= Math.floor(height / GRID_SPACING); j++) {
        let y = j * GRID_SPACING;
        line(0, y, width, y);
    }
}

function snapToGrid(x, y) {
    return {
        x: Math.round(x / GRID_SPACING) * GRID_SPACING,
        y: Math.round(y / GRID_SPACING) * GRID_SPACING
    };
}

function drawTriangle(p1, p2, p3, isLeft, mathSides, labels) {
    stroke(80);
    strokeWeight(3);
    fill(isLeft ? 'rgba(0,200,0,0.1)' : 'rgba(0,0,200,0.1)');
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    let midpoints = [
        { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
        { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 },
        { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 }
    ];
    let points = [p1, p2, p3];
    let nextPoints = [p2, p3, p1];
    let colors = ['#555', '#2a5', '#e36'];

    for (let i = 0; i < 3; i++) {
        stroke(colors[i]);
        line(points[i].x, points[i].y, nextPoints[i].x, nextPoints[i].y);
        fill(colors[i]);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(18);
        // Calculate side length in grid blocks (always integer)
        let blockLength = Math.round(mathSides[i] / (GRID_SPACING / PIXEL_SCALE));
        if (i == 0) {
            text(`${labels[i]}: ${blockLength}`, midpoints[i].x, midpoints[i].y + 20);
        }
        else if (i == 1) {
            text(`${labels[i]}: ${blockLength}`, midpoints[i].x + 50, midpoints[i].y - 5);
        }
        else {
            text(`${labels[i]}: ${blockLength}`, midpoints[i].x - 50, midpoints[i].y - 5);
        }
    }

    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(isLeft ? 'A' : 'D', p1.x - 15, p1.y - 10);
    text(isLeft ? 'B' : 'E', p2.x + 15, p2.y + 10);
    text(isLeft ? 'C' : 'F', p3.x, p3.y - 15);
}

function drawDraggableF() {
    fill(100, 100, 255, 200);
    stroke(0, 0, 200);
    ellipse(F.x, F.y, 20);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("F", F.x, F.y);
}

function drawTargetGuide() {
    if (targetF) {
        push();
        stroke(0, 200, 0, 120);
        strokeWeight(3);
        fill(0, 200, 0, 40);
        ellipse(targetF.x, targetF.y, 25);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(12);
        text("TARGET", targetF.x, targetF.y);
        pop();
    }
}

function mousePressed() {
    if (dist(mouseX, mouseY, F.x, F.y) < 20) {
        draggingF = true;
        offsetF.x = F.x - mouseX;
        offsetF.y = F.y - mouseY;
    }
}

function mouseDragged() {
    if (draggingF) {
        // Constrain F movement to canvas bounds
        let newX = constrain(mouseX + offsetF.x, 50, width - 50);
        let newY = constrain(mouseY + offsetF.y, 50, height - 50);
        let snapped = snapToGrid(newX, newY);
        F.x = snapped.x;
        F.y = snapped.y;
    }
}

function mouseReleased() {
    draggingF = false;
}

// function displaySimilarityInfo() {
//     let de = dist(D.x, D.y, E.x, E.y) / PIXEL_SCALE;
//     let ef = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
//     let df = dist(D.x, D.y, F.x, F.y) / PIXEL_SCALE;

//     push();
//     fill(0);
//     textSize(14);
//     textAlign(CENTER);
//     text(`AB/DE = ${(mathC / de).toFixed(2)}, BC/EF = ${(mathA / ef).toFixed(2)}, CA/DF = ${(mathB / df).toFixed(2)}`, width/2, 300);
//     text(`Target ratio = ${targetRatio.toFixed(2)}`, width/2, 320);
//     text(`Target: EF = ${targetEF}, DF = ${targetDF}`, width/2, 340);
//     pop();
// }

function displaySimilarityInfo() {
    let de = dist(D.x, D.y, E.x, E.y) / PIXEL_SCALE;
    let ef = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
    let df = dist(D.x, D.y, F.x, F.y) / PIXEL_SCALE;

    let ratioAB_DE = (mathC / de).toFixed(2);
    let ratioBC_EF = (mathA / ef).toFixed(2);
    let ratioCA_DF = (mathB / df).toFixed(2);

    // Convert target values from pixel units to grid block units for display
    let blocksPerUnit = GRID_SPACING / PIXEL_SCALE;
    let targetDFBlocks = Math.round(targetDF / blocksPerUnit);
    let targetEFBlocks = Math.round(targetEF / blocksPerUnit);

    let infoHTML = `
        <div style="display: flex; justify-content: center; align-items: flex-end; gap: 10px;">
            <div style="text-align: center; line-height: 1;">
                <div>AB</div>
                <hr style="margin: 2px 0; border: none; border-top: 1px solid #000;">
                <div>DE</div>
            </div>
            <div>= ${ratioAB_DE}</div>
            <div style="text-align: center; line-height: 1;">
                <div>BC</div>
                <hr style="margin: 2px 0; border: none; border-top: 1px solid #000;">
                <div>EF</div>
            </div>
            <div>= ${ratioBC_EF}</div>
            <div style="text-align: center; line-height: 1; ">
                <div>CA</div>
                <hr style="margin: 2px 0; border: none; border-top: 1px solid #000;">
                <div>DF</div>
            </div>
            <div>= ${ratioCA_DF}</div>
        </div>

        <p>🎯 Target Ratio: <strong>${targetRatio.toFixed(2)}</strong></p>
        <p style="margin:0 !important; padding:0 !important; line-height: 1 !important;">🎯 Target DF: <strong>${targetDFBlocks}</strong> | Target EF: <strong>${targetEFBlocks}</strong></p>
    `;

    document.getElementById('similarity-info').innerHTML = infoHTML;
}


function areTrianglesSimilar() {
    // Check if current F position is close enough to target F position
    if (!targetF) return false;
    
    // Calculate distance between current F and target F
    let distanceToTarget = dist(F.x, F.y, targetF.x, targetF.y);
    
    // If F is close enough to target position, triangles are similar
    // Use a tolerance based on grid spacing
    let tolerance = GRID_SPACING * 0.5; // Half a grid unit
    
    return distanceToTarget <= tolerance;
}

// function displayCheckResult() {
//     if (checkResult === null) return;
//     fill(checkResult ? 'green' : 'red');
//     textSize(24);
//     textAlign(CENTER, TOP);
//     text(checkResult ? '✓ △ABC ~ △DEF' : '✗ Triangles NOT similar', width / 2, 20);
// }


let resultShownTime = 0;

function displayCheckResult() {
    if (checkResult === null) return;

    // Hide "false" result after 5 seconds
    if (!checkResult && millis() - resultShownTime > 5000) {
        checkResult = null;
        return;
    }

    fill(checkResult ? 'green' : 'red');
    textSize(24);
    textAlign(CENTER, TOP);
    text(checkResult ? '✓ △ABC ~ △DEF' : '✗ Triangles NOT similar', width / 2, 20);
}

// Call this when you set the result
function setCheckResult(result) {
    checkResult = result;
    resultShownTime = millis(); // store the time

    if(checkResult) {
        document.getElementById("check-btn").innerHTML = "Check";
        document.getElementById("check-btn").disabled = true;
    } else {
        document.getElementById("check-btn").innerHTML = "Try Again";
    }
}


function displayErrorMessage() {
    if (errorMessage) {
        fill('red');
        textSize(12);
        textAlign(LEFT, TOP);
        text('Error: ' + errorMessage, 10, 10);
    }
}

function checkSimilarity() {
    checkResult = areTrianglesSimilar();
    setCheckResult(checkResult);
}

function showAnswer() {
    displayAnswer = true;
    document.getElementById("similarity-info").style.display = "block";
    document.getElementById("check-btn").disabled = false;
    document.getElementById("show-btn").disabled = true;
}

// p5.js helper functions
function random(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}

// Whenever targetF is set or updated, snap it to the grid
function setTargetF(x, y) {
    let snapped = snapToGrid(x, y);
    targetF = { x: snapped.x, y: snapped.y };
}