//
//
// script.js - Updated with canvas-based input fields
//
//
let canvas;
let currentStep = 0;
let divisionSteps = [];
let animationSpeed = 30; // Animation frames per step
let animationTimer = 0;
let numerator = 1;
let denominator = 3;
let quotient = "";
let remainders = [];
let isTerminating = false;
let repeatingStart = -1;
let repeatingLength = 0;
let numberLineValue = 0;
let challengeMode = false;
let userGuess = null;
let showingResult = false;
let factors = [];
let longDivisionResult = null; // Object to hold detailed division results

// Canvas input field variables
let numeratorInput = "";
let denominatorInput = "";
let activeInput = null; // 'numerator' or 'denominator' or null
let inputFieldWidth = 50;
let inputFieldHeight = 25;
let convertButtonWidth = 80;
let convertButtonHeight = 35;
// --- MODIFICATION: Shifted input fields to the left ---
let inputStartX = 600; 
let inputStartY = 10;

function setup() {
    canvas = createCanvas(800, 500);
    canvas.parent('sketch-container');
    background(255);
    
    // Initialize input values
    numeratorInput = "1";
    denominatorInput = "3";
    numerator = 1;
    denominator = 3;
}

function draw() {
    background(255);
    
    // Title area
    push();
    fill(50);
    textSize(20);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    if (!longDivisionResult) {
        text('Conversion', 40, 20);
    } else {
        text(`Converting ${numerator}/${denominator} to Decimal`, 40, 20);
    }
    pop();
    
    // Draw canvas input fields and convert button
    drawCanvasInputs();
    
    if (longDivisionResult) {
        drawAnalysisAndLabels();
        drawStepsDiagram();
        drawNumberLine();
        
        // Animation control
        if (currentStep < divisionSteps.length && !showingResult) {
            animationTimer++;
            if (animationTimer >= animationSpeed) {
                currentStep++;
                animationTimer = 0;
                
                if (currentStep >= divisionSteps.length) {
                    showingResult = true;
                    displayResult();
                }
            }
        }
    } else {
        drawInitialState();
    }
    
    if (challengeMode && userGuess === null) {
        drawChallengeMode();
    }
}


// --- REVISED FUNCTION: Layout logic updated for the button position ---
function drawCanvasInputs() {
    push();
    
    // Vertical layout for the fraction
    let numInputY = inputStartY;
    let fractionLineY = numInputY + inputFieldHeight + 5;
    let denInputY = fractionLineY + 5;

    // --- MODIFICATION: New button position logic ---
    // Position button to the right of the input fields
    let buttonX = inputStartX + inputFieldWidth + 15;
    // Vertically center the button with the entire fraction display
    let fractionBlockHeight = (denInputY + inputFieldHeight) - numInputY;
    let convertButtonY = numInputY + (fractionBlockHeight / 2) - (convertButtonHeight / 2);


    // Draw numerator input field
    let numHover = mouseX >= inputStartX && mouseX <= inputStartX + inputFieldWidth && 
                   mouseY >= numInputY && mouseY <= numInputY + inputFieldHeight;
    let numActive = activeInput === 'numerator';
    
    fill(numActive ? color(240, 248, 255) : (numHover ? color(248, 248, 248) : 255));
    stroke(numActive ? color(0, 100, 200) : (numHover ? color(150, 150, 150) : color(200, 200, 200)));
    strokeWeight(numActive ? 2 : 1);
    rect(inputStartX, numInputY, inputFieldWidth, inputFieldHeight, 4);
    
    // Draw numerator text
    fill(50);
    textAlign(CENTER, CENTER);
    textSize(14);
    let numText = numeratorInput || "1";
    text(numText, inputStartX + inputFieldWidth/2, numInputY + inputFieldHeight/2);
    
    // Draw cursor for active numerator input
    if (numActive && frameCount % 60 < 30) {
        let textW = textWidth(numText);
        stroke(0, 100, 200);
        strokeWeight(1);
        line(inputStartX + inputFieldWidth/2 + textW/2 + 2, numInputY + 6, 
             inputStartX + inputFieldWidth/2 + textW/2 + 2, numInputY + inputFieldHeight - 6);
    }
    
    // Draw fraction line
    stroke(80);
    strokeWeight(2);
    line(inputStartX - 5, fractionLineY, inputStartX + inputFieldWidth + 5, fractionLineY);
    
    // Draw denominator input
    let denHover = mouseX >= inputStartX && mouseX <= inputStartX + inputFieldWidth && 
                   mouseY >= denInputY && mouseY <= denInputY + inputFieldHeight;
    let denActive = activeInput === 'denominator';
    
    fill(denActive ? color(240, 248, 255) : (denHover ? color(248, 248, 248) : 255));
    stroke(denActive ? color(0, 100, 200) : (denHover ? color(150, 150, 150) : color(200, 200, 200)));
    strokeWeight(denActive ? 2 : 1);
    rect(inputStartX, denInputY, inputFieldWidth, inputFieldHeight, 4);
    
    // Draw denominator text
    fill(50);
    textAlign(CENTER, CENTER);
    textSize(14);
    let denText = denominatorInput || "3";
    text(denText, inputStartX + inputFieldWidth/2, denInputY + inputFieldHeight/2);
    
    // Draw cursor for active denominator input
    if (denActive && frameCount % 60 < 30) {
        let textW = textWidth(denText);
        stroke(0, 100, 200);
        strokeWeight(1);
        line(inputStartX + inputFieldWidth/2 + textW/2 + 2, denInputY + 6, 
             inputStartX + inputFieldWidth/2 + textW/2 + 2, denInputY + inputFieldHeight - 6);
    }
    
    // Draw convert button
    let buttonHover = mouseX >= buttonX && mouseX <= buttonX + convertButtonWidth && 
                     mouseY >= convertButtonY && mouseY <= convertButtonY + convertButtonHeight;
    
    fill(buttonHover ? color(45, 85, 180) : color(60, 120, 220));
    stroke(buttonHover ? color(35, 75, 160) : color(50, 100, 180));
    strokeWeight(1);
    rect(buttonX, convertButtonY, convertButtonWidth, convertButtonHeight, 6);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text("Convert", buttonX + convertButtonWidth/2, convertButtonY + convertButtonHeight/2);
    textStyle(NORMAL);
    
    pop();
}

