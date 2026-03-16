/**
 * Mendel's Monohybrid Cross Simulator Logic
 * Follows purely vanilla JS, functional structure, and global state object.
 */

// Global state object
const WidgetState = {
    currentStage: 1,
    selectedTraitIndex: -1, // 0 to 6
    parentPlaced: { left: false, right: false },
    f1Placed: { left: false, right: false },
    f1PlacedCards: { left: null, right: null }, // Track dragged cards
    // Original card transforms to revert when resetting
    originalTransforms: new Map(),
    punnettVisible: false
};

// Trait Metadata for text replacement
const TRAIT_DATA = [
    { dom: "Round", rec: "Wrinkled", D: "R", r: "r" },
    { dom: "Yellow", rec: "Green", D: "Y", r: "y" },
    { dom: "Purple", rec: "White", D: "P", r: "p" },
    { dom: "Inflated", rec: "Constricted", D: "I", r: "i" },
    { dom: "Green", rec: "Yellow", D: "G", r: "g" },
    { dom: "Axial", rec: "Terminal", D: "A", r: "a" },
    { dom: "Tall", rec: "Dwarf", D: "T", r: "t" }
];

// UI Elements container
const UI = {};

/**
 * Initializes the application by capturing elements,
 * hiding inactive stages, and attaching events.
 */
function initApp() {
    cacheUIElements();
    resetUI();
    setupEventListeners();
    setupDragAndDrop();
}

function cacheUIElements() {
    UI.svg = document.querySelector('svg');

    // Buttons
    UI.btnNext = document.getElementById('btn_x5F_next');
    UI.btnCrossParents = document.getElementById('btn_x5F_crossparents');
    UI.btnSelfCross = document.getElementById('btn_x5F_selfcross');
    UI.btnReset = document.getElementById('btn_x5F_reset');
    UI.btnPunnett = document.getElementById('btn_x5F_punnett');
    UI.tspanPunnett = document.getElementById('punnett_toggle_text');

    // Stages
    UI.stage1 = document.getElementById('stage1');
    UI.stage2 = document.getElementById('stage2');
    UI.stage3 = document.getElementById('stage3');
    UI.stage4 = document.getElementById('stage4');

    UI.stage2Base = document.getElementById('stage2_x5F_base');
    UI.stage3Base = document.getElementById('stage3_x5F_base');
    UI.stage4Base = document.getElementById('stage4_x5F_base');

    // Drop Zones
    UI.dropZoneP1 = document.getElementById('Drag_Dominant_Parent_Here');
    UI.dropZoneP2 = document.getElementById('Drag_Recessive_Parent_Here');
    UI.dropZoneF1_1 = document.getElementById('Drag_F1_Plant_Here');
    UI.dropZoneF1_2 = document.getElementById('Drag_F1_Plant_Here-2');

    // Trait Selection Highlight Layer
    UI.traitSelectionHighlight = document.getElementById('Cards_x5F_01_x5F_Selected');

    // Trait Selection Clickable Groups
    UI.traitGroups = [
        document.getElementById('group_x5F_seed_x5F_shape'),
        document.getElementById('group_x5F_seed_x5F_colour'),
        document.getElementById('group_x5F_flower_x5F_color'),
        document.getElementById('group_x5F_pod_x5F_shape'),
        document.getElementById('group_x5F_pod_x5F_color'),
        document.getElementById('group_x5F_flower_x5F_position'),
        document.getElementById('group_x5F_stem_x5F_height')
    ];
}

