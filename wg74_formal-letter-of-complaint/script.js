/**
 * APP STATE
 * Centralized tracking of the user's progress
 */
const state = {
    currentStepIndex: 0,
    activeLeftId: null,
    // Sequence based on your SVG IDs
    sequence: [
        "senders-address-blank",
        "date-blank",
        "recievers-address-blank",
        "salutation-blank",
        "introduction-blank",
        "body-2-blank",
        "body-1-blank",
        "conclusion-blank",
        "complimentary-close-blank",
        "senders-name-blank" 
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initGameListeners();
});

/** * FUNCTION: Navigation Management
 * Handles page switching and button visibility
 */
function navigateTo(pageId) {
    const pages = ['home-page', 'learn-page', 'practice-page', 'practice-examples'];
    const homeBtn = document.getElementById('home-btn');

    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === pageId) ? 'block' : 'none';
    });

    homeBtn.style.display = (pageId === 'home-page') ? 'none' : 'block';
}

/** * FUNCTION: Left Panel Interaction
 * Validates if the user is clicking the correct box in the sequence
 */
function handleBlankSelection(gElement) {
    const expectedId = state.sequence[state.currentStepIndex];

    if (gElement.id !== expectedId) {
        showFeedback(`Sequence Error: Please select the box for "${formatIdText(expectedId)}"`);
        return;
    }

    state.activeLeftId = gElement.id;
    applyVisualHighlight(gElement);
}

/** * FUNCTION: Right Panel Interaction
 * Checks if the selected option matches the active blank
 */
function handleOptionSelection(btnElement) {
    if (!state.activeLeftId) {
        showFeedback("Select a section on the letter first!");
        return;
    }

    // Matching logic: IDs or normalized strings
    const isMatch = validateMatch(state.activeLeftId, btnElement.id);

    if (isMatch) {
        processCorrectMatch(btnElement);
    } else {
        showFeedback("That component doesn't belong in this section.");
    }
}

/** * SUPPORT FUNCTIONS: Helpers for UI & Logic
 */
function validateMatch(leftId, rightId) {
    const normLeft = leftId.toLowerCase().replace('-blank', '');
    const normRight = rightId.toLowerCase().replace(/\s/g, '-');
    console.log(normLeft, normRight);
    return leftId === rightId || normLeft.includes(normRight);
}

function processCorrectMatch(btnElement) {
    const targetG = document.getElementById(state.activeLeftId);
    
    // 1. Update SVG Appearance
    targetG.querySelectorAll('path').forEach(p => {
        p.setAttribute('fill', '#f0fff0');
        p.setAttribute('stroke', '#28a745');
        p.removeAttribute('stroke-dasharray');
    });

    // 2. Disable Button
    btnElement.style.opacity = "0.3";
    btnElement.style.pointerEvents = "none";
    btnElement.style.filter = "grayscale(1)";

    // 3. Advance State
    state.currentStepIndex++;
    state.activeLeftId = null;

    if (state.currentStepIndex === state.sequence.length) {
        showFeedback("Congratulations! You've completed the formal letter structure.");
    }
}

function applyVisualHighlight(el) {
    // Reset all paths to default grey dash
    document.querySelectorAll('.left-blanks path').forEach(p => p.setAttribute('stroke', '#707070'));
    // Highlight selected one blue
    el.querySelectorAll('path').forEach(p => p.setAttribute('stroke', '#007bff'));
}

function formatIdText(id) {
    return id.replace('-blank', '').replace(/-/g, ' ').toUpperCase();
}

function showFeedback(msg) {
    alert(msg); // Replace with a custom UI popup if preferred
}

/** * INITIALIZERS: Event Attachments
 */
function initNavigation() {
    document.getElementById('learn-btn').onclick = () => navigateTo('learn-page');
    document.getElementById('example-btn').onclick = () => navigateTo('practice-examples');
    document.getElementById('home-btn').onclick = () => navigateTo('home-page');
    document.getElementById('smartPhone').onclick = () => navigateTo('practice-page');
}

function initGameListeners() {
    document.querySelectorAll('.left-blanks > g').forEach(g => {
        g.addEventListener('click', () => handleBlankSelection(g));
    });

    document.querySelectorAll('.right-option').forEach(btn => {
        btn.addEventListener('click', () => handleOptionSelection(btn));
    });
}