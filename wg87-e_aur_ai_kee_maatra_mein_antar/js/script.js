WordAudioEnum = {};
let usedWords = [];
let selectedWord = null;
let audioPlayer = new Audio();
let lottieInstances = null;
let selectedLottie = null;
let audio_button_1 = false;
let audio_button_2 = false;
let age_badhe_button = false;
let correctPlacementSequence = [];
let placementIndex = 0;
const LottieAnimations = {
  ayee: {
    CORRECT: "correct-feedback-ayee.json",
    INCORRECT: "incorrect-feedback.json",
  },
  ye: {
    CORRECT: "correct-feedback-ye.json",
    INCORRECT: "incorrect-feedback.json",
  },
};

function init() {
  console.log("Script loaded and initialized.");
  // document.getElementById("i_text_1").style.fill = "blue";
  selectRandomWord();
  naya_shabd();
  // hideAndShowText1();
  hideAndShowAudioButtons("none");
  showAnswer();
  //showText();
  lottiAnimation("none");
  nextbutton();
  audioListener();
  nextStep();
  gyankosh_button();
  getRandomAnimation();
  let audioPLay = document.getElementById("audio_button_3");
  audioPLay.addEventListener("click", () => {
    playAudio("correct");
  });
  textClickEvent();
}

selectRandomWord = () => {
  currentWordKey = getRandomUnusedWordKey();
  selectedWord = WordAudioEnum[currentWordKey];
  console.log("Selected Word:", selectedWord);
  textDisplay();
};

function initializePlacementSequence() {
  const totalWords = Object.keys(WordAudioEnum).length;
  const half = Math.floor(totalWords / 2);
  correctPlacementSequence = [];

  for (let i = 0; i < totalWords; i++) {
    correctPlacementSequence.push(i < half ? "cloud_text_01" : "cloud_text_02");
  }

  // Fisher-Yates shuffle
  for (let i = correctPlacementSequence.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [correctPlacementSequence[i], correctPlacementSequence[j]] = [
      correctPlacementSequence[j],
      correctPlacementSequence[i],
    ];
  }
  placementIndex = 0;
}

function textDisplay() {
  let text1 = document.getElementById("cloud_text_01");
  let text2 = document.getElementById("cloud_text_02");
  const tspans = text1.querySelector("p");
  const tspan2 = text2.querySelector("p");
  if (placementIndex >= correctPlacementSequence.length) {
    initializePlacementSequence();
  }

  const correctCloud = correctPlacementSequence[placementIndex];
  placementIndex++;

  if (correctCloud === "cloud_text_01") {
    tspans.innerHTML = highlightConsonantWithUmatra(selectedWord.correct);
    tspan2.innerHTML = highlightConsonantWithUmatra(selectedWord.incorrect);
    correctCloudId = "cloud_text_01"; // ← remember
  } else {
    tspans.innerHTML = highlightConsonantWithUmatra(selectedWord.incorrect);
    tspan2.innerHTML = highlightConsonantWithUmatra(selectedWord.correct);
    correctCloudId = "cloud_text_02"; // ← remember
  }
  resetFeedbackVisuals();
}

function highlightConsonantWithUmatra(text) {
  // Matches any consonant + ए की मात्रा (े, U+0947) or ऐ की मात्रा (ै, U+0948)
  return text.replace(
    /([\u0915-\u0939\u0958-\u095F][\u0947\u0948])/g,
    (match) => {
      const charCode = match.charCodeAt(1); // Get code of the matra (2nd char)
      const className = charCode === 0x0948 ? "ai-vowel" : "e-vowel"; // 0948 = ऐ की मात्रा, 0947 = ए की मात्रा
      return `<span>${match}</span>`;
    },
  );
}

