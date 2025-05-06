// MVC Pattern implementation

// ===== MODEL =====
class NumberModel {
    constructor() {
        this.digits = Array(7).fill(null); // [thousands, hundreds, tens, ones, tenths, hundredths, thousandths]
        this.selectedDigits = 0;
        this.generateRandomNumber();
    }
    
    generateRandomNumber() {
        for (let i = 0; i < this.digits.length; i++) {
            this.digits[i] = Math.floor(Math.random() * 10);
        }
        // Ensure at least one non-zero digit
        if (this.digits.every(d => d === 0)) {
            this.digits[3] = Math.floor(Math.random() * 9) + 1;
        }
        this.selectedDigits = 0;
    }
    
    getNumberString() {
        return `${this.digits[0]}${this.digits[1]}${this.digits[2]}${this.digits[3]}.${this.digits[4]}${this.digits[5]}${this.digits[6]}`;
    }
    
    selectDigit(index) {
        if (index >= 0 && index < this.digits.length) {
            this.selectedDigits |= (1 << index);
            return true;
        }
        return false;
    }
    
    isDigitSelected(index) {
        return (this.selectedDigits & (1 << index)) !== 0;
    }
    
    areAllDigitsSelected() {
        return this.selectedDigits === (1 << this.digits.length) - 1;
    }
}

// ===== CONTROLLER =====
class NumberController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('new-number-btn').addEventListener('click', () => {
            this.model.generateRandomNumber();
            this.view.reset();
            this.hideHTMLSlider(); // Hide the slider when generating a new number
        });
        
        // Add event listener for HTML slider
        const slider = document.getElementById('representation-slider');
        slider.addEventListener('input', () => {
            this.handleSliderChange(slider.value);
        });
    }
    
    handleMousePressed(x, y) {
        const digitIndex = this.view.getDigitIndexAtPosition(x, y);
        if (digitIndex !== -1 && !this.model.isDigitSelected(digitIndex)) {
            this.model.selectDigit(digitIndex);
            
            // Check if all digits are selected and show slider if they are
            if (this.model.areAllDigitsSelected()) {
                this.checkAndShowHTMLSlider();
            }
            
            return true;
        }
        return false;
    }
    
    generateNewNumber() {
        this.model.generateRandomNumber();
    }
    
    handleSliderChange(value) {
        // Convert slider value (0-100) to a position between sliderMin and sliderMax
        const sliderMin = 300;
        const sliderMax = 500;
        const sliderX = sliderMin + (value / 100) * (sliderMax - sliderMin);
        
        // Update view's sliderX property
        this.view.sliderX = sliderX;
        
        // Calculate and update currentStep and displayedDigits
        const midPoint = (sliderMin + sliderMax) / 2;
        
        if (sliderX <= sliderMin) {
            this.view.currentStep = 1;
            this.view.displayedDigits = 0;
        } else if (sliderX < midPoint) {
            this.view.currentStep = 2;
            const range = midPoint - sliderMin;
            const position = sliderX - sliderMin;
            this.view.displayedDigits = Math.min(7, Math.floor((position / range) * 7) + 1);
        } else {
            this.view.currentStep = 3;
            const range = sliderMax - midPoint;
            const position = sliderX - midPoint;
            this.view.displayedDigits = Math.min(7, Math.floor((position / range) * 7) + 1);
        }
    }
    
    checkAndShowHTMLSlider() {
        // Show HTML slider when all animations are complete
        if (this.model.areAllDigitsSelected() && this.view.areAllAnimationsComplete()) {
            this.showHTMLSlider();
        }
    }
    
    showHTMLSlider() {
        const sliderContainer = document.getElementById('slider-container');
        sliderContainer.classList.remove('hidden');
    }
    
    hideHTMLSlider() {
        const sliderContainer = document.getElementById('slider-container');
        sliderContainer.classList.add('hidden');
        
        // Reset the slider value
        document.getElementById('representation-slider').value = 0;
    }
}

// ===== VIEW =====
let model, controller, view;
let animatingDigits = [];

function setup() {
    const canvas = createCanvas(900, 450);
    canvas.parent('canvas-container');
    
    model = new NumberModel();
    view = new NumberView(model);
    controller = new NumberController(model, view);
    
    textAlign(CENTER, CENTER);
    frameRate(60);
}

