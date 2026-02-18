document.addEventListener("DOMContentLoaded", () => {

  const optionsData = {
    "divisible_by_2": {
      "rule": "A number is divisible by 2 if it ends in 0, 2, 4, 6, or 8.",
      "explanation": "[target number] ends in [last digit].",
      "icorrect_explanation": "Since [target number] ends in [last digit], it is not divisible by 2."
    },
    "divisible_by_3": {
      "rule": "Sum the digits.",
      "process": "[digit1] + [digit2] + [digit3] + [digit4] = [sum].",
      "explanation": "Since [sum] is divisible by 3, [target number] is divisible by 3.",
      "incorrect_explanation": "Since [sum] is not divisible by 3, [target number] is not divisible by 3."
    },
    "divisible_by_4": {
      "rule": "Sum the digits.",
      "process": "[digit1] + [digit2] + [digit3] + [digit4] = [sum].",
      "explanation": "Since [sum] is divisible by 4, [target number] is divisible by 4.",
      "incorrect_explanation": "Check if the last 2 digits form a number divisible by 4. The last two digits are [last 2 digits], and [last 2 digits] ÷ 4 has a remainder."
    },

    "divisible_by_5": {
      "rule": "A number is divisible by 5 if it ends in 0 or 5.",
      "explanation": "[target number] ends in [last digit].",
      "incorrect_explanation": "Since [target number] ends in [last digit], it is not divisible by 5."
    },
    "divisible_by_6": {
      "rule": "Must be divisible by both 2 and 3.",
      "explanation": "[target number] is even, but digit sum [sum] is not divisible by 3.",
      "incorrect_explanation": "Since [target number] is even and the digit sum [sum] is divisible by 3, [target number] is divisible by 6."
    },
    "divisible_by_9": {
      "rule": "Sum the digits.",
      "process": "[digit1] + [digit2] + [digit3] + [digit4] = [sum].",
      "explanation": "Since [sum] ÷ 9 has a remainder, [target number] is not divisible by 9."
    },
    "divisible_by_10": {
      "rule": "A number is divisible by 10 if it ends in 0.",
      "explanation": "[target number] ends in [last digit].",
      "incorrect_explanation": "Since [target number] ends in [last digit], it is not divisible by 10."
    },
    "divisible_by_11": {
      "rule": "A number is divisible by 11 if the alternating sum of its digits is divisible by 11.",
      "explanation": "[target number] has alternating sum [alternating_sum].",
      "incorrect_explanation": "Alternating sum of digits. [target number] [target number] [target number] [target number] = [target number]. Not divisible by 11."
    },



}
  const numberItems = document.querySelectorAll(".number-wrapper li");
  const flaskContainer = document.querySelector(".flask-container");
  const finalNumberEl = document.getElementById("final-number");

  const resetBtn = document.getElementById("reset-btn");
  const newGameBtn = document.getElementById("newgame-btn");

  let currentTargetNumber = 0;
const flaskPattern = [4, 3, 1]; // bottom → top layout
let flaskItems = [];
  // 🎯 Generate random number (2-digit → 4-digit)
  function generateTargetNumber() {
    const digitLength = Math.floor(Math.random() * 3) + 2;
    // 2, 3, or 4 digits

    let min = Math.pow(10, digitLength - 1);
    let max = Math.pow(10, digitLength) - 1;

    currentTargetNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    finalNumberEl.textContent = currentTargetNumber;
  }

  // 🧪 Reset Flask Only
function resetFlask() {
  flaskItems = [];
  flaskContainer.innerHTML = "";

  numberItems.forEach(item => {
    item.classList.remove("selected");
    item.style.opacity = "1";
  });
}

  // 🎮 New Game = new number + clear flask
  function startNewGame() {
    resetFlask();
    generateTargetNumber();
  }

numberItems.forEach((item) => {
  item.addEventListener("click", () => {

    if (item.classList.contains("selected")) return;

    item.classList.add("selected", "used"); // mark only source item

const clone = item.cloneNode(true);
clone.classList.remove("used", "selected"); 
clone.classList.add("flask-item", "is-new");

flaskItems.push(clone);
renderFlask();
  });
});

function renderFlask() {
  flaskContainer.innerHTML = "";

  let itemIndex = 0;
  let rowNumber = 1;

  flaskPattern.forEach(rowCapacity => {

    if (itemIndex >= flaskItems.length) return;

    const row = document.createElement("div");

    // add default + row-specific class
    row.classList.add("flask-row", `flask-row-${rowNumber}`);

    for (let i = 0; i < rowCapacity && itemIndex < flaskItems.length; i++) {
      const ball = flaskItems[itemIndex];
      row.appendChild(ball);

      // play animation only once
      if (ball.classList.contains("is-new")) {
        ball.addEventListener("animationend", () => {
          ball.classList.remove("is-new");
        }, { once: true });
      }

      itemIndex++;
    }

    flaskContainer.appendChild(row);
    rowNumber++;
  });

  // ✅ AFTER rendering → check total count
  if (flaskItems.length === 6) {
    const row2 = flaskContainer.querySelector(".flask-row-2");
    if (row2) {
      row2.classList.add("active");
    }
  }
}
  // Button Events
  resetBtn.addEventListener("click", resetFlask);
  newGameBtn.addEventListener("click", startNewGame);

  // 🚀 Start first game automatically
  generateTargetNumber();
});
