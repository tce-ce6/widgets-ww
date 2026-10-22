/* ==========================================================================
   The Egyptian Civilisation Museum - widget logic
   Plain ES6+, no dependencies. Sections:
     1. Content data (taken from the storyboard data tables)
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

  const GALLERIES = [
    { name: 'Sources Gallery', title: 'Sources Gallery', icon: 'card-1.svg', start: 'sources' },
    { name: 'Life by the Nile Gallery', title: 'Life by the Nile Gallery', icon: 'card-2.svg', start: 'nile' },
    { name: 'Social Life Gallery', title: 'Social Life Gallery', icon: 'card-3.svg', start: 'pyramid' },
    { name: 'Cultural Life Gallery', title: 'Cultural Life Gallery', icon: 'card-4.svg', start: 'leisure' }
  ];

  const SOURCES = [
    { id: 'stone', name: 'The Rosetta Stone', img: 'rosetta-stone.svg', alt: 'The Rosetta Stone, a grey slab covered in lines of writing.' },
    { id: 'papyrus', name: 'Papyrus Scroll', img: 'papyrus-scroll.svg', alt: 'A papyrus scroll covered in hieroglyphs.' },
    { id: 'greek', name: 'Greek Traveller’s Account', img: 'greek-account.svg', alt: 'A Greek traveller holding a scroll.' },
    { id: 'jar', name: 'Labelled Storage Jar', img: 'storage-jar.svg', alt: 'A clay storage jar with a label.' }
  ];

  const PAIRINGS = [
    { ids: ['stone', 'papyrus'], slips: ['The stone repeats one decree in three scripts.', 'Papyrus held both tales and household accounts.', 'Greek stayed readable long after Egypt’s script.'], answer: 'Egypt’s own papyrus records can finally be read.', title: 'The script becomes readable', note: 'The Rosetta Stone carried three types of writing, one of them Greek. Because people could still read Greek, it worked like a bilingual dictionary for a lost language. In 1822 Champollion used it to decipher the Egyptian script, which meant every papyrus record could finally be read.' },
    { ids: ['greek', 'stone'], slips: ['Herodotus reached Egypt in the fifth century.', 'A French engineer found the stone in 1799.', 'One of the three carved scripts is Greek.'], answer: 'A visitor’s tongue unlocked Egypt’s own script.', title: 'Why Greek was the key', note: 'Greek writers such as Herodotus visited Egypt as early as the 5th century BCE, so Greek was a living, readable language long after Egyptian script was forgotten. That is why the Greek section of the stone unlocked the other two.' },
    { ids: ['jar', 'papyrus'], slips: ['Scrolls were rolled rather than bound as books.', 'Jars stood labelled in rows along the shelves.', 'A sealed jar keeps damp away for centuries.'], answer: 'Storage is why the oldest Sindbad survived.', title: 'A library in clay', note: 'Libraries dating back to 2000 BCE stored papyrus scrolls in labelled jars on shelves. One such jar held the oldest known version of the story of Sindbad the Sailor.' },
    { ids: ['greek', 'papyrus'], slips: ['Greeks explained Egypt to readers far away.', 'Egyptians kept their own accounts on papyrus.', 'Herodotus wrote in the fifth century BCE.'], answer: 'One account can now be tested against the other.', title: 'Two sides of one story', note: 'A Greek account is an outsider looking in; a papyrus record is Egypt describing itself. Set side by side, a historian can test one against the other instead of trusting either alone.' },
    { ids: ['greek', 'jar'], slips: ['Greek writers described Egyptian customs closely.', 'A jar is an object lifted from the ground.', 'Its label names whatever was stored inside.'], answer: 'A traveller’s tale now has an object behind it.', title: 'Words against objects', note: 'A visitor can describe what they saw, but an object proves it existed. When a Greek description matches a jar dug out of the ground, a claim stops being a traveller’s tale and becomes evidence.' },
    { ids: ['jar', 'stone'], slips: ['Storage jars carry short written labels.', 'The stone reopened Egypt’s lost script.', 'Champollion finished deciphering in 1822.'], answer: 'Shelved pots can now be read as a catalogue.', title: 'Reading the labels', note: 'Once the script was deciphered, the writing on jars and shelves could be read too. Labels turn a shelf of pots into a catalogue, showing what was stored and how Egyptians organised their records.' }
  ];

  // Reference course of the Nile in map-pixel coordinates (760 x 507 map image).
  const NILE_PATH = [[330, 507], [340, 440], [360, 370], [385, 300], [405, 235], [415, 175], [418, 120], [415, 70]];
  const NILE_ANSWER_PATHS = [
    NILE_PATH.slice(0, -1),
    [[418, 120], [395, 95], [365, 65]],
    [[418, 120], [415, 80], [415, 35]],
    [[418, 120], [435, 90], [465, 60]]
  ];
  const NILE_TOLERANCE = 60;
  window.museumHowTo = { nilePath: NILE_PATH }; // read by how-to-play.js

  const SEASONS = [
    { label: 'Inundation – Autumn', img: '01-autumn.png', alt: 'Autumn: the Nile floods the fields around a mud-brick house.', note: 'The Egyptian calendar had three seasons of four months each. Inundation came in autumn, when the Nile flooded and covered the fields.' },
    { label: 'Peret – Growing, Winter', img: '02-winter.png', alt: 'Winter: green shoots grow in dark damp soil beside water channels.', note: 'Peret was the growing season in winter. Once the water drained away, seed was sown in the soil left behind by the flood.' },
    { label: 'Shemu – Harvest, Summer', img: '03-summer.png', alt: 'Summer: farmers cut tall golden stalks under a high sun.', note: 'Shemu was the harvest season in summer. The whole calendar was based on the rising of Sirius, the Dog Star.' }
  ];

  const RIVER = [
    { key: 'ditch', label: 'Water led into the fields', img: 'river-01.png', alt: 'A worker with a hoe digs a channel from the river to planted field strips.', note: 'Farmers discovered that by digging ditches they could divert water from the Nile straight into their fields.' },
    { key: 'basin', label: 'Water kept back for later', img: 'river-02.png', alt: 'A walled basin holds still water, fed by a channel from the river.', note: 'Water was stored in reservoirs so the fields could be watered long after the flood had drained away.' },
    { key: 'dam', label: 'Water held by a built wall', img: 'river-03.png', alt: 'Several workers stack stone blocks to build a wall across the water.', note: 'Constructing dams demanded collective effort, and that shared work gave rise to Egypt’s earliest local government.' },
    { key: 'mud', label: 'Mud left where water stood', img: 'river-04.png', alt: 'Dark rich mud with a thin pool of water and one figure standing on the silt.', note: 'When the flood drew back it left rich black mud behind. That silt, not the water itself, is what made the land fertile.' }
  ];

  const PYRAMID = [
    { key: 'pharaoh', label: 'Pharaoh', img: 'tier-pharaoh.svg', alt: 'The pharaoh in a nemes headcloth and crown.', note: 'Ruled Egypt with supreme power over land, law and religion.' },
    { key: 'officials', label: 'Officials, Nobles & Priests', img: 'tier-officials.svg', alt: 'A scribe, noble official and priest.', note: 'Managed the kingdom, collected taxes, led ceremonies and advised the pharaoh. This administrative class grew out of the collective effort needed to dig ditches and build dams.' },
    { key: 'merchants', label: 'Free Landholders, Artisans & Merchants', img: 'tier-merchants.svg', alt: 'An artisan making pottery.', note: 'Farmed their own land, crafted pottery and jewellery, and traded goods along the Nile.' },
    { key: 'serfs', label: 'Serfs & Slaves', img: 'tier-serfs.svg', alt: 'A labourer carrying a heavy stone block.', note: 'Carried out the hardest labour on fields and building sites, and held the fewest rights.' }
  ];

  const PUZZLES = [
    {
      heading: 'Portrait of a Queen', img: 'cleopatra.png', doneCaption: 'Restored! Cleopatra',
      question: 'Cleopatra became queen at eighteen. What helped prepare her for leadership?',
      options: [ 'Received a royal education', 'Chosen as queen by the Roman Senate', 'Won the throne by leading an army', 'Appointed by the priests of Egypt'],
      answer: 0,
      explanation: 'Cleopatra was trained from childhood to rule. That long preparation is what made her ready to take the throne at eighteen. Her authority came from an upbringing shaped for leadership, not from an army or an outside power.',
      next: 'Next: The Preserved Body'
    },
    {
      heading: 'The Preserved Body', img: 'mummy.png', doneCaption: 'Restored! The mummification scene',
      question: 'Why did the Egyptians go to such lengths to preserve the body after death?',
      options: ['To display the body at yearly festivals', 'To keep the tomb free of damp', 'To prove the person had been wealthy', 'To keep the body fit for the ka to return to'],
      answer: 3,
      explanation: 'Egyptians believed each person had a ka, a spiritual double that lived on after death only if the body was preserved. That belief is why pyramids were built at all.',
      next: 'Return to the Keeper’s Hall'
    }
  ];

  const LEISURE = [
    { key: 'swim', label: 'Swimming in the river', img: 'leisure-01.png', alt: 'Swimmers crossing the Nile with ripples around them.', note: 'Early Egyptians swam in the same river that watered their fields.' },
    { key: 'canoe', label: 'Canoeing on the Nile', img: 'leisure-02.png', alt: 'Reed boats with paddlers on the Nile.', note: 'They canoed along the Nile, the highway that carried goods and people through Egypt.' },
    { key: 'board', label: 'Playing board games', img: 'leisure-03.png', alt: 'Two seated figures playing a board game in the shade.', note: 'Board games were a favourite pastime, played in the shade of an awning.' },
    { key: 'music', label: 'Making music together', img: 'leisure-04.png', alt: 'Musicians playing a harp, a drum and a pipe.', note: 'Egyptians enjoyed music, played on harps and on rattles such as the sistrum.' },
    { key: 'dance', label: 'Dancing at a Feast', img: 'leisure-05.png', alt: 'Dancers with raised arms at a feast.', note: 'Dancing belonged to feasts and festivals alike, and often went with the music.' }
  ];
  const LEISURE_DISTRACTORS = ['Riding camels by the Nile', 'Reading printed books'];

  const PROCESSION = [
    { key: 'statue', label: 'The god’s statue', img: 'procession-01.png', alt: 'A seated golden statue of a god, crowned, against a night sky.', note: 'Each god had a festival in which their statue was carried out of the temple and paraded before the people.' },
    { key: 'barque', label: 'Bearers of the barque', img: 'procession-02.png', alt: 'A carrying barque on poles with four bearers beneath it.', note: 'The statue rode on a carrying barque, lifted on poles by teams of bearers.' },
    { key: 'sistrum', label: 'Rattling the sistrum', img: 'procession-03.png', alt: 'A large sistrum with motion lines either side.', note: 'Music accompanied the procession, played on instruments such as the sistrum.' },
    { key: 'priest', label: 'Priests leading the way', img: 'procession-04.png', alt: 'A robed priest holding up a standard topped with an ankh loop.', note: 'Priests walked ahead of the statue, carrying the standards of the god.' },
    { key: 'crowd', label: 'The crowd bowing low', img: 'procession-05.png', alt: 'Three figures bowing with hands raised, buildings behind them.', note: 'These grand events showed the people’s deep reverence for their gods and their ruler.' },
    { key: 'sed', label: 'The Sed festival', img: 'procession-06.png', alt: 'A crowned king enthroned with the number 30 on either side.', note: 'Festivals also celebrated the pharaoh. The Sed festival marked a king’s thirtieth year on the throne.' }
  ];

  /* ------------------------------------------------------------------------
     2. HELPERS, STAGE SCALING, NAVIGATION
     ------------------------------------------------------------------------ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const stage = $('#stage');
  const liveRegion = $('#liveRegion');

  const state = { completedGalleries: new Set(), current: null, portraitRound: 0 };
  const enterHooks = {};
  const leaveHooks = {};

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
    window.setTimeout(() => { liveRegion.textContent = message; }, 30);
  }

  function setText(el, text) { el.textContent = text; }

  function restartAnimation(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  /** Fits the fixed 1920x1080 stage inside the window, centred. */
  function fitStage() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / 1920, vh / 1080);
    stage.style.transform = `translate(${(vw - 1920 * scale) / 2}px, ${(vh - 1080 * scale) / 2}px) scale(${scale})`;
    $('#rotateHint').hidden = !(vh > vw && vw < 700);
  }

  /** Converts a client (viewport) position to stage coordinates. */
  function toStage(clientX, clientY) {
    const rect = stage.getBoundingClientRect();
    const scale = rect.width / 1920;
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
  }

  function goTo(id) {
    const next = $(`#screen-${id}`);
    if (!next) return;
    if (state.current && leaveHooks[state.current]) leaveHooks[state.current]();
    DnD.clearSelection();
    $$('.screen.is-active').forEach((screen) => screen.classList.remove('is-active'));
    next.classList.add('is-active');
    state.current = id;
    renderTracker();
    if (enterHooks[id]) enterHooks[id]();
    const heading = $('.ribbon, h2', next);
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  /** Adds the shared panel, gallery tag, ribbon title and Keeper's Hall button. */
  function buildGalleryFrames() {
    $$('.gallery').forEach((section) => {
      const gallery = GALLERIES[Number(section.dataset.gallery)];
      const panel = document.createElement('div');
      panel.className = 'panel';
      panel.innerHTML = `<div class="panel__bar"><span class="gallery-pill"></span><h2 class="ribbon"></h2></div>`;
      $('.gallery-pill', panel).textContent = gallery.name;
      const ribbon = $('.ribbon', panel);
      ribbon.id = `title-${section.dataset.screen}`;
      ribbon.textContent = section.dataset.title;
      $('.screen__tint', section).after(panel);

      const tracker = document.createElement('ol');
      tracker.className = 'tracker';
      tracker.setAttribute('aria-label', 'Gallery progress');
      panel.after(tracker);

      const hall = document.createElement('button');
      hall.type = 'button';
      hall.className = 'btn-hall';
      hall.style.zIndex = '40';
      hall.innerHTML = '&larr; Keeper’s Hall';
      hall.addEventListener('click', () => goTo('hub'));
      section.appendChild(hall);
    });
  }

  function unlockNext(galleryIndex) {
    state.completedGalleries.add(galleryIndex);
    renderTracker();
    Sound.play('key');
  }

  function leaveGallery(galleryIndex) {
    if (galleryIndex >= GALLERIES.length - 1) goTo('end');
    else goTo('hub');
  }

  /* ------------------------------------------------------------------------
     3. SOUND (Web Audio, synthesised)
     ------------------------------------------------------------------------ */

  const Sound = (function () {
    let ctx = null;
    let master = null;
    let bus = null;
    let muted = false;
    let live = [];
    let noise = null;

    function ensure() {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        ctx = new AudioCtx();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.8;
        master.connect(ctx.destination);
        const length = ctx.sampleRate * 2;
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

    function play(name) {
      if (muted || !ensure()) return;
      const t = ctx.currentTime;
      if (name === 'correct') { tone(660, t, 0.2, 'triangle', 0.2); tone(880, t + 0.1, 0.32, 'triangle', 0.2); }
      else if (name === 'wrong') { tone(190, t, 0.25, 'sawtooth', 0.09); tone(140, t + 0.13, 0.32, 'sawtooth', 0.09); }
      else if (name === 'tap') { tone(520, t, 0.07, 'square', 0.04); }
      else if (name === 'key') { [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.12, 0.55, 'triangle', 0.18)); }
      else if (name === 'door') {
        const src = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        src.buffer = noise;
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, t);
        filter.frequency.exponentialRampToValueAtTime(90, t + 1.6);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
        src.connect(filter).connect(gain).connect(master);
        src.start(t, 0, 1.8);
      }
    }

    function noiseBurst(when, duration, gainValue, filterType, frequency, q) {
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      src.buffer = noise;
      filter.type = filterType;
      filter.frequency.value = frequency;
      filter.Q.value = q || 1;
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.linearRampToValueAtTime(gainValue, when + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
      src.connect(filter).connect(gain).connect(bus);
      src.start(when, Math.random() * 1.5, duration + 0.05);
      live.push(src);
    }

    function drumHit(when, startFreq, endFreq, gainValue) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, when);
      osc.frequency.exponentialRampToValueAtTime(endFreq, when + 0.22);
      gain.gain.setValueAtTime(gainValue, when);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.38);
      osc.connect(gain).connect(bus);
      osc.start(when);
      osc.stop(when + 0.42);
      live.push(osc);
    }

    /** Crowd voices: a few detuned saw waves shaped by "ah" vowel formants. */
    function voices(from, until) {
      const fade = ctx.createGain();
      fade.gain.setValueAtTime(0.0001, from);
      fade.gain.linearRampToValueAtTime(0.22, from + 3.5);
      fade.gain.setValueAtTime(0.22, until - 3);
      fade.gain.linearRampToValueAtTime(0.0001, until);
      fade.connect(bus);
      [800, 1150, 2900].forEach((formant, index) => {
        const band = ctx.createBiquadFilter();
        band.type = 'bandpass';
        band.frequency.value = formant;
        band.Q.value = 7;
        const level = ctx.createGain();
        level.gain.value = [1, 0.6, 0.25][index];
        band.connect(level).connect(fade);
        [165, 196, 220, 247, 294].forEach((base, voice) => {
          const osc = ctx.createOscillator();
          const vibrato = ctx.createOscillator();
          const vibratoDepth = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.value = base;
          osc.detune.value = (voice - 2) * 7;
          vibrato.frequency.value = 4.5 + voice * 0.3;
          vibratoDepth.gain.value = 6;
          vibrato.connect(vibratoDepth).connect(osc.detune);
          osc.connect(band);
          osc.start(from);
          vibrato.start(from);
          osc.stop(until + 0.1);
          vibrato.stop(until + 0.1);
          live.push(osc, vibrato);
        });
      });
      const murmur = ctx.createBufferSource();
      const murmurFilter = ctx.createBiquadFilter();
      const murmurGain = ctx.createGain();
      murmur.buffer = noise;
      murmur.loop = true;
      murmurFilter.type = 'bandpass';
      murmurFilter.frequency.value = 900;
      murmurFilter.Q.value = 0.9;
      murmurGain.gain.setValueAtTime(0.0001, from);
      murmurGain.gain.linearRampToValueAtTime(0.16, from + 3.5);
      murmurGain.gain.setValueAtTime(0.16, until - 3);
      murmurGain.gain.linearRampToValueAtTime(0.0001, until);
      murmur.connect(murmurFilter).connect(murmurGain).connect(bus);
      murmur.start(from);
      murmur.stop(until + 0.1);
      live.push(murmur);
    }

    /** Sistrum rattle first, then drums, then the crowd's voices. */
    function startProcession(seconds) {
      stopProcession();
      if (!ensure()) return;
      bus = ctx.createGain();
      bus.gain.value = 1;
      bus.connect(master);
      const t0 = ctx.currentTime + 0.1;

      for (let t = 0; t < seconds - 1; t += 0.16 + Math.random() * 0.05) {
        noiseBurst(t0 + t, 0.1, t < 7 ? 0.5 : 0.2, 'highpass', 6500, 0.7);
      }
      const beat = 60 / 84;
      let step = 0;
      for (let t = 5.5; t < seconds - 0.5; t += beat / 2, step++) {
        const swell = Math.min(1, (t - 5.5) / 5);
        if (step % 2 === 0) drumHit(t0 + t, 130, 55, 0.7 * swell);
        else drumHit(t0 + t, 210, 120, 0.3 * swell);
      }
      voices(t0 + 10.5, t0 + seconds);
    }

    function stopProcession() {
      live.forEach((node) => { try { node.stop(); } catch (e) { /* already stopped */ } });
      live = [];
      if (bus) {
        try { bus.gain.value = 0; bus.disconnect(); } catch (e) { /* ignore */ }
        bus = null;
      }
    }

    function setMuted(value) {
      muted = value;
      if (master) master.gain.value = muted ? 0 : 0.8;
    }

    return { play, startProcession, stopProcession, setMuted, unlock: ensure };
  }());

  /* ------------------------------------------------------------------------
     4. DRAG AND DROP ENGINE
        - pointer drag with a semi-transparent copy following the finger
        - valid target highlights red while hovered
        - dropping on the wrong place simply leaves the item in its tray
        - tap an item, then tap a target (also works with the keyboard)
     ------------------------------------------------------------------------ */

  const DnD = (function () {
    const registry = new WeakMap();
    let drag = null;
    let selected = null;
    let selectedRoot = null;
    let suppressClick = false;

    const isOff = (el) => el.classList.contains('is-gone') || el.classList.contains('is-disabled');

    function enable(root, options) {
      if (!registry.has(root)) {
        root.addEventListener('pointerdown', (event) => onDown(event, root));
        root.addEventListener('click', (event) => onClick(event, root));
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
      const stack = document.elementsFromPoint(clientX, clientY);
      for (const el of stack) {
        const target = el.closest(options.targetSel);
        if (target && root.contains(target) && target !== item && !isOff(target)
          && (!options.canDrop || options.canDrop(item, target))) {
          return target;
        }
      }
      return null;
    }

    function onDown(event, root) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const options = registry.get(root);
      const item = event.target.closest(options.itemSel);
      if (!item || !root.contains(item) || isOff(item)) return;
      if (options.canDrag && !options.canDrag(item)) return;
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
      ghost.classList.remove('is-selected', 'is-dragging', 'is-over');
      ghost.classList.add('drag-ghost');
      ghost.style.width = `${item.offsetWidth}px`;
      ghost.style.height = `${item.offsetHeight}px`;
      ghost.style.animation = 'none';
      ghost.setAttribute('aria-hidden', 'true');
      ghost.tabIndex = -1;
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
        if (target && target !== selected && !isOff(target) && (!options.canDrop || options.canDrop(selected, target))) {
          const picked = selected;
          clearSelection();
          options.onDrop(picked, target);
          return;
        }
        if (item === selected) { clearSelection(); return; }
      }
      if (item && !isOff(item) && (!options.canDrag || options.canDrag(item))) select(item, root);
      else clearSelection();
    }

    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') clearSelection(); });

    return { enable, clearSelection };
  }());

  /* ------------------------------------------------------------------------
     5. SCREENS AND ACTIVITIES
     ------------------------------------------------------------------------ */

  /* ---- Screen 1 and 2: title and reception ---- */

  function initIntro() {
    const title = $('#screen-title');
    const doors = {};
    ['title', 'reception'].forEach((id) => {
      if (!window.lottie) return;
      const door = window.lottie.loadAnimation({
        container: $(`#${id}Lottie`), renderer: 'svg', loop: false, autoplay: false,
        path: 'assets/json/door.json',
        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
      });
      doors[id] = door;
      // Title waits on the first frame; the reception shows the final frame the opening door ends on.
      enterHooks[id] = () => door.goToAndStop(id === 'title' ? 0 : door.totalFrames - 1, true);
    });
    $('#btnOpenDoor').addEventListener('click', () => {
      if (title.classList.contains('is-zooming')) return;
      Sound.unlock();
      Sound.play('door');
      title.classList.add('is-zooming');
      if (doors.title) {
        const onDone = () => { doors.title.removeEventListener('complete', onDone); goTo('reception'); };
        doors.title.addEventListener('complete', onDone);
        doors.title.goToAndPlay(0, true);
      } else {
        window.setTimeout(() => goTo('reception'), 1700);
      }
    });
    $('#btnFirstKey').addEventListener('click', () => { Sound.play('tap'); goTo('hub'); });
  }

  /* ---- Screens 3, 6, 10, 14: the Keeper's Hall ---- */

  /** Four round icons, one per gallery: green once that gallery is completed. */
  function renderTracker() {
    $$('.tracker').forEach((tracker) => {
      tracker.innerHTML = '';
      GALLERIES.forEach((gallery, index) => {
        const done = state.completedGalleries.has(index);
        const item = document.createElement('li');
        item.className = `tracker__step${done ? ' is-done' : ''}`;
        item.setAttribute('aria-label', `${gallery.name}: ${done ? 'completed' : 'not completed yet'}`);
        const icon = done ? `tracker-done-${index + 1}.svg` : gallery.icon;
        item.innerHTML = `<img src="assets/svg/${icon}" alt="">`;
        tracker.appendChild(item);
      });
    });
  }

  function renderHub() {
    const list = $('#cardList');
    list.innerHTML = '';
    GALLERIES.forEach((gallery, index) => {
      const status = state.completedGalleries.has(index) ? 'done' : 'open';
      const item = document.createElement('li');
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `hall-card is-${status}`;
      card.style.left = `${150 + index * 412}px`;
      const statusText = status === 'done' ? 'Completed. Tap to revisit.' : 'Unlocked. Tap to begin.';
      card.setAttribute('aria-label', `Gallery ${index + 1}: ${gallery.name}. ${statusText}`);
      const badge = status === 'done' ? 'badge-done.svg' : 'badge-key.svg';
      card.innerHTML = `
        <img class="hall-card__frame" src="assets/svg/card-frame.svg" alt="">
        <span class="hall-card__plate">Gallery ${index + 1}</span>
        <img class="hall-card__icon" src="assets/svg/${gallery.icon}" alt="">
        <span class="hall-card__title"></span>
        <img class="hall-card__badge" src="assets/svg/${badge}" alt="">`;
      $('.hall-card__title', card).innerHTML = gallery.name.replace(' Gallery', '<br>Gallery');
      card.addEventListener('click', () => {
        Sound.play('tap');
        goTo(gallery.start);
      });
      item.appendChild(card);
      list.appendChild(item);
    });
  }

  /* ---- Gallery 1: sources (screens 4 and 5) ---- */

  const Sources = { solved: false, found: false, pairing: null };

  function sourceCardMarkup(source) {
    return `<span class="object-card__art"><img src="assets/svg/${source.img}" alt="${source.alt}"></span>
            <span class="object-card__name">${source.name}</span>`;
  }

  function initSources() {
    const row = $('#objectRow');
    const lefts = [150, 570, 990, 1410];
    SOURCES.forEach((source, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'object-card';
      card.dataset.id = source.id;
      card.style.left = `${lefts[index]}px`;
      card.setAttribute('aria-label', source.name);
      card.innerHTML = sourceCardMarkup(source);
      // Gentle 3D tilt that follows the pointer.
      card.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse' || card.classList.contains('is-dragging')) return;
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const art = $('.object-card__art img', card);
        art.style.setProperty('--tilt-x', `${(px * 36).toFixed(1)}deg`);
        art.style.setProperty('--tilt-y', `${(-py * 24).toFixed(1)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        const art = $('.object-card__art img', card);
        art.style.setProperty('--tilt-x', '0deg');
        art.style.setProperty('--tilt-y', '0deg');
      });
      row.appendChild(card);
    });

    DnD.enable($('#screen-sources'), {
      itemSel: '#objectRow .object-card',
      targetSel: '#objectRow .object-card',
      canDrop: (item, target) => item !== target,
      onDrop: (item, target) => openClaim(item.dataset.id, target.dataset.id)
    });

    $('#btnClaimClose').addEventListener('click', closeClaim);
    $('#btnDig').addEventListener('click', closeClaim);
    $('#btnClaimKey').addEventListener('click', claimKey);
    $('#btnClaimTable').addEventListener('click', claimKey);
    $('#btnInfoClose').addEventListener('click', () => { $('#infoModal').hidden = true; $('#btnDig').focus(); });

    enterHooks.sources = () => {
      Sources.solved = false;
      $('#claimOverlay').hidden = true;
      $('#infoModal').hidden = true;
      $('#tableNote').hidden = true;
      $('#btnClaimTable').hidden = true;
    };
  }

  function sourceById(id) { return SOURCES.find((source) => source.id === id); }

  function openClaim(firstId, secondId) {
    const pairing = PAIRINGS.find((p) => p.ids.includes(firstId) && p.ids.includes(secondId));
    Sources.pairing = pairing;
    Sources.found = false;
    const first = sourceById(firstId);
    const second = sourceById(secondId);
    setText($('#claimPairName'), `${first.name} + ${second.name}`);

    const holder = $('#claimObjects');
    holder.innerHTML = '';
    [[first, 190], [second, 576]].forEach(([source, left]) => {
      const card = document.createElement('div');
      card.className = 'object-card';
      card.style.left = `${left}px`;
      card.innerHTML = sourceCardMarkup(source);
      holder.appendChild(card);
    });
    const plus = document.createElement('span');
    plus.className = 'claim__plus';
    plus.setAttribute('aria-hidden', 'true');
    plus.textContent = '+';
    holder.appendChild(plus);

    const grid = $('#slipGrid');
    grid.innerHTML = '';
    shuffle([...pairing.slips.map((text) => ({ text, right: false })), { text: pairing.answer, right: true }])
      .forEach((slip, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'slip';
        button.style.top = `${index * 110}px`;
        button.textContent = slip.text;
        button.addEventListener('click', () => chooseSlip(button, slip.right));
        grid.appendChild(button);
      });

    const feedback = $('#claimFeedback');
    feedback.textContent = '';
    feedback.className = 'claim__feedback';
    $('#btnDig').hidden = !Sources.solved;
    $('#btnClaimKey').hidden = !Sources.solved;
    $('#claimOverlay').hidden = false;
    $('#btnClaimClose').focus();
    announce(`${first.name} plus ${second.name}. Tap the claim that only works if you use both objects.`);
  }

  function chooseSlip(button, isRight) {
    if (Sources.found) return;
    const feedback = $('#claimFeedback');
    if (!isRight) {
      restartAnimation(button, 'is-wrong');
      feedback.className = 'claim__feedback is-wrong';
      setText(feedback, 'Not quite – one of these objects could tell you that by itself. Try again.');
      Sound.play('wrong');
      announce(feedback.textContent);
      window.setTimeout(() => button.classList.remove('is-wrong'), 900);
      return;
    }
    Sources.found = true;
    Sources.solved = true;
    button.classList.add('is-right');
    $$('.slip', $('#slipGrid')).forEach((slip) => slip.classList.add('is-locked'));
    feedback.className = 'claim__feedback is-right';
    setText(feedback, 'Correct! Only this claim needs both objects.');
    Sound.play('correct');
    $('#btnDig').hidden = false;
    $('#btnClaimKey').hidden = false;
    const { pairing } = Sources;
    const [a, b] = pairing.ids.map((id) => sourceById(id).name);
    setText($('#infoPair'), `${a} + ${b}`);
    setText($('#infoTitle'), pairing.title);
    setText($('#infoBody'), pairing.note);
    $('#infoModal').hidden = false;
    $('#btnInfoClose').focus();
    announce(`Correct. ${pairing.title}. ${pairing.note}`);
  }

  function closeClaim() {
    $('#claimOverlay').hidden = true;
    $('#infoModal').hidden = true;
    DnD.clearSelection();
    if (Sources.solved) {
      $('#tableNote').hidden = false;
      $('#btnClaimTable').hidden = false;
    }
  }

  function claimKey() {
    unlockNext(0);
    leaveGallery(0);
  }

  /* ---- Gallery 2, screen 7: draw the Nile ---- */

  function pointSegmentDistance(p, a, b) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const lengthSq = dx * dx + dy * dy;
    const t = lengthSq ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lengthSq)) : 0;
    return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
  }

  function distanceToPath(point) {
    let best = Infinity;
    for (let i = 0; i < NILE_PATH.length - 1; i++) {
      best = Math.min(best, pointSegmentDistance(point, NILE_PATH[i], NILE_PATH[i + 1]));
    }
    return best;
  }

  function densify(points, step) {
    const out = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const count = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
      for (let k = 0; k < count; k++) out.push([a[0] + ((b[0] - a[0]) * k) / count, a[1] + ((b[1] - a[1]) * k) / count]);
    }
    if (points.length) out.push(points[points.length - 1]);
    return out;
  }

  /** Accepts a trace inside a tolerance band: it must follow the river and cover most of it. */
  function judgeNileTrace(strokes) {
    const drawn = [];
    strokes.forEach((stroke) => { if (stroke.length > 1) drawn.push(...densify(stroke, 6)); else drawn.push(...stroke); });
    if (drawn.length < 20) return false;
    const onRiver = drawn.filter((p) => distanceToPath(p) <= NILE_TOLERANCE * 1.2).length / drawn.length;
    const reference = densify(NILE_PATH, 8);
    const covered = reference.filter((r) => drawn.some((p) => Math.hypot(p[0] - r[0], p[1] - r[1]) <= NILE_TOLERANCE)).length / reference.length;
    return onRiver >= 0.8 && covered >= 0.75;
  }

  function initNile() {
    const canvas = $('#nileCanvas');
    const context = canvas.getContext('2d');
    const feedback = $('#nileFeedback');
    let strokes = [];
    let current = null;
    let attempts = 0;
    let showGuide = false;
    let answerShown = false;

    function showFeedback(text, good, hint = false) {
      feedback.hidden = false;
      feedback.classList.toggle('is-bad', !good && !hint);
      feedback.classList.toggle('is-hint', hint);
      setText($('p', feedback), text);
      announce(text);
    }

    function drawPath(path, colour, width, dashed) {
      context.beginPath();
      path.forEach((point, index) => (index ? context.lineTo(point[0], point[1]) : context.moveTo(point[0], point[1])));
      context.strokeStyle = colour;
      context.lineWidth = width;
      context.setLineDash(dashed ? [2, 12] : []);
      context.stroke();
      context.setLineDash([]);
    }

    function redraw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      strokes.forEach((stroke) => {
        [['#0d4a8f', 16], ['#2f8fe8', 10]].forEach(([colour, width]) => {
          context.strokeStyle = colour;
          context.lineWidth = width;
          context.beginPath();
          stroke.forEach((p, i) => (i ? context.lineTo(p[0], p[1]) : context.moveTo(p[0], p[1])));
          if (stroke.length === 1) context.lineTo(stroke[0][0] + 0.1, stroke[0][1]);
          context.stroke();
        });
      });
      if (showGuide) NILE_ANSWER_PATHS.forEach((path) => drawPath(path, '#168de2', 8, true));
      if (answerShown) NILE_ANSWER_PATHS.forEach((path) => drawPath(path, '#2f8fe8', 10, false));
    }

    function pointFrom(event) {
      const rect = canvas.getBoundingClientRect();
      return [(event.clientX - rect.left) * (canvas.width / rect.width), (event.clientY - rect.top) * (canvas.height / rect.height)];
    }

    canvas.addEventListener('pointerdown', (event) => {
      if (answerShown) return; // answer on screen: drawing is locked
      canvas.setPointerCapture(event.pointerId);
      current = [pointFrom(event)];
      strokes.push(current);
      redraw();
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!current) return;
      current.push(pointFrom(event));
      redraw();
    });
    ['pointerup', 'pointercancel'].forEach((name) => canvas.addEventListener(name, () => { current = null; }));

    function clearDrawing() {
      strokes = [];
      current = null;
      showGuide = false;
      if (answerShown) {
        answerShown = false;
        $('#btnNileAnswer').textContent = 'Show Answer';
        $('#btnNileNext').hidden = true;
      }
      redraw();
      feedback.hidden = true;
    }

    function reset() {
      attempts = 0;
      $('#btnNileAnswer').hidden = true;
      showGuide = false;
      answerShown = false;
      $('#btnNileAnswer').textContent = 'Show Answer';
      $('#btnNileNext').hidden = true;
      clearDrawing();
    }

    $('#btnNileClear').addEventListener('click', () => { Sound.play('tap'); clearDrawing(); });
    $('#btnNileHint').addEventListener('click', () => {
      showGuide = true;
      redraw();
      showFeedback('Follow the dotted line from the Nile Delta south through Egypt.', false, true);
      Sound.play('tap');
    });
    $('#btnNileSubmit').addEventListener('click', () => {
      if (!strokes.length) {
        showFeedback('The river bed is still empty. Trace the Nile before you submit.', false);
        Sound.play('wrong');
      } else if (judgeNileTrace(strokes)) {
        showFeedback('Correct! The Nile flows north into the Mediterranean, dividing Egypt into Lower Egypt in the north and Upper Egypt in the south.', true);
        Sound.play('correct');
        $('#btnNileNext').hidden = false;
      } else {
        attempts++;
        if (attempts >= 2) $('#btnNileAnswer').hidden = false; // answer unlocks after two wrong tries
        showFeedback('Incorrect – Try again!', false);
        Sound.play('wrong');
      }
    });
    $('#btnNileAnswer').addEventListener('click', () => {
      answerShown = !answerShown;
      $('#btnNileAnswer').textContent = answerShown ? 'Hide Answer' : 'Show Answer';
      redraw();
      if (answerShown) {
        showFeedback('The Nile flows north from its source in the south, through Egypt, into the Mediterranean Sea.', true);
        $('#btnNileNext').hidden = false;
      } else {
        feedback.hidden = true;
        $('#btnNileNext').hidden = true;
      }
      Sound.play('tap');
    });
    $('#btnNileNext').addEventListener('click', () => goTo('season'));
    enterHooks.nile = reset;
  }

  /* ---- Gallery 2, screen 8: the farming year ---- */

  function initSeason() {
    const wheel = $('#wheel');
    const hint = $('#wheelHint');
    const placard = $('#seasonPlacard');
    const note = $('#seasonNote');
    const named = new Set();
    let rotation = 0;
    let landed = 0;
    let dragState = null;

    function paintWheel() { wheel.style.transform = `rotate(${rotation}deg)`; }

    function land(index) {
      landed = index;
      const season = SEASONS[index];
      const image = $('#seasonImg');
      image.src = `assets/images/${season.img}`;
      image.alt = season.alt;
      wheel.setAttribute('aria-valuenow', String(index));
      wheel.setAttribute('aria-valuetext', season.img.includes('autumn') ? 'Blue segment' : (season.img.includes('winter') ? 'Brown segment' : 'Gold segment'));
      placard.classList.remove('is-wrong');
      if (named.has(index)) {
        placard.className = 'placard season-placard is-correct is-disabled';
        setText(placard, season.label);
        setText(hint, 'Already named – turn again');
        setText(note, season.note);
      } else {
        placard.className = 'placard season-placard';
        setText(placard, 'Drag here');
        setText(hint, 'Name this season');
        setText(note, '');
      }
      announce($('#wheelHint').textContent);
    }

    function snapTo(angle) {
      const index = ((Math.round(-angle / 120) % 3) + 3) % 3;
      rotation = -index * 120 + 360 * Math.round((angle + index * 120) / 360);
      wheel.classList.remove('is-turning');
      paintWheel();
      land(index);
    }

    function angleAt(event) {
      const rect = wheel.getBoundingClientRect();
      return (Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2)) * 180) / Math.PI;
    }

    wheel.addEventListener('pointerdown', (event) => {
      wheel.setPointerCapture(event.pointerId);
      wheel.classList.add('is-turning');
      dragState = { start: angleAt(event), base: rotation, last: angleAt(event) };
    });
    wheel.addEventListener('pointermove', (event) => {
      if (!dragState) return;
      const now = angleAt(event);
      let delta = now - dragState.last;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      dragState.last = now;
      rotation += delta;
      paintWheel();
    });
    const release = () => { if (!dragState) return; dragState = null; Sound.play('tap'); snapTo(rotation); };
    wheel.addEventListener('pointerup', release);
    wheel.addEventListener('pointercancel', release);
    wheel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); Sound.play('tap'); snapTo(rotation - 120); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); Sound.play('tap'); snapTo(rotation + 120); }
    });

    const tray = $('#seasonTray');
    function buildTray() {
      tray.innerHTML = '';
      SEASONS.forEach((season, index) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.dataset.key = String(index);
        chip.textContent = season.label;
        tray.appendChild(chip);
      });
    }

    DnD.enable($('#screen-season'), {
      itemSel: '#seasonTray .chip',
      targetSel: '#seasonPlacard',
      onDrop: (chip) => {
        if (named.has(landed)) {
          announce('That season is already named. Turn the wheel again.');
          return;
        }
        if (Number(chip.dataset.key) === landed) {
          named.add(landed);
          chip.classList.add('is-gone');
          placard.className = 'placard season-placard is-correct is-disabled';
          setText(placard, SEASONS[landed].label);
          setText(note, SEASONS[landed].note);
          setText(hint, 'Turn the wheel again');
          Sound.play('correct');
          announce(`Correct. ${SEASONS[landed].note}`);
          if (named.size === SEASONS.length) {
            setText(hint, 'All three seasons named');
            $('#btnSeasonNext').hidden = false;
          }
        } else {
          placard.className = 'placard season-placard is-wrong';
          setText(placard, 'Incorrect! Try again.');
          Sound.play('wrong');
          announce('Incorrect! Try again.');
          window.setTimeout(() => {
            if (!named.has(landed)) { placard.className = 'placard season-placard'; setText(placard, 'Drag here'); }
          }, 1300);
        }
      }
    });

    $('#btnSeasonNext').addEventListener('click', () => goTo('river'));
    enterHooks.season = () => {
      named.clear();
      rotation = 0;
      paintWheel();
      buildTray();
      $('#btnSeasonNext').hidden = true;
      land(0);
    };
  }

  /* ---- Generic "drag each label to its scene" activity ---- */

  /**
   * Builds scenes with placards plus a shuffled tray of labels.
   * config: { screen, scenesEl, trayEl, noteEl, items, extras, scene:{size,lefts}, placard:{top,width,height},
   *           wrongMessage, doneMessage, onComplete }
   */
  function setupMatchActivity(config) {
    const screen = $(`#screen-${config.screen}`);
    const scenes = $(config.scenesEl);
    const tray = $(config.trayEl);
    const note = $(config.noteEl);
    let solved = 0;

    function build() {
      solved = 0;
      scenes.innerHTML = '';
      tray.innerHTML = '';
      note.textContent = '';
      note.classList.remove('is-error');
      config.items.forEach((item, index) => {
        const { size, lefts } = config.scene;
        const { top, width, height } = config.placard;
        const slot = document.createElement('div');
        slot.className = 'scene-slot';
        slot.style.left = `${lefts[index] + size / 2 - width / 2}px`;
        slot.style.top = '0';
        slot.style.width = `${width}px`;
        slot.innerHTML = `<figure class="scene" style="left:${(width - size) / 2}px;width:${size}px;height:${size}px"><img src="assets/images/${item.img}" alt="${item.alt}"></figure>`;
        const placard = document.createElement('button');
        placard.type = 'button';
        placard.className = 'placard';
        placard.dataset.key = item.key;
        placard.style.top = `${top}px`;
        placard.style.height = `${height}px`;
        placard.textContent = 'Drag here';
        placard.setAttribute('aria-label', `Label drop area for scene ${index + 1}: ${item.alt}`);
        slot.appendChild(placard);
        scenes.appendChild(slot);
      });
      const labels = [...config.items.map((item) => ({ key: item.key, label: item.label })),
        ...(config.extras || []).map((label) => ({ key: `extra-${label}`, label }))];
      shuffle(labels).forEach((entry) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.dataset.key = entry.key;
        chip.textContent = entry.label;
        tray.appendChild(chip);
      });
    }

    DnD.enable(screen, {
      itemSel: `${config.trayEl} .chip`,
      targetSel: `${config.scenesEl} .placard`,
      onDrop: (chip, placard) => {
        const item = config.items.find((entry) => entry.key === placard.dataset.key);
        if (chip.dataset.key === placard.dataset.key) {
          chip.classList.add('is-gone');
          placard.classList.add('is-correct', 'is-disabled');
          placard.textContent = item.label;
          note.classList.remove('is-error');
          note.textContent = item.note;
          Sound.play('correct');
          solved += 1;
          if (solved === config.items.length) {
            note.textContent = config.doneMessage;
            if (config.onComplete) config.onComplete();
            announce(`${item.note} ${config.doneMessage}`);
          } else {
            announce(`Correct. ${item.note}`);
          }
        } else {
          restartAnimation(placard, 'is-wrong');
          note.classList.add('is-error');
          note.textContent = config.wrongMessage;
          Sound.play('wrong');
          announce(config.wrongMessage);
          window.setTimeout(() => placard.classList.remove('is-wrong'), 700);
        }
      }
    });

    enterHooks[config.screen] = () => {
      build();
      if (config.onEnter) config.onEnter();
    };
  }

  /* ---- Gallery 2, screen 9: what the river gave ---- */

  function initRiver() {
    setupMatchActivity({
      screen: 'river', scenesEl: '#riverScenes', trayEl: '#riverTray', noteEl: '#riverNote',
      items: RIVER,
      extras: ['Water lifted from the river', 'Mud dug out to make bricks'],
      scene: { size: 300, lefts: [185, 601, 1018, 1434] },
      placard: { top: 313, width: 401, height: 65 },
      wrongMessage: 'Incorrect! Try again. Look closely at where the water actually is.',
      doneMessage: 'Gallery complete! The river did not simply flood – Egyptians made it farm for them.',
      onEnter: () => { $('#btnRiverDone').hidden = true; },
      onComplete: () => { unlockNext(1); $('#btnRiverDone').hidden = false; }
    });
    $('#btnRiverDone').addEventListener('click', () => leaveGallery(1));
  }

  /* ---- Gallery 3, screen 11: the social pyramid ---- */

  function initPyramid() {
    const pyramid = $('#pyramid');
    const tray = $('#pyramidTray');
    const note = $('#pyramidNote');
    const curator = $('#curatorText');
    const widths = [314, 421, 484, 593];
    let placed = 0;

    function build() {
      placed = 0;
      pyramid.innerHTML = '';
      tray.innerHTML = '';
      note.textContent = '';
      note.classList.remove('is-error');
      setText(curator, 'Match a rank to reveal what that class did.');
      PYRAMID.forEach((tier, index) => {
        const row = document.createElement('div');
        row.className = 'tier';
        row.style.top = `${index * 101}px`;
        row.style.width = `${widths[index]}px`;
        row.style.left = `${916 - widths[index] / 2}px`;
        row.innerHTML = `<span class="tier__icon"><img src="assets/svg/${tier.img}" alt="${tier.alt}"></span>`;
        const placard = document.createElement('button');
        placard.type = 'button';
        placard.className = 'placard';
        placard.dataset.key = tier.key;
        placard.textContent = 'Drag here';
        placard.setAttribute('aria-label', `Tier ${index + 1} of 4 from the top: ${tier.alt}`);
        row.appendChild(placard);
        pyramid.appendChild(row);
      });
      shuffle(PYRAMID).forEach((tier) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.dataset.key = tier.key;
        chip.textContent = tier.label;
        tray.appendChild(chip);
      });
      $('#btnInsights').hidden = true;
      $('#btnPyramidNext').hidden = true;
      $('#insightModal').hidden = true;
    }

    DnD.enable($('#screen-pyramid'), {
      itemSel: '#pyramidTray .chip',
      targetSel: '#pyramid .placard',
      onDrop: (chip, placard) => {
        const tier = PYRAMID.find((entry) => entry.key === placard.dataset.key);
        if (chip.dataset.key === placard.dataset.key) {
          chip.classList.add('is-gone');
          placard.classList.add('is-correct', 'is-disabled');
          placard.textContent = tier.label;
          note.classList.remove('is-error');
          note.textContent = '';
          setText(curator, `${tier.label}: ${tier.note}`);
          Sound.play('correct');
          placed += 1;
          announce(`Correct. ${tier.label}. ${tier.note}`);
          if (placed === PYRAMID.length) {
            note.textContent = 'Every rank is in place. Open Insights to read about each class.';
            $('#btnInsights').hidden = false;
            $('#btnPyramidNext').hidden = false;
          }
        } else {
          restartAnimation(placard, 'is-wrong');
          note.classList.add('is-error');
          note.textContent = 'Incorrect – Try again! That rank belongs on a different tier.';
          Sound.play('wrong');
          announce(note.textContent);
          window.setTimeout(() => placard.classList.remove('is-wrong'), 700);
        }
      }
    });

    const list = $('#insightList');
    PYRAMID.forEach((tier) => {
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = tier.label;
      detail.textContent = tier.note;
      list.append(term, detail);
    });
    $('#btnInsights').addEventListener('click', () => { $('#insightModal').hidden = false; $('#btnInsightClose').focus(); });
    $('#btnInsightClose').addEventListener('click', () => { $('#insightModal').hidden = true; $('#btnInsights').focus(); });
    $('#btnPyramidNext').addEventListener('click', () => { state.portraitRound = 0; goTo('portrait'); });
    enterHooks.pyramid = build;
  }

  /* ---- Gallery 3, screens 12 and 13: picture restoration ---- */

  function initPortrait() {
    const grid = $('#puzzleGrid');
    const caption = $('#puzzleCaption');
    const card = $('.question-card');
    let order = [];
    let picked = null;
    let solved = false;
    let puzzle = PUZZLES[0];

    function tilesInPlace() { return order.filter((tile, position) => tile === position).length; }

    function render() {
      grid.innerHTML = '';
      order.forEach((tile, position) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tile';
        button.style.backgroundImage = `url("assets/images/${puzzle.img}")`;
        button.style.backgroundPosition = `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 100}%`;
        button.setAttribute('aria-label', `Tile at position ${position + 1} of 6${picked === position ? ', selected' : ''}`);
        if (picked === position) button.classList.add('is-selected');
        button.addEventListener('click', () => onTile(position));
        grid.appendChild(button);
      });
      setText(caption, solved ? puzzle.doneCaption : `Tiles: ${tilesInPlace()}/6 in place`);
    }

    function onTile(position) {
      if (solved) return;
      if (picked === null) { picked = position; Sound.play('tap'); render(); $$('.tile', grid)[position].focus(); return; }
      if (picked !== position) {
        [order[picked], order[position]] = [order[position], order[picked]];
        Sound.play('tap');
      }
      const focusAt = position;
      picked = null;
      if (tilesInPlace() === 6) {
        solved = true;
        grid.classList.add('is-solved');
        render();
        Sound.play('correct');
        announce(`${puzzle.doneCaption}. Now answer the question.`);
        showQuestion();
        return;
      }
      render();
      $$('.tile', grid)[focusAt].focus();
    }

    function showQuestion() {
      card.classList.add('is-open');
      setText($('#questionText'), puzzle.question);
      const list = $('#optionList');
      list.innerHTML = '';
      puzzle.options.forEach((text, index) => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'option';
        option.textContent = text;
        option.addEventListener('click', () => onOption(option, index === puzzle.answer));
        list.appendChild(option);
      });
    }

    function onOption(option, isRight) {
      if (option.classList.contains('is-locked')) return;
      const feedback = $('#questionFeedback');
      if (!isRight) {
        restartAnimation(option, 'is-wrong');
        feedback.classList.add('is-wrong');
        setText(feedback, 'Incorrect! Try again.');
        Sound.play('wrong');
        announce('Incorrect! Try again.');
        window.setTimeout(() => option.classList.remove('is-wrong'), 900);
        return;
      }
      $$('.option', $('#optionList')).forEach((other) => other.classList.add('is-locked'));
      option.classList.add('is-right');
      feedback.classList.remove('is-wrong');
      setText(feedback, puzzle.explanation);
      Sound.play('correct');
      announce(`Correct. ${puzzle.explanation}`);
      const next = $('#btnPortraitNext');
      setText(next, puzzle.next);
      next.hidden = false;
      if (state.portraitRound === PUZZLES.length - 1) unlockNext(2);
    }

    function start() {
      puzzle = PUZZLES[state.portraitRound];
      solved = false;
      picked = null;
      grid.classList.remove('is-solved');
      card.classList.remove('is-open');
      setText($('#questionFeedback'), '');
      $('#questionFeedback').classList.remove('is-wrong');
      $('#optionList').innerHTML = '';
      setText($('#questionText'), '');
      $('#btnPortraitNext').hidden = true;
      setText($('#title-portrait'), puzzle.heading);
      // Shuffle until at most two tiles start in the right place and the picture is not already solved.
      do { order = shuffle([0, 1, 2, 3, 4, 5]); } while (tilesInPlace() > 1);
      render();
    }

    $('#btnPortraitNext').addEventListener('click', () => {
      if (state.portraitRound < PUZZLES.length - 1) { state.portraitRound += 1; start(); }
      else leaveGallery(2);
    });
    enterHooks.portrait = start;
  }

  /* ---- Gallery 4, screens 15 and 16 ---- */

  function initLeisureAndProcession() {
    setupMatchActivity({
      screen: 'leisure', scenesEl: '#leisureScenes', trayEl: '#leisureTray', noteEl: '#leisureNote',
      items: LEISURE, extras: LEISURE_DISTRACTORS,
      scene: { size: 273, lefts: [206, 515, 823, 1131, 1439] },
      placard: { top: 287, width: 260, height: 80 },
      wrongMessage: 'Incorrect – try again. Look at what the figures are doing.',
      doneMessage: 'All five pastimes named. Now step into a festival procession.',
      onEnter: () => { $('#btnLeisureNext').hidden = true; },
      onComplete: () => { $('#btnLeisureNext').hidden = false; }
    });
    $('#btnLeisureNext').addEventListener('click', () => goTo('procession'));

    setupMatchActivity({
      screen: 'procession', scenesEl: '#processionScenes', trayEl: '#processionTray', noteEl: '#processionNote',
      items: PROCESSION,
      scene: { size: 232, lefts: [191, 453, 715, 977, 1239, 1501] },
      placard: { top: 286, width: 232, height: 80 },
      wrongMessage: 'Incorrect – try again. Look closely at who is doing what.',
      doneMessage: 'The whole procession is named. Now stand still and let it pass.',
      onEnter: () => { $('#btnProcessionNext').hidden = true; },
      onComplete: () => { $('#btnProcessionNext').hidden = false; }
    });
    $('#btnProcessionNext').addEventListener('click', () => goTo('echoes'));
  }

  /* ---- Gallery 4, screen 17: the Hall of Echoes ---- */

  function initEchoes() {
    const view = $('#processionView');
    const chips = $$('#soundChips li');
    const begin = $('#btnBegin');
    const finish = $('#btnFinish');
    const closing = $('#closingLine');
    const cues = { sistrum: 0, drums: 6, voices: 11, statue: 15 };
    const DURATION = 24;
    let timers = [];
    const dance = window.lottie ? window.lottie.loadAnimation({
      container: $('#processionLottie'), renderer: 'svg', loop: false, autoplay: false,
      path: 'assets/json/dance.json',
      rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
    }) : null;

    function reset() {
      if (dance) dance.goToAndStop(0, true);
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      Sound.stopProcession();
      view.classList.remove('is-playing');
      chips.forEach((chip) => chip.classList.remove('is-on'));
      closing.hidden = true;
      finish.hidden = true;
      begin.hidden = false;
      begin.disabled = false;
    }

    begin.addEventListener('click', () => {
      begin.hidden = true;
      Sound.unlock();
      view.classList.add('is-playing');
      if (dance) dance.goToAndPlay(0, true);
      Sound.startProcession(DURATION);
      chips.forEach((chip) => {
        timers.push(window.setTimeout(() => chip.classList.add('is-on'), cues[chip.dataset.chip] * 1000));
      });
      announce('The procession begins. First the sistrum, then drums, then the voices of the crowd.');
      timers.push(window.setTimeout(() => {
        if (dance) dance.pause();
        closing.hidden = false;
        finish.hidden = false;
        unlockNext(3);
        announce('The statue was carried out to the people, not kept inside the temple. Why?');
      }, DURATION * 1000));
    });
    finish.addEventListener('click', () => leaveGallery(3));
    enterHooks.echoes = reset;
    leaveHooks.echoes = reset;
  }

  /* ---- Screen 18: end ---- */

  function initEnd() {
    $('#btnExploreAgain').addEventListener('click', () => {
      state.completedGalleries.clear();
      $('#screen-title').classList.remove('is-zooming');
      goTo('title');
    });
    enterHooks.end = () => Sound.play('key');
  }

  /* ---- Hub entry and global controls ---- */

  function initGlobal() {
    enterHooks.hub = () => {
      renderHub();
      announce('Keeper’s Hall. All galleries are open. Choose any gallery to begin.');
    };

    const toggle = $('#soundToggle');
    toggle.addEventListener('click', () => {
      const nowMuted = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-pressed', String(!nowMuted));
      toggle.setAttribute('aria-label', nowMuted ? 'Sound off. Tap to unmute.' : 'Sound on. Tap to mute.');
      Sound.setMuted(nowMuted);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (!$('#infoModal').hidden) { $('#infoModal').hidden = true; return; }
      if (!$('#insightModal').hidden) { $('#insightModal').hidden = true; return; }
      if (!$('#claimOverlay').hidden) closeClaim();
    });

    window.addEventListener('resize', fitStage);
    window.addEventListener('orientationchange', fitStage);
  }

  /* ---- Start ---- */

  buildGalleryFrames();
  initIntro();
  initSources();
  initNile();
  initSeason();
  initRiver();
  initPyramid();
  initPortrait();
  initLeisureAndProcession();
  initEchoes();
  initEnd();
  initGlobal();
  /* ---- Dev helper: run `dev.help()` in the browser console. Remove before shipping. ---- */
  window.dev = {
    screens: () => $$('.screen').map((s) => s.dataset.screen),
    go(id) { goTo(id); },
    unlockAll() { goTo('hub'); },
    next() {
      const ids = this.screens();
      this.go(ids[Math.min(ids.indexOf(state.current) + 1, ids.length - 1)]);
    },
    help() {
      console.log([
        'dev.go("echoes")  jump to a screen (unlocks all galleries)',
        'dev.next()        go to the next screen',
        'dev.unlockAll()   unlock every gallery and open the hub',
        'dev.screens()     list screen ids: ' + this.screens().join(', ')
      ].join('\n'));
    }
  };

  fitStage();
  goTo('title');
}());
