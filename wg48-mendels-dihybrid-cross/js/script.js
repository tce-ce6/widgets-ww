/**
 * WG48 — Mendel's Dihybrid Cross Simulator
 * ==========================================
 * Stage Flow (aligned to XD Prototype):
 *
 *  Stage 1 → Trait Selection (7 cards, pick 2) → [Next]
 *  Stage 2 → Parental Generation P: Drag P1 + P2 → drop zones → [Generate Gametes]
 *  Stage 3 → Crossing-Over Area: F1 Punnett Square (empty grid shown) → [Auto-fill F1 Punnett Square]
 *  Stage 4 → F1 Self-Pollination: Drag 2 × F1 offspring → [Generate F2 Gametes]
 *  Stage 5 → F2 Punnett Square shown (gametes pre-rendered) → [Next] to reveal ratios
 *  Stage 6 → Genotypic & Phenotypic Ratio display
 *
 * Key SVG element IDs (from index.html analysis):
 *  Stage bases  : stage2_x5F_base, stage3_x5F_base, stage4_x5F_base, stage5_x5F_base
 *  Stage 2 cards: Stage2-_Card_1 … Stage2-_Card_21
 *  Stage 3 gmts : stage3_x5F_Gametes01 … stage3_x5F_Gametes21
 *  Stage 4 cards: Stage4-_Card_1 … Stage4-_Card_21
 *  Stage 5 gmts : stage5_x5F_Gametes_01 … stage5_x5F_Gametes_21
 *  Stage 6 ratios: stage5_x5F_Genotypic_Ratio_x5F_01 … _21
 *
 *  Buttons:
 *    Next (S1→S2)  : #Next (inside Buttons_x5F_all_stages)
 *    Gen Gametes   : #Generate_Gametes         → triggers Stage 3
 *    Auto-fill F1  : #Next2 (wraps Auto-fill label) → triggers Stage 4 (ONLY when clicked)
 *    Gen F2 Gametes: #Generate_F2_Gametes      → triggers Stage 5
 *    Next (S5→S6)  : #Next4                    → triggers Stage 6 (reveals ratios)
 *    Reset / Reset All: #Reset, #Reset-2 or querySelector
 *
 *  Trait Card groups (Stage 1, inside Cards_x5F_01_x5F_Default):
 *    Group_4-2  (Seed Shape), Group_5-2  (Seed Colour), Group_6-2 (Flower Colour)
 *    Group_7-2  (Pod Shape),  Group_8-2  (Pod Colour),  Group_9-2 (Flower Position)
 *    Group_10-2 (Stem Height)
 */

/* ─────────────────────────────────────────────
   GLOBAL STATE
   ───────────────────────────────────────────── */
const WidgetState = {
    stage: 1,
    selectedTraits: [],     // indices 0-6
    combinationId: null,    // 1-21

    // Stage 2 drop state
    s2: { p1Dropped: false, p2Dropped: false },
    // Stage 4 drop state
    s4: { f1_1Dropped: false, f1_2Dropped: false },

    // F1 autofill gate — must be true before goToStage4 fires
    f1Autofilled: false,

    // Drag engine
    activeDrag: null,
    dragStartSVG: { x: 0, y: 0 },
    dragOriginTranslate: { x: 0, y: 0 },
    originalTransforms: new Map()
};

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
   UI CACHE
   ───────────────────────────────────────────── */
const UI = {
    svg: null,

    // Layer: Stage 1 cards
    stage1Layer: null,
    traitCards: [],          // Array<SVGElement> length 7

    // Stage base containers
    s2Base: null,
    s3Base: null,
    s4Base: null,
    s5Base: null,

    // 21 per-combination groups
    s2Cards: [],             // Stage2-_Card_1 … 21
    s3Gametes: [],           // stage3_x5F_Gametes01 … 21
    s4Cards: [],             // Stage4-_Card_1 … 21
    s5Gametes: [],           // stage5_x5F_Gametes_01 … 21
    s6Ratios: [],            // stage5_x5F_Genotypic_Ratio_x5F_01 … 21

    // Buttons
    btnNext: null,           // Stage 1 → 2
    btnGenGametes: null,     // Stage 2 → 3
    btnAutoFillF1: null,     // Stage 3 → 4  (SVG id: Next2)
    btnGenF2Gametes: null,   // Stage 4 → 5
    btnNextS5: null,         // Stage 5 → 6  (SVG id: Next4)
    btnResetAll: null,
    btnReset: null,

    // Drop zones (rect elements with class st235)
    p1Drop: null,
    p2Drop: null,
    f1Drop1: null,
    f1Drop2: null
};

