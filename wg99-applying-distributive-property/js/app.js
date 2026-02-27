let scenario = "NONE";

const rowsInput = document.getElementById("rows");
const seatsInput = document.getElementById("seats");
const seatLayer = document.getElementById("seat-layer");
const answerBox = document.getElementById("answer-box");
const answerValue = document.getElementById("answer-value");
const feedback = document.getElementById("feedback");
const formulaBox = document.getElementById("formula-box");

const scenarioTextMap = {
  ADD_ROW_ADD_SEAT: "Add 1 row and 1 seat to each row",
  ADD_ROW_REMOVE_SEAT: "Add 1 row and remove 1 seat from each row",
  REMOVE_ROW_ADD_SEAT: "Remove 1 row and add 1 seat to each row",
  ADD_SEAT: "Same rows, add 1 seat to each row",
  REMOVE_SEAT: "Same rows, remove 1 seat from each row",
};

const selectedOptionText = document.getElementById("selected-option-text");

selectedOptionText.textContent = "Select an option to see changes";

// Scenario button handling


document.querySelectorAll(".scenario-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    scenario = btn.dataset.scenario;

    document.querySelectorAll(".scenario-btn").forEach((b) =>
      b.classList.remove("active")
    );
    btn.classList.add("active");

    selectedOptionText.textContent = btn.textContent;

    hideMessages();
    renderSeats();
  });
});

// Submit (Predict)
document.getElementById("btn-submit").onclick = () => {
  formulaBox.hidden = true;

  const trend = document.getElementById("trend").value;
  const guess = +document.getElementById("guess").value;

  const a = +rowsInput.value;
  const b = +seatsInput.value;
  const original = a * b;

  let newA = a;
  let newB = b;

  if (scenario === "ADD_ROW_ADD_SEAT") { newA = a + 1; newB = b + 1; }
  if (scenario === "ADD_ROW_REMOVE_SEAT") { newA = a + 1; newB = b - 1; }
  if (scenario === "REMOVE_ROW_ADD_SEAT") { newA = a - 1; newB = b + 1; }
  if (scenario === "ADD_SEAT") { newB = b + 1; }
  if (scenario === "REMOVE_SEAT") { newB = b - 1; }

  const updated = newA * newB;
  const diff = updated - original;

  const correctTrend = diff > 0 ? "increase" : "decrease";
  const correctGuess = Math.abs(diff);

  if (trend === correctTrend && guess === correctGuess) {
    feedback.textContent = "✅ Correct! Well done.";
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = "❌ Not quite. Try again or use Hint.";
    feedback.className = "feedback wrong";
  }

  feedback.hidden = false;
};

// Hint (Scenario-aware animated formula)
document.getElementById("btn-hint").onclick = () => {
  answerBox.hidden = true;
  feedback.hidden = true;

  let formulaHTML = "";

  if (scenario === "ADD_ROW_ADD_SEAT") {
    formulaHTML = `<span class="label">Hint:</span><span>(a + 1)</span><span>×</span><span>(b + 1)</span><span>=</span><span>ab</span><span>+</span><span>a</span><span>+</span><span>b</span><span>+</span><span>1</span>`;
  }

  if (scenario === "ADD_ROW_REMOVE_SEAT") {
    formulaHTML = `<span class="label">Hint:</span><span>(a + 1)</span><span>×</span><span>(b - 1)</span><span>=</span><span>ab</span><span>+</span><span>a</span><span>-</span><span>b</span><span>-</span><span>1</span>`;
  }

  if (scenario === "REMOVE_ROW_ADD_SEAT") {
    formulaHTML = `<span class="label">Hint:</span><span>(a - 1)</span><span>×</span><span>(b + 1)</span><span>=</span><span>ab</span><span>-</span><span>b</span><span>+</span><span>a</span><span>-</span><span>1</span>`;
  }

  if (scenario === "ADD_SEAT") {
    formulaHTML = `<span class="label">Hint:</span><span>a</span><span>×</span><span>(b + 1)</span><span>=</span><span>ab</span><span>+</span><span>a</span>`;
  }

  if (scenario === "REMOVE_SEAT") {
    formulaHTML = `<span class="label">Hint:</span><span>a</span><span>×</span><span>(b - 1)</span><span>=</span><span>ab</span><span>-</span><span>a</span>`;
  }

  formulaBox.innerHTML = formulaHTML;
  formulaBox.hidden = false;

  // Restart animation
  formulaBox.classList.remove("animate");
  void formulaBox.offsetWidth;
  formulaBox.classList.add("animate");
};

