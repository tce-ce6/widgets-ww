class MixedNumberModel {
            constructor() {
                this.problem = null;
                this.currentCellIndex = 0;
                this.animationProgress = 0;
                this.isAnimating = false;
                this.isSliderDragging = false;
                this.stepsHistory = [];
                this.operation = 'addition';
                this.blueCellsToAnimate = 0;
                this.pinkCellsToAnimate = 0;
                this.totalCellsToAnimate = 0;
                this.blueAnimationIndex = 0;
                this.pinkAnimationIndex = 0;
                this.blueAnimationComplete = false;
                this.animationCompleted = false;
                this.onSliderMaxChange = null;
                this.generateRandomProblem();
            }

generateRandomProblem() {
    this.operation = Math.random() < 0.5 ? 'addition' : 'subtraction';

    let whole1, num1, den1, whole2, num2, den2;
    let totalValue, denomProduct;

    do {
        if (this.operation === 'subtraction') {
            do {
                whole1 = Math.floor(Math.random() * 2) + 2;  // 2 or 3
                num1 = Math.floor(Math.random() * 3) + 1;    // 1, 2, 3
                den1 = Math.floor(Math.random() * 3) + 2;    // 2, 3, 4

                whole2 = Math.floor(Math.random() * 2) + 1;  // 1 or 2
                num2 = Math.floor(Math.random() * 3) + 4;    // 4, 5, 6
                den2 = Math.floor(Math.random() * 3) + 2;    // 2, 3, 4

            } while (
                (whole1 + num1 / den1) <= (whole2 + num2 / den2) || 
                (num1 / den1) <= (num2 / den2)
            );
        } else {
            whole1 = Math.floor(Math.random() * 2) + 2;      // 2 or 3
            num1 = Math.floor(Math.random() * 3) + 1;        // 1, 2, 3
            den1 = Math.floor(Math.random() * 5) + 2;        // 2 to 6

            whole2 = Math.floor(Math.random() * 2) + 1;      // 1 or 2
            num2 = Math.floor(Math.random() * 2) + 1;        // 1 or 2
            den2 = Math.floor(Math.random() * 5) + 2;        // 2 to 6
        }

        const value1 = whole1 + num1 / den1;
        const value2 = whole2 + num2 / den2;
        totalValue = this.operation === 'subtraction' ? value1 : value1 + value2;
        denomProduct = den1 * den2;

    } while (totalValue >= 10 || denomProduct >= 12);

    const actualNum1 = num1 % den1 || 1;
    const actualNum2 = num2 % den2 || 1;

    this.problem = {
        first: { whole: whole1, num: actualNum1, den: den1 },
        second: { whole: whole2, num: actualNum2, den: den2 }
    };

    this.calculateSteps();
    this.currentCellIndex = 0;
    this.isAnimating = false;
    this.isSliderDragging = false;
    this.animationProgress = 0;
    this.blueAnimationIndex = 0;
    this.pinkAnimationIndex = 0;
    this.blueAnimationComplete = false;
    this.animationCompleted = false;
    this.stepsHistory = [this.steps.original];
}

         
calculateSteps() {
    const { first, second } = this.problem;
    const operatorSymbol = this.operation === 'addition' ? '+' : '-';
    const sameDenominators = first.den === second.den;
    let lcm, firstEquiv, secondEquiv;
    
    if (sameDenominators) {
        lcm = first.den;
        firstEquiv = { whole: first.whole, num: first.num, den: first.den };
        secondEquiv = { whole: second.whole, num: second.num, den: second.den };
    } else {
        lcm = first.den * second.den;
        firstEquiv = { whole: first.whole, num: first.num * second.den, den: lcm };
        secondEquiv = { whole: second.whole, num: second.num * first.den, den: lcm };
    }
    
    let totalWhole, totalNum, finalWhole, finalNum;
    if (this.operation === 'addition') {
        totalWhole = firstEquiv.whole + secondEquiv.whole;
        totalNum = firstEquiv.num + secondEquiv.num;
        finalWhole = totalWhole;
        finalNum = totalNum;
        if (totalNum >= lcm) {
            finalWhole += Math.floor(totalNum / lcm);
            finalNum = totalNum % lcm;
        }
    } else {
        totalWhole = firstEquiv.whole - secondEquiv.whole;
        totalNum = firstEquiv.num - secondEquiv.num;
        finalWhole = totalWhole;
        finalNum = totalNum;
        if (totalNum < 0) {
            finalWhole -= 1;
            finalNum = totalNum + lcm;
        }
    }
    
    // Fixed step calculation with proper brackets and formatting
    this.steps = {
        original: `${first.whole} ${first.num}/${first.den} ${operatorSymbol} ${second.whole} ${second.num}/${second.den}`,
        equivalent: `${firstEquiv.whole} ${operatorSymbol} ${secondEquiv.whole} (${firstEquiv.num}/${firstEquiv.den} ${operatorSymbol} ${secondEquiv.num}/${firstEquiv.den})`,
        grouped: `${totalWhole} (${totalNum}/${lcm})`,
        added: finalNum === 0 ? `${finalWhole}` : `${finalWhole} ${finalNum}/${lcm}`
    };
    
    this.lcmValue = lcm;
    this.equivalentFractions = { firstEquiv, secondEquiv };
    this.sameDenominators = sameDenominators;
    this.resultWhole = finalWhole;
    this.resultNum = finalNum;
    this.calculateTotalCellsToAnimate();
}
             calculateTotalCellsToAnimate() {
                this.blueCellsToAnimate = this.equivalentFractions.firstEquiv.whole + this.equivalentFractions.firstEquiv.num;
                this.pinkCellsToAnimate = this.equivalentFractions.secondEquiv.whole + this.equivalentFractions.secondEquiv.num;
                if (this.operation === 'addition') {
                    if (this.sameDenominators) {
                        this.totalCellsToAnimate = this.blueCellsToAnimate + this.pinkCellsToAnimate;
                    } else {
                        const cols = this.problem.first.den;
                        const rows = this.problem.second.den;
                        const cellsPerBox = cols * rows;
                        const firstCells = this.equivalentFractions.firstEquiv.whole * cellsPerBox + this.equivalentFractions.firstEquiv.num;
                        const secondCells = this.equivalentFractions.secondEquiv.whole * cellsPerBox + this.equivalentFractions.secondEquiv.num;
                        this.totalCellsToAnimate = firstCells + secondCells;
                    }
                } else {
                    this.totalCellsToAnimate = this.blueCellsToAnimate + this.pinkCellsToAnimate;
                }
                if (this.onSliderMaxChange) {
                    this.onSliderMaxChange(this.totalCellsToAnimate);
                }
            }

            gcd(a, b) {
                return b === 0 ? a : this.gcd(b, a % b);
            }

            lcm(a, b) {
                return (a * b) / this.gcd(a, b);
            }

            setCellIndex(index) {
                this.currentCellIndex = Math.max(0, Math.min(this.totalCellsToAnimate, index));
                console.log("🚀 ~ MixedNumberModel ~ setCellIndex ~ this.currentCellIndex:", this.currentCellIndex)
                this.blueAnimationIndex = Math.min(this.currentCellIndex, this.blueCellsToAnimate);
                this.pinkAnimationIndex = Math.max(0, this.currentCellIndex - this.blueCellsToAnimate);
                this.blueAnimationComplete = this.blueAnimationIndex >= this.blueCellsToAnimate;
                this.isAnimating = this.isSliderDragging;
                console.log("🚀 ~ MixedNumberModel ~ setCellIndex ~ this.isAnimating:", this.isAnimating)
                this.animationProgress = this.isAnimating ? this.animationProgress : 1;
                console.log("🚀 ~ MixedNumberModel ~ setCellIndex ~ this.animationProgress:", this.animationProgress)
                console.log("🚀 ~ MixedNumberModel ~ setCellIndex ~ this.operation:", this.operation)
                this.updateStepsHistory();
                if (this.currentCellIndex >= this.totalCellsToAnimate && this.operation === 'subtraction') {
                    this.animationCompleted = true;
                } else {
                    this.animationCompleted = false;
                }
                  // ADD THIS LINE:
                this.animationProgress = this.isSliderDragging ? 0 : 1;
            }

            setSliderDragging(isDragging) {
                this.isSliderDragging = isDragging;
                this.isAnimating = isDragging;
                if (!isDragging) {
                    this.animationProgress = 1;
                }
            }

updateStepsHistory() {
    const stepTexts = [
        this.steps.original,
        this.steps.equivalent,
        this.steps.grouped,
        this.steps.added
    ];
    
    let mathStep = 0;
    if (this.currentCellIndex > 0) mathStep = 1;
    if (this.currentCellIndex >= this.blueCellsToAnimate) mathStep = 2;
    if (this.currentCellIndex >= this.totalCellsToAnimate) mathStep = 3;
    
    this.stepsHistory = stepTexts.slice(0, mathStep + 1);
}



            updateAnimation() {
                if (this.isAnimating) {
                    this.animationProgress += 0.01;
                    if (this.animationProgress >= 1) {
                        this.animationProgress = 1;
                    }
                }
            }
        }

        class MixedNumberView {
            constructor(model, p5Instance) {
                this.model = model;
                this.p = p5Instance;
                this.boxSize = 70;
                this.boxSpacing = 10;
                this.allBoxes = [];
                this.crossOutBoxes = [];
                this.previousCellIndex = -1;
            }

          draw() {
    this.p.background(255);
    this.p.stroke(0);
    this.model.updateAnimation();
    
    if (this.previousCellIndex !== this.model.currentCellIndex) {
        this.setupBoxAnimations();
        this.previousCellIndex = this.model.currentCellIndex;
    }
    
    this.drawSteps();
    
    if (this.model.currentCellIndex === 0) {
        // Always show the current state (original or equivalent based on same denominators)
        if (this.model.sameDenominators) {
            this.drawOriginalFractions();
        } else {
            this.drawEquivalentFractions(); // This will show original fractions due to the modified drawMixedNumberLCM
        }
    } else {
        this.drawEquivalentFractions();
        this.drawAnimatedCells();
    }
    
    if (this.model.operation === 'subtraction' && !this.model.animationCompleted) {
        this.drawCrossOutBoxes();
    }
}

            setupBoxAnimations() {
                console.log("🚀 ~ MixedNumberView ~ setupBoxAnimations ~ this.model.currentCellIndex:", this.setupBoxAnimations)
                this.allBoxes = [];
                this.crossOutBoxes = [];
                if (this.model.currentCellIndex >= 1) {
                    const startY = 250;
                    let destX = 50;
                    this.setupWholeNumberAnimations(destX, startY);
                    const wholeBoxCount = this.model.operation === 'addition'
                        ? this.model.equivalentFractions.firstEquiv.whole + this.model.equivalentFractions.secondEquiv.whole
                        : this.model.equivalentFractions.firstEquiv.whole;
                    const fractionStartX = destX + wholeBoxCount * (this.boxSize + this.boxSpacing);
                    this.setupFractionAnimations(fractionStartX, startY);
                }
            }

            setupWholeNumberAnimations(destX, startY) {
                const srcY = 80;
                let srcX = 50;
                let currentDestX = destX;
                let index = 0;
                // Blue whole boxes
                for (let i = 0; i < this.model.equivalentFractions.firstEquiv.whole; i++) {
                    this.allBoxes.push({
                        srcX: srcX,
                        srcY: srcY,
                        destX: currentDestX,
                        destY: startY,
                        width: this.boxSize,
                        height: this.boxSize,
                        color: this.p.color(77, 166, 255),
                        animationIndex: index++,
                        type: 'blue'
                    });
                    srcX += this.boxSize + this.boxSpacing;
                    currentDestX += this.boxSize + this.boxSpacing;
                }
                let pinkDestX = this.model.operation === 'addition' ? currentDestX : destX;
                srcX = 50 + this.model.equivalentFractions.firstEquiv.whole * (this.boxSize + this.boxSpacing);
                // Pink whole boxes
             for (let i = 0; i < this.model.equivalentFractions.secondEquiv.whole; i++) {
    this.allBoxes.push({
        srcX: srcX,
        srcY: srcY,
        destX: pinkDestX,
        destY: startY,
        width: this.boxSize,
        height: this.boxSize,
        color: this.p.color(255, 77, 166),
        animationIndex: index++,
        type: 'pink',
        showCrossWhileMoving: this.model.operation === 'subtraction'  // Add this line
    });
    if (this.model.operation === 'subtraction') {
        this.crossOutBoxes.push({
            x: pinkDestX,
            y: startY,
            width: this.boxSize,
            height: this.boxSize,
            phase: 'cancellation',
            disableAfterGreen: true
        });
    }
    srcX += this.boxSize + this.boxSpacing;
    pinkDestX += this.boxSize + this.boxSpacing;
}
            }
  
  
setupFractionAnimations(destX, startY) {
    const srcY = 80;
    const firstFractionSrcX = 50 + (this.model.equivalentFractions.firstEquiv.whole * (this.boxSize + this.boxSpacing));
    const secondFractionSrcX = firstFractionSrcX + this.boxSize + this.boxSpacing + (this.model.equivalentFractions.secondEquiv.whole * (this.boxSize + this.boxSpacing));
    let index = this.model.equivalentFractions.firstEquiv.whole + this.model.equivalentFractions.secondEquiv.whole;

    if (this.model.sameDenominators) {
        const cellWidth = this.boxSize / this.model.lcmValue;
        let currentDestX = destX;

        // Blue fraction cells
        for (let i = 0; i < this.model.equivalentFractions.firstEquiv.num; i++) {
            this.allBoxes.push({
                srcX: firstFractionSrcX + i * cellWidth,
                srcY: srcY,
                destX: currentDestX,
                destY: startY,
                width: cellWidth,
                height: this.boxSize,
                color: this.p.color(102, 163, 255),
                animationIndex: index++,
                type: 'blue'
            });
            currentDestX += cellWidth;
        }

        let pinkDestX = this.model.operation === 'addition' ? currentDestX : destX;

        // Pink fraction cells
        for (let i = 0; i < this.model.equivalentFractions.secondEquiv.num; i++) {
            this.allBoxes.push({
                srcX: secondFractionSrcX + i * cellWidth,
                srcY: srcY,
                destX: pinkDestX,
                destY: startY,
                width: cellWidth,
                height: this.boxSize,
                color: this.p.color(255, 77, 166),
                animationIndex: index++,
                type: 'pink',
                showCrossWhileMoving: this.model.operation === 'subtraction'
            });

            if (this.model.operation === 'subtraction') {
                const blueDestX = destX + i * cellWidth;
                this.crossOutBoxes.push({
                    x: blueDestX,
                    y: startY,
                    width: cellWidth,
                    height: this.boxSize,
                    phase: 'cancellation',
                    correspondingPinkIndex: index - 1,
                    disableAfterGreen: true
                });
            }

            pinkDestX += cellWidth;
        }
    } else {
        // Different denominator case - SWAPPED: rows and cols
        const originalFirst = this.model.problem.first.den;   // This becomes ROWS
        const originalSecond = this.model.problem.second.den; // This becomes COLS
        const rows = originalFirst;  // SWAPPED
        const cols = originalSecond; // SWAPPED
        const srcCellWidth = this.boxSize / cols;
        const srcCellHeight = this.boxSize / rows;
        let currentDestX = destX;

        const gridWidth = this.boxSize;
        const gridHeight = this.boxSize;
        const gridCellWidth = gridWidth / cols;
        const gridCellHeight = gridHeight / rows;

        if (this.model.operation === 'addition') {
            const occupiedCells = new Set();

            // Blue fraction cells - fill column by column, bottom to top
            for (let i = 0; i < this.model.equivalentFractions.firstEquiv.num; i++) {
                const col = Math.floor(i / rows);
                const row = rows - 1 - (i % rows); // Bottom to top
                const cellKey = `${col},${row}`;
                occupiedCells.add(cellKey);
                this.allBoxes.push({
                    srcX: firstFractionSrcX + col * srcCellWidth,
                    srcY: srcY + row * srcCellHeight,
                    destX: currentDestX + col * gridCellWidth,
                    destY: startY + row * gridCellHeight,
                    width: gridCellWidth,
                    height: gridCellHeight,
                    color: this.p.color(102, 163, 255),
                    animationIndex: index++,
                    type: 'blue'
                });
            }

            const redNum = this.model.equivalentFractions.secondEquiv.num;
            const cellsPerBox = cols * rows;
            const redFullBoxes = Math.floor(redNum / cellsPerBox);
            const redRemainingCells = redNum % cellsPerBox;

            // Pink full fraction boxes
            for (let i = 0; i < redFullBoxes; i++) {
                this.allBoxes.push({
                    srcX: secondFractionSrcX,
                    srcY: srcY,
                    destX: currentDestX,
                    destY: startY - (i + 1) * this.boxSize,
                    width: this.boxSize,
                    height: this.boxSize,
                    color: this.p.color(255, 77, 166),
                    animationIndex: index++,
                    type: 'pink'
                });
            }

            // Pink fraction cells - fill empty cells row by row, bottom to top
            let redCellsPlaced = 0;
            for (let rowIdx = rows - 1; rowIdx >= 0 && redCellsPlaced < redRemainingCells; rowIdx--) {
                for (let colIdx = 0; colIdx < cols && redCellsPlaced < redRemainingCells; colIdx++) {
                    const cellKey = `${colIdx},${rowIdx}`;
                    if (!occupiedCells.has(cellKey)) {
                        this.allBoxes.push({
                            srcX: secondFractionSrcX + colIdx * srcCellWidth,
                            srcY: srcY + rowIdx * srcCellHeight,
                            destX: currentDestX + colIdx * gridCellWidth,
                            destY: startY + rowIdx * gridCellHeight,
                            width: gridCellWidth,
                            height: gridCellHeight,
                            color: this.p.color(255, 77, 166),
                            animationIndex: index++,
                            type: 'pink'
                        });
                        occupiedCells.add(cellKey);
                        redCellsPlaced++;
                    }
                }
            }
            currentDestX += gridWidth + this.boxSpacing;
        } else {
            // Subtraction logic
            const totalBlue = this.model.equivalentFractions.firstEquiv.num;
            const totalRed = this.model.equivalentFractions.secondEquiv.num;

            // Blue fraction cells - fill column by column, bottom to top
            for (let i = 0; i < totalBlue; i++) {
                const col = Math.floor(i / rows);
                const row = rows - 1 - (i % rows); // Bottom to top
                this.allBoxes.push({
                    srcX: firstFractionSrcX + col * srcCellWidth,
                    srcY: srcY + row * srcCellHeight,
                    destX: currentDestX + col * gridCellWidth,
                    destY: startY + row * gridCellHeight,
                    width: gridCellWidth,
                    height: gridCellHeight,
                    color: this.p.color(102, 163, 255),
                    animationIndex: index++,
                    type: 'blue'
                });
            }

            const totalRedFullBoxes = Math.floor(totalRed / (cols * rows));
            const totalRedCells = totalRed % (cols * rows);

            // Pink full fraction boxes
            for (let i = 0; i < totalRedFullBoxes; i++) {
                this.allBoxes.push({
                    srcX: secondFractionSrcX,
                    srcY: srcY,
                    destX: currentDestX + gridWidth + this.boxSpacing,
                    destY: startY,
                    width: this.boxSize,
                    height: this.boxSize,
                    color: this.p.color(255, 77, 166),
                    animationIndex: index++,
                    type: 'pink',
                    showCrossWhileMoving: true
                });

                this.crossOutBoxes.push({
                    x: currentDestX,
                    y: startY,
                    width: this.boxSize,
                    height: this.boxSize,
                    phase: 'cancellation',
                    correspondingPinkIndex: index - 1,
                    disableAfterGreen: true
                });
            }

            // Pink fraction cells - overlap blue cells, row by row from bottom
            let redCellsToCancel = Math.min(totalRedCells, totalBlue - (totalRedFullBoxes * cols * rows));
            for (let i = 0; i < redCellsToCancel; i++) {
                const col = Math.floor(i / rows);
                const row = rows - 1 - (i % rows); // Bottom to top
                this.allBoxes.push({
                    srcX: secondFractionSrcX + col * srcCellWidth,
                    srcY: srcY + row * srcCellHeight,
                    destX: currentDestX + col * gridCellWidth, // Overlap
                    destY: startY + row * gridCellHeight,
                    width: gridCellWidth,
                    height: gridCellHeight,
                    color: this.p.color(255, 77, 166),
                    animationIndex: index++,
                    type: 'pink',
                    showCrossWhileMoving: true
                });

                this.crossOutBoxes.push({
                    x: currentDestX + col * gridCellWidth,
                    y: startY + row * gridCellHeight,
                    width: gridCellWidth,
                    height: gridCellHeight,
                    phase: 'cancellation',
                    correspondingPinkIndex: index - 1,
                    disableAfterGreen: true
                });
            }

            currentDestX += gridWidth + this.boxSpacing;
        }
    }
}
 drawAnimatedCells() {
    for (let i = 0; i < this.allBoxes.length; i++) {
        const box = this.allBoxes[i];
        console.log("🚀 ~ MixedNumberView ~ drawAnimatedCells ~ box:", box)
        const isCancelled = this.crossOutBoxes.some(crossBox =>
            (crossBox.correspondingPinkIndex === i && box.type === 'pink') ||
            (crossBox.x === box.destX && crossBox.y === box.destY && 
             crossBox.width === box.width && crossBox.height === box.height && box.type === 'blue')
        );
        
        let fillColor = box.color;
        let alpha = 255;
        
       
  // Animation is complete
if (this.model.currentCellIndex >= this.model.totalCellsToAnimate) {
    if (this.model.operation === 'addition') {
        fillColor = this.p.color(30, 97, 38); // Green for addition
        alpha = 255;
    } else if (this.model.operation === 'subtraction') {
        if (isCancelled || box.type === 'pink') {
            // Don't draw cancelled boxes or pink boxes when animation is complete
            continue;
        } else {
            fillColor = this.p.color(30, 97, 38); // Green for remaining
            alpha = 255;
        }
    }
}


        
        // Draw the box if it should be animated
// Draw the box if it should be animated
if (box.animationIndex < this.model.currentCellIndex) {
    // this.p.stroke(0, 0, 0);
    this.p.fill(fillColor.levels[0], fillColor.levels[1], fillColor.levels[2], alpha);
    this.p.rect(box.destX, box.destY, box.width, box.height);
    
    // Draw cross on pink boxes during subtraction (both whole and fraction)
    if (this.model.operation === 'subtraction' && box.type === 'pink' && box.showCrossWhileMoving) {
        this.drawCrossOnBox(box.destX, box.destY, box.width, box.height);
    }
} else if (box.animationIndex === this.model.currentCellIndex) {
    const interpX = this.p.lerp(box.srcX, box.destX, this.model.animationProgress);
    const interpY = this.p.lerp(box.srcY, box.destY, this.model.animationProgress);
    // this.p.stroke(0, 0, 0);
    this.p.fill(fillColor.levels[0], fillColor.levels[1], fillColor.levels[2], alpha);
    this.p.rect(interpX, interpY, box.width, box.height);
    
    // Draw cross on pink boxes while moving during subtraction (both whole and fraction)
    if (this.model.operation === 'subtraction' && box.type === 'pink' && box.showCrossWhileMoving) {
        this.drawCrossOnBox(interpX, interpY, box.width, box.height);
    }
}
    }
}

drawCrossOnBox(x, y, width, height) {
     this.p.stroke(255, 0, 0);
    // this.p.strokeWeight(3);
    // Draw X cross
    this.p.line(x, y, x + width, y + height);
    this.p.line(x + width, y, x, y + height);
    this.p.stroke(0);
    // this.p.strokeWeight(2);
}

drawCrossOutBoxes() {
    if (this.model.operation === 'subtraction' && this.model.currentCellIndex >= this.model.totalCellsToAnimate) {
        // Only draw cross-out on blue boxes after all animation is complete
        for (let crossBox of this.crossOutBoxes) {
            // Skip drawing if this crossBox should be disabled after green phase
            if (crossBox.disableAfterGreen && this.model.currentCellIndex >= this.model.totalCellsToAnimate) {
                continue;
            }
            
            // Find the corresponding pink box to check if it has arrived
            const pinkBox = this.allBoxes[crossBox.correspondingPinkIndex];
            if (pinkBox && this.model.currentCellIndex > pinkBox.animationIndex) {
                 this.p.stroke(255, 0, 0);
                // this.p.strokeWeight(3);
                // Draw X cross on blue boxes
                this.p.line(crossBox.x, crossBox.y, crossBox.x + crossBox.width, crossBox.y + crossBox.height);
                this.p.line(crossBox.x + crossBox.width, crossBox.y, crossBox.x, crossBox.y + crossBox.height);
            }
        }
        this.p.stroke(0);
        // this.p.strokeWeight(2);
    }
}
drawProblem() {
                const step = this.model.steps.original;
                const match = step.match(/^(.+?)\s([\+\-])\s(.+)$/);
                if (!match) {
                    this.p.fill(0);
                    this.p.textSize(20);
                    this.p.text(step, this.p.width / 2, 30);
                    return;
                }
                const [_, first, operator, second] = match;
                const parseMixed = (str) => {
                    const parts = str.trim().split(" ");
                    const whole = parts.length === 2 ? parts[0] : "";
                    const frac = parts.length === 2 ? parts[1] : parts[0];
                    const [num, den] = frac.split("/");
                    return { whole, num, den };
                };
                const firstMixed = parseMixed(first);
                const secondMixed = parseMixed(second);
                const centerX = this.p.width / 2;
                const y = 30;
                const gap = 120;
                this.drawMixedFraction(centerX - gap, y, firstMixed.whole, firstMixed.num, firstMixed.den, this.p.color(0, 0, 255));
                this.p.fill(0);
                this.p.textSize(20);
                this.p.textAlign(this.p.CENTER);
                this.p.text(operator, centerX, y);
                this.drawMixedFraction(centerX + gap, y, secondMixed.whole, secondMixed.num, secondMixed.den, this.p.color(255, 0, 0));
            }

drawInlineMixedFraction(mixedStr, x, y) {
    let currentStr = mixedStr;
    let currentX = x;
    
    // Handle brackets with fractions inside like "(6/10 + 5/10)"
    const bracketMatch = currentStr.match(/\(([^)]+)\)/);
    if (bracketMatch) {
        const beforeBracket = currentStr.substring(0, currentStr.indexOf('('));
        const insideBracket = bracketMatch[1];
        const afterBracket = currentStr.substring(currentStr.indexOf(')') + 1);
        
        // Draw text before bracket
        if (beforeBracket.trim()) {
            this.p.text(beforeBracket, currentX, y);
            currentX += this.p.textWidth(beforeBracket);
        }
        
        // Draw opening bracket
        this.p.text('(', currentX, y);
        currentX += this.p.textWidth('(');
        
        // Parse and draw content inside brackets
        currentX = this.drawBracketContent(insideBracket, currentX, y);
        
        // Draw closing bracket
        this.p.text(')', currentX, y);
        currentX += this.p.textWidth(')');
        
        // Draw text after bracket
        if (afterBracket.trim()) {
            this.p.text(afterBracket, currentX, y);
            currentX += this.p.textWidth(afterBracket);
        }
        
        return currentX;
    }
    
    // Handle regular mixed number or fraction
    const fractionRegex = /(\d*)\s*(\d+)\s*\/\s*(\d+)/;
    const match = currentStr.match(fractionRegex);
    
    if (match) {
        const [fullMatch, whole, num, den] = match;
        let beforeFraction = currentStr.substring(0, currentStr.indexOf(fullMatch));
        let afterFraction = currentStr.substring(currentStr.indexOf(fullMatch) + fullMatch.length);
        
        // Draw text before fraction
        if (beforeFraction.trim()) {
            this.p.text(beforeFraction, currentX, y);
            currentX += this.p.textWidth(beforeFraction);
        }
        
        // Draw whole number if present
        if (whole && whole !== '') {
            this.p.text(whole, currentX, y);
            currentX += this.p.textWidth(whole + ' ');
        }
        
        // Draw fraction
        this.p.textSize(14);
        this.p.text(num, currentX + 4, y - 10);
        this.p.line(currentX, y, currentX + 18, y);
        this.p.text(den, currentX + 4, y + 14);
        currentX += 24;
        this.p.textSize(20);
        
        // Draw text after fraction
        if (afterFraction.trim()) {
            this.p.text(afterFraction, currentX, y);
            currentX += this.p.textWidth(afterFraction);
        }
        
        return currentX;
    } else {
        // No fraction found, just draw the text as is
        this.p.text(currentStr, currentX, y);
        return currentX + this.p.textWidth(currentStr);
    }
}
drawBracketContent(content, x, y) {
    let currentX = x;
    
    // Split by operators while preserving them
    const parts = content.split(/(\s*[\+\-]\s*)/);
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (!part) continue;
        
        // Check if this part is an operator
        if (part.match(/^[\+\-]$/)) {
            this.p.text(' ' + part + ' ', currentX, y);
            currentX += this.p.textWidth(' ' + part + ' ');
        } else {
            // This should be a fraction
            const fractionMatch = part.match(/(\d+)\s*\/\s*(\d+)/);
            if (fractionMatch) {
                const [, num, den] = fractionMatch;
                
                // Draw fraction in proper format
                this.p.textSize(14);
                this.p.text(num, currentX + 4, y - 10);
                this.p.line(currentX, y, currentX + 18, y);
                this.p.text(den, currentX + 4, y + 14);
                currentX += 24;
                this.p.textSize(20);
            } else {
                // Not a fraction, just draw as text
                this.p.text(part, currentX, y);
                currentX += this.p.textWidth(part);
            }
        }
    }
    
    return currentX;
}

