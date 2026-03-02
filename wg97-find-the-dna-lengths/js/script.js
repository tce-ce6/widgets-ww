/**
 * WG97 – Find The DNA Lengths
 *
 * Widget for Grade 12 Biology – Agarose Gel Electrophoresis
 * Pure JavaScript implementation dynamically mapping back to the pristine SVG.
 */

class Wg97 {
    // ─── STATIC DATA ──────────────────────────────────────────────────────────
    static SAMPLE_SETS = [
        [500, 1000, 1400, 1700],
        [300, 700, 1200, 2000],
        [600, 800, 1900, 2100],
        [100, 900, 1300, 1800],
        [200, 600, 1100, 1500]
    ];

    static TUBE_COLORS = ['#0a719b', '#0a719b', '#0a719b', '#0a719b', '#0a719b'];

    static BP_TO_Y = {
        100: 873, 200: 849, 300: 826, 400: 802, 500: 778,
        600: 755, 700: 731, 800: 707, 900: 683, 1000: 660,
        1100: 636, 1200: 612, 1300: 589, 1400: 565, 1500: 541,
        1600: 518, 1700: 494, 1800: 470, 1900: 446, 2000: 423, 2100: 376
    };

    static TOLERANCE = 50;

    // Based on the centers of Vector_8, Vector_4, Vector_5, Vector_6, Vector_7
    static TUBE_CENTRES_X = [160, 340, 520, 700, 880];

    // Based on Rectangle 219 through 219_5
    static LANE_CENTRES_X = [1250, 1360, 1470, 1580, 1690];

    // Y position of the tube tops and gel wells
    static PIPETTE_REST_Y = 200; // Hover height
    static TUBE_PLUNGE_Y = 380;
    static WELL_PLUNGE_Y = 300;

    static STATE = {
        IDLE: 'IDLE',
        LOADING: 'LOADING',
        ALL_LOADED: 'ALL_LOADED',
        RUNNING: 'RUNNING',
        INPUT: 'INPUT',
        COMPLETE: 'COMPLETE'
    };

    // ─── ORIGINAL DOM MAPPINGS ────────────────────────────────────────────────
    static DOM_MAP = {
        slots: ['Rectangle_440', 'Rectangle_459', 'Rectangle_460', 'Rectangle_461', 'Rectangle_462'],
        bgRects: ['Rectangle_440', 'Rectangle_459', 'Rectangle_460', 'Rectangle_461', 'Rectangle_462'],
        liquids: ['Path_870-5', 'Path_870', 'Path_870-2', 'Path_870-3', 'Path_870-4'],
        tubes: ['tube-5', 'tube', 'tube-2', 'tube-3', 'tube-4'], // For opacity fading
        wells: ['Rectangle_219', 'Rectangle_219-2', 'Rectangle_219-3', 'Rectangle_219-4', 'Rectangle_219-5'],
        loadedWells: ['Rectangle_219-6', 'Rectangle_449', 'Rectangle_450', 'Rectangle_451', 'Rectangle_452'],
        laneLabels: ['For_DNA_loder', 'sample-1', 'sample-2', 'sample-3', 'sample-4'],
        btnStart: 'Group_1110',
        btnReset: 'Group_2',
        btnInsights: 'Button_Insite_',
        btnShowAnswer: 'Button_Insite_2'
    };

    constructor() {
        this.state = Wg97.STATE.IDLE;
        this.usedSetIndices = [];
        this.currentSet = null;
        this.loadQueue = [];
        this.animating = false;
        this.dom = {};
        this.correct = [false, false, false, false];
        this.showingAnswer = false;
        this.savedStateInfo = null;
    }

    init() {
        this.cacheDOM();
        this._injectDynamicElements(); // CRITICAL: Inject all missing SVG UI
        this._pickNewSet();
        this.resetWidget();
        this.bindEvents();
    }

