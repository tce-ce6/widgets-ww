const state = {
    dayNight: 0,
    light: 0.5,
    co2: 0.5,
    temp: 0.5,
    water: 0.5
};

const lottiePlayers = {};
const sliderRegistry = {};
let animationSequenceToken = 0;
let animationsReady = false;

const stomataOpen = document.getElementById('stomata-open');
const stomataClosed = document.getElementById('stomata-closed');
const stomataPartiallyClosed = document.getElementById('stomata-partially-closed');

document.addEventListener('DOMContentLoaded', function () {
    const insightBtn = document.getElementById('insight-btn');
    const insights = document.getElementById("insights");
    const insightClose = document.getElementById("insight-close");


    if (insightBtn && insights && insightClose) {
        insightBtn.addEventListener('click', () => {
            insights.style.display = 'block';
        });

        insightClose.addEventListener('click', () => {
            insights.style.display = 'none';
        });
    }

    initDayToNightSlider();
    initFactorSliders();
    initialiseAnimationState();
});

function getMousePos(e, svg) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX || (e.touches && e.touches[0].clientX);
    pt.y = e.clientY || (e.touches && e.touches[0].clientY);
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function playTreeLottie() {
    return createOrGetLottie('plant-lottie', './assets/JSON/plant.json', { loop: false });
}

function getLightBand() {
    if (state.light < 0.33) return 'low';
    if (state.light < 0.66) return 'optimal';
    return 'excessive';
}

function updatePlantByLight() {
    const plantPlayer = lottiePlayers['plant-lottie'] ?? playTreeLottie();
    if (!plantPlayer) return;

    const apply = () => {
        const band = getLightBand();

        setContainerVisible('plant-lottie', true);

        // Remove any previous handlers we attached.
        if (plantPlayer.__segmentLoopHandler) {
            plantPlayer.removeEventListener('complete', plantPlayer.__segmentLoopHandler);
            plantPlayer.__segmentLoopHandler = null;
        }
        if (plantPlayer.__segmentStopHandler) {
            plantPlayer.removeEventListener('complete', plantPlayer.__segmentStopHandler);
            plantPlayer.__segmentStopHandler = null;
        }

        plantPlayer.stop();

        // 0-based frames for this asset:
        // - low: play 0..100 then stop
        // - optimal: loop 0..200
        // - excessive: play 0..200 then stop
        const startFrame = 0;
        const endFrame = band === 'low' ? 100 : 200;

        if (band === 'optimal') {
            plantPlayer.loop = false;
            plantPlayer.goToAndStop(0, true);
            return;
        }

        plantPlayer.loop = false;
        plantPlayer.setSegment(startFrame, endFrame);
        const stopAtEnd = () => {
            plantPlayer.goToAndStop(endFrame, true);
        };
        plantPlayer.__segmentStopHandler = stopAtEnd;
        plantPlayer.addEventListener('complete', stopAtEnd);
        plantPlayer.goToAndPlay(startFrame, true);
    };

    // If JSON isn't ready yet, apply after load.
    if (!plantPlayer.totalFrames || plantPlayer.totalFrames < 3) {
        const onLoaded = () => {
            plantPlayer.removeEventListener('DOMLoaded', onLoaded);
            apply();
        };
        plantPlayer.addEventListener('DOMLoaded', onLoaded);
        return;
    }

    apply();
}

