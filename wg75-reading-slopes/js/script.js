const data = {
  "Gentle Slope": {
    title: "Gentle Slope",
    Insights:
      "When a landform has a very small gradient or angle, the slope is gentle, and its contour lines are widely spaced.",
    "counter lines": [
      "./assets/gentle-slope-1.svg",
      "./assets/gentle-slope-2.svg",
      "./assets/gentle-slope-3.svg",
      "./assets/gentle-slope-4.svg",
      "./assets/gentle-slope-5.svg",
      "./assets/gentle-slope-6.svg",
    ],
  },
  "Steep Slope": {
    title: "Steep Slope",
    Insights:
      "When the degree or angle of slope of a feature is high, and the counter are closely spaced, they indicate a steep slope. ",
    "counter lines": [
      "./assets/steep-slope-1.svg",
      "./assets/steep-slope-2.svg",
      "./assets/steep-slope-3.svg",
      "./assets/steep-slope-4.svg",
      "./assets/steep-slope-5.svg",
      "./assets/steep-slope-6.svg",
      "./assets/steep-slope-7.svg",
    ],
  },
  "Convex Slope": {
    title: "Convex Slope",
    Insights:
      "The slope is gentle at the base and gradually becomes steeper toward the summit. The contour lines are widely spaced at lower elevations and progressively closer together at higher elevations. ",
    "counter lines": [
      "./assets/convex-slope-1.svg",
      "./assets/convex-slope-2.svg",
      "./assets/convex-slope-3.svg",
      "./assets/convex-slope-4.svg",
      "./assets/convex-slope-5.svg",
      "./assets/convex-slope-6.svg",
      "./assets/convex-slope-7.svg",
    ],
  },
  "Concave Slope": {
    title: "Concave Slope",
    Insights:
      "A concave slope is steep at the base and gradually becomes gentler toward the top. The contour lines are closely spaced at lower levels and increasingly wider apart at higher levels. ",
    "counter lines": [
      "./assets/concave-slope-1.svg",
      "./assets/concave-slope-2.svg",
      "./assets/concave-slope-3.svg",
      "./assets/concave-slope-4.svg",
      "./assets/concave-slope-5.svg",
      "./assets/concave-slope-6.svg",
      "./assets/concave-slope-7.svg",
      "./assets/concave-slope-8.svg",
    ],
  },
  "Irregular Slope": {
    title: "Irregular Slope",
    Insights:
      "A slope where contour spacing alternates between wide and close intervals, indicating an uneven gradient with successive gentle and steep sections along the slope.",
    "counter lines": [
      "./assets/irregular-slope-1.svg",
      "./assets/irregular-slope-2.svg",
      "./assets/irregular-slope-3.svg",
      "./assets/irregular-slope-4.svg",
      "./assets/irregular-slope-5.svg",
      "./assets/irregular-slope-6.svg",
      "./assets/irregular-slope-7.svg",
      "./assets/irregular-slope-8.svg",
      "./assets/irregular-slope-9.svg",
      "./assets/irregular-slope-10.svg",
    ],
  },
};
const finalImageMap = {
  "Gentle Slope": "gentle-final",
  "Steep Slope": "steep-final",
  "Convex Slope": "convex-final",
  "Concave Slope": "concave-final",
  "Irregular Slope": "irregular-final",
};

let currentSlopeTitle = "";
let selectedSlopeHeight = null; // No height selected by default

const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const slopeListItems = document.querySelectorAll("#slope-list li");

let correctSelectedOptions = false;

slopeListItems.forEach((item) => {
  item.addEventListener("click", function () {
    const titleElement = this.querySelector(".img-label");
    if (titleElement) {
      const title = titleElement.textContent.trim();
      loadSlope(title);
    }
  });
});
function playLottie(path, { loop = false, autoHide = false } = {}) {
  const container = document.getElementById("correct-lottie");
  if (!container || typeof lottie === "undefined") return;

  // 👉 SHOW lottie container
  container.style.display = "block";
  container.innerHTML = "";

  if (correctAnimation) {
    correctAnimation.destroy();
    correctAnimation = null;
  }

  correctAnimation = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop,
    autoplay: true,
    path,
  });

  if (autoHide) {
    correctAnimation.addEventListener("complete", () => {
      container.innerHTML = "";
      container.style.display = "none"; // 👈 HIDE again
      correctAnimation.destroy();
      correctAnimation = null;
    });
  }
}