    cacheDOM() {
        // Cache original elements
        Wg97.DOM_MAP.slots.forEach((id, i) => this.dom[`slot_${i}`] = document.getElementById(id));
        Wg97.DOM_MAP.bgRects.forEach((id, i) => this.dom[`bg_${i}`] = document.getElementById(id));
        Wg97.DOM_MAP.liquids.forEach((id, i) => this.dom[`liquid_${i}`] = document.getElementById(id));
        Wg97.DOM_MAP.tubes.forEach((id, i) => this.dom[`tube_${i}`] = document.getElementById(id));
        Wg97.DOM_MAP.wells.forEach((id, i) => this.dom[`well_${i}`] = document.getElementById(id));

        this.dom.loadedWells = Wg97.DOM_MAP.loadedWells.map(id => document.getElementById(id));
        this.dom.laneLabels = Wg97.DOM_MAP.laneLabels.map(id => document.getElementById(id));

        this.dom.btnStart = document.getElementById(Wg97.DOM_MAP.btnStart);
        this.dom.btnReset = document.getElementById(Wg97.DOM_MAP.btnReset);
        this.dom.btnInsights = document.getElementById(Wg97.DOM_MAP.btnInsights);
        this.dom.btnShowAnswer = document.getElementById(Wg97.DOM_MAP.btnShowAnswer);

        this.dom.readingsNumbers = document.getElementById('readings_numbers');
        this.dom.pipette = document.getElementById('picker');
        this.dom.pipetteLiquid = document.getElementById('filler');
        this.dom.modal = document.getElementById('popup');
        this.dom.closeModal = document.getElementById('Group_1331');

        this.dom.itext2 = document.getElementById('itext2');
        this.dom.itext3 = document.getElementById('itext3');
        this.dom.inputTextGroup = document.getElementById('input_text');
        this.dom.feedback2 = document.getElementById('feedback2');
        this.dom.markings = document.getElementById('markings');
        this.dom.btnSubmitGroup = document.getElementById('Group_1587');
        this.dom.staticSampleBands = [
            document.getElementById('Rectangle_454'),
            document.getElementById('Rectangle_455'),
            document.getElementById('Rectangle_456'),
            document.getElementById('Rectangle_457')
        ];
        this.dom.finalFeedback = document.getElementById('final_feedback');

        const elementsToHide = [
            this.dom.itext2, this.dom.itext3, this.dom.inputTextGroup,
            this.dom.feedback2, this.dom.markings, this.dom.finalFeedback, this.dom.readingsNumbers,
            this.dom.btnSubmitGroup,
            ...this.dom.staticSampleBands
        ];
        elementsToHide.forEach(el => { if (el) el.setAttribute('display', 'none'); });

        this.dom.itext1 = document.getElementById('itext1');
        this.dom.texts = [this.dom.itext1, this.dom.itext2, this.dom.itext3];

        const testTubeBase = document.getElementById('test_tube_base');
        if (testTubeBase) testTubeBase.style.pointerEvents = 'none';
        Wg97.DOM_MAP.tubes.forEach(id => {
            const tube = document.getElementById(id);
            if (tube) tube.style.pointerEvents = 'none';
        });

        this.svgEl = document.querySelector('svg');
    }

