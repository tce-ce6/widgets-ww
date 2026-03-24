/**
 * Lac Operon Regulation Interactive Widget - Complete JavaScript
 * CBSE Class 12 Biology - Chapter 1: Molecular Basis of Inheritance
 * Includes animations, state management, toggle logic, and modal functionality
 */

// ==================== STATE MANAGEMENT ====================

const state = {
  hasStarted: false,
  inducerPresent: false,
  animationInProgress: false,
  isLooping: false
};

// ==================== DOM REFERENCES ====================

const svg = document.querySelector('svg');
const container = document.getElementById('svg-container');

// Get button elements - will be initialized after DOM is ready
let startBtn = null;
let resetBtn = null;
let insightsBtn = null;

function initializeButtonReferences() {
  startBtn = document.querySelector('#Start')?.parentElement || document.querySelector('#Group_5921');
  resetBtn = document.querySelector('#Reset')?.parentElement || document.querySelector('#Group_5931');
  insightsBtn = document.querySelector('#Insights')?.closest('#Group_591') || document.querySelector('#Group_591');
}

// References to gene labels
const genes = {
  i: document.getElementById('i'),
  p: document.getElementById('p'),
  o: document.getElementById('o'),
  z: document.getElementById('z'),
  y: document.getElementById('y'),
  a: document.getElementById('a'),
  p_2: document.getElementById('p_2')
};

// References to gene boxes (colored rectangles in Lac operon: p, i, p, o, z, y, a)
const geneBoxes = {
  p_first: document.getElementById('Rectangle_2'),
  i: document.getElementById('Rectangle_3'),
  p_promoter: document.getElementById('Rectangle_4'),
  o: document.getElementById('Rectangle_5'),
  z: document.getElementById('Rectangle_6'),
  y: document.getElementById('Rectangle_7'),
  a: document.getElementById('Rectangle_8')
};

// Instruction text (inside I-text group)
const instructionText = document.getElementById('I-text');
const lacOperonLabel = document.getElementById('Lac_operon');

// SVG elements shown/hidden by state (class st767 = display:none)
const svgElements = {
  Transcription: () => document.getElementById('Transcription'),
  Repressor_mRNA: () => document.getElementById('Repressor_mRNA'),
  Path_1035: () => document.getElementById('Path_1035'),
  Path_1040: () => document.getElementById('Path_1040'),
  Translation: () => document.getElementById('Translation'),
  Path_1036: () => document.getElementById('Path_1036'),
  Ellipse_3: () => document.getElementById('Ellipse_3'),
  Ellipse_4: () => document.getElementById('Ellipse_4'),
  Inducer: () => document.getElementById('Inducer'),
  Repressor_Inactive_: () => document.getElementById('Repressor_Inactive_'),
  Path_1034: () => document.getElementById('Path_1034'),
  'Transcription-2': () => document.getElementById('Transcription-2'),
  lac_mRNA: () => document.getElementById('lac_mRNA'),
  Path_1041: () => document.getElementById('Path_1041'),
  'Translation-2': () => document.getElementById('Translation-2'),
  Group_604: () => document.getElementById('Group_604'),
  Group_605: () => document.getElementById('Group_605'),
  Group_606: () => document.getElementById('Group_606'),
  Path_10341: () => document.getElementById('Path_10341'),
  No_enzyme_card: () => document.getElementById('No_enzyme_card'),
  Repressor_on_operator: () => document.getElementById('Repressor_on_operator')
};

function showSvgElement(key) {
  const el = typeof svgElements[key] === 'function' ? svgElements[key]() : key;
  if (el) el.classList.remove('st767');
}

function hideSvgElement(key) {
  const el = typeof svgElements[key] === 'function' ? svgElements[key]() : key;
  if (el) el.classList.add('st767');
}

// ==================== INITIALIZATION ====================

