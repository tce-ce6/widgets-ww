class Model {
  constructor() {
    this.numerator = null;
    this.denominator = null;
    this.quotient = [];
    this.remainders = [];
    this.divisionSteps = [];
    this.currentStep = 0;
    this.isAnimating = false;
    this.isRepeating = false;
    this.repeatingStart = -1;
    this.decimalValue = 0;
    this.factorTree = [];
    this.challengeMode = false;
    this.prediction = "";
    this.zoomLevel = 1;
    this.isComplete = false;
    this.resultType = ""; // "terminating" or "repeating"
    this.animationState = {
      currentDividend: 0,
      currentQuotient: 0,
      currentRemainder: 0,
      animationProgress: 0,
      decimalPointPosition: {x: 0, y: 0},
      resultAnimation: {
        opacity: 0,
        scale: 0,
        y: 0
      }
    };
  }

  setFraction(num, den) {
    this.numerator = num;
    this.denominator = den;
    this.resetAnimation();
    this.decimalValue = num / den;
    this.factorTree = this.getPrimeFactors(Math.abs(den));
  }

  performDivisionStep() {
    if (!this.isAnimating) return false;
    
    this.animationState.animationProgress = 0;
    
    let n = this.numerator * 10;
    if (this.remainders.length > 0) {
      n = this.remainders[this.remainders.length - 1] * 10;
    }
    
    this.animationState.currentDividend = n;
    this.animationState.currentQuotient = Math.floor(n / this.denominator);
    this.animationState.currentRemainder = n % this.denominator;
    
    return true;
  }
  
  updateAnimationProgress() {
    if (this.isAnimating && this.animationState.animationProgress < 1) {
      this.animationState.animationProgress = Math.min(1, this.animationState.animationProgress + 0.03);
      return true;
    }
    return false;
  }
  
  completeDivisionStep() {
    if (!this.isAnimating) return false;
    
    const q = this.animationState.currentQuotient;
    const r = this.animationState.currentRemainder;
    
    this.quotient.push(q);
    this.remainders.push(r);
    this.divisionSteps.push({ 
      n: this.animationState.currentDividend, 
      q, 
      r 
    });

    if (r === 0) {
      this.isAnimating = false;
      this.isComplete = true;
      this.resultType = "terminating";
      this.startResultAnimation();
      return false;
    }
    
    const remainderIndex = this.remainders.indexOf(r, 0);
    if (remainderIndex >= 0 && remainderIndex < this.remainders.length - 1) {
      this.isRepeating = true;
      this.repeatingStart = remainderIndex;
      this.isAnimating = false;
      this.isComplete = true;
      this.resultType = "repeating";
      this.startResultAnimation();
      return false;
    }
    
    this.currentStep++;
    if (this.currentStep >= 15) {
      this.isAnimating = false;
      this.isComplete = true;
      this.resultType = "repeating";
      this.startResultAnimation();
      return false;
    }
    
    return true;
  }

  startResultAnimation() {
    this.animationState.resultAnimation.opacity = 0;
    this.animationState.resultAnimation.scale = 0;
    this.animationState.resultAnimation.y = 50;
  }

  updateResultAnimation() {
    if (this.isComplete) {
      const result = this.animationState.resultAnimation;
      result.opacity = Math.min(255, result.opacity + 8);
      result.scale = Math.min(1, result.scale + 0.05);
      result.y = Math.max(0, result.y - 2);
    }
  }

  getPrimeFactors(n) {
    let factors = [];
    let divisor = 2;
    while (n > 1) {
      if (n % divisor === 0) {
        factors.push(divisor);
        n /= divisor;
      } else {
        divisor++;
        if (divisor * divisor > n && n > 1) {
          factors.push(n);
          break;
        }
      }
    }
    return factors;
  }

  onlyTwoAndFive() {
    return this.factorTree.every(f => f === 2 || f === 5);
  }

  resetAnimation() {
    this.quotient = [];
    this.remainders = [];
    this.divisionSteps = [];
    this.currentStep = 0;
    this.isAnimating = true;
    this.isRepeating = false;
    this.repeatingStart = -1;
    this.isComplete = false;
    this.resultType = "";
    this.animationState = {
      currentDividend: 0,
      currentQuotient: 0,
      currentRemainder: 0,
      animationProgress: 0,
      decimalPointPosition: {x: 0, y: 0},
      resultAnimation: {
        opacity: 0,
        scale: 0,
        y: 0
      }
    };
  }

  toggleChallengeMode() {
    this.challengeMode = !this.challengeMode;
    if (!this.challengeMode) {
      this.prediction = "";
    }
  }

  setPrediction(prediction) {
    this.prediction = prediction;
  }

  isPredictionCorrect() {
    if (!this.prediction || !this.isComplete) return null;
    return (this.prediction === 'terminating' && this.resultType === 'terminating') ||
           (this.prediction === 'repeating' && this.resultType === 'repeating');
  }

  setZoomLevel(value) {
    this.zoomLevel = Math.max(1, Math.min(10, parseFloat(value)));
  }
}

