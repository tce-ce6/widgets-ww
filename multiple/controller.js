

class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.upperDragged = false;
        this.lowerDragged = false;
    }

    handleMousePressed(mouseX, mouseY) {
        let dUpper = dist(mouseX, mouseY, this.model.start + this.model.pointX, this.model.pointY);
        let dLower = dist(mouseX, mouseY, this.model.start + this.model.lowerPointX, this.model.pointY + 130)
        if (dUpper < 30) {
            this.upperDragged = true;
        }
        if (dLower < 30) {
            this.lowerDragged = true;
        }
    }

    handleMouseDragged(mouseX) {
        if (this.upperDragged) {
            let step = this.model.randomMultiple;
            let newX = round((mouseX - this.model.start) / step) * step;
            this.model.pointX = floor(constrain(newX, this.model.initialPointX, this.model.maxPointX));
            this.model.updatePartitionCount();
        }
        if (this.lowerDragged) {
            let step = this.model.partitionWidth / this.model.randomMultiple;
            let newX = round((mouseX - this.model.start) / step) * step;
            this.model.lowerPointX = (constrain(newX, 0, this.model.end - this.model.start));
            

            if(mouseX >= 50 && mouseX <= 850){
            this.model.lowerPartitionText = round(newX / (this.model.partitionWidth / this.model.randomMultiple));
            console.log(this.model.lowerPartitionText);
            console.log(mouseX);
            }
            // this.model.updateLowerPartitionText();
        }
    }

    handleMouseReleased() {
        this.upperDragged = false;
        this.lowerDragged = false;
    }

    pointDragged() {
        if (this.upperDragged) {
            push();
            noFill();
            stroke(100, 100, 255);
            strokeWeight(2);
            ellipse(this.model.pointX + 50, this.model.pointY + 20, 25);
            pop();
        }
        if (this.lowerDragged) {
            push();
            noFill();
            stroke(255, 150, 0);
            strokeWeight(2);
            ellipse(this.model.start + this.model.lowerPointX, this.model.pointY + 150, 25);
            pop();
        }
    }

    updateDraw() {
        this.view.displayQuestion();
        this.view.displayUpperRect();
        if(!showAnswer){
            this.view.displayLowerRect();
        }
        else {
            this.view.displayLowerRectResult();
        }
        this.view.displayAnswer();
    }
}