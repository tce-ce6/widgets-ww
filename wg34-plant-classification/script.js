/* -------------------------------
   1. LOAD JSON
--------------------------------*/
let plantData = [];

fetch("plant-data.json")
  .then(res => res.json())
  .then(data => {
    plantData = data.combinations;
    console.log("JSON Loaded:", plantData);
  })
  .catch(err => console.error("Error loading JSON:", err));


/* -------------------------------
   2. SELECTION ORDER & VALUES
--------------------------------*/
const selectionOrder = [
  "height",
  "stemColor",
  "stemType",
  "stemThickness",
  "branchPosition",
  "growthHabit"
];

let selectedValues = {
  height: null,
  stemColor: null,
  stemType: null,
  stemThickness: null,
  branchPosition: null,
  growthHabit: null
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
  "branchPosition-closeToGround": { category: "branchPosition", value: "Close to ground" },
  "branchPosition-higherUpOnStem": { category: "branchPosition", value: "Higher up on stem" },

  // GROWTH HABIT
  "growthHabit-upright": { category: "growthHabit", value: "Grows upright" },
  "growthHabit-spreadonGround": { category: "growthHabit", value: "Spread on the ground" },
  "growthHabit-needSupportToGrow": { category: "growthHabit", value: "Need support to grow" }
};

const categoryGroups = {
  height: ["height-tall", "height-medium", "height-short"],
  stemColor: ["stemColor-green", "stemColor-brown"],
  stemType: ["steamType-softTender", "steamType-hardWoody"],
  stemThickness: ["steamTickness-thin", "steamTickness-thick"],
  branchPosition: ["branchPosition-closeToGround", "branchPosition-higherUpOnStem"],
  growthHabit: ["growthHabit-upright", "growthHabit-spreadonGround", "growthHabit-needSupportToGrow"]
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
});

  Object.keys(idMap).forEach(id => {
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
  selectedValues[category] = value;

  // ACTIVE CLASS
  categoryGroups[category].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  const clickedEl = document.getElementById(clickedId);
  if (clickedEl) clickedEl.classList.add("active");

  // UPDATE SELECTED VALUE TEXT
  updateSelectedValue(category, value);

  // VALIDATION HERE
  const isValid = validateCombination();
  if (!isValid) return; // Stop further progress

  showCurrentCategory(category);

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
    if (selection.height === 'Tall' && selection.stemColor === 'Green') {
      return { valid: false, message: "Tall plants need strong, woody (brown) stems to support their height and weight." };
    }
  }

  // Check height + stem thickness combination  
  if (selection.height && selection.stemThickness) {
    if (selection.height === 'Short' && selection.stemThickness === 'Thick') {
      return { valid: false, message: "Short plants typically have thin stems as they don't need thick support structures." };
    }
  }

  // Check stem color + stem type combination
  if (selection.stemColor && selection.stemType) {
    if (selection.stemColor === 'Green' && selection.stemType === 'Hard/Woody') {
      return { valid: false, message: "Green stems are young and contain chlorophyll for photosynthesis, making them soft and tender." };
    }

    if (selection.stemColor === 'Brown' && selection.stemType === 'Soft/Tender') {
      return { valid: false, message: "Brown stems are mature and woody, providing structural support to the plant." };
    }
  }

  // Check growth habit + height combination
  if (selection.growthHabit && selection.height) {
    if (selection.growthHabit === 'Spread on the ground' && selection.height !== 'Short') {
      return { valid: false, message: "Plants that spread on the ground remain close to the soil surface and are naturally short." };
    }

    if (selection.height === 'Tall' && selection.growthHabit !== 'Grows upright') {
      return { valid: false, message: "Tall plants must grow upright to reach their full height and access sunlight." };
    }
  }

  // Check growth habit + stem type combination
  if (selection.growthHabit && selection.stemType) {
    if (selection.growthHabit === 'Need support to grow' && selection.stemType === 'Hard/Woody') {
      return { valid: false, message: "Climbing plants have weak, flexible stems that cannot support themselves upright." };
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
}
