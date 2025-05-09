// Model - will handle data and calculations
class Model {
    constructor() {
        this.fractions = [];
        this.operations = [];
        this.answer = { numerator: 0, denominator: 1 };
        this.generateQuestion();
    }
    
    generateQuestion() {
        this.fractions = [];
        this.operations = [];
        const possibleDenominators = [2, 3, 4, 5, 6, 7, 8];
        let triplet;
        let lcm;
        do {
            triplet = [
                possibleDenominators[this.getRandomInt(0, possibleDenominators.length - 1)],
                possibleDenominators[this.getRandomInt(0, possibleDenominators.length - 1)],
                possibleDenominators[this.getRandomInt(0, possibleDenominators.length - 1)]
            ];
            lcm = this.findLCM(triplet);
        } while (lcm > 100);
        
        const den1 = triplet[0];
        const num1 = this.getRandomInt(1, den1 - 1);
        this.fractions.push({ numerator: num1, denominator: den1 });
        
        const den2 = triplet[1];
        const maxNum2 = Math.floor((num1 * den2) / den1);
        const num2Range = Math.min(den2 - 1, Math.max(1, maxNum2 - 1));
        const num2 = this.getRandomInt(1, num2Range);
        this.fractions.push({ numerator: num2, denominator: den2 });
        
        this.operations.push('-');
        
        const den3 = triplet[2];
        const num3 = this.getRandomInt(1, den3 - 1);
        this.fractions.push({ numerator: num3, denominator: den3 });
        
        this.operations.push('+');
        
        this.calculateAnswer();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        let i = 5;
        while (i * i <= num) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
            i += 6;
        }
        return true;
    }
    
    getFactors(num) {
        const factors = [];
        for (let i = 2; i <= Math.floor(num / 2); i++) {
            if (num % i === 0) {
                factors.push(i);
            }
        }
        return factors.length > 0 ? factors : [1];
    }
    
    calculateAnswer() {
        const lcm = this.findLCM(this.fractions.map(f => f.denominator));
        const equivalentNumerators = this.fractions.map(f => 
            f.numerator * (lcm / f.denominator)
        );
        
        let result = equivalentNumerators[0];
        for (let i = 0; i < this.operations.length; i++) {
            if (this.operations[i] === '+') {
                result += equivalentNumerators[i + 1];
            } else {
                result -= equivalentNumerators[i + 1];
            }
        }
        const gcd = this.findGCD(Math.abs(result), lcm);
        this.answer = {
            numerator: result / gcd,
            denominator: lcm / gcd
        };
    }
    
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    findGCD(a, b) {
        return b === 0 ? a : this.findGCD(b, a % b);
    }
    
    findLCM(numbers) {
        return numbers.reduce((lcm, number) => 
            (lcm * number) / this.findGCD(lcm, number), 1);
    }
}

// View - will handle UI updates
class View {
    constructor() {
        this.canvasContainer = document.getElementById('canvas-container');
        this.correctAnswerCount = 0;
        this.operationWidth = 20;
        this.showSolution = false;
        
        this.p5Instance = new p5((p) => {
            this.p = p;
            
            p.setup = () => {
                const canvas = p.createCanvas(900, 400);
                canvas.parent('canvas-container');
                p.textAlign(p.CENTER, p.CENTER);
                p.textFont('Arial');
                p.background(255);
            };
            
            p.draw = () => {
                // We'll manually trigger redraws
            };
            
            p.mousePressed = () => {
                if (this.showAnimation) {
                    const playButtonX = this.animationBaseX + 510;
                    const playButtonY = this.animationBaseY + 20;
                    const playButtonSize = 30;
                    if (
                        p.mouseX >= playButtonX - playButtonSize / 2 &&
                        p.mouseX <= playButtonX + playButtonSize / 2 &&
                        p.mouseY >= playButtonY - playButtonSize / 2 &&
                        p.mouseY <= playButtonY + playButtonSize / 2
                    ) {
                        this.isAnimationPlaying = true;
                        this.animationProgress = 0;
                        this.animateFractions();
                    }
                }
            };
        }, this.canvasContainer);
        
        this.showAnswer = false;
        this.showHint = false;
        this.showWarning = false;
        this.hintErrorMessage = '';
        this.hintText = '';
        this.hintDenominators = [];
        this.showAnimation = false;
        this.isAnimationPlaying = false;
        this.animationProgress = 0;
        this.animationFractions = [];
        
        this.checkButton = document.getElementById('check-btn');
        this.triesSpan = document.getElementById('tries');
        this.newProblemButton = document.getElementById('new-btn');
        this.messageDisplay = document.getElementById('messageArea');
        
        setTimeout(() => {
            if (this.model && this.p) {
                this.drawEquation();
            }
        }, 100);
    }
    
