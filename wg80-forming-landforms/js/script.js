const data = {
  "Conical Slope": {
    title: "Conical Hill",
    Insights:
      "The conical hill rises almost uniformly from the surrounding land. It has a uniform slope and a narrow top, as shown by evenly spaced concentric contours. ",
    "counter lines": [
      "./assets/conical-slope-1.svg",
      "./assets/conical-slope-2.svg",
      "./assets/conical-slope-3.svg",
      "./assets/conical-slope-4.svg",
      "./assets/conical-slope-5.svg",
      "./assets/conical-slope-6.svg",
      "./assets/conical-slope-7.svg",
    ],
  },
  "Saddle Slope": {
    title: "Saddle ",
    Insights:
      "The narrow or broad depression between the two hills is called a saddle, pass, gap or col.  ",
    "counter lines": [
      "./assets/saddle-slope-1.svg",
      "./assets/saddle-slope-2.svg",
      "./assets/saddle-slope-3.svg",
      "./assets/saddle-slope-4.svg",
      "./assets/saddle-slope-5.svg",
      "./assets/saddle-slope-6.svg",
      "./assets/saddle-slope-7.svg",
    ],
  },
  "Ridge Slope": {
    title: "Ridge",
    Insights:
      "An elongated hill or a narrow chain of hills is called a ridge.  ",
    "counter lines": [
      "./assets/ridge-slope-1.svg",
      "./assets/ridge-slope-2.svg",
      "./assets/ridge-slope-3.svg",
      "./assets/ridge-slope-4.svg",
      "./assets/ridge-slope-5.svg",
      "./assets/ridge-slope-6.svg",
      "./assets/ridge-slope-7.svg",
    ],
  },
  "Plateau  Slope": {
    title: "Plateau  Slope",
    Insights:
      "A plateau is a broad, flat-topped highland with relatively steep sides.  ",
    "counter lines": [
      "./assets/plateau-slope-1.svg",
      "./assets/plateau-slope-2.svg",
      "./assets/plateau-slope-3.svg",
      "./assets/plateau-slope-4.svg",
      "./assets/plateau-slope-5.svg",
      "./assets/plateau-slope-6.svg",
      "./assets/plateau-slope-7.svg",
      "./assets/plateau-slope-8.svg",
    ],
  },
};

const finalImageMap = {
  "Conical Slope": "conical-final",
  "Saddle Slope": "saddle-final",
  "Ridge Slope": "ridge-final",
  "Plateau  Slope": "plateau-final",
};

let currentSlopeTitle = "";
let selectedSlopeHeight = 100; // Default to 100m as the first item is active by default

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

      // Step 1: Add default active class to the first item
      if (index === 0) {
        li.classList.add("active");
        selectedSlopeHeight = 100;
      }

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

  // Support clicking on the transparent hit area
  if (target._realLine) {
    target = target._realLine;
  }

  // Check if the clicked element (or resolved real element) is an SVG path
  if (target.tagName === "path" || target.tagName === "PATH") {
    const targetId = target.id;

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
    if (img) img.style.display = "none";
  });

  const finalImgId = finalImageMap[title];
  if (finalImgId) {
    const finalImg = document.getElementById(finalImgId);
    if (finalImg) finalImg.style.display = "block";
  }

  // ✅ Play correct animation
  playLottie("./lottie/correctLottie.json", {
    loop: false,
    autoHide: false,
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
  });
}

// Step Navigation Logic
const steps = ["step-1", "step-2"];
let currentStepIndex = 0;
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const slopeOrder = [
  "Conical Slope",
  "Saddle Slope",
  "Ridge Slope",
  "Plateau  Slope",
];

function updateButtonStates() {
  const currentIndex = slopeOrder.indexOf(currentSlopeTitle);

  if (prevBtn) {
    if (!correctSelectedOptions) {
      resetActivity();
    }
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

function resetActivity() {
  if (!currentSlopeTitle) return;

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
  const slopeListItemsStatus = document.querySelectorAll("#slope-list li");
  slopeListItemsStatus.forEach((li) => {
    const label = li.querySelector(".img-label");
    if (label && label.textContent.trim() === currentSlopeTitle) {
      li.classList.remove("completed");
    }
  });
  // 🔄 Hide final result image on reset
  const finalImgId = finalImageMap[currentSlopeTitle];
  if (finalImgId) {
    const finalImg = document.getElementById(finalImgId);
    if (finalImg) finalImg.style.display = "none";
  }
  if (showAnsBtnElement) {
    showAnsBtnElement.classList.remove("disabled");
  }
}

function loadSlope(title) {
  // Hide all final images when switching slopes
  Object.values(finalImageMap).forEach((id) => {
    const img = document.getElementById(id);
    if (img) img.style.display = "none";
  });

  currentSlopeTitle = title;

  // Ensure we are on Step 2
  if (step1) step1.style.display = "none";
  if (step2) step2.style.display = "block";
  currentStepIndex = 1; // Sync step index

  // Update main container state based on whether this slope is completed
  const mainContainer = document.querySelector(".main-container");
  if (mainContainer) {
    const slopeListItems = document.querySelectorAll("#slope-list li");
    let isCompleted = false;
    slopeListItems.forEach((li) => {
      const label = li.querySelector(".img-label");
      if (
        label &&
        label.textContent.trim() === title &&
        li.classList.contains("completed")
      ) {
        isCompleted = true;
      }
    });

    if (isCompleted) {
      mainContainer.classList.add("correct");
    } else {
      mainContainer.classList.remove("correct");
    }
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
    "conical-slope-lines",
    "saddle-slope-lines",
    "ridge-slope-lines",
    "plateau-slope-lines",
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
    if (title === "Plateau  Slope") {
      line8.style.display = "block";
      label800.style.display = "block";
    } else {
      line8.style.display = "none";
      label800.style.display = "none";
    }
  }
  updateButtonStates();
  // ✅ Restore final image if this slope was already completed
  if (isSlopeCompleted(title)) {
    const finalImgId = finalImageMap[title];
    if (finalImgId) {
      const finalImg = document.getElementById(finalImgId);
      if (finalImg) finalImg.style.display = "block";
    }
  }
  // 🔐 Handle Show Answer button state per slope
if (showAnsBtnElement) {
  if (isSlopeCompleted(title)) {
    showAnsBtnElement.classList.add("disabled");
  } else {
    showAnsBtnElement.classList.remove("disabled");
  }
}

}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    const currentIndex = slopeOrder.indexOf(currentSlopeTitle);
    if (currentIndex > 0) {
      const prevSlope = slopeOrder[currentIndex - 1];
      loadSlope(prevSlope);
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
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
      "conical-slope-lines",
      "saddle-slope-lines",
      "ridge-slope-lines",
      "plateau-slope-lines",
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
        if (finalImg) finalImg.style.display = "block";
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
        if (finalImg) finalImg.style.display = "none";
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
