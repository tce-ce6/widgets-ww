
class FractionModel {
    constructor() {
        this.width = 900;
        this.height = 500;
        this.onFractionChanged = null;
        this.possibleDivisions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        this.divisions = null;
        this.sectionsToFill = null;
        this.generateNewFraction();
    }

    // Generate a new random fraction
    generateNewFraction() {
        const randomIndex = Math.floor(Math.random() * this.possibleDivisions.length);
        this.divisions = this.possibleDivisions[randomIndex];
        this.sectionsToFill = Math.floor(Math.random() * (this.divisions - 1)) + 1;
        console.log(`Creating circle with ${this.divisions} divisions`);
        
        // Notify the view if callback is set
        if (this.onFractionChanged) {
            this.onFractionChanged();
        }
    }

    // Bind the view's callback to the model
    bindFractionChanged(callback) {
        this.onFractionChanged = callback;
    }

    // Get canvas dimensions
    getCanvasDimensions() {
        return {
            width: this.width,
            height: this.height
        };
    }
    
    // Get current fraction data
    getFractionData() {
        return {
            divisions: this.divisions,
            sectionsToFill: this.sectionsToFill
        };
    }
}

// View - Handles the UI with p5.js
class FractionView {
    constructor() {
        this.p5Instance = null;
        this.canvas = null;
        this.fractionData = null;
        this.clickedSections = [];
        this.startSection = null;
        this.remainingAttempts = 3;
        this.checkButtonEnabled = false; 
        this.checkButton = null;
        this.isAnimating = false;
        this.animationProgress = 0;
        this.animationStartTime = 0;
        this.animationDuration = 2000; // 2 seconds for the animation
        this.animationType = null; // 'correct' or 'incorrect'
        this.animatingSections = []; // Store sections being animated
        this.permanentSections = []; // Store sections that stay on circle 1
        this.permanentSectionType = null; // 'correct' or 'incorrect'
        this.overlapSections = []; // Store sections that overlap (to be shown in red)
        this.permanentOverlapSections = [];
        this.normalAnimatingSections = []; // Store sections that don't overlap
        this.tryAgainMessage = null; 
        this.correctAnswersCount = 0;
        this.showEquation = false;
    }
    
    // Initialize p5 instance
    initP5() {
        const that = this;
        
        this.p5Instance = new p5(function(p) {
            p.setup = function() {
                that.setup(p);
            };
            
            p.draw = function() {
                that.draw(p);
            };
            
            p.mousePressed = function() {
                if (that.isClickOnSecondCircle(p)) {
                    that.checkSectionClick(p);
                    return false;
                }
                return false;
            };
        }, 'canvasContainer');
    }
    
    // Check if mouse is over the second circle
    isClickOnSecondCircle(p) {
        if (!this.fractionData) return false;
        const dimensions = { width: 900, height: 500 };
        const secondCircleX = dimensions.width * 0.6;
        const centerY = 170;
        const radius = Math.min(dimensions.width, dimensions.height) * 0.2;
        const dx = p.mouseX - secondCircleX;
        const dy = p.mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= radius;
    }

    // setup(p) {
    //     this.canvas = p.createCanvas(900, 500);
    //     // this.canvas.style('border', '1px solid #000');
    //     this.canvas.style('display', 'block');
    //     this.canvas.style('margin', '0 auto');
    //     // this.canvas.style('margin-top', '-140px');
    //     p.textFont('Arial');
    //     p.noLoop();
        
    //     const dimensions = { width: 900, height: 500 };
    //     const centerY = 170;
        
    //     // this.checkButton = p.createButton('Check (' + this.remainingAttempts + ')');
    //     // this.checkButton.position(dimensions.width * 0.6 - 50, centerY + 220);
    //     this.checkButton = document.getElementById('checkButton');
    //     this.checkButton.style('background-color', '#cccccc');
    //     this.checkButton.style('color', '#666666');
    //     this.checkButton.style('padding', '8px 16px');
    //     this.checkButton.style('border', 'none');
    //     this.checkButton.style('border-radius', '4px');
    //     this.checkButton.style('font-size', '16px');
    //     this.checkButton.attribute('disabled', '');
        
    //     const that = this;
    //     this.checkButton.mousePressed(function() {
    //         if (that.checkButtonEnabled && that.remainingAttempts > 0) {
    //             that.checkAnswer(p);
    //             p.redraw();
    //         }
    //     });
    //     this.tryAgainMessage = p.createP('✗ Try again');
    //     this.tryAgainMessage.position(dimensions.width * 0.6 - 50, centerY + 250);
    //     this.tryAgainMessage.style('color', '#ff0000');
    //     this.tryAgainMessage.style('font-size', '16px');
    //     this.tryAgainMessage.style('font-weight', 'bold');
    //     this.tryAgainMessage.style('margin', '0');
    //     this.tryAgainMessage.style('display', 'none');
    // }
    
