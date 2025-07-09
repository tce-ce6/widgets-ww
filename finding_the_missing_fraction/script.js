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

    generateNewFraction() {
        const randomIndex = Math.floor(Math.random() * this.possibleDivisions.length);
        this.divisions = this.possibleDivisions[randomIndex];
        this.sectionsToFill = Math.floor(Math.random() * (this.divisions - 1)) + 1;
        console.log(`Creating circle with ${this.divisions} divisions`);
        
        if (this.onFractionChanged) {
            this.onFractionChanged();
        }
    }

    bindFractionChanged(callback) {
        this.onFractionChanged = callback;
    }

    getCanvasDimensions() {
        return {
            width: this.width,
            height: this.height
        };
    }
    
    getFractionData() {
        return {
            divisions: this.divisions,
            sectionsToFill: this.sectionsToFill
        };
    }
}

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
        this.animationDuration = 2000;
        this.animationType = null;
        this.animatingSections = [];
        this.permanentSections = [];
        this.permanentSectionType = null;
        this.overlapSections = [];
        this.permanentOverlapSections = [];
        this.normalAnimatingSections = [];
        this.tryAgainMessage = null; 
        this.correctAnswersCount = 0;
        this.showEquation = false;
        this.messageAnimationProgress = 0; // New property for message animation
    }
    
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
    
    setup(p) {
        this.canvas = p.createCanvas(900, 500);
        this.canvas.style('display', 'block');
        this.canvas.style('margin', '0 auto');
        p.textFont('Arial');
        p.noLoop();
        
        const dimensions = { width: 900, height: 500 };
        const centerY = 170;
        
        this.checkButton = document.getElementById('checkButton');
        this.checkButton.style.backgroundColor = '#cccccc';
        this.checkButton.style.color = '#666666';
        this.checkButton.style.padding = '8px 16px';
        this.checkButton.style.border = 'none';
        this.checkButton.style.borderRadius = '4px';
        this.checkButton.style.fontSize = '16px';
        this.checkButton.setAttribute('disabled', '');
        
        const that = this;
        this.checkButton.addEventListener('click', function() {
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
            this.messageAnimationProgress = this.animationProgress; // Sync message animation
            
            if (this.animationProgress < 1) {
                p.loop();
            } else {
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
            const beforeMin = [];
            const afterMax = [];
            
            for (let i = (minFilled - 1 + totalSections) % totalSections; 
                 !filledSections.includes(i) && beforeMin.length < totalSections; 
                 i = (i - 1 + totalSections) % totalSections) {
                beforeMin.unshift(i);
            }
            
            for (let i = (maxFilled + 1) % totalSections; 
                 !filledSections.includes(i) && afterMax.length < totalSections; 
                 i = (i + 1) % totalSections) {
                afterMax.push(i);
            }
            
            adjacentSections = beforeMin.length >= afterMax.length ? beforeMin : afterMax;
        } else {
            const afterFilled = [];
            const beforeFilled = [];
            
            for (let i = (maxFilled + 1) % totalSections; 
                 !filledSections.includes(i) && afterFilled.length < totalSections; 
                 i = (i + 1) % totalSections) {
                afterFilled.push(i);
            }
            
            for (let i = (minFilled - 1 + totalSections) % totalSections; 
                 !filledSections.includes(i) && beforeFilled.length < totalSections; 
                 i = (i - 1 + totalSections) % totalSections) {
                beforeFilled.unshift(i);
            }
            
            adjacentSections = afterFilled.length > 0 ? afterFilled : beforeFilled;
        }
        
        const nonAdjacentSections = allEmptySections.filter(section => 
            !adjacentSections.includes(section)
        );
        
        return [...adjacentSections, ...nonAdjacentSections];
    }
    
    transferToPermanent() {
        this.permanentSections = [];
        this.permanentSectionType = this.animationType;
        
        if (this.normalAnimatingSections.length > 0) {
            const emptySections = this.getEmptySectionsInCircle1();
            const sectionsToAdd = Math.min(this.normalAnimatingSections.length, emptySections.length);
            this.permanentSections.push(...emptySections.slice(0, sectionsToAdd));
        }
        
        if (this.overlapSections.length > 0) {
            const allFilledSections = [];
            
            for (let j = 0; j < this.fractionData.sectionsToFill; j++) {
                allFilledSections.push((this.startSection + j) % this.fractionData.divisions);
            }
            
            const emptySections = this.getEmptySectionsInCircle1();
            for (let j = 0; j < Math.min(this.normalAnimatingSections.length, emptySections.length); j++) {
                allFilledSections.push(emptySections[j]);
            }
            
            this.permanentOverlapSections = this.overlapSections.map((sectionIndex, i) => {
                return allFilledSections[i % allFilledSections.length];
            });
        }
    }
    
    checkAnswer(p) {
        if (this.remainingAttempts <= 0) return;
        
        this.remainingAttempts--;
        
        const correctSections = this.fractionData.divisions - this.fractionData.sectionsToFill;
        const isCorrect = this.clickedSections.length === correctSections;
        if (isCorrect) { this.correctAnswersCount++; }
        
        if (!isCorrect) {
            this.permanentSections = [];
        }
        
        const emptySections = this.getEmptySectionsInCircle1();
        const availableSpaces = emptySections.length;
        const selectedCount = this.clickedSections.length;
        
        if (selectedCount <= availableSpaces) {
            this.normalAnimatingSections = [...this.clickedSections];
            this.overlapSections = [];
        } else {
            this.normalAnimatingSections = this.clickedSections.slice(0, availableSpaces);
            this.overlapSections = this.clickedSections.slice(availableSpaces);
        }
        
        this.animationType = isCorrect ? 'correct' : 'incorrect';
        this.animatingSections = [...this.clickedSections];
        this.isAnimating = true;
        this.animationProgress = 0;
        this.messageAnimationProgress = 0; // Reset message animation
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
        this.tryAgainMessage.html('');
        if (!this.tryAgainMessage) return;
        
        if (this.remainingAttempts === 2) {
            // this.tryAgainMessage.html('✗ Try again');
            // this.tryAgainMessage.style('color', '#ff0000');
        } else if (this.remainingAttempts === 1) {
            this.tryAgainMessage.html('Hint: Count the number of uncolored parts to see how many are needed to make a whole.');
            this.tryAgainMessage.style('color', '#ff0000');
        } else if (this.remainingAttempts === 0) {
            // this.tryAgainMessage.html('✗ Maybe next time');
            // this.tryAgainMessage.style('color', '#ff0000');
            this.showEquation = true;
        }
    }

    drawEquationAtBottom(p) {
        if (!this.showEquation || !this.fractionData) return;
        
        const dimensions = { width: 900, height: 500 };
        const equationY = dimensions.height - 80;
        const smallRadius = 25;
        const correctAnswer = this.fractionData.divisions - this.fractionData.sectionsToFill;
        
        const totalWidth = smallRadius * 6 + 120;
        const startX = (dimensions.width - totalWidth) / 2;
        
        const circle1X = startX + smallRadius;
        this.drawSmallFractionCircle(p, circle1X, equationY, smallRadius, this.fractionData.sectionsToFill, this.fractionData.divisions, this.startSection);
        
        p.fill(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(24);
        p.textStyle(p.BOLD);
        p.text('+', circle1X + smallRadius + 30, equationY);
        
        const circle2X = circle1X + smallRadius * 2 + 60;
        this.drawSmallFractionCircle(p, circle2X, equationY, smallRadius, correctAnswer, this.fractionData.divisions, 0);
        
        p.text('=', circle2X + smallRadius + 30, equationY);
        
        const circle3X = circle2X + smallRadius * 2 + 60;
        this.drawSmallFractionCircle(p, circle3X, equationY, smallRadius, this.fractionData.divisions, this.fractionData.divisions, 0);
    }

    drawSmallFractionCircle(p, centerX, centerY, radius, sectionsToFill, totalSections, startSection) {
        p.stroke(0);
        p.strokeWeight(1);
        p.noFill();
        p.circle(centerX, centerY, radius * 2);
        
        const angleStep = p.TWO_PI / totalSections;
        
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

    drawAnimatedSections(p) {
        if (!this.isAnimating || (this.normalAnimatingSections.length === 0 && this.overlapSections.length === 0)) return;
        
        const dimensions = { width: 900, height: 500 };
        const centerY = 170;
        const radius = Math.min(dimensions.width, dimensions.height) * 0.2;
        const firstCircleX = dimensions.width * 0.2;
        const secondCircleX = dimensions.width * 0.6;
        const angleStep = p.TWO_PI / this.fractionData.divisions;
        
        const easeInOut = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };
        
        const easedProgress = easeInOut(this.animationProgress);
        
        const emptySections = this.getEmptySectionsInCircle1();
        
        this.normalAnimatingSections.forEach((sectionIndex, i) => {
            if (i < emptySections.length) {
                const targetSection = emptySections[i];
                
                const sourceAngle = sectionIndex * angleStep;
                const targetAngle = targetSection * angleStep;
                
                const currentX = p.lerp(secondCircleX, firstCircleX, easedProgress);
                const currentY = centerY;
                
                let angleDiff = targetAngle - sourceAngle;
                if (angleDiff > p.PI) angleDiff -= p.TWO_PI;
                if (angleDiff < -p.PI) angleDiff += p.TWO_PI;
                
                const currentAngle = sourceAngle + angleDiff * easedProgress;
                
                let fillColor, strokeColor;
                if (this.animationType === 'correct') {
                    fillColor = [0, 200, 0, 200];
                    strokeColor = [0, 150, 0];
                } else {
                    fillColor = [200, 150, 255, 200];
                    strokeColor = [150, 100, 200];
                }
                
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
        
        this.overlapSections.forEach((sectionIndex, i) => {
            const allFilledSections = [];
            
            for (let j = 0; j < this.fractionData.sectionsToFill; j++) {
                allFilledSections.push((this.startSection + j) % this.fractionData.divisions);
            }
            
            for (let j = 0; j < Math.min(this.normalAnimatingSections.length, emptySections.length); j++) {
                allFilledSections.push(emptySections[j]);
            }
            
            const targetSection = allFilledSections[i % allFilledSections.length];
            
            const sourceAngle = sectionIndex * angleStep;
            const targetAngle = targetSection * angleStep;
            
            const currentX = p.lerp(secondCircleX, firstCircleX, easedProgress);
            const currentY = centerY;
            
            let angleDiff = targetAngle - sourceAngle;
            if (angleDiff > p.PI) angleDiff -= p.TWO_PI;
            if (angleDiff < -p.PI) angleDiff += p.TWO_PI;
            
            const currentAngle = sourceAngle + angleDiff * easedProgress;
            
            let fillColor, strokeColor, glowColor;
            if (easedProgress < 0.8) {
                fillColor = [200, 150, 255, 200];
                strokeColor = [150, 100, 200];
                glowColor = [200, 150, 255, 100];
            } else {
                const redTransition = (easedProgress - 0.8) / 0.2;
                fillColor = [
                    p.lerp(200, 255, redTransition),
                    p.lerp(150, 100, redTransition),
                    p.lerp(255, 100, redTransition),
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
        
        if (this.animationProgress >= 1) {
            if (this.animationType === 'correct') {
                // Message moved to drawFractionedCircle
                this.updateNewFractionButtonVisibility();
                this.updateCheckButton(p);
            } else {
                // Message moved to drawFractionedCircle
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

    updateFraction(fractionData) {
        this.fractionData = fractionData;
        this.startSection = Math.floor(Math.random() * fractionData.divisions);
        this.clickedSections = [];
        this.remainingAttempts = 3;
        this.isAnimating = false;
        this.animationProgress = 0;
        this.messageAnimationProgress = 0; // Reset message animation
        this.permanentSections = [];
        this.permanentSectionType = null;
        this.overlapSections = [];
        this.normalAnimatingSections = [];
        this.permanentOverlapSections = [];
        this.showEquation = false;
        
        if (this.tryAgainMessage) {
            this.tryAgainMessage.style('display', 'none');
        }

        if (this.p5Instance) {
            this.p5Instance.redraw();
        }
        
        if (this.checkButton) {
            this.updateCheckButton(this.p5Instance);
        }
        if (this.checkButton) {
            this.checkButton.style.display = 'block';
        }
        this.animationType = null;
        this.updateNewFractionButtonVisibility();
    }

    bindMousePressed(callback) {
        this.onMousePressed = callback;
    }
    
    drawFractionedCircle(p) {
        const dimensions = { width: 900, height: 500 };
        const centerX = dimensions.width * 0.2;
        const centerY = 170;
        const radius = Math.min(dimensions.width, dimensions.height) * 0.2;
        
        const divisions = this.fractionData.divisions;
        const sectionsToFill = this.fractionData.sectionsToFill;
        
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
        
        if (this.permanentSections.length > 0) {
            if (this.permanentSectionType === 'correct') {
                p.fill(0, 200, 0, 180);
            } else {
                p.fill(200, 150, 255, 200);
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
        
        const leftFractionX = centerX - radius - 20;
        this.drawFraction(p, leftFractionX, centerY, sectionsToFill, divisions, 24);
        
        const secondCircleX = dimensions.width * 0.6;
        
        p.stroke(0);
        p.strokeWeight(2);
        p.noFill();
        p.circle(secondCircleX, centerY, radius * 2);
        
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
        
        const rightFractionX = secondCircleX + radius + 40;
        
        if (this.clickedSections && this.clickedSections.length > 0) {
            p.fill(128, 0, 128);
            p.noStroke();
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(24);
            p.textStyle(p.BOLD);
            
            p.text(this.clickedSections.length, rightFractionX -5, centerY - 12);
            
            p.stroke(128, 0, 128);    
            p.strokeWeight(1);
            p.line(rightFractionX - 25, centerY, rightFractionX, centerY);
            
            p.noStroke();
            p.text(divisions, rightFractionX -5, centerY + 17);
        }
        
        const questionY = centerY - radius - 30;
        
        p.fill(0);
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(18);
        p.textStyle(p.NORMAL);
        p.text("What fraction do you need to add to make", centerX-12, questionY);
        this.drawFraction(p, centerX + 190, questionY, sectionsToFill, divisions, 18);
        
        p.textSize(18);
        p.textStyle(p.NORMAL);
        p.text("a whole?", centerX + 270, questionY);
        
        // Draw animated message instead of correct answers count
        if (this.animationProgress >= 1 && this.animationType) {
            const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const easedProgress = easeInOut(this.messageAnimationProgress);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(36); // Larger text size
            p.textStyle(p.BOLD);
            const messageY = dimensions.height - 30;
            
            if (this.animationType === 'correct') {
                p.fill(0, 128, 0, 255 * easedProgress); // Fade in green
                p.text("Great Job! 🎉", dimensions.width / 2, messageY);
            } else {
                p.fill(255, 0, 0, 255 * easedProgress); // Fade in red
                let message = `Try Again! 😕 (Attempts left: ${this.remainingAttempts})`;
               
                if (this.overlapSections.length > 0) {
                    message = `Too Many! 😕 (Attempts left: ${this.remainingAttempts})`;
                }
                 if(this.remainingAttempts === 0) {
                    message = `Maybe Next Time! 👍`
                }
                p.text(message, dimensions.width / 2, messageY);
            }
        }
        
        this.drawAnimatedSections(p);
        this.drawPermanentOverlapSections(p);
        this.updateCheckButton(p);
        this.drawEquationAtBottom(p);
    }
    
    drawFraction(p, x, y, numerator, denominator, fontSize) {
        p.fill(0, 128, 0);
        p.noStroke();
        p.textAlign(p.RIGHT, p.CENTER);
        p.textSize(fontSize);
        p.textStyle(p.BOLD);
        
        p.text(numerator, x -5, y - fontSize/2 -5);
        
        p.stroke(0, 128, 0);    
        p.strokeWeight(1);
        p.line(x - 25, y, x, y);
        
        p.noStroke();
        p.text(denominator, x -5, y + fontSize/2 +5);
    }

    updateNewFractionButtonVisibility() {
        const newFractionButton = document.getElementById('newFractionButton');
        if (!newFractionButton) return;
        
        const shouldShow = (this.animationType === 'correct' && this.animationProgress >= 1) || 
                          this.remainingAttempts === 0;
        
        newFractionButton.disabled = !shouldShow;
    }

    updateCheckButton(p) {
        if (!this.checkButton) return;

        if (this.animationType === 'correct' && this.animationProgress >= 1) {
            // this.checkButton.style.display = 'none';
        } else {
            this.checkButton.innerHTML = 'Check (' + this.remainingAttempts + ')';
            
            if (this.clickedSections.length > 0 && this.remainingAttempts > 0 && !this.isAnimating) {
                this.checkButton.style.backgroundColor = '#01296e';
                this.checkButton.style.color = '#f7f7f7';
                this.checkButton.removeAttribute('disabled');
                this.checkButtonEnabled = true;
            } else {
                this.checkButton.setAttribute('disabled', '');
                this.checkButtonEnabled = false;
            }
        }
        
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
                
                if (this.tryAgainMessage) {
                    this.tryAgainMessage.style('display', 'none');
                }
            }
            p.redraw();
        }
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('canvasContainer')) {
        const container = document.createElement('div');
        container.id = 'canvasContainer';
        document.body.appendChild(container);
    }

    const model = new FractionModel();
    const view = new FractionView();
    const controller = new FractionController(model, view);
    
    const newFractionButton = document.getElementById('newFractionButton');
    if (newFractionButton) {
        newFractionButton.addEventListener('click', function() {
            controller.onMousePressed();
        });
    }
    newFractionButton.disabled = true;
});