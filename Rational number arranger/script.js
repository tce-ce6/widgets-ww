// Global variables
let simulation;

// A new class to store the raw, un-normalized fraction string
class RawFraction {
    constructor(numStr, denStr) {
        this.numStr = numStr;
        this.denStr = denStr;
    }
    toString() {
        return `${this.numStr}/${this.denStr}`;
    }
}


class Fraction {
    constructor(numerator, denominator) {
        this.numerator = numerator;
        this.denominator = denominator;
        this.normalize();
    }

    normalize() {
        // Handle negative denominators
        if (this.denominator < 0) {
            this.numerator = -this.numerator;
            this.denominator = -this.denominator;
        }

        // Simplify the fraction
        const gcd = this.gcd(Math.abs(this.numerator), Math.abs(this.denominator));
        this.numerator /= gcd;
        this.denominator /= gcd;
    }

    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    toString() {
        return `${this.numerator}/${this.denominator}`;
    }

    toDecimal() {
        return this.numerator / this.denominator;
    }

    convertToCommonDenominator(lcm) {
        const multiplier = lcm / this.denominator;
        const newNum = this.numerator * multiplier;
        // Return a plain object to prevent auto-normalization by the Fraction constructor
        return {
            numerator: newNum,
            denominator: lcm,
            toString: () => `${newNum}/${lcm}`,
            toDecimal: () => newNum / lcm
        };
    }
}

class RationalNumberSimulation {
    constructor() {
        this.step = 1; // Start from Step 1
        this.rawFractions = []; // To store original input strings
        this.fractions = [];
        this.normalizedFractions = [];
        this.equivalentFractions = [];
        this.lcm = 1;
        this.animationProgress = 0;
        this.draggedIndex = -1;
        this.dragOffset = { x: 0, y: 0 };
        this.userOrder = [];
        this.correctOrder = [];
        this.showHint = false;
        this.stepAnimations = {
            normalization: 0,
            lcmCalculation: 0,
            conversion: 0,
            comparison: 0
        };
    }

    startWithFractions(fractionStrings) {
        this.fractions = [];
        this.rawFractions = [];
        this.normalizedFractions = [];
        this.equivalentFractions = [];
        this.userOrder = [];
        this.step = 1; // Ensure it resets to step 1
        this.animationProgress = 0;

        // Parse input fractions
        for (let str of fractionStrings) {
            const parts = str.trim().split('/');
            if (parts.length === 2) {
                const num = parseInt(parts[0]);
                const den = parseInt(parts[1]);
                if (!isNaN(num) && !isNaN(den) && den !== 0) {
                    this.rawFractions.push(new RawFraction(parts[0], parts[1])); // Store raw strings
                    this.fractions.push(new Fraction(num, den));
                }
            }
        }

        if (this.fractions.length < 2 || this.fractions.length > 5) {
            alert("Please enter 2-5 valid fractions!");
            return false;
        }

        this.normalizedFractions = [...this.fractions];
        this.calculateLCM();
        this.createEquivalentFractions();
        this.calculateCorrectOrder();
        this.userOrder = [...Array(this.fractions.length).keys()];

        return true;
    }

    calculateLCM() {
        const denominators = this.normalizedFractions.map(f => f.denominator);
        this.lcm = denominators.reduce((acc, val) => this.lcmTwo(acc, val), 1);
    }

    lcmTwo(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    }

    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    createEquivalentFractions() {
        this.equivalentFractions = this.normalizedFractions.map(f =>
            f.convertToCommonDenominator(this.lcm)
        );
    }

    calculateCorrectOrder() {
        this.correctOrder = [...Array(this.fractions.length).keys()]
            .sort((a, b) => this.equivalentFractions[a].toDecimal() - this.equivalentFractions[b].toDecimal());
    }

    nextStep() {
        if (this.step < 6) {
            this.step++;
            this.animationProgress = 0;
            this.resetStepAnimations();
        }
    }

    resetStepAnimations() {
        for (let key in this.stepAnimations) {
            this.stepAnimations[key] = 0;
        }
    }

    update() {
        // Update animations
        this.animationProgress = min(this.animationProgress + 0.02, 1);

        // Update step-specific animations
        for (let key in this.stepAnimations) {
            this.stepAnimations[key] = min(this.stepAnimations[key] + 0.015, 1);
        }
    }

