/* -------------------------------
   1. LOAD JSON
--------------------------------*/
let plantData = [];

fetch("plant-data.json")
  .then((res) => res.json())
  .then((data) => {
    plantData = data.combinations;
    console.log("JSON Loaded:", plantData);
  })
  .catch((err) => console.error("Error loading JSON:", err));

/* JSON key mapping */
const jsonKeyMap = {
  branchPosition: "branchingLevel",
  growthHabit: "growthPattern",
};

/* -------------------------------
   2. SELECTION ORDER & VALUES
--------------------------------*/
const explanationMap = {
  tree: `Correct! This is a tree because it has a tall, thick, woody stem that provides strong support and branches high up to maximize sunlight exposure.`,
  shrub: `Correct! This is a shrub because it has a short to medium height with woody stems and multiple branches near the ground, creating a bushy appearance.`,
  herb: `Correct! This is a herb because it has a short, soft, green stem that's tender and flexible, perfect for quick growth cycles.`,
  climber: `Correct! This is a climber because it has weak, flexible stems that cannot support themselves and need external support to grow upward.`,
  creeper: `Correct! This is a creeper because it has weak stems that spread along the ground rather than growing upright.`,
};

const wrongReasonMap = {
  tree: `Not a tree. Trees need tall height with thick, woody stems and branches high up.`,
  shrub: `Not a shrub. Shrubs are short to medium-sized with multiple woody branches near the ground. This plant has different characteristics.`,
  herb: `Not a herb. Herbs are short plants with soft, green stems.`,
  climber: `Not a climber. Climbers have weak stems needing support.`,
  creeper: `Not a creeper. Creepers spread along the ground.`,
};

let selectedValues = {
  height: null,
  stemColor: null,
  stemType: null,
  stemThickness: null,
  branchPosition: null,
  growthHabit: null,
};

/* -------------------------------
   3. SVG ID MAP
--------------------------------*/
const idMap = {
  "height-tall": { category: "height", value: "Tall" },
  "height-medium": { category: "height", value: "Medium" },
  "height-short": { category: "height", value: "Short" },

  "stemColor-green": { category: "stemColor", value: "Green" },
  "stemColor-brown": { category: "stemColor", value: "Brown" },

  "steamType-softTender": { category: "stemType", value: "Soft/Tender" },
  "steamType-hardWoody": { category: "stemType", value: "Hard/Woody" },

  "steamTickness-thin": { category: "stemThickness", value: "Thin" },
  "steamTickness-thick": { category: "stemThickness", value: "Thick" },

  "branchPosition-closeToGround": {
    category: "branchPosition",
    value: "Close to ground",
  },
  "branchPosition-higherUpOnStem": {
    category: "branchPosition",
    value: "Higher up on stem",
  },

  "growthHabit-upright": { category: "growthHabit", value: "Grows upright" },
  "growthHabit-spreadonGround": {
    category: "growthHabit",
    value: "Spread on the ground",
  },
  "growthHabit-needSupportToGrow": {
    category: "growthHabit",
    value: "Need support to grow",
  },
};

/* -------------------------------
   4. CATEGORY GROUPS
--------------------------------*/
const categoryGroups = {
  height: ["height-tall", "height-medium", "height-short"],
  stemColor: ["stemColor-green", "stemColor-brown"],
  stemType: ["steamType-softTender", "steamType-hardWoody"],
  stemThickness: ["steamTickness-thin", "steamTickness-thick"],
  branchPosition: [
    "branchPosition-closeToGround",
    "branchPosition-higherUpOnStem",
  ],
  growthHabit: [
    "growthHabit-upright",
    "growthHabit-spreadonGround",
    "growthHabit-needSupportToGrow",
  ],
};

