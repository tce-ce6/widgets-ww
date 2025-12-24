// Global variables and configuration
const BOARD_ID = 'jxgbox'; // Ensure this matches your HTML id
const TARGET_NUMBER_ID = 'target-complex-number'; // You may need to add a span/div with this ID
const feedbackEl = document.getElementById('feedback');


// Global state variables
let board;
let targetPoint;
let userPlot;
let isLocked = false;
let currentProblemIndex = 0;

// Data setup (complex numbers)
const COMPLEX_NUMBERS = [];
const REAL_COLOR = '#0066ff';   // a → blue
const IMAG_COLOR = '#17b077';  // b → green

function span(text, color) {
    // return `<span style="color:${color}">${text}</span>`;
    return `<span style="color:${color};">${text}</span>`;
}

function formatSigned(n, color, isFirst = false) {
    if (n < 0) return (isFirst ? '− ' : ' − ') + span(Math.abs(n), color);
    return (isFirst ? '' : ' + ') + span(n, color);
}

function formatSignedB(n, color, isFirst = false) {
    // If the number is 1 or -1, we want to pass an empty string to the span
    const valueToShow = Math.abs(n) === 1 ? "" : Math.abs(n);

    if (n < 0) {
        return (isFirst ? '− ' : ' − ') + span(valueToShow, color);
    }
    // For positive numbers, we only show the sign if it's NOT the first term
    return (isFirst ? '' : ' + ') + span(valueToShow, color);
}

function coloredComplexLabel(a, b) {

    if (b === 0) {
        return a < 0
            ? `− ${span(Math.abs(a), REAL_COLOR)}`
            : span(a, REAL_COLOR);
    }

    if (a === 0) {
        return b < 0
            ? `− ${span(Math.abs(b), IMAG_COLOR)} <i>i</i>`
            : `${span(b, IMAG_COLOR)} <i>i</i>`;
    }

    return `${formatSigned(a, REAL_COLOR, true)}${formatSignedB(b, IMAG_COLOR)} <i style="font-style: italic; font-family: 'Times New Roman', Times, serif;">i</i>`;
}

for (let a = -10; a <= 10; a++) {
    for (let b = -10; b <= 10; b++) {
        if (a !== 0 || b !== 0) {
            COMPLEX_NUMBERS.push({
                a,
                b,
                label: coloredComplexLabel(a, b) // 🎨 colored label
            });
        }
    }
}

const MAX_PROBLEMS = 400;
// Simple Fisher-Yates shuffle
for (let i = COMPLEX_NUMBERS.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [COMPLEX_NUMBERS[i], COMPLEX_NUMBERS[j]] = [COMPLEX_NUMBERS[j], COMPLEX_NUMBERS[i]];
}
const PROBLEMS = COMPLEX_NUMBERS.slice(0, MAX_PROBLEMS);

// --- Utility Functions ---

function formatComplex(a, b) {
    const roundedA = Math.round(a);
    const roundedB = Math.round(b);

    const colorA = '#0066ff';   // real part color
    const colorB = '#17b077';   // imaginary part color

    // Only real part
    if (roundedB === 0) {
        return roundedA < 0
            ? `− ${span(Math.abs(roundedA), colorA)}`
            : span(roundedA, colorA);
    }

    // Only imaginary part
    if (roundedA === 0) {
        return roundedB < 0
            ? `− ${span(Math.abs(roundedB), colorB)} <i>i</i>`
            : `${span(roundedB, colorB)} <i>i</i>`;
    }

    return `
        ${formatSigned(roundedA, colorA, true)}
        ${formatSignedB(roundedB, colorB)} <i style="font-style: italic; font-family: 'Times New Roman', Times, serif;">i</i>
    `;
}

