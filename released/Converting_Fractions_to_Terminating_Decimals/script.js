class PuzzleModel {
    constructor() {
        this.availableDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.puzzle = {
            emptyBoxes: [
                { id: 'numerator1', value: null, x: 0, y: 0, width: 50, height: 50, isHighlighted: false },
                { id: 'denominator1', value: null, x: 0, y: 0, width: 50, height: 50, isHighlighted: false },
                { id: 'denominator2', value: null, x: 0, y: 0, width: 50, height: 50, isHighlighted: false },
                { id: 'result', value: null, x: 0, y: 0, width: 50, height: 50, isHighlighted: false }
            ]
        };
        this.usedDigits = [];
        this.solutions = [];
        this.solutionsFound = 0;
        this.currentPuzzleIndex = 0;
        this.foundSolutions = new Set();
        this.currentAttemptMessage = "";
        this.isCorrectSolution = false;
        
        this.puzzleTemplates = [
            {
                message: "Place digits to make the fraction equal to 0.something",
                solutions: this.generateSolutions(box => {
                    const a = box.numerator1;
                    const b = box.denominator1;
                    const c = box.denominator2;
                    const d = box.result;
                    return Math.abs(a / (b * 10 + c) - d / 10) < 1e-4;
                })
            }
        ];
        
        this.resetPuzzle();
    }
    
    generateSolutions(validationFunc) {
        const solutions = [];
        
        for (let a = 1; a <= 9; a++) {
            for (let b = 1; b <= 9; b++) {
                if (b === a) continue;
                for (let c = 1; c <= 9; c++) {
                    if (c === a || c === b) continue;
                    for (let d = 1; d <= 9; d++) {
                        if (d === a || d === b || d === c) continue;
                        
                        const box = {
                            numerator1: a,
                            denominator1: b,
                            denominator2: c,
                            result: d
                        };
                        
                        if (b * 10 + c === 0) continue;
                        
                        if (validationFunc(box)) {
                            solutions.push({
                                numerator1: a,
                                denominator1: b,
                                denominator2: c,
                                result: d
                            });
                        }
                    }
                }
            }
        }
        
        return solutions;
    }
    
    resetPuzzle() {
        this.puzzle.emptyBoxes.forEach(box => {
            box.value = null;
            box.isHighlighted = false;
        });
        this.usedDigits = [];
        this.currentAttemptMessage = "";
        this.isCorrectSolution = false;
        
        const currentTemplate = this.puzzleTemplates[this.currentPuzzleIndex];
        this.solutions = currentTemplate.solutions;
    }
    
    setBoxValue(boxId, value) {
        const box = this.puzzle.emptyBoxes.find(b => b.id === boxId);
        if (!box) return false;
        
        if (box.value === value) return true;
        
        if (value !== null && this.usedDigits.includes(value)) {
            const sourceBox = this.puzzle.emptyBoxes.find(b => b.value === value);
            if (sourceBox) {
                sourceBox.value = null;
                this.usedDigits = this.usedDigits.filter(d => d !== value);
            } else {
                return false;
            }
        }
        
        if (box.value !== null) {
            this.usedDigits = this.usedDigits.filter(d => d !== box.value);
        }
        
        box.value = value;
        if (value !== null) {
            this.usedDigits.push(value);
        }
        
        if (this.puzzle.emptyBoxes.every(box => box.value !== null)) {
            this.checkSolution();
        } else {
            this.currentAttemptMessage = "";
            this.isCorrectSolution = false;
        }
        
        return true;
    }
    
    checkSolution() {
        const allFilled = this.puzzle.emptyBoxes.every(box => box.value !== null);
        if (!allFilled) return false;
        
        const boxValues = {
            numerator1: this.getBoxValueById('numerator1'),
            denominator1: this.getBoxValueById('denominator1'),
            denominator2: this.getBoxValueById('denominator2'),
            result: this.getBoxValueById('result')
        };
        
        if ((boxValues.denominator1 * 10 + boxValues.denominator2) === 0) return false;
        
        const solutionKey = `${boxValues.numerator1}-${boxValues.denominator1}-${boxValues.denominator2}-${boxValues.result}`;
        
        const numerator = boxValues.numerator1;
        const denominator = boxValues.denominator1 * 10 + boxValues.denominator2;
        const fraction = numerator / denominator;
        const desiredResult = boxValues.result / 10;
        const isValid = Math.abs(fraction - desiredResult) < 1e-4;
        
        const isSolution = this.solutions.some(solution => 
            solution.numerator1 === boxValues.numerator1 &&
            solution.denominator1 === boxValues.denominator1 &&
            solution.denominator2 === boxValues.denominator2 &&
            solution.result === boxValues.result
        );
        
        if (isValid) {
            if (!this.foundSolutions.has(solutionKey)) {
                this.solutionsFound++;
                this.foundSolutions.add(solutionKey);
                this.isCorrectSolution = true;
                this.currentAttemptMessage = "You found a correct solution!";
            } else {
                this.isCorrectSolution = true;
                this.currentAttemptMessage = `${numerator}/${denominator} = 0.${boxValues.result}`;
            }
        } else {
            this.isCorrectSolution = false;
            this.currentAttemptMessage = `${numerator}/${denominator} = ${fraction.toFixed(4)}. Keep trying!`;
        }
        
        return isValid;
    }
    
    getBoxValueById(id) {
        const box = this.puzzle.emptyBoxes.find(b => b.id === id);
        return box ? box.value : null;
    }
    
    isDigitUsed(digit) {
        return this.usedDigits.includes(digit);
    }

    highlightBox(boxId, highlight) {
        const box = this.puzzle.emptyBoxes.find(b => b.id === boxId);
        if (box) {
            box.isHighlighted = highlight;
            return true;
        }
        return false;
    }

    resetHighlights() {
        this.puzzle.emptyBoxes.forEach(box => {
            box.isHighlighted = false;
        });
    }
}

