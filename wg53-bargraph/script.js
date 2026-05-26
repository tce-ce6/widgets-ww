document.addEventListener("DOMContentLoaded", () => {
  const svg = document.querySelector("svg");
  const selectionStage = document.getElementById("selection-stage");

  // State
  let activities = [];
  let currentActivityIndex = 0;
  let currentScale = 50;
  let draggingBar = null; 

  // DOM Elements
  const els = {
    activityTitle: document.getElementById("activity-title").querySelector("tspan"),
    activityText: document.getElementById("curr-activity-text"),
    activeSubjectText: document.getElementById("active-subject-text").querySelector("tspan"),
    activeSubject: document.getElementById("active-subject"),
    activeBargraph: document.getElementById("active-bargraph"),
    xAxisLabels: document.querySelectorAll("#x-axis-labels text tspan"),
    dragLabels: document.querySelectorAll("#y-axis-drag-selectors text tspan"),
    btnNext: document.getElementById("btn-next"),
    btnPrev: document.getElementById("btn-previous"),
    yAxisGroup: document.getElementById("y-axis-labels"),
    dropdown: document.getElementById("scale-dropdown"),
    dropdownSelected: document.querySelector(".dropdown-selected"),
    dropdownOptions: document.querySelectorAll(".dropdown-options div"),
    barsContainer: document.getElementById("bars-container"),
    dropdownFO: document.getElementById("dropdwn-foreignobject"),
    // New Feedback and Control Elements
    btnSubmit: document.getElementById("btn-submit"),
    btnReset: document.getElementById("btn-reset"),
    correctFeedback: document.getElementById("correct-feedback-image"),
    incorrectFeedback: document.getElementById("incorrect-feedback-image")
  };

  const CONFIG = {
    baselineY: 880.5,
    snapPx: 41.5,
    barWidth: 60,
    handlePadding: 40,
    handleHeight: 60,
    gridSteps: 15,
    gridStepPx: 41.66
  };
  CONFIG.minY = CONFIG.baselineY - CONFIG.gridSteps * CONFIG.gridStepPx;

  // Helper to hide feedback
  function hideFeedback() {
    if (els.correctFeedback) els.correctFeedback.style.display = "none";
    if (els.incorrectFeedback) els.incorrectFeedback.style.display = "none";
  }

  function getSVGPoint(e) {
    const p = svg.createSVGPoint();
    if (e.touches && e.touches.length > 0) {
      p.x = e.touches[0].clientX;
      p.y = e.touches[0].clientY;
    } else {
      p.x = e.clientX;
      p.y = e.clientY;
    }
    const ctm = svg.getScreenCTM().inverse();
    return p.matrixTransform(ctm);
  }

  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      activities = data;
      renderActivity(currentActivityIndex);
      renderYAxis(currentScale);
    })
    .catch(err => console.error("Error loading data:", err));

  // Dropdown Logic
  els.dropdown.addEventListener("click", (e) => e.stopPropagation());

  els.dropdownSelected.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    const isOpen = els.dropdown.classList.toggle("open");
    if (els.dropdownFO) els.dropdownFO.setAttribute("height", isOpen ? "400" : "80");
    if (selectionStage) selectionStage.style.pointerEvents = isOpen ? "none" : "auto";
  });

  window.addEventListener("click", () => {
    if (els.dropdown.classList.contains("open")) {
      els.dropdown.classList.remove("open");
      if (els.dropdownFO) els.dropdownFO.setAttribute("height", "80");
      if (selectionStage) selectionStage.style.pointerEvents = "auto";
    }
  });

  els.dropdownOptions.forEach(opt => {
    opt.addEventListener("click", (e) => {
      const val = parseInt(opt.getAttribute("data-value"));
      currentScale = val;
      els.dropdownSelected.textContent = val;
      renderYAxis(currentScale);
      updateAllTooltips(); 
      els.dropdown.classList.remove("open");
      if (els.dropdownFO) els.dropdownFO.setAttribute("height", "80");
      if (selectionStage) selectionStage.style.pointerEvents = "auto";
      e.stopPropagation();
    });
  });

  function renderYAxis(scale) {
    els.yAxisGroup.innerHTML = "";
    for (let i = 0; i <= CONFIG.gridSteps; i++) {
      const val = i * scale;
      const y = CONFIG.baselineY - (i * CONFIG.gridStepPx);
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", 770);
      text.setAttribute("y", y + 10);
      text.setAttribute("fill", "black");
      text.setAttribute("font-family", "Roboto");
      text.setAttribute("font-size", "24");
      text.setAttribute("font-weight", "500");
      text.setAttribute("text-anchor", "end");
      text.textContent = val;
      els.yAxisGroup.appendChild(text);
    }
  }

  function updateAllTooltips() {
    bars.forEach(item => {
      const height = parseFloat(item.bar.getAttribute("height"));
      if (height > 0) {
        const val = Math.round((height / CONFIG.gridStepPx) * currentScale);
        item.tText.textContent = val;
      }
    });
  }

  // Navigation Logic
  els.btnNext.addEventListener("click", () => {
    if (currentActivityIndex < activities.length - 1) {
      currentActivityIndex++;
      renderActivity(currentActivityIndex);
    }
  });
  els.btnPrev.addEventListener("click", () => {
    if (currentActivityIndex > 0) {
      currentActivityIndex--;
      renderActivity(currentActivityIndex);
    }
  });

  // Submit and Reset Listeners
  if (els.btnSubmit) {
    els.btnSubmit.addEventListener("click", () => {
      const activity = activities[currentActivityIndex];
      if (!activity) return;

      let allCorrect = true;
      bars.forEach((item, i) => {
        const height = parseFloat(item.bar.getAttribute("height"));
        const currentVal = Math.round((height / CONFIG.gridStepPx) * currentScale);
        const targetVal = activity.categories[i].value;

        if (currentVal !== targetVal) {
          allCorrect = false;
        }
      });

      if (allCorrect) {
        if (els.correctFeedback) els.correctFeedback.style.display = "block";
        if (els.incorrectFeedback) els.incorrectFeedback.style.display = "none";
      } else {
        if (els.correctFeedback) els.correctFeedback.style.display = "none";
        if (els.incorrectFeedback) els.incorrectFeedback.style.display = "block";
      }
    });
  }

  if (els.btnReset) {
    els.btnReset.addEventListener("click", () => {
      resetBars();
      hideFeedback();
    });
  }

  function renderActivity(index) {
    const activity = activities[index];
    if (!activity) return;
    
    hideFeedback();
    els.activityTitle.textContent = activity.title;
    const tspans = els.activityText.querySelectorAll("tspan");
    activity.description.forEach((line, i) => {
      if (tspans[i]) tspans[i].textContent = line + (i < activity.description.length - 1 ? " " : "");
    });
    els.activeSubject.textContent = activity.subject;
    els.activeBargraph.textContent = activity.subject;
    if (activity.labels && activity.labels.length === 5) {
      activity.labels.forEach((label, i) => {
        if (els.xAxisLabels[i]) els.xAxisLabels[i].textContent = label;
        if (els.dragLabels[i]) els.dragLabels[i].textContent = label;
      });
    }

    const tableBody = document.getElementById("data-table-body");
    if (tableBody) {
      tableBody.innerHTML = "";
      const categoryBgColors = ["#ffdeb8", "#efc5fc", "#e3ffa2", "#ffd1d1", "#c5d1ff"];
      activity.categories.forEach((cat, i) => {
        const row = document.createElement("tr");
        const cellCategory = document.createElement("td");
        cellCategory.textContent = cat.label;
        cellCategory.style.backgroundColor = categoryBgColors[i] || "transparent";
        const cellValue = document.createElement("td");
        cellValue.textContent = cat.value;
        row.appendChild(cellCategory);
        row.appendChild(cellValue);
        tableBody.appendChild(row);
      });
    }
    resetBars();
    updateButtonState();
  }

  function updateButtonState() {
    els.btnPrev.style.opacity = currentActivityIndex === 0 ? "0.5" : "1";
    els.btnPrev.style.pointerEvents = currentActivityIndex === 0 ? "none" : "all";
    els.btnNext.style.opacity = currentActivityIndex === activities.length - 1 ? "0.5" : "1";
    els.btnNext.style.pointerEvents = currentActivityIndex === activities.length - 1 ? "none" : "all";
  }

  const columns = [
    { lineId: "Line_18", barColor: "#d16f00" },
    { lineId: "Line_19", barColor: "#ca53ef" },
    { lineId: "Line_20", barColor: "#90c31b" },
    { lineId: "Line_21", barColor: "#ff5757" },
    { lineId: "Line_22", barColor: "#405fd5" }
  ];

  const bars = [];

  columns.forEach((col, index) => {
    const line = document.getElementById(col.lineId);
    if (!line) return;
    const bbox = line.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const barX = centerX - CONFIG.barWidth / 2;

    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", barX);
    bar.setAttribute("y", CONFIG.baselineY);
    bar.setAttribute("width", CONFIG.barWidth);
    bar.setAttribute("height", 0);
    bar.setAttribute("fill", col.barColor);
    bar.style.cursor = "ns-resize";

    if (els.barsContainer) els.barsContainer.appendChild(bar);

    const handleLine = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    // handleLine.setAttribute("x", barX);
    // handleLine.setAttribute("y", CONFIG.baselineY - 2);
    // handleLine.setAttribute("width", CONFIG.barWidth);
    // handleLine.setAttribute("height", 4);
    // handleLine.setAttribute("fill", "red");
    // handleLine.style.cursor = "ns-resize";
    
    if (els.barsContainer) els.barsContainer.appendChild(handleLine);

    const barTooltip = document.createElementNS("http://www.w3.org/2000/svg", "g");
    barTooltip.style.display = "none";
    barTooltip.style.pointerEvents = "none";
    const tRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    tRect.setAttribute("width", 80);
    tRect.setAttribute("height", 40);
    tRect.setAttribute("fill", "white");
    tRect.setAttribute("stroke", "#ccc");
    tRect.setAttribute("rx", 5);
    const tText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tText.setAttribute("x", 40);
    tText.setAttribute("y", 25);
    tText.setAttribute("text-anchor", "middle");
    tText.setAttribute("font-family", "Roboto");
    tText.setAttribute("font-size", "20");
    tText.setAttribute("fill", "black");
    barTooltip.appendChild(tRect);
    barTooltip.appendChild(tText);
    
    if (els.barsContainer) els.barsContainer.appendChild(barTooltip);

    const barObj = { bar, handleLine, barTooltip, tText, index, centerX };
    bars.push(barObj);

    const manualStart = (e) => {
      draggingBar = barObj;
      barTooltip.style.display = "block";
      hideFeedback(); // Hide feedback when user starts adjusting
    };
    bar.addEventListener("mousedown", manualStart);
    bar.addEventListener("touchstart", manualStart, { passive: false });
    handleLine.addEventListener("mousedown", manualStart);
    handleLine.addEventListener("touchstart", manualStart, { passive: false });

    const colGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (let i = 1; i <= CONFIG.gridSteps; i++) {
      const stepY = CONFIG.baselineY - (i * CONFIG.gridStepPx);
      const blueLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      blueLine.setAttribute("x1", centerX - 30);
      blueLine.setAttribute("x2", centerX + 30);
      blueLine.setAttribute("y1", stepY);
      blueLine.setAttribute("y2", stepY);
      blueLine.setAttribute("stroke", "#2195f3ff");
      blueLine.setAttribute("stroke-width", "2");
      blueLine.setAttribute("opacity", "0.3");

      const target = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      target.setAttribute("x", centerX - 80); 
      target.setAttribute("y", stepY);
      target.setAttribute("width", 160);
      target.setAttribute("height", CONFIG.gridStepPx);
      target.setAttribute("fill", "transparent");
      target.style.cursor = "pointer";

      const startInteraction = (e) => {
        const val = i * currentScale;
        bar.setAttribute("y", stepY);
        bar.setAttribute("height", CONFIG.baselineY - stepY);
        handleLine.setAttribute("y", stepY - 2);
        barTooltip.style.display = "block";
        barTooltip.setAttribute("transform", `translate(${centerX - 40}, ${stepY - 50})`);
        tText.textContent = val;
        blueLine.setAttribute("opacity", "1");
        setTimeout(() => blueLine.setAttribute("opacity", "0.3"), 500);
        draggingBar = barObj; 
        hideFeedback(); // Hide feedback on click interaction
      };

      target.addEventListener("mousedown", startInteraction);
      target.addEventListener("touchstart", (e) => startInteraction(e), { passive: false });
      colGroup.appendChild(blueLine);
      colGroup.appendChild(target);
    }

    if (selectionStage) selectionStage.appendChild(colGroup);
    else svg.appendChild(colGroup);
  });

  const handleMove = (e) => {
    if (!draggingBar) return;
    if (e.type === "touchmove") e.preventDefault();
    const pt = getSVGPoint(e);
    let newY = pt.y;
    if (newY < CONFIG.minY) newY = CONFIG.minY;
    if (newY > CONFIG.baselineY) newY = CONFIG.baselineY;
    const height = CONFIG.baselineY - newY;
    const val = Math.round((height / CONFIG.gridStepPx) * currentScale);
    draggingBar.bar.setAttribute("y", newY);
    draggingBar.bar.setAttribute("height", height);
    draggingBar.handleLine.setAttribute("y", newY - 2);
    draggingBar.barTooltip.style.display = "block";
    draggingBar.barTooltip.setAttribute("transform", `translate(${draggingBar.centerX - 40}, ${newY - 50})`);
    draggingBar.tText.textContent = val;
  };

  const endInteraction = () => { draggingBar = null; };

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("touchmove", handleMove, { passive: false });
  window.addEventListener("mouseup", endInteraction);
  window.addEventListener("touchend", endInteraction);

  function resetBars() {
    bars.forEach(item => {
      item.bar.setAttribute("height", 0);
      item.bar.setAttribute("y", CONFIG.baselineY);
      item.handleLine.setAttribute("y", CONFIG.baselineY - 2);
      item.barTooltip.style.display = "none";
    });
  }











