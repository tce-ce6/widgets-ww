document.addEventListener("DOMContentLoaded", () => {

  // --- DATA STRUCTURE ---
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
      { "id": "mul-1", "x": 1467, "y": 400, "fill": "#000000", "value": 0, "band_group": "mul" },
      { "id": "mul-2", "x": 1467, "y": 441, "fill": "#CC3C00", "value": 1, "band_group": "mul" },
      { "id": "mul-3", "x": 1467, "y": 482, "fill": "#F80000", "value": 2, "band_group": "mul" },
      { "id": "mul-4", "x": 1467, "y": 523, "fill": "#FF8800", "value": 3, "band_group": "mul" },
      { "id": "mul-5", "x": 1467, "y": 564, "fill": "#FFFF00", "value": 4, "band_group": "mul" },
      { "id": "mul-6", "x": 1467, "y": 605, "fill": "#00E617", "value": 5, "band_group": "mul" },
      { "id": "mul-7", "x": 1467, "y": 646, "fill": "#0066FF", "value": 6, "band_group": "mul" },
      { "id": "mul-8", "x": 1467, "y": 687, "fill": "#9100FF", "value": 7, "band_group": "mul" },
      { "id": "mul-9", "x": 1467, "y": 728, "fill": "#D2D2D2", "value": 8, "band_group": "mul" },
      { "id": "mul-10", "x": 1467, "y": 769, "fill": "#FFFFFF", "value": 9, "band_group": "mul" },
      { "id": "mul-11", "x": 1467, "y": 810, "fill": "url(#paint2_linear_5135_217)", "value": -1, "band_group": "mul" },
      { "id": "mul-12", "x": 1467, "y": 851, "fill": "url(#paint3_linear_5135_217)", "value": -2, "band_group": "mul" }
    ],

    "tolerance": [
      { "id": "tol-1", "x": 1638, "y": 400, "fill": "url(#paint2_linear_5135_217)", "value": 0.05, "display": "± 5%", "band_group": "tol" },
      { "id": "tol-2", "x": 1638, "y": 441, "fill": "url(#paint3_linear_5135_217)", "value": 0.10, "display": "± 10%", "band_group": "tol" },
      { "id": "tol-3", "x": 1638, "y": 482, "fill": "#FDE4C6", "value": 0.20, "display": "± 20%", "band_group": "tol" }
    ]
  };

  const container = document.getElementById("color-code-container");
  if (!container) return;

  // --- Global State ---
  const currentSelections = {
    fd: { value: null, display: null, fill: null },
    sd: { value: null, display: null, fill: null },
    mul: { value: null, display: null, fill: null },
    tol: { value: null, display: null, fill: null }
  };
  
  const selectionOrder = ["fd", "sd", "mul", "tol"];
  let simulationState = 'selecting';

  // --- DOM Element References ---
  const resistanceValueRawEl = document.getElementById('resistance-value-raw'); 
  const resistanceValueFormattedEl = document.getElementById('resistance-value-formatted');
  const resistanceRangeEl = document.getElementById('resistance-range');
  const rangeValueTextEl = document.getElementById('range-value-text');
  
  const resistorBand1El = document.getElementById('resistor-band-1');
  const resistorBand2El = document.getElementById('resistor-band-2');
  const resistorBandMulEl = document.getElementById('resistor-band-mul');
  const resistorBandTolEl = document.getElementById('resistor-band-tol');

  const submitButtonEl = document.getElementById('submit-button');
  const backButtonEl = document.getElementById('back-button');
  const resetButtonEl = document.getElementById('reset-button');

  const firstBandColor = document.getElementById('first-band-color');
  const secondBandColor = document.getElementById('second-band-color');
  const multiplierBandColor = document.getElementById('third-band-color');
  const toleranceBandColor = document.getElementById('fourth-band-color');
  
  const fdValEl = document.getElementById('first-digit-val');
  const sdValEl = document.getElementById('second-digit-val');
  const mulValEl = document.getElementById('multiplier-val');
  const tolValEl = document.getElementById('tolerance-val');

  // --- LOTTIE ANIMATIONS ---
  const LOTTIE_ASSETS = {
      "fd": 'assets/animation/first_colourband_reaction.json',
      "sd": 'assets/animation/second_colourband_reaction.json',
      "mul": 'assets/animation/third_colourband_reaction.json',
      "tol": 'assets/animation/forth_colourband_reaction.json'
  };

  const lottieContainers = {
      "fd": document.getElementById('lottie-fd-container'),
      "sd": document.getElementById('lottie-sd-container'),
      "mul": document.getElementById('lottie-mul-container'),
      "tol": document.getElementById('lottie-tol-container')
  };
  
  let lottieInstances = {};

  const playLottieAnimation = (bandGroup) => {
      const containerEl = lottieContainers[bandGroup];
      const animationPath = LOTTIE_ASSETS[bandGroup];

      if (!containerEl || !animationPath || typeof lottie === 'undefined') return;
      
      containerEl.innerHTML = '';
      if (lottieInstances[bandGroup]) {
          lottieInstances[bandGroup].destroy();
          delete lottieInstances[bandGroup];
      }

      const anim = lottie.loadAnimation({
          container: containerEl,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          path: animationPath
      });
      lottieInstances[bandGroup] = anim;
  };

  // --- HELPERS ---
  const formatResistance = (value) => {
    if (value === null || isNaN(value)) return '...';
    const absValue = Math.abs(value);
    if (absValue >= 1e9) return `${(value / 1e9).toFixed(2)} GΩ`;
    if (absValue >= 1e6) return `${(value / 1e6).toFixed(2)} MΩ`;
    if (absValue >= 1e3) return `${(value / 1e3).toFixed(2)} kΩ`;
    if (absValue >= 1) return `${value.toFixed(2)} Ω`;
    return `${value.toFixed(2)} Ω`;
  };
  
  const updateSVGText = (container, text) => {
      if (container) container.textContent = text;
  };
  
  const clearSVGContainer = (container) => {
      if (container) container.textContent = '';
  };

  const getExponentChar = (exp) => {
      if (exp === null) return '';
      switch (exp) {
          case 0: return '⁰';
          case 1: return '¹';
          case 2: return '²';
          case 3: return '³';
          case -1: return '⁻¹';
          case -2: return '⁻²';
      }
      if (exp >= 4 && exp <= 9) return String.fromCharCode(8304 + exp);
      return `^${exp}`; 
  };
  
  const updateButtonStates = () => {
      const fd = currentSelections.fd.value;
      const sd = currentSelections.sd.value;
      const mul = currentSelections.mul.value;
      const tol = currentSelections.tol.value;
      
      const allSelected = fd !== null && sd !== null && mul !== null && tol !== null;
      const firstSelected = fd !== null;
      
      if (submitButtonEl) submitButtonEl.disabled = !allSelected || simulationState !== 'selecting';
      if (backButtonEl) backButtonEl.disabled = !firstSelected || simulationState !== 'selecting';
      if (resetButtonEl) resetButtonEl.disabled = simulationState !== 'submitted';
  };

  const updateDisplay = () => {
    const fd = currentSelections.fd.value;
    const sd = currentSelections.sd.value;
    const mulExp = currentSelections.mul.value;
    const tol = currentSelections.tol.value;
    const tolDisplay = currentSelections.tol.display;
    
    // 1. Text Labels
    if (fdValEl) fdValEl.textContent = fd !== null ? String(fd) : '';
    if (sdValEl) sdValEl.textContent = sd !== null ? String(sd) : '';
    if (mulValEl) {
        mulValEl.textContent = mulExp !== null ? `× 10${getExponentChar(mulExp)}` : '';
    }
    if (tolValEl) tolValEl.textContent = tolDisplay !== null ? tolDisplay : '';

    // 2. Resistor Visuals
    const defaultFill = '#CCC';
    if (resistorBand1El) resistorBand1El.setAttribute('fill', currentSelections.fd.fill || defaultFill);
    if (resistorBand2El) resistorBand2El.setAttribute('fill', currentSelections.sd.fill || defaultFill);
    if (resistorBandMulEl) resistorBandMulEl.setAttribute('fill', currentSelections.mul.fill || defaultFill);
    if (resistorBandTolEl) resistorBandTolEl.setAttribute('fill', currentSelections.tol.fill || defaultFill);

    if(firstBandColor) firstBandColor.setAttribute('fill', currentSelections.fd.fill || defaultFill);
    if(secondBandColor) secondBandColor.setAttribute('fill', currentSelections.sd.fill || defaultFill);
    
    // Special Gradient handling for Gold/Silver
    if(multiplierBandColor){
        if(currentSelections.mul.fill === 'url(#paint3_linear_5135_217)') multiplierBandColor.setAttribute('fill', 'url(#paint0_linear_36_531)');
        else if (currentSelections.mul.fill === 'url(#paint2_linear_5135_217)') multiplierBandColor.setAttribute('fill', 'url(#paint0_linear_15_526)');
        else multiplierBandColor.setAttribute('fill', currentSelections.mul.fill || defaultFill);
    }  
    if(toleranceBandColor){
        if(currentSelections.tol.fill === 'url(#paint3_linear_5135_217)') toleranceBandColor.setAttribute('fill', 'url(#paint0_linear_36_531)');
        else if (currentSelections.tol.fill === 'url(#paint2_linear_5135_217)') toleranceBandColor.setAttribute('fill', 'url(#paint0_linear_15_526)');
        else toleranceBandColor.setAttribute('fill', currentSelections.tol.fill || defaultFill);
    }

    // 3. Raw/Incremental Text
    let rawValue = '';
    if (fd !== null) {
      rawValue = `${fd}`;
      if (sd !== null) {
        rawValue = `${fd}${sd}`;
        if (mulExp !== null) {
          rawValue = `${fd}${sd} × 10${getExponentChar(mulExp)} Ω`;
          if (tolDisplay !== null) rawValue += ` ${tolDisplay}`;
        }
      }
    }
    updateSVGText(resistanceValueRawEl, rawValue);

    // 4. Formatted Final Display
    if (simulationState === 'submitted') {
        const twoDigits = (fd * 10) + sd;
        const nominalResistance = twoDigits * Math.pow(10, mulExp);
        const toleranceAmount = nominalResistance * tol;
        const formattedR = formatResistance(nominalResistance).trim();
        
        updateSVGText(resistanceValueFormattedEl, `${formattedR} ${tolDisplay}`);
        updateSVGText(rangeValueTextEl, `${formatResistance(nominalResistance - toleranceAmount)} to ${formatResistance(nominalResistance + toleranceAmount)}`);
    } else {
        clearSVGContainer(resistanceValueFormattedEl);
        clearSVGContainer(rangeValueTextEl);
    }
    
    updateButtonStates();
  };

  // --- HIGHLIGHT LOGIC ---
  
  


  const HIGHLIGHT_PATH = `<path d="M158 -2 H-2 V45.25 H158 V-2 Z" stroke="#13FFEF" stroke-width="20" fill="none" data-highlight="true" />`;
  const selectedHighlights = { "fd": null, "sd": null, "mul": null, "tol": null };

  const createSVG = ({ id, x, y, fill, value, band_group, display }) => {
  
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <svg width="156" height="44" x="${x}" y="${y -24}" viewBox="0 0 156 44" xmlns="http://www.w3.org/2000/svg" id="${id}" data-id="${id}" data-value="${value}" data-band-group="${band_group}" data-fill="${fill}" data-display="${display || value}">
        <path d="M156 0H0V43.25H156V0Z" id="filler" fill="${fill}" />
        <path d="M155 1H1V42.25H155V1Z" stroke="white" stroke-width="2" />
      </svg>`;
    return wrapper.firstElementChild;
  };
  
  // --- CLICK HANDLER WITH PREVIOUS LEVEL LOCK ---
  const handleSVGClick = (event) => {
    if (simulationState === 'submitted') return;
    
    const clickedSVG = event.currentTarget;
    const bandGroup = clickedSVG.dataset.bandGroup;
    const requiredIndex = selectionOrder.indexOf(bandGroup);
    
    // A. Forward Check: Must select previous band first
    if (requiredIndex > 0) {
        const prev = selectionOrder[requiredIndex - 1];
        if (currentSelections[prev].value === null) return;
    }

    // B. Backward Lock: Cannot change current band if next band is already selected
    if (requiredIndex < selectionOrder.length - 1) {
        const next = selectionOrder[requiredIndex + 1];
        if (currentSelections[next].value !== null) return;
    }
    
    // Update State
    currentSelections[bandGroup].value = parseFloat(clickedSVG.dataset.value);
    currentSelections[bandGroup].fill = clickedSVG.dataset.fill;
    currentSelections[bandGroup].display = bandGroup === 'tol' ? clickedSVG.dataset.display : clickedSVG.dataset.value; 
    
    // Visual Highlight
    if (selectedHighlights[bandGroup]) selectedHighlights[bandGroup].remove();
    const highlightWrapper = document.createElement("div");
    highlightWrapper.innerHTML = `<svg width="160" height="43" x="${parseFloat(clickedSVG.getAttribute('x')) - 2}" y="${parseFloat(clickedSVG.getAttribute('y')) - 2}" viewBox="0 0 156 44" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">${HIGHLIGHT_PATH}</svg>`;
    const highlightSVG = highlightWrapper.firstElementChild;
    container.appendChild(highlightSVG);
    selectedHighlights[bandGroup] = highlightSVG;
    
    playLottieAnimation(bandGroup);
    updateDisplay(); 
  };
  
  // --- ACTIONS ---
  window.onSubmit = () => {
    if (Object.values(currentSelections).some(s => s.value === null)) return;
    simulationState = 'submitted';
    updateDisplay(); 
    document.querySelectorAll('[data-band-group]').forEach(el => el.style.pointerEvents = 'none');
  };

  window.onBack = () => {
    if (simulationState === 'submitted') return;
    let lastBand = [...selectionOrder].reverse().find(band => currentSelections[band].value !== null);
    
    if (lastBand) {
        currentSelections[lastBand] = { value: null, display: null, fill: null };
        if (selectedHighlights[lastBand]) {
            selectedHighlights[lastBand].remove();
            selectedHighlights[lastBand] = null;
        }
        if (lottieInstances[lastBand]) lottieInstances[lastBand].destroy();
        if (lottieContainers[lastBand]) lottieContainers[lastBand].innerHTML = '';
        updateDisplay();
    }
  };

  window.resetActiveSimulation = () => {
      // 1. Reset Data
      selectionOrder.forEach(band => {
          currentSelections[band] = { value: null, display: null, fill: null };
          if (selectedHighlights[band]) {
              selectedHighlights[band].remove();
              selectedHighlights[band] = null;
          }
          if (lottieInstances[band]) lottieInstances[band].destroy();
          if (lottieContainers[band]) lottieContainers[band].innerHTML = '';
      });
      
      lottieInstances = {};
      simulationState = 'selecting';

      // 2. Clear Visuals & Re-enable clicks
      document.querySelectorAll('[data-band-group]').forEach(el => el.style.pointerEvents = 'auto');
      
      // 3. Final Sync (Reverts colors to #CCC and clears text)
      updateDisplay();
  };

  // --- INIT ---
  Object.values(data).flat().forEach(item => {
    item.band_group = item.id.split('-')[0];
    const svgElement = createSVG(item);
    svgElement.addEventListener('click', handleSVGClick);
    container.appendChild(svgElement);
  });

  updateDisplay();
});