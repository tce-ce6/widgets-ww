/* ---------------- STATE ---------------- */

let a = 14;
let b = 2;
let mode = "addadd";

/* ---------------- ELEMENTS ---------------- */

const tabs = document.querySelectorAll(".tab");

const scenarioText = document.getElementById("scenarioText");
const layoutText = document.getElementById("layoutText");

const gardenGrid = document.getElementById("gardenGrid");
const gridLabel = document.getElementById("gridLabel");

const directionSelect = document.getElementById("direction");
const answerInput = document.getElementById("answerInput");

const hintBtn = document.getElementById("hintBtn");
const submitBtn = document.getElementById("submitBtn");
const showBtn = document.getElementById("showBtn");
const resetBtn = document.getElementById("resetBtn");

const hintOverlay = document.getElementById("hintOverlay");
const closeHintBtn = document.getElementById("closeHint");
const hintContent = document.querySelector(".hint-content");

const resultOverlay = document.getElementById("resultOverlay");
const resultCloseBtn = document.getElementById("resultCloseBtn");
const resultTitle = document.getElementById("resultTitle");
const resultFormula = document.getElementById("resultFormula");
const resultCalc = document.getElementById("resultCalc");

/* Stepper */
const aDisplay = document.getElementById("aDisplay");
const aBig = document.getElementById("aBig");
const bDisplay = document.getElementById("bDisplay");
const bBig = document.getElementById("bBig");

const aMinus = document.getElementById("aMinus");
const aPlus = document.getElementById("aPlus");
const bMinus = document.getElementById("bMinus");
const bPlus = document.getElementById("bPlus");



const modeSelected = document.getElementById("modeSelected");
const modeOptions = document.getElementById("modeOptions");
const modeOptionEls = document.querySelectorAll(".mode-option");
const modeDropdown = document.getElementById("modeDropdown");


document.addEventListener("DOMContentLoaded", () => {
  const modeDropdown = document.getElementById("modeDropdown");
  const modeSelected = document.getElementById("modeSelected");
  const modeOptions = document.getElementById("modeOptions");
  const modeOptionEls = document.querySelectorAll(".mode-option");

function updateModeText() {
  const b = parseInt(document.getElementById("bDisplay").innerText);

  const treeWord = pluralize("tree", b);
  const rowWord = pluralize("row", b);

  const mode = currentMode; // your existing selected mode variable

  let text = "";

  if (mode === "addadd") {
    text = `Add ${b} ${treeWord} and ${b} ${rowWord}`;
  } else if (mode === "subsub") {
    text = `Remove ${b} ${treeWord} and ${b} ${rowWord}`;
  } else if (mode === "addsub") {
    text = `Add ${b} ${treeWord} and remove ${b} ${rowWord}`;
  } else if (mode === "subadd") {
    text = `Remove ${b} ${treeWord} and add ${b} ${rowWord}`;
  }

  document.getElementById("modeSelected").innerText = text;
}

function updateDropdownOptions() {
  const b = parseInt(document.getElementById("bDisplay").innerText);

  const treeWord = pluralize("tree", b);
  const rowWord = pluralize("row", b);

  document.querySelector('[data-mode="addadd"]').innerText =
    `Add ${b} ${treeWord} and ${b} ${rowWord}`;

  document.querySelector('[data-mode="subsub"]').innerText =
    `Remove ${b} ${treeWord} and ${b} ${rowWord}`;

  document.querySelector('[data-mode="addsub"]').innerText =
    `Add ${b} ${treeWord} and remove ${b} ${rowWord}`;

  document.querySelector('[data-mode="subadd"]').innerText =
    `Remove ${b} ${treeWord} and add ${b} ${rowWord}`;
}

  if (!modeDropdown || !modeSelected || !modeOptions) {
    console.error("Dropdown elements not found in DOM");
    return;
  }

 
function plural(word, count) {
  return count === 1 ? word : word + "s";
}

  // Select option
  modeOptionEls.forEach(opt => {
    opt.addEventListener("click", () => {
      mode = opt.dataset.mode;

      // Update button label
      modeSelected.firstChild.textContent = opt.textContent + " ";

      // Close dropdown
      modeOptions.classList.add("hidden");

      // Trigger your existing logic
      updateScenario();
    });
  });

  // Close on outside click

});



