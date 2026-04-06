let selectedMetal = null;
let selectedSolution = null;
let isResetting = false;

const metals = [
  { symbol: "K", name: "Potassium", color: "#8b5cf6" },
  { symbol: "Na", name: "Sodium", color: "#7c3aed" },
  { symbol: "Ca", name: "Calcium", color: "#6d28d9" },
  { symbol: "Mg", name: "Magnesium", color: "#5b21b6" },
  { symbol: "Al", name: "Aluminium", color: "#4c1d95" },
  { symbol: "Zn", name: "Zinc", color: "#3b82f6" },
  { symbol: "Fe", name: "Iron", color: "#2563eb" },
  { symbol: "Pb", name: "Lead", color: "#1d4ed8" },
  { symbol: "H", name: "Hydrogen", color: "#1e40af" },
  { symbol: "Cu", name: "Copper", color: "#f59e0b" },
  { symbol: "Hg", name: "Mercury", color: "#d97706" },
  { symbol: "Ag", name: "Silver", color: "#b45309" },
  { symbol: "Au", name: "Gold", color: "#92470E" }
];

const solutions = [
  { metal: "Zn", name: "Zinc Sulphate", formula: "ZnSO₄" },
  { metal: "Cu", name: "Copper Sulphate", formula: "CuSO₄" },
  { metal: "Fe", name: "Iron Sulphate", formula: "FeSO₄" },
  { metal: "Mg", name: "Magnesium Sulphate", formula: "MgSO₄" },
  { metal: "Ag", name: "Silver Nitrate", formula: "AgNO₃" },
  { metal: "Pb", name: "Lead Nitrate", formula: "Pb(NO₃)₂" }
];

function getSeriesColor(symbol) {
  const colors = {
    K: "#9e81f7",
    Na: "#8b63e5",
    Ca: "#7e55ce",
    Mg: "#6b49ad",
    Al: "#5f4493",
    Zn: "#659bea",
    Fe: "#5386e0",
    Pb: "#416fd6",
    H: "#3f5aa8",
    Cu: "#eab568",
    Hg: "#d68f47",
    Ag: "#af6a3a",
    Au: "#8c5a38"
  };
  return colors[symbol];
}

function getMetalColor(symbol) {
  const map = {
    K: "#8B5CF6",
    Na: "#7C3AED",
    Ca: "#6D28D9",
    Mg: "#5B21B6",
    Al: "#4C1D95",
    Zn: "#3B82F6",
    Fe: "#2563EB",
    Pb: "#1D4ED8",
    H: "#1E40AF",
    Cu: "#F59E0B",
    Hg: "#D97706",
    Ag: "#B45309",
    Au: "#92470E"
  };
  return map[symbol];
}

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

startBtn.disabled = true;
resetBtn.disabled = true;

function updateButtons() {
  if (selectedMetal && selectedSolution) {
    startBtn.disabled = false;
    resetBtn.disabled = false;
  } else {
    startBtn.disabled = true;
    resetBtn.disabled = true;
  }
}

/* LEFT LIST */
document.getElementById("reactivity-list").innerHTML = `
  ${metals.map(m => `
    <div class="series-item" data-symbol="${m.symbol}">
      <div class="symbol" style="background:${m.color}">
        ${m.symbol}
      </div>
      <span>${m.name}</span>
    </div>
  `).join("")}
`;

/* METALS */
document.getElementById("metal-options").innerHTML =
  metals.map(m => `
    <div class="metal-card" 
     data-symbol="${m.symbol}" 
     style="--metal-color: ${m.color}">
      <strong>${m.symbol}</strong>
      <span>${m.name}</span>
    </div>
  `).join("");


/* SOLUTIONS */
document.getElementById("solution-options").innerHTML =
  solutions.map(s => `
    <div class="solution-card" data-metal="${s.metal}">
      ${s.name}
      <span>${s.formula}</span>
    </div>
  `).join("");

/* EVENTS */
document.querySelectorAll(".metal-card").forEach(el => {
  el.onclick = () => {

    selectedMetal = el.dataset.symbol;

    highlight(el, ".metal-card");

   
    
        // ✅ ADD THIS
    checkAndAnimate();

        // 👇 ADD HERE
    updateLabels();
    updateButtons();
    updateSeriesHighlight();   // ✅ ADD THIS
  };
 
});