function init() {
  initializeButtonReferences();
  setupEventListeners();
  setupTooltips();
  setInitialState();
  console.log('Lac Operon widget initialized', { startBtn, resetBtn, insightsBtn });
}

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
  // Add event delegation on the SVG container for all button clicks
  if (svg) {
    svg.addEventListener('click', (e) => {
      const target = e.target;
      const parentGroup = target.closest('g');
      const grandparentGroup = parentGroup?.parentElement?.closest('g');
      
      // Check if clicked on Start button - look for "Start" text element or Group_592 parent
      if (parentGroup?.id === 'Start' || grandparentGroup?.id === 'Group_5921') {
        e.stopPropagation();
        e.preventDefault();
        handleStartClick();
        return;
      }
      
      // Check if clicked on Reset button - look for "Reset" text element or Group_593 parent
      if (parentGroup?.id === 'Reset' || grandparentGroup?.id === 'Group_5931') {
        e.stopPropagation();
        e.preventDefault();
        handleResetClick();
        return;
      }
      
      // Check if clicked on Insights button - look for "Insights" text element or Group_591 parent
      if (parentGroup?.id === 'Insights' || grandparentGroup?.id === 'Group_591') {
        e.stopPropagation();
        e.preventDefault();
        handleInsightsClick();
        return;
      }
      
      // Check if clicked on toggle switch (Group_595)
      if (parentGroup?.id === 'Group_595' || grandparentGroup?.id === 'Group_595') {
        e.stopPropagation();
        e.preventDefault();
        handleToggleClick();
        return;
      }
    });
  }

  // Direct listeners on button groups for extra reliability
  const startGroup = document.querySelector('#Group_592');
  if (startGroup) {
    startGroup.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      handleStartClick();
    });
    startGroup.style.cursor = 'pointer';
    startGroup.style.pointerEvents = 'auto';
  }

  const resetGroup = document.querySelector('#Group_593');
  if (resetGroup) {
    resetGroup.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      handleResetClick();
    });
    resetGroup.style.cursor = 'pointer';
    resetGroup.style.pointerEvents = 'auto';
  }

  const insightsGroup = document.querySelector('#Group_591');
  if (insightsGroup) {
    insightsGroup.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      handleInsightsClick();
    });
    insightsGroup.style.cursor = 'pointer';
    insightsGroup.style.pointerEvents = 'auto';
  }

  // Inducer Toggle Switch
  setupToggleSwitch();
}

function setupToggleSwitch() {
  // Find the toggle switch container
  const toggleGroup = document.querySelector('#Group_595');
  if (toggleGroup) {
    toggleGroup.style.cursor = 'pointer';
    toggleGroup.style.pointerEvents = 'auto';
    
    const clickHandler = (e) => {
      e.stopPropagation();
      handleToggleClick();
    };
    
    toggleGroup.addEventListener('click', clickHandler);
    
    // Also add listener to all child elements
    toggleGroup.querySelectorAll('*').forEach(el => {
      el.style.pointerEvents = 'auto';
      el.addEventListener('click', clickHandler);
    });
  }
}

// ==================== STATE & INITIAL SETUP ====================

function setInitialState() {
  state.hasStarted = false;
  state.inducerPresent = false;
  state.animationInProgress = false;
  state.isLooping = false;

  // Show instruction text
  if (instructionText) {
    instructionText.style.display = '';
    instructionText.classList.remove('st767');
  }
  const iText = document.getElementById('Tap_Start_to_initiate_i_gene_s_expression_');
  if (iText) iText.classList.remove('st767');

  // Hide all pathway/state SVG elements
  hidePathwaySvgElements();
  hideDynamicElements();

  // Reset toggle to OFF position and disable until Start
  updateToggleUI(false);
  setToggleEnabled(false);
}

function setToggleEnabled(enabled) {
  const toggleGroup = document.querySelector('#Group_595');
  if (toggleGroup) {
    toggleGroup.style.pointerEvents = enabled ? 'auto' : 'none';
    toggleGroup.style.opacity = enabled ? '1' : '0.5';
  }
}

function hidePathwaySvgElements() {
  const keys = [
    'Transcription', 'Repressor_mRNA', 'Path_1035', 'Path_1040',
    'Translation', 'Path_1036', 'Ellipse_3', 'Ellipse_4', 'Inducer',
    'Repressor_Inactive_', 'Path_1034', 'Transcription-2', 'lac_mRNA',
    'Path_1041', 'Translation-2', 'Group_604', 'Group_605', 'Group_606',
    'No_enzyme_card', 'Repressor_on_operator',"Path_10341"
  ];
  keys.forEach(k => hideSvgElement(k));
}

