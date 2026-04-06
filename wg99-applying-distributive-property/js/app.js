let scenario = "NONE";
let animateSeats = true;

let a = 23;
let b = 18;

const aDisplay = document.getElementById("aDisplay");
const bDisplay = document.getElementById("bDisplay");

const aBig = document.getElementById("aBig");
const bBig = document.getElementById("bBig");

const aPlus = document.getElementById("aPlus");
const aMinus = document.getElementById("aMinus");

const bPlus = document.getElementById("bPlus");
const bMinus = document.getElementById("bMinus");
const selectedOptionHeader = document.getElementById("selected-option-header");
const optionLabel = document.getElementById("option-label");
const selectedOptionText = document.getElementById("selected-option-text");

optionLabel.textContent = "Current Theater Layout:";
selectedOptionText.textContent = "";
selectedOptionText.style.display = "none";

function updateDisplays() {

  a = Math.min(24, Math.max(1, a));
  b = Math.min(22, Math.max(1, b));

  aDisplay.textContent = a;
  aBig.textContent = a;

  bDisplay.textContent = b;
  bBig.textContent = b;

  renderSeats();
}
const seatLayer = document.getElementById("seat-layer");
const screenLayer = document.getElementById("screen-layer");
const answerBox = document.getElementById("answer-box");
const answerValue = document.getElementById("answer-value");
const feedback = document.getElementById("feedback");
const formulaBox = document.getElementById("formula-box");

aPlus.addEventListener("click", () => {
  if (a < 24) {
    a++;
    updateDisplays();
  }
});

aMinus.addEventListener("click", () => {
  if (a > 1) {
    a--;
    updateDisplays();
  }
});

bPlus.addEventListener("click", () => {
  if (b < 22) {
    b++;
    updateDisplays();
  }
});

bMinus.addEventListener("click", () => {
  if (b > 1) {
    b--;
    updateDisplays();
  }
});

const scenarioTextMap = {
  ADD_ROW_ADD_SEAT: "Add 1 row and 1 seat to each row",
  ADD_ROW_REMOVE_SEAT: "Add 1 row and remove 1 seat from each row",
  REMOVE_ROW_ADD_SEAT: "Remove 1 row and add 1 seat to each row",
  ADD_SEAT: "Same rows, add 1 seat to each row",
  REMOVE_SEAT: "Same rows, remove 1 seat from each row",
};



// Scenario button handling


document.querySelectorAll(".scenario-btn").forEach((btn) => {
  btn.addEventListener("click", () => {

    scenario = btn.dataset.scenario;

    document.querySelectorAll(".scenario-btn").forEach((b) =>
      b.classList.remove("active")
    );

    btn.classList.add("active");

    selectedOptionHeader.style.display = "flex";

    optionLabel.textContent = "Selected Option:";
    selectedOptionText.textContent = btn.textContent;
    selectedOptionText.style.display = "inline-block";

    hideMessages();

    renderSeats();

    updateActionButtons(); 
  });
});

const submitBtn = document.getElementById("btn-submit");
const answerBtn = document.getElementById("btn-answer");

submitBtn.disabled = true;
answerBtn.disabled = true;

function updateActionButtons() {

  const trend = document.getElementById("trend").value;
  const guess = document.getElementById("guess").value;

  const ready = scenario !== "NONE" && trend !== "" && guess !== "";

  submitBtn.disabled = !ready;
  answerBtn.disabled = !ready;
}

document.getElementById("trend").addEventListener("change", updateActionButtons);
document.getElementById("guess").addEventListener("input", updateActionButtons);