function updateSlopeCategory(title) {
  const slopeData = data[title];
  if (!slopeData) return;

  const slopeCategoryList = document.querySelector(".slopeCategory");
  if (slopeCategoryList) {
    slopeCategoryList.innerHTML = ""; // Clear existing items

    const counterLines = slopeData["counter lines"];
    counterLines.forEach((path, index) => {
      const li = document.createElement("li");

      // Create the year/height label
      const yearDiv = document.createElement("div");
      yearDiv.classList.add("selected-year");
      yearDiv.textContent = `${(index + 1) * 100} m`; // Assume 100m intervals based on index

      // Create the image
      const img = document.createElement("img");
      img.classList.add("item-img");
      img.src = path;
      img.alt = `./assets/${title.toLowerCase()} ${index + 1}`;

      li.appendChild(yearDiv);
      li.appendChild(img);

      // Step 1: No default selection for height anymore
      // Users must click to select a height first

      // Step 2: Add click event listener to toggle active class
      li.addEventListener("click", function () {
        // Remove active class from all other siblings
        const allItems = slopeCategoryList.querySelectorAll("li");
        allItems.forEach((item) => item.classList.remove("active"));

        // Add active class to the clicked item
        this.classList.add("active");
        selectedSlopeHeight = (index + 1) * 100;
      });

      slopeCategoryList.appendChild(li);
    });
  }

  // Optional: Update the visible title in the second step if it exists
  const slopeTitleDisplay = document.querySelector(".slope-title");
  if (slopeTitleDisplay) {
    slopeTitleDisplay.textContent = title;
  }

  // Update Insight Current Data
  const insightImg = document.getElementById("insight-current-img");
  const insightTitle = document.getElementById("insight-current-title");
  const insightDesc = document.getElementById("insight-current-desc");

  if (insightImg) {
    const imgName = title.toLowerCase().replace(/\s+/g, "-");
    insightImg.src = `./assets/${imgName}.svg`;
    insightImg.alt = title;
  }

  if (insightTitle) {
    insightTitle.textContent = title;
  }

  if (insightDesc) {
    insightDesc.textContent = slopeData.Insights;
  }
}

// Initialize hit areas on load
createHitAreas();

function createHitAreas() {
  // Find all slope lines
  const lines = document.querySelectorAll('path[id^="line-"]');
  lines.forEach((line) => {
    // Prevent creating multiple hit areas for the same line
    if (line.dataset.hasHitArea === "true") return;

    const hitLine = line.cloneNode(true);
    hitLine.id = "hit-" + Math.random().toString(36).substr(2, 9);

    hitLine.style.stroke = "rgba(0,0,0,0)"; // Transparent
    hitLine.style.strokeWidth = "20px"; // Wider hit area
    hitLine.style.strokeDasharray = "none"; // Solid line
    hitLine.style.cursor = "pointer";

    // Link hit area to the real line
    hitLine._realLine = line;

    // Mark the real line
    line.dataset.hasHitArea = "true";

    // Insert after the original line
    if (line.parentNode) {
      line.parentNode.insertBefore(hitLine, line.nextSibling);
    }
  });
}

let correctAnimation = null;

// Global Event Listener for validating line clicks
document.addEventListener("click", function (e) {
  let target = e.target;

  // Support clicking on tspan inside text
  if (target.tagName === "tspan" || target.tagName === "TSPAN") {
    target = target.parentElement;
  }

  // Support clicking on the transparent hit area
  if (target._realLine) {
    target = target._realLine;
  }

  let targetId = target.id;

  // If clicked on numeric ID (text label), redirect to the corresponding line
  if (targetId && /^\d+$/.test(targetId)) {
    const className = currentSlopeTitle.toLowerCase().replace(/\s+/g, "-");
    const containerId = className + "-lines";
    const container = document.getElementById(containerId);
    if (container) {
      const line = container.querySelector(`#line-${targetId}`);
      if (line) {
        target = line;
        targetId = line.id;
      }
    }
  }

  // Check if the clicked element (or resolved real element) is an SVG path
  if (target.tagName === "path" || target.tagName === "PATH") {
    // If no height is selected, don't play incorrect animation, just do nothing
    if (selectedSlopeHeight === null) return;

    // Check if the ID matches the pattern 'line-{height}'
    if (targetId && targetId.startsWith("line-")) {
      const expectedId = `line-${selectedSlopeHeight}`;

      if (targetId === expectedId) {
        // ✅ CORRECT ANSWER
        target.style.stroke = "black";
        target.style.strokeWidth = "2";
        target.style.strokeDasharray = "none";
        target.dataset.done = "true";

        if (target.parentNode) {
          const dotLine = target.parentNode.querySelector(
            `[id="dot-line-${selectedSlopeHeight}"]`,
          );
          if (dotLine) dotLine.style.display = "block";

          const allLines =
            target.parentNode.querySelectorAll('path[id^="line-"]');
          const doneLines = target.parentNode.querySelectorAll(
            'path[id^="line-"][data-done="true"]',
          );

          if (allLines.length > 0 && allLines.length === doneLines.length) {
            markSlopeAsCompleted(currentSlopeTitle);
          }
        }

        // ✅ play correct animation
      } else {
        // ❌ WRONG ANSWER
        playLottie("./lottie/incorrectLottie.json", {
          loop: false,
          autoHide: true,
        });
      }
    }
  }
});

