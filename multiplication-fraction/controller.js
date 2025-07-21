//Controller

class FractionController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.dragged = false;
    }

    // handleMousePressed(mouseX, mouseY) {
    //     const d = dist(mouseX, mouseY, this.model.pointX, this.model.pointY);
    //     if (d < this.model.snappingRange) {
    //         this.dragged = true;
    //     }
    // }

    // moveBoxes(mouseX) {
    //     if (this.dragged) {
    //         this.model.pointX = floor(constrain(mouseX, this.model.start, this.model.end));
    //         if (this.model.pointX <= 350) {
    //             this.view.num1 = floor(map(this.model.pointX, this.model.start, this.model.end - 300, this.model.start, this.model.end)) - 50;
    //             console.log("num1" + this.view.num1);
    //         }
    //         else if (this.model.pointX > 350 && this.model.pointX <= 650) {
    //             this.view.num2 = floor(this.model.pointX - 350);
    //             console.log("num2" + this.view.num2);

    //         }
    //     }
    // }

    // handleMouseDragged(mouseX) {
    //     if (this.dragged) {
    //         this.model.pointX = floor(constrain(mouseX, this.model.start, this.model.end));
    //     }
    // }

    // handleMouseReleased() {
    //     this.dragged = false;
    // }

    /**
     * function to handle slider value
     * @param {*} value 
     */
    handleSliderChange(value) {
        // Adjust the behavior of the fractions based on the slider value
        let mapValue = map(value, 0, 30, this.model.start, this.model.end);
        this.model.pointX = floor(constrain(mapValue, this.model.start, this.model.end));
        console.log(value+" "+mapValue+" "+this.model.pointX);
        if (value <= 15) {
            this.view.num1 = floor(map(this.model.pointX, this.model.start, this.model.end - 300, this.model.start, this.model.end)) - 50;
            this.view.num2 = 0;
            console.log("num1 - " + this.view.num1 + " "+this.model.pointX);
        } else if (value > 15 && value <= 30) {
            this.view.num2 = floor(this.model.pointX - 350);
            this.view.num1 = 600;
           // console.log("num2 - " + this.view.num2 + " "+this.model.pointX);
        }
    }

    /**
     * function to call drawing function from view
     */
    updateAndDraw() {
        background(255);
        view.displayFraction();
        view.display();
      //  view.displaySliderLine();
      //  view.displayPoint();
    }
}