function draw() {
    background(255);
    view.render();
    
    // Check if all animations are complete and all digits are selected
    if (model.areAllDigitsSelected() && view.areAllAnimationsComplete() && !view.sliderChecked) {
        controller.checkAndShowHTMLSlider();
        view.sliderChecked = true; // Prevents multiple checks
    }
}

function mousePressed() {
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        controller.handleMousePressed(mouseX, mouseY);
    }
}

class NumberView {
    constructor(model) {
        this.model = model;
        this.digitPositions = [];
        this.animatingDigits = [];
        this.expandedFormPositions = [];
        this.equationPositions = [];
        this.completedAnimations = new Set(); // Track completed animations
        this.sliderChecked = false; // Flag to prevent multiple slider checks
        
        this.colors = ['#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#1abc9c', '#f1c40f', '#e67e22'];
        
        // Add slider properties (still needed for calculations)
        this.sliderX = 300; // Starting position
        this.sliderMin = 300;
        this.sliderMax = 500;
        this.sliderY = 420; // Bottom of canvas
        this.currentStep = 1; // Start with step 1
        this.displayedDigits = 0; // Track which digits to display
        
        this.calculatePositions();
    }
    
    reset() {
        this.animatingDigits = [];
        this.completedAnimations = new Set(); // Reset completed animations
        this.displayedDigits = 0; // Reset displayed digits
        this.sliderX = this.sliderMin; // Reset slider position to start
        this.currentStep = 1; // Reset to step 1
        this.sliderChecked = false; // Reset slider check flag
        this.calculatePositions();
    }
    
    calculatePositions() {
        // Calculate positions for digits - shift up
        const digitWidth = 25;
        const startX = width / 2 - (3.5 * digitWidth)-300;
        const topY = 60; // Changed from 80 to 60
        
        this.digitPositions = [];
        for (let i = 0; i < 7; i++) {
            let x = startX + i * digitWidth;
            if (i > 3) x += 20; // Add space for decimal point
            this.digitPositions.push({x, y: topY});
        }
        
        // Calculate positions for expanded form - move up further
        this.expandedFormPositions = [];
        const expFormY = 110; // Changed from 130 to 110
        const expWidth = 100;
        let startExpX = width / 2 - 3.2 * expWidth;
        
        for (let i = 0; i < 7; i++) {
            let x = startExpX + i * expWidth;
            this.expandedFormPositions.push({x, y: expFormY});
        }
        
        // Calculate positions for fractions - move up further
        this.fractionValuePositions = [];
        const fractionY = 160; // Changed from 180 to 160
        
        for (let i = 0; i < 7; i++) {
            let x = startExpX + i * expWidth;
            this.fractionValuePositions.push({x, y: fractionY});
        }
        
        // Calculate positions for decimal values - move up further
        this.decimalValuePositions = [];
        const decimalY = 210; // Changed from 230 to 210
        
        for (let i = 0; i < 7; i++) {
            let x = startExpX + i * expWidth;
            this.decimalValuePositions.push({x, y: decimalY});
        }
        
        // Final sum position - move up further
        this.sumPosition = {x: width / 2, y: 260}; // Changed from 280 to 260
    }
    
    addAnimatingDigit(index) {
        const startPos = {...this.digitPositions[index]};
        const endPos = {...this.expandedFormPositions[index]};
        
        // Remove this digit from completed animations if it's being animated again
        this.completedAnimations.delete(index);
        
        this.animatingDigits.push({
            index,
            progress: 0,
            startPos,
            endPos,
            targetX: endPos.x - 25 // Store the exact target X position for proper placement
        });
    }
    
    render() {
        this.renderInstructions();
        this.renderDigits();
        
        // Always render step 1 (expanded form)
        this.renderExpandedForm();
        
        // Check if all digits in step 1 have completed animation
        const allStep1Complete = this.model.areAllDigitsSelected() && 
            [...Array(7).keys()].every(i => this.completedAnimations.has(i));
        
        // Only show steps 2 & 3 if step 1 is complete
        if (allStep1Complete) {
            // Render steps based on slider position
            if (this.currentStep >= 2) {
                // When in step 3, show all 7 digits for step 2
                const displayCount = this.currentStep === 3 ? 7 : this.displayedDigits;
                this.renderFractions(displayCount);
            }
            
            if (this.currentStep === 3) {
                this.renderDecimalValues();
            }
        }
        
        this.updateAnimations();
    }
    
