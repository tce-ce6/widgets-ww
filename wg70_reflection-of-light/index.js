// Global variables for DOM elements
let integerUpArrow, integerDownArrow, decimalUpArrow, decimalDownArrow, angleIntegerValue, angleDecimalValue, torch, resetBtn;

// Initial Defaults
const INITIAL_ANGLE = 69;
const INITIAL_DECIMAL = 6;
let angleInteger = INITIAL_ANGLE;
let angleDecimal = INITIAL_DECIMAL;
let angleIncrement = 1;
let currentN2 = null;
const n1 = 1.0; // Air refractive index

// Center point where light ray hits the interface
const CENTER_X = 960.5;
const CENTER_Y = 524.5;
const TORCH_RADIUS = 200;

const mediaData = {
    'water-btn': { n: 1.33, img: document.getElementById('water-img') },
    'glass-btn': { n: 1.50, img: document.getElementById('glass-img') },
    'dimond-btn': { n: 2.40, img: document.getElementById('dimond-img') }
};

function getTotalAngle() {
    return angleInteger + angleDecimal / 10;
}

/**
 * Main update function to handle torch movement and ray physics
 */
function updateSimulation() {
    if (angleIntegerValue) angleIntegerValue.textContent = angleInteger + ".";
    if (angleDecimalValue) angleDecimalValue.textContent = angleDecimal + "°";

    const totalAngle = getTotalAngle();
    let normalizedAngle = totalAngle % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;

    // SVG Angle logic: Normal pointing up is 270 degrees in SVG circle
    let svgAngle = (270 - normalizedAngle) % 360;
    if (svgAngle < 0) svgAngle += 360;

    const angleRad = svgAngle * (Math.PI / 180);
    const torchX = CENTER_X + TORCH_RADIUS * Math.cos(angleRad);
    const torchY = CENTER_Y + TORCH_RADIUS * Math.sin(angleRad);

    // Calculate rotation to make torch face the center
    const dx = CENTER_X - torchX;
    const dy = CENTER_Y - torchY;
    const torchRotation = Math.atan2(dy, dx) * (180 / Math.PI);

    if (torch) {
        torch.setAttribute("x", torchX - 95);
        torch.setAttribute("y", torchY - 42);
        torch.setAttribute("transform", `rotate(${torchRotation - 19} ${torchX} ${torchY})`);
    }

    const redLineEl = document.getElementById('redIncidentRay');
    const yellowLineEl = document.getElementById('yelloLineDiv');

    if (currentN2) {
        // 1. Show Red Incident Ray
        if (redLineEl) {
            redLineEl.style.display = "block";
            redLineEl.setAttribute("x1", torchX);
            redLineEl.setAttribute("y1", torchY);
            redLineEl.setAttribute("x2", CENTER_X);
            redLineEl.setAttribute("y2", CENTER_Y);
        }

        updateIncidentAngleArc(totalAngle, torchX > CENTER_X);


        // 2. Physics Logic (Snell's Law)
        let incidentAngle = totalAngle % 90;
        const theta1Rad = incidentAngle * (Math.PI / 180);
        const sinTheta2 = (n1 * Math.sin(theta1Rad)) / currentN2;
        const isRightSide = torchX > CENTER_X;

        if (yellowLineEl) {
            yellowLineEl.style.display = "block";
            const lineLength = 350;

            if (sinTheta2 <= 1) {
                // Refraction (Yellow ray bends into medium)
                const theta2Rad = Math.asin(sinTheta2);
                let theta2Deg = theta2Rad * (180 / Math.PI);

                // SVG coordinates: 90 is Down. Bending left or right of 90.
                const rayAngleSVG = isRightSide ? (90 + theta2Deg) : (90 - theta2Deg);
                const resRad = rayAngleSVG * (Math.PI / 180);

                yellowLineEl.setAttribute("x1", CENTER_X);
                yellowLineEl.setAttribute("y1", CENTER_Y);
                yellowLineEl.setAttribute("x2", CENTER_X + lineLength * Math.cos(resRad));
                yellowLineEl.setAttribute("y2", CENTER_Y + lineLength * Math.sin(resRad));
                yellowLineEl.setAttribute("stroke", "#FFC506");

                //  updateRefractedAngleArc(theta2Deg, isRightSide);
                const refractedSVGAngle = 90 + theta2Deg;
                updateRefractedAngleArc(refractedSVGAngle);

            } else {
                // Total Internal Reflection (Light reflects back up)
                const reflectedAngleSVG = isRightSide ? (270 + incidentAngle) : (270 - incidentAngle);
                const resRad = reflectedAngleSVG * (Math.PI / 180);

                yellowLineEl.setAttribute("x1", CENTER_X);
                yellowLineEl.setAttribute("y1", CENTER_Y);
                yellowLineEl.setAttribute("x2", CENTER_X + lineLength * Math.cos(resRad));
                yellowLineEl.setAttribute("y2", CENTER_Y + lineLength * Math.sin(resRad));
                yellowLineEl.setAttribute("stroke", "#FF0000"); // Red for reflection

                hideRefractedElements();
            }
        }
    } else {
        // No medium selected: hide rays and arcs
        if (redLineEl) redLineEl.style.display = "none";
        if (yellowLineEl) yellowLineEl.style.display = "none";
        hideIncidentElements();
        hideRefractedElements();
    }
}

