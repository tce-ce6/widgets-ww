// State management
let state = {
    firstTermCoefficient: 5,
    firstTermConstant: 5,
    secondTermCoefficient: 3,
    secondTermConstant: 3,
    showHints: false,
    isFullscreen: false
};

// DOM Elements
const elements = {
    firstTermCoefficient: document.getElementById('firstTermCoefficient'),
    firstTermConstant: document.getElementById('firstTermConstant'),
    secondTermCoefficient: document.getElementById('secondTermCoefficient'),
    secondTermConstant: document.getElementById('secondTermConstant'),
    firstTermCoefficientValue: document.getElementById('firstTermCoefficientValue'),
    firstTermConstantValue: document.getElementById('firstTermConstantValue'),
    secondTermCoefficientValue: document.getElementById('secondTermCoefficientValue'),
    secondTermConstantValue: document.getElementById('secondTermConstantValue'),
    toggleHints: document.getElementById('toggleHints'),
    fullscreenToggle: document.getElementById('fullscreenToggle'),
    container: document.querySelector('.container'),
    totalProduct: document.getElementById('totalProduct'),
    topLeft: document.getElementById('topLeft'),
    topRight: document.getElementById('topRight'),
    bottomLeft: document.getElementById('bottomLeft'),
    bottomRight: document.getElementById('bottomRight'),
    showSteps: document.getElementById('showSteps'),
    stepsContainer: document.getElementById('stepsContainer'),
    step1Explanation: document.getElementById('step1Explanation'),
    step2Areas: document.getElementById('step2Areas'),
    step3Explanation: document.getElementById('step3Explanation'),
    step4Final: document.getElementById('step4Final')
};
let reset = document.getElementById('resetButton');
reset.addEventListener('click', () => {
    // Reset state to default values
    state = {
        firstTermCoefficient: 5,
        firstTermConstant: 5,
        secondTermCoefficient: 3,
        secondTermConstant: 3,
        showHints: false,
        isFullscreen: false
    };

    // Reset slider positions
    elements.firstTermCoefficient.value = state.firstTermCoefficient;
    elements.firstTermConstant.value = state.firstTermConstant;
    elements.secondTermCoefficient.value = state.secondTermCoefficient;
    elements.secondTermConstant.value = state.secondTermConstant;

    // Reset UI components
    elements.toggleHints.textContent = 'Show hints';
    elements.container?.classList.remove('fullscreen');
    elements.stepsContainer.classList.add('hidden');
    elements.showSteps.textContent = 'Show Steps';

    // Update displays (this will recalculate and redraw everything)
    updateDisplayValues();
    updateAreas();
});

// Update display values
function updateDisplayValues() {
    elements.firstTermCoefficientValue.textContent = state.firstTermCoefficient;
    elements.firstTermConstantValue.textContent = state.firstTermConstant;
    elements.secondTermCoefficientValue.textContent = state.secondTermCoefficient;
    elements.secondTermConstantValue.textContent = state.secondTermConstant;
}

