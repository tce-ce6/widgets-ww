// MODEL - Handles data and business logic
class SubtractionModel {
  constructor() {
    // Number values
    this.topNumber = 0;
    this.bottomNumber = 0;
    this.hundredsDigit = 0;
    this.tensDigit = 0;
    this.onesDigit = 0;
    this.subtractHundreds = 0;
    this.subtractTens = 0;
    this.subtractOnes = 0;
    
    // Borrowing state
    this.needBorrowFromTens = false;
    this.needBorrowFromHundreds = false;
    this.borrowedFromTens = false;
    this.borrowedFromHundreds = false;
    
    // Animation state
    this.animatingTensToOnes = false;
    this.animatingHundredsToTens = false;
    this.animationProgress = 0;
    
    // Result block animation states - NEW
    this.animatingOnesResult = false;
    this.animatingTensResult = false;
    this.animatingHundredsResult = false;
    this.onesResultProgress = 0;
    this.tensResultProgress = 0;
    this.hundredsResultProgress = 0;
    
    // Result tracking
    this.result = [];
    this.crossedOutOnes = 0;
    this.crossedOutTens = 0;
    this.crossedOutHundreds = 0;
    
    // Progression tracking
    this.currentStep = 0;
    this.maxStep = 5;
  }
  
  generateNewProblem() {
    // Reset all states
    this.currentStep = 0;
    this.borrowedFromHundreds = false;
    this.borrowedFromTens = false;
    this.animatingTensToOnes = false;
    this.animatingHundredsToTens = false;
    this.animationProgress = 0;
    this.crossedOutOnes = 0;
    this.crossedOutTens = 0;
    this.crossedOutHundreds = 0;
    
    // Reset result animations - NEW
    this.animatingOnesResult = false;
    this.animatingTensResult = false;
    this.animatingHundredsResult = false;
    this.onesResultProgress = 0;
    this.tensResultProgress = 0;
    this.hundredsResultProgress = 0;
    
    // Generate random numbers for subtraction
    this.hundredsDigit = floor(random(2, 6));
    this.tensDigit = floor(random(1, 7));
    this.onesDigit = floor(random(1, 9));
    
    this.subtractHundreds = '';
    this.subtractTens = floor(random(5, 10));
    this.subtractOnes = floor(random(6, 10));
    
    // Make sure we need to borrow
    if (this.onesDigit >= this.subtractOnes) {
      this.onesDigit = this.subtractOnes - 1;
    }
    
    // Set the top and bottom numbers
    this.topNumber = (this.hundredsDigit * 100) + (this.tensDigit * 10) + this.onesDigit;
    this.bottomNumber = (this.subtractHundreds * 100) + (this.subtractTens * 10) + this.subtractOnes;
    
    // Check if we need to borrow
    this.needBorrowFromTens = this.onesDigit < this.subtractOnes;
    this.needBorrowFromHundreds = this.tensDigit - (this.needBorrowFromTens ? 1 : 0) < this.subtractTens;
    
    // Calculate result digits
    this.result = [
      this.hundredsDigit - (this.needBorrowFromHundreds ? 1 : 0) - this.subtractHundreds,
      (this.tensDigit + (this.needBorrowFromHundreds ? 10 : 0)) - (this.needBorrowFromTens ? 1 : 0) - this.subtractTens,
      (this.onesDigit + (this.needBorrowFromTens ? 10 : 0)) - this.subtractOnes
    ];
  }
  
  updateAnimation() {
    // Update borrowing animations
    if (this.animatingTensToOnes || this.animatingHundredsToTens) {
      this.animationProgress += 0.009;
      
      if (this.animationProgress >= 1) {
        this.animationProgress = 0;
        
        if (this.animatingTensToOnes) {
          this.animatingTensToOnes = false;
          this.borrowedFromTens = true;
        }
        
        if (this.animatingHundredsToTens) {
          this.animatingHundredsToTens = false;
          this.borrowedFromHundreds = true;
        }
      }
    }
    
    // Update result block animations - NEW
    if (this.animatingOnesResult) {
      this.onesResultProgress += 0.01;
      if (this.onesResultProgress >= 1) {
        this.onesResultProgress = 1;
        this.animatingOnesResult = false;
      }
    }
    
    if (this.animatingTensResult) {
      this.tensResultProgress += 0.01;
      if (this.tensResultProgress >= 1) {
        this.tensResultProgress = 1;
        this.animatingTensResult = false;
      }
    }
    
    if (this.animatingHundredsResult) {
      this.hundredsResultProgress += 0.01;
      if (this.hundredsResultProgress >= 1) {
        this.hundredsResultProgress = 1;
        this.animatingHundredsResult = false;
      }
    }
  }
  
