document.addEventListener("DOMContentLoaded", () => {
  let idiomsData = [];
  let currentIndex = 0;

  const mainImg = document.getElementById("main-img");
  const nextBtn = document.getElementById("newgame-btn");
  const showAnswerBtn = document.getElementById("reset-btn");
  const optionWrapper = document.querySelector(".option-wrapper");
  const idiomBuilder = document.getElementById("idom-builder");
  let currentAnswerWords = [];
  let isAnswerVisible = false;
  // ✅ Load JSON
  async function loadData() {
    try {
      const response = await fetch("data.json"); // adjust path if needed
      const data = await response.json();

      idiomsData = shuffleArray(data.idioms); // shuffle full dataset
      // Reset answer visibility when going next
      document.getElementById("step-1").style.display = "block";
      document.getElementById("step-2").style.display = "none";
      showAnswerBtn.textContent = "Show Answer";
      isAnswerVisible = false;

      showIdiom(currentIndex);
    } catch (err) {
      console.error("Error loading JSON:", err);
    }
  }

  // ✅ Display Idiom (Image + Options)
  function showIdiom(index) {
    const item = idiomsData[index];
    if (!item) return;

    mainImg.src = item.image;
    mainImg.alt = item.idiom;

    // store correct idiom words
    currentAnswerWords = item.idiom.split(" ");

    buildIdiomSlots(item);
    renderOptions(item);
    document.getElementById("step-1").style.display = "block";
    document.getElementById("step-2").style.display = "none";
    showAnswerBtn.textContent = "Show Answer";
    isAnswerVisible = false;
    // ✅ Re-enable for next round
showAnswerBtn.disabled = false;
showAnswerBtn.classList.remove("disabled");
    resetIdiomSlots();
  }

  function buildIdiomSlots(item) {
    idiomBuilder.innerHTML = ""; // clear previous slots

    const words = item.idiom.split(" "); // split idiom into words

    words.forEach(() => {
      const li = document.createElement("li");
      li.classList.add("blank"); // for styling
      li.innerHTML = "&nbsp;"; // keep height visible
      idiomBuilder.appendChild(li);
    });
  }

  // ✅ Create options dynamically from distractors
  function renderOptions(item) {
    optionWrapper.innerHTML = "";

    const shuffledOptions = shuffleArray(item.distractors);

    shuffledOptions.forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      li.classList.add("option");

      li.addEventListener("click", () => handleOptionClick(word, li));

      optionWrapper.appendChild(li);
    });
  }

  function handleOptionClick(word, element) {
    // find ALL positions where this word exists in idiom
    const matchingIndexes = [];

    currentAnswerWords.forEach((correctWord, i) => {
      if (correctWord === word) {
        matchingIndexes.push(i);
      }
    });

    if (matchingIndexes.length === 0) {
      // ❌ wrong word → ignore or add shake animation later
      element.classList.add("wrong");
      return;
    }

    // find first empty matching slot
    const builderSlots = idiomBuilder.querySelectorAll("li");

    for (let index of matchingIndexes) {
      if (builderSlots[index].textContent.trim() === "") {
        builderSlots[index].textContent = word;
        builderSlots[index].classList.add("filled");
        element.textContent = "";
        element.classList.add("used");
        element.style.pointerEvents = "none";
        break;
      }
    }

    checkIfCompleted();
  }

  function checkIfCompleted() {
    const builderSlots = idiomBuilder.querySelectorAll("li");

    const formedSentence = Array.from(builderSlots)
      .map((li) => li.textContent.trim())
      .join(" ");

    const correctSentence = currentAnswerWords.join(" ");

if (formedSentence === correctSentence) {
  console.log("✅ Correct!");

  document.getElementById("step-1").style.display = "none";
  document.getElementById("step-2").style.display = "block";

  showMeaning();

  // ✅ Disable Show Answer button after correct solve
  showAnswerBtn.disabled = true;
  showAnswerBtn.classList.add("disabled");
}
  }

  function showMeaning() {
    const current = idiomsData[currentIndex];

    document.querySelector(".result-wrapper.top .result-text").textContent =
      current.meaning;

    document.querySelector(".result-wrapper.bottom .result-text").textContent =
      current.example;
  }
  // ✅ Next Button
  nextBtn.addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= idiomsData.length) {
      currentIndex = 0;
      idiomsData = shuffleArray(idiomsData);
    }

    showIdiom(currentIndex);
  });

  // ✅ Show Answer (for debugging now)
showAnswerBtn.addEventListener("click", () => {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");

  if (!isAnswerVisible) {
    // 👉 SHOW ANSWER
    step1.style.display = "none";
    step2.style.display = "block";

    showMeaning();
    fillCorrectIdiom();   // ⭐ NEW

    showAnswerBtn.textContent = "Hide Answer";
    isAnswerVisible = true;
  } else {
    // 👉 HIDE ANSWER
    step1.style.display = "block";
    step2.style.display = "none";

    resetIdiomSlots();   // ⭐ NEW

    showAnswerBtn.textContent = "Show Answer";
    isAnswerVisible = false;
  }
});

  // ✅ Shuffle Helper
  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function fillCorrectIdiom() {
  const builderSlots = idiomBuilder.querySelectorAll("li");

  currentAnswerWords.forEach((word, index) => {
    if (builderSlots[index]) {
      builderSlots[index].textContent = word;
      builderSlots[index].classList.add("filled", "auto-filled");
    }
  });
}
function resetIdiomSlots() {
  const builderSlots = idiomBuilder.querySelectorAll("li");

  builderSlots.forEach(li => {
    li.innerHTML = "&nbsp;";
    li.classList.remove("filled", "auto-filled");
  });
}
  loadData();
});
