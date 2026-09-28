document.addEventListener("DOMContentLoaded", () => {
  const questionsData = [
    {
      letter: "ક",
      letterSound: "ka.mp3",
      answer: "ક",
      options: [
        { text: "ક", sound: "assets/audio/ka.mp3" },
        { text: "ફ", sound: "assets/audio/fa.mp3" },
        { text: "વ", sound: "assets/audio/va.mp3" },
        { text: "ખ", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ખ",
      letterSound: "kha.mp3",
      answer: "ખ",
      options: [
        { text: "ર", sound: "assets/audio/ra.mp3" },
        { text: "શ", sound: "assets/audio/sha.mp3" },
        { text: "ક", sound: "assets/audio/ka.mp3" },
        { text: "ખ", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ગ",
      letterSound: "ga.mp3",
      answer: "ગ",
      options: [
        { text: "ખ", sound: "assets/audio/kha.mp3" },
        { text: "મ", sound: "assets/audio/ma.mp3" },
        { text: "ગ", sound: "assets/audio/ga.mp3" },
        { text: "ભ", sound: "assets/audio/bha.mp3" },
      ],
    },
    {
      letter: "ઘ",
      letterSound: "gha.mp3",
      answer: "ઘ",
      options: [
        { text: "ધ", sound: "assets/audio/dha.mp3" },
        { text: "છ", sound: "assets/audio/chha.mp3" },
        { text: "ઘ", sound: "assets/audio/gha.mp3" },
        { text: "ખ", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ઙ",
      letterSound: "daa.mp3",
      answer: "ઙ",
      options: [
        { text: "ડ", sound: "assets/audio/da.mp3" },
        { text: "ચ", sound: "assets/audio/cha.mp3" },
        { text: "ણ", sound: "assets/audio/na.mp3" },
        { text: "ઙ", sound: "assets/audio/daa.mp3" },
      ],
    },
    {
      letter: "ચ",
      letterSound: "cha.mp3",
      answer: "ચ",
      options: [
        { text: "ચ", sound: "assets/audio/cha.mp3" },
        { text: "જ", sound: "assets/audio/ja.mp3" },
        { text: "ન", sound: "assets/audio/na2.mp3" },
        { text: "ઞ", sound: "assets/audio/nya.mp3" },
      ],
    },
    {
      letter: "છ",
      letterSound: "chha.mp3",
      answer: "છ",
      options: [
        { text: "ઘ", sound: "assets/audio/gha.mp3" },
        { text: "ધ", sound: "assets/audio/dha.mp3" },
        { text: "છ", sound: "assets/audio/chha.mp3" },
        { text: "ઝ", sound: "assets/audio/jha.mp3" },
      ],
    },
    {
      letter: "જ",
      letterSound: "ja.mp3",
      answer: "જ",
      options: [
        { text: "જ્ઞ", sound: "assets/audio/gya.mp3" },
        { text: "ઞ", sound: "assets/audio/nya.mp3" },
        { text: "જ", sound: "assets/audio/ja.mp3" },
        { text: "ચ", sound: "assets/audio/cha.mp3" },
      ],
    },
    {
      letter: "ઝ",
      letterSound: "jha.mp3",
      answer: "ઝ",
      options: [
        { text: "ચ", sound: "assets/audio/cha.mp3" },
        { text: "છ", sound: "assets/audio/chha.mp3" },
        { text: "હ", sound: "assets/audio/ha.mp3" },
        { text: "ઝ", sound: "assets/audio/jha.mp3" },
      ],
    },
    {
      letter: "ઞ",
      letterSound: "nya.mp3",
      answer: "ઞ",
      options: [
        { text: "જ", sound: "assets/audio/ja.mp3" },
        { text: "ન", sound: "assets/audio/na2.mp3" },
        { text: "ઞ", sound: "assets/audio/nya.mp3" },
        { text: "જ્ઞ", sound: "assets/audio/gya.mp3" },
      ],
    },
    {
      letter: "ટ",
      letterSound: "ta.mp3",
      answer: "ટ",
      options: [
        { text: "ઠ", sound: "assets/audio/tha.mp3" },
        { text: "ઢ", sound: "assets/audio/ddha.mp3" },
        { text: "ટ", sound: "assets/audio/ta.mp3" },
        { text: "ડ", sound: "assets/audio/da.mp3" },
      ],
    },
    {
      letter: "ઠ",
      letterSound: "tha.mp3",
      answer: "ઠ",
      options: [
        { text: "ઠ", sound: "assets/audio/tha.mp3" },
        { text: "ઢ", sound: "assets/audio/ddha.mp3" },
        { text: "ટ", sound: "assets/audio/ta.mp3" },
        { text: "ડ", sound: "assets/audio/da.mp3" },
      ],
    },
    {
      letter: "ડ",
      letterSound: "da.mp3",
      answer: "ડ",
      options: [
        { text: "ડ", sound: "assets/audio/da.mp3" },
        { text: "ચ", sound: "assets/audio/cha.mp3" },
        { text: "ઢ", sound: "assets/audio/ddha.mp3" },
        { text: "ઙ", sound: "assets/audio/daa.mp3" },
      ],
    },
    {
      letter: "ઢ",
      letterSound: "ddha.mp3",
      answer: "ઢ",
      options: [
        { text: "ઠ", sound: "assets/audio/tha.mp3" },
        { text: "ઢ", sound: "assets/audio/ddha.mp3" },
        { text: "ટ", sound: "assets/audio/ta.mp3" },
        { text: "ડ", sound: "assets/audio/da.mp3" },
      ],
    },
    {
      letter: "ણ",
      letterSound: "na.mp3",
      answer: "ણ",
      options: [
        { text: "ન", sound: "assets/audio/na2.mp3" },
        { text: "ણ", sound: "assets/audio/na.mp3" },
        { text: "ગ", sound: "assets/audio/ga.mp3" },
        { text: "મ", sound: "assets/audio/ma.mp3" },
      ],
    },
    {
      letter: "ત",
      letterSound: "ta2.mp3",
      answer: "ત",
      options: [
        { text: "ન", sound: "assets/audio/na2.mp3" },
        { text: "લ", sound: "assets/audio/la.mp3" },
        { text: "ત", sound: "assets/audio/ta2.mp3" },
        { text: "ટ", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "થ",
      letterSound: "tha2.mp3",
      answer: "થ",
      options: [
        { text: "ય", sound: "assets/audio/ya.mp3" },
        { text: "ન", sound: "assets/audio/na2.mp3" },
        { text: "શ", sound: "assets/audio/sha.mp3" },
        { text: "થ", sound: "assets/audio/tha2.mp3" },
      ],
    },
    {
      letter: "દ",
      letterSound: "da2.mp3",
      answer: "દ",
      options: [
        { text: "ટ", sound: "assets/audio/ta.mp3" },
        { text: "ઢ", sound: "assets/audio/ddha.mp3" },
        { text: "ડ", sound: "assets/audio/da.mp3" },
        { text: "દ", sound: "assets/audio/da2.mp3" },
      ],
    },
    {
      letter: "ધ",
      letterSound: "dha.mp3",
      answer: "ધ",
      options: [
        { text: "ધ", sound: "assets/audio/dha.mp3" },
        { text: "છ", sound: "assets/audio/chha.mp3" },
        { text: "ઘ", sound: "assets/audio/gha.mp3" },
        { text: "ત", sound: "assets/audio/ta2.mp3" },
      ],
    },
    {
      letter: "ન",
      letterSound: "na2.mp3",
      answer: "ન",
      options: [
        { text: "ન", sound: "assets/audio/na2.mp3" },
        { text: "લ", sound: "assets/audio/la.mp3" },
        { text: "ત", sound: "assets/audio/ta2.mp3" },
        { text: "ટ", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "પ",
      letterSound: "pa.mp3",
      answer: "પ",
      options: [
        { text: "ષ", sound: "assets/audio/sha2.mp3" },
        { text: "પ", sound: "assets/audio/pa.mp3" },
        { text: "ભ", sound: "assets/audio/bha.mp3" },
        { text: "ય", sound: "assets/audio/ya.mp3" },
      ],
    },
    {
      letter: "ફ",
      letterSound: "fa.mp3",
      answer: "ફ",
      options: [
        { text: "ક", sound: "assets/audio/ka.mp3" },
        { text: "ભ", sound: "assets/audio/bha.mp3" },
        { text: "પ", sound: "assets/audio/pa.mp3" },
        { text: "ફ", sound: "assets/audio/fa.mp3" },
      ],
    },
    {
      letter: "બ",
      letterSound: "ba.mp3",
      answer: "બ",
      options: [
        { text: "વ", sound: "assets/audio/va.mp3" },
        { text: "બ", sound: "assets/audio/ba.mp3" },
        { text: "ક", sound: "assets/audio/ka.mp3" },
        { text: "ત", sound: "assets/audio/ta2.mp3" },
      ],
    },
    {
      letter: "ભ",
      letterSound: "bha.mp3",
      answer: "ભ",
      options: [
        { text: "ફ", sound: "assets/audio/fa.mp3" },
        { text: "મ", sound: "assets/audio/ma.mp3" },
        { text: "બ", sound: "assets/audio/ba.mp3" },
        { text: "ભ", sound: "assets/audio/bha.mp3" },
      ],
    },
    {
      letter: "મ",
      letterSound: "ma.mp3",
      answer: "મ",
      options: [
        { text: "ફ", sound: "assets/audio/fa.mp3" },
        { text: "મ", sound: "assets/audio/ma.mp3" },
        { text: "બ", sound: "assets/audio/ba.mp3" },
        { text: "ભ", sound: "assets/audio/bha.mp3" },
      ],
    },
    {
      letter: "ય",
      letterSound: "ya.mp3",
      answer: "ય",
      options: [
        { text: "ય", sound: "assets/audio/ya.mp3" },
        { text: "ર", sound: "assets/audio/ra.mp3" },
        { text: "શ", sound: "assets/audio/sha.mp3" },
        { text: "થ", sound: "assets/audio/tha2.mp3" },
      ],
    },
    {
      letter: "ર",
      letterSound: "ra.mp3",
      answer: "ર",
      options: [
        { text: "ખ", sound: "assets/audio/kha.mp3" },
        { text: "સ", sound: "assets/audio/sa.mp3" },
        { text: "ર", sound: "assets/audio/ra.mp3" },
        { text: "ડ", sound: "assets/audio/da.mp3" },
      ],
    },
    {
      letter: "લ",
      letterSound: "la.mp3",
      answer: "લ",
      options: [
        { text: "ન", sound: "assets/audio/na2.mp3" },
        { text: "લ", sound: "assets/audio/la.mp3" },
        { text: "ત", sound: "assets/audio/ta2.mp3" },
        { text: "ટ", sound: "assets/audio/ta.mp3" },
      ],
    },
    {
      letter: "વ",
      letterSound: "va.mp3",
      answer: "વ",
      options: [
        { text: "વ", sound: "assets/audio/va.mp3" },
        { text: "બ", sound: "assets/audio/ba.mp3" },
        { text: "ક", sound: "assets/audio/ka.mp3" },
        { text: "ત", sound: "assets/audio/ta2.mp3" },
      ],
    },
    {
      letter: "શ",
      letterSound: "sha.mp3",
      answer: "શ",
      options: [
        { text: "ર", sound: "assets/audio/ra.mp3" },
        { text: "શ", sound: "assets/audio/sha.mp3" },
        { text: "સ", sound: "assets/audio/sa.mp3" },
        { text: "ખ", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ષ",
      letterSound: "sha2.mp3",
      answer: "ષ",
      options: [
        { text: "ષ", sound: "assets/audio/sha2.mp3" },
        { text: "સ", sound: "assets/audio/sa.mp3" },
        { text: "ખ", sound: "assets/audio/kha.mp3" },
        { text: "પ", sound: "assets/audio/pa.mp3" },
      ],
    },
    {
      letter: "સ",
      letterSound: "sa.mp3",
      answer: "સ",
      options: [
        { text: "ષ", sound: "assets/audio/sha2.mp3" },
        { text: "સ", sound: "assets/audio/sa.mp3" },
        { text: "શ", sound: "assets/audio/sha.mp3" },
        { text: "ખ", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "હ",
      letterSound: "ha.mp3",
      answer: "હ",
      options: [
        { text: "ઘ", sound: "assets/audio/gha.mp3" },
        { text: "ઝ", sound: "assets/audio/jha.mp3" },
        { text: "ચ", sound: "assets/audio/cha.mp3" },
        { text: "હ", sound: "assets/audio/ha.mp3" },
      ],
    },
    {
      letter: "ળ",
      letterSound: "dda.mp3",
      answer: "ળ",
      options: [
        { text: "ળ", sound: "assets/audio/dda.mp3" },
        { text: "લ", sound: "assets/audio/la.mp3" },
        { text: "ન", sound: "assets/audio/na2.mp3" },
        { text: "ડ", sound: "assets/audio/da.mp3" },
      ],
    },
    {
      letter: "ક્ષ",
      letterSound: "ksha.mp3",
      answer: "ક્ષ",
      options: [
        { text: "છ", sound: "assets/audio/chha.mp3" },
        { text: "શ", sound: "assets/audio/sha.mp3" },
        { text: "ક્ષ", sound: "assets/audio/ksha.mp3" },
        { text: "ખ", sound: "assets/audio/kha.mp3" },
      ],
    },
    {
      letter: "ત્ર",
      letterSound: "tra.mp3",
      answer: "ત્ર",
      options: [
        { text: "ત", sound: "assets/audio/ta2.mp3" },
        { text: "ર", sound: "assets/audio/ra.mp3" },
        { text: "ક્ષ", sound: "assets/audio/ksha.mp3" },
        { text: "ત્ર", sound: "assets/audio/tra.mp3" },
      ],
    },
    {
      letter: "જ્ઞ",
      letterSound: "gya.mp3",
      answer: "જ્ઞ",
      options: [
        { text: "જ્ઞ", sound: "assets/audio/gya.mp3" },
        { text: "ઞ", sound: "assets/audio/nya.mp3" },
        { text: "જ", sound: "assets/audio/ja.mp3" },
        { text: "ચ", sound: "assets/audio/cha.mp3" },
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
      loop: false,
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
