'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const TOOLS = window.TOOLS;
  const PROBLEMS = window.PROBLEMS;

  const toolByKey = {};
  TOOLS.forEach((t) => { toolByKey[t.key] = t; });

  const LEVELS = [
    { key: 'low', title: 'Low Effectiveness', sub: 'Not effective for this problem', left: 191 },
    { key: 'medium', title: 'Medium Effectiveness', sub: 'Helps but has limits', left: 571 },
    { key: 'high', title: 'High Effectiveness', sub: 'Most effective here', left: 951 },
  ];
  const LEVEL_LABEL = { low: 'LOW', medium: 'MEDIUM', high: 'HIGH' };

  // Card positions on the 1920x1080 stage, as in the XD design.
  const INTRO_SLOTS = [
    { left: 138, top: 241 }, { left: 688, top: 241 }, { left: 1238, top: 241 },
    { left: 138, top: 471 }, { left: 688, top: 471 }, { left: 1238, top: 471 },
  ];
  const TRAY_TOPS = [264, 373, 483, 592, 702, 812];
  const SLOTS_PER_BOX = 4;
  const PER_SUMMARY_PAGE = 4;
  const DRAG_THRESHOLD = 8; // px of movement before a press counts as a drag

  /* ==========================================================================
     DOM + STAGE SCALING
     ========================================================================== */

  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const stage = $('stage');
  const modalStage = $('modal-stage');
  const screens = {
    intro: $('screen-intro'),
    problem: $('screen-problem'),
    summary: $('screen-summary'),
  };

  let stageScale = 1;

  const fitStage = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / 1920, vh / 1080);
    const x = (vw - 1920 * stageScale) / 2;
    const y = (vh - 1080 * stageScale) / 2;
    const transform = `translate(${x}px, ${y}px) scale(${stageScale})`;
    stage.style.transform = transform;
    modalStage.style.transform = transform; // modals share the stage's position and scale
  };

  fitStage();
  window.addEventListener('resize', fitStage);

  // Turn on the full-viewport modal backdrop (body.has-modal::before) whenever
  // any modal is open, however it was opened or closed.
  const modals = [...document.querySelectorAll('.modal')];
  const syncModalBackdrop = () => {
    body.classList.toggle('has-modal', modals.some((m) => !m.hidden));
  };
  const modalWatcher = new MutationObserver(syncModalBackdrop);
  modals.forEach((m) => modalWatcher.observe(m, { attributes: true, attributeFilter: ['hidden'] }));
  syncModalBackdrop();

  let lastFocus = null;

  const openModal = (id, focusId) => {
    lastFocus = document.activeElement;
    $(id).hidden = false;
    $(focusId).focus();
  };

  const closeModal = (id) => {
    $(id).hidden = true;
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  };

  const showScreen = (name) => {
    Object.keys(screens).forEach((k) => screens[k].classList.toggle('is-active', k === name));
    body.classList.toggle('is-summary', name === 'summary');
    body.classList.toggle('is-plain', name !== 'intro');
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const iconImg = (tool) => {
    const img = document.createElement('img');
    img.src = `assets/images/${tool.icon}`;
    img.alt = '';
    return img;
  };

  const pad2 = (n) => String(n).padStart(2, '0');

  /* ==========================================================================
     INTRO
     ========================================================================== */

  const buildIntro = () => {
    const holder = $('toolCards');
    window.INTRO_ORDER.forEach((key, i) => {
      const tool = toolByKey[key];
      const card = el('div', 'tool-card');
      card.style.left = `${INTRO_SLOTS[i].left}px`;
      card.style.top = `${INTRO_SLOTS[i].top}px`;
      card.style.background = tool.color;
      card.appendChild(iconImg(tool));
      card.appendChild(el('h4', 'tool-card__name', tool.name));
      card.appendChild(el('p', 'tool-card__desc', tool.desc));
      holder.appendChild(card);
    });
  };

  /* ==========================================================================
     PROBLEM SCREEN
     ========================================================================== */

  const state = {
    index: 0,
    placed: {}, // tool key -> level it was placed in
    selected: null, // tool picked by tapping, waiting for a box
    completed: new Set(), // problems whose six tools were all placed
    summaryPage: 0,
  };

  const boxEls = {};
  const slotEls = {};
  const chipEls = {};

  const buildBoxes = () => {
    const holder = $('boxes');
    LEVELS.forEach((level) => {
      const box = el('div', `box box--${level.key}`);
      box.dataset.level = level.key;
      box.style.left = `${level.left}px`;
      box.setAttribute('role', 'button');
      box.setAttribute('aria-label', `${level.title}. ${level.sub}. Drop tools here.`);
      box.appendChild(el('h4', 'box__title', level.title));
      box.appendChild(el('p', 'box__sub', level.sub));
      slotEls[level.key] = [];
      for (let i = 0; i < SLOTS_PER_BOX; i++) {
        const slot = el('div', 'slot');
        slot.style.top = `${85 + i * 91}px`;
        box.appendChild(slot);
        slotEls[level.key].push(slot);
      }
      holder.appendChild(box);
      boxEls[level.key] = box;
      box.addEventListener('click', () => {
        if (!state.selected) return;
        const key = state.selected;
        clearSelection();
        placeTool(key, level.key);
      });
    });
  };

  const updateCounter = () => {
    $('counter').textContent = `${pad2(state.completed.size)} of ${pad2(PROBLEMS.length)}`;
  };

  const setNextEnabled = (on) => {
    $('nextBtn').disabled = !on;
  };

  const showFeedback = (text) => {
    $('feedbackText').textContent = text;
    $('feedback').classList.add('is-shown');
  };

  const clearFeedback = () => {
    $('feedbackText').textContent = '';
    $('feedback').classList.remove('is-shown');
  };

  const clearSelection = () => {
    state.selected = null;
    Object.keys(chipEls).forEach((k) => chipEls[k].classList.remove('is-selected'));
  };

  const loadProblem = () => {
    const problem = PROBLEMS[state.index];
    state.placed = {};
    clearSelection();
    clearFeedback();
    setNextEnabled(false);
    updateCounter();
    $('problemText').textContent = problem.text;
    LEVELS.forEach((l) => slotEls[l.key].forEach((slot) => { slot.innerHTML = ''; }));

    const tray = $('tray');
    tray.innerHTML = '';
    window.TRAY_ORDER.forEach((key, i) => {
      const tool = toolByKey[key];
      const chip = el('div', 'chip');
      chip.dataset.tool = key;
      chip.style.top = `${TRAY_TOPS[i]}px`;
      chip.style.background = tool.color;
      chip.tabIndex = 0;
      chip.setAttribute('role', 'button');
      chip.setAttribute('aria-label', `${tool.name}. ${tool.desc}. Drag into a box, or tap it and then tap a box.`);
      chip.appendChild(iconImg(tool));
      chip.appendChild(el('span', 'chip__name', tool.name));
      chip.appendChild(el('span', 'chip__desc', tool.desc));
      tray.appendChild(chip);
      chipEls[key] = chip;
      chip.addEventListener('pointerdown', (e) => onChipDown(e, key));
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSelected(key);
        }
      });
    });
  };

  const toggleSelected = (key) => {
    if (state.placed[key]) return;
    const was = state.selected === key;
    clearSelection();
    if (!was) {
      state.selected = key;
      chipEls[key].classList.add('is-selected');
    }
  };

  const placeTool = (key, level) => {
    if (state.placed[key]) return;
    const problem = PROBLEMS[state.index];
    const [correct, why] = problem.tools[key];
    const tool = toolByKey[key];
    showFeedback(`${tool.name} — ${why}`);

    const chip = chipEls[key];
    if (level !== correct) {
      chip.classList.remove('is-shake');
      void chip.offsetWidth;
      chip.classList.add('is-shake');
      return;
    }

    state.placed[key] = level;
    chip.classList.add('is-placed');
    const slot = slotEls[level].find((s) => !s.firstChild);
    if (slot) {
      const row = el('div', 'placed');
      row.style.background = tool.color;
      row.appendChild(iconImg(tool));
      row.appendChild(el('span', '', tool.name));
      slot.appendChild(row);
    }

    if (Object.keys(state.placed).length === TOOLS.length) {
      state.completed.add(state.index);
      updateCounter();
      setNextEnabled(true);
    }
  };

  /* ---- drag with pointer events (mouse and touch); a press that barely moves is a tap ---- */

  const boxAt = (clientX, clientY) => {
    const hit = document.elementsFromPoint(clientX, clientY).find((n) => n.classList && n.classList.contains('box'));
    return hit ? hit.dataset.level : null;
  };

  const toStage = (clientX, clientY) => {
    const r = stage.getBoundingClientRect();
    return [(clientX - r.left) / stageScale, (clientY - r.top) / stageScale];
  };

  const onChipDown = (e, key) => {
    if (state.placed[key]) return;
    if (e.button !== undefined && e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const chip = chipEls[key];
    let ghost = null;
    let overLevel = null;

    const setOver = (level) => {
      if (level === overLevel) return;
      if (overLevel) boxEls[overLevel].classList.remove('is-over');
      overLevel = level;
      if (level) boxEls[level].classList.add('is-over');
    };

    const onMove = (ev) => {
      if (!ghost && Math.hypot(ev.clientX - startX, ev.clientY - startY) > DRAG_THRESHOLD) {
        clearSelection();
        ghost = chip.cloneNode(true);
        ghost.classList.add('chip-ghost');
        stage.appendChild(ghost);
        chip.classList.add('is-dragging');
      }
      if (!ghost) return;
      const [x, y] = toStage(ev.clientX, ev.clientY);
      ghost.style.left = `${x - 395 / 2}px`; // the card is positioned by its left/top
      ghost.style.top = `${y - 45}px`;
      setOver(boxAt(ev.clientX, ev.clientY));
    };

    const finish = (ev, cancelled) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      setOver(null);
      chip.classList.remove('is-dragging');
      if (ghost) {
        ghost.remove();
        if (!cancelled) {
          const level = boxAt(ev.clientX, ev.clientY);
          if (level) placeTool(key, level);
        }
      } else if (!cancelled) {
        toggleSelected(key);
      }
    };
    const onUp = (ev) => finish(ev, false);
    const onCancel = (ev) => finish(ev, true);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    e.preventDefault();
  };

  /* ==========================================================================
     SUMMARY
     ========================================================================== */

  const pageCount = Math.ceil(PROBLEMS.length / PER_SUMMARY_PAGE);

  const renderSummary = () => {
    const page = state.summaryPage;
    const holder = $('summary');
    holder.innerHTML = '';

    const head = el('div', 'summary__row summary__head');
    head.appendChild(el('div', 'h-problem', 'Problem'));
    ['low', 'medium', 'high'].forEach((lv) => head.appendChild(el('div', `h-${lv}`, LEVEL_LABEL[lv])));
    holder.appendChild(head);

    PROBLEMS.slice(page * PER_SUMMARY_PAGE, (page + 1) * PER_SUMMARY_PAGE).forEach((problem) => {
      const row = el('div', 'summary__row');
      const label = el('div', 'summary__problem');
      label.appendChild(iconImg(toolByKey[problem.icon]));
      label.appendChild(el('span', '', problem.short));
      row.appendChild(label);
      ['low', 'medium', 'high'].forEach((lv) => {
        const names = TOOLS.filter((t) => problem.tools[t.key][0] === lv).map((t) => t.name);
        const cell = el('div', `summary__cell ${lv}`);
        if (names.length) cell.textContent = names.join(', ');
        else { cell.classList.add('is-empty'); cell.textContent = '–'; }
        row.appendChild(cell);
      });
      holder.appendChild(row);
    });

    const last = page === pageCount - 1;
    $('takeaway').hidden = !last;
    $('summaryBack').hidden = page === 0;
    $('summaryNext').hidden = last;
    $('restartBtn').hidden = !last;
  };

  const showSummary = () => {
    state.summaryPage = 0;
    renderSummary();
    showScreen('summary');
  };

  /* ==========================================================================
     NAVIGATION
     ========================================================================== */

  const goHome = () => {
    state.index = 0;
    state.completed = new Set();
    showScreen('intro');
  };

  $('startBtn').addEventListener('click', () => {
    state.index = 0;
    state.completed = new Set();
    showScreen('problem');
    loadProblem();
  });

  $('nextBtn').addEventListener('click', () => {
    if ($('nextBtn').disabled) return;
    if (state.index < PROBLEMS.length - 1) {
      state.index++;
      loadProblem();
    } else {
      showSummary();
    }
  });

  $('backBtn').addEventListener('click', () => {
    if (state.index === 0) {
      goHome();
    } else {
      state.index--;
      loadProblem();
    }
  });

  $('homeBtn').addEventListener('click', () => openModal('leaveModal', 'leaveCancel'));
  $('leaveCancel').addEventListener('click', () => closeModal('leaveModal'));
  $('leaveConfirm').addEventListener('click', () => {
    closeModal('leaveModal');
    goHome();
  });

  $('summaryNext').addEventListener('click', () => {
    state.summaryPage++;
    renderSummary();
  });
  $('summaryBack').addEventListener('click', () => {
    state.summaryPage--;
    renderSummary();
  });
  $('restartBtn').addEventListener('click', goHome);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('leaveModal').hidden) closeModal('leaveModal');
  });

  /* ==========================================================================
     TEST HELPERS (console)
       nextStep()      do the next step: Start -> sort the remaining tools correctly
                       -> Next ... -> through the summary pages -> Restart
       autoPlay(ms)    call nextStep() every `ms` (default 500); autoPlay(0) stops
       goToSummary()   fill every problem in and jump to the first summary page
     ========================================================================== */

  let autoTimer = null;

  window.nextStep = () => {
    if (screens.intro.classList.contains('is-active')) {
      $('startBtn').click();
      return 'start';
    }
    if (screens.problem.classList.contains('is-active')) {
      if ($('nextBtn').disabled) {
        const problem = PROBLEMS[state.index];
        TOOLS.forEach((t) => placeTool(t.key, problem.tools[t.key][0]));
        return `problem ${state.index + 1}: sorted`;
      }
      const n = state.index + 1;
      $('nextBtn').click();
      return `problem ${n}: next`;
    }
    if (!$('summaryNext').hidden) {
      $('summaryNext').click();
      return `summary page ${state.summaryPage + 1}`;
    }
    $('restartBtn').click();
    return 'restart';
  };

  window.autoPlay = (ms = 500) => {
    clearInterval(autoTimer);
    autoTimer = null;
    if (ms) autoTimer = setInterval(() => console.log(window.nextStep()), ms);
  };

  window.goToSummary = () => {
    state.completed = new Set();
    PROBLEMS.forEach((problem, i) => {
      state.index = i;
      state.completed.add(i);
    });
    showSummary();
    return 'summary';
  };

  buildIntro();
  buildBoxes();
});