// Submit (Predict)
document.getElementById("btn-submit").onclick = () => {

  const trend = document.getElementById("trend").value;
  const guess = +document.getElementById("guess").value;

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

  const title = document.getElementById("submit-title");
  const steps = document.getElementById("submit-steps");
  const result = document.getElementById("submit-result");
  const submitModal = document.getElementById("submit-modal");

  if (trend === correctTrend && guess === correctGuess) {
    title.innerHTML = "Well done!";
    title.style.color = "#1f7a34";
  } else {
    title.innerHTML = "Not quite. Let's see the correct explanation.";
    title.style.color = "#c62828";
  }

  let explanation = "";

  if (scenario === "ADD_ROW_ADD_SEAT") {

    explanation = `
    (a + 1)(b + 1) = ab + a + b + 1<br><br>
    ${a} + ${b} + 1 = ${a + b + 1} seats<br><br>
    ${b} seats from new row<br>
    ${a} seats from new column<br>
    +1 corner seat
    `;
  }

  if (scenario === "ADD_ROW_REMOVE_SEAT") {

    explanation = `
    (a + 1)(b − 1) = ab − a + b − 1<br><br>
    −${a} seats removed from each row<br>
    +${b} seats from new row<br>
    −1 overlap seat
    `;
  }

  if (scenario === "REMOVE_ROW_ADD_SEAT") {

    explanation = `
    (a − 1)(b + 1) = ab + a − b − 1<br><br>
    +${a} seats added per row<br>
    −${b} seats removed from removed row<br>
    −1 overlap seat
    `;
  }

  if (scenario === "ADD_SEAT") {

    explanation = `
    a(b + 1) = ab + a<br><br>
    +${a} seats because each row gains one seat
    `;
  }

  if (scenario === "REMOVE_SEAT") {

    explanation = `
    a(b − 1) = ab − a<br><br>
    −${a} seats because each row loses one seat
    `;
  }

  steps.innerHTML = explanation;

  result.innerHTML =
    `<strong>${Math.abs(diff)} ${diff > 0 ? "more" : "fewer"} seats</strong>`;

  submitModal.style.display = "flex";
};

const solutionModal = document.getElementById("solution-modal");

solutionModal.addEventListener("click", function(e) {

  if (!e.target.closest(".solution-box")) {
    solutionModal.style.display = "none";
  }

});

document.querySelectorAll(".popup-close").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".solution-modal").style.display = "none";
  });
});

document.querySelectorAll(".solution-modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if (!e.target.closest(".solution-box")) {
      modal.style.display = "none";
    }
  });
});


// Hint (Scenario-aware animated formula)
document.getElementById("btn-hint").onclick = () => {

  const solutionBox = document.querySelector("#solution-modal .solution-box");
  solutionBox.classList.add("hint-theme");

  const trend = document.getElementById("trend").value;
  const guess = document.getElementById("guess").value;

  const title = document.getElementById("solution-title");

  let hintText = "";

  if (scenario === "NONE") {

    title.innerHTML = "<strong>Try this:</strong>";

    hintText = `
    1️⃣ First choose a <b>scenario</b> to see how the seating layout changes.<br><br>
    2️⃣ Observe the new rows or seats added in the theatre diagram.<br><br>
    3️⃣ Predict whether the total seats will <b>increase or decrease</b>.<br><br>
    4️⃣ Then estimate <b>how many seats change</b>.
    `;

  }

  else if (trend === "" || guess === "") {

    title.innerHTML = "<strong>Hint:</strong>";

    hintText = `
    Look at the theatre layout carefully.<br><br>

    • Are rows being added or removed?<br>
    • Are seats per row increasing or decreasing?<br><br>

    Use the distributive idea:<br><br>

    <b>(a ± 1)(b ± 1)</b>
    `;

  }

else {

  title.innerHTML = "<strong>Formula for change:</strong>";

  if (scenario === "ADD_ROW_ADD_SEAT") {

    hintText = `
    (${a} + 1)(${b} + 1)<br><br>

    Using distributive property:<br><br>

    ab + a + b + 1<br><br>

    ${a} + ${b} + 1 seats change
    `;

  }

  else if (scenario === "ADD_ROW_REMOVE_SEAT") {

    hintText = `
    (${a} + 1)(${b} − 1)<br><br>

    Using distributive property:<br><br>

    ab − a + b − 1<br><br>

    −${a} + ${b} − 1 seats change
    `;

  }

  else if (scenario === "REMOVE_ROW_ADD_SEAT") {

    hintText = `
    (${a} − 1)(${b} + 1)<br><br>

    Using distributive property:<br><br>

    ab + a − b − 1<br><br>

    ${a} − ${b} − 1 seats change
    `;

  }

  else if (scenario === "ADD_SEAT") {

    hintText = `
    ${a}(${b} + 1)<br><br>

    ab + a<br><br>

    ${a} seats added
    `;

  }

  else if (scenario === "REMOVE_SEAT") {

    hintText = `
    ${a}(${b} − 1)<br><br>

    ab − a<br><br>

    ${a} seats removed
    `;

  }

}

  document.getElementById("solution-header").textContent = "Hint";
  document.getElementById("solution-steps").innerHTML = hintText;
  document.getElementById("solution-result").innerHTML = "";

  solutionModal.style.display = "flex";
};

