const MAX_VALUE = 10;

function setupCounter({
    upperBtn,
    lowerBtn,
    valueBtn,
    containerId,
    leftElectron,
    rightElectron,
    activeImgSrc,
    defaultImgSrc
}) {
    let value = 0;
    const positions = [];

    const OFFSET_STEP = 22; // overlap amount

    const OFFSET_PATTERN = [
        { x: 0, y: 0 },   // 0 center
        { x: 1, y: -1 },   // 1 right-top
        { x: -1, y: 1 },   // 2 left-bottom
        { x: -1, y: -1 },  // 3 left-top
        { x: 1, y: 1 },  // 4 right-bottom
        { x: 2, y: 0 },  // 5 right
        { x: -2, y: 0 },  // 6 left
        { x: 0, y: -2 },  // 7 top
        { x: 0, y: 2 },  // 8 bottom
    ];

    const container = document.querySelector(`#${containerId} .centerPoint`);
    leftElectron = document.getElementById('leftElectron');
    rightElectron = document.getElementById('rightElectron');

    const initialLE = parseFloat(leftElectron.getAttribute('x'));
    const initialRE = parseFloat(rightElectron.getAttribute('x'));

    const getMoleculePosition = (index) => {
        const base = OFFSET_PATTERN[index % OFFSET_PATTERN.length];
        const layer = Math.floor(index / OFFSET_PATTERN.length);

        return {
            x: base.x * OFFSET_STEP * (layer + 1),
            y: base.y * OFFSET_STEP * (layer + 1),
            z: index
        };
    };


    const renderImages = () => {
        container.innerHTML = '';

        if (value === 0) {
            leftElectron.style.display = 'none';
            rightElectron.style.display = 'none';

            const img = document.createElement('img');
            img.src = defaultImgSrc;
            img.id = "redDot";
            container.appendChild(img);
        } else {
            leftElectron.style.display = 'block';
            rightElectron.style.display = 'block';

            for (let i = 0; i < value; i++) {

                if (!positions[i]) {
                    positions[i] = getMoleculePosition(i);
                }


                const img = document.createElement('img');
                img.src = activeImgSrc;
                img.className = "dynamic-img";

                const pos = positions[i];
                img.style.position = i === 0 ? "relative" : "absolute";
                img.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                img.style.zIndex = pos.z;

                container.appendChild(img);
            }
        }
    };

    const updateUI = () => {
        valueBtn.textContent = `+${value}.0`;

        leftElectron.setAttribute('x', initialLE + value * 70);
        rightElectron.setAttribute('x', initialRE - value * 70);

        if (value > 0) {
            const speed = 4 - ((value - 1) * 0.3);
            document.documentElement.style.setProperty('--electron-speed', `${speed}s`);

            leftElectron.parentElement.classList.add("rotating-electron");
            rightElectron.parentElement.classList.add("rotating-electron");
        } else {
            leftElectron.parentElement.classList.remove("rotating-electron");
            rightElectron.parentElement.classList.remove("rotating-electron");
        }

        lowerBtn.style.opacity = value > 0 ? "1" : "0.3";
        lowerBtn.style.pointerEvents = value > 0 ? "auto" : "none";
        upperBtn.style.opacity = value < MAX_VALUE ? "1" : "0.3";
        upperBtn.style.pointerEvents = value < MAX_VALUE ? "auto" : "none";

        renderImages();
    };

    upperBtn.addEventListener("click", () => {
        if (value < MAX_VALUE) {
            value++;
            updateUI();
        }
    });

    lowerBtn.addEventListener("click", () => {
        if (value > 0) {
            value--;
            updateUI();
        }
    });

    /* 🔴 RESET FUNCTION */
    const reset = () => {
        value = 0;
        positions.length = 0;

        leftElectron.setAttribute('x', initialLE);
        rightElectron.setAttribute('x', initialRE);

        updateUI();
    };

    updateUI();

    /* 👇 expose reset */
    return { reset };
}


document.addEventListener("DOMContentLoaded", () => {
    const protonCounter = setupCounter({
        upperBtn: document.getElementById("protonUpperBtn"),
        lowerBtn: document.getElementById("protonLowerBtn"),
        valueBtn: document.getElementById("protonValues"),
        containerId: "centerPoint",
        leftElectron: "leftElectron",
        rightElectron: "rightElectron",
        activeImgSrc: "./assets/proton-molecule.svg",
        defaultImgSrc: "./assets/center-point.svg"
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
        protonCounter.reset();
    });
});
