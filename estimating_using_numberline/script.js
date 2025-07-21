// Model - Handles data and business logic
class FractionModel {
    constructor() {
        this.resetProblem();
    }

    resetProblem() {
        // Generate two random mixed fractions
        this.fraction1 = this.generateRandomMixedFraction();
        this.fraction2 = this.generateRandomMixedFraction();
        
        // Calculate the exact sum
        this.exactSum = this.calculateExactSum(this.fraction1, this.fraction2);
    }

    generateRandomMixedFraction() {
        // Generate a mixed number with whole part between 1-4 (ensuring it's mixed)
        const whole = Math.floor(Math.random() * 4) + 1; // 1 to 4
        const numerator = Math.floor(Math.random() * 9) + 1; // 1 to 9
        const denominator = Math.floor(Math.random() * 9) + 2; // 2 to 10
        
        // Calculate the fractional value
        const fractionalValue = numerator / denominator;
        
        // Make sure the total value doesn't exceed 5 and the fractional part is > 0.5
        const value = whole + fractionalValue;
        if (value > 5 || fractionalValue < 0.5) {
            return this.generateRandomMixedFraction(); // Try again if too large or fractional part too small
        }
        
        return {
            whole,
            numerator,
            denominator,
            value
        };
    }

    calculateExactSum(fraction1, fraction2) {
        return fraction1.value + fraction2.value;
    }

    getFractionString(fraction, colorClass = '') {
        let colorTag = '';
        if (colorClass === 'purple') {
            colorTag = `\\color{#8080FF}`; // Purple color from the image
        } else if (colorClass === 'pink') {
            colorTag = `\\color{#FF80B0}`; // Pink color from the image
        }
        
        if (fraction.whole === 0) {
            return `${colorTag}\\frac{${fraction.numerator}}{${fraction.denominator}}`;
        } else {
            return `${colorTag}${fraction.whole}\\frac{${fraction.numerator}}{${fraction.denominator}}`;
        }
    }

    getProblemString() {
        // Return the fractions separately without the plus sign
        return `${this.getFractionString(this.fraction1, 'purple')} \\color{black}{+} ${this.getFractionString(this.fraction2, 'pink')}`;
    }

    getFirstFractionString() {
        // Return only the first fraction for Step 1
        return `${this.getFractionString(this.fraction1, 'purple')}`;
    }
    getSecondFractionString() {
        // Return only the first fraction for Step 1
        return `${this.getFractionString(this.fraction2, 'pink')}`;
    }
}

// View - Handles the UI
class FractionView {
    constructor() {
        this.equationElement = document.getElementById('equation');
        this.newProblemButton = document.getElementById('new-problem-btn');
        
        // P5.js sketch will be initialized later
        this.sketch = null;
    }

    initializeCanvas(model) {
        const numberLineContainer = document.getElementById('number-line-container');
        numberLineContainer.innerHTML = '';
        
        // Initialize the purple box properties
        this.purpleBox = {
            startX: 50,
            endX: 50,
            y: 140,
            height: 30,
            isDragging: false,
            touchId: null // Add touchId for touch events
        };
        
        // Initialize button and solution visibility flags
        this.showCompareButton = false;
        this.showExactSolution = false;
        
        // Create a new p5 instance with just a basic canvas
        this.sketch = new p5((p) => {
            p.setup = () => {
                const canvas = p.createCanvas(900, 500);
                canvas.parent(numberLineContainer);
                
                // Add touch event listeners to canvas
                const canvasElement = canvas.elt;
                canvasElement.addEventListener('touchstart', (e) => this.handleTouchStart(e, p), { passive: false });
                canvasElement.addEventListener('touchmove', (e) => this.handleTouchMove(e, p), { passive: false });
                canvasElement.addEventListener('touchend', (e) => this.handleTouchEnd(e, p), { passive: false });
            };
            
            p.draw = () => {
                // Basic white background
                p.background(255);
    
                // Draw a border to visualize the canvas
                p.stroke(0);
                p.strokeWeight(0);
                p.noFill();
                p.rect(0, 0, p.width, p.height);
                
                // Draw text instructions directly on canvas
                this.drawInstructions(p, model);
                
                // Draw number line and other elements
                this.drawNumberLine(p, model);
            };
        });
    }

