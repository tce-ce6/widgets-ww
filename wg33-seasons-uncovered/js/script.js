document.addEventListener("DOMContentLoaded", () => {
  const pipsSlider = document.getElementById("slider-pips");
  const earthImg = document.getElementById("earth-img");
  const tapTexts = document.querySelectorAll(".tap-txt");
  const topLottieWrapper = document.getElementById("top-lottie-wrapper");

  let currentObservation = null;
  let shuffledObservations = [];
  let currentObservationIndex = 0;
  const observationNextBtn = document.getElementById("observation-next");

  const currentObsEl = document.getElementById("current-observation");
  const totalObsEl = document.getElementById("total-observations");

  let currentConclusion = null;
  let isConclusionStage = false;

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

  pipsSlider.noUiSlider.on("update", (values, handle) => {
    const index = Math.round(values[handle]); // 0–4
    const rotateDeg = degrees[index];         // -45, -23, 0, 23, 45

    earthImg.style.transform = `rotate(${rotateDeg}deg)`;
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

  /* ---------------------------------------------------
     EXISTING EARTH / SVG SETUP (UNCHANGED)
  --------------------------------------------------- */
  const earthWrap = document.getElementById("earth-wrap");
  if (!earthWrap) return;

  const svgContainer =
    document.getElementById("svg-container") || document.body;

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
      if (!wrapper || !anim) return;

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
      requestAnimationFrame(() => {
        earthOverlay.style.left = `${wrapperRect.left -
          svgRect.left +
          wrapperRect.width / 2 -
          fixedSize / 2
          }px`;
        earthOverlay.style.top = `${wrapperRect.top - svgRect.top + wrapperRect.height / 2 - fixedSize / 2
          }px`;
        earthOverlay.style.width = `${fixedSize}px`;
        earthOverlay.style.height = `${fixedSize}px`;
      });

      setTimeout(() => {
        earthOverlay.style.display = "none";

        earthWrap.setAttribute(
          "x",
          wrapperBBox.x + wrapperBBox.width / 2 - fixedSize / 2
        );
        earthWrap.setAttribute(
          "y",
          wrapperBBox.y + wrapperBBox.height / 2 - fixedSize / 2
        );
        earthWrap.setAttribute("width", fixedSize);
        earthWrap.setAttribute("height", fixedSize);

        targetEl.appendChild(earthWrap);
        earthWrap.style.display = "";

        playEarthLottie(id);

        if (topLottieWrapper) topLottieWrapper.style.display = "none";
      }, 470);
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
    Observation <span id="current-observation"></span>/<span id="total-observations"></span>
  `;
    }


    if (!tiltObject || !tiltObject.observations) return;

    // Shuffle ONCE per position click
    shuffledObservations = shuffleArray(tiltObject.observations);
    currentObservationIndex = 0;

    // ✅ TOTAL COUNT
    if (totalObsEl) {
      totalObsEl.textContent = shuffledObservations.length;
    }

    // ✅ RESET CURRENT COUNT (1-based)
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

    if (selectedOption === currentObservation.correctAnswer) {
      clickedBox.classList.add("right");

      // ✅ ENABLE NEXT IMMEDIATELY ON CORRECT
      observationNextBtn?.classList.remove("disabled");
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

    const shuffledOptions = shuffleArray(currentObservation.options);

    shuffledOptions.forEach(optionText => {
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

    if (optionWrapper) optionWrapper.style.display = "none";
    if (conclusionWrapper) conclusionWrapper.style.display = "block";

    // ✅ CHANGE TITLE TO CONCLUSION
    if (observationTitle) {
      observationTitle.textContent = "Conclusion";
    }

    observationNextBtn?.classList.add("disabled");

    bindConclusionOptions();
  }


  function bindConclusionOptions() {
    const conclusionWrapper = document.getElementById("conclusion-wrapper");
    if (!conclusionWrapper || !currentConclusion) return;

    const formControls = conclusionWrapper.querySelectorAll(".form-control");

    // Clear old state
    formControls.forEach(fc => {
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



});
