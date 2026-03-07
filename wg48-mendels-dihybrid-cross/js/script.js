// js/script.js
/**
 * Mendel's Dihybrid Cross Simulator Logic
 * Widget 48
 */

const WidgetState = {
    stage: 1,
    selectedTraits: [], // max 2
    combinationId: null,

    // Drag/Drop status
    s2: { p1Dropped: false, p2Dropped: false },
    s4: { f1_1Dropped: false, f1_2Dropped: false },

    // Track cards currently being dragged
    activeDragCard: null,
    dragStartPos: { x: 0, y: 0 },
    dragCurrentPos: { x: 0, y: 0 },

    originalTransforms: new Map() // Store default positions
};

const UI = {
    stages: [],

    // Buttons
    btnNext: null,
    btnResetAll: null,
    btnReset: null,
    btnGenGametes: null,
    btnAutofillF1: null,
    btnGenF2Gametes: null,
    btnAutofillF2: null,

    // Drop Targets
    p1DropZone: null,
    p2DropZone: null,
    f1DropZone1: null,
    f1DropZone2: null,

    // Containers
    s2Base: null,
    s3Base: null,
    s4Base: null,
    s5Base: null,
    traitGroups: [],

    // Arrays for 21 combinations
    s2Cards: [],
    s3Gametes: [],
    s4Cards: [],
    s5Gametes: [],
    s5Ratios: []
};

// Map pair of trait indices (0-6) -> Combination ID (1-21)
function getCombinationId(t1, t2) {
    const min = Math.min(t1, t2);
    const max = Math.max(t1, t2);
    const map = {
        "0_1": 1, "0_2": 2, "0_3": 3, "0_4": 4, "0_5": 5, "0_6": 6,
        "1_2": 7, "1_3": 8, "1_4": 9, "1_5": 10, "1_6": 11,
        "2_3": 12, "2_4": 13, "2_5": 14, "2_6": 15,
        "3_4": 16, "3_5": 17, "3_6": 18,
        "4_5": 19, "4_6": 20,
        "5_6": 21
    };
    return map[`${min}_${max}`] || 1;
}

window.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log("initApp() - Initializing Widget 48 Dihybrid Cross");
    cacheUIElements();
    setupEventListeners();
    resetWidget();
}

function cacheUIElements() {
    UI.svg = document.querySelector('svg');

    // Stage Bases
    UI.s2Base = document.getElementById('stage2_x5F_base');
    UI.s3Base = document.getElementById('stage3_x5F_base');
    UI.s4Base = document.getElementById('stage4_x5F_base');
    UI.s5Base = document.getElementById('stage5_x5F_base');

    // Caching 21 combination groups
    for (let i = 1; i <= 21; i++) {
        UI.s2Cards.push(document.getElementById(`Stage2-_Card_${i}`));

        // Stage 3 ID format varies: stage3_x5F_Gametes01 or Gametes_01 depending on earlier parse, but it is 01,02
        const pad = String(i).padStart(2, '0');
        let s3 = document.getElementById(`stage3_x5F_Gametes${pad}`) || document.getElementById(`stage3_x5F_Gametes_${pad}`);
        UI.s3Gametes.push(s3);

        UI.s4Cards.push(document.getElementById(`Stage4-_Card_${i}`));

        // Stage 5 Gametes and Ratios
        let s5G = document.getElementById(`stage5_x5F_Gametes_${pad}`) || document.getElementById(`stage5_x5F_Gametes${pad}`);
        UI.s5Gametes.push(s5G);

        let s5R = document.getElementById(`stage5_x5F_Genotypic_Ratio_x5F_${pad}`) || document.getElementById(`stage5_x5F_Genotypic_Ratio_${pad}`);
        UI.s5Ratios.push(s5R);
    }

    // Trait Clickable Groups (Stage 1) - Extracted based on hierarchy
    const defaultCardsLayer = document.getElementById('Cards_x5F_01_x5F_Default');
    if (defaultCardsLayer) {
        // Collect immediate g children containing a rect and a text
        const groups = Array.from(defaultCardsLayer.children).filter(el => el.tagName === 'g' && el.id && el.id.startsWith('Group_'));
        UI.traitGroups = groups;
    }

    // Drop targets - using background rects behind the "Drag Parent Here" texts
    // Let's find them properly by searching for the rect before the text in the DOM or assigning manually
    // For wg48, in stage2_base, there are two distinct rects with class st235 for drop zones
    if (UI.s2Base) {
        const dropZones = UI.s2Base.querySelectorAll('rect.st235'); // Typically 2 drop zones
        if (dropZones.length >= 2) {
            UI.p1DropZone = dropZones[0];
            UI.p2DropZone = dropZones[1];
        }
    }

    // F2 drop zones in stage 4 base
    if (UI.s4Base) {
        const dropZones = UI.s4Base.querySelectorAll('rect.st235'); // Typically 2 drop zones
        if (dropZones.length >= 2) {
            UI.f1DropZone1 = dropZones[0];
            UI.f1DropZone2 = dropZones[1];
        }
    }

    // Buttons
    // Since XD nests paths and texts inside nested g, we select by obvious ids
    UI.btnNext = document.getElementById('Next') || document.querySelector('[id^="Next"]');
    UI.btnReset = document.getElementById('Reset');
    UI.btnResetAll = document.getElementById('Reset_All') || document.getElementById('Reset-2') || document.querySelector('[id^="Reset_All"]');
    UI.btnGenGametes = document.getElementById('Generate_Gametes');
    UI.btnAutofillF1 = document.getElementById('Auto-fill_F1_Punnett_Square') || document.querySelector('[id^="Auto-fill_F1"]');
    UI.btnGenF2Gametes = document.getElementById('Generate_F2_Gametes');
    UI.btnAutofillF2 = document.getElementById('Auto-fill_F2_Punnett_Square') || document.querySelector('[id^="Auto-fill_F2"]');
}

