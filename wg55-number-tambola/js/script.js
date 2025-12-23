function numberToWords(num) {
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const t = Math.floor(num / 10),
      o = num % 10;
    return o === 0 ? tens[t] : tens[t] + " " + ones[o];
  }
  const h = Math.floor(num / 100),
    rest = num % 100;
  let res = ones[h] + " hundred";
  if (rest === 0) return res;
  if (rest < 10) return res + " " + ones[rest];
  if (rest < 20) return res + " " + teens[rest - 10];
  const t2 = Math.floor(rest / 10),
    o2 = rest % 10;
  if (o2 === 0) return res + " " + tens[t2];
  return res + " " + tens[t2] + " " + ones[o2];
}

function fillRangeDropdown() {
  const select = document.getElementById("number-range");
  select.innerHTML = "";
  for (let i = 100; i <= 900; i += 100) {
    let opt = document.createElement("option");
    opt.value = `${i}-${i + 99}`;
    opt.textContent = `${i}-${i + 99}`;
    select.appendChild(opt);
  }
  select.value = "100-199";
}

function randInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function getRandomDigitInRange(min, max) {
  let digits = new Set();
  for (let n = min; n <= max; n++) {
    String(n)
      .split("")
      .forEach((d) => digits.add(d));
  }
  let arr = Array.from(digits).filter((d) => d !== "0");
  return pick(arr);
}

let currentAnswers = [],
  selectedClue = -1,
  cluesStatus = [],
  totalStars = 0,
  cluesCount = 2,// 6
  finished = false;
let clueTextsGlobal = [],
  answersPerClueGlobal = [],
  gridCellMap = new Map();
let isShowingBack = false;
let correctCount = 0;
let clueAttempted = false; // Track if clue attempt used
let gridBlocked = false; // Block all grid clicks
let showAnswerUsed = false; // Track if Show Answer used
let currentRange = "";

function getGridAndClues(min, max) {
  let pool = [],
    used = [],
    answers = [];
  for (let i = min; i <= max; i++) pool.push(i);

  let clue1 = pick(pool);
  answers[0] = [clue1];
  used.push(clue1);
  let digX = getRandomDigitInRange(min, max);
  let digArr = pool.filter((n) => n.toString().includes(digX));
  let clue2 = pick(digArr);
  answers[1] = digArr;
  used.push(clue2);

  let s = randInRange(min, max - 6),
    e = randInRange(s + 3, Math.min(max, s + 6));
  let c3 = pool.filter((x) => x > s && x < e);
  let clue3Num = pick(c3);
  answers[2] = c3;
  used.push(clue3Num);

  let t1 = pool.filter((n) => Math.floor(n / 10) % 10 === 1);
  answers[3] = t1.length ? t1 : [pick(pool)];
  used.push(pick(answers[3]));
  let x5Arr = pool.filter((n) => n + 2 <= max),
    b5 = pick(x5Arr),
    n5 = b5 + 2;
  answers[4] = [n5];
  used.push(n5);
  let x6Arr = pool.filter((n) => n - 5 >= min),
    n6 = pick(x6Arr),
    b6 = n6 - 5;
  answers[5] = [b6];
  used.push(b6);

  while (used.length < 16) {
    let c = pick(pool);
    if (!used.includes(c)) used.push(c);
  }
  for (let i = used.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [used[i], used[j]] = [used[j], used[i]];
  }

  const clue1Name = numberToWords(clue1);
  let clueTexts = [
    `Find the number ${clue1Name}.`,
    `Tap a number that has the digit ${digX}.`,
    `Spot any number between ${s} and ${e}.`,
    `Choose a number that has 1 as the tens digit.`,
    `Find the number which is 2 more than ${b5}.`,
    `Pick the number which is 5 less than ${n6}.`,
  ];
  return { grid: used, clueListText: clueTexts, answersPerClue: answers };
}

function showMessage(txt, ok) {
  const msg = document.getElementById("message");

  // ✅ ensure text span exists (NOT the lottie span)
  let textSpan = msg.querySelector(".message-text");
  if (!textSpan) {
    textSpan = document.createElement("span");
    textSpan.className = "message-text";
    msg.appendChild(textSpan);
  }

  textSpan.textContent = txt;
  msg.className = ok ? "message" : "message incorrect";
  msg.style.display = "block";

  // ✅ play emoji lottie
  playMessageLottie(ok ? "correct" : "wrong");
}



