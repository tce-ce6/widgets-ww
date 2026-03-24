/**
 * WG48 — Mendel's Dihybrid Cross Simulator
 * ==========================================
 * Stage Flow (aligned to XD Prototype):
 *
 *  Stage 1  → Trait Selection (7 cards, pick 2) → [Next]
 *  Stage 2  → Parental Generation P: Drag P1+P2 → drop zones → [Generate Gametes]
 *  Stage 3  → Crossing-Over: EMPTY F1 Punnett shown → [Auto-fill F1] → fills cells
 *  Stage 4  → F1 Self-Pollination: Any of 4 F1s draggable to either slot → [Generate F2 Gametes]
 *  Stage 5  → EMPTY F2 Punnett shown → [Auto-fill F2 Punnett Square] → fills 16 cells
 *  Stage 6  → Genotypic & Phenotypic Ratio display (Next button hidden)
 *
 * Fixes applied (v5):
 *  1. F1 Punnett cell text hidden until Auto-fill F1 clicked.
 *  2. All 4 F1 offspring in Stage 4 are draggable (any can fill either slot).
 *  3. Dominant parent must be dropped in dominant zone; recessive parent in recessive zone.
 *  4. Global "Next" button hidden during stages 2-5, completely hidden in Stage 6.
 *  5. F2 Auto-fill step: SVG group button (Next5) integrated into Stage 5.
 *  6. Reset buttons: "Reset" visible in Stages 1-5, "Reset All" visible only in Stage 6.
 */

/* ─────────────────────────────────────────────
   FILLED CELL GROUP IDs PER COMBINATION
   ─────────────────────────────────────────────
   Extracted from SVG analysis — these are the text groups inside each
   stage3_x5F_GametesXX / stage5_x5F_Gametes_XX that should be hidden
   until the respective Auto-fill button is clicked.
*/
const S3_CELL_IDS = [
    // combo 01
    ['RrYy', 'RrYy-2', 'RrYy-3', 'RrYy-4'],
    // combo 02
    ['RrYy1', 'RrYy-21', 'RrYy-31', 'RrYy-41'],
    // combo 03
    ['RrYy2', 'RrYy-22', 'RrYy-32', 'RrYy-42'],
    // combo 04
    ['RrYy3', 'RrYy-23', 'RrYy-33', 'RrYy-43'],
    // combo 05
    ['RrYy4', 'RrYy-24', 'RrYy-34', 'RrYy-44'],
    // combo 06
    ['RrYy5', 'RrYy-25', 'RrYy-35', 'RrYy-45'],
    // combo 07
    ['RrYy6', 'RrYy-26', 'RrYy-36', 'RrYy-46'],
    // combo 08
    ['RrYy7', 'RrYy-27', 'RrYy-37', 'RrYy-47'],
    // combo 09
    ['RrYy8', 'RrYy-28', 'RrYy-38', 'RrYy-48'],
    // combo 10
    ['RrYy9', 'RrYy-29', 'RrYy-39', 'RrYy-49'],
    // combo 11
    ['RrYy10', 'RrYy-210', 'RrYy-310', 'RrYy-410'],
    // combo 12
    ['RrYy11', 'RrYy-211', 'RrYy-311', 'RrYy-411'],
    // combo 13
    ['RrYy12', 'RrYy-212', 'RrYy-312', 'RrYy-412'],
    // combo 14
    ['RrYy13', 'RrYy-213', 'RrYy-313', 'RrYy-413'],
    // combo 15
    ['RrYy14', 'RrYy-214', 'RrYy-314', 'RrYy-414'],
    // combo 16
    ['RrYy15', 'RrYy-215', 'RrYy-315', 'RrYy-415'],
    // combo 17
    ['RrYy16', 'RrYy-216', 'RrYy-316', 'RrYy-416'],
    // combo 18
    ['RrYy17', 'RrYy-217', 'RrYy-317', 'RrYy-417'],
    // combo 19
    ['RrYy18', 'RrYy-218', 'RrYy-318', 'RrYy-418'],
    // combo 20
    ['RrYy19', 'RrYy-219', 'RrYy-319', 'RrYy-419'],
    // combo 21
    ['RrYy20', 'RrYy-220', 'RrYy-320', 'RrYy-420'],
];

