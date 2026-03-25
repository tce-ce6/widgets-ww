document.addEventListener("DOMContentLoaded", () => {
  const SCENARIOS = [
    {
      id: "tab-policy_debate",
      iconId: "scenario-icon-policy_debate",
      rectId: "Rectangle_309-3",
      baseY: 427,
      lockId: "Group_2046",
      shieldPatchId: "Path_8894",
      title: "Using Government Vehicle",
      question:
        "A sitting Minister uses their official government car with pilot escort for an election campaign rally. The car belongs to the State Government. Is this allowed?",
      correctAnswer: "VIOLATION",
      feedbackCorrect:
        "Government resources (vehicles, personnel) cannot be used for party campaigning. This ensures a level playing field.",
      feedbackWrong:
        "Use of government resources for electioneering is a violation. Ministers must use private or party vehicles for campaigns.",
    },
    {
      id: "tab-integrity",
      iconId: "scenario-icon-integrity",
      rectId: "Rectangle_309-4",
      baseY: 536,
      lockId: "Group_2047",
      shieldPatchId: "Path_8896",
      title: "Hate Speech",
      question:
        "A candidate gives a speech in a public meeting. They make highly offensive remarks about another religion and appeal to voters on religious grounds to get support. Is this allowed?",
      correctAnswer: "VIOLATION",
      feedbackCorrect:
        "Hate speech and religious appeals are strictly prohibited. This violates MCC rules against communal divide.",
      feedbackWrong:
        "Appeals based on religion or caste are illegal. This is a clear violation of the Model Code of Conduct.",
    },
    {
      id: "tab-resources",
      iconId: "scenario-icon-resources",
      rectId: "Rectangle_309-5",
      baseY: 645,
      lockId: "Group_2048",
      shieldPatchId: "Path_8898",
      title: "Freebies & Gifts",
      question:
        "A party distributes 10,000 pressure cookers and sarees to households in a constituency. The items have the party symbol and candidate photo. Distributed 3 days before voting. Is this allowed?",
      correctAnswer: "VIOLATION",
      feedbackCorrect:
        "Distributing gifts to influence voters is 'bribery'. It is a serious violation of electoral laws and integrity.",
      feedbackWrong:
        "Giving gifts to voters is illegal and unethical. It is considered an attempt to buy votes, which is a major violation.",
    },

    {
      id: "tab-freedom",
      iconId: "scenario-icon-freedom",
      rectId: "Rectangle_309-6",
      baseY: 754,
      lockId: "Group_2050",
      shieldPatchId: "Path_8900",
      title: "Campaign During Silent Period",
      question:
        "A group of party workers goes door-to-door just 12 hours before the start of polling, using loud megaphones and carrying banners. Is this allowed?",
      correctAnswer: "VIOLATION",
      feedbackCorrect:
        "The 48-hour period before polling ends is the 'Silent Period'. No active campaigning or loud speakers are allowed.",
      feedbackWrong:
        "Campaigning must stop 48 hours before the poll closes. Loud rallies and megaphone announcements are strictly prohibited.",
    },
    {
      id: "tab-unity",
      iconId: "scenario-icon-unity",
      rectId: "Rectangle_309-7",
      baseY: 863,
      lockId: "Group_2049",
      shieldPatchId: "Path_8899",
      title: "Campaign in Religious Place",
      question:
        "A candidate holds an election meeting inside a temple/mosque/church. They urge the devotees to vote for them while the religious ceremony is ongoing. Is this allowed?",
      correctAnswer: "VIOLATION",
      feedbackCorrect:
        "Religious places cannot be used as forums for election propaganda. This rule maintains the sanctity of worship places.",
      feedbackWrong:
        "Using places of worship for election campaigning is strictly forbidden under the Model Code of Conduct.",
    },
    {
      id: "tab-legal_rallies",
      iconId: "scenario-icon-legal_rallies",
      rectId: "Rectangle_309",
      baseY: 209,
      lockId: "Group_2044",
      shieldPatchId: "Path_8897",
      title: "Political Rally in Public Ground",
      question:
        "A party books a government-owned ground for a rally. They paid ₹50,000 booking fee to local authority. Rally is 10 days before voting. No cash or gifts distributed. Is this allowed?",
      correctAnswer: "ALLOWED",
      feedbackCorrect:
        "Legal booking of public space is allowed. Parties can hold rallies before silent period. Proper permission makes it legitimate.",
      feedbackWrong:
        "Paying fees makes this legal use. Public grounds can be booked for campaigns. No violation here.",
    },
    {
      id: "tab-free_media",
      iconId: "scenario-icon-free_media",
      rectId: "Rectangle_309-2",
      baseY: 318,
      lockId: "Group_2045",
      shieldPatchId: "Path_8895",
      title: "Newspaper Advertisement",
      question:
        "A party publishes full-page newspaper ad. Ad lists their achievements and future plans. Contains party symbol and candidate photos. Published 1 week before voting. Is this allowed?",
      correctAnswer: "ALLOWED",
      feedbackCorrect:
        "Political advertising in media is allowed. Parties can communicate their vision to voters. This is legitimate campaign method.",
      feedbackWrong:
        "Paid advertisements are democratic right. Voters need information about all parties. No violation in publishing policy ads.",
    },
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Shuffle scenarios at launch
  shuffleArray(SCENARIOS);

  let currentScenarioIndex = -1;
  let starsCount = 0;
  let attemptedScenarios = new Set();

  const STAR_PATH_IDS = [
    "Path_8346-6", // Star 1 (Left-most)
    "Path_8346-7", // Star 2
    "Path_8346", // Star 3
    "Path_8346-2", // Star 4
    "Path_8346-3", // Star 5
    "Path_8346-4", // Star 6
    "Path_8346-5", // Star 7 (Right-most)
  ];

  const REWARD_STAR_IDS = [
    "star_1",
    "star_2",
    "star_3",
    "star_4",
    "star_5",
    "star_6",
    "star_7",
  ];

  let correctScenarios = new Set();
  let incorrectScenarios = new Set();
  let attemptSequenceResults = [];
  let confettiAnimation;

  // Tab position mapping
  const SLOT_Y_COORDINATES = [209, 318, 427, 536, 645, 754, 863];

  function layoutTabs() {
    SCENARIOS.forEach((scenario, index) => {
      const tabGroup = document.getElementById(scenario.id);
      if (tabGroup) {
        const targetY = SLOT_Y_COORDINATES[index];
        const deltaY = targetY - scenario.baseY;
        tabGroup.setAttribute("transform", `translate(0, ${deltaY})`);
      }
    });
  }

  function updateTabStyles() {
    SCENARIOS.forEach((scenario, index) => {
      const rect = document.getElementById(scenario.id);
      if (rect) {
        if (correctScenarios.has(index) || incorrectScenarios.has(index)) {
          //rect.setAttribute("class", "st630"); // Muted green-grey for completed
          rect.setAttribute("opacity", "0.5");
          rect.setAttribute("pointer-events", "none");
        }
        // else {
        //   //rect.setAttribute("class", "st766"); // Original yellow for pending
        //   rect.setAttribute("opacity", "1");
        //   rect.setAttribute("pointer-events", "auto");
        // }
      }
    });
  }

  // Call layout after shuffle
  layoutTabs();
  updateTabStyles();

  // Initialize Lottie Confetti
  const lottieWrapper = document.getElementById("lottie-wrapper");
  if (lottieWrapper) {
    confettiAnimation = lottie.loadAnimation({
      container: lottieWrapper,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "assets/animation/forFinalCompltion/confetti.json",
    });
  }

  const startBtn = document.getElementById("start_button");
  const introBackground = document.getElementById("Intro_background");
  const introTexts = [
    "intro_text_01",
    "intro_text_02",
    "intro_text_03",
    "i_text_01",
  ];
  const gameElements = [
    "common_background",
    "star_panel",
    "tab-policy_debate",
    "tab-integrity",
    "tab-resources",
    "tab-freedom",
    "tab-unity",
    "tab-legal_rallies",
    "tab-free_media",
    "banner-democracy",
    "i_text_02",
    "dark-patch-shield",
    "lock",
    "shield",
  ];

  const commonBackground = document.getElementById("common_background");
  const starPanel = document.getElementById("star_panel");
  const bannerDemocracy = document.getElementById("banner-democracy");
  const insideButton = document.getElementById("inside_button");
  const iText02 = document.getElementById("i_text_02");
  const fairElectionCircle = document.getElementById("fair_elaction_circle");
  const shield = document.getElementById("shield");

  const tabFullContainer = document.getElementById("tab-full-political_rally");
  const scenarioTitleTspan = document.getElementById("scenario-title-tspan");
  const textPanel = document.getElementById("text-panel");

  const allowedBtn = document.getElementById("allowed_button");
  const violationBtn = document.getElementById("violation_button");

  const correctPanel = document.getElementById("correct_panel");

  const incorrectPanel = document.getElementById("incorrect_panel");

  const closeInsightsBtn = document.getElementById("Group_2142");
  const insightsPanel = document.getElementById("inside_panel");
  const darkPatch = document.getElementById("dark_patch");
  const itext03 = document.getElementById("i_text_03");

  if (allowedBtn) allowedBtn.style.cursor = "pointer";
  if (violationBtn) violationBtn.style.cursor = "pointer";
  if (correctPanel) correctPanel.style.cursor = "pointer";
  if (incorrectPanel) incorrectPanel.style.cursor = "pointer";
  if (closeInsightsBtn) closeInsightsBtn.style.cursor = "pointer";
  if (insideButton) {
    insideButton.style.cursor = "pointer";
    insideButton.style.display = "none"; // Only shown when a question is active
  }

  // Initialize Stars (Gray out)
  STAR_PATH_IDS.forEach((id) => {
    const star = document.getElementById(id);
    if (star) star.setAttribute("fill", "#316a7f");
  });

  // Hide all reward stars initially
  REWARD_STAR_IDS.forEach((id) => {
    const star = document.getElementById(id);
    if (star) star.style.display = "none";
  });

  function updateSvgTextLines(
    containerId,
    text,
    startY,
    lineSpacing,
    className,
  ) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    const maxCharsPerLine = 48;

    words.forEach((word) => {
      if ((currentLine + " " + word).length > maxCharsPerLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = currentLine ? currentLine + " " + word : word;
      }
    });
    lines.push(currentLine);

    lines.forEach((line, index) => {
      const textElem = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      // Use robust styles directly to avoid CSS class issues
      textElem.style.fontSize = containerId.includes("feedback")
        ? "30px"
        : "32px";
      textElem.style.fontFamily = "Roboto, Arial, sans-serif";
      textElem.style.fontWeight = containerId.includes("feedback")
        ? "300"
        : "bold";
      textElem.setAttribute(
        "fill",
        containerId.includes("feedback") ? "#fff" : "#000",
      );
      let x = 816.4;
      if (containerId.includes("feedback-wrong")) x = 609.5;
      else if (containerId.includes("feedback-correct")) x = 639.5;

      textElem.setAttribute(
        "transform",
        `translate(${x} ${startY + index * lineSpacing})`,
      );

      const tspan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan",
      );
      tspan.setAttribute("x", "0");
      tspan.setAttribute("y", "0");
      tspan.textContent = line;

      textElem.appendChild(tspan);
      container.appendChild(textElem);
    });
  }

  function showScenario(index) {
    const halfStar = document.getElementById("half-star");
    if (halfStar) {
      halfStar.style.display = "block";
      const shiftX = attemptedScenarios.size * 40.3;
      halfStar.setAttribute("transform", `translate(${shiftX}, 0)`);
    }

    currentScenarioIndex = index;
    const scenario = SCENARIOS[index];

    // Update Title
    if (scenarioTitleTspan) {
      scenarioTitleTspan.textContent = scenario.title;
      const titleText = scenarioTitleTspan.closest("text");
      if (titleText) {
        titleText.style.fontSize = "40px";
        titleText.style.fontFamily = "Roboto, Arial, sans-serif";
        titleText.style.fontWeight = "bold";
        titleText.setAttribute("fill", "#000000");
      }
    }

    // Update Question
    updateSvgTextLines(
      "scenario-question-group",
      scenario.question,
      479.4,
      43,
      "st34",
    );

    // Update Icon
    SCENARIOS.forEach((sc) => {
      const icon = document.getElementById(sc.iconId);
      const tab = document.getElementById(sc.id);
      if (icon) icon.style.display = "none";
      if (tab) tab.style.display = "none";
    });
    const activeIcon = document.getElementById(scenario.iconId);
    if (activeIcon) activeIcon.style.display = "block";

    // Show panels
    tabFullContainer.style.display = "block";
    textPanel.style.display = "block";
    allowedBtn.style.display = "block";
    violationBtn.style.display = "block";

    // Show Insights button only when question is active
    if (insideButton) insideButton.style.display = "block";

    // Hide shield screen elements
    // shield.style.display = "none";

    iText02.style.display = "none";
    itext03.style.display = "block";
  }

  function handleAnswer(answer) {
    const halfStar = document.getElementById("half-star");
    if (halfStar) {
      halfStar.style.display = "none";
    }

    const scenario = SCENARIOS[currentScenarioIndex];
    if (answer === scenario.correctAnswer) {
      updateSvgTextLines(
        "feedback-correct-group",
        scenario.feedbackCorrect,
        563,
        39,
        "st42",
      );
      correctPanel.style.display = "block";

      // Fill star completely
      if (attemptedScenarios.size < STAR_PATH_IDS.length) {
        const starPath = document.getElementById(
          STAR_PATH_IDS[attemptedScenarios.size],
        );
        if (starPath) starPath.setAttribute("fill", "#FABD57");
      }

      // Track correct scenario
      correctScenarios.add(currentScenarioIndex);

      // Hide lock and shield patch
      const currentLock = document.getElementById(scenario.lockId);
      const currentShieldPatch = document.getElementById(
        scenario.shieldPatchId,
      );
      if (currentLock) currentLock.style.display = "none";
      if (currentShieldPatch) currentShieldPatch.style.display = "none";
      updateTabStyles();

      // Show reward star and sparkles
      const starParent = document.getElementById("star");
      const sparkles = document.getElementById("Group_2450");
      if (starParent) starParent.style.display = "block";
      if (sparkles) sparkles.style.display = "block";

      // Track correct scenario in the sequence it was attempted
      const currentAttemptIndex = attemptedScenarios.size;
      attemptSequenceResults[currentAttemptIndex] = "correct";

      REWARD_STAR_IDS.forEach((id, idx) => {
        const star = document.getElementById(id);
        if (star) {
          star.style.display =
            attemptSequenceResults[idx] === "correct" ? "block" : "none";
        }
      });

      // Play Lottie Confetti
      if (confettiAnimation && lottieWrapper) {
        lottieWrapper.style.display = "block";
        confettiAnimation.goToAndPlay(0, true);
      }
    } else {
      incorrectScenarios.add(currentScenarioIndex);
      updateTabStyles();
      updateSvgTextLines(
        "feedback-wrong-group",
        scenario.feedbackWrong,
        549,
        39,
        "st42",
      );
      incorrectPanel.style.display = "block";

      // Track incorrect scenario in the sequence it was attempted
      const currentAttemptIndex = attemptedScenarios.size;
      attemptSequenceResults[currentAttemptIndex] = "incorrect";

      REWARD_STAR_IDS.forEach((id, idx) => {
        const star = document.getElementById(id);
        if (star) {
          star.style.display =
            attemptSequenceResults[idx] === "correct" ? "block" : "none";
        }
      });

      // Stamp the half star by cloning the floating half-star
      if (halfStar && attemptedScenarios.size < STAR_PATH_IDS.length) {
        const clone = halfStar.cloneNode(true);
        clone.id = `half-star-clone-${attemptedScenarios.size}`;

        // Remove IDs from cloned children to prevent SVG ID conflicts
        const elementsWithId = clone.querySelectorAll("[id]");
        elementsWithId.forEach((el) => {
          el.removeAttribute("id");
        });

        clone.style.display = "block";
        const shiftX = attemptedScenarios.size * 40.3;
        clone.setAttribute("transform", `translate(${shiftX}, 0)`);
        halfStar.parentElement.appendChild(clone);
      }
    }

    // Mark as attempted
    attemptedScenarios.add(currentScenarioIndex);
    darkPatch.style.display = "block";
  }

  function hideFeedback() {
    correctPanel.style.display = "none";
    incorrectPanel.style.display = "none";
    darkPatch.style.display = "none";

    // Stop and Hide Lottie Confetti
    if (confettiAnimation && lottieWrapper) {
      confettiAnimation.stop();
      lottieWrapper.style.display = "none";
    }

    tabFullContainer.style.display = "none";
    textPanel.style.display = "none";
    allowedBtn.style.display = "none";
    violationBtn.style.display = "none";
    itext03.style.display = "none";

    // Hide Insights button when returning to main map
    if (insideButton) insideButton.style.display = "none";
    shield.style.display = "block";
    fairElectionCircle.style.display = "block";
    iText02.style.display = "block";

    // Hide reward stars and parent
    // const starReward = document.getElementById("star");
    // const sparkles = document.getElementById("Group_2450");
    // if (starReward) starReward.style.display = "none";
    // if (sparkles) sparkles.style.display = "none";
    // REWARD_STAR_IDS.forEach((id) => {
    //   const star = document.getElementById(id);
    //   if (star) star.style.display = "none";
    // });

    gameElements.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "block";
    });

    // Unlock shield and lights
    attemptedScenarios.forEach((index) => {
      const scenario = SCENARIOS[index];
      const lock = document.getElementById(scenario.lockId);
      if (correctScenarios.has(index)) {
        if (lock) lock.style.display = "none";
        const patch = document.getElementById(scenario.shieldPatchId);
        if (patch) patch.style.display = "none";
      }
    });

    // Disable attempted scenario tabs
    attemptedScenarios.forEach((index) => {
      const scenario = SCENARIOS[index];
      const tab = document.getElementById(scenario.id);
      if (tab) {
        tab.style.opacity = "0.5";
        tab.style.pointerEvents = "none";
      }
    });

    // Check for game completion
    if (attemptedScenarios.size === 7) {
      const completionBanner = document.getElementById("banner-cpmpletion");
      if (completionBanner) {
        completionBanner.style.display = "block";
        darkPatch.style.display = "block";
      }
    }
  }

  if (startBtn) {
    startBtn.style.cursor = "pointer";
    startBtn.addEventListener("click", () => {
      introBackground.style.display = "none";
      introTexts.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });
      startBtn.style.display = "none";
      gameElements.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.display = "block";
      });
      // commonBackground.style.display = "block";
      // starPanel.style.display = "block";
      // bannerDemocracy.style.display = "block";
      // insideButton.style.display = "block";
      iText02.style.display = "block";
      fairElectionCircle.style.display = "block";
      shield.style.display = "block";
    });
  }

  function attachScenarioTabListeners() {
    SCENARIOS.forEach((scenario, index) => {
      const tab = document.getElementById(scenario.id);
      if (tab) {
        tab.style.cursor = "pointer";
        // Remove previous click listeners by cloning and replacing the node
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
        newTab.addEventListener("click", () => showScenario(index));
      }
    });
  }

  attachScenarioTabListeners();

  if (allowedBtn)
    allowedBtn.addEventListener("click", () => handleAnswer("ALLOWED"));
  if (violationBtn)
    violationBtn.addEventListener("click", () => handleAnswer("VIOLATION"));

  if (correctPanel) correctPanel.addEventListener("click", hideFeedback);
  if (incorrectPanel) incorrectPanel.addEventListener("click", hideFeedback);

  if (insideButton) {
    insideButton.addEventListener("click", () => {
      insightsPanel.style.display = "block";
      darkPatch.style.display = "block";
    });
  }

  if (closeInsightsBtn) {
    closeInsightsBtn.addEventListener("click", () => {
      insightsPanel.style.display = "none";
      darkPatch.style.display = "none";
    });
  }

  const restartBtn = document.getElementById("restart_button_completion");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      // 1. Reset state
      attemptedScenarios.clear();
      correctScenarios.clear();
      incorrectScenarios.clear();
      attemptSequenceResults = [];
      starsCount = 0;
      currentScenarioIndex = -1;

      // 2. Clear half-star clones
      document
        .querySelectorAll("[id^='half-star-clone-']")
        .forEach((c) => c.remove());

      // 3. Reset Star Band (gray out)
      STAR_PATH_IDS.forEach((id) => {
        const star = document.getElementById(id);
        if (star) star.setAttribute("fill", "#316a7f");
      });

      // 4. Hide Reward Stars and sparkles
      REWARD_STAR_IDS.forEach((id) => {
        const star = document.getElementById(id);
        if (star) star.style.display = "none";
      });
      const starParent = document.getElementById("star");
      const sparkles = document.getElementById("Group_2450");
      if (starParent) starParent.style.display = "none";
      if (sparkles) sparkles.style.display = "none";

      // 5. Hide Banner & Dark Patch
      const completionBanner = document.getElementById("banner-cpmpletion");
      if (completionBanner) completionBanner.style.display = "none";
      if (darkPatch) darkPatch.style.display = "none";

      // 6. Reset Scenario Tabs Styles, locks and patches
      SCENARIOS.forEach((scenario) => {
        const tab = document.getElementById(scenario.id);
        if (tab) {
          tab.style.opacity = "1";
          tab.style.pointerEvents = "auto";
        }
        const lock = document.getElementById(scenario.lockId);
        if (lock) lock.style.display = "block";
        const patch = document.getElementById(scenario.shieldPatchId);
        if (patch) patch.style.display = "block";
      });


      // 7. Reshuffle and relayout
      shuffleArray(SCENARIOS);
      layoutTabs();
      attachScenarioTabListeners();

      // 8. Restore main UI visibility
      iText02.style.display = "block";
      fairElectionCircle.style.display = "block";
      shield.style.display = "block";
      itext03.style.display = "none";

      // Also ensure tab panels are hidden
      tabFullContainer.style.display = "none";
      textPanel.style.display = "none";
      allowedBtn.style.display = "none";
      violationBtn.style.display = "none";

      // Hide Insights button on restart
      if (insideButton) insideButton.style.display = "none";
    });
  }
});
