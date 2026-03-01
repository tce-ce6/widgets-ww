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

    static TUBE_COLORS = ['#FF6B35', '#9C4DCC', '#E91E63', '#4CAF50', '#FF9800'];

    static BP_TO_Y = {
        100: 908, 200: 843, 300: 804, 400: 776, 500: 755,
        600: 737, 700: 722, 800: 709, 900: 698, 1000: 688,
        1100: 679, 1200: 671, 1300: 664, 1400: 657, 1500: 651,
        1600: 646, 1700: 641, 1800: 636, 1900: 631, 2000: 627, 2100: 623
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

        // Find existing instruction text (fallback query)
        const texts = Array.from(document.querySelectorAll('text'));
        this.dom.instruction = texts.find(t => t.textContent.includes('Tap the Eppendorf'));

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

        // 4. Input Area (foreignObject)
        const fo = document.createElementNS(ns, "foreignObject");
        fo.setAttribute('x', 1300);
        fo.setAttribute('y', 920);
        fo.setAttribute('width', 450);
        fo.setAttribute('height', 80);
        fo.setAttribute('display', 'none');
        this.dom.inputArea = fo;

        const foDiv = document.createElement('div');
        foDiv.style.display = 'flex';
        foDiv.style.gap = '20px';
        foDiv.style.fontFamily = 'Roboto, sans-serif';
        foDiv.style.justifyContent = 'space-between';

        this.dom.inputs = [];
        this.dom.feedbacks = [];
        for (let i = 0; i < 4; i++) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'center';

            const inp = document.createElement('input');
            inp.type = 'number';
            inp.style.width = '80px';
            inp.style.height = '35px';
            inp.style.fontSize = '18px';
            inp.style.textAlign = 'center';
            inp.style.border = '2px solid #ccc';
            inp.style.borderRadius = '4px';
            inp.style.outline = 'none';

            const fb = document.createElement('span');
            fb.style.fontSize = '12px';
            fb.style.fontWeight = 'bold';
            fb.style.marginTop = '4px';
            fb.style.height = '15px'; // Fixed height to prevent layout shift
            fb.textContent = '';

            wrapper.appendChild(inp);
            wrapper.appendChild(fb);
            foDiv.appendChild(wrapper);

            this.dom.inputs.push(inp);
            this.dom.feedbacks.push(fb);
        }
        fo.appendChild(foDiv);
        this.dynamicGroup.appendChild(fo);

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

        switch (this.state) {
            case S.IDLE:
                if (this.dom.instruction) this.dom.instruction.textContent = 'Tap the Eppendorf tubes (in any order) to load DNA samples.';
                this._setOpacity(this.dom.btnStart, '0.5');
                if (this.dom.btnStart) this.dom.btnStart.style.pointerEvents = 'none';
                this._setOpacity(this.dom.btnReset, '0.5');
                this._hideEl(this.dom.inputArea);
                this._hideEl(this.dom.btnSubmitGroup);
                this._hideEl(this.dom.successBanner);
                this._hideEl(this.dom.readingsNumbers);
                this.dom.sampleBands.forEach(el => this._hideEl(el));
                break;

            case S.ALL_LOADED:
                this._setOpacity(this.dom.btnStart, '1');
                if (this.dom.btnStart) this.dom.btnStart.style.pointerEvents = 'auto';
                this._setOpacity(this.dom.btnReset, '1');
                if (this.dom.instruction) this.dom.instruction.textContent = 'All samples loaded! Press Start to run electrophoresis.';
                break;

            case S.RUNNING:
                this._setOpacity(this.dom.btnStart, '0.5');
                if (this.dom.btnStart) this.dom.btnStart.style.pointerEvents = 'none';
                if (this.dom.instruction) this.dom.instruction.textContent = 'Running electrophoresis… please wait.';
                break;

            case S.INPUT:
                this._hideEl(this.dom.electroOverlay);
                this._showEl(this.dom.inputArea);
                this._showEl(this.dom.btnSubmitGroup);
                this._setOpacity(this.dom.btnReset, '1');
                if (this.dom.instruction) this.dom.instruction.textContent = 'Compare band positions and enter fragment sizes (bps).';
                break;

            case S.COMPLETE:
                this._hideEl(this.dom.btnSubmitGroup);
                // Keep input areas visible to show answers
                this._showEl(this.dom.successBanner);
                this._setOpacity(this.dom.btnReset, '1');
                if (this.dom.instruction) this.dom.instruction.textContent = '🎉 All correct! Press Reset (New Set) to try a new sample set.';
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
            if (this.dom[`bg_${i}`]) this.dom[`bg_${i}`].setAttribute('fill', '#b1ffae'); // Default hilight BG color from SVG
            if (this.dom[`liquid_${i}`]) this.dom[`liquid_${i}`].setAttribute('fill', '#006C99'); // Default liquid color
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

        this.updateUI();
    }

    // ─── PRIVATE HELPERS ──────────────────────────────────────────────────────

    _pickNewSet() {
        if (this.usedSetIndices.length >= Wg97.SAMPLE_SETS.length) {
            this.usedSetIndices = [];
        }
        let available = Array.from({ length: Wg97.SAMPLE_SETS.length }, (_, i) => i)
            .filter(i => !this.usedSetIndices.includes(i));
        const pick = available[Math.floor(Math.random() * available.length)];
        this.usedSetIndices.push(pick);
        this.currentSet = [...Wg97.SAMPLE_SETS[pick]];
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

        if (this.dom[`bg_${slotIndex}`]) this.dom[`bg_${slotIndex}`].setAttribute('fill', '#D0F8FF');

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
            if (this.dom[`bg_${slotIndex}`]) this.dom[`bg_${slotIndex}`].setAttribute('fill', color);
            if (this.dom[`slot_${slotIndex}`]) this.dom[`slot_${slotIndex}`].style.cursor = 'default';

            // Show lane label (Samples only)
            if (laneIndex >= 1) {
                const label = this.dom.laneLabels[laneIndex - 1];
                if (label) {
                    label.textContent = `Sample ${slotIndex}`;
                    this._showEl(label);
                }
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

    _onShowAnswerClick() {
        if (this.state === Wg97.STATE.IDLE || this.state === Wg97.STATE.LOADING || this.state === Wg97.STATE.ALL_LOADED) return;

        // Fill inputs with correct values
        const correctValues = this.currentSet;
        this.dom.inputs.forEach((inp, idx) => {
            inp.value = correctValues[idx];
        });

        // Trigger submit
        this._onSubmitClick();

        // Disable Show Answer once used (optional per prompt, but "once Start clicked it should always be active" implies keep active, so we leave it active but it will just run this block safely again)
    }

    _onSubmitClick() {
        if (this.state !== Wg97.STATE.INPUT) return;

        const nonLadderOrder = this.loadQueue.filter(s => s !== 0);
        // Correct values line up with the 4 sample lanes
        const correctValues = this.currentSet;

        let allCorrect = true;

        this.dom.inputs.forEach((inp, idx) => {
            const fb = this.dom.feedbacks[idx];
            const userVal = parseInt(inp.value, 10);
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
                inp.style.borderColor = '#4CAF50';
                inp.style.backgroundColor = '#E8F5E9';
                fb.textContent = '✓ Correct';
                fb.style.color = '#2E7D32';
                inp.disabled = true;
                this.correct[idx] = true;
            } else {
                inp.style.borderColor = '#F44336';
                inp.style.backgroundColor = '#FFEBEE';
                fb.textContent = '✗ Try again';
                fb.style.color = '#C62828';
                allCorrect = false;
                this.correct[idx] = false;
            }
        });

        if (allCorrect || this.validateStep()) {
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
        const dyLanePlunge = -80; // Down into gel well

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

        // Compute Y positions
        this.dom.sampleBands.forEach((band, idx) => {
            const bps = this.currentSet[idx];
            let yPos = Wg97.BP_TO_Y[bps];
            if (yPos === undefined) {
                const Y_BOT = 908;
                const Y_TOP = 623;
                yPos = Math.round(Y_BOT - (Math.log(bps) - Math.log(100)) / (Math.log(2100) - Math.log(100)) * (Y_BOT - Y_TOP));
            }
            band.setAttribute('y', yPos);
            band.setAttribute('fill', Wg97.TUBE_COLORS[this.loadQueue[idx + 1]]); // Color maps to the tube that went into this lane
        });

        const totalDuration = 2000;
        const stagger = 300;

        setTimeout(() => {
            this._showEl(this.dom.readingsNumbers);
            this._showEl(this.dom.markings);
        }, 400);

        this.dom.sampleBands.forEach((band, idx) => {
            setTimeout(() => {
                this._showEl(band);
            }, 700 + (stagger * idx));
        });

        setTimeout(() => {
            this._hideEl(this.dom.electroOverlay);
            callback();
        }, totalDuration);
    }
}

// ─── BOOT ──────────────────────────────────────────────────────────────────
const WG97_WIDGET = new Wg97();
document.addEventListener('DOMContentLoaded', () => WG97_WIDGET.init());
