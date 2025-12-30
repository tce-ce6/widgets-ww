let canvas;
let currentTool = 'segment';
let showAngles = false;
let lines = [];
let points = [];
let selectedPoint = null;
let selectedLine = null;
let isDrawing = false;
let startPoint = null;
let tempLine = null;
let draggedPoint = null;
let parallelSourceLine = null;
let lineLabelIndex = 0;
let transversalLabelIndex = 1;
const lineLabels = 'abcdefghijklmnopqrstuvwxyz';
// Store transversal steps
let transversalSteps = []; // [{transversal, steps: [..], perpendiculars: [], parallel: [a, b] or null}]
let labelPositions = [];
const labelOverrides = {
    't': 't1',
    'c': 'q1',
    'd': 'q2'
};

class Point {
    constructor(x, y) {
        this.x = Math.round(x / 20) * 20;
        this.y = Math.round(y / 20) * 20;
        this.radius = 6;
        this.color = '#007bff';
        this.isDragging = false;
        this.id = Date.now() + Math.random();
    }

    draw() {
        fill(this.color);
        stroke(255);
        strokeWeight(2);
        ellipse(this.x, this.y, this.radius * 2);
    }

    contains(x, y) {
        return dist(x, y, this.x, this.y) < this.radius + 5;
    }

    update(x, y) {
        this.x = Math.round(x / 20) * 20;
        this.y = Math.round(y / 20) * 20;
    }
}

class Line {
    constructor(p1, p2, type = 'segment', color = '#333', label = null) {
        this.p1 = p1;
        this.p2 = p2;
        this.type = type;
        this.color = color;
        this.thickness = 2;
        this.id = Date.now() + Math.random();
        this.label = label;
        this.isPerpendicularTo = null;
        this.isParallelTo = null; // Added for tracking parallel dependencies
        this.baseParam = 0.5;
        this.centerPoint = null; // for parallel lines
    }

    draw(index) {
        stroke(this.color);
        strokeWeight(this.thickness);
        
        if (this.type === 'segment' || this.type === 'parallel') {
            line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        } else if (this.type === 'perpendicular') {
            const baseLine = this.isPerpendicularTo;
            if (!baseLine) return;

            const baseLineLength = dist(baseLine.p1.x, baseLine.p1.y, baseLine.p2.x, baseLine.p2.y);
            const extension = baseLineLength / 4; 

            const center = this.p1;
            const dirVec = createVector(this.p2.x - this.p1.x, this.p2.y - this.p1.y).normalize();

            const x1 = center.x - dirVec.x * extension;
            const y1 = center.y - dirVec.y * extension;
            const x2 = center.x + dirVec.x * extension;
            const y2 = center.y + dirVec.y * extension;
            
            line(x1, y1, x2, y2);
        }
        
        if (this.label && labelPositions[index]) {
            const displayLabel = labelOverrides[this.label] || this.label;
            const pos = labelPositions[index];
            push();
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(18);
            text(displayLabel, pos.x, pos.y);
            pop();
        }
    }

    getPointOnLine(x, y) {
        let p1_calc = this.p1;
        let p2_calc = this.p2;
        
        let A = x - p1_calc.x;
        let B = y - p1_calc.y;
        let C = p2_calc.x - p1_calc.x;
        let D = p2_calc.y - p1_calc.y;

        let dot = A * C + B * D;
        let lenSq = C * C + D * D;
        let param = lenSq !== 0 ? dot / lenSq : -1;

        let xx, yy;
        if (param < 0) {
            xx = p1_calc.x;
            yy = p1_calc.y;
        } else if (param > 1) {
            xx = p2_calc.x;
            yy = p2_calc.y;
        } else {
            xx = p1_calc.x + param * C;
            yy = p1_calc.y + param * D;
        }

        return new Point(xx, yy);
    }

    distanceToPoint(x, y) {
        let p1_calc = this.p1;
        let p2_calc = this.p2;

        let A = x - p1_calc.x;
        let B = y - p1_calc.y;
        let C = p2_calc.x - p1_calc.x;
        let D = p2_calc.y - p1_calc.y;

        let dot = A * C + B * D;
        let lenSq = C * C + D * D;
        let param = lenSq !== 0 ? dot / lenSq : -1;

        let xx, yy;
        if (param < 0) {
            xx = p1_calc.x;
            yy = p1_calc.y;
        } else if (param > 1) {
            xx = p2_calc.x;
            yy = p2_calc.y;
        } else {
            xx = p1_calc.x + param * C;
            yy = p1_calc.y + param * D;
        }

        return Math.sqrt((x - xx) * (x - xx) + (y - yy) * (y - yy));
    }

