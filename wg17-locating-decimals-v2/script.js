// --- Constants & Config ---
const SVG_WIDTH = 1920;
const SVG_HEIGHT = 1080;
const S = 0.5; 

const MARGIN_X = 384 * S; 
const START_X = MARGIN_X;
const END_X = SVG_WIDTH - MARGIN_X;
const LINE_WIDTH = END_X - START_X;
const SEGMENT_WIDTH = LINE_WIDTH / 10;

const Y_TITLE = 216 * S;
const Y_NUMBER = 345 * S; 
const Y_LINE1 = 540 * S;  
const Y_LINE2 = 972 * S;  
const Y_LINE3 = 1404 * S; 
const Y_FINAL_MSG = 1684 * S;
const Y_FEEDBACK = 1814 * S;

// --- State Variables ---
let simulationState = -1; // -1: Input, 0: Line1 Select, 1: Line1 Zoomed, 2: Line2 Select, 3: Line2 Zoomed, 4: Arrow Place, 5: Result
let inputValue = "";
let isKeyboardVisible = false;
let decimalValue = 0;
let hasNonZeroHundredths = false;

let line1 = { y: Y_LINE1, min: 0, max: 10, step: 1, precision: 0, correct: -1, selected: null, type: 'interval' };
let line2 = { y: Y_LINE2, min: 0, max: 0, step: 0.1, precision: 1, correct: -1, selected: null, type: 'interval' };
let line3 = { y: Y_LINE3, min: 0, max: 0, step: 0.01, precision: 2, correct: -1, selected: null, arrowX: 0 };

let showSearchIcon1 = false;
let showSearchIcon2 = false;
let feedbackMessage = "Enter a decimal between 0 and 10.";
let finalMessage = "";

document.addEventListener('DOMContentLoaded', () => {
    // Preserving existing IDs
    document.getElementById('btn-reset').onclick = initialize;
    document.getElementById('btn-show').onclick = handleShowAnswer;
    document.getElementById('btn-try').onclick = handleTryAgain;
    document.getElementById('btn-submit').onclick = handleSubmit;

    document.querySelectorAll('.keyboard-grid button').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); handleKeyInput(btn.getAttribute('data-key')); };
    });

    const closeKb = document.getElementById('close-keyboard');
    if (closeKb) closeKb.onclick = (e) => { e.stopPropagation(); hideKeyboard(); };

    window.addEventListener('mousedown', (e) => {
        const kb = document.getElementById('floating-keyboard');
        if (isKeyboardVisible && kb && !kb.contains(e.target)) hideKeyboard();
    });

    initialize();
});

function initialize() {
    simulationState = -1;
    inputValue = "";
    isKeyboardVisible = false;
    feedbackMessage = "Enter a decimal between 0 and 10.";
    finalMessage = "";
    showSearchIcon1 = false;
    showSearchIcon2 = false;
    
    line1.selected = null;
    line2.selected = null;
    line2.arrowX = 0;
    line3.selected = null;
    line3.arrowX = 0;

    const kb = document.getElementById('floating-keyboard');
    if (kb) kb.style.display = 'none';
    render();
}

function handleKeyInput(key) {
    if (key === 'bksp') {
        inputValue = inputValue.slice(0, -1);
    } else if (key === '.') {
        if (!inputValue.includes('.') && inputValue.length > 0 && inputValue !== "10") inputValue += '.';
    } else {
        let parts = inputValue.split('.');
        if (parts.length === 1) {
            if (inputValue === "" || (inputValue === "1" && key === "0")) inputValue += key;
        } else if (parts.length === 2 && parts[1].length < 2) {
            inputValue += key;
        }
    }
    render();
}

function showKeyboard() { if (simulationState === -1) { isKeyboardVisible = true; render(); document.getElementById('floating-keyboard').style.display='flex'; } }
function hideKeyboard() { isKeyboardVisible = false; render(); document.getElementById('floating-keyboard').style.display='none'; }

function startSimulation() {
    let val = parseFloat(inputValue);
    if (isNaN(val) || !inputValue.includes('.') || inputValue.split('.')[1].length === 0) return;
    
    decimalValue = val;
    let str = val.toFixed(2);
    // Detect if we need a 3rd line (Hundredths)
    hasNonZeroHundredths = (str.split('.')[1][1] !== '0');
    
    simulationState = 0; 
    hideKeyboard();
    
    line1.correct = Math.floor(decimalValue);
    if (decimalValue === 10) line1.correct = 9;
    
    feedbackMessage = `Select the interval where ${decimalValue} lies.`;
    render();
}