    _injectDynamicElements() {
        const svg = this.svgEl;
        const ns = "http://www.w3.org/2000/svg";

        // Create a root group for dynamic elements to keep things tidy
        this.dynamicGroup = document.createElementNS(ns, "g");
        this.dynamicGroup.setAttribute('id', 'dynamic_layer');
        svg.appendChild(this.dynamicGroup);

        // 2. DNA Bands Container
        this.bandsGroup = document.createElementNS(ns, "g");
        this.bandsGroup.setAttribute('id', 'bands_group');
        this.dynamicGroup.appendChild(this.bandsGroup);

        // Sample Bands (Lanes 2-5)
        this.dom.sampleBands = [];
        for (let i = 0; i < 4; i++) {
            const band = document.createElementNS(ns, "rect");
            band.setAttribute('x', Wg97.LANE_CENTRES_X[i + 1] - 37);
            band.setAttribute('y', 0); // Set dynamically
            band.setAttribute('width', 74);
            band.setAttribute('height', 4);
            band.setAttribute('display', 'none');
            this.bandsGroup.appendChild(band);
            this.dom.sampleBands.push(band);
        }

        // 3. Electrophoresis overlay
        this.dom.electroOverlay = document.createElementNS(ns, "rect");
        this.dom.electroOverlay.setAttribute('x', 1188);
        this.dom.electroOverlay.setAttribute('y', 337);
        this.dom.electroOverlay.setAttribute('width', 569);
        this.dom.electroOverlay.setAttribute('height', 600); // Overlay the gel
        this.dom.electroOverlay.setAttribute('fill', 'rgba(0,180,255,0.2)');
        this.dom.electroOverlay.setAttribute('display', 'none');
        this.dynamicGroup.appendChild(this.dom.electroOverlay);

        // 4. Input Area (Group containing foreignObjects)
        this.dom.inputArea = document.createElementNS(ns, "g");
        this.dom.inputArea.setAttribute('id', 'input_area');
        this.dom.inputArea.setAttribute('display', 'none');

        this.dom.inputs = [];
        this.dom.feedbacks = [];
        const Xs = [277.06, 457.06, 636.06, 817.06];

        for (let i = 0; i < 4; i++) {
            const fo = document.createElementNS(ns, "foreignObject");
            fo.setAttribute('x', Xs[i] - 17); // shift left slightly to center with the wider width
            fo.setAttribute('y', 690);
            fo.setAttribute('width', 160);
            fo.setAttribute('height', 150);

            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'center';
            wrapper.style.fontFamily = 'Roboto, sans-serif';

            const inp = document.createElement('input');
            inp.type = 'text'; // handle 'bps' suffix
            inp.style.width = '126px';
            inp.style.height = '43px';
            inp.style.fontSize = '22px';
            inp.style.textAlign = 'center';
            inp.style.border = '2px solid #77c974';
            inp.style.borderRadius = '9px';
            inp.style.color = '#333';
            inp.style.fontWeight = 'bold';
            inp.style.outline = 'none';
            inp.style.boxSizing = 'border-box';
            inp.style.padding = '0';

            const fb = document.createElement('span');
            fb.style.fontSize = '20px';
            fb.style.fontWeight = '700';
            fb.style.marginTop = '15px';
            fb.style.textAlign = 'center';
            fb.style.lineHeight = '1.2';
            fb.style.whiteSpace = 'pre-wrap';
            fb.style.fontFamily = 'Roboto, sans-serif';
            fb.textContent = '';

            wrapper.appendChild(inp);
            wrapper.appendChild(fb);
            fo.appendChild(wrapper);
            this.dom.inputArea.appendChild(fo);

            this.dom.inputs.push(inp);
            this.dom.feedbacks.push(fb);
        }
        this.dynamicGroup.appendChild(this.dom.inputArea);

        // 5. Submit Button (injected visually below inputs)
        // Native submit button mapped in cacheDOM

        // 7. Success Banner (Native)
        this.dom.successBanner = this.dom.finalFeedback;

        // Fix cursor for original buttons
        if (this.dom.btnStart) this.dom.btnStart.style.cursor = 'pointer';
        if (this.dom.btnReset) this.dom.btnReset.style.cursor = 'pointer';
        if (this.dom.btnInsights) this.dom.btnInsights.style.cursor = 'pointer';
        if (this.dom.btnSubmitGroup) this.dom.btnSubmitGroup.style.cursor = 'pointer';
        if (this.dom.btnShowAnswer) this.dom.btnShowAnswer.style.cursor = 'pointer';
        for (let i = 0; i < 5; i++) {
            if (this.dom[`slot_${i}`]) this.dom[`slot_${i}`].style.cursor = 'pointer';
        }

        // Move popup to the end of SVG to ensure it renders on top of dynamic layers
        if (this.dom.modal && this.svgEl) {
            this.svgEl.appendChild(this.dom.modal);
        }
    }