    draw() {
        background(255, 255, 255);

        // Step indicator
        this.drawStepIndicator();

        // Main content based on current step
        switch (this.step) {
            case 1: this.drawInputStep(); break;
            case 2: this.drawNormalizationStep(); break;
            case 3: this.drawLCMStep(); break;
            case 4: this.drawConversionStep(); break;
            case 5: this.drawArrangementStep(); break;
            case 6: this.drawFinalAnswer(); break;
        }

        // Navigation buttons
        this.drawNavigationButtons();
    }

    drawStepIndicator() {
        const steps = ["Input", "Normalize", "Find LCM", "Convert", "Arrange", "Final"];
        const stepWidth = width / steps.length;

        for (let i = 0; i < steps.length; i++) {
            const x = i * stepWidth + stepWidth / 2;
            const y = 60;

            if (i + 1 <= this.step) {
                fill(76, 175, 80);
            } else {
                fill(200);
            }
            circle(x, y, 30);

            fill(255);
            textAlign(CENTER, CENTER);
            textSize(14);
            textStyle(BOLD);
            text(i + 1, x, y);

            fill(50);
            textSize(10);
            text(steps[i], x, y + 25);

            if (i < steps.length - 1) {
                stroke(200);
                line(x + 15, y, x + stepWidth - 15, y);
                noStroke();
            }
        }
    }

    drawInputStep() {
        fill(50);
        textAlign(CENTER, TOP);
        textSize(20);
        text("Step 1: Input Rational Numbers", width / 2, 120);

        textSize(14);
        text("Here are your input fractions:", width / 2, 160);

        const startY = 200;
        for (let i = 0; i < this.rawFractions.length; i++) {
            const x = width / 2 + (i - (this.rawFractions.length - 1) / 2) * 120;
            const progress = this.stepAnimations.normalization;
            const alpha = 255 * progress;

            fill(70, 130, 180, alpha);
            rect(x - 50, startY, 100, 60, 10);

            fill(255, alpha);
            textAlign(CENTER, CENTER);
            textSize(18);
            text(this.rawFractions[i].toString(), x, startY + 30); // Use raw fraction
        }
    }

    drawNormalizationStep() {
        fill(50);
        textAlign(CENTER, TOP);
        textSize(20);
        text("Step 2: Normalize Fractions", width / 2, 120);

        textSize(14);
        text("Standardizing negative signs and simplifying fractions", width / 2, 160);

        const startY = 200;
        const progress = this.stepAnimations.normalization;

        for (let i = 0; i < this.fractions.length; i++) {
            const x = width / 2 + (i - (this.fractions.length - 1) / 2) * 150;

            // Original fraction (from raw input)
            fill(200, 100, 100);
            rect(x - 35, startY, 70, 50, 8);
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(14);
            text(this.rawFractions[i].toString(), x, startY + 25);

            // Arrow with animation
            if (progress > 0) {
                // Curved arrow
                const arrowX = x - 50; // Position arrow to the left of the boxes
                const arrowStartY = startY + 25;
                const arrowEndY = startY + 80 + 25;

                noFill();
                stroke(100);
                strokeWeight(1.5);
                // Draw a bezier curve for the arrow's body
                bezier(
                    arrowX, arrowStartY,      // Anchor point 1
                    arrowX - 40, arrowStartY + 20, // Control point 1
                    arrowX - 40, arrowEndY - 20,   // Control point 2
                    arrowX, arrowEndY        // Anchor point 2
                );

                // Draw the arrowhead
                push();
                translate(arrowX, arrowEndY);
                fill(100);
                noStroke();
                // Arrowhead shape
                triangle(0, 0, -8, -5, -8, 5);
                pop();
            }

            // Normalized fraction (below the original)
            if (progress > 0.5) {
                const normalizedY = startY + 80;
                const alpha = (progress - 0.5) * 2 * 255;
                fill(100, 180, 100, alpha);
                rect(x - 35, normalizedY, 70, 50, 8);
                fill(255, alpha);
                text(this.normalizedFractions[i].toString(), x, normalizedY + 25);
            }
        }
        // Reset drawing styles
        noStroke();
    }


    drawLCMStep() {
        fill(50);
        textAlign(CENTER, TOP);
        textSize(20);
        text("Step 3: Find LCM of Denominators", width / 2, 120);

        const denominators = this.normalizedFractions.map(f => f.denominator);
        textSize(14);
        text("Denominators: " + denominators.join(", "), width / 2, 160);

        const progress = this.stepAnimations.lcmCalculation;
        if (progress > 0.3) {
            // text("Calculating LCM...", width / 2, 190);
        }

        if (progress > 0.6) {
            fill(180, 50, 50);
            textSize(18);
            text(`LCM = ${this.lcm}`, width / 2, 220);
        }

        if (progress > 0.8) {
            this.drawLCMVisualization();
        }
    }

