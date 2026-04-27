const state = {
    dayNight: 0,
    light: 0.5,
    co2: 0.5,
    temp: 0.5,
    water: 0.5
};

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
    playTreeLottie();
});

function getMousePos(e, svg) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX || (e.touches && e.touches[0].clientX);
    pt.y = e.clientY || (e.touches && e.touches[0].clientY);
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function playTreeLottie() {
    const container = document.getElementById('plant-lottie');

    if (!container) {
        console.warn(`Container tree-lottie not found`);
        return;
    }

    const animationPath = `./assets/JSON/plant.json`;

    // Clear previous animation
    container.innerHTML = '';
    container.style.display = 'block';

    const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animationPath,
        rendererSettings: {
            hideOnTransparent: false,
            preserveAspectRatio: 'xMidYMid meet'
        }
    });

    // Ensure totalFrames is available
    anim.addEventListener('DOMLoaded', () => {
        anim.addEventListener('complete', () => {
            anim.goToAndStop(anim.totalFrames - 1, true);
        });
    });
}

function resetLotties() {
    // Ensure wordObj exists before trying to extract the image
    if (!wordObj || !wordObj.image) return;

    // 1. Extract the name (e.g., "mountain")
    const objectName = wordObj.image.match(/\/([^/]+)\./)[1];

    const slot = document.getElementById(`${objectName}Word`);
    const wordDiv = document.getElementById(`${objectName}Main`);
    if (slot || wordDiv) {
        slot.textContent = "";
        slot.style.display = "none";
        wordDiv.style.display = "none";
    }

    // 2. Loop through and clear the specific IDs for that object
    // Changed i to start at 0 and go to 5 (adjust if you have more leaves)
    for (let i = 0; i <= 4; i++) {
        const leafId = `${objectName}-${i}`;
        const objectContainer = document.getElementById(leafId);
        if (objectContainer) {
            objectContainer.innerHTML = '';
        }
    }
}

function initSlider(config) {
    const { handlerId, trackId, stateKey, minX, maxX, originalX, onUpdate } = config;
    const handler = document.getElementById(handlerId);
    const track = document.getElementById(trackId);
    const svg = handler.ownerSVGElement;

    if (!handler || !track) return;

    let isDragging = false;

    const setPosition = (x) => {
        if (x < minX) x = minX;
        if (x > maxX) x = maxX;

        const dx = x - originalX;
        handler.setAttribute('transform', `translate(${dx}, 0)`);

        const val = (x - minX) / (maxX - minX);
        state[stateKey] = val;
        if (onUpdate) onUpdate(val);
    };

    // Initialize position
    const initialX = minX + (state[stateKey] * (maxX - minX));
    setPosition(initialX);

    const onStart = (e) => {
        isDragging = true;
        if (e.type === 'touchstart') e.preventDefault();
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const pos = getMousePos(e, svg);
        setPosition(pos.x);
    };

    const onEnd = () => {
        isDragging = false;
    };

    handler.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    handler.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    track.addEventListener('click', (e) => {
        const pos = getMousePos(e, svg);
        setPosition(pos.x);
    });
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
        onUpdate: (val) => {
            if (val > 0.5) {
                nightBg.style.display = 'block';
                nightContent.style.display = 'block';
            } else {
                nightBg.style.display = 'none';
                nightContent.style.display = 'none';
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
        onUpdate: (val) => {
            const label = document.getElementById("water-label");
            if (val < 0.33) label.textContent = "No";
            else if (val < 0.66) label.textContent = "Moderate";
            else label.textContent = "Excess";
        }
    });
}