    bindEvents() {
        // Tube clicks
        for (let i = 0; i < 5; i++) {
            if (this.dom[`slot_${i}`]) {
                this.dom[`slot_${i}`].addEventListener('click', () => this._onTubeClick(i));
            }
        }

        // Action buttons
        if (this.dom.btnStart) this.dom.btnStart.addEventListener('click', () => this._onStartClick());
        if (this.dom.btnReset) this.dom.btnReset.addEventListener('click', () => this._onResetClick());
        if (this.dom.btnSubmitGroup) this.dom.btnSubmitGroup.addEventListener('click', () => this._onSubmitClick());
        if (this.dom.btnShowAnswer) this.dom.btnShowAnswer.addEventListener('click', () => this._onShowAnswerClick());

        if (this.dom.btnInsights) this.dom.btnInsights.addEventListener('click', () => this._showEl(this.dom.modal));
        if (this.dom.closeModal) this.dom.closeModal.addEventListener('click', () => this._hideEl(this.dom.modal));

        // Submit on Enter key
        this.dom.inputs.forEach(inp => {
            inp.addEventListener('keydown', e => {
                if (e.key === 'Enter') this._onSubmitClick();
            });
        });
    }

    // ─── STATE MACHINE ────────────────────────────────────────────────────────

    updateUI() {
        const S = Wg97.STATE;

        // Show Answer logic
        if (this.state === S.IDLE || this.state === S.LOADING || this.state === S.ALL_LOADED) {
            this._setOpacity(this.dom.btnShowAnswer, '0.5');
            if (this.dom.btnShowAnswer) this.dom.btnShowAnswer.style.pointerEvents = 'none';
        } else {
            this._setOpacity(this.dom.btnShowAnswer, '1');
            if (this.dom.btnShowAnswer) this.dom.btnShowAnswer.style.pointerEvents = 'auto';
        }

        // Hide all instructions first
        this.dom.texts.forEach(el => this._hideEl(el));

        switch (this.state) {
            case S.IDLE:
                this._showEl(this.dom.itext1);
                this._setOpacity(this.dom.btnStart, '0.5');
                if (this.dom.btnStart) this.dom.btnStart.style.pointerEvents = 'none';
                this._setOpacity(this.dom.btnReset, '0.5');
                this._hideEl(this.dom.inputArea);
                this._hideEl(this.dom.btnSubmitGroup);
                this._hideEl(this.dom.successBanner);
                this._hideEl(this.dom.readingsNumbers);
                this.dom.sampleBands.forEach(el => this._hideEl(el));
                break;

            case S.LOADING:
                this._showEl(this.dom.itext1);
                break;

            case S.ALL_LOADED:
                this._setOpacity(this.dom.btnStart, '1');
                if (this.dom.btnStart) this.dom.btnStart.style.pointerEvents = 'auto';
                this._setOpacity(this.dom.btnReset, '1');
                this._showEl(this.dom.itext2);
                break;

            case S.RUNNING:
                this._setOpacity(this.dom.btnStart, '0.5');
                if (this.dom.btnStart) this.dom.btnStart.style.pointerEvents = 'none';
                this._showEl(this.dom.itext2);
                break;

            case S.INPUT:
                this._hideEl(this.dom.electroOverlay);
                this._showEl(this.dom.inputArea);
                this._showEl(this.dom.btnSubmitGroup);
                this._setOpacity(this.dom.btnReset, '1');
                this._showEl(this.dom.itext3);
                break;

            case S.COMPLETE:
                this._hideEl(this.dom.btnSubmitGroup);
                // Keep input areas visible to show answers
                this._showEl(this.dom.successBanner);
                this._setOpacity(this.dom.btnReset, '1');
                break;
        }
    }

    validateStep() {
        return this.correct.every(Boolean);
    }