drawSteps() {
    const steps = this.model.stepsHistory;
    let y = 60;
    this.p.textSize(20);
    this.p.textFont('normal');
    this.p.textAlign(this.p.LEFT);
    steps.forEach((step, index) => {
        const x = this.p.width - 280;
        let currentX = x;
        
        // Check if this is the final step (index 3) and skip it
        if (index === 3) {
            return;
        }
        // Parse the step to handle operators and brackets properly
        const match = step.match(/^(.+?)\s([\+\-])\s(.+)$/);
        if (match) {
            const [, firstTerm, operator, secondTerm] = match;
            
            // Draw first term in blue
            this.p.fill(0, 0, 255);
            currentX = this.drawInlineMixedFraction(firstTerm, currentX, y);
            
            // Draw operator in black
            this.p.fill(0);
            this.p.text(' ' + operator + ' ', currentX, y);
            currentX += this.p.textWidth(' ' + operator + ' ');
            
            // Draw second term in red
            this.p.fill(255, 0, 0);
            currentX = this.drawInlineMixedFraction(secondTerm, currentX, y);
        } else {
            // Handle non-standard format (like "5 (11/10)")
            this.p.fill(0);
            currentX = this.drawInlineMixedFraction(step, currentX, y);
        }
        
        y += 50;
    });
}

            drawMixedFraction(x, y, whole, num, den, color) {
                this.p.fill(color);
                this.p.textSize(22);
                this.p.textAlign(this.p.CENTER);
                if (whole !== "" && whole !== undefined) {
                    this.p.text(whole, x - 20, y);
                }
                this.p.textSize(16);
                this.p.text(num, x + 10, y - 10);
                this.p.line(x, y, x + 20, y);
                this.p.text(den, x + 10, y + 15);
            }

            drawOriginalFractions() {
                const y = 30;
                let x = 50;
                const first = this.model.problem.first;
                x = this.drawMixedNumber(first, x, y, this.p.color(77, 166, 255), 'blue');
                this.p.fill(0);
                this.p.textSize(30);
                const operatorSymbol = this.model.operation === 'addition' ? '+' : '-';
                this.p.text(operatorSymbol, x - 20, y + 40);
                x += 20;
                const second = this.model.problem.second;
                this.drawMixedNumber(second, x, y, this.p.color(255, 77, 166), 'pink');
            }

            drawEquivalentFractions() {
                const y = 30;
                let x = 50;
                const { firstEquiv, secondEquiv } = this.model.equivalentFractions;
                x = this.drawMixedNumberLCM(firstEquiv, x, y, this.p.color(77, 166, 255), true);
                this.p.fill(0);
                this.p.textSize(30);
                const operatorSymbol = this.model.operation === 'addition' ? '+' : '-';
                this.p.text(operatorSymbol, x - 20, y + 30);
                x += 20;
                this.drawMixedNumberLCM(secondEquiv, x, y, this.p.color(255, 77, 166), false);
            }

            drawMixedNumber(mixedNum, startX, startY, color, colorName) {
                let x = startX;
                for (let i = 0; i < mixedNum.whole; i++) {
                    this.p.fill(color);
                    this.p.rect(x, startY, this.boxSize, this.boxSize);
                    x += this.boxSize + this.boxSpacing;
                }
                this.drawFractionBox(x, startY, mixedNum.num, mixedNum.den, color);
                x += this.boxSize + this.boxSpacing;
                this.p.fill(0);
                this.p.textSize(18);
                this.p.text(`${mixedNum.whole} ${mixedNum.num}/${mixedNum.den}`, startX, startY + this.boxSize + 25);
                return x + 50;
            }

          // Modified drawMixedNumberLCM function