    getAngle() {
        return Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);
    }

    getDirection() {
        let dx = this.p2.x - this.p1.x;
        let dy = this.p2.y - this.p1.y;
        let length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) return { x: 1, y: 0 };
        return { x: dx / length, y: dy / length };
    }
}

function updateButtonStates() {
    const hasLines = lines.length > 0;
    const perpendicularBtn = document.getElementById('perpendicularTool');
    const parallelBtn = document.getElementById('parallelTool');
    
    if (perpendicularBtn) {
        perpendicularBtn.disabled = !hasLines;
        if (!hasLines && currentTool === 'perpendicular') {
            setTool('segment');
        }
    }
    
    if (parallelBtn) {
        parallelBtn.disabled = !hasLines;
        if (!hasLines && currentTool === 'parallel') {
            setTool('segment');
        }
    }
}

function setup() {
    canvas = createCanvas(800, 500);
    canvas.parent('sketch-container');
    
    document.getElementById('segmentTool').addEventListener('click', () => setTool('segment'));
    document.getElementById('perpendicularTool').addEventListener('click', () => setTool('perpendicular'));
    document.getElementById('parallelTool').addEventListener('click', () => setTool('parallel'));
    document.getElementById('clearAll').addEventListener('click', clearAll);
    document.getElementById('showAngles').addEventListener('change', (e) => {
        showAngles = e.target.checked;
    });
    
    updateButtonStates();
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 's' || e.key === 'S') setTool('segment');
        else if ((e.key === 'p' || e.key === 'P') && lines.length > 0) setTool('perpendicular');
        else if ((e.key === 'l' || e.key === 'L') && lines.length > 0) setTool('parallel');
        else if (e.key === 'c' || e.key === 'C') clearAll();
    });
}

function draw() {
    background(240);
    
    drawDotPaper();
    
    calculateLabelPositions();

    for (let i = 0; i < lines.length; i++) {
        lines[i].draw(i);
    }
    
    if (tempLine) {
        tempLine.draw();
    }
    
    for (let point of points) {
        point.draw();
    }
    
    if (showAngles) {
        drawAngles();
    }
    
    drawToolOverlay();
    drawParallelProofs();
}

function calculateLabelPositions() {
    labelPositions = [];
    const labelCache = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.label) {
            labelPositions[i] = null;
            continue;
        }

        const displayLabel = labelOverrides[line.label] || line.label;
        if (!labelCache[displayLabel]) {
            textSize(18);
            labelCache[displayLabel] = {
                w: textWidth(displayLabel),
                h: 18
            };
        }
        const { w, h } = labelCache[displayLabel];

        let bestPos = findBestPositionForLabel(line, i, w, h);
        labelPositions[i] = bestPos;
    }
}

function findBestPositionForLabel(currentLine, currentIndex, labelW, labelH) {
    let mx = (currentLine.p1.x + currentLine.p2.x) / 2;
    let my = (currentLine.p1.y + currentLine.p2.y) / 2;

    let dir = currentLine.getDirection();
    let normal = { x: -dir.y, y: dir.x }; 

    let offset = 20;
    const increment = 5;
    const maxOffset = 100;

    while (offset < maxOffset) {
        // Position 1: along normal
        let pos1 = { x: mx + normal.x * offset, y: my + normal.y * offset };
        if (isPositionSafe(pos1.x, pos1.y, currentIndex, labelW, labelH)) {
            return pos1;
        }

        // Position 2: against normal
        let pos2 = { x: mx - normal.x * offset, y: my - normal.y * offset };
        if (isPositionSafe(pos2.x, pos2.y, currentIndex, labelW, labelH)) {
            return pos2;
        }
        offset += increment;
    }
    
    return { x: mx + normal.x * 20, y: my + normal.y * 20 }; // Fallback
}

