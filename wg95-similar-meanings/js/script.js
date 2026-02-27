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
const selectedAnswerEl = document.getElementById("selectedAnswer");
const spinTextEl = document.getElementById("spin-txt");
const bottomSectionEl = document.getElementById("bottom-section");
const finalAnswerEl = document.getElementById("final-answer");
const lottieWrapperAnswer = document.getElementById("lottieWrapper-answer");
const showAnsBtn = document.getElementById("show-ans");
const rightCol = document.getElementById("rightCol");
const selectedWordSoundEl = document.getElementById("selectedWordSound");
const selectedAnswerSoundEl = document.getElementById("selectedAnswerSound");
const answerImageEl = document.getElementById("answer-image");
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
  { word: "big", answer: "large", dist1: "little", dist2: "thin", image: "large" },
  { word: "happy", answer: "joyful", dist1: "sad", dist2: "angry", image: "joyful" },
  { word: "fast", answer: "quick", dist1: "slow", dist2: "late", image: "quick" },
  { word: "jump", answer: "leap", dist1: "run", dist2: "fall", image: "leap" },
  { word: "look", answer: "see", dist1: "hear", dist2: "touch", image: "see" },
  { word: "begin", answer: "start", dist1: "stop", dist2: "finish", image: "start" },
  { word: "new", answer: "fresh", dist1: "old", dist2: "clean", image: "fresh" },
  { word: "shut", answer: "close", dist1: "open", dist2: "break", image: "close" },
  { word: "smart", answer: "clever", dist1: "silly", dist2: "kind", image: "clever" },
  { word: "talk", answer: "speak", dist1: "listen", dist2: "mute", image: "speak" },
  { word: "shout", answer: "yell", dist1: "sing", dist2: "mumble", image: "yell" },
  { word: "sleepy", answer: "tired", dist1: "awake", dist2: "hungry", image: "tired" },
  { word: "hot", answer: "warm", dist1: "cold", dist2: "rainy", image: "warm" },
  { word: "rock", answer: "stone", dist1: "sand", dist2: "dirt", image: "stone" },
  { word: "loud", answer: "noisy", dist1: "quiet", dist2: "soft", image: "noisy" },
  { word: "sick", answer: "ill", dist1: "well", dist2: "fit", image: "ill" },
  { word: "bright", answer: "shiny", dist1: "dark", dist2: "dull", image: "shiny" },
  { word: "near", answer: "close", dist1: "far", dist2: "away", image: "close" },
  { word: "brave", answer: "bold", dist1: "scared", dist2: "proud", image: "brave" },
  { word: "help", answer: "assist", dist1: "harm", dist2: "hit", image: "assist" },
  { word: "cry", answer: "weep", dist1: "laugh", dist2: "frown", image: "weep" },
  { word: "pull", answer: "tug", dist1: "push", dist2: "lift", image: "tug" },
  { word: "break", answer: "crack", dist1: "fix", dist2: "mend", image: "crack" },
  { word: "full", answer: "whole", dist1: "half", dist2: "empty", image: "whole" },
  { word: "high", answer: "tall", dist1: "low", dist2: "deep", image: "tall" },
  { word: "pick", answer: "choose", dist1: "drop", dist2: "leave", image: "choose" },
  { word: "rush", answer: "hurry", dist1: "wait", dist2: "stroll", image: "hurry" },
  { word: "hat", answer: "cap", dist1: "shoe", dist2: "glove", image: "cap" },
  { word: "child", answer: "kid", dist1: "adult", dist2: "baby", image: "kid" },
  { word: "boat", answer: "ship", dist1: "plane", dist2: "car", image: "ship" }
];

remainingWords = d3.shuffle(ALL_DATA.slice());
let data = remainingWords.splice(0, 6);
usedWords = data.slice();

const optionTextEls = [
  document.getElementById("option-1"),
  document.getElementById("option-2"),
  document.getElementById("option-3"),
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
  const item = data[pickedIndex];

  // ✅ final 3 options (object form)
  // Use image property for answer. For distractors, try to use their text as image name?
  // Or if no image exists for distractors, they will just show broken image/nothing.
  // We use separate 'audio' property which is the text.
  
  const options = [
    {
      text: item.answer,
      img: item.image, // Known valid image
      audio: item.answer,
      correct: true,
    },
    {
      text: item.dist1,
      img: item.dist1, // Might be missing
      audio: item.dist1,
      correct: false,
    },
    {
      text: item.dist2,
      img: item.dist2, // Might be missing
      audio: item.dist2,
      correct: false,
    },
  ];

  const finalOptions = d3.shuffle(options);

  // 🎯 render to DOM
  finalOptions.forEach((opt, i) => {
    // text
    optionTextEls[i].textContent = opt.text;
    optionTextEls[i].dataset.correct = opt.correct;

    // 🔊 AUDIO
    // We use the word text for audio lookup
    optionSoundEls[i].dataset.audio = opt.audio;
  });

  // Set audio for the main word and answer sounds
  if (selectedWordSoundEl) selectedWordSoundEl.dataset.audio = item.word;
  // Answer sound will be the text of the answer
  if (selectedAnswerSoundEl) selectedAnswerSoundEl.dataset.audio = item.answer;

  // Set answer image
  if (answerImageEl) {
      answerImageEl.src = `./assets/words/${item.image}.svg`;
      answerImageEl.onerror = function() {
          this.style.display = 'none';
      };
      answerImageEl.onload = function() {
          this.style.display = 'block';
      };
  }
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
    .style("font-size", (_, i) => (i === index ? "55px" : "50px"))
    .attr("transform", function (_, i) {
      const base = d3.select(this).attr("data-base-transform");
      return i === index ? `${base} translate(-10, 0)` : base;
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
  showAnsBtn.textContent = "Show Answer";
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

      // set options
      setOptionsForPickedWord(picked);
      rightCol.style.display = "block";
      
      // Ensure UI is in question state
      if (spinTextEl) spinTextEl.style.display = "block";
      if (bottomSectionEl) bottomSectionEl.style.display = "block";
      if (finalAnswerEl) finalAnswerEl.style.display = "none";
      if (lottieWrapperAnswer) {
          lottieWrapperAnswer.style.display = "none";
          lottieWrapperAnswer.innerHTML = "";
      }

      // ✅ enable Show Answer button
      document.getElementById("show-ans").removeAttribute("disabled");

      // prepare audio
      if (!wordAudio) wordAudio = new Audio();
      wordAudio.src = `./assets/audio/${data[picked].word}.mp3`;
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
  showAnsBtn.textContent = "Show Answer";

  // Reset UI sections
  if (spinTextEl) spinTextEl.style.display = "block";
  if (bottomSectionEl) bottomSectionEl.style.display = "block";
  if (finalAnswerEl) finalAnswerEl.style.display = "none";
  if (lottieWrapperAnswer) {
      lottieWrapperAnswer.style.display = "none";
      lottieWrapperAnswer.innerHTML = "";
  }

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

    showAnsBtn.textContent = "Hide Answer";
    isAnswerVisible = true;
  } else {
    // HIDE answers
    resetLotties();
    clearImgBoxResults(); // ✅ REMOVE wrong/correct classes

    showAnsBtn.textContent = "Show Answer";
    isAnswerVisible = false;
  }
});

