
      // MODEL
      class ProblemModel {
        constructor() {
          this.numerator = 1;
          this.denominator = 2;
          this.wholeNumber = 0;
          this.marbleCount = 0;
          this.correctAnswer = 0;

          this.userAnswer = 0;
          this.isAnswerSubmitted = false;
          this.isAnswerCorrect = false;
          this.userInputValue = "";
          this.marbles = [];
          this.visibleMarbles = [];
          this.animating = false;
          this.animationComplete = false;
          this.currentMarbleIndex = 0;
          this.lastAnimationTime = 0;
          this.marbleAnimationDelay = 200;
        }
        generateRandomProblem() {
          let attempts = 0;
          const maxAttempts = 50;

          do {
            attempts++;

            // Step 1: Start with a whole number answer (marbles per box)
            const marblesPerBox = Math.floor(Math.random() * 8) + 6; // 6-13 marbles per box
            this.correctAnswer = marblesPerBox;

            // Step 2: Generate a simple fraction
            const possibleDenominators = [2, 3, 4, 5, 6];
            this.denominator =
              possibleDenominators[
                Math.floor(Math.random() * possibleDenominators.length)
              ];
            this.denominator =
              possibleDenominators[
                Math.floor(Math.random() * possibleDenominators.length)
              ];

            do {
              this.numerator = Math.floor(Math.random() * this.denominator) + 1;
            } while (this.numerator === this.denominator);

            // this.numerator = Math.floor(Math.random() * this.denominator) + 1;
            this.wholeNumber =
              Math.random() < 0.4 ? Math.floor(Math.random() * 2) + 1 : 0;

            // Step 3: Convert to improper fraction
            const improperNumerator =
              this.wholeNumber * this.denominator + this.numerator;
            const improperDenominator = this.denominator;

            // Step 4: Calculate marbles using exact arithmetic to ensure whole number result
            // Formula: marbleCount = marblesPerBox × (improperNumerator / improperDenominator)
            // We need this to be a whole number, so we check if improperNumerator is divisible by improperDenominator
            // after multiplying by marblesPerBox

            const numeratorProduct = marblesPerBox * improperNumerator;

            // Check if this results in a whole number when divided by denominator
            if (numeratorProduct % improperDenominator === 0) {
              this.marbleCount = numeratorProduct / improperDenominator;

              // Ensure marbleCount is in reasonable range (2-25)
              if (this.marbleCount >= 2 && this.marbleCount <= 25) {
                // Double-check: Verify the reverse calculation gives us back the correct answer
                const verificationAnswer =
                  (this.marbleCount * improperDenominator) / improperNumerator;

                // Must be exactly equal (no rounding needed)
                if (verificationAnswer === marblesPerBox) {
                  // Perfect! We have a valid problem
                  break;
                }
              }
            }

            // If we reach max attempts, fall back to a guaranteed working combination
            if (attempts >= maxAttempts) {
              this.correctAnswer = 12;
              this.denominator = 3;
              this.numerator = 1;
              this.wholeNumber = 0;
              this.marbleCount = 4; // 12 × (1/3) = 4
              break;
            }
          } while (attempts < maxAttempts);

          // Final verification and setup
          const improperNumerator =
            this.wholeNumber * this.denominator + this.numerator;

          this.solutionSteps = [
            `Step 1: Convert to improper fraction. ${
              this.wholeNumber > 0 ? `${this.wholeNumber} ` : ""
            }${this.numerator}/${this.denominator} = ${improperNumerator}/${
              this.denominator
            }`,
            `Step 2: Set up division. ${this.marbleCount} ÷ (${improperNumerator}/${this.denominator}) = x`,
            `Step 3: Multiply by reciprocal. ${this.marbleCount} × (${this.denominator}/${improperNumerator})`,
            `Step 4: Calculate. ${this.marbleCount} × ${this.denominator} ÷ ${improperNumerator} = ${this.correctAnswer}`,
          ];

          // Reset other properties
          this.isAnswerSubmitted = false;
          this.isAnswerCorrect = false;
          this.userAnswer = 0;
          this.userInputValue = "";
          this.marbles = [];
          this.visibleMarbles = [];
          this.animating = false;
          this.animationComplete = false;
          this.currentMarbleIndex = 0;

          return {
            numerator: this.numerator,
            denominator: this.denominator,
            wholeNumber: this.wholeNumber,
            marbleCount: this.marbleCount,
            correctAnswer: this.correctAnswer,
          };
        }

        checkAnswer(userInput) {
          this.userAnswer = parseInt(userInput);
          if (isNaN(this.userAnswer)) return false;
          this.isAnswerSubmitted = true;
          this.isAnswerCorrect = this.userAnswer === this.correctAnswer;
          return this.isAnswerCorrect;
        }

        resetAnswer() {
          this.userAnswer = 0;
          this.userInputValue = "";
          this.isAnswerSubmitted = false;
          this.isAnswerCorrect = false;
          this.marbles = [];
          this.visibleMarbles = [];
          this.animating = false;
          this.animationComplete = false;
          this.currentMarbleIndex = 0;
          this.lastAnimationTime = 0;
          this.solutionSteps = [];
        }

        addCharacter(char) {
          if (/^[0-9]$/.test(char) && this.userInputValue.length < 3) {
            this.userInputValue += char;
          }
          return this.userInputValue;
        }

        removeDigit() {
          this.userInputValue = this.userInputValue.slice(0, -1);
          return this.userInputValue;
        }

        submitAnswer() {
          return this.checkAnswer(this.userInputValue);
        }
      }
      // VIEW
      class ProblemView {
        constructor() {
          this.fillBoxBtn = document.getElementById("fill-box-btn");
          this.revertBtn = document.getElementById("revert-btn");
          this.newBoxesBtn = document.getElementById("new-boxes-btn");
          this.boxDisplay = document.getElementById("box-display");
          this.keyboardContainer =
            document.getElementById("keyboard-container");

          this.p5Canvas = null;
          this.canvasWidth = 0;
          this.canvasHeight = 0;

          this.inputBoxActive = false;
          this.inputFieldX = 0;
          this.inputFieldY = 0;
          this.inputFieldWidth = 0;
          this.inputFieldHeight = 0;
        }

        setupCanvas() {
          if (this.p5Canvas) {
            this.p5Canvas.remove();
          }

          const boxDisplayRect = this.boxDisplay.getBoundingClientRect();
          this.canvasWidth = boxDisplayRect.width;
          this.canvasHeight = 500;

          this.p5Canvas = new p5((sketch) => {
            sketch.setup = () => {
              sketch.createCanvas(this.canvasWidth, this.canvasHeight);
              sketch.frameRate(30);
              sketch.loop();
              sketch.textFont("Arial");
              if (this.keyboardContainer.style.display === 'block') {
                sketch.resizeCanvas(this.canvasWidth, this.canvasHeight - 100); // Adjust for keyboard height
            }
            };

            sketch.draw = () => {
              sketch.background(255);

              if (this.currentProblem) {
                const {
                  numerator,
                  denominator,
                  wholeNumber,
                  marbleCount,
                  userAnswer,
                  isAnswerSubmitted,
                  marbles,
                  visibleMarbles,
                  animating,
                  userInputValue,
                } = this.currentProblem;

                this.drawQuestion(
                  sketch,
                  marbleCount,
                  numerator,
                  denominator,
                  wholeNumber
                );

                let boxWidth, boxHeight, boxX, boxY;
                const totalFraction = wholeNumber + numerator / denominator;
                const boxRows =
                  totalFraction > 2 ? 3 : totalFraction > 1 ? 2 : 1;

                // Dynamically adjust box size based on total fraction
                if (totalFraction <= 1) {
                  boxWidth = sketch.width * 0.6;
                  boxHeight = sketch.height * 0.25;
                } else if (totalFraction <= 2) {
                  boxWidth = sketch.width * 0.55;
                  boxHeight = sketch.height * 0.2;
                } else {
                  boxWidth = sketch.width * 0.5;
                  boxHeight = sketch.height * 0.15;
                }

                // boxX = (sketch.width - boxWidth) / 2 ;
                boxX = 20;

                boxY = 100;

                this.drawBoxes(
                  sketch,
                  boxX,
                  boxY,
                  boxWidth,
                  boxHeight,
                  numerator,
                  denominator,
                  wholeNumber,
                  boxRows
                );

                if (isAnswerSubmitted && visibleMarbles.length > 0) {
                  this.drawMarbles(
                    sketch,
                    visibleMarbles,
                    boxX,
                    boxY,
                    boxWidth,
                    boxHeight,
                    numerator,
                    denominator,
                    wholeNumber,
                    boxRows
                  );
                }

                this.drawFractionLabel(
                  sketch,
                  boxX,
                  boxY + (boxHeight + 20) * boxRows,
                  numerator,
                  denominator,
                  wholeNumber
                );

                this.drawInputField(sketch, userInputValue);

                if (isAnswerSubmitted) {
                  this.drawSolution(
                    sketch,
                    marbleCount,
                    numerator,
                    denominator,
                    wholeNumber,
                    userAnswer,
                    this.currentProblem.isAnswerCorrect
                  );
                }
              }
            };

            // sketch.mousePressed = () => {
            //   const mouseX = sketch.mouseX;
            //   const mouseY = sketch.mouseY;
            //   if (
            //     mouseX > this.inputFieldX &&
            //     mouseX < this.inputFieldX + this.inputFieldWidth &&
            //     mouseY > this.inputFieldY &&
            //     mouseY < this.inputFieldY + this.inputFieldHeight
            //   ) {
            //     this.inputBoxActive = true;
            //     this.showKeyboard();
            //   } else if (!this.isClickOnKeyboard(mouseX, mouseY)) {
            //     this.inputBoxActive = false;
            //     this.hideKeyboard();
            //   }
            // };

sketch.mousePressed = () => {
    const mouseX = sketch.mouseX;
    const mouseY = sketch.mouseY;
    const padding = 10; // Increase touch area by padding

    // Check if click is within the input field
    const isClickInInputField = 
        mouseX > this.inputFieldX - padding && 
        mouseX < this.inputFieldX + this.inputFieldWidth + padding &&
        mouseY > this.inputFieldY - padding && 
        mouseY < this.inputFieldY + this.inputFieldHeight + padding + 10;

    // Check if click is within the keyboard
    const isClickInKeyboard = this.isClickOnKeyboard(mouseX, mouseY);

    if (isClickInInputField) {
        // Activate input box and show keyboard
        this.inputBoxActive = true;
        this.showKeyboard();
    } else if (!isClickInKeyboard) {
        // Deactivate input box and hide keyboard only if clicking outside both
        this.inputBoxActive = false;
        this.hideKeyboard();
    }

    // Redraw to update input field border
    sketch.redraw();
};

            // sketch.keyTyped = () => {
            //   if (
            //     this.inputBoxActive &&
            //     !this.currentProblem.isAnswerSubmitted
            //   ) {
            //     if (/^[0-9]$/.test(sketch.key)) {
            //       if (this.onKeyPress) {
            //         this.onKeyPress(sketch.key);
            //       }
            //     } else if (sketch.keyCode === 8) {
            //       if (this.onBackspaceKey) {
            //         this.onBackspaceKey();
            //       }
            //     }
            //   }
            // };
sketch.keyPressed = () => {
  if (this.inputBoxActive && !this.currentProblem.isAnswerSubmitted) {
    // Handle backspace key
    if (sketch.keyCode === 8 || sketch.key === 'Backspace') { // Support both keyCode and key for virtual keyboard
      if (this.onBackspaceKey) {
        this.onBackspaceKey();
      }
    } 
    // Handle numeric keys (0-9)
    else if (/^[0-9]$/.test(sketch.key)) {
      if (this.onKeyPress) {
        this.onKeyPress(sketch.key);
      }
    }
  }
  return false; // Prevent default browser behavior
};

            sketch.drawBoxesAndMarbles = (problem) => {
              this.currentProblem = problem;
              sketch.redraw();
            };

            this.isClickOnKeyboard = (mouseX, mouseY) => {
              const keyboardRect =
                this.keyboardContainer.getBoundingClientRect();
              const canvasRect = this.boxDisplay.getBoundingClientRect();
              const relativeX = mouseX + canvasRect.left;
              const relativeY = mouseY + canvasRect.top;
              return (
                relativeX >= keyboardRect.left &&
                relativeX <= keyboardRect.right &&
                relativeY >= keyboardRect.top &&
                relativeY <= keyboardRect.bottom
              );
            };
          }, this.boxDisplay);
        }

        

        // drawBoxes(
        //   p5,
        //   x,
        //   y,
        //   width,
        //   height,
        //   numerator,
        //   denominator,
        //   wholeNumber,
        //   boxRows
        // ) {
        //   const totalFraction = wholeNumber + numerator / denominator;
        //   const correctAnswer = this.currentProblem
        //     ? this.currentProblem.correctAnswer || 1
        //     : 1;

        //   // Each complete box section should fit exactly 'correctAnswer' marbles
        //   // The width is divided by correctAnswer to show the relationship
        //   const sectionWidth = width / correctAnswer;
        //   // Calculate how many complete sections and partial section we have
        //   const completeSections = Math.floor(totalFraction);
        //   const partialSection = totalFraction - completeSections;

        //   // Calculate total boxes needed to display the fraction
        //   const totalBoxesNeeded = Math.ceil(totalFraction);
        //   const boxesPerRow = Math.ceil(totalBoxesNeeded / boxRows);

        //   let currentSection = 0;

        //   for (let row = 0; row < boxRows; row++) {
        //     const startBox = row * boxesPerRow;
        //     const endBox = Math.min((row + 1) * boxesPerRow, totalBoxesNeeded);
        //     const boxesInThisRow = endBox - startBox;

        //     if (boxesInThisRow <= 0) continue;

        //     // Calculate how much of the total fraction is in this row
        //     let rowFraction = 0;
        //     let sectionsInThisRow = 0;
        //     let partialInThisRow = 0;

        //     // Determine what portion of the fraction appears in this row
        //     const remainingFraction = totalFraction - row * boxesPerRow;
        //     if (remainingFraction <= 0) continue;

        //     if (remainingFraction >= boxesInThisRow) {
        //       // This row is completely filled
        //       rowFraction = boxesInThisRow;
        //       sectionsInThisRow = Math.floor(rowFraction);
        //       partialInThisRow = rowFraction - sectionsInThisRow;
        //     } else {
        //       // This row is partially filled
        //       rowFraction = remainingFraction;
        //       sectionsInThisRow = Math.floor(rowFraction);
        //       partialInThisRow = rowFraction - sectionsInThisRow;
        //     }

        //     const rowY = y + row * (height + 20);

        //     // Draw complete sections in this row
        //     for (let section = 0; section < sectionsInThisRow; section++) {
        //       const sectionX = x + section * sectionWidth;

        //       p5.stroke(0);
        //       p5.strokeWeight(2);
        //       p5.noFill();
        //       p5.rect(sectionX, rowY, sectionWidth, height);

        //       // Draw vertical separators to show this represents 'correctAnswer' marbles
        //       const marbleSlots = correctAnswer;
        //       for (let slot = 1; slot < marbleSlots; slot++) {
        //         const slotX = sectionX + (slot * sectionWidth) / marbleSlots;
        //         p5.stroke(200);
        //         p5.strokeWeight(1);
        //          p5.drawingContext.setLineDash([]); // 🔒 Ensure solid line
        //         p5.line(slotX, rowY, slotX, rowY + height);
        //       }
        //     }

        //     // Draw partial section if exists in this row
        //     if (partialInThisRow > 0) {
        //       const partialSectionX = x + sectionsInThisRow * sectionWidth;
        //       const partialWidth = sectionWidth * partialInThisRow;

        //       // Draw the filled portion (solid line)
        //       p5.stroke(0);
        //       p5.strokeWeight(2);
        //       p5.noFill();
        //       p5.rect(partialSectionX, rowY, partialWidth, height);

        //       // Draw the complete section outline (dashed line) to show what a full section would be
        //       p5.push();
        //       p5.stroke(150);
        //       p5.strokeWeight(2);
        //       p5.drawingContext.setLineDash([8, 8]);
        //       p5.noFill();
        //       p5.rect(partialSectionX, rowY, sectionWidth, height);
        //       p5.drawingContext.setLineDash([]);
        //       p5.pop();

        //       // Draw vertical separators for the partial section
        //       const marbleSlots = correctAnswer;
        //       const filledSlots = Math.floor(partialInThisRow * marbleSlots);

        //       for (let slot = 1; slot < marbleSlots; slot++) {
        //         const slotX =
        //           partialSectionX + (slot * sectionWidth) / marbleSlots;
        //         if (slot <= filledSlots) {
        //           // Solid line for filled portion
        //           p5.stroke(200);
        //           p5.strokeWeight(1);
        //         } else {
        //           // Dashed line for unfilled portion
        //           p5.stroke(220);
        //           p5.strokeWeight(1);
        //           p5.drawingContext.setLineDash([3, 3]);
        //         }
        //         p5.line(slotX, rowY, slotX, rowY + height);
        //         p5.drawingContext.setLineDash([]);
        //       }
        //     }

        //     // Draw section separators between complete boxes
        //     for (let section = 1; section <= sectionsInThisRow; section++) {
        //       const separatorX = x + section * sectionWidth;
        //       if (separatorX < x + width) {
        //         p5.stroke(0);
        //         p5.strokeWeight(3);
        //         p5.line(separatorX, rowY - 5, separatorX, rowY + height + 5);
        //       }
        //     }
        //   }

        //   // Draw labels for each complete section
        //   const labelY = y + boxRows * (height + 20) + 15;
        //   p5.fill(0);
        //   p5.noStroke();
        //   p5.textSize(14);
        //   p5.textAlign(p5.CENTER);

        //   for (
        //     let section = 0;
        //     section <
        //     Math.min(completeSections, Math.floor(width / sectionWidth));
        //     section++
        //   ) {
        //     const labelX = x + section * sectionWidth + sectionWidth / 2;
        //     // p5.text(`${correctAnswer} marbles`, labelX, labelY);
        //   }

        //   // Label for partial section if exists and visible
        //   if (
        //     partialSection > 0 &&
        //     completeSections < Math.floor(width / sectionWidth)
        //   ) {
        //     const partialLabelX =
        //       x +
        //       completeSections * sectionWidth +
        //       (sectionWidth * partialSection) / 2;
        //     const partialMarbles = Math.round(correctAnswer * partialSection);
        //     // p5.text(`${partialMarbles} marbles`, partialLabelX, labelY);
        //   }
        // }
drawQuestion(p5, marbleCount, numerator, denominator, wholeNumber) {
  p5.fill(0);
  p5.noStroke();
  p5.textSize(20);
  p5.textAlign(p5.LEFT, p5.TOP);

  const startX = 50;
  const startY = 20;
  let currentX = startX;

  // Draw: "If 12 marbles fill"
  const introText = `If ${marbleCount} marbles fill `;
  p5.text(introText, currentX, startY);
  currentX += p5.textWidth(introText);

  // If there's a whole number before the fraction
  if (wholeNumber > 0) {
    const wholeStr = `${wholeNumber} `;
    p5.text(wholeStr, currentX, startY);
    currentX += p5.textWidth(wholeStr);
  }

  // Draw vertical fraction inline
  const fracCenterX = currentX + 10;
  const fracCenterY = startY + 10;

  p5.textAlign(p5.CENTER, p5.BOTTOM);
  p5.text(numerator, fracCenterX, fracCenterY - 5); // numerator

  p5.stroke(0);
  p5.strokeWeight(1);
  p5.line(fracCenterX - 10, fracCenterY, fracCenterX + 10, fracCenterY); // fraction line

  p5.noStroke();
  p5.textAlign(p5.CENTER, p5.TOP);
  p5.text(denominator, fracCenterX, fracCenterY + 2); // denominator

  currentX += 30; // Move past fraction

  // Draw: "boxes, how many marbles would fill 1 box?"
  p5.textAlign(p5.LEFT, p5.TOP);
  const boxText = (wholeNumber > 0 || numerator > 1) ? " boxes, how many marbles would fill 1 box?" : " box, how many marbles would fill 1 box?";
  p5.text(boxText, currentX, startY);
}

drawBoxes(
  p5,
  x,
  y,
  width,
  height,
  numerator,
  denominator,
  wholeNumber,
  boxRows
) {
  const totalFraction = wholeNumber + numerator / denominator;
  const correctAnswer = this.currentProblem
    ? this.currentProblem.correctAnswer || 1
    : 1;

  // Calculate how many complete boxes and what fraction of the next box
  const completeBoxes = Math.floor(totalFraction);
  const partialBoxFraction = totalFraction - completeBoxes;
  
  // Total boxes to display (complete + 1 partial if needed)
  const totalBoxesToShow = completeBoxes + (partialBoxFraction > 0 ? 1 : 0);
  
  // Calculate box dimensions
  const boxesPerRow = Math.ceil(totalBoxesToShow / boxRows);
  const boxWidth = width / boxesPerRow;
  const spacing = 10; // Space between boxes

  let boxIndex = 0;

  for (let row = 0; row < boxRows; row++) {
    const rowY = y + row * (height + 20);
    
    for (let col = 0; col < boxesPerRow && boxIndex < totalBoxesToShow; col++) {
      const boxX = x + col * (boxWidth + spacing);
      
      if (boxIndex < completeBoxes) {
        // Draw complete box with solid line
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.noFill();
        p5.drawingContext.setLineDash([]); // Solid line
        p5.rect(boxX, rowY, boxWidth, height);
        
        // Draw internal divisions for marbles
        const marbleSlots = correctAnswer;
        for (let slot = 1; slot < marbleSlots; slot++) {
          const slotX = boxX + (slot * boxWidth) / marbleSlots;
          p5.stroke(200);
          p5.strokeWeight(1);
          p5.drawingContext.setLineDash([]); // Solid line
          p5.line(slotX, rowY, slotX, rowY + height);
        }
        
      } else if (boxIndex === completeBoxes && partialBoxFraction > 0) {
        // Draw partial box
        const filledWidth = boxWidth * partialBoxFraction;
        
        // Draw filled portion with solid line
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.noFill();
        p5.drawingContext.setLineDash([]); // Solid line
        p5.rect(boxX, rowY, filledWidth, height);
        
        // Draw unfilled portion with dashed line
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.noFill();
        p5.drawingContext.setLineDash([8, 8]); // Dashed line
        p5.rect(boxX + filledWidth, rowY, boxWidth - filledWidth, height);
        p5.drawingContext.setLineDash([]); // Reset to solid
        
        // Draw internal divisions
        const marbleSlots = correctAnswer;
        const filledSlots = Math.floor(partialBoxFraction * marbleSlots);
        
        for (let slot = 1; slot < marbleSlots; slot++) {
          const slotX = boxX + (slot * boxWidth) / marbleSlots;
          
          if (slot <= filledSlots) {
            // Solid line for filled portion
            p5.stroke(200);
            p5.strokeWeight(1);
            p5.drawingContext.setLineDash([]);
          } else {
            // Dashed line for unfilled portion
            p5.stroke(200);
            p5.strokeWeight(1);
            p5.drawingContext.setLineDash([4, 4]);
          }
          p5.line(slotX, rowY, slotX, rowY + height);
        }
        p5.drawingContext.setLineDash([]); // Reset to solid
      }
      
      boxIndex++;
    }
  }

  // Draw labels below the boxes
  const labelY = y + boxRows * (height + 20) + 15;
  p5.fill(0);
  p5.noStroke();
  p5.textSize(14);
  p5.textAlign(p5.CENTER);

  // Label complete boxes
  for (let i = 0; i < completeBoxes && i < totalBoxesToShow; i++) {
    const row = Math.floor(i / boxesPerRow);
    const col = i % boxesPerRow;
    const labelX = x + col * (boxWidth + spacing) + boxWidth / 2;
    const labelYPos = y + row * (height + 20) + height + 15;
    // Uncomment if you want to show marble labels
    // p5.text(`${correctAnswer} marbles`, labelX, labelYPos);
  }

  // Label partial box if exists
  if (partialBoxFraction > 0 && completeBoxes < totalBoxesToShow) {
    const row = Math.floor(completeBoxes / boxesPerRow);
    const col = completeBoxes % boxesPerRow;
    const labelX = x + col * (boxWidth + spacing) + boxWidth / 2;
    const labelYPos = y + row * (height + 20) + height + 15;
    const partialMarbles = Math.round(correctAnswer * partialBoxFraction);
    // Uncomment if you want to show marble labels
    // p5.text(`${partialMarbles} marbles`, labelX, labelYPos);
  }
// Draw horizontal bracket and fraction below the solid filled part
if (numerator && denominator) {
  const filledBoxWidth = boxWidth * (numerator / denominator);
  const fullBoxX = x + (completeBoxes % boxesPerRow) * (boxWidth + spacing);
  const fullBoxY = y + (Math.floor(completeBoxes / boxesPerRow)) * (height + 20);

  const bracketY = fullBoxY + height + 10;
  const bracketStartX = fullBoxX;
  const bracketEndX = fullBoxX + filledBoxWidth;

  // Draw horizontal line with ticks at ends
  p5.stroke(0);
  p5.strokeWeight(2);

  // Horizontal line
  p5.line(bracketStartX, bracketY, bracketEndX, bracketY);

  // Left tick
  p5.line(bracketStartX, bracketY - 5, bracketStartX, bracketY + 5);

  // Right tick
  p5.line(bracketEndX, bracketY - 5, bracketEndX, bracketY + 5);

  // Draw fraction (centered below the bracket)
  const centerX = (bracketStartX + bracketEndX) / 2;
  const textY = bracketY + 5;

  p5.noStroke();
  p5.textAlign(p5.CENTER, p5.BOTTOM);
  p5.textSize(14);
  p5.fill(0);
  p5.text(numerator, centerX, textY +15); // Numerator

  // Fraction line
  p5.stroke(0);
  p5.line(centerX - 10, textY+20, centerX + 10, textY+20 );

  // Denominator
  p5.noStroke();
  p5.textAlign(p5.CENTER, p5.TOP);
  p5.text(denominator, centerX, textY + 30);

  // "box" label
  p5.textAlign(p5.LEFT, p5.CENTER);
  p5.text("box", centerX + 18, textY+20);
}

  
// // Draw the fraction label below the first box
// if (numerator && denominator) {
//   const fractionX = x + ((boxWidth + spacing) * totalBoxesToShow) / 2 - spacing;
//   const fractionY = labelY + 15;
//   p5.textAlign(p5.CENTER, p5.BOTTOM);
//   p5.textSize(14);
//   p5.fill(0);

//   // Numerator
//   p5.text(numerator, fractionX, fractionY - 10);

//   // Fraction line
//   p5.stroke(0);
//   p5.strokeWeight(1);
//   p5.line(fractionX - 10, fractionY, fractionX + 10, fractionY);

//   // Denominator
//   p5.noStroke();
//   p5.textAlign(p5.CENTER, p5.TOP);
//   p5.text(denominator, fractionX, fractionY + 3);

//   // Label "box" next to the fraction
//   p5.textAlign(p5.LEFT, p5.CENTER);
//   p5.text("box", fractionX + 15, fractionY);
// }



}
        drawMarbles(
          p5,
          marbles,
          boxX,
          boxY,
          boxWidth,
          boxHeight,
          numerator,
          denominator,
          wholeNumber,
          boxRows
        ) {
          marbles.forEach((marble) => {
            if (
              marble.currentX !== undefined &&
              marble.currentY !== undefined
            ) {
              p5.noStroke();
              p5.fill(marble.color);
              p5.ellipse(
                marble.currentX,
                marble.currentY,
                marble.size,
                marble.size
              );
            }
          });
        }

        drawFractionLabel(p5, x, y, numerator, denominator, wholeNumber) {
          p5.fill(0);
          p5.noStroke();
          p5.textSize(16);
          p5.textAlign(p5.CENTER);
          const fractionText =
            wholeNumber > 0
              ? `${wholeNumber} ${numerator}/${denominator}`
              : `${numerator}/${denominator}`;
              // p5.text(fractionText + " box", x + (p5.width * 0.6) / 2, y);
        }

        drawInputField(p5, inputValue) {
          this.inputFieldX = p5.width * 0.1;
          this.inputFieldY = p5.height - 80;
          this.inputFieldWidth = 100;
          this.inputFieldHeight = 40;

          p5.fill(0);
          p5.noStroke();
          p5.textSize(18);
          p5.textAlign(p5.LEFT, p5.CENTER);
          p5.text(
            "Number of marbles:",
            this.inputFieldX,
            this.inputFieldY + 10
          );

          p5.stroke(this.inputBoxActive ? "#1a73e8" : "#4a4a4a");
          p5.strokeWeight(2);
          p5.fill(255);
          p5.rect(
            this.inputFieldX,
            this.inputFieldY + 20,
            this.inputFieldWidth,
            this.inputFieldHeight,
            5
          );

          p5.fill(0);
          p5.noStroke();
          p5.textSize(22);
          p5.textAlign(p5.CENTER, p5.CENTER);
          p5.text(
            inputValue || "",
            this.inputFieldX + this.inputFieldWidth / 2,
            this.inputFieldY + this.inputFieldHeight / 2 + 20
          );
        }

        drawSolution(
          p5,
          marbleCount,
          numerator,
          denominator,
          wholeNumber,
          userAnswer,
          isCorrect
        ) {
          const improperNumerator = wholeNumber * denominator + numerator;
          const improperDenominator = denominator;
          const correctAnswer = Math.round(
            (marbleCount * improperDenominator) / improperNumerator
          );
          const fractionText =
            wholeNumber > 0
              ? `${wholeNumber} ${numerator}/${denominator}`
              : `${numerator}/${denominator}`;

          const resultX = p5.width * 0.65;
          const resultY = 100;

          p5.noStroke();
          p5.textSize(16);
          p5.textAlign(p5.LEFT);

          if (isCorrect) {
            p5.fill("#27ae60");
            p5.text(
              `${marbleCount} ÷ ${fractionText} = ${correctAnswer}, so`,
              resultX + 70,
              resultY
            );
            p5.text(
              `${correctAnswer} marbles fit perfectly`,
              resultX + 70,
              resultY + 30
            );
            p5.text(`in 1 box. Well done!`, resultX + 70, resultY + 60);
          } else {
            p5.fill("#e74c3c");
            p5.text(
              `${marbleCount} ÷ ${fractionText} ≠ ${userAnswer}, so`,
              resultX + 70,
              resultY
            );
            if (userAnswer < correctAnswer) {
              p5.text(
                `${userAnswer} marbles are not enough`,
                resultX + 70,
                resultY + 30
              );
              p5.text(`to fill 1 box.`, resultX + 70, resultY + 60);
            } else {
              p5.text(
                `${userAnswer} marbles are too many`,
                resultX + 70,
                resultY + 30
              );
              p5.text(`to fill 1 box.`, resultX + 70, resultY + 60);
            }
          }
        }

initKeyboard() {
    const keys = this.keyboardContainer.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            const keyContent = key.textContent;

            if (key.classList.contains('backspace')) {
                if (this.onBackspaceKey) {
                    this.onBackspaceKey();
                }
            } else if (keyContent === '=') {
                if (this.onSubmit) {
                    this.onSubmit();
                    this.hideKeyboard(); // Close keyboard only on submit
                }
            } else if (/^[0-9]$/.test(keyContent)) {
                if (this.onKeyPress) {
                    this.onKeyPress(keyContent);
                    // Do not hide keyboard here to keep it open
                }
            }
        });
    });
}
        showKeyboard() {
          this.keyboardContainer.style.display = "block";
        }

        hideKeyboard() {
          this.keyboardContainer.style.display = "none";
        }

        enableFillButton() {
          this.fillBoxBtn.disabled = false;
        }

        disableFillButton() {
          this.fillBoxBtn.disabled = true;
        }

        enableRevertButton() {
          this.revertBtn.disabled = false;
        }

        disableRevertButton() {
          this.revertBtn.disabled = true;
        }

        enableNewBoxesButton() {
          this.newBoxesBtn.disabled = false;
        }

        disableNewBoxesButton() {
          this.newBoxesBtn.disabled = true;
        }
      }

      // CONTROLLER
      class ProblemController {
        constructor(model, view) {
          this.model = model;
          this.view = view;
          this.animationTimer = null;
          this.initEventListeners();
          this.generateNewProblem();
        }

        initEventListeners() {
          this.view.fillBoxBtn.addEventListener("click", () => {
            this.handleFillBox();
          });

          this.view.revertBtn.addEventListener("click", () => {
            this.handleRevert();
          });

          this.view.newBoxesBtn.addEventListener("click", () => {
            this.generateNewProblem();
          });

        //   this.view.onKeyPress = (char) => {
        //     if (!this.model.isAnswerSubmitted) {
        //       this.model.addCharacter(char);
        //       this.updateUI();
        //     }
        //   };

this.view.onKeyPress = (char) => {
    if (!this.model.isAnswerSubmitted) {
        this.model.addCharacter(char);
        this.updateUI();
        // Remove this.hideKeyboard() to keep keyboard open after key press
    }
};
          this.view.onBackspaceKey = () => {
            if (!this.model.isAnswerSubmitted) {
              this.model.removeDigit();
              this.updateUI();
            }
          };

          this.view.onSubmit = () => {
            if (
              !this.model.isAnswerSubmitted &&
              this.model.userInputValue.trim() !== ""
            ) {
              this.handleFillBox();
            }
          };

          this.view.initKeyboard();
        }

        updateUI() {
          if (
            this.model.userInputValue.trim() !== "" &&
            !this.model.isAnswerSubmitted
          ) {
            this.view.enableFillButton();
          } else {
            this.view.disableFillButton();
          }

          // enable "new boxes" button
          if (this.model.isAnswerCorrect && this.model.animationComplete) {
            this.view.enableNewBoxesButton();
          } else {
            this.view.disableNewBoxesButton();
          }

          // revert btn enabled
          if (this.model.animationComplete) {
            this.view.enableRevertButton();
          } else {
            this.view.disableRevertButton();
          }

          if (this.view.p5Canvas) {
            this.view.p5Canvas.drawBoxesAndMarbles({
              numerator: this.model.numerator,
              denominator: this.model.denominator,
              wholeNumber: this.model.wholeNumber,
              marbleCount: this.model.marbleCount,
              userAnswer: this.model.userAnswer,
              isAnswerSubmitted: this.model.isAnswerSubmitted,
              marbles: this.model.marbles,
              visibleMarbles: this.model.visibleMarbles,
              animating: this.model.animating,
              userInputValue: this.model.userInputValue,
              isAnswerCorrect: this.model.isAnswerCorrect,
              solutionSteps: this.model.solutionSteps,
            });
          }
        }

        generateNewProblem() {
          if (this.animationTimer) {
            clearInterval(this.animationTimer);
            this.animationTimer = null;
          }

          const problem = this.model.generateRandomProblem();
          this.view.disableFillButton();
          this.view.disableRevertButton();
          this.view.disableNewBoxesButton();

          this.view.setupCanvas();

          if (this.view.p5Canvas) {
            this.view.p5Canvas.drawBoxesAndMarbles({
              numerator: problem.numerator,
              denominator: problem.denominator,
              wholeNumber: problem.wholeNumber,
              marbleCount: problem.marbleCount,
              userAnswer: 0,
              isAnswerSubmitted: false,
              marbles: [],
              visibleMarbles: [],
              animating: false,
              userInputValue: "",
              isAnswerCorrect: false,
              solutionSteps: this.model.solutionSteps,
            });
          }
        }

        handleFillBox() {
          if (this.model.userInputValue.trim() === "") return;

          this.model.submitAnswer();
          this.generateMarbles();

          this.model.animating = true;
          this.model.visibleMarbles = [];
          this.model.currentMarbleIndex = 0;
          this.model.lastAnimationTime = Date.now();

          this.view.disableFillButton();
          this.view.enableRevertButton();
          this.view.hideKeyboard();
          this.view.disableNewBoxesButton();
          this.startMarbleAnimation();
        }

        startMarbleAnimation() {
          if (this.animationTimer) {
            clearInterval(this.animationTimer);
          }

          this.animationTimer = setInterval(() => {
            const now = Date.now();
            if (
              now - this.model.lastAnimationTime >=
              this.model.marbleAnimationDelay
            ) {
              this.model.lastAnimationTime = now;

              if (this.model.currentMarbleIndex < this.model.marbles.length) {
                const marble =
                  this.model.marbles[this.model.currentMarbleIndex];
                marble.currentX = marble.startX;
                marble.currentY = marble.startY;

                const targetX = marble.targetX;
                const targetY = marble.targetY;
                const startX = marble.startX;
                const startY = marble.startY;

                const steps = 20;
                const stepX = (targetX - startX) / steps;
                const stepY = (targetY - startY) / steps;

                let step = 0;
                const moveMarble = setInterval(() => {
                  if (step >= steps) {
                    marble.currentX = targetX;
                    console.log("🚀 ~ ProblemController ~ moveMarble ~ targetX:", targetX)
                    console.log("🚀 ~ ProblemController ~ moveMarble ~ currentX:", currentX)
                    marble.currentY = targetY;
                    
                    clearInterval(moveMarble);
                  } else {
                    marble.currentX += stepX;
                    marble.currentY += stepY;
                    step++;
                    this.updateUI();
                  }
                }, 50);

                this.model.visibleMarbles.push(marble);
                this.model.currentMarbleIndex++;
                this.updateUI();
              } else {
                this.model.animating = false;
                this.model.animationComplete = true;
                clearInterval(this.animationTimer);
              }
            }
          }, 50);
        }

        handleRevert() {
          if (this.animationTimer) {
            clearInterval(this.animationTimer);
            this.animationTimer = null;
          }

          this.model.resetAnswer();
          this.view.disableFillButton();
          this.view.disableRevertButton();
          this.view.disableNewBoxesButton();
          this.updateUI();
        }

     
generateMarbles() {
  this.model.marbles = [];
  if (!this.view.p5Canvas) return;
  const canvas = this.view.p5Canvas;
  const totalFraction = this.model.wholeNumber + (this.model.numerator / this.model.denominator);
  const correctAnswer = this.model.correctAnswer;
  const marbleCount = this.model.marbleCount;
  const numberOfRows = Math.ceil(totalFraction);
  const totalMarblesCapacity = correctAnswer * numberOfRows;

  // Calculate box size
  let boxWidth, boxHeight;
  if (totalFraction <= 1) {
    boxWidth = canvas.width * 0.6;
    boxHeight = canvas.height * 0.25;
  } else if (totalFraction <= 2) {
    boxWidth = canvas.width * 0.55;
    boxHeight = canvas.height * 0.2;
  } else {
    boxWidth = canvas.width * 0.5;
    boxHeight = canvas.height * 0.15;
  }

  const boxX = 20;
  const boxY = 100;

  // Compute marble size and spacing
  const horizontalInset = 10; // total margin inside the box (left + right)

  const spacing = 6;
  const marblesPerRow = correctAnswer;
  const availableWidth = boxWidth - (marblesPerRow + 1) * spacing;
  // const marbleSize = Math.min(availableWidth / marblesPerRow, boxHeight * 0.8, 30);
// Ensure marbles + spacings fit perfectly into the box width
const marbleSize = (boxWidth - horizontalInset - spacing * (marblesPerRow - 1)) / marblesPerRow;
  const startX = canvas.width - 50;
  const startY = canvas.height - 50;

  // 🔹 Precompute fixed slots
  const fixedPositions = [];

  for (let row = 0; row < numberOfRows; row++) {
    const rowY = boxY + row * (boxHeight + 20) + boxHeight / 2;
    const rowWidth = marblesPerRow * marbleSize + (marblesPerRow - 1) * spacing;
    const rowStartX = boxX + (boxWidth - rowWidth) / 2;

    for (let col = 0; col < marblesPerRow; col++) {
      const marbleX = rowStartX + col * (marbleSize + spacing) + marbleSize / 2;
      const marbleY = rowY;
      fixedPositions.push({ marbleX, marbleY });
    }
  }

  // 🔹 Now generate marbles up to marblesToDisplay, but using fixed positions
 let marblesToDisplay;
if (this.model.isAnswerCorrect) {
  if (this.model.correctAnswer < this.model.marbleCount) {
    marblesToDisplay = this.model.marbleCount; // Show all (orange + purple)
  } else {
    marblesToDisplay = this.model.correctAnswer; // Show only correct answer marbles
  }
} else {
  marblesToDisplay = Math.min(
  Math.max(this.model.userAnswer, this.model.marbleCount),
  totalMarblesCapacity 
);
}
  for (let i = 0; i < marblesToDisplay; i++) {
    const pos = fixedPositions[i] || { marbleX: boxX + boxWidth + marbleSize / 2, marbleY: boxY + numberOfRows * (boxHeight + 20) - boxHeight / 2 };

    let color;
    if (i < this.model.userAnswer ) {
      color = "#d35400"; // Orange for user input
    } else {
      color = "#8e44ad"; // Purple for filler / remainder
    }

    this.model.marbles.push({
      startX: startX,
      startY: startY,
      targetX: pos.marbleX,
      targetY: pos.marbleY,
      currentX: startX,
      currentY: startY,
      size: marbleSize,
      color: color,
    });
  }

  // Handle extra marble if needed
if (!this.model.isAnswerCorrect && this.model.userAnswer > totalMarblesCapacity) {
    this.model.marbles.push({
      startX: startX,
      startY: startY,
      targetX: boxX  +10 + boxWidth + marbleSize / 2,
      targetY: boxY -17 + numberOfRows * (boxHeight + 20) - boxHeight / 2,
      currentX: startX,
      currentY: startY,
      size: marbleSize,
      color: "#e39059",
    });
  }


}
 
    
    }

      document.addEventListener("DOMContentLoaded", () => {
        const model = new ProblemModel();
        const view = new ProblemView();
        const controller = new ProblemController(model, view);
      });
   