    renderInstructions() {
        fill(0);
        textSize(16);
        text("Select each digit and observe how to write the number in expanded form.", 275, 25);
    }
    
    renderDigits() {
        textSize(20);
        
        // Draw digits
        for (let i = 0; i < 7; i++) {
            const pos = this.digitPositions[i];
            const isSelected = this.model.isDigitSelected(i);
            
            // Draw digit with appropriate color
            fill(isSelected ? this.colors[i] : this.colors[i]);
            noStroke();
            text(this.model.digits[i], pos.x, pos.y);
            
            // Draw decimal point
            if (i === 3) {
                fill('#333');
                textSize(20);
                text(".", pos.x + 25, pos.y + 2);
                textSize(20);
            }
        }
    }
    
    renderExpandedForm() {
        textSize(20);
        fill(0);
        
        // Draw equal sign for the first line - update Y position
        text("=", 60, 110); // Changed from 130 to 110
        
        // Draw opening parenthesis - update Y position
        text("(", 90, 110); // Changed from 130 to 110
        
        for (let i = 0; i < 7; i++) {
            const pos = this.expandedFormPositions[i];
            const multiplier = this.getMultiplierForPosition(i);
            
            // Draw digit only if selected AND animation is complete
            if (this.model.isDigitSelected(i) && this.completedAnimations.has(i)) {
                fill(this.colors[i]);
                text(`${this.model.digits[i]}`, pos.x - 25, pos.y);
            }
            
            fill(0);
            text("×", pos.x - 5, pos.y);
            
            textSize(18);
            if (i < 4) {
                text(multiplier, pos.x + 20, pos.y);
            } else {
                text("1", pos.x + 20, pos.y - 10); // Increased from -8 to -12
                text("——", pos.x + 20, pos.y);
                text(multiplier, pos.x + 20, pos.y + 12); // Increased from +8 to +12
            }
            textSize(20);
            
            // Draw connector
            if (i < 6) {
                text(" )+", pos.x + 45, pos.y);
                text("(", pos.x + 60, pos.y);
            } else {
                text(")", pos.x + 45, pos.y);
            }
        }
    }
    
    renderFractions(displayCount) {
        // Use provided displayCount or fall back to this.displayedDigits
        const digitsToShow = displayCount || this.displayedDigits;
        
        // Only render if we're actually in step 2 or 3
        if (this.currentStep < 2) return;
        
        // Step 2: Fractions representation
        fill(0);
        textSize(20);
        text("=", 60, 160);
        
        for (let i = 0; i < 7; i++) {
            // Only show values for digits that are selected, have completed animation,
            // and are within the current display count
            if (this.model.isDigitSelected(i) && this.completedAnimations.has(i) && i < digitsToShow) {
                const pos = this.fractionValuePositions[i];
                
                fill(this.colors[i]);
                if (i < 4) {
                    // For whole number places, just show the value
                    let value = this.getWholeNumberValue(i);
                    text(value, pos.x, pos.y);
                } else {
                    // For decimal places, show as fraction
                    let numerator = this.model.digits[i];
                    let denominator;
                    if (i === 4) denominator = "10";
                    else if (i === 5) denominator = "100";
                    else denominator = "1000";
                    
                    // Increased spacing between numerator, line, and denominator
                    text(numerator, pos.x, pos.y - 10);
                    fill(0);
                    text("——", pos.x, pos.y);
                    fill(this.colors[i]);
                    text(denominator, pos.x, pos.y + 12);
                }
                
                // Draw + sign only if this isn't the last digit and next digit is displayed
                if (i < 6 && i + 1 < digitsToShow) {
                    fill(0);
                    text("+", pos.x + 45, pos.y);
                }
            }
        }
    }
    