function initSlider(config) {
    const { handlerId, trackId, stateKey, minX, maxX, originalX, onUpdate, snapValues } = config;
    const handler = document.getElementById(handlerId);
    const track = document.getElementById(trackId);
    const svg = handler.ownerSVGElement;

    if (!handler || !track) return;

    let isDragging = false;

    sliderRegistry[stateKey] = {
        handler,
        track,
        isDisabled: false
    };

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

    const snapVal = (val) => {
        if (!Array.isArray(snapValues) || snapValues.length === 0) return val;
        let best = snapValues[0];
        let bestDist = Math.abs(val - best);
        for (let i = 1; i < snapValues.length; i++) {
            const d = Math.abs(val - snapValues[i]);
            if (d < bestDist) {
                best = snapValues[i];
                bestDist = d;
            }
        }
        return clamp(best, 0, 1);
    };

    const setPosition = (x, { commit } = { commit: false }) => {
        if (sliderRegistry[stateKey]?.isDisabled) return;

        if (x < minX) x = minX;
        if (x > maxX) x = maxX;

        const dx = x - originalX;
        handler.setAttribute('transform', `translate(${dx}, 0)`);

        if (commit) {
            const val = (x - minX) / (maxX - minX);
            state[stateKey] = val;
            if (onUpdate) onUpdate(val);
            if (animationsReady) {
                evaluateAnimationConditions();
            }
        }
    };

    const snapToNearest = () => {
        if (sliderRegistry[stateKey]?.isDisabled) return;
        if (!Array.isArray(snapValues) || snapValues.length === 0) return;

        // Compute from current handle position (not from last committed value)
        const transform = handler.getAttribute('transform') || '';
        const match = transform.match(/translate\(([-\d.]+),\s*0\)/);
        const dx = match ? parseFloat(match[1]) : 0;
        const currentX = originalX + dx;
        const currentVal = clamp((currentX - minX) / (maxX - minX), 0, 1);

        const snapped = snapVal(currentVal);
        const snappedX = minX + snapped * (maxX - minX);
        setPosition(snappedX, { commit: true });
    };

    // Initialize position
    const initialX = minX + (state[stateKey] * (maxX - minX));
    setPosition(initialX, { commit: true });

    const onStart = (e) => {
        isDragging = true;
        if (e.type === 'touchstart') e.preventDefault();
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const pos = getMousePos(e, svg);
        // move handle only; do not commit mid-drag
        setPosition(pos.x, { commit: false });
    };

    const onEnd = () => {
        isDragging = false;
        snapToNearest();
    };

    handler.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    handler.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    track.addEventListener('click', (e) => {
        const pos = getMousePos(e, svg);
        // move then snap+commit
        setPosition(pos.x, { commit: false });
        snapToNearest();
    });
}

function setSliderDisabled(stateKey, isDisabled) {
    const slider = sliderRegistry[stateKey];
    if (!slider) return;

    slider.isDisabled = isDisabled;
    slider.handler.style.pointerEvents = isDisabled ? 'none' : 'auto';
    slider.track.style.pointerEvents = isDisabled ? 'none' : 'auto';
    slider.handler.style.opacity = isDisabled ? '0.55' : '1';
    slider.track.style.opacity = isDisabled ? '0.55' : '1';
    slider.handler.style.cursor = isDisabled ? 'default' : 'pointer';
    slider.track.style.cursor = isDisabled ? 'default' : 'pointer';
}