// S5 filled cell IDs — 16 genotype cells per F2 Punnett, all combos follow same suffix pattern
// Based on SVG analysis: RRYY, RRYy-2...rryy-16 (with suffix 0 for combo01, 1 for combo02, etc.)
function _getS5CellIds(comboIdx) {
    // combo 1 uses suffix '', combo 2–21 use suffix = comboIdx (0-based)
    const sfx = comboIdx === 0 ? '' : String(comboIdx);
    return [
        `RRYY${sfx}`, `RRYy-2${sfx}`, `RRYy-3${sfx}`, `RRyy-4${sfx}`,
        `RrYY-5${sfx}`, `RrYy-6${sfx}`, `RrYy-7${sfx}`, `Rryy-8${sfx}`,
        `RrYY-9${sfx}`, `RrYy-10${sfx}`, `rrYY-11${sfx}`, `rrYy-12${sfx}`,
        `RrYy-13${sfx}`, `Rryy-14${sfx}`, `rrYy-15${sfx}`, `rryy-16${sfx}`,
    ];
}

/* ─────────────────────────────────────────────
   COMBINATION MAP  (trait-pair → id 1…21)
   ───────────────────────────────────────────── */
function getCombinationId(a, b) {
    const lo = Math.min(a, b), hi = Math.max(a, b);
    const MAP = {
        '0_1': 1, '0_2': 2, '0_3': 3, '0_4': 4, '0_5': 5, '0_6': 6,
        '1_2': 7, '1_3': 8, '1_4': 9, '1_5': 10, '1_6': 11,
        '2_3': 12, '2_4': 13, '2_5': 14, '2_6': 15,
        '3_4': 16, '3_5': 17, '3_6': 18,
        '4_5': 19, '4_6': 20,
        '5_6': 21
    };
    return MAP[`${lo}_${hi}`] || 1;
}

/* ─────────────────────────────────────────────
   GLOBAL STATE
   ───────────────────────────────────────────── */
const WidgetState = {
    stage: 1,
    selectedTraits: [],
    combinationId: null,

    // Drop tracking
    s2DroppedCount: 0,  // 0/1/2 parents dropped
    s4DroppedCount: 0,  // 0/1/2 F1s dropped

    // Drag engine
    activeDrag: null,
    dragStartSVG: { x: 0, y: 0 },
    dragOriginTranslate: { x: 0, y: 0 },
    originalTransforms: new Map()
};

/* ─────────────────────────────────────────────
   UI CACHE
   ───────────────────────────────────────────── */
const UI = {
    svg: null,
    stage1Layer: null,
    traitCards: [],

    // Stage base containers
    s2Base: null,
    s3Base: null,
    s4Base: null,
    s5Base: null,

    // 21 per-combination groups
    s2Cards: [],
    s3Gametes: [],
    s4Cards: [],
    s5Gametes: [],
    s6Ratios: [],

    // SVG Buttons
    btnNext: null,        // Stage 1 Next (Group_594)
    btnGenGametes: null,  // Next1 — Generate Gametes  (S2→S3)
    btnAutoFillF1: null,  // Next2 — Auto-fill F1       (S3)
    btnNextS3: null,      // Group_5946 - Next in stage 3
    btnGenF2Gametes: null,// Next3 — Generate F2 Gametes (S4→S5)
    btnNextS5: null,      // Next4 — Next in stage 5       (S5→S6)
    btnAutoFillF2: null,  // Next5 — Auto-fill F2       (S5)
    btnResetAll: null,
    btnReset: null,

    // Button containers (for visibility logic)
    resetGroup: null,     // Group_31 (Reset)
    resetAllGroup: null,  // Group_113 (Reset All)

    // Drop zone rects (.st235)
    s2Drops: [],          // 2 elements, Stage 2
    s4Drops: [],          // 2 elements, Stage 4

    // Global buttons wrapper (contains Next + Reset)
    globalBtns: null,
};

/* ─────────────────────────────────────────────
   UTILITY
   ───────────────────────────────────────────── */
