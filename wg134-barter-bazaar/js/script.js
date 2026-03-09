document.addEventListener("DOMContentLoaded", () => {
  const enterBtn =
    document.getElementById("enter-btn") || document.getElementById("Enter");
  const launchScreen =
    document.getElementById("launch-screen") ||
    document.getElementById("intro-screen");

  if (enterBtn && launchScreen) {
    enterBtn.style.cursor = "pointer";
    enterBtn.addEventListener("click", () => {
      launchScreen.style.display = "none";
      launchScreen.classList.add("hidden-svg");
      initWidget();
    });
  } else {
    initWidget();
  }
});

function initWidget() {
  const container = document.getElementById("widget-container");
  const svg = document.querySelector("svg");
  if (!container || !svg) return;

  // Build UI Layer
  let uiLayer = document.getElementById("ui-layer");
  if (!uiLayer) {
    uiLayer = document.createElement("div");
    uiLayer.id = "ui-layer";
    uiLayer.style.position = "absolute";
    uiLayer.style.top = "0";
    uiLayer.style.left = "0";
    uiLayer.style.width = "100%";
    uiLayer.style.height = "100%";
    uiLayer.style.pointerEvents = "none";
    container.appendChild(uiLayer);
  }

  // --- Helpers ---
  function getPctRect(element) {
    if (!element) return null;
    const svgRect = svg.getBoundingClientRect();
    const elRect = element.getBoundingClientRect();
    return {
      left: ((elRect.left - svgRect.left) / svgRect.width) * 100 + "%",
      top: ((elRect.top - svgRect.top) / svgRect.height) * 100 + "%",
      width: (elRect.width / svgRect.width) * 100 + "%",
      height: (elRect.height / svgRect.height) * 100 + "%",
    };
  }

  function hideElements(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      // Use hidden-svg class or fallback
      el.classList.add("hidden-svg");
    });
  }

  function showElements(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.remove("hidden-svg");
    });
  }

  function togglePopup(popupId, show) {
    const p = document.getElementById(popupId);
    if (p) {
      if (show) {
        p.classList.remove("hidden-svg");
        p.style.display = "block";
      } else {
        p.classList.add("hidden-svg");
        p.style.display = "none";
      }
    }
  }

  // Hide all screens initially and map out popups
  const allScreens = [
    "menu-screen",
    "act-01-sc1-base",
    "act-01-sc1-cards",
    "act-02-base-global",
    "act-02-sc1",
    "act-02-sc2",
    "act-02-sc3",
    "act-03-base-global",
    "act-03-sc1",
    "act-03-sc2",
    "act-03-sc3",
    "act-04-base",
    "act-04-question",
    "act-04-feedback-end",
  ];

  // Global variables
  let currentScreen = 0; // 0=Menu, 1=Intro, 2=Scen2, 3=Scen3, 4=Checklist
  let currentChallengeSC2 = 1; // 1 to 3
  let currentChallengeSC3 = 1; // 1 to 3

  // Hide everything first
  const menuScreen = document.getElementById("menu-screen");
  if (menuScreen) menuScreen.classList.add("hidden-svg");

  document
    .querySelectorAll('[id^="act-"]')
    .forEach((el) => el.classList.add("hidden-svg"));
  document
    .querySelectorAll('[id^="popup-"]')
    .forEach((el) => el.classList.add("hidden-svg"));

  // --- Menu Setup ---
  const menuScen1 = document.getElementById("Scenario_1");
  const menuScen2 = document.getElementById("Scenario_2");
  const menuScen3 = document.getElementById("Scenario_3");

  if (menuScen1) {
    menuScen1.style.cursor = "pointer";
    menuScen1.addEventListener("click", () => {
      currentScreen = 1;
      updateView();
    });
  }
  if (menuScen2) {
    menuScen2.style.cursor = "pointer";
    menuScen2.addEventListener("click", () => {
      currentScreen = 2;
      currentChallengeSC2 = 1;
      updateView();
    });
  }
  if (menuScen3) {
    menuScen3.style.cursor = "pointer";
    menuScen3.addEventListener("click", () => {
      currentScreen = 3;
      currentChallengeSC3 = 1;
      updateView();
    });
  }

  // --- Navigation Setup ---
  const btnNext = document.getElementById("Next");
  const btnBack = document.getElementById("Back");
  const btnHome = document.getElementById("btn-home");
  const btnInsights = document.getElementById("btn-insights");
  const globalSubmit = document.getElementById("Submit");

  if (btnNext) {
    btnNext.style.cursor = "pointer";
    btnNext.addEventListener("click", goNext);
  }
  if (btnBack) {
    btnBack.style.cursor = "pointer";
    btnBack.addEventListener("click", goBack);
  }
  if (btnHome) {
    btnHome.style.cursor = "pointer";
    btnHome.addEventListener("click", () => {
      currentScreen = 0; // go back to menu
      updateView();
    });
  }

  // Dynamic Insight Popups
  if (btnInsights) {
    btnInsights.style.cursor = "pointer";
    btnInsights.addEventListener("click", () => {
      let pId = `popup-act-0${currentScreen}-insights`;
      if (currentScreen === 4 || currentScreen === 0)
        pId = `popup-act-01-insights`; // fallback
      togglePopup(pId, true);
    });
  }
  // Click anywhere to close popups
  document.querySelectorAll('[id^="popup-"]').forEach((p) => {
    p.addEventListener("click", () => p.classList.add("hidden-svg"));
  });

  function goNext() {
    if (currentScreen === 2) {
      if (currentChallengeSC2 < 3) currentChallengeSC2++;
      else currentScreen = 3;
    } else if (currentScreen === 3) {
      if (currentChallengeSC3 < 3) currentChallengeSC3++;
      else currentScreen = 4;
    } else if (currentScreen < 4) {
      currentScreen++;
    }
    updateView();
  }

  function goBack() {
    if (currentScreen === 2) {
      if (currentChallengeSC2 > 1) currentChallengeSC2--;
      else currentScreen = 1;
    } else if (currentScreen === 3) {
      if (currentChallengeSC3 > 1) currentChallengeSC3--;
      else {
        currentScreen = 2;
        currentChallengeSC2 = 3;
      }
    } else if (currentScreen > 1) {
      currentScreen--;
      if (currentScreen === 3) currentChallengeSC3 = 3;
      if (currentScreen === 2) currentChallengeSC2 = 3;
    }
    updateView();
  }

  function updateView() {
    uiLayer.innerHTML = ""; // clear dynamic overlays

    // Hide menu explicitly first
    if (menuScreen) menuScreen.classList.add("hidden-svg");

    document
      .querySelectorAll('[id^="act-"]')
      .forEach((el) => el.classList.add("hidden-svg"));

    // Handle Menu
    if (currentScreen === 0) {
      if (menuScreen) menuScreen.classList.remove("hidden-svg");
    } else if (currentScreen === 1) {
      showElements('[id^="act-01"]');
    } else if (currentScreen === 2) {
      showElements("#act-02-base-global");
      showElements(`[id^="act-02-sc${currentChallengeSC2}"]`);
      // Hide feedbacks initially
      hideElements(`[id^="act-02-sc${currentChallengeSC2}-feedback"]`);
      setupScreen2Challenge(currentChallengeSC2);
    } else if (currentScreen === 3) {
      showElements("#act-03-base-global");
      showElements(`[id^="act-03-sc${currentChallengeSC3}"]`);
      hideElements(`[id^="act-03-sc${currentChallengeSC3}-feedback"]`);
      setupScreen3Challenge(currentChallengeSC3);
    } else if (currentScreen === 4) {
      showElements("#act-04-base");
      showElements("#act-04-question");
      showElements("#act-04-checkbox-default");
      hideElements("#act-04-checkbox-selected");
      hideElements("#act-04-feedback-end");
      setupScreen4();
    }
  }

  // --- Screen 2 Logic ---
  const sc2Config = {
    1: { max1: 10, max2: 10, val1: 2, val2: 4 }, // Rice (2) vs Cloth (4)
    2: { max1: 15, max2: 15, val1: 1, val2: 3 }, // Pot (1) vs Medical (3)
    3: { max1: 15, max2: 15, val1: 3, val2: 4 }, // Fish (3) vs Plough (4)
  };

  function setupScreen2Challenge(sc) {
    const cfg = sc2Config[sc];
    if (!cfg) return;

    // Find the dropdown bounding rects provided in the SVG
    // They are often named like act-02-scX-dropdown-list-1, -2
    // If exact IDs differ, we try generic text nodes matching numbers
    let dd1 =
      document.querySelector(`[id*="act-02-sc${sc}-dropdown"][id*="list-1"]`) ||
      document.querySelector(`[id*="act-02-sc${sc}"] [id*="drop"] g`);
    let dd2 =
      document.querySelector(`[id*="act-02-sc${sc}-dropdown"][id*="list-2"]`) ||
      document.querySelectorAll(`[id*="act-02-sc${sc}"] [id*="drop"]`)[1];

    // Create selects
    const s1 = document.createElement("select");
    const s2 = document.createElement("select");
    s1.className = "custom-dropdown";
    s2.className = "custom-dropdown";

    // Add options
    for (let i = 1; i <= cfg.max1; i++) s1.add(new Option(i, i));
    for (let i = 1; i <= cfg.max2; i++) s2.add(new Option(i, i));

    // Wait a brief moment for layout inside the function scope if required, but we should be fine here.
    if (dd1 && dd2) {
      hideElements(`[id="${dd1.id}"]`);
      hideElements(`[id="${dd2.id}"]`);

      const r1 = getPctRect(dd1);
      const r2 = getPctRect(dd2);

      if (r1) {
        Object.assign(s1.style, {
          left: r1.left,
          top: r1.top,
          width: r1.width,
          height: r1.height,
        });
        uiLayer.appendChild(s1);
      }
      if (r2) {
        Object.assign(s2.style, {
          left: r2.left,
          top: r2.top,
          width: r2.width,
          height: r2.height,
        });
        uiLayer.appendChild(s2);
      }
    } else {
      // Hardcoded fallback bounding boxes per challenge if SVG IDs are missing
      const fbBoxes = {
        1: [
          { l: "18%", t: "44%", w: "10%", h: "5%" },
          { l: "65%", t: "44%", w: "10%", h: "5%" },
        ],
        2: [
          { l: "18%", t: "44%", w: "10%", h: "5%" },
          { l: "65%", t: "44%", w: "10%", h: "5%" },
        ],
        3: [
          { l: "18%", t: "44%", w: "10%", h: "5%" },
          { l: "65%", t: "44%", w: "10%", h: "5%" },
        ],
      };
      const b = fbBoxes[sc];
      Object.assign(s1.style, {
        left: b[0].l,
        top: b[0].t,
        width: b[0].w,
        height: b[0].h,
      });
      uiLayer.appendChild(s1);
      Object.assign(s2.style, {
        left: b[1].l,
        top: b[1].t,
        width: b[1].w,
        height: b[1].h,
      });
      uiLayer.appendChild(s2);
    }

    // Submit handler logic
    const scSubmit =
      document.querySelector(`[id="act-02-sc${sc}-btn"]`) || globalSubmit;
    if (scSubmit) {
      // Use clone to remove old listeners
      const newSubmit = scSubmit.cloneNode(true);
      scSubmit.parentNode.replaceChild(newSubmit, scSubmit);
      newSubmit.style.cursor = "pointer";

      newSubmit.addEventListener("click", () => {
        let v1 = parseInt(s1.value);
        let v2 = parseInt(s2.value);
        if (v1 * cfg.val1 === v2 * cfg.val2) {
          // Fair Trade
          showElements(`[id*="act-02-sc${sc}-feedback-correct"]`);
          hideElements(`[id*="act-02-sc${sc}-feedback-incorrect"]`);
          // Show continue or end
          showElements(`[id*="act-02-sc${sc}-feedback-end"]`); // sometimes the success is feedback-end
        } else {
          // Unfair
          showElements(`[id*="act-02-sc${sc}-feedback-incorrect"]`);
          hideElements(`[id*="act-02-sc${sc}-feedback-correct"]`);
        }
      });
    }

    // Hide standard continue/incorrect states
    document
      .querySelectorAll(`[id*="Continue"]`)
      .forEach((el) => el.classList.add("hidden-svg"));
  }

  // --- Screen 3 Logic ---
  function setupScreen3Challenge(sc) {
    // There are 3 challenges here. Multi-step trade tracking
    // We assume the sequence clicks are just revealing lines/cards.
    // In SVGs usually act-03-scX-cardN-selected needs to be toggled
    const maxCards = sc === 3 ? 4 : 3; // sc3 has 4 cards
    let currentStep = 1;

    // Hide all selections
    for (let i = 1; i <= maxCards; i++) {
      hideElements(`[id="act-03-sc${sc}-card${i}-selected"]`);
    }

    // Attempt to bind clicks on the base cards to advance step
    // A simple hack is just a transparent overlay covering the whole trade chain area
    // that advances the step on click.
    // We will place a big invisible clickable div
    const clickArea = document.createElement("div");
    clickArea.style.position = "absolute";
    clickArea.style.top = "30%";
    clickArea.style.left = "10%";
    clickArea.style.width = "80%";
    clickArea.style.height = "40%";
    clickArea.style.cursor = "pointer";
    uiLayer.appendChild(clickArea);

    clickArea.onclick = () => {
      if (currentStep <= maxCards) {
        showElements(`[id="act-03-sc${sc}-card${currentStep}-selected"]`);
        currentStep++;
        if (currentStep > maxCards) {
          showElements(`[id="act-03-sc${sc}-feedback-end"]`);
          clickArea.style.pointerEvents = "none"; // disable further clicks
        }
      }
    };
  }

  // --- Screen 4 Logic ---
  function setupScreen4() {
    // 8 statements. Correct are 1, 2, 3, 4, 7 (index 0,1,2,3,6)
    const defGroup = document.getElementById("act-04-checkbox-default");
    const selGroup = document.getElementById("act-04-checkbox-selected");
    if (!defGroup || !selGroup) return;

    // Remove hidden-svg to work with them
    defGroup.classList.remove("hidden-svg");
    selGroup.classList.remove("hidden-svg");

    // Convert child paths/groups into arrays
    // We expect 8 graphical checkboxes in each group
    const defs = Array.from(defGroup.children);
    const sels = Array.from(selGroup.children);
    if (defs.length < 8 || sels.length < 8) return;

    const corrects = [0, 1, 2, 3, 6];
    const isSelected = [false, false, false, false, false, false, false, false];

    // Hide selections initially
    sels.forEach((s) => s.classList.add("hidden-svg"));

    // Bind click to the SVG directly via rectangles
    // SVG text and paths have pointer events out of the box
    defs.forEach((defEl, i) => {
      defEl.style.cursor = "pointer";
      // Actually we'll bind an absolute div over each checkbox using bounds
      const rect = getPctRect(defEl);
      if (rect) {
        const d = document.createElement("div");
        Object.assign(d.style, {
          position: "absolute",
          left: rect.left,
          top: rect.top,
          width: "5%", // rough wide area for ease of click
          height: rect.height,
          cursor: "pointer",
          pointerEvents: "auto",
        });
        uiLayer.appendChild(d);

        d.onclick = () => {
          isSelected[i] = !isSelected[i];
          if (isSelected[i]) {
            defEl.classList.add("hidden-svg");
            sels[i].classList.remove("hidden-svg");
          } else {
            defEl.classList.remove("hidden-svg");
            sels[i].classList.add("hidden-svg");
          }
        };
      }
    });

    // Validating on Submit
    const sSubmit =
      document.querySelector('[id*="act-04-btn"]') || globalSubmit;
    if (sSubmit) {
      const newSubmit = sSubmit.cloneNode(true);
      sSubmit.parentNode.replaceChild(newSubmit, sSubmit);
      newSubmit.style.cursor = "pointer";

      newSubmit.addEventListener("click", () => {
        let allCorrect = true;
        for (let i = 0; i < 8; i++) {
          if (corrects.includes(i) && !isSelected[i]) allCorrect = false;
          if (!corrects.includes(i) && isSelected[i]) allCorrect = false;
        }
        if (allCorrect) {
          showElements("#act-04-feedback-end");
          hideElements("#act-04-feedback-incorrect");
        } else {
          // generic incorrect visual if any
          showElements("#act-04-feedback-incorrect");
        }
      });
    }
  }

  // Launch View
  updateView();
}