function createOrGetLottie(containerId, animationPath, options = {}) {
    if (lottiePlayers[containerId]) {
        return lottiePlayers[containerId];
    }

    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found`);
        return null;
    }

    container.innerHTML = '';

    const player = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: animationPath,
        rendererSettings: {
            hideOnTransparent: false,
            preserveAspectRatio: 'xMidYMid meet'
        }
    });

    lottiePlayers[containerId] = player;
    return player;
}

function setContainerVisible(containerId, isVisible) {
    const container = document.getElementById(containerId);
    if (!container || !container.parentElement) return;

    container.parentElement.style.display = isVisible ? 'block' : 'none';
    container.style.display = isVisible ? 'block' : 'none';
}

function stopAndResetLottie(containerId, isVisible) {
    const player = lottiePlayers[containerId];
    if (player) {
        player.stop();
        player.goToAndStop(0, true);
    }
    setContainerVisible(containerId, isVisible);
}

function waitForAnimationToComplete(player, token) {
    return new Promise((resolve) => {
        if (!player) {
            resolve();
            return;
        }

        const onComplete = () => {
            player.removeEventListener('complete', onComplete);
            if (token !== animationSequenceToken) {
                resolve();
                return;
            }

            player.goToAndStop(player.totalFrames - 1, true);
            resolve();
        };

        player.addEventListener('complete', onComplete);
        player.goToAndPlay(0, true);
    });
}

function isDaytime() {
    return state.dayNight <= 0.5;
}

function isOptimalLight() {
    return state.light >= 0.33 && state.light < 0.66;
}

function isModerateWater() {
    return state.water >= 0.33 && state.water < 0.66;
}

function isHighTemperature() {
    return state.temp >= 0.75;
}

function isExcessiveLight() {
    return state.light >= 0.66;
}

function updateDaySpecificVisuals() {
    const skyTemperature = document.getElementById('sky-tempreture');
    if (!skyTemperature) return;

    const shouldShowSkyTemperature = isDaytime() && (isExcessiveLight() || isHighTemperature());
    skyTemperature.style.display = shouldShowSkyTemperature ? 'block' : 'none';
}

function updateFactoryControls() {
    const disableFactorySliders = !isDaytime();

    setSliderDisabled('light', disableFactorySliders);
    setSliderDisabled('co2', disableFactorySliders);
    setSliderDisabled('temp', disableFactorySliders);
    setSliderDisabled('water', disableFactorySliders);
}

function resetAnimationState() {
    animationSequenceToken += 1;

    stopAndResetLottie('plant-lottie', true);
    stopAndResetLottie('sun-rays-lottie', false);
    stopAndResetLottie('day-photosynthesis-lottie', false);
    stopAndResetLottie('night-photosynthesis-lottie', false);
    stopAndResetLottie('watering-lottie', false);
    stopAndResetLottie('day-stomata-lottie', false);
    stopAndResetLottie('night-stomata-lottie', false);
}

function initialiseAnimationState() {
    playTreeLottie();
    createOrGetLottie('sun-rays-lottie', './assets/JSON/light.json');
    createOrGetLottie('day-photosynthesis-lottie', './assets/JSON/day-photosynthesis.json');
    createOrGetLottie('night-photosynthesis-lottie', './assets/JSON/night-photosynthesis.json');
    createOrGetLottie('watering-lottie', './assets/JSON/water-moderate.json');
    createOrGetLottie('day-stomata-lottie', './assets/JSON/day-stomata-photosynthesis.json');
    createOrGetLottie('night-stomata-lottie', './assets/JSON/night-stomata-photosynthesis.json');

    resetAnimationState();
    updateFactoryControls();
    updateDaySpecificVisuals();
    updatePlantByLight();
    animationsReady = true;
}

async function runNightAnimationSequence(token) {
    const nightPhotosynthesisPlayer = createOrGetLottie('night-photosynthesis-lottie', './assets/JSON/night-photosynthesis.json', { loop: true });
    const nightStomataPlayer = createOrGetLottie('night-stomata-lottie', './assets/JSON/night-stomata-photosynthesis.json', { loop: true });

    setContainerVisible('night-photosynthesis-lottie', true);
    setContainerVisible('night-stomata-lottie', true);
    await Promise.all([
        waitForAnimationToComplete(nightPhotosynthesisPlayer, token),
        waitForAnimationToComplete(nightStomataPlayer, token)
    ]);
}

async function runCurrentAnimationSequence(token) {
    if (!isDaytime()) {
        await runNightAnimationSequence(token);
        return;
    }

    if (!isOptimalLight()) return;

    const promises = [];

    const lightPlayer = createOrGetLottie('sun-rays-lottie', './assets/JSON/light.json');
    setContainerVisible('sun-rays-lottie', true);
    promises.push(waitForAnimationToComplete(lightPlayer, token));

    if (isModerateWater()) {
        const waterPlayer = createOrGetLottie('watering-lottie', './assets/JSON/water-moderate.json');
        setContainerVisible('watering-lottie', true);
        promises.push(waitForAnimationToComplete(waterPlayer, token));

        const dayPlayer = createOrGetLottie('day-photosynthesis-lottie', './assets/JSON/day-photosynthesis.json');
        const dayStomataPlayer = createOrGetLottie('day-stomata-lottie', './assets/JSON/day-stomata-photosynthesis.json');

        setContainerVisible('day-photosynthesis-lottie', true);
        setContainerVisible('day-stomata-lottie', true);

        promises.push(waitForAnimationToComplete(dayPlayer, token));
        promises.push(waitForAnimationToComplete(dayStomataPlayer, token));
    }

    await Promise.all(promises);
}

function evaluateAnimationConditions() {
    updateFactoryControls();
    updateDaySpecificVisuals();
    resetAnimationState();
    updatePlantByLight();
    const token = animationSequenceToken;
    runCurrentAnimationSequence(token);
}

function initDayToNightSlider() {
    const nightBg = document.getElementById("night-bg");
    const nightContent = document.getElementById("night");

    initSlider({
        handlerId: "day-to-night-handler",
        trackId: "day-to-night-track",
        stateKey: "dayNight",
        minX: 1444 + 21,
        maxX: 1444 + 120 - 21,
        originalX: 1460,
        snapValues: [0, 1],
        onUpdate: (val) => {
            if (val > 0.5) {
                nightBg.style.display = 'block';
                nightContent.style.display = 'block';
                stomataClosed.style.display = 'none';
                stomataOpen.style.display = 'none';
                stomataPartiallyClosed.style.display = 'block';
            } else {
                nightBg.style.display = 'none';
                nightContent.style.display = 'none';
                stomataClosed.style.display = 'none';
                stomataOpen.style.display = 'block';
                stomataPartiallyClosed.style.display = 'none';
            }
        }
    });
}

function initFactorSliders() {
    // Light Slider
    initSlider({
        handlerId: "light-handler",
        trackId: "light-slider", // Note: trackId should ideally be the specific path but container group also works if it covers the area
        stateKey: "light",
        minX: 1390.5,
        maxX: 1694.5,
        originalX: 1543.03,
        snapValues: [0, 0.5, 1],
        onUpdate: (val) => {
            const label = document.getElementById("light-label");
            if (val < 0.33) label.textContent = "Low";
            else if (val < 0.66) label.textContent = "Optimal";
            else label.textContent = "Excessive";
        }
    });

    // CO2 Slider
    initSlider({
        handlerId: "co2-handler",
        trackId: "co2-slider",
        stateKey: "co2",
        minX: 1390.5,
        maxX: 1694.5,
        originalX: 1543.03,
        snapValues: [0, 0.5, 1],
        onUpdate: (val) => {
            const label = document.getElementById("co2-label");
            if (val < 0.33) label.textContent = "0";
            else if (val < 0.66) label.textContent = "0.05%";
            else label.textContent = "0.10%";
        }
    });

    // Temp Slider
    initSlider({
        handlerId: "temp-handler",
        trackId: "temp-slider",
        stateKey: "temp",
        minX: 1390.5,
        maxX: 1694.5,
        originalX: 1593.03,
        snapValues: [0, 0.33, 0.66, 1],
        onUpdate: (val) => {
            const label = document.getElementById("temp-label");
            if (val < 0.25) label.textContent = "0";
            else if (val < 0.5) label.textContent = "25";
            else if (val < 0.75) label.textContent = "35";
            else label.textContent = "50";
        }
    });

    // Water Slider
    initSlider({
        handlerId: "water-handler",
        trackId: "water-slider",
        stateKey: "water",
        minX: 1390.5,
        maxX: 1694.5,
        originalX: 1543.03,
        snapValues: [0, 0.5, 1],
        onUpdate: (val) => {
            const label = document.getElementById("water-label");
            if (val < 0.33) label.textContent = "No";
            else if (val < 0.66) label.textContent = "Moderate";
            else label.textContent = "Excess";
        }
    });
}


