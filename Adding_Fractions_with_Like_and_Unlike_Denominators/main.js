class FractionProblem {
  constructor() {
    this.hintText = '';
    this.generate();
  }
  generate() {
    const possibleDenominators = [2, 3, 4, 5];
    let d1, d2, n1, n2;

    do {
      d1 = possibleDenominators[Math.floor(Math.random() * possibleDenominators.length)];
      n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
      d2 = possibleDenominators[Math.floor(Math.random() * possibleDenominators.length)];
      n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
    } while (
      n1 === d1 ||                 // avoid whole numbers
      n2 === d2 ||                 // avoid whole numbers
      d1 * d2 >= 15                // product of denominators must be < 15
    );

    this.frac1 = math.fraction(n1, d1);
    this.frac2 = math.fraction(n2, d2);
    this.answer = math.add(this.frac1, this.frac2);
    this.maxDen = 15;
    this.commonDen = math.lcm(this.frac1.d, this.frac2.d);
    this.userDen = this.commonDen;
    this.userNum = 0;
    this.remainingTries = 3; // Initialize to 3
    this.state = 'chooseDen';
    console.log(`d1: ${d1}, d2: ${d2}, commonDen: ${this.commonDen}`); // Debug LCM
  }
  getFrac1ToDen(den) {
    const mul = den / this.frac1.d;
    const factor = Math.round(mul);
    const newNumerator = this.frac1.n * factor;
    return { n: newNumerator, d: den };
  }
  getFrac2ToDen(den) {
    const mul = den / this.frac2.d;
    const factor = Math.round(mul);
    const newNumerator = this.frac2.n * factor;
    return { n: newNumerator, d: den };
  }
  getAnswerToDen(den) {
    const mul = den / this.answer.d;
    const factor = Math.round(mul);
    const newNumerator = this.answer.n * factor;
    return { n: newNumerator, d: den };
  }
  getMixedAnswer() {
    let n = this.answer.n, d = this.answer.d;
    let whole = Math.floor(n / d);
    let rem = n % d;
    return { whole, rem, d };
  }
  getSolutionString() {
    let f1 = this.frac1, f2 = this.frac2;
    let cd = this.commonDen;
    let f1cd = this.getFrac1ToDen(cd);
    let f2cd = this.getFrac2ToDen(cd);
    let ans = this.getAnswerToDen(cd);
    let mixed = this.getMixedAnswer();
    let mixedStr = mixed.whole > 0 ? `${mixed.whole} ${mixed.rem}/${mixed.d}` : `${mixed.rem}/${mixed.d}`;
    return `${f1.n}/${f1.d} + ${f2.n}/${f2.d} = ${f1cd.n}/${cd} + ${f2cd.n}/${cd} = ${ans.n}/${cd} `;
  }
}

let model = new FractionProblem();
let dragX, dragging = false, checkBtn, nextBtn, hintDiv, solutionDiv;
let denominatorSlider = document.getElementById('denominatorSlider');
let denominatorValue = document.getElementById('denominatorValue');
let animationValue = 0;
let animationSliderX = 420;
let animationSliderY = 280; // Shifted down from 260 to 280
let animationSliderW = 200;
let animationSliderDragging = false;
const CANVAS_W = 750, CANVAS_H = 500, LINE_Y = 100; // Shifted LINE_Y from 80 to 100
let userInteracted = false;
let clickStage = 0;
model.hasTouched = false;

function setup() {
  let cnv = createCanvas(CANVAS_W, CANVAS_H);
  cnv.parent('canvas-holder');

  denominatorSlider = document.getElementById('denominatorSlider');
  denominatorValue = document.getElementById('denominatorValue');

  model.userDen = 2;
  denominatorSlider.value = 2;
  denominatorValue.textContent = 2;

  denominatorSlider.oninput = onSliderChange;

  checkBtn = select('#checkBtn');
  nextBtn = select('#nextBtn');
  hintDiv = select('#hint');
  solutionDiv = select('#solutionDiv');
  checkBtn.mousePressed(onCheck);
  nextBtn.mousePressed(onNext);

  updateCheckButtonText();
  dragX = getXForValue(0);
  model.userNum = 0;
  nextBtn.hide();
  solutionDiv.html('');
  userInteracted = false;
  clickStage = 0;

  logCorrectAnswer();
}

