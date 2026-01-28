const periodicTable_plusChange = {
  H: 1,
  K: 1,
  Ca: 2,
  Fe: 3,
  Na: 1,
  Mg: 2,
  Al: 3,
  "NH₄": 1,
};
const periodicTable_minusChange = {
  Cl: 1,
  O: 2,
  N: 3,
  "SO₄": 2,
  OH: 1,
  Br: 1,
  S: 2,
  "NO₃": 1,
  "CO₃": 2,
};
const periodicTable_plusNames = {
  H: "Hydrogen",
  K: "Potassium",
  Ca: "Calcium",
  Fe: "Iron",
  Na: "Sodium",
  Mg: "Magnesium",
  Al: "Aluminium",
  "NH₄": "Ammonium",
};

const periodicTable_minusNames = {
  Cl: "Chloride",
  O: "Oxide",
  N: "Nitride",
  "SO₄": "Sulfate",
  OH: "Hydroxide",
  Br: "Bromide",
  S: "Sulfide",
  "NO₃": "Nitrate",
  "CO₃": "Carbonate",
};

const cationData = {
  H: { name: "Hydrogen", charge: 1 },
  K: { name: "Potassium", charge: 1 },
  Ca: { name: "Calcium", charge: 2 },
  Fe: { name: "Iron", charge: 3 },
  Mg: { name: "Magnesium", charge: 3 },
  Al: { name: "Aluminium", charge: 3 },
  "NH₄": { name: "Ammonium", charge: 1 },
};

const anionData = {
  Cl: { name: "Chloride", charge: 1 },
  O: { name: "Oxide", charge: 2 },
  N: { name: "Nitride", charge: 3 },
  "SO₄": { name: "Sulfate", charge: 2 },
  OH: { name: "Hydroxide", charge: 1 },
  Br: { name: "Bromide", charge: 1 },
  S: { name: "Sulfide", charge: 2 },
  "NO₃": { name: "Nitrate", charge: 1 },
  "CO₃": { name: "Carbonate", charge: 2 },
};

const plusChangeEntries = Object.entries(periodicTable_plusChange); // [["H", 1], ["K", 1]...]
const minusChangeEntries = Object.entries(periodicTable_minusChange);

// IDs of the container groups in your HTML for Cations

let selectedCation = null; // Stores {symbol, charge}
let selectedAnion = null;

// Initialization
function init() {
  setupInteractions();
  modalFunctionality();
  

}
function modalFunctionality() {

  document.getElementById("ruleModal").style.display = "none";
  document.getElementById("exampleModal").style.display = "none";
  let button = document.getElementById("ruleBtn");
  button.addEventListener("click", function () {
    document.getElementById("ruleModal").style.display = "block";
      document.getElementById("exampleModal").style.display = "none";

  });
  let btnClose = document.getElementById("btn-close");
  btnClose.addEventListener("click", function () {
 document.getElementById("ruleModal").style.display = "none";
  document.getElementById("exampleModal").style.display = "none";
   })
 
}

function setupInteractions() {
  // Select all ion groups by their IDs from your SVG
  // Note: You should ensure your SVG groups for all ions have consistent IDs
  // For this example, we'll attach listeners to the specific ones found in your file
  const cations = ["H", "K", "Ca", "Fe", "Na", "Mg", "Al", "NH₄"];
  const anions = ["Cl", "O", "N", "SO₄", "OH", "Br", "S", "NO₃", "CO₃"];
  const cationMap = {
    "Group 5_2": "H",
    "Group 85_2": "K",
    "Group 86_2": "Ca",
    "Group 87_2": "Fe",
    "Group 90_2": "Mg",
    "Group 92_2": "NH₄",
  };
  const anionMap = {
    "Group 73": "Cl",
    "Group 76": "O",
    "Group 77": "N",
    "Group 78": "SO₄",
  };

  cations.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.onclick = () => selectIon(id, "plus");
  });

  anions.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.onclick = () => selectIon(id, "minus");
  });

  // Reset button
  const tryAnother = document.getElementById("try_another_compound");
  if (tryAnother) tryAnother.onclick = resetForm;
}