function render() {
    const svg = document.getElementById('main-svg');
    if (!svg) return;
    svg.innerHTML = ''; 

    const isInput = simulationState === -1;
    document.getElementById('btn-show').style.display = isInput ? 'none' : 'inline-block';
    // Submit only shows when an arrow is being used
    document.getElementById('btn-submit').style.display = (simulationState === 4) ? 'inline-block' : 'none';
    document.getElementById('btn-try').style.display = simulationState === 5 ? 'inline-block' : 'none';

    if (isInput) renderInputScreen(svg);
    else renderSimulationScreen(svg);

    renderFeedback(svg);
}

function renderInputScreen(svg) {
    createFO(svg, SVG_WIDTH/2 - 300, Y_TITLE - 40, 600, 80, `<div class="fo-text title-text">Enter a decimal number:</div>`);
    const foInput = createFO(svg, SVG_WIDTH/2 - 250, Y_NUMBER, 350, 80);
    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper' + (isKeyboardVisible ? ' active' : '');
    wrapper.style.cssText = "cursor: text; display: flex; align-items: center; padding-left: 15px; font-size: 35px; height: 100%; width: 100%; border: 2px solid #ccc; border-radius: 8px; background: #fff;";
    wrapper.onclick = (e) => { e.stopPropagation(); showKeyboard(); };
    wrapper.innerHTML = `<span>${inputValue}</span>${isKeyboardVisible ? '<div class="cursor"></div>' : ''}`;
    foInput.appendChild(wrapper);

    const foBtn = createFO(svg, SVG_WIDTH/2 + 120, Y_NUMBER, 120, 80);
    const btn = document.createElement('div');
    let valid = !isNaN(parseFloat(inputValue)) && inputValue.includes('.');
    btn.className = 'svg-btn' + (valid ? ' active' : '');
    btn.innerText = 'Next';
    btn.onclick = () => { if(valid) startSimulation(); };
    foBtn.appendChild(btn);
}

function renderSimulationScreen(svg) {
    createFO(svg, SVG_WIDTH/2 - 200, Y_NUMBER - 40, 400, 80, `<div class="fo-text number-display">${decimalValue}</div>`);
    
    // Line 1: Integer Level
    renderNumberLine(svg, line1, 0);

    // Zoom lines from line 1 to line 2 (persistent)
    if (simulationState >= 2) {
        drawZoomLines(svg, line1.correct, Y_LINE1, Y_LINE2);
    }

    // Line 2: Tenths Level
    if (simulationState >= 2) {
        line2.min = line1.correct;
        line2.max = line1.correct + 1;
        line2.correct = Math.floor((decimalValue * 10) % 10);
        line2.type = (!hasNonZeroHundredths && simulationState >= 4) ? 'arrow' : 'interval';
        renderNumberLine(svg, line2, 1);
    }

    // Zoom lines from line 2 to line 3 (persistent)
    if (simulationState >= 4 && hasNonZeroHundredths) {
        drawZoomLines(svg, line2.correct, Y_LINE2, Y_LINE3);
    }

    // Line 3: Hundredths Level (Only if needed)
    if (simulationState >= 4 && hasNonZeroHundredths) {
        line3.min = parseFloat((line2.min + (line2.correct * 0.1)).toFixed(1));
        line3.max = parseFloat((line3.min + 0.1).toFixed(1));
        line3.correct = Math.round((decimalValue * 100) % 10);
        line3.type = 'arrow';
        renderNumberLine(svg, line3, 2);
    }

    // Magnifier Logic
    if (showSearchIcon1) {
        renderMagnifier(svg, line1.correct, Y_LINE1, () => {
            showSearchIcon1 = false;
            if (hasNonZeroHundredths) {
                simulationState = 2;
                feedbackMessage = `Zoomed in. Now find the correct interval for the tenths.`;
            } else {
                simulationState = 4;
                if (!line2.arrowX) line2.arrowX = START_X;
                line2.selected = 0;
                feedbackMessage = `Zoomed in. Drag the arrow to the exact location.`;
            }
            render();
        });
    }
    if (showSearchIcon2) {
        renderMagnifier(svg, line2.correct, Y_LINE2, () => {
            simulationState = 4; showSearchIcon2 = false;
            feedbackMessage = `Zoomed in. Drag the arrow to the exact location.`;
            render();
        });
    }

    if (simulationState === 5) renderLottieResult(svg);
}

