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

  let selectedClueIndex = null; // which clue is active
  let selectedCountryId = null; // country name from clue

  let lastDroppedFlag = null;
  let lastDroppedCountryPath = null;
  let lastPlacedFlagEl = null;

  let currentClueIndex = 0;
  let currentQuestionIndex = 0;


  const actionBtn = document.getElementById("action-btn");

  try {
    const response = await fetch("eventData.json");
    eventData = await response.json();
    console.log("📦 Event data loaded successfully");
  } catch (err) {
    console.error("❌ Failed to load eventData.json", err);
    return;
  }

  /* ================= MAP ELEMENTS ================= */
  const svgElem = document.querySelector(".map-wrapper svg");
  const worldMap = document.getElementById("world-map-wrapper");
  const mapWrapper = document.querySelector(".map-wrapper");

  const austriaHungary = document.getElementById("Austria-Hungary");

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

  /* ================== DRAG START ================== */
  function makeFlagDraggable(flag) {
    flag.setAttribute("draggable", "true");
    flag.style.cursor = "grab";

    flag.addEventListener("dragstart", (e) => {
      draggedFlag = flag;
      flag.style.cursor = "grabbing";

      const img = flag.querySelector("img");
      const dragImg = img.cloneNode(true);
      dragImg.style.width = `${DRAG_IMG_SIZE}px`;
      dragImg.style.height = `${DRAG_IMG_SIZE}px`;

      document.body.appendChild(dragImg);

      e.dataTransfer.setDragImage(dragImg, DRAG_ANCHOR_X, DRAG_ANCHOR_Y);
      e.dataTransfer.effectAllowed = "move";

      setTimeout(() => document.body.removeChild(dragImg), 0);
    });

    flag.addEventListener("dragend", () => {
      flag.style.cursor = "grab";
      draggedFlag = null;
    });
  }

  /* ================== DROP ZONE ================== */
  mapWrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });

  mapWrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!draggedFlag) return;

    const FLAG_SIZE = 45;

    const pt = svgElem.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const svgRootPoint = pt.matrixTransform(svgElem.getScreenCTM().inverse());

    const worldMapPoint = svgRootPoint.matrixTransform(
      worldMap.getCTM().inverse()
    );

    // 🔍 FIND WHICH COUNTRY WAS DROPPED ON
    const droppedCountryPath = getCountryAtPoint(
      svgElem,
      worldMap,
      worldMapPoint.x,
      worldMapPoint.y
    );

    if (droppedCountryPath) {
      console.log("🗺 Dropped on country ID:", droppedCountryPath.id);
    } else {
      console.log("🗺 Dropped on empty area");
    }

    const offsetX = DRAG_ANCHOR_X - DRAG_IMG_SIZE / 2;
    const offsetY = DRAG_ANCHOR_Y - DRAG_IMG_SIZE / 2;

    const finalX = worldMapPoint.x - FLAG_SIZE / 2 - offsetX;
    const finalY = worldMapPoint.y - FLAG_SIZE / 2 - offsetY;

    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
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

    // 🔐 STORE LAST DROP STATE (CORRECT PLACE)
    lastDroppedFlag = draggedFlag;
    lastDroppedCountryPath = droppedCountryPath;
    lastPlacedFlagEl = foreignObject;

    draggedFlag.style.visibility = "hidden";
    console.log(`✅ FINAL DROP: ${finalX.toFixed(2)}, ${finalY.toFixed(2)}`);

    /* ================= VALIDATION ================= */

    if (!droppedCountryPath) {
      console.warn("❌ Dropped on empty area");
      return;
    }

    const flagCountry = draggedFlag.dataset.country;
    const flagAlliance = draggedFlag.dataset.alliance;
    const droppedCountryId = droppedCountryPath.id;

    console.log("🚩 Flag country:", flagCountry);
    console.log("🛡 Alliance:", flagAlliance);
    console.log("🗺 Dropped on:", droppedCountryId);

    // ✅ MATCH
    // ✅ CORRECT MATCH
    if (flagCountry === droppedCountryId) {
      let fillColor = "";

      if (flagAlliance === "Central Powers") {
        fillColor = "#FE984A";
      } else if (flagAlliance === "Allied Powers") {
        fillColor = "#007608";
      }

      if (fillColor) {
        droppedCountryPath.setAttribute("fill", fillColor);
        draggedFlag.style.visibility = "hidden";

        showActionButton("Proceed", "proceed");

        console.log("✅ Correct drop");
      }
    }
    // ❌ WRONG DROP
    else {
      droppedCountryPath.setAttribute("fill", "#FFD5D5");

      showActionButton("Try Again", "try-again");

      console.warn("❌ Wrong drop");
    }
  });

  mapWrapper.addEventListener("dragenter", (e) => e.preventDefault());
  mapWrapper.addEventListener("dragleave", (e) => e.preventDefault());

  /* ================= YEAR CLICK HANDLER ================= */
  document.querySelectorAll('[id^="year-"]').forEach((yearBtn) => {
    yearBtn.style.cursor = "pointer";

    yearBtn.addEventListener("click", () => {
      const year = Number(yearBtn.id.replace("year-", ""));
      if (selectedYearBox) {
        selectedYearBox.textContent = year;
      }

      selectedYearData = eventData.worldWarI.find((item) => item.year === year);

      console.log("📦 Selected Year Data:", selectedYearData);

      if (!selectedYearData) return;

      document.getElementById("step-1").style.display = "none";
      document.getElementById("step-2").style.display = "block";

      setActiveStep(2); // ✅ ADD THIS
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
  });

  }

function renderFlagsForQuestion(question) {
  if (!flagList || !Array.isArray(question.totalClues)) return;

  flagList.innerHTML = "";

  question.totalClues.forEach((clue, index) => {
    const li = document.createElement("li");

    // 🔗 store metadata
    li.dataset.index = index;
    li.dataset.country = clue.country;
    li.dataset.alliance = clue.alliance;

    const img = document.createElement("img");
    img.src = "./assets/flag.svg";
    img.width = 45;
    img.height = 45;

    li.appendChild(img);

    // ✅ ACTIVE FLAG (current clue)
    if (index === currentClueIndex) {
      li.classList.add("active-flag");
      makeFlagDraggable(li);
    }
    // ❌ INACTIVE FLAGS (future / past)
    else {
      li.classList.add("inactive-flag");
      li.style.opacity = "0.4";
      li.style.pointerEvents = "none";
    }

    flagList.appendChild(li);
  });
}



function renderCluesForQuestion(question) {
  clueWrapper.innerHTML = "";

  question.totalClues.forEach((clue, index) => {
    const li = document.createElement("li");
    li.classList.add("clue-item");

    if (index === currentClueIndex) {
      li.classList.add("active");
    }

    li.textContent = `Clue ${index + 1}`;

    li.addEventListener("click", () => {
      selectedClueIndex = index;
      selectedCountryId = clue.country;
      showMsg.style.display = "block";
    });

    clueWrapper.appendChild(li);
  });
}



  closeBtn.addEventListener("click", () => {
    showMsg.style.display = "none";
  });

  function getCountryAtPoint(svgElem, worldMap, x, y) {
    const paths = worldMap.querySelectorAll("path");

    const hitPoint = svgElem.createSVGPoint();
    hitPoint.x = x;
    hitPoint.y = y;

    for (const path of paths) {
      const ctm = path.getCTM();
      if (!ctm) continue;

      const localPoint = hitPoint.matrixTransform(ctm.inverse());

      if (path.isPointInFill(localPoint)) {
        return path; // ✅ FOUND COUNTRY
      }
    }

    return null;
  }

  function showActionButton(text, className) {
    actionBtn.textContent = text;
    actionBtn.classList.remove("try-again", "proceed");
    actionBtn.classList.add(className);
    actionBtn.style.display = "block";
  }

  actionBtn.addEventListener("click", () => {
    const currentQuestion =
      selectedYearData.questions[currentQuestionIndex];

    // 🔁 TRY AGAIN
    if (actionBtn.classList.contains("try-again")) {
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
          const nextQuestion =
            selectedYearData.questions[currentQuestionIndex];

          resetDropState();
          document.querySelector(".question-text").textContent =
            nextQuestion.question;

          renderFlagsForQuestion(nextQuestion);
          renderCluesForQuestion(nextQuestion);
        } else {
          console.log("🏁 Year completed");
        }
      }
    }

    actionBtn.style.display = "none";
  });



function resetDropState() {
  if (lastPlacedFlagEl) {
    lastPlacedFlagEl.remove();
    lastPlacedFlagEl = null;
  }

  if (lastDroppedCountryPath) {
    lastDroppedCountryPath.setAttribute("fill", "white");
    lastDroppedCountryPath = null;
  }

  lastDroppedFlag = null;
}


});
