WordAudioEnum = {};
let usedWords = [];
let selectedWord = null;
let audioPlayer = new Audio();
let lottieInstances = null;
let lottieInstances_star = null;
let selectedLottie = null;
let audio_button_1 = false;
let audio_button_2 = false;
let age_badhe_button = false;
let animationTimeout = null;
let starAnimationTimeout = null;
let correctCloudId = "cloud_text_01";
let leftCircle = ['Path_13382-3', 'Path_13382-4'];
let rightCircle = ['Path_13382-3-2', 'Path_13382-5'];
const LottieAnimations = {
  O: {
    CORRECT: "correct-feedback-o.json",
    INCORRECT: "incorrect-feedback.json",
  },
  OU: {
    CORRECT: "correct-feedback-ou.json",
    INCORRECT: "incorrect-feedback.json",
  },
};

function init() {
  console.log("Script loaded and initialized.");
  // document.getElementById("i_text_1").style.fill = "blue";
  selectRandomWord();
  naya_shabd();
  hideAndShowAudioButtons("none");
  showAnswer();
  //showText();
  lottiAnimation("none");
  nextbutton();
  audioListener();
  nextStep();
  gyankosh_button();
  let audioPLay = document.getElementById("audio_button_3");
  if (audioPLay) {
    audioPLay.addEventListener("click", () => {
      playAudio("correct");
    });
  }
  textClickEvent();
}

selectRandomWord = () => {
  currentWordKey = getRandomUnusedWordKey();
  selectedWord = WordAudioEnum[currentWordKey];
  console.log("Selected Word:", selectedWord);
  textDisplay();
};
function textDisplay() {
  let text1 = document.getElementById("cloud_text_01");
  let text2 = document.getElementById("cloud_text_02");
  const tspans = text1.querySelector("p");
  const tspan2 = text2.querySelector("p");
  const isLeftCorrect = Math.random() < 0.5;

  if (isLeftCorrect) {
    tspans.innerHTML = highlightConsonantWithMatra(selectedWord.correct);
    tspan2.innerHTML = highlightConsonantWithMatra(selectedWord.incorrect);
    correctCloudId = "cloud_text_01";
  } else {
    tspans.innerHTML = highlightConsonantWithMatra(selectedWord.incorrect);
    tspan2.innerHTML = highlightConsonantWithMatra(selectedWord.correct);
    correctCloudId = "cloud_text_02";
  }
  resetFeedbackVisuals();
}

function highlightConsonantWithMatra(text) {
  // Matches any consonant + ओ (ो, U+094B) or औ (ौ, U+094C) matra
  return text.replace(/([\u0915-\u0939\u0958-\u095F][\u094B\u094C])/g, (match) => {
    return `<span>${match}</span>`;
  });
}

function resetFeedbackVisuals() {
  const highlights = ["cloud_text_01", "cloud_text_02"];

  highlights.forEach((id) => {
    const el = document.getElementById(id).querySelector("p");
    if (el) el.classList.remove("cloud_text_highlight");
  });

  leftCircle.forEach((circle) => {
    document.getElementById(circle).style.display = "none";
  });
  rightCircle.forEach((circle) => {
    document.getElementById(circle).style.display = "none";
  });

  // Hide both outline paths (left/right) for correct/incorrect
  setOutlineForSide("cloud_text_01", null);
  setOutlineForSide("cloud_text_02", null);

  // Hide decorative feedback flowers/loops on both sides
  // const fbCorrect = document.getElementById("feedback_correct");
  // const fbIncorrect = document.getElementById("feedback_incorrect");
  // if (fbCorrect) fbCorrect.style.display = "none";
  // if (fbIncorrect) fbIncorrect.style.display = "none";

  lottiAnimation("none");
}

function setOutlineForSide(cloudId, result /* 'correct' | 'incorrect' | null */) {
  const left = cloudId === "cloud_text_01";
  const correctPathId = left ? "left-flower" : "right-flower";
  // const incorrectPathId = left ? "Path_13382-4" : "Path_13382-5";

  const correctEl = document.getElementById(correctPathId);
  // const incorrectEl = document.getElementById(incorrectPathId);

  if (correctEl) correctEl.style.display = result === "correct" ? "block" : "none";
  // if (incorrectEl) incorrectEl.style.display = result === "incorrect" ? "block" : "none";

  // Show flowers only when answer is selected
  const fbCorrect = document.getElementById("feedback_correct");
  // const fbIncorrect = document.getElementById("feedback_incorrect");
  if (result === "correct") {
    if (fbCorrect) fbCorrect.style.display = "block";
    // if (fbIncorrect) fbIncorrect.style.display = "none";
  } else if (result === "incorrect") {
    // if (fbIncorrect) fbIncorrect.style.display = "block";
    if (fbCorrect) fbCorrect.style.display = "none";
  }
}

