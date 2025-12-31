document.addEventListener("DOMContentLoaded", () => {

    /* ==================================================
     * 1. GLOBAL STATE (SINGLE SOURCE OF TRUTH)
     * ================================================== */
    let activeSurface = null;          // mirror | lake | paper | wall
    let activeRoughness = "calm";      // calm | wavy | rough
    let isLightRaysActive = false;     // 🔒 one-shot trigger flag
    let lottieInstance = null;

    /* ==================================================
     * 2. ELEMENT REFERENCES
     * ================================================== */
    const menuGroup        = document.getElementById("Material_title");
    const instructionText = document.getElementById("i_text");
    const buttonControls  = document.getElementById("button-controls");
    const svgContainer = document.querySelector(".svg-container");

    const buttonCircle = document.getElementById("button_circle");
    const lightRayBtn  = document.getElementById("light-ray-btn");

    const calmBtn  = document.getElementById("calm-selection");
    const wavyBtn  = document.getElementById("wavy-selection");
    const roughBtn = document.getElementById("rough-selection");

    const lakeCalm  = document.getElementById("lake_calm_reflection");
    const lakeWavy  = document.getElementById("lake_wavy_reflection");
    const lakeRough = document.getElementById("lake_rough_reflection");

    const animationContainer = document.getElementById("light-rays-animation");
    const insightBtn      = document.getElementById("insight-btn");
    const insightContent  = document.getElementById("insight-content");
    const closeInsightBtn = document.getElementById("close-insight-btn");
    const INSIGHT_LINE_2_TEXT = {
    lake: {
        calm:  {
            header:"Specular Reflection:",
            description:"The surface is smooth. The parallel light rays remain parallel after reflection, forming a mirror image."},
        wavy:  {
            header:"Diffused Reflection:",
            description:"The surface of disturbed water is bumpy. The parallel light rays reflect in different directions, so no clear image is formed."},
        rough: {
            header:"Diffused Reflection:",
            description:"The surface of the disturbed water is very bumpy. The parallel light rays reflect in different directions, so no image is formed."
        }
    },
    mirror: {
        header:"Specular Reflection:",
        description:"The surface is smooth. The parallel light rays remain parallel after reflection, forming a mirror image."
    },
    paper: {
        header:"Diffused Reflection:",
        description:"The surface is rough. The parallel light rays reflect in different directions, so no image is formed."
    },
    wall: {
        header:"Diffused Reflection:",
        description:"The surface is very rough. The parallel light rays reflect in different directions, so no image is formed."
    }
};

    if (insightBtn && insightContent) {
        insightBtn.addEventListener("click", () => {
            console.log("insight clicked");
            svgContainer.classList.add("modal-open");
            insightContent.style.display = "block";
        });
    }

    if (closeInsightBtn && insightContent) {
        closeInsightBtn.addEventListener("click", () => {
           svgContainer.classList.remove("modal-open");
            insightContent.style.display = "none";
        });
    }


    function updateSecondLineText() {
    const secondLine = document.getElementById("2nd-line");
    const firstLine = document.getElementById("1st-line");
    if (!secondLine) return;

    const tspan = secondLine.querySelector("div");
    const tspanFirst = firstLine ? firstLine.querySelector("tspan") : null;
    if (!tspan) return;

    let text;

    if (activeSurface === "lake") {
        text = INSIGHT_LINE_2_TEXT.lake[activeRoughness].description;
        if (tspanFirst) {
            tspanFirst.textContent = INSIGHT_LINE_2_TEXT.lake[activeRoughness].header;
        }
    } else {
        text = INSIGHT_LINE_2_TEXT[activeSurface].description;
        if (tspanFirst) {
            tspanFirst.textContent = INSIGHT_LINE_2_TEXT[activeSurface].header;
        }
    }

    if (text) {
        tspan.textContent = text;
    }
}


    /* ==================================================
     * 3. SURFACE SELECTION CONFIG
     * ================================================== */
    const interactions = [
        { btnId: "mirror-surface-selection", targetId: "mirror-reflection", surface: "mirror" },
        { btnId: "lake-surface-selection",   targetId: "lake-surface-reflection", surface: "lake",  isLake: true },
        { btnId: "paper-selection",          targetId: "paper-reflection",        surface: "paper" },
        { btnId: "wall-selection",           targetId: "wall-reflection",         surface: "wall" }
    ];

    resetActiveSimulation();

    /* ==================================================
     * 4. SURFACE CLICK HANDLERS
     * ================================================== */
    interactions.forEach(item => {
        const button = document.getElementById(item.btnId);
        const target = document.getElementById(item.targetId);
        if (!button || !target) return;

        button.style.cursor = "pointer";

        button.addEventListener("click", () => {

            // Reset animation ALWAYS on surface change
            destroyAnimation();
            isLightRaysActive = false;

            // Update state
            activeSurface   = item.surface;
            activeRoughness = "calm";

            // UI updates
            menuGroup.style.display        = "none";
            instructionText.style.display = "none";
            buttonControls.style.display  = "block";

            hideAllReflections();
            target.style.display = "block";
            updateSecondLineText();
            if (item.isLake) {
                activateLakeState("calm");
            }
        });
    });

    /* ==================================================
     * 5. ROUGHNESS SELECTION (IMAGE ONLY — NO ANIMATION)
     * ================================================== */
    const ROUGHNESS_X = { calm: 104, wavy: 377, rough: 650 };

    function activateLakeState(type) {

        // 🔴 CRITICAL: roughness change MUST stop animation
        destroyAnimation();
        isLightRaysActive = false;

        activeRoughness = type;
        buttonCircle.setAttribute("x", ROUGHNESS_X[type]);

        lakeCalm.style.display  = "none";
        lakeWavy.style.display  = "none";
        lakeRough.style.display = "none";

        if (type === "calm")  lakeCalm.style.display  = "block";
        if (type === "wavy")  lakeWavy.style.display  = "block";
        if (type === "rough") lakeRough.style.display = "block";
        updateSecondLineText();
    }

    calmBtn?.addEventListener("click",  () => activateLakeState("calm"));
    wavyBtn?.addEventListener("click",  () => activateLakeState("wavy"));
    roughBtn?.addEventListener("click", () => activateLakeState("rough"));

    /* ==================================================
     * 6. LOTTIE PATH MAP
     * ================================================== */
    const LOTTIE_MAP = {
        lake: {
            calm:  "assets/animation-assets/Mirror_rays_2.json",
            wavy:  "assets/animation-assets/Paper_rays_2.json",
            rough: "assets/animation-assets/Wall_rays_2.json"
        },
        mirror: "assets/animation-assets/Mirror_rays.json",
        paper:  "assets/animation-assets/Paper_rays.json",
        wall:   "assets/animation-assets/Wall_rays.json"
    };

    /* ==================================================
     * 7. LIGHT RAYS BUTTON
     *    🚨 THE ONLY PLACE ANIMATION IS ALLOWED TO START
     * ================================================== */
    lightRayBtn?.addEventListener("click", () => {
        if (!activeSurface) return;

        destroyAnimation();       // prevent stacking
        isLightRaysActive = true; // mark intent for THIS click only

        loadLightRayAnimation();
    });

    /* ==================================================
     * 8. ANIMATION LOADER (PRIVATE — NOT CALLED ANYWHERE ELSE)
     * ================================================== */
    function loadLightRayAnimation() {

        if (!isLightRaysActive) return;

        const animationPath =
            activeSurface === "lake"
                ? LOTTIE_MAP.lake[activeRoughness]
                : LOTTIE_MAP[activeSurface];

        if (!animationPath || !animationContainer) return;

        animationContainer.style.display = "block";

        lottieInstance = lottie.loadAnimation({
            container: animationContainer,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: animationPath
        });
    }

    function destroyAnimation() {
        if (lottieInstance) {
            lottieInstance.destroy();
            lottieInstance = null;
        }
        if (animationContainer) {
            animationContainer.innerHTML = "";
            animationContainer.style.display = "none";
        }
    }

    /* ==================================================
     * 9. UTILITIES
     * ================================================== */
    function hideAllReflections() {
        [
            "mirror-reflection",
            "lake-surface-reflection",
            "paper-reflection",
            "wall-reflection",
            "lake_calm_reflection",
            "lake_wavy_reflection",
            "lake_rough_reflection"
        ].forEach(id => {
            const el = document.getElementById(id);
            el && (el.style.display = "none");
        });
    }
});

/* ==================================================
 * 10. GLOBAL RESET (RESET BUTTON)
 * ================================================== */
window.resetActiveSimulation = function () {

    const animationContainer = document.getElementById("light-rays-animation");
    const buttonCircle       = document.getElementById("button_circle");

    document.getElementById("Material_title").style.display = "block";
    document.getElementById("i_text").style.display        = "block";
    document.getElementById("button-controls").style.display = "none";

    [
        "mirror-reflection",
        "lake-surface-reflection",
        "paper-reflection",
        "wall-reflection",
        "lake_calm_reflection",
        "lake_wavy_reflection",
        "lake_rough_reflection"
    ].forEach(id => {
        const el = document.getElementById(id);
        el && (el.style.display = "none");
    });

    if (animationContainer) {
        animationContainer.innerHTML = "";
        animationContainer.style.display = "none";
    }

    buttonCircle?.setAttribute("x", 104);

    // Reset state
    activeSurface       = null;
    activeRoughness     = "calm";
    isLightRaysActive   = false;
};