function hideDynamicElements() {
  // Remove any previously created dynamic elements
  document.querySelectorAll('[data-dynamic="true"]').forEach(el => el.remove());

  // Hide mRNA, enzymes, repressor, etc.
  const dynamicIds = [
    'transcription-label',
    'transcription-arrow',
    'translation-label',
    'translation-arrow',
    'repressor-mRNA-text',
    'repressor-mRNA-wavy',
    'repressor-mRNA-wavy-line',
    'repressor-icon',
    'repressor-icon-oval',
    'inducer-icon',
    'rna-polymerase-icon',
    'lac-mRNA-strand',
    'lac-mRNA-text',
    'beta-galactosidase-label',
    'permease-label',
    'transacetylase-label',
    'enzyme-icon-z',
    'enzyme-icon-y',
    'enzyme-icon-a',
    'no-enzyme-text',
    'operator-binding-highlight',
    'repressor-binding-line'
  ];

  dynamicIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  // Reset gene box glows
  Object.values(geneBoxes).forEach(box => {
    if (box) box.style.filter = 'none';
  });
}

// ==================== START BUTTON HANDLER ====================

async function handleStartClick() {
  if (state.animationInProgress || state.hasStarted) return;

  state.animationInProgress = true;
  state.hasStarted = true;

  // Hide instruction text
  if (instructionText) instructionText.style.display = 'none';
  const iText = document.getElementById('Tap_Start_to_initiate_i_gene_s_expression_');
  if (iText) iText.classList.add('st767');

  // Reveal i gene pathway using existing SVG elements
  await animateIGeneTranscription();
  await animateRepressorTranslation();

  // Stop here in the "pathway only" state (no operator-bound repressor yet)
  updateToggleUI(false);
  setToggleEnabled(true);

  state.animationInProgress = false;
}

// ==================== START ANIMATION SEQUENCES ====================

async function animateIGeneTranscription() {
  const iGeneBox = geneBoxes.i;
  if (iGeneBox) {
    iGeneBox.style.transition = 'filter 0.3s ease';
    iGeneBox.style.filter = 'drop-shadow(0 0 8px rgba(255, 200, 0, 0.9))';
  }

  showSvgElement('Transcription');
  await delay(400);
  showSvgElement('Path_1035');
  showSvgElement('Path_1040');
  showSvgElement('Repressor_mRNA');
  await delay(1200);
  if (iGeneBox) iGeneBox.style.filter = 'none';
}

async function animateRepressorTranslation() {
  showSvgElement('Translation');
  showSvgElement('Path_1036');
  showSvgElement('Ellipse_3');
  await delay(800);
}

// ==================== TOGGLE SWITCH HANDLER ====================

async function handleToggleClick() {
  if (state.animationInProgress || !state.hasStarted) return;

  state.inducerPresent = !state.inducerPresent;
  state.animationInProgress = true;

  updateToggleUI(state.inducerPresent);

  if (state.inducerPresent) {
    await activateInducerState();
  } else {
    await deactivateInducerState();
  }

  state.animationInProgress = false;
}

async function activateInducerState() {
  const operatorBox = geneBoxes.o;
  state.isLooping = false;

  // Repressor leaves operator: hide repressor-on-operator and No Enzyme card
  hideSvgElement('Repressor_on_operator');
  hideSvgElement('No_enzyme_card');
  if (operatorBox) operatorBox.style.filter = 'none';

  // Show inducer bound to repressor and "Repressor (Inactive)"
  showSvgElement('Ellipse_4');
  showSvgElement('Inducer');
  showSvgElement('Repressor_Inactive_');

  // Show right-hand pathway: lac mRNA and three enzymes
  showSvgElement('Transcription-2');
  showSvgElement('lac_mRNA');
  showSvgElement('Path_1041');
  showSvgElement('Translation-2');
  showSvgElement('Group_604');
  showSvgElement('Group_605');
  showSvgElement('Group_606');
  showSvgElement('Path_10341');
  await delay(300);
}