function isPositionSafe(x, y, currentIndex, labelW, labelH) {
    const safetyMarginLine = 15;
    const safetyMarginLabel = 10;

    const newLabelBox = {
        left: x - labelW / 2, right: x + labelW / 2,
        top: y - labelH / 2, bottom: y + labelH / 2
    };

    // Check against all lines
    for (const line of lines) {
        if (line.distanceToPoint(x, y) < safetyMarginLine) {
            return false;
        }
    }

    // Check against previously placed labels
    for (let i = 0; i < currentIndex; i++) {
        if (labelPositions[i]) {
            const existingPos = labelPositions[i];
            const existingLabel = labelOverrides[lines[i].label] || lines[i].label;
            const existingW = textWidth(existingLabel);
            const existingH = 18;

            const existingLabelBox = {
                left: existingPos.x - existingW / 2, right: existingPos.x + existingW / 2,
                top: existingPos.y - existingH / 2, bottom: existingPos.y + existingH / 2
            };

            if (newLabelBox.left < existingLabelBox.right + safetyMarginLabel &&
                newLabelBox.right > existingLabelBox.left - safetyMarginLabel &&
                newLabelBox.top < existingLabelBox.bottom + safetyMarginLabel &&
                newLabelBox.bottom > existingLabelBox.top - safetyMarginLabel) {
                return false;
            }
        }
    }
    return true;
}


function drawDotPaper() {
    stroke(200);
    strokeWeight(1);
    fill(180);
    
    let spacing = 20;
    for (let x = spacing; x < width; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
            ellipse(x, y, 2);
        }
    }
}

function drawAngles() {
    // Hide angle annotations while dragging to prevent lag/misalignment
    if (draggedPoint) {
        return;
    }

    let processedIntersections = new Set();

    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            const line1 = lines[i];
            const line2 = lines[j];
            let intersection = getLineIntersection(line1, line2);

            if (intersection) {
                const intersectionKey = `${intersection.x.toFixed(2)},${intersection.y.toFixed(2)}`;
                if (processedIntersections.has(intersectionKey)) continue;
                processedIntersections.add(intersectionKey);

                const angle = getAngleBetweenLines(line1, line2);
                const angleDeg = Math.abs(angle * 180 / PI);

                if (angleDeg < 5 || angleDeg > 175) continue;

                if (Math.abs(angleDeg - 90) < 5) {
                    push();
                    stroke(0, 150, 0);
                    strokeWeight(2);
                    noFill();

                    const size = 15;
                    const ix = intersection.x;
                    const iy = intersection.y;
                    
                    let dir1 = createVector(line1.p2.x - line1.p1.x, line1.p2.y - line1.p1.y).normalize();
                    let dir2 = createVector(line2.p2.x - line2.p1.x, line2.p2.y - line2.p1.y).normalize();
                    
                    let dot = p5.Vector.dot(dir1, dir2);
                    if (dot < 0) {
                       dir2.mult(-1);
                    }
                    if (dir1.cross(dir2).z < 0) {
                        [dir1, dir2] = [dir2, dir1];
                    }

                    const v1 = dir1.mult(size);
                    const v2 = dir2.mult(size);
                    
                    const p1 = createVector(ix + v1.x, iy + v1.y);
                    const p2 = createVector(ix + v2.x, iy + v2.y);
                    const p3 = createVector(ix + v1.x + v2.x, iy + v1.y + v2.y);

                    line(p1.x, p1.y, p3.x, p3.y);
                    line(p2.x, p2.y, p3.x, p3.y);
                    
                    fill(0, 150, 0);
                    noStroke();
                    textAlign(CENTER, CENTER);
                    textSize(12);
                    
                    const padding = 10;
                    const bisector = v1.copy().add(v2).normalize();
                    const textX = p3.x + bisector.x * padding;
                    const textY = p3.y + bisector.y * padding;
                    
                    text('90°', textX, textY);
                    pop();
                } else {
                    const radius = 30;
                    let angle1 = line1.getAngle();
                    let angle2 = line2.getAngle();
                    
                    let angleDiff = angle2 - angle1;
                    while (angleDiff > PI) angleDiff -= TWO_PI;
                    while (angleDiff < -PI) angleDiff += TWO_PI;
                    
                    const startAngle = angle1;
                    const endAngle = angle1 + angleDiff;
                    
                    stroke(255, 100, 100);
                    strokeWeight(2);
                    noFill();
                    arc(intersection.x, intersection.y, radius * 2, radius * 2, min(startAngle, endAngle), max(startAngle, endAngle));

                    fill(255, 100, 100);
                    noStroke();
                    textAlign(CENTER, CENTER);
                    textSize(12);

                    let textAngle = (startAngle + endAngle) / 2;
                    let textX = intersection.x + cos(textAngle) * (radius + 10);
                    let textY = intersection.y + sin(textAngle) * (radius + 10);
                    text(Math.round(angleDeg) + '°', textX, textY);
                }
            }
        }
    }
}