function setupEventListeners() {
    // Stage 1 Selection
    UI.traitGroups.forEach((group, idx) => {
        group.style.cursor = 'pointer';
        group.addEventListener('pointerdown', () => handleTraitSelect(idx));
    });

    // Navigation and Action Buttons
    if (UI.btnNext) {
        UI.btnNext.style.cursor = 'pointer';
        UI.btnNext.addEventListener('pointerup', handleNextClick);
    }

    if (UI.btnResetAll) {
        UI.btnResetAll.style.cursor = 'pointer';
        UI.btnResetAll.addEventListener('pointerup', resetWidget);
    }

    if (UI.btnReset) {
        UI.btnReset.style.cursor = 'pointer';
        UI.btnReset.addEventListener('pointerup', resetWidget);
    }

    if (UI.btnGenGametes) {
        UI.btnGenGametes.style.cursor = 'not-allowed'; // Disabled initially
        UI.btnGenGametes.style.opacity = '0.5';
        UI.btnGenGametes.addEventListener('pointerup', () => {
            if (WidgetState.s2.p1Dropped && WidgetState.s2.p2Dropped) {
                goToStage3();
            }
        });
    }

    if (UI.btnAutofillF1) {
        UI.btnAutofillF1.style.cursor = 'pointer';
        UI.btnAutofillF1.addEventListener('pointerup', goToStage4);
    }

    if (UI.btnGenF2Gametes) {
        UI.btnGenF2Gametes.style.cursor = 'not-allowed';
        UI.btnGenF2Gametes.style.opacity = '0.5';
        UI.btnGenF2Gametes.addEventListener('pointerup', () => {
            if (WidgetState.s4.f1_1Dropped && WidgetState.s4.f1_2Dropped) {
                goToStage5();
            }
        });
    }

    // Also attach a generic Autofill F2 if it exists
    if (UI.btnAutofillF2) {
        UI.btnAutofillF2.style.cursor = 'pointer';
        UI.btnAutofillF2.addEventListener('pointerup', () => {
            // Stage 5 already shows ratios usually, but if autofill is separate, handle logic here
            if (WidgetState.stage === 5) {
                // reveal ratios
                const s5R = UI.s5Ratios[WidgetState.combinationId - 1];
                if (s5R) showElement(s5R);
                hideElement(UI.btnAutofillF2);
            }
        });
    }

    // Global drag listener for SVG
    UI.svg.addEventListener('pointermove', onDragMove);
    UI.svg.addEventListener('pointerup', onDragEnd);
    UI.svg.addEventListener('pointerleave', onDragEnd);
}