class View {
  constructor() {
    this.sketch = (p) => {
      this.p = p;
      this.animationValues = {
        decimalPoint: { x: 0, y: 0, targetX: 0, targetY: 0 },
        divisionStep: { progress: 0 },
        factorTree: { opacity: 0 },
        longDivision: { opacity: 0, currentDigit: 0 }
      };
      
      p.setup = () => {
        let sketchHolder = document.getElementById('sketch-holder');
        if (!sketchHolder) return;
        
        let canvas = p.createCanvas(sketchHolder.offsetWidth, sketchHolder.offsetHeight);
        canvas.parent('sketch-holder');
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(16);
        p.rectMode(p.CORNER);
        p.ellipseMode(p.CENTER);
      };

      p.draw = () => {
        p.background(255);
        
        this.drawGrid();
        
        if (this.model) {
          this.renderDivisionArea(p);
          this.renderNumberLine(p);
          // this.renderFactorTree(p);
          this.renderResult(p);
          if (this.model.challengeMode && this.model.prediction && this.model.isComplete) {
            this.renderChallengeResult(p);
          }
          
          this.updateAnimations();
        }
      };  
      
      p.windowResized = () => {
        let sketchHolder = document.getElementById('sketch-holder');
        if (sketchHolder) {
          p.resizeCanvas(sketchHolder.offsetWidth, sketchHolder.offsetHeight);
        }
      };
    };
    
    try {
      this.p5Instance = new p5(this.sketch);
    } catch (error) {
      console.error("Failed to instantiate p5.js", error);
    }
  }
  
  drawGrid() {
    const p = this.p;
    p.stroke(230, 230, 240);
    p.strokeWeight(0.5);
    
    for (let x = 0; x <= p.width; x += 25) {
      p.line(x, 0, x, p.height);
    }
    
    for (let y = 0; y <= p.height; y += 25) {
      p.line(0, y, p.width, y);
    }
  }
  
  updateAnimations() {
    const dp = this.animationValues.decimalPoint;
    dp.x = this.lerp(dp.x, dp.targetX, 0.1);
    dp.y = this.lerp(dp.y, dp.targetY, 0.1);
    
    if (this.model && this.model.isAnimating) {
      this.animationValues.divisionStep.progress = this.model.animationState.animationProgress;
      this.animationValues.longDivision.opacity = this.lerp(
        this.animationValues.longDivision.opacity,
        255,
        0.05
      );
    } else {
      this.animationValues.divisionStep.progress = 1;
      this.animationValues.longDivision.opacity = 255;
    }
    
    if (this.model && this.model.factorTree.length > 0) {
      this.animationValues.factorTree.opacity = this.lerp(
        this.animationValues.factorTree.opacity, 
        255, 
        0.05
      );
    } else {
      this.animationValues.factorTree.opacity = 0;
    }

    if (this.model) {
      this.model.updateResultAnimation();
    }
  }
  
  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  setModel(model) {
    this.model = model;
  }