    // p5.js draw function
  setup(p) {
    this.canvas = p.createCanvas(900, 500);
    this.canvas.style('display', 'block');
    this.canvas.style('margin', '0 auto');
    p.textFont('Arial');
    p.noLoop();
    
    const dimensions = { width: 900, height: 500 };
    const centerY = 170;
    
    this.checkButton = document.getElementById('checkButton');
    // Use style property assignments instead of style()
    this.checkButton.style.backgroundColor = '#cccccc';
    this.checkButton.style.color = '#666666';
    this.checkButton.style.padding = '8px 16px';
    this.checkButton.style.border = 'none';
    this.checkButton.style.borderRadius = '4px';
    this.checkButton.style.fontSize = '16px';
    this.checkButton.setAttribute('disabled', ''); // Use setAttribute for DOM attributes
    
    const that = this;
    this.checkButton.addEventListener('click', function() { // Use addEventListener for DOM elements
        if (that.checkButtonEnabled && that.remainingAttempts > 0) {
            that.checkAnswer(p);
            p.redraw();
        }
    });

    this.tryAgainMessage = p.createP('✗ Try again');
    this.tryAgainMessage.position(dimensions.width * 0.6 - 50, centerY + 250);
    this.tryAgainMessage.style('color', '#ff0000');
    this.tryAgainMessage.style('font-size', '16px');
    this.tryAgainMessage.style('font-weight', 'bold');
    this.tryAgainMessage.style('margin', '0');
    this.tryAgainMessage.style('display', 'none');
}
  
    draw(p) {
        if (!this.fractionData) return;
        
        p.background(255);
        
        if (this.isAnimating) {
            const currentTime = Date.now();
            const elapsed = currentTime - this.animationStartTime;
            this.animationProgress = Math.min(elapsed / this.animationDuration, 1);
            
            if (this.animationProgress < 1) {
                p.loop();
            } else {
                // Animation finished - make sections permanent
                if (!this.permanentSections.length && (this.normalAnimatingSections.length || this.overlapSections.length)) {
                    this.transferToPermanent();
                }
                this.isAnimating = false;
                p.noLoop();
            }
        }
        
        this.drawFractionedCircle(p);
    }

getEmptySectionsInCircle1() {
    const emptySections = [];
    const totalSections = this.fractionData.divisions;
    const filledSections = [];
    
    // Get filled sections in circle 1
    for (let i = 0; i < this.fractionData.sectionsToFill; i++) {
        filledSections.push((this.startSection + i) % totalSections);
    }

    if (this.permanentSections.length > 0) {
        filledSections.push(...this.permanentSections);
    }

    const allEmptySections = [];
    for (let i = 0; i < totalSections; i++) {
        if (!filledSections.includes(i)) {
            allEmptySections.push(i);
        }
    }
    const minFilled = Math.min(...filledSections);
    const maxFilled = Math.max(...filledSections);
    
    // Check if filled sections wrap around (e.g., sections 11, 0, 1 in a 12-section circle)
    let isWrapping = false;
    const sortedFilled = [...filledSections].sort((a, b) => a - b);
    for (let i = 1; i < sortedFilled.length; i++) {
        if (sortedFilled[i] - sortedFilled[i-1] > 1) {
            isWrapping = true;
            break;
        }
    }
    
    let adjacentSections = [];
    
    if (isWrapping) {
        // Handle wrapping case - place on the side with more consecutive empty spaces
        const beforeMin = [];
        const afterMax = [];
        
        // Collect empty sections before the minimum filled section
        for (let i = (minFilled - 1 + totalSections) % totalSections; 
             !filledSections.includes(i) && beforeMin.length < totalSections; 
             i = (i - 1 + totalSections) % totalSections) {
            beforeMin.unshift(i);
        }
        
        // Collect empty sections after the maximum filled section
        for (let i = (maxFilled + 1) % totalSections; 
             !filledSections.includes(i) && afterMax.length < totalSections; 
             i = (i + 1) % totalSections) {
            afterMax.push(i);
        }
        
        // Choose the side with more consecutive empty spaces
        adjacentSections = beforeMin.length >= afterMax.length ? beforeMin : afterMax;
    } else {
        // Normal case - place on one side (preferably after the filled sections)
        const afterFilled = [];
        const beforeFilled = [];
        
        // Collect empty sections after the filled block
        for (let i = (maxFilled + 1) % totalSections; 
             !filledSections.includes(i) && afterFilled.length < totalSections; 
             i = (i + 1) % totalSections) {
            afterFilled.push(i);
        }
        
        // Collect empty sections before the filled block
        for (let i = (minFilled - 1 + totalSections) % totalSections; 
             !filledSections.includes(i) && beforeFilled.length < totalSections; 
             i = (i - 1 + totalSections) % totalSections) {
            beforeFilled.unshift(i);
        }
        
        // Prefer placing after the filled sections, but use before if after is empty
        adjacentSections = afterFilled.length > 0 ? afterFilled : beforeFilled;
    }
    
    // Add any remaining empty sections that aren't adjacent
    const nonAdjacentSections = allEmptySections.filter(section => 
        !adjacentSections.includes(section)
    );
    
    // Return adjacent sections first (all on one side), then non-adjacent ones
    return [...adjacentSections, ...nonAdjacentSections];
}
    
