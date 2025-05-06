// MVC Pattern Implementation for Multiples Game

// Model - Handles data and business logic
class Model {
    constructor() {
      this.numbers = Array.from({ length: 100 }, (_, i) => i + 1);
      this.selectedNumbers = new Set();
      this.firstNum = 0;
      this.secondNum = 0;
      this.correctAnswers = new Set();
      this.tries = 3;
      this.gameState = 'playing'; // playing, solved, failed
      this.generateQuestion();
      this.justChecked = false;
    }
  
    generateQuestion() {
      // Choose two numbers for the question
      const possibleFirstNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      const possibleSecondNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      
      // Make sure we generate different numbers
      do {
        this.firstNum = possibleFirstNumbers[Math.floor(Math.random() * possibleFirstNumbers.length)];
        this.secondNum = possibleSecondNumbers[Math.floor(Math.random() * possibleSecondNumbers.length)];
      } while (this.firstNum === this.secondNum);
      
      // Calculate correct answers (common multiples within 1-100)
      this.correctAnswers.clear();
      
      // Find LCM of the two numbers
      const lcm = this.calculateLCM(this.firstNum, this.secondNum);
      
      // Find all multiples of the LCM within range 1-100
      let multiple = lcm;
      while (multiple <= 100) {
        this.correctAnswers.add(multiple);
        multiple += lcm;
      }
      
      // Reset game state
      this.selectedNumbers.clear();
      this.tries = 3;
      this.gameState = 'playing';
    }
    
    calculateLCM(a, b) {
      // Helper function to calculate GCD
      const gcd = (x, y) => {
        while (y) {
          const temp = y;
          y = x % y;
          x = temp;
        }
        return x;
      };
      
      // LCM = (a * b) / gcd(a, b)
      return (a * b) / gcd(a, b);
    }
    
    // toggleNumber(num) {
    //   if (this.gameState === 'playing') {
    //     if (this.selectedNumbers.has(num)) {
    //       this.selectedNumbers.delete(num);
    //     } else {
    //       this.selectedNumbers.add(num);
    //     }
    //     return true;
    //   }
    //   return false;
    // }
    toggleNumber(num) {
      if (this.gameState === 'playing') {
        if (this.selectedNumbers.has(num)) {
          this.selectedNumbers.delete(num);
        } else {
          this.selectedNumbers.add(num);
        }
        this.justChecked = false; // Reset the flag when user selects a new number
        return true;
      }
      return false;
    }
    checkAnswers() {
      this.justChecked = true; 
        if (this.selectedNumbers.size === 0) {
          this.feedbackMessage = "Select at least one number";
          return { correct: false, message: this.feedbackMessage };
        }
      
        for (const num of this.selectedNumbers) {
          if (!this.correctAnswers.has(num)) {
            this.tries--;
            this.feedbackMessage = "You have selected at least one number that is not a common multiple";
            if (this.tries <= 0) {
              this.gameState = 'failed';
              return { 
                correct: false, 
                message: this.feedbackMessage,
                showSolution: true 
              };
            }
      
            return { 
              correct: false, 
              message: this.feedbackMessage,
              showSolution: false 
            };
          }
        }
      
        if (this.selectedNumbers.size === this.correctAnswers.size) {
          this.feedbackMessage = "All correct!";
          this.gameState = 'solved';
          return { correct: true, message: this.feedbackMessage };
        } else {
          this.tries--;
          this.feedbackMessage = "You missed some common multiples";
          
          if (this.tries <= 0) {
            this.gameState = 'failed';
            return { 
              correct: false, 
              message: this.feedbackMessage,
              showSolution: true 
            };
          }
      
          return { 
            correct: false, 
            message: this.feedbackMessage,
            showSolution: false 
          };
        }
      }
      
    
    isCorrectAnswer(num) {
      return this.correctAnswers.has(num);
    }
    
    isSelected(num) {
      return this.selectedNumbers.has(num);
    }
    
  }
  
  // View - Handles the rendering
  class View {
    constructor() {
      this.canvas = null;
      this.checkBtn = document.getElementById('check-btn');
      this.newBtn = document.getElementById('new-btn');
      this.triesSpan = document.getElementById('tries');
      
     //  Grid layout properties
      this.numbersPerRow = 10;
      this.cellSize = 30;
      this.gridOffsetX = 25;
      this.gridOffsetY = 80;
      this.resultText = "";
    this.resultTextColor = "#000000";
    
    }
    
    setup(p) {
      this.canvas = p.createCanvas(800, 400);
      this.canvas.parent('canvas-container');
    }
    
    draw(p, model) {
      p.background(255);
      
      // Draw the question
      p.textSize(20);
      p.textAlign(p.LEFT, p.TOP);
      p.fill(0);
      p.text(`Select all of the common multiples of ${model.firstNum} and ${model.secondNum}.`, 20, 20);
      
      // Draw the number grid
      p.textSize(16);
      p.textAlign(p.CENTER, p.CENTER);
      

   
    for (let i = 0; i < 100; i++) {
        const num = i + 1;
        const row = Math.floor(i / this.numbersPerRow);
        const col = i % this.numbersPerRow;
      
        const x = this.gridOffsetX + col * this.cellSize;
        const y = this.gridOffsetY + row * this.cellSize;
      
        const isSelected = model.isSelected(num);
        const isCorrect = (model.gameState === 'failed' || model.gameState === 'solved') && model.isCorrectAnswer(num);
      
        // Draw rectangle background for selected numbers
        if (isSelected) {
          p.fill(255, 200, 200); // light red background
          p.noStroke();
          p.rect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4, 6); // slightly inset rounded rect
        }
      
        // Draw border for correct answer
        if (isCorrect) {
          p.noFill();
          p.stroke(0, 180, 0); // green border
          p.strokeWeight(2);
          p.rect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4, 6);
        }
      
        // Draw the number
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);
        if (isSelected) {
          p.fill(200, 50, 50); // red text if selected
        } else {
          p.fill(0); // default text
        }
        p.noStroke();
        p.text(num, x + this.cellSize / 2, y + this.cellSize / 2);
      }
      