function show(el) {
    if (!el) return;
    el.style.display = 'block';
    el.style.visibility = 'visible'; // Ensure visibility is restored
    el.classList.remove('st656');
}
function hide(el) {
    if (el) el.style.display = 'none';
}
function enableBtn(el) {
    if (!el) return;
    el.style.opacity = '1';
    el.style.cursor = 'pointer';
    el.style.pointerEvents = 'auto';
}
function disableBtn(el) {
    if (!el) return;
    el.style.opacity = '0.4';
    el.style.cursor = 'not-allowed';
    el.style.pointerEvents = 'none';
}
function showById(id) {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'block'; el.classList.remove('st656'); }
}
function hideById(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

/* ─────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    console.log('[WG48] DOMContentLoaded — init');
    cacheElements();
    setupEvents();
    resetWidget();
});

function cacheElements() {
    UI.svg = document.querySelector('svg');
    UI.stage1Layer = document.getElementById('Cards_x5F_01_x5F_Default');

    const traitGroupIds = ['Group_4-2', 'Group_5-2', 'Group_6-2', 'Group_7-2', 'Group_8-2', 'Group_9-2', 'Group_10-2'];
    UI.traitCards = traitGroupIds.map(id => document.getElementById(id)).filter(Boolean);

    UI.s2Base = document.getElementById('stage2_x5F_base');
    UI.s3Base = document.getElementById('stage3_x5F_base');
    UI.s4Base = document.getElementById('stage4_x5F_base');
    UI.s5Base = document.getElementById('stage5_x5F_base');

    UI.globalBtns = document.getElementById('Buttons_x5F_all_stages');

    for (let i = 1; i <= 21; i++) {
        const pad2 = String(i).padStart(2, '0');
        UI.s2Cards.push(document.getElementById(`Stage2-_Card_${i}`));
        UI.s3Gametes.push(document.getElementById(`stage3_x5F_Gametes${pad2}`));
        UI.s4Cards.push(document.getElementById(`Stage4-_Card_${i}`));
        UI.s5Gametes.push(document.getElementById(`stage5_x5F_Gametes_${pad2}`));
        UI.s6Ratios.push(document.getElementById(`stage5_x5F_Genotypic_Ratio_x5F_${pad2}`));
    }

    UI.btnNext = document.getElementById('Group_594');
    UI.btnGenGametes = document.getElementById('Group_5941'); // parent of Next1
    UI.btnAutoFillF1 = document.getElementById('Group_5942'); // parent of Next2
    UI.btnNextS3 = document.getElementById('Group_5946');
    UI.btnGenF2Gametes = document.getElementById('Group_5943'); // parent of Next3
    UI.btnNextS5 = document.getElementById('Group_5944'); // parent of Next4
    UI.btnAutoFillF2 = document.getElementById('Group_5945'); // parent of Next5

    UI.resetGroup = document.getElementById('Group_31');
    UI.resetAllGroup = document.getElementById('Group_113');

    // Button aliases for events
    UI.btnReset = UI.resetGroup;
    UI.btnResetAll = UI.resetAllGroup;

    // Drop zones
    if (UI.s2Base) UI.s2Drops = Array.from(UI.s2Base.querySelectorAll('.st235'));
    if (UI.s4Base) UI.s4Drops = Array.from(UI.s4Base.querySelectorAll('.st235'));

    console.log('[WG48] Cache — traitCards:', UI.traitCards.length,
        's2Drops:', UI.s2Drops.length, 's4Drops:', UI.s4Drops.length,
        'Next1:', !!UI.btnGenGametes, 'Next2:', !!UI.btnAutoFillF1,
        'Next3:', !!UI.btnGenF2Gametes, 'Next4:', !!UI.btnNextS5);
}



/* ─────────────────────────────────────────────
   EVENT SETUP
   ───────────────────────────────────────────── */
function setupEvents() {
    UI.traitCards.forEach((card, idx) => {
        card.style.cursor = 'pointer';
        card.addEventListener('pointerdown', () => onTraitClick(idx));
    });

    _btnOn(UI.btnNext, onNextClick);

    // S2 → S3: Generate Gametes
    _btnOn(UI.btnGenGametes, () => {
        if (WidgetState.s2DroppedCount >= 2) {
            console.log('[WG48] Generate Gametes → Stage 3');
            goToStage3();
        } else {
            console.warn('[WG48] Generate Gametes blocked — need both parents dropped');
        }
    });

    // S3 → S4: Auto-fill F1 (GATED: only works in stage 3)
    _btnOn(UI.btnAutoFillF1, (e) => {
        if (WidgetState.stage !== 3) return;
        // Prevent double fire or automatic progression
        if (e) { e.preventDefault(); e.stopPropagation(); }

        console.log('[WG48] Auto-fill F1 clicked → reveal cells → show Stage 3 Next');
        _revealF1Cells();
        // Stay on screen, hide auto-fill, show Next
        hide(UI.btnAutoFillF1);
        show(UI.btnNextS3);
    });

    // Stage 3 Next → Stage 4
    _btnOn(UI.btnNextS3, () => {
        if (WidgetState.stage !== 3) return;
        goToStage4();
    });

    // S4 → S5: Generate F2 Gametes
    _btnOn(UI.btnGenF2Gametes, () => {
        if (WidgetState.s4DroppedCount >= 2) {
            console.log('[WG48] Generate F2 Gametes → Stage 5');
            goToStage5();
        } else {
            console.warn('[WG48] Generate F2 Gametes blocked — need both F1s dropped');
        }
    });

    // S5 → S6: Next (hidden after Stage 6)
    _btnOn(UI.btnNextS5, () => {
        if (WidgetState.stage !== 5) return;
        console.log('[WG48] Next (S5) → Stage 6 ratios');
        goToStage6();
    });

    // Auto-fill F2
    _btnOn(UI.btnAutoFillF2, onAutoFillF2Click);

    _btnOn(UI.btnReset, resetWidget);
    _btnOn(UI.btnResetAll, resetWidget);

    // Drag engine
    if (UI.svg) {
        UI.svg.addEventListener('pointermove', onDragMove);
        UI.svg.addEventListener('pointerup', onDragEnd);
        UI.svg.addEventListener('pointerleave', onDragEnd);
    }
}

function _btnOn(el, handler) {
    if (!el) return;
    el.style.cursor = 'pointer';
    el.addEventListener('pointerup', handler);
}

/* ─────────────────────────────────────────────
   STAGE 1 — TRAIT SELECTION
   ───────────────────────────────────────────── */
function onTraitClick(idx) {
    if (WidgetState.stage !== 1) return;
    const pos = WidgetState.selectedTraits.indexOf(idx);
    if (pos !== -1) {
        WidgetState.selectedTraits.splice(pos, 1);
    } else if (WidgetState.selectedTraits.length < 2) {
        WidgetState.selectedTraits.push(idx);
    } else {
        console.warn('[WG48] Max traits selected');
        return;
    }
    console.log('[WG48] Traits:', WidgetState.selectedTraits);
    _updateTraitHighlights();

    // Enable Next only when 2 traits are selected
    if (WidgetState.selectedTraits.length === 2) {
        enableBtn(UI.btnNext);
    } else {
        disableBtn(UI.btnNext);
    }
}

function _updateTraitHighlights() {
    UI.traitCards.forEach((card, idx) => {
        const rect = card.querySelector('rect');
        if (!rect) return;
        if (WidgetState.selectedTraits.includes(idx)) {
            rect.style.fill = '#e6ffca';
            rect.style.stroke = '#00ae06';
            rect.style.strokeWidth = '4px';
        } else {
            rect.style.fill = '';
            rect.style.stroke = '';
            rect.style.strokeWidth = '';
        }
    });
}

function onNextClick() {
    if (WidgetState.stage === 1 && WidgetState.selectedTraits.length === 2) {
        WidgetState.combinationId = getCombinationId(
            WidgetState.selectedTraits[0], WidgetState.selectedTraits[1]);
        console.log('[WG48] Combination ID:', WidgetState.combinationId);
        goToStage2();
    }
}

/* ─────────────────────────────────────────────
   STAGE TRANSITIONS
   ───────────────────────────────────────────── */
function hideAllStages() {
    hide(UI.stage1Layer);
    hide(UI.s2Base);
    hide(UI.s3Base);
    hide(UI.s4Base);
    hide(UI.s5Base);
    UI.s2Cards.forEach(hide);
    UI.s3Gametes.forEach(hide);
    UI.s4Cards.forEach(hide);
    UI.s5Gametes.forEach(hide);
    UI.s6Ratios.forEach(hide);
    hide(UI.btnNextS3);
    hide(document.getElementById('Group_5945')); // Ensure Auto-fill F2 group is hidden
}

function goToStage2() {
    console.log('[WG48] ▶ Stage 2 — Parental Generation');
    WidgetState.stage = 2;
    WidgetState.s2DroppedCount = 0;

    hideAllStages();
    hide(UI.btnNext);  // hide global Next — no overlap with stage buttons
    show(UI.resetGroup); // Show reset button once simulation starts

    show(UI.s2Base);
    const card = UI.s2Cards[WidgetState.combinationId - 1];
    show(card);

    disableBtn(UI.btnGenGametes);
    _setupDraggables(card, ['s2P_dom', 's2P_rec'], 2);   // dominant parent first, recessive parent second
}

function goToStage3() {
    console.log('[WG48] ▶ Stage 3 — F1 Punnett (empty until auto-fill)');
    WidgetState.stage = 3;

    hideAllStages();
    hide(UI.btnNext);

    show(UI.s3Base);
    const gametesEl = UI.s3Gametes[WidgetState.combinationId - 1];
    show(gametesEl);

    // Hide filled cells — user must click Auto-fill to see them
    _hideF1Cells();

    show(UI.btnAutoFillF1);
    hide(UI.btnNextS3);

    enableBtn(UI.btnAutoFillF1);
    disableBtn(UI.btnGenF2Gametes);
}

function _hideF1Cells() {
    const comboIdx = WidgetState.combinationId - 1;
    const cellIds = S3_CELL_IDS[comboIdx] || [];
    cellIds.forEach(id => hideById(id));
    console.log('[WG48] Hidden F1 cells:', cellIds);
}

function _revealF1Cells() {
    const comboIdx = WidgetState.combinationId - 1;
    const cellIds = S3_CELL_IDS[comboIdx] || [];
    cellIds.forEach(id => showById(id));
    console.log('[WG48] Revealed F1 cells:', cellIds);
}

function goToStage4() {
    console.log('[WG48] ▶ Stage 4 — F1 Self-Pollination');
    WidgetState.stage = 4;
    WidgetState.s4DroppedCount = 0;

    hideAllStages();
    hide(UI.btnNext);

    show(UI.s4Base);
    const card = UI.s4Cards[WidgetState.combinationId - 1];
    show(card);

    disableBtn(UI.btnGenF2Gametes);
    // All 4 F1 offspring draggable — any can go to either slot
    _setupDraggables(card, ['s4F1', 's4F1', 's4F1', 's4F1'], 4);
}

function goToStage5() {
    console.log('[WG48] ▶ Stage 5 — F2 Punnett (empty until auto-fill F2)');
    WidgetState.stage = 5;

    hideAllStages();
    hide(UI.btnNext);

    show(UI.s5Base);
    const gametesEl = UI.s5Gametes[WidgetState.combinationId - 1];
    show(gametesEl);

    // Hide the 16 filled cells — user must click Auto-fill F2 to see them
    _hideF2Cells();

    // Hide the stage5 "Next" button until after auto-fill
    // Next4 is inside Group_5944
    hideById('Group_5944');

    // Show SVG auto-fill F2 button (Group_5945)
    showById('Group_5945');
    enableBtn(UI.btnAutoFillF2);
}

function _hideF2Cells() {
    const comboIdx = WidgetState.combinationId - 1;
    const cellIds = _getS5CellIds(comboIdx);
    cellIds.forEach(id => hideById(id));
    console.log('[WG48] Hidden F2 cells:', cellIds);
}

function _revealF2Cells() {
    const comboIdx = WidgetState.combinationId - 1;
    const cellIds = _getS5CellIds(comboIdx);
    cellIds.forEach(id => showById(id));
    console.log('[WG48] Revealed F2 cells:', cellIds);
}

function onAutoFillF2Click() {
    if (WidgetState.stage !== 5) return;
    console.log('[WG48] Auto-fill F2 clicked → reveal F2 cells → enable Next');
    _revealF2Cells();
    // Hide this button after clicking
    hideById('Group_5945');
    // Enable Stage 5 Next button to proceed to Stage 6
    showById('Group_5944');
    enableBtn(UI.btnNextS5);
}

function goToStage6() {
    console.log('[WG48] ▶ Stage 6 — Final Ratios');
    WidgetState.stage = 6;

    // Reveal ratio panel (keep F2 base + gametes visible from stage 5)
    show(UI.s6Ratios[WidgetState.combinationId - 1]);

    // COMPLETELY HIDE ALL NEXT BUTTONS on last screen
    hide(UI.btnNext);
    hideById('Group_5944'); // Next4
    hide(UI.btnNextS5);

    // Swap Reset with Reset All on final screen
    hide(UI.resetGroup);
    show(UI.resetAllGroup);
}

/**
 * Creates a semi-transparent ghost image at the original position.
 */
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
    if (ghost.dataset) delete ghost.dataset.dragRole;

    // Ensure ghost stays at the very original transform position
    const origTx = WidgetState.originalTransforms.get(element);
    if (origTx !== undefined) {
        ghost.setAttribute('transform', origTx);
    }

    element.parentNode.insertBefore(ghost, element);
    element.dataset.hasGhost = 'true';
}

