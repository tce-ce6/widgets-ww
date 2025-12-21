const baseLoShu = [
  [8, 1, 6],
  [3, 5, 7],
  [4, 9, 2]
];

const sumsFixed15 = [15];
const sums16to50 = [18, 24, 39, 45, 36, 21, 27, 48, 33, 42, 30, 60];
const sums51to100 = [51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96];

let magicConstant = 15;
let currentSolution = null;
let currentMode = "fixed15";
let messageLottie = null;

function playMessageLottie(jsonPath) {
  const container = document.getElementById("lottie-msg");
  if (!container) return;

  // Destroy previous animation if exists
  if (messageLottie) {
    messageLottie.destroy();
    messageLottie = null;
  }

  document.getElementById("lottie-msg").innerHTML = "";


  container.innerHTML = ""; // clear previous svg

  messageLottie = lottie.loadAnimation({
    container: container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: jsonPath
  });
}


function getCells() {
  const ids = [
    "c00", "c01", "c02",
    "c10", "c11", "c12",
    "c20", "c21", "c22"
  ];
  return ids.map(id => document.getElementById(id));
}

function randIndex(len) {
  return Math.floor(Math.random() * len);
}

function pickMagicConstant(mode, prevConst) {
  let options;
  if (mode === "fixed15") {
    options = sumsFixed15;
  } else if (mode === "range16to50") {
    options = sums16to50;
  } else if (mode === "range51to100") {
    options = sums51to100;
  } else {
    options = sumsFixed15;
  }

  let choice = options[randIndex(options.length)];
  if (options.length > 1 && choice === prevConst) {
    choice = options[randIndex(options.length)];
  }
  return choice;
}

function allDistinctPositive(square) {
  const seen = new Set();
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const v = square[r][c];
      if (!Number.isInteger(v) || v <= 0) return false;
      if (seen.has(v)) return false;
      seen.add(v);
    }
  }
  return true;
}

function buildDistinctSolution(targetSum) {
  const S = targetSum;

  for (let k = 1; k <= 5; k++) {
    const numerator = S - 15 * k;
    if (numerator % 3 !== 0) continue;
    const d = numerator / 3;

    const candidate = [];
    for (let r = 0; r < 3; r++) {
      candidate[r] = [];
      for (let c = 0; c < 3; c++) {
        candidate[r][c] = k * baseLoShu[r][c] + d;
      }
    }

    if (!allDistinctPositive(candidate)) continue;

    const sumRow0 = candidate[0][0] + candidate[0][1] + candidate[0][2];
    const sumRow1 = candidate[1][0] + candidate[1][1] + candidate[1][2];
    const sumRow2 = candidate[2][0] + candidate[2][1] + candidate[2][2];
    const sumCol0 = candidate[0][0] + candidate[1][0] + candidate[2][0];
    const sumCol1 = candidate[0][1] + candidate[1][1] + candidate[2][1];
    const sumCol2 = candidate[0][2] + candidate[1][2] + candidate[2][2];
    const sumDiag1 = candidate[0][0] + candidate[1][1] + candidate[2][2];
    const sumDiag2 = candidate[0][2] + candidate[1][1] + candidate[2][0];

    if (
      sumRow0 === S && sumRow1 === S && sumRow2 === S &&
      sumCol0 === S && sumCol1 === S && sumCol2 === S &&
      sumDiag1 === S && sumDiag2 === S
    ) {
      return candidate;
    }
  }

  return baseLoShu;
}

function setMessage(text, type) {
  const msgEl = document.getElementById("message");
  const textEl = document.getElementById("message-text");

  // Hide message completely if no text
  if (!text) {
    msgEl.style.display = "none";
    textEl.textContent = "";
    return;
  }

  // Show message when text exists
  msgEl.style.display = "block";
  textEl.textContent = text;

  msgEl.classList.remove("ok", "warn", "err");
  if (type) msgEl.classList.add(type);
}

const grid = document.getElementById("grid");

// Activate on input click
grid.addEventListener("click", e => {
  const input = e.target.closest("input[type='number']");
  if (!input) return;

  // Remove active from all cells
  document.querySelectorAll(".grid > div.active")
    .forEach(d => d.classList.remove("active"));

  // Add active to clicked cell
  input.parentElement.classList.add("active");
});

