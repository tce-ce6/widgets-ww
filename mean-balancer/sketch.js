let grades = [];
let points = [];
let mean = 0;
let draggingTriangle = false;
let triangleX = 0;
let triangleY = 0;
let triangleX1 = 0;
let triangleY1 = 0;
let triangleSize = 30;
let numberLineStart = 70;
let numberLineEnd = 90;
let margin = 60;
let plotButton;
let count = 10;
let canvas;
let state = 'initial'; // 'initial' or 'plotted'

function setup() {
  canvas = createCanvas(800, 350);
  canvas.parent('mainCanvas');
  plotButton = select('#plot-btn');
  plotButton.mousePressed(plotPoints);
 // plotButton.mousePressed(plotFrequencyOfPoints);

  document.getElementById("pointSlider").addEventListener("input", (e) => {
    count = parseInt(e.target.value);
    document.getElementById("point-count").textContent = count;
    document.getElementById("point-count-label").textContent = count;
    initializePoints(count);
    generateGrades();
    if (state == 'plotted') {
      plotPoints();
      drawPoints();
    }
  });
  document.getElementById("reset-btn").addEventListener("click", () => {
    const defaultCount = 10;
    count = 10;
    document.getElementById("pointSlider").value = defaultCount;
    document.getElementById("point-count").textContent = defaultCount;
    document.getElementById("point-count-label").textContent = defaultCount;
    initializePoints(defaultCount);
    state = 'initial';
    generateGrades();
    redraw();
  });

  document.getElementById("hint-btn").addEventListener("click", () => {
    document.getElementById("hint-modal").style.display = "flex";
  });

  document.getElementById("close-hint").addEventListener("click", () => {
    document.getElementById("hint-modal").style.display = "none";
  });

  // Optional: close on click outside the box
  document.getElementById("hint-modal").addEventListener("click", (e) => {
    if (e.target.id === "hint-modal") {
      document.getElementById("hint-modal").style.display = "none";
    }
  });
  initializePoints(10);
  generateGrades();
}

function generateGrades() {
  grades = [];

  let availableNumbers = [];
  for (let i = numberLineStart; i <= numberLineEnd; i++) {
    availableNumbers.push(i);
  }

  // Shuffle the available numbers
  for (let i = availableNumbers.length - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
  }

  // Pick first 'count' unique values
  grades = availableNumbers.slice(0, count);

  grades.sort((a, b) => a - b);
  let meanX = grades.reduce((a, b) => a + b, 0) / grades.length;
  mean = parseFloat(meanX.toFixed(1));
}

// function plotFrequencyOfPoints() {
//   // Move to plotted state
//   state = 'plotted';
//   frequencyPoints = [];
//   // triangleX = map(mean, numberLineStart, numberLineEnd, margin, width - margin);
//   triangleX = floor(random(100, 300) + 50);
//   triangleY = height - 60;
//   for (let i = 0; i < grades.length; i++) {
//     let x = map(grades[i], numberLineStart, numberLineEnd, margin, width - margin);
//     frequencyPoints.push({ x, y: height / 2, value: frequency[i] });
//   }
// }

function plotPoints() {
  // Move to plotted state
  state = 'plotted';
  points = [];
  // triangleX = map(mean, numberLineStart, numberLineEnd, margin, width - margin);
  triangleX = floor(random(100, 300) + 50);
  triangleY = height - 60;
  for (let i = 0; i < grades.length; i++) {
    let x = map(grades[i], numberLineStart, numberLineEnd, margin, width - margin);
    points.push({ x, y: height / 2 - 40, value: grades[i] });
  }
}

function draw() {
  background(255);
  if (state === 'initial') {
    drawNumbersAtTop();
  } else if (state === 'plotted') {
    drawNumberLine();
    drawPoints();
    drawTriangle();
    drawMeanLabel();
  }
}

function drawNumbersAtTop() {
  // Draw all numbers in a row at the top
  let spacing = width / (grades.length + 1);
  for (let i = 0; i < count; i++) {
    let x = spacing * (i + 1);
    let y = 70;
    fill('#4a40b4');
    stroke(255);
    strokeWeight(3);
    ellipse(x, y, 34, 34);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(15);
    text(grades[i], x, y);
  }
}

