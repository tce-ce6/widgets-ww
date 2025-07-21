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
  //  slider.input(() => handleSliderInput(slider.value()));
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

function randomRoots(){
    num1 = Math.floor(random(2, 21));
    num2 = Math.floor(random(2, 21));
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

        text(".", 90, 70);

        // push();
        // stroke(0);
        // strokeWeight(0.5);
        // textSize(22);
        // text("=", 165, 70);
        // pop();

        line(120, 50, 155, 50);
        line(120, 50, 110, 70);
        line(110, 70, 108, 60);

        push();
        fill(255, 20, 147);
        stroke(255, 20, 147);
        strokeWeight(0.5);
        textSize(22);
        text(`${num2}`, 125, 70);
        pop();
    }

    if (currentStep >= 1) {
        
        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(22);
        text("=", 165, 120);
        pop();

        line(220, 100, 300, 100);
        line(220, 100, 210, 120);
        line(210, 120, 208, 110);

        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        strokeWeight(0.5);
        textSize(22);
        text(`${num1}`, 225, 120);
        pop();

        text(".", 255, 120);
        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(24);
        text("Multiply the radicands", 320, 120);
        pop();

        push();
        fill(255, 20, 147);
        stroke(255, 20, 147);
        strokeWeight(0.5);
        textSize(22);
        text(`${num2}`, 270, 120);
        pop();

    }

    if (currentStep >= 2) {

        let result = num1 * num2;
        
        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(22);
        text("=", 165, 170);
        pop();

        line(220, 150, 270, 150);
        line(220, 150, 210, 170);
        line(210, 170, 208, 160);

        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(24);
        text("Simplfy the product", 320, 170);
        pop();

        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        strokeWeight(0.5);
        textSize(22);
        text(`${result}`, 225, 170);
        pop();

    }

}