drawMixedNumberLCM(mixedNum, startX, startY, color, isFirstFraction = true) {
    let x = startX;
    for (let i = 0; i < mixedNum.whole; i++) {
        this.p.fill(color);
        this.p.rect(x, startY, this.boxSize, this.boxSize);
        x += this.boxSize + this.boxSpacing;
    }
    
    // Show different display based on animation state
    if (this.model.currentCellIndex === 0 && !this.model.sameDenominators) {
        // Show original fractions at initial state
        const originalFraction = isFirstFraction ? this.model.problem.first : this.model.problem.second;
        this.drawFractionGrid(x, startY, originalFraction.num, originalFraction.den, color, isFirstFraction);
    } else {
        // Show equivalent fractions
        this.drawFractionGrid(x, startY, mixedNum.num, mixedNum.den, color, isFirstFraction);
    }
    
    x += this.boxSize + this.boxSpacing;
    this.p.fill(0);
    this.p.textSize(16);
    
    // Display text based on current state
    if (this.model.currentCellIndex === 0 && !this.model.sameDenominators) {
        const originalFraction = isFirstFraction ? this.model.problem.first : this.model.problem.second;
        this.p.text(`${originalFraction.whole} ${originalFraction.num}/${originalFraction.den}`, startX, startY + this.boxSize + 25);
    } else {
        this.p.text(`${mixedNum.whole} ${mixedNum.num}/${mixedNum.den}`, startX, startY + this.boxSize + 25);
    }
    
    return x + 50;
}

            drawFractionBox(x, y, numerator, denominator, color) {
                const colWidth = this.boxSize / denominator;
                for (let i = 0; i < denominator; i++) {
                    if (i < numerator) {
                        this.p.fill(color);
                    } else {
                        this.p.fill(255);
                    }
                    this.p.rect(x + i * colWidth, y, colWidth, this.boxSize);
                }
            }