    setModel(model) {
        this.model = model;
    }
   
    drawEquation() {
        const p = this.p;
        const fractions = this.model.fractions;
        const operations = this.model.operations;
        
        p.background(255);
        
        p.stroke(200);
        p.strokeWeight(0);
        p.noFill();
        p.rect(0, 0, p.width-1, p.height-1);
        
        p.textSize(16);
        p.fill(0);
        p.noStroke(0);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.text(`Number Correct: ${this.correctAnswerCount}`, 20, p.height - 20);
        p.textAlign(p.CENTER, p.CENTER);
        
        let x = 40;
        const y = 60;
        const fractionWidth = 30;
        const operationWidth = 20;
        
        for (let i = 0; i < fractions.length; i++) {
            p.noStroke();
            p.text(fractions[i].numerator.toString(), x, y - 20);
            
            p.stroke(0);
            p.strokeWeight(2);
            p.line(x - fractionWidth/2, y, x + fractionWidth/2, y);
            
            p.noStroke();
            p.text(fractions[i].denominator.toString(), x, y + 20);
            
            if (i < operations.length) {
                x += fractionWidth + 5;
                p.textSize(16);
                p.text(operations[i], x, y);
                p.textSize(16);
                x += operationWidth + 10;
            }
        }
        
        x += fractionWidth + 10;
        p.textSize(16);
        p.text("=", x, y);
        p.textSize(16);
        
        this.answerInputX = x + operationWidth + 10;
        this.answerInputY = y;
        
        if (this.showAnswer) {
            p.noStroke();
            p.text(this.model.answer.numerator.toString(), this.answerInputX, y - 20);
            
            p.stroke(0);
            p.strokeWeight(2);
            p.line(this.answerInputX - fractionWidth/2, y, this.answerInputX + fractionWidth/2, y);
            
            p.noStroke();
            p.text(this.model.answer.denominator.toString(), this.answerInputX, y + 20);
        } else {
            this.updateAnswerInputPosition();
        }
        
        if (this.showHint) {
            this.drawHint();
        } else if (this.showAnimation) {
            this.drawAnimation();
        }
        
        if (this.showSolution) {
            this.drawSolution();
        }
        
        if (this.successMessage) {
            const messageX = this.answerInputX - 200;
            const messageY = this.answerInputY + 65;
            
            if (this.successMessageType === 'success') {
                p.fill('#28a745');
            } else if (this.successMessageType === 'error') {
                p.fill('#dc3545');
            }
            
            p.textSize(16);
            p.textFont('Arial', 'bold');
            p.textAlign(p.LEFT, p.TOP);
            p.text(this.successMessage, messageX + 80, messageY);
            
            p.textAlign(p.CENTER, p.CENTER);
        }
    }
    
