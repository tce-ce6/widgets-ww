document.addEventListener('DOMContentLoaded', () => {
  // 1. Configuration Data (Integrated from config-json.txt)
  const config = {
    "config": {
      "totalSubstances": 18,
      "testedCounterId": "tested-number",
      "tickMark": {
        "asset": "assets/correct-tick-mark.svg",
        "width": 30,
        "height": 29,
        "opacity": 0.5
      }
    },
    "feedbackLayout": {
      "incorrect": {
        "containerId": "incorrect-feedback",
        "labelText": { "x": 365.7, "y": 854.355 },
        "phText": { "x": 365.7, "y": 904.355 },
        "natureText": { "x": 365.7, "y": 954.355 }
      },
      "correct": {
        "containerId": "correct-feedback",
        "labelText": { "x": 365.7, "y": 847.154 },
        "phText": { "x": 365.7, "y": 897.154 },
        "natureText": { "x": 380.8, "y": 947.154 }
      }
    },
    "controls": {
      "phTypeButtons": ["btn-neutral", "btn-acid", "btn-base"],
      "testPaperButton": "btn-test-ph-paper", // Updated to match HTML ID
      "correctNextButton": "btn-correct-feedback-nxt", // Updated to match HTML ID
      "incorrectNextButton": "btn-incorrect-feedback-nxt" // Updated to match HTML ID
    },
    "substances": {
      "lemon_juice": { "displayName": "Lemon Juice", "btnId": "btn-lemon-juice", "labelId": "label-lemon-juice", "animation": "assets/animation/lemon_juice.json", "ph": 2, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Lemon Juice</tspan> is a <tspan font-weight='bold'>ACID</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 2</tspan></tspan>" } },
      "vinegar": { "displayName": "Vinegar", "btnId": "btn-vinegar", "labelId": "label-vinegar", "animation": "assets/animation/vinegar.json", "ph": 2.4, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Vinegar</tspan> is an <tspan font-weight='bold'>ACID</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 2.4</tspan></tspan>" } },
      "milk": { "displayName": "Milk", "btnId": "btn-milk", "labelId": "label-milk", "animation": "assets/animation/milk.json", "ph": 6.5, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Milk</tspan> is <tspan font-weight='bold'>SLIGHTLY ACIDIC</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 6.5</tspan></tspan>" } },
      "baking_soda": { "displayName": "Baking Soda", "btnId": "btn-baking-soda", "labelId": "label-baking-soda", "animation": "assets/animation/baking_soda.json", "ph": 8.3, "nature": "BASE", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Baking Soda</tspan> is a <tspan font-weight='bold'>BASE</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 8.3</tspan></tspan>" } },
      "coffee": { "displayName": "Coffee", "btnId": "btn-coffee", "labelId": "label-coffee", "animation": "assets/animation/coffee.json", "ph": 5, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Coffee</tspan> is an <tspan font-weight='bold'>ACID</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 5</tspan></tspan>" } },
      "orange_juice": { "displayName": "Orange Juice", "btnId": "btn-orange-juice", "labelId": "label-orange-juice", "animation": "assets/animation/orange_juice.json", "ph": 3.5, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Orange Juice</tspan> is an <tspan font-weight='bold'>ACID</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 3.5</tspan></tspan>" } },
      "sugar_solution": { "displayName": "Sugar Solution", "btnId": "btn-sugar-solution", "labelId": "label-sugar-solution", "animation": "assets/animation/sugar_solution.json", "ph": 7, "nature": "NEUTRAL", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Sugar Solution</tspan> is <tspan font-weight='bold'>NEUTRAL</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 7</tspan></tspan>" } },
      "salt_solution": { "displayName": "Salt Solution", "btnId": "btn-salt-solution", "labelId": "label-salt-solution", "animation": "assets/animation/salt_solution.json", "ph": 7, "nature": "NEUTRAL", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Salt Solution</tspan> is <tspan font-weight='bold'>NEUTRAL</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 7</tspan></tspan>" } },
      "soap_solution": { "displayName": "Soap Solution", "btnId": "btn-soap-solution", "labelId": "label-soap-solution", "animation": "assets/animation/soap_solution.json", "ph": 12, "nature": "BASE", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Soap Solution</tspan> is a <tspan font-weight='bold'>BASE</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 12</tspan></tspan>" } },
      "pure_water": { "displayName": "Pure Water", "btnId": "btn-pure-water", "labelId": "label-pure-water", "animation": "assets/animation/pure_water.json", "ph": 7, "nature": "NEUTRAL", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Pure Water</tspan> is <tspan font-weight='bold'>NEUTRAL</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 7</tspan></tspan>" } },
      "bleach_solution": { "displayName": "Bleach Solution", "btnId": "btn-bleach-solution", "labelId": "label-bleach-solution", "animation": "assets/animation/bleach_solution.json", "ph": 12.5, "nature": "BASE", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Bleach Solution</tspan> is a <tspan font-weight='bold'>STRONG BASE</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 12.5</tspan></tspan>" } },
      "tamarind_pulp": { "displayName": "Tamarind Pulp", "btnId": "btn-tamarind-pulp", "labelId": "label-tamarind-pulp", "animation": "assets/animation/tamarind_pulp.json", "ph": 3, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Tamarind Pulp</tspan> is an <tspan font-weight='bold'>ACID</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 3</tspan></tspan>" } },
      "butter_milk": { "displayName": "Buttermilk", "btnId": "btn-butter-milk", "labelId": "label-butter-milk", "animation": "assets/animation/butter_milk.json", "ph": 4.5, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Buttermilk</tspan> is an <tspan font-weight='bold'>ACID</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 4.5</tspan></tspan>" } },
      "tomato_juice": { "displayName": "Tomato Juice", "btnId": "btn-tomato-juice", "labelId": "label-Tomato-juice", "animation": "assets/animation/tomato_juice.json", "ph": 4.2, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Tomato Juice</tspan> is an <tspan font-weight='bold'>ACID</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 4.2</tspan></tspan>" } },
      "stomach_acid": { "displayName": "Stomach Acid", "btnId": "btn-stomach-acid", "labelId": "label-stomach-acid", "animation": "assets/animation/stomach_acid.json", "ph": 1.5, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Stomach Acid</tspan> is a <tspan font-weight='bold'>STRONG ACID</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 1.5</tspan></tspan>" } },
      "blood_sample": { "displayName": "Blood Sample", "btnId": "btn-blood-sample", "labelId": "label-blood-sample", "animation": "assets/animation/blood_sample.json", "ph": 7.4, "nature": "BASE", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Blood Sample</tspan> is <tspan font-weight='bold'>SLIGHTLY BASIC</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 7.4</tspan></tspan>" } },
      "ammonia_solution": { "displayName": "Ammonia Solution", "btnId": "btn-ammonia-solution", "labelId": "label-ammonia-solution", "animation": "assets/animation/ammonia_solution.json", "ph": 11, "nature": "BASE", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Ammonia Solution</tspan> is a <tspan font-weight='bold'>BASE</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 11</tspan></tspan>" } },
      "cola": { "displayName": "Cola", "btnId": "btn-cola", "labelId": "label-cola", "animation": "assets/animation/cola.json", "ph": 2.5, "nature": "ACID", "feedback": { "labelText": "<tspan><tspan font-weight='bold'>Cola</tspan> is an <tspan font-weight='bold'>ACID</tspan></tspan>", "phText": "<tspan>pH Value:<tspan font-weight='bold'> 2.5</tspan></tspan>" } }
    }
  };

  // 2. State Management
  const state = {
    selectedLiquidKey: null,
    selectedNature: null, // 'ACID', 'BASE', 'NEUTRAL'
    completedSubstances: new Set(),
    testedCount: 0,
    isAnimating: false,
    liquidSelected: false,
    phSelected: false
  };

  // 3. UI Elements
  const els = {
    testedCounter: document.getElementById(config.config.testedCounterId),
    litmusStatic: document.getElementById('litmus-static'),
    litmusAnimated: document.getElementById('litmus-animated'),
    lottieContainer: document.getElementById('lottie-container'),
    
    // Controls
    btnTestPaper: document.getElementById(config.controls.testPaperButton),
    btnNextCorrect: document.getElementById(config.controls.correctNextButton),
    btnNextIncorrect: document.getElementById(config.controls.incorrectNextButton),
    
    // PH Buttons
    phButtons: {
      'NEUTRAL': document.getElementById('btn-neutral'),
      'ACID': document.getElementById('btn-acid'),
      'BASE': document.getElementById('btn-base')
    },

    // Feedback Containers
    feedbackCorrect: document.getElementById('correct-feedback'),
    feedbackIncorrect: document.getElementById('incorrect-feedback'),
    
    // Liquid Labels Group
    labels: {}
  };

  let lottieInstance = null;

  // 4. Initialization
  function init() {
    setupFeedbackTextElements();
    setupEventListeners();
    resetUI();
  }

  // Generate SVG Text elements for feedback dynamically
  function setupFeedbackTextElements() {
    const createTextEl = (id, x, y, parentId) => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("id", id);
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("fill", "black");
      text.setAttribute("font-family", "Inter");
      text.setAttribute("font-size", "24");
      text.style.whiteSpace = "pre";
      document.getElementById(parentId).appendChild(text);
      return text;
    };

    // Create Correct Feedback Elements
    els.correctLabelText = createTextEl('correct-label-text', config.feedbackLayout.correct.labelText.x, config.feedbackLayout.correct.labelText.y, 'correct-feedback');
    els.correctPhText = createTextEl('correct-ph-text', config.feedbackLayout.correct.phText.x, config.feedbackLayout.correct.phText.y, 'correct-feedback');
    
    // Create Incorrect Feedback Elements
    els.incorrectLabelText = createTextEl('incorrect-label-text', config.feedbackLayout.incorrect.labelText.x, config.feedbackLayout.incorrect.labelText.y, 'incorrect-feedback');
    els.incorrectPhText = createTextEl('incorrect-ph-text', config.feedbackLayout.incorrect.phText.x, config.feedbackLayout.incorrect.phText.y, 'incorrect-feedback');
    
    // Create Nature Info Elements (Optional, based on coordinates in logic)
    els.correctNatureText = createTextEl('correct-nature-info-text', config.feedbackLayout.correct.natureText.x, config.feedbackLayout.correct.natureText.y, 'correct-feedback');
    els.incorrectNatureText = createTextEl('incorrect-nature-info-text', config.feedbackLayout.incorrect.natureText.x, config.feedbackLayout.incorrect.natureText.y, 'incorrect-feedback');
  }

  function setupEventListeners() {
    // Liquid Buttons
    Object.keys(config.substances).forEach(key => {
      const sub = config.substances[key];
      const btn = document.getElementById(sub.btnId);
      const label = document.getElementById(sub.labelId);
      
      if(label) els.labels[key] = label;

      if (btn) {
        // Ensure button pointer cursor
        btn.style.cursor = 'pointer';
        
        btn.addEventListener('click', () => {
          // Check if liquid already tested, animation playing, OR pH type already selected
          if (state.completedSubstances.has(key) || state.isAnimating || state.phSelected) return;
          handleLiquidSelection(key);
        });
      }
    });

    // pH Type Buttons
    Object.keys(els.phButtons).forEach(type => {
      els.phButtons[type].addEventListener('click', () => {
        if (!state.liquidSelected || state.isAnimating) return;
        handlePhSelection(type);
      });
    });

    // Test Paper Button
    els.btnTestPaper.addEventListener('click', () => {
      if (!state.phSelected || state.isAnimating) return;
      handleTestPaperClick();
    });

    // Next Buttons
    els.btnNextCorrect.addEventListener('click', resetUI);
    els.btnNextIncorrect.addEventListener('click', resetUI);
  }

  // 5. Logic Handlers

  function handleLiquidSelection(key) {
    // Reset previous temp state
    if(state.selectedLiquidKey && !state.completedSubstances.has(state.selectedLiquidKey)) {
        const prevBtn = document.getElementById(config.substances[state.selectedLiquidKey].btnId);
        if(prevBtn) prevBtn.style.opacity = '1';
    }

    state.selectedLiquidKey = key;
    state.liquidSelected = true;
    state.selectedNature = null;
    state.phSelected = false;

    // Visuals
    updateLiquidLabels(key);
    
    // Highlight selected liquid
    const btn = document.getElementById(config.substances[key].btnId);
    btn.style.opacity = '0.6'; // Visual feedback for selection

    // Start Animation (Phase 1)
    playAnimation(key, true);
  }

  function disableLiquidCursors() {
  Object.keys(config.substances).forEach(key => {
    const btn = document.getElementById(config.substances[key].btnId);
    if (btn) {
      btn.style.cursor = 'default';
    }
  });
}

function enableLiquidCursors() {
  Object.keys(config.substances).forEach(key => {
    // Do not re-enable completed substances
    if (state.completedSubstances.has(key)) return;

    const btn = document.getElementById(config.substances[key].btnId);
    if (btn) {
      btn.style.cursor = 'pointer';
    }
  });
}


  function handlePhSelection(type) {
  state.selectedNature = type;
  state.phSelected = true;

  // UI Update for pH buttons
  Object.values(els.phButtons).forEach(btn => btn.style.opacity = '0.4');
  els.phButtons[type].style.opacity = '1';

  // Disable liquid cursors after pH selection
  disableLiquidCursors();

  // Enable Test Paper
  els.btnTestPaper.style.opacity = '1';
  els.btnTestPaper.style.cursor = 'pointer';
}


  function handleTestPaperClick() {
    // Disable controls during animation
    state.isAnimating = true;
    
    // Resume Animation (Phase 2)
    els.litmusAnimated.style.display = 'block';
    els.litmusStatic.style.display = 'none';
    
    if(lottieInstance) {
        lottieInstance.play(); // Play to end
    }
  }

  function evaluateResult() {
    const substance = config.substances[state.selectedLiquidKey];
    // Map simplified nature to check against user selection if needed, 
    // or assume user selects broad categories ACID/BASE/NEUTRAL.
    // The JSON has "SLIGHTLY ACIDIC" etc., but buttons are "ACID", "BASE".
    // Simple logic: If substance.nature includes the selection.
    
    let isCorrect = false;
    if (substance.nature.includes(state.selectedNature)) {
        isCorrect = true;
    } else if (state.selectedNature === 'NEUTRAL' && substance.nature === 'NEUTRAL') {
        isCorrect = true;
    }

    if (isCorrect) {
      showCorrectFeedback(substance);
    } else {
      showIncorrectFeedback(substance);
    }
  }

  function showCorrectFeedback(substance) {
    // Update Text
    els.correctLabelText.innerHTML = substance.feedback.labelText;
    els.correctPhText.innerHTML = substance.feedback.phText;
    // Note: JSON provided does not have nature description text, skipping natureText update or setting generic
    // els.correctNatureText.innerHTML = ... 

    els.feedbackCorrect.style.display = 'block';
    
    // Mark as completed
    state.completedSubstances.add(state.selectedLiquidKey);
    state.testedCount++;
    els.testedCounter.textContent = `Tested: ${state.testedCount}/${config.config.totalSubstances}`;

    // Add Tick Mark
    const btn = document.getElementById(substance.btnId);
    if(btn) {
        addTickMarkToButton(btn);
        btn.style.pointerEvents = 'none'; // Disable future clicks
    }
    console.log(state.testedCount, config.config.totalSubstances);  

    if (state.testedCount === config.config.totalSubstances) {
    els.btnNextCorrect.style.display = 'none';
  } else {
    els.btnNextCorrect.style.display = 'block';
  }
  }

  function showIncorrectFeedback(substance) {
    // Update Text
    els.incorrectLabelText.innerHTML = substance.feedback.labelText;
    els.incorrectPhText.innerHTML = substance.feedback.phText;
    
    els.feedbackIncorrect.style.display = 'block';
  }

  function addTickMarkToButton(buttonGroup) {
    // Create foreignObject for the tick mark
    const tick = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    const bbox = buttonGroup.getBBox(); // Get coordinates of the button
    
    // Center logic or corner logic. Let's put it top-right of button
    tick.setAttribute('x', bbox.x + bbox.width - 40);
    tick.setAttribute('y', bbox.y + 14);
    tick.setAttribute('width', '30');
    tick.setAttribute('height', '29');
    
    const img = document.createElement('img');
    img.src = config.config.tickMark.asset;
    img.width = 30;
    img.height = 29;
    
    tick.appendChild(img);
    buttonGroup.parentNode.appendChild(tick); // Append to parent group to overlay
    
    // Set opacity state for completed item
    buttonGroup.style.opacity = '0.5';
  }

  // 6. Animation Controller
  function playAnimation(key, isInitial) {
    const animPath = config.substances[key].animation;
    
    // Reset container
    els.lottieContainer.innerHTML = '';
    els.litmusAnimated.style.display = 'block';
    els.litmusStatic.style.display = 'none';

    lottieInstance = lottie.loadAnimation({
      container: els.lottieContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: animPath
    });

    state.isAnimating = true;

    // Play initial segment (0 to 2 seconds approx, assumed 60 frames)
    // Or just play and pause after timeout.
    lottieInstance.play();

    if (isInitial) {
        setTimeout(() => {
            if(lottieInstance) lottieInstance.pause();
            state.isAnimating = false;
            enablePhButtons();
        }, 2000);
    } else {
        // This path shouldn't be reached in current logic, handled in handleTestPaperClick
    }
    
    // Event for when animation finishes completely (Phase 2 end)
    lottieInstance.addEventListener('complete', () => {
        state.isAnimating = false;
        evaluateResult();
    });
  }

  // 7. Utility Functions
  function updateLiquidLabels(activeKey) {
    Object.keys(els.labels).forEach(key => {
        if(els.labels[key]) {
            els.labels[key].style.display = key === activeKey ? 'block' : 'none';
        }
    });
  }

  function enablePhButtons() {
    Object.values(els.phButtons).forEach(btn => {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    });
  }

  function resetUI() {
     if(state.selectedLiquidKey && !state.completedSubstances.has(state.selectedLiquidKey)) {
        const prevBtn = document.getElementById(config.substances[state.selectedLiquidKey].btnId);
        if(prevBtn) prevBtn.style.opacity = '1';
    }
    // Reset state variables
    state.liquidSelected = false;
    state.phSelected = false;
    state.selectedLiquidKey = null;
    state.selectedNature = null;
    state.isAnimating = false;

    // Hide Feedbacks
    els.feedbackCorrect.style.display = 'none';
    els.feedbackIncorrect.style.display = 'none';

    // Reset Animation container
    els.litmusAnimated.style.display = 'none';
    els.litmusStatic.style.display = 'block';
    els.lottieContainer.innerHTML = '';
    lottieInstance = null;

    // Reset Controls Opacity
    Object.values(els.phButtons).forEach(btn => btn.style.opacity = '0.4');
    els.btnTestPaper.style.opacity = '0.4';
    els.btnTestPaper.style.cursor = 'default';

    // Hide all labels
    Object.values(els.labels).forEach(lbl => lbl.style.display = 'none');
     enableLiquidCursors();
    // Restore opacity of completed buttons (they stay 0.5, current selected goes back to 1 if not complete)
    // Actually handled in handleLiquidSelection by checking completed set.
  }

  // Start
  init();
});