function selectIon(symbol, type) {
  if (type === "plus") {
    selectedCation = { symbol, charge: periodicTable_plusChange[symbol] };
    showCompoundName("setup_cation", symbol, "cation");
    updateDisplay("1+", selectedCation.charge + "+", "cation");
  } else {
    selectedAnion = { symbol, charge: periodicTable_minusChange[symbol] };
    showCompoundName("setup_anion", symbol, "anion"); // Assuming Symbol_2 is the anion side
    updateDisplay("1-", selectedAnion.charge + "-", "anion");
  }

  if (selectedCation && selectedAnion) {
    showApplyCrissCrossMethod();
  }
}

function getCompoundName(cationKey, anionKey) {
  const cName = periodicTable_plusNames[cationKey];
  const aName = periodicTable_minusNames[anionKey];

  return `${cName} ${aName}`;
}

function updateUIName(fullName) {
  // Assuming you add id="CompoundName" to a text element in your SVG
  const nameElement = document.getElementById("compound_name");
  if (nameElement) {
    const tspan = nameElement.querySelector("tspan") || nameElement;
    tspan.textContent = `Compound name: ${fullName}`;
  }
}
function showApplyCrissCrossMethod() {
  const applyButton = document.getElementById("apply_criss_cross_method");
  if (applyButton) {
    applyButton.style.pointerEvents = "auto";
    applyButton.style.cursor = "pointer";
    applyButton.style.opacity = "1";
    applyButton.onclick = () => {
      calculateFormula();
      showCrissCrossLines();
      let try_another_compound = document.getElementById("try_another_compound");
      if (try_another_compound) {
        try_another_compound.style.pointerEvents = "auto";
        try_another_compound.style.cursor = "pointer";
        try_another_compound.style.opacity = "1";
      }
      apply_criss_cross_method = document.getElementById("apply_criss_cross_method");
      if (apply_criss_cross_method) {
        apply_criss_cross_method.style.pointerEvents = "none";
        apply_criss_cross_method.style.cursor = "null";
        apply_criss_cross_method.style.opacity = "0.5";
      }
      setDisabledState();
    };
  }
}
function showCrissCrossLines() {
  const line1 = document.getElementById("cross_lines_1");
  const line2 = document.getElementById("cross_lines_2");
  const compound_explanation_box = document.getElementById(
    "compound_explanation_box",
  );
  if (compound_explanation_box)
    compound_explanation_box.style.display = "block";
  if (line1) line1.style.display = "block";
  if (line2) line2.style.display = "block";
}
function updateDisplay(elementId, text, type) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const tspan = el.querySelector("tspan");
  if (tspan) {
    // Handle subscripts for SO4, NH4, etc.
    if (text.match(/\d/)) {
      tspan.innerHTML = text; ///formatSubscripts(text);
    } else {
      tspan.textContent = text;
    }
    el.style.display = "block";
  }
}
function showCompoundName(elementId, text, type) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const img = el.querySelector("img");
  const sr = "assets/images/Gr_" + text + ".svg";
  img.setAttribute("src", sr);
}

function formatSubscripts(text) {
  return text.replace(
    /(\d+)/g,
    '<tspan baseline-shift="sub" font-size="16">$1</tspan>',
  );
}

function calculateFormula() {
  let cCharge = selectedCation.charge;
  let aCharge = selectedAnion.charge;

  // Simplify charges (GCD)
  const common = gcd(cCharge, aCharge);
  let cSub = aCharge / common;
  let aSub = cCharge / common;

  const formula = formatFormula(
    selectedCation.symbol,
    cSub,
    selectedAnion.symbol,
    aSub,
  );

  // Update the Formula area in your SVG (id="Formula")
  const formulaEl = document.querySelector("#compound_formula_display tspan");
  if (formulaEl) {
    formulaEl.innerHTML = formula;
    const compound_explanation_box = document.getElementById(
      "compound_formula_display",
    );
    if (compound_explanation_box)
      compound_explanation_box.style.display = "block";
    generateExplanation(selectedCation.symbol, selectedAnion.symbol);
    const finalFormulaElement = document.getElementById("final_formula_text");
    if (finalFormulaElement) {
      const tspan =
        finalFormulaElement.querySelector("tspan") || finalFormulaElement;
      tspan.innerHTML = `Result: ${formula}`;
    }
    result_formula_display = document.getElementById("result_formula_display");
    if (result_formula_display) {
      const tspan =
        result_formula_display.querySelector("tspan") || result_formula_display;
      tspan.innerHTML = `${formula}`;
    }
    let fullName = getCompoundName(selectedCation.symbol, selectedAnion.symbol);
    updateUIName(fullName);
  }
}