drawFractionGrid(x, y, numerator, denominator, color, isFirstFraction = true) {
    if (this.model.sameDenominators) {
        const colWidth = this.boxSize / denominator;
        for (let i = 0; i < numerator; i++) {
            this.p.fill(color);
            this.p.rect(x + i * colWidth, y, colWidth, this.boxSize);
        }
        for (let j = numerator; j < denominator; j++) {
            this.p.fill(255);
            this.p.rect(x + j * colWidth, y, colWidth, this.boxSize);
        }
    } else {
        if (this.model.currentCellIndex === 0) {
            if (isFirstFraction) {
                // First fraction: fill column-wise (vertical strips)
                const colWidth = this.boxSize / this.model.problem.first.den;
                for (let i = 0; i < this.model.problem.first.num; i++) {
                    this.p.fill(color);
                    this.p.rect(x + i * colWidth, y, colWidth, this.boxSize);
                }
                for (let j = this.model.problem.first.num; j < this.model.problem.first.den; j++) {
                    this.p.fill(255);
                    this.p.rect(x + j * colWidth, y, colWidth, this.boxSize);
                }
            } else {
                // Second fraction: fill row-wise FROM BOTTOM (horizontal strips from bottom)
                const rowHeight = this.boxSize / this.model.problem.second.den;
                for (let i = 0; i < this.model.problem.second.num; i++) {
                    this.p.fill(color);
                    // Fill from bottom: y + this.boxSize - (i + 1) * rowHeight
                    this.p.rect(x, y + this.boxSize - (i + 1) * rowHeight, this.boxSize, rowHeight);
                }
                for (let j = this.model.problem.second.num; j < this.model.problem.second.den; j++) {
                    this.p.fill(255);
                    this.p.rect(x, y + this.boxSize - (j + 1) * rowHeight, this.boxSize, rowHeight);
                }
            }
        } else {
            // Show equivalent fractions (grid format)
            const cols = this.model.problem.first.den;  // First denominator = columns
            const rows = this.model.problem.second.den; // Second denominator = rows
            const cellWidth = this.boxSize / cols;
            const cellHeight = this.boxSize / rows;
            
            if (isFirstFraction) {
                // Fill column by column, bottom to top
                for (let i = 0; i < numerator; i++) {
                    const col = Math.floor(i / rows);
                    const row = rows - 1 - (i % rows); // Fill from bottom
                    this.p.fill(color);
                    this.p.rect(x + col * cellWidth, y + row * cellHeight, cellWidth, cellHeight);
                }
                for (let i = numerator; i < denominator; i++) {
                    const col = Math.floor(i / rows);
                    const row = rows - 1 - (i % rows);
                    this.p.fill(255);
                    this.p.rect(x + col * cellWidth, y + row * cellHeight, cellWidth, cellHeight);
                }
            } else {
                // Fill row by row, left to right, starting from bottom row
                for (let i = 0; i < numerator; i++) {
                    const row = rows - 1 - Math.floor(i / cols); // Start from bottom row
                    const col = i % cols;
                    this.p.fill(color);
                    this.p.rect(x + col * cellWidth, y + row * cellHeight, cellWidth, cellHeight);
                }
                for (let i = numerator; i < denominator; i++) {
                    const row = rows - 1 - Math.floor(i / cols);
                    const col = i % cols;
                    this.p.fill(255);
                    this.p.rect(x + col * cellWidth, y + row * cellHeight, cellWidth, cellHeight);
                }
            }
        }
    }
}
        }

        class MixedNumberController {
            constructor() {
                this.model = new MixedNumberModel();
                this.view = null;
                this.model.onSliderMaxChange = (max) => this.updateSliderMax(max);
                this.setupEventListeners();
                this.updateSliderMax(this.model.totalCellsToAnimate);
            }

            setupEventListeners() {
                const slider = document.getElementById('stepSlider');
                slider.addEventListener('input', (e) => {
                    this.model.setCellIndex(parseInt(e.target.value));
                });
                slider.addEventListener('mousedown', () => {
                    this.model.setSliderDragging(true);
                });
                slider.addEventListener('mouseup', () => {
                    this.model.setSliderDragging(false);
                });
                slider.addEventListener('touchstart', () => {
                    this.model.setSliderDragging(true);
                });
                slider.addEventListener('touchend', () => {
                    this.model.setSliderDragging(false);
                });
            }

            updateSliderMax(max) {
                const slider = document.getElementById('stepSlider');
                slider.max = max;
            }

            setupP5(p5Instance) {
                this.view = new MixedNumberView(this.model, p5Instance);
            }

            generateNewProblem() {
                this.model.generateRandomProblem();
                const slider = document.getElementById('stepSlider');
                slider.value = 0;
                this.model.setCellIndex(0);
                this.updateSliderMax(this.model.totalCellsToAnimate);
            }
        }

        const controller = new MixedNumberController();

        function setup() {
            const canvas = createCanvas(1000, 400);
            canvas.parent('p5-container');
            controller.setupP5(window);
        }

        function draw() {
            if (controller.view) {
                controller.view.draw();
            }
        }
    