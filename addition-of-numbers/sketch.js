
let canvas;
let currentSteps = [];
let currentStep = -1;
let num1, num2;
let speech;
let audioEnabled = true;

function setup() {
    canvas = createCanvas(800, 400);
    canvas.parent("mainCanvas");

    // Proper event listener binding
    document.getElementById("newProblemButton").addEventListener("click", newProblem);

    // Speech synthesis initialization
    if ('speechSynthesis' in window) {
        speech = window.speechSynthesis;
        // Android voice loading workaround
        const dummy = new SpeechSynthesisUtterance("");
        speech.speak(dummy);
    }

    newProblem();
    addAudioControls();
}

function windowResized() {
    const container = document.getElementById('mainCanvas');
    if (container.offsetWidth < 800) {
        const scale = container.offsetWidth / 800;
        canvas.style('transform', `scale(${scale})`);
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
        btn.textContent = `Step ${i}`;
        btn.disabled = i - 1 > currentSteps.length - 2;

        // Proper scoped click handler
        btn.addEventListener('click', () => {
            currentStep = i - 1;
            speakStep(currentStep);
            updateStepButtons();
        });

        stepButtonsContainer.appendChild(btn);
    }
}

function newProblem() {
    if (speech) speech.cancel();

    // Generate valid numbers
    do {
        num1 = Math.floor(Math.random() * 900) + 100;
        num2 = Math.floor(Math.random() * 900) + 100;
    } while (num1 < 10 || num2 < 10);

    currentSteps = getAdditionSteps(num1, num2);
    currentStep = -1;

    // Prevent recursion with async update
    setTimeout(() => {
        updateStepButtons();
        speakStep(currentStep);
    }, 0);
}

function getAdditionSteps(num1, num2) {
    const steps = [];
    const str1 = String(num1).split('').reverse();
    const str2 = String(num2).split('').reverse();
    const maxLength = Math.max(str1.length, str2.length);
    let carry = 0;
    let result = '';

    steps.push({
        isInitialStep: true,
        num1,
        num2,
        message: `Let's add ${num1} and ${num2}`
    });

    for (let i = 0; i < maxLength; i++) {
        const digit1 = i < str1.length ? parseInt(str1[i]) : 0;
        const digit2 = i < str2.length ? parseInt(str2[i]) : 0;
        const sum = digit1 + digit2 + carry;

        steps.push({
            type: 'addition',
            digit1,
            digit2,
            carry,
            sum,
            position: i,
            result: String(sum % 10) + result,
            message: `Add ${digit1} and ${digit2}${carry > 0 ? ` plus carry ${carry}` : ''}`
        });

        carry = Math.floor(sum / 10);
        result = String(sum % 10) + result;
    }

    if (carry > 0) {
        steps.push({
            type: 'final_carry',
            carry,
            result: String(carry) + result,
            message: `Add the final carry ${carry}`
        });
        result = String(carry) + result;
    }

    return steps;
}

function draw() {
    background(255);
    if (currentSteps.length === 0) return;

    const canvasX = 400;
    const yStart = 80;
    const lineSpacing = 35;
    const fontSize = 32;
    textSize(fontSize);
    textAlign(RIGHT, TOP);
    fill(0);
    stroke(0);

    const num1Str = String(num1);
    const num2Str = String(num2);
    const maxLength = Math.max(num1Str.length, num2Str.length);
    const paddedNum1 = num1Str.padStart(maxLength, ' ');
    const paddedNum2 = num2Str.padStart(maxLength, ' ');

    // if (currentStep === -1) {
    //     push();
    //     textAlign(LEFT, TOP);
    //     stroke(0, 128, 0);
    //     fill(0, 128, 0);
    //     textSize(24);
    //     text(currentSteps[0].message, 250, 20);
    //     textSize(fontSize);
    //     textAlign(RIGHT, TOP);
    //     pop();

    //     push();
    //     text(paddedNum1, canvasX, yStart);
    //     text('+', canvasX - (maxLength + 1) * 18, yStart + lineSpacing);
    //     text(paddedNum2, canvasX, yStart + lineSpacing);
    //     line(canvasX - maxLength * 18 - 20, yStart + lineSpacing * 2, canvasX + 10, yStart + lineSpacing * 2);
    //     pop();
    //     return;
    // }

    const stepData = currentSteps[currentStep + 1];
    if (!stepData) return;


    push();
    textAlign(LEFT, TOP);
    stroke(0, 128, 0);
    fill(0, 128, 0);
    textSize(24);
    text(currentSteps[0].message, 250, 20);
    textSize(fontSize);
    textAlign(RIGHT, TOP);
    pop();

    text(paddedNum1, canvasX, yStart);
    text('+', canvasX - (maxLength + 1) * 18, yStart + lineSpacing);
    text(paddedNum2, canvasX, yStart + lineSpacing);
    line(canvasX - maxLength * 18 - 20, yStart + lineSpacing * 2, canvasX + 10, yStart + lineSpacing * 2);

    if (currentStep == currentSteps.length - 2) {
        stroke(0, 128, 0);
        fill(0, 128, 0);
        text(`${stepData.result}`, canvasX, yStart + 5 + lineSpacing * 2);
    } else if (currentStep > -1) {
        text(`${stepData.result}`, canvasX, yStart + 5 + lineSpacing * 2);
    }

    textSize(20);
    textAlign(LEFT, TOP);
    let yInfo = yStart + lineSpacing * 2 + 20;

    if (stepData.type === 'addition') {
        push();
        textSize(20);
        stroke(0, 0, 200);
        fill(0, 0, 200);
        text("Add ⬇", 100, yInfo);
        pop();
        text(`${stepData.digit1} + ${stepData.digit2}${stepData.carry > 0 ? ` + ${stepData.carry}` : ''} = ${stepData.sum}`, 100, yInfo + 30);
        if (stepData.sum >= 10) {
            text(`Carry ${Math.floor(stepData.sum / 10)}`, 100, yInfo + 60);
        }
    } else if (stepData.type === 'final_carry') {
        text(`Final carry: ${stepData.carry}`, 100, yInfo + 50);
    }
    if (currentStep > - 1) {
        text(`Result: ${stepData.result}`, 100, yInfo + 100);
    }
}
function speakStep(stepIndex) {
    if (!audioEnabled || !speech) return;
    speech.cancel();

    if (stepIndex === -1) {
        const utterance = new SpeechSynthesisUtterance(currentSteps[0].message);
        utterance.rate = 0.9;
        speech.speak(utterance);
        return;
    }

    const stepData = currentSteps[stepIndex + 1];
    if (!stepData) return;

    let message = stepData.message;
    if (stepData.type === 'addition') {
        message += `. The sum is ${stepData.sum}`;
        if (stepData.sum >= 10) {
            message += `. Carry ${Math.floor(stepData.sum / 10)}`;
        }
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
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
    audioOn.style.display = audioEnabled ? 'inline' : 'none';
    audioOff.style.display = audioEnabled ? 'none' : 'inline';
}