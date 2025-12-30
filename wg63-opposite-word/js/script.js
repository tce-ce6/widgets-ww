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

let remainingWords = [];
let usedWords = [];

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
  { word: "दिन", realWord: "din", opposite: "रात", oppositeWord: "raat" },
  { word: "बड़ा", realWord: "bada", opposite: "छोटा", oppositeWord: "chota" },
  { word: "अच्छा", realWord: "achha", opposite: "बुरा", oppositeWord: "bura" },
  { word: "अंदर", realWord: "andar", opposite: "बाहर", oppositeWord: "bahar" },
  { word: "आना", realWord: "aanaa", opposite: "जाना", oppositeWord: "jaana" },
  { word: "ऊपर", realWord: "upar", opposite: "नीचे", oppositeWord: "niche" },
  { word: "काला", realWord: "kala", opposite: "सफ़ेद", oppositeWord: "safed" },
  { word: "पास", realWord: "paas", opposite: "दूर", oppositeWord: "dur" },
  { word: "गरम", realWord: "garam", opposite: "ठंडा", oppositeWord: "thandaa" },
  { word: "खुश", realWord: "khush", opposite: "दुखी", oppositeWord: "dukhi" },
  { word: "सही", realWord: "sahee", opposite: "गलत", oppositeWord: "galat" },
  {
    word: "नया",
    realWord: "nayaa",
    opposite: "पुराना",
    oppositeWord: "puranaa",
  },
  { word: "आगे", realWord: "aage", opposite: "पीछे", oppositeWord: "piche" },
  { word: "खाली", realWord: "khali", opposite: "भरा", oppositeWord: "bharaa" },
  {
    word: "हल्का",
    realWord: "halkaa",
    opposite: "भारी",
    oppositeWord: "bharee",
  },
  {
    word: "हँसना",
    realWord: "hasanaa",
    opposite: "रोना",
    oppositeWord: "rona",
  },
  { word: "जीत", realWord: "jeet", opposite: "हार", oppositeWord: "haar" },
  { word: "गीला", realWord: "gila", opposite: "सूखा", oppositeWord: "sukha" },
  { word: "तेज़", realWord: "tez", opposite: "धीमा", oppositeWord: "dhima" },
  { word: "साफ़", realWord: "saaf", opposite: "गंदा", oppositeWord: "gandha" },
  { word: "खुला", realWord: "khula", opposite: "बंद", oppositeWord: "band" },
  { word: "एक", realWord: "ek", opposite: "अनेक", oppositeWord: "anek" },
  { word: "दाँए", realWord: "daye", opposite: "बाएँ", oppositeWord: "baye" },
  { word: "सुबह", realWord: "subah", opposite: "शाम", oppositeWord: "shaam" },
  { word: "कोमल", realWord: "komal", opposite: "कठोर", oppositeWord: "kathor" },
  {
    word: "उठना",
    realWord: "uthana",
    opposite: "बैठना",
    oppositeWord: "baithana",
  },
  {
    word: "अँधेरा",
    realWord: "andhera",
    opposite: "उजाला",
    oppositeWord: "ujala",
  },
  { word: "मोटा", realWord: "mota", opposite: "पतला", oppositeWord: "patala" },
  { word: "पूरा", realWord: "pura", opposite: "आधा", oppositeWord: "aadha" },
  { word: "सोना", realWord: "sona", opposite: "जागना", oppositeWord: "jagana" },
];

remainingWords = d3.shuffle(ALL_DATA.slice());
let data = remainingWords.splice(0, 6);
usedWords = data.slice();

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
    .style("font-size", (_, i) => (i === index ? "60px" : "50px"))
    .attr("transform", function (_, i) {
      const base = d3.select(this).attr("data-base-transform");
      return i === index ? `${base} translate(-35,10)` : base;
    });
}

/* ================= SPIN FUNCTION ================= */

function spin() {
  clearImgBoxResults();
  answerConfirmed = false;

  spinAudio.currentTime = 0;
  spinAudio.play().catch(() => {});

  const container = d3.select(".chartholder");
  const vis = container.select("g");

  container.on("click", null);

  isAnswerVisible = false;
  showAnsBtn.textContent = "उत्तर देखें";
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
    // all words used → reset
    oldpick = [];
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

      // ✅ enable Show Answer button
      document.getElementById("show-ans").removeAttribute("disabled");

      // prepare audio
      if (!wordAudio) wordAudio = new Audio();
      wordAudio.src = `./assets/audio/${data[picked].realWord}.mp3`;
      wordAudio.load();

      // show wheel sound
      setTimeout(() => {
        wheelSoundEl.style.display = "block";
      }, 500);

      container.on("click", spin);
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

  /* ================= SPIN CLICK ================= */

  container.on("click", spin);

  /* ================= IMAGES ================= */

  container
    .append("image")
    .attr("xlink:href", "./assets/spin-bg.svg")
    .attr("x", -50)
    .attr("y", -50)
    .attr("width", 133.5)
    .attr("height", 103.89)
    .style("cursor", "pointer");

  container
    .insert("image", ":first-child")
    .attr("xlink:href", "./assets/wheel-bg.svg")
    .attr("x", -372)
    .attr("y", -370)
    .attr("width", 747.79)
    .attr("height", 747.79)
    .style("cursor", "pointer");
}

/* ================= RESET WHEEL ================= */

function resetWheel() {
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
  showAnsBtn.textContent = "उत्तर देखें";

  // Reset lotties
  resetLotties();

  // Remove existing SVG
  d3.select("#chart svg").remove();

  // Reset wheel state
  oldpick = [];
  rotation = 0;
  oldrotation = 0;

  // Get new random data
  // If not enough words left, recycle (after all are used)
  if (remainingWords.length < 6) {
    remainingWords = d3.shuffle(ALL_DATA.slice());
    usedWords = [];
  }

  // Get next 6 unique words
  data = remainingWords.splice(0, 6);
  usedWords = usedWords.concat(data);

  // Recreate the wheel with new data
  initWheel();
}

/* ================= EVENT LISTENERS ================= */

// Show/Hide Answer Button
showAnsBtn.addEventListener("click", () => {
  if (!isAnswerVisible) {
    // SHOW answers
    showCorrectAnswer();
    revealAnswerByShowAns();

    showAnsBtn.textContent = "उत्तर छिपाएँ";
    isAnswerVisible = true;
  } else {
    // HIDE answers
    resetLotties();
    clearImgBoxResults(); // ✅ REMOVE wrong/correct classes

    showAnsBtn.textContent = "उत्तर देखें";
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
  });
});

optionTextEls.forEach((text, i) => {
  text.addEventListener("click", () => {
    const isCorrect = text.dataset.correct === "true";
    markImgBoxResult(text, isCorrect);
    playLottie(i, isCorrect);
  });
});

// Option Text Click
optionTextEls.forEach((text, i) => {
  text.addEventListener("click", () => {
    const isCorrect = text.dataset.correct === "true";
    markImgBoxResult(text, isCorrect); // ✅ ADD

    playLottie(i, isCorrect);
  });
});

function markImgBoxResult(targetEl, isCorrect) {
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
    // ✅ Confirm answer only once
    answerConfirmed = true;

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
  if (answerConfirmed) return;

  optionImgEls.forEach((img) => {
    if (img.dataset.correct === "true") {
      markImgBoxResult(img, true);
    }
  });
}

document.getElementById("new-word").addEventListener("click", () => {
  document.getElementById("show-ans").setAttribute("disabled", "true");
});

/* ================= INITIALIZE ================= */

// Initialize wheel on page load
initWheel();
