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
export default SpinnerView;