document.addEventListener("DOMContentLoaded", () => {
  // State management
  const state = {
    level: "Normal", // 'High', 'Normal', 'Low'
    isAnimating: false,
  };

  // Elements mapping
  const elements = {
    toggleKnob: document.getElementById("Group_1599"),
    startButton: document.getElementById("Group_3"),
    toggleSlider: document.getElementById("toggle_button"), // Full slider widget
    insightsButton: document.getElementById("Button_Insite_"),

    // Texts
    highLevelText: document.getElementById("High_glucose_level_in_blood"),
    normalLevelText: document.getElementById("Normal_glucose_level_in_blood"),
    lowLevelText: document.getElementById("Low_glucose_level_in_blood"),
    instruction1: document.getElementById("i_text_1"),
    instruction2: document.getElementById("i_text_2"),

    // Labels
    labelInsulinRel: document.getElementById("label"),
    labelInsulinAct: document.getElementById("label_2"),
    labelTissueAbs: document.getElementById("label_3"),
    labelGlyStorage: document.getElementById("label_4"),
    labelGlyStorageBox: document.getElementById("Group_4105-4"), // Purple box only
    labelGlyStorageText: document.getElementById("Group_4121-3"), // Redundant text to hide
    labelGlucaRel: document.getElementById("label_5"),
    labelGlucaConv: document.getElementById("label_6"),
    labelGlucoseBox: document.getElementById("label_7"),
    labelGlucoseEntry: document.getElementById("label_8"),
    labelHighGlucoseEntersLiver: document.getElementById("Group_4122"),
    labelHighGlucoseEntersTissues: document.getElementById("Group_4121"),
    labelHighGlucoseParent: document.getElementById("label_2"), // Parent of the above
    labelHighGlucoseInsulinRedundant: document.getElementById("Group_4120"), // Redundant insulin in label_2
    // Arrows
    arrowInsulinLiver: document.getElementById("Group_4106"), // Yellow Arrow Left
    arrowInsulinBlood: document.getElementById("Group_4107"), // Yellow Arrow Up
    arrowGlucoseLiver: document.getElementById("Group_4119"), // Blue Arrow Down (Tissues)
    arrowGlucoseTissues: document.getElementById("Group_4118"), // Blue Arrow Down (Liver) - Note: matching SVG IDs

    // Particle Groups
    glucoseInBlood: document.getElementById("Group_4101"), // Blue Cloud
    insulinParticles: document.getElementById("particles"), // Yellow Cluster (Now Insulin)
    glucagonParticles: document.getElementById("particles2"), // Green Cloud (Now Glucagon)
    insulinGroup1: document.getElementById("Group_4103"), // Subgroup for dual path
    insulinGroup2: document.getElementById("Group_4104"), // Subgroup for dual path
    glucoseAbsorptionLiver: document.getElementById("Group_4116"), // New blue cluster for liver
    glucoseAbsorptionTissues: document.getElementById("Group_4117"), // New blue cluster for tissues
    glycogenInLiver: document.getElementById("partical_3"), // Red Cluster
    glucoseInLiver: document.getElementById("patical_4"), // Blue Cluster (Liver)
  };

  const init = () => {
    elements.toggleKnob.style.cursor = "pointer";
    elements.startButton.style.cursor = "pointer";
    elements.insightsButton.style.cursor = "pointer";

    elements.startButton.addEventListener("click", startSequence);

    // Insights popup
    const insightsOverlay = document.getElementById("insights-overlay");
    const insightsClose = document.getElementById("insights-close");
    elements.insightsButton.addEventListener("click", () => {
      insightsOverlay.style.display = "flex";
    });
    insightsClose.addEventListener("click", () => {
      insightsOverlay.style.display = "none";
    });
    insightsOverlay.addEventListener("click", (e) => {
      if (e.target === insightsOverlay) insightsOverlay.style.display = "none";
    });

    elements.toggleKnob.addEventListener("click", () => {
      if (state.isAnimating) return;
      const cycle = { Normal: "High", High: "Low", Low: "Normal" };
      updateLevel(cycle[state.level]);
    });

    ["High", "Normal", "Low"].forEach((lvl) => {
      const idMap = {
        High: "Ellipse_195",
        Normal: "Ellipse_197",
        Low: "Ellipse_196",
      };
      const pt = document.getElementById(idMap[lvl]);
      if (pt) {
        pt.style.cursor = "pointer";
        pt.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!state.isAnimating) updateLevel(lvl);
        });
      }
    });

    updateLevel("Normal");
  };

  const updateLevel = (newLevel) => {
    state.level = newLevel;
    const pos = { High: -148, Normal: 0, Low: 148 };
    elements.toggleKnob.style.transition = "transform 0.3s ease";
    elements.toggleKnob.style.transform = `translateY(${pos[newLevel]}px)`;

    elements.highLevelText.style.display =
      newLevel === "High" ? "block" : "none";
    elements.normalLevelText.style.display =
      newLevel === "Normal" ? "block" : "none";
    elements.lowLevelText.style.display = newLevel === "Low" ? "block" : "none";

    elements.instruction1.style.display =
      newLevel === "Normal" ? "block" : "none";
    elements.instruction2.style.display =
      newLevel === "Normal" ? "none" : "block";

    elements.glucoseInBlood.style.display = "block";
    elements.glucoseInBlood.style.opacity =
      newLevel === "High" ? "1" : newLevel === "Low" ? "0.3" : "0.6";

    resetParticles(false);
    hideAllLabels();
  };

  const resetParticles = (hideBlood = true) => {
    const groups = [
      "insulinParticles",
      "glucagonParticles",
      "glycogenInLiver",
      "glucoseInLiver",
      "insulinGroup1",
      "insulinGroup2",
      "glucoseAbsorptionLiver",
      "glucoseAbsorptionTissues",
      "arrowInsulinLiver",
      "arrowInsulinBlood",
      "arrowGlucoseLiver",
      "arrowGlucoseTissues",
    ];
    groups.forEach((g) => {
      if (elements[g]) {
        elements[g].style.display = "none";
        elements[g].className.baseVal = "";
        elements[g].style.opacity = "1";
        elements[g].style.transform = "";
      }
    });

    if (elements.glucoseInBlood) {
      if (hideBlood) elements.glucoseInBlood.style.display = "none";
      elements.glucoseInBlood.className.baseVal = "";

      // Reset individual glucose particles
      Array.from(elements.glucoseInBlood.children).forEach((child) => {
        child.className.baseVal = "";
      });
    }
  };

  const hideAllLabels = () => {
    [
      "labelInsulinRel",
      "labelInsulinAct",
      "labelTissueAbs",
      "labelGlyStorage",
      "labelGlucaRel",
      "labelGlucaConv",
      "labelGlucoseBox",
      "labelGlucoseEntry",
      "labelHighGlucoseEntersLiver",
      "labelHighGlucoseEntersTissues",
      "labelHighGlucoseParent",
    ].forEach((l) => {
      if (elements[l]) elements[l].style.display = "none";
    });
  };

  const startSequence = () => {
    if (state.isAnimating || state.level === "Normal") return;
    state.isAnimating = true;
    elements.instruction2.style.display = "none";

    // Hide start button and blood glucose level slider on click
    elements.startButton.style.opacity = "0.5";
    elements.toggleSlider.style.opacity = "0.5";
    elements.highLevelText.style.display = "none";
    elements.normalLevelText.style.display = "none";
    elements.lowLevelText.style.display = "none";

    if (state.level === "High") runHighSequence();
    else runLowSequence();
  };

  const runHighSequence = async () => {
    // 0. Ensure parent group is visible

    // 1. Pancreas releases insulin (Yellow) - Image 1
    elements.insulinParticles.style.display = "block";
    elements.insulinGroup1.style.display = "block";
    elements.insulinGroup2.style.display = "block";

    await showMultipleLabels(
      [
        elements.labelInsulinRel,
        elements.arrowInsulinLiver,
        elements.arrowInsulinBlood,
      ],
      2500,
      true, // Cumulative from start
    );

    // elements.insulinGroup1.classList.add("insulin-to-vessel");
    // elements.insulinGroup2.classList.add("insulin-to-liver");
    await delay(2500);

    await delay(1000); // Wait before adding blue elements

    // 2. Glucose enters liver and tissues (Blue) - Image 2
    // Ensure parent label_2 is visible to show its children
    elements.labelHighGlucoseParent.style.display = "block";
    if (elements.labelHighGlucoseInsulinRedundant) {
      elements.labelHighGlucoseInsulinRedundant.style.display = "none";
    }

    elements.glucoseAbsorptionLiver.style.display = "block";
    elements.glucoseAbsorptionTissues.style.display = "block";

    await showMultipleLabels(
      [
        elements.labelHighGlucoseEntersLiver,
        elements.labelHighGlucoseEntersTissues,
        elements.arrowGlucoseLiver,
        elements.arrowGlucoseTissues,
      ],
      2500,
      true, // Cumulative
    );

    // Animate glucose particles to organs
    const glucoseParticles = elements.glucoseInBlood.children;
    for (let i = 0; i < glucoseParticles.length; i++) {
      if (i % 2 === 0) glucoseParticles[i].classList.add("glucose-to-liver");
      else glucoseParticles[i].classList.add("glucose-to-tissues");
    }
    await delay(2500);

    // 3. Final conversion/absorption (Screenshot 6) - Fix Overlap surgically
    // KEEP Step 2 elements visible as requested

    // Show label_3 (Tissue absorption + Insulin converts text)
    // Show label_4 parent but hide its redundant text sub-group (Overlap fix)
    // elements.labelGlyStorage.style.display = "block";
    // if (elements.labelGlyStorageText)
    //   elements.labelGlyStorageText.style.display = "none";
    elements.labelHighGlucoseEntersTissues.style.display = "none";
    elements.labelHighGlucoseEntersLiver.style.display = "none";
    elements.labelHighGlucoseInsulinRedundant.style.display = "none";
    elements.labelHighGlucoseParent.style.display = "none";
    elements.labelInsulinRel.style.display = "none";
    await showMultipleLabels(
      [elements.labelTissueAbs, elements.labelGlyStorageBox],
      3000,
      true, // Cumulative
    );

    finalizeNormalization();
  };

  const runLowSequence = async () => {
    // 0. Ensure parent group is visible
    elements.glucagonParticles.style.display = "block";

    // 1. Pancreas releases glucagon (Green)
    await showLabel(elements.labelGlucaRel, 2000);

    elements.glucagonParticles.classList.add("glucagon-to-liver");
    await delay(2500);

    // 2. Glucagon converts glycogen
    await showMultipleLabels(
      [elements.labelGlucaConv, elements.labelGlucoseBox],
      2500,
    );

    elements.glycogenInLiver.style.display = "block";
    elements.glycogenInLiver.style.opacity = "1";
    await delay(1000);
    elements.glycogenInLiver.style.transition = "opacity 1s";
    elements.glycogenInLiver.style.opacity = "0";

    elements.glucoseInLiver.style.display = "block";
    elements.glucoseInLiver.style.opacity = "0";
    setTimeout(() => (elements.glucoseInLiver.style.opacity = "1"), 10);
    await delay(1500);

    // 3. Glucose enters bloodstream
    await showLabel(elements.labelGlucoseEntry, 2000);
    elements.glucoseInLiver.classList.add("glucose-liver-to-blood");
    await delay(2500);

    finalizeNormalization();
  };

  const showLabel = async (el, duration, cumulative = false) => {
    if (!cumulative) hideAllLabels();
    if (!el) return;
    el.style.display = "block";
    el.style.opacity = "0";
    el.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      el.style.opacity = "1";
    }, 10);
    await delay(duration);
  };

  const showMultipleLabels = async (els, duration, cumulative = false) => {
    if (!cumulative) hideAllLabels();
    els.forEach((el) => {
      if (!el) return;
      el.style.display = "block";
      el.style.opacity = "0";
      el.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        el.style.opacity = "1";
      }, 10);
    });
    await delay(duration);
  };

  const finalizeNormalization = async () => {
    hideAllLabels();
    elements.glucoseInBlood.className.baseVal = "";
    elements.glucoseInBlood.style.transition = "opacity 2s ease";
    elements.glucoseInBlood.style.opacity = "0.6";
    await delay(2000);

    resetParticles(false);
    updateLevel("Normal");
    elements.startButton.style.display = "block"; // Restore start button after sequence
    elements.toggleSlider.style.display = "block"; // Restore slider after sequence
    state.isAnimating = false;
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  init();
});