// Remove active when clicking outside grid
document.addEventListener("click", e => {
  if (!e.target.closest("#grid")) {
    document.querySelectorAll(".grid > div.active")
      .forEach(d => d.classList.remove("active"));
  }
});


document.querySelectorAll(".grid > div").forEach(cellWrap => {
  const input = cellWrap.querySelector("input");
  const inc = cellWrap.querySelector(".increment");
  const dec = cellWrap.querySelector(".decrement");

  // Increment
  inc.addEventListener("click", e => {
    if (input.readOnly) return;

    const step = Number(input.step) || 1;
    const max = input.max ? Number(input.max) : Infinity;
    const current = input.value === "" ? 0 : Number(input.value);

    if (current + step <= max) {
      input.value = current + step;
      input.dispatchEvent(new Event("input"));
    }
  });

  // Decrement
  dec.addEventListener("click", e => {
    e.preventDefault();
    if (input.readOnly) return;

    const step = Number(input.step) || 1;
    const min = input.min ? Number(input.min) : 0;
    const current = input.value === "" ? min : Number(input.value);

    if (current - step >= min) {
      input.value = current - step;
      input.dispatchEvent(new Event("input"));
    }
  });
});



function newGame() {
  const cells = getCells();
  cells.forEach(c => {
    c.value = "";
    c.readOnly = false;
    c.classList.remove("correct", "wrong");
  });
  setMessage("", null);

  magicConstant = pickMagicConstant(currentMode, magicConstant);
  currentSolution = buildDistinctSolution(magicConstant);
  document.getElementById("magic-sum").textContent = magicConstant;

  const positions = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      positions.push({ r, c });
    }
  }
  positions.sort(() => Math.random() - 0.5);

  const prefillCount = 4;
  for (let i = 0; i < prefillCount; i++) {
    const { r, c } = positions[i];
    const id = `c${r}${c}`;
    const cell = document.getElementById(id);
    cell.value = currentSolution[r][c];
    cell.readOnly = true;
    cell.classList.add("correct");
  }

  for (let i = prefillCount; i < positions.length; i++) {
    const { r, c } = positions[i];
    const id = `c${r}${c}`;
    const cell = document.getElementById(id);
    cell.readOnly = false;
    cell.classList.remove("correct", "wrong");
  }
}

function checkSquare() {
  const solution = currentSolution;
  if (!solution) return;

  const cells = getCells();
  let allFilled = true;
  let allCorrect = true;

  cells.forEach(cell => {
    if (!cell.readOnly) {
      cell.classList.remove("correct", "wrong");
    }
  });

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.getElementById(`c${r}${c}`);
      const val = cell.value.trim();

      if (val === "") {
        allFilled = false;
        continue;
      }

      const num = Number(val);
      if (!Number.isInteger(num) || num <= 0) {
        allCorrect = false;
        if (!cell.readOnly) {
          cell.classList.add("wrong");
        }
        continue;
      }

      if (num === solution[r][c]) {
        if (!cell.readOnly) {
          cell.classList.add("correct");
        }
      } else {
        allCorrect = false;
        if (!cell.readOnly) {
          cell.classList.add("wrong");
        }
      }
    }
  }

  if (!allFilled) {
    setMessage("Fill in all empty squares, then try again.", "warn");
    playMessageLottie("lottie/empty_box.json");

  } else if (allCorrect) {
    setMessage("Awesome! Your magic square is correct.", "ok");
    playMessageLottie("lottie/correct.json");

  } else {
    setMessage("Some numbers are not matching yet. Keep trying!", "err");
    playMessageLottie("lottie/incorrect.json");

  }
}

function showAnswer() {
  if (!currentSolution) return;
  const cells = getCells();
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.getElementById(`c${r}${c}`);
      cell.value = currentSolution[r][c];
      cell.readOnly = true;
      cell.classList.remove("wrong");
      cell.classList.add("correct");
    }
  }
  setMessage("Here is the correct magic square.", "ok");
  playMessageLottie("correct.json");

}

document.querySelectorAll('input[name="rangeMode"]').forEach(radio => {
  radio.addEventListener("change", function () {
    currentMode = this.value;
    newGame();
  });
});

document.getElementById("checkBtn").addEventListener("click", checkSquare);
document.getElementById("newBtn").addEventListener("click", function () {
  newGame();
});
document.getElementById("showBtn").addEventListener("click", showAnswer);

magicConstant = 15;
currentMode = "fixed15";
newGame();