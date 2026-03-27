document.addEventListener("DOMContentLoaded", () => {

  // ─────────────────────────────────────────────────────────────
  //  DATA – all 25 questions with image mappings
  // ─────────────────────────────────────────────────────────────
  const data = [
    {
      id: 1,
      sentenceA: 'The elephant is <span class="highlight">big</span>.',
      sentenceB: "The mouse is _____.",
      sentenceAimg: "./assets/options/big.svg",
      sentenceBimg: "./assets/options/small.svg",
      options: ["small", "fast", "happy"],
      answer: "small",
      note: "'Big' and 'small' are opposites."
    },
    {
      id: 2,
      sentenceA: 'Summer days are <span class="highlight">hot</span>.',
      sentenceB: "Winter days are _____.",
      sentenceAimg: "./assets/options/Summer.svg",
      sentenceBimg: "./assets/options/Winter-cold.svg",
      options: ["cold", "short", "dry"],
      answer: "cold",
      note: "'Hot' and 'cold' are opposites."
    },
    {
      id: 3,
      sentenceA: 'The girl is <span class="highlight">happy</span>.',
      sentenceB: "The boy is _____.",
      sentenceAimg: "./assets/options/happy.svg",
      sentenceBimg: "./assets/options/sad.svg",
      options: ["sad", "small", "slow"],
      answer: "sad",
      note: "'Happy' and 'sad' are opposites."
    },
    {
      id: 4,
      sentenceA: 'The rabbit is <span class="highlight">fast</span>.',
      sentenceB: "The snail is _____.",
      sentenceAimg: "./assets/options/fast.svg",
      sentenceBimg: "./assets/options/slow.svg",
      options: ["slow", "soft", "wet"],
      answer: "slow",
      note: "'Fast' and 'slow' are opposites."
    },
    {
      id: 5,
      sentenceA: 'The brown teddy bear is <span class="highlight">old</span>.',
      sentenceB: "The white teddy bear is _____.",
      sentenceAimg: "./assets/options/brown-teddy.svg",
      sentenceBimg: "./assets/options/white-teddy-new.svg",
      options: ["new", "small", "happy"],
      answer: "new",
      note: "'Old' and 'new' are opposites."
    },
    {
      id: 6,
      sentenceA: 'The sky is bright during the <span class="highlight">day</span>.',
      sentenceB: "The sky is dark at _____.",
      sentenceAimg: "./assets/options/day.svg",
      sentenceBimg: "./assets/options/night.svg",
      options: ["night", "cold", "quiet"],
      answer: "night",
      note: "'Day' and 'night' are opposites."
    },
    {
      id: 7,
      sentenceA: 'My hands are <span class="highlight">clean</span>.',
      sentenceB: "My shoes are _____.",
      sentenceAimg: "./assets/options/clean.svg",
      sentenceBimg: "./assets/options/dirty.svg",
      options: ["dirty", "old", "shiny"],
      answer: "dirty",
      note: "'Clean' and 'dirty' are opposites."
    },
    {
      id: 8,
      sentenceA: 'The bird flew <span class="highlight">up</span>.',
      sentenceB: "The leaf fell _____.",
      sentenceAimg: "./assets/options/up.svg",
      sentenceBimg: "./assets/options/down.svg",
      options: ["down", "above", "outside"],
      answer: "down",
      note: "'Up' and 'down' are opposites."
    },
    {
      id: 9,
      sentenceA: 'The giraffe is <span class="highlight">tall</span>.',
      sentenceB: "The puppy is _____.",
      sentenceAimg: "./assets/options/tall.svg",
      sentenceBimg: "./assets/options/tall-short-new.svg",
      options: ["short", "dirty", "soft"],
      answer: "short",
      note: "'Tall' and 'short' are opposites."
    },
    {
      id: 10,
      sentenceA: 'The towel is <span class="highlight">wet</span>.',
      sentenceB: "The paper is _____.",
      sentenceAimg: "./assets/options/wet.svg",
      sentenceBimg: "./assets/options/dry.svg",
      options: ["dry", "clean", "light"],
      answer: "dry",
      note: "'Wet' and 'dry' are opposites."
    },
    {
      id: 11,
      sentenceA: 'The bottle is <span class="highlight">full</span>.',
      sentenceB: "The basket is _____.",
      sentenceAimg: "./assets/options/full.svg",
      sentenceBimg: "./assets/options/empty.svg",
      options: ["empty", "old", "small"],
      answer: "empty",
      note: "'Full' and 'empty' are opposites."
    },
    {
      id: 12,
      sentenceA: 'The rock is <span class="highlight">heavy</span>.',
      sentenceB: "The feather is _____.",
      sentenceAimg: "./assets/options/heavy1.svg",
      sentenceBimg: "./assets/options/light.svg",
      options: ["light", "soft", "big"],
      answer: "light",
      note: "'Heavy' and 'light' are opposites."
    },
    {
      id: 13,
      sentenceA: 'The drum is <span class="highlight">loud</span>.',
      sentenceB: "The library is _____.",
      sentenceAimg: "./assets/options/loud.svg",
      sentenceBimg: "./assets/options/quiet.svg",
      options: ["quiet", "clean", "empty"],
      answer: "quiet",
      note: "'Loud' and 'quiet' are opposites."
    },
    {
      id: 14,
      sentenceA: 'The stone is <span class="highlight">hard</span>.',
      sentenceB: "The pillow is _____.",
      sentenceAimg: "./assets/options/hard-soft.svg",
      sentenceBimg: "./assets/options/soft.svg",
      options: ["soft", "light", "clean"],
      answer: "soft",
      note: "'Hard' and 'soft' are opposites."
    },
    {
      id: 15,
      sentenceA: 'The door is <span class="highlight">open</span>.',
      sentenceB: "The box is _____.",
      sentenceAimg: "./assets/options/open.svg",
      sentenceBimg: "./assets/options/closed.svg",
      options: ["closed", "full", "heavy"],
      answer: "closed",
      note: "'Open' and 'closed' are opposites."
    },
    {
      id: 16,
      sentenceA: 'The rope is <span class="highlight">long</span>.',
      sentenceB: "The pencil is _____.",
      sentenceAimg: "./assets/options/long.svg",
      sentenceBimg: "./assets/options/long-short.svg",
      options: ["short", "thin", "light"],
      answer: "short",
      note: "'Long' and 'short' are opposites."
    },
    {
      id: 17,
      sentenceA: 'The book is <span class="highlight">thick</span>.',
      sentenceB: "The paper is _____.",
      sentenceAimg: "./assets/options/thik.svg",
      sentenceBimg: "./assets/options/thin.svg",
      options: ["thin", "light", "short"],
      answer: "thin",
      note: "'Thick' and 'thin' are opposites."
    },
    {
      id: 18,
      sentenceA: 'The school is <span class="highlight">near</span> the red house.',
      sentenceB: "The mountain is _____ from the school.",
      sentenceAimg: "./assets/options/near.svg",
      sentenceBimg: "./assets/options/far.svg",
      options: ["far", "tall", "old"],
      answer: "far",
      note: "'Near' and 'far' are opposites."
    },
    {
      id: 19,
      sentenceA: 'I woke up <span class="highlight">early</span>.',
      sentenceB: "I went to bed _____.",
      sentenceAimg: "./assets/options/early.svg",
      sentenceBimg: "./assets/options/late.svg",
      options: ["late", "cold", "happy"],
      answer: "late",
      note: "'Early' and 'late' are opposites."
    },
    {
      id: 20,
      sentenceA: 'The cat is <span class="highlight">inside</span> the house.',
      sentenceB: "The dog is _____ the house.",
      sentenceAimg: "./assets/options/inside.svg",
      sentenceBimg: "./assets/options/outside.svg",
      options: ["outside", "near", "behind"],
      answer: "outside",
      note: "'Inside' and 'outside' are opposites."
    },
    {
      id: 21,
      sentenceA: 'She sits at the <span class="highlight">front</span> of the class.',
      sentenceB: "He sits at the _____ of the class.",
      sentenceAimg: "./assets/options/front.svg",
      sentenceBimg: "./assets/options/back.svg",
      options: ["back", "middle", "side"],
      answer: "back",
      note: "'Front' and 'back' are opposites."
    },
    {
      id: 22,
      sentenceA: 'Eating fruits is <span class="highlight">good</span> for health.',
      sentenceB: "Eating too many sweets is _____ for health.",
      sentenceAimg: "./assets/options/good.svg",
      sentenceBimg: "./assets/options/bad.svg",
      options: ["bad", "sad", "dirty"],
      answer: "bad",
      note: "'Good' and 'bad' are opposites."
    },
    {
      id: 23,
      sentenceA: 'The metal bridge is <span class="highlight">strong</span>.',
      sentenceB: "The old fence is _____.",
      sentenceAimg: "./assets/options/strong.svg",
      sentenceBimg: "./assets/options/weak.svg",
      options: ["weak", "long", "tall"],
      answer: "weak",
      note: "'Strong' and 'weak' are opposites."
    },
    {
      id: 24,
      sentenceA: 'The bird is at the <span class="highlight">top</span> of the tree.',
      sentenceB: "The roots are at the _____ of the tree.",
      sentenceAimg: "./assets/options/top.svg",
      sentenceBimg: "./assets/options/bottom.svg",
      options: ["bottom", "side", "back"],
      answer: "bottom",
      note: "'Top' and 'bottom' are opposites."
    },
    {
      id: 25,
      sentenceA: 'This puzzle is <span class="highlight">easy</span>.',
      sentenceB: "That puzzle is _____.",
      sentenceAimg: "./assets/options/easy.svg",
      sentenceBimg: "./assets/options/easy-hard.svg",
      options: ["hard", "heavy", "big"],
      answer: "hard",
      note: "'Easy' and 'hard' are opposites."
    }
  ];

  // ─────────────────────────────────────────────────────────────
  //  STATE
  // ─────────────────────────────────────────────────────────────
  let shuffledData = [];
  let currentIndex = 0;
  let currentOptions = [];   // options in their current displayed order
  let answerLocked = false;
  let correctLottieAnim = null;

  // ─────────────────────────────────────────────────────────────
  //  ELEMENT REFS  (using exact IDs from the original HTML)
  // ─────────────────────────────────────────────────────────────
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");

  const startBtn = document.getElementById("start-btn");
  const noteFo = document.getElementById("note-foreground");
  const noteWrapper = document.getElementById("note-wrapper");
  const noteTxt = document.getElementById("note-txt");
  const lottieAnimEl = document.getElementById("lottie-animation");

  const sentenceAEl = document.getElementById("sentenceA");
  const sentenceBEl = document.getElementById("sentenceB");
  const sentenceAImg = document.getElementById("sentenceAimg");
  const sentenceBImg = document.getElementById("sentenceBimg");

  // The three <li> word-option items inside #options
  const optionsList = document.getElementById("options");
  const optionItems = optionsList.querySelectorAll("li");

  // next-btn now has an id in the HTML
  const nextBtnImg = document.getElementById("next-btn");
  const playAgainBtnImg = step3.querySelector('img[src="./assets/play-again.svg"]');

  // ─────────────────────────────────────────────────────────────
  //  AUDIO 
  // ─────────────────────────────────────────────────────────────
  let currentAudio = null;
  function playAudio(src) {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(src);
    currentAudio.play().catch(e => console.error("Audio play failed:", e));
  }

  // ─────────────────────────────────────────────────────────────
  //  UTILITY: Fisher-Yates shuffle (pure – returns new array)
  // ─────────────────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ─────────────────────────────────────────────────────────────
  //  SHOW / HIDE screens
  // ─────────────────────────────────────────────────────────────
  function showScreen(screenId) {
    [step1, step2, step3].forEach(s => (s.style.display = "none"));
    document.getElementById(screenId).style.display = "block";
  }

  // ─────────────────────────────────────────────────────────────
  //  NEXT button – always visible, toggle .disabled
  // ─────────────────────────────────────────────────────────────
  function disableNextBtn() {
    if (nextBtnImg) nextBtnImg.classList.add("disabled");
  }
  function enableNextBtn() {
    if (nextBtnImg) nextBtnImg.classList.remove("disabled");
  }

  // ─────────────────────────────────────────────────────────────
  //  LOAD QUESTION  – populate existing DOM nodes
  // ─────────────────────────────────────────────────────────────
  function loadQuestion(q) {
    answerLocked = false;

    // Reset feedback note
    noteFo.style.display = "none";
    noteWrapper.classList.remove("correct", "wrong");
    noteTxt.textContent = "";
    lottieAnimEl.innerHTML = "";
    correctLottieAnim = null;

    // Reset all option items
    optionItems.forEach(li => {
      li.classList.remove("correct", "wrong");
      li.style.opacity = "1";
      li.style.pointerEvents = "auto";
      li.style.cursor = "pointer";
    });

    // Disable next button (keep visible)
    disableNextBtn();

    // Set sentence text
    sentenceAEl.innerHTML = q.sentenceA;
    sentenceBEl.innerHTML = q.sentenceB;

    // Set images
    sentenceAImg.src = q.sentenceAimg;
    sentenceBImg.src = "";
    sentenceBImg.style.display = "none";

    // Shuffle options and populate the <li> elements
    currentOptions = shuffle(q.options);
    optionItems.forEach((li, i) => {
      li.textContent = currentOptions[i];
    });
  }

  // ─────────────────────────────────────────────────────────────
  //  HANDLE CORRECT
  // ─────────────────────────────────────────────────────────────
  function handleCorrect(li, optionIndex) {
    answerLocked = true;

    // Add .correct class to the selected option
    li.classList.add("correct");

    // Dim others
    optionItems.forEach((item, i) => {
      if (i !== optionIndex) {
        item.style.opacity = "0.4";
        item.style.pointerEvents = "none";
      }
    });

    const q = shuffledData[currentIndex];

    // Play correct sound
    const match = q.sentenceA.match(/<span class="highlight">(.*?)<\/span>/);
    if (match) {
      const wordA = match[1].toLowerCase();
      playAudio(`./assets/audio/${wordA}-${q.answer.toLowerCase()}.mp3`);
    }

    // Fill blank in sentence B
    sentenceBEl.innerHTML = q.sentenceB.replace(
      /_+/,
      `<span style="color:#00c94b;font-weight:800;text-decoration:underline;">${q.answer}</span>`
    );

    sentenceBImg.src = q.sentenceBimg;
    sentenceBImg.style.display = "block";

    // Show feedback note
    noteTxt.textContent = q.note;
    noteWrapper.classList.remove("wrong");
    noteWrapper.classList.add("correct");
    noteFo.style.display = "block";

    // Lottie animation – destroy any previous instance first
    if (correctLottieAnim) {
      correctLottieAnim.destroy();
      correctLottieAnim = null;
      lottieAnimEl.innerHTML = "";
    }
    if (typeof lottie !== "undefined") {
      correctLottieAnim = lottie.loadAnimation({
        container: lottieAnimEl,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "./lottie/correct.json"
      });
    }

    // Enable NEXT button after delay
    setTimeout(enableNextBtn, 1200);
  }

  // ─────────────────────────────────────────────────────────────
  //  HANDLE WRONG
  // ─────────────────────────────────────────────────────────────
  function handleWrong(li) {
    if (answerLocked) return;

    // Add .wrong class to the selected option
    li.classList.add("wrong");

    // Play wrong sound
    playAudio("./assets/audio/try-again.mp3");

    // Show "Oh no!" note
    noteTxt.textContent = "Oh no! Try again!";
    noteWrapper.classList.remove("correct");
    noteWrapper.classList.add("wrong");
    noteFo.style.display = "block";

    // Lottie animation – destroy any previous instance first, then load wrong
    if (correctLottieAnim) {
      correctLottieAnim.destroy();
      correctLottieAnim = null;
      lottieAnimEl.innerHTML = "";
    }
    if (typeof lottie !== "undefined") {
      correctLottieAnim = lottie.loadAnimation({
        container: lottieAnimEl,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "./lottie/wrong.json"
      });
    }

    // After 3s: hide note and remove .wrong class from option
    setTimeout(() => {
      noteFo.style.display = "none";
      noteWrapper.classList.remove("wrong");
      li.classList.remove("wrong");
      correctLottieAnim.destroy();
      correctLottieAnim = null;
      lottieAnimEl.innerHTML = "";
    }, 2000);
  }

  // ─────────────────────────────────────────────────────────────
  //  GO NEXT
  // ─────────────────────────────────────────────────────────────
  function goNext() {
    // Block if next-btn is still disabled
    if (nextBtnImg && nextBtnImg.classList.contains("disabled")) return;

    if (correctLottieAnim) {
      correctLottieAnim.destroy();
      correctLottieAnim = null;
      lottieAnimEl.innerHTML = "";
    }
    currentIndex++;
    if (currentIndex >= shuffledData.length) {
      showScreen("step-3");
    } else {
      loadQuestion(shuffledData[currentIndex]);
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  START GAME
  // ─────────────────────────────────────────────────────────────
  function startGame() {
    shuffledData = shuffle(data);
    currentIndex = 0;
    showScreen("step-2");
    loadQuestion(shuffledData[currentIndex]);
  }

  // ─────────────────────────────────────────────────────────────
  //  RESTART GAME
  // ─────────────────────────────────────────────────────────────
  function restartGame() {
    startGame();
  }

  // ─────────────────────────────────────────────────────────────
  //  EVENT LISTENERS
  // ─────────────────────────────────────────────────────────────

  // START button
  if (startBtn) {
    startBtn.addEventListener("click", startGame);
  }

  // NEXT button
  if (nextBtnImg) {
    nextBtnImg.style.cursor = "pointer";
    nextBtnImg.addEventListener("click", goNext);
  }

  // PLAY AGAIN button
  if (playAgainBtnImg) {
    playAgainBtnImg.style.cursor = "pointer";
    playAgainBtnImg.addEventListener("click", restartGame);
  }

  // Option <li> click
  optionItems.forEach((li, i) => {
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      if (answerLocked) return;
      const selected = currentOptions[i];
      const correct = shuffledData[currentIndex].answer;
      if (selected === correct) {
        handleCorrect(li, i);
      } else {
        handleWrong(li);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  //  DEBUG METHOD
  // ─────────────────────────────────────────────────────────────
  window.debugNavigate = function (query) {
    if (!query) {
      console.log('--- List of Options ---');
      data.forEach(item => {
        console.log(`Number: ${item.id}, Name: ${item.answer}`);
      });
      console.log('To navigate, pass the number or name. Example: debugNavigate(3) or debugNavigate("sad")');
      return;
    }

    const targetItem = data.find(item => item.id === Number(query) || item.answer.toLowerCase() === String(query).toLowerCase());

    if (targetItem) {
      if (shuffledData.length === 0) {
        shuffledData = [...data];
      }

      const foundIndex = shuffledData.findIndex(q => q.id === targetItem.id);
      if (foundIndex !== -1) {
        currentIndex = foundIndex;
      } else {
        shuffledData.push(targetItem);
        currentIndex = shuffledData.length - 1;
      }

      showScreen("step-2");
      loadQuestion(shuffledData[currentIndex]);
      console.log(`Navigated to Option: ${targetItem.answer} (Number: ${targetItem.id})`);
    } else {
      console.error("Option not found. Please provide a valid number or name.");
      console.log('--- List of Options ---');
      data.forEach(item => {
        console.log(`Number: ${item.id}, Name: ${item.answer}`);
      });
    }
  };

  // ─────────────────────────────────────────────────────────────
  //  INIT:  show the start screen first
  // ─────────────────────────────────────────────────────────────
  showScreen("step-1");

}); // end DOMContentLoaded