function resetUI() {
    WidgetState.currentStage = 1;

    // Show only Stage 1
    showElement(UI.stage1);
    hideElement(UI.stage2);
    hideElement(UI.stage2Base);
    hideElement(UI.stage3);
    hideElement(UI.stage3Base);
    hideElement(UI.stage4);
    hideElement(UI.stage4Base);
    hideElement(UI.traitSelectionHighlight);

    // Disable interaction buttons initially
    disableButton(UI.btnNext);
    disableButton(UI.btnCrossParents);
    disableButton(UI.btnSelfCross);

    // Only Next button should be visible in Stage 1
    showElement(UI.btnNext);
    hideElement(UI.btnCrossParents);
    hideElement(UI.btnSelfCross);
    hideElement(UI.btnReset);
    hideElement(UI.btnPunnett);

    // Restore drop zones opacity mapping
    if (UI.dropZoneP1) UI.dropZoneP1.style.opacity = '1';
    if (UI.dropZoneP2) UI.dropZoneP2.style.opacity = '1';
    if (UI.dropZoneF1_1) UI.dropZoneF1_1.style.opacity = '1';
    if (UI.dropZoneF1_2) UI.dropZoneF1_2.style.opacity = '1';

    // Hide extra trait cards explicitly to prevent rendering overlaps
    for (let i = 1; i <= 7; i++) {
        const c2 = document.getElementById(`Stage2-_Card_${i}`);
        const c3 = document.getElementById(`Stage3-_Card_${i}`);
        const c4 = document.getElementById(`Stage4-_Card_${i}`);
        if (c2) hideElement(c2);
        if (c3) hideElement(c3);
        if (c4) hideElement(c4);
    }

    // Force extra master container to bypass inline SVG hidden states
    const extraGrp = document.getElementById('extra');
    if (extraGrp) {
        showElement(extraGrp);
        extraGrp.classList.remove('st415');
    }

    resetTraitSelectionStyles();
}

function resetTraitSelectionStyles() {
    UI.traitGroups.forEach(groupEl => {
        if (!groupEl) return;

        // Reset base backdrop
        const baseBox = groupEl.querySelector('rect[id^="box_x5F_base"]');
        if (baseBox) {
            baseBox.style.fill = '';
            baseBox.style.stroke = '';
            baseBox.style.strokeWidth = '';
        }

        // Reset inner card elements dynamically
        const innerGroups = Array.from(groupEl.querySelectorAll('g[id^="box_x5F_"]'));
        innerGroups.forEach(box => {
            const rects = box.querySelectorAll('rect');
            if (rects.length >= 2) {
                rects[0].style.fill = '';
                rects[1].style.stroke = '';
                rects[1].style.strokeWidth = '';
            }
        });
    });
}

function setupEventListeners() {
    // Trait Selection Interactions
    UI.traitGroups.forEach((groupEl, index) => {
        if (groupEl) {
            groupEl.style.cursor = 'pointer';
            // Pointer down handles touch and mouse click uniformly and is snappier than pointerup
            groupEl.addEventListener('pointerdown', () => {
                if (WidgetState.currentStage === 1) {
                    selectTrait(index, groupEl);
                }
            });
        }
    });

    // Flow Navigation Buttons
    if (UI.btnNext) {
        UI.btnNext.style.cursor = 'pointer';
        UI.btnNext.addEventListener('pointerup', goToStage2);
    }
    if (UI.btnCrossParents) {
        UI.btnCrossParents.style.cursor = 'pointer';
        UI.btnCrossParents.addEventListener('pointerup', goToStage3);
    }
    if (UI.btnSelfCross) {
        UI.btnSelfCross.style.cursor = 'pointer';
        UI.btnSelfCross.addEventListener('pointerup', goToStage4);
    }
    if (UI.btnReset) {
        UI.btnReset.style.cursor = 'pointer';
        UI.btnReset.addEventListener('pointerup', () => {
            resetSimulation();
            resetUI();
        });
    }

    if (UI.btnPunnett) {
        UI.btnPunnett.style.cursor = 'pointer';
        UI.btnPunnett.addEventListener('pointerup', () => {
            WidgetState.punnettVisible = !WidgetState.punnettVisible;
            updatePunnettVisibility();
        });
    }
}

function selectTrait(index, element) {
    WidgetState.selectedTraitIndex = index;

    if (UI.traitSelectionHighlight) {
        hideElement(UI.traitSelectionHighlight);
    }

    resetTraitSelectionStyles();

    // Apply the active state highlight visually to the selected SVG DOM structures
    if (element) {
        const baseBox = element.querySelector('rect[id^="box_x5F_base"]');
        if (baseBox) {
            baseBox.style.fill = '#e6ffca';
            baseBox.style.stroke = '#00ae06';
            baseBox.style.strokeWidth = '4px';
        }

        const innerGroups = Array.from(element.querySelectorAll('g[id^="box_x5F_"]'));
        innerGroups.forEach(box => {
            const rects = box.querySelectorAll('rect');
            if (rects.length >= 2) {
                rects[0].style.fill = '#ffffff';
                rects[1].style.stroke = '#00ae06';
                rects[1].style.strokeWidth = '4px';
            }
        });
    }

    // Once a trait is selected, allow progressing
    enableButton(UI.btnNext);
}

