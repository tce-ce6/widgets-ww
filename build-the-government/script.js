document.addEventListener("DOMContentLoaded", () => {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  // New: Reference for step-3
  const step3 = document.getElementById("step-3");

  // NEW: References for comparison images
  const block1CompareImg = document.getElementById("block-1-compare-img");
  const block2CompareImg = document.getElementById("block-2-compare-img");

  // NEW: Reference for select-box-note
  const selectBoxNote = document.getElementById("select-box-note");

  // NEW: Reference for step-1-note (ADDED)
  const step1Note = document.getElementById("step-1-note");

  // Ensure all steps and comparison blocks exist
  if (!step1 || !step2 || !step3 || !block1CompareImg || !block2CompareImg)
    return;

  // Find candidate cards: top-level <g> elements inside step-1 that contain a <use>
  const groups = Array.from(step1.querySelectorAll("g[id]"));
  // Filter to get only the <g> elements that represent government cards (those with an ID and a <use> child)
  const cards = groups.filter((g) => g.id && Boolean(g.querySelector("use")));

  // State for the new comparison mode
  let compareMode = false;
  const selectedCardsForCompare = new Set(); // Stores card IDs (used for both modes)

  // ⭐ NEW GLOBAL ARRAY: Stores the IDs of governments where all questions in Step 2 were answered.
  const completedGovernmentIds = []; // e.g., ['republic', 'monarchy']
  // You can also expose this to the window if needed: window.completedGovernmentIds = completedGovernmentIds;

  // Loaded JSON data will be stored here
  let governmentData = null;

  // Publicly accessible selected object (for debugging/other scripts)
  window.selectedGovernment = null;
  // last selected card id (e.g. 'republic')
  window.selectedGovernmentCardId = null;
  // New: Stores an array of IDs for comparison mode when transitioning to step 3
  window.selectedGovernmentsForComparison = null;

  // Buttons (dynamic)
  const btn1 = document.getElementById("btn-1"); // Compare / Continue / Back / Reset (New in Compare Mode)
  const btn2 = document.getElementById("btn-2"); // Continue / Reset
  const btn3 = document.getElementById("btn-3"); // Home

  // --- Lottie Animation Initialization and Control ---
  let lottieAnimation = null;
  let lottieInitialized = false;

  function initializeLottie() {
    const container = document.getElementById("govimg-wrapper");
    if (!container) {
      console.error("Lottie container 'govimg-wrapper' not found.");
      return;
    }

    // Create wrapper <foreignObject> to host HTML div
    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    foreignObject.setAttribute("width", "500");
    foreignObject.setAttribute("height", "500");
    foreignObject.setAttribute("x", "110");
    foreignObject.setAttribute("y", "100");

    // Create inner <div> for Lottie container (MUST belong to HTML namespace)
    const div = document.createElement("div");
    div.setAttribute("id", "lottie-container");
    div.style.width = "500px";
    div.style.height = "500px";
    div.style.background = "transparent";

    // 💡 THE FIX: Initially hide the Lottie container
    div.style.display = "none";

    // Append div inside foreignObject (HTML element inside SVG)
    foreignObject.appendChild(div);
    container.appendChild(foreignObject);

    // Delay animation initialization to ensure div is part of DOM
    setTimeout(() => {
      lottieAnimation = lottie.loadAnimation({
        container: div,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./lottie-animation.json", // working sample animation
      });

      lottieAnimation.addEventListener("DOMLoaded", () => {
        lottieInitialized = true;
        console.log("✅ Lottie animation loaded successfully!");
      });
    }, 100);
  }
  initializeLottie();
  // ---------------------------------------------------
  // ---------------------------------------------------

  function updateGovernmentImage(cardId) {
    if (!cardId) return;
    // element is a <use id="government-img"> inside the SVG
    const useEl =
      document.getElementById("government-img") ||
      document.querySelector("use#government-img");
    if (!useEl) return;
    const path = `./assets/${cardId}.svg`;
    try {
      useEl.setAttribute("href", path);
    } catch (e) {}
    // older browsers may use xlink:href
    try {
      useEl.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", path);
    } catch (e) {}
    // Ensure 'active' class is removed on a new image selection
    try {
      useEl.classList.remove("active");
    } catch (e) {}
  }

  // Helper function to update the <use> element's href
  function updateUseElementHref(gElement, cardId, isXlink = false) {
    if (!gElement || !cardId) return;
    const useEl = gElement.querySelector("use");
    if (!useEl) return;

    const path = `./assets/${cardId}.svg`;

    try {
      // Standard href
      useEl.setAttribute("href", path);
    } catch (e) {
      // Fallback for older browsers (xlink:href)
      if (isXlink) {
        try {
          useEl.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            path
          );
        } catch (e) {}
      }
    }
  }

  // Load data.json once
  fetch("./data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load data.json: " + res.status);
      return res.json();
    })
    .then((json) => {
      governmentData = json.government_types || json;
    })
    .catch((err) => {
      console.error("Error loading data.json", err);
      governmentData = null;
    });

  function idToGovernmentType(id) {
    if (!id) return id;
    return id
      .replace(/[-_]+/g, " ")
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  }

  // Helper to find government data based on card ID
  function getGovernmentDataById(cardId) {
    if (!governmentData) return null;
    const govType = idToGovernmentType(cardId);
    return governmentData.find((g) => {
      return (
        String(g["Government Type"]).toLowerCase() ===
        String(govType).toLowerCase()
      );
    });
  }

  // Function to update the answers in the comparison blocks
  function updateComparisonAnswers(selectedIds) {
    if (!selectedIds || selectedIds.length < 2) return;

    const data1 = getGovernmentDataById(selectedIds[0]);
    const data2 = getGovernmentDataById(selectedIds[1]);

    // List of answer element IDs for block 1 and block 2
    const block1AnswerIds = [
      "block-1-compare-1-ans",
      "block-1-compare-2-ans",
      "block-1-compare-3-ans",
      "block-1-compare-4-ans",
    ];
    const block2AnswerIds = [
      "block-2-compare-1-ans",
      "block-2-compare-2-ans",
      "block-2-compare-3-ans",
      "block-2-compare-4-ans",
    ];

    // Update Block 1 Answers (Left side)
    if (data1 && data1.blocks) {
      block1AnswerIds.forEach((id, index) => {
        const answerEl = document.getElementById(id);
        const answer = data1.blocks[index] ? data1.blocks[index].Answer : "N/A";
        if (answerEl) answerEl.textContent = answer;
      });
    }

    // Update Block 2 Answers (Right side)
    if (data2 && data2.blocks) {
      block2AnswerIds.forEach((id, index) => {
        const answerEl = document.getElementById(id);
        const answer = data2.blocks[index] ? data2.blocks[index].Answer : "N/A";
        if (answerEl) answerEl.textContent = answer;
      });
    }
  }

  // Function to show Step 2 (single selection quiz)
  function showStep2() {
    step1.style.display = "none";
    step3.style.display = "none"; // Ensure step-3 is hidden
    step2.style.display = "inline";
    const firstFocusable = step2.querySelector(
      "button, [tabindex], a, input, select, textarea"
    );
    if (firstFocusable) firstFocusable.focus();
  }

  // Function to show Step 3 (comparison view)
  function showStep3() {
    step1.style.display = "none";
    step2.style.display = "none"; // Ensure step-2 is hidden
    step3.style.display = "inline";
    const firstFocusable = step3.querySelector(
      "button, [tabindex], a, input, select, textarea"
    );
    if (firstFocusable) firstFocusable.focus();

    // Set btn1 to 'Reset'
    if (btn1) {
      btn1.style.display = "none";
    }
    // Set btn2 to 'Back to Government Types'
    if (btn2) {
      btn2.style.display = "inline-block";
      btn2.disabled = false;
      btn2.textContent = "Back to Government Types";
    }

    // Comparison Image & Answer Rendering Logic
    if (
      window.selectedGovernmentsForComparison &&
      window.selectedGovernmentsForComparison.length >= 2
    ) {
      const id1 = window.selectedGovernmentsForComparison[0];
      const id2 = window.selectedGovernmentsForComparison[1];

      // 1. Update Images
      updateUseElementHref(block1CompareImg, id1, true);
      updateUseElementHref(block2CompareImg, id2, true);

      // 2. Update Answers
      updateComparisonAnswers(window.selectedGovernmentsForComparison);
    }

    console.log(
      "Step 3 (Comparison View) activated for:",
      window.selectedGovernmentsForComparison
    );
  }

  function selectGovernmentById(cardId) {
    window.selectedGovernmentCardId = cardId;
    updateGovernmentImage(cardId);
    Object.keys(answeredBlocks).forEach((k) => delete answeredBlocks[k]);
    hideActionButtons();
    for (let i = 1; i <= 4; i++) {
      const rg = getResultGroup(i);
      if (rg) rg.style.display = "none";
    }
    const match = getGovernmentDataById(cardId);
    const govType = idToGovernmentType(cardId);
    window.selectedGovernment = match || {
      "Government Type": govType,
      blocks: [],
    };
    // Set the selected government type in the UI
    const govTypeSpan = document.getElementById('selected-gov-type');
    if (govTypeSpan) govTypeSpan.textContent = (match && match['Government Type']) ? match['Government Type'] : govType;
  }

  // --- Button Control Functions ---

  function hideActionButtons() {
    if (btn1) {
      btn1.style.display = "none";
      btn1.disabled = true;
    }
    if (btn2) {
      btn2.style.display = "none";
      btn2.disabled = true;
    }
    if (btn3) {
      btn3.style.display = "none";
      btn3.disabled = true;
    }
  }

  function setStep1Buttons() {
    // Step 1 Initial State (Single-Select/Continue mode)
    const canCompare = completedGovernmentIds.length >= 2;

    if (btn1) {
      btn1.style.display = canCompare ? "inline-block" : "none";
      btn1.textContent = "Compare";
      btn1.disabled = !canCompare;
      btn1.title = canCompare
        ? "Compare selected governments"
        : "Complete at least 2 governments to enable compare";
    }
    if (btn2) {
      btn2.style.display = canCompare ? "inline-block" : "none";
      btn2.textContent = "Continue";
      btn2.disabled = true;
    }
    if (btn3) {
      btn3.style.display = "none";
      btn3.disabled = true;
    }

    // Ensure note is set for default mode
    if (step1Note) {
      if (!canCompare) {
        step1Note.textContent =
          "Build at least two government types to compare them. Tap any card to proceed.";
      } else {
        step1Note.textContent =
          "Tap 'Compare' or continue to build more governments.";
      }
    }
  }

  // Logic for Step 1 when in compare mode
  function updateStep1ButtonsInCompareMode() {
    const selectedCount = selectedCardsForCompare.size;
    const canCompare = completedGovernmentIds.length >= 2;
    const enableContinue = canCompare && selectedCount >= 2;

    if (btn1) {
      if (compareMode) {
        btn1.style.display = canCompare ? "inline-block" : "none";
        btn1.textContent = "Home";
        btn1.disabled = !canCompare;
      } else {
        btn1.style.display = canCompare ? "inline-block" : "none";
        btn1.textContent = "Compare";
        btn1.disabled = !canCompare;
      }
    }
    if (btn2) {
      btn2.style.display = canCompare ? "inline-block" : "none";
      btn2.textContent = "Continue";
      btn2.disabled = !enableContinue;
    }
    if (btn3) {
      btn3.style.display = "none";
      btn3.disabled = true;
    }

    // Ensure note is set for compare mode
    if (step1Note) {
      step1Note.textContent = canCompare
        ? "Tap any two completed cards. Then tap 'Continue' to view a comparison."
        : "Complete at least two government quizzes to enable Compare.";
    }
  }

  // Function to go back to the compare stage (Step 1, with comparison mode active)
  function backToCompareStage() {
    step2.style.display = "none";
    step3.style.display = "none";
    step1.style.display = "inline";

    // Restore compare mode state
    compareMode = true;

    // Ensure buttons and selections are correct for the compare stage
    updateStep1ButtonsInCompareMode();

    if (cards.length > 0) cards[0].focus();

    // Hide Lottie animation when returning to Step 1
    const lottieDiv = document.getElementById("lottie-animation-wrapper");
    if (lottieDiv) lottieDiv.style.display = "none";
  }

  // Function to go back to the default stage (Step 1, single-select mode)
  function backToDefaultStage() {
    step2.style.display = "none";
    step3.style.display = "none";
    step1.style.display = "inline";

    // Reset all states
    compareMode = false;
    selectedCardsForCompare.clear();
    window.selectedGovernmentsForComparison = null;

    // ⭐ MODIFICATION: Don't clear 'active' class globally; only clear selections.
    cards.forEach((c) => {
      c.classList.remove("active");
      c.classList.remove("compare"); // Remove compare class when exiting compare mode
    });

    // ⭐ NEW LOGIC: Re-apply 'active' class to cards that have been completed.
    cards.forEach((card) => {
      if (completedGovernmentIds.includes(card.id)) {
        card.classList.add("active");
      }
    });

    // Remove correct-answer class from option-wrapper when returning to Step 1
    if (optionWrapper) {
      optionWrapper.classList.remove("correct-answer");
    }

    // Reset buttons to initial Step 1 state (this also sets the correct default step1Note text)
    setStep1Buttons();

    if (cards.length > 0) cards[0].focus();

    // Hide Lottie animation when returning to Step 1
    const lottieDiv = document.getElementById("lottie-animation-wrapper");
    if (lottieDiv) lottieDiv.style.display = "none";

    // Ensure select-box-note is visible when returning to Step 1
    if (selectBoxNote) {
      selectBoxNote.style.display = "inline-block";
    }
  }

  // --- Card Interaction ---
  cards.forEach((card) => {
    try {
      card.setAttribute("tabindex", "0");
    } catch (e) {}
    try {
      card.setAttribute("role", "button");
    } catch (e) {}
    card.style.cursor = "pointer";

    const cardId = card.id;

    const handleCardActivation = (evt) => {
      if (evt) evt.stopPropagation();

      if (compareMode) {
        // In Compare Mode: Toggle selection and update visual/buttons
        // Check if card is already marked as completed (and thus has 'active')
        const isCompleted = completedGovernmentIds.includes(cardId);

        if (selectedCardsForCompare.has(cardId)) {
          selectedCardsForCompare.delete(cardId);
          card.classList.remove("compare");
        } else {
          if (selectedCardsForCompare.size >= 2) {
            // Remove the oldest selected card
            const firstSelectedId = selectedCardsForCompare
              .values()
              .next().value;
            selectedCardsForCompare.delete(firstSelectedId);
            const firstCard = cards.find((c) => c.id === firstSelectedId);
            if (firstCard) firstCard.classList.remove("compare");
          }
          selectedCardsForCompare.add(cardId);
          card.classList.add("compare");
        }

        // Remove .compare from all cards not in selectedCardsForCompare
        cards.forEach((c) => {
          if (!selectedCardsForCompare.has(c.id)) {
            c.classList.remove("compare");
          }
        });

        updateStep1ButtonsInCompareMode();
      } else {
        // Original Single-Select Mode: Select one and immediately proceed to Step 2

        // 1. Perform original actions: filter data and show step-2
        selectGovernmentById(cardId);
        showStep2();

        // Hide select-box-note when proceeding to Step 2
        if (selectBoxNote) {
          selectBoxNote.style.display = "none";
        }

        // 2. Clear selections (since we are leaving step 1)
        selectedCardsForCompare.clear();
        // We DON'T clear the 'active' class on all cards here,
        // as that's handled when returning to Step 1.
        // cards.forEach(c => c.classList.remove('active')); // REMOVED THIS LINE
      }
    };

    const originalHandleCardSelectAndActivate = (evt) => {
      if (evt) evt.stopPropagation();

      if (compareMode) {
        handleCardActivation(evt);
      } else {
        // In single select mode, clear ALL temporary selections/active states
        // EXCEPT those marked as completed.
        cards.forEach((c) => {
          if (!completedGovernmentIds.includes(c.id)) {
            c.classList.remove("active");
          }
        });
        selectedCardsForCompare.clear();

        // Then select the current card
        selectedCardsForCompare.add(cardId);
        card.classList.add("active");

        handleCardActivation(evt); // This will proceed to showStep2
      }
    };

   const handleCardClick = (evt) => {
  evt.stopPropagation();
  const cardId = card.id;

  // --- Single-Select Mode ---
  if (!compareMode) {
    // 1️⃣ Select the government
    selectGovernmentById(cardId);

    // 2️⃣ If government is already completed, show Step-2 with solved answers
    if (completedGovernmentIds.includes(cardId)) {
      // Show Step 2 with the solved answers
      step1.style.display = "none";
      step3.style.display = "none";
      step2.style.display = "inline";

      // Restore answered blocks state
      const govData = getGovernmentDataById(cardId);
      if (govData && govData.blocks) {
        // Mark all blocks as answered
        govData.blocks.forEach((_, idx) => {
          answeredBlocks[idx] = true;
        });

        // Reset and update UI
        blockTitles.forEach((bt) => {
          bt.classList.remove("active");
          bt.classList.add("completed");
        });

        // Display all result boxes with correct answers
        for (let i = 0; i < govData.blocks.length; i++) {
          const blk = govData.blocks[i];
          setResultText(i + 1, blk["Answer"] || "");
        }

        // Show options for the first block (in answered state)
        renderOptionsForBlock(0);
        
        // Show both Home and Continue buttons for completed state
        showActionButtons();
      }

      if (selectBoxNote) selectBoxNote.style.display = "none";
      
      // Hide insights initially
      const insightResultBox = document.getElementById("insight-result-box");
      if (insightResultBox) insightResultBox.style.display = "none";
      const insightsWrapper = document.getElementById("insights-wrapper");
      if (insightsWrapper) insightsWrapper.style.display = "none";

      if (optionWrapper) {
        optionWrapper.style.display = "inline";
        optionWrapper.setAttribute("data-active-block", "0");
        // Add correct-answer class to option-wrapper for completed answers
        optionWrapper.classList.add("correct-answer");
      }
      if (questionWrapper) questionWrapper.style.display = "inline";
    } else {
      // 3️⃣ If NOT completed → open Step-2 quiz
      step1.style.display = "none";
      step3.style.display = "none";
      step2.style.display = "inline";

      // ⭐ Reset Step-2 state for new government
      Object.keys(answeredBlocks).forEach((k) => delete answeredBlocks[k]);
      hideActionButtons();

      // Reset block titles and options UI
      blockTitles.forEach((bt) => {
        bt.classList.remove("active", "completed");
      });
      if (options) {
        Object.values(options).forEach((opt) => {
          if (opt) {
            opt.classList.remove("correct-answer", "wrong-answer");
            const inner = getForeignDiv(opt);
            if (inner)
              inner.classList.remove("correct-answer", "wrong-answer");
          }
        });
      }

      // Hide insight result box when starting a new quiz
      const insightResultBox =
        document.getElementById("insight-result-box");
      if (insightResultBox) insightResultBox.style.display = "none";

      // Hide insights-wrapper if present
      const insightsWrapper = document.getElementById("insights-wrapper");
      if (insightsWrapper) insightsWrapper.style.display = "none";

      if (optionWrapper) {
        optionWrapper.style.display = "inline";
        // ✅ FIX: Set the active block index so options are immediately clickable
        optionWrapper.setAttribute("data-active-block", "0");
        // Remove correct-answer class when starting a new quiz
        optionWrapper.classList.remove("correct-answer");
      }
      if (questionWrapper) questionWrapper.style.display = "inline";
      
      // Show only Home button when starting a new quiz
      showHomeButtonOnly();
      if (selectBoxNote) selectBoxNote.style.display = "none";

      renderBlockTitles();
      renderOptionsForBlock(0);
      const firstBlockTitle = document.getElementById("block-title-1");
      if (firstBlockTitle) {
        firstBlockTitle.classList.add("active");
      }
    }
  }
  if (compareMode) {
    // Only allow selection of completed governments
    if (!completedGovernmentIds.includes(cardId)) return;

    // Toggle selection
    if (selectedCardsForCompare.has(cardId)) {
      selectedCardsForCompare.delete(cardId);
      card.classList.remove("compare");
    } else {
      if (selectedCardsForCompare.size >= 2) {
        // Remove the oldest selected card
        const firstSelectedId = selectedCardsForCompare
          .values()
          .next().value;
        selectedCardsForCompare.delete(firstSelectedId);
        const firstCard = cards.find((c) => c.id === firstSelectedId);
        if (firstCard) firstCard.classList.remove("compare");
      }
      selectedCardsForCompare.add(cardId);
      card.classList.add("compare");
    }

    // Ensure only selected cards have the .compare class
    cards.forEach((c) => {
      if (!selectedCardsForCompare.has(c.id)) {
        c.classList.remove("compare");
      }
    });

    updateStep1ButtonsInCompareMode();
    return;
  }
};

    card.addEventListener("click", handleCardClick);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick(e);
      }
    });
  });

  // --- Button Click Handlers ---

  // Initial button state on load (Step 1)
  setStep1Buttons();

  if (btn2) {
    btn2.addEventListener("click", () => {
      const btnText = btn2.textContent.trim().toLowerCase();

      // Handle "Back to Government Types" from Step 3
      if (
        step3.style.display === "inline" &&
        btnText === "back to government types"
      ) {
        cards.forEach((c) => c.classList.remove("compare")); // <-- Add this line
        backToDefaultStage();
        return;
      }

      if (btnText === "reset") {
        // Existing functionality for Step 2
        window.location.reload();
        return;
      }

      if (btnText === "continue" && !btn2.disabled) {
        // Logic to transition from Step 1 (Compare Mode) to Step 3
        if (compareMode && selectedCardsForCompare.size >= 2) {
          const selectedIds = Array.from(selectedCardsForCompare);
          window.selectedGovernmentsForComparison = selectedIds;

          showStep3();

          // Hide select-box-note when proceeding to Step 3
          if (selectBoxNote) {
            selectBoxNote.style.display = "none";
          }

          return;
        }

        // Safety/Redundancy path for single-select mode
        const cardId = Array.from(selectedCardsForCompare)[0];
        if (cardId) {
          selectGovernmentById(cardId);
          showStep2();

          // Hide select-box-note when proceeding to Step 2
          if (selectBoxNote) {
            selectBoxNote.style.display = "none";
          }
        }
      }
    });
  }

  if (btn1) {
    btn1.addEventListener("click", () => {
      const btnText = btn1.textContent.trim().toLowerCase();

      // Handle "Reset" from Step 3 (returns to compare stage)
      if (step3.style.display === "inline" && btnText === "reset") {
        backToCompareStage();
        return;
      }

      // Logic for Home in Step 1 (Compare Mode) - Go back to default mode
      if (compareMode && btn1.textContent.trim().toLowerCase() === "home") {
        backToDefaultStage();
        return;
      }

      // Handle Back from Step 2 (Insights) OR Back from Step 3 (if btn2 was not clicked)
      if (btnText === "back to government types") {
        // Go back to Step 1 view
        step2.style.display = "none";
        step3.style.display = "none";
        step1.style.display = "inline";

        compareMode = false;
        currentGovernment = null;
        selectedCardsForCompare.clear();

        // ✅ NEW: Reset insight flags
        insightMode = false;
        lastCompletedGovernment = null;
        lastSelectedGovernment = null;

        // ✅ NEW: Allow quiz to reopen
        isGovernmentQuizActive = false;

        // Reapply UI states
        cards.forEach((card) => {
          if (completedGovernmentIds.includes(card.id)) {
            card.classList.add("active");
          } else {
            card.classList.remove("active");
          }
        });

        if (selectBoxNote) selectBoxNote.style.display = "inline-block";
        if (step1Note)
          step1Note.textContent =
            "Select another government to continue the quiz.";

        // Hide step-2 content
        const optionWrapper = document.getElementById("option-wrapper");
        const quizWrapper = document.getElementById("quiz-wrapper");
        const insightWrapper = document.getElementById("insight-wrapper");
        if (optionWrapper) optionWrapper.style.display = "none";
        if (quizWrapper) quizWrapper.style.display = "none";
        if (insightWrapper) insightWrapper.style.display = "none";

        // Restore Step-1 buttons
        setStep1Buttons();
        return;
      }

      if (btnText === "compare") {
        // Only allow entering Compare Mode when at least two governments are completed
        if (!compareMode) {
          if (completedGovernmentIds.length < 2) {
            // Provide user feedback: keep Compare disabled (defensive check)
            setStep1Buttons();
            return;
          }

          // ENTER Compare Mode
          compareMode = true;
          selectedCardsForCompare.clear();

          // Clear active state only from uncompleted cards to allow new selection
          cards.forEach((c) => {
            if (!completedGovernmentIds.includes(c.id)) {
              c.classList.remove("active");
            }
          });

          // Optionally pre-select completed cards: (uncomment to auto-select them)
          // completedGovernmentIds.forEach(id => {
          //     const el = document.getElementById(id);
          //     if (el) { selectedCardsForCompare.add(id); el.classList.add('active'); }
          // });

          updateStep1ButtonsInCompareMode(); // This sets 'Reset' button and 'Tap Compare' note
        } else {
          // EXIT Compare Mode
          compareMode = false;
          selectedCardsForCompare.clear();

          // Clear ALL temporary selections, then restore completed ones.
          cards.forEach((c) => c.classList.remove("active"));
          backToDefaultStage(); // This function already calls setStep1Buttons() and restores completed card styles.
          return; // backToDefaultStage handles the final state setup.
        }
        // Ensure select-box-note visibility is correct when toggling compare mode
        if (selectBoxNote) {
          selectBoxNote.style.display = "inline-block";
        }
        return;
      }

      // ... Existing 'Continue' logic from Step 2 completion
      if (btnText === "continue" && !btn1.disabled) {
        const gov = window.selectedGovernment;
        if (!gov) return;

        let insights = gov["Insight Countries"];
        if (!insights && Array.isArray(gov.blocks)) {
          for (const b of gov.blocks) {
            if (b && b["Insight Countries"]) {
              insights = b["Insight Countries"];
              break;
            }
          }
        }

        const wrapper = document.getElementById("insights-wrapper");
        if (wrapper) wrapper.style.display = "block";

        // HIDE select-box-note when insights-wrapper gets visible
        if (selectBoxNote) {
          selectBoxNote.style.display = "none";
        }

        const countriesEl = document.getElementById("insights-countries");
        if (countriesEl) countriesEl.textContent = insights || "";

        const qWrapper = document.getElementById("question-wrapper");
        if (qWrapper) qWrapper.style.display = "none";

        if (optionWrapper) optionWrapper.style.display = "none";

        hideActionButtons();
      }
    });
  }

  if (btn3) {
    btn3.addEventListener("click", () => {
      const btnText = btn3.textContent.trim().toLowerCase();

      // Handle "Home" - Go back to Step 1 default mode (exit compare mode if active)
      if (btnText === "home") {
        backToDefaultStage();
      }
    });
  }

  // --- Step 2 Logic ---

  const questionWrapper = step2.querySelector("#question-wrapper");
  const blockTitles = questionWrapper
    ? Array.from(questionWrapper.querySelectorAll('g[id^="block-title-"]'))
    : [];
  const optionWrapper = step2.querySelector("#option-wrapper");
  const options = optionWrapper
    ? {
        1: optionWrapper.querySelector("#option-1"),
        2: optionWrapper.querySelector("#option-2"),
        3: optionWrapper.querySelector("#option-3"),
      }
    : null;

  const answeredBlocks = {};

  // --- Remaining Step 2 Logic ---

  function showActionButtons() {
    if (btn1) {
      btn1.style.display = "inline-block";
      btn1.disabled = false;
      btn1.textContent = "Continue";
    }
    if (btn2) {
      btn2.style.display = "none";
      btn2.disabled = true;
    }
    if (btn3) {
      btn3.style.display = "inline-block";
      btn3.disabled = false;
      btn3.textContent = "Home";
    }
  }

  function showHomeButtonOnly() {
    if (btn1) {
      btn1.style.display = "none";
      btn1.disabled = true;
    }
    if (btn2) {
      btn2.style.display = "none";
      btn2.disabled = true;
    }
    if (btn3) {
      btn3.style.display = "inline-block";
      btn3.disabled = false;
      btn3.textContent = "Home";
    }
  }

  function checkAllAnsweredAndActivateImage() {
    const totalBlocks =
      window.selectedGovernment && window.selectedGovernment.blocks
        ? window.selectedGovernment.blocks.length
        : 0;
    const answeredCount = Object.keys(answeredBlocks).length;

    // Check if all answers have been correctly provided
    if (totalBlocks > 0 && answeredCount >= totalBlocks) {
      // ⭐ NEW LOGIC: Add the completed government ID to the array
      const currentCardId = window.selectedGovernmentCardId;
      if (currentCardId && !completedGovernmentIds.includes(currentCardId)) {
        completedGovernmentIds.push(currentCardId);
        updateStep1ButtonsInCompareMode(); // <-- Add this line
        setStep1Buttons();
      }
      // ⭐ END NEW LOGIC

      showActionButtons();

      const useEl =
        document.getElementById("government-img") ||
        document.querySelector("use#government-img");
      if (useEl) {
        try {
          // 1. Apply 'active' class
          useEl.classList.add("active");
          const lottieDiv = document.getElementById("lottie-container"); // Corrected ID
          if (lottieDiv) lottieDiv.style.display = "block";
          lottieAnimation.goToAndPlay(0, true);
          // END: Lottie Animation Logic
        } catch (e) {
          console.error("Could not add active class to government-img", e);
        }
      }
    }
  }

  const insightBtn =
    document.getElementById("insight-btn") ||
    step2.querySelector("#insight-btn");
  if (insightBtn) {
    try {
      insightBtn.style.cursor = "pointer";
    } catch (e) {}
    insightBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const resultBox =
        document.getElementById("insight-result-box") ||
        step2.querySelector("#insight-result-box");
      if (resultBox) resultBox.style.display = "block";
      const note =
        document.getElementById("insights-note") ||
        step2.querySelector("#insights-note");
      if (note) note.style.display = "none";

      // Adjust insight-box y-position for Military Junta
      const insightBox = document.getElementById("insight-box");
      if (insightBox && window.selectedGovernment) {
        const govType = window.selectedGovernment["Government Type"];
        if (govType === "Military Junta" || govType === "Oligarchy") {
          insightBox.setAttribute("y", "220");
        } else {
          insightBox.setAttribute("y", "235");
        }
      }

      if (btn1) {
        btn1.style.display = "inline-block";
        btn1.disabled = false;
        btn1.textContent = "Back to Government Types";
      }
      if (btn2) {
        // Hide the Reset button when showing insights
        btn2.style.display = "none";
      }
    });
  }

  Object.keys(answeredBlocks).forEach((k) => delete answeredBlocks[k]);
  hideActionButtons();

  function getForeignDiv(el) {
    if (!el) return null;
    const fo = el.querySelector("foreignObject");
    if (!fo) return null;
    return fo.querySelector("div");
  }

  function clearOptionsDisplay() {
    if (!options) return;
    Object.values(options).forEach((opt) => {
      if (!opt) return;
      opt.style.display = "none";
      opt.style.pointerEvents = "";
      try {
        opt.classList.remove("wrong-answer", "correct-answer", "completed-ans");
        const inner = getForeignDiv(opt);
        if (inner) inner.classList.remove("wrong-answer", "correct-answer", "completed-ans");
      } catch (e) {}
    });
  }

  function renderBlockTitles() {
    if (!window.selectedGovernment || !window.selectedGovernment.blocks) return;
    window.selectedGovernment.blocks.forEach((blk, idx) => {
      const titleGroup = blockTitles[idx];
      if (!titleGroup) return;
      const div = getForeignDiv(titleGroup);
      if (div) div.textContent = blk["Block Title"] || div.textContent;
    });
  }

  function getResultGroup(n) {
    return step2.querySelector("#result-" + n);
  }

  function setResultText(n, text) {
    const div = step2.querySelector("#block-title-" + n + "-ans");
    if (div) div.textContent = text;
    const resultGroup = getResultGroup(n);
    if (resultGroup) resultGroup.style.display = "block";
  }

  function renderOptionsForBlock(index) {
    clearOptionsDisplay();
    const blk =
      window.selectedGovernment && window.selectedGovernment.blocks
        ? window.selectedGovernment.blocks[index]
        : null;
    if (!blk || !options) return;
    if (answeredBlocks[index]) {
      const map2 = {
        1: blk["Option A"] || "",
        2: blk["Option B"] || "",
        3: blk["Option C"] || "",
      };
      const correctAnswer = blk["Answer"] || "";
      Object.keys(map2).forEach((k) => {
        const optEl = options[k];
        if (!optEl) return;
        const optText = map2[k];
        if (getForeignDiv(optEl)) getForeignDiv(optEl).textContent = optText;
        optEl.style.display = "inline";
        optEl.style.pointerEvents = "none";
        // Add completed-ans class to the correct answer option
        if (optText.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
          optEl.classList.add("completed-ans");
          const inner = getForeignDiv(optEl);
          if (inner) inner.classList.add("completed-ans");
        }
      });
      setResultText(index + 1, blk["Answer"] || "");
      return;
    }
    const map = {
      1: blk["Option A"] || "",
      2: blk["Option B"] || "",
      3: blk["Option C"] || "",
    };
    Object.keys(map).forEach((k) => {
      const optEl = options[k];
      if (!optEl) return;
      if (getForeignDiv(optEl)) getForeignDiv(optEl).textContent = map[k];
      optEl.style.display = "inline";
      optEl.style.pointerEvents = "";
    });
  }

  blockTitles.forEach((bt, i) => {
    try {
      bt.setAttribute("tabindex", "0");
    } catch (e) {}
    try {
      bt.setAttribute("role", "button");
    } catch (e) {}
    bt.style.cursor = "pointer";
    bt.addEventListener("click", (e) => {
      e.stopPropagation();

      // START: NEW LOGIC to add 'active' class
      // 1. Remove 'active' from all other block titles
      blockTitles.forEach((otherBt) => otherBt.classList.remove("active"));

      // 2. Add 'active' class to the clicked block title
      bt.classList.add("active");
      // END: NEW LOGIC

      if (
        (!window.selectedGovernment ||
          !window.selectedGovernment.blocks ||
          window.selectedGovernment.blocks.length === 0) &&
        governmentData
      ) {
        const current =
          window.selectedGovernment &&
          window.selectedGovernment["Government Type"];
        if (current) {
          const found = getGovernmentDataById(window.selectedGovernmentCardId);
          if (found) {
            window.selectedGovernment = found;
            renderBlockTitles();
          }
        }
      }
      renderOptionsForBlock(i);
    });
    bt.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        bt.click();
      }
    });
  });
  function findOptionDiv(optionEl) {
    return optionEl ? getForeignDiv(optionEl) : null;
  }

  if (options) {
    Object.keys(options).forEach((k) => {
      const optEl = options[k];
      if (!optEl) return;
      try {
        optEl.setAttribute("tabindex", "0");
      } catch (e) {}
      optEl.style.cursor = "pointer";
      optEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const activeIndex = parseInt(
          optionWrapper.getAttribute("data-active-block") || "-1",
          10
        );
        if (activeIndex < 0) return;
        const blk =
          window.selectedGovernment && window.selectedGovernment.blocks
            ? window.selectedGovernment.blocks[activeIndex]
            : null;
        if (!blk) return;
        const chosenText = findOptionDiv(optEl)?.textContent || "";
        const correctText = (blk["Answer"] || "").toString();
        if (
          chosenText.trim().toLowerCase() === correctText.trim().toLowerCase()
        ) {
          answeredBlocks[activeIndex] = true;
          setResultText(activeIndex + 1, correctText);
          optEl.classList.add("correct-answer");
          Object.values(options).forEach((o) => {
            if (o) o.style.pointerEvents = "none";
          });
          checkAllAnsweredAndActivateImage();
          const completedBlockTitle = blockTitles[activeIndex];
          if (completedBlockTitle) {
            completedBlockTitle.classList.add("completed");
            // Optionally remove 'active' here since it is now completed
            completedBlockTitle.classList.remove("active");
          }
        } else {
          optEl.classList.add("wrong-answer");
          const inner = findOptionDiv(optEl);
          if (inner) inner.classList.add("wrong-answer");
          setTimeout(() => {
            optEl.classList.remove("wrong-answer");
            if (inner) inner.classList.remove("wrong-answer");
          }, 500);
        }
      });
      optEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          optEl.click();
        }
      });
    });
  }

  blockTitles.forEach((bt, i) => {
    bt.addEventListener("click", () => {
      if (optionWrapper)
        optionWrapper.setAttribute("data-active-block", String(i));
    });
  });

  (function reconcileAfterLoad(retries = 10) {
    if (governmentData) {
      if (
        window.selectedGovernment &&
        window.selectedGovernment["Government Type"] &&
        (!window.selectedGovernment.blocks ||
          window.selectedGovernment.blocks.length === 0)
      ) {
        const found = getGovernmentDataById(window.selectedGovernmentCardId);
        if (found) {
          window.selectedGovernment = found;
          renderBlockTitles();
        }
      }
      return;
    }
    if (retries <= 0) return;
    setTimeout(() => reconcileAfterLoad(retries - 1), 150);
  })();
});