// Toggle open/close
modeSelected.addEventListener("click", (e) => {
  e.stopPropagation();
  modeOptions.classList.toggle("hidden");
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!modeDropdown.contains(e.target)) {
    modeOptions.classList.add("hidden");
  }
});



// Toggle dropdown
modeSelected.addEventListener("click", () => {
  modeOptions.classList.toggle("hidden");
});

// Click option
modeOptionEls.forEach(opt => {
  opt.addEventListener("click", () => {
    mode = opt.dataset.mode;

    // Update selected label
    modeSelected.childNodes[0].nodeValue = getModeLabel(mode);

    // Close dropdown
    modeOptions.classList.add("hidden");

    // Re-render scenario + grid
    updateScenario();
  });
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  const dd = document.getElementById("modeDropdown");
  if (!dd.contains(e.target)) {
    modeOptions.classList.add("hidden");
  }
});

// Keep labels in sync when b changes


function syncValues() {
  aDisplay.innerText = a;
  aBig.innerText = a;
  bDisplay.innerText = b;
  bBig.innerText = b;

  updateTabLabels();
  updateScenario();

  if (window.updateDropdownLabel) updateDropdownLabel();
   updateScenarioHeader();   
}

/* ---------------- HELPERS ---------------- */

function pluralize(word, value) {
  return value === 1 ? word : word + "s";
}

function prettyExpr(a, op, b) {
  const sign = op === "-" ? "−" : "+";
  return `(${a} ${sign} ${b})`;
}

function getValues() {
  return { a, b };
}

/* ---------------- GRID ---------------- */

function renderGrid(rows, cols, original) {
  gardenGrid.innerHTML = "";

  const displayRows = Math.max(rows, original);
  const displayCols = Math.max(cols, original);

  gardenGrid.style.gridTemplateColumns = `repeat(${displayCols}, auto)`;

  for (let r = 0; r < displayRows; r++) {
    for (let c = 0; c < displayCols; c++) {
      const dot = document.createElement("div");
      dot.className = "tree";

      const inOriginal = r < original && c < original;
      const inNew = r < rows && c < cols;

      const isAddedRow = r >= original && r < rows;
      const isAddedCol = c >= original && c < cols;

      const isRemovedRow = r >= rows && r < original;
      const isRemovedCol = c >= cols && c < original;

      if (inOriginal && inNew) dot.classList.add("original");

      if (isAddedRow || isAddedCol) {
        dot.classList.add("new");
        dot.style.animationDelay = `${(r + c) * 12}ms`;
      }

      if (isRemovedRow || isRemovedCol) dot.classList.add("removed");

      gardenGrid.appendChild(dot);
    }
  }

  gridLabel.innerText = `New layout: (${cols} × ${rows})`;
}

/* ---------------- SCENARIO ---------------- */

function updateScenario() {
  const treeWord = pluralize("tree", b);
  const rowWord = pluralize("row", b);

  let newCols = a;
  let newRows = a;

  if (mode === "addadd") {
    newCols = a + b;
    newRows = a + b;
    scenarioText.innerText = `You add ${b} ${treeWord} along the length and ${b} ${rowWord} along the width.`;
    layoutText.innerText = `New layout: ${prettyExpr(a, "+", b)} × ${prettyExpr(a, "+", b)}`;
  }

  if (mode === "subsub") {
    newCols = a - b;
    newRows = a - b;
    scenarioText.innerText = `You remove ${b} ${treeWord} along the length and ${b} ${rowWord} along the width.`;
    layoutText.innerText = `New layout: ${prettyExpr(a, "-", b)} × ${prettyExpr(a, "-", b)}`;
  }

  if (mode === "addsub") {
    newCols = a + b;
    newRows = a - b;
    scenarioText.innerText = `You add ${b} ${treeWord} along the length and remove ${b} ${rowWord} along the width.`;
    layoutText.innerText = `New layout: ${prettyExpr(a, "+", b)} × ${prettyExpr(a, "-", b)}`;
  }

  if (mode === "subadd") {
    newCols = a - b;
    newRows = a + b;
    scenarioText.innerText = `You remove ${b} ${treeWord} along the length and add ${b} ${rowWord} along the width.`;
    layoutText.innerText = `New layout: ${prettyExpr(a, "-", b)} × ${prettyExpr(a, "+", b)}`;
  }

  renderGrid(newRows, newCols, a);
}

