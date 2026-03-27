document.addEventListener("DOMContentLoaded", function () {
  let pictographData = [];
  let currentActivity = 0;
  let selectedIcon = null; // global variable to store selected icon

  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  const tableBody = document.getElementById("result-body");
  const nextBtn = document.getElementById("next-activity");
  const fullCountEl = document.getElementById("full-count");
  const halfCountEl = document.getElementById("half-count");
  const iconItems = document.querySelectorAll(".icon-wrapper li");
  const fullInputImg = document.getElementById("full-inputimg");
  const halfInputImg = document.getElementById("half-inputimg");
  const countList = document.getElementById("count-list");
  // ICON SELECTION
  iconItems.forEach((item) => {
    item.addEventListener("click", function () {
      iconItems.forEach((li) => li.classList.remove("active"));

      this.classList.add("active");

      selectedIcon = this.dataset.selectitem;

      console.log("Selected Icon:", selectedIcon);

      // 🔥 update full icon
      fullInputImg.src = `./assets/${selectedIcon}.svg`;

      // 🔥 update half icon
      halfInputImg.src = `./assets/${selectedIcon}-half.svg`;
        halfInputImg.onerror = function () {
  halfInputImg.src = `./assets/${selectedIcon}.svg`;
};
      
      const handler = document.getElementById("main-handler");
      if (handler) {
        handler.classList.remove("disabled-handler");
      }

      updateKeyValues();
    });
  });

  // Fetch JSON
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      pictographData = data.pictographs;
      loadActivity(currentActivity);
    })
    .catch((error) => console.error("Error loading JSON:", error));

  function updateKeyValues() {
    if (!selectedIcon) return; // only update if icon selected

    fullCountEl.textContent = sliderValue;
    halfCountEl.textContent = (sliderValue / 2).toFixed(1);
  }