    resetWidget() {
        this.state = Wg97.STATE.IDLE;
        this.loadQueue = [];
        this.animating = false;
        this.correct = [false, false, false, false];

        this._pickNewSet();

        // Hide pipette
        this._hideEl(this.dom.pipette);
        this.dom.pipette.style.transition = 'none';
        this.dom.pipette.setAttribute('transform', 'translate(0,0)');
        if (this.dom.pipetteLiquid) this.dom.pipetteLiquid.setAttribute('fill', 'transparent');

        // Reset tubes
        for (let i = 0; i < 5; i++) {
            if (this.dom[`tube_${i}`]) this.dom[`tube_${i}`].style.opacity = '1';
            if (this.dom[`bg_${i}`]) this.dom[`bg_${i}`].setAttribute('fill', 'rgba(177, 255, 174, 0.6)'); // Default hilight BG color from SVG
            if (this.dom[`liquid_${i}`]) this.dom[`liquid_${i}`].setAttribute('fill', '#0a719b'); // Monochromatic blue
            if (this.dom[`slot_${i}`]) this.dom[`slot_${i}`].style.cursor = 'pointer';
        }

        // Reset wells
        this.dom.loadedWells.forEach(w => { if (w) this._hideEl(w); });

        // Reset lane labels
        this.dom.laneLabels.forEach(lbl => { if (lbl) this._hideEl(lbl); });

        // Reset bands
        this._hideEl(this.dom.readingsNumbers);
        this._hideEl(this.dom.markings);
        this.dom.sampleBands.forEach(b => this._hideEl(b));

        // Reset inputs
        this.dom.inputs.forEach(inp => {
            inp.value = '';
            inp.style.borderColor = '#ccc';
            inp.style.backgroundColor = '#fff';
            inp.disabled = false;
        });
        this.dom.feedbacks.forEach(fb => {
            fb.textContent = '';
            fb.style.color = '';
        });

        // Hide overlays
        this._hideEl(this.dom.electroOverlay);
        this._hideEl(this.dom.modal);

        this.showingAnswer = false;
        this._updateShowAnswerBtnText("Show Answer");

        this.updateUI();
    }

    // ─── PRIVATE HELPERS ──────────────────────────────────────────────────────

    _pickNewSet() {
        const bpsOptions = Object.keys(Wg97.BP_TO_Y).map(Number);
        this.currentSet = [];
        for (let i = 0; i < 4; i++) {
            this.currentSet.push(bpsOptions[Math.floor(Math.random() * bpsOptions.length)]);
        }
    }

    _showEl(el) { if (el) el.setAttribute('display', ''); }
    _hideEl(el) { if (el) el.setAttribute('display', 'none'); }
    _setOpacity(el, val) { if (el) el.setAttribute('opacity', val); }

    // ─── CLICK HANDLERS ───────────────────────────────────────────────────────

    _onTubeClick(slotIndex) {
        if (this.state !== Wg97.STATE.IDLE && this.state !== Wg97.STATE.LOADING) return;
        if (this.animating) return;
        if (this.loadQueue.includes(slotIndex)) return;

        this.state = Wg97.STATE.LOADING;
        this.animating = true;

        if (this.dom[`bg_${slotIndex}`]) this.dom[`bg_${slotIndex}`].setAttribute('fill', 'rgba(177, 255, 174, 0.6)');

        let laneIndex;
        if (slotIndex === 0) {
            laneIndex = 0; // Ladder always to Lane 1
        } else {
            const nonLadderCount = this.loadQueue.filter(s => s !== 0).length;
            laneIndex = nonLadderCount + 1; // Lanes 2-5
        }

        this._animatePipetteSequence(slotIndex, laneIndex, () => {
            this.loadQueue.push(slotIndex);

            const color = Wg97.TUBE_COLORS[slotIndex];
            /** bg color change as per design */
            if (this.dom[`bg_${slotIndex}`]) this.dom[`bg_${slotIndex}`].setAttribute('fill', 'rgba(177, 255, 174, 0.6)');
            if (this.dom[`slot_${slotIndex}`]) this.dom[`slot_${slotIndex}`].style.cursor = 'default';

            // Show lane label (Samples only)
            const label = this.dom.laneLabels[laneIndex];
            if (label) {
                if (laneIndex >= 1) {
                    const tspan = label.querySelector('tspan');
                    if (tspan) {
                        tspan.textContent = `sample-${slotIndex}`;
                    } else {
                        label.textContent = `sample-${slotIndex}`;
                    }
                }
                this._showEl(label);
            }

            // Fill well
            const loadedV = this.dom.loadedWells[laneIndex];
            if (loadedV) {
                loadedV.setAttribute('fill', color);
                this._showEl(loadedV);
            }

            this.animating = false;

            if (this.loadQueue.length === 5) {
                this.state = Wg97.STATE.ALL_LOADED;
                this.updateUI();
            }
        });
    }

