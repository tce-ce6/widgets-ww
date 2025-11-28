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

/* -------------------------------
   2. SELECTION ORDER & VALUES
--------------------------------*/
const selectionOrder = [
  "height",
  "stemColor",
  "stemType",
  "stemThickness",
  "branchPosition",
  "growthHabit",
];

const explanationMap = {
  tree: `Correct! This is a tree because it has a tall, thick, woody stem that provides strong support and branches high up to maximize sunlight exposure.`,
  shrub: `Correct! This is a shrub because it has a medium height with woody stems and multiple branches near the ground, creating a bushy appearance.`,
  herb: `Correct! This is a herb because it has a short, soft, green stem that's tender and flexible, perfect for quick growth cycles.`,
  climber: `Correct! This is a climber because it has weak, flexible stems that cannot support themselves and need external support to grow upward.`,
  creeper: `Correct! This is a creeper because it has weak stems that spread along the ground rather than growing upright.`,
};

const wrongReasonMap = {
  tree: `Not a tree. Trees need tall height with thick, woody stems and branches high up. This plant doesn't match those characteristics.`,
  shrub: `Not a shrub. Shrubs are medium-sized with multiple woody branches near the ground. This plant has different characteristics.`,
  herb: `Not a herb. Herbs are short plants with soft, green stems. This plant doesn't fit that description.`,
  climber: `Not a climber. Climbers have weak stems that need support to grow. This plant grows differently.`,
  creeper: `Not a creeper. Creepers spread along the ground with weak stems. This plant has different growth habits.`
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
   3. MAP SVG ID → CATEGORY & VALUE
--------------------------------*/
const idMap = {
  // HEIGHT
  "height-tall": { category: "height", value: "Tall" },
  "height-medium": { category: "height", value: "Medium" },
  "height-short": { category: "height", value: "Short" },

  // STEM COLOR
  "stemColor-green": { category: "stemColor", value: "Green" },
  "stemColor-brown": { category: "stemColor", value: "Brown" },

  // STEM TYPE
  "steamType-softTender": { category: "stemType", value: "Soft/Tender" },
  "steamType-hardWoody": { category: "stemType", value: "Hard/Woody" },

  // STEM THICKNESS
  "steamTickness-thin": { category: "stemThickness", value: "Thin" },
  "steamTickness-thick": { category: "stemThickness", value: "Thick" },

  // BRANCH POSITION
  "branchPosition-closeToGround": {
    category: "branchPosition",
    value: "Close to ground",
  },
  "branchPosition-higherUpOnStem": {
    category: "branchPosition",
    value: "Higher up on stem",
  },

  // GROWTH HABIT
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
   4. WAIT FOR SVG TO LOAD FIRST
--------------------------------*/
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded. Attaching listeners...");
  document.getElementById("close-btn").addEventListener("click", () => {
    const modal = document.getElementById("detail-modal");
    modal.style.opacity = "0";
    modal.style.visibility = "hidden";
    modal.style.display = "none";

    // Remove ALL wrong classes
    document.querySelectorAll(".wrong").forEach((el) => {
      el.classList.remove("wrong");
    });

    document.getElementById("svg-container").classList.remove("modal-open");
  });

document.getElementById("reset-btn").addEventListener("click", () => {
  // 1️⃣ Reset selected values
  selectedValues = {
    height: null,
    stemColor: null,
    stemType: null,
    stemThickness: null,
    branchPosition: null,
    growthHabit: null,
  };

  // 2️⃣ Remove active + wrong classes
  document.querySelectorAll(".active, .wrong").forEach((el) => {
    el.classList.remove("active", "wrong");
  });

  // 3️⃣ Reset selected text
  Object.keys(selectedValues).forEach((category) => {
    const labelEl = document.querySelector(`.${category}-value`);
    if (labelEl) labelEl.textContent = "--";
  });

  // 4️⃣ Hide all selection groups
  Object.keys(selectedValues).forEach((category) => {
    const group = document.getElementById(`${category}-selection`);
    if (group) group.style.display = "none";
  });

  // 5️⃣ Hide any open modal
  const modal = document.getElementById("detail-modal");
  modal.style.display = "none";
  modal.style.opacity = "0";
  modal.style.visibility = "hidden";

  // 6️⃣ Remove blur
  document.getElementById("svg-container").classList.remove("modal-open");

  // 7️⃣ Hide classify plant screen
  document.getElementById("classify-plant").style.display = "none";

  // 8️⃣ Show characteristic section again
  document.getElementById("characteristic-wrapper").style.display = "block";

  // 9️⃣ Hide result note
  document.getElementById("result-note").style.display = "none";

  // 🔟 Remove correct/wrong highlight on classify icons
  document.querySelectorAll(".classify-wrap li").forEach(li => {
    li.classList.remove("correct", "wrong");
  });

  // ⭐ NEW → Remove disable state from classify button
  document.getElementById("classify-btn").classList.remove("disable-classify");

  console.log("All selections reset!");
});





  document.getElementById("insight-btn").addEventListener("click", () => {
    const modal = document.getElementById("characteristics-modal");

    modal.style.display = "block";
    modal.style.opacity = "1";
    modal.style.visibility = "visible";

    // Add blur/disable to the SVG
    document.getElementById("svg-container").classList.add("modal-open");
});

  document.getElementById("characteristics-close-btn").addEventListener("click", () => {
      const modal = document.getElementById("characteristics-modal");

      modal.style.opacity = "0";
      modal.style.visibility = "hidden";
      modal.style.display = "none";

      // Remove blur/disable
      document.getElementById("svg-container").classList.remove("modal-open");
  });

document.getElementById("classify-btn").addEventListener("click", () => {

    // Prevent action if button is disabled
    if (document.getElementById("classify-btn").classList.contains("disable-classify")) {
        return;
    }

    // ⭐ Add disable-classify again when classify screen opens
    document.getElementById("classify-btn").classList.add("disable-classify");

    // Hide characteristic section
    document.getElementById("characteristic-wrapper").style.display = "none";

    // Show classify plant section
    document.getElementById("classify-plant").style.display = "block";

    console.log("Classification screen opened.");
});


document.querySelectorAll(".classify-wrap li").forEach(li => {
  li.addEventListener("click", () => {

    const chosen = li.id.replace("-classify", "");   // tree, shrub, herb...
    const correctPlantType = detectCorrectCategory();

    const resultNote = document.getElementById("result-note");
    const resultTxt  = document.getElementById("result-txt");

    // Always show the result container
    resultNote.style.display = "block";

    // Remove previous classes from result box
    resultNote.classList.remove("wrong", "correct");

    // Remove previous classes from all li items
    document.querySelectorAll(".classify-wrap li").forEach(item => {
      item.classList.remove("correct", "wrong");
    });

    if (!correctPlantType) {
      resultTxt.textContent = "⚠ Unable to determine correct plant type!";
      resultNote.classList.add("wrong");

      // mark selected li as wrong
      li.classList.add("wrong");
      return;
    }

    if (chosen === correctPlantType) {
      // ✔ CORRECT
      resultTxt.textContent = explanationMap[correctPlantType];
      resultNote.classList.add("correct");

      // Add correct class to the chosen li
      li.classList.add("correct");

    } else {
      // ❌ WRONG
      resultTxt.textContent = wrongReasonMap[chosen];
      resultNote.classList.add("wrong");

      // Add wrong class to the chosen li
      li.classList.add("wrong");
    }
  });
});

  Object.keys(idMap).forEach((id) => {
    const el = document.getElementById(id);

    if (!el) {
      console.warn("❗ SVG element not found:", id);
      return;
    }

    // Enable clicks on SVG <g> (very important)
    el.style.pointerEvents = "all";
    // el.style.cursor = "pointer";

    // Attach click listener
    el.addEventListener("click", () => handleSelection(id));
  });
});

