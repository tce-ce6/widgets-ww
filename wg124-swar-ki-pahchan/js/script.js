document.addEventListener("DOMContentLoaded", () => {
  const questionsData = [
    {
      letter: "अ",
      letterSound: "a.mp3",
      answer: "अ",
      options: [
        { text: "अ", sound: "a.mp3" },
        { text: "अः", sound: "aha.mp3" },
        { text: "आ", sound: "aa.mp3" },
        { text: "अं", sound: "am.mp3" },
      ],
    },
    {
      letter: "आ",
      letterSound: "aa.mp3",
      answer: "आ",
      options: [
        { text: "ओ", sound: "o.mp3" },
        { text: "आ", sound: "aa.mp3" },
        { text: "औ", sound: "au.mp3" },
        { text: "अ", sound: "a.mp3" },
      ],
    },
    {
      letter: "इ",
      letterSound: "i.mp3",
      answer: "इ",
      options: [
        { text: "ई", sound: "ee.mp3" },
        { text: "ऋ", sound: "ri.mp3" },
        { text: "ए", sound: "e.mp3" },
        { text: "इ", sound: "i.mp3" },
      ],
    },
    {
      letter: "ई",
      letterSound: "ee.mp3",
      answer: "ई",
      options: [
        { text: "ऋ", sound: "ri.mp3" },
        { text: "ई", sound: "ee.mp3" },
        { text: "ऐ", sound: "ai.mp3" },
        { text: "इ", sound: "i.mp3" },
      ],
    },
    {
      letter: "उ",
      letterSound: "u.mp3",
      answer: "उ",
      options: [
        { text: "ओ", sound: "o.mp3" },
        { text: "अं", sound: "am.mp3" },
        { text: "उ", sound: "u.mp3" },
        { text: "अ", sound: "a.mp3" },
      ],
    },
    {
      letter: "ऊ",
      letterSound: "oo.mp3",
      answer: "ऊ",
      options: [
        { text: "औ", sound: "au.mp3" },
        { text: "ऊ", sound: "oo.mp3" },
        { text: "ऐ", sound: "ai.mp3" },
        { text: "उ", sound: "u.mp3" },
      ],
    },
    {
      letter: "ऋ",
      letterSound: "ri.mp3",
      answer: "ऋ",
      options: [
        { text: "ए", sound: "e.mp3" },
        { text: "ऐ", sound: "ai.mp3" },
        { text: "ऋ", sound: "ri.mp3" },
        { text: "औ", sound: "au.mp3" },
      ],
    },
    {
      letter: "ए",
      letterSound: "e.mp3",
      answer: "ए",
      options: [
        { text: "अः", sound: "aha.mp3" },
        { text: "ए", sound: "e.mp3" },
        { text: "ऐ", sound: "ai.mp3" },
        { text: "अं", sound: "am.mp3" },
      ],
    },
    {
      letter: "ऐ",
      letterSound: "ai.mp3",
      answer: "ऐ",
      options: [
        { text: "ई", sound: "ee.mp3" },
        { text: "ऐ", sound: "ai.mp3" },
        { text: "ऊ", sound: "oo.mp3" },
        { text: "ऋ", sound: "ri.mp3" },
      ],
    },
    {
      letter: "ओ",
      letterSound: "o.mp3",
      answer: "ओ",
      options: [
        { text: "अ", sound: "a.mp3" },
        { text: "अः", sound: "aha.mp3" },
        { text: "ओ", sound: "o.mp3" },
        { text: "औ", sound: "au.mp3" },
      ],
    },
    {
      letter: "औ",
      letterSound: "au.mp3",
      answer: "औ",
      options: [
        { text: "ओ", sound: "o.mp3" },
        { text: "आ", sound: "aa.mp3" },
        { text: "अः", sound: "aha.mp3" },
        { text: "औ", sound: "au.mp3" },
      ],
    },
    {
      letter: "अं",
      letterSound: "am.mp3",
      answer: "अं",
      options: [
        { text: "अं", sound: "am.mp3" },
        { text: "आ", sound: "aa.mp3" },
        { text: "औ", sound: "au.mp3" },
        { text: "अः", sound: "aha.mp3" },
      ],
    },
    {
      letter: "अः",
      letterSound: "aha.mp3",
      answer: "अः",
      options: [
        { text: "अं", sound: "am.mp3" },
        { text: "अः", sound: "aha.mp3" },
        { text: "ओ", sound: "o.mp3" },
        { text: "औ", sound: "au.mp3" },
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
});
