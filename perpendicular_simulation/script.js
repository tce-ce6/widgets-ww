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

class Point {
    constructor(x, y) {
        // Snap coordinates to the nearest grid point (spacing = 20)
        this.x = Math.round(x / 20) * 20;
        this.y = Math.round(y / 20) * 20;
        this.radius = 6;
        this.color = '#007bff';
        this.isDragging = false;
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
        // Snap to grid when dragging
        this.x = Math.round(x / 20) * 20;
        this.y = Math.round(y / 20) * 20;
    }
}

class Line {
    constructor(p1, p2, type = 'segment', color = '#333') {
        this.p1 = p1;
        this.p2 = p2;
        this.type = type;
        this.color = color;
        this.thickness = 2;
    }

    draw() {
        stroke(this.color);
        strokeWeight(this.thickness);
        
        if (this.type === 'segment') {
            line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        } else {
            // For perpendicular and parallel lines, extend beyond the points
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
    }

    getPointOnLine(x, y) {
        // Find the closest point on the line to the given coordinates
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

        // Snap to the nearest grid point
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

    getSlope() {
        let dx = this.p2.x - this.p1.x;
        let dy = this.p2.y - this.p1.y;
        return dx === 0 ? Infinity : dy / dx;
    }
}

function setup() {
    canvas = createCanvas(800, 500);
    canvas.parent('sketch-container');
    
    // Initialize tool buttons
    document.getElementById('segmentTool').addEventListener('click', () => setTool('segment'));
    document.getElementById('perpendicularTool').addEventListener('click', () => setTool('perpendicular'));
    document.getElementById('parallelTool').addEventListener('click', () => setTool('parallel'));
    document.getElementById('clearAll').addEventListener('click', clearAll);
    document.getElementById('showAngles').addEventListener('change', (e) => {
        showAngles = e.target.checked;
    });
}

function draw() {
    background(240);
    
    // Draw dot paper background
    drawDotPaper();
    
    // Draw all lines
    for (let line of lines) {
        line.draw();
    }
    
    // Draw temporary line while drawing
    if (tempLine) {
        tempLine.draw();
    }
    
    // Draw all points
    for (let point of points) {
        point.draw();
    }
    
    // Draw angles if enabled
    if (showAngles) {
        drawAngles();
    }
    
    // Draw tool-specific overlays
    drawToolOverlay();
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
    // Draw angles between intersecting lines
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            let intersection = getLineIntersection(lines[i], lines[j]);
            if (intersection) {
                let angle1 = lines[i].getAngle();
                let angle2 = lines[j].getAngle();
                
                // Calculate the acute angle between the lines
                let angleDiff = Math.abs(angle1 - angle2);
                if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
                if (angleDiff > Math.PI / 2) angleDiff = Math.PI - angleDiff;
                
                let angleDeg = angleDiff * 180 / Math.PI;
                
                // Draw angle arc
                stroke(255, 100, 100);
                strokeWeight(2);
                noFill();
                
                let radius = 30;
                
                // Normalize angles to [0, 2π]
                let normalizedAngle1 = angle1 < 0 ? angle1 + 2 * Math.PI : angle1;
                let normalizedAngle2 = angle2 < 0 ? angle2 + 2 * Math.PI : angle2;
                
                // Determine the smaller arc
                let startAngle = Math.min(normalizedAngle1, normalizedAngle2);
                let endAngle = Math.max(normalizedAngle1, normalizedAngle2);
                
                // If the arc spans more than π, use the smaller arc
                if (endAngle - startAngle > Math.PI) {
                    let temp = startAngle;
                    startAngle = endAngle;
                    endAngle = temp + 2 * Math.PI;
                }
                
                arc(intersection.x, intersection.y, radius * 2, radius * 2, startAngle, endAngle);
                
                // Draw angle text
                fill(255, 100, 100);
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(12);
                
                // Position text at the middle of the arc
                let midAngle = (startAngle + endAngle) / 2;
                let textRadius = radius + 15;
                let textX = intersection.x + Math.cos(midAngle) * textRadius;
                let textY = intersection.y + Math.sin(midAngle) * textRadius;
                
                text(Math.round(angleDeg) + '°', textX, textY);
                
                // Highlight 90-degree angles
                if (Math.abs(angleDeg - 90) < 2) {
                    stroke(0, 255, 0);
                    strokeWeight(3);
                    noFill();
                    arc(intersection.x, intersection.y, radius * 2, radius * 2, startAngle, endAngle);
                    
                    // Draw a small square to indicate 90 degrees
                    let squareSize = 15;
                    let squareX = intersection.x + Math.cos(midAngle) * (radius * 0.7);
                    let squareY = intersection.y + Math.sin(midAngle) * (radius * 0.7);
                    
                    stroke(0, 255, 0);
                    strokeWeight(2);
                    noFill();
                    rectMode(CENTER);
                    push();
                    translate(squareX, squareY);
                    rotate(midAngle);
                    rect(0, 0, squareSize, squareSize);
                    pop();
                    rectMode(CORNER);
                    
                    fill(0, 255, 0);
                    noStroke();
                    text('90° ✓', textX, textY);
                }
            }
        }
    }
}