  nextStep() {
    if (this.currentStep < this.maxStep) {
      this.currentStep++;
      
      // Handle step-specific actions
      switch(this.currentStep) {
        case 1:
          // Start borrowing from tens to ones
          if (this.needBorrowFromTens) {
            this.animatingTensToOnes = true;
          }
          break;
        case 2:
          // Complete ones subtraction
          this.crossedOutOnes = this.subtractOnes;
          // Start ones result animation - NEW
          this.animatingOnesResult = true;
          this.onesResultProgress = 0;
          break;
        case 3:
          // Start borrowing from hundreds to tens if needed
          if (this.needBorrowFromHundreds) {
            this.animatingHundredsToTens = true;
          }
          break;
        case 4:
          // Complete tens subtraction
          this.crossedOutTens = this.subtractTens;
          // Start tens result animation - NEW
          this.animatingTensResult = true;
          this.tensResultProgress = 0;
          break;
        case 5:
          // Process hundreds place
          this.crossedOutHundreds = this.subtractHundreds;
          // Start hundreds result animation - NEW
          this.animatingHundredsResult = true;
          this.hundredsResultProgress = 0;
          break;
      }
    }
  }
  
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      
      // Reset states when going back
      switch(this.currentStep) {
        case 0:
          // Reset all borrowing states
          this.borrowedFromTens = false;
          this.borrowedFromHundreds = false;
          this.crossedOutOnes = 0;
          this.crossedOutTens = 0;
          this.crossedOutHundreds = 0;
          break;
        case 1:
          // Reset ones subtraction and animation
          this.crossedOutOnes = 0;
          this.animatingOnesResult = false;
          this.onesResultProgress = 0;
          break;
        case 2:
          // Reset hundreds borrowing
          this.borrowedFromHundreds = false;
          break;
        case 3:
          // Reset tens subtraction and animation
          this.crossedOutTens = 0;
          this.animatingTensResult = false;
          this.tensResultProgress = 0;
          break;
        case 4:
          // Reset hundreds subtraction and animation
          this.crossedOutHundreds = 0;
          this.animatingHundredsResult = false;
          this.hundredsResultProgress = 0;
          break;
      }
      
      // Reset animations
      this.animatingTensToOnes = false;
      this.animatingHundredsToTens = false;
      this.animationProgress = 0;
    }
  }
}

// VIEW - Responsible for rendering
class SubtractionView {
  constructor(model) {
    this.model = model;
  }
  
  drawAll() {
    background(255);
    this.drawGrid();
    this.drawBlocks();
    this.drawProblem();
    this.repositionButtons();
  }
  
  repositionButtons() {
    // Update button positions
    const canvasRect = document.querySelector('canvas').getBoundingClientRect();
    
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    backBtn.style.left = (canvasRect.left - 270) + 'px';
    forwardBtn.style.left = (canvasRect.left - 210) + 'px';
    resetBtn.style.right = (canvasRect.right + 400) + 'px';
  }

  
  drawGrid() {
    // Draw the place value columns
    stroke(0);
    strokeWeight(4);
    noStroke();
    noFill();
    
    // Draw grid headers
    textSize(16);
    fill(0, 128, 0);  // Green for hundreds
    text("Hundreds",95, 25);
    
    fill(100, 100, 200);  // Purple for tens
    text("Tens", 265, 25);
    
    fill(255, 140, 0);  // Orange for ones
    text("Ones", 465, 25);

    // Draw the grid with columns sized proportionally to their visual content
    strokeWeight(2);
    noFill();
    
    // Hundreds column
    stroke(0, 128, 0);
    rect(20, 40, 200, 110);
    rect(20, 150, 200, 110);
    
    // Tens column
    stroke(100, 100, 200);
    rect(220, 40, 200, 110);
    rect(220, 150, 200, 110);
    
    // Ones column
    stroke(255, 140, 0);
    rect(420, 40, 200, 110);
    rect(420, 150, 200, 110);
    
    // Dotted lines for separating rows
    stroke(200);
    strokeWeight(1);
    for (let x = 20; x <= 620; x += 4) {
      line(x, 150, x + 2, 150);
    }
  }
  