    drawInstructions(p, model) {
        p.push();
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(16);
        p.fill(0);
        p.noStroke();
        
        // Create an off-screen container for MathJax if it doesn't exist
        if (!this.mathJaxContainer) {
            this.mathJaxContainer = document.createElement('div');
            this.mathJaxContainer.style.position = 'absolute';
            this.mathJaxContainer.style.visibility = 'hidden';
            this.mathJaxContainer.style.pointerEvents = 'none';
            document.body.appendChild(this.mathJaxContainer);
            
            // Create a method to render math and draw it on canvas
            this.renderMathToCanvas = (p, mathString, x, y, color = 'black') => {
                this.mathJaxContainer.innerHTML = `<span style="color:${color}">\\(${mathString}\\)</span>`;
                
                if (window.MathJax) {
                    MathJax.typesetPromise([this.mathJaxContainer]).then(() => {
                        p.drawMath = true;
                    }).catch(err => console.log(err));
                }
            };
            
            // Create a method to draw mixed fractions directly on canvas
            this.drawMixedFraction = (p, fraction, x, y, color) => {
                const fontSize = p.textSize();
                const fractionSize = fontSize * 0.8;
                const lineY = y + fontSize/2;
                
                let currentX = x;
                p.fill(color);
                
                if (fraction.whole > 0) {
                    p.textSize(fontSize);
                    p.text(fraction.whole, currentX, y);
                    currentX += p.textWidth(fraction.whole.toString()) + 5;
                }
                
                p.textSize(fractionSize);
                
                const numWidth = p.textWidth(fraction.numerator.toString());
                const denomWidth = p.textWidth(fraction.denominator.toString());
                const fractionWidth = Math.max(numWidth, denomWidth) + 10;
                
                p.textAlign(p.CENTER, p.BOTTOM);
                p.text(fraction.numerator, currentX + fractionWidth/2, lineY - 2);
                
                p.stroke(color);
                p.strokeWeight(1.5);
                p.line(currentX, lineY, currentX + fractionWidth, lineY);
                
                p.noStroke();
                p.textAlign(p.CENTER, p.TOP);
                p.text(fraction.denominator, currentX + fractionWidth/2, lineY + 2);
                
                p.textSize(fontSize);
                p.textAlign(p.LEFT, p.TOP);
                
                return currentX + fractionWidth;
            };
        }
        
        let xPos = 300;
        p.text("Estimate", xPos-270, 20);
        xPos += p.textWidth("Estimate ") + 10;
        
        xPos = this.drawMixedFraction(p, model.fraction1, xPos-280, 20, '#8080FF');
        
        p.fill(0);
        p.text("+", xPos + 10, 20);
        xPos += p.textWidth("+") + 20;
        
        xPos = this.drawMixedFraction(p, model.fraction2, xPos-5, 20, '#FF80B0');
        
        p.fill(0);
        p.text("by dragging the bars.", xPos-7 + 20, 20);
        
        xPos = 300;
        p.fill(0);
        p.text("Step 1: Estimate", xPos-270, 80);
        xPos += p.textWidth("Step 1: Estimate ") + 10;
        
        this.drawMixedFraction(p, model.fraction1, xPos-275, 80, '#8080FF');
        
        if (this.showStep2) {
            xPos = 300;
            p.fill(0);
            p.text("Step 2: Estimate", xPos-275, 220);
            xPos += p.textWidth("Step 2: Estimate ") + 10;
            
            xPos = this.drawMixedFraction(p, model.fraction1, xPos-280, 220, '#808080');
            
            p.fill(0);
            p.text("+", xPos + 10, 220);
            xPos += p.textWidth("+") + 20;
            
            this.drawMixedFraction(p, model.fraction2, xPos, 220, '#FF80B0');
        }
        p.pop();
    }

