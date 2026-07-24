/* ================= CONFIG ================= */

const padding = { top: 20, right: 40, bottom: 0, left: 0 };
const w = 670 - padding.left - padding.right;
const h = 670 - padding.top - padding.bottom;
const r = Math.min(w, h) / 2;

let rotation = 0;
let oldrotation = 0;
let picked = 100000;
let oldpick = [];
let answerConfirmed = false;

const wheelSoundEl = document.getElementById("wheelSound");
const selectedWordEl = document.getElementById("selectedWord");
const mainWordImg = document.getElementById("main-word");
const showAnsBtn = document.getElementById("show-ans");
const rightCol = document.getElementById("rightCol");
const newWordBtn = document.getElementById("new-word");

let wordAudio = null;
let optionAudio = null;

let usedWordKeys = new Set();

const spinAudio = new Audio("./assets/audio/spin-sound.mp3");
spinAudio.loop = true; // play continuously while spinning
spinAudio.preload = "auto";

/* ================= COLORS ================= */

const sliceColors = [
  "#43C200",
  "#FFDD00",
  "#F97325",
  "#FFA600",
  "#C56DFC",
  "#D9D9CC",
];

/* ================= DATA ================= */

const ALL_DATA = [
  { word: "ઝડપી", realWord: "01_fast", opposite: "ધીમી", oppositeWord: "01_slow" },
  { word: "અંદર", realWord: "02_in", opposite: "બહાર", oppositeWord: "02_out" },
  { word: "પહોળું", realWord: "03_wide", opposite: "સાંકડું", oppositeWord: "03_narrow" },
  { word: "કડક", realWord: "04_hard", opposite: "નરમ", oppositeWord: "04_soft" },
  { word: "ચોખ્ખું", realWord: "05_clean", opposite: "ગંદું", oppositeWord: "05_dirty" },
  { word: "આગળ", realWord: "06_front", opposite: "પાછળ", oppositeWord: "06_back" },
  { word: "ઉપર", realWord: "07_up", opposite: "નીચે", oppositeWord: "07_down" },
  { word: "બેસવું", realWord: "08_sit", opposite: "ઊભું રહેવું", oppositeWord: "08_stand" },
  { word: "હળવું", realWord: "09_light", opposite: "ભારે", oppositeWord: "09_heavy" },
  { word: "જાડું", realWord: "10_fat", opposite: "પાતળું", oppositeWord: "10_slim" },
  { word: "ગરમ", realWord: "11_hot", opposite: "ઠંડું", oppositeWord: "11_cold" },
  { word: "નવું", realWord: "12_new", opposite: "જૂનું", oppositeWord: "12_old" },
  { word: "દિવસ", realWord: "13_day", opposite: "રાત", oppositeWord: "13_night" },
  { word: "સફેદ", realWord: "14_white", opposite: "કાળો", oppositeWord: "14_black" },
  { word: "નજીક", realWord: "15_near", opposite: "દૂર", oppositeWord: "15_far" },
  { word: "ભરેલું", realWord: "16_full", opposite: "ખાલી", oppositeWord: "16_empty" },
  { word: "સૂકો", realWord: "17_dry", opposite: "ભીનો", oppositeWord: "17_wet" },
  { word: "ઊંડું", realWord: "18_deep", opposite: "છીછરું", oppositeWord: "18_shallow" },
  { word: "કાચું", realWord: "19_raw", opposite: "રાંધેલું", oppositeWord: "19_cooked" },
  { word: "ચમકદાર", realWord: "20_shiny", opposite: "ઝાંખું", oppositeWord: "20_dull" },
  { word: "સુગંધ", realWord: "21_good-smell", opposite: "દુર્ગંધ", oppositeWord: "21_bad-smell" },
  { word: "શાંત", realWord: "22_calm", opposite: "અશાંત", oppositeWord: "22_restless" },
  { word: "ડાબું", realWord: "23_left", opposite: "જમણું", oppositeWord: "23_right" },
  { word: "જાગવું", realWord: "24_wakeup", opposite: "સૂવું", oppositeWord: "24_sleep" },
  { word: "મોટું", realWord: "25_big", opposite: "નાનું", oppositeWord: "25_small" },
  { word: "ખુશ", realWord: "26_happy", opposite: "ઉદાસ", oppositeWord: "26_sad" },
  { word: "ખુલ્લું", realWord: "27_open", opposite: "બંધ", oppositeWord: "27_close" },
  { word: "પહેલું", realWord: "28_first", opposite: "છેલ્લું", oppositeWord: "28_last" },
  { word: "પ્રકાશ", realWord: "29_brightness", opposite: "અંધારું", oppositeWord: "29_darkness" },
  { word: "હાર", realWord: "30_loss", opposite: "જીત", oppositeWord: "30_win" },
];

