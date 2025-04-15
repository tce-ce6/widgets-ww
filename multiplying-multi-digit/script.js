// Model
class SimulationModel {
    constructor() {
        this.data = {
            multiDigitNumber: 0,
            singleDigitNumber: 0
        };
        this.generateNewProblem();
    }

    generateNewProblem() {
        // Generate a random 2-4 digit number
        const minDigits = 10;  // 2 digits start from 10
        const maxDigits = 9999;  // 4 digits end at 9999
        this.data.multiDigitNumber = Math.floor(Math.random() * (maxDigits - minDigits + 1)) + minDigits;;
        // Generate a random single digit (1-9)
        this.data.singleDigitNumber = Math.floor(Math.random() * 9) + 1;
    }
}

// View
class SimulationView {
    constructor() {
        this.p5Instance = null;
        this.graph = null;
        this.initP5();
    }

    // View class update - only showing relevant parts
    initP5() {
        this.p5Instance = new p5((p) => {
            const countDigits = (num) => {
                return Math.floor(Math.log10(num)) + 1;
            };
            
            let selectedBoxes = [];
            let lastSelectedBox = null;
            let calculatedBoxes = new Set();  // Track boxes that have been calculated

            p.mousePressed = () => {
                // Check for Try Another button click
                if (selectedBoxes.length === countDigits(this.model?.data.multiDigitNumber || 0)) {
                    const x = 150;
                    const buttonX = x + 500;
                    const fixedButtonY = 500;  // Match the fixed position
                    
                    if (p.mouseX > buttonX && p.mouseX < buttonX + 150 &&
                        p.mouseY > fixedButtonY && p.mouseY < fixedButtonY + 45) {
                        // Reset state and generate new problem...
                        selectedBoxes = [];
                        calculatedBoxes.clear();
                        lastSelectedBox = null;
                        
                        // Generate new problem
                        this.model.generateNewProblem();
                        
                        // Redraw only what's needed
                        p.clear();
                        p.stroke("#f5f5f5");
                        p.strokeWeight(3);
                        p.noFill();
                        p.rect(0,0,900,600);
                        p.draw();
                        return;
                    }
                }

                // Existing box selection code
                const digits = countDigits(this.model?.data.multiDigitNumber || 0);
                const boxWidth = 100;
                const boxHeight = 100;
                const x = 470;
                const y = 150;

                for(let i = 0; i < digits; i++) {
                    if (p.mouseX > x + (i * boxWidth) && 
                        p.mouseX < x + ((i + 1) * boxWidth) && 
                        p.mouseY > y && 
                        p.mouseY < y + boxHeight) {
                        lastSelectedBox = i;  // Update last selected box
                        
                        // Only add to selectedBoxes if not already calculated
                        if (!calculatedBoxes.has(i)) {
                            selectedBoxes.push(i);
                            calculatedBoxes.add(i);
                        }
                        
                        p.clear();
                        p.stroke("#f5f5f5");
                        p.strokeWeight(3);
                        p.noFill();
                        p.rect(0,0,900,600);
                        p.draw();
                        return;
                    }
                }
            };
            
    // Add at the beginning of initP5 after variable declarations

            // Add fullscreen button in setup
            p.setup = () => {
                p.createCanvas(900, 600);
                p.background("#ffffff");
                p.stroke("#f5f5f5");
                p.strokeWeight(3);
                p.rect(0,0,900,600);
                p.noLoop();  // Stop continuous redrawing
            };

            p.draw = () => {
                // Draw title text
                p.textSize(18);
                p.textAlign(p.CENTER, p.TOP);
                p.fill('#374350');
                p.noStroke();
                p.textStyle(p.NORMAL);  // Add this line for thinner text
                p.text('Use the area model to explore how to multiply using partial products.', 290, 50);

                // Rest of draw function
                p.textSize(20);
                p.textAlign(p.RIGHT);
                p.fill('#374350');
                p.noStroke();
                p.textStyle(p.NORMAL);  // Add this line for thinner text
                
                // Position for the problem
                const x = 150;
                const y = 150;
                
                // Draw the numbers and operator separately
                p.text(this.model?.data.multiDigitNumber || '', x, y);
                p.text('×', x - 50, y + 40);
                p.text(this.model?.data.singleDigitNumber || '', x, y + 40);
                
                // Draw the line
                p.stroke('#374350');
                p.strokeWeight(1);
                p.line(x - 100, y + 80, x+20, y + 80);
                p.noStroke();  // Reset stroke after drawing line

                // Display calculations below the line
                p.noStroke();
                p.noFill();
                p.fill('#374350');
                p.textSize(20);
                p.textAlign(p.LEFT);
                let calculationY = y + 120; // Position below the line
                
                // Get place values for calculations
                const digits = countDigits(this.model?.data.multiDigitNumber || 0);
                const placeValues = [];
                let tempNum = this.model?.data.multiDigitNumber || 0;
                for(let i = 0; i < digits; i++) {
                    const divisor = Math.pow(10, digits - i - 1);
                    const value = Math.floor(tempNum / divisor) * divisor;
                    placeValues.push(value);
                    tempNum = tempNum % divisor;
                }
                
                // Show calculations for selected boxes
                selectedBoxes.sort((a, b) => b - a).forEach((boxIndex, index) => {
                    const singleDigit = this.model?.data.singleDigitNumber || 0;
                    const product = placeValues[boxIndex] * singleDigit;
                    
                    // Draw pink border only for last selected box
                    if (boxIndex === lastSelectedBox) {
                        p.stroke('#ff69b4');
                        p.strokeWeight(2);
                        p.noFill();
                        const rectWidth = 350;
                        const rectHeight = 35;
                        p.rect(x - 100, calculationY-3, rectWidth, rectHeight);
                    }
                    
                    // Position text with right alignment for numbers
                    p.textAlign(p.RIGHT);
                    p.textSize(20);  // Changed from 28
                    p.fill('#374350');
                    p.noStroke();
                    p.text(product, x+10, calculationY);
                    
                    p.textAlign(p.LEFT);
                    p.textSize(20);  // Changed from 24
                    p.text(' Multiply ', x + 30, calculationY);
                    
                    p.textAlign(p.LEFT);
                    p.textSize(20);
                    p.text(`${singleDigit} × ${placeValues[boxIndex]}`, x + 130, calculationY);
                    
                    // Add + sign only when displaying calculation for the first box
                    if (boxIndex === 0 && selectedBoxes.includes(0) && selectedBoxes.length > 1) {
                        p.textAlign(p.LEFT);
                        p.textSize(20);
                        p.text('+', x-100, calculationY);
                    }
                    
                    calculationY += 45;
                });

                // Add total calculation if there are selected boxes
                if (selectedBoxes.length > 0) {
                    // Draw line above total
                    p.stroke('#374350');
                    p.strokeWeight(1);
                    p.line(x - 100, calculationY, x+20, calculationY);
                    
                    // Calculate total
                    const total = selectedBoxes.reduce((sum, boxIndex) => {
                        return sum + (placeValues[boxIndex] * this.model?.data.singleDigitNumber);
                    }, 0);
                    
                    // Display total and button only if all boxes are selected
                    if (selectedBoxes.length === digits) {
                        calculationY += 35;
                        p.noStroke();
                        p.textAlign(p.RIGHT);
                        p.textSize(20);
                        p.text(total, x + 10, calculationY);
                        
                        // Add explanation text
                        p.textAlign(p.LEFT);
                        p.textSize(20);
                        p.text('Add the partial products', x + 30, calculationY);

                        // Add "Try Another" button at fixed position
                        const fixedButtonY = 520; // Increased from 500 to 520
                        p.textAlign(p.CENTER);
                        p.textSize(14);
                        p.fill('#6B4EE6');
                        p.noStroke();
                        p.rect(x + 500, fixedButtonY, 150, 40, 4);
                        p.fill('#FFFFFF');
                        p.text('TRY ANOTHER', x + 575, fixedButtonY+15);
                    }
                }

                // Move drawBoxes call to the beginning of draw
                const boxX = 470;
                const boxY = 150;
                drawBoxes(this.model?.data.multiDigitNumber || 0, boxX, boxY);
            };

            const drawBoxes = (num, x, y) => {
                const digits = countDigits(num);
                const boxWidth = 100;
                const boxHeight = 100;
                
                // Get individual place values as integers
                const placeValues = [];
                let tempNum = num;
                for(let i = 0; i < digits; i++) {
                    const divisor = Math.pow(10, digits - i - 1);
                    const value = Math.floor(tempNum / divisor) * divisor;
                    placeValues.push(value);
                    tempNum = tempNum % divisor;
                }
                
                for(let i = 0; i < digits; i++) {
                    p.stroke('#6B4EE6');
                    p.strokeWeight(3);
                    
                    // Fill box if it's in selected array
                    if (selectedBoxes.includes(i)) {
                        // Use pink for last selected box, light purple for others
                        p.fill(i === lastSelectedBox ? '#ffb6c1' : '#e6e6fa');
                        p.rect(x + (i * boxWidth), y, boxWidth, boxHeight);
                        
                        // Calculate product for selected box
                        const singleDigit = this.model?.data.singleDigitNumber || 0;
                        const product = placeValues[i] * singleDigit;
                        
                        // Display calculation in the middle of the box
                        p.noStroke();
                        p.fill('#374350');
                        p.textSize(20);  // Changed from 24
                        p.textAlign(p.CENTER);
                        p.text(`${product}`, x + (i * boxWidth) + boxWidth/2, y + boxHeight-60);
                    } else {
                        p.noFill();
                        p.rect(x + (i * boxWidth), y, boxWidth, boxHeight);
                    }
                    
                    // Add place value text above each box
                    p.noStroke();  // Ensure no stroke for text
                    p.fill('#374350');
                    p.textSize(20);
                    p.textAlign(p.CENTER);
                    p.text(placeValues[i], x + (i * boxWidth) + boxWidth/2, y - 30);
                }

                // Add multiplication sign and single digit number
                p.noStroke();  // Ensure no stroke for text
                p.fill('#374350');
                p.textSize(20);
                p.textAlign(p.CENTER);
                p.text('×', x-10, y-20);
                p.textAlign(p.LEFT);
                p.text(this.model?.data.singleDigitNumber || '', x-20, y+40);
            };
        }, 'canvas-container');
    }

}

// Controller
class SimulationController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.model = model; // Add reference to model in view
    }

    init() {
        this.model.generateNewProblem();
        // Add this line to trigger initial render after model is set up
        this.view.p5Instance.redraw();
    }
}

// Initialize application
window.onload = () => {
    const model = new SimulationModel();
    const view = new SimulationView();
    const controller = new SimulationController(model, view);
    controller.init();
};