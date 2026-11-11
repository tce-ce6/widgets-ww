/* Road Signs (wg236): on a road journey, pick the right road sign at each of 10 stops. */
(function () {
  'use strict';

  const { signs, stops, wrongText, nextText, lastText } = window.ROAD_SIGNS_CONTENT;

  /*
   * Timeline of the scene Lottie (frames, 30 fps), one entry per stop.
   * arrive: the scooter comes to rest at the stop
   * reveal: the "?" board on the stop's post is masked away (the chosen sign goes up here)
   * leave:  the scooter sets off for the next stop
   */
  const SCENE = {
    arrive: [57, 178, 299, 418, 539, 660, 781, 902, 1023, 1143],
    reveal: [88, 209, 330, 449, 570, 691, 812, 933, 1053, 1174],
    leave: [120, 240, 360, 479, 600, 721, 842, 963, 1083],
    settle: 5, // frames after arriving before the signs can be chosen
    boards: ['sign-baord', 'sign-baord 2', 'sign-baord 3', 'sign-baord 4', 'sign-baord 5',
      'sign-baord 6', 'sign-baord 7', 'sign-baord 8', 'sign-baord 9', 'sign-baord 10'],
  };
  const SVG_NS = 'http://www.w3.org/2000/svg';
  // the placed sign covers the board's panel (in the board layer's own coordinates)
  const SIGN_BOX = { x: 0, y: 0, size: 165 };
  const CONFETTI_BOX = { x: -41, y: -39, w: 246, h: 244 };
  const PROMPT_FONT_MAX = 28;
  const PROMPT_FONT_MIN = 22;

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = $('stage');
  const worlds = $('worlds');
  const promptText = $('promptText');
  const stopPill = $('stopPill');
  const bubble = $('bubble');
  const bubbleText = $('bubbleText');
  const opts = $('opts');
  const nextBtn = $('nextBtn');

  let index = 0;
  let busy = false;
  let wrongTimer = 0;
  let placed = null; // { stop, group }: the sign that is up, following its post
  let segmentDone = null;

  const sceneAnim = lottie.loadAnimation({
    container: $('sceneLottie'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: window.SCENE_LOTTIE,
  });
  sceneAnim.addEventListener('complete', () => {
    const done = segmentDone;
    segmentDone = null;
    if (done) done();
  });
  sceneAnim.addEventListener('enterFrame', () => trackSign());

  /** Fits the fixed 1920x1080 stage inside the window, centred. */
  function fitStage() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    const x = (window.innerWidth - 1920 * scale) / 2;
    const y = (window.innerHeight - 1080 * scale) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }

  function goTo(id) {
    document.querySelectorAll('.screen.is-active').forEach((screen) => screen.classList.remove('is-active'));
    $(`screen-${id}`).classList.add('is-active');
  }

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const image = (className, src, alt = '') => {
    const img = el('img', className);
    img.src = src;
    img.alt = alt;
    return img;
  };

  const shuffle = (list) => {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /** Keeps Asha's line on one row of the bar: long lines step down in size. */
  function fitPrompt() {
    let size = PROMPT_FONT_MAX;
    promptText.style.fontSize = `${size}px`;
    while (size > PROMPT_FONT_MIN && promptText.scrollWidth > promptText.clientWidth) {
      size -= 1;
      promptText.style.fontSize = `${size}px`;
    }
  }

  function renderStones() {
    const list = $('stones');
    list.textContent = '';
    stops.forEach((stop, i) => {
      const state = i < index ? 'is-done' : i === index ? 'is-now' : '';
      const li = el('li', `stone ${state}`, String(i + 1));
      const status = i < index ? ', done' : i === index ? ', you are here' : '';
      li.setAttribute('aria-label', `Stop ${i + 1}${status}`);
      if (i === index) li.setAttribute('aria-current', 'step');
      list.appendChild(li);
    });
  }

  /** Shows one frame of the scene. Frames count from the start of the whole timeline. */
  function showSceneFrame(frame) {
    sceneAnim.resetSegments(true); // after playSegments, frames would otherwise count from the segment start
    sceneAnim.goToAndStop(frame, true);
  }

  /** Plays part of the scene timeline, then calls done (straight away with reduced motion). */
  function playScene(from, to, done) {
    segmentDone = null;
    if (reduceMotion) {
      showSceneFrame(to);
      trackSign();
      done();
      return;
    }
    segmentDone = done;
    sceneAnim.playSegments([from, to], true);
  }

  /** The Lottie layer of a stop's signboard (its post and "?" board). */
  function boardElement(stopIndex) {
    const elements = (sceneAnim.renderer && sceneAnim.renderer.elements) || [];
    const comp = elements.find((e) => e && e.data && e.data.ty === 0 && e.elements);
    if (!comp) return null;
    const layer = comp.elements.find((e) => e && e.data && e.data.nm === SCENE.boards[stopIndex]);
    return layer ? layer.layerElement || layer.baseElement : null;
  }

  /**
   * Keeps the placed sign on its post as the road moves. The sign lives inside the Lottie's SVG,
   * right after the board layer: in front of the post, behind the scooter that rides past it.
   */
  function trackSign() {
    if (!placed) return;
    const board = boardElement(placed.stop);
    if (!board) return;
    placed.group.setAttribute('transform', board.getAttribute('transform') || '');
    placed.group.style.display = board.style.display;
  }

  function svgImage(className, href, box) {
    const img = document.createElementNS(SVG_NS, 'image');
    img.setAttribute('class', className);
    img.setAttribute('href', href);
    img.setAttribute('x', box.x);
    img.setAttribute('y', box.y);
    img.setAttribute('width', box.w || box.size);
    img.setAttribute('height', box.h || box.size);
    return img;
  }

  function clearPlaced() {
    if (placed) placed.group.remove();
    placed = null;
  }

  function renderOptions(stop) {
    opts.textContent = '';
    shuffle(stop.options).forEach((id) => {
      const btn = el('button', 'opt');
      btn.type = 'button';
      btn.disabled = true;
      btn.setAttribute('aria-label', `${signs[id].name} sign`);
      btn.appendChild(image('opt-sign', signs[id].src));
      btn.addEventListener('click', () => choose(id, btn));
      opts.appendChild(btn);
    });
  }

  function hideBubble() {
    window.clearTimeout(wrongTimer);
    bubble.hidden = true;
    bubble.className = 'bubble';
    bubbleText.textContent = '';
  }

  function showBubble(kind, text) {
    window.clearTimeout(wrongTimer);
    bubble.className = `bubble bubble--${kind}`;
    bubble.hidden = false;
    // Emptied first, so that a second wrong tap is announced again by screen readers.
    bubbleText.textContent = '';
    wrongTimer = window.setTimeout(() => {
      bubbleText.textContent = text;
    }, 60);
  }

  function stopRide() {
    segmentDone = null;
    sceneAnim.pause();
  }

  /** Shows a stop: the scooter rides in from the given frame, then the signs can be chosen. */
  function loadStop(fromFrame) {
    const stop = stops[index];
    busy = true;
    stopRide();
    renderStones();
    hideBubble();
    nextBtn.hidden = true;
    stopPill.textContent = `Stop ${index + 1}: ${stop.place}`;
    promptText.textContent = stop.prompt;
    fitPrompt();
    worlds.setAttribute('aria-label', `${stop.desc} There is an empty signpost.`);
    renderOptions(stop);

    playScene(fromFrame, SCENE.arrive[index] + SCENE.settle, () => {
      clearPlaced(); // the last stop's sign has ridden out of view
      ready();
    });
  }

  function ready() {
    busy = false;
    const buttons = opts.querySelectorAll('.opt');
    buttons.forEach((btn) => {
      btn.disabled = false;
    });
    if (document.activeElement === document.body || document.activeElement === nextBtn) {
      buttons[0].focus({ preventScroll: true });
    }
  }

  function choose(id, btn) {
    if (busy) return;
    const stop = stops[index];

    if (id !== stop.sign) {
      btn.classList.add('is-wrong');
      btn.disabled = true;
      showBubble('wrong', wrongText);
      const nextOption = opts.querySelector('.opt:not(:disabled)');
      if (nextOption) nextOption.focus({ preventScroll: true });
      return;
    }

    btn.classList.add('is-right');
    opts.querySelectorAll('.opt').forEach((option) => {
      option.disabled = true;
    });
    showBubble('right', stop.right);
    placeSign(stop);
    nextBtn.textContent = index === stops.length - 1 ? lastText : nextText;
    nextBtn.hidden = false;
    nextBtn.focus({ preventScroll: true });
  }

  function placeSign(stop) {
    // the "?" board comes off the post, and the chosen sign goes up in its place
    showSceneFrame(SCENE.reveal[index]);
    clearPlaced();
    const board = boardElement(index);
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('class', 'post-sign');
    group.appendChild(svgImage('post-sign__confetti', 'assets/svg/confetti.svg', CONFETTI_BOX));
    group.appendChild(svgImage('post-sign__sign', signs[stop.sign].src, SIGN_BOX));
    board.parentNode.insertBefore(group, board.nextSibling);
    placed = { stop: index, group };
    trackSign();
    worlds.setAttribute('aria-label', `${stop.desc} The ${signs[stop.sign].name} sign is now on the signpost.`);
  }

  function next() {
    if (busy) return;
    if (index < stops.length - 1) {
      index += 1;
      loadStop(SCENE.leave[index - 1]); // ride on from the stop just finished
    } else {
      finish();
    }
  }

  function finish() {
    goTo('end');
    $('endTitle').focus({ preventScroll: true });
  }

  function renderTiles() {
    const tiles = $('tiles');
    stops.forEach((stop) => {
      const sign = signs[stop.sign];
      const li = el('li', 'tile');
      const box = el('span', 'tile-box');
      box.appendChild(image('opt-sign', sign.src));
      li.appendChild(box);
      li.appendChild(el('b', 'tile-name', sign.name));
      tiles.appendChild(li);
    });
  }

  function startRide() {
    index = 0;
    clearPlaced();
    goTo('ride');
    loadStop(0); // the ride in to the first stop
  }

  function restart() {
    stopRide();
    hideBubble();
    clearPlaced();
    showSceneFrame(0);
    busy = false;
    goTo('start');
    $('startBtn').focus({ preventScroll: true });
  }

  /** Loads the sign pictures up front, so a sign is ready when it goes up. */
  function preload() {
    const sources = Object.keys(signs).map((id) => signs[id].src);
    sources.forEach((src) => {
      new Image().src = src;
    });
  }

  $('startBtn').addEventListener('click', startRide);
  $('againBtn').addEventListener('click', startRide);
  $('restartBtn').addEventListener('click', restart);
  nextBtn.addEventListener('click', next);
  window.addEventListener('resize', fitStage);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (promptText.textContent) fitPrompt();
    });
  }

  fitStage();
  renderTiles();
  preload();
})();
