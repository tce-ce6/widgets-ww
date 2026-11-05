/* Picture Stories (wg242): build a story from a picture in five steps, for each of five pictures. */
(function () {
  'use strict';

  const STORIES = window.PICTURE_STORIES;
  const STEPS = ['notice', 'outline', 'build', 'title', 'read'];
  const PART_LABELS = ['Beginning', 'Middle: the problem', 'Middle: the turning point', 'Ending'];
  const LETTERS = ['A', 'B', 'C'];
  const SLOT_COUNT = 4;
  const SLOT_FONT_MIN = 20;
  /* The picture's padding box on the stage: the tap areas in the content are in stage coordinates. */
  const PICTURE_X = 468;
  const PICTURE_Y = 202;

  const MSG_BACKGROUND = "That's in the picture, but it doesn't make you wonder about anything. Try something else.";
  const MSG_ALL_FOUND = 'These four details will help you keep your story connected to the picture.';

  const $ = (id) => document.getElementById(id);

  const stage = $('stage');
  const modalStage = $('modal-stage');
  const stepScreen = $('screen-step');
  const stepHeading = $('stepHeading');
  const stepLine = $('stepLine');
  const pictureImg = $('pictureImg');
  const zonesBox = $('zones');
  const slotsBox = $('slots');
  const cardsBox = $('cards');
  const partPill = $('partPill');
  const feedback = $('feedback');
  const backBtn = $('backBtn');
  const nextBtn = $('nextBtn');
  const helpCard = $('helpCard');

  const completed = new Set();
  let helpReturn = null;

  /* The current story: what is on screen, and the answers found so far in this attempt. */
  let story = null;
  let run = null;

  /** Fits the fixed 1920x1080 stage (and the popup stage) inside the window, centred. */
  function fitStage() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    const x = (window.innerWidth - 1920 * scale) / 2;
    const y = (window.innerHeight - 1080 * scale) / 2;
    const transform = `translate(${x}px, ${y}px) scale(${scale})`;
    stage.style.transform = transform;
    modalStage.style.transform = transform;
  }

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  /** Shows a screen and moves focus to its heading, so that keyboard and screen reader users follow along. */
  function showScreen(id, heading) {
    document.querySelectorAll('.screen.is-active').forEach((screen) => screen.classList.remove('is-active'));
    $(`screen-${id}`).classList.add('is-active');
    if (heading) heading.focus({ preventScroll: true });
  }

  function setFeedback(kind, lead, text) {
    feedback.textContent = '';
    feedback.hidden = !kind;
    if (!kind) return;
    feedback.className = `feedback is-${kind}`;
    if (lead) {
      feedback.append(el('b', '', lead), ` ${text}`);
    } else {
      feedback.textContent = text;
    }
  }

  /* ---------- picture cards (menu and completion) ---------- */

  function pictureCard(tag, index) {
    const card = el(tag, 'picture-card');
    const img = el('img');
    img.src = STORIES[index].image;
    img.alt = tag === 'button' ? '' : STORIES[index].alt;
    card.append(img);
    return card;
  }

  function addTick(card) {
    card.append(el('span', 'tick'));
  }

  function renderMenu() {
    const grid = $('menuGrid');
    grid.textContent = '';
    STORIES.forEach((item, index) => {
      const card = pictureCard('button', index);
      card.type = 'button';
      const done = completed.has(index);
      card.setAttribute('aria-label', `${item.alt}${done ? ' Story finished.' : ''}`);
      if (done) addTick(card);
      card.addEventListener('click', () => openStory(index));
      grid.append(card);
    });
  }

  function showMenu() {
    renderMenu();
    showScreen('menu', $('menuHeading'));
  }

  function showStart() {
    showScreen('start');
    $('startBtn').focus({ preventScroll: true });
  }

  function showDone() {
    const grid = $('doneGrid');
    grid.textContent = '';
    STORIES.forEach((item, index) => {
      const card = pictureCard('div', index);
      addTick(card);
      grid.append(card);
    });
    showScreen('done', $('doneHeading'));
  }

  /* ---------- story flow ---------- */

  function openStory(index) {
    story = { index, data: STORIES[index] };
    run = {
      found: [],
      outline: { solved: false, picked: null, repeat: false },
      parts: story.data.parts.map(() => ({ solved: false, picked: null, repeat: false })),
      title: { solved: false, picked: null, repeat: false },
    };
    pictureImg.src = story.data.image;
    pictureImg.alt = story.data.alt;
    renderZones();
    showNotice();
  }

  function renderProgress(bar, step) {
    const current = STEPS.indexOf(step);
    bar.textContent = '';
    STEPS.forEach((name, index) => {
      const item = el('li', index < current ? 'is-done' : index === current ? 'is-now' : '');
      const state = index < current ? 'done' : index === current ? 'current' : 'to do';
      item.setAttribute('aria-label', `${name}: ${state}`);
      bar.append(item);
    });
  }

  function setStep(step, heading, line, italic) {
    stepScreen.dataset.step = step;
    stepHeading.textContent = heading;
    stepLine.className = `line${italic ? ' line--italic' : ''}`;
    stepLine.textContent = line;
    renderProgress($('progress'), step);
    showScreen('step', stepHeading);
  }

  function setNav(backLabel, onBack, nextLabel, onNext, nextEnabled) {
    backBtn.textContent = backLabel;
    backBtn.onclick = onBack;
    nextBtn.textContent = nextLabel;
    nextBtn.onclick = onNext;
    nextBtn.disabled = !nextEnabled;
  }

  /* ---------- step 1: notice the details ---------- */

  function placeRect(node, [x, y, width, height]) {
    node.style.left = `${x - PICTURE_X}px`;
    node.style.top = `${y - PICTURE_Y}px`;
    node.style.width = `${width}px`;
    node.style.height = `${height}px`;
  }

  /** Background items come first, so that detail areas sit on top wherever they overlap. */
  function renderZones() {
    zonesBox.textContent = '';
    story.data.background.forEach((item) => {
      const zone = el('button', 'zone');
      zone.type = 'button';
      zone.setAttribute('aria-label', item.name);
      placeRect(zone, item.rect);
      zone.addEventListener('click', onBackgroundTap);
      zonesBox.append(zone);
    });
    story.data.details.forEach((detail, index) => {
      detail.rects.forEach((rect) => {
        const zone = el('button', 'zone');
        zone.type = 'button';
        zone.dataset.detail = index;
        zone.setAttribute('aria-label', detail.name);
        placeRect(zone, rect);
        zone.addEventListener('click', () => onDetailTap(index));
        zonesBox.append(zone);
      });
    });
  }

  function onBackgroundTap() {
    if (run.found.length === SLOT_COUNT) return;
    setFeedback('wrong', '', MSG_BACKGROUND);
  }

  function onDetailTap(index) {
    if (run.found.includes(index)) return;
    run.found.push(index);
    renderNoticeState();
  }

  /** Shrinks a filled box's text until it fits: some questions are much longer than others. */
  function fitSlot(slot) {
    let size = parseFloat(getComputedStyle(slot).fontSize);
    while (slot.scrollHeight > slot.clientHeight && size > SLOT_FONT_MIN) {
      size -= 1;
      slot.style.fontSize = `${size}px`;
    }
  }

  function renderNoticeState() {
    slotsBox.textContent = '';
    for (let i = 0; i < SLOT_COUNT; i += 1) {
      const detail = story.data.details[run.found[i]];
      const slot = el('div', detail ? 'slot is-full' : 'slot', detail ? undefined : '?');
      if (detail) {
        slot.append(el('b', '', detail.name), el('span', '', detail.question));
      }
      slotsBox.append(slot);
      if (detail) fitSlot(slot);
    }
    zonesBox.querySelectorAll('[data-detail]').forEach((zone) => {
      const found = run.found.includes(Number(zone.dataset.detail));
      zone.classList.toggle('is-found', found);
      if (found) {
        zone.setAttribute('aria-label', `${story.data.details[zone.dataset.detail].name}: found`);
      }
    });
    const allFound = run.found.length === SLOT_COUNT;
    if (allFound) {
      setFeedback('right', 'Great!', MSG_ALL_FOUND);
    } else {
      setFeedback();
    }
    nextBtn.disabled = !allFound;
  }

  function showNotice() {
    setStep('notice', 'What makes you wonder?', 'Tap four things in the picture that make you ask a question.', true);
    setNav('All pictures', showMenu, 'Next', showOutline, false);
    renderNoticeState();
  }

  /* ---------- steps 2 to 4: pick one option ---------- */

  /**
   * Draws the option cards for a step.
   * Wrong tap: card turns red, with the hint. Same wrong card again: its tag instead of the hint.
   * Correct tap: every card shows its tag, the cards lock and the next button wakes up.
   */
  function renderChoice(options, state, renderBody) {
    cardsBox.textContent = '';
    options.forEach((option, index) => {
      const card = el('button', 'card');
      card.type = 'button';
      card.disabled = state.solved;
      if (state.solved || state.picked === index) {
        card.classList.add(option.correct ? 'is-right' : 'is-wrong');
      }
      const body = el('span', 'card-body');
      renderBody(body, option);
      card.append(body, el('span', 'card-letter', LETTERS[index]));
      card.setAttribute('aria-label', `Option ${LETTERS[index]}. ${body.textContent}`);
      if (state.solved) {
        card.append(el('span', `card-tag${option.correct ? ' is-right' : ''}`, option.tag));
      }
      card.addEventListener('click', () => onPick(options, state, index, renderBody));
      cardsBox.append(card);
    });

    nextBtn.disabled = !state.solved;
    if (state.solved) {
      setFeedback('right', 'Yes!', options.find((option) => option.correct).feedback);
    } else if (state.picked !== null) {
      const option = options[state.picked];
      const message = state.repeat ? `${option.tag}.` : option.hint;
      setFeedback('wrong', 'Not quite.', `${message} Try again.`);
    } else {
      setFeedback();
    }
  }

  function onPick(options, state, index, renderBody) {
    if (options[index].correct) {
      state.solved = true;
      state.picked = index;
    } else {
      state.repeat = state.picked === index;
      state.picked = index;
    }
    renderChoice(options, state, renderBody);
    if (state.solved) nextBtn.focus({ preventScroll: true });
  }

  function outlineBody(body, option) {
    const list = el('dl');
    option.parts.forEach((part, index) => {
      list.append(el('dt', '', PART_LABELS[index]), el('dd', '', part));
    });
    body.append(list);
  }

  const textBody = (body, option) => {
    body.textContent = option.text;
  };

  function showOutline() {
    setStep('outline', 'Which outline works better?', 'Each outline has a beginning, a middle and an ending. Which one fits the picture better?', true);
    setNav('Back', showNotice, 'Build the story', () => showPart(0), run.outline.solved);
    renderChoice(story.data.outline, run.outline, outlineBody);
  }

  function showPart(index) {
    const outline = story.data.outline.find((option) => option.correct);
    setStep('build', 'Which version works better?', '');
    stepLine.append(el('b', '', `${PART_LABELS[index]}: `), outline.parts[index]);
    partPill.textContent = `Part ${index + 1} of ${PART_LABELS.length}`;
    const isLast = index === PART_LABELS.length - 1;
    setNav(
      'Back',
      () => (index === 0 ? showOutline() : showPart(index - 1)),
      isLast ? 'Pick a title' : 'Next part',
      () => (isLast ? showTitle() : showPart(index + 1)),
      run.parts[index].solved,
    );
    renderChoice(story.data.parts[index], run.parts[index], textBody);
  }

  function showTitle() {
    setStep('title', 'Which title fits best?', 'A good title makes the reader curious.');
    setNav('Back', () => showPart(PART_LABELS.length - 1), 'Read your story', showRead, run.title.solved);
    renderChoice(story.data.titles, run.title, textBody);
  }

  /* ---------- step 5: the finished story ---------- */

  function showRead() {
    completed.add(story.index);
    renderProgress($('readProgress'), 'read');
    $('readImg').src = story.data.image;
    $('readImg').alt = story.data.alt;
    $('readTitle').textContent = story.data.titles.find((option) => option.correct).text;
    const box = $('readBox');
    box.textContent = '';
    story.data.parts.forEach((options, index) => {
      box.append(el('h4', '', PART_LABELS[index]), el('p', '', options.find((option) => option.correct).text));
    });
    const allDone = completed.size === STORIES.length;
    const next = $('readNext');
    next.textContent = allDone ? 'Finish' : 'All pictures';
    next.onclick = allDone ? showDone : showMenu;
    showScreen('read', $('readTitle'));
  }

  /* ---------- help ---------- */

  function openHelp() {
    helpReturn = document.activeElement;
    helpCard.hidden = false;
    document.body.classList.add('has-modal');
    stage.inert = true;
    $('helpClose').focus({ preventScroll: true });
  }

  function closeHelp() {
    helpCard.hidden = true;
    document.body.classList.remove('has-modal');
    stage.inert = false;
    if (helpReturn && helpReturn !== document.body) helpReturn.focus({ preventScroll: true });
  }

  /* ---------- wiring ---------- */

  $('startBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showStart);
  $('againBtn').addEventListener('click', () => {
    completed.clear();
    showStart();
  });
  document.querySelectorAll('.js-help').forEach((button) => button.addEventListener('click', openHelp));
  $('helpClose').addEventListener('click', closeHelp);
  window.addEventListener('resize', fitStage);
  document.addEventListener('keydown', (event) => {
    if (helpCard.hidden) return;
    if (event.key === 'Escape') closeHelp();
    // Close is the popup's only control, so Tab stays on it.
    if (event.key === 'Tab') event.preventDefault();
  });

  fitStage();
})();
