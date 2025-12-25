document.addEventListener("DOMContentLoaded", () => {
  const learnBtn = document.getElementById("learnBtn");
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");

  const questionList = document.querySelector(".question-list");
  const answerList = document.querySelector(".answer-list");

  const showAnsBtn = document.getElementById("show-ans");
  const nextBtn = document.getElementById("next-btn");

  const step3 = document.getElementById("step-3");
  const optionList = document.getElementById("option-list");
  const btnWrapper = document.getElementById("btn-wrapper");
  let currentStep3GroupIndex = 0;
  let selectedCategoryItem = null;

  const rightColOption = document.getElementById("right-col-option");
  const rightColCategory = document.getElementById("right-col-category");

  const subjectList = document.getElementById("subject-list");
  const categoryList = document.getElementById("category-list");
  let selectedSubjectListItem = null;
  const homeBtn = document.getElementById("home-btn");

  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const step4 = document.getElementById("step-4");
  const questionListing = document.querySelectorAll(".question-listing li");
  const abhyasLabel = document.getElementById("abhyas-label");
  let isQuizAnswerVisible = false;

  const studyBtn = document.getElementById("study-btn");



  let quizData = [];
  let currentQuizIndex = 0;
  let isStep3AnswerVisible = false;

  let selectedQuizBlank = null;

  let selectedCategoryListItem = null;


  const verbRules = [
    { suffix: "ती हैं।", rootClass: "blue", suffixClass: "green" }, // ✅ plural feminine
    { suffix: "ती है।", rootClass: "blue", suffixClass: "green" },
    { suffix: "ता है।", rootClass: "blue", suffixClass: "green" },
    { suffix: "ते हैं।", rootClass: "blue", suffixClass: "green" },
  ];

  if (
    !learnBtn ||
    !step1 ||
    !step2 ||
    !step3 ||
    !questionList ||
    !answerList ||
    !showAnsBtn ||
    !nextBtn ||
    !optionList ||
    !rightColOption ||
    !rightColCategory
  )
    return;

  function updateBtnWrapperVisibility() {
    if (!btnWrapper || !step1) return;
    const step1Visible = window.getComputedStyle(step1).display !== "none";
    btnWrapper.style.display = step1Visible ? "none" : "";
  }

  // ensure initial state matches current step visibility
  updateBtnWrapperVisibility();

  let allData = [];
  let currentGroupIndex = 0;
  let currentSelectedQuestion = null;
  let isAnswerVisible = false;

  /* ----------------------------------
     STEP SWITCH
  ---------------------------------- */
  learnBtn.addEventListener("click", () => {
    step1.style.display = "none";
    step2.style.display = "block";
    updateBtnWrapperVisibility();
  });

  /* ----------------------------------
     UTILS
  ---------------------------------- */
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function checkAllAnswered() {
    const blanks = document.querySelectorAll(".question-list .blank");
    const allCorrect = [...blanks].every((b) =>
      b.classList.contains("correct")
    );

    showAnsBtn.disabled = allCorrect;
    nextBtn.disabled = !allCorrect;

    // ✅ ADD THIS
    if (allCorrect) {
      document
        .querySelectorAll("#step-2 .question-list li")
        .forEach(li => li.classList.add("disabled"));
    }
  }


  /* ----------------------------------
     RENDER GROUP
  ---------------------------------- */
  function renderGroup(groupData) {
    questionList.innerHTML = "";
    answerList.innerHTML = "";

    // Questions
    groupData.forEach((item, index) => {
      const qLi = document.createElement("li");
      qLi.dataset.index = index;
      qLi.dataset.answer = item.answer;
      qLi.innerHTML = item.question.replace(
        /_+/g,
        `<span class="blank"></span>`
      );
      questionList.appendChild(qLi);
    });

    // Answers (shuffled)
    const answers = groupData.map((item) => item.answer);
    shuffleArray(answers);

    answers.forEach((answer) => {
      const aLi = document.createElement("li");
      aLi.textContent = answer;
      answerList.appendChild(aLi);
    });

    // Reset states
    showAnsBtn.textContent = "उत्तर देखें";
    showAnsBtn.disabled = false;
    nextBtn.disabled = true;
    isAnswerVisible = false;
    currentSelectedQuestion = null;
  }

  /* ----------------------------------
     LOAD JSON
  ---------------------------------- */
  fetch("./data.json")
    .then(res => res.json())
    .then(data => {

      // ✅ Separate quiz data completely
      const quizObj = data.find(item => item.quiz);
      quizData = quizObj ? quizObj.quiz : [];

      // ✅ Remove quiz object from step-2 & step-3 flow
      allData = data.filter(item => !item.quiz);

      // ✅ Start Step-2 with first grammar group only
      const firstKey = Object.keys(allData[0])[0];
      renderGroup(allData[0][firstKey]);
    })
    .catch(err => console.error("JSON load error:", err));


  /* ----------------------------------
     QUESTION CLICK
  ---------------------------------- */
  questionList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    const blank = li.querySelector(".blank");
    if (!blank || blank.classList.contains("correct")) return;

    document
      .querySelectorAll(".blank.selected")
      .forEach((b) => b.classList.remove("selected"));

    blank.classList.add("selected");
    currentSelectedQuestion = li;
  });

  /* ----------------------------------
     ANSWER CLICK
  ---------------------------------- */
  answerList.addEventListener("click", (e) => {
    const answerLi = e.target.closest("li");
    if (!answerLi || !currentSelectedQuestion) return;

    const selectedBlank = currentSelectedQuestion.querySelector(".blank");

    const correctAnswer = currentSelectedQuestion.dataset.answer;

    const selectedAnswer = answerLi.textContent.trim();

    // Remove previous wrong
    answerList
      .querySelectorAll("li.wrong")
      .forEach((li) => li.classList.remove("wrong"));

    if (selectedAnswer === correctAnswer) {
      // ✅ Correct
      selectedBlank.textContent = selectedAnswer;
      selectedBlank.classList.remove("selected");
      selectedBlank.classList.add("correct");
      selectedBlank.dataset.userFilled = "true";

      answerLi.style.display = "none";
      currentSelectedQuestion = null;

      checkAllAnswered();
    } else {
      // ❌ Wrong
      answerLi.classList.add("wrong");
    }
  });

  /* ----------------------------------
     SHOW / HIDE ANSWERS
  ---------------------------------- */
  showAnsBtn.addEventListener("click", () => {

    if (step3.style.display === "block") {
      if (showAnsBtn.textContent.trim() === "उत्तर देखें") {
        showStep3Answers(true);
      } else {
        showStep3Answers(false);
      }
    }

    if (step4.style.display === "block") {
      const questionItems = document.querySelectorAll(".question-list li");

      if (showAnsBtn.textContent.trim() === "उत्तर देखें") {
        // 🔒 Disable when showing answer
        questionItems.forEach(li => li.classList.add("disabled"));
      } else {
        // 🔓 Enable when hiding answer
        questionItems.forEach(li => li.classList.remove("disabled"));
      }
    }

    const step2Questions = document.querySelectorAll("#step-2 .question-list li");

    if (showAnsBtn.textContent.trim() === "उत्तर देखें") {
      // 🔓 Enable questions
      step2Questions.forEach(li => li.classList.add("disabled"));
    } else {
      // 🔒 Disable questions
      step2Questions.forEach(li => li.classList.remove("disabled"));
    }

    document
      .querySelectorAll(".question-list .blank.selected")
      .forEach(b => b.classList.remove("selected"));

    /* -------------------------
       🔹 STEP-4 QUIZ MODE
    ------------------------- */
    if (step4.style.display === "block") {
      const quiz = quizData[currentQuizIndex];

      if (!isQuizAnswerVisible) {
        // ✅ SHOW ANSWER
        quizQuestion.textContent = quiz.completeSentence;

        quizOptions
          .querySelectorAll("li")
          .forEach(li => (li.style.display = "none"));

        showAnsBtn.textContent = "उत्तर छिपाएं";
        nextBtn.disabled = false;
        isQuizAnswerVisible = true;
      }
      else {
        // 🔄 HIDE ANSWER → RESTORE BLANK QUESTION
        quizQuestion.innerHTML = quiz.question.replace(
          /_+/g,
          `<span class="quiz-blank"></span>`
        );

        quizOptions
          .querySelectorAll("li")
          .forEach(li => {
            li.style.display = "";
            li.classList.remove("wrong", "selected");
          });

        showAnsBtn.textContent = "उत्तर देखें";
        nextBtn.disabled = true;
        isQuizAnswerVisible = false;
      }

      selectedQuizBlank = null;
      return;
    }

    /* -------------------------
       🔹 STEP-2 EXISTING LOGIC
    ------------------------- */
    const questions = document.querySelectorAll(".question-list li");
    const answers = document.querySelectorAll(".answer-list li");

    if (!isAnswerVisible) {
      questions.forEach((li) => {
        const blank = li.querySelector(".blank");
        if (blank) {
          blank.textContent = li.dataset.answer;
          blank.classList.add("correct");
        }
      });

      answers.forEach((li) => (li.style.display = "none"));
      showAnsBtn.textContent = "उत्तर छिपाएं";
      isAnswerVisible = true;
    }
    else {
      questions.forEach((li) => {
        const blank = li.querySelector(".blank");
        if (blank && !blank.dataset.userFilled) {
          blank.textContent = "";
          blank.classList.remove("correct");
        }
      });

      answers.forEach((li) => (li.style.display = ""));
      showAnsBtn.textContent = "उत्तर देखें";
      isAnswerVisible = false;
    }
  });

  if (studyBtn) {
    studyBtn.addEventListener("click", () => {
      // 🔽 Hide Step-3
      step3.style.display = "none";

      // 🔼 Show Step-4
      step4.style.display = "block";
      abhyasLabel.style.display = "block";

      studyBtn.style.display = "none";


      // ✅ INITIALIZE QUIZ PROPERLY
      currentQuizIndex = 0;
      isQuizAnswerVisible = false;
      selectedQuizBlank = null;
      nextBtn.disabled = true;
      showAnsBtn.textContent = "उत्तर देखें";

      // 🔥 THIS WAS MISSING
      renderQuizQuestion();

      // Reset question number UI
      questionListing.forEach(li => li.classList.add("disabled"));
      if (questionListing[0]) {
        questionListing[0].classList.remove("disabled");
      }

      updateBtnWrapperVisibility();
    });
  }


  /* ----------------------------------
     NEXT GROUP
  ---------------------------------- */
  nextBtn.addEventListener("click", () => {
    // 🔹 STEP 3 MODE
    // 🔹 STEP 3 MODE
    if (step3.style.display === "block") {
      // ✅ If all options are placed → toggle right panels
      if (areAllOptionsPlaced()) {
        rightColOption.style.display = "none";
        rightColCategory.style.display = "block";
      }

      currentStep3GroupIndex++;

      // ✅ All step-3 groups completed
      if (currentStep3GroupIndex >= allData.length) {
        console.log("Step 3 completed");
        nextBtn.disabled = true;

        return;
      }


      // 🔄 Reset panels for next group
      rightColOption.style.display = "block";
      rightColCategory.style.display = "none";

      renderStep3Options(currentStep3GroupIndex);
      return;
    }


    // 🔹 STEP 4 QUIZ MODE
    // 🔹 STEP-4 QUIZ MODE
    // 🔹 STEP-4 QUIZ MODE
    // 🔹 STEP-4 QUIZ SHOW ANSWER
    // 🔹 STEP-4 QUIZ SHOW ANSWER
    // 🔹 STEP-4 QUIZ SHOW ANSWER
    if (step4.style.display === "block") {
      // 👉 If answer was just shown, move to next question
      if (isQuizAnswerVisible || !selectedQuizBlank) {
        currentQuizIndex++;

        // ✅ If quiz finished
        if (currentQuizIndex >= quizData.length) {
          alert("Quiz completed!");
          nextBtn.disabled = true;
          return;
        }

        // 👉 Load next question immediately
        renderQuizQuestion();

        showAnsBtn.textContent = "उत्तर देखें";
        nextBtn.disabled = true;
        isQuizAnswerVisible = false;
        selectedQuizBlank = null;
        return;
      }
    }

    // 🔹 STEP 2 MODE (existing logic)
    currentGroupIndex++;

    if (currentGroupIndex >= allData.length) {
      step2.style.display = "none";
      step3.style.display = "block";

      currentStep3GroupIndex = 0;

      // ⭐ RESET UI
      rightColOption.style.display = "block";
      rightColCategory.style.display = "none";
      showAnsBtn.disabled = false; // ✅ ENABLE Show Answer in Step-3


      renderStep3Options(currentStep3GroupIndex);
      updateBtnWrapperVisibility();
      return;
    }

    const nextKey = Object.keys(allData[currentGroupIndex])[0];
    renderGroup(allData[currentGroupIndex][nextKey]);
  });

  function renderStep3Options(groupIndex) {
    optionList.innerHTML = "";

    const groupKey = Object.keys(allData[groupIndex])[0];
    const groupData = allData[groupIndex][groupKey];

    groupData.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.completeSentence;
      li.dataset.category = item.category;
      optionList.appendChild(li);
    });
  }

  optionList.addEventListener("click", (e) => {
    const optionLi = e.target.closest("li");
    if (!optionLi) return;

    // 🚫 Category not selected
    if (!selectedCategoryItem) {
      // alert("पहले सही श्रेणी चुनें।");
      return;
    }

    const optionCategory = optionLi.dataset.category;
    const selectedCategory = selectedCategoryItem.dataset.category;

    // 🔄 Remove previous wrong state
    optionList
      .querySelectorAll("li.wrong")
      .forEach((li) => li.classList.remove("wrong"));

    // ✅ CATEGORY MATCH
    if (optionCategory === selectedCategory) {
      const wordWrap = selectedCategoryItem.querySelector(".word-wrap");
      if (!wordWrap) return;

      const span = document.createElement("span");
      span.textContent = optionLi.textContent;
      wordWrap.appendChild(span);

      // Remove option after correct placement
      optionLi.remove();

      // Clear selected category
      selectedCategoryItem.classList.remove("selected");
      selectedCategoryItem = null;
    }
    // ❌ CATEGORY MISMATCH
    else {
      optionLi.classList.add("wrong");
    }
  });

  // Click handler for subject-list (first click)
  subjectList.addEventListener("click", (e) => {
    const subjectLi = e.target.closest("li");
    if (!subjectLi) return;

    // ✅ ACTIVE STATE (Step-3)
    subjectList
      .querySelectorAll("li.active")
      .forEach(li => li.classList.remove("active"));

    subjectLi.classList.add("active");

    // Store selected subject (existing logic)
    selectedSubjectListItem = subjectLi;

    // Also set for option placement if has data-category
    if (subjectLi.dataset.category) {
      selectedCategoryItem = subjectLi;
    }
  });

  function areAllOptionsPlaced() {
    return optionList.children.length === 0;
  }

  // Click handler for category-list (second click)
  categoryList.addEventListener("click", (e) => {
    const categoryLi = e.target.closest("li[data-category]");
    if (!categoryLi || !selectedSubjectListItem) return;

    const subjectId = selectedSubjectListItem.id;
    const categoryDataCategory = categoryLi.dataset.category;

    // Check if subject id matches category data-category
    if (subjectId === categoryDataCategory) {
      // ✅ Match: Add the class (category-1, category-2, category-3, category-4)
      selectedSubjectListItem.classList.add(categoryDataCategory);
      applyCategoryFormatting(selectedSubjectListItem);
      categoryLi.classList.remove("wrong");
      selectedSubjectListItem = null;
      categoryLi.remove();

      checkStep3Completion();


      // Get the complete sentence from category list item
      const completeSentence = categoryLi.textContent.trim();

      // Find matching data to get the answer
      // ✅ SAFETY CHECK
      if (
        !allData[currentStep3GroupIndex] ||
        typeof allData[currentStep3GroupIndex] !== "object"
      ) {
        console.warn("Invalid Step-3 group index:", currentStep3GroupIndex);
        return;
      }

      const groupKey = Object.keys(allData[currentStep3GroupIndex])[0];
      const groupData = allData[currentStep3GroupIndex][groupKey];

      const matchingItem = groupData.find(
        (item) =>
          item.completeSentence === completeSentence &&
          item.category === categoryDataCategory
      );

      if (matchingItem) {
        const answer = matchingItem.answer;
        const wordWrap = selectedSubjectListItem.querySelector(".word-wrap");

        if (wordWrap) {
          // Split answer into root and suffix
          // For "दौड़ता है", we want "दौड़" and "ता है"
          // For "दौड़ती है", we want "दौड़" and "ती है"
          // Pattern: answer contains verb root + suffix

          let rootPart = "";
          let suffixPart = "";

          // Common patterns to split
          if (answer.includes("ता है")) {
            const parts = answer.split("ता है");
            rootPart = parts[0] + "ता है".substring(0, 0); // just the root
            suffixPart = "ता है";
            rootPart = answer.replace("ता है", "");
          } else if (answer.includes("ती है")) {
            rootPart = answer.replace("ती है", "");
            suffixPart = "ती है";
          } else if (answer.includes("ते हैं")) {
            rootPart = answer.replace("ते हैं", "");
            suffixPart = "ते हैं";
          } else if (answer.includes("ती हैं")) {
            rootPart = answer.replace("ती हैं", "");
            suffixPart = "ती हैं";
          }

          // Split the complete sentence by the answer to get the prefix
          const beforeAnswer = completeSentence.split(answer)[0];
          const afterAnswer = completeSentence.split(answer)[1] || "";

          // Create outer span
          const outerSpan = document.createElement("span");

          // Add prefix text
          if (beforeAnswer) {
            outerSpan.appendChild(document.createTextNode(beforeAnswer));
          }

          // Add root part in span
          if (rootPart) {
            const rootSpan = document.createElement("span");
            rootSpan.textContent = rootPart;
            outerSpan.appendChild(rootSpan);
          }

          // Add suffix part in span
          if (suffixPart) {
            const suffixSpan = document.createElement("span");
            suffixSpan.textContent = suffixPart + afterAnswer;
            outerSpan.appendChild(suffixSpan);
          }

          // Append to word-wrap
          wordWrap.appendChild(outerSpan);
        }
      }

      selectedSubjectListItem = null;

      // Remove the category list item
      categoryLi.remove();
    } else {
      // ❌ No match: Show error
      categoryLi.classList.add("wrong");
      setTimeout(() => {
        categoryLi.classList.remove("wrong");
      }, 500);
    }
  });

  function showStep3Answers(show) {
    const groupKey = Object.keys(allData[currentStep3GroupIndex])[0];
    const groupData = allData[currentStep3GroupIndex][groupKey];

    document.querySelectorAll("#subject-list li").forEach(subjectLi => {
      const wordWrap = subjectLi.querySelector(".word-wrap");
      if (!wordWrap) return;

      // 🔄 Clear previous content
      wordWrap.innerHTML = "";

      if (!show) return;

      const subjectId = subjectLi.id;

      // ✅ Get ALL matching sentences for this category
      const matches = groupData.filter(
        item => item.category === subjectId
      );

      matches.forEach(item => {
        const span = document.createElement("span");
        span.textContent = item.completeSentence;
        wordWrap.appendChild(span);
      });

      // ✅ Apply existing verb formatting
      applyCategoryFormatting(subjectLi);
    });
  }



  function checkStep3Completion() {
    const remainingCategories =
      document.querySelectorAll("#category-list li[data-category]").length;

    if (remainingCategories === 0) {
      const studyBtn = document.getElementById("study-btn");
      if (studyBtn) {
        studyBtn.style.display = "block";
      }
    }
  }


  function transformSentence(span) {
    const text = span.textContent.trim();

    for (const rule of verbRules) {
      if (text.includes(rule.suffix)) {
        const root = text.replace(rule.suffix, "");

        span.innerHTML = `
        ${root.replace(
          /([^\s]+)$/,
          `<span class="${rule.rootClass}">$1</span>`
        )}
        <span class="${rule.suffixClass}">${rule.suffix}</span>
      `;
        break;
      }
    }
  }

  function applyCategoryFormatting(subjectLi) {
    const wordWrap = subjectLi.querySelector(".word-wrap");
    if (!wordWrap) return;

    wordWrap.querySelectorAll("span").forEach((span) => {
      transformSentence(span);
    });
  }
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      resetApplication();
    });
  }

  function checkAllQuizQuestionsAttempted() {
    const allAttempted = currentQuizIndex === quizData.length - 1 &&
      document.querySelector(".quiz-blank.correct");

    if (allAttempted) {
      showAnsBtn.disabled = true;
      nextBtn.disabled = true;

      document
        .querySelectorAll(".question-list li")
        .forEach(li => li.classList.add("disabled"));
      document
        .querySelectorAll(".answer-list li")
        .forEach(li => li.classList.add("disabled"));
    }
  }


  function resetApplication() {

    document
      .querySelectorAll(".question-list li")
      .forEach(li => li.classList.remove("disabled"));
    document
      .querySelectorAll(".answer-list li")
      .forEach(li => li.classList.remove("disabled"));

    if (studyBtn) {
      studyBtn.style.display = "none";
    }
    /* -------------------------
     STEP VISIBILITY
  ------------------------- */
    step1.style.display = "block";
    step2.style.display = "none";
    step3.style.display = "none";
    step4.style.display = "none";
    abhyasLabel.style.display = "none";

    /* -------------------------
     RESET INDICES
  ------------------------- */
    currentGroupIndex = 0;
    currentStep3GroupIndex = 0;

    /* -------------------------
     RESET STATES
  ------------------------- */
    currentSelectedQuestion = null;
    selectedCategoryItem = null;
    isAnswerVisible = false;

    /* -------------------------
     RESET BUTTONS
  ------------------------- */
    nextBtn.disabled = true;
    showAnsBtn.disabled = false;
    showAnsBtn.textContent = "उत्तर देखें";

    /* -------------------------
     RESET STEP-3 PANELS
  ------------------------- */
    rightColOption.style.display = "block";
    rightColCategory.style.display = "none";

    /* -------------------------
     CLEAR STEP-3 CONTENT
  ------------------------- */
    optionList.innerHTML = "";
    document
      .querySelectorAll("#subject-list .word-wrap")
      .forEach((wrap) => (wrap.innerHTML = ""));

    document.querySelectorAll("#subject-list li").forEach((li) => {
      li.className = ""; // removes category-* classes
    });

    /* -------------------------
     RELOAD FIRST GROUP
  ------------------------- */
    if (allData.length > 0) {
      const firstKey = Object.keys(allData[0])[0];
      renderGroup(allData[0][firstKey]);
    }
    updateBtnWrapperVisibility();
  }
  function renderQuizQuestion() {
    const quiz = quizData[currentQuizIndex];

    quizQuestion.innerHTML = quiz.question.replace(
      /_+/g,
      `<span class="quiz-blank"></span>`
    );

    quizOptions.innerHTML = "";
    quiz.options.forEach(opt => {
      const li = document.createElement("li");
      li.textContent = opt;
      quizOptions.appendChild(li);
    });

    // ✅ ENABLE CURRENT QUESTION NUMBER
    questionListing.forEach((li, index) => {
      if (index === currentQuizIndex) {
        li.classList.remove("disabled");
        li.classList.add("active"); // optional (if you want highlight)
      } else {
        li.classList.remove("active");
      }
    });

    selectedQuizBlank = null;
    isQuizAnswerVisible = false;
    showAnsBtn.textContent = "उत्तर देखें";
    nextBtn.disabled = true;
  }


  quizBtn.addEventListener("click", () => {
    step1.style.display = "none";
    step2.style.display = "none";
    step3.style.display = "none";
    step4.style.display = "block";
    abhyasLabel.style.display = "block";

    currentQuizIndex = 0;
    nextBtn.disabled = true; // ✅ IMPORTANT
    renderQuizQuestion();
    questionListing.forEach((li) => li.classList.add("disabled"));
    if (questionListing[0]) {
      questionListing[0].classList.remove("disabled");
    }
    updateBtnWrapperVisibility();
  });

  quizQuestion.addEventListener("click", (e) => {
    const blank = e.target.closest(".quiz-blank");
    if (!blank || blank.classList.contains("correct")) return;

    document
      .querySelectorAll(".quiz-blank.selected")
      .forEach((b) => b.classList.remove("selected"));

    blank.classList.add("selected");
    selectedQuizBlank = blank;
  });

  quizOptions.addEventListener("click", (e) => {
    const optionLi = e.target.closest("li");
    if (!optionLi || !selectedQuizBlank) return;

    const quiz = quizData[currentQuizIndex];
    const correctAnswer = quiz.answer.trim(); // ✅ FIX
    const selectedAnswer = optionLi.textContent.trim();

    // Reset previous states
    quizOptions
      .querySelectorAll("li.wrong")
      .forEach((li) => li.classList.remove("wrong"));

    // ✅ Correct answer
    if (selectedAnswer === correctAnswer) {
      selectedQuizBlank.textContent = selectedAnswer;
      selectedQuizBlank.classList.remove("selected");
      selectedQuizBlank.classList.add("correct");

      optionLi.style.display = "none";
      selectedQuizBlank = null;

      nextBtn.disabled = false;

      // ✅ ADD THIS
      checkAllQuizQuestionsAttempted();
    }


    // ❌ Wrong answer
    else {
      optionLi.classList.add("wrong");
    }
  });
});