  drawBlocks() {
    const m = this.model;
    
    // Top row (minuend)
    // Draw hundreds blocks (big green squares)
    fill(0, 128, 0);
    noStroke();
    
    let hundredsToShow = m.hundredsDigit;
    if ((m.currentStep >= 3 && m.needBorrowFromHundreds) || m.animatingHundredsToTens) {
      hundredsToShow--;
    }
    
    // Position hundreds blocks evenly in the column
    const hundredsSpacing = 45;
    for (let i = 0; i < hundredsToShow; i++) {
      rect(45 + (i % 4) * hundredsSpacing, 55 + floor(i / 4) * hundredsSpacing, 37, 37);
    }
    
    // Draw tens blocks (blue vertical lines)
    fill(18, 8, 54);
    
    let tensToShow = m.tensDigit;
    if ((m.currentStep >= 1 && m.needBorrowFromTens) || m.animatingTensToOnes) {
      tensToShow -= 1;
    }
    if (m.currentStep >= 3 && m.needBorrowFromHundreds && !m.animatingHundredsToTens) {
      tensToShow += 10;
    }
    
    // Position tens blocks with reduced spacing for better visibility
    const tensSpacing = 12; // Reduced from 15
    for (let i = 0; i < tensToShow; i++) {
      let x = 230 + i * tensSpacing; // Adjusted position
      let y = 50;
      fill(100, 100, 200); // Purple
      rect(x, y, 7, 85);
      
      if (m.currentStep >= 4 && i >= tensToShow - m.crossedOutTens) {
        stroke(255, 0, 0);
        strokeWeight(2); // Thinner cross line
        line(x, y, x + 7, y + 85); // Cross line exactly on the rectangle
        noStroke();
      }
    }
    
    // Draw ones blocks (orange squares)
    fill(255, 140, 0);
    
    let onesToShow = m.onesDigit;
    if (m.currentStep >= 1 && m.needBorrowFromTens && !m.animatingTensToOnes) {
      onesToShow += 10;
    }
    
    // Position ones blocks evenly
    const onesSpacing = 15;
    for (let i = 0; i < onesToShow; i++) {
      let x = 450 + (i % 10) * onesSpacing;
      let y = 55 + floor(i / 10) * onesSpacing;
      rect(x, y, 11, 11);
      
      if (m.currentStep >= 2 && i >= onesToShow - m.crossedOutOnes) {
        stroke(255, 0, 0);
        strokeWeight(2); // Thinner cross line
        line(x, y, x + 11, y + 11); // Cross line exactly on the square
        noStroke();
      }
    }
    
    // Bottom row (subtrahend)
    if (m.currentStep >= 0) {
      // Draw tens to subtract
      fill(100, 100, 200);
      noStroke();

      for (let i = 0; i < m.subtractTens; i++) {
        let x = 230 + (i % 10) * tensSpacing;
        let y = 165;
        rect(x, y, 7, 85);
        
        if (m.currentStep >= 4 && i < m.crossedOutTens) {
          stroke(255, 0, 0);
          strokeWeight(2); // Thinner cross line
          line(x, y, x + 7, y + 85); // Cross line exactly on the rectangle
          noStroke();
        }
      }
      
      // Draw ones blocks to subtract
      fill(255, 140, 0);
      noStroke();
      
      for (let i = 0; i < m.subtractOnes; i++) {
        let x = 450 + (i % 10) * onesSpacing;
        let y = 165 + floor(i / 10) * onesSpacing;
        rect(x, y, 11, 11);
        
        if (m.currentStep >= 2 && i < m.crossedOutOnes) {
          stroke(255, 0, 0);
          strokeWeight(2); // Thinner cross line
          line(x, y, x + 11, y + 11); // Cross line exactly on the square
          noStroke();
        }
      }
    }
    
    // Draw result blocks with animation - UPDATED
    this.drawResultBlocks(m, tensSpacing, onesSpacing, hundredsSpacing);
    
    // Update animations to match new block positions and sizes
    if (m.animatingTensToOnes || m.animatingHundredsToTens) {
      this.drawMovingBlocks();
    }
  }
  