/* ─────────────────────────────────────────────
   DRAG & DROP ENGINE
   ───────────────────────────────────────────── */

/**
 * Set up first `maxCount` direct <g> children of `container` as draggable.
 * For Stage 2 (roles starting with 's2P'), dynamically detect which child
 * is dominant (Parent 1) vs recessive (Parent 2) based on text content.
 */
function _setupDraggables(container, roles, maxCount) {
    if (!container) { console.warn('[WG48] _setupDraggables: null container'); return; }

    const children = Array.from(container.children).filter(el => el.tagName === 'g');
    const count = Math.min(children.length, maxCount || roles.length);
    console.log(`[WG48] _setupDraggables: ${children.length} groups, ${count} draggable`);

    // For Stage 2 parents, detect dominant vs recessive based on "Parent 1" vs "Parent 2" text
    const isS2Setup = roles.some(r => r.startsWith('s2P'));
    
    for (let i = 0; i < count; i++) {
        const el = children[i];
        el.style.cursor = 'grab';
        
        // Determine role dynamically for S2 parents
        let role = roles[Math.min(i, roles.length - 1)];
        if (isS2Setup) {
            // Check if this element contains "Parent 1" or "Parent 2" text
            const textContent = el.textContent || '';
            if (textContent.includes('Parent 1')) {
                role = 's2P_dom';  // Parent 1 = dominant
            } else if (textContent.includes('Parent 2')) {
                role = 's2P_rec';  // Parent 2 = recessive
            }
            console.log(`[WG48] Child ${i} detected as ${role}`);
        }
        
        el.setAttribute('data-drag-role', role);
        el.setAttribute('data-drag-picked', 'false');
        el.removeEventListener('pointerdown', onDragStart);
        el.addEventListener('pointerdown', onDragStart);
        if (!WidgetState.originalTransforms.has(el)) {
            WidgetState.originalTransforms.set(el, el.getAttribute('transform') || '');
        }
    }
}

