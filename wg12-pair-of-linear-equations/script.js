let board;
let line1 = null, line2 = null, intersection = null;
let label1 = null, label2 = null;
let label1Bg = null, label2Bg = null;
let label1Offset = { x: 0, y: 0 };
let label2Offset = { x: 0, y: 0 };
let a1 = 9, b1 = 10, c1 = 10;
let a2 = 6, b2 = 1, c2 = -5;
let showAnswer = false; // controls ratio placeholders
let hidden = true; // controls graph visibility
let resultText = " ";
const eps = 1e-9;  // Epsilon for floating-point comparison

function initBoard() {
    board = JXG.JSXGraph.initBoard('jxgbox', {
        boundingbox: [-20, 20, 20, -20],
        axis: true,
        showCopyright: false,
        showNavigation: false,
        // attempt to disable pan/zoom interactions
        pan: { enabled: false },
        zoom: { enabled: false, pinch: false },
        // optional: disable default mouse wheel
        mouseDrag: false
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
    if (intersection) { board.removeObject(intersection); intersection = null; }
    if (label1) { board.removeObject(label1); label1 = null; }
    if (label2) { board.removeObject(label2); label2 = null; }
    if (label1Bg) { board.removeObject(label1Bg); label1Bg = null; }
    if (label2Bg) { board.removeObject(label2Bg); label2Bg = null; }
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

/**
 * Helper function to format a coefficient and its variable.
 * @param {number} coeff - The coefficient (a or b).
 * @param {string} variable - The variable ('x' or 'y').
 * @param {boolean} isFirst - True if this is the first term in the equation.
 * @returns {string} The HTML string for the term, or an empty string if coeff is 0.
 */
function formatCoeff(coeff, variable, isFirst = false) {
    const varHtml = `<i class="roman-txt">${variable}</i>`;

    // 1. Term is ZERO: Return an empty string to skip it
    if (coeff === 0) {
        return "";
    }

    // 2. Handle ±1
    if (Math.abs(coeff) === 1) {
        let sign = '';
        if (coeff === -1) {
            sign = isFirst ? '-' : ' - '; // Using the em dash as in your original code for negative sign
        } else { // coeff === 1
            sign = isFirst ? '' : ' + ';
        }
        // If it's the first term and 1, don't show the sign.
        if (isFirst && coeff === 1) {
            return varHtml;
        }
        return `${sign}${varHtml}`;
    }

    // 3. General case (coeff is not 0, 1, or -1)
    let sign = '';
    let absCoeff = Math.abs(coeff);

    if (coeff > 0) {
        sign = isFirst ? '' : ' + ';
    } else { // coeff < 0
        sign = isFirst ? '-' : ' - ';
    }

    return `${sign}${absCoeff}${varHtml}`;
}

/**
 * Formats a linear equation (ax + by + c = 0) into a clean string, 
 * omitting terms with a coefficient of zero.
 * @param {number} a - Coefficient for x.
 * @param {number} b - Coefficient for y.
 * @param {number} c - The constant term.
 * @returns {string} The formatted equation string.
 */
function formatEquation(a, b, c) {
    let eq = "";

    // 1. X TERM (a*x)
    const xTerm = formatCoeff(a, "x", true);

    // 2. Y TERM (b*y)
    // The y-term is only 'the first term' if the x-term was omitted (a=0).
    const yTerm = formatCoeff(b, "y", xTerm === "");

    // 3. Constant Term (c)
    let cTerm = "";
    if (c !== 0) {
        const isFirst = (xTerm === "" && yTerm === "");
        if (c > 0) {
            cTerm = isFirst ? `${c}` : ` + ${c}`;
        } else { // c < 0
            cTerm = isFirst ? `- ${Math.abs(c)}` : ` - ${Math.abs(c)}`;
        }
    }

    // Combine all parts
    eq = xTerm + yTerm + cTerm;

    // Final check: If the entire equation is just "0 = 0" (a=0, b=0, c=0), 
    // we'll return a simple "0 = 0".
    if (eq === "") {
        return "0 = 0";
    }

    // Add the "= 0" part
    return `${eq} = 0`;
}


function plotLines() {
    clearBoard();
    label1Offset = { x: 0, y: 0 };
    label2Offset = { x: 0, y: 0 };

    // Line 1
    if (b1 !== 0) {
        line1 = board.create('functiongraph',
            [x => (-a1 * x - c1) / b1],
            { strokeColor: 'red', strokeWidth: 2 }
        );

        label1 = board.create('text', [
            () => 0 + label1Offset.x,
            () => ((-a1 * 0 - c1) / b1) + getLabelOffset(a1, b1) + label1Offset.y,
            () => formatEquation(a1, b1, c1)
        ], { fontSize: 18, strokeColor: 'red', useMathJax: true });
    } else if (a1 !== 0) {
        // Vertical line: a1*x + c1 = 0 -> x = -c1/a1
        const xConst1 = -c1 / a1;
        const p11 = board.create('point', [xConst1, -20], { visible: false, fixed: true });
        const p12 = board.create('point', [xConst1, 20], { visible: false, fixed: true });
        line1 = board.create('line', [p11, p12], { strokeColor: 'red', strokeWidth: 2 });

        label1 = board.create('text', [
            () => xConst1 + 0.5 + label1Offset.x,
            () => 0 + getLabelOffset(a1, b1) + label1Offset.y,
            () => formatEquation(a1, b1, c1)
        ], { fontSize: 18, strokeColor: 'red', useMathJax: true });
    } // else (a1==0 and b1==0): no drawable line (either inconsistent or whole plane)

    // Line 2
    if (b2 !== 0) {
        line2 = board.create('functiongraph',
            [x => (-a2 * x - c2) / b2],
            { strokeColor: 'blue', strokeWidth: 2 }
        );

        label2 = board.create('text', [
            () => 0 + label2Offset.x,
            () => ((-a2 * 0 - c2) / b2) + getLabelOffset(a2, b2) + 3 + label2Offset.y,
            () => formatEquation(a2, b2, c2)
        ], { fontSize: 18, strokeColor: 'blue', useMathJax: true });
    } else if (a2 !== 0) {
        // Vertical line: a2*x + c2 = 0 -> x = -c2/a2
        const xConst2 = -c2 / a2;
        const p21 = board.create('point', [xConst2, -20], { visible: false, fixed: true });
        const p22 = board.create('point', [xConst2, 20], { visible: false, fixed: true });
        line2 = board.create('line', [p21, p22], { strokeColor: 'blue', strokeWidth: 2 });

        label2 = board.create('text', [
            () => xConst2 + 0.5 + label2Offset.x,
            () => 3 + getLabelOffset(a2, b2) + label2Offset.y,
            () => formatEquation(a2, b2, c2)
        ], { fontSize: 18, strokeColor: 'blue', useMathJax: true });
    } // else (a2==0 and b2==0): no drawable line

    // Intersection
    if (line1 && line2) {
        intersection = board.create('intersection', [line1, line2], { name: 'P', size: 3, color: 'green' });

        // Avoid overlapping of labels with point P
        const px = () => intersection.X();
        const py = () => intersection.Y();

        // Compute base label positions (without offsets)
        const baseLabel1 = (() => {
            if (b1 !== 0) {
                return { x: 0, y: ((-a1 * 0 - c1) / b1) + getLabelOffset(a1, b1) };
            } else if (a1 !== 0) {
                const xConst1 = -c1 / a1;
                return { x: xConst1 + 0.5, y: 0 + getLabelOffset(a1, b1) };
            }
            return null;
        })();

        const baseLabel2 = (() => {
            if (b2 !== 0) {
                return { x: 0, y: ((-a2 * 0 - c2) / b2) + getLabelOffset(a2, b2) + 3 };
            } else if (a2 !== 0) {
                const xConst2 = -c2 / a2;
                return { x: xConst2 + 0.5, y: 3 + getLabelOffset(a2, b2) };
            }
            return null;
        })();

        const pushAway = (basePos, pushDist = 3.5) => {
            if (!basePos) return { x: 0, y: 0 };
            const dx = basePos.x - px();
            const dy = basePos.y - py();
            const d = Math.hypot(dx, dy);
            if (d < 2.0) {
                // Too close: push along vector from P to label
                const ux = (d === 0 ? 1 : dx / d);
                const uy = (d === 0 ? 1 : dy / d);
                return { x: ux * (pushDist - d), y: uy * (pushDist - d) };
            }
            return { x: 0, y: 0 };
        };

        const off1 = pushAway(baseLabel1);
        const off2 = pushAway(baseLabel2);
        label1Offset = off1;
        label2Offset = off2;
        board.update();
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
    if (eq1Container) {
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

    // Handle special vertical line case (b1 and b2 both zero)
    if (Math.abs(b1) < eps && Math.abs(b2) < eps) {
        // Compare a1/a2 and c1/c2 safely
        if (Math.abs(a1 * c2 - a2 * c1) < eps) {
            return { text: "infinite solutions (coincident vertical lines)" };
        } else {
            return { text: "no solution (parallel vertical lines)" };
        }
    }

    // Handle special vertical line case (b1 and b2 both zero)
    if (Math.abs(b1) < eps && Math.abs(b2) < eps) {
        // Compare a1/a2 and c1/c2 safely
        if (Math.abs(a1 * c2 - a2 * c1) < eps) {
            return { text: "infinite solutions (coincident vertical lines)" };
        } else {
            return { text: "no solution (parallel vertical lines)" };
        }
    }

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
    // Helper to decide displayed equality sign for ratios with possible zero denominators
    const displayEq = (num1, den1, num2, den2, isEqual) => {
        if (den1 === 0 || den2 === 0) {
            // Avoid showing "=" when any denominator is zero (undefined division)
            return "≠";
        }
        return isEqual ? "=" : "≠";
    };

    if (showAnswer) {
        updateRatioPlaceholdersToValues();

        // Update = or ≠ dynamically
        document.getElementById("eqSign1").innerText = displayEq(a1, a2, b1, b2, solutionData.ratioAB);
        document.getElementById("eqSign2").innerText = displayEq(b1, b2, c1, c2, solutionData.ratioBC);

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