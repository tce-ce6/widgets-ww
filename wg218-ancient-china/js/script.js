/* ==========================================================================
   Wonders of Ancient China (wg218) - widget logic
   Plain ES6+, no dependencies. Sections:
     1. Content data (from the storyboard data tables)
     2. Helpers, stage scaling and screen navigation
     3. Sound (Web Audio, synthesised - no audio files needed)
     4. Drag and drop engine (pointer drag + tap-tap + keyboard)
     5. Screens and activities
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONTENT DATA
     ------------------------------------------------------------------------ */

  // The five shops, left to right; each one opens in turn.
  const SHOPS = [
    { name: 'The Timekeeper’s Stall', screen: 'timeline', box: [57, 351, 346, 99.3], band: [14, 64], tick: [202, 314] },
    { name: 'The City Builder’s Yard', screen: 'city', box: [443, 365, 306, 99.3], band: [14, 64], tick: [566, 326] },
    { name: 'The Bronze Caster’s<br>Workshop', screen: 'bronze', box: [793, 371, 337, 116.8], band: [9, 84], tick: [931, 334] },
    { name: 'The Historian’s Curio Shop', screen: 'oracle', box: [1171, 381.5, 334.4, 99.3], band: [14, 64], tick: [1308, 345] },
    { name: 'The Silk Merchant’s Stall', screen: 'silk', box: [1555, 379.8, 325.7, 99.3], band: [14, 64], tick: [1688, 341] }
  ];

  const MARKET_TEXT = [
    'There are 5 shops in the Market street.<br>Tap the Timekeeper’s Stall to enter and explore.',
    'Tap the City Builder’s Yard to enter and explore.',
    'Tap the Bronze Caster’s Workshop to enter and explore.',
    'Tap the Historian’s Curio Shop to enter and explore.',
    'Tap the Silk Merchant’s Stall to enter and explore.',
    'All five shops explored. Revisit any shop,<br>or see the summary.'
  ];

  // Data Table 2 - slots in date order
  const DYNASTIES = [
    { key: 'shang', name: 'Shang dynasty', dates: '1600–1046 BCE', img: 'dynasty-shang.png', fact: 'The dynasty of the oracle bones, and of China’s first cities.' },
    { key: 'zhou', name: 'Zhou dynasty', dates: '1046–256 BCE', img: 'dynasty-zhou.png', fact: 'The longest dynasty in Chinese history — nearly 800 years.' },
    { key: 'qin', name: 'Qin dynasty', dates: '221–206 BCE', img: 'dynasty-qin.png', flip: true, fact: 'Fifteen years only — yet it unified China, began the Great Wall, and gave the country its name.' },
    { key: 'han', name: 'Han dynasty', dates: '206 BCE–220 CE', img: 'dynasty-han.png', flip: true, fact: 'Silk went west, and the road took its name.' }
  ];
  const TL_X = [175, 592, 1009, 1426];

  // Data Table 3 - `at` is where the chip sits on the map (stage px, from the layout)
  const CITY = [
    { name: 'Farmland', zone: 'river', note: 'Crops need the river.', at: [276.7, 798] },
    { name: 'Irrigation channels', zone: 'river', note: 'They carry river water to the fields.', at: [288.3, 862] },
    { name: 'Houses', zone: 'centre', note: 'Families live in the centre.', at: [1469.4, 686] },
    { name: 'Market', zone: 'centre', note: 'Traders meet in the centre.', at: [580.8, 585] },
    { name: 'Bronze workshop', zone: 'centre', note: 'Metalwork helped make cities possible.', at: [791.3, 528.7] },
    { name: 'Pottery workshop', zone: 'centre', note: 'Craft work marks a real city.', at: [1180.7, 659] },
    { name: 'Silk weaving shed', zone: 'centre', note: 'Silk was woven here long before it was sold abroad.', at: [989.5, 471] },
    { name: 'Ruler’s palace', zone: 'high', note: 'Above the floods, visible to all.', at: [1385, 444.6] },
    { name: 'Ancestral temple', zone: 'high', note: 'The ancestors are honoured near the ruler.', at: [1473.6, 551] },
    { name: 'City wall', zone: 'edge', note: 'It marks who is inside the city.', at: [341, 515] }
  ];
  const ZONE_HINTS = {
    river: 'does this need water, or protection from it?',
    centre: 'think about what belongs in the heart of the settlement.',
    high: 'what would a ruler want raised above the rest?',
    edge: 'what marks the boundary of a city?'
  };
  const MAP_ORIGIN = [118.5, 311];

  // Data Table 4
  const STAGES = [
    { name: 'Design the vessel', note: 'The shape is decided first.', caption: 'Stage 1 — the vessel is designed.' },
    { name: 'Make mould & core', note: 'The gap between mould and core becomes the bronze.', caption: 'Stage 2 — mould sections and inner core formed.' },
    { name: 'Carve patterns', note: 'Patterns cut inward stand raised on the vessel.', caption: 'Stage 3 — patterns carved into the mould faces.' },
    { name: 'Assemble the mould', note: 'Clamped shut, gap kept even.', caption: 'Stage 4 — mould assembled around the core.' },
    { name: 'Pour molten bronze', note: 'Copper and tin, poured.', caption: 'Stage 5 — molten bronze poured into the gap.' },
    { name: 'Break mould & finish', note: 'The mould breaks — so every vessel is unique.', caption: 'Stage 6 — mould broken away, vessel finished.' }
  ];
  const BRONZE_X = [644, 1015, 1386];

  // Data Table 5 - the first option is the answer (options are shuffled on screen)
  const BONES = {
    king: {
      who: 'The King', pronoun: 'he', scene: 'The army awaits',
      options: ['Will misfortune strike the army?', 'Will misfortune strike the harvest?', 'Will misfortune strike the kiln?'],
      feeling: 'Fear',
      note1: 'Kings consulted the bones before marching.',
      note2: 'A fear — even a king dreaded defeat.'
    },
    farmer: {
      who: 'A Farmer', pronoun: 'he', scene: 'The fields are dry',
      options: ['Will rain come before planting?', 'Will rain come before the feast?', 'Will rain come before the army’s march?'],
      feeling: 'Hope',
      note1: 'No rain meant no harvest, and no harvest meant hunger.',
      note2: 'A hope — the whole year rested on the sky.'
    },
    mother: {
      who: 'A Mother', pronoun: 'she', scene: 'The child is ill',
      options: ['May the ancestors keep my child from harm.', 'May the ancestors keep the herd from harm.', 'May the ancestors keep the village from harm.'],
      feeling: 'Fear',
      note1: 'Ordinary people brought ordinary griefs to the bones.',
      note2: 'A fear — the oldest one there is.'
    },
    potter: {
      who: 'A Potter', pronoun: 'he', scene: 'The kiln is lit',
      options: ['On which day should the kiln be lit?', 'On which day should the field be ploughed?', 'On which day should the army set out?'],
      feeling: 'Daily life',
      note1: 'Potters, weavers and smiths asked too — about the work of an ordinary day.',
      note2: 'Daily life — a craftsman worrying about his own kiln.'
    },
    elder: {
      who: 'A Village Elder', pronoun: 'he', scene: 'The offering has been made',
      options: ['May the ancestors accept what we have given.', 'May the ancestors send rain to the fields.', 'May the ancestors guard the army on the road.'],
      feeling: 'Desire',
      note1: 'Ancestors were asked whether a ritual had been done right.',
      note2: 'A desire — a plea for the ancestors’ favour.'
    }
  };
  const FEELINGS = ['Hope', 'Fear', 'Desire', 'Daily life'];
  // bones crack one by one as the heat passes each mark
  const CRACK_AT = [['farmer', 18], ['potter', 36], ['elder', 54], ['mother', 72], ['king', 92]];

  // Data Table 6.a
  const SILK = [
    { title: 'Cocoon', sub: '4000–3000 BCE', img: 'silk-1.png', caption: 'A single cocoon unwinds into one long thread.', alt: 'Two white silkworm cocoons on mulberry leaves.' },
    { title: 'Woven cloth', sub: 'Bronze Age craft', img: 'silk-2.png', caption: 'Thread becomes cloth — an important craft in the Bronze Age.', alt: 'Red silk cloth on a wooden loom.' },
    { title: 'A bolt', sub: 'Bound & ready', img: 'silk-3.png', caption: 'Cloth is folded and bound into a bolt.', alt: 'A folded bolt of red silk bound with gold bands.' },
    { title: 'Loaded cart', sub: '2nd c. BCE · Han', img: 'silk-4.png', caption: 'Bolts load onto carts bound west, 2nd century BCE.', alt: 'A trader pushing a sail cart piled with bolts of silk.' }
  ];
  const PLAQUE_X = [145, 575, 1006, 1436];

  // Data Table 6.b
  const GOODS = [
    { key: 'silk', name: 'Silk textiles', to: 'west', note: 'Finished cloth, the form most silk travelled in.' },
    { key: 'lacquer', name: 'Lacquerware', to: 'west', note: 'Light, tough, and beautiful.' },
    { key: 'mirror', name: 'Bronze mirrors', to: 'west', note: 'Small and flat — easy to carry far.' },
    { key: 'ceramics', name: 'Chinese ceramics', to: 'west', note: 'Prized abroad, risky to move.' },
    { key: 'grain', name: 'Grain', to: 'within', note: 'Heavy and cheap — it feeds the caravan, not the purse.' },
    { key: 'salt', name: 'Salt', to: 'within', note: 'Everyone needs it, nobody pays much for it.' },
    { key: 'ritual', name: 'Ritual bronze vessels', to: 'within', note: 'Made for the ancestors, used at home.' },
    { key: 'iron', name: 'Iron tools', to: 'within', note: 'Common across China by 600 BCE.' },
    { key: 'agri', name: 'Agricultural goods', to: 'within', note: 'The surplus that fed the cities.' },
    { key: 'horses', name: 'Central Asian horses', to: 'outside', note: 'Prized by Han armies — and not bred in China.' },
    { key: 'jade', name: 'Jade', to: 'outside', note: 'Not found in Chinese soil. It arrives, never leaves.' },
    { key: 'glass', name: 'Glassware', to: 'outside', note: 'A western speciality, travelling east.' },
    { key: 'spices', name: 'Spices', to: 'outside', note: 'Light, valuable, easy to carry far.' },
    { key: 'gems', name: 'Gemstones', to: 'outside', note: 'Traded for the cloth going the other way.' }
  ];

  /* ------------------------------------------------------------------------
     2. HELPERS, STAGE SCALING, NAVIGATION
     ------------------------------------------------------------------------ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const stage = $('#stage');
  const modalStage = $('#modal-stage');
  const viewport = $('#viewport');
  const liveRegion = $('#liveRegion');

  const state = { done: new Set(), current: null };
  const timers = new Set();

  function later(fn, ms) {
    const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  }

  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers.clear();
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function announce(message) {
    liveRegion.textContent = '';
    window.setTimeout(() => { liveRegion.textContent = message.replace(/<[^>]+>/g, ' '); }, 30);
  }

  function restart(el, className) {
    el.classList.remove(className);
    void el.getBoundingClientRect();
    el.classList.add(className);
  }

  function setNote(el, text, ok) {
    el.textContent = text;
    el.classList.toggle('is-err', !ok);
    if (text) announce(text);
  }

  let stageScale = 1;
  let stageOrigin = [0, 0];

  /** Fits the fixed 1920x1080 stage (and the modal stage) inside the window, centred. */
  function fitStage() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / 1920, vh / 1080);
    stageOrigin = [(vw - 1920 * stageScale) / 2, (vh - 1080 * stageScale) / 2];
    const t = `translate(${stageOrigin[0]}px, ${stageOrigin[1]}px) scale(${stageScale})`;
    stage.style.transform = t;
    modalStage.style.transform = t;
  }

  /** Converts a client (viewport) position to stage coordinates. */
  function toStage(clientX, clientY) {
    return { x: (clientX - stageOrigin[0]) / stageScale, y: (clientY - stageOrigin[1]) / stageScale };
  }

  const BG = { intro: 'intro', market: 'market' };
  const enterHooks = {};

  function goTo(id) {
    const next = $(`#screen-${id}`);
    if (!next) return;
    clearTimers();
    DnD.clearSelection();
    $$('.screen.is-active').forEach((screen) => screen.classList.remove('is-active'));
    viewport.dataset.bg = BG[id] || 'act';
    next.classList.add('is-active');
    state.current = id;
    if (enterHooks[id]) enterHooks[id]();
    const heading = $('.ribbon', next);
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  function complete(shopIndex) {
    if (state.done.has(shopIndex)) return;
    state.done.add(shopIndex);
    Sound.play('done');
  }

  /* ------------------------------------------------------------------------
     3. SOUND (Web Audio, synthesised)
     ------------------------------------------------------------------------ */

  const Sound = (function () {
    let ctx = null;
    let master = null;
    let noise = null;

    function ensure() {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        ctx = new AudioCtx();
        master = ctx.createGain();
        master.gain.value = 0.7;
        master.connect(ctx.destination);
        const length = ctx.sampleRate;
        noise = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }

    function tone(freq, start, duration, type, peak) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(master);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    }

    function burst(start, duration, peak, freq) {
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      src.buffer = noise;
      filter.type = 'bandpass';
      filter.frequency.value = freq;
      gain.gain.setValueAtTime(peak, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      src.connect(filter).connect(gain).connect(master);
      src.start(start, Math.random() * 0.5, duration + 0.05);
    }

    function play(name) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      if (name === 'correct') { tone(660, t, 0.2, 'triangle', 0.2); tone(880, t + 0.1, 0.32, 'triangle', 0.2); }
      else if (name === 'wrong') { tone(190, t, 0.25, 'sawtooth', 0.08); tone(140, t + 0.13, 0.32, 'sawtooth', 0.08); }
      else if (name === 'tap') { tone(520, t, 0.07, 'square', 0.035); }
      else if (name === 'crack') { burst(t, 0.12, 0.5, 2400); burst(t + 0.06, 0.18, 0.35, 900); }
      else if (name === 'done') { [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.12, 0.5, 'triangle', 0.16)); }
      else if (name === 'whoosh') { burst(t, 1.1, 0.25, 500); }
    }

    return { play, unlock: ensure };
  }());

  /* ------------------------------------------------------------------------
     4. DRAG AND DROP ENGINE
        - pointer drag with a semi-transparent copy following the finger
        - the target under the finger highlights red while hovered
        - dropping in the wrong place leaves the item in its tray
        - tap an item, then tap a target (also works with the keyboard)
     ------------------------------------------------------------------------ */

  const DnD = (function () {
    const registry = new WeakMap();
    let drag = null;
    let selected = null;
    let selectedRoot = null;
    let suppressClick = false;

    const isOff = (el) => el.classList.contains('is-gone') || el.classList.contains('is-done');

    function enable(root, options) {
      if (!registry.has(root)) {
        root.addEventListener('pointerdown', (event) => onDown(event, root));
        root.addEventListener('click', (event) => onClick(event, root));
        root.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          if (!event.target.closest(registry.get(root).targetSel)) return;
          event.preventDefault();
          onClick(event, root);
        });
      }
      registry.set(root, options);
    }

    function clearSelection() {
      if (selected) selected.classList.remove('is-selected');
      if (selectedRoot) selectedRoot.classList.remove('has-selection');
      selected = null;
      selectedRoot = null;
    }

    function select(item, root) {
      clearSelection();
      selected = item;
      selectedRoot = root;
      item.classList.add('is-selected');
      root.classList.add('has-selection');
      Sound.play('tap');
    }

    function findTarget(root, options, item, clientX, clientY) {
      for (const el of document.elementsFromPoint(clientX, clientY)) {
        const target = el.closest(options.targetSel);
        if (target && root.contains(target) && target !== item && !isOff(target)) return target;
      }
      return null;
    }

    function onDown(event, root) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const options = registry.get(root);
      const item = event.target.closest(options.itemSel);
      if (!item || !root.contains(item) || isOff(item)) return;
      drag = { root, options, item, startX: event.clientX, startY: event.clientY, started: false, hover: null, ghost: null };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onCancel);
    }

    function startDrag() {
      const { item } = drag;
      clearSelection();
      const ghost = item.cloneNode(true);
      ghost.removeAttribute('id');
      ghost.classList.remove('is-selected', 'is-dragging');
      ghost.classList.add('drag-ghost');
      ghost.style.width = `${item.offsetWidth}px`;
      ghost.style.height = `${item.offsetHeight}px`;
      ghost.setAttribute('aria-hidden', 'true');
      stage.appendChild(ghost);
      item.classList.add('is-dragging');
      drag.ghost = ghost;
      drag.started = true;
    }

    function onMove(event) {
      if (!drag) return;
      if (!drag.started) {
        if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 8) return;
        startDrag();
      }
      event.preventDefault();
      const point = toStage(event.clientX, event.clientY);
      drag.ghost.style.left = `${point.x - drag.ghost.offsetWidth / 2}px`;
      drag.ghost.style.top = `${point.y - drag.ghost.offsetHeight / 2}px`;
      const hover = findTarget(drag.root, drag.options, drag.item, event.clientX, event.clientY);
      if (hover !== drag.hover) {
        if (drag.hover) drag.hover.classList.remove('is-over');
        if (hover) hover.classList.add('is-over');
        drag.hover = hover;
      }
    }

    function finish() {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onCancel);
      if (drag.ghost) drag.ghost.remove();
      drag.item.classList.remove('is-dragging');
      if (drag.hover) drag.hover.classList.remove('is-over');
    }

    function onUp() {
      if (!drag) return;
      const { started, hover, item, options } = drag;
      finish();
      drag = null;
      if (started) {
        suppressClick = true;
        window.setTimeout(() => { suppressClick = false; }, 0);
        if (hover) options.onDrop(item, hover);
      }
    }

    function onCancel() {
      if (!drag) return;
      finish();
      drag = null;
    }

    function onClick(event, root) {
      if (suppressClick) return;
      const options = registry.get(root);
      const item = event.target.closest(options.itemSel);
      const target = event.target.closest(options.targetSel);
      if (selected && selectedRoot === root) {
        if (target && target !== selected && !isOff(target)) {
          const picked = selected;
          clearSelection();
          options.onDrop(picked, target);
          return;
        }
        if (item === selected) { clearSelection(); return; }
      }
      if (item && !isOff(item)) select(item, root);
      else if (!target) clearSelection();
    }

    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') clearSelection(); });

    return { enable, clearSelection };
  }());

  /* ------------------------------------------------------------------------
     5. SCREENS AND ACTIVITIES
     ------------------------------------------------------------------------ */

  /* ---- Screen 1: title, with a zoom into the street ---- */

  function initIntro() {
    const arrow = $('#introArrow');
    arrow.addEventListener('click', () => {
      if (viewport.classList.contains('is-zooming')) return;
      Sound.unlock();
      Sound.play('whoosh');
      // push forward into the gate at the centre of the picture
      const gx = stageOrigin[0] + 960 * stageScale;
      const gy = stageOrigin[1] + 700 * stageScale;
      viewport.style.transformOrigin = `${gx}px ${gy}px`;
      viewport.classList.add('is-zooming');
      window.setTimeout(() => {
        viewport.classList.remove('is-zooming');
        viewport.style.transformOrigin = '';
        goTo('market');
      }, 1450);
    });
  }

  /* ---- Screen 2: the market street ---- */

  const shopsBox = $('#shops');

  function nextShop() {
    for (let i = 0; i < SHOPS.length; i++) if (!state.done.has(i)) return i;
    return SHOPS.length;
  }

  function renderMarket() {
    const next = nextShop();
    $('#marketItext').innerHTML = MARKET_TEXT[next];
    $('#marketSummaryBtn').hidden = next < SHOPS.length;
    shopsBox.innerHTML = '';
    SHOPS.forEach((shop, i) => {
      const done = state.done.has(i);
      const locked = !done && i > next;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `shop${done ? ' is-done' : ''}${locked ? ' is-locked' : ''}${i === next ? ' is-next' : ''}`;
      Object.assign(btn.style, { left: `${shop.box[0]}px`, top: `${shop.box[1]}px`, width: `${shop.box[2]}px`, height: `${shop.box[3]}px` });
      const plain = shop.name.replace('<br>', ' ');
      btn.setAttribute('aria-label', `${plain}. ${done ? 'Explored. Tap to revisit.' : locked ? 'Opens after the shop before it.' : 'Tap to enter.'}`);
      if (locked) btn.setAttribute('aria-disabled', 'true');
      btn.innerHTML = `<img class="shop__sign" src="assets/svg/sign-${i + 1}.svg" alt="">` +
        `<span class="shop__name" style="top:${shop.band[0]}px;height:${shop.band[1]}px">${shop.name}</span>`;
      btn.addEventListener('click', () => {
        if (locked) { Sound.play('wrong'); restart(btn, 'is-shake'); return; }
        Sound.play('tap');
        goTo(shop.screen);
      });
      shopsBox.appendChild(btn);
      if (done) {
        const tick = document.createElement('img');
        tick.className = 'shop__tick';
        tick.src = 'assets/svg/tick.svg';
        tick.alt = '';
        Object.assign(tick.style, { left: `${shop.tick[0]}px`, top: `${shop.tick[1]}px` });
        shopsBox.appendChild(tick);
      }
    });
  }

  /* ---- Screen 3: the Timekeeper's Stall ---- */

  const TL = { placed: new Set() };

  function resetTimeline() {
    TL.placed = new Set();
    const cols = $('#tlCols');
    cols.innerHTML = '';
    DYNASTIES.forEach((d, i) => {
      const col = document.createElement('div');
      col.className = 'tl__col';
      col.style.left = `${TL_X[i]}px`;
      col.innerHTML = `<div class="tl__date">${d.dates}</div>` +
        `<img class="tl__img${d.flip ? ' tl__img--flip' : ''}" src="assets/images/${d.img}" alt="">` +
        `<div class="tl__slot drop" tabindex="0" role="button" data-key="${d.key}" aria-label="Timeline slot ${d.dates}">Drag here</div>`;
      cols.appendChild(col);
    });
    const tray = $('#tlTray');
    tray.innerHTML = '';
    shuffle(DYNASTIES).forEach((d, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.dataset.key = d.key;
      card.textContent = d.name;
      card.style.left = `${TL_X[i] + 18}px`;
      tray.appendChild(card);
    });
    $('#tlFact').hidden = true;
    setNote($('#tlNote'), '', true);
  }

  function showFact(d, btn) {
    $$('.tl__info').forEach((b) => b.classList.toggle('is-active', b === btn));
    const fact = $('#tlFact');
    fact.innerHTML = `<span><b>${d.name}:</b>${d.fact}</span>`;
    fact.hidden = false;
    restart(fact, 'tl-fact');
    announce(`${d.name}: ${d.fact}`);
  }

  function dropTimeline(card, slot) {
    const d = DYNASTIES.find((x) => x.key === slot.dataset.key);
    if (card.dataset.key !== d.key) {
      Sound.play('wrong');
      restart(slot, 'is-shake');
      slot.classList.add('is-wrong');
      later(() => slot.classList.remove('is-wrong'), 600);
      setNote($('#tlNote'), 'Not those dates — compare the numbers carefully.', false);
      return;
    }
    Sound.play('correct');
    TL.placed.add(d.key);
    card.remove();
    slot.classList.add('is-done');
    slot.textContent = d.name;
    slot.removeAttribute('tabindex');
    slot.setAttribute('aria-label', `${d.dates}: ${d.name}`);
    const info = document.createElement('button');
    info.type = 'button';
    info.className = 'tl__info';
    info.textContent = 'i';
    info.setAttribute('aria-label', `Read the fact about the ${d.name}`);
    info.addEventListener('click', (event) => { event.stopPropagation(); Sound.play('tap'); showFact(d, info); });
    slot.parentElement.appendChild(info);
    setNote($('#tlNote'), '', true);
    if (TL.placed.size === DYNASTIES.length) {
      setNote($('#tlNote'), 'Shang and Zhou: Bronze Age. Qin and Han: Iron Age. Next: build a Shang city.', true);
      complete(0);
    } else {
      announce(`Correct. ${d.name} placed. Tap i to read the fact.`);
    }
  }

  function initTimeline() {
    DnD.enable($('#tl'), { itemSel: '.card', targetSel: '.tl__slot', onDrop: dropTimeline });
    $('#tlReset').addEventListener('click', () => { Sound.play('tap'); resetTimeline(); });
    enterHooks.timeline = () => { if (state.done.has(0) || !$('#tlCols').children.length) resetTimeline(); };
  }

  /* ---- Screen 6: the City Builder's Yard ---- */

  const CITY_STATE = { placed: 0 };

  function resetCity() {
    CITY_STATE.placed = 0;
    const tray = $('#cityTray');
    tray.innerHTML = '';
    shuffle(CITY).forEach((item) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.dataset.name = item.name;
      card.textContent = item.name;
      tray.appendChild(card);
    });
    $('#cityPlaced').innerHTML = '';
    $('#cityBuilt').hidden = true;
    $('#cityBuiltBtn').hidden = true;
    $('#cityNote').hidden = true;
  }

  function cityNote(text, ok) {
    const note = $('#cityNote');
    note.hidden = false;
    setNote(note, text, ok);
  }

  function dropCity(card, zone) {
    const item = CITY.find((x) => x.name === card.dataset.name);
    const key = zone.dataset.zone;
    if (item.zone !== key) {
      Sound.play('wrong');
      restart(zone, 'is-wrong-flash');
      restart($('#cityMap'), 'is-shake');
      cityNote(`Not there — ${ZONE_HINTS[key]}`, false);
      return;
    }
    Sound.play('correct');
    card.remove();
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = item.name;
    chip.style.left = `${item.at[0] - MAP_ORIGIN[0]}px`;
    chip.style.top = `${item.at[1] - MAP_ORIGIN[1]}px`;
    $('#cityPlaced').appendChild(chip);
    cityNote(item.note, true);
    CITY_STATE.placed++;
    if (CITY_STATE.placed === CITY.length) {
      $('#cityBuiltBtn').hidden = false;
      complete(1);
    }
  }

  function initCity() {
    DnD.enable($('#screen-city'), { itemSel: '#cityTray .card', targetSel: '.zone', onDrop: dropCity });
    $$('#cityZones .zone').forEach((zone) => {
      const names = { river: 'Riverbank', centre: 'Settlement centre', high: 'High ground', edge: 'City edge' };
      zone.setAttribute('tabindex', '0');
      zone.setAttribute('role', 'button');
      zone.setAttribute('aria-label', `Zone: ${names[zone.dataset.zone]}`);
    });
    $('#cityReset').addEventListener('click', () => { Sound.play('tap'); resetCity(); });
    $('#cityBuiltBtn').addEventListener('click', () => {
      Sound.play('done');
      $('#cityBuilt').hidden = false;
      $('#cityBuiltBtn').hidden = true;
      $('#cityNote').hidden = true;
    });
    enterHooks.city = () => { if (state.done.has(1) || !$('#cityTray').children.length) resetCity(); };
  }

  /* ---- Screen 8: the Bronze Caster's Workshop ---- */

  const BRONZE = { next: 0 };

  function resetBronze() {
    BRONZE.next = 0;
    const tray = $('#bronzeTray');
    tray.innerHTML = '';
    shuffle(STAGES.map((s, i) => i)).forEach((stageIndex, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.dataset.stage = stageIndex;
      card.textContent = STAGES[stageIndex].name;
      card.style.left = `${BRONZE_X[i % 3]}px`;
      card.style.top = `${i < 3 ? 328 : 414}px`;
      tray.appendChild(card);
    });
    const slots = $('#bronzeSlots');
    slots.innerHTML = '';
    STAGES.forEach((s, i) => {
      const slot = document.createElement('div');
      slot.className = `bronze__slot drop${i === 0 ? ' is-next' : ''}`;
      slot.dataset.slot = i;
      slot.tabIndex = 0;
      slot.setAttribute('role', 'button');
      slot.setAttribute('aria-label', `Slot ${i + 1}`);
      slot.style.left = `${BRONZE_X[i % 3]}px`;
      slot.style.top = `${i < 3 ? 511 : 678}px`;
      slot.innerHTML = `<span>${i + 1}</span>`;
      slots.appendChild(slot);
    });
    $('#bronzeStageImg').hidden = true;
    $('#bronzeCaption').textContent = 'Drag the first step into slot 1 to begin.';
    setNote($('#bronzeNote'), '', true);
    $('#bronze').hidden = false;
    $('#bronzeItext').hidden = false;
    $('#ding').hidden = true;
  }

  function dropBronze(card, slot) {
    const slotIndex = Number(slot.dataset.slot);
    const stageIndex = Number(card.dataset.stage);
    if (slotIndex !== BRONZE.next) {
      Sound.play('wrong');
      restart(slot, 'is-shake');
      setNote($('#bronzeNote'), `Work in sequence — fill slot ${BRONZE.next + 1} next.`, false);
      return;
    }
    if (stageIndex !== BRONZE.next) {
      Sound.play('wrong');
      restart(slot, 'is-shake');
      setNote($('#bronzeNote'), 'Out of order — what has to happen first?', false);
      return;
    }
    Sound.play('correct');
    const s = STAGES[stageIndex];
    card.remove();
    slot.classList.remove('is-next');
    slot.classList.add('is-done');
    slot.removeAttribute('tabindex');
    slot.innerHTML = `<span>${slotIndex + 1}</span><span>${s.name}</span>`;
    slot.setAttribute('aria-label', `Slot ${slotIndex + 1}: ${s.name}`);
    // the illustration redraws in place to show this stage
    const img = $('#bronzeStageImg');
    img.src = `assets/images/bronze-${stageIndex + 1}.png`;
    img.alt = s.caption;
    img.hidden = false;
    restart(img, 'bronze__stage');
    $('#bronzeCaption').textContent = s.caption;
    setNote($('#bronzeNote'), s.note, true);
    BRONZE.next++;
    const nextSlot = $(`.bronze__slot[data-slot="${BRONZE.next}"]`);
    if (nextSlot) nextSlot.classList.add('is-next');
    if (BRONZE.next === STAGES.length) {
      complete(2);
      later(() => {
        $('#bronze').hidden = true;
        $('#bronzeItext').hidden = true;
        $('#ding').hidden = false;
        announce('Inspect the vessel. A ding — bronze poured into a clay mould, holding food for the ancestors.');
      }, 2600);
    }
  }

  function initBronze() {
    DnD.enable($('#bronze'), { itemSel: '.card', targetSel: '.bronze__slot', onDrop: dropBronze });
    $('#bronzeReset').addEventListener('click', () => { Sound.play('tap'); clearTimers(); resetBronze(); });
    enterHooks.bronze = () => { if (state.done.has(2) || !$('#bronzeSlots').children.length) resetBronze(); };
  }

  /* ---- Screens 9-10: the Historian's Curio Shop ---- */

  const ORACLE = { heat: 0, read: new Set(), current: null, stage: 1 };
  const ember = $('#ember');
  const ITEXT_HEAT = 'Drag along the line to increase the heat intensity. The hotter it burns, the more shells break.<br>Tap any cracked shell to read it.';

  function paintFire() {
    const h = ORACLE.heat;
    const knobLeft = (h / 100) * (630 - 78);
    $('#emberKnob').style.left = `${knobLeft - 2}px`;
    $('#emberFill').style.width = h > 0 ? `${knobLeft + 39}px` : '0';
    ember.setAttribute('aria-valuenow', Math.round(h));
    const flame = $('#fireFlame');
    flame.style.setProperty('--flame', (0.35 + (h / 100) * 0.85).toFixed(3));
    flame.style.setProperty('--flame-o', Math.min(1, 0.35 + h / 60).toFixed(2));

    let cracked = 0;
    CRACK_AT.forEach(([key, at]) => {
      const bone = $(`.bone[data-bone="${key}"]`);
      if (h >= at && !bone.classList.contains('is-cracked')) {
        bone.classList.add('is-cracked');
        bone.setAttribute('tabindex', '0');
        bone.setAttribute('role', 'button');
        bone.setAttribute('aria-label', `Cracked oracle bone: ${BONES[key].who}. Tap to read it.`);
        $(`.cracks [data-crack="${key}"]`).classList.add('is-on');
        Sound.play('crack');
      }
      if (bone.classList.contains('is-cracked')) cracked++;
    });
    if (ORACLE.read.size === 5) return;
    const note = $('#emberNote');
    if (cracked === 0) note.textContent = 'Drag the ember right to feed the fire';
    else if (cracked < 5) note.textContent = `${cracked} of 5 shells have cracked`;
    else {
      note.textContent = 'All five shells have cracked';
      $('#oracleItext').innerHTML = 'Cracked — tap any bone to read it.';
    }
  }

  function setHeat(value) {
    // releasing early just pauses the heat; it never goes back down
    ORACLE.heat = Math.max(ORACLE.heat, Math.min(100, Math.max(0, value)));
    if (ORACLE.heat > 2) ember.classList.remove('is-idle');
    paintFire();
  }

  function resetOracle() {
    ORACLE.heat = 0;
    ORACLE.read = new Set();
    $$('.bone').forEach((b) => {
      b.classList.remove('is-cracked', 'is-read');
      b.removeAttribute('tabindex');
      b.removeAttribute('role');
      b.removeAttribute('aria-label');
    });
    $$('.cracks path, .ticks image').forEach((el) => el.classList.remove('is-on'));
    $('#oracleItext').innerHTML = ITEXT_HEAT;
    $('#emberNote').classList.remove('is-done');
    ember.classList.add('is-idle');
    paintFire();
  }

  function initEmber() {
    let dragging = false;
    const fromPointer = (event) => {
      const p = toStage(event.clientX, event.clientY);
      setHeat(((p.x - 645 - 39) / (630 - 78)) * 100);
    };
    ember.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      Sound.unlock();
      dragging = true;
      ember.setPointerCapture(event.pointerId);
      fromPointer(event);
    });
    ember.addEventListener('pointermove', (event) => { if (dragging) fromPointer(event); });
    const stop = () => { dragging = false; };
    ember.addEventListener('pointerup', stop);
    ember.addEventListener('pointercancel', stop);
    ember.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); setHeat(ORACLE.heat + 5); }
      if (event.key === 'End') { event.preventDefault(); setHeat(100); }
    });
  }

  /* the bone panel (a modal on the body.has-modal backdrop) */
  const boneModal = $('#boneModal');

  function optionButton(text, onPick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opt';
    btn.textContent = text;
    btn.addEventListener('click', () => onPick(btn));
    return btn;
  }

  function boneFeedback(text, ok) {
    const fb = $('#boneFb');
    fb.textContent = text;
    fb.classList.toggle('is-ok', ok);
    announce(text);
  }

  function openBone(key) {
    const b = BONES[key];
    ORACLE.current = key;
    boneModal.classList.remove('is-stage2');
    $('#boneAsker').textContent = b.who;
    $('#boneScene').textContent = b.scene;
    $('#boneQ1').textContent = `What does ${b.pronoun} ask?`;
    $('#boneStage2').hidden = true;
    boneFeedback('', true);
    const opts1 = $('#boneOpts1');
    opts1.innerHTML = '';
    shuffle(b.options.map((text, i) => ({ text, ok: i === 0 }))).forEach((o) => {
      opts1.appendChild(optionButton(o.text, (btn) => {
        if (!o.ok) {
          Sound.play('wrong');
          restart(btn, 'is-err');
          boneFeedback('Not that one.', false);
          return;
        }
        Sound.play('correct');
        $$('.opt', opts1).forEach((x) => { x.disabled = true; x.classList.remove('is-err'); });
        btn.classList.add('is-ok');
        boneFeedback(b.note1, true);
        later(() => openStage2(b), 1100);
      }));
    });
    boneModal.hidden = false;
    document.body.classList.add('has-modal');
    $('.opt', opts1).focus();
  }

  function openStage2(b) {
    const opts2 = $('#boneOpts2');
    opts2.innerHTML = '';
    FEELINGS.forEach((feeling) => {
      opts2.appendChild(optionButton(feeling, (btn) => {
        if (feeling !== b.feeling) {
          Sound.play('wrong');
          restart(btn, 'is-err');
          boneFeedback('Think about the feeling behind it.', false);
          return;
        }
        Sound.play('correct');
        $$('.opt', opts2).forEach((x) => { x.disabled = true; x.classList.remove('is-err'); });
        btn.classList.add('is-ok');
        boneFeedback(b.note2, true);
        later(() => finishBone(ORACLE.current), 2600);
      }));
    });
    boneModal.classList.add('is-stage2');
    $('#boneStage2').hidden = false;
    boneFeedback(b.note1, true);
  }

  function finishBone(key) {
    ORACLE.read.add(key);
    const bone = $(`.bone[data-bone="${key}"]`);
    bone.classList.add('is-read');
    bone.removeAttribute('tabindex');
    bone.setAttribute('aria-label', `${BONES[key].who}: read.`);
    $(`.ticks [data-tick="${key}"]`).classList.add('is-on');
    closeBone();
    if (ORACLE.read.size === 5) {
      const note = $('#emberNote');
      note.textContent = 'Kings asked about war; everyone else about rain, children and clay.';
      note.classList.add('is-done');
      announce(note.textContent);
      complete(3);
    }
  }

  function closeBone() {
    clearTimers();
    boneModal.hidden = true;
    document.body.classList.remove('has-modal');
    const bone = ORACLE.current && $(`.bone[data-bone="${ORACLE.current}"]`);
    ORACLE.current = null;
    if (bone && bone.hasAttribute('tabindex')) bone.focus({ preventScroll: true });
  }

  function initOracle() {
    initEmber();
    $$('.bone').forEach((bone) => {
      const open = () => {
        if (!bone.classList.contains('is-cracked') || bone.classList.contains('is-read')) return;
        Sound.play('tap');
        openBone(bone.dataset.bone);
      };
      bone.addEventListener('click', open);
      bone.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
      });
    });
    $('#boneClose').addEventListener('click', () => { Sound.play('tap'); closeBone(); });
    $('#oracleReset').addEventListener('click', () => { Sound.play('tap'); resetOracle(); });
    enterHooks.oracle = () => { if (state.done.has(3) || ORACLE.heat === 0) resetOracle(); };
  }

  /* ---- Screen 11: journey of the silk ---- */

  const SILK_STATE = { lit: 0 };
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function resetSilk() {
    SILK_STATE.lit = 0;
    const chain = $('#chain');
    $$('.plaque', chain).forEach((p) => p.remove());
    $$('.thread', chain).forEach((t) => t.remove());
    SILK.forEach((s, i) => {
      const plaque = document.createElement('button');
      plaque.type = 'button';
      plaque.className = `plaque${i === 0 ? ' is-lit' : ' is-hidden'}`;
      plaque.style.left = `${PLAQUE_X[i]}px`;
      plaque.dataset.index = i;
      plaque.setAttribute('aria-label', `${s.title}, ${s.sub}`);
      plaque.innerHTML = `<img class="plaque__img" src="assets/images/${s.img}" alt="${s.alt}">` +
        `<span class="plaque__title">${s.title}</span><span class="plaque__sub">${s.sub}</span><span class="plaque__tap">Tap</span>`;
      plaque.addEventListener('click', () => tapPlaque(i));
      chain.appendChild(plaque);
    });
    setNote($('#silkNote'), '', true);
    $('#deskBtn').hidden = true;
  }

  function tapPlaque(i) {
    if (i !== SILK_STATE.lit) return;
    const plaques = $$('.plaque');
    plaques[i].classList.remove('is-lit');
    SILK_STATE.lit = -1;
    setNote($('#silkNote'), SILK[i].caption, true);
    if (i === SILK.length - 1) {
      Sound.play('done');
      $('#deskBtn').hidden = false;
      return;
    }
    Sound.play('whoosh');
    drawThread(i, () => {
      plaques[i + 1].classList.remove('is-hidden');
      plaques[i + 1].classList.add('is-lit');
      SILK_STATE.lit = i + 1;
    });
  }

  /** A wavy silk thread from the right edge of plaque i to the left edge of the next, drawn over ~1 s. */
  function drawThread(i, done) {
    const x1 = PLAQUE_X[i] + 340;
    const x2 = PLAQUE_X[i + 1];
    const y = 520;
    const dir = i % 2 === 0 ? -1 : 1; // alternate arcing up then down
    const w = x2 - x1;
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'thread');
    path.setAttribute('d', `M${x1 - 6},${y} C${x1 + w * 0.3},${y + 34 * dir} ${x1 + w * 0.45},${y - 30 * dir} ${x1 + w * 0.6},${y} S${x2 - 30},${y} ${x2 - 4},${y}`);
    $('#chainThreads').appendChild(path);
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    const t0 = performance.now();
    const step = (now) => {
      if (!path.isConnected) return;
      const t = Math.min(1, (now - t0) / 1000);
      path.style.strokeDashoffset = `${len * (1 - t)}`;
      if (t < 1) requestAnimationFrame(step);
      else {
        path.style.strokeDasharray = 'none';
        path.setAttribute('marker-end', 'url(#threadHead)');
        done();
      }
    };
    requestAnimationFrame(step);
  }

  function initSilk() {
    $('#silkReset').addEventListener('click', () => { Sound.play('tap'); resetSilk(); });
    $('#deskBtn').addEventListener('click', () => { Sound.play('tap'); goTo('desk'); });
    enterHooks.silk = () => { if (state.done.has(4) || !$('.plaque')) resetSilk(); };
  }

  /* ---- Screen 12: the trade desk ---- */

  const DESK = { sorted: 0 };

  function resetDesk() {
    DESK.sorted = 0;
    const items = $('#deskItems');
    items.innerHTML = '';
    shuffle(GOODS).forEach((g) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'item';
      item.dataset.key = g.key;
      item.setAttribute('aria-label', g.name);
      item.innerHTML = `<img src="assets/svg/icon-${g.key}.svg" alt=""><span>${g.name}</span>`;
      items.appendChild(item);
    });
    $$('.chamber__tags').forEach((t) => { t.innerHTML = ''; });
    $('#deskClear').hidden = true;
    $('#deskSummaryBtn').hidden = true;
    setNote($('#deskNote'), '', true);
  }

  function dropDesk(item, chamber) {
    const g = GOODS.find((x) => x.key === item.dataset.key);
    if (chamber.dataset.chamber !== g.to) {
      Sound.play('wrong');
      restart(chamber, 'is-shake');
      setNote($('#deskNote'), 'Not that one — which way does it travel?', false);
      return;
    }
    Sound.play('correct');
    item.classList.add('is-gone');
    item.setAttribute('aria-hidden', 'true');
    item.tabIndex = -1;
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = g.name;
    $('.chamber__tags', chamber).appendChild(tag);
    setNote($('#deskNote'), g.note, true);
    DESK.sorted++;
    if (DESK.sorted === GOODS.length) {
      $('#deskClear').hidden = false;
      setNote($('#deskNote'), 'Silk went west in such quantity that the whole route took its name.', true);
      $('#deskSummaryBtn').hidden = false;
      complete(4);
    }
  }

  function initDesk() {
    $$('.chamber').forEach((c) => {
      c.classList.add('drop');
      c.tabIndex = 0;
      c.setAttribute('role', 'button');
      c.setAttribute('aria-label', `Chamber: ${$('b', c).textContent}, ${$('span', c).textContent}`);
    });
    DnD.enable($('#desk'), { itemSel: '.item', targetSel: '.chamber', onDrop: dropDesk });
    $('#deskReset').addEventListener('click', () => { Sound.play('tap'); resetDesk(); });
    $('#deskSummaryBtn').addEventListener('click', () => { Sound.play('tap'); openSummary(); });
    enterHooks.desk = () => { if (state.done.has(4) || !$('#deskItems').children.length) resetDesk(); };
  }

  /* ---- Screen 13: summary (a modal on the body.has-modal backdrop) ---- */

  function openSummary() {
    $('#summary').hidden = false;
    document.body.classList.add('has-modal');
    $('#summaryBack').focus();
  }

  function closeSummary() {
    $('#summary').hidden = true;
    document.body.classList.remove('has-modal');
  }

  function initSummary() {
    $('#marketSummaryBtn').addEventListener('click', () => { Sound.play('tap'); openSummary(); });
    $('#summaryBack').addEventListener('click', () => { Sound.play('tap'); closeSummary(); goTo('market'); });
    $('#summaryRestart').addEventListener('click', () => {
      Sound.play('tap');
      closeSummary();
      state.done.clear();
      resetTimeline();
      resetCity();
      resetBronze();
      resetOracle();
      resetSilk();
      resetDesk();
      goTo('intro');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (!boneModal.hidden) closeBone();
    });
  }

  /* ---- boot ---- */

  enterHooks.market = renderMarket;
  $$('[data-back]').forEach((btn) => btn.addEventListener('click', () => { Sound.play('tap'); goTo('market'); }));

  initIntro();
  initTimeline();
  initCity();
  initBronze();
  initOracle();
  initSilk();
  initDesk();
  initSummary();

  fitStage();
  window.addEventListener('resize', fitStage);
  goTo('intro');
}());
