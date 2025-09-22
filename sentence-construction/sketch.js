let currentIndex = 0;

function setup() {
  let canvas = createCanvas(1300, 600); // adjust size
  canvas.parent("mainCanvas");
  textAlign(CENTER, CENTER);
  textFont("Arial");
}

function draw() {
  background("#FFFFFF00"); // purple background like screenshot

  let pair = wordPairs[currentIndex];

  // ===== TOP SENTENCE RECT (blanks) =====
  let rectX = 100;
  let rectY = 100;
  let rectW = 1100;
  let rectH = 100;

  fill(255);
  stroke(200);
  strokeWeight(2);
  rect(rectX, rectY, rectW, rectH, 30);

  // Draw blanks (underscores) for each word
  let blanks = pair.sentence.split(" ").length;
  let spacing = rectW / blanks;
  textSize(32);
  fill(0);
  noStroke();
  for (let i = 0; i < blanks; i++) {
    text("_____", rectX + spacing / 2 + i * spacing, rectY + rectH / 2);
  }

  // ===== WORD TILES =====
  let tileW = 120;
  let tileH = 60;
  let startX = 100;
  let startY = 250;
  let gap = 10;

  textSize(24);
  textStyle(BOLD);

  for (let i = 0; i < pair.words.length; i++) {
    let x = startX + (tileW + gap) * i;
    let y = startY;

    fill("#aee6ff"); // blue tile
    stroke(0);
    rect(x, y, tileW, tileH, 10);

    fill(0);
    noStroke();
    text(pair.words[i], x + tileW / 2, y + tileH / 2);
  }
}
