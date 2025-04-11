// Model - Handles data and business logic
class Model {
    constructor() {
        this.equation = {
            coefficient: 0,
            constant: 0,
            result: 0
        };
        this.leftPan = {
            section1: { boxes: 0, maxBoxes: 6, slider: 0, isCorrect: false },  // coefficient * x
            section2: { boxes: 0, maxBoxes: 15, slider: 0, isCorrect: false }  // constant term
        };
        this.rightPan = {
            boxes: 0,
            maxBoxes: 150,
            slider: 0,
            isCorrect: false
        };
        this.isBalanced = false;
        this.currentStep = 0;  // 0: initial, 1: step1, 2: step2
        this.animationProgress = 0;
        this.isAnimating = false;
        this.generateNewEquation();
    }

    generateNewEquation() {
        // Generate random equation in format ax + b = c
        this.equation.coefficient = Math.floor(Math.random() * 5) + 1;  // 1 to 5
        this.equation.constant = Math.floor(Math.random() * 15) + 1;    // 1 to 15
        this.equation.result = (this.equation.coefficient * 10) + this.equation.constant;
        
        this.resetState();
        this.updateEquationDisplay();
    }

    resetState() {
        // Reset all state variables
        this.leftPan.section1.boxes = 0;
        this.leftPan.section1.slider = 0;
        this.leftPan.section2.boxes = 0;
        this.leftPan.section2.slider = 0;
        this.rightPan.boxes = 0;
        this.rightPan.slider = 0;
        this.currentStep = 0;
        this.animationProgress = 0;
        this.isAnimating = false;

        // Reset UI elements
        document.getElementById('leftSlider1').value = 0;
        document.getElementById('leftSlider2').value = 0;
        document.getElementById('rightSlider').value = 0;
        document.getElementById('slider-controls').style.display = 'flex';
        document.getElementById('solution-controls').style.display = 'none';
        document.getElementById('solveButton').style.display = 'none';
        document.getElementById('steps-container').style.display = 'none';
        document.querySelectorAll('.step').forEach(step => step.style.display = 'none');
    }

    updateEquationDisplay() {
        // Update equation display in steps container
        // document.getElementById('current-equation').textContent = 
        //     `${this.equation.coefficient}x + ${this.equation.constant} = ${this.equation.result}`;
        
        // Update step equations - Modified to display each equation on its own line
        document.querySelector('#step1 .constant').textContent = this.equation.constant;
        document.querySelector('#step1 .step-equation').innerHTML = 
            `${this.equation.coefficient}x + ${this.equation.constant} - ${this.equation.constant} = ${this.equation.result} - ${this.equation.constant}<br>` +
            `${this.equation.coefficient}x = ${this.equation.result - this.equation.constant}`;

        document.querySelector('#step2 .coefficient').textContent = this.equation.coefficient;
        document.querySelector('#step2 .step-equation').innerHTML = 
            `${this.equation.coefficient}x ÷ ${this.equation.coefficient} = ${this.equation.result - this.equation.constant} ÷ ${this.equation.coefficient}<br>` +
            `x = ${(this.equation.result - this.equation.constant) / this.equation.coefficient}`;
    }
    checkSolution() {
        const isCorrect = 
            this.leftPan.section1.boxes === this.equation.coefficient &&
            this.leftPan.section2.boxes === this.equation.constant &&
            this.rightPan.boxes === this.equation.result;

        if (isCorrect) {
            document.getElementById('solveButton').style.display = 'block';
        }else{
            document.getElementById('solveButton').style.display = 'none';
        }
        return isCorrect;
    }

    startSolutionSteps() {
        document.getElementById('slider-controls').style.display = 'none';
        document.getElementById('solution-controls').style.display = 'flex';
        document.getElementById('solveButton').style.display = 'none';
        document.getElementById('steps-container').style.display = 'block';
        this.currentStep = 1;
        this.showStep(1);

        // Reset box colors to original
        this.leftPan.section1.isCorrect = false;
        this.leftPan.section2.isCorrect = false;
        this.rightPan.isCorrect = false;

        // Reset box colors to original
        this.colors.boxLeft1 = 'rgba(66, 133, 244, 0.5)'; // Original color
        this.colors.boxLeft2 = 'rgba(252, 154, 26, 0.5)'; // Original color
        this.colors.boxRight = 'rgba(255, 152, 0, 0.5)'; // Original color
    }