    transferToPermanent() {
        this.permanentSections = [];
        this.permanentSectionType = this.animationType;
        
        // Add normal animated sections (non-overlapping)
        if (this.normalAnimatingSections.length > 0) {
            const emptySections = this.getEmptySectionsInCircle1();
            const sectionsToAdd = Math.min(this.normalAnimatingSections.length, emptySections.length);
            this.permanentSections.push(...emptySections.slice(0, sectionsToAdd));
        }
        
        // Store overlap sections permanently (NEW)
        if (this.overlapSections.length > 0) {
            // Determine where overlap sections will be placed
            const allFilledSections = [];
            
            // Add originally filled sections
            for (let j = 0; j < this.fractionData.sectionsToFill; j++) {
                allFilledSections.push((this.startSection + j) % this.fractionData.divisions);
            }
            
            // Add sections that will be filled by normal animated sections
            const emptySections = this.getEmptySectionsInCircle1();
            for (let j = 0; j < Math.min(this.normalAnimatingSections.length, emptySections.length); j++) {
                allFilledSections.push(emptySections[j]);
            }
            
            // Map each overlap section to its target location
            this.permanentOverlapSections = this.overlapSections.map((sectionIndex, i) => {
                return allFilledSections[i % allFilledSections.length];
            });
        }
    }
    
