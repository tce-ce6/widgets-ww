// --- JSXGraph board in your existing layout ---
const board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-12, 35, 12, -35],
    axis: true,
    showCopyright: false,
    showNavigation: false,
    showZoom: false,
    // attempt to disable pan/zoom interactions
    pan: { enabled: false },
    zoom: { enabled: false, pinch: false },
    // optional: disable default mouse wheel
    mouseDrag: false,
    height: 200,
    width: 200

});

// Grab sliders + bubbles + value spans
const aSlider = document.getElementById('aSlider');
const bSlider = document.getElementById('bSlider');
const cSlider = document.getElementById('cSlider');

const aBubble = document.getElementById('aBubble');
const bBubble = document.getElementById('bBubble');
const cBubble = document.getElementById('cBubble');

const aVal = document.getElementById('aVal');
const bVal = document.getElementById('bVal');
const cVal = document.getElementById('cVal');

const output = document.getElementById('output');
const toggleBtn = document.getElementById('toggleBtn');
let isShown = false;
let msg = `<div style="font-size: 22px;"><span style="color:#228B22;">b</span>² − 4
<span style="color:#ff8800; margin-left: -3px">a</span>
<span style="color:#0099ff; margin-left: -3px">c</span> ≥ 0 ?</div>`;

// Helpers
const getA = () => parseFloat(aSlider.value);
const getB = () => parseFloat(bSlider.value);
const getC = () => parseFloat(cSlider.value);

// Quadratic curve
let curve = board.create('functiongraph', [
    function (x) {
        return getA() * x * x + getB() * x + getC();
    },
    -10, 10
]);

// Update discriminant panel
// function updateOutput() {
//     const a = getA(), b = getB(), c = getC();

//     aBubble.textContent = a;
//     bBubble.textContent = b;
//     cBubble.textContent = c;

//     const D = b * b - 4 * a * c;

//     let msg = `b² − 4ac ≥ 0?<br>${b}² − 4(${a})(${c}) = ${D}`;
//     if (D > 0) {
//         msg += `<br><span style="color:#d60000;">${D} &gt; 0</span><br><b>Two distinct real roots</b>`;
//     } else if (D === 0) {
//         msg += `<br><span style="color:#0a7a0a;">${D} = 0</span><br><b>One real root (repeated)</b>`;
//     } else {
//         msg += `<br><span style="color:#0a3ea0;">${D} &lt; 0</span><br><b>Two Complex roots</b>`;
//     }

//     rightPanel.innerHTML = msg;
// }

/**
 * Generates the HTML string for a quadratic equation in the form y = ax² + bx + c,
 * displaying the numerical values of a, b, and c with dynamic signs and styling.
 *
 * @param {number} a - The coefficient of the x² term.
 * @param {number} b - The coefficient of the x term.
 * @param {number} c - The constant term.
 * @returns {string} The HTML string for the quadratic equation.
 */
function formatQuadraticHTML(a, b, c) {
    // --- Configuration ---
    const varClass = 'class="new_roman"';
    const aColor = '#ff8800'; // Orange for 'a'
    const bColor = '#228B22'; // Green for 'b'
    const cColor = '#0099ff'; // Blue for 'c'

    // Helper function to format a coefficient term (a*variable^power)
    const _formatQuadraticCoeff = (coeff, variable, power, color, isFirstTerm = false) => {
        const colorStyle = `style="color: ${color}; letter-spacing: 0.4px;"`;
        const id = `${variable}_value`; // You can adapt this ID if needed

        // Handle zero coefficient (term is skipped unless it's the only term)
        if (coeff === 0) {
            // Only the 'a' term can lead to a sign issue if it's zero, 
            // but we rely on the next term to provide the first displayable element.
            return '';
        }

        let sign = '';
        let coeff_val = Math.abs(coeff);
        let coeff_html = '';

        if (!isFirstTerm) {
            // For subsequent terms (b*x, c)
            sign = (coeff > 0) ? ' + ' : ' - ';
        } else {
            // For the first term (a*x²)
            sign = (coeff < 0) ? '-' : ''; // Use '—' for negative start
        }

        // Check for ±1 (hide the value span) for x² and x terms
        if (Math.abs(coeff) === 1) {
            coeff_html = `<span ${colorStyle}><span id="${id}" style="display:none;">${coeff}</span></span>`;
        } else {
            coeff_html = `<span ${colorStyle}><span id="${id}">${coeff_val}</span></span>`;
        }

        // Variable part: x² or x
        const variableHTML = `<i ${varClass}>${variable}</i>${power ? power : ''}`;

        return `${sign}${coeff_html}${variableHTML}`;
    };

    // Helper function to format the constant term (c)
    const _formatConstant = (c, color) => {
        if (c === 0) {
            return ''; // Skip if c=0, unless all terms are zero.
        }
        const colorStyle = `style="color: ${color}; letter-spacing: 0.4px;"`;
        const c_display = Math.abs(c);
        const sign = (c > 0) ? ' + ' : ' - ';

        const c_html = `<span ${colorStyle}><span id="c_value">${c_display}</span></span>`;
        return `${sign}${c_html}`;
    };

    // Start of the main HTML structure
    let html = `<span id="dynamic-eqn" style="position: absolute; top: 0; z-index: 1; right: 15px;">`;

    // 1. Y term
    html += `<i ${varClass}>y</i> = `;

    // 2. x² term (a) - MUST be the first term
    html += _formatQuadraticCoeff(a, 'x', '²', aColor, true);

    // 3. x term (b)
    // Note: The 'b' term can only be displayed if 'a' is not the entire equation (e.g. a=0 and b=0)
    // We rely on the sign logic in _formatQuadraticCoeff to correctly use ' + ' or ' - '.
    html += _formatQuadraticCoeff(b, 'x', '', bColor, false);

    // 4. Constant term (c)
    html += _formatConstant(c, cColor);

    // If a=0, b=0, and c=0, the equation would be "y = ". We fix this by adding 0.
    if (a === 0 && b === 0 && c === 0) {
        html += `<span style="color: ${cColor}; letter-spacing: 0.4px;"><span id="c_value">0</span></span>`;
    }

    html += `</span>`; // Close the dynamic-eqn span

    return html;
}

