const data = {
  "Conical Slope": {
    title: "Conical Hill",
    Insights:
      "The conical hill rises almost uniformly from the surrounding land. It has a uniform slope and a narrow top, as shown by evenly spaced concentric Counter. ",
    "counter lines": [
      "./assets/conical-slope-1000.svg",
      "./assets/conical-slope-1100.svg",
      "./assets/conical-slope-1200.svg",
      "./assets/conical-slope-1300.svg",
      "./assets/conical-slope-1400.svg",
      "./assets/conical-slope-1500.svg",
      "./assets/conical-slope-1600.svg",
    ],
  },
  "Saddle Slope": {
    title: "Saddle ",
    Insights:
      "The narrow or broad depression between the two hills is called a saddle, pass, gap or col.  ",
    "counter lines": [
      "./assets/saddle-slope-1000.svg",
      "./assets/saddle-slope-1100.svg",
      "./assets/saddle-slope-1200.svg",
      "./assets/saddle-slope-1300.svg",
      "./assets/saddle-slope-1400.svg",
      "./assets/saddle-slope-1500.svg",
    ],
  },
  "Ridge Slope": {
    title: "Ridge",
    Insights:
      "An elongated hill or a narrow chain of hills is called a ridge.  ",
    "counter lines": [
      "./assets/ridge-slope-1200.svg",
      "./assets/ridge-slope-1300.svg",
      "./assets/ridge-slope-1400.svg",
      "./assets/ridge-slope-1500.svg",
      "./assets/ridge-slope-1600.svg",
    ],
  },
  "Plateau Slope": {
    title: "Plateau Slope",
    Insights:
      "A plateau is a broad, flat-topped highland with relatively steep sides.  ",
    "counter lines": [
      "./assets/plateau-slope-1000.svg",
      "./assets/plateau-slope-1100.svg",
      "./assets/plateau-slope-1200.svg",
      "./assets/plateau-slope-1300.svg",
      "./assets/plateau-slope-1400.svg",
    ],
  },
};

