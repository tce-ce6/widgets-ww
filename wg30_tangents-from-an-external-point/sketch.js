// Global variables
let canvas;
let circleCenter;
let circleRadius = 5; // in cm
let externalPoint;
let tangent1, tangent2;
let tangentPoint1, tangentPoint2;
let isDragging = false;
let showLengths = true;
let showTheorem = true;

// Conversion factor: 1 cm = 20 pixels (for display)
const cmToPixels = 20;

// Colors
const colors = {
    circle: [0, 0, 0],
    center: [0, 0, 255],
    externalPoint: [0, 0, 0],
    tangent1: [0, 255, 0],
    tangent2: [0, 0, 255],
    radius1: [255, 0, 0],
    radius2: [0, 255, 0],
    lineOP: [0, 0, 255],
    text: [0, 0, 0],
    lengthBox: [255, 255, 0]
};

function setup() {
    canvas = createCanvas(1200, 600);
    canvas.parent('mainCanvas');

    // Initialize positions
    circleCenter = createVector(600, 300);
    externalPoint = createVector(900, 300);

    // Calculate initial tangent points
    calculateTangentPoints();

    // Setup event listeners
    setupEventListeners();
}

function draw() {
    background(255);

    // Draw circle
    stroke(colors.circle);
    strokeWeight(2);
    noFill();
    circle(circleCenter.x, circleCenter.y, circleRadius * cmToPixels * 2);

    // Draw center point
    fill(colors.center);
    noStroke();
    circle(circleCenter.x, circleCenter.y, 8);
    fill(colors.text);
    textAlign(CENTER, CENTER);
    textSize(15);
    text('O', circleCenter.x - 15, circleCenter.y);

    // Draw line OP (center to external point)
    stroke(colors.lineOP);
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);
    line(circleCenter.x, circleCenter.y, externalPoint.x, externalPoint.y);
    drawingContext.setLineDash([]);

    // // Draw external point P
    // fill(colors.externalPoint);
    // noStroke();
    // circle(externalPoint.x, externalPoint.y, 10);
    // fill(colors.text);
    // textAlign(CENTER, CENTER);
    // textSize(15);
    // console.log(externalPoint.y);
    // console.log(externalPoint.x);
    // // text('P', externalPoint.x, externalPoint.y - 20);
    // if (externalPoint.x > 10 && externalPoint.x < 1180) {
    //     text('P', externalPoint.x, externalPoint.y + 20);
    // } else if(externalPoint.y > 10 && externalPoint.y <= 590){
    //     text('P', externalPoint.x, externalPoint.y - 40);
    // }
    // else {
    //     text('P', externalPoint.x, externalPoint.y - 20);
    // }

    // Draw external point P
    fill(colors.externalPoint);
    noStroke();
    circle(externalPoint.x, externalPoint.y, 10);

    fill(colors.text);
    textAlign(CENTER, CENTER);
    textSize(15);

    // --- Keep text fully inside canvas ---
    const label = "P";
    const tw = textWidth(label);
    const th = textAscent() + textDescent();

    let tx = externalPoint.x;
    let ty = externalPoint.y + 20;   // default below point

    // If default (below) goes out of bottom → move above
    if (ty + th / 2 > height) {
        ty = externalPoint.y - 20;
    }

    // If above goes out of top → clamp inside
    if (ty - th / 2 < 0) {
        ty = th / 2;
    }

    // Clamp horizontally so label never leaves left/right edge
    tx = constrain(tx, tw / 2, width - tw / 2);

    // Final safety clamp for vertical edges
    ty = constrain(ty, th / 2, height - th / 2);

    text(label, tx, ty);



    // Draw tangent points and lines
    if (tangentPoint1 && tangentPoint2) {
        // Draw tangent lines
        stroke(colors.tangent1);
        strokeWeight(3);
        line(externalPoint.x, externalPoint.y, tangentPoint1.x, tangentPoint1.y);

        stroke(colors.tangent2);
        strokeWeight(3);
        line(externalPoint.x, externalPoint.y, tangentPoint2.x, tangentPoint2.y);

        // Draw tangent points
        fill(colors.externalPoint);
        noStroke();
        circle(tangentPoint1.x, tangentPoint1.y, 8);
        circle(tangentPoint2.x, tangentPoint2.y, 8);

        // Draw tangent point labels
        fill(colors.text);
        textAlign(CENTER, CENTER);
        textSize(20);
        text('T₁', tangentPoint1.x, tangentPoint1.y - 15);
        text('T₂', tangentPoint2.x, tangentPoint2.y + 15);

        // Draw radii to tangent points
        stroke(colors.radius1);
        strokeWeight(1);
        drawingContext.setLineDash([3, 3]);
        line(circleCenter.x, circleCenter.y, tangentPoint1.x, tangentPoint1.y);

        stroke(colors.radius2);
        line(circleCenter.x, circleCenter.y, tangentPoint2.x, tangentPoint2.y);
        drawingContext.setLineDash([]);

        // Draw right angle indicators
        drawRightAngle(tangentPoint1, circleCenter, externalPoint, colors.radius1);
        drawRightAngle(tangentPoint2, circleCenter, externalPoint, colors.radius2);

        // Draw length labels if enabled
        if (showLengths) {
            drawLengthLabels();
        }
    }

    // Update UI
    updateUI();
}

