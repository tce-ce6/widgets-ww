
        // Main entry point for the application
// Import model, view, and controller


// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create instances
    const model = new SpinnerModel();
    const view = new SpinnerView();
    const controller = new SpinnerController(model, view);
});

// View - handles display and user interface
class SpinnerView {
    constructor() {
        this.canvas = document.getElementById('spinner');
        this.ctx = this.canvas.getContext('2d');
        this.sliderElement = document.getElementById('sectors-slider');
        this.sectorsValueElement = document.getElementById('sectors-value');
        this.starProbabilityElement = document.getElementById('star-probability');
        this.starComplementElement = document.getElementById('star-complement');
        this.newStatementButton = document.getElementById('new-statement');
        this.newSpinnerButton = document.getElementById('new-spinner');
        
        // Set canvas dimensions
        this.canvas.width = 300;
        this.canvas.height = 300;
    }
    
    drawSpinner(sectorCount, symbols, colors) {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sectors
        const anglePerSector = (2 * Math.PI) / sectorCount;
        
        for (let i = 0; i < sectorCount; i++) {
            const startAngle = i * anglePerSector - Math.PI / 2; // Start from top
            const endAngle = (i + 1) * anglePerSector - Math.PI / 2;
            
            // Draw sector
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            // Fill sector
            ctx.fillStyle = colors[i];
            ctx.fill();
            
            // Draw sector border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw symbol in the center of the sector
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + anglePerSector / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.fillText(symbols[i], radius * 0.7, 0);
            ctx.restore();
        }
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    updateSectorValue(value) {
        this.sectorsValueElement.textContent = value;
    }
    
    updateProbabilityDisplay(symbol, symbolName, probability, complement) {
        // Update the symbol name in display
        const symbolElements = document.querySelectorAll('.symbol');
        symbolElements.forEach(el => {
            el.textContent = symbol;
            
            // Update class for styling
            el.className = 'symbol';
            if (symbolName === "star") el.classList.add('star');
            if (symbolName === "heart") el.classList.add('heart');
            if (symbolName === "clover") el.classList.add('clover');
            if (symbolName === "flower") el.classList.add('gear'); // Using 'gear' class for flower
        });
        
        // Get the CSS class for the symbol
        let symbolClass = '';
        if (symbolName === "star") symbolClass = 'star';
        if (symbolName === "heart") symbolClass = 'heart';
        if (symbolName === "clover") symbolClass = 'clover';
        if (symbolName === "flower") symbolClass = 'flower';
        
        // Create colored symbol name span
        const coloredSymbolName = `<span class="symbol-name ${symbolClass}">${symbolName}</span>`;
        
        // Update text to use symbol name instead of symbol character
        const probabilityLabelElement = document.getElementById('probability-label');
        const complementLabelElement = document.getElementById('complement-label');
        
        if (probabilityLabelElement) {
            probabilityLabelElement.innerHTML = `The probability of landing on a ${coloredSymbolName} is`;
        }
        
        if (complementLabelElement) {
            complementLabelElement.innerHTML = `The probability of not landing on a ${coloredSymbolName} (or the <strong>complement</strong> of the event) is`;
        }
        
        // Create MathJax fraction representation for the probability with the symbol color
        const fractionMath = this.createMathJaxFraction(probability.fraction, symbolClass);
        const simplifiedMath = probability.simplified !== probability.fraction ? 
            this.createMathJaxFraction(probability.simplified, symbolClass) : '';
            
        // Create MathJax fraction representation for the complement also with the symbol color
        const complementFractionMath = this.createMathJaxFraction(complement.fraction, symbolClass);
        const complementSimplifiedMath = complement.simplified !== complement.fraction ? 
            this.createMathJaxFraction(complement.simplified, symbolClass) : '';
        
        // Update probability values with MathJax
        this.starProbabilityElement.innerHTML = fractionMath + 
            (simplifiedMath ? ' <span class="or">or</span> ' + simplifiedMath : '');
        
        this.starComplementElement.innerHTML = complementFractionMath + 
            (complementSimplifiedMath ? ' <span class="or">or</span> ' + complementSimplifiedMath : '');
        
        // Trigger MathJax to process the new content
        if (window.MathJax) {
            window.MathJax.typeset();
        }
    }
    
    // Helper method to create MathJax fraction with symbol color
    createMathJaxFraction(fractionString, symbolClass) {
        const [numerator, denominator] = fractionString.split('/');
        return `<span class="math-fraction ${symbolClass}">\\(\\frac{${numerator}}{${denominator}}\\)</span>`;
    }
}

// Export the view

// Model - handles data and business logic
class SpinnerModel {
    constructor() {
        this.sectorCount = 6;
        // Update symbol list to match requirements
        this.symbols = ["★", "♥", "⚙", "♣"]; // Default symbols
        this.colors = [ "#e5739a", "#e67e22", "#16a085", "#9b59b6"]; // Default colors
        this.focusSymbol = "★"; // Symbol to calculate probability for
        
        // Symbol names mapping
        this.symbolNames = {
            "★": "star",
            "♥": "heart",
            "⚙": "flower",
            "♣": "clover"
        };
        
        this.currentSymbolName = this.symbolNames[this.focusSymbol];
    }
    
