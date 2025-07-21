

class Model {
    constructor(randomMultiple, randomNumber) {
        this.start = 50;
        this.end = 850;
        this.randomNumber = randomNumber;
        this.randomMultiple = randomMultiple;
        this.rectWidth = 20;
        this.rectHeight = 50;
        //    this.pointX = floor((100 / this.randomNumber) + 5);
        this.pointX = this.randomMultiple * 2;
        this.pointY = 250;
        this.maxPointX = this.pointX * 9;
        this.fixRectSize = this.pointX * this.randomMultiple;
        this.initialLowerPointX = this.randomMultiple * 2;
        this.lowerPointX = this.initialLowerPointX;
        this.initialPointX = this.pointX;
        this.multipleText = 1;
        this.randomBuffer = Math.floor(random(1, 5));
        this.partitionCount = ceil(this.randomNumber / this.randomMultiple) + this.randomBuffer;
        this.partitionWidth = (this.end - this.start) / this.partitionCount;
        this.lowerPartitionText = 1;

        if(!Model.generateNumbers){
            Model.generateNumbers = [];
        }
        Model.generateNumbers.push({number : this.randomNumber, multiple : this.randomMultiple});
    }

    checkTestCases(){
        console.log("Checking stored test cases : ");

        Model.generateNumbers.forEach((testCase, index) => {
            let isMultiple = testCase.number % testCase.multiple === 0;
            console.log(`Test Case ${index + 1} : ${testCase.number} is ${isMultiple ? "" : "not"} a multiple of ${testCase.multiple}`);
        });
    }

    updatePartitionCount() {
        this.partitionCount = ceil(this.randomNumber / max(1, this.multipleText)) + this.randomBuffer;
        this.partitionWidth = (this.end - this.start) / this.partitionCount;
    }

    /**
     * function to calculate included number in each partition
     */
    // updateLowerPartitionText() {

    //     let partitionIndex = floor(this.lowerPointX / this.partitionWidth);
    //     let stepIndex = round((this.lowerPointX % this.partitionWidth) / (this.partitionWidth / this.randomMultiple));

    //     console.log((this.lowerPointX % this.partitionWidth));
    //     console.log((this.partitionWidth / this.randomMultiple));

    //     if (this.lowerPointX === 0) {
    //         this.lowerPartitionText = 0;  // Initial position is 0
    //     } else {
    //         this.lowerPartitionText = partitionIndex * this.randomMultiple + stepIndex;
    //     }
    //     //this.lowerPartitionText = partitionIndex * this.randomMultiple + stepIndex + 1;
    //     console.log(this.partitionWidth);
    //     console.log(partitionIndex + " " + stepIndex + " " + this.lowerPartitionText);

    // }


}