const finalImageMap = {
  "Conical Slope": "conical-final",
  "Saddle Slope": "saddle-final",
  "Ridge Slope": "ridge-final",
  "Plateau Slope": "plateau-final",
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
      container.style.display = "none";
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

      // Extract height from path (e.g., ./assets/conical-slope-1000.svg -> 1000)
      const heightMatch = path.match(/-(\d+)\.svg/);
      const currentHeight = heightMatch ? parseInt(heightMatch[1]) : (index + 1) * 100;

      // Create the year/height label
      const yearDiv = document.createElement("div");
      yearDiv.classList.add("selected-year");
      yearDiv.textContent = `${currentHeight} m`;

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
        selectedSlopeHeight = currentHeight;
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
    // If no height is selected, don't play incorrect animation, just do nothing
    if (selectedSlopeHeight === null) return;

    const targetId = target.id;

    // Check if the ID matches the pattern 'line-{height}'
    if (targetId && targetId.startsWith("line-")) {
      const expectedId = `line-${selectedSlopeHeight}`;

      if (targetId === expectedId || targetId.startsWith(`${expectedId}-`)) {
        // ✅ CORRECT ANSWER
        target.style.stroke = "black";
        target.style.strokeWidth = "2";
        target.style.strokeDasharray = "none";
        target.dataset.done = "true";

        if (target.parentNode) {
          // 1. Check for indexed line pattern (e.g. line-1500-1)
          const indexedMatch = targetId.match(/^line-(\d+)-(\d+)$/);

          if (indexedMatch) {
            const height = indexedMatch[1];
            const index = parseInt(indexedMatch[2], 10);

            // Map index N to dot-lines 2N-1 and 2N
            const dotLine1Id = `dot-line-${height}-${index * 2 - 1}`;
            const dotLine2Id = `dot-line-${height}-${index * 2}`;

            const dl1 = target.parentNode.querySelector(`[id="${dotLine1Id}"]`);
            const dl2 = target.parentNode.querySelector(`[id="${dotLine2Id}"]`);

            if (dl1) dl1.style.display = "block";
            if (dl2) dl2.style.display = "block";

            // Show associated text label for indexed line
            const textLabelId = `${height}-${index}`;
            const textLabel = target.parentNode.querySelector(`[id="${textLabelId}"]`);
            if (textLabel) textLabel.style.display = "block";
          } else {
             // 2. Default logic: exact match or prefix match
             const dotLineId = targetId.replace("line-", "dot-line-");
             
             // Try exact match
             const dotLine = target.parentNode.querySelector(`[id="${dotLineId}"]`);
             if (dotLine) dotLine.style.display = "block";

             // Show associated text label for simple line
             const height = targetId.replace("line-", "");
             const textLabel = target.parentNode.querySelector(`[id="${height}"]`);
             if (textLabel) textLabel.style.display = "block";

             // Try prefix match
             const nestedDotLines = target.parentNode.querySelectorAll(`[id^="${dotLineId}-"]`);
             nestedDotLines.forEach((el) => el.style.display = "block");
          }


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
  "Conical Slope",
  "Saddle Slope",
  "Ridge Slope",
  "Plateau Slope",
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

    // Reset numeric text labels
    container.querySelectorAll("text").forEach((label) => {
       if (/^\d/.test(label.id)) {
         label.style.display = "none";
       }
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
    correctLottie.style.display = "none";
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
  selectedSlopeHeight = null;
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
    correctLottie.style.display = "none";
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
  const label1700 = document.getElementById("1700-m");

  if (line8 && label1700) {
    if (title === "Saddle Slope") {
      line8.style.display = "none";
      label1700.style.display = "none";
    } else {
      line8.style.display = "block";
      label1700.style.display = "block";
    }
  }
  updateButtonStates();

  if (showAnsBtnElement) {
    showAnsBtnElement.classList.remove("disabled");
  }
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

        // Show all numeric text labels
        container.querySelectorAll("text").forEach((label) => {
          // Check if ID starts with a digit (e.g., "1000", "1400-1")
          if (/^\d/.test(label.id)) label.style.display = "block";
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
            // Check if this dot-line corresponds to a completed line
            // Parsing logic: dot-line-H-I
            const match = dotLine.id.match(/^dot-line-(\d+)-(\d+)$/);
            let shouldShow = false;

            if (match) {
              const height = match[1];
              const index = parseInt(match[2], 10);
              
              // Case 1: Indexed line (line-H-ceil(I/2))
              const lineIndex = Math.ceil(index / 2);
              const indexedLineId = `line-${height}-${lineIndex}`;
              const indexedLine = container.querySelector(`#${indexedLineId}`);

              if (indexedLine && indexedLine.dataset.done === "true") {
                shouldShow = true;
              } else {
                 // Case 2: Non-indexed line (line-H)
                 const simpleLineId = `line-${height}`;
                 const simpleLine = container.querySelector(`#${simpleLineId}`);
                 if (simpleLine && simpleLine.dataset.done === "true") {
                    shouldShow = true;
                 }
              }
            }

            if (!shouldShow) {
              dotLine.style.display = "none";
            }
          });

        // Hide numeric text labels except completed
        container.querySelectorAll("text").forEach((label) => {
          if (/^\d/.test(label.id)) {
            // Check if it's an indexed label (e.g. 1400-1) or simple (1000)
            const match = label.id.match(/^(\d+)-(\d+)$/);
            let profileLine = null;

            if (match) {
              const height = match[1];
              const index = match[2];
              profileLine = container.querySelector(`#line-${height}-${index}`);
            } else {
               // Simple ID like "1000"
               const height = label.id;
               profileLine = container.querySelector(`#line-${height}`);
            }

            if (!profileLine || profileLine.dataset.done !== "true") {
              label.style.display = "none";
            }
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