async function deactivateInducerState() {
  const operatorBox = geneBoxes.o;
  state.isLooping = false;

  // Hide inducer and inactive repressor label
  hideSvgElement('Ellipse_4');
  hideSvgElement('Inducer');
  hideSvgElement('Repressor_Inactive_');
  hideSvgElement('Transcription-2');
  hideSvgElement('lac_mRNA');
  hideSvgElement('Path_1041');
  hideSvgElement('Translation-2');
  hideSvgElement('Group_604');
  hideSvgElement('Group_605');
  hideSvgElement('Group_606');
  hideSvgElement('Path_10341');
  // Repressor binds operator again; show No Enzyme card
  showSvgElement('Repressor_on_operator');
  showSvgElement('No_enzyme_card');
  if (operatorBox) {
    operatorBox.style.transition = 'filter 0.3s ease';
    operatorBox.style.filter = 'drop-shadow(0 0 12px rgba(255, 0, 0, 0.8))';
  }
  await delay(200);
}

// ==================== ANIMATION FUNCTIONS ====================

async function animateInducerBindingToRepressor() {
  // Create inducer icon (small green molecule)
  const inducerIcon = createDynamicInducerIcon(600, 450);

  // Animate inducer movement to repressor
  await new Promise(resolve => {
    const startTime = Date.now();
    const duration = 800;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const x = 600 + (810 - 600) * easeInOutQuad(progress);

      inducerIcon.setAttribute('cx', x);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    animate();
  });
}

async function animateRepressorInactivation() {
  // Find repressor icon
  const repressorIcon = document.querySelector('circle[data-element="repressor-icon"]');
  if (!repressorIcon) return;

  // Change repressor color to inactive state (lighter color)
  repressorIcon.style.transition = 'fill 0.5s ease';
  repressorIcon.style.fill = '#CCCCCC';

  // Animate repressor movement away from operator
  await new Promise(resolve => {
    const startTime = Date.now();
    const duration = 800;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const x = 810 + (200 - 810) * easeInOutQuad(progress);

      repressorIcon.setAttribute('cx', x);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    animate();
  });
}

async function animateRNAPolymeraseTranscription() {
  const pBox = geneBoxes.p_promoter;
  const zBox = geneBoxes.z;
  const yBox = geneBoxes.y;
  const aBox = geneBoxes.a;

  // Create RNA polymerase icon at promoter
  const rnaPol = createDynamicRNAPolymeraseIcon(800, 300);

  // Highlight promoter
  if (pBox) {
    pBox.style.transition = 'filter 0.3s ease';
    pBox.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))';
  }

  // Animate RNA polymerase movement across genes
  await new Promise(resolve => {
    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const x = 800 + (1520 - 800) * easeInOutQuad(progress);

      // Update RNAP position
      const rnapGroup = rnaPol.parentElement;
      const circle = rnapGroup.querySelector('circle[data-element="rna-polymerase-icon"]');
      if (circle) circle.setAttribute('cx', x);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    animate();
  });

  // Create lac mRNA strand
  createDynamicLacmRNAStrand(900, 550);

  // Highlight z, y, a genes during transcription
  const geneList = [zBox, yBox, aBox];
  for (let i = 0; i < geneList.length; i++) {
    if (geneList[i]) {
      geneList[i].style.transition = 'filter 0.3s ease';
      geneList[i].style.filter = 'drop-shadow(0 0 10px rgba(100, 200, 255, 0.8))';
    }
    if (i < geneList.length - 1) {
      await delay(200);
    }
  }

  await delay(500);

  // Remove highlights
  [pBox, ...geneList].forEach(box => {
    if (box) box.style.filter = 'none';
  });
}

async function animateEnzymeProduction() {
  // Create enzyme icons and labels for z, y, a genes
  const enzymes = [
    {
      key: 'z',
      label: 'β-galactosidase',
      x: 1100,
      y: 600,
      delay: 0
    },
    {
      key: 'y',
      label: 'Permease',
      x: 1365,
      y: 600,
      delay: 300
    },
    {
      key: 'a',
      label: 'Transacetylase',
      x: 1500,
      y: 600,
      delay: 600
    }
  ];

  for (const enzyme of enzymes) {
    await delay(enzyme.delay);
    const enzymeIcon = createDynamicEnzymeIcon(enzyme.x, enzyme.y, enzyme.key);
    const enzymeLabel = createDynamicText(
      enzyme.x - 40,
      enzyme.y + 50,
      enzyme.label,
      { fontSize: 18, fill: '#1976D2', fontWeight: 'bold' }
    );
    enzymeLabel.setAttribute('id', enzyme.key + '-label');

    // Pop animation
    enzymeIcon.style.transform = 'scale(0)';
    enzymeIcon.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    setTimeout(() => {
      enzymeIcon.style.transform = 'scale(1)';
    }, 10);
  }
}

