/**
 * ============================================================
 * Wg121 – Synthesize New DNA Strand
 * POC Interactive (Slideshow-Style)
 * ============================================================
 *
 * ARCHITECTURE:
 *   All logic lives inside the Wg121 class.
 *   A single instance is created: const WG121_WIDGET = new Wg121();
 *   No global functions or variables leak outside the class.
 *
 * POC APPROACH:
 *   - Simulates buttons (A, T, C, G) overlaid on the SVG drop zones
 *   - Shows/hides SVG elements for feedback, completion, overlays
 *   - Validates base-pair complementarity (A↔T, C↔G)
 *   - Demonstrates all state transitions from the wireframe
 *
 * SVG ID MAPPING (from index.html analysis):
 *   Template nucleotide boxes:
 *     Group 639 (T), 637 (A), 636 (G), 634 (T), 635 (G), 631 (T), 630 (C), 633 (G), 629 (A), 625 (C), 627 (A), 628 (T)
 *     → SVG text IDs: T, A, G, T_2, G_2, T_3, C, G_3, A_2, C_2, A_3, T_4 (reading left to right = 3' to 5')
 *   Drop zone boxes (complementary strand):
 *     Rectangle 228 through 228_12 → white dashed rectangles in Group 607, 616...566 range
 *   Nucleotide source tray:
 *     Group 642: Rectangle 229_13(T), 229_14(A), 229_15(G), 229_16(C) at y≈748
 *   Buttons:
 *     Button_Insite → Insights
 *     Group 2       → Show Answer (path + text "Show Answer")
 *     Group 712     → New Template Sequence
 *     Group 1621    → Reset
 */

class Wg121 {
    // ----------------------------------------------------------
    // constructor()
    // Sets up the initial state object.
    // ----------------------------------------------------------
    constructor() {
        this.state = {
            /**
             * currentStep: index into templateSequence for the NEXT
             * complementary nucleotide to place (0 = leftmost slot)
             */
            currentStep: 0,

            /**
             * templateSequence: the 12-base template strand (3' → 5')
             * displayed left-to-right in the SVG.
             * The wireframe default is: T, A, C, A, G, C, T, G, T, G, A, T
             */
            templateSequence: ['T', 'A', 'C', 'A', 'G', 'C', 'T', 'G', 'T', 'G', 'A', 'T'],

            /**
             * placedBases: array tracking which base was placed at each slot.
             * null = empty, 'A'/'T'/'C'/'G' = placed.
             */
            placedBases: new Array(12).fill(null),

            /**
             * isLocked: prevent interaction during animations or overlays
             */
            isLocked: false,

            /**
             * animations: stores Lottie animation instances (not used in POC)
             */
            animations: {},

            /**
             * data: stores internal data (sequences, feedback messages, etc.)
             */
            data: {
                // Possible randomized sequences for "New Template Sequence"
                sequences: [
                    ['T', 'A', 'C', 'A', 'G', 'C', 'T', 'G', 'T', 'G', 'A', 'T'],
                    ['G', 'A', 'G', 'C', 'T', 'A', 'T', 'C', 'A', 'T', 'G', 'C'],
                    ['A', 'T', 'C', 'G', 'A', 'T', 'C', 'G', 'A', 'T', 'C', 'G'],
                    ['C', 'G', 'T', 'A', 'C', 'G', 'T', 'A', 'C', 'G', 'T', 'A'],
                    ['T', 'G', 'C', 'A', 'T', 'G', 'C', 'A', 'T', 'G', 'C', 'A'],
                ],
                // Feedback messages for correct placements
                correctMessages: {
                    'AT': 'Excellent! Adenine forms 2 hydrogen bonds with Thymine.',
                    'TA': 'Excellent! Thymine forms 2 hydrogen bonds with Adenine.',
                    'GC': 'Great job! Guanine forms 3 hydrogen bonds with Cytosine.',
                    'CG': 'Great job! Cytosine forms 3 hydrogen bonds with Guanine.',
                },
                // Feedback messages for wrong placements
                wrongMessages: {
                    'A': 'Adenine',
                    'T': 'Thymine',
                    'C': 'Cytosine',
                    'G': 'Guanine',
                },
            },

            /**
             * config: widget-level settings
             */
            config: {
                feedbackTimeout: 1800, // ms to show feedback
                autoCloseFeedback: true,
            },

            /**
             * cache: cached DOM references (populated by cacheDOM)
             */
            cache: {},
        };
    }

