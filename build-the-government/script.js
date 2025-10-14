document.addEventListener('DOMContentLoaded', () => {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    // New: Reference for step-3
    const step3 = document.getElementById('step-3'); 
    
    // NEW: References for comparison images
    const block1CompareImg = document.getElementById('block-1-compare-img');
    const block2CompareImg = document.getElementById('block-2-compare-img');

    // NEW: Reference for select-box-note
    const selectBoxNote = document.getElementById('select-box-note');
    
    // NEW: Reference for step-1-note (ADDED)
    const step1Note = document.getElementById('step-1-note');
    
    // Ensure all steps and comparison blocks exist
    if (!step1 || !step2 || !step3 || !block1CompareImg || !block2CompareImg) return;
    
    // Find candidate cards: top-level <g> elements inside step-1 that contain a <use>
    const groups = Array.from(step1.querySelectorAll('g[id]'));
    // Filter to get only the <g> elements that represent government cards (those with an ID and a <use> child)
    const cards = groups.filter(g => g.id && Boolean(g.querySelector('use')));

    // State for the new comparison mode
    let compareMode = false;
    const selectedCardsForCompare = new Set(); // Stores card IDs (used for both modes)

    // Loaded JSON data will be stored here
    let governmentData = null;

    // Publicly accessible selected object (for debugging/other scripts)
    window.selectedGovernment = null;
    // last selected card id (e.g. 'republic')
    window.selectedGovernmentCardId = null;
    // New: Stores an array of IDs for comparison mode when transitioning to step 3
    window.selectedGovernmentsForComparison = null; 

    // Buttons (dynamic)
    const btn1 = document.getElementById('btn-1'); // Compare / Continue / Back / Reset (New in Compare Mode)
    const btn2 = document.getElementById('btn-2'); // Continue / Reset

    // --- Lottie Animation Initialization and Control ---
    let lottieAnimation = null;
    let lottieInitialized = false;

    function initializeLottie(containerElement) {
        // Prevent re-initialization and ensure lottie library is loaded
        if (lottieInitialized || typeof lottie === 'undefined') return;

        // Create a dedicated DIV for Lottie animation
        const lottieContainer = document.createElement('div');
        lottieContainer.id = 'lottie-animation-wrapper';
        
        // Find a suitable container to attach the Lottie animation, falling back to step2
        const attachmentPoint = containerElement || step2; 
        
        // Append the Lottie wrapper to the attachment point
        attachmentPoint.appendChild(lottieContainer);

        lottieAnimation = lottie.loadAnimation({
            container: lottieContainer, 
            renderer: 'svg', // Use 'svg' for best compatibility
            loop: false,
            autoplay: false, // Don't play yet
            path: './lottie-animation.json' // Path to your Lottie JSON file
        });

        lottieInitialized = true;
        // Hide it until needed
        lottieContainer.style.display = 'none';
    }
    // Initial call to set up the Lottie container inside step2
    initializeLottie(step2);

    // ---------------------------------------------------


    function updateGovernmentImage(cardId) {
        if (!cardId) return;
        // element is a <use id="government-img"> inside the SVG
        const useEl = document.getElementById('government-img') || document.querySelector('use#government-img');
        if (!useEl) return;
        const path = `./assets/${cardId}.svg`;
        try { useEl.setAttribute('href', path); } catch (e) { }
        // older browsers may use xlink:href
        try { useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', path); } catch (e) { }
        // Ensure 'active' class is removed on a new image selection
        try { useEl.classList.remove('active'); } catch (e) { }
    }
    
    // Helper function to update the <use> element's href
    function updateUseElementHref(gElement, cardId, isXlink = false) {
        if (!gElement || !cardId) return;
        const useEl = gElement.querySelector('use');
        if (!useEl) return;
        
        const path = `./assets/${cardId}.svg`;
        
        try { 
            // Standard href
            useEl.setAttribute('href', path); 
        } catch (e) { 
            // Fallback for older browsers (xlink:href)
            if (isXlink) {
                try { useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', path); } catch (e) { }
            }
        }
    }

    // Load data.json once
    fetch('./data.json')
        .then(res => {
            if (!res.ok) throw new Error('Failed to load data.json: ' + res.status);
            return res.json();
        })
        .then(json => {
            governmentData = json.government_types || json;
        })
        .catch(err => {
            console.error('Error loading data.json', err);
            governmentData = null;
        });

    function idToGovernmentType(id) {
        if (!id) return id;
        return id
            .replace(/[-_]+/g, ' ')
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + s.slice(1))
            .join(' ');
    }
    
    // Helper to find government data based on card ID
    function getGovernmentDataById(cardId) {
        if (!governmentData) return null;
        const govType = idToGovernmentType(cardId);
        return governmentData.find(g => {
            return String(g['Government Type']).toLowerCase() === String(govType).toLowerCase();
        });
    }

    // Function to update the answers in the comparison blocks
    function updateComparisonAnswers(selectedIds) {
        if (!selectedIds || selectedIds.length < 2) return;

        const data1 = getGovernmentDataById(selectedIds[0]);
        const data2 = getGovernmentDataById(selectedIds[1]);

        // List of answer element IDs for block 1 and block 2
        const block1AnswerIds = ['block-1-compare-1-ans', 'block-1-compare-2-ans', 'block-1-compare-3-ans', 'block-1-compare-4-ans'];
        const block2AnswerIds = ['block-2-compare-1-ans', 'block-2-compare-2-ans', 'block-2-compare-3-ans', 'block-2-compare-4-ans'];

        // Update Block 1 Answers (Left side)
        if (data1 && data1.blocks) {
            block1AnswerIds.forEach((id, index) => {
                const answerEl = document.getElementById(id);
                const answer = data1.blocks[index] ? data1.blocks[index].Answer : 'N/A';
                if (answerEl) answerEl.textContent = answer;
            });
        }

        // Update Block 2 Answers (Right side)
        if (data2 && data2.blocks) {
            block2AnswerIds.forEach((id, index) => {
                const answerEl = document.getElementById(id);
                const answer = data2.blocks[index] ? data2.blocks[index].Answer : 'N/A';
                if (answerEl) answerEl.textContent = answer;
            });
        }
    }

    // Function to show Step 2 (single selection quiz)
    function showStep2() {
        step1.style.display = 'none';
        step3.style.display = 'none'; // Ensure step-3 is hidden
        step2.style.display = 'inline';
        const firstFocusable = step2.querySelector('button, [tabindex], a, input, select, textarea');
        if (firstFocusable) firstFocusable.focus();
    }
    
    // Function to show Step 3 (comparison view)
    function showStep3() {
        step1.style.display = 'none';
        step2.style.display = 'none'; // Ensure step-2 is hidden
        step3.style.display = 'inline';
        const firstFocusable = step3.querySelector('button, [tabindex], a, input, select, textarea');
        if (firstFocusable) firstFocusable.focus();

        // Set btn1 to 'Reset'
        if (btn1) {
            btn1.style.display = 'inline-block';
            btn1.disabled = false;
            btn1.textContent = 'Reset'; 
        }
        // Set btn2 to 'Back to Government Types'
        if (btn2) {
            btn2.style.display = 'inline-block';
            btn2.disabled = false;
            btn2.textContent = 'Back to Government Types';
        }

        // Comparison Image & Answer Rendering Logic
        if (window.selectedGovernmentsForComparison && window.selectedGovernmentsForComparison.length >= 2) {
            const id1 = window.selectedGovernmentsForComparison[0];
            const id2 = window.selectedGovernmentsForComparison[1];

            // 1. Update Images
            updateUseElementHref(block1CompareImg, id1, true);
            updateUseElementHref(block2CompareImg, id2, true);

            // 2. Update Answers
            updateComparisonAnswers(window.selectedGovernmentsForComparison);
        }

        console.log('Step 3 (Comparison View) activated for:', window.selectedGovernmentsForComparison);
    }


    function selectGovernmentById(cardId) {
        window.selectedGovernmentCardId = cardId;
        updateGovernmentImage(cardId);
        Object.keys(answeredBlocks).forEach(k => delete answeredBlocks[k]);
        hideActionButtons();
        for (let i = 1; i <= 4; i++) {
            const rg = getResultGroup(i);
            if (rg) rg.style.display = 'none';
        }
        const match = getGovernmentDataById(cardId);
        const govType = idToGovernmentType(cardId);
        window.selectedGovernment = match || { 'Government Type': govType, blocks: [] };
    }


    // --- Button Control Functions ---

    function hideActionButtons() {
        if (btn1) { btn1.style.display = 'none'; btn1.disabled = true; }
        if (btn2) { btn2.style.display = 'none'; btn2.disabled = true; } 
    }

    function setStep1Buttons() {
        // Step 1 Initial State (Single-Select/Continue mode)
        if (btn1) {
            btn1.style.display = 'inline-block';
            btn1.textContent = 'Compare';
            btn1.disabled = false; // Compare is enabled
        }
        if (btn2) {
            btn2.style.display = 'inline-block';
            btn2.textContent = 'Continue';
            btn2.disabled = true; // Continue is disabled
        }
        
        // Ensure note is set for default mode
        if (step1Note) {
            step1Note.textContent = 'Tap any government-type card to start building its structure.';
        }
    }

    // Logic for Step 1 when in compare mode
    function updateStep1ButtonsInCompareMode() {
        const selectedCount = selectedCardsForCompare.size;
        const enableContinue = selectedCount >= 2;

        if (btn1) {
            if (compareMode) {
                // Keep 'Reset' if we are in compareMode 
                btn1.textContent = 'Reset'; 
                btn1.disabled = false;
            } else {
                btn1.textContent = 'Compare';
                btn1.disabled = false; 
            }
        }
        if (btn2) {
            // Ensure btn2 is visible and set the text/disabled state correctly
            btn2.style.display = 'inline-block'; // Explicitly show btn2
            btn2.textContent = 'Continue'; 
            btn2.disabled = !enableContinue;
        }
        
        // Ensure note is set for compare mode
        if (step1Note) {
            step1Note.textContent = 'Tap Compare to view a side-by-side comparison.';
        }
    }

    // Function to go back to the compare stage (Step 1, with comparison mode active)
    function backToCompareStage() {
        step2.style.display = 'none';
        step3.style.display = 'none';
        step1.style.display = 'inline';
        
        // Restore compare mode state
        compareMode = true; 
        
        // Ensure buttons and selections are correct for the compare stage
        updateStep1ButtonsInCompareMode(); 

        if (cards.length > 0) cards[0].focus();

        // Hide Lottie animation when returning to Step 1
        const lottieDiv = document.getElementById('lottie-animation-wrapper');
        if (lottieDiv) lottieDiv.style.display = 'none';
    }

    // Function to go back to the default stage (Step 1, single-select mode)
    function backToDefaultStage() {
        step2.style.display = 'none';
        step3.style.display = 'none';
        step1.style.display = 'inline';

        // Reset all states
        compareMode = false;
        selectedCardsForCompare.clear();
        window.selectedGovernmentsForComparison = null; 
        cards.forEach(c => c.classList.remove('active'));
        
        // Reset buttons to initial Step 1 state (this also sets the correct default step1Note text)
        setStep1Buttons(); 

        if (cards.length > 0) cards[0].focus();
        
        // Hide Lottie animation when returning to Step 1
        const lottieDiv = document.getElementById('lottie-animation-wrapper');
        if (lottieDiv) lottieDiv.style.display = 'none';
        
        // Ensure select-box-note is visible when returning to Step 1
        if (selectBoxNote) {
            selectBoxNote.style.display = 'inline-block'; 
        }
    }


    // --- Card Interaction ---
    cards.forEach(card => {
        try { card.setAttribute('tabindex', '0'); } catch (e) { }
        try { card.setAttribute('role', 'button'); } catch (e) { }
        card.style.cursor = 'pointer';

        const cardId = card.id;

        const handleCardActivation = (evt) => {
            if (evt) evt.stopPropagation();

            if (compareMode) {
                // In Compare Mode: Toggle selection and update visual/buttons
                if (selectedCardsForCompare.has(cardId)) {
                    selectedCardsForCompare.delete(cardId);
                    card.classList.remove('active');
                } else {
                    selectedCardsForCompare.add(cardId);
                    card.classList.add('active');
                }
                updateStep1ButtonsInCompareMode(); 

            } else {
                // Original Single-Select Mode: Select one and immediately proceed to Step 2

                // 1. Perform original actions: filter data and show step-2
                selectGovernmentById(cardId);
                showStep2();
                
                // Hide select-box-note when proceeding to Step 2
                if (selectBoxNote) {
                    selectBoxNote.style.display = 'none';
                }

                // 2. Clear selections (since we are leaving step 1)
                selectedCardsForCompare.clear();
                cards.forEach(c => c.classList.remove('active'));
            }
        };

        const originalHandleCardSelectAndActivate = (evt) => {
            if (evt) evt.stopPropagation();

            if (compareMode) {
                handleCardActivation(evt);
            } else {
                cards.forEach(c => c.classList.remove('active'));
                selectedCardsForCompare.clear(); 
                selectedCardsForCompare.add(cardId);
                card.classList.add('active');
                handleCardActivation(evt);
            }
        }

        card.addEventListener('click', originalHandleCardSelectAndActivate);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                originalHandleCardSelectAndActivate(e);
            }
        });
    });

    // --- Button Click Handlers ---

    // Initial button state on load (Step 1)
    setStep1Buttons();

    if (btn2) {
        btn2.addEventListener('click', () => {
            const btnText = btn2.textContent.trim().toLowerCase();

            // Handle "Back to Government Types" from Step 3
            if (step3.style.display === 'inline' && btnText === 'back to government types') {
                backToDefaultStage();
                return;
            }

            if (btnText === 'reset') {
                // Existing functionality for Step 2
                window.location.reload();
                return;
            }

            if (btnText === 'continue' && !btn2.disabled) {
                // Logic to transition from Step 1 (Compare Mode) to Step 3
                if (compareMode && selectedCardsForCompare.size >= 2) {
                    const selectedIds = Array.from(selectedCardsForCompare);
                    window.selectedGovernmentsForComparison = selectedIds;
                    
                    showStep3(); 
                    
                    // Hide select-box-note when proceeding to Step 3
                    if (selectBoxNote) {
                        selectBoxNote.style.display = 'none';
                    }
                    
                    return; 
                }

                // Safety/Redundancy path for single-select mode
                const cardId = Array.from(selectedCardsForCompare)[0];
                if (cardId) {
                    selectGovernmentById(cardId);
                    showStep2();
                    
                    // Hide select-box-note when proceeding to Step 2
                    if (selectBoxNote) {
                        selectBoxNote.style.display = 'none';
                    }
                }
            }
        });
    }

    if (btn1) {
        btn1.addEventListener('click', () => {
            const btnText = btn1.textContent.trim().toLowerCase();
            
            // Handle "Reset" from Step 3 (returns to compare stage)
            if (step3.style.display === 'inline' && btnText === 'reset') {
                backToCompareStage();
                return;
            }

            // Logic for Reset in Step 1 (Compare Mode)
            if (step1.style.display === 'inline' && btnText === 'reset' && compareMode) {
                selectedCardsForCompare.clear();
                cards.forEach(c => c.classList.remove('active'));

                // We only need to update the continue button state
                if (btn2) btn2.disabled = true;
                btn1.textContent = 'Reset'; 
                
                return;
            }

            // Handle Back from Step 2 (Insights) OR Back from Step 3 (if btn2 was not clicked)
            if (btnText === 'back to government types') {
                backToDefaultStage();
                return;
            }

            if (btnText === 'compare') {
                // Enter/Exit Compare Mode
                if (!compareMode) {
                    // ENTER Compare Mode
                    compareMode = true;
                    selectedCardsForCompare.clear();
                    cards.forEach(c => c.classList.remove('active'));
                    updateStep1ButtonsInCompareMode(); // This sets 'Reset' button and 'Tap Compare' note
                } else {
                    // EXIT Compare Mode 
                    compareMode = false;
                    selectedCardsForCompare.clear();
                    cards.forEach(c => c.classList.remove('active'));
                    setStep1Buttons(); // This sets 'Compare' button and the required default note
                }
                // Ensure select-box-note visibility is correct when toggling compare mode
                if (selectBoxNote) {
                    selectBoxNote.style.display = 'inline-block'; 
                }
                return;
            }

            // ... Existing 'Continue' logic from Step 2 completion
            if (btnText === 'continue' && !btn1.disabled) {
                const gov = window.selectedGovernment;
                if (!gov) return;

                let insights = gov['Insight Countries'];
                if (!insights && Array.isArray(gov.blocks)) {
                    for (const b of gov.blocks) {
                        if (b && b['Insight Countries']) { insights = b['Insight Countries']; break; }
                    }
                }

                const wrapper = document.getElementById('insights-wrapper');
                if (wrapper) wrapper.style.display = 'block';
                
                // HIDE select-box-note when insights-wrapper gets visible
                if (selectBoxNote) {
                    selectBoxNote.style.display = 'none';
                }
                
                const countriesEl = document.getElementById('insights-countries');
                if (countriesEl) countriesEl.textContent = insights || '';

                const qWrapper = document.getElementById('question-wrapper');
                if (qWrapper) qWrapper.style.display = 'none';
                
                if (optionWrapper) optionWrapper.style.display = 'none'; 

                hideActionButtons();
            }
        });
    }

    // --- Step 2 Logic ---

    const questionWrapper = step2.querySelector('#question-wrapper');
    const blockTitles = questionWrapper ? Array.from(questionWrapper.querySelectorAll('g[id^="block-title-"]')) : [];
    const optionWrapper = step2.querySelector('#option-wrapper');
    const options = optionWrapper ? {
        1: optionWrapper.querySelector('#option-1'),
        2: optionWrapper.querySelector('#option-2'),
        3: optionWrapper.querySelector('#option-3')
    } : null;

    const answeredBlocks = {};
    
    // --- Remaining Step 2 Logic ---

    function showActionButtons() {
        if (btn1) { btn1.style.display = 'inline-block'; btn1.disabled = false; btn1.textContent = 'continue'; }
        if (btn2) { btn2.style.display = 'none'; btn2.disabled = true; }
    }

      function checkAllAnsweredAndActivateImage() {
        const totalBlocks = (window.selectedGovernment && window.selectedGovernment.blocks) ? window.selectedGovernment.blocks.length : 0;
        const answeredCount = Object.keys(answeredBlocks).length;

        // Check if all answers have been correctly provided
        if (totalBlocks > 0 && answeredCount >= totalBlocks) {
            showActionButtons();
            
            const useEl = document.getElementById('government-img') || document.querySelector('use#government-img');
            if (useEl) {
                try { 
                    // 1. Apply 'active' class
                    useEl.classList.add('active'); 
                    // play lottie animation here
                    
                    // START: Lottie Animation Logic
                    const lottieDiv = document.getElementById('lottie-animation-wrapper');
                    
                    if (lottieAnimation && lottieDiv) {
                        // Show the animation container
                        lottieDiv.style.display = 'block';
                        
                        // Reset the animation to the start and play
                        lottieAnimation.goToAndPlay(0, true);
                        
                        // Optional: Hide the Lottie animation after it finishes playing once
                        lottieAnimation.onComplete = () => {
                            // Hide the wrapper once the animation is complete
                            lottieDiv.style.display = 'none'; 
                            // Remove the listener to prevent memory leaks/re-triggering if not needed
                            lottieAnimation.onComplete = null; 
                        };
                    }
                    // END: Lottie Animation Logic

                } catch (e) {
                    console.error('Could not add active class to government-img', e);
                }
            }
        }
    }

    const insightBtn = document.getElementById('insight-btn') || step2.querySelector('#insight-btn');
    if (insightBtn) {
        try { insightBtn.style.cursor = 'pointer'; } catch (e) { }
        insightBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const resultBox = document.getElementById('insight-result-box') || step2.querySelector('#insight-result-box');
            if (resultBox) resultBox.style.display = 'block';
            const note = document.getElementById('insights-note') || step2.querySelector('#insights-note');
            if (note) note.style.display = 'none';

            if (btn1) {
                btn1.style.display = 'inline-block';
                btn1.disabled = false;
                btn1.textContent = 'Back to Government Types';
            }
            if (btn2) { // Hide the Reset button when showing insights
                btn2.style.display = 'none';
            }
        });
    }

    Object.keys(answeredBlocks).forEach(k => delete answeredBlocks[k]);
    hideActionButtons();

    function getForeignDiv(el) {
        if (!el) return null;
        const fo = el.querySelector('foreignObject');
        if (!fo) return null;
        return fo.querySelector('div');
    }

    function clearOptionsDisplay() {
        if (!options) return;
        Object.values(options).forEach(opt => {
            if (!opt) return;
            opt.style.display = 'none';
            opt.style.pointerEvents = '';
            try {
                opt.classList.remove('wrong-answer', 'correct-answer');
                const inner = getForeignDiv(opt);
                if (inner) inner.classList.remove('wrong-answer', 'correct-answer');
            } catch (e) { }
        });
    }

    function renderBlockTitles() {
        if (!window.selectedGovernment || !window.selectedGovernment.blocks) return;
        window.selectedGovernment.blocks.forEach((blk, idx) => {
            const titleGroup = blockTitles[idx];
            if (!titleGroup) return;
            const div = getForeignDiv(titleGroup);
            if (div) div.textContent = blk['Block Title'] || div.textContent;
        });
    }

    function getResultGroup(n) {
        return step2.querySelector('#result-' + n);
    }

    function setResultText(n, text) {
        const div = step2.querySelector('#block-title-' + n + '-ans');
        if (div) div.textContent = text;
        const resultGroup = getResultGroup(n);
        if (resultGroup) resultGroup.style.display = 'block';
    }

    function renderOptionsForBlock(index) {
        clearOptionsDisplay();
        const blk = (window.selectedGovernment && window.selectedGovernment.blocks) ? window.selectedGovernment.blocks[index] : null;
        if (!blk || !options) return;
        if (answeredBlocks[index]) {
            const map2 = { 1: blk['Option A'] || '', 2: blk['Option B'] || '', 3: blk['Option C'] || '' };
            Object.keys(map2).forEach(k => {
                const optEl = options[k];
                if (!optEl) return;
                if (getForeignDiv(optEl)) getForeignDiv(optEl).textContent = map2[k];
                optEl.style.display = 'inline';
                optEl.style.pointerEvents = 'none';
            });
            setResultText(index + 1, blk['Answer'] || '');
            return;
        }
        const map = { 1: blk['Option A'] || '', 2: blk['Option B'] || '', 3: blk['Option C'] || '' };
        Object.keys(map).forEach(k => {
            const optEl = options[k];
            if (!optEl) return;
            if (getForeignDiv(optEl)) getForeignDiv(optEl).textContent = map[k];
            optEl.style.display = 'inline';
            optEl.style.pointerEvents = '';
        });
    }

    blockTitles.forEach((bt, i) => {
        try { bt.setAttribute('tabindex', '0'); } catch (e) { }
        try { bt.setAttribute('role', 'button'); } catch (e) { }
        bt.style.cursor = 'pointer';
        bt.addEventListener('click', (e) => {
            e.stopPropagation();
            if ((!window.selectedGovernment || !window.selectedGovernment.blocks || window.selectedGovernment.blocks.length === 0) && governmentData) {
                const current = window.selectedGovernment && window.selectedGovernment['Government Type'];
                if (current) {
                    const found = getGovernmentDataById(window.selectedGovernmentCardId);
                    if (found) { window.selectedGovernment = found; renderBlockTitles(); }
                }
            }
            renderOptionsForBlock(i);
        });
        bt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bt.click(); }
        });
    });

    function findOptionDiv(optionEl) {
        return optionEl ? getForeignDiv(optionEl) : null;
    }

    if (options) {
        Object.keys(options).forEach(k => {
            const optEl = options[k];
            if (!optEl) return;
            try { optEl.setAttribute('tabindex', '0'); } catch (e) { }
            optEl.style.cursor = 'pointer';
            optEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const activeIndex = parseInt(optionWrapper.getAttribute('data-active-block') || '-1', 10);
                if (activeIndex < 0) return;
                const blk = (window.selectedGovernment && window.selectedGovernment.blocks) ? window.selectedGovernment.blocks[activeIndex] : null;
                if (!blk) return;
                const chosenText = findOptionDiv(optEl)?.textContent || '';
                const correctText = (blk['Answer'] || '').toString();
                if (chosenText.trim().toLowerCase() === correctText.trim().toLowerCase()) {
                    answeredBlocks[activeIndex] = true;
                    setResultText(activeIndex + 1, correctText);
                    optEl.classList.add('correct-answer');
                    Object.values(options).forEach(o => { if (o) o.style.pointerEvents = 'none'; });
                    checkAllAnsweredAndActivateImage();
                } else {
                    optEl.classList.add('wrong-answer');
                    const inner = findOptionDiv(optEl);
                    if (inner) inner.classList.add('wrong-answer');
                    setTimeout(() => {
                        optEl.classList.remove('wrong-answer');
                        if (inner) inner.classList.remove('wrong-answer');
                    }, 500);
                }
            });
            optEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); optEl.click(); }
            });
        });
    }

    blockTitles.forEach((bt, i) => {
        bt.addEventListener('click', () => {
            if (optionWrapper) optionWrapper.setAttribute('data-active-block', String(i));
        });
    });

    (function reconcileAfterLoad(retries = 10) {
        if (governmentData) {
            if (window.selectedGovernment && window.selectedGovernment['Government Type'] && (!window.selectedGovernment.blocks || window.selectedGovernment.blocks.length === 0)) {
                const found = getGovernmentDataById(window.selectedGovernmentCardId);
                if (found) {
                    window.selectedGovernment = found;
                    renderBlockTitles();
                }
            }
            return;
        }
        if (retries <= 0) return;
        setTimeout(() => reconcileAfterLoad(retries - 1), 150);
    })();
});