function loopTranscription() {
  // Gentle pulsing animation of gene boxes during active transcription
  const pulseAnimation = setInterval(() => {
    if (!state.isLooping) {
      clearInterval(pulseAnimation);
      return;
    }

    const zBox = geneBoxes.z;
    const yBox = geneBoxes.y;
    const aBox = geneBoxes.a;

    [zBox, yBox, aBox].forEach((box, index) => {
      if (box) {
        setTimeout(() => {
          box.style.transition = 'opacity 0.6s ease-in-out';
          box.style.opacity = '0.7';
          setTimeout(() => {
            box.style.opacity = '1';
          }, 600);
        }, index * 150);
      }
    });
  }, 2000);
}

// ==================== RESET BUTTON HANDLER ====================

async function handleResetClick() {
  state.animationInProgress = true;
  state.isLooping = false;

  hidePathwaySvgElements();
  hideDynamicElements();
  setInitialState();

  state.animationInProgress = false;
}

// ==================== INSIGHTS MODAL ====================

async function handleInsightsClick() {
  
  const Insight_btn_n_panel = document.getElementById('Insight_btn_n_panel');
  if (Insight_btn_n_panel) Insight_btn_n_panel.classList.remove('st767');
  const Group_579 = document.getElementById('Group_579');
  if (Group_579) Group_579.addEventListener('click', () => {
    Insight_btn_n_panel.classList.add('st767');
  });
}