function resetFeedbackVisuals() {
  const highlights = ["cloud_text_01", "cloud_text_02"];
  const outlines = [
    "cloud_text_outline_correct",
    "cloud_text_outline_Incorrect",
  ];

  highlights.forEach((id) => {
    const el = document.getElementById(id).querySelector("p");
    if (el) el.classList.remove("cloud_text_highlight");
  });

  outlines.forEach((id) => {
    const el = document.getElementById(id);
    el.style.display = "none";
    el.classList.remove(
      "visible",
      "cloud_text_highlight_correct",
      "cloud_text_highlight_incorrect",
    );
    if (el) el.classList.remove("visible");
  });

  // Hide star groups
  ["Group_81", "Group_83", "Group_86"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  lottiAnimation("none");
}
function nextStep() {
  let nextButton = document.getElementById("age_badhe_button");
  nextButton.addEventListener("click", () => {
    // Logic to go to the next step
    nextButton.style.display = "none";
    let i_text = document.getElementById("i_text_1");
    const tspans = i_text.querySelector("p");
    tspans.innerHTML =
      "ऑडियो सुनें।&nbsp;कौन-सा शब्द सुना आपने? सही शब्द पर टैप करें।";
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

    // Activate clicked highlight
    const highlightId =
      cloudId === "cloud_text_01"
        ? "cloud_text_highlight_01"
        : "cloud_text_highlight_02";

    // Choose outline by POSITION (names are positional: Incorrect=LEFT, correct=RIGHT)
    const outlineId =
      cloudId === "cloud_text_01"
        ? "cloud_text_outline_Incorrect" // LEFT outline
        : "cloud_text_outline_correct"; // RIGHT outline

    const outlineEl = document.getElementById(outlineId);
    outlineEl.style.display = "block";
    const paths = outlineEl.querySelectorAll("path");
    if (paths[0] && paths[0].hasAttribute("fill")) {
      paths[0].setAttribute("fill", isCorrect ? "#93F724" : "#FF0801");
    }
    // Show stars within THIS outline element (avoids duplicate ID clash)
    if (isCorrect) {
      ["Group_81", "Group_83", "Group_86"].forEach((id) => {
        const el = outlineEl.querySelector(`[id="${id}"]`);
        if (el) el.style.display = "block";
      });
    }
    let tspans = document.getElementById(cloudId).querySelector("p");
    tspans.classList.add("cloud_text_highlight");
    // Animation
    lottiAnimation("block");
    playLottieAnimation(isCorrect ? "CORRECT" : "INCORRECT");
    if (isCorrect) {
      playLottieAnimationStart(cloudId);
    }
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

  setButtonsDisabled(true);
  const onFinish = () => {
    setButtonsDisabled(false);
    audioPlayer.removeEventListener("ended", onFinish);
    audioPlayer.removeEventListener("error", onFinish);
  };
  audioPlayer.addEventListener("ended", onFinish);
  audioPlayer.addEventListener("error", onFinish);
  audioPlayer.play();
}
function playAnimationAudio(bandGroup) {
  let name = "";
  name = LottieAnimations[selectedWord.type][bandGroup].replace("json", "mp3");
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.src = `assets/JSON/${name}`;
  audioPlayer.play();
}

function hideAndShowText1(state = "none") {
  document.getElementById("i_text_2").style.display = state;
}

function hideAndShowAudioButtons(state = "none") {
  // document.getElementById("audio_button_1").style.display = state;
  // document.getElementById("audio_button_2").style.display = state;
  document.getElementById("audio_button_3").style.display = state;
  document.getElementById("arrow_audio").style.display = state;
}
function showAnswer(state = "none") {
  document.getElementById("cloud_text_outline_Incorrect").style.display = state;
  document.getElementById("cloud_text_outline_correct").style.display = state;
}
// function showText(state = "none") {
//   document.getElementById("cloud_text_highlight_01").style.display = state;
//   document.getElementById("cloud_text_highlight_02").style.display = state;
// }
function lottiAnimation(state = "block") {
  document.getElementById("Character_train_01").style.display = state;
}
function nextbutton(state = "block") {
  document.getElementById("age_badhe_button").style.display = state;
}
function openModal() {
  document.getElementById("modalOverlay").style.display = "flex";
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
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
    // hideAndShowText1();
    hideAndShowAudioButtons("none");
    showAnswer();
    // showText();
    lottiAnimation("none");
    nextbutton();
    getRandomAnimation();
    audioPlayer.pause();
    let i_text = document.getElementById("i_text_1");
    const tspans = i_text.querySelector("p");
    tspans.innerHTML = "दोनों शब्दों को सुनें और मात्रा का उच्चारण समझें। ";
  });
}

function getRandomAnimation() {
  const animals = Object.keys(LottieAnimations);
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  selectedLottie = LottieAnimations[randomAnimal];
}
function setButtonsDisabled(disabled) {
  const ids = [
    "audio_button_1",
    "audio_button_2",
    "audio_button_3",
    "age_badhe_button",
    "naya_shabd_button",
    "gyankosh_button",
    "arrow_audio",
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      if (disabled) {
        el.setAttribute("data-audio-disabled", "true");
        el.style.pointerEvents = "none";
        el.style.opacity =
          el.style.opacity === ""
            ? "0.6"
            : el.style.opacity === "1"
              ? "0.6"
              : el.style.opacity;
      } else {
        el.removeAttribute("data-audio-disabled");
        el.style.pointerEvents = "";
        el.style.opacity = "";
      }
    }
  });
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


  try {
    lottieInstances = lottie.loadAnimation({
      container: containerEl,
      renderer: "canvas",
      loop: false,
      autoplay: false,
      path: `assets/JSON/${animationPath}`,
    });

    lottieInstances.addEventListener("DOMLoaded", () => {
      playAnimationAudio(bandGroup);
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

function playLottieAnimationStart(bandGroup) {
  let el =
    bandGroup === "cloud_text_01"
      ? "star-lottie-container-1"
      : "star-lottie-container-2";
  const containerEl = document.getElementById(el);

  if (!containerEl) return;

  if (lottieInstances_star) {
    if (starAnimationTimeout) clearTimeout(starAnimationTimeout);
    lottieInstances_star.destroy();
    lottieInstances_star = null;
  }
  containerEl.innerHTML = "";
  containerEl.classList.remove("visible");

  try {
    lottieInstances_star = lottie.loadAnimation({
      container: containerEl,
      renderer: "canvas",
      loop: false,
      autoplay: false,
      path: `assets/Animation/shining stars.json`,
    });

    lottieInstances_star.addEventListener("DOMLoaded", () => {
      lottieInstances_star.play();
      containerEl.classList.add("visible");
    });

    lottieInstances_star.addEventListener("complete", () => {
      starAnimationTimeout = setTimeout(() => {
        containerEl.classList.remove("visible");
        if (lottieInstances_star) {
          lottieInstances_star.destroy();
          lottieInstances_star = null;
        }
        containerEl.innerHTML = "";
      }, 1000); // ← keep final frame ~1 second
    });

    lottieInstances_star.addEventListener("error", (e) => {
      // console.error('Lottie render error:', e);
      // parentEl.style.display = 'none';
    });

    // Safety override
    if (lottieInstances_star.audioController) {
      lottieInstances_star.audioController.pause = () =>
        console.warn("[patched] Audio pause skipped");
    }
  } catch (err) {
    console.error("Lottie load crashed:", err);
    containerEl.classList.remove("visible");
  }
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
      initializePlacementSequence()
      init();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
window.addEventListener("load", getAllWordElements);