function handleTraitSelect(idx) {
    if (WidgetState.stage !== 1) return;

    const selectedIdx = WidgetState.selectedTraits.indexOf(idx);

    if (selectedIdx !== -1) {
        // Deselect
        WidgetState.selectedTraits.splice(selectedIdx, 1);
        console.log(`handleTraitSelect() - Deselected trait index ${idx}. Current selection: `, WidgetState.selectedTraits);
    } else {
        // Select
        if (WidgetState.selectedTraits.length < 2) {
            WidgetState.selectedTraits.push(idx);
            console.log(`handleTraitSelect() - Selected trait index ${idx}. Current selection: `, WidgetState.selectedTraits);
        } else {
            console.log(`handleTraitSelect() - Maximum 2 traits reached. Cannot select index ${idx}.`);
            return;
        }
    }
    updateTraitSelectionUI();
}

function updateTraitSelectionUI() {
    UI.traitGroups.forEach((group, idx) => {
        // Use rect as a safe base style target.
        const baseBox = group.querySelector('rect');
        if (baseBox) {
            if (WidgetState.selectedTraits.includes(idx)) {
                // Highlight Selected
                baseBox.style.fill = '#e6ffca';
                baseBox.style.stroke = '#00ae06';
                baseBox.style.strokeWidth = '4px';
            } else {
                // Default
                baseBox.style.fill = '';
                baseBox.style.stroke = '';
                baseBox.style.strokeWidth = '';
            }
        }
    });
}

function handleNextClick() {
    console.log("handleNextClick() - Triggered. Current traits:", WidgetState.selectedTraits);
    if (WidgetState.stage === 1 && WidgetState.selectedTraits.length === 2) {
        WidgetState.combinationId = getCombinationId(WidgetState.selectedTraits[0], WidgetState.selectedTraits[1]);
        console.log("Combination ID matched:", WidgetState.combinationId);
        goToStage2();
    }
}

function hideElement(el) {
    if (el) el.style.display = 'none';
}

function showElement(el) {
    if (el) {
        el.style.display = 'block';
        el.classList.remove('st656'); // Fix for the removed svg BG hiding elements natively
    }
}

function makeDraggable(el, dropTargetId, callbackName) {
    if (!el) return;
    el.style.cursor = 'grab';
    el.setAttribute('data-target', dropTargetId);
    el.setAttribute('data-callback', callbackName);

    // We bind pointerdown to the group itself
    el.addEventListener('pointerdown', onDragStart);

    // Save initial transform
    if (!WidgetState.originalTransforms.has(el)) {
        WidgetState.originalTransforms.set(el, el.getAttribute('transform') || '');
    }
}

function resetDraggable(el) {
    if (!el) return;
    el.style.pointerEvents = '';
    const orig = WidgetState.originalTransforms.get(el);
    if (orig !== undefined) {
        el.setAttribute('transform', orig);
    }
}

function setupDraggablesForStage2() {
    const s2Card = UI.s2Cards[WidgetState.combinationId - 1];
    if (!s2Card) return;

    // Draggable groups are typically the highest level <g> with a large rect
    const possibleDrags = Array.from(s2Card.children).filter(el => el.tagName === 'g');

    // Assuming there are 2 standard parents (P1, P2)
    // Left card generally first, Right card second
    if (possibleDrags.length >= 2) {
        makeDraggable(possibleDrags[0], 'p1Drop', 's2DropLogicP1');
        makeDraggable(possibleDrags[1], 'p2Drop', 's2DropLogicP2');
    }
}

function setupDraggablesForStage4() {
    const s4Card = UI.s4Cards[WidgetState.combinationId - 1];
    if (!s4Card) return;

    const possibleDrags = Array.from(s4Card.children).filter(el => el.tagName === 'g');

    // Assuming F1_1 and F1_2
    if (possibleDrags.length >= 2) {
        makeDraggable(possibleDrags[0], 'f1Drop1', 's4DropLogicF1');
        makeDraggable(possibleDrags[1], 'f1Drop2', 's4DropLogicF2');
    }
}

/* --------------- DRAG & DROP ENGINE --------------- */

function onDragStart(e) {
    e.preventDefault();
    if (WidgetState.activeDragCard) return;

    WidgetState.activeDragCard = e.currentTarget;
    WidgetState.activeDragCard.style.cursor = 'grabbing';

    // Move to front mapping
    WidgetState.activeDragCard.parentNode.appendChild(WidgetState.activeDragCard);

    // Get CTM
    let pt = UI.svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    // Parse existing transform translate
    let ctm = WidgetState.activeDragCard.getCTM();
    let parentCtm = WidgetState.activeDragCard.parentNode.getCTM();

    let svgPt = pt.matrixTransform(parentCtm.inverse());

    WidgetState.dragStartPos = {
        x: svgPt.x,
        y: svgPt.y
    };

    // Calculate current transform offset
    const transformStr = WidgetState.activeDragCard.getAttribute('transform') || '';
    const translateMatch = transformStr.match(/translate\(([^,]+)[,\s]([^)]+)\)/);

    WidgetState.dragCurrentPos = {
        x: translateMatch ? parseFloat(translateMatch[1]) : 0,
        y: translateMatch ? parseFloat(translateMatch[2]) : 0
    };

    WidgetState.activeDragCard.setAttribute('pointer-events', 'none');
}

