document.addEventListener("DOMContentLoaded", () => {

    // ─── ELEMENT REFERENCES ────────────────────────────────────────────────────
    const svg = document.querySelector('svg');

    // Mode panel
    const modePanel = document.getElementById('mode-panel');             // whole panel group
    const modePanelHl = document.getElementById('mode-panel-hl');
    const modePanelHlRect = document.querySelector('#mode-panel-hl rect');  // Rectangle_172 – the sliding highlight
    const teacherModeBtn = document.getElementById('Teacher_Mode');
    const playgroundModeBtn = document.getElementById('Playground_Mode');

    // Sliders (inside Layer_25)
    const scroolBtn1 = document.getElementById('scrool-btn-1');   // items-per-group
    const scroolBtn2 = document.getElementById('scrool-btn-2');   // groups
    const scrollNum1 = document.getElementById('scroll-number-1');
    const scrollNum2 = document.getElementById('scroll-number-2');
    const scroolerH1 = document.getElementById('Scrooler-heading1');
    const scroolerH2 = document.getElementById('Scrooler-heading2');

    // Teacher mode action buttons
    const surpriseMeBtn = document.getElementById('btn-suprise-me');
    const resetBtn = document.getElementById('reset-button');
    const showAnswerBtn = document.getElementById('show-answer');

    // ── Teacher-mode collapsible panels (using the outer *-hl wrapper groups) ──
    // The *-hl groups are what the user clicks (they contain the header bar + arrow)
    const multiQPanelHl = document.getElementById('multi-Q-panel-hl');
    const multiAnsPanelHl = document.getElementById('multi-ans-panel-hl');
    const repeatQPanelHl = document.getElementById('repeat-q-panel-hl');
    const repeaAnsPanelHl = document.getElementById('repea-ans-panel-hl');
    const inwordQPanelHl = document.getElementById('inword-Q-panel-hl');
    const inwordAnsPanelHl = document.getElementById('inword-panel-ans-hl');

    // Arrow groups inside each Q-panel header (rotate 180° when answer is shown)
    const arrowMulti = document.getElementById('Group_6162');
    const arrowRepeat = document.getElementById('Group_6072');
    const arrowInword = document.getElementById('Group_6161');

    // Dynamic text nodes inside panels
    const multiAnsText = document.getElementById('_43_12');      // "4 x 3 = 12"
    const repeaAnsText = document.getElementById('repea-ans-text');   // Parent of foreignObject/div
    const inwordText1 = document.getElementById('_3_groups_of_4_is');
    const inwordText2 = document.getElementById('_3_times_of_4_is');
    const inwordText3 = document.getElementById('_3_fours_are');

    // Problem panel (shown only in Playground mode)
    const problemPanel = document.getElementById('problem-panel');
    const problemText = document.querySelector('#problem-tos tspan');

    // SVG images playground (shown only in Playground mode)
    const svgImagesPlayground = document.getElementById('svg-images-playground');

    // Teacher-mode Theme dropdown (the whole box in Layer_25 area)
    const teacherThemeDropdown = document.getElementById('Theme-drop-down');
    const teacherDropdownArrow = document.getElementById('Group_1578');

    // Picture / playground panels
    const playgroundChooseThemeSection = document.getElementById('playground-panel-choose-theme-section');
    const playgroundAddPictureSection = document.getElementById('playground-panel-add-picture-section');
    const themeDropdownBox = document.getElementById('playground-panel-choose-theme-dropdown-box');

    // ─── PLAYGROUND ADD PICTURE ELEMENTS ──────────────────────────────────────
    const btnAddPicture = document.getElementById('btn-playground-panel-add-picture');
    const btnAddPictureText = document.getElementById('btn-playground-panel-add-picture-text');

    // Dynamic Playground Groups
    const pgGroupTemplate = document.getElementById('pg-group-template');
    const pgGroupsContainer = document.getElementById('pg-groups-container');

    // ─── BOTTOM BUTTONS (Playground) ──────────────────────────────────────────
    const btnCheckMyAnswer = document.getElementById('btn-playground-panel-check-my-answer');
    const newProblemBtn = document.getElementById('new-problem');

    // Feedback
    const feedbackCorrect = document.getElementById('feedback-playground-panel-correct-ans');
    const feedbackIncorrect = document.getElementById('feedback-playground-panel-incorrect-ans');

    // How to play modal
    const howToPlayModal = document.getElementById('how-to-play');
    const btnGotIt = document.getElementById('btn-got-it');
    const btnGotItText = document.getElementById('btn-got-it-text');
    const howToPlayRect = document.getElementById('for-how-to-play');
    // Answer modal
    const answerModal = document.getElementById('answer-modal');
    const answerModalBg = document.getElementById('for-answer-modal');
    const btnNewProblem = document.getElementById('btn-new-problem-answer-modal');
    const showAnswerPictures = document.getElementById('show-answer-pictures');
    const closeAnswerBtn = document.getElementById('close-answer-btn')
    // i-text hint (playground)
    const iText = document.getElementById('i-text');

    // Visual layers
    const layer25 = document.getElementById('Layer_25');   // Sliders area
    const layer50 = document.getElementById('Layer_50');   // Animated pictures area (inside playground section)
    const picturePanelEl = document.getElementById('picture-panel'); // Teacher-mode picture background
    const pictureBorder = document.getElementById('picture-border'); // Placeholder for selected theme SVG preview
    const svgImagesGroup = document.getElementById('svg-images-group'); // Theme SVG output

    // ─── SLIDER CONSTANTS (declared early – used by doSurpriseMe / doReset) ───
    const SLIDER_START = 110;
    const SLIDER_END = 1200;
    const SLIDER_STEPS = 9;
    const STEP_PX = (SLIDER_END - SLIDER_START) / SLIDER_STEPS;   // ≈ 116.11
    const BTN1_OFFSET = SLIDER_START - 308.67;   // ≈ -198.67
    const BTN2_OFFSET = SLIDER_START - 428.67;   // ≈ -318.67

    // ─── STATE ────────────────────────────────────────────────────────────────
    const WORD_MAP = ['one', 'twos', 'threes', 'fours', 'fives', 'sixes', 'sevens', 'eights', 'nines', 'tens'];

    let state = {
        mode: 'teacher',
        theme: 'plates',
        groups: 3,
        items: 4,
        targetGroups: 3,
        targetItems: 4,
        answered: false,
        panelRepea: false,
        panelMulti: false,
        panelInword: false,
        themeDropdownOpen: false,
        teacherThemeDropdownOpen: false
    };

    // Feedback timeout tracker
    let feedbackTimeoutId = null;

    // ─── HELPERS ──────────────────────────────────────────────────────────────
    function show(el) { if (el) el.style.display = 'block'; }
    function hide(el) { if (el) el.style.display = 'none'; }
    function isHidden(el) { return !el || el.style.display === 'none'; }

    // ─── TAB ACTIVE INDICATOR ─────────────────────────────────────────────────
    // Slides the mode-panel highlight rect (Rectangle_172) between tab positions
    // and adjusts width: teacher = 244 (default), playground = 264 (+20px).
    // Both values are in SVG user units (not CSS px).
    const TAB_X = { teacher: 1325.64, playground: 1586.71 };
    const TAB_W = { teacher: 244, playground: 284 };
    let _tabAnimId = null;

    function setTabActive(mode) {
        if (!modePanelHlRect) return;

        const targetX = TAB_X[mode] || TAB_X.teacher;
        const targetW = TAB_W[mode] || TAB_W.teacher;
        const startX = parseFloat(modePanelHlRect.getAttribute('x') || TAB_X.teacher);
        const startW = parseFloat(modePanelHlRect.getAttribute('width') || TAB_W.teacher);

        if (Math.abs(targetX - startX) < 0.5 && Math.abs(targetW - startW) < 0.5) return;

        // Cancel any in-progress animation
        if (_tabAnimId) { cancelAnimationFrame(_tabAnimId); _tabAnimId = null; }

        const DURATION = 250;   // ms
        const startTime = performance.now();

        function step(now) {
            const t = Math.min((now - startTime) / DURATION, 1);
            const ease = 1 - Math.pow(1 - t, 3);   // ease-out cubic
            modePanelHlRect.setAttribute('x', startX + (targetX - startX) * ease);
            modePanelHlRect.setAttribute('width', startW + (targetW - startW) * ease);
            if (t < 1) {
                _tabAnimId = requestAnimationFrame(step);
            } else {
                modePanelHlRect.setAttribute('x', targetX);
                modePanelHlRect.setAttribute('width', targetW);
                _tabAnimId = null;
            }
        }
        _tabAnimId = requestAnimationFrame(step);
    }

    // ─── MODE-PANEL VERTICAL SLIDE ───────────────────────────────────────────────
    // Animates the whole mode-panel group up (playground, translateY = -100)
    // or back down (teacher, translateY = 0) in SVG coordinate space.
    const PANEL_SHIFT_Y = -100;   // SVG units — negative = upward
    let _panelAnimId = null;

    function _getPanelCurrentY() {
        const t = modePanel ? modePanel.getAttribute('transform') : null;
        if (!t) return 0;
        const m = t.match(/translate\([^,)]*,\s*([^)]+)\)/);
        return m ? parseFloat(m[1]) : 0;
    }

    function animateModePanel(targetY) {
        if (!modePanel) return;
        const startY = _getPanelCurrentY();
        if (Math.abs(targetY - startY) < 0.5) return;

        if (_panelAnimId) { cancelAnimationFrame(_panelAnimId); _panelAnimId = null; }

        const DURATION = 300;   // ms
        const startTime = performance.now();

        function step(now) {
            const t = Math.min((now - startTime) / DURATION, 1);
            const ease = 1 - Math.pow(1 - t, 3);   // ease-out cubic
            const y = startY + (targetY - startY) * ease;
            modePanel.setAttribute('transform', `translate(0, ${y})`);
            if (t < 1) {
                _panelAnimId = requestAnimationFrame(step);
            } else {
                modePanel.setAttribute('transform', targetY === 0 ? '' : `translate(0, ${targetY})`);
                _panelAnimId = null;
            }
        }
        _panelAnimId = requestAnimationFrame(step);
    }

    function clickable(el, fn) {
        if (!el) return;
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'all';
        el.addEventListener('click', fn);
    }

    function tspanOf(el) {
        return el ? el.querySelector('tspan') : null;
    }

    function setText(el, text) {
        let t = tspanOf(el);
        if (t) {
            t.textContent = text;
        } else if (el) {
            // Support foreignObject div wrapping
            const div = el.querySelector('div');
            if (div) div.textContent = text;
        }
    }

    // ─── ARROW ROTATION HELPERS ───────────────────────────────────────────────
    // Rotate an SVG arrow group 180° around its bounding-box centre.
    // We store the state as a data attribute so we can toggle it.
    function setArrowRotation(arrowEl, expanded) {
        if (!arrowEl) return;
        const deg = expanded ? 180 : 0;
        // Get bounding box to rotate around the visual centre
        const bbox = arrowEl.getBBox ? arrowEl.getBBox() : null;
        if (bbox) {
            const cx = bbox.x + bbox.width / 2;
            const cy = bbox.y + bbox.height / 2;
            arrowEl.setAttribute('transform', `rotate(${deg}, ${cx}, ${cy})`);
        } else {
            arrowEl.style.transform = `rotate(${deg}deg)`;
            arrowEl.style.transformOrigin = 'center';
        }
    }

    // ─── INIT ─────────────────────────────────────────────────────────────────
    function init() {
        // Make SVG fully pointer-interactive
        if (svg) {
            svg.style.pointerEvents = 'all';
        }

        // Unwrap 'isolation' groups that block events
        document.querySelectorAll('g[isolation="isolate"]').forEach(g => {
            g.style.pointerEvents = 'none';
        });

        bindEvents();
        setMode('teacher');
    }

    // ─── BIND EVENTS ──────────────────────────────────────────────────────────
    function bindEvents() {
        // Mode toggle buttons
        // Teacher → switch immediately
        clickable(teacherModeBtn, () => setMode('teacher'));
        // Playground → show how-to-play modal FIRST; mode switch happens on Got It click
        clickable(playgroundModeBtn, () => {
            show(howToPlayModal);
            show(howToPlayRect)
            show(btnGotIt);
            show(btnGotItText);
        });

        // Teacher sliders — constants are defined at module scope:
        //   STEP_PX   ≈ 116.11 (1045 SVG units / 9 steps)
        //   BTN1_OFFSET ≈ -198.67  (110 - 308.67, so val=1 puts handle at x=110)
        //   BTN2_OFFSET ≈ -318.67  (110 - 428.67)
        setupSlider(scroolBtn2, scrollNum2, 1, 10, state.groups, STEP_PX, BTN2_OFFSET, (v) => {
            state.groups = v;
            refreshAll();
        });
        setupSlider(scroolBtn1, scrollNum1, 1, 10, state.items, STEP_PX, BTN1_OFFSET, (v) => {
            state.items = v;
            refreshAll();
        });

        // Teacher action buttons
        clickable(surpriseMeBtn, doSurpriseMe);
        clickable(resetBtn, doReset);
        clickable(showAnswerBtn, doShowAnswer);

        // ── Teacher-mode Theme dropdown (Group_562) ───────────────────────────
        // Clicking Group_562 (the dropdown box) opens an SVG list of theme choices.
        // Group_1578 (arrow) rotates 180° when the list is open.
        buildTeacherDropdown();

        // ── Collapse/expand teacher Q-panels ─────────────────────────────────
        // Click on the outer *-hl group to toggle the answer panel.
        // We stop propagation on the header's children so only the header itself
        // fires; the answer-panel content should not trigger collapse.
        clickable(multiQPanelHl, (e) => {
            // only toggle when clicking the header part (not the answer panel below)
            togglePanel(multiAnsPanelHl, 'panelMulti', arrowMulti);
        });
        clickable(repeatQPanelHl, () => {
            togglePanel(repeaAnsPanelHl, 'panelRepea', arrowRepeat);
        });
        clickable(inwordQPanelHl, () => {
            console.log('Toggling inword panel',inwordQPanelHl, inwordAnsPanelHl, arrowInword);
            togglePanel(inwordAnsPanelHl, 'panelInword', arrowInword);
        });

        // Playground panel interactions – now uses a real dropdown list
        clickable(themeDropdownBox, (e) => {
            e.stopPropagation();
            state.themeDropdownOpen = !state.themeDropdownOpen;
            if (state.themeDropdownOpen) {
                openPlaygroundDropdown();
            } else {
                closePlaygroundDropdown();
            }
        });
        buildPlaygroundDropdown();
        clickable(btnAddPicture, () => addGroup());
        clickable(btnAddPictureText, () => addGroup());
        // Dynamic sub-picture +/- handled during render Playground groups
        clickable(btnCheckMyAnswer, doCheckAnswer);

        // i-text icon → open how-to-play modal
        clickable(iText, () => {
            show(howToPlayModal);
            show(btnGotIt);
            show(btnGotItText);
        });

        clickable(closeAnswerBtn, closeAnswerModal);

        // Modals
        clickable(btnGotIt, closeHowToPlay);
        clickable(btnGotItText, closeHowToPlay);
        clickable(btnNewProblem, doNewProblem);
        clickable(newProblemBtn, doNewProblem);
    }

    // ─── MODE SWITCH ──────────────────────────────────────────────────────────
    function setMode(mode) {
        // Clear any pending feedback timeout when switching modes
        if (feedbackTimeoutId) {
            clearTimeout(feedbackTimeoutId);
            feedbackTimeoutId = null;
        }

        state.mode = mode;
        setTabActive(mode);   // slide the mode-panel highlight to the active tab

        if (mode === 'teacher') {
            // ── Show teacher-mode elements ─────────────────────────────────────
            // Slide mode-panel back to its original vertical position
            animateModePanel(0);

            show(layer25);            // sliders area
            show(layer50);            // Layer_50 (static pictures)
            show(picturePanelEl);     // picture-panel (teacher mode picture background)
            if (svgImagesGroup) svgImagesGroup.style.display = '';
            hide(svgImagesPlayground);    // svg-images-playground (only in playground mode)
            show(teacherThemeDropdown);   // Theme-drop-down
            show(multiQPanelHl);          // multi-Q-panel-hl
            show(repeatQPanelHl);         // repea-q-panel-hl
            show(inwordQPanelHl);         // inword-panel (Q side)

            // Default state: answer panels CLOSED
            hide(multiAnsPanelHl);        // multi-ans-panel-hl
            hide(repeaAnsPanelHl);        // repea-ans-panel-hl
            hide(inwordAnsPanelHl);       // inword-panel (ans side)
            state.panelMulti = false;
            state.panelRepea = false;
            state.panelInword = false;
            setArrowRotation(arrowMulti, false);
            setArrowRotation(arrowRepeat, false);
            setArrowRotation(arrowInword, false);

            show(surpriseMeBtn);          // btn-suprise-me
            show(resetBtn);               // reset-button

            // ── Hide playground-mode elements ──────────────────────────────────
            hide(playgroundChooseThemeSection);
            hide(playgroundAddPictureSection);
            hide(btnAddPicture);
            hide(btnAddPictureText);
            hide(howToPlayModal);
            hide(iText);
            hide(feedbackCorrect);
            hide(feedbackIncorrect);
            hide(answerModal);
            hide(btnCheckMyAnswer);
            hide(showAnswerBtn);
            hide(newProblemBtn);
            hide(problemPanel);

            // Hide playground groups container
            const pgGroupsContainer = document.getElementById('pg-groups-container');
            if (pgGroupsContainer) pgGroupsContainer.style.display = 'none';

            // Reset to defaults
            state.groups = 3;
            state.items = 4;
            refreshAll();

        } else {
            // ── Playground mode ────────────────────────────────────────────────

            // Hide all teacher-mode elements
            hide(layer25);                // Layer_25 (sliders)
            hide(layer50);                // Layer_50 (static pictures)
            hide(picturePanelEl);         // picture-panel (teacher-mode background)
            if (svgImagesGroup) svgImagesGroup.style.display = 'none';
            hide(teacherThemeDropdown);   // Theme-drop-down
            hide(multiQPanelHl);          // multi-Q-panel-h1
            hide(multiAnsPanelHl);        // multi-ans-panel-h1
            hide(repeatQPanelHl);         // repea-q-panel-h1
            hide(repeaAnsPanelHl);        // repea-ans-panel-h1
            hide(inwordQPanelHl);         // inword-panel (Q)
            hide(inwordAnsPanelHl);       // inword-panel (ans)
            hide(surpriseMeBtn);          // btn-suprise-me
            hide(resetBtn);               // reset-button

            // Show playground-mode elements
            show(problemPanel);                   // problem-panel
            show(svgImagesPlayground);            // svg-images-playground
            show(iText);                          // i-text
            show(playgroundChooseThemeSection);   // playground-panel-choose-theme-section
            show(playgroundAddPictureSection);    // playground-panel-add-picture-section
            show(btnAddPicture);
            if (btnAddPictureText) show(btnAddPictureText);
            show(btnCheckMyAnswer);               // btn-playground-panel-check-my-answer
            show(showAnswerBtn);                  // show-answer
            show(newProblemBtn);                  // new-problem

            // Feedback & answer-modal: hidden initially; shown only when
            // the user clicks "Check My Answer" (doCheckAnswer) or
            // "Show Answer" (doShowAnswer).
            hide(feedbackCorrect);    // feedback-playground-panel-correct-ans
            hide(feedbackIncorrect);  // feedback-playground-panel-incorrect-ans
            hide(answerModal);        // answer-modal  (btn-new-problem-answer-modal lives inside)

            // How-to-play modal stays hidden on mode switch; user can open it via i-text
            hide(howToPlayModal);

            state.answered = false;
            generateNewProblem();
        }
    }

    // ─── PANEL TOGGLE ─────────────────────────────────────────────────────────
    // Clicking a Q-panel-hl header hides/shows the corresponding answer panel.
    // The arrow rotates 180° when the answer panel is visible.
    function togglePanel(ansEl, stateKey, arrowEl) {
        state[stateKey] = !state[stateKey];
        if (state[stateKey]) {
            show(ansEl);
        } else {
            hide(ansEl);
        }
        setArrowRotation(arrowEl, state[stateKey]);
    }

    // ─── MODALS ───────────────────────────────────────────────────────────────
    function closeHowToPlay() {
        hide(howToPlayModal);
        hide(iText);
        hide(howToPlayRect)
        // Complete the playground mode switch (only if not already in playground)
        if (state.mode !== 'playground') {
            setMode('playground');
        }
        // Always slide the mode-panel up when closing how-to-play
        animateModePanel(PANEL_SHIFT_Y);
    }

    // ─── PLAYGROUND ACTIONS ───────────────────────────────────────────────────
    function addGroup() {
        if (state.groups < 10) {
            state.groups++;
            // Initialize items for the new group (empty by default)
            state.playgroundItems.push(0);
            refreshAll();
        }
    }

    function addItemToGroup(groupIndex) {
        if (state.playgroundItems[groupIndex] < 10) {
            state.playgroundItems[groupIndex]++;
            refreshAll();
        }
    }

    function removeItemFromGroup(groupIndex) {
        if (state.playgroundItems[groupIndex] > 0) {
            state.playgroundItems[groupIndex]--;
            refreshAll();
        }
    }

    function removeGroup(groupIndex) {
        if (state.groups > 0) {
            state.groups--;
            state.playgroundItems.splice(groupIndex, 1);
            refreshAll();
        }
    }

    function updateCheckAnswerButtonState() {
        if (state.mode === 'playground') {
            // Calculate total items in playground
            const totalItems = state.playgroundItems.reduce((sum, count) => sum + count, 0);
            // Disable button if no items have been added
            if (btnCheckMyAnswer) {
                btnCheckMyAnswer.style.pointerEvents = totalItems > 0 ? 'all' : 'none';
                btnCheckMyAnswer.style.opacity = totalItems > 0 ? '1' : '0.5';
            }
        }
    }

    function doCheckAnswer() {
        // Calculate total items from all groups
        const totalItems = state.playgroundItems.reduce((sum, count) => sum + count, 0);
        // Support commutative property: both a×b and b×a are correct
        const correct = (
            (state.groups === state.targetGroups && totalItems === (state.targetGroups * state.targetItems)) ||
            (state.groups === state.targetItems && totalItems === (state.targetItems * state.targetGroups))
        );
        if (correct) {
            state.answered = true;  // Only mark as answered if correct
            showFeedbackWithAutoHide(feedbackCorrect, feedbackIncorrect);
            updateProblemText();
        } else {
            showFeedbackWithAutoHide(feedbackIncorrect, feedbackCorrect);
        }
        // Update answer modal
        updateAnswerModal();
    }

    function showFeedbackWithAutoHide(showElement, hideElement) {
        // Clear any existing timeout
        if (feedbackTimeoutId) {
            clearTimeout(feedbackTimeoutId);
        }

        // Show the correct feedback, hide the other
        show(showElement);
        hide(hideElement);

        // Auto-hide after 4 seconds (4000 ms)
        feedbackTimeoutId = setTimeout(() => {
            hide(showElement);
            feedbackTimeoutId = null;
        }, 4000);
    }

    function doShowAnswer() {
        updateAnswerModal();
        show(answerModal);
        show(answerModalBg)
        hide(feedbackIncorrect);
    }

    function doNewProblem() {
        // Clear any pending feedback timeout
        if (feedbackTimeoutId) {
            clearTimeout(feedbackTimeoutId);
            feedbackTimeoutId = null;
        }
        hide(answerModal);
        hide(feedbackCorrect);
        hide(feedbackIncorrect);
        // Restore the static pictures container visibility
        if (showAnswerPictures) showAnswerPictures.style.display = '';
        state.answered = false;
        generateNewProblem();
    }

    function generateNewProblem() {
        state.targetGroups = randomInt(2, 10);
        state.targetItems = randomInt(2, 10);
        state.groups = 0; // pg-groups-container should start empty
        state.playgroundItems = []; // No items initially
        refreshAll();
    }

    function closeAnswerModal() {
        hide(answerModal);
        hide(answerModalBg);
    }

    function updateAnswerModal() {
        const g = state.targetGroups;
        const i = state.targetItems;
        const p = g * i;

        // Hide the static hardcoded pictures; we render dynamically below
        if (showAnswerPictures) showAnswerPictures.style.display = 'none';

        const container = document.getElementById('show-answer-tos');
        if (!container) return;

        // ── Build equation rows only (no SVGs) ─────────────────────────────────
        const repeatedAdditionParts = Array(g).fill(i).join(' + ');
        const fs = 30; // slightly smaller font when long equations

        const equationHTML = `
          <div style="width:100%;min-height:350px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-family:Roboto,sans-serif;padding:40px 20px;">
            <div style="font-size:${fs}px;color:#222;">
              <strong>Repeated Addition:</strong> ${repeatedAdditionParts} = ${p}
            </div>
            <div style="font-size:${fs}px;color:#222;">
              <strong>Multiplication Shortcut:</strong> ${g} × ${i} = ${p}
            </div>
            <div style="font-size:${fs}px;color:#4caf50;font-weight:700;">
              OR
            </div>
            <div style="font-size:${fs}px;color:#222;">
              <strong>Repeated Addition:</strong> ${Array(i).fill(g).join(' + ')} = ${p}
            </div>
            <div style="font-size:${fs}px;color:#222;">
              <strong>Multiplication Shortcut:</strong> ${i} × ${g} = ${p}
            </div>
          </div>`;

        container.innerHTML = equationHTML;
    }

    // ─── SURPRISE ME / RESET ──────────────────────────────────────────────────
    function doSurpriseMe() {
        state.groups = randomInt(2, 10);
        state.items = randomInt(2, 10);
        const themes = Object.keys(THEMES);   // ['plates', 'vas', 'palette']
        state.theme = themes[Math.floor(Math.random() * themes.length)];
        applyThemeLabels();

        positionSlider(scroolBtn2, scrollNum2, state.groups, BTN2_OFFSET, STEP_PX);
        positionSlider(scroolBtn1, scrollNum1, state.items, BTN1_OFFSET, STEP_PX);

        refreshAll();
    }

    function doReset() {
        state.groups = 3;
        state.items = 4;
        state.theme = 'plates';
        applyThemeLabels();
        positionSlider(scroolBtn2, scrollNum2, 3, BTN2_OFFSET, STEP_PX);
        positionSlider(scroolBtn1, scrollNum1, 4, BTN1_OFFSET, STEP_PX);
        refreshAll();
    }

    // ─── THEME ────────────────────────────────────────────────────────────────
    // "birthday" / Cakes & Candles removed as requested
    const THEMES = {
        plates: { group: 'Plates', item: 'Cookies', addGroup: 'Tap to Add Plates', addItem: 'Add Cookies' },
        vas: { group: 'Vases', item: 'Flowers', addGroup: 'Tap to Add Vases', addItem: 'Add Flowers' },
        palette: { group: 'Palettes', item: 'Drops', addGroup: 'Tap to Add Palettes', addItem: 'Add Drops' }
    };

    // Maps theme key → SVG template element ID in the DOM
    const THEME_SVG_MAP = {
        plates: 'svg-image-plate-cookie',
        vas: 'svg-image-flower-vase',
        palette: 'svg-image-paint-color'
    };

    function doSwitchTheme() {
        // Legacy – kept so nothing breaks if called from elsewhere.
        // In playground mode we use the dropdown instead.
        const keys = Object.keys(THEMES);
        const idx = keys.indexOf(state.theme);
        state.theme = keys[(idx + 1) % keys.length];
        applyThemeLabels();
        refreshAll();
    }

    // ─── PLAYGROUND THEME DROPDOWN ────────────────────────────────────────────
    // Same pattern as buildTeacherDropdown() but for the playground panel.
    // Playground dropdown box:  x=189.22, y=369.74, width=1622, height=55
    // Picture-border preview:   x=884.1,  y=629.92, width=208.67, height=176.99

    const PG_DD = {
        X: 189.22, Y_BOX: 369.74, W: 1622, H_ROW: 55,
        FILL_NORMAL: '#ffffff',
        FILL_HOVER: '#dff0ff',
        FILL_ACTIVE: '#cfeeff',
        STROKE: '#004897',
        FONT_SIZE: 28,
        FONT_FAMILY: 'Roboto-Medium, SQAKWO+Roboto-Medium',
        TEXT_OFFSET_Y: 36,
        TEXT_OFFSET_X: 21,
    };
    const PG_DROPDOWN_THEMES = [
        { key: 'plates', label: 'Plates and Cookies' },
        { key: 'vas', label: 'Vases and Flowers' },
        { key: 'palette', label: 'Palettes and Drops' },
    ];
    // Arrow inside playground dropdown box
    const playgroundDropdownArrow = document.getElementById('Group_1578-2');
    let _pgDropdownList = null;   // cached reference to the injected list group

    function buildPlaygroundDropdown() {
        if (!themeDropdownBox) return;
        const svgEl = document.querySelector('svg');
        const NS = 'http://www.w3.org/2000/svg';

        const listGroup = document.createElementNS(NS, 'g');
        listGroup.setAttribute('id', 'pg-theme-dropdown-list');
        listGroup.style.display = 'none';

        // Background border rect for the whole list
        const bgRect = document.createElementNS(NS, 'rect');
        bgRect.setAttribute('x', PG_DD.X);
        bgRect.setAttribute('y', PG_DD.Y_BOX + PG_DD.H_ROW);
        bgRect.setAttribute('width', PG_DD.W);
        bgRect.setAttribute('height', PG_DD.H_ROW * PG_DROPDOWN_THEMES.length);
        bgRect.setAttribute('rx', 12);
        bgRect.setAttribute('ry', 12);
        bgRect.setAttribute('fill', '#ffffff');
        bgRect.setAttribute('stroke', PG_DD.STROKE);
        bgRect.setAttribute('stroke-width', '2');
        listGroup.appendChild(bgRect);

        PG_DROPDOWN_THEMES.forEach((theme, idx) => {
            const rowY = PG_DD.Y_BOX + PG_DD.H_ROW + idx * PG_DD.H_ROW;
            const rowGroup = document.createElementNS(NS, 'g');
            rowGroup.style.cursor = 'pointer';
            rowGroup.style.pointerEvents = 'all';

            const rowRect = document.createElementNS(NS, 'rect');
            rowRect.setAttribute('x', PG_DD.X + 1);
            rowRect.setAttribute('y', rowY + 1);
            rowRect.setAttribute('width', PG_DD.W - 2);
            rowRect.setAttribute('height', PG_DD.H_ROW - 2);
            rowRect.setAttribute('fill', PG_DD.FILL_NORMAL);
            rowRect.setAttribute('rx', idx === PG_DROPDOWN_THEMES.length - 1 ? 12 : 0);
            rowGroup.appendChild(rowRect);

            const rowText = document.createElementNS(NS, 'text');
            rowText.setAttribute('x', PG_DD.X + PG_DD.TEXT_OFFSET_X);
            rowText.setAttribute('y', rowY + PG_DD.TEXT_OFFSET_Y);
            rowText.setAttribute('font-family', PG_DD.FONT_FAMILY);
            rowText.setAttribute('font-size', PG_DD.FONT_SIZE);
            rowText.setAttribute('font-weight', '500');
            rowText.style.pointerEvents = 'none';
            const tspan = document.createElementNS(NS, 'tspan');
            tspan.textContent = theme.label;
            rowText.appendChild(tspan);
            rowGroup.appendChild(rowText);

            rowGroup.addEventListener('mouseenter', () => {
                rowRect.setAttribute('fill', PG_DD.FILL_HOVER);
            });
            rowGroup.addEventListener('mouseleave', () => {
                rowRect.setAttribute('fill',
                    state.theme === theme.key ? PG_DD.FILL_ACTIVE : PG_DD.FILL_NORMAL);
            });
            rowGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                selectPlaygroundTheme(theme.key);
                closePlaygroundDropdown();
            });

            listGroup.appendChild(rowGroup);
        });

        svgEl.appendChild(listGroup);
        _pgDropdownList = listGroup;

        // Close when clicking anywhere else
        document.addEventListener('click', () => {
            if (state.themeDropdownOpen) closePlaygroundDropdown();
        });
    }

    function openPlaygroundDropdown() {
        if (_pgDropdownList) _pgDropdownList.style.display = 'block';
        state.themeDropdownOpen = true;
        setArrowRotation(playgroundDropdownArrow, true);
        _highlightPgThemeRow();
    }

    function closePlaygroundDropdown() {
        if (_pgDropdownList) _pgDropdownList.style.display = 'none';
        state.themeDropdownOpen = false;
        setArrowRotation(playgroundDropdownArrow, false);
    }

    function _highlightPgThemeRow() {
        if (!_pgDropdownList) return;
        // First child is the background rect; remaining are row groups
        const rowGroups = Array.from(_pgDropdownList.children).slice(1);
        rowGroups.forEach((rowGroup, idx) => {
            const rowRect = rowGroup.querySelector('rect');
            if (!rowRect) return;
            const key = PG_DROPDOWN_THEMES[idx] ? PG_DROPDOWN_THEMES[idx].key : null;
            rowRect.setAttribute('fill', key === state.theme ? PG_DD.FILL_ACTIVE : PG_DD.FILL_NORMAL);
        });
    }

    function selectPlaygroundTheme(themeKey) {
        state.theme = themeKey;
        applyThemeLabels();
        refreshAll();
    }

    // ─── TEACHER THEME DROPDOWN (Group_562) ───────────────────────────────────
    // Builds a real SVG dropdown list below the Group_562 box.
    // The list lives as a sibling <g> injected into the SVG, positioned at the
    // same x/width as the dropdown box and starting just below it.
    //
    // Dropdown box in SVG:  x=96, y=234.4, width=1141, height=55
    // List starts at:       y=289.4  (= 234.4 + 55)
    // Each row height:      55 SVG units (matches dropdown box)
    // Arrow: Group_1578 → rotate(180) when open, rotate(0) when closed
    //
    // Theme label element: #Plates_Cookies tspan (inside Group_1501 inside Group_562)

    const TEACHER_DROPDOWN_THEMES = [
        { key: 'plates', label: 'Plates \u0026 Cookies' },
        { key: 'vas', label: 'Vases \u0026 Flowers' },
        { key: 'palette', label: 'Palettes \u0026 Drops' },
    ];

    const DD = {
        X: 96, Y_BOX: 234.4, W: 1141, H_ROW: 55,
        FILL_NORMAL: '#ffffff',
        FILL_HOVER: '#dff0ff',
        FILL_ACTIVE: '#cfeeff',
        STROKE: '#004897',
        FONT_SIZE: 28,
        FONT_FAMILY: 'Roboto-Medium, SQAKWO+Roboto-Medium',
        TEXT_OFFSET_Y: 36,   // baseline offset inside the row
        TEXT_OFFSET_X: 21,   // same left margin as original label
    };

    function buildTeacherDropdown() {
        const dropdownBox = document.getElementById('Group_562');
        if (!dropdownBox) return;

        // Make the dropdown box clickable
        dropdownBox.style.cursor = 'pointer';
        dropdownBox.style.pointerEvents = 'all';
        dropdownBox.querySelectorAll('rect, text, g, tspan').forEach(el => {
            el.style.pointerEvents = 'all';
        });

        // Create the list container (hidden by default)
        const svgEl = document.querySelector('svg');
        const NS = 'http://www.w3.org/2000/svg';

        const listGroup = document.createElementNS(NS, 'g');
        listGroup.setAttribute('id', 'theme-dropdown-list');
        listGroup.style.display = 'none';

        // Overall background / border for the whole list
        const bgRect = document.createElementNS(NS, 'rect');
        bgRect.setAttribute('x', DD.X);
        bgRect.setAttribute('y', DD.Y_BOX + DD.H_ROW);
        bgRect.setAttribute('width', DD.W);
        bgRect.setAttribute('height', DD.H_ROW * TEACHER_DROPDOWN_THEMES.length);
        bgRect.setAttribute('rx', 12);
        bgRect.setAttribute('ry', 12);
        bgRect.setAttribute('fill', '#ffffff');
        bgRect.setAttribute('stroke', DD.STROKE);
        bgRect.setAttribute('stroke-width', '2');
        listGroup.appendChild(bgRect);

        // One row per theme
        TEACHER_DROPDOWN_THEMES.forEach((theme, idx) => {
            const rowY = DD.Y_BOX + DD.H_ROW + idx * DD.H_ROW;
            const rowGroup = document.createElementNS(NS, 'g');
            rowGroup.style.cursor = 'pointer';
            rowGroup.style.pointerEvents = 'all';

            // Row highlight rect
            const rowRect = document.createElementNS(NS, 'rect');
            rowRect.setAttribute('x', DD.X + 1);
            rowRect.setAttribute('y', rowY + 1);
            rowRect.setAttribute('width', DD.W - 2);
            rowRect.setAttribute('height', DD.H_ROW - 2);
            rowRect.setAttribute('fill', DD.FILL_NORMAL);
            rowRect.setAttribute('rx', idx === 0 ? 0 : (idx === TEACHER_DROPDOWN_THEMES.length - 1 ? 12 : 0));
            rowGroup.appendChild(rowRect);

            // Row label
            const rowText = document.createElementNS(NS, 'text');
            rowText.setAttribute('x', DD.X + DD.TEXT_OFFSET_X);
            rowText.setAttribute('y', rowY + DD.TEXT_OFFSET_Y);
            rowText.setAttribute('font-family', DD.FONT_FAMILY);
            rowText.setAttribute('font-size', DD.FONT_SIZE);
            rowText.setAttribute('font-weight', '500');
            rowText.style.pointerEvents = 'none';     // clicks go to rowGroup
            const tspan = document.createElementNS(NS, 'tspan');
            tspan.textContent = theme.label;
            rowText.appendChild(tspan);
            rowGroup.appendChild(rowText);

            // Hover effects
            rowGroup.addEventListener('mouseenter', () => {
                rowRect.setAttribute('fill', DD.FILL_HOVER);
            });
            rowGroup.addEventListener('mouseleave', () => {
                rowRect.setAttribute('fill',
                    state.theme === theme.key ? DD.FILL_ACTIVE : DD.FILL_NORMAL);
            });

            // Click → select theme
            rowGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                selectTeacherTheme(theme.key);
                closeTeacherDropdownList();
            });

            listGroup.appendChild(rowGroup);
        });

        // Append at the END of the SVG so it paints on top of all other layers
        // (SVG renders in DOM order: last child = highest z-order)
        svgEl.appendChild(listGroup);

        // ── Wire up the dropdown toggle ────────────────────────────────────────
        dropdownBox.addEventListener('click', (e) => {
            e.stopPropagation();
            state.teacherThemeDropdownOpen = !state.teacherThemeDropdownOpen;
            if (state.teacherThemeDropdownOpen) {
                openTeacherDropdownList();
            } else {
                closeTeacherDropdownList();
            }
        });

        // Close list when clicking anywhere else
        document.addEventListener('click', () => {
            if (state.teacherThemeDropdownOpen) {
                closeTeacherDropdownList();
            }
        });
    }

    function openTeacherDropdownList() {
        const list = document.getElementById('theme-dropdown-list');
        if (list) list.style.display = 'block';
        state.teacherThemeDropdownOpen = true;
        setArrowRotation(teacherDropdownArrow, true);
        // Highlight currently active theme row
        highlightActiveThemeRow();
    }

    function closeTeacherDropdownList() {
        const list = document.getElementById('theme-dropdown-list');
        if (list) list.style.display = 'none';
        state.teacherThemeDropdownOpen = false;
        setArrowRotation(teacherDropdownArrow, false);
    }

    function highlightActiveThemeRow() {
        const list = document.getElementById('theme-dropdown-list');
        if (!list) return;
        const rows = list.querySelectorAll('g');
        rows.forEach((rowGroup, idx) => {
            const rowRect = rowGroup.querySelector('rect');
            if (!rowRect) return;
            const themeKey = TEACHER_DROPDOWN_THEMES[idx] ? TEACHER_DROPDOWN_THEMES[idx].key : null;
            rowRect.setAttribute('fill', themeKey === state.theme ? DD.FILL_ACTIVE : DD.FILL_NORMAL);
        });
    }

    function selectTeacherTheme(themeKey) {
        state.theme = themeKey;
        applyThemeLabels();
        refreshAll();
    }



    function applyThemeLabels() {
        const t = THEMES[state.theme] || THEMES.birthday;
        // Slider headings
        const h1 = scroolerH2 ? scroolerH2.querySelector('tspan') : null;
        const h2 = scroolerH1 ? scroolerH1.querySelector('tspan') : null;
        if (h1) h1.textContent = `Number of ${t.item}`;
        if (h2) h2.textContent = `Number of ${t.group}`;
        // Add button text
        if (btnAddPictureText) setText(btnAddPictureText, t.addGroup);
        // Teacher dropdown label
        if (teacherThemeDropdown) {
            const lbl = teacherThemeDropdown.querySelector('#Plates_Cookies tspan');
            if (lbl) lbl.textContent = `${t.group} & ${t.item}`;
        }
        // Playground dropdown label
        if (themeDropdownBox) {
            const lbl = themeDropdownBox.querySelector('tspan');
            if (lbl) lbl.textContent = `${t.group} and ${t.item}`;
        }
    }

    // ─── REFRESH ALL ──────────────────────────────────────────────────────────
    function refreshAll() {
        updateProblemText();
        updatePanelsText();
        renderVisuals();
        renderSvgImages();
        renderPlaygroundGroups(); // Added to refresh playground groups
        updateCheckAnswerButtonState();
    }

    // ─── PROBLEM TEXT ─────────────────────────────────────────────────────────
    function updateProblemText() {
        const g = state.mode === 'playground' ? state.targetGroups : state.groups;
        const i = state.mode === 'playground' ? state.targetItems : state.items;
        const p = g * i;

        if (problemText) {
            if (state.mode === 'playground' && !state.answered) {
                problemText.textContent = `Problem: ${g} x ${i} = ?`;
            } else {
                problemText.textContent = `Problem: ${g} x ${i} = ${p}`;
            }
        }
    }

    // ─── PANELS TEXT ──────────────────────────────────────────────────────────
    function updatePanelsText() {
        const g = state.groups;
        const i = state.items;
        const p = g * i;

        // Multiplication shortcut
        if (multiAnsText) setText(multiAnsText, `${g} x ${i} = ${p}`);

        // Repeated addition
        if (repeaAnsText) {
            const parts = Array(g > 0 ? g : 1).fill(i).join(' + ');
            setText(repeaAnsText, `${parts} = ${p}`);
        }

        // In words
        const wordItem = WORD_MAP[i - 1] || `${i}s`;
        if (inwordText1) setText(inwordText1, `"${g} groups of ${i} is ${p}"`);
        if (inwordText2) setText(inwordText2, `"${g} times of ${i} is ${p}"`);
        if (inwordText3) setText(inwordText3, `"${g} ${wordItem} are ${p}"`);
    }

    // ─── RENDER VISUALS: Layer_50 ─────────────────────────────────────────────
    function renderVisuals() {
        if (!layer50) return;
        const groupEls = Array.from(layer50.children);
        groupEls.forEach((groupEl, gi) => {
            if (gi < state.groups) {
                groupEl.style.display = 'block';
                const itemEls = Array.from(groupEl.querySelectorAll(':scope > g'));
                itemEls.forEach((itemEl, ii) => {
                    itemEl.style.display = ii < state.items ? 'block' : 'none';
                });
            } else {
                groupEl.style.display = 'none';
            }
        });
    }

    // ─── RENDER SVG IMAGES (foreignObject group) ──────────────────────────────
    // Shows state.groups copies of the current-theme SVG.
    // Inside each copy, shows state.items "item" elements (cookies / drops / flowers).
    //
    // Item identification per SVG:
    //  plates  → <g mask="url(#maskN_711_947)"> where N=3..12  (10 cookies)
    //  palette → direct <path fill-rule="evenodd"> children after the base <g mask>  (10 color dots)
    //  vas     → each flower = 11 consecutive direct <path> children starting with
    //            the green stem (#00AF64). Last 3 paths are the vase body (skip).

    function _getItemsFromSvg(svgEl, themeKey) {
        const children = Array.from(svgEl.childNodes)
            .filter(n => n.nodeType === 1);       // element nodes only

        if (themeKey === 'plates') {
            // Cookies: <g> elements that have a mask attribute referencing mask3..mask12
            return children.filter(el =>
                el.tagName === 'g' &&
                el.hasAttribute('mask') &&
                /mask([3-9]|1[0-2])_711_947/.test(el.getAttribute('mask'))
            );
        }

        if (themeKey === 'palette') {
            // Color dots: direct <path fill-rule="evenodd"> children of the SVG
            // (the one inside <g mask> is the palette body — skip it)
            return children.filter(el =>
                el.tagName === 'path' &&
                el.getAttribute('fill-rule') === 'evenodd'
            );
        }

        if (themeKey === 'vas') {
            // Flowers: each flower = 11 consecutive paths, starting with green stem.
            // Last 3 direct children are vase body — exclude.
            const VASE_BODY_FILL = ['#D9ACF4', '#6C6FF3', '#B98DF8'];
            const paths = children.filter(el =>
                el.tagName === 'path' &&
                !VASE_BODY_FILL.includes(el.getAttribute('fill'))
            );
            // Group into arrays of 11 (one per flower)
            const flowers = [];
            for (let i = 0; i < paths.length; i += 11) {
                flowers.push(paths.slice(i, i + 11));
            }
            return flowers;   // array of arrays
        }

        return [];
    }

    function _setVasItemsVisibility(clonedSvg, itemCount, themeKey) {
        if (themeKey !== 'vas') return;
        const VASE_BODY_FILL = ['#D9ACF4', '#6C6FF3', '#B98DF8'];
        const children = Array.from(clonedSvg.childNodes).filter(n => n.nodeType === 1);
        const paths = children.filter(el =>
            el.tagName === 'path' &&
            !VASE_BODY_FILL.includes(el.getAttribute('fill'))
        );
        paths.forEach((path, idx) => {
            const flowerIndex = Math.floor(idx / 11);   // which flower (0-based)
            path.style.display = flowerIndex < itemCount ? '' : 'none';
        });
    }

    function renderSvgImages() {
        const foEl = document.getElementById('svg-images-group');
        if (!foEl) return;

        const svgId = THEME_SVG_MAP[state.theme];
        if (!svgId) return;

        const templateSvg = document.getElementById(svgId);
        if (!templateSvg) return;

        // Use (or create) a dedicated output <div> separate from the templates div
        let container = document.getElementById('svg-images-output');
        if (!container) {
            container = document.createElement('div');
            container.id = 'svg-images-output';
            foEl.appendChild(container);
        }
        container.innerHTML = '';
        container.style.cssText = 'width:100%;height:100%;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;';

        for (let g = 0; g < state.groups; g++) {
            // Clone SVG + uniquify IDs to avoid mask reference conflicts
            let html = templateSvg.outerHTML;
            html = html.replace(/id="([^"]+)"/g, (_, id) => `id="${id}_g${g}"`);
            html = html.replace(/url\(#([^)]+)\)/g, (_, ref) => `url(#${ref}_g${g})`);
            // Strip the hidden/template display if any
            html = html.replace(/display:\s*none/g, '');

            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            const clonedSvg = wrapper.querySelector('svg');
            if (!clonedSvg) continue;

            // Set a uniform size that fits within the foreignObject height
            clonedSvg.setAttribute('width', '120');
            clonedSvg.setAttribute('height', '120');
            clonedSvg.style.display = 'block';

            if (state.theme === 'vas') {
                _setVasItemsVisibility(clonedSvg, state.items, state.theme);
            } else {
                const items = _getItemsFromSvg(clonedSvg, state.theme);
                items.forEach((item, idx) => {
                    item.style.display = idx < state.items ? '' : 'none';
                });
            }

            container.appendChild(clonedSvg);
        }
    }

    // ─── PLAYGROUND GROUPS ───────────────────────────────────────────────────
    // Dynamically generates the N playground picture groups based on state.groups.
    function renderPlaygroundGroups() {
        const container = document.getElementById('pg-groups-container');
        const innerSvgTemplate = document.getElementById('pg-group-template');

        if (!container || !innerSvgTemplate) return;

        // Clear existing
        container.innerHTML = '';

        // Hide if not in playground mode
        if (state.mode !== 'playground') {
            container.style.display = 'none';
            return;
        }
        container.style.display = '';

        // If 0 groups, don't render any
        if (state.groups === 0) return;

        // Get the chosen theme's template
        const themeGroup = document.getElementById('svg-images-group-playground');
        const themeTemplateId = THEME_SVG_MAP[state.theme];
        const themeTemplate = themeGroup ? themeGroup.querySelector('#' + themeTemplateId) : document.getElementById(themeTemplateId);

        // Get viewbox/dimensions for the item svg
        let svgW = 90, svgH = 90;
        if (themeTemplate) {
            const vb = themeTemplate.getAttribute('viewBox');
            if (vb) {
                const parts = vb.trim().split(/[\s,]+/);
                svgW = parseFloat(parts[2]) || 100;
                svgH = parseFloat(parts[3]) || 100;
            } else {
                svgW = parseFloat(themeTemplate.getAttribute('width')) || 100;
                svgH = parseFloat(themeTemplate.getAttribute('height')) || 100;
            }
        }

        for (let g = 0; g < state.groups; g++) {
            const clone = innerSvgTemplate.cloneNode(true);
            clone.removeAttribute('id');
            clone.style.display = '';

            // Grid calculation for placing the element visually within the 1650x405 container
            const itemWidth = 240;
            const itemHeight = 200;
            const columns = Math.floor(1650 / itemWidth);
            const r = Math.floor(g / columns);
            const c = g % columns;

            // Use transform translate so the `<g>` positions itself appropriately
            const xPos = c * itemWidth + 40;
            const yPos = r * itemHeight + 40;

            clone.setAttribute('transform', `translate(${xPos}, ${yPos})`);

            // Setup buttons
            const btnAdd = clone.querySelector('.btn-pg-add-sub');
            const btnMinus = clone.querySelector('.btn-pg-minus-sub');
            const btnCancel = clone.querySelector('.btn-pg-cancel');

            if (btnAdd) clickable(btnAdd, () => addItemToGroup(g));
            if (btnMinus) clickable(btnMinus, () => removeItemFromGroup(g));
            if (btnCancel) clickable(btnCancel, () => removeGroup(g));

            // Inject items into the border
            const itemsContainer = clone.querySelector('.pg-items-container');
            const itemsCount = state.playgroundItems[g];

            if (themeTemplate && itemsContainer) {
                const imgClone = themeTemplate.cloneNode(true);
                imgClone.removeAttribute('id');

                if (state.theme === 'vas') {
                    _setVasItemsVisibility(imgClone, itemsCount, state.theme);
                } else {
                    const items = _getItemsFromSvg(imgClone, state.theme);
                    items.forEach((item, idx) => {
                        item.style.display = idx < itemsCount ? '' : 'none';
                    });
                }

                const serializer = new XMLSerializer();
                let svgStr = serializer.serializeToString(imgClone);
                if (!svgStr.includes('xmlns=')) {
                    svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
                }
                const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);

                // center inside plate bounds
                const PB_W = 208.67, PB_H = 176.99;
                const scale = Math.min(PB_W / svgW, PB_H / svgH) * 0.92;
                const imgW = svgW * scale - 30;
                const imgH = svgH * scale - 30;

                const imgX = (PB_W - imgW) / 2;
                const imgY = (PB_H - imgH) / 2;

                const NS = 'http://www.w3.org/2000/svg';
                const imgEl = document.createElementNS(NS, 'image');
                imgEl.setAttribute('x', imgX);
                imgEl.setAttribute('y', imgY);
                imgEl.setAttribute('width', imgW);
                imgEl.setAttribute('height', imgH);
                imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataUri);
                imgEl.setAttribute('href', dataUri);
                imgEl.style.pointerEvents = 'none';

                itemsContainer.appendChild(imgEl);
            }

            container.appendChild(clone);
        }
    }

    // ─── SLIDERS ──────────────────────────────────────────────────────────────
    // Slider positions (absolute SVG x):
    //   start (value=1) → x = 110
    //   end   (value=10)→ x = 1155
    //
    // Each button's polygon apex is fixed in the path data:
    //   scrool-btn-1 apex ≈ 308.67  → offset = 110 - 308.67 = -198.67
    //   scrool-btn-2 apex ≈ 428.67  → offset = 110 - 428.67 = -318.67
    //
    // translate applied = offset + (val-1) * stepPx
    // (Constants moved to top of file to avoid temporal dead zone.)

    function svgScale() {
        return svg ? (2016 / svg.getBoundingClientRect().width) : 1;
    }

    function getTranslateX(el) {
        const t = el.getAttribute('transform');
        if (t) {
            const m = t.match(/translate\(\s*([-\d.]+)/);
            if (m) return parseFloat(m[1]);
        }
        return 0;
    }

    /**
     * Position a slider handle at the given value.
     * @param {Element} btn      - the slider button group element
     * @param {Element} numEl    - the number display element
     * @param {number}  val      - current value (1-10)
     * @param {number}  offset   - translate when val=1 (btn-specific)
     * @param {number}  stepPx   - SVG units per step
     */
    function positionSlider(btn, numEl, val, offset, stepPx) {
        if (!btn) return;
        const x = offset + (val - 1) * stepPx;
        btn.setAttribute('transform', `translate(${x}, 0)`);
        if (numEl) {
            numEl.querySelectorAll('tspan').forEach(t => t.textContent = val);
        }
    }

    function setupSlider(btn, numEl, min, max, defaultVal, stepPx, offset, onChange) {
        if (!btn) return;

        let dragging = false;
        let startClientX = 0;
        let startSvgX = 0;
        let currentVal = defaultVal;

        btn.style.cursor = 'ew-resize';
        btn.style.pointerEvents = 'all';

        // Set initial position
        positionSlider(btn, numEl, defaultVal, offset, stepPx);

        const onDown = (e) => {
            dragging = true;
            startClientX = e.touches ? e.touches[0].clientX : e.clientX;
            startSvgX = getTranslateX(btn);
            e.preventDefault();
        };

        const onMove = (e) => {
            if (!dragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const deltaPx = (clientX - startClientX) * svgScale();
            let newX = startSvgX + deltaPx;

            // Clamp within [offset, offset + stepPx*(max-min)]
            const minX = offset;
            const maxX = offset + stepPx * (max - min);
            newX = Math.max(minX, Math.min(maxX, newX));

            // Snap to nearest step
            const relX = newX - offset;
            const step = Math.round(relX / stepPx);
            const snapped = offset + step * stepPx;
            const val = min + step;

            btn.setAttribute('transform', `translate(${snapped}, 0)`);

            if (numEl) {
                numEl.querySelectorAll('tspan').forEach(t => t.textContent = val);
            }

            if (val !== currentVal) {
                currentVal = val;
                onChange(val);
            }
            e.preventDefault();
        };

        const onUp = () => { dragging = false; };

        btn.addEventListener('mousedown', onDown, { passive: false });
        btn.addEventListener('touchstart', onDown, { passive: false });
        document.addEventListener('mousemove', onMove, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchend', onUp);
    }

    // ─── UTILITY ──────────────────────────────────────────────────────────────
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ─── START ────────────────────────────────────────────────────────────────
    init();
});