/* -------------------------------
   5. HANDLE SVG SELECTION
--------------------------------*/
function handleSelection(clickedId) {
  const { category, value } = idMap[clickedId];

  const previousValue = selectedValues[category];
  selectedValues[category] = value;

  const isValid = validateCombination();

  if (!isValid) {
    const clickedEl = document.getElementById(clickedId);
    if (clickedEl) clickedEl.classList.add("wrong");

    selectedValues[category] = previousValue;
    return;
  }

  // VALID → update UI
  categoryGroups[category].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("active");
      el.classList.remove("wrong");
    }
  });

  const clickedEl = document.getElementById(clickedId);
  if (clickedEl) clickedEl.classList.add("active");

  updateSelectedValue(category, value);
  showCurrentCategory(category);

  // 🔥 NEW — check if all categories selected
  checkCompletion();

  console.log("Selected →", selectedValues);
}



function updateSelectedValue(category, value) {
  const el = document.querySelector(`.${category}-value`);
  if (el) {
    el.textContent = value;
  } else {
    console.warn("⚠️ Selected-value element not found for:", category);
  }
}

/* -------------------------------
   6. SHOW NEXT SELECTION GROUP
--------------------------------*/
function showCurrentCategory(category) {
  // SHOW the matching selection group, but DO NOT hide others
  const group = document.getElementById(`${category}-selection`);
  if (group) group.style.display = "block";
}

function validateCombination() {
  const result = validateSelection(selectedValues);

  if (!result.valid) {
    showInvalidMessage(result.message);
    return false;
  }

  return true; // No rules violated
}