    // ----------------------------------------------------------
    // init()
    // Entry point: caches DOM, creates POC overlay, binds events.
    // ----------------------------------------------------------
    init() {
        this.cacheDOM();
        this._buildPOCOverlay();
        this.bindEvents();
        this.updateUI();
    }

    // ----------------------------------------------------------
    // cacheDOM()
    // Stores references to all SVG elements and containers.
    // Avoids repeated querySelector calls in hot paths.
    // ----------------------------------------------------------
    cacheDOM() {
        const cache = this.state.cache;

        // Main SVG container
        cache.svgContainer = document.querySelector('.svg-container svg');

        // ── BUTTONS ─────────────────────────────────────────────
        cache.btnInsights = document.getElementById('Button_Insite');
        cache.btnShowAnswer = document.getElementById('Group 2');
        cache.btnNewTemplate = document.getElementById('Group 712');
        cache.btnReset = document.getElementById('Group 1621');

        // ── OVERLAYS (will be created by _buildPOCOverlay) ──────
        // These are HTML overlays injected over the SVG, not SVG elements.
        // Justification: the SVG does not include overlay screens;
        // foreignObject is the only way to render styled HTML inside SVG,
        // but a simpler approach for the POC is an absolute-positioned
        // HTML overlay on top of the svg-container.
        cache.overlay = null; // set later by _buildPOCOverlay

        // ── NUCLEOTIDE SOURCE TRAY ───────────────────────────────
        // The tray nucleotides in Group 642 (bottom tray area of SVG)
        cache.trayNucleotides = {
            T: document.getElementById('Group 638_2'),   // Thymine in source tray
            A: document.getElementById('Group 637_2'),   // Adenine in source tray
            G: document.getElementById('Group 636_2'),   // Guanine in source tray
            C: document.getElementById('Group 630_2'),   // Cytosine in source tray
        };

        // ── TEMPLATE STRAND NUCLEOTIDES ─────────────────────────
        // Groups wrapping each of the 12 template-strand nucleotide units
        // Order: left (3') → right (5') = position 0..11
        cache.templateGroups = [
            document.getElementById('Group 639'),   // pos 0 → T (wireframe default)
            document.getElementById('Group 637'),   // pos 1 → A
            document.getElementById('Group 636'),   // pos 2 → C (note: in SVG it has G label; dynamically updated)
            document.getElementById('Group 634'),   // pos 3 → A (has T label; dynamically updated)
            document.getElementById('Group 635'),   // pos 4 → G
            document.getElementById('Group 631'),   // pos 5 → C (has T label; dynamically updated)
            document.getElementById('Group 630'),   // pos 6 → T (has C label; dynamically updated after rename)
            // NOTE: The SVG has 12 nucleotide groups for template and 12 drop zones for comp.
            // Groups 633, 629, 625, 627, 628 are remaining 5 template positions
            document.getElementById('Group 633'),   // pos 7 → G
            document.getElementById('Group 629'),   // pos 8 → T (has A label; dynamically updated)
            document.getElementById('Group 625'),   // pos 9 → G
            document.getElementById('Group 627'),   // pos 10 → A (has A label)
            document.getElementById('Group 628'),   // pos 11 → T
        ];

        // ── COMPLEMENTARY STRAND DROP ZONES ─────────────────────
        // These are the dashed-outline boxes (Rectangle 228 variants)
        // in the complementary strand row. Order: left (5') → right (3').
        // Each group contains a white dashed rect and a pentagon shape.
        // When JS places a nucleotide, we reveal the colored base inside.
        cache.dropZoneGroups = [
            document.getElementById('Group 607'),   // slot 0
            document.getElementById('Group 616'),   // slot 1
            document.getElementById('Group 615'),   // slot 2
            document.getElementById('Group 614'),   // slot 3
            document.getElementById('Group 613'),   // slot 4
            document.getElementById('Group 612'),   // slot 5
            document.getElementById('Group 611'),   // slot 6
            document.getElementById('Group 610'),   // slot 7
            document.getElementById('Group 609'),   // slot 8
            document.getElementById('Group 608'),   // slot 9
            document.getElementById('Group 606'),   // slot 10  (some #s may vary slightly)
            document.getElementById('Group 567'),   // slot 11
        ];
    }