function onDragMove(e) {
    if (!WidgetState.activeDragCard) return;

    let pt = UI.svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    let parentCtm = WidgetState.activeDragCard.parentNode.getCTM();
    let svgPt = pt.matrixTransform(parentCtm.inverse());

    let dx = svgPt.x - WidgetState.dragStartPos.x;
    let dy = svgPt.y - WidgetState.dragStartPos.y;

    let newX = WidgetState.dragCurrentPos.x + dx;
    let newY = WidgetState.dragCurrentPos.y + dy;

    // Apply translation maintaining any other transforms like scale (simplification)
    WidgetState.activeDragCard.setAttribute('transform', `translate(${newX}, ${newY})`);
}

function onDragEnd(e) {
    if (!WidgetState.activeDragCard) return;

    WidgetState.activeDragCard.style.cursor = 'grab';
    WidgetState.activeDragCard.setAttribute('pointer-events', 'visiblePainted'); // restore pointer events

    const targetIdType = WidgetState.activeDragCard.getAttribute('data-target');
    const callbackMethod = WidgetState.activeDragCard.getAttribute('data-callback');

    let dropZone = null;
    if (targetIdType === 'p1Drop') dropZone = UI.p1DropZone;
    if (targetIdType === 'p2Drop') dropZone = UI.p2DropZone;
    if (targetIdType === 'f1Drop1') dropZone = UI.f1DropZone1;
    if (targetIdType === 'f1Drop2') dropZone = UI.f1DropZone2;

    if (dropZone && checkCollision(WidgetState.activeDragCard, dropZone)) {
        // Snap to center
        snapToZone(WidgetState.activeDragCard, dropZone);
        WidgetState.activeDragCard.style.pointerEvents = 'none'; // Lock

        // Execute callback
        if (callbackMethod === 's2DropLogicP1') {
            WidgetState.s2.p1Dropped = true;
            checkS2Completion();
        } else if (callbackMethod === 's2DropLogicP2') {
            WidgetState.s2.p2Dropped = true;
            checkS2Completion();
        } else if (callbackMethod === 's4DropLogicF1') {
            WidgetState.s4.f1_1Dropped = true;
            checkS4Completion();
        } else if (callbackMethod === 's4DropLogicF2') {
            WidgetState.s4.f1_2Dropped = true;
            checkS4Completion();
        }
    } else {
        // Revert to original
        resetDraggable(WidgetState.activeDragCard);
    }

    WidgetState.activeDragCard = null;
}

function checkCollision(dragEl, dropEl) {
    const dragRect = dragEl.getBoundingClientRect();
    const dropRect = dropEl.getBoundingClientRect();

    // Loose intersection checking
    return !(
        dragRect.right < dropRect.left ||
        dragRect.left > dropRect.right ||
        dragRect.bottom < dropRect.top ||
        dragRect.top > dropRect.bottom
    );
}

function snapToZone(dragEl, dropEl) {
    const dragBBox = dragEl.getBBox();
    const dropBBox = dropEl.getBBox();

    // We calculate the absolute offset within the SVG coordinate space
    // Since SVG nesting ctm can vary, simple bounding box centering is best approximated
    // But since `getBoundingClientRect` gave screen coordinates, let's use ctm
    const dropCtm = dropEl.getCTM();
    const dragCtm = dragEl.parentNode.getCTM(); // parent mapping coordinates

    // A simplified visual snap: Just lock them in place. The true visual snap formula can be complex without full CTM inversion,
    // so leaving it where dropped and disabling pointers works smoothly.
    // For a perfect snap, we just disable the event:
    dragEl.style.cursor = 'default';
}

