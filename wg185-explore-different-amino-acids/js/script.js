/* Explore Different Amino Acids (wg185)
   Pattern follows wg184-find-the-market-price/js/script.js:
   – IIFE wrapper
   – $ shorthand
   – fitStage on load + resize
   – insights open/close with Escape + Tab trap
   – insights starts HIDDEN (closed by default)
*/
(function () {
  'use strict';

  /* ── shorthand ─────────────────────────────────────────────── */
  const $ = (id) => document.getElementById(id);

  /* ── data ──────────────────────────────────────────────────── */
  const DATA      = window.WIDGET_DATA;
  const CATS      = DATA.categories;
  const AAS       = DATA.aminoAcids;

  /* ── DOM refs ──────────────────────────────────────────────── */
  const stage           = $('stage');
  const instructionText = $('instruction-text');
  const categoryPills   = $('category-pills');

  const ddWrapper1  = $('dropdown-wrapper-1');
  const ddBtn1      = $('dropdown-btn-1');
  const ddLabel1    = $('dropdown-label-1');
  const ddList1     = $('dropdown-list-1');

  const compareTabs = $('compare-tabs');
  const tabSame     = $('tab-same');
  const tabAcross   = $('tab-across');

  const ddWrapper2  = $('dropdown-wrapper-2');
  const ddBtn2      = $('dropdown-btn-2');
  const ddLabel2    = $('dropdown-label-2');
  const ddList2     = $('dropdown-list-2');

  const compareChk  = $('compare-checkbox');

  const card1       = $('amino-card-1');
  const header1     = $('card-header-1');
  const badge1      = $('card-name-badge-1');
  const svg1        = $('molecule-svg-1');
  const info1       = $('card-info-1');
  const badges1     = $('card-badges-1');
  const insights1   = $('card-insights-1');

  const card2       = $('amino-card-2');
  const header2     = $('card-header-2');
  const badge2      = $('card-name-badge-2');
  const svg2        = $('molecule-svg-2');
  const info2       = $('card-info-2');
  const badges2     = $('card-badges-2');
  const insights2   = $('card-insights-2');

  const resetBtn    = $('reset-btn');
  const insightsBtn = $('insights-btn');
  const insightsEl  = $('insights');
  const insightsClose = $('insights-close');
  const insightsList  = $('insights-list');

  /* ── state ─────────────────────────────────────────────────── */
  let activeCategory = 'all';
  let activeCategory2 = null;
  let activeCategorySlot = 1;
  let selectedAA1    = null;
  let selectedAA2    = null;
  let compareMode    = false;
  let compareType    = 'same'; // 'same' | 'across'

  /* ============================================================
     Stage scaling (wg184 pattern)
     ============================================================ */
  let stageScale = 1;
  function fitStage() {
    stageScale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    const x = (window.innerWidth  - 1920 * stageScale) / 2;
    const y = (window.innerHeight - 1080 * stageScale) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${stageScale})`;
    if (!helpTour.hidden) showTourStep();
  }

  /* ============================================================
     Category pills
     ============================================================ */
  function buildCategoryPills() {
    categoryPills.innerHTML = '';
    CATS.forEach(cat => {
      const btn = document.createElement('button');
      btn.type       = 'button';
      btn.className  = 'cat-pill' + (cat.id === 'all' ? ' is-active' : '');
      btn.textContent = cat.label;
      btn.style.background = cat.color;
      btn.style.color      = cat.textColor;
      btn.dataset.catId    = cat.id;
      btn.setAttribute('data-slot-label', '');
      btn.setAttribute('aria-pressed', String(cat.id === 'all'));
      btn.addEventListener('click', () => onCategoryClick(cat.id));
      categoryPills.appendChild(btn);
    });
  }

  function onCategoryClick(catId) {
    if (compareMode && compareType === 'across') {
      if (catId === 'all' || (activeCategorySlot === 1 && catId === activeCategory2) ||
          (activeCategorySlot === 2 && catId === activeCategory)) return;
      if (activeCategorySlot === 1) {
        activeCategory = catId;
        clearSlot1(false);
      } else {
        activeCategory2 = catId;
        clearSlot2(false);
      }
    } else {
      activeCategory = catId;
      clearSlot1(false);
      if (compareMode) clearSlot2(false);
    }
    updateCategoryPills();
    repopulateDropdown1();
    if (compareMode && selectedAA1) repopulateDropdown2();
    layoutMolecules();
    updateInstruction();
  }

  function updateCategoryPills() {
    document.querySelectorAll('.cat-pill').forEach(btn => {
      const catId = btn.dataset.catId;
      const slot1 = catId === activeCategory;
      const slot2 = compareMode && compareType === 'across' && catId === activeCategory2;
      const active = slot1 || slot2;
      const unavailable = compareMode && compareType === 'across' &&
        (catId === 'all' || (activeCategorySlot === 1 && slot2) || (activeCategorySlot === 2 && slot1));
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('is-slot-1', compareMode && compareType === 'across' && slot1);
      btn.classList.toggle('is-slot-2', slot2);
      btn.classList.toggle('is-unavailable', unavailable);
      btn.setAttribute('data-slot-label', slot1 && compareMode && compareType === 'across'
        ? '1'
        : slot2 ? '2' : '');
      btn.setAttribute('aria-pressed', String(active));
      btn.setAttribute('aria-disabled', String(unavailable));
    });
  }

  /* ============================================================
     Filtered amino acids
     ============================================================ */
  function getFiltered(catId) {
    if (!catId) return [];
    if (catId === 'all') return AAS;
    return AAS.filter(aa => aa.categories.includes(catId));
  }

  /* ============================================================
     Dropdown helpers
     ============================================================ */
  function populateList(list, aas, selectedId, onSelect) {
    list.innerHTML = '';
    aas.forEach(aa => {
      const li = document.createElement('li');
      li.role        = 'option';
      li.textContent = aa.name;
      li.dataset.aaId = aa.id;
      li.classList.toggle('is-selected', aa.id === selectedId);
      if (aa.id === selectedId) li.setAttribute('aria-selected', 'true');
      li.addEventListener('click', () => onSelect(aa));
      list.appendChild(li);
    });
  }

  function openList(list, btn) {
    list.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeList(list, btn) {
    list.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  function toggleList(list, btn) {
    if (list.hidden) openList(list, btn); else closeList(list, btn);
  }

  /* close dropdowns on outside click */
  document.addEventListener('click', e => {
    if (!ddWrapper1.contains(e.target)) closeList(ddList1, ddBtn1);
    if (!ddWrapper2.contains(e.target)) closeList(ddList2, ddBtn2);
  });

  /* ============================================================
     Dropdown 1
     ============================================================ */
  function repopulateDropdown1() {
    populateList(ddList1, getFiltered(activeCategory), selectedAA1 ? selectedAA1.id : null, onSelectAA1);
  }

  ddBtn1.addEventListener('click', e => {
    e.stopPropagation();
    if (compareMode && compareType === 'across') activeCategorySlot = 1;
    updateCategoryPills();
    toggleList(ddList1, ddBtn1);
  });

  function onSelectAA1(aa) {
    selectedAA1 = aa;
    ddLabel1.textContent = aa.name;
    closeList(ddList1, ddBtn1);
    repopulateDropdown1();
    renderMolecule(svg1, aa, true);
    renderCardInfo(header1, badge1, info1, badges1, insights1, aa);

    if (compareMode) {
      if (compareType === 'across') activeCategorySlot = 2;
      compareTabs.hidden      = false;
      ddWrapper2.hidden       = false;
      repopulateDropdown2();
    }
    updateCategoryPills();
    layoutMolecules();
    updateInstruction();
  }

  /* ============================================================
     Dropdown 2
     ============================================================ */
  function getFiltered2() {
    if (!selectedAA1) return AAS;
    if (compareType === 'same') {
      const sameCat = activeCategory !== 'all'
        ? activeCategory
        : selectedAA1.categories[0];
      return getFiltered(sameCat).filter(aa => aa.id !== selectedAA1.id);
    }
    const categoryOneAAs = getFiltered(activeCategory);
    return getFiltered(activeCategory2).filter(aa =>
      aa.id !== selectedAA1.id &&
      !categoryOneAAs.some(categoryOneAA => categoryOneAA.id === aa.id)
    );
  }

  function repopulateDropdown2() {
    populateList(ddList2, getFiltered2(), selectedAA2 ? selectedAA2.id : null, onSelectAA2);
  }

  ddBtn2.addEventListener('click', e => {
    e.stopPropagation();
    if (compareMode && compareType === 'across') activeCategorySlot = 2;
    updateCategoryPills();
    toggleList(ddList2, ddBtn2);
  });

  function onSelectAA2(aa) {
    selectedAA2 = aa;
    ddLabel2.textContent = aa.name;
    closeList(ddList2, ddBtn2);
    repopulateDropdown2();
    renderMolecule(svg2, aa, true);
    renderCardInfo(header2, badge2, info2, badges2, insights2, aa);
    layoutMolecules();
    updateInstruction();
  }

  /* ============================================================
     Compare checkbox & tabs
     ============================================================ */
  compareChk.addEventListener('change', () => {
    compareMode = compareChk.checked;
    applyCompareMode();
  });

  function applyCompareMode() {
    if (compareMode) {
      card2.hidden      = false;
      compareTabs.hidden = !selectedAA1;
      ddWrapper2.hidden  = !selectedAA1;
      if (selectedAA1) repopulateDropdown2();
    } else {
      card2.hidden       = true;
      compareTabs.hidden = true;
      ddWrapper2.hidden  = true;
      clearSlot2(false);
    }
    updateCategoryPills();
    layoutMolecules();
    updateInstruction();
  }

  [tabSame, tabAcross].forEach(tab => {
    tab.addEventListener('click', () => {
      compareType = tab.dataset.mode;
      activeCategory2 = null;
      if (compareType === 'across' && activeCategory === 'all') {
        activeCategory = null;
        clearSlot1(false);
        activeCategorySlot = 1;
      } else {
        activeCategorySlot = compareType === 'across' && selectedAA1 ? 2 : 1;
      }
      tabSame.classList.toggle('is-active',   compareType === 'same');
      tabAcross.classList.toggle('is-active', compareType === 'across');
      clearSlot2(false);
      if (selectedAA1) repopulateDropdown2();
      updateCategoryPills();
      updateInstruction();
    });
  });

  /* ============================================================
     Instruction text
     ============================================================ */
  function updateInstruction() {
    if (!compareMode) {
      instructionText.innerHTML =
        'First select a <strong><em>category</em></strong> from above, then choose an ' +
        '<strong><em>amino acid</em></strong> from the dropdown to explore.';
    } else if (!selectedAA1) {
      instructionText.innerHTML = compareType === 'across' && !activeCategory
        ? 'Select a category for amino acid <strong>1</strong>'
        : 'Select a <strong><em>category</em></strong>, then pick amino acid <strong>1</strong>';
    } else if (!selectedAA2) {
      if (compareType === 'across' && !activeCategory2) {
        instructionText.innerHTML = 'Select a <strong>different category</strong> for amino acid <strong>2</strong>';
      } else if (compareType === 'across' && !getFiltered2().length) {
        instructionText.innerHTML =
          'There are no amino acids in that category that differ from category <strong>1</strong>. Select another category.';
      } else {
        instructionText.innerHTML = compareType === 'across'
          ? 'Choose amino acid <strong>2</strong> from the <strong>second category</strong>'
          : 'Select a <strong><em>category</em></strong>, then pick amino acid <strong>2</strong>';
      }
    } else {
      instructionText.innerHTML =
        'Comparing <strong>' + selectedAA1.name + '</strong> and <strong>' + selectedAA2.name + '</strong>';
    }
  }

  /* ============================================================
     Card info (badges + insights text)
     ============================================================ */
  function renderCardInfo(headerEl, badgeEl, infoEl, badgesEl, insightsEl, aa) {
    badgeEl.textContent = aa.name;
    headerEl.hidden = false;

    badgesEl.innerHTML = '';
    aa.badges.forEach((b, i) => {
      const span = document.createElement('span');
      span.className   = 'card-badge';
      span.textContent = b;
      span.style.background = aa.badgeColors[i] || '#888';
      if (aa.badgeColors[i] === '#F5D020') span.style.color = '#222';
      badgesEl.appendChild(span);
    });

    insightsEl.innerHTML = '';
    aa.insights.forEach(txt => {
      const div = document.createElement('div');
      div.className   = 'card-insight-item';
      div.textContent = txt;
      insightsEl.appendChild(div);
    });

    infoEl.hidden = false;
  }

  /* ============================================================
     Clear helpers
     ============================================================ */
  function clearSlot1(resetCat) {
    selectedAA1 = null;
    ddLabel1.textContent = 'Choose Amino Acid';
    header1.hidden = true;
    info1.hidden   = true;
    drawPlaceholder(svg1);

    if (compareMode) {
      compareTabs.hidden  = true;
      ddWrapper2.hidden   = true;
      clearSlot2(false);
    }

    if (resetCat) {
      activeCategory = 'all';
      updateCategoryPills();
    }
    repopulateDropdown1();
    layoutMolecules();
    updateInstruction();
  }

  function clearSlot2(hide) {
    selectedAA2 = null;
    ddLabel2.textContent = 'Choose Amino Acid';
    header2.hidden = true;
    info2.hidden   = true;
    drawPlaceholder(svg2);
    if (hide) card2.hidden = true;
    layoutMolecules();
    updateInstruction();
  }

  /* ============================================================
     Reset
     ============================================================ */
  function resetWidget() {
    compareChk.checked = false;
    compareMode = false;
    compareType = 'same';
    activeCategory2 = null;
    activeCategorySlot = 1;
    tabSame.classList.add('is-active');
    tabAcross.classList.remove('is-active');
    applyCompareMode();
    clearSlot1(true);
    closeInsights();
  }

  resetBtn.addEventListener('click', resetWidget);

  /* ============================================================
     Insights (wg184 pattern — toggle on button, Esc closes, Tab trapped)
     ============================================================ */
  function openInsights() {
    insightsEl.hidden = false;
    insightsBtn.setAttribute('aria-expanded', 'true');
    insightsClose.focus({ preventScroll: true });
  }

  function closeInsights() {
    insightsEl.hidden = true;
    insightsBtn.setAttribute('aria-expanded', 'false');
    insightsBtn.focus({ preventScroll: true });
  }

  insightsBtn.addEventListener('click', () => {
    if (insightsEl.hidden) openInsights(); else closeInsights();
  });

  insightsClose.addEventListener('click', closeInsights);

  document.addEventListener('keydown', e => {
    if (insightsEl.hidden) return;
    if (e.key === 'Escape') {
      closeInsights();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const close = insightsClose;
      (document.activeElement === close ? insightsBtn : close).focus({ preventScroll: true });
    }
  });

  function buildInsightsList() {
    insightsList.innerHTML = '';
    DATA.generalInsights.forEach(txt => {
      const li = document.createElement('li');
      if (txt.indexOf('insight-figure') !== -1) li.classList.add('insight-figure-item');
      li.innerHTML = txt;
      insightsList.appendChild(li);
    });
  }

  /* ============================================================
     Help tour
     ============================================================ */
  const helpBtn = $('help-btn');
  const helpTour = $('help-tour');
  const tourSpot = $('tour-spot');
  const tourTip = $('tour-tip');
  const tourStep = $('tour-step');
  const tourText = $('tour-text');
  const tourNext = $('tour-next');
  const tourBack = $('tour-back');
  const tourSkip = $('tour-skip');
  const tourState = { kind: 'tour', steps: [], index: 0 };

  function makeTourSteps() {
    const steps = [
      { id: 'categories-panel', text: 'Select a category to narrow the list, or keep “All” to see every amino acid.' },
      { id: 'dropdown-btn-1', text: 'Choose an amino acid from this list. Its structure and key features will appear below.' },
      { id: 'viewers-row', text: 'The structure shows the shared backbone and the variable R group. The R group is what differs between amino acids.' },
      { id: 'compare-checkbox-label', text: 'Select “Compare amino acids” to explore two structures side by side.' }
    ];
    if (compareMode && selectedAA1) {
      steps.push({ id: 'compare-tabs', text: 'Choose whether to compare within one category or across two categories.' });
    }
    steps.push(
      { id: 'reset-btn', text: 'Select “Reset” to clear your choices and return to the start.' },
      { id: 'insights-btn', text: 'Select “Insights” for key points about amino acids.' },
      { id: 'help-btn', text: 'Select “Help” at any time for guidance based on your current progress.' }
    );
    return steps;
  }

  function makeGuideSteps() {
    const addEndSteps = steps => steps.concat([
      { id: 'insights-btn', text: 'Select “Insights” for key points about amino acids.' },
      { id: 'reset-btn', text: 'Select “Reset” to clear your choices and start again.' }
    ]);

    if (!compareMode) {
      if (!selectedAA1) {
        return activeCategory === 'all'
          ? [
            { id: 'categories-panel', text: 'Select a category to narrow the list, or keep “All” to see every amino acid.' },
            { id: 'dropdown-btn-1', text: 'Choose an amino acid to see its structure.' }
          ]
          : [{ id: 'dropdown-btn-1', text: 'Choose an amino acid from the selected category to see its structure.' }];
      }
      return addEndSteps([
        { id: 'viewers-row', text: 'Look at the R group above the central carbon. It is the part that makes this amino acid different.' },
        { id: 'card-info-1', text: 'Read the categories and key features for the selected amino acid here.' },
        { id: 'dropdown-btn-1', text: 'Choose another amino acid to compare its R group, or select a different category first.' },
        { id: 'compare-checkbox-label', text: 'Select “Compare amino acids” to see two structures side by side.' }
      ]);
    }

    if (compareType === 'same') {
      if (!selectedAA1) {
        return [{ id: 'dropdown-btn-1', text: 'Choose amino acid 1. Both amino acids will be selected from the same category.' }];
      }
      if (!selectedAA2) {
        return [{ id: 'dropdown-btn-2', text: 'Choose amino acid 2 from the same category to compare the structures.' }];
      }
      return addEndSteps([
        { id: 'viewers-row', text: 'Compare the R groups. The rest of the backbone is shared between these structures.' },
        { id: 'compare-tabs', text: 'Switch to “Compare across categories” to choose a different category for each structure.' }
      ]);
    }

    if (!activeCategory) {
      return [{ id: 'categories-panel', text: 'Select a category for amino acid 1.' }];
    }
    if (!selectedAA1) {
      return [{ id: 'dropdown-btn-1', text: 'Choose amino acid 1 from the selected category.' }];
    }
    if (!activeCategory2) {
      return [{ id: 'categories-panel', text: 'Select a different category for amino acid 2. The selected category for amino acid 1 is marked 1.' }];
    }
    if (!selectedAA2) {
      return [{ id: 'dropdown-btn-2', text: 'Choose amino acid 2 from the second category.' }];
    }
    return addEndSteps([
      { id: 'viewers-row', text: 'Compare the R groups and category badges for both amino acids.' },
      { id: 'dropdown-btn-1', text: 'Use either dropdown to change an amino acid. In across-category mode, select the matching dropdown before changing its category.' }
    ]);
  }

  function tourRect(element) {
    const stageRect = stage.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      x: (rect.left - stageRect.left) / stageScale,
      y: (rect.top - stageRect.top) / stageScale,
      width: rect.width / stageScale,
      height: rect.height / stageScale
    };
  }

  function showTourStep() {
    if (helpTour.hidden || !tourState.steps.length) return;
    const step = tourState.steps[tourState.index];
    const target = $(step.id);
    if (!target || target.hidden) {
      endHelpTour();
      return;
    }
    const rect = tourRect(target);
    const padding = 8;
    tourSpot.style.left = (rect.x - padding) + 'px';
    tourSpot.style.top = (rect.y - padding) + 'px';
    tourSpot.style.width = (rect.width + padding * 2) + 'px';
    tourSpot.style.height = (rect.height + padding * 2) + 'px';
    tourStep.textContent = tourState.kind === 'guide'
      ? 'What to do next' + (tourState.steps.length > 1 ? ' (' + (tourState.index + 1) + ' of ' + tourState.steps.length + ')' : '')
      : 'Step ' + (tourState.index + 1) + ' of ' + tourState.steps.length;
    tourText.textContent = step.text;
    tourSkip.textContent = tourState.kind === 'guide' ? 'See full tour' : 'Skip';
    tourBack.disabled = tourState.index === 0;
    tourNext.textContent = tourState.index === tourState.steps.length - 1 ? 'Done' : 'Next';

    const tipWidth = 460;
    const tipHeight = tourTip.offsetHeight;
    const edge = 18;
    let left = rect.x + rect.width / 2 - tipWidth / 2;
    left = Math.max(edge, Math.min(1920 - tipWidth - edge, left));
    let top = rect.y + rect.height + edge;
    if (top + tipHeight > 1080 - edge) top = rect.y - tipHeight - edge;
    top = Math.max(edge, Math.min(1080 - tipHeight - edge, top));
    tourTip.style.left = left + 'px';
    tourTip.style.top = top + 'px';
    (tourNext.disabled ? tourBack : tourNext).focus({ preventScroll: true });
  }

  function openHelpTour(kind) {
    if (!insightsEl.hidden) closeInsights();
    tourState.kind = kind;
    tourState.steps = kind === 'guide' ? makeGuideSteps() : makeTourSteps();
    tourState.index = 0;
    helpTour.hidden = false;
    showTourStep();
  }

  function endHelpTour() {
    helpTour.hidden = true;
    try {
      window.localStorage.setItem('aaExplorerTourSeen', '1');
    } catch (error) {
      console.warn('Could not save the amino acid help tour state.', error);
    }
    helpBtn.focus({ preventScroll: true });
  }

  helpBtn.addEventListener('click', () => openHelpTour('guide'));
  tourNext.addEventListener('click', () => {
    if (tourState.index < tourState.steps.length - 1) {
      tourState.index += 1;
      showTourStep();
    } else {
      endHelpTour();
    }
  });
  tourBack.addEventListener('click', () => {
    if (tourState.index > 0) {
      tourState.index -= 1;
      showTourStep();
    }
  });
  tourSkip.addEventListener('click', () => {
    if (tourState.kind === 'guide') {
      openHelpTour('tour');
    } else {
      endHelpTour();
    }
  });

  document.addEventListener('keydown', event => {
    if (helpTour.hidden) return;
    if (event.key === 'Escape') {
      endHelpTour();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const buttons = [tourSkip, tourBack, tourNext].filter(button => !button.disabled);
      const currentIndex = buttons.indexOf(document.activeElement);
      const step = event.shiftKey ? -1 : 1;
      const nextIndex = currentIndex < 0
        ? (event.shiftKey ? buttons.length - 1 : 0)
        : (currentIndex + step + buttons.length) % buttons.length;
      buttons[nextIndex].focus({ preventScroll: true });
    }
  });

  /* ============================================================
     SVG molecule renderer
     ============================================================ */
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function mkEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  const BOND_GAP = 26;
  const ATOM_R = 25;
  const SMALL_ATOM_R = 21;
  const RING_SIDE = SMALL_ATOM_R * 2 + BOND_GAP;
  const ANGLE_UP = -90;
  const ANGLE_LEFT = -145;
  const ANGLE_RIGHT = -35;
  const COLORS = {
    h: ['#F5A623', '#FFD48A', '#fff'],
    ch: ['#F5A623', '#FFD48A', '#fff'],
    c: ['#fff', '#D6D6D6', '#2D2D2D'],
    n: ['#7B6CF6', '#ADA3FF', '#fff'],
    o: ['#2ECC71', '#86EDB0', '#fff'],
    s: ['#F4D03F', '#FBE8A0', '#4A3A00'],
    se: ['#9FB3C8', '#D3DEE9', '#1D2B38'],
    r: ['#5B3A3A', '#8C6A6A', '#E8DADA']
  };
  const BOND_COLOR = '#D2453A';
  const BACKBONE_ATOMS = {
    N: { x: -86, y: 0, r: 30 },
    CA: { x: 0, y: 0, r: 30 },
    C: { x: 86, y: 0, r: 30 }
  };

  function makeAtom(id, label, type, x, y, radius) {
    return { id, label, type, x, y, r: radius || ATOM_R };
  }

  function polar(point, degrees, distance) {
    const angle = degrees * Math.PI / 180;
    return { x: point.x + distance * Math.cos(angle), y: point.y + distance * Math.sin(angle) };
  }

  function hexagonAbove(bottom, side) {
    const centerY = bottom.y - side;
    return Array.from({ length: 6 }, (_, index) => {
      const angle = Math.PI / 2 + index * Math.PI / 3;
      return { x: bottom.x + side * Math.cos(angle), y: centerY + side * Math.sin(angle) };
    });
  }

  function pentagonAbove(bottom, side) {
    const radius = side / (2 * Math.sin(Math.PI / 5));
    const center = { x: bottom.x, y: bottom.y - radius };
    return {
      center,
      vertices: Array.from({ length: 5 }, (_, index) => {
        const angle = Math.PI / 2 + index * 2 * Math.PI / 5;
        return { x: bottom.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
      })
    };
  }

  function hexagonOnEdge(pointA, pointB, polygonCenter, side) {
    const midpoint = { x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 };
    let nx = midpoint.x - polygonCenter.x;
    let ny = midpoint.y - polygonCenter.y;
    const length = Math.hypot(nx, ny);
    nx /= length;
    ny /= length;
    const apothem = side * Math.sqrt(3) / 2;
    const center = { x: midpoint.x + nx * apothem, y: midpoint.y + ny * apothem };
    const angleA = Math.atan2(pointA.y - center.y, pointA.x - center.x);
    const angleB = Math.atan2(pointB.y - center.y, pointB.x - center.x);
    let sweep = angleB - angleA;
    while (sweep > Math.PI) sweep -= 2 * Math.PI;
    while (sweep < -Math.PI) sweep += 2 * Math.PI;
    return Array.from({ length: 6 }, (_, index) => {
      const angle = angleA + index * sweep;
      return { x: center.x + side * Math.cos(angle), y: center.y + side * Math.sin(angle) };
    });
  }

  function createSideChain() {
    const atoms = [];
    const bonds = [];
    const positions = {
      CA: { ...BACKBONE_ATOMS.CA },
      N: { ...BACKBONE_ATOMS.N }
    };
    const chain = {
      atoms,
      bonds,
      positions,
      add(id, label, type, parentId, degrees, order, radius) {
        const parent = positions[parentId];
        const atomRadius = radius || ATOM_R;
        const point = polar(parent, degrees, parent.r + atomRadius + BOND_GAP);
        const atom = makeAtom(id, label, type, point.x, point.y, atomRadius);
        atoms.push(atom);
        positions[id] = atom;
        bonds.push([parentId, id, order || 1]);
        return chain;
      },
      put(id, label, type, point, radius) {
        const atom = makeAtom(id, label, type, point.x, point.y, radius || ATOM_R);
        atoms.push(atom);
        positions[id] = atom;
        return chain;
      },
      bond(from, to, order) {
        bonds.push([from, to, order || 1]);
        return chain;
      },
      up(items, startId) {
        let parentId = startId || 'CA';
        items.forEach(item => {
          chain.add(item[0], item[1], item[2], parentId, ANGLE_UP);
          parentId = item[0];
        });
        return chain;
      }
    };
    return chain;
  }

  function createPhenyl(withHydroxyl) {
    const chain = createSideChain()
      .add('r1', 'CH₂', 'ch', 'CA', ANGLE_UP)
      .add('h0', 'C', 'c', 'r1', ANGLE_UP, 1, SMALL_ATOM_R);
    const vertices = hexagonAbove(chain.positions.h0, RING_SIDE);
    for (let index = 1; index < 6; index++) {
      const substituted = index === 3 && withHydroxyl;
      chain.put('h' + index, substituted ? 'C' : 'CH', substituted ? 'c' : 'ch', vertices[index], SMALL_ATOM_R);
    }
    chain.bond('h0', 'h1', 2).bond('h1', 'h2').bond('h2', 'h3', 2)
      .bond('h3', 'h4').bond('h4', 'h5', 2).bond('h5', 'h0');
    if (withHydroxyl) chain.add('oh', 'OH', 'o', 'h3', ANGLE_UP);
    return chain;
  }

  function createProline() {
    const beta = polar({ x: 0, y: 0 }, -80, 30 + ATOM_R + BOND_GAP);
    const delta = { x: -86 - beta.x, y: beta.y };
    const gamma = {
      x: -43,
      y: beta.y - Math.sqrt((2 * ATOM_R + BOND_GAP) ** 2 - (beta.x + 43) ** 2)
    };
    return createSideChain()
      .put('p1', 'CH₂', 'ch', beta)
      .put('p2', 'CH₂', 'ch', gamma)
      .put('p3', 'CH₂', 'ch', delta)
      .bond('CA', 'p1').bond('p1', 'p2').bond('p2', 'p3').bond('p3', 'N');
  }

  function createTryptophan() {
    const chain = createSideChain()
      .add('r1', 'CH₂', 'ch', 'CA', ANGLE_UP)
      .add('p0', 'C', 'c', 'r1', ANGLE_UP, 1, SMALL_ATOM_R);
    const pentagon = pentagonAbove(chain.positions.p0, RING_SIDE);
    const fused = hexagonOnEdge(pentagon.vertices[4], pentagon.vertices[3], pentagon.center, RING_SIDE);
    chain.put('p1', 'CH', 'ch', pentagon.vertices[1], SMALL_ATOM_R)
      .put('p2', 'NH', 'n', pentagon.vertices[2], SMALL_ATOM_R)
      .put('p3', 'C', 'c', pentagon.vertices[3], SMALL_ATOM_R)
      .put('p4', 'C', 'c', pentagon.vertices[4], SMALL_ATOM_R)
      .put('h2', 'CH', 'ch', fused[2], SMALL_ATOM_R)
      .put('h3', 'CH', 'ch', fused[3], SMALL_ATOM_R)
      .put('h4', 'CH', 'ch', fused[4], SMALL_ATOM_R)
      .put('h5', 'CH', 'ch', fused[5], SMALL_ATOM_R);
    chain.bond('p0', 'p1', 2).bond('p1', 'p2').bond('p2', 'p3')
      .bond('p3', 'p4').bond('p4', 'p0')
      .bond('p3', 'h2', 2).bond('h2', 'h3').bond('h3', 'h4', 2)
      .bond('h4', 'h5').bond('h5', 'p4', 2);
    return chain;
  }

  function createHistidine() {
    const chain = createSideChain()
      .add('r1', 'CH₂', 'ch', 'CA', ANGLE_UP)
      .add('p0', 'C', 'c', 'r1', ANGLE_UP, 1, SMALL_ATOM_R);
    const vertices = pentagonAbove(chain.positions.p0, RING_SIDE).vertices;
    chain.put('p1', 'N', 'n', vertices[1], SMALL_ATOM_R)
      .put('p2', 'CH', 'ch', vertices[2], SMALL_ATOM_R)
      .put('p3', 'NH', 'n', vertices[3], SMALL_ATOM_R)
      .put('p4', 'CH', 'ch', vertices[4], SMALL_ATOM_R);
    chain.bond('p0', 'p1').bond('p1', 'p2', 2).bond('p2', 'p3')
      .bond('p3', 'p4').bond('p4', 'p0', 2);
    return chain;
  }

  const SIDE_CHAIN_BUILDERS = {
    glycine: () => createSideChain().add('r1', 'H', 'h', 'CA', ANGLE_UP, 1, 28),
    alanine: () => createSideChain().up([['r1', 'CH₃', 'ch']]),
    valine: () => createSideChain().add('r1', 'CH', 'ch', 'CA', ANGLE_UP)
      .add('b1', 'CH₃', 'ch', 'r1', ANGLE_LEFT).add('b2', 'CH₃', 'ch', 'r1', ANGLE_RIGHT),
    leucine: () => createSideChain().up([['r1', 'CH₂', 'ch'], ['r2', 'CH', 'ch']])
      .add('b1', 'CH₃', 'ch', 'r2', ANGLE_LEFT).add('b2', 'CH₃', 'ch', 'r2', ANGLE_RIGHT),
    isoleucine: () => createSideChain().add('r1', 'CH', 'ch', 'CA', ANGLE_UP)
      .add('b1', 'CH₃', 'ch', 'r1', ANGLE_LEFT)
      .add('b2', 'CH₂', 'ch', 'r1', ANGLE_RIGHT).add('b3', 'CH₃', 'ch', 'b2', ANGLE_UP),
    proline: createProline,
    methionine: () => createSideChain().up([
      ['r1', 'CH₂', 'ch'], ['r2', 'CH₂', 'ch'], ['r3', 'S', 's'], ['r4', 'CH₃', 'ch']
    ]),
    phenylalanine: () => createPhenyl(false),
    tyrosine: () => createPhenyl(true),
    tryptophan: createTryptophan,
    serine: () => createSideChain().up([['r1', 'CH₂', 'ch'], ['r2', 'OH', 'o']]),
    threonine: () => createSideChain().add('r1', 'CH', 'ch', 'CA', ANGLE_UP)
      .add('b1', 'CH₃', 'ch', 'r1', ANGLE_LEFT).add('b2', 'OH', 'o', 'r1', ANGLE_RIGHT),
    cysteine: () => createSideChain().up([['r1', 'CH₂', 'ch'], ['r2', 'SH', 's']]),
    selenocysteine: () => createSideChain().up([['r1', 'CH₂', 'ch'], ['r2', 'SeH', 'se']]),
    asparagine: () => createSideChain().up([['r1', 'CH₂', 'ch'], ['r2', 'C', 'c']])
      .add('b1', 'O', 'o', 'r2', ANGLE_LEFT, 2).add('b2', 'NH₂', 'n', 'r2', ANGLE_RIGHT),
    glutamine: () => createSideChain().up([
      ['r1', 'CH₂', 'ch'], ['r2', 'CH₂', 'ch'], ['r3', 'C', 'c']
    ]).add('b1', 'O', 'o', 'r3', ANGLE_LEFT, 2).add('b2', 'NH₂', 'n', 'r3', ANGLE_RIGHT),
    lysine: () => createSideChain().up([
      ['r1', 'CH₂', 'ch'], ['r2', 'CH₂', 'ch'], ['r3', 'CH₂', 'ch'],
      ['r4', 'CH₂', 'ch'], ['r5', 'NH₃⁺', 'n']
    ]),
    arginine: () => createSideChain().up([
      ['r1', 'CH₂', 'ch'], ['r2', 'CH₂', 'ch'], ['r3', 'CH₂', 'ch'],
      ['r4', 'NH', 'n'], ['r5', 'C', 'c']
    ]).add('b1', 'NH₂⁺', 'n', 'r5', ANGLE_LEFT, 2).add('b2', 'NH₂', 'n', 'r5', ANGLE_RIGHT),
    histidine: createHistidine,
    'aspartic-acid': () => createSideChain().up([['r1', 'CH₂', 'ch'], ['r2', 'C', 'c']])
      .add('b1', 'O', 'o', 'r2', ANGLE_LEFT, 2).add('b2', 'O⁻', 'o', 'r2', ANGLE_RIGHT),
    'glutamic-acid': () => createSideChain().up([
      ['r1', 'CH₂', 'ch'], ['r2', 'CH₂', 'ch'], ['r3', 'C', 'c']
    ]).add('b1', 'O', 'o', 'r3', ANGLE_LEFT, 2).add('b2', 'O⁻', 'o', 'r3', ANGLE_RIGHT)
  };

  function createBackbone(aa) {
    const hydrogenOne = polar(BACKBONE_ATOMS.N, 230, 30 + 22 + BOND_GAP);
    const hydrogenTwo = polar(BACKBONE_ATOMS.N, 130, 30 + 22 + BOND_GAP);
    const alphaHydrogen = polar(BACKBONE_ATOMS.CA, 90, 30 + 22 + BOND_GAP);
    const oxygen = polar(BACKBONE_ATOMS.C, -40, 30 + 30 + BOND_GAP);
    const hydroxyl = polar(BACKBONE_ATOMS.C, 40, 30 + 30 + BOND_GAP);
    const proline = aa && aa.id === 'proline';
    const atoms = [
      makeAtom('N', 'N', 'n', -86, 0, 30),
      ...(proline ? [] : [makeAtom('HN1', 'H', 'h', hydrogenOne.x, hydrogenOne.y, 22)]),
      makeAtom('HN2', 'H', 'h', hydrogenTwo.x, hydrogenTwo.y, 22),
      makeAtom('CA', 'C', 'c', 0, 0, 30),
      makeAtom('HA', 'H', 'h', alphaHydrogen.x, alphaHydrogen.y, 22),
      makeAtom('C', 'C', 'c', 86, 0, 30),
      makeAtom('O', 'O', 'o', oxygen.x, oxygen.y, 30),
      makeAtom('OH', 'OH', 'o', hydroxyl.x, hydroxyl.y, 30)
    ];
    return {
      atoms,
      bonds: [
        ['N', 'CA', 1], ...(proline ? [] : [['N', 'HN1', 1]]), ['N', 'HN2', 1], ['CA', 'HA', 1],
        ['CA', 'C', 1], ['C', 'O', 2], ['C', 'OH', 1]
      ]
    };
  }

  function makeMolecule(aa) {
    const backbone = createBackbone(aa);
    const sideChain = aa ? SIDE_CHAIN_BUILDERS[aa.id]() : createSideChain().add('R', 'R', 'r', 'CA', ANGLE_UP, 1, 28);
    return { backbone, sideChain };
  }

  function atomMap(graph) {
    const map = {};
    graph.atoms.forEach(atom => { map[atom.id] = atom; });
    if (graph.positions) Object.assign(map, graph.positions);
    return map;
  }

  function atomColor(type) {
    return COLORS[type] || COLORS.c;
  }

  function drawAtom(group, atom) {
    const color = atomColor(atom.type);
    const fontSize = atom.label.length >= 5 ? 13 : atom.r >= 28 ? 20 : atom.r >= 25 ? 17 : 15;
    const circle = mkEl('circle', {
      cx: atom.x, cy: atom.y, r: atom.r,
      fill: color[0], stroke: color[1], 'stroke-width': 3
    });
    const text = mkEl('text', {
      x: atom.x, y: atom.y, fill: color[2],
      'font-size': fontSize, 'font-weight': 700,
      'font-family': 'Roboto, Arial, sans-serif',
      'dominant-baseline': 'central', 'text-anchor': 'middle'
    });
    text.textContent = atom.label;
    group.appendChild(circle);
    group.appendChild(text);
  }

  function drawBond(group, from, to, order) {
    const drawLine = (offsetX, offsetY) => group.appendChild(mkEl('line', {
      class: 'mol-bond',
      x1: from.x + offsetX, y1: from.y + offsetY,
      x2: to.x + offsetX, y2: to.y + offsetY,
      stroke: BOND_COLOR, 'stroke-width': order === 2 ? 4 : 4.2,
      'stroke-linecap': 'round', 'data-bond-order': order || 1
    }));
    if (order === 2) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.hypot(dx, dy);
      const offsetX = -dy / length * 8;
      const offsetY = dx / length * 8;
      drawLine(offsetX, offsetY);
      drawLine(-offsetX, -offsetY);
    } else {
      drawLine(0, 0);
    }
  }

  function drawGraph(group, graph) {
    const atoms = atomMap(graph);
    graph.bonds.forEach(bond => drawBond(group, atoms[bond[0]], atoms[bond[1]], bond[2]));
    graph.atoms.forEach(atom => drawAtom(group, atom));
  }

  function graphBounds(graph) {
    const atoms = graph.backbone.atoms.concat(graph.sideChain.atoms);
    const bounds = atoms.reduce((result, atom) => ({
      left: Math.min(result.left, atom.x - atom.r),
      top: Math.min(result.top, atom.y - atom.r),
      right: Math.max(result.right, atom.x + atom.r),
      bottom: Math.max(result.bottom, atom.y + atom.r)
    }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
    return {
      left: bounds.left - 6,
      top: bounds.top - 6,
      right: bounds.right + 6,
      bottom: bounds.bottom + 6
    };
  }

  function allMoleculeBounds() {
    const molecules = [makeMolecule(null)].concat(AAS.map(makeMolecule));
    return molecules.reduce((result, molecule) => {
      const bounds = graphBounds(molecule);
      return {
        left: Math.min(result.left, bounds.left),
        top: Math.min(result.top, bounds.top),
        right: Math.max(result.right, bounds.right),
        bottom: Math.max(result.bottom, bounds.bottom)
      };
    }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
  }

  const MAX_MOLECULE_BOUNDS = allMoleculeBounds();
  const GENERAL_MOLECULE_BOUNDS = graphBounds(makeMolecule(null));
  function initializeMolecule(svg) {
    const scene = mkEl('g', { class: 'molecule-scene' });
    const backbone = mkEl('g', { class: 'molecule-backbone' });
    const variable = mkEl('g', { class: 'molecule-variable' });
    const backboneGraph = createBackbone(null);
    drawGraph(backbone, backboneGraph);
    scene.appendChild(variable);
    scene.appendChild(backbone);
    svg.appendChild(scene);
    svg._scene = scene;
    svg._backbone = backbone;
    svg._variable = variable;
    svg._backboneProline = false;
  }

  function renderMolecule(svg, aa, animate) {
    if (!svg._scene) initializeMolecule(svg);
    const previous = svg._variable;
    const variable = mkEl('g', {
      class: 'molecule-variable' + (animate ? ' is-entering' : '')
    });
    const molecule = makeMolecule(aa);
    drawGraph(variable, molecule.sideChain);
    const isProline = aa && aa.id === 'proline';
    if (Boolean(isProline) !== svg._backboneProline) {
      while (svg._backbone.firstChild) svg._backbone.removeChild(svg._backbone.firstChild);
      drawGraph(svg._backbone, molecule.backbone);
      svg._backboneProline = Boolean(isProline);
    }
    if (previous && previous.parentNode) {
      if (animate) {
        previous.classList.add('is-fading-out');
        window.setTimeout(() => previous.remove(), 300);
      } else {
        previous.remove();
      }
    }
    svg._scene.insertBefore(variable, svg._backbone);
    svg._variable = variable;
    if (animate) window.requestAnimationFrame(() => variable.classList.remove('is-entering'));
    svg._moleculeBounds = graphBounds(molecule);
    svg.setAttribute('aria-label', aa ? 'Amino acid structure: ' + aa.name : 'General structure of an amino acid');
    layoutMolecules();
  }

  function layoutMolecules() {
    [svg1, svg2].forEach((svg, index) => {
      if (!svg._scene || !svg._moleculeBounds) return;
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      if (!width || !height) return;
      const availableHeight = height;
      const fullHeight = height + 124;
      const maxWidth = MAX_MOLECULE_BOUNDS.right - MAX_MOLECULE_BOUNDS.left;
      const maxHeight = MAX_MOLECULE_BOUNDS.bottom - MAX_MOLECULE_BOUNDS.top;
      const scale = Math.min(1, width / maxWidth, availableHeight / maxHeight);
      const generalCenter = (GENERAL_MOLECULE_BOUNDS.top + GENERAL_MOLECULE_BOUNDS.bottom) / 2;
      const maxCenter = (MAX_MOLECULE_BOUNDS.top + MAX_MOLECULE_BOUNDS.bottom) / 2;
      const centralY = fullHeight / 2 - scale * generalCenter;
      const lowerY = availableHeight / 2 - scale * maxCenter;
      const bounds = svg._moleculeBounds;
      const centralTop = centralY + bounds.top * scale;
      const centralBottom = centralY + bounds.bottom * scale;
      const tooTall = centralTop < 4 || centralBottom > availableHeight;
      const moveDown = compareMode
        ? [svg1, svg2].some(candidate => candidate._moleculeBounds &&
          (centralY + candidate._moleculeBounds.top * scale < 4 ||
           centralY + candidate._moleculeBounds.bottom * scale > availableHeight))
        : tooTall;
      const y = moveDown ? lowerY : centralY;
      svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      const generalCenterX = (GENERAL_MOLECULE_BOUNDS.left + GENERAL_MOLECULE_BOUNDS.right) / 2;
      svg._scene.style.transform = 'translate(' + (width / 2 - generalCenterX * scale) +
        'px, ' + y + 'px) scale(' + scale + ')';
    });
  }

  function drawPlaceholder(svg) {
    renderMolecule(svg, null, false);
  }

  /* ============================================================
     Boot
     ============================================================ */
  buildCategoryPills();
  buildInsightsList();
  repopulateDropdown1();
  drawPlaceholder(svg1);
  drawPlaceholder(svg2);
  layoutMolecules();
  updateInstruction();

  window.addEventListener('resize', fitStage);
  fitStage();

  let tourSeen = false;
  try {
    tourSeen = window.localStorage.getItem('aaExplorerTourSeen') === '1';
  } catch (error) {
    console.warn('Could not read the amino acid help tour state.', error);
  }
  if (!tourSeen) window.setTimeout(() => openHelpTour('tour'), 500);

})();