function initializeBoard() {
    // Check if the HTML element exists before trying to draw the board
    if (!document.getElementById(BOARD_ID)) {
        console.error("JSXGraph container element with ID '" + BOARD_ID + "' not found.");
        return;
    }

    // Free existing board if it exists
    if (board) {
        try {
            JXG.JSXGraph.freeBoard(board);
        } catch (e) {
            console.warn("Error freeing board:", e);
        }
        board = null;
    }

    const greenColor = '#17b077';   // Y-axis color
    const blueColor = '#0066ff';    // X-axis color

    // Initialize board with our own axes (for precise styling)
    board = JXG.JSXGraph.initBoard(BOARD_ID, {
        boundingbox: [-11, 11, 11, -11],
        axis: false,
        grid: true,
        keepaspectratio: true,
        showCopyright: false,
        showNavigation: false,
        pan: false,
        zoom: false
    });

    // Base axes - disable default labels to prevent black numbers
    const xAxis = board.create('axis', [[0, 0], [1, 0]], {
        name: 'X',
        strokeColor: blueColor,
        highlightStrokeColor: blueColor,
        withLabel: true,
        firstArrow: true,
        lastArrow: true,
        label: { strokeColor: blueColor, offset: [-12, -18], fontSize: 14 },
        //  withTicks: false  // Disable default ticks to prevent black labels
        ticks: { visible: false }
    });

    const yAxis = board.create('axis', [[0, 0], [0, 1]], {
        name: 'Y',
        strokeColor: greenColor,
        highlightStrokeColor: greenColor,
        withLabel: true,
        firstArrow: true,
        lastArrow: true,
        label: { strokeColor: greenColor, offset: [10, -5], fontSize: 14 },
        // withTicks: false  // Disable default ticks to prevent black labels
        ticks: { visible: false }
    });

    // Ticks for X-axis (numbers)
    board.create('ticks', [xAxis, 1], {
        drawLabels: true,
        minorTicks: 0,
        strokeColor: blueColor,
        majorHeight: 6,
        label: {
            strokeColor: blueColor,
            fontSize: 12,
            // Move numbers below the axis
            offset: [-2, -5],
            cssStyle: `color:${blueColor}; font-weight:bold;`,
            anchorY: 'top'
        }
    });

    board.create('ticks', [yAxis, 1], {
        drawLabels: false,
        minorTicks: 0,
        strokeColor: greenColor,
        majorHeight: 6,

        // // 🔥 generateLabel MUST be here
        // generateLabel: function (tick) {
        //     const val = Math.round(tick.usrCoords[2]); // ensure integer
        //     if (val === 0) return '';
        //     if (val === 1) return 'i';
        //     if (val === -1) return '− i';
        //     return `${val} i`;
        // },

        // label: {
        //     strokeColor: greenColor,
        //     fontSize: 12,
        //     offset: [10, 0],
        //     cssStyle: `color:${greenColor}; font-weight:bold;`
        // }
    });

    // const yMin = -10;
    // const yMax = 10;

    // for (let y = yMin; y <= yMax; y++) {
    //     if (y === 0) continue;

    //     let labelText = '';
    //     if (y === 1) labelText = ' i';
    //     else if (y === -1) labelText = '− i';
    //     else labelText = `${ y}i`;

    //     board.create('text', [0.2, y, labelText], {
    //         strokeColor: greenColor,
    //         anchorX: 'left',
    //         anchorY: 'middle',
    //         fixed: true,
    //         cssStyle: `
    //         color: ${greenColor};
    //         font-weight: bold;
    //         font-size: 12px;
    //     `
    //     });
    // }

    for (let y = -10; y <= 10; y++) {
        if (y === 0) continue;
    
        let labelText = '';
    
        if (y === 1) {
            labelText = 'i';
        } else if (y === -1) {
            labelText = '<span style="font-size:12px;">−</span> i';
        } else if (y < 0) {
            labelText = `<span style="font-size:12px;">−</span> ${Math.abs(y)}i`;
        } else {
            labelText = `${y}i`;
        }
    
        board.create('text', [0.4, y, labelText], {
            strokeColor: greenColor,
            anchorX: 'left',
            anchorY: 'middle',
            fixed: true,
            cssStyle: `
                color: ${greenColor};
                font-weight: bold;
                font-size: 12px;
            `
        });
    }
    


    // Origin dot to match reference (fixed, should not move)
    board.create('point', [0, 0], {
        size: 2,
        color: 'red',
        name: '',
        fixed: true,
        visible: true
    });

    // Reset user plot for new problem
    userPlot = null;

    // Force board update to ensure everything is rendered
    board.update();

    // Use both 'down' and 'up' events for better compatibility
    board.on('down', function (e) {
        handleBoardClick(e);
    });

    board.on('up', function (e) {
        handleBoardClick(e);
    });
}