    // Check if the answer is correct and start animation
    checkAnswer(p) {
        if (this.remainingAttempts <= 0) return;
        
        this.remainingAttempts--;
        
        const correctSections = this.fractionData.divisions - this.fractionData.sectionsToFill;
        const isCorrect = this.clickedSections.length === correctSections;
        if (isCorrect) { this.correctAnswersCount++; }
        
        // Clear previous permanent sections for new attempt if incorrect
        if (!isCorrect) {
            this.permanentSections = [];

        }
        
        // Determine which sections can fit and which will overlap
        const emptySections = this.getEmptySectionsInCircle1();
        const availableSpaces = emptySections.length;
        const selectedCount = this.clickedSections.length;
        
        if (selectedCount <= availableSpaces) {
            // All sections can fit - no overlap
            this.normalAnimatingSections = [...this.clickedSections];
            this.overlapSections = [];
        } else {
            // Some sections will overlap
            this.normalAnimatingSections = this.clickedSections.slice(0, availableSpaces);
            this.overlapSections = this.clickedSections.slice(availableSpaces);
        }
        
        // Set up animation
        this.animationType = isCorrect ? 'correct' : 'incorrect';
        this.animatingSections = [...this.clickedSections]; // Keep for compatibility
        this.isAnimating = true;
        this.animationProgress = 0;
        this.animationStartTime = Date.now();
        p.loop();
        if (!isCorrect) {
    this.updateTryAgainMessage();
    this.tryAgainMessage.style('display', 'block');
} else {
    this.tryAgainMessage.style('display', 'none');
}
        this.updateCheckButton(p);
    }
    updateTryAgainMessage() {
        if (!this.tryAgainMessage) return;
        
        if (this.remainingAttempts === 2) {
            // After first incorrect attempt
            this.tryAgainMessage.html('✗ Try again');
            this.tryAgainMessage.style('color', '#ff0000');
        } else if (this.remainingAttempts === 1) {
            // After second incorrect attempt
            this.tryAgainMessage.html('Hint: Count the number of uncolored parts to see how many are needed to make a whole.');
            this.tryAgainMessage.style('color', '#ff0000');
        } else if (this.remainingAttempts === 0) {
            // After third incorrect attempt
            this.tryAgainMessage.html('✗ Maybe next time');
            this.tryAgainMessage.style('color', '#ff0000');
            this.showEquation = true;
        }
    }
    // Draw equation at bottom of canvas
drawEquationAtBottom(p) {
    if (!this.showEquation || !this.fractionData) return;
    
    const dimensions = { width: 900, height: 500 };
    const equationY = dimensions.height - 80;
    const smallRadius = 25;
    const correctAnswer = this.fractionData.divisions - this.fractionData.sectionsToFill;
    
    // Position circles horizontally centered
    const totalWidth = smallRadius * 6 + 120; // 3 circles + 2 symbols + spacing
    const startX = (dimensions.width - totalWidth) / 2;
    
    // First circle (question)
    const circle1X = startX + smallRadius;
    this.drawSmallFractionCircle(p, circle1X, equationY, smallRadius, this.fractionData.sectionsToFill, this.fractionData.divisions, this.startSection);
    
    // Plus sign
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.textStyle(p.BOLD);
    p.text('+', circle1X + smallRadius + 30, equationY);
    
    // Second circle (correct answer)
    const circle2X = circle1X + smallRadius * 2 + 60;
    this.drawSmallFractionCircle(p, circle2X, equationY, smallRadius, correctAnswer, this.fractionData.divisions, 0);
    
    // Equals sign
    p.text('=', circle2X + smallRadius + 30, equationY);
    
    // Third circle (complete whole)
    const circle3X = circle2X + smallRadius * 2 + 60;
    this.drawSmallFractionCircle(p, circle3X, equationY, smallRadius, this.fractionData.divisions, this.fractionData.divisions, 0);
}

// Helper method to draw small fraction circles
drawSmallFractionCircle(p, centerX, centerY, radius, sectionsToFill, totalSections, startSection) {
    // Draw circle outline
    p.stroke(0);
    p.strokeWeight(1);
    p.noFill();
    p.circle(centerX, centerY, radius * 2);
    
    const angleStep = p.TWO_PI / totalSections;
    
    // Fill sections
    if (sectionsToFill > 0) {
        p.fill(0, 128, 0);
        p.noStroke();
        
        for (let i = 0; i < sectionsToFill; i++) {
            const currentSection = (startSection + i) % totalSections;
            const startAngle = currentSection * angleStep;
            const endAngle = (currentSection + 1) * angleStep;
            
            p.beginShape();
            p.vertex(centerX, centerY);
            for (let a = startAngle; a <= endAngle; a += 0.02) {
                let x = centerX + p.cos(a) * radius;
                let y = centerY + p.sin(a) * radius;
                p.vertex(x, y);
            }
            p.vertex(centerX, centerY);
            p.endShape(p.CLOSE);
        }
    }
    
    // Draw division lines
    p.stroke(0);
    p.strokeWeight(1);
    p.drawingContext.setLineDash([3, 2]);
    
    for (let i = 0; i < totalSections; i++) {
        const angle = i * angleStep;
        const endX = centerX + radius * p.cos(angle);
        const endY = centerY + radius * p.sin(angle);
        p.line(centerX, centerY, endX, endY);
    }
    p.drawingContext.setLineDash([]);
}
    // Draw animated sections
    drawAnimatedSections(p) {
        if (!this.isAnimating || (this.normalAnimatingSections.length === 0 && this.overlapSections.length === 0)) return;
        
        const dimensions = { width: 900, height: 500 };
        const centerY = 170;
        const radius = Math.min(dimensions.width, dimensions.height) * 0.2;
        const firstCircleX = dimensions.width * 0.2;
        const secondCircleX = dimensions.width * 0.6;
        const angleStep = p.TWO_PI / this.fractionData.divisions;
        
        // Animation easing function (ease-in-out)
        const easeInOut = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };
        
        const easedProgress = easeInOut(this.animationProgress);
        
        // Get empty sections for normal animation
        const emptySections = this.getEmptySectionsInCircle1();
        
        // Animate normal sections (non-overlapping)
        this.normalAnimatingSections.forEach((sectionIndex, i) => {
            if (i < emptySections.length) {
                const targetSection = emptySections[i];
                
                // Calculate positions
                const sourceAngle = sectionIndex * angleStep;
                const targetAngle = targetSection * angleStep;
                
                // Interpolate position
                const currentX = p.lerp(secondCircleX, firstCircleX, easedProgress);
                const currentY = centerY;
                
                // Interpolate angle
                let angleDiff = targetAngle - sourceAngle;
                // Handle angle wrapping
                if (angleDiff > p.PI) angleDiff -= p.TWO_PI;
                if (angleDiff < -p.PI) angleDiff += p.TWO_PI;
                
                const currentAngle = sourceAngle + angleDiff * easedProgress;
                
                // Choose color based on animation type
                let fillColor, strokeColor;
                if (this.animationType === 'correct') {
                    fillColor = [0, 200, 0, 200]; // Green with transparency
                    strokeColor = [0, 150, 0];
                } else {
                    fillColor = [200, 150, 255, 200]; // Light purple with transparency
                    strokeColor = [150, 100, 200];
                }
                
                // Draw the moving section
                p.fill(fillColor[0], fillColor[1], fillColor[2], fillColor[3]);
                p.stroke(strokeColor[0], strokeColor[1], strokeColor[2]);
                p.strokeWeight(2);
                
                p.beginShape();
                p.vertex(currentX, currentY);
                for (let a = currentAngle; a <= currentAngle + angleStep; a += 0.01) {
                    let x = currentX + p.cos(a) * radius;
                    let y = currentY + p.sin(a) * radius;
                    p.vertex(x, y);
                }
                p.vertex(currentX, currentY);
                p.endShape(p.CLOSE);
                
                // Add a subtle glow effect
                p.fill(fillColor[0], fillColor[1], fillColor[2], 100);
                p.noStroke();
                p.beginShape();
                p.vertex(currentX, currentY);
                for (let a = currentAngle; a <= currentAngle + angleStep; a += 0.01) {
                    let x = currentX + p.cos(a) * (radius + 5);
                    let y = currentY + p.sin(a) * (radius + 5);
                    p.vertex(x, y);
                }
                p.vertex(currentX, currentY);
                p.endShape(p.CLOSE);
            }
        });
        