function drawToolOverlay() {
    fill(255, 255, 255, 200);
    noStroke();
    rect(10, 10, 150, 30, 5);
    
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(14);
    text('Tool: ' + currentTool, 20, 25);
    
    let instruction = '';

    if (draggedPoint) {
        instruction = ''; 
    } else {
        switch(currentTool) {
            case 'segment':
                instruction = 'Click points or drag to draw line segments';
                break;
            case 'perpendicular':
                instruction = lines.length === 0 ? 'Draw a line first!' : 'Click on a line or point to create perpendicular';
                break;
            case 'parallel':
                instruction = lines.length === 0 ? 'Draw a line first!' : 'Click anywhere on the canvas to create a parallel line';
                break;
        }
    }
    
    fill(255, 255, 255, 200);
    rect(10, height - 40, 400, 30, 5);
    fill(0);
    text(instruction, 20, height - 25);
}

function mousePressed() {
    draggedPoint = null;
    for (let point of points) {
        if (point.contains(mouseX, mouseY)) {
            draggedPoint = point;
            point.isDragging = true;
            if (currentTool === 'segment' && !isDrawing) {
                const segmentLines = lines.filter(line => line.type === 'segment');
                if (segmentLines.length >= 2) {
                    return;
                }
                startPoint = point;
                isDrawing = true;
            }
            return;
        }
    }
    
    switch(currentTool) {
        case 'segment':
            startDrawingSegment();
            break;
        case 'perpendicular':
            if (lines.length > 0) {
                createPerpendicular();
            }
            break;
        case 'parallel':
            if (lines.length > 0) {
                createParallel();
            }
            break;
    }
}

function mouseDragged() {
    if (draggedPoint) {
        draggedPoint.update(mouseX, mouseY);

        for (let i = 0; i < lines.length; i++) {
            for (const line of lines) {
                if (line.type === 'parallel' && line.isParallelTo) {
                    const source = line.isParallelTo;
                    const center = line.centerPoint;
                    const dx = source.p2.x - source.p1.x;
                    const dy = source.p2.y - source.p1.y;

                    line.p1.x = center.x - dx / 2;
                    line.p1.y = center.y - dy / 2;
                    line.p2.x = center.x + dx / 2;
                    line.p2.y = center.y + dy / 2;
                } else if (line.type === 'parallel' && line.centerPoint === draggedPoint) {
                    const center = line.centerPoint;
                    const dx_half = (line.p2.x - line.p1.x) / 2;
                    const dy_half = (line.p2.y - line.p1.y) / 2;
                    line.p1.x = center.x - dx_half;
                    line.p1.y = center.y - dy_half;
                    line.p2.x = center.x + dx_half;
                    line.p2.y = center.y + dy_half;
                } else if (line.type === 'perpendicular' && line.isPerpendicularTo) {
                    const baseLine = line.isPerpendicularTo;
                    const pointOnLine = line.p1;
                    
                    if (pointOnLine === draggedPoint) {
                        const newPos = baseLine.getPointOnLine(draggedPoint.x, draggedPoint.y);
                        draggedPoint.x = newPos.x;
                        draggedPoint.y = newPos.y;
                        
                        let p1 = baseLine.p1, p2 = baseLine.p2;
                        let C = p2.x - p1.x, D = p2.y - p1.y;
                        let dot = (draggedPoint.x - p1.x) * C + (draggedPoint.y - p1.y) * D;
                        let lenSq = C * C + D * D;
                        line.baseParam = lenSq > 0 ? constrain(dot / lenSq, 0, 1) : 0;
                    } 
                    else if (baseLine.p1 === draggedPoint || baseLine.p2 === draggedPoint) {
                        let p1 = baseLine.p1, p2 = baseLine.p2;
                        pointOnLine.x = p1.x + line.baseParam * (p2.x - p1.x);
                        pointOnLine.y = p1.y + line.baseParam * (p2.y - p1.y);
                    }

                    let dir = baseLine.getDirection();
                    const standardLength = 40;
                    line.p2.x = pointOnLine.x - dir.y * standardLength;
                    line.p2.y = pointOnLine.y + dir.x * standardLength;
                }
            }
        }
    } else if (currentTool === 'segment' && isDrawing && startPoint && !startPoint.isDragging) {
        updateTempLine();
    }
}