function highlight(el, selector) {
  document.querySelectorAll(selector).forEach(e => e.classList.remove("selected"));
  el.classList.add("selected");
}

document.getElementById("startBtn").onclick = () => {

  if (!selectedMetal || !selectedSolution) return;

  const reacts = getPos(selectedMetal) < getPos(selectedSolution.metal);

  // 🔥 Case 1: REACTION
  if (reacts) {
    playPopupAnimation("reactive");   // show Lottie
  } 
  // 🔥 Case 2: NO REACTION
  else {
    document.getElementById("lottie-container").innerHTML = ""; // remove animation
  }

  // ✅ Always show popup
  showResultPopup(reacts);

// small delay for smooth effect
setTimeout(() => {
  label.classList.add("drop");
}, 200);
};

document.getElementById("continueBtn").onclick = () => {
  document.getElementById("resultPopup").classList.add("hidden");
};

document.getElementById("resetBtn").onclick = () => {

  selectedMetal = null;
  selectedSolution = null;
  lastState = null;

  const metalLabel = document.getElementById("metalLabel");
  const solutionLabel = document.getElementById("solutionLabel");

  // ✅ FORCE RESET UI STATE
  metalLabel.classList.remove("drop");

  document.querySelectorAll(".selected")
    .forEach(el => el.classList.remove("selected"));

  document.querySelectorAll(".series-item")
    .forEach(el => el.classList.remove("active", "compare"));

  document.getElementById("resultPopup").classList.add("hidden");

  const drop = document.getElementById("metal-drop");
  if (drop) {
    drop.classList.remove("active");
    drop.classList.add("hidden");
  }

  if (animInstance) {
    animInstance.destroy();
    animInstance = null;
  }

  document.getElementById("beaker-lottie").innerHTML = "";

  showDefaultText();

  // ✅ SINGLE SOURCE OF TRUTH
  updateLabels();   // 👈 THIS will now correctly hide both

  updateButtons();
};

document.addEventListener("DOMContentLoaded", () => {
  showDefaultText();

});

function getPos(symbol) {
  return metals.findIndex(m => m.symbol === symbol);
}

document.querySelectorAll(".solution-card").forEach(el => {
  el.onclick = () => {
    selectedSolution = solutions.find(s => s.metal === el.dataset.metal);
    highlight(el, ".solution-card");

            // ✅ ADD THIS
    checkAndAnimate();

        // 👇 ADD HERE
    updateLabels();
    updateButtons();
    updateSeriesHighlight();   // ✅ ADD THIS

  };
  
});

document.addEventListener("DOMContentLoaded", () => {

document.getElementById("bigideabtn").onclick = () => {
  document.getElementById("bigIdeaPopup").classList.remove("hidden");
};

document.getElementById("closeIdea").onclick = () => {
  document.getElementById("bigIdeaPopup").classList.add("hidden");
};

});

document.getElementById("bigIdeaPopup").onclick = function(e){
  if(e.target.id === "bigIdeaPopup"){
    this.classList.add("hidden");
  }
};

let animInstance = null;

function playAnimation(type) {

  const container = document.getElementById("beaker-lottie");

  // destroy previous animation
  if (animInstance) {
    animInstance.destroy();
  }

  hideDefaultText();
  container.innerHTML = "";

  let path = "";

  if (type === "reactive") {
    path = "assets/animations/reactive.json";
  } else if (type === "non-reactive") {
    path = "assets/animations/non-reactive.json";
  } else if (type === "correct") {
    path = "assets/animations/correct-answer.json";
  }

  // ✅ FIX: assign to animInstance
  animInstance = lottie.loadAnimation({
    container: container,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: path
  });

  // ✅ SAFE DOM manipulation
  animInstance.addEventListener("DOMLoaded", () => {

    const svg = container.querySelector("svg");
    if (!svg) return;

    // 🎯 MOVE METAL STRIP (adjust index if needed)
      const metalGroup = [...svg.querySelectorAll("g")]
        .find(g => g.innerHTML.includes(selectedMetal));
      if (metalGroup) {
        metalGroup.setAttribute("transform", "matrix(1,0,0,1,175,420)");
      }

    // 🎯 COLOR METAL
    const metalPart = svg.querySelector("path");
    if (metalPart && selectedMetal) {
      metalPart.setAttribute("fill", getMetalColor(selectedMetal));
    }

  });
}

