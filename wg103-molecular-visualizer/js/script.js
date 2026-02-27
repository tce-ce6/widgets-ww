document.addEventListener("DOMContentLoaded", () => {
 
  // State
  let moleculeCount = 1;
  let currentSubstance = "Water";
  let currentSource = "River";
  let predH = 0;
  let predO = 0;
  let currentScreen = 1;
  let isPredictionLocked = false;

  const substances = {
    Water: {
      formula: "H2O",
      elementH: "Hydrogen",
      elementO: "Oxygen",
      ratioH: 2,
      ratioO: 1,
      massH: 1,
      massO: 16,
      massRatio: "1:8",
      sources: ["River", "Sea", "Rain", "Well"],
      sampleTitle: "Water Sample",
      sourceTitle: "Water Source",
    },
    Ammonia: {
      formula: "NH3",
      elementH: "Nitrogen",
      elementO: "Hydrogen",
      ratioH: 1,
      ratioO: 3,
      massH: 14,
      massO: 1,
      massRatio: "14:3",
      sources: ["Laboratory", "Industrial", "Natural", "Synthetic"],
      sampleTitle: "Ammonia Sample",
      sourceTitle: "Ammonia Source",
    },
  };

  // DOM Elements - Screen 1
  const molCountDisplay = document.getElementById("mol_count_display");
  const molPlusBtn = document.getElementById("mol_plus_btn");
  const molMinusBtn = document.getElementById("mol_minus_btn");

  const sourceBtnElements = {
    btns: [
      document.getElementById("source_river_btn"),
      document.getElementById("source_sea_btn"),
      document.getElementById("source_rain_btn"),
      document.getElementById("source_well_btn"),
    ],
    getBtn(index) {
      return this.btns[index];
    },
  };

  // Dropdown Elements
  const substanceDropdownBtn = document.getElementById(
    "substance_selection_btn",
  );
  const substanceDropdownList = document.getElementById(
    "substance_dropdown_list",
  );
  const currentSubstanceText = document.getElementById(
    "current_substance_text",
  );
  const substanceOptionWater = document.getElementById(
    "substance_option_water",
  );
  const substanceOptionAmmonia = document.getElementById(
    "substance_option_ammonia",
  );

  // Dynamic Labels
  const predLabelH = document.getElementById("pred_label_h");
  const predLabelO = document.getElementById("pred_label_o");
  const sourcePanelTitle = document.getElementById("source_panel_title");
  const sampleTitleText = document.getElementById("sample_title_text");
  const resultLabelH = document.getElementById("result_label_h");
  const resultLabelO = document.getElementById("result_label_o");
  const tableLabelH = document.getElementById("table_label_h");
  const tableLabelO = document.getElementById("table_label_o");
  const actualResultLabelH = document.getElementById("actual_result_label_h");
  const actualResultLabelO = document.getElementById("actual_result_label_o");

  const predHDisplay = document.querySelector("#pred_h_display tspan");
  const predODisplay = document.querySelector("#pred_o_display tspan");
  const predHUp = document.getElementById("pred_h_up");
  const predHDown = document.getElementById("pred_h_down");
  const predOUp = document.getElementById("pred_o_up");
  const predODown = document.getElementById("pred_o_down");

  const breakApartBtn = document.getElementById("break_apart_btn");
  const resetBtn = document.getElementById("reset_btn");
  const insightBtn = document.getElementById("insight_btn");
  const insightPanel = document.getElementById("insight_panel");
  const closeInsightBtn = document.getElementById("Group_579");

  // Groups for Screen management
  const scr01Panels = [
    "scr01-feedback_panel",
    "scr01-predict_panel",
    "scr01-sample_panel",
    "scr01-no_of_molecules_panel",
    "i-text",
    "break_apart_btn",
    "substance_dropdown_area",
  ].map((id) => document.getElementById(id));

  const predictPanel = document.getElementById("scr01-predict_panel");
  const predictPanelTitle = document.getElementById("predict_panel_title");
  const lockPredictionBtn = document.getElementById("id_lock_prediction_btn");
  const lockPredictionText = document.getElementById("lock_prediction_text");
  const lockIconLocked = document.getElementById("lock_icon_locked");
  const lockIconUnlocked = document.getElementById("lock_icon_unlocked");

  const scr02Panels = [
    "scr02-elements",
    "scr02-comparison_panel",
    "scr02-insight_box",
  ].map((id) => document.getElementById(id));

  // Result Displays - Screen 2
  const actualHCount = document.querySelector("#actual_h_count tspan");
  const actualHMass = document.querySelector("#actual_h_mass tspan");
  const actualOCCount = document.querySelector("#actual_o_count tspan");
  const actualOMass = document.querySelector("#actual_o_mass tspan");
  const summaryMassRatio = document.querySelector(
    "#summary_mass_ratio text:nth-child(2) tspan",
  );
  const insightEquation = document.getElementById("insight_equation");
  const insightRatio = document.getElementById("insight_ratio");

  // Table Actual/Predicted
  const tablePredH = document.querySelector("#_3 tspan");
  const tablePredO = document.querySelector("#_3-2 tspan");
  const tableActualH = document.querySelector("#_12 tspan");
  const tableActualO = document.querySelector("#_6 tspan");

  // Feedback Text
  const msgRow1 = document.getElementById("feedback_msg_line1");
  const msgRow2 = document.getElementById("feedback_msg_line2");
  let feedbackTimeout = null;

  function showFeedback(line1, line2, duration = 3000) {
    if (feedbackTimeout) clearTimeout(feedbackTimeout);
    if (msgRow1) msgRow1.textContent = line1;
    if (msgRow2) msgRow2.textContent = line2;

    if (duration > 0) {
      feedbackTimeout = setTimeout(() => {
        if (currentScreen === 1) {
          if (msgRow1) msgRow1.textContent = "Try different molecule counts ";
          if (msgRow2) msgRow2.textContent = "and sources to verify the law!";
        }
      }, duration);
    }
  }

  function updateUI() {
    const data = substances[currentSubstance];

    // Screen management
    scr01Panels.forEach(
      (p) => p && (p.style.display = currentScreen === 1 ? "block" : "none"),
    );
    scr02Panels.forEach(
      (p) => p && (p.style.display = currentScreen === 2 ? "block" : "none"),
    );

    // Prediction Panel is always visible but changed in Screen 2
    if (predictPanel) predictPanel.style.display = "block";

    if (currentScreen === 1) {
      if (predictPanelTitle)
        predictPanelTitle.textContent = "Predict Before Breaking";
      if (lockPredictionBtn) lockPredictionBtn.style.display = "block";
      // User prediction symbols
      if (predHDisplay) predHDisplay.textContent = predH === 0 ? "?" : predH;
      if (predODisplay) predODisplay.textContent = predO === 0 ? "?" : predO;
    } else {
      // Screen 2: Reveal the truth
      if (predictPanelTitle)
        predictPanelTitle.textContent = "Actual Composition";
      if (lockPredictionBtn) lockPredictionBtn.style.display = "none";

      const totalH = moleculeCount * data.ratioH;
      const totalO = moleculeCount * data.ratioO;
      if (predHDisplay) predHDisplay.textContent = totalH;
      if (predODisplay) predODisplay.textContent = totalO;

      // Sync mass ratio if we are in screen 2
      if (summaryMassRatio) summaryMassRatio.textContent = data.massRatio;
    }

    // Substance Dynamic Labels
    if (currentSubstanceText)
      currentSubstanceText.textContent = `${currentSubstance} (${data.formula})`;
    if (predLabelH) predLabelH.textContent = `${data.elementH} atoms:`;
    if (predLabelO) predLabelO.textContent = `${data.elementO} atoms:`;
    if (sourcePanelTitle) sourcePanelTitle.textContent = data.sourceTitle;
    if (sampleTitleText) sampleTitleText.textContent = data.sampleTitle;
    if (resultLabelH) resultLabelH.textContent = `${data.elementH} Atoms`;
    if (resultLabelO) resultLabelO.textContent = `${data.elementO} Atoms`;
    if (tableLabelH) tableLabelH.textContent = data.elementH;
    if (tableLabelO) tableLabelO.textContent = data.elementO;
    if (actualResultLabelH) actualResultLabelH.textContent = data.elementH;
    if (actualResultLabelO) actualResultLabelO.textContent = data.elementO;

    // Source buttons labels
    sourceBtnElements.btns.forEach((btn, i) => {
      if (btn) {
        const textElement = btn.querySelector("tspan");
        if (textElement) textElement.textContent = data.sources[i];
        btn.style.opacity = currentSource === data.sources[i] ? "1" : "0.5";
        btn.style.cursor = "pointer";
      }
    });

    // Prediction Lock Visuals
    if (lockPredictionText) {
      lockPredictionText.textContent = isPredictionLocked
        ? "Unlock Prediction"
        : "Lock Prediction";
    }
    if (lockIconLocked)
      lockIconLocked.style.display = isPredictionLocked ? "none" : "block";
    if (lockIconUnlocked)
      lockIconUnlocked.style.display = isPredictionLocked ? "block" : "none";

    // Disable/Enable Prediction adjustments
    [predHUp, predHDown, predOUp, predODown].forEach((btn) => {
      if (btn) {
        btn.style.opacity = isPredictionLocked ? "0.5" : "1";
        btn.style.pointerEvents = isPredictionLocked ? "none" : "auto";
      }
    });

    // Molecule Count
    if (molCountDisplay)
      molCountDisplay.querySelector("tspan").textContent = moleculeCount;

    const sampleMolCount = document.getElementById("sample_mol_count");
    if (sampleMolCount) {
      sampleMolCount.querySelector("tspan").textContent = `${moleculeCount} ${
        moleculeCount === 1 ? "Molecule" : "Molecules"
      }`;
    }

    // Atom sample display (SVG logic for 1 molecule)
    const sampleMolecule = document.getElementById("Group_1241");
    if (sampleMolecule) {
      // Color coding for Oxygen/Nitrogen
      const bigAtomCircle = sampleMolecule.querySelector("path");
      if (bigAtomCircle) {
        bigAtomCircle.setAttribute(
          "fill",
          currentSubstance === "Water" ? "#089b9f" : "#d93c76",
        );
      }
    }
  }

  // Event Listeners
  if (molPlusBtn) {
    molPlusBtn.style.cursor = "pointer";
    molPlusBtn.addEventListener("click", () => {
      if (moleculeCount < 15) {
        moleculeCount++;
        updateUI();
      }
    });
  }

  if (molMinusBtn) {
    molMinusBtn.style.cursor = "pointer";
    molMinusBtn.addEventListener("click", () => {
      if (moleculeCount > 1) {
        moleculeCount--;
        updateUI();
      }
    });
  }

  // Source selections
  sourceBtnElements.btns.forEach((btn, i) => {
    if (btn) {
      btn.addEventListener("click", () => {
        currentSource = substances[currentSubstance].sources[i];
        updateUI();
      });
    }
  });

  // Dropdown listeners
  if (substanceDropdownBtn) {
    substanceDropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = substanceDropdownList.style.display === "block";
      substanceDropdownList.style.display = isVisible ? "none" : "block";
    });
  }

  document.addEventListener("click", () => {
    if (substanceDropdownList) substanceDropdownList.style.display = "none";
  });

  if (substanceOptionWater) {
    substanceOptionWater.addEventListener("click", () => {
      setSubstance("Water");
    });
  }

  if (substanceOptionAmmonia) {
    substanceOptionAmmonia.addEventListener("click", () => {
      setSubstance("Ammonia");
    });
  }

  function setSubstance(sub) {
    currentSubstance = sub;
    currentSource = substances[sub].sources[0];
    predH = 0;
    predO = 0;
    isPredictionLocked = false;
    if (substanceDropdownList) substanceDropdownList.style.display = "none";

    if (currentScreen === 2) {
      calculateResults(); // Refresh Screen 2 if already there
    }
    updateUI();
  }

  // Prediction listeners
  if (predHUp) {
    predHUp.style.cursor = "pointer";
    predHUp.addEventListener("click", () => {
      if (isPredictionLocked) return;
      predH++;
      updateUI();
    });
  }
  if (predHDown) {
    predHDown.style.cursor = "pointer";
    predHDown.addEventListener("click", () => {
      if (isPredictionLocked) return;
      if (predH > 0) predH--;
      updateUI();
    });
  }
  if (predOUp) {
    predOUp.style.cursor = "pointer";
    predOUp.addEventListener("click", () => {
      if (isPredictionLocked) return;
      predO++;
      updateUI();
    });
  }
  if (predODown) {
    predODown.style.cursor = "pointer";
    predODown.addEventListener("click", () => {
      if (isPredictionLocked) return;
      if (predO > 0) predO--;
      updateUI();
    });
  }

  if (lockPredictionBtn) {
    lockPredictionBtn.style.cursor = "pointer";
    lockPredictionBtn.addEventListener("click", () => {
      isPredictionLocked = !isPredictionLocked;
      updateUI();
    });
  }

  if (breakApartBtn) {
    breakApartBtn.style.cursor = "pointer";
    breakApartBtn.addEventListener("click", () => {
      // Validation: predict at least one atom
      if (predH === 0 && predO === 0) {
        showFeedback("Predict Before Breaking!", "");
        return;
      }
      currentScreen = 2;
      calculateResults();
      updateUI();
    });
  }

  if (resetBtn) {
    resetBtn.style.cursor = "pointer";
    resetBtn.addEventListener("click", () => {
      moleculeCount = 1;
      setSubstance("Water");
      currentScreen = 1;
      if (insightPanel) insightPanel.style.display = "none";
      updateUI();
    });
  }

  if (insightBtn) {
    insightBtn.style.cursor = "pointer";
    insightBtn.addEventListener("click", () => {
      if (insightPanel) insightPanel.style.display = "block";
    });
  }

  if (closeInsightBtn) {
    closeInsightBtn.style.cursor = "pointer";
    closeInsightBtn.addEventListener("click", () => {
      if (insightPanel) insightPanel.style.display = "none";
    });
  }

  function calculateResults() {
    const data = substances[currentSubstance];
    const totalH = moleculeCount * data.ratioH;
    const totalO = moleculeCount * data.ratioO;
    const massH = totalH * data.massH;
    const massO = totalO * data.massO;

    if (actualHCount) actualHCount.textContent = `${totalH} molecules`;
    if (actualHMass) actualHMass.textContent = `${massH} g`;
    if (actualOCCount) actualOCCount.textContent = `${totalO} molecules`;
    if (actualOMass) actualOMass.textContent = `${massO} g`;

    if (summaryMassRatio) summaryMassRatio.textContent = data.massRatio;

    // Key Insight Box
    if (insightEquation) {
      const hSym = currentSubstance === "Water" ? "H" : "N";
      const oSym = currentSubstance === "Water" ? "O" : "H";
      const uFormula = data.formula.replace("2", "₂").replace("3", "₃");
      const molStr = moleculeCount === 1 ? "molecule" : "molecules";
      insightEquation.textContent = `${moleculeCount} ${uFormula} ${molStr} → ${totalH} ${hSym} + ${totalO} ${oSym} atoms`;
    }
    if (insightRatio) {
      insightRatio.textContent = `Mass ratio ALWAYS ${data.massRatio}!`;
    }

    // Table
    if (tablePredH) tablePredH.textContent = predH;
    if (tablePredO) tablePredO.textContent = predO;
    if (tableActualH) tableActualH.textContent = totalH;
    if (tableActualO) tableActualO.textContent = totalO;

    renderAtoms(totalH, totalO);
  }

  function renderAtoms(numH, numO) {
    const hParent = document.getElementById("Group_1260");
    const oParent = document.getElementById("Group_1267");

    if (!hParent || !oParent) return;

    // Save templates if not already saved
    if (!window.hTemplate) {
      window.hTemplate = hParent.querySelector("g").cloneNode(true);
      window.oTemplate = oParent.querySelector("g").cloneNode(true);
    }

    // Clear current children
    hParent.innerHTML = "";
    oParent.innerHTML = "";

    // Hydrogen/Nitrogen Scattering
    const hCols = numH > 10 ? 6 : 5;
    const hSpacing = 75;
    const hJitter = 40;

    for (let i = 0; i < numH; i++) {
      const hNode = window.hTemplate.cloneNode(true);
      const row = Math.floor(i / hCols);
      const col = i % hCols;

      const x = col * hSpacing + (Math.random() - 0.5) * hJitter;
      const y = row * hSpacing + (Math.random() - 0.5) * hJitter;

      const circle = hNode.querySelector("circle");
      if (circle)
        circle.setAttribute(
          "fill",
          currentSubstance === "Water" ? "#1d8dce" : "#d93c76",
        );
      const text = hNode.querySelector("tspan") || hNode.querySelector("text");
      if (text) text.textContent = currentSubstance === "Water" ? "H" : "N";

      const hX = parseFloat(circle.getAttribute("cx"));
      const hY = parseFloat(circle.getAttribute("cy"));
      const dx = x - (hX - 197.26);
      const dy = y - (hY - 444.79);

      hNode.setAttribute("transform", `translate(${dx}, ${dy})`);
      hNode.style.opacity = "0";
      hNode.style.transition = "opacity 0.5s ease-in-out";
      hParent.appendChild(hNode);
      setTimeout(() => (hNode.style.opacity = "1"), 10 * i);
    }

    // Oxygen/Hydrogen Scattering
    const oCols = 3;
    const oSpacing = 95;
    const oJitter = 50;

    for (let i = 0; i < numO; i++) {
      const oNode = window.oTemplate.cloneNode(true);
      const row = Math.floor(i / oCols);
      const col = i % oCols;

      const x = col * oSpacing + (Math.random() - 0.5) * oJitter;
      const y = row * oSpacing + (Math.random() - 0.5) * oJitter;

      const circle = oNode.querySelector("circle");
      if (circle)
        circle.setAttribute(
          "fill",
          currentSubstance === "Water" ? "#d93c76" : "#1d8dce",
        );
      const text = oNode.querySelector("tspan") || oNode.querySelector("text");
      if (text) text.textContent = currentSubstance === "Water" ? "O" : "H";

      const oX = parseFloat(circle.getAttribute("cx"));
      const oY = parseFloat(circle.getAttribute("cy"));
      const dx = x - (oX - 857.26);
      const dy = y - (oY - 474.79);

      oNode.setAttribute("transform", `translate(${dx}, ${dy})`);
      oNode.style.opacity = "0";
      oNode.style.transition = "opacity 0.5s ease-in-out";
      oParent.appendChild(oNode);
      setTimeout(() => (oNode.style.opacity = "1"), 10 * i);
    }
  }

  // Initialize
  if (insightPanel) insightPanel.style.display = "none";
  updateUI();
});
