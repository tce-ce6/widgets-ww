// These will be initialized in DOMContentLoaded
let integerUpArrow, integerDownArrow, decimalUpArrow, decimalDownArrow, angleIntegerValue, angleDecimalValue, torch, yellowLine, resetBtn;

// Function to set angle increment (can be called to change how much angle changes per click)
function setAngleIncrement(value) {
    angleIncrement = Math.max(0.1, Math.min(10, value)); // Clamp between 0.1 and 10
}

// Initial Defaults
const INITIAL_ANGLE = 69;
const INITIAL_DECIMAL = 6;
let angleInteger = INITIAL_ANGLE;
let angleDecimal = INITIAL_DECIMAL;
let angleIncrement = 1; // Default angle change value
let currentN2 = null; // No medium selected initially
const n1 = 1.0;

function getTotalAngle() {
    return angleInteger + angleDecimal / 10;
}

// Center point where light ray hits the interface (from HTML: normal line at x=960.5, interface at y=524.5)
const CENTER_X = 960.5;
const CENTER_Y = 524.5;
const TORCH_RADIUS = 200; // Distance from center point to torch

// Predefined angles for each medium where refraction occurs
const predefinedAngles = {
    'water-btn': [30, 45, 60, 69.6, 75],
    'glass-btn': [30, 45, 60, 69.6, 75],
    'dimond-btn': [20, 30, 45, 60, 69.6]
};

const mediaData = {
    'water-btn': { n: 1.33, img: document.getElementById('water-img'), angles: predefinedAngles['water-btn'] },
    'glass-btn': { n: 1.50, img: document.getElementById('glass-img'), angles: predefinedAngles['glass-btn'] },
    'dimond-btn': { n: 2.40, img: document.getElementById('dimond-img'), angles: predefinedAngles['dimond-btn'] }
};

function drawArc(arcGroupId, labelId, normalAngle, rayAngle, color) {
    const arcRadius = 60;
    const arcGroup = document.getElementById(arcGroupId);
    const arcLabel = document.getElementById(labelId);
    if (!arcGroup || !arcLabel) return;

    let diff = rayAngle - normalAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    let sweepFlag = diff > 0 ? 1 : 0;
    let angleDeg = Math.abs(diff);

    const startX = CENTER_X + arcRadius * Math.cos(normalAngle * Math.PI / 180);
    const startY = CENTER_Y + arcRadius * Math.sin(normalAngle * Math.PI / 180);
    const endX = CENTER_X + arcRadius * Math.cos(rayAngle * Math.PI / 180);
    const endY = CENTER_Y + arcRadius * Math.sin(rayAngle * Math.PI / 180);

    const arcPath = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;

    const pathEl = arcGroup.querySelector('path');
    if (pathEl) {
        pathEl.setAttribute('d', arcPath);
        pathEl.setAttribute('stroke', color);
    }

    let midAngle = normalAngle + diff / 2;
    const labelX = CENTER_X + (arcRadius + 30) * Math.cos(midAngle * Math.PI / 180);
    const labelY = CENTER_Y + (arcRadius + 30) * Math.sin(midAngle * Math.PI / 180);

    // adjust text alignment so it centers correctly on the calculated point
    arcLabel.setAttribute('x', labelX);
    arcLabel.setAttribute('y', labelY + 8);
    arcLabel.setAttribute('text-anchor', 'middle');

    const textEl = arcLabel.querySelector('tspan');
    if (textEl) {
        textEl.textContent = angleDeg.toFixed(1) + "°";
    }

    arcGroup.style.display = "block";
    arcLabel.style.display = "block";
}