function showInsightsModal() {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'insights-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 40px;
    max-width: 900px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    font-family: Roboto, sans-serif;
    animation: slideUp 0.3s ease;
  `;

  modalContent.innerHTML = getInsightsContent();

  // Add close button event
  const closeBtn = modalContent.querySelector('.close-insights-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    });
  }

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    }
  });

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Add animations
  addModalAnimations();
}

function getInsightsContent() {
  return `
    <div style="color: #333; line-height: 1.8;">
      <h2 style="color: #1976D2; margin-bottom: 20px; font-size: 28px;">
        Working Mechanism of Lac Operon Regulation
      </h2>

      <h3 style="color: #F57C00; margin-top: 25px; margin-bottom: 10px; font-size: 20px;">
        🧬 Key Components
      </h3>
      <ul style="margin-left: 20px;">
        <li><strong>Regulatory gene (i):</strong> Codes for repressor protein that binds to operator</li>
        <li><strong>Promoter (p):</strong> Region where RNA polymerase binds to initiate transcription</li>
        <li><strong>Operator (o):</strong> Region where repressor binds to block transcription</li>
        <li><strong>Structural genes (z, y, a):</strong> Code for three enzymes</li>
        <li><strong>Repressor protein:</strong> Blocks transcription when inducer is absent</li>
        <li><strong>Inducer (lactose):</strong> Inactivates repressor protein when present</li>
      </ul>

      <h3 style="color: #F57C00; margin-top: 25px; margin-bottom: 10px; font-size: 20px;">
        🔬 Regulation Mechanism
      </h3>

      <div style="background: #F5F5F5; padding: 15px; border-left: 4px solid #FF5722; margin: 15px 0;">
        <h4 style="color: #D32F2F; margin-top: 0;">📌 Inducer ABSENT (Repressive State)</h4>
        <ol style="margin-left: 20px;">
          <li>i gene is constitutively expressed, producing repressor mRNA</li>
          <li>Translation of repressor mRNA produces repressor protein</li>
          <li>Repressor protein binds tightly to operator region (o)</li>
          <li>RNA polymerase cannot access promoter due to repressor blocking it</li>
          <li>β-galactosidase, Permease, and Transacetylase are NOT produced</li>
          <li>Result: <strong>No lactose digestion possible</strong></li>
        </ol>
      </div>

      <div style="background: #E8F5E9; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0;">
        <h4 style="color: #1B5E20; margin-top: 0;">📌 Inducer PRESENT (Inductive State)</h4>
        <ol style="margin-left: 20px;">
          <li>Lactose (inducer) enters the cell and allosterically binds to repressor protein</li>
          <li>Inducer causes conformational change in repressor protein</li>
          <li>Inactivated repressor dissociates from operator region</li>
          <li>Operator site becomes free, and RNA polymerase can now bind to promoter</li>
          <li>Transcription proceeds across structural genes (z, y, a)</li>
          <li>Three enzymes are produced:
            <ul style="margin-left: 20px;">
              <li><strong>β-galactosidase (z gene):</strong> Hydrolyzes lactose into glucose and galactose</li>
              <li><strong>Permease (y gene):</strong> Transports lactose into the cell</li>
              <li><strong>Transacetylase (a gene):</strong> Modifies lactose metabolites</li>
            </ul>
          </li>
          <li>Result: <strong>Lactose is efficiently metabolized</strong></li>
        </ol>
      </div>

      <h3 style="color: #F57C00; margin-top: 25px; margin-bottom: 10px; font-size: 20px;">
        📋 Summary
      </h3>
      <p style="background: #FFF3E0; padding: 15px; border-radius: 8px; margin: 15px 0;">
        The lac operon is a <strong>negative inducible system</strong> in E. coli. It's regulated by:
        <br><strong>Negative regulation:</strong> Repressor protein inhibits transcription in absence of lactose
        <br><strong>Inducible:</strong> Presence of lactose induces transcription of structural genes
        <br><strong>Adaptive advantage:</strong> Bacteria only produce digestive enzymes when lactose is available, saving cellular resources
      </p>

      <h3 style="color: #F57C00; margin-top: 25px; margin-bottom: 10px; font-size: 20px;">
        🏷️ Terminology
      </h3>
      <ul style="margin-left: 20px;">
        <li><strong>Repressor:</strong> Protein product of regulatory gene that blocks transcription</li>
        <li><strong>Repressor mRNA:</strong> mRNA transcribed from regulatory gene</li>
        <li><strong>Transcription:</strong> Synthesis of mRNA from DNA template</li>
        <li><strong>Translation:</strong> Synthesis of protein from mRNA template</li>
        <li><strong>Inducer:</strong> Substance that activates gene expression (lactose in this case)</li>
        <li><strong>Lac operon:</strong> Cluster of genes with operator and promoter under common regulatory control</li>
      </ul>

      <button class="close-insights-btn" style="
        background: #1976D2;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        margin-top: 25px;
        font-family: Roboto, sans-serif;
        font-weight: 500;
        transition: background 0.3s ease;
      ">Close</button>
    </div>
  `;
}

// ==================== TOOLTIP SETUP ====================

function setupTooltips() {
  const geneInfo = {
    i: 'Regulatory gene - produces repressor protein',
    p: 'Promoter - RNA polymerase binding site',
    o: 'Operator - repressor protein binding site',
    z: 'Structural gene - codes for β-galactosidase (breaks down lactose)',
    y: 'Structural gene - codes for Permease (transports lactose)',
    a: 'Structural gene - codes for Transacetylase (modifies products)',
    p_2: 'Promoter for regulatory gene i'
  };

  Object.keys(geneInfo).forEach(geneKey => {
    const geneElement = genes[geneKey];
    if (geneElement) {
      geneElement.style.cursor = 'help';
      
      // Create custom tooltip on hover
      geneElement.addEventListener('mouseenter', (e) => {
        createTooltip(e, geneInfo[geneKey]);
      });

      geneElement.addEventListener('mouseleave', () => {
        removeTooltip();
      });
    }
  });
}

function createTooltip(event, text) {
  removeTooltip();
  
  const tooltip = document.createElement('div');
  tooltip.id = 'gene-tooltip';
  tooltip.style.cssText = `
    position: fixed;
    background: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    z-index: 9999;
    pointer-events: none;
    font-family: Roboto, sans-serif;
    max-width: 250px;
    white-space: normal;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  tooltip.textContent = text;
  document.body.appendChild(tooltip);

  // Position tooltip
  const x = event.pageX + 10;
  const y = event.pageY + 10;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';

  // Keep tooltip visible while moving
  const moveListener = (e) => {
    tooltip.style.left = (e.pageX + 10) + 'px';
    tooltip.style.top = (e.pageY + 10) + 'px';
  };

  document.addEventListener('mousemove', moveListener);
  
  // Store listener for cleanup
  tooltip.addEventListener('mouseleave', () => {
    document.removeEventListener('mousemove', moveListener);
  });
}