function nextStep() {
  let nextButton = document.getElementById("age_badhe_button");
  nextButton.addEventListener("click", () => {
    // Logic to go to the next step
    nextButton.style.display = "none";
    let i_text = document.getElementById("i_text_1");
    if (i_text) {
      const tspan = i_text.querySelector("tspan");
      if (tspan) {
        tspan.textContent =
          "ऑडियो सुनें। कौन-सा शब्द सुना आपने? सही शब्द पर टैप करें।";
      }
    }
    age_badhe_button = true;
    document.getElementById("audio_button_1").style.display = "none";
    document.getElementById("audio_button_2").style.display = "none";
    hideAndShowAudioButtons("block");

    // You can add your navigation logic here
  });
}

function textClickEvent() {
  const cloud1 = document.getElementById("cloud_text_01");
  const cloud2 = document.getElementById("cloud_text_02");
  const text_cloud_01 = document.getElementById("text_cloud_01");
  const text_cloud_02 = document.getElementById("text_cloud_02");

  function activateHighlightAndOutline(cloudId, isCorrect) {
    // Reset all first
    resetFeedbackVisuals();


    if (cloudId === "cloud_text_01") {
      let circle = isCorrect ? leftCircle[0] : leftCircle[1];
      document.getElementById(circle).style.display = "block";
    }

    if (cloudId === "cloud_text_02") {
      let circle = isCorrect ? rightCircle[0] : rightCircle[1];
      document.getElementById(circle).style.display = "block";
    }
    setOutlineForSide(cloudId, isCorrect ? "correct" : "incorrect");
    let tspans = document.getElementById(cloudId).querySelector("p");
    tspans.classList.add("cloud_text_highlight");

    // Animation
    lottiAnimation("block");
    playLottieAnimation(isCorrect ? "CORRECT" : "INCORRECT");
    // (wg88 SVG doesn’t have the same lottie container as wg87; keep this a no-op if missing)
  }

  cloud1.addEventListener("click", () => {
    if (!age_badhe_button) return;
    const isCorrect = correctCloudId === "cloud_text_01";
    activateHighlightAndOutline("cloud_text_01", isCorrect);
  });

  cloud2.addEventListener("click", () => {
    if (!age_badhe_button) return;
    const isCorrect = correctCloudId === "cloud_text_02";
    activateHighlightAndOutline("cloud_text_02", isCorrect);
  });

  text_cloud_01.addEventListener("click", () => {
    if (!age_badhe_button) return;
    const isCorrect = correctCloudId === "cloud_text_01";
    activateHighlightAndOutline("cloud_text_01", isCorrect);
  });

  text_cloud_02.addEventListener("click", () => {
    if (!age_badhe_button) return;
    const isCorrect = correctCloudId === "cloud_text_02";
    activateHighlightAndOutline("cloud_text_02", isCorrect);
  });
}

function audioListener() {
  const audio1 = document.getElementById("audio_button_1");
  const audio2 = document.getElementById("audio_button_2");
  audio1.addEventListener("click", () => {
    audio_button_1 = true;
    correctCloudId === "cloud_text_01" ? playAudio("correct") : playAudio("wrong");
  });

  audio2.addEventListener("click", () => {
    audio_button_2 = true;
    correctCloudId === "cloud_text_02" ? playAudio("correct") : playAudio("wrong");
  });
}

function playAudio(type) {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;

  let fileName =
    type === "wrong" ? selectedWord.wrongAudio : selectedWord.correctAudio;

  audioPlayer.src = `assets/audio/final_audio/${fileName}`;

  audioPlayer.play();
}

function hideAndShowText1(state = "none") {
  const el = document.getElementById("i_text_2");
  if (el) el.style.display = state;
}

function hideAndShowAudioButtons(state = "none") {
  // document.getElementById("audio_button_1").style.display = state;
  // document.getElementById("audio_button_2").style.display = state;
  document.getElementById("audio_button_3").style.display = state;
  document.getElementById("arrow_audio").style.display = state;
}
function showAnswer(state = "none") {
  // wg88 uses per-side paths; delegate to reset/show via helper
  if (state === "none") {
    setOutlineForSide("cloud_text_01", null);
    setOutlineForSide("cloud_text_02", null);
  }
}
// function showText(state = "none") {
//   document.getElementById("cloud_text_highlight_01").style.display = state;
//   document.getElementById("cloud_text_highlight_02").style.display = state;
// }
function lottiAnimation(state = "block") {
  const el = document.getElementById("Character_train_01");
  if (el) el.style.display = state;
}
function nextbutton(state = "block") {
  document.getElementById("age_badhe_button").style.display = state;
}
function openModal() {
  const el = document.getElementById("modalOverlay");
  if (el) el.style.display = "block";
}