// // --- CLEAN SHOW ANSWER LOGIC ---
// const showAnswerButton = document.getElementById("btn-show-answer");
// const answerOverlay    = document.getElementById("show-answer-foreign-object");
// const closeButton      = document.getElementById("show-answer-close-btn");

// if (showAnswerButton && answerOverlay && closeButton) {
    
//     showAnswerButton.addEventListener("click", function() {
//         // Ensure overlay is visible before drawing
//         answerOverlay.style.visibility = "visible";   
//         answerOverlay.style.display = "block";  
        
//         // Use a small timeout to ensure the DOM has updated the visibility
//         // before we try to calculate and draw the SVG contents
//         setTimeout(() => {
//             buildRealAnswerGraph();
//         }, 50);
        
//         console.log("Show Answer clicked → Drawing graph with visible grid lines");
//     });

//     closeButton.addEventListener("click", function() {
//         answerOverlay.style.visibility = "hidden";    
//         answerOverlay.style.display = "none";         
//     });
// }

// function buildRealAnswerGraph() {
//     const svg = document.getElementById("real-answer-svg");
//     const activity = activities[currentActivityIndex];
//     if (!svg || !activity) return;

//     // Completely clear the SVG before redrawing
//     svg.innerHTML = ""; 
    
//     const w = 970;
//     const h = 630;
//     const margin = { top: 40, right: 30, bottom: 90, left: 100 }; 
//     const chartW = w - margin.left - margin.right;
//     const chartH = h - margin.top - margin.bottom;

