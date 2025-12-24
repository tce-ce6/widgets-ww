document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------
  // 1. DATA CONFIGURATION
  // -------------------------------------------------------------

  const objectsData = [
    { id: "test-tube", path: "assets/test-tube.svg", x: 1037, y: 161 },
    { id: "beaker", path: "assets/beaker.svg", x: 1251, y: 161 },
    { id: "conical-flask", path: "assets/conical-flask.svg", x: 1465, y: 161 },
    { id: "measuring-cylinder", path: "assets/measuring-cylinder.svg", x: 1679, y: 161 },
    { id: "pipette", path: "assets/pipette.svg", x: 1037, y: 332 },
    { id: "burette", path: "assets/buretter.svg", x: 1251, y: 332 },
    { id: "funnel", path: "assets/funnel.svg", x: 1465, y: 332 },
    { id: "evaporating-dish", path: "assets/evaporating-dish.svg", x: 1679, y: 332 },
    { id: "watch-glass", path: "assets/watch-glass.svg", x: 1037, y: 503 },
    { id: "filter-paper", path: "assets/filter-paper.svg", x: 1251, y: 503 },
    { id: "bunsen-burner", path: "assets/bunsen-burner.svg", x: 1465, y: 503 },
    { id: "tripod-stand", path: "assets/tripod-stand.svg", x: 1679, y: 503 },
    { id: "test-tube-rack", path: "assets/test-tube-rack.svg", x: 1037, y: 674 },
    { id: "stirring-rod", path: "assets/stirring-rod.svg", x: 1251, y: 674 },
    { id: "dropper", path: "assets/dropper.svg", x: 1465, y: 674 },
    { id: "petri-dish", path: "assets/petri-dish.svg", x: 1679, y: 674 },
    { id: "thermometer", path: "assets/thermometer.svg", x: 1037, y: 845 },
    { id: "tongs", path: "assets/tongs.svg", x: 1251, y: 845 },
    { id: "volumetric-flask", path: "assets/valumetric-flask.svg", x: 1465, y: 845 },
    { id: "test-tube-holder", path: "assets/test-tube-holder.svg", x: 1679, y: 845 }
  ];

  const experimentsData = [
    { "id": "exp_1", "name": "Exp:1- Testing for starch in food", "x": 27, "y": 95 },
    { "id": "exp_2", "name": "Exp:2- Making a salt solution", "x": 27, "y": 149 },
    { "id": "exp_3", "name": "Exp:3- Observing a chemical reaction", "x": 27, "y": 203 },
    { "id": "exp_4", "name": "Exp:4- Heating water to boiling point", "x": 27, "y": 257 },
    { "id": "exp_5", "name": "Exp:5- Separating sand from water", "x": 27, "y": 311 },
    { "id": "exp_6", "name": "Exp:6- Titration experiment", "x": 27, "y": 365 },
    { "id": "exp_7", "name": "Exp:7- Crystallization of salt", "x": 27, "y": 419 },
    { "id": "exp_8", "name": "Exp:8- Preparing a slandered solution", "x": 27, "y": 473 },
    { "id": "exp_9", "name": "Exp:9- Testing pH of solution", "x": 27, "y": 527 },
    { "id": "exp_10", "name": "Exp:10- Your experiment", "x": 27, "y": 581 }
  ];

  const experimentDetails = {
    "experiments": [
      {
        "id": "exp_1",
        "title": "Testing for Starch in Food",
        "gradeLevel": "6-7",
        "difficulty": "Beginner",
        "learningObjective": "Introduce basic testing procedures and simple apparatus",
        "scenario": "You have a small piece of potato. You need to add a few drops of iodine solution to test for starch.",
        "yourTask": "Set up the apparatus to test the potato for starch.",
        "requiredApparatus": [
          { "id": "petri-dish", "name": "Petri Dish", "reason": "Perfect for placing small food samples and adding drops of solution" },
          { "id": "dropper", "name": "Dropper", "reason": "To add iodine solution drop by drop with control" }
        ],
        "incorrectSelections": [
          { "id": "beaker", "name": "Beaker", "feedback": "Not ideal. Too large! You only need a small dish for this simple test" },
          { "id": "test-tube", "name": "Test Tube", "feedback": "The potato piece won't fit well, and you can't observe color change easily" },
          { "id": "conical-flask", "name": "Conical Flask", "feedback": "Way too big for testing a tiny food sample!" },
          { "id": "pipette", "name": "Pipette", "feedback": "A dropper is simpler and better for adding just a few drops" },
          { "id": "measuring-cylinder", "name": "Measuring Cylinder", "feedback": "You're not measuring volumes here - just adding drops to a sample" }
        ]
      },
      {
        "id": "exp_2",
        "title": "Making a Salt Solution",
        "gradeLevel": "6-7",
        "difficulty": "Beginner",
        "learningObjective": "Understand dissolving and stirring techniques",
        "scenario": "You have 10g of salt. You need to dissolve it in 100 cm³ of water and stir it well.",
        "yourTask": "Select the correct apparatus to mix salt and water.",
        "requiredApparatus": [
          { "id": "beaker", "name": "Beaker", "reason": "Wide opening makes it easy to add salt and stir" },
          { "id": "stirring-rod", "name": "Stirring Rod", "reason": "To mix the salt and water thoroughly" },
          { "id": "measuring-cylinder", "name": "Measuring Cylinder", "reason": "To measure exactly 100 cm³ of water" }
        ],
        "incorrectSelections": [
          { "id": "test-tube", "name": "Test Tube", "feedback": "Too narrow to stir properly and measure accurately" },
          { "id": "conical-flask", "name": "Conical Flask", "feedback": "Narrow neck makes it hard to add salt and stir" },
          { "id": "pipette", "name": "Pipette", "feedback": "Can't measure 100 cm³ - pipettes are for smaller, precise volumes" },
          { "id": "petri-dish", "name": "Petri Dish", "feedback": "Too shallow - the solution would spill when stirring" },
          { "id": "dropper", "name": "Dropper", "feedback": "Way too small to measure 100 cm³ of water!" }
        ]
      },
      {
        "id": "exp_3",
        "title": "Observing a Chemical Reaction",
        "gradeLevel": "7-8",
        "difficulty": "Beginner",
        "learningObjective": "Safe observation of gas-producing reactions",
        "scenario": "You need to add 5 cm³ of vinegar to 5 cm³ of baking soda solution and watch the reaction.",
        "yourTask": "Prepare the setup to observe the reaction safely.",
        "requiredApparatus": [
          { "id": "test-tube", "name": "Test Tube", "reason": "Perfect size for small volume reactions and easy observation" },
          { "id": "measuring-cylinder", "name": "Measuring Cylinder", "reason": "To measure the liquids accurately" },
          { "id": "test-tube-rack", "name": "Test Tube Rack", "reason": "To hold the test tube safely while you work" }
        ],
        "incorrectSelections": [
          { "id": "beaker", "name": "Beaker", "feedback": "Works but wastes space - test tubes are better for small volumes" },
          { "id": "pipette", "name": "Pipette", "feedback": "You need something to hold and observe the reaction" },
          { "id": "petri-dish", "name": "Petri Dish", "feedback": "Too shallow - the bubbles might overflow!" },
          { "id": "conical-flask", "name": "Conical Flask", "feedback": "Too large for just 10 cm³ total volume" },
          { "id": "dropper", "name": "Dropper", "feedback": "Can't hold the reaction - you need a proper vessel" }
        ]
      },
      {
        "id": "exp_4",
        "title": "Heating Water to Boiling Point",
        "gradeLevel": "7-8",
        "difficulty": "Intermediate",
        "learningObjective": "Safe heating procedures and temperature measurement",
        "scenario": "You need to heat 50 cm³ of water until it boils and record the temperature.",
        "yourTask": "Heat water and measure its boiling temperature.",
        "requiredApparatus": [
          { "id": "beaker", "name": "Beaker", "reason": "Can be heated safely and holds enough water" },
          { "id": "bunsen-burner", "name": "Bunsen Burner", "reason": "Provides heat source" },
          { "id": "tripod-stand", "name": "Tripod Stand", "reason": "Holds the beaker safely above the flame" },
          { "id": "thermometer", "name": "Thermometer", "reason": "To measure the temperature as water heats up" }
        ],
        "incorrectSelections": [
          { "id": "test-tube", "name": "Test Tube", "feedback": "Dangerous for boiling!" },
          { "id": "conical-flask", "name": "Conical Flask", "feedback": "Beakers are more standard for heating" },
          { "id": "evaporating-dish", "name": "Evaporating Dish", "feedback": "You want to heat water, not evaporate it" },
          { "id": "petri-dish", "name": "Petri Dish", "feedback": "Not designed for heating" },
          { "id": "measuring-cylinder", "name": "Measuring Cylinder", "feedback": "Never heat measuring cylinders" }
        ]
      },
      {
        "id": "exp_5",
        "title": "Separating Sand from Water",
        "gradeLevel": "8-9",
        "difficulty": "Intermediate",
        "learningObjective": "Filtration technique for separation",
        "scenario": "You have muddy water with sand. Separate the sand using filtration.",
        "yourTask": "Set up the filtration apparatus to separate sand.",
        "requiredApparatus": [
          { "id": "funnel", "name": "Funnel", "reason": "Guides the mixture through the filter paper" },
          { "id": "filter-paper", "name": "Filter Paper", "reason": "Traps sand particles" },
          { "id": "beaker", "name": "Beaker", "reason": "To collect filtered water" }
        ],
        "incorrectSelections": [
          { "id": "test-tube", "name": "Test Tube", "feedback": "Too small for filtration setup" },
          { "id": "pipette", "name": "Pipette", "feedback": "Can't separate solids from liquids" },
          { "id": "measuring-cylinder", "name": "Measuring Cylinder", "feedback": "Not designed for filtration" },
          { "id": "petri-dish", "name": "Petri Dish", "feedback": "Too shallow" },
          { "id": "dropper", "name": "Dropper", "feedback": "A dropper can't perform filtration" }
        ]
      },
      {
        "id": "exp_6",
        "title": "Titration Experiment",
        "gradeLevel": "9-10",
        "difficulty": "Advanced",
        "learningObjective": "Precise measurement and volumetric analysis",
        "scenario": "You have 25.0 cm³ of hydrochloric acid. Use 0.1 M sodium hydroxide to find the acid's concentration.",
        "yourTask": "Select the precise apparatus needed for titration.",
        "requiredApparatus": [
          { "id": "pipette", "name": "Pipette", "reason": "Measures exactly 25.0 cm³" },
          { "id": "conical-flask", "name": "Conical Flask", "reason": "Prevents splashing during swirling" },
          { "id": "burette", "name": "Burette", "reason": "Delivers solution drop by drop" }
        ],
        "incorrectSelections": [
          { "id": "beaker", "name": "Beaker", "feedback": "Not accurate enough" },
          { "id": "measuring-cylinder", "name": "Measuring Cylinder", "feedback": "Less accurate than a pipette" },
          { "id": "test-tube", "name": "Test Tube", "feedback": "Too small" },
          { "id": "volumetric-flask", "name": "Volumetric Flask", "feedback": "Used for making solutions, not titration" },
          { "id": "dropper", "name": "Dropper", "feedback": "Not precise enough" }
        ]
      },
      {
        "id": "exp_7",
        "title": "Crystallization of Salt",
        "gradeLevel": "8-9",
        "difficulty": "Intermediate",
        "learningObjective": "Evaporation technique to obtain pure crystals",
        "scenario": "You have a concentrated salt solution. Evaporate the water to get salt crystals.",
        "yourTask": "Prepare the setup to evaporate the solution.",
        "requiredApparatus": [
          { "id": "evaporating-dish", "name": "Evaporating Dish", "reason": "Wide and shallow for quick evaporation" },
          { "id": "bunsen-burner", "name": "Bunsen Burner", "reason": "Provides gentle heat" },
          { "id": "tripod-stand", "name": "Tripod Stand", "reason": "Supports the dish safely" }
        ],
        "incorrectSelections": [
          { "id": "test-tube", "name": "Test Tube", "feedback": "Too narrow" },
          { "id": "beaker", "name": "Beaker", "feedback": "Slower evaporation" },
          { "id": "conical-flask", "name": "Conical Flask", "feedback": "Narrow neck traps vapor" },
          { "id": "petri-dish", "name": "Petri Dish", "feedback": "Not suitable for heating" },
          { "id": "watch-glass", "name": "Watch Glass", "feedback": "Too small" }
        ]
      },
      {
        "id": "exp_8",
        "title": "Preparing a Standard Solution",
        "gradeLevel": "10",
        "difficulty": "Advanced",
        "learningObjective": "Precise solution preparation for quantitative analysis",
        "scenario": "You need to prepare a precise concentration of salt solution.",
        "yourTask": "Choose the correct glassware for a standard solution.",
        "requiredApparatus": [
          { "id": "beaker", "name": "Beaker", "reason": "For initial dissolving" },
          { "id": "volumetric-flask", "name": "Volumetric Flask", "reason": "Accurate 250 cm³ volume" },
          { "id": "stirring-rod", "name": "Stirring Rod", "reason": "Ensures complete dissolution" }
        ],
        "incorrectSelections": [
          { "id": "measuring-cylinder", "name": "Measuring Cylinder", "feedback": "Less accurate" },
          { "id": "conical-flask", "name": "Conical Flask", "feedback": "Not calibrated" },
          { "id": "test-tube", "name": "Test Tube", "feedback": "Too small" },
          { "id": "pipette", "name": "Pipette", "feedback": "For transferring only" },
          { "id": "burette", "name": "Burette", "feedback": "Not for making solutions" }
        ]
      },
      {
        "id": "exp_9",
        "title": "Testing pH of Solutions",
        "gradeLevel": "7-8",
        "difficulty": "Beginner",
        "learningObjective": "Understanding acids, bases, and pH indicators",
        "scenario": "You have three unknown solutions. Test their pH using universal indicator.",
        "yourTask": "Set up to test small samples of the solutions.",
        "requiredApparatus": [
          { "id": "test-tube", "name": "Test Tube", "reason": "Holds small samples" },
          { "id": "dropper", "name": "Dropper", "reason": "Adds indicator carefully" },
          { "id": "test-tube-rack", "name": "Test Tube Rack", "reason": "Organizes samples" }
        ],
        "incorrectSelections": [
          { "id": "beaker", "name": "Beaker", "feedback": "Wastes solution" },
          { "id": "conical-flask", "name": "Conical Flask", "feedback": "Too large" },
          { "id": "petri-dish", "name": "Petri Dish", "feedback": "Colors spread too much" },
          { "id": "pipette", "name": "Pipette", "feedback": "Dropper is simpler" },
          { "id": "measuring-cylinder", "name": "Measuring Cylinder", "feedback": "Not required" }
        ]
      },
      {
        "id": "exp_10",
        "title": "Displacement Reaction",
        "gradeLevel": "9-10",
        "difficulty": "Advanced",
        "learningObjective": "Observing reactivity series and metal displacement",
        "scenario": "You have blue copper sulfate solution. Add zinc pieces and observe the reaction.",
        "yourTask": "Select apparatus to safely handle and observe the metal reaction.",
        "requiredApparatus": [
          { "id": "beaker", "name": "Beaker", "reason": "Easy observation of color change" },
          { "id": "stirring-rod", "name": "Stirring Rod", "reason": "Mixes solution" },
          { "id": "tongs", "name": "Tongs", "reason": "Safe handling of metal" }
        ],
        "incorrectSelections": [
          { "id": "test-tube", "name": "Test Tube", "feedback": "Too narrow" },
          { "id": "evaporating-dish", "name": "Evaporating Dish", "feedback": "Too shallow" },
          { "id": "conical-flask", "name": "Conical Flask", "feedback": "Beaker gives better visibility" },
          { "id": "petri-dish", "name": "Petri Dish", "feedback": "Not deep enough" },
          { "id": "dropper", "name": "Dropper", "feedback": "You need tongs" }
        ]
      }
    ]
  };
  const apparatusIds = ["apparatus-1", "apparatus-2", "apparatus-3", "apparatus-4", "apparatus-5", "apparatus-6", "apparatus-7", "apparatus-8"];

  // -------------------------------------------------------------
  // 2. DOM ELEMENTS
  // -------------------------------------------------------------
  const group = document.getElementById("object-group");
  const svg = document.querySelector("svg");
  const clearButton = document.getElementById("clear-bench-btn");
  const checkSetupBtn = document.getElementById("check-setup-btn");
  const selectDropdown = document.getElementById('select-dropdown');
  const experimentGroup = document.getElementById("experiment-list");
  const defaultTextLabel = document.getElementById("default-text");
  const selectedExpContainer = document.getElementById("experiment-selected");
  const listOfExperiments = document.getElementById("list-of-experiments");
  const openDrop = document.getElementById("open-drop");
  const closeDrop = document.getElementById("close-drop");
  
  // Feedback Groups
  const selectedExpScenarioGroup = document.getElementById("selected-exp-scenario");
  const correctMessageGroup = document.getElementById("correct-message");
  const correctFeedbackText = document.getElementById("correct-feedback-msg");
  const incorrectMessageGroup = document.getElementById("incorrect-message");
  const incorrectMessageOnDropGroup = document.getElementById("incorrect-message-on-drop"); 
  const setupChecklistGroup = document.getElementById("setup-checklist");

  // State Variables
  let currentExperiment = null;
  let selectedElement = null;
  let offset = { x: 0, y: 0 };
  let placedApparatusIds = new Set(); 
  
  // Track the remove buttons (check marks) so we can clear them easily
  let activeRemoveButtons = {};

  // -------------------------------------------------------------
  // 3. INITIALIZATION
  // -------------------------------------------------------------
  group.innerHTML = "";
  
  // Hide UI elements initially
  if(selectedExpScenarioGroup) selectedExpScenarioGroup.style.display = 'none';
  if(correctMessageGroup) correctMessageGroup.style.display = 'none';
  if(incorrectMessageGroup) incorrectMessageGroup.style.display = 'none';
  if(incorrectMessageOnDropGroup) incorrectMessageOnDropGroup.style.display = 'none';
  if(setupChecklistGroup) setupChecklistGroup.style.display = 'none';

  // -------------------------------------------------------------
  // 4. HELPER FUNCTIONS
  // -------------------------------------------------------------
  function getCoordinates(evt) {
    const CTM = svg.getScreenCTM();
    let clientX, clientY;
    
    // Check if it's a touch event with active touches (start/move)
    if (evt.touches && evt.touches.length > 0) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    } 
    // Check if it's a touch event where fingers left (end/cancel) - use changedTouches
    else if (evt.changedTouches && evt.changedTouches.length > 0) {
      clientX = evt.changedTouches[0].clientX;
      clientY = evt.changedTouches[0].clientY;
    }
    // Fallback for mouse events
    else {
      clientX = evt.clientX;
      clientY = evt.clientY;
    }

    return {
      x: (clientX - CTM.e) / CTM.a,
      y: (clientY - CTM.f) / CTM.d
    };
  }

  function hideAllFeedback() {
    if(correctMessageGroup) correctMessageGroup.style.display = 'none';
    if(incorrectMessageGroup) incorrectMessageGroup.style.display = 'none';
    if(incorrectMessageOnDropGroup) incorrectMessageOnDropGroup.style.display = 'none';
    if(setupChecklistGroup) setupChecklistGroup.style.display = 'none';
  }

  function updateScenarioDisplay(exp) {
    if(!selectedExpScenarioGroup) return;
    selectedExpScenarioGroup.style.display = 'block';

    const foreignObject = selectedExpScenarioGroup.querySelector("foreignObject");
    if(foreignObject) {
      foreignObject.innerHTML = `
       <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px; padding:25px; box-sizing:border-box; color: black;">
          <h3 style="margin:0 0 25px 0; font-size:25px; color:black;">${exp.title} <span style="font-size=25px; font-weight:bold;"></span></h3>
          <p style="margin:0 0 10px 0;font-size:25px;color: black;"><b>Scenario:</b> ${exp.scenario}</p>
          <p style="margin:0;font-size:25px;color: black;"><b>Your Task:</b> ${exp.yourTask}</p>
        </div>
      `;
    }
  }

  function updateIncorrectDropMessage(text) {
    if (!incorrectMessageOnDropGroup) return;
    
    const foreignObject = incorrectMessageOnDropGroup.querySelector("foreignObject");
    if(foreignObject && foreignObject.firstElementChild) {
        const wrapper = foreignObject.firstElementChild; 
        const borderDiv = wrapper.firstElementChild;
        if(borderDiv) {
            const pillDiv = borderDiv.firstElementChild; 
            if(pillDiv && pillDiv.lastElementChild) {
                pillDiv.lastElementChild.textContent = text;
            }
        }
    }
  }

  // Logic to snap apparatus back to original position and remove it from placed set
  function removeApparatus(id) {
    const object = document.getElementById(id);
    const original = objectsData.find(d => d.id === id);
    
    if (object && original) {
      // 1. Snap back to original position
      object.setAttribute("x", original.x);
      object.setAttribute("y", original.y);
      
      // 2. Remove from placed set
      placedApparatusIds.delete(id);
      
      // 3. Remove the button itself
      if (activeRemoveButtons[id]) {
        activeRemoveButtons[id].remove();
        delete activeRemoveButtons[id];
      }
      
      // 4. Clear feedback since state changed
      hideAllFeedback();
    }
  }

  // Create the "Check Mark" (Remove Button) attached to the element
  function createRemoveButton(item, x, y) {
    // If a button already exists for this item, remove it first
    if (activeRemoveButtons[item.id]) {
      activeRemoveButtons[item.id].remove();
    }

    const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    // Position it at the top-right corner of the apparatus
    // Apparatus width is 208, so x + 170 places it nicely near the corner
    fo.setAttribute("x", x + 160); 
    fo.setAttribute("y", y -10);
    fo.setAttribute("width", "40");
    fo.setAttribute("height", "40");
    fo.style.overflow = "visible";
    // We add a prefix so we can distinguish buttons from apparatus in resetBench
    fo.setAttribute("id", `btn-${item.id}`);

    // Create container div
    const container = document.createElement("div");
    container.style.cursor = "pointer";
    
    // Insert User's HTML Layout
    container.innerHTML = `
      <div style="
        width: 33.4px;
        height: 33.4px;
        background: #007D00;
        border-radius: 50%;
        position: relative;
        flex-shrink: 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">
        <span style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: 18px;
          height: 4px;
          background: #ffffff;
          border-radius: 2px;
          transform: translate(-50%, -50%) rotate(45deg);
        "></span>
        <span style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: 18px;
          height: 4px;
          background: #ffffff;
          border-radius: 2px;
          transform: translate(-50%, -50%) rotate(-45deg);
        "></span>
      </div>
    `;

    // Add Click Listener to Snap Back
    container.addEventListener("click", (e) => {
      e.stopPropagation(); // Stop event bubbling to SVG
      e.preventDefault();
      removeApparatus(item.id);
    });
    
    // Add touch listener for button interaction
    container.addEventListener("touchstart", (e) => {
        e.stopPropagation(); // Stop event bubbling
        e.preventDefault(); // Prevent default touch behavior
        removeApparatus(item.id);
    }, {passive: false});
    
    // Prevent drag events on the button itself
    container.addEventListener("mousedown", (e) => e.stopPropagation());

    fo.appendChild(container);
    group.appendChild(fo); // Add to SVG group
    
    // Store reference
    activeRemoveButtons[item.id] = fo;
  }

  function resetBench() {
    Array.from(group.children).forEach(object => {
      // Don't move the buttons (foreignObjects starting with btn-)
      if(object.id && object.id.startsWith('btn-')) return;

      const original = objectsData.find(d => d.id === object.id);
      if (original) {
        object.setAttribute("x", original.x);
        object.setAttribute("y", original.y);
      }
    });

    // Clear all remove buttons
    Object.values(activeRemoveButtons).forEach(btn => btn.remove());
    activeRemoveButtons = {};

    placedApparatusIds.clear();
    hideAllFeedback();
  }

  function enableAllObjects() {
    Array.from(group.children).forEach(el => {
        // Skip buttons when enabling apparatus
        if(el.id && el.id.startsWith('btn-')) return;

        el.style.opacity = "1";
        el.style.cursor = "grab";
    });
  }

  // -------------------------------------------------------------
  // 5. RENDER EXPERIMENT LIST
  // -------------------------------------------------------------
  experimentsData.forEach((exp) => {
    const textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textNode.setAttribute("x", exp.x);
    textNode.setAttribute("y", exp.y);
    textNode.setAttribute("id", exp.id);
    textNode.setAttribute("font-size", "25");
    textNode.setAttribute("fill", "black");
    textNode.setAttribute("font-weight", "bold");
    textNode.setAttribute("cursor", "pointer");
    textNode.textContent = exp.name;

    const selectExperiment = () => {
      if (defaultTextLabel) {
        defaultTextLabel.style.opacity = '1';
        defaultTextLabel.textContent = exp.name;
      }

      currentExperiment = experimentDetails.experiments.find(e => e.id === exp.id);
      
       const maxSlots = currentExperiment.requiredApparatus.length;

      for (let i = 0; i < apparatusIds.length; i++) {
        const id = apparatusIds[i];
        const zone = document.getElementById(`${id}`);
        const zoneStroke = document.getElementById(`${id}-stroke`);
        const zoneText = document.getElementById(`${id}-text`);
        zone.style.strokeOpacity = "1"; 
        zoneStroke.style.strokeOpacity = "1";
        zoneText.setAttribute("display", "block");

        if (zone) {
          if(i > maxSlots - 1) {
            console.log("Hiding zone:", id);
            console.log("Hiding zone:", zone);
          zone.style.strokeOpacity = "0.1"; 
          zoneStroke.style.strokeOpacity = "0.1";
          zoneText.setAttribute("display", "none");

          }
        }
      }
      if (selectedExpContainer) {
        selectedExpContainer.innerHTML = "";
        const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        foreignObject.setAttribute("x", exp.x - 24);
        let selectedExpIndex = experimentsData.findIndex(e => e.id === exp.id);
        if (selectedExpIndex <= 5) {
          foreignObject.setAttribute("y", exp.y - 36);
        } else {
          foreignObject.setAttribute("y", exp.y - 40);
        }
        foreignObject.setAttribute("width", 525);
        foreignObject.setAttribute("height", 57);
        foreignObject.style.pointerEvents = "none";
        const img = document.createElement("img");
        img.src = "assets/start-selected.svg";
        img.style.width = "100%";
        img.style.height = "100%";
        foreignObject.appendChild(img);
        selectedExpContainer.appendChild(foreignObject);
      }

      updateScenarioDisplay(currentExperiment);
      
      listOfExperiments.style.display = 'none';
      openDrop.setAttribute('display', 'none');
      closeDrop.setAttribute('display', 'block');

      resetBench();
      enableAllObjects(); 
    };

    textNode.addEventListener("click", selectExperiment);
    textNode.addEventListener("touchstart", (e) => {
        e.preventDefault();
        selectExperiment();
    }, {passive: false});

    textNode.addEventListener("mouseenter", () => textNode.setAttribute("fill", "#555"));
    textNode.addEventListener("mouseleave", () => textNode.setAttribute("fill", "black"));

    if (experimentGroup) {
      experimentGroup.appendChild(textNode);
    } else {
      svg.appendChild(textNode);
    }
  });

  // -------------------------------------------------------------
  // 6. RENDER APPARATUS (OBJECTS)
  // -------------------------------------------------------------
  objectsData.forEach((item) => {
    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreignObject.setAttribute("x", item.x);
    foreignObject.setAttribute("y", item.y);
    foreignObject.setAttribute("width", 208);
    foreignObject.setAttribute("height", 165);
    foreignObject.setAttribute("id", item.id);
    
    // Initially disabled
    foreignObject.style.cursor = "not-allowed";
    foreignObject.style.opacity = "0.5";
    foreignObject.style.touchAction = "none"; // Important for touch dragging

    const img = document.createElement("img");
    img.src = item.path;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.pointerEvents = "none";
    img.setAttribute("draggable", "false");

    const startDrag = (evt) => {
      if (evt.cancelable) evt.preventDefault();
      
      if (!currentExperiment) return;

      hideAllFeedback();

      // NEW: If this object had a remove button, remove it now because we are moving the object
      if (activeRemoveButtons[foreignObject.id]) {
        activeRemoveButtons[foreignObject.id].remove();
        delete activeRemoveButtons[foreignObject.id];
      }

      selectedElement = foreignObject;
      foreignObject.style.cursor = "grabbing";
      
      const pos = getCoordinates(evt);
      offset.x = pos.x - parseFloat(selectedElement.getAttribute("x"));
      offset.y = pos.y - parseFloat(selectedElement.getAttribute("y"));
      group.appendChild(selectedElement); 
    };

    foreignObject.addEventListener("mousedown", startDrag);
    foreignObject.addEventListener("touchstart", startDrag, { passive: false });
    foreignObject.appendChild(img);
    group.appendChild(foreignObject);
  });

  // -------------------------------------------------------------
  // 7. DRAG HANDLERS
  // -------------------------------------------------------------
  const moveDrag = (evt) => {
    if (selectedElement) {
      // Prevent screen scrolling on touch devices while dragging
      if (evt.type === 'touchmove') {
          evt.preventDefault();
      }

      const pos = getCoordinates(evt);
      selectedElement.setAttribute("x", pos.x - offset.x);
      selectedElement.setAttribute("y", pos.y - offset.y);
    }
  };

  const endDrag = (evt) => {
    if (selectedElement) {
      selectedElement.style.cursor = "grab";
      const pos = getCoordinates(evt); // Updated getCoordinates handles touch end
      let snapped = false;
      const original = objectsData.find(d => d.id === selectedElement.id);
      
      const maxSlots = currentExperiment.requiredApparatus.length;

      for (let i = 0; i < apparatusIds.length; i++) {
        const id = apparatusIds[i];
        const zone = document.getElementById(id);
        
        if (zone) {
          const bbox = zone.getBBox();
          if (pos.x > bbox.x && pos.x < bbox.x + bbox.width &&
              pos.y > bbox.y && pos.y < bbox.y + bbox.height) {
            
            // Check if slot valid for this experiment
          

            if (i < maxSlots) {
                const finalX = bbox.x - 2;
                const finalY = bbox.y - 2;

                selectedElement.setAttribute("x", finalX);
                selectedElement.setAttribute("y", finalY);
                snapped = true;
                
                placedApparatusIds.add(selectedElement.id);

                // Add the Remove Button (Check Mark) here
                createRemoveButton(selectedElement, finalX, finalY);

                // Is this a required/correct item?
                const req = currentExperiment.requiredApparatus.find(a => a.id === selectedElement.id);
                
                if (req) {
                  // CORRECT: Show Green Feedback with Dynamic Reason
                  if(correctMessageGroup) {
                    correctMessageGroup.style.display = "block";
                    if(correctFeedbackText) {
                      // UPDATED: Uses the specific reason from experimentDetails
                      correctFeedbackText.textContent = `Good choice! ${req.reason}`;
                    }
                  }
                  if(incorrectMessageGroup) incorrectMessageGroup.style.display = 'none';
                  if(incorrectMessageOnDropGroup) incorrectMessageOnDropGroup.style.display = 'none';
                } else {
                   // INCORRECT: Show Floating Pill Feedback
                   let feedbackMsg = "Incorrect selection"; // Default fallback text

                   if (currentExperiment.incorrectSelections) {
                       const incorrectObj = currentExperiment.incorrectSelections.find(sel => sel.id === selectedElement.id);
                       if (incorrectObj && incorrectObj.feedback) {
                           feedbackMsg = incorrectObj.feedback;
                       }
                   }
                   
                   updateIncorrectDropMessage(feedbackMsg);

                   if(incorrectMessageOnDropGroup) incorrectMessageOnDropGroup.style.display = 'block';
                   if(incorrectMessageGroup) incorrectMessageGroup.style.display = 'none'; 
                   if(correctMessageGroup) correctMessageGroup.style.display = 'none';
                }
            } else {
                snapped = false; // Invalid slot
            }
            break; 
          }
        }
      }

      if (!snapped && original) {
        selectedElement.setAttribute("x", original.x);
        selectedElement.setAttribute("y", original.y);
        placedApparatusIds.delete(selectedElement.id);
      }
      
      selectedElement = null;
    }
  };

 // -------------------------------------------------------------
  // 8. CHECK SETUP VALIDATION & CHECKLIST RENDER
  // -------------------------------------------------------------
  if (checkSetupBtn) {
    checkSetupBtn.style.cursor = "pointer";
    
    const performCheck = (e) => {
        if(e && e.preventDefault) e.preventDefault();
        
        if (!currentExperiment) return;

        // When checking setup, hide the immediate drop feedback
        if(incorrectMessageOnDropGroup) incorrectMessageOnDropGroup.style.display = 'none';
        if(correctMessageGroup) correctMessageGroup.style.display = 'none';
  
        const requiredIds = currentExperiment.requiredApparatus.map(a => a.id);
        const placedArray = Array.from(placedApparatusIds);
  
        const missing = requiredIds.filter(id => !placedApparatusIds.has(id));
        const extra = placedArray.filter(id => !requiredIds.includes(id));
        
        const isCorrect = (missing.length === 0 && extra.length === 0);
  
        if (isCorrect) {
          // 1. Show Success Message Group
          if(correctMessageGroup) {
              correctMessageGroup.style.display = "block";
              if(correctFeedbackText) {
                  // UPDATED: Specific message for Check Setup completion
                  correctFeedbackText.textContent = "Experiment Complete! Your setup is correct";
              }
          }
  
          // 2. Show Checklist on Success
          renderChecklist(currentExperiment.requiredApparatus);
          setupChecklistGroup.style.display = 'block';
  
        } else {
          // Show the panel incorrect message and checklist
          if (incorrectMessageGroup) incorrectMessageGroup.style.display = 'block';
          renderChecklist(currentExperiment.requiredApparatus);
          setupChecklistGroup.style.display = 'block';
        }
    };

    checkSetupBtn.addEventListener("click", performCheck);
    checkSetupBtn.addEventListener("touchstart", performCheck, {passive: false});
  }

  function renderChecklist(requiredItems) {
    setupChecklistGroup.innerHTML = "";

    const startX = 680;
    const startY = 732; // Header Y
    
    const firstItemY = 795;
    const interval = 53;
    const circleX = 690;
    const textX = 710;
    const iconX = 960;

    // A. Add Header (Static)
    const header = document.createElementNS("http://www.w3.org/2000/svg", "image");
    header.setAttribute("href", "assets/header-setup.svg");
    header.setAttribute("x", startX);
    header.setAttribute("y", startY);
    header.setAttribute("width", "324");
    header.setAttribute("height", "76");
    setupChecklistGroup.appendChild(header);

    // B. Loop Required Items
    requiredItems.forEach((item, index) => {
        const isLast = index === requiredItems.length - 1;
        const currentY = firstItemY + (index * interval);

        // 1. Background Image
        const bg = document.createElementNS("http://www.w3.org/2000/svg", "image");
        if (isLast) {
            bg.setAttribute("href", "assets/bottom-setup.svg");
        } else {
            bg.setAttribute("href", "assets/mid-setup.svg");
        }
        bg.setAttribute("x", startX);
        if(isLast) {
            bg.setAttribute("y", currentY + 6);
        } else {
            bg.setAttribute("y", currentY);
        }
        bg.setAttribute("width", "324");
        bg.setAttribute("height", "76");
        setupChecklistGroup.appendChild(bg);

        // 2. Circle (Yellow Dot)
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const dotY = currentY + 31; 
        dot.setAttribute("cx", circleX + 4.5); 
        dot.setAttribute("cy", dotY); 
        dot.setAttribute("r", "4.5");
        dot.setAttribute("fill", "#FCD44A");
        setupChecklistGroup.appendChild(dot);

        // 3. Text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", textX);
        text.setAttribute("y", currentY + 43); 
        text.setAttribute("font-size", "25");
        text.setAttribute("fill", "black");
        text.textContent = item.name;
        setupChecklistGroup.appendChild(text);

        // 4. Icon (Tick / Not Tick)
        const isPlaced = placedApparatusIds.has(item.id);
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "image");
        icon.setAttribute("href", isPlaced ? "assets/tick.svg" : "assets/not-tick.svg");
        icon.setAttribute("x", iconX);
        icon.setAttribute("y", currentY + 20); 
        icon.setAttribute("width", "32.75");
        icon.setAttribute("height", "32.52");
        setupChecklistGroup.appendChild(icon);
    });
  }

  // -------------------------------------------------------------
  // 9. OTHER UI HANDLERS
  // -------------------------------------------------------------
  const resetHandler = (e) => {
      if(e && e.preventDefault) e.preventDefault();
      resetBench();
  };

  clearButton.addEventListener('click', resetHandler);
  clearButton.addEventListener('touchstart', resetHandler, {passive: false});

  selectDropdown.style.cursor = 'pointer';
  selectDropdown.addEventListener('click', (evt) => {
    evt.stopPropagation();
    toggleDropdown();
  });
  selectDropdown.addEventListener('touchstart', (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    toggleDropdown();
  }, {passive: false});

  defaultTextLabel.style.cursor = 'pointer';
  defaultTextLabel.addEventListener('click', (evt) => {
    evt.stopPropagation();
    toggleDropdown();
  });
  defaultTextLabel.addEventListener('touchstart', (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    toggleDropdown();
  }, {passive: false});

  function toggleDropdown() {
    if (listOfExperiments.style.display === 'none' || listOfExperiments.style.display === '') {
      listOfExperiments.style.display = 'block';
      openDrop.setAttribute('display', 'block');
      closeDrop.setAttribute('display', 'none');
      if (defaultTextLabel.textContent === 'Select your experiment') {
        defaultTextLabel.style.opacity = '0.28';
      }
    } else {
      listOfExperiments.style.display = 'none';
      defaultTextLabel.style.opacity = '1';
      openDrop.setAttribute('display', 'none');
      closeDrop.setAttribute('display', 'block');
    }
  }

  // -------------------------------------------------------------
  // 10. GLOBAL LISTENERS
  // -------------------------------------------------------------
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("touchmove", moveDrag, { passive: false });
  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchend", endDrag);
});