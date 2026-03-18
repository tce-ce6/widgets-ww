/**
 * WG112 – Identify The Criminal Through DNA Fingerprinting
 *
 * Changes in this version:
 *  C1. micropipette2 is hidden by default and only shown when a tube is clicked.
 *  C2. micropipette2 stays visible at the gel lane for 1.5 s after dispensing.
 *  C3. Answer feedback appears immediately when a suspect is clicked (no Check step).
 *  C4. "Show Answer" always reveals the answer panel, then disables itself.
 *  C5. Correct / wrong border boxes animate in with a pop effect (CSS keyframes).
 *
 * Architecture: all global state in WG112App.G; all logic is function-based.
 */

var WG112App = {

    /* ─── GLOBAL STATE ─────────────────────────────────────────────────────── */
    G: {
        phase: 0,           // 0=init  1=allLoaded  2=running  3=identify  4=answered
        loadedTubes: [],    // indices 0-4 already dispensed into gel
        currentSetIdx: 0,   // currently active set in DNA_SETS
        criminal: null,        // 0-based index (will be set from sequence)
        criminalQueue: [],    // sequence to ensure all 4 appear without repeats until cycle ends
        nextSuspectLane: 1, // Lane index (1 to 4) for the next clicked suspect
        submitted: false,   // true once a suspect is clicked in Phase 3
        animating: false,   // animation guard – prevents double-clicks
        insightsOpen: false,
        showAnswerOpen: false
    },

    /* ─── STATIC CONFIG ────────────────────────────────────────────────────── */

    /**
     * TUBES: each tube's SVG element IDs.
     *  tubeId  – the liquid/tube body shown in rack
     *  baseId  – rack slot (also clickable)
     *  wellId  – dark-blue "loaded" rectangle in the gel
     *  labelId – sample name text shown in gel lane after loading
     */
    TUBES: [
        { id: 0, tubeId: 'tube',   baseId: 'Group_1356', wellId: 'Group_1605', labelId: 'Label_Lane_1', name: "Crime Scene" },
        { id: 1, tubeId: 'tube-2', baseId: 'Group_1357', wellId: 'Group_1607', labelId: 'Label_Lane_2', name: "Suspect 1" },
        { id: 2, tubeId: 'tube-3', baseId: 'Group_1358', wellId: 'Group_1608', labelId: 'Label_Lane_3', name: "Suspect 2" },
        { id: 3, tubeId: 'tube-4', baseId: 'Group_1359', wellId: 'Group_1609', labelId: 'Label_Lane_4', name: "Suspect 3" },
        { id: 4, tubeId: 'tube-5', baseId: 'Group_1360', wellId: 'Group_1610', labelId: 'Label_Lane_5', name: "Suspect 4" }
    ],

    // Lane-2 … Lane-5 sample labels (Lane-1 Crime scene label stays always on)
    SUSPECT_LANE_LABELS: [
        'Label_Lane_2',  // Lane-2
        'Label_Lane_3',  // Lane-3
        'Label_Lane_4',  // Lane-4
        'Label_Lane_5'   // Lane-5
    ],

    // DNA band groups revealed during electrophoresis (one per lane)
    BANDS: ['Group_1617', 'Group_1618', 'Group_1619', 'Group_1620', 'Group_1621'],

    // Suspect portrait groups in Layer_4 (index 0-3 = Suspect 1-4)
    SUSPECTS: [
        { groupId: 'Group_1682' },  // Suspect-1 – top-left
        { groupId: 'Group_1683' },  // Suspect-2 – top-right
        { groupId: 'Group_1685' },  // Suspect-3 – bottom-left
        { groupId: 'Group_1684' }   // Suspect-4 – bottom-right
    ],

    /**
     * 4 band-pattern sets. Each has 4 UNIQUE suspect patterns.
     * The criminal is NOT hardcoded here — it is randomised each time
     * a set is applied, giving 4 sets × 4 criminals = 16 equally-likely combos.
     */
    DNA_SETS: [
        {
            chromosomes: ["6", "13", "17"],
            suspects: [
                [{ c: 1, y: 480 }, { c: 1, y: 560 }, { c: 2, y: 600 }, { c: 1, y: 680 }, { c: 0, y: 760 }, { c: 2, y: 785 }],
                [{ c: 0, y: 440 }, { c: 1, y: 480 }, { c: 0, y: 560 }, { c: 1, y: 640 }, { c: 2, y: 720 }, { c: 2, y: 760 }],
                [{ c: 0, y: 440 }, { c: 0, y: 480 }, { c: 1, y: 520 }, { c: 0, y: 600 }, { c: 1, y: 640 }, { c: 2, y: 720 }],
                [{ c: 1, y: 400 }, { c: 0, y: 480 }, { c: 1, y: 560 }, { c: 2, y: 640 }, { c: 0, y: 720 }, { c: 2, y: 760 }]
            ]
        },
        {
            chromosomes: ["5", "12", "20"],
            suspects: [
                [{ c: 2, y: 480 }, { c: 1, y: 560 }, { c: 1, y: 640 }, { c: 0, y: 680 }, { c: 0, y: 720 }, { c: 0, y: 760 }],
                [{ c: 2, y: 440 }, { c: 2, y: 480 }, { c: 1, y: 520 }, { c: 1, y: 560 }, { c: 0, y: 680 }, { c: 0, y: 720 }],
                [{ c: 2, y: 440 }, { c: 2, y: 480 }, { c: 1, y: 560 }, { c: 1, y: 640 }, { c: 0, y: 720 }, { c: 0, y: 760 }],
                [{ c: 2, y: 440 }, { c: 2, y: 480 }, { c: 1, y: 640 }, { c: 1, y: 680 }, { c: 0, y: 720 }, { c: 0, y: 760 }]
            ]
        },
        {
            chromosomes: ["1", "9", "22"],
            suspects: [
                [{ c: 0, y: 440 }, { c: 0, y: 480 }, { c: 2, y: 520 }, { c: 1, y: 560 }, { c: 1, y: 600 }, { c: 2, y: 640 }],
                [{ c: 0, y: 440 }, { c: 0, y: 480 }, { c: 1, y: 520 }, { c: 1, y: 560 }, { c: 2, y: 600 }, { c: 2, y: 640 }],
                [{ c: 0, y: 440 }, { c: 1, y: 480 }, { c: 0, y: 520 }, { c: 1, y: 560 }, { c: 2, y: 600 }, { c: 2, y: 640 }],
                [{ c: 0, y: 400 }, { c: 0, y: 480 }, { c: 1, y: 520 }, { c: 2, y: 560 }, { c: 1, y: 600 }, { c: 2, y: 640 }]
            ]
        },
        {
            chromosomes: ["2", "7", "18"],
            suspects: [
                [{ c: 0, y: 440 }, { c: 0, y: 480 }, { c: 2, y: 560 }, { c: 2, y: 600 }, { c: 1, y: 680 }, { c: 1, y: 760 }],
                [{ c: 0, y: 440 }, { c: 0, y: 520 }, { c: 2, y: 560 }, { c: 2, y: 600 }, { c: 1, y: 680 }, { c: 1, y: 760 }],
                [{ c: 0, y: 440 }, { c: 0, y: 480 }, { c: 2, y: 600 }, { c: 2, y: 640 }, { c: 1, y: 680 }, { c: 1, y: 720 }],
                [{ c: 0, y: 400 }, { c: 0, y: 480 }, { c: 2, y: 560 }, { c: 2, y: 600 }, { c: 1, y: 640 }, { c: 1, y: 760 }]
            ]
        }
    ],

    // Green "Bravo" text – one per suspect position
    BRAVO_TEXT: [
        'Bravo_You_have_correctly_identified_the_criminal._-4',  // Suspect-1
        'Bravo_You_have_correctly_identified_the_criminal._-2',  // Suspect-2
        'Bravo_You_have_correctly_identified_the_criminal._-3',  // Suspect-3
        'Bravo_You_have_correctly_identified_the_criminal._'     // Suspect-4
    ],
    // Green border box – one per suspect position
    BRAVO_BOX: [
        'Group_1688-2-4',  // over Suspect-1
        'Group_1688-2-2',  // over Suspect-2
        'Group_1688-2-3',  // over Suspect-3
        'Group_1688-2'     // over Suspect-4
    ],

    // Red "You are wrong" text – one per suspect position
    WRONG_TEXT: [
        'You_are_wrong_Please_carefully_look_at_the_DNA_fingerprint_result_and_try_again._-2',  // S1
        'You_are_wrong_Please_carefully_look_at_the_DNA_fingerprint_result_and_try_again._-3',  // S2
        'You_are_wrong_Please_carefully_look_at_the_DNA_fingerprint_result_and_try_again._',    // S3
        'You_are_wrong_Please_carefully_look_at_the_DNA_fingerprint_result_and_try_again._-4'   // S4
    ],
    // Red border box – one per suspect position
    WRONG_BOX: [
        'Group_1678-2-2',  // over Suspect-1
        'Group_1678-2-3',  // over Suspect-2
        'Group_1678-2',    // over Suspect-3
        'Group_1678-2-4'   // over Suspect-4
    ],

    // SVG-coordinate helper values for pipette movement
    PIPETTE_DEFAULT_X: 682,
    TUBE_X: [171, 341, 511, 681, 851],
    LANE_X: [1130, 1284, 1436, 1590, 1739],
    LANE_WELLS: ['Group_1605', 'Group_1607', 'Group_1608', 'Group_1609', 'Group_1610'],
    LANE_WELL_X: [1091, 1241, 1397, 1551, 1700],

    /* ─── UTILITIES ────────────────────────────────────────────────────────── */
    el: function (id) { return document.getElementById(id); },
    show: function (id) { var e = this.el(id); if (e) e.style.display = ''; },
    hide: function (id) { var e = this.el(id); if (e) e.style.display = 'none'; },
    setCursor: function (id, v) { var e = this.el(id); if (e) e.style.cursor = v; },
    setOpacity: function (id, v) { var e = this.el(id); if (e) e.style.opacity = v; },
    setPointer: function (id, on) { var e = this.el(id); if (e) e.style.pointerEvents = on ? 'auto' : 'none'; },

    /**
     * showAnimated – make an element visible then restart a CSS animation class.
     * Forces a reflow between removing and re-adding the class so @keyframes fires.
     */
    showAnimated: function (id, cssClass) {
        var e = this.el(id);
        if (!e) { return; }
        e.style.display = '';
        e.classList.remove(cssClass);
        void e.getBoundingClientRect();   // force reflow – required to re-trigger animation
        e.classList.add(cssClass);
    },

    /* Move micropipette (filled) using SVG transform in viewBox units */
    movePipette: function (dx, dy, dur, cb) {
        var p = this.el('micropipette');
        if (!p) { if (cb) { cb(); } return; }
        p.setAttribute('transform', 'translate(' + dx + ',' + dy + ')');
        if (cb) { setTimeout(cb, dur); }
    },
    resetPipettePos: function () {
        var p = this.el('micropipette');
        if (p) { p.setAttribute('transform', 'translate(0,0)'); }
    },

    /* Position micropipette2 (empty) instantly at a viewBox location */
    placePipette2: function (dx, dy) {
        var p = this.el('micropipette2');
        if (!p) { return; }
        p.setAttribute('transform', 'translate(' + dx + ',' + dy + ')');
    },

    /* ─── BUTTON STATE HELPERS ─────────────────────────────────────────────── */
    setStartBtn: function (enabled) {
        this.setOpacity('Group_1110', enabled ? '1' : '0.42');
        this.setPointer('Group_1110', enabled);
        this.setCursor('Group_1110', enabled ? 'pointer' : 'not-allowed');
    },

    disableShowAnswerBtn: function () {
        // Change 4 – after pressing Show Answer, disable the button permanently
        this.setOpacity('Group_1691', '0.42');
        this.setPointer('Group_1691', false);
        this.setCursor('Group_1691', 'not-allowed');
    },
    enableShowAnswerBtn: function () {
        this.setOpacity('Group_1691', '1');
        this.setPointer('Group_1691', true);
        this.setCursor('Group_1691', 'pointer');
    },

    disableInsightsBtn: function () {
        this.setOpacity('Button_Insite_', '0.42');
        this.setPointer('Button_Insite_', false);
        this.setCursor('Button_Insite_', 'not-allowed');
    },
    enableInsightsBtn: function () {
        this.setOpacity('Button_Insite_', '1');
        this.setPointer('Button_Insite_', true);
        this.setCursor('Button_Insite_', 'pointer');
    },

    /* ─── INITIALISATION ───────────────────────────────────────────────────── */
    init: function () {
        // Run random set on page load
        this.G.currentSetIdx = Math.floor(Math.random() * this.DNA_SETS.length);

        // Attach CSS transition to the filled micropipette once
        var pip = this.el('micropipette');
        if (pip) { pip.style.transition = 'transform 0.55s ease-in-out'; }
        // micropipette2 uses no transition (instant positioning)
        var pip2 = this.el('micropipette2');
        if (pip2) { pip2.style.transition = 'none'; }

        this.reset();
        this.bindEvents();
    },

    /* Full reset → Phase 0 */
    reset: function () {
        var G = this.G;
        G.phase = 0;
        G.loadedTubes = [];

        // If criminal hasn't been set yet (first load), draw from non-repeating queue
        if (G.criminal === undefined || G.criminal === null) {
            G.criminal = this.getNextCriminal();
        }

        var currentSet = this.DNA_SETS[G.currentSetIdx];

        G.nextSuspectLane = 1;
        G.submitted = false;
        G.animating = false;
        G.insightsOpen = false;
        G.showAnswerOpen = false;

        var lblAns = this.el('lbl_show_answer');
        if (lblAns) { lblAns.textContent = 'Show Answer'; }

        this.applyDNASet(currentSet);

        /* ── always-visible background elements ── */
        this.show('gel_base');
        this.hide('repport_numbers');
        this.hide('index');
        this.show('base');
        this.show('tube_base');
        this.show('solution_tube');
        this.show('button');

        /* ── Lane labels: Lane-1 always on; Lanes 2-5 hidden until tube loaded ── */
        this.show('sample_in_lane');
        this.show('Crime_scene_sample_2');
        for (var l = 0; l < this.SUSPECT_LANE_LABELS.length; l++) {
            this.hide(this.SUSPECT_LANE_LABELS[l]);
        }

        /* ── Restore all five tubes ── */
        for (var i = 0; i < this.TUBES.length; i++) {
            var tube = this.TUBES[i];

            // Show tube and remove disabled class
            this.show(tube.tubeId);
            this.el(tube.tubeId).classList.remove('disabled-tube');
            this.el(tube.baseId).classList.remove('disabled-tube');

            this.setCursor(tube.tubeId, 'pointer');
            this.setCursor(tube.baseId, 'pointer');
            this.hide(this.LANE_WELLS[i]);          // empty wells on reset

            // Restore native translations
            var labelEl = this.el(tube.labelId);
            if (labelEl) { labelEl.removeAttribute('transform'); }
            var bandEl = this.el(this.BANDS[i]);
            if (bandEl) { bandEl.style.removeProperty('--band-tx'); }
        }

        /* ── Gel bands hidden until electrophoresis ── */
        for (var b = 0; b < this.BANDS.length; b++) { this.hide(this.BANDS[b]); }

        /* ── Suspect identification panel hidden ── */
        this.hide('Layer_4');
        for (var s = 0; s < this.SUSPECTS.length; s++) {
            this.setCursor(this.SUSPECTS[s].groupId, 'default');
            this.setPointer(this.SUSPECTS[s].groupId, false);
        }

        /* ── All feedback hidden & animation classes removed ── */
        this.hide('Layer_5');
        this.hide('wrong_feedback');
        for (var f = 0; f < 4; f++) {
            this.hide(this.BRAVO_TEXT[f]);
            var bBox = this.el(this.BRAVO_BOX[f]);
            if (bBox) { bBox.style.display = 'none'; bBox.classList.remove('anim-correct'); }

            this.hide(this.WRONG_TEXT[f]);
            var wBox = this.el(this.WRONG_BOX[f]);
            if (wBox) { wBox.style.display = 'none'; wBox.classList.remove('anim-wrong'); }

            // Remove text animation classes too
            var bTxt = this.el(this.BRAVO_TEXT[f]);
            if (bTxt) { bTxt.classList.remove('anim-text'); }
            var wTxt = this.el(this.WRONG_TEXT[f]);
            if (wTxt) { wTxt.classList.remove('anim-text'); }
        }

        /* ── Panels hidden ── */
        this.hide('insites');
        this.hide('show_answer');

        /* ── Instructions: only first instruction visible ── */
        this.hide('i_text');
        this.hide('i_text_2');
        this.show('i_text_3');

        /* ── Both micropipettes hidden (Change 1) ── */
        this.hide('micropipette');
        this.resetPipettePos();
        this.hide('micropipette2');   // Change 1: always hidden on reset
        this.placePipette2(0, 0);    // reset its transform too

        /* ── Button states ── */
        this.setStartBtn(false);        // disabled until all loaded
        this.enableInsightsBtn();       // Insights starts enabled
        // But keep "Show Answer" disabled at start; enable when electrophoresis is done
        this.disableShowAnswerBtn();
    },

    /* ─── EVENT BINDING ────────────────────────────────────────────────────── */
    bindEvents: function () {
        var self = this;

        /* Tubes: body + rack slot both clickable */
        for (var i = 0; i < this.TUBES.length; i++) {
            (function (idx) {
                var tEl = self.el(self.TUBES[idx].tubeId);
                var bEl = self.el(self.TUBES[idx].baseId);
                if (tEl) { tEl.addEventListener('click', function () { self.onTubeClick(idx); }); }
                if (bEl) { bEl.addEventListener('click', function () { self.onTubeClick(idx); }); }
            })(i);
        }

        /* Buttons */
        var startBtn = this.el('Group_1110');
        var resetBtn = this.el('Group_2');
        var newSetBtn = this.el('Group_1690');
        var showAnsBtn = this.el('Group_1691');
        var insBtn = this.el('Button_Insite_');
        var insCloseBtn = this.el('Group_1331');

        if (startBtn) { startBtn.addEventListener('click', function () { self.onStartClick(); }); }
        if (resetBtn) { resetBtn.addEventListener('click', function () { self.reset(); }); }
        if (newSetBtn) { newSetBtn.addEventListener('click', function () { self.onNewSetClick(); }); }
        if (showAnsBtn) { showAnsBtn.addEventListener('click', function () { self.onShowAnswerClick(); }); }
        if (insBtn) { insBtn.addEventListener('click', function () { self.onInsightsClick(); }); }
        if (insCloseBtn) { insCloseBtn.addEventListener('click', function () { self.onInsightsClose(); }); }

        /* Suspect portraits */
        for (var s = 0; s < this.SUSPECTS.length; s++) {
            (function (idx) {
                var sEl = self.el(self.SUSPECTS[idx].groupId);
                if (sEl) { sEl.addEventListener('click', function () { self.onSuspectClick(idx); }); }
            })(s);
        }
    },

    /* ─── TUBE CLICK → PIPETTE ANIMATION (Changes 1 & 2) ──────────────────── */
    onTubeClick: function (idx) {
        var G = this.G;
        if (G.phase !== 0) { return; }
        if (G.animating) { return; }
        if (G.loadedTubes.indexOf(idx) !== -1) { return; }  // already loaded

        G.animating = true;
        var self = this;
        var tube = this.TUBES[idx];

        var targetSlot;
        if (idx === 0) {
            targetSlot = 0; // Crime scene always lane 1
        } else {
            targetSlot = G.nextSuspectLane;
            G.nextSuspectLane++;
        }

        var laneDx = this.LANE_X[targetSlot] - this.PIPETTE_DEFAULT_X;
        var tubeDx = this.TUBE_X[idx] - this.PIPETTE_DEFAULT_X;

        // Calculate translation needed for bands and label
        var tx = this.LANE_WELL_X[targetSlot] - this.LANE_WELL_X[idx];

        // Move label
        var labelEl = self.el(tube.labelId);
        if (labelEl) {
            labelEl.setAttribute('transform', 'translate(' + tx + ', 0)');
        }
        // Set var for bands
        var bandEl = self.el(self.BANDS[idx]);
        if (bandEl) {
            bandEl.style.setProperty('--band-tx', tx + 'px');
        }

        /* Step 1 – show filled pipette, travel to tube */
        this.show('micropipette');
        this.movePipette(tubeDx, 0, 630, function () {

            /* Step 2 – tube becomes disabled (INSTEAD OF HIDDEN) */
            self.el(tube.tubeId).classList.add('disabled-tube');
            self.el(tube.baseId).classList.add('disabled-tube');
            self.setCursor(tube.baseId, 'default');
            self.setCursor(tube.tubeId, 'default');

            self.movePipette(laneDx, -145, 620, function () {

                /* Step 3 – target well fills + corresponding lane label appears */
                var wellId = self.LANE_WELLS[targetSlot];
                self.show(wellId);
                if (idx > 0) { self.show(tube.labelId); }

                /*
                 * Change 1 & 2:
                 *  – Swap to micropipette2 (empty pipette) at the same lane position.
                 *  – Keep micropipette2 visible for 1.5 s so user can see where it dispensed.
                 *  – Then hide it and tidy up.
                 */
                self.placePipette2(laneDx, -145);   // instant position (no travel anim)
                self.hide('micropipette');
                self.resetPipettePos();
                self.show('micropipette2');        // Change 1: appears only NOW

                setTimeout(function () {
                    self.hide('micropipette2');      // Change 2: gone after 1.5 s
                    G.loadedTubes.push(idx);
                    G.animating = false;

                    if (G.loadedTubes.length === self.TUBES.length) {
                        self.onAllTubesLoaded();
                    }
                }, 1500);                          // Change 2: 1.5-second dwell time
            });
        });
    },

    /* Called once the 5th tube has been dispensed */
    onAllTubesLoaded: function () {
        this.G.phase = 1;
        this.hide('i_text_3');
        this.show('i_text_2');
        this.setStartBtn(true);               // Change 2 from previous set – enabled now
    },

    /* ─── START BUTTON (Phase 1) ───────────────────────────────────────────── */
    onStartClick: function () {
        var G = this.G;
        if (G.phase !== 1) { return; }
        if (G.animating) { return; }

        G.phase = 2;
        G.animating = true;
        this.hide('i_text_2');
        this.setStartBtn(false);

        var self = this;
        var delay = 400;   // ms stagger between lanes

        /* Reveal gel bands staggered across all 5 lanes */
        for (var i = 0; i < this.BANDS.length; i++) {
            (function (idx, ms) {
                setTimeout(function () { self.show(self.BANDS[idx]); }, ms);
            })(i, delay * (i + 1));
        }

        /* Show legend and repeat numbers */
        this.show('repport_numbers');
        this.show('index');

        /* After electrophoresis finishes → transition to Slide 11 */
        setTimeout(function () {
            self.onShowSlide11();
        }, delay * (this.BANDS.length + 1) + 500);
    },

    /* ─── SLIDE 11 – SUSPECT IDENTIFICATION ─────────────────────────────────── */
    onShowSlide11: function () {
        var G = this.G;
        G.phase = 3;
        G.animating = false;

        /* Swap left panel: empty tube rack → suspect portraits (Slide 11) */
        this.hide('tube_base');
        this.hide('solution_tube');
        this.hide('base');
        this.show('Layer_4');

        /* Update instruction */
        this.hide('i_text_2');
        this.hide('i_text_3');
        this.show('i_text');

        /* Make suspects clickable */
        for (var s = 0; s < this.SUSPECTS.length; s++) {
            this.setCursor(this.SUSPECTS[s].groupId, 'pointer');
            this.setPointer(this.SUSPECTS[s].groupId, true);
        }

        /* Enable Show Answer button (available once bands are shown) */
        this.enableShowAnswerBtn();
    },

    /* ─── SUSPECT CLICK – IMMEDIATE FEEDBACK ──────────────────────────────── */
    onSuspectClick: function (idx) {
        var G = this.G;
        if (G.phase !== 3 && G.phase !== 4) { return; }
        if (G.submitted) { return; }  // already answered correctly

        /* Show feedback for this click */
        this.showFeedback(idx);
    },

    /* ─── FEEDBACK DISPLAY (animated) ───────────────────────────────────────── */
    showFeedback: function (idx) {
        var G = this.G;
        var self = this;

        if (idx === G.criminal) {
            /* ✅ Correct – lock everything, show green feedback */
            G.submitted = true;
            G.phase = 4;
            for (var s = 0; s < this.SUSPECTS.length; s++) {
                this.setPointer(this.SUSPECTS[s].groupId, false);
            }
            this.show('Layer_5');
            this.showAnimated(this.BRAVO_BOX[idx], 'anim-correct');
            this.showAnimated(this.BRAVO_TEXT[idx], 'anim-text');
        } else {
            /* ❌ Wrong – show red feedback briefly, then hide it and let user try again */
            // Disable clicks during wrong animation
            for (var s = 0; s < this.SUSPECTS.length; s++) {
                this.setPointer(this.SUSPECTS[s].groupId, false);
            }
            this.show('wrong_feedback');
            this.showAnimated(this.WRONG_BOX[idx], 'anim-wrong');
            this.showAnimated(this.WRONG_TEXT[idx], 'anim-text');

            // After 1.5s, hide wrong feedback and re-enable remaining suspects
            setTimeout(function () {
                self.hide('wrong_feedback');
                var wBox = self.el(self.WRONG_BOX[idx]);
                if (wBox) { wBox.style.display = 'none'; wBox.classList.remove('anim-wrong'); }
                var wTxt = self.el(self.WRONG_TEXT[idx]);
                if (wTxt) { wTxt.style.display = 'none'; wTxt.classList.remove('anim-text'); }

                // Re-enable all suspects except already-wrong ones
                for (var s = 0; s < self.SUSPECTS.length; s++) {
                    self.setPointer(self.SUSPECTS[s].groupId, true);
                    self.setCursor(self.SUSPECTS[s].groupId, 'pointer');
                }
            }, 1500);
        }
    },

    /* ─── SHOW ANSWER BUTTON (Change 4) ────────────────────────────────────── */
    onShowAnswerClick: function () {
        var G = this.G;
        /* Only makes sense after electrophoresis + not already shown */
        if (G.phase < 3) { return; }

        if (G.showAnswerOpen) {
            G.showAnswerOpen = false;
            this.hide('show_answer');
            this.enableInsightsBtn();
            var lblAns = this.el('lbl_show_answer');
            if (lblAns) { lblAns.textContent = 'Show Answer'; }
        } else {
            G.showAnswerOpen = true;
            this.show('show_answer');
            this.disableInsightsBtn();
            var lblAns = this.el('lbl_show_answer');
            if (lblAns) { lblAns.textContent = 'Back'; }
        }
    },

    /* ─── INSIGHTS PANEL ────────────────────────────────────────────────────── */
    onInsightsClick: function () {
        if (this.G.insightsOpen) {
            this.onInsightsClose();
        } else {
            this.onInsightsOpen();
        }
    },
    onInsightsOpen: function () {
        this.G.insightsOpen = true;
        this.show('insites');
        this.disableShowAnswerBtn();
    },
    onInsightsClose: function () {
        this.G.insightsOpen = false;
        this.hide('insites');
        if (this.G.phase >= 3) {
            this.enableShowAnswerBtn();
        }
    },

    /* ─── NEW SET ───────────────────────────────────────────────────────────── */
    onNewSetClick: function () {
        var G = this.G;
        // Avoid clicking while animating
        if (G.animating && G.phase < 4) { return; }

        // Randomly pick a new band-pattern set (avoid repeating same one)
        if (this.DNA_SETS.length > 1) {
            var nextSet = G.currentSetIdx;
            while (nextSet === G.currentSetIdx) {
                nextSet = Math.floor(Math.random() * this.DNA_SETS.length);
            }
            G.currentSetIdx = nextSet;
        }

        // Pick next criminal from non-repeating queue to ensure all 4 appear once before repeating
        G.criminal = this.getNextCriminal();

        console.log("%c [New Set Cycle] ", "background: #4CAF50; color: #fff; padding: 2px 5px;",
            "Band Set: " + G.currentSetIdx + ", Criminal: Suspect " + (G.criminal + 1));

        this.reset();
    },

    /* Helper to get next criminal from a shuffled pool of 4 suspects */
    getNextCriminal: function () {
        var G = this.G;
        var last = G.criminal; // current criminal will be the "last" one once we draw new

        if (!G.criminalQueue || G.criminalQueue.length === 0) {
            // Refill with all suspects 0-3 and shuffle
            G.criminalQueue = [0, 1, 2, 3];
            this.shuffleArray(G.criminalQueue);

            /**
             * Avoid consecutive duplicates between cycles:
             * If the next one to pop (the last in array) is the same as the previous criminal,
             * swap it with another element in the new queue.
             */
            if (G.criminalQueue[G.criminalQueue.length - 1] === last) {
                // Swap the last element with index 0
                var tmp = G.criminalQueue[G.criminalQueue.length - 1];
                G.criminalQueue[G.criminalQueue.length - 1] = G.criminalQueue[0];
                G.criminalQueue[0] = tmp;
            }

            console.log("Criminal Queue Refilled (Cycle Restart!):", G.criminalQueue);
        }
        return G.criminalQueue.pop();
    },

    /* Utility to shuffle array in place */
    shuffleArray: function (arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    },

    /* ─── DYNAMIC DNA BAND GENERATION ────────────────────────────────────────── */
    applyDNASet: function (setDef) {
        var criminal = this.G.criminal;  // dynamically chosen criminal index (0-3)

        // 1. Update legend labels
        for (var c = 0; c < 3; c++) {
            var lbl = this.el('lbl_chrom_' + c);
            if (lbl) { lbl.textContent = 'Chromosome ' + setDef.chromosomes[c]; }
        }

        // 2. Update criminal answer text (Suspects 1-indexed)
        var ansLbl = this.el('lbl_criminal_answer');
        if (ansLbl) { ansLbl.textContent = 'Suspect ' + (criminal + 1) + ' is the criminal'; }

        var ansSusName = this.el('ans_suspect_name');
        if (ansSusName) { ansSusName.textContent = 'Suspect-' + (criminal + 1); }

        // Update Answer Popup Portrait
        var colorMapBG = { 0: '#fdce86', 1: '#05decf', 2: '#a4de05', 3: '#dc83b6' };
        var ansBG = this.el('ans_portrait_bg');
        if (ansBG) { ansBG.setAttribute('fill', colorMapBG[criminal]); }

        for (var s = 0; s < 4; s++) {
            var p = this.el('ans_portrait_' + s);
            if (p) { p.style.display = (s === criminal) ? 'inline' : 'none'; }
        }

        // 3. Colors for chromosomes
        var colorMap = { 0: '#ff4c00', 1: '#00d62c', 2: '#ffffb4' };

        // 4. Generate bands for all 5 lanes
        // Crime Scene = copy of the criminal's pattern
        // Lane 2-5 = Suspects 1-4 in order
        var crimeSceneBands = setDef.suspects[criminal];

        // LOGGING: log values of all five lanes and correct answer
        console.log("%c [DNA Set Applied] ", "background: #006199; color: #fff; padding: 2px 5px;",
            "Set: " + this.G.currentSetIdx + " | Criminal: Suspect " + (criminal + 1));

        var bandGroupsParams = [
            { id: this.BANDS[0], label: "Lane 1 (Crime Scene)",  bands: crimeSceneBands,    x: 1091 },
            { id: this.BANDS[1], label: "Lane 2 (Suspect 1)",    bands: setDef.suspects[0], x: 1245 },
            { id: this.BANDS[2], label: "Lane 3 (Suspect 2)",    bands: setDef.suspects[1], x: 1397 },
            { id: this.BANDS[3], label: "Lane 4 (Suspect 3)",    bands: setDef.suspects[2], x: 1551 },
            { id: this.BANDS[4], label: "Lane 5 (Suspect 4)",    bands: setDef.suspects[3], x: 1701 }
        ];

        for (var l = 0; l < bandGroupsParams.length; l++) {
            var params = bandGroupsParams[l];
            var gEl = this.el(params.id);
            if (!gEl) { continue; }
            gEl.innerHTML = ''; // Clear old standard bands

            // Log lane values
            var bandYs = params.bands.map(function (b) { return b.y; });
            console.log(params.label + " band Y positions: " + bandYs.join(", "));

            for (var b = 0; b < params.bands.length; b++) {
                var bandDef = params.bands[b];
                var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', params.x);
                rect.setAttribute('y', bandDef.y);
                rect.setAttribute('width', 78);
                rect.setAttribute('height', 12);
                rect.setAttribute('fill', colorMap[bandDef.c]);
                gEl.appendChild(rect);
            }
        }
    },

    /* ─── DEBUG METHODS ────────────────────────────────────────────────────── */
    /**
     * Prints current state and band patterns to console for verification.
     */
    verifyRandomization: function () {
        var set = this.DNA_SETS[this.G.currentSetIdx];
        var criminal = this.G.criminal;
        console.log("%c DNA Verification (Band Set " + this.G.currentSetIdx + ", Criminal: Suspect " + (criminal + 1) + ") ",
            "background: #222; color: #bada55; font-weight: bold; padding: 5px;");
        console.log("Combination: Set " + this.G.currentSetIdx + " × Suspect " + (criminal + 1) +
            " = one of 16 possible combos (4 sets × 4 suspects)");

        console.group("Band Patterns (Lane assignments):");
        console.log("Lane 1 (Crime Scene): copied from Suspect " + (criminal + 1));
        var self = this;
        set.suspects.forEach(function (s, i) {
            var matchStr = (i === criminal) ? " ← MATCHES Crime Scene" : "";
            console.log("Lane " + (i + 2) + " (Suspect " + (i + 1) + ")" + matchStr + ":",
                s.map(function (b) { return "Y:" + b.y + "(C:" + b.c + ")"; }).join(" | "));
        });
        console.groupEnd();

        return "Band Set: " + this.G.currentSetIdx + " | Criminal: Suspect " + (criminal + 1) +
            " | Combos possible: 16 (4×4)";
    },

    /**
     * Run N iterations to verify distribution is uniform.
     * Usage: WG112App.testDistribution(100)
     */
    testDistribution: function (n) {
        n = n || 100;
        var counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
        for (var i = 0; i < n; i++) {
            var criminal = Math.floor(Math.random() * 4);
            counts[criminal + 1]++;
        }
        console.log("%c Distribution Test (" + n + " iterations) ",
            "background: #9C27B0; color: #fff; font-weight: bold; padding: 5px;");
        console.table(counts);
        var expected = n / 4;
        for (var k in counts) {
            var pct = ((counts[k] / n) * 100).toFixed(1);
            console.log("Suspect " + k + ": " + counts[k] + "/" + n + " (" + pct + "%, expected ~" + expected.toFixed(0) + ")");
        }
        return counts;
    }

};

// Global helper for testers
window.verifyRandomization = function () {
    if (window.WG112App) {
        return window.WG112App.verifyRandomization();
    }
    return "WG112App not initialized.";
};
window.testDistribution = function (n) {
    if (window.WG112App) {
        return window.WG112App.testDistribution(n);
    }
    return "WG112App not initialized.";
};

/* ─── BOOT ──────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    WG112App.init();
});