    drawExpandableBox(p, startX, lineY, unitWidth, model) {
        this.purpleBox.startX = startX;
        
        if (this.purpleBox.endX <= this.purpleBox.startX) {
            this.purpleBox.endX = startX + unitWidth/2;
        }
        
        this.purpleBox.y = lineY - 30;
        
        p.mousePressed = () => {
            if (!this.showExactSolution && 
                Math.abs(p.mouseX - this.purpleBox.endX) < 10 && 
                p.mouseY > this.purpleBox.y && 
                p.mouseY < this.purpleBox.y + this.purpleBox.height) {
                this.purpleBox.isDragging = true;
            }
        };
        
        p.mouseDragged = () => {
            if (this.purpleBox.isDragging && !this.showExactSolution) {
                this.purpleBox.endX = p.mouseX;
                
                if (this.purpleBox.endX < this.purpleBox.startX + unitWidth/2) {
                    this.purpleBox.endX = this.purpleBox.startX + unitWidth/2;
                }
                if (this.purpleBox.endX > startX + unitWidth * 5) {
                    this.purpleBox.endX = startX + unitWidth * 5;
                }
            }
        };
        
        p.mouseReleased = () => {
            if (this.purpleBox.isDragging) {
                this.purpleBox.isDragging = false;
                this.showStep2 = true;
            }
            else if (this.pinkBox && this.pinkBox.isDragging) {
                this.pinkBox.isDragging = false;
                this.showCompareButton = true;
            }
        };
        
        p.fill('#8080FF');
        p.stroke(0);
        p.strokeWeight(2);
        const boxWidth = this.purpleBox.endX - this.purpleBox.startX;
        p.rect(this.purpleBox.startX, this.purpleBox.y, boxWidth, this.purpleBox.height);
    }

    drawNumberLine(p, model) {
        const lineY = 160;
        const startX = 50;
        const endX = 850;
        const lineLength = endX - startX;
        const unitWidth = lineLength / 10;
        
        p.stroke(0);
        p.strokeWeight(2);
        p.line(startX - 20, lineY, endX + 20, lineY);
        
        p.line(startX-9, lineY - 8, startX - 20, lineY);
        p.line(startX - 9, lineY + 8, startX - 20, lineY);
        
        p.line(endX + 9, lineY - 8, endX + 20, lineY);
        p.line(endX + 9, lineY + 8, endX + 20, lineY);
        
        p.textSize(12);
        p.textAlign(p.CENTER, p.CENTER);
        
        for (let i = 0; i <= 20; i++) {
            const x = startX + (i * unitWidth / 2);
            const tickHeight = i % 2 === 0 ? 10 : 5;
            
            p.stroke(0);
            p.line(x, lineY - tickHeight, x, lineY + tickHeight);
            
            if (i % 2 === 0) {
                p.noStroke();
                p.fill(0);
                p.text(i/2, x, lineY + 25);
            }
        }
        
        this.drawExpandableBox(p, startX, lineY, unitWidth, model);
        
        if (this.showStep2) {
            this.drawSecondNumberLine(p, startX, lineY, endX, unitWidth, model);
        }
    }
    
    drawSecondNumberLine(p, startX, lineY, endX, unitWidth, model) {
        const secondLineY = lineY + 140;
        
        p.stroke(0);
        p.strokeWeight(2);
        p.line(startX - 20, secondLineY, endX + 20, secondLineY);
        
        p.line(startX-9, secondLineY - 8, startX - 20, secondLineY);
        p.line(startX - 9, secondLineY + 8, startX - 20, secondLineY);
        p.line(endX + 9, secondLineY - 8, endX + 20, secondLineY);
        p.line(endX + 9, secondLineY + 8, endX + 20, secondLineY);
        
        for (let i = 0; i <= 20; i++) {
            const x = startX + (i * unitWidth / 2);
            const tickHeight = i % 2 === 0 ? 10 : 5;
            
            p.stroke(0);
            p.line(x, secondLineY - tickHeight, x, secondLineY + tickHeight);
            
            if (i % 2 === 0) {
                p.noStroke();
                p.fill(0);
                p.text(i/2, x, secondLineY + 25);
            }
        }
        
        const purpleBoxWidth = this.purpleBox.endX - this.purpleBox.startX;
        p.fill(180);
        p.stroke(0);
        p.strokeWeight(2);
        p.rect(startX, secondLineY - 30, purpleBoxWidth, 30);
        
        const greyBoxEndX = startX + purpleBoxWidth;
        
        if (!this.pinkBox) {
            this.pinkBox = {
                startX: greyBoxEndX,
                endX: greyBoxEndX + unitWidth/2,
                y: secondLineY - 30,
                height: 30,
                isDragging: false,
                touchId: null
            };
        } else {
            this.pinkBox.startX = greyBoxEndX;
            this.pinkBox.y = secondLineY - 30;
            
            if (this.purpleBox.isDragging) {
                this.pinkBox.endX = this.pinkBox.startX + unitWidth/2;
            }
        }
        
        p.fill('#FF80B0');
        p.stroke(0);
        p.strokeWeight(2);
        const pinkBoxWidth = this.pinkBox.endX - this.pinkBox.startX;
        p.rect(this.pinkBox.startX, this.pinkBox.y, pinkBoxWidth, this.pinkBox.height);
        
        this.handlePinkBoxDragging(p, startX, unitWidth, model, secondLineY);
    }
    
