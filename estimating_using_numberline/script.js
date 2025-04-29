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
            startX: 50, // Will be updated in drawNumberLine
            endX: 50, // Will be updated in drawNumberLine
            y: 140, // Position above the number line
            height: 30,
            isDragging: false
        };
        
        // Initialize button and solution visibility flags
        this.showCompareButton = false;
        this.showExactSolution = false;
        
        // Create a new p5 instance with just a basic canvas
        this.sketch = new p5((p) => {
            // Add a div for MathJax equation
            let equationDiv;
            
            p.setup = () => {
                // Create canvas with dimensions 900x400
                const canvas = p.createCanvas(900, 500);
                canvas.parent(numberLineContainer);
                
                // Create a div for the equation at the top of the canvas
                equationDiv = p.createDiv('');
                equationDiv.position(220, 130); // Position at the top
                equationDiv.style('font-size', '15px');
                equationDiv.style('width', '900px'); // Match canvas width
                equationDiv.style('text-align', 'center');
                equationDiv.style('position', 'absolute'); // Use absolute positioning
                equationDiv.style('z-index', '10'); // Ensure it's above the canvas
                equationDiv.parent(numberLineContainer);
                
                // Set the equation using MathJax
                this.updateEquation(model, equationDiv);
            };
            
            p.draw = () => {
                // Basic white background
                p.background(255);
                
                // Draw a border to visualize the canvas
                p.stroke(0);
                p.strokeWeight(2);
                p.noFill();
                p.rect(0, 0, p.width, p.height);
                
                // Draw number line and other elements
                this.drawNumberLine(p, model);
            };
        });
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
                
                // Update the equation display to show Step 2
                const equationDiv = document.querySelector('#number-line-container > div');
                if (equationDiv) {
                    this.updateEquation(model, { html: (content) => { equationDiv.innerHTML = content; } });
                    
                    // Typeset the equation with MathJax
                    if (window.MathJax) {
                        MathJax.typesetPromise([equationDiv]).catch((err) => console.log(err));
                    }
                }
            }
        };
        
        // Draw the expandable box
        p.fill('#8080FF'); // Purple color
        p.stroke(0); // Add black border
        p.strokeWeight(2);
        const boxWidth = this.purpleBox.endX - this.purpleBox.startX;
        p.rect(this.purpleBox.startX, this.purpleBox.y, boxWidth, this.purpleBox.height);
    }

    updateEquation(model, equationDiv) {
        // Get the LaTeX formatted problem string
        const problemString = model.getProblemString();
        const firstFractionString = model.getFirstFractionString();
        const secondFractionString = model.getSecondFractionString();
        
        // Set the HTML content with MathJax formatting
        let htmlContent = '<div style="display: flex; align-items: center; gap: 10px; position: relative; ">' +
                         '<span>Estimate</span>' +
                         '<span>$$' + problemString + '$$</span>' +
                         '<span>by dragging the bars.</span>' +
                         '</div>' +
                         '<div style="display: flex; justify-content: center; align-items: center; gap: 10px; position: relative;">' +
                         '<span>Step 1: Estimate</span>' +
                         '<span>$$' + firstFractionString + '$$</span>' +
                         '</div>';
        
        // Only show Step 2 if the box has been placed
        if (this.showStep2) {
            htmlContent += '<div style="display: flex; justify-content: center; align-items: center; gap: 10px; position: relative; ">' +
                         '<span>Step 2: Estimate</span>' +
                         '<span>$$\\color{gray}{' + model.getFractionString(model.fraction1).replace('\\color{#8080FF}', '') + '} \\color{black}{+} ' + secondFractionString + '$$</span>' +
                         '</div>';
        }
        
        equationDiv.html(htmlContent);
        
        // Typeset the equation with MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([equationDiv.elt]).catch((err) => console.log(err));
        }
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
                isDragging: false
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
                
                // Update the equation display to show Step 2
                const equationDiv = document.querySelector('#number-line-container > div');
                if (equationDiv) {
                    this.updateEquation(model, { html: (content) => { equationDiv.innerHTML = content; } });
                    
                    // Typeset the equation with MathJax
                    if (window.MathJax) {
                        MathJax.typesetPromise([equationDiv]).catch((err) => console.log(err));
                    }
                }
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
        
        // Create a div for the exact solution using MathJax
        if (!this.exactSolutionDiv) {
            this.exactSolutionDiv = p.createDiv('');
            this.exactSolutionDiv.position(startX + 150, thirdLineY + 150);
            this.exactSolutionDiv.style('font-size', '12px');
            this.exactSolutionDiv.style('width', '500px');
            this.exactSolutionDiv.style('text-align', 'center');
            this.exactSolutionDiv.parent(document.getElementById('number-line-container'));
            
            // Calculate the sum in mixed number format
            const sumWhole = Math.floor(model.exactSum);
            const sumFrac = model.exactSum - sumWhole;
            const sumDenom = model.fraction2.denominator;
            const sumNum = Math.round(sumFrac * sumDenom);
            
            // Get the fractions without color formatting
            const firstFraction = model.getFractionString(model.fraction1).replace('\\color{#8080FF}', '');
            const secondFraction = model.getFractionString(model.fraction2).replace('\\color{#FF80B0}', '');
            
            // Format the sum without color
            const sumString = `${sumWhole}\\frac{${sumNum}}{${sumDenom}}`;
            
            // Format the LaTeX string with all text in black
            const exactSolutionLatex = `\\text{Exact solution: } ${firstFraction} + ${secondFraction} = ${sumString}`;
            
            // Set the HTML content with MathJax formatting - ensure proper delimiters with smaller font size
            this.exactSolutionDiv.html(`<div style="font-size: 14px;">$$${exactSolutionLatex}$$</div>`);
            
            // Typeset the equation with MathJax
            if (window.MathJax) {
                MathJax.typesetPromise([this.exactSolutionDiv.elt]).catch((err) => console.log(err));
            }
        }
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