function onDragStart(e) {
    e.preventDefault();
    if (WidgetState.activeDrag) return;

    const el = e.currentTarget;
    // Don't re-drag an already-dropped card
    if (el.getAttribute('data-drag-picked') === 'done') return;

    WidgetState.activeDrag = el;
    el.style.cursor = 'grabbing';
    el.parentNode.appendChild(el);

    const pt = UI.svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgPt = pt.matrixTransform(el.parentNode.getCTM().inverse());
    WidgetState.dragStartSVG = { x: svgPt.x, y: svgPt.y };

    const tx = el.getAttribute('transform') || '';
    const match = tx.match(/translate\(\s*([\d.-]+)[,\s]+([\d.-]+)\s*\)/);
    WidgetState.dragOriginTranslate = {
        x: match ? parseFloat(match[1]) : 0,
        y: match ? parseFloat(match[2]) : 0
    };

    createGhost(el);

    el.setAttribute('pointer-events', 'none');
}

function onDragMove(e) {
    const el = WidgetState.activeDrag;
    if (!el) return;
    const pt = UI.svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgPt = pt.matrixTransform(el.parentNode.getCTM().inverse());
    const dx = svgPt.x - WidgetState.dragStartSVG.x;
    const dy = svgPt.y - WidgetState.dragStartSVG.y;
    el.setAttribute('transform',
        `translate(${WidgetState.dragOriginTranslate.x + dx},${WidgetState.dragOriginTranslate.y + dy})`);
}

