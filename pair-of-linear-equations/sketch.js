let board;
let line1 = null, line2 = null, intersection = null;
let a1 = 9, b1 = 10, c1 = 10;
let a2 = 6, b2 = 1, c2 = -5;

function initBoard() {
    // Create board ONCE with axes
    board = JXG.JSXGraph.initBoard('jxgbox', {
        boundingbox: [-20, 20, 20, -20],
        axis: true,
        showCopyright: false,
        showNavigation : false
    });
}

function plotLines() {
    // Remove previous lines if exist
    if (line1) board.removeObject(line1);
    if (line2) board.removeObject(line2);
    if (intersection) board.removeObject(intersection);

    // Draw line 1: y = (-a1*x - c1)/b1
    if (b1 !== 0) {
        line1 = board.create('functiongraph',
            [x => (-a1 * x - c1) / b1],
            { strokeColor: 'red', strokeWidth: 2 }
        );
    }

    // Draw line 2: y = (-a2*x - c2)/b2
    if (b2 !== 0) {
        line2 = board.create('functiongraph',
            [x => (-a2 * x - c2) / b2],
            { strokeColor: 'blue', strokeWidth: 2 }
        );
    }

    // Intersection point (if both lines exist)
    if (line1 && line2) {
        intersection = board.create('intersection', [line1, line2], { name: 'P', size: 3, color: 'green' });
    }
}

function checkCondition() {
    let ratio1 = (a2 !== 0) ? (a1 / a2).toFixed(2) : "∞";
    let ratio2 = (b2 !== 0) ? (b1 / b2).toFixed(2) : "∞";
    let ratio3 = (c2 !== 0) ? (c1 / c2).toFixed(2) : "∞";

    let text = "";
    if (ratio1 === ratio2 && ratio2 === ratio3) {
        text = `${ratio1} = ${ratio2} = ${ratio3} → Infinite solutions`;
    } else if (ratio1 === ratio2 && ratio2 !== ratio3) {
        text = `${ratio1} = ${ratio2} ≠ ${ratio3} → No solution (parallel)`;
    } else {
        text = `${ratio1}, ${ratio2}, ${ratio3} → Unique solution (intersecting)`;
    }
    document.getElementById("ratioDisplay").innerText = text;
}

function updateValues() {
    a1 = parseInt(document.getElementById("a1").value);
    b1 = parseInt(document.getElementById("b1").value);
    c1 = parseInt(document.getElementById("c1").value);

    a2 = parseInt(document.getElementById("a2").value);
    b2 = parseInt(document.getElementById("b2").value);
    c2 = parseInt(document.getElementById("c2").value);

    document.getElementById("a1_val").innerText = a1;
    document.getElementById("b1_val").innerText = b1;
    document.getElementById("c1_val").innerText = c1;

    document.getElementById("a2_val").innerText = a2;
    document.getElementById("b2_val").innerText = b2;
    document.getElementById("c2_val").innerText = c2;

    // document.getElementById("eq1").innerText = `${a1}x + ${b1}y + ${c1} = 0`;
    // document.getElementById("eq2").innerText = `${a2}x + ${b2}y + ${c2} = 0`;
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize board once
    initBoard();

    // Update coefficients on slider move
    document.querySelectorAll(".coeff-slider").forEach(slider => {
        slider.addEventListener("input", updateValues);
    });

    // Plot only on button click
    document.querySelector(".plot").addEventListener("click", () => {
        updateValues();
        plotLines();
    });

    // Ratio check
    document.getElementById("toggleBtn").addEventListener("click", checkCondition);

    // Initial update (no lines yet, just board + text)
    updateValues();
});
