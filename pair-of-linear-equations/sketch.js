let board;
let line1 = null, line2 = null, intersection = null;
let label1 = null, label2 = null;
let a1 = 9, b1 = 10, c1 = 10;
let a2 = 6, b2 = 1, c2 = -5;
let showAnswer = false; // controls ratio placeholders
let hidden = true;      // controls graph visibility

function initBoard() {
    board = JXG.JSXGraph.initBoard('jxgbox', {
        boundingbox: [-20, 20, 20, -20],
        axis: true,
        showCopyright: false,
        showNavigation: false
    });
}

function getLabelOffset(a, b) {
    // small automatic offset depending on slope so text doesn't overlap the line
    if (b === 0) return 0.5;
    let slope = a / b;
    return slope >= 0 ? 1.5 : -1.5;
}

function clearBoard() {
    if (line1) { board.removeObject(line1); line1 = null; }
    if (line2) { board.removeObject(line2); line2 = null; }
    if (label1) { board.removeObject(label1); label1 = null; }
    if (label2) { board.removeObject(label2); label2 = null; }
    if (intersection) { board.removeObject(intersection); intersection = null; }
}

function plotLines() {
    // create fresh lines/labels
    clearBoard();

    // Line 1
    if (b1 !== 0) {
        line1 = board.create('functiongraph',
            [x => (-a1 * x - c1) / b1],
            { strokeColor: 'red', strokeWidth: 2 }
        );

        label1 = board.create('text', [
            () => 6, // x-position
            () => (-a1 * 6 - c1) / b1 + getLabelOffset(a1, b1),
            () => `${a1}x + ${b1}y + ${c1} = 0`
        ], { fontSize: 14, strokeColor: 'red' });
    }

    // Line 2
    if (b2 !== 0) {
        line2 = board.create('functiongraph',
            [x => (-a2 * x - c2) / b2],
            { strokeColor: 'blue', strokeWidth: 2 }
        );

        label2 = board.create('text', [
            () => 8, // x-position
            () => (-a2 * 8 - c2) / b2 + getLabelOffset(a2, b2),
            () => `${a2}x + ${b2}y + ${c2} = 0`
        ], { fontSize: 14, strokeColor: 'blue' });
    }

    // Intersection
    if (line1 && line2) {
        intersection = board.create('intersection', [line1, line2], { name: 'P', size: 3, color: 'green' });
    }
}

function updateRatioPlaceholdersToValues() {
    document.getElementById("ratio_a1_val").innerText = a1;
    document.getElementById("ratio_b1_val").innerText = b1;
    document.getElementById("ratio_c1_val").innerText = c1;
    document.getElementById("ratio_a2_val").innerText = a2;
    document.getElementById("ratio_b2_val").innerText = b2;
    document.getElementById("ratio_c2_val").innerText = c2;
}

function resetRatioPlaceholders() {
    document.getElementById("ratio_a1_val").innerText = "a₁";
    document.getElementById("ratio_b1_val").innerText = "b₁";
    document.getElementById("ratio_c1_val").innerText = "c₁";
    document.getElementById("ratio_a2_val").innerText = "a₂";
    document.getElementById("ratio_b2_val").innerText = "b₂";
    document.getElementById("ratio_c2_val").innerText = "c₂";

    // Update = or ≠ dynamically
    document.getElementById("eqSign1").innerText = "=";
    document.getElementById("eqSign2").innerText = "=";
}

function updateValues() {
    // read sliders
    a1 = parseInt(document.getElementById("a1").value);
    b1 = parseInt(document.getElementById("b1").value);
    c1 = parseInt(document.getElementById("c1").value);

    a2 = parseInt(document.getElementById("a2").value);
    b2 = parseInt(document.getElementById("b2").value);
    c2 = parseInt(document.getElementById("c2").value);

    // reflect under-eq displays
    document.getElementById("a1_val").innerText = a1;
    document.getElementById("b1_val").innerText = b1;
    document.getElementById("c1_val").innerText = c1;

    document.getElementById("a2_val").innerText = a2;
    document.getElementById("b2_val").innerText = b2;
    document.getElementById("c2_val").innerText = c2;
}

function onSliderChange() {
    // called on slider input
    updateValues();

    // Auto-hide graph & ratios when slider changes
    hidden = true;
    clearBoard();

    // Reset ratio state
    showAnswer = false;
    document.getElementById("toggleBtn").innerText = "Show";
    resetRatioPlaceholders();

    // Update optional graph toggle button label if present
    const hideBtn = document.getElementById('hideShowBtn');
    if (hideBtn) hideBtn.innerText = 'Show Graph';
}

function toggleHide() {
    // toggles graph visibility
    hidden = !hidden;

    const hideBtn = document.getElementById('hideShowBtn');
    if (!hidden) {
        // show graph
        plotLines();
        if (hideBtn) hideBtn.innerText = 'Hide Graph';
        // if ratios were already requested, show them too
        if (showAnswer) updateRatioPlaceholdersToValues();
    } else {
        // hide graph
        clearBoard();
        if (hideBtn) hideBtn.innerText = 'Show Graph';
    }
}

function checkCondition() {
    // toggles ratio placeholders (Show/Hide)
    showAnswer = !showAnswer;

    if (showAnswer) {
        updateRatioPlaceholdersToValues();

        let ratioAB = (a2 !== 0 && b2 !== 0) ? (a1 / a2 === b1 / b2) : false;
        let ratioBC = (b2 !== 0 && c2 !== 0) ? (b1 / b2 === c1 / c2) : false;

        // Update = or ≠ dynamically
        document.getElementById("eqSign1").innerText = ratioAB ? "=" : "≠";
        document.getElementById("eqSign2").innerText = ratioBC ? "=" : "≠";

        document.getElementById("toggleBtn").innerText = "Hide";
    } else {
        resetRatioPlaceholders();
        // Reset signs to "="
        document.getElementById("eqSign1").innerText = "=";
        document.getElementById("eqSign2").innerText = "=";
        
        document.getElementById("toggleBtn").innerText = "Show";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initBoard();

    // Attach slider change handler -> onSliderChange (auto-hide behaviour)
    document.querySelectorAll(".coeff-slider").forEach(slider => {
        slider.addEventListener("input", onSliderChange);
    });

    // Plot button: re-read values and un-hide graph (plot)
    const plotBtn = document.querySelector(".plot");
    if (plotBtn) {
        plotBtn.addEventListener("click", () => {
            updateValues();
            hidden = false;
            plotLines();
        });
    }

    // Ratio toggle button (Show/Hide ratio values)
    const ratioToggleBtn = document.getElementById("toggleBtn");
    if (ratioToggleBtn) {
        ratioToggleBtn.addEventListener("click", checkCondition);
    }

    // Optional graph hide/show button (if you have a button with id="hideShowBtn")
    const hideBtn = document.getElementById("hideShowBtn");
    if (hideBtn) {
        hideBtn.addEventListener("click", toggleHide);
        hideBtn.innerText = 'Show Graph'; // initial text
    }

    // Initial sync (reads slider values and keeps graph hidden initially)
    updateValues();
    clearBoard();
});