        // Animate overlap sections (light purple during animation, red when placed)
        this.overlapSections.forEach((sectionIndex, i) => {
            // For overlap sections, we'll animate them to occupy already filled spaces
            // or distribute them among available sections
            const allFilledSections = [];
            
            // Add originally filled sections
            for (let j = 0; j < this.fractionData.sectionsToFill; j++) {
                allFilledSections.push((this.startSection + j) % this.fractionData.divisions);
            }
            
            // Add sections that will be filled by normal animated sections
            for (let j = 0; j < Math.min(this.normalAnimatingSections.length, emptySections.length); j++) {
                allFilledSections.push(emptySections[j]);
            }
            
            // Choose a target section for this overlap (cycle through filled sections)
            const targetSection = allFilledSections[i % allFilledSections.length];
            
            // Calculate positions
            const sourceAngle = sectionIndex * angleStep;
            const targetAngle = targetSection * angleStep;
            
            // Interpolate position
            const currentX = p.lerp(secondCircleX, firstCircleX, easedProgress);
            const currentY = centerY;
            
            // Interpolate angle
            let angleDiff = targetAngle - sourceAngle;
            // Handle angle wrapping
            if (angleDiff > p.PI) angleDiff -= p.TWO_PI;
            if (angleDiff < -p.PI) angleDiff += p.TWO_PI;
            
            const currentAngle = sourceAngle + angleDiff * easedProgress;
            
            // Color changes based on animation progress
            let fillColor, strokeColor, glowColor;
            if (easedProgress < 0.8) {
                // Light purple during animation (until 80% complete)
                fillColor = [200, 150, 255, 200]; // Light purple with transparency
                strokeColor = [150, 100, 200];
                glowColor = [200, 150, 255, 100];
            } else {
                // Transition to red as it gets placed (last 20% of animation)
                const redTransition = (easedProgress - 0.8) / 0.2; // 0 to 1 for the last 20%
                fillColor = [
                    p.lerp(200, 255, redTransition), // R: purple to red
                    p.lerp(150, 100, redTransition), // G: reduce green
                    p.lerp(255, 100, redTransition), // B: reduce blue
                    200
                ];
                strokeColor = [
                    p.lerp(150, 200, redTransition),
                    p.lerp(100, 50, redTransition),
                    p.lerp(200, 50, redTransition)
                ];
                glowColor = [
                    p.lerp(200, 255, redTransition),
                    p.lerp(150, 150, redTransition),
                    p.lerp(255, 150, redTransition),
                    100
                ];
            }
            
            // Draw the moving section
            p.fill(fillColor[0], fillColor[1], fillColor[2], fillColor[3]);
            p.stroke(strokeColor[0], strokeColor[1], strokeColor[2]);
            p.strokeWeight(2);
            
            p.beginShape();
            p.vertex(currentX, currentY);
            for (let a = currentAngle; a <= currentAngle + angleStep; a += 0.01) {
                let x = currentX + p.cos(a) * radius;
                let y = currentY + p.sin(a) * radius;
                p.vertex(x, y);
            }
            p.vertex(currentX, currentY);
            p.endShape(p.CLOSE);
            
            // Add a glow effect that changes color with the section
            p.fill(glowColor[0], glowColor[1], glowColor[2], glowColor[3]);
            p.noStroke();
            p.beginShape();
            p.vertex(currentX, currentY);
            for (let a = currentAngle; a <= currentAngle + angleStep; a += 0.01) {
                let x = currentX + p.cos(a) * (radius + 5);
                let y = currentY + p.sin(a) * (radius + 5);
                p.vertex(x, y);
            }
            p.vertex(currentX, currentY);
            p.endShape(p.CLOSE);
        });
        
