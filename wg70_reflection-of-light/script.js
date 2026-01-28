// These will be initialized in DOMContentLoaded
let upArrow, downArrow, angleValue, torch, yellowLine, resetBtn;

// Function to set angle increment (can be called to change how much angle changes per click)
function setAngleIncrement(value) {
    angleIncrement = Math.max(0.1, Math.min(10, value)); // Clamp between 0.1 and 10
}

// Initial Defaults
const INITIAL_ANGLE = 69.6;
let angle = INITIAL_ANGLE;
let angleIncrement = 1; // Default angle change value
let currentN2 = null; // No medium selected initially
const n1 = 1.0; 

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

function updateSimulation() {
    // Display angle with degree symbol
    if (angleValue) {
        angleValue.textContent = angle.toFixed(1) + "°";
    }
    
    // Calculate torch position in circular motion around center point
    // Angle is measured from the normal (vertical line pointing up, y-axis)
    // 0° = along normal pointing up, 90° = to the right, 180° = down, 270° = to the left
    // For SVG coordinates: 0° is right, 90° is down, 180° is left, 270° is up
    // Normal pointing up = 270° in SVG
    // Convert: if angle is measured from normal (0° = up), then:
    // - angle 0° → SVG 270° (up)
    // - angle 90° → SVG 0° (right)  
    // - angle 180° → SVG 90° (down)
    // - angle 270° → SVG 180° (left)
    // Formula: SVG_angle = (270 - angle) mod 360
    
    let normalizedAngle = angle % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;
    
    let svgAngle = (270 - normalizedAngle) % 360;
    if (svgAngle < 0) svgAngle += 360;
    
    const angleRad = svgAngle * (Math.PI / 180);

    // Calculate torch position on circle (torch can be anywhere around center)
    const torchX = CENTER_X + TORCH_RADIUS * Math.cos(angleRad);
    const torchY = CENTER_Y + TORCH_RADIUS * Math.sin(angleRad);

    console.log(torchX - 95, torchY - 42)
    
    // Calculate rotation angle for torch to point towards center
    // The torch should point from its position towards the center point
    const dx = CENTER_X - torchX;
    const dy = CENTER_Y - torchY;
    const torchRotation = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Position and rotate torch to point towards center
    // Adjust x, y to account for torch image center (assuming torch image is ~100x100)
    torch.setAttribute("x", torchX - 95);
    torch.setAttribute("y", torchY - 42);
    torch.setAttribute("transform", `rotate(${torchRotation - 19} ${torchX} ${torchY})`);

    // Update red incident ray line (from torch to center point)
    const redLineEl = document.getElementById('redIncidentRay');
    if (redLineEl) {
        redLineEl.setAttribute("x1", torchX);
        redLineEl.setAttribute("y1", torchY);
        redLineEl.setAttribute("x2", CENTER_X);
        redLineEl.setAttribute("y2", CENTER_Y);
    }
    
    // Update incident angle arc (red arc showing angle from normal to incident ray)
    updateIncidentAngleArc(angle);

    // Calculate and show yellow refracted ray line if a medium is selected
    if (currentN2) {
        // Get current medium data
        const currentMedium = Object.values(mediaData).find(m => m.n === currentN2);
        const allowedAngles = currentMedium ? currentMedium.angles : [];
        
        // Normalize angle to 0-360
        let effectiveAngle = angle % 360;
        if (effectiveAngle < 0) effectiveAngle += 360;
        
        // Get the actual incident angle from normal (use acute angle)
        let incidentAngle = effectiveAngle;
        if (incidentAngle > 180) incidentAngle = 360 - incidentAngle;
        if (incidentAngle > 90) incidentAngle = 180 - incidentAngle;
        
        // Check if current angle is in predefined angles (with tolerance)
        const isAllowedAngle = allowedAngles.some(a => Math.abs(incidentAngle - a) < 0.5);
        
        if (isAllowedAngle) {
            // Snell's law: n1 * sin(θ1) = n2 * sin(θ2)
            const theta1Rad = incidentAngle * (Math.PI / 180);
            const sinTheta2 = (n1 * Math.sin(theta1Rad)) / currentN2;
            
            // Check if total internal reflection occurs (sinTheta2 > 1)
            if (sinTheta2 <= 1 && sinTheta2 >= -1) {
                const theta2Rad = Math.asin(sinTheta2);
                let theta2Deg = theta2Rad * (180 / Math.PI);
                
                // Determine direction of refracted ray based on incident ray direction
                // Check which side of normal the incident ray is on
                let normalizedAngle = angle % 360;
                if (normalizedAngle < 0) normalizedAngle += 360;
                let svgAngle = (270 - normalizedAngle) % 360;
                if (svgAngle < 0) svgAngle += 360;
                const angleRad = svgAngle * (Math.PI / 180);
                const torchX = CENTER_X + TORCH_RADIUS * Math.cos(angleRad);
                const isRightSide = torchX > CENTER_X;
                
                // Refracted ray should be on the same side as incident ray
                if (!isRightSide) theta2Deg = -theta2Deg;
                
                // Show yellow line - it should cross the y-axis (normal) at the calculated angle
                const yellowLineEl = document.getElementById('yelloLineDiv');
                if (yellowLineEl) {
                    yellowLineEl.style.display = "block";
                    // Position at center point
                    // The refracted ray goes into medium 2 (below the interface)
                    // Start from center, extend downward and to the side based on refracted angle
                    const lineLength = 300;
                    // Calculate end point: from normal (pointing down = 90°) rotate by theta2Deg
                    const refractedAngleRad = (90 + theta2Deg) * (Math.PI / 180);
                    const endX = CENTER_X + lineLength * Math.cos(refractedAngleRad);
                    const endY = CENTER_Y + lineLength * Math.sin(refractedAngleRad);
                    
                    yellowLineEl.setAttribute("x1", CENTER_X);
                    yellowLineEl.setAttribute("y1", CENTER_Y);
                    yellowLineEl.setAttribute("x2", endX);
                    yellowLineEl.setAttribute("y2", endY);
                }
                
                // Update refracted angle arc
                updateRefractedAngleArc(theta2Deg);
            } else {
                // Total internal reflection - hide yellow line and arc
                hideRefractedElements();
            }
        } else {
            // Angle not in predefined list - hide yellow line and arc
            hideRefractedElements();
        }
    } else {
        // Hide yellow line and arc if no medium is active
        hideRefractedElements();
    }
}

