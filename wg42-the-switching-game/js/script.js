document.addEventListener("DOMContentLoaded", () => {
    const introScreen = document.getElementById("intro-screen");
    const learnBtn = document.querySelector("#intro-screen button:nth-child(1)");
    const practiseBtn = document.querySelector("#intro-screen button:nth-child(2)");

    const homeBtn = document.getElementById("Home_button");
    const nextBtn = document.getElementById("Check_answer_reset_etc");
    const progressBar = document.getElementById("Progress_bar");
    const feedback = document.getElementById("Feedback_sticker");
    const correct = document.getElementById("Group_1182");
    const incorrect = document.getElementById("Group_1182-2");
    // Screens / Panels
    const IText = document.getElementById("I-text");
    const learnPanel1 = document.getElementById("Question_2_panel_1");
    const learnPanel2 = document.getElementById("Question_2_panel_2"); // Target boxes
    const learnPanel3 = document.getElementById("Question_2_panel_3"); // Options
    const practiseScreen = document.getElementById("Practise_screen");

    // Other SVGs (hidden for now)
    const otherScreens = [
        document.getElementById("Question_2_panel"),
        document.getElementById("Compare_active_passive"),
        document.getElementById("Question_3_panel"),
    ];

    function hideAll() {
        introScreen.style.display = "none";
        IText.style.display = "none";
        learnPanel1.style.display = "none";
        learnPanel2.style.display = "none";
        learnPanel3.style.display = "none";
        practiseScreen.style.display = "none";
        homeBtn.style.display = "none";
        nextBtn.style.display = "none";
        progressBar.style.display = "none";
        incorrect.style.display = "none";
        correct.style.display = "none";
        feedback.style.opacity = "0";
        otherScreens.forEach(s => {
            if (s) s.style.display = "none";
        });
    }

    function initGame() {
        hideAll();
        introScreen.style.display = "block";
    }

    // --- Utility to handle Options and Drops ---
    function setupInteraction(optionsPanel, dropZonesParent, targetSequence, onComplete) {
        // Find all drop boxes
        const dropZones = Array.from(dropZonesParent.querySelectorAll("g[id^='Rectangle_']"))
            .sort((a, b) => {
                const rectA = a.querySelector("rect");
                const rectB = b.querySelector("rect");
                if (!rectA || !rectB) return 0;
                const yA = parseFloat(rectA.getAttribute("y") || 0);
                const yB = parseFloat(rectB.getAttribute("y") || 0);
                if (Math.abs(yA - yB) > 20) return yA - yB;
                const xA = parseFloat(rectA.getAttribute("x") || 0);
                const xB = parseFloat(rectB.getAttribute("x") || 0);
                return xA - xB;
            });

        // Options mapping
        const optionGroups = Array.from(optionsPanel.children).filter(g => g.querySelector('text'));

        // Track filled slots
        let filledSlots = new Array(dropZones.length).fill(null);
        let clones = []; // To easily reset later if needed

        optionGroups.forEach(g => {
            g.style.cursor = "pointer";
            g.onclick = () => {
                if (g.classList.contains("used")) return;

                const emptySlotIndex = filledSlots.findIndex(slot => slot === null);
                if (emptySlotIndex === -1) return; // No empty slots

                const textEl = g.querySelector("text");
                if (!textEl) return;
                const word = Array.from(textEl.querySelectorAll("tspan")).map(t => t.textContent).join("").trim();

                // Mark as used
                g.classList.add("used");
                g.style.opacity = "0.4";

                // Clone for drop zone
                const clone = g.cloneNode(true);
                clone.style.cursor = "pointer";
                clone.style.opacity = "1";
                clone.classList.remove("used");

                const srcRect = g.querySelector("rect");
                const dstGroup = dropZones[emptySlotIndex];
                const dstRect = dstGroup.querySelectorAll("rect")[0];

                const dx = parseFloat(dstRect.getAttribute("x")) - parseFloat(srcRect.getAttribute("x"));
                const dy = parseFloat(dstRect.getAttribute("y")) - parseFloat(srcRect.getAttribute("y"));

                clone.setAttribute("transform", `translate(${dx}, ${dy})`);

                // Make the clone removable
                clone.onclick = () => {
                    clone.remove();
                    filledSlots[emptySlotIndex] = null;
                    g.classList.remove("used");
                    g.style.opacity = "1";

                    // feedback.style.opacity = "0"; // Removed as per request
                    correct.style.display = "none";
                    incorrect.style.display = "none";
                    nextBtn.style.display = "none";
                };

                dropZonesParent.appendChild(clone);
                filledSlots[emptySlotIndex] = { word, clone };
                clones.push(clone);

                // Check completion
                if (filledSlots.findIndex(slot => slot === null) === -1) {
                    const currentSequence = filledSlots.map(s => s.word);
                    const isCorrect = currentSequence.every((w, i) => w === targetSequence[i]);

                    if (isCorrect) {
                        correct.style.display = "block";
                        incorrect.style.display = "none";
                        // feedback.style.opacity = "1"; // User requested not to show "Great work!"
                        onComplete(true);
                    } else {
                        incorrect.style.display = "block";
                        correct.style.display = "none";
                        // feedback.style.opacity = "1"; // User requested not to show "Great work!"
                        onComplete(false);
                    }
                }
            };
        });
    }

    learnBtn.addEventListener("click", () => {
        hideAll();
        IText.style.display = "block";
        learnPanel1.style.display = "block";
        learnPanel2.style.display = "block";
        learnPanel3.style.display = "block";
        homeBtn.style.display = "block";
        progressBar.style.display = "block";

        setupInteraction(learnPanel3, learnPanel2, ["was", "prepared", "by", "the chef."], (isCorrect) => {
            if (isCorrect) {
                nextBtn.style.display = "block";
            }
        });
    });

    practiseBtn.addEventListener("click", () => {
        hideAll();
        practiseScreen.style.display = "block";
        homeBtn.style.display = "block";
        progressBar.style.display = "block";

        const practiseOptions = document.getElementById("Group_702");
        const practiseZonesParent = document.getElementById("Group_623-4"); // Wrapper for boxes

        setupInteraction(practiseOptions, practiseZonesParent, ["Their", "grandmother", "is", "loved", "by", "the", "children", "."], (isCorrect) => {
            if (isCorrect) {
                nextBtn.style.display = "block";
            }
        });
    });

    homeBtn.addEventListener("click", () => {
        initGame();
    });

    initGame();
});

