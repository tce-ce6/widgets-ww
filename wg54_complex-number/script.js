// Global variables and configuration
const BOARD_ID = 'jxgBox'; // Ensure this matches your HTML id
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
for (let a = -10; a <= 10; a++) {
    for (let b = -10; b <= 10; b++) {
        if (a !== 0 || b !== 0) {
            COMPLEX_NUMBERS.push({
                a: a,
                b: b,
                label: `${a}${b >= 0 ? '+' : ''}${b}i`
            });
        }
    }
}
const MAX_PROBLEMS = 50;
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

    if (roundedB === 0) return `${roundedA}`;
    if (roundedA === 0) return `${roundedB}i`;
    return `${roundedA}${roundedB >= 0 ? '+' : ''}${roundedB}i`;
}

function initializeBoard() {
    // Check if the HTML element exists before trying to draw the board
    if (!document.getElementById(BOARD_ID)) {
        console.error("JSXGraph container element with ID '" + BOARD_ID + "' not found.");
        return;
    }
    
    if (board) JXG.JSXGraph.freeBoard(board);

    board = JXG.JSXGraph.initBoard(BOARD_ID, {
        boundingbox: [-11, 11, 11, -11], 
        axis: false,
        grid: true,
        showCopyright: false,
        showNavigation: false
    });

    // Add Axes setup... (omitting details for brevity, assume previous setup is here)

    // Add X-axis (Real axis)
    board.create('axis', [[0, 0], [1, 0]], { name: 'X', label: { position: 'll', offset: [0, -15], anchorX: 'left', cssStyle: 'font-weight: bold; color: #007bff;' }, ticks: { drawLabels: true, insertTicks: false, majorHeight: -1, minDistance: 1 }});

    // Add Y-axis (Imaginary axis)
    board.create('axis', [[0, 0], [0, 1]], { name: 'Y', label: { position: 'ul', offset: [15, 0], anchorY: 'top', cssStyle: 'font-weight: bold; color: #007bff;' }, ticks: { drawLabels: true, insertTicks: false, majorHeight: -1, minDistance: 1, label: { cssStyle: 'transform: translateY(-50%)', generateLabel: function(tick, board) { const val = tick.usrCoords[1]; if (val === 0) return ''; if (val === 1) return 'i'; if (val === -1) return '-i'; return `${val}i`; } } } });

    // Initial point at origin
    board.create('point', [0, 0], { size: 0, visible: true, name: '', fixed: true, fillColor: 'transparent', strokeColor: 'transparent' });


    // Event handler for plotting a point (no snapping)
    board.on('click', function(e) {
        if (isLocked) return; 

        const coords = board.getCoords(JXG.COORDS_BY_MOUSE, e);
        const x = coords.usrCoords[1];
        const y = coords.usrCoords[2];

        if (x < -10 || x > 10 || y < -10 || y > 10) return;

        if (userPlot) {
            board.removeObject(userPlot);
        }

        const labelText = formatComplex(x, y);

        userPlot = board.create('point', [x, y], {
            name: labelText,
            size: 4,
            color: 'orange', 
            fixed: true, 
            label: { position: 'auto', offset: [0, 10], autoPosition: true, cssStyle: 'font-weight: bold; color: orange;' }
        });

        userPlot.coords = {
            a: Math.round(x),
            b: Math.round(y)
        };
    });
}

function loadProblem() {
    isLocked = false;
    const problem = PROBLEMS[currentProblemIndex % PROBLEMS.length];
    
    // Attempt to update the displayed target number. Handle if the element doesn't exist.
    const targetEl = document.getElementById(TARGET_NUMBER_ID);
    if (targetEl) {
        targetEl.textContent = problem.label;
    } else {
        // Fallback: If you don't have a specific span/div for the complex number, update the whole question div.
        // Based on your HTML: <div class="question"> <h4>Plot the Complex Number :</h4> 2 + 3i </div>
        // You would need to dynamically update the text node here, which is complex.
        // BEST PRACTICE: Add <span id="target-complex-number"></span> next to your 'h4'.
        const questionEl = document.querySelector('.question');
        if (questionEl) {
             // For now, let's assume you've added the span/updated your static text.
             // If you cannot add the span, the static text "2 + 3i" in the HTML will remain.
        }
    }
    
    document.getElementById(FEEDBACK_ID).textContent = '';
    document.getElementById(FEEDBACK_ID).className = '';

    if (board) {
        JXG.JSXGraph.freeBoard(board);
    }
    initializeBoard();

    targetPoint = { a: problem.a, b: problem.b, label: problem.label };
    userPlot = null;

    document.getElementById('checkAnswer').disabled = false;
    document.getElementById('showAnswer').disabled = false;
}

// --- Interaction Handlers ---
window.checkAnswer = function() {
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

window.nextProblem = function() {
    currentProblemIndex++;
    loadProblem();
};

window.showAnswer = function() {
    // ... (rest of showAnswer logic remains the same)
    if (isLocked) return;
    isLocked = true; 
    const targetA = targetPoint.a;
    const targetB = targetPoint.b;
    const labelText = targetPoint.label;
    const feedbackEl = document.getElementById(FEEDBACK_ID);
    if (userPlot) { board.removeObject(userPlot); userPlot = null; }
    board.create('point', [targetA, targetB], { name: labelText, size: 5, color: 'blue', fixed: true, label: { position: 'auto', offset: [0, 10], autoPosition: true, cssStyle: 'font-weight: bold; color: blue;' } });
    feedbackEl.textContent = `The correct answer is ${labelText}.`;
    feedbackEl.className = 'correct';
    document.getElementById('checkAnswer').disabled = true;
    document.getElementById('showAnswer').disabled = true;
};


// --- The Crucial Initialization Block ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Attach button handlers
    const checkBtn = document.getElementById('checkAnswer');
    const nextBtn = document.getElementById('next-btn'); // 'Try Another' in your corrected flow
    const showAnsBtn = document.getElementById('showAnswer'); // 'Show answer' in your corrected flow

    if (checkBtn) checkBtn.onclick = window.checkAnswer;
    if (nextBtn) nextBtn.onclick = window.nextProblem;
    if (showAnsBtn) showAnsBtn.onclick = window.showAnswer;
    
    // 2. Start the activity ONLY after the DOM is fully loaded
    initializeBoard();
    loadProblem();
});