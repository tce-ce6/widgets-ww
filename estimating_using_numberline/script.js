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

    // First, add the missing method to the FractionModel class
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

    // Then fix the canvas positioning in the FractionView class
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

    // New method to draw text instructions directly on canvas
    drawInstructions(p, model) {
        p.push();
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(16);
        p.fill(0);
        p.noStroke(); // Remove the parameter
        
        // Create an off-screen container for MathJax if it doesn't exist
        if (!this.mathJaxContainer) {
            this.mathJaxContainer = document.createElement('div');
            this.mathJaxContainer.style.position = 'absolute';
            this.mathJaxContainer.style.visibility = 'hidden'; // Hide it
            this.mathJaxContainer.style.pointerEvents = 'none'; // Prevent interaction
            document.body.appendChild(this.mathJaxContainer);
            
            // Create a method to render math and draw it on canvas
            this.renderMathToCanvas = (p, mathString, x, y, color = 'black') => {
                // Set the math content
                this.mathJaxContainer.innerHTML = `<span style="color:${color}">\\(${mathString}\\)</span>`;
                
                // Typeset with MathJax
                if (window.MathJax) {
                    MathJax.typesetPromise([this.mathJaxContainer]).then(() => {
                        // Draw the rendered math on canvas in the next frame
                        p.drawMath = true;
                    }).catch(err => console.log(err));
                }
            };
            
            // Create a method to draw mixed fractions directly on canvas
            this.drawMixedFraction = (p, fraction, x, y, color) => {
                const fontSize = p.textSize();
                const fractionSize = fontSize * 0.8; // Slightly smaller for fraction
                const lineY = y + fontSize/2;
                
                let currentX = x;
                p.fill(color);
                
                // If there's a whole number part
                if (fraction.whole > 0) {
                    p.textSize(fontSize);
                    p.text(fraction.whole, currentX, y);
                    currentX += p.textWidth(fraction.whole.toString()) + 5;
                }
                
                // Draw the fraction part
                p.textSize(fractionSize);
                
                // Calculate widths
                const numWidth = p.textWidth(fraction.numerator.toString());
                const denomWidth = p.textWidth(fraction.denominator.toString());
                const fractionWidth = Math.max(numWidth, denomWidth) + 10;
                
                // Draw numerator
                p.textAlign(p.CENTER, p.BOTTOM);
                p.text(fraction.numerator, currentX + fractionWidth/2, lineY - 2);
                
                // Draw fraction line
                p.stroke(color);
                p.strokeWeight(1.5);
                p.line(currentX, lineY, currentX + fractionWidth, lineY);
                
                // Draw denominator
                p.noStroke();
                p.textAlign(p.CENTER, p.TOP);
                p.text(fraction.denominator, currentX + fractionWidth/2, lineY + 2);
                
                // Reset text size and alignment
                p.textSize(fontSize);
                p.textAlign(p.LEFT, p.TOP);
                
                // Return the new x position
                return currentX + fractionWidth;
            };
        }
        
        // Draw the main problem statement
        let xPos = 300;
        p.text("Estimate", xPos-270, 20);
        xPos += p.textWidth("Estimate ") + 10;
        
        // Draw the first fraction in purple
        xPos = this.drawMixedFraction(p, model.fraction1, xPos-280, 20, '#8080FF');
        
        // Draw the plus sign in black
        p.fill(0);
        p.text("+", xPos + 10, 20);
        xPos += p.textWidth("+") + 20;
        
        // Draw the second fraction in pink
        xPos = this.drawMixedFraction(p, model.fraction2, xPos-5, 20, '#FF80B0');
        
        // Continue with black text
        p.fill(0);
        p.text("by dragging the bars.", xPos-7 + 20, 20);
        
        // Draw Step 1
        xPos = 300;
        p.fill(0);
        p.text("Step 1: Estimate", xPos-270, 80);
        xPos += p.textWidth("Step 1: Estimate ") + 10;
        
        // Draw first fraction in purple
        this.drawMixedFraction(p, model.fraction1, xPos-275, 80, '#8080FF');
        
        // Draw Step 2 if visible
        if (this.showStep2) {
            xPos = 300;
            p.fill(0);
            p.text("Step 2: Estimate", xPos-275, 220);
            xPos += p.textWidth("Step 2: Estimate ") + 10;
            
            // Draw first fraction in gray
            xPos = this.drawMixedFraction(p, model.fraction1, xPos-280, 220, '#808080');
            
            // Draw plus sign in black
            p.fill(0);
            p.text("+", xPos + 10, 220);
            xPos += p.textWidth("+") + 20;
            
            // Draw second fraction in pink
            this.drawMixedFraction(p, model.fraction2, xPos, 220, '#FF80B0');
        }
        p.pop();
    }

    // Add a method to handle the expandable box
    drawExpandableBox(p, startX, lineY, unitWidth, model) {
        // Update the box position based on the current number line parameters
        this.purpleBox.startX = startX;
        
        // If the end position hasn't been set yet, initialize it to 0.5 units
        if (this.purpleBox.endX <= this.purpleBox.startX) {
            this.purpleBox.endX = startX + unitWidth/2;
        }
        
        this.purpleBox.y = lineY - 30;
        
        // Check if mouse is pressed on the right edge of the box
        p.mousePressed = () => {
            // Check if mouse is near the right edge of the box
            if (Math.abs(p.mouseX - this.purpleBox.endX) < 10 && 
                p.mouseY > this.purpleBox.y && 
                p.mouseY < this.purpleBox.y + this.purpleBox.height) {
                this.purpleBox.isDragging = true;
            }
        };
        
        // Handle dragging to expand the box
        p.mouseDragged = () => {
            if (this.purpleBox.isDragging) {
                // Update the end position as the mouse moves
                this.purpleBox.endX = p.mouseX;
                
                // Constrain to the number line (0 to 5)
                // Ensure minimum width of 0.5 units
                if (this.purpleBox.endX < this.purpleBox.startX + unitWidth/2) {
                    this.purpleBox.endX = this.purpleBox.startX + unitWidth/2;
                }
                // Limit maximum width to 5 units
                if (this.purpleBox.endX > startX + unitWidth * 5) {
                    this.purpleBox.endX = startX + unitWidth * 5;
                }
            }
        };
        
        // Stop dragging when mouse is released
        p.mouseReleased = () => {
            if (this.purpleBox.isDragging) {
                this.purpleBox.isDragging = false;
                
                // Show Step 2 after the box is placed
                this.showStep2 = true;
            }
            else if (this.pinkBox.isDragging) {
                this.pinkBox.isDragging = false;
                
                // Show the compare button after the pink box is dragged
                this.showCompareButton = true;
            }
        };
        
        // Draw the expandable box
        p.fill('#8080FF'); // Purple color
        p.stroke(0); // Add black border
        p.strokeWeight(2);
        const boxWidth = this.purpleBox.endX - this.purpleBox.startX;
        p.rect(this.purpleBox.startX, this.purpleBox.y, boxWidth, this.purpleBox.height);
    }

  
    
    drawNumberLine(p, model) {
        // Set up number line parameters
        const lineY = 160; // Y position of the number line
        const startX = 50; // Starting X position
        const endX = 850; // Ending X position
        const lineLength = endX - startX;
        const unitWidth = lineLength / 10; // Width per unit (0-10)
        
        // Draw the extended horizontal line (extending 20px on each side)
        p.stroke(0);
        p.strokeWeight(2);
        p.line(startX - 20, lineY, endX + 20, lineY);
        
        // Draw arrow shapes at both ends pointing outward
        // Left arrow (pointing left)
        p.stroke(0);
        p.strokeWeight(2);
        p.line(startX-9, lineY - 8, startX - 20, lineY);
        p.line(startX - 9, lineY + 8, startX - 20, lineY);
        
        // Right arrow (pointing right)
        p.line(endX + 9, lineY - 8, endX + 20, lineY);
        p.line(endX + 9, lineY + 8, endX + 20, lineY);
        
        // Draw tick marks and labels
        p.textSize(12);
        p.textAlign(p.CENTER, p.CENTER);
        
        // Draw major and minor tick marks
        for (let i = 0; i <= 20; i++) {
            const x = startX + (i * unitWidth / 2); // Position for each 0.5 increment
            const tickHeight = i % 2 === 0 ? 10 : 5; // Taller ticks for whole numbers
            
            p.stroke(0);
            p.line(x, lineY - tickHeight, x, lineY + tickHeight);
            
            // Add labels for whole numbers
            if (i % 2 === 0) {
                p.noStroke();
                p.fill(0);
                p.text(i/2, x, lineY + 25);
            }
        }
        
        // Draw the extended purple box
        this.drawExpandableBox(p, startX, lineY, unitWidth, model);
        
        // Draw the second number line if Step 2 is visible, regardless of whether purple box is being dragged
        if (this.showStep2) {
            this.drawSecondNumberLine(p, startX, lineY, endX, unitWidth, model);
        }
    }
    
    // Add a method to draw the second number line with grey and pink boxes
    drawSecondNumberLine(p, startX, lineY, endX, unitWidth, model) {
        // Position the second number line below the first one
        const secondLineY = lineY + 140;
        
        // Draw the extended horizontal line (extending 20px on each side)
        p.stroke(0);
        p.strokeWeight(2);
        p.line(startX - 20, secondLineY, endX + 20, secondLineY);
        
        // Draw arrow shapes at both ends pointing outward
        p.line(startX-9, secondLineY - 8, startX - 20, secondLineY);
        p.line(startX - 9, secondLineY + 8, startX - 20, secondLineY);
        p.line(endX + 9, secondLineY - 8, endX + 20, secondLineY);
        p.line(endX + 9, secondLineY + 8, endX + 20, secondLineY);
        
        // Draw tick marks and labels
        for (let i = 0; i <= 20; i++) {
            const x = startX + (i * unitWidth / 2); // Position for each 0.5 increment
            const tickHeight = i % 2 === 0 ? 10 : 5; // Taller ticks for whole numbers
            
            p.stroke(0);
            p.line(x, secondLineY - tickHeight, x, secondLineY + tickHeight);
            
            // Add labels for whole numbers
            if (i % 2 === 0) {
                p.noStroke();
                p.fill(0);
                p.text(i/2, x, secondLineY + 25);
            }
        }
        
        // Draw the grey box (same width as purple box)
        const purpleBoxWidth = this.purpleBox.endX - this.purpleBox.startX;
        p.fill(180); // Grey color
        p.stroke(0); // Add black border
        p.strokeWeight(2);
        p.rect(startX, secondLineY - 30, purpleBoxWidth, 30);
        
        // Position the pink box to start exactly where the grey box ends
        const greyBoxEndX = startX + purpleBoxWidth;
        
        // Initialize the pink box only once
        if (!this.pinkBox) {
            this.pinkBox = {
                startX: greyBoxEndX,
                endX: greyBoxEndX + unitWidth/2,
                y: secondLineY - 30,
                height: 30,
                isDragging: false,
                touchId: null // Add touchId for touch events
            };
        } else {
            // Update the startX to match the end of the grey box
            this.pinkBox.startX = greyBoxEndX;
            this.pinkBox.y = secondLineY - 30;
            
            // Only reset the endX if this is the first time showing Step 2
            // or if the purple box is being dragged (which changes the grey box)
            if (this.purpleBox.isDragging) {
                this.pinkBox.endX = this.pinkBox.startX + unitWidth/2;
            }
        }
        
        // Draw the pink box
        p.fill('#FF80B0'); // Pink color
        p.stroke(0); // Add black border
        p.strokeWeight(2);
        const pinkBoxWidth = this.pinkBox.endX - this.pinkBox.startX;
        p.rect(this.pinkBox.startX, this.pinkBox.y, pinkBoxWidth, this.pinkBox.height);
        
        // Make the pink box draggable - pass secondLineY to properly position the button
        this.handlePinkBoxDragging(p, startX, unitWidth, model, secondLineY);
    }
    
    // Add a method to handle dragging the pink box
    handlePinkBoxDragging(p, startX, unitWidth, model, lineY) {
        // Initialize pink box with touch properties if not already done
        if (!this.pinkBox) {
            this.pinkBox = {
                startX: this.purpleBox.endX,
                endX: this.purpleBox.endX + unitWidth/2,
                y: lineY - 30,
                height: 30,
                isDragging: false,
                touchId: null // Add touchId for touch events
            };
        }
        
        // Check if mouse is pressed on the right edge of the pink box
        p.mousePressed = () => {
            // Only allow dragging if exact solution is not shown
            if (!this.showExactSolution) {
                // First check if we're dragging the purple box
                if (Math.abs(p.mouseX - this.purpleBox.endX) < 10 && 
                    p.mouseY > this.purpleBox.y && 
                    p.mouseY < this.purpleBox.y + this.purpleBox.height) {
                    this.purpleBox.isDragging = true;
                }
                // Then check if we're dragging the pink box
                else if (Math.abs(p.mouseX - this.pinkBox.endX) < 10 && 
                    p.mouseY > this.pinkBox.y && 
                    p.mouseY < this.pinkBox.y + this.pinkBox.height) {
                    this.pinkBox.isDragging = true;
                }
            }
            
            // Check if compare button is clicked
            if (this.compareButton && 
                p.mouseX > this.compareButton.x && 
                p.mouseX < this.compareButton.x + this.compareButton.width &&
                p.mouseY > this.compareButton.y && 
                p.mouseY < this.compareButton.y + this.compareButton.height) {
                this.showExactSolution = true;
            }
        };
        
        // Handle dragging to expand the pink box
        p.mouseDragged = () => {
            // Only allow dragging if exact solution is not shown
            if (!this.showExactSolution) {
                if (this.purpleBox.isDragging) {
                    // Update the end position as the mouse moves
                    this.purpleBox.endX = p.mouseX;
                    
                    // Constrain to the number line (0 to 5)
                    // Ensure minimum width of 0.5 units
                    if (this.purpleBox.endX < this.purpleBox.startX + unitWidth/2) {
                        this.purpleBox.endX = this.purpleBox.startX + unitWidth/2;
                    }
                    // Limit maximum width to 5 units
                    if (this.purpleBox.endX > startX + unitWidth * 5) {
                        this.purpleBox.endX = startX + unitWidth * 5;
                    }
                }
                else if (this.pinkBox.isDragging) {
                    // Update the end position as the mouse moves
                    this.pinkBox.endX = p.mouseX;
                    
                    // Constrain to the number line
                    // Ensure minimum width of 0.5 units
                    if (this.pinkBox.endX < this.pinkBox.startX + unitWidth/2) {
                        this.pinkBox.endX = this.pinkBox.startX + unitWidth/2;
                    }
                    // Limit maximum width to 5 units from the start of the pink box
                    if (this.pinkBox.endX > this.pinkBox.startX + unitWidth * 5) {
                        this.pinkBox.endX = this.pinkBox.startX + unitWidth * 5;
                    }
                }
            }
        };
        
        // Stop dragging when mouse is released
        p.mouseReleased = () => {
            if (this.purpleBox.isDragging) {
                this.purpleBox.isDragging = false;
                
                // Show Step 2 after the box is placed
                this.showStep2 = true;
            }
            else if (this.pinkBox.isDragging) {
                this.pinkBox.isDragging = false;
                
                // Show the compare button after the pink box is dragged
                this.showCompareButton = true;
            }
        };
        
        // Draw the compare button if pink box has been dragged and exact solution is not shown yet
        if (this.showCompareButton && !this.showExactSolution) {
            const buttonWidth = 180;
            const buttonHeight = 30;
            const buttonX = p.width/4 - buttonWidth-25;
            const buttonY = lineY + 50;
            
            // Store button properties for click detection
            this.compareButton = {
                x: buttonX,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight
            };
            
            // Draw button with white background and grey border
            p.fill(255);
            p.stroke(150);
            p.strokeWeight(2);
            p.rect(buttonX, buttonY, buttonWidth, buttonHeight, 5);
            
            // Draw button text in purple
            p.fill('#8080FF');
            p.noStroke();
            p.textSize(14);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Compare to Exact Solution", buttonX + buttonWidth/2, buttonY + buttonHeight/2);
        }
        
        // If the exact solution should be shown, draw it
        if (this.showExactSolution) {
            this.drawExactSolution(p, model, startX, lineY, unitWidth);
        }
    }
    
    // Add a method to draw the exact solution
    drawExactSolution(p, model, startX, lineY, unitWidth) {
        // Draw the third number line below the second one, but a bit higher than before
        const thirdLineY = lineY + 100; // Changed from 120 to 100 to move it up
        
        // Draw the extended horizontal line (extending 20px on each side)
        p.stroke(0);
        p.strokeWeight(2);
        p.line(startX - 20, thirdLineY, startX + unitWidth * 10 + 20, thirdLineY);
        
        // Draw arrow shapes at both ends pointing outward
        p.line(startX-9, thirdLineY - 8, startX - 20, thirdLineY);
        p.line(startX - 9, thirdLineY + 8, startX - 20, thirdLineY);
        p.line(startX + unitWidth * 10 + 9, thirdLineY - 8, startX + unitWidth * 10 + 20, thirdLineY);
        p.line(startX + unitWidth * 10 + 9, thirdLineY + 8, startX + unitWidth * 10 + 20, thirdLineY);
        
        // Draw tick marks and labels
        for (let i = 0; i <= 20; i++) {
            const x = startX + (i * unitWidth / 2); // Position for each 0.5 increment
            const tickHeight = i % 2 === 0 ? 10 : 5; // Taller ticks for whole numbers
            
            p.stroke(0);
            p.line(x, thirdLineY - tickHeight, x, thirdLineY + tickHeight);
            
            // Add labels for whole numbers
            if (i % 2 === 0) {
                p.noStroke();
                p.fill(0);
                p.text(i/2, x, thirdLineY + 25);
            }
        }
        
        // Calculate positions for the exact solution
        const fraction1Value = model.fraction1.value;
        const fraction2Value = model.fraction2.value;
        const exactSum = model.exactSum;
        
        // Calculate exact positions on the third number line
        const fraction1StartX = startX;
        const fraction1EndX = startX + (fraction1Value * unitWidth);
        const fraction2StartX = fraction1EndX;
        const fraction2EndX = fraction2StartX + (fraction2Value * unitWidth);
        
        // Draw the first green box (for the first fraction)
        p.fill('#009688'); // Updated green color to match the photo
        p.stroke(0);
        p.strokeWeight(2);
        const firstGreenBoxWidth = fraction1Value * unitWidth;
        p.rect(fraction1StartX, thirdLineY - 30, firstGreenBoxWidth, 30);
        
        // Draw the second green box (for the second fraction)
        const secondGreenBoxWidth = fraction2Value * unitWidth;
        p.rect(fraction2StartX, thirdLineY - 30, secondGreenBoxWidth, 30);
        
        // Draw dotted lines connecting the exact solution boxes to the estimated boxes
        p.stroke(0);
        p.strokeWeight(1);
        
        // Connect the start of first green box to the start of purple box
        this.drawDottedLine(p, fraction1StartX, thirdLineY - 30, this.purpleBox.startX, lineY);
        
        // Connect the end of first green box to the end of purple box
        this.drawDottedLine(p, fraction1EndX, thirdLineY - 30, this.purpleBox.endX, lineY);
        
        // Connect the start of second green box to the start of pink box
        this.drawDottedLine(p, fraction2StartX, thirdLineY - 30, this.pinkBox.startX, lineY);
        
        // Connect the end of second green box to the end of pink box
        this.drawDottedLine(p, fraction2EndX, thirdLineY - 30, this.pinkBox.endX, lineY);
        
        // Draw the exact solution text directly on canvas
        p.fill(0);
        p.noStroke();
        p.textSize(16);
        p.textAlign(p.LEFT, p.TOP);
        
        // Calculate the sum in mixed number format
        const sumWhole = Math.floor(model.exactSum);
        const sumFrac = model.exactSum - sumWhole;
        const sumDenom = model.fraction2.denominator;
        const sumNum = Math.round(sumFrac * sumDenom);
        
        // Draw the exact solution text
        let textX = startX + 50;
        const textY = thirdLineY + 50;
        
        p.text("Exact solution:", textX-70, textY+10);
        textX += p.textWidth("Exact solution: ") + 10;
        
        // Draw first fraction
        textX = this.drawMixedFraction(p, model.fraction1, textX-80, textY+10, 0);
        
        // Draw plus sign
        p.fill(0);
        p.text(" + ", textX, textY+10);
        textX += p.textWidth(" + ");
        
        // Draw second fraction
        textX = this.drawMixedFraction(p, model.fraction2, textX, textY+10, 0);
        
        // Draw equals sign
        p.fill(0);
        p.text(" = ", textX, textY+10);
        textX += p.textWidth(" = ");
        
        // Draw sum as mixed fraction
        const sumFraction = {
            whole: sumWhole,
            numerator: sumNum,
            denominator: sumDenom,
            value: model.exactSum
        };
        this.drawMixedFraction(p, sumFraction, textX, textY+10, 0);
    }
    
    // Helper method to format mixed fractions as strings
    formatMixedFraction(fraction) {
        if (fraction.whole === 0) {
            return fraction.numerator + "/" + fraction.denominator;
        } else {
            return fraction.whole + " " + fraction.numerator + "/" + fraction.denominator;
        }
    }
    
    // Helper method to draw dotted lines
    drawDottedLine(p, x1, y1, x2, y2) {
        p.strokeWeight(2); // Make dots more visible
        
        // Draw vertical line first (straight up from the exact solution box)
        const verticalSteps = 20; // Increased from 10 to 20 for more dots
        for (let i = 0; i <= verticalSteps; i++) {
            if (i % 2 === 0) {
                const y = p.lerp(y1, y2, i / verticalSteps);
                p.point(x1, y);
            }
        }
        
        // Then draw horizontal line (straight left/right to the estimated box)
        const horizontalSteps = Math.abs(x2 - x1) / 3; // Changed from 5 to 3 for more dots
        for (let i = 0; i <= horizontalSteps; i++) {
            if (i % 2 === 0) {
                const x = p.lerp(x1, x2, i / horizontalSteps);
                p.point(x, y2);
            }
        }
    }

    // Add new touch event handlers
    handleTouchStart(e, p) {
        e.preventDefault(); // Prevent scrolling
        const touch = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        // Check if touch is near the right edge of the purple box
        if (!this.showExactSolution && 
            Math.abs(touchX - this.purpleBox.endX) < 40 && 
            touchY > this.purpleBox.y && 
            touchY - 30 < this.purpleBox.y + this.purpleBox.height) {
            this.purpleBox.isDragging = true;
            this.purpleBox.touchId = touch.identifier;
        }
        // Check if touch is near the right edge of the pink box
        else if (this.pinkBox && !this.showExactSolution &&
                 Math.abs(touchX - this.pinkBox.endX) < 40 && 
                 touchY > this.pinkBox.y && 
                 touchY - 30 < this.pinkBox.y + this.pinkBox.height) {
            this.pinkBox.isDragging = true;
            this.pinkBox.touchId = touch.identifier;
        }
        // Check if compare button is touched
        else if (this.compareButton && 
                 touchX > this.compareButton.x && 
                 touchX < this.compareButton.x + this.compareButton.width &&
                 touchY > this.compareButton.y && 
                 touchY < this.compareButton.y + this.compareButton.height) {
            this.showExactSolution = true;
        }
    }

    handleTouchMove(e, p) {
        e.preventDefault(); // Prevent scrolling
        
        // Find the active touch
        let activeTouch = null;
        for (let i = 0; i < e.touches.length; i++) {
            if (this.purpleBox.isDragging && e.touches[i].identifier === this.purpleBox.touchId) {
                activeTouch = e.touches[i];
                break;
            }
            if (this.pinkBox && this.pinkBox.isDragging && e.touches[i].identifier === this.pinkBox.touchId) {
                activeTouch = e.touches[i];
                break;
            }
        }

        if (!activeTouch) return;

        const rect = e.target.getBoundingClientRect();
        const touchX = activeTouch.clientX - rect.left;
        const unitWidth = (850 - 50) / 10; // Calculate unitWidth based on line length

        if (this.purpleBox.isDragging) {
            // Update purple box position
            this.purpleBox.endX = touchX;
            
            // Apply constraints
            if (this.purpleBox.endX < this.purpleBox.startX + unitWidth/2) {
                this.purpleBox.endX = this.purpleBox.startX + unitWidth/2;
            }
            if (this.purpleBox.endX > 50 + unitWidth * 5) {
                this.purpleBox.endX = 50 + unitWidth * 5;
            }
        }
        else if (this.pinkBox && this.pinkBox.isDragging) {
            // Update pink box position
            this.pinkBox.endX = touchX;
            
            // Apply constraints
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
        
        if (this.purpleBox.isDragging) {
            this.purpleBox.isDragging = false;
            this.purpleBox.touchId = null;
            this.showStep2 = true;
        }
        else if (this.pinkBox && this.pinkBox.isDragging) {
            this.pinkBox.isDragging = false;
            this.pinkBox.touchId = null;
            this.showCompareButton = true;
        }
    }
}

// Controller - Handles user input and updates model and view
class FractionController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Initialize the canvas with the model
        this.view.initializeCanvas(this.model);
        
        // Set up event listeners
        this.view.newProblemButton.addEventListener('click', () => this.newProblem());
        
        // Style the new problem button with purple background
        this.view.newProblemButton.style.backgroundColor = '#8080FF'; // Purple color
        this.view.newProblemButton.style.color = 'white';
        this.view.newProblemButton.style.border = 'none';
        this.view.newProblemButton.style.padding = '8px 16px';
        this.view.newProblemButton.style.borderRadius = '5px';
        this.view.newProblemButton.style.cursor = 'pointer';
    }
    
    newProblem() {
        this.model.resetProblem();
        
        // Reset the view state before initializing the canvas
        this.view.showStep2 = false;
        this.view.pinkBox = null;
        this.view.showCompareButton = false;
        this.view.showExactSolution = false;
        
        // Reset the exact solution div
        if (this.view.exactSolutionDiv) {
            this.view.exactSolutionDiv.remove();
            this.view.exactSolutionDiv = null;
        }
        
        this.view.initializeCanvas(this.model);
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const model = new FractionModel();
    const view = new FractionView();
    const controller = new FractionController(model, view);
});