function clearAllCrosses(callee) {
  console.log("clearAllCrosses callee: ", callee)
  document.querySelectorAll(".cell-front.crossed").forEach((cell) => {
    cell.classList.remove("crossed");
  });
  document.querySelectorAll(".cell-inner.correct").forEach((cell) => {
    cell.classList.remove("correct");
  });
  document.querySelectorAll(".cell-front.wrong").forEach((cell) => {
    cell.classList.remove("wrong");
  });
  document.querySelectorAll(".cell-inner.clicked").forEach((cell) => {
    cell.classList.remove("clicked");
  });

  document.querySelectorAll(".cell-outer").forEach((cell) => {
    // console.log("cell: ", cell)
    removeResultLottie(cell, "correct");
    removeResultLottie(cell, "wrong");
  });

}

function updateScoreArea() {
  // const scoreArea = document.getElementById("scoreArea");
  // scoreArea.innerHTML = finished
  //   ? `Total stars gained: ${totalStars} / ${cluesCount} ⭐`
  //   : "";
}
function handlePlayAgainClick(callee) {
  console.log("handlePlayAgainClick callee: ", callee)

  document.getElementById("clue-info").style.display = "none";

  const clueControls = document.getElementById("clueControls");
  if (clueControls) clueControls.style.display = "";

  buildGame(currentRange);

}

function disableNewGrid(callee) {
  console.log("disableNewGrid callee: ", callee)
  document.getElementById("generate").disabled = true;
  document.getElementById("number-range").disabled = true;
}
function enableNewGrid(callee) {
  console.log("enableNewGrid callee: ", callee)
  document.getElementById("generate").disabled = false;
  document.getElementById("number-range").disabled = false;
  finished = false;
  totalStars = 0;
  correctCount = 0;
  selectedClue = -1;
  clueAttempted = false;
  gridBlocked = false;
  showAnswerUsed = false;
  updateScoreArea();
  document.getElementById("showBtn").disabled = true;
  document.getElementById("flipFront").textContent = "";
  document.getElementById("flipFront").classList.remove("disabled");
  cluesStatus = Array(cluesCount).fill(null);
  document.querySelectorAll(".cell-inner, .cell-front").forEach((el) => {
    el.classList.remove(
      "clicked",
      "crossed",
      "flipped",
      "correct",
      "show-highlight",
      "grid-blocked"
    );
  });
  hideWrongMessage("from enableNewGrid");


}

function updateShowButton() {
  const showBtn = document.getElementById("showBtn");

  const shouldDisable =
    !isShowingBack ||        // ❌ card not flipped
    selectedClue === -1 ||   // ❌ no clue yet
    finished ||              // ❌ game finished
    showAnswerUsed;          // ❌ already used for this clue

  showBtn.disabled = shouldDisable;
  showBtn.classList.toggle("disabled", shouldDisable);
}



function showClueInfo() {
  const clueInfo = document.getElementById("clue-info");
  if (!clueInfo) return;

  const correctEl = clueInfo.querySelector("#correct-answers");
  const totalEl = clueInfo.querySelector("#total-questions");

  if (correctEl) correctEl.textContent = correctCount;
  if (totalEl) totalEl.textContent = cluesCount;

  clueInfo.style.display = "block";

  // hide clue controls
  const clueControls = document.getElementById("clueControls");
  if (clueControls) clueControls.style.display = "none";

  enablePlayAgain("from showClueInfo");
}

function generateNextClue() {
  if (selectedClue >= cluesCount - 1) {
    document.getElementById("flipFront").textContent = "No more clues!";
    document.getElementById("flipFront").classList.add("disabled");

    // ✅ ADD THESE LINES
    showClueInfo();

    return false;
  }

  selectedClue++;
  currentAnswers = answersPerClueGlobal[selectedClue];
  clueAttempted = false;
  gridBlocked = false;
  showAnswerUsed = false;
  const myClueText = clueTextsGlobal[selectedClue];
  console.log("pkp mini-browser: ~ generateNextClue ~ myClueText:", myClueText)
  document.getElementById("flipBack").textContent = myClueText;

  document.getElementById("flipFront").textContent = "";
  document.getElementById("flipCard").classList.add("flipped");
  isShowingBack = true;
  updateShowButton();
  document
    .querySelectorAll(".cell-inner")
    .forEach((ci) => ci.classList.remove("show-highlight"));

  // ✅ FIX: clear previous clue interaction states
  document.querySelectorAll(".cell-inner").forEach((ci) => {
    ci.classList.remove("clicked");
  });

  document.querySelectorAll(".cell-front").forEach((cf) => {
    cf.classList.remove("crossed");
  });


  hideWrongMessage("from generateNextClue");

  return true;
}