//     // Create a main group for the chart
//     const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
//     g.setAttribute("transform", `translate(${margin.left}, ${margin.top})`);
//     svg.appendChild(g);

//     const steps = CONFIG.gridSteps; 

//     // --- STEP 1: DRAW GRID LINES (MUST BE FIRST TO BE IN BACKGROUND) ---
//     for (let i = 0; i <= steps; i++) {
//         const y = chartH - (i * (chartH / steps));
        
//         // Horizontal Grid Line
//         const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//         line.setAttribute("x1", 0); 
//         line.setAttribute("x2", chartW);
//         line.setAttribute("y1", y); 
//         line.setAttribute("y2", y);
//         // Using a darker gray so they are definitely visible against the white background
//         line.setAttribute("stroke", "#cccccc"); 
//         line.setAttribute("stroke-width", "1.5");
//         g.appendChild(line);

//         // Y-Axis Labels
//         const labelY = document.createElementNS("http://www.w3.org/2000/svg", "text");
//         labelY.setAttribute("x", -15);
//         labelY.setAttribute("y", y + 6);
//         labelY.setAttribute("text-anchor", "end");
//         labelY.style.font = "bold 20px sans-serif";
//         labelY.style.fill = "#444";
//         labelY.textContent = i * currentScale;
//         g.appendChild(labelY);
//     }