function onDragEnd(e) {
    const el = WidgetState.activeDrag;
    if (!el) return;

    el.setAttribute('pointer-events', 'visiblePainted');
    el.style.cursor = 'grab';

    const role = el.getAttribute('data-drag-role');
    const isS2Dom = role === 's2P_dom';
    const isS2Rec = role === 's2P_rec';
    const isS2 = isS2Dom || isS2Rec;
    const isS4 = role === 's4F1';

    const drops = isS2 ? UI.s2Drops : isS4 ? UI.s4Drops : [];

    // Find first available (empty) drop zone that overlaps with dragged element
    // For S2 parents: enforce dominant→dominant zone, recessive→recessive zone
    let acceptedDrop = null;
    for (const dz of drops) {
        if (dz.getAttribute('data-occupied') !== 'true' && _overlaps(el, dz)) {
            // For Stage 2, validate correct parent type for each drop zone
            if (isS2) {
                const isDomZone = dz === UI.s2Drops[0];
                const isRecZone = dz === UI.s2Drops[1];
                // Dominant parent can only go in dominant zone, recessive in recessive zone
                if ((isS2Dom && isDomZone) || (isS2Rec && isRecZone)) {
                    acceptedDrop = dz;
                    break;
                }
                // Skip this zone if it's the wrong type for this parent
                continue;
            }
            acceptedDrop = dz;
            break;
        }
    }

    if (acceptedDrop) {
        console.log(`[WG48] ${role} dropped into a zone`);
        // Apply scaling for parents (S2) and F1 offspring (S4) to fit nicely in the boxes
        const scaleVal = (isS2 || isS4) ? 0.8 : 1.0;
        _snapToZone(el, acceptedDrop, scaleVal);
        acceptedDrop.setAttribute('data-occupied', 'true');
        el.setAttribute('data-drag-picked', 'done');
        el.style.cursor = 'default';
        el.style.pointerEvents = 'none';

        if (isS2) {
            WidgetState.s2DroppedCount++;
            console.log(`[WG48] S2 dropped: ${WidgetState.s2DroppedCount}/2`);

            // Hide the instruction text for this specific drop zone
            if (acceptedDrop === UI.s2Drops[0]) hideById('Drag_Dominant_Parent_Here');
            else if (acceptedDrop === UI.s2Drops[1]) hideById('Drag_Recessive_Parent_Here');

            if (WidgetState.s2DroppedCount >= 2) {
                enableBtn(UI.btnGenGametes);
                console.log('[WG48] Both parents dropped → Generate Gametes enabled');
            }
        } else if (isS4) {
            WidgetState.s4DroppedCount++;
            console.log(`[WG48] S4 dropped: ${WidgetState.s4DroppedCount}/2`);

            // Hide the instruction text for this specific drop zone
            if (acceptedDrop === UI.s4Drops[0]) hideById('Drop_F1_Offspring_1_here');
            else if (acceptedDrop === UI.s4Drops[1]) hideById('Drop_F1_Offspring_2_here');

            if (WidgetState.s4DroppedCount >= 2) {
                enableBtn(UI.btnGenF2Gametes);
                console.log('[WG48] Both F1 offspring dropped → Generate F2 Gametes enabled');
            }
        }
    } else {
        // Snap back to original position
        const orig = WidgetState.originalTransforms.get(el);
        if (orig !== undefined) el.setAttribute('transform', orig);
        console.log(`[WG48] ${role} snapped back`);
    }
    WidgetState.activeDrag = null;
}

