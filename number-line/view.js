
//view
class NumberLineView {

    constructor(model) {
        this.model = model;
        this.pointX = this.model.pointX;
        this.arrowX = this.model.pointX;
        this.animationSpeed = 0.05;
    }

    // update(pointX) {
    //     this.model.pointX = pointX;
    //     this.render();
    // }

    update(pointX) {
        this.model.updatePointX(pointX);
        this.render();
    }

    render() {
        if (this.testCases) {
            for (let testCase of this.testCases) {
                if (testCase.values.includes(this.model.pointX)) {
                    console.log(`Rendering view with test case value: ${this.model.pointX}`);
                    break;
                }
            }
        }

        background(255); // Clear the canvas

        this.drawNumberLine();
        this.drawPoint();
        this.drawArrow();
    }


    drawNumberLine() {

        //straight line on X & Y co-ordinate
        stroke(0);
        strokeWeight(1);
        line(this.model.start, this.model.pointY, this.model.end, this.model.pointY);

        //vertical line on x & y co-ordinate
        stroke(0);
        strokeWeight(1);
        line(width / 2, this.model.pointY, width / 2, 0);
        triangle(width / 2, 0, width / 2 - 5, 5, width / 2 + 5, 5);

        //tick lines and number lable
        for (let i = -this.model.range; i <= this.model.range; i++) {
            const x = this.model.mapValueToPixel(i);
            line(x, this.model.pointY - 10, x, this.model.pointY + 10);
            fill(0);
            textAlign(CENTER, CENTER);
            text(i, x, this.model.pointY + 20);
        }

    }

    drawPoint() {
        this.pointX = lerp(this.pointX, this.arrowX, 0.5);
        fill(255);
        stroke(0, 0, 255);
        strokeWeight(2);
        ellipse(this.pointX, this.model.pointY, 15);
        push();
        fill(0, 0, 255);
        noStroke();
        textSize(15);
        text('a', this.pointX, this.model.pointY);
        pop();
    }


