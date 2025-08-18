
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
let targetDFBlocks;
let targetEFBlocks;
let currentSimilarityMethod = 'SSS'; // Track current method: 'SSS', 'SAS', 'AA'

// Remove grid configuration - no more grid snapping
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
    
    // Cycle through similarity methods
    cycleSimilarityMethod();
    
    // Update the reset button to show current method
    updateResetButtonText();
    
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

function cycleSimilarityMethod() {
    const methods = ['SSS', 'SAS', 'AA'];
    const currentIndex = methods.indexOf(currentSimilarityMethod);
    currentSimilarityMethod = methods[(currentIndex + 1) % methods.length];
    console.log('Current similarity method:', currentSimilarityMethod);
}

function updateResetButtonText() {
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.innerHTML = `New ${currentSimilarityMethod} Problem`;
    }
}

// Helper to get a random integer value for triangle sides
function randomTriangleSide(minSide, maxSide) {
    return Math.floor(random(minSide, maxSide + 1));
}

function areTrianglesRoughlySimilar(a1, b1, c1, a2, b2, c2) {
    // Check if all three side ratios are (almost) equal
    let ratios = [a1 / a2, b1 / b2, c1 / c2];
    let tol = 0.01;
    return Math.abs(ratios[0] - ratios[1]) < tol && Math.abs(ratios[1] - ratios[2]) < tol;
}

function generateValidTrianglePair() {
    switch (currentSimilarityMethod) {
        case 'SSS':
            return generateSSSTrianglePair();
        case 'SAS':
            return generateSASTrianglePair();
        case 'AA':
            return generateAATrianglePair();
        default:
            return generateSSSTrianglePair();
    }
}