/** Loose overlap: true if any part of elA intersects elB */
function _overlaps(elA, elB) {
    const a = elA.getBoundingClientRect();
    const b = elB.getBoundingClientRect();
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

/** Snap el centre to dropEl centre (screen → SVG coordinate conversion) */
function _snapToZone(dragEl, dropEl, scale = 1.0) {
    if (scale !== 1.0) {
        const currentTx = dragEl.getAttribute('transform') || '';
        if (!currentTx.includes('scale')) {
            dragEl.setAttribute('transform', currentTx + ` scale(${scale})`);
        }
    }

    const dBB = dragEl.getBoundingClientRect();
    const zBB = dropEl.getBoundingClientRect();

    const dxPx = (zBB.left + zBB.width / 2) - (dBB.left + dBB.width / 2);
    const dyPx = (zBB.top + zBB.height / 2) - (dBB.top + dBB.height / 2);

    const ctm = dragEl.parentNode.getCTM();
    const dxSVG = dxPx / ctm.a;
    const dySVG = dyPx / ctm.d;

    const tx = dragEl.getAttribute('transform') || '';
    const m = tx.match(/translate\(\s*([\d.-]+)[,\s]+([\d.-]+)\s*\)/);
    const cx = m ? parseFloat(m[1]) : 0;
    const cy = m ? parseFloat(m[2]) : 0;

    const sMatch = tx.match(/scale\([\d.-]+\)/);
    const sStr = sMatch ? sMatch[0] : "";

    dragEl.setAttribute('transform', `translate(${cx + dxSVG},${cy + dySVG}) ${sStr}`.trim());
}

/* ─────────────────────────────────────────────
   RESET
   ───────────────────────────────────────────── */
function resetWidget() {
    console.log('[WG48] ▶ Reset → Stage 1');
    WidgetState.stage = 1;
    WidgetState.selectedTraits = [];
    WidgetState.combinationId = null;
    WidgetState.s2DroppedCount = 0;
    WidgetState.s4DroppedCount = 0;

    // Restore dragged elements to original positions
    WidgetState.originalTransforms.forEach((origTx, el) => {
        el.setAttribute('transform', origTx);
        el.style.pointerEvents = '';
        el.style.cursor = '';
        el.setAttribute('data-drag-picked', 'false');
    });

    // Clear drop zone occupation flags
    UI.s2Drops.forEach(dz => dz.removeAttribute('data-occupied'));
    UI.s4Drops.forEach(dz => dz.removeAttribute('data-occupied'));

    // Remove ghosts
    document.querySelectorAll('.ghost-image').forEach(el => el.remove());
    document.querySelectorAll('[data-has-ghost]').forEach(el => delete el.dataset.hasGhost);

    hideAllStages();
    _updateTraitHighlights();
    show(UI.stage1Layer);
    show(UI.btnNext);

    // Show Reset/ResetAll; disable stage-specific action buttons
    // Hide Reset button initially on home; show Reset All ONLY when Stage 6 is reached (not here)
    hide(UI.resetGroup);
    hide(UI.resetAllGroup);

    disableBtn(UI.btnNext); // Initially disabled until 2 traits selected
    disableBtn(UI.btnGenGametes);
    disableBtn(UI.btnGenF2Gametes);
    disableBtn(UI.btnNextS5);

    // Restore instructions
    showById('Drag_Dominant_Parent_Here');
    showById('Drag_Recessive_Parent_Here');
    showById('Drop_F1_Offspring_1_here');
    showById('Drop_F1_Offspring_2_here');

    // Extra safety: explicitly hide all ratio cards and their potential display overrides
    UI.s6Ratios.forEach(el => {
        if (el) {
            el.style.display = 'none';
            // el.style.visibility = 'hidden'; // REMOVED: let st656 or show() handle it to avoid override issues
            el.classList.add('st656');
        }
    });
}