// --- REVISED FUNCTION: Click detection updated to match the new button position ---
function mousePressed() {
    // Define layout variables consistent with drawCanvasInputs
    let numInputY = inputStartY;
    let fractionLineY = numInputY + inputFieldHeight + 5;
    let denInputY = fractionLineY + 5;

    // --- MODIFICATION: New button position logic for click detection ---
    let buttonX = inputStartX + inputFieldWidth + 15;
    let fractionBlockHeight = (denInputY + inputFieldHeight) - numInputY;
    let convertButtonY = numInputY + (fractionBlockHeight / 2) - (convertButtonHeight / 2);
    
    // Check numerator input click
    if (mouseX >= inputStartX && mouseX <= inputStartX + inputFieldWidth && 
        mouseY >= numInputY && mouseY <= numInputY + inputFieldHeight) {
        activeInput = 'numerator';
        return;
    }
    
    // Check denominator input click
    if (mouseX >= inputStartX && mouseX <= inputStartX + inputFieldWidth && 
        mouseY >= denInputY && mouseY <= denInputY + inputFieldHeight) {
        activeInput = 'denominator';
        return;
    }
    
    // Check convert button click
    if (mouseX >= buttonX && mouseX <= buttonX + convertButtonWidth && 
        mouseY >= convertButtonY && mouseY <= convertButtonY + convertButtonHeight) {
        startDivision();
        activeInput = null;
        return;
    }
    
    // Click outside inputs - deactivate
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        activeInput = null;
    }
    
    // Challenge mode interactions
    if (challengeMode && userGuess === null) {
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            if (mouseX >= 250 && mouseX <= 370 && mouseY >= 230 && mouseY <= 270) {
                userGuess = 'terminating';
            } else if (mouseX >= 430 && mouseX <= 550 && mouseY >= 230 && mouseY <= 270) {
                userGuess = 'repeating';
            }
        }
    }
}

function keyPressed() {
    if (activeInput === null) return;
    
    if (key === 'Enter') {
        startDivision();
        activeInput = null;
        return;
    }
    
    if (key === 'Tab') {
        if (activeInput === 'numerator') {
            activeInput = 'denominator';
        } else {
            activeInput = 'numerator';
        }
        return false; // Prevent default tab behavior
    }
    
    let currentInput = activeInput === 'numerator' ? numeratorInput : denominatorInput;
    
    if (key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
    } else if (key >= '0' && key <= '9') {
        if (currentInput.length < 6) { // Limit input length
            currentInput += key;
        }
    } else if (key === '-' && currentInput.length === 0) {
        currentInput += key;
    }
    
    if (activeInput === 'numerator') {
        numeratorInput = currentInput;
    } else {
        denominatorInput = currentInput;
    }
}

