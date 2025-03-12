/**
 * Model for the Pythagorean Theorem Checker
 * Handles data storage and business logic
 */
class PythagoreanModel {
    constructor() {
        this.reset();
        this.correctCount = 0;
    }

    reset() {
        // Generate triangle sides
        this.generateRandomTriangle();
        
        // Track which values have been placed where
        this.placedValues = {
            a: null,
            b: null,
            c: null
        };
        
        this.isComplete = false;
        this.isRightTriangle = false;
        this.calculationSteps = [];
        this.triesLeft = 1; // Number of tries before showing the answer
        this.showingHint = false;
    }

    generateRandomTriangle() {
        // Create random triangle sides
        // We'll use Pythagorean triples with some randomization to ensure we have both right and non-right triangles
        
        // Option 1: Create a right triangle using a Pythagorean triple
        const pythagoreanTriples = [
            [3, 4, 5],
            [5, 12, 13],
            [8, 15, 17],
            [7, 24, 25],
            [9, 40, 41]
        ];
        
        // Option 2: Create a non-right triangle by modifying a Pythagorean triple
        const rightTriangle = Math.random() < 0.5; // 50% chance of a right triangle
        
        let sides;
        if (rightTriangle) {
            // Select a Pythagorean triple
            sides = pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)];
            this.isRightTriangle = true;
        } else {
            // Select a Pythagorean triple and modify one side to make it not a right triangle
            sides = [...pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)]];
            // Randomly add or subtract a small amount to one of the sides
            const sideToModify = Math.floor(Math.random() * 3);
            sides[sideToModify] += Math.random() < 0.5 ? 1 : -1;
            this.isRightTriangle = false;
        }
        
        // Scale up the sides to make them larger
        const scale = Math.floor(Math.random() * 3) + 1; // Scale by 1, 2, or 3
        sides = sides.map(side => side * scale);
        
        // Randomly decide which side is which (a, b, c)
        // For education purposes, let's make sure c is always the hypotenuse (the longest side)
        sides.sort((a, b) => a - b);
        
        // Assign sides to the model
        this.sideA = sides[0];
        this.sideB = sides[1];
        this.sideC = sides[2];
        
        // Optionally make one of the sides a square root for more interesting problems
        if (Math.random() < 0.3) { // 30% chance of having a square root
            const sideToModify = Math.floor(Math.random() * 2); // Only modify a or b, not c
            const squareValue = sides[sideToModify] ** 2;
            if (sideToModify === 0) {
                this.sideA = `√${squareValue}`;
                this.originalSideA = sides[0];
            } else {
                this.sideB = `√${squareValue}`;
                this.originalSideB = sides[1];
            }
        }
    }

    placeValue(position, value) {
        this.placedValues[position] = value;
        this.isComplete = this.placedValues.a !== null && 
                          this.placedValues.b !== null && 
                          this.placedValues.c !== null;
        
        if (this.isComplete) {
            this.checkSolution();
        }
        
        return this.isComplete;
    }

    removeValue(position) {
        this.placedValues[position] = null;
        this.isComplete = false;
        this.calculationSteps = [];
    }

    checkSolution() {
        const a = this.placedValues.a;
        const b = this.placedValues.b;
        const c = this.placedValues.c;
        
        // Handle square root values
        let aValue = typeof a === 'string' && a.includes('√') ? 
            Math.sqrt(parseInt(a.replace('√', ''))) : parseInt(a);
        let bValue = typeof b === 'string' && b.includes('√') ? 
            Math.sqrt(parseInt(b.replace('√', ''))) : parseInt(b);
        let cValue = typeof c === 'string' && c.includes('√') ? 
            Math.sqrt(parseInt(c.replace('√', ''))) : parseInt(c);
        
        // Calculate the squared values
        const aSquared = aValue ** 2;
        const bSquared = bValue ** 2;
        const cSquared = cValue ** 2;
        
        // Calculate the left and right sides of the equation
        const leftSide = aSquared + bSquared;
        const rightSide = cSquared;
        
        // Store calculation steps for display
        this.calculationSteps = [
            `${aValue}² + ${bValue}² ≟ ${cValue}²`,
            `${aSquared} + ${bSquared} ≟ ${rightSide}`,
            `${leftSide} ${Math.abs(leftSide - rightSide) < 0.00001 ? '=' : '≠'} ${rightSide}`
        ];
        
        // Check if it's a right triangle (allowing for small rounding errors)
        this.isRightTriangle = Math.abs(leftSide - rightSide) < 0.00001;
        
        return this.isRightTriangle;
    }

    useHint() {
        if (this.triesLeft > 0) {
            this.triesLeft--;
            this.showingHint = true;
            return true;
        }
        return false;
    }

    hasTriesLeft() {
        return this.triesLeft > 0;
    }

    getTriesLeft() {
        return this.triesLeft;
    }

    isShowingHint() {
        return this.showingHint;
    }

    incrementCorrectCount() {
        this.correctCount++;
        return this.correctCount;
    }

    resetCorrectCount() {
        this.correctCount = 0;
    }
    
    // Get the correct sides for the triangle
    getCorrectSides() {
        return {
            a: this.sideA,
            b: this.sideB,
            c: this.sideC
        };
    }
}