function clearImgBoxResults() {
  document.querySelectorAll(".img-box.bottom-img").forEach((box) => {
    box.classList.remove("correct", "wrong");
  });

  if (selectedAnswerEl) {
    selectedAnswerEl.textContent = "";
  }

  // Reset UI sections on clear
  if (spinTextEl) spinTextEl.style.display = "block";
  if (bottomSectionEl) bottomSectionEl.style.display = "block";
  if (finalAnswerEl) finalAnswerEl.style.display = "none";
  if (lottieWrapperAnswer) {
      lottieWrapperAnswer.style.display = "none";
      lottieWrapperAnswer.innerHTML = "";
  }
  
  if (selectedWordSoundEl) selectedWordSoundEl.style.display = "none";
  if (selectedAnswerSoundEl) selectedAnswerSoundEl.style.display = "none";

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



// Option Click (on the word background)
document.querySelectorAll(".word-bg.bottom-word").forEach((bgEl, i) => {
  bgEl.addEventListener("click", () => {
    // The h4 inside this bgEl is the option text element
    const textEl = bgEl.querySelector("h4");
    if (!textEl) return;
    
    const isCorrect = textEl.dataset.correct === "true";
    markImgBoxResult(textEl, isCorrect);
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
    
    // ✅ Set Answer Text
    if (selectedAnswerEl) {
      selectedAnswerEl.textContent = targetEl.textContent;
    }

    // ✅ Mark correct one
    clickedBox.classList.add("correct");

    // ❌ Mark remaining as wrong
    allBoxes.forEach((box) => {
      if (box !== clickedBox) {
        box.classList.add("wrong");
      }
    });

    // Hide sections and show final answer
    if (spinTextEl) spinTextEl.style.display = "none";
    if (bottomSectionEl) bottomSectionEl.style.display = "none";
    if (finalAnswerEl) finalAnswerEl.style.display = "block";

    // Show audio icons
    if (selectedWordSoundEl) selectedWordSoundEl.style.display = "block";
    if (selectedAnswerSoundEl) selectedAnswerSoundEl.style.display = "block";

    // Play correct animation with delay
    setTimeout(() => {
        if (lottieWrapperAnswer) {
            lottieWrapperAnswer.style.display = "block";
            lottieWrapperAnswer.innerHTML = ""; // Clear existing lottie
            // Use existing lottie load logic but for this specific container
             lottie.loadAnimation({
                container: lottieWrapperAnswer,
                renderer: "svg",
                loop: false,
                autoplay: true,
                path: "lottie/correct.json",
            });
        }
    }, 500);

    // Update Show Answer button state
    showAnsBtn.textContent = "Hide Answer";
    isAnswerVisible = true;

  }
}


function revealAnswerByShowAns() {
  if (answerConfirmed) return;

  optionTextEls.forEach((textEl) => {
    if (textEl.dataset.correct === "true") {
      // markImgBoxResult handles the UI transition logic now
      markImgBoxResult(textEl, true);
    }
  });
}

document.getElementById("new-word").addEventListener("click", () => {
  document.getElementById("show-ans").setAttribute("disabled", "true");
});

if (selectedWordSoundEl) {
  selectedWordSoundEl.addEventListener("click", () => {
    const audioName = selectedWordSoundEl.dataset.audio;
    if (!audioName) return;
    if (!wordAudio) wordAudio = new Audio();
    wordAudio.src = `./assets/audio/${audioName}.mp3`;
    wordAudio.currentTime = 0;
    wordAudio.play().catch(() => {});
  });
}

if (selectedAnswerSoundEl) {
  selectedAnswerSoundEl.addEventListener("click", () => {
    const audioName = selectedAnswerSoundEl.dataset.audio;
    if (!audioName) return;
    if (!optionAudio) optionAudio = new Audio();
    optionAudio.src = `./assets/audio/${audioName}.mp3`;
    optionAudio.currentTime = 0;
    optionAudio.play().catch(() => {});
  });
}

/* ================= INITIALIZE ================= */

// Initialize wheel on page load
initWheel();