function updateSimulation() {
    if (angleIntegerValue) {
        angleIntegerValue.textContent = angleInteger + ".";
    }
    if (angleDecimalValue) {
        angleDecimalValue.textContent = angleDecimal + "°";
    }

    const totalAngle = getTotalAngle();
    let normalizedAngle = totalAngle % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;

    let svgAngle = (270 - normalizedAngle) % 360;
    if (svgAngle < 0) svgAngle += 360;

    const angleRad = svgAngle * (Math.PI / 180);
    const torchX = CENTER_X + TORCH_RADIUS * Math.cos(angleRad);
    const torchY = CENTER_Y + TORCH_RADIUS * Math.sin(angleRad);

    const dx = CENTER_X - torchX;
    const dy = CENTER_Y - torchY;
    const torchRotation = Math.atan2(dy, dx) * (180 / Math.PI);

    torch.setAttribute("x", torchX - 95);
    torch.setAttribute("y", torchY - 42);
    torch.setAttribute("transform", `rotate(${torchRotation - 19} ${torchX} ${torchY})`);

    if (currentN2) {
        const redLineEl = document.getElementById('redIncidentRay');
        if (redLineEl) {
            redLineEl.style.display = "block";
            redLineEl.setAttribute("x1", torchX);
            redLineEl.setAttribute("y1", torchY);
            redLineEl.setAttribute("x2", CENTER_X);
            redLineEl.setAttribute("y2", CENTER_Y);
        }

        const torchInTop = torchY <= CENTER_Y;
        const normalDir = torchInTop ? 90 : 270;
        const incidentNormal = torchInTop ? 270 : 90;

        const n_incident = torchInTop ? 1.0 : currentN2;
        const n_refracted = torchInTop ? currentN2 : 1.0;

        const travelAngle = (svgAngle + 180) % 360;
        let delta_inc = travelAngle - normalDir;
        if (delta_inc > 180) delta_inc -= 360;
        if (delta_inc < -180) delta_inc += 360;

        let incidentAngleDeg = Math.abs(delta_inc);

        drawArc('incidentAngleArc', 'incidentAngleLabel', incidentNormal, svgAngle, '#FF0000');

        const theta1Rad = incidentAngleDeg * (Math.PI / 180);
        const sinTheta2 = (n_incident * Math.sin(theta1Rad)) / n_refracted;

        const yellowLineEl = document.getElementById('yelloLineDiv');
        if (yellowLineEl) {
            yellowLineEl.style.display = "block";
            const lineLength = 350;

            if (sinTheta2 <= 1 && sinTheta2 >= -1) {
                // Refraction
                const theta2Rad = Math.asin(sinTheta2);
                let theta2Deg = theta2Rad * (180 / Math.PI);

                let delta_ref = Math.sign(delta_inc) * theta2Deg;
                if (delta_inc === 0) delta_ref = 0;

                const refractedTravelAngle = normalDir + delta_ref;
                const refractedRad = refractedTravelAngle * (Math.PI / 180);

                const endX = CENTER_X + lineLength * Math.cos(refractedRad);
                const endY = CENTER_Y + lineLength * Math.sin(refractedRad);

                yellowLineEl.setAttribute("x1", CENTER_X);
                yellowLineEl.setAttribute("y1", CENTER_Y);
                yellowLineEl.setAttribute("x2", endX);
                yellowLineEl.setAttribute("y2", endY);

                // Update refracted angle arc
                drawArc('refractedAngleArc', 'refractedAngleLabel', normalDir, refractedTravelAngle, '#FFC506');
            } else {
                // Total internal reflection
                let reflectedTravelAngle = (360 - travelAngle) % 360;
                if (reflectedTravelAngle < 0) reflectedTravelAngle += 360;

                const reflectedRad = reflectedTravelAngle * (Math.PI / 180);
                const endX = CENTER_X + lineLength * Math.cos(reflectedRad);
                const endY = CENTER_Y + lineLength * Math.sin(reflectedRad);

                yellowLineEl.setAttribute("x1", CENTER_X);
                yellowLineEl.setAttribute("y1", CENTER_Y);
                yellowLineEl.setAttribute("x2", endX);
                yellowLineEl.setAttribute("y2", endY);

                // For TIR, we show the reflected arc mapping relative to the incident normal
                drawArc('refractedAngleArc', 'refractedAngleLabel', incidentNormal, reflectedTravelAngle, '#FFC506');
            }
        }
    } else {
        hideRefractedElements();
    }
}

function hideRefractedElements() {
    const yellowLineEl = document.getElementById('yelloLineDiv');
    if (yellowLineEl) yellowLineEl.style.display = "none";
    const refractedArc = document.getElementById('refractedAngleArc');
    if (refractedArc) {
        refractedArc.style.display = "none";
    }
    const refractedAngleLabel = document.getElementById('refractedAngleLabel');
    if (refractedAngleLabel) {
        refractedAngleLabel.style.display = "none";
    }
}