function markSlopeAsCompleted(title) {
  correctSelectedOptions = true;

  // Mark slope as completed in list
  const slopeListItems = document.querySelectorAll("#slope-list li");
  slopeListItems.forEach((li) => {
    const label = li.querySelector(".img-label");
    if (label && label.textContent.trim() === title) {
      li.classList.add("completed");
    }
  });

  // Add correct state
  const mainContainer = document.querySelector(".main-container");
  if (mainContainer) {
    mainContainer.classList.add("correct");
  }

  // ✅ Show final result image
  Object.values(finalImageMap).forEach((id) => {
    const img = document.getElementById(id);
    if (img) {
      img.style.display = "none";
      img.classList.remove("animated");
    }
  });

  const finalImgId = finalImageMap[title];
  if (finalImgId) {
    const finalImg = document.getElementById(finalImgId);
    if (finalImg) {
      finalImg.style.display = "block";
      finalImg.classList.add("animated");
    }
  }

  // ✅ Play correct animation
  playLottie("./lottie/correctLottie.json", {
    loop: false,
    autoHide: true,
  });

  // 🔒 DISABLE SHOW ANSWER BUTTON (ONLY AFTER COMPLETION)
  const showAnsBtnElement = document.getElementById("show-ans-btn");
  if (showAnsBtnElement) {
    showAnsBtnElement.classList.add("disabled");
  }
}

// Insight Modal Interaction
const insightBtn = document.getElementById("insight-btn");
const closeInsightBtn = document.getElementById("close-insight");
const insightCurrent = document.getElementById("insight-current");
const insightContainer = document.getElementById("insight-container");
const svgContainer = document.getElementById("svg-container");

if (insightBtn) {
  insightBtn.addEventListener("click", () => {
    if (insightCurrent) {
      insightCurrent.style.display = "block";
      insightContainer.style.display = "block";
      insightContainer.classList.add("insight-open");
    }
    if (svgContainer) {
      svgContainer.classList.add("modal-open");
    }
    // Add active class to .i-text elements
    document.querySelectorAll(".i-text").forEach((el) => {
      el.classList.add("active");
    });
  });
}

if (closeInsightBtn) {
  closeInsightBtn.addEventListener("click", () => {
    if (insightCurrent) {
      insightCurrent.style.display = "none";
      insightContainer.style.display = "none";
      insightContainer.classList.remove("insight-open");
    }
    if (svgContainer) {
      svgContainer.classList.remove("modal-open");
    }
    // Remove active class from .i-text elements
    document.querySelectorAll(".i-text").forEach((el) => {
      el.classList.remove("active");
    });
  });
}

// Step Navigation Logic
const steps = ["step-1", "step-2"];
let currentStepIndex = 0;
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const slopeOrder = [
  "Gentle Slope",
  "Steep Slope",
  "Convex Slope",
  "Concave Slope",
  "Irregular Slope",
];

function updateButtonStates() {
  const currentIndex = slopeOrder.indexOf(currentSlopeTitle);

  if (prevBtn) {
    if (currentIndex <= 0) {
      prevBtn.classList.add("disabled");
    } else {
      prevBtn.classList.remove("disabled");
    }
  }

  if (nextBtn) {
    if (currentIndex >= slopeOrder.length - 1) {
      nextBtn.classList.add("disabled");
    } else {
      nextBtn.classList.remove("disabled");
    }
  }
}