// Helper function to hide refracted elements
function hideRefractedElements() {
    const yellowLineEl = document.getElementById('yelloLineDiv');
    if (yellowLineEl) {
        yellowLineEl.style.display = "none";
    }
    const refractedArc = document.getElementById('refractedAngleArc');
    if (refractedArc) {
        refractedArc.style.display = "none";
    }
    const refractedAngleLabel = document.getElementById('refractedAngleLabel');
    if (refractedAngleLabel) {
        refractedAngleLabel.style.display = "none";
    }
}

// Function to update incident angle arc
function updateIncidentAngleArc(angleDeg) {
    const arcRadius = 60; // Radius of the arc
    const arcGroup = document.getElementById('incidentAngleArc');
    const arcLabel = document.getElementById('incidentAngleLabel');
    
    if (!arcGroup || !arcLabel) return;
    
    // Normalize angle to 0-360
    let angle = angleDeg % 360;
    if (angle < 0) angle += 360;
    
    // Get the actual incident angle from normal (use acute angle)
    let incidentAngle = angle;
    if (incidentAngle > 180) incidentAngle = 360 - incidentAngle;
    if (incidentAngle > 90) incidentAngle = 180 - incidentAngle;
    
    // Calculate torch position to determine which side of normal the ray is on
    let normalizedAngle = angle % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;
    let svgAngle = (270 - normalizedAngle) % 360;
    if (svgAngle < 0) svgAngle += 360;
    const angleRad = svgAngle * (Math.PI / 180);
    const torchX = CENTER_X + TORCH_RADIUS * Math.cos(angleRad);
    
    // Determine direction: is torch to the left or right of normal?
    const isRightSide = torchX > CENTER_X;
    
    // Arc goes from normal (pointing up, 270° in SVG) to the incident ray
    // Normal pointing up = 270° in SVG coordinates
    const normalAngle = 270; // Normal pointing up in SVG
    let rayAngle;
    
    if (isRightSide) {
        // Ray is on right side, angle measured clockwise from normal
        // In SVG: 270° (up) + angle = going clockwise
        rayAngle = (270 + incidentAngle) % 360;
    } else {
        // Ray is on left side, angle measured counter-clockwise from normal
        // In SVG: 270° (up) - angle = going counter-clockwise
        rayAngle = (270 - incidentAngle + 360) % 360;
    }
    
    // Calculate start and end points
    const startX = CENTER_X + arcRadius * Math.cos(normalAngle * Math.PI / 180);
    const startY = CENTER_Y + arcRadius * Math.sin(normalAngle * Math.PI / 180);
    const endX = CENTER_X + arcRadius * Math.cos(rayAngle * Math.PI / 180);
    const endY = CENTER_Y + arcRadius * Math.sin(rayAngle * Math.PI / 180);
    
    // Determine sweep direction (0 = counter-clockwise, 1 = clockwise)
    const sweepFlag = isRightSide ? 1 : 0;
    
    // Create arc path
    const arcPath = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;
    
    const pathEl = arcGroup.querySelector('path');
    if (pathEl) {
        pathEl.setAttribute('d', arcPath);
    }
    
    // Position label at midpoint of arc
    let midAngle = (normalAngle + rayAngle) / 2;
    // Handle wrap-around
    if (Math.abs(normalAngle - rayAngle) > 180) {
        if (normalAngle > rayAngle) {
            midAngle = ((normalAngle + rayAngle + 360) / 2) % 360;
        } else {
            midAngle = ((normalAngle + rayAngle - 360) / 2 + 360) % 360;
        }
    }
    const labelX = CENTER_X + (arcRadius + 25) * Math.cos(midAngle * Math.PI / 180);
    const labelY = CENTER_Y + (arcRadius + 25) * Math.sin(midAngle * Math.PI / 180);
    arcLabel.setAttribute('x', labelX);
    arcLabel.setAttribute('y', labelY);
    
    // Update label text
    const textEl = arcLabel.querySelector('tspan');
    if (textEl) {
        textEl.textContent = incidentAngle.toFixed(1) + "°";
    }
}

