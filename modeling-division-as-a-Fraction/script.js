
      // MVC Pattern Implementation

      // Model - Stores the data and business logic
      class DivisionModel {
        constructor() {
          this.divisorOptions = {
            "5:3": { numerator: 5, denominator: 3 },
            "5:2": { numerator: 5, denominator: 2 },
            "4:3": { numerator: 4, denominator: 3 },
            "3:2": { numerator: 3, denominator: 2 },
            "2:3": { numerator: 2, denominator: 3 },
            "1:3": { numerator: 1, denominator: 3 },
            "1:2": { numerator: 1, denominator: 2 },
            
          };
          this.selectedOption = "5:3";
          this.animationProgress = 0;
        }

        getNumerator() {
          return this.divisorOptions[this.selectedOption].numerator;
        }

        getDenominator() {
          return this.divisorOptions[this.selectedOption].denominator;
        }

        setSelectedOption(option) {
          if (this.divisorOptions[option]) {
            this.selectedOption = option;
          }
        }

        setAnimationProgress(progress) {
          this.animationProgress = progress;
        }

        getAnimationStage() {
          if (this.animationProgress < 33) {
            return 0; // Empty circles
          } else if (this.animationProgress < 66) {
            return 1; // Divided circles
          } else {
            return 2; // Extracted parts
          }
        }

        // Calculate animation transition for the extracted parts
        getTransitionProgress() {
          if (this.animationProgress < 66) {
            return 0;
          } else {
            // Map 66-100 to 0-1 for the transition
            return (this.animationProgress - 66) / 34;
          }
        }
      }

      // View - Renders the UI elements using P5.js
class DivisionView {
  constructor(model, p) {
    this.model = model;
    this.p = p;
    this.colors = {
      pink: p.color(255, 105, 180),
      lightGray: p.color(200, 200, 200),
      darkGray: p.color(150, 150, 150),
      dropdownBg: p.color(250, 250, 250, 255), // Semi-transparent white background
      dropdownHighlight: p.color(220, 240, 255), // Light blue highlight
      dropdownBorder: p.color(80, 100, 140), // Darker blue border
      dropdownText: p.color(20, 20, 20) // Dark text
    };
    this.dropdownVisible = false;
    this.dropdownOptions = Object.keys(model.divisorOptions);
    this.dropdownSelected = 0;
    this.buttonX = 220;
    this.buttonY = 30;
    this.buttonWidth = 80;
    this.buttonHeight = 30;
  }

        // drawDropdown() {
        //   // Draw dropdown button
        //   this.p.fill(245);
          
        //   this.p.strokeWeight(1);
        //   this.p.rect(
        //     this.buttonX,
        //     this.buttonY,
        //     this.buttonWidth,
        //     this.buttonHeight
        //   );

        //   // Draw label
        //   this.p.fill(0);
        //   this.p.stroke(0);
        //   this.p.noStroke();
        //   this.p.textSize(16);
        //   this.p.textAlign(this.p.LEFT, this.p.CENTER);
        //   this.p.text(
        //     "Select a division problem:",
        //     20,
        //     this.buttonY + this.buttonHeight / 2
        //   );

        //   // Draw selected option
        //   this.p.text(
        //     this.dropdownOptions[this.dropdownSelected].replace(":", " ÷ "),
        //     this.buttonX + 10,
        //     this.buttonY + this.buttonHeight / 2
        //   );

        //   // Draw dropdown arrow
        //   this.p.fill(0);
        //   this.p.triangle(
        //     this.buttonX + this.buttonWidth - 15,
        //     this.buttonY + 10,
        //     this.buttonX + this.buttonWidth - 5,
        //     this.buttonY + 10,
        //     this.buttonX + this.buttonWidth - 10,
        //     this.buttonY + 20
        //   );

        //   // Draw dropdown options if open
        //   if (this.dropdownVisible) {
        //     for (let i = 0; i < this.dropdownOptions.length; i++) {
             