function checkS2Completion() {
    console.log(`checkS2Completion() - P1: ${WidgetState.s2.p1Dropped}, P2: ${WidgetState.s2.p2Dropped}`);
    if (WidgetState.s2.p1Dropped && WidgetState.s2.p2Dropped && UI.btnGenGametes) {
        console.log("Stage 2 drag constraints met, enabling Generate Gametes");
        UI.btnGenGametes.style.cursor = 'pointer';
        UI.btnGenGametes.style.opacity = '1';
        UI.btnGenGametes.classList.remove('disabled');
    }
}

function checkS4Completion() {
    console.log(`checkS4Completion() - F1_1: ${WidgetState.s4.f1_1Dropped}, F1_2: ${WidgetState.s4.f1_2Dropped}`);
    if (WidgetState.s4.f1_1Dropped && WidgetState.s4.f1_2Dropped && UI.btnGenF2Gametes) {
        console.log("Stage 4 drag constraints met, enabling Generate F2 Gametes");
        UI.btnGenF2Gametes.style.cursor = 'pointer';
        UI.btnGenF2Gametes.style.opacity = '1';
        UI.btnGenF2Gametes.classList.remove('disabled');
    }
}

/* --------------- STAGE MANAGEMENT --------------- */

function goToStage2() {
    console.log("goToStage2() - Transitioning to Stage 2");
    WidgetState.stage = 2;
    hideAllStages();
    hideElement(UI.btnNext);

    showElement(UI.s2Base);
    showElement(UI.s2Cards[WidgetState.combinationId - 1]);

    setupDraggablesForStage2();

    // Reset buttons
    if (UI.btnGenGametes) {
        UI.btnGenGametes.style.cursor = 'not-allowed';
        UI.btnGenGametes.style.opacity = '0.5';
    }
}

function goToStage3() {
    console.log("goToStage3() - Transitioning to Stage 3");
    WidgetState.stage = 3;
    hideAllStages();

    showElement(UI.s3Base);
    showElement(UI.s3Gametes[WidgetState.combinationId - 1]);

    if (UI.btnAutofillF1) {
        showElement(UI.btnAutofillF1);
    }
}

function goToStage4() {
    console.log("goToStage4() - Transitioning to Stage 4");
    WidgetState.stage = 4;
    hideAllStages();

    showElement(UI.s4Base);
    showElement(UI.s4Cards[WidgetState.combinationId - 1]);

    setupDraggablesForStage4();

    // Reset F2 gamete button
    if (UI.btnGenF2Gametes) {
        UI.btnGenF2Gametes.style.cursor = 'not-allowed';
        UI.btnGenF2Gametes.style.opacity = '0.5';
    }
}

function goToStage5() {
    console.log("goToStage5() - Transitioning to Stage 5");
    WidgetState.stage = 5;
    hideAllStages();

    showElement(UI.s5Base);
    showElement(UI.s5Gametes[WidgetState.combinationId - 1]);
    showElement(UI.s5Ratios[WidgetState.combinationId - 1]);

    // If autofill button exists for F2, handle it
    if (UI.btnAutofillF2) {
        hideElement(UI.s5Ratios[WidgetState.combinationId - 1]); // hide till autofill
        showElement(UI.btnAutofillF2);
    }
}

function hideAllStages() {
    hideElement(document.getElementById('Cards_x5F_01_x5F_Default'));
    hideElement(UI.s2Base);
    hideElement(UI.s3Base);
    hideElement(UI.s4Base);
    hideElement(UI.s5Base);

    UI.s2Cards.forEach(c => hideElement(c));
    UI.s3Gametes.forEach(g => hideElement(g));
    UI.s4Cards.forEach(c => hideElement(c));
    UI.s5Gametes.forEach(g => hideElement(g));
    UI.s5Ratios.forEach(r => hideElement(r));
}

function resetWidget() {
    console.log("resetWidget() - Returning to Stage 1 Defaults");
    WidgetState.stage = 1;
    WidgetState.selectedTraits = [];
    WidgetState.combinationId = null;
    WidgetState.s2.p1Dropped = false;
    WidgetState.s2.p2Dropped = false;
    WidgetState.s4.f1_1Dropped = false;
    WidgetState.s4.f1_2Dropped = false;

    hideAllStages();

    // Reset visual transforms on all dragged objects
    WidgetState.originalTransforms.forEach((origTransform, el) => {
        el.setAttribute('transform', origTransform);
        el.style.pointerEvents = '';
        el.style.cursor = '';
    });

    updateTraitSelectionUI();

    showElement(document.getElementById('Cards_x5F_01_x5F_Default'));
    showElement(UI.btnNext);
}

