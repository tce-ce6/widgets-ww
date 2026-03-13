document.addEventListener("DOMContentLoaded", () => {
  const enterBtn =
    document.getElementById("enter-btn") || document.getElementById("Enter");
  const launchScreen =
    document.getElementById("launch-screen") ||
    document.getElementById("intro-screen");

  if (enterBtn && launchScreen) {
    enterBtn.style.cursor = "pointer";
    enterBtn.onclick = () => {
      launchScreen.classList.add("st767");
      initWidget();
    };
  } else {
    initWidget();
  }
});

function initWidget() {
  // const container = document.getElementById("widget-container") || document.getElementById("idiom-wrapper");
  // const svg = document.querySelector("svg");
  // if (!container || !svg) return;

  // // Global variables
  // const uiLayer = document.getElementById("ui-layer") || createUILayer(container);

  function createUILayer(parent) {
    const layer = document.createElement("div");
    layer.id = "ui-layer";
    Object.assign(layer.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "100"
    });
    parent.appendChild(layer);
    return layer;
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
      el.classList.add("st767");
    });
  }

  function showElements(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.remove("st767");
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
    "btn-home",
    "btn-insights",
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
  if (menuScreen) menuScreen.classList.remove("st767");

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
    if (currentScreen === 0) {
      currentScreen = 1;
    } else if (currentScreen === 1) {
      currentScreen = 2;
      currentChallengeSC2 = 1;
    } else if (currentScreen === 2) {
      if (currentChallengeSC2 < 3) currentChallengeSC2++;
      else {
        currentScreen = 3;
        currentChallengeSC3 = 1;
      }
    } else if (currentScreen === 3) {
      if (currentChallengeSC3 < 3) currentChallengeSC3++;
      else currentScreen = 4;
    }
    updateView();
  }

  function goBack() {
    if (currentScreen === 4) {
      currentScreen = 3;
      currentChallengeSC3 = 3;
    } else if (currentScreen === 3) {
      if (currentChallengeSC3 > 1) currentChallengeSC3--;
      else {
        currentScreen = 2;
        currentChallengeSC2 = 3;
      }
    } else if (currentScreen === 2) {
      if (currentChallengeSC2 > 1) currentChallengeSC2--;
      else currentScreen = 1;
    } else if (currentScreen === 1) {
      currentScreen = 0;
    }
    updateView();
  }

  function updateView() {

    if (menuScreen) menuScreen.classList.add("st767");
    // document
    //   .querySelectorAll('[id^="act-"]')
    //   .forEach((el) => el.classList.add("hidden-svg"));
    btnHome.classList.remove("st767");
    btnInsights.classList.remove("st767")
    // Handle Menu
    if (currentScreen === 0) {
      if (menuScreen) menuScreen.classList.remove("st767");
      allScreens.forEach((s) => {
        let d = document.getElementById(s)
        if (d) {
          d.classList.add("st767")
        }
      })
    } else if (currentScreen === 1) {
      showElements("#act-01-sc1-base");
      showElements("#act-01-sc1-cards");
      hideElements("#act-01-sc1-cards-selected");
      hideElements("#act-01-sc1-cards-matched");
      hideElements('[id^="act-01-sc1-feedback"]');
      setupScreen1();
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

  // --- Screen 1 Logic ---
  function setupScreen1() {
    const traders = ["Farmer", "Weaver", "Doctor", "Teacher", "Fisherman", "Plumber", "Potter", "Carpenter"];
    const pairs = {
      "Farmer": "Weaver", "Weaver": "Farmer",
      "Doctor": "Teacher", "Teacher": "Doctor",
      "Fisherman": "Plumber", "Plumber": "Fisherman",
      "Potter": "Carpenter", "Carpenter": "Potter"
    };

    let selectedTrader = null;
    let matchedTraders = new Set();

    traders.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      el.style.cursor = "pointer";

      // Create a transparent overlay for easier clicking
      // const rect = getPctRect(el);
      // if (rect) {
      //   const overlay = document.createElement("div");
      //   overlay.id = `overlay-${id}`;
      //   Object.assign(overlay.style, {
      //     position: "absolute",
      //     left: rect.left,
      //     top: rect.top,
      //     width: rect.width,
      //     height: rect.height,
      //     cursor: "pointer",
      //     pointerEvents: "auto",
      //     zIndex: "10"
      //   });
      //   uiLayer.appendChild(overlay);

      //   overlay.onclick = () => {
      //     if (matchedTraders.has(id)) return;

      //     if (!selectedTrader) {
      //       selectedTrader = id;
      //       // Highlight selection (e.g., yellow)
      //       el.style.filter = "drop-shadow(0 0 5px yellow)";
      //     } else if (selectedTrader === id) {
      //       // Deselect
      //       el.style.filter = "none";
      //       selectedTrader = null;
      //     } else {
      //       // Try to match
      //       if (pairs[selectedTrader] === id) {
      //         // Match Success
      //         matchedTraders.add(id);
      //         matchedTraders.add(selectedTrader);

      //         // Green highlight
      //         const sEl = document.getElementById(selectedTrader);
      //         if (sEl) {
      //           sEl.style.filter = "drop-shadow(0 0 10px green)";
      //           addTradedTag(selectedTrader);
      //         }
      //         el.style.filter = "drop-shadow(0 0 10px green)";
      //         addTradedTag(id);

      //         // Remove overlays to disable clicks
      //         document.getElementById(`overlay-${id}`)?.remove();
      //         document.getElementById(`overlay-${selectedTrader}`)?.remove();

      //         selectedTrader = null;

      //         // Feedback
      //         showFeedbackPopup("Well Done! You successfully helped people trade with each other.", true);

      //         if (matchedTraders.size === traders.length) {
      //           // All matched
      //           // User can click Next
      //         }
      //       } else {
      //         // Match Fail
      //         const sEl = document.getElementById(selectedTrader);
      //         if (sEl) sEl.style.filter = "none";
      //         selectedTrader = null;
      //         showFeedbackPopup("Trade failed. Try again. Their needs don’t match.", false);
      //       }
      //     }
      //   };
      // }
    });

    function addTradedTag(traderId) {
      const el = document.getElementById(traderId);
      const rect = getPctRect(el);
      if (rect) {
        const tag = document.createElement("div");
        tag.textContent = "Traded";
        Object.assign(tag.style, {
          position: "absolute",
          left: rect.left,
          top: `calc(${rect.top} + ${rect.height} - 10px)`,
          width: rect.width,
          textAlign: "center",
          color: "white",
          backgroundColor: "green",
          fontSize: "12px",
          fontWeight: "bold",
          padding: "2px 0",
          borderRadius: "4px",
          zIndex: "20",
          pointerEvents: "none"
        });
        uiLayer.appendChild(tag);
      }
    }
  }

  function showFeedbackPopup(text, isSuccess) {
    // We can use a generic feedback popup if available, or create one
    // Searching for generic popups in index.html
    let popup = document.getElementById("feedback-popup-sc1");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "feedback-popup-sc1";
      Object.assign(popup.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        backgroundColor: "white",
        border: "3px solid " + (isSuccess ? "green" : "red"),
        borderRadius: "10px",
        zIndex: "1000",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        pointerEvents: "auto"
      });
      uiLayer.appendChild(popup);
    }
    popup.innerHTML = `<h3>${isSuccess ? "Success" : "Failed"}</h3><p>${text}</p><button id="close-fb">OK</button>`;
    popup.style.display = "block";
    document.getElementById("close-fb").onclick = () => {
      popup.style.display = "none";
    };
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

    // The dropdown boxes in SVG are act-02-scX-dropdown-list-1, -2
    let dd1 = document.getElementById(`act-02-sc${sc}-dropdown-list-1`);
    let dd2 = document.getElementById(`act-02-sc${sc}-dropdown-list-2`);

    // Create selects
    const s1 = document.createElement("select");
    const s2 = document.createElement("select");
    s1.className = "custom-dropdown";
    s2.className = "custom-dropdown";

    // Add options
    for (let i = 1; i <= cfg.max1; i++) s1.add(new Option(i, i));
    for (let i = 1; i <= cfg.max2; i++) s2.add(new Option(i, i));

    if (dd1 && dd2) {
      const r1 = getPctRect(dd1);
      const r2 = getPctRect(dd2);

      // Hide the SVG placeholders
      dd1.classList.add("hidden-svg");
      dd2.classList.add("hidden-svg");

      if (r1) {
        Object.assign(s1.style, {
          left: r1.left,
          top: r1.top,
          width: r1.width,
          height: r1.height,
          pointerEvents: "auto",
        });
        uiLayer.appendChild(s1);
      }
      if (r2) {
        Object.assign(s2.style, {
          left: r2.left,
          top: r2.top,
          width: r2.width,
          height: r2.height,
          pointerEvents: "auto",
        });
        uiLayer.appendChild(s2);
      }
    } else {
      // Hardcoded fallback bounding boxes per challenge if SVG IDs are missing
      const fbBoxes = {
        1: [
          { l: "18%", t: "44.5%", w: "11%", h: "5.5%" },
          { l: "64.5%", t: "44.5%", w: "11%", h: "5.5%" },
        ],
        2: [
          { l: "18%", t: "44.5%", w: "11%", h: "5.5%" },
          { l: "64.5%", t: "44.5%", w: "11%", h: "5.5%" },
        ],
        3: [
          { l: "18%", t: "44.5%", w: "11%", h: "5.5%" },
          { l: "64.5%", t: "44.5%", w: "11%", h: "5.5%" },
        ],
      };
      const b = fbBoxes[sc];
      Object.assign(s1.style, {
        left: b[0].l,
        top: b[0].t,
        width: b[0].w,
        height: b[0].h,
        pointerEvents: "auto",
      });
      uiLayer.appendChild(s1);
      Object.assign(s2.style, {
        left: b[1].l,
        top: b[1].t,
        width: b[1].w,
        height: b[1].h,
        pointerEvents: "auto",
      });
      uiLayer.appendChild(s2);
    }

    // Show Answer logic
    const showAnsBtn = document.querySelectorAll('[id^="Show_Answer"]')[sc - 1];
    if (showAnsBtn) {
      showAnsBtn.style.cursor = "pointer";
      showAnsBtn.onclick = () => {
        // Find first fair trade values
        let f1 = 0, f2 = 0;
        if (sc === 1) { f1 = 2; f2 = 1; }
        else if (sc === 2) { f1 = 3; f2 = 1; }
        else if (sc === 3) { f1 = 4; f2 = 3; }
        s1.value = f1;
        s2.value = f2;
      };
    }

    // Submit handler logic
    const scSubmit =
      document.getElementById(`act-02-sc${sc}-btn`) || globalSubmit;
    if (scSubmit) {
      scSubmit.style.cursor = "pointer";
      scSubmit.onclick = () => {
        let v1 = parseInt(s1.value);
        let v2 = parseInt(s2.value);
        if (v1 * cfg.val1 === v2 * cfg.val2) {
          // Fair Trade
          showElements(`#act-02-sc${sc}-feedback-correct`);
          hideElements(`#act-02-sc${sc}-feedback-incorrect`);
          showFeedbackPopup("It is a fair trade! The values are matching.", true);
          showElements(`#act-02-sc${sc}-feedback-end`);
        } else {
          // Unfair
          showElements(`#act-02-sc${sc}-feedback-incorrect`);
          hideElements(`#act-02-sc${sc}-feedback-correct`);
          showFeedbackPopup("It is an unfair trade! The values do not match. Try again!", false);
          hideElements(`#act-02-sc${sc}-feedback-end`);
        }
      };
    }
  }

  // --- Screen 3 Logic ---
  function setupScreen3Challenge(sc) {
    const chainConfig = {
      1: ["Farmer", "Fisherman", "Plumber"],
      2: ["Teacher", "Potter", "Carpenter"],
      3: ["Potter", "Farmer", "Weaver", "Doctor"]
    };
    const sequence = chainConfig[sc];
    let currentStep = 0;

    // Hide all selections initially
    for (let i = 1; i <= 4; i++) {
      hideElements(`#act-03-sc${sc}-card${i}-selected`);
    }

    sequence.forEach((traderName, index) => {
      // Find the card in act-03-scX-cards
      // Usually named like act-03-sc1-card1, act-03-sc1-card2 etc.
      const cardId = `act-03-sc${sc}-card${index + 1}`;
      const card = document.getElementById(cardId);
      if (!card) return;

      card.style.cursor = "pointer";

      // Overlay for clicking
      const rect = getPctRect(card);
      if (rect) {
        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
          position: "absolute",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          cursor: "pointer",
          pointerEvents: "auto",
          zIndex: "10"
        });
        uiLayer.appendChild(overlay);

        overlay.onclick = () => {
          if (index === currentStep) {
            // Correct step
            showElements(`#act-03-sc${sc}-card${index + 1}-selected`);
            currentStep++;
            if (currentStep === sequence.length) {
              const msg = sc === 3 ? "Well Done! You achieved your goal by completing a 4-step trading." : "Well Done! You achieved your goal by completing a 3-step trading.";
              showFeedbackPopup(msg, true);
              showElements(`#act-03-sc${sc}-feedback-end`);
            } else {
              showFeedbackPopup("Good job!", true);
            }
          } else if (index > currentStep) {
            // Wrong step
            showFeedbackPopup("Trade failed! Try again.", false);
          }
        };
      }
    });
  }

  // --- Screen 4 Logic ---
  function setupScreen4() {
    const defGroup = document.getElementById("act-04-checkbox-default");
    const selGroup = document.getElementById("act-04-checkbox-selected");
    if (!defGroup || !selGroup) return;

    // Use absolute sorting by bounding box top
    const defs = Array.from(defGroup.children).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    const sels = Array.from(selGroup.children).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    const corrects = [0, 1, 2, 3, 6];
    let correctCount = 0;

    defs.forEach((defEl, i) => {
      const rect = getPctRect(defEl);
      if (rect) {
        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
          position: "absolute",
          left: rect.left,
          top: rect.top,
          width: "35%", // wide area for text
          height: rect.height,
          cursor: "pointer",
          pointerEvents: "auto"
        });
        uiLayer.appendChild(overlay);

        overlay.onclick = () => {
          if (corrects.includes(i)) {
            // Correct
            showFeedbackPopup("Correct!", true);
            sels[i].classList.remove("hidden-svg");
            defEl.classList.add("hidden-svg");
            overlay.style.pointerEvents = "none"; // disable further clicks
            correctCount++;
            if (correctCount === corrects.length) {
              showFeedbackPopup("Well Done! You have learnt how trade used to happen without money, before its invention.", true);
              showElements("#act-04-feedback-end");
            }
          } else {
            // Wrong
            showFeedbackPopup("Wrong!", false);
            sels[i].classList.remove("hidden-svg"); // this will show the cross for false statements
            defEl.classList.add("hidden-svg");
            overlay.style.pointerEvents = "none";
          }
        };
      }
    });
  }

  // Launch View
  updateView();
}