// Helper to draw styled boxes
function drawStyledBox(x, y, w, h, fillColor) {
    push();
    drawingContext.shadowOffsetX = 2;
    drawingContext.shadowOffsetY = 4;
    drawingContext.shadowBlur = 12;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.08)';
    
    fill(fillColor);
    stroke(224);
    strokeWeight(1);
    rect(x, y, w, h, 12);
    
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0)'; // Reset for content
    pop();
}

function drawInitialState() {
    drawStyledBox(40, 80, 480, 250, color(255, 250, 240));
    fill(150);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Analysis:", 60, 100);

    drawStyledBox(540, 80, 220, 250, color(250, 250, 255));
    fill(150);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Steps:", 560, 100);

    drawStyledBox(40, 350, 720, 100, color(245, 255, 245));
    push();
    translate(50, 400); 
    
    let padding = 16;
    let lineStart = padding;
    let lineEnd = 700 - padding;

    stroke(100);
    strokeWeight(2);
    line(lineStart, 0, lineEnd, 0);
    line(lineStart, 0, lineStart + 10, -5);
    line(lineStart, 0, lineStart + 10, 5);
    line(lineEnd, 0, lineEnd - 10, -5);
    line(lineEnd, 0, lineEnd - 10, 5);
    
    for (let i = -10; i <= 10; i++) {
        let x = map(i, -10, 10, lineStart, lineEnd);
        stroke(100);
        strokeWeight(2);
        line(x, -5, x, 5);
        if (i > -10 && i < 10) {
            fill(100);
            noStroke();
            textSize(11);
            textAlign(CENTER, TOP);
            text(i, x, 15);
        }
    }
    for (let i = -10; i < 10; i++) {
        let x = map(i + 0.5, -10, 10, lineStart, lineEnd);
        stroke(100, 150);
        strokeWeight(1.5);
        line(x, -3, x, 3);
    }
    pop();
}

function drawAnalysisAndLabels() {
    drawStyledBox(40, 80, 480, 250, color(255, 250, 240));
    let analysisHeight = drawFactorAnalysisContent(60, 100);
    drawDivisionSummary(300, 130);
    
    // Draw the result box inside the analysis panel when ready
    drawResultInsideAnalysis(60, 100 + analysisHeight + 15);
}

function drawStepsDiagram() {
    drawStyledBox(540, 80, 220, 250, color(250, 250, 255));
    drawLongDivisionDiagram(572, 100);
}