    // ----------------------------------------------------------
    // _buildPOCOverlay()
    // Creates the HTML overlay system that drives the POC.
    // This includes:
    //   - nucleotide picker buttons
    //   - feedback toast
    //   - completion message
    //   - solution modal
    //   - insights modal
    // All positioned absolutely over the SVG iframe.
    // ----------------------------------------------------------
    _buildPOCOverlay() {
        // Inject CSS for the POC overlay
        const style = document.createElement('style');
        style.textContent = `
      /* ── POC Overlay System ─────────────────────────── */
      .poc-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 100;
      }

      /* Nucleotide picker pill shown near each drop zone */
      .poc-picker {
        position: absolute;
        display: flex;
        gap: 6px;
        pointer-events: all;
        bottom: 36%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255,255,255,0.92);
        border-radius: 40px;
        padding: 8px 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        border: 2px solid #888;
        z-index: 110;
      }
      .poc-picker.hidden { display: none; }

      .poc-picker-label {
        font-family: Roboto, sans-serif;
        font-size: 13px;
        color: #444;
        display: flex;
        align-items: center;
        padding-right: 8px;
        border-right: 1px solid #ccc;
        margin-right: 4px;
        white-space: nowrap;
      }

      .poc-btn-nuc {
        width: 48px; height: 48px;
        border-radius: 8px;
        border: 3px solid transparent;
        font-family: Roboto, sans-serif;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.12s, box-shadow 0.12s;
      }
      .poc-btn-nuc:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      }
      .poc-btn-nuc.nuc-A { background: #00EFCE; border-color: #04ABA5; color: #020202; }
      .poc-btn-nuc.nuc-T { background: #FFF700; border-color: #DAAC15; color: #020202; }
      .poc-btn-nuc.nuc-C { background: #FF7FA5; border-color: #E34772; color: #020202; }
      .poc-btn-nuc.nuc-G { background: #B895FF; border-color: #9A38DB; color: #020202; }

      /* Feedback toast */
      .poc-feedback {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 30%;
        padding: 14px 28px;
        border-radius: 10px;
        font-family: Roboto, sans-serif;
        font-size: 18px;
        font-weight: 500;
        color: white;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.25s;
        z-index: 120;
        text-align: center;
        max-width: 600px;
        width: max-content;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      }
      .poc-feedback.show { opacity: 1; pointer-events: all; }
      .poc-feedback.correct { background: #1a6e36; }
      .poc-feedback.wrong   { background: #c0392b; }

      /* Modal backdrop */
      .poc-modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        pointer-events: all;
        opacity: 0;
        transition: opacity 0.25s;
      }
      .poc-modal-backdrop.show { opacity: 1; }
      .poc-modal-backdrop.hidden { display: none; }

      /* Solution modal card */
      .poc-modal-card {
        background: #e8f9e8;
        border: 3px solid #4caf50;
        border-radius: 16px;
        padding: 32px;
        max-width: 700px;
        width: 90%;
        position: relative;
        font-family: Roboto, sans-serif;
        box-shadow: 0 8px 40px rgba(0,0,0,0.4);
      }
      .poc-modal-title {
        font-size: 24px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 20px;
        color: #1a6e36;
      }
      .poc-modal-close {
        position: absolute;
        top: -16px; right: -16px;
        background: #1a6e36;
        color: white;
        border: none;
        border-radius: 50%;
        width: 36px; height: 36px;
        font-size: 20px;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        font-weight: bold;
      }

      /* Insights modal */
      .poc-modal-card.insights {
        background: #fff8ec;
        border-color: #F7901E;
        max-width: 640px;
      }
      .poc-modal-card.insights .poc-modal-title { color: #F7901E; }

      /* DNA sequence display in solution modal */
      .poc-dna-display {
        background: #FFFEEA;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 16px;
        margin: 12px 0;
      }
      .poc-dna-label {
        font-size: 14px; font-weight: 500; color: #555; margin-bottom: 6px;
        font-family: Roboto, sans-serif;
      }
      .poc-dna-row {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        font-family: Roboto, sans-serif;
      }
      .poc-dna-base {
        width: 36px; height: 36px;
        border-radius: 5px;
        display: flex; align-items: center; justify-content: center;
        font-weight: bold; font-size: 14px;
        border: 2px solid transparent;
      }
      .poc-dna-base.A { background: #00EFCE; border-color: #04ABA5; }
      .poc-dna-base.T { background: #FFF700; border-color: #DAAC15; }
      .poc-dna-base.C { background: #FF7FA5; border-color: #E34772; }
      .poc-dna-base.G { background: #B895FF; border-color: #9A38DB; }

      /* Insights text */
      .poc-insights-body {
        font-family: Roboto, sans-serif;
        font-size: 16px;
        line-height: 1.7;
        color: #333;
      }
      .poc-insights-body ul { padding-left: 20px; }
      .poc-insights-body li { margin-bottom: 8px; }
      .poc-insights-body strong { color: #c47a00; }

      /* Step indicator */
      .poc-step-indicator {
        position: absolute;
        top: 8px;
        right: 12px;
        font-family: Roboto, sans-serif;
        font-size: 14px;
        color: #555;
        background: rgba(255,255,255,0.8);
        padding: 4px 10px;
        border-radius: 20px;
        pointer-events: none;
        z-index: 105;
      }

      /* Make SVG group buttons focusable/clickable */
      #Button_Insite, #\\30 Group\\ 2, #Group\\ 712, #Group\\ 1621 {
        cursor: pointer;
      }
    `;
        document.head.appendChild(style);

        // Create the overlay container, sized to match svg-container
        const svgContainerEl = document.querySelector('.svg-container');
        if (!svgContainerEl) return;
        // Ensure position is relative so overlay can be absolute
        svgContainerEl.style.position = 'relative';
        svgContainerEl.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.className = 'poc-overlay';

        // ── Step indicator ──────────────────────────────────────
        const stepIndicator = document.createElement('div');
        stepIndicator.className = 'poc-step-indicator';
        stepIndicator.id = 'poc-step-indicator';
        stepIndicator.textContent = 'Step 0 / 12';
        overlay.appendChild(stepIndicator);

        // ── Nucleotide picker ───────────────────────────────────
        const picker = document.createElement('div');
        picker.className = 'poc-picker';
        picker.id = 'poc-picker';
        picker.innerHTML = `
      <span class="poc-picker-label">Choose nucleotide to place at slot <span id="poc-slot-num">1</span>:</span>
      <button class="poc-btn-nuc nuc-A" data-nuc="A">A</button>
      <button class="poc-btn-nuc nuc-T" data-nuc="T">T</button>
      <button class="poc-btn-nuc nuc-C" data-nuc="C">C</button>
      <button class="poc-btn-nuc nuc-G" data-nuc="G">G</button>
    `;
        overlay.appendChild(picker);

        // ── Feedback toast ──────────────────────────────────────
        const feedback = document.createElement('div');
        feedback.className = 'poc-feedback';
        feedback.id = 'poc-feedback';
        overlay.appendChild(feedback);

        // ── Solution modal ──────────────────────────────────────
        const solutionBackdrop = document.createElement('div');
        solutionBackdrop.className = 'poc-modal-backdrop hidden';
        solutionBackdrop.id = 'poc-solution-modal';
        solutionBackdrop.innerHTML = `
      <div class="poc-modal-card" id="poc-solution-card">
        <button class="poc-modal-close" id="poc-solution-close">×</button>
        <div class="poc-modal-title">Solution</div>
        <div class="poc-dna-display">
          <div class="poc-dna-label">Template Strand (3' → 5'):</div>
          <div class="poc-dna-row" id="poc-sol-template"></div>
        </div>
        <div class="poc-dna-display">
          <div class="poc-dna-label">Complementary Strand (5' → 3'):</div>
          <div class="poc-dna-row" id="poc-sol-complementary"></div>
        </div>
        <p style="font-family:Roboto,sans-serif;font-size:14px;color:#555;text-align:center;margin-top:12px;">
          A↔T (2 hydrogen bonds) &nbsp;|&nbsp; C↔G (3 hydrogen bonds)
        </p>
      </div>
    `;
        overlay.appendChild(solutionBackdrop);

        // ── Insights modal ──────────────────────────────────────
        const insightsBackdrop = document.createElement('div');
        insightsBackdrop.className = 'poc-modal-backdrop hidden';
        insightsBackdrop.id = 'poc-insights-modal';
        insightsBackdrop.innerHTML = `
      <div class="poc-modal-card insights" id="poc-insights-card">
        <button class="poc-modal-close" id="poc-insights-close" style="background:#F7901E;">×</button>
        <div class="poc-modal-title">🔬 Insights</div>
        <div class="poc-insights-body">
          <ul>
            <li><strong>Base Pairing Rule:</strong> Adenine (A) pairs with Thymine (T) via <strong>2 hydrogen bonds</strong>.</li>
            <li><strong>Base Pairing Rule:</strong> Cytosine (C) pairs with Guanine (G) via <strong>3 hydrogen bonds</strong>.</li>
            <li><strong>Purines</strong> (A, G) have a double-ring structure.</li>
            <li><strong>Pyrimidines</strong> (T, C) have a single-ring structure.</li>
            <li>The complementary strand is synthesized in the <strong>5' → 3' direction</strong>.</li>
            <li>The template strand is read in the <strong>3' → 5' direction</strong>.</li>
            <li>This process, called <strong>DNA replication</strong>, ensures genetic fidelity.</li>
          </ul>
        </div>
      </div>
    `;
        overlay.appendChild(insightsBackdrop);

        svgContainerEl.appendChild(overlay);

        // Store overlay references in cache
        this.state.cache.overlay = overlay;
        this.state.cache.picker = picker;
        this.state.cache.feedback = feedback;
        this.state.cache.stepIndicator = stepIndicator;
        this.state.cache.solutionModal = solutionBackdrop;
        this.state.cache.insightsModal = insightsBackdrop;
        this.state.cache.solTemplate = document.getElementById('poc-sol-template');
        this.state.cache.solComplementary = document.getElementById('poc-sol-complementary');
        this.state.cache.slotNumLabel = document.getElementById('poc-slot-num');
    }

