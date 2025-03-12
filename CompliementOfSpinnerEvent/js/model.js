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
export default SpinnerModel;