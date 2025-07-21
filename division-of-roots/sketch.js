let canvas;
let slider;
let num1;
let num2;
let currentStep = 0;
let totalSteps = 3;

function setup() {
    canvas = createCanvas(800, 400);
    canvas.parent("mainCanvas");

    slider = select("#heightSlider");
   // slider.input(() => handleSliderInput(slider.value()));
    button = document.getElementById("newProblemButton");
    button.addEventListener('click', () => {
        currentStep = 0;
        updateStepButtons();
        randomRoots();
    });

    updateStepButtons();
    randomRoots();
}

function windowResized() {
    // Keep canvas size fixed but center it
    const container = document.getElementById('mainCanvas');
    if (container.offsetWidth < 800) {
        const scale = container.offsetWidth / 800;
        canvas.style('transform', `scale(${scale})`);
        canvas.style('transform-origin', 'center center');
    } else {
        canvas.style('transform', 'none');
    }
}

function updateStepButtons() {
    const stepButtonsContainer = document.querySelector('.step-buttons');
    stepButtonsContainer.innerHTML = '';

    for (let i = 0; i < totalSteps; i++) {
        const btn = document.createElement('button');
        btn.className = 'step-btn' + (i === currentStep ? ' active' : '');
        btn.textContent = `Step ${i + 1}`;
        btn.dataset.step = i;

        btn.addEventListener('click', function () {
            currentStep = i;
            updateStepButtons();
        });

        stepButtonsContainer.appendChild(btn);
    }
}

function randomRoots() {
    num2 = Math.floor(random(2, 10));
    let possibleMultiples = [];

    for (let i = 10; i < 99; i++) {
        if (i % num2 == 0) {
            possibleMultiples.push(i);
        }
    }
    num1 = random(possibleMultiples);

    return { num1, num2 };
}

function draw() {
    background(255);
    drawRoots();

}


function drawRoots() {
    if (currentStep >= 0) {
        stroke(0);
        strokeWeight(2);
        line(50, 50, 85, 50);
        line(50, 50, 40, 70);
        line(40, 70, 38, 60);

        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        strokeWeight(0.5);
        textSize(22);
        text(`${num1}`, 55, 70);
        pop();

        line(30, 85, 100, 85);

        // push();
        // stroke(0);
        // strokeWeight(0.5);
        // textSize(22);
        // text("=", 120, 93);
        // pop();

        line(50, 100, 85, 100);
        line(50, 100, 40, 120);
        line(40, 120, 38, 110);

        push();
        fill(255, 20, 147);
        stroke(255, 20, 147);
        strokeWeight(0.5);
        textSize(22);
        text(`${num2}`, 55, 120);
        pop();
    }

    if (currentStep >= 1) {

        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(22);
        text("=", 120, 170);
        pop();

        line(170, 130, 210, 130);
        line(170, 130, 160, 200);
        line(160, 200, 156, 180);

        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        strokeWeight(0.5);
        textSize(22);
        text(`${num1}`, 180, 155);
        pop();

        line(175, 165, 210, 165);

        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(24);
        text("Divide the radicands", 320, 165);
        pop();

        push();
        fill(255, 20, 147);
        stroke(255, 20, 147);
        strokeWeight(0.5);
        textSize(22);
        text(`${num2}`, 185, 190);
        pop();

    }

    if (currentStep >= 2) {

        let result = num1 / num2;

        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(22);
        text("=", 120, 250);
        pop();

        line(170, 230, 205, 230);
        line(170, 230, 160, 260);
        line(160, 260, 156, 250);

        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(24);
        text("Simplfy the product", 320, 250);
        pop();

        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        strokeWeight(0.5);
        textSize(22);
        text(`${result}`, 175, 255);
        pop();

    }

}