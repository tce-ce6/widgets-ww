document.addEventListener("DOMContentLoaded", () => {
    const svg = document.querySelector("svg");

    // 1. CONFIGURATION
    const draggableIds = [
        "Group_610", // Battery/Key 
        "Group_611", // Cathode (-)
        "Group_612", // Pure Metal
        "Group_614", // Anode (+)
        "Group_615", // Impure Metal
        "Group_616", // Electrolyte Solution
        "Group_613"  // Anode Mud
    ];

    const correctMap = {
        "Group_610": "Group_627",
        "Group_611": "Group_628",
        "Group_612": "Group_629",
        "Group_614": "Group_630",
        "Group_615": "Group_631",
        "Group_616": "Group_632",
        "Group_613": "Group_633"
    };

    const metals = [
        { id: "Copper_Cu_1", label: "Copper (Cu)", symbol: "Cu", file: "copper-ml.json", barId: "copper" },
        { id: "Zink_Zn_",    label: "Zinc (Zn)",   symbol: "Zn", file: "Zink-ml.json",   barId: "zink"   },
        { id: "Tin_Sn_",     label: "Tin (Sn)",    symbol: "Sn", file: "Tin-ml.json",    barId: "tin"    },
        { id: "Nickel_Ni_",  label: "Nickel (Ni)", symbol: "Ni", file: "Nickel-Ml.json", barId: "nikel"  },
        { id: "Silver_Ag_",  label: "Silver (Ag)", symbol: "Ag", file: "Silver-Ml.json", barId: "silver" },
        { id: "Gold_Au_",    label: "Gold (Au)",   symbol: "Au", file: "Gold-Ml.json",   barId: "gold"   }
    ];

    const dropdownHitboxes = [
        "Rectangle_257",
        "Rectangle_2571",
        "Rectangle_2572",
        "Rectangle_2573",
        "Rectangle_2574",
        "Rectangle_2575",
    ];

    // State
    let currentMetal = metals[0];
    let draggedElement = null;
    let offset = { x: 0, y: 0 };
    let correctCount = 0;
    let electrolysisStarted = false;

    // Slot-based positioning:
    //   slots[]      — fixed panel positions captured once from getBBox() at page load (never mutated)
    //   elementHome  — maps id → natural {cx, cy} centre from getBBox() (used to compute translate offsets)
    //   activeSlot   — maps id → the slot {cx, cy} the element is currently assigned to
    const slots = [];
    const elementHome = {};
    const activeSlot = {};

    // Elements
    const startBtn = document.getElementById("Group_3");
    const resetBtn = document.getElementById("Group_4");
    const showAnswerBtn = document.getElementById("Group_716");
    const insightBtn = document.getElementById("Button_Insite_");
    const insightCloseBtn = document.getElementById("Group_1331");

    // Layers
    const Layer2Labels = document.getElementById("Layer_2");
    const Layer4 = document.getElementById("Layer_4");
    const insightsLayer = document.getElementById("insights");
    const showAnswerLayer = document.getElementById("show_answer");
    const selectMetalDropdown = document.getElementById("select_metal");
    const dropdownBase = document.getElementById("dropdown_base");
    const hilight = document.getElementById("hilight");
    const dropDownGroup = document.getElementById("drop_down");
    const offSwitch = document.getElementById("Group_609");
    const onSwitch = document.getElementById("on_switch");
    const onSwitchAns = document.getElementById("Group_6091");
    const countText = document.querySelector("#_0_7 tspan");
    const Layer5 = document.getElementById("Layer_5"); // ADD THIS LINE
    // Modal Background Tints
    const showAnswerTint = document.getElementById("for-show-answer");
    const insightsTint = document.getElementById("for-insights-answer");

    // Metal Active Selected Label Text
    const DropdownSelectionText = document.querySelector("#Copper_Cu_ tspan");

    // Symbols to update for metal type
    const symbolGroups = ["Au", "Au-2", "Au-3", "Au-4", "Au-5", "Au1", "Au-21", "Au-31", "Au-41", "Au-51"];

    // Electrodes
    const cathodeRect = document.getElementById("Rectangle_236");
    const anodeRect = document.getElementById("Rectangle_237");
    const cathodeRectAns = document.getElementById("Rectangle_2361");
    const anodeRectAns = document.getElementById("Rectangle_2371");

    // Lottie
    let currentFlowAnim = null, currentFlowAnimAns = null;
    let metalAnim = null, metalAnimAns = null;

    // Visibility Setup
    const setVisibility = (el, show) => { if (el) el.style.display = show ? "block" : "none"; };

    // Show only the bar for the currently selected metal, hide all others
    function setMetalBar(metal) {
        metals.forEach(m => {
            const bar = document.getElementById(m.barId);
            if (bar) bar.style.display = (m.barId === metal.barId) ? "block" : "none";
        });
    }

    // Hide default items
    setVisibility(insightsLayer, false);
    setVisibility(showAnswerLayer, false);
    setVisibility(showAnswerTint, false);
    setVisibility(insightsTint, false);
    setVisibility(dropdownBase, false);
    setVisibility(hilight, false);
    setVisibility(dropDownGroup, false);
    setVisibility(onSwitch, false);
    setVisibility(onSwitchAns, false);
    setVisibility(Layer2Labels, false);

    // Show copper bar on load, hide all others
    setMetalBar(currentMetal);

    function setBtnEnabled(btn, enabled) {
        btn.style.opacity = enabled ? "1" : "0.5";
        btn.style.cursor = enabled ? "pointer" : "default";
        btn.style.pointerEvents = enabled ? "auto" : "none";
    }

    setBtnEnabled(startBtn, false);
    setBtnEnabled(resetBtn, false);

    // Helper function to enable all buttons (temporary for testing)
    function enableAllButtons() {
        setBtnEnabled(startBtn, true);
        setBtnEnabled(resetBtn, true);
        if (showAnswerBtn) setBtnEnabled(showAnswerBtn, true);
        if (insightBtn) setBtnEnabled(insightBtn, true);
        if (insightCloseBtn) setBtnEnabled(insightCloseBtn, true);
        console.log("✓ All available buttons enabled!");
    }

    // Make function globally accessible from console
    window.enableAllButtons = enableAllButtons;

    // 2. SETUP DRAGGABLES
    // Capture the natural centre of every draggable element (before any transform is applied)
    // and register those centres as the fixed panel slots.
    draggableIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        // getBBox() returns coordinates in the element's local SVG space before any CSS transform.
        // Because these groups have no transform attribute, this is their true panel position.
        const box = el.getBBox();
        const cx = box.x + box.width  / 2;
        const cy = box.y + box.height / 2;

        elementHome[id] = { cx, cy };   // remember the natural centre (fixed, never changes)
        slots.push({ cx, cy });          // register as a droppable panel slot
        activeSlot[id] = { cx, cy };    // initially each element occupies its own slot

        el.style.cursor = "grab";
        el.dataset.snapped = "false";

        el.addEventListener("mousedown", startDrag);
        el.addEventListener("touchstart", startDrag, { passive: false });
    });

    // Shuffle all draggables into randomized panel slots.
    // animate=false on page load (instant), animate=true on reset (smooth slide).
    function shuffleDraggables(animate) {
        const shuffledSlots = [...slots];
        for (let i = shuffledSlots.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSlots[i], shuffledSlots[j]] = [shuffledSlots[j], shuffledSlots[i]];
        }
        draggableIds.forEach((id, index) => {
            const el = document.getElementById(id);
            if (!el) return;
            activeSlot[id] = shuffledSlots[index];
            if (animate) {
                el.style.transition = "transform 0.5s ease-in-out";
                el.addEventListener("transitionend", function clearTr() {
                    el.style.transition = "none";
                    el.removeEventListener("transitionend", clearTr);
                });
            } else {
                el.style.transition = "none";
            }
            moveToSlot(el, activeSlot[id]);
        });
    }

    // Randomize positions immediately on page load (no animation)
    shuffleDraggables(false);

    function getMousePosition(evt) {
        const CTM = svg.getScreenCTM();
        let clientX = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientX : evt.clientX;
        let clientY = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientY : evt.clientY;
        return {
            x: (clientX - CTM.e) / CTM.a,
            y: (clientY - CTM.f) / CTM.d
        };
    }

    function parseTransform(transformStr) {
        if (!transformStr) return { x: 0, y: 0 };
        const m = transformStr.match(/translate\(([^,]+)[ ,]+([^)]+)\)/);
        if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
        return { x: 0, y: 0 };
    }

    function startDrag(evt) {
        if (evt.currentTarget.dataset.snapped === "true" || electrolysisStarted) return;
        evt.preventDefault();

        draggedElement = evt.currentTarget;
        
        // Disable transition during active drag for smooth movement
        draggedElement.style.transition = "none";
        
        draggedElement.style.cursor = "grabbing";
        draggedElement.parentNode.appendChild(draggedElement);

        const coord = getMousePosition(evt);
        let t = parseTransform(draggedElement.getAttribute("transform"));

        offset.x = coord.x - t.x;
        offset.y = coord.y - t.y;

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);
        document.addEventListener("touchmove", drag, { passive: false });
        document.addEventListener("touchend", endDrag);
    }

    function drag(evt) {
        if (!draggedElement) return;
        evt.preventDefault();
        const coord = getMousePosition(evt);
        draggedElement.setAttribute("transform", `translate(${coord.x - offset.x}, ${coord.y - offset.y})`);
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

        const zoneId = getIntersectingZone(el);
        if (zoneId && correctMap[el.id] === zoneId) {
            snapToZone(el, zoneId);
            el.dataset.snapped = "true";
            el.style.cursor = "default";
            el.style.opacity = "0.9";

            correctCount++;
            countText.textContent = `${correctCount}/7`;
            if (correctCount === 7) {
                setBtnEnabled(startBtn, true);
                setBtnEnabled(resetBtn, true);
            }
        } else {
            // Smooth glide back to its designated panel position
            el.style.transition = "transform 0.3s ease-out";
            snapToOriginal(el);
        }
    }

    function getIntersectingZone(el) {
        const bbox = el.getBoundingClientRect();
        const cx = bbox.left + bbox.width / 2;
        const cy = bbox.top + bbox.height / 2;

        for (const [draggableId, zoneId] of Object.entries(correctMap)) {
            const zone = document.getElementById(zoneId);
            if (!zone) continue;
            const zBox = zone.getBoundingClientRect();
            if (cx >= zBox.left && cx <= zBox.right && cy >= zBox.top && cy <= zBox.bottom) {
                return zoneId;
            }
        }
        return null;
    }

    function snapToZone(el, zoneId) {
        const zone = document.getElementById(zoneId);
        const zBox = zone.getBBox();
        const elBox = el.getBBox();
        const dx = zBox.x - elBox.x + (zBox.width - elBox.width) / 2;
        const dy = zBox.y - elBox.y + (zBox.height - elBox.height) / 2;
        el.setAttribute("transform", `translate(${dx}, ${dy})`);
    }

    // Move element so its centre lands on the given slot centre.
    // The translate offset is: slot_centre - element's natural (untransformed) centre.
    function moveToSlot(el, slot) {
        const home = elementHome[el.id];
        const dx = slot.cx - home.cx;
        const dy = slot.cy - home.cy;
        el.setAttribute("transform", `translate(${dx}, ${dy})`);
    }

    function snapToOriginal(el) {
        moveToSlot(el, activeSlot[el.id]);
    }

    // 3. DROPDOWN
    selectMetalDropdown.style.cursor = "pointer";
    selectMetalDropdown.addEventListener("click", () => {
        const isVisible = dropdownBase.style.display === "block";
        setVisibility(dropdownBase, !isVisible);
        setVisibility(hilight, !isVisible);
        setVisibility(dropDownGroup, !isVisible);
    });

    metals.forEach((metal, idx) => {
        const hitbox = document.getElementById(dropdownHitboxes[idx]);
        const textNode = document.getElementById(metal.id);
        if (textNode) textNode.style.pointerEvents = "none";

        if (hitbox) {
            hitbox.style.cursor = "pointer";
            hitbox.style.fill = "transparent";

            hitbox.addEventListener("click", (e) => {
                e.stopPropagation();
                currentMetal = metal;
                DropdownSelectionText.textContent = metal.label;
                setVisibility(dropdownBase, false);
                setVisibility(hilight, false);
                setVisibility(dropDownGroup, false);

                // Reset electrolysis state when changing metal
                electrolysisStarted = false;
                correctCount = 0;
                countText.textContent = `0/7`;

                // Swap the visible metal bar
                setMetalBar(metal);

                const copper2 = document.querySelector("#Copper_Cu_2 tspan");
                if (copper2) copper2.textContent = metal.label;

                symbolGroups.forEach(id => {
                    const el = document.querySelector(`#${id} tspan`);
                    if (el) el.textContent = metal.symbol;
                });

                // Stop animations and reset states
                if (currentFlowAnim) currentFlowAnim.stop();
                if (metalAnim) {
                    metalAnim.stop();
                    metalAnim.destroy();
                }
                if (metalAnimAns) metalAnimAns.destroy();
                animateIons(false);
                
                // Reset button states
                setBtnEnabled(startBtn, false);
                setBtnEnabled(resetBtn, false);
                setVisibility(offSwitch, true);
                setVisibility(onSwitch, false);
                selectMetalDropdown.style.pointerEvents = "auto";
                
                // Reset draggables to be draggable again
                draggableIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.dataset.snapped = "false";
                        el.style.opacity = "1";
                        el.style.cursor = "grab";
                    }
                });
                
                // Shuffle the draggables with animation
                shuffleDraggables(true);
                
                // setupAnimations();
            });

            hitbox.addEventListener("mouseenter", () => hitbox.style.fill = "rgba(0,0,0,0.05)");
            hitbox.addEventListener("mouseleave", () => hitbox.style.fill = "transparent");
        }
    });

    // 4. LOTTIE ANIMATIONS & CONTAINERS
    function createForeignObject(x, y, w, h, parent, appendBeforeId = null) {
        const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fo.setAttribute("x", x);
        fo.setAttribute("y", y);
        fo.setAttribute("width", w);
        fo.setAttribute("height", h);
        const div = document.createElement("div");
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.pointerEvents = "none";  // Prevent interference with dragging
        fo.appendChild(div);

        const beforeSibling = appendBeforeId ? document.getElementById(appendBeforeId) : parent.firstChild;
        parent.insertBefore(fo, beforeSibling);
        return div;
    }

    const currentContainer = createForeignObject("1133", "238", "430", "260", document.getElementById("Group_624"), "Group_595");
    const metalContainer = createForeignObject("1190", "550", "240", "190", document.getElementById("Layer_2").parentNode, "drop_here");

    const currentAnsCont = createForeignObject("748", "262", "430", "260", document.getElementById("Group_6241"), "Group_5951");
    const metalAnsCont = createForeignObject("806", "572", "240", "190", showAnswerLayer, "Group_4141");

    function setupAnimations() {
        if (!currentFlowAnim) {
            currentFlowAnim = lottie.loadAnimation({
                container: currentContainer, renderer: 'svg', loop: true, autoplay: false, path: 'assets/animation/Current-flow.json'
            });
            currentFlowAnimAns = lottie.loadAnimation({
                container: currentAnsCont, renderer: 'svg', loop: true, autoplay: true, path: 'assets/animation/Current-flow.json'
            });
        }

        metalAnim = lottie.loadAnimation({
            container: metalContainer, renderer: 'svg', loop: false, autoplay: false, path: `assets/animation/${currentMetal.file}`
        });
        metalAnimAns = lottie.loadAnimation({
            container: metalAnsCont, renderer: 'svg', loop: false, autoplay: true, path: `assets/animation/${currentMetal.file}`
        });
        
        // Setup continuous loop for answer layer
        metalAnimAns.addEventListener("complete", () => {
            metalAnimAns.goToAndPlay(0);
        });
    }

    setupAnimations();

    symbolGroups.forEach(id => {
        const el = document.querySelector(`#${id} tspan`);
        if (el) el.textContent = currentMetal.symbol;
    });

    [anodeRect, cathodeRect, anodeRectAns, cathodeRectAns].forEach(el => {
        if (el) {
            el.style.transformBox = "fill-box";
            el.style.transformOrigin = "center";
            el.style.transition = "transform 10s linear";
        }
    });

    function transformElectrodes(play) {
        if (play) {
            if (anodeRect) anodeRect.style.transform = `none`;
            if (anodeRectAns) anodeRectAns.style.transform = `none`;
            if (cathodeRect) cathodeRect.style.transform = `none`;
            if (cathodeRectAns) cathodeRectAns.style.transform = `none`;
        } else {
            if (anodeRect) anodeRect.style.transform = `none`;
            if (anodeRectAns) anodeRectAns.style.transform = `none`;
            if (cathodeRect) cathodeRect.style.transform = `none`;
            if (cathodeRectAns) cathodeRectAns.style.transform = `none`;
        }
    }

    // Safe helper for getBBox when elements might be hidden
    function safeBBox(el, fallback = { x: 0, y: 0, width: 0, height: 0 }) {
        try {
            return el.getBBox();
        } catch (e) {
            return fallback;
        }
    }

    // Animation for Layer_4 - Animate each element inside individually
    // Animation for Layer_4 (Metal Ions) and Layer_5 (Solution Ions)
 // Animation for Layer_4 (Metal Ions) and Layer_5 (Solution Ions)
    let ionAnimationIds = [];

    function getLoopElapsed(startTime, cycleDuration) {
        const rawElapsed = Date.now() - startTime;
        if (rawElapsed < 0) return 0;
        return rawElapsed % cycleDuration;
    }
    
    function animateIons(play) {
        if (play) {
            // Stop any existing animations
            ionAnimationIds.forEach(id => cancelAnimationFrame(id));
            ionAnimationIds = [];
            
            // --- 1. Animate Layer 4 (Metal Ions -> Moving to Active Cathode & Depositing) ---
            if (Layer4) {
                const cations = Array.from(Layer4.children);
                
                // Find which metal bar is currently active to use as target
                // IDs match the barId from the metals array, including the existing "nikel" SVG id.
                const metalBarIds = metals.map(metal => metal.barId); 
                let activeBar = document.getElementById("Group_611"); // Fallback: default Cathode group
                
                for (let barId of metalBarIds) {
                    let bar = document.getElementById(barId);
                    // Check if the element exists and is visible
                    if (bar && window.getComputedStyle(bar).display !== "none") {
                        activeBar = bar;
                        break;
                    }
                }
                
                // Get target bounding box in SVG user space
                let targetBBox;
                try {
                    targetBBox = activeBar.getBBox();
                } catch(e) {
                    // Fallback in case the SVG is hidden during initialization
                    targetBBox = { x: 800, y: 500, width: 50, height: 400 }; 
                }

                const cycleDuration = 3500;    // Total time for one ion's journey
                const movePhase = 2500;        // Time spent moving to cathode
                const disappearPhase = 500;    // Time spent fading out (depositing)
                const resetPhase = 500;        // Invisible reset and fade back in
                
                cations.forEach((child, index) => {
                    const startTime = Date.now() + (index * 600); // Stagger animations
                    
                    // Ensure transform is clear before measuring start position
                    child.style.transform = "translate(0px, 0px)";
                    let startBBox;
                    try {
                        startBBox = child.getBBox();
                    } catch(e) {
                        startBBox = { x: 1300, y: 600, width: 40, height: 40 }; 
                    }
                    
                    // We want them to deposit along the right edge of the cathode
                    // Add a little randomness to Y so they don't all hit the exact same pixel
                    const randomYOffset = (Math.random() * targetBBox.height * 0.6) + (targetBBox.height * 0.2); 
                    const targetX = targetBBox.x + targetBBox.width;
                    const targetY = targetBBox.y + randomYOffset;
                    
                    const startX = startBBox.x + (startBBox.width / 2);
                    const startY = startBBox.y + (startBBox.height / 2);
                    
                    // Distance to travel
                    const dx = targetX - startX;
                    const dy = targetY - startY;
                    
                    function animateCation() {
                        if (!electrolysisStarted) return; // Obey global state
                        const elapsed = getLoopElapsed(startTime, cycleDuration);
                        
                        if (elapsed < movePhase) {
                            // Moving continuously towards the cathode
                            const progress = elapsed / movePhase;
                            child.style.transform = `translate(${dx * progress}px, ${dy * progress}px)`;
                            child.style.opacity = "1";
                        } else if (elapsed < movePhase + disappearPhase) {
                            // Reached the cathode -> fading out (depositing)
                            const progress = (elapsed - movePhase) / disappearPhase;
                            child.style.transform = `translate(${dx}px, ${dy}px)`;
                            child.style.opacity = Math.max(0, 1 - progress);
                        } else {
                            // Instantly snap back to start (invisible) and fade back in
                            const progress = (elapsed - movePhase - disappearPhase) / resetPhase;
                            child.style.transform = `translate(0px, 0px)`;
                            child.style.opacity = Math.min(1, progress); // Fades in creating a "new" ion
                        }
                        
                        ionAnimationIds.push(requestAnimationFrame(animateCation));
                    }
                    child.style.transition = "none";
                    animateCation();
                });
            }

            // --- 2. Animate Layer 5 (Solution Ions -> Drifting Right) ---
            // Now: each solution ion travels to the anode, disappears, then reappears at the start.
            if (Layer5) {
                const anions = Array.from(Layer5.children);
                const targetBBox = (anodeRect && safeBBox(anodeRect)) || { x: 900, y: 320, width: 80, height: 400 };
                const cycleDuration = 3200;
                const movePhase = 2200;
                const disappearPhase = 500;
                const resetPhase = 500;
                
                anions.forEach((child, index) => {
                    const startTime = Date.now() + (index * 450); 

                    child.style.transform = "translate(0px, 0px)";
                    child.style.opacity = "1";
                    const startBBox = safeBBox(child);

                    const randomYOffset = (Math.random() * targetBBox.height * 0.6) + (targetBBox.height * 0.2);
                    const targetX = targetBBox.x; // Move towards anode (left edge of anode rectangle)
                    const targetY = targetBBox.y + randomYOffset;

                    const startX = startBBox.x + (startBBox.width / 2);
                    const startY = startBBox.y + (startBBox.height / 2);

                    const dx = targetX - startX;
                    const dy = targetY - startY;
                    
                    function animateAnion() {
                        if (!electrolysisStarted) return;
                        
                        const elapsed = getLoopElapsed(startTime, cycleDuration);

                        if (elapsed < movePhase) {
                            const progress = elapsed / movePhase;
                            child.style.transform = `translate(${dx * progress}px, ${dy * progress}px)`;
                            child.style.opacity = "1";
                        } else if (elapsed < movePhase + disappearPhase) {
                            const progress = (elapsed - movePhase) / disappearPhase;
                            child.style.transform = `translate(${dx}px, ${dy}px)`;
                            child.style.opacity = Math.max(0, 1 - progress);
                        } else {
                            const progress = (elapsed - movePhase - disappearPhase) / resetPhase;
                            child.style.transform = `translate(0px, 0px)`;
                            child.style.opacity = Math.min(1, progress);
                        }
                        
                        ionAnimationIds.push(requestAnimationFrame(animateAnion));
                    }
                    child.style.transition = "none";
                    animateAnion();
                });
            }

        } else {
            // Stop all animations
            ionAnimationIds.forEach(id => cancelAnimationFrame(id));
            ionAnimationIds = [];
            
            // Reset Layer 4
            if (Layer4) {
                Array.from(Layer4.children).forEach(child => {
                    child.style.transform = `translate(0px, 0px)`;
                    child.style.opacity = "1";
                    child.style.transition = "none";
                });
            }
            
            // Reset Layer 5
            if (Layer5) {
                Array.from(Layer5.children).forEach(child => {
                    child.style.transform = `translateX(0)`;
                    child.style.opacity = "1";
                    child.style.transition = "none";
                });
            }
        }
    }

    // 5. BUTTON CLICKS
    startBtn.addEventListener("click", () => {
        if (correctCount < 7) return;
        electrolysisStarted = true;
        setBtnEnabled(startBtn, false);
        setVisibility(offSwitch, false);
        setVisibility(onSwitch, true);
        
        // Animate Layer_4 oscillation
        animateIons(true);
        
        transformElectrodes(true);
        selectMetalDropdown.style.pointerEvents = "none";
    });

    resetBtn.addEventListener("click", () => {
        if (correctCount === 0 && !electrolysisStarted) return;

        electrolysisStarted = false;
        correctCount = 0;
        countText.textContent = `0/7`;

        setBtnEnabled(startBtn, false);
        setBtnEnabled(resetBtn, false);
        setVisibility(offSwitch, true);
        setVisibility(onSwitch, false);

        currentFlowAnim.stop();
        metalAnim.stop();
        animateIons(false);
        transformElectrodes(false);
        selectMetalDropdown.style.pointerEvents = "auto";

        // --- RANDOMIZATION: shuffle slots with smooth animation ---
        shuffleDraggables(true);
    });

    if (showAnswerBtn) {
        showAnswerBtn.style.cursor = "pointer";
        showAnswerBtn.addEventListener("click", () => {
            setVisibility(showAnswerTint, true);
            setVisibility(showAnswerLayer, true);
            setVisibility(onSwitchAns, true);
            transformElectrodes(true);
        });
    }

    document.getElementById("Group_1622")?.addEventListener("click", () => {
        setVisibility(showAnswerTint, false);
        setVisibility(showAnswerLayer, false);
        setVisibility(onSwitchAns, false);
        if (!electrolysisStarted) transformElectrodes(false);
    });

    if (insightBtn) {
        insightBtn.style.cursor = "pointer";
        insightBtn.addEventListener("click", () => {
            setVisibility(insightsTint, true);
            setVisibility(insightsLayer, true);
        });
    }

    if (insightCloseBtn) {
        insightCloseBtn.style.cursor = "pointer";
        insightCloseBtn.addEventListener("click", () => {
            setVisibility(insightsTint, false);
            setVisibility(insightsLayer, false);
        });
    }
});