// Show result message only if game is still playing
// Draw feedback or solution — but not both
if (model.gameState === 'playing' && this.resultText) {
    p.textSize(18);
    p.textAlign(p.LEFT, p.TOP);
    p.fill(this.resultTextColor);
    p.text(this.resultText, 400, 250, 400); // Show feedback at solution position
  } else if (model.gameState === 'solved') {
    // When all answers are correct, just show success message
    p.textSize(20);
    p.textAlign(p.LEFT, p.TOP);
    p.fill(0, 180, 0);
    p.text("All correct!", 400, 250);
}
   else if (model.gameState === 'failed' || model.gameState === 'solved') {
    // Draw solution only when game is over
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.fill(0, 120, 0);
    p.text("Solution", 400, 220);
    p.text(`All the common multiples of ${model.firstNum} and ${model.secondNum} are circled.`, 400, 250);
    p.text(`Notice that each of the common multiples`, 400, 280);
    p.text(`are divisible by ${model.firstNum} and ${model.secondNum}.`, 400, 310);
  }
      // Update the tries counter
      this.triesSpan.textContent = model.tries;
    }
    
    setResultMessage(message, isCorrect) {
      this.resultText = message;
      this.resultTextColor = isCorrect ? "#008800" : "#cc0000";
    }
    
    
    
    updateButtonsState(model) {
      // Disable check button if: no numbers selected OR game over OR just checked
      this.checkBtn.disabled = model.selectedNumbers.size === 0 || 
                               model.gameState !== 'playing' || 
                               model.justChecked;
      
      // Show/hide new button based on game state
      this.newBtn.style.display = model.gameState !== 'playing' ? 'block' : 'none';
    }
    getNumberAtPosition(p, x, y) {
      // Convert mouse position to grid position
      const col = Math.floor((x - this.gridOffsetX) / this.cellSize);
      const row = Math.floor((y - this.gridOffsetY) / this.cellSize);
      
      // Check if within grid bounds
      if (col >= 0 && col < this.numbersPerRow && row >= 0 && row < 10) {
        return row * this.numbersPerRow + col + 1;
      }
      
      return -1;
    }
  }
  
  // Controller - Handles user interaction
  class Controller {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.p5Instance = null;
      
      // Initialize p5
      this.initP5();
      
      // Add event listeners for buttons
      document.getElementById('check-btn').addEventListener('click', () => this.checkAnswers());
      document.getElementById('new-btn').addEventListener('click', () => this.newQuestion());
      document.getElementById('messageArea').innerText = result.message;


    }
    
    initP5() {
      const sketch = (p) => {
        p.setup = () => {
          this.view.setup(p);
        };
        
        p.draw = () => {
          this.view.draw(p, this.model);
          this.view.updateButtonsState(this.model);
        };
        
        p.mousePressed = () => {
          if (p.mouseX >= 0 && p.mouseX <= p.width && 
              p.mouseY >= 0 && p.mouseY <= p.height) {
            const num = this.view.getNumberAtPosition(p, p.mouseX, p.mouseY);
            if (num > 0) {
              const changed = this.model.toggleNumber(num);
              if (changed) {
                this.view.updateButtonsState(this.model);
              }
            }
          }
        };
      };
      
      this.p5Instance = new p5(sketch);
    }
    
    checkAnswers() {
      const result = this.model.checkAnswers();
      if (!result.showSolution) {
        this.view.setResultMessage(result.message, result.correct);
        
      } else {
        this.view.setResultMessage("", false); // Clear message when showing solution
      }
      
      this.view.updateButtonsState(this.model);
    }
    
    newQuestion() {
      this.model.generateQuestion();
      this.view.setResultMessage("", false);
      this.view.updateButtonsState(this.model);
    }
  }
  
  // Initialize the application
  window.onload = () => {
    const model = new Model();
    const view = new View();
    const controller = new Controller(model, view);
  };