function resetActivity(keepCompletedStatus = false) {
  if (!currentSlopeTitle) return;

  selectedSlopeHeight = null;
  correctSelectedOptions = false;

  const className = currentSlopeTitle.toLowerCase().replace(/\s+/g, "-");
  const selectedSlopeId = className + "-lines";
  const container = document.getElementById(selectedSlopeId);

  if (container) {
    // Hide all dot-lines
    const dotLines = container.querySelectorAll('path[id^="dot-line-"]');
    dotLines.forEach((dotLine) => {
      dotLine.style.display = "none";
    });

    // Reset profile lines to default
    const profileLines = container.querySelectorAll('path[id^="line-"]');
    profileLines.forEach((line) => {
      line.style.stroke = "";
      line.style.strokeWidth = "";
      line.style.strokeDasharray = "";
      delete line.dataset.done;
    });
  }

  // Reset Lottie and correct class
  const mainContainer = document.querySelector(".main-container");
  if (mainContainer) {
    mainContainer.classList.remove("correct");
  }
  const correctLottie = document.getElementById("correct-lottie");
  if (correctLottie) {
    correctLottie.innerHTML = "";
    if (correctAnimation) {
      correctAnimation.destroy();
      correctAnimation = null;
    }
  }

  // Reset Show Answer Button State
  const showAnsBtnElement = document.getElementById("show-ans-btn");
  if (showAnsBtnElement) {
    showAnsBtnElement.src = "./assets/show-ans-btn.svg";
    showAnsBtnElement.dataset.state = "show";
  }

  // Reset slope-list items completed status for the current slope ONLY
  if (!keepCompletedStatus) {
    const slopeListItemsStatus = document.querySelectorAll("#slope-list li");
    slopeListItemsStatus.forEach((li) => {
      const label = li.querySelector(".img-label");
      if (label && label.textContent.trim() === currentSlopeTitle) {
        li.classList.remove("completed");
      }
    });
  }
  // 🔄 Hide final result image on reset
  const finalImgId = finalImageMap[currentSlopeTitle];
  if (finalImgId) {
    const finalImg = document.getElementById(finalImgId);
    if (finalImg) {
      finalImg.style.display = "none";
      finalImg.classList.remove("animated");
    }
  }
  if (showAnsBtnElement) {
    showAnsBtnElement.classList.remove("disabled");
  }
}

function loadSlope(title) {
  // Hide all final images when switching slopes
  Object.values(finalImageMap).forEach((id) => {
    const img = document.getElementById(id);
    if (img) {
      img.style.display = "none";
      img.classList.remove("animated");
    }
  });

  currentSlopeTitle = title;

  // Ensure we are on Step 2
  if (step1) step1.style.display = "none";
  if (step2) step2.style.display = "block";
  currentStepIndex = 1; // Sync step index

  // Ensure main container starts without the 'correct' class during load
  const mainContainer = document.querySelector(".main-container");
  if (mainContainer) {
    mainContainer.classList.remove("correct");
  }

  // Reset Show Answer Button State for the new slope
  const showAnsBtnElement = document.getElementById("show-ans-btn");
  if (showAnsBtnElement) {
    showAnsBtnElement.src = "./assets/show-ans-btn.svg";
    showAnsBtnElement.dataset.state = "show";
  }

  // Clear Lottie animation container
  const correctLottie = document.getElementById("correct-lottie");
  if (correctLottie) {
    correctLottie.innerHTML = "";
    if (correctAnimation) {
      correctAnimation.destroy();
      correctAnimation = null;
    }
  }

  updateSlopeCategory(currentSlopeTitle);

  const slopeIds = [
    "gentle-slope-lines",
    "steep-slope-lines",
    "convex-slope-lines",
    "concave-slope-lines",
    "irregular-slope-lines",
  ];

  slopeIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = "none";
    }
  });

  const className = currentSlopeTitle.toLowerCase().replace(/\s+/g, "-");
  const selectedSlopeId = className + "-lines";
  const selectedElement = document.getElementById(selectedSlopeId);
  if (selectedElement) {
    selectedElement.style.display = "block";
    selectedElement.classList.add(className);
  }

  const line8 = document.getElementById("line-8");
  const label800 = document.getElementById("800-m");
  const line9 = document.getElementById("line-9");
  const label900 = document.getElementById("900-m");
  const line10 = document.getElementById("line-10");
  const label1000 = document.getElementById("1000-m");

  if (line8 && label800) {
    if (title === "Concave Slope") {
      line8.style.display = "block";
      label800.style.display = "block";
    } else if (title === "Irregular Slope") {
      line8.style.display = "block";
      label800.style.display = "block";
      line9.style.display = "block";
      label900.style.display = "block";
      line10.style.display = "block";
      label1000.style.display = "block";
    } else {
      line8.style.display = "none";
      label800.style.display = "none";
    }
  }
    updateExtraContourLines(title); // ✅ ADD THIS

  updateButtonStates();
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    resetActivity(true);
    const currentIndex = slopeOrder.indexOf(currentSlopeTitle);
    if (currentIndex > 0) {
      const prevSlope = slopeOrder[currentIndex - 1];
      loadSlope(prevSlope);
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    resetActivity(true);
    const currentIndex = slopeOrder.indexOf(currentSlopeTitle);
    if (currentIndex < slopeOrder.length - 1) {
      const nextSlope = slopeOrder[currentIndex + 1];
      loadSlope(nextSlope);
    }
  });
}

