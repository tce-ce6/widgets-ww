document.addEventListener("DOMContentLoaded", () => {
  const CROP_DATA = {
    // Rabi Crops
    Wheat: [
      "Jammu and Kashmir",
      "Himachal Pradesh",
      "Uttarakhand",
      "Punjab",
      "Haryana",
      "Rajasthan",
      "Uttar Pradesh",
      "Bihar",
      "Jharkhand",
      "West Bengal",
      "Madhya Pradesh",
      "Gujarat",
      "Maharashtra",
    ],
    Barley: [
      "Rajasthan",
      "Uttar Pradesh",
      "Madhya Pradesh",
      "Haryana",
      "Punjab",
      "West Bengal",
    ],
    Mustard: [
      "Rajasthan",
      "Haryana",
      "Madhya Pradesh",
      "Uttar Pradesh",
      "West Bengal",
    ],
    Chickpea: [
      "Madhya Pradesh",
      "Maharashtra",
      "Rajasthan",
      "Karnataka",
      "Uttar Pradesh",
    ],
    Peas: [
      "Uttar Pradesh",
      "Madhya Pradesh",
      "Punjab",
      "Himachal Pradesh",
      "Jharkhand",
    ],

    // Kharif Crops
    "Paddy (Rice)": [
      "West Bengal",
      "Uttar Pradesh",
      "Punjab",
      "Tamil Nadu",
      "Andhra Pradesh",
      "Bihar",
      "Chhattisgarh",
      "Odisha",
      "Assam",
    ],
    Sugarcane: [
      "Uttar Pradesh",
      "Maharashtra",
      "Karnataka",
      "Tamil Nadu",
      "Bihar",
      "Gujarat",
    ],
    Cotton: [
      "Gujarat",
      "Maharashtra",
      "Telangana",
      "Karnataka",
      "Haryana",
      "Rajasthan",
    ],
    Jute: ["West Bengal", "Bihar", "Assam", "Odisha", "Meghalaya"],
    Tea: ["Assam", "West Bengal", "Tamil Nadu", "Kerala"],
    Coffee: ["Karnataka", "Kerala", "Tamil Nadu"],
    Rubber: ["Kerala", "Tamil Nadu", "Karnataka"],

    // Zaid Crops
    Watermelon: [
      "Uttar Pradesh",
      "Karnataka",
      "Tamil Nadu",
      "Andhra Pradesh",
      "Maharashtra",
    ],
    Muskmelon: [
      "Uttar Pradesh",
      "Punjab",
      "Haryana",
      "Maharashtra",
      "Andhra Pradesh",
    ],
    "Moong Dal": [
      "Rajasthan",
      "Maharashtra",
      "Karnataka",
      "Andhra Pradesh",
      "Tamil Nadu",
    ],
    Cucumber: [
      "Haryana",
      "Uttar Pradesh",
      "Karnataka",
      "Punjab",
      "Andhra Pradesh",
    ],
  };

  let currentState = {
    season: null,
    crop: null,
    selectedStates: new Set(),
    isAnswerRevealed: false,
  };

  // Elements
  const elements = {
    homeScreen: document.getElementById("btn-home-screen"),
    btnRabiHome: document.getElementById("Group_1591"),
    btnKharifHome: document.getElementById("Group_1590"),
    btnZaidHome: document.getElementById("Group_1589"),

    panelRabi: document.getElementById("btn-rabi"),
    panelKharif: document.getElementById("btn-Kharif"),
    panelZaid: document.getElementById("btn-Zaid"),

    globalButtons: document.getElementById("btn-global"),
    cropPrompt: document.getElementById(
      "Wheat_selected_This_crop_is_majorly_grown_in_13_states_UTs_across_India._Can_you_find_them_all_on_the_map_",
    ),

    gotItBtn: document.getElementById("Group_1614"),
    submitBtn: document.getElementById("btn-submit"),
    showAnswerBtn: document.getElementById("btn-show-answer"),
    homeBtn: document.getElementById("Group_1592"),

    feedbackIncorrectPopup: document.getElementById("feedback-incorrect-state"),
    gotItIncorrectBtn: document.getElementById("Group_16141"),

    feedbackCorrectPopup: document.getElementById("feedback-end-crop"),
    factsheetBtn: document.getElementById("Group_1616"),

    factsheet: document.getElementById("popup-factsheet"),
    tryAnotherCropBtn: document.getElementById("Group_16161"),

    mapContainer: document.getElementById("state-map-clickable"),
    croplabel: document.getElementById("crop-label"),
    panel01buttons: document.getElementById("panel-01-buttons"),
    itextActivity: document.getElementById("i-text-activity"),
    panel02map: document.getElementById("panel-02-map"),
    itextcropmap: document.getElementById("i-text-crop-map"),
    iTextHomeScreen: document.getElementById("i-text-home-screen"),
  };

  // Initialize visibility
  const hideAll = () => {
    [
      elements.homeScreen,
      elements.panelRabi,
      elements.panelKharif,
      elements.panelZaid,
      elements.globalButtons,
      elements.cropPrompt,
      elements.feedbackIncorrectPopup,
      elements.feedbackCorrectPopup,
      elements.factsheet,
    ].forEach((el) => {
      if (el) {
        el.style.display = "none";
        el.classList.add("st170"); // Ensure it takes the CSS property if present
      }
    });
  };

  const showHome = () => {
    hideAll();
    if (elements.homeScreen) {
      elements.homeScreen.style.display = "block";
      elements.homeScreen.classList.remove("st170");
    }
    resetMapHighlights();
    currentState = {
      season: null,
      crop: null,
      selectedStates: new Set(),
      isAnswerRevealed: false,
    };
  };

  // Dynamic State Identification
  const getTargetStateName = (path) => {
    const pRect = path.getBoundingClientRect();
    const pCenter = {
      x: pRect.left + pRect.width / 2,
      y: pRect.top + pRect.height / 2,
    };

    // Target groups with state IDs and common state labels
    const labels = Array.from(
      document.querySelectorAll(
        "g[id].st37 text, text.st29, text.st51, text.st30, text.st46, text.st40",
      ),
    );

    let closest = null;
    let minDist = Infinity;

    labels.forEach((l) => {
      const text = l.textContent.trim();
      if (
        text.length < 3 ||
        /^\d+$/.test(text) ||
        text.includes("Season") ||
        text.includes("Got it") ||
        text.toLowerCase().includes("major") ||
        text.includes("?")
      )
        return;

      const lRect = l.getBoundingClientRect();
      const lCenter = {
        x: lRect.left + lRect.width / 2,
        y: lRect.top + lRect.height / 2,
      };

      const dist = Math.sqrt(
        Math.pow(pCenter.x - lCenter.x, 2) + Math.pow(pCenter.y - lCenter.y, 2),
      );

      if (dist < minDist) {
        minDist = dist;
        closest = text;
      }
    });

    return closest;
  };

  const highlightState = (stateName, isCorrect) => {
    const paths = Array.from(elements.mapContainer.querySelectorAll("path"));
    paths.forEach((p) => {
      if (getTargetStateName(p) === stateName) {
        p.style.fill = isCorrect ? "#FFEB3B" : "#F44336";
        p.style.opacity = "0.7";
        p.classList.remove("st170"); // Ensure not hidden by class
      }
    });
  };

  const resetMapHighlights = () => {
    if (!elements.mapContainer) return;
    const paths = Array.from(elements.mapContainer.querySelectorAll("path"));
    paths.forEach((p) => {
      p.style.fill = "";
      p.style.opacity = "";
    });
  };

  const handleStateClick = (e) => {
    const path = e.target.closest("path");
    if (!path || !currentState.crop || currentState.isAnswerRevealed) return;

    const stateName = getTargetStateName(path);
    if (!stateName) return;

    console.log("Clicked state:", stateName);

    const correctStates = CROP_DATA[currentState.crop] || [];
    if (correctStates.includes(stateName)) {
      if (!currentState.selectedStates.has(stateName)) {
        currentState.selectedStates.add(stateName);
        highlightState(stateName, true);
      }
    } else {
      highlightState(stateName, false);
      if (elements.feedbackIncorrectPopup) {
        elements.feedbackIncorrectPopup.style.display = "block";
        elements.feedbackIncorrectPopup.classList.remove("st170");
      }
    }
  };

  const selectSeason = (season) => {
    console.log("Selecting season:", season);
    currentState.season = season;
    hideAll();
    let panel;
    if (season === "Rabi") panel = elements.panelRabi;
    if (season === "Kharif") panel = elements.panelKharif;
    if (season === "Zaid") panel = elements.panelZaid;

    if (panel) {
      panel.style.display = "block";
      panel.classList.remove("st170");
      elements.croplabel.classList.remove("st170");
      elements.iTextHomeScreen.classList.add("st170");
      elements.itextActivity.classList.remove("st170");
      elements.panel02map.classList.remove("st170");
      elements.itextcropmap.classList.remove("st170");
      elements.globalButtons.classList.remove("st170");
      elements.mapContainer.classList.remove("st170");
      elements.panel01buttons.classList.remove("st170");
    }
  };

  const selectCrop = (crop) => {
    console.log("Selecting crop:", crop);
    currentState.crop = crop;
    hideAll();
    if (elements.cropPrompt) {
      elements.cropPrompt.style.display = "block";
      elements.cropPrompt.classList.remove("st170");

      const promptText = elements.cropPrompt.querySelector("text tspan");
      if (promptText) {
        const count = CROP_DATA[crop]?.length || 0;
        promptText.textContent = `${crop} major production is in ${count} states/UTs. Can you find them all?`;
      }
    }
  };

  // Event Listeners for Season Buttons (Home Screen)
  elements.btnRabiHome?.addEventListener("click", () => selectSeason("Rabi"));
  elements.btnKharifHome?.addEventListener("click", () =>
    selectSeason("Kharif"),
  );
  elements.btnZaidHome?.addEventListener("click", () => selectSeason("Zaid"));

  // Event Listeners for Crop Buttons
  // Rabi
  document
    .getElementById("Wheat")
    ?.addEventListener("click", () => selectCrop("Wheat"));
  document
    .getElementById("Barley")
    ?.addEventListener("click", () => selectCrop("Barley"));
  document
    .getElementById("Mustard")
    ?.addEventListener("click", () => selectCrop("Mustard"));
  document
    .getElementById("Chickpea")
    ?.addEventListener("click", () => selectCrop("Chickpea"));
  document
    .getElementById("Peas")
    ?.addEventListener("click", () => selectCrop("Peas"));

  // Kharif
  const riceBtn =
    document.getElementById("Paddy_Rice_") ||
    document.getElementById("Paddy_Rice_1");
  riceBtn?.addEventListener("click", () => selectCrop("Paddy (Rice)"));
  document
    .getElementById("Sugarcane")
    ?.addEventListener("click", () => selectCrop("Sugarcane"));
  document
    .getElementById("Cotton")
    ?.addEventListener("click", () => selectCrop("Cotton"));
  document
    .getElementById("Jute")
    ?.addEventListener("click", () => selectCrop("Jute"));
  document
    .getElementById("Tea")
    ?.addEventListener("click", () => selectCrop("Tea"));
  document
    .getElementById("Coffee")
    ?.addEventListener("click", () => selectCrop("Coffee"));
  document
    .getElementById("Rubber")
    ?.addEventListener("click", () => selectCrop("Rubber"));

  // Zaid
  document
    .getElementById("Watermelon")
    ?.addEventListener("click", () => selectCrop("Watermelon"));
  document
    .getElementById("Muskmelon")
    ?.addEventListener("click", () => selectCrop("Muskmelon"));
  document
    .getElementById("Moong_Dal")
    ?.addEventListener("click", () => selectCrop("Moong Dal"));
  document
    .getElementById("Cucumber")
    ?.addEventListener("click", () => selectCrop("Cucumber"));

  // Popup Controls
  elements.gotItBtn?.addEventListener("click", () => {
    if (elements.cropPrompt) {
      elements.cropPrompt.style.display = "none";
      elements.cropPrompt.classList.add("st170");
    }
    if (elements.globalButtons) {
      elements.globalButtons.style.display = "block";
      elements.globalButtons.classList.remove("st170");
    }
  });

  elements.gotItIncorrectBtn?.addEventListener("click", () => {
    if (elements.feedbackIncorrectPopup) {
      elements.feedbackIncorrectPopup.style.display = "none";
      elements.feedbackIncorrectPopup.classList.add("st170");
    }
  });

  elements.factsheetBtn?.addEventListener("click", () => {
    if (elements.feedbackCorrectPopup) {
      elements.feedbackCorrectPopup.style.display = "none";
      elements.feedbackCorrectPopup.classList.add("st170");
    }
    if (elements.factsheet) {
      elements.factsheet.style.display = "block";
      elements.factsheet.classList.remove("st170");
    }
  });

  elements.tryAnotherCropBtn?.addEventListener("click", () => {
    showHome();
  });

  // Global Buttons
  elements.submitBtn?.addEventListener("click", () => {
    const correctStates = CROP_DATA[currentState.crop] || [];
    if (currentState.selectedStates.size === correctStates.length) {
      if (elements.feedbackCorrectPopup) {
        elements.feedbackCorrectPopup.style.display = "block";
        elements.feedbackCorrectPopup.classList.remove("st170");
      }
    } else {
      alert(
        `Keep searching! You've found ${currentState.selectedStates.size} out of ${correctStates.length} states.`,
      );
    }
  });

  elements.showAnswerBtn?.addEventListener("click", () => {
    const correctStates = CROP_DATA[currentState.crop] || [];
    correctStates.forEach((s) => highlightState(s, true));
    currentState.isAnswerRevealed = true;
    setTimeout(() => {
      if (elements.feedbackCorrectPopup) {
        elements.feedbackCorrectPopup.style.display = "block";
        elements.feedbackCorrectPopup.classList.remove("st170");
      }
    }, 2000);
  });

  elements.homeBtn?.addEventListener("click", () => {
    showHome();
  });

  if (elements.mapContainer) {
    elements.mapContainer.addEventListener("click", handleStateClick);
  }

  // Initial call
  
});