function mouseReleased() {
    if (draggedPoint) {
        draggedPoint.isDragging = false;
        if (currentTool === 'segment' && isDrawing && startPoint && draggedPoint !== startPoint) {
            finishDrawingSegment(draggedPoint);
        }
        draggedPoint = null;
    } else if (currentTool === 'segment' && isDrawing) {
        finishDrawingSegment();
    }
}

function startDrawingSegment() {
    const segmentLines = lines.filter(line => line.type === 'segment');
    if (segmentLines.length >= 2) {
        isDrawing = false;
        return;
    }
    isDrawing = true;
    startPoint = new Point(mouseX, mouseY);
    points.push(startPoint);
}

function updateTempLine() {
    if (startPoint) {
        let endPoint = new Point(mouseX, mouseY);
        tempLine = new Line(startPoint, endPoint, 'segment');
    }
}

function finishDrawingSegment(endPoint = null) {
    if (startPoint && (tempLine || endPoint)) {
        let finalEndPoint = endPoint || new Point(mouseX, mouseY);
        if (startPoint.x !== finalEndPoint.x || startPoint.y !== finalEndPoint.y) {
            if (!endPoint) {
                points.push(finalEndPoint);
            }
            let label = lineLabels[lineLabelIndex];
            lineLabelIndex++;
            lines.push(new Line(startPoint, finalEndPoint, 'segment', '#333', label));
            updateButtonStates();
        }
        startPoint = null;
        tempLine = null;
        isDrawing = false;
    }
}

function createPerpendicular() {
    const perpendicularLines = lines.filter(line => line.type === 'perpendicular');
    if (perpendicularLines.length >= 2) {
        return;
    }

    let clickedPoint = null;
    let closestLine = null;
    let minDistance = Infinity;

    for (let point of points) {
        if (point.contains(mouseX, mouseY)) {
            clickedPoint = point;
            break;
        }
    }

    for (let line of lines) {
        let distance = line.distanceToPoint(mouseX, mouseY);
        if (distance < minDistance && distance < 20) {
            minDistance = distance;
            closestLine = line;
        }
    }

    if (closestLine) {
        let pointOnLine;
        let param;

        let p1 = closestLine.p1;
        let p2 = closestLine.p2;
        let C = p2.x - p1.x;
        let D = p2.y - p1.y;
        let lenSq = C * C + D * D;

        if (clickedPoint) {
            pointOnLine = clickedPoint;
            let dot = (clickedPoint.x - p1.x) * C + (clickedPoint.y - p1.y) * D;
            param = lenSq > 0 ? dot / lenSq : 0;
        } else {
            let dot = (mouseX - p1.x) * C + (mouseY - p1.y) * D;
            param = lenSq > 0 ? dot / lenSq : 0;
            pointOnLine = new Point(p1.x + param * C, p1.y + param * D);
            points.push(pointOnLine);
        }
        param = constrain(param, 0, 1);
        
        let dir = closestLine.getDirection();
        const standardLength = 40;
        let endPoint = new Point(pointOnLine.x - dir.y * standardLength, pointOnLine.y + dir.x * standardLength);
        
        let tLabel = 't';
        if (transversalLabelIndex > 1) tLabel = 't' + transversalLabelIndex;
        transversalLabelIndex++;
        let perpLine = new Line(pointOnLine, endPoint, 'perpendicular', '#ff6b6b', tLabel);
        
        perpLine.isPerpendicularTo = closestLine;
        perpLine.baseParam = param;
        
        lines.push(perpLine);

        let stepObj = transversalSteps.find(t => t.transversal === tLabel);
        if (!stepObj) {
            stepObj = { transversal: tLabel, steps: [], perpendiculars: [], parallel: null };
            transversalSteps.push(stepObj);
        }
        stepObj.perpendiculars.push(closestLine.label);
        stepObj.steps.push(`${tLabel} ⟂ ${closestLine.label}`);
    }
}


