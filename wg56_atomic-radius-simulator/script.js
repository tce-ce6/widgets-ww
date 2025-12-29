const upArrow = document.getElementById('upArrow');
const downArrow = document.getElementById('downArrow');
const angleValue = document.getElementById('angleValue');
const torch = document.getElementById('torch');
const yellowLine = document.getElementById('yelloLineDiv');
const resetBtn = document.getElementById('reset-btn');

// Initial Defaults
const INITIAL_ANGLE = 69.6;
let angle = INITIAL_ANGLE;
let currentN2 = null; // No medium selected initially
const n1 = 1.0; 

const mediaData = {
    'water-btn': { n: 1.33, img: document.getElementById('water-img') },
    'glass-btn': { n: 1.50, img: document.getElementById('glass-img') },
    'dimond-btn': { n: 2.40, img: document.getElementById('dimond-img') }
};

function updateSimulation() {
    angleValue.textContent = angle.toFixed(1) + "°";
    
    // Rotate Torch
    torch.setAttribute("transform", `rotate(${angle} 560 420)`);

    // Only calculate and show yellow line if a medium is selected
    if (currentN2 && yellowLine) {
        yellowLine.style.display = "block";
        const theta1Rad = angle * (Math.PI / 180);
        const sinTheta2 = (n1 * Math.sin(theta1Rad)) / currentN2;
        const theta2Deg = Math.asin(sinTheta2) * (180 / Math.PI);
        
        yellowLine.style.transformOrigin = "top center"; 
        yellowLine.style.transform = `rotate(${180 - theta2Deg}deg)`;
    } else if (yellowLine) {
        // Hide yellow line if no medium is active
        yellowLine.style.display = "none";
    }
}

function resetSimulation() {
    // 1. Reset variables
    console.log("Hi")
    angle = INITIAL_ANGLE;
    currentN2 = null;

    // 2. Reset Buttons: All active, full opacity
    Object.keys(mediaData).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.style.pointerEvents = "auto";
            btn.style.opacity = "1";
        }

        // 3. Hide all images
        if (mediaData[id].img) {
            mediaData[id].img.style.display = 'none';
        }
    });

    // 4. Update visuals (will hide yellow line)
    updateSimulation();
}

// Arrow Listeners
upArrow.addEventListener('click', () => { angle += 1; updateSimulation(); });
downArrow.addEventListener('click', () => { angle -= 1; updateSimulation(); });

// Reset Listener
resetBtn.addEventListener('click', resetSimulation);

document.addEventListener("DOMContentLoaded", () => {
    Object.keys(mediaData).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.style.cursor = "pointer";
            btn.addEventListener('click', () => {
                currentN2 = mediaData[id].n;

                Object.keys(mediaData).forEach(otherId => {
                    const targetBtn = document.getElementById(otherId);
                    const isCurrent = (otherId === id);
                    
                    // Disable only the clicked button
                    targetBtn.style.pointerEvents = isCurrent ? "none" : "auto";
                    targetBtn.style.opacity = isCurrent ? "0.5" : "1";

                    if (mediaData[otherId].img) {
                        mediaData[otherId].img.style.display = isCurrent ? 'block' : 'none';
                    }
                });
                updateSimulation();
            });
        }
    });

    // Start in the clean reset state
    resetSimulation();
});