function drawLongDivisionDiagram(x, y) {
    if (!longDivisionResult) return;
    const { sign, integerPart, decimalDigits, steps } = longDivisionResult;

    push();
    translate(x, y);
    textFont('ui-monospace, "Roboto Mono", Menlo, Monaco, monospace');
    textSize(12);
    
    const LEFT_GUTTER = 18;
    const QUOTIENT_TO_BRACKET_GAP = 6;
    
    const charW = textWidth('0');
    const vStep = 18;
    const textH = 14;
    const lineGap = 2;
    const availableHeight = 250 - 40; 

    fill(50);
    textAlign(LEFT, TOP);
    text("Steps:", 0, 0);

    translate(LEFT_GUTTER, 0);

    let fullQuotientStr = `${sign}${integerPart}.${decimalDigits.join('')}`;
    let diagramQuotientDisplay = fullQuotientStr;
    const parts = fullQuotientStr.split('.');
    if (parts.length > 1 && parts[1].length > 4) {
        diagramQuotientDisplay = `${parts[0]}.${parts[1].substring(0, 4)}...`;
    }

    const divisorStr = String(Math.abs(denominator));
    const dividendStr = String(Math.abs(numerator));

    const diagramStartX = 0;
    const dividendStartX = diagramStartX + (divisorStr.length + 2) * charW;
    const maxLen = Math.max(diagramQuotientDisplay.length, dividendStr.length + (steps.length > 0 ? 1 : 0));
    const diagramEndX = dividendStartX + maxLen * charW;

    textAlign(RIGHT, TOP);
    text(divisorStr, diagramStartX + divisorStr.length * charW, 30);
    textAlign(LEFT, TOP);
    text(dividendStr, dividendStartX, 30);
    textAlign(RIGHT, TOP);
    text(diagramQuotientDisplay, diagramEndX, 30 - vStep - 2 - QUOTIENT_TO_BRACKET_GAP);

    line(diagramStartX + divisorStr.length * charW + 5, 30 - vStep / 2, diagramEndX, 30 - vStep / 2);
    line(diagramStartX + divisorStr.length * charW + 5, 30 - vStep / 2, diagramStartX + divisorStr.length * charW + 5, 30 + textH);

    let currentY = 30;
    let leftPad = 0;

    if (Math.abs(numerator) >= Math.abs(denominator)) {
        const product = integerPart * Math.abs(denominator);
        leftPad = String(integerPart).length;
        if (Number(dividendStr.slice(0, leftPad)) < product && dividendStr.length > leftPad) { leftPad++; }
        currentY += vStep;
        textAlign(RIGHT, TOP);
        text(String(product), dividendStartX + leftPad * charW, currentY);
        line(dividendStartX, currentY + textH + lineGap, dividendStartX + leftPad * charW, currentY + textH + lineGap);
        const remainder = Number(dividendStr.slice(0, leftPad)) - product;
        currentY += vStep;
        text(String(remainder), dividendStartX + leftPad * charW, currentY);
    } else {
        leftPad = 1;
        currentY += vStep;
        textAlign(RIGHT, TOP);
        text('0', dividendStartX + leftPad * charW, currentY);
        line(dividendStartX, currentY + textH + lineGap, dividendStartX + leftPad * charW, currentY + textH + lineGap);
        currentY += vStep;
        text(dividendStr, dividendStartX + leftPad * charW, currentY);
    }

    for (let i = 0; i < Math.min(currentStep, steps.length); i++) {
        if (currentY + 3 * vStep > availableHeight) {
            textAlign(RIGHT, TOP);
            text("...", dividendStartX + (leftPad + 1) * charW, currentY + vStep);
            break; 
        }
        const step = steps[i];
        let subtractedOffset = String(step.subtracted).length * charW;
        currentY += vStep;
        textAlign(RIGHT, TOP);
        text(String(step.partialDividend), dividendStartX + (leftPad + 1) * charW, currentY);
        currentY += vStep;
        text(String(step.subtracted), dividendStartX + (leftPad + 1) * charW, currentY);
        line(dividendStartX + (leftPad + 1) * charW - subtractedOffset, currentY + textH + lineGap, dividendStartX + (leftPad + 1) * charW, currentY + textH + lineGap);
        currentY += vStep;
        text(String(step.newRemainder), dividendStartX + (leftPad + 1) * charW, currentY);
        leftPad++;
    }
    pop();
}

function drawDivisionSummary(x, y) {
    if (!longDivisionResult || !showingResult) return;
    const { sign, integerPart, decimalDigits, remainder: finalRemainder } = longDivisionResult;

    push();
    textAlign(LEFT, TOP);
    textSize(14);
    fill(34);

    const summaryLineHeight = 22;
    let summaryY = y;

    let decimalPartStr = decimalDigits.join('');
    let quotientDisplayStr = `${sign}${integerPart}.${decimalPartStr}`;
    if (decimalDigits.length === 0) { quotientDisplayStr = `${sign}${integerPart}`; }
    const parts = quotientDisplayStr.split('.');
    if (parts.length > 1 && parts[1].length > 5) {
        quotientDisplayStr = `${parts[0]}.${parts[1].substring(0, 5)}...`;
    }

    text(`Dividend: ${numerator}`, x, summaryY);
    summaryY += summaryLineHeight;
    text(`Divisor: ${denominator}`, x, summaryY);
    summaryY += summaryLineHeight;
    text(`Quotient: ${quotientDisplayStr}`, x, summaryY);
    summaryY += summaryLineHeight;
    text(`Remainder: ${finalRemainder}`, x, summaryY);
    pop();
}

