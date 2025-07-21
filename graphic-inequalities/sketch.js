
let model;
let view;
let controller;
let checkAnswerButton;
let newProblemButton;
let showAnswerButton;
let feedbackMessage = "";
let lastCheckedPointX = null;
let lastLeftToggleState = null;
let lastRightToggleState = null;
let showCorrectAnswer = false;
let hintMessage = "";
let isMousePressed = false;
let dragged = false;
let leftArrow;
let rightArrow;
let selectValue;

function setup() {
    let canvas = createCanvas(1000, 400);
    canvas.parent("mainCanvas");
    model = new GraphicModel();
    view = new GraphicView(model);
    controller = new GraphicController(model, view);

    /**
     * Created button to generate new problem 
     */
    newProblemButton = document.getElementById("newProblemButton");
    newProblemButton.addEventListener('click', () => resetToDefault());

    //Initializing lastCheckPointX to value of pointX
    lastCheckedPointX = model.pointX;

    /**
     *   Created button to check answers
     */
    checkAnswerButton = document.getElementById("checkAnswerButton");
    checkAnswerButton.addEventListener('click', () => {
        if (model.pointX !== lastCheckedPointX || view.leftToggleState !== lastLeftToggleState ||
            view.rightToggleState !== lastRightToggleState
        ) {

            const result = model.checkAnswer(view.leftToggleState, view.rightToggleState);
            lastCheckedPointX = model.pointX;
            lastLeftToggleState = view.leftToggleState;
            lastRightToggleState = view.rightToggleState;

            if (result) {
                feedbackMessage = 'Correct ✅';
                checkAnswerButton.innerHTML = 'Correct ✔';
                checkAnswerButton.setAttribute('disabled', true);
                checkAnswerButton.style.backgroundColor = "#ddd";
                showCorrectAnswer = true;

            }
            else {
                model.attempts--;
                feedbackMessage = `Incorrect❌ Try Again.`;
                checkAnswerButton.innerHTML = `Check Again`;
            }
        }
    });

    showAnswerButton = document.getElementById("showAnswerButton");
    showAnswerButton.addEventListener('click', () => {
        showCorrectAnswer = true;
        feedbackMessage = `Correct answer displayed above.`;
        checkAnswerButton.innerHTML = `Check`;
        checkAnswerButton.setAttribute('disabled', true);
        checkAnswerButton.style.backgroundColor = '#ddd';
        showAnswerButton.setAttribute('disabled', true);
    });

    lastLeftToggleState = view.leftToggleState;
    lastRightToggleState = view.rightToggleState
}


function preload(){
    leftArrow = loadImage('images/left-arrow.png');
    rightArrow = loadImage('images/right-arrow.png');
}

/**
 * function to reset all function and values to default
 * @param {*} callee 
 */
function resetToDefault(callee) {
    model.generateQuestions();
    feedbackMessage = "";
    hintMessage = 'Drag to change value';
    model.attempts = 3;
    model.initialPointX = null;
    showCorrectAnswer = false;
    checkAnswerButton.innerHTML = `Check`;
    checkAnswerButton.removeAttribute('disabled');
    showAnswerButton.removeAttribute('disabled');
    lastCheckedPointX = model.mapValueToPixel(0);
    lastLeftToggleState = true;
    lastRightToggleState = true;
    model.pointX = model.mapValueToPixel(0);
    model.initialPointX = model.mapValueToPixel(0);
    view.leftToggleState = true;
    view.rightToggleState = true;
    checkAnswerButton.style.backgroundColor = "#ff2c68";
   // console.log(model.pointX + "  " + model.initialPointX);
}

//draw function of p5.js 
function draw() {
    background(255);
    controller.updateAndDraw();

    let currentValue = model.mapPixelToValue(model.pointX);
   // console.log(currentValue);

    //display feedback

    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`${feedbackMessage}`, model.start + 450, model.pointY + 100);

    if (model.pointX === model.initialPointX) {
        if(!showCorrectAnswer){
        hintMessage = 'Drag to change value';
        fill(144, 3, 252);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(`${hintMessage}`, model.initialPointX, model.pointY - 70);
        }
    }
    else {
        if (!showCorrectAnswer && (model.randomOperator === ">=" || model.randomOperator === "<=")) {
            hintMessage = `Include ${currentValue}`
            fill(144, 3, 252);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(`${hintMessage}`, model.pointX, model.pointY - 70);
        }

        if (!showCorrectAnswer && (model.randomOperator === ">" || model.randomOperator === "<" || model.randomOperator === "!=")) {
            hintMessage = `Exclude ${currentValue}`;
            fill(144, 3, 252);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(`${hintMessage}`, model.pointX, model.pointY - 70);
        }

    }


    /**
     * Displaying solution of the problem below the check button
     */
    // if (showCorrectAnswer) {
    //     controller.displaySolution();

    // }

    /*
    *handling mousePress on line and on all the button
    */
    if (mouseIsPressed && !isMousePressed) {
        controller.handleMousePressed(mouseX, mouseY);
        isMousePressed = true;
    }

    if (!mouseIsPressed && isMousePressed) {
        isMousePressed = false;
    }
}


// function mousePressed(evt) {
//     console.log("🚀 ~ mousePressed ~ evt:", evt)
//     controller.handleMousePressed(mouseX, mouseY,"controller mouse pressed called");
// }

/**
 * mouseDargged function for dragging point on line
 * @param {*} callee 
 */
function mouseDragged(callee) {
    controller.handleMouseDragged(mouseX)
}

function mouseReleased(){
    dragged = false;
}