function drawToolOverlay() {
    // Visual feedback for current tool
    fill(255, 255, 255, 200);
    noStroke();
    rect(10, 10, 150, 30, 5);
    
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(14);
    text('Tool: ' + currentTool, 20, 25);
    
    // Show instructions based on current tool
    let instruction = '';
    switch(currentTool) {
        case 'segment':
            instruction = 'Click and drag to draw line segments';
            break;
        case 'perpendicular':
            instruction = 'Click on a line to create perpendicular';
            break;
        case 'parallel':
            instruction = parallelSourceLine ? 'Click where you want the parallel line' : 'Click on a line first';
            break;
    }
    
    fill(255, 255, 255, 200);
    rect(10, height - 40, 400, 30, 5);
    fill(0);
    text(instruction, 20, height - 25);
}

function mousePressed() {
    // Check if dragging a point
    draggedPoint = null;
    for (let point of points) {
        if (point.contains(mouseX, mouseY)) {
            draggedPoint = point;
            point.isDragging = true;
            return;
        }
    }
    
    // Tool-specific actions
    switch(currentTool) {
        case 'segment':
            startDrawingSegment();
            break;
        case 'perpendicular':
            createPerpendicular();
            break;
        case 'parallel':
            createParallel();
            break;
    }
}

function mouseDragged() {
    if (draggedPoint) {
        draggedPoint.update(mouseX, mouseY);
    } else if (currentTool === 'segment' && isDrawing) {
        updateTempLine();
    }
}

function mouseReleased() {
    if (draggedPoint) {
        draggedPoint.isDragging = false;
        draggedPoint = null;
    } else if (currentTool === 'segment' && isDrawing) {
        finishDrawingSegment();
    }
}

function startDrawingSegment() {
    isDrawing = true;
    // Snap start point to grid
    startPoint = new Point(mouseX, mouseY);
    points.push(startPoint);
}

function updateTempLine() {
    if (startPoint) {
        // Snap end point to grid
        let endPoint = new Point(mouseX, mouseY);
        tempLine = new Line(startPoint, endPoint, 'segment');
    }
}

function finishDrawingSegment() {
    if (startPoint && tempLine) {
        // Snap end point to grid
        let endPoint = new Point(mouseX, mouseY);
        // Avoid adding a line if start and end points are the same
        if (startPoint.x !== endPoint.x || startPoint.y !== endPoint.y) {
            // Remove existing segment lines and their points
            let segmentPoints = new Set();
            lines = lines.filter(line => {
                if (line.type === 'segment') {
                    segmentPoints.add(line.p1);
                    segmentPoints.add(line.p2);
                    return false;
                }
                return true;
            });
            // Remove points that are only used by segment lines
            points = points.filter(point => {
                for (let line of lines) {
                    if (line.p1 === point || line.p2 === point) {
                        return true;
                    }
                }
                return !segmentPoints.has(point);
            });
            
            // Add new segment line and its points
            points.push(endPoint);
            lines.push(new Line(startPoint, endPoint, 'segment'));
        }
        startPoint = null;
        tempLine = null;
        isDrawing = false;
    }
}