//     // --- STEP 2: DRAW BARS & X-AXIS LABELS (FOREGROUND) ---
//     const barAreaWidth = chartW / activity.categories.length;
//     activity.categories.forEach((cat, i) => {
//         const barHeight = (cat.value / (steps * currentScale)) * chartH;
        
//         // Draw the Bar
//         const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//         rect.setAttribute("x", i * barAreaWidth + (barAreaWidth * 0.25));
//         rect.setAttribute("y", chartH - barHeight);
//         rect.setAttribute("width", barAreaWidth * 0.5);
//         rect.setAttribute("height", barHeight);
//         rect.setAttribute("fill", columns[i].barColor);
//         rect.setAttribute("rx", "5");
//         // Ensure bars are opaque so they cover grid lines behind them
//         rect.setAttribute("fill-opacity", "1"); 
//         g.appendChild(rect);

//         // Category Name Label (X-Axis)
//         const xText = document.createElementNS("http://www.w3.org/2000/svg", "text");
//         xText.setAttribute("x", i * barAreaWidth + (barAreaWidth / 2));
//         xText.setAttribute("y", chartH + 45); 
//         xText.setAttribute("text-anchor", "middle");
//         xText.style.font = "bold 22px sans-serif";
//         xText.style.fill = "#000";
//         xText.textContent = cat.label; 
//         g.appendChild(xText);
//     });