function calculateTangentPoints() {
    // Vector from center to external point
    let OP = p5.Vector.sub(externalPoint, circleCenter);
    let distance = OP.mag();

    // Convert radius to pixels for calculations
    let radiusPixels = circleRadius * cmToPixels;

    // Check if point is outside circle
    if (distance > radiusPixels) {
        // Calculate angle of OP
        let angleOP = atan2(OP.y, OP.x);

        // Calculate angle between OP and tangent
        let tangentAngle = acos(radiusPixels / distance);

        // Calculate angles for both tangent points
        let angle1 = angleOP - tangentAngle;
        let angle2 = angleOP + tangentAngle;

        // Calculate tangent points
        tangentPoint1 = createVector(
            circleCenter.x + radiusPixels * cos(angle1),
            circleCenter.y + radiusPixels * sin(angle1)
        );

        tangentPoint2 = createVector(
            circleCenter.x + radiusPixels * cos(angle2),
            circleCenter.y + radiusPixels * sin(angle2)
        );
    } else {
        tangentPoint1 = null;
        tangentPoint2 = null;
    }
}

function drawRightAngle(point, center, external, color) {
    let radiusSize = 12; // Controls the size of the right-angle mark

    // 1. Calculate Radius Direction (from center to point)
    let radiusDirX = point.x - center.x;
    let radiusDirY = point.y - center.y;
    let radiusAngle = atan2(radiusDirY, radiusDirX);

    // 2. Calculate Tangent Direction (from point to external)
    let T_x = external.x - point.x;
    let T_y = external.y - point.y;
    let T_mag = sqrt(T_x * T_x + T_y * T_y);

    // Normalize and scale the tangent vector to radiusSize
    T_x = T_x / T_mag * radiusSize;
    T_y = T_y / T_mag * radiusSize;

    // --- Calculate the Three Critical Points ---

    // V1: Point on the RADIUS line (Inward)
    let V1_x = point.x - radiusSize * cos(radiusAngle);
    let V1_y = point.y - radiusSize * sin(radiusAngle);

    // V2: Point on the TANGENT line (Outward towards external point)
    let V2_x = point.x + T_x;
    let V2_y = point.y + T_y;

    // CORNER: The corner of the square (Vector sum of the inward radius 
    // and the outward tangent segments, relative to the tangent point 'point')
    let corner_x = V1_x + T_x;
    let corner_y = V1_y + T_y;

    // --- Draw the Right Angle Marker ---

    stroke(color);
    strokeWeight(2);
    noFill();

    // Draw the two segments that form the right angle symbol:

    // Segment 1: From the point on the radius (V1) to the corner
    line(V1_x, V1_y, corner_x, corner_y);

    // Segment 2: From the corner to the point on the tangent (V2)
    line(corner_x, corner_y, V2_x, V2_y);
}