    drawSolution() {
        const p = this.p;
        const solutionX = p.width - 300;
        const solutionY = 20;
        
        p.fill('#28a745');
        p.textSize(16);
        p.textFont('Arial', 'bold');
        p.textAlign(p.LEFT, p.TOP);
        p.text("Possible Solution", solutionX, solutionY);
        
        const lcm = this.model.findLCM(this.model.fractions.map(f => f.denominator));
        
        p.fill('#28a745');
        p.textSize(14);
        p.textFont('Arial', 'normal');
        p.text(`${lcm} is a common denominator.`, solutionX, solutionY + 25);
        
        const equivalentFractions = this.model.fractions.map(fraction => {
            const equivalentNumerator = fraction.numerator * (lcm / fraction.denominator);
            return {
                original: fraction,
                equivalent: {
                    numerator: equivalentNumerator,
                    denominator: lcm
                }
            };
        });
        
        let y = solutionY + 70;
        let x = solutionX;
        const fractionWidth = 20;
        const operationWidth = 15;
        const lineHeight = 40;
        
        for (let i = 0; i < equivalentFractions.length; i++) {
            const fraction = equivalentFractions[i];
            
            p.noStroke();
            p.fill('#28a745');
            p.textSize(14);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(fraction.original.numerator.toString(), x, y - 10);
            
            p.stroke(0);
            p.strokeWeight(1);
            p.line(x - fractionWidth/2, y, x + fractionWidth/2, y);
            
            p.noStroke();
            p.text(fraction.original.denominator.toString(), x, y + 10);
            
            x += fractionWidth + 5;
            
            if (i < this.model.operations.length) {
                p.text(this.model.operations[i], x, y);
                x += operationWidth + 5;
            }
        }
        
        x += 5;
        p.text("=", x, y);
        x += operationWidth + 5;
        
        for (let i = 0; i < equivalentFractions.length; i++) {
            const fraction = equivalentFractions[i];
            
            p.noStroke();
            p.text(fraction.equivalent.numerator.toString(), x, y - 10);
            
            p.stroke(0);
            p.strokeWeight(1);
            p.line(x - fractionWidth/2, y, x + fractionWidth/2, y);
            
            p.noStroke();
            p.text(fraction.equivalent.denominator.toString(), x, y + 10);
            
            x += fractionWidth + 5;
            
            if (i < this.model.operations.length) {
                p.text(this.model.operations[i], x, y);
                x += operationWidth + 5;
            }
        }
        
        y += lineHeight + 10;
        x = solutionX;
        let numeratorExpressions = [];
        numeratorExpressions.push(equivalentFractions[0].equivalent.numerator);
        for (let i = 0; i < this.model.operations.length; i++) {
            const nextNum = equivalentFractions[i+1].equivalent.numerator;
            if (this.model.operations[i] === '+') {
                numeratorExpressions.push('+');
                numeratorExpressions.push(nextNum);         
            } else {
                numeratorExpressions.push('-');
                numeratorExpressions.push(nextNum);
            }
        }
        p.textAlign(p.LEFT, p.CENTER);
        p.text("= ", x, y);
        x += 20;
        
        let expressionWidth = 0;
        let expressionX = x;
        
        for (let i = 0; i < numeratorExpressions.length; i++) {
            const part = numeratorExpressions[i];
            p.textAlign(p.CENTER, p.CENTER);
            p.text(part.toString(), expressionX, y - 10);
            expressionX += (i % 2 === 0) ? 15 : 10;
            expressionWidth += (i % 2 === 0) ? 15 : 10;
        }
        
        p.stroke(0);
        p.strokeWeight(1);
        const lineWidth = Math.max(fractionWidth, expressionWidth);
        p.line(x - 5, y, x + lineWidth, y);
        
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.text(lcm.toString(), x + lineWidth/2, y + 10);
        
        y += lineHeight + 10;
        x = solutionX;
        let result = equivalentFractions[0].equivalent.numerator;
        for (let i = 0; i < this.model.operations.length; i++) {
            const nextNum = equivalentFractions[i+1].equivalent.numerator;
            if (this.model.operations[i] === '+') {
                result += nextNum;
            } else {
                result -= nextNum;
            }
        }
        
        p.textAlign(p.LEFT, p.CENTER);
        p.text("= ", x, y);
        x += 20;
        
        p.textAlign(p.CENTER, p.CENTER);
        p.text(result.toString(), x, y - 10);
        
        p.stroke(0);
        p.strokeWeight(1);
        p.line(x - fractionWidth/2, y, x + fractionWidth/2, y);
        
        p.noStroke();
        p.text(lcm.toString(), x, y + 10);
        
        const gcd = this.model.findGCD(Math.abs(result), lcm);
        if (gcd > 1) {
            y += lineHeight + 10;
            x = solutionX;
            
            const simplifiedNum = result / gcd;
            const simplifiedDen = lcm / gcd;
            
            p.textAlign(p.LEFT, p.CENTER);
            p.text("= ", x, y);
            x += 20;
            
            p.textAlign(p.CENTER, p.CENTER);
            p.text(simplifiedNum.toString(), x, y - 10);
            
            p.stroke(0);
            p.strokeWeight(1);
            p.line(x - fractionWidth/2, y, x + fractionWidth/2, y);
            
            p.noStroke();
            p.text(simplifiedDen.toString(), x, y + 10);
        }
        
        p.textAlign(p.CENTER, p.CENTER);
    }
    