class PuzzleView {
    constructor(model, controller) {
        this.model = model;
        this.controller = controller;
        this.sketch = null;
        this.digitsRowY = 80;
        this.digitsStartX = 50;
        this.digitSize = 50;
        this.digitSpacing = 60;
        this.equationY = 200;
        this.hoveredDigit = null;
        this.hoveredBox = null;
        this.lastClickTime = 0;
        this.lastClickX = 0;
        this.lastClickY = 0;
        this.doubleClickThreshold = 300;
        
        model.puzzle.emptyBoxes[0].x = 250;
        model.puzzle.emptyBoxes[0].y = this.equationY - 60;
        
        model.puzzle.emptyBoxes[1].x = 220;
        model.puzzle.emptyBoxes[1].y = this.equationY + 10;
        
        model.puzzle.emptyBoxes[2].x = 280;
        model.puzzle.emptyBoxes[2].y = this.equationY + 10;
        
        model.puzzle.emptyBoxes[3].x = 390;
        model.puzzle.emptyBoxes[3].y = this.equationY - 30;
        
        this.createCanvas();
    }
    
    createCanvas() {
        const that = this;
        this.sketch = new p5(function(p) {
            p.setup = function() {
                const canvas = p.createCanvas(700, 400);
                canvas.parent('canvas-container');
            };
            
            p.draw = function() {
                p.background(255);
                that.drawTitle(p);
                that.drawAvailableDigits(p);
                that.drawEquation(p);
                that.drawSolutionsCount(p);
                that.drawAttemptMessage(p);
                that.drawInstructions(p);
                
                if (that.controller.isDragging && that.controller.selectedDigit !== null) {
                    that.drawDraggingDigit(p);
                }
                
                that.checkHoverInteractions(p);
            };
            
            p.mousePressed = function() {
                that.handleMousePressed(p);
            };
            
            p.mouseDragged = function() {
                that.handleMouseDragged(p);
            };
            
            p.mouseReleased = function() {
                that.handleMouseReleased(p);
            };
            
            p.touchStarted = function(event) {
                if (event) event.preventDefault();
                if (p.touches && p.touches.length > 0) {
                    p.mouseX = p.touches[0].x;
                    p.mouseY = p.touches[0].y;
                }
                that.handleMousePressed(p);
                return false;
            };
            
            p.touchMoved = function(event) {
                if (event) event.preventDefault();
                if (p.touches && p.touches.length > 0) {
                    p.mouseX = p.touches[0].x;
                    p.mouseY = p.touches[0].y;
                }
                that.handleMouseDragged(p);
                return false;
            };
            
            p.touchEnded = function(event) {
                that.handleMouseReleased(p);
                return false;
            };
        });
    }