    // ----------------------------------------------------------
    // bindEvents()
    // Attaches all event listeners. No anonymous functions stored
    // elsewhere — all live here for maintainability.
    // ----------------------------------------------------------
    bindEvents() {
        const cache = this.state.cache;

        // ── Nucleotide picker buttons ────────────────────────────
        cache.picker.addEventListener('click', (e) => {
            const btn = e.target.closest('.poc-btn-nuc');
            if (!btn) return;
            const nuc = btn.dataset.nuc;
            this._onNucleotideSelected(nuc);
        });

        // ── SVG Buttons ─────────────────────────────────────────
        // Show Answer button
        if (cache.btnShowAnswer) {
            cache.btnShowAnswer.style.cursor = 'pointer';
            cache.btnShowAnswer.addEventListener('click', () => this._onShowAnswer());
        }

        // New Template Sequence button
        if (cache.btnNewTemplate) {
            cache.btnNewTemplate.style.cursor = 'pointer';
            cache.btnNewTemplate.addEventListener('click', () => this._onNewTemplate());
        }

        // Reset button
        if (cache.btnReset) {
            cache.btnReset.style.cursor = 'pointer';
            cache.btnReset.addEventListener('click', () => this.resetWidget());
        }

        // Insights button
        if (cache.btnInsights) {
            cache.btnInsights.style.cursor = 'pointer';
            cache.btnInsights.addEventListener('click', () => this._onInsights());
        }

        // ── Modal close buttons ─────────────────────────────────
        document.getElementById('poc-solution-close').addEventListener('click', () => {
            this._closeModal(cache.solutionModal);
        });
        document.getElementById('poc-insights-close').addEventListener('click', () => {
            this._closeModal(cache.insightsModal);
        });

        // Close modals on backdrop click
        cache.solutionModal.addEventListener('click', (e) => {
            if (e.target === cache.solutionModal) this._closeModal(cache.solutionModal);
        });
        cache.insightsModal.addEventListener('click', (e) => {
            if (e.target === cache.insightsModal) this._closeModal(cache.insightsModal);
        });
    }