    drawLCMVisualization() {
        const startY = 280;
        const denominators = [...new Set(this.normalizedFractions.map(f => f.denominator))];
        const spacing = 45;
        const startX = 250;

        for (let i = 0; i < denominators.length; i++) {
            const den = denominators[i];
            const y = startY + i * 40;

            fill(100);
            textAlign(RIGHT, CENTER);
            textSize(12);
            text(`${den}: `, startX - 20, y);

            const lcmMultipleCount = this.lcm / den;

            if (lcmMultipleCount <= 7) {
                for (let j = 1; j <= lcmMultipleCount; j++) {
                    const multiple = den * j;
                    const x = startX + (j - 1) * spacing;

                    if (multiple === this.lcm) {
                        fill(255, 100, 100);
                    } else {
                        fill(200);
                    }
                    noStroke();
                    circle(x, y, 25);

                    fill(0);
                    textAlign(CENTER, CENTER);
                    textSize(10);
                    text(multiple, x, y);
                }
            } else {
                for (let j = 1; j <= 7; j++) {
                    const multiple = den * j;
                    const x = startX + (j - 1) * spacing;
                    fill(200);
                    noStroke();
                    circle(x, y, 25);

                    fill(0);
                    textAlign(CENTER, CENTER);
                    textSize(10);
                    text(multiple, x, y);
                }

                const dotsX = startX + 7 * spacing;
                fill(150);
                textAlign(LEFT, CENTER);
                textSize(16);
                text('. . . . .', dotsX, y);

                const finalCircleX = dotsX + 60;
                fill(255, 100, 100);
                noStroke();
                circle(finalCircleX, y, 25);

                fill(0);
                textAlign(CENTER, CENTER);
                textSize(10);
                text(this.lcm, finalCircleX, y);
            }
        }
    }

    drawConversionStep() {
        fill(50);
        textAlign(CENTER, TOP);
        textSize(20);
        text("Step 4: Convert to Equivalent Fractions", width / 2, 120);

        textSize(14);
        text(`Converting all fractions to have denominator ${this.lcm}`, width / 2, 160);

        const startY = 200;
        const progress = this.stepAnimations.conversion;

        for (let i = 0; i < this.normalizedFractions.length; i++) {
            const x = width / 2 + (i - (this.normalizedFractions.length - 1) / 2) * 160;
            let currentY = startY;

            // Blue box (Normalized)
            fill(100, 150, 200);
            rect(x - 40, currentY, 80, 50, 8);
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(16);
            text(this.normalizedFractions[i].toString(), x, currentY + 25);
            currentY += 50;

            // Multiplier text
            if (progress > 0.2) {
                currentY += 25;
                const factor = this.lcm / this.normalizedFractions[i].denominator;
                fill(150);
                textSize(14);
                text(`× ${factor}/${factor}`, x, currentY);
                currentY += 25;
            }

            // Arrow
            if (progress > 0.4) {
                currentY += 10;
                fill(100);
                noStroke();
                triangle(x, currentY + 10, x - 5, currentY, x + 5, currentY); // Downward arrow
                currentY += 20;
            }

            // Green box (Equivalent)
            if (progress > 0.6) {
                const alpha = map(progress, 0.6, 1, 0, 255);
                fill(50, 150, 50, alpha);
                rect(x - 50, currentY, 100, 50, 8);
                fill(255, alpha);
                textSize(16);
                text(this.equivalentFractions[i].toString(), x, currentY + 25);
            }
        }
        noStroke();
    }


    drawArrangementStep() {
        fill(50);
        textAlign(CENTER, TOP);
        textSize(20);
        text("Step 5: Arrange the Fractions", width / 2, 120);

        textSize(14);
        text("Drag the fractions to arrange them from least to greatest", width / 2, 150);

        this.drawNumberLine();
        this.drawDraggableFractions();
        this.drawArrangementFeedback();
    }

    drawNumberLine() {
        const lineY = 250;
        const lineStart = 100;
        const lineEnd = 700;

        stroke(100);
        strokeWeight(3);
        line(lineStart, lineY, lineEnd, lineY);

        noStroke();
        fill(100);
        textAlign(CENTER, TOP);
        textSize(10);

        const minVal = Math.min(...this.equivalentFractions.map(f => f.toDecimal()));
        const maxVal = Math.max(...this.equivalentFractions.map(f => f.toDecimal()));
        const range = maxVal - minVal;

        for (let i = 0; i <= 10; i++) {
            const x = lineStart + (lineEnd - lineStart) * i / 10;
            const val = minVal + range * i / 10;

            stroke(150);
            line(x, lineY - 5, x, lineY + 5);
            noStroke();
            text(val.toFixed(2), x, lineY + 10);
        }
    }

