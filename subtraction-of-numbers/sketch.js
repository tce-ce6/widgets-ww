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
    num1 = Math.floor(Math.random() * 900) + 100;
    num2 = Math.floor(Math.random() * 900) + 100;
    // Ensure num1 is greater than num2
    if (num1 < num2) {
        [num1, num2] = [num2, num1];
    }
    currentSteps = getSubtractionSteps(num1, num2);
    currentStep = -1; // Show only the problem initially
    updateStepButtons();
    speakStep(currentStep);
}

function getSubtractionSteps(num1, num2) {
    const steps = [];
    const str1 = String(num1).split('').reverse();
    const str2 = String(num2).split('').reverse();
    let result = '';
    let borrowed = false;

    steps.push({
        isInitialStep: true,
        num1,
        num2,
        message: `Let's subtract ${num2} from ${num1}`
    });

    for (let i = 0; i < str1.length; i++) {
        let digit1 = parseInt(str1[i]);
        const digit2 = i < str2.length ? parseInt(str2[i]) : 0;

        // If we borrowed in the previous step, decrease current digit
        if (borrowed) {
            digit1 -= 1;
            borrowed = false;
        }

        // If we need to borrow
        if (digit1 < digit2) {
            borrowed = true;
            digit1 += 10;
            steps.push({
                type: 'borrow',
                digit: digit1,
                position: i,
                message: `Borrow 1 from the next digit, making this digit ${digit1}`
            });
        }

        const difference = digit1 - digit2;
        result = String(difference) + result;

        steps.push({
            type: 'subtract',
            digit1,
            digit2,
            difference,
            position: i,
            result: result,
            message: `${digit1} - ${digit2} = ${difference}`
        });
    }

    return steps;
}

function draw() {
    background(255);
    if (currentSteps.length === 0) return;

    const canvasRight = 600; // rightmost x position for alignment
    const yStart = 100;
    const lineSpacing = 35;
    const fontSize = 32;
    textSize(fontSize);
    textAlign(RIGHT, TOP);
    fill(0);
    stroke(0);

    push();
    textSize(24);
    textAlign(LEFT, TOP);
    stroke(0, 128, 0);
    fill(0, 128, 0);
    text(`Let's subtract ${num2} from ${num1}`, 250, 20);
    textSize(fontSize);
    textAlign(RIGHT, TOP);
    pop();

    // if (currentStep === -1) {
    //     // Show only the problem
    //     const intro = currentSteps[0];
    //     textSize(24);
    //     textAlign(LEFT, TOP);
    //     text(intro.message, 110, 150);
    //     textSize(fontSize);
    //     textAlign(RIGHT, TOP);
    //     return;
    // }

    const stepData = currentSteps[currentStep + 1];
    if (!stepData) return;

    // Prepare numbers as strings, pad with spaces for alignment
    const num1Str = String(num1);
    const num2Str = String(num2);
    const maxLength = Math.max(num1Str.length, num2Str.length);
    const paddedNum1 = num1Str.padStart(maxLength, ' ');
    const paddedNum2 = num2Str.padStart(maxLength, ' ');

    // Draw the subtraction problem, right-aligned
    text(paddedNum1, canvasRight - 200, yStart - 20);
    text('-', canvasRight - (maxLength + 1) * 18 - 190, yStart + lineSpacing - 20);
    text(paddedNum2, canvasRight - 200, yStart + lineSpacing - 20);
    line(canvasRight - maxLength * 18 - 210, yStart + lineSpacing * 2 - 20, canvasRight - 190, yStart + lineSpacing * 2 - 20);

    // Show current step
    textSize(20);
    textAlign(LEFT, TOP);
    let yInfo = yStart + lineSpacing * 2 + 20;
    let y = 220;
    if (stepData.type === 'borrow') {
        push();
        fill(0, 0, 255);
        stroke(0, 0, 255)
        text(`Borrow 1 from next digit`, 50, yInfo);
        text(`Current digit becomes ${stepData.digit}`, 50, yInfo + 30);
        pop();
    } else if (stepData.type === 'subtract') {
        push();
        fill(0, 0, 255);
        stroke(0, 0, 255);
        text(`Step ${currentStep + 1} :`, 50, yInfo);
        pop();
        text(` ${stepData.digit1} - ${stepData.digit2} = ${stepData.difference}`, 120, yInfo);
        textSize(28);
        if (currentStep == currentSteps.length - 2) {
            push();
            fill(0, 128, 0);
            stroke(0, 128, 0);
            text(`Final Result: ${stepData.result}`, 50, yInfo + 70);
            pop();
            text(`${stepData.result}`, canvasRight - y - 30, yStart + lineSpacing + 20);
        }
        else if (currentStep == currentSteps.length - 3) {
            push();
            fill(0, 128, 0);
            stroke(0, 128, 0);
            text(`Partial Result: ${stepData.result}`, 50, yInfo + 70);
            pop();
            text(`${stepData.result}`, canvasRight - y - 15, yStart + lineSpacing + 20);
        }
        else if (currentStep == currentSteps.length - 4) {
            push();
            fill(0, 128, 0);
            stroke(0, 128, 0);
            text(`Partial Result: ${stepData.result}`, 50, yInfo + 70);
            pop();
            text(`${stepData.result}`, canvasRight - y, yStart + lineSpacing + 20);
        }
        else if (currentStep == currentSteps.length - 5) {
            push();
            fill(0, 128, 0);
            stroke(0, 128, 0);
            text(`Partial Result: ${stepData.result}`, 50, yInfo + 70);
            pop();
            text(`${stepData.result}`, canvasRight - y, yStart + lineSpacing + 20);
        }
    }
    // Show current result

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
    if (stepData.type === 'subtract') {
        message += `. The difference is ${stepData.difference}`;
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