        //       this.p.fill(i === this.dropdownSelected ? 220 : 255);              
        //       this.p.fill(253);
        //       this.p.stroke(1);
        //       this.p.rect(
        //         this.buttonX,
        //         this.buttonY + (i + 1) * this.buttonHeight,
        //         this.buttonWidth,
        //         this.buttonHeight
        //       );
        //       this.p.fill(0);
        //       this.p.noStroke();
        //       this.p.textAlign(this.p.LEFT, this.p.CENTER);
        //       this.p.text(
        //         this.dropdownOptions[i].replace(":", " ÷ "),
        //         this.buttonX + 10,
        //         this.buttonY +
        //           (i + 1) * this.buttonHeight +
        //           this.buttonHeight / 2
        //       );
        //     }
        //   }
        // }
// In the DivisionView class, modify the drawDropdown method

drawDropdown() {
    // Draw dropdown button
    this.p.fill(245);
    this.p.strokeWeight(1);
    this.p.rect(
      this.buttonX,
      this.buttonY,
      this.buttonWidth,
      this.buttonHeight
    );

    // Draw label
    this.p.fill(0);
    this.p.stroke(0);
    this.p.noStroke();
    this.p.textSize(16);
    this.p.textAlign(this.p.LEFT, this.p.CENTER);
    this.p.text(
      "Select a division problem:",
      20,
      this.buttonY + this.buttonHeight / 2
    );

    // Draw selected option
    this.p.text(
      this.dropdownOptions[this.dropdownSelected].replace(":", " ÷ "),
      this.buttonX + 10,
      this.buttonY + this.buttonHeight / 2
    );

    // Draw dropdown arrow
    this.p.fill(0);
    this.p.triangle(
      this.buttonX + this.buttonWidth - 15,
      this.buttonY + 10,
      this.buttonX + this.buttonWidth - 5,
      this.buttonY + 10,
      this.buttonX + this.buttonWidth - 10,
      this.buttonY + 20
    );

    // Draw dropdown options if open
    if (this.dropdownVisible) {
      // Draw a semi-transparent panel with border for dropdown
      this.p.push(); // Save current drawing state
      this.p.fill(this.colors.dropdownBg); // Semi-transparent background
      this.p.stroke(this.colors.dropdownBorder);
      this.p.strokeWeight(2);
      this.p.rect(
        this.buttonX,
        this.buttonY + this.buttonHeight,
        this.buttonWidth,
        this.buttonHeight * this.dropdownOptions.length,
        5 // Rounded corners
      );
      this.p.pop(); // Restore drawing state
      
      for (let i = 0; i < this.dropdownOptions.length; i++) {
        // Option background - hover effect for selected option
        this.p.fill(i === this.dropdownSelected ? this.colors.dropdownHighlight : this.colors.dropdownBg);
        // this.p.stroke(this.colors.dropdownBorder);
        this.p.strokeWeight(1);
        this.p.rect(
          this.buttonX + 2, // Small indent
          this.buttonY + (i + 1) * this.buttonHeight + 2, // Small indent
          this.buttonWidth - 4, // Slightly smaller
          this.buttonHeight - 4, // Slightly smaller
          3 // Rounded corners
        );
        
        // Option text
        this.p.fill(this.colors.dropdownText);
        this.p.noStroke();
        this.p.textAlign(this.p.LEFT, this.p.CENTER);
        this.p.text(
          this.dropdownOptions[i].replace(":", " ÷ "),
          this.buttonX + 10,
          this.buttonY +
            (i + 1) * this.buttonHeight +
            this.buttonHeight / 2
        );
      }
    }
  }

        handleMouseClick(x, y) {
          // Check if click is on the dropdown button
          if (
            x > this.buttonX &&
            x < this.buttonX + this.buttonWidth &&
            y > this.buttonY &&
            y < this.buttonY + this.buttonHeight
          ) {
            this.dropdownVisible = !this.dropdownVisible;
            return true;
          }

          // Check if click is on a dropdown option
          if (this.dropdownVisible) {
            for (let i = 0; i < this.dropdownOptions.length; i++) {
              if (
                x > this.buttonX &&
                x < this.buttonX + this.buttonWidth &&
                y > this.buttonY + (i + 1) * this.buttonHeight &&
                y < this.buttonY + (i + 2) * this.buttonHeight
              ) {
                this.dropdownSelected = i;
                this.model.setSelectedOption(this.dropdownOptions[i]);
                this.dropdownVisible = false;
                return true;
              }
          
              
            }
             
          }

          // Close dropdown if click is outside
          if (this.dropdownVisible) {
            this.dropdownVisible = false;
            return true;
          }

          return false;
        }

    

        drawEmptyCircles(x, y, size, count) {
          for (let i = 0; i < count; i++) {
            this.p.noFill();
            this.p.stroke(0);
            this.p.strokeWeight(2);
            this.p.ellipse(x + i * (size + 20), y, size, size);
          }
        }

        drawDividedCircles(x, y, size, count, parts) {
          for (let i = 0; i < count; i++) {
            this.p.noFill();
            this.p.stroke(0);
            this.p.strokeWeight(2);
            this.p.ellipse(x + i * (size + 20), y, size, size);

            // Draw pie divisions
            for (let j = 0; j < parts; j++) {
              let startAngle = j * ((2 * Math.PI) / parts);
              let endAngle = (j + 1) * ((2 * Math.PI) / parts);

              this.p.stroke(0);
              this.p.strokeWeight(1);
              this.p.line(
                x + i * (size + 20),
                y,
                x + i * (size + 20) + (Math.cos(startAngle) * size) / 2,
                y + (Math.sin(startAngle) * size) / 2
              );
            }
          }
        }