function generateSSSTrianglePair() {
    // SSS: All three sides proportional, integer values only
    const maxAttempts = 100;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate random integer sides for triangle ABC
        mathA = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathB = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathC = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);

        // Check if it forms a valid triangle
        if (!isValidTriangle(mathA, mathB, mathC)) continue;

        // Calculate triangle ABC coordinates
        if (!calculateTriangleABC(mathA, mathB, mathC)) continue;

        // Find a valid DE that creates integer EF and DF
        for (let ratioAttempt = 0; ratioAttempt < 50; ratioAttempt++) {
            currentDE = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
            if (currentDE === mathC) continue;

            let ratio = currentDE / mathC;
            let potentialEF = mathA * ratio;
            let potentialDF = mathB * ratio;

            // Only accept if both EF and DF are exactly integer
            if (!Number.isInteger(potentialEF) || !Number.isInteger(potentialDF)) continue;
            targetEF = potentialEF;
            targetDF = potentialDF;

            if (isValidTriangle(currentDE, targetEF, targetDF) &&
                targetEF >= MIN_TRIANGLE_SIDE && targetEF <= MAX_TRIANGLE_SIDE &&
                targetDF >= MIN_TRIANGLE_SIDE && targetDF <= MAX_TRIANGLE_SIDE) {

                targetRatio = ratio;
                console.log('SSS Target values set:', { targetEF, targetDF, ratio, mathA, mathB, mathC, currentDE });

                if (calculateTriangleABC(mathA, mathB, mathC) && calculateTriangleDEF(currentDE, targetEF, targetDF)) {
                    calculateTargetF();
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
    return false;
}

function generateSASTrianglePair() {
    // SAS: Two sides and the included angle, integer values only
    const maxAttempts = 100;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate random integer sides for triangle ABC
        mathA = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathB = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathC = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);

        if (!isValidTriangle(mathA, mathB, mathC)) continue;
        if (!calculateTriangleABC(mathA, mathB, mathC)) continue;

        // For SAS, ensure the included angle (at B) is reasonable
        let cosB = (mathA * mathA + mathC * mathC - mathB * mathB) / (2 * mathA * mathC);
        if (cosB < -0.9 || cosB > 0.9) continue; // Avoid very small or very large angles

        // Find valid ratio for SAS
        for (let ratioAttempt = 0; ratioAttempt < 50; ratioAttempt++) {
            currentDE = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
            if (currentDE === mathC) continue;

            let ratio = currentDE / mathC;
            let potentialEF = mathA * ratio;
            let potentialDF = mathB * ratio;

            // Only accept if both EF and DF are exactly integer
            if (!Number.isInteger(potentialEF) || !Number.isInteger(potentialDF)) continue;
            targetEF = potentialEF;
            targetDF = potentialDF;

            if (isValidTriangle(currentDE, targetEF, targetDF) &&
                targetEF >= MIN_TRIANGLE_SIDE && targetEF <= MAX_TRIANGLE_SIDE &&
                targetDF >= MIN_TRIANGLE_SIDE && targetDF <= MAX_TRIANGLE_SIDE) {

                targetRatio = ratio;
                console.log('SAS Target values set:', { targetEF, targetDF, ratio, mathA, mathB, mathC, currentDE });

                if (calculateTriangleDEF(currentDE, targetEF, targetDF)) {
                    calculateTargetF();
                    if (generateInitialDEF()) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function generateAATrianglePair() {
    // AA: Two angles (which means three angles since sum is 180°)
    const maxAttempts = 100;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate random triangle ABC
        mathA = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathB = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathC = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);

        if (!isValidTriangle(mathA, mathB, mathC)) continue;
        if (!calculateTriangleABC(mathA, mathB, mathC)) continue;

        // For AA, we need to ensure angles are reasonable (not too small)
        let cosA = (mathB * mathB + mathC * mathC - mathA * mathA) / (2 * mathB * mathC);
        let cosB = (mathA * mathA + mathC * mathC - mathB * mathB) / (2 * mathA * mathC);
        let cosC = (mathA * mathA + mathB * mathB - mathC * mathC) / (2 * mathA * mathB);
        
        if (cosA > 0.9 || cosB > 0.9 || cosC > 0.9) continue; // Avoid very small angles

        // Find valid ratio for AA
        for (let ratioAttempt = 0; ratioAttempt < 50; ratioAttempt++) {
            currentDE = randomTriangleSide(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
            if (currentDE === mathC) continue;

            let ratio = currentDE / mathC;
            let potentialEF = mathA * ratio;
            let potentialDF = mathB * ratio;

            targetEF = Math.round(potentialEF);
            targetDF = Math.round(potentialDF);

            if (Math.abs(targetEF - potentialEF) < 0.1 && Math.abs(targetDF - potentialDF) < 0.1) {
                if (isValidTriangle(currentDE, targetEF, targetDF) &&
                    targetEF >= MIN_TRIANGLE_SIDE && targetEF <= MAX_TRIANGLE_SIDE &&
                    targetDF >= MIN_TRIANGLE_SIDE && targetDF <= MAX_TRIANGLE_SIDE) {

                    targetRatio = ratio;
                    console.log('AA Target values set:', { targetEF, targetDF, ratio, mathA, mathB, mathC, currentDE });

                    if (calculateTriangleDEF(currentDE, targetEF, targetDF)) {
                        calculateTargetF();
                        if (generateInitialDEF()) {
                            return true;
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
    // Anchor D at the right origin
    D = { x: rightOrigin.x, y: rightOrigin.y };
    // Place E using the exact base length from D
    E = { x: D.x + de * PIXEL_SCALE, y: D.y };
    
    let cosD = (df * df + de * de - ef * ef) / (2 * df * de);
    if (cosD < -1 || cosD > 1) return false;
    let angleD = Math.acos(cosD);
    F = {
        x: D.x + df * PIXEL_SCALE * Math.cos(angleD),
        y: D.y - Math.abs(df * PIXEL_SCALE * Math.sin(angleD))
    };
    return true;
}

function calculateTargetF() {
    // Ensure target values are properly set before calculation
    if (targetDF <= 0 || targetEF <= 0 || currentDE <= 0) {
        console.error('Invalid target values:', { targetDF, targetEF, currentDE });
        return;
    }
    
    let cosD = (targetDF * targetDF + currentDE * currentDE - targetEF * targetEF) / (2 * targetDF * currentDE);
    
    // Check if the cosine value is valid
    if (cosD < -1 || cosD > 1) {
        console.error('Invalid cosine value:', cosD);
        return;
    }
    
    let angleD = Math.acos(cosD);
    targetF = {
        x: D.x + targetDF * PIXEL_SCALE * Math.cos(angleD),
        y: D.y - Math.abs(targetDF * PIXEL_SCALE * Math.sin(angleD))
    };
    
    console.log('Target F calculated:', { targetDF, targetEF, currentDE, targetF });
}

function draw() {
    background('#ECECEC');
    // Grid is no longer drawn

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

    // Always display current angles for real-time feedback
    displayCurrentAngles();
    
    displayCheckResult();
    displayErrorMessage();
    displayCurrentMethod();
    
    // If dragging, continuously update the similarity info to show real-time values
    if (draggingF && displayAnswer) {
        displaySimilarityInfo();
    }
}

// Grid drawing function removed

// Grid snapping function removed

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

    // Method-specific display logic for both triangles
    switch (currentSimilarityMethod) {
        case 'SSS':
            // Show only side values for SSS
            for (let i = 0; i < 3; i++) {
                stroke(colors[i]);
                line(points[i].x, points[i].y, nextPoints[i].x, nextPoints[i].y);
                fill(colors[i]);
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(18);
                let sideLength = Math.round(mathSides[i]);
                if (i == 0) {
                    text(`${labels[i]}: ${sideLength}`, midpoints[i].x, midpoints[i].y + 20);
                }
                else if (i == 1) {
                    text(`${labels[i]}: ${sideLength}`, midpoints[i].x + 50, midpoints[i].y - 5);
                }
                else {
                    text(`${labels[i]}: ${sideLength}`, midpoints[i].x - 50, midpoints[i].y - 5);
                }
            }
            break;
        case 'SAS':
            // Show side values + included angle for SAS
            for (let i = 0; i < 3; i++) {
                stroke(colors[i]);
                line(points[i].x, points[i].y, nextPoints[i].x, nextPoints[i].y);
                fill(colors[i]);
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(18);
                let sideLength = Math.round(mathSides[i]);
                if (i == 0) {
                    text(`${labels[i]}: ${sideLength}`, midpoints[i].x, midpoints[i].y + 20);
                }
                else if (i == 1) {
                    text(`${labels[i]}: ${sideLength}`, midpoints[i].x + 50, midpoints[i].y - 5);
                }
                else {
                    text(`${labels[i]}: ${sideLength}`, midpoints[i].x - 50, midpoints[i].y - 5);
                }
            }
            // Show included angle at B/E
            displayTriangleAngles(p1, p2, p3, isLeft, true); // true = SAS mode
            break;
        case 'AA':
            // Show only angles for AA
            displayTriangleAngles(p1, p2, p3, isLeft, false); // false = not SAS
            break;
    }

    // Lighten vertex labels
    push();
    textSize(16);
    textAlign(CENTER, CENTER);
    fill(0, 0, 0, 120); // semi-transparent black
    textStyle(NORMAL);
    text(isLeft ? 'A' : 'D', p1.x - 15, p1.y - 10);
    text(isLeft ? 'B' : 'E', p2.x + 15, p2.y + 10);
    text(isLeft ? 'C' : 'F', p3.x, p3.y - 15);
    pop();

    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(isLeft ? 'A' : 'D', p1.x - 15, p1.y - 10);
    text(isLeft ? 'B' : 'E', p2.x + 15, p2.y + 10);
    text(isLeft ? 'C' : 'F', p3.x, p3.y - 15);
    
    // Add method-specific visual indicators
    if (isLeft) {
        drawMethodIndicators(p1, p2, p3);
    }
}

// Enhanced: displayTriangleAngles now supports SAS mode (show only included angle) and improved text placement
function displayTriangleAngles(p1, p2, p3, isLeft, sasMode = false) {
    // Calculate angles using cosine law
    let a = dist(p2.x, p2.y, p3.x, p3.y) / PIXEL_SCALE;
    let b = dist(p1.x, p1.y, p3.x, p3.y) / PIXEL_SCALE;
    let c = dist(p1.x, p1.y, p2.x, p2.y) / PIXEL_SCALE;
    let cosA = (b * b + c * c - a * a) / (2 * b * c);
    let cosB = (a * a + c * c - b * b) / (2 * a * c);
    let cosC = (a * a + b * b - c * c) / (2 * a * b);
    cosA = constrain(cosA, -1, 1);
    cosB = constrain(cosB, -1, 1);
    cosC = constrain(cosC, -1, 1);
    let angleA = Math.acos(cosA) * (180 / Math.PI);
    let angleB = Math.acos(cosB) * (180 / Math.PI);
    let angleC = Math.acos(cosC) * (180 / Math.PI);
    push();
    textSize(16);
    textAlign(CENTER, CENTER);
    strokeWeight(0);
    // Offset for angle text
    let offset = 38;
    let outline = 4;
    if (sasMode) {
        // Only show included angle (B/E)
        let bx = p2.x + 0.7 * offset;
        let by = p2.y + 0.7 * offset;
        // White outline for readability
        stroke(255);
        strokeWeight(outline);
        fill(0);
        text(`∠${isLeft ? 'B' : 'E'}: ${angleB.toFixed(1)}°`, bx, by);
        noStroke();
        fill(0);
        text(`∠${isLeft ? 'B' : 'E'}: ${angleB.toFixed(1)}°`, bx, by);
    } else {
        // Show all angles (AA mode)
        // A/D
        let ax = p1.x - offset;
        let ay = p1.y - offset;
        stroke(255);
        strokeWeight(outline);
        fill(0);
        text(`∠${isLeft ? 'A' : 'D'}: ${angleA.toFixed(1)}°`, ax, ay);
        noStroke();
        fill(0);
        text(`∠${isLeft ? 'A' : 'D'}: ${angleA.toFixed(1)}°`, ax, ay);
        // B/E
        let bx = p2.x + offset;
        let by = p2.y + offset;
        stroke(255);
        strokeWeight(outline);
        fill(0);
        text(`∠${isLeft ? 'B' : 'E'}: ${angleB.toFixed(1)}°`, bx, by);
        noStroke();
        fill(0);
        text(`∠${isLeft ? 'B' : 'E'}: ${angleB.toFixed(1)}°`, bx, by);
        // C/F
        let cx = p3.x;
        let cy = p3.y - offset - 10;
        stroke(255);
        strokeWeight(outline);
        fill(0);
        text(`∠${isLeft ? 'C' : 'F'}: ${angleC.toFixed(1)}°`, cx, cy);
        noStroke();
        fill(0);
        text(`∠${isLeft ? 'C' : 'F'}: ${angleC.toFixed(1)}°`, cx, cy);
    }
    pop();
}

function displayCurrentAngles() {
    // Calculate current angles for triangle DEF (the one being manipulated)
    let de = dist(D.x, D.y, E.x, E.y) / PIXEL_SCALE;
    let ef = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
    let df = dist(D.x, D.y, F.x, F.y) / PIXEL_SCALE;
    
    let cosD = (ef * ef + de * de - df * df) / (2 * ef * de);
    let cosE = (df * df + de * de - ef * ef) / (2 * df * de);
    let cosF = (df * df + ef * ef - de * de) / (2 * df * ef);
    
    // Ensure cosine values are within valid range
    cosD = constrain(cosD, -1, 1);
    cosE = constrain(cosE, -1, 1);
    cosF = constrain(cosF, -1, 1);
    
    let angleD = Math.acos(cosD) * (180 / Math.PI);
    let angleE = Math.acos(cosE) * (180 / Math.PI);
    let angleF = Math.acos(cosF) * (180 / Math.PI);
    
    // Display current angles in top-right corner
    push();
    fill(0);
    textSize(14);
    textAlign(LEFT, TOP);
    text(`Current DEF Angles:`, width - 200, 10);
    text(`∠D: ${angleD.toFixed(1)}°`, width - 200, 30);
    text(`∠E: ${angleE.toFixed(1)}°`, width - 200, 50);
    text(`∠F: ${angleF.toFixed(1)}°`, width - 200, 70);
    pop();
}

function drawMethodIndicators(p1, p2, p3) {
    push();
    strokeWeight(2);
    textSize(14);
    textAlign(CENTER, CENTER);
    
    switch (currentSimilarityMethod) {
        case 'SSS':
            // Highlight all sides for SSS
            stroke(255, 0, 0, 150);
            fill(255, 0, 0, 100);
            ellipse(p1.x, p1.y, 8);
            ellipse(p2.x, p2.y, 8);
            ellipse(p3.x, p3.y, 8);
            break;
            
        case 'SAS':
            // Highlight sides AB and BC, and angle at B for SAS
            stroke(255, 165, 0, 150);
            fill(255, 165, 0, 100);
            ellipse(p1.x, p1.y, 8); // A
            ellipse(p3.x, p3.y, 8); // C
            // Highlight angle at B
            stroke(255, 165, 0, 150);
            strokeWeight(3);
            let angleB = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
            if (angleB < 0) angleB += 2 * Math.PI;
            let arcRadius = 25;
            arc(p2.x, p2.y, arcRadius, arcRadius, Math.atan2(p1.y - p2.y, p1.x - p2.x), Math.atan2(p3.y - p2.y, p3.x - p2.x));
            break;
            
        case 'AA':
            // Highlight all angles for AA
            stroke(128, 0, 128, 150);
            fill(128, 0, 128, 100);
            // Draw angle arcs at each vertex
            let aaArcRadius = 20;
            // Angle at A
            let angleA = Math.atan2(p2.y - p1.y, p2.x - p1.x) - Math.atan2(p3.y - p1.y, p3.x - p1.x);
            if (angleA < 0) angleA += 2 * Math.PI;
            arc(p1.x, p1.y, aaArcRadius, aaArcRadius, Math.atan2(p3.y - p1.y, p3.x - p1.x), Math.atan2(p2.y - p1.y, p2.x - p1.x));
            // Angle at B
            let angleB2 = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
            if (angleB2 < 0) angleB2 += 2 * Math.PI;
            arc(p2.x, p2.y, aaArcRadius, aaArcRadius, Math.atan2(p1.y - p2.y, p1.x - p2.x), Math.atan2(p3.y - p2.y, p3.x - p2.x));
            // Angle at C
            let angleC = Math.atan2(p1.y - p3.y, p1.x - p3.x) - Math.atan2(p2.y - p3.y, p2.x - p3.x);
            if (angleC < 0) angleC += 2 * Math.PI;
            arc(p3.x, p3.y, aaArcRadius, aaArcRadius, Math.atan2(p2.y - p3.y, p2.x - p3.x), Math.atan2(p1.y - p3.y, p1.x - p3.x));
            break;
            

    }
    pop();
}

function drawDraggableF() {
    fill(100, 100, 255, 200);
    stroke(targetF && targetF.x === F.x && targetF.y === F.y ? color(0, 200, 0) : color(0, 0, 200));
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
        text(`(${Math.round(targetDF)}, ${Math.round(targetEF)})`, targetF.x, targetF.y);
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
        const canvasMarginPx = 10; // allow reaching near edges so long sides are possible
        let newX = constrain(mouseX + offsetF.x, canvasMarginPx, width - canvasMarginPx);
        let newY = constrain(mouseY + offsetF.y, canvasMarginPx, height - canvasMarginPx);
        
        // Force value change on every drag by using exact mouse position
        F.x = newX;
        F.y = newY;
        
        // Force redraw to show updated values immediately
        redraw();
    }
}

function mouseReleased() {
    draggingF = false;
}

function displaySimilarityInfo() {
    let de = dist(D.x, D.y, E.x, E.y) / PIXEL_SCALE;
    let ef = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
    let df = dist(D.x, D.y, F.x, F.y) / PIXEL_SCALE;

    // Display actual target values (no grid blocks) - show whole numbers
    targetDFBlocks = Math.round(targetDF);
    targetEFBlocks = Math.round(targetEF);

    // Debug logging
    console.log('Display values:', { 
        de: Math.round(de), 
        ef: Math.round(ef), 
        df: Math.round(df),
        targetEF, 
        targetDF,
        targetEFBlocks,
        targetDFBlocks
    });

    let infoHTML = '';
    
    switch (currentSimilarityMethod) {
        case 'SSS':
            infoHTML = displaySSSInfo(de, ef, df);
            break;
        case 'SAS':
            infoHTML = displaySASInfo(de, ef, df);
            break;
        case 'AA':
            infoHTML = displayAAInfo(de, ef, df);
            break;

        default:
            infoHTML = displaySSSInfo(de, ef, df);
    }

    document.getElementById('similarity-info').innerHTML = infoHTML;
}

function displaySSSInfo(de, ef, df) {
    let ratioAB_DE = (mathC / de).toFixed(2);
    let ratioBC_EF = (mathA / ef).toFixed(2);
    let ratioCA_DF = (mathB / df).toFixed(2);

    return `
        <div style="display: flex; justify-content: center; align-items: flex-end; gap: 10px;">
            <div style="text-align: center; line-height: 1;">
                <div>AB</div>
                <hr style="margin: 2px 0; border: none; border-top: 1px solid #000;">
                <div>DE</div>
            </div>
            <div>= ${ratioAB_DE}</div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="text-align: center; line-height: 1;">
                    <div>BC</div>
                    <hr style="margin: 2px 0; border: none; border-top: 1px solid #000;">
                    <div>EF</div>
                </div>
                <div style="font-size: 12px; color: #666;">Current: ${Math.round(ef)}</div>
            </div>
            <div>= ${ratioBC_EF}</div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="text-align: center; line-height: 1;">
                    <div>CA</div>
                    <hr style="margin: 2px 0; border: none; border-top: 1px solid #000;">
                    <div>DF</div>
                </div>
                <div style="font-size: 12px; color: #666;">Current: ${Math.round(df)}</div>
            </div>
            <div>= ${ratioCA_DF}</div>
        </div>

        <p>🎯 Target Ratio: <strong>${targetRatio.toFixed(2)}</strong></p>
        <p>🔧 Method: <strong>${currentSimilarityMethod}</strong> - All sides proportional</p>
        <p style="margin:0 !important; padding:0 !important; line-height: 1 !important;">🎯 Target DF: <strong>${targetDFBlocks}</strong> | Target EF: <strong>${targetEFBlocks}</strong></p>
        <p style="margin:0 !important; padding:0 !important; line-height: 1 !important; font-size: 12px; color: #666;">Current EF: ${Math.round(ef)} | Current DF: ${Math.round(df)}</p>
    `;
}

function displaySASInfo(de, ef, df) {
    let ratioAB_DE = (mathC / de).toFixed(2);
    let ratioBC_EF = (mathA / ef).toFixed(2);
    
    // Calculate the included angle at B for SAS
    let cosB = (mathA * mathA + mathC * mathC - mathB * mathB) / (2 * mathA * mathC);
    let angleB = Math.acos(cosB) * (180 / Math.PI);
    
    // Calculate current angle at E
    let cosE = (ef * ef + de * de - df * df) / (2 * ef * de);
    let angleE = Math.acos(cosE) * (180 / Math.PI);
    
    // Calculate target angle at E (should match angleB)
    let targetAngleE = angleB;

    return `
        <div style="display: flex; justify-content: center; align-items: flex-end; gap: 10px;">
            <div style="text-align: center; line-height: 1;">
                <div>AB</div>
                <hr style="margin: 2px 0; border: none; border-top: 1px solid #000;">
                <div>DE</div>
            </div>
            <div>= ${ratioAB_DE}</div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="text-align: center; line-height: 1;">
                    <div>BC</div>
                    <hr style="margin: 2px 0; border: none; border-top: 1px solid #000;">
                    <div>EF</div>
                </div>
                <div style="font-size: 12px; color: #666;">Current: ${Math.round(ef)}</div>
            </div>
            <div>= ${ratioBC_EF}</div>
        </div>
        
        <div style="text-align: center; margin: 10px 0;">
            <div style="font-size: 14px; color: #333;">Included Angle at B: <strong>${angleB.toFixed(1)}°</strong></div>
            <div style="font-size: 12px; color: #0066cc;">Target Angle at E: <strong>${targetAngleE.toFixed(1)}°</strong></div>
        </div>

        <p>🎯 Target Ratio: <strong>${targetRatio.toFixed(2)}</strong></p>
        <p>🔧 Method: <strong>${currentSimilarityMethod}</strong> - Two sides and included angle</p>
        <p style="margin:0 !important; padding:0 !important; line-height: 1 !important;">🎯 Target DF: <strong>${targetDFBlocks}</strong> | Target EF: <strong>${targetEFBlocks}</strong></p>
        <p style="margin:0 !important; padding:0 !important; line-height: 1 !important; font-size: 12px; color: #666;">Current EF: ${Math.round(ef)} | Current DF: ${Math.round(df)}</p>
    `;
}

function displayAAInfo(de, ef, df) {
    // Calculate angles for triangle ABC
    let cosA = (mathB * mathB + mathC * mathC - mathA * mathA) / (2 * mathB * mathC);
    let cosB = (mathA * mathA + mathC * mathC - mathB * mathB) / (2 * mathA * mathC);
    let cosC = (mathA * mathA + mathB * mathB - mathC * mathC) / (2 * mathA * mathB);
    let angleA = Math.acos(constrain(cosA, -1, 1)) * (180 / Math.PI);
    let angleB = Math.acos(constrain(cosB, -1, 1)) * (180 / Math.PI);
    let angleC = Math.acos(constrain(cosC, -1, 1)) * (180 / Math.PI);

    // Calculate angles for triangle DEF
    let cosD = (ef * ef + de * de - df * df) / (2 * ef * de);
    let cosE = (df * df + de * de - ef * ef) / (2 * df * de);
    let cosF = (df * df + ef * ef - de * de) / (2 * df * ef);
    let angleD = Math.acos(constrain(cosD, -1, 1)) * (180 / Math.PI);
    let angleE = Math.acos(constrain(cosE, -1, 1)) * (180 / Math.PI);
    let angleF = Math.acos(constrain(cosF, -1, 1)) * (180 / Math.PI);

    // Check if all angles match within 0.5°
    let match = Math.abs(angleA - angleD) < 0.5 && Math.abs(angleB - angleE) < 0.5 && Math.abs(angleC - angleF) < 0.5;

    return `
        <div style="text-align: center; margin: 10px 0;">
            <div style="font-size: 14px; color: #333; margin-bottom: 10px;">
                <strong>Triangle ABC Angles:</strong><br>
                ∠A: ${angleA.toFixed(1)}° | ∠B: ${angleB.toFixed(1)}° | ∠C: ${angleC.toFixed(1)}°
            </div>
            <div style="font-size: 12px; color: #0066cc; margin-top: 10px;">
                <strong>Target Angles for DEF:</strong><br>
                ∠D = ${angleD.toFixed(1)}° | ∠E = ${angleE.toFixed(1)}° | ∠F = ${angleF.toFixed(1)}°
            </div>
            ${match ? '<div style="color:green;font-weight:bold;">✓ Angles match!</div>' : ''}
        </div>

        <p>🎯 Target Ratio: <strong>${targetRatio.toFixed(2)}</strong></p>
        <p>🔧 Method: <strong>${currentSimilarityMethod}</strong> - All angles equal</p>
        <p style="margin:0 !important; padding:0 !important; line-height: 1 !important;">🎯 Target DF: <strong>${targetDFBlocks}</strong> | Target EF: <strong>${targetEFBlocks}</strong></p>
        <p style="margin:0 !important; padding:0 !important; line-height: 1 !important; font-size: 12px; color: #666;">Current EF: ${Math.round(ef)} | Current DF: ${Math.round(df)}</p>
    `;
}

function areTrianglesSimilar() {
    // Check if current F position is close enough to target F position
    if (!targetF) return false;
    
    // Calculate distance between current F and target F
    let distanceToTarget = dist(F.x, F.y, targetF.x, targetF.y);
    
    // If F is close enough to target position, triangles are similar
    // Use a tolerance based on pixel distance for smooth interaction
    let tolerance = 15; // 15 pixels tolerance for smooth snapping
    
    // For method-specific similarity checks, also verify the relevant properties
    let basicSimilarity = distanceToTarget <= tolerance;
    
    if (!basicSimilarity) return false;
    
    // Additional method-specific checks
    switch (currentSimilarityMethod) {
        case 'SSS':
            // SSS is already handled by position similarity
            return true;
            
        case 'SAS':
            // Check if the included angle is also similar
            let cosB = (mathA * mathA + mathC * mathC - mathB * mathB) / (2 * mathA * mathC);
            let angleB = Math.acos(cosB) * (180 / Math.PI);
            
            let de = dist(D.x, D.y, E.x, E.y) / PIXEL_SCALE;
            let ef = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
            let df = dist(D.x, D.y, F.x, F.y) / PIXEL_SCALE;
            let cosE = (ef * ef + de * de - df * df) / (2 * ef * de);
            let angleE = Math.acos(cosE) * (180 / Math.PI);
            
            // Check if angles are within 2 degrees
            return Math.abs(angleB - angleE) <= 2;
            
        case 'AA':
            // Check if all angles are similar
            let cosA = (mathB * mathB + mathC * mathC - mathA * mathA) / (2 * mathB * mathC);
            let cosB2 = (mathA * mathA + mathC * mathC - mathB * mathB) / (2 * mathA * mathC);
            let cosC = (mathA * mathA + mathB * mathB - mathC * mathC) / (2 * mathA * mathB);
            
            let angleA = Math.acos(cosA) * (180 / Math.PI);
            let angleB2 = Math.acos(cosB2) * (180 / Math.PI);
            let angleC = Math.acos(cosC) * (180 / Math.PI);
            
            let de2 = dist(D.x, D.y, E.x, E.y) / PIXEL_SCALE;
            let ef2 = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
            let df2 = dist(D.x, D.y, F.x, F.y) / PIXEL_SCALE;
            
            let cosD = (ef2 * ef2 + de2 * de2 - df2 * df2) / (2 * ef2 * de2);
            let cosE2 = (df2 * df2 + de2 * de2 - ef2 * ef2) / (2 * df2 * de2);
            let cosF = (df2 * df2 + ef2 * ef2 - de2 * de2) / (2 * df2 * ef2);
            
            let angleD = Math.acos(cosD) * (180 / Math.PI);
            let angleE2 = Math.acos(cosE2) * (180 / Math.PI);
            let angleF = Math.acos(cosF) * (180 / Math.PI);
            
            // Check if all angles are within 2 degrees
            return Math.abs(angleA - angleD) <= 2 && 
                   Math.abs(angleB2 - angleE2) <= 2 && 
                   Math.abs(angleC - angleF) <= 2;
                   

                   
        default:
            return true;
    }
}

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

function displayCurrentMethod() {
    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text(`Current Method: ${currentSimilarityMethod}`, 10, 30);
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
    
    // Move point F to the target position
    if (targetF) {
        F.x = targetF.x;
        F.y = targetF.y;
        redraw(); // Force redraw to show the movement
    }
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

// Function removed - no more grid snapping needed