const validateSelection = (selection) => {
  // Only validate combinations when we have enough characteristics to make meaningful checks

  // Check height + stem color combination
  if (selection.height && selection.stemColor) {
    if (selection.height === "Tall" && selection.stemColor === "Green") {
      return {
        valid: false,
        message:
          "Tall plants need strong, woody (brown) stems to support their height and weight.",
      };
    }
  }

  // Check height + stem thickness combination
  if (selection.height && selection.stemThickness) {
    if (selection.height === "Short" && selection.stemThickness === "Thick") {
      return {
        valid: false,
        message:
          "Short plants typically have thin stems as they don't need thick support structures.",
      };
    }
  }

  // Check stem color + stem type combination
  if (selection.stemColor && selection.stemType) {
    if (
      selection.stemColor === "Green" &&
      selection.stemType === "Hard/Woody"
    ) {
      return {
        valid: false,
        message:
          "Green stems are young and contain chlorophyll for photosynthesis, making them soft and tender.",
      };
    }

    if (
      selection.stemColor === "Brown" &&
      selection.stemType === "Soft/Tender"
    ) {
      return {
        valid: false,
        message:
          "Brown stems are mature and woody, providing structural support to the plant.",
      };
    }
  }

  // Check growth habit + height combination
  if (selection.growthHabit && selection.height) {
    if (
      selection.growthHabit === "Spread on the ground" &&
      selection.height !== "Short"
    ) {
      return {
        valid: false,
        message:
          "Plants that spread on the ground remain close to the soil surface and are naturally short.",
      };
    }

    if (
      selection.height === "Tall" &&
      selection.growthHabit !== "Grows upright"
    ) {
      return {
        valid: false,
        message:
          "Tall plants must grow upright to reach their full height and access sunlight.",
      };
    }
  }

  // Check growth habit + stem type combination
  if (selection.growthHabit && selection.stemType) {
    if (
      selection.growthHabit === "Need support to grow" &&
      selection.stemType === "Hard/Woody"
    ) {
      return {
        valid: false,
        message:
          "Climbing plants have weak, flexible stems that cannot support themselves upright.",
      };
    }
  }

  return { valid: true };
};

function showInvalidMessage(msg) {
  const modal = document.getElementById("detail-modal");
  const msgBox = document.getElementById("msg-txt");

  msgBox.textContent = msg;
  modal.style.display = "block";
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
  document.getElementById("svg-container").classList.add("modal-open");
}

function checkCompletion() {
  // 1️⃣ Check if all 6 categories are selected
  const allSelected = Object.values(selectedValues).every(v => v !== null);
  if (!allSelected) {
    document.getElementById("classify-btn").classList.add("disable-classify");
    return;
  }

  // 2️⃣ Check if the selected combination matches any valid plant type
  const plantType = detectCorrectCategory();

  if (plantType) {
    // Valid combination → enable classify button
    document.getElementById("classify-btn").classList.remove("disable-classify");
  } else {
    // Wrong combination → keep classify disabled
    document.getElementById("classify-btn").classList.add("disable-classify");
  }
}


function detectCorrectCategory() {
  const s = selectedValues;

  // TREE
  if (
    s.height === "Tall" &&
    s.stemColor === "Brown" &&
    s.stemType === "Hard/Woody" &&
    s.stemThickness === "Thick" &&
    s.branchPosition === "Higher up on stem" &&
    s.growthHabit === "Grows upright"
  ) return "tree";

  // SHRUB
  if (
    s.height === "Medium" &&
    s.stemColor === "Brown" &&
    s.stemType === "Hard/Woody" &&
    s.stemThickness === "Thin" &&
    s.branchPosition === "Close to ground" &&
    s.growthHabit === "Grows upright"
  ) return "shrub";

  // HERB
  if (
    s.height === "Short" &&
    s.stemColor === "Green" &&
    s.stemType === "Soft/Tender" &&
    s.stemThickness === "Thin" &&
    s.branchPosition === "Close to ground" &&
    s.growthHabit === "Grows upright"
  ) return "herb";
  
  // CLIMBER
  if (
    s.height === "Short" &&
    s.stemColor === "Green" &&
    s.stemType === "Soft/Tender" &&
    s.stemThickness === "Thin" &&
    s.branchPosition === "Close to ground" &&
    s.growthHabit === "Need support to grow"
  ) return "climber";

  // CREEPER
  if (
    s.height === "Short" &&
    s.stemColor === "Green" &&
    s.stemType === "Soft/Tender" &&
    s.stemThickness === "Thin" &&
    s.branchPosition === "Close to ground" &&
    s.growthHabit === "Spread on the ground"
  ) return "creeper";

  return null;
}
