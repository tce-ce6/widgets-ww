
// Triangle Similarity Interactive Tool - Enhanced Version
let A, B, C;
let mathA, mathB, mathC;
let D, E, F;
let targetF = null;
let draggingF = false;
let offsetF = { x: 0, y: 0 };
let leftOrigin = { x: 150, y: 220 };
let rightOrigin = { x: 550, y: 220 };
let PIXEL_SCALE = 3;
let checkResult = null;
let errorMessage = null;
let targetRatio = 1;
let targetEF = 0;
let targetDF = 0;
let currentDE = 0;
let displayAnswer = false;

// Add similarity type state
let similarityType = "SSS"; // SSS, SAS, AA
let similarityTypes = ["SSS", "SAS", "AA"];
let similarityTypeDisplay = {
    SSS: "SSS (Side-Side-Side)",
    SAS: "SAS (Side-Angle-Side)",
    AA:  "AA (Angle-Angle)"
};

// Add state for user answer and explanation
let userResult = null; // { correct: true/false, message: '', explanation: '' }

const ERROR_TOLERANCE = 0.15;
const MIN_TRIANGLE_SIDE = 10;
const MAX_TRIANGLE_SIDE = 60;
const ANGLE_ARRAY = [30, 45, 60, 75, 90];
let isActuallySimilar = true; // Track if the current triangles are actually similar


function setup() {
    let canvas = createCanvas(900, 400);
    canvas.parent("mainCanvas");


    document.getElementById("hint-btn").addEventListener("click", () => {
        document.getElementById("hint-modal").style.display = "flex";
    });
    
    document.getElementById("close-hint").addEventListener("click", () => {
        document.getElementById("hint-modal").style.display = "none";
    });
}