/**
 * Drawing the Arc for the Incident Angle (Top)
 */
/* ===============================
   REFRACTED ANGLE ARC (RED)
================================= */
function updateRefractedAngleArc(raySVGAngle) {

    const arcRadius = 60;
    const arcGroup = document.getElementById('refractedAngleArc');
    const arcLabel = document.getElementById('refractedAngleLabel');
    if (!arcGroup || !arcLabel) return;

    const normalAngle = 90; // vertical down

    let rayAngle = raySVGAngle % 360;
    if (rayAngle < 0) rayAngle += 360;

    let delta = rayAngle - normalAngle;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const endAngle = normalAngle + delta;

    const startRad = normalAngle * Math.PI / 180;
    const endRad = endAngle * Math.PI / 180;

    const startX = CENTER_X + arcRadius * Math.cos(startRad);
    const startY = CENTER_Y + arcRadius * Math.sin(startRad);
    const endX = CENTER_X + arcRadius * Math.cos(endRad);
    const endY = CENTER_Y + arcRadius * Math.sin(endRad);

    // IMPORTANT FIX HERE
    const sweepFlag = delta > 0 ? 1 : 0;

    const path = `M ${startX} ${startY}
                  A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;

    arcGroup.querySelector('path').setAttribute('d', path);
    arcGroup.style.display = "block";
    arcLabel.style.display = "block";

    arcLabel.querySelector('tspan').textContent =
        Math.abs(delta).toFixed(1) + "°";

    const midAngle = normalAngle + delta / 2;
    const midRad = midAngle * Math.PI / 180;

    arcLabel.setAttribute('x',
        CENTER_X + (arcRadius + 30) * Math.cos(midRad));
    arcLabel.setAttribute('y',
        CENTER_Y + (arcRadius + 30) * Math.sin(midRad));
}


/* ===============================
   INCIDENT ANGLE ARC (YELLOW)
================================= */
function updateIncidentAngleArc(totalAngleDeg) {

    const arcRadius = 60;
    const arcGroup = document.getElementById('incidentAngleArc');
    const arcLabel = document.getElementById('incidentAngleLabel');
    if (!arcGroup || !arcLabel) return;

    // Convert physics angle to SVG
    let normalized = totalAngleDeg % 360;
    if (normalized < 0) normalized += 360;

    let rayAngle = (270 - normalized) % 360;
    if (rayAngle < 0) rayAngle += 360;

    const normalAngle = 270; // vertical up

    // Calculate delta properly
    let delta = rayAngle - normalAngle;

    // Normalize to shortest path
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const endAngle = normalAngle + delta;

    const startRad = normalAngle * Math.PI / 180;
    const endRad = endAngle * Math.PI / 180;

    const startX = CENTER_X + arcRadius * Math.cos(startRad);
    const startY = CENTER_Y + arcRadius * Math.sin(startRad);
    const endX = CENTER_X + arcRadius * Math.cos(endRad);
    const endY = CENTER_Y + arcRadius * Math.sin(endRad);

    // IMPORTANT FIX HERE
    const sweepFlag = delta > 0 ? 1 : 0;

    const path = `M ${startX} ${startY}
                  A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;

    arcGroup.querySelector('path').setAttribute('d', path);
    arcGroup.style.display = "block";
    arcLabel.style.display = "block";

    arcLabel.querySelector('tspan').textContent =
        Math.abs(delta).toFixed(1) + "°";

    const midAngle = normalAngle + delta / 2;
    const midRad = midAngle * Math.PI / 180;

    arcLabel.setAttribute('x',
        CENTER_X + (arcRadius + 30) * Math.cos(midRad));
    arcLabel.setAttribute('y',
        CENTER_Y + (arcRadius + 30) * Math.sin(midRad));
}

function hideRefractedElements() {
    const arc = document.getElementById('refractedAngleArc');
    const lbl = document.getElementById('refractedAngleLabel');
    if (arc) arc.style.display = "none";
    if (lbl) lbl.style.display = "none";
}

function hideIncidentElements() {
    const arc = document.getElementById('incidentAngleArc');
    const lbl = document.getElementById('incidentAngleLabel');
    if (arc) arc.style.display = "none";
    if (lbl) lbl.style.display = "none";
}

function resetSimulation() {
    angleInteger = INITIAL_ANGLE;
    angleDecimal = INITIAL_DECIMAL;
    currentN2 = null;

    Object.keys(mediaData).forEach(id => {
        if (mediaData[id].img) mediaData[id].img.style.display = 'none';
        const btn = document.getElementById(id);
        if (btn) {
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
        }
    });

    updateSimulation();
}