function getNextWordSet() {
  const availableWords = ALL_DATA.filter(
    (item) => !usedWordKeys.has(item.realWord)
  );

  const pool = availableWords.length > 0 ? availableWords : ALL_DATA.slice();
  const shuffledPool = d3.shuffle(pool.slice());

  if (availableWords.length === 0) {
    usedWordKeys.clear();
  }

  const nextSet = shuffledPool.slice(0, 6);
  nextSet.forEach((item) => usedWordKeys.add(item.realWord));

  return nextSet;
}

let data = getNextWordSet();

const optionTextEls = [
  document.getElementById("option-1"),
  document.getElementById("option-2"),
  document.getElementById("option-3"),
];

const optionImgEls = [
  document.getElementById("optionImg-1"),
  document.getElementById("optionImg-2"),
  document.getElementById("optionImg-3"),
];

const optionSoundEls = [
  document.getElementById("optionSound-1"),
  document.getElementById("optionSound-2"),
  document.getElementById("optionSound-3"),
];

const lottieWrappers = [
  document.getElementById("lottieWrapper-1"),
  document.getElementById("lottieWrapper-2"),
  document.getElementById("lottieWrapper-3"),
];

let lottieInstances = [null, null, null];
let isAnswerVisible = false;
let spinButton = null;
let isSpinDisabled = false;

/* ================= HELPERS ================= */

document.querySelectorAll(".img-box").forEach((box) => {
  box.classList.remove("correct", "wrong");
});