function updateScenarioHeader() {
  const scenarioDesc = document.getElementById("scenarioDesc");

  if (!scenarioDesc) return;

  scenarioDesc.innerHTML = `
    <strong>Scenario:</strong> You have a square garden you can plant 
    ${a} trees lengthwise and along the width. 
    You're planning to change it by 
    ${mode.includes("sub") ? "removing" : "increasing"} ${b} ${pluralize("tree", b)} lengthwise and 
    ${mode.endsWith("sub") ? "removing" : "increasing"} ${b} ${pluralize("tree", b)} widthwise and 
    want to know how many more or fewer trees you'll have, without actual calculations.
  `;
}

/* ---------------- TABS ---------------- */

function updateTabLabels() {
  tabs.forEach(tab => {
    const template = tab.dataset.template;
    if (!template) return;

    tab.textContent = template
      .replace(/{{b}}/g, b)
      .replace(/{{tree}}/g, pluralize(b, "tree", "trees"))
      .replace(/{{row}}/g, pluralize(b, "row", "rows"));
  });
}

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    mode = tab.dataset.mode;
    updateScenario();
  };
});

/* ---------------- STEPPERS ---------------- */



aMinus.onclick = () => { if (a > 3) { a--; syncValues(); }};
aPlus.onclick = () => { if (a < 14) { a++; syncValues(); }};
bMinus.onclick = () => { if (b > 1) { b--; syncValues(); }};
bPlus.onclick = () => { if (b < 6) { b++; syncValues(); }};

/* ---------------- POPUPS ---------------- */

hintBtn.onclick = () => {
  const { hintTitle, hintText } = buildHintContent(mode, a, b);

  hintContent.innerHTML = `
    <h3>${hintTitle}</h3>
    <div>${hintText}</div>
  `;

  hintOverlay.classList.remove("hidden");
};

closeHintBtn.onclick = () => {
  hintOverlay.classList.add("hidden");
};

// Close hint popup when clicking outside the hint box
hintOverlay.addEventListener("click", (e) => {
  const popup = document.querySelector(".hint-popup");
  if (!popup.contains(e.target)) {
    hintOverlay.classList.add("hidden");
  }
});

submitBtn.onclick = () => {
  const direction = document.getElementById("direction").value;
  const userAnswer = Number(document.getElementById("answerInput").value);

  const { title, formulaText, calcText, changeValue } =
    buildResultContent(mode, a, b);

  const isIncrease = changeValue > 0;

  const isCorrect =
    (isIncrease && direction === "increase" && userAnswer === Math.abs(changeValue)) ||
    (!isIncrease && direction === "decrease" && userAnswer === Math.abs(changeValue));

  if (isCorrect) {
    resultTitle.innerText = title;
    resultFormula.innerHTML = formulaText;
    resultCalc.innerHTML = calcText;
  } else {
    resultTitle.innerText = "Almost there!";
    resultFormula.innerText = "Try using the distributive identity for this case.";
    resultCalc.innerText = "";
  }

  resultOverlay.classList.remove("hidden");
};

showBtn.onclick = () => {
  const { formulaText, calcText } = buildResultContent(mode, a, b);

  resultTitle.innerText = "Solution";   // 👈 dynamic header
  resultFormula.innerHTML = formulaText;
  resultCalc.innerHTML = calcText;

  resultOverlay.classList.remove("hidden");
};

function buildHintContent(mode, a, b) {
  let hintTitle = "Hint";
  let hintText = "";

  if (mode === "addadd") {
    hintText = `
      Think of the new garden as the old square plus:
      <ul>
        <li>one extra strip of <strong>${a} trees</strong> along the side,</li>
        <li>another extra strip of <strong>${a} trees</strong> along the bottom,</li>
        <li>and a small corner square of <strong>${b} × ${b}</strong> trees.</li>
      </ul>
      Can you express the extra trees using <strong>2ab + b²</strong>?
    `;
  }

  if (mode === "subsub") {
    hintText = `
      Visualize removing strips of trees from two sides of the square.
      You lose two strips of <strong>${a} × ${b}</strong> trees, but the small corner
      of <strong>${b} × ${b}</strong> gets counted twice.
      How does this relate to <strong>-2ab + b²</strong>?
    `;
  }

  if (mode === "addsub" || mode === "subadd") {
    hintText = `
      One side grows while the other shrinks.
      Notice how the long strips cancel out.
      The change depends only on the small square of side <strong>b</strong>.
      What does <strong>a² - b²</strong> tell you about the change?
    `;
  }

  return { hintTitle, hintText };
}