/* document.querySelector("#showBtn").onclick = () => {
  alert("hello")
  document.getElementById("clue-info").style.display = "none";

  // ✅ restore controls
  const clueControls = document.getElementById("clueControls");
  if (clueControls) clueControls.style.display = "";
  resetStarSvgs(); // ⭐

  buildGame(currentRange);
}; */

function hideWrongMessage(callee) {
  console.log("hideWrongMessage callee: ", callee)
  const msgDiv = document.getElementById("message");
  if (msgDiv) {
    msgDiv.style.display = "none";
  } else {
    console.log("hideWrongMessage message div not found");
  }
}
function handleFlipCardClick(callee) {
  console.log("handleFlipCardClick callee isShowingBack: ", callee, isShowingBack)
  if (finished) return;
  const front = document.getElementById("flipFront");
  if (front.classList.contains("disabled")) return;

  hideWrongMessage("from flip");

  const flipCard = document.getElementById("flipCard");

  if (!isShowingBack) {
    if (!generateNextClue()) return;
  } else {
    // Auto flip back and show "New Clue"
    flipCard.classList.remove("flipped");
    isShowingBack = false;
    document.getElementById("flipFront").textContent = "";
  }
  clearAllCrosses("from flip");
}

function highlightAnswerForCurrentClue() {
  if (selectedClue === -1) {
    showMessage("Tap clue card first to generate clue!", false);
    return;
  }

  document
    .querySelectorAll(".cell-inner")
    .forEach((ci) => ci.classList.remove("show-highlight"));

  currentAnswers.forEach((answerNum) => {
    const outer = gridCellMap.get(answerNum);
    if (outer) {
      outer.querySelector(".cell-inner").classList.add("show-highlight");
    }
  });

  clearAllCrosses("from highlight");

  showMessage(
    "This is the correct number(s) for current clue! Tap card for next clue.",
    true
  );

  gridBlocked = true;
  document
    .querySelectorAll(".cell-inner")
    .forEach((ci) => ci.classList.add("grid-blocked"));
  showAnswerUsed = true;
  document.getElementById("showBtn").disabled = true;

  // ✅ NEW: flip card back after Show Answer
  setTimeout(() => {
    document.getElementById("flipCard").classList.remove("flipped");
    isShowingBack = false;
    document.getElementById("flipFront").textContent = "";
    updateShowButton();
  }, 800);
}


function handleCorrectAnswer(cellOuter) {
  const inner = cellOuter.querySelector(".cell-inner");

  inner.classList.add("flipped", "correct");

  // ⭐ RESTORED: add star sequentially based on correct answers
  const star = document.getElementById(`star-${correctCount + 1}`);
  if (star) star.classList.add("correct");

  // keep lottie animation
  playResultLottie(cellOuter, "correct");

  correctCount++;
  totalStars++;
  cluesStatus[selectedClue] = "correct";

  // ✅ NEW: when all answers are correct
  if (correctCount === cluesCount) {
    const msg = document.getElementById("message");
    if (msg) msg.style.display = "none";

    const playAgainBtn = document.querySelector("#clue-info #showBtn");
    if (playAgainBtn) playAgainBtn.disabled = false;
  }

  setTimeout(() => {
    document.getElementById("flipCard").classList.remove("flipped");
    isShowingBack = false;
    document.getElementById("flipFront").textContent = "";
    updateShowButton();
  }, 1200);
}

function resetStarSvgs() {
  document.querySelectorAll('[id^="star-"]').forEach((star) => {
    star.classList.remove("correct");
  });
}