function goToStage2() {
    // Only proceed if button is enabled
    if (UI.btnNext.style.pointerEvents === 'none') return;

    WidgetState.currentStage = 2;
    hideElement(UI.stage1);
    if (UI.traitSelectionHighlight) hideElement(UI.traitSelectionHighlight);

    showElement(UI.stage2);
    showElement(UI.stage2Base);

    // Toggle Buttons
    hideElement(UI.btnNext);
    showElement(UI.btnCrossParents);
    showElement(UI.btnReset);
    disableButton(UI.btnCrossParents);

    // Show only relevant specific trait card for P Generation
    for (let i = 1; i <= 7; i++) {
        const cardGroup = document.getElementById(`Stage2-_Card_${i}`);
        if (cardGroup) hideElement(cardGroup);
    }
    const selectedCards = document.getElementById(`Stage2-_Card_${WidgetState.selectedTraitIndex + 1}`);
    if (selectedCards) showElement(selectedCards);
}

function goToStage3() {
    if (UI.btnCrossParents.style.pointerEvents === 'none') return;

    WidgetState.currentStage = 3;
    hideElement(UI.stage2);
    hideElement(UI.stage2Base);

    showElement(UI.stage3);
    showElement(UI.stage3Base);

    // Toggle Buttons
    hideElement(UI.btnCrossParents);
    showElement(UI.btnSelfCross);
    disableButton(UI.btnSelfCross);

    // Show only relevant specific trait card for F1 Generation 
    // and hide Stage2 (Parent) cards to avoid overlap
    for (let i = 1; i <= 7; i++) {
        const stage2Cards = document.getElementById(`Stage2-_Card_${i}`);
        const cardGroup = document.getElementById(`Stage3-_Card_${i}`);
        if (stage2Cards) hideElement(stage2Cards);
        if (cardGroup) hideElement(cardGroup);
    }
    const selectedCards = document.getElementById(`Stage3-_Card_${WidgetState.selectedTraitIndex + 1}`);
    if (selectedCards) showElement(selectedCards);

    // Update Phenotype/Genotype Text overlay mapped for the current selection
    const stage3TextGroup = document.getElementById('All_offspring_display_the_Round_phenotype._All_offspring_have_the_Rr_genotype.');
    if (stage3TextGroup) {
        const tspans = stage3TextGroup.querySelectorAll('text tspan');
        if (tspans.length >= 2) {
            const trait = TRAIT_DATA[WidgetState.selectedTraitIndex];
            tspans[0].textContent = `All offspring display the ${trait.dom} phenotype.`;
            tspans[1].textContent = `All offspring have the ${trait.D}${trait.r} genotype.`;
        }
    }
}

function goToStage4() {
    if (UI.btnSelfCross.style.pointerEvents === 'none') return;

    WidgetState.currentStage = 4;
    hideElement(UI.stage3);
    hideElement(UI.stage3Base);

    showElement(UI.stage4);
    showElement(UI.stage4Base);

    // Toggle Buttons
    hideElement(UI.btnSelfCross);

    // Show only relevant specific trait card for F2 Generation (with Punnett square)
    // and explicitly hide Stage3 (F1) cards
    for (let i = 1; i <= 7; i++) {
        const stage3Cards = document.getElementById(`Stage3-_Card_${i}`);
        const cardGroup = document.getElementById(`Stage4-_Card_${i}`);
        if (stage3Cards) hideElement(stage3Cards);
        if (cardGroup) hideElement(cardGroup);
    }
    const selectedCards = document.getElementById(`Stage4-_Card_${WidgetState.selectedTraitIndex + 1}`);
    if (selectedCards) showElement(selectedCards);

    // Initial state for Punnett values
    WidgetState.punnettVisible = false;
    updatePunnettVisibility();
    showElement(UI.btnPunnett);

    // Update Phenotypic / Genotypic Ratio explicitly for the shared Stage 4 overlay
    const stage4TOS = document.getElementById('stage4_x5F_TOS');
    if (stage4TOS) {
        // Collect all text span value rows inside the Stage4 summary
        const tspans = stage4TOS.querySelectorAll('text tspan');
        if (tspans.length >= 4) {
            const t = TRAIT_DATA[WidgetState.selectedTraitIndex];
            tspans[1].textContent = ` 3 ${t.dom} : 1 ${t.rec} (3:1)`;
            tspans[3].textContent = ` 1 ${t.D}${t.D} : 2 ${t.D}${t.r} : 1 ${t.r}${t.r} (1:2:1)`;
        }
    }
}