function updateOutput() {
    const a = getA(), b = getB(), c = getC();

    // aBubble.innerHTML = `<span style="color:green;">${a}</span>`;
    // bBubble.innerHTML = `<span style="color:red;">${b}</span>`;
    // cBubble.innerHTML = `<span style="color:blue;">${c}</span>`;

    const D = b * b - 4 * a * c;


    // equation = `<span><i class="new_roman">y</i> = 
    // <span style="color:#ff8800;">${a}</span><i class="new_roman">x</i>² +
    //  <span style="color:#228B22;">${b}</span><i class="new_roman">x</i> + 
    //  <span style="color:#0099ff;">${c}</span>`

    msg = `<span style="font-size: 22px;"><span style="color:#228B22;">b</span>² − 4
        <span style="color:#ff8800; margin-left: -3px">a</span>
        <span style="color:#0099ff; margin-left: -3px">c</span> ≥ 0 ?<br>
        <span style="color:#228B22;">${b}</span>² − 4(
        <span style="color:#ff8800; margin-left: -3px">${a}</span>)(
        <span style="color:#0099ff; margin-left: -3px">${c}</span>) ≥ 0 ?</span>`;

    if (D > 0) {
        msg += `<br><span style="color:#d60000;font-size: 22px;">${D} &gt; 0</span><br><b style="font-size: 20px">Two distinct real roots</b>`;
    } else if (D === 0) {
        msg += `<br><span style="color:#0a7a0a; font-size: 22px;">${D} = 0</span><br><b style="font-size: 20px">One real root (repeated)</b>`;
    } else {
        msg += `<br><span style="color:#0a3ea0; font-size: 22px;">${D} &lt; 0</span><br><b style="font-size: 20px">Two complex roots</b>`;
    }

    rightPanel.innerHTML = msg;
}


// Toggle show/hide
toggleBtn.addEventListener('click', () => {
    isShown = !isShown;
    if (isShown) {
        updateOutput();
        rightPanel.style.display = 'block';
        toggleBtn.textContent = 'Hide answer';
    } else {
        // rightPanel.innerHTML = msg;
        // toggleBtn.textContent = 'Show';

        rightPanel.innerHTML = `<span style="font-size: 22px;"><span style="color:#228B22;">b</span>² − 4
        <span style="color:#ff8800; margin-left: -3px">a</span>
        <span style="color:#0099ff; margin-left: -3px">c</span> ≥ 0 ?</span>`;
        toggleBtn.textContent = 'Show answer';
        isShown = false; // reset flag
    }
});

// Re-draw graph + auto-hide output + move bubbles
function updateGraphFor(slider, bubble) {
    // Update curve
    curve.Y = function (x) {
        return getA() * x * x + getB() * x + getC();
    };
    board.update();

    // Auto-hide the explanation
    rightPanel.innerHTML = `<span style="font-size: 22px;"><span style="color:#228B22;">b</span>² − 4
        <span style="color:#ff8800; margin-left: -3px">a</span>
        <span style="color:#0099ff; margin-left: -3px">c</span> ≥ 0 ?</span>`;
    toggleBtn.textContent = 'Show answer';
    isShown = false; // reset flag

    // Update right-panel values
    aBubble.textContent = getA();
    bBubble.textContent = getB();
    cBubble.textContent = getC();

    // Bubble position above handle
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const percent = (parseFloat(slider.value) - min) / (max - min);

    // account for slider width
    const sliderWidth = slider.offsetWidth;
    bubble.style.left = (percent * sliderWidth + 10) + 'px';
    bubble.textContent = slider.value;

    document.getElementById('dynamic-eqn').innerHTML = formatQuadraticHTML(getA(), getB(), getC());
}

// Attach live listeners
['input', 'change'].forEach(evt => {
    aSlider.addEventListener(evt, () => updateGraphFor(aSlider, aBubble));
    bSlider.addEventListener(evt, () => updateGraphFor(bSlider, bBubble));
    cSlider.addEventListener(evt, () => updateGraphFor(cSlider, cBubble));
});

// Initial render
updateGraphFor(aSlider, aBubble);
updateGraphFor(bSlider, bBubble);
updateGraphFor(cSlider, cBubble);

// (Optional) keep your other buttons functional later if needed:
// document.getElementById('reset-btn')...
// document.getElementById('make-triangle-btn')...
