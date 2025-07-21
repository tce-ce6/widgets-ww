
class GraphicModel {

    constructor() {
        this.range = 15;
        this.start = 50;
        this.end = 950;
        this.pointX = this.mapValueToPixel(0);
        this.initialPointX = this.pointX;
        this.pointY = 250;
        this.snappingRange = 30;
        this.question = "";
        this.correctValue = 0;
        this.correctDirection = "";
        this.attempts = 3;
        this.randomNumber = 0;
        this.randomOperator = 0;
        this.generateQuestions();
    }

    /**
     * mapping value to pixel using p5.js map function
     * @param {*} value 
     * @returns 
     */
    mapValueToPixel(value) {
        return map(value, -this.range, this.range, this.start, this.end);
    }

    /**
     * mapping pixel to value using p5.js map function
     * @param {*} pixel 
     * @returns 
     */
    mapPixelToValue(pixel) {
        return map(pixel, this.start, this.end, -this.range, this.range);
    }

    /**
     * Generating random questions based on operator and value range 
     * @param {*} callee 
     */
    generateQuestions(callee) {
        const operators = ['<', '>', '<=', '>=', '!=', '='];
         this.randomOperator = operators[Math.floor(Math.random() * operators.length)];
        // this.randomNumber;

        do {
            this.randomNumber = Math.floor(Math.random() * 29) - 14;
        } while (this.randomNumber === 0);

        this.question = `x ${this.randomOperator} ${this.randomNumber}`;
        this.correctValue = this.randomNumber;
        this.correctDirection = this.getDirection(this.randomOperator);
    }

    /**
     * Function to get the direction based on input operator
     * @param {*} operator 
     * @returns 
     */
    getDirection(operator) {

        if (operator === "<" || operator === "<=") {
            return "left";
        }
        if (operator === ">" || operator === ">=") {
            return "right";
        }
        if (operator === "!=") {
            return "both"; // Both directions for != and =
        }
        if(operator === "="){
            return "null";
        }
        return "";
    }

    // getQuestion() {
    //     let index = Math.floor(Math.random() * this.questionBank.length);
    //     return this.question = this.questionBank[index];
    // }

    /**
     * function to get closest value of draggable point
     * @param {*} pixel 
     * @returns 
     */
    getClosesetTick(pixel) {
        let value = this.mapPixelToValue(pixel);
        let snappingValue = Math.round(value);
        return this.mapValueToPixel(snappingValue);
    }

    /**
     * function to check the answer is correct or not
     * @param {*} leftToggle 
     * @param {*} rightToggle 
     * @returns 
     */

    checkAnswer(leftToggle, rightToggle) {

         selectValue = this.mapPixelToValue(this.pointX);

        if (selectValue === this.correctValue) {
            if (this.correctDirection === "left") {
                if (leftToggle && !rightToggle) {
                    return true;
                }
            } else if (this.correctDirection === "right") {
                if (rightToggle && !leftToggle) {
                    return true;
                }
            } else if (this.correctDirection === "both") {
                if (leftToggle && rightToggle) {
                    return true;
                }
            } else if (this.correctDirection === "null") {
                if (!leftToggle && !rightToggle) {
                    return true;
                }
            }
        }   
        
        console.log("Selected "+selectValue+" &  Correct "+this.correctValue);

        // if (selectValue === this.correctValue && ((this.correctDirection === "left" && leftToggle && !rightToggle) ||
        //     (this.correctDirection === "right" && rightToggle && !leftToggle) ||
        //     (this.correctDirection === "both" && leftToggle && rightToggle) || 
        //     (this.correctDirection === "null" && !leftToggle && !rightToggle))) {
        //     return true;
        // }
       // console.log(this.correctDirection);
        return false;

    }

    getCorrectPointX() {
        const [_, operator, num] = this.question.split(' ');
        return this.mapValueToPixel(Number(num));
    }

}