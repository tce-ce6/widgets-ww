class VennController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.solutionView = null;
        
        // DOM elements
        this.elements = {
            question: document.getElementById('question'),
            checkButton: document.getElementById('checkButton'),
            nextButton: document.getElementById('nextButton'),
            feedback: document.getElementById('feedback'),
            hint: document.getElementById('hint'),
            progress: document.getElementById('progress'),
            solutionSection: document.getElementById('solution-section'),
            checkContainer: document.getElementById('check-container')
        };

        // Bind event handlers
        this.elements.checkButton.addEventListener('click', () => this.checkAnswer());
        this.elements.nextButton.addEventListener('click', () => this.nextQuestion());
        
        // Initialize the first question
        this.updateQuestion();
    }

    // Method to set the solution view
    setSolutionView(solutionView) {
        this.solutionView = solutionView;
    }

    handleRegionClick(region) {
        if (!region) return;
        
        const isSelected = this.model.selectRegion(region);
        this.view.setSelectedRegions(this.model.selectedRegions);
    }

    checkAnswer() {
        const isCorrect = this.model.checkAnswer();
        const attempts = this.model.getAttempts();
        
        // Update check button text
        this.elements.checkButton.textContent = `CHECK (${attempts + 1})`;
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    handleCorrectAnswer() {
        this.elements.feedback.textContent = " Correct!";
        this.elements.feedback.className = "correct";
        this.elements.nextButton.disabled = false;
        this.elements.checkButton.disabled = true;
        this.model.incrementCorrectAnswers();
        this.updateProgress();
        this.elements.hint.textContent = "";
        this.elements.solutionSection.classList.add("hidden");
    }

    handleIncorrectAnswer() {
        this.elements.feedback.textContent = " Try again";
        this.elements.feedback.className = "incorrect";
        
        const attempts = this.model.getAttempts();
        
        // Show hint after second attempt
        if (attempts === 2) {
            this.elements.hint.textContent = this.model.getCurrentQuestion().hint;
        }
        
        // Show solution after third attempt
        if (this.model.isMaxAttemptsReached()) {
            this.elements.checkContainer.classList.add("hidden");
            this.showCorrectSolution();
            this.elements.nextButton.disabled = false;
        }
    }

    nextQuestion() {
        this.model.nextQuestion();
        this.resetInterface();
        this.updateQuestion();
    }

    updateQuestion() {
        const currentQuestion = this.model.getCurrentQuestion();
        this.elements.question.textContent = currentQuestion.question;
        
        // Update the set notation in the Venn diagram
        this.view.setCurrentSet(currentQuestion.correctSet);
        if (this.solutionView) {
            this.solutionView.setCurrentSet(currentQuestion.correctSet);
        }
    }

    updateProgress() {
        const progress = this.model.getProgress();
        this.elements.progress.textContent = `${progress.current} of ${progress.total}`;
    }

    showCorrectSolution() {
        this.elements.solutionSection.classList.remove("hidden");
        const currentQuestion = this.model.getCurrentQuestion();
        
        // If we have a separate solution view, use it
        if (this.solutionView) {
            // Reset solution diagram
            this.solutionView.clearSelectedRegions();
            
            // Show correct regions in solution diagram
            this.solutionView.setSelectedRegions(new Set(currentQuestion.correctRegions));
        }
    }

    resetInterface() {
        // Reset view
        this.view.clearSelectedRegions();
        if (this.solutionView) {
            this.solutionView.clearSelectedRegions();
        }
        
        // Reset buttons and feedback
        this.elements.nextButton.disabled = true;
        this.elements.checkButton.disabled = false;
        this.elements.checkContainer.classList.remove("hidden");
        this.elements.checkButton.textContent = "CHECK (1)";
        this.elements.feedback.textContent = "";
        this.elements.feedback.className = "";
        this.elements.hint.textContent = "";
        this.elements.solutionSection.classList.add("hidden");
        
        // Update progress
        this.updateProgress();
    }
}

// Export the controller for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VennController;
} 