/* ─────────────────────────────────────────────
   UTILITY
   ───────────────────────────────────────────── */
function show(el) {
    if (!el) return;
    el.style.display = 'block';
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

    // Stage 1 layer
    UI.stage1Layer = document.getElementById('Cards_x5F_01_x5F_Default');

    // Trait card groups — explicit IDs in order: Seed Shape, Seed Colour, Flower Colour,
    // Pod Shape, Pod Colour, Flower Position, Stem Height
    const traitGroupIds = ['Group_4-2', 'Group_5-2', 'Group_6-2', 'Group_7-2', 'Group_8-2', 'Group_9-2', 'Group_10-2'];
    UI.traitCards = traitGroupIds.map(id => document.getElementById(id)).filter(Boolean);

    // Stage base layers
    UI.s2Base = document.getElementById('stage2_x5F_base');
    UI.s3Base = document.getElementById('stage3_x5F_base');
    UI.s4Base = document.getElementById('stage4_x5F_base');
    UI.s5Base = document.getElementById('stage5_x5F_base');

    // 21 combination groups
    for (let i = 1; i <= 21; i++) {
        const pad2 = String(i).padStart(2, '0');
        UI.s2Cards.push(document.getElementById(`Stage2-_Card_${i}`));
        UI.s3Gametes.push(document.getElementById(`stage3_x5F_Gametes${pad2}`));
        UI.s4Cards.push(document.getElementById(`Stage4-_Card_${i}`));
        UI.s5Gametes.push(document.getElementById(`stage5_x5F_Gametes_${pad2}`));
        UI.s6Ratios.push(document.getElementById(`stage5_x5F_Genotypic_Ratio_x5F_${pad2}`));
    }

    // Buttons — using SVG wrapper group IDs (not the inner text groups)
    UI.btnNext = document.getElementById('Next');    // S1 Next (Group_594 wrapper)
    UI.btnGenGametes = document.getElementById('Next1');   // S2 → S3: wraps Generate_Gametes text
    UI.btnAutoFillF1 = document.getElementById('Next2');   // S3 → S4: wraps Auto-fill F1 text
    UI.btnGenF2Gametes = document.getElementById('Next3');   // S4 → S5: wraps Generate F2 Gametes text
    UI.btnNextS5 = document.getElementById('Next4');   // S5 → S6: wraps Next text
    UI.btnResetAll = document.getElementById('Reset_All');
    UI.btnReset = document.getElementById('Reset');

    // Drop zones — st235 rects inside each base layer
    _resolveDropZones();

    console.log('[WG48] Cache summary:',
        'traitCards:', UI.traitCards.length,
        's2Cards:', UI.s2Cards.filter(Boolean).length,
        's3Gametes:', UI.s3Gametes.filter(Boolean).length,
        's4Cards:', UI.s4Cards.filter(Boolean).length,
        's5Gametes:', UI.s5Gametes.filter(Boolean).length,
        's6Ratios:', UI.s6Ratios.filter(Boolean).length,
        'btnGenGametes:', !!UI.btnGenGametes, '(Next1)',
        'btnAutoFillF1:', !!UI.btnAutoFillF1, '(Next2)',
        'btnGenF2Gametes:', !!UI.btnGenF2Gametes, '(Next3)',
        'btnNextS5:', !!UI.btnNextS5, '(Next4)'
    );
}

function _resolveDropZones() {
    // Stage 2 drop zones — two st235 rects inside stage2_x5F_base
    if (UI.s2Base) {
        const rects = UI.s2Base.querySelectorAll('.st235');
        if (rects.length >= 2) {
            UI.p1Drop = rects[0];
            UI.p2Drop = rects[1];
            console.log('[WG48] Stage 2 drop zones resolved:', !!UI.p1Drop, !!UI.p2Drop);
        } else {
            console.warn('[WG48] Stage 2 drop zones not found (expected st235 rects in s2Base)');
        }
    }
    // Stage 4 drop zones — two st235 rects inside stage4_x5F_base
    if (UI.s4Base) {
        const rects = UI.s4Base.querySelectorAll('.st235');
        if (rects.length >= 2) {
            UI.f1Drop1 = rects[0];
            UI.f1Drop2 = rects[1];
            console.log('[WG48] Stage 4 drop zones resolved:', !!UI.f1Drop1, !!UI.f1Drop2);
        } else {
            console.warn('[WG48] Stage 4 drop zones not found (expected st235 rects in s4Base)');
        }
    }
}