    showStep(step) {
        this.currentStep = step;
        this.isAnimating = true;
        this.animationProgress = 0;

        document.querySelectorAll('.step').forEach(stepElem => {
            stepElem.style.display = step >= parseInt(stepElem.id.replace('step', '')) ? 'block' : 'none';
        });
    }

    updateBoxes(section, value) {
        if (this.isAnimating) return;

        if (section === 'left1') {
            this.leftPan.section1.boxes = value;
            this.leftPan.section1.slider = value;
            this.leftPan.section1.isCorrect = (value === this.equation.coefficient);
        } else if (section === 'left2') {
            this.leftPan.section2.boxes = value;
            this.leftPan.section2.slider = value;
            this.leftPan.section2.isCorrect = (value === this.equation.constant);
        } else if (section === 'right') {
            this.rightPan.boxes = value;
            this.rightPan.slider = value;
            this.rightPan.isCorrect = (value === this.equation.result);
        }

        this.checkSolution();
    }

    calculateBoxesForStep() {
        let leftSection1Boxes = this.equation.coefficient;
        let leftSection2Boxes = this.equation.constant;
        let rightBoxes = this.equation.result;

        if (this.currentStep === 1) {
            // During step 1, subtract constant from both sides
            leftSection2Boxes = Math.max(0, this.equation.constant * (1 - this.animationProgress));
            rightBoxes = this.equation.result - (this.equation.constant * this.animationProgress);
        } else if (this.currentStep === 2) {
            // During step 2, divide by coefficient
            leftSection1Boxes = Math.max(1, this.equation.coefficient * (1 - this.animationProgress));
            leftSection2Boxes = 0; // Already removed in step 1
            rightBoxes = this.equation.result - this.equation.constant;
            rightBoxes = Math.max(rightBoxes / this.equation.coefficient, 
                                (rightBoxes * (1 - this.animationProgress)) + 
                                (rightBoxes / this.equation.coefficient * this.animationProgress));
        }

        return {
            leftSection1: Math.round(leftSection1Boxes),
            leftSection2: Math.round(leftSection2Boxes),
            right: Math.round(rightBoxes)
        };
    }

    calculateBalance() {
        const boxes = this.calculateBoxesForStep();
        
        if (this.currentStep === 0) {
            // Initial state - use actual box counts
            const leftWeight = (this.leftPan.section1.boxes * 10) + this.leftPan.section2.boxes;
            const rightWeight = this.rightPan.boxes;
            this.isBalanced = leftWeight === rightWeight;
            return rightWeight - leftWeight;
        } else {
            // During solution steps - use animated box counts
            const leftWeight = (boxes.leftSection1 * 10) + boxes.leftSection2;
            const rightWeight = boxes.right;
            this.isBalanced = Math.abs(leftWeight - rightWeight) < 0.1;
            return rightWeight - leftWeight;
        }
    }

    updateAnimation() {
        if (this.isAnimating) {
            this.animationProgress += 0.003; // Slower animation
            if (this.animationProgress >= 1) {
                this.animationProgress = 1;
                this.isAnimating = false;
            }
        }
    }
}

// View - Handles all the rendering
class View {
    constructor() {
        this.beamAngle = 0;
        this.boxSize = 17;
        this.colors = {
    beam: 'rgba(66, 133, 244, 1)',           // Blue
    support: 'rgba(66, 133, 244, 1)',        // Blue
    pan: 'rgba(255, 152, 0, 1)',             // Orange
    boxLeft1: 'rgba(3, 54, 136, 0.5)',       // Blue
    boxLeft1Correct: 'rgba(76, 175, 80, 0.5)', // Green
    boxLeft2: 'rgba(236, 97, 16, 0.5)',        // Orange
    boxLeft2Correct: 'rgba(76, 175, 80, 0.5)', // Green
    boxRight: 'rgba(236, 97, 16, 0.5)',        // Orange
    boxRightCorrect: 'rgba(76, 175, 80, 0.5)', // Green
    base: 'rgba(33, 33, 33, 1)'     ,
          // red border

             // Dark gray
};
    }

    setup() {
        console.log('View setup called');
        const canvas = createCanvas(900, 400);
        canvas.parent('canvas-container');
    }

    draw(model) {
        background(255);
        this.drawEquation(model);
        this.drawBeam(model);
        this.drawPans(model);
        this.updateLabels(model);
    }

    drawEquation(model) {
        push();
        textSize(25);
        textAlign(CENTER);
        fill(0);
        text(`${model.equation.coefficient}x + ${model.equation.constant} = ${model.equation.result}`, width/2, 30);
        pop();
    }

