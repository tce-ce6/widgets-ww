// --- JSXGraph board in your existing layout ---
const board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [-12, 35, 12, -35],
    axis: true,
    showCopyright: false,
    showNavigation: false

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

function updateOutput() {
    const a = getA(), b = getB(), c = getC();

    // aBubble.innerHTML = `<span style="color:green;">${a}</span>`;
    // bBubble.innerHTML = `<span style="color:red;">${b}</span>`;
    // cBubble.innerHTML = `<span style="color:blue;">${c}</span>`;

    const D = b * b - 4 * a * c;

    msg = `<span style="font-size: 22px;"><span style="color:#228B22;">b</span>² − 4
        <span style="color:#ff8800; margin-left: -3px">a</span>
        <span style="color:#0099ff; margin-left: -3px">c</span> ≥ 0 ?<br>
        <span style="color:#228B22;">${b}</span>² − 4(
        <span style="color:#ff8800; margin-left: -3px">${a}</span>)(
        <span style="color:#0099ff; margin-left: -3px">${c}</span>) ≥ 0 ?</span>`;

    if (D > 0) {
        msg += `<br><span style="color:#d60000;font-size: 25px;">${D} &gt; 0</span><br><b>Two distinct real roots</b>`;
    } else if (D === 0) {
        msg += `<br><span style="color:#0a7a0a; font-size: 25px;">${D} = 0</span><br><b>One real root (repeated)</b>`;
    } else {
        msg += `<br><span style="color:#0a3ea0; font-size: 25px;">${D} &lt; 0</span><br><b>Two Complex roots</b>`;
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
