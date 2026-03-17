document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. STATE & CONFIGURATION
    // ==========================================
    let currentSetIndex = 1;
    let itemsDroppedInCurrentSet = 0;
    const TOTAL_SETS = 4;
    const ITEMS_PER_SET = 5;
    let isActivityComplete = false;

    const dragSets = {
        1: { base: 'drag-object-base-set1', btnBox: 'drag-object-btn-set1', imgPrefix: 'drag-object-btn-set1-img-', foPrefix: 'fo-drag-object-btn-set1-img-' },
        2: { base: 'drag-object-base-set2', btnBox: 'drag-object-btn-set2', imgPrefix: 'drag-object-btn-set2-img-', foPrefix: 'fo-drag-object-btn-set2-img-' },
        3: { base: 'drag-object-base-set3', btnBox: 'drag-object-btn-set3', imgPrefix: 'drag-object-btn-set3-img-', foPrefix: 'fo-drag-object-btn-set3-img-' },
        4: { base: 'drag-object-base-set4', btnBox: 'drag-object-btn-set4', imgPrefix: 'drag-object-btn-set-4-img-', foPrefix: 'fo-drag-object-btn-set-4-img-' } 
    };

    const museums = {
        '01': { bg: '_01-museum-archaeological-bg', objContainer: '_01-museum-btn-object', prefix: '_01-museum-' },
        '02': { bg: '_02-museum-literary-bg', objContainer: '_02-museum-btn-object', prefix: '_02-museum-' },
        '03': { bg: '_03-museum-artistic-bg', objContainer: '_03-museum-btn-object', prefix: '_03-museum-' },
        '04': { bg: '_04-museum-oral-bg', objContainer: '_04-museum-btn-object', prefix: '_04-museum-' }
    };

    // New Configuration for Multiple Questions & Clues
   const galleryData = {
        '01': { 
            currentQuestionIndex: 0,
            questions: [
                { 
                    question: "An artefact that was used by merchants to identify their goods in ancient trade", 
                    clue: "Ancient traders pressed this tiny stone object into wet clay as a signature. It bears mysterious symbols and writing that no scholar has yet been able to decode.",
                    correctId: "_01-museum-1" 
                },
                { 
                    question: "An artefact from the Gupta period that shows how rulers used precious metal to display their power", 
                    clue: "This precious metal from India’s ‘Golden Age’ depicts the warrior-king holding his weapon with near-perfect craftsmanship",
                    correctId: "_01-museum-2" 
                }
            ]
        },
        '02': { 
            currentQuestionIndex: 0,
            questions: [
                { 
                    question: "An ancient text that provides detailed instructions on governance and economics", 
                    clue: "Written by the clever minister Kautilya, this guide taught kings the tricks of ruling—from collecting taxes to sending secret agents to gather information.",
                    correctId: "_02-museum-1" 
                },
                { 
                    question: "An account that describes the grandeur of an ancient Indian capital through the eyes of a Greek ambassador", 
                    clue: "A Greek traveller visited Pataliputra during Chandragupta Maurya's reign and couldn't believe the city's riches and size—his book vanished, but later writers copied his incredible stories!",
                    correctId: "_02-museum-2" 
                }
            ]
        },
        '03': { 
            currentQuestionIndex: 0,
            questions: [
                { 
                    question: "A bronze masterpiece from South India shows a deity performing the cosmic dance within a ring of flame.", 
                    clue: "This Chola bronze masterpiece is famous for high level of art and metalworking skill in medieval South India",
                    correctId: "_03-museum-1" 
                },
                { 
                    question: "A prehistoric artwork showing the earliest evidence of human creativity in India", 
                    clue: "Ancient cave dwellers painted hunting scenes on rock shelter walls using colors made from natural minerals and plants—it shows how prehistoric humans lived!",
                    correctId: "_03-museum-2" 
                }
            ]
        },
        '04': { 
            currentQuestionIndex: 0,
            questions: [
                { 
                    question: "An ancient poetry tradition was composed by court poets and was transmitted orally for two millennia before being written down", 
                    clue: "These Tamil verses were performed at royal gatherings where poets competed—their amazing memories kept the poems alive across many generations!",
                    correctId: "_04-museum-1" 
                },
                { 
                    question: "A devotional poetry form that uses simple, rhythmic Marathi verses and became the voice of Maharashtra's Bhakti movement", 
                    clue: "Pilgrims sing these spiritual songs on their long journey to Pandharpur temple—saints like Tukaram created them so common people could express their devotion",
                    correctId: "_04-museum-2" 
                }
            ]
        }
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
        popupCLueText: el('clue-text-content'),
        questionText: el('question-text'),
        btnClue: el('btn-clue'), 
        btnCloseClue: el('btn-close-popup-clue'),
        btnChangeGallery: el('btn-change-gallery'),
        questionPanel: el('Question-panel-global'),
        correctMark: el('correct-mark'),
        incorrectMark: el('incorrect-mark'),
        btnNextSet: el('btn-next-set'),
        dragBaseGlobal: el('drag-object-base-global'),
        iText01: document.querySelector('#i-text-01 tspan'),
        btnCloseFeedback: el('close-feedback'),
        museumDropWindow: el('museum-drop-window'),
        correctDraggedObjects: el('correct-dragged-objects'),
        hallwayGalleries: {
            '01': el('archaeological-source-gallery'),
            '02': el('literary-source-gallery'),
            '03': el('artistic-source-gallery'),
            '04': el('oral-source-gallery')
        }
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

        const hideEls = [ui.feedbackEnd, ui.popupClue, ui.btnChangeGallery, ui.questionPanel, ui.correctMark, ui.incorrectMark, ui.btnClue];
        hideEls.forEach(element => { if (element) element.style.display = 'none'; });

        if (ui.btnNextSet) {
            ui.btnNextSet.style.display = 'block';
            ui.btnNextSet.style.pointerEvents = 'none';
            ui.btnNextSet.style.opacity = '0.5';
        }

        showSet(currentSetIndex);
        setupDragAndDrop();

        Object.entries(ui.hallwayGalleries).forEach(([key, hall]) => {
            if (hall) {
                hall.style.cursor = 'pointer';
                hall.addEventListener('click', () => {
                    if (isActivityComplete) {
                        window.selectMuseumGallery(key);
                    }
                });
            }
        });
    }

    // ==========================================
    // 4. NEXT BUTTON & UI INTERACTIONS
    // ==========================================
    if (ui.btnClue) ui.btnClue.addEventListener('click', () => ui.popupClue.style.display = 'block');
    if (ui.btnCloseClue) ui.btnCloseClue.addEventListener('click', () => ui.popupClue.style.display = 'none');
    
    if (ui.btnCloseFeedback) {
        ui.btnCloseFeedback.addEventListener('click', () => {
            if (ui.feedbackEnd) ui.feedbackEnd.style.display = 'none';
            isActivityComplete = true;
        });
    }

    if (ui.btnChangeGallery) {
        ui.btnChangeGallery.addEventListener('click', () => {
            Object.values(museums).forEach(m => {
                if (el(m.bg)) el(m.bg).style.display = 'none';
                if (el(m.objContainer)) el(m.objContainer).style.display = 'none';
            });
            if (ui.questionPanel) ui.questionPanel.style.display = 'none';
            if (ui.correctMark) ui.correctMark.style.display = 'none';
            if (ui.incorrectMark) ui.incorrectMark.style.display = 'none';
            if (ui.btnClue) ui.btnClue.style.display = 'none';
            if (ui.btnChangeGallery) ui.btnChangeGallery.style.display = 'none';
            if (ui.museumDropWindow) ui.museumDropWindow.style.display = 'block';
            if (ui.correctDraggedObjects) ui.correctDraggedObjects.style.display = 'block';
        });
    }

    if (ui.btnNextSet) {
        ui.btnNextSet.addEventListener('click', () => {
            if (el(dragSets[currentSetIndex].base)) el(dragSets[currentSetIndex].base).style.display = 'none';
            if (el(dragSets[currentSetIndex].btnBox)) el(dragSets[currentSetIndex].btnBox).style.display = 'none';
            
            if (currentSetIndex < TOTAL_SETS) {
                currentSetIndex++;
                itemsDroppedInCurrentSet = 0;
                if (ui.btnNextSet) {
                    ui.btnNextSet.style.pointerEvents = 'none';
                    ui.btnNextSet.style.opacity = '0.5';
                    if (currentSetIndex === TOTAL_SETS) {
                        ui.btnNextSet.style.display = 'none';
                    }
                }
                showSet(currentSetIndex);
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
                        e.preventDefault();
                        if (s !== currentSetIndex || dragEl.dataset.dropped === "true") return;
                        
                        activeDragEl = dragEl;
                        
                        const p = svg.createSVGPoint();
                        p.x = e.clientX;
                        p.y = e.clientY;
                        startSVGPoint = p.matrixTransform(svg.getScreenCTM().inverse());
                        
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
            const dy = (currentSVGPoint.y - startSVGPoint.y) + 75; 

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
                if (correctContainer) {
                    correctContainer.appendChild(activeDragEl);
                }

                snapAndScaleToZone(activeDragEl, dropZone);

                activeDragEl.dataset.dropped = "true";
                activeDragEl.style.cursor = 'default';
                
                itemsDroppedInCurrentSet++;
                if (itemsDroppedInCurrentSet === ITEMS_PER_SET) {
                    if (currentSetIndex < TOTAL_SETS) {
                        if (ui.btnNextSet) {
                            ui.btnNextSet.style.pointerEvents = 'auto';
                            ui.btnNextSet.style.opacity = '1';
                        }
                    } else {
                        if (el(dragSets[currentSetIndex].base)) el(dragSets[currentSetIndex].base).style.display = 'none';
                        if (el(dragSets[currentSetIndex].btnBox)) el(dragSets[currentSetIndex].btnBox).style.display = 'none';
                        if (ui.dragBaseGlobal) ui.dragBaseGlobal.style.display = 'none';
                        if (ui.btnNextSet) ui.btnNextSet.style.display = 'none';
                        if (ui.iText01) ui.iText01.textContent = "Click the gallery to explore the artifacts.";
                        
                        if (ui.feedbackEnd) ui.feedbackEnd.style.display = 'block';
                    }
                }
            } else {
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
        
        const tx = (zoneBox.x + zoneBox.width / 2) - (dragBox.x + dragBox.width / 2) * scale;
        const ty = (zoneBox.y + zoneBox.height / 2) - (dragBox.y + dragBox.height / 2) * scale  + 75;
        
        dragged.setAttribute('transform', `translate(${tx}, ${ty}) scale(${scale})`);
    }

    // ==========================================
    // 6. GALLERY, MULTI-QUESTION & MUSEUM SELECTION LOGIC
    // ==========================================
    
    function updateClueUI(galleryKey) {
        const currentData = galleryData[galleryKey];
        const activeData = currentData.questions[currentData.currentQuestionIndex];

        if (ui.questionText) {
            ui.questionText.innerHTML = activeData.question;
        }

        const clueTextEl = ui.popupCLueText;
        if (clueTextEl) {
            clueTextEl.innerHTML = activeData.clue;
        }
    }

    window.selectMuseumGallery = function(galleryKey) { 
        if (ui.btnChangeGallery) ui.btnChangeGallery.style.display = 'block';
        if (ui.btnClue) ui.btnClue.style.display = 'block';
        if (ui.feedbackEnd) ui.feedbackEnd.style.display = 'none';
        if (ui.museumDropWindow) ui.museumDropWindow.style.display = 'none';
        if (ui.correctDraggedObjects) ui.correctDraggedObjects.style.display = 'none';
        
        Object.values(museums).forEach(m => {
            if (el(m.bg)) el(m.bg).style.display = 'none';
            if (el(m.objContainer)) el(m.objContainer).style.display = 'none';
        });

        const selected = museums[galleryKey];
        if (selected) {
            if (el(selected.bg)) el(selected.bg).style.display = 'block';
            if (el(selected.objContainer)) el(selected.objContainer).style.display = 'block';
            if (ui.questionPanel) ui.questionPanel.style.display = 'block';

            galleryData[galleryKey].currentQuestionIndex = 0;
            updateClueUI(galleryKey);

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
        // First hide any active marks
        if (ui.correctMark) ui.correctMark.style.display = 'none';
        if (ui.incorrectMark) ui.incorrectMark.style.display = 'none';

        const currentData = galleryData[galleryKey];
        const activeQuestion = currentData.questions[currentData.currentQuestionIndex];

        const isCorrect = (clickedElement.id === activeQuestion.correctId);
        const markToShow = isCorrect ? ui.correctMark : ui.incorrectMark;

        if (markToShow) {
            // Display the mark block before getting bounding box (Firefox workaround)
            markToShow.style.display = 'block';

            // Get local coordinate system boundaries to calculate the transform properly 
            const targetBBox = clickedElement.getBBox();
            const markBBox = markToShow.getBBox();

            // Find center points 
            const targetCenterX = targetBBox.x + (targetBBox.width / 2);
            const targetCenterY = targetBBox.y + (targetBBox.height / 2);
            
            const markCenterX = markBBox.x + (markBBox.width / 2);
            const markCenterY = markBBox.y + (markBBox.height / 2);

            // Calculate translation offsets to place mark perfectly in the center
            const tx = targetCenterX - markCenterX;
            const ty = targetCenterY - markCenterY - 80;

            // Apply SVG transform
            markToShow.setAttribute('transform', `translate(${tx}, ${ty})`);
        }

        // Handle progression or retry after selection
        if (isCorrect) {
            setTimeout(() => {
                if (ui.correctMark) ui.correctMark.style.display = 'none'; 
                
                if (currentData.currentQuestionIndex < currentData.questions.length - 1) {
                    currentData.currentQuestionIndex++;
                    updateClueUI(galleryKey);
                } else {
                    console.log("Gallery Complete!");
                }
            }, 1500); 
        } else {
            // Also fade incorrect mark so the user can try again easily
            setTimeout(() => {
                if (ui.incorrectMark) ui.incorrectMark.style.display = 'none'; 
            }, 1500);
        }
    }

    window.bypassPhase1 = () => {
        isActivityComplete = true;
        for (let i = 1; i <= TOTAL_SETS; i++) {
            if (el(dragSets[i].base)) el(dragSets[i].base).style.display = 'none';
            if (el(dragSets[i].btnBox)) el(dragSets[i].btnBox).style.display = 'none';
        }
        if (ui.dragBaseGlobal) ui.dragBaseGlobal.style.display = 'none';
        if (ui.btnNextSet) ui.btnNextSet.style.display = 'none';
        if (ui.iText01) ui.iText01.textContent = "Click the gallery to explore the artifacts.";
        if (ui.feedbackEnd) ui.feedbackEnd.style.display = 'none';
        console.log("Phase 1 bypassed. Galleries are now selectable.");
    };

    init();
});