const modal = document.getElementById("solution-modal");

const solutionSteps = document.getElementById("solution-steps");
const solutionResult = document.getElementById("solution-result");


document.getElementById("btn-answer").onclick = () => {

  const solutionBox = document.querySelector("#solution-modal .solution-box");
  solutionBox.classList.remove("hint-theme");

  const original = a * b;

  document.querySelector("#solution-modal .solution-header").textContent = "Solution";

  let newA = a;
  let newB = b;

  let explanation = "";
  let resultText = "";

  if (scenario === "ADD_ROW_ADD_SEAT") {

    newA = a + 1;
    newB = b + 1;

    const change = a + b + 1;

    explanation = `
    (a + 1)(b + 1) = ab + a + b + 1<br><br>

    (${a} + 1)(${b} + 1)<br><br>

    +${a} seats from the new column<br>
    +${b} seats from the new row<br>
    +1 corner seat<br><br>

    ${a} + ${b} + 1 = ${change}
    `;

    resultText = `${change} more seats`;
  }


  if (scenario === "ADD_ROW_REMOVE_SEAT") {

    newA = a + 1;
    newB = b - 1;

    const change = -a + b - 1;

    explanation = `
    (a + 1)(b − 1) = ab − a + b − 1<br><br>

    (${a} + 1)(${b} − 1)<br><br>

    −${a} seats removed because each row loses one seat<br>
    +${b} seats added from the new row<br>
    −1 overlap seat<br><br>

    −${a} + ${b} − 1 = ${change}
    `;

    resultText = `${Math.abs(change)} fewer seats`;
  }


  if (scenario === "REMOVE_ROW_ADD_SEAT") {

    newA = a - 1;
    newB = b + 1;

    const change = a - b - 1;

    explanation = `
    (a − 1)(b + 1) = ab + a − b − 1<br><br>

    (${a} − 1)(${b} + 1)<br><br>

    +${a} seats added because each row gains one seat<br>
    −${b} seats removed from the removed row<br>
    −1 overlap seat<br><br>

    ${a} − ${b} − 1 = ${change}
    `;

    resultText = `${Math.abs(change)} fewer seats`;
  }


  if (scenario === "ADD_SEAT") {

    newB = b + 1;

    explanation = `
    a(b + 1) = ab + a<br><br>

    ${a}(${b} + 1)<br><br>

    +${a} seats because each row gains one seat
    `;

    resultText = `${a} more seats`;
  }


  if (scenario === "REMOVE_SEAT") {

    newB = b - 1;

    explanation = `
    a(b − 1) = ab − a<br><br>

    ${a}(${b} − 1)<br><br>

    −${a} seats because each row loses one seat
    `;

    resultText = `${a} fewer seats`;
  }

  solutionSteps.innerHTML = explanation;

  solutionResult.innerHTML =
    `<strong>${resultText}</strong>`;

  document.getElementById("solution-modal").style.display = "flex";
};


