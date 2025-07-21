let canvas;
let currentSteps = [];
let currentStep = -1; // -1 means just show the problem
let num1, num2;
let speech;
let audioEnabled = true;

function setup() {
    canvas = createCanvas(800, 400);
    canvas.parent("mainCanvas");

    document.getElementById("newProblemButton").addEventListener("click", newProblem);
    speech = window.speechSynthesis;
    newProblem();
    addAudioControls();
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
    for (let i = 1; i < currentSteps.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'step-btn' + (i - 1 === currentStep ? ' active' : '');
        btn.dataset.step = i;
        btn.textContent = `Step ${i}`;
        if (i - 1 > currentSteps.length - 2) btn.disabled = true;
        btn.addEventListener('click', function () {
            currentStep = i - 1;
            updateStepButtons();
            speakStep(currentStep);
        });
        stepButtonsContainer.appendChild(btn);
    }
}

function newProblem() {
    if (speech) speech.cancel();
    num1 = Math.floor(Math.random() * 90) + 10; // 2-digit number
    num2 = Math.floor(Math.random() * 90) + 10; // 2-digit number
    currentSteps = getMultiplicationSteps(num1, num2);
    currentStep = -1; // Show only the problem initially
    updateStepButtons();
    speakStep(currentStep);
}

function getMultiplicationSteps(num1, num2) {
    const steps = [];
    const str1 = String(num1);
    const str2 = String(num2);

    // Step 1: Show the problem
    steps.push({
        type: 'problem',
        num1,
        num2,
        message: `Let's multiply ${num1} and ${num2}`
    });

    // Step 2: Multiply by last digit of second number
    const digit2 = parseInt(str2[str2.length - 1]);
    let partial1 = num1 * digit2;
    steps.push({
        type: 'partial',
        num1,
        num2,
        digit2,
        product: partial1,
        index: 0,
        message: `Step 1: ${num1} × ${digit2} = ${partial1}`
    });

    // Step 3: Multiply by second digit of second number
    if (str2.length > 1) {
        const digit1 = parseInt(str2[str2.length - 2]);
        let partial2 = num1 * digit1;
        steps.push({
            type: 'partial',
            num1,
            num2,
            digit2: digit1,
            product: partial2,
            index: 1,
            message: `Step 2: ${num1} × ${digit1} = ${partial2}`
        });

        // Step 4: Show the addition of partial results
        let result = partial1 + (partial2 * 10);
        steps.push({
            type: 'sum',
            num1,
            num2,
            partials: [partial1, partial2 * 10],
            sum: result,
            message: `Step 3: Addition: ${partial1} + ${partial2 * 10}  = `
        });

        // Step 5: Show the final result
        steps.push({
            type: 'result',
            num1,
            num2,
            result: result,
            message: `Final result: ${result}`
        });
    } else {
        // If only one digit, show the result directly
        steps.push({
            type: 'result',
            num1,
            num2,
            result: partial1,
            message: `Final result: ${partial1}`
        });
    }

    return steps;
}

// function draw() {
//     background(255);
//     if (currentSteps.length === 0) return;

//     const str1 = String(num1);
//     const str2 = String(num2);

//     const digit2 = parseInt(str2[str2.length - 1]);
//     let partial1 = num1 * digit2;
//     const digit1 = parseInt(str2[str2.length - 2]);
//     let partial2 = num1 * digit1;
//     let result = partial1 + (partial2 * 10);

//     const canvasRight = 250; // rightmost x position for alignment
//     const yStart = 100;
//     const lineSpacing = 35;
//     const fontSize = 32;
//     textSize(fontSize);
//     fill(0);
//     stroke(0);

//     const stepData = currentSteps[currentStep + 1] || currentSteps[0];
//     const num1Str = String(num1);
//     const num2Str = String(num2);
//     const maxLength = Math.max(num1Str.length, num2Str.length);