function createPerpendicular() {
    let closestLine = null;
    let minDistance = Infinity;
    
    // Find the closest line to the mouse
    for (let line of lines) {
        let distance = line.distanceToPoint(mouseX, mouseY);
        if (distance < minDistance && distance < 20) {
            minDistance = distance;
            closestLine = line;
        }
    }
    
    if (closestLine) {
        // Snap the point on the line to the nearest grid point
        let pointOnLine = closestLine.getPointOnLine(mouseX, mouseY);
        points.push(pointOnLine);
        
        // Create perpendicular line relative to the clicked line
        let originalAngle = closestLine.getAngle();
        let perpAngle = originalAngle + Math.PI / 2;
        
        // Create perpendicular line extending in both directions from the point
        let length = 60;
        
        // First point (one direction)
        let endX1 = pointOnLine.x + Math.cos(perpAngle) * length;
        let endY1 = pointOnLine.y + Math.sin(perpAngle) * length;
        let endPoint1 = new Point(endX1, endY1);
        
        // Second point (opposite direction)
        let endX2 = pointOnLine.x - Math.cos(perpAngle) * length;
        let endY2 = pointOnLine.y - Math.sin(perpAngle) * length;
        let endPoint2 = new Point(endX2, endY2);
        
        points.push(endPoint1);
        points.push(endPoint2);
        
        let perpLine = new Line(endPoint2, endPoint1, 'perpendicular', '#ff6b6b');
        lines.push(perpLine);
    }
}

function createParallel() {
    if (!parallelSourceLine) {
        // First click - select the source line
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
            parallelSourceLine.color = '#4ecdc4'; // Highlight selected line
        }
    } else {
        // Second click - create parallel line
        let sourceAngle = parallelSourceLine.getAngle();
        let length = 100;
        
        // Snap the start point to the grid
        let startX = Math.round(mouseX / 20) * 20;
        let startY = Math.round(mouseY / 20) * 20;
        let startPoint = new Point(startX, startY);
        
        // Calculate end point and snap to grid
        let endX = startX + Math.cos(sourceAngle) * length;
        let endY = startY + Math.sin(sourceAngle) * length;
        let endPoint = new Point(endX, endY);
        
        points.push(startPoint);
        points.push(endPoint);
        
        let parallelLine = new Line(startPoint, endPoint, 'parallel', '#4ecdc4');
        lines.push(parallelLine);
        
        // Reset
        parallelSourceLine.color = '#333';
        parallelSourceLine = null;
    }
}

function getLineIntersection(line1, line2) {
    // Extend lines for intersection calculation
    let extension = 1000;
    
    // Line 1 extended
    let dx1 = line1.p2.x - line1.p1.x;
    let dy1 = line1.p2.y - line1.p1.y;
    let len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    if (len1 === 0) return null;
    dx1 /= len1;
    dy1 /= len1;
    
    let x1 = line1.p1.x - dx1 * extension;
    let y1 = line1.p1.y - dy1 * extension;
    let x2 = line1.p2.x + dx1 * extension;
    let y2 = line1.p2.y + dy1 * extension;
    
    // Line 2 extended
    let dx2 = line2.p2.x - line2.p1.x;
    let dy2 = line2.p2.y - line2.p1.y;
    let len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    if (len2 === 0) return null;
    dx2 /= len2;
    dy2 /= len2;
    
    let x3 = line2.p1.x - dx2 * extension;
    let y3 = line2.p1.y - dy2 * extension;
    let x4 = line2.p2.x + dx2 * extension;
    let y4 = line2.p2.y + dy2 * extension;
    
    let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    
    if (Math.abs(denom) < 1e-10) return null; // Lines are parallel
    
    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    
    let intersectionX = x1 + t * (x2 - x1);
    let intersectionY = y1 + t * (y2 - y1);
    
    // Check if intersection is within canvas bounds
    if (intersectionX >= 0 && intersectionX <= width && 
        intersectionY >= 0 && intersectionY <= height) {
        return new Point(intersectionX, intersectionY);
    }
    
    return null;
}

function getAngleBetweenLines(line1, line2) {
    let angle1 = line1.getAngle();
    let angle2 = line2.getAngle();
    let diff = Math.abs(angle1 - angle2);
    return Math.min(diff, Math.PI - diff);
}

function setTool(tool) {
    currentTool = tool;
    parallelSourceLine = null;
    
    // Reset line colors
    for (let line of lines) {
        if (line.type === 'segment') line.color = '#333';
        else if (line.type === 'perpendicular') line.color = '#ff6b6b';
        else if (line.type === 'parallel') line.color = '#4ecdc4';
    }
    
    // Update button states
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tool + 'Tool').classList.add('active');
}

function clearAll() {
    lines = [];
    points = [];
    startPoint = null;
    tempLine = null;
    isDrawing = false;
    draggedPoint = null;
    parallelSourceLine = null;
}