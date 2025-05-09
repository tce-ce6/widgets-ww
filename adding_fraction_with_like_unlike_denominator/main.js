// MVC Pattern

// --- Model ---
class FractionProblem {
  constructor() {
    this.generate();
  }
  generate() {
    let possibleDenominators = [1,2,3,4];
    let d1 = possibleDenominators[Math.floor(Math.random() * possibleDenominators.length)];
    let d2 = possibleDenominators[Math.floor(Math.random() * possibleDenominators.length)];
    
    do {
      d2 = possibleDenominators[Math.floor(Math.random() * possibleDenominators.length)];
    } while (d1 === 4 && d2 === 4);

    let n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
    let n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
    this.frac1 = math.fraction(n1, d1);
    this.frac2 = math.fraction(n2, d2);
    this.answer = math.add(this.frac1, this.frac2);
    this.maxDen = 15;
    this.commonDen = math.lcm(this.frac1.d, this.frac2.d);
    this.userDen = this.commonDen; // Start with common denominator
    this.userNum = 0;
    this.tries = 0;
    this.state = 'chooseDen';
    this.animationStep = 1;
    this.animationProgress = 0; // For smooth transitions
  }
  getFrac1ToDen(den) {
    const mul = den / this.frac1.d;
    if (!Number.isInteger(mul)) {
      return { n: NaN, d: den };
    }
    return math.fraction(this.frac1.n * mul, den);
  }
  getFrac2ToDen(den) {
    const mul = den / this.frac2.d;
    if (!Number.isInteger(mul)) {
      return { n: NaN, d: den };
    }
    return math.fraction(this.frac2.n * mul, den);
  }
  getAnswerToDen(den) {
    const mul = den / this.answer.d;
    if (!Number.isInteger(mul)) {
      return { n: NaN, d: den };
    }
    return math.fraction(this.answer.n * mul, den);
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
    return `${f1.n}/${f1.d} + ${f2.n}/${f2.d} = ${f1cd.n}/${cd} + ${f2cd.n}/${cd} = ${ans.n}/${cd} = ${mixedStr}`;
  }
}

// --- View & Controller ---
let model = new FractionProblem();
let dragX, dragging = false, checkBtn, nextBtn, hintDiv, problemDiv, solutionDiv;
let denominatorSlider, denominatorValue, animationSlider, animationValue;
const CANVAS_W = 700, CANVAS_H = 400, LINE_Y = 80; // Increased canvas height
let userInteracted = false;

function setup() {
  let cnv = createCanvas(CANVAS_W, CANVAS_H);
  cnv.parent('canvas-holder');

  denominatorSlider = document.getElementById('denominatorSlider');
  denominatorValue = document.getElementById('denominatorValue');
  animationSlider = document.getElementById('animationSlider');
  animationValue = document.getElementById('animationValue');

  // Set initial denominator
  model.userDen = 2;
  denominatorSlider.value = 2;
  denominatorValue.textContent = 2;
  animationSlider.value = 1;
  animationValue.textContent = 1;
  animationSlider.max = 1;

  denominatorSlider.oninput = onSliderChange;
  animationSlider.oninput = onAnimationSliderChange;

  checkBtn = select('#checkBtn');
  nextBtn = select('#nextBtn');
  hintDiv = select('#hint');
  problemDiv = select('#problem');
  solutionDiv = select('#solutionDiv');
  checkBtn.mousePressed(onCheck);
  nextBtn.mousePressed(onNext);

  updateProblemText();
  updateSliders();
  dragX = getXForValue(0);
  model.userNum = 0;
  nextBtn.hide();
  solutionDiv.html('');
  userInteracted = false;
  checkBtn.attribute('disabled', '');
}

function draw() {
  background(255);
  drawNumberLine();
  if (model.state === 'chooseDen' || model.state === 'drag') {
    drawDragPoint();
  }
  if (model.state === 'wrongDen') {
    drawEmptyAnimation();
  }
  if (model.state === 'wrongNum') {
    drawFractionAnimation();
  }
  if (model.state === 'showSolution' || model.state === 'correct') {
    drawFractionAnimation(true);
  }
}

