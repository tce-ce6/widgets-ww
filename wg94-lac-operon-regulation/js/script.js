document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("Group 592");
    const resetBtn = document.getElementById("Group 593");
    const toggleContainer = document.getElementById("Group 595");
    const insightsBtn = document.getElementById("Group 6");
    const insightsModal = document.getElementById("insights-modal");
    const closeInsights = document.getElementById("close-insights");
    const instructionText = document.getElementById("instruction-text");

    const toggleTrack = document.getElementById("Rectangle 2_3");
    const toggleDot = document.getElementById("Ellipse 1");
    const insightsHitArea = document.getElementById("insights-hit-area");

    const stepTranscription = document.getElementById("step-transcription");
    const stepRepressorMRNA = document.getElementById("step-repressor-mrna");
    const stepTranslation = document.getElementById("step-translation");
    const repressorProtein = document.getElementById("repressor-protein");
    const repressorLabel = document.getElementById("repressor-label");
    const inducerDotGroup = document.getElementById("inducer-dot-group");
    const noEnzymeSign = document.getElementById("no-enzyme-sign");
    const lacMRNAGroup = document.getElementById("lac-mrna-group");
    const enzymesGroup = document.getElementById("enzymes-group");

    let isStarted = false;
    let simulationPhase = 0; // 0: Pre-start, 1: Repressor formed, 2: At operator
    let isInducerPresent = false;
    let isChoiceMade = false; // New flag for Grey Logic
    let isAnimating = false;

    let clickCount = 0;
    let clickTimer = null;

    const POS_START = { x: 550, y: 640 };
    const POS_OPERATOR = { x: 904, y: 304 };
    const POS_AWAY = { x: 550, y: 650 };

    positionRepressor(POS_START.x, POS_START.y);
    resetUI();

    startBtn.addEventListener("click", () => {
        if (!isAnimating && simulationPhase === 0) {
            startSimulationPart1();
        } else if (!isAnimating && simulationPhase === 1) {
            startSimulationPart2();
        }
    });

    resetBtn.addEventListener("click", () => {
        if (!isAnimating) resetUI();
    });

    toggleContainer.addEventListener("click", () => {
        if (!isAnimating && isStarted) {
            if (!isChoiceMade) {
                clickCount++;
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        if (!isChoiceMade) {
                            isChoiceMade = true;
                            toggleInducer(true); // Single click -> Present
                        }
                        clickCount = 0;
                        clickTimer = null;
                    }, 300);
                } else if (clickCount === 2) {
                    if (clickTimer) clearTimeout(clickTimer);
                    isChoiceMade = true;
                    toggleInducer(false); // Double click -> Absent
                    clickCount = 0;
                    clickTimer = null;
                }
            } else {
                toggleInducer();
            }
        }
    });

    window.openInsights = function () {
        const modal = document.getElementById("insights-modal");
        if (modal) {
            modal.style.display = "flex";
        }
    };

    window.closeInsightsModal = function (e) {
        if (e) e.stopPropagation();
        const modal = document.getElementById("insights-modal");
        if (modal) {
            modal.style.display = "none";
        }
    };

    if (insightsBtn) {
        insightsBtn.addEventListener("click", (e) => {
            window.openInsights();
        });
    }

    if (insightsHitArea) {
        insightsHitArea.addEventListener("click", (e) => {
            window.openInsights();
        });
    }

    if (closeInsights) {
        closeInsights.addEventListener("click", (e) => {
            window.closeInsightsModal(e);
        });
    }

    window.addEventListener("click", (e) => {
        const modal = document.getElementById("insights-modal");
        if (e.target === modal) {
            window.closeInsightsModal();
        }
    });

    function openInsights() { window.openInsights(); }

    async function startSimulationPart1() {
        if (isStarted || isAnimating) return;
        isAnimating = true;
        isStarted = true;
        
        // Disable Start button permanently
        startBtn.style.opacity = "0.45";
        startBtn.style.pointerEvents = "none";
        instructionText.setAttribute("visibility", "hidden");

        show(stepTranscription);
        await wait(1200);

        show(stepRepressorMRNA);
        await wait(1200);
        show(stepTranslation);
        await wait(1200);

        positionRepressor(POS_START.x, POS_START.y);
        show(repressorProtein);

        instructionText.setAttribute("visibility", "visible");

        simulationPhase = 1;
        isAnimating = false;
        isChoiceMade = false;

        // Initialize Toggle as Grey (Neutral)
        setToggleEnabled(true);
        setToggleState(false, false); // Grey track
        setToggleLabelsNeutral();     // Both labels grey
    }

    async function startSimulationPart2() {
        if (simulationPhase !== 1 || isAnimating) return;

        isAnimating = true;

        startBtn.style.opacity = "0.45";
        startBtn.style.pointerEvents = "none";

        const operatorRepressor = document.getElementById("operator-repressor");
        show(operatorRepressor);

        await wait(1300);

        // Start with toggle greyed but clickable for discovery (State 1)
        setToggleState(false, false); // Dot on right (Absent), Track Grey
        setToggleVisibleDisabled(true);

        hide(noEnzymeSign);
        hide(document.getElementById("operator-inducer-part"));

        simulationPhase = 2;
        isAnimating = false;

        // updateInstructionText("Repressor is bound to operator.");
    }

    function updateInstructionText(text) {
        const tspan = instructionText.querySelector('tspan');
        if (tspan) {
            tspan.textContent = text;
            tspan.setAttribute("fill", "#C90E0E");
        }
    }

    function setToggleLabels(isInducerPresent) {
        const presentLabel = document.getElementById("Inducer present");
        const absentLabel = document.getElementById("Inducer absent");
        if (!presentLabel || !absentLabel) return;

        if (isInducerPresent) {
            presentLabel.querySelector('tspan').setAttribute("fill", "#FFFFFF");
            absentLabel.querySelector('tspan').setAttribute("fill", "#00258B");
        } else {
            presentLabel.querySelector('tspan').setAttribute("fill", "#00258B");
            absentLabel.querySelector('tspan').setAttribute("fill", "#FFFFFF");
        }
    }

    function setToggleLabelsNeutral() {
        const presentLabel = document.getElementById("Inducer present");
        const absentLabel = document.getElementById("Inducer absent");
        if (presentLabel) presentLabel.querySelector('tspan').setAttribute("fill", "#00258B");
        if (absentLabel) absentLabel.querySelector('tspan').setAttribute("fill", "#00258B");
    }

    // Helper to move the SVG element
    function moveRepressor(targetX, targetY) {
        return new Promise((resolve) => {
            // Basic CSS transition approach (ensure repressorProtein has transition style)
            repressorProtein.style.transition = "transform 1.2s ease-in-out";
            repressorProtein.style.transform = `translate(${targetX}px, ${targetY}px)`;

            setTimeout(resolve, 1200);
        });
    }

    async function toggleInducer(specificState = null) {
        if (isAnimating) return;
        isAnimating = true;

        if (specificState !== null) {
            isInducerPresent = specificState;
        } else {
            isInducerPresent = !isInducerPresent;
        }

        setToggleState(isInducerPresent, true); // Track becomes green
        setToggleLabels(isInducerPresent);

        const operatorInducer = document.getElementById("operator-inducer-part");
        const operatorRepressor = document.getElementById("operator-repressor");

        if (simulationPhase === 1) {
            // SCENARIO 1 & 2 branching
            if (isInducerPresent) {
                // Scenario 1: Inducer Present -> Protein is inactive at bottom
                show(inducerDotGroup);
                setRepressorLabel("Repressor\n(Inactive)");

                show(lacMRNAGroup);
                await wait(1200);
                show(enzymesGroup);
            } else {
                // Scenario 2: Inducer Absent -> Repressor goes to operator
                hide(inducerDotGroup);
                setRepressorLabel("Repressor");

                // Animate movement to operator
                hide(lacMRNAGroup);
                hide(enzymesGroup);

                await wait(500);

                show(operatorRepressor);
                show(noEnzymeSign);

                simulationPhase = 2;
            }
        } else if (simulationPhase === 2) {
            // SCENARIO 3 (Inducer present while at operator)
            if (isInducerPresent) {
                show(operatorInducer);
                show(noEnzymeSign);
                show(inducerDotGroup);
                setRepressorLabel("Repressor\n(Inactive)");
                hide(inducerDotGroup);
            } else {
                hide(operatorInducer);
                show(noEnzymeSign);
                hide(inducerDotGroup);
                setRepressorLabel("Repressor");
            }
        }

        isAnimating = false;
    }

    function resetUI() {
        isStarted = false;
        simulationPhase = 0;
        isInducerPresent = false;
        isAnimating = false;

        // Re-enable start
        startBtn.style.opacity = "1";
        startBtn.style.pointerEvents = "auto";
        instructionText.setAttribute("visibility", "visible");

        // Hide all dynamic elements
        hide(stepTranscription);
        hide(stepRepressorMRNA);
        hide(stepTranslation);
        hide(repressorProtein);
        hide(inducerDotGroup);
        hide(noEnzymeSign);
        hide(lacMRNAGroup);
        hide(enzymesGroup);
        hide(insightsModal);
        hide(document.getElementById("operator-repressor"));

        // Reset repressor protein to start position instantly (no transition)
        disableTransition(repressorProtein);
        positionRepressor(POS_START.x, POS_START.y);
        setRepressorLabel("Repressor");
        // Re-enable transition after reset
        setTimeout(() => enableTransition(repressorProtein), 50);

        // Disable toggle
        setToggleEnabled(false);
        setToggleState(false);
        setToggleLabels(false); // Default logic

        instructionText.querySelector('tspan').textContent = "Tap Start to initiate i gene's expression";
        instructionText.querySelector('tspan').setAttribute("fill", "#C90E0E");
    }

    function show(el) {
        if (!el) return;
        if (el.tagName && el.tagName.toLowerCase() === 'div') {
            el.style.display = "flex";
        } else {
            el.setAttribute("visibility", "visible");
            el.style.opacity = "1";
        }
    }

    function hide(el) {
        if (!el) return;
        if (el.tagName && el.tagName.toLowerCase() === 'div') {
            el.style.display = "none";
        } else {
            el.setAttribute("visibility", "hidden");
            el.style.opacity = "0";
        }
    }

    function positionRepressor(x, y) {
        repressorProtein.setAttribute("transform", `translate(${x}, ${y})`);
    }

    function moveRepressor(x, y) {
        repressorProtein.setAttribute("transform", `translate(${x}, ${y})`);
    }

    function disableTransition(el) {
        el.style.transition = "none";
    }

    function enableTransition(el) {
        el.style.transition = "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
    }

    function setRepressorLabel(text) {
        if (!repressorLabel) return;
        const inactiveLabel = document.getElementById("repressor-inactive-label");

        if (text && text.includes("(Inactive)")) {
            repressorLabel.textContent = "Repressor";
            if (inactiveLabel) show(inactiveLabel);
        } else {
            repressorLabel.textContent = text;
            if (inactiveLabel) hide(inactiveLabel);
        }
    }

    function setToggleEnabled(enabled) {
        const opacity = enabled ? "1" : "0.3";
        toggleContainer.style.opacity = opacity;
        toggleContainer.setAttribute("opacity", opacity);
        // Keep pointerEvents auto so user can click to "discover" it
        toggleContainer.style.pointerEvents = "auto";
    }

    function setToggleVisibleDisabled(disabled) {
        const opacity = disabled ? "0.3" : "1";
        toggleContainer.style.opacity = opacity;
        toggleContainer.setAttribute("opacity", opacity);
        toggleContainer.style.pointerEvents = "auto";
    }

    function setToggleState(inducerPresent, isEnabled = true) {
        if (!toggleDot) return;

        if (inducerPresent) {
            // Inducer Present -> Dot on LEFT
            toggleDot.setAttribute("transform", "translate(-84, 0)");
        } else {
            // Inducer Absent -> Dot on RIGHT
            toggleDot.setAttribute("transform", "translate(0, 0)");
        }

        const trackColor = isEnabled ? "#3CC43C" : "#808080";
        if (toggleTrack) toggleTrack.setAttribute("fill", trackColor);
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});