  // NEW METHOD: Draw result blocks with animations
  drawResultBlocks(m, tensSpacing, onesSpacing, hundredsSpacing) {
    // Draw ones result with animation
    if (m.currentStep >= 2 || m.animatingOnesResult) {
      fill(255, 140, 0); // Orange
      
      for (let i = 0; i < m.result[2]; i++) {
        let startX = 450 + (i % 10) * onesSpacing;
        let startY = 55 + floor(i / 10) * onesSpacing;
        let endX = 450 + (i % 10) * onesSpacing;
        let endY = 290 + floor(i / 10) * onesSpacing;
        
        // If animating, interpolate between start and end positions
        let x = startX;
        let y = startY;
        
        if (m.animatingOnesResult) {
          x = lerp(startX, endX, m.onesResultProgress);
          y = lerp(startY, endY, m.onesResultProgress);
        } else if (m.onesResultProgress == 1) {
          x = endX;
          y = endY;
        }
        
        rect(x, y, 11, 11);
      }
    }
    
    // Draw tens result with animation
    if (m.currentStep >= 4 || m.animatingTensResult) {
      fill(100, 100, 200); // Purple
      
      for (let i = 0; i < m.result[1]; i++) {
        let startX = 230 + i * tensSpacing;
        let startY = 55;
        let endX = 250 + i * tensSpacing;
        let endY = 290;
        
        // If animating, interpolate between start and end positions
        let x = startX;
        let y = startY;
        
        if (m.animatingTensResult) {
          x = lerp(startX, endX, m.tensResultProgress);
          y = lerp(startY, endY, m.tensResultProgress);
        } else if (m.tensResultProgress == 1) {
          x = endX;
          y = endY;
        }
        
        rect(x, y, 7, 85);
      }
    }
    
    // Draw hundreds result with animation
    if (m.currentStep >= 5 || m.animatingHundredsResult) {
      fill(0, 128, 0); // Green
      noStroke();
      
      for (let i = 0; i < m.result[0]; i++) {
        // Changed starting position to use the top row (minuend) position
        let startX = 45 + (i % 4) * hundredsSpacing;
        let startY = 55 + floor(i / 4) * hundredsSpacing;
        let endX = 45 + (i % 4) * hundredsSpacing;
        let endY = 290 + floor(i / 4) * hundredsSpacing;
        
        // If animating, interpolate between start and end positions
        let x = startX;
        let y = startY;
        
        if (m.animatingHundredsResult) {
          x = lerp(startX, endX, m.hundredsResultProgress);
          y = lerp(startY, endY, m.hundredsResultProgress);
        } else if (m.hundredsResultProgress == 1) {
          x = endX;
          y = endY;
        }
        
        rect(x, y, 37, 37);
      }
    }
  }
  
