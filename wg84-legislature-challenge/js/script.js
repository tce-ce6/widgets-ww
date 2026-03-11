let questionData = [];
let audioPlayer = new Audio();
const usedIndexes = new Set();
let selectedQuestion = null;
let correctCount = 0;
insightsInfo = () => {
  document.getElementById("insights-box").style.display = "block";
  document.getElementById("svg-container").classList.add("modal-open");
};

function init() {
  selectedQuestion = getRandomQuestion();
  setQuestionStem(selectedQuestion.scenarioText);
  buttonClickEvent();
  progress_count_update();
  let btnInsights = document.getElementById("btn-insights");
  btnInsights.addEventListener("click", insightsInfo);
  let btnClose = document.getElementById("btn-close");
  btnClose.addEventListener("click", () => {
    document.getElementById("insights-box").style.display = "none";
    document.getElementById("svg-container").classList.remove("modal-open");
  });
  let btnStartAgain = document.getElementById("start_again");
  btnStartAgain.addEventListener("click", () => {
    location.reload();
  });
}

let executiveCount = 0;
let legislatureCount = 0;

function addLegislatureIcons(count) {
  const svg = document.getElementById("legislature-Badges");
  const legislatureoriginalIcon = document.getElementById("legislature-icon");
  const clone = legislatureoriginalIcon.cloneNode(true);
  // remove duplicate id
  clone.removeAttribute("id");

  // position each icon
  clone.setAttribute(
    "transform",
    `translate(${(count - 1) * 55}, 0)`, // move horizontally
  );

  svg.appendChild(clone);
}

progress_count_update = () => {
  const progress_count = document.getElementById("progress_count");
  const tspan = progress_count.querySelector("tspan") || progress_count;
  tspan.textContent = `${usedIndexes.size}/${questionData.length}`;
};
function addExecutiveIcons(count) {
  const ExecutiveBadges = document.getElementById("Executive-Badges");
  const executiveoriginalIcon = document.getElementById("executive-icon");
  const clone = executiveoriginalIcon.cloneNode(true);
  // remove duplicate id
  clone.removeAttribute("id");

  // position each icon
  clone.setAttribute(
    "transform",
    `translate(${(count - 1) * 55}, 0)`, // move horizontally
  );

  ExecutiveBadges.appendChild(clone);
}

function buttonClickEvent() {
  const btnlegislature = document.getElementById("btn-legislature");
  btnlegislature.addEventListener("click", () => {
    if (selectedQuestion.correctAnswer === "Legislature") {
      console.log("legislature correct");
      questionValidation("CORRECT");
      legislatureCountIncrement();
      correctCount++;
    } else {
      questionValidation("INCORRECT");
    }
  });
  const btnexecutive = document.getElementById("btn-executive");
  btnexecutive.addEventListener("click", () => {
    if (selectedQuestion.correctAnswer === "Executive") {
      console.log("executive correct");
      questionValidation("CORRECT");
      executiveCountIncrement();
      correctCount++;
    } else {
      questionValidation("INCORRECT");
    }
  });
  const btnnext = document.getElementById("btn-next");
  btnnext.addEventListener("click", () => {
    hideAllBoxAndButton();
    selectedQuestion = getRandomQuestion();
    if (selectedQuestion) setQuestionStem(selectedQuestion.scenarioText);
    progress_count_update();
  });
}
executiveCountIncrement = () => {
  executiveCount += 1;
  document.getElementById("executive-icon").style.display = "block";
  if (executiveCount > 1) {
    addExecutiveIcons(executiveCount);
  }
  progress_count_update();
};
legislatureCountIncrement = () => {
  legislatureCount += 1;
  document.getElementById("legislature-icon").style.display = "block";
  if (legislatureCount > 1) {
    addLegislatureIcons(legislatureCount);
  }
  progress_count_update();
};
questionValidation = (type) => {
  if (type === "CORRECT") {
    document.getElementById("correct-box").style.display = "block";
    document.getElementById("correct-animation").style.display = "block";
    document.getElementById("incorrect-box").style.display = "none";
    showFeedback("correct_feedback");
  } else {
    document.getElementById("incorrect-box").style.display = "block";
    document.getElementById("correct-box").style.display = "none";
    showFeedback("incorrect_feedback");
  }
  document.getElementById("btn-next").style.display = "block";
};
showFeedback = (id) => {
  let feedback = document.getElementById(id);
  let lines = [];
  const maxLineLength = 46;

  if (selectedQuestion.feedback.length > maxLineLength) {
    let splitIndex = selectedQuestion.feedback.lastIndexOf(" ", maxLineLength);
    if (splitIndex === -1) {
      lines.push(selectedQuestion.feedback.substring(0, maxLineLength));
      lines.push(selectedQuestion.feedback.substring(maxLineLength));
    } else {
      lines.push(selectedQuestion.feedback.substring(0, splitIndex));
      lines.push(selectedQuestion.feedback.substring(splitIndex + 1));
    }
  } else {
    lines.push(selectedQuestion.feedback);
  }

  let y = 517.754;
  feedback.innerHTML = "";
  for (let i = 0; i < lines.length; i++) {
    y += 35;
    feedback.innerHTML += `<tspan x='625' y='${y}'>${lines[i]}</tspan>`;
  }
};
hideAllBoxAndButton = () => {
  document.getElementById("correct-box").style.display = "none";
  document.getElementById("incorrect-box").style.display = "none";
  document.getElementById("correct-animation").style.display = "none";
  document.getElementById("btn-next").style.display = "none";
};