function closeModal() {
  const el = document.getElementById("modalOverlay");
  if (el) el.style.display = "none";
}
function gyankosh_button() {
  const btn = document.getElementById("gyankosh_button");
  if (!btn) {
    console.error("gyankosh_button element not found in DOM");
    return;
  }
  btn.addEventListener("click", function () {
    console.log("Gyankosh button clicked");
    openModal();
  });
  // Add close modal event after DOM is ready
  var closeBtn = document.getElementById("btn-close");
  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }
  // Also close modal when clicking outside modal content
  var overlay = document.getElementById("modalOverlay");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
  }
}
function naya_shabd() {
  naya_shabd_button = document.getElementById("naya_shabd_button");
  naya_shabd_button.addEventListener("click", () => {
    console.log("Naya shabd button clicked");
    document.getElementById("audio_button_1").style.display = "block";
    document.getElementById("audio_button_2").style.display = "block";
    audio_button_1 = false;
    audio_button_2 = false;
    age_badhe_button = false;
    selectRandomWord();
    hideAndShowAudioButtons("none");
    showAnswer();
    // showText();
    lottiAnimation("none");
    nextbutton();
    audioPlayer.pause();
    let i_text = document.getElementById("i_text_1");
    if (i_text) {
      const tspans = i_text.querySelector("tspan");
      if (tspans) {
        tspans.textContent = "दोनों शब्दों को सुनें और मात्रा का उच्चारण समझें।";
      }
    }
  });
}

function getRandomUnusedWordKey() {
  const keys = Object.keys(WordAudioEnum).filter((k) => !usedWords.includes(k));

  if (keys.length === 0) {
    usedWords = []; // reset when all used
    return getRandomUnusedWordKey();
  }

  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  usedWords.push(randomKey);
  return randomKey;
}
function playLottieAnimation(bandGroup) {
  const containerEl = document.getElementById("lottie-container");
  const parentEl = document.getElementById("Character_train_01");

  if (!containerEl || !parentEl) return;

  const animationPath = LottieAnimations[selectedWord.type][bandGroup];
  if (!animationPath) return;

  const type = animationPath.split("_")[0];

  if (lottieInstances) {
    if (animationTimeout) clearTimeout(animationTimeout);
    lottieInstances.destroy();
    lottieInstances = null;
  }
  containerEl.innerHTML = "";
  parentEl.style.display = "block";
  parentEl.classList.remove("visible");
  playAnimationAudio(bandGroup);

  try {
    lottieInstances = lottie.loadAnimation({
      container: containerEl,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: `assets/JSON/${animationPath}`,
    });

    lottieInstances.addEventListener("DOMLoaded", () => {
      lottieInstances.play();
      parentEl.classList.add("visible");
    });

    lottieInstances.addEventListener("complete", () => {
      animationTimeout = setTimeout(() => {
        parentEl.classList.remove("visible");
        parentEl.style.display = "none";
        resetFeedbackVisuals();
        // if (bandGroup === "INCORRECT") {
        //   document.getElementById("audio_button_1").style.display = "block";
        //   document.getElementById("audio_button_2").style.display = "block";
        //   audio_button_1 = false;
        //   audio_button_2 = false;
        //   age_badhe_button = false;
        //   nextbutton();
        //   hideAndShowAudioButtons("none");
        //   let i_text = document.getElementById("i_text_1");
        //   const tspans = i_text.querySelector("p");
        //   tspans.innerHTML =
        //     "दोनों शब्दों को सुनें और मात्रा का उच्चारण समझें। ";
        // }

        if (lottieInstances) {
          lottieInstances.destroy();
          lottieInstances = null;
        }
        containerEl.innerHTML = "";
      }, 1000); // ← keep final frame ~1 second
    });

    lottieInstances.addEventListener("error", (e) => {
      // console.error('Lottie render error:', e);
      // parentEl.style.display = 'none';
    });

    // Safety override
    if (lottieInstances.audioController) {
      lottieInstances.audioController.pause = () =>
        console.warn("[patched] Audio pause skipped");
    }
  } catch (err) {
    console.error("Lottie load crashed:", err);
    parentEl.classList.remove("visible");
  }
}
function playAnimationAudio(bandGroup) {
  let name = "";
  name = LottieAnimations[selectedWord.type][bandGroup].replace("json", "mp3");
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.src = `assets/JSON/${name}`;
  audioPlayer.play();
}
getAllWordElements = () => {
  fetch("assets/JSON/word.json") // Replace with your API endpoint
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }

      return response.json();
    })
    .then((data) => {
      // Work with the parsed JSON data (a JavaScript object)
      console.log(data);
      WordAudioEnum = data;
      init();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
window.addEventListener("load", getAllWordElements);