const showAnsBtn = document.getElementById("show-ans-btn");
const homeBtn = document.getElementById("home-btn");

if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    currentSlopeTitle = "";

    currentStepIndex = 0;
    if (step1) step1.style.display = "block";
    if (step2) step2.style.display = "none";

    // Hide all slope line containers
    const slopeIds = [
      "gentle-slope-lines",
      "steep-slope-lines",
      "convex-slope-lines",
      "concave-slope-lines",
      "irregular-slope-lines",
    ];
    slopeIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
  });
}

if (showAnsBtn) {
  showAnsBtn.dataset.state = "show"; // Initialize state

  showAnsBtn.addEventListener("click", () => {
    if (!currentSlopeTitle) return;

    const isShowing = showAnsBtn.dataset.state === "show";
    const className = currentSlopeTitle.toLowerCase().replace(/\s+/g, "-");
    const selectedSlopeId = className + "-lines";
    const container = document.getElementById(selectedSlopeId);

    const finalImgId = finalImageMap[currentSlopeTitle];
    const finalImg = finalImgId ? document.getElementById(finalImgId) : null;

    if (container) {
      if (isShowing) {
        // 🔵 SHOW ANSWER
        showAnsBtn.src = "./assets/hide-ans-btn.svg";
        showAnsBtn.dataset.state = "hide";

        // Show all dot-lines
        container.querySelectorAll('path[id^="dot-line-"]').forEach((d) => {
          d.style.display = "block";
        });

        // Highlight profile lines
        container.querySelectorAll('path[id^="line-"]').forEach((line) => {
          line.style.stroke = "black";
          line.style.strokeWidth = "2";
          line.style.strokeDasharray = "none";
        });

        // ✅ SHOW FINAL IMAGE
        if (finalImg) {
          finalImg.style.display = "block";
          finalImg.classList.add("animated");
        }
      } else {
        // 🔴 HIDE ANSWER
        showAnsBtn.src = "./assets/show-ans-btn.svg";
        showAnsBtn.dataset.state = "show";

        // Hide dot-lines except completed
        container
          .querySelectorAll('path[id^="dot-line-"]')
          .forEach((dotLine) => {
            const height = dotLine.id.replace("dot-line-", "");
            const profileLine = container.querySelector(`#line-${height}`);
            if (!profileLine || profileLine.dataset.done !== "true") {
              dotLine.style.display = "none";
            }
          });

        // Reset uncompleted profile lines
        container.querySelectorAll('path[id^="line-"]').forEach((line) => {
          if (line.dataset.done !== "true") {
            line.style.stroke = "";
            line.style.strokeWidth = "";
            line.style.strokeDasharray = "";
          }
        });

        // ❌ HIDE FINAL IMAGE
        if (finalImg) {
          finalImg.style.display = "none";
          finalImg.classList.remove("animated");
        }
      }
    }
  });
}

const resetBtn = document.getElementById("reset-btn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    resetActivity();
  });
}

function isSlopeCompleted(title) {
  const items = document.querySelectorAll("#slope-list li");
  return Array.from(items).some((li) => {
    const label = li.querySelector(".img-label");
    return (
      label &&
      label.textContent.trim() === title &&
      li.classList.contains("completed")
    );
  });
}

function updateExtraContourLines(title) {
  const line8 = document.getElementById("line-8");
  const label800 = document.getElementById("800-m");
  const line9 = document.getElementById("line-9");
  const label900 = document.getElementById("900-m");
  const line10 = document.getElementById("line-10");
  const label1000 = document.getElementById("1000-m");

  if (!line8 || !label800) return;

  // 🔴 Reset everything first
  line8.style.display = "none";
  label800.style.display = "none";

  if (line9) line9.style.display = "none";
  if (label900) label900.style.display = "none";

  if (line10) line10.style.display = "none";
  if (label1000) label1000.style.display = "none";

  // 🟢 Apply per slope
  if (title === "Concave Slope") {
    line8.style.display = "block";
    label800.style.display = "block";
  }

  if (title === "Irregular Slope") {
    line8.style.display = "block";
    label800.style.display = "block";

    if (line9) line9.style.display = "block";
    if (label900) label900.style.display = "block";

    if (line10) line10.style.display = "block";
    if (label1000) label1000.style.display = "block";
  }
}