function drawFactorAnalysisContent(x, y) {
    push();
    translate(x, y);

    fill(50);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Analysis:", 0, 0);

    textSize(14);
    const lineHeight = 20;
    let currentY = 30;

    text(`Denominator: ${denominator}`, 0, currentY);
    currentY += lineHeight;

    if (factors.length > 0) {
        text(`Prime factors:`, 0, currentY);
        currentY += lineHeight;

        let factorText = factors.join(" × ");
        text(factorText, 0, currentY);
        currentY += 30;

        let hasOnly2And5 = factors.every((f) => f === 2 || f === 5);

        if (hasOnly2And5) {
            fill(0, 150, 0);
            text("✓ Only factors 2 and/or 5", 0, currentY);
            currentY += lineHeight;
            text("→ Terminating decimal", 0, currentY);
        } else {
            fill(200, 100, 0);
            text("⚠ Contains other factors", 0, currentY);
            currentY += lineHeight;
            text("→ Repeating decimal", 0, currentY);
        }
        currentY += 30;

        fill(100);
        textSize(12);
        text("Denominators with only factors of", 0, currentY);
        currentY += 14;
        text("2 and 5 create terminating decimals.", 0, currentY);
    }
    pop();
    return currentY; // Return the height used by the content
}

// Draws the result box inside the analysis panel
function drawResultInsideAnalysis(x, y) {
    if (!showingResult) return;

    // --- Prepare content (mirroring displayResult) ---
    let badgeText, resultString, resultStringRepeatingPart = "", resultStringEllipsis = "...";
    let guessString = "";
    let bgColor, textColor, badgeColor, borderColor;

    if (isTerminating) {
        badgeText = `✅ Terminating Decimal`;
        resultString = `Result: ${quotient}`;
        bgColor = color('#f8f9fa');
        textColor = color('#155724');
        badgeColor = color('#d4edda');
        borderColor = color('#6c757d');
    } else {
        let decimalPart = quotient.split('.')[1] || '';
        let nonRepeating = decimalPart.substring(0, repeatingStart);
        let repeating = decimalPart.substring(repeatingStart, repeatingStart + repeatingLength);
        badgeText = `🔄 Non-Terminating Repeating Decimal`;
        resultString = `Result: ${quotient.split('.')[0]}.${nonRepeating}`;
        resultStringRepeatingPart = repeating;
        bgColor = color('#f8f9fa');
        textColor = color('#0c5460');
        badgeColor = color('#d1ecf1');
        borderColor = color('#6c757d');
    }
    
    if (challengeMode && userGuess !== null) {
        let correct = (userGuess === 'terminating' && isTerminating) || 
                     (userGuess === 'repeating' && !isTerminating);
        guessString = `Your guess: ${userGuess} - ${correct ? '🎉 Correct!' : '❌ Try again!'}`;
    }

    // --- Drawing ---
    push();
    translate(x, y);
    
    const boxWidth = 220;
    const boxHeight = guessString ? 80 : 55;
    const padding = 10;
    
    const badgeHeight = 22;
    fill(badgeColor);
    noStroke();
    const badgeWidth = textWidth(badgeText) + 15;
    rect(padding, padding, badgeWidth, badgeHeight, 15);
    
    fill(textColor);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    const badgeTextY = padding + badgeHeight / 2 + 1;
    text(badgeText, padding + 8, badgeTextY);

    textStyle(NORMAL);
    textAlign(LEFT, CENTER);
    const resultX = padding + badgeWidth + 10;

    if (isTerminating) {
        text(resultString, resultX, badgeTextY);
    } else {
        text(resultString, resultX, badgeTextY);
        let nonRepeatingWidth = textWidth(resultString);
        let repeatingWidth = textWidth(resultStringRepeatingPart);
        stroke(textColor);
        strokeWeight(1);
        line(resultX + nonRepeatingWidth, badgeTextY - 7, resultX + nonRepeatingWidth + repeatingWidth, badgeTextY - 7);
        noStroke();
        text(resultStringRepeatingPart + resultStringEllipsis, resultX + nonRepeatingWidth, badgeTextY);
    }
    
    if (guessString) {
        let guessY = padding + badgeHeight + 18;
        textAlign(LEFT, TOP);
        text(guessString, padding, guessY);
    }
    
    pop();
}