    // ----------------------------------------------------------
    // updateUI()
    // Syncs the DOM to match the current state.
    // Called after every state change.
    // ----------------------------------------------------------
    updateUI() {
        const { currentStep, templateSequence, placedBases } = this.state;
        const cache = this.state.cache;

        // Update step indicator text
        if (cache.stepIndicator) {
            cache.stepIndicator.textContent = `Step ${currentStep} / 12`;
        }

        // Update slot number label in picker
        if (cache.slotNumLabel) {
            cache.slotNumLabel.textContent = String(currentStep + 1);
        }

        // Show/hide nucleotide picker
        // Show if not all 12 slots filled and widget is not locked
        if (cache.picker) {
            const allFilled = currentStep >= 12;
            cache.picker.classList.toggle('hidden', allFilled || this.state.isLocked);
        }

        // Update template nucleotide text labels in SVG
        this.updateText();

        // Show placed complementary nucleotides in SVG drop zones
        this._renderPlacedNucleotides();
    }

    // ----------------------------------------------------------
    // validateStep(nucPlaced, templateBase)
    // Returns true if the placed nucleotide correctly pairs
    // with the current template base.
    // Base pairing: A↔T, T↔A, C↔G, G↔C
    // ----------------------------------------------------------
    validateStep(nucPlaced, templateBase) {
        const pairMap = { A: 'T', T: 'A', C: 'G', G: 'C' };
        return pairMap[templateBase] === nucPlaced;
    }