    drawHint() {
        const p = this.p;
        const baseX = this.answerInputX - 200;
        const baseY = this.answerInputY + 100;
        p.fill('#dc3545');
        p.textSize(16);
        p.textFont('Arial', 'bold');
        p.textAlign(p.LEFT, p.TOP);

        if (this.hintErrorMessage) {
            p.text(this.hintErrorMessage, baseX + 80, baseY - 35);
        }
        if (!this.showWarning) {
            p.fill('#dc3545');
            p.textSize(16);
            p.text("Hint", baseX, baseY);
            p.fill('#555');
            p.textSize(14);
            p.text(this.hintText, baseX, baseY + 10 + 5 + 10);
            
            let tableY = baseY + 10 + 5 + 16 + 15;
            this.hintDenominators.forEach((den, index) => {
                p.fill('#333');
                p.textSize(14);
                p.textAlign(p.RIGHT, p.TOP);
                p.text(`${den}:`, baseX + 25, tableY);
                p.textAlign(p.CENTER, p.TOP);
                let multipleX = baseX + 35;
                for (let i = 1; i <= 10; i++) {
                    p.text(den * i, multipleX + 10, tableY);
                    multipleX += 35;
                }
                tableY += 24;
            });
        }
        p.textAlign(p.CENTER, p.CENTER);
    }
    
    drawAnimation() {
        const p = this.p;
        this.animationBaseX = this.answerInputX - 200;
        this.animationBaseY = this.answerInputY + 100;
        
        p.fill('#dc3545');
        p.textSize(16);
        p.textFont('Arial', 'bold');
        p.textAlign(p.LEFT, p.TOP);
        if (this.hintErrorMessage === '✗ Maybe next time') {
            p.text(this.hintErrorMessage, this.animationBaseX - 10, this.animationBaseY - 35);
        } else {
            p.text(this.hintErrorMessage, this.animationBaseX + 80, this.animationBaseY - 35);
        }
        
        p.fill('#dc3545');
        p.textSize(16);
        p.textFont('Arial', 'bold');
        p.text("Hint", this.animationBaseX, this.animationBaseY);
        
        p.fill('#555');
        p.textSize(14);
        p.textFont('Arial', 'normal');
        p.text(
            'Write each fraction as an equivalent fraction using the common denominator.\nPress play to create a common denominator.',
            this.animationBaseX,
            this.animationBaseY + 10 + 5 + 10
        );
        
        const barWidth = 300;
        const barHeight = 40;
        const barSpacing = 10;
        let barY = this.animationBaseY + 50;
        
        this.model.fractions.forEach((fraction, index) => {
            const totalUnits = fraction.denominator;
            const filledUnits = fraction.numerator;
            const unitWidth = barWidth / totalUnits;
            
            p.stroke(0);
            p.strokeWeight(1);
            p.noFill();
            p.rect(this.animationBaseX, barY, barWidth, barHeight);
            
            p.noStroke();
            p.fill("#8A2BE2");
            p.rect(this.animationBaseX, barY, unitWidth * filledUnits, barHeight);
            
            p.stroke(0);
            p.strokeWeight(1);
            for (let i = 1; i < totalUnits; i++) {
                const x = this.animationBaseX + i * unitWidth;
                p.line(x, barY, x, barY + barHeight);
            }
            
            barY += barHeight + barSpacing;
        });
        
        if (!this.isAnimationPlaying) {
            const playButtonX = this.animationBaseX + 510;
            const playButtonY = this.animationBaseY + 20;
            const playButtonSize = 30;
            
            p.fill("#8A2BE2");
            p.noStroke();
            p.ellipse(playButtonX, playButtonY, playButtonSize, playButtonSize);
            
            if (this.animationProgress >= 1) {
                this.drawAnimatedFractions(barWidth, barHeight, barSpacing);
                p.noFill();
                p.stroke(255);
                p.strokeWeight(2);
                p.arc(playButtonX, playButtonY, playButtonSize * 0.6, playButtonSize * 0.6, -p.PI/2, p.PI);
                p.noStroke();
                p.fill(255);
                const arrowAngle = p.PI * 1.25;
                const arrowX = playButtonX + Math.cos(arrowAngle) * (playButtonSize * 0.19);
                const arrowY = playButtonY + Math.sin(arrowAngle) * (playButtonSize * 0.19);
                p.push();
                p.translate(arrowX, arrowY);
                p.rotate(p.PI * 1.7 + p.PI/2);
                p.triangle(-4, -6, 4, -6, 0, 0);
                p.pop();
            } else {
                p.fill(255);
                p.triangle(
                    playButtonX - 5, playButtonY - 7,
                    playButtonX - 5, playButtonY + 7,
                    playButtonX + 7, playButtonY
                );
            }
        } else {
            this.drawAnimatedFractions(barWidth, barHeight, barSpacing);
        }
        
        p.textAlign(p.CENTER, p.CENTER);
    }
    