  renderDivisionArea(p) {
    const model = this.model;
    const progress = this.animationValues.divisionStep.progress;
    const longDivisionOpacity = this.animationValues.longDivision.opacity;
    const canvasWidth = p.width;
    const canvasHeight = p.height;
    
    p.push();
    
    const leftMargin = Math.max(30, canvasWidth * 0.05);
    const topMargin = Math.max(30, canvasHeight * 0.05);
    
    p.translate(leftMargin, topMargin);
    
    // Long Division Animation
    if (model.numerator !== null && model.denominator !== null) {
      p.push();
      p.translate(0, 40);
      
      const fontSize = Math.min(18, canvasWidth * 0.02);
      p.textSize(fontSize);
      
      const xBase = 120;
      const yBase = 20;
      const digitWidth = fontSize * 0.8;
      const lineHeight = fontSize * 2.5; // Proper spacing to prevent overlap
      
      // Draw division symbol and divisor
      p.stroke(0, 0, 255, longDivisionOpacity);
      p.fill(0, 0, 255, longDivisionOpacity);
      p.strokeWeight(2);
      p.line(xBase - 40, yBase - 20, xBase - 40, yBase + 20);
      p.line(xBase - 40, yBase + 20, xBase + digitWidth * (model.quotient.length + 6), yBase + 20);
      p.text(`${model.denominator}`, xBase - 80, yBase - 5);
      
      // Draw initial dividend
      let dividendStr = model.currentStep === 0 ? `${Math.abs(model.numerator)}.0` : 
        `${model.remainders[model.remainders.length - 1]}.0`;
      p.fill(255, 0, 0, longDivisionOpacity);
      p.text(dividendStr, xBase, yBase + 5);
      
      // Draw quotient with proper spacing
      p.fill(0, 128, 0, longDivisionOpacity);
      p.text('0.', xBase, yBase - 25);
      
      for (let i = 0; i < model.quotient.length; i++) {
        const opacity = (i < model.currentStep || !model.isAnimating) ? longDivisionOpacity : 
          longDivisionOpacity * progress;
        p.fill(0, 128, 0, opacity);
        
        if (model.isRepeating && document.getElementById('highlightRepeating').checked && 
            model.repeatingStart >= 0 && i >= model.repeatingStart) {
          p.fill(255, 165, 0, opacity);
        }
        
        p.text(model.quotient[i], xBase + 30 + (i * digitWidth), yBase - 25);
      }
      
      // Draw previous steps with proper vertical spacing
      for (let i = 0; i < model.currentStep && i < model.divisionSteps.length; i++) {
        const step = model.divisionSteps[i];
        const yPos = yBase + 40 + (i * lineHeight * 2.5); // Increased spacing between steps
        
        // Current dividend
        p.fill(255, 0, 0, longDivisionOpacity);
        p.text(`${step.n}`, xBase, yPos);
        
        // Subtraction
        const product = step.q * model.denominator;
        p.fill(0, 0, 139, longDivisionOpacity);
        p.text(`-${product}`, xBase + 20, yPos + lineHeight * 0.8);
        
        // Subtraction line
        p.stroke(100, longDivisionOpacity);
        p.strokeWeight(1);
        p.line(xBase, yPos + lineHeight * 1.2, xBase + 80, yPos + lineHeight * 1.2);
        
        // Remainder
        p.fill(0, 128, 128, longDivisionOpacity);
        p.text(`${step.r}`, xBase, yPos + lineHeight * 1.5);
      }
      
      // Draw current division step with smooth animation
      if (model.isAnimating && model.animationState.currentDividend > 0) {
        const yPos = yBase + 40 + (model.currentStep * lineHeight * 2.5);
        
        // Animate current dividend
        p.fill(255, 0, 0, longDivisionOpacity * progress);
        p.text(`${model.animationState.currentDividend}`, xBase, yPos);
        
        if (progress > 0.3) {
          // Draw subtraction product
          const product = model.animationState.currentQuotient * model.denominator;
          p.fill(0, 0, 139, longDivisionOpacity * Math.min(1, (progress - 0.3) / 0.3));
          p.text(`-${product}`, xBase + 20, yPos + lineHeight * 0.8);
          
          if (progress > 0.6) {
            // Draw subtraction line
            p.stroke(100, longDivisionOpacity * Math.min(1, (progress - 0.6) / 0.2));
            p.strokeWeight(1);
            p.line(xBase, yPos + lineHeight * 1.2, xBase + 80, yPos + lineHeight * 1.2);
            
            // Draw remainder
            p.fill(0, 128, 128, longDivisionOpacity * Math.min(1, (progress - 0.6) / 0.4));
            p.text(`${model.animationState.currentRemainder}`, xBase, yPos + lineHeight * 1.5);
          }
        }
      }
      
      p.pop();
    }
    
    p.pop();
  }

