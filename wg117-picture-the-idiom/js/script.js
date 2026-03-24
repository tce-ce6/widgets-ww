document.addEventListener("DOMContentLoaded", () => {
  let idiomsData = [];
  let currentIndex = 0;
  let currentFillIndex = 0;
  const mainImg = document.getElementById("main-img");
  const nextBtn = document.getElementById("newgame-btn");
  const showAnswerBtn = document.getElementById("reset-btn");
  const optionWrapper = document.querySelector(".option-wrapper");
  const idiomBuilder = document.getElementById("idom-builder");
  let currentAnswerWords = [];
  let isAnswerVisible = false;
  const lottieWrapper = document.getElementById("lottie-wrapper");
  let successAnim = null;
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
  function playSuccessAnimation() {
    // Clear any previous animation
    if (successAnim) {
      successAnim.destroy();
      successAnim = null;
    }

    // Make wrapper visible
    lottieWrapper.style.display = "block";

    // Load animation
    successAnim = lottie.loadAnimation({
      container: lottieWrapper,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "lottie/correct.json", // 👉 your lottie file path
    });

    // Hide when animation completes
    successAnim.addEventListener("complete", () => {
      lottieWrapper.style.display = "none";
      successAnim.destroy();
      successAnim = null;
    });
  }
  // ✅ Display Idiom (Image + Options)
  function showIdiom(index) {
    document.getElementById("wrapper-1").style.display = "none";
    document.getElementById("wrapper-2").style.display = "none";
    // Hide animation when new question loads
    lottieWrapper.style.display = "none";
    if (successAnim) {
      successAnim.destroy();
      successAnim = null;
    }
    const item = idiomsData[index];
    if (!item) return;

    mainImg.src = item.image;
    mainImg.alt = item.idiom;

    // store correct idiom words
    currentAnswerWords = item.idiom.split(" ");
    currentFillIndex = 0;

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
    const expectedWord = currentAnswerWords[currentFillIndex];

    // ✅ Check if clicked word is the NEXT correct word
    if (word !== expectedWord) {
      element.classList.add("wrong");

      // optional shake reset
      setTimeout(() => element.classList.remove("wrong"), 300);
      return;
    }

    // ✅ Correct word in correct order → place it
    const builderSlots = idiomBuilder.querySelectorAll("li");

    builderSlots[currentFillIndex].textContent = word;
    builderSlots[currentFillIndex].classList.add("filled");

    element.textContent = "";
    element.classList.add("used");
    element.style.pointerEvents = "none";

    // Move to next expected word
    currentFillIndex++;

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

      // Disable button immediately
      showAnswerBtn.disabled = true;
      showAnswerBtn.classList.add("disabled");
      
      nextBtn.disabled = true;
      nextBtn.classList.add("disabled");
      nextBtn.style.pointerEvents = "none";

      // Play animation first
      playSuccessAnimation();

      // ⏱ Wait 2 seconds before showing result
      setTimeout(() => {
        document.getElementById("step-1").style.display = "none";
        document.getElementById("step-2").style.display = "block";

        showMeaning();
        revealStep2Content(); // ⭐ stagger reveal
      }, 1000);
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
      
      const wrapper1 = document.getElementById("wrapper-1");
      const wrapper2 = document.getElementById("wrapper-2");
      wrapper1.style.display = "block";
      wrapper1.style.visibility = "visible";
      wrapper1.style.opacity = "1";
      wrapper2.style.display = "block";
      wrapper2.style.visibility = "visible";
      wrapper2.style.opacity = "1";

      showMeaning();
      fillCorrectIdiom(); // ⭐ NEW

      showAnswerBtn.textContent = "Hide Answer";
      isAnswerVisible = true;
    } else {
      // 👉 HIDE ANSWER
      step1.style.display = "block";
      step2.style.display = "none";

      resetIdiomSlots(); // ⭐ NEW

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
    currentFillIndex = currentAnswerWords.length;
  }
  function resetIdiomSlots() {
    const builderSlots = idiomBuilder.querySelectorAll("li");

    builderSlots.forEach((li) => {
      li.innerHTML = "&nbsp;";
      li.classList.remove("filled", "auto-filled");
    });

    currentFillIndex = 0;
  }

  function revealStep2Content() {
    const wrapper1 = document.getElementById("wrapper-1");
    const wrapper2 = document.getElementById("wrapper-2");

    // reset visibility first
    wrapper1.style.display = "none";
    wrapper1.style.visibility = "hidden";
    wrapper1.style.opacity = "0";
    wrapper2.style.display = "none";
    wrapper2.style.visibility = "hidden";
    wrapper2.style.opacity = "0";

    // ⏱ Show Meaning after 1 sec
    setTimeout(() => {
      wrapper1.style.display = "block";
      wrapper1.style.visibility = "visible";
      wrapper1.style.opacity = "1";
    }, 1000);

    // ⏱ Show Example after 2 sec
    setTimeout(() => {
      wrapper2.style.display = "block";
      wrapper2.style.visibility = "visible";
      wrapper2.style.opacity = "1";
      
      nextBtn.disabled = false;
      nextBtn.classList.remove("disabled");
      nextBtn.style.pointerEvents = "auto";
    }, 2000);
  }

  loadData();
});