    drawAnimatedFractions(barWidth, barHeight, barSpacing) {
        const p = this.p;
        let barY = this.animationBaseY + 50;
        const lcm = this.model.findLCM(this.model.fractions.map(f => f.denominator));
        
        this.model.fractions.forEach((fraction, index) => {
            const equivalentNumerator = fraction.numerator * (lcm / fraction.denominator);
            const totalUnits = lcm;
            const filledUnits = equivalentNumerator;
            const unitWidth = barWidth / totalUnits;
            
            p.stroke(0);
            p.strokeWeight(1);
            p.noFill();
            p.rect(this.animationBaseX, barY, barWidth, barHeight);
            
            p.noStroke();
            p.fill("#8A2BE2");
            p.rect(this.animationBaseX, barY, unitWidth * filledUnits, barHeight);
            
            p.stroke(0);
            p.strokeWeight(1);
            const linesToDraw = Math.floor(this.animationProgress * (totalUnits - 1));
            for (let i = 1; i <= linesToDraw; i++) {
                const x = this.animationBaseX + i * unitWidth;
                p.line(x, barY, x, barY + barHeight);
            }
            
            const textX = this.animationBaseX + barWidth + 100;
            const textY = barY + barHeight / 2;
            
            p.noStroke();
            p.fill(0);
            p.textSize(14);
            p.textAlign(p.CENTER, p.CENTER);
            
            p.text(fraction.numerator.toString(), textX - 30, textY - 10);
            p.stroke(0);
            p.strokeWeight(1);
            p.line(textX - 40, textY, textX - 20, textY);
            p.noStroke();
            p.text(fraction.denominator.toString(), textX - 30, textY + 10);
            
            p.text("=", textX, textY);
            
            p.text(equivalentNumerator.toString(), textX + 30, textY - 10);
            p.stroke(0);
            p.strokeWeight(1);
            p.line(textX + 20, textY, textX + 40, textY);
            p.noStroke();
            p.text(lcm.toString(), textX + 30, textY + 10);
            
            barY += barHeight + barSpacing;
        });
        
        p.textAlign(p.CENTER, p.CENTER);
    }
    
    animateFractions() {
        const p = this.p;
        const animationDuration = 110;
        
        const animate = () => {
            if (this.animationProgress < 1) {
                this.animationProgress += 1 / animationDuration;
                this.drawEquation();
                p.frameRate(60);
                requestAnimationFrame(animate);
            } else {
                this.animationProgress = 1;
                this.isAnimationPlaying = false;
                this.drawEquation();
            }
        };
        
        animate();
    }
    
    showMessageWithHint(text, type) {
        this.messageDisplay.style.display = 'block';
        this.hintErrorMessage = text;
        if (this.attemptCount === 2) {
            this.showWarning = false;
            this.hintText = 'Explore the multiples of the denominators to find a common denominator.';
            this.hintDenominators = this.model.fractions.map(f => f.denominator);
            this.showHint = true;
            this.showAnimation = false;
            this.isAnimationPlaying = false;
        } else if (this.attemptCount === 1) {
            this.showHint = false;
            this.showWarning = true;
            this.showAnimation = true;
            this.isAnimationPlaying = false;
            this.animationProgress = 0;
        } else if (type === 'success') {
            this.showHint = false;
            this.showWarning = false;
            this.successMessage = text;
            this.successMessageType = 'success';
            this.showAnimation = false;
            this.isAnimationPlaying = false;
        } else if (type === 'error') {
            this.successMessage = text;
            this.successMessageType = 'error';
        }
        this.drawEquation();
    }
    