// Function to update refracted angle arc
function updateRefractedAngleArc(angleDeg) {
    const arcRadius = 60; // Radius of the arc
    const arcGroup = document.getElementById('refractedAngleArc');
    const arcLabel = document.getElementById('refractedAngleLabel');
    
    if (!arcGroup || !arcLabel) return;
    
    // Normalize angle - refracted angle is measured from normal (pointing down)
    let refractedAngle = Math.abs(angleDeg);
    
    // Calculate arc path
    // Arc goes from normal (pointing down, 90° in SVG) to the refracted ray direction
    const normalAngle = 90; // Normal pointing down (into medium 2) in SVG
    const isRightSide = angleDeg >= 0;
    const rayAngle = normalAngle + angleDeg; // Refracted ray direction
    
    // Calculate start and end points
    const startX = CENTER_X + arcRadius * Math.cos(normalAngle * Math.PI / 180);
    const startY = CENTER_Y + arcRadius * Math.sin(normalAngle * Math.PI / 180);
    const endX = CENTER_X + arcRadius * Math.cos(rayAngle * Math.PI / 180);
    const endY = CENTER_Y + arcRadius * Math.sin(rayAngle * Math.PI / 180);
    
    // Determine sweep direction (0 = counter-clockwise, 1 = clockwise)
    // For refracted ray: if positive angle (right side), sweep clockwise (1)
    // If negative angle (left side), sweep counter-clockwise (0)
    const sweepFlag = isRightSide ? 1 : 0;
    
    // Create arc path
    const arcPath = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;
    
    const pathEl = arcGroup.querySelector('path');
    if (pathEl) {
        pathEl.setAttribute('d', arcPath);
    }
    
    // Position label at midpoint of arc
    const midAngle = (normalAngle + rayAngle) / 2;
    const labelX = CENTER_X + (arcRadius + 25) * Math.cos(midAngle * Math.PI / 180);
    const labelY = CENTER_Y + (arcRadius + 25) * Math.sin(midAngle * Math.PI / 180);
    arcLabel.setAttribute('x', labelX);
    arcLabel.setAttribute('y', labelY);
    
    // Update label text
    const textEl = arcLabel.querySelector('tspan');
    if (textEl) {
        textEl.textContent = refractedAngle.toFixed(1) + "°";
    }
    
    arcGroup.style.display = "block";
    arcLabel.style.display = "block";
}

function resetSimulation() {
    // 1. Reset variables
    angle = INITIAL_ANGLE;
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

    // 3. Update visuals (will hide yellow line)
    updateSimulation();
}


document.addEventListener("DOMContentLoaded", () => {
    // Initialize DOM element references
    upArrow = document.getElementById('upArrow');
    downArrow = document.getElementById('downArrow');
    angleValue = document.getElementById('angleValue');
    torch = document.getElementById('torch');
    yellowLine = document.getElementById('yelloLineDiv');
    resetBtn = document.getElementById('reset-btn');
    
    const svg = document.querySelector('svg');
    const torchGroup = document.getElementById('Group 56');
    
    if (!torchGroup || !torchGroup.parentNode) return;
    
    // Set up arrow listeners for angle control
    if (upArrow) {
        upArrow.addEventListener('click', () => { 
            angle += angleIncrement; 
            // Allow full 360 degree rotation
            if (angle >= 360) angle -= 360;
            updateSimulation(); 
        });
    }
    
    if (downArrow) {
        downArrow.addEventListener('click', () => { 
            angle -= angleIncrement; 
            // Allow full 360 degree rotation
            if (angle < 0) angle += 360;
            updateSimulation(); 
        });
    }
    
    // Set up reset button listener
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSimulation);
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
                // Set angle to 69.6° when medium button is clicked
                angle = INITIAL_ANGLE;
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