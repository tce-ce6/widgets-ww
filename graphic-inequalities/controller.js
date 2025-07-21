class GraphicController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.dragged = false;
    }

    /**
     * function to handle whenever mouse is pressed
     * @param {*} mouseX 
     * @param {*} mouseY 
     * @returns 
     */
    handleMousePressed(mouseX, mouseY) {
       // if (this.model.attempts <= 0) return;
        feedbackMessage = "";
        // console.log("🚀 ~ GraphicView ~ handleMousePressed ~ callee:", callee);
        let d = dist(mouseX, mouseY, this.model.pointX, this.model.pointY);
        if (d < this.model.snappingRange) {
            dragged = true;
        }
        this.view.handleViewMousePress(mouseX, mouseY, "handle View MousePressed called");
       // console.log(model.pointX);
    }

    handleMouseDragged(mouseX) {
      //  if (this.model.attempts <= 0) return;
        this.model.initialPointX = null;
        if (dragged) {
            let constrainedX = constrain(mouseX, this.model.start + this.model.snappingRange, this.model.end - this.model.snappingRange);
            this.model.pointX = this.model.getClosesetTick(constrainedX);
        }
    }

    /**
     * function to call all compenent of UI from view controller
     * @param {*} callee 
     */
    updateAndDraw(callee) {
        const correctPointX = model.getCorrectPointX();

        this.view.displayLine(this.model.start, this.model.pointY, this.model.end, this.model.range);
        if(showCorrectAnswer){
            this.view.drawPoint(correctPointX, this.model.pointY, 15, color(46, 139, 87));
            this.view.resultDraggingLine(this.model.start, this.model.pointY, correctPointX, this.model.end, this.model.correctDirection);
            this.view.drawToggle();
            this.view.displayQuestions();
        }
        else{
        this.view.drawPoint(this.model.pointX, this.model.pointY, 15, color(144, 3, 252));
        this.view.drawDraggingLine(this.model.start, this.model.pointY, this.model.pointX, this.model.end);
        this.view.drawToggle();
        this.view.displayQuestions();
        }
    }
    
    /**
     * function to call all compenent of solution UI from view controller
     * @param {*} callee 
     */
    // displaySolution(callee) {
    //     const correctPointX = model.getCorrectPointX();
    //     this.view.displayLine(this.model.start, 400, this.model.end, this.model.range);
    //     this.view.drawPoint(correctPointX, 380, 15, color(46, 139, 87));
    //     this.view.resultDraggingLine(this.model.start, 380, correctPointX, this.model.end, this.model.correctDirection);
    // }
}