//     // --- STEP 3: MAIN AXIS LINES (THE L-SHAPE) ---
//     const axis = document.createElementNS("http://www.w3.org/2000/svg", "path");
//     axis.setAttribute("d", `M 0 0 L 0 ${chartH} L ${chartW} ${chartH}`);
//     axis.setAttribute("stroke", "#000");
//     axis.setAttribute("stroke-width", "3");
//     axis.setAttribute("fill", "none");
//     g.appendChild(axis);
// }

// // Simple bridge function
// function drawAnswerGraph() {
//     buildRealAnswerGraph();
// }

// }); // Final end of DOMContentLoaded



// --- CLEAN SHOW ANSWER LOGIC ---
const showAnswerButton = document.getElementById("btn-show-answer");
const answerOverlay    = document.getElementById("show-answer-foreign-object");
const closeButton      = document.getElementById("show-answer-close-btn");

if (showAnswerButton && answerOverlay && closeButton) {
    showAnswerButton.addEventListener("click", function() {
        answerOverlay.style.visibility = "visible";   
        answerOverlay.style.display = "block";  
        setTimeout(() => buildRealAnswerGraph(), 50);
        
        if (els.btnNext) {
            els.btnNext.style.pointerEvents = "none";
            els.btnNext.style.opacity = "0.5";
        }
        if (els.btnPrev) {
            els.btnPrev.style.pointerEvents = "none";
            els.btnPrev.style.opacity = "0.5";
        }
    });

    closeButton.addEventListener("click", function() {
        answerOverlay.style.visibility = "hidden";    
        answerOverlay.style.display = "none";         
        
        if (typeof updateButtonState === "function") {
            updateButtonState();
        }
    });
}

// Map per-activity scale for the "Show Answer" modal.
// Activity 1 -> 50, Activity 2 -> 20, Activity 3 -> 10; fallback to 50 for any others.
function getAnswerScaleForActivity(index) {
    if (index === 0) return 50;
    if (index === 1) return 20;
    if (index === 2) return 10;
    return 50;
}

