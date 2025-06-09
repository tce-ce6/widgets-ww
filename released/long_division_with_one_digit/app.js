let model, view, controller;

function setup() {
  model = new DivisionModel();
  view = new DivisionView(model);
  controller = new DivisionController(model, view);
  view.setup();
}

function draw() {
  view.draw();
}

// --- MVC (Enhanced Animated) ---
class DivisionModel {
  constructor() {
    this.generateProblem();
  }

  generateProblem() {
    this.divisor = Math.floor(Math.random() * 8) + 2; // 2–9
    const digits = Math.random() > 0.5 ? 3 : 4;
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    this.dividend = Math.floor(Math.random() * (max - min + 1)) + min;
    this.quotient = Math.floor(this.dividend / this.divisor);
    this.remainder = this.dividend % this.divisor;
    this.steps = this.computeSteps();
  }

  computeSteps() {
    let dividendStr = this.dividend.toString().split('').map(Number);
    let steps = [];
    let idx = 0, current = 0, quotientStr = '';

    while (idx < dividendStr.length) {
      current = current * 10 + dividendStr[idx];
      if (current >= this.divisor) {
        let q = Math.floor(current / this.divisor);
        let mult = q * this.divisor;
        let rem = current - mult;
        steps.push({
          pos: idx,
          current,
          q,
          mult,
          rem,
        });
        quotientStr += q;
        current = rem;
      } else {
        if (quotientStr.length > 0){
          quotientStr += '0';
          steps.push({
            pos: idx,
            current,
            q: 0,
            mult: 0,
            rem: current,
            fullValue: current
          });
        }
      }
      idx++;
    }
    this.quotientStr = quotientStr;
    return steps;
  }
}

class DivisionView {
  constructor(model) {
    this.model = model;
    this.sliderValue = 0;
    this.remainderAnimations = [];
    this.animationSpeed = 5; // pixels per frame
  }

  setup() {
    createCanvas(900, 500).parent("canvasContainer");
    textFont("Normal");
    textSize(22);
  }

  updateSliderValue(val) {
    this.sliderValue = val;
  }
  
  drawArrow(fromX, fromY, toX, toY, color = '#8665E8') {
    stroke(color);
    strokeWeight(2);
    line(fromX, fromY, toX, toY);
    let angle = atan2(toY - fromY, toX - fromX);
    let arrowSize = 6;
    push();
    translate(toX, toY);
    rotate(angle);
    fill(color);
    noStroke();
    triangle(0, 0, -arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2);
    pop();
    strokeWeight(1);
    stroke(0);
  }
  