  drawMovingBlocks() {
    const m = this.model;
    const tensSpacing = 12;
    const onesSpacing = 15;
    const hundredsSpacing = 45;
    
    // Animate tens to ones
    if (m.animatingTensToOnes) {
      // Source position (where the tens block is)
      let tensX = 230 + (m.tensDigit - 1) * tensSpacing;
      let tensY = 50;
      
      // Target position (where it will end up in the ones column)
      let onesX = 450;
      let onesY = 55;
      
      // Animation progress split into two phases
      const halfwayPoint = 1;
      
      if (m.animationProgress < halfwayPoint) {
        // PHASE 1: Move the purple line (ten) to ones column
        const phaseProgress = m.animationProgress / halfwayPoint;
        
        // Draw the moving ten as a purple line
        fill(100, 100, 200); // Purple
        let currentX = lerp(tensX, onesX, phaseProgress);
        let currentY = lerp(tensY, onesY, phaseProgress);
        rect(currentX, currentY, 7, 85); // Original ten shape
      } else {
        // PHASE 2: Break down into 10 orange boxes
        const phaseProgress = (m.animationProgress - halfwayPoint) / (1 - halfwayPoint);
        
        fill(255, 140, 0); // Orange
        
        // Start with boxes close together, then spread them out
        for (let i = 0; i < 10; i++) {
          // Calculate spread factor - increases as animation progresses
          const spread = phaseProgress * onesSpacing;
          
          // Position calculations for spreading effect
          let x = onesX + (i % 5) * spread;
          let y = onesY + Math.floor(i / 5) * spread;
          
          // Draw each small orange box
          rect(x, y, 11, 11);
        }
      }
    }
    
    // Animate hundreds to tens
    else if (m.animatingHundredsToTens) {
      // Source position (where the hundreds block is)
      let hundredsX = 45 + (m.hundredsDigit-1 ) * hundredsSpacing;
      let hundredsY = 55;
      
      // Target position (where it will end up in the tens column)
      let tensX = 300;
      let tensY = 50;
      
      // Animation progress split into two phases
      const halfwayPoint = 0.5;
      
      if (m.animationProgress < halfwayPoint) {
        // PHASE 1: Move the green box (hundred) to tens column
        const phaseProgress = m.animationProgress / halfwayPoint;
        
        // Draw the moving hundred as a green box
        fill(0, 128, 0); // Green
        let currentX = lerp(hundredsX, tensX, phaseProgress);
        let currentY = lerp(hundredsY, tensY, phaseProgress);
        rect(currentX, currentY, 37, 37); // Original hundred shape
      } else {
        // PHASE 2: Break down into 10 purple lines
        const phaseProgress = (m.animationProgress - halfwayPoint) / (1 - halfwayPoint);
        
        fill(100, 100, 200); // Purple
        
        // Start with lines close together, then spread them out
        for (let i = 0; i < 10; i++) {
          // Calculate spread factor - increases as animation progresses
          const spread = phaseProgress * tensSpacing;
          
          // Position calculations for spreading effect
          let x = tensX + i * spread;
          let y = tensY;
          
          // Draw each purple line
          rect(x, y, 7, 85);
        }
      }
    }
      
    // Update animation progress handled in model.updateAnimation()
  }
  
  drawProblem() {
    const m = this.model;
    let x = 850; // Adjusted for wider canvas
    let y = 190;
  
    textAlign(RIGHT);
    textSize(36);
  
    // Original digits
    let h1 = m.hundredsDigit;
    let t1 = m.tensDigit;
    let o1 = m.onesDigit;
  
    let h2 = m.subtractHundreds;
    let t2 = m.subtractTens;
    let o2 = m.subtractOnes;
  
    // Draw borrow numbers ABOVE the original digits
    fill('crimson');
    textSize(18);
    
    if (m.needBorrowFromTens && m.currentStep >= 1) {
      text(o1 + 10, x - 65, y - 22);
    }
    
    if (m.needBorrowFromHundreds && m.currentStep >= 3) {
      text(t1 - (m.needBorrowFromTens ? 1 : 0) + 10, x - 90, y - 22);
    }
  
    // Draw original top number digits
    textSize(36);
    fill(0);
    text(h1, x - 110, y);
    text(t1, x - 90, y);
    text(o1, x - 67, y);
    
    // Draw crossout lines
    if (m.currentStep >= 1 && m.needBorrowFromTens) {
      stroke('crimson');
      strokeWeight(2);
      line(x - 90, y - 18, x - 60, y + 7); 
      noStroke();
    }
    
    if (m.currentStep >= 3 && m.needBorrowFromHundreds) {
      stroke('crimson');
      strokeWeight(2);
      line(x - 120, y - 18, x - 85, y + 10); 
      noStroke();
    }
  
    // Draw bottom number
    fill(0);
    text("-", x - 155, y + 45);
    text(h2, x - 110, y + 45);
    text(t2, x - 90, y + 45);
    text(o2, x - 67, y + 45);
  
    // Draw line
    stroke(0);
    strokeWeight(2);
    line(x - 150, y + 60, x - 50, y + 60);
    noStroke();
  
    // Define consistent positions for result digits
    const hundredsResultX = x - 110;
    const tensResultX = x - 90;
    const onesResultX = x - 67;
    const resultY = y + 100;
  
    // Show results based on steps with consistent positions
    if (m.currentStep >= 5) {
      // Show all digits
      fill(0, 128, 0);  // Green for hundreds
      text(m.result[0], hundredsResultX, resultY);
      
      fill(100, 100, 200);  // Purple for tens
      text(m.result[1], tensResultX, resultY);
      
      fill(255, 140, 0);  // Orange for ones
      text(m.result[2], onesResultX, resultY);
    } else if (m.currentStep >= 4) {
      // Show tens and ones only
      fill(100, 100, 200);  // Purple for tens
      text(m.result[1], tensResultX, resultY);
      
      fill(255, 140, 0);  // Orange for ones
      text(m.result[2], onesResultX, resultY);
    } else if (m.currentStep >= 2) {
      // Show ones only
      fill(255, 140, 0);  // Orange for ones
      text(m.result[2], onesResultX, resultY);
    }
  }
  