function buildGame(r) {
  resetStarSvgs(); // ⭐ RESET STARS

  currentRange = r;
  let [min, max] = r.split("-").map(Number);
  let { grid, clueListText, answersPerClue } = getGridAndClues(min, max);
  answersPerClueGlobal = answersPerClue;
  clueTextsGlobal = clueListText;
  selectedClue = -1;
  currentAnswers = [];
  cluesStatus = Array(cluesCount).fill(null);
  totalStars = 0;
  finished = false;
  correctCount = 0;
  clueAttempted = false;
  gridBlocked = false;
  showAnswerUsed = false;
  updateScoreArea();
  document.getElementById("playAgainArea").innerHTML = "";
  gridCellMap.clear();
  isShowingBack = false;

  const flipCard = document.getElementById("flipCard");
  flipCard.classList.remove("flipped");
  document.getElementById("flipFront").classList.remove("disabled");
  document.getElementById("flipFront").textContent = "Clue Cards";
  document.getElementById("flipBack").textContent = "";
  document.getElementById("showBtn").disabled = true;

  const gridDiv = document.getElementById("grid");
  gridDiv.innerHTML = "";
  grid.forEach((n) => {
    const outer = document.createElement("div");
    outer.className = "cell-outer";

    const inner = document.createElement("div");
    inner.className = "cell-inner";

    const frontFace = document.createElement("div");
    frontFace.className = "cell-face cell-front";
    frontFace.textContent = n;

    const backFace = document.createElement("div");
    backFace.className = "cell-face cell-back";
    backFace.textContent = "";

    inner.appendChild(frontFace);
    inner.appendChild(backFace);
    outer.appendChild(inner);

    gridCellMap.set(n, outer);

    outer.onclick = function () {
      // Block if finished, no clue, correct cell, grid blocked
      if (finished || selectedClue === -1 || gridBlocked) {
        return;
      }

      // If this cell was marked correct earlier, allow clicking only
      // when the current clue actually expects this number again.
      if (inner.classList.contains("correct") && !currentAnswers.includes(n)) {
        return;
      }

      // Only one attempt per clue
      if (clueAttempted) {
        showMessage('One click used! Tap "Show Answer".', false);
        return;
      }

      clueAttempted = true;

      if (currentAnswers.includes(n)) {
        showMessage("Correct!", true);
        handleCorrectAnswer(outer);
        cluesStatus[selectedClue] = "correct";
      } else {
        showMessage("Incorrect! Tap Show Answer.", false);
        frontFace.classList.add("crossed");
        inner.classList.add("clicked");
        playResultLottie(outer, "wrong");
        cluesStatus[selectedClue] = "incorrect";
      }

      document
        .querySelectorAll(".cell-inner")
        .forEach((ci) => ci.classList.remove("show-highlight"));

      if (cluesStatus.filter((x) => x === "correct" || x === "incorrect").length === cluesCount) {
        finished = true;
        console.log("finished");
        showClueInfo();
        disableNewGrid();

        // ✅ ADD THIS (works for correct + wrong both)
        const msg = document.getElementById("message");
        if (msg) {
          msg.style.display = "none";
        } else {
          console.log("message not found");
        }

        enablePlayAgain("from build game");
      }
    };

    gridDiv.appendChild(outer);
  });
  enableNewGrid("from build game");
  /**
   * disable the btn new grid
   */
  disableNewGrid("from build game");


}


function disableFlipCard(callee) {
  console.log("disableFlipCard callee: ", callee)
  const front = document.getElementById("flipFront");
  front.classList.add("disabled");
}
/**
 * enable the btn play again
 */
function enablePlayAgain(callee) {
  console.log("enablePlayAgain callee: ", callee)
  const playAgainBtn = document.querySelector("#play-again");
  if (playAgainBtn) {
    playAgainBtn.disabled = false;
  } else {
    console.log("playAgainBtn not found build game");
  }
  enableNewGrid("from enable play again");
  disableFlipCard("from enable play again");
}

document.getElementById("generate").onclick = () => {
  const r = document.getElementById("number-range").value;
  buildGame(r);
};
window.onload = () => {
  fillRangeDropdown();
  buildGame("100-199");
};
document.getElementById("number-range").onchange = function () {
  const r = this.value;
  buildGame(r);
};


document.getElementById("showBtn").onclick = function () {
  highlightAnswerForCurrentClue();
};

function removeResultLottie(cellOuter, type) {
  cellOuter.querySelector(".result-lottie")?.remove();
}

function playResultLottie(cellOuter, type) {
  if (cellOuter.querySelector(".result-lottie")) return;

  const span = document.createElement("span");
  span.className = `result-lottie ${type}`;
  cellOuter.appendChild(span);

  lottie.loadAnimation({
    container: span,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: type === "correct" ? "lottie/correct.json" : "lottie/wrong.json",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
      clearCanvas: true,
    },
  });

  setTimeout(() => {
    span.remove();
  }, 5000000);
}

function playMessageLottie(type) {
  const container = document.getElementById("message-lottie");
  if (!container) return;

  // clear previous animation
  container.innerHTML = "";

  lottie.loadAnimation({
    container: container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path:
      type === "correct"
        ? "lottie/correct-emoji.json"
        : "lottie/wrong-emoji.json",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
      clearCanvas: true,
    },
  });
}
