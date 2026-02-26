document.addEventListener("DOMContentLoaded", () => {
  const optionsData = {
    divisible_by_2: {
      rule: "A number is divisible by 2 if it ends in 0, 2, 4, 6, or 8.",
      explanation: "[target number] ends in [last digit].",
      incorrect_explanation:
        "Since [target number] ends in [last digit], it is not divisible by 2.",
    },
    divisible_by_3: {
      rule: "Sum the digits.",
      process: "[digit1] + [digit2] + [digit3] + [digit4] = [sum].",
      explanation:
        "Since [sum] is divisible by 3, [target number] is divisible by 3.",
      incorrect_explanation:
        "Since [sum] is not divisible by 3, [target number] is not divisible by 3.",
    },
    divisible_by_4: {
      rule: "Check if the last 2 digits form a number divisible by 4.",
      explanation:
        "The last two digits are [last 2 digits], and [last 2 digits] ÷ 4 = [result] with no remainder.",
      incorrect_explanation:
        "The last two digits are [last 2 digits], and [last 2 digits] ÷ 4 has a remainder.",
    },
    divisible_by_5: {
      rule: "A number is divisible by 5 if it ends in 0 or 5.",
      explanation: "[target number] ends in [last digit].",
      incorrect_explanation:
        "Since [target number] ends in [last digit], it is not divisible by 5.",
    },
    divisible_by_6: {
      rule: "Must be divisible by both 2 and 3.",
      explanation:
        "Since [target number] is even and the digit sum [sum] is divisible by 3, [target number] is divisible by 6.",
      incorrect_explanation:
        "[target number] is even, but digit sum [sum] is not divisible by 3.",
    },
    divisible_by_9: {
      rule: "Sum the digits. If the sum is divisible by 9, so is the number.",
      process: "[digit1] + [digit2] + [digit3] + [digit4] = [sum].",
      explanation:
        "Since [sum] is divisible by 9, [target number] is divisible by 9.",
      incorrect_explanation:
        "Since [sum] ÷ 9 has a remainder, [target number] is not divisible by 9.",
    },
    divisible_by_10: {
      rule: "A number is divisible by 10 if it ends in 0.",
      explanation:
        "[target number] ends in [last digit], so it is divisible by 10.",
      incorrect_explanation:
        "Since [target number] ends in [last digit], it is not divisible by 10.",
    },
    divisible_by_11: {
      rule: "A number is divisible by 11 if the alternating sum of its digits is divisible by 11.",
      explanation:
        "[target number] has alternating digit sum [alternating_sum], which is divisible by 11.",
      incorrect_explanation:
        "[target number] has alternating digit sum [alternating_sum], which is not divisible by 11.",
    },
  };

  // ─── DOM refs ───────────────────────────────────────────────────────────────
  const numberItems = document.querySelectorAll(".number-wrapper li");
  const flaskContainer = document.querySelector(".flask-container");
  const finalNumberEl = document.getElementById("final-number");
  const noteEl = document.getElementById("note");
  const resetBtn = document.getElementById("reset-btn");
  const newGameBtn = document.getElementById("newgame-btn");
  const ansStatusEl = document.getElementById("ans-status");
  const noteCardEl = document.getElementById("note-card");
  const noteVerdictEl = document.getElementById("note-verdict");
  const noteRuleEl = document.getElementById("note-rule");
  const noteProcessEl = document.getElementById("note-process");
  const noteExplainEl = document.getElementById("note-explanation");
  const lottieContainer = document.getElementById("lottie-anim");
  const incorrectFlask = document.querySelector(".incorrect-flask");
  let incorrectItems = [];
  let currentAnimation = null;
  let currentTargetNumber = 0;
  const flaskPattern = [4, 3, 1]; // bottom → top layout
  let flaskItems = [];

  // ─── Divisibility helpers ────────────────────────────────────────────────────
  function digitSum(n) {
    return String(n)
      .split("")
      .reduce((acc, d) => acc + Number(d), 0);
  }

  function alternatingSum(n) {
    const digits = String(n).split("").map(Number);
    // from left: +d[0] −d[1] +d[2] −d[3] …
    return digits.reduce((acc, d, i) => acc + (i % 2 === 0 ? d : -d), 0);
  }

  function lastTwoDigits(n) {
    return n % 100;
  }

  // ─── Build note for a given divisor ─────────────────────────────────────────
  function buildNote(divisor, targetNumber) {
    const key = `divisible_by_${divisor}`;
    const data = optionsData[key];
    if (!data) return null;

    const num = targetNumber;
    const numStr = String(num);
    const digits = numStr.split("").map(Number);
    const lastDigit = digits[digits.length - 1];
    const sum = digitSum(num);
    const altSum = alternatingSum(num);
    const last2 = lastTwoDigits(num);
    const isDivisible = num % divisor === 0;

    // Build digit-sum process string (only the actual digits)
    const digitProcess = digits.join(" + ") + " = " + sum;

    // Replace template placeholders
    function fill(template) {
      if (!template) return "";
      return template
        .replace(/\[target number\]/g, num)
        .replace(/\[last digit\]/g, lastDigit)
        .replace(/\[last 2 digits\]/g, last2)
        .replace(/\[sum\]/g, sum)
        .replace(/\[alternating_sum\]/g, altSum)
        .replace(/\[result\]/g, Math.floor(last2 / 4))
        .replace(/\[digit1\]/g, digits[0] ?? "")
        .replace(/\[digit2\]/g, digits[1] ?? "")
        .replace(/\[digit3\]/g, digits[2] ?? "")
        .replace(/\[digit4\]/g, digits[3] ?? "");
    }

    const rule = fill(data.rule);
    const processStr = data.process ? digitProcess : null; // use real digit sum for "process"
    const explanation = isDivisible
      ? fill(data.explanation)
      : fill(data.incorrect_explanation);
    const verdict = isDivisible
      ? `<strong>${num}</strong> is a factor!</strong>`
      : `<strong>${num}</strong> is NOT a factor!</strong>`;

    return { rule, processStr, explanation, verdict, isDivisible };
  }

  // ─── Render all notes for currently selected balls ───────────────────────────
  function renderNotes(lastSelectedDivisor) {
    const note = buildNote(lastSelectedDivisor, currentTargetNumber);
    if (!note) return;
    // 🔥 Update #note state class
    noteEl.classList.remove("correct", "incorrect");
    noteEl.classList.add(note.isDivisible ? "correct" : "incorrect");
    // ✔ Update text
    ansStatusEl.textContent = note.isDivisible ? "Correct" : "Incorrect";

    noteCardEl.className = note.isDivisible
      ? "note-card note-correct"
      : "note-card note-incorrect";

    noteVerdictEl.innerHTML = note.verdict;
    noteRuleEl.textContent = note.rule;
    noteExplainEl.textContent = note.explanation;

    if (note.processStr) {
      noteProcessEl.style.display = "inline-block";
      noteProcessEl.textContent = note.processStr;
    } else {
      noteProcessEl.style.display = "none";
    }

    // ✔ Replace animation instead of stacking new ones
    if (currentAnimation) {
      currentAnimation.destroy();
    }

    const animationPath = note.isDivisible
      ? "lottie/correct.json"
      : "lottie/incorrect.json";

    currentAnimation = lottie.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: animationPath,
    });
  }

  // ─── Generate random number (2–4 digits) ────────────────────────────────────
  function generateTargetNumber() {
    const digitLength = Math.floor(Math.random() * 3) + 2;
    const min = Math.pow(10, digitLength - 1);
    const max = Math.pow(10, digitLength) - 1;
    currentTargetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    finalNumberEl.textContent = currentTargetNumber;
  }

  // ─── Reset Flask ─────────────────────────────────────────────────────────────
  function resetFlask() {
    incorrectFlask.classList.remove("active");
    flaskItems = [];
    incorrectItems = []; // ⭐ add this

    flaskContainer.innerHTML = "";
    incorrectFlask.innerHTML = ""; // ⭐ add this

    numberItems.forEach((item) => {
      item.classList.remove("selected", "used", "disabled");
    });

    ansStatusEl.textContent = "";
    noteVerdictEl.textContent = "";
    noteRuleEl.textContent = "";
    noteProcessEl.textContent = "";
    noteExplainEl.textContent = "";

    noteEl.classList.remove("correct", "incorrect");

    if (currentAnimation) {
      currentAnimation.destroy();
      currentAnimation = null;
    }
  }

  // ─── New Game ────────────────────────────────────────────────────────────────
  function startNewGame() {
    resetFlask();
    generateTargetNumber();
  }

  // ─── Ball click ─────────────────────────────────────────────────────────────
  numberItems.forEach((item) => {
    item.addEventListener("click", () => {
      const divisorMap = [2, 3, 4, 5, 6, 9, 10, 11];
      const clickedIndex = Array.from(numberItems).indexOf(item);
      const divisor = divisorMap[clickedIndex];

      // check correctness WITHOUT changing existing logic
      const note = buildNote(divisor, currentTargetNumber);
      item.classList.add("disabled");
      // clone for animation
      const clone = item.cloneNode(true);
      clone.classList.remove("used", "selected");
      clone.classList.add("flask-item", "is-new");

      if (note.isDivisible) {
        flaskItems.push(clone); // ✅ existing correct flask
        renderFlask();
      } else {
        incorrectItems.push(clone); // ❌ send to incorrect flask
        renderIncorrectFlask();
      }

      renderNotes(divisor); // keep your existing behaviour
    });
  });

  // ─── Render Flask ────────────────────────────────────────────────────────────

  function renderIncorrectFlask() {
  incorrectFlask.innerHTML = "";

  const itemsPerRow = 4; // keep same flat layout
  let row = null;
  let rowNumber = 1;

  incorrectItems.forEach((ball, index) => {
    // create a new row every 4 items
    if (index % itemsPerRow === 0) {
      row = document.createElement("div");

      // keep same class structure
      row.classList.add("flask-row", `flask-row-${rowNumber}`);

      incorrectFlask.appendChild(row);
      rowNumber++;
    }

    row.appendChild(ball);

    if (ball.classList.contains("is-new")) {
      ball.addEventListener(
        "animationend",
        () => ball.classList.remove("is-new"),
        { once: true }
      );
    }
  });

  // ✅ ADD THIS BLOCK (no existing behaviour changed)
  incorrectFlask.classList.remove("active");
  if (incorrectItems.length === 5 || incorrectItems.length === 7) {
    incorrectFlask.classList.add("active");
  }
}
  function renderFlask() {
    flaskContainer.innerHTML = "";

    let itemIndex = 0;
    let rowNumber = 1;

    flaskPattern.forEach((rowCapacity) => {
      if (itemIndex >= flaskItems.length) return;

      const row = document.createElement("div");
      row.classList.add("flask-row", `flask-row-${rowNumber}`);

      for (let i = 0; i < rowCapacity && itemIndex < flaskItems.length; i++) {
        const ball = flaskItems[itemIndex];
        row.appendChild(ball);

        if (ball.classList.contains("is-new")) {
          ball.addEventListener(
            "animationend",
            () => {
              ball.classList.remove("is-new");
            },
            { once: true },
          );
        }

        itemIndex++;
      }

      flaskContainer.appendChild(row);
      rowNumber++;
    });

    if (flaskItems.length === 6) {
      const row2 = flaskContainer.querySelector(".flask-row-2");
      if (row2) row2.classList.add("active");
    }
  }

  // ─── Button events ───────────────────────────────────────────────────────────
  resetBtn.addEventListener("click", resetFlask);
  newGameBtn.addEventListener("click", startNewGame);

  // ─── Start ───────────────────────────────────────────────────────────────────
  generateTargetNumber();
});
