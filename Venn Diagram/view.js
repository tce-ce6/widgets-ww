class VennView {
    constructor() {
        this.canvas = null;
        this.questionElement = document.getElementById('current-question');
        this.checkButton = document.getElementById('check-btn');
        this.prevButton = document.getElementById('prev-btn');
        this.nextButton = document.getElementById('next-btn');
        this.scoreElement = document.getElementById('score');
        this.hintContainer = document.getElementById('hint-container');
        this.hintContent = document.getElementById('hint-content');
        
        // Canvas dimensions
        this.width = 500;
        this.height = 400;
        
        // Venn diagram parameters
        this.circleRadius = 100;
        this.circleCenters = {
            left: { x: this.width / 2 - 60, y: this.height / 2 },
            right: { x: this.width / 2 + 60, y: this.height / 2 }
        };
        
        // Colors
        this.colors = {
            outline: [0, 0, 0],
            selected: [99, 102, 241, 128],
            hover: [180, 180, 255, 77],
            labels: [0, 0, 0],
            universalSet: [255, 255, 255]
        };
        
        this.hoveredRegion = null;
        this.selectedRegions = [];
        this.p5Instance = null;
    }

    setup(p) {
        this.p5Instance = p;
        
        // Create canvas and parent it to the container
        this.canvas = p.createCanvas(this.width, this.height);
        this.canvas.parent('canvas-container');
    }

    draw(p, selectedRegions) {
        this.selectedRegions = selectedRegions;
        p.clear();
        
        // Draw universal set (rectangle)
        p.stroke(0);
        p.strokeWeight(2);
        p.fill(255);
        p.rect(30, 30, this.width - 60, this.height - 60);
        
        // Add 'U' label for universal set
        p.noStroke();
        p.fill(0);
        p.textSize(18);
        p.textAlign(p.LEFT, p.TOP);
        p.text('U', 40, 40);
        
        // Check regions and render them
        this.drawVennRegions(p);
        
        // Draw circle outlines last to ensure they're on top
        this.drawCircleOutlines(p);
    }

    drawVennRegions(p) {
        const regions = this.calculateRegions();
        
        // Draw the regions in this order: outside, leftOnly, rightOnly, intersection
        const renderOrder = ['outside', 'leftOnly', 'rightOnly', 'intersection'];
        
        // First pass - fill the regions based on selection
        for (const regionName of renderOrder) {
            const region = regions[regionName];
            
            if (this.selectedRegions.includes(regionName)) {
                // Selected region
                p.fill(this.colors.selected);
            } else if (this.hoveredRegion === regionName) {
                // Hovered region
                p.fill(this.colors.hover);
            } else {
                // Default - no fill
                p.noFill();
            }
            
            // Draw the region
            if (regionName === 'outside') {
                // Draw the outside region (universal set minus both circles)
                p.beginShape();
                // Outer rectangle
                p.vertex(30, 30);
                p.vertex(this.width - 30, 30);
                p.vertex(this.width - 30, this.height - 30);
                p.vertex(30, this.height - 30);
                
                // Cut out left circle
                this.addCircleContour(p, this.circleCenters.left.x, this.circleCenters.left.y, this.circleRadius, true);
                
                // Cut out right circle
                this.addCircleContour(p, this.circleCenters.right.x, this.circleCenters.right.y, this.circleRadius, true);
                
                p.endShape(p.CLOSE);
            } else if (regionName === 'leftOnly') {
                // Left circle minus intersection
                this.drawPartialCircle(p, this.circleCenters.left.x, this.circleCenters.left.y, 
                                    this.circleRadius, regions.intersectionPoints, false);
            } else if (regionName === 'rightOnly') {
                // Right circle minus intersection
                this.drawPartialCircle(p, this.circleCenters.right.x, this.circleCenters.right.y, 
                                     this.circleRadius, regions.intersectionPoints, true);
            } else if (regionName === 'intersection') {
                // Intersection lens shape
                p.beginShape();
                p.vertex(regions.intersectionPoints[0].x, regions.intersectionPoints[0].y);
                this.addArc(p, this.circleCenters.right.x, this.circleCenters.right.y, 
                          this.circleRadius, regions.intersectionPoints[0], regions.intersectionPoints[1], false);
                this.addArc(p, this.circleCenters.left.x, this.circleCenters.left.y, 
                          this.circleRadius, regions.intersectionPoints[1], regions.intersectionPoints[0], false);
                p.endShape(p.CLOSE);
            }
        }
    }

    drawCircleOutlines(p) {
        // Draw the circle outlines
        p.stroke(0);
        p.strokeWeight(2);
        p.noFill();
        
        // Left circle (A)
        p.circle(this.circleCenters.left.x, this.circleCenters.left.y, this.circleRadius * 2);
        
        // Right circle (B)
        p.circle(this.circleCenters.right.x, this.circleCenters.right.y, this.circleRadius * 2);
        
        // Add labels
        p.noStroke();
        p.fill(0);
        p.textSize(18);
        p.textAlign(p.CENTER, p.CENTER);
        
        // Label A
        p.text('A', this.circleCenters.left.x - this.circleRadius / 2, this.circleCenters.left.y);
        
        // Label B
        p.text('B', this.circleCenters.right.x + this.circleRadius / 2, this.circleCenters.right.y);
    }

    addCircleContour(p, cx, cy, r, clockwise) {
        const steps = 40;
        const direction = clockwise ? 1 : -1;
        
        p.beginContour();
        for (let i = 0; i <= steps; i++) {
            const angle = direction * i * p.TWO_PI / steps;
            const x = cx + r * p.cos(angle);
            const y = cy + r * p.sin(angle);
            p.vertex(x, y);
        }
        p.endContour();
    }

    addArc(p, cx, cy, radius, startPoint, endPoint, clockwise) {
        // Calculate angles
        const startAngle = p.atan2(startPoint.y - cy, startPoint.x - cx);
        let endAngle = p.atan2(endPoint.y - cy, endPoint.x - cx);
        
        // Handle full circle case
        if (p.abs(startAngle - endAngle) < 0.001) {
            endAngle = startAngle + p.TWO_PI;
        }
        
        const steps = 30;
        let angle = startAngle;
        
        // Determine arc direction
        const direction = clockwise ? 1 : -1;
        let angleStep;
        
        if (clockwise) {
            // Make sure endAngle > startAngle
            if (endAngle < startAngle) endAngle += p.TWO_PI;
            angleStep = (endAngle - startAngle) / steps;
        } else {
            // Make sure startAngle > endAngle
            if (startAngle < endAngle) startAngle += p.TWO_PI;
            angleStep = (startAngle - endAngle) / steps;
        }
        
        // Draw the arc
        for (let i = 0; i <= steps; i++) {
            angle = startAngle + direction * i * angleStep;
            const x = cx + radius * p.cos(angle);
            const y = cy + radius * p.sin(angle);
            p.vertex(x, y);
        }
    }

    drawPartialCircle(p, cx, cy, radius, intersectionPoints, isRightCircle) {
        p.beginShape();
        
        // Start from first intersection point
        p.vertex(intersectionPoints[0].x, intersectionPoints[0].y);
        
        // Add arc to second intersection point
        const clockwise = isRightCircle;
        this.addArc(p, cx, cy, radius, intersectionPoints[0], intersectionPoints[1], clockwise);
        
        // Connect back to first intersection point
        p.vertex(intersectionPoints[1].x, intersectionPoints[1].y);
        p.vertex(intersectionPoints[0].x, intersectionPoints[0].y);
        
        p.endShape(p.CLOSE);
    }

    calculateRegions() {
        const p = this.p5Instance;
        
        // Calculate intersection points
        const d = p.dist(this.circleCenters.left.x, this.circleCenters.left.y, 
                         this.circleCenters.right.x, this.circleCenters.right.y);
        
        // Calculate intersection points using circle-circle intersection formula
        const a = (this.circleRadius * this.circleRadius - this.circleRadius * this.circleRadius + d * d) / (2 * d);
        const h = p.sqrt(this.circleRadius * this.circleRadius - a * a);
        
        const p2x = this.circleCenters.left.x + a * (this.circleCenters.right.x - this.circleCenters.left.x) / d;
        const p2y = this.circleCenters.left.y + a * (this.circleCenters.right.y - this.circleCenters.left.y) / d;
        
        const p3x1 = p2x + h * (this.circleCenters.right.y - this.circleCenters.left.y) / d;
        const p3y1 = p2y - h * (this.circleCenters.right.x - this.circleCenters.left.x) / d;
        
        const p3x2 = p2x - h * (this.circleCenters.right.y - this.circleCenters.left.y) / d;
        const p3y2 = p2y + h * (this.circleCenters.right.x - this.circleCenters.left.x) / d;
        
        const intersectionPoints = [
            { x: p3x1, y: p3y1 },
            { x: p3x2, y: p3y2 }
        ];
        
        return {
            leftOnly: 'leftOnly',
            rightOnly: 'rightOnly',
            intersection: 'intersection',
            outside: 'outside',
            intersectionPoints: intersectionPoints
        };
    }

    checkHover(p, mouseX, mouseY) {
        const regions = this.calculateRegions();
        
        // Check each region to see if the mouse is inside it
        if (this.isPointInLeftOnly(p, mouseX, mouseY, regions.intersectionPoints)) {
            return 'leftOnly';
        } else if (this.isPointInRightOnly(p, mouseX, mouseY, regions.intersectionPoints)) {
            return 'rightOnly';
        } else if (this.isPointInIntersection(p, mouseX, mouseY, regions.intersectionPoints)) {
            return 'intersection';
        } else if (this.isPointInOutside(p, mouseX, mouseY)) {
            return 'outside';
        }
        
        return null;
    }

    isPointInLeftOnly(p, x, y, intersectionPoints) {
        // Check if point is in left circle but not in the intersection
        const distToLeft = p.dist(x, y, this.circleCenters.left.x, this.circleCenters.left.y);
        const distToRight = p.dist(x, y, this.circleCenters.right.x, this.circleCenters.right.y);
        
        return distToLeft <= this.circleRadius && distToRight > this.circleRadius;
    }

    isPointInRightOnly(p, x, y, intersectionPoints) {
        // Check if point is in right circle but not in the intersection
        const distToLeft = p.dist(x, y, this.circleCenters.left.x, this.circleCenters.left.y);
        const distToRight = p.dist(x, y, this.circleCenters.right.x, this.circleCenters.right.y);
        
        return distToRight <= this.circleRadius && distToLeft > this.circleRadius;
    }

    isPointInIntersection(p, x, y, intersectionPoints) {
        // Check if point is in both circles
        const distToLeft = p.dist(x, y, this.circleCenters.left.x, this.circleCenters.left.y);
        const distToRight = p.dist(x, y, this.circleCenters.right.x, this.circleCenters.right.y);
        
        return distToLeft <= this.circleRadius && distToRight <= this.circleRadius;
    }

    isPointInOutside(p, x, y) {
        // Check if point is in the rectangle but not in either circle
        const inRect = x >= 30 && x <= this.width - 30 && y >= 30 && y <= this.height - 30;
        const distToLeft = p.dist(x, y, this.circleCenters.left.x, this.circleCenters.left.y);
        const distToRight = p.dist(x, y, this.circleCenters.right.x, this.circleCenters.right.y);
        
        return inRect && distToLeft > this.circleRadius && distToRight > this.circleRadius;
    }

    setHoveredRegion(region) {
        this.hoveredRegion = region;
    }

    updateQuestion(question) {
        this.questionElement.textContent = question.text;
    }

    updateHint(hint) {
        this.hintContent.textContent = hint;
    }

    updateScore(score) {
        this.scoreElement.textContent = score.current;
    }

    updateNavButtons(currentIndex, totalQuestions) {
        this.prevButton.disabled = currentIndex === 0;
        this.nextButton.disabled = currentIndex === totalQuestions - 1;
    }

    showFeedback(result) {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = `feedback ${result.isCorrect ? 'correct' : 'incorrect'}`;
        feedbackElement.textContent = result.message;
        
        // Add to the document
        document.getElementById('canvas-container').appendChild(feedbackElement);
        
        // Remove after 2 seconds
        setTimeout(() => {
            feedbackElement.remove();
        }, 2000);
    }

    highlightCorrectRegions(correctRegions) {
        if (!correctRegions) return;
        
        // Store the original selected regions
        const originalSelected = [...this.selectedRegions];
        
        // Show the correct regions
        this.selectedRegions = correctRegions;
        
        // Revert after a delay
        setTimeout(() => {
            this.selectedRegions = originalSelected;
        }, 2000);
    }
}