    drawBeam(model) {
        push();
        translate(width / 2, height / 2 - 40);
        
        // Draw the beam
        stroke(this.colors.beam);
        strokeWeight(8);
        push();
        rotate(this.beamAngle);
        line(-300, 26, 300, 26);
        pop();
        
        // Draw the center support box
        fill(this.colors.support);
        noStroke();
        rectMode(CENTER);
        rect(0, 100, 30, 153);
        
        // Draw yellow diamond in center
        fill(255, 215, 0);
        push();
        translate(0, 80);
        rotate(PI / 4);
        rect(0, 0, 20, 20);
        pop();
        
        // Draw base
        fill(this.colors.base);
        rect(0, 180, 60, 20);
        
        // Draw the sign based on balance state
        fill(0); // Black color for the sign
        textSize(40);
        textAlign(CENTER);
        
        // Check if the balance is perfect
        if (model.isBalanced) {
            text("=", 0, 0.0); // Display "=" when balanced
        } else {
            text("≠", 0, 0.0); // Display "≠" when unbalanced
        }

        pop();
    }

    drawPans(model) {
        push();
        translate(width/2, height/2 - 35);
        rotate(this.beamAngle);

        const boxes = model.calculateBoxesForStep();

        // Draw left pan
        push();
        translate(-300, 28); 
        this.drawPan(0, 0, true);
        
        // Left pan - section 1 (coefficient)
        const leftSection1Count = model.currentStep === 0 ? model.leftPan.section1.boxes : boxes.leftSection1;
        this.drawBoxGrid(0, 0, leftSection1Count, 2, 3, 
            this.colors.boxLeft1, -70,
            model.leftPan.section1.isCorrect,
            this.colors.boxLeft1Correct);

        // Left pan - section 2 (constant)
        const leftSection2Count = model.currentStep === 0 ? model.leftPan.section2.boxes : boxes.leftSection2;
        this.drawBoxGrid(0, 0, leftSection2Count, 3, 5, 
            this.colors.boxLeft2, 70,
            model.leftPan.section2.isCorrect,
            this.colors.boxLeft2Correct);
        pop();

        // Draw right pan
        push();
        translate(300, 28);
        this.drawPan(0, 0, false);
        
        // Right pan boxes
        const rightCount = model.currentStep === 0 ? model.rightPan.boxes : boxes.right;
        this.drawBoxGrid(0, 0, rightCount, 11, 10, 
            this.colors.boxRight, 0,
            model.rightPan.isCorrect,
            this.colors.boxRightCorrect);
        pop();

        pop();
    }

    drawPan(x, y, isDouble) {
        push();
        noStroke();
        
        fill(this.colors.pan);
        beginShape();
        
        if (isDouble) {
            // Draw double pan with increased height
            vertex(x - 100, y - 20); // Adjusted height
            bezierVertex(x - 100, y + 10, x - 80, y + 15, x - 60, y + 15);
            bezierVertex(x - 20, y + 15, x - 10, y + 10, x, y - 20); // Adjusted height
            vertex(x + 100, y - 20); // Adjusted height
            bezierVertex(x + 100, y + 10, x + 80, y + 15, x + 60, y + 15);
            bezierVertex(x + 20, y + 15, x + 10, y + 10, x, y - 20); // Adjusted height
        } else {
            // Draw single pan with increased height
            vertex(x - 100, y - 20); // Adjusted height
            bezierVertex(x - 100, y + 10, x - 80, y + 15, x - 50, y + 15);
            bezierVertex(x - 20, y + 15, x, y + 10, x, y - 20); // Adjusted height
            vertex(x + 100, y - 20); // Adjusted height
            bezierVertex(x + 100, y + 10, x + 80, y + 15, x + 50, y + 15);
            bezierVertex(x + 20, y + 15, x, y + 10, x, y - 20); // Adjusted height
        }
        
        endShape(CLOSE);
        
        // Draw small yellow square for support
        fill(255, 215, 0);
        rect(x - 5, y - 15, 10, 10); // Adjusted position for support
        
        pop();
    }

