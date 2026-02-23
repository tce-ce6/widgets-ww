document.addEventListener("DOMContentLoaded", () => {
    const svg = document.querySelector("svg");
    const showAnswerBtn = document.getElementById("show-answer-btn");

    // --- LOTTIE BACKGROUND ---
    lottie.loadAnimation({
        container: document.getElementById('lottie-env'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/Chem_WG72_Assets.json'
    });

    // 1. CONFIGURATION
    const correctMap = {
        "btn-fossile-fuel": "drop-zone-fossils",
        "btn-sunlight": "drop-zone-sunlight",
        "btn-co2": "drop-zone-co2",
        "btn-photosynthesis": "drop-zone-photosynthesis",
        "btn-organic-carbon": "drop-zone-organic-carbon",
        "btn-animal-respiration": "drop-zone-animal-repiration",
        "btn-auto-factory": "drop-zone-auto-factory",
        "btn-decay-organisms": "drop-zone-decay-organisms",
        "btn-root-respiration": "drop-zone-root-respiration",
        "btn-dead-organisms": "drop-zone-dead-organisms"
    };

    const feedback = {
        "btn-fossile-fuel": {
            label: "Fossils and fossil fuel",
            correct: "Correct. Fossil fuels store carbon formed over millions of years.",
            incorrect: "Not correct. This carbon store is found deep underground."
        },
        "btn-sunlight": {
            label: "Sunlight",
            correct: "Well done. Sunlight provides energy needed for photosynthesis.",
            incorrect: "Try again. Sunlight is the energy source, not a gas or organism."
        },
        "btn-co2": {
            label: "CO\u2082",
            correct: "Correct. Carbon dioxide is present in air and moves through the carbon cycle.",
            incorrect: "Not correct. This label represents a gas, not a plant or animal process."
        },
        "btn-photosynthesis": {
            label: "Photosynthesis",
            correct: "Well done. Photosynthesis uses carbon dioxide to make food in plants.",
            incorrect: "Try again. This process happens in plants, not in animals or factories."
        },
        "btn-organic-carbon": {
            label: "Organic carbon",
            correct: "Correct. Organic carbon is stored in plants and animals.",
            incorrect: "Not correct. This label refers to carbon in living matter."
        },
        "btn-animal-respiration": {
            label: "Animal respiration",
            correct: "Well done. Animals release carbon dioxide during respiration.",
            incorrect: "Try again. This process happens in animals, not plants or soil."
        },
        "btn-auto-factory": {
            label: "Auto and factory emissions",
            correct: "Correct. Vehicles and factories release carbon dioxide into the air.",
            incorrect: "Not correct. This label shows human activities, not natural processes."
        },
        "btn-decay-organisms": {
            label: "Decay organisms",
            correct: "Well done. Decomposers break down dead matter and release carbon.",
            incorrect: "Try again. This process happens after organisms die."
        },
        "btn-root-respiration": {
            label: "Root respiration",
            correct: "Correct. Roots also respire and release carbon dioxide into the soil.",
            incorrect: "Not correct. This process is related to plant roots, not leaves."
        },
        "btn-dead-organisms": {
            label: "Dead organisms and waste products",
            correct: "Well done. Dead matter and waste store carbon before decomposition.",
            incorrect: "Try again. This label does not represent living organisms."
        }
    };

    // Button colors
    const COLOR_DEFAULT = "#01E8C3";
    const COLOR_CORRECT = "#01E8C3"; // stays same teal
    const COLOR_INCORRECT = "#ff90ae"; // pink for wrong

    const allZoneIds = Object.values(correctMap);
    const draggableIds = Object.keys(correctMap);

    // State
    let draggedElement = null;
    let offset = { x: 0, y: 0 };
    let originalPositions = {};
    let isLocked = false;
    let pendingIncorrectBtn = null;

    // Modal elements
    const backdrop = document.getElementById("modal-backdrop");
    const modalFO = document.getElementById("feedback-modal-fo");
    const modalIconOuter = document.getElementById("modal-icon-outer");
    const modalIconInner = document.getElementById("modal-icon-inner");
    const modalIconSvg = document.getElementById("modal-icon-svg");
    const modalHeading = document.getElementById("modal-heading");
    const modalLabel = document.getElementById("modal-label");
    const modalMessage = document.getElementById("modal-message");
    const modalFooter = document.getElementById("modal-footer");
    const modalContinueBtn = document.getElementById("modal-continue-btn");
    const modalTryAgainBtn = document.getElementById("modal-tryagain-btn");

    // 2. INITIALIZATION
    draggableIds.forEach(id => {
        const fo = document.getElementById(id);
        if (!fo) return;
        originalPositions[id] = {
            x: parseFloat(fo.getAttribute("x")),
            y: parseFloat(fo.getAttribute("y"))
        };
        fo.addEventListener("mousedown", startDrag);
        fo.addEventListener("touchstart", startDrag, { passive: false });
    });

    showAnswerBtn.addEventListener("click", () => {
        if (showAnswerBtn.innerText === "Show Answer") {
            showAnswer();
            showAnswerBtn.innerText = "Hide Answer";
        } else {
            resetWidget();
        }
    });

    document.getElementById("reset-button").addEventListener("click", resetWidget);

    // Modal button handlers
    modalContinueBtn.addEventListener("click", () => {
        hideModal();
    });

    modalTryAgainBtn.addEventListener("click", () => {
    hideModal();

    if (pendingIncorrectBtn) {
        snapToOriginal(pendingIncorrectBtn);  
        setButtonColor(pendingIncorrectBtn, COLOR_DEFAULT); 
        removeStatusIcon(pendingIncorrectBtn.id); 
    }

    pendingIncorrectBtn = null;
    isLocked = false; 
});
    // 3. COORDINATE HELPER
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

    // 4. BUTTON COLOR HELPER
    // Changes the background of the div inside the foreignObject
    function setButtonColor(fo, color) {
        const div = fo.querySelector("div");
        if (div) div.style.background = color;
    }

    // 5. DRAG HANDLERS
    function startDrag(evt) {
        if (isLocked) return;
        evt.preventDefault();

        const fo = evt.currentTarget;
        if (!draggableIds.includes(fo.id)) return;
        if (isButtonCorrectlyPlaced(fo)) return;

        draggedElement = fo;
        draggedElement.style.cursor = "grabbing";
        svg.appendChild(draggedElement);
        removeStatusIcon(draggedElement.id);

        const coord = getMousePosition(evt);
        offset.x = coord.x - parseFloat(draggedElement.getAttribute("x"));
        offset.y = coord.y - parseFloat(draggedElement.getAttribute("y"));

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);
        document.addEventListener("touchmove", drag, { passive: false });
        document.addEventListener("touchend", endDrag);
    }

    function drag(evt) {
        if (!draggedElement) return;
        evt.preventDefault();
        const coord = getMousePosition(evt);
        draggedElement.setAttribute("x", coord.x - offset.x);
        draggedElement.setAttribute("y", coord.y - offset.y);
    }

    function endDrag() {
        if (!draggedElement) return;

        const el = draggedElement;
        el.style.cursor = "grab";

        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", endDrag);
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("touchend", endDrag);

        draggedElement = null;

        const dropZoneId = getIntersectingZone(el);

        if (dropZoneId) {
            if (isZoneOccupied(dropZoneId, el.id)) {
                snapToOriginal(el);
            } else {
                const isCorrect = correctMap[el.id] === dropZoneId;
                snapToZone(el, dropZoneId);
                setButtonColor(el, isCorrect ? COLOR_CORRECT : COLOR_INCORRECT);
                showStatusIcon(el, isCorrect);
                showModal(el.id, isCorrect);
            }
        } else {
            snapToOriginal(el);
        }
    }

    // 6. GEOMETRY & ZONE DETECTION
    function getFOBounds(fo) {
        return {
            x: parseFloat(fo.getAttribute("x")),
            y: parseFloat(fo.getAttribute("y")),
            w: parseFloat(fo.getAttribute("width")),
            h: parseFloat(fo.getAttribute("height"))
        };
    }

    function getIntersectingZone(fo) {
        const b = getFOBounds(fo);
        const centerX = b.x + b.w / 2;
        const centerY = b.y + b.h / 2;

        for (const zoneId of allZoneIds) {
            const zone = document.getElementById(zoneId);
            if (!zone) continue;
            const zBox = zone.getBBox();
            if (centerX >= zBox.x - 20 && centerX <= zBox.x + zBox.width + 20 &&
                centerY >= zBox.y - 20 && centerY <= zBox.y + zBox.height + 20) {
                return zoneId;
            }
        }
        return null;
    }

    function isZoneOccupied(zoneId, currentId) {
        for (const id of draggableIds) {
            if (id === currentId) continue;
            const fo = document.getElementById(id);
            if (getIntersectingZone(fo) === zoneId) return true;
        }
        return false;
    }

    function isButtonCorrectlyPlaced(fo) {
        const zoneId = getIntersectingZone(fo);
        return zoneId && correctMap[fo.id] === zoneId;
    }

    // 7. SNAPPING
    function snapToZone(fo, zoneId) {
        const zone = document.getElementById(zoneId);
        const zBox = zone.getBBox();
        const b = getFOBounds(fo);
        fo.setAttribute("x", zBox.x + (zBox.width - b.w) / 2);
        fo.setAttribute("y", zBox.y + (zBox.height - b.h) / 2);
    }

    function snapToOriginal(fo) {
        const orig = originalPositions[fo.id];
        fo.setAttribute("x", orig.x);
        fo.setAttribute("y", orig.y);
    }

    // 8. SHOW / HIDE ANSWER & RESET
    function showAnswer() {
        resetWidget(false);
        isLocked = true;
        draggableIds.forEach(id => {
            const fo = document.getElementById(id);
            snapToZone(fo, correctMap[id]);
            setButtonColor(fo, COLOR_CORRECT);
            showStatusIcon(fo, true);
            fo.style.cursor = "default";
        });
    }

    function resetWidget(clearIcons = true) {
        showAnswerBtn.innerText = "Show Answer";
        isLocked = false;
        hideModal();
        pendingIncorrectBtn = null;

        if (clearIcons) {
            document.querySelectorAll(".status-icon").forEach(el => el.remove());
        }
        draggableIds.forEach(id => {
            const fo = document.getElementById(id);
            snapToOriginal(fo);
            setButtonColor(fo, COLOR_DEFAULT);
            fo.style.cursor = "grab";
        });
    }

    // 9. MODAL
    function showModal(btnId, isCorrect) {
        const fb = feedback[btnId];
        if (!fb) return;

        pendingIncorrectBtn = isCorrect ? null : document.getElementById(btnId);
        if(!isCorrect) isLocked = true;

        const GREEN = "#2ECC71";
        const RED = "#e53935";
        const color = isCorrect ? GREEN : RED;
        const outerAlpha = isCorrect ? "rgba(46,204,113,0.18)" : "rgba(229,57,53,0.15)";

        // Icon outer ring
        modalIconOuter.style.background = outerAlpha;
        // Icon inner circle
        modalIconInner.style.background = color;
        // Icon SVG content
        if (isCorrect) {
            modalIconSvg.innerHTML = `<path d="M7 16.5L13 22.5L25 10" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
        } else {
            modalIconSvg.innerHTML = `
                <line x1="9" y1="9" x2="23" y2="23" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="23" y1="9" x2="9" y2="23" stroke="white" stroke-width="3.5" stroke-linecap="round"/>`;
        }

        // Heading
        modalHeading.style.color = color;
        modalHeading.textContent = isCorrect ? "Correct" : "Incorrect";

        // Content
        modalLabel.textContent = fb.label;
        modalMessage.textContent = isCorrect ? fb.correct : fb.incorrect;

        // Footer
        modalFooter.style.background = color;

        // Show correct button, hide other
        if (isCorrect) {
            modalContinueBtn.style.display = "block";
            modalTryAgainBtn.style.display = "none";
        } else {
            modalContinueBtn.style.display = "none";
            modalTryAgainBtn.style.display = "block";
        }

        // Center modal in the diagram area
        modalFO.setAttribute("x", "700");
        modalFO.setAttribute("y", "330");



        // Show backdrop first, then modal on top
        // backdrop.style.display = "block";
        svg.appendChild(backdrop);
        modalFO.style.display = "block";
        svg.appendChild(modalFO);
    }

    function hideModal() {
        modalFO.style.display = "none";
        backdrop.style.display = "none";
    }

    // 10. STATUS ICONS
    function showStatusIcon(fo, isCorrect) {
        removeStatusIcon(fo.id);

        const iconGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        iconGroup.setAttribute("class", "status-icon");
        iconGroup.setAttribute("id", "icon-" + fo.id);

        const x = parseFloat(fo.getAttribute("x"));
        const y = parseFloat(fo.getAttribute("y"));
        const w = parseFloat(fo.getAttribute("width"));
        const size = 40;
        const ix = x + w - size + 14;
        const iy = y - 14;

        const fobj = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fobj.setAttribute("x", ix);
        fobj.setAttribute("y", iy);
        fobj.setAttribute("width", size);
        fobj.setAttribute("height", size);

        if (isCorrect) {
            fobj.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${size}px;height:${size}px;border-radius:50%;background:#2ECC71;display:flex;align-items:center;justify-content:center;">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><path d="M7 16.5L13 22.5L25 10" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>`;
        } else {
            fobj.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${size}px;height:${size}px;background:#e53935;border-radius:50%;display:flex;align-items:center;justify-content:center;">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <line x1="9" y1="9" x2="23" y2="23" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="23" y1="9" x2="9" y2="23" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
              </svg>
            </div>`;
        }

        iconGroup.appendChild(fobj);
        svg.appendChild(iconGroup);
    }

    function removeStatusIcon(btnId) {
        const icon = document.getElementById("icon-" + btnId);
        if (icon) icon.remove();
    }

    const deadOrganismBtn = document.getElementById("btn-dead-organisms");
    console.log("Dead Organism Button:", deadOrganismBtn);
    
});
