const aSelect = document.getElementById("aValue");
const bInput = document.getElementById("bValue");

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

let mode = "addadd"; // default

function renderGrid(rows, cols, original, mode) {
  gardenGrid.innerHTML = "";

  const displayRows = Math.max(rows, original);
  const displayCols = Math.max(cols, original);

  gardenGrid.style.gridTemplateColumns = `repeat(${displayCols}, auto)`;

  for (let r = 0; r < displayRows; r++) {
    for (let c = 0; c < displayCols; c++) {
      const dot = document.createElement("div");
      dot.className = "tree";

      const isRemovedRow = r >= rows && r < original;
      const isRemovedCol = c >= cols && c < original;
      const isAddedRow = r >= original && r < rows;
      const isAddedCol = c >= original && c < cols;

      if (isAddedRow || isAddedCol) {
        dot.classList.add("new");
      }

      if (isRemovedRow || isRemovedCol) {
        dot.classList.add("removed");
      }

      gardenGrid.appendChild(dot);
    }
  }

  gridLabel.innerText = `New layout: (${cols} × ${rows})`;
}

function getValues() {
  const a = parseInt(aSelect.value, 10);
  const b = parseInt(bInput.value, 10);
  return { a, b };
}

function updateScenario() {
  const { a, b } = getValues();

  let newCols = a;
  let newRows = a;

  if (mode === "addadd") {
    newCols = a + b;
    newRows = a + b;
    scenarioText.innerText = `You increase ${b} trees along the length and ${b} rows along the width.`;
    layoutText.innerText = `New layout: (${a} + ${b}) × (${a} + ${b})`;
  }

  if (mode === "subsub") {
    newCols = Math.max(1, a - b);
    newRows = Math.max(1, a - b);
    scenarioText.innerText = `You remove ${b} trees along the length and ${b} rows along the width.`;
    layoutText.innerText = `New layout: (${a} - ${b}) × (${a} - ${b})`;
  }

  if (mode === "addsub") {
    newCols = a + b;
    newRows = Math.max(1, a - b);
    scenarioText.innerText = `You increase ${b} trees along the length and remove ${b} rows along the width.`;
    layoutText.innerText = `New layout: (${a} + ${b}) × (${a} - ${b})`;
  }

  if (mode === "subadd") {
    newCols = Math.max(1, a - b);
    newRows = a + b;
    scenarioText.innerText = `You remove ${b} trees along the length and add ${b} rows along the width.`;
    layoutText.innerText = `New layout: (${a} - ${b}) × (${a} + ${b})`;
  }

  renderGrid(newRows, newCols, a, mode);

  scenarioText.innerText = text;
  layoutText.innerText = layout;
}


function correctDelta() {
  const { a, b } = getValues();

  const original = a * a;
  let updated = original;

  if (mode === "addadd") updated = (a + b) * (a + b);
  if (mode === "subsub") updated = Math.max(1, a - b) * Math.max(1, a - b);
  if (mode === "addsub") updated = (a + b) * Math.max(1, a - b);
  if (mode === "subadd") updated = Math.max(1, a - b) * (a + b);

  return updated - original;
}

/* EVENTS */

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    mode = tab.dataset.mode;
    updateScenario();
  });
});

aSelect.addEventListener("change", updateScenario);
bInput.addEventListener("input", updateScenario);

const feedbackBox = document.getElementById("feedback");
const formulaBox = document.getElementById("formula");

hintBtn.addEventListener("click", () => {
  feedbackBox.innerHTML = `💡 <strong>Hint:</strong> How does the area change?`;
  feedbackBox.style.color = "#0f766e";
});

submitBtn.addEventListener("click", () => {
  const delta = correctDelta();
  const userDir = directionSelect.value;
  const userVal = parseInt(answerInput.value, 10);

  const actualDir = delta >= 0 ? "increase" : "decrease";
  const actualVal = Math.abs(delta);

  if (userDir === actualDir && userVal === actualVal) {
    feedbackBox.innerHTML = `✅ <strong>Correct!</strong> Great job.`;
    feedbackBox.style.color = "#15803d";

    formulaBox.innerHTML = `
      <strong>Why?</strong><br/>
      Original = ${aSelect.value} × ${aSelect.value}<br/>
      New = ${gridLabel.innerText.replace("New layout: ", "")}<br/>
      Change = ${actualDir} by ${actualVal}
    `;
  } else {
    feedbackBox.innerHTML = `❌ <strong>Not quite.</strong> Try again.`;
    feedbackBox.style.color = "#b91c1c";
    formulaBox.innerHTML = "";
  }
});

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {
  // Reset inputs
  aSelect.value = "15";
  bInput.value = 2;

  directionSelect.value = "increase";
  answerInput.value = "";

  // Reset mode to default
  mode = "addadd";
  tabs.forEach(t => t.classList.remove("active"));
  document.querySelector('[data-mode="addadd"]').classList.add("active");

  // Clear feedback
  feedbackBox.innerHTML = "";
  formulaBox.innerHTML = "";

  // Re-render grid + text
  updateScenario();
});


showBtn.addEventListener("click", () => {
  const delta = correctDelta();
  const dir = delta >= 0 ? "increase" : "decrease";
  const val = Math.abs(delta);

  feedbackBox.innerHTML = `
    📘 <strong>Solution:</strong> The number of trees will <b>${dir}</b> by <b>${val}</b>.
  `;
  feedbackBox.style.color = "#1d4ed8";

  formulaBox.innerHTML = `
    <strong>Explanation:</strong><br/>
    Original layout = a × a<br/>
    New layout = (${layoutText.innerText.replace("New layout: ", "")})<br/>
    Change = (${dir} by ${val})
  `;
});

/* INIT */
updateScenario();