function generateValidTrianglePair() {
    // Step 1: Generate random triangle ABC with integer sides
    const maxAttempts = 100;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate random integer sides for triangle ABC
        mathA = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
        mathB = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
        mathC = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
        
        // Check if it forms a valid triangle
        if (!isValidTriangle(mathA, mathB, mathC)) continue;
        
        // Calculate triangle ABC coordinates
        if (!calculateTriangleABC(mathA, mathB, mathC)) continue;
        
        // Step 2: Find a valid DE that creates integer EF and DF
        const validRatios = [2, 3, 4, 5, 0.5, 0.333, 0.25, 0.2]; // Including fractions
        
        for (let ratioAttempt = 0; ratioAttempt < 50; ratioAttempt++) {
            // Try different DE values
            currentDE = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
            
            // Ensure DEF is different in shape from ABC
            if (currentDE === mathC) continue;
            
            // Calculate potential ratio
            let ratio = currentDE / mathC;
            
            // Check if this ratio would give integer sides
            let potentialEF = mathA * ratio;
            let potentialDF = mathB * ratio;
            
            // Check if EF and DF would be integers (within small tolerance)
            if (Math.abs(potentialEF - Math.round(potentialEF)) < 0.001 &&
                Math.abs(potentialDF - Math.round(potentialDF)) < 0.001) {
                
                targetEF = Math.round(potentialEF);
                targetDF = Math.round(potentialDF);
                
                // Ensure the target triangle is valid and within bounds
                if (isValidTriangle(currentDE, targetEF, targetDF) &&
                    targetEF >= MIN_TRIANGLE_SIDE && targetEF <= MAX_TRIANGLE_SIDE &&
                    targetDF >= MIN_TRIANGLE_SIDE && targetDF <= MAX_TRIANGLE_SIDE) {
                    
                    targetRatio = ratio;
                    
                }
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
    F = {
        x: D.x + df * PIXEL_SCALE * Math.cos(angleD),
        y: D.y - Math.abs(df * PIXEL_SCALE * Math.sin(angleD))
    };
    
    // Constrain F to canvas bounds with proper margins
    F.x = constrain(F.x, 50, width - 50);
    F.y = constrain(F.y, 50, height - 50);
    
    return true;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomAngle() {
    return ANGLE_ARRAY[randomInt(0, ANGLE_ARRAY.length - 1)];
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function getRandomRatio() {
    // Only integer ratios, avoid 1:1
    let ratios = [2, 3, 4, 5];
    return ratios[randomInt(0, ratios.length - 1)];
}

// --- RESET LOGIC ---
window.resetToNew = function() {
    // Randomly pick a similarity type
    similarityType = similarityTypes[Math.floor(Math.random() * similarityTypes.length)];
    // Randomly decide if triangles should be similar or not
    isActuallySimilar = Math.random() < 0.5;
    // Generate triangles according to the type
    if (similarityType === "SSS") {
        generateSSSTriangles(isActuallySimilar);
    } else if (similarityType === "SAS") {
        generateSASTriangles(isActuallySimilar);
    } else {
        generateAATriangles(isActuallySimilar);
    }
    // Re-enable buttons
    if (simBtn) simBtn.disabled = false;
    if (notSimBtn) notSimBtn.disabled = false;
    // Clear result
    userResult = null;
    redraw();
};

// --- GENERATION FUNCTIONS ---
function generateSSSTriangles(similar) {
    // Generate random triangle ABC with integer sides
    let found = false;
    let ratio = getRandomRatio();
    for (let attempt = 0; attempt < 100 && !found; attempt++) {
        mathA = randomInt(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathB = randomInt(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathC = randomInt(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        if (!isValidTriangle(mathA, mathB, mathC)) continue;
        if (!calculateTriangleABC(mathA, mathB, mathC)) continue;
        if (similar) {
            currentDE = mathA * ratio;
            targetEF = mathB * ratio;
            targetDF = mathC * ratio;
        } else {
            // Make at least one side not in the same ratio
            let wrongRatio = ratio + 1;
            currentDE = mathA * ratio;
            targetEF = mathB * wrongRatio;
            targetDF = mathC * ratio;
        }
        if (!isValidTriangle(currentDE, targetEF, targetDF)) continue;
        if (!calculateTriangleDEF(currentDE, targetEF, targetDF)) continue;
        found = true;
    }
}

function generateSASTriangles(similar) {
    // Pick two random sides and an angle for ABC
    let found = false;
    let ratio = getRandomRatio();
    for (let attempt = 0; attempt < 100 && !found; attempt++) {
        mathA = randomInt(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathB = randomInt(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE);
        mathC = randomAngle(); // Use as included angle (degrees)
        // Law of cosines to get third side for drawing
        let angleRad = mathC * Math.PI / 180;
        let sideC = Math.sqrt(mathA * mathA + mathB * mathB - 2 * mathA * mathB * Math.cos(angleRad));
        if (!isValidTriangle(mathA, mathB, sideC)) continue;
        if (!calculateTriangleABC(mathA, mathB, sideC)) continue;
        let de, ef, includedAngle;
        if (similar) {
            de = mathA * ratio;
            ef = mathB * ratio;
            includedAngle = mathC;
        } else {
            // Change angle or one side ratio
            de = mathA * ratio;
            ef = mathB * (ratio + 1);
            includedAngle = randomAngle();
            if (includedAngle === mathC) includedAngle = (includedAngle + 15) % 180;
        }
        let sideF = Math.sqrt(de * de + ef * ef - 2 * de * ef * Math.cos(includedAngle * Math.PI / 180));
        if (!isValidTriangle(de, ef, sideF)) continue;
        currentDE = de;
        targetEF = ef;
        targetDF = sideF;
        if (!calculateTriangleDEF(currentDE, targetEF, targetDF)) continue;
        // Store included angle for DEF for checking
        DEF_includedAngle = includedAngle;
        found = true;
    }
}

function generateAATriangles(similar) {
    // Pick two random angles for ABC
    let found = false;
    for (let attempt = 0; attempt < 100 && !found; attempt++) {
        let angle1 = randomAngle();
        let angle2 = randomAngle();
        if (angle1 + angle2 >= 170) continue; // keep third angle > 10
        let angle3 = 180 - angle1 - angle2;
        mathA = angle1;
        mathB = angle2;
        mathC = 50; // arbitrary side for drawing
        if (!calculateTriangleABC(mathA, mathB, mathC)) continue;
        let d1, d2;
        if (similar) {
            d1 = angle1;
            d2 = angle2;
        } else {
            // Change one angle
            d1 = angle1;
            d2 = angle2 + 15;
            if (d2 >= 170) d2 = angle2 - 15;
        }
        let d3 = 180 - d1 - d2;
        currentDE = d1;
        targetEF = d2;
        targetDF = 40; // arbitrary side for drawing
        if (!calculateTriangleDEF(currentDE, targetEF, targetDF)) continue;
        found = true;
    }
}

// --- SIMILARITY CHECK LOGIC ---
window.checkSimilarity = function(isSimilar) {
    // Prevent further clicks
    if (simBtn) simBtn.disabled = true;
    if (notSimBtn) notSimBtn.disabled = true;
    // Determine if the triangles are actually similar for the current scenario
    let actuallySimilar = isActuallySimilar;
    let explanation = '';
    if (similarityType === 'SSS') {
        // SSS: check if all three sides are in the same ratio
        let ratio1 = mathA / currentDE;
        let ratio2 = mathB / targetEF;
        let ratio3 = mathC / targetDF;
        let tol = 0.05;
        actuallySimilar = (Math.abs(ratio1 - ratio2) < tol) && (Math.abs(ratio2 - ratio3) < tol);
        explanation = actuallySimilar
            ? 'All three pairs of corresponding sides are in the same ratio, so the triangles are similar by SSS.'
            : 'The sides are not in the same ratio, so the triangles are not similar by SSS.';
    } else if (similarityType === 'SAS') {
        // SAS: two sides in same ratio and included angle equal
        let ratio1 = mathA / currentDE;
        let ratio2 = mathB / targetEF;
        let angleABC = mathC;
        let angleDEF = typeof DEF_includedAngle !== 'undefined' ? DEF_includedAngle : 60;
        let tol = 0.05;
        actuallySimilar = (Math.abs(ratio1 - ratio2) < tol) && (angleABC === angleDEF);
        explanation = actuallySimilar
            ? 'Two pairs of sides are in the same ratio and the included angle is equal, so the triangles are similar by SAS.'
            : 'Either the sides are not in the same ratio or the included angle is not equal, so the triangles are not similar by SAS.';
    } else if (similarityType === 'AA') {
        // AA: two angles equal
        let angleA_ABC = mathA, angleB_ABC = mathB;
        let angleA_DEF = currentDE, angleB_DEF = targetEF;
        actuallySimilar = (angleA_ABC === angleA_DEF) && (angleB_ABC === angleB_DEF);
        explanation = actuallySimilar
            ? 'Two pairs of corresponding angles are equal, so the triangles are similar by AA.'
            : 'The triangles do not have two pairs of equal angles, so they are not similar by AA.';
    }
    let correct = (isSimilar === actuallySimilar);
    userResult = {
        correct,
        message: correct ? 'Right!' : 'Wrong!',
        explanation
    };
    redraw();
};

// --- BUTTON HOOKS ---
window.addEventListener('DOMContentLoaded', function() {
    // Attach to buttons
    simBtn = document.getElementById('check-btn');
    notSimBtn = document.querySelectorAll('#hint-btn')[0]; // first Not Similar button
    if (simBtn) simBtn.onclick = function() { window.checkSimilarity(true); };
    if (notSimBtn) notSimBtn.onclick = function() { window.checkSimilarity(false); };
});


function draw() {
    background(220);
    // Show current theorem type
    fill(40,40,120);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Similarity Theorem: " + similarityTypeDisplay[similarityType], 20, 10);

    // Draw triangles with appropriate markings
    if (similarityType === "SSS") {
        drawTriangle(A, B, C, true, [mathC, mathA, mathB], ['AB', 'BC', 'CA'], 'SSS');
        let de = dist(D.x, D.y, E.x, E.y) / PIXEL_SCALE;
        let ef = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
        let df = dist(D.x, D.y, F.x, F.y) / PIXEL_SCALE;
        drawTriangle(D, E, F, false, [de, ef, df], ['DE', 'EF', 'DF'], 'SSS');
    } else if (similarityType === "SAS") {
        drawTriangle(A, B, C, true, [mathA, mathB, mathC], ['AB', 'BC', '∠B'], 'SAS');
        let de = dist(D.x, D.y, E.x, D.y) / PIXEL_SCALE;
        let ef = dist(E.x, E.y, F.x, F.y) / PIXEL_SCALE;
        let df = dist(D.x, D.y, F.x, F.y) / PIXEL_SCALE;
        drawTriangle(D, E, F, false, [currentDE, targetEF, 60], ['DE', 'EF', '∠E'], 'SAS');
    } else {
        drawTriangle(A, B, C, true, [45, 60, mathC], ['∠A', '∠B', ''], 'AA');
        drawTriangle(D, E, F, false, [45, 60, currentDE], ['∠D', '∠E', ''], 'AA');
    }

    // Show result message below triangles
    if (userResult) {
        fill(userResult.correct ? 'green' : 'red');
        textSize(22);
        textAlign(CENTER, TOP);
        text(userResult.message, width/2, 320);
        fill(40);
        textSize(16);
        text(userResult.explanation, width/2, 350, 700, 60);
    }
}


function drawTriangle(p1, p2, p3, isLeft, mathSides, labels, mode) {
    stroke(80);
    strokeWeight(2);
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
        if (mode === 'SSS') {
            text(`${labels[i]}: ${mathSides[i].toFixed(1)}`, midpoints[i].x, midpoints[i].y + 20);
        } else if (mode === 'SAS') {
            if (i < 2) text(`${labels[i]}: ${mathSides[i].toFixed(1)}`, midpoints[i].x, midpoints[i].y + 20);
            if (i === 2) text(`${labels[i]}: ${mathSides[i]}`, midpoints[i].x, midpoints[i].y - 20);
        } else if (mode === 'AA') {
            if (i < 2) text(`${labels[i]}: ${mathSides[i]}°`, midpoints[i].x, midpoints[i].y + 20);
        }
    }

    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(isLeft ? 'A' : 'D', p1.x - 15, p1.y - 10);
    text(isLeft ? 'B' : 'E', p2.x + 15, p2.y + 10);
    text(isLeft ? 'C' : 'F', p3.x, p3.y - 15);
}

// Call resetToNew on load
window.addEventListener('DOMContentLoaded', resetToNew);