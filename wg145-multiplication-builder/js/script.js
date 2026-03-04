document.addEventListener("DOMContentLoaded", () => {

    // ─── ELEMENT REFERENCES ────────────────────────────────────────────────────
    const svg = document.querySelector('svg');

    // Mode panel
    const modePanelHl = document.getElementById('mode-panel-hl');
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
    const repeaAnsText = document.getElementById('_4_4_4_12');   // "4 + 4 + 4 = 12"
    const inwordText1 = document.getElementById('_3_groups_of_4_is');
    const inwordText2 = document.getElementById('_3_times_of_4_is');
    const inwordText3 = document.getElementById('_3_fours_are');

    // Problem panel (shown only in Playground mode)
    const problemPanel = document.getElementById('problem-panel');
    const problemText = document.querySelector('#problem-tos tspan');

    // Teacher-mode Theme dropdown (the whole box in Layer_25 area)
    const teacherThemeDropdown = document.getElementById('Theme-drop-down');
    const teacherDropdownArrow = document.getElementById('Group_1578');

    // Picture / playground panels
    const playgroundChooseThemeSection = document.getElementById('playground-panel-choose-theme-section');
    const playgroundAddPictureSection = document.getElementById('playground-panel-add-picture-section');
    const themeDropdownBox = document.getElementById('playground-panel-choose-theme-dropdown-box');
    const btnAddPicture = document.getElementById('btn-playground-panel-add-picture');
    const btnAddPictureText = document.getElementById('btn-playground-panel-add-picture-text');
    const btnCheckMyAnswer = document.getElementById('btn-playground-panel-check-my-answer');
    const btnSubPicture = document.getElementById('btn-playground-panel-add-sub-picture');
    const btnMinusPicture = document.getElementById('btn-playground-panel-minus-sub-picture');
    const newProblemBtn = document.getElementById('new-problem');

    // Feedback
    const feedbackCorrect = document.getElementById('feedback-playground-panel-correct-ans');
    const feedbackIncorrect = document.getElementById('feedback-playground-panel-incorrect-ans');

    // How to play modal
    const howToPlayModal = document.getElementById('how-to-play');
    const btnGotIt = document.getElementById('btn-got-it');
    const btnGotItText = document.getElementById('btn-got-it-text');

    // Answer modal
    const answerModal = document.getElementById('answer-modal');
    const btnNewProblem = document.getElementById('btn-new-problem-answer-modal');

    // i-text hint (playground)
    const iText = document.getElementById('i-text');

    // Visual layers
    const layer25 = document.getElementById('Layer_25');   // Sliders area
    const layer50 = document.getElementById('Layer_50');   // Animated pictures area
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

    // ─── HELPERS ──────────────────────────────────────────────────────────────
    function show(el) { if (el) el.style.display = 'block'; }
    function hide(el) { if (el) el.style.display = 'none'; }
    function isHidden(el) { return !el || el.style.display === 'none'; }

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
        const t = tspanOf(el);
        if (t) t.textContent = text;
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
        clickable(teacherModeBtn, () => setMode('teacher'));
        clickable(playgroundModeBtn, () => setMode('playground'));

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
            togglePanel(inwordAnsPanelHl, 'panelInword', arrowInword);
        });

        // Playground panel interactions
        clickable(themeDropdownBox, () => {
            state.themeDropdownOpen = !state.themeDropdownOpen;
            doSwitchTheme();
        });
        clickable(btnAddPicture, () => addGroup());
        clickable(btnAddPictureText, () => addGroup());
        clickable(btnSubPicture, () => addItem());
        clickable(btnMinusPicture, () => removeItem());
        clickable(btnCheckMyAnswer, doCheckAnswer);

        // Modals
        clickable(btnGotIt, closeHowToPlay);
        clickable(btnGotItText, closeHowToPlay);
        clickable(btnNewProblem, doNewProblem);
    }

    // ─── MODE SWITCH ──────────────────────────────────────────────────────────
    function setMode(mode) {
        state.mode = mode;

        if (mode === 'teacher') {
            // Show teacher elements
            show(layer25);
            show(layer50);
            if (svgImagesGroup) svgImagesGroup.style.display = '';
            show(teacherThemeDropdown);
            show(multiQPanelHl);
            show(repeatQPanelHl);
            show(inwordQPanelHl);

            // Default state: answer panels OPEN
            show(multiAnsPanelHl);
            show(repeaAnsPanelHl);
            show(inwordAnsPanelHl);
            state.panelMulti = true;
            state.panelRepea = true;
            state.panelInword = true;
            setArrowRotation(arrowMulti, true);
            setArrowRotation(arrowRepeat, true);
            setArrowRotation(arrowInword, true);

            // Hide playground elements
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
            show(surpriseMeBtn);
            show(resetBtn);
            hide(problemPanel);

            // Reset to defaults
            state.groups = 3;
            state.items = 4;
            refreshAll();

        } else {
            // Playground mode
            // Hide teacher elements
            hide(layer25);
            hide(layer50);
            if (svgImagesGroup) svgImagesGroup.style.display = 'none';
            hide(teacherThemeDropdown);
            hide(multiQPanelHl);
            hide(repeatQPanelHl);
            hide(inwordQPanelHl);
            hide(multiAnsPanelHl);
            hide(repeaAnsPanelHl);
            hide(inwordAnsPanelHl);

            // Show playground elements
            show(playgroundChooseThemeSection);
            show(playgroundAddPictureSection);
            show(btnAddPicture);
            show(btnAddPictureText);
            show(iText);
            show(btnCheckMyAnswer);
            show(showAnswerBtn);
            show(newProblemBtn);
            hide(surpriseMeBtn);
            hide(resetBtn);
            show(problemPanel);
            show(howToPlayModal);
            show(btnGotIt);
            show(btnGotItText);

            hide(feedbackCorrect);
            hide(feedbackIncorrect);
            hide(answerModal);

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
    }

    // ─── PLAYGROUND ACTIONS ───────────────────────────────────────────────────
    function addGroup() {
        if (state.groups < 10) {
            state.groups++;
            refreshAll();
        }
    }

    function addItem() {
        if (state.items < 10) {
            state.items++;
            refreshAll();
        }
    }

    function removeItem() {
        if (state.items > 0) {
            state.items--;
            refreshAll();
        }
    }

    function doCheckAnswer() {
        state.answered = true;
        const correct = (state.groups === state.targetGroups && state.items === state.targetItems);
        if (correct) {
            show(feedbackCorrect);
            hide(feedbackIncorrect);
        } else {
            hide(feedbackCorrect);
            show(feedbackIncorrect);
        }
        updateAnswerModal();
    }

    function doShowAnswer() {
        updateAnswerModal();
        show(answerModal);
        hide(feedbackIncorrect);
    }

    function doNewProblem() {
        hide(answerModal);
        hide(feedbackCorrect);
        hide(feedbackIncorrect);
        state.answered = false;
        generateNewProblem();
    }

    function generateNewProblem() {
        state.targetGroups = randomInt(2, 10);
        state.targetItems = randomInt(2, 10);
        state.groups = 0;
        state.items = state.targetItems;
        refreshAll();
    }

    function updateAnswerModal() {
        const g = state.targetGroups;
        const i = state.targetItems;
        const p = g * i;
        const ansText = answerModal ? answerModal.querySelector('#show-answer-tos') : null;
        if (ansText) {
            const spans = ansText.querySelectorAll('tspan');
            if (spans[0]) spans[0].textContent = `${g} × ${i} = ${p}`;
            if (spans[1]) spans[1].textContent = `${i} × ${g} = ${p}`;
        }
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
        plates: { group: 'Plates', item: 'Cookies', addGroup: 'Add Plates', addItem: 'Add Cookies' },
        vas: { group: 'Vases', item: 'Flowers', addGroup: 'Add Vases', addItem: 'Add Flowers' },
        palette: { group: 'Palettes', item: 'Drops', addGroup: 'Add Palettes', addItem: 'Add Drops' }
    };

    // Maps theme key → SVG template element ID in the DOM
    const THEME_SVG_MAP = {
        plates: 'svg-image-plate-cookie',
        vas: 'svg-image-flower-vase',
        palette: 'svg-image-paint-color'
    };

    function doSwitchTheme() {
        const keys = Object.keys(THEMES);
        const idx = keys.indexOf(state.theme);
        state.theme = keys[(idx + 1) % keys.length];
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
        if (h1) h1.textContent = `Number of ${t.group}`;
        if (h2) h2.textContent = `Number of ${t.item}`;
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