    resetAnswerCheck() {
        this.numeratorInput.disabled = false;
        this.denominatorInput.disabled = false;
        this.numeratorInput.style.backgroundColor = 'white';
        this.denominatorInput.style.backgroundColor = 'white';
        this.numeratorInput.value = '';
        this.denominatorInput.value = '';
        
        this.checkButton.style.display = 'block';
        this.checkButton.style.visibility = 'visible';
        this.checkButton.className = 'btn-outline-success';
        this.checkButton.disabled = true;
        this.triesSpan.textContent = '3';
        
        this.newProblemButton.style.display = 'none';
        
        this.answerChecked = false;
        this.attemptCount = 3;
        this.userAnswer = { numerator: '', denominator: '' };
        
        this.messageDisplay.innerHTML = '';
        this.messageDisplay.style.display = 'none';
        
        this.showHint = false;
        this.showWarning = false;
        this.showAnimation = false;
        this.isAnimationPlaying = false;
        this.showSolution = false;
        this.successMessage = null;
        this.successMessageType = null;
        this.drawEquation();
    }
    
    updateAnswerInputPosition() {
        if (this.inputContainer) {
            if (!this.inputPositionSet) {
                this.inputContainer.style.position = 'absolute';
                this.inputContainer.style.left = `${this.answerInputX}px`;
                this.inputContainer.style.top = `${this.answerInputY - 15}px`;
                this.inputContainer.style.display = 'block';
                this.inputPositionSet = true;
            }
        } else {
            this.inputContainer = this.createAnswerInput();
            this.inputPositionSet = true;
        }
    }
    
    createAnswerInput() {
        const inputContainer = document.createElement('div');
        inputContainer.style.position = 'absolute';
        inputContainer.style.left = `${this.answerInputX}px`;
        inputContainer.style.top = `${this.answerInputY - 30}px`;
        inputContainer.style.display = 'flex';
        inputContainer.style.flexDirection = 'column';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.minHeight = '100px';
        inputContainer.style.minWidth = '200px';
        
        this.numeratorInput = document.createElement('input');
        this.numeratorInput.type = 'text';
        this.numeratorInput.style.width = '50px';
        this.numeratorInput.style.textAlign = 'center';
        this.numeratorInput.style.border = '1px solid #888';
        this.numeratorInput.style.borderRadius = '3px';
        this.numeratorInput.style.padding = '2px';
        this.numeratorInput.style.marginBottom = '5px';
        this.numeratorInput.style.position = 'absolute';
        this.numeratorInput.style.top = '0px';
        this.numeratorInput.style.left = '0px';

        const fractionLine = document.createElement('div');
        fractionLine.style.width = '60px';
        fractionLine.style.height = '2px';
        fractionLine.style.backgroundColor = 'black';
        fractionLine.style.margin = '2px 0';
        fractionLine.style.position = 'absolute';
        fractionLine.style.top = '25px';
        fractionLine.style.left = '-2px';
        
        this.denominatorInput = document.createElement('input');
        this.denominatorInput.type = 'text';
        this.denominatorInput.style.width = '50px';
        this.denominatorInput.style.textAlign = 'center';
        this.denominatorInput.style.border = '1px solid #888';
        this.denominatorInput.style.borderRadius = '3px';
        this.denominatorInput.style.padding = '2px';
        this.denominatorInput.style.marginTop = '5px';
        this.denominatorInput.style.position = 'absolute';
        this.denominatorInput.style.top = '30px';
        this.denominatorInput.style.left = '0px';
        
        inputContainer.appendChild(this.numeratorInput);
        inputContainer.appendChild(fractionLine);
        inputContainer.appendChild(this.denominatorInput);
        
        this.canvasContainer.appendChild(inputContainer);
        
        this.userAnswer = { numerator: '', denominator: '' };
        this.answerChecked = false;
        
        this.numeratorInput.addEventListener('input', () => {
            this.userAnswer.numerator = this.numeratorInput.value;
            this.updateCheckButtonState();
        });
        
        this.denominatorInput.addEventListener('input', () => {
            this.userAnswer.denominator = this.denominatorInput.value;
            this.updateCheckButtonState();
        });
        
        this.checkButton.addEventListener('click', () => {
            if (this.answerChecked) {
                this.resetAnswerCheck();
            } else {
                this.checkAnswer();
            }
        });
        
        this.newProblemButton.addEventListener('click', () => {
            console.log("New problem button clicked");
            this.model.generateQuestion();
            this.resetAnswerCheck();
            this.drawEquation();
        });
        
        this.createOnScreenKeyboard();
        
        this.numeratorInput.addEventListener('click', () => {
            this.currentInput = this.numeratorInput;
            this.showOnScreenKeyboard();
        });
        
        this.denominatorInput.addEventListener('click', () => {
            this.currentInput = this.denominatorInput;
            this.showOnScreenKeyboard();
        });
        
        return inputContainer;
    }
    