    // ----------------------------------------------------------
    // handleAnimation()
    // Placeholder for Lottie/CSS animation control.
    // In production: play Lottie assets from assets/json/,
    // store instances in this.state.animations.
    // In POC: simple CSS class toggles simulate animations.
    // ----------------------------------------------------------
    handleAnimation(animationName, action = 'play') {
        // POC: no Lottie animations. Production will use:
        // this.state.animations[animationName] = lottie.loadAnimation({...})
        console.log(`[Wg121] handleAnimation: ${animationName} → ${action}`);
    }

    // ----------------------------------------------------------
    // updateText()
    // Updates SVG text elements that hold template base labels.
    // In the POC, we update the SVG text nodes of each template position.
    // ----------------------------------------------------------
    updateText() {
        const seq = this.state.templateSequence;
        // Template group text element IDs (the inner <text> with base letter)
        // Mapping template group index → SVG text element ID
        const textids = ['T', 'A', 'G', 'T_2', 'G_2', 'T_3', 'C', 'G_3', 'A_2', 'C_2', 'A_3', 'T_4'];
        const colorMap = {
            A: { bg: '#00EFCE', stroke: '#04ABA5' },
            T: { bg: '#FFF700', stroke: '#DAAC15' },
            C: { bg: '#FF7FA5', stroke: '#E34772' },
            G: { bg: '#B895FF', stroke: '#9A38DB' },
        };

        textids.forEach((textId, idx) => {
            const textEl = document.getElementById(textId);
            if (!textEl) return;

            const base = seq[idx];
            if (!base) return;

            // Update the text content
            const tspan = textEl.querySelector('tspan');
            if (tspan) tspan.textContent = base;

            // Update the background rect color of this nucleotide
            // Each text element is inside a group that also has a Rectangle group.
            // The rect is in a sibling Rectangle 229_N path. We update fill/stroke
            // of the first two paths inside the parent group's first child group.
            const parentGroup = textEl.closest('g');
            if (!parentGroup) return;
            const parentParent = parentGroup.closest(`g[id^="Group"]`);
            if (!parentParent) return;

            // Find the rectangle group inside (first child g)
            const rectGroup = parentParent.querySelector(`g[id^="Rectangle 229"]`);
            if (!rectGroup) return;
            const paths = rectGroup.querySelectorAll('path');
            if (paths[0]) paths[0].setAttribute('fill', colorMap[base].bg);
            if (paths[1]) {
                paths[1].setAttribute('stroke', colorMap[base].stroke);
                paths[1].removeAttribute('fill');
            }
        });
    }

    // ----------------------------------------------------------
    // updateImage()
    // Updates SVG image href attributes for dynamic images.
    // In the POC, not needed (no SVG <image> elements for nucleotides).
    // In production: used to swap the 3D double helix image in
    // the Solution overlay or any background imagery.
    // ----------------------------------------------------------
    updateImage(svgImageId, newHref) {
        const imgEl = document.getElementById(svgImageId);
        if (!imgEl) return;
        imgEl.setAttribute('href', newHref);
    }

    // ----------------------------------------------------------
    // resetWidget()
    // Resets the complementary strand to all-empty but keeps the
    // same template sequence. Clears feedback. Unlocks picker.
    // ----------------------------------------------------------
    resetWidget() {
        this.state.currentStep = 0;
        this.state.placedBases = new Array(12).fill(null);
        this.state.isLocked = false;

        // Hide feedback
        this._hideFeedback();

        // Close any open modals
        this._closeModal(this.state.cache.solutionModal);
        this._closeModal(this.state.cache.insightsModal);

        this.updateUI();
    }