    checkHoverInteractions(p) {
        this.hoveredDigit = null;
        this.hoveredBox = null;
        
        if (this.controller.isDragging) {
            return;
        }
        
        if (this.controller.selectedDigit !== null && !this.controller.isDragging) {
            for (const box of this.model.puzzle.emptyBoxes) {
                if (p.mouseX >= box.x && p.mouseX <= box.x + box.width &&
                    p.mouseY >= box.y && p.mouseY <= box.y + box.height) {
                    this.hoveredBox = box;
                    break;
                }
            }
        } else {
            this.model.resetHighlights();
            
            for (let i = 0; i < this.model.availableDigits.length; i++) {
                const digit = this.model.availableDigits[i];
                const x = this.digitsStartX + i * this.digitSpacing;
                const y = this.digitsRowY;
                
                // Only allow hover on unused digits
                if (!this.model.isDigitUsed(digit) &&
                    p.mouseX >= x && p.mouseX <= x + this.digitSize &&
                    p.mouseY >= y && p.mouseY <= y + this.digitSize) {
                    this.hoveredDigit = digit;
                    break;
                }
            }
            
            for (const box of this.model.puzzle.emptyBoxes) {
                if (box.value !== null && 
                    p.mouseX >= box.x && p.mouseX <= box.x + box.width &&
                    p.mouseY >= box.y && p.mouseY <= box.y + box.height) {
                    this.hoveredBox = box;
                    box.isHighlighted = true;
                    break;
                }
            }
        }
    }
    
    drawTitle(p) {
        p.fill(50);
        p.textSize(20);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("How many ways can you place the digits to make a true statement?", p.width/2, 30);
    }
    
    drawInstructions(p) {
        p.fill(100);
        p.textSize(16);
        p.textAlign(p.CENTER, p.CENTER);
    }
    
    drawAvailableDigits(p) {
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(24);
        
        for (let i = 0; i < this.model.availableDigits.length; i++) {
            const digit = this.model.availableDigits[i];
            const x = this.digitsStartX + i * this.digitSpacing;
            const y = this.digitsRowY;
            
            // Always draw the digit, but style differently if used
            if (this.model.isDigitUsed(digit)) {
                // Used digit: grayed out, semi-transparent
                p.fill(150, 150, 150, 100); // Gray with low opacity
                p.stroke(100, 100, 100, 100);
                p.strokeWeight(1);
            } else if (this.controller.isDragging && digit === this.controller.selectedDigit) {
                continue; // Skip digit being dragged
            } else if (digit === this.controller.selectedDigit && !this.controller.isDragging) {
                p.fill(120, 120, 240);
                p.stroke(50, 50, 220);
                p.strokeWeight(4);
            } else if (digit === this.hoveredDigit) {
                p.fill(180, 180, 240);
                p.stroke(80, 80, 200);
                p.strokeWeight(3);
            } else {
                p.fill(200, 200, 230);
                p.stroke(100, 100, 180);
                p.strokeWeight(1);
            }
            
            p.rect(x, y, this.digitSize, this.digitSize, 5);
            
            // Draw the digit number
            if (this.model.isDigitUsed(digit)) {
                p.fill(50, 50, 50, 100); // Dark gray text, semi-transparent
            } else {
                p.fill(50, 50, 100);
            }
            p.noStroke();
            p.text(digit, x + this.digitSize/2, y + this.digitSize/2);
        }
        p.strokeWeight(1);
    }
    
    drawDraggingDigit(p) {
        p.fill(100, 100, 240, 220);
        p.stroke(40, 40, 220);
        p.strokeWeight(3);
        p.rect(p.mouseX - this.digitSize/2, p.mouseY - this.digitSize/2, 
              this.digitSize, this.digitSize, 5);
        
        p.fill(255);
        p.textSize(26);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(this.controller.selectedDigit, p.mouseX, p.mouseY);
        
        for (const box of this.model.puzzle.emptyBoxes) {
            if (p.mouseX >= box.x && p.mouseX <= box.x + box.width &&
                p.mouseY >= box.y && p.mouseY <= box.y + box.height) {
                box.isHighlighted = true;
                p.fill(180, 220, 255, 150);
                p.stroke(0, 80, 220);
                p.strokeWeight(4);
                p.rect(box.x, box.y, box.width, box.height, 5);
            } else if (box.value === null) {
                box.isHighlighted = true;
            }
        }
        
        p.strokeWeight(1);
    }
    