/**
 * Toggles visibility of the genotype values within the Punnett Square
 */
function updatePunnettVisibility() {
    if (!UI.tspanPunnett) return;

    UI.tspanPunnett.textContent = WidgetState.punnettVisible ? 'Hide Genotypes' : 'Show Genotypes';

    // Find current active Stage 4 card
    const card = document.getElementById(`Stage4-_Card_${WidgetState.selectedTraitIndex + 1}`);
    if (!card) return;

    // The Punnett content container varies across cards (Group_173... or Group_217-219)
    const punnettContent = card.querySelector('g[id^="Group_173"], g[id="Group_217"], g[id="Group_218"], g[id="Group_219"]');
    if (!punnettContent) return;

    // Genotypes are the last 4 direct children that contain text tags.
    // We target only these 4 values to keep axials and "Punnett Square" title visible.
    const genotypeGroups = Array.from(punnettContent.children).filter(el => {
        return el.tagName === 'g' && el.querySelector('text');
    }).slice(-4);

    genotypeGroups.forEach(v => {
        v.style.display = WidgetState.punnettVisible ? '' : 'none';
    });
}

function resetSimulation() {
    WidgetState.currentStage = 1;
    WidgetState.selectedTraitIndex = -1;
    WidgetState.parentPlaced = { left: false, right: false };
    WidgetState.f1Placed = { left: false, right: false };
    WidgetState.f1PlacedCards = { left: null, right: null };

    // Revert all cards modified transforms
    WidgetState.originalTransforms.forEach((val, elem) => {
        elem.removeAttribute('transform');
        // Clear transform list explicitly for Chrome/Safari consistency
        if (elem.transform && elem.transform.baseVal) {
            while (elem.transform.baseVal.length > 0) {
                elem.transform.baseVal.removeItem(0);
            }
        }
        // Remove pointer events disable attached upon dropping
        elem.style.pointerEvents = 'auto';
    });
    WidgetState.originalTransforms.clear();

    // Remove ghost images
    document.querySelectorAll('.ghost-image').forEach(el => el.remove());
    document.querySelectorAll('[data-has-ghost]').forEach(el => delete el.dataset.hasGhost);
}

/**
 * Utility functions for showing/hiding and button states
 */
function showElement(el) {
    if (el) {
        el.style.display = 'block';
        if (el.tagName === 'g') el.style.display = '';
        if (el.classList.contains('st415')) el.classList.remove('st415');
    }
}

function hideElement(el) {
    if (el) el.style.display = 'none';
}

function disableButton(btn) {
    if (!btn) return;
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
}

function enableButton(btn) {
    if (!btn) return;
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
}

// ----------------------------------------------------
// NATIVE DRAG AND DROP SIMULATION FOR SVG ELEMENTS
// ----------------------------------------------------
let activeDrag = null;
let offset = { x: 0, y: 0 };
let currentTranslate = { x: 0, y: 0 };

function setupDragAndDrop() {
    // Stage 2 and 3 Card Containers
    const stage2Cards = document.querySelectorAll('[id^="Stage2-_Card_"]');
    const stage3Cards = document.querySelectorAll('[id^="Stage3-_Card_"]');

    // Any direct <g> child of these stages is considered a draggable card
    stage2Cards.forEach(container => {
        Array.from(container.children).forEach(child => {
            if (child.tagName === 'g') {
                child.dataset.dragType = 'p';
                child.style.cursor = 'grab';
                child.addEventListener('pointerdown', startDrag);
            }
        });
    });

    stage3Cards.forEach(container => {
        Array.from(container.children).forEach(child => {
            if (child.tagName === 'g') {
                child.dataset.dragType = 'f1';
                child.style.cursor = 'grab';
                child.addEventListener('pointerdown', startDrag);
            }
        });
    });

    UI.svg.addEventListener('pointermove', performDrag);
    UI.svg.addEventListener('pointerup', endDrag);
    UI.svg.addEventListener('pointerleave', endDrag);
}

