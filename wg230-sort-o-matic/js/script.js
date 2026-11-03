/* Sort-O-Matic (wg230): the class guesses, the teacher taps a tray, the machine shows the result. */
(function () {
  'use strict';

  const { items, rounds } = window.SORT_O_MATIC_CONTENT;

  /* Where things sit on the 1920x1080 stage, taken from the XD. */
  const SPOT = {
    float: { size: 130, beltX: 716, beltTop: 368, beltLeft: 17, beltY: 365 },
    see: { size: 100, beltX: 775, beltTop: 288, beltLeft: 67, beltY: 285 },
    hard: { size: 130, beltX: 716, beltTop: 368, beltLeft: 17, beltY: 365 },
  };
  const TANK = { x: 960, size: 130, surface: 572, floor: 803, enterY: 500 };
  const LIGHT = { lensX: 834.4, lensTop: 401.9, lensBottom: 455.1, endX: 1132, endTop: 334.7, endBottom: 539.1, itemX: 936, standTop: 478, size: 100, swing: 35, shadowShift: -1.8 };
  const PRESS = { x: 960, size: 150, floor: 795, restBottom: 566, plateHeight: 18, rodTop: 527, squash: 0.45 };
  const TRAY_SLOT = 66;
  const TRAY_ITEM = 60;

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = $('stage');
  const roundScreen = $('screen-round');
  const itemImg = $('item');
  const itemName = $('itemName');
  const cue = $('cue');
  const fx = $('fx');
  const card = $('card');
  const help = $('help');

  const state = { round: null, queue: [], index: 0, right: 0, ready: false, token: 0 };
  const pose = { x: -200, y: -200, size: 100, rot: 0, squash: 1 };
  let helpReturn = null;

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

  const shuffle = (list) => {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const itemSrc = (item) => `assets/svg/item-${item.file}.svg`;
  const current = () => state.queue[state.index];
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const linear = (t) => t;

  /** Any new round, reset or Home bumps the token, which stops whatever was animating. */
  const isLive = (token) => token === state.token;

  function tween(duration, draw, ease = easeOut) {
    return new Promise((resolve) => {
      if (reduceMotion) {
        draw(1);
        resolve();
        return;
      }
      const token = state.token;
      const start = performance.now();
      const frame = (now) => {
        if (!isLive(token)) {
          resolve();
          return;
        }
        const t = Math.min(1, (now - start) / duration);
        draw(ease(t));
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, reduceMotion ? 0 : ms));

  /* ---------- the item on stage ---------- */
  function setPose(next) {
    Object.assign(pose, next);
    const half = pose.size / 2;
    itemImg.style.width = `${pose.size}px`;
    itemImg.style.height = `${pose.size}px`;
    // Squashing keeps the bottom of the drawing on the bench.
    const lift = (pose.size * current().hf / 2) * (1 - pose.squash);
    itemImg.style.transform = `translate(${pose.x - half}px, ${pose.y - half + lift}px) rotate(${pose.rot}deg) scaleY(${pose.squash})`;
  }

  /** The y that rests the bottom of the drawing on a surface. */
  const restOn = (surface, size, item) => surface - (size * item.hf) / 2;

  function moveItem(x, y, size, duration) {
    const from = { ...pose };
    return tween(duration, (t) => setPose({
      x: lerp(from.x, x, t),
      y: lerp(from.y, y, t),
      size: lerp(from.size, size, t),
      rot: from.rot * (1 - t),
    }));
  }

  /* ---------- machines ---------- */
  function setPlate(bottom) {
    const top = bottom - PRESS.plateHeight;
    $('pressPlate').style.transform = `translateY(${top}px)`;
    $('pressRod').style.height = `${Math.max(0, top - PRESS.rodTop)}px`;
    pressBottom = bottom;
  }
  let pressBottom = PRESS.restBottom;

  /** Moves the torch; the beam follows it and the shadow slides the other way. */
  function setTorch(offset, on, item) {
    $('torchHead').style.transform = `translateY(${offset}px)`;
    const beam = $('beam');
    beam.setAttribute('points', [
      [LIGHT.lensX, LIGHT.lensTop + offset],
      [LIGHT.lensX, LIGHT.lensBottom + offset],
      [LIGHT.endX, LIGHT.endBottom + offset],
      [LIGHT.endX, LIGHT.endTop + offset],
    ].map((point) => point.join(',')).join(' '));
    beam.style.display = on ? '' : 'none';

    const light = $('screenLight');
    const shadow = $('screenShadow');
    light.className = 'screen-light';
    shadow.className = 'screen-shadow';
    if (!on || !item) return;
    light.classList.add(`is-${item.see}`);
    light.style.transform = `translateY(${offset}px)`;
    if (item.see !== 'tp') {
      shadow.classList.add(`is-${item.see}`);
      shadow.src = itemSrc(item);
      shadow.style.transform = `translateY(${offset * LIGHT.shadowShift}px) skewY(-14deg) scaleX(0.68)`;
    }
  }

  /* ---------- little effects ---------- */
  function particle(className, x, y, keyframes, duration) {
    if (reduceMotion) return;
    const node = el('i', className);
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    fx.appendChild(node);
    node.animate(keyframes, { duration, fill: 'forwards' }).onfinish = () => node.remove();
  }

  function splash(x, speed) {
    const count = Math.min(10, 4 + speed / 60);
    for (let i = 0; i < count; i++) {
      const dx = (Math.random() - 0.5) * 170;
      const dy = -40 - Math.random() * 90;
      particle('drop', x, TANK.surface, [
        { transform: 'translate(0, 0)' },
        { transform: `translate(${dx * 0.6}px, ${dy}px)`, offset: 0.5 },
        { transform: `translate(${dx}px, 10px)`, opacity: 0 },
      ], 700);
    }
  }

  function bubble(x, y) {
    particle('bubble', x, y, [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: `translateY(${TANK.surface - y}px)`, opacity: 0 },
    ], 1300);
  }

  function puff(x, y, side) {
    particle('puff', x, y, [
      { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
      { transform: `translate(${side * 40}px, -20px) scale(2.2)`, opacity: 0 },
    ], 700);
  }

  function spark(x, y) {
    particle('spark', x, y, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.4)' }], 450);
  }

  /* ---------- what each machine does with the item ---------- */
  const REVEAL = {
    async float(item, token) {
      const fromX = pose.x;
      const fromY = pose.y;
      await tween(500, (t) => setPose({
        x: lerp(fromX, TANK.x, t),
        y: lerp(fromY, TANK.enterY - 60, t) - 60 * Math.sin(Math.PI * t),
        size: lerp(pose.size, TANK.size, t),
      }), linear);
      if (!isLive(token)) return;

      const height = TANK.size * item.hf;
      if (reduceMotion) {
        const bottom = item.rho < 1 ? TANK.surface + height * item.rho : TANK.floor;
        setPose({ x: TANK.x, y: bottom - height / 2 });
        return;
      }

      // Weight against buoyancy: the item settles where the water it pushes aside matches its weight.
      const gravity = 1100;
      let speed = 0;
      let y = pose.y;
      let time = 0;
      let still = 0;
      let bubbleTime = 0;
      let entered = false;
      let last = performance.now();
      await new Promise((resolve) => {
        const step = (now) => {
          if (!isLive(token)) {
            resolve();
            return;
          }
          const dt = Math.min(0.033, (now - last) / 1000);
          last = now;
          time += dt;
          const under = Math.max(0, Math.min(1, (y + height / 2 - TANK.surface) / height));
          speed += (gravity - (gravity * under) / item.rho - (under > 0 ? 4.2 : 0.3) * speed) * dt;
          y += speed * dt;
          if (y + height / 2 > TANK.floor) {
            y = TANK.floor - height / 2;
            speed = Math.abs(speed) > 60 ? -speed * 0.15 : 0;
          }
          if (!entered && under > 0) {
            entered = true;
            splash(pose.x, Math.abs(speed));
          }
          bubbleTime += dt;
          if (under > 0 && item.rho > 1 && bubbleTime > 0.12 && y + height / 2 < TANK.floor - 4) {
            bubbleTime = 0;
            bubble(pose.x + (Math.random() - 0.5) * pose.size * 0.4, y);
          }
          setPose({ y, rot: item.rho < 1 ? Math.sin(time * 2.4) * 5 * Math.min(1, under * 2) : 0 });
          still = Math.abs(speed) < 8 ? still + dt : 0;
          if ((still > 0.6 && time > 1.2) || time > 4) resolve();
          else requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },

    async see(item, token) {
      await moveItem(LIGHT.itemX, restOn(LIGHT.standTop, LIGHT.size, item), LIGHT.size, 650);
      if (!isLive(token)) return;
      setTorch(0, true, item);
      await wait(500);
      if (!isLive(token)) return;
      await tween(2200, (t) => setTorch(-LIGHT.swing * Math.sin(t * Math.PI * 2), true, item), linear);
      if (!isLive(token)) return;
      setTorch(0, true, item);
      await wait(300);
    },

    async hard(item, token) {
      const height = PRESS.size * item.hf;
      const y = restOn(PRESS.floor, PRESS.size, item);
      const top = PRESS.floor - height;
      await moveItem(PRESS.x, y, PRESS.size, 650);
      if (!isLive(token)) return;
      await wait(200);
      if (!isLive(token)) return;
      const start = pressBottom;
      await tween(650, (t) => setPlate(lerp(start, top, t)), (t) => t * t);
      if (!isLive(token)) return;

      if (item.hard) {
        for (let i = 0; i < 5; i++) spark(PRESS.x - 90 + i * 45, top);
        await tween(350, (t) => setPlate(top - 8 * Math.sin(Math.PI * t)), linear);
      } else {
        const flat = PRESS.floor - height * (1 - PRESS.squash);
        await tween(800, (t) => {
          setPose({ squash: 1 - PRESS.squash * t });
          setPlate(lerp(top, flat, t));
        });
        for (let i = 0; i < 4; i++) {
          const side = i < 2 ? -1 : 1;
          puff(PRESS.x + side * (PRESS.size * 0.3 + Math.random() * 20), PRESS.floor - 8, side);
        }
      }
      if (!isLive(token)) return;
      await wait(500);
      if (!isLive(token)) return;
      const from = pressBottom;
      await tween(500, (t) => setPlate(lerp(from, PRESS.restBottom, t)));
    },
  };

  /* ---------- building the round ---------- */
  function renderTabs() {
    const tabs = $('tabs');
    tabs.textContent = '';
    Object.keys(rounds).forEach((key) => {
      const btn = el('button', 'tab', rounds[key].label);
      btn.type = 'button';
      btn.dataset.round = key;
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => {
        if (card.hidden && key !== state.round) startRound(key);
      });
      tabs.appendChild(btn);
    });
  }

  function renderTiles() {
    const tiles = $('tiles');
    Object.keys(rounds).forEach((key) => {
      const btn = el('button', 'tile');
      btn.type = 'button';
      const icon = el('img', `tile-icon tile-icon--${key}`);
      icon.src = rounds[key].icon;
      icon.alt = '';
      btn.appendChild(icon);
      btn.appendChild(el('span', 'tile-label', rounds[key].label));
      btn.addEventListener('click', () => startRound(key));
      tiles.appendChild(btn);
    });
  }

  function renderTrays(round) {
    const trays = $('trays');
    trays.textContent = '';
    trays.dataset.count = round.trays.length;
    round.trays.forEach((tray) => {
      const btn = el('button', `tray tray--${tray.tone}`);
      btn.type = 'button';
      btn.dataset.tray = tray.key;
      btn.disabled = true;
      btn.appendChild(el('span', 'tray-label', tray.label));
      btn.appendChild(el('span', 'tray-tap', 'Tap here'));
      btn.appendChild(el('span', 'tray-items'));
      btn.appendChild(el('span', 'tray-total', 'Total: 0'));
      btn.setAttribute('aria-label', `${tray.label}, total 0`);
      btn.addEventListener('click', () => answer(tray.key, btn));
      trays.appendChild(btn);
    });
  }

  function renderDots() {
    const dots = $('dots');
    dots.textContent = '';
    state.queue.forEach((item, i) => {
      const li = el('li', `dot${i <= state.index ? ' is-on' : ''}`);
      li.setAttribute('aria-label', `Item ${i + 1}${i === state.index ? ', current' : ''}`);
      if (i === state.index) li.setAttribute('aria-current', 'step');
      dots.appendChild(li);
    });
  }

  function setTrays(enabled) {
    document.querySelectorAll('.tray').forEach((tray) => {
      tray.disabled = !enabled;
    });
  }

  function resetMachines() {
    setPlate(PRESS.restBottom);
    setTorch(0, false);
    fx.textContent = '';
  }

  function startRound(key) {
    state.token += 1;
    const round = rounds[key];
    state.round = key;
    state.queue = shuffle(items.filter((item) => item.rounds.includes(key)));
    state.index = 0;
    state.right = 0;
    state.ready = false;
    roundScreen.dataset.round = key;
    const spot = SPOT[key];
    $('belt').style.transform = `translate(${spot.beltLeft}px, ${spot.beltY}px)`;
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.setAttribute('aria-pressed', String(tab.dataset.round === key));
    });
    card.hidden = true;
    renderTrays(round);
    goTo('round');
    arrive();
  }

  /* ---------- one item ---------- */
  async function arrive() {
    const token = state.token;
    const item = current();
    const spot = SPOT[state.round];
    state.ready = false;
    setTrays(false);
    renderDots();
    resetMachines();
    cue.textContent = '';
    itemName.hidden = true;
    itemImg.src = itemSrc(item);
    itemImg.alt = item.name;
    const y = restOn(spot.beltTop, spot.size, item);
    setPose({ x: -120, y, size: spot.size, rot: 0, squash: 1 });
    itemImg.hidden = false;

    $('belt').classList.add('is-running');
    await tween(1400, (t) => setPose({ x: lerp(-120, spot.beltX, t) }), (t) => 1 - Math.pow(1 - t, 2));
    if (!isLive(token)) return;
    $('belt').classList.remove('is-running');

    itemName.textContent = item.name;
    itemName.style.right = `${1920 - (spot.beltX - spot.size / 2) + 18}px`;
    itemName.style.top = `${y - 25}px`;
    itemName.hidden = false;
    cue.textContent = rounds[state.round].ask;
    state.ready = true;
    setTrays(true);
  }

  async function answer(key, btn) {
    if (!state.ready) return;
    state.ready = false;
    setTrays(false);
    const token = state.token;
    const item = current();
    const round = rounds[state.round];
    btn.classList.add('is-chosen');
    itemName.hidden = true;
    cue.textContent = 'Let’s see…';

    await REVEAL[state.round](item, token);
    if (!isLive(token)) return;

    btn.classList.remove('is-chosen');
    cue.textContent = round.ask;
    const correct = key === round.answer(item);
    if (correct) state.right += 1;
    showCard(correct, round.line(item));
  }

  function showCard(correct, line) {
    card.classList.toggle('is-wrong', !correct);
    $('cardIcon').src = correct ? 'assets/svg/icon-correct.svg' : 'assets/svg/icon-wrong.svg';
    $('cardTitle').textContent = correct ? 'Correct!' : 'Oops!';
    $('cardText').textContent = line;
    card.hidden = false;
    $('nextBtn').focus({ preventScroll: true });
  }

  /** Next: the item always goes into its correct tray, even after a wrong answer. */
  async function next() {
    if (card.hidden) return;
    card.hidden = true;
    const token = state.token;
    const item = current();
    const tray = document.querySelector(`.tray[data-tray="${rounds[state.round].answer(item)}"]`);
    const holder = tray.querySelector('.tray-items');
    const count = holder.children.length;
    const box = trayItemCentre(tray, count);

    setPose({ squash: 1, rot: 0 });
    await moveItem(box.x, box.y, TRAY_ITEM, 420);
    if (!isLive(token)) return;

    const mini = el('img', 'tray-item');
    mini.src = itemSrc(item);
    mini.alt = '';
    holder.appendChild(mini);
    tray.querySelector('.tray-total').textContent = `Total: ${count + 1}`;
    tray.setAttribute('aria-label', `${tray.querySelector('.tray-label').textContent}, total ${count + 1}`);
    itemImg.hidden = true;

    if (state.index < state.queue.length - 1) {
      state.index += 1;
      arrive();
    } else {
      finish();
    }
  }

  function trayItemCentre(tray, position) {
    const left = tray.offsetLeft + tray.parentElement.offsetLeft;
    const top = tray.offsetTop + tray.parentElement.offsetTop;
    const holder = tray.querySelector('.tray-items');
    return {
      x: left + holder.offsetLeft + TRAY_ITEM / 2 + position * TRAY_SLOT,
      y: top + holder.offsetTop + TRAY_ITEM / 2,
    };
  }

  /* ---------- end of round ---------- */
  function finish() {
    state.token += 1;
    const finished = state.round;
    $('endScore').textContent = `Your class got ${state.right} of ${state.queue.length} right.`;
    const btns = $('endBtns');
    btns.textContent = '';
    Object.keys(rounds).filter((key) => key !== finished).forEach((key) => {
      const btn = el('button', 'solid-btn', rounds[key].label);
      btn.type = 'button';
      btn.addEventListener('click', () => startRound(key));
      btns.appendChild(btn);
    });
    const again = el('button', 'solid-btn', 'Play again');
    again.type = 'button';
    again.addEventListener('click', () => startRound(finished));
    btns.appendChild(again);
    goTo('end');
    $('endTitle').focus({ preventScroll: true });
    throwConfetti();
  }

  function throwConfetti() {
    const box = $('confetti');
    box.textContent = '';
    if (reduceMotion) return;
    const colours = ['#f2b83d', '#36a968', '#0295fc', '#dc4c43', '#acf4ff'];
    for (let i = 0; i < 70; i++) {
      const piece = el('i', 'confetti-piece');
      piece.style.left = `${Math.random() * 1920}px`;
      piece.style.background = colours[i % colours.length];
      box.appendChild(piece);
      piece.animate(
        [{ transform: 'translateY(0) rotate(0)' }, { transform: `translateY(1140px) rotate(${Math.random() * 720}deg)` }],
        { duration: 2000 + Math.random() * 1500, delay: Math.random() * 600, easing: 'ease-in', fill: 'both' },
      ).onfinish = () => piece.remove();
    }
  }

  function goHome() {
    state.token += 1;
    state.round = null;
    state.ready = false;
    $('confetti').textContent = '';
    goTo('home');
    $('tiles').firstElementChild.focus({ preventScroll: true });
  }

  /* ---------- how to use ---------- */
  function openHelp(event) {
    helpReturn = event.currentTarget;
    help.hidden = false;
    $('helpClose').focus({ preventScroll: true });
  }

  function closeHelp() {
    help.hidden = true;
    if (helpReturn) helpReturn.focus({ preventScroll: true });
  }

  /** Loads every picture up front, so nothing pops in when an item arrives. */
  function preload() {
    items.forEach((item) => {
      new Image().src = itemSrc(item);
    });
    ['icon-correct', 'icon-wrong', 'trophy'].forEach((name) => {
      new Image().src = `assets/svg/${name}.svg`;
    });
  }

  renderTiles();
  renderTabs();
  document.querySelectorAll('[data-help]').forEach((btn) => btn.addEventListener('click', openHelp));
  $('helpClose').addEventListener('click', closeHelp);
  $('nextBtn').addEventListener('click', next);
  $('resetBtn').addEventListener('click', () => startRound(state.round));
  $('homeBtn').addEventListener('click', goHome);
  window.addEventListener('resize', fitStage);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !help.hidden) closeHelp();
  });

  fitStage();
  preload();
})();