    drawBoxGrid(x, y, count, rows, cols, boxColor, offsetX = 0, isCorrect = false, correctColor = null) {
        if (count === 0) return;
        
        push();
        translate(x + offsetX, y);
        stroke(44, 102, 47); // Green border
        strokeWeight(1);
        if (isCorrect) {
            fill(this.colors.boxLeft1Correct);
            stroke(44, 102, 47); 
            strokeWeight(1.5);
            fill(this.colors.boxLeft2Correct);
            stroke(44, 102, 47);
            strokeWeight(1.5);
            fill(this.colors.boxRightCorrect);
            stroke(44, 102, 47);
            strokeWeight(1.5);
            
        } else  {
            if (isCorrect === false) {
                fill(this.colors.boxLeft1);
                stroke(11,3,99); // blue border
                strokeWeight(1.5);
                fill(this.colors.boxLeft2);
                stroke(191, 9, 6); // red border
                fill(this.colors.boxRight);
                stroke(191, 9, 6); // orange border
            }

        }
        


        const totalWidth = cols * this.boxSize;
        const totalHeight = rows * this.boxSize;
        const startX = -totalWidth / 2 -10;
        const startY = -totalHeight - 15;
        
        let boxesDrawn = 0;
        let positions = [];

        // Calculate all possible positions
        for(let r = rows - 1; r >= 0; r--) {
            for(let c = 0; c < cols; c++) {
                positions.push({
                    x: startX + c * this.boxSize,
                    y: startY + r * this.boxSize
                });
            }
        }

        // Draw boxes with fade effect
        for(let pos of positions) {
            if (boxesDrawn >= Math.floor(count)) break;
            
            // Choose color based on correctness
            fill(isCorrect ? correctColor : boxColor);
            rect(pos.x, pos.y, this.boxSize-2, this.boxSize-2, 2);
            boxesDrawn++;
        }

        // Draw partial box if there's a fraction
        if (boxesDrawn < count) {
            const fraction = count - Math.floor(count);
            if (fraction > 0 && boxesDrawn < positions.length) {
                const pos = positions[boxesDrawn];
                const currentColor = isCorrect ? correctColor : boxColor;
                fill(red(currentColor), green(currentColor), blue(currentColor), 255 * fraction);
                rect(pos.x, pos.y, this.boxSize-2, this.boxSize-2, 2);
            }
        }
        
        pop();
    }

    updateLabels(model) {
        // Update labels with green color for correct values
        const leftLabel1 = document.getElementById('leftLabel1');
        leftLabel1.textContent = `${model.leftPan.section1.boxes}x`;
        leftLabel1.style.color = model.leftPan.section1.isCorrect ? '#4CAF50' : '#333';

        const leftLabel2 = document.getElementById('leftLabel2');
        leftLabel2.textContent = `${model.leftPan.section2.boxes}`;
        leftLabel2.style.color = model.leftPan.section2.isCorrect ? '#4CAF50' : '#333';

        const rightLabel = document.getElementById('rightLabel');
        rightLabel.textContent = `${model.rightPan.boxes}`;
        rightLabel.style.color = model.rightPan.isCorrect ? '#4CAF50' : '#333';
    }

    updateBeamAngle(balance) {
        const targetAngle = map(balance, -50, 50, -0.2, 0.2);
        this.beamAngle = lerp(this.beamAngle, targetAngle, 0.1);
    }
}

// Controller - Handles user input and updates model/view
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Slider controls
        document.getElementById('leftSlider1').addEventListener('input', (e) => {
            this.model.updateBoxes('left1', parseInt(e.target.value));
        });
        
        document.getElementById('leftSlider2').addEventListener('input', (e) => {
            this.model.updateBoxes('left2', parseInt(e.target.value));
        });
        
        document.getElementById('rightSlider').addEventListener('input', (e) => {
            this.model.updateBoxes('right', parseInt(e.target.value));
        });

        // Solution controls
        document.getElementById('solveButton').addEventListener('click', () => {
            this.model.startSolutionSteps();
        });
       
        document.getElementById('prevStep').addEventListener('click', () => {
            if (this.model.currentStep > 1) {
                this.model.showStep(this.model.currentStep -1);
            }
        });

        document.getElementById('nextStep').addEventListener('click', () => {
            if (this.model.currentStep < 2) {
                this.model.showStep(this.model.currentStep + 1);
            }
        });

        document.getElementById('newProblem').addEventListener('click', () => {
            this.model.generateNewEquation();
        });
    }

    update() {
        this.model.updateAnimation();
        const balance = this.model.calculateBalance();
        this.view.updateBeamAngle(balance);
        this.view.draw(this.model);
    }
}

// Global variables for MVC instances
let model, view, controller;

function setup() {
    model = new Model();
    view = new View();
    view.setup();
    controller = new Controller(model, view);
}

function draw() {
    controller.update();
} 