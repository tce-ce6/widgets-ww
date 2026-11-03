/* Road Signs (wg236): on a road journey, pick the right road sign at each of 10 stops. */
(function () {
  'use strict';

  const { signs, stops, wrongText, nextText, lastText } = window.ROAD_SIGNS_CONTENT;

  const RIDE_MS = 1500;
  const WORLD_WIDTH = 1407;
  const PROMPT_FONT_MAX = 28;
  const PROMPT_FONT_MIN = 22;

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = $('stage');
  const worlds = $('worlds');
  const scooter = $('scooter');
  const promptText = $('promptText');
  const stopPill = $('stopPill');
  const bubble = $('bubble');
  const bubbleText = $('bubbleText');
  const opts = $('opts');
  const nextBtn = $('nextBtn');

  let index = 0;
  let busy = false;
  let rideAnimations = [];
  let wrongTimer = 0;

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

  function makeWorld(stop) {
    const world = el('div', 'world');
    world.appendChild(image('world-art', stop.scene));
    world.appendChild(image('world-sign', 'assets/svg/sign-blank.svg'));
    return world;
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
    rideAnimations.forEach((animation) => {
      animation.onfinish = null;
      animation.cancel();
    });
    rideAnimations = [];
    scooter.classList.remove('is-riding');
  }

  function loadStop(animate) {
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

    const old = worlds.querySelector('.world');
    const fresh = makeWorld(stop);
    worlds.appendChild(fresh);

    if (!animate || !old || reduceMotion) {
      if (old) old.remove();
      ready();
      return;
    }

    scooter.classList.add('is-riding');
    const timing = { duration: RIDE_MS, easing: 'ease-in-out', fill: 'both' };
    const out = old.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${-WORLD_WIDTH}px)` }],
      timing,
    );
    const inn = fresh.animate(
      [{ transform: `translateX(${WORLD_WIDTH}px)` }, { transform: 'translateX(0)' }],
      timing,
    );
    rideAnimations = [out, inn];
    inn.onfinish = () => {
      stopRide();
      old.remove();
      ready();
    };
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
    const world = worlds.querySelector('.world');
    world.querySelector('.world-sign').remove();
    world.appendChild(image('world-confetti', 'assets/svg/confetti.svg'));
    world.appendChild(image('world-sign is-placed', signs[stop.sign].src));
    worlds.setAttribute('aria-label', `${stop.desc} The ${signs[stop.sign].name} sign is now on the signpost.`);
  }

  function next() {
    if (busy) return;
    if (index < stops.length - 1) {
      index += 1;
      loadStop(true);
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
    worlds.textContent = '';
    goTo('ride');
    loadStop(false);
  }

  function restart() {
    stopRide();
    hideBubble();
    worlds.textContent = '';
    busy = false;
    goTo('start');
    $('startBtn').focus({ preventScroll: true });
  }

  /** Loads every picture up front, so a stop's art is ready when the road slides in. */
  function preload() {
    const sources = stops.map((stop) => stop.scene);
    Object.keys(signs).forEach((id) => sources.push(signs[id].src));
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