function drawNumberLine() {
  stroke(0);
  strokeWeight(2);
  line(50, LINE_Y, CANVAS_W - 50, LINE_Y);

  // Draw main ticks (0, 1, 2)
  let x0 = 50, x1 = CANVAS_W / 2 , x2 = CANVAS_W - 50;
  for (let i = 0; i <= 2; i++) {
    let x = map(i, 0, 2, x0, x2);
    line(x, LINE_Y - 15, x, LINE_Y + 15);
    noStroke();
    fill(i === 1 && model.state === 'showSolution' ? 'green' : 80);
    textSize(20); // Increased font size
    textAlign(CENTER, BOTTOM);
    text(i, x, LINE_Y + 35);
  }

  // Draw denominator ticks (no labels)
  let den = model.userDen;
  for (let i = 1; i < den * 2; i++) {
    let val = i / den;
    if (val >= 2) break;
    let x = getXForValue(val);
    stroke(180);
    strokeWeight(i % den === 0 ? 2 : 1);
    line(x, LINE_Y - 10, x, LINE_Y + 10);
  }

  // Show number at drag point or correct answer
  if (model.state === 'showSolution' || model.state === 'correct') {
    let ansFrac = model.getAnswerToDen(model.userDen);
    let val = ansFrac.n / model.userDen;
    let x = getXForValue(val);
    fill('green');
    textSize(22); // Increased font size
    textAlign(CENTER, CENTER);
    let mixed = ansFrac.n > ansFrac.d ? `${Math.floor(ansFrac.n / ansFrac.d)} ${ansFrac.n % ansFrac.d}/${ansFrac.d}` : `${ansFrac.n}/${ansFrac.d}`;
    text(mixed, x, LINE_Y - 30);
  } else {
    let val = model.userNum / model.userDen;
    let x = getXForValue(val);
    fill(40);
    textSize(22); // Increased font size
    textAlign(CENTER, CENTER);
    if (Number.isInteger(model.userNum) && Number.isInteger(model.userDen) && model.userDen !== 0) {
      let frac = math.fraction(model.userNum, model.userDen);
      let mixed = frac.n > frac.d ? `${Math.floor(frac.n / frac.d)} ${frac.n % frac.d}/${frac.d}` : `${frac.n}/${frac.d}`;
      if (model.userNum > 0) text(mixed, x, LINE_Y - 30);
    }
  }
}

function drawDragPoint() {
  let den = model.userDen;
  let val = model.userNum / den;
  let x = dragX;
  fill('#6c63ff');
  stroke(80);
  strokeWeight(2);
  ellipse(x, LINE_Y, 30, 30); // Increased size
}

function mousePressed() {
  let val = model.userNum / model.userDen;
  let x = getXForValue(val);
  if (dist(mouseX, mouseY, x, LINE_Y) < 22) {
    dragging = true;
  }
}

function mouseDragged() {
  if (dragging) {
    let val = constrain((mouseX - 50) / (CANVAS_W - 100) * 2, 0, 2);
    dragX = getXForValue(val);
    model.userNum = Math.round(val * model.userDen);
    userInteracted = true;
    checkBtn.removeAttribute('disabled');
  }
}

function mouseReleased() {
  if (dragging) {
    dragging = false;
  }
}

function getXForValue(val) {
  return map(val, 0, 2, 50, CANVAS_W - 50);
}

function onSliderChange() {
  model.userDen = parseInt(denominatorSlider.value);
  denominatorValue.textContent = model.userDen;
  model.state = 'drag';
  model.userNum = 0;
  dragX = getXForValue(0);
  hintDiv.html('');
  updateSliders();
  userInteracted = true;
  checkBtn.removeAttribute('disabled');
  redraw();
}

function onAnimationSliderChange() {
  model.animationStep = parseInt(animationSlider.value);
  model.animationProgress = model.animationStep / parseInt(animationSlider.max);
  // animationValue.textContent = model.animationStep;
  redraw();
}

function updateSliders() {
  denominatorSlider.value = model.userDen;
  denominatorValue.textContent = model.userDen;
  
  let f1 = model.getFrac1ToDen(model.userDen);
  let f2 = model.getFrac2ToDen(model.userDen);
  let maxStep = f1.n + f2.n;
  // animationSlider.max = maxStep;
  // if (model.animationStep > maxStep) model.animationStep = maxStep;
  // animationSlider.value = model.animationStep;
  // animationValue.textContent = model.animationStep;

  // Show animation slider only in wrongNum or showSolution state
  if (model.state === 'drawFractionBox' || model.state === 'showSolution') {
    animationSlider.style.display = '';
    animationValue.style.display = '';
    animationSlider.previousElementSibling.style.display = '';
  } else {
    animationSlider.style.display = 'none';
    animationValue.style.display = 'none';
    animationSlider.previousElementSibling.style.display = 'none';
  }
}

function onCheck() {
  if (!userInteracted) return;
  model.tries++;
  
  if (model.userDen !== model.commonDen) {
    model.state = 'wrongDen';
    hintDiv.html('<span style="color:#ff8c00; font-size: 18px;">Hint: Check your denominator.</span>');
    checkBtn.attribute('disabled', '');
    if (model.tries >= 3) {
      showSolution();
    }
  } else if (model.userNum !== model.getAnswerToDen(model.userDen).n) {
    model.state = 'wrongNum';
    hintDiv.html('<span style="color:#ff8c00; font-size: 18px;">Hint: Check your numerator.</span>');
    // Show animation slider for numerator hint
    animationSlider.style.display = '';
    animationValue.style.display = '';
    animationSlider.previousElementSibling.style.display = '';
    checkBtn.attribute('disabled', '');
    if (model.tries >= 3) {
      showSolution();
    }
  } else {
    model.state = 'correct';
    hintDiv.html('<span style="color:green; font-size: 20px;">Correct!</span>');
    nextBtn.show();
    checkBtn.attribute('disabled', '');
  }
  updateSliders();
  redraw();
}