    drawArrow() {
        const centerValue = this.model.snapToNearest();
        const additionValue = centerValue + this.model.valueXB;
        const subtractionValue = centerValue - this.model.valueXB;

        const additionPixel = this.model.mapValueToPixel(additionValue);
        const subtractionPixel = this.model.mapValueToPixel(subtractionValue);
        const centerPixel = this.model.mapValueToPixel(centerValue);

        //for animating line
        this.arrowX = lerp(this.arrowX, centerPixel, this.animationSpeed);

        const checkBoxAdd = document.getElementById("pendulum");
        const checkBoxSub = document.getElementById("pendulum2");

        if (checkBoxAdd.checked) {
            //draw addition line and arrow
            stroke(0, 200, 0);
            strokeWeight(2);

            if (additionValue > this.model.range) {
                line(this.arrowX, this.model.pointY - 15, additionPixel, this.model.pointY - 15);
                fill(0, 200, 0);
                ellipse(additionPixel, this.model.pointY, 10);
                triangle(additionPixel, this.model.pointY - 15, additionPixel - 10, this.model.pointY - 20, additionPixel - 10, this.model.pointY - 10);
                push();
                noStroke();
                textSize(15);
                text('a + b', additionPixel, this.model.pointY - 30);
                pop();
            }
            else {
                line(this.arrowX, this.model.pointY - 15, additionPixel, this.model.pointY - 15);
                fill(0, 200, 0);
                ellipse(additionPixel, this.model.pointY, 10);
                push();
                noStroke();
                textSize(15);
                text('a + b', additionPixel, this.model.pointY - 30);
                pop();

                push();
                fill(0, 0, 255);
                stroke(0, 0, 255);
                strokeWeight(0.5);
                textSize(15)
                text('(b)', additionPixel - 35, this.model.pointY - 30);
                pop();
                // triangle(additionPixel, this.model.pointY, additionPixel - 10, this.model.pointY - 5, additionPixel - 10, this.model.pointY + 5);

                if (this.model.valueXB < 0) {
                    triangle(additionPixel, this.model.pointY - 15, additionPixel + 10, this.model.pointY - 20, additionPixel + 10, this.model.pointY - 10);
                }
                else {
                    triangle(additionPixel, this.model.pointY - 15, additionPixel - 10, this.model.pointY - 20, additionPixel - 10, this.model.pointY - 10);
                }
            }

            //dislying the addition 

            //ADDITION
            fill(221, 255, 221)
            stroke(0);
            rect(120, this.model.pointY + 70, 250, 80);

            fill(0);
            noStroke();
            textSize(16);
            textAlign(LEFT, CENTER);
            text(`Addition : (${centerValue}) + (${this.model.valueXB}) = ${additionValue}`, 130, this.model.pointY + 110);

        }

        //draw subtraction line and arrow
        if (checkBoxSub.checked) {
            stroke(200, 0, 0);
            strokeWeight(2);
            if (subtractionValue < -this.model.range) {
                line(this.arrowX, this.model.pointY - 15, subtractionPixel, this.model.pointY - 15);
                fill(200, 0, 0);
                ellipse(subtractionPixel, this.model.pointY, 10);
                triangle(subtractionPixel, this.model.pointY - 15, subtractionPixel + 10, this.model.pointY - 10, subtractionPixel + 10, this.model.pointY - 20);
                push();
                noStroke();
                textSize(15);
                text('a - b', subtractionPixel, this.model.pointY - 30);
                pop();

            }
            else {
                line(this.arrowX, this.model.pointY - 15, subtractionPixel, this.model.pointY - 15);
                fill(200, 0, 0);
                ellipse(subtractionPixel, this.model.pointY, 10);
                push();
                noStroke();
                textSize(15);
                text('a - b', subtractionPixel, this.model.pointY - 30);
                pop();

                push();
                fill(0, 0, 255);
                stroke(0, 0, 255);
                strokeWeight(0.5);
                textSize(15)
                text('(b)', subtractionPixel + 35, this.model.pointY - 30);
                pop();

                //  triangle(subtractionPixel, this.model.pointY, subtractionPixel + 10, this.model.pointY + 5, subtractionPixel + 10, this.model.pointY - 5);

                if (this.model.valueXB < 0) {
                    triangle(subtractionPixel, this.model.pointY - 15, subtractionPixel - 10, this.model.pointY - 10, subtractionPixel - 10, this.model.pointY - 20);
                }
                else {
                    triangle(subtractionPixel, this.model.pointY - 15, subtractionPixel + 10, this.model.pointY - 10, subtractionPixel + 10, this.model.pointY - 20);
                }
            }

            //DISPLAY subtraction value
            //Subtraction
            fill(255, 221, 221)
            stroke(0)
            rect(120, this.model.pointY + 170, 250, 80);

            fill(0);
            noStroke();
            textSize(16);
            textAlign(LEFT, CENTER);
            text(`Subtraction : (${centerValue}) - (${this.model.valueXB}) = ${subtractionValue}`, 130, this.model.pointY + 210);
        }

    }



    displayNearestValue(nearestValue) {
        //Value of addition a
        this.model.pointXA = this.model.mapPointXToXA(this.model.pointX);
        // this.model.pointXA = map(this.model.pointX, this.model.start, this.model.end, width / 2 + 100, this.model.end);
        fill(0, 0, 255);
        noStroke();
        ellipse(this.model.pointXA, this.model.pointY + 110, 15);
        stroke(0, 0, 255);
        strokeWeight(2);
        line(width / 2 + 100, this.model.pointY + 110, this.model.end, this.model.pointY + 110);

        noFill();
        stroke(0);
        strokeWeight(1);
        rect(this.model.end + 10, this.model.pointY + 90, 25, 20);

        fill(0);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text(`${nearestValue}`, this.model.end + 21, this.model.pointY + 100);

        fill(0);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text(`a = ${nearestValue}`, width / 2 + 200, this.model.pointY + 70);
        //console.log(nearestValue);


        //value of subtraction b
        fill(255, 0, 0);
        noStroke();
        ellipse(this.model.pointXB, this.model.pointY + 210, 15);
        stroke(255, 0, 0);
        strokeWeight(2);
        line(width / 2 + 100, this.model.pointY + 210, this.model.end, this.model.pointY + 210);

        noFill();
        stroke(0);
        strokeWeight(1);
        rect(this.model.end + 10, this.model.pointY + 190, 25, 20);

        fill(0);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text(`${this.model.valueXB}`, this.model.end + 21, this.model.pointY + 200);

        fill(0);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text(`b = ${this.model.valueXB}`, width / 2 + 200, this.model.pointY + 170);
    }
}