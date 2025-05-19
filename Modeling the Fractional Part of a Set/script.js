// =====================
      // MODEL
      // =====================
      class FractionStarsModel {
        constructor() {
          this.total = 35;
          this.numerator = 2;
          this.denominator = 7;
          this.groups = 1;
          this.maxGroups = 10;
          this.correctAnswer = this.calculateCorrectAnswer();
          this.selectedGroups = [];
          this.generateRandomProblem(); // Set random initial conditions
        }

        generateRandomProblem() {
          this.denominator = Math.floor(Math.random() * 9) + 2;
          this.numerator =
          Math.floor(Math.random() * (this.denominator - 1)) + 1;
          this.total = Math.floor(Math.random() * 16) * 2 + 10;
          this.groups = 1;
          this.correctAnswer = this.calculateCorrectAnswer();
          this.selectedGroups = [];
          return {
            numerator: this.numerator,
            denominator: this.denominator,
            total: this.total,
          };
        }

        calculateCorrectAnswer() {
          return (this.numerator * this.total) / this.denominator;
        }

        getCorrectNumberOfGroups() {
          return this.denominator;
        }

        updateGroups(newGroups) {
          this.groups = newGroups;
          this.selectedGroups = [];
          return this.calculateGroupSizes();
        }

        calculateGroupSizes() {
          const starsPerGroup = Math.floor(this.total / this.groups);
          const groupSizes = Array(this.groups).fill(starsPerGroup);
          return groupSizes;
        }

        toggleGroupSelection(groupIndex) {
          const index = this.selectedGroups.indexOf(groupIndex);
          if (index === -1) {
            this.selectedGroups.push(groupIndex);
          } else {
            this.selectedGroups.splice(index, 1);
          }
          return this.selectedGroups;
        }

        checkAnswer() {
          if (this.groups === this.denominator) {
            return this.selectedGroups.length === this.numerator;
          }
          return false;
        }

        isCorrectGroupCount() {
          return this.groups === this.denominator;
        }

        getGroupingText() {
          const itemsPerWholeGroup = Math.floor(this.total / this.groups);
          const remainder = this.total % this.groups;
          if (remainder === 0) {
            return `${this.total} = ${this.groups} groups of ${itemsPerWholeGroup}`;
          } else {
            return `${this.total} = ${this.groups} groups of ${itemsPerWholeGroup} + ${remainder}`;
          }
        }

        getSelectedStarsCount() {
          const groupSizes = this.calculateGroupSizes();
          let totalStars = 0;
          this.selectedGroups.forEach((index) => {
            totalStars += groupSizes[index];
          });
          return totalStars;
        }
      }

      // =====================
      // VIEW
      // =====================
      class FractionStarsView {
        constructor(controller) {
          this.controller = controller;
          this.p5Instance = null;
          this.groupsData = [];
          this.extraStarsData = [];
          this.showSelectInstruction = false;
          this.showSolutionMessage = false;

          this.canvasWidth = 700;
          this.canvasHeight = 450;
          this.headerHeight = 80;
          this.starColor = "#e83e8c";
          this.correctStarColor = "#0c361a"; // Green for correct groups
          this.starSize = 20;
          this.starMargin = 3;
          this.groupPadding = 3;
          this.groupBorderColor = "#333";
          this.groupSelectedColor = "rgba(255, 165, 0, 0.3)";
          
          // Fraction display settings
          this.fractionLineWidth = 2;
          this.fractionLineColor = "#000";
          this.fractionPadding = 3;
          this.fractionSpacing = 2;

          this.initializeP5();
          this.bindEvents();
        }

        initializeP5() {
          const that = this;
          new p5(function (p) {
            that.p5Instance = p;
            p.setup = function () {
              p.createCanvas(that.canvasWidth, that.canvasHeight);
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(16);
              that.updateDisplay();
            };
            p.draw = function () {
              p.background(255);
              that.drawHeader(p);
              that.drawGroups(p);
              that.drawExtraStars(p);
              if (that.showSolutionMessage) {
                that.drawSolutionMessage(p);
              } else {
                that.drawGroupingText(p);
              }
              if (that.showSelectInstruction) {
                that.drawSelectInstruction(p);
              }
            };
            p.mousePressed = function () {
              if (
                p.mouseX >= 0 &&
                p.mouseX <= that.canvasWidth &&
                p.mouseY >= that.headerHeight &&
                p.mouseY <= that.canvasHeight
              ) {
                for (let i = 0; i < that.groupsData.length; i++) {
                  const group = that.groupsData[i];
                  if (
                    p.mouseX >= group.x &&
                    p.mouseX <= group.x + group.width &&
                    p.mouseY >= group.y &&
                    p.mouseY <= group.y + group.height
                  ) {
                    that.controller.handleGroupClick(i);
                    break;
                  }
                }
              }
            };
          }, document.getElementById("p5-container"));
        }

        bindEvents() {
          document
            .getElementById("groupSlider")
            .addEventListener("input", () => {
              const value = parseInt(
                document.getElementById("groupSlider").value
              );
              this.controller.handleSliderChange(value);
            });
          document
            .getElementById("new-problem-btn")
            .addEventListener("click", () => {
              this.controller.generateNewProblem();
            });
        }
        
        // Helper method to draw a fraction
        drawFraction(p, numerator, denominator, x, y, fontSize) {
          p.push();
          const originalTextSize = fontSize || p.textSize();
          
          // Calculate sizes
          p.textSize(originalTextSize);
          const numWidth = p.textWidth(numerator.toString());
          const denomWidth = p.textWidth(denominator.toString());
          const fractionWidth = Math.max(numWidth, denomWidth) + this.fractionPadding * 2;
          
          // Draw numerator
          p.textSize(originalTextSize);
          p.textAlign(p.CENTER, p.BOTTOM);
          p.text(numerator, x, y - this.fractionSpacing);
          
          // Draw fraction line
          p.stroke(this.fractionLineColor);
          p.strokeWeight(this.fractionLineWidth);
          p.line(x - fractionWidth/2, y, x + fractionWidth/2, y);
          
          // Draw denominator
          p.textAlign(p.CENTER, p.TOP);
          p.noStroke();
          p.text(denominator, x, y + this.fractionSpacing);
          p.pop();
          
          return fractionWidth; // Return width for positioning if needed
        }

        drawHeader(p) {
          const model = this.controller.getModel();
          p.push();
          p.fill(0);
          p.textSize(18);
          p.textAlign(p.CENTER, p.TOP);
          
          // Original text was: `Find ${model.numerator}/${model.denominator} of ${model.total}.`
          // Now we'll display the fraction properly
          const textStart = "Find ";
          const textEnd = ` of ${model.total}.`;
          
          const textStartWidth = p.textWidth(textStart);
          const textEndWidth = p.textWidth(textEnd);
          const centerX = this.canvasWidth / 2;
          
          // Calculate positions
          const fractionX = centerX - textEndWidth/2;
          
          // Draw start text
          p.textAlign(p.RIGHT, p.TOP);
          p.text(textStart, fractionX - 15, 20);
          
          // Draw fraction
          this.drawFraction(p, model.numerator, model.denominator, fractionX, 24, 18);
          
          // Draw end text
          p.textAlign(p.LEFT, p.TOP);
          p.text(textEnd, fractionX + 15, 20);
          
          // Draw instruction text below
          p.textSize(14);
          p.textStyle(p.ITALIC);
          p.fill(100);
          p.textAlign(p.CENTER, p.TOP);
          p.text(
            `To solve: First, divide the stars into ${model.denominator} groups, then select the correct number of groups.`,
            this.canvasWidth / 2,
            60
          );

          if (model.isCorrectGroupCount()) {
            p.textSize(16);
            p.textStyle(p.NORMAL);
            p.fill("#eb34e2");
          }
          p.pop();
        }

        drawGroups(p) {
          const model = this.controller.getModel();
          for (let i = 0; i < this.groupsData.length; i++) {
            const group = this.groupsData[i];
            const isSelected =
              model.selectedGroups.includes(i) && model.isCorrectGroupCount();
            // Draw group border
            p.push();
            p.stroke(this.groupBorderColor);
            p.strokeWeight(2);
            p.noFill();
            p.rect(group.x, group.y, group.width, group.height, 8);
            p.pop();
            // Draw stars with appropriate color
            p.push();
            p.fill(isSelected ? this.correctStarColor : this.starColor);
            p.noStroke();
            p.textSize(this.starSize);
            if (model.groups === 1) {
              const cols = Math.min(Math.ceil(Math.sqrt(group.stars)), 10);
              const gridSize = this.starSize + this.starMargin * 2;
              for (let j = 0; j < group.stars; j++) {
                const col = j % cols;
                const row = Math.floor(j / cols);
                const starX =
                  group.x + this.groupPadding + col * gridSize + gridSize / 2;
                const starY =
                  group.y + this.groupPadding + row * gridSize + gridSize / 2;
                p.text("★", starX, starY);
              }
            } else {
              const cols = group.stars > 9 ? 2 : 1;
              const rows = Math.ceil(group.stars / cols);
              const gridSize = this.starSize + this.starMargin * 2;
              for (let j = 0; j < group.stars; j++) {
                const col = j % cols;
                const row = Math.floor(j / cols);
                const starX =
                  group.x +
                  this.groupPadding +
                  col * gridSize +
                  gridSize / 2;
                const starY =
                  group.y +
                  this.groupPadding +
                  row * gridSize +
                  gridSize / 2;
                p.text("★", starX, starY);
              }
            }
            p.pop();
          }
        }

        drawExtraStars(p) {
          if (this.extraStarsData.length > 0 && this.groupsData.length > 0) {
            const verticalOffset = 12;
            const horizontalSpacing = this.starSize + this.starMargin + 10;
            const startX = this.groupsData[0].x;
            let maxY = 0;
            for (let i = 0; i < this.groupsData.length; i++) {
              const groupBottom =
                this.groupsData[i].y + this.groupsData[i].height;
              if (groupBottom > maxY) {
                maxY = groupBottom;
              }
            }
            const startY = maxY + verticalOffset;
            p.push();
            p.fill(this.starColor);
            p.noStroke();
            p.textSize(this.starSize);
            for (let i = 0; i < this.extraStarsData.length; i++) {
              const starX = startX + i * horizontalSpacing;
              const starY = startY;
              p.text("★", starX, starY);
            }
            p.pop();
          }
        }

        drawSelectInstruction(p) {
          p.push();
          p.fill(this.starColor);
          p.textSize(18);
          p.textStyle(p.BOLD);
          p.textAlign(p.CENTER, p.BOTTOM);
          p.text(
            " ⬆ Select the groups",
            this.canvasWidth / 2 - 250,
            this.canvasHeight / 2 + 200
          );
          p.pop();
        }

        drawGroupingText(p) {
          const model = this.controller.getModel();
          p.push();
          p.fill(0);
          p.textSize(16);
          p.textStyle(p.NORMAL);
          p.textAlign(p.CENTER, p.TOP);
          p.text(
            model.getGroupingText(),
            this.canvasWidth / 2 - 250,
            this.canvasHeight / 2 + 200
          );
          p.pop();
        }

        drawSolutionMessage(p) {
          const model = this.controller.getModel();
          const selectedStars = model.getSelectedStarsCount();
          p.push();
          p.fill("#28a745");
          p.textSize(20);
          p.textStyle(p.NORMAL);
          p.textAlign(p.CENTER, p.CENTER);
          
          // Original text was: `${model.numerator}/${model.denominator} of ${model.total} is ${selectedStars}`
          // Now we'll display the fraction properly
          const textStart = "";
          const textMiddle = ` of ${model.total} is ${selectedStars}`;
          
          const centerX = this.canvasWidth / 2 - 250;
          const centerY = this.canvasHeight / 2 + 210;
          
          // Calculate positions for fraction
          p.textAlign(p.RIGHT, p.CENTER);
          const fractionWidth = this.drawFraction(p, model.numerator, model.denominator, centerX - 5, centerY - 20, 20);
          
          // Draw the rest of the text
          p.textAlign(p.LEFT, p.CENTER);
          p.text(textMiddle, centerX + 5, centerY - 20);
          
          p.pop();
        }

        updateDisplay() {
          const model = this.controller.getModel();
          this.calculateGroupsLayout();
          this.showSelectInstruction = model.isCorrectGroupCount() && model.selectedGroups.length === 0;
          this.showSolutionMessage = model.checkAnswer();
        }

        calculateGroupsLayout() {
          const model = this.controller.getModel();
          const groupSizes = model.calculateGroupSizes();
          const starsPerGroup = groupSizes[0]; // All groups have the same number of stars
          const extraStars = model.total % model.groups; // Remainder stars
          this.groupsData = [];
          this.extraStarsData = [];
          const availableHeight = this.canvasHeight - this.headerHeight - 40;
          if (model.groups === 1) {
            const cols = Math.min(Math.ceil(Math.sqrt(groupSizes[0])), 10);
            const rows = Math.ceil(groupSizes[0] / cols);
            const gridSize = this.starSize + this.starMargin * 2;
            const groupWidth = cols * gridSize + this.groupPadding * 2;
            const groupHeight = rows * gridSize + this.groupPadding * 2;
            this.groupsData.push({
              x: (this.canvasWidth - groupWidth) / 2,
              y: this.headerHeight + 10,
              width: groupWidth,
              height: groupHeight,
              stars: groupSizes[0],
            });
          } else {
            const colsPerGroup = starsPerGroup > 9 ? 2 : 1;
            const rowsPerGroup = Math.ceil(starsPerGroup / colsPerGroup);
            const gridSize = this.starSize + this.starMargin * 2;
            const groupHeight = rowsPerGroup * gridSize + this.groupPadding * 2;
            const groupWidth = colsPerGroup * gridSize + this.groupPadding * 2;
            const maxGroupsPerRow = Math.floor(
              (this.canvasWidth - 20) / (groupWidth + 10)
            );
            const rows = Math.ceil(model.groups / maxGroupsPerRow);
            for (let i = 0; i < model.groups; i++) {
              const row = Math.floor(i / maxGroupsPerRow);
              const col = i % maxGroupsPerRow;
              const groupX = 10 + col * (groupWidth + 10);
              const groupY = this.headerHeight + 10 + row * (groupHeight + 10);
              this.groupsData.push({
                x: groupX,
                y: groupY,
                width: colsPerGroup * gridSize + this.groupPadding * 2,
                height: rowsPerGroup * gridSize + this.groupPadding * 2,
                stars: groupSizes[i],
              });
            }
            if (extraStars > 0) {
              const extraStarY =
                this.headerHeight + 10 + rows * (groupHeight + 10) + 10;
              const extraStarStartX =
                (this.canvasWidth -
                  extraStars * (this.starSize + this.starMargin * 2)) /
                2;
              for (let i = 0; i < extraStars; i++) {
                this.extraStarsData.push({
                  x:
                    extraStarStartX +
                    i * (this.starSize + this.starMargin * 2) +
                    this.starSize / 2,
                  y: extraStarY + this.starSize / 2,
                });
              }
            }
          }
        }

        updateSliderUI(value, labelText) {
        document.getElementById("slider-value").textContent = value;
          document.getElementById("slider-label").textContent = labelText;
        }

        resetSliderUI() {
         const slider = document.getElementById('groupSlider');
          slider.value = 1;
          this.sliderValue = 1;
          this.sliderLabelText = this.controller.getModel().getGroupingText();
          document.getElementById('slider-value').textContent = 1;
        }
      }

      // =====================
      // CONTROLLER
      // =====================
      class FractionStarsController {
        constructor() {
          this.model = new FractionStarsModel();
          this.view = new FractionStarsView(this);
          // Initialize view with random problem
          this.view.updateSliderUI(this.model.groups, this.model.getGroupingText());
        }

        getModel() {
          return this.model;
        }

        handleSliderChange(value) {
          this.model.updateGroups(value);
          this.view.updateSliderUI(value, this.model.getGroupingText());
          this.view.updateDisplay();
        }

        handleGroupClick(groupIndex) {
          this.model.toggleGroupSelection(groupIndex);
          this.view.updateDisplay();
        }

        generateNewProblem() {
          const problem = this.model.generateRandomProblem();
          this.model.updateGroups(1);
          this.view.showSolutionMessage = false;
          this.view.updateSliderUI(1, this.model.getGroupingText());
          this.view.resetSliderUI();
          this.view.updateDisplay();
        }
      }

      // =====================
      // APP INITIALIZATION
      // =====================
      document.addEventListener("DOMContentLoaded", () => {
        const app = new FractionStarsController();
      });