/**
 * Main Initialization
 */
document.addEventListener("DOMContentLoaded", () => {
    integerUpArrow = document.getElementById('integerUpArrow');
    integerDownArrow = document.getElementById('integerDownArrow');
    decimalUpArrow = document.getElementById('decimalUpArrow');
    decimalDownArrow = document.getElementById('decimalDownArrow');
    angleIntegerValue = document.getElementById('angleIntegerValue');
    angleDecimalValue = document.getElementById('angleDecimalValue');
    torch = document.getElementById('torch');
    resetBtn = document.getElementById('reset-btn');

    const torchGroup = document.getElementById('torchSVG');
    if (!torchGroup) return;

    // --- Dynamic Creation of Ray Elements (to ensure they are present) ---
    if (!document.getElementById('redIncidentRay')) {
        const redLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        redLine.id = 'redIncidentRay';
        redLine.setAttribute('stroke', '#FF0000');
        redLine.setAttribute('stroke-width', '8');
        torchGroup.parentNode.insertBefore(redLine, torchGroup);
    }
    if (!document.getElementById('yelloLineDiv')) {
        const yellowLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yellowLine.id = 'yelloLineDiv';
        yellowLine.setAttribute('stroke-width', '8');
        torchGroup.parentNode.insertBefore(yellowLine, torchGroup);
    }

    // --- Create Incident Angle Arc ---
    if (!document.getElementById('incidentAngleArc')) {

        const arcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        arcGroup.setAttribute('id', 'incidentAngleArc');

        const arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arcPath.setAttribute('stroke', '#FF0000');
        arcPath.setAttribute('stroke-width', '4');
        arcPath.setAttribute('fill', 'none');
        arcPath.setAttribute('stroke-dasharray', '6,4');

        arcGroup.appendChild(arcPath);
        torchGroup.parentNode.appendChild(arcGroup); // important: append, not insertBefore
    }

    // --- Create Incident Label ---
    if (!document.getElementById('incidentAngleLabel')) {

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('id', 'incidentAngleLabel');
        text.setAttribute('fill', '#FF0000');
        text.setAttribute('font-size', '24');
        text.setAttribute('font-weight', 'bold');

        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = '0°';
        text.appendChild(tspan);

        torchGroup.parentNode.appendChild(text);
    }


    // --- Create Refracted Angle Arc ---
    if (!document.getElementById('refractedAngleArc')) {

        const arcGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        arcGroup.setAttribute('id', 'refractedAngleArc');
        arcGroup.style.display = "none";

        const arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arcPath.setAttribute('stroke', '#FFC506');
        arcPath.setAttribute('stroke-width', '4');
        arcPath.setAttribute('fill', 'none');
        arcPath.setAttribute('stroke-dasharray', '6,4');

        arcGroup.appendChild(arcPath);
        torchGroup.parentNode.appendChild(arcGroup);
    }

    // --- Create Refracted Label ---
    if (!document.getElementById('refractedAngleLabel')) {

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('id', 'refractedAngleLabel');
        text.setAttribute('fill', '#FFC506');
        text.setAttribute('font-size', '24');
        text.setAttribute('font-weight', 'bold');
        text.style.display = "none";

        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = '0°';
        text.appendChild(tspan);

        torchGroup.parentNode.appendChild(text);
    }

    // --- Arrow Listeners ---
    integerUpArrow?.addEventListener('click', () => {
        angleInteger = (angleInteger + 1) % 360;
        updateSimulation();
    });
    integerDownArrow?.addEventListener('click', () => {
        angleInteger = (angleInteger - 1 + 360) % 360;
        updateSimulation();
    });
    decimalUpArrow?.addEventListener('click', () => {
        angleDecimal++;
        if (angleDecimal > 9) { angleDecimal = 0; angleInteger++; }
        updateSimulation();
    });
    decimalDownArrow?.addEventListener('click', () => {
        angleDecimal--;
        if (angleDecimal < 0) { angleDecimal = 9; angleInteger--; }
        updateSimulation();
    });

    // --- Medium Button Listeners ---
    Object.keys(mediaData).forEach(id => {
        const btn = document.getElementById(id);
        btn?.addEventListener('click', () => {
            angleInteger = INITIAL_ANGLE;
            angleDecimal = INITIAL_DECIMAL;
            currentN2 = mediaData[id].n;

            Object.keys(mediaData).forEach(k => {
                if (mediaData[k].img) mediaData[k].img.style.display = (k === id) ? 'block' : 'none';
                document.getElementById(k).style.opacity = (k === id) ? "0.5" : "1";
            });
            updateSimulation();
        });
    });

    resetBtn?.addEventListener('click', resetSimulation);

    resetSimulation();
});