//     // Draw the multiplication problem, left-aligned
//     textAlign(LEFT, TOP);
//     text(num1Str, 350, yStart);
//     text('×', 320, yStart + lineSpacing);
//     text(num2Str, 350, yStart + lineSpacing);
//     line(330, yStart + lineSpacing * 2, 370 + maxLength * 20, yStart + lineSpacing * 2);

//     textSize(20);
//     let yInfo = yStart + lineSpacing * 2 + 20;

//     push();
//     stroke(0, 128, 0);
//     fill(0, 128, 0);
//     textSize(32);
//     text(`Let's multiply ${num1} and ${num2}`, 250, 20);
//     pop();

//     if (currentStep >= 0) {
//         textSize(32);
//         text(partial1, 350, yStart + lineSpacing * 2 + 10);
//     }
//     if (currentStep >= 1) {
//         textSize(32);
//         text(partial2 * 10, 330, yStart + lineSpacing * 2 + 40);
//     }
//     if (currentStep >= 2) {
//         textSize(32);
//         text("+", 325, yStart + lineSpacing * 2 + 35);
//         line(330, yStart + lineSpacing * 2 + 60, 410, yStart + lineSpacing * 2 + 60);
//         text(result, 345, yStart + lineSpacing * 2 + 65);
//     }


//     if (stepData.type === 'problem') {
//         stroke(0, 128, 0);
//         fill(0, 128, 0);
//         textSize(32);
//         text(stepData.message, 250, 20);
//         return;
//     }
//     if (stepData.type === 'partial') {
//         // Draw the step message on the right
//         textAlign(RIGHT, TOP);
//         text(stepData.message, canvasRight, yInfo);

//         textAlign(LEFT, TOP);
//         return;
//     }
//     if (stepData.type === 'sum') {
//         // Draw the step message on the right
//         textAlign(RIGHT, TOP);
//         textSize(20);
//         text(stepData.message, canvasRight + 50, yStart + lineSpacing * 2 + 65);
//         return;
//     }
//     if (stepData.type === 'result') {
//         // Draw the final result on the right
//         textSize(24);
//         textAlign(RIGHT, TOP);
//         stroke(0, 128, 0);
//         fill(0, 128, 0);
//         text(stepData.message, canvasRight, yStart + lineSpacing * 2 + 65);
//         return;
//     }
// }

