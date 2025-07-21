let canvas;
let slider;
let n;                // The random number to simplify
let perfectSquare;    // Largest perfect square factor
let outsideRoot;      // sqrt(perfectSquare)
let insideRoot;       // Remaining factor inside square root
let simplifiedForm;   // Final simplified string like 7√7
let currentStep = 0;
let totalSteps = 4;

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
   let result =  randomRoots();
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

function randomRoots(min = 100, max = 999){
    n = Math.floor(random(min, max + 1));

    perfectSquare = 1;
  
    // Find the largest perfect square factor
    for (let i = 1; i * i <= n; i++) {
      if (n % (i * i) === 0) {
        perfectSquare = i * i;
      }
    }
  
    outsideRoot = Math.sqrt(perfectSquare);
    insideRoot = n / perfectSquare;
  
    simplifiedForm = outsideRoot === 1
      ? `${n}`
      : `${outsideRoot}${insideRoot}`;
      console.log(n, perfectSquare, outsideRoot, insideRoot, simplifiedForm);
}

function draw() {
    background(255);
    drawRoots();

}


function drawRoots() {
    if (currentStep >= 0) {
        stroke(0);
        strokeWeight(2);
        line(50, 50, 105, 50);
        line(50, 50, 40, 70);
        line(40, 70, 38, 60);


        strokeWeight(0.5);
        textSize(22);
        text(`${n}`, 55, 70);


        // push();
        // stroke(0);
        // strokeWeight(0.5);
        // textSize(22);
        // text("=", 130, 70);
        // pop();
    }

    if (currentStep >= 1) {
        stroke(0);
        strokeWeight(2);
        
        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(22);
        text("=", 130, 120);
        pop();

        line(220, 100, 310, 100);
        line(220, 100, 210, 120);
        line(210, 120, 208, 110);

        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        strokeWeight(0.5);
        textSize(22);
        text(`${perfectSquare}`, 225, 120);
        pop();

        text(".", 260, 120);
        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(24);
        text("Multiply the radicands", 360, 120);
        pop();

        push();
        fill(255, 20, 147);
        stroke(255, 20, 147);
        strokeWeight(0.5);
        textSize(22);
        text(`${insideRoot}`, 270, 120);
        pop();

    }

    if (currentStep >= 2) {
        stroke(0);
        strokeWeight(2);
        
        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(22);
        text("=", 130, 170);
        pop();

        line(220, 150, 260, 150);
        line(220, 150, 210, 170);
        line(210, 170, 208, 160);

        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        strokeWeight(0.5);
        textSize(22);
        text(`${perfectSquare}`, 225, 170);
        pop();

        text(".", 270, 170);
        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(24);
        text("Simplfy the product", 360, 170);
        pop();

        line(300, 150, 345, 150);
        line(300, 150, 290, 170);
        line(290, 170, 288, 160);

        push();
        fill(255, 20, 147);
        stroke(255, 20, 147);
        strokeWeight(0.5);
        textSize(22);
        text(`${insideRoot}`, 305, 170);
        pop();

    }


    if (currentStep >= 3) {
        stroke(0);
        strokeWeight(2);
        
        push();
        stroke(0);
        strokeWeight(0.5);
        textSize(22);
        text("=", 130, 220);
        pop();

        line(220, 200, 270, 200);
        line(220, 200, 210, 220);
        line(210, 220, 208, 210);

        push();
        fill(255, 20, 147);
        stroke(255, 20, 147);
        strokeWeight(0.5);
        textSize(22);
        text(`${insideRoot}`, 225, 220);
        pop();

        // // text(".", 265, 0);
        // push();
        // stroke(0);
        // strokeWeight(0.5);
        // textSize(24);
        // text("Multiply the radicands", 320, 170);
        // pop();

        // line(300, 200, 340, 200);
        // line(300, 200, 290, 220);
        // line(290, 220, 288, 210);

        if(outsideRoot !== 1){
        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        strokeWeight(0.5);
        textSize(22);
        text(`${outsideRoot}`, 180, 220);
        pop();
        }

    }

}