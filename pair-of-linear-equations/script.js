let board;
let line1 = null, line2 = null, intersection = null;
let label1 = null, label2 = null;
let a1 = 9, b1 = 10, c1 = 10;
let a2 = 6, b2 = 1, c2 = -5;
let showAnswer = false; // controls ratio placeholders
let hidden = true;      // controls graph visibility
let resultText = " ";
const eps = 1e-9;       // Epsilon for floating-point comparison

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
    return slope >= 0 ? 2.5 : -2.5;
}

function clearBoard() {
    if (line1) { board.removeObject(line1); line1 = null; }
    if (line2) { board.removeObject(line2); line2 = null; }
    if (label1) { board.removeObject(label1); label1 = null; }
    if (label2) { board.removeObject(label2); label2 = null; }
    if (intersection) { board.removeObject(intersection); intersection = null; }
}

function formatEquationHTML(a, b, c, colorString, idSuffix) {
    // Determine the element IDs based on the provided suffix (e.g., 'a1_value', 'a2_value')
    const aID = `a${idSuffix}_value`;
    const bID = `b${idSuffix}_value`;
    const cID = `c${idSuffix}_value`;
    
    // --- Configuration ---
    // Use the passed colorString and apply correct styling
    const colorStyle = `style="color: ${colorString}; letter-spacing: 0.4px;"`;
    const varClass = 'class="roman-txt"';

    let html = '';
    
    // 1. X TERM (a*x) - MUST be the first term
    
    // Check for ±1 for the X-term
    if (Math.abs(a) === 1 && a !== 0) {
        // If a = -1, start with a minus sign
        const sign = (a === -1) ? '—' : '';
        
        // **SYNTAX FIX:** Ensure the <i> tag is closed correctly.
        // The value span is hidden to avoid showing '1' or '-1'.
        html += `${sign}<span ${colorStyle}><span id="${aID}" style="display:none;">${a}</span></span><i ${varClass}>x</i>`;
    } else {
        // General case (including a=0)
        const a_val = (a === 0) ? 0 : Math.abs(a); 
        const sign = (a < 0) ? '—' : '';

        // **SYNTAX FIX:** Ensure the <i> tag is closed correctly.
        html += `${sign}<span ${colorStyle}><span id="${aID}">${a_val}</span></span><i ${varClass}>x</i>`;
    }
    // 2. Y TERM (b*y)
    let y_sign = '';
    let y_val_html = '';
    
    if (b > 0) {
        y_sign = ' + ';
    } else if (b < 0) {
        y_sign = ' — ';
    } else { // b === 0
        y_sign = ' + '; 
    }
    
    // Check for ±1 for the Y-term
    if (Math.abs(b) === 1 && b !== 0) {
        // Hide the value span
        y_val_html = `<span ${colorStyle}><span id="${bID}" style="display:none;">${b}</span></span>`;
    } else {
        // General case
        const b_display = (b === 0) ? 0 : Math.abs(b);
        y_val_html = `<span ${colorStyle}><span id="${bID}">${b_display}</span></span>`;
    }
    
    // **SYNTAX FIX:** Ensure the <i> tag is closed correctly.
    html += `${y_sign}${y_val_html}<i ${varClass}>y</i>`;
    
    // =======================================================
    // 3. CONSTANT TERM (c)
    // =======================================================
    let c_sign = '';
    
    if (c > 0) {
        c_sign = ' + ';
    } else if (c < 0) {
        c_sign = ' — ';
    } else { 
        c_sign = ' + '; 
    }
    
    const c_display = Math.abs(c);
    const c_html = `<span ${colorStyle}><span id="${cID}">${c_display}</span></span>`;
    
    html += `${c_sign}${c_html} = 0`;
    
    return html;
}

function formatCoeff(coeff, variable, isFirst = false) {
    // Handle zero
    if (coeff === 0) {
        return (isFirst ? `0<span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>` : ` + 0<span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>`);
    }

    // Handle ±1
    if (coeff === 1) {
        return isFirst ? `<span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>` : ` + <span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>`;
    }
    if (coeff === -1) {
        return isFirst ? `- <span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>` : ` - <span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>`;
    }

    // General case
    return coeff > 0
        ? (isFirst ? `${coeff}<span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>` : ` + ${coeff}<span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>`)
        : (isFirst ? `- ${Math.abs(coeff)}<span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>` : ` - ${Math.abs(coeff)}<span style="font-family: 'Newsreader', serif; font-style: italic;">${variable}</span>`);
}

function formatEquation(a, b, c) {
    let eq = "";
    eq += formatCoeff(a, "x", true);
    eq += formatCoeff(b, "y");

    // constant term
    if (c === 0) {
        eq += " + 0";
    } else if (c > 0) {
        eq += ` + ${c}`;
    } else {
        eq += ` - ${Math.abs(c)}`;
    }

    eq += " = 0";
    return eq;
}