    handlePinkBoxDragging(p, startX, unitWidth, model, lineY) {
        if (!this.pinkBox) {
            this.pinkBox = {
                startX: this.purpleBox.endX,
                endX: this.purpleBox.endX + unitWidth/2,
                y: lineY - 30,
                height: 30,
                isDragging: false,
                touchId: null
            };
        }
        
        p.mousePressed = () => {
            if (!this.showExactSolution) {
                if (Math.abs(p.mouseX - this.purpleBox.endX) < 10 && 
                    p.mouseY > this.purpleBox.y && 
                    p.mouseY < this.purpleBox.y + this.purpleBox.height) {
                    this.purpleBox.isDragging = true;
                }
                else if (Math.abs(p.mouseX - this.pinkBox.endX) < 10 && 
                    p.mouseY > this.pinkBox.y && 
                    p.mouseY < this.pinkBox.y + this.pinkBox.height) {
                    this.pinkBox.isDragging = true;
                }
            }
            
            if (this.compareButton && 
                p.mouseX > this.compareButton.x && 
                p.mouseX < this.compareButton.x + this.compareButton.width &&
                p.mouseY > this.compareButton.y && 
                p.mouseY < this.compareButton.y + this.compareButton.height) {
                this.showExactSolution = true;
            }
        };
        
        p.mouseDragged = () => {
            if (!this.showExactSolution) {
                if (this.purpleBox.isDragging) {
                    this.purpleBox.endX = p.mouseX;
                    
                    if (this.purpleBox.endX < this.purpleBox.startX + unitWidth/2) {
                        this.purpleBox.endX = this.purpleBox.startX + unitWidth/2;
                    }
                    if (this.purpleBox.endX > startX + unitWidth * 5) {
                        this.purpleBox.endX = startX + unitWidth * 5;
                    }
                }
                else if (this.pinkBox.isDragging) {
                    this.pinkBox.endX = p.mouseX;
                    
                    if (this.pinkBox.endX < this.pinkBox.startX + unitWidth/2) {
                        this.pinkBox.endX = this.pinkBox.startX + unitWidth/2;
                    }
                    if (this.pinkBox.endX > this.pinkBox.startX + unitWidth * 5) {
                        this.pinkBox.endX = this.pinkBox.startX + unitWidth * 5;
                    }
                }
            }
        };
        
        p.mouseReleased = () => {
            if (this.purpleBox.isDragging) {
                this.purpleBox.isDragging = false;
                this.showStep2 = true;
            }
            else if (this.pinkBox.isDragging) {
                this.pinkBox.isDragging = false;
                this.showCompareButton = true;
            }
        };
        
        if (this.showCompareButton && !this.showExactSolution) {
            const buttonWidth = 180;
            const buttonHeight = 30;
            const buttonX = p.width/4 - buttonWidth-25;
            const buttonY = lineY + 50;
            
            this.compareButton = {
                x: buttonX,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight
            };
            
            p.fill(255);
            p.stroke(150);
            p.strokeWeight(2);
            p.rect(buttonX, buttonY, buttonWidth, buttonHeight, 5);
            
            p.fill('#8080FF');
            p.noStroke();
            p.textSize(14);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Compare to Exact Solution", buttonX + buttonWidth/2, buttonY + buttonHeight/2);
        }
        
        if (this.showExactSolution) {
            this.drawExactSolution(p, model, startX, lineY, unitWidth);
        }
    }
    