    // ----------------------------------------------------------
    // _onNucleotideSelected(nuc)
    // Called when user picks A/T/C/G from the picker widget.
    // Validates the choice, updates state, shows feedback.
    // ----------------------------------------------------------
    _onNucleotideSelected(nuc) {
        if (this.state.isLocked) return;
        const { currentStep, templateSequence } = this.state;
        if (currentStep >= 12) return;

        const templateBase = templateSequence[currentStep];
        const isCorrect = this.validateStep(nuc, templateBase);

        if (isCorrect) {
            // Record the placement
            this.state.placedBases[currentStep] = nuc;
            this.state.currentStep++;

            // Build feedback text
            const key = templateBase + nuc; // e.g. "AT" or "GC" (template→complement)
            const msg = this.state.data.correctMessages[key] ||
                `Correct! ${nuc} pairs with ${templateBase}.`;

            this._showFeedback(msg, 'correct');

            // Check if all 12 slots are filled
            if (this.state.currentStep >= 12) {
                this._onAllComplete();
            }
        } else {
            // Wrong choice
            const baseName = this.state.data.wrongMessages[nuc] || nuc;
            const correctBase = { A: 'Thymine', T: 'Adenine', C: 'Guanine', G: 'Cytosine' }[templateBase];
            const msg = `Wrong choice! ${baseName} does not bond with ${this.state.data.wrongMessages[templateBase] || templateBase
                }. It bonds with ${correctBase}. Try again.`;

            this._showFeedback(msg, 'wrong');
        }

        this.updateUI();
    }

    // ----------------------------------------------------------
    // _onAllComplete()
    // Called when all 12 positions are correctly filled.
    // Shows congratulations and hides the picker.
    // ----------------------------------------------------------
    _onAllComplete() {
        this.state.isLocked = false; // allow buttons but not picker
        // Override feedback with congratulations
        setTimeout(() => {
            this._showFeedback(
                'Congratulations! You have successfully synthesized the new DNA strand.',
                'correct',
                0 // no auto-close for completion message
            );
        }, this.state.config.feedbackTimeout + 300);
    }

    // ----------------------------------------------------------
    // _onShowAnswer()
    // Opens the Solution modal showing the full strand.
    // ----------------------------------------------------------
    _onShowAnswer() {
        const { templateSequence } = this.state;
        const pairMap = { A: 'T', T: 'A', C: 'G', G: 'C' };
        const cache = this.state.cache;

        // Build template row
        if (cache.solTemplate) {
            cache.solTemplate.innerHTML = '';
            templateSequence.forEach(base => {
                const div = document.createElement('div');
                div.className = `poc-dna-base ${base}`;
                div.textContent = base;
                cache.solTemplate.appendChild(div);
            });
        }

        // Build complementary row
        if (cache.solComplementary) {
            cache.solComplementary.innerHTML = '';
            templateSequence.forEach(base => {
                const comp = pairMap[base];
                const div = document.createElement('div');
                div.className = `poc-dna-base ${comp}`;
                div.textContent = comp;
                cache.solComplementary.appendChild(div);
            });
        }

        this._openModal(cache.solutionModal);
    }

    // ----------------------------------------------------------
    // _onNewTemplate()
    // Picks a random new template sequence (different from current)
    // and does a full reset.
    // ----------------------------------------------------------
    _onNewTemplate() {
        const sequences = this.state.data.sequences;
        const currentSeq = JSON.stringify(this.state.templateSequence);
        let newSeq;
        let attempts = 0;
        do {
            newSeq = sequences[Math.floor(Math.random() * sequences.length)];
            attempts++;
        } while (JSON.stringify(newSeq) === currentSeq && attempts < 10);

        this.state.templateSequence = [...newSeq];
        this.resetWidget();
    }

    // ----------------------------------------------------------
    // _onInsights()
    // Opens the Insights modal.
    // ----------------------------------------------------------
    _onInsights() {
        this._openModal(this.state.cache.insightsModal);
    }

    // ----------------------------------------------------------
    // _openModal(backdropEl) / _closeModal(backdropEl)
    // Show/hide a full-overlay modal with fade animation.
    // ----------------------------------------------------------
    _openModal(backdropEl) {
        if (!backdropEl) return;
        backdropEl.classList.remove('hidden');
        // Force reflow for transition
        void backdropEl.offsetWidth;
        backdropEl.classList.add('show');
        this.state.isLocked = true;
        this.updateUI();
    }