function logCorrectAnswer() {
  let answer = model.answer;
  let mixed = model.getMixedAnswer();
  let answerStr = mixed.whole > 0 ? `${mixed.whole} ${mixed.rem}/${mixed.d}` : `${answer.n}/${answer.d}`;
  console.log(`Problem: ${model.frac1.n}/${model.frac1.d} + ${model.frac2.n}/${model.frac2.d}`);
  console.log(`Correct Answer: ${answerStr}`);
}

function updateCheckButtonText() {
  checkBtn.html(model.remainingTries > 0 ? `Check (${model.remainingTries})` : `Check`);
}

function draw() {
  background(255);
  drawNumberLine();
  drawmessage();
  drawProblemText();

  if (["chooseDen", "drag", "wrongDen", "wrongNum", "check2", "check3"].includes(model.state)) {
    drawDragPoint();
  }

  if (model.state === "check3") {
    if (model.userDen === model.commonDen) {
      drawAnimationSlider();
      if (animationValue > 0) {
        drawAnimatedFractionBoxes(animationValue / 100);
      } else {
        drawFractionBoxesForCheck2();
      }
    } else {
      drawUncoloredFractionBoxes();
    }
    drawHintMessage();
  }

  if (model.state === "check2" || model.state === "wrongDen" || model.state === "wrongNum") {
    drawAnimationSlider();
    if (animationValue > 0) {
      drawAnimatedFractionBoxes(animationValue / 100);
    } else {
      drawFractionBoxesForCheck2();
    }
    drawHintMessage();
  }

  if (model.state === 'showSolution') {
    drawAnimationSlider();
    if (animationValue > 0) {
      drawAnimatedFractionBoxes(animationValue / 100);
    } else {
      drawFractionBoxesForCheck2();
    }
    drawHintMessage();
    drawSolutionText();
  }

  if (model.state === 'correct') {
    drawCorrectFeedback();
  }
}

function drawFraction(x, y, num, den, textSizeVal = 16, align = 'center') {
  push();
  textSize(textSizeVal);
  textAlign(align === 'center' ? CENTER : LEFT, CENTER);
  fill(0);
  noStroke();
  
  // Draw numerator
  text(num, x, y - textSizeVal * 0.6);
  
  // Draw denominator
  text(den, x, y + textSizeVal * 0.6);
  
  // Draw fraction line
  let textWidthNum = textWidth(num.toString());
  let textWidthDen = textWidth(den.toString());
  let lineWidth = Math.max(textWidthNum, textWidthDen) * 1.2;
  stroke(0);
  strokeWeight(1);
  line(x - (align === 'center' ? lineWidth / 2 : 0), y, x + (align === 'center' ? lineWidth / 2 : lineWidth), y);
  pop();
}

function drawProblemText() {
  let f1 = model.frac1, f2 = model.frac2;
  console.log("Drawing problem text:", `${f1.n}/${f1.d} + ${f2.n}/${f2.d}`);
  textSize(20);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  fill(0);
  noStroke();
  text('Evaluate', CANVAS_W / 2 - 60, 0);
  
  // Draw first fraction
  drawFraction(CANVAS_W / 2, 20, f1.n, f1.d, 20);
  
  // Draw plus sign
  text('+', CANVAS_W / 2 + 30, 20);
  
  // Draw second fraction
  drawFraction(CANVAS_W / 2 + 60, 20, f2.n, f2.d, 20);
  textStyle(NORMAL);
}