    _onStartClick() {
        if (this.state !== Wg97.STATE.ALL_LOADED) return;
        if (this.animating) return;

        this.state = Wg97.STATE.RUNNING;
        this.animating = true;
        this.updateUI();

        this._animateElectrophoresis(() => {
            this.animating = false;
            this.state = Wg97.STATE.INPUT;
            this.updateUI();
        });
    }

    _onResetClick() {
        if (this.animating && this.state !== Wg97.STATE.COMPLETE && this.state !== Wg97.STATE.ALL_LOADED && this.state !== Wg97.STATE.INPUT) return;
        // Only allow reset if not actively animating between critical segments or allow anytime.
        this.resetWidget();
    }

    _updateShowAnswerBtnText(newText) {
        const g = document.getElementById('Show_Answer');
        if (g) {
            const txt = g.querySelector('text');
            if (txt) {
                txt.innerHTML = `<tspan x="0" y="0">${newText}</tspan>`;
                if (newText === "Back") {
                    txt.setAttribute('transform', 'translate(425 1004.3)');
                } else {
                    txt.setAttribute('transform', 'translate(351.91 1004.3)');
                }
            }
        }
    }

    _onShowAnswerClick() {
        if (this.state === Wg97.STATE.IDLE || this.state === Wg97.STATE.LOADING || this.state === Wg97.STATE.ALL_LOADED) return;

        if (this.showingAnswer) {
            if (this.savedStateInfo) {
                this.dom.inputs.forEach((inp, idx) => {
                    inp.value = this.savedStateInfo.inputs[idx];
                    inp.style.borderColor = this.savedStateInfo.borderColors[idx];
                    inp.style.backgroundColor = this.savedStateInfo.bgColors[idx];
                    this.dom.feedbacks[idx].textContent = this.savedStateInfo.fbText[idx];
                    this.dom.feedbacks[idx].style.color = this.savedStateInfo.fbColor[idx];
                    inp.disabled = this.savedStateInfo.disabled[idx];
                });
                this.state = this.savedStateInfo.state;
                if (this.state !== Wg97.STATE.COMPLETE) {
                    this._hideEl(this.dom.successBanner);
                }
            }
            this.showingAnswer = false;
            this._updateShowAnswerBtnText("Show Answer");
        } else {
            this.savedStateInfo = {
                inputs: this.dom.inputs.map(inp => inp.value),
                borderColors: this.dom.inputs.map(inp => inp.style.borderColor),
                bgColors: this.dom.inputs.map(inp => inp.style.backgroundColor),
                fbText: this.dom.feedbacks.map(fb => fb.textContent),
                fbColor: this.dom.feedbacks.map(fb => fb.style.color),
                disabled: this.dom.inputs.map(inp => inp.disabled),
                state: this.state
            };
            this.showingAnswer = true;
            this._updateShowAnswerBtnText("Back");

            const correctValues = this.currentSet;
            this.dom.inputs.forEach((inp, idx) => {
                inp.value = correctValues[idx] + " bps";
                inp.style.borderColor = '#00992a';
                inp.style.backgroundColor = '#ecffeb';
                this.dom.feedbacks[idx].textContent = 'Very good!';
                this.dom.feedbacks[idx].style.color = '#00992a';
                inp.disabled = true;
            });
            this.state = Wg97.STATE.COMPLETE;
            this._showEl(this.dom.successBanner);
        }
        this.updateUI();
    }