function formatFormula(cSym, cSub, aSym, aSub) {
  let part1 =
    cSub > 1 && isPolyatomic(cSym)
      ? `(${cSym})${cSub}`
      : `${cSym}${cSub > 1 ? cSub : ""}`;
  let part2 =
    aSub > 1 && isPolyatomic(aSym)
      ? `(${aSym})${aSub}`
      : `${aSym}${aSub > 1 ? aSub : ""}`;

  // Convert numbers to SVG-friendly subscripts
  return (part1 + part2).replace(
    /(\d+)/g,
    '<tspan baseline-shift="sub" font-size="20">$1</tspan>',
  );
}

function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}
function isPolyatomic(sym) {
  return (
    sym.length > 2 ||
    (sym.length === 2 &&
      sym !== "Ca" &&
      sym !== "Mg" &&
      sym !== "Fe" &&
      sym !== "Cl" &&
      sym !== "Br")
  );
}

function resetForm() {
  selectedCation = null;
  selectedAnion = null;
  location.reload(); // Simplest way to reset the SVG state
}
function generateExplanation(cKey, aKey) {
  const c = cationData[cKey];
  const a = anionData[aKey];

  // Naming Rule: Cation + Anion
  const compoundName = `${c.name} ${a.name}`;

  // Explanation Rule: Cross charges
  const line1 = `• Cross ${cKey}(${c.charge}+) charge to ${aKey} → ${c.charge} ${aKey}`;
  const line2 = `• Cross ${aKey}(${a.charge}-) charge to ${cKey} → ${a.charge} ${cKey}`;

  // Simple Result Logic (Criss-Cross)
  // Note: In real chemistry, you'd simplify Mg2O2 to MgO
  const result = `${cKey}${a.charge === 1 ? "" : a.charge}${aKey}${c.charge === 1 ? "" : c.charge}`;

  // Update the UI
  updateUI(compoundName, line1, line2, result);
  updateCrossVisual(cKey, aKey, c.charge, a.charge);
}
function updateUI(name, exp1, exp2, formula) {
  // 1. Show Compound Name (e.g., Potassium Nitrate)
  // 2. Show Explanation lines
  exp_line_1 = document.getElementById("exp_line_1");
  if (exp_line_1) {
    const tspan = exp_line_1.querySelector("tspan") || exp_line_1;
    tspan.textContent = exp1;
  }
  exp_line_2 = document.getElementById("exp_line_2");
  if (exp_line_2) {
    const tspan = exp_line_2.querySelector("tspan") || exp_line_2;
    tspan.textContent = exp2;
  }
  // 3. Show Final Formula (e.g., KNO3)
}
function updateCrossVisual(cKey, aKey, cSub, aSub) {
    console.log("🚀 ~ updateCrossVisual ~ cKey, aKey, cSub, aSub:", cKey, aKey, cSub, aSub)
    const group = document.getElementById("(1K x 1NO3)"); // Target the group
    if (!group) return;
    const tspans = group.querySelector("tspan");
    tspans.innerHTML = `(${cSub}${cKey} x ${aSub}${aKey})`;
  
}

function setDisabledState() {
     const cations = ["H", "K", "Ca", "Fe", "Na", "Mg", "Al", "NH₄"];
  const anions = ["Cl", "O", "N", "SO₄", "OH", "Br", "S", "NO₃", "CO₃"];
        for (const id of cations) {
        const el = document.getElementById(id);
        if (el) {
            el.style.pointerEvents = "none";
            el.style.cursor = "not-allowed";
            el.style.opacity = "0.5";
        }
        }
    for (const id of anions) {
        const el = document.getElementById(id);
        if (el) {
            el.style.pointerEvents = "none";
            el.style.cursor = "not-allowed";
            el.style.opacity = "0.5";
        }
    }

}
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("ruleModal");
  const closeBtn = document.querySelector(".close-btn");
  const ruleButton = document.getElementById("rules"); // Your SVG Rule button

  if (ruleButton) {
    ruleButton.style.cursor = "pointer";
    ruleButton.onclick = () => {
      modal.style.display = "block";
    };
  }

  // Close button logic
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Click outside to close
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
window.onload = init;