function drawSolutionText() {
  let f1 = model.frac1, f2 = model.frac2;
  let cd = model.commonDen;
  let f1cd = model.getFrac1ToDen(cd);
  let f2cd = model.getFrac2ToDen(cd);
  let ans = model.getAnswerToDen(cd);
  
  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  text('Solution:', 420, LINE_Y + 60);
  textStyle(NORMAL);
  
  // Draw solution fractions
  let x = 350;
  drawFraction(x + 20, LINE_Y + 100, f1.n, f1.d, 16, 'left');
  text('+', x + 60, LINE_Y + 100);
  drawFraction(x + 100, LINE_Y + 100, f2.n, f2.d, 16, 'left');
  text('=', x + 140, LINE_Y + 100);
  drawFraction(x + 180, LINE_Y + 100, f1cd.n, cd, 16, 'left');
  text('+', x + 220, LINE_Y + 100);
  drawFraction(x + 260, LINE_Y + 100, f2cd.n, cd, 16, 'left');
  text('=', x + 300, LINE_Y + 100);
  drawFraction(x + 340, LINE_Y + 100, ans.n, cd, 16, 'left');
}

let bounceOffset = 0;
let bounceDirection = 1;

function drawmessage() {
  if (model.hasTouched) return;

  bounceOffset += bounceDirection * 0.5;
  if (bounceOffset > 5 || bounceOffset < -5) {
    bounceDirection *= -1;
  }

  fill(77, 77, 255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  const msgX = CANVAS_W / 2 - 260;
  const msgY = LINE_Y + 60 + bounceOffset;

  text('↑\nSet the point to sum:', msgX, msgY);
  textStyle(NORMAL);
}

function drawNumberLine() {
  stroke(0);
  strokeWeight(1.5);
  line(50, LINE_Y, CANVAS_W - 50, LINE_Y);
  let x0 = 50, x2 = CANVAS_W - 50;
  for (let i = 0; i <= 2; i++) {
    let x = map(i, 0, 2, x0, x2);
    stroke(0);
    strokeWeight(1.5);
    line(x, LINE_Y - 15, x, LINE_Y + 15);
    noStroke();
    fill(80);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text(i, x, LINE_Y + 35);
  }

  let den = model.userDen;
  for (let i = 1; i < den * 2; i++) {
    let val = i / den;
    if (Number.isInteger(val) || val >= 2) continue;

    let x = getXForValue(val);
    stroke(180);
    strokeWeight(0.75);
    line(x, LINE_Y - 10, x, LINE_Y + 10);
  }

  let val = model.userNum / model.userDen;
  let x = getXForValue(val);
  fill(77, 77, 255);
  textSize(16);
  textAlign(CENTER, TOP);

  // Modified section to handle numerator = 0
  if (model.userNum === 0) {
    text('0', x, LINE_Y - 45);
  } else {
    let whole = Math.floor(val);
    let num = model.userNum % model.userDen;
    if (whole > 0 && num > 0) {
      text(whole, x - 20, LINE_Y - 45);
      drawFraction(x + 20, LINE_Y - 35, num, model.userDen, 16);
    } else if (whole > 0 && num === 0) {
      text(whole, x, LINE_Y - 45);
    } else {
      drawFraction(x, LINE_Y - 35, model.userNum, model.userDen, 16);
    }
  }
}

function drawDragPoint() {
  let den = model.userDen;
  let val = model.userNum / den;
  let x = dragX;
  fill('#6c63ff');
  stroke(0);
  strokeWeight(0.8);
  ellipse(x, LINE_Y, 12, 12);
}

function drawUncoloredFractionBoxes() {
  let d1 = model.frac1.d;
  let d2 = model.frac2.d;
  let boxSize = 80;
  let box1X = 120;
  let box2X = 280;
  let boxY = LINE_Y + 180;

  let rows = d2, cols = d1;
  if (d1 === d2) {
    rows = 1;
    cols = d1;
  }

  drawFractionBox(box1X, boxY, d1 * d2, 0, 'grid', '#6c63ff', boxSize, rows, cols);

  fill(0);
  noStroke();
  textSize(24);
  textAlign(CENTER, CENTER);
  text('+', (box1X + box2X) / 2, boxY);

  drawFractionBox(box2X, boxY, d1 * d2, 0, 'grid', '#e75480', boxSize, rows, cols);
}

function drawFractionBoxesForCheck2() {
  let d1 = model.frac1.d, n1 = model.frac1.n;
  let d2 = model.frac2.d, n2 = model.frac2.n;
  let boxSize = 80;
  let box1X = 120;
  let box2X = 280;
  let boxY = LINE_Y + 180;

  let commonDen = model.commonDen; // LCM of d1 and d2
  let f1 = model.getFrac1ToDen(commonDen);
  let f2 = model.getFrac2ToDen(commonDen);

  if (d1 === d2) {
    // Use the common denominator for both boxes
    drawFractionBox(box1X, boxY, commonDen, f1.n, 'v', '#6c63ff', boxSize);
    drawFractionBox(box2X, boxY, commonDen, f2.n, 'v', '#e75480', boxSize);
  } else {
    // Use original denominators for unequal cases
    drawFractionBox(box1X, boxY, d1, n1, 'v', '#6c63ff', boxSize);
    drawFractionBox(box2X, boxY, d2, n2, 'h', '#e75480', boxSize);
  }

  fill(0);
  noStroke();
  textSize(24);
  textAlign(CENTER, CENTER);
  text('+', (box1X + box2X) / 2, boxY);
}

function drawAnimatedFractionBoxes(animValue) {
  const d1 = model.frac1.d;
  const d2 = model.frac2.d;
  const n1 = model.frac1.n;
  const n2 = model.frac2.n;
  const cd = math.lcm(d1, d2);

  let boxSize = 80;
  let box1X = 120;
  let box2X = 280;
  let boxY = LINE_Y + 180;

  let rows = d2, cols = d1;
  if (d1 === d2) {
    rows = 1;
    cols = d1;
  }

  let f1 = model.getFrac1ToDen(cd);
  let f2 = model.getFrac2ToDen(cd);

  let cellWidth = boxSize / cols;
  let cellHeight = boxSize / rows;

  let blueCount = f1.n;
  let pinkCount = f2.n;
  let total = blueCount + pinkCount;

  let blueCellPositions = [];
  let blueCellsFilled = 0;
  if (d1 === d2) {
    for (let col = 0; col < f1.n; col++) {
      let x = box1X - boxSize / 2 + col * cellWidth;
      let y = boxY - boxSize / 2;
      blueCellPositions.push({ x: x + cellWidth / 2, y: y + cellHeight / 2, origX: x, origY: y });
      blueCellsFilled++;
    }
  } else {
    let blueColumnsToFill = Math.ceil(f1.n / rows);
    for (let col = 0; col < blueColumnsToFill && blueCellsFilled < f1.n; col++) {
      for (let row = 0; row < rows && blueCellsFilled < f1.n; row++) {
        let x = box1X - boxSize / 2 + col * cellWidth;
        let y = boxY - boxSize / 2 + row * cellHeight;
        blueCellPositions.push({ x: x + cellWidth / 2, y: y + cellHeight / 2, origX: x, origY: y });
        blueCellsFilled++;
      }
    }
  }

  let pinkCellPositions = [];
  let pinkCellsFilled = 0;
  if (d1 === d2) {
    for (let col = 0; col < f2.n; col++) {
      let x = box2X - boxSize / 2 + col * cellWidth;
      let y = boxY - boxSize / 2;
      pinkCellPositions.push({ x: x + cellWidth / 2, y: y + cellHeight / 2, origX: x, origY: y });
      pinkCellsFilled++;
    }
  } else {
    let pinkRowsToFill = Math.ceil(f2.n / cols);
    for (let row = 0; row < pinkRowsToFill && pinkCellsFilled < f2.n; row++) {
      for (let col = 0; col < cols && pinkCellsFilled < f2.n; col++) {
        let x = box2X - boxSize / 2 + col * cellWidth;
        let y = boxY - boxSize / 2 + row * cellHeight;
        pinkCellPositions.push({ x: x + cellWidth / 2, y: y + cellHeight / 2, origX: x, origY: y });
        pinkCellsFilled++;
      }
    }
  }

  let allCellPositions = blueCellPositions.concat(pinkCellPositions);

  if (animValue <= 0.5) {
    let stageProgress = animValue / 0.5;
    let fill1 = animValue > 0 ? f1.n : n1;
    let fill2 = animValue > 0 ? f2.n : n2;

    if (animValue === 0) {
      drawFractionBoxesForCheck2();
    } else {
      drawFractionBox(box1X, boxY, cd, 0, 'grid', '#ffffff', boxSize, rows, cols);
      drawFractionBox(box2X, boxY, cd, 0, 'grid', '#ffffff', boxSize, rows, cols);

      let blueCellsFilled = 0;
      if (d1 === d2) {
        for (let col = 0; col < fill1; col++) {
          let x = box1X - boxSize / 2 + col * cellWidth;
          let y = boxY - boxSize / 2;
          fill('#6c63ff');
          stroke(0);
          strokeWeight(1);
          rect(x, y, cellWidth, cellHeight, 5);
          blueCellsFilled++;
        }
      } else {
        let blueColumnsToFill = Math.ceil(fill1 / rows);
        for (let col = 0; col < blueColumnsToFill && blueCellsFilled < fill1; col++) {
          for (let row = 0; row < rows && blueCellsFilled < fill1; row++) {
            let x = box1X - boxSize / 2 + col * cellWidth;
            let y = boxY - boxSize / 2 + row * cellHeight;
            fill('#6c63ff');
            stroke(0);
            strokeWeight(1);
            rect(x, y, cellWidth, cellHeight, 5);
            blueCellsFilled++;
          }
        }
      }

      let pinkCellsFilled = 0;
      if (d1 === d2) {
        for (let col = 0; col < fill2; col++) {
          let x = box2X - boxSize / 2 + col * cellWidth;
          let y = boxY - boxSize / 2;
          fill('#e75480');
          stroke(0);
          strokeWeight(1);
          rect(x, y, cellWidth, cellHeight, 5);
          pinkCellsFilled++;
        }
      } else {
        let pinkRowsToFill = Math.ceil(f2.n / cols);
        for (let row = 0; row < pinkRowsToFill && pinkCellsFilled < f2.n; row++) {
          for (let col = 0; col < cols && pinkCellsFilled < f2.n; col++) {
            let x = box2X - boxSize / 2 + col * cellWidth;
            let y = boxY - boxSize / 2 + row * cellHeight;
            fill('#e75480');
            stroke(0);
            strokeWeight(1);
            rect(x, y, cellWidth, cellHeight, 5);
            pinkCellsFilled++;
          }
        }
      }

      fill(0);
      noStroke();
      textSize(24);
      textAlign(CENTER, CENTER);
      text('+', (box1X + box2X) / 2, boxY);
    }
  } else {
    let stageProgress = (animValue - 0.5) / 0.5;

    drawFractionBox(box1X, boxY, cd, 0, 'grid', '#ffffff', boxSize, rows, cols);
    drawFractionBox(box2X, boxY, cd, 0, 'grid', '#ffffff', boxSize, rows, cols);

    fill(0);
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text('+', (box1X + box2X) / 2, boxY);

    let targetY = LINE_Y + 290; // Adjusted from LINE_Y + 270 to LINE_Y + 290
    let cellSize = 25;
    let totalWidth = total * (cellSize + 5);
    let startX = CANVAS_W / 2 + 10 - totalWidth / 2 + 10;
    let step = cellSize + 5;

    let cellAnimDuration = 0.15;
    let delayBetweenCells = 0.05;

    for (let i = 0; i < total && i < allCellPositions.length; i++) {
      let cellStartTime = i * delayBetweenCells;
      let cellProgress = 0;
      if (stageProgress >= cellStartTime) {
        cellProgress = (stageProgress - cellStartTime) / cellAnimDuration;
        cellProgress = Math.max(0, Math.min(1, cellProgress));
      }

      const srcX = allCellPositions[i].x;
      const srcY = allCellPositions[i].y;
      const color = i < blueCount ? '#6c63ff' : '#e75480';

      if (cellProgress === 0) {
        let origX = allCellPositions[i].origX;
        let origY = allCellPositions[i].origY;
        fill(color);
        stroke(0);
        strokeWeight(1);
        rect(origX, origY, cellWidth, cellHeight, 5);
      } else {
        const destX = startX + i * step + cellSize / 2;
        const destY = targetY;
        let easedProgress = cellProgress * cellProgress * (3 - 2 * cellProgress);
        const interpX = lerp(srcX, destX, easedProgress);
        const interpY = lerp(srcY, destY, easedProgress);
        fill(color);
        stroke(0);
        strokeWeight(1);
        rect(interpX - cellSize / 2, interpY - cellSize / 2, cellSize, cellSize, 5);
      }
    }
  }
}

function drawHintMessage() {
  if (model.hintText) {
    fill('#ff8c00');
    noStroke();
    textSize(16);
    textAlign(LEFT, CENTER);
    let lines = model.hintText.split('\n');
    let hintX = 420;
    let hintY = LINE_Y + 140;

    textStyle(BOLD);
    text(lines[0], hintX, hintY);
    if (lines[1]) {
      textStyle(NORMAL);
      text(lines[1], hintX, hintY + 20);
    }
  }
}

function drawAnimationSlider() {
  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Slide to animate', animationSliderX, animationSliderY + 40);

  stroke(200);
  strokeWeight(4);
  line(animationSliderX, animationSliderY + 60, animationSliderX + animationSliderW, animationSliderY + 60);

  let handleX = map(animationValue, 0, 100, animationSliderX, animationSliderX + animationSliderW);
  fill('#6c63ff');
  stroke(0);
  strokeWeight(2);
  ellipse(handleX, animationSliderY + 60, 16, 16);
}

function drawCorrectFeedback() {
  let yPosition = LINE_Y + 70;
  let xPosition = CANVAS_W / 2;
  fill('green');
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text('✔', xPosition - 30, yPosition);
  text('Correct!', xPosition + 10, yPosition);
}

function mousePressed() {
  if (!model.hasTouched) {
    model.hasTouched = true;
  }

  let val = model.userNum / model.userDen;
  let x = getXForValue(val);
  if (dist(mouseX, mouseY, x, LINE_Y) < 8) {
    dragging = true;
    return;
  }

  let handleX = map(animationValue, 0, 100, animationSliderX, animationSliderX + animationSliderW);
  if (dist(mouseX, mouseY, handleX, animationSliderY + 60) < 10) {
    animationSliderDragging = true;
  }
}

function mouseDragged() {
  if (dragging) {
    let val = constrain((mouseX - 50) / (CANVAS_W - 100) * 2, 0, 2);
    let tickNum = Math.round(val * model.userDen);
    val = tickNum / model.userDen;
    val = constrain(val, 0, 2);
    dragX = getXForValue(val);
    model.userNum = Math.round(val * model.userDen);
    userInteracted = true;
  }

  if (animationSliderDragging) {
    let newValue = map(mouseX, animationSliderX, animationSliderX + animationSliderW, 0, 100);
    animationValue = constrain(newValue, 0, 100);
  }
}

function mouseReleased() {
  dragging = false;
  animationSliderDragging = false;
}

function getXForValue(val) {
  return map(val, 0, 2, 50, CANVAS_W - 50);
}

function onSliderChange() {
  model.userDen = parseInt(denominatorSlider.value);
  denominatorValue.textContent = model.userDen;
  model.userNum = 0;
  dragX = getXForValue(0);
  hintDiv.html('');
}

function onCheck() {
  if (clickStage === 0) {
    model.state = "check3";
    clickStage = 1;
    model.hintText = 'Hint\nAdjust the denominator to find a common one.';
    animationValue = 0;
    model.remainingTries = 2;
    updateCheckButtonText();
    hintDiv.html('');
    return;
  }

  if (clickStage === 1) {
    model.state = "check2";
    clickStage = 2;
    model.hintText = 'Hint\nSlide to animate the fractions combining.';
    animationValue = 0;
    model.remainingTries = 1;
    updateCheckButtonText();
    hintDiv.html('');
    return;
  }

  if (clickStage >= 2) {
    if (model.userDen !== model.commonDen) {
      model.state = 'wrongDen';
      model.hintText = 'Hint\nCheck your denominator.';
      model.remainingTries = 0;
    } else if (model.userNum !== model.getAnswerToDen(model.userDen).n) {
      model.state = 'wrongNum';
      model.hintText = 'Hint\nCheck your numerator.';
      model.remainingTries = 0;
    } else {
      model.state = 'correct';
      model.hintText = '';
      nextBtn.show();
      return;
    }

    updateCheckButtonText();
    showSolution();
  }
}

function showSolution() {
  model.state = 'showSolution';
  model.hintText = 'Maybe next time!';
  solutionDiv.html('');
  nextBtn.show();
  checkBtn.attribute('disabled', '');
}

function onNext() {
  model.generate();
  model.userDen = 2;
  denominatorSlider.value = 2;
  denominatorValue.textContent = 2;
  model.state = 'chooseDen';
  model.hintText = '';

  model.remainingTries = 3;
  updateCheckButtonText();
  nextBtn.hide();
  checkBtn.removeAttribute('disabled');
  hintDiv.html('');
  solutionDiv.html('');
  dragX = getXForValue(0);
  model.userNum = 0;
  userInteracted = false;
  animationValue = 0;
  clickStage = 0;
  logCorrectAnswer();
}

function drawFractionBox(x, y, d, n, dir, color, size = 40, rows = null, cols = null) {
  stroke(0);
  strokeWeight(2);
  noFill();
  rect(x - size / 2, y - size / 2, size, size, 5);

  if (dir === 'grid') {
    let cellWidth = size / cols;
    let cellHeight = size / rows;

    for (let i = 1; i < cols; i++) {
      stroke(100);
      strokeWeight(1);
      line(x - size / 2 + i * cellWidth, y - size / 2, x - size / 2 + i * cellWidth, y + size / 2);
    }
    for (let j = 1; j < rows; j++) {
      stroke(100);
      strokeWeight(1);
      line(x - size / 2, y - size / 2 + j * cellHeight, x + size / 2, y - size / 2 + j * cellHeight);
    }

    noStroke();
    fill(color);
    for (let i = 0; i < n; i++) {
      let row = Math.floor(i / cols);
      let col = i % cols;
      rect(
        x - size / 2 + col * cellWidth,
        y - size / 2 + row * cellHeight,
        cellWidth,
        cellHeight,
        col === 0 ? 5 : 0,
        col === cols - 1 ? 5 : 0,
        row === rows - 1 ? 5 : 0,
        row === 0 ? 5 : 0
      );
    }
  } else {
    for (let i = 1; i < d; i++) {
      stroke(100);
      strokeWeight(1);
      if (dir === 'v') {
        line(x - size / 2 + i * size / d, y - size / 2, x - size / 2 + i * size / d, y + size / 2);
      } else {
        line(x - size / 2, y - size / 2 + i * size / d, x + size / 2, y - size / 2 + i * size / d);
      }
    }

    noStroke();
    fill(color);
    for (let i = 0; i < n; i++) {
      if (dir === 'v') {
        rect(
          x - size / 2 + i * size / d,
          y - size / 2,
          size / d,
          size,
          i === 0 ? 5 : 0,
          i === d - 1 ? 5 : 0,
          i === d - 1 ? 5 : 0,
          i === 0 ? 5 : 0
        );
      } else {
        rect(
          x - size / 2,
          y - size / 2 + i * size / d,
          size,
          size / d,
          i === 0 ? 5 : 0,
          i === 0 ? 5 : 0,
          i === d - 1 ? 5 : 0,
          i === d - 1 ? 5 : 0
        );
      }
    }
  }
}