function loadActivity(index) {

  const activity = pictographData[index];
  if (!activity) return;

  titleEl.textContent = activity.title;
  descEl.textContent = activity.description;

  tableBody.innerHTML = "";
  countList.innerHTML = "";

  activity.categories.forEach(category => {

    // table row
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${category.name}</td>
      <td>${category.count}</td>
    `;

    tableBody.appendChild(row);


    // pictograph row
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="left-sec">
        <span class="category-name">${category.name}:</span>
        <div class="images-wrapper"></div>
      </div>
      <span id="feedback" class="feedback"></span>
      <div class="right-sec">
        <span class="count-wrapper">
          <span class="current-count">0</span>/<span class="total-count">${category.count}</span>
        </span>

        <div class="counter-btn-wrapper">
          <span class="counter-btns btnFull-plus disabled" >+ Full</span>
          <span class="counter-btns btnFull-minus disabled" >- Full</span>
          <span class="counter-btns btnHalf-plus disabled" >+ Half</span>
          <span class="counter-btns btnHalf-minus disabled" >- Half</span>
        </div>
      </div>
    `;

    countList.appendChild(li);

    setupRowControls(li);

  });

}

  // Next Activity Button
  nextBtn.addEventListener("click", function () {
    const resetSettingButton = document.getElementById("reset-setting");
    if (resetSettingButton) {
      resetSettingButton.click();
    }

    const backdrop = document.getElementById("backdrop");
    const solutionWrapper = document.getElementById("soulution-wrapper");
    const correctModal = document.getElementById("correct-modal");
    if (backdrop) backdrop.style.display = "none";
    if (solutionWrapper) solutionWrapper.style.display = "none";
    if (correctModal) correctModal.style.display = "none";

    currentActivity++;

    if (currentActivity >= pictographData.length) {
      currentActivity = 0;
    }

    loadActivity(currentActivity);
  });

  // SLIDER
  const handler = document.getElementById("main-handler");

  const valueTargets = [
    { id: "value-0", value: 0 }, // ← add this
    { id: "value-1", value: 1 },
    { id: "value-2", value: 2 },
    { id: "value-3", value: 3 },
    { id: "value-4", value: 4 },
    { id: "value-5", value: 5 },
    { id: "value-10", value: 10 },
    { id: "value-20", value: 20 },
  ];

  let sliderValue = 1;
  let isDragging = false;

  const sliderSvg = handler.closest("svg");

  // Get marker center X positions
  const markers = valueTargets.map((item) => {
    const el = document.getElementById(item.id);
    const box = el.getBBox();
    return {
      value: item.value,
      x: box.x + box.width / 2,
    };
  });

  // Get handler's own center X (from its natural path bounds, no transform applied)
  const handlerBox = handler.getBBox();
  const handlerCenterX = handlerBox.x + handlerBox.width / 2;

  function snapToClosest(mouseX) {
    let closest = markers[0];
    let minDist = Math.abs(mouseX - closest.x);
    markers.forEach((marker) => {
      const dist = Math.abs(mouseX - marker.x);
      if (dist < minDist) {
        minDist = dist;
        closest = marker;
      }
    });
    return closest;
  }

  function getSVGPoint(e, svg) {
    const pt = svg.createSVGPoint();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    pt.x = clientX;
    pt.y = 0;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function setupRowControls(li) {

  const wrapper = li.querySelector(".images-wrapper");
  const currentCountEl = li.querySelector(".current-count");

  const btnFullPlus = li.querySelector(".btnFull-plus");
  const btnFullMinus = li.querySelector(".btnFull-minus");
  const btnHalfPlus = li.querySelector(".btnHalf-plus");
  const btnHalfMinus = li.querySelector(".btnHalf-minus");

  let currentValue = 0;
  const feedbackEl = li.querySelector(".feedback");

  if (feedbackEl) {
    feedbackEl.addEventListener("click", () => {
      const globalResetBtn = document.getElementById("global-reset");
      if (globalResetBtn) globalResetBtn.click();
    });
  }

  btnFullPlus.addEventListener("click", () => {

    if (!selectedIcon || sliderValue === 0) return;

    if (feedbackEl) feedbackEl.classList.remove("correct", "wrong");
    if (currentCountEl) currentCountEl.classList.remove("wrong");

    const img = document.createElement("img");
    img.src = `./assets/${selectedIcon}.svg`;
    img.classList.add("full-icon");

    const handler = document.getElementById("main-handler");
    if (handler) handler.classList.add("disabled-handler");

    wrapper.appendChild(img);

    currentValue += sliderValue;
    currentCountEl.textContent = currentValue;

  });


  btnFullMinus.addEventListener("click", () => {

    const icons = wrapper.querySelectorAll(".full-icon");
    if (icons.length === 0) return;

    if (feedbackEl) feedbackEl.classList.remove("correct", "wrong");
    if (currentCountEl) currentCountEl.classList.remove("wrong");

    const handler = document.getElementById("main-handler");
    if (handler) handler.classList.add("disabled-handler");

    icons[icons.length - 1].remove();

    currentValue -= sliderValue;
    currentCountEl.textContent = currentValue;

  });


  btnHalfPlus.addEventListener("click", () => {

    if (!selectedIcon || sliderValue === 0) return;

    if (feedbackEl) feedbackEl.classList.remove("correct", "wrong");
    if (currentCountEl) currentCountEl.classList.remove("wrong");

    const img = document.createElement("img");
    img.src = `./assets/${selectedIcon}-half.svg`;
    img.classList.add("half-icon");

    img.onerror = function () {
      img.src = `./assets/${selectedIcon}.svg`;
    };

    const handler = document.getElementById("main-handler");
    if (handler) handler.classList.add("disabled-handler");

    wrapper.appendChild(img);

    currentValue += sliderValue / 2;
    currentCountEl.textContent = currentValue;

  });


  btnHalfMinus.addEventListener("click", () => {

    const icons = wrapper.querySelectorAll(".half-icon");
    if (icons.length === 0) return;

    if (feedbackEl) feedbackEl.classList.remove("correct", "wrong");
    if (currentCountEl) currentCountEl.classList.remove("wrong");

    const handler = document.getElementById("main-handler");
    if (handler) handler.classList.add("disabled-handler");

    icons[icons.length - 1].remove();

    currentValue -= sliderValue / 2;
    currentCountEl.textContent = currentValue;

  });

}
function updateCounterButtons() {

  const allButtons = document.querySelectorAll(".counter-btns");
  const checkAnsBtn = document.getElementById("check-ans");
  const globalResetBtn = document.getElementById("global-reset");
  const showAnswerBtn = document.getElementById("show-answer");

  if (sliderValue > 0 && selectedIcon) {

    allButtons.forEach(btn => {
      btn.classList.remove("disabled");
    });
    
    if (checkAnsBtn) checkAnsBtn.removeAttribute("disabled");
    if (globalResetBtn) globalResetBtn.removeAttribute("disabled");
    if (showAnswerBtn) showAnswerBtn.removeAttribute("disabled");

  } else {

    allButtons.forEach(btn => {
      btn.classList.add("disabled");
    });
    
    if (checkAnsBtn) checkAnsBtn.setAttribute("disabled", "true");
    if (globalResetBtn) globalResetBtn.setAttribute("disabled", "true");
    if (showAnswerBtn) showAnswerBtn.setAttribute("disabled", "true");

  }

}

const resetSettingBtn = document.getElementById("reset-setting");
if (resetSettingBtn) {
  resetSettingBtn.addEventListener("click", () => {
    selectedIcon = null;
    const handler = document.getElementById("main-handler");
    if (handler) {
      handler.classList.add("disabled-handler");
    }
    iconItems.forEach((li) => li.classList.remove("active"));
    
    // clear input preview images
    if (fullInputImg) fullInputImg.removeAttribute("src");
    if (halfInputImg) halfInputImg.removeAttribute("src");

    moveHandlerTo(markers[0]);

    updateKeyValues();
    updateCounterButtons();
  });
}

const checkAnsBtn = document.getElementById("check-ans");
if (checkAnsBtn) {
  checkAnsBtn.addEventListener("click", () => {
    const listItems = document.querySelectorAll("#count-list li");
    let allCorrect = true;
    
    listItems.forEach(li => {
      const currentCountEl = li.querySelector(".current-count");
      const currentCount = parseFloat(currentCountEl.textContent);
      const totalCount = parseFloat(li.querySelector(".total-count").textContent);
      const feedbackEl = li.querySelector(".feedback");
      
      if (currentCountEl) currentCountEl.classList.remove("wrong");

      if (feedbackEl) {
        feedbackEl.classList.remove("correct", "wrong");
        if (currentCount === totalCount) {
          feedbackEl.classList.add("correct");
        } else {
          feedbackEl.classList.add("wrong");
          if (currentCountEl) currentCountEl.classList.add("wrong");
          allCorrect = false;
        }
      }
    });

    if (allCorrect && listItems.length > 0) {
      const backdrop = document.getElementById("backdrop");
      const correctModal = document.getElementById("correct-modal");
      if (backdrop) backdrop.style.display = "block";
      if (correctModal) correctModal.style.display = "block";

      // Allow clicking the modal or backdrop (if modal is open) to dismiss it optionally
      const dismissModal = () => {
        if (correctModal) correctModal.style.display = "none";
        if (backdrop && document.getElementById("soulution-wrapper") && document.getElementById("soulution-wrapper").style.display !== "block") {
           backdrop.style.display = "none";
        }
      };

      if (correctModal) correctModal.onclick = dismissModal;
    }
  });
}

const globalResetBtn = document.getElementById("global-reset");
if (globalResetBtn) {
  globalResetBtn.addEventListener("click", () => {
    // Re-initialize lists basically, setting values back to 0. 
    // We can just rely on `loadActivity(currentActivity)` 
    // and resetting the active settings.
    const resetSettingButton = document.getElementById("reset-setting");
    if (resetSettingButton) {
      resetSettingButton.click(); 
    }
    
    const correctModal = document.getElementById("correct-modal");
    if (correctModal) correctModal.style.display = "none";
    
    const backdrop = document.getElementById("backdrop");
    if (backdrop) backdrop.style.display = "none";
    
    // Using loadActivity effectively resets all DOM states inside `#count-list` back to initialized 0 count state
    loadActivity(currentActivity);
  });
}


function moveHandlerTo(marker) {

  const offsetX = marker.x - handlerCenterX;

  handler.setAttribute("transform", `translate(${offsetX}, 0)`);

  sliderValue = marker.value;

  console.log("Slider Value:", sliderValue);

  const resetSettingBtn = document.getElementById("reset-setting");
  if (resetSettingBtn) {
    if (sliderValue > 0) {
      resetSettingBtn.classList.remove("disabled");
    } else {
      resetSettingBtn.classList.add("disabled");
    }
  }

  updateKeyValues();

  updateCounterButtons(); // ⭐ add this

  const iconWrapper = document.querySelector(".icon-wrapper");
  if (iconWrapper) {
    if (sliderValue > 0) {
      iconWrapper.classList.add("disabled-icons");
    } else {
      iconWrapper.classList.remove("disabled-icons");
    }
  }

}
  // Initialize at value-1
  moveHandlerTo(markers[0]);

  // Mouse events
  handler.addEventListener("mousedown", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const svgPoint = getSVGPoint(e, sliderSvg);
    const minX = markers[0].x;
    const maxX = markers[markers.length - 1].x;
    const clampedX = Math.min(Math.max(svgPoint.x, minX), maxX);
    moveHandlerTo(snapToClosest(clampedX));
  });

  // Touch events
  handler.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      e.preventDefault();
    },
    { passive: false },
  );

  document.addEventListener("touchend", () => {
    isDragging = false;
  });

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const svgPoint = getSVGPoint(e, sliderSvg);
      const minX = markers[0].x;
      const maxX = markers[markers.length - 1].x;
      const clampedX = Math.min(Math.max(svgPoint.x, minX), maxX);
      moveHandlerTo(snapToClosest(clampedX));
    },
    { passive: false },
  );

  const showAnswerBtn = document.getElementById("show-answer");
  const backdrop = document.getElementById("backdrop");
  const solutionWrapper = document.getElementById("soulution-wrapper");
  const closeSolutionWrapper = document.getElementById("close-solution-wrapper");
  const countListSolution = document.getElementById("count-list-solution");
  const fullInputImgSolution = document.getElementById("full-inputimg-solution");
  const halfInputImgSolution = document.getElementById("half-inputimg-solution");
  const fullCountSolution = document.getElementById("full-count-solution");
  const halfCountSolution = document.getElementById("half-count-solution");

  if (showAnswerBtn && backdrop && solutionWrapper) {
    showAnswerBtn.addEventListener("click", () => {
      backdrop.style.display = "block";
      solutionWrapper.style.display = "block";
      
      const activity = pictographData[currentActivity];
      if (!activity) return;

      countListSolution.innerHTML = "";
      
      if (selectedIcon) {
        fullInputImgSolution.src = `./assets/${selectedIcon}.svg`;
        halfInputImgSolution.src = `./assets/${selectedIcon}-half.svg`;
        halfInputImgSolution.onerror = function () {
          halfInputImgSolution.src = `./assets/${selectedIcon}.svg`;
        };
      }

      // Define fixed keys for solutions
      const activitySolutionKeys = [4, 4, 10, 10, 4];
      const solutionKey = activitySolutionKeys[currentActivity] || sliderValue;

      if (fullCountSolution) fullCountSolution.textContent = solutionKey;
      if (halfCountSolution) halfCountSolution.textContent = (solutionKey / 2).toFixed(1);

      activity.categories.forEach(category => {
        const fullIconCount = Math.floor(category.count / solutionKey);
        const remainder = category.count % solutionKey;
        const needsHalf = remainder > 0;
        
        let imagesHtml = '';
        for (let i = 0; i < fullIconCount; i++) {
          imagesHtml += `<img src="./assets/${selectedIcon}.svg" class="full-icon" alt="">`;
        }
        if (needsHalf) {
          imagesHtml += `<img src="./assets/${selectedIcon}-half.svg" onerror="this.src='./assets/${selectedIcon}.svg'" class="half-icon" alt="">`;
        }

        const li = document.createElement("li");
        li.innerHTML = `
          <div class="left-sec">
            <span class="category-name">${category.name}:</span>
            <div class="images-wrapper">${imagesHtml}</div>
          </div>
          <div class="right-sec">
            <span class="count-wrapper">
              <span class="current-count">${category.count}</span>/<span class="total-count">${category.count}</span>
            </span>
          </div>
        `;
        countListSolution.appendChild(li);
      });
    });

    closeSolutionWrapper.addEventListener("click", () => {
      backdrop.style.display = "none";
      solutionWrapper.style.display = "none";
    });
  }
});
