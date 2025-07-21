
class GraphicView {

    constructor(model) {
        this.model = model;
        this.leftToggleState = true;
        this.rightToggleState = true;
    }

    /**
     * Dispaying the random generating question above the line
     * @param {*} callee 
     */
    displayQuestions(callee) {
        fill(0);
        stroke(0);
        strokeWeight(0.2);
        textSize(20);
        textAlign(LEFT, CENTER);
        if (this.model.question) {
            text(`Graph the inequality ${this.model.question}`, this.model.start, 50);
        }
        else {
            text('Press the New Problem Button to get started!', this.model.start, 50);
        }
    }


    // handleViewMousePress(mouseX, mouseY, callee) {
    //     let d1 = dist(mouseX, mouseY, this.model.start + 20, this.model.pointY + 50);
    //     // console.log("🚀 ~ GraphicView ~ handleMousePressed ~ callee:", callee)

    //     if (d1 < 25) {
    //         this.leftToggleState = !this.leftToggleState;
    //     }

    //     let d2 = dist(mouseX, mouseY, this.model.end - 20, this.model.pointY + 50);
    //     // console.log(d2);

    //     if (d2 < 25) {
    //         this.rightToggleState = !this.rightToggleState;
    //     }
    // }

    handleViewMousePress(mouseX, mouseY, callee) {
        let d1 = dist(mouseX, mouseY, this.model.start - 25, this.model.pointY - 20);
        // console.log("🚀 ~ GraphicView ~ handleMousePressed ~ callee:", callee)

        if (d1 < 20) {
            this.leftToggleState = !this.leftToggleState;
        }

        let d2 = dist(mouseX, mouseY, this.model.end + 25, this.model.pointY - 20);
        // console.log(d2);

        if (d2 < 20) {
            this.rightToggleState = !this.rightToggleState;
        }
    }

    /**
     * Displaying scale from range -14 to 14
     * @param {*} start 
     * @param {*} pointY 
     * @param {*} end 
     * @param {*} range 
     */
    displayLine(start, pointY, end, range) {
       // fill(0);
        stroke(0);
        strokeWeight(2);
        line(start - 10, pointY, end + 10, pointY);

        for (let i = -range; i <= range; i++) {
            const x = this.model.mapValueToPixel(i);
            stroke(0);
            strokeWeight(2);
            line(x, pointY - 5, x, pointY + 5);
            if (i % 2 === 0) {
                fill(0);
                noStroke();
                textSize(12);
                textAlign(CENTER, CENTER);
                text(i, x, pointY + 15);
            }

        }

        //Arrow left side
        stroke(0);
        line(start - 10, pointY, start - 5, pointY - 5);
        line(start - 10, pointY, start - 5, pointY + 5);

        //Arrow right side
        line(end + 10, pointY, end + 5, pointY - 5);
        line(end + 10, pointY, end + 5, pointY + 5);
    }

    /**
     * function to draw and display point on the line above scale line
     * @param {*} pointX 
     * @param {*} pointY 
     * @param {*} size 
     * @param {*} c 
     */
    drawPoint(pointX, pointY, size, c) {
        noStroke();
            if (this.model.randomOperator === '<' || this.model.randomOperator === '>' || this.model.randomOperator === '!=') {

            //console.log(this.model.randomNumber+ " "+this.model.mapValueToPixel(pointX)+ " "+pointX);
            //console.log(this.model.randomOperator === '<' || this.model.randomOperator === '>'|| this.model.randomOperator === '!=' && this.model.randomNumber === this.model.mapPixelToValue(pointX))
            fill(255);
            stroke(c);
            strokeWeight(3);
        }
        else {
            fill(c);
        }
        ellipse(pointX, pointY - 25, 15);


        if (dragged) {
            fill(144, 3, 252, 127);
            stroke(c);
            strokeWeight(0.1);
            ellipse(pointX, pointY - 25, size + 15);
        }
    }