    drawEquation(p) {
        p.fill(50);
        p.textSize(28);
        p.textAlign(p.CENTER, p.CENTER);
        
        p.strokeWeight(1);
        p.stroke(0);
        p.line(230, this.equationY, 330, this.equationY);
        
        p.text("0.", 370, this.equationY);
        p.text("=", 350, this.equationY);

        for (const box of this.model.puzzle.emptyBoxes) {
            this.drawBox(p, box);
        }
    }
    
    drawBox(p, box) {
        if (this.controller.isDragging && 
            p.mouseX >= box.x && p.mouseX <= box.x + box.width &&
            p.mouseY >= box.y && p.mouseY <= box.y + box.height) {
            p.fill(180, 220, 255);
            p.stroke(0, 80, 220);
            p.strokeWeight(4);
        } else if (this.controller.selectedDigit !== null && box.value === null) {
            p.fill(220, 240, 250);
            p.stroke(40, 120, 220);
            p.strokeWeight(3);
        } else if (box === this.hoveredBox) {
            p.fill(200, 220, 255);
            p.stroke(20, 100, 200);
            p.strokeWeight(4);
        } else if (box.isHighlighted) {
            p.fill(230, 230, 255);
            p.stroke(100, 140, 220);
            p.strokeWeight(2);
        } else {
            p.fill(240, 240, 255);
            p.stroke(100, 100, 200);
            p.strokeWeight(2);
        }
        
        p.rect(box.x, box.y, box.width, box.height, 5);
        
        if (box.value !== null) {
            p.fill(50, 50, 100);
            p.noStroke();
            p.textSize(24);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(box.value, box.x + box.width/2, box.y + box.height/2);
        }
        
        p.strokeWeight(1);
    }
    
    drawSolutionsCount(p) {
        p.fill(50);
        p.textSize(18);
        p.textAlign(p.LEFT, p.CENTER);
        p.text("Number of solutions found: " + this.model.solutionsFound, 20, 360);
    }
    
    drawAttemptMessage(p) {
        if (this.model.currentAttemptMessage) {
            p.textAlign(p.CENTER, p.CENTER);
            
            if (this.model.isCorrectSolution) {
                p.fill(40, 150, 40);
                p.textSize(22);
            } else {
                p.fill(50);
                p.textSize(18);
            }
            
            p.text(this.model.currentAttemptMessage, p.width/2, 300);
        }
    }
    
    getDigitAtPosition(p, x, y) {
        for (let i = 0; i < this.model.availableDigits.length; i++) {
            const digit = this.model.availableDigits[i];
            const digitX = this.digitsStartX + i * this.digitSpacing;
            const digitY = this.digitsRowY;
            
            if (x >= digitX && x <= digitX + this.digitSize &&
                y >= digitY && y <= digitY + this.digitSize) {
                return { digit, index: i };
            }
        }
        return null;
    }
    
    getBoxAtPosition(p, x, y) {
        for (const box of this.model.puzzle.emptyBoxes) {
            if (x >= box.x && x <= box.x + box.width &&
                y >= box.y && y <= box.y + box.height) {
                return box;
            }
        }
        return null;
    }
    