    drawExactSolution(p, model, startX, lineY, unitWidth) {
        const thirdLineY = lineY + 100;
        
        p.stroke(0);
        p.strokeWeight(2);
        p.line(startX - 20, thirdLineY, startX + unitWidth * 10 + 20, thirdLineY);
        
        p.line(startX-9, thirdLineY - 8, startX - 20, thirdLineY);
        p.line(startX - 9, thirdLineY + 8, startX - 20, thirdLineY);
        p.line(startX + unitWidth * 10 + 9, thirdLineY - 8, startX + unitWidth * 10 + 20, thirdLineY);
        p.line(startX + unitWidth * 10 + 9, thirdLineY + 8, startX + unitWidth * 10 + 20, thirdLineY);
        
        for (let i = 0; i <= 20; i++) {
            const x = startX + (i * unitWidth / 2);
            const tickHeight = i % 2 === 0 ? 10 : 5;
            
            p.stroke(0);
            p.line(x, thirdLineY - tickHeight, x, thirdLineY + tickHeight);
            
            if (i % 2 === 0) {
                p.noStroke();
                p.fill(0);
                p.text(i/2, x, thirdLineY + 25);
            }
        }
        
        const fraction1Value = model.fraction1.value;
        const fraction2Value = model.fraction2.value;
        const exactSum = model.exactSum;
        
        const fraction1StartX = startX;
        const fraction1EndX = startX + (fraction1Value * unitWidth);
        const fraction2StartX = fraction1EndX;
        const fraction2EndX = fraction2StartX + (fraction2Value * unitWidth);
        
        p.fill('#009688');
        p.stroke(0);
        p.strokeWeight(2);
        const firstGreenBoxWidth = fraction1Value * unitWidth;
        p.rect(fraction1StartX, thirdLineY - 30, firstGreenBoxWidth, 30);
        
        const secondGreenBoxWidth = fraction2Value * unitWidth;
        p.rect(fraction2StartX, thirdLineY - 30, secondGreenBoxWidth, 30);
        
        p.stroke(0);
        p.strokeWeight(1);
        
        this.drawDottedLine(p, fraction1StartX, thirdLineY - 30, this.purpleBox.startX, lineY);
        this.drawDottedLine(p, fraction1EndX, thirdLineY - 30, this.purpleBox.endX, lineY);
        this.drawDottedLine(p, fraction2StartX, thirdLineY - 30, this.pinkBox.startX, lineY);
        this.drawDottedLine(p, fraction2EndX, thirdLineY - 30, this.pinkBox.endX, lineY);
        
        p.fill(0);
        p.noStroke();
        p.textSize(16);
        p.textAlign(p.LEFT, p.TOP);
        
        const sumWhole = Math.floor(model.exactSum);
        const sumFrac = model.exactSum - sumWhole;
        const sumDenom = model.fraction2.denominator;
        const sumNum = Math.round(sumFrac * sumDenom);
        
        let textX = startX + 50;
        const textY = thirdLineY + 50;
        
        p.text("Exact solution:", textX-70, textY+10);
        textX += p.textWidth("Exact solution: ") + 10;
        
        textX = this.drawMixedFraction(p, model.fraction1, textX-80, textY+10, 0);
        
        p.fill(0);
        p.text(" + ", textX, textY+10);
        textX += p.textWidth(" + ");
        
        textX = this.drawMixedFraction(p, model.fraction2, textX, textY+10, 0);
        
        p.fill(0);
        p.text(" = ", textX, textY+10);
        textX += p.textWidth(" = ");
        
        const sumFraction = {
            whole: sumWhole,
            numerator: sumNum,
            denominator: sumDenom,
            value: model.exactSum
        };
        this.drawMixedFraction(p, sumFraction, textX, textY+10, 0);
    }
    
    formatMixedFraction(fraction) {
        if (fraction.whole === 0) {
            return fraction.numerator + "/" + fraction.denominator;
        } else {
            return fraction.whole + " " + fraction.numerator + "/" + fraction.denominator;
        }
    }
    
    drawDottedLine(p, x1, y1, x2, y2) {
        p.strokeWeight(2);
        
        const verticalSteps = 20;
        for (let i = 0; i <= verticalSteps; i++) {
            if (i % 2 === 0) {
                const y = p.lerp(y1, y2, i / verticalSteps);
                p.point(x1, y);
            }
        }
        
        const horizontalSteps = Math.abs(x2 - x1) / 3;
        for (let i = 0; i <= horizontalSteps; i++) {
            if (i % 2 === 0) {
                const x = p.lerp(x1, x2, i / horizontalSteps);
                p.point(x, y2);
            }
        }
    }