function removeTooltip() {
  const tooltip = document.getElementById('gene-tooltip');
  if (tooltip) tooltip.remove();
}


// ==================== HELPER FUNCTIONS ====================

function createDynamicText(x, y, text, options = {}) {
  const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textEl.setAttribute('x', x);
  textEl.setAttribute('y', y);
  textEl.setAttribute('data-dynamic', 'true');
  textEl.style.fontFamily = options.fontFamily || 'Roboto';
  textEl.style.fontSize = options.fontSize || '18px';
  textEl.style.fill = options.fill || '#000';
  textEl.style.fontWeight = options.fontWeight || 'normal';
  textEl.style.fontStyle = options.fontStyle || 'normal';
  textEl.textContent = text;
  svg.appendChild(textEl);
  return textEl;
}

function createDynamicArrow(x1, y1, x2, y2, color = '#000', strokeWidth = 2) {
  // ...existing code...
}

function createDynamicRepressorOval(cx, cy) {
  // Orange oval for repressor
  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  ellipse.setAttribute('cx', cx);
  ellipse.setAttribute('cy', cy);
  ellipse.setAttribute('rx', 40);
  ellipse.setAttribute('ry', 20);
  ellipse.setAttribute('fill', '#FF9800');
  ellipse.setAttribute('data-dynamic', 'true');
  ellipse.setAttribute('data-element', 'repressor-oval');
  svg.appendChild(ellipse);
  return ellipse;
}

function createDynamicMRNAWavyLine(x1, y1, x2, y2) {
  // Create a blue wavy line to represent repressor mRNA
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  
  // Create wavy pattern from x1 to x2
  const waveHeight = 15;
  const waveCount = 4;
  let pathData = `M ${x1} ${y1}`;
  
  const stepX = (x2 - x1) / (waveCount * 2);
  for (let i = 0; i < waveCount * 2; i++) {
    const x = x1 + stepX * (i + 1);
    const y = y1 + (i % 2 === 0 ? waveHeight : -waveHeight);
    pathData += ` Q ${x - stepX / 2} ${y1 + (i % 2 === 0 ? waveHeight * 2 : -waveHeight * 2)}, ${x} ${y1}`;
  }
  
  path.setAttribute('d', pathData);
  path.setAttribute('stroke', '#1E88E5');
  path.setAttribute('stroke-width', '4');
  path.setAttribute('fill', 'none');
  path.setAttribute('data-dynamic', 'true');
  path.setAttribute('id', 'repressor-mRNA-wavy-line');
  svg.appendChild(path);
  return path;
}

function createDynamicInducerIcon(x, y) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', '12');
  circle.setAttribute('fill', '#4CAF50');
  circle.setAttribute('data-dynamic', 'true');
  circle.setAttribute('data-element', 'inducer-icon');
  circle.style.opacity = '0.8';
  svg.appendChild(circle);
  return circle;
}

function createDynamicRNAPolymeraseIcon(x, y) {
  // Create a simple RNA polymerase representation (circle with label)
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('data-dynamic', 'true');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', '18');
  circle.setAttribute('fill', '#9C27B0');
  circle.setAttribute('opacity', '0.7');
  circle.setAttribute('data-element', 'rna-polymerase-icon');
  g.appendChild(circle);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y + 5);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('fill', 'white');
  text.setAttribute('font-size', '12');
  text.setAttribute('font-weight', 'bold');
  text.textContent = 'RNAP';
  g.appendChild(text);

  svg.appendChild(g);
  return circle; // Return circle for animation
}

