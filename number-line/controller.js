//controller

class NumberLineController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.dragged = false;
        this.draggedA = false;
        this.draggedB = false;
    }

    handleMousePressed(mouseX, mouseY) {
        const d = dist(mouseX, mouseY, this.model.pointX, this.model.pointY);
        if (d < this.model.snappingRange) {
            this.dragged = true;
        }

        const dA = dist(mouseX, mouseY, this.model.pointXA, this.model.pointY + 110);
        if (dA < 7) {
            this.draggedA = true;
        }

        const dB = dist(mouseX, mouseY, this.model.pointXB, this.model.pointY + 210);
        if (dB < 7) {
            this.draggedB = true;
        }

        //on clicking the point
        for (let i = -this.model.range; i <= this.model.range; i++) {
            const clickNumber = this.model.mapValueToPixel(i);
            const d = dist(mouseX, mouseY, clickNumber, this.model.pointY);
            if (d < this.model.snappingRange)
                this.model.pointX = clickNumber;
        }
    }

    handleMouseDragged(mouseX) {

        if (this.dragged) {
            this.model.updatePointX(constrain(mouseX, this.model.start, this.model.end));
        }
        if (this.draggedA) {
            this.model.updatePointXA(constrain(mouseX, this.model.pointXAStart, this.model.pointXAEnd));
        }

        if (this.draggedB) {
            this.model.pointXB = constrain(mouseX, this.model.pointXAStart, this.model.pointXAEnd);
            this.model.updateValueXB(this.model.pointXB);
        }
    }

    handleMouseReleased() {
        this.dragged = false;
        this.draggedA = false;
        this.draggedB = false;
    }

    //handle reset button to reset to 0
    handleReset() {
        this.model.pointX = this.model.mapValueToPixel(0);
        this.model.pointXB = this.model.mapValueToPixelXB(6);
        this.model.valueXB = this.model.mapPixelXBToValue(this.model.pointXB);
        console.log(this.model.pointXB);
        console.log(this.model.valueXB);
    }

    updateAndDraw() {
        background(255);
        this.view.drawNumberLine();
        this.view.drawPoint();
        this.view.drawArrow();
        const nearestValue = this.model.snapToNearest();
        this.view.displayNearestValue(nearestValue);
    }
}