document.getElementById("btn-reset").onclick = () => {

  a = 23;
  b = 18;

  scenario = "NONE";

  document.getElementById("trend").value = "";
  document.getElementById("guess").value = "";

  document.querySelectorAll(".scenario-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  optionLabel.textContent = "Current Theater Layout:";
  selectedOptionText.textContent = "";
  selectedOptionText.style.display = "none";

  hideMessages();
  formulaBox.hidden = true;

  submitBtn.disabled = true;
  answerBtn.disabled = true;

  updateDisplays();   // cleaner
};

function hideMessages() {
  answerBox.hidden = true;
  feedback.hidden = true;
  formulaBox.hidden = true;
}

function drawScreen() {

  screenLayer.innerHTML = "";

  const screenWidth = 900;
  const screenHeight = 80;

  const screenX = (1920 - screenWidth) / 2;
  const screenY = 120;

  const screen = document.createElementNS("http://www.w3.org/2000/svg", "rect");

  screen.setAttribute("x", screenX);
  screen.setAttribute("y", screenY);
  screen.setAttribute("width", screenWidth);
  screen.setAttribute("height", screenHeight);
  screen.setAttribute("rx", 20);
  screen.setAttribute("fill", "#1f2937");

  screenLayer.appendChild(screen);


  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

  text.setAttribute("x", screenX + screenWidth / 2);
  text.setAttribute("y", screenY + 50);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "36");
  text.setAttribute("fill", "white");
  text.setAttribute("font-weight", "700");

  text.textContent = "SCREEN";

  screenLayer.appendChild(text);

}


// Render seats
function renderSeats() {

  const rows = Math.min(24, Math.max(1, a));
  const seats = Math.min(24, Math.max(1, b));

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

  const maxWidth = 1200;
  const maxHeight = 650;

  const size = Math.min(
  maxWidth / displaySeats,
  maxHeight / displayRows
) * 0.8;

  const gap = size * 0.25;
  const totalWidth = displaySeats * (size + gap);
  const totalHeight = displayRows * (size + gap);

  const startX = (1920 - totalWidth) / 2;
  const startY = 260;
  


// 1️⃣ Draw original grid in grey (reference layout)

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < seats; c++) {

    const seat = document.createElementNS("http://www.w3.org/2000/svg", "image");

    seat.setAttributeNS(null, "href", "./assets/grey-seat.png");

    seat.setAttribute("x", startX + c * (size + gap));
    seat.setAttribute("y", startY + r * (size + gap));

    seat.setAttribute("width", size);
    seat.setAttribute("height", size);

    seatLayer.appendChild(seat);
  }
}

// 2️⃣ Draw new layout on top

for (let r = 0; r < displayRows; r++) {
  for (let c = 0; c < displaySeats; c++) {

    const seat = document.createElementNS("http://www.w3.org/2000/svg", "image");

    seat.setAttribute("x", startX + c * (size + gap));
    seat.setAttribute("y", startY + r * (size + gap));

    seat.setAttribute("width", size);
    seat.setAttribute("height", size);

    const isExtraRow = r >= rows;
    const isExtraSeat = c >= seats;

    let seatImage = "./assets/blue-seat.png";

    if (isExtraRow) seatImage = "./assets/green-seat.png";
    else if (isExtraSeat) seatImage = "./assets/orange-seat.png";

    seat.setAttributeNS(null, "href", seatImage);

    if (isExtraRow || isExtraSeat) {
      if (animateSeats) {
        seat.classList.add("seat");
        seat.style.animationDelay = `${r * 0.04}s`;
      }
    }

    seatLayer.appendChild(seat);

  }
}

}
// Initial render
drawScreen();
updateDisplays();