function drawLengthLabels() {
    if (tangentPoint1 && tangentPoint2) {
        let length1Pixels = dist(externalPoint.x, externalPoint.y, tangentPoint1.x, tangentPoint1.y);
        let length2Pixels = dist(externalPoint.x, externalPoint.y, tangentPoint2.x, tangentPoint2.y);

        // Convert pixels to cm
        let length1 = length1Pixels / cmToPixels;
        let length2 = length2Pixels / cmToPixels;

        // Draw length boxes
        fill(colors.lengthBox);
        stroke(colors.text);
        strokeWeight(1);

        // Midpoint of tangent 1
        let mid1 = createVector(
            (externalPoint.x + tangentPoint1.x) / 2,
            (externalPoint.y + tangentPoint1.y) / 2
        );

        // Midpoint of tangent 2
        let mid2 = createVector(
            (externalPoint.x + tangentPoint2.x) / 2,
            (externalPoint.y + tangentPoint2.y) / 2
        );

        // Draw boxes and text
        let boxWidth = 60;
        let boxHeight = 20;

        rect(mid1.x - boxWidth / 2, mid1.y - boxHeight / 2, boxWidth, boxHeight);
        rect(mid2.x - boxWidth / 2, mid2.y - boxHeight / 2, boxWidth, boxHeight);

        fill(colors.text);
        textAlign(CENTER, CENTER);
        textSize(15);
        text(nf(length1, 0, 1) + ' cm', mid1.x, mid1.y);
        text(nf(length2, 0, 1) + ' cm', mid2.x, mid2.y);
    }
}

function mousePressed() {
    // Check if mouse is near external point P
    if (dist(mouseX, mouseY, externalPoint.x, externalPoint.y) < 20) {
        isDragging = true;
    }
}

function mouseDragged() {
    if (isDragging) {
        // Update external point position with canvas bounds restriction
        externalPoint.x = constrain(mouseX, 10, 1190);
        externalPoint.y = constrain(mouseY, 10, 590);

        // Recalculate tangent points
        calculateTangentPoints();
    }
}

function mouseReleased() {
    isDragging = false;
}

function setupEventListeners() {
    // Radius slider
    const radiusSlider = document.getElementById('radius-slider');
    const radiusValue = document.getElementById('radius-value');

    radiusSlider.addEventListener('input', function () {
        circleRadius = parseFloat(this.value);
        radiusValue.textContent = circleRadius.toFixed(1) + ' cm';
        calculateTangentPoints();
    });

    // Show lengths toggle
    const showLengthsToggle = document.getElementById('show-lengths');
    showLengthsToggle.addEventListener('change', function () {
        showLengths = this.checked;
        const lengthInfo = document.getElementById('length-info');
        lengthInfo.style.display = showLengths ? 'block' : 'none';
    });

    // Show theorem toggle
    const showTheoremToggle = document.getElementById('show-theorem');
    showTheoremToggle.addEventListener('change', function () {
        showTheorem = this.checked;
        const theoremInfo = document.getElementById('theorem-info');
        theoremInfo.style.display = showTheorem ? 'block' : 'none';
    });

    // Help button
    const helpButton = document.getElementById('help-button');
    helpButton.addEventListener('click', function () {
        document.getElementById('instructions').style.display = 'block';
        helpButton.disabled = true;
    });

    const closeIns = document.getElementById('close-ins');
    closeIns.addEventListener('click', () => {
        document.getElementById('instructions').style.display = 'none';
        helpButton.disabled = false;
    })
}

function updateUI() {
    // Update tangent length display
    if (tangentPoint1 && tangentPoint2) {
        let lengthPixels = dist(externalPoint.x, externalPoint.y, tangentPoint1.x, tangentPoint1.y);
        let lengthCm = lengthPixels / cmToPixels;
        document.getElementById('tangent-length').textContent = nf(lengthCm, 0, 1);
    } else {
        document.getElementById('tangent-length').textContent = '0.0';
    }
}
