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

  let selectedClueIndex = null; // which clue is active
  let selectedCountryId = null; // country name from clue

  let lastDroppedFlag = null;
  let lastDroppedCountryPath = null;
  let lastPlacedFlagEl = null;

  let currentClueIndex = 0;
  let currentQuestionIndex = 0;

  let solvedClues = {};
  let lastDropWasCorrect = false;
  const usedFlags = new Set();

  const actionBtn = document.getElementById("action-btn");
  let returningFromOverview = false;

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
    );

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

    // ✅ CORRECT
    // ✅ CORRECT
    if (flagCountry === droppedCountryId) {
      lastDropWasCorrect = true;

        // ✅ Remember this country as permanently solved
  const parentGroup = countryPath.closest("g");
  if (parentGroup) {
    parentGroup.querySelectorAll("path").forEach(p => solvedCountryPaths.add(p));
  } else {
    solvedCountryPaths.add(countryPath);
  }

      const fillColor =
        flagAlliance === "Central Powers" ? "#FF6F00" : "#007608";

      if (parentGroup) {
        fillGroupPaths(parentGroup, fillColor);
      } else {
        droppedCountryPath.setAttribute("fill", fillColor);
      }

      const currentQuestion = selectedYearData.questions[currentQuestionIndex];
      const currentClue = currentQuestion.totalClues[currentClueIndex];

      hintText.textContent = currentClue.feedback;
      setShowMsgState("correct");

      const year = selectedYearData.year;
      solvedClues[year] ??= {};
      solvedClues[year][currentQuestionIndex] ??= new Set();
      solvedClues[year][currentQuestionIndex].add(currentClueIndex);

      renderCluesForQuestion(selectedYearData.questions[currentQuestionIndex]);

      showActionButton("Proceed", "proceed");
    } else {
      lastDropWasCorrect = false;

      if (parentGroup) {
        fillGroupPaths(parentGroup, "#FFD5D5");
      } else {
        droppedCountryPath.setAttribute("fill", "#FFD5D5");
      }

      // ✅ SHOW INCORRECT MESSAGE
      hintText.textContent = "Incorrect! Try again.";
      setShowMsgState("incorrect");

      showActionButton("Try Again", "try-again");
    }
  });

  mapWrapper.addEventListener("dragenter", (e) => e.preventDefault());
  mapWrapper.addEventListener("dragleave", (e) => e.preventDefault());

  /* ================= YEAR CLICK HANDLER ================= */
  document.querySelectorAll('[id^="year-"]').forEach((yearBtn) => {
    yearBtn.style.cursor = "pointer";

    yearBtn.addEventListener("click", () => {
      // 🔁 Reset overview return state for new year
      returningFromOverview = false;
      currentQuestionIndex = 0;
      currentClueIndex = 0;
      hideActionButton();
      

      const year = Number(yearBtn.id.replace("year-", ""));
      if (selectedYearBox) {
        selectedYearBox.textContent = year;
      }

      selectedYearData = eventData.worldWarI.find((item) => item.year === year);

      if (!selectedYearData) return;

      document.getElementById("step-1").style.display = "none";
      document.getElementById("step-2").style.display = "block";

      setActiveStep(2);
      updateStep2Content(selectedYearData);
    });
  });

  /* ================= STEP-2 CONTENT ================= */
  function updateStep2Content(yearData) {
    const desc = document.querySelector("#step-2 .war-description p");
    if (desc) desc.textContent = yearData.description;

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
      document.getElementById("step-2").style.display = "none";
      document.getElementById("step-3").style.display = "block";
      setActiveStep(3);

      currentClueIndex = 0;

      const currentQuestion = selectedYearData.questions[0];
      renderFlagsForQuestion(currentQuestion);
      renderCluesForQuestion(currentQuestion);
      hideActionButton(); // ✅ ADD
    });
  }

  function renderFlagsForQuestion(question) {
    flagList.innerHTML = "";

    question.totalClues.forEach((clue, index) => {
      const li = document.createElement("li");

      li.dataset.index = index;
      li.dataset.country = clue.country;
      li.dataset.alliance = clue.alliance;

      const img = document.createElement("img");
      if (clue.alliance === "Allied Powers") {
        img.src = "./assets/flag-allied.svg";
      } else if (clue.alliance === "Central Powers") {
        img.src = "./assets/flag-cenral.svg";
      } else {
        img.src = "./assets/flag.svg"; // fallback (keeps existing behavior)
      }
      img.width = 45;
      img.height = 45;

      li.appendChild(img);

      // ✅ RESTORE PLACEHOLDER STATE
      if (usedFlags.has(clue.country)) {
        li.dataset.hasPlaceholder = "true";
        li.style.filter = "sepia(1)";
        li.style.opacity = "0.4";
      }

      li.addEventListener("click", () => {
        tappedFlag = li;
        tapModeActive = true;

        document
          .querySelectorAll("#flag-list li")
          .forEach((f) => f.classList.remove("tap-selected"));

        li.classList.add("tap-selected");
      });

      flagList.appendChild(li);
    });
  }

  function renderCluesForQuestion(question) {
    clueWrapper.innerHTML = "";

    const year = selectedYearData.year;
    const solvedSet = solvedClues[year]?.[currentQuestionIndex] ?? new Set();

    question.totalClues.forEach((clue, index) => {
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

  function handleFlagCountrySelection(  flagEl,
  countryPath,
  countryId,
  clientX,
  clientY) {
    const flagCountry = flagEl.dataset.country;
    const flagAlliance = flagEl.dataset.alliance;

    lastDroppedFlag = flagEl;
    lastDroppedCountryPath = countryPath;
placeFlagAtPoint(flagEl, clientX, clientY);

    if (flagCountry === countryId) {
      lastDropWasCorrect = true;

      const fillColor =
        flagAlliance === "Central Powers" ? "#FF6F00" : "#007608";

      const parentGroup = countryPath.closest("g");
      if (parentGroup) {
        fillGroupPaths(parentGroup, fillColor);
      } else {
        countryPath.setAttribute("fill", fillColor);
      }

      const currentQuestion = selectedYearData.questions[currentQuestionIndex];
      const currentClue = currentQuestion.totalClues[currentClueIndex];

      hintText.textContent = currentClue.feedback;
      setShowMsgState("correct");

      const year = selectedYearData.year;
      solvedClues[year] ??= {};
      solvedClues[year][currentQuestionIndex] ??= new Set();
      solvedClues[year][currentQuestionIndex].add(currentClueIndex);

      renderCluesForQuestion(currentQuestion);
      showActionButton("Proceed", "proceed");
    } else {
      lastDropWasCorrect = false;

      const parentGroup = countryPath.closest("g");
      if (parentGroup) {
        fillGroupPaths(parentGroup, "#FFD5D5");
      } else {
        countryPath.setAttribute("fill", "#FFD5D5");
      }

      hintText.textContent = "Incorrect! Try again.";
      setShowMsgState("incorrect");
      showActionButton("Try Again", "try-again");
    }
    keepFlagPlaceholder(flagEl);

    // 🔄 Reset tap mode
    tapModeActive = false;
    tappedFlag.classList.remove("tap-selected");
    tappedFlag = null;
  }

  function showActionButton(text, className) {
    actionBtn.textContent = text;
    actionBtn.classList.remove("try-again", "proceed");
    actionBtn.classList.add(className);
    actionBtn.style.display = "block";
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
      currentClueIndex++;

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

          renderFlagsForQuestion(nextQuestion);
          renderCluesForQuestion(nextQuestion);
        } else {
          if (isYearCompleted()) {
            showStep4Overview();
          }
        }
      }
    }

    actionBtn.style.display = "none";
  });

  function resetDropState() {
    tapModeActive = false;
    tappedFlag = null;

    document
      .querySelectorAll("#flag-list li")
      .forEach((f) => f.classList.remove("tap-selected"));

    if (lastPlacedFlagEl) {
      lastPlacedFlagEl.remove();
      lastPlacedFlagEl = null;
    }

    // ❌ ONLY reset country fill if last drop was WRONG
    if (lastDroppedCountryPath && !lastDropWasCorrect) {
      const parentGroup = lastDroppedCountryPath.closest("g");

      if (parentGroup) {
        parentGroup.querySelectorAll("path").forEach((p) => {
          if (!solvedCountryPaths.has(p)) {
            p.setAttribute("fill", "#fff");
          }
        });
      } else {
        if (!solvedCountryPaths.has(lastDroppedCountryPath)) {
          lastDroppedCountryPath.setAttribute("fill", "white");
        }
      }
    }


    lastDroppedCountryPath = null;
    lastDroppedFlag = null;
    lastDropWasCorrect = false; // reset for next interaction
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
    showMsg.classList.remove("clue", "incorrect", "correct");
    showMsg.classList.add(stateClass);
    showMsg.style.display = "block";
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
      showActionButton("Proceed", "proceed");
  }

  function keepFlagPlaceholder(flagEl) {
    const key = flagEl.dataset.country;

    if (usedFlags.has(key)) return;

    usedFlags.add(key);
    flagEl.dataset.hasPlaceholder = "true";
    flagEl.style.filter = "sepia(1)";
    flagEl.style.opacity = "0.4";
  }

  function removeFlagPlaceholder(flagEl) {
    const key = flagEl.dataset.country;

    usedFlags.delete(key);
    delete flagEl.dataset.hasPlaceholder;

    flagEl.style.filter = "";
    flagEl.style.opacity = "";
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
      showActionButton("Proceed", "proceed");
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
}

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
}


});