        drawColoredCircles(x, y, size, count, parts, transitionProgress = 0) {
          const radius = size / 2;
          const centerX = x;
          const centerY = y;

          for (let i = 0; i < count; i++) {
            // Draw the circle outline
            this.p.noFill();
            this.p.stroke(0);
            this.p.strokeWeight(2);
            this.p.ellipse(centerX + i * (size + 20), centerY, size, size);

            // Draw the sections
            for (let j = 0; j < parts; j++) {
              const startAngle = j * ((2 * Math.PI) / parts);
              const endAngle = (j + 1) * ((2 * Math.PI) / parts);

              // Determine section color - every third part is pink
              let sectionColor;
              if (j % 3 === 0) {
                sectionColor = this.colors.pink;
              } else if (j % 3 === 1) {
                sectionColor = this.colors.darkGray;
              } else {
                sectionColor = this.colors.lightGray;
              }

              this.p.fill(sectionColor);
              this.p.stroke(0);
              this.p.strokeWeight(1);

            
              this.p.fill(sectionColor);
              this.p.stroke(0);
              this.p.strokeWeight(1);
              this.p.arc(
                centerX + i * (size + 20), // x
                centerY, // y
                size, // width
                size, // height
                startAngle, // start angle
                endAngle, // end angle
                this.p.PIE // mode: PIE fills the area between arc and center
              );
            }
          }

          // Extract pink sections if needed
          if (transitionProgress > 0) {
            this.drawExtractedParts(
              x,
              y,
              size,
              count,
              parts,
              transitionProgress
            );
          }
        }

        drawExtractedParts(x, y, size, count, parts, transitionProgress) {
          const radius = size / 2;
          const extractedY = y + 100; // Position below the original circles

          // For each circle
          for (let i = 0; i < count; i++) {
            const centerX = x + i * (size + 20);

            // For each section in the circle
            for (let j = 0; j < parts; j++) {
              // Only extract pink sections (every third section)
              if (j % 3 === 0) {
                const startAngle = j * ((2 * Math.PI) / parts);
                const endAngle = (j + 1) * ((2 * Math.PI) / parts);

                // Calculate the position for the extracted part
                // Linear interpolation between original position and final extracted position
                const moveY = transitionProgress * 100;
                const sectionY = y + moveY;

                this.p.fill(this.colors.pink);
                this.p.stroke(0);
                this.p.strokeWeight(1);

                // Draw the extracted section
                this.p.beginShape();
                this.p.vertex(centerX, sectionY);

                for (let angle = startAngle; angle <= endAngle; angle += 0.1) {
                  const px = centerX + Math.cos(angle) * radius;
                  const py = sectionY + Math.sin(angle) * radius;
                  this.p.vertex(px, py);
                }

                this.p.vertex(centerX, sectionY);
                this.p.endShape(this.p.CLOSE);
              }
            }
          }
        }

        drawEquation(x, y) {
          const numerator = this.model.getNumerator(); // e.g., 5
          const denominator = this.model.getDenominator(); // e.g., 2

          this.p.fill(0);
          this.p.noStroke();
          this.p.textSize(24);
          this.p.textAlign(this.p.LEFT, this.p.CENTER);

          // Draw initial part: "5 ÷ 2 = 5 ×"
          const part1 = `${numerator} ÷ ${denominator} = ${numerator} ×`;
          this.p.text(part1, x, y);
          let offsetX = x + this.p.textWidth(part1) + 10;

          // ----- Fraction: 1 / denominator -----
          const num1 = "1";
          const denom1 = denominator.toString();
          const numWidth1 = this.p.textWidth(num1);
          const denomWidth1 = this.p.textWidth(denom1);
          const fracWidth1 = Math.max(numWidth1, denomWidth1) + 10;

          const centerX1 = offsetX + fracWidth1 / 2;

          this.p.textAlign(this.p.CENTER, this.p.CENTER);
          this.p.text(num1, centerX1, y - 20); // numerator
          this.p.stroke(0);
          this.p.line(
            centerX1 - fracWidth1 / 2,
            y,
            centerX1 + fracWidth1 / 2,
            y
          ); // fraction bar
          this.p.noStroke();
          this.p.text(denom1, centerX1, y + 20); // denominator

          // ----- Equal sign -----
          offsetX += fracWidth1 + 20;
          this.p.textAlign(this.p.LEFT, this.p.CENTER);
          this.p.text("=", offsetX, y);
          offsetX += this.p.textWidth("=") + 10;

          // ----- Fraction: numerator / denominator -----
          const num2 = numerator.toString();
          const denom2 = denominator.toString();
          const numWidth2 = this.p.textWidth(num2);
          const denomWidth2 = this.p.textWidth(denom2);
          const fracWidth2 = Math.max(numWidth2, denomWidth2) + 10;

          const centerX2 = offsetX + fracWidth2 / 2;

          this.p.textAlign(this.p.CENTER, this.p.CENTER);
          this.p.text(num2, centerX2, y - 20); // numerator
          this.p.stroke(0);
          this.p.line(
            centerX2 - fracWidth2 / 2,
            y,
            centerX2 + fracWidth2 / 2,
            y
          ); // fraction bar
          this.p.noStroke();
          this.p.text(denom2, centerX2, y + 20); // denominator

          // Reset alignment
          this.p.textAlign(this.p.LEFT, this.p.CENTER);
        }