function createParallel() {
    const parallelLines = lines.filter(line => line.type === 'parallel');
    if (parallelLines.length >= 2) {
        return;
    }

    let closestLine = null;
    let minDistance = Infinity;

    // Find the nearest segment line to the mouse click
    let segmentLines = lines.filter(line => line.type === 'segment');
    for (let line of segmentLines) {
        let distance = line.distanceToPoint(mouseX, mouseY);
        if (distance < minDistance) {
            minDistance = distance;
            closestLine = line;
        }
    }

    if (closestLine) {
        parallelSourceLine = closestLine;
        let centerPoint = new Point(mouseX, mouseY);
        points.push(centerPoint);

        // Get direction from the selected segment line
        const sourceLength = dist(parallelSourceLine.p1.x, parallelSourceLine.p1.y, parallelSourceLine.p2.x, parallelSourceLine.p2.y);
        const dir = parallelSourceLine.getDirection();
        const halfLength = sourceLength / 2;

        const p1 = new Point(centerPoint.x - dir.x * halfLength, centerPoint.y - dir.y * halfLength);
        const p2 = new Point(centerPoint.x + dir.x * halfLength, centerPoint.y + dir.y * halfLength);

        let label = lineLabels[lineLabelIndex++];
        let parallelLine = new Line(p1, p2, 'parallel', '#4ecdc4', label);
        parallelLine.centerPoint = centerPoint;
        parallelLine.isParallelTo = parallelSourceLine;
        lines.push(parallelLine);

        transversalSteps.push({
            transversal: null,
            steps: [`${label} ∥ ${parallelSourceLine.label} (by construction)`],
            perpendiculars: [],
            parallel: [label, parallelSourceLine.label]
        });

        updateButtonStates();
    }
}

function getOriginalLineColor(line) {
    switch(line.type) {
        case 'segment': return '#333';
        case 'perpendicular': return '#ff6b6b';
        case 'parallel': return '#4ecdc4';
        default: return '#333';
    }
}