function renderNumberLine(svg, lineObj, depth) {
    const Y = lineObj.y;
    createFO(svg, START_X, Y - 6, LINE_WIDTH, 12, `<div style="background:black; width:100%; height:100%;"></div>`);

    for (let i = 0; i <= 10; i++) {
        let x = START_X + (i * SEGMENT_WIDTH);
        createFO(svg, x - 4, Y - 40, 8, 80, `<div style="background:black; width:100%; height:100%;"></div>`);
        let label = (lineObj.min + (i * lineObj.step)).toFixed(lineObj.precision);
        createFO(svg, x - 50, Y + 50, 100, 40, `<div class="nl-label" style="text-align:center; font-weight:600; font-size:20px;">${label}</div>`);
    }

    if (lineObj.type === 'interval') {
        const canClick = (depth === 0 && simulationState === 0) || (depth === 1 && simulationState === 2);
        for (let i = 0; i < 10; i++) {
            let x = START_X + (i * SEGMENT_WIDTH);
            let fo = createFO(svg, x, Y - 40, SEGMENT_WIDTH, 80);
            let div = document.createElement('div');
            div.className = 'interval-box';
            div.style.borderBottom = 'none';
            
            // Logic for blue (correct) or red (incorrect) selection
            if (lineObj.selected === i) {
                if (i === lineObj.correct) {
                    div.style.borderBottom = "10px solid blue";
                    div.style.boxSizing = "border-box";
                } else {
                    div.style.borderBottom = "10px solid red";
                    div.style.boxSizing = "border-box";
                }
            }
            
            if (canClick) {
                div.onclick = () => handleIntervalSelection(lineObj, i, depth);
                div.style.cursor = 'pointer';
            }
            fo.appendChild(div);
        }
    } else if (lineObj.type === 'arrow') {
        const showTenthsArrow = depth === 1 && !hasNonZeroHundredths && simulationState >= 4;
        const showHundredthsArrow = depth === 2 && hasNonZeroHundredths && simulationState >= 4;
        if (showTenthsArrow || showHundredthsArrow) {
            const isDraggable = true;
            renderArrow(svg, lineObj, simulationState !== 5 && isDraggable);
        }
    }
}

function handleIntervalSelection(lineObj, index, depth) {
    if (index === lineObj.correct) {
        lineObj.selected = index;
        feedbackMessage = "Correct! Use the magnifying glass to see closer.";
        if (depth === 0) showSearchIcon1 = true;
        else if (depth === 1) showSearchIcon2 = true;
    } else {
        lineObj.selected = index;
        feedbackMessage = "That's not the right interval. Try again.";
    }
    render();
}

function renderArrow(svg, lineObj, isDraggable) {
    if (!lineObj.arrowX) lineObj.arrowX = START_X;
    const w = 40, h = 80;
    const fo = createFO(svg, lineObj.arrowX - w/2, lineObj.y - h, w, h);
    const arrow = document.createElement('div');
    arrow.className = 'arrow-container';
    arrow.innerHTML = `<div class="arrow-head" style="width:0;height:0;border-left:20px solid transparent;border-right:20px solid transparent;border-top:30px solid #f39c12;"></div><div style="width:6px;height:50px;background:#f39c12;margin: -5px auto 0;"></div>`;
    
    if (isDraggable) {
        arrow.style.cursor = 'grab';
        arrow.onmousedown = (e) => {
            e.preventDefault();
            arrow.style.cursor = 'grabbing';
            const svgRect = document.getElementById('main-svg').getBoundingClientRect();
            const scaleX = 1920 / svgRect.width;
            
            const move = (ev) => {
                let newX = (ev.clientX - svgRect.left) * scaleX;
                newX = Math.max(START_X, Math.min(END_X, newX));
                
                // Snap to nearest segment point
                let nearestSegment = Math.round(((newX - START_X) / LINE_WIDTH) * 10);
                nearestSegment = Math.max(0, Math.min(10, nearestSegment));
                newX = START_X + (nearestSegment * SEGMENT_WIDTH);
                
                lineObj.arrowX = newX;
                lineObj.selected = nearestSegment;
                fo.setAttribute('x', newX - w/2);
            };
            
            const up = () => {
                arrow.style.cursor = 'grab';
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', up);
            };
            
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
        };
    }
    fo.appendChild(arrow);
}