function getRandomSix(list) {
  return d3.shuffle(list.slice()).slice(0, 6);
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function setOptionsForPickedWord(pickedIndex) {
  const correctItem = data[pickedIndex];

  // ❌ remove correct item from wrong pool
  const wrongPool = ALL_DATA.filter(
    (item) => item.opposite !== correctItem.opposite
  );

  // 🎲 pick 2 random wrong options
  const wrongOptions = d3.shuffle(wrongPool).slice(0, 2);

  // ✅ final 3 options (object form)
  const finalOptions = d3.shuffle([
    {
      text: correctItem.opposite,
      img: correctItem.oppositeWord,
      correct: true,
    },
    {
      text: wrongOptions[0].opposite,
      img: wrongOptions[0].oppositeWord,
      correct: false,
    },
    {
      text: wrongOptions[1].opposite,
      img: wrongOptions[1].oppositeWord,
      correct: false,
    },
  ]);

  // 🎯 render to DOM
  finalOptions.forEach((opt, i) => {
    // text
    optionTextEls[i].textContent = opt.text;
    optionTextEls[i].dataset.correct = opt.correct;

    // image
    optionImgEls[i].src = `./assets/words/${opt.img}.svg`;
    optionImgEls[i].dataset.correct = opt.correct;
    optionImgEls[i].dataset.audio = opt.img;
    optionTextEls[i].dataset.audio = opt.img;

    // 🔊 AUDIO
    optionSoundEls[i].dataset.audio = opt.img;
  });
}

function resetLotties() {
  lottieWrappers.forEach((wrapper, i) => {
    wrapper.style.display = "none";
    wrapper.innerHTML = "";

    if (lottieInstances[i]) {
      lottieInstances[i].destroy();
      lottieInstances[i] = null;
    }
  });
}

function setSpinButtonState(enabled) {
  if (!spinButton) return;

  spinButton
    .style("pointer-events", enabled ? "auto" : "none")
    .style("cursor", enabled ? "pointer" : "default")
    .style("opacity", 1);
}

function playLottie(index, isCorrect) {
  resetLotties();

  const wrapper = lottieWrappers[index];
  wrapper.style.display = "block";

  lottieInstances[index] = lottie.loadAnimation({
    container: wrapper,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: isCorrect ? "lottie/correct.json" : "lottie/wrong.json",
  });
}

function showCorrectAnswer() {
  optionTextEls.forEach((textEl, i) => {
    if (textEl.dataset.correct === "true") {
      playLottie(i, true);
      playCorrectAnswerAudio(textEl.dataset.audio);
    }
  });
}

function rotTween() {
  const i = d3.interpolate(oldrotation % 360, rotation);
  return (t) => `rotate(${i(t)})`;
}

function highlightPickedSlice(index) {
  const vis = d3.select(".chartholder").select("g");
  vis
    .selectAll(".slice")
    .transition()
    .duration(500)
    .attr("transform", (d, i) => {
      return i === index ? "scale(1.2)" : "scale(1)";
    });
}

function moveSelectedSliceText(index) {
  const vis = d3.select(".chartholder").select("g");
  vis
    .selectAll(".slice-text")
    .transition()
    .duration(300)
    .style("font-size", (_, i) => (i === index ? "45px" : "40px"))
    .attr("transform", function (_, i) {
      const base = d3.select(this).attr("data-base-transform");
      return i === index ? `${base} translate(-35,10)` : base;
    });
}

/* ================= SPIN FUNCTION ================= */

function spin() {
  if (isSpinDisabled) return;

  if (oldpick.length === data.length) {
    oldpick = [];
    data = getNextWordSet();
    rebuildWheelWithCurrentData();
  }

  isSpinDisabled = true;
  setSpinButtonState(false);

  clearImgBoxResults();
  answerConfirmed = false;

  newWordBtn.setAttribute("disabled", "true");
  showAnsBtn.setAttribute("disabled", "true");

  spinAudio.currentTime = 0;
  spinAudio.play().catch(() => {});

  const container = d3.select(".chartholder");
  const vis = container.select("g");

  container.on("click", null);

  isAnswerVisible = false;
  showAnsBtn.textContent = "જવાબ જુઓ";
  resetLotties();

  // Reset previous slice transforms and text styles
  vis.selectAll(".slice").attr("transform", "scale(1)");
  vis
    .selectAll(".slice-text")
    .style("font-size", "50px")
    .attr("transform", function () {
      return d3.select(this).attr("data-base-transform");
    });

  if (wheelSoundEl) {
    wheelSoundEl.style.display = "none";
  }

  const ps = 360 / data.length;
  // Fixed rotation amount - always 5 full rotations (1800 degrees) plus random position
  const fullRotations = 1800; // 5 complete rotations
  if (oldpick.length === data.length) {
    oldpick = [];
    resetWheel();
    return;
  }

  let randomSegment;
  do {
    randomSegment = Math.floor(Math.random() * data.length);
  } while (oldpick.includes(randomSegment));

  // store picked index
  oldpick.push(randomSegment);

  const segmentAngle = randomSegment * ps;

  rotation = fullRotations + segmentAngle;

  picked = Math.round(data.length - (rotation % 360) / ps);
  picked = picked >= data.length ? picked % data.length : picked;

  rotation += 90 - Math.round(ps / 2);

  vis
    .transition()
    .duration(3000) // Increased from 1500 to 3000ms (3 seconds)
    .ease("cubic-out")
    .attrTween("transform", rotTween)
    .each("end", () => {
      spinAudio.pause();
      spinAudio.currentTime = 0;

      oldrotation = rotation;


      highlightPickedSlice(picked);
      moveSelectedSliceText(picked);

      // selected word text
      selectedWordEl.textContent = data[picked].word;

      // main image
      mainWordImg.src = `./assets/words/${data[picked].realWord}.svg`;

      // set options
      setOptionsForPickedWord(picked);
      rightCol.style.display = "block";

      // ✅ enable Show Answer and New Word buttons after the spin ends
      showAnsBtn.removeAttribute("disabled");
      newWordBtn.removeAttribute("disabled");

      // prepare audio
      if (!wordAudio) wordAudio = new Audio();
      wordAudio.src = `./assets/audio/${data[picked].realWord}.mp3`;
      wordAudio.load();

      // show wheel sound
      setTimeout(() => {
        wheelSoundEl.style.display = "block";
      }, 500);

    });
}

/* ================= INIT WHEEL ================= */

function initWheel() {
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);

  const container = svg
    .append("g")
    .attr("class", "chartholder")
    .attr(
      "transform",
      `translate(${w / 2 + padding.left}, ${h / 2 + padding.top})`
    );

  const vis = container.append("g");

  /* ================= PIE ================= */

  const pie = d3.layout
    .pie()
    .sort(null)
    .value(() => 1);
  const arc = d3.svg.arc().outerRadius(r);

  const arcs = vis
    .selectAll("g.slice")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "slice");

  /* ================= PATHS ================= */

  arcs
    .append("path")
    .attr("fill", (_, i) => sliceColors[i])
    .attr("d", arc);

  /* ================= TEXT ================= */

  arcs
    .append("text")
    .attr("class", "slice-text")
    .attr("data-base-transform", (d) => {
      d.innerRadius = 0;
      d.outerRadius = r;
      d.angle = (d.startAngle + d.endAngle) / 2;

      return `rotate(${(d.angle * 180) / Math.PI - 90}) translate(${
        d.outerRadius - 50
      }, 15)`;
    })
    .attr("transform", function () {
      return d3.select(this).attr("data-base-transform");
    })
    .attr("text-anchor", "end")
    .style("fill", "#000")
    .style("font-size", "50px")
    .style("font-weight", "600")
    .style("pointer-events", "none")
    .text((_, i) => data[i].word);

  /* ================= IMAGES ================= */

  spinButton = container
    .append("image")
    .attr("id", "spin-button")
    .attr("xlink:href", "./assets/spin-bg.svg")
    .attr("x", -50)
    .attr("y", -50)
    .attr("width", 133.5)
    .attr("height", 103.89)
    .style("cursor", "pointer")
    .on("click", spin);

  container
    .insert("image", ":first-child")
    .attr("xlink:href", "./assets/wheel-bg.svg")
    .attr("x", -372)
    .attr("y", -370)
    .attr("width", 747.79)
    .attr("height", 747.79);
}

