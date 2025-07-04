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

      this.wholeNumber =
        Math.random() < 0.4 ? Math.floor(Math.random() * 2) + 1 : 0;

      // Step 3: Convert to improper fraction
      const improperNumerator =
        this.wholeNumber * this.denominator + this.numerator;
      const improperDenominator = this.denominator;

      // Step 4: Calculate marbles using exact arithmetic to ensure whole number result
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
    this.currentItemType = "marbles"; // Default item type
  }

  setupCanvas() {
    if (this.p5Canvas) {
      this.p5Canvas.remove();
    }

    // Randomly choose between marbles and footballs
    this.currentItemType = Math.random() < 0.5 ? "marbles" : "footballs";

    const boxDisplayRect = this.boxDisplay.getBoundingClientRect();
    this.canvasWidth = boxDisplayRect.width;
    this.canvasHeight = 600;

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
            wholeNumber,
            this.currentItemType
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
            if (this.currentItemType === "marbles") {
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
            } else {
              this.drawFootballs(
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

      sketch.mousePressed = () => {
        const mouseX = sketch.mouseX;
        const mouseY = sketch.mouseY;
        const padding = 10;

        const isClickInInputField =
          mouseX > this.inputFieldX - padding &&
          mouseX < this.inputFieldX + this.inputFieldWidth + padding &&
          mouseY > this.inputFieldY - padding &&
          mouseY < this.inputFieldY + this.inputFieldHeight + padding + 10;

        const isClickInKeyboard = this.isClickOnKeyboard(mouseX, mouseY);

        if (isClickInInputField) {
          this.inputBoxActive = true;
          this.showKeyboard();
        } else if (!isClickInKeyboard) {
          this.inputBoxActive = false;
          this.hideKeyboard();
        }

        sketch.redraw();
      };

      sketch.keyPressed = () => {
        if (this.inputBoxActive && !this.currentProblem.isAnswerSubmitted) {
          if (sketch.keyCode === 8 || sketch.key === 'Backspace') {
            if (this.onBackspaceKey) {
              this.onBackspaceKey();
            }
          } else if (/^[0-9]$/.test(sketch.key)) {
            if (this.onKeyPress) {
              this.onKeyPress(sketch.key);
            }
          }
        }
        return false;
      };

      sketch.drawBoxesAndMarbles = (problem) => {
        this.currentProblem = problem;
        this.currentProblem.currentItemType = this.currentItemType; // Pass item type to problem
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

  drawQuestion(p5, marbleCount, numerator, denominator, wholeNumber, itemType) {
    p5.fill(0);
    p5.noStroke();
    p5.textSize(20);
    p5.textAlign(p5.LEFT, p5.TOP);

    const startX = 50;
    const startY = 20;
    let currentX = startX;

    const introText = `If ${marbleCount} ${itemType} fill `;
    p5.text(introText, currentX, startY);
    currentX += p5.textWidth(introText);

    if (wholeNumber > 0) {
      const wholeStr = `${wholeNumber} `;
      p5.text(wholeStr, currentX, startY);
      currentX += p5.textWidth(wholeStr);
    }

    const fracCenterX = currentX + 10;
    const fracCenterY = startY + 10;

    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.text(numerator, fracCenterX, fracCenterY - 5);

    p5.stroke(0);
    p5.strokeWeight(1);
    p5.line(fracCenterX - 10, fracCenterY, fracCenterX + 10, fracCenterY);

    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.text(denominator, fracCenterX, fracCenterY + 2);

    currentX += 30;

    p5.textAlign(p5.LEFT, p5.TOP);
    const boxText = (wholeNumber > 0 || numerator > 1) ? ` boxes, how many ${itemType} would fill 1 box?` : " box, how many marbles would fill 1 box?";
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

    const completeBoxes = Math.floor(totalFraction);
    const partialBoxFraction = totalFraction - completeBoxes;
    const totalBoxesToShow = completeBoxes + (partialBoxFraction > 0 ? 1 : 0);

    const boxesPerRow = Math.ceil(totalBoxesToShow / boxRows);
    const boxWidth = width / boxesPerRow;
    const spacing = 10;

    let boxIndex = 0;

    for (let row = 0; row < boxRows; row++) {
      const rowY = y + row * (height + 20);

      for (let col = 0; col < boxesPerRow && boxIndex < totalBoxesToShow; col++) {
        const boxX = x + col * (boxWidth + spacing);

        if (boxIndex < completeBoxes) {
          p5.stroke(0);
          p5.strokeWeight(2);
          p5.noFill();
          p5.drawingContext.setLineDash([]);
          p5.rect(boxX, rowY, boxWidth, height);

          const marbleSlots = correctAnswer;
          for (let slot = 1; slot < marbleSlots; slot++) {
            const slotX = boxX + (slot * boxWidth) / marbleSlots;
            p5.stroke(200);
            p5.strokeWeight(1);
            p5.drawingContext.setLineDash([]);
            p5.line(slotX, rowY, slotX, rowY + height);
          }
        } else if (boxIndex === completeBoxes && partialBoxFraction > 0) {
          const filledWidth = boxWidth * partialBoxFraction;

          p5.stroke(0);
          p5.strokeWeight(2);
          p5.noFill();
          p5.drawingContext.setLineDash([]);
          p5.rect(boxX, rowY, filledWidth, height);

          p5.stroke(0);
          p5.strokeWeight(2);
          p5.noFill();
          p5.drawingContext.setLineDash([8, 8]);
          p5.rect(boxX + filledWidth, rowY, boxWidth - filledWidth, height);
          p5.drawingContext.setLineDash([]);

          const marbleSlots = correctAnswer;
          const filledSlots = Math.floor(partialBoxFraction * marbleSlots);

          for (let slot = 1; slot < marbleSlots; slot++) {
            const slotX = boxX + (slot * boxWidth) / marbleSlots;

            if (slot <= filledSlots) {
              p5.stroke(200);
              p5.strokeWeight(1);
              p5.drawingContext.setLineDash([]);
            } else {
              p5.stroke(200);
              p5.strokeWeight(1);
              p5.drawingContext.setLineDash([4, 4]);
            }
            p5.line(slotX, rowY, slotX, rowY + height);
          }
          p5.drawingContext.setLineDash([]);
        }

        boxIndex++;
      }
    }

    // Draw horizontal bracket and fraction below the solid filled part
    if (numerator && denominator) {
      const filledBoxWidth = boxWidth * (numerator / denominator);
      const fullBoxX = x + (completeBoxes % boxesPerRow) * (boxWidth + spacing);
      const fullBoxY = y + (Math.floor(completeBoxes / boxesPerRow)) * (height + 20);

      const bracketY = fullBoxY + height + 10;
      const bracketStartX = fullBoxX;
      const bracketEndX = fullBoxX + filledBoxWidth;

      p5.stroke(0);
      p5.strokeWeight(2);
      p5.line(bracketStartX, bracketY, bracketEndX, bracketY);
      p5.line(bracketStartX, bracketY - 5, bracketStartX, bracketY + 5);
      p5.line(bracketEndX, bracketY - 5, bracketEndX, bracketY + 5);

      const centerX = (bracketStartX + bracketEndX) / 2;
      const textY = bracketY + 5;

      p5.noStroke();
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.textSize(14);
      p5.fill(0);
      p5.text(numerator, centerX, textY + 15);

      p5.stroke(0);
      p5.line(centerX - 10, textY + 20, centerX + 10, textY + 20);

      p5.noStroke();
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text(denominator, centerX, textY + 30);

      p5.textAlign(p5.LEFT, p5.CENTER);
      p5.text("box", centerX + 18, textY + 20);
    }
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
        const radius = marble.size * 0.5;
        
        // Draw shadow first (below marble)
        p5.drawingContext.shadowColor = 'rgba(0, 0, 0, 0.4)';
        p5.drawingContext.shadowBlur = 8;
        p5.drawingContext.shadowOffsetX = 3;
        p5.drawingContext.shadowOffsetY = 4;
        
        // Main marble body with complex gradient
        const mainGradient = p5.drawingContext.createRadialGradient(
          marble.currentX - radius * 0.3, // Light source from top-left
          marble.currentY - radius * 0.3,
          radius * 0.1,
          marble.currentX,
          marble.currentY,
          radius
        );

        const baseColor = p5.color(marble.color);
        const darkShadow = p5.color(
          p5.red(baseColor) * 0.3,
          p5.green(baseColor) * 0.3,
          p5.blue(baseColor) * 0.3
        );
        const midTone = p5.color(
          p5.red(baseColor) * 0.7,
          p5.green(baseColor) * 0.7,
          p5.blue(baseColor) * 0.7
        );
        const lightTone = p5.color(
          Math.min(255, p5.red(baseColor) * 1.3),
          Math.min(255, p5.green(baseColor) * 1.3),
          Math.min(255, p5.blue(baseColor) * 1.3)
        );

        // Create realistic marble gradient
        mainGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // Bright center
        mainGradient.addColorStop(0.15, lightTone.toString());
        mainGradient.addColorStop(0.4, baseColor.toString());
        mainGradient.addColorStop(0.7, midTone.toString());
        mainGradient.addColorStop(1, darkShadow.toString());

        p5.drawingContext.fillStyle = mainGradient;
        p5.noStroke();
        p5.ellipse(marble.currentX, marble.currentY, marble.size, marble.size);

        // Reset shadow for other elements
        p5.drawingContext.shadowBlur = 0;
        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;

        // Add marble surface patterns/veins
        p5.drawingContext.globalAlpha = 0.3;
        p5.stroke(255, 255, 255, 100);
        p5.strokeWeight(1);
        
        // Draw curved veins like in real marble
        p5.noFill();
        p5.beginShape();
        p5.vertex(marble.currentX - radius * 0.6, marble.currentY - radius * 0.2);
        p5.bezierVertex(
          marble.currentX - radius * 0.2, marble.currentY - radius * 0.5,
          marble.currentX + radius * 0.2, marble.currentY + radius * 0.1,
          marble.currentX + radius * 0.5, marble.currentY + radius * 0.3
        );
        p5.endShape();
        
        p5.beginShape();
        p5.vertex(marble.currentX - radius * 0.4, marble.currentY + radius * 0.3);
        p5.bezierVertex(
          marble.currentX, marble.currentY,
          marble.currentX + radius * 0.3, marble.currentY - radius * 0.4,
          marble.currentX + radius * 0.6, marble.currentY - radius * 0.1
        );
        p5.endShape();

        p5.drawingContext.globalAlpha = 1;

        // Primary highlight - large and bright
        const highlight1Gradient = p5.drawingContext.createRadialGradient(
          marble.currentX - radius * 0.4,
          marble.currentY - radius * 0.4,
          0,
          marble.currentX - radius * 0.4,
          marble.currentY - radius * 0.4,
          radius * 0.35
        );
        highlight1Gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        highlight1Gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)');
        highlight1Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        p5.drawingContext.fillStyle = highlight1Gradient;
        p5.noStroke();
        p5.ellipse(
          marble.currentX - radius * 0.4,
          marble.currentY - radius * 0.4,
          radius * 0.7,
          radius * 0.7
        );

        // Secondary highlight - smaller and sharper
        const highlight2Gradient = p5.drawingContext.createRadialGradient(
          marble.currentX + radius * 0.2,
          marble.currentY - radius * 0.2,
          0,
          marble.currentX + radius * 0.2,
          marble.currentY - radius * 0.2,
          radius * 0.15
        );
        highlight2Gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        highlight2Gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
        highlight2Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        p5.drawingContext.fillStyle = highlight2Gradient;
        p5.ellipse(
          marble.currentX + radius * 0.2,
          marble.currentY - radius * 0.2,
          radius * 0.3,
          radius * 0.3
        );

        // Small sharp highlight for extra realism
        p5.fill(255, 255, 255, 200);
        p5.noStroke();
        p5.ellipse(
          marble.currentX - radius * 0.5,
          marble.currentY - radius * 0.5,
          radius * 0.15,
          radius * 0.15
        );

        // Add subtle rim lighting
        p5.drawingContext.globalAlpha = 0.6;
        p5.stroke(255, 255, 255, 150);
        p5.strokeWeight(2);
        p5.noFill();
        p5.arc(
          marble.currentX - radius * 0.3,
          marble.currentY - radius * 0.3,
          marble.size * 0.8,
          marble.size * 0.8,
          p5.PI * 0.9,
          p5.PI * 1.4
        );
        p5.drawingContext.globalAlpha = 1;

        // Draw number on marble with better contrast
        p5.fill(255, 255, 255, 240);
        p5.stroke(0, 0, 0, 100);
        p5.strokeWeight(1);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(marble.size * 0.4);
        p5.textStyle(p5.BOLD);
        p5.text(
          marble.number.toString(),
          marble.currentX,
          marble.currentY + 2
        );

        // Reset drawing context
        p5.drawingContext.shadowBlur = 0;
        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;
        p5.noStroke();
      }
    });
  }

  drawFootballs(p5, footballs, boxX, boxY, boxWidth, boxHeight, numerator, denominator, wholeNumber, boxRows) {
    footballs.forEach((football) => {
      if (football.currentX !== undefined && football.currentY !== undefined) {
        const width = football.size * 0.8;
        const height = football.size;
        const radius = width * 0.5;
        
        // Draw shadow first (below football)
        p5.drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
        p5.drawingContext.shadowBlur = 10;
        p5.drawingContext.shadowOffsetX = 4;
        p5.drawingContext.shadowOffsetY = 6;
        
        // Main football body with complex gradient
        const mainGradient = p5.drawingContext.createRadialGradient(
          football.currentX - radius * 0.3, // Light source from top-left
          football.currentY - radius * 0.4,
          radius * 0.1,
          football.currentX,
          football.currentY,
          radius
        );

        // Football brown color variations
        const baseColor = p5.color(139, 69, 19); // Saddle brown
        const darkShadow = p5.color(69, 39, 19);
        const midTone = p5.color(160, 82, 45);
        const lightTone = p5.color(205, 133, 63);

        // Create realistic football gradient
        mainGradient.addColorStop(0, 'rgba(245, 222, 179, 0.9)'); // Bright center
        mainGradient.addColorStop(0.15, lightTone.toString());
        mainGradient.addColorStop(0.4, baseColor.toString());
        mainGradient.addColorStop(0.7, midTone.toString());
        mainGradient.addColorStop(1, darkShadow.toString());

        p5.drawingContext.fillStyle = mainGradient;
        p5.noStroke();
        p5.ellipse(football.currentX, football.currentY, width, height);

        // Reset shadow for other elements
        p5.drawingContext.shadowBlur = 0;
        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;

        // Draw football laces (white stitching down the middle)
        p5.stroke(255, 255, 255, 200);
        p5.strokeWeight(2);
        p5.line(
          football.currentX, 
          football.currentY - height * 0.3,
          football.currentX, 
          football.currentY + height * 0.3
        );

        // Draw individual lace marks
        p5.strokeWeight(1.5);
        for (let i = -2; i <= 2; i++) {
          const laceY = football.currentY + i * (height * 0.12);
          p5.line(
            football.currentX - width * 0.08,
            laceY,
            football.currentX + width * 0.08,
            laceY
          );
        }

        // Draw football seam lines
        p5.stroke(101, 67, 33, 150);
        p5.strokeWeight(1);
        p5.noFill();
        
        // Left seam curve
        p5.beginShape();
        p5.vertex(football.currentX - width * 0.35, football.currentY);
        p5.bezierVertex(
          football.currentX - width * 0.25, football.currentY - height * 0.25,
          football.currentX - width * 0.15, football.currentY - height * 0.35,
          football.currentX, football.currentY - height * 0.4
        );
        p5.endShape();
        
        // Right seam curve
        p5.beginShape();
        p5.vertex(football.currentX + width * 0.35, football.currentY);
        p5.bezierVertex(
          football.currentX + width * 0.25, football.currentY - height * 0.25,
          football.currentX + width * 0.15, football.currentY - height * 0.35,
          football.currentX, football.currentY - height * 0.4
        );
        p5.endShape();

        // Bottom seam curves
        p5.beginShape();
        p5.vertex(football.currentX - width * 0.35, football.currentY);
        p5.bezierVertex(
          football.currentX - width * 0.25, football.currentY + height * 0.25,
          football.currentX - width * 0.15, football.currentY + height * 0.35,
          football.currentX, football.currentY + height * 0.4
        );
        p5.endShape();
        
        p5.beginShape();
        p5.vertex(football.currentX + width * 0.35, football.currentY);
        p5.bezierVertex(
          football.currentX + width * 0.25, football.currentY + height * 0.25,
          football.currentX + width * 0.15, football.currentY + height * 0.35,
          football.currentX, football.currentY + height * 0.4
        );
        p5.endShape();

        // Primary highlight - large and bright
        const highlight1Gradient = p5.drawingContext.createRadialGradient(
          football.currentX - radius * 0.3,
          football.currentY - radius * 0.4,
          0,
          football.currentX - radius * 0.3,
          football.currentY - radius * 0.4,
          radius * 0.4
        );
        highlight1Gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        highlight1Gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
        highlight1Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        p5.drawingContext.fillStyle = highlight1Gradient;
        p5.noStroke();
        p5.ellipse(
          football.currentX - radius * 0.3,
          football.currentY - radius * 0.4,
          width * 0.4,
          height * 0.3
        );

        // Secondary highlight - smaller and sharper
        const highlight2Gradient = p5.drawingContext.createRadialGradient(
          football.currentX + radius * 0.15,
          football.currentY - radius * 0.25,
          0,
          football.currentX + radius * 0.15,
          football.currentY - radius * 0.25,
          radius * 0.15
        );
        highlight2Gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        highlight2Gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
        highlight2Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        p5.drawingContext.fillStyle = highlight2Gradient;
        p5.ellipse(
          football.currentX + radius * 0.15,
          football.currentY - radius * 0.25,
          width * 0.25,
          height * 0.2
        );

        // Small sharp highlight for extra realism
        p5.fill(255, 255, 255, 180);
        p5.noStroke();
        p5.ellipse(
          football.currentX - radius * 0.4,
          football.currentY - radius * 0.45,
          width * 0.12,
          height * 0.08
        );

        // Draw number on football with better contrast
        p5.fill(255, 255, 255, 240);
        p5.stroke(0, 0, 0);
        p5.strokeWeight(3);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(football.size * 0.3);
        p5.textStyle(p5.BOLD);
        p5.text(
          football.number.toString(),
          football.currentX,
          football.currentY + 2
        );

        // Reset drawing context
        p5.drawingContext.shadowBlur = 0;
        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;
        p5.noStroke();
      }
    });
  }

  drawApples(p5, apples, boxX, boxY, boxWidth, boxHeight, numerator, denominator, wholeNumber, boxRows) {
    apples.forEach((apple) => {
      if (apple.currentX !== undefined && apple.currentY !== undefined) {
        const radius = apple.size * 0.5;
        
        // Draw shadow first (below apple)
        p5.drawingContext.shadowColor = 'rgba(0, 0, 0, 0.4)';
        p5.drawingContext.shadowBlur = 8;
        p5.drawingContext.shadowOffsetX = 3;
        p5.drawingContext.shadowOffsetY = 5;
        
        // Main apple body with complex gradient
        const mainGradient = p5.drawingContext.createRadialGradient(
          apple.currentX - radius * 0.3, // Light source from top-left
          apple.currentY - radius * 0.2,
          radius * 0.1,
          apple.currentX,
          apple.currentY + radius * 0.1,
          radius
        );

        // Apple red color variations
        const baseColor = p5.color(220, 20, 60); // Crimson
        const darkShadow = p5.color(139, 0, 0);
        const midTone = p5.color(178, 34, 34);
        const lightTone = p5.color(255, 99, 71);

        // Create realistic apple gradient
        mainGradient.addColorStop(0, 'rgba(255, 182, 193, 0.9)'); // Bright center
        mainGradient.addColorStop(0.15, lightTone.toString());
        mainGradient.addColorStop(0.4, baseColor.toString());
        mainGradient.addColorStop(0.7, midTone.toString());
        mainGradient.addColorStop(1, darkShadow.toString());

        p5.drawingContext.fillStyle = mainGradient;
        p5.noStroke();
        
        // Draw apple shape (slightly flattened circle with indent at top)
        p5.beginShape();
        for (let angle = 0; angle < p5.TWO_PI; angle += 0.1) {
          let x = apple.currentX + radius * Math.cos(angle);
          let y = apple.currentY + radius * Math.sin(angle);
          
          // Create apple indent at top
          if (angle > p5.PI * 1.7 || angle < p5.PI * 0.3) {
            let indentFactor = 1 - 0.3 * Math.cos(angle * 3);
            x = apple.currentX + radius * indentFactor * Math.cos(angle);
            y = apple.currentY + radius * indentFactor * Math.sin(angle);
          }
          
          p5.vertex(x, y);
        }
        p5.endShape(p5.CLOSE);

        // Reset shadow for other elements
        p5.drawingContext.shadowBlur = 0;
        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;

        // Draw apple stem
        p5.stroke(101, 67, 33);
        p5.strokeWeight(3);
        p5.line(
          apple.currentX,
          apple.currentY - radius * 0.8,
          apple.currentX,
          apple.currentY - radius * 1.2
        );

        // Draw apple leaf
        p5.fill(34, 139, 34);
        p5.noStroke();
        p5.ellipse(
          apple.currentX + radius * 0.3,
          apple.currentY - radius * 0.9,
          radius * 0.4,
          radius * 0.2
        );

        // Add apple surface variations/streaks
        p5.drawingContext.globalAlpha = 0.3;
        p5.stroke(255, 105, 180, 100);
        p5.strokeWeight(1);
        
        // Draw subtle vertical streaks like real apples
        p5.noFill();
        for (let i = -2; i <= 2; i++) {
          p5.beginShape();
          p5.vertex(apple.currentX + i * radius * 0.2, apple.currentY - radius * 0.7);
          p5.bezierVertex(
            apple.currentX + i * radius * 0.15, apple.currentY - radius * 0.2,
            apple.currentX + i * radius * 0.25, apple.currentY + radius * 0.2,
            apple.currentX + i * radius * 0.1, apple.currentY + radius * 0.6
          );
          p5.endShape();
        }

        p5.drawingContext.globalAlpha = 1;

        // Primary highlight - large and bright
        const highlight1Gradient = p5.drawingContext.createRadialGradient(
          apple.currentX - radius * 0.35,
          apple.currentY - radius * 0.25,
          0,
          apple.currentX - radius * 0.35,
          apple.currentY - radius * 0.25,
          radius * 0.4
        );
        highlight1Gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        highlight1Gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)');
        highlight1Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        p5.drawingContext.fillStyle = highlight1Gradient;
        p5.noStroke();
        p5.ellipse(
          apple.currentX - radius * 0.35,
          apple.currentY - radius * 0.25,
          radius * 0.8,
          radius * 0.6
        );

        // Secondary highlight - smaller and sharper
        const highlight2Gradient = p5.drawingContext.createRadialGradient(
          apple.currentX + radius * 0.2,
          apple.currentY - radius * 0.1,
          0,
          apple.currentX + radius * 0.2,
          apple.currentY - radius * 0.1,
          radius * 0.2
        );
        highlight2Gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        highlight2Gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
        highlight2Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        p5.drawingContext.fillStyle = highlight2Gradient;
        p5.ellipse(
          apple.currentX + radius * 0.2,
          apple.currentY - radius * 0.1,
          radius * 0.4,
          radius * 0.3
        );

        // Small sharp highlight for extra realism
        p5.fill(255, 255, 255, 200);
        p5.noStroke();
        p5.ellipse(
          apple.currentX - radius * 0.45,
          apple.currentY - radius * 0.35,
          radius * 0.15,
          radius * 0.12
        );

        // Add subtle rim lighting
        p5.drawingContext.globalAlpha = 0.5;
        p5.stroke(255, 255, 255, 120);
        p5.strokeWeight(2);
        p5.noFill();
        p5.arc(
          apple.currentX - radius * 0.2,
          apple.currentY - radius * 0.2,
          apple.size * 0.9,
          apple.size * 0.9,
          p5.PI * 0.8,
          p5.PI * 1.5
        );
        p5.drawingContext.globalAlpha = 1;

        // Draw number on apple with better contrast
        p5.fill(255, 255, 255, 240);
        p5.stroke(0, 0, 0, 100);
        p5.strokeWeight(1);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(apple.size * 0.35);
        p5.textStyle(p5.BOLD);
        p5.text(
          apple.number.toString(),
          apple.currentX,
          apple.currentY + 2
        );

        // Reset drawing context
        p5.drawingContext.shadowBlur = 0;
        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;
        p5.noStroke();
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
            this.hideKeyboard();
          }
        } else if (/^[0-9]$/.test(keyContent)) {
          if (this.onKeyPress) {
            this.onKeyPress(keyContent);
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

    this.view.onKeyPress = (char) => {
      if (!this.model.isAnswerSubmitted) {
        this.model.addCharacter(char);
        this.updateUI();
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

    if (this.model.isAnswerCorrect && this.model.animationComplete) {
      this.view.enableNewBoxesButton();
    } else {
      this.view.disableNewBoxesButton();
    }

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
        currentItemType: this.view.currentItemType,
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
        currentItemType: this.view.currentItemType,
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

    const horizontalInset = 10;
    const spacing = 6;
    const marblesPerRow = correctAnswer;
    const availableWidth = boxWidth - (marblesPerRow + 1) * spacing;
    const marbleSize = (boxWidth - horizontalInset - spacing * (marblesPerRow - 1)) / marblesPerRow;
    const startX = canvas.width - 50;
    const startY = canvas.height - 50;

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

    let marblesToDisplay;
    if (this.model.isAnswerCorrect) {
      if (this.model.correctAnswer < this.model.marbleCount) {
        marblesToDisplay = this.model.marbleCount;
      } else {
        marblesToDisplay = this.model.correctAnswer;
      }
    } else {
      marblesToDisplay = Math.min(
        Math.max(this.model.userAnswer, this.model.marbleCount),
        totalMarblesCapacity
      );
    }

    for (let i = 0; i < marblesToDisplay; i++) {
      const pos = fixedPositions[i] || { 
        marbleX: boxX + boxWidth + marbleSize / 2, 
        marbleY: boxY + numberOfRows * (boxHeight + 20) - boxHeight / 2 
      };

      let color;
      if (i < this.model.userAnswer) {
        color = "#d35400"; // Orange for user input
      } else {
        color = "#8e44ad"; // Purple for filler
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
        number: i + 1 // Add marble number
      });
    }

    if (!this.model.isAnswerCorrect && this.model.userAnswer > totalMarblesCapacity) {
      this.model.marbles.push({
        startX: startX,
        startY: startY,
        targetX: boxX + 10 + boxWidth + marbleSize / 2,
        targetY: boxY - 17 + numberOfRows * (boxHeight + 20) - boxHeight / 2,
        currentX: startX,
        currentY: startY,
        size: marbleSize,
        color: "#e39059",
        number: marblesToDisplay + 1 // Number for extra marble
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const model = new ProblemModel();
  const view = new ProblemView();
  const controller = new ProblemController(model, view);
});