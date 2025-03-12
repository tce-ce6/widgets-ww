class VennController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Set up the first question
        this.updateUI();
    }
    
    initEventListeners() {
        // Check button
        this.view.checkButton.addEventListener('click', () => {
            this.checkAnswer();
        });
        
        // Navigation buttons
        this.view.prevButton.addEventListener('click', () => {
            if (this.model.previousQuestion()) {
                this.updateUI();
            }
        });
        
        this.view.nextButton.addEventListener('click', () => {
            if (this.model.nextQuestion()) {
                this.updateUI();
            }
        });
        
        // Reset button (add to HTML if needed)
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.className = 'btn-reset';
        resetButton.addEventListener('click', () => {
            this.model.resetCurrent();
            this.view.draw(this.view.p5Instance, this.model.selectedRegions);
        });
        
        // Insert reset button after the check button
        this.view.checkButton.insertAdjacentElement('afterend', resetButton);
    }
    
    // Method to be called from p5 mouseClicked
    handleCanvasClick(mouseX, mouseY) {
        const hoveredRegion = this.view.checkHover(this.view.p5Instance, mouseX, mouseY);
        
        if (hoveredRegion) {
            const updatedSelections = this.model.selectRegion(hoveredRegion);
            this.view.draw(this.view.p5Instance, updatedSelections);
        }
    }
    
    // Method to be called from p5 mouseMoved
    handleCanvasHover(mouseX, mouseY) {
        const hoveredRegion = this.view.checkHover(this.view.p5Instance, mouseX, mouseY);
        
        if (this.view.hoveredRegion !== hoveredRegion) {
            this.view.setHoveredRegion(hoveredRegion);
            this.view.draw(this.view.p5Instance, this.model.selectedRegions);
            
            // Update cursor style
            if (hoveredRegion) {
                this.view.canvas.elt.style.cursor = 'pointer';
            } else {
                this.view.canvas.elt.style.cursor = 'default';
            }
        }
    }
    
    checkAnswer() {
        const result = this.model.checkAnswer();
        
        this.view.showFeedback(result);
        this.view.updateScore(this.model.getScore());
        
        if (result.correctRegions) {
            this.view.highlightCorrectRegions(result.correctRegions);
        }
        
        // If correct, automatically move to next question after delay
        if (result.isCorrect) {
            setTimeout(() => {
                if (this.model.nextQuestion()) {
                    this.updateUI();
                }
            }, 2000);
        }
    }
    
    updateUI() {
        const currentQuestion = this.model.getCurrentQuestion();
        const score = this.model.getScore();
        
        this.view.updateQuestion(currentQuestion);
        this.view.updateHint(currentQuestion.hint);
        this.view.updateScore(score);
        this.view.updateNavButtons(this.model.currentQuestionIndex, this.model.questions.length);
        this.view.draw(this.view.p5Instance, this.model.selectedRegions);
    }
}
