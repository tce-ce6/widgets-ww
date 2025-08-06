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
let transversalSteps = []; // [{transversal, steps: [..], parallel: [a, b] or null}]

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
    }

    draw() {
        stroke(this.color);
        strokeWeight(this.thickness);
        
        if (this.type === 'segment') {
            line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        } else {
            let dx = this.p2.x - this.p1.x;
            let dy = this.p2.y - this.p1.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            let extension = 100;
            
            if (len > 0) {
                dx /= len;
                dy /= len;
                
                let x1 = this.p1.x - dx * extension;
                let y1 = this.p1.y - dy * extension;
                let x2 = this.p2.x + dx * extension;
                let y2 = this.p2.y + dy * extension;
                
                line(x1, y1, x2, y2);
            }
        }
        let mx, my;
        if (this.type === 'segment') {
            mx = (this.p1.x + this.p2.x) / 2;
            my = (this.p1.y + this.p2.y) / 2;
        } else {
            let dx = this.p2.x - this.p1.x;
            let dy = this.p2.y - this.p1.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0) {
                dx /= len;
                dy /= len;
                mx = (this.p1.x + this.p2.x) / 2;
                my = (this.p1.y + this.p2.y) / 2;
            }
        }
        if (this.label && mx !== undefined && my !== undefined) {
            push();
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(18);
            text(this.label, mx, my - 15);
            pop();
        }
    }

    getPointOnLine(x, y) {
        let A = x - this.p1.x;
        let B = y - this.p1.y;
        let C = this.p2.x - this.p1.x;
        let D = this.p2.y - this.p1.y;

        let dot = A * C + B * D;
        let lenSq = C * C + D * D;
        let param = lenSq !== 0 ? dot / lenSq : -1;

        let xx, yy;
        if (param < 0) {
            xx = this.p1.x;
            yy = this.p1.y;
        } else if (param > 1) {
            xx = this.p2.x;
            yy = this.p2.y;
        } else {
            xx = this.p1.x + param * C;
            yy = this.p1.y + param * D;
        }

        return new Point(xx, yy);
    }

    distanceToPoint(x, y) {
        let A = x - this.p1.x;
        let B = y - this.p1.y;
        let C = this.p2.x - this.p1.x;
        let D = this.p2.y - this.p1.y;

        let dot = A * C + B * D;
        let lenSq = C * C + D * D;
        let param = lenSq !== 0 ? dot / lenSq : -1;

        let xx, yy;
        if (param < 0) {
            xx = this.p1.x;
            yy = this.p1.y;
        } else if (param > 1) {
            xx = this.p2.x;
            yy = this.p2.y;
        } else {
            xx = this.p1.x + param * C;
            yy = this.p1.y + param * D;
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
        perpendicularBtn.disabled = !hasLines || lines.length >= 3;
        if (!hasLines && currentTool === 'perpendicular') {
            setTool('segment');
        }
    }
    
    if (parallelBtn) {
        parallelBtn.disabled = !hasLines || lines.length >= 3;
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
        else if ((e.key === 'p' || e.key === 'P') && lines.length > 0 && lines.length < 3) setTool('perpendicular');
        else if ((e.key === 'l' || e.key === 'L') && lines.length > 0 && lines.length < 3) setTool('parallel');
        else if (e.key === 'c' || e.key === 'C') clearAll();
    });
}