function createGhost(element) {
    if (element.dataset.hasGhost) return;

    const ghost = element.cloneNode(true);
    // Recursively remove IDs from ghost and its children
    const removeIds = (el) => {
        if (el.removeAttribute) el.removeAttribute('id');
        if (el.children) {
            Array.from(el.children).forEach(removeIds);
        }
    };
    removeIds(ghost);

    ghost.classList.add('ghost-image');
    ghost.style.opacity = '0.3';
    ghost.style.pointerEvents = 'none';
    if (ghost.dataset) delete ghost.dataset.dragType;

    // Reset transform on ghost to ensure it stays at original spot
    if (ghost.hasAttribute('transform')) {
        ghost.removeAttribute('transform');
    }
    if (ghost.transform && ghost.transform.baseVal) {
        ghost.transform.baseVal.clear();
    }

    element.parentNode.insertBefore(ghost, element);
    element.dataset.hasGhost = 'true';
}

function getMousePosition(evt) {
    const CTM = UI.svg.getScreenCTM();
    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

function startDrag(evt) {
    // Ensure we are dragging the valid card group container
    let target = evt.target;
    while (target && typeof target.hasAttribute === 'function' && !target.hasAttribute('data-drag-type')) {
        target = target.parentNode;
    }

    if (!target || typeof target.hasAttribute !== 'function' || target.style.pointerEvents === 'none') return;

    // Evaluate layout bounds to securely know if it's the left or right parent when dragging starts
    if (target.dataset.dragType === 'p' && !target.dataset.side) {
        const siblings = Array.from(target.parentNode.children).filter(el => el.tagName === 'g' && el.dataset.dragType === 'p');
        if (siblings.length === 2 && siblings.indexOf(target) !== -1) {
            const b0 = siblings[0].getBoundingClientRect().left;
            const b1 = siblings[1].getBoundingClientRect().left;
            if (b0 < b1) {
                siblings[0].dataset.side = 'left';
                siblings[1].dataset.side = 'right';
            } else {
                siblings[0].dataset.side = 'right';
                siblings[1].dataset.side = 'left';
            }
        } else {
            const cx = target.getBoundingClientRect().left;
            target.dataset.side = cx < (window.innerWidth / 2) ? 'left' : 'right';
        }
    }

    createGhost(target);

    activeDrag = target;
    activeDrag.style.cursor = 'grabbing';

    // Bring to front
    activeDrag.parentNode.appendChild(activeDrag);

    const pointerPos = getMousePosition(evt);

    // Parse any existing translate values
    let transforms = activeDrag.transform.baseVal;
    if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
        const translate = UI.svg.createSVGTransform();
        translate.setTranslate(0, 0);
        activeDrag.transform.baseVal.insertItemBefore(translate, 0);
    }

    currentTranslate.x = transforms.getItem(0).matrix.e;
    currentTranslate.y = transforms.getItem(0).matrix.f;

    offset.x = pointerPos.x - currentTranslate.x;
    offset.y = pointerPos.y - currentTranslate.y;
}

function performDrag(evt) {
    if (!activeDrag) return;
    evt.preventDefault();

    const pointerPos = getMousePosition(evt);
    currentTranslate.x = pointerPos.x - offset.x;
    currentTranslate.y = pointerPos.y - offset.y;

    activeDrag.transform.baseVal.getItem(0).setTranslate(currentTranslate.x, currentTranslate.y);
}

