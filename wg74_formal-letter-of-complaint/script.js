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
        "body-1-blank",
        "body-2-blank",
        "conclusion-blank",
        "complimentary-close-blank",
        "senders-name-blank" 
    ]
};

const lottieContainer = document.getElementById('lottie-container');

function playCompleteLottie() {
    const container = document.getElementById('completion-lottie');
  
    if (!container) {
      console.warn(`Container completion-lottie not found`);
      return;
    }
  
    const animationPath = `./animation/celebration.json`;
  
    // Clear previous animation
    container.innerHTML = '';
    container.style.display = 'block';
  
    const anim = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: animationPath,
      rendererSettings: {
        hideOnTransparent: false,
        preserveAspectRatio: 'xMidYMid meet'
      }
    });
  
    // Ensure totalFrames is available
    anim.addEventListener('DOMLoaded', () => {
      anim.addEventListener('complete', () => {
        anim.goToAndStop(anim.totalFrames - 1, true);
      });
    });
  }  

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

    // 1. Update SVG Box Appearance
    targetG.querySelectorAll('path').forEach(p => {
        //p.setAttribute('fill', '#f8f9fa');
      //  p.setAttribute('stroke', '#28a745');
        p.setAttribute('stroke-width', '2');
        p.removeAttribute('stroke-dasharray');
        p.setAttribute("pointer-events", "none");
    });

    // 2. Add Text to the Box
    addTextToSvg(targetG, btnElement.innerText || btnElement.textContent);

    // 3. Disable Button
    btnElement.style.opacity = "0.3";
    btnElement.style.pointerEvents = "none";
    btnElement.style.filter = "grayscale(1)";

    // 4. Advance State
    state.currentStepIndex++;
    state.activeLeftId = null;

    if (state.currentStepIndex === state.sequence.length) {
       // showFeedback("Congratulations! You've completed the formal letter structure.");
       lottieContainer.style.display = 'block';
       document.getElementById('learn-example-btn').style.display = 'block';
       playCompleteLottie();
    }
}

/**
 * FUNCTION: Injects text into the center of the SVG group
 */
function addTextToSvg(groupElement, label) {
    // Get the bounding box of the paths to find the center
    const bbox = groupElement.getBBox();
    
    // Create SVG Text element
    const textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
    
    // Set text position (center of the box)
    textNode.setAttribute("x", bbox.x + bbox.width / 2);
    textNode.setAttribute("y", bbox.y + bbox.height / 2);
    
    // Styling the text
    textNode.setAttribute("fill", "#333");
    textNode.setAttribute("font-size", "32px");
    textNode.setAttribute("font-weight", "BOLD");
    textNode.setAttribute("font-family", "Roboto, sans-serif");
    textNode.setAttribute("text-anchor", "middle"); // Horizontal center
    textNode.setAttribute("dominant-baseline", "central"); // Vertical center    
    textNode.setAttribute("pointer-events", "none");
    textNode.textContent = label;
    console.log(label)
    // 2. Reset paths to original state (Remove Blue, Keep Dash)
    const paths = groupElement.querySelectorAll('path');
    paths.forEach(path => {
        // Reset to original grey from your SVG code
        path.setAttribute("stroke", "#707070"); 
        // Reset thickness to original
        path.setAttribute("stroke-width", "1"); 
        // Ensure the dash is visible (if it was removed during highlight)
        path.setAttribute("stroke-dasharray", "5 5");
    });
    
    groupElement.appendChild(textNode);
}

function applyVisualHighlight(el) {
    // Reset all paths to default grey dash
   // document.querySelectorAll('.left-blanks path').forEach(p => p.setAttribute('stroke', '#707070'));
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
    document.getElementById('learn-example-btn').onclick = () => navigateTo('practice-examples');
}

function initGameListeners() {
    document.querySelectorAll('.left-blanks > g').forEach(g => {
        g.addEventListener('click', () => handleBlankSelection(g));
    });

    document.querySelectorAll('.right-option > g').forEach(btn => {
        btn.addEventListener('click', () => handleOptionSelection(btn));
    });
}