    setSectorCount(count) {
        this.sectorCount = count;
        this.generateSymbols();
    }
    
    // Modified to generate completely random symbols and arrangements
    generateSymbols(randomizeSectors = false) {
        // Reset arrays
        this.symbols = [];
        this.colors = [];
        
        // Randomly change the sector count if requested
        if (randomizeSectors) {
            const minSectors = 4;
            const maxSectors = 12;
            this.sectorCount = Math.floor(Math.random() * (maxSectors - minSectors + 1)) + minSectors;
        }
        
        // Available symbols and their colors
        const availableSymbols = ["★", "♥", "⚙", "♣"];
        const symbolColors = {
            "★": "#e5739a", // Pink
            "♥": "#e67e22", // Orange
            "♣": "#9b59b6", // Purple
            "⚙": "#16a085"  // Teal
        };
        
        // Generate completely random symbols
        for (let i = 0; i < this.sectorCount; i++) {
            const randomSymbolIndex = Math.floor(Math.random() * availableSymbols.length);
            const randomSymbol = availableSymbols[randomSymbolIndex];
            this.symbols.push(randomSymbol);
            this.colors.push(symbolColors[randomSymbol]);
        }
        
        // Ensure we have at least one of the focus symbol
        if (!this.symbols.includes(this.focusSymbol)) {
            const randomPosition = Math.floor(Math.random() * this.sectorCount);
            this.symbols[randomPosition] = this.focusSymbol;
            this.colors[randomPosition] = symbolColors[this.focusSymbol];
        }
    }
    
    countSymbol(symbol) {
        return this.symbols.filter(s => s === symbol).length;
    }
    
    getProbability(symbol) {
        const count = this.countSymbol(symbol);
        return {
            fraction: `${count}/${this.sectorCount}`,
            simplified: this.simplifyFraction(count, this.sectorCount)
        };
    }
    
    getComplement(symbol) {
        const count = this.countSymbol(symbol);
        const complementCount = this.sectorCount - count;
        return {
            fraction: `${complementCount}/${this.sectorCount}`,
            simplified: this.simplifyFraction(complementCount, this.sectorCount)
        };
    }
    
    changeFocusSymbol() {
        // Ensure we select a symbol that exists in the current spinner
        const existingSymbols = [...new Set(this.symbols)];
        this.focusSymbol = existingSymbols[Math.floor(Math.random() * existingSymbols.length)];
        // Update the current symbol name
        this.currentSymbolName = this.symbolNames[this.focusSymbol];
    }
    
    simplifyFraction(numerator, denominator) {
        function gcd(a, b) {
            return b ? gcd(b, a % b) : a;
        }
        
        const divisor = gcd(numerator, denominator);
        return `${numerator/divisor}/${denominator/divisor}`;
    }
}

// Export the model


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
// export default SpinnerController;