function drawNumberLine() {
  drawStyledBox(40, 350, 720, 100, color(245, 255, 245));
  push();
  translate(50, 400);
  let padding = 16;
  let lineStart = padding;
  let lineEnd = 700 - padding;
  stroke(100);
  strokeWeight(2);
  line(lineStart, 0, lineEnd, 0);
  line(lineStart, 0, lineStart + 10, -5);
  line(lineStart, 0, lineStart + 10, 5);
  line(lineEnd, 0, lineEnd - 10, -5);
  line(lineEnd, 0, lineEnd - 10, 5);
  for (let i = -10; i <= 10; i++) {
    let x = map(i, -10, 10, lineStart, lineEnd);
    stroke(100);
    strokeWeight(2);
    line(x, -5, x, 5);
    if (i > -10 && i < 10) {
      fill(100);
      noStroke();
      textSize(11);
      textAlign(CENTER, TOP);
      text(i, x, 15);
    }
  }
  for (let i = -10; i < 10; i++) {
    let x = map(i + 0.5, -10, 10, lineStart, lineEnd);
    stroke(100, 150);
    strokeWeight(1.5);
    line(x, -3, x, 3);
  }
  if (showingResult) {
    let pos = map(numberLineValue, -10, 10, lineStart, lineEnd);
    pos = constrain(pos, lineStart, lineEnd);
    let pulseSize = 12 + sin(frameCount * 0.1) * 2;
    fill(255, 0, 100);
    noStroke();
    ellipse(pos, 0, pulseSize, pulseSize);
    fill(255, 200);
    rect(pos - 30, -35, 60, 15);
    fill(255, 0, 100);
    textAlign(CENTER);
    textSize(10);
    text(numberLineValue.toFixed(6), pos, -28);
  }
  pop();
}

function drawChallengeMode() {
  if (!challengeMode || userGuess !== null) return;
  fill(0, 0, 0, 100);
  rect(0, 0, width, height);
  fill(255, 255, 200);
  stroke(200, 200, 0);
  strokeWeight(3);
  rect(200, 150, 400, 200, 12);
  fill(50);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text("🎯 Challenge Mode", 400, 180);
  textSize(14);
  text(`Will ${numerator}/${denominator} be:`, 400, 210);
  let hoverTerminating = mouseX >= 250 && mouseX <= 370 && mouseY >= 230 && mouseY <= 270;
  let hoverRepeating = mouseX >= 430 && mouseX <= 550 && mouseY >= 230 && mouseY <= 270;
  fill(hoverTerminating ? 120 : 100, 200, hoverTerminating ? 120 : 100);
  stroke(0, 150, 0);
  rect(250, 230, 120, 40, 8);
  fill(255);
  noStroke();
  text("Terminating", 310, 250);
  fill(hoverRepeating ? 120 : 100, hoverRepeating ? 170 : 150, 200);
  stroke(0, 100, 150);
  rect(430, 230, 120, 40, 8);
  fill(255);
  noStroke();
  text("Repeating", 490, 250);
  textSize(12);
  fill(50);
  text("Click your guess to continue!", 400, 300);
}

function startDivision() {
    numerator = parseInt(numeratorInput) || 1;
    denominator = parseInt(denominatorInput) || 3;
    
    if (denominator === 0) {
        alert("Denominator cannot be zero!");
        return;
    }
    
    if (challengeMode && userGuess === null) {
        return;
    }
    resetSimulation(true); 
    calculateDivision();
    analyzeFactors();
}

function computeLongDivisionSteps(numer, denom) {
  if (denom === 0) return null;
  const sign = (numer * denom < 0 && numer !== 0) ? '-' : '';
  let a = Math.abs(numer);
  let b = Math.abs(denom);
  const integerPart = Math.floor(a / b);
  let remainder = a % b;
  const steps = [];
  const decimalDigits = [];
  const remainderIndex = new Map();
  const maxSteps = 100;
  let stepCount = 0;
  while (remainder !== 0 && stepCount < maxSteps) {
    if (remainderIndex.has(remainder)) {
      const repeatStartIndex = remainderIndex.get(remainder);
      return {
        sign, integerPart, decimalDigits, steps,
        remainder, isRepeating: true, repeatStartIndex, isTerminating: false
      };
    }
    remainderIndex.set(remainder, decimalDigits.length);
    let partialDividend = remainder * 10;
    const digit = Math.floor(partialDividend / b);
    const subtracted = digit * b;
    const newRemainder = partialDividend % b;
    steps.push({ partialDividend, digit, subtracted, newRemainder });
    decimalDigits.push(digit);
    remainder = newRemainder;
    stepCount++;
  }
  return { sign, integerPart, decimalDigits, steps, remainder: 0, isRepeating: false, isTerminating: true };
}

