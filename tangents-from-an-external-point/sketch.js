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
    text('O', circleCenter.x, circleCenter.y - 20);
    
    // Draw line OP (center to external point)
    stroke(colors.lineOP);
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);
    line(circleCenter.x, circleCenter.y, externalPoint.x, externalPoint.y);
    drawingContext.setLineDash([]);
    
    // Draw external point P
    fill(colors.externalPoint);
    noStroke();
    circle(externalPoint.x, externalPoint.y, 10);
    fill(colors.text);
    textAlign(CENTER, CENTER);
    textSize(15);
    text('P', externalPoint.x, externalPoint.y - 20);
    
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
    let radius = 12;
    
    // Calculate the direction from center to tangent point (radius direction)
    let radiusAngle = atan2(point.y - center.y, point.x - center.x);
    
    // Calculate the direction from tangent point to external point (tangent direction)
    let tangentAngle = atan2(external.y - point.y, external.x - point.x);
    
    // Create the right angle square inside the circle
    stroke(color);
    strokeWeight(2);
    noFill();
    
    // Calculate the two adjacent sides of the right angle square
    // Side 1: along the radius direction (towards center)
    let side1End = createVector(
        point.x - radius * cos(radiusAngle),
        point.y - radius * sin(radiusAngle)
    );
    
    // Side 2: along the tangent direction (towards external point)
    let side2End = createVector(
        point.x + radius * cos(tangentAngle),
        point.y + radius * sin(tangentAngle)
    );
    
    // Draw the right angle square
    beginShape();
    vertex(point.x, point.y); // Corner at tangent point
    vertex(side1End.x, side1End.y); // Along radius
    vertex(side1End.x + side2End.x - point.x, side1End.y + side2End.y - point.y); // Corner
    vertex(side2End.x, side2End.y); // Along tangent
    endShape(CLOSE);
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
        
        rect(mid1.x - boxWidth/2, mid1.y - boxHeight/2, boxWidth, boxHeight);
        rect(mid2.x - boxWidth/2, mid2.y - boxHeight/2, boxWidth, boxHeight);
        
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
    
    radiusSlider.addEventListener('input', function() {
        circleRadius = parseFloat(this.value);
        radiusValue.textContent = circleRadius.toFixed(1) + ' cm';
        calculateTangentPoints();
    });
    
    // Show lengths toggle
    const showLengthsToggle = document.getElementById('show-lengths');
    showLengthsToggle.addEventListener('change', function() {
        showLengths = this.checked;
        const lengthInfo = document.getElementById('length-info');
        lengthInfo.style.display = showLengths ? 'block' : 'none';
    });
    
    // Show theorem toggle
    const showTheoremToggle = document.getElementById('show-theorem');
    showTheoremToggle.addEventListener('change', function() {
        showTheorem = this.checked;
        const theoremInfo = document.getElementById('theorem-info');
        theoremInfo.style.display = showTheorem ? 'block' : 'none';
    });
    
    // Help button
    const helpButton = document.getElementById('help-button');
    helpButton.addEventListener('click', function() {
        document.getElementById('instructions').style.display = 'block';
        helpButton.disabled = true;
    });

    const closeIns = document.getElementById('close-ins');
    closeIns.addEventListener('click',() => {
        document.getElementById('instructions').style.display = 'none';
        helpButton.disabled = false;
    } )
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