  renderResult(p) {
    const model = this.model;
    if (!model.isComplete) return;
    
    const result = model.animationState.resultAnimation;
    const canvasWidth = p.width;
    const canvasHeight = p.height;
    
    p.push();
    
    // Position result in center-right area
    const x = canvasWidth * 0.6;
    const y = canvasHeight * 0.3 + result.y;
    
    p.translate(x, y);
    p.scale(result.scale);
    
    // Background box
    p.fill(255, 255, 255, result.opacity * 0.9);
    p.stroke(0, 0, 0, result.opacity * 0.3);
    p.strokeWeight(2);
    p.rect(-120, -40, 240, 80, 15);
    
    // Result text
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(Math.min(20, canvasWidth * 0.025));
    
if (model.resultType === "terminating") {
  p.fill(0, 150, 0, result.opacity);
  p.textSize(12); // Smaller font size
  p.text("TERMINATING", 0, -15); // Adjusted y-coordinate
  p.text("DECIMAL", 0, 5); // Increased spacing
} else {
  p.fill(255, 100, 0, result.opacity);
  p.textSize(12); // Smaller font size
  p.text("NON-TERMINATING", 0, -25); // Adjusted y-coordinate
  p.text("REPEATING", 0, -5); // Increased spacing
  p.text("DECIMAL", 0, 15); // Adjusted for consistent spacing
}
    
    // Add sparkle effect for completed animation
    // if (result.scale >= 1) {
    //   for (let i = 0; i < 8; i++) {
    //     const angle = (p.frameCount * 0.1 + i * p.PI / 4) % (p.PI * 2);
    //     const radius = 60 + Math.sin(p.frameCount * 0.05 + i) * 10;
    //     const sparkleX = Math.cos(angle) * radius;
    //     const sparkleY = Math.sin(angle) * radius;
        
    //     p.fill(255, 200, 0, result.opacity * 0.7);
    //     p.noStroke();
    //     p.ellipse(sparkleX, sparkleY, 4, 4);
    //   }
    // }
    
    p.pop();
  }