// Show Answer (NO formula here)
document.getElementById("btn-answer").onclick = () => {
  const a = +rowsInput.value;
  const b = +seatsInput.value;
  const original = a * b;

  let newA = a;
  let newB = b;

  if (scenario === "ADD_ROW_ADD_SEAT") { newA = a + 1; newB = b + 1; }
  if (scenario === "ADD_ROW_REMOVE_SEAT") { newA = a + 1; newB = b - 1; }
  if (scenario === "REMOVE_ROW_ADD_SEAT") { newA = a - 1; newB = b + 1; }
  if (scenario === "ADD_SEAT") { newB = b + 1; }
  if (scenario === "REMOVE_SEAT") { newB = b - 1; }

  const updated = newA * newB;
  const diff = updated - original;

  answerValue.textContent = diff > 0 ? `+${diff}` : diff;
  answerBox.hidden = false;
  feedback.hidden = true;
  formulaBox.hidden = true;
};

// Reset
document.getElementById("btn-reset").onclick = () => {
  rowsInput.value = 23;
  seatsInput.value = 27;
  scenario = "NONE";

 // Reset predict fields 👇
  document.getElementById("trend").value = "";
  document.getElementById("guess").value = "";

  document.querySelectorAll(".scenario-btn").forEach((b) => {
    b.classList.remove("active");
  });

    // ✅ Reset Selected Option text
  selectedOptionText.textContent = "Select an option to see changes";
  hideMessages();
  formulaBox.hidden = true;
  renderSeats();
};

function hideMessages() {
  answerBox.hidden = true;
  feedback.hidden = true;
  formulaBox.hidden = true;
}

// Render seats
function renderSeats() {

  const rows = Math.min(24, Math.max(1, +rowsInput.value));
  const seats = Math.min(24, Math.max(1, +seatsInput.value));

  rowsInput.value = rows;
  seatsInput.value = seats;

  let displayRows = rows;
  let displaySeats = seats;

  if (scenario === "ADD_ROW_ADD_SEAT") {
    displayRows = rows + 1;
    displaySeats = seats + 1;
  }
  if (scenario === "ADD_ROW_REMOVE_SEAT") {
    displayRows = rows + 1;
    displaySeats = seats - 1;
  }
  if (scenario === "REMOVE_ROW_ADD_SEAT") {
    displayRows = rows - 1;
    displaySeats = seats + 1;
  }
  if (scenario === "ADD_SEAT") {
    displaySeats = seats + 1;
  }
  if (scenario === "REMOVE_SEAT") {
    displaySeats = seats - 1;
  }

  displayRows = Math.max(1, displayRows);
  displaySeats = Math.max(1, displaySeats);

  seatLayer.innerHTML = "";

  const size = 32;
  const gap = 6;
  const totalWidth = displaySeats * (size + gap);
  const totalHeight = displayRows * (size + gap);

  const startX = 960 - totalWidth / 2;
  const startY = 480 - totalHeight / 2;


  // 1️⃣ Draw original grid in light grey (background reference)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < seats; c++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

      rect.setAttribute("x", startX + c * (size + gap));
      rect.setAttribute("y", startY + r * (size + gap));
      rect.setAttribute("width", size);
      rect.setAttribute("height", size);
      rect.setAttribute("rx", 4);
      rect.setAttribute("ry", 4);

      rect.setAttribute("fill", "#CBD5E1"); // 👈 light grey for removed/reference
      seatLayer.appendChild(rect);
    }
  }



  // 2️⃣ Draw new layout on top (actual result)
  for (let r = 0; r < displayRows; r++) {
    for (let c = 0; c < displaySeats; c++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

      rect.setAttribute("x", startX + c * (size + gap));
      rect.setAttribute("y", startY + r * (size + gap));
      rect.setAttribute("width", size);
      rect.setAttribute("height", size);
      rect.setAttribute("rx", 4);
      rect.setAttribute("ry", 4);

      const isExtraRow = r >= rows;
      const isExtraSeat = c >= seats;

      let fill = "#38BDF8"; // existing seats (blue)

      if (isExtraRow && isExtraSeat) fill = "#F43F5E"; // overlap (rare)
      else if (isExtraRow) fill = "#22C55E";           // new row (green)
      else if (isExtraSeat) fill = "#F59E0B";          // new column (orange)

      rect.setAttribute("fill", fill);

      // 🎬 Animate only new seats
      if (isExtraRow || isExtraSeat) {
        rect.setAttribute("class", "seat");
        rect.style.animationDelay = `${(r + c) * 0.01}s`;
        rect.getBoundingClientRect(); // force animation
      }

      seatLayer.appendChild(rect);
    }
  }
}

// Initial render
renderSeats();