function showDefaultText() {
  document.getElementById("defaultText").style.display = "block";
}

function hideDefaultText() {
  document.getElementById("defaultText").style.display = "none";
}



let lastState = null;

function checkAndAnimate() {

  if (!selectedMetal || !selectedSolution) return;

  const metalPos = getPos(selectedMetal);
  const solutionPos = getPos(selectedSolution.metal);

  const reacts = metalPos < solutionPos;

  if (reacts === lastState) return; // ✅ prevents repeat

  lastState = reacts;

  playAnimation(reacts ? "reactive" : "non-reactive");
}

function updateLabels() {


  const metalLabel = document.getElementById("metalLabel");
  const solutionLabel = document.getElementById("solutionLabel");

  // ✅ SHOW METAL LABEL if metal selected
  if (selectedMetal) {
    metalLabel.innerText = selectedMetal;
    metalLabel.style.background = getMetalColor(selectedMetal);
    metalLabel.classList.remove("hidden");
  } else {
    metalLabel.classList.add("hidden");
  }

  // ✅ SHOW SOLUTION LABEL only if selected
  if (selectedSolution) {
    solutionLabel.innerHTML = `
      Solution<br>${selectedSolution.formula}
    `;
    solutionLabel.classList.remove("hidden");
  } else {
    solutionLabel.classList.add("hidden");
  }
}

function showResultPopup(reacts) {

  const popup = document.getElementById("resultPopup");

  const title = reacts
    ? "Displacement Reaction Occurs!"
    : "No Reaction";

  const equation = reacts
    ? `${selectedMetal} + ${selectedSolution.formula} → ${selectedMetal}${selectedSolution.formula.replace(selectedSolution.metal, '')} + ${selectedSolution.metal} ↓`
    : `${selectedMetal} + ${selectedSolution.formula} → No Reaction`;

  const explanation = reacts
    ? `${selectedMetal} is more reactive than ${selectedSolution.metal}. It displaces it.`
    : `${selectedMetal} is less reactive than ${selectedSolution.metal}. No displacement occurs.`;

  const why = reacts
    ? "More reactive metals lose electrons easily."
    : "Less reactive metals cannot displace more reactive metals.";

  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-explain").innerText = explanation;
  document.getElementById("popup-why").innerText = why;
  document.getElementById("popup-equation").innerText = equation;

  // 🔥 COLOR CONTROL
  const card = document.querySelector(".popup-card");

  if (reacts) {
    card.style.background = "linear-gradient(0deg, #065f46, #1bad27)"; // green
  } else {
    card.style.background = "linear-gradient(0deg, #7f1d1d, #be0000)"; // red

    // ❌ remove animation if no reaction
    document.getElementById("lottie-container").innerHTML = "";
  }

  popup.classList.remove("hidden");


}

function playPopupAnimation(type) {

  const container = document.getElementById("lottie-container");

  // clear previous
  container.innerHTML = "";

  let path = "assets/animations/correct-answer.json";

  lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path
  });
}

function updateSeriesHighlight() {

  document.querySelectorAll(".series-item").forEach(item => {
  const symbol = item.dataset.symbol;
  item.style.setProperty("--series-color", getSeriesColor(symbol));
});

  // clear all
  document.querySelectorAll(".series-item")
    .forEach(i => i.classList.remove("active", "compare"));

  // highlight selected metal
  if (selectedMetal) {
    document.querySelector(`.series-item[data-symbol="${selectedMetal}"]`)
      ?.classList.add("active");
  }

  // highlight solution metal (comparison)
  if (selectedSolution) {
    document.querySelector(`.series-item[data-symbol="${selectedSolution.metal}"]`)
      ?.classList.add("compare");
  }
}