  renderNumberLine(p) {
    const model = this.model;
    if (!model.numerator || !model.denominator) return;
    
    const canvasWidth = p.width;
    const canvasHeight = p.height;
    
    const xStart = Math.max(50, canvasWidth * 0.05);
    const xEnd = canvasWidth - xStart;
    const y = canvasHeight - 120;
    const range = 2 / model.zoomLevel;
    
    p.stroke(100);
    p.strokeWeight(2);
    p.line(xStart, y, xEnd, y);
    
    p.strokeWeight(1);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(Math.min(12, canvasWidth * 0.015));
    p.fill(100);
    const step = range / 10;
    for (let i = -range; i <= range; i += step) {
      const x = p.map(i, -range, range, xStart, xEnd);
      p.line(x, y - 5, x, y + 5);
      
      if (Math.abs(i) < 1e-5 || Math.abs(i - Math.round(i/0.5)*0.5) < 1e-5) {
        p.text(i.toFixed(1), x, y + 10);
      }
    }
    
    p.stroke(0, 128, 0);
    p.strokeWeight(3);
    const zeroX = p.map(0, -range, range, xStart, xEnd);
    p.line(zeroX, y - 10, zeroX, y + 10);
    
    if (model.decimalValue !== 0) {
      let xPos = p.map(model.decimalValue, -range, range, xStart, xEnd);
      
      this.animationValues.decimalPoint.targetX = xPos;
      this.animationValues.decimalPoint.targetY = y;
      
      p.stroke(255, 0, 0, 200);
      p.strokeWeight(2);
      p.line(xPos, y - 40, xPos, y - 10);
      
      p.fill(255, 50, 50);
      p.noStroke();
      p.ellipse(
        this.animationValues.decimalPoint.x, 
        this.animationValues.decimalPoint.y - 25, 
        12, 12
      );
      
      p.fill(255, 100, 0);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.textSize(Math.min(14, canvasWidth * 0.018));
      p.text(model.decimalValue.toFixed(6), xPos, y - 45);
    }
    
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(0);
    p.textSize(Math.min(16, canvasWidth * 0.02));
    p.text("Number Line", canvasWidth/2, y - 80);
  }

  // renderFactorTree(p) {
  //   const model = this.model;
  //   if (model.factorTree.length === 0) return;
    
  //   const opacity = this.animationValues.factorTree.opacity;
  //   if (opacity < 10) return;
    
  //   const canvasWidth = p.width;
  //   const canvasHeight = p.height;
    
  //   const x = canvasWidth * 0.05;
  //   const y = canvasHeight * 0.55;
    
  //   p.push();
  //   p.translate(x, y);
    
  //   // Background
  //   p.fill(240, 248, 255, opacity * 0.8);
  //   p.stroke(100, 150, 200, opacity * 0.5);
  //   p.strokeWeight(1);
  //   p.rect(0, 0, Math.min(300, canvasWidth * 0.4), 120, 10);
    
  //   p.fill(0, 0, 139, opacity);
  //   p.textSize(Math.min(16, canvasWidth * 0.018));
  //   p.textAlign(p.CENTER, p.CENTER);
    
  //   // Original number
  //   p.fill(0, 0, 0, opacity);
  //   p.text(`${model.denominator} = `, 80, 30);
    
  //   // Prime factors
  //   let factorText = model.factorTree.join(' × ');
  //   p.fill(0, 128, 0, opacity);
  //   p.text(factorText, 150, 30);
    
  //   // Conclusion
  //   p.textAlign(p.LEFT, p.CENTER);
  //   p.fill(0, 0, 0, opacity);
  //   p.textSize(Math.min(14, canvasWidth * 0.016));
    
  //   // let conclusion = model.onlyTwoAndFive() ? 
  //   //   "Only factors 2 and 5 → Terminating" : 
  //   //   "Contains other factors → Repeating";
  //   // p.text(conclusion, 20, 70);
    
  //   p.pop();
  // }

  renderChallengeResult(p) {
    const model = this.model;
    const correct = model.isPredictionCorrect();
    if (correct === null) return;
    
    p.push();
    
    const x = p.width - 180;
    const y = 60;
    
    p.translate(x, y);
    
    p.fill(correct ? 200 : 255, correct ? 255 : 200, correct ? 200 : 200, 200);
    p.stroke(correct ? 0 : 255, correct ? 150 : 0, correct ? 0 : 0, 150);
    p.strokeWeight(2);
    p.rect(0, 0, 160, 60, 10);
    
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(Math.min(18, p.width * 0.022));
    p.fill(correct ? 0 : 200, correct ? 100 : 0, correct ? 0 : 0);
    p.text(correct ? "✓ Correct!" : "✗ Incorrect", 80, 30);
    
    p.pop();
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.animationFrame = null;
    this.initEventListeners();
  }