        // Show completion message when animation finishes
        if (this.animationProgress >= 1) {
            if (this.animationType === 'correct') {
                p.fill(0, 128, 0);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(24);
                p.textStyle(p.BOLD);
                p.text("Perfect! The fractions make a whole!", dimensions.width / 2, centerY + radius + 100);
                // Show new fraction button when correct
            this.updateNewFractionButtonVisibility();
            this.updateCheckButton(p);
            } else {
                p.fill(255, 0, 0);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(20);
                p.textStyle(p.BOLD);
                let message = "Try again! Attempts left: " + this.remainingAttempts;
                if (this.overlapSections.length > 0) {
                    message += " (Red sections show overlap)";
                }
                p.text(message, dimensions.width / 2, centerY + radius + 100);
                // Show new fraction button if no attempts left
                if (this.remainingAttempts === 0) {
                    this.updateNewFractionButtonVisibility();
                }
            }
        }
    }
    drawPermanentOverlapSections(p) {
        if (this.permanentOverlapSections.length === 0) return;
        const dimensions = { width: 900, height: 500 };
        const centerX = dimensions.width * 0.2;
        const centerY = 170;
        const radius = Math.min(dimensions.width, dimensions.height) * 0.2;
        const angleStep = p.TWO_PI / this.fractionData.divisions;
        
        // Draw permanent overlap sections in red
        p.fill(255, 100, 100, 200); 
        for (const sectionIndex of this.permanentOverlapSections) {
            const startAngle = sectionIndex * angleStep;
            const endAngle = (sectionIndex + 1) * angleStep;
            
            p.beginShape();
            p.vertex(centerX, centerY);
            for (let a = startAngle; a <= endAngle; a += 0.01) {
                let x = centerX + p.cos(a) * radius;
                let y = centerY + p.sin(a) * radius;
                p.vertex(x, y);
            }
            p.vertex(centerX, centerY);
            p.endShape(p.CLOSE);
        }
    }
    // Update the view with new fraction data
    updateFraction(fractionData) {
        this.fractionData = fractionData;
        this.startSection = Math.floor(Math.random() * fractionData.divisions);
        this.clickedSections = [];
        this.remainingAttempts = 3;
        this.isAnimating = false; // Reset animation state
        this.animationProgress = 0;
        this.permanentSections = []; // Clear permanent sections for new fraction
        this.permanentSectionType = null;
        this.overlapSections = []; // Clear overlap sections
        this.normalAnimatingSections = []; // Clear normal animating sections
        this.permanentOverlapSections = [];
        this.permanentOverlapSections = [];
        this.showEquation=false;
        
        if (this.tryAgainMessage) {
            this.tryAgainMessage.style('display', 'none');
        }

        if (this.p5Instance) {
            this.p5Instance.redraw();
        }
        
        if (this.checkButton) {
            this.updateCheckButton(this.p5Instance);
        }
        // Show check button for new problem
if (this.checkButton) {
    this.checkButton.style('display', 'block');
}
        this.animationType = null; // Reset animation type
// Hide new fraction button for new problem
this.updateNewFractionButtonVisibility();
    }

    bindMousePressed(callback) {
        this.onMousePressed = callback;
    }
    
    // Draw the fractioned circle
    drawFractionedCircle(p) {
        const dimensions = { width: 900, height: 500 };
        const centerX = dimensions.width * 0.2;
        const centerY = 170;
        const radius = Math.min(dimensions.width, dimensions.height) * 0.2;
        
        const divisions = this.fractionData.divisions;
        const sectionsToFill = this.fractionData.sectionsToFill;
        
        // Draw the main circle
        p.stroke(0);
        p.strokeWeight(2);
        p.noFill();
        p.circle(centerX, centerY, radius * 2);
        const angleStep = p.TWO_PI / divisions;
        p.fill(0, 128, 0);
        p.noStroke();
        
        for (let i = 0; i < sectionsToFill; i++) {
            const currentSection = (this.startSection + i) % divisions;
            const startAngle = currentSection * angleStep;
            const endAngle = (currentSection + 1) * angleStep;
            
            p.beginShape();
            p.vertex(centerX, centerY);
            for (let a = startAngle; a <= endAngle; a += 0.01) {
                let x = centerX + p.cos(a) * radius;
                let y = centerY + p.sin(a) * radius;
                p.vertex(x, y);
            }
            p.vertex(centerX, centerY);
            p.endShape(p.CLOSE);
        }
        
        // Draw permanent sections from previous attempts
        if (this.permanentSections.length > 0) {
            if (this.permanentSectionType === 'correct') {
                p.fill(0, 200, 0, 180); // Lighter green for permanent correct sections
            } else {
                p.fill(200, 150, 255, 200); // Light purple for permanent incorrect sections
            }
            p.noStroke();
            
            for (const sectionIndex of this.permanentSections) {
                const startAngle = sectionIndex * angleStep;
                const endAngle = (sectionIndex + 1) * angleStep;
                
                p.beginShape();
                p.vertex(centerX, centerY);
                for (let a = startAngle; a <= endAngle; a += 0.01) {
                    let x = centerX + p.cos(a) * radius;
                    let y = centerY + p.sin(a) * radius;
                    p.vertex(x, y);
                }
                p.vertex(centerX, centerY);
                p.endShape(p.CLOSE);
            }
        }
        
        // Draw division lines
        p.stroke(0);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([5, 3]);
        
        for (let i = 0; i < divisions; i++) {
            const angle = i * angleStep;
            const endX = centerX + radius * p.cos(angle);
            const endY = centerY + radius * p.sin(angle);
            p.line(centerX, centerY, endX, endY);
        }
        p.drawingContext.setLineDash([]);
        
        // Display the fraction on the left side of the circle
        const leftFractionX = centerX - radius - 20;
        console.log("leftFractionX", leftFractionX);
        const fractionY = centerY;
        this.drawFraction(p, leftFractionX, fractionY, sectionsToFill, divisions, 24);
        
        // Draw second circle
        const secondCircleX = dimensions.width * 0.6;
        
        p.stroke(0);
        p.strokeWeight(2);
        p.noFill();
        p.circle(secondCircleX, centerY, radius * 2);
        
        // Fill clicked sections (only if not animating)
        if (this.clickedSections && this.clickedSections.length > 0 && !this.isAnimating) {
            p.fill(128, 0, 128);
            p.noStroke();
            
            for (const sectionIndex of this.clickedSections) {
                const startAngle = sectionIndex * angleStep;
                const endAngle = (sectionIndex + 1) * angleStep;
                
                p.beginShape();
                p.vertex(secondCircleX, centerY);
                for (let a = startAngle; a <= endAngle; a += 0.01) {
                    let x = secondCircleX + p.cos(a) * radius;
                    let y = centerY + p.sin(a) * radius;
                    p.vertex(x, y);
                }
                p.vertex(secondCircleX, centerY);
                p.endShape(p.CLOSE);
            }
        }
        
        // Draw division lines for second circle
        p.stroke(0);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([5, 3]);
        
        for (let i = 0; i < divisions; i++) {
            const angle = i * angleStep;
            const endX = secondCircleX + radius * p.cos(angle);
            const endY = centerY + radius * p.sin(angle);
            p.line(secondCircleX, centerY, endX, endY);
        }
        p.drawingContext.setLineDash([]);
        
        // Draw animated sections on top
        this.drawAnimatedSections(p);
        this.drawPermanentOverlapSections(p);
        
        // Draw fraction for second circle
        const rightFractionX = secondCircleX + radius + 20 +20;
        
        if (this.clickedSections && this.clickedSections.length > 0) {
            p.fill(128, 0, 128);
            p.noStroke();
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(24);
            p.textStyle(p.BOLD);
            
            p.text(this.clickedSections.length, rightFractionX -5, fractionY - 12);
            
            p.stroke(128, 0, 128);    
            p.strokeWeight(1);
            p.line(rightFractionX - 25, fractionY, rightFractionX, fractionY);
            
            p.noStroke();
            p.text(divisions, rightFractionX -5, fractionY+5 + 12 );
        }
        
        // Add question text
        const questionY = centerY - radius - 30;
        
        p.fill(0);
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(18);
        p.textStyle(p.NORMAL);
        p.text("What fraction do you need to add to make", centerX-12, questionY);
        this.drawFraction(p, centerX + 190, questionY, sectionsToFill, divisions, 18);
        console.log("sectionsToFill", sectionsToFill);
        
        p.textSize(18);
        p.fill(0);
        p.textStyle(p.NORMAL);
        p.text("a whole?", centerX + 270, questionY);
        // Draw correct answers count at the bottom
        p.fill(0, 128, 0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.textStyle(p.BOLD);
        p.text("Number correct: " + this.correctAnswersCount, dimensions.width / 2, dimensions.height - 30);
        this.updateCheckButton(p);
        this.drawEquationAtBottom(p);
    }
    
    // Helper function to draw a fraction
    drawFraction(p, x, y, numerator, denominator, fontSize) {
        p.fill(0, 128, 0);
        p.noStroke();
        p.textAlign(p.RIGHT, p.CENTER);
        p.textSize(fontSize);
        p.textStyle(p.BOLD);
        
        p.text(numerator, x -5, y - fontSize/2 -5 );
        console.log("numerator", numerator);
        console.log("denominator", denominator);
        
        p.stroke(0, 128, 0);    
        p.strokeWeight(1);
        p.line(x - 25, y, x, y);
        
        p.noStroke();
        p.text(denominator, x -5, y + fontSize/2 +5);
    }
    // Control visibility of the new fraction button
updateNewFractionButtonVisibility() {
    const newFractionButton = document.getElementById('newFractionButton');
    if (!newFractionButton) return;
    
    // Show button only if answer is correct or all attempts are used
    const shouldShow = (this.animationType === 'correct' && this.animationProgress >= 1) || 
                      this.remainingAttempts === 0;
    
    if (shouldShow) {
        // newFractionButton.style.display = 'block';
        newFractionButton.disabled = false;
    } else {
        // newFractionButton.style.display = 'none';
         newFractionButton.disabled = true;
    }
   
}

// updateCheckButton(p) {
//     if (!this.checkButton) return;

//     if (this.animationType === 'correct' && this.animationProgress >= 1) {
//         this.checkButton.style('display', 'none');
//     } else {
//         this.checkButton.style('display', 'block');
//         this.checkButton.html('Check (' + this.remainingAttempts + ')');
        
//         if (this.clickedSections.length > 0 && this.remainingAttempts > 0 && !this.isAnimating) {
//             this.checkButton.style('background-color', '#4CAF50');
//             this.checkButton.style('color', 'white');
//             this.checkButton.removeAttribute('disabled');
//             this.checkButtonEnabled = true;
//         } else {
//             this.checkButton.style('background-color', '#cccccc');
//             this.checkButton.style('color', '#666666');
//             this.checkButton.attribute('disabled', '');
//             this.checkButtonEnabled = false;
//         }
//     }
    
//     // Update new fraction button visibility
//     this.updateNewFractionButtonVisibility();
// }

updateCheckButton(p) {
    if (!this.checkButton) return;

    if (this.animationType === 'correct' && this.animationProgress >= 1) {
        // this.checkButton.style.display = 'none';
    } else {
        // this.checkButton.style.display = 'block';
        this.checkButton.innerHTML = 'Check (' + this.remainingAttempts + ')';
        
        if (this.clickedSections.length > 0 && this.remainingAttempts > 0 && !this.isAnimating) {
            this.checkButton.style.backgroundColor = '#01296e';
             this.checkButton.style.color = '#f7f7f7';

            this.checkButton.removeAttribute('disabled');
            this.checkButtonEnabled = true;
        } else {
            // this.checkButton.style.backgroundColor = '#cccccc';
            // this.checkButton.style.color = '#666666';
            this.checkButton.setAttribute('disabled', '');
            this.checkButtonEnabled = false;
        }
    }
    
    // Update new fraction button visibility
    this.updateNewFractionButtonVisibility();
}

    checkSectionClick(p) {
        if (!this.fractionData || this.isAnimating) return;
        
        const dimensions = { width: 900, height: 500 };
        const secondCircleX = dimensions.width * 0.6;
        const centerY = 170;
        const radius = Math.min(dimensions.width, dimensions.height) * 0.2;
        
        const dx = p.mouseX - secondCircleX;
        const dy = p.mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= radius) {
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += p.TWO_PI;
            
            const divisions = this.fractionData.divisions;
            const angleStep = p.TWO_PI / divisions;
            const sectionIndex = Math.floor(angle / angleStep);
            
            const index = this.clickedSections.indexOf(sectionIndex);
            if (index === -1) {
                this.clickedSections.push(sectionIndex);
            } else {
                this.clickedSections.splice(index, 1);
            }
            
            this.updateCheckButton(p);
            if (this.permanentSections.length > 0 || this.permanentOverlapSections.length > 0) {
                this.permanentSections = [];
                this.permanentOverlapSections = [];
                this.permanentSectionType = null;
                
                // Hide try again message when resetting
                if (this.tryAgainMessage) {
                    this.tryAgainMessage.style('display', 'none');
                }
            }
            p.redraw();
        }
        
    }
}

// Controller - Connects Model and View
class FractionController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.view.initP5();
        this.model.bindFractionChanged(this.onFractionChanged.bind(this));
        this.view.bindMousePressed(this.onMousePressed.bind(this));
        
        this.onFractionChanged();
    }
    
    onFractionChanged() {
        const fractionData = this.model.getFractionData();
        this.view.updateFraction(fractionData);
    }
    
    onMousePressed() {
        this.model.generateNewFraction();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('canvasContainer')) {
        const container = document.createElement('div');
        container.id = 'canvasContainer';
        // container.style.marginTop = '-80px';
        document.body.appendChild(container);
    }
    // Initially hide the button

    const model = new FractionModel();
    const view = new FractionView();
    const controller = new FractionController(model, view);
    
    const newFractionButton = document.getElementById('newFractionButton');
    if (newFractionButton) {
        newFractionButton.addEventListener('click', function() {
            controller.onMousePressed();
        });
    }
// newFractionButton.style.display = 'none';
newFractionButton.disabled = false;
});