  draw() {
    background(255);
    const { dividend, divisor, steps, quotientStr, remainder } = this.model;
    let stepX = 100, stepY = 110;
    stroke(0);
    noFill();

    strokeWeight(1);
    // Draw the horizontal line of division symbol
    line(stepX + 20, stepY - 40, stepX + 180, stepY - 40);
    // Draw the curved part of division symbol
    beginShape();
    vertex(stepX + 20, stepY - 40);
    // shape the curve in a left side up shape
    bezierVertex(stepX + 20, stepY + 20, stepX + 10, stepY + 10, stepX + 10, stepY - 15);
    endShape();
   
    // Display dividend digits
    const dividendDigits = dividend.toString().split('');
    fill(0);
    dividendDigits.forEach((d, i) => {
      text(d, stepX + 40 + i * 20, stepY - 15);
    });
    
    // Display divisor
    fill(0);
    text(divisor, stepX, stepY - 15);
    
    // Quotient (animated build-up)
    fill(0);
    for (let i = 0; i < this.sliderValue && i < steps.length; i++) {
      const s = steps[i];
      const avgDigitWidth = 12; // fine-tuned based on your font size
      let qX = stepX + 40 + s.pos * avgDigitWidth;
      const offset = textWidth(s.q) / 2;
      text(s.q, qX - offset, stepY - 45);

    }
    
    // Draw each step with improved visualization
    for (let i = 0; i < this.sliderValue && i < steps.length; i++) {
      const s = steps[i];
      const stepYOffset = i * 50;
      fill(0); // default black color
      const multStr = s.mult.toString();
      const multLength = multStr.length;
      const multX = stepX + 40 + (s.pos - multLength + 1) * 20;

      // Draw minus sign separately for precise control
      text('-', multX - 10, stepY + stepYOffset + 10);
      text(multStr, multX, stepY + stepYOffset + 10);

      
      
      
      // Draw subtraction line
      line(stepX + 30, stepY + stepYOffset + 15, 
           stepX + 30 + textWidth(s.mult.toString()) + 60, 
           stepY + stepYOffset + 15);
      
      // Display remainder
      fill(0);
      textSize(20);
      if (this.sliderValue === 0) this.remainderAnimations = [];

      // Animate remainder drop
      let currentStr = s.current.toString();
      let remainderStr = s.rem.toString();
      let currentLength = currentStr.length;
      let remainderLength = remainderStr.length;

      // Align remainder under the last digit of the current number
      let targetX = stepX + 30 + (s.pos - remainderLength + 1) * 20;

      let targetY = stepY + stepYOffset + 35;
      if (!this.remainderAnimations[i]) {
        this.remainderAnimations[i] = { x: targetX, y: targetY - 35, done: false };
      }
      let anim = this.remainderAnimations[i];
      if (!anim.done) {
        if (anim.y < targetY) {
          anim.y += this.animationSpeed;
        } else {
          anim.y = targetY;
          anim.done = true;
        }
      }
      text(`${s.rem}`, anim.x, anim.y);
      
      // If there's a next digit to bring down, show it
      if (i < steps.length - 1) {
        const nextDigit = dividend.toString()[steps[i + 1].pos];
        let nextDigitX = stepX + 40 + steps[i + 1].pos * 20;
        text(nextDigit, nextDigitX, stepY + stepYOffset + 35);
        
      }
    }
    
    // Show final remainder only after all steps are completed
    if (this.sliderValue > steps.length) {
      const finalYOffset = steps.length * 60;
      noStroke();
      fill(0);
      textSize(20);
      text("Remainder → ", stepX, stepY + finalYOffset + 50);
      text(`${remainder}`, stepX + 120, stepY + finalYOffset + 50);
      
      // Final result
      textSize(26);
      let resultX = 600;
      let resultY = 100;
      textSize(22);

      // Dividend (purple)
      fill('#7B61FF');
      text(`${dividend}`, resultX, resultY);
      let w1 = textWidth(`${dividend} `);

      // ÷ divisor (red)
      fill('#FF2E93');
      text(`÷ ${divisor}`, resultX + w1, resultY);
      let w2 = textWidth(`÷ ${divisor} `);

      // = quotient (green)
      fill('#217c63');
      text(`= ${quotientStr}`, resultX + w1 + w2, resultY);
      let w3 = textWidth(`= ${quotientStr} `);

      // R remainder (dark green)
      fill('#2D6A4F');
      text(`R ${remainder}`, resultX + w1 + w2 + w3, resultY);
    }
    
    // Show multiplication hint for current step
    if (this.sliderValue > 0 && this.sliderValue <= steps.length) {
      const currentStep = steps[this.sliderValue - 1];
      fill(0);
      textSize(24);
      const rightX = 400;
      const rightY = 100 + (this.sliderValue - 1) * 50;
      text(`${divisor} × ${currentStep.q} = ${currentStep.mult}`, rightX, rightY);
    }
    
    // Show "TRY ANOTHER" button only after all steps are completed
    const newProblemBtn = document.getElementById("newProblem");
    if (this.sliderValue > steps.length) {
      newProblemBtn.style.display = "inline-block";
    } else {
      newProblemBtn.style.display = "none";
    }
  }
}

class DivisionController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.slider = document.getElementById("slider");
    this.button = document.getElementById("newProblem");

    this.slider.max = model.steps.length + 1;

    this.slider.addEventListener("input", () => {
      view.updateSliderValue(parseInt(this.slider.value));
    });

    this.button.addEventListener("click", () => {
      model.generateProblem();
      this.slider.max = model.steps.length + 1;
      this.slider.value = 0;
      view.updateSliderValue(0);
    });
  }
}