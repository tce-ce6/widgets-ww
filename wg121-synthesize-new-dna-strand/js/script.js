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
 *   - Clicking SVG tray nucleotides (A, T, G, C) at bottom selects a base
 *   - Shows/hides SVG elements for feedback, completion, overlays
 *   - Validates base-pair complementarity (A↔T, G↔C)
 *   - Demonstrates all state transitions from the wireframe
 *   - Fills complementary strand strictly left-to-right
 *   - Active slot is highlighted with a pulsing ring
 *
 * SVG ID MAPPING (from index.html analysis):
 *   Template nucleotide groups (left 3' → right 5'):
 *     Group 639 (pos 0), 637 (pos 1), 636 (pos 2), 634 (pos 3),
 *     635 (pos 4), 631 (pos 5), 630 (pos 6), 633 (pos 7),
 *     629 (pos 8), 625 (pos 9), 627 (pos 10), 628 (pos 11)
 *   Drop zone groups (complementary strand, left 5' → right 3'):
 *     Group 618 (slot 0, x≈547), 605 (x≈625), 608 (x≈704), 609 (x≈782),
 *     610 (x≈860), 611 (x≈938), 612 (x≈1017), 613 (x≈1095),
 *     614 (x≈1173), 615 (x≈1252), 616 (x≈1330), 607 (slot 11, x≈1408)
 *   Nucleotide source tray (Group 642, bottom area y≈748):
 *     Group 637_2 (A), Group 638_2 (T), Group 630_2 (C), Group 636_2 (G)
 *   Buttons:
 *     Button_Insite → Insights
 *     Group 2       → Show Answer
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
             * templateSequence: randomly generated 12-base template strand (3' → 5')
             * displayed left-to-right in the SVG.
             */
            templateSequence: this._generateRandomSequence(),

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
             * data: stores internal data
             */
            data: {
                correctMessages: {
                    'AT': 'Excellent! Adenine forms 2 hydrogen bonds with Thymine.',
                    'TA': 'Excellent! Thymine forms 2 hydrogen bonds with Adenine.',
                    'GC': 'Great job! Guanine forms 3 hydrogen bonds with Cytosine.',
                    'CG': 'Great job! Cytosine forms 3 hydrogen bonds with Guanine.',
                },
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
                feedbackTimeout: 1800,
                autoCloseFeedback: true,
            },

            /**
             * cache: cached DOM references (populated by cacheDOM)
             */
            cache: {},
        };
    }

    // ----------------------------------------------------------
    // _generateRandomSequence()
    // Returns a random 12-base sequence from A, T, G, C.
    // Called in constructor and on New Template.
    // ----------------------------------------------------------
    _generateRandomSequence() {
        const bases = ['A', 'T', 'G', 'C'];
        return Array.from({ length: 12 }, () => bases[Math.floor(Math.random() * 4)]);
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

        // ── NUCLEOTIDE SOURCE TRAY (bottom SVG groups) ───────────
        // These are the actual base image groups the user clicks
        cache.trayNucleotides = {
            A: document.getElementById('Group 637_2'),
            T: document.getElementById('Group 638_2'),
            C: document.getElementById('Group 630_2'),
            G: document.getElementById('Group 636_2'),
        };

        // ── TEMPLATE STRAND NUCLEOTIDES (left 3' → right 5') ────
        cache.templateGroups = [
            document.getElementById('Group 639'),   // pos 0
            document.getElementById('Group 637'),   // pos 1
            document.getElementById('Group 636'),   // pos 2
            document.getElementById('Group 634'),   // pos 3
            document.getElementById('Group 635'),   // pos 4
            document.getElementById('Group 631'),   // pos 5
            document.getElementById('Group 630'),   // pos 6
            document.getElementById('Group 633'),   // pos 7
            document.getElementById('Group 629'),   // pos 8
            document.getElementById('Group 625'),   // pos 9
            document.getElementById('Group 627'),   // pos 10
            document.getElementById('Group 628'),   // pos 11
        ];

        // ── COMPLEMENTARY STRAND DROP ZONES (left 5' → right 3') ─
        // Ordered by ascending x coordinate (left to right):
        // x≈547   x≈625   x≈704   x≈782   x≈860   x≈938
        // x≈1017  x≈1095  x≈1173  x≈1252  x≈1330  x≈1408
        cache.dropZoneGroups = [
            document.getElementById('Group 618'),   // slot 0  (leftmost)
            document.getElementById('Group 605'),   // slot 1
            document.getElementById('Group 608'),   // slot 2
            document.getElementById('Group 609'),   // slot 3
            document.getElementById('Group 610'),   // slot 4
            document.getElementById('Group 611'),   // slot 5
            document.getElementById('Group 612'),   // slot 6
            document.getElementById('Group 613'),   // slot 7
            document.getElementById('Group 614'),   // slot 8
            document.getElementById('Group 615'),   // slot 9
            document.getElementById('Group 616'),   // slot 10
            document.getElementById('Group 607'),   // slot 11 (rightmost)
        ];
    }

    // ----------------------------------------------------------
    // _buildPOCOverlay()
    // Creates the HTML overlay system: feedback toast, modals.
    // Tray nucleotides are SVG-native; no HTML picker is needed.
    // ----------------------------------------------------------
    _buildPOCOverlay() {
        const style = document.createElement('style');
        style.textContent = `
      /* ── POC Overlay System ─────────────────────────── */
      .poc-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 100;
      }

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
      .poc-feedback.show  { opacity: 1; pointer-events: all; }
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
      .poc-modal-backdrop.show   { opacity: 1; }
      .poc-modal-backdrop.hidden { display: none; }

      /* Modal card */
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

      /* Active slot highlight – applied to the drop-zone SVG group */
      @keyframes poc-slot-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.5; }
      }
      .poc-slot-active {
        filter:
          drop-shadow(0 0 10px rgba(255,107,0,0.95))
          drop-shadow(0 0  4px rgba(255,200,0,0.8));
        animation: poc-slot-pulse 0.9s ease-in-out infinite;
      }

      /* SVG tray nucleotide hover/active styles */
      #Group\\ 637_2, #Group\\ 638_2, #Group\\ 630_2, #Group\\ 636_2 {
        cursor: pointer;
        transition: opacity 0.15s, transform 0.15s;
        transform-origin: center;
        transform-box: fill-box;
      }
      #Group\\ 637_2:hover, #Group\\ 638_2:hover,
      #Group\\ 630_2:hover, #Group\\ 636_2:hover {
        opacity: 0.82;
        transform: scale(1.06);
      }
      #Group\\ 637_2.tray-disabled, #Group\\ 638_2.tray-disabled,
      #Group\\ 630_2.tray-disabled, #Group\\ 636_2.tray-disabled {
        cursor: default;
        opacity: 0.35;
        pointer-events: none;
      }

      /* Make SVG action buttons look clickable */
      #Button_Insite, #Group\\ 2, #Group\\ 712, #Group\\ 1621 {
        cursor: pointer;
      }
    `;
        document.head.appendChild(style);

        const svgContainerEl = document.querySelector('.svg-container');
        if (!svgContainerEl) return;
        svgContainerEl.style.position = 'relative';
        svgContainerEl.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.className = 'poc-overlay';

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
          A↔T (2 hydrogen bonds) &nbsp;|&nbsp; G↔C (3 hydrogen bonds)
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
            <li><strong>Base Pairing Rule:</strong> Guanine (G) pairs with Cytosine (C) via <strong>3 hydrogen bonds</strong>.</li>
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

        // Store overlay references
        this.state.cache.overlay = overlay;
        this.state.cache.feedback = feedback;
        this.state.cache.solutionModal = solutionBackdrop;
        this.state.cache.insightsModal = insightsBackdrop;
        this.state.cache.solTemplate = document.getElementById('poc-sol-template');
        this.state.cache.solComplementary = document.getElementById('poc-sol-complementary');
    }

    // ----------------------------------------------------------
    // bindEvents()
    // Attaches all event listeners.
    // ----------------------------------------------------------
    bindEvents() {
        const cache = this.state.cache;

        // ── SVG Tray Nucleotides (A, T, G, C at bottom) ─────────
        Object.entries(cache.trayNucleotides).forEach(([nuc, el]) => {
            if (!el) return;
            el.addEventListener('click', () => this._onNucleotideSelected(nuc));
        });

        // ── SVG Action Buttons ───────────────────────────────────
        if (cache.btnShowAnswer) {
            cache.btnShowAnswer.style.cursor = 'pointer';
            cache.btnShowAnswer.addEventListener('click', () => this._onShowAnswer());
        }
        if (cache.btnNewTemplate) {
            cache.btnNewTemplate.style.cursor = 'pointer';
            cache.btnNewTemplate.addEventListener('click', () => this._onNewTemplate());
        }
        if (cache.btnReset) {
            cache.btnReset.style.cursor = 'pointer';
            cache.btnReset.addEventListener('click', () => this.resetWidget());
        }
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
    // ----------------------------------------------------------
    updateUI() {
        const { currentStep, isLocked } = this.state;
        const cache = this.state.cache;

        // Enable / disable tray nucleotides
        const allFilled = currentStep >= 12;
        Object.values(cache.trayNucleotides).forEach(el => {
            if (!el) return;
            el.classList.toggle('tray-disabled', allFilled || isLocked);
        });

        // Update template labels in SVG
        this.updateText();

        // Highlight the current active slot
        this._updateActiveSlotHighlight();

        // Render placed complementary bases
        this._renderPlacedNucleotides();

        // Render hydrogen-bond lines in the dedicated SVG overlay layer
        this._renderHBonds();
    }

    // ----------------------------------------------------------
    // _getWorkingGroup(group)
    // Returns the narrowest SVG group that owns only THIS slot's
    // content (backbone shapes + nucleotide box).
    //
    // Background: in the exported SVG, Group 607 (slot 11) is a
    // master container that nests ALL comp groups (Group 617 …
    // Group 618) as descendants.  Calling querySelectorAll on
    // Group 607 directly would leak into every sibling slot, so
    // we scope our work to the immediate parent of Rectangle 228
    // (= Group 617 for slot 11, = the cached group itself for
    // every other slot).
    // ----------------------------------------------------------
    _getWorkingGroup(group) {
        if (!group) return group;
        const rectGroup = group.querySelector('g[id^="Rectangle 228"]');
        return (rectGroup && rectGroup.parentElement) || group;
    }

    // ----------------------------------------------------------
    // _updateActiveSlotHighlight()
    // Applies the orange glow + pulsing animation CSS class to the
    // current active drop-zone group and orange stroke to its
    // dashed placeholder rectangle.
    // Removes the highlight from all other slots.
    // ----------------------------------------------------------
    _updateActiveSlotHighlight() {
        const { currentStep, isLocked } = this.state;
        const groups = this.state.cache.dropZoneGroups;

        groups.forEach((group, idx) => {
            if (!group) return;

            // Scope to this slot's own working group so the glow
            // never bleeds into the sibling comp groups for slot 11.
            const wg = this._getWorkingGroup(group);

            const isActive = (idx === currentStep) && currentStep < 12 && !isLocked;
            wg.classList.toggle('poc-slot-active', isActive);

            // Swap the dashed-rect stroke colour to orange on the active slot
            const dashedPath = wg.querySelector('g[id^="Rectangle 228"] path:last-child');
            if (dashedPath) {
                if (isActive) {
                    dashedPath.setAttribute('stroke', '#FF6B00');
                    dashedPath.setAttribute('stroke-width', '3');
                } else {
                    dashedPath.setAttribute('stroke', 'black');
                    dashedPath.setAttribute('stroke-width', '2');
                }
            }
        });
    }

    // ----------------------------------------------------------
    // validateStep(nucPlaced, templateBase)
    // Returns true if the placed nucleotide correctly pairs
    // with the current template base. A↔T, G↔C
    // ----------------------------------------------------------
    validateStep(nucPlaced, templateBase) {
        const pairMap = { A: 'T', T: 'A', G: 'C', C: 'G' };
        return pairMap[templateBase] === nucPlaced;
    }

    // ----------------------------------------------------------
    // handleAnimation()
    // Placeholder for Lottie/CSS animation control.
    // ----------------------------------------------------------
    handleAnimation(animationName, action = 'play') {
        console.log(`[Wg121] handleAnimation: ${animationName} → ${action}`);
    }

    // ----------------------------------------------------------
    // updateText()
    // Updates SVG text elements that hold template base labels.
    //
    // textIds are ordered LEFT-TO-RIGHT visually (visual pos 0..11).
    // seq[0] → leftmost template nucleotide (3' end visual pos 0).
    // seq[11] → rightmost (5' end visual pos 11).
    //
    // Many XD-exported text elements carry transform="matrix(-1 0 0 1 tx ty)"
    // (a horizontal flip). We replace this with a neutral translate so that
    // all letters — including asymmetric G and C — render upright.
    // ----------------------------------------------------------
    updateText() {
        const seq = this.state.templateSequence;

        // Correct left→right visual order (pos 0 = leftmost = 3' end).
        // Previously this array was reversed, causing seq[k] to appear
        // at the wrong visual position and mismatching the complementary row.
        const textIds = [
            'T_4',  // visual pos  0 (leftmost,  Group 628, x≈543)
            'A_3',  // visual pos  1             Group 627
            'C_2',  // visual pos  2             Group 625
            'A_2',  // visual pos  3             Group 629
            'G_3',  // visual pos  4             Group 633
            'C',    // visual pos  5             Group 630
            'T_3',  // visual pos  6             Group 631
            'G_2',  // visual pos  7             Group 635
            'T_2',  // visual pos  8             Group 634
            'G',    // visual pos  9             Group 636
            'A',    // visual pos 10             Group 637
            'T',    // visual pos 11 (rightmost, Group 639, x≈1404)
        ];

        const colorMap = {
            A: { bg: '#00EFCE', stroke: '#04ABA5' },
            T: { bg: '#FFF700', stroke: '#DAAC15' },
            C: { bg: '#FF7FA5', stroke: '#E34772' },
            G: { bg: '#B895FF', stroke: '#9A38DB' },
        };

        textIds.forEach((textId, idx) => {
            const textEl = document.getElementById(textId);
            if (!textEl) return;
            const base = seq[idx];
            if (!base) return;

            // ── 1. Update letter content ──────────────────────────
            const tspan = textEl.querySelector('tspan');
            if (!tspan) return;
            tspan.textContent = base;

            // ── 2. Fix orientation: remove any horizontal flip ────
            // XD exported some text elements with matrix(-1 0 0 1 tx ty).
            // This mirrors glyphs, which is fine for T (symmetric) but
            // renders G as Э and C as ɔ. We neutralise the flip by:
            //   • finding the background rect's bounding box
            //   • placing the text at the rect's visual centre
            //   • using text-anchor="middle" + dominant-baseline="central"
            const parentGroup = textEl.closest('g');
            const parentParent = parentGroup && parentGroup.closest('g[id^="Group"]');
            const rectGroup = parentParent && parentParent.querySelector('g[id^="Rectangle 229"]');
            if (!rectGroup) return;

            const fillPath = rectGroup.querySelector('path');
            if (fillPath) {
                try {
                    const bb = fillPath.getBBox();
                    const cx = bb.x + bb.width / 2;
                    const cy = bb.y + bb.height / 2;

                    // Replace flip matrix with a plain translate to the centre.
                    textEl.setAttribute('transform', `translate(${cx}, ${cy})`);
                    textEl.setAttribute('text-anchor', 'middle');
                    textEl.setAttribute('dominant-baseline', 'central');
                    tspan.setAttribute('x', '0');
                    tspan.setAttribute('y', '0');
                } catch (_) {
                    // getBBox unavailable (e.g. hidden element); strip flip only.
                    const t = textEl.getAttribute('transform') || '';
                    if (t.includes('matrix(-1')) {
                        const m = t.match(/matrix\(-1 0 0 1 ([\d.]+) ([\d.]+)\)/);
                        if (m) {
                            textEl.setAttribute('transform', `translate(${m[1]}, ${m[2]})`);
                            textEl.setAttribute('text-anchor', 'middle');
                            tspan.setAttribute('x', '0');
                        }
                    }
                }
            }

            // ── 3. Update background rectangle colour ────────────
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
    // ----------------------------------------------------------
    updateImage(svgImageId, newHref) {
        const imgEl = document.getElementById(svgImageId);
        if (!imgEl) return;
        imgEl.setAttribute('href', newHref);
    }

    // ----------------------------------------------------------
    // resetWidget()
    // Resets complementary strand to empty, keeps template.
    // ----------------------------------------------------------
    resetWidget() {
        this.state.currentStep = 0;
        this.state.placedBases = new Array(12).fill(null);
        this.state.isLocked = false;

        this._hideFeedback();
        this._closeModal(this.state.cache.solutionModal);
        this._closeModal(this.state.cache.insightsModal);

        this.updateUI();
    }

    // ----------------------------------------------------------
    // _onNucleotideSelected(nuc)
    // Called when user clicks a tray base (A/T/G/C).
    // Correct choice → animate the tray nucleotide flying into
    // the active slot, then commit the placement.
    // Wrong choice  → show feedback immediately (no animation).
    // ----------------------------------------------------------
    _onNucleotideSelected(nuc) {
        if (this.state.isLocked) return;
        const { currentStep, templateSequence } = this.state;
        if (currentStep >= 12) return;

        const templateBase = templateSequence[currentStep];
        const isCorrect = this.validateStep(nuc, templateBase);

        if (isCorrect) {
            // Lock during animation so double-clicks are ignored
            this.state.isLocked = true;
            this.updateUI(); // disable tray immediately

            this._animateTrayToSlot(nuc, currentStep, () => {
                // Commit placement after animation completes
                this.state.placedBases[currentStep] = nuc;
                this.state.currentStep++;
                this.state.isLocked = false;

                const key = templateBase + nuc;
                const msg = this.state.data.correctMessages[key] ||
                    `Correct! ${nuc} pairs with ${templateBase}.`;
                this._showFeedback(msg, 'correct');

                if (this.state.currentStep >= 12) {
                    this._onAllComplete();
                }
                this.updateUI();
            });
        } else {
            const baseName = this.state.data.wrongMessages[nuc] || nuc;
            const correctName = this.state.data.wrongMessages[
                { A: 'T', T: 'A', G: 'C', C: 'G' }[templateBase]
            ] || '';
            const msg = `Wrong! ${baseName} does not pair here. Try ${correctName}.`;
            this._showFeedback(msg, 'wrong');
            this.updateUI();
        }
    }

    // ----------------------------------------------------------
    // _animateTrayToSlot(nuc, slotIdx, onComplete)
    // Resolves precise screen-space bounding boxes for both the
    // tray nucleotide square (Rectangle 229 inside the tray group)
    // and the target complementary-slot rectangle (Rectangle 228),
    // then flies an HTML clone from tray → slot with a smooth
    // CSS transition.  Calls onComplete() when the clone is gone.
    // ----------------------------------------------------------
    _animateTrayToSlot(nuc, slotIdx, onComplete) {
        const trayEl = this.state.cache.trayNucleotides[nuc];
        const slotGroup = this.state.cache.dropZoneGroups[slotIdx];

        if (!trayEl || !slotGroup) { onComplete(); return; }

        // ── Resolve source rect: prefer the nucleotide square (Rectangle 229) ──
        const trayRectGroup = trayEl.querySelector('g[id^="Rectangle 229"]');
        const trayBgPath = trayRectGroup
            ? trayRectGroup.querySelector('path')
            : trayEl.querySelector('path');
        const fromEl = trayBgPath || trayRectGroup || trayEl;
        const fromRect = fromEl.getBoundingClientRect();

        // ── Resolve destination rect: the white-fill path of Rectangle 228 ──
        const slotRectGroup = slotGroup.querySelector('g[id^="Rectangle 228"]');
        const slotBgPath = slotRectGroup
            ? slotRectGroup.querySelector('path')
            : slotGroup.querySelector('path');
        const toEl = slotBgPath || slotRectGroup || slotGroup;
        const toRect = toEl.getBoundingClientRect();

        // Fallback: if either rect is zero-size, skip animation
        if (!fromRect.width || !toRect.width) { onComplete(); return; }

        const nucColors = { A: '#00EFCE', T: '#FFF700', C: '#FF7FA5', G: '#B895FF' };
        const nucStrokes = { A: '#04ABA5', T: '#DAAC15', C: '#E34772', G: '#9A38DB' };

        // ── Build the flying clone ──
        const sz = Math.max(fromRect.width, fromRect.height);
        const clone = document.createElement('div');
        Object.assign(clone.style, {
            position: 'fixed',
            left: `${fromRect.left + fromRect.width / 2 - sz / 2}px`,
            top: `${fromRect.top + fromRect.height / 2 - sz / 2}px`,
            width: `${sz}px`,
            height: `${sz}px`,
            background: nucColors[nuc],
            border: `3px solid ${nucStrokes[nuc]}`,
            borderRadius: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Roboto, sans-serif',
            fontSize: `${Math.round(sz * 0.48)}px`,
            fontWeight: 'bold',
            color: '#020202',
            zIndex: '9999',
            pointerEvents: 'none',
            boxShadow: '0 6px 22px rgba(0,0,0,0.40)',
            willChange: 'transform, opacity',
        });
        clone.textContent = nuc;
        document.body.appendChild(clone);

        // Scale to match landing slot size, capped so it never grows
        const toSz = Math.max(toRect.width, toRect.height);
        const scaleFactor = Math.min((toSz / sz) * 0.9, 1);

        // Translation: clone centre → slot rect centre
        const dx = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2);
        const dy = (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2);

        // Start the flight on the next rendered frame
        requestAnimationFrame(() => {
            clone.style.transition = 'transform 0.50s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.50s';
            clone.style.transform = `translate(${dx}px,${dy}px) scale(${scaleFactor})`;
        });

        // Fade out and call back once the clone reaches the slot
        setTimeout(() => {
            clone.style.transition = 'opacity 0.18s ease-in';
            clone.style.opacity = '0';
            setTimeout(() => {
                if (clone.parentNode) clone.parentNode.removeChild(clone);
                onComplete();
            }, 180);
        }, 500);
    }

    // ----------------------------------------------------------
    // _onAllComplete()
    // Called when all 12 positions are correctly filled.
    // ----------------------------------------------------------
    _onAllComplete() {
        this.state.isLocked = false;
        setTimeout(() => {
            this._showFeedback(
                'Congratulations! You have successfully synthesized the new DNA strand.',
                'correct',
                0
            );
        }, this.state.config.feedbackTimeout + 300);
    }

    // ----------------------------------------------------------
    // _onShowAnswer()
    // Opens the Solution modal.
    // ----------------------------------------------------------
    _onShowAnswer() {
        const { templateSequence } = this.state;
        const pairMap = { A: 'T', T: 'A', G: 'C', C: 'G' };
        const cache = this.state.cache;

        if (cache.solTemplate) {
            cache.solTemplate.innerHTML = '';
            templateSequence.forEach(base => {
                const div = document.createElement('div');
                div.className = `poc-dna-base ${base}`;
                div.textContent = base;
                cache.solTemplate.appendChild(div);
            });
        }

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
    // Generates a brand-new random sequence and resets.
    // ----------------------------------------------------------
    _onNewTemplate() {
        this.state.templateSequence = this._generateRandomSequence();
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
    // _openModal / _closeModal
    // ----------------------------------------------------------
    _openModal(backdropEl) {
        if (!backdropEl) return;
        backdropEl.classList.remove('hidden');
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
    // _showFeedback / _hideFeedback
    // ----------------------------------------------------------
    _showFeedback(message, type, timeout) {
        const feedback = this.state.cache.feedback;
        if (!feedback) return;
        if (this._feedbackTimer) clearTimeout(this._feedbackTimer);

        feedback.textContent = message;
        feedback.className = `poc-feedback ${type} show`;

        const hideAfter = timeout !== undefined ? timeout : this.state.config.feedbackTimeout;
        if (hideAfter > 0) {
            this._feedbackTimer = setTimeout(() => this._hideFeedback(), hideAfter);
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
    // For each complementary slot:
    //   • Empty slot  → restore the white-fill box, dashed border,
    //                   and dashed backbone lines/shapes.
    //   • Filled slot → recolor the nucleotide box (existing SVG path),
    //                   hide the dashed border, fill the backbone
    //                   shapes and connecting lines with red to match
    //                   the template-strand style, and inject a letter.
    //
    // SCOPING NOTE: Group 607 (slot 11) in the exported SVG is a master
    // container that nests all other comp groups as descendants.
    // We always work relative to _getWorkingGroup() — the immediate
    // parent of Rectangle 228 — so that querySelectorAll never
    // escapes into sibling slots.
    // ----------------------------------------------------------
    _renderPlacedNucleotides() {
        const { placedBases } = this.state;

        const colorMap = {
            A: { bg: '#00EFCE', stroke: '#04ABA5' },
            T: { bg: '#FFF700', stroke: '#DAAC15' },
            C: { bg: '#FF7FA5', stroke: '#E34772' },
            G: { bg: '#B895FF', stroke: '#9A38DB' },
        };
        const ns = 'http://www.w3.org/2000/svg';

        this.state.cache.dropZoneGroups.forEach((group, idx) => {
            if (!group) return;

            // Rectangle 228 group: contains bgPath (fill=white) + borderPath (dashed)
            const rectGroup = group.querySelector('g[id^="Rectangle 228"]');
            if (!rectGroup) return;

            const paths = rectGroup.querySelectorAll('path');
            const bgPath = paths[0];   // white fill background
            const borderPath = paths[1];   // dashed border
            if (!bgPath) return;

            // Scope all DOM work to this slot's own group — avoids the
            // Group 607 container leaking into nested sibling slots.
            const wg = this._getWorkingGroup(group);

            // Remove any letter injected on a previous render pass
            wg.querySelectorAll('.poc-base-letter').forEach(el => el.remove());

            const placed = placedBases[idx];

            if (!placed) {
                // ── Reset nucleotide box ──
                bgPath.setAttribute('fill', 'white');
                bgPath.removeAttribute('stroke');
                bgPath.removeAttribute('stroke-width');
                if (borderPath) borderPath.style.display = '';

                // ── Reset backbone: dashed lines + white/black shapes ──
                wg.querySelectorAll('path').forEach(p => {
                    if (rectGroup.contains(p)) return;
                    const st = p.getAttribute('stroke');
                    const fl = p.getAttribute('fill');
                    if (st === '#5F1313') {
                        p.setAttribute('stroke', 'black');
                        p.setAttribute('stroke-dasharray', '8 4');
                    }
                    if (fl === '#E97373') p.setAttribute('fill', 'white');
                    if (fl === '#B51616') p.setAttribute('fill', 'black');
                });
                return;
            }

            // ── Fill nucleotide box with nucleotide color ──
            const colors = colorMap[placed];
            bgPath.setAttribute('fill', colors.bg);
            bgPath.setAttribute('stroke', colors.stroke);
            bgPath.setAttribute('stroke-width', '3');
            if (borderPath) borderPath.style.display = 'none';

            // ── Fill backbone connecting lines & shapes red ──
            // Matches the visual style of the template-strand backbone.
            //   Connecting lines:  stroke → #5F1313 (solid dark red)
            //   Shape fill=white → #E97373 (pink/red sugar body)
            //   Shape fill=black → #B51616 (dark-red sugar shadow)
            wg.querySelectorAll('path').forEach(p => {
                if (rectGroup.contains(p)) return;
                const st = p.getAttribute('stroke');
                const fl = p.getAttribute('fill');
                // Connecting lines have a stroke and no fill
                if (st && !fl) {
                    p.setAttribute('stroke', '#5F1313');
                    p.removeAttribute('stroke-dasharray');
                }
                if (fl === 'white' || fl === '#E97373') p.setAttribute('fill', '#E97373');
                if (fl === 'black' || fl === '#B51616') p.setAttribute('fill', '#B51616');
            });

            // ── Inject letter text, centered in the nucleotide box ──
            try {
                const bb = bgPath.getBBox();
                const text = document.createElementNS(ns, 'text');
                text.classList.add('poc-base-letter');
                text.setAttribute('x', String(bb.x + bb.width / 2));
                text.setAttribute('y', String(bb.y + bb.height / 2));
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'central');
                text.setAttribute('font-family', 'Roboto, sans-serif');
                text.setAttribute('font-size', '22');
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('fill', '#020202');
                text.setAttribute('pointer-events', 'none');
                text.textContent = placed;
                wg.appendChild(text);
            } catch (_) { }
        });
    }

    // ----------------------------------------------------------
    // _renderHBonds()
    // Redraws all hydrogen-bond lines in a dedicated <g> layer
    // appended directly to the SVG root so it renders above
    // both template and complementary rows.
    //
    // H-bonds are drawn as vertical short horizontal lines in
    // the ~27 px gap between the template rect bottom (y=378)
    // and the complementary rect top (y=405):
    //   A↔T → 2 parallel lines
    //   G↔C → 3 parallel lines
    //
    // The horizontal centre of each bond set is computed from the
    // comp-row whitePath's getBBox (exact SVG user-space x).
    // ----------------------------------------------------------
    _renderHBonds() {
        const { placedBases, templateSequence } = this.state;
        const svg = this.state.cache.svgContainer;
        if (!svg) return;

        // Remove previous H-bond layer completely
        svg.querySelectorAll('.poc-hbonds-layer').forEach(el => el.remove());

        const bondCount = { AT: 2, TA: 2, GC: 3, CG: 3 };

        // Fixed vertical gap in SVG user-space coordinates
        const TEMPLATE_BOTTOM = 378;
        const COMP_TOP = 405;
        const GAP = COMP_TOP - TEMPLATE_BOTTOM; // 27 px

        // Fallback cx table: (left_x + right_x) / 2 measured from each
        // comp slot's Rectangle 228 path in the exported SVG.
        // Slot order: 0(G618)…10(G616), 11(G607)
        const fallbackCX = [543, 621, 699, 778, 856, 934, 1013, 1091, 1169, 1248, 1326, 1404];

        const ns = 'http://www.w3.org/2000/svg';
        const layer = document.createElementNS(ns, 'g');
        layer.classList.add('poc-hbonds-layer');
        layer.setAttribute('pointer-events', 'none');

        this.state.cache.dropZoneGroups.forEach((group, idx) => {
            const placed = placedBases[idx];
            if (!placed || !group) return;

            const templateBase = templateSequence[idx];
            const bonds = bondCount[templateBase + placed] || 0;
            if (!bonds) return;

            // Derive horizontal centre from the filled background path.
            // Use _getWorkingGroup so slot 11 (Group 607 container) scopes
            // correctly to Group 617's own Rectangle 228.
            const wg = this._getWorkingGroup(group);
            const rectGroup = wg.querySelector('g[id^="Rectangle 228"]');
            const bgPath = rectGroup && rectGroup.querySelector('path');

            let cx = fallbackCX[idx];
            if (bgPath) {
                try {
                    const bb = bgPath.getBBox();
                    if (bb.width > 0) cx = bb.x + bb.width / 2;
                } catch (_) { }
            }

            // Draw VERTICAL bond indicators running from template bottom
            // to comp top, spaced evenly around the slot centre.
            //   2 bonds (A-T): two lines at cx ± bondSpacing/2
            //   3 bonds (G-C): three lines at cx-bondSpacing, cx, cx+bondSpacing
            const bondSpacing = 7;   // px between adjacent bond lines
            const lineY1 = TEMPLATE_BOTTOM + 3;   // slight inset below template
            const lineY2 = COMP_TOP        - 3;   // slight inset above comp

            for (let b = 0; b < bonds; b++) {
                const xOffset = (b - (bonds - 1) / 2) * bondSpacing;
                const lx = cx + xOffset;
                const ln = document.createElementNS(ns, 'line');
                ln.setAttribute('x1', String(lx));
                ln.setAttribute('x2', String(lx));
                ln.setAttribute('y1', String(lineY1));
                ln.setAttribute('y2', String(lineY2));
                ln.setAttribute('stroke', '#5F1313');
                ln.setAttribute('stroke-width', '2.5');
                ln.setAttribute('stroke-linecap', 'round');
                layer.appendChild(ln);
            }
        });

        svg.appendChild(layer);
    }
}

// ----------------------------------------------------------
// Single instance instantiation
// ----------------------------------------------------------
const WG121_WIDGET = new Wg121();
WG121_WIDGET.init();