function showSolution() {
  model.state = 'showSolution';
  hintDiv.html('<span style="color:#b35c00; font-size: 18px;">Maybe next time!</span>');
  solutionDiv.html('<div style="font-size: 18px; margin-top: 20px;"><b>Solution:</b><br>' + model.getSolutionString() + '</div>');
  nextBtn.show();
  checkBtn.attribute('disabled', '');
  
  // Set animation slider to final state
  let f1 = model.getFrac1ToDen(model.userDen);
  let f2 = model.getFrac2ToDen(model.userDen);
  animationSlider.value = f1.n + f2.n;
  model.animationStep = f1.n + f2.n;
  animationValue.textContent = model.animationStep;
}

function onNext() {
  model.generate();
  model.userDen = 2; // Start with 2 as denominator
  denominatorSlider.value = 2;
  denominatorValue.textContent = 2;
  model.state = 'chooseDen';
  model.tries = 0;
  nextBtn.hide();
  checkBtn.attribute('disabled', '');
  hintDiv.html('');
  solutionDiv.html('');
  updateProblemText();
  updateSliders();
  dragX = getXForValue(0);
  model.userNum = 0;
  userInteracted = false;
  redraw();
}

function updateProblemText() {
  let f1 = model.frac1, f2 = model.frac2;
  problemDiv.html(`<div style="font-size: 20px; margin-bottom: 10px;">Evaluate <b>${f1.n}/${f1.d} + ${f2.n}/${f2.d}</b></div>`);
}

// --- Enhanced Animations ---
function drawEmptyAnimation() {
  // Draw larger boxes with grid lines showing the denominator divisions
  drawFractionBox(160, 140, model.frac1.d, 0, 'v', '#6c63ff', 60); // Increased size and Y position
  drawFractionBox(240, 140, model.frac2.d, 0, 'h', '#e75480', 60); // Increased size and Y position
  
  
}

function drawFractionAnimation(showSolution = false) {
  let d1 = model.frac1.d, n1 = model.frac1.n;
  let d2 = model.frac2.d, n2 = model.frac2.n;
  let boxSize = 60; // Increased box size
  
  // Draw original fractions
  drawFractionBox(140, 140, d1, n1, 'v', '#6c63ff', boxSize);
  drawFractionBox(240, 140, d2, n2, 'h', '#e75480', boxSize);
  
  
  
  // Common denominator representations
  let den = model.userDen;
  let f1 = model.getFrac1ToDen(den);
  let f2 = model.getFrac2ToDen(den);
  
  // Calculate animation progress
  let step = showSolution ? f1.n + f2.n : model.animationStep;
  let progress = model.animationProgress;
  
  if (isNaN(f1.n)) {
    return; // Invalid denominator
  }
  
  // Draw common denominator representation
  let x = 140, y = 280, size = 35;
  let totalWidth = den * (size + 2);
  x = CANVAS_W/2 - totalWidth/2; // Center the visualization
  
  // Draw the combined fraction representation
  for (let i = 0; i < den; i++) {
    if (showSolution) {
      let ans = model.getAnswerToDen(den);
      fill(i < ans.n ? (i < f1.n ? '#6c63ff' : '#e75480') : '#fff');
    } else {
      fill(i < f1.n ? '#6c63ff' : (i < f1.n + f2.n && i < step ? '#e75480' : '#fff'));
    }
    stroke(0);
    strokeWeight(1);
    rect(x + i * (size + 2), y, size, size, 5);
  }
 
}

function drawFractionBox(x, y, d, n, dir, color, size = 40) {
  // Draw box outline
  stroke(0);
  strokeWeight(2);
  noFill();
  rect(x - size/2, y - size/2, size, size, 5);
  
  // Draw grid lines based on denominator
  for (let i = 1; i < d; i++) {
    stroke(100);
    strokeWeight(1);
    if (dir === 'v') {
      line(x - size/2 + i * size / d, y - size/2, x - size/2 + i * size / d, y + size/2);
    } else {
      line(x - size/2, y - size/2 + i * size / d, x + size/2, y - size/2 + i * size / d);
    }
  }
  
  // Fill in the fraction parts
  noStroke();
  fill(color);
  for (let i = 0; i < n; i++) {
    if (dir === 'v') {
      // Vertical divisions (left to right)
      rect(x - size/2 + i * size / d, y - size/2, size / d, size, i === 0 ? 5 : 0, i === d-1 ? 5 : 0, i === d-1 ? 5 : 0, i === 0 ? 5 : 0);
    } else {
      // Horizontal divisions (top to bottom)
      rect(x - size/2, y - size/2 + i * size / d, size, size / d, i === 0 ? 5 : 0, i === 0 ? 5 : 0, i === d-1 ? 5 : 0, i === d-1 ? 5 : 0);
    }
  }
}