  // Update repositionButtons for new canvas size
  repositionButtons() {
    // // Update button positions
    // const canvasRect = document.querySelector('canvas').getBoundingClientRect();
    // const backBtn = document.getElementById('backBtn');
    // const forwardBtn = document.getElementById('forwardBtn');
    // const resetBtn = document.getElementById('resetBtn');
    
    // backBtn.style.left = (canvasRect.left - 200) + 'px';
    // forwardBtn.style.left = (canvasRect.left - 150) + 'px';
    // resetBtn.style.right = (canvasRect.right + 350) + 'px'; // Adjusted for wider canvas

  }

}

// CONTROLLER - Handles user input and connects model to view
class SubtractionController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    // store buttons 
    this.backBtn = document.getElementById('backBtn');
    this.forwardBtn = document.getElementById('forwardBtn');
    this.resetBtn = document.getElementById('resetBtn');
    

    //set up event 
    this.resetBtn.style.display="none";
    // Set up event listeners
    this.setupEventListeners();

    // intialize button states
    this.updateButtonStates();
  }
  
  setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => this.prevStep());
    document.getElementById('forwardBtn').addEventListener('click', () => this.nextStep());
    document.getElementById('resetBtn').addEventListener('click', () => this.newProblem());

  }
  
  newProblem() {
    
    this.model.generateNewProblem();
    this.resetBtn.style.display='none';
    this.updateButtonStates();
  }
  
  nextStep() {
    if (this.isAnimationInProgress()){
      return;
    }
    this.model.nextStep();
    this.updateButtonStates();
  }


  
  prevStep() {
    this.model.prevStep();
    this.updateButtonStates();
  }
  isAnimationInProgress() {
    return (
      this.model.animatingTensToOnes || 
      this.model.animatingHundredsToTens ||
      this.model.animatingOnesResult ||
      this.model.animatingTensResult ||
      this.model.animatingHundredsResult
    );
  }

  updateButtonStates(){
    if (this.model.currentStep>= this.model.maxStep){
      this.resetBtn.style.display='block';
    }
    else {
      this.resetBtn.style.display = 'none';
    }
    if (this.isAnimationInProgress() || this.model.currentStep >= this.model.maxStep) {
      this.forwardBtn.disabled = true;
    } else {
      this.forwardBtn.disabled = false;
    }
    this.backBtn.disabled=false;
  }


  
  update() {
    this.model.updateAnimation();
    this.view.drawAll();

    this.updateButtonStates();
  }
}

// Setup and main P5 functions
let model;
let view;
let controller;


function setup() {
  const canvas = createCanvas(850, 400); // Increased from 700 to 850 for wider columns
  canvas.parent(document.querySelector('.canvas'));
  
  textAlign(CENTER, CENTER);
  
  // Initialize MVC components
  model = new SubtractionModel();
  view = new SubtractionView(model);
  controller = new SubtractionController(model, view);

 
  
  // Generate initial problem
  model.generateNewProblem();
}


function draw() {
  controller.update();
}