function draw() {
    background(240);
    
    drawDotPaper();
    
    for (let line of lines) {
        line.draw();
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
    let processedIntersections = new Set();
    
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            let intersection = getLineIntersection(lines[i], lines[j]);
            if (intersection) {
                let intersectionKey = `${intersection.x},${intersection.y}`;
                
                if (processedIntersections.has(intersectionKey)) continue;
                processedIntersections.add(intersectionKey);
                
                let angle = getAngleBetweenLines(lines[i], lines[j]);
                let angleDeg = Math.abs(angle * 180 / Math.PI);
                
                if (angleDeg < 5 || angleDeg > 175) continue;
                
                let radius = 30;
                let angle1 = lines[i].getAngle();
                let angle2 = lines[j].getAngle();
                
                let angleDiff = angle2 - angle1;
                
                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                
                let startAngle, endAngle;
                if (angleDiff > 0) {
                    startAngle = angle1;
                    endAngle = angle1 + Math.min(angleDiff, Math.PI - angleDiff);
                } else {
                    startAngle = angle2;
                    endAngle = angle2 + Math.min(-angleDiff, Math.PI + angleDiff);
                }
                
                if (Math.abs(angleDeg - 90) < 5) {
                    stroke(0, 200, 0);
                    strokeWeight(3);
                    noFill();
                    arc(intersection.x, intersection.y, radius * 2, radius * 2, 
                        startAngle, endAngle);
                    
                    fill(0, 200, 0);
                    noStroke();
                    textAlign(CENTER, CENTER);
                    textSize(12);
                    
                    let textX = intersection.x + Math.cos((startAngle + endAngle) / 2) * 40;
                    let textY = intersection.y + Math.sin((startAngle + endAngle) / 2) * 40;
                    text('90° ✓', textX, textY);
                } else {
                    stroke(255, 100, 100);
                    strokeWeight(2);
                    noFill();
                    arc(intersection.x, intersection.y, radius * 2, radius * 2, 
                        startAngle, endAngle);
                    
                    fill(255, 100, 100);
                    noStroke();
                    textAlign(CENTER, CENTER);
                    textSize(12);
                    
                    let textX = intersection.x + Math.cos((startAngle + endAngle) / 2) * 40;
                    let textY = intersection.y + Math.sin((startAngle + endAngle) / 2) * 40;
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
    switch(currentTool) {
        case 'segment':
            instruction = 'Click points or drag to draw line segments';
            break;
        case 'perpendicular':
            instruction = lines.length === 0 ? 'Draw a line first!' : 'Click on a line or point to create perpendicular';
            break;
        case 'parallel':
            instruction = lines.length === 0 ? 'Draw a line first!' : 
                         parallelSourceLine ? 'Click where you want the parallel line' : 'Click on a line first';
            break;
    }
    
    if (lines.length >= 3) {
        instruction = 'Clear to draw again';
    }
    
    fill(255, 255, 255, 200);
    rect(10, height - 40, 400, 30, 5);
    fill(0);
    text(instruction, 20, height - 25);
}

function mousePressed() {
    if (lines.length >= 3) return; // Prevent drawing if three lines exist
    
    draggedPoint = null;
    for (let point of points) {
        if (point.contains(mouseX, mouseY)) {
            draggedPoint = point;
            point.isDragging = true;
            if (currentTool === 'segment' && !isDrawing) {
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
    } else if (currentTool === 'segment' && isDrawing && !startPoint.isDragging) {
        updateTempLine();
    }
}

function mouseReleased() {
    if (lines.length >= 3) return;
    
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
            let label = lineLabelIndex === 0 ? 'a' : (lineLabelIndex === 2 ? 'b' : lineLabels[lineLabelIndex % lineLabels.length]);
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
    let clickedPoint = null;
    for (let point of points) {
        if (point.contains(mouseX, mouseY)) {
            clickedPoint = point;
            break;
        }
    }
    let closestLine = null;
    let minDistance = Infinity;
    for (let line of lines) {
        let distance = clickedPoint 
            ? line.distanceToPoint(clickedPoint.x, clickedPoint.y)
            : line.distanceToPoint(mouseX, mouseY);
        if (distance < minDistance && distance < 20) {
            minDistance = distance;
            closestLine = line;
        }
    }
    if (closestLine) {
        let pointOnLine;
        if (clickedPoint) {
            pointOnLine = clickedPoint;
        } else {
            pointOnLine = closestLine.getPointOnLine(mouseX, mouseY);
            points.push(pointOnLine);
        }
        let dx = closestLine.p2.x - closestLine.p1.x;
        let dy = closestLine.p2.y - closestLine.p1.y;
        let candidate1 = new Point(pointOnLine.x - dy, pointOnLine.y + dx);
        let candidate2 = new Point(pointOnLine.x + dy, pointOnLine.y - dx);
        let d1 = dist(candidate1.x, candidate1.y, mouseX, mouseY);
        let d2 = dist(candidate2.x, candidate2.y, mouseX, mouseY);
        let endPoint = d1 < d2 ? candidate1 : candidate2;
        let existingPoint = points.find(p => p.x === endPoint.x && p.y === endPoint.y);
        if (existingPoint) {
            endPoint = existingPoint;
        } else {
            points.push(endPoint);
        }
        let tLabel = 't';
        if (transversalLabelIndex > 1) tLabel = 't' + transversalLabelIndex;
        transversalLabelIndex++;
        let perpLine = new Line(pointOnLine, endPoint, 'perpendicular', '#ff6b6b', tLabel);
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
    if (!parallelSourceLine) {
        let closestLine = null;
        let minDistance = Infinity;
        
        for (let line of lines) {
            let distance = line.distanceToPoint(mouseX, mouseY);
            if (distance < minDistance && distance < 20) {
                minDistance = distance;
                closestLine = line;
            }
        }
        
        if (closestLine) {
            parallelSourceLine = closestLine;
            parallelSourceLine.color = '#4ecdc4';
        }
    } else {
        let startPoint = new Point(mouseX, mouseY);
        points.push(startPoint);

        let dx = parallelSourceLine.p2.x - parallelSourceLine.p1.x;
        let dy = parallelSourceLine.p2.y - parallelSourceLine.p1.y;

        let a = dx / 20;
        let b = dy / 20;
        let g = gcd(Math.abs(a), Math.abs(b)) || 1;
        a = a / g;
        b = b / g;

        let candidates = [];
        for (let k = 1; k <= 3; k++) {
            candidates.push(new Point(
                startPoint.x + k*a*20, 
                startPoint.y + k*b*20
            ));
            candidates.push(new Point(
                startPoint.x - k*a*20, 
                startPoint.y - k*b*20
            ));
        }

        let minDist = Infinity;
        let endPoint = null;
        for (let candidate of candidates) {
            let d = dist(candidate.x, candidate.y, mouseX, mouseY);
            if (d < minDist) {
                minDist = d;
                endPoint = candidate;
            }
        }

        let existingPoint = points.find(p => p.x === endPoint.x && p.y === endPoint.y);
        if (existingPoint) {
            endPoint = existingPoint;
        } else {
            points.push(endPoint);
        }
        let label = 'b';
        lineLabelIndex = 3;
        let parallelLine = new Line(startPoint, endPoint, 'parallel', '#4ecdc4', label);
        
        lines.push(parallelLine);

        transversalSteps.push({
            transversal: null,
            steps: [`${label} ∥ ${parallelSourceLine.label} (by construction)`],
            perpendiculars: [],
            parallel: [label, parallelSourceLine.label]
        });

        parallelSourceLine.color = getOriginalLineColor(parallelSourceLine);
        parallelSourceLine = null;
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
    let { x1: x1a, y1: y1a, x2: x2a, y2: y2a } = getExtendedLineCoords(line1);
    let { x1: x1b, y1: y1b, x2: x2b, y2: y2b } = getExtendedLineCoords(line2);
    
    let denom = (x1a - x2a) * (y1b - y2b) - (y1a - y2a) * (x1b - x2b);
    
    if (Math.abs(denom) < 1e-10) return null;
    
    let t = ((x1a - x1b) * (y1b - y2b) - (y1a - y1b) * (x1b - x2b)) / denom;
    
    let intersectionX = x1a + t * (x2a - x1a);
    let intersectionY = y1a + t * (y2a - y1a);
    
    if (intersectionX >= -100 && intersectionX <= width + 100 && 
        intersectionY >= -100 && intersectionY <= height + 100) {
        return new Point(intersectionX, intersectionY);
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
    if ((tool === 'perpendicular' || tool === 'parallel') && (lines.length === 0 || lines.length >= 3)) {
        return;
    }
    
    currentTool = tool;
    parallelSourceLine = null;
    
    for (let line of lines) {
        line.color = getOriginalLineColor(line);
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
            case 'parallel': instruction = 'Click on a line first to create parallel'; break;
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
    let w = 200, h = 100;
    let x = width - w - 20, y = 20;
    
    push();
    fill(255, 255, 255, 240);
    stroke(0);
    strokeWeight(2);
    rect(x, y, w, h + 20, 12);
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    text('Parallel Proof Steps:', x + 15, y + 10);
    textSize(14);
    
    if (lines.length < 3 || !transversalSteps.some(t => t.transversal === 't' && t.perpendiculars.includes('a') && transversalSteps.some(t2 => t2.parallel && t2.parallel.includes('b')))) {
        fill(100, 0, 0);
        text('No steps yet', x + 15, y + 45);
    } else {
        let stepY = y + 45;
        let proofSteps = [
            'a ⟂ t',
            'b ⟂ t',
            'Therefore, a ∥ b'
        ];
        for (let s of proofSteps) {
            text(s, x + 15, stepY);
            stepY += 24;
        }
    }
    pop();
}

function isPerpendicular(l1, l2) {
    let d1 = l1.getDirection();
    let d2 = l2.getDirection();
    let dot = d1.x * d2.x + d1.y * d2.y;
    return Math.abs(dot) < 0.01;
}