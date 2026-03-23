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
        { id: "Copper_Cu_1", label: "Copper (Cu)", symbol: "Cu", file: "copper-ml.json" },
        { id: "Zink_Zn_", label: "Zinc (Zn)", symbol: "Zn", file: "Zink-ml.json" },
        { id: "Tin_Sn_", label: "Tin (Sn)", symbol: "Sn", file: "Tin-ml.json" },
        { id: "Nickel_Ni_", label: "Nickel (Ni)", symbol: "Ni", file: "Nickel-Ml.json" },
        { id: "Silver_Ag_", label: "Silver (Ag)", symbol: "Ag", file: "Silver-Ml.json" },
        { id: "Gold_Au_", label: "Gold (Au)", symbol: "Au", file: "Gold-Ml.json" }
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
    let originalPositions = {};
    let correctCount = 0;
    let electrolysisStarted = false;

    // Elements
    const startBtn = document.getElementById("Group_3");
    const resetBtn = document.getElementById("Group_4");
    const showAnswerBtn = document.getElementById("Group_716");
    const insightBtn = document.getElementById("Button_Insite_");
    const insightCloseBtn = document.getElementById("Group_1331");

    // Layers
    const Layer2Labels = document.getElementById("Layer_2");
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
    setVisibility(Layer2Labels, false); // Hidden by default, these are "correct" pre-mapped text layers 

    function setBtnEnabled(btn, enabled) {
        btn.style.opacity = enabled ? "1" : "0.5";
        btn.style.cursor = enabled ? "pointer" : "default";
        btn.style.pointerEvents = enabled ? "auto" : "none";
    }

    setBtnEnabled(startBtn, false);
    setBtnEnabled(resetBtn, false);

    // 2. SETUP DRAGGABLES
    draggableIds.forEach(id => {
        const fo = document.getElementById(id);
        if (!fo) return;
        originalPositions[id] = {
            transform: fo.getAttribute("transform") || "translate(0,0)"
        };
        fo.style.cursor = "grab";
        fo.dataset.snapped = "false";

        fo.addEventListener("mousedown", startDrag);
        fo.addEventListener("touchstart", startDrag, { passive: false });
    });

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
            // Dim draggables slightly when placed correctly to indicate locked status
            el.style.opacity = "0.9";

            correctCount++;
            countText.textContent = `${correctCount}/7`;
            if (correctCount === 7) {
                setBtnEnabled(startBtn, true);
                setBtnEnabled(resetBtn, true);
            }
        } else {
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
        // Since getBBox returns pre-transform bounding rect for group,
        // Calculate the required translation to center inside the zone's base coordinates
        const dx = zBox.x - elBox.x + (zBox.width - elBox.width) / 2;
        const dy = zBox.y - elBox.y + (zBox.height - elBox.height) / 2;
        el.setAttribute("transform", `translate(${dx}, ${dy})`);
    }

    function snapToOriginal(el) {
        el.setAttribute("transform", originalPositions[el.id].transform);
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
            hitbox.style.fill = "transparent"; // Hitbox rects

            hitbox.addEventListener("click", (e) => {
                e.stopPropagation();
                currentMetal = metal;
                DropdownSelectionText.textContent = metal.label;
                setVisibility(dropdownBase, false);
                setVisibility(hilight, false);
                setVisibility(dropDownGroup, false);

                // Keep the duplicate Copper inside dropdown synced if any
                const copper2 = document.querySelector("#Copper_Cu_2 tspan");
                if (copper2) copper2.textContent = metal.label;

                // Update metal symbols
                symbolGroups.forEach(id => {
                    const el = document.querySelector(`#${id} tspan`);
                    if (el) el.textContent = metal.symbol;
                });

                if (metalAnim) metalAnim.destroy();
                if (metalAnimAns) metalAnimAns.destroy();
                setupAnimations();
            });

            // Basic hover effect for dropdown items
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
        fo.appendChild(div);

        const beforeSibling = appendBeforeId ? document.getElementById(appendBeforeId) : parent.firstChild;
        parent.insertBefore(fo, beforeSibling);
        return div;
    }

    // Lottie positioning over the beaker Area
    // Append currentContainer BEFORE the battery switch but AFTER the wire (z-indexing)
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
            container: metalContainer, renderer: 'svg', loop: true, autoplay: false, path: `assets/animation/${currentMetal.file}`
        });
        metalAnimAns = lottie.loadAnimation({
            container: metalAnsCont, renderer: 'svg', loop: true, autoplay: true, path: `assets/animation/${currentMetal.file}`
        });
    }

    setupAnimations();

    // Initialize default metal symbols
    symbolGroups.forEach(id => {
        const el = document.querySelector(`#${id} tspan`);
        if (el) el.textContent = currentMetal.symbol;
    });

    // Electrode transformation transition config
    [anodeRect, cathodeRect, anodeRectAns, cathodeRectAns].forEach(el => {
        if (el) {
            el.style.transformBox = "fill-box";
            el.style.transformOrigin = "center";
            el.style.transition = "transform 10s linear";
        }
    });

    function transformElectrodes(play) {
        if (play) {
            // Anode dissolves
            anodeRect.style.transform = `translateX(15px) scaleX(0.4)`;
            anodeRectAns.style.transform = `translateX(15px) scaleX(0.4)`;
            // Cathode deposits 
            cathodeRect.style.transform = `translateX(-15px) scaleX(1.6)`;
            cathodeRectAns.style.transform = `translateX(-15px) scaleX(1.6)`;
        } else {
            anodeRect.style.transform = `none`;
            anodeRectAns.style.transform = `none`;
            cathodeRect.style.transform = `none`;
            cathodeRectAns.style.transform = `none`;
        }
    }

    // 5. BUTTON CLICKS
    startBtn.addEventListener("click", () => {
        if (correctCount < 7) return;
        electrolysisStarted = true;


        setBtnEnabled(startBtn, false);

        setVisibility(offSwitch, false);
        setVisibility(onSwitch, true);

        currentFlowAnim.play();
        metalAnim.play();

        transformElectrodes(true);
        // Disable interactions over dropdown during electrolysis
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
        transformElectrodes(false);

        selectMetalDropdown.style.pointerEvents = "auto";

        draggableIds.forEach(id => {
            const fo = document.getElementById(id);
            snapToOriginal(fo);
            fo.dataset.snapped = "false";
            fo.style.cursor = "grab";
            fo.style.opacity = "1";
        });
    });

    // Show Answer Toggle
    showAnswerBtn.style.cursor = "pointer";
    showAnswerBtn.addEventListener("click", () => {
        setVisibility(showAnswerTint, true);
        setVisibility(showAnswerLayer, true);

        // Play the answer layer animations immediately when opened
        setVisibility(onSwitchAns, true);
        transformElectrodes(true);
    });

    // Close Show Answer
    document.getElementById("Group_1622")?.addEventListener("click", () => {
        setVisibility(showAnswerTint, false);
        setVisibility(showAnswerLayer, false);

        // Hide answer layer state resets
        setVisibility(onSwitchAns, false);
        if (!electrolysisStarted) transformElectrodes(false);
    });

    // Insights Modal
    insightBtn.style.cursor = "pointer";
    insightBtn.addEventListener("click", () => {
        setVisibility(insightsTint, true);
        setVisibility(insightsLayer, true);
    });

    // Close Insights Modal
    insightCloseBtn.style.cursor = "pointer";
    insightCloseBtn.addEventListener("click", () => {
        setVisibility(insightsTint, false);
        setVisibility(insightsLayer, false);
    });

});