  initEventListeners() {
    const fractionInput = document.getElementById('fractionInput');
    const generateRandom = document.getElementById('generateRandom');
    const startDivision = document.getElementById('startDivision');
    const restartDivision = document.getElementById('restartDivision');
    const highlightRepeating = document.getElementById('highlightRepeating');
    const zoomSlider = document.getElementById('zoomSlider');
    const challengeMode = document.getElementById('challengeMode');
    const prediction = document.getElementById('prediction');

    fractionInput.addEventListener('input', () => this.validateInput());
    generateRandom.addEventListener('click', () => this.generateRandomFraction());
    startDivision.addEventListener('click', () => this.startDivision());
    restartDivision.addEventListener('click', () => this.restartDivision());
    zoomSlider.addEventListener('input', (e) => this.updateZoom(e.target.value));
    challengeMode.addEventListener('click', () => this.toggleChallengeMode());
    prediction.addEventListener('change', (e) => this.model.setPrediction(e.target.value));
    
    this.animationLoop();
  }
  
  animationLoop() {
    if (this.model) {
      if (this.model.isAnimating) {
        if (this.model.updateAnimationProgress()) {
          // Continue animation
        } else if (this.model.completeDivisionStep()) {
          this.model.performDivisionStep();
        }
      }
    }
    
    this.animationFrame = requestAnimationFrame(() => this.animationLoop());
  }

  validateInput() {
    let input = document.getElementById('fractionInput').value;
    let startButton = document.getElementById('startDivision');
    let restartButton = document.getElementById('restartDivision');
    let regex = /^(-?\d+)\/(\d+)$/;
    if (regex.test(input)) {
      let [, num, den] = input.match(regex);
      num = parseInt(num);
      den = parseInt(den);
      if (den !== 0) {
        startButton.disabled = false;
        restartButton.disabled = false;
        return { num, den };
      }
    }
    startButton.disabled = true;
    restartButton.disabled = true;
    return null;
  }

  generateRandomFraction() {
    let num = Math.floor(Math.random() * 20) - 5;
    let den = Math.floor(Math.random() * 15) + 1;
    
    if (num % den === 0) {
      num += 1;
    }
    
    document.getElementById('fractionInput').value = `${num}/${den}`;
    this.validateInput();
  }

  startDivision() {
    let fraction = this.validateInput();
    if (fraction) {
      this.model.setFraction(fraction.num, fraction.den);
      document.getElementById('highlightRepeating').disabled = false;
      this.model.performDivisionStep();
    }
  }

  restartDivision() {
    if (this.model.numerator && this.model.denominator) {
      this.model.resetAnimation();
      document.getElementById('highlightRepeating').disabled = false;
      this.model.performDivisionStep();
    }
  }

  updateZoom(value) {
    this.model.setZoomLevel(value);
  }

  toggleChallengeMode() {
    this.model.toggleChallengeMode();
    let challengeButton = document.getElementById('challengeMode');
    let predictionSelect = document.getElementById('prediction');
    challengeButton.textContent = this.model.challengeMode ? 'Exit Challenge Mode' : 'Challenge Mode';
    predictionSelect.disabled = !this.model.challengeMode;
    if (!this.model.challengeMode) {
      predictionSelect.value = '';
      this.model.setPrediction('');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    let model = new Model();
    let view = new View();
    view.setModel(model);
    new Controller(model, view);
    
    document.getElementById('fractionInput').value = "1/3";
    document.getElementById('startDivision').disabled = false;
    document.getElementById('restartDivision').disabled = false;
  } catch (error) {
    console.error("Initialization failed", error);
    document.body.innerHTML += '<p style="color: red;">Error: Failed to initialize simulation. Check console for details.</p>';
  }
});