/* -------------------------------
   5. DOM READY
--------------------------------*/
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded. Attaching listeners...");

  /* CLOSE MODAL */
  document.getElementById("close-btn").addEventListener("click", () => {
    const modal = document.getElementById("detail-modal");
    modal.style.display = "none";
    modal.style.opacity = "0";
    modal.style.visibility = "hidden";

    document.querySelectorAll(".wrong").forEach((el) => {
      el.classList.remove("wrong");
    });

    document.getElementById("svg-container").classList.remove("modal-open");
  });

  /* RESET BUTTON */
  document.getElementById("reset-btn").addEventListener("click", resetAll);

  /* CLASSIFY BUTTON */
  document.getElementById("classify-btn").addEventListener("click", () => {
    if (
      document
        .getElementById("classify-btn")
        .classList.contains("disable-classify")
    )
      return;

    document.getElementById("classify-btn").classList.add("disable-classify");

    document.getElementById("characteristic-wrapper").style.display = "none";
    document.getElementById("classify-plant").style.display = "block";
  });

  /* INSIGHT MODAL OPEN */
document.getElementById("insight-btn").addEventListener("click", () => {
  const modal = document.getElementById("characteristics-modal");

  modal.style.display = "block";
  modal.style.opacity = "1";
  modal.style.visibility = "visible";

  // Blur background
  document.getElementById("svg-container").classList.add("modal-open");
});

/* INSIGHT MODAL CLOSE */
document.getElementById("characteristics-close-btn").addEventListener("click", () => {
  const modal = document.getElementById("characteristics-modal");

  modal.style.opacity = "0";
  modal.style.visibility = "hidden";
  modal.style.display = "none";

  // Remove blur
  document.getElementById("svg-container").classList.remove("modal-open");
});


  /* CLASSIFY OPTION CLICK */
  document.querySelectorAll(".classify-wrap li").forEach((li) => {
    li.addEventListener("click", () => handleClassifyClick(li));
  });

  /* SVG CLICK LISTENERS */
  Object.keys(idMap).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.pointerEvents = "all";
    el.addEventListener("click", () => handleSelection(id));
  });
});

/* -------------------------------
   6. HANDLE SELECTION
--------------------------------*/
function handleSelection(clickedId) {
  const { category, value } = idMap[clickedId];
  const previous = selectedValues[category];

  selectedValues[category] = value;

  const isValid = validateCombination();

  if (!isValid) {
    selectedValues[category] = previous;
    document.getElementById(clickedId).classList.add("wrong");
    return;
  }

  document.getElementById("reset-btn").classList.remove("disable-reset");

  categoryGroups[category].forEach((id) => {
    document.getElementById(id)?.classList.remove("active", "wrong");
  });

  document.getElementById(clickedId)?.classList.add("active");

  updateSelectedValue(category, value);
  showCurrentCategory(category);
  checkCompletion();
}

function updateSelectedValue(category, value) {
  const el = document.querySelector(`.${category}-value`);
  if (el) el.textContent = value;
}

function showCurrentCategory(category) {
  const group = document.getElementById(`${category}-selection`);
  if (group) group.style.display = "block";
}

/* -------------------------------
   7. JSON-BASED VALIDATION
--------------------------------*/
function validateCombination() {
  const formatted = convertToJsonFormat(selectedValues);
  const match = detectCorrectCategory();

  // JSON INVALID MATCH (even partial)
  if (match && match.status === "invalid") {
    showInvalidMessage(match.message);
    return false;
  }

  // When all 6 are selected
  const allSelected = Object.values(selectedValues).every((v) => v !== null);

  if (allSelected) {
    // No matching object in JSON → invalid
    if (!match) {
      showInvalidMessage(
        "This combination doesn't form a valid plant type. Please try different characteristics."
      );
      return false;
    }
    return true;  // Full valid JSON combination
  }

  return true; // Partial but still fine
}


/* RULE CHECKS (optional partial rules) */
const validateSelection = () => {
  return { valid: true };
};

function showInvalidMessage(msg) {
  const modal = document.getElementById("detail-modal");
  document.getElementById("msg-txt").textContent = msg;

  modal.style.display = "block";
  modal.style.opacity = "1";
  modal.style.visibility = "visible";

  document.getElementById("svg-container").classList.add("modal-open");
}

