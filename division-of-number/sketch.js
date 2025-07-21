let canvas;
let currentSteps = [];
let currentStep = -1; // -1 means just show the problem
let dividend, divisor;
let quotient;
let remainder;
let speech;
let audioEnabled = true;

function setup() {
    canvas = createCanvas(800, 400);
    canvas.parent("mainCanvas");
    
    document.getElementById("newProblemButton").addEventListener("click", newProblem);
    if('speechSynthesis' in window){
        speech = window.speechSynthesis;
    }else {
        audioEnabled = false;
        console.log("Speech synthesis not supported");
        document.getElementById('toggleAudio').disabled = true;
      }
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
        btn.addEventListener('click', function() {
            currentStep = i - 1;
            updateStepButtons();
            speakStep(currentStep);
        });
        stepButtonsContainer.appendChild(btn);
    }
}

function newProblem() {
    if (speech) speech.cancel();
    divisor = Math.floor(Math.random() * 8) + 2;
    dividend = Math.floor(Math.random() * 900) + 100;
    while (dividend < divisor) {
        dividend = Math.floor(Math.random() * 900) + 100;
    }
    currentSteps = getDivisionSteps(dividend, divisor);
    currentStep = -1; // Show only the problem initially
    updateStepButtons();
    drawBracket();
    speakStep(currentStep);
}

function getDivisionSteps(dividend, divisor) {
    const digits = String(dividend).split('');
    const steps = [];
    let quotient = '';
    let current = '';
    let position = 0;
    steps.push({ isInitialStep: true, dividend, divisor, message: `Let's divide ${dividend} by ${divisor}` });
    while (position < digits.length) {
        current += digits[position];
        let currentNum = parseInt(current);
        // For the very first digit, always try division if possible
        if (position === 0 && currentNum < divisor && digits.length > 1) {
            // If first digit is not enough, bring down next digit
            position++;
            current += digits[position];
            currentNum = parseInt(current);
            steps.push({
                type: 'carry',
                current: parseInt(digits[0]),
                nextDigit: digits[1],
                position: 0,
                fullQuotient: quotient + '0',
                message: `Bring down the next digit: ${digits[1]}`
            });
            if (quotient.length > 0) {
                quotient += '0';
            }
        }
        if (currentNum < divisor && position < digits.length - 1) {
            // For subsequent digits, add a carry/bring-down step
            steps.push({
                type: 'carry',
                current: currentNum,
                nextDigit: digits[position + 1],
                position: position,
                fullQuotient: quotient + '0',
                message: `Bring down the next digit: ${digits[position + 1]}`
            });
            if (quotient.length > 0) {
                quotient += '0';
            }
            position++;
            continue;
        }
        // Normal division step
        const q = Math.floor(currentNum / divisor);
        const subtract = q * divisor;
        const remainder = currentNum - subtract;
        steps.push({
            type: 'division',
            quotient: q,
            current: currentNum,
            subtract: subtract,
            remainder: remainder,
            nextDigit: position < digits.length - 1 ? digits[position + 1] : null,
            fullQuotient: quotient + q,
            position: position
        });
        quotient += q;
        current = String(remainder);
        position++;
    }
    return steps;
}

function logCurrentStepInfo() {
    if (currentSteps.length === 0) return;
    background(255);
    drawBracket();

    // Show only the problem
    const intro = currentSteps[0];
    push();
    stroke(0, 128, 0);
    fill(0, 128, 0);
    textSize(24);
    text(intro.message, 250, 20);
    textSize(20);
    pop();
    // if (currentStep === -1) {
    //     // Show only the problem
    //     const intro = currentSteps[0];
    //     push();
    //     stroke(0, 128, 0);
    //     fill(0, 128, 0);
    //     textSize(24);
    //     text(intro.message, 250, 50);
    //     textSize(20);
    //     pop();
    //     return;
    // }
    const stepData = currentSteps[currentStep + 1]; // +1 because step 0 is intro
    if (!stepData) return;
    textSize(20);
    stroke(0);
    fill(0);
    text(stepData.fullQuotient, 260, 70);
    let xStart = 260;
    let yStart = 120;
    let spacing = 30;
    let yPos = yStart;
    // Show all steps up to current
    for (let i = 1; i <= currentStep + 1 && i < currentSteps.length; i++) {
        const s = currentSteps[i];
        if (s.type === 'carry') {
            push();
            stroke(0, 0, 255);
            fill(0, 0, 255);
            textSize(18);
            text(`↓ Bring down ${s.nextDigit}`, xStart + 60, yPos + spacing * 2);
            stroke(0, 128, 0);
            fill(0, 128, 0);
            text(`${s.current}${s.nextDigit}`, xStart, yPos + spacing * 2);
            pop();
        } else if (s.type === 'division') {
            push();
            stroke(0);
            fill(0);
            textSize(20);
            text(`${s.current}`, xStart, yPos + 10);
            pop();
            push();
            stroke(128, 0, 128);
            fill(128, 0, 128);
            text(`${s.quotient} × ${divisor} = ${s.subtract}`, xStart + 100, yPos + spacing);
            pop();
            push();
            stroke(0);
            fill(0);
            text(`- ${s.subtract}`, xStart - 12, yPos + spacing);
            pop();
            push();
           stroke(0);
            line(xStart - 10, yPos + spacing + 5, xStart + 70, yPos + spacing + 5);
            pop();
            push();
            stroke(0, 128, 0);
            fill(0, 128, 0);
            text(s.remainder, xStart, yPos + spacing * 2);
            pop();
            if (i < currentSteps.length - 1) {
                stroke(0, 0, 255);
                fill(0, 0, 255);
                text(`Next: ${s.remainder}${s.nextDigit || ''}`, xStart + 100, yPos + spacing * 2);
            } else {
                stroke(0, 128, 0);
                fill(0, 128, 0);
                text(`Remainder : ${s.remainder}`, xStart + 100, yPos + spacing * 2);
                text(`Quotient : ${s.fullQuotient}`, xStart + 100, 70);

            }
        }
        yPos += spacing * 3;
    }
}

function draw() {
    logCurrentStepInfo();
}

function drawBracket() {
    push();
    stroke(0);
    strokeWeight(2);
    line(250, 80, 320, 80);
    noFill();
    arc(240, 80, 20, 60, 0, HALF_PI);
    pop();
    push();
    stroke(0);
    fill(0);
    textSize(20);
    text(`${dividend}`, 260, 100);
    text(`${divisor}`, 230, 100);
    pop();
}

function checkVoices() {
    if (!speech) return false;
    const voices = speech.getVoices();
    return voices.length > 0;
  }

function speakStep(stepIndex) {
    if (!audioEnabled || !checkVoices()) return;
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
    let message = '';
    if (stepData.type === 'carry') {
        message = `Bring down the next digit:${stepData.nextDigit}. As the current digit is not divisible by ${divisor}. Now the number is ${stepData.current}${stepData.nextDigit}.`;
    } else if (stepData.type === 'division') {
        message = `Divide ${stepData.current} by ${divisor}. ${stepData.quotient} times ${divisor} is ${stepData.subtract}. Subtract to get ${stepData.remainder}.`;
        if (stepData.nextDigit) {
            message += ` Bring down the next digit: ${stepData.nextDigit}.`;
        } else {
            message += ` The remainder is ${stepData.remainder}.`;
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
    if (!audioEnabled) {
        speech.cancel();
    }
    document.querySelector('.audio-on').style.display = audioEnabled ? 'inline' : 'none';
    document.querySelector('.audio-off').style.display = audioEnabled ? 'none' : 'inline';
}