function createDynamicLacmRNAStrand(x, y) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${x} ${y} Q ${x + 100} ${y - 30} ${x + 200} ${y}`);
  path.setAttribute('stroke', '#FF5722');
  path.setAttribute('stroke-width', '3');
  path.setAttribute('fill', 'none');
  path.setAttribute('data-dynamic', 'true');
  path.setAttribute('id', 'lac-mRNA-strand');
  svg.appendChild(path);

  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', x + 100);
  label.setAttribute('y', y - 50);
  label.setAttribute('font-family', 'Roboto');
  label.setAttribute('font-size', '20');
  label.setAttribute('fill', '#FF5722');
  label.setAttribute('font-weight', 'bold');
  label.setAttribute('data-dynamic', 'true');
  label.setAttribute('id', 'lac-mRNA-text');
  label.setAttribute('text-anchor', 'middle');
  label.textContent = 'lac mRNA';
  svg.appendChild(label);

  return path;
}

function createDynamicEnzymeIcon(x, y, type) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('data-dynamic', 'true');
  g.setAttribute('id', `enzyme-icon-${type}`);

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', '20');

  // Different colors for different enzymes
  const colors = {
    'z': '#2196F3',
    'y': '#009688',
    'a': '#FF9800'
  };

  circle.setAttribute('fill', colors[type] || '#1976D2');
  circle.setAttribute('opacity', '0.8');

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y + 5);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('fill', 'white');
  text.setAttribute('font-size', '11');
  text.setAttribute('font-weight', 'bold');
  text.textContent = type.toUpperCase();

  g.appendChild(circle);
  g.appendChild(text);
  svg.appendChild(g);

  return g;
}

function createOperatorBinding() {
  const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  highlight.setAttribute('x', '769');
  highlight.setAttribute('y', '246');
  highlight.setAttribute('width', '90');
  highlight.setAttribute('height', '120');
  highlight.setAttribute('fill', 'none');
  highlight.setAttribute('stroke', '#FF0000');
  highlight.setAttribute('stroke-width', '3');
  highlight.setAttribute('opacity', '0.7');
  highlight.setAttribute('data-dynamic', 'true');
  highlight.setAttribute('id', 'operator-binding-highlight');
  highlight.style.animation = 'pulse 1.5s infinite';
  svg.appendChild(highlight);
}

function createNoEnzymeText() {
  const text = createDynamicText(
    960,
    450,
    'No Enzyme Production',
    { fontSize: 26, fill: '#C90E0E', fontWeight: 'bold', fontStyle: 'italic' }
  );
  text.setAttribute('id', 'no-enzyme-text');
  text.setAttribute('text-anchor', 'middle');
  return text;
}

function updateToggleUI(inducerPresent) {
  const toggleCircle = document.getElementById('Ellipse_1');
  if (toggleCircle) {
    toggleCircle.style.transition = 'transform 0.4s ease';
    const offset = inducerPresent ? 90 : 0;
    toggleCircle.style.transform = `translateX(${offset}px)`;
  }

  // Update label emphasis: active side bright, inactive side dimmed
  const leftGroup = document.getElementById('Inducer_present');
  const rightGroup = document.getElementById('Inducer_absent');
  const leftText = leftGroup ? leftGroup.querySelector('text') : null;
  const rightText = rightGroup ? rightGroup.querySelector('text') : null;

  if (leftText && rightText) {
    if (inducerPresent) {
      // Right (Inducer absent) active
      
      rightText.style.opacity = '1';
      leftText.style.fontWeight = '400';
      rightText.style.fontWeight = '700';
      rightText.style.fill = '#fff';
      leftText.style.fill = '#666';
    } else {
      // Left (Inducer present) active
      leftText.style.opacity = '1';
 
      leftText.style.fontWeight = '700';
      rightText.style.fontWeight = '400';
      rightText.style.fill = '#666';
      leftText.style.fill = '#fff';
    }
  }
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fadeOutElements(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 500);
    }
  });
}

function animateElement(element, animations) {
  return new Promise(resolve => {
    if (animations.length === 0) {
      resolve();
      return;
    }

    let completed = 0;

    animations.forEach(anim => {
      const startValue = parseFloat(element.getAttribute(anim.attr)) || anim.from;
      const range = anim.to - anim.from;
      const startTime = Date.now();
      const duration = anim.duration;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const value = anim.from + range * easeInOutQuad(progress);
        element.setAttribute(anim.attr, value);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          completed++;
          if (completed === animations.length) {
            resolve();
          }
        }
      };

      animate();
    });
  });
}

function addModalAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `;
  
  if (!document.querySelector('style[data-modal-animations]')) {
    style.setAttribute('data-modal-animations', 'true');
    document.head.appendChild(style);
  }
}

// ==================== INITIALIZATION ====================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