function drawNumberLine() {
  stroke(0);
  strokeWeight(3);
  line(margin, height / 2, width - margin, height / 2);
  for (let i = numberLineStart; i <= numberLineEnd; i += 1) {
    let x = map(i, numberLineStart, numberLineEnd, margin, width - margin);
    strokeWeight(i % 5 === 0 ? 2 : 1);
    stroke(0);
    line(x, height / 2 - 5, x, height / 2 + 5);
    // if (i % 2 === 0) {
    push();
    noStroke();
    fill(60);
    textAlign(CENTER, TOP);
    text(i, x, height / 2 + 12);
    pop();
    // }
  }
}

function drawPoints() {
  for (let pt of points) {
    fill('#4a40b4');
    stroke(255);
    strokeWeight(3);
    ellipse(pt.x, pt.y, 34, 34);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(15);
    text(pt.value, pt.x, pt.y);
  }
}

// function drawFrequency() {
//   for (let pt of frequencyPoints) {
//     fill('#4a40b4');
//     stroke(255);
//     strokeWeight(3);
//     ellipse(pt.x, pt.y, 34, 34);
//     fill(255);
//     noStroke();
//     textAlign(CENTER, CENTER);
//     textSize(15);
//     text(pt.value, pt.x, pt.y);
//     console.log(pt.value);
//   }
// }

function drawTriangle() {
  fill(draggingTriangle ? '#e75480' : '#f7b6b6');
  stroke('#e75480');
  strokeWeight(2);
  let base = triangleSize;
  let h = triangleSize * 0.9;
  triangle(triangleX, triangleY, triangleX - base / 2, triangleY + h, triangleX + base / 2, triangleY + h);
}

function drawMeanLabel() {
  fill('#e75480');
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(22);
  text(nf(map(triangleX, margin, width - margin, numberLineStart, numberLineEnd), 1, 1), triangleX, triangleY - 10);
  textSize(16);
  text('Drag to balance', triangleX, triangleY + triangleSize + 18);
  // Visual feedback if triangle is at mean
 // let meanX = floor(map(mean, numberLineStart, numberLineEnd, margin, width - margin));
  let currentPoint = nf(map(triangleX, margin, width - margin, numberLineStart, numberLineEnd), 1, 1);
  if (currentPoint == mean) {
    push();
    fill('#4a40b4');
    stroke('#4a40b4');
    strokeWeight(1);
    textAlign(CENTER, TOP);
    textSize(24);
    text('Balanced Mean = ' + nf(mean, 1, 1), 380, 20);
    pop();
    push();
    fill(draggingTriangle ? '#008000' : '#008000');
    stroke('#008000');
    strokeWeight(2);
    let base = triangleSize;
    let h = triangleSize * 0.9;
    triangle(triangleX, triangleY, triangleX - base / 2, triangleY + h, triangleX + base / 2, triangleY + h);
    pop();
    push();
    fill('#008000');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(22);
    text(nf(map(triangleX, margin, width - margin, numberLineStart, numberLineEnd), 1, 1), triangleX, triangleY - 10);
    textSize(16);
    text('Drag to balance', triangleX, triangleY + triangleSize + 18);
    pop();
  }
}

function mousePressed() {
  if (state !== 'plotted') return;
  if (dist(mouseX, mouseY, triangleX, triangleY + triangleSize * 0.5) < triangleSize) {
    draggingTriangle = true;
  }
}

function mouseDragged() {
  if (state !== 'plotted') return;
  if (draggingTriangle) {
    triangleX = constrain(mouseX, margin, width - margin);
  }
}

function mouseReleased() {
  draggingTriangle = false;
}

function initializePoints(n) {
  points = [];
  for (let i = 0; i < n; i++) {
    let x = map(i, 0, n - 1, 100, width - 100);
    let yVal = int(random(5, 15));
    points.push({ x, yVal });
  }
}