function plotLines() {
    clearBoard();

    // Line 1
    if (b1 !== 0) {
        line1 = board.create('functiongraph',
            [x => (-a1 * x - c1) / b1],
            { strokeColor: 'red', strokeWidth: 2 }
        );

        label1 = board.create('text', [
            () => 0,
            () => (-a1 * 0 - c1) / b1 + getLabelOffset(a1, b1),
            () => formatEquation(a1, b1, c1)
        ], { fontSize: 18, strokeColor: 'red', useMathJax: true  });
    }

    // Line 2
    if (b2 !== 0) {
        line2 = board.create('functiongraph',
            [x => (-a2 * x - c2) / b2],
            { strokeColor: 'blue', strokeWidth: 2 }
        );

        label2 = board.create('text', [
            () => 0,
            () => (-a2 * 0 - c2) / b2 + getLabelOffset(a2, b2) + 3,
            () => formatEquation(a2, b2, c2)
        ], { fontSize: 18, strokeColor: 'blue', useMathJax: true  });
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

    // reflect under-eq displays
    document.getElementById("a1_value").innerText = a1;
    document.getElementById("b1_value").innerText = b1;
    document.getElementById("c1_value").innerText = c1;

    document.getElementById("a2_value").innerText = a2;
    document.getElementById("b2_value").innerText = b2;
    document.getElementById("c2_value").innerText = c2;

    const eq1HTML = formatEquationHTML(a1, b1, c1, 'rgb(241, 93, 82)', 1);
    const eq2HTML = formatEquationHTML(a2, b2, c2, 'rgb(110, 195, 238);', 2);
    
    console.log(eq1HTML);
    console.log(eq2HTML);
    const eq1Container = document.getElementById("eq1_sign");
    if(eq1Container){
        eq1Container.innerHTML = eq1HTML;
    }

    // Inject the fully formatted string into the main container
    const eq2Container = document.getElementById("eq2_sign");
    if (eq2Container) {
        eq2Container.innerHTML = eq2HTML;
    }
}

function enableSolutionButton() {
    const showSolution = document.getElementById("solutionBtn");
    if (showSolution) {
        showSolution.disabled = false;
    }
    // Clear previous result display
    document.getElementById("solutionDiv").style.display = "none";
    document.getElementById("solutionDiv").innerText = "";
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

    enableSolutionButton();
    // ***************************************
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


function determineSolutionType(a1, b1, c1, a2, b2, c2) {
    // Use cross-multiplication for safer ratio comparison (avoids division by zero)

    // Check a1/a2 = b1/b2  =>  a1 * b2 = a2 * b1
    const det_ab = a1 * b2 - a2 * b1;
    const ratioAB_equal = Math.abs(det_ab) < eps;

    // Check b1/b2 = c1/c2  =>  b1 * c2 = b2 * c1
    const det_bc = b1 * c2 - b2 * c1;
    const ratioBC_equal = Math.abs(det_bc) < eps;

    // Determine relationship
    if (!ratioAB_equal) {
        // det(A) ≠ 0
        return { text: "one solution (intersecting lines)", ratioAB: false, ratioBC: false };
    } else if (ratioAB_equal && !ratioBC_equal) {
        // a1/a2 = b1/b2 ≠ c1/c2
        return { text: "no solution (parallel and distinct lines)", ratioAB: true, ratioBC: false };
    } else if (ratioAB_equal && ratioBC_equal) {
        // a1/a2 = b1/b2 = c1/c2
        return { text: "infinite solutions (coincident lines)", ratioAB: true, ratioBC: true };
    }

    return { text: "Undefined or all coefficients zero", ratioAB: false, ratioBC: false };
}

function checkCondition() {
    // toggles ratio placeholders (Show/Hide)
    showAnswer = !showAnswer;

    const solutionData = determineSolutionType(a1, b1, c1, a2, b2, c2);

    if (showAnswer) {
        updateRatioPlaceholdersToValues();

        // Update = or ≠ dynamically
        document.getElementById("eqSign1").innerText = solutionData.ratioAB ? "=" : "≠";
        document.getElementById("eqSign2").innerText = solutionData.ratioBC ? "=" : "≠";

        document.getElementById("toggleBtn").innerText = "Hide";
        document.getElementById("isText").innerText = " ";
        document.getElementById("questionMark").innerText = " ";

        // Store result for solution button
        resultText = solutionData.text;

    } else {
        resetRatioPlaceholders();
        document.getElementById("eqSign1").innerText = "=";
        document.getElementById("eqSign2").innerText = "=";
        document.getElementById("toggleBtn").innerText = "Show";
        document.getElementById("isText").innerText = "Is";
        document.getElementById("questionMark").innerText = "?";
        document.getElementById("solutionDiv").innerText = "";
        document.getElementById("solutionDiv").style.display = "none";
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
            enableSolutionButton();
            // ***************************************
        });
    }

    // Ratio toggle button (Show/Hide ratio values)
    const ratioToggleBtn = document.getElementById("toggleBtn");
    if (ratioToggleBtn) {
        ratioToggleBtn.addEventListener("click", checkCondition);
    }

    // Optional graph hide/show button
    const hideBtn = document.getElementById("hideShowBtn");
    if (hideBtn) {
        hideBtn.addEventListener("click", toggleHide);
        hideBtn.innerText = 'Show Graph'; // initial text
    }

    // Solution button logic
    const solDiv = document.getElementById("solutionDiv");
    const showSolution = document.getElementById("solutionBtn");
    if (showSolution) {

        showSolution.addEventListener("click", () => {
            // Ensure resultText is up-to-date (though onSliderChange/plot should handle it)
            const solutionData = determineSolutionType(a1, b1, c1, a2, b2, c2);
            resultText = solutionData.text;

            solDiv.innerText = resultText;
            solDiv.style.display = "block";
            solDiv.style.left = "20px";
            solDiv.style.top = "20px";
            showSolution.disabled = true; // Disable after showing
        });
        // ***************************************
    }

    // Initial setup
    updateValues();
    clearBoard();

    // ***************************************
    // D I S A B L E  I N I T I A L L Y
    //     const showSolution = document.getElementById("solutionBtn");
    if (showSolution) {
        showSolution.disabled = true;
    }
    // ***************************************
});