function setQuestionStem(questionStem) {
  let question_text = document.getElementById("question_stem");
  question_text.innerHTML = questionStem;
}
function getRandomQuestion() {
  if (usedIndexes.size === questionData.length) {
    console.log("All questions used");
    document.getElementById("summary-box").style.display = "block";
    // Hide game UI elements
    var quizBox = document.getElementById("quiz-box");
    var btnLeg = document.getElementById("btn-legislature");
    var btnExe = document.getElementById("btn-executive");
    var iText = document.getElementById("i-text");
    var legislatureBadges = document.getElementById("legislature-Badges");
    var executiveBadges = document.getElementById("Executive-Badges");
    var btnInsights = document.getElementById("btn-insights");
    var progress = document.getElementById("progress");
    if (quizBox) quizBox.style.display = "none";
    if (btnLeg) btnLeg.style.display = "none";
    if (btnExe) btnExe.style.display = "none";
    if (iText) iText.style.display = "none";
    if (legislatureBadges) legislatureBadges.style.display = "none";
    if (executiveBadges) executiveBadges.style.display = "none";
    if (btnInsights) btnInsights.style.display = "none";
    if (progress) progress.style.display = "none";
    let legislature_summary = document.getElementById("legislature-summary");
    let legislaturetspan =
      legislature_summary.querySelector("tspan") || legislature_summary;
    legislaturetspan.textContent = legislatureCount;
    let executive_summary = document.getElementById("executive-summary");
    const tspan1 =
      executive_summary.querySelector("tspan") || executive_summary;
    tspan1.textContent = executiveCount;
    let totalbadges = document.getElementById("totalbadges");
    const tspan = totalbadges.querySelector("tspan") || totalbadges;
    tspan.textContent = `${correctCount}/${questionData.length}`;

    console.log("End of game reached. correctCount:", correctCount);
    let wellDoneText = document.getElementById("wellDone");
    let wellDoneTspan = wellDoneText.querySelector("tspan") || wellDoneText;
    console.log("wellDone element found:", wellDoneText);
    if (correctCount === 0) {
      console.log("Setting text to Try Again!");
      wellDoneTspan.innerHTML = "Try Again!";
    } else {
      console.log("Setting text to Well Done!");
      wellDoneTspan.innerHTML = "Well Done!";
    }

    if (correctCount > 0) {
      playLottieAnimation();
    }
    return null;
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * questionData.length);
  } while (usedIndexes.has(randomIndex));

  usedIndexes.add(randomIndex);
  return questionData[randomIndex];
}
function playAudio() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.src = `assets/JSON/FinalAnswer_celebration.json`;
  audioPlayer.play();
}

const playLottieAnimation = () => {
  const containerEl = document.getElementById("lottie-container");
  if (!containerEl) return;
  const anim = lottie.loadAnimation({
    container: containerEl,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: `assets/JSON/FinalAnswer_celebration.json`,
  });
};
getAllQuestion = () => {
  fetch("assets/question.json") // Replace with your API endpoint
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }

      return response.json();
    })
    .then((data) => {
      console.log(data);
      questionData = data;
      loadPlayer();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
loadPlayer = () => {
  let proceedbtn = document.getElementById("proceed-btn");
  proceedbtn.addEventListener("click", () => {
    document.getElementById("player").style.display = "block";
    document.getElementById("legislature-vs-executive-box").style.display =
      "none";
    init();
  });
};
window.onload = getAllQuestion();