    handleTouchStart(e, p) {
        e.preventDefault();
        const touches = e.changedTouches;
        if (!touches.length) return;

        const rect = p.canvas.getBoundingClientRect();
        const scaleX = p.width / rect.width;
        const scaleY = p.height / rect.height;

        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const touchX = (touch.clientX - rect.left) * scaleX;
            const touchY = (touch.clientY - rect.top) * scaleY;

            if (!this.showExactSolution) {
                if (Math.abs(touchX - this.purpleBox.endX) < 20 &&
                    touchY > this.purpleBox.y &&
                    touchY < this.purpleBox.y + this.purpleBox.height) {
                    this.purpleBox.isDragging = true;
                    this.purpleBox.touchId = touch.identifier;
                    break;
                }
                else if (this.pinkBox &&
                         Math.abs(touchX - this.pinkBox.endX) < 20 &&
                         touchY > this.pinkBox.y &&
                         touchY < this.pinkBox.y + this.pinkBox.height) {
                    this.pinkBox.isDragging = true;
                    this.pinkBox.touchId = touch.identifier;
                    break;
                }
            }
            
            if (this.compareButton &&
                touchX > this.compareButton.x &&
                touchX < this.compareButton.x + this.compareButton.width &&
                touchY > this.compareButton.y &&
                touchY < this.compareButton.y + this.compareButton.height) {
                this.showExactSolution = true;
                break;
            }
        }
    }

    handleTouchMove(e, p) {
        e.preventDefault();
        const touches = e.touches;
        if (!touches.length) return;

        const rect = p.canvas.getBoundingClientRect();
        const scaleX = p.width / rect.width;
        const scaleY = p.height / rect.height;
        const unitWidth = (850 - 50) / 10;

        let activeTouch = null;
        for (let i = 0; i < touches.length; i++) {
            if ((this.purpleBox.isDragging && touches[i].identifier === this.purpleBox.touchId) ||
                (this.pinkBox && this.pinkBox.isDragging && touches[i].identifier === this.pinkBox.touchId)) {
                activeTouch = touches[i];
                break;
            }
        }

        if (!activeTouch || this.showExactSolution) return;

        const touchX = (activeTouch.clientX - rect.left) * scaleX;

        if (this.purpleBox.isDragging) {
            this.purpleBox.endX = touchX;
            
            if (this.purpleBox.endX < this.purpleBox.startX + unitWidth/2) {
                this.purpleBox.endX = this.purpleBox.startX + unitWidth/2;
            }
            if (this.purpleBox.endX > 50 + unitWidth * 5) {
                this.purpleBox.endX = 50 + unitWidth * 5;
            }
        }
        else if (this.pinkBox && this.pinkBox.isDragging) {
            this.pinkBox.endX = touchX;
            
            if (this.pinkBox.endX < this.pinkBox.startX + unitWidth/2) {
                this.pinkBox.endX = this.pinkBox.startX + unitWidth/2;
            }
            if (this.pinkBox.endX > this.pinkBox.startX + unitWidth * 5) {
                this.pinkBox.endX = this.pinkBox.startX + unitWidth * 5;
            }
        }
    }

    handleTouchEnd(e, p) {
        e.preventDefault();
        const touches = e.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            if (this.purpleBox.isDragging && touch.identifier === this.purpleBox.touchId) {
                this.purpleBox.isDragging = false;
                this.purpleBox.touchId = null;
                this.showStep2 = true;
                break;
            }
            else if (this.pinkBox && this.pinkBox.isDragging && touch.identifier === this.pinkBox.touchId) {
                this.pinkBox.isDragging = false;
                this.pinkBox.touchId = null;
                this.showCompareButton = true;
                break;
            }
        }
    }
}

// Controller - Handles user input and updates model and view
class FractionController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.view.initializeCanvas(this.model);
        
        this.view.newProblemButton.addEventListener('click', () => this.newProblem());
        
        this.view.newProblemButton.style.backgroundColor = '#8080FF';
        this.view.newProblemButton.style.color = 'white';
        this.view.newProblemButton.style.border = 'none';
        this.view.newProblemButton.style.padding = '8px 16px';
        this.view.newProblemButton.style.borderRadius = '5px';
        this.view.newProblemButton.style.cursor = 'pointer';
    }
    
    newProblem() {
        this.model.resetProblem();
        
        this.view.showStep2 = false;
        this.view.pinkBox = null;
        this.view.showCompareButton = false;
        this.view.showExactSolution = false;
        
        if (this.view.exactSolutionDiv) {
            this.view.exactSolutionDiv.remove();
            this.view.exactSolutionDiv = null;
        }
        
        this.view.initializeCanvas(this.model);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const model = new FractionModel();
    const view = new FractionView();
    const controller = new FractionController(model, view);
});