/* ================= RESET WHEEL ================= */

function rebuildWheelWithCurrentData() {
  spinAudio.pause();
  spinAudio.currentTime = 0;

  answerConfirmed = false;

  // Hide right column
  rightCol.style.display = "none";

  // Hide wheel sound icon
  if (wheelSoundEl) {
    wheelSoundEl.style.display = "none";
  }

  // Reset answer visibility
  isAnswerVisible = false;
  showAnsBtn.textContent = "જવાબ જુઓ";
  showAnsBtn.setAttribute("disabled", "true");
  newWordBtn.removeAttribute("disabled");
  selectedWordEl.textContent = "";
  isSpinDisabled = false;

  // Reset lotties
  resetLotties();

  // Remove existing SVG
  d3.select("#chart svg").remove();

  // Reset wheel state
  oldpick = [];
  rotation = 0;
  oldrotation = 0;

  // Recreate the wheel with current data
  initWheel();

  setSpinButtonState(true);
}

function resetWheel() {
  data = getNextWordSet();
  rebuildWheelWithCurrentData();
}

/* ================= EVENT LISTENERS ================= */

// Show/Hide Answer Button
showAnsBtn.addEventListener("click", () => {
  if (!isAnswerVisible) {
    // SHOW answers
    showCorrectAnswer();
    revealAnswerByShowAns();

    showAnsBtn.textContent = "જવાબ છુપાવો";
    isAnswerVisible = true;
  } else {
    // HIDE answers
    resetLotties();
    clearImgBoxResults(); // ✅ REMOVE wrong/correct classes

    showAnsBtn.textContent = "જવાબ જુઓ";
    isAnswerVisible = false;
  }
});

