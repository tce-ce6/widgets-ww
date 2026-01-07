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
    activeSubject: document.getElementById("active-subject-text").querySelector("tspan"),
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
    minY: 194.5,
    snapPx: 41.5,
    barWidth: 60,
    handlePadding: 40,
    handleHeight: 60,
    gridSteps: 15,
    gridStepPx: 41.66
  };

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
});