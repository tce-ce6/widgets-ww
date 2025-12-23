document.addEventListener("DOMContentLoaded", () => {
    const svg = document.querySelector("svg");
    const buttonsGroup = document.getElementById("buttons-water-cycle");


    // --- NEW: LOTTIE BACKGROUND CONFIGURATION ---
    lottie.loadAnimation({
        container: document.getElementById('lottie-env'), // Points to the new DIV in HTML
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/animation/wg-71.json' // <--- UPDATE THIS PATH TO YOUR LOTTIE JSON FILE
    });
    
    // 1. CONFIGURATION
    // Maps Button IDs to correct Drop Zone IDs
    const correctMap = {
        "btn-cloud": ["cloud-drop"],
        "btn-lake": ["lake-drop"],
        "btn-ocean": ["ocean-drop"],
        "btn-river": ["river-drop"],
        "btn-ground-water": ["ground-water-drop"],
        "btn-evaporation": ["evaporation-drop"],
        "btn-condensation": ["condensation-drop"], // Handles 'condensation-drop' ID in provided SVG
        "btn-rain": ["rain-drop"],
        "btn-snow": ["snow-drop"]       // Can drop on either
    };

    // State
    let draggedElement = null;
    let offset = { x: 0, y: 0 };
    let originalPositions = {};
    let isLocked = false;

    // 2. INITIALIZATION
    const draggableIds = Object.keys(correctMap);

    draggableIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Save start position for reset/snap-back
            originalPositions[id] = {
                x: parseFloat(el.getAttribute("x")),
                y: parseFloat(el.getAttribute("y"))
            };

            el.style.cursor = "grab";
            
            // Mouse Events
            el.addEventListener("mousedown", startDrag);
            
            // Touch Events (Passive: false is critical for preventing scroll)
            el.addEventListener("touchstart", startDrag, { passive: false });
        }
    });

    // Global Controls
    document.getElementById("show-answer-btn").addEventListener("click", showAnswer);
    document.getElementById("reset-button").addEventListener("click", resetWidget);

    // 3. CORE DRAG LOGIC

    function getMousePosition(evt) {
        const CTM = svg.getScreenCTM();
        let clientX, clientY;

        if (evt.touches && evt.touches.length > 0) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
        } else {
            clientX = evt.clientX;
            clientY = evt.clientY;
        }

        return {
            x: (clientX - CTM.e) / CTM.a,
            y: (clientY - CTM.f) / CTM.d
        };
    }

    function startDrag(evt) {
        if (isLocked) return;
        
        // CRITICAL: Prevents the browser from dragging the 'image' ghost
        evt.preventDefault(); 

        // Always find the foreignObject, even if user clicked the internal image
        const target = evt.target.closest("foreignObject");
        if (!target || !draggableIds.includes(target.id)) return;

        draggedElement = target;
        draggedElement.style.cursor = "grabbing";

        // Move to top of stack visually
        buttonsGroup.appendChild(draggedElement);

        // Remove existing icon for this button immediately when user picks it up
        removeStatusIcon(draggedElement.id);

        const coord = getMousePosition(evt);
        
        // Calculate offset from top-left of the element
        offset.x = coord.x - parseFloat(draggedElement.getAttribute("x"));
        offset.y = coord.y - parseFloat(draggedElement.getAttribute("y"));

        // Add global listeners to document to catch fast movements or release outside SVG
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);
        document.addEventListener("touchmove", drag, { passive: false });
        document.addEventListener("touchend", endDrag);
    }

    function drag(evt) {
        if (!draggedElement) return;
        evt.preventDefault(); // Stop scrolling on touch

        const coord = getMousePosition(evt);
        draggedElement.setAttribute("x", coord.x - offset.x);
        draggedElement.setAttribute("y", coord.y - offset.y);
    }

    function checkAnswers(){
        document.querySelectorAll(".status-icon").forEach(el => el.remove());

        draggableIds.forEach(btnId => {
            const btn = document.getElementById(btnId);
            const zoneId = getIntersectingZone(btn);
            
            // Only validate if the button is actually inside a drop zone
            if(zoneId) {
                validateSingleDrop(btn, zoneId);
            }
        });
    }

    function endDrag(evt) {
        if (!draggedElement) return;

        const el = draggedElement;
        el.style.cursor = "grab";

        // Clean up listeners immediately
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", endDrag);
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("touchend", endDrag);

        draggedElement = null;

        // Check Drop
        const dropZoneId = getIntersectingZone(el);

        if (dropZoneId) {
            // Valid drop zone found: Snap to it.
            snapToZone(el, dropZoneId);
            checkAnswers();
            
            // UPDATED: Validation removed from here. 
            // Icons will only appear when "Check Answer" is clicked.
        } else {
            // No zone found, snap back home
            snapToOriginal(el);
        }
    }

    // 4. GEOMETRY & DETECTION

    function getIntersectingZone(button) {
        const bBox = button.getBBox();
        const bCenter = {
            x: parseFloat(button.getAttribute("x")) + bBox.width / 2,
            y: parseFloat(button.getAttribute("y")) + bBox.height / 2
        };

        // All possible drop zone IDs
        const allZones = [
            "cloud-drop", "lake-drop", "ocean-drop", "river-drop", 
            "ground-water-drop", "evaporation-drop", "condensation-drop", "rain-drop", "snow-drop"
        ];

        for (let zoneId of allZones) {
            const zone = document.getElementById(zoneId);
            if (zone) {
                const zBox = zone.getBBox();
                // Simple hit detection: Is the center of the button inside the zone box?
                // Added 20px padding for easier dropping
                if (bCenter.x >= zBox.x - 20 && bCenter.x <= zBox.x + zBox.width + 20 &&
                    bCenter.y >= zBox.y - 20 && bCenter.y <= zBox.y + zBox.height + 20) {
                    return zoneId;
                }
            }
        }
        return null;
    }

    function snapToZone(button, zoneId) {
        const zone = document.getElementById(zoneId);
        const zBox = zone.getBBox();
        const bBox = button.getBBox();

        const newX = zBox.x + (zBox.width - bBox.width) / 2;
        const newY = zBox.y + (zBox.height - bBox.height) / 2;

        button.setAttribute("x", newX);
        button.setAttribute("y", newY);
    }

    function snapToOriginal(button) {
        const origin = originalPositions[button.id];
        button.setAttribute("x", origin.x);
        button.setAttribute("y", origin.y);
    }

    // 5. VALIDATION & FEEDBACK

    function validateSingleDrop(button, zoneId) {
        const validZones = correctMap[button.id];
        const isCorrect = validZones.includes(zoneId);
        showStatusIcon(button, isCorrect);
    }

    function checkAllAnswers() {
        if(isLocked) return;
        
        // Remove old icons first to avoid duplicates
        
    }

    function showAnswer() {
        resetWidget(false); // Reset positions first
        isLocked = true;

        draggableIds.forEach(btnId => {
            const btn = document.getElementById(btnId);
            const targetZoneId = correctMap[btnId][0]; // Take first valid zone
            const zone = document.getElementById(targetZoneId);
            
            if (zone) {
                snapToZone(btn, targetZoneId);
                showStatusIcon(btn, true); // Show green tick
                btn.style.cursor = "default";
            }
        });
    }

    function resetWidget(clearIcons = true) {
        isLocked = false;
        if (clearIcons) {
            document.querySelectorAll(".status-icon").forEach(el => el.remove());
        }

        draggableIds.forEach(id => {
            const el = document.getElementById(id);
            snapToOriginal(el);
            el.style.cursor = "grab";
        });
    }

    // 6. ICON RENDERING (Tick/Cross)

    function showStatusIcon(button, isCorrect) {
        removeStatusIcon(button.id); // Clear previous

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", "status-icon");
        group.setAttribute("id", "icon-" + button.id);

        // Button position
        const bx = parseFloat(button.getAttribute("x"));
        const by = parseFloat(button.getAttribute("y"));
        const bw = parseFloat(button.getAttribute("width"));

        // Icon size
        const size = 40;

        // Top-right positioning
        const x = bx + bw - size;
        const y = by;

        // foreignObject
        const foreignObject = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "foreignObject"
        );
        foreignObject.setAttribute("x", x + 14);
        foreignObject.setAttribute("y", y  - 14);
        foreignObject.setAttribute("width", size);
        foreignObject.setAttribute("height", size);

        /* ------------------ ICON HTML ------------------ */
        let html = "";

        if (isCorrect) {
            html = `
            <div
              style="
                width:${size}px;
                height:${size}px;
                border-radius:50%;
                background:#2ECC71;
                display:flex;
                align-items:center;
                justify-content:center;
               
              "
            >
              <span
                style="
                  width:10px;
                  height:22px;
                  border-right:5px solid #fff;
                  border-bottom:5px solid #fff;
                  transform:rotate(45deg);
                  margin-bottom:4px;
                  display:inline-block;
                "
              ></span>
            </div>
            `;
        } else {
            html = `
            <div
              style="
                width:${size}px;
                height:${size}px;
                background:#e53935;
                border-radius:50%;
                position:relative;
               
              "
            >
              <div
                style="
                  position:absolute;
                  top:50%;
                  left:50%;
                  width:24px;
                  height:4px;
                  background:white;
                  transform:translate(-50%, -50%) rotate(45deg);
                  border-radius:2px;
                "
              ></div>
              <div
                style="
                  position:absolute;
                  top:50%;
                  left:50%;
                  width:24px;
                  height:4px;
                  background:white;
                  transform:translate(-50%, -50%) rotate(-45deg);
                  border-radius:2px;
                "
              ></div>
            </div>
            `;
        }

        foreignObject.innerHTML = html;

        group.appendChild(foreignObject);
        svg.appendChild(group);
    }

    function removeStatusIcon(btnId) {
        const icon = document.getElementById("icon-" + btnId);
        if (icon) icon.remove();
    }
});