document.addEventListener("DOMContentLoaded", () => {
  const GAME_CONFIG = {
    totalQuestions: 9,
    questions: [
      {
        id: 1,
        tier: "GRAM_PANCHAYAT",
        question:
          "Scenario: The Gram Sabha of Khedi village elects 9 representatives. At what level do these representatives govern?",
        options: "option-set-1",
        correctOptionIndex: 0,
        pyramidLevel: "pyramid-level1",
        circleId: "Ellipse_35-3",
        feedback:
          "✓ Correct! This is the Gram Panchayat - the village-level elected council.",
      },
      {
        id: 2,
        tier: "GRAM_PANCHAYAT",
        question:
          "Scenario: It's election time in Khedi village. Who votes to elect the Gram Panchayat members?",
        options: "option-set-2",
        correctOptionIndex: 2,
        pyramidLevel: "pyramid-level1",
        circleId: "Ellipse_36-3",
        feedback:
          "✓ Correct! The Gram Sabha (all voters 18+) elects representatives.",
      },
      {
        id: 3,
        tier: "GRAM_PANCHAYAT",
        question:
          "Scenario: The 9 Gram Panchayat members are elected. Who leads the Gram Panchayat and chairs their meetings?",
        options: "option-set-3",
        correctOptionIndex: 1,
        pyramidLevel: "pyramid-level1",
        circleId: "Ellipse_37-3",
        feedback:
          "✓ Correct! The Sarpanch or Pradhan is the elected head of Gram Panchayat.",
      },

      {
        id: 4,
        tier: "PANCHAYAT_SAMITI",
        question:
          "Scenario: Khedi is one of 20 villages in a Tehsil area. How are development projects planned when multiple villages are involved?",
        options: "option-set-4",
        correctOptionIndex: 1,
        pyramidLevel: "pyramid-level2",
        circleId: "Ellipse_35-2",
        feedback:
          "✓ Correct! This is the Panchayat Samiti - the block-level coordination body.",
      },
      {
        id: 5,
        tier: "PANCHAYAT_SAMITI",
        question:
          "Scenario: Panchayat Samiti wants to organize a health camp. For how many villages will they plan it?",
        options: "option-set-5",
        correctOptionIndex: 0,
        pyramidLevel: "pyramid-level2",
        circleId: "Ellipse_36-2",
        feedback: "✓ Correct! Panchayat Samiti works at block level.",
      },
      {
        id: 6,
        tier: "PANCHAYAT_SAMITI",
        question:
          "Scenario: 15 villages all need better roads. What is Panchayat Samiti's main role with these requests?",
        options: "option-set-6",
        correctOptionIndex: 2,
        pyramidLevel: "pyramid-level2",
        circleId: "Ellipse_37-2",
        feedback: "✓ Correct! Panchayat Samiti has a coordination function.",
      },

      {
        id: 7,
        tier: "ZILA_PARISHAD",
        question:
          "Scenario: Khedi's block is one of 12 blocks in Bhopal district. What does the highest Panchayati Raj body do with plans from all these blocks?",
        options: "option-set-7",
        correctOptionIndex: 1,
        pyramidLevel: "pyramid-level3",
        circleId: "Ellipse_35",
        feedback:
          "✓ Correct! This is the Zila Parishad - the district-level apex body.",
      },
      {
        id: 8,
        tier: "ZILA_PARISHAD",
        question:
          "Scenario: The Zila Parishad receives development plans from all Panchayat Samitis in the district. What is its main role?",
        options: "option-set-8",
        correctOptionIndex: 1,
        pyramidLevel: "pyramid-level3",
        circleId: "Ellipse_36",
        feedback:
          "✓ Correct! Zila Parishad does district-level planning and resource allocation.",
      },
      {
        id: 9,
        tier: "WOMENS_RESERVATION",
        question:
          "Scenario: A Gram Panchayat has 9 seats. How many MUST be reserved for women by constitutional law?",
        options: "option-set-9",
        correctOptionIndex: 2,
        pyramidLevel: "pyramid-level3",
        circleId: "Ellipse_37",
        feedback:
          "✓ Correct! There is a women's reservation of one-third (33%).",
      },
    ],
  };

  let dragIdCounter = 0;

  // --- State Variables ---
  let currentQuestionIndex = 0;
  let isAwaitingPyramidClick = false;
  let draggedElement = null;
  let selectedOptionIndex = null;
  let draggedOptionIndex = -1; // Added to store index during drag
  let offset = { x: 0, y: 0 };
  let originalPositions = {};
  let isLocked = false;

  // --- Element Selectors ---
  const elements = {
    introBox: document.getElementById("intro-box"),
    startBtn: document.getElementById("intro-btn-start-building"),
    activityPyramid: document.getElementById("activity-pyramid"),
    questionPanel: document.getElementById("question-panel"),
    questionTexts: {
      group: document.getElementById(
        "Question_1:_Scenario:_The_Gram_Sabha_of_Khedi_village_elects_9_representatives._At_what_level_do_these_representatives_govern_",
      ),
      tspans: [], // Populated dynamically
    },
    optionSets: document.querySelectorAll('g[id^="option-set-"]'),
    popups: {
      correct: document.getElementById("popup-correct"),
      incorrect: document.getElementById("popup-incorrect"),
      insights: document.getElementById("Popup-insights"),
    },
    instructions: {
      intro: document.getElementById(
        "Read_the_information_below_When_ready_click_Start_Building_to_construct_the_three-tier_Panchayati_RajSystem_",
      ),
      question: document.getElementById(
        "Read_the_scenario_carefully_First_tap_on_the_correct_answer_card_and_then_tap_on_the_glowing_circle_on_the_pyramid_to_build_it._",
      ),
      introItext: document.getElementById("intro-i-text"),
      activityItext: document.getElementById("i-text-activity"),
    },
    btns: {
      proceed: document.getElementById("Group_1685"), // Proceed
      tryAgain: document.getElementById("Group_1683"), // Try Again
      insights: document.getElementById("btn-insights"),
      closeInsights: document.getElementById("Group_1481"), // Close Insights (X button)
      playAgain: document.getElementById("Group_1688"), // Play Again
    },
    pyramidLevels: {
      l1: document.getElementById("pyramid-level1"),
      l2: document.getElementById("pyramid-level2"),
      l3: document.getElementById("pyramid-level3"),
      final: document.getElementById("summary-end"),
    },
    clickableCircles: document.getElementById("btn-clickable-circle"),
    progressBar: document.getElementById("progrss-bar-default"),
    progressBarHighlighted: document.getElementById("progrss-bar-highlighted"),
    progressBarStars: [], // Will be populated with highlighted star groups
  };

  // Populate progress bar stars array
  const highlightedBar = document.getElementById("progrss-bar-highlighted");
  if (highlightedBar) {
    const starGroups = highlightedBar.querySelectorAll(
      "g[id*='Group_1757'], g[id*='Group_1781'], g[id*='Group_1784'], g[id*='Group_1785'], g[id*='Group_1786'], g[id*='Group_1787'], g[id*='Group_1795'], g[id*='Group_1796'], g[id*='Group_1797']",
    );
    starGroups.forEach((group) => {
      if (group.id.includes("-2") || !group.id.includes("-")) {
        elements.progressBarStars.push(group);
      }
    });
  }

  // Also get the yellow stars from the highlighted bar (the ones with fill='#ffdf00')
  if (highlightedBar) {
    const yellowStars = highlightedBar.querySelectorAll('path[fill="#ffdf00"]');
    elements.progressBarStars = Array.from(yellowStars).map((star) =>
      star.closest("g"),
    );
  }

  // --- Helper Functions ---

  function getMousePosition(evt) {
    const svg = document.querySelector("svg");
    const CTM = svg.getScreenCTM();
    if (evt.touches) {
      evt = evt.touches[0];
    }
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  }

  // Returns the circleId if the dragged element is near any drop zone for the current question
  function getIntersectingZone(el) {
    const qData = GAME_CONFIG.questions[currentQuestionIndex];
    // Each question has a circleId as its drop zone
    const targetCircle = document.getElementById(qData.circleId);
    if (!targetCircle) return null;

    const elRect = el.getBoundingClientRect();
    const targetRect = targetCircle.getBoundingClientRect();

    // Check for overlap with padding
    const padding = 20;
    const isIntersecting = !(
      elRect.right < targetRect.left - padding ||
      elRect.left > targetRect.right + padding ||
      elRect.bottom < targetRect.top - padding ||
      elRect.top > targetRect.bottom + padding
    );

    // Highlight drop zone if intersecting
    if (isIntersecting) {
      targetCircle.classList.add("highlight-brick");
    } else {
      targetCircle.classList.remove("highlight-brick");
    }

    return isIntersecting ? qData.circleId : null;
  }

  function snapToZone(el, zoneId) {
    const target = document.getElementById(zoneId);
    if (!target) return;

    let cx, cy;
    // If target is a group, find the first shape child to get coordinates
    if (target.tagName === "g") {
      const child = target.querySelector("ellipse, circle, rect");
      if (child) {
        cx = parseFloat(
          child.getAttribute("cx") || child.getAttribute("x") || 0,
        );
        cy = parseFloat(
          child.getAttribute("cy") || child.getAttribute("y") || 0,
        );
      } else {
        const bbox = target.getBBox();
        cx = bbox.x + bbox.width / 2;
        cy = bbox.y + bbox.height / 2;
      }
    } else {
      cx = parseFloat(
        target.getAttribute("cx") || target.getAttribute("x") || 0,
      );
      cy = parseFloat(
        target.getAttribute("cy") || target.getAttribute("y") || 0,
      );
    }

    if (
      el.tagName === "ellipse" ||
      el.tagName === "circle" ||
      el.tagName === "Layer"
    ) {
      el.setAttribute("cx", cx);
      el.setAttribute("cy", cy);
    } else if (el.tagName === "g") {
      // For groups, we use transform translate to center the group on cx, cy
      const bbox = el.getBBox();
      const tx = cx - (bbox.x + bbox.width / 2);
      const ty = cy - (bbox.y + bbox.height / 2);
      el.setAttribute("transform", `translate(${tx}, ${ty})`);
    } else {
      const bbox = el.getBBox();
      el.setAttribute("x", cx - bbox.width / 2);
      el.setAttribute("y", cy - bbox.height / 2);
    }
  }

  function snapToOriginal(el) {
    const pos = originalPositions[el.id];
    if (pos) {
      if (el.tagName === "ellipse" || el.tagName === "circle") {
        el.setAttribute("cx", pos.x);
        el.setAttribute("cy", pos.y);
      } else if (el.tagName === "g") {
        el.setAttribute("transform", pos.transform || "");
      } else {
        el.setAttribute("x", pos.x);
        el.setAttribute("y", pos.y);
      }

      // Return to original parent if moved
      if (pos.parent && el.parentNode !== pos.parent) {
        pos.parent.appendChild(el);
      }
    }
  }

  function startDrag(evt) {
    if (isLocked) return;
    if (
      elements.popups.correct.style.display === "block" ||
      elements.popups.incorrect.style.display === "block"
    )
      return;

    const el = evt.currentTarget;
    draggedElement = el;
    draggedElement.classList.add("dragging");
    document.body.classList.add("grabbing-cursor");

    const qData = GAME_CONFIG.questions[currentQuestionIndex];

    // Find parent option set to store index BEFORE moving el in DOM
    const parentGroup = el.closest("g[id^='option-set-']");
    if (parentGroup) {
      const options = Array.from(parentGroup.children).filter(
        (c) => c.tagName === "g",
      );
      let optContainer = el;
      while (optContainer && !options.includes(optContainer)) {
        optContainer = optContainer.parentNode;
      }
      draggedOptionIndex = options.indexOf(optContainer);
    } else {
      draggedOptionIndex = -1;
    }

    const svg = document.querySelector("svg");
    // Store parent if not already stored
    if (el.id && originalPositions[el.id] && !originalPositions[el.id].parent) {
      originalPositions[el.id].parent = el.parentNode;
    }
    svg.appendChild(draggedElement);

    const coord = getMousePosition(evt);

    if (el.tagName === "g") {
      // For groups, handle transform-based offset
      const transform = el.getAttribute("transform") || "";
      const match = transform.match(/translate\(([^,]+),? ?([^)]+)\)/);
      const tx = match ? parseFloat(match[1]) : 0;
      const ty = match ? parseFloat(match[2]) : 0;
      offset.x = coord.x - tx;
      offset.y = coord.y - ty;
    } else {
      const currentX = parseFloat(
        el.getAttribute("cx") || el.getAttribute("x") || 0,
      );
      const currentY = parseFloat(
        el.getAttribute("cy") || el.getAttribute("y") || 0,
      );
      offset.x = coord.x - currentX;
      offset.y = coord.y - currentY;
    }

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", drag, { passive: false });
    document.addEventListener("touchend", endDrag);

    // const qData = GAME_CONFIG.questions[currentQuestionIndex];
    const targetCircle = document.getElementById(qData.circleId);
    if (targetCircle) {
      targetCircle.setAttribute("opacity", "1");
      targetCircle.style.stroke = "#ff6600";
      targetCircle.style.strokeWidth = "3";
    }
  }

  function drag(evt) {
    if (!draggedElement) return;
    evt.preventDefault();
    const coord = getMousePosition(evt);

    if (draggedElement.tagName === "g") {
      draggedElement.setAttribute(
        "transform",
        `translate(${coord.x - offset.x}, ${coord.y - offset.y})`,
      );
    } else if (
      draggedElement.tagName === "ellipse" ||
      draggedElement.tagName === "circle" ||
      draggedElement.tagName === "Layer"
    ) {
      draggedElement.setAttribute("cx", coord.x - offset.x);
      draggedElement.setAttribute("cy", coord.y - offset.y);
    } else {
      draggedElement.setAttribute("x", coord.x - offset.x);
      draggedElement.setAttribute("y", coord.y - offset.y);
    }

    // Dropzone feedback
    const dropZoneId = getIntersectingZone(draggedElement);
    const qData = GAME_CONFIG.questions[currentQuestionIndex];
    const targetCircle = document.getElementById(qData.circleId);
    if (targetCircle) {
      if (dropZoneId) {
        targetCircle.classList.add("highlight-brick");
      } else {
        targetCircle.classList.remove("highlight-brick");
      }
    }
  }

  function endDrag(evt) {
    if (!draggedElement) return;

    const el = draggedElement;
    el.classList.remove("dragging");
    document.body.classList.remove("grabbing-cursor");

    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("touchend", endDrag);

    const qData = GAME_CONFIG.questions[currentQuestionIndex];
    const targetCircle = document.getElementById(qData.circleId);
    if (targetCircle) {
      targetCircle.classList.remove("highlight-brick");
    }

    const dropZoneId = getIntersectingZone(el);
    if (dropZoneId === qData.circleId) {
      // Snap the icon to the center of the drop zone (circleId)
      snapToZone(el, dropZoneId);

      let isCorrect = (draggedOptionIndex === qData.correctOptionIndex);

      if (isCorrect) {
        // Correct drop
        targetCircle.classList.remove("active-brick-circle");
        targetCircle.classList.add("correct-brick-fill");

        // Remove pin and add checkmark
        removePin(qData.circleId);
        addCheckmark(qData.circleId);

        updateFeedbackPopup(qData);
        if (elements.progressBarStars[currentQuestionIndex]) {
          showElement(elements.progressBarStars[currentQuestionIndex]);
        }
        el.style.pointerEvents = "none"; // Lock correct card
      } else {
        // Wrong drop on current brick
        setTimeout(() => snapToOriginal(el), 200);
        showElementAndFront(elements.popups.incorrect);
      }
    } else {
      // Dropped elsewhere or on wrong brick
      snapToOriginal(el);
    }

    draggedElement = null;
  }

  function removePin(circleId) {
    const pin = document.getElementById("pin-" + circleId);
    if (pin) pin.remove();
  }

  function addCheckmark(circleId) {
    const target = document.getElementById(circleId);
    if (!target) return;
    const bbox = target.getBBox();
    const check = document.createElementNS("http://www.w3.org/2000/svg", "text");
    check.setAttribute("x", bbox.x + bbox.width / 2);
    check.setAttribute("y", bbox.y + bbox.height / 2 + 5);
    check.setAttribute("text-anchor", "middle");
    check.setAttribute("font-size", "30");
    check.setAttribute("fill", "#fff");
    check.classList.add("checkmark-icon");
    check.textContent = "✓";
    target.parentNode.appendChild(check);
  }

  function showElement(el) {
    if (el) el.style.display = "block";
  }

  function hideElement(el) {
    if (el) el.style.display = "none";
  }

  function hideAllPopups() {
    Object.values(elements.popups).forEach(hideElement);
  }

  function bringPopupToFront(popup) {
    if (popup && popup.parentNode) {
      popup.parentNode.appendChild(popup);
    }
  }

  function showElementAndFront(el) {
    if (el) {
      el.style.display = "block";
      bringPopupToFront(el);
    }
  }

  function updateFeedbackPopup(qData) {
    const popupCorrect = elements.popups.correct;
    const feedbackGroup = popupCorrect.querySelector('g[id^="Correct"]');
    if (feedbackGroup) {
      const textNode = feedbackGroup.querySelector("text");
      if (textNode) {
        let feedback = qData.feedback;
        let maxCharsPerLine = 25;

        let lines = [];
        let start = 0;
        while (start < feedback.length && lines.length < 3) {
          let end = start + maxCharsPerLine;
          if (end < feedback.length) {
            let spaceIndex = feedback.lastIndexOf(" ", end);
            if (spaceIndex > start) {
              end = spaceIndex;
            }
          } else {
            end = feedback.length;
          }
          lines.push(feedback.slice(start, end).trim());
          start = end + 1;
        }

        while (textNode.firstChild) {
          textNode.removeChild(textNode.firstChild);
        }

        const popupWidth = 100;
        const centerX = popupWidth / 2;
        textNode.setAttribute("text-anchor", "middle");
        textNode.setAttribute("x", centerX);

        lines.forEach((line, idx) => {
          const tspan = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "tspan",
          );
          tspan.setAttribute("x", centerX);
          tspan.setAttribute("dy", idx === 0 ? "0" : "1.2em");
          tspan.textContent = line;
          textNode.appendChild(tspan);
        });
      }
    }
    showElementAndFront(popupCorrect);
  }

  function updateQuestionUI() {
    const qData = GAME_CONFIG.questions[currentQuestionIndex];

    // UI State Management
    showElement(elements.activityPyramid);
    showElement(elements.questionPanel);
    hideElement(elements.introBox);

    hideElement(elements.instructions.intro);
    hideElement(elements.instructions.introItext);
    showElement(elements.instructions.question);
    showElement(elements.instructions.activityItext);

    hideElement(elements.popups.correct);
    hideElement(elements.popups.incorrect);

    // Show progress bar and insights button on question screen
    showElement(elements.progressBar);
    showElement(elements.btns.insights);

    // Show the appropriate pyramid level based on question number
    hideElement(elements.pyramidLevels.l1);
    hideElement(elements.pyramidLevels.l2);
    hideElement(elements.pyramidLevels.l3);
    hideElement(elements.pyramidLevels.final);

    if (qData.id <= 3) showElement(elements.pyramidLevels.l1);
    else if (qData.id <= 6) showElement(elements.pyramidLevels.l2);
    else if (qData.id <= 9) showElement(elements.pyramidLevels.l3);

    // Show clickable circles
    showElement(elements.clickableCircles);
    isAwaitingPyramidClick = false;

    // Set active brick
    const targetCircle = document.getElementById(qData.circleId);
    if (targetCircle) {
      targetCircle.classList.add("active-brick-circle");
    }
    if (elements.questionTexts.group) {
      const textElements =
        elements.questionTexts.group.querySelectorAll("text");

      if (textElements.length >= 3) {
        // Extract question number
        const questionStr = qData.question;
        const questionNum = qData.id;

        // Get scenario part (everything after "Question X: ")
        const scenarioIndex = questionStr.indexOf("Scenario:");
        let scenarioText = "";
        if (scenarioIndex !== -1) {
          scenarioText = questionStr.substring(scenarioIndex);
        }

        // Split scenario into two lines - aim for ~50 chars per line
        let line1 = "";
        let line2 = "";
        const words = scenarioText.split(" ");
        let charCount = 0;

        for (let i = 0; i < words.length; i++) {
          const testLine = line1 ? line1 + " " + words[i] : words[i];
          if (testLine.length <= 51) {
            line1 = testLine;
          } else {
            line2 = words.slice(i).join(" ");
            break;
          }
        }

        // If line2 is empty, put everything in line1
        if (!line2) {
          line1 = scenarioText;
        }

        // Update first text element - "Question X:"
        const firstText = textElements[0].querySelectorAll("tspan");
        if (firstText && firstText.length >= 1) {
          firstText[0].textContent = "Q";
          if (firstText[1])
            firstText[1].textContent = "uestion " + questionNum + ": ";
        }

        // Update second text element - first line of scenario
        const secondText = textElements[1].querySelector("tspan");
        if (secondText) {
          secondText.textContent = line1;
        }

        // Update third text element - second line of scenario
        const thirdText = textElements[2].querySelector("tspan");
        if (thirdText) {
          thirdText.textContent = line2;
        }
      }
    }

    // Toggle Option Sets
    elements.optionSets.forEach((set) => {
      if (set.id === qData.options) {
        showElement(set);
        set.style.opacity = "1";
      } else {
        hideElement(set);
      }
    });
  }

  // --- Main Logic ---

  function initGame() {
    if (elements.startBtn) elements.startBtn.style.cursor = "pointer";

    // Initial UI State: Show Intro, Hide everything else
    showElement(elements.introBox);
    showElement(elements.instructions.intro);
    showElement(elements.instructions.introItext);

    hideElement(elements.instructions.question);
    hideElement(elements.instructions.activityItext);

    hideElement(elements.activityPyramid);
    hideElement(elements.questionPanel);
    hideElement(elements.popups.correct);
    hideElement(elements.popups.incorrect);
    hideElement(elements.popups.insights);
    hideElement(elements.clickableCircles);
    hideElement(elements.progressBar);
    hideElement(elements.btns.insights);
    // Hide all highlighted progress bar stars initially
    if (elements.progressBarStars.length > 0) {
      elements.progressBarStars.forEach((star) => hideElement(star));
    }

    // Hide all pyramid tiers and final summary
    hideElement(elements.pyramidLevels.l1);
    hideElement(elements.pyramidLevels.l2);
    hideElement(elements.pyramidLevels.l3);
    hideElement(elements.pyramidLevels.final);

    // Hide all option sets
    elements.optionSets.forEach(hideElement);

    isAwaitingPyramidClick = false;
    currentQuestionIndex = 0;

    // Reset all dragged icons to original positions and parents
    Object.keys(originalPositions).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        snapToOriginal(el);
        el.style.pointerEvents = "auto"; // Unlock
        el.style.display = ""; // Reset inline display if any
        el.classList.remove("dragging");
      }
    });

    // Also remove checkmarks and pins from all circles
    GAME_CONFIG.questions.forEach(q => {
      removePin(q.circleId);
      const circle = document.getElementById(q.circleId);
      if (circle) {
        circle.classList.remove("active-brick-circle", "correct-brick-fill", "highlight-brick");
        circle.setAttribute("opacity", "0.43");
        circle.style.stroke = "";
        circle.style.strokeWidth = "";
      }
      // Remove checkmark (text element)
      const parent = circle?.parentNode;
      if (parent) {
        const checkmarks = Array.from(parent.querySelectorAll(".checkmark-icon")).filter(c => c.textContent === "✓");
        checkmarks.forEach(c => c.remove());
      }
    });
  }

  elements.startBtn.addEventListener("click", () => {
    hideElement(elements.introBox);
    showElement(elements.activityPyramid);
    updateQuestionUI();
  });

  // Handle Option Clicks and Drag & Drop
  elements.optionSets.forEach((set) => {
    // Select only direct child groups to avoid nested triggers
    const options = Array.from(set.children).filter((c) => c.tagName === "g");
    options.forEach((opt, index) => {
      opt.style.cursor = "pointer";

      // Click handler (REMOVED - now using Drag and Drop)
      /*
      opt.onclick = (e) => {
        ...
      };
      */

      // Find all targetable elements for drag and drop
      // User provided specific IDs for icons
      const draggableSelectors = [
        // '[id^="Ellipse_"]',
        'ellipse[id="Ellipse_17-2"]',
        'g[id="icon1"]',
        'g[id="icon3"]',
        'g[id="icon4"]',
        'g[id="icon5"]',
        'g[id="icon6"]',
        'g[id="icon7"]',
        'g[id="icon8"]',
        'g[id="Layer_1-6-2"]',
        'g[id="Layer_1-6-3"]',
        'g[id="Layer_1-4-2"]',
        'g[id="Layer_1-4-3"]',
        // 'g[id="Layer_1-4-2"]',
        // 'g[id="Layer_1-6-2"]',
        'g[id="Layer_1"]',
        'g[id="Layer_1-4"]',
        'g[id="Layer_1-6"]',
        'g[id="Layer_1-4-4"]',
        'g[id="Layer_1-4-5"]',
        'g[id="Layer_1-6-4"]',
        'g[id="Layer_1-6-5"]',
        'g[id="Layer_1-4-5"]',
        'g[id="Layer_1-4-6"]',
        'g[id="Layer_1-6-6"]',
        'g[id="Layer_1-4-7"]',
        'g[id="Layer_1-6-7"]',
        'g[id="Layer_1-4-8"]',
        'g[id="Layer_1-6-8"]',
        'g[id="icon9"]',
        'g[id="Layer_1-4-9"]',
        'g[id="Layer_1-6-9"]',
      ];

      const items = opt.querySelectorAll(draggableSelectors.join(","));

      items.forEach((item) => {
        let el = item;
        // If the item is an ellipse/circle inside a group with no ID,
        // make the parent group draggable instead so the icon path moves too.
        if (
          (el.tagName === "ellipse" || el.tagName === "circle") &&
          el.parentNode.tagName === "g" &&
          !el.parentNode.id
        ) {
          el = el.parentNode;
          if (!el.id) {
            el.id = "drag-group-auto-" + dragIdCounter++;
          }
        }

        el.style.cursor = "grab";
        if (el.id && !originalPositions[el.id]) {
          if (el.tagName === "g") {
            const transform = el.getAttribute("transform") || "";
            originalPositions[el.id] = { transform: transform, parent: el.parentNode };
          } else {
            originalPositions[el.id] = {
              x: parseFloat(el.getAttribute("cx") || el.getAttribute("x") || 0),
              y: parseFloat(el.getAttribute("cy") || el.getAttribute("y") || 0),
              parent: el.parentNode
            };
          }
        }
        el.addEventListener("mousedown", startDrag);
        el.addEventListener("touchstart", startDrag, { passive: false });
      });
    });
  });

  elements.btns.proceed.addEventListener("click", () => {
    hideElement(elements.popups.correct);
    // Proceed to next state (next question or end)
    proceedToNext();
  });

  function proceedToNext() {
    const qData = GAME_CONFIG.questions[currentQuestionIndex];

    // Show the corresponding tier
    if (qData.id <= 3) showElement(elements.pyramidLevels.l1);
    else if (qData.id <= 6) showElement(elements.pyramidLevels.l2);
    else if (qData.id <= 9) showElement(elements.pyramidLevels.l3);

    // Move to next question or end
    currentQuestionIndex++;
    if (currentQuestionIndex < GAME_CONFIG.totalQuestions) {
      updateQuestionUI();
    } else {
      showElementAndFront(elements.pyramidLevels.final);
      hideElement(elements.questionPanel);
      hideElement(elements.instructions.question);
      hideElement(elements.instructions.activityItext);
    }
  }

  elements.btns.tryAgain.addEventListener("click", () => {
    hideElement(elements.popups.incorrect);
  });

  // Handle Pyramid Building Click (REMOVED - now handled by proceedToNext)
  /*
  elements.clickableCircles.addEventListener("click", (e) => {
    ...
  });
  */

  // Insights
  if (elements.btns.insights) {
    elements.btns.insights.style.cursor = "pointer";
    elements.btns.insights.addEventListener("click", () =>
      showElementAndFront(elements.popups.insights),
    );
  }
  if (elements.btns.closeInsights) {
    elements.btns.closeInsights.style.cursor = "pointer";
    elements.btns.closeInsights.addEventListener("click", () =>
      hideElement(elements.popups.insights),
    );
  }

  // Play Again
  if (elements.btns.playAgain) {
    elements.btns.playAgain.style.cursor = "pointer";
    elements.btns.playAgain.addEventListener("click", () => {
      currentQuestionIndex = 0;
      initGame();
    });
  }

  // Modal Buttons
  if (elements.btns.proceed) elements.btns.proceed.style.cursor = "pointer";
  if (elements.btns.tryAgain) elements.btns.tryAgain.style.cursor = "pointer";
  if (elements.clickableCircles)
    elements.clickableCircles.style.cursor = "pointer";

  initGame();
});