/* ─────────────────────────────────────────────
   EVENT SETUP
   ───────────────────────────────────────────── */
function setupEvents() {
    // --- Stage 1: trait card clicks ---
    UI.traitCards.forEach((card, idx) => {
        card.style.cursor = 'pointer';
        card.addEventListener('pointerdown', () => onTraitClick(idx));
    });

    // --- Navigation buttons ---
    _btnOn(UI.btnNext, onNextClick);

    // Generate Gametes (S2 → S3) — only fires when both parents dropped
    _btnOn(UI.btnGenGametes, () => {
        if (WidgetState.s2.p1Dropped && WidgetState.s2.p2Dropped) {
            console.log('[WG48] Generate Gametes clicked → Stage 3');
            goToStage3();
        } else {
            console.warn('[WG48] Generate Gametes blocked — both parents not dropped yet');
        }
    });

    // Auto-fill F1 (S3 → S4) — critical gate: only works when in Stage 3
    _btnOn(UI.btnAutoFillF1, () => {
        if (WidgetState.stage !== 3) { return; }
        console.log('[WG48] Auto-fill F1 clicked → Stage 4');
        WidgetState.f1Autofilled = true;
        goToStage4();
    });

    // Generate F2 Gametes (S4 → S5) — only fires when both F1s dropped
    _btnOn(UI.btnGenF2Gametes, () => {
        if (WidgetState.s4.f1_1Dropped && WidgetState.s4.f1_2Dropped) {
            console.log('[WG48] Generate F2 Gametes clicked → Stage 5');
            goToStage5();
        } else {
            console.warn('[WG48] Generate F2 Gametes blocked — F1 offspring not dropped yet');
        }
    });

    // Next (S5 → S6 ratios)
    _btnOn(UI.btnNextS5, () => {
        if (WidgetState.stage !== 5) { return; }
        console.log('[WG48] Next (stage 5) clicked → Stage 6 ratios');
        goToStage6();
    });

    // Reset buttons
    _btnOn(UI.btnReset, resetWidget);
    _btnOn(UI.btnResetAll, resetWidget);

    // SVG-level pointer events for drag engine
    if (UI.svg) {
        UI.svg.addEventListener('pointermove', onDragMove);
        UI.svg.addEventListener('pointerup', onDragEnd);
        UI.svg.addEventListener('pointerleave', onDragEnd);
    }
}

/** Attach pointer cursor + pointerup listener to an SVG button group */
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
        console.log(`[WG48] Deselected trait ${idx}. Selection now:`, WidgetState.selectedTraits);
    } else if (WidgetState.selectedTraits.length < 2) {
        WidgetState.selectedTraits.push(idx);
        console.log(`[WG48] Selected trait ${idx}. Selection now:`, WidgetState.selectedTraits);
    } else {
        console.warn('[WG48] Cannot select more than 2 traits');
        return;
    }

    _updateTraitHighlights();
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
    console.log('[WG48] Next clicked. Stage:', WidgetState.stage, 'Traits:', WidgetState.selectedTraits);
    if (WidgetState.stage === 1 && WidgetState.selectedTraits.length === 2) {
        WidgetState.combinationId = getCombinationId(
            WidgetState.selectedTraits[0],
            WidgetState.selectedTraits[1]
        );
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
}

function goToStage2() {
    console.log('[WG48] ▶ Stage 2 — Parental Generation');
    WidgetState.stage = 2;

    hideAllStages();
    hide(UI.btnNext);

    show(UI.s2Base);
    const card = UI.s2Cards[WidgetState.combinationId - 1];
    show(card);

    // Reset drop state
    WidgetState.s2.p1Dropped = false;
    WidgetState.s2.p2Dropped = false;

    // Disable Generate Gametes until both parents dropped
    disableBtn(UI.btnGenGametes);

    // Make draggables in this card
    _setupDraggables(card, ['s2P1', 's2P2']);
}

