

class View {
    constructor(model) {
        this.model = model;
    }


    displayQuestion() {
        textSize(20);
        textAlign(LEFT, CENTER);
        text(`Is ${this.model.randomNumber} multiple of ${this.model.randomMultiple} ?`, 50, 50);
        text('You can explore multiples with the rectangles below.', 50, 150);
    }

    displayUpperRect() {
        push()
        fill(100, 100, 255);
        stroke(100, 100, 255);
        strokeWeight(2);

        //  this.model.multipleText = floor(map(this.model.pointX, this.model.initialPointX, this.model.maxPointX, 1, 9));
        this.model.multipleText = floor(map(this.model.fixRectSize, this.model.initialPointX, this.model.maxPointX, 1, 9));


        textSize(20);
        textAlign(CENTER, CENTER);
        text(`${this.model.multipleText}`, (this.model.start + this.model.fixRectSize + 50) / 2, this.model.pointY - 50);

        stroke(0);
        strokeWeight(3);
        // rect(this.model.start, this.model.pointY - 30, this.model.pointX, this.model.rectHeight);
        rect(this.model.start, this.model.pointY - 30, this.model.fixRectSize, this.model.rectHeight);

        pop();

        // push();
        // fill(100, 100, 255);
        // stroke(0);
        // strokeWeight(2);
        // ellipse(this.model.pointX + this.model.start, this.model.pointY + 20, 15);
        // pop();
    }

    displayLowerRect() {

        this.model.updatePartitionCount();
        let partitionWidth = ((this.model.end - this.model.start) / this.model.partitionCount);
        for (let i = 0; i < this.model.partitionCount; i++) {
            push();
            noFill();
            stroke(0);
            strokeWeight(3);
            rect(this.model.start + i * partitionWidth, this.model.pointY + 100, partitionWidth, this.model.rectHeight);
            if (Math.round(this.model.lowerPointX) >= Math.round((i + 1) * partitionWidth)) {
                fill(255, 150, 0);
                rect(this.model.start + i * partitionWidth, this.model.pointY + 100, partitionWidth, this.model.rectHeight);
            }
            pop();
        }
        push();
        fill(255, 150, 0);
        stroke(255, 150, 0);
        strokeWeight(2);

        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.model.lowerPartitionText, this.model.start + this.model.lowerPointX, this.model.pointY + 80);

        drawingContext.setLineDash([5, 5]);
        line(this.model.start + this.model.lowerPointX, this.model.pointY + 150,
            this.model.start + this.model.lowerPointX, this.model.pointY + 100
        );
        drawingContext.setLineDash([]);
        ellipse(this.model.start + this.model.lowerPointX, this.model.pointY + 150, 15);
        pop();
    }

    displayLowerRectResult() {

        let lowerPointX = (this.model.partitionWidth / this.model.randomMultiple) * this.model.randomNumber;
        this.model.updatePartitionCount();
        let partitionWidth = ((this.model.end - this.model.start) / this.model.partitionCount);
        for (let i = 0; i < this.model.partitionCount; i++) {
            push();
            noFill();
            stroke(0);
            strokeWeight(2);
            rect(this.model.start + i * partitionWidth, this.model.pointY + 100, partitionWidth, this.model.rectHeight);

            if (lowerPointX >= (i + 1) * partitionWidth) {
                if((model.randomNumber % model.randomMultiple === 0)){
                fill(128, 210, 128);
                }
                else{
                    fill(255, 150, 0);
                }
                rect(this.model.start + i * partitionWidth, this.model.pointY + 100, partitionWidth, this.model.rectHeight);
            }
            pop();
        }
        push();
        fill(128, 210, 128);
        stroke(128, 210, 128);
        strokeWeight(2);

        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.model.randomNumber, this.model.start + lowerPointX, this.model.pointY + 80);

        drawingContext.setLineDash([5, 5]);
        line(this.model.start + lowerPointX, this.model.pointY + 150,
            this.model.start + lowerPointX, this.model.pointY + 100
        );
        drawingContext.setLineDash([]);
        ellipse(this.model.start + lowerPointX, this.model.pointY + 150, 15);
        pop();
    }

    displayAnswer() {

        if (showAnswer) {
            let correct = (model.randomNumber % model.randomMultiple === 0);
            push();
            textSize(20);
            stroke( correct? 'green' : 'green');
            strokeWeight(1);
            fill(correct? 'green' : 'green');
            text(correct ?
                `${model.randomNumber} is multiple of ${model.randomMultiple}` :
                `${model.randomNumber} is not multiple of ${model.randomMultiple}`,
                380, this.model.pointY + 50);
            pop();
        }

        if (correctAnswer !== null) {
            push();
            textSize(18);
            fill(correctAnswer ? 'green' : 'red');
            text(correctAnswer ? 'Correct ✔ Well Done' : '✖ May be next time', 380, this.model.pointY + 200);
            pop();
        }
    }

}