    createOnScreenKeyboard() {
        // Create keyboard container
        this.keyboardContainer = document.createElement('div');
        this.keyboardContainer.style.position = 'absolute';
        this.keyboardContainer.style.left = '50%';
        this.keyboardContainer.style.transform = 'translateX(-50%)';
        this.keyboardContainer.style.bottom = '20px';
        this.keyboardContainer.style.width = '600px';
        this.keyboardContainer.style.backgroundColor = '#f0f0f0';
        this.keyboardContainer.style.border = '1px solid #ccc';
        this.keyboardContainer.style.borderRadius = '5px';
        this.keyboardContainer.style.padding = '10px';
        this.keyboardContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        this.keyboardContainer.style.zIndex = '1000';
        
        // Key layout
        const keyboardLayout = [
            ['x', 'y', 'z', ',', '7', '8', '9', '×', '÷'],
            ['□²', '□ⁿ', '√□', '□', '4', '5', '6', '+', '-'],
            ['π', 'e', 'i', '°', '1', '2', '3', '=', '⌫'],
            ['(', ')', '/', '%', '0', '.', '<', '>', '←']
        ];
        
        // Create keyboard rows and keys
        keyboardLayout.forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.style.display = 'flex';
            rowElement.style.justifyContent = 'center';
            rowElement.style.margin = '5px 0';
            
            row.forEach(key => {
                const keyButton = document.createElement('button');
                
                // Set key text - important for visibility
                keyButton.innerText = key;
                
                // Explicitly set text color to black for visibility
                keyButton.style.color = '#000000';
                
                // Set text properties for better visibility
                keyButton.style.fontFamily = 'Arial, sans-serif';
                keyButton.style.fontSize = '18px';
                keyButton.style.fontWeight = 'bold';
                
                // Button styling
                keyButton.style.width = '50px';
                keyButton.style.height = '40px';
                keyButton.style.margin = '0 5px';
                keyButton.style.cursor = 'pointer';
                keyButton.style.border = '1px solid #333';
                keyButton.style.borderRadius = '4px';
                keyButton.style.backgroundColor = '#fff';
                keyButton.style.display = 'flex';
                keyButton.style.alignItems = 'center';
                keyButton.style.justifyContent = 'center';
                
                // Add a distinctive background for function keys
                if (key === '⌫' || key === '←') {
                    keyButton.style.backgroundColor = '#e0e0e0';
                }
                
                keyButton.addEventListener('click', () => {
                    if (!this.currentInput) return;
                    
                    if (key === '⌫') {
                        this.currentInput.value = this.currentInput.value.slice(0, -1);
                    } else if (key === '←') {
                        return;
                    } else if (key === '×') {
                        this.currentInput.value += '*';
                    } else if (key === '÷') {
                        this.currentInput.value += '/';
                    } else if (key === '□' || key === '/' || key === '%') {
                        return;
                    } else {
                        this.currentInput.value += key;
                    }
                    
                    if (this.currentInput === this.numeratorInput) {
                        this.userAnswer.numerator = this.currentInput.value;
                    } else if (this.currentInput === this.denominatorInput) {
                        this.userAnswer.denominator = this.currentInput.value;
                    }
                    
                    const event = new Event('input', { bubbles: true });
                    this.currentInput.dispatchEvent(event);
                });
                
                rowElement.appendChild(keyButton);
            });
            
            this.keyboardContainer.appendChild(rowElement);
        });
        
        document.body.appendChild(this.keyboardContainer);
        
        // Show keyboard when input fields are clicked
        this.numeratorInput.addEventListener('click', () => {
            this.showOnScreenKeyboard(this.numeratorInput);
        });
        
        this.denominatorInput.addEventListener('click', () => {
            this.showOnScreenKeyboard(this.denominatorInput);
        });
        
        document.addEventListener('click', (event) => {
            if (!this.keyboardContainer.contains(event.target) && 
                event.target !== this.numeratorInput &&
                event.target !== this.denominatorInput) {
                this.hideOnScreenKeyboard();
            }
        });
    }
    
    showOnScreenKeyboard() {
        if (this.keyboardContainer) {
            this.keyboardContainer.style.display = 'block';
        }
    }
    
    hideOnScreenKeyboard() {
        if (this.keyboardContainer) {
            this.keyboardContainer.style.display = 'none';
        }
    }
    
    updateCheckButtonState() {
        if (this.userAnswer.numerator.trim() !== '' && this.userAnswer.denominator.trim() !== '') {
            this.checkButton.disabled = false;
            this.checkButton.className = 'btn-outline-success';
        } else {
            this.checkButton.disabled = true;
            this.checkButton.className = 'btn-outline-success';
        }
    }
    
    checkAnswer() {
        if (typeof this.attemptCount === 'undefined') {
            this.attemptCount = 3;
        }
        
        const userNum = parseInt(this.userAnswer.numerator);
        const userDen = parseInt(this.userAnswer.denominator);
        
        if (isNaN(userNum) || isNaN(userDen)) {
            this.showMessageWithHint('Please enter valid numbers for both numerator and denominator.', 'warning');
            return;
        }
        
        if (userDen === 0) {
            this.showMessageWithHint('Denominator cannot be zero.', 'warning');
            return;
        }
        
        const gcd = this.model.findGCD(Math.abs(userNum), Math.abs(userDen));
        const simplifiedUserNum = userNum / gcd;
        const simplifiedUserDen = userDen / gcd;
        
        const correctNum = this.model.answer.numerator;
        const correctDen = this.model.answer.denominator;
        
        const isCorrect = (simplifiedUserNum === correctNum && simplifiedUserDen === correctDen) ||
                          (simplifiedUserNum / simplifiedUserDen === correctNum / correctDen);
        
        if (isCorrect) {
            this.correctAnswerCount++;
            this.checkButton.style.display = 'none';
            this.numeratorInput.style.backgroundColor = '#d4edda';
            this.denominatorInput.style.backgroundColor = '#d4edda';
            this.numeratorInput.disabled = true;
            this.denominatorInput.disabled = true;
            this.answerChecked = true;
            this.hintErrorMessage = '';
            this.showHint = false;
            this.showWarning = false;
            this.showAnimation = false;
            this.isAnimationPlaying = false;
            this.successMessage = '✓ Correct!';
            this.successMessageType = 'success';
            this.drawEquation();
            this.newProblemButton.style.display = 'inline-block';
        } else {
            this.attemptCount--;
            this.triesSpan.textContent = this.attemptCount;
            
            if (this.attemptCount === 0) {
                this.checkButton.className = 'btn-outline-danger';
                this.numeratorInput.style.backgroundColor = '#f8d7da';
                this.denominatorInput.style.backgroundColor = '#f8d7da';
                this.checkButton.style.display = 'none';
                this.numeratorInput.disabled = true;
                this.denominatorInput.disabled = true;
                this.answerChecked = true;
                this.showMessageWithHint('✗ Maybe next time', 'error');
                this.showSolution = true;
                this.drawEquation();
                this.newProblemButton.style.display = 'inline-block';
            } else if (this.attemptCount === 1 || this.attemptCount === 2) {
                this.checkButton.className = 'btn-outline-success';
                this.numeratorInput.value = '';
                this.denominatorInput.value = '';
                this.userAnswer.numerator = '';
                this.userAnswer.denominator = '';
                this.checkButton.disabled = true;
                this.showMessageWithHint('✗ Try again', 'error');
            }
        }
    }
    
    showAnswerOnCanvas() {
        this.showAnswer = true;
        this.drawEquation();
        if (this.inputContainer) {
            this.inputContainer.style.display = 'none';
        }
    }
    
    resetAnswer() {
        this.showAnswer = false;
        this.userAnswer = '';
        if (this.inputContainer) {
            this.inputContainer.style.display = 'block';
        }
        this.drawEquation();
    }
}

// Controller - will connect Model and View
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.setModel(this.model);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const model = new Model();
    const view = new View();
    const controller = new Controller(model, view);
});