function buildRealAnswerGraph() {
    const svg = document.getElementById("real-answer-svg");
    const activity = activities[currentActivityIndex];
    if (!svg || !activity) return;

    svg.innerHTML = ""; 
    
    const w = 970;
    const h = 630;
    // Margin standard rakha hai taaki title andar fit ho sake
    const margin = { top: 60, right: 30, bottom: 90, left: 100 }; 
    const chartW = w - margin.left - margin.right;
    const chartH = h - margin.top - margin.bottom;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${margin.left}, ${margin.top})`);
    svg.appendChild(g);

    // --- STEP 1: DENSE MILLIMETER GRID (Drawing first so title is on top) ---
    const totalUnits = 150; 
    const unitSizeH = chartH / totalUnits;
    const unitSizeW = chartW / totalUnits;
    const fixedAnswerScale = getAnswerScaleForActivity(currentActivityIndex);

    for (let i = 0; i <= totalUnits; i++) {
        const y = chartH - (i * unitSizeH);
        const x = i * unitSizeW;

        const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hLine.setAttribute("x1", 0); hLine.setAttribute("x2", chartW);
        hLine.setAttribute("y1", y); hLine.setAttribute("y2", y);

        const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        vLine.setAttribute("x1", x); vLine.setAttribute("x2", x);
        vLine.setAttribute("y1", 0); vLine.setAttribute("y2", chartH);

        if (i % 10 === 0) {
            hLine.setAttribute("stroke", "#a0aec0"); vLine.setAttribute("stroke", "#a0aec0");
            hLine.setAttribute("stroke-width", "1.2"); vLine.setAttribute("stroke-width", "1.2");
            
            const stepIndex = i / 10;
            if (stepIndex <= CONFIG.gridSteps) {
                const labelY = document.createElementNS("http://www.w3.org/2000/svg", "text");
                labelY.setAttribute("x", -15);
                labelY.setAttribute("y", y + 6);
                labelY.setAttribute("text-anchor", "end");
                labelY.style.font = "bold 18px sans-serif";
                labelY.style.fill = "#444";
                labelY.textContent = stepIndex * fixedAnswerScale;
                g.appendChild(labelY);
            }
        } else if (i % 5 === 0) {
            hLine.setAttribute("stroke", "#cbd5e0"); vLine.setAttribute("stroke", "#cbd5e0");
            hLine.setAttribute("stroke-width", "0.8"); vLine.setAttribute("stroke-width", "0.8");
        } else {
            hLine.setAttribute("stroke", "#edf2f7"); vLine.setAttribute("stroke", "#edf2f7");
            hLine.setAttribute("stroke-width", "0.4"); vLine.setAttribute("stroke-width", "0.4");
        }
        g.appendChild(hLine);
        g.appendChild(vLine);
    }

    // --- STEP 2: SMALLER SOLID BLUE TITLE BOX (Inside the Grid Area) ---
    if (activity.subject) {
        const titleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        const titleRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        titleRect.setAttribute("fill", "#87CEEB"); // Solid Sky Blue
        titleRect.setAttribute("rx", "10"); 
        titleRect.setAttribute("height", "32"); // Height thodi kam ki hai (pehle 40 thi)
        titleRect.setAttribute("fill-opacity", "1"); 
        
        const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        titleText.textContent = activity.subject; 
        titleText.style.font = "bold 18px sans-serif"; // Font size thoda chhota kiya
        titleText.style.fill = "#000";
        titleText.setAttribute("text-anchor", "middle");

        titleGroup.appendChild(titleRect);
        titleGroup.appendChild(titleText);
        g.appendChild(titleGroup);

        const textLength = activity.subject.length;
        const estimatedWidth = textLength * 11 + 30; // Width adjust ki hai smaller font ke liye
        titleRect.setAttribute("width", estimatedWidth);
        titleRect.setAttribute("x", (chartW / 2) - (estimatedWidth / 2));
        
        // Isse title grid area ke bilkul andar top par set ho jayega
        titleRect.setAttribute("y", 10); 
        titleText.setAttribute("x", chartW / 2);
        titleText.setAttribute("y", 32); 
    }

    // --- STEP 3: BALANCED SOLID BARS ---
    const barAreaWidth = chartW / activity.categories.length;
    activity.categories.forEach((cat, i) => {
        const barHeight = (cat.value / (CONFIG.gridSteps * fixedAnswerScale)) * chartH;
        const adjustedWidth = barAreaWidth * 0.4; 
        const offsetX = (barAreaWidth - adjustedWidth) / 2;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", i * barAreaWidth + offsetX);
        rect.setAttribute("y", chartH - barHeight);
        rect.setAttribute("width", adjustedWidth);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", columns[i].barColor);
        rect.setAttribute("rx", "4"); 
        g.appendChild(rect);

        const xText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        xText.setAttribute("x", i * barAreaWidth + (barAreaWidth / 2));
        xText.setAttribute("y", chartH + 45); 
        xText.setAttribute("text-anchor", "middle");
        xText.style.font = "bold 20px sans-serif";
        xText.style.fill = "#333";
        xText.textContent = cat.label; 
        g.appendChild(xText);
    });

    const axis = document.createElementNS("http://www.w3.org/2000/svg", "path");
    axis.setAttribute("d", `M 0 0 L 0 ${chartH} L ${chartW} ${chartH}`);
    axis.setAttribute("stroke", "#2d3748");
    axis.setAttribute("stroke-width", "3");
    axis.setAttribute("fill", "none");
    g.appendChild(axis);
}
// Ensure safety if other parts of the script call the alternate function name
function drawAnswerGraph() {
    buildRealAnswerGraph();
}

}); // END OF DOMContentLoaded
