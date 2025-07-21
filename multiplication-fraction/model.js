//fraction-model

class FractionModel{
    constructor(numerator1, denominator1, numerator2, denominator2, width, height){
        this.numerator1 = numerator1;
        this.numerator2 = numerator2;
        this.denominator1 = denominator1;
        this.denominator2 = denominator2;
        this.resultNumerator = this.numerator1 * this.numerator2;
        this.resultDenominator = this.denominator1 * this.denominator2;
        this.width = width;
        this.height = height;
        this.rectRange = 40;
        this.snappingRange = 30;
        this.pointX = 50;
        this.pointY = 450;
        this.start = 50;
        this.end = 650
    }

    calculateResult(){
        return {
            numerator : this.resultNumerator,
            denominator : this.resultDenominator
        }
    }

}