// Calculate areas and update display
function updateAreas() {
    // Calculate products for each area
    const topLeftArea = state.firstTermCoefficient * state.secondTermCoefficient;
    const topRightArea = state.firstTermConstant * state.secondTermCoefficient;
    const bottomLeftArea = state.firstTermCoefficient * state.secondTermConstant;
    const bottomRightArea = state.firstTermConstant * state.secondTermConstant;

    // Calculate middle term
    const middleTerm = topRightArea + bottomLeftArea;

    // Update grid cells
    elements.topLeft.querySelector('.term').innerHTML = `${topLeftArea}x<sup>2</sup>`;
    elements.topRight.querySelector('.term').textContent = `${topRightArea}x`;
    elements.bottomLeft.querySelector('.term').textContent = `${bottomLeftArea}x`;
    elements.bottomRight.querySelector('.term').textContent = bottomRightArea;

    // Update hints
    elements.topLeft.querySelector('.hint').innerHTML = state.showHints ? 
        `(${state.firstTermCoefficient}x) × (${state.secondTermCoefficient}x)` : '';
    elements.topRight.querySelector('.hint').innerHTML = state.showHints ? 
        `${state.firstTermConstant} × (${state.secondTermCoefficient}x)` : '';
    elements.bottomLeft.querySelector('.hint').innerHTML = state.showHints ? 
        `(${state.firstTermCoefficient}x) × ${state.secondTermConstant}` : '';
    elements.bottomRight.querySelector('.hint').innerHTML = state.showHints ? 
        `${state.firstTermConstant} × ${state.secondTermConstant}` : '';

    // Format terms for total product
    const formattedTerms = {
        first: topLeftArea === 1 ? 'x²' : `${topLeftArea}x²`,
        middle: middleTerm === 0 ? '' : middleTerm === 1 ? ' + x' : ` + ${middleTerm}x`,
        last: bottomRightArea === 0 ? '' : ` + ${bottomRightArea}`
    };

    // Update total product display
    const productExpression = `(${state.firstTermCoefficient}x + ${state.firstTermConstant})(${state.secondTermCoefficient}x + ${state.secondTermConstant}) = ${formattedTerms.first}${formattedTerms.middle}${formattedTerms.last}`;
    elements.totalProduct.textContent = productExpression;

    // Update steps content
    elements.step1Explanation.innerHTML = `
        First binomial: (${state.firstTermCoefficient}x + ${state.firstTermConstant})<br>
        Second binomial: (${state.secondTermCoefficient}x + ${state.secondTermConstant})<br>
        The colored areas in the grid show how these terms multiply together.
    `;

    elements.step2Areas.innerHTML = `
        <div class="area-calculation">
            <div class="area-color-box pink-box"></div>
            <span>Pink area (top-left): (${state.firstTermCoefficient}x)(${state.secondTermCoefficient}x) = ${topLeftArea}x²</span>
        </div>
        <div class="area-calculation">
            <div class="area-color-box indigo-box"></div>
            <span>Indigo area (top-right): (${state.firstTermConstant})(${state.secondTermCoefficient}x) = ${topRightArea}x</span>
        </div>
        <div class="area-calculation">
            <div class="area-color-box green-box"></div>
            <span>Green area (bottom-left): (${state.firstTermCoefficient}x)(${state.secondTermConstant}) = ${bottomLeftArea}x</span>
        </div>
        <div class="area-calculation">
            <div class="area-color-box yellow-box"></div>
            <span>Yellow area (bottom-right): (${state.firstTermConstant})(${state.secondTermConstant}) = ${bottomRightArea}</span>
        </div>
    `;

    elements.step3Explanation.innerHTML = `
        Like terms:<br>
        • x² terms: ${topLeftArea}x²<br>
        • x terms: ${topRightArea}x + ${bottomLeftArea}x = ${middleTerm}x<br>
        • constant terms: ${bottomRightArea}
    `;

    elements.step4Final.textContent = productExpression;

    // Update grid layout based on coefficients
    const totalWidth = state.firstTermCoefficient + state.firstTermConstant;
    const totalHeight = state.secondTermCoefficient + state.secondTermConstant;

    const leftColumnWidth = (state.firstTermCoefficient / totalWidth) * 100;
    const rightColumnWidth = (state.firstTermConstant / totalWidth) * 100;
    const topRowHeight = (state.secondTermCoefficient / totalHeight) * 100;
    const bottomRowHeight = (state.secondTermConstant / totalHeight) * 100;

    // Apply dynamic sizing to grid columns
    const leftColumn = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');
    leftColumn.style.width = `${leftColumnWidth}%`;
    rightColumn.style.width = `${rightColumnWidth}%`;

    // Apply dynamic sizing to grid cells
    elements.topLeft.style.height = `${topRowHeight}%`;
    elements.topRight.style.height = `${topRowHeight}%`;
    elements.bottomLeft.style.height = `${bottomRowHeight}%`;
    elements.bottomRight.style.height = `${bottomRowHeight}%`;
}

// Event Listeners
elements.firstTermCoefficient.addEventListener('input', (e) => {
    state.firstTermCoefficient = parseInt(e.target.value);
    updateDisplayValues();
    updateAreas();
});

elements.firstTermConstant.addEventListener('input', (e) => {
    state.firstTermConstant = parseInt(e.target.value);
    updateDisplayValues();
    updateAreas();
});

elements.secondTermCoefficient.addEventListener('input', (e) => {
    state.secondTermCoefficient = parseInt(e.target.value);
    updateDisplayValues();
    updateAreas();
});

elements.secondTermConstant.addEventListener('input', (e) => {
    state.secondTermConstant = parseInt(e.target.value);
    updateDisplayValues();
    updateAreas();
});

elements.toggleHints.addEventListener('click', () => {
    state.showHints = !state.showHints;
    elements.toggleHints.textContent = state.showHints ? 'Hide hints' : 'Show hints';
    updateAreas();
});

elements.showSteps.addEventListener('click', () => {
    const isHidden = elements.stepsContainer.classList.contains('hidden');
    elements.stepsContainer.classList.toggle('hidden');
    elements.showSteps.textContent = isHidden ? 'Hide Steps' : 'Show Steps';
});

elements.fullscreenToggle.addEventListener('click', () => {
    state.isFullscreen = !state.isFullscreen;
    elements.container.classList.toggle('fullscreen');
});

// Initialize
updateDisplayValues();
updateAreas();
//reset();