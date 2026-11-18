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
  let selectedAA1    = null;
  let selectedAA2    = null;
  let compareMode    = false;
  let compareType    = 'same'; // 'same' | 'across'

  /* ============================================================
     Stage scaling (wg184 pattern)
     ============================================================ */
  function fitStage() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    const x = (window.innerWidth  - 1920 * scale) / 2;
    const y = (window.innerHeight - 1080 * scale) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
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
      btn.setAttribute('aria-pressed', String(cat.id === 'all'));
      btn.addEventListener('click', () => onCategoryClick(cat.id));
      categoryPills.appendChild(btn);
    });
  }

  function onCategoryClick(catId) {
    activeCategory = catId;
    updateCategoryPills();
    clearSlot1(false);
    if (compareMode && compareType === 'same') clearSlot2(false);
    repopulateDropdown1();
    updateInstruction();
  }

  function updateCategoryPills() {
    document.querySelectorAll('.cat-pill').forEach(btn => {
      const active = btn.dataset.catId === activeCategory;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  /* ============================================================
     Filtered amino acids
     ============================================================ */
  function getFiltered(catId) {
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
    toggleList(ddList1, ddBtn1);
  });

  function onSelectAA1(aa) {
    selectedAA1 = aa;
    ddLabel1.textContent = aa.name;
    closeList(ddList1, ddBtn1);
    repopulateDropdown1();
    renderMolecule(svg1, aa);
    renderCardInfo(header1, badge1, info1, badges1, insights1, aa);

    if (compareMode) {
      compareTabs.hidden      = false;
      ddWrapper2.hidden       = false;
      repopulateDropdown2();
    }
    updateInstruction();
  }

  /* ============================================================
     Dropdown 2
     ============================================================ */
  function getFiltered2() {
    if (!selectedAA1) return AAS;
    if (compareType === 'same') {
      const sameCat = selectedAA1.categories[0];
      return getFiltered(sameCat).filter(aa => aa.id !== selectedAA1.id);
    }
    return AAS.filter(aa => aa.id !== selectedAA1.id);
  }

  function repopulateDropdown2() {
    populateList(ddList2, getFiltered2(), selectedAA2 ? selectedAA2.id : null, onSelectAA2);
  }

  ddBtn2.addEventListener('click', e => {
    e.stopPropagation();
    toggleList(ddList2, ddBtn2);
  });

  function onSelectAA2(aa) {
    selectedAA2 = aa;
    ddLabel2.textContent = aa.name;
    closeList(ddList2, ddBtn2);
    repopulateDropdown2();
    renderMolecule(svg2, aa);
    renderCardInfo(header2, badge2, info2, badges2, insights2, aa);
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
    updateInstruction();
  }

  [tabSame, tabAcross].forEach(tab => {
    tab.addEventListener('click', () => {
      compareType = tab.dataset.mode;
      tabSame.classList.toggle('is-active',   compareType === 'same');
      tabAcross.classList.toggle('is-active', compareType === 'across');
      clearSlot2(false);
      if (selectedAA1) repopulateDropdown2();
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
      instructionText.innerHTML =
        'Select a <strong><em>category</em></strong>, then pick amino acid <strong>1</strong>';
    } else if (!selectedAA2) {
      instructionText.innerHTML = compareType === 'across'
        ? 'Amino acid 2 — select a <strong>different category</strong> above'
        : 'Select a <strong><em>category</em></strong>, then pick amino acid <strong>2</strong>';
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
    updateInstruction();
  }

  function clearSlot2(hide) {
    selectedAA2 = null;
    ddLabel2.textContent = 'Choose Amino Acid';
    header2.hidden = true;
    info2.hidden   = true;
    drawPlaceholder(svg2);
    if (hide) card2.hidden = true;
    updateInstruction();
  }

  /* ============================================================
     Reset
     ============================================================ */
  function resetWidget() {
    compareChk.checked = false;
    compareMode = false;
    compareType = 'same';
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
      li.textContent = txt;
      insightsList.appendChild(li);
    });
  }

  /* ============================================================
     SVG molecule renderer
     ============================================================ */
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const ATOM_STYLE = {
    N:   { fill: '#7B68EE', stroke: '#5a4fce', text: '#fff' },
    C:   { fill: '#fff',    stroke: '#bbb',    text: '#333' },
    O:   { fill: '#3CD070', stroke: '#2abe5e', text: '#fff' },
    OH:  { fill: '#3CD070', stroke: '#2abe5e', text: '#fff' },
    H:   { fill: '#F5A623', stroke: '#d4891c', text: '#fff' },
    R:   { fill: '#E8826A', stroke: '#c5614d', text: '#fff' }
  };

  function atomStyle(label) {
    if (ATOM_STYLE[label]) return ATOM_STYLE[label];
    if (label.startsWith('CH') || label === 'C=O' || label === 'C')
      return { fill: '#F5A623', stroke: '#d4891c', text: '#fff' };
    if (label === 'NH' || label === 'NH₂' || label === 'N')
      return ATOM_STYLE.N;
    if (label === 'S' || label === 'SH' || label === 'SeH')
      return { fill: '#F5A623', stroke: '#d4891c', text: '#fff' };
    if (label.includes('COO') || label === 'C=O')
      return { fill: '#9B59B6', stroke: '#7d4a99', text: '#fff' };
    return { fill: '#ddd', stroke: '#bbb', text: '#333' };
  }

  function mkEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function drawNode(svg, cx, cy, label, r) {
    r = r || (label.length > 3 ? 26 : label.length > 2 ? 29 : 33);
    const s  = atomStyle(label);
    const fs = label.length > 3 ? 13 : label.length > 2 ? 15 : 19;

    const c = mkEl('circle', { cx, cy, r, fill: s.fill, stroke: s.stroke, 'stroke-width': 3 });
    const t = mkEl('text', {
      x: cx, y: cy,
      fill: s.text,
      'font-size': fs,
      'font-weight': 700,
      'font-family': 'Roboto, sans-serif',
      'dominant-baseline': 'central',
      'text-anchor': 'middle'
    });
    t.textContent = label;
    svg.appendChild(c);
    svg.appendChild(t);
  }

  function drawBond(svg, x1, y1, x2, y2, dashed) {
    const attrs = {
      x1, y1, x2, y2,
      stroke: '#c0392b',
      'stroke-width': 3,
      'stroke-linecap': 'round'
    };
    if (dashed) attrs['stroke-dasharray'] = '8 6';
    svg.insertBefore(mkEl('line', attrs), svg.firstChild);
  }

  /* ---- backbone positions (viewBox 0 0 500 400) ---- */
  const BB = {
    CX:  250, CY:  230,
    C2X: 350, C2Y: 230,
    NX:  150, NY:  230,
    H1X: 110, H1Y: 185,
    H2X: 110, H2Y: 275,
    HaX: 250, HaY: 310,
    OX:  410, OY:  175,
    OHX: 410, OHY: 285,
    TOP_Y: 170           // where R-group attaches (top of backbone bond)
  };

  function drawBackbone(svg) {
    const { CX, CY, C2X, C2Y, NX, NY, H1X, H1Y, H2X, H2Y, HaX, HaY, OX, OY, OHX, OHY, TOP_Y } = BB;
    // bonds
    drawBond(svg, NX, NY, CX, CY);
    drawBond(svg, CX, CY, C2X, C2Y);
    drawBond(svg, NX, NY, H1X, H1Y);
    drawBond(svg, NX, NY, H2X, H2Y);
    drawBond(svg, CX, CY, HaX, HaY);
    drawBond(svg, C2X, C2Y, OX, OY);
    drawBond(svg, C2X, C2Y, OHX, OHY);
    // R-group connector
    drawBond(svg, CX, CY, CX, TOP_Y);
    // nodes
    drawNode(svg, NX, NY, 'N');
    drawNode(svg, CX, CY, 'C');
    drawNode(svg, C2X, C2Y, 'C');
    drawNode(svg, H1X, H1Y, 'H', 24);
    drawNode(svg, H2X, H2Y, 'H', 24);
    drawNode(svg, HaX, HaY, 'H', 24);
    drawNode(svg, OX, OY, 'O');
    drawNode(svg, OHX, OHY, 'OH');
  }

  /* ---- R-group: placeholder (R box) ---- */
  function drawRBox(svg, cx, cy) {
    const rect = mkEl('rect', {
      x: cx - 42, y: cy - 30,
      width: 84, height: 60,
      rx: 14, ry: 14,
      fill: '#E8826A', stroke: '#c5614d', 'stroke-width': 3
    });
    const txt = mkEl('text', {
      x: cx, y: cy,
      fill: '#fff', 'font-size': 26, 'font-weight': 700,
      'font-family': 'Roboto, sans-serif',
      'dominant-baseline': 'central', 'text-anchor': 'middle'
    });
    txt.textContent = 'R';
    svg.appendChild(rect);
    svg.appendChild(txt);
  }

  /* ---- R-group: chain ---- */
  function drawChainR(svg, cx, topY, rg) {
    if (!rg.nodes || rg.nodes.length === 0) return;
    const pts = rg.nodes.map(n => ({ ...n, ax: cx + n.x, ay: topY - n.y }));

    // bond from backbone to first node
    drawBond(svg, cx, topY, pts[0].ax, pts[0].ay);
    // inter-node bonds
    (rg.bonds || []).forEach(b => {
      drawBond(svg, pts[b.from].ax, pts[b.from].ay, pts[b.to].ax, pts[b.to].ay, b.dashed);
    });
    // nodes
    pts.forEach(n => drawNode(svg, n.ax, n.ay, n.label));
  }

  /* ---- R-group: benzene ring ---- */
  function drawBenzeneR(svg, cx, topY, stemLabel) {
    const stemEndY = topY - 36;
    drawBond(svg, cx, topY, cx, stemEndY);
    if (stemLabel) drawNode(svg, cx, topY, stemLabel, 27);

    const r = 48, cy6 = stemEndY - 15;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60 - 90) * Math.PI / 180;
      return { x: cx + r * Math.cos(a), y: cy6 + r * Math.sin(a) };
    });
    for (let i = 0; i < 6; i++) {
      const j = (i + 1) % 6;
      drawBond(svg, pts[i].x, pts[i].y, pts[j].x, pts[j].y);
    }
    pts.forEach(p => drawNode(svg, p.x, p.y, 'C', 18));
    drawBond(svg, cx, stemEndY, pts[0].x, pts[0].y);
  }

  /* ---- R-group: phenol (benzene + OH) ---- */
  function drawPhenolR(svg, cx, topY, stemLabel) {
    drawBenzeneR(svg, cx, topY, stemLabel);
    const r = 48, cy6 = topY - 36 - 15;
    const a4 = (4 * 60 - 90) * Math.PI / 180;
    const p4x = cx + r * Math.cos(a4), p4y = cy6 + r * Math.sin(a4);
    drawBond(svg, p4x, p4y, p4x + 44, p4y);
    drawNode(svg, p4x + 44, p4y, 'OH', 24);
  }

  /* ---- R-group: imidazole ring ---- */
  function drawImidazoleR(svg, cx, topY, stemLabel) {
    const stemEndY = topY - 36;
    drawBond(svg, cx, topY, cx, stemEndY);
    if (stemLabel) drawNode(svg, cx, topY, stemLabel, 27);

    const r = 46, cy5 = stemEndY - 20;
    const pts = Array.from({ length: 5 }, (_, i) => {
      const a = (i * 72 - 90) * Math.PI / 180;
      return { x: cx + r * Math.cos(a), y: cy5 + r * Math.sin(a) };
    });
    for (let i = 0; i < 5; i++) drawBond(svg, pts[i].x, pts[i].y, pts[(i+1)%5].x, pts[(i+1)%5].y);
    ['C', 'N', 'C', 'N', 'C'].forEach((lbl, i) => drawNode(svg, pts[i].x, pts[i].y, lbl, 18));
    drawBond(svg, cx, stemEndY, pts[0].x, pts[0].y);
  }

  /* ---- R-group: indole ring ---- */
  function drawIndoleR(svg, cx, topY, stemLabel) {
    const stemEndY = topY - 36;
    drawBond(svg, cx, topY, cx, stemEndY);
    if (stemLabel) drawNode(svg, cx, topY, stemLabel, 27);

    const cx5 = cx - 24, cy5 = stemEndY - 55, r5 = 34;
    const pts5 = Array.from({ length: 5 }, (_, i) => {
      const a = (i * 72 - 90) * Math.PI / 180;
      return { x: cx5 + r5 * Math.cos(a), y: cy5 + r5 * Math.sin(a) };
    });
    for (let i = 0; i < 5; i++) drawBond(svg, pts5[i].x, pts5[i].y, pts5[(i+1)%5].x, pts5[(i+1)%5].y);
    pts5.forEach(p => drawNode(svg, p.x, p.y, 'C', 15));

    const cx6 = cx + 28, r6 = 38;
    const pts6 = Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60 - 90) * Math.PI / 180;
      return { x: cx6 + r6 * Math.cos(a), y: cy5 + r6 * Math.sin(a) };
    });
    for (let i = 0; i < 6; i++) drawBond(svg, pts6[i].x, pts6[i].y, pts6[(i+1)%6].x, pts6[(i+1)%6].y);
    pts6.forEach(p => drawNode(svg, p.x, p.y, 'C', 15));

    drawBond(svg, cx, stemEndY, pts5[0].x, pts5[0].y);
  }

  /* ---- draw placeholder (empty card) ---- */
  function drawPlaceholder(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    drawBackbone(svg);
    drawRBox(svg, BB.CX, BB.TOP_Y - 30);
  }

  /* ---- main: render a specific amino acid ---- */
  function renderMolecule(svg, aa) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    drawBackbone(svg);

    const rg = aa ? aa.rGroup : null;
    const cx = BB.CX, topY = BB.TOP_Y;

    if (!rg) { drawRBox(svg, cx, topY - 30); return; }

    switch (rg.type) {
      case 'simple':
        drawBond(svg, cx, topY, cx, topY - 55);
        drawNode(svg, cx, topY - 55, rg.label);
        break;
      case 'chain':
      case 'ring-chain':
        drawChainR(svg, cx, topY, rg);
        break;
      case 'benzene':
        drawBenzeneR(svg, cx, topY, rg.stemLabel);
        break;
      case 'phenol':
        drawPhenolR(svg, cx, topY, rg.stemLabel);
        break;
      case 'imidazole':
        drawImidazoleR(svg, cx, topY, rg.stemLabel);
        break;
      case 'indole':
        drawIndoleR(svg, cx, topY, rg.stemLabel);
        break;
      default:
        drawRBox(svg, cx, topY - 30);
    }
  }

  /* ============================================================
     Boot
     ============================================================ */
  buildCategoryPills();
  buildInsightsList();
  repopulateDropdown1();
  drawPlaceholder(svg1);
  drawPlaceholder(svg2);
  updateInstruction();

  window.addEventListener('resize', fitStage);
  fitStage();

})();
