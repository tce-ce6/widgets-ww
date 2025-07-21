
let model;
let view;
let controller;
let correctAnswer = null;
let btnNewProblem;
let btnYes;
let btnNo;
let btnShowAnswer;
let randomMultiple;
let randomNumber;
let showAnswer = false;

function setup() {
    //createCanvas(900, 500);
    let canvas = createCanvas(900, 500);
    canvas.parent("mainCanvas");

    generateNumber();

    model = new Model(randomMultiple, randomNumber)
    view = new View(model);
    controller = new Controller(model, view);

    btnYes = document.getElementById("yesButton");
    btnYes.addEventListener('click', () => {
        correctAnswer = (model.randomNumber % model.randomMultiple === 0);
        showAnswer = true;
        btnYes.setAttribute('disabled', true);
        btnNo.setAttribute('disabled', true);
    })

    btnNo = document.getElementById("noButton");
    btnNo.addEventListener('click', () => {
        correctAnswer = (model.randomNumber % model.randomMultiple !== 0);
        showAnswer = true;
        btnYes.setAttribute('disabled', true);
        btnNo.setAttribute('disabled', true);
    });

    btnNewProblem = document.getElementById("newProblemButton");
    btnNewProblem.addEventListener('click', () => {
        generateNumber();
        resetToDefault();
        model = new Model(randomMultiple, randomNumber)
        view = new View(model);
        controller = new Controller(model, view);
        showAnswer = false;
        correctAnswer = null;


        model.checkTestCases();
    });

    btnShowAnswer = document.getElementById("showAnswerButton");
    btnShowAnswer.addEventListener('click', () => {
        showAnswer = true;
        btnShowAnswer.setAttribute('disabled', true);
        btnYes.setAttribute('disabled', true);
        btnNo.setAttribute('disabled', true);
    });
}

function mousePressed() {
    controller.handleMousePressed(mouseX, mouseY);
}


function mouseDragged() {
    controller.handleMouseDragged(mouseX);
}

function mouseReleased() {
    controller.handleMouseReleased();
}

function draw() {
    background(255);
    controller.updateDraw();
    controller.pointDragged();
}

function generateNumber() {
    randomNumber = Math.floor(random(10, 99));
    randomMultiple = Math.floor(random(2, 9));
}

function resetToDefault() {
    btnShowAnswer.removeAttribute('disabled');
    btnYes.removeAttribute('disabled');
    btnNo.removeAttribute('disabled');
}