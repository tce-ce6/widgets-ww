// Controller - connects model and view, handles events
class SpinnerController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Initialize
        this.init();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    init() {
        // Generate initial symbols
        this.model.generateSymbols();
        
        // Initial render
        this.updateView();
    }
    
    updateView() {
        // Draw spinner
        this.view.drawSpinner(
            this.model.sectorCount,
            this.model.symbols,
            this.model.colors
        );
        
        // Update sector value display
        this.view.updateSectorValue(this.model.sectorCount);
        
        // Calculate and display probabilities
        const symbol = this.model.focusSymbol;
        const symbolName = this.model.currentSymbolName;
        const probability = this.model.getProbability(symbol);
        const complement = this.model.getComplement(symbol);
        
        this.view.updateProbabilityDisplay(symbol, symbolName, probability, complement);
    }
    
    setupEventListeners() {
        // Slider change event
        this.view.sliderElement.addEventListener('input', (e) => {
            const sectorCount = parseInt(e.target.value);
            this.model.setSectorCount(sectorCount);
            this.updateView();
        });
        
        // New statement button
        this.view.newStatementButton.addEventListener('click', () => {
            this.model.changeFocusSymbol();
            this.updateView();
        });
        
        // New spinner button - keep same sector count, just change symbols
        this.view.newSpinnerButton.addEventListener('click', () => {
            // Generate new symbols without changing sector count (false parameter)
            this.model.generateSymbols(false);
            
            // Update the view
            this.updateView();
        });
    }
}

// Export the controller
export default SpinnerController;