function endDrag(evt) {
    if (!activeDrag) return;
    activeDrag.style.cursor = 'grab';

    const dragType = activeDrag.dataset.dragType;
    const side = activeDrag.dataset.side;
    let droppedOnValidZone = false;

    // Collision checks against drop zones
    if (WidgetState.currentStage === 2 && dragType === 'p') {
        if (side === 'left' && checkCollision(activeDrag, UI.dropZoneP1)) {
            snapToCenter(activeDrag, UI.dropZoneP1);
            droppedOnValidZone = true;
            WidgetState.parentPlaced.left = true;
            if (UI.dropZoneP1) UI.dropZoneP1.style.opacity = '0';
        }
        else if (side === 'right' && checkCollision(activeDrag, UI.dropZoneP2)) {
            snapToCenter(activeDrag, UI.dropZoneP2);
            droppedOnValidZone = true;
            WidgetState.parentPlaced.right = true;
            if (UI.dropZoneP2) UI.dropZoneP2.style.opacity = '0';
        }
    }
    else if (WidgetState.currentStage === 3 && dragType === 'f1') {
        // In F1, any card can go to either drop zone as long as it's empty
        const isAlreadyInLeft = WidgetState.f1PlacedCards.left === activeDrag;
        const isAlreadyInRight = WidgetState.f1PlacedCards.right === activeDrag;

        if (checkCollision(activeDrag, UI.dropZoneF1_1) && !WidgetState.f1Placed.left && !isAlreadyInRight) {
            snapToCenter(activeDrag, UI.dropZoneF1_1, 0.8);
            droppedOnValidZone = true;
            WidgetState.f1Placed.left = true;
            WidgetState.f1PlacedCards.left = activeDrag;
            if (UI.dropZoneF1_1) UI.dropZoneF1_1.style.opacity = '0';
        }
        else if (checkCollision(activeDrag, UI.dropZoneF1_2) && !WidgetState.f1Placed.right && !isAlreadyInLeft) {
            snapToCenter(activeDrag, UI.dropZoneF1_2, 0.8);
            droppedOnValidZone = true;
            WidgetState.f1Placed.right = true;
            WidgetState.f1PlacedCards.right = activeDrag;
            if (UI.dropZoneF1_2) UI.dropZoneF1_2.style.opacity = '0';
        }
    }

    if (droppedOnValidZone) {
        // Record original state only upon first successful drop to allow reversion later
        if (!WidgetState.originalTransforms.has(activeDrag)) {
            WidgetState.originalTransforms.set(activeDrag, true);
        }
        // Disable dragging once successfully dropped properly
        activeDrag.style.cursor = 'default';
        activeDrag.style.pointerEvents = 'none';
        evaluateProgress();
    } else {
        // Return to original location (0,0 relative translation since SVG positions were drawn correctly)
        activeDrag.transform.baseVal.getItem(0).setTranslate(0, 0);
    }

    activeDrag = null;
}

/**
 * Basic rectangular collision intersection logic 
 */
function checkCollision(element, targetArea) {
    if (!targetArea) return false;

    const b1 = element.getBoundingClientRect();
    const b2 = targetArea.getBoundingClientRect();

    // The drop should be accepted even if any part of the dragged object touches the drop area
    return !(
        b1.right < b2.left ||
        b1.left > b2.right ||
        b1.bottom < b2.top ||
        b1.top > b2.bottom
    );
}

function snapToCenter(elem, target, scale = 1.0) {
    // 1. Ensure the element is draggable and has the scale transform if needed
    let scaleTransform = null;
    for (let i = 0; i < elem.transform.baseVal.length; i++) {
        const t = elem.transform.baseVal.getItem(i);
        if (t.type === SVGTransform.SVG_TRANSFORM_SCALE) {
            scaleTransform = t;
            break;
        }
    }

    if (!scaleTransform && scale !== 1.0) {
        scaleTransform = UI.svg.createSVGTransform();
        elem.transform.baseVal.appendItem(scaleTransform);
    }

    // Apply the scale first as it affects the bounding box calculation for centering
    if (scaleTransform) {
        scaleTransform.setScale(scale, scale);
    }

    // 2. Perform centering math using screen coordinates mapped back to SVG space
    const svgCTM = UI.svg.getScreenCTM();
    const cBox = elem.getBoundingClientRect();
    const dBox = target.getBoundingClientRect();

    // diff is calculated based on current (possibly scaled) bounding box
    const diffX = ((dBox.left + dBox.width / 2) - (cBox.left + (cBox.width / 2))) / svgCTM.a;
    const diffY = ((dBox.top + dBox.height / 2) - (cBox.top + (cBox.height / 2))) / svgCTM.d;

    // Use translate transform (at index 0) for snapped placement
    let translateTransform = elem.transform.baseVal.getItem(0);
    const currentX = translateTransform.matrix.e;
    const currentY = translateTransform.matrix.f;

    translateTransform.setTranslate(currentX + diffX, currentY + diffY);
}

function evaluateProgress() {
    if (WidgetState.currentStage === 2) {
        if (WidgetState.parentPlaced.left && WidgetState.parentPlaced.right) {
            enableButton(UI.btnCrossParents);
        }
    } else if (WidgetState.currentStage === 3) {
        if (WidgetState.f1Placed.left && WidgetState.f1Placed.right) {
            enableButton(UI.btnSelfCross);
        }
    }
}

// Start sequence when page loads
document.addEventListener('DOMContentLoaded', initApp);
