document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. STATE & CONFIGURATION
    // ==========================================
    let currentSetIndex = 1;
    let itemsDroppedInCurrentSet = 0;
    const TOTAL_SETS = 4;
    const ITEMS_PER_SET = 5;
    let isActivityComplete = false;
    
    // Track which galleries have been completed
    const completedGalleries = new Set();
    let correctAnimationInstance = null;
    let incorrectAnimationInstance = null;

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
            completed: false,
            questions: [
                { 
                    question: "An artefact that was used by merchants to identify their goods in ancient trade", 
                    clue: "Ancient traders pressed this tiny stone object into wet clay as a signature. It bears mysterious symbols and writing that no scholar has yet been able to decode.",
                    correctId: "_01-museum-5"
                },
                { 
                    question: "An artefact from the Gupta period that shows how rulers used precious metal to display their power", 
                    clue: "A goddess sits at its centre because this king believed his power came straight from the divine.",
                    correctId: "_01-museum-2" 
                }
            ]
        },
        '02': { 
            currentQuestionIndex: 0,
            completed: false,
            questions: [
                { 
                    question: "An ancient text that provides detailed instructions on governance and economics", 
                    clue: "Written by the clever minister Kautilya, this guide taught kings the tricks of ruling — from collecting taxes to sending secret agents to gather information.",
                    correctId: "_02-museum-5" 
                },
                { 
                    question: "An account that describes the grandeur of an ancient Indian capital through the eyes of a Greek ambassador", 
                    clue: "A Greek traveller visited Pataliputra during Chandragupta Maurya's reign and couldn't believe the city's riches and size his book vanished, but later writers copied his incredible stories!",
                    correctId: "_02-museum-1" 
                }
            ]
        },
        '03': { 
            currentQuestionIndex: 0,
            completed: false,
            questions: [
                { 
                    question: "A bronze masterpiece from South India shows a deity performing the cosmic dance within a ring of flame.", 
                    clue: "This Chola bronze masterpiece is famous for high level of art and metalworking skill in medieval South India",
                    correctId: "_03-museum-4" 
                },
                { 
                    question: "A prehistoric artwork showing the earliest evidence of human creativity in India", 
                    clue: "Ancient cave dwellers painted hunting scenes on rock shelter walls using colors made from natural minerals and plants. — It shows how prehistoric humans lived!",
                    correctId: "_03-museum-1" 
                }
            ]
        },
        '04': { 
            currentQuestionIndex: 0,
            completed: false,
            questions: [
                { 
                    question: "An ancient poetry tradition was composed by court poets and was transmitted orally for two millennia before being written down", 
                    clue: "These Tamil verses were performed at royal gatherings where poets competed— their amazing memories kept the poems alive across many generations!",
                    correctId: "_04-museum-5" 
                },
                { 
                    question: "A devotional poetry form that uses simple, rhythmic Marathi verses and became the voice of Maharashtra's Bhakti movement", 
                    clue: "Pilgrims sing these spiritual songs on their long journey to Pandharpur temple—Saints like Tukaram created them so common people could express their devotion",
                    correctId: "_04-museum-4" 
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
    // 2b. AUDIO BUTTONS
    // ==========================================
    const audioConfig = {
        'btn-audio-abhang': './assets/abhang.mp3',
        'btn-audio-kabir-dohe': './assets/kabir-dohe.mp3',
        'btn-audio-sangam-poetry': './assets/sangam-poetry.mp3',
        'btn-audio-folk-song-rajput': './assets/folk-song-by-rajput.mp3',
        'btn-audio-folk-halahal-kumar': './assets/folk-halahal-kumar.mp3',
    };
    const audioPlayers = {};
    let activeAudioId = null;

    function setupAudioButtons() {
        Object.entries(audioConfig).forEach(([btnId, src]) => {
            const btn = el(btnId);
            if (!btn) return;

            btn.style.cursor = 'pointer';
            audioPlayers[btnId] = new Audio(src);

            btn.addEventListener('click', () => handleAudioToggle(btnId));
        });
    }

    function handleAudioToggle(btnId) {
        const btn = el(btnId);
        const player = audioPlayers[btnId];
        if (!btn || !player) return;

        // If another audio is playing, stop and reset it first
        if (activeAudioId && activeAudioId !== btnId) {
            pauseAndReset(activeAudioId);
        }

        // Toggle current button
        if (player.paused || activeAudioId !== btnId) {
            player.currentTime = 0; // always start from beginning
            player.play();
            btn.classList.add('is-audio-playing');
            activeAudioId = btnId;
        } else {
            player.pause();
            player.currentTime = 0; // reset so next play starts fresh
            btn.classList.remove('is-audio-playing');
            activeAudioId = null;
        }

        player.onended = () => {
            btn.classList.remove('is-audio-playing');
            if (activeAudioId === btnId) activeAudioId = null;
        };
    }

    function pauseAndReset(audioId) {
        const player = audioPlayers[audioId];
        const btn = el(audioId);
        if (player) {
            player.pause();
            player.currentTime = 0;
        }
        if (btn) btn.classList.remove('is-audio-playing');
    }

    // ==========================================
    // 2c. ANIMATION SETUP FOR FEEDBACK
    // ==========================================
    function initializeLottieAnimations() {
        // Create containers for animations if they don't exist
        if (!el('animation-container-correct')) {
            const correctContainer = document.createElement('div');
            correctContainer.id = 'animation-container-correct';
            svg.parentElement.appendChild(correctContainer);
        }
        if (!el('animation-container-incorrect')) {
            const incorrectContainer = document.createElement('div');
            incorrectContainer.id = 'animation-container-incorrect';
            svg.parentElement.appendChild(incorrectContainer);
        }
    }

    function playCorrectAnimation(x, y) {
        if (!window.lottie) return;
        
        const container = el('animation-container-correct');
        if (!container) return;
        
        // Clear previous animation
        if (correctAnimationInstance) {
            correctAnimationInstance.destroy();
        }
        
        // Position the container
        container.style.left = (x - 100) + 'px';
        container.style.top = (y - 100) + 'px';
        container.innerHTML = '';
        container.classList.add('show');
        
        // Load and play animation
        correctAnimationInstance = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: './assets/animation/correct-confetti-anim.json'
        });
        
        correctAnimationInstance.onComplete = () => {
            container.classList.remove('show');
        };
    }

    function playIncorrectAnimation(x, y) {
        if (!window.lottie) return;
        
        const container = el('animation-container-incorrect');
        if (!container) return;
        
        // Clear previous animation
        if (incorrectAnimationInstance) {
            incorrectAnimationInstance.destroy();
        }
        
        // Position the container
        container.style.left = (x - 100) + 'px';
        container.style.top = (y - 100) + 'px';
        container.innerHTML = '';
        container.classList.add('show');
        
        // Load and play animation
        incorrectAnimationInstance = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: './assets/animation/incorrect-cross-anim.json'
        });
        
        incorrectAnimationInstance.onComplete = () => {
            container.classList.remove('show');
        };
    }

    function displayGalleryCompleteBadge(galleryElement) {
        // Create SVG badge group if not exists
        if (galleryElement.querySelector('.gallery-complete-checkmark')) {
            return; // Badge already exists
        }

        // Get the bounding box of the gallery to position the badge correctly
        let bbox = null;
        try {
            bbox = galleryElement.getBBox();
        } catch (e) {
            // Fallback if getBBox is not available or fails
            console.log("Could not get gallery bounding box, using defaults");
        }

        // Calculate badge position (top-left corner with some padding)
        const badgeRadius = 35;
        const cx = bbox ? bbox.x + 25 : 120;  // 25px inset from left
        const cy = bbox ? bbox.y + 30 : 90;  // 30px from top

        // Create an SVG group for the badge
        const badgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        badgeGroup.setAttribute('class', 'gallery-complete-checkmark');

        // Background circle - green color
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', badgeRadius);
        circle.setAttribute('fill', 'url(#checkmarkGradient)');
        circle.setAttribute('filter', 'url(#checkmarkShadow)');
        badgeGroup.appendChild(circle);

        // Checkmark path - white color
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${cx - 15} ${cy} L${cx - 5} ${cy + 10} L${cx + 15} ${cy - 10}`);
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        badgeGroup.appendChild(path);

        // Add animation class
        badgeGroup.setAttribute('class', 'gallery-complete-checkmark badge-animate');

        galleryElement.appendChild(badgeGroup);
    }

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
        
        // Initialize animations
        initializeLottieAnimations();

        Object.entries(ui.hallwayGalleries).forEach(([key, hall]) => {
            if (hall) {
                hall.style.cursor = 'pointer';
                // Display badge if already completed
                if (completedGalleries.has(key)) {
                    displayGalleryCompleteBadge(hall);
                }
                hall.addEventListener('click', () => {
                    if (isActivityComplete) {
                        window.selectMuseumGallery(key);
                    }
                });
            }
        });

        setupAudioButtons();
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

        const galleryIds = [
            'literary-source-gallery',
            'artistic-source-gallery',
            'archaeological-source-gallery',
            'oral-source-gallery'
        ];

        const galleryFromRect = (rect) => {
            const cx = (rect.left + rect.right) / 2;
            const cy = (rect.top + rect.bottom) / 2;
            for (const gid of galleryIds) {
                const gEl = el(gid);
                if (!gEl) continue;
                const gRect = gEl.getBoundingClientRect();
                if (cx >= gRect.left && cx <= gRect.right && cy >= gRect.top && cy <= gRect.bottom) {
                    return gid;
                }
            }
            return null;
        };

        const findCollidingGallery = (dragged) => {
            const dragRect = dragged.getBoundingClientRect();
            for (const gid of galleryIds) {
                const gEl = el(gid);
                if (!gEl) continue;
                const gRect = gEl.getBoundingClientRect();
                const hit = !(dragRect.right < gRect.left || dragRect.left > gRect.right || dragRect.bottom < gRect.top || dragRect.top > gRect.bottom);
                if (hit) return gEl;
            }
            return null;
        };

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

            const galleryHit = findCollidingGallery(activeDragEl);
            const hitTarget = galleryHit || dropZone;

            const dropZoneGalleryId = dropZone ? galleryFromRect(dropZone.getBoundingClientRect()) : null;
            const dragGalleryId = activeDragEl ? galleryHit?.id || galleryFromRect(activeDragEl.getBoundingClientRect()) : null;
            const galleryMatch = dragGalleryId && dropZoneGalleryId && dragGalleryId === dropZoneGalleryId;

            if (dropZone && hitTarget && galleryMatch && isColliding(activeDragEl, hitTarget)) {
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
                        if (ui.iText01) ui.iText01.textContent = "Click the gallery to explore the artefacts.";
                        
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

            // If user is revisiting, reset to first question if they've completed it
            if (galleryData[galleryKey].completed) {
                // User can revisit and answer again - reset to first question
                galleryData[galleryKey].currentQuestionIndex = 0;
            } else {
                // First time - start from beginning
                galleryData[galleryKey].currentQuestionIndex = 0;
            }
            
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
        // First hide any static marks
        if (ui.correctMark) ui.correctMark.style.display = 'none';
        if (ui.incorrectMark) ui.incorrectMark.style.display = 'none';

        const currentData = galleryData[galleryKey];
        const activeQuestion = currentData.questions[currentData.currentQuestionIndex];

        const isCorrect = (clickedElement.id === activeQuestion.correctId);
        
        // Get click position for animation
        const rect = clickedElement.getBoundingClientRect();
        const animX = rect.left + rect.width / 2;
        const animY = rect.top + rect.height / 2;
        
        // Play animation
        if (isCorrect) {
            playCorrectAnimation(animX, animY);
        } else {
            playIncorrectAnimation(animX, animY);
        }

        // Handle progression or retry after selection
        if (isCorrect) {
            setTimeout(() => {
                if (currentData.currentQuestionIndex < currentData.questions.length - 1) {
                    currentData.currentQuestionIndex++;
                    updateClueUI(galleryKey);
                } else {
                    // Gallery complete!
                    currentData.completed = true;
                    completedGalleries.add(galleryKey);
                    
                    // Display badge on the gallery
                    const galleryEl = ui.hallwayGalleries[galleryKey];
                    if (galleryEl) {
                        displayGalleryCompleteBadge(galleryEl);
                    }
                    
                    console.log("Gallery Complete! User can revisit.");
                }
            }, 1500); 
        } else {
            // Invalid answer - user can try again
            setTimeout(() => {
                // Do nothing, let them try again
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
