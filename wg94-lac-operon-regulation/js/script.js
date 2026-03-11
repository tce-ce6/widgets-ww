document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("Group_5921");
    const resetBtn = document.getElementById("Group_5931");
    const insightsBtn = document.getElementById("Group_61");
    const insightPanel = document.getElementById("Insight_panel");
    const closePanelBtn = document.getElementById("Group_579");
    const toggleContainer = document.getElementById("Toggle_button");

    const togglePresent = document.getElementById("toggle-present");
    const toggleAbsent = document.getElementById("toggle-absent");
    const toggleNeutral = document.getElementById("toggle-neutral");

    const iText = document.getElementById("I-text");

    const lhsRoot = document.getElementById("LHS_elements");
    const lhsRepAtOp = document.getElementById("lhs-repressor-at-operator");
    const lhsInducerAtOp = document.getElementById("lhs-inducer-at-operator");
    const lhsStepTrans = document.getElementById("lhs-step-transcription");
    const lhsStepMRNA = document.getElementById("lhs-step-mrna");
    const lhsStepTrans2 = document.getElementById("lhs-step-translation");
    const lhsRepPlain = document.getElementById("lhs-repressor-plain");
    const lhsRepLabel = document.getElementById("lhs-repressor-label");
    const lhsInducerDot = document.getElementById("lhs-inducer-on-repressor");
    const lhsInactiveLabel = document.getElementById("lhs-repressor-inactive-label");

    const rhsRoot = document.getElementById("RHS_elements");
    const rhsTranscription = document.getElementById("rhs-transcription");
    const rhsLacMRNA = document.getElementById("rhs-lac-mrna");
    const rhsTranslation = document.getElementById("rhs-translation");
    const rhsEnzymes = document.getElementById("rhs-enzymes");

    const noEnzymeCard = document.getElementById("No_enzyme_card");

    let simulationPhase = 0;
    let isInducerPresent = null;
    let isAnimating = false;

    resetUI();

    startBtn.addEventListener("click", () => {
        if (isAnimating) return;
        if (simulationPhase === 0) startPhase1();
    });

    resetBtn.addEventListener("click", () => {
        if (!isAnimating) resetUI();
    });

    toggleContainer.addEventListener("click", (e) => {
        if (isAnimating || simulationPhase < 1) return;

        const svgEl = toggleContainer.closest("svg");
        const pt = svgEl.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svgEl.getScreenCTM().inverse());

        const clickedPresent = svgP.x < 1200;

        if (simulationPhase === 2 && clickedPresent === isInducerPresent) return;

        setInducer(clickedPresent);
    });

    insightsBtn.addEventListener("click", () => { show(insightPanel); });
    closePanelBtn.addEventListener("click", () => { hide(insightPanel); });

    async function startPhase1() {
        isAnimating = true;

        startBtn.style.opacity = "0.4";
        startBtn.style.pointerEvents = "none";
        hide(iText);

        show(lhsRoot);

        show(lhsStepTrans);
        await wait(1200);

        show(lhsStepMRNA);
        await wait(1200);

        show(lhsStepTrans2);
        await wait(1200);

        show(lhsRepPlain);
        show(lhsRepLabel);

        toggleNeutral.style.pointerEvents = "auto";

        simulationPhase = 1;
        isAnimating = false;
    }

    async function setInducer(present) {
        if (isAnimating) return;
        isAnimating = true;
        isInducerPresent = present;

        const isFirstSelection = (simulationPhase === 1);
        if (isFirstSelection) simulationPhase = 2;

        // Reset scenario-specific visuals
        hide(lhsRepAtOp);
        hide(lhsInducerAtOp);
        hide(lhsInducerDot);
        hide(lhsInactiveLabel);
        hide(noEnzymeCard);
        hide(rhsRoot);
        hide(rhsTranscription);
        hide(rhsLacMRNA);
        hide(rhsTranslation);
        hide(rhsEnzymes);

        // Restore plain repressor (always visible from phase 1 onwards)
        show(lhsRepPlain);
        show(lhsRepLabel);

        // Show correct toggle state
        hide(toggleNeutral);
        if (present) {
            show(togglePresent);
            hide(toggleAbsent);
        } else {
            hide(togglePresent);
            show(toggleAbsent);
        }

        if (isFirstSelection && present) {
            // ══ SCENARIO A ══
            // First selection = Inducer Present
            // → Protein at bottom becomes inactive, RHS enzymes produced
            show(lhsInducerDot);       // inducer dot on bottom repressor oval
            await wait(600);
            hide(lhsRepLabel);
            show(lhsInactiveLabel);    // label switches: "Repressor (Inactive)"

            await wait(600);

            show(rhsRoot);
            show(rhsTranscription);
            await wait(1000);
            show(rhsLacMRNA);
            await wait(1000);
            show(rhsTranslation);
            await wait(800);
            show(rhsEnzymes);

        } else if (isFirstSelection && !present) {
            // ══ SCENARIO B ══
            // First selection = Inducer Absent
            // → Repressor moves to operator, No Enzyme card
            await wait(400);
            show(lhsRepAtOp);
            await wait(800);
            show(noEnzymeCard);

        } else if (!isFirstSelection && present) {
            // ══ SCENARIO C ══
            // Switching TO Inducer Present (already in phase 2)
            // → Inducer binds repressor AT the operator; operator still blocked → No Enzyme
            show(lhsRepAtOp);          // repressor stays at operator
            await wait(400);
            show(lhsInducerAtOp);      // inducer dot appears ON the operator-bound repressor
            await wait(600);
            show(noEnzymeCard);

        } else {
            // ══ SCENARIO D ══
            // Switching TO Inducer Absent (from enzyme view or Scenario C)
            // → Inducer leaves, repressor at operator, No Enzyme
            await wait(400);
            show(lhsRepAtOp);
            await wait(800);
            show(noEnzymeCard);
        }

        isAnimating = false;
    }

    function resetUI() {
        isAnimating = false;
        simulationPhase = 0;
        isInducerPresent = null;

        startBtn.style.opacity = "1";
        startBtn.style.pointerEvents = "auto";

        show(iText);

        hide(lhsRoot);
        hide(lhsRepAtOp);
        hide(lhsInducerAtOp);
        hide(lhsStepTrans);
        hide(lhsStepMRNA);
        hide(lhsStepTrans2);
        hide(lhsRepPlain);
        hide(lhsRepLabel);
        hide(lhsInducerDot);
        hide(lhsInactiveLabel);

        hide(rhsRoot);
        hide(rhsTranscription);
        hide(rhsLacMRNA);
        hide(rhsTranslation);
        hide(rhsEnzymes);

        hide(noEnzymeCard);
        hide(insightPanel);

        hide(togglePresent);
        hide(toggleAbsent);
        show(toggleNeutral);
        toggleNeutral.style.opacity = "0.4";
        toggleNeutral.style.pointerEvents = "none";
    }

    function show(el) {
        if (!el) return;
        el.setAttribute("visibility", "visible");
    }

    function hide(el) {
        if (!el) return;
        el.setAttribute("visibility", "hidden");
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});