    _onSubmitClick() {
        if (this.state !== Wg97.STATE.INPUT && this.state !== Wg97.STATE.COMPLETE) return;

        const correctValues = this.currentSet;
        let allCorrect = true;

        this.dom.inputs.forEach((inp, idx) => {
            const fb = this.dom.feedbacks[idx];
            const rawVal = inp.value;
            const numMatch = rawVal.match(/\d+/);
            const userVal = numMatch ? parseInt(numMatch[0], 10) : NaN;
            const expected = correctValues[idx];

            if (isNaN(userVal)) {
                inp.style.borderColor = '#FF9800';
                fb.textContent = 'Enter a value';
                fb.style.color = '#FF9800';
                allCorrect = false;
                this.correct[idx] = false;
                return;
            }

            if (Math.abs(userVal - expected) <= Wg97.TOLERANCE) {
                inp.value = userVal + " bps";
                inp.style.borderColor = '#00992a';
                inp.style.backgroundColor = '#ecffeb';
                fb.textContent = 'Very good!';
                fb.style.color = '#00992a';
                inp.disabled = true;
                this.correct[idx] = true;
            } else {
                inp.style.borderColor = '#f23a0a';
                inp.style.backgroundColor = '#fff';
                fb.textContent = 'Not really! Enter\nthe correct length.';
                fb.style.color = '#f23a0a';
                allCorrect = false;
                this.correct[idx] = false;
            }
        });

        if (allCorrect) {
            this.state = Wg97.STATE.COMPLETE;
            this.updateUI();
        }
    }

    // ─── ANIMATIONS ──────────────────────────────────────────────────────────

    _animatePipetteSequence(slotIndex, laneIndex, callback) {
        const pip = this.dom.pipette;
        if (!pip) { callback(); return; }

        const TUBE_ORIGIN_X = 160;
        const dxTube = Wg97.TUBE_CENTRES_X[slotIndex] - TUBE_ORIGIN_X;
        const dxLane = Wg97.LANE_CENTRES_X[laneIndex] - TUBE_ORIGIN_X;

        // Y Deltas relative to native drawn position (hovering over Tube 0)
        const dyTubeHover = -50;  // Hover cleanly above tube
        const dyTubePlunge = 100; // Drop into tube
        const dyLaneHover = -160; // Up and over to gel well
        const dyLanePlunge = -140; // Down into gel well

        // Reset position to rest hover height above clicked tube
        pip.setAttribute('transform', `translate(${dxTube}, ${dyTubeHover})`);
        pip.style.transition = 'none';
        this._showEl(pip);

        void pip.getBoundingClientRect(); // force reflow

        // Sequence Using CSS transitions

        // 1. Plunge down into tube
        pip.style.transition = 'transform 0.3s ease-in-out';
        pip.setAttribute('transform', `translate(${dxTube}, ${dyTubePlunge})`);

        setTimeout(() => {
            // 2. Suck liquid
            this.dom.pipetteLiquid.setAttribute('fill', Wg97.TUBE_COLORS[slotIndex]);
            if (this.dom[`tube_${slotIndex}`]) {
                this.dom[`tube_${slotIndex}`].style.transition = 'opacity 0.4s';
                this.dom[`tube_${slotIndex}`].style.opacity = '0.3';
            }

            setTimeout(() => {
                // 3. Lift up from tube
                pip.style.transition = 'transform 0.3s ease-in-out';
                pip.setAttribute('transform', `translate(${dxTube}, ${dyTubeHover})`);

                setTimeout(() => {
                    // 4. Move horizontally to lane
                    pip.style.transition = 'transform 0.6s ease-in-out';
                    pip.setAttribute('transform', `translate(${dxLane}, ${dyLaneHover})`);

                    setTimeout(() => {
                        // 5. Plunge into well
                        pip.style.transition = 'transform 0.3s ease-in-out';
                        pip.setAttribute('transform', `translate(${dxLane}, ${dyLanePlunge})`);

                        setTimeout(() => {
                            // 6. Dispense
                            this.dom.pipetteLiquid.setAttribute('fill', 'transparent');

                            setTimeout(() => {
                                // 7. Retract and hide
                                pip.style.transition = 'transform 0.3s ease-in-out';
                                pip.setAttribute('transform', `translate(${dxLane}, ${dyLaneHover})`);

                                setTimeout(() => {
                                    this._hideEl(pip);
                                    pip.style.transition = 'none';
                                    callback();
                                }, 300);
                            }, 200);
                        }, 300);
                    }, 650);
                }, 350);
            }, 400);
        }, 350);
    }

