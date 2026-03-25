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
  const backNextBtn = document.getElementById("btn-next-back");

  const container =
    document.getElementById("barter-bazaar-wrapper") || document.body;
  const svg = document.querySelector("svg");
  if (!svg) return;

  // Lottie instances
  let lottieSuccessSC1;
  let lottieSadSC1;
  let lottieSadSC2;
  let lottieSuccessSC2;

  // Reorder UI popups so they render on top of SVG groups
  document.querySelectorAll('[id^="act-01-sc1-feedback"]').forEach((popup) => {
    if (popup.parentNode) popup.parentNode.appendChild(popup);
  });

  // Dropdowns will be injected via foreignObject directly into the SVG hierarchy


  // --- Lottie Initialization ---
  function initLottie() {
    const lottieContainer = document.getElementById("lottie-success-sc1");
    if (lottieContainer) {
      lottieSuccessSC1 = lottie.loadAnimation({
        container: lottieContainer,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: "./assets/anim/emoji_happy-star.json",
      });
    }

    const sadContainer = document.getElementById("lottie-sad-sc1");
    if (sadContainer) {
      lottieSadSC1 = lottie.loadAnimation({
        container: sadContainer,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: "./assets/anim/emoji-sad.json",
      });
    }

    const sadContainerSC2 = document.getElementById("lottie-sad-sc2");
    if (sadContainerSC2) {
      lottieSadSC2 = lottie.loadAnimation({
        container: sadContainerSC2,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: "./assets/anim/emoji-sad.json",
      });
    }

    const successContainerSC2 = document.getElementById("lottie-success-sc2");
    if (successContainerSC2) {
      lottieSuccessSC2 = lottie.loadAnimation({
        container: successContainerSC2,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: "./assets/anim/emoji_happy-star.json",
      });
    }

  }
  initLottie();

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
      el.classList.add("st767");
      //el.style.display = "none";
    });
  }

  function showElements(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.remove("st767");
      el.style.display = "";
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
  const villageTradesSelectionIds = [
    "Path_2995-2",
    "Path_2993",
    "Path_2995",
    "Path_2992",
    "Path_2994",
    "Path_2991",
    "Path_2708-4",
    "Path_2710-4",
  ];

  const villageTrades = [
    "Group_1292",
    "Group_1293",
    "Group_1294",
    "Group_1295",
    "Group_1296",
    "Group_1281",
    "Group_1403",
    "Group_1404",
  ];
  // Global variables
  let currentScreen = 0; // 0=Menu, 1=Intro, 2=Scen2, 3=Scen3, 4=Checklist
  let currentChallengeSC2 = 1; // 1 to 3
  let currentChallengeSC3 = 1; // 1 to 3

  // Hide everything first
  const menuScreen = document.getElementById("menu-screen");
  if (menuScreen) menuScreen.classList.remove("st767");

  // document
  //   .querySelectorAll('[id^="act-"]')
  //   .forEach((el) => el.classList.add("st767"));
  document
    .querySelectorAll('[id^="popup-"]')
    .forEach((el) => el.classList.add("st767"));

  // --- Menu Setup ---
  const menuScen1 = document.getElementById("Scenario_1");
  const menuScen2 =
    document.getElementById("Scenario_2") ||
    document.getElementById("Group_1570");
  const menuScen3 =
    document.getElementById("Scenario_3") ||
    document.getElementById("Group_1572");
  const menuScen2_1 = document.getElementById("Scenario_2-1");
  const menuScen2_2 = document.getElementById("Scenario_2-2");
  const menuScen2_3 = document.getElementById("Scenario_2-3");
  const menuScen3_1 = document.getElementById("Scenario_3-1");
  const menuScen3_2 = document.getElementById("Scenario_3-2");
  const menuScen3_3 = document.getElementById("Scenario_3-3");

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

  if (menuScen2_1) {
    menuScen2_1.style.cursor = "pointer";
    menuScen2_1.addEventListener("click", () => {
      currentScreen = 2;
      currentChallengeSC2 = 1;
      updateView();
    });
  }
  if (menuScen2_2) {
    menuScen2_2.style.cursor = "pointer";
    menuScen2_2.addEventListener("click", () => {
      currentScreen = 2;
      currentChallengeSC2 = 2;
      updateView();
    });
  }
  if (menuScen2_3) {
    menuScen2_3.style.cursor = "pointer";
    menuScen2_3.addEventListener("click", () => {
      currentScreen = 2;
      currentChallengeSC2 = 3;
      updateView();
    });
  }
  if (menuScen3_1) {
    menuScen3_1.style.cursor = "pointer";
    menuScen3_1.addEventListener("click", () => {
      currentScreen = 3;
      currentChallengeSC3 = 1;
      updateView();
    });
  }
  if (menuScen3_2) {
    menuScen3_2.style.cursor = "pointer";
    menuScen3_2.addEventListener("click", () => {
      currentScreen = 3;
      currentChallengeSC3 = 2;
      updateView();
    });
  }

  if (menuScen3_3) {
    menuScen3_3.style.cursor = "pointer";
    menuScen3_3.addEventListener("click", () => {
      currentScreen = 3;
      currentChallengeSC3 = 3;
      updateView();
    });
  }

  // --- Navigation Setup ---
  const btnNext = document.getElementById("Next");
  const btnBack = document.getElementById("Back");
  const btnHome = document.getElementById("btn-home");
  const btnInsights = document.getElementById("btn-insights");
  const globalSubmit = document.getElementById("Submit");
  const btnCloseInsights = document.getElementById("Insights-2");
  const btnCloseInsights3 = document.getElementById("Insights-3");
  const btnCloseInsights4 = document.getElementById("Insights-4");

  if (btnNext) {
    btnNext.style.cursor = "pointer";
    btnNext.addEventListener("click", goNext);
  }
  if (btnBack) {
    btnBack.style.cursor = "pointer";
    btnBack.addEventListener("click", goBack);
  }
  function resetWidget() {
    // Reset navigation state
    currentScreen = 0;
    currentChallengeSC2 = 1;
    currentChallengeSC3 = 1;

    // Clear dynamically injected dropdowns and their SVG wrappers
    document.querySelectorAll(".bb-dropdown-fo, .custom-dropdown").forEach((el) => el.remove());

    // Reset SC1 visual state — hide all matched/selected indicators
    hideElements("#act-01-sc1-cards-matched > *");
    hideElements("#act-01-sc1-cards-selected > *");
    // Remove trader highlight classes
    villageTrades.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove("trader-selected", "trader-matched");
        el.style.filter = "";
        el.style.opacity = "";
      }
    });

    // Reset SC2 feedback state
    hideElements('[id^="act-02-sc1-feedback"]');

    // Reset SC3 selected indicators
    for (let sc = 1; sc <= 3; sc++) {
      for (let i = 1; i <= 4; i++) {
        hideElements(`#act-03-sc${sc}-card${i}-selected`);
      }
    }

    // Stop Lottie animations
    [lottieSuccessSC1, lottieSadSC1, lottieSadSC2, lottieSuccessSC2].forEach(
      (anim) => { if (anim) anim.stop(); }
    );

    // Return to menu
    updateView();
  }

  if (btnHome) {
    btnHome.style.cursor = "pointer";

    btnHome.addEventListener("click", () => {
      resetWidget();
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
  if (btnCloseInsights) {
    btnCloseInsights.addEventListener("click", () => {
      let pId = `popup-act-0${currentScreen}-insights`;
      if (currentScreen === 4 || currentScreen === 0)
        pId = `popup-act-01-insights`; // fallback
      togglePopup(pId, false);
    });
  }
  if (btnCloseInsights3) {
    btnCloseInsights3.addEventListener("click", () => {
      let pId = `popup-act-0${currentScreen}-insights`;
      pId = `popup-act-02-insights`; // fallback
      togglePopup(pId, false);
    });
  }
  if (btnCloseInsights4) {
    btnCloseInsights4.addEventListener("click", () => {
      let pId = `popup-act-0${currentScreen}-insights`;
      pId = `popup-act-03-insights`; // fallback
      togglePopup(pId, false);
    });
  }

  // Click anywhere to close popups
  document.querySelectorAll('[id^="popup-"]').forEach((p) => {
    p.addEventListener("click", () => p.classList.add("st767"));
  });

  function goNext() {
    if (currentScreen === 0) {
      currentScreen = 1;
    } else if (currentScreen === 1) {
      currentScreen = 2;
      currentChallengeSC2 = 1;
    } else if (currentScreen === 2) {
      hideElements(`#act-02-sc${currentChallengeSC2}`);
      hideElements(`#act-02-sc${currentChallengeSC2}-cards`);
      if (currentChallengeSC2 < 3) currentChallengeSC2++;
      else {
        hideElements("#act-02-base-global");
        hideElements(`#act-02-sc${currentChallengeSC2}`);
        hideElements(`#act-02-sc${currentChallengeSC2}-cards`);
        hideElements(`[id^="act-02-sc${currentChallengeSC2}"]`);
        if (document.querySelector(".bb-dropdown-fo, .custom-dropdown")) {
          document
            .querySelectorAll(".bb-dropdown-fo, .custom-dropdown")
            .forEach((el) => el.remove());
        }
        currentScreen = 3;
        currentChallengeSC3 = 1;
      }
    } else if (currentScreen === 3) {
      if (currentChallengeSC3 < 3) currentChallengeSC3++;
      else {
        hideElements("#act-03-base-global");
        hideElements(`[id^="act-03-sc${currentChallengeSC3}"]`);
        hideElements("#btn-next-back");
        currentScreen = 4;
      }
    }
    updateView();
  }

  function goBack() {
    if (currentScreen === 4) {
      hideElements("#act-04-base");
      hideElements("#act-04-question");
      hideElements("#act-04-checkbox-default");
      hideElements("#act-04-feedback-end");
      hideElements("#Group_1687 > *");
      showElements("#Group_594-2");
      currentScreen = 3;
      currentChallengeSC3 = 3;
    } else if (currentScreen === 3) {
      // Always clean up screen 3 before leaving
      hideElements("#act-03-base-global");
      [1, 2, 3].forEach((s) => hideElements(`[id^="act-03-sc${s}"]`));
      if (currentChallengeSC3 > 1) currentChallengeSC3--;
      else {
        currentScreen = 2;
        currentChallengeSC2 = 3;
      }
    } else if (currentScreen === 2) {
      hideElements(`[id^="act-02-sc${currentChallengeSC2}"]`);
      document
        .querySelectorAll(".bb-dropdown-fo, .custom-dropdown")
        .forEach((el) => el.remove());
      if (currentChallengeSC2 > 1) currentChallengeSC2--;
      else currentScreen = 1;
    } else if (currentScreen === 1) {
      currentScreen = 0;
    }
    updateView();
  }

  function updateView() {
    console.log("updateView called, currentScreen:", currentScreen);
    if (menuScreen) {
      console.log("menuScreen found, current classList:", menuScreen.classList.toString());
      menuScreen.classList.add("st767");
    }

    document
      .querySelectorAll('[id^="act-"]')
      .forEach((el) => el.classList.add("st767"));
    btnHome.classList.remove("st767");
    btnInsights.classList.remove("st767");

    // Handle Menu
    if (currentScreen === 0) {
      console.log("Setting screen to 0 (Menu)");
      if (menuScreen) menuScreen.classList.remove("st767");
      allScreens.forEach((s) => {
        let d = document.getElementById(s);
        if (d) {
          d.classList.add("st767");
        }
      });
      hideElements(`[id^="act-02"]`);
      hideElements(`[id^="act-03"]`);
      hideElements(`#act-02-sc1-cards`);
      hideElements(`#act-02-sc2-cards`);
      hideElements(`#act-02-sc3-cards`);
      hideElements("#act-01-sc1-cards-matched > *");
      hideElements("#act-01-sc1-cards-selected > *");
      showElements("#Group_594-2");
      hideElements("#Group_1687 > *");

      if (document.querySelector(".bb-dropdown-fo, .custom-dropdown")) {
        document
          .querySelectorAll(".bb-dropdown-fo, .custom-dropdown")
          .forEach((el) => el.remove());
      }
      hideElements("#act-04-base");
      hideElements("#act-04-question");
      hideElements("#act-04-checkbox-default");
      // hideElements("#act-04-checkbox-selected > *");
      hideElements("#act-04-feedback-end");
      hideElements("#btn-next-back");
      hideElements("#btn-insights");
    } else if (currentScreen === 1) {
      showElements("#act-01-sc1-base");
      showElements("#act-01-sc1-cards");
      // hideElements("#act-04-checkbox-selected > *");
      showElements("#act-01-sc1-cards-matched");
      showElements("#act-01-sc1-cards-selected");
      hideElements('[id^="act-01-sc1-feedback"]');
      hideElements("#act-02-base-global");
      hideElements('[id^="act-02-sc"]');
      const backNextBtn = document.getElementById("btn-next-back");
      if (backNextBtn) {
        backNextBtn.classList.add("st767");
      }
      setupScreen1();
    } else if (currentScreen === 2) {
      // Clear all sc states first to prevent bleed-through
      [1, 2, 3].forEach((s) => hideElements(`[id^="act-02-sc${s}"]`));
      showElements("#act-02-base-global");
      showElements(`[id^="act-02-sc${currentChallengeSC2}"]`);
      // Hide feedbacks initially
      hideElements(`[id^="act-02-sc${currentChallengeSC2}-feedback"]`);
      backNextBtn.classList.remove("st767");
      setupScreen2Challenge(currentChallengeSC2);
    } else if (currentScreen === 3) {
      // Clear all sc states first to prevent bleed-through of selected indicators
      [1, 2, 3].forEach((s) => hideElements(`[id^="act-03-sc${s}"]`));
      showElements("#act-03-base-global");
      showElements(`[id^="act-03-sc${currentChallengeSC3}"]`);
      hideElements(`[id^="act-03-sc${currentChallengeSC3}-feedback"]`);
      backNextBtn.classList.remove("st767");
      setupScreen3Challenge(currentChallengeSC3);
    } else if (currentScreen === 4) {
      showElements("#act-04-base");
      showElements("#act-04-question");
      showElements("#act-04-checkbox-default");
      //  hideElements("#act-04-checkbox-selected");
      hideElements("#act-04-feedback-end");
      if (backNextBtn) {
        backNextBtn.classList.remove("st767");
      }
      hideElements("#Group_594-2"); // Hide Next Button
      hideElements("#btn-insights"); // Hide Insights Button
      setupScreen4();
    }
  }

  // --- Screen 1 Logic ---
  function setupScreen1() {
    const traders = [
      "Potter",
      "Fisherman",
      "Carpenter",
      "Weaver",
      "Plumber",
      "Teacher",
      "Doctor",
      "Farmer",
    ];
    const pairs = {
      Farmer: "Weaver",
      Weaver: "Farmer",
      Doctor: "Teacher",
      Teacher: "Doctor",
      Fisherman: "Plumber",
      Plumber: "Fisherman",
      Potter: "Carpenter",
      Carpenter: "Potter",
    };

    const scn_01_sc1_cards_matched = {
      Farmer_Weaver: ["Group_1295-2", "Group_1404-2"],
      Weaver_Farmer: ["Group_1295-2", "Group_1404-2"],
      Doctor_Teacher: ["Group_1281-2", "Group_1403-2"],
      Teacher_Doctor: ["Group_1281-2", "Group_1403-2"],
      Fisherman_Plumber: ["Group_1293-2", "Group_1296-2"],
      Plumber_Fisherman: ["Group_1293-2", "Group_1296-2"],
      Potter_Carpenter: ["Group_1294-2", "Group_1292-2"],
      Carpenter_Potter: ["Group_1294-2", "Group_1292-2"],
    };
    let selectedTrader = null;
    let matchedTraders = new Set();
    let tradeCount = 0;

    // Disable Next button initially
    // if (btnNext) {
    //   btnNext.disabled = true;
    //   btnNext.style.opacity = "0.5";
    //   btnNext.style.cursor = "not-allowed";
    // }

    villageTrades.forEach((traderId, index) => {
      const el = document.getElementById(traderId);
      if (!el) {
        console.warn(`Trader element not found: ${traderId}`);
        return;
      }

      el.style.cursor = "pointer";

      el.addEventListener("click", () => {
        // Skip if already matched
        if (matchedTraders.has(traders[index])) return;

        if (!selectedTrader) {
          // First selection
          selectedTrader = traders[index];
          //  el.classList.add("trader-selected");
          document
            .getElementById(villageTradesSelectionIds[index])
            .classList.remove("st767");
        } else if (selectedTrader === traders[index]) {
          // Deselect same trader
          el.classList.remove("trader-selected");
          selectedTrader = null;
          document
            .getElementById(villageTradesSelectionIds[index])
            .classList.add("st767");
        } else {
          // Try to match with previously selected trader
          const firstEl = document.getElementById(
            villageTrades[traders.indexOf(selectedTrader)],
          );
          if (pairs[selectedTrader] === traders[index]) {
            // Match success
            document
              .getElementById(villageTradesSelectionIds[index])
              .classList.remove("st767");
            matchedTraders.add(traders[index]);
            matchedTraders.add(selectedTrader);
            tradeCount++;
            let selectT =
              scn_01_sc1_cards_matched[`${traders[index]}_${selectedTrader}`];
            selectT.forEach((s) => {
              let d = document.getElementById(s);
              if (d) {
                d.classList.remove("st767");
              }
            });
            //  el.classList.add("trader-matched");
            // el.classList.remove("trader-selected");
            // firstEl.classList.add("trader-matched");
            // firstEl.classList.remove("trader-selected");

            // Show Success Popup
            let corPopup = document.getElementById(
              "act-01-sc1-feedback-correct-selection",
            );
            if (corPopup) {
              corPopup.classList.remove("st767");
              let tradeCounterText =
                document.getElementById("trade-counter-sc1");
              if (tradeCounterText)
                tradeCounterText.textContent = `Trades Completed: ${tradeCount} / 4`;

              if (lottieSuccessSC1) {
                lottieSuccessSC1.play();
              }

              let continueBtn = document.getElementById("btn-continue-sc1");
              if (continueBtn) {
                continueBtn.onclick = () => {
                  corPopup.classList.add("st767");
                  selectedTrader = null;
                  console.log("tradeCount", tradeCount);
                  if (tradeCount >= 4) {
                    let completedSec = document.getElementById(
                      "act-01-sc1-feedback-end",
                    );
                    if (completedSec) {
                      completedSec.classList.remove("st767");
                      completedSec.addEventListener("click", () => {
                        completedSec.classList.add("st767");
                        goNext();
                      });
                    }
                  }
                  // Check if all pairs are matched after continuing
                  if (matchedTraders.size === traders.length) {
                    if (btnNext) {
                      btnNext.disabled = false;
                      btnNext.style.opacity = "1";
                      btnNext.style.cursor = "pointer";
                    }
                  }
                };
              }
            }
          } else {
            let incorPopup = document.getElementById(
              "act-01-sc1-feedback-incorrect-selection",
            );
            if (incorPopup) {
              const previousTrader = selectedTrader;
              const currentIndex = index;
              const currentEl = el;

              incorPopup.classList.remove("st767");

              if (lottieSadSC1) {
                lottieSadSC1.play();
              }

              currentEl.classList.add("trader-selected");
              let secondSelectionBorder = document.getElementById(
                villageTradesSelectionIds[currentIndex],
              );
              if (secondSelectionBorder)
                secondSelectionBorder.classList.remove("st767");

              let tryBtn = document.getElementById("btn-try-another-trader");
              if (tryBtn) {
                tryBtn.onclick = () => {
                  incorPopup.classList.add("st767");
                  el.classList.remove("trader-selected");
                  firstEl.classList.remove("trader-selected");
                  let firstSelectionBorder = document.getElementById(
                    villageTradesSelectionIds[traders.indexOf(previousTrader)],
                  );
                  if (firstSelectionBorder)
                    firstSelectionBorder.classList.add("st767");

                  currentEl.classList.remove("trader-selected");
                  if (secondSelectionBorder)
                    secondSelectionBorder.classList.add("st767");
                };
              }
            } else {
              showFeedbackPopup(
                "Trade failed. Try again. Their needs don't match.",
                false,
              );
              firstEl.classList.remove("trader-selected");
              document
                .getElementById(
                  villageTradesSelectionIds[traders.indexOf(selectedTrader)],
                )
                .classList.add("st767");
            }
            selectedTrader = null;
          }
        }
      });
    });

    function updateTradeCounter(count) {
      let counter = document.getElementById("trade-counter-sc1");
      if (!counter) {
        counter = document.createElement("div");
        counter.id = "trade-counter-sc1";
        counter.className = "trade-counter";
        container.appendChild(counter);
      }
      counter.textContent = `Trades Completed: ${count} / 4`;
    }
  }

  function showFeedbackPopup(text, isSuccess) {
    let popup = document.getElementById("feedback-popup-sc1");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "feedback-popup-sc1";
      Object.assign(popup.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "30px",
        backgroundColor: "white",
        border: `4px solid ${isSuccess ? "#00AA00" : "#FF0000"}`,
        borderRadius: "12px",
        zIndex: "10000",
        textAlign: "center",
        boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
        pointerEvents: "auto",
        maxWidth: "400px",
        fontFamily: "Arial, sans-serif",
      });
      document.body.appendChild(popup);
    }
    popup.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: ${isSuccess ? "#00AA00" : "#FF0000"}; font-size: 20px;">
        ${isSuccess ? "✓ Success" : "✗ Try Again"}
      </h3>
      <p style="margin: 0 0 15px 0; font-size: 14px; color: #333;">${text}</p>
      <button id="close-fb" style="padding: 10px 20px; background: #590056; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">OK</button>
    `;
    popup.style.display = "block";
    document.getElementById("close-fb").onclick = () => {
      popup.style.display = "none";
    };
  }

  // --- Custom Dropdown Builder ---
  function createCustomDropdown(max, defaultVal, onChange, targetId) {
    if (targetId) {
      const existing = document.getElementById(`dropdown-${targetId}`);
      if (existing) return existing;
    }
    const wrapper = document.createElement("div");
    wrapper.id = targetId ? `dropdown-${targetId}` : "";
    wrapper.className = "custom-dropdown";
    wrapper.dataset.value = String(defaultVal);

    // Trigger button
    const trigger = document.createElement("div");
    trigger.className = "custom-dropdown-trigger";

    const valueSpan = document.createElement("span");
    valueSpan.className = "dd-value";
    valueSpan.textContent = String(defaultVal);

    const arrow = document.createElement("span");
    arrow.className = "dd-arrow";
    arrow.textContent = "▼";

    trigger.appendChild(valueSpan);
    trigger.appendChild(arrow);
    wrapper.appendChild(trigger);

    // Options list
    const list = document.createElement("ul");
    list.className = "custom-dropdown-list";

    for (let i = 1; i <= max; i++) {
      const item = document.createElement("li");
      item.className = "custom-dropdown-item";
      item.textContent = String(i);
      item.dataset.val = String(i);

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        wrapper.dataset.value = String(i);
        valueSpan.textContent = String(i);
        // Update selected highlight
        list
          .querySelectorAll(".custom-dropdown-item")
          .forEach((li) => li.classList.remove("selected"));
        item.classList.add("selected");
        wrapper.classList.remove("open");
        if (onChange) onChange(i);
      });
      list.appendChild(item);
    }
    wrapper.appendChild(list);

    // Toggle open/close on trigger click
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close all other open dropdowns first
      document.querySelectorAll(".custom-dropdown.open").forEach((dd) => {
        if (dd !== wrapper) dd.classList.remove("open");
      });
      wrapper.classList.toggle("open");
    });

    // Helper to set value programmatically (for Show Answer)
    wrapper.setValue = function (val) {
      wrapper.dataset.value = String(val);
      valueSpan.textContent = String(val);
      list.querySelectorAll(".custom-dropdown-item").forEach((li) => {
        li.classList.toggle("selected", li.dataset.val === String(val));
      });
      if (onChange) onChange(val);
    };

    return wrapper;
  }

  // Close any open dropdown when clicking outside
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".custom-dropdown.open")
      .forEach((dd) => dd.classList.remove("open"));
  });

  // --- Screen 2 Logic ---
  const sc2Config = {
    1: { max1: 10, max2: 10, val1: 2, val2: 1 }, // Rice (2) vs Cloth (4)
    2: { max1: 15, max2: 15, val1: 1, val2: 3 }, // Pot (1) vs Medical (3)
    3: { max1: 15, max2: 15, val1: 3, val2: 4 }, // Fish (3) vs Plough (4)
  };

  function setupScreen2Challenge(sc) {
    // Remove ALL stale dropdown foreignObjects/divs from previous scenario attempts
    document.querySelectorAll(".bb-dropdown-fo, .custom-dropdown").forEach((el) => el.remove());

    const cfg = sc2Config[sc];
    if (!cfg) return;

    // The dropdown boxes in SVG are act-02-scX-dropdown-list-1, -2
    let dd1 = document.getElementById(`act-02-sc1-dropdown-list-1`);
    let dd2 = document.getElementById(`act-02-sc1-dropdown-list-2`);
    let dd3 = document.getElementById(`act-02-sc1-dropdown`);

    // Get the Trade button and disable it initially
    const scGroup = document.getElementById(`act-02-sc${sc}-btn`);
    const scSubmit = scGroup ? scGroup.querySelector('[id^="Trade"]') : globalSubmit;
    const showAnsBtn = scGroup ? scGroup.querySelector('[id^="Show_Answer"]') : null;
    if (scSubmit) {
      scSubmit.style.opacity = "0.5";
      scSubmit.style.pointerEvents = "none";
      scSubmit.style.cursor = "not-allowed";
    }

    // Re-enable Show Answer for this new scenario
    if (showAnsBtn) {
      showAnsBtn.style.opacity = "1";
      showAnsBtn.style.pointerEvents = "auto";
      showAnsBtn.style.cursor = "pointer";
    }

    // Check if both dropdowns have values to enable the Trade button
    function checkEnableSubmit() {
      const v1 = parseInt(s1.dataset.value);
      const v2 = parseInt(s2.dataset.value);
      if (v1 > 0 && v2 > 0 && scSubmit) {
        scSubmit.style.opacity = "1";
        scSubmit.style.pointerEvents = "auto";
        scSubmit.style.cursor = "pointer";
      }
    }

    // Create custom dropdowns with target IDs to prevent duplicates
    const s1 = createCustomDropdown(
      cfg.max1,
      0,
      checkEnableSubmit,
      `act-02-sc${sc}-1`,
    );
    const s2 = createCustomDropdown(
      cfg.max2,
      0,
      checkEnableSubmit,
      `act-02-sc${sc}-2`,
    );

    // --- SVG-based positioning using foreignObject + getBBox() ---
    // This approach places dropdowns inside the SVG coordinate space (viewBox: 0 0 1920 1080)
    // so they scale perfectly on all screen sizes.
    function attachDropdownAsSVG(dropdown, triggerGroup, containerGroup) {
      // Remove any existing foreignObject for this dropdown
      const existingFo = svg.querySelector(`[data-dd-id="${dropdown.id}"]`);
      if (existingFo) existingFo.remove();

      const bbox = triggerGroup.getBBox();
      const fo = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "foreignObject",
      );

      // Increase height and offset Y to prevent clipping of upward-opening lists
      const foHeight = 600;
      const yOffset = 450; // Room for 400px list above plus padding

      fo.setAttribute("x", bbox.x);
      fo.setAttribute("y", bbox.y - yOffset);
      fo.setAttribute("width", bbox.width);
      fo.setAttribute("height", foHeight);
      fo.setAttribute("overflow", "visible");
      fo.setAttribute("data-dd-id", dropdown.id);
      fo.classList.add("bb-dropdown-fo");

      // Style the dropdown to fill the foreignObject exactly
      dropdown.style.position = "absolute";
      dropdown.style.left = "0";
      dropdown.style.top = `${yOffset}px`; // Align trigger to its original Y
      dropdown.style.width = "100%";
      dropdown.style.height = `${bbox.height}px`;
      dropdown.style.pointerEvents = "auto";

      fo.appendChild(dropdown);

      // Insert as sibling to containerGroup (which is hidden) to inherit parent transforms
      // but NOT be hidden itself.
      if (containerGroup && containerGroup.parentNode) {
        containerGroup.parentNode.insertBefore(fo, containerGroup.nextSibling);
      } else {
        triggerGroup.parentNode.insertBefore(fo, triggerGroup.nextSibling);
      }

      return fo;
    }

    if (dd3) {
      const triggerWrappers = Array.from(dd3.children).filter(
        (c) => c.tagName === "g" || c.tagName === "G",
      );
      triggerWrappers.sort(
        (a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left,
      );

      if (triggerWrappers.length >= 2) {
        attachDropdownAsSVG(s1, triggerWrappers[0], dd3);
        attachDropdownAsSVG(s2, triggerWrappers[1], dd3);

        // Hide SVG placeholder elements
        if (dd1) dd1.classList.add("st767");
        if (dd2) dd2.classList.add("st767");
        dd3.classList.add("st767");
      }
    }

    // Show Answer logic
    if (showAnsBtn) {
      showAnsBtn.style.cursor = "pointer";

      showAnsBtn.onclick = (e) => {
        e.stopPropagation();
        // Find first fair trade values
        let f1 = 0,
          f2 = 0;
        if (sc === 1) {
          f1 = 2; // Rice
          f2 = 4; // Cloth
        } else if (sc === 2) {
          f1 = 1; // Pot
          f2 = 3; // Medical
        } else if (sc === 3) {
          f1 = 3; // Fish
          f2 = 4; // Plough
        }
        s1.setValue(f2);
        s2.setValue(f1);
        // Disable after click
        showAnsBtn.style.opacity = "0.5";
        showAnsBtn.style.pointerEvents = "none";
        showAnsBtn.style.cursor = "not-allowed";
      };
    }

    // Submit handler logic
    if (scSubmit) {
      scSubmit.style.cursor = "pointer";
      scSubmit.onclick = (e) => {
        if (e) e.stopPropagation();
        let v1 = parseInt(s1.dataset.value) || 0;
        let v2 = parseInt(s2.dataset.value) || 0;
        if (v2 * cfg.val1 === v1 * cfg.val2 && v1 > 0 && v2 > 0) {
          // Fair Trade
          showElements(`#act-02-sc1-feedback-correct`);
          hideElements(`#act-02-sc1-feedback-incorrect`);
          if (lottieSuccessSC2) {
            lottieSuccessSC2.stop();
            lottieSuccessSC2.play();
          }
        } else {
          // Unfair
          showElements(`#act-02-sc1-feedback-incorrect`);
          hideElements(`#act-02-sc1-feedback-correct`);
          if (lottieSadSC2) {
            lottieSadSC2.stop();
            lottieSadSC2.play();
          }
        }
      };
    }

    // Feedback Continue button handlers (Recycled IDs sc1 used for all Activity 2 scenarios)
    const incorrectFeedback = document.getElementById(`act-02-sc1-feedback-incorrect`);
    if (incorrectFeedback) {
      incorrectFeedback.style.cursor = "pointer";
      incorrectFeedback.onclick = () => {
        hideElements(`#act-02-sc1-feedback-incorrect`);
      };
    }

    const correctFeedback = document.getElementById(`act-02-sc1-feedback-correct`);
    if (correctFeedback) {
      correctFeedback.style.cursor = "pointer";
      correctFeedback.onclick = () => {
        hideElements(`#act-02-sc1-feedback-correct`);
        showElements(`#act-02-sc1-feedback-end`);
      };
    }

    const endFeedback = document.getElementById(`act-02-sc1-feedback-end`);
    if (endFeedback) {
      endFeedback.style.cursor = "pointer";
      endFeedback.onclick = () => {
        hideElements(`#act-02-sc1-feedback-end`);
        goNext();
      };
    }
  }

  // --- Screen 3 Logic ---
  function setupScreen3Challenge(sc) {
    const chainConfig = {
      1: ["Farmer", "Fisherman", "Plumber"],
      2: ["Teacher", "Potter", "Carpenter"],
      3: ["Potter", "Farmer", "Weaver", "Doctor"],
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
      let card;
      if (sc < 3) {
        card = document.getElementById(cardId).parentElement;

      } else {
        card = document.getElementById(cardId);
      }
      if (!card) return;

      card.style.cursor = "pointer";
      card.onclick = () => {
        if (index === currentStep) {
          // Correct step

          // Hide previous step indicator to avoid layering/overlap issues with the trading chain text
          if (currentStep > 0) {
            hideElements(`#act-03-sc${sc}-card${currentStep}-selected`);
          }

          showElements(`#act-03-sc${sc}-card${index + 1}-selected`);
          currentStep++;
          if (currentStep === sequence.length) {
            const msg =
              sc === 3
                ? "Well Done! You achieved your goal by completing a 4-step trading."
                : "Well Done! You achieved your goal by completing a 3-step trading.";
            //showFeedbackPopup(msg, true);
            showElements(`#act-03-sc${sc}-feedback-end`);
          } else {
            //showFeedbackPopup("Good job!", true);
          }
        } else if (index > currentStep) {
          // Wrong step
          // showFeedbackPopup(
          //   "Wrong order! Try again from the correct trader.",
          //   false,
          // );
        }
      };
    });
    const endFeedback = document.getElementById(`act-03-sc${sc}-feedback-end`);
    if (endFeedback) {
      endFeedback.style.cursor = "pointer";
      endFeedback.addEventListener("click", () => {
        hideElements(`#act-03-sc${sc}-feedback-end`);
        hideElements(`#act-03-sc${sc}-goal`);
        for (let i = 1; i <= 4; i++) {
          hideElements(`#act-03-sc${sc}-card${i}-selected`);
        }
        goNext();
      });
    }
  }

  // --- Screen 4 Logic ---
  function setupScreen4() {
    const checkBoxIds = [
      "Group_1679",
      "Group_1681",
      "Group_1682",
      "Group_1683",
      "Group_1680",
      "Group_1684",
      "Group_1686",
      "Group_1685",
    ];
    const defGroup = document.getElementById("act-04-checkbox-default");
    const selGroup = document.getElementById("act-04-checkbox-selected");
    selGroup.classList.remove("st767")
    if (!defGroup || !selGroup) return;

    // Use absolute sorting by bounding box top
    const defs = Array.from(defGroup.children).sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );
    // The actual selected indicators are inside Group_1687, not just selGroup directly
    const selInnerGroup = document.getElementById("Group_1687") || selGroup;
    const sels = Array.from(selInnerGroup.children).sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );

    const corrects = [0, 1, 2, 3, 6];
    let correctCount = 0;

    // Submit Button Logic
    const btnSubmit = document.getElementById("Group_1177-2");
    if (btnSubmit) {
      btnSubmit.style.opacity = "0.5";
      btnSubmit.style.pointerEvents = "none";
      btnSubmit.style.cursor = "default";
      btnSubmit.onclick = null;
    }
    const clickedBoxes = new Set();

    defs.forEach((defEl, i) => {
      defEl.style.cursor = "pointer";
      defEl.onclick = () => {
        clickedBoxes.add(i);

        if (corrects.includes(i)) {
          // Correct selected target
          // defEl.classList.add("hidden-svg");
          // overlay.style.pointerEvents = "none"; // disable further clicks
          correctCount++;
          sels[i].classList.remove("st767", "hidden-svg");
        } else {
          // Wrong selected target
          sels[i].classList.remove("st767", "hidden-svg");
          // defEl.classList.add("hidden-svg");
        }

        // Check if all checkboxes have been clicked
        if (clickedBoxes.size === 8) {
          if (btnSubmit) {
            btnSubmit.style.opacity = "1";
            btnSubmit.style.pointerEvents = "auto";
            btnSubmit.style.cursor = "pointer";
            btnSubmit.onclick = () => {
              backNextBtn.classList.add("st767");
              showElements("#act-04-feedback-end");
            };
          }
        }
      };
    });
  }

  // Add CSS for trader states and UI elements
  const style = document.createElement("style");
  style.textContent = `
    .trader-selected {
      filter: drop-shadow(0 0 8px #FFD700) !important;
      opacity: 1 !important;
    }

    .trader-matched {
      filter: drop-shadow(0 0 12px #00AA00) !important;
      opacity: 0.85 !important;
    }

    .trade-counter {
      position: absolute;
      bottom: 20px;
      right: 20px;
      font-size: 16px;
      font-weight: bold;
      background: white;
      padding: 10px 15px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      color: #333;
      font-family: Arial, sans-serif;
      z-index: 50;
      pointer-events: none;
    }

    #feedback-popup-sc1 button:hover {
      background: #7a0070 !important;
      transform: scale(1.05);
      transition: all 0.2s ease;
    }
  `;
  document.head.appendChild(style);

  // Launch View
  updateView();
}
