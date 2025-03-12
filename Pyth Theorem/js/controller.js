/**
 * Controller for the Pythagorean Theorem Checker
 * Connects the Model and View, handles user interactions
 */
class PythagoreanController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Set up event handlers
        this.view.setOnDrop((position, value) => this.handleDrop(position, value));
        this.view.setOnClear((position) => this.handleClear(position));
        this.view.setOnCheck(() => this.handleCheck());
        this.view.setOnNotRight(() => this.handleNotRight());
        this.view.setOnNewProblem(() => this.startNewProblem());
        this.view.setOnCheckComplete(() => this.checkAnswerPlacement());
        this.view.setOnTryAgain(() => this.handleTryAgain());
        
        // Initialize the first problem
        this.startNewProblem();
    }
    
    startNewProblem() {
        // Reset the model
        this.model.reset();
        
        // Reset the view
        this.view.resetUI();
        
        // Draw the triangle with the new side values
        this.view.drawTriangle(
            this.model.sideA,
            this.model.sideB,
            this.model.sideC
        );
    }
    
    handleDrop(position, value) {
        // Update the model with the placed value
        const isComplete = this.model.placeValue(position, value);
        
        // If all values are placed, show calculation steps
        if (isComplete) {
            this.view.showCalculation(this.model.calculationSteps);
        }
        
        return isComplete;
    }
    
    handleClear(position) {
        // Update the model when a value is removed
        this.model.removeValue(position);
        
        // Clear calculation display
        this.view.clearCalculation();
        
        // Hide hint if it was showing
        if (this.model.isShowingHint()) {
            this.view.hideHint();
        }
    }
    
    checkAnswerPlacement() {
        // Check if all values are placed correctly
        if (this.model.isComplete) {
            // If the calculation shows it's not correct and we have tries left, show hint
            if (!this.model.isRightTriangle && this.model.hasTriesLeft()) {
                this.model.useHint();
                this.view.showHint(this.model.getTriesLeft());
            }
        }
    }
    
    handleTryAgain() {
        // Clear all drop boxes and reset for another try
        this.view.resetUI();
        
        // No need to reset the model completely, just clear placed values
        this.model.placedValues = {
            a: null,
            b: null,
            c: null
        };
        this.model.isComplete = false;
        this.model.calculationSteps = [];
    }
    
    handleCheck() {
        // User thinks it's a right triangle
        if (!this.model.isComplete) {
            this.view.showFeedback(false, "Please place all values first!");
            return;
        }
        
        const isCorrect = this.model.isRightTriangle === true;
        this.view.showFeedback(isCorrect, isCorrect ? 
            "Correct! This is a right triangle." : 
            "Incorrect. This is not a right triangle.");
        
        if (isCorrect) {
            const newCount = this.model.incrementCorrectCount();
            this.view.updateCorrectCount(newCount);
            setTimeout(() => this.startNewProblem(), 2000); // Auto start new problem after 2 seconds
        } else if (this.model.hasTriesLeft()) {
            // If incorrect and has tries left, show hint
            this.model.useHint();
            this.view.showHint(this.model.getTriesLeft());
        }
    }
    
    handleNotRight() {
        // User thinks it's not a right triangle
        if (!this.model.isComplete) {
            this.view.showFeedback(false, "Please place all values first!");
            return;
        }
        
        const isCorrect = this.model.isRightTriangle === false;
        this.view.showFeedback(isCorrect, isCorrect ? 
            "Correct! This is not a right triangle." : 
            "Incorrect. This is actually a right triangle.");
        
        if (isCorrect) {
            const newCount = this.model.incrementCorrectCount();
            this.view.updateCorrectCount(newCount);
            setTimeout(() => this.startNewProblem(), 2000); // Auto start new problem after 2 seconds
        } else if (this.model.hasTriesLeft()) {
            // If incorrect and has tries left, show hint
            this.model.useHint();
            this.view.showHint(this.model.getTriesLeft());
        }
    }
}
