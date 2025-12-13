// Global variables and configuration
const BOARD_ID = 'jxgbox'; // Ensure this matches your HTML id
const FEEDBACK_ID = 'feedback'; // You may need to add a div with this ID for feedback
const TARGET_NUMBER_ID = 'target-complex-number'; // You may need to add a span/div with this ID

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

function coloredComplexLabel(a, b) {
    function span(text, color) {
        return `<span style="color:${color}">${text}</span>`;
    }

    function formatSigned(n, color, isFirst = false) {
        if (n < 0) return (isFirst ? '− ' : ' − ') + span(Math.abs(n), color);
        return (isFirst ? '' : ' + ') + span(n, color);
    }

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

    return `${formatSigned(a, REAL_COLOR, true)}${formatSigned(b, IMAG_COLOR)} <i>i</i>`;
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

    function span(text, color) {
        return `<span style="color:${color}">${text}</span>`;
    }

    function formatSigned(n, color, isFirst = false) {
        if (n < 0) {
            return (isFirst ? '− ' : ' − ') + span(Math.abs(n), color);
        }
        return (isFirst ? '' : ' + ') + span(n, color);
    }

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
        ${formatSigned(roundedB, colorB)} <i>i</i>
    `;
}


// function formatComplex(a, b) {
//     const roundedA = Math.round(a);
//     const roundedB = Math.round(b);

//     // Helper to format signed numbers with spacing
//     function formatSigned(n, isFirst = false) {
//         if (n < 0) return (isFirst ? '− ' : ' − ') + Math.abs(n);
//         return (isFirst ? '' : ' + ') + n;
//     }

//     // Only real part
//     if (roundedB === 0) {
//         return roundedA < 0 ? `− ${Math.abs(roundedA)}` : `${roundedA}`;
//     }

//     // Only imaginary part
//     if (roundedA === 0) {
//         return roundedB < 0 ? `− ${Math.abs(roundedB)} i` : `${roundedB} i`;
//     }

//     return `${formatSigned(roundedA, true)}${formatSigned(roundedB)} i`;
// }


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
        drawLabels: true,
        minorTicks: 0,
        strokeColor: greenColor,
        majorHeight: 6,
    
        // 🔥 generateLabel MUST be here
        generateLabel: function (tick) {
            const val = Math.round(tick.usrCoords[2]); // ensure integer
            console.log(tick.usrCoord);
            console.log("Hi")
            if (val === 0) return '';
            if (val === 1) return 'i';
            if (val === -1) return '− i';
            return `${val} i`;
        },
    
        label: {
            strokeColor: greenColor,
            fontSize: 12,
            offset: [10, 0],
            cssStyle: `color:${greenColor}; font-weight:bold;`
        }
    });
    

    // Origin dot to match reference (fixed, should not move)
    board.create('point', [0, 0], {
        size: 5,
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
        const labelOffset = x > 8 ? [-50, 20] : [5, 20];

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
        userPlot.coords = { a: x, b: y };

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
    const feedbackEl = document.getElementById(FEEDBACK_ID);
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

// --- Interaction Handlers ---
window.checkAnswer = function () {
    // ... (rest of checkAnswer logic remains the same)
    if (isLocked) return;
    const feedbackEl = document.getElementById(FEEDBACK_ID);
    if (!userPlot) {
        feedbackEl.textContent = 'Please plot a point first.';
        feedbackEl.className = 'incorrect';
        return;
    }
    const userA = userPlot.coords.a;
    const userB = userPlot.coords.b;
    const targetA = targetPoint.a;
    const targetB = targetPoint.b;
    if (userA === targetA && userB === targetB) {
        feedbackEl.textContent = 'Well done! 🎉';
        feedbackEl.className = 'correct';
        isLocked = true;
        document.getElementById('checkAnswer').disabled = true;
    } else {
        feedbackEl.textContent = 'Good attempt, but not the right one!';
        feedbackEl.className = 'incorrect';
    }
};

window.nextProblem = function () {
    currentProblemIndex++;
    loadProblem();
};

window.showAnswer = function () {
    // ... (rest of showAnswer logic remains the same)
    if (isLocked) return;
    isLocked = true;
    const labelOffset = targetPoint.a > 8 ? [-50, 20] : [5, 20];
    const targetA = targetPoint.a;
    const targetB = targetPoint.b;
    const labelText = targetPoint.label;
    const feedbackEl = document.getElementById(FEEDBACK_ID);
    if (userPlot) { board.removeObject(userPlot); userPlot = null; }
    board.create('point', [targetA, targetB],
        {
            name: labelText, size: 5,
            color: 'blue',
            fixed: true,
            // label: { position: 'auto', offset: [0, 10], 
            //     autoPosition: true, 
            //     cssStyle: 'font-weight: bold; color: blue;' }
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
    feedbackEl.innerHTML = `The correct answer is ${labelText}.`;
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