function handleBoardClick(e) {
    if (isLocked || !board) return;

    try {
        // Get user coordinates from mouse position
        const coords = board.getUsrCoordsOfMouse(e);
        if (!coords || coords.length < 2) return;

        const x = Math.round(coords[0]); // snap to nearest int
        const y = Math.round(coords[1]); // snap to nearest int

        // Validate bounds
        if (x < -10 || x > 10 || y < -10 || y > 10) return;

        // Remove existing user plot if any
        if (userPlot) {
            try {
                board.removeObject(userPlot);
            } catch (err) {
                console.warn("Error removing user plot:", err);
            }
        }

        const labelText = formatComplex(x, y);
        //  const labelOffset = x > 8 ? [-50, 20] : [5, 20];
        const labelOffset = x > 8 ? [-70, -10] : x < -8 ? [10, -15] : [10, -15];

        // Create new user plot point
        userPlot = board.create('point', [x, y], {
            name: labelText,
            size: 4,
            color: 'orange',
            fixed: true,
            label: {
                position: 'auto',
                offset: labelOffset,
                autoPosition: true,
                fontSize: 14,
                cssStyle: `
            font-weight: bold;
            color: orange;
            background: rgba(255, 240, 220, 0.95);
            padding: 2px 5px;
            border-radius: 999px;
            box-shadow: 
                0 0 0 2px rgba(255,165,0,0.3),
                0 4px 8px rgba(0,0,0,0.15);
        `
            }
        });

        // Store coordinates for checking
        userPlot.userData = { a: x, b: y };

        // Force board update
        board.update();
    } catch (error) {
        console.error("Error handling click:", error);
    }
}


function loadProblem() {
    isLocked = false;
    const problem = PROBLEMS[currentProblemIndex % PROBLEMS.length];

    // Update the displayed target number
    const targetEl = document.getElementById(TARGET_NUMBER_ID);
    if (targetEl) {
        targetEl.innerHTML = problem.label;
    }

    // Clear feedback
    if (feedbackEl) {
        feedbackEl.innerHTML = '';
        feedbackEl.className = '';
    }

    // Store target point before recreating board
    targetPoint = { a: problem.a, b: problem.b, label: problem.label };
    userPlot = null;

    // Use setTimeout to ensure DOM is ready after freeing board
    setTimeout(function () {
        // Reinitialize board (this will free old board and create new one)
        initializeBoard();

        // Enable buttons
        const checkBtn = document.getElementById('checkAnswer');
        const showBtn = document.getElementById('showAnswer');
        if (checkBtn) checkBtn.disabled = false;
        if (showBtn) showBtn.disabled = false;
    }, 50);
}

function markCorrect() {
    if (!userPlot) return;

    userPlot.setAttribute({
        color: '#17b077',
        fillColor: '#17b077'
    });

    userPlot.label.setAttribute({
        cssStyle: `
            font-weight:bold;
            color:#0066ff;
            background:#e6f0ff;
            padding:2px 6px;
            border-radius:12px;
            box-shadow: 
                0 0 0 2px rgba(86, 213, 13, 0.3),
                0 4px 8px rgba(116, 191, 116, 0.15);
        `
    });

    board.update();
}