function getLineIntersection(line1, line2) {
    const x1 = line1.p1.x, y1 = line1.p1.y;
    const x2 = line1.p2.x, y2 = line1.p2.y;
    const x3 = line2.p1.x, y3 = line2.p1.y;
    const x4 = line2.p2.x, y4 = line2.p2.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (den === 0) {
        return null;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    const onLine1 = t >= 0 && t <= 1;
    const onLine2 = u >= 0 && u <= 1;

    if (onLine1 && onLine2) {
        const p = new Point(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
        return p;
    }

    return null;
}


function getExtendedLineCoords(line) {
    if (line.type === 'segment') {
        return {
            x1: line.p1.x,
            y1: line.p1.y,
            x2: line.p2.x,
            y2: line.p2.y
        };
    } else {
        let dx = line.p2.x - line.p1.x;
        let dy = line.p2.y - line.p1.y;
        let len = Math.sqrt(dx * dx + dy * dy);
        let extension = 1000;
        
        if (len > 0) {
            dx /= len;
            dy /= len;
            
            return {
                x1: line.p1.x - dx * extension,
                y1: line.p1.y - dy * extension,
                x2: line.p2.x + dx * extension,
                y2: line.p2.y + dy * extension
            };
        }
    }
    
    return {
        x1: line.p1.x,
        y1: line.p1.y,
        x2: line.p2.x,
        y2: line.p2.y
    };
}

function getAngleBetweenLines(line1, line2) {
    let angle1 = line1.getAngle();
    let angle2 = line2.getAngle();
    let diff = Math.abs(angle1 - angle2);
    return Math.min(diff, Math.PI - diff);
}

function setTool(tool) {
    if ((tool === 'perpendicular' || tool === 'parallel') && (lines.length === 0)) {
        return;
    }

    currentTool = tool;
    
    if (tool === 'parallel' && lines.length > 0) {
        const segmentLines = lines.filter(l => l.type === 'segment');
        if (segmentLines.length > 0) {
            // The segment line should remain black. We just need to store it as the source.
            parallelSourceLine = segmentLines[segmentLines.length - 1]; 
        } else {
            parallelSourceLine = null;
        }
    } else {
        parallelSourceLine = null;
    }
    
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tool + 'Tool').classList.add('active');
    
    const currentToolElement = document.querySelector('.current-tool');
    const instructionElement = document.querySelector('.instruction'); 
    
    if (currentToolElement) {
        currentToolElement.textContent = `Current Tool: ${tool.charAt(0).toUpperCase() + tool.slice(1)}`;
    }
    
    if (instructionElement) {
        let instruction = '';
        switch(tool) {
            case 'segment': instruction = 'Click points or drag to draw line segments'; break;
            case 'perpendicular': instruction = 'Click on a line or point to create perpendicular'; break;
            case 'parallel': instruction = 'Click anywhere on the canvas to create a parallel line'; break;
        }
        instructionElement.textContent = instruction;
    }
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function clearAll() {
    lines = [];
    points = [];
    startPoint = null;
    tempLine = null;
    isDrawing = false;
    draggedPoint = null;
    parallelSourceLine = null;
    lineLabelIndex = 0;
    transversalLabelIndex = 1;
    transversalSteps = [];
    labelPositions = [];
    
    updateButtonStates();
    
    setTool('segment');
    
    const currentToolElement = document.querySelector('.current-tool');
    const instructionElement = document.querySelector('.instruction');
    
    if (currentToolElement) {
        currentToolElement.textContent = 'Current Tool: Segment';
    }
    
    if (instructionElement) {
        instructionElement.textContent = 'Click points or drag to draw line segments';
    }
}

function drawParallelProofs() {
    // Find all explicitly constructed perpendicular relationships
    const perpendiculars = []; // Array to store { seg, perp }
    transversalSteps.forEach(step => {
        if (step.transversal && step.perpendiculars.length > 0) {
            // Use labelOverrides for the transversal if it exists, otherwise use the raw label
            const perpLabel = labelOverrides[step.transversal] || step.transversal;
            step.perpendiculars.forEach(segLabel => {
                // Use labelOverrides for the segment line as well
                const displaySegLabel = labelOverrides[segLabel] || segLabel;
                // Ensure we don't add duplicates if logic changes later
                if (!perpendiculars.some(p => p.seg === displaySegLabel && p.perp === perpLabel)) {
                    perpendiculars.push({ seg: displaySegLabel, perp: perpLabel });
                }
            });
        }
    });

    // Generate the text for the proof steps
    const proofStepsText = perpendiculars.map(p => `${p.seg} ⟂ ${p.perp}`);

    // Generate the conclusion text if applicable
    let conclusionText = null;
    if (perpendiculars.length === 2) {
        const p1 = perpendiculars[0];
        const p2 = perpendiculars[1];
        // Format: ∴ perpendicular_of(a) ∥ b & perpendicular_of(b) ∥ a
        conclusionText = `∴ ${p1.perp} ∥ ${p2.seg} & ${p2.perp} ∥ ${p1.seg}`;
    }

    // --- Rendering logic ---
    const allSteps = conclusionText ? proofStepsText.concat(conclusionText) : proofStepsText;
    const numSteps = allSteps.length;
    const boxPadding = 15;
    const textHeight = 16;
    const titleHeight = 20;
    const lineSpacing = 8;

    // Set box dimensions dynamically based on content
    const w = 220; // A bit wider to accommodate longer labels
    const h = titleHeight + (numSteps > 0 ? (numSteps * (textHeight + lineSpacing)) : textHeight) + boxPadding;
    const x = width - w - 20;
    const y = 20;

    push();
    // Draw the box
    fill(255, 255, 255, 240);
    stroke(0);
    strokeWeight(2);
    rect(x, y, w, h, 12);

    // Draw the title
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    text('Parallel Proof Steps:', x + boxPadding, y + 10);

    // Draw the steps or "No steps yet" message
    textSize(14);
    let stepY = y + titleHeight + 15;

    if (numSteps === 0) {
        fill(100, 0, 0); // Reddish color for the message
        text('No steps yet', x + boxPadding, stepY);
    } else {
        fill(0); // Black for the proof text
        allSteps.forEach(step => {
            text(step, x + boxPadding, stepY);
            stepY += textHeight + lineSpacing;
        });
    }
    pop();
}

function isPerpendicular(l1, l2) {
    let d1 = l1.getDirection();
    let d2 = l2.getDirection();
    let dot = d1.x * d2.x + d1.y * d2.y;
    return Math.abs(dot) < 0.01;
}