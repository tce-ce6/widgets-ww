/**
 * WG112 - Identify The Criminal Through DNA Fingerprinting
 * Interactive Widget Script
 * All interactions achieved by showing / hiding SVG elements
 */

var WG112App = {

    /* ===================================================
     * GLOBAL STATE OBJECT  –  single source of truth
     * =================================================== */
    G: {
        phase: 0,          // 0=initial  1=allLoaded  2=running  3=identify  4=answered
        loadedTubes: [],   // indices 0-4 of loaded tubes
        criminal: 3,       // suspect index that is the criminal (0-3 → S1-S4)
        selected: -1,      // suspect index chosen by user
        animating: false,  // guard – prevents double-clicks during transitions
        insightsOpen: false,
        showAnswerOpen: false
    },

    /* ===================================================
     * STATIC CONFIGURATION
     * =================================================== */

    // Tube definitions: tubeId (liquid), baseId (rack slot), wellId (gel well fill)
    TUBES: [
        { id: 0, tubeId: 'tube', baseId: 'Group_1356', wellId: 'Group_1605' },
        { id: 1, tubeId: 'tube-2', baseId: 'Group_1357', wellId: 'Group_1607' },
        { id: 2, tubeId: 'tube-3', baseId: 'Group_1358', wellId: 'Group_1608' },
        { id: 3, tubeId: 'tube-4', baseId: 'Group_1359', wellId: 'Group_1609' },
        { id: 4, tubeId: 'tube-5', baseId: 'Group_1360', wellId: 'Group_1610' }
    ],

    // Gel band groups per lane
    BANDS: [
        'Group_1617', // Lane 1 – Crime scene
        'Group_1618', // Lane 2 – Suspect-1
        'Group_1619', // Lane 3 – Suspect-2
        'Group_1620', // Lane 4 – Suspect-3
        'Group_1621'  // Lane 5 – Suspect-4
    ],

    // Suspect portrait groups in Layer_4 (index = suspect number 0-3)
    SUSPECTS: [
        { groupId: 'Group_1682' }, // Suspect-1  top-left
        { groupId: 'Group_1683' }, // Suspect-2  top-right
        { groupId: 'Group_1685' }, // Suspect-3  bottom-left
        { groupId: 'Group_1684' }  // Suspect-4  bottom-right
    ],

    // Correct "Bravo" text  – one per suspect position
    BRAVO_TEXT: [
        'Bravo_You_have_correctly_identified_the_criminal._-4', // Suspect-1
        'Bravo_You_have_correctly_identified_the_criminal._-2', // Suspect-2
        'Bravo_You_have_correctly_identified_the_criminal._-3', // Suspect-3
        'Bravo_You_have_correctly_identified_the_criminal._'    // Suspect-4
    ],
    // Correct green border box – one per suspect position
    BRAVO_BOX: [
        'Group_1688-2-4', // Suspect-1
        'Group_1688-2-2', // Suspect-2
        'Group_1688-2-3', // Suspect-3
        'Group_1688-2'    // Suspect-4
    ],

    // Wrong "You are wrong" text – one per suspect position
    WRONG_TEXT: [
        'You_are_wrong_Please_carefully_look_at_the_DNA_fingerprint_result_and_try_again._-2', // S1
        'You_are_wrong_Please_carefully_look_at_the_DNA_fingerprint_result_and_try_again._-3', // S2
        'You_are_wrong_Please_carefully_look_at_the_DNA_fingerprint_result_and_try_again._',   // S3
        'You_are_wrong_Please_carefully_look_at_the_DNA_fingerprint_result_and_try_again._-4'  // S4
    ],
    // Wrong red border box – one per suspect position
    WRONG_BOX: [
        'Group_1678-2-2', // Suspect-1
        'Group_1678-2-3', // Suspect-2
        'Group_1678-2',   // Suspect-3
        'Group_1678-2-4'  // Suspect-4
    ],

    // Pipette default SVG X-centre (used for translate calculation)
    PIPETTE_DEFAULT_X: 682,

    // SVG tube X-centres (SVG user-unit space)
    TUBE_X: [171, 341, 511, 681, 851],

    // SVG lane well X-centres
    LANE_X: [1130, 1284, 1436, 1590, 1739],

    /* ===================================================
     * UTILITIES
     * =================================================== */
    el: function (id) { return document.getElementById(id); },

    show: function (id) {
        var e = this.el(id);
        if (e) e.style.display = '';
    },

    hide: function (id) {
        var e = this.el(id);
        if (e) e.style.display = 'none';
    },

    setCursor: function (id, cur) {
        var e = this.el(id);
        if (e) e.style.cursor = cur;
    },

    setOpacity: function (id, val) {
        var e = this.el(id);
        if (e) e.style.opacity = val;
    },

    setPointer: function (id, allow) {
        var e = this.el(id);
        if (e) e.style.pointerEvents = allow ? 'auto' : 'none';
    },

    /* Animate pipette using SVG transform translate (SVG units = viewBox units) */
    movePipette: function (dx, dy, dur, cb) {
        var p = this.el('micropipette');
        if (!p) { if (cb) cb(); return; }
        p.setAttribute('transform', 'translate(' + dx + ',' + dy + ')');
        if (cb) { setTimeout(cb, dur); }
    },

    resetPipettePos: function () {
        var p = this.el('micropipette');
        if (p) p.setAttribute('transform', 'translate(0,0)');
    },

    /* ===================================================
     * INITIALISATION
     * =================================================== */
    init: function () {
        // Add pipette CSS transition once
        var p = this.el('micropipette');
        if (p) p.style.transition = 'transform 0.55s ease-in-out';

        this.reset();
        this.bindEvents();
    },

    /* Full reset – returns widget to initial state */
    reset: function () {
        var G = this.G;
        G.phase = 0;
        G.loadedTubes = [];
        G.criminal = 3;   // Suspect-4 is always the criminal per SVG data
        G.selected = -1;
        G.animating = false;
        G.insightsOpen = false;
        G.showAnswerOpen = false;

        // --- Show / hide all layer groups ---

        // Background, base, gel apparatus – always on
        this.show('base');
        this.show('gel_base');
        this.show('repport_numbers');
        this.show('index');
        this.show('button');

        // Tubes: show rack slots and actual tubes
        this.show('tube_base');
        this.show('solution_tube');
        for (var i = 0; i < this.TUBES.length; i++) {
            this.show(this.TUBES[i].tubeId);
            this.setCursor(this.TUBES[i].tubeId, 'pointer');
            this.setCursor(this.TUBES[i].baseId, 'pointer');
            // Hide filled wells
            this.hide(this.TUBES[i].wellId);
        }

        // Gel bands – off until electrophoresis
        for (var b = 0; b < this.BANDS.length; b++) { this.hide(this.BANDS[b]); }

        // Lane sample labels – shown after all loaded
        this.hide('sample_in_lane');

        // Suspect portraits layer – off until phase 3
        this.hide('Layer_4');
        for (var s = 0; s < this.SUSPECTS.length; s++) {
            this.setCursor(this.SUSPECTS[s].groupId, 'default');
        }

        // All feedback containers off
        this.hide('Layer_5');
        this.hide('wrong_feedback');
        for (var f = 0; f < 4; f++) {
            this.hide(this.BRAVO_TEXT[f]);
            this.hide(this.BRAVO_BOX[f]);
            this.hide(this.WRONG_TEXT[f]);
            this.hide(this.WRONG_BOX[f]);
        }

        // Panels
        this.hide('insites');
        this.hide('show_answer');

        // Instructions: only instruction-3 visible
        this.hide('i_text');
        this.hide('i_text_2');
        this.show('i_text_3');

        // Micropipette – off initially
        this.hide('micropipette');
        this.resetPipettePos();

        // Start button – disabled look
        this.setOpacity('Group_1110', '0.45');
        this.setPointer('Group_1110', false);
        this.setCursor('Group_1110', 'not-allowed');
    },

    /* ===================================================
     * EVENT BINDING
     * =================================================== */
    bindEvents: function () {
        var self = this;

        // Tubes
        for (var i = 0; i < this.TUBES.length; i++) {
            (function (idx) {
                var tEl = self.el(self.TUBES[idx].tubeId);
                var bEl = self.el(self.TUBES[idx].baseId);
                if (tEl) tEl.addEventListener('click', function () { self.onTubeClick(idx); });
                if (bEl) bEl.addEventListener('click', function () { self.onTubeClick(idx); });
            })(i);
        }

        // Buttons
        var startBtn = this.el('Group_1110');
        if (startBtn) startBtn.addEventListener('click', function () { self.onStartClick(); });

        var resetBtn = this.el('Group_2');
        if (resetBtn) resetBtn.addEventListener('click', function () { self.reset(); });

        var newSetBtn = this.el('Group_1690');
        if (newSetBtn) newSetBtn.addEventListener('click', function () { self.onNewSetClick(); });

        var showAnsBtn = this.el('Group_1691');
        if (showAnsBtn) showAnsBtn.addEventListener('click', function () { self.onShowAnswerClick(); });

        // Insights – open
        var insBtn = this.el('Button_Insite_');
        if (insBtn) insBtn.addEventListener('click', function () { self.onInsightsOpen(); });

        // Insights – close (X button inside insites panel)
        var closeBtn = this.el('Group_1331');
        if (closeBtn) closeBtn.addEventListener('click', function () { self.onInsightsClose(); });

        // Suspects
        for (var s = 0; s < this.SUSPECTS.length; s++) {
            (function (idx) {
                var sEl = self.el(self.SUSPECTS[idx].groupId);
                if (sEl) sEl.addEventListener('click', function () { self.onSuspectClick(idx); });
            })(s);
        }
    },

    /* ===================================================
     * INTERACTION HANDLERS
     * =================================================== */

    /* --- Tube tap (Phase 0) --- */
    onTubeClick: function (idx) {
        var G = this.G;
        if (G.phase !== 0) return;
        if (G.animating) return;
        if (G.loadedTubes.indexOf(idx) !== -1) return;  // already loaded

        G.animating = true;
        var self = this;
        var tube = this.TUBES[idx];

        /* Step 1 – show pipette near default SVG position, then move to tube */
        this.show('micropipette');
        var toTubeDx = this.TUBE_X[idx] - this.PIPETTE_DEFAULT_X;
        this.movePipette(toTubeDx, 0, 600, function () {

            /* Step 2 – hide tube (sample picked up), move pipette to lane well */
            self.hide(tube.tubeId);
            self.setCursor(tube.baseId, 'default');

            var toLaneDx = self.LANE_X[idx] - self.PIPETTE_DEFAULT_X;
            // Move pipette upward to the gel well area (approx -55 in SVG units)
            self.movePipette(toLaneDx, -55, 600, function () {

                /* Step 3 – show well fill (sample dispensed), return pipette */
                self.show(tube.wellId);
                self.movePipette(0, 0, 550, function () {

                    /* Step 4 – hide pipette, mark tube as loaded */
                    self.hide('micropipette');
                    self.resetPipettePos();
                    G.loadedTubes.push(idx);
                    G.animating = false;

                    if (G.loadedTubes.length === self.TUBES.length) {
                        self.onAllTubesLoaded();
                    }
                });
            });
        });
    },

    /* Called when all 5 tubes have been loaded */
    onAllTubesLoaded: function () {
        this.G.phase = 1;
        this.hide('i_text_3');
        this.show('i_text_2');
        this.show('sample_in_lane');

        // Enable Start button
        this.setOpacity('Group_1110', '1');
        this.setPointer('Group_1110', true);
        this.setCursor('Group_1110', 'pointer');
    },

    /* --- Start button (Phase 1) → run electrophoresis --- */
    onStartClick: function () {
        var G = this.G;
        if (G.phase !== 1) return;
        if (G.animating) return;

        G.phase = 2;
        G.animating = true;
        this.hide('i_text_2');

        // Disable Start during animation
        this.setOpacity('Group_1110', '0.45');
        this.setPointer('Group_1110', false);

        var self = this;
        var delay = 480; // ms between each lane band reveal

        for (var i = 0; i < this.BANDS.length; i++) {
            (function (idx, ms) {
                setTimeout(function () {
                    self.show(self.BANDS[idx]);
                }, ms);
            })(i, delay * (i + 1));
        }

        // Transition to identification phase after all bands appear
        setTimeout(function () {
            self.onElectrophoresisComplete();
        }, delay * (this.BANDS.length + 1) + 600);
    },

    /* Called after electrophoresis animation finishes */
    onElectrophoresisComplete: function () {
        var G = this.G;
        G.phase = 3;
        G.animating = false;

        // Swap left-panel: tubes out → suspect portraits in
        this.hide('tube_base');
        this.hide('solution_tube');
        this.hide('base');            // hide the yellow background card behind tubes
        this.show('Layer_4');

        // Show identify instruction
        this.hide('i_text_3');
        this.hide('i_text_2');
        this.show('i_text');

        // Make suspect portraits clickable
        for (var s = 0; s < this.SUSPECTS.length; s++) {
            this.setCursor(this.SUSPECTS[s].groupId, 'pointer');
        }
    },

    /* --- Suspect portrait tap (Phase 3) --- */
    onSuspectClick: function (idx) {
        var G = this.G;
        if (G.phase !== 3) return;
        if (G.selected !== -1) return; // already answered

        G.selected = idx;
        G.phase = 4;

        if (idx === G.criminal) {
            // ✅ Correct answer
            this.show('Layer_5');
            this.show(this.BRAVO_TEXT[idx]);
            this.show(this.BRAVO_BOX[idx]);
        } else {
            // ❌ Wrong answer
            this.show('wrong_feedback');
            this.show(this.WRONG_TEXT[idx]);
            this.show(this.WRONG_BOX[idx]);
        }
    },

    /* --- Insights panel --- */
    onInsightsOpen: function () {
        this.G.insightsOpen = true;
        this.show('insites');
    },

    onInsightsClose: function () {
        this.G.insightsOpen = false;
        this.hide('insites');
    },

    /* --- Show Answer button --- */
    onShowAnswerClick: function () {
        // Available from phase 2 onwards (after start is clicked)
        if (this.G.phase < 2) return;
        this.G.showAnswerOpen = true;
        this.show('show_answer');
    },

    /* --- New Set: randomise which suspect is the criminal, then reset --- */
    onNewSetClick: function () {
        // Pick a random criminal index  (0-3)
        this.G.criminal = Math.floor(Math.random() * 4);
        this.reset();
    }

};

/* ===================================================
 * BOOT
 * =================================================== */
document.addEventListener('DOMContentLoaded', function () {
    WG112App.init();
});
