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
      desc: 'Steep slopes and varying temperatures influence farming in hilly regions. Crops suited to cooler conditions can be grown, while water may be channelled downhill from streams or springs using gravity.',
      crop: 'tea',
      results: {
        bamboo: { useful: 85, evap: 8, runoff: 7, text: 'Bamboo channels carry spring water downhill using gravity and direct it towards plant roots, helping reduce water loss.' },
        canal: { useful: 40, evap: 10, runoff: 50, text: 'Canal water released onto a steep slope may flow downhill quickly, causing runoff before enough water reaches the plant roots.' },
        drip: { useful: 65, evap: 20, runoff: 15, text: 'Drip irrigation can conserve water on slopes, but poorly placed or unregulated emitters may distribute water unevenly. Water loss can also occur if the system is not designed for the slope.' },
        sprinkler: { useful: 45, evap: 40, runoff: 15, text: 'Wind can carry sprinkler droplets away from the target area, while hot, dry conditions can increase evaporation. On steep slopes, excess application may also cause runoff.' },
      },
    },
    arid: {
      name: 'Arid terrain',
      img: 'assets/images/terrain-arid.svg',
      desc: 'Hot, dry conditions and scarce rainfall make water conservation essential. Drought-tolerant crops and irrigation methods that deliver water directly to plant roots help reduce water loss.',
      crop: 'bajra',
      results: {
        drip: { useful: 88, evap: 8, runoff: 4, text: 'Drip irrigation delivers water near plant roots, reducing evaporation and surface runoff when properly managed.' },
        canal: { useful: 35, evap: 55, runoff: 10, text: 'Open canals expose water to the hot, dry air, increasing evaporation. Water may also seep into the sandy soil before reaching the field.' },
        sprinkler: { useful: 30, evap: 60, runoff: 10, text: 'In hot, dry desert air, fine sprinkler droplets can evaporate before reaching the ground, reducing the amount of water available to plants.' },
        bamboo: { useful: 55, evap: 35, runoff: 10, text: 'Bamboo drip irrigation is traditionally associated with spring-fed hilly regions. In an arid desert, the lack of a suitable spring-fed water source and distribution system may make this method less practical.' },
      },
    },
    plateau: {
      name: 'Semi-Arid Plateau',
      img: 'assets/images/terrain-semi-arid-plateau.svg',
      desc: 'Elevated land, uneven terrain and limited or seasonal rainfall make water management important. Irrigation methods that distribute water efficiently across fields can support crops suited to these conditions.',
      crop: 'groundnut',
      results: {
        sprinkler: { useful: 82, evap: 12, runoff: 6, text: 'Sprinklers distribute water across a field, making them useful for many plateau crops. Wind and high temperatures can increase evaporation losses.' },
        canal: { useful: 45, evap: 25, runoff: 30, text: 'Applying too much canal water to a field with uneven ground or slowly draining soil can cause waterlogging and runoff.' },
        drip: { useful: 68, evap: 12, runoff: 20, text: 'Drip irrigation can conserve water effectively, but poorly positioned emitters or unsuitable system design may cause uneven water distribution and runoff in some areas.' },
        bamboo: { useful: 40, evap: 30, runoff: 30, text: 'Bamboo drip systems are traditionally suited to particular spring-fed hilly regions. Without a suitable water source and a properly designed gravity-fed channel system, they may not distribute water reliably across a plateau field.' },
      },
    },
    plains: {
      name: 'Alluvial Plains',
      img: 'assets/images/terrain-alluvial-plains.svg',
      desc: 'Flat or gently sloping land with fertile, river-deposited soil supports a variety of crops. Where sufficient water is available, irrigation methods such as canals can supply water to fields.',
      crop: 'rice',
      results: {
        canal: { useful: 84, evap: 10, runoff: 6, text: 'Canals can carry water across flat or gently sloping alluvial plains. Some water may be lost through seepage, evaporation or runoff, depending on the system and field conditions.' },
        drip: { useful: 70, evap: 12, runoff: 18, text: 'Drip irrigation can work well on flat plains too, but it requires a network of pipes and emitters. For a large field with suitable canal access, canal irrigation may be a practical way to distribute water.' },
        sprinkler: { useful: 62, evap: 28, runoff: 10, text: 'Sprinklers can irrigate plains effectively, but water may evaporate during spraying, especially in hot, dry or windy conditions. Canal irrigation can be a suitable alternative where water is available and fields are appropriately laid out.' },
        bamboo: { useful: 50, evap: 15, runoff: 35, text: 'Traditional bamboo drip systems are associated with spring-fed hilly regions. On flat plains, a suitable gravity-fed source and channel arrangement may be less practical than a canal network designed to supply the fields.' },
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