    _closeModal(backdropEl) {
        if (!backdropEl) return;
        backdropEl.classList.remove('show');
        backdropEl.addEventListener('transitionend', () => {
            backdropEl.classList.add('hidden');
        }, { once: true });
        this.state.isLocked = false;
        this.updateUI();
    }

    // ----------------------------------------------------------
    // _showFeedback(message, type, timeout)
    // Shows a feedback toast (green = correct, red = wrong).
    // timeout = 0 → stays until reset.
    // ----------------------------------------------------------
    _showFeedback(message, type, timeout) {
        const feedback = this.state.cache.feedback;
        if (!feedback) return;

        // Clear any existing auto-close timer
        if (this._feedbackTimer) clearTimeout(this._feedbackTimer);

        feedback.textContent = message;
        feedback.className = `poc-feedback ${type} show`;

        const hideAfter = timeout !== undefined ? timeout : this.state.config.feedbackTimeout;
        if (hideAfter > 0) {
            this._feedbackTimer = setTimeout(() => {
                this._hideFeedback();
            }, hideAfter);
        }
    }

    _hideFeedback() {
        const feedback = this.state.cache.feedback;
        if (!feedback) return;
        feedback.classList.remove('show');
        if (this._feedbackTimer) clearTimeout(this._feedbackTimer);
    }

    // ----------------------------------------------------------
    // _renderPlacedNucleotides()
    // Shows colored base labels inside the SVG drop zone boxes
    // for each slot that has been filled by the user.
    // Strategy: inject a colored <rect> + <text> inside the
    // white dashed Rectangle 228 groups.
    // ----------------------------------------------------------
    _renderPlacedNucleotides() {
        const { placedBases } = this.state;
        const colorMap = {
            A: { bg: '#00EFCE', stroke: '#04ABA5' },
            T: { bg: '#FFF700', stroke: '#DAAC15' },
            C: { bg: '#FF7FA5', stroke: '#E34772' },
            G: { bg: '#B895FF', stroke: '#9A38DB' },
        };

        // For each drop zone group, find the Rectangle 228 white dashed rect
        // and overlaid POC colored box.
        this.state.cache.dropZoneGroups.forEach((group, idx) => {
            if (!group) return;

            // Remove any previously injected POC-rendered nucleotide
            const existing = group.querySelector('.poc-placed-nuc');
            if (existing) existing.remove();

            const placed = placedBases[idx];
            if (!placed) return; // slot empty – nothing to render

            // Find the dashed Rectangle 228 path (white dashed box)
            const rectGroup = group.querySelector(`g[id^="Rectangle 228"]`);
            if (!rectGroup) return;
            const rectPath = rectGroup.querySelector('path[fill="white"]');
            if (!rectPath) return;

            // Read bounding box of the white rect to position our colored square
            // We use getBBox() which gives SVG user-space coords.
            try {
                const bbox = rectPath.getBBox();
                const colors = colorMap[placed];

                // Create a <g> with colored rect + text
                const ns = 'http://www.w3.org/2000/svg';
                const g = document.createElementNS(ns, 'g');
                g.classList.add('poc-placed-nuc');

                const rect = document.createElementNS(ns, 'rect');
                rect.setAttribute('x', bbox.x + 1);
                rect.setAttribute('y', bbox.y + 1);
                rect.setAttribute('width', bbox.width - 2);
                rect.setAttribute('height', bbox.height - 2);
                rect.setAttribute('fill', colors.bg);
                rect.setAttribute('stroke', colors.stroke);
                rect.setAttribute('stroke-width', '3');
                rect.setAttribute('rx', '2');

                const text = document.createElementNS(ns, 'text');
                text.setAttribute('x', bbox.x + bbox.width / 2);
                text.setAttribute('y', bbox.y + bbox.height / 2 + 8);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-family', 'Roboto, sans-serif');
                text.setAttribute('font-size', '22');
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('fill', '#020202');
                text.textContent = placed;

                g.appendChild(rect);
                g.appendChild(text);
                group.appendChild(g);
            } catch (e) {
                // getBBox may fail if element not rendered; safe to ignore in POC
            }
        });
    }
}

// ----------------------------------------------------------
// Single instance instantiation
// ----------------------------------------------------------
const WG121_WIDGET = new Wg121();
WG121_WIDGET.init();