    _animateElectrophoresis(callback) {
        this._showEl(this.dom.electroOverlay);

        const nonLadderTubes = this.loadQueue.filter(s => s !== 0);

        // Setup sample bands
        this.dom.sampleBands.forEach((band, idx) => {
            const slotIndex = nonLadderTubes[idx];
            const bps = this.currentSet[slotIndex - 1];
            let yPos = Wg97.BP_TO_Y[bps];
            if (yPos === undefined) {
                const Y_BOT = 873;
                const Y_TOP = 376;
                yPos = Math.round(Y_BOT - (Math.log(bps) - Math.log(100)) / (Math.log(2100) - Math.log(100)) * (Y_BOT - Y_TOP));
            }
            band._targetY = yPos;
            band.setAttribute('y', 376); // start well Y position
            band.setAttribute('fill', Wg97.TUBE_COLORS[slotIndex]);
            band.style.transition = 'none';
        });

        if (!this.ladderBands) {
            this.ladderBands = Array.from(this.dom.markings.querySelectorAll('rect, path')).filter(el => {
                const id = el.getAttribute('id');
                return id && (id.startsWith('Rectangle_218') || id.startsWith('Path_872'));
            });
            this.ladderBands.forEach(b => {
                if (b.tagName === 'rect') b._origY = b.getAttribute('y');
                else b._origY = '820'; // Path_872 native layout offset
            });
        }

        // Initialize ladder bands array to well Y
        this.ladderBands.forEach(b => {
            const startDist = 376 - parseFloat(b._origY);
            b.style.transition = 'none';
            b.style.transform = `translateY(${startDist}px)`;
        });

        // Ensure static sample bands are hidden permanently
        this.dom.staticSampleBands.forEach(b => { if (b) b.style.display = 'none'; });

        const totalDuration = 2000;

        setTimeout(() => {
            this._showEl(this.dom.readingsNumbers);
            this._showEl(this.dom.markings);
            this.dom.sampleBands.forEach(b => this._showEl(b));

            // Reflow
            void this.svgEl.getBoundingClientRect();

            // Trigger animation
            this.dom.sampleBands.forEach((band) => {
                band.style.transition = 'y 1.5s ease-out';
                band.setAttribute('y', band._targetY);
            });

            this.ladderBands.forEach(b => {
                b.style.transition = 'transform 1.5s ease-out';
                b.style.transform = `translateY(0px)`;
            });
        }, 100);

        setTimeout(() => {
            this._hideEl(this.dom.electroOverlay);
            // Reset transition property
            this.dom.sampleBands.forEach((band) => band.style.transition = 'none');
            this.ladderBands.forEach(b => b.style.transition = 'none');
            callback();
        }, totalDuration);
    }
}

// ─── BOOT ──────────────────────────────────────────────────────────────────
const WG97_WIDGET = new Wg97();
document.addEventListener('DOMContentLoaded', () => WG97_WIDGET.init());
