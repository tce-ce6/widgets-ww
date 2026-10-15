'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     CONTENT (from the en_geo_07_wg189 data tables)
     ========================================================================== */

  const CROPS = {
    tea: 'Tea',
    bajra: 'Bajra',
    groundnut: 'Groundnut',
    rice: 'Rice',
  };

  const IRRIGATIONS = {
    drip: 'Drip',
    canal: 'Canal',
    bamboo: 'Bamboo Drip',
    sprinkler: 'Sprinkler',
  };

  // Card positions on the stage, as in layout.svg.
  const CROP_SLOTS = [
    { left: 321, top: 430 },
    { left: 321, top: 623 },
  ];
  const IRRIGATION_SLOTS = {
    drip: { left: 822, top: 431 },
    canal: { left: 1235, top: 431 },
    bamboo: { left: 823, top: 623 },
    sprinkler: { left: 1234, top: 625 },
  };

  // useful / evaporation / runoff are percentages of the water supplied.
  const TERRAINS = {
    mountain: {
      name: 'Mountain/Hilly',
      img: 'assets/images/terrain-mountain.svg',
      desc: 'Steep slopes with natural springs and a cool, humid climate make this terrain ideal for crops that thrive on hills with a gentle gravity-fed water supply.',
      crop: 'tea',
      results: {
        bamboo: { useful: 85, evap: 8, runoff: 7, text: 'Bamboo pipes carry the spring water straight to the roots along the slope, so minimum water escape through surface runoff or evaporate.' },
        canal: { useful: 40, evap: 10, runoff: 50, text: 'Canal water floods across the slope and most of it simply run downhill before it even reach the roots.' },
        drip: { useful: 65, evap: 20, runoff: 15, text: "Drip conserves water well, but without channelling along the slope's contours, some still trickle downhill or evaporate in the open tubing." },
        sprinkler: { useful: 45, evap: 40, runoff: 15, text: 'Sprayed droplets drift in the hill breeze and evaporate before reaching the ground, with the rest sliding off the slope.' },
      },
    },
    arid: {
      name: 'Arid terrain',
      img: 'assets/images/terrain-arid.svg',
      desc: 'Hot, dry conditions with scarce rainfall require drought-tolerant crops and careful use of every drop of water.',
      crop: 'bajra',
      results: {
        drip: { useful: 88, evap: 8, runoff: 4, text: 'Drip deliver water directly to the roots, so minimum water escape through surface runoff or evaporate.' },
        canal: { useful: 35, evap: 55, runoff: 10, text: 'Open canal water remain exposed to hot sandy soil and evaporate rapidly before it could get soaked in.' },
        sprinkler: { useful: 30, evap: 60, runoff: 10, text: 'Sprayed droplets evaporate in the dry desert air before they even touched the ground.' },
        bamboo: { useful: 55, evap: 35, runoff: 10, text: 'Bamboo drip works beautifully on hill springs, but in open desert heat, bamboos get dried up faster because of high atmospheric temperature. Bamboos are not the native floral species in desert/arid climatic region.' },
      },
    },
    plateau: {
      name: 'Semi-Arid Plateau',
      img: 'assets/images/terrain-semi-arid-plateau.svg',
      desc: 'Elevated land with moderate rainfall and uneven, rocky soil benefits from crops that need evenly distributed water over a wide area.',
      crop: 'groundnut',
      results: {
        sprinkler: { useful: 82, evap: 12, runoff: 6, text: 'Even spray coverage suits the open, level plateau field perfectly with barely any runoff.' },
        canal: { useful: 45, evap: 25, runoff: 30, text: "Canal flooding on the plateau's black soil cause pooling and runoff faster than the ground could absorb." },
        drip: { useful: 68, evap: 12, runoff: 20, text: 'Drip conserve water reasonably well, but the uneven plateau ground meant some emitters miss the root zone, losing flow to runoff.' },
        bamboo: { useful: 40, evap: 30, runoff: 30, text: 'Without hill springs to draw from, bamboo drip could not maintain steady flow across the open plateau. Water gets lost to both evaporation and runoff.' },
      },
    },
    plains: {
      name: 'Alluvial Plains',
      img: 'assets/images/terrain-alluvial-plains.svg',
      desc: 'Flat, fertile land near rivers with abundant water supports crops that require large amounts of water during their growth.',
      crop: 'rice',
      results: {
        canal: { useful: 84, evap: 10, runoff: 6, text: 'Flat, water-retentive alluvial soil let canal water spread evenly across the field with barely any runoff.' },
        drip: { useful: 70, evap: 12, runoff: 18, text: 'Drip works here too, but on flat absorbent plains it uses more effort than needed. Water pool unevenly and drain into unused furrows.' },
        sprinkler: { useful: 62, evap: 28, runoff: 10, text: 'Sprinklers lost a good share of water to evaporation under the open sun on the plains. Water pool unevenly and drain into unused furrows.' },
        bamboo: { useful: 50, evap: 15, runoff: 35, text: 'Bamboo drip is built for hill springs with natural slope on a flat plain it could not direct flow, and much of it ran off untouched.' },
      },
    },
  };

  // Efficiency (useful water %) -> number of glowing stars.
  const starsFor = (efficiency) => {
    if (efficiency >= 80) return 5;
    if (efficiency >= 65) return 4;
    if (efficiency >= 50) return 3;
    if (efficiency >= 35) return 2;
    return 1;
  };

  const STAR_PATH =
    'M20 1.5l5.6 11.6 12.7 1.7-9.3 8.9 2.3 12.6L20 30.2 8.7 36.3 11 23.7 1.7 14.8l12.7-1.7z';

  /* ==========================================================================
     DOM + STAGE SCALING
     ========================================================================== */

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const screens = {
    home: $('screen-home'),
    activity: $('screen-activity'),
    result: $('screen-result'),
  };
  const cropCards = $('cropCards');
  const irrigationCards = $('irrigationCards');
  const cropWarning = $('cropWarning');
  const checkBtn = $('checkBtn');
  const insights = $('insights');

  const fitStage = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / 1920, vh / 1080);
    const x = (vw - 1920 * scale) / 2;
    const y = (vh - 1080 * scale) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };

  fitStage();
  window.addEventListener('resize', fitStage);

  /* ==========================================================================
     STATE
     ========================================================================== */

  const state = {
    terrainKey: null,
    cropOk: false,
    irrigation: null,
    queue: [], // terrains still to come, shuffled; refilled when empty
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Random terrain, never the same one twice in a row.
  const nextTerrainKey = () => {
    if (!state.queue.length) {
      state.queue = shuffle(Object.keys(TERRAINS));
      if (state.queue[0] === state.terrainKey) state.queue.push(state.queue.shift());
    }
    return state.queue.shift();
  };

  const showScreen = (name) => {
    Object.keys(screens).forEach((k) => screens[k].classList.toggle('is-active', k === name));
    $('stageDim').hidden = name === 'home';
  };

  /* ==========================================================================
     ACTIVITY SCREEN
     ========================================================================== */

  const makeCard = (kind, key, label, pos) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'option-card';
    card.dataset.key = key;
    card.style.left = `${pos.left}px`;
    card.style.top = `${pos.top}px`;
    card.innerHTML = `<img src="assets/images/card-${key}.svg" alt=""><span class="option-card__label"></span>`;
    card.querySelector('.option-card__label').textContent = label;
    card.setAttribute('aria-label', `${kind}: ${label}`);
    return card;
  };

  const updateCheck = () => {
    checkBtn.disabled = !(state.cropOk && state.irrigation);
  };

  // Irrigation methods stay disabled until the suitable crop is chosen.
  const lockIrrigation = (locked) => {
    irrigationCards.querySelectorAll('.option-card').forEach((c) => { c.disabled = locked; });
  };

  const selectIrrigation = (key) => {
    if (key && !state.cropOk) return;
    state.irrigation = key;
    irrigationCards.querySelectorAll('.option-card').forEach((c) => {
      const on = c.dataset.key === key;
      c.classList.toggle('is-selected', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    updateCheck();
  };

  const selectCrop = (card) => {
    const terrain = TERRAINS[state.terrainKey];
    const ok = card.dataset.key === terrain.crop;
    cropCards.querySelectorAll('.option-card').forEach((c) => {
      c.classList.remove('is-correct', 'is-wrong');
      c.setAttribute('aria-pressed', 'false');
    });
    card.classList.add(ok ? 'is-correct' : 'is-wrong');
    card.setAttribute('aria-pressed', 'true');
    cropWarning.hidden = ok;

    state.cropOk = ok;
    lockIrrigation(!ok);
    if (!ok) selectIrrigation(null);
    updateCheck();
  };

  const buildActivity = () => {
    const terrain = TERRAINS[state.terrainKey];
    $('terrainImg').src = terrain.img;
    $('terrainImg').alt = terrain.name;
    $('terrainName').textContent = `Terrain: ${terrain.name}`;
    $('terrainDesc').textContent = terrain.desc;

    // the suitable crop + one crop from another terrain, in random order
    const others = Object.keys(CROPS).filter((k) => k !== terrain.crop);
    const distractor = others[Math.floor(Math.random() * others.length)];
    const crops = shuffle([terrain.crop, distractor]);

    cropCards.innerHTML = '';
    crops.forEach((key, i) => {
      const card = makeCard('Crop', key, CROPS[key], CROP_SLOTS[i]);
      card.addEventListener('click', () => selectCrop(card));
      cropCards.appendChild(card);
    });

    irrigationCards.innerHTML = '';
    Object.keys(IRRIGATIONS).forEach((key) => {
      const card = makeCard('Irrigation', key, IRRIGATIONS[key], IRRIGATION_SLOTS[key]);
      card.addEventListener('click', () => selectIrrigation(key));
      irrigationCards.appendChild(card);
    });

    state.cropOk = false;
    state.irrigation = null;
    lockIrrigation(true);
    cropWarning.hidden = true;
    updateCheck();
  };

  const startTerrain = (key) => {
    state.terrainKey = key || nextTerrainKey();
    buildActivity();
    showScreen('activity');
  };

  /* ==========================================================================
     RESULT SCREEN
     ========================================================================== */

  const renderStars = (el, count) => {
    el.innerHTML = '';
    el.setAttribute('aria-label', `${count} out of 5 stars`);
    for (let i = 0; i < 5; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 40 38');
      svg.setAttribute('aria-hidden', 'true');
      if (i < count) svg.classList.add('is-on');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', STAR_PATH);
      svg.appendChild(path);
      el.appendChild(svg);
    }
  };

  let countTimer = null;

  const countUp = (el, target) => {
    clearInterval(countTimer);
    let value = 0;
    el.textContent = '0%';
    countTimer = setInterval(() => {
      value = Math.min(target, value + Math.max(1, Math.round((target - value) / 6)));
      el.textContent = `${value}%`;
      if (value >= target) clearInterval(countTimer);
    }, 40);
  };

  const showResult = () => {
    const result = TERRAINS[state.terrainKey].results[state.irrigation];
    const segs = { segUseful: result.useful, segEvap: result.evap, segRunoff: result.runoff };

    // start the bar empty, then let the CSS transition grow each colour
    Object.keys(segs).forEach((id) => { $(id).style.width = '0'; });
    $('waterBar').setAttribute(
      'aria-label',
      `Water available for crops ${result.useful}%, water getting evaporated ${result.evap}%, runoff water ${result.runoff}%`,
    );
    showScreen('result');
    void $('waterBar').offsetWidth;
    Object.keys(segs).forEach((id) => { $(id).style.width = `${segs[id]}%`; });

    const stars = starsFor(result.useful);
    renderStars($('starsWater'), stars);
    renderStars($('starsYield'), stars);
    countUp($('efficiencyValue'), result.useful);
    $('feedbackText').textContent = result.text;
  };

  /* ==========================================================================
     INSIGHTS
     ========================================================================== */

  let insightsOpener = null;

  const openInsights = (opener) => {
    insightsOpener = opener;
    insights.hidden = false;
    $('insightsClose').focus();
  };

  const closeInsights = () => {
    insights.hidden = true;
    if (insightsOpener) insightsOpener.focus();
  };

  /* ==========================================================================
     TEST HELPER
     Jumps straight to the result screen, from the console:
       goToResult()                       random terrain, its best method
       goToResult('arid')                 arid terrain, its best method
       goToResult('mountain', 'canal')    a specific combination
     Terrains: mountain, arid, plateau, plains
     Methods:  drip, canal, bamboo, sprinkler
     ========================================================================== */

  window.goToResult = (terrainKey, irrigationKey) => {
    const tKey = terrainKey || Object.keys(TERRAINS)[Math.floor(Math.random() * 4)];
    if (!TERRAINS[tKey]) {
      console.warn(`goToResult: unknown terrain "${tKey}". Use ${Object.keys(TERRAINS).join(', ')}.`);
      return;
    }
    const results = TERRAINS[tKey].results;
    const iKey = irrigationKey || Object.keys(results).reduce((a, b) => (results[a].useful >= results[b].useful ? a : b));
    if (!results[iKey]) {
      console.warn(`goToResult: unknown method "${iKey}". Use ${Object.keys(IRRIGATIONS).join(', ')}.`);
      return;
    }
    insights.hidden = true;
    state.terrainKey = tKey;
    buildActivity();
    const cropCard = cropCards.querySelector(`[data-key="${TERRAINS[tKey].crop}"]`);
    selectCrop(cropCard);
    selectIrrigation(iKey);
    showResult();
    console.log(`Result screen: ${tKey} + ${iKey} (${results[iKey].useful}%)`);
  };

  /* ==========================================================================
     WIRING
     ========================================================================== */

  $('enterBtn').addEventListener('click', () => startTerrain());

  checkBtn.addEventListener('click', () => {
    if (state.cropOk && state.irrigation) showResult();
  });

  // Same terrain, the correct crop stays chosen; pick another method.
  $('retryBtn').addEventListener('click', () => {
    selectIrrigation(null);
    showScreen('activity');
  });

  $('nextTerrainBtn').addEventListener('click', () => startTerrain());

  document.querySelectorAll('[data-insights]').forEach((btn) => {
    btn.addEventListener('click', () => openInsights(btn));
  });
  $('insightsClose').addEventListener('click', closeInsights);
  insights.addEventListener('click', (e) => {
    if (e.target === insights) closeInsights();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !insights.hidden) closeInsights();
  });
});