resultCloseBtn.onclick = () => resultOverlay.classList.add("hidden");

// Close result popup when clicking outside the modal
resultOverlay.addEventListener("click", (e) => {
  const modal = document.querySelector(".result-modal");

  // If the click is NOT inside the modal, close overlay
  if (!modal.contains(e.target)) {
    resultOverlay.classList.add("hidden");
  }
});

function buildResultContent(mode, a, b) {
  let formulaText = "";
  let calcText = "";
  let changeValue = 0;

  if (mode === "addadd") {
    // (a + b)(a + b)
    formulaText = `
      <strong>Formula for change:</strong><br><br>
      (a + b)(a + b) = a² + 2ab + b²,
      where a² denotes the original number of trees
    `;
    changeValue = 2 * a * b + b * b;

    calcText = `
      2ab + b² = 2 (${a}) (${b}) + (${b})²
      = ${2 * a * b} + ${b * b}
      = <strong>${changeValue} more trees</strong>
    `;
  }

  if (mode === "subsub") {
    formulaText = `
      <strong>Formula for change:</strong><br><br>
      (a - b)(a - b) = a² - 2ab + b²
    `;
    changeValue = -(2 * a * b - b * b);

    calcText = `
      -2ab + b² = -2 (${a}) (${b}) + (${b})²
      = -${2 * a * b} + ${b * b}
      = <strong>${Math.abs(changeValue)} fewer trees</strong>
    `;
  }

  if (mode === "addsub" || mode === "subadd") {
    formulaText = `
      <strong>Formula for change:</strong><br><br>
      (a + b)(a - b) = a² - b²
    `;
    changeValue = -(b * b);

    calcText = `
      Change = - b² = -(${b})²
      = <strong>${b * b} fewer trees</strong>
    `;
  }

  return { formulaText, calcText, changeValue };
}

/* ---------------- RESET ---------------- */

resetBtn.onclick = () => {
  a = 14;
  b = 2;
  mode = "addadd";

  tabs.forEach(t => t.classList.remove("active"));
  document.querySelector('[data-mode="addadd"]').classList.add("active");

  syncValues();
};

/* ---------------- DROPDOWN (CLEAN) ---------------- */
/* ---------------- MODE DROPDOWN (READY) ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  const modeDropdown = document.getElementById("modeDropdown");
  const modeSelected = document.getElementById("modeSelected");
  const modeOptions = document.getElementById("modeOptions");

  if (!modeDropdown || !modeSelected || !modeOptions) {
    console.warn("Mode dropdown elements not found");
    return;
  }

  const modeOptionEls = modeOptions.querySelectorAll(".mode-option");

function getModeLabel(m) {
  const treeWord = pluralize("tree", b);
  const rowWord = pluralize("row", b);

  if (m === "addadd") return `Add ${b} ${treeWord} and ${b} ${rowWord}`;
  if (m === "subsub") return `Remove ${b} ${treeWord} and ${b} ${rowWord}`;
  if (m === "addsub") return `Add ${b} ${treeWord} and remove ${b} ${rowWord}`;
  if (m === "subadd") return `Remove ${b} ${treeWord} and add ${b} ${rowWord}`;
  return "";
}

  // Open / close dropdown
  modeSelected.addEventListener("click", (e) => {
    e.stopPropagation();
    modeOptions.classList.toggle("hidden");
  });

  // Select option
  modeOptionEls.forEach(opt => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      mode = opt.dataset.mode;
      modeSelected.firstChild.textContent = getModeLabel(mode) + " ";
      modeOptions.classList.add("hidden");
      updateScenario(); // your existing function
    });
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    modeOptions.classList.add("hidden");
  });

  // Keep label updated when b changes
  window.updateDropdownLabel = function () {
    modeSelected.firstChild.textContent = getModeLabel(mode) + " ";
  };
});

/* ---------------- INIT ---------------- */

updateTabLabels();
syncValues();