/* -------------------------------
   8. JSON MATCH LOGIC
--------------------------------*/
function convertToJsonFormat(selection) {
  return {
    height: selection.height,
    stemColor: selection.stemColor,
    stemType: selection.stemType,
    stemThickness: selection.stemThickness,
    branchingLevel: selection.branchPosition,
    growthPattern: selection.growthHabit,
  };
}

function detectCorrectCategory() {
  if (!plantData.length) return null;

  const formatted = convertToJsonFormat(selectedValues);

  const match = plantData.find(item => 
    (item.height === formatted.height) &&
    (item.stemColor === formatted.stemColor) &&
    (item.stemType === formatted.stemType) &&
    (item.stemThickness === formatted.stemThickness) &&
    (item.branchingLevel === null || item.branchingLevel === formatted.branchingLevel) &&
    (item.growthPattern === null || item.growthPattern === formatted.growthPattern)
  );

  return match || null;
}


/* -------------------------------
   9. COMPLETION CHECK
--------------------------------*/
function checkCompletion() {
  const allSelected = Object.values(selectedValues).every((v) => v !== null);

  if (!allSelected) {
    document.getElementById("classify-btn").classList.add("disable-classify");
    return;
  }

  const match = detectCorrectCategory();

  if (match && match.status === "valid") {
    document.getElementById("classify-btn").classList.remove("disable-classify");
  } else {
    document.getElementById("classify-btn").classList.add("disable-classify");
  }
}

/* -------------------------------
   10. CLASSIFY CLICK HANDLER
--------------------------------*/
function handleClassifyClick(li) {
  const chosen = li.id.replace("-classify", "");
  const match = detectCorrectCategory();

  const resultNote = document.getElementById("result-note");
  const resultTxt = document.getElementById("result-txt");

  resultNote.style.display = "block";
  resultNote.classList.remove("wrong", "correct");

  document.querySelectorAll(".classify-wrap li").forEach((item) =>
    item.classList.remove("correct", "wrong")
  );

  if (!match) {
    resultTxt.textContent =
      "⚠ Unable to determine correct plant type!";
    resultNote.classList.add("wrong");
    li.classList.add("wrong");
    return;
  }

  if (chosen === match.category) {

    // ⭐ SPECIAL CASE FOR TREE (ID 26)
    if (match.category === "tree" && match.height === "Medium") {
        resultTxt.textContent =
            "Correct! This is a tree because it has a thick, woody stem that provides strong support and branches high up to maximise sunlight exposure. While trees are often tall, some species are medium-sized.";
    } else {
        // Normal explanation
        resultTxt.textContent = explanationMap[match.category];
    }

    resultNote.classList.add("correct");
    li.classList.add("correct");
} else {
    resultTxt.textContent = wrongReasonMap[chosen];
    resultNote.classList.add("wrong");
    li.classList.add("wrong");
  }
}

/* -------------------------------
   11. RESET FUNCTION
--------------------------------*/
function resetAll() {
  selectedValues = {
    height: null,
    stemColor: null,
    stemType: null,
    stemThickness: null,
    branchPosition: null,
    growthHabit: null,
  };

  document.querySelectorAll(".active, .wrong").forEach((el) =>
    el.classList.remove("active", "wrong")
  );

  Object.keys(selectedValues).forEach((category) => {
    const label = document.querySelector(`.${category}-value`);
    if (label) label.textContent = "--";
  });

  Object.keys(selectedValues).forEach((c) => {
    const group = document.getElementById(`${c}-selection`);
    if (group) group.style.display = "none";
  });

  document.getElementById("detail-modal").style.display = "none";
  document.getElementById("svg-container").classList.remove("modal-open");

  document.getElementById("classify-plant").style.display = "none";
  document.getElementById("characteristic-wrapper").style.display = "block";

  document.getElementById("result-note").style.display = "none";

  document.querySelectorAll(".classify-wrap li").forEach((li) =>
    li.classList.remove("correct", "wrong")
  );

  document.getElementById("reset-btn").classList.add("disable-reset");

  console.log("All selections reset!");
}
