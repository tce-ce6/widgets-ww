document.addEventListener("DOMContentLoaded", () => {
  const pipsSlider = document.getElementById("slider-pips");
  const earthImg = document.getElementById("earth-img");
  const tapTexts = document.querySelectorAll(".tap-txt");
  const topLottieWrapper = document.getElementById("top-lottie-wrapper");

  let currentObservation = null;
  let shuffledObservations = [];
  let currentObservationIndex = 0;
  const observationNextBtn = document.getElementById("observation-next");

let currentObsEl = document.getElementById("current-observation");
let totalObsEl = document.getElementById("total-observations");


  const observationSection = document.getElementById("observation-section");
  const infoSection = document.getElementById("info-section");
  const globalResetBtn = document.getElementById("global-reset");
  const earthWrap = document.getElementById("earth-wrap");
  const infoBackBtn = document.getElementById("infoBack-btn");
  const infoResetBtn = document.getElementById("infoReset-btn");

  let currentConclusion = null;
  let isConclusionStage = false;

  let isEarthResized = false;
  let earthCurrentSize = null;

  const instructionText = document.getElementById("itext");

  const TEXT_STATES = {
    initial: "How does the tilt of the Earth’s axis impact seasons? Select a tilt to explore.",
    afterSlider:
      "Tap one of the positions to place the Earth and observe.",
    afterObservation:
      "Select the correct observation(s) to uncover the season.",
  };

  if (!pipsSlider || !earthImg) return;

  const degrees = [-45, -23, 0, 23, 45];

  /* ---------------------------------------------------
      ✅ GLOBAL DATA VARIABLES (ADDED)
    --------------------------------------------------- */
  let tiltData = [];
  let filteredTiltObject = null;
  window.filteredTiltObject = null; // optional global access

  const positionMap = {
    left: 1,
    bottom: 2,
    right: 3,
    top: 4,
  };

  /* ---------------------------------------------------
      SLIDER INIT (UNCHANGED)
    --------------------------------------------------- */
  noUiSlider.create(pipsSlider, {
    start: 2, // 0°
    step: 1,
    range: { min: 0, max: 4 },
    connect: [true, false],
    pips: {
      mode: "steps",
      density: 100,
      format: {
        to: (value) => ["-45°", "-23°", "0°", "23°", "45°"][value],
      },
    },
  });

  // smooth rotation
  earthImg.style.transition = "transform 0.4s ease";

  if (infoBackBtn && infoSection) {
    infoBackBtn.addEventListener("click", () => {
      observationSection.style.display = "none";
      disableSliderInteraction()
      infoSection.style.display = "none";
         toggleInfoModal(false);
    });
  }

  if (infoResetBtn) {
    infoResetBtn.addEventListener("click", () => {
      // 🔁 Same behaviour as global reset
      resetSimulation();

      // 👁️ Hide info section explicitly
      if (infoSection) {
        infoSection.style.display = "none";
            toggleInfoModal(false);

      }
    });
  }

  pipsSlider.noUiSlider.on("update", (values, handle) => {
    const index = Math.round(values[handle]);
    const rotateDeg = degrees[index];

    earthImg.style.transform = `rotate(${rotateDeg}deg)`;

      const tiltNote = document.getElementById("tilt-note");
  if (tiltNote) {
    if (rotateDeg === 23) {
      tiltNote.style.display = "block";
    } else {
      tiltNote.style.display = "none";
    }
  }

    // ✅ ONLY UPDATE INSTRUCTION IF EARTH IS NOT IN A POSITION
    // Check if earth-wrap is inside any of the target positions
    const isEarthPlaced = ["top", "bottom", "left", "right"].some((id) => {
      const targetEl = document.getElementById(id);
      return targetEl && targetEl.contains(earthWrap);
    });

    // Only update to afterSlider if earth is NOT placed in a position
    if (!isEarthPlaced) {
      updateInstructionText("afterSlider");
    }
  });

  /* ---------------------------------------------------
      ✅ LOAD data.json (ADDED)
    --------------------------------------------------- */
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      tiltData = data;
      console.log("Tilt data loaded", tiltData);
    })
    .catch((err) => console.error("Failed to load data.json", err));

  /* ---------------------------------------------------
      ✅ HELPERS (ADDED)
    --------------------------------------------------- */
  function getCurrentTiltLabel() {
    const index = Number(pipsSlider.noUiSlider.get());
    return `${degrees[index]} degree`;
  }

  function filterTiltData(positionId) {
    if (!tiltData.length) return;

    const selectedTilt = getCurrentTiltLabel();
    const selectedPosition = positionMap[positionId];

    filteredTiltObject =
      tiltData.find(
        (item) =>
          item.tilt === selectedTilt && item.position === selectedPosition
      ) || null;

    window.filteredTiltObject = filteredTiltObject;

    console.log("Filtered Tilt Object:", filteredTiltObject);
  }

  function updateInstructionText(state) {
    if (!instructionText) return;
    instructionText.textContent = TEXT_STATES[state];
  }

  // Disable/enable slider interactions (mouse + keyboard)
  function disableSliderInteraction() {
    if (!pipsSlider) return;
    pipsSlider.style.pointerEvents = "none";
    pipsSlider.setAttribute("aria-disabled", "true");
    const handles = pipsSlider.querySelectorAll(".noUi-handle");
    handles.forEach((h) => h.setAttribute("tabindex", "-1"));
  }

  function enableSliderInteraction() {
    if (!pipsSlider) return;
    pipsSlider.style.pointerEvents = "";
    pipsSlider.removeAttribute("aria-disabled");
    const handles = pipsSlider.querySelectorAll(".noUi-handle");
    handles.forEach((h) => h.setAttribute("tabindex", "0"));
  }

  /* ---------------------------------------------------
      EXISTING EARTH / SVG SETUP (UNCHANGED)
    --------------------------------------------------- */
  if (!earthWrap) return;

  const svgContainer =
    document.getElementById("svg-container") || document.body;

  const earthOriginalState = {
    parent: earthWrap.parentNode,
    nextSibling: earthWrap.nextSibling, // critical for SVG order
    x: earthWrap.getAttribute("x"),
    y: earthWrap.getAttribute("y"),
    width: earthWrap.getAttribute("width"),
    height: earthWrap.getAttribute("height"),
  };

  if (getComputedStyle(svgContainer).position === "static") {
    svgContainer.style.position = "relative";
  }

  let earthOverlay = document.getElementById("earth-overlay");

  if (!earthOverlay) {
    earthOverlay = document.createElement("div");
    earthOverlay.id = "earth-overlay";
    Object.assign(earthOverlay.style, {
      position: "absolute",
      width: "100px",
      height: "100px",
      left: "0px",
      top: "0px",
      pointerEvents: "none",
      transition:
        "left 0.45s ease, top 0.45s ease, width 0.45s ease, height 0.45s ease",
      display: "none",
      zIndex: 9999,
    });

    const img = document.createElement("img");
    img.src = earthImg.getAttribute("src");
    img.style.width = "100%";
    img.style.height = "100%";
    earthOverlay.appendChild(img);

    svgContainer.appendChild(earthOverlay);
  }

  /* ---------------------------------------------------
      LOTTIE MAP (UNCHANGED)
    --------------------------------------------------- */
  const lottieMap = {
    top: {
      wrapper: document.getElementById("top-lottie-wrapper"),
      anim: lottie.loadAnimation({
        container: document.getElementById("top-earth-lottie"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./lottie/top_earth.json",
      }),
    },
    bottom: {
      wrapper: document.getElementById("bottom-lottie-wrapper"),
      anim: lottie.loadAnimation({
        container: document.getElementById("bottom-earth-lottie"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./lottie/earth_down.json",
      }),
    },
    left: {
      wrapper: document.getElementById("left-lottie-wrapper"),
      anim: lottie.loadAnimation({
        container: document.getElementById("left-earth-lottie"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./lottie/left_earth.json",
      }),
    },
    right: {
      wrapper: document.getElementById("right-lottie-wrapper"),
      anim: lottie.loadAnimation({
        container: document.getElementById("right-earth-lottie"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./lottie/right_earth.json",
      }),
    },
  };

  function playEarthLottie(direction) {
    Object.keys(lottieMap).forEach((key) => {
      const { wrapper, anim } = lottieMap[key];

      if (key === direction) {
        wrapper.style.display = "block";
        anim.goToAndPlay(0, true);
      } else {
        wrapper.style.display = "none";
        anim.stop();
      }
    });
  }

  /* ---------------------------------------------------
      TARGET CLICK HANDLING (ONLY 1 LINE ADDED)
    --------------------------------------------------- */
  ["top", "bottom", "left", "right"].forEach((id) => {
    const targetEl = document.getElementById(id);
    if (!targetEl) return;

    targetEl.addEventListener("click", () => {
      /* ✅ FILTER JSON HERE (ADDED) */
      filterTiltData(id);
      renderObservations(filteredTiltObject);

      /* -------- EXISTING CODE BELOW (UNCHANGED) -------- */
      const isTapVisible = Array.from(tapTexts).some(
        (el) => el.style.display !== "none"
      );
      if (!isTapVisible) return;

      const fixedSize = 170;
      const wrapperEl = targetEl.querySelector(".main-wrapper") || targetEl;

      const wrapperBBox = wrapperEl.getBBox();

      const svgRect = svgContainer.getBoundingClientRect();
      const earthRect = earthWrap.getBoundingClientRect();

      earthOverlay.style.display = "block";
      earthOverlay.style.left = `${earthRect.left - svgRect.left}px`;
      earthOverlay.style.top = `${earthRect.top - svgRect.top}px`;
      earthOverlay.style.width = `${earthRect.width}px`;
      earthOverlay.style.height = `${earthRect.height}px`;

      earthWrap.style.display = "none";

      const wrapperRect = wrapperEl.getBoundingClientRect();
      const targetSize = isEarthResized ? earthCurrentSize : fixedSize;

      requestAnimationFrame(() => {
        earthOverlay.style.left = `${
          wrapperRect.left -
          svgRect.left +
          wrapperRect.width / 2 -
          targetSize / 2
        }px`;

        earthOverlay.style.top = `${
          wrapperRect.top -
          svgRect.top +
          wrapperRect.height / 2 -
          targetSize / 2
        }px`;
      });

      setTimeout(() => {
        earthOverlay.style.display = "none";

        const finalSize = isEarthResized ? earthCurrentSize : fixedSize;

        earthWrap.setAttribute(
          "x",
          wrapperBBox.x + wrapperBBox.width / 2 - finalSize / 2
        );
        earthWrap.setAttribute(
          "y",
          wrapperBBox.y + wrapperBBox.height / 2 - finalSize / 2
        );

        // ✅ Resize ONLY ONCE
        if (!isEarthResized) {
          earthWrap.setAttribute("width", fixedSize);
          earthWrap.setAttribute("height", fixedSize);
          earthCurrentSize = fixedSize;
          isEarthResized = true;
        } else {
          // keep existing size
          earthWrap.setAttribute("width", earthCurrentSize);
          earthWrap.setAttribute("height", earthCurrentSize);
        }

        targetEl.appendChild(earthWrap);
        earthWrap.style.display = "";

        if (globalResetBtn) {
          globalResetBtn.removeAttribute("disabled");
        }

        playEarthLottie(id);

        if (id !== "top" && topLottieWrapper) {
          topLottieWrapper.style.display = "none";
        }

        /* ✅ SHOW OBSERVATION SECTION HERE (with 2s delay) */
        if (observationSection) {
          document.getElementById("tilt-note").style.display = "none";
          observationSection.style.display = "none";
          setTimeout(() => {
            observationSection.style.display = "block";
            // Disable slider while observation panel is active
            disableSliderInteraction();
            updateInstructionText("afterObservation");
          }, 2200);
        } else {
          updateInstructionText("afterObservation");
        }
      }, 0);
    });
  });

  function shuffleArray(arr) {
    return arr
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

function renderObservations(tiltObject) {
  const observationTitle = document.getElementById("observation-title");

  if (observationTitle) {
    observationTitle.innerHTML = `
      Observation <span id="current-observation">0</span>/<span id="total-observations">0</span>
    `;

    // 🔁 RE-BIND references (🔥 FIX)
    currentObsEl = document.getElementById("current-observation");
    totalObsEl = document.getElementById("total-observations");
  }

  if (!tiltObject || !tiltObject.observations) return;

  // Keep observations in serial order by `id` (do not randomize)
  shuffledObservations = (tiltObject.observations || []).slice().sort((a, b) => {
    return (a.id || 0) - (b.id || 0);
  });
  currentObservationIndex = 0;

  // ✅ TOTAL COUNT
  if (totalObsEl) {
    totalObsEl.textContent = shuffledObservations.length;
  }

  // ✅ CURRENT COUNT (1-based)
  if (currentObsEl) {
    currentObsEl.textContent = currentObservationIndex + 1;
  }

  renderCurrentObservation();
}



  function handleAnswerSelection(clickedBox, selectedOption) {
    if (!currentObservation) return;

    // Prevent re-click
    if (
      clickedBox.classList.contains("right") ||
      clickedBox.classList.contains("wrong")
    ) {
      return;
    }

    // Split correct answer by ". " to handle multiple correct options
    const correctAnswers = currentObservation.correctAnswer
      .split(". ")
      .map((ans) => ans.trim())
      .filter((ans) => ans.length > 0)
      .map((ans) => (ans.endsWith(".") ? ans : ans + "."));

    // Check if selected option is in the correct answers
    const isCorrect = correctAnswers.some(
      (correctAns) =>
        correctAns === selectedOption || correctAns === selectedOption + "."
    );

    if (isCorrect) {
      clickedBox.classList.add("right");

      // Check if ALL correct answers are selected
      const allCheckBoxes = document.querySelectorAll(
        "#option-wrapper .check-box"
      );
      const selectedCorrectCount = Array.from(allCheckBoxes).filter((box) =>
        box.classList.contains("right")
      ).length;

      // Enable next only when all correct answers are selected
      if (selectedCorrectCount === correctAnswers.length) {
        observationNextBtn?.classList.remove("disabled");
      }
    } else {
      clickedBox.classList.add("wrong");
    }
  }

  function renderCurrentObservation() {
    const optionWrapper = document.getElementById("option-wrapper");
    if (!optionWrapper) return;

    // Disable next button for new question
    observationNextBtn?.classList.add("disabled");

    optionWrapper.innerHTML = "";

    currentObservation = shuffledObservations[currentObservationIndex];
    if (!currentObservation) return;

    // ✅ UPDATE CURRENT COUNT
    if (currentObsEl) {
      currentObsEl.textContent = currentObservationIndex + 1;
    }

    // Keep options in the same order as provided in data.json
    const shuffledOptions = (currentObservation.options || []).slice();

    shuffledOptions.forEach((optionText) => {
      const formControl = document.createElement("div");
      formControl.className = "form-control";

      const checkBox = document.createElement("div");
      checkBox.className = "check-box";

      const span = document.createElement("span");
      span.textContent = optionText;

      checkBox.addEventListener("click", () => {
        handleAnswerSelection(checkBox, optionText);
      });

      formControl.appendChild(checkBox);
      formControl.appendChild(span);
      optionWrapper.appendChild(formControl);
    });
  }

  const nextBtn = document.getElementById("observation-next");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!shuffledObservations.length) return;

      currentObservationIndex++;

      // Stop at last observation
      if (currentObservationIndex >= shuffledObservations.length) {
        currentObservationIndex = shuffledObservations.length - 1;
        console.log("All observations completed");
        return;
      }

      renderCurrentObservation();
    });
  }

  if (observationNextBtn) {
    observationNextBtn.addEventListener("click", () => {
      if (observationNextBtn.classList.contains("disabled")) return;

      /* ✅ LAST OBSERVATION → SHOW CONCLUSION */
    if (isConclusionStage) {
  // 👉 Conclusion completed → show info section
  infoSection && (infoSection.style.display = "block");
  populateInfoSection();
  toggleInfoModal(true);

  return;
}

if (currentObservationIndex === shuffledObservations.length - 1) {
  showConclusion();
  return;
}


      currentObservationIndex++;
      renderCurrentObservation();
    });
  }

function showConclusion() {
  const optionWrapper = document.getElementById("option-wrapper");
  const conclusionWrapper = document.getElementById("conclusion-wrapper");
  const observationTitle = document.getElementById("observation-title");

  if (!filteredTiltObject || !filteredTiltObject.conclusion) return;

  currentConclusion = filteredTiltObject.conclusion;
  isConclusionStage = true;

  // Hide options, show conclusion
  optionWrapper && (optionWrapper.style.display = "none");
  conclusionWrapper && (conclusionWrapper.style.display = "block");

  // Change title
  observationTitle && (observationTitle.textContent = "Conclusion");

  // ❌ DO NOT show info section here
  infoSection && (infoSection.style.display = "none");

  // Disable next until correct conclusion is chosen
  observationNextBtn?.classList.add("disabled");

  bindConclusionOptions();
}


  function bindConclusionOptions() {
    const conclusionWrapper = document.getElementById("conclusion-wrapper");
    if (!conclusionWrapper || !currentConclusion) return;

    const formControls = conclusionWrapper.querySelectorAll(".form-control");

    // Clear old state
    formControls.forEach((fc) => {
      const box = fc.querySelector(".check-box");
      const span = fc.querySelector("span");

      box.classList.remove("right", "wrong");
      box.style.pointerEvents = "auto";
      span.textContent = "";
    });

    // Fill text dynamically
    currentConclusion.options.forEach((optionText, index) => {
      const formControl = formControls[index];
      if (!formControl) return;

      const checkBox = formControl.querySelector(".check-box");
      const span = formControl.querySelector("span");

      span.textContent = optionText;

      checkBox.addEventListener("click", () => {
        handleConclusionSelection(checkBox, optionText);
      });
    });
  }

  function handleConclusionSelection(clickedBox, selectedOption) {
    if (!currentConclusion) return;

    if (
      clickedBox.classList.contains("right") ||
      clickedBox.classList.contains("wrong")
    ) {
      return;
    }

    if (selectedOption === currentConclusion.correctAnswer) {
      clickedBox.classList.add("right");

      // ✅ ENABLE NEXT IMMEDIATELY ON CORRECT
      observationNextBtn?.classList.remove("disabled");
    } else {
      clickedBox.classList.add("wrong");
    }
  }
  function populateInfoSection() {
    if (!filteredTiltObject) return;

    /* --------------------------------
      LEFT COLUMN – OBSERVATIONS
    -------------------------------- */
    const observerLeftCol = document.querySelector(".observer-leftcol");
    if (!observerLeftCol) return;

    // Remove existing observation blocks (keep info-note)
    observerLeftCol
      .querySelectorAll("#observe-wrapper")
      .forEach((el) => el.remove());

    const observations = filteredTiltObject.observations || [];

    observations.forEach((obs, index) => {
      const wrapper = document.createElement("div");
      wrapper.id = "observe-wrapper";

      const h6 = document.createElement("h6");
      h6.textContent = `Observation ${index + 1}`;

      const p = document.createElement("p");
      p.id = `obsercation-${index + 1}`;
      p.textContent = obs.correctAnswer;

      wrapper.appendChild(h6);
      wrapper.appendChild(p);

      // Insert before note
      const note = observerLeftCol.querySelector(".info-note");
      observerLeftCol.insertBefore(wrapper, note);
    });

    /* --------------------------------
      RIGHT COLUMN – CONCLUSION
    -------------------------------- */
    const infoConclusionEl = document.getElementById("info-conclusion");
    if (infoConclusionEl && filteredTiltObject.conclusion) {
      infoConclusionEl.textContent =
        filteredTiltObject.conclusion.correctAnswer;
    }

    /* --------------------------------
      SEASON UNCOVERED (ROOT LEVEL)
    -------------------------------- */
    const seasonUncoveredEl = document.getElementById("seasonUncovered");
    if (seasonUncoveredEl && filteredTiltObject.seasonUncovered) {
      seasonUncoveredEl.textContent = filteredTiltObject.seasonUncovered;
    }
  }

  function resetEarthToOriginalPosition() {
    const { parent, nextSibling, x, y, width, height } = earthOriginalState;

    if (!parent) return;

    // ✅ Put earth-wrap back EXACTLY where it was
    if (nextSibling) {
      parent.insertBefore(earthWrap, nextSibling);
    } else {
      parent.appendChild(earthWrap);
    }

    // ✅ Restore SVG attributes
    earthWrap.setAttribute("x", x);
    earthWrap.setAttribute("y", y);
    earthWrap.setAttribute("width", width);
    earthWrap.setAttribute("height", height);

    earthWrap.style.display = "";
  }

  function resetSimulation() {

    toggleInfoModal(false);

    isEarthResized = false;
    earthCurrentSize = null;
    /* ---------------------------
      RESET EARTH POSITION (ONLY ONCE)
    --------------------------- */
    resetEarthToOriginalPosition();

    /* ---------------------------
      RESET LOTTIE
    --------------------------- */
    Object.values(lottieMap).forEach(({ wrapper, anim }) => {
      if (wrapper) wrapper.style.display = "none";
      if (anim) anim.stop();
    });

    /* ---------------------------
      RESET UI SECTIONS
    --------------------------- */
    observationSection && (observationSection.style.display = "none");
    infoSection && (infoSection.style.display = "none");

    const conclusionWrapper = document.getElementById("conclusion-wrapper");
    const optionWrapper = document.getElementById("option-wrapper");

    conclusionWrapper && (conclusionWrapper.style.display = "none");
    optionWrapper && (optionWrapper.style.display = "block");

    /* ---------------------------
      RESET STATE
    --------------------------- */
    currentObservation = null;
    shuffledObservations = [];
    currentObservationIndex = 0;
    isConclusionStage = false;

    observationNextBtn?.classList.add("disabled");

    /* ---------------------------
      RESET SLIDER & ROTATION
    --------------------------- */
    pipsSlider.noUiSlider.set(2); // 0°
    earthImg.style.transform = "rotate(0deg)";

    // Re-enable slider after reset
    enableSliderInteraction();

    /* ---------------------------
      ✅ RESET INSTRUCTION TEXT
    --------------------------- */
    updateInstructionText("initial");

    /* ---------------------------
      DISABLE RESET BUTTON
    --------------------------- */
    globalResetBtn?.setAttribute("disabled", "true");
  }

  if (globalResetBtn) {
    globalResetBtn.addEventListener("click", resetSimulation);
  }
function toggleInfoModal(isOpen) {
  const svgContainer = document.getElementById("svg-container");

  if (isOpen) {
    infoSection?.classList.add("modal-open");
    svgContainer?.classList.add("modal-open");
  } else {
    infoSection?.classList.remove("modal-open");
    svgContainer?.classList.remove("modal-open");
  }
}

  updateInstructionText("initial");
});
