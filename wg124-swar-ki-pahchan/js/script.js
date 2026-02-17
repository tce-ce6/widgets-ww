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

  // 🌟 Global variable to store selected letter
  let selectedLetter = null;

  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");

  const letterButtons = document.querySelectorAll(".flower-list li");

  // SVG big letter (Step-2)
  const bigLetter = document.querySelector(".trace-letter .letter");

  // 👉 Click on any flower letter
  letterButtons.forEach((li) => {
    li.addEventListener("click", () => {
      // Store clicked letter globally
      selectedLetter = li.textContent.trim();

      console.log("Selected Letter:", selectedLetter);

      // Hide Step-1
      step1.style.display = "none";

      // Show Step-2
      step2.style.display = "block";

      // Update the big tracing letter
      bigLetter.textContent = selectedLetter;

      // OPTIONAL 👉 load its data from questionsData
      loadQuestion(selectedLetter);
    });
  });

  // 🔎 Find question data for selected letter
  function loadQuestion(letter) {
    const question = questionsData.find((q) => q.letter === letter);

    if (!question) return;

    // Play sound (if needed later)
    // playAudio(question.letterSound);

    // Load options dynamically
    renderOptions(question.options);
  }

  // 🎯 Render Options in Step-2
  function renderOptions(options) {
    const optionContainer = document.querySelector(".optFlower-list");
    optionContainer.innerHTML = "";

    options.forEach((opt) => {
      const li = document.createElement("li");
      li.className = "flower-bg option-flower";
      li.innerHTML = `<span>${opt.text}</span>`;

      // Option click
      li.addEventListener("click", () => {
        console.log("Clicked Option:", opt.text);

        // playAudio(opt.sound);
      });

      optionContainer.appendChild(li);
    });
  }
});
