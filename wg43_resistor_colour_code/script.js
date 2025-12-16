document.addEventListener("DOMContentLoaded", () => {

  // --- UPDATED DATA STRUCTURE with numerical values for calculation ---
  const data = {
    "first_digit": [
      { "id": "fd-1", "x": 1127, "y": 400, "fill": "#000000", "value": 0, "band_group": "fd" },
      { "id": "fd-2", "x": 1127, "y": 441, "fill": "#CC3C00", "value": 1, "band_group": "fd" },
      { "id": "fd-3", "x": 1127, "y": 482, "fill": "#F80000", "value": 2, "band_group": "fd" },
      { "id": "fd-4", "x": 1127, "y": 523, "fill": "#FF8800", "value": 3, "band_group": "fd" },
      { "id": "fd-5", "x": 1127, "y": 564, "fill": "#FFFF00", "value": 4, "band_group": "fd" },
      { "id": "fd-6", "x": 1127, "y": 605, "fill": "#00E617", "value": 5, "band_group": "fd" },
      { "id": "fd-7", "x": 1127, "y": 646, "fill": "#0066FF", "value": 6, "band_group": "fd" },
      { "id": "fd-8", "x": 1127, "y": 687, "fill": "#9100FF", "value": 7, "band_group": "fd" },
      { "id": "fd-9", "x": 1127, "y": 728, "fill": "#D2D2D2", "value": 8, "band_group": "fd" },
      { "id": "fd-10", "x": 1127, "y": 769, "fill": "#FFFFFF", "value": 9, "band_group": "fd" }
    ],

    "second_digit": [
      { "id": "sd-1", "x": 1297, "y": 400, "fill": "#000000", "value": 0, "band_group": "sd" },
      { "id": "sd-2", "x": 1297, "y": 441, "fill": "#CC3C00", "value": 1, "band_group": "sd" },
      { "id": "sd-3", "x": 1297, "y": 482, "fill": "#F80000", "value": 2, "band_group": "sd" },
      { "id": "sd-4", "x": 1297, "y": 523, "fill": "#FF8800", "value": 3, "band_group": "sd" },
      { "id": "sd-5", "x": 1297, "y": 564, "fill": "#FFFF00", "value": 4, "band_group": "sd" },
      { "id": "sd-6", "x": 1297, "y": 605, "fill": "#00E617", "value": 5, "band_group": "sd" },
      { "id": "sd-7", "x": 1297, "y": 646, "fill": "#0066FF", "value": 6, "band_group": "sd" },
      { "id": "sd-8", "x": 1297, "y": 687, "fill": "#9100FF", "value": 7, "band_group": "sd" },
      { "id": "sd-9", "x": 1297, "y": 728, "fill": "#D2D2D2", "value": 8, "band_group": "sd" },
      { "id": "sd-10", "x": 1297, "y": 769, "fill": "#FFFFFF", "value": 9, "band_group": "sd" }
    ],

    "multiplier": [
      // Value is the exponent (power of 10)
      { "id": "mul-1", "x": 1467, "y": 400, "fill": "#000000", "value": 0, "band_group": "mul" },
      { "id": "mul-2", "x": 1467, "y": 441, "fill": "#CC3C00", "value": 1, "band_group": "mul" },
      { "id": "mul-3", "x": 1467, "y": 482, "fill": "#F80000", "value": 2, "band_group": "mul" },
      { "id": "mul-4", "x": 1467, "y": 523, "fill": "#FF8800", "value": 3, "band_group": "mul" }, // x 10³ (1k)
      { "id": "mul-5", "x": 1467, "y": 564, "fill": "#FFFF00", "value": 4, "band_group": "mul" },
      { "id": "mul-6", "x": 1467, "y": 605, "fill": "#00E617", "value": 5, "band_group": "mul" },
      { "id": "mul-7", "x": 1467, "y": 646, "fill": "#0066FF", "value": 6, "band_group": "mul" },
      { "id": "mul-8", "x": 1467, "y": 687, "fill": "#9100FF", "value": 7, "band_group": "mul" },
      { "id": "mul-9", "x": 1467, "y": 728, "fill": "#D2D2D2", "value": 8, "band_group": "mul" },
      { "id": "mul-10", "x": 1467, "y": 769, "fill": "#FFFFFF", "value": 9, "band_group": "mul" },
      { "id": "mul-11", "x": 1467, "y": 810, "fill": "url(#paint2_linear_5135_217)", "value": -1, "band_group": "mul" }, // Gold: x 10⁻¹
      { "id": "mul-12", "x": 1467, "y": 851, "fill": "url(#paint3_linear_5135_217)", "value": -2, "band_group": "mul" }  // Silver: x 10⁻²
    ],

    "tolerance": [
      // Value is the decimal tolerance (e.g., 0.05 for ±5%)
      { "id": "tol-1", "x": 1638, "y": 400, "fill": "url(#paint2_linear_5135_217)", "value": 0.05, "display": "±5%", "band_group": "tol" },
      { "id": "tol-2", "x": 1638, "y": 441, "fill": "url(#paint3_linear_5135_217)", "value": 0.10, "display": "±10%", "band_group": "tol" },
      { "id": "tol-3", "x": 1638, "y": 482, "fill": "#FDE4C6", "value": 0.20, "display": "±20%", "band_group": "tol" }
    ]
  };

  const container = document.getElementById("color-code-container");
  if (!container) return;

  // --- Global State to track selected values ---
  const currentSelections = {
    fd: { value: null, display: null, fill: null },
    sd: { value: null, display: null, fill: null },
    mul: { value: null, display: null, fill: null },
    tol: { value: null, display: null, fill: null }
  };
  
  // Array defining the required selection order
  const selectionOrder = ["fd", "sd", "mul", "tol"];
  
  // --- Simulation State Variable ---
  let simulationState = 'selecting'; // 'selecting' or 'submitted'

  // --- DOM Element References (Assuming these IDs are in your SVG/HTML) ---
  const resistanceValueRawEl = document.getElementById('resistance-value-raw'); 
  const resistanceValueFormattedEl = document.getElementById('resistance-value-formatted');
  const resistanceRangeEl = document.getElementById('resistance-range');
  
  const resistorBand1El = document.getElementById('resistor-band-1');
  const resistorBand2El = document.getElementById('resistor-band-2');
  const resistorBandMulEl = document.getElementById('resistor-band-mul');
  const resistorBandTolEl = document.getElementById('resistor-band-tol');
  const rangeValueTextEl = document.getElementById('range-value-text');
  
  // --- NEW DOM Element References for Buttons and Text Containers ---
  const submitButtonEl = document.getElementById('submit-button');
  const backButtonEl = document.getElementById('back-button');
  const resetButtonEl = document.getElementById('reset-button');
  const leftTextContainerEl = document.getElementById('left-text-container');
  const rightTextContainerEl = document.getElementById('right-text-container');


  const firstBandColor = document.getElementById('first-band-color');
  const secondBandColor = document.getElementById('second-band-color');
  const multiplierBandColor = document.getElementById('third-band-color');
  const toleranceBandColor = document.getElementById('fourth-band-color');
  
  // --- NEW: References for the specific display text elements ---
  const fdValEl = document.getElementById('first-digit-val');
  const sdValEl = document.getElementById('second-digit-val');
  const mulValEl = document.getElementById('multiplier-val');
  const tolValEl = document.getElementById('tolerance-val');

  // --- LOTTIE ANIMATION CONSTANTS AND CONTAINERS ---
  const LOTTIE_ASSETS = {
      "fd": 'assets/animation/first_colourband_reaction.json',
      "sd": 'assets/animation/second_colourband_reaction.json',
      "mul": 'assets/animation/third_colourband_reaction.json',
      "tol": 'assets/animation/forth_colourband_reaction.json'
  };

  // Assuming you have dedicated containers for each animation near the selection bands
  // IMPORTANT: You must ensure these IDs exist in your HTML/SVG structure.
  const lottieContainers = {
      "fd": document.getElementById('lottie-fd-container'),
      "sd": document.getElementById('lottie-sd-container'),
      "mul": document.getElementById('lottie-mul-container'),
      "tol": document.getElementById('lottie-tol-container')
  };
  
  // Storage for Lottie animation instances
  const lottieInstances = {};

  /**
   * Plays a Lottie animation once in the specified container.
   * Clears the container before playing to ensure only one animation is loaded at a time.
   * @param {string} bandGroup - The band identifier (fd, sd, mul, tol).
   */
  const playLottieAnimation = (bandGroup) => {
      const containerEl = lottieContainers[bandGroup];
      const animationPath = LOTTIE_ASSETS[bandGroup];

      if (!containerEl || !animationPath || typeof lottie === 'undefined') {
          console.warn(`Lottie container or path missing for ${bandGroup}, or lottie.js is not loaded.`);
          return;
      }
      
      // Clear previous content/instance in the container
      containerEl.innerHTML = '';
      if (lottieInstances[bandGroup]) {
          lottieInstances[bandGroup].destroy();
          delete lottieInstances[bandGroup];
      }

      // Load and play the animation once (loop: false)
      const anim = lottie.loadAnimation({
          container: containerEl,
          renderer: 'svg', // Use svg renderer for compatibility
          loop: false,     // Play once
          autoplay: true,
          path: animationPath
      });

      // Store the instance
      lottieInstances[bandGroup] = anim;
      
      // Optional: Hide the container after the animation finishes
      anim.addEventListener('complete', () => {
          // You might want to hide the container or destroy the instance here
          // For simplicity, we just let it stop, but destroy it if the band is re-selected/reset.
          // In a real scenario, you might want to fade the container out.
      });
  };

  // Helper function to format a number into the best engineering unit (k, M, G)
  const formatResistance = (value) => {
    if (value === null || isNaN(value)) return '...';
    
    // Use scientific notation for powers of 10 for display
    const absValue = Math.abs(value);
    
    if (absValue >= 1e9) return `${(value / 1e9).toFixed(1)} GΩ`;
    if (absValue >= 1e6) return `${(value / 1e6).toFixed(1)} MΩ`;
    if (absValue >= 1e3) return `${(value / 1e3).toFixed(1)} kΩ`;
    
    // For values less than 1kΩ, use appropriate precision.
    if (absValue >= 1) return `${value.toFixed(0)} Ω`;
    
    // For sub-ohm values
    return `${value.toFixed(2)} Ω`;
  };
  
  // Helper to create or update an SVG <text> element within a container
  const updateSVGText = (container, id, text, x, y, className) => {
      if (container) {
          container.textContent = text;
      }
  };
  
  // Helper to remove all children from an SVG container
  const clearSVGContainer = (container) => {
      if (container) {
          container.textContent = '';
      }
  };

  // Helper to get the superscript character for an exponent
  const getExponentChar = (exp) => {
      if (exp === null) return '';
      // --- FIX: Use specific Unicode code points for 1, 2, 3 for better compatibility ---
      switch (exp) {
          case 1:
              return '¹'; // Unicode 00B9
          case 2:
              return '²'; // Unicode 00B2
          case 3:
              return '³'; // Unicode 00B3
          case 0:
              return '⁰'; // Unicode 2070 (8304)
      }
      console.log('Getting exponent char for:', exp);
      // Unicode superscripts block (starts at 8304 for 0, 8308 for 4)
      if (exp >= 4 && exp <= 9) {
          // 8304 is '⁰'. 8308 is '⁴' (8304 + 4)
          return String.fromCharCode(8304 + exp);
      }
  
      // For negative exponents: ⁻¹ ⁻²
      if (exp < 0) {
        switch (exp) {
          case -1:
              return '⁻¹'; // Unicode 00B9
          case -2:
              return '⁻²';
            }
          // Minus sign is U+207B (8315)
          const minus = String.fromCharCode(8315);
          const absExp = Math.abs(exp);
          
          // Digits are sequential starting from U+2070 (8304)
          if (absExp >= 1 && absExp <= 9) {
              return minus + String.fromCharCode(8304 + absExp);
          }
      }
      
      // Fallback for other large/unsupported exponents
      return `^${exp}`; 
  };
  
  // Function to control the state of all buttons
  const updateButtonStates = () => {
      const fd = currentSelections.fd.value;
      const sd = currentSelections.sd.value;
      const mul = currentSelections.mul.value;
      const tol = currentSelections.tol.value;
      
      const allSelected = fd !== null && sd !== null && mul !== null && tol !== null;
      const firstSelected = fd !== null;
      
      // Submit Button: Enabled only if all 4 bands are selected AND simulation is in 'selecting' state
      submitButtonEl.disabled = !allSelected || simulationState !== 'selecting';
      
      // Back Button: Enabled if the first band is selected AND simulation is in 'selecting' state
      backButtonEl.disabled = !firstSelected || simulationState !== 'selecting';

      // Reset Button: Enabled only after submission
      resetButtonEl.disabled = simulationState !== 'submitted';
  };


  const updateDisplay = () => {
    const fd = currentSelections.fd.value;
    const sd = currentSelections.sd.value;
    const mulExp = currentSelections.mul.value;
    const tol = currentSelections.tol.value;
    const tolDisplay = currentSelections.tol.display;
    
    // --- 1. Update Fixed Color Code Text Elements ---
    
    if (fdValEl) fdValEl.textContent = fd !== null ? String(fd) : '';
    if (sdValEl) sdValEl.textContent = sd !== null ? String(sd) : '';
    
    if (mulValEl) {
        if (mulExp !== null) {
            const exponentChar = getExponentChar(mulExp);
            mulValEl.textContent = `× 10${exponentChar}`;
        } else {
            mulValEl.textContent = '';
        }
    }
    
    if (tolValEl) tolValEl.textContent = tolDisplay !== null ? tolDisplay : '';


    // --- 2. Resistor Visual Update ---
    if (resistorBand1El) resistorBand1El.setAttribute('fill', currentSelections.fd.fill || '#CCC');
    if (resistorBand2El) resistorBand2El.setAttribute('fill', currentSelections.sd.fill || '#CCC');
    if (resistorBandMulEl) resistorBandMulEl.setAttribute('fill', currentSelections.mul.fill || '#CCC');
    if (resistorBandTolEl) resistorBandTolEl.setAttribute('fill', currentSelections.tol.fill || '#CCC');

    if(firstBandColor) firstBandColor.setAttribute('fill', currentSelections.fd.fill || '#CCC');
    if(secondBandColor) secondBandColor.setAttribute('fill', currentSelections.sd.fill || '#CCC');
    if(multiplierBandColor){
      if(currentSelections.mul.fill === 'url(#paint3_linear_5135_217)'){
       
        multiplierBandColor.setAttribute('fill', 'url(#paint0_linear_36_531)');
      }else{

        multiplierBandColor.setAttribute('fill', currentSelections.mul.fill || '#CCC');
      }
    }  
    if(toleranceBandColor){
       toleranceBandColor.setAttribute('fill', currentSelections.tol.fill || '#CCC');
    }

    
    // --- 3. Update Left-Side Incremental Text (Composite Display) ---
    let rawValue = '';
    
    if (fd !== null) {
      rawValue = `${fd}`;
      if (sd !== null) {
        rawValue = `${fd}${sd}`;
        if (mulExp !== null) {
          const exponentChar = getExponentChar(mulExp);
          rawValue = `${fd}${sd} × 10${exponentChar} Ω`;
          if (tolDisplay !== null) {
            // Tol.display is already formatted (e.g., "±5%")
            rawValue = `${fd}${sd} × 10${exponentChar} Ω ${tolDisplay}`;
          }
        }
      }
    }
    
    // Update the incremental display text
    updateSVGText(resistanceValueRawEl, 'left-display-text', rawValue, 140, 42, 'raw-resistance-text');


    // --- 4. Right-Side Formatted Text (Only visible AFTER submit) ---
    // Clear right side display if not submitted
    if (simulationState !== 'submitted') {
        clearSVGContainer(resistanceValueFormattedEl);
        clearSVGContainer(rangeValueTextEl);
    }
    
    if (simulationState === 'submitted') {
        // Calculations from original logic
        const twoDigits = (fd * 10) + sd;
        const nominalResistance = twoDigits * Math.pow(10, mulExp);
        const toleranceAmount = nominalResistance * tol;
        const minResistance = nominalResistance - toleranceAmount;
        const maxResistance = nominalResistance + toleranceAmount;
        
        // Formatted Value + Tolerance (Right Side Top)
        const formattedR = formatResistance(nominalResistance).trim();
        const formattedValue = `${formattedR} ${tolDisplay}`;

        updateSVGText(resistanceValueFormattedEl, 'right-display-formatted', formattedValue, 140, 42, 'formatted-resistance-text-top');
        
        // Range (Right Side Bottom)
        const rangeText = `${formatResistance(minResistance)} to ${formatResistance(maxResistance)}`;

        updateSVGText(rangeValueTextEl, 'right-display-range', rangeText, 140, 65, 'formatted-resistance-text-bottom');
    }
    
    // --- 5. Update Button States ---
    updateButtonStates();
  };

  
  // --- Original SVG/Highlight Logic ---

  const HIGHLIGHT_PATH = `
    <path 
      d="M158 -2 H-2 V45.25 H158 V-2 Z" 
      stroke="#EEFF00" 
      stroke-width="12" 
      fill="none" 
      data-highlight="true"
    />
  `;
  const HIGHLIGHT_SVG_WIDTH = 160;
  const HIGHLIGHT_SVG_HEIGHT = 43;
  // This needs to be stored globally to allow back/reset to remove highlights
  const selectedHighlights = { "fd": null, "sd": null, "mul": null, "tol": null };


  const createSVG = ({ id, x, y, fill, value, band_group, display }) => {
    // ... (Retained original createSVG logic) ...
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <svg
        width="156"
        height="44"
        x="${x}"
        y="${y}"
        viewBox="0 0 156 44"
        xmlns="http://www.w3.org/2000/svg"
        id="${id}"
        data-id="${id}"
        data-value="${value}"
        data-band-group="${band_group}"
        data-fill="${fill}"
        data-display="${display || value}"
      >
        <path d="M156 0H0V43.25H156V0Z" id="filler" fill="${fill}" />
        <path d="M155 1H1V42.25H155V1Z" stroke="white" stroke-width="2" />
      </svg>
    `;
    return wrapper.firstElementChild;
  };
  
  // --- Click Handler Functionality (Modified for order constraint) ---

  const handleSVGClick = (event) => {
    // Prevent selection if the simulation is already submitted (locked)
    if (simulationState === 'submitted') {
        return;
    }
    
    const clickedSVG = event.currentTarget;
    const bandGroup = clickedSVG.dataset.bandGroup;
    const value = parseFloat(clickedSVG.dataset.value);
    const fill = clickedSVG.dataset.fill;
    const display = clickedSVG.dataset.display;
    const x = parseFloat(clickedSVG.getAttribute('x'));
    const y = parseFloat(clickedSVG.getAttribute('y'));
    
    // --- 1. Selection Order Constraint Check ---
    const requiredIndex = selectionOrder.indexOf(bandGroup);
    
    // Check if the previous band is selected (unless this is the first band)
    if (requiredIndex > 0) {
        const previousBand = selectionOrder[requiredIndex - 1];
        if (currentSelections[previousBand].value === null) {
            alert(`Please select the ${previousBand.toUpperCase()} band first.`);
            return;
        }
    }
    
    // Check if this band was already selected. If so, don't replay the animation.
    const wasAlreadySelected = currentSelections[bandGroup].value !== null;
    
    // 2. Update the global state with the new selection
    currentSelections[bandGroup].value = value;
    currentSelections[bandGroup].fill = fill;
    // Tolerance display is the string (e.g., "±5%"), others are the numerical value
    currentSelections[bandGroup].display = bandGroup === 'tol' ? display : String(value); 
    
    // 3. Highlight Logic (as before)
    if (selectedHighlights[bandGroup]) {
      selectedHighlights[bandGroup].remove();
    }
    const highlightWrapper = document.createElement("div");
    highlightWrapper.innerHTML = `
      <svg
        width="${HIGHLIGHT_SVG_WIDTH}" 
        height="${HIGHLIGHT_SVG_HEIGHT}"
        x="${x - 2}"  y="${y - 2}"  viewBox="0 0 156 44"
        xmlns="http://www.w3.org/2000/svg"
        data-band-group-highlight="${bandGroup}"
        style="pointer-events: none;"
      >
        ${HIGHLIGHT_PATH}
      </svg>
    `;
    const highlightSVG = highlightWrapper.firstElementChild;
    container.appendChild(highlightSVG);
    selectedHighlights[bandGroup] = highlightSVG;
    
    // 4. Play Lottie Animation (Only if selection changed)
    // We play the animation regardless of whether it was selected before,
    // as selecting a different color within the same band is still a selection reaction.
    playLottieAnimation(bandGroup);

    // 5. Calculate and update the resistance display and button states
    updateDisplay(); 
  };
  
  // --- NEW: Submit Function (Global access required by onclick attribute) ---
  window.onSubmit = () => {
    // Only proceed if all four bands are selected
    if (currentSelections.fd.value === null || currentSelections.sd.value === null || 
        currentSelections.mul.value === null || currentSelections.tol.value === null) {
        return;
    }
    
    simulationState = 'submitted';
    
    // Trigger update to show formatted value and range on the right side
    updateDisplay(); 
    
    // Lock all selection bands by making all SVG selection boxes non-interactive
    document.querySelectorAll('[data-band-group]').forEach(el => {
        el.style.pointerEvents = 'none';
    });
    
    // Button state update (disables submit/back, enables reset)
    updateButtonStates();
  };

  // --- NEW: Back Function (Global access required by onclick attribute) ---
  window.onBack = () => {
    if (simulationState === 'submitted') return; // Cannot go back after submit

    // Find the last selected band in reverse order
    let lastSelectedBand = null;
    for (let i = selectionOrder.length - 1; i >= 0; i--) {
        const band = selectionOrder[i];
        if (currentSelections[band].value !== null) {
            lastSelectedBand = band;
            break;
        }
    }
    
    if (lastSelectedBand) {
        // 1. Clear state
        currentSelections[lastSelectedBand] = { value: null, display: null, fill: null };
        
        // 2. Remove highlight
        if (selectedHighlights[lastSelectedBand]) {
            selectedHighlights[lastSelectedBand].remove();
            selectedHighlights[lastSelectedBand] = null;
        }
        
        // 3. Destroy Lottie instance and clear container
        if (lottieInstances[lastSelectedBand]) {
            lottieInstances[lastSelectedBand].destroy();
            delete lottieInstances[lastSelectedBand];
        }
        if (lottieContainers[lastSelectedBand]) {
            lottieContainers[lastSelectedBand].innerHTML = '';
        }
        
        // 4. Update display (this will also update button states)
        updateDisplay();
    }
  };

  // --- NEW: Reset Function (Global access required by onclick attribute) ---
  window.resetActiveSimulation = () => {
      // 1. Reset Global State
      currentSelections.fd = { value: null, display: null, fill: null };
      currentSelections.sd = { value: null, display: null, fill: null };
      currentSelections.mul = { value: null, display: null, fill: null };
      currentSelections.tol = { value: null, display: null, fill: null };
      simulationState = 'selecting';
      
      // 2. Remove Highlights
      Object.keys(selectedHighlights).forEach(band => {
          if (selectedHighlights[band]) {
              selectedHighlights[band].remove();
              selectedHighlights[band] = null;
          }
      });
      
      // 3. Destroy all Lottie instances and clear containers
      Object.keys(lottieInstances).forEach(band => {
          if (lottieInstances[band]) {
              lottieInstances[band].destroy();
          }
          if (lottieContainers[band]) {
              lottieContainers[band].innerHTML = '';
          }
      });
      lottieInstances = {}; // Reset the storage object

      // 4. Clear All Text Displays
      clearSVGContainer(resistanceValueRawEl);
      clearSVGContainer(resistanceValueFormattedEl);
      clearSVGContainer(rangeValueTextEl);
      
      // Clear the individual color code values as well
      if (fdValEl) fdValEl.textContent = '';
      if (sdValEl) sdValEl.textContent = '';
      if (mulValEl) mulValEl.textContent = '';
      if (tolValEl) tolValEl.textContent = '';
      
      // Clear Resistor Band visuals
      if (resistorBand1El) resistorBand1El.setAttribute('fill', '#CCC');
      if (resistorBand2El) resistorBand2El.setAttribute('fill', '#CCC');
      if (resistorBandMulEl) resistorBandMulEl.setAttribute('fill', '#CCC');
      if (resistorBandTolEl) resistorBandTolEl.setAttribute('fill', '#CCC');

      // 5. Re-enable selection SVGs
      document.querySelectorAll('[data-band-group]').forEach(el => {
          el.style.pointerEvents = 'auto';
      });

      // 6. Update Button States (all disabled except Back initially)
      updateButtonStates();
  };


  // --- Rendering and Attaching Listeners ---

  Object.values(data).flat().forEach(item => {
    item.band_group = item.id.split('-')[0];
    const svgElement = createSVG(item);
    // Attach the main click handler
    svgElement.addEventListener('click', handleSVGClick);
    container.appendChild(svgElement);
  });

  // Initial display and button setup
  updateDisplay();
});