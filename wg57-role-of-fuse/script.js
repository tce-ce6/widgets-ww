document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------
    // 1. DOM ELEMENTS
    // -----------------------------
    const containers = {
        pop: document.getElementById('pop-fuse-container'),
        flowFast: document.getElementById('current-flow-fast-container'),
        flowNormal: document.getElementById('current-flow-normal-container'),
        flowCut: document.getElementById('current-flow-fuse-cut-container'),
        fireTV: document.getElementById('fire-tv-container'),
        fireMicro: document.getElementById('fire-microwave-container'),
        fireFridge: document.getElementById('fire-refrigerator-container')
    };

    const appliancesNormal = document.getElementById('appliances-normal');
    const appliancesOnFire = document.getElementById('appliances-on-fire');
    const fuseNormalGroup = document.getElementById('fuse-normal');
    const shortCircuitBtn = document.getElementById('short-circuit-btn');
    const resetBtn = document.getElementById('reset-btn');
    const fuseSliderHandle = document.getElementById('fuse-slider-handle');

    const FUSE_OFF_X = 787;
    const FUSE_ON_X = 956;

    let state = {
        fuseOn: false,
        shortCircuitActive: false,
        fireTimeout: null,
        fuseCutTimeout: null // New timer for the 3-second delay
    };

    // -----------------------------
    // 2. LOTTIE INITIALIZATION
    // -----------------------------
    const anims = {};

    function initAnimation(key, container, path, loopValue) {
        if (!container) return;
        container.style.display = "none";
        
        anims[key] = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: loopValue,
            autoplay: false, 
            path: path
        });
    }

    initAnimation('pop', containers.pop, 'assets/animation/pop_up.json', false);
    initAnimation('flowNormal', containers.flowNormal, 'assets/animation/current_flow_normal.json', true);
    initAnimation('flowFast', containers.flowFast, 'assets/animation/current_flow_fast.json', true);
    initAnimation('flowCut', containers.flowCut, 'assets/animation/current_flow_fuse_cut.json', true);
    initAnimation('fireTV', containers.fireTV, 'assets/animation/Fire.json', true);
    initAnimation('fireMicro', containers.fireMicro, 'assets/animation/Fire.json', true);
    initAnimation('fireFridge', containers.fireFridge, 'assets/animation/Fire.json', true);

    // -----------------------------
    // 3. CORE CONTROL FUNCTIONS
    // -----------------------------

    function resetToDefault() {
        // Clear all logic timers
        state.shortCircuitActive = false;
        state.fuseOn = false;
        if (state.fireTimeout) clearTimeout(state.fireTimeout);
        if (state.fuseCutTimeout) clearTimeout(state.fuseCutTimeout);

        // UI Reset
        fuseNormalGroup.style.display = "none";
        appliancesNormal.style.display = "block";
        appliancesOnFire.style.display = "none";
        fuseSliderHandle.setAttribute("x", FUSE_OFF_X);

        // Hide ALL animation containers
        Object.values(containers).forEach(el => { if(el) el.style.display = "none"; });
        
        // Stop ALL animations
        Object.values(anims).forEach(a => {
            a.stop();
            a.goToAndStop(0, true);
        });

        // Default start
        containers.flowNormal.style.display = "block";
        anims.flowNormal.play();
    }

    function handleShortCircuit() {
        if (state.shortCircuitActive) return;
        state.shortCircuitActive = true;

        anims.flowNormal.stop();
        containers.flowNormal.style.display = "none";

        if (!state.fuseOn) {
            // SCENARIO 1: FIRE (1 second delay)
            containers.flowFast.style.display = "block";
            anims.flowFast.play();

            state.fireTimeout = setTimeout(() => {
                appliancesNormal.style.display = "none";
                appliancesOnFire.style.display = "block";
                
                containers.fireTV.style.display = "block";
                containers.fireMicro.style.display = "block";
                containers.fireFridge.style.display = "block";
                
                anims.fireTV.play();
                anims.fireMicro.play();
                anims.fireFridge.play();
            }, 1000);

        } else {
            // SCENARIO 2: FUSE CUT (3 second delay)
            containers.flowFast.style.display = "block";
            anims.flowFast.play();

            containers.pop.style.display = "block";
            anims.pop.play();

            // Handle the transition exactly 3 seconds after the pop animation starts
            state.fuseCutTimeout = setTimeout(() => {
                // Stop Fast Flow
                anims.flowFast.stop();
                containers.flowFast.style.display = "none";

                // Play Fuse Cut Flow
                containers.flowCut.style.display = "block";
                anims.flowCut.play();

                // Stop the pop animation if it hasn't finished, and hold at end
                anims.pop.pause();
                anims.pop.goToAndStop(anims.pop.totalFrames - 1, true);
            }, 3000);
        }
    }

    // -----------------------------
    // 4. EVENT LISTENERS
    // -----------------------------

    fuseSliderHandle.addEventListener("click", () => {
        if (state.shortCircuitActive) return;
        state.fuseOn = !state.fuseOn;
        fuseNormalGroup.style.display = state.fuseOn ? "block" : "none";
        fuseSliderHandle.style.transition = "x 0.4s ease-in-out";
        fuseSliderHandle.setAttribute("x", state.fuseOn ? FUSE_ON_X : FUSE_OFF_X);
    });

    shortCircuitBtn.addEventListener("click", handleShortCircuit);
    resetBtn.addEventListener("click", resetToDefault);

    resetToDefault();
});