function markWrong() {
    if (!userPlot) return;

    userPlot.setAttribute({
        color: '#d32f2f',
        fillColor: '#d32f2f'
    });

    userPlot.label.setAttribute({
        cssStyle: `
            font-weight:bold;
            color:#d32f2f;
            background:#fdecea;
            padding:2px 6px;
            border-radius:12px;
            box-shadow: 
                0 0 0 2px rgba(246, 7, 7, 0.3),
                0 4px 8px rgba(242, 76, 76, 0.15);
        `
    });

    board.update();
}


// --- Interaction Handlers ---
window.checkAnswer = function () {
    // ... (rest of checkAnswer logic remains the same)
    if (isLocked) return;
    if (!userPlot) {
        feedbackEl.style.display = 'block';
        feedbackEl.textContent = 'Please plot a point first.';
        feedbackEl.style.color = 'red';
        feedbackEl.className = 'incorrect';
        return;
    }
    const userA = userPlot.userData.a;
    const userB = userPlot.userData.b;
    const targetA = targetPoint.a;
    const targetB = targetPoint.b;
    if (userA === targetA && userB === targetB) {
        feedbackEl.style.display = 'block';
        feedbackEl.textContent = 'Well done! 🎉';
        feedbackEl.className = 'correct';
        markCorrect();
        isLocked = true;
        document.getElementById('checkAnswer').disabled = true;
        document.getElementById('showAnswer').disabled = true;
    } else {
        feedbackEl.style.display = 'block';
        feedbackEl.textContent = 'Good attempt, but not the right one!';
        feedbackEl.style.color = 'red';
        feedbackEl.className = 'incorrect';
        markWrong();
        isLocked = true;
        document.getElementById('checkAnswer').disabled = true;
    }
};

window.nextProblem = function () {
    currentProblemIndex++;
    feedbackEl.style.color = 'black';
    feedbackEl.style.display = 'none';
    loadProblem();
};

window.showAnswer = function () {
    // ... (rest of showAnswer logic remains the same)
    // if (isLocked) return;
    isLocked = true;
    //const labelOffset = targetPoint.a > 8 ? [-50, 20] : [5, 20];
    const labelOffset = targetPoint.a > 8 ? [-70, -10] : targetPoint.a < -8 ? [10, -15] : [10, -15];
    const targetA = targetPoint.a;
    const targetB = targetPoint.b;
    const labelText = targetPoint.label;
    // if (userPlot) { board.removeObject(userPlot); userPlot = null; }
    board.create('point', [targetA, targetB],
        {
            name: labelText, size: 4,
            color: 'blue',
            fixed: true,
            label: {
                position: 'auto',
                offset: labelOffset,
                autoPosition: true,
                fontSize: 14,
                cssStyle: `
            font-weight: bold;
            color: #0066ff;
            background: rgba(220, 235, 255, 0.95);
            padding: 2px 5px;
            border-radius: 999px;
            box-shadow:
                0 0 0 2px rgba(0, 102, 255, 0.3),
                0 4px 8px rgba(0, 0, 0, 0.15);`
            }
        });
    feedbackEl.style.display = 'block';
    feedbackEl.innerHTML = `The correct answer is ${labelText}`;
    feedbackEl.className = 'correct';
    document.getElementById('checkAnswer').disabled = true;
    document.getElementById('showAnswer').disabled = true;
};


// --- The Crucial Initialization Block ---
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');
    // 1. Attach button handlers
    const checkBtn = document.getElementById('checkAnswer');
    const nextBtn = document.getElementById('next-btn'); // 'Try Another' in your corrected flow
    const showAnsBtn = document.getElementById('showAnswer'); // 'Show answer' in your corrected flow

    if (checkBtn) checkBtn.onclick = window.checkAnswer;
    if (nextBtn) nextBtn.onclick = window.nextProblem;
    if (showAnsBtn) showAnsBtn.onclick = window.showAnswer;

    // 2. Start the activity ONLY after the DOM is fully loaded
    loadProblem();
});