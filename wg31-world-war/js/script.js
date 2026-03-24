window.addEventListener("DOMContentLoaded", async () => {
  /* ================= LOAD EVENT DATA ================= */
  let eventData = null;
  let selectedYearData = null; // 🌍 GLOBAL (used later)
  const container = document.querySelector(".container");
  const step2Description = document.getElementById("enter-war-zone");
  const selectedYearBox = document.querySelector(".selected-year-box");
  const flagList = document.getElementById("flag-list");
  const clueWrapper = document.getElementById("clue-wrapper");
  const showMsg = document.getElementById("show-msg");
  const closeBtn = document.getElementById("closeBtn");
  const hintText = document.getElementById("hintText");
  const solvedCountryPaths = new Set();
  let multiSolvedCountries = new Set(); // ONLY for 1918 Q2
  let lastSequentialYear = null;
  let lastSelectedYear = null;
  let shouldRemoveFlagsOnClose = false;
  let selectedClueIndex = null; // which clue is active
  let selectedCountryId = null; // country name from clue
  const replyBtn = document.getElementById("reply-btn");
  let lastDroppedFlag = null;
  let lastDroppedCountryPath = null;
  let lastPlacedFlagEl = null;
  let mustProceedBeforeNext = false;
  const placedFlags = new Set();
  const mapHomeImg = document.querySelector(".mapHome-img");
  const videoWrapper = document.getElementById("video-wrapper");
  const videoEl = videoWrapper?.querySelector("video");
  const videoSource = videoWrapper?.querySelector("source");

  const solvedCountriesByQuestion = {};

  // 🎨 Store original fill colors to restore them correctly
  const lastDroppedCountryFills = new Map();

  let currentClueIndex = 0;
  let currentQuestionIndex = 0;

  let solvedClues = {};
  let lastDropWasCorrect = false;
  const usedFlags = new Set();

  const actionBtn = document.getElementById("action-btn");
  let returningFromOverview = false;
  let msgTimeout = null;

  try {
    const response = await fetch("eventData.json");
    eventData = await response.json();
    console.log("📦 Event data loaded successfully");
  } catch (err) {
    console.error("❌ Failed to load eventData.json", err);
    return;
  }
  let tappedFlag = null; // selected flag (tap mode)
  let tapModeActive = false; // whether tap mode is active

  /* ================= MAP ELEMENTS ================= */
  const svgElem = document.querySelector(".map-wrapper svg");
  const worldMap = document.getElementById("world-map-wrapper");
  const mapWrapper = document.querySelector(".map-wrapper");

  const austriaHungary = document.getElementById("Austria-Hungary");
  const backOverviewBtn = document.getElementById("back-overview");
  const goToTimelineBtn = document.getElementById("go-to-timeline");
  /* ================== PANZOOM ================== */
  const panzoom = Panzoom(worldMap, {
    maxScale: 8,
    minScale: 1,
    step: 0.25,
    excludeClass: "no-pan",
  });

  svgElem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

  /* ================== DRAG CONFIG ================== */
  const DRAG_IMG_SIZE = 40;
  const DRAG_ANCHOR_X = 8.5;
  const DRAG_ANCHOR_Y = 40.5;

  let draggedFlag = null;

  /* ================== DROP ZONE ================== */
  mapWrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });

  mapWrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!draggedFlag) return;

    console.log("🖱️ Mouse Screen Position:", {
      clientX: e.clientX,
      clientY: e.clientY,
    });

    const FLAG_SIZE = 45;

    const pt = svgElem.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    // 🔵 1️⃣ FLAG PLACEMENT (Panzoom space)
    const placementPoint = pt.matrixTransform(
      worldMap.getScreenCTM().inverse(),
    );

    // 🟢 2️⃣ COUNTRY HIT TEST (SVG root space)
    const hitTestPoint = pt.matrixTransform(svgElem.getScreenCTM().inverse());

    // ✅ FIND COUNTRY FIRST (FIX)
    const droppedCountryPath = getCountryAtPoint(
      svgElem,
      worldMap,
      hitTestPoint.x,
      hitTestPoint.y,
      hitTestPoint.y,
    );

    // 🎨 CAPTURE STATE BEFORE MODIFICATION
    if (droppedCountryPath) {
      const parentGroup = droppedCountryPath.closest("g");

      // Determine ID for comparison
      const currentId = parentGroup ? parentGroup.id : droppedCountryPath.id;
      const lastParent = lastDroppedCountryPath ? lastDroppedCountryPath.closest("g") : null;
      const lastId = lastParent ? lastParent.id : (lastDroppedCountryPath ? lastDroppedCountryPath.id : null);

      // Only capture if it's a NEW attempt or the previous one was correct (reset)
      // If we are retrying on the same wrong country, keep the ORIGINAL original color.
      if (currentId !== lastId || lastDropWasCorrect) {
        captureCountryFills(droppedCountryPath);
      }
    }

    const offsetX = DRAG_ANCHOR_X - DRAG_IMG_SIZE / 2;
    const offsetY = DRAG_ANCHOR_Y - DRAG_IMG_SIZE / 2;

    const finalX = placementPoint.x - FLAG_SIZE / 2 - offsetX;

    const finalY = placementPoint.y - FLAG_SIZE / 2 - offsetY;

    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject",
    );

    foreignObject.setAttribute("x", finalX);
    foreignObject.setAttribute("y", finalY);
    foreignObject.setAttribute("width", FLAG_SIZE);
    foreignObject.setAttribute("height", FLAG_SIZE);
    foreignObject.setAttribute("class", "placed-flag no-pan");

    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.innerHTML = draggedFlag.querySelector("img").outerHTML;

    foreignObject.appendChild(div);
    worldMap.appendChild(foreignObject);

    // 🔐 STORE LAST DROP STATE (NOW SAFE)
    lastDroppedFlag = draggedFlag;
    lastDroppedCountryPath = droppedCountryPath;
    lastPlacedFlagEl = foreignObject;
    placedFlags.add(foreignObject); // ✅ ADD THIS
    placedFlags.add(foreignObject);
    draggedFlag.style.visibility = "hidden";

    /* ================= VALIDATION ================= */

    if (!droppedCountryPath) {
      console.warn("❌ Dropped on empty area");
      return;
    }

    const flagCountry = draggedFlag.dataset.country;
    const flagAlliance = draggedFlag.dataset.alliance;

    const parentGroup = droppedCountryPath.closest("g");
    const droppedCountryId = parentGroup
      ? parentGroup.id
      : droppedCountryPath.id;

    if (isCountryAlreadySolved(droppedCountryId)) {
      hintText.textContent =
        "This country is already used. Please select another one.";
      setShowMsgState("clue");

      // Remove the wrongly placed flag
      // ✅ Do NOT remove flag if last drop was correct
      // ❌ remove ONLY temporary flag (incorrect one)
      if (!lastDropWasCorrect && lastPlacedFlagEl) {
        lastPlacedFlagEl.remove();
        placedFlags.delete(lastPlacedFlagEl);
        lastPlacedFlagEl = null;
      }

      return;
    }

    // ✅ CORRECT
    // ✅ CORRECT
    const isCorrect =
      flagCountry === droppedCountryId ||
      (
        isMultiCountryQuestion() &&
        selectedYearData.questions[currentQuestionIndex].totalClues
          .some(c => Array.isArray(c.country) ? c.country.includes(droppedCountryId) : c.country === droppedCountryId)
      );

    if (isCorrect) {
      markCountrySolved(droppedCountryId);

      lastDropWasCorrect = true;
      shouldRemoveFlagsOnClose = true;
      // ✅ Remember this country as permanently solved
      if (parentGroup) {
        parentGroup.querySelectorAll("path").forEach(p => solvedCountryPaths.add(p));
      } else {
        solvedCountryPaths.add(droppedCountryPath);
      }

      let fillColor = "#007608"; // default Allied

      if (flagAlliance === "Central Powers") {
        fillColor = "#FF6F00";
      } else if (flagAlliance === "Exited Nation") {
        fillColor = "#ccc";
      } else if (flagAlliance === "Defeated Nations") {
        fillColor = "#eee";
      }


      if (parentGroup) {
        fillGroupPaths(parentGroup, fillColor);
      } else {
        droppedCountryPath.setAttribute("fill", fillColor);
      }

      const currentQuestion = selectedYearData.questions[currentQuestionIndex];
      const year = selectedYearData.year;

      // 🔍 Find the clue matching the placed country (any-order multi-country support)
      const matchedIdx = currentQuestion.totalClues.findIndex(c =>
        Array.isArray(c.country)
          ? c.country.includes(droppedCountryId)
          : c.country === droppedCountryId
      );

      const matchedClueDrop = (matchedIdx !== -1)
        ? currentQuestion.totalClues[matchedIdx]
        : currentQuestion.totalClues[currentClueIndex];

      const clueIdxToMark = (matchedIdx !== -1) ? matchedIdx : currentClueIndex;

      hintText.textContent = matchedClueDrop.feedback;
      setShowMsgState("correct");

      solvedClues[year] ??= {};
      solvedClues[year][currentQuestionIndex] ??= new Set();
      solvedClues[year][currentQuestionIndex].add(clueIdxToMark);
      const flagKey = selectedYearData?.year === 1918 ? '1918-' + flagCountry : flagCountry;
      usedFlags.add(flagKey);
      renderCluesForQuestion(selectedYearData.questions[currentQuestionIndex]);

      if (is1918MultiDefeatedQuestion()) {
        multiSolvedCountries.add(flagCountry);
      }

      const qFinished = is1918MultiDefeatedQuestion()
        ? multiSolvedCountries.size === 4
        : (solvedClues[year]?.[currentQuestionIndex]?.size === currentQuestion.totalClues.length);

      if (qFinished) {
        showActionButton("Proceed", "proceed");
        mustProceedBeforeNext = true;
        renderFlagsForQuestion(currentQuestion);
      } else {
        mustProceedBeforeNext = true;
        // ❌ Removed auto close of correct popup

        if (is1918MultiDefeatedQuestion()) {
          resetDropState();
          renderFlagsForQuestion(currentQuestion);
        } else {
          const year = selectedYearData.year;
          const solvedSet = solvedClues[year][currentQuestionIndex];
          const nextIdx = currentQuestion.totalClues.findIndex((_, i) => !solvedSet.has(i));
          if (nextIdx !== -1) currentClueIndex = nextIdx;

          resetDropState();
          renderFlagsForQuestion(currentQuestion);
          renderCluesForQuestion(currentQuestion);
        }
      }

    } else {
      lastDropWasCorrect = false;

      if (parentGroup) {
        fillGroupPaths(parentGroup, "#FFD5D5");
      } else {
        droppedCountryPath.setAttribute("fill", "#FFD5D5");
      }

      // Hide the placed flag for incorrect placements
      if (lastPlacedFlagEl) {
        try {
          lastPlacedFlagEl.style.display = "none";
        } catch (e) { }
      }

      // ✅ SHOW INCORRECT MESSAGE
      hintText.textContent = "Incorrect! Try again.";
      setShowMsgState("incorrect");

      showActionButton("Try Again", "try-again");
      actionBtn.style.display = "none";

    }
  });

  mapWrapper.addEventListener("dragenter", (e) => e.preventDefault());
  mapWrapper.addEventListener("dragleave", (e) => e.preventDefault());

  /* ================= YEAR CLICK HANDLER ================= */
  document.querySelectorAll('[id^="year-"]').forEach((yearBtn) => {
    yearBtn.style.cursor = "pointer";

    yearBtn.addEventListener("click", () => {
      const year = Number(yearBtn.id.replace("year-", ""));

      lastSelectedYear = year;

      // 🔁 Re-sync map to show context up to selected year
      resetMapStateForNewYear();
      syncMapState(year);

      returningFromOverview = false;
      currentQuestionIndex = 0;
      currentClueIndex = 0;
      hideActionButton();

      if (selectedYearBox) {
        selectedYearBox.textContent = year;
      }

      selectedYearData = eventData.worldWarI.find(
        (item) => item.year === year
      );

      if (!selectedYearData) return;

      updateYearVideo(year);
      showYearVideo();

      document.getElementById("step-1").style.display = "none";
      document.getElementById("step-2").style.display = "block";

      setActiveStep(2);
      updateStep2Content(selectedYearData);
    });


  });

  if (mapHomeImg) {
    mapHomeImg.addEventListener("click", () => {
      // ✅ Reset progress if level not fully completed
      if (selectedYearData && !isYearCompleted()) {
        const year = selectedYearData.year;
        delete solvedClues[year];
        delete solvedCountriesByQuestion[year];
        usedFlags.clear();
        multiSolvedCountries.clear();
        solvedCountryPaths.clear();
      }

      hideYearVideo();
      resetDropState();

      // Hide step-3 and step-4 (overview)
      const step3 = document.getElementById("step-3");
      if (step3) step3.style.display = "none";
      const step4 = document.getElementById("step-4");
      if (step4) step4.style.display = "none";

      // Show step-1
      const step1 = document.getElementById("step-1");
      if (step1) step1.style.display = "block";

      // Update container state
      setActiveStep(1);

      // Safety: hide hint/message box
      showMsg.style.display = "none";
      showMsg.classList.remove("clue", "incorrect", "correct");
    });
  }

  /* ================= STEP-2 CONTENT ================= */
  function updateStep2Content(yearData) {
    const desc = document.querySelector("#step-2 .war-description p");
    if (desc) desc.innerHTML = yearData.description.replace(
      "Predict the alliances that will shape history. Use the clue cards whenever you need help.",
      "Predict the alliances that will shape history. Use the clue cards whenever you need help."
    );


    const question = document.querySelector(".question-text");
    if (question && yearData.questions?.length) {
      question.textContent = yearData.questions[0].question;
    }
  }

  function setActiveStep(stepNumber) {
    if (!container) return;

    container.classList.remove("step-1", "step-2", "step-3");
    container.classList.add(`step-${stepNumber}`);
  }

  /* ================= STEP-2 → STEP-3 ================= */

  if (step2Description) {
    step2Description.style.cursor = "pointer";
    step2Description.addEventListener("click", () => {
      hideYearVideo();

      document.getElementById("step-2").style.display = "none";
      document.getElementById("step-3").style.display = "block";
      setActiveStep(3);

      currentClueIndex = 0;

      const currentQuestion = selectedYearData.questions[0];
      renderFlagsForQuestion(currentQuestion);
      renderCluesForQuestion(currentQuestion);
      updateItextNote(currentQuestion); // ✅ Update itext
      hideActionButton(); // ✅ ADD
    });
  }

  function renderFlagsForQuestion(question) {
    flagList.innerHTML = "";

    question.totalClues.forEach((clue, index) => {
      // 🔁 CASE: multiple countries (1918 defeated nations)
      const countries = Array.isArray(clue.country)
        ? clue.country
        : [clue.country];

      countries.forEach((countryName) => {
        const li = document.createElement("li");

        li.dataset.index = index;
        li.dataset.country = countryName;
        li.dataset.alliance = clue.alliance;

        const img = document.createElement("img");

        if (clue.alliance === "Allied Powers") {
          img.src = "./assets/flag-allied.svg";
        } else if (clue.alliance === "Central Powers") {
          img.src = "./assets/flag-cenral.svg";
        } else if (clue.alliance === "Exited Nation") {
          img.src = "./assets/flag-exited.svg";
        } else if (clue.alliance === "Defeated Nations") {
          img.src = "./assets/flag-defeated.svg";
        }

        img.width = 45;
        img.height = 45;
        li.appendChild(img);

        // ♻️ placeholder restore
        const flagKey = selectedYearData?.year === 1918 ? '1918-' + countryName : countryName;
        if (usedFlags.has(flagKey)) {
          li.dataset.hasPlaceholder = "true";
          li.style.filter = "sepia(1)";
          li.style.opacity = "0.4";
          img.style.filter = "sepia(1)";
          img.style.opacity = "0.4";
        }

        // 👆 TAP MODE
        li.addEventListener("click", () => {
          if (mustProceedBeforeNext) {
            return; // 🚫 silently block interaction
          }

          tappedFlag = li;
          tapModeActive = true;

          document
            .querySelectorAll("#flag-list li")
            .forEach((f) => f.classList.remove("tap-selected"));

          li.classList.add("tap-selected");
        });

        flagList.appendChild(li);
      });
    });

    // ✅ Sync action button if question is already solved
    const qYear = selectedYearData?.year;
    const isFinished = is1918MultiDefeatedQuestion()
      ? multiSolvedCountries.size === 4
      : (solvedClues[qYear]?.[currentQuestionIndex]?.size === question.totalClues.length);

    if (isFinished) {
      showActionButton("Proceed", "proceed");
      mustProceedBeforeNext = true;
    }
  }


  function renderCluesForQuestion(question) {
    clueWrapper.innerHTML = "";

    const year = selectedYearData.year;
    const solvedSet = solvedClues[year]?.[currentQuestionIndex] ?? new Set();

    question.totalClues.forEach((clue, index) => {
      if (clue.clue == null) return;

      const li = document.createElement("li");
      li.classList.add("clue-item");

      // ✅ SHOW CLUE TEXT ON CLICK (restored functionality)
      li.addEventListener("click", () => {
        if (!clue.clue) return;

        // 🔄 Update active state
        document
          .querySelectorAll("#clue-wrapper .clue-item")
          .forEach((item) => item.classList.remove("active"));

        li.classList.add("active");

        // 📝 Show clue text
        hintText.textContent = clue.clue;
        setShowMsgState("clue");
      });

      // ✅ disabled clues stay disabled
      if (solvedSet.has(index)) {
        li.classList.add("disabled");
      }

      // ✅ active clue (only if not solved)
      if (index === currentClueIndex && !solvedSet.has(index)) {
        li.classList.add("active");
      }

      // prevent click if disabled
      if (!li.classList.contains("disabled")) {
        // ✅ TAP SUPPORT (ADDITIVE)
        li.addEventListener("click", () => {
          // ignore inactive flags
          if (!li.classList.contains("active-flag")) return;

          tappedFlag = li;
          tapModeActive = true;

          // visual feedback
          document
            .querySelectorAll("#flag-list li")
            .forEach((f) => f.classList.remove("tap-selected"));

          li.classList.add("tap-selected");

          console.log("👆 Flag tapped:", li.dataset.country);
        });
      }

      clueWrapper.appendChild(li);
    });
  }

  closeBtn.addEventListener("click", () => {
    showMsg.style.display = "none";
    showMsg.classList.remove("clue", "incorrect", "correct");

    if (shouldRemoveFlagsOnClose) {
      worldMap.querySelectorAll(".placed-flag").forEach(flag => {
        flag.remove();
      });

      placedFlags.clear();
      lastPlacedFlagEl = null;

      shouldRemoveFlagsOnClose = false; // ✅ reset
    }
  });

  function getCountryAtPoint(svgElem, worldMap, x, y) {
    const paths = worldMap.querySelectorAll("path");
    const point = svgElem.createSVGPoint();
    point.x = x;
    point.y = y;

    for (const path of paths) {
      const ctm = path.getCTM();
      if (!ctm) continue;

      const localPoint = point.matrixTransform(ctm.inverse());
      if (path.isPointInFill(localPoint)) return path;
    }
    return null;
  }
  // ================= TAP ON COUNTRY =================
  worldMap.querySelectorAll("g[id]").forEach((countryGroup) => {
    countryGroup.style.cursor = "pointer";

    countryGroup.addEventListener("click", (e) => {
      if (mustProceedBeforeNext) {
        return; // 🚫 silently block interaction
      }

      if (!tapModeActive || !tappedFlag) return;

      e.stopPropagation();

      const countryId = countryGroup.id;
      const countryPath = countryGroup.querySelector("path");

      if (!countryPath) return;

      handleFlagCountrySelection(
        tappedFlag,
        countryPath,
        countryId,
        e.clientX,
        e.clientY
      );
    });

  });

  function handleFlagCountrySelection(flagEl,
    countryPath,
    countryId,
    clientX,
    clientY) {

    if (isCountryAlreadySolved(countryId)) {
      hintText.textContent =
        "This country is already used. Please select another one.";
      setShowMsgState("clue");
      return;
    }

    const flagCountry = flagEl.dataset.country;
    const flagAlliance = flagEl.dataset.alliance;



    // 🎨 CAPTURE STATE BEFORE MODIFICATION
    // Determine ID for comparison (passed as countryId)
    const lastParent = lastDroppedCountryPath ? lastDroppedCountryPath.closest("g") : null;
    const lastId = lastParent ? lastParent.id : (lastDroppedCountryPath ? lastDroppedCountryPath.id : null);

    if (countryId !== lastId || lastDropWasCorrect) {
      captureCountryFills(countryPath);
    }

    lastDroppedFlag = flagEl;
    lastDroppedCountryPath = countryPath;
    placeFlagAtPoint(flagEl, clientX, clientY);

    const isCorrect =
      flagCountry === countryId ||
      (
        isMultiCountryQuestion() &&
        selectedYearData.questions[currentQuestionIndex].totalClues
          .some(c => Array.isArray(c.country) ? c.country.includes(countryId) : c.country === countryId)
      );

    if (isCorrect) {
      markCountrySolved(countryId ?? droppedCountryId);

      lastDropWasCorrect = true;
      shouldRemoveFlagsOnClose = true;
      let fillColor = "#007608"; // default Allied

      if (flagAlliance === "Central Powers") {
        fillColor = "#FF6F00";
      } else if (flagAlliance === "Exited Nation") {
        fillColor = "#ccc";
      } else if (flagAlliance === "Defeated Nations") {
        fillColor = "#eee";
      }


      const parentGroup = countryPath.closest("g");
      if (parentGroup) {
        fillGroupPaths(parentGroup, fillColor);
      } else {
        countryPath.setAttribute("fill", fillColor);
      }

      const currentQuestion = selectedYearData.questions[currentQuestionIndex];

      // 🔍 Find the clue that matches the placed country (handles multi-country questions where any order is allowed)
      const matchedIdx = currentQuestion.totalClues.findIndex(c =>
        Array.isArray(c.country)
          ? c.country.includes(countryId)
          : c.country === countryId
      );

      const matchedClue = (matchedIdx !== -1)
        ? currentQuestion.totalClues[matchedIdx]
        : currentQuestion.totalClues[currentClueIndex];

      const clueIdxToMark = (matchedIdx !== -1) ? matchedIdx : currentClueIndex;

      hintText.textContent = matchedClue.feedback;
      setShowMsgState("correct");

      const year = selectedYearData.year;
      solvedClues[year] ??= {};
      solvedClues[year][currentQuestionIndex] ??= new Set();
      solvedClues[year][currentQuestionIndex].add(clueIdxToMark);
      const flagKey = selectedYearData?.year === 1918 ? '1918-' + flagCountry : flagCountry;
      usedFlags.add(flagKey);
      renderCluesForQuestion(currentQuestion);
      if (is1918MultiDefeatedQuestion()) {
        multiSolvedCountries.add(flagCountry);
      }

      const qFinished = is1918MultiDefeatedQuestion()
        ? multiSolvedCountries.size === 4
        : (solvedClues[year]?.[currentQuestionIndex]?.size === currentQuestion.totalClues.length);

      if (qFinished) {
        showActionButton("Proceed", "proceed");
        mustProceedBeforeNext = true;
        renderFlagsForQuestion(currentQuestion);
      } else {
        // ✅ Auto-advance intermediate clues after delay
        mustProceedBeforeNext = true;
        // ❌ Removed auto close of correct popup

        if (is1918MultiDefeatedQuestion()) {
          resetDropState();
          renderFlagsForQuestion(currentQuestion);
        } else {
          const year = selectedYearData.year;
          const solvedSet = solvedClues[year][currentQuestionIndex];
          const nextIdx = currentQuestion.totalClues.findIndex((_, i) => !solvedSet.has(i));
          if (nextIdx !== -1) currentClueIndex = nextIdx;

          resetDropState();
          renderFlagsForQuestion(currentQuestion);
          renderCluesForQuestion(currentQuestion);
        }
      }

    } else {
      lastDropWasCorrect = false;

      const parentGroup = countryPath.closest("g");
      if (parentGroup) {
        fillGroupPaths(parentGroup, "#FFD5D5");
      } else {
        countryPath.setAttribute("fill", "#FFD5D5");
      }

      // Hide the placed flag for incorrect tap selections
      if (lastPlacedFlagEl) {
        try {
          lastPlacedFlagEl.style.display = "none";
        } catch (e) { }
      }

      hintText.textContent = "Incorrect! Try again.";
      setShowMsgState("incorrect");
      showActionButton("Try Again", "try-again");
      actionBtn.style.display = "none";
    }
    keepFlagPlaceholder(flagEl);

    // 🔄 Reset tap mode
    tapModeActive = false;
    tappedFlag.classList.remove("tap-selected");
    tappedFlag = null;
  }

  function showActionButton(text, className) {
    actionBtn.textContent = text;
    actionBtn.classList.remove("try-again", "proceed", "active");
    actionBtn.classList.add(className);
    actionBtn.style.display = "block";

    // ✅ Add active class for 2 seconds ONLY when text is "Proceed"
    if (text === "Proceed") {
      actionBtn.classList.add("active");

      setTimeout(() => {
        actionBtn.classList.remove("active");
      }, 2000);
    }
  }

  actionBtn.addEventListener("click", () => {
    // 🔁 Special case: return to overview
    if (returningFromOverview && actionBtn.classList.contains("proceed")) {
      returningFromOverview = false;

      // Hide step-3
      document.getElementById("step-3").style.display = "none";

      // Show step-4 again
      document.getElementById("step-4").style.display = "block";

      setActiveStep(4);

      return; // ⛔ stop normal proceed logic
    }

    showMsg.style.display = "none";
    showMsg.classList.remove("clue", "incorrect", "correct");

    const currentQuestion = selectedYearData.questions[currentQuestionIndex];

    // 🔁 TRY AGAIN
    if (actionBtn.classList.contains("try-again")) {
      if (lastDroppedFlag) {
        removeFlagPlaceholder(lastDroppedFlag);
      }

      resetDropState();
      renderFlagsForQuestion(currentQuestion);
    }

    // ➡️ PROCEED
    if (actionBtn.classList.contains("proceed")) {
      // ✅ ADD THIS BLOCK
      if (shouldRemoveFlagsOnClose) {
        worldMap.querySelectorAll(".placed-flag").forEach(flag => {
          flag.remove();
        });

        placedFlags.clear();
        lastPlacedFlagEl = null;
        shouldRemoveFlagsOnClose = false;
      }

      mustProceedBeforeNext = false;

      // 🔁 SPECIAL: 1918 defeated nations (must solve all 4)
      if (is1918MultiDefeatedQuestion()) {
        if (multiSolvedCountries.size < 4) {
          // Stay on same question, just reset for next flag
          resetDropState();
          renderFlagsForQuestion(currentQuestion);
          hideActionButton();
          return;
        } else {
          // All 4 solved → allow normal flow
          multiSolvedCountries.clear();
        }
      }


      const year = selectedYearData.year;
      const solvedSet = solvedClues[year][currentQuestionIndex] || new Set();

      const nextIdx = currentQuestion.totalClues.findIndex(
        (_, i) => !solvedSet.has(i)
      );

      if (nextIdx !== -1) {
        currentClueIndex = nextIdx;
      } else {
        currentClueIndex = currentQuestion.totalClues.length; // mark finished
      }

      // ▶ Next clue
      if (currentClueIndex < currentQuestion.totalClues.length) {
        resetDropState();
        renderFlagsForQuestion(currentQuestion);
        renderCluesForQuestion(currentQuestion);
      }
      // ▶ Next question
      else {
        currentQuestionIndex++;
        currentClueIndex = 0;

        if (currentQuestionIndex < selectedYearData.questions.length) {
          const nextQuestion = selectedYearData.questions[currentQuestionIndex];

          resetDropState();
          document.querySelector(".question-text").textContent =
            nextQuestion.question;

          updateItextNote(nextQuestion); // ✅ Update itext

          renderFlagsForQuestion(nextQuestion);
          renderCluesForQuestion(nextQuestion);
        } else {
          if (isYearCompleted()) {
            showStep4Overview();

            // ✅ Show only when ALL years completed
            if (replyBtn && areAllYearsCompleted()) {
              replyBtn.style.display = "block";
            }
          }
        }
      }
    }

    actionBtn.style.display = "none";
  });

  function resetDropState() {
    if (!is1918MultiDefeatedQuestion()) {
      multiSolvedCountries.clear();
    }

    tapModeActive = false;
    tappedFlag = null;

    document
      .querySelectorAll("#flag-list li")
      .forEach((f) => f.classList.remove("tap-selected"));

    // ✅ Do NOT remove flag if last drop was correct
    // ❌ remove ONLY temporary flag (incorrect one)
    if (!lastDropWasCorrect && lastPlacedFlagEl) {
      lastPlacedFlagEl.remove();
      placedFlags.delete(lastPlacedFlagEl);
      lastPlacedFlagEl = null;
    }

    // ❌ ONLY reset country fill if last drop was WRONG
    // ❌ ONLY reset country fill if last drop was WRONG
    if (lastDroppedCountryPath && !lastDropWasCorrect) {
      restoreCountryFills();
    }


    lastDroppedCountryPath = null;
    lastDroppedFlag = null;
    lastDropWasCorrect = false; // reset for next interaction
    mustProceedBeforeNext = false; // ✅ RESET BLOCKER
    hideActionButton(); // optional safety
  }

  function fillGroupPaths(groupEl, color) {
    if (!groupEl) return;
    const paths = groupEl.querySelectorAll("path");
    paths.forEach((p) => p.setAttribute("fill", color));
  }

  function hideActionButton() {
    actionBtn.style.display = "none";
    actionBtn.classList.remove("try-again", "proceed");
  }
  function setShowMsgState(stateClass) {
    if (msgTimeout) {
      clearTimeout(msgTimeout);
      msgTimeout = null;
    }

    showMsg.classList.remove("clue", "incorrect", "correct");
    showMsg.classList.add(stateClass);
    showMsg.style.display = "block";

    // ✅ NEW: Hide close button ONLY when incorrect
    if (stateClass === "incorrect") {
      closeBtn.style.display = "none";

      // ✅ Hide message after 2 seconds and reset incorrect state
      msgTimeout = setTimeout(() => {
        showMsg.style.display = "none";
        showMsg.classList.remove("incorrect");
        msgTimeout = null;

        // 🎨 Restore #FFD5D5 fill on the incorrect country
        if (lastDroppedCountryPath && !lastDropWasCorrect) {
          restoreCountryFills();
        }

        // 🚩 Remove placed flag overlay from the map
        // ✅ Do NOT remove flag if last drop was correct
        // ❌ remove ONLY temporary flag (incorrect one)
        if (!lastDropWasCorrect && lastPlacedFlagEl) {
          lastPlacedFlagEl.remove();
          placedFlags.delete(lastPlacedFlagEl);
          lastPlacedFlagEl = null;
        }

        // 🔄 Restore flag in the flag-list so it can be re-selected
        if (lastDroppedFlag) {
          removeFlagPlaceholder(lastDroppedFlag);
          lastDroppedFlag = null;
        }

        // 🔄 Reset drop tracking
        lastDroppedCountryPath = null;
        lastDropWasCorrect = false;

        // ❌ Hide the "Try Again" button – not needed anymore
        hideActionButton();
      }, 2000);
    } else {
      closeBtn.style.display = "block";
    }
  }


  function isYearCompleted() {
    const year = selectedYearData.year;
    const questions = selectedYearData.questions;

    if (!solvedClues[year]) return false;

    return questions.every((question, qIndex) => {
      const solvedSet = solvedClues[year][qIndex];
      return solvedSet && solvedSet.size === question.totalClues.length;
    });
  }

  function showStep4Overview() {
    // Hide step-3
    document.getElementById("step-3").style.display = "none";

    // Show step-4
    const step4 = document.getElementById("step-4");
    step4.style.display = "block";

    const overview = selectedYearData.overview;

    // ✅ Title & Description
    document.getElementById("overview-title").textContent = overview.title;
    document.getElementById("overview-description").textContent =
      overview.overviewDescription;

    // ✅ Central Powers list
    const centralList = document.getElementById("central-power-list");
    centralList.innerHTML = "";

    overview.centralPowers.forEach((country) => {
      const li = document.createElement("li");
      li.textContent = country;
      centralList.appendChild(li);
    });

    // ✅ Allied Powers list
    const alliedList = document.getElementById("allied-power-list");
    alliedList.innerHTML = "";

    overview.alliedPowers.forEach((country) => {
      const li = document.createElement("li");
      li.textContent = country;
      alliedList.appendChild(li);
    });
    if (is1918MultiDefeatedQuestion()) {
      multiSolvedCountries.add(flagCountry);

      if (multiSolvedCountries.size < 4) {
        showActionButton("Next Flag", "proceed");
      } else {
        showActionButton("Proceed", "proceed");
      }
    } else {
      showActionButton("Proceed", "proceed");
    }

  }

  function updateItextNote(question) {
    const itextNote = document.getElementById("itext-note");
    if (itextNote && question.itext) {
      itextNote.innerHTML = question.itext;
    }
  }

  function keepFlagPlaceholder(flagEl) {
    const key = selectedYearData?.year === 1918 ? '1918-' + flagEl.dataset.country : flagEl.dataset.country;

    if (usedFlags.has(key)) return;

    usedFlags.add(key);
    flagEl.dataset.hasPlaceholder = "true";

    // ✅ Apply style to BOTH li AND img (fix for last flag case)
    flagEl.style.filter = "sepia(1)";
    flagEl.style.opacity = "0.4";

    const img = flagEl.querySelector("img");
    if (img) {
      img.style.filter = "sepia(1)";
      img.style.opacity = "0.4";
    }
  }

  function removeFlagPlaceholder(flagEl) {
    const key = selectedYearData?.year === 1918 ? '1918-' + flagEl.dataset.country : flagEl.dataset.country;

    usedFlags.delete(key);
    delete flagEl.dataset.hasPlaceholder;

    flagEl.style.filter = "";
    flagEl.style.opacity = "";

    const img = flagEl.querySelector("img");
    if (img) {
      img.style.filter = "";
      img.style.opacity = "";
    }
  }

  // 🔙 Back to map (step-3)
  if (backOverviewBtn) {
    backOverviewBtn.addEventListener("click", () => {
      // Hide step-4
      document.getElementById("step-4").style.display = "none";

      // Show step-3
      document.getElementById("step-3").style.display = "block";

      setActiveStep(3);

      // 🔑 Mark special return state
      returningFromOverview = true;

      // ✅ Force action button to Proceed & visible
      if (is1918MultiDefeatedQuestion()) {
        multiSolvedCountries.add(flagCountry);

        if (multiSolvedCountries.size < 4) {
          showActionButton("Next Flag", "proceed");
        } else {
          showActionButton("Proceed", "proceed");
        }
      } else {
        showActionButton("Proceed", "proceed");
      }

    });
  }

  // 🕒 Back to timeline (step-1)
  if (goToTimelineBtn) {
    goToTimelineBtn.addEventListener("click", () => {
      // ✅ Mark year as completed on timeline
      if (selectedYearData && isYearCompleted()) {
        const yearId = `year-${selectedYearData.year}`;
        const yearEl = document.getElementById(yearId);

        if (yearEl) {
          yearEl.classList.add("completed");
        }
      }

      // Hide step-4
      document.getElementById("step-4").style.display = "none";

      // Show step-1
      document.getElementById("step-1").style.display = "block";

      // Restore container state
      setActiveStep(1);

      // Safety: hide any open hint
      showMsg.style.display = "none";
    });
  }

  function placeFlagAtCountry(countryPath, flagEl) {
    const FLAG_SIZE = 25;

    const bbox = countryPath.getBBox();

    // 🎯 Center of the country
    const x = bbox.x + bbox.width / 2 - FLAG_SIZE / 2;
    const y = bbox.y + bbox.height / 2 - FLAG_SIZE / 2;

    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );

    foreignObject.setAttribute("x", x);
    foreignObject.setAttribute("y", y);
    foreignObject.setAttribute("width", FLAG_SIZE);
    foreignObject.setAttribute("height", FLAG_SIZE);
    foreignObject.setAttribute("class", "placed-flag no-pan");

    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.innerHTML = flagEl.querySelector("img").outerHTML;

    foreignObject.appendChild(div);
    worldMap.appendChild(foreignObject);

    // 🔐 Track placed flag (same as drag)
    lastPlacedFlagEl = foreignObject;
    placedFlags.add(foreignObject); // ✅ ADD THIS
  }

  const originalCountryFills = new Map();

  function cacheOriginalCountryFills() {
    worldMap.querySelectorAll("path").forEach(path => {
      originalCountryFills.set(path, path.getAttribute("fill"));
    });
  }

  // Call once on load
  cacheOriginalCountryFills();

  function placeFlagAtPoint(flagEl, clientX, clientY) {
    const FLAG_SIZE = 25;

    // Convert screen → SVG coordinates
    const pt = svgElem.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const svgPoint = pt.matrixTransform(
      worldMap.getScreenCTM().inverse()
    );

    const x = svgPoint.x - FLAG_SIZE / 2 + 8;
    const y = svgPoint.y - FLAG_SIZE / 2 - 10;

    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );

    foreignObject.setAttribute("x", x);
    foreignObject.setAttribute("y", y);
    foreignObject.setAttribute("width", FLAG_SIZE);
    foreignObject.setAttribute("height", FLAG_SIZE);
    foreignObject.setAttribute("class", "placed-flag no-pan");

    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.innerHTML = flagEl.querySelector("img").outerHTML;

    foreignObject.appendChild(div);
    worldMap.appendChild(foreignObject);

    // Track for reset / try again
    lastPlacedFlagEl = foreignObject;
    placedFlags.add(foreignObject); // ✅ ADD THIS
  }

  // 🎨 HELPER: Capture original fill
  function captureCountryFills(targetEl) {
    if (!targetEl) return;
    lastDroppedCountryFills.clear();

    const parent = targetEl.closest("g");
    const elements = parent ? parent.querySelectorAll("path") : [targetEl];

    elements.forEach(el => {
      lastDroppedCountryFills.set(el, el.getAttribute("fill"));
    });
  }

  // 🎨 HELPER: Restore original fill
  function restoreCountryFills() {
    lastDroppedCountryFills.forEach((fill, el) => {
      // Don't revert if it became solved in the meantime (safety check)
      if (solvedCountryPaths.has(el)) return;

      if (fill === null) {
        el.removeAttribute("fill");
      } else {
        el.setAttribute("fill", fill);
      }
    });
    lastDroppedCountryFills.clear();
  }

  function isMultiCountry1918Question() {
    return (
      selectedYearData?.year === 1918 &&
      selectedYearData.questions[currentQuestionIndex]?.id === 2
    );
  }
  function is1918MultiDefeatedQuestion() {
    return (
      selectedYearData?.year === 1918 &&
      selectedYearData.questions[currentQuestionIndex]?.id === 2
    );
  }

  function resetMapStateForNewYear() {
    // 🧹 Remove all placed flags from previous flow
    worldMap.querySelectorAll(".placed-flag").forEach(el => el.remove());

    lastPlacedFlagEl = null;

    // 🔍 Reset zoom & pan to default
    panzoom.reset();

    // Safety: hide any open message
    showMsg.style.display = "none";
  }

  // ✅ NEW: Restore map colors & flags based on ALL progress up to targetYear
  function syncMapState(targetYear) {
    if (!eventData) return;

    restoreAllCountryFills();

    // Clear current year special tracking (will be repopulated below)
    multiSolvedCountries.clear();

    for (const yearStr in solvedClues) {
      const year = Number(yearStr);
      if (year > targetYear) continue; // skip future progress

      const yearData = eventData.worldWarI.find(y => y.year === year);
      if (!yearData) continue;

      for (const qIdx in solvedClues[year]) {
        const solvedSet = solvedClues[year][qIdx];
        const question = yearData.questions[qIdx];

        solvedSet.forEach(clueIdx => {
          const clue = question.totalClues[clueIdx];
          const countries = Array.isArray(clue.country) ? clue.country : [clue.country];

          countries.forEach(cid => {
            const groupEl = document.getElementById(cid);
            if (!groupEl) return;

            // 🎨 Re-populate 1918 special tracking if applicable
            if (year === 1918 && qIdx == 1) { // 1918 Q2
              multiSolvedCountries.add(cid);
            }

            // 🎨 Re-apply fill
            let fillColor = "#007608"; // default Allied
            if (clue.alliance === "Central Powers") fillColor = "#FF6F00";
            else if (clue.alliance === "Exited Nation") fillColor = "#ccc";
            else if (clue.alliance === "Defeated Nations") fillColor = "#eee";

            const paths = groupEl.querySelectorAll("path");
            if (paths.length > 0) {
              paths.forEach(p => p.setAttribute("fill", fillColor));
            } else if (groupEl.tagName === "path") {
              groupEl.setAttribute("fill", fillColor);
            }

            // 🚩 Re-place flag
            rePlaceFlagForCountry(cid, clue.alliance);
          });
        });
      }
    }

    // ✅ Sync action button if currently viewed question is already finished
    const currentQ = selectedYearData?.questions[currentQuestionIndex];
    if (currentQ) {
      const isFinished = is1918MultiDefeatedQuestion()
        ? multiSolvedCountries.size === 4
        : (solvedClues[targetYear]?.[currentQuestionIndex]?.size === currentQ.totalClues.length);

      if (isFinished) {
        showActionButton("Proceed", "proceed");
        mustProceedBeforeNext = true;
      }
    }
  }

  function rePlaceFlagForCountry(countryId, alliance) {
    const targetGroup = document.getElementById(countryId);
    if (!targetGroup) return;

    const countryPath = targetGroup.querySelector("path") || targetGroup;
    const FLAG_SIZE = 25;
    const bbox = countryPath.getBBox();

    const x = bbox.x + bbox.width / 2 - FLAG_SIZE / 2;
    const y = bbox.y + bbox.height / 2 - FLAG_SIZE / 2;

    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreignObject.setAttribute("x", x);
    foreignObject.setAttribute("y", y);
    foreignObject.setAttribute("width", FLAG_SIZE);
    foreignObject.setAttribute("height", FLAG_SIZE);
    foreignObject.setAttribute("class", "placed-flag no-pan");

    let imgSrc = "./assets/flag-allied.svg";
    if (alliance === "Central Powers") imgSrc = "./assets/flag-cenral.svg";
    else if (alliance === "Exited Nation") imgSrc = "./assets/flag-exited.svg";
    else if (alliance === "Defeated Nations") imgSrc = "./assets/flag-defeated.svg";

    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.innerHTML = `<img src="${imgSrc}" width="20" height="15" style="object-fit: contain;">`;

    foreignObject.appendChild(div);
    worldMap.appendChild(foreignObject);
  }

  function updateYearVideo(year) {
    if (!videoWrapper || !videoEl || !videoSource) return;

    const videoPath = `./assets/videos/year-${year}.mp4`;

    // Update source
    videoSource.src = videoPath;

    // Reload & play
    videoEl.load();
    videoEl.play().catch(() => { }); // autoplay safety

    // Show video
    videoWrapper.style.display = "block";
  }

  function hideYearVideo() {
    if (videoWrapper) {
      videoWrapper.style.display = "none";
    }
  }
  function showYearVideo() {
    if (!videoWrapper) return;
    videoWrapper.style.display = "block";
  }

  function hideYearVideo() {
    if (!videoWrapper) return;
    videoWrapper.style.display = "none";
  }

  function is1914MultiAlliedQuestion() {
    return (
      selectedYearData?.year === 1914 &&
      selectedYearData.questions[currentQuestionIndex]?.id === 2
    );
  }

  // ✅ Generic helper: true when the current question allows any valid country in any order
  // Covers: 1914 Q2 (5 Allied), 1916 Q1 (Portugal+Romania), 1917 Q1 (USA+Greece), 1918 Q2 (4 defeated)
  function isMultiCountryQuestion() {
    const q = selectedYearData?.questions[currentQuestionIndex];
    if (!q) return false;
    // Multiple separate clues (each with its own country) → free-order allowed
    if (q.totalClues.length > 1) return true;
    // Single clue but country is an array (e.g. 1918 Q2 defeated nations)
    if (q.totalClues.length === 1 && Array.isArray(q.totalClues[0].country)) return true;
    return false;
  }

  function markCurrentClueSolved() {
    const year = selectedYearData.year;

    solvedClues[year] ??= {};
    solvedClues[year][currentQuestionIndex] ??= new Set();

    solvedClues[year][currentQuestionIndex].add(currentClueIndex);
  }
  function isCountryAlreadySolved(countryId) {
    const year = selectedYearData?.year;
    const qIndex = currentQuestionIndex;

    return solvedCountriesByQuestion?.[year]?.[qIndex]?.has(countryId);
  }

  function markCountrySolved(countryId) {
    const year = selectedYearData.year;
    const qIndex = currentQuestionIndex;

    solvedCountriesByQuestion[year] ??= {};
    solvedCountriesByQuestion[year][qIndex] ??= new Set();

    solvedCountriesByQuestion[year][qIndex].add(countryId);
  }
  function isSequentialYearNavigation(nextYear) {
    if (lastSequentialYear === null) return true; // first selection
    return nextYear === lastSequentialYear + 1;
  }
  function resetAllProgressState() {
    // 🔁 Logical state reset
    solvedClues = {};
    currentQuestionIndex = 0;
    currentClueIndex = 0;

    for (const key in solvedCountriesByQuestion) {
      delete solvedCountriesByQuestion[key];
    }

    solvedCountryPaths.clear();
    usedFlags.clear();
    multiSolvedCountries.clear();

    mustProceedBeforeNext = false;
    lastDropWasCorrect = false;
    returningFromOverview = false;

    // 🧹 UI & Map reset
    resetMapStateForNewYear();
    restoreAllCountryFills(); // ✅ THIS IS THE MISSING PIECE
    hideActionButton();

    showMsg.style.display = "none";
  }



  function isSequentialYear(prevYear, nextYear) {
    if (prevYear == null) return true; // first selection
    return nextYear === prevYear + 1;
  }
  function restoreAllCountryFills() {
    originalCountryFills.forEach((fill, path) => {
      if (fill === null) {
        path.removeAttribute("fill");
      } else {
        path.setAttribute("fill", fill);
      }
    });
  }

  if (replyBtn) {
    replyBtn.addEventListener("click", () => {

      // ✅ Remove completed class from all years
      document.querySelectorAll(".timeline-year").forEach(el => {
        el.classList.remove("completed");
      });

      // ✅ Reset all game state
      resetAllProgressState();

      // ✅ Hide reply button again
      replyBtn.style.display = "none";

      // ✅ Go back to timeline
      document.getElementById("step-4").style.display = "none";
      document.getElementById("step-1").style.display = "block";

      setActiveStep(1);
    });
  }

  function areAllYearsCompleted() {
    if (!eventData) return false;

    return eventData.worldWarI.every(yearData => {
      const year = yearData.year;

      if (!solvedClues[year]) return false;

      return yearData.questions.every((q, qIndex) => {
        const solvedSet = solvedClues[year]?.[qIndex];
        return solvedSet && solvedSet.size === q.totalClues.length;
      });
    });
  }
});