        // render() {
        //   this.p.background(255);

        //   // Draw dropdown at the top
        //   this.drawDropdown();

        //   const numerator = this.model.getNumerator();
        //   const denominator = this.model.getDenominator();
        //   const animationStage = this.model.getAnimationStage();
        //   const transitionProgress = this.model.getTransitionProgress();
        //   const circleSize = 60;
        //   const circleY = 150;

        //   // Render based on animation stage
        //   if (animationStage === 0) {
        //     this.drawEmptyCircles(100, circleY, circleSize, numerator);
        //   } else if (animationStage === 1) {
        //     this.drawDividedCircles(
        //       100,
        //       circleY,
        //       circleSize,
        //       numerator,
        //       denominator
        //     );
        //   } else {
        //     this.drawColoredCircles(
        //       100,
        //       circleY,
        //       circleSize,
        //       numerator,
        //       denominator,
        //       transitionProgress
        //     );
        //   }

        //   // Draw equation
        //   this.drawEquation(50, 350);
        // }
 render() {
    this.p.background(255);

    // Draw the circles and equation FIRST (before dropdown)
    const numerator = this.model.getNumerator();
    const denominator = this.model.getDenominator();
    const animationStage = this.model.getAnimationStage();
    const transitionProgress = this.model.getTransitionProgress();
    const circleSize = 60;
    const circleY = 150; // Use fixed position, dropdown will overlay
    
    // Always render circles in a fixed position
    if (animationStage === 0) {
      this.drawEmptyCircles(100, circleY, circleSize, numerator);
    } else if (animationStage === 1) {
      this.drawDividedCircles(
        100,
        circleY,
        circleSize,
        numerator,
        denominator
      );
    } else {
      this.drawColoredCircles(
        100,
        circleY,
        circleSize,
        numerator,
        denominator,
        transitionProgress
      );
    }

    // Draw equation in fixed position
    this.drawEquation(50, circleY + 200);
    
    // Draw dropdown LAST so it appears on top
    this.drawDropdown();
  }
}




      // Controller - Handles user input and updates the model
      class DivisionController {
        constructor(model, view, p) {
          this.model = model;
          this.view = view;
          this.p = p;

          // Set up external slider event listener
document.getElementById("play-btn").addEventListener("click", () => {
  let progress = 0;
  const duration = 3000; // total time in ms
  const steps = 100; // number of steps (can match slider steps)
  const intervalTime = duration / steps;

  const interval = setInterval(() => {
    if (progress > 100) {
      clearInterval(interval); // stop animation
      return;
    }
    document.getElementById("animation-slider").value = progress;
    this.model.setAnimationProgress(progress);
    this.view.render();
    progress++;
  }, intervalTime);
});
            


            
        }

        handleMousePressed() {
          return this.view.handleMouseClick(this.p.mouseX, this.p.mouseY);
        }
      }

      // P5.js setup
      new p5((p) => {
        let model, view, controller;

        p.setup = function () {
          let canvas = p.createCanvas(800, 400);
          canvas.parent("canvas-container");

          // Initialize MVC components
          model = new DivisionModel();
          view = new DivisionView(model, p);
          controller = new DivisionController(model, view, p);

          // Initial render
          view.render();
        };

        p.draw = function () {
          // P5 will keep calling this, but we only re-render when needed
        };

        p.mousePressed = function () {
          if (controller.handleMousePressed()) {
            view.render();
          }
         // reset the slider value when the mouse is pressed
          document.getElementById("animation-slider").value = 0;
          model.setAnimationProgress(0);
        };


    
      });
 