function goToStage3() {
    console.log('[WG48] ▶ Stage 3 — Crossing Over / F1 Punnett (empty)');
    WidgetState.stage = 3;

    hideAllStages();

    show(UI.s3Base);
    show(UI.s3Gametes[WidgetState.combinationId - 1]);

    // Auto-fill button shown and ENABLED — user must click it
    enableBtn(UI.btnAutoFillF1);

    disableBtn(UI.btnGenF2Gametes);
}

function goToStage4() {
    console.log('[WG48] ▶ Stage 4 — F1 Self-Pollination');
    WidgetState.stage = 4;

    hideAllStages();

    show(UI.s4Base);
    const card = UI.s4Cards[WidgetState.combinationId - 1];
    show(card);

    // Reset F1 drop state
    WidgetState.s4.f1_1Dropped = false;
    WidgetState.s4.f1_2Dropped = false;

    disableBtn(UI.btnGenF2Gametes);

    // Make F1 cards draggable
    _setupDraggables(card, ['s4F1_1', 's4F1_2']);
}

function goToStage5() {
    console.log('[WG48] ▶ Stage 5 — F2 Punnett Square');
    WidgetState.stage = 5;

    hideAllStages();

    show(UI.s5Base);
    show(UI.s5Gametes[WidgetState.combinationId - 1]);

    // Enable the "Next" button in stage 5 to go to ratio stage
    enableBtn(UI.btnNextS5);
    // Ratios hidden until "Next" clicked
    hide(UI.s6Ratios[WidgetState.combinationId - 1]);
}

function goToStage6() {
    console.log('[WG48] ▶ Stage 6 — Genotypic & Phenotypic Ratios');
    WidgetState.stage = 6;

    // Show ratios (keep F2 base + gametes visible)
    show(UI.s6Ratios[WidgetState.combinationId - 1]);
}

/* ─────────────────────────────────────────────
   DRAG & DROP ENGINE
   ───────────────────────────────────────────── */

/**
 * Find the first two direct <g> children of `container` that are draggable.
 * Assigns data-drag-role from `roles` array. Only the first 2 children are made draggable.
 */
function _setupDraggables(container, roles) {
    if (!container) { console.warn('[WG48] _setupDraggables: container is null'); return; }

    // Get the direct-child <g> elements (the card groups)
    const drags = Array.from(container.children).filter(el => el.tagName === 'g');
    const count = Math.min(drags.length, roles.length);

    console.log(`[WG48] _setupDraggables: found ${drags.length} child groups, making ${count} draggable`);

    for (let i = 0; i < count; i++) {
        const el = drags[i];
        el.style.cursor = 'grab';
        el.setAttribute('data-drag-role', roles[i]);
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
    WidgetState.activeDrag = el;
    el.style.cursor = 'grabbing';
    el.parentNode.appendChild(el); // raise to top

    // Current SVG position under parent CTM
    const pt = UI.svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const parentCTM = el.parentNode.getCTM();
    const svgPt = pt.matrixTransform(parentCTM.inverse());
    WidgetState.dragStartSVG = { x: svgPt.x, y: svgPt.y };

    // Current translate offset of the element
    const tx = el.getAttribute('transform') || '';
    const match = tx.match(/translate\(\s*([\d.-]+)[,\s]+([\d.-]+)\s*\)/);
    WidgetState.dragOriginTranslate = {
        x: match ? parseFloat(match[1]) : 0,
        y: match ? parseFloat(match[2]) : 0
    };
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
        `translate(${WidgetState.dragOriginTranslate.x + dx}, ${WidgetState.dragOriginTranslate.y + dy})`
    );
}

