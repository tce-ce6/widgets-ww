document.addEventListener("DOMContentLoaded", () => {
    // --- State ---
    const state = {
        isDay: true,
        light: 0.5, // 0 to 1
        co2: 0.5,   // 0 to 1 (maps to 0 to 0.10%)
        temp: 35,   // 0 to 50
        water: 0.5, // 0 to 1
        rate: 0,
        popupOpen: false
    };

    // --- Constants ---
    const SLIDER_X_MIN = 1390.5;
    const SLIDER_X_MAX = 1694.5;
    const SLIDER_WIDTH = SLIDER_X_MAX - SLIDER_X_MIN;

    // --- Elements ---
    const svg = document.querySelector("#svg-container svg");
    if (!svg) {
        console.error("SVG container not found!");
        return;
    }

    // Sliders
    const lightHandle = document.getElementById("Group_683");
    const co2Handle = document.getElementById("Group_683-2");
    const tempHandle = document.getElementById("Group_683-3");
    const waterHandle = document.getElementById("Group_683-4");

    const lightValueText = document.getElementById("Optimal_3") ? document.getElementById("Optimal_3").querySelector("tspan") : null;
    const co2ValueText = document.getElementById("0.05%") ? document.getElementById("0.05%").querySelector("tspan") : null;
    const tempValueText = document.getElementById("35") ? document.getElementById("35").querySelector("tspan") : null;
    const waterValueText = document.getElementById("Moderate_2") ? document.getElementById("Moderate_2").querySelector("tspan") : null;

    // Toggles & Buttons
    const dayNightToggle = document.getElementById("day_x5F_night_tab");
    const insightsBtn = document.getElementById("btn-insights");
    const insightsPopup = document.getElementById("insights-pop-up");
    const closeInsightsBtn = document.getElementById("Group_1331");

    // Visual Layers
    const skyDay = document.getElementById("sky");
    const skyTemp = document.getElementById("sky_tempreture");
    const nightOverlay = document.getElementById("night");
    const sunRays = document.getElementById("sun_rays");
    const sun = document.getElementById("sun");
    const nightBg = document.getElementById("night_bg");
    const moonStars = document.getElementById("Group_1119");
    const waterOnGround = document.getElementById("water_on_ground");
    const waterPot = document.getElementById("water_pot");
    const waterPour = document.getElementById("water");

    // Plant Visuals
    const stomataOpen = document.getElementById("stomata_2");
    const stomataClosed = document.getElementById("stomata_closed");
    const textOpen = document.getElementById("text_open");
    const textClosed = document.getElementById("text_closed");

    const labels = {
        light: document.getElementById("text_light_energy"),
        co2Photo: document.getElementById("co2"),
        o2Photo: document.getElementById("text_o2"),
        sugar: document.getElementById("text_sugar"),
        water: document.getElementById("text_water"),
        respirationGroup: document.getElementById("text_arrow"),
        stomataPartiallyClosed: document.getElementById("Stomata_partially_closed"),
        respirationLabel1: document.getElementById("co2_2"),
        respirationLabel2: document.getElementById("o2")
    };

    const arrows = {
        light: document.getElementById("arrow_light"),
        co2: document.getElementById("arrow_co2"),
        o2: document.getElementById("arrow_o2"),
        sugar: document.getElementById("arrow_sugar"),
        water: document.getElementById("arrow_water"),
        respiration: document.getElementById("arrow_molucule")
    };

    const molecules = {
        co2: document.getElementById("molucule_co2"),
        o2: document.getElementById("molucule_o2"),
        respirationCo2: document.getElementById("co2_molucule_2"),
        respirationO2: document.getElementById("o2_molucule")
    };

    // Feedback Boxes
    const feedbacks = {
        rateLimited: document.getElementById("feedback-rate-limited"),
        slowLane: document.getElementById("feedback-slow-lane"),
        stabilised: document.getElementById("feedback-stabilised"),
        photoOxidation: document.getElementById("feedback-warning-photo-oxidation"),
        co2Overload: document.getElementById("feedback-warning-co2-overload"),
        criticalFailure: document.getElementById("feedback-critical-failure"),
        systemError: document.getElementById("feedback-system-error"),
        starvation: document.getElementById("feedback-starvation"),
        systemFrozen: document.getElementById("feedback-system-frozen"),
        goodRate: document.getElementById("feedback-good-rate"),
        perfectScore: document.getElementById("feedback-perfect-score")
    };

    // Graph
    const graphPath = document.getElementById("Path_1278");
    let graphPoints = [];
    const MAX_POINTS = 100;

    // --- Initialization ---
    function init() {
        setupEventListeners();
        updateSliderVisuals();
        updateSimulation();
        animateGraph();
    }

    // --- Helper Functions ---
    function getSVGPoint(e) {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX || (e.touches && e.touches[0].clientX);
        pt.y = e.clientY || (e.touches && e.touches[0].clientY);
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    }

    function setupSlider(handle, stateKey, minVal, maxVal, isInteger = false) {
        if (!handle) return;
        let dragging = false;

        handle.style.cursor = "pointer";

        const onStart = (e) => {
            dragging = true;
            if (e.cancelable) e.preventDefault();
        };

        const onMove = (e) => {
            if (!dragging) return;
            const pt = getSVGPoint(e);
            let nx = pt.x;
            if (nx < SLIDER_X_MIN) nx = SLIDER_X_MIN;
            if (nx > SLIDER_X_MAX) nx = SLIDER_X_MAX;

            const percent = (nx - SLIDER_X_MIN) / SLIDER_WIDTH;
            let val = minVal + percent * (maxVal - minVal);
            if (isInteger) val = Math.round(val);

            state[stateKey] = val;
            updateSliderVisuals();
            updateSimulation();
        };

        const onEnd = () => {
            dragging = false;
        };

        handle.addEventListener("mousedown", onStart);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onEnd);

        handle.addEventListener("touchstart", onStart, { passive: false });
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", onEnd);
    }

    function updateSliderVisuals() {
        const lightX = SLIDER_X_MIN + state.light * SLIDER_WIDTH;
        const co2X = SLIDER_X_MIN + state.co2 * SLIDER_WIDTH;
        const tempX = SLIDER_X_MIN + (state.temp / 50) * SLIDER_WIDTH;
        const waterX = SLIDER_X_MIN + state.water * SLIDER_WIDTH;

        if (lightHandle) lightHandle.setAttribute("transform", `translate(${lightX - 1543.03}, 0)`);
        if (co2Handle) co2Handle.setAttribute("transform", `translate(${co2X - 1543.03}, 0)`);
        if (tempHandle) tempHandle.setAttribute("transform", `translate(${tempX - 1593.03}, 0)`);
        if (waterHandle) waterHandle.setAttribute("transform", `translate(${waterX - 1543.03}, 0)`);

        if (lightValueText) {
            if (state.light < 0.3) lightValueText.textContent = "Low";
            else if (state.light > 0.7) lightValueText.textContent = "Excessive";
            else lightValueText.textContent = "Optimal";
        }

        if (co2ValueText) co2ValueText.textContent = (state.co2 * 0.1).toFixed(2) + "%";
        if (tempValueText) tempValueText.textContent = Math.round(state.temp);

        if (waterValueText) {
            if (state.water < 0.1) waterValueText.textContent = "No";
            else if (state.water > 0.8) waterValueText.textContent = "Excess";
            else waterValueText.textContent = "Moderate";
        }
    }

    function updateSimulation() {
        // Factors (0 to 1)
        let lFactor = state.light <= 0.7 ? state.light / 0.7 : 1.0 - (state.light - 0.7) * 2; // Peak at 0.7
        let cFactor = state.co2 <= 0.5 ? state.co2 / 0.5 : 1.0 - (state.co2 - 0.5) * 1.5; // Peak at 0.05%
        let tFactor = state.temp <= 35 ? state.temp / 35 : 1.0 - (state.temp - 35) / 5; // Sharp drop after 35, zero at 40
        if (state.temp > 40) tFactor = 0;
        if (state.temp < 10) tFactor *= (state.temp / 10); // Fade out if cold

        let wFactor = state.water <= 0.6 ? state.water / 0.6 : 1.0 - (state.water - 0.6) * 0.5; // Optimal water 0.6
        if (state.water < 0.1) wFactor = 0;

        if (!state.isDay) {
            state.rate = 0;
        } else {
            state.rate = Math.max(0, lFactor * cFactor * tFactor * wFactor * 100);
            // Cap at 100
            if (state.rate > 100) state.rate = 100;
        }

        updateStomata();
        updateArrows();
        updateFeedbacks();
        updateEnvironment();
    }

    function updateStomata() {
        const isClosed = !state.isDay || state.water < 0.1 || state.temp > 40;
        const isPartial = state.isDay && (state.water < 0.3 || state.temp > 38);

        if (isClosed) {
            if (stomataOpen) stomataOpen.style.display = "none";
            if (stomataClosed) stomataClosed.style.display = "inline";
            if (textOpen) textOpen.style.display = "none";
            if (textClosed) {
                textClosed.style.display = "inline";
                const tspan = textClosed.querySelector("tspan");
                if (tspan) tspan.textContent = "Stomata closed";
            }
        } else if (isPartial) {
            if (stomataOpen) stomataOpen.style.display = "none";
            if (stomataClosed) stomataClosed.style.display = "inline"; // proxy
            if (textOpen) textOpen.style.display = "none";
            if (textClosed) {
                textClosed.style.display = "inline";
                const tspan = textClosed.querySelector("tspan");
                if (tspan) tspan.textContent = "Stomata partially closed";
            }
        } else {
            if (stomataOpen) stomataOpen.style.display = "inline";
            if (stomataClosed) stomataClosed.style.display = "none";
            if (textOpen) textOpen.style.display = "inline";
            if (textClosed) textClosed.style.display = "none";
        }
    }

    function updateArrows() {
        const isProducing = state.rate > 2;

        // Day Elements (Photosynthesis)
        if (arrows.light) arrows.light.style.display = state.isDay ? "inline" : "none";
        if (arrows.co2) arrows.co2.style.display = (state.isDay && state.co2 > 0.1 && !(!state.isDay || state.water < 0.1 || state.temp > 40)) ? "inline" : "none";
        if (arrows.water) arrows.water.style.display = (state.isDay && state.water > 0.1) ? "inline" : "none";
        if (arrows.o2) arrows.o2.style.display = (state.isDay && isProducing) ? "inline" : "none";
        if (arrows.sugar) arrows.sugar.style.display = (state.isDay && isProducing) ? "inline" : "none";

        if (molecules.co2) molecules.co2.style.display = (state.isDay && arrows.co2 && arrows.co2.style.display !== "none") ? "inline" : "none";
        if (molecules.o2) molecules.o2.style.display = (state.isDay && arrows.o2 && arrows.o2.style.display !== "none") ? "inline" : "none";

        if (labels.light) labels.light.style.display = state.isDay ? "inline" : "none";
        if (labels.co2Photo) labels.co2Photo.style.display = state.isDay ? "inline" : "none";
        if (labels.o2Photo) labels.o2Photo.style.display = state.isDay ? "inline" : "none";
        if (labels.sugar) labels.sugar.style.display = state.isDay ? "inline" : "none";
        if (labels.water) labels.water.style.display = (state.isDay && state.water > 0.1) ? "inline" : "none";
        
        // Watering Can & Puddles
        if (waterPot) waterPot.style.display = state.water > 0.5 ? "inline" : "none";
        if (waterPour) waterPour.style.display = state.water > 0.6 ? "inline" : "none";
        if (waterOnGround) waterOnGround.style.display = state.water > 0.7 ? "inline" : "none";

        // Night Elements (Respiration)
        if (arrows.respiration) arrows.respiration.style.display = state.isDay ? "none" : "inline";
        if (labels.respirationGroup) labels.respirationGroup.style.display = state.isDay ? "none" : "inline";
        if (labels.stomataPartiallyClosed) labels.stomataPartiallyClosed.style.display = state.isDay ? "none" : "inline";
        if (labels.respirationLabel1) labels.respirationLabel1.style.display = state.isDay ? "none" : "inline";
        if (labels.respirationLabel2) labels.respirationLabel2.style.display = state.isDay ? "none" : "inline";

        if (molecules.respirationCo2) molecules.respirationCo2.style.display = state.isDay ? "none" : "inline";
        if (molecules.respirationO2) molecules.respirationO2.style.display = state.isDay ? "none" : "inline";
    }

    function updateFeedbacks() {
        Object.values(feedbacks).forEach(f => { if (f) f.style.display = "none"; });
        if (nightOverlay) nightOverlay.style.display = state.isDay ? "none" : "inline";

        if (!state.isDay) return;

        if (state.temp > 40) feedbacks.systemError.style.display = "inline";
        else if (state.water < 0.1) feedbacks.criticalFailure.style.display = "inline";
        else if (state.co2 < 0.3) feedbacks.starvation.style.display = "inline";
        else if (state.light < 0.2) feedbacks.rateLimited.style.display = "inline";
        else if (state.temp < 15) feedbacks.systemFrozen.style.display = "inline";
        else if (state.light > 0.7) feedbacks.photoOxidation.style.display = "inline";
        else if (state.co2 > 0.5) feedbacks.co2Overload.style.display = "inline"; // 0.05% is the threshold
        else if (state.temp < 30) feedbacks.slowLane.style.display = "inline";
        else if (state.light > 0.5 && state.co2 < 0.4) feedbacks.stabilised.style.display = "inline";
        else if (state.rate > 85) feedbacks.perfectScore.style.display = "inline";
        else feedbacks.goodRate.style.display = "inline";
    }

    function updateEnvironment() {
        if (skyDay) skyDay.style.opacity = state.isDay ? 1 : 0.2;
        if (sun) sun.style.display = state.isDay ? "inline" : "none";
        if (sunRays) sunRays.style.display = state.isDay && state.light > 0.5 ? "inline" : "none";

        if (nightBg) nightBg.style.display = state.isDay ? "none" : "inline";
        if (moonStars) moonStars.style.display = state.isDay ? "none" : "inline";

        if (skyTemp) {
            skyTemp.style.display = state.temp > 40 ? "inline" : "none";
            skyTemp.style.opacity = Math.min(1, (state.temp - 40) / 10);
        }
    }

    function setupEventListeners() {
        setupSlider(lightHandle, "light", 0, 1);
        setupSlider(co2Handle, "co2", 0, 1);
        setupSlider(tempHandle, "temp", 0, 50, true);
        setupSlider(waterHandle, "water", 0, 1);

        if (dayNightToggle) {
            dayNightToggle.style.cursor = "pointer";
            dayNightToggle.addEventListener("click", () => {
                state.isDay = !state.isDay;
                const knob = document.getElementById("Group_857");
                if (knob) {
                    // Move along the black line (initial position is at 0)
                    // Line is from 1506 to 1590, width is 84
                    knob.setAttribute("transform", state.isDay ? "translate(0, 0)" : "translate(84, 0)");
                }
                updateSimulation();
            });
        }

        if (insightsBtn) {
            insightsBtn.style.cursor = "pointer";
            insightsBtn.addEventListener("click", () => {
                if (insightsPopup) insightsPopup.style.display = "inline";
                const globalOverlay = document.getElementById("global-overlay");
                if (globalOverlay) globalOverlay.style.display = "block";
            });
        }

        if (closeInsightsBtn) {
            closeInsightsBtn.style.cursor = "pointer";
            closeInsightsBtn.addEventListener("click", () => {
                if (insightsPopup) insightsPopup.style.display = "none";
                const globalOverlay = document.getElementById("global-overlay");
                if (globalOverlay) globalOverlay.style.display = "none";
            });
        }
    }

    function animateGraph() {
        const xStart = 1226.93;
        const xEnd = 1866.25;
        const yZero = 910;
        const yMax = 732;
        const yRange = yZero - yMax;

        setInterval(() => {
            graphPoints.push(state.rate);
            if (graphPoints.length > MAX_POINTS) graphPoints.shift();

            const step = (xEnd - xStart) / MAX_POINTS;
            let d = "";

            for (let i = 0; i < graphPoints.length; i++) {
                const x = xStart + i * step;
                const y = yZero - (graphPoints[i] / 100) * yRange;
                if (i === 0) d += `M ${x} ${y}`;
                else d += ` L ${x} ${y}`;
            }

            if (graphPath) graphPath.setAttribute("d", d || `M ${xStart} ${yZero} L ${xEnd} ${yZero}`);
        }, 100);
    }

    init();
});