function resetSimulation() {
    // 1. Reset variables
    angleInteger = INITIAL_ANGLE;
    angleDecimal = INITIAL_DECIMAL;
    currentN2 = null;

    // 2. Hide all medium images and reset button states
    Object.keys(mediaData).forEach(id => {
        if (mediaData[id].img) {
            mediaData[id].img.style.display = 'none';
        }
        // Reset button visual states - all buttons full opacity and clickable
        const btn = document.getElementById(id);
        if (btn) {
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
        }
    });

    // 3. Update visuals
    updateSimulation();

    // 4. Hide all ray/arc visuals in the full reset state
    const yellowLineEl = document.getElementById('yelloLineDiv');
    if (yellowLineEl) yellowLineEl.style.display = "none";
    const redLineEl = document.getElementById('redIncidentRay');
    if (redLineEl) redLineEl.style.display = "none";
    const incidentArc = document.getElementById('incidentAngleArc');
    if (incidentArc) incidentArc.style.display = "none";
    const incidentLabel = document.getElementById('incidentAngleLabel');
    if (incidentLabel) incidentLabel.style.display = "none";
    hideRefractedElements();
}


document.addEventListener("DOMContentLoaded", () => {
    // Initialize DOM element references
    integerUpArrow = document.getElementById('integerUpArrow');
    integerDownArrow = document.getElementById('integerDownArrow');
    decimalUpArrow = document.getElementById('decimalUpArrow');
    decimalDownArrow = document.getElementById('decimalDownArrow');
    angleIntegerValue = document.getElementById('angleIntegerValue');
    angleDecimalValue = document.getElementById('angleDecimalValue');
    torch = document.getElementById('torch');
    yellowLine = document.getElementById('yelloLineDiv');
    resetBtn = document.getElementById('reset-btn');

    const svg = document.querySelector('svg');
    const torchGroup = document.getElementById('Group 56');

    // Bind reset as early as possible (even if other elements are missing)
    if (resetBtn) {
        resetBtn.style.pointerEvents = 'all';
        resetBtn.querySelectorAll?.('*')?.forEach(el => {
            el.style.pointerEvents = 'all';
        });
        resetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetSimulation();
        });
    }

    if (!torchGroup || !torchGroup.parentNode) return;

    // Set up arrow listeners for angle control
    if (integerUpArrow) {
        integerUpArrow.addEventListener('click', () => {
            angleInteger += angleIncrement;
            // Allow full 360 degree rotation
            if (angleInteger >= 360) angleInteger -= 360;
            updateSimulation();
        });
    }

    if (integerDownArrow) {
        integerDownArrow.addEventListener('click', () => {
            angleInteger -= angleIncrement;
            // Allow full 360 degree rotation
            if (angleInteger < 0) angleInteger += 360;
            updateSimulation();
        });
    }

    // Decimal arrow listeners for 0.1° adjustments
    if (decimalUpArrow) {
        decimalUpArrow.addEventListener('click', () => {
            angleDecimal += 1;
            if (angleDecimal >= 10) {
                angleDecimal = 0;
                angleInteger += 1;
                if (angleInteger >= 360) angleInteger -= 360;
            }
            updateSimulation();
        });
    }

    if (decimalDownArrow) {
        decimalDownArrow.addEventListener('click', () => {
            angleDecimal -= 1;
            if (angleDecimal < 0) {
                angleDecimal = 9;
                angleInteger -= 1;
                if (angleInteger < 0) angleInteger += 360;
            }
            updateSimulation();
        });
    }

    // Create red incident ray line if it doesn't exist
    let redLineEl = document.getElementById('redIncidentRay');
    if (!redLineEl) {
        redLineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        redLineEl.setAttribute('id', 'redIncidentRay');
        redLineEl.setAttribute('stroke', '#FF0000');
        redLineEl.setAttribute('stroke-width', '8');
        redLineEl.setAttribute('x1', CENTER_X);
        redLineEl.setAttribute('y1', CENTER_Y);
        redLineEl.setAttribute('x2', CENTER_X);
        redLineEl.setAttribute('y2', CENTER_Y);
        torchGroup.parentNode.insertBefore(redLineEl, torchGroup);
    }

    // Create yellow refracted ray line if it doesn't exist
    let yellowLineEl = document.getElementById('yelloLineDiv');
    if (!yellowLineEl) {
        yellowLineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yellowLineEl.setAttribute('id', 'yelloLineDiv');
        yellowLineEl.setAttribute('stroke', '#FFC506');
        yellowLineEl.setAttribute('stroke-width', '8');
        yellowLineEl.setAttribute('x1', CENTER_X);
        yellowLineEl.setAttribute('y1', CENTER_Y);
        yellowLineEl.setAttribute('x2', CENTER_X);
        yellowLineEl.setAttribute('y2', CENTER_Y + 300);
        yellowLineEl.style.display = 'none';
        torchGroup.parentNode.insertBefore(yellowLineEl, torchGroup);
    }

    // Create incident angle arc group
    let incidentArcGroup = document.getElementById('incidentAngleArc');
    if (!incidentArcGroup) {
        incidentArcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        incidentArcGroup.setAttribute('id', 'incidentAngleArc');

        const arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arcPath.setAttribute('stroke', '#FF0000');
        arcPath.setAttribute('stroke-width', '3');
        arcPath.setAttribute('fill', 'none');
        arcPath.setAttribute('stroke-dasharray', '5,5');
        incidentArcGroup.appendChild(arcPath);

        torchGroup.parentNode.insertBefore(incidentArcGroup, torchGroup);
    }

    // Create incident angle label
    let incidentAngleLabel = document.getElementById('incidentAngleLabel');
    if (!incidentAngleLabel) {
        incidentAngleLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        incidentAngleLabel.setAttribute('id', 'incidentAngleLabel');
        incidentAngleLabel.setAttribute('fill', '#FF0000');
        incidentAngleLabel.setAttribute('font-family', 'Roboto');
        incidentAngleLabel.setAttribute('font-size', '25');
        incidentAngleLabel.setAttribute('font-weight', 'bold');

        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = '0°';
        incidentAngleLabel.appendChild(tspan);

        torchGroup.parentNode.insertBefore(incidentAngleLabel, torchGroup);
    }

    // Create refracted angle arc group
    let refractedArcGroup = document.getElementById('refractedAngleArc');
    if (!refractedArcGroup) {
        refractedArcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        refractedArcGroup.setAttribute('id', 'refractedAngleArc');
        refractedArcGroup.style.display = 'none';

        const arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arcPath.setAttribute('stroke', '#FFC506');
        arcPath.setAttribute('stroke-width', '3');
        arcPath.setAttribute('fill', 'none');
        arcPath.setAttribute('stroke-dasharray', '5,5');
        refractedArcGroup.appendChild(arcPath);

        torchGroup.parentNode.insertBefore(refractedArcGroup, torchGroup);
    }

    // Create refracted angle label
    let refractedAngleLabel = document.getElementById('refractedAngleLabel');
    if (!refractedAngleLabel) {
        refractedAngleLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        refractedAngleLabel.setAttribute('id', 'refractedAngleLabel');
        refractedAngleLabel.setAttribute('fill', '#FFC506');
        refractedAngleLabel.setAttribute('font-family', 'Roboto');
        refractedAngleLabel.setAttribute('font-size', '25');
        refractedAngleLabel.setAttribute('font-weight', 'bold');
        refractedAngleLabel.style.display = 'none';

        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = '0°';
        refractedAngleLabel.appendChild(tspan);

        torchGroup.parentNode.insertBefore(refractedAngleLabel, torchGroup);
    }

    Object.keys(mediaData).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.style.cursor = "pointer";
            btn.addEventListener('click', () => {
                // Set angle to initial value when medium button is clicked
                angleInteger = INITIAL_ANGLE;
                angleDecimal = INITIAL_DECIMAL;
                currentN2 = mediaData[id].n;

                // Show/hide medium images - only show the clicked one
                Object.keys(mediaData).forEach(otherId => {
                    if (mediaData[otherId].img) {
                        mediaData[otherId].img.style.display = (otherId === id) ? 'block' : 'none';
                    }
                });

                // Update button visual feedback - show selected state but keep all clickable
                Object.keys(mediaData).forEach(otherId => {
                    const targetBtn = document.getElementById(otherId);
                    if (targetBtn) {
                        const isCurrent = (otherId === id);
                        // Visual feedback: selected button has reduced opacity, but still clickable
                        targetBtn.style.opacity = isCurrent ? "0.5" : "1";
                        // Keep all buttons clickable - no pointer-events disable
                        targetBtn.style.pointerEvents = "auto";
                    }
                });

                updateSimulation();
            });
        }
    });

    // Start in the clean reset state
    resetSimulation();
});