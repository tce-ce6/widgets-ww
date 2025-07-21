
//Sketch

let model;
let view;
let controller;
let denominator1;
let denominator2;
let numerator1;
let numerator2;
let button;
let slider;

function setup() {
    let canvas = createCanvas(1000, 400);
    canvas.parent("mainCanvas");
   
    slider = select("#heightSlider");

    slider.input(() => handleSliderInput(slider.value()));

    // button = createButton('New Fraction');
    // button.position(width - 40, height + 10); // Position at the end of the slider
    // button.addClass('custom-button');
    // button.mousePressed(() => {
    //     generateNumber();
    //     model = new FractionModel(numerator1, denominator1, numerator2, denominator2, width, height);
    //     view = new FractionView(model);
    //     controller = new FractionController(model, view);
    // });

    button = document.getElementById("newProblemButton");
    button.addEventListener('click', () => {
        slider.value(0);
        generateNumber();
        model = new FractionModel(numerator1, denominator1, numerator2, denominator2, width, height);
        view = new FractionView(model);
        controller = new FractionController(model, view);
    });
    

    generateNumber();

    model = new FractionModel(numerator1, denominator1, numerator2, denominator2, width, height);
    view = new FractionView(model);
    controller = new FractionController(model, view);
}

/**
 * main draw function to draw component on canvas
 */
function draw() {
    controller.updateAndDraw();
    // textSize(16);
    // fill(0);
    // text('Slide to explore', model.start + 50, model.pointY - 50);
}

// function mousePressed() {
//     controller.handleMousePressed(mouseX, mouseY);
// }

// function mouseDragged() {
//     //  controller.handleMouseDragged(mouseX);
//     controller.moveBoxes(mouseX);

// }

// function mouseReleased() {
//     controller.handleMouseReleased();
// }

/**
 * calling handle slider function from controller
 * @param {*} value 
 */
function handleSliderInput(value){
        controller.handleSliderChange(value);
}

/**
 * generating numerator and denominator randomly
 */
function generateNumber() {
    denominator1 = floor(random(2, 10));
    numerator1 = floor(random(1, denominator1));
    denominator2 = floor(random(2, 10));
    numerator2 = floor(random(1, denominator2));
}