    handleMousePressed(p) {
        let posX, posY;
        
        if (p.touches && p.touches.length > 0) {
            posX = p.touches[0].x;
            posY = p.touches[0].y;
        } else {
            posX = p.mouseX;
            posY = p.mouseY;
        }
        
        const currentTime = p.millis();
        const isDoubleClick = (currentTime - this.lastClickTime < this.doubleClickThreshold) &&
            Math.abs(posX - this.lastClickX) < 5 && Math.abs(posY - this.lastClickY) < 5;
        
        this.lastClickTime = currentTime;
        this.lastClickX = posX;
        this.lastClickY = posY;
        
        const box = this.getBoxAtPosition(p, posX, posY);
        if (isDoubleClick && box && box.value !== null) {
            this.model.setBoxValue(box.id, null);
            this.model.checkSolution();
            this.controller.deselectDigit();
            return;
        }
        
        if (box && box.value !== null) {
            if (this.controller.selectedDigit === box.value && this.controller.sourceBox === box) {
                this.controller.deselectDigit();
            } else {
                this.controller.selectDigitFromBox(box);
            }
            return;
        }
        
        const digitInfo = this.getDigitAtPosition(p, posX, posY);
        if (digitInfo && !this.model.isDigitUsed(digitInfo.digit)) {
            if (this.controller.selectedDigit === digitInfo.digit && !this.controller.sourceBox) {
                this.controller.deselectDigit();
            } else {
                this.controller.selectDigit(digitInfo.digit);
            }
            return;
        }
        
        if (this.controller.selectedDigit !== null) {
            if (box && box.value === null) {
                const success = this.controller.placeDigitInBox(
                    this.controller.selectedDigit, 
                    box.id, 
                    this.controller.sourceBox
                );
                
                if (success) {
                    this.model.checkSolution();
                }
                
                this.controller.deselectDigit();
            } else {
                this.controller.deselectDigit();
            }
        }
    }
    
    handleMouseDragged(p) {
        if (this.controller.selectedDigit !== null && !this.controller.isDragging) {
            let posX, posY;
            if (p.touches && p.touches.length > 0) {
                posX = p.touches[0].x;
                posY = p.touches[0].y;
            } else {
                posX = p.mouseX;
                posY = p.mouseY;
            }
            this.controller.startDragging(posX, posY);
        }
    }
    
    handleMouseReleased(p) {
        if (this.controller.isDragging && this.controller.selectedDigit !== null) {
            let posX = p.mouseX;
            let posY = p.mouseY;
            
            const targetBox = this.getBoxAtPosition(p, posX, posY);
            if (targetBox) {
                const success = this.controller.placeDigitInBox(
                    this.controller.selectedDigit,
                    targetBox.id,
                    this.controller.sourceBox
                );
                
                if (success) {
                    this.model.checkSolution();
                }
            } else if (this.controller.sourceBox) {
                const digitInfo = this.getDigitAtPosition(p, posX, posY);
                if (digitInfo && digitInfo.digit === this.controller.selectedDigit && 
                    digitInfo.index === this.model.availableDigits.indexOf(this.controller.selectedDigit)) {
                    this.model.setBoxValue(this.controller.sourceBox.id, null);
                    this.model.checkSolution();
                }
            }
            
            this.controller.endDragging();
        }
    }
}

class PuzzleController {
    constructor(model) {
        this.model = model;
        this.sourceBox = null;
        this.selectedDigit = null;
        this.isDragging = false;
        this.dragX = 0;
        this.dragY = 0;
    }
    
    selectDigit(digit) {
        this.selectedDigit = digit;
        this.sourceBox = null;
        
        this.model.resetHighlights();
        for (const box of this.model.puzzle.emptyBoxes) {
            if (box.value === null) {
                box.isHighlighted = true;
            }
        }
        return true;
    }
    
    selectDigitFromBox(box) {
        this.selectedDigit = box.value;
        this.sourceBox = box;
        
        this.model.resetHighlights();
        for (const targetBox of this.model.puzzle.emptyBoxes) {
            if (targetBox !== box) {
                targetBox.isHighlighted = true;
            }
        }
        return true;
    }
    
    deselectDigit() {
        this.selectedDigit = null;
        this.sourceBox = null;
        this.isDragging = false;
        this.model.resetHighlights();
    }
    
    startDragging(x, y) {
        this.isDragging = true;
        this.dragX = x;
        this.dragY = y;
    }
    
    endDragging() {
        this.isDragging = false;
        this.deselectDigit();
    }
    
    placeDigitInBox(digit, boxId, sourceBox) {
        const success = this.model.setBoxValue(boxId, digit);
        return success;
    }
    
    resetPuzzle() {
        this.model.resetPuzzle();
        this.selectedDigit = null;
        this.sourceBox = null;
        this.isDragging = false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const model = new PuzzleModel();
    const controller = new PuzzleController(model);
    const view = new PuzzleView(model, controller);
    
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', function() {
        controller.resetPuzzle();
    });
    
    resetButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        controller.resetPuzzle();
    }, false);
    
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.tagName !== 'INPUT') {
            e.preventDefault();
        }
    }, { passive: false });
});