    drawDraggableFractions() {
        const baseY = 300;
        const spacing = (width - 200) / this.fractions.length;

        for (let i = 0; i < this.fractions.length; i++) {
            const orderIndex = this.userOrder[i];
            let x = 100 + orderIndex * spacing + spacing / 2;
            let y = baseY;

            if (this.draggedIndex === i) {
                x = mouseX + this.dragOffset.x;
                y = mouseY + this.dragOffset.y;
            }

            fill(70, 130, 180);
            if (this.draggedIndex === i) {
                fill(100, 160, 210);
            }
            rect(x - 40, y - 25, 80, 50, 10);

            fill(255);
            textAlign(CENTER, CENTER);
            textSize(14);
            text(this.rawFractions[i].toString(), x, y - 5);

            textSize(10);
            fill(200);
            text(this.equivalentFractions[i].toString(), x, y + 15);
        }
    }

    drawArrangementFeedback() {
        fill(76, 175, 80);
        rect(width / 2 - 50, 380, 100, 40, 10);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(14);
        text("Check Order", width / 2, 400);

        fill(255, 152, 0);
        rect(width / 2 - 160, 380, 80, 40, 10);
        fill(255);
        text("Hint", width / 2 - 120, 400);

        if (this.showHint) {
            fill(255, 255, 200, 200);
            rect(50, 430, width - 100, 50, 10);
            fill(100);
            textAlign(CENTER, CENTER);
            textSize(12);
            text("Remember: Negative numbers are smaller. Compare numerators when denominators are equal!", width / 2, 455);
        }
    }

    drawFinalAnswer() {
        fill(50);
        textAlign(CENTER, TOP);
        textSize(20);
        text("Step 6: Final Answer", width / 2, 120);

        textSize(16);
        fill(76, 175, 80);
        text("Congratulations! Here's the complete solution:", width / 2, 160);

        const startY = 200;

        fill(50);
        textSize(14);
        textAlign(LEFT, TOP);
        text("Original fractions:", 100, startY);
        text(this.rawFractions.map(f => f.toString()).join(", "), 250, startY);

        text("Equivalent fractions:", 100, startY + 30);
        text(this.equivalentFractions.map(f => f.toString()).join(", "), 250, startY + 30);

        text("Ascending order:", 100, startY + 60);
        const orderedOriginal = this.correctOrder.map(i => this.rawFractions[i].toString());
        text(orderedOriginal.join(" < "), 250, startY + 60);

        this.drawFinalNumberLine();
    }

    drawFinalNumberLine() {
        const lineY = 350;
        const lineStart = 100;
        const lineEnd = 700;

        stroke(100);
        strokeWeight(3);
        line(lineStart, lineY, lineEnd, lineY);
        noStroke();

        const minVal = Math.min(...this.equivalentFractions.map(f => f.toDecimal()));
        const maxVal = Math.max(...this.equivalentFractions.map(f => f.toDecimal()));
        const range = maxVal - minVal;

        for (let i of this.correctOrder) {
            const fraction = this.equivalentFractions[i];
            const val = fraction.toDecimal();
            const x = lineStart + (lineEnd - lineStart) * (val - minVal) / range;

            fill(76, 175, 80);
            rect(x - 30, lineY - 40, 60, 35, 5);

            fill(255);
            textAlign(CENTER, CENTER);
            textSize(12);
            text(this.rawFractions[i].toString(), x, lineY - 22);

            stroke(150);
            line(x, lineY - 5, x, lineY + 5);
            noStroke();

            fill(100);
            textSize(10);
            text(val.toFixed(2), x, lineY + 15);
        }
    }

    drawNavigationButtons() {
        if (this.step < 6) {
            fill(76, 175, 80);
            rect(width - 120, height - 50, 100, 35, 8);
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(14);
            text("Next Step", width - 70, height - 32);
        }

        if (this.step > 1) {
            fill(150);
            rect(20, height - 50, 100, 35, 8);
            fill(255);
            text("Previous", 70, height - 32);
        }

        if (this.step === 6) {
            fill(255, 152, 0);
            rect(width / 2 - 80, height - 50, 160, 35, 8);
            fill(255);
            text("Try New Set", width / 2, height - 32);
        }
    }