function renderMagnifier(svg, index, y, onClick) {
    let x = START_X + (index * SEGMENT_WIDTH) + (SEGMENT_WIDTH/2);
    renderLottieIcon(svg, x, y - 90, 'magnify', onClick);
}

function handleSubmit() {
    let activeLine = hasNonZeroHundredths ? line3 : line2;
    simulationState = 5;
    if (activeLine.selected === activeLine.correct) finalMessage = "Well done!";
    else {
        finalMessage = "Check your work";
        activeLine.arrowX = START_X + (activeLine.correct * SEGMENT_WIDTH); // Snap to correct
    }
    feedbackMessage = "";
    render();
}

function handleShowAnswer() {
    if (simulationState === 0) handleIntervalSelection(line1, line1.correct, 0);
    else if (!hasNonZeroHundredths) {
        line2.selected = line2.correct;
        line2.arrowX = START_X + (line2.correct * SEGMENT_WIDTH);
        handleSubmit();
    } else if (simulationState === 2) {
        handleIntervalSelection(line2, line2.correct, 1);
    } else {
        line3.selected = line3.correct; line3.arrowX = START_X + (line3.correct * SEGMENT_WIDTH); handleSubmit();
    }
}

function handleTryAgain() { initialize(); }

// Helpers
function createFO(svg, x, y, w, h, html) {
    const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    fo.setAttribute('x', x); fo.setAttribute('y', y);
    fo.setAttribute('width', w); fo.setAttribute('height', h);
    if (html) fo.innerHTML = html;
    svg.appendChild(fo); return fo;
}

function drawZoomLines(svg, idx, yT, yB) {
    const xS = START_X + (idx * SEGMENT_WIDTH), xE = xS + SEGMENT_WIDTH;
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const l1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l1.setAttribute('x1', xS); l1.setAttribute('y1', yT); l1.setAttribute('x2', START_X); l1.setAttribute('y2', yB);
    l1.setAttribute('stroke', '#e74c3c'); l1.setAttribute('stroke-width', '4');
    const l2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l2.setAttribute('x1', xE); l2.setAttribute('y1', yT); l2.setAttribute('x2', END_X); l2.setAttribute('y2', yB);
    l2.setAttribute('stroke', '#e74c3c'); l2.setAttribute('stroke-width', '4');
    g.appendChild(l1); g.appendChild(l2); svg.appendChild(g);
}

function renderFeedback(svg) {
    if (finalMessage) {
        createFO(svg, 0, Y_FINAL_MSG - 30, SVG_WIDTH, 60, `<div class="fo-text final-text" style="text-align:center; font-size:35px; font-weight:bold;">${finalMessage}</div>`);
        return;
    }
    createFO(svg, 0, Y_FEEDBACK - 20, SVG_WIDTH, 40, `<div class="fo-text feedback-text" style="text-align:center; font-size:30px;">${feedbackMessage}</div>`);
}

function renderLottieIcon(svg, x, y, type, onClick) {
    let size;
    if(type ==='magnify'){
         size = 300;
    }else{
        x = x - 70;
         size = 100;
    }
    const fo = createFO(svg, x - size/2, y - size/2, size, size);
    if(onClick) { fo.style.cursor = 'pointer'; fo.onclick = onClick; }
    const container = document.createElement('div');
    fo.appendChild(container);
    let path = (type === 'magnify') ? 'assets/magnifying-glass.json' : (type === 'success' ? 'assets/success.json' : 'assets/wrong.json');
    lottie.loadAnimation({ container, renderer: 'svg', loop: true, autoplay: true, path });
}

function renderLottieResult(svg) {
    let type = (finalMessage === "Well done!") ? 'success' : 'wrong';
    renderLottieIcon(svg, SVG_WIDTH/2 + 250, Y_FINAL_MSG, type, null);
}