    renderDecimalValues() {
        // Step 3: Decimal values representation
        fill(0);
        textSize(20);
        text("=", 60, 210);
        
        for (let i = 0; i < 7; i++) {
            // Only show values for digits that are selected, have completed animation,
            // and are within the current display count
            if (this.model.isDigitSelected(i) && this.completedAnimations.has(i) && i < this.displayedDigits) {
                const pos = this.decimalValuePositions[i];
                const value = this.getDecimalValueForPosition(i);
                
                fill(this.colors[i]);
                text(value, pos.x, pos.y);
                
                // Draw + sign only if this isn't the last digit and next digit is displayed
                if (i < 6 && i + 1 < this.displayedDigits) {
                    fill(0);
                    text("+", pos.x + 45, pos.y);
                }
            }
        }
        
        // Show final result only if all digits are selected and we're showing all digits
        if (this.model.areAllDigitsSelected() && this.displayedDigits >= 7) {
            const sumStr = this.calculateSum();
            fill(0);
            textSize(20);
            text("=", 60, this.sumPosition.y);
            textSize(20);
            text(sumStr, 150, this.sumPosition.y);
        }
    }
    
    updateAnimations() {
        for (let i = this.animatingDigits.length - 1; i >= 0; i--) {
            const anim = this.animatingDigits[i];
            anim.progress += 0.05;
            
            if (anim.progress >= 1) {
                // Mark this digit's animation as completed
                this.completedAnimations.add(anim.index);
                this.animatingDigits.splice(i, 1);
            } else {
                const x = lerp(anim.startPos.x, anim.targetX, anim.progress);
                const y = lerp(anim.startPos.y, anim.endPos.y, anim.progress);
                
                fill(this.colors[anim.index] + '88');
                noStroke();
                textSize(28);
                text(this.model.digits[anim.index], x, y);
            }
        }
    }
    
    areAllAnimationsComplete() {
        return this.model.areAllDigitsSelected() && 
               [...Array(7).keys()].every(i => this.completedAnimations.has(i));
    }
    
    getDigitIndexAtPosition(x, y) {
        // Only check for digit clicks
        for (let i = 0; i < this.digitPositions.length; i++) {
            const pos = this.digitPositions[i];
            // Create a clickable area around each digit (30x30 square)
            if (x >= pos.x - 15 && x <= pos.x + 15 && 
                y >= pos.y - 15 && y <= pos.y + 15) {
                if (!this.model.isDigitSelected(i)) {
                    this.addAnimatingDigit(i);
                }
                return i;
            }
        }
        return -1;
    }
    
    getMultiplierForPosition(position) {
        switch(position) {
            case 0: return "1000";
            case 1: return "100";
            case 2: return "10";
            case 3: return "1";
            case 4: return "10";
            case 5: return "100";
            case 6: return "1000";
            default: return "";
        }
    }
    
    getWholeNumberValue(position) {
        const digit = this.model.digits[position];
        switch(position) {
            case 0: return digit * 1000;
            case 1: return digit * 100;
            case 2: return digit * 10;
            case 3: return digit;
            default: return "";
        }
    }
    
    getDecimalValueForPosition(position) {
        const digit = this.model.digits[position];
        switch(position) {
            case 0: return digit * 1000;
            case 1: return digit * 100;
            case 2: return digit * 10;
            case 3: return digit;
            case 4: return (digit / 10).toFixed(1);
            case 5: return (digit / 100).toFixed(2);
            case 6: return (digit / 1000).toFixed(3);
            default: return "";
        }
    }
    
    calculateSum() {
        let total = 0;
        for (let i = 0; i < 7; i++) {
            if (this.model.isDigitSelected(i)) {
                switch(i) {
                    case 0: total += this.model.digits[i] * 1000; break;
                    case 1: total += this.model.digits[i] * 100; break;
                    case 2: total += this.model.digits[i] * 10; break;
                    case 3: total += this.model.digits[i]; break;
                    case 4: total += this.model.digits[i] / 10; break;
                    case 5: total += this.model.digits[i] / 100; break;
                    case 6: total += this.model.digits[i] / 1000; break;
                }
            }
        }
        return total.toFixed(3).replace(/\.?0+$/, ''); // Remove trailing zeros
    }
}