    mousePressed() {
        if (this.step < 6 && mouseX > width - 120 && mouseX < width - 20 &&
            mouseY > height - 50 && mouseY < height - 15) {
            this.nextStep();
            return;
        }

        if (this.step > 1 && mouseX > 20 && mouseX < 120 &&
            mouseY > height - 50 && mouseY < height - 15) {
            this.step--;
            this.animationProgress = 0;
            this.resetStepAnimations();
            return;
        }

        if (this.step === 5) {
            const baseY = 300;
            const spacing = (width - 200) / this.fractions.length;

            for (let i = 0; i < this.fractions.length; i++) {
                const orderIndex = this.userOrder[i];
                const x = 100 + orderIndex * spacing + spacing / 2;
                const y = baseY;

                if (mouseX > x - 40 && mouseX < x + 40 &&
                    mouseY > y - 25 && mouseY < y + 25) {
                    this.draggedIndex = i;
                    this.dragOffset.x = x - mouseX;
                    this.dragOffset.y = y - mouseY;
                    return;
                }
            }

            if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
                mouseY > 380 && mouseY < 420) {
                this.checkAnswer();
                return;
            }

            if (mouseX > width / 2 - 160 && mouseX < width / 2 - 80 &&
                mouseY > 380 && mouseY < 420) {
                this.showHint = !this.showHint;
                return;
            }
        }

        if (this.step === 6 && mouseX > width / 2 - 80 && mouseX < width / 2 + 80 &&
            mouseY > height - 50 && mouseY < height - 15) {
            generateRandom();
            return;
        }
    }

    mouseReleased() {
        if (this.step === 5 && this.draggedIndex !== -1) {
            const spacing = (width - 200) / this.fractions.length;
            let closestIndex = 0;
            let minDistance = Infinity;

            for (let i = 0; i < this.fractions.length; i++) {
                const x = 100 + i * spacing + spacing / 2;
                const distance = Math.abs(mouseX - x);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = i;
                }
            }

            const draggedOrder = this.userOrder[this.draggedIndex];
            const targetOrder = this.userOrder.findIndex(order => order === closestIndex);

            if (targetOrder !== -1) {
                this.userOrder[this.draggedIndex] = closestIndex;
                this.userOrder[targetOrder] = draggedOrder;
            }

            this.draggedIndex = -1;
        }
    }

    checkAnswer() {
        const isCorrect = JSON.stringify(this.userOrder) === JSON.stringify(this.correctOrder);

        if (isCorrect) {
            alert("Correct! Well done! 🎉");
            this.nextStep();
        } else {
            alert("Not quite right. Try again! 💪");
        }
    }
}

function setup() {
    const canvas = createCanvas(800, 500);
    canvas.parent('canvas-container');
    simulation = new RationalNumberSimulation();
}

function draw() {
    simulation.update();
    simulation.draw();
}

function mousePressed() {
    simulation.mousePressed();
}

function mouseReleased() {
    simulation.mouseReleased();
}

function startSimulation() {
    const input = document.getElementById('fractionInput').value;
    let fractionStrings = input.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    if (fractionStrings.length === 0) {
        const placeholderText = document.getElementById('fractionInput').placeholder;
        const defaultFractions = placeholderText.replace('e.g: ', '');
        fractionStrings = defaultFractions.split(',').map(s => s.trim());
    }

    if (fractionStrings.length < 2 || fractionStrings.length > 5) {
        alert("Please enter 2-5 fractions separated by commas!");
        return;
    }

    if (simulation.startWithFractions(fractionStrings)) {
        simulation.step = 1;
    }
}


function initializeDefaultSimulation() {
    const placeholderText = document.getElementById('fractionInput').placeholder;
    const defaultFractions = placeholderText.replace('e.g: ', '');
    const fractionStrings = defaultFractions.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (simulation.startWithFractions(fractionStrings)) {
        simulation.step = 1;
    }
}

function resetSimulation() {
    simulation = new RationalNumberSimulation();
    document.getElementById('fractionInput').value = '';
    initializeDefaultSimulation();
}

function generateRandom() {
    const examples = [
        "-9/10, 7/-8, -3/4",
        "1/2, -3/4, 2/3, -1/6",
        "5/6, -2/3, 1/4",
        "-1/2, 3/-5, -2/7, 1/3",
        "3/8, -5/12, 7/-10"
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    document.getElementById('fractionInput').value = randomExample;
    startSimulation();
}

window.addEventListener('load', () => {
    initializeDefaultSimulation();
});