    /**
     * function to draw and display line above scale line
     * @param {*} start 
     * @param {*} pointY 
     * @param {*} pointX 
     * @param {*} end 
     */
    drawDraggingLine(start, pointY, pointX, end) {
        stroke(144, 3, 252);
        strokeWeight(3);

        if (this.leftToggleState) {
            line(start - 10, pointY - 25, pointX - 7.5, pointY - 25);
            //Arrow left side
            line(start - 10, pointY - 25, start - 5, pointY - 30);
            line(start - 10, pointY - 25, start - 5, pointY - 20);

        }
        if (this.rightToggleState) {
            line(pointX + 7.5, pointY - 25, end + 10, pointY - 25);

            //Arrow right side
            line(end + 10, pointY - 25, end + 5, pointY - 30);
            line(end + 10, pointY - 25, end + 5, pointY - 20);

        }

        // else {
        //     line(this.model.start - 10, this.model.pointY - 25, this.model.end + 10, this.model.pointY - 25);
        //     //Arrow left side
        //     line(this.model.start - 10, this.model.pointY - 25, this.model.start - 5, this.model.pointY - 30);
        //     line(this.model.start - 10, this.model.pointY - 25, this.model.start - 5, this.model.pointY - 20);

        //     //Arrow right side
        //     line(this.model.end + 10, this.model.pointY - 25, this.model.end + 5, this.model.pointY - 30);
        //     line(this.model.end + 10, this.model.pointY - 25, this.model.end + 5, this.model.pointY - 20);
        // }

    }

    /**
     * Dragging line for solution display
     * @param {*} start 
     * @param {*} pointY 
     * @param {*} pointX 
     * @param {*} end 
     * @param {*} correctDirection 
     */
    resultDraggingLine(start, pointY, pointX, end, correctDirection) {
        stroke(46, 139, 87);
        strokeWeight(3);

        if (correctDirection == 'left' || correctDirection == 'both') {
            line(start - 10, pointY - 25, pointX - 7.5, pointY - 25);
            //Arrow left side
            line(start - 10, pointY - 25, start - 5, pointY - 30);
            line(start - 10, pointY - 25, start - 5, pointY - 20);

        }
        if (correctDirection == 'right' || correctDirection == 'both') {
            line(pointX + 7.5, pointY - 25, end + 10, pointY - 25);

            //Arrow right side
            line(end + 10, pointY - 25, end + 5, pointY - 30);
            line(end + 10, pointY - 25, end + 5, pointY - 20);

        }
    }

    /**
     * function for drawing and displaying left and right toggle button
     * @param {*} callee 
     */
    // drawToggle(callee) {

    //     let width = 50;
    //     let height = 25;

    //     fill(this.leftToggleState ? color(144, 3, 252) : color(200, 200, 200));
    //     noStroke();
    //     rect(this.model.start, this.model.pointY + 40, width, height, height / 2);

    //     const handleL = this.leftToggleState ? this.model.start + width - height / 2 : this.model.start + height / 2;

    //     fill(255);
    //     ellipse(handleL, this.model.pointY + 40 + height / 2, height * 0.9);

    //     fill(0);
    //     textSize(18);
    //     textAlign(CENTER, CENTER);
    //     text('Left Arrow Visible', this.model.start + 130, this.model.pointY + 55);


    //     fill(this.rightToggleState ? color(144, 3, 252) : color(200, 200, 200));
    //     rect(this.model.end - width, this.model.pointY + 40, width, height, height / 2);

    //     const handleR = this.rightToggleState ? this.model.end - height / 2 : this.model.end - width + height / 2;

    //     fill(255);
    //     ellipse(handleR, this.model.pointY + 40 + height / 2, height * 0.9);

    //     fill(0);
    //     textSize(18);
    //     textAlign(CENTER, CENTER);
    //     text('Right Arrow Visible', this.model.end - 140, this.model.pointY + 55);
    // }

    drawToggle(callee) {

        let width = 25;
        let height = 25;

        fill(this.leftToggleState ? color(185, 153, 255) : color(200, 200, 200));
        stroke(0);
        strokeWeight(2);
        rect(this.model.start - 40, this.model.pointY - 38, width, height, 0.5);

        image(leftArrow, this.model.start - 38, this.model.pointY - 35, 20, 20);


        // push();
        // fill(0);
        // stroke(0);
        // textSize(18);
        // text('⬅', this.model.start - 26, this.model.pointY - 25);
        // pop();

        fill(this.rightToggleState ? color(185, 153, 255) : color(200, 200, 200));
        stroke(0);
        strokeWeight(2);
        rect(this.model.end + 15, this.model.pointY - 38, width, height, 0.5);

        image(rightArrow, this.model.end + 18, this.model.pointY - 35, 20, 20);


        // push();
        // fill(0);
        // stroke(0);
        // textSize(18);
        // text('➡', this.model.end + 26, this.model.pointY - 25);
        // pop();
    }
}