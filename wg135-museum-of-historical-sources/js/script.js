document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. STATE & CONFIGURATION
    // ==========================================
    let currentSetIndex = 1;
    const TOTAL_SETS = 4;
    const ITEMS_PER_SET = 5;

    const dragSets = {
        1: { base: 'drag-object-base-set1', btnBox: 'drag-object-btn-set1', imgPrefix: 'drag-object-btn-set1-img-', foPrefix: 'fo-drag-object-btn-set1-img-' },
        2: { base: 'drag-object-base-set2', btnBox: 'drag-object-btn-set2', imgPrefix: 'drag-object-btn-set2-img-', foPrefix: 'fo-drag-object-btn-set2-img-' },
        3: { base: 'drag-object-base-set3', btnBox: 'drag-object-btn-set3', imgPrefix: 'drag-object-btn-set3-img-', foPrefix: 'fo-drag-object-btn-set3-img-' },
        4: { base: 'drag-object-base-set4', btnBox: 'drag-object-btn-set4', imgPrefix: 'drag-object-btn-set-4-img-', foPrefix: 'fo-drag-object-btn-set-4-img-' } 
    };

    const museums = {
        '01': { bg: '_01-museum-archaeological-bg', objContainer: '_01-museum-btn-object', prefix: '_01-museum-' },
        '02': { bg: '_02-museum-literany-bg', objContainer: '_02-museum-btn-object', prefix: '_02-museum-' },
        '03': { bg: '_03-museum-artistic-bg', objContainer: '_03-museum-btn-object', prefix: '_03-museum-' },
        '04': { bg: '_04-museum-oral-bg', objContainer: '_04-museum-btn-object', prefix: '_04-museum-' }
    };

    const correctAnswers = {
        '01': '_01-museum-3',
        '02': '_02-museum-1',
        '03': '_03-museum-5',
        '04': '_04-museum-2'
    };

    // ==========================================
    // 2. DOM ELEMENTS
    // ==========================================
    const el = id => document.getElementById(id);
    const svg = document.querySelector('svg');
    const correctContainer = el('correct-dragged-objects');
    
    const ui = {
        feedbackEnd: el('feedback-drag-drop-end'),
        popupClue: el('popup-clue'),
        btnClue: el('btn-clue'), 
        btnCloseClue: el('btn-close-popup-clue'),
        btnChangeGallery: el('btn-change-gallery'),
        questionPanel: el('Question-panel-global'),
        correctMark: el('correct-mark'),
        incorrectMark: el('incorrect-mark'),
        btnNextSet: el('btn-next-set')
    };

    // ==========================================
    // 3. INITIALIZATION
    // ==========================================
    function init() {
        for (let i = 1; i <= TOTAL_SETS; i++) {
            if (el(dragSets[i].base)) el(dragSets[i].base).style.display = 'none';
            if (el(dragSets[i].btnBox)) el(dragSets[i].btnBox).style.display = 'none';
        }
        Object.values(museums).forEach(m => {
            if (el(m.bg)) el(m.bg).style.display = 'none';
            if (el(m.objContainer)) el(m.objContainer).style.display = 'none';
        });

        const hideEls = [ui.feedbackEnd, ui.popupClue, ui.btnChangeGallery, ui.questionPanel, ui.correctMark, ui.incorrectMark];
        hideEls.forEach(element => { if (element) element.style.display = 'none'; });

        if (ui.btnNextSet) ui.btnNextSet.style.display = 'block';

        showSet(currentSetIndex);
        setupDragAndDrop();
    }

    // ==========================================
    // 4. NEXT BUTTON & UI INTERACTIONS
    // ==========================================
    if (ui.btnClue) ui.btnClue.addEventListener('click', () => ui.popupClue.style.display = 'block');
    if (ui.btnCloseClue) ui.btnCloseClue.addEventListener('click', () => ui.popupClue.style.none);
    
    if (ui.btnNextSet) {
        ui.btnNextSet.addEventListener('click', () => {
            if (el(dragSets[currentSetIndex].base)) el(dragSets[currentSetIndex].base).style.display = 'none';
            if (el(dragSets[currentSetIndex].btnBox)) el(dragSets[currentSetIndex].btnBox).style.display = 'none';
            
            if (currentSetIndex < TOTAL_SETS) {
                currentSetIndex++;
                showSet(currentSetIndex);
            } else {
                ui.btnNextSet.style.display = 'none';
                if (ui.btnChangeGallery) ui.btnChangeGallery.style.display = 'block';
                if (ui.feedbackEnd) ui.feedbackEnd.style.display = 'block'; 
            }
        });
    }

    // ==========================================
    // 5. DRAG AND DROP & SNAP LOGIC
    // ==========================================
    function showSet(index) {
        if (dragSets[index]) {
            if (el(dragSets[index].base)) el(dragSets[index].base).style.display = 'block';
            if (el(dragSets[index].btnBox)) el(dragSets[index].btnBox).style.display = 'block';
        }
    }

    function setupDragAndDrop() {
        let activeDragEl = null;
        let startSVGPoint = null;
        let initialMatrix = null;

        for (let s = 1; s <= TOTAL_SETS; s++) {
            for (let i = 1; i <= ITEMS_PER_SET; i++) {
                let imgId = `${dragSets[s].imgPrefix}${i}`;
                let dragEl = el(imgId);
                
                if (dragEl) {
                    dragEl.style.cursor = 'grab';
                    dragEl.addEventListener('pointerdown', (e) => {
                        if (s !== currentSetIndex || dragEl.dataset.dropped === "true") return;
                        
                        activeDragEl = dragEl;
                        
                        // Capture initial SVG coordinates to fix drift
                        const p = svg.createSVGPoint();
                        p.x = e.clientX;
                        p.y = e.clientY;
                        startSVGPoint = p.matrixTransform(svg.getScreenCTM().inverse());
                        
                        // Consolidate current transform into a matrix
                        initialMatrix = dragEl.transform.baseVal.consolidate()?.matrix || svg.createSVGMatrix();

                        dragEl.style.cursor = 'grabbing';
                        dragEl.setPointerCapture(e.pointerId);
                    });
                }
            }
        }

        document.addEventListener('pointermove', (e) => {
            if (!activeDragEl || !startSVGPoint) return;
            e.preventDefault();

            const p = svg.createSVGPoint();
            p.x = e.clientX;
            p.y = e.clientY;
            const currentSVGPoint = p.matrixTransform(svg.getScreenCTM().inverse());

            const dx = currentSVGPoint.x - startSVGPoint.x;
            const dy = (currentSVGPoint.y - startSVGPoint.y) + 75; // Applied +75 offset

            // Apply movement to the clean initial matrix (No creeping)
            const newMatrix = initialMatrix.translate(dx, dy);
            activeDragEl.setAttribute('transform', `matrix(${newMatrix.a},${newMatrix.b},${newMatrix.c},${newMatrix.d},${newMatrix.e},${newMatrix.f})`);
        });

        document.addEventListener('pointerup', (e) => {
            if (!activeDragEl) return;
            
            let targetId = activeDragEl.id;
            let setPrefix = dragSets[currentSetIndex].imgPrefix;
            let itemNum = targetId.replace(setPrefix, '');
            let dropZoneId = `${dragSets[currentSetIndex].foPrefix}${itemNum}-drop-zone`;
            let dropZone = el(dropZoneId);

            if (dropZone && isColliding(activeDragEl, dropZone)) {
                // MOVE TO CORRECT CONTAINER
                if (correctContainer) {
                    correctContainer.appendChild(activeDragEl);
                }

                // Snap and Scale (Correct math for global coordinates)
                snapAndScaleToZone(activeDragEl, dropZone);

                activeDragEl.dataset.dropped = "true";
                activeDragEl.style.cursor = 'default';
            } else {
                // Revert to original matrix
                activeDragEl.setAttribute('transform', `matrix(${initialMatrix.a},${initialMatrix.b},${initialMatrix.c},${initialMatrix.d},${initialMatrix.e},${initialMatrix.f})`);
            }

            activeDragEl.releasePointerCapture(e.pointerId);
            activeDragEl.style.cursor = 'grab';
            activeDragEl = null;
            startSVGPoint = null;
        });
    }

    function isColliding(dragged, target) {
        const rect1 = dragged.getBoundingClientRect();
        const rect2 = target.getBoundingClientRect();
        return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    }

    function snapAndScaleToZone(dragged, zone) {
        const dragBox = dragged.getBBox(); 
        const zoneBox = zone.getBBox(); 
        
        const scale = Math.min(zoneBox.width / dragBox.width, zoneBox.height / dragBox.height); 
        
        // Calculate translation for centering inside global group
        const tx = (zoneBox.x + zoneBox.width / 2) - (dragBox.x + dragBox.width / 2) * scale;
        const ty = (zoneBox.y + zoneBox.height / 2) - (dragBox.y + dragBox.height / 2) * scale  + 75;
        
        dragged.setAttribute('transform', `translate(${tx}, ${ty}) scale(${scale})`);
    }

    // ==========================================
    // 6. GALLERY & MUSEUM SELECTION LOGIC
    // ==========================================
    window.selectMuseumGallery = function(galleryKey) { 
        if (ui.btnChangeGallery) ui.btnChangeGallery.style.display = 'none';
        if (ui.feedbackEnd) ui.feedbackEnd.style.display = 'none';
        
        Object.values(museums).forEach(m => {
            if (el(m.bg)) el(m.bg).style.display = 'none';
            if (el(m.objContainer)) el(m.objContainer).style.display = 'none';
        });

        const selected = museums[galleryKey];
        if (selected) {
            if (el(selected.bg)) el(selected.bg).style.display = 'block';
            if (el(selected.objContainer)) el(selected.objContainer).style.display = 'block';
            if (ui.questionPanel) ui.questionPanel.style.display = 'block';

            setupMuseumInteraction(galleryKey);
        }
    };

    function setupMuseumInteraction(galleryKey) {
        const prefix = museums[galleryKey].prefix;
        for (let i = 1; i <= 5; i++) {
            let objBtn = el(`${prefix}${i}`);
            if (objBtn) {
                let newBtn = objBtn.cloneNode(true);
                objBtn.parentNode.replaceChild(newBtn, objBtn);
                newBtn.addEventListener('click', () => handleMuseumObjectClick(newBtn, galleryKey));
            }
        }
    }

    function handleMuseumObjectClick(clickedElement, galleryKey) {
        ui.correctMark.style.display = 'none';
        ui.incorrectMark.style.display = 'none';

        const isCorrect = (clickedElement.id === correctAnswers[galleryKey]);
        const markToShow = isCorrect ? ui.correctMark : ui.incorrectMark;

        if (markToShow) {
            const targetRect = clickedElement.getBoundingClientRect();
            markToShow.style.display = 'block';
            markToShow.style.position = 'fixed';
            markToShow.style.left = `${targetRect.left + (targetRect.width / 2)}px`;
            markToShow.style.top = `${targetRect.top}px`;
            markToShow.style.transform = 'translate(-50%, -50%)'; 
        }
    }

    init();
});