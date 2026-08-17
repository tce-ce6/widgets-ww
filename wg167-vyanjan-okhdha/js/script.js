document.addEventListener("DOMContentLoaded", () => {
  const questionsData = [
    {
      letter: "क",
      letterSound: "ka.mp3",
      answer: "क",
      options: [
        { text: "क", sound: "assets/audio/ka.mp3" },
        { text: "फ", sound: "assets/audio/fa.mp3" },
        { text: "व", sound: "assets/audio/va.mp3" },
        { text: "ख", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ख",
      letterSound: "kha.mp3",
      answer: "ख",
      options: [
        { text: "र", sound: "assets/audio/ra.mp3" },
        { text: "श", sound: "assets/audio/sha.mp3" },
        { text: "क", sound: "assets/audio/ka.mp3" },
        { text: "ख", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ग",
      letterSound: "ga.mp3",
      answer: "ग",
      options: [
        { text: "ख", sound: "assets/audio/kha.mp3" },
        { text: "म", sound: "assets/audio/ma.mp3" },
        { text: "ग", sound: "assets/audio/ga.mp3" },
        { text: "भ", sound: "assets/audio/bha.mp3" },
      ],
    },
    {
      letter: "घ",
      letterSound: "gha.mp3",
      answer: "घ",
      options: [
        { text: "ध", sound: "assets/audio/dha.mp3" },
        { text: "छ", sound: "assets/audio/chha.mp3" },
        { text: "घ", sound: "assets/audio/gha.mp3" },
        { text: "ख", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ङ",
      letterSound: "daa.mp3",
      answer: "ङ",
      options: [
        { text: "ड़", sound: "assets/audio/dda.mp3" },
        { text: "इ", sound: "assets/audio/i.mp3" },
        { text: "ड", sound: "assets/audio/da.mp3" },
        { text: "ङ", sound: "assets/audio/daa.mp3" },
      ],
    },
    {
      letter: "च",
      letterSound: "cha.mp3",
      answer: "च",
      options: [
        { text: "च", sound: "assets/audio/cha.mp3" },
        { text: "ज", sound: "assets/audio/ja.mp3" },
        { text: "न", sound: "assets/audio/na2.mp3" },
        { text: "ञ", sound: "assets/audio/nya.mp3" },
      ],
    },
    {
      letter: "छ",
      letterSound: "chha.mp3",
      answer: "छ",
      options: [
        { text: "घ", sound: "assets/audio/gha.mp3" },
        { text: "ध", sound: "assets/audio/dha.mp3" },
        { text: "छ", sound: "assets/audio/chha.mp3" },
        { text: "झ", sound: "assets/audio/jha.mp3" },
      ],
    },
    {
      letter: "ज",
      letterSound: "ja.mp3",
      answer: "ज",
      options: [
        { text: "ज्ञ", sound: "assets/audio/gya.mp3" },
        { text: "ञ", sound: "assets/audio/nya.mp3" },
        { text: "ज", sound: "assets/audio/ja.mp3" },
        { text: "च", sound: "assets/audio/cha.mp3" },
      ],
    },
    {
      letter: "झ",
      letterSound: "jha.mp3",
      answer: "झ",
      options: [
        { text: "इ", sound: "assets/audio/i.mp3" },
        { text: "छ", sound: "assets/audio/chha.mp3" },
        { text: "ह", sound: "assets/audio/ha.mp3" },
        { text: "झ", sound: "assets/audio/jha.mp3" },
      ],
    },
    {
      letter: "ञ",
      letterSound: "nya.mp3",
      answer: "ञ",
      options: [
        { text: "ज", sound: "assets/audio/ja.mp3" },
        { text: "न", sound: "assets/audio/na2.mp3" },
        { text: "ञ", sound: "assets/audio/nya.mp3" },
        { text: "ज्ञ", sound: "assets/audio/gya.mp3" },
      ],
    },
    {
      letter: "ट",
      letterSound: "ta.mp3",
      answer: "ट",
      options: [
        { text: "ठ", sound: "assets/audio/tha.mp3" },
        { text: "ढ", sound: "assets/audio/ddha.mp3" },
        { text: "ढ़", sound: "assets/audio/ddha2.mp3" },
        { text: "ट", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "ठ",
      letterSound: "tha.mp3",
      answer: "ठ",
      options: [
        { text: "ठ", sound: "assets/audio/tha.mp3" },
        { text: "ढ", sound: "assets/audio/ddha.mp3" },
        { text: "ढ़", sound: "assets/audio/ddha2.mp3" },
        { text: "ट", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "ड",
      letterSound: "da.mp3",
      answer: "ड",
      options: [
        { text: "ड़", sound: "assets/audio/dda.mp3" },
        { text: "इ", sound: "assets/audio/i.mp3" },
        { text: "ड", sound: "assets/audio/da.mp3" },
        { text: "ङ", sound: "assets/audio/daa.mp3" },
      ],
    },
    {
      letter: "ढ",
      letterSound: "ddha.mp3",
      answer: "ढ",
      options: [
        { text: "ठ", sound: "assets/audio/tha.mp3" },
        { text: "ढ", sound: "assets/audio/ddha.mp3" },
        { text: "ढ़", sound: "assets/audio/ddha2.mp3" },
        { text: "ट", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "ण",
      letterSound: "na.mp3",
      answer: "ण",
      options: [
        { text: "न", sound: "assets/audio/na2.mp3" },
        { text: "ण", sound: "assets/audio/na.mp3" },
        { text: "ग", sound: "assets/audio/ga.mp3" },
        { text: "म", sound: "assets/audio/ma.mp3" },
      ],
    },
    {
      letter: "ड़",
      letterSound: "dda.mp3",
      answer: "ड़",
      options: [
        { text: "ड़", sound: "assets/audio/dda.mp3" },
        { text: "इ", sound: "assets/audio/i.mp3" },
        { text: "ड", sound: "assets/audio/da.mp3" },
        { text: "ङ", sound: "assets/audio/daa.mp3" },
      ],
    },
    {
      letter: "ढ़",
      letterSound: "ddha2.mp3",
      answer: "ढ़",
      options: [
        { text: "ठ", sound: "assets/audio/tha.mp3" },
        { text: "ढ", sound: "assets/audio/ddha.mp3" },
        { text: "ढ़", sound: "assets/audio/ddha2.mp3" },
        { text: "ट", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "त",
      letterSound: "ta2.mp3",
      answer: "त",
      options: [
        { text: "न", sound: "assets/audio/na2.mp3" },
        { text: "ल", sound: "assets/audio/la.mp3" },
        { text: "त", sound: "assets/audio/ta2.mp3" },
        { text: "ट", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "थ",
      letterSound: "tha2.mp3",
      answer: "थ",
      options: [
        { text: "य", sound: "assets/audio/ya.mp3" },
        { text: "न", sound: "assets/audio/na2.mp3" },
        { text: "श", sound: "assets/audio/sha.mp3" },
        { text: "थ", sound: "assets/audio/tha2.mp3" },
      ],
    },
    {
      letter: "द",
      letterSound: "da2.mp3",
      answer: "द",
      options: [
        { text: "ट", sound: "assets/audio/ta.mp3" },
        { text: "ढ", sound: "assets/audio/ddha.mp3" },
        { text: "ढ़", sound: "assets/audio/ddha2.mp3" },
        { text: "द", sound: "assets/audio/da2.mp3" },
      ],
    },
    {
      letter: "ध",
      letterSound: "dha.mp3",
      answer: "ध",
      options: [
        { text: "ध", sound: "assets/audio/dha.mp3" },
        { text: "छ", sound: "assets/audio/chha.mp3" },
        { text: "घ", sound: "assets/audio/gha.mp3" },
        { text: "त", sound: "assets/audio/ta2.mp3" },
      ],
    },
    {
      letter: "न",
      letterSound: "na2.mp3",
      answer: "न",
      options: [
        { text: "न", sound: "assets/audio/na2.mp3" },
        { text: "ल", sound: "assets/audio/la.mp3" },
        { text: "त", sound: "assets/audio/ta2.mp3" },
        { text: "ट", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "प",
      letterSound: "pa.mp3",
      answer: "प",
      options: [
        { text: "प", sound: "assets/audio/pa.mp3" },
        { text: "फ", sound: "assets/audio/fa.mp3" },
        { text: "भ", sound: "assets/audio/bha.mp3" },
        { text: "य", sound: "assets/audio/ya.mp3" },
      ],
    },
    {
      letter: "फ",
      letterSound: "fa.mp3",
      answer: "फ",
      options: [
        { text: "क", sound: "assets/audio/ka.mp3" },
        { text: "भ", sound: "assets/audio/bha.mp3" },
        { text: "प", sound: "assets/audio/pa.mp3" },
        { text: "फ", sound: "assets/audio/fa.mp3" },
      ],
    },
    {
      letter: "ब",
      letterSound: "ba.mp3",
      answer: "ब",
      options: [
        { text: "व", sound: "assets/audio/va.mp3" },
        { text: "ब", sound: "assets/audio/ba.mp3" },
        { text: "क", sound: "assets/audio/ka.mp3" },
        { text: "त", sound: "assets/audio/ta2.mp3" },
      ],
    },
    {
      letter: "भ",
      letterSound: "bha.mp3",
      answer: "भ",
      options: [
        { text: "फ", sound: "assets/audio/fa.mp3" },
        { text: "म", sound: "assets/audio/ma.mp3" },
        { text: "ब", sound: "assets/audio/ba.mp3" },
        { text: "भ", sound: "assets/audio/bha.mp3" },
      ],
    },
    {
      letter: "म",
      letterSound: "ma.mp3",
      answer: "म",
      options: [
        { text: "फ", sound: "assets/audio/fa.mp3" },
        { text: "म", sound: "assets/audio/ma.mp3" },
        { text: "ब", sound: "assets/audio/ba.mp3" },
        { text: "भ", sound: "assets/audio/bha.mp3" },
      ],
    },
    {
      letter: "य",
      letterSound: "ya.mp3",
      answer: "य",
      options: [
        { text: "य", sound: "assets/audio/ya.mp3" },
        { text: "र", sound: "assets/audio/ra.mp3" },
        { text: "श", sound: "assets/audio/sha.mp3" },
        { text: "थ", sound: "assets/audio/tha2.mp3" },
      ],
    },
    {
      letter: "र",
      letterSound: "ra.mp3",
      answer: "र",
      options: [
        { text: "ख", sound: "assets/audio/kha.mp3" },
        { text: "स", sound: "assets/audio/sa.mp3" },
        { text: "र", sound: "assets/audio/ra.mp3" },
        { text: "ड़", sound: "assets/audio/dda.mp3" },
      ],
    },
    {
      letter: "ल",
      letterSound: "la.mp3",
      answer: "ल",
      options: [
        { text: "न", sound: "assets/audio/na2.mp3" },
        { text: "ल", sound: "assets/audio/la.mp3" },
        { text: "त", sound: "assets/audio/ta2.mp3" },
        { text: "ट", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "व",
      letterSound: "va.mp3",
      answer: "व",
      options: [
        { text: "व", sound: "assets/audio/va.mp3" },
        { text: "ब", sound: "assets/audio/ba.mp3" },
        { text: "क", sound: "assets/audio/ka.mp3" },
        { text: "त", sound: "assets/audio/ta2.mp3" },
      ],
    },
    {
      letter: "श",
      letterSound: "sha.mp3",
      answer: "श",
      options: [
        { text: "र", sound: "assets/audio/ra.mp3" },
        { text: "श", sound: "assets/audio/sha.mp3" },
        { text: "स", sound: "assets/audio/sa.mp3" },
        { text: "ख", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ष",
      letterSound: "sha2.mp3",
      answer: "ष",
      options: [
        { text: "ष", sound: "assets/audio/sha2.mp3" },
        { text: "स", sound: "assets/audio/sa.mp3" },
        { text: "श", sound: "assets/audio/sha.mp3" },
        { text: "प", sound: "assets/audio/pa.mp3" },
      ],
    },
    {
      letter: "स",
      letterSound: "sa.mp3",
      answer: "स",
      options: [
        { text: "ष", sound: "assets/audio/sha2.mp3" },
        { text: "स", sound: "assets/audio/sa.mp3" },
        { text: "श", sound: "assets/audio/sha.mp3" },
        { text: "ख", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ह",
      letterSound: "ha.mp3",
      answer: "ह",
      options: [
        { text: "घ", sound: "assets/audio/gha.mp3" },
        { text: "झ", sound: "assets/audio/jha.mp3" },
        { text: "इ", sound: "assets/audio/i.mp3" },
        { text: "ह", sound: "assets/audio/ha.mp3" },
      ],
    },
    {
      letter: "ळ",
      letterSound: "adha.mp3",
      answer: "ळ",
      options: [
        { text: "घ", sound: "assets/audio/gha.mp3" },
        { text: "झ", sound: "assets/audio/jha.mp3" },
        { text: "इ", sound: "assets/audio/i.mp3" },
        { text: "ळ", sound: "assets/audio/adha.mp3" },
      ],
    },
    {
      letter: "क्ष",
      letterSound: "ksha.mp3",
      answer: "क्ष",
      options: [
        { text: "छ", sound: "assets/audio/chha.mp3" },
        { text: "श", sound: "assets/audio/sha.mp3" },
        { text: "श्र", sound: "assets/audio/shra.mp3" },
        { text: "क्ष", sound: "assets/audio/ksha.mp3" },
      ],
    },
    {
      letter: "त्र",
      letterSound: "tra.mp3",
      answer: "त्र",
      options: [
        { text: "त", sound: "assets/audio/ta2.mp3" },
        { text: "र", sound: "assets/audio/ra.mp3" },
        { text: "श्र", sound: "assets/audio/shra.mp3" },
        { text: "त्र", sound: "assets/audio/tra.mp3" },
      ],
    },
    {
      letter: "ज्ञ",
      letterSound: "gya.mp3",
      answer: "ज्ञ",
      options: [
        { text: "ज्ञ", sound: "assets/audio/gya.mp3" },
        { text: "ञ", sound: "assets/audio/nya.mp3" },
        { text: "ज", sound: "assets/audio/ja.mp3" },
        { text: "च", sound: "assets/audio/cha.mp3" },
      ],
    },
    {
      letter: "श्र",
      letterSound: "shra.mp3",
      answer: "श्र",
      options: [
        { text: "श", sound: "assets/audio/sha.mp3" },
        { text: "श्र", sound: "assets/audio/shra.mp3" },
        { text: "क्ष", sound: "assets/audio/ksha.mp3" },
        { text: "त्र", sound: "assets/audio/tra.mp3" },
      ],
    },
  ];

  const lottieFOs = [
    document.getElementById("option1-lottie").parentElement,
    document.getElementById("option2-lottie").parentElement,
    document.getElementById("option3-lottie").parentElement,
    document.getElementById("option4-lottie").parentElement,
  ];

  // 🌟 Global variable to store selected letter
  let selectedLetter = null;
  let currentQuestion = null; // stores active question
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const showAnsBtn = document.getElementById("showAns-btn");
  let isAnswerVisible = false; // toggle flag
  const letterButtons = document.querySelectorAll(".flower-list li");
  const finalImg = document.querySelector(".final-img");
  let currentIndex = -1;
  const bigLetter = document.querySelector(".trace-letter .letter");
  const newLetterBtn = document.getElementById("newLetter-btn");
  const homeBtn = document.getElementById("home-btn");
  const soundBtn = document.getElementById("sound-btn");
  let currentAudio = null;
  // 👉 Click on any flower letter
  letterButtons.forEach((li) => {
    li.addEventListener("click", () => {
      hideAllLotties();
      finalImg.classList.remove("correct");

      isAnswerVisible = false;
      showAnsBtn.src = "./assets/show-ans.svg";
      showAnsBtn.classList.remove("disabled"); // enable again

      selectedLetter = li.textContent.trim();

      // ⭐ set index from clicked letter
      currentIndex = questionsData.findIndex(
        (q) => q.letter === selectedLetter,
      );

      step1.style.display = "none";
      step2.style.display = "block";

      loadQuestionByIndex(currentIndex);
    });
  });

  function hideAllLotties() {
    lottieFOs.forEach((fo) => {
      fo.style.display = "none";
      fo.querySelector(".lottie-wrapper").innerHTML = "";
    });
  }

  function playCorrectLottie(index) {
    hideAllLotties();
    console.log("play");

    const fo = lottieFOs[index];
    fo.style.display = "block";

    const container = fo.querySelector(".lottie-wrapper");

    lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "lottie/correct-ans.json",
    });
  }
  // 🔎 Find question data for selected letter
  function loadQuestion(letter) {
    const question = questionsData.find((q) => q.letter === letter);

    if (!question) return;

    currentQuestion = question; // ⭐ store globally

    renderOptions(question.options);
  }

  // 🎯 Render Options in Step-2
  function renderOptions(options) {
    const optionContainer = document.querySelector(".optFlower-list");
    optionContainer.innerHTML = "";

    options.forEach((opt, index) => {
      const li = document.createElement("li");
      li.className = "flower-bg option-flower";
      li.innerHTML = `<span class="text-wrap">${opt.text}</span>`;

      li.addEventListener("click", () => {
        playAudio(opt.sound);

        if (li.classList.contains("correct")) return;

        if (opt.text === currentQuestion.answer) {
          li.classList.add("correct");
          finalImg.classList.add("correct"); // ⭐ add class to big image
          showAnsBtn.classList.add("disabled"); // ⭐ disable button

          console.log("Correct Answer");

          // ⭐ Mark remaining options incorrect
          const allOptions =
            li.parentElement.querySelectorAll(".option-flower");
          allOptions.forEach((option) => {
            if (option !== li && !option.classList.contains("incorrect")) {
              option.classList.add("incorrect");
            }
          });

          playCorrectLottie(index);
        } else {
          li.classList.add("incorrect");
          console.log("Wrong Answer");
        }
      });

      optionContainer.appendChild(li);
    });
  }

  function highlightCorrectAnswer(container) {
    const allOptions = container.querySelectorAll(".option-flower");

    allOptions.forEach((li) => {
      if (li.textContent.trim() === currentQuestion.answer) {
        li.classList.add("correct");
      }
    });
  }

  showAnsBtn.addEventListener("click", () => {
    if (showAnsBtn.classList.contains("disabled")) return;

    const optionContainer = document.querySelector(".optFlower-list");
    const allOptions = optionContainer.querySelectorAll(".option-flower");

    // 🔁 TOGGLE ON → SHOW ANSWER
    if (!isAnswerVisible) {
      showAnsBtn.src = "./assets/hide-ans.svg";
      isAnswerVisible = true;

      allOptions.forEach((li, index) => {
        const text = li.textContent.trim();

        if (text === currentQuestion.answer) {
          li.classList.add("correct");
          finalImg.classList.add("correct");
          playCorrectLottie(index);
        } else {
          li.classList.add("incorrect");
        }
      });
    }
    // 🔁 TOGGLE OFF → HIDE ANSWER
    else {
      showAnsBtn.src = "./assets/show-ans.svg";
      isAnswerVisible = false;

      hideAllLotties();
      finalImg.classList.remove("correct");

      allOptions.forEach((li) => {
        li.classList.remove("correct", "incorrect");
      });
    }
  });
  function loadQuestionByIndex(index) {
    if (index < 0 || index >= questionsData.length) return;

    // Add opacity and disable pointer events if it's the last letter
    if (index === questionsData.length - 1) {
      newLetterBtn.style.opacity = "0.4";
      newLetterBtn.style.pointerEvents = "none";
    } else {
      newLetterBtn.style.opacity = "1";
      newLetterBtn.style.pointerEvents = "auto";
    }

    const question = questionsData[index];
    currentQuestion = question;

    bigLetter.textContent = question.letter;

    // Reset visuals
    hideAllLotties();
    finalImg.classList.remove("correct");

    const optionContainer = document.querySelector(".optFlower-list");
    optionContainer.innerHTML = "";

    renderOptions(question.options);

  }

  newLetterBtn.addEventListener("click", () => {
    if (currentIndex === -1) return; // nothing selected yet

    // 👉 move to next index
    currentIndex++;

    // 👉 if reached end, start again (loop)
    if (currentIndex >= questionsData.length) {
      currentIndex = 0;
    }

    // 🔄 Reset UI state
    hideAllLotties();
    finalImg.classList.remove("correct");

    isAnswerVisible = false;
    showAnsBtn.src = "./assets/show-ans.svg";
    showAnsBtn.classList.remove("disabled");

    // 👉 Load next question
    loadQuestionByIndex(currentIndex);
  });

  homeBtn.addEventListener("click", () => {
    // 🔁 Show Step-1 and Hide Step-2
    step2.style.display = "none";
    step1.style.display = "block";

    // 🔄 Reset all states
    hideAllLotties();
    finalImg.classList.remove("correct");

    isAnswerVisible = false;
    showAnsBtn.src = "./assets/show-ans.svg";
    showAnsBtn.classList.remove("disabled");

    currentQuestion = null;
    currentIndex = -1;

    // Clear options
    const optionContainer = document.querySelector(".optFlower-list");
    optionContainer.innerHTML = "";
  });

  function playAudio(path) {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    console.log("play");
    console.log("Audio path:", path);
    currentAudio = new Audio(path);
    currentAudio.play().catch((err) => console.log("Audio play blocked:", err));
  }

  function playLetterSound() {
    if (!currentQuestion) return;

    // build path from question data
    const audioPath = `assets/audio/${currentQuestion.letterSound}`;
    playAudio(audioPath);
  }
  soundBtn.addEventListener("click", () => {
    playLetterSound();
  });
});