function onDragEnd(e) {
    const el = WidgetState.activeDrag;
    if (!el) return;

    el.setAttribute('pointer-events', 'visiblePainted');
    el.style.cursor = 'grab';

    const role = el.getAttribute('data-drag-role');
    let dropZone = null;
    if (role === 's2P1') dropZone = UI.p1Drop;
    if (role === 's2P2') dropZone = UI.p2Drop;
    if (role === 's4F1_1') dropZone = UI.f1Drop1;
    if (role === 's4F1_2') dropZone = UI.f1Drop2;

    if (dropZone && _overlaps(el, dropZone)) {
        console.log(`[WG48] Dropped ${role} into target`);
        _snapToZone(el, dropZone);
        el.style.pointerEvents = 'none';
        el.style.cursor = 'default';

        // Update state
        if (role === 's2P1') {
            WidgetState.s2.p1Dropped = true;
            _checkS2Complete();
        } else if (role === 's2P2') {
            WidgetState.s2.p2Dropped = true;
            _checkS2Complete();
        } else if (role === 's4F1_1') {
            WidgetState.s4.f1_1Dropped = true;
            _checkS4Complete();
        } else if (role === 's4F1_2') {
            WidgetState.s4.f1_2Dropped = true;
            _checkS4Complete();
        }
    } else {
        // Snap back
        const orig = WidgetState.originalTransforms.get(el);
        if (orig !== undefined) el.setAttribute('transform', orig);
        console.log(`[WG48] ${role} returned to original position`);
    }
    WidgetState.activeDrag = null;
}

/** Loose bounding-box intersection — accepts any overlap */
function _overlaps(elA, elB) {
    const a = elA.getBoundingClientRect();
    const b = elB.getBoundingClientRect();
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

/** Snap dragged element so its centre aligns with the drop zone centre */
function _snapToZone(dragEl, dropEl) {
    const dBB = dragEl.getBoundingClientRect();
    const zBB = dropEl.getBoundingClientRect();

    // Target centre in screen coords
    const targetCX = zBB.left + zBB.width / 2;
    const targetCY = zBB.top + zBB.height / 2;

    // Dragged-element centre in screen coords
    const dragCX = dBB.left + dBB.width / 2;
    const dragCY = dBB.top + dBB.height / 2;

    // Delta in screen pixels
    const dxPx = targetCX - dragCX;
    const dyPx = targetCY - dragCY;

    // Convert screen delta to SVG unit delta using parent CTM scale
    const ctm = dragEl.parentNode.getCTM();
    const dxSVG = dxPx / ctm.a;
    const dySVG = dyPx / ctm.d;

    // Current translate
    const tx = dragEl.getAttribute('transform') || '';
    const match = tx.match(/translate\(\s*([\d.-]+)[,\s]+([\d.-]+)\s*\)/);
    const cx = match ? parseFloat(match[1]) : 0;
    const cy = match ? parseFloat(match[2]) : 0;

    dragEl.setAttribute('transform', `translate(${cx + dxSVG}, ${cy + dySVG})`);
}

function _checkS2Complete() {
    console.log(`[WG48] S2 check — P1:${WidgetState.s2.p1Dropped} P2:${WidgetState.s2.p2Dropped}`);
    if (WidgetState.s2.p1Dropped && WidgetState.s2.p2Dropped) {
        enableBtn(UI.btnGenGametes);
        console.log('[WG48] Both parents dropped → Generate Gametes enabled');
    }
}

function _checkS4Complete() {
    console.log(`[WG48] S4 check — F1_1:${WidgetState.s4.f1_1Dropped} F1_2:${WidgetState.s4.f1_2Dropped}`);
    if (WidgetState.s4.f1_1Dropped && WidgetState.s4.f1_2Dropped) {
        enableBtn(UI.btnGenF2Gametes);
        console.log('[WG48] Both F1 offspring dropped → Generate F2 Gametes enabled');
    }
}

/* ─────────────────────────────────────────────
   RESET
   ───────────────────────────────────────────── */
function resetWidget() {
    console.log('[WG48] Reset — returning to Stage 1');
    WidgetState.stage = 1;
    WidgetState.selectedTraits = [];
    WidgetState.combinationId = null;
    WidgetState.f1Autofilled = false;
    WidgetState.s2.p1Dropped = false;
    WidgetState.s2.p2Dropped = false;
    WidgetState.s4.f1_1Dropped = false;
    WidgetState.s4.f1_2Dropped = false;

    // Restore dragged elements
    WidgetState.originalTransforms.forEach((origTx, el) => {
        el.setAttribute('transform', origTx);
        el.style.pointerEvents = '';
        el.style.cursor = '';
    });

    hideAllStages();
    _updateTraitHighlights();
    show(UI.stage1Layer);
    show(UI.btnNext);

    disableBtn(UI.btnGenGametes);
    disableBtn(UI.btnGenF2Gametes);
}