function draw() {
    background(255);
    if (currentSteps.length === 0) return;

    const str1 = String(num1);
    const str2 = String(num2);

    const digit2 = parseInt(str2[str2.length - 1]);
    let partial1 = num1 * digit2;
    const digit1 = parseInt(str2[str2.length - 2]);
    let partial2 = num1 * digit1;
    let result = partial1 + (partial2 * 10);

    const xLeft = 300;
    const yStart = 80;
    const lineSpacing = 30;
    const fontSize = 32;
    textSize(fontSize);
    fill(0);
    stroke(0);

    const stepData = currentSteps[currentStep + 1] || currentSteps[0];
    const num1Str = String(num1);
    const num2Str = String(num2);
    const maxLength = Math.max(num1Str.length, num2Str.length);

    // Draw the multiplication problem (left aligned)
    push();
    textSize(fontSize);
    fill(0);
    stroke(0);
    textAlign(LEFT, TOP);
    text(num1Str, xLeft + 80, yStart);
    text('×', xLeft + 55, yStart + lineSpacing);
    text(num2Str, xLeft + 80, yStart + lineSpacing);
    line(xLeft + 60, yStart + lineSpacing * 2, 390 + maxLength * 20, yStart + lineSpacing * 2);
    pop();
    // Title
    push();
    stroke(0, 128, 0);
    fill(0, 128, 0);
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Let's multiply ${num1} and ${num2}`, 280, 20);
    pop();

    // Steps block starting below the line
    let stepY = yStart + lineSpacing * 2 + 30;
    let stepX = 10;

    if (currentStep >= 0) {
        // Step 1: partial1
        push();
        textSize(26);
        textAlign(LEFT, TOP);
        push();
        fill(0, 0, 255); // Blue for label
        stroke(0, 0, 255);
        text("Step 1:", stepX, stepY);  
        pop();
        fill(0); // Black for value
        text(partial1, 380, yStart + lineSpacing * 2 + 10);
        text(`${num1} × ${digit2} = ${partial1}`, stepX + 90, stepY);
        pop();
        stepY += 40;
    }

    if (currentStep >= 1) {
        // Step 2: partial2
        push();
        textSize(26);
        textAlign(LEFT, TOP);
        push()
        fill(0, 0, 255);
        stroke(0, 0, 255);
        text("Step 2:", stepX, stepY);
        pop();
        fill(0);
        text(partial2 * 10, 365, yStart + lineSpacing * 2 + 40);
        text(`${num1} × ${digit1} = ${partial2}`, stepX + 90, stepY);
        pop();
        stepY += 40;
    }

    if (currentStep >= 2) {
        // Step 3: sum
        push();
        textSize(26);
        textAlign(LEFT, TOP);
        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        text("Step 3:", stepX, stepY);
        pop();
        fill(0);
        text("+", 345, yStart + lineSpacing * 2 + 40);
        line(360, yStart + lineSpacing * 2 + 65, 420, yStart + lineSpacing * 2 + 65);
        text(result, 365, yStart + lineSpacing * 2 + 70);
        text(`${partial1} + ${partial2 * 10} = ${result}`, stepX + 90, stepY);
        pop();
        stepY += 40;
    }

    if (currentStep >= 3) {
        // Step 4: final result
        push();
        textSize(fontSize);
        textAlign(LEFT, TOP);
        push();
        fill(0, 128, 0);
        stroke(0, 128, 0);
        text("Final Result :", stepX, stepY + 20);
        pop();
        fill(0);
        text(`${result}`, stepX + 200, stepY + 20);
        pop();
    }

    // Handle message type for additional context
    // if (stepData && stepData.message) {
    //     push();
    //     textAlign(LEFT, TOP);
    //     textSize(18);
    //     fill(0, 0, 150);
    //     text(stepData.message, 250, height - 50);
    //     pop();
    // }
}


function speakStep(stepIndex) {
    if (!audioEnabled) return;
    if (currentSteps.length === 0 || !speech) return;

    if (stepIndex === -1) {
        const intro = currentSteps[0];
        speech.cancel();
        const utterance = new SpeechSynthesisUtterance(intro.message);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speech.speak(utterance);
        return;
    }

    const stepData = currentSteps[stepIndex + 1];
    if (!stepData) return;

    let message = stepData.message;
    if (stepData.type === 'multiply_step') {
        message += `. We get ${stepData.digit}`;
        if (stepData.carry > 0) {
            message += ` and carry ${stepData.carry}`;
        }
    }

    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speech.speak(utterance);
}

function addAudioControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'audio-controls';
    controlsDiv.innerHTML = `
        <button id="toggleAudio" class="btn btn-secondary">
            <span class="audio-on">🔊</span>
            <span class="audio-off" style="display:none">🔇</span>
        </button>
        <button id="repeatStep" class="btn bte-secondary">↻ Repeat Step</button>
    `;
    document.querySelector('.steps-container').appendChild(controlsDiv);
    document.getElementById('toggleAudio').addEventListener('click', toggleAudio);
    document.getElementById('repeatStep').addEventListener('click', () => speakStep(currentStep));
}

function toggleAudio() {
    audioEnabled = !audioEnabled;
    const audioOn = document.querySelector('.audio-on');
    const audioOff = document.querySelector('.audio-off');
    if (audioEnabled) {
        audioOn.style.display = 'inline';
        audioOff.style.display = 'none';
    } else {
        audioOn.style.display = 'none';
        audioOff.style.display = 'inline';
    }
} 