function clearImgBoxResults() {
  document.querySelectorAll(".img-box.bottom-img").forEach((box) => {
    box.classList.remove("correct", "wrong");
  });

  // allow fresh confirmation again
  answerConfirmed = false;
}

// New Word Button
newWordBtn.addEventListener("click", () => {
  resetWheel();
});

// Wheel Sound Click
if (wheelSoundEl) {
  wheelSoundEl.addEventListener("click", () => {
    if (wordAudio) {
      wordAudio.currentTime = 0;
      wordAudio.play().catch(() => {});
    }
  });
}

// Option Sound Icons
optionSoundEls.forEach((icon) => {
  icon.addEventListener("click", () => {
    const audioName = icon.dataset.audio;
    if (!audioName) return;

    if (!optionAudio) {
      optionAudio = new Audio();
    }

    optionAudio.src = `./assets/audio/${audioName}.mp3`;
    optionAudio.currentTime = 0;
    optionAudio.play().catch(() => {});
  });
});

// Option Images Click
optionImgEls.forEach((img, i) => {
  img.addEventListener("click", () => {
    const isCorrect = img.dataset.correct === "true";
    markImgBoxResult(img, isCorrect);
    playLottie(i, isCorrect);
    if (isCorrect) playCorrectAnswerAudio(img.dataset.audio);
  });
});

optionTextEls.forEach((text, i) => {
  text.addEventListener("click", () => {
    const isCorrect = text.dataset.correct === "true";
    markImgBoxResult(text, isCorrect);
    playLottie(i, isCorrect);
    if (isCorrect) playCorrectAnswerAudio(text.dataset.audio);
  });
});

function playCorrectAnswerAudio(audioName) {
  if (!audioName) return;

  if (!optionAudio) optionAudio = new Audio();
  optionAudio.src = `./assets/audio/${audioName}.mp3`;
  optionAudio.currentTime = 0;
  optionAudio.play().catch(() => {});
}

function markImgBoxResult(targetEl, isCorrect, confirmAnswer = true) {
  // 🚫 If answer not confirmed yet and user clicked wrong → do nothing
  if (!isCorrect && !answerConfirmed) {
    return;
  }

  const clickedBox = targetEl.closest(".img-box");
  if (!clickedBox) return;

  const allBoxes = document.querySelectorAll(".img-box.bottom-img");

  // 🔄 Clear previous states
  allBoxes.forEach((box) => {
    box.classList.remove("correct", "wrong");
  });

  if (isCorrect) {
    if (confirmAnswer) {
      // ✅ Confirm answer only once
      answerConfirmed = true;
      showAnsBtn.setAttribute("disabled", "true");
      isSpinDisabled = false;
      setSpinButtonState(true);
    }

    // ✅ Mark correct one
    clickedBox.classList.add("correct");

    // ❌ Mark remaining as wrong
    allBoxes.forEach((box) => {
      if (box !== clickedBox) {
        box.classList.add("wrong");
      }
    });
  }
}

function revealAnswerByShowAns() {
  optionImgEls.forEach((img) => {
    if (img.dataset.correct === "true") {
      markImgBoxResult(img, true, false);
    }
  });
}

document.getElementById("new-word").addEventListener("click", () => {
  document.getElementById("show-ans").setAttribute("disabled", "true");
});

/* ================= INITIALIZE ================= */

// Initialize wheel on page load
initWheel();