function calculateDivision() {
  divisionSteps = [];
  remainders = [];
  isTerminating = false;
  repeatingStart = -1;
  repeatingLength = 0;
  quotient = "";
  longDivisionResult = computeLongDivisionSteps(numerator, denominator);
  if (!longDivisionResult) return;
  isTerminating = longDivisionResult.isTerminating;
  if (longDivisionResult.isRepeating) {
    repeatingStart = longDivisionResult.repeatStartIndex;
    repeatingLength = longDivisionResult.decimalDigits.length - repeatingStart;
  }
  let decimalPartStr = longDivisionResult.decimalDigits.join('');
  quotient = `${longDivisionResult.sign}${longDivisionResult.integerPart}.${decimalPartStr}`;
  if (longDivisionResult.decimalDigits.length === 0) {
    quotient = `${longDivisionResult.sign}${longDivisionResult.integerPart}`;
  }
  numberLineValue = parseFloat(quotient);
  divisionSteps = longDivisionResult.steps.map(step => ({
    dividend: step.partialDividend,
    quotientDigit: step.digit,
    remainder: step.newRemainder,
    isRepeating: false,
  }));
  if (longDivisionResult.steps.length === 0 && longDivisionResult.isTerminating) {
    divisionSteps.push({});
  }
}

function analyzeFactors() {
    factors = [];
    let temp = Math.abs(denominator);
    if (temp === 0) return;
    if (temp === 1) {
        factors.push(1);
        return;
    }
    while (temp % 2 === 0) {
        factors.push(2);
        temp /= 2;
    }
    while (temp % 5 === 0) {
        factors.push(5);
        temp /= 5;
    }
    for (let i = 3; i <= Math.sqrt(temp); i += 2) {
        while (temp % i === 0) {
            factors.push(i);
            temp /= i;
        }
    }
    if (temp > 2) {
        factors.push(temp);
    }
}

function displayResult() {
    let resultText = "";
    if (isTerminating) {
        resultText += `<strong>Result:</strong> ${quotient}`;
    } else {
        let decimalPart = quotient.split('.')[1] || '';
        let nonRepeating = decimalPart.substring(0, repeatingStart);
        let repeating = decimalPart.substring(repeatingStart, repeatingStart + repeatingLength);
        resultText += `<strong>Result:</strong> ${quotient.split('.')[0]}.${nonRepeating}<span style="text-decoration: overline;">${repeating}</span>...`;
    }
    if (challengeMode && userGuess !== null) {
        let correct = (userGuess === 'terminating' && isTerminating) || 
                     (userGuess === 'repeating' && !isTerminating);
        resultText += `<br><br><strong>Your guess:</strong> ${userGuess} - ${correct ? '🎉 Correct!' : '❌ Try again!'}`;
    }
}

function generateRandom() {
    numerator = Math.floor(Math.random() * 9) + 1;
    denominator = Math.floor(Math.random() * 9) + 1;
    
    numeratorInput = numerator.toString();
    denominatorInput = denominator.toString();
    
    resetSimulation();
}

function toggleChallenge() {
    challengeMode = !challengeMode;
    resetSimulation(); 

    if (challengeMode) {
        if (!numeratorInput || !denominatorInput || parseInt(denominatorInput) === 0) {
            generateRandom(); 
        } else {
            numerator = parseInt(numeratorInput);
            denominator = parseInt(denominatorInput);
        }
        
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel) {
            infoPanel.innerHTML = 
                '<div class="challenge-mode"><strong>🎯 Challenge Mode Active!</strong> Guess if the fraction will create a terminating or repeating decimal before converting!</div>';
        }
    } else {
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel) {
            infoPanel.innerHTML = 
                '<strong>Instructions:</strong> Enter a fraction and click "Convert to Decimal" to see the long division process animated step by step!';
        }
    }
}

function resetSimulation(keepGuess = false) {
    currentStep = 0;
    divisionSteps = [];
    animationTimer = 0;
    quotient = "";
    remainders = [];
    isTerminating = false;
    repeatingStart = -1;
    repeatingLength = 0;
    numberLineValue = 0;
    showingResult = false;
    if (!keepGuess) {
        userGuess = null